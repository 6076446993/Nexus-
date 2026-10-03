'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const { NexusRepairController, digest } = require('./nexusRepairController');
const { diagnoseSnapshot } = require('./scripts/nexusDiagnose');

function gitCommit(folder) {
  return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: folder, encoding: 'utf8', windowsHide: true }).trim();
}

function projectSnapshot(folder, repository, files) {
  const root = fs.realpathSync(folder);
  const selected = {};
  for (const relative of [...new Set(files || [])].sort()) {
    const full = path.resolve(root, relative);
    const rel = path.relative(root, full);
    if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) throw new Error(`snapshot path escapes project: ${relative}`);
    if (!fs.existsSync(full) || !fs.statSync(full).isFile()) continue;
    selected[rel.replace(/\\/g, '/')] = fs.readFileSync(full, 'utf8');
  }
  return { repository, commit: gitCommit(root), files: selected };
}

function fileSha(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

function createNexusProgramRepairRuntime({
  repository,
  folder,
  snapshotFiles,
  crucibleClassify,
  crucibleBridge = null,
  planRepair,
  authorize,
  applyBoundedRepair,
  runProjectTests,
  crucibleVerify,
  loadRegressionMemory,
}) {
  if (!repository || !folder) throw new Error('repository and folder are required.');
  const classifier = crucibleClassify || crucibleBridge?.classifyNexusDiagnosis;
  const verifier = crucibleVerify || crucibleBridge?.verifyNexusRepair;
  if (typeof classifier !== 'function' || typeof verifier !== 'function') throw new Error('Crucible classification and verification adapters are required.');
  let firstDiagnosis = null;
  const controller = new NexusRepairController({
    diagnose: async (snapshot) => { const result = diagnoseSnapshot(snapshot); if (!firstDiagnosis) firstDiagnosis = result; return result; },
    classify: classifier,
    planRepair,
    authorize,
    repair: async (ctx) => {
      const result = await applyBoundedRepair(ctx);
      if (!result?.ok) return result || {};
      const after = projectSnapshot(folder, repository, snapshotFiles);
      return { ...result, commit: after.commit, snapshot: after };
    },
    retest: async (ctx) => {
      const result = await runProjectTests(ctx);
      return { passed: result?.ok === true && result?.skipped !== true, result };
    },
    verify: async (ctx) => verifier({ ...ctx, beforeDiagnosis: firstDiagnosis, afterDiagnosis: ctx.diagnosis }),
    regressionMemory: loadRegressionMemory,
  });

  return {
    async run(task) {
      const before = projectSnapshot(folder, repository, snapshotFiles);
      return controller.run({ snapshot: before, task });
    },
  };
}

function makeExactPlanAuthorization({ authorizationId, baseCommit, plan }) {
  if (!authorizationId || !baseCommit || !plan) throw new Error('authorizationId, baseCommit, and plan are required.');
  return { approved: true, authorizationId, baseCommit, planDigest: digest(plan) };
}

module.exports = { createNexusProgramRepairRuntime, projectSnapshot, makeExactPlanAuthorization, fileSha };
