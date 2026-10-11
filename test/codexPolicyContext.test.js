'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { safeContext } = require('../nexusNativeCoding');

const originalSha256 = '89ff244dd1164abedcb3f034467e1e478feee13b022e11b3e7078fb39940e50f';
const sourceStart = 'Implement a system-wide agentic resource-efficiency layer';

test('Codex bootstrap is exactly 1998 characters and names its accessible full policy', () => {
  const text = fs.readFileSync(path.join(__dirname, '..', 'docs', 'CODEX_CUSTOM_INSTRUCTIONS.txt'), 'utf8');
  assert.equal([...text].length, 1998);
  assert.match(text, /docs\/CODEX_FULL_POLICY\.md/);
  assert.match(text, /Crucible custody\/intake/);
  assert.match(text, /NO_CHANGE/);
});

test('full Codex policy retains the original Drive source bytes and new governed scope', () => {
  const policy = fs.readFileSync(path.join(__dirname, '..', 'docs', 'CODEX_FULL_POLICY.md'), 'utf8');
  const index = policy.indexOf(sourceStart);
  assert.ok(index > 0);
  const original = Buffer.from(policy.slice(index), 'utf8');
  assert.equal(crypto.createHash('sha256').update(original).digest('hex'), originalSha256);
  assert.match(policy, /Mandatory research-grounded non-Work preprocessing/);
  assert.match(policy, /Crucible governed research, custody and intake/);
  assert.match(policy, /20\. VERIFICATION/);
  assert.match(policy, /40.65% less compute|40–65% less compute/);
});

test('native Nexus coder prioritizes AGENTS and both policy files without permission expansion', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-codex-policy-'));
  try {
    execFileSync('git', ['init', '--quiet'], { cwd: root });
    fs.mkdirSync(path.join(root, 'docs'));
    fs.writeFileSync(path.join(root, 'AGENTS.md'), 'branch restriction\n');
    fs.writeFileSync(path.join(root, 'docs', 'CODEX_CUSTOM_INSTRUCTIONS.txt'), 'compact\n');
    fs.writeFileSync(path.join(root, 'docs', 'CODEX_FULL_POLICY.md'), 'full\n');
    for (let i = 0; i < 25; i++) fs.writeFileSync(path.join(root, 'README-' + i + '.md'), 'unrelated\n');
    execFileSync('git', ['add', '.'], { cwd: root });
    const context = safeContext(root, 'README change', { maxFiles: 3, maxBytes: 1024 });
    assert.deepEqual(context.map((item) => item.path), [
      'AGENTS.md', 'docs/CODEX_CUSTOM_INSTRUCTIONS.txt', 'docs/CODEX_FULL_POLICY.md',
    ]);
    assert.equal(context[0].content, 'branch restriction\n');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
