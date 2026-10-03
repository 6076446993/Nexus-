const fs = require('node:fs');
const path = require('node:path');

// Minimum patched stable versions for the captured 2026-10-03 advisories.
// This bounded policy supplements npm audit; it does not predict new advisories.
const floors = {
  electron: { 42: '42.10.0', 43: '43.5.0' },
  undici: { 6: '6.28.1', 7: '7.29.1', 8: '8.10.2' },
};

function dependencySecurityFindings(lock) {
  if (!lock || !lock.packages || typeof lock.packages !== 'object') {
    return ['Dependency security requires a packages-based lockfile.'];
  }
  const findings = [];
  if (!lock.packages['node_modules/electron']) findings.push('Electron is missing from the release lockfile.');
  for (const [location, pkg] of Object.entries(lock.packages)) {
    const match = location.match(/(?:^|\/)node_modules\/(electron|undici)$/);
    if (!match) continue;
    const version = /^(\d+)\.(\d+)\.(\d+)(-[^+]+)?(?:\+.*)?$/.exec(pkg.version || '');
    if (!version) { findings.push(`${location}: invalid dependency version.`); continue; }
    const minimum = floors[match[1]][Number(version[1])];
    if (!minimum) continue;
    const actual = version.slice(1, 4).map(Number);
    const wanted = minimum.split('.').map(Number);
    let comparison = 0;
    for (let i = 0; i < 3 && comparison === 0; i++) comparison = Math.sign(actual[i] - wanted[i]);
    if (comparison < 0 || (comparison === 0 && version[4])) {
      findings.push(`${location}: ${pkg.version} is below patched security floor ${minimum}.`);
    }
  }
  return findings;
}

if (require.main === module) {
  const lock = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package-lock.json'), 'utf8'));
  const findings = dependencySecurityFindings(lock);
  for (const finding of findings) console.error(finding);
  if (findings.length) process.exitCode = 1;
  else console.log('Captured dependency security floors passed, including nested packages.');
}

module.exports = { dependencySecurityFindings };
