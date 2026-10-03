'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ACTIVE_COMPONENTS = Object.freeze({
  'Nexus-': 'architecture-coordination',
  'NVIDIA-NIM-CONSOLE': 'interface-routing',
  'AI-collaboration-': 'reasoning-collaboration',
  'The-Crucible': 'verification-failure-classification',
  'Learning-Worker': 'candidate-extraction',
  'Crucible-Learning-State': 'encrypted-candidate-state',
  'Crucible-Vetted-Learning-State': 'vetted-custody',
  'Vetting-and-Governance-oversite.': 'governance-independent-vetting',
  'Nexus-Public-CI': 'public-ci-status',
});

const OBSOLETE_COMPONENTS = new Set(['Assimilation', 'assimilation']);

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function normalizeSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) {
    throw new TypeError('diagnostic snapshot must be an object');
  }
  const repository = String(snapshot.repository || '').trim();
  const commit = String(snapshot.commit || '').trim();
  const registeredComponent = Boolean(repository && Object.hasOwn(ACTIVE_COMPONENTS, repository));
  const scope = String(snapshot.scope || (registeredComponent ? 'nexus-component' : '')).trim();
  const projectId = snapshot.projectId == null ? null : String(snapshot.projectId).trim();
  if (!repository) throw new Error('diagnostic snapshot requires repository identity');
  if (scope === 'nexus-component' && !registeredComponent) throw new Error(`unregistered Nexus component: ${repository}`);
  if (scope === 'nexus-managed-project' && !projectId) throw new Error('managed project diagnosis requires projectId');
  if (!['nexus-component', 'nexus-managed-project'].includes(scope)) throw new Error('diagnostic snapshot must declare nexus-component or nexus-managed-project scope');
  if (!/^[0-9a-f]{7,64}$/i.test(commit)) throw new Error('diagnostic snapshot requires an immutable commit/version reference');
  const files = snapshot.files && typeof snapshot.files === 'object' && !Array.isArray(snapshot.files) ? snapshot.files : {};
  const observations = Array.isArray(snapshot.observations) ? snapshot.observations.map((item) => ({ ...item })) : [];
  return { repository, commit, scope, projectId, registeredComponent, files, observations };
}

function findActiveAssimilation(text) {
  const findings = [];
  const lines = String(text).split(/\r?\n/);
  lines.forEach((line, index) => {
    if (!/assimilat/i.test(line)) return;
    if (/obsolete|historical|retired|provenance only|must not|do not route/i.test(line)) return;
    if (/learning_sources\//i.test(line)) return;
    findings.push({
      code: 'NXD-ASSIMILATION-ACTIVE',
      crucibleCode: 'CRU-0055',
      severity: 'error',
      line: index + 1,
      message: 'Active Assimilation semantics remain; Assimilation is obsolete and cannot be a routing, lifecycle, or authority mechanism.',
    });
  });
  return findings;
}

function diagnoseSnapshot(input) {
  const snapshot = normalizeSnapshot(input);
  const findings = snapshot.observations.map((item) => ({
    code: String(item.code || 'NXD-OBSERVATION'),
    crucibleCode: item.crucibleCode || null,
    severity: ['error','warning','info'].includes(item.severity) ? item.severity : 'error',
    file: item.file || null,
    line: Number.isFinite(item.line) ? item.line : null,
    message: String(item.message || 'Diagnostic observation'),
    source: item.source || 'nexus-advanced-diagnostics',
    evidence: item.evidence || null,
  }));
  const fileEntries = Object.entries(snapshot.files).sort(([a], [b]) => a.localeCompare(b));

  for (const [file, raw] of fileEntries) {
    const text = typeof raw === 'string' ? raw : JSON.stringify(raw);
    if (snapshot.scope === 'nexus-component') {
      for (const finding of findActiveAssimilation(text)) findings.push({ file, ...finding });
    }

    if (snapshot.scope === 'nexus-component' && /NEXUS-SYSTEM-CONFORMANCE\.md$/i.test(file)) {
      if (!/canonical Nexus/i.test(text) || !/authority/i.test(text) || !/lineage/i.test(text)) {
        findings.push({
          code: 'NXD-CONFORMANCE-INCOMPLETE',
          crucibleCode: 'CRU-0055',
          severity: 'error',
          file,
          message: 'Component conformance contract does not preserve canonical Nexus authority and lineage semantics.',
        });
      }
    }
  }

  const hasConformance = fileEntries.some(([file]) => /NEXUS-SYSTEM-CONFORMANCE\.md$/i.test(file))
    || snapshot.repository === 'Nexus-';
  if (snapshot.scope === 'nexus-component' && !hasConformance) {
    findings.push({
      code: 'NXD-CONFORMANCE-MISSING',
      crucibleCode: 'CRU-0055',
      severity: 'error',
      file: null,
      message: 'Registered component snapshot does not include its Nexus system conformance contract.',
    });
  }

  const evidence = {
    schemaVersion: 1,
    tool: 'nexus-diagnose',
    mode: 'read-only',
    mutatesTarget: false,
    repository: snapshot.repository,
    scope: snapshot.scope,
    projectId: snapshot.projectId,
    componentRole: snapshot.registeredComponent ? ACTIVE_COMPONENTS[snapshot.repository] : 'nexus-managed-program',
    commit: snapshot.commit,
    inspectedFiles: fileEntries.map(([file]) => file),
    inspectedFileHashes: Object.fromEntries(fileEntries.map(([file, raw]) => [
      file,
      sha256(typeof raw === 'string' ? raw : JSON.stringify(raw)),
    ])),
    findings,
    summary: {
      findingCount: findings.length,
      errorCount: findings.filter((item) => item.severity === 'error').length,
      status: findings.some((item) => item.severity === 'error') ? 'BLOCKED' : 'DIAGNOSED',
    },
    authority: {
      mayWriteTarget: false,
      mayRepairTarget: false,
      mayPromote: false,
      mayGovern: false,
      mayVerify: false,
      statement: 'Diagnosis is evidence only. It does not change target state or acquire target authority.',
    },
  };
  evidence.evidenceDigest = sha256(JSON.stringify(evidence));
  return evidence;
}

function diagnoseSnapshotFile(file) {
  const absolute = path.resolve(file);
  const input = JSON.parse(fs.readFileSync(absolute, 'utf8'));
  return diagnoseSnapshot(input);
}

if (require.main === module) {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node scripts/nexusDiagnose.js <immutable-snapshot.json>');
    process.exit(2);
  }
  try {
    const report = diagnoseSnapshotFile(file);
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    process.exitCode = report.summary.errorCount ? 1 : 0;
  } catch (error) {
    console.error(`[nexus-diagnose] ${error.message}`);
    process.exitCode = 2;
  }
}

module.exports = {
  ACTIVE_COMPONENTS,
  OBSOLETE_COMPONENTS,
  diagnoseSnapshot,
  diagnoseSnapshotFile,
  findActiveAssimilation,
};
