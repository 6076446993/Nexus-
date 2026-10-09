const test = require('node:test');
const assert = require('node:assert/strict');
const { dependencySecurityFindings } = require('../scripts/dependencySecurityPolicy');

const lock = (electron, undici, nested) => ({ packages: {
  'node_modules/electron': { version: electron },
  'node_modules/undici': { version: undici },
  'node_modules/node-gyp/node_modules/undici': { version: nested },
} });

test('rejects all three vulnerable versions from the actual pre-repair lockfile', () => {
  const findings = dependencySecurityFindings(lock('43.4.1', '7.29.0', '6.28.0'));
  assert.equal(findings.length, 3);
  assert.ok(findings.some((finding) => finding.startsWith('node_modules/node-gyp/node_modules/undici:')));
});

test('accepts patched boundaries and rejects one-package rollback independently', () => {
  assert.deepEqual(dependencySecurityFindings(lock('43.5.0', '7.29.1', '6.28.1')), []);
  for (const versions of [['43.4.1', '7.29.1', '6.28.1'], ['43.5.0', '7.29.0', '6.28.1'], ['43.5.0', '7.29.1', '6.28.0']]) {
    assert.equal(dependencySecurityFindings(lock(...versions)).length, 1);
  }
});

test('does not accept an unpatched prerelease at a stable security boundary', () => {
  assert.equal(dependencySecurityFindings(lock('43.5.0-beta.1', '7.29.1-rc.1', '6.28.1')).length, 2);
});

test('fails closed on missing lock metadata or missing Electron', () => {
  assert.equal(dependencySecurityFindings({}).length, 1);
  assert.equal(dependencySecurityFindings({ packages: {} }).length, 1);
});

test('the installed release lockfile contains only patched captured dependencies', () => {
  assert.deepEqual(dependencySecurityFindings(require('../package-lock.json')), []);
});

test('enforces every patched brace-expansion major without collapsing dependency compatibility', () => {
  const braceLock = (one, two, five) => ({ packages: {
    'node_modules/electron': { version: '43.7.7' },
    'node_modules/@electron/asar/node_modules/brace-expansion': { version: one },
    'node_modules/@electron/universal/node_modules/brace-expansion': { version: two },
    'node_modules/brace-expansion': { version: five },
  } });
  assert.deepEqual(dependencySecurityFindings(braceLock('1.1.21', '2.1.7', '5.0.12')), []);
  for (const versions of [['1.1.20', '2.1.7', '5.0.12'], ['1.1.21', '2.1.6', '5.0.12'], ['1.1.21', '2.1.7', '5.0.11']]) {
    const findings = dependencySecurityFindings(braceLock(...versions));
    assert.equal(findings.length, 1);
    assert.match(findings[0], /brace-expansion/);
  }
});
