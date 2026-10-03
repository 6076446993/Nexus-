'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function sha256(value) {
  return crypto.createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
}

function parseRepository(full) {
  const [owner, repo, ...rest] = String(full || '').split('/');
  if (!owner || !repo || rest.length) throw new Error('Crucible repository must be owner/repo.');
  return { owner, repo };
}

function loadBridgePin(file) {
  const pin = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (pin?.schemaVersion !== 1 || pin?.mode !== 'exact-ref-read-only') throw new Error('Invalid Crucible diagnostic bridge pin.');
  if (!/^[a-f0-9]{40}$/i.test(pin.crucibleCommit || '')) throw new Error('Crucible diagnostic bridge must pin an exact commit SHA.');
  if (!pin.crucibleRepository || !pin.cruCatalogPath || !pin.repairContractPath) throw new Error('Crucible diagnostic bridge pin is incomplete.');
  return pin;
}

class CrucibleDiagnosticBridge {
  constructor({ token, githubClient, diagnostics, pinFile = path.join(__dirname, 'governingDocuments', 'native', 'CRUCIBLE-DIAGNOSTIC-BRIDGE.json') }) {
    if (!githubClient?.getFileContent || !githubClient?.getCommitCheckRuns) throw new Error('GitHub read/check client is required.');
    if (!diagnostics?.installCruCatalog || !diagnostics?.explainCruCode) throw new Error('Nexus diagnostics with CRU memory are required.');
    this.requiresRepositoryCoordinates = true;
    this.token = token || null;
    this.githubClient = githubClient;
    this.diagnostics = diagnostics;
    this.pinFile = pinFile;
    this.state = null;
  }

  async refresh() {
    if (!this.token) throw new Error('GitHub connection is required to refresh Crucible diagnostic authority.');
    const pin = loadBridgePin(this.pinFile);
    const { owner, repo } = parseRepository(pin.crucibleRepository);
    const [catalogFile, contractFile] = await Promise.all([
      this.githubClient.getFileContent(this.token, owner, repo, pin.cruCatalogPath, pin.crucibleCommit),
      this.githubClient.getFileContent(this.token, owner, repo, pin.repairContractPath, pin.crucibleCommit),
    ]);
    const catalog = JSON.parse(catalogFile.content);
    const contract = JSON.parse(contractFile.content);
    if (catalog.authority !== 'The-Crucible' || contract.authority !== 'The-Crucible') throw new Error('Crucible diagnostic authority mismatch.');
    if (contract.schemaVersion !== 1 || !contract.diagnosisMappings || !contract.verificationRules) throw new Error('Crucible repair contract is invalid.');
    const catalogSha256 = sha256(JSON.stringify(catalog));
    this.diagnostics.installCruCatalog({
      catalog,
      sourceRepository: pin.crucibleRepository,
      sourceCommit: pin.crucibleCommit,
      contentSha256: catalogSha256,
    });
    this.state = {
      pin,
      catalog,
      contract,
      catalogSha256,
      catalogBlobSha: catalogFile.sha,
      contractBlobSha: contractFile.sha,
      refreshedAt: new Date().toISOString(),
    };
    return {
      ok: true,
      crucibleCommit: pin.crucibleCommit,
      catalogSha256,
      catalogBlobSha: catalogFile.sha,
      contractBlobSha: contractFile.sha,
      codeCount: catalog.codes.length,
      refreshedAt: this.state.refreshedAt,
    };
  }

  requireState() {
    if (!this.state) throw new Error('Crucible diagnostic bridge has not been refreshed.');
    return this.state;
  }

  classifyDiagnosis({ diagnosis, task = null }) {
    const state = this.requireState();
    if (!diagnosis?.evidenceDigest || !diagnosis?.summary) throw new Error('A hashed Nexus diagnosis is required.');
    const classifiedFailures = [];
    const unresolved = [];
    for (const finding of diagnosis.findings || []) {
      if (finding.severity !== 'error') continue;
      const mapped = finding.crucibleCode || state.contract.diagnosisMappings[finding.code] || null;
      if (!mapped) { unresolved.push({ findingCode: finding.code || null, reason: 'no Crucible mapping' }); continue; }
      const explanation = this.diagnostics.explainCruCode(mapped);
      if (!explanation) { unresolved.push({ findingCode: finding.code || null, crucibleCode: mapped, reason: 'CRU definition pending catalog refresh' }); continue; }
      if (explanation.status && explanation.status !== 'active-classification') {
        unresolved.push({ findingCode: finding.code || null, crucibleCode: mapped, reason: `CRU entry status is ${explanation.status}` });
        continue;
      }
      classifiedFailures.push({
        findingCode: finding.code || null,
        crucibleCode: mapped,
        category: explanation.category,
        meaning: explanation.meaning,
        next: explanation.next,
        remedy: explanation.remedy,
        authority: {
          repository: explanation.sourceRepository,
          commit: explanation.sourceCommit,
          catalogSha256: explanation.catalogSha256,
        },
      });
    }
    const errors = Number(diagnosis.summary.errorCount || 0);
    return {
      classified: errors === 0 || (classifiedFailures.length === errors && unresolved.length === 0),
      repairEligible: errors > 0 && unresolved.length === 0 && classifiedFailures.length === errors && classifiedFailures.every((item) => item.remedy?.kind !== 'owner-decision'),
      diagnosisDigest: diagnosis.evidenceDigest,
      taskId: task?.id || null,
      classifiedFailures,
      unresolved,
      crucibleAuthority: {
        repository: state.pin.crucibleRepository,
        commit: state.pin.crucibleCommit,
        catalogSha256: state.catalogSha256,
        contractBlobSha: state.contractBlobSha,
      },
    };
  }

  async verifyCodingCommit({ owner, repo, commit }) {
    const state = this.requireState();
    if (!/^[a-f0-9]{40}$/i.test(String(commit || ''))) throw new Error('Coding verification requires the exact commit SHA.');
    const checkName = state.contract.verificationRules.githubRequiredCheck;
    const checks = await this.githubClient.getCommitCheckRuns(this.token, owner, repo, commit);
    const matching = checks.filter((check) => check.name === checkName);
    const passed = matching.some((check) => check.status === 'completed' && check.conclusion === 'success');
    const pending = matching.length === 0 || matching.some((check) => check.status !== 'completed');
    return {
      passed,
      pending: !passed && pending,
      independent: true,
      verifier: 'The-Crucible/GitHub-required-check',
      requiredCheck: checkName,
      exactCommit: commit,
      checks: matching,
      crucibleAuthority: {
        repository: state.pin.crucibleRepository,
        commit: state.pin.crucibleCommit,
        catalogSha256: state.catalogSha256,
        contractBlobSha: state.contractBlobSha,
      },
      reason: passed ? null : pending
        ? (matching.length === 0 ? `Required check "${checkName}" has not appeared yet on the exact coding commit.` : `Required check "${checkName}" is still running on the exact coding commit.`)
        : `Required check "${checkName}" completed without success on the exact coding commit.`,
    };
  }

  async verifyRepair({ owner, repo, repairCommit, beforeDiagnosis, afterDiagnosis, classification, test }) {
    const state = this.requireState();
    if (!/^[a-f0-9]{40}$/i.test(String(repairCommit || ''))) throw new Error('Verification requires the exact repair commit SHA.');
    if (!beforeDiagnosis?.evidenceDigest || !afterDiagnosis?.evidenceDigest) throw new Error('Before and after diagnosis digests are required.');
    if (!test?.passed) return { passed: false, independent: true, reason: 'Repair tests did not pass.' };
    if (afterDiagnosis.summary?.errorCount) return { passed: false, independent: true, reason: 'Post-repair Nexus diagnosis still contains errors.' };
    const checkName = state.contract.verificationRules.githubRequiredCheck;
    const checks = await this.githubClient.getCommitCheckRuns(this.token, owner, repo, repairCommit);
    const matching = checks.filter((check) => check.name === checkName);
    const passed = matching.some((check) => check.status === 'completed' && check.conclusion === 'success');
    return {
      passed,
      independent: true,
      verifier: 'The-Crucible/GitHub-required-check',
      requiredCheck: checkName,
      exactRepairCommit: repairCommit,
      checks: matching,
      beforeDiagnosisDigest: beforeDiagnosis.evidenceDigest,
      afterDiagnosisDigest: afterDiagnosis.evidenceDigest,
      failureCodes: classification?.classifiedFailures?.map((item) => item.crucibleCode) || [],
      crucibleAuthority: {
        repository: state.pin.crucibleRepository,
        commit: state.pin.crucibleCommit,
        catalogSha256: state.catalogSha256,
        contractBlobSha: state.contractBlobSha,
      },
      reason: passed ? null : `Required check "${checkName}" has not completed successfully on the exact repair commit.`,
    };
  }
}

module.exports = { CrucibleDiagnosticBridge, loadBridgePin, parseRepository, sha256 };
