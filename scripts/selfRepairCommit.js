const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync, spawnSync } = require('child_process');

const root = process.env.NEXUS_REPAIR_ROOT
  ? path.resolve(process.env.NEXUS_REPAIR_ROOT)
  : path.resolve(__dirname, '..');
const args = new Set(process.argv.slice(2));
const apply = args.has('--apply');
const trustedStatic = args.has('--trusted-static');
const writeReport = !args.has('--no-report');
const reportPath = path.join(root, '.nexus-self-repair-report.json');
const regressionLogPath = path.join(root, 'repair-regression-learning.json');

function run(command, commandArgs, options = {}) {
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    encoding: 'utf8',
    shell: false,
    ...options,
  });
  return {
    command: [command, ...commandArgs].join(' '),
    status: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
}

function trackedFiles() {
  return execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { cwd: root, encoding: 'utf8' })
    .split('\0')
    .filter(Boolean)
    .filter((file) => file !== 'repository-file-manifest.json')
    .sort();
}

function canonicalBuffer(file) {
  const content = fs.readFileSync(path.join(root, file));
  if (content.includes(0)) return content;
  const text = content.toString('utf8');
  if (!Buffer.from(text, 'utf8').equals(content)) return content;
  return Buffer.from(text.replace(/\r\n/g, '\n'), 'utf8');
}

function fileRecord(file) {
  const content = canonicalBuffer(file);
  return {
    path: file.replace(/\\/g, '/'),
    type: path.extname(file).toLowerCase() || '[no extension]',
    size: content.length,
    sha256: crypto.createHash('sha256').update(content).digest('hex'),
  };
}

function workflowFiles() {
  return trackedFiles().filter((file) => file.startsWith('.github/workflows/') && /\.ya?ml$/i.test(file));
}

function hardenWorkflow(file) {
  const absolute = path.join(root, file);
  let text = fs.readFileSync(absolute, 'utf8');
  const original = text;
  const findings = [];

  if (/ref:\s*\$\{\{\s*matrix\.ref\s*\}\}/.test(text)) {
    findings.push('dynamic matrix.ref checkout can execute privileged untrusted code');
    if (apply) text = text.replace(/ref:\s*\$\{\{\s*matrix\.ref\s*\}\}/g, 'ref: main');
  }

  if (/workflow_dispatch:|schedule:/m.test(text)) {
    text = text.replace(/(^\s*- uses:\s*actions\/checkout@[^\n]+\n\s+with:\n)(?!\s+persist-credentials:)/gm, (match) => {
      if (!apply) return match;
      const indent = match.match(/\n(\s+)with:/)?.[1] || '        ';
      return `${match}${indent}  persist-credentials: false\n`;
    });
  }

  if (apply && text !== original) fs.writeFileSync(absolute, text);
  return { file, changed: text !== original, findings };
}

function safeStaticInventoryRefresh() {
  const manifestPath = path.join(root, 'repository-file-manifest.json');
  if (!fs.existsSync(manifestPath)) throw new Error('repository-file-manifest.json is missing.');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const previous = new Map((manifest.files || []).map((item) => [item.path, item]));
  const files = trackedFiles();
  const current = files.map(fileRecord);
  const currentMap = new Map(current.map((item) => [item.path, item]));

  const changedJs = current.filter((item) => {
    if (!/\.(?:[cm]?js|jsx|ts|tsx)$/i.test(item.path)) return false;
    const before = previous.get(item.path);
    return !before || before.sha256 !== item.sha256;
  });

  const relativeReferences = (text) => {
    const references = new Set();
    const pattern = /\b(?:require\s*\(|from\s+|import\s*\()\s*['"]([.]{1,2}\/[^'"]+)['"]/g;
    let match;
    while ((match = pattern.exec(text)) !== null) references.add(match[1]);
    return [...references].sort();
  };
  const manifestBaseline = execFileSync(
    'git',
    ['log', '-1', '--format=%H', '--', 'repository-file-manifest.json'],
    { cwd: root, encoding: 'utf8' },
  ).trim();

  const tracked = new Set(files.map((file) => file.replace(/\\/g, '/')));
  const extensions = ['', '.js', '.jsx', '.ts', '.tsx', '.cjs', '.mjs', '.json', '.css', '.html'];
  const unresolvedReferences = [];
  for (const item of changedJs) {
    const currentText = fs.readFileSync(path.join(root, item.path), 'utf8');
    const currentReferences = relativeReferences(currentText);
    for (const reference of currentReferences) {
      const base = path.posix.normalize(path.posix.join(path.posix.dirname(item.path), reference));
      const resolved = extensions.some((extension) => tracked.has(`${base}${extension}`))
        || extensions.slice(1).some((extension) => tracked.has(`${base}/index${extension}`));
      if (!resolved) unresolvedReferences.push(`${item.path} -> ${reference}`);
    }
  }
  if (unresolvedReferences.length) {
    throw new Error(`Static inventory refresh refused because changed source files have unresolved relative references: ${unresolvedReferences.join(', ')}.`);
  }

  const removedJs = [...previous.keys()].filter((file) => /\.(?:c|m)?js$/i.test(file) && !currentMap.has(file));
  if (removedJs.length) throw new Error(`Static inventory refresh refused because JavaScript files were removed: ${removedJs.join(', ')}`);

  const generated = run('node', ['scripts/verifyRepositoryInventory.js', '--write']);
  if (generated.status !== 0) {
    throw new Error(`Static inventory generator failed after reference validation: ${(generated.stderr || generated.stdout || 'unknown error').trim()}`);
  }
}

function inventoryRepairNeeded(result) {
  return result.status !== 0 && /Repository inventory is stale|inventory count mismatch|repository-file-manifest\.json is missing/i.test(`${result.stdout}\n${result.stderr}`);
}

function priorRepairRegressions() {
  if (!fs.existsSync(regressionLogPath)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(regressionLogPath, 'utf8'));
    return Array.isArray(parsed.records) ? parsed.records : [];
  } catch (error) {
    throw new Error(`Repair regression learning log is unreadable: ${error.message}`);
  }
}

const priorRegressions = priorRepairRegressions();

const report = {
  schemaVersion: 2,
  mode: apply ? 'apply' : 'check',
  trustedStatic,
  head: run('git', ['rev-parse', 'HEAD']).stdout.trim(),
  priorRepairRegressionCount: priorRegressions.length,
  priorRepairRegressionIds: priorRegressions.map((item) => item.regressionId).filter(Boolean),
  workflowRepairs: [],
  checks: [],
  repairs: [],
  unresolved: [],
};

for (const file of workflowFiles()) {
  const item = hardenWorkflow(file);
  if (item.findings.length || item.changed) report.workflowRepairs.push(item);
  if (item.changed) report.repairs.push(`Hardened ${file}`);
}

if (trustedStatic) {
  if (apply) {
    try {
      safeStaticInventoryRefresh();
      report.repairs.push('Refreshed repository inventory using the trusted static generator.');
    } catch (error) {
      report.unresolved.push(error.message);
    }
  }
} else {
  const deterministicChecks = [
    ['node', ['scripts/checkSyntax.js']],
    ['node', ['scripts/verifyArchitecture.js']],
    ['node', ['scripts/privacyRetryGate.js']],
  ];

  for (const [command, commandArgs] of deterministicChecks) {
    const result = run(command, commandArgs);
    report.checks.push(result);
    if (result.status !== 0) report.unresolved.push(`${result.command} failed; repair is ambiguous and was not guessed.`);
  }

  let inventory = run('node', ['scripts/verifyRepositoryInventory.js']);
  report.checks.push(inventory);
  if (inventoryRepairNeeded(inventory)) {
    if (apply) {
      const update = run('node', ['scripts/verifyRepositoryInventory.js', '--write']);
      report.checks.push(update);
      if (update.status === 0) {
        report.repairs.push('Regenerated repository-file-manifest.json after deterministic repository changes.');
        inventory = run('node', ['scripts/verifyRepositoryInventory.js']);
        report.checks.push(inventory);
      }
    }
    if (!apply || inventory.status !== 0) report.unresolved.push('Repository inventory requires regeneration.');
  } else if (inventory.status !== 0) {
    report.unresolved.push('Repository inventory failed for a reason that is not safe to auto-repair.');
  }
}

const dirty = run('git', ['status', '--porcelain']);
report.changedFiles = dirty.stdout.split(/\r?\n/).filter(Boolean);
if (writeReport) fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

console.log(`[self-repair] mode=${report.mode} trustedStatic=${trustedStatic} repairs=${report.repairs.length} unresolved=${report.unresolved.length}`);
for (const repair of report.repairs) console.log(`[self-repair] repaired: ${repair}`);
for (const unresolved of report.unresolved) console.error(`[self-repair] unresolved: ${unresolved}`);

if (report.unresolved.length) process.exit(2);
