'use strict';

// Read-only, fail-closed Codex policy integrity check for Nexus's native coding path.
// Never reads secret stores or makes network calls; hashes are pinned to a reviewed manifest.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

function sha256(bytes) { return crypto.createHash('sha256').update(bytes).digest('hex'); }
function readInside(root, relative) {
  const resolved = path.resolve(root, relative);
  if (!resolved.startsWith(root + path.sep)) throw new Error('Codex policy path escapes repository root.');
  const lst = fs.lstatSync(resolved);
  if (!lst.isFile() || lst.isSymbolicLink()) throw new Error('Codex policy file must be a regular file, not a symlink: ' + relative);
  return fs.readFileSync(resolved);
}

function verifyCodexPolicy(folder) {
  const root = fs.realpathSync(folder);
  const manifestPath = 'docs/CODEX_POLICY_MANIFEST.json';
  let manifest;
  try { manifest = JSON.parse(readInside(root, manifestPath).toString('utf8')); }
  catch (error) { throw new Error('CODEX_POLICY_BLOCKED: missing or unreadable manifest: ' + error.message); }
  if (manifest.schemaVersion !== 1 ||
      manifest.policyPath !== 'docs/CODEX_FULL_POLICY.md' ||
      manifest.compactPath !== 'docs/CODEX_CUSTOM_INSTRUCTIONS.txt' ||
      !/^[0-9a-f]{64}$/.test(manifest.policySha256 || '') ||
      !/^[0-9a-f]{64}$/.test(manifest.compactSha256 || '') ||
      manifest.compactCharacters !== 1998) {
    throw new Error('CODEX_POLICY_BLOCKED: invalid pinned policy manifest.');
  }
  const facts = [];
  for (const [relative, expected] of [[manifest.policyPath, manifest.policySha256], [manifest.compactPath, manifest.compactSha256]]) {
    let bytes;
    try { bytes = readInside(root, relative); }
    catch (error) { throw new Error('CODEX_POLICY_BLOCKED: required policy missing/unreadable: ' + relative + ' (' + error.message + ')'); }
    const observed = sha256(bytes);
    if (observed !== expected) throw new Error('CODEX_POLICY_BLOCKED: SHA256 mismatch: ' + relative);
    facts.push({ path: relative, sha256: observed, bytes: bytes.length });
  }
  const compact = readInside(root, manifest.compactPath).toString('utf8');
  if ([...compact].length !== manifest.compactCharacters) {
    throw new Error('CODEX_POLICY_BLOCKED: compact instructions character limit changed.');
  }
  let agents;
  try { agents = readInside(root, 'AGENTS.md').toString('utf8'); }
  catch (error) { throw new Error('CODEX_POLICY_BLOCKED: missing governing AGENTS.md: ' + error.message); }
  if (!agents.includes('docs/CODEX_FULL_POLICY.md') || !agents.includes('docs/CODEX_CUSTOM_INSTRUCTIONS.txt')) {
    throw new Error('CODEX_POLICY_BLOCKED: AGENTS.md must reference both policy layers.');
  }
  return { ok: true, status: 'FILESYSTEM_VERIFIED_NOT_MODEL_ATTESTED', manifestPath, policy: facts };
}

if (require.main === module) {
  try {
    const result = verifyCodexPolicy(process.argv[2] || process.cwd());
    process.stdout.write(JSON.stringify(result) + '\n');
  } catch (error) {
    process.stderr.write(error.message + '\n');
    process.exitCode = 1;
  }
}

module.exports = { verifyCodexPolicy };
