'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CRU_PATTERN = /\bCRU-\d{4}\b/g;

function sha256(value) {
  return crypto.createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
}

function extractCruCodes(value) {
  const text = typeof value === 'string' ? value : JSON.stringify(value ?? null);
  return [...new Set(text.match(CRU_PATTERN) || [])];
}

function validateCatalog(catalog) {
  if (!catalog || catalog.schemaVersion !== 1 || catalog.authority !== 'The-Crucible' || !Array.isArray(catalog.codes)) {
    throw new Error('Invalid Crucible CRU catalog.');
  }
  const seen = new Set();
  for (const entry of catalog.codes) {
    if (!entry || !/^CRU-\d{4}$/.test(entry.code || '')) throw new Error('CRU catalog contains an invalid code.');
    if (seen.has(entry.code)) throw new Error(`CRU catalog contains duplicate code ${entry.code}.`);
    if (!entry.category || !entry.meaning || !entry.next || !entry.remedy?.kind) throw new Error(`CRU catalog entry ${entry.code} is incomplete.`);
    seen.add(entry.code);
  }
  return true;
}

class CruDiagnosticMemory {
  constructor(root) {
    if (!root) throw new Error('CRU diagnostic memory root is required.');
    this.root = path.resolve(root);
    this.catalogFile = path.join(this.root, 'cru-catalog.json');
    this.occurrenceFile = path.join(this.root, 'cru-occurrences.jsonl');
    fs.mkdirSync(this.root, { recursive: true });
  }

  installCatalog({ catalog, sourceRepository, sourceCommit, contentSha256 }) {
    validateCatalog(catalog);
    if (sourceRepository !== '6076446993/The-Crucible') throw new Error('CRU catalog authority repository mismatch.');
    if (!/^[a-f0-9]{40}$/i.test(sourceCommit || '')) throw new Error('CRU catalog requires an exact Crucible commit SHA.');
    const serialized = JSON.stringify(catalog);
    const actual = sha256(serialized);
    if (contentSha256 && contentSha256 !== actual) throw new Error('CRU catalog content SHA-256 mismatch.');
    const envelope = {
      schemaVersion: 1,
      authority: 'The-Crucible',
      sourceRepository,
      sourceCommit,
      catalogSha256: actual,
      installedAt: new Date().toISOString(),
      catalog,
    };
    fs.writeFileSync(this.catalogFile, `${JSON.stringify(envelope, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 });
    return { sourceCommit, catalogSha256: actual, codeCount: catalog.codes.length };
  }

  catalogEnvelope() {
    if (!fs.existsSync(this.catalogFile)) return null;
    const envelope = JSON.parse(fs.readFileSync(this.catalogFile, 'utf8'));
    validateCatalog(envelope.catalog);
    if (envelope.authority !== 'The-Crucible' || !/^[a-f0-9]{40}$/i.test(envelope.sourceCommit || '')) throw new Error('Stored CRU catalog authority metadata is invalid.');
    if (sha256(JSON.stringify(envelope.catalog)) !== envelope.catalogSha256) throw new Error('Stored CRU catalog failed integrity verification.');
    return envelope;
  }

  explain(code) {
    const envelope = this.catalogEnvelope();
    if (!envelope) return null;
    const entry = envelope.catalog.codes.find((item) => item.code === code);
    if (!entry) return null;
    const occurrences = this.occurrences().filter((item) => item.code === code).slice(-20);
    return {
      ...entry,
      authority: envelope.authority,
      sourceRepository: envelope.sourceRepository,
      sourceCommit: envelope.sourceCommit,
      catalogSha256: envelope.catalogSha256,
      occurrences,
    };
  }

  remember({ code, component, event, repository = null, commit = null, evidenceDigest = null, outcome = null, correlationId = null, observedAt = new Date().toISOString() }) {
    const explanation = this.explain(code);
    if (!explanation) throw new Error(`Cannot remember unknown or uninstalled CRU code ${code}.`);
    if (!component || !event) throw new Error('CRU occurrence requires component and event.');
    const record = {
      schemaVersion: 1,
      id: sha256({ code, component, event, repository, commit, evidenceDigest, outcome, correlationId, observedAt }),
      code,
      component,
      event,
      repository,
      commit,
      evidenceDigest,
      outcome,
      correlationId,
      observedAt,
      crucibleSourceCommit: explanation.sourceCommit,
      catalogSha256: explanation.catalogSha256,
      effect: 'diagnostic-memory-only',
    };
    fs.appendFileSync(this.occurrenceFile, `${JSON.stringify(record)}\n`, { encoding: 'utf8', mode: 0o600 });
    return record;
  }

  occurrences(limit = 2000) {
    if (!fs.existsSync(this.occurrenceFile)) return [];
    return fs.readFileSync(this.occurrenceFile, 'utf8').split(/\r?\n/).filter(Boolean).slice(-Math.max(1, Math.min(10000, limit))).map((line) => JSON.parse(line));
  }

  enrich(value) {
    return extractCruCodes(value).map((code) => ({ code, explanation: this.explain(code) }));
  }
}

module.exports = { CruDiagnosticMemory, extractCruCodes, validateCatalog, sha256 };
