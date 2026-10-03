'use strict';

const crypto = require('crypto');

const STATES = Object.freeze({
  DIAGNOSE: 'DIAGNOSE',
  CLASSIFY: 'CLASSIFY',
  PLAN: 'PLAN',
  AUTHORIZE: 'AUTHORIZE',
  REPAIR: 'REPAIR',
  RETEST: 'RETEST',
  REDIAGNOSE: 'REDIAGNOSE',
  VERIFY: 'VERIFY',
  FINISHED: 'FINISHED',
  QUARANTINED: 'QUARANTINED',
  BLOCKED: 'BLOCKED',
});

const digest = (value) => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');

function requireFunction(value, name) {
  if (typeof value !== 'function') throw new TypeError(`${name} is required`);
}

function applicableRegression(regressions, plan) {
  return (regressions || []).find((record) => {
    if (!record || typeof record !== 'object') return false;
    const componentMatches = !record.component || !plan.component || record.component === plan.component;
    const strategy = String(plan.strategy || plan.remedy || '');
    const lesson = String(record.preventionLesson || '');
    const repeatsKnownHarm = strategy && lesson && lesson.toLowerCase().includes(strategy.toLowerCase());
    return componentMatches && repeatsKnownHarm;
  }) || null;
}

class NexusRepairController {
  constructor({ diagnose, classify, planRepair, authorize, repair, retest, verify, regressionMemory = () => [], maxAttempts = 2 }) {
    for (const [name, fn] of Object.entries({ diagnose, classify, planRepair, authorize, repair, retest, verify, regressionMemory })) requireFunction(fn, name);
    this.diagnose = diagnose;
    this.classify = classify;
    this.planRepair = planRepair;
    this.authorize = authorize;
    this.repair = repair;
    this.retest = retest;
    this.verify = verify;
    this.regressionMemory = regressionMemory;
    this.maxAttempts = maxAttempts;
  }

  async run({ snapshot, task }) {
    const history = [];
    let current = snapshot;
    let priorDiagnosis = null;

    for (let attempt = 1; attempt <= this.maxAttempts; attempt += 1) {
      const diagnosis = await this.diagnose(current);
      history.push({ state: STATES.DIAGNOSE, attempt, evidenceDigest: diagnosis.evidenceDigest, status: diagnosis.summary?.status });
      if (!diagnosis.summary?.errorCount) {
        const verification = await this.verify({ task, snapshot: current, diagnosis, history });
        history.push({ state: STATES.VERIFY, attempt, verification });
        if (verification?.passed === true && verification?.independent === true) {
          return { state: STATES.FINISHED, snapshot: current, diagnosis, verification, history };
        }
        return { state: STATES.BLOCKED, reason: 'independent-verification-not-passed', snapshot: current, diagnosis, verification, history };
      }

      const classification = await this.classify({ task, snapshot: current, diagnosis, priorDiagnosis });
      history.push({ state: STATES.CLASSIFY, attempt, classification });
      if (!classification?.classified || !classification?.repairEligible) {
        return { state: STATES.BLOCKED, reason: 'failure-not-classified-as-repair-eligible', snapshot: current, diagnosis, classification, history };
      }

      const plan = await this.planRepair({ task, snapshot: current, diagnosis, classification, priorDiagnosis });
      history.push({ state: STATES.PLAN, attempt, planDigest: digest(plan) });
      if (!plan?.bounded || !plan?.baseCommit || plan.baseCommit !== current.commit) {
        return { state: STATES.BLOCKED, reason: 'repair-plan-not-bounded-to-current-immutable-base', snapshot: current, diagnosis, classification, plan, history };
      }

      const knownHarm = applicableRegression(await this.regressionMemory({ task, snapshot: current, classification, plan }), plan);
      if (knownHarm && plan.addressesRegressionId !== knownHarm.regressionId) {
        return { state: STATES.QUARANTINED, reason: 'repair-strategy-matches-known-harmful-regression', regression: knownHarm, snapshot: current, diagnosis, classification, plan, history };
      }

      const authorization = await this.authorize({ task, snapshot: current, diagnosis, classification, plan });
      history.push({ state: STATES.AUTHORIZE, attempt, authorizationId: authorization?.authorizationId || null, approved: authorization?.approved === true });
      if (!authorization?.approved || authorization.baseCommit !== current.commit || authorization.planDigest !== digest(plan)) {
        return { state: STATES.BLOCKED, reason: 'repair-not-authorized-for-exact-base-and-plan', snapshot: current, diagnosis, classification, plan, authorization, history };
      }

      const repaired = await this.repair({ task, snapshot: current, diagnosis, classification, plan, authorization });
      history.push({ state: STATES.REPAIR, attempt, resultCommit: repaired?.commit || null });
      if (!repaired?.commit || repaired.commit === current.commit) {
        return { state: STATES.BLOCKED, reason: 'repair-produced-no-new-immutable-version', snapshot: current, diagnosis, classification, plan, authorization, repaired, history };
      }

      const test = await this.retest({ task, before: current, repaired, diagnosis, classification, plan });
      history.push({ state: STATES.RETEST, attempt, test });
      if (!test?.passed) {
        return { state: STATES.QUARANTINED, reason: 'repair-retest-failed', repairRegressionCandidate: { preRepairCommit: current.commit, repairCommit: repaired.commit, diagnosisDigest: diagnosis.evidenceDigest, test }, history };
      }

      priorDiagnosis = diagnosis;
      current = repaired.snapshot || { ...current, commit: repaired.commit };
      const post = await this.diagnose(current);
      history.push({ state: STATES.REDIAGNOSE, attempt, evidenceDigest: post.evidenceDigest, status: post.summary?.status });
      if (post.summary?.errorCount) {
        return { state: STATES.QUARANTINED, reason: 'repair-did-not-clear-diagnosis', repairRegressionCandidate: { preRepairCommit: snapshot.commit, repairCommit: repaired.commit, before: diagnosis.evidenceDigest, after: post.evidenceDigest }, snapshot: current, diagnosis: post, history };
      }

      const verification = await this.verify({ task, snapshot: current, diagnosis: post, classification, repair: repaired, test, history });
      history.push({ state: STATES.VERIFY, attempt, verification });
      if (verification?.passed === true && verification?.independent === true) {
        return { state: STATES.FINISHED, snapshot: current, diagnosis: post, verification, history };
      }
      return { state: STATES.BLOCKED, reason: 'independent-verification-not-passed', snapshot: current, diagnosis: post, verification, history };
    }

    return { state: STATES.QUARANTINED, reason: 'repair-attempt-limit-reached', snapshot: current, history };
  }
}

module.exports = { NexusRepairController, STATES, digest, applicableRegression };
