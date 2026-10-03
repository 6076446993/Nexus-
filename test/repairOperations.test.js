const test = require('node:test');
const assert = require('node:assert/strict');
const { verifyRepairOperations, requiredProbes, repositoryNames } = require('../scripts/verifyRepairOperations');
const now = Date.parse('2026-10-03T12:00:00Z');
function observation() {
  return { schemaVersion: 1,
    securityScans: [...repositoryNames.map(name => `6076446993/${name}`), 'jonathanblunt1214-lgtm/Smoker-Hours-Tracker'].map((repository, i) => ({ repository, repositoryId: i + 1, source: 'github-dependabot', authenticated: true, complete: true, observedAt: new Date(now).toISOString(), openCount: 0, openAlertIds: [], trackedAlertIds: [] })),
    probes: requiredProbes.map(name => ({ name, observedAt: new Date(now).toISOString(), expectedSha: 'a'.repeat(40), actualSha: 'a'.repeat(40), status: 'completed', conclusion: 'success', evidenceRefs: ['https://github.com/example/repo/actions/runs/1'], scheduledExecution: true, notificationVerified: true, ingestionAcknowledged: true, independentlyVetted: true, consumptionVerified: true })) };
}
function verify(evidence) { return verifyRepairOperations(evidence, { now }); }

test('complete fresh exact-commit observations pass without granting promotion authority', () => {
  const result = verify(observation());
  assert.equal(result.state, 'passed');
  assert.equal(result.repairRequired, false);
  assert.equal(result.successfulVerificationDoesNotAuthorizePromotion, true);
});
test('missing live evidence triggers repair rather than healthy empty coverage', () => {
  const result = verify(null);
  assert.equal(result.repairRequired, true);
  assert.ok(result.failures.some(item => item.component === 'worker-extraction'));
});
for (const field of ['authenticated', 'complete']) test(`Dependabot ${field} failure triggers a visible blocked repair`, () => {
  const evidence = observation(); evidence.securityScans[0][field] = false;
  assert.equal(verify(evidence).failures[0].state, 'blocked');
});
test('Gmail-only, omitted repositories, duplicate scans and partial alert pages never pass', () => {
  for (const mutate of [e => { e.securityScans[0].source = 'gmail'; }, e => { e.securityScans.pop(); }, e => { e.securityScans.push(e.securityScans[0]); }, e => { e.securityScans[0].openCount = 8; }]) {
    const evidence = observation(); mutate(evidence); assert.equal(verify(evidence).repairRequired, true);
  }
});
test('untracked alerts trigger repair; already tracked occurrences do not duplicate repair', () => {
  const evidence = observation(); const scan = evidence.securityScans[0]; scan.openCount = 1; scan.openAlertIds = [17];
  const failed = verify(evidence); assert.equal(failed.repairRequired, true);
  assert.equal(failed.failures[0].fingerprint, verify(evidence).failures[0].fingerprint);
  scan.trackedAlertIds = [17]; assert.equal(verify(evidence).state, 'passed');
});
test('stale and future monitoring observations trigger repair', () => {
  for (const time of [now - 91 * 60000, now + 1]) {
    const evidence = observation(); evidence.securityScans[0].observedAt = new Date(time).toISOString();
    assert.equal(verify(evidence).repairRequired, true);
  }
});
for (const name of requiredProbes) test(`${name} failing, skipped, pending or stale-commit results trigger repair`, () => {
  for (const mutate of [p => { p.conclusion = 'failure'; }, p => { p.conclusion = 'skipped'; }, p => { p.status = 'in_progress'; }, p => { p.actualSha = 'b'.repeat(40); }]) {
    const evidence = observation(); mutate(evidence.probes.find(probe => probe.name === name));
    assert.ok(verify(evidence).failures.some(item => item.component === name && item.repairRequired));
  }
});
test('settings alone and unit-test success cannot stand in for scheduled monitoring or learning', () => {
  for (const [name, field] of [['scheduled-monitor', 'scheduledExecution'], ['scheduled-monitor', 'notificationVerified'], ['learning-ingestion', 'ingestionAcknowledged'], ['learning-ingestion', 'independentlyVetted'], ['learning-ingestion', 'consumptionVerified']]) {
    const evidence = observation(); evidence.probes.find(p => p.name === name)[field] = false;
    assert.equal(verify(evidence).repairRequired, true);
  }
});
test('missing result references, duplicate probes and invalid commit identities fail closed', () => {
  for (const mutate of [e => { e.probes[0].evidenceRefs = []; }, e => { e.probes.push(e.probes[0]); }, e => { e.probes[0].expectedSha = 'unknown'; }]) {
    const evidence = observation(); mutate(evidence); assert.equal(verify(evidence).repairRequired, true);
  }
});
test('Nexus-only task keeps Smoke Stack separate while default router includes both', () => {
  const evidence = observation(); evidence.securityScans.pop(); evidence.probes = evidence.probes.filter(p => p.name !== 'smoke-ci');
  assert.equal(verify(evidence).repairRequired, true);
  assert.equal(verifyRepairOperations(evidence, { now, includeSmoke: false }).state, 'passed');
});

test('different repository names cannot reuse one stable repository identity', () => {
  const evidence = observation(); evidence.securityScans[1].repositoryId = evidence.securityScans[0].repositoryId;
  assert.equal(verify(evidence).repairRequired, true);
});
