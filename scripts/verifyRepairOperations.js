const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const requiredProbes = Object.freeze(['codeql', 'worker-extraction', 'oversight', 'durable-learning', 'council', 'public-ci', 'smoke-ci', 'learning-ingestion', 'scheduled-monitor']);
const repositoryNames = Object.freeze(['Nexus-', 'NVIDIA-NIM-CONSOLE', 'AI-collaboration-', 'The-Crucible', 'Learning-Worker', 'Crucible-Learning-State', 'Crucible-Vetted-Learning-State', 'Vetting-and-Governance-oversite.', 'Nexus-Public-CI']);
const shaPattern = /^[a-f0-9]{40}$/;

// This checks collected live evidence, never supplies successful observations.
// The authorized collector must read each current repository/required result.
function verifyRepairOperations(evidence, { now = Date.now(), maxAgeMs = 90 * 60 * 1000, includeSmoke = true } = {}) {
  const failures = [];
  function fail(component, reason, blocked = false) {
    failures.push({ component, reason, state: blocked ? 'blocked' : 'failed', repairRequired: true,
      fingerprint: crypto.createHash('sha256').update(`${component}\n${reason}`).digest('hex') });
  }
  function fresh(value) {
    const time = typeof value === 'string' ? Date.parse(value) : NaN;
    return Number.isFinite(time) && time <= now && now - time <= maxAgeMs;
  }
  if (!evidence || evidence.schemaVersion !== 1) fail('evidence', 'Missing or unsupported verification evidence.', true);
  const repositories = repositoryNames.map(name => `6076446993/${name}`);
  if (includeSmoke) repositories.push('jonathanblunt1214-lgtm/Smoker-Hours-Tracker');
  const scans = Array.isArray(evidence?.securityScans) ? evidence.securityScans : [];
  const ids = scans.map(scan => scan.repositoryId);
  if (new Set(ids).size !== ids.length) fail('security-coverage', 'Duplicate stable repository identities in coverage.', true);
  for (const repository of repositories) {
    const matches = scans.filter(scan => scan.repository === repository);
    if (matches.length !== 1) { fail(repository, 'Missing or ambiguous direct Dependabot coverage.', true); continue; }
    const scan = matches[0];
    if (scan.source !== 'github-dependabot' || scan.authenticated !== true || scan.complete !== true || scan.error) {
      fail(repository, 'Direct Dependabot scan blocked or incomplete.', true); continue;
    }
    if (!fresh(scan.observedAt)) fail(repository, 'Direct Dependabot heartbeat stale or invalid.', true);
    if (!Number.isSafeInteger(scan.repositoryId) || scan.repositoryId <= 0) fail(repository, 'Stable repository identity missing.', true);
    if (!Array.isArray(scan.openAlertIds) || scan.openAlertIds.some(id => !Number.isSafeInteger(id) || id <= 0)
      || new Set(scan.openAlertIds).size !== scan.openAlertIds.length
      || !Number.isSafeInteger(scan.openCount) || scan.openCount !== scan.openAlertIds.length) {
      fail(repository, 'Dependabot alert enumeration is inconsistent.', true);
    } else if (!Array.isArray(scan.trackedAlertIds) || scan.openAlertIds.some(id => !scan.trackedAlertIds.includes(id))) {
      fail(repository, 'An open Dependabot alert is missing from the repair queue.');
    }
  }
  const probes = Array.isArray(evidence?.probes) ? evidence.probes : [];
  for (const name of requiredProbes.filter(name => includeSmoke || name !== 'smoke-ci')) {
    const matches = probes.filter(probe => probe.name === name);
    if (matches.length !== 1) { fail(name, 'Required live verification missing or ambiguous.', true); continue; }
    const probe = matches[0];
    if (!fresh(probe.observedAt)) fail(name, 'Verification heartbeat stale or invalid.', true);
    if (!shaPattern.test(probe.expectedSha || '') || probe.actualSha !== probe.expectedSha) fail(name, 'Verification does not match the current target commit.', true);
    if (probe.status !== 'completed' || probe.conclusion !== 'success') fail(name, 'Required operation did not complete successfully.', probe.blocked === true);
    if (!Array.isArray(probe.evidenceRefs) || !probe.evidenceRefs.length || probe.evidenceRefs.some(ref => typeof ref !== 'string' || !ref.trim())) {
      fail(name, 'Live result evidence reference missing.', true);
    }
    if (name === 'scheduled-monitor' && (probe.scheduledExecution !== true || probe.notificationVerified !== true)) {
      fail(name, 'Scheduled execution or notification delivery unverified.', true);
    }
    if (name === 'learning-ingestion' && (probe.ingestionAcknowledged !== true || probe.independentlyVetted !== true || probe.consumptionVerified !== true)) {
      fail(name, 'Repair learning ingestion, independent vetting or consumption unverified.', true);
    }
  }
  return { schemaVersion: 1, verifiedAt: new Date(now).toISOString(), state: failures.length ? 'failed' : 'passed',
    repairRequired: failures.length > 0, failures, successfulVerificationDoesNotAuthorizePromotion: true };
}

if (require.main === module) {
  try {
    const file = process.argv[2];
    if (!file) throw new Error('Supply a live verification evidence JSON file; absent evidence never passes.');
    const result = verifyRepairOperations(JSON.parse(fs.readFileSync(path.resolve(file), 'utf8')), { includeSmoke: !process.argv.includes('--nexus-only') });
    console.log(JSON.stringify(result, null, 2));
    process.exitCode = result.repairRequired ? 1 : 0;
  } catch (error) {
    console.error(`Operational verification blocked: ${error.message}`);
    process.exitCode = 1;
  }
}
module.exports = { verifyRepairOperations, requiredProbes, repositoryNames };
