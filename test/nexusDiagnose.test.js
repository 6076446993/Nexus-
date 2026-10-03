'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { diagnoseSnapshot } = require('../scripts/nexusDiagnose');

test('diagnosis is read-only evidence and preserves target authority', () => {
  const snapshot = {
    repository: 'The-Crucible',
    commit: 'abcdef1234567',
    files: {
      'governingDocuments/NEXUS-SYSTEM-CONFORMANCE.md':
        'canonical Nexus event identity preserves authority and lineage; Assimilation is obsolete and must not route new work.',
    },
  };
  const original = JSON.stringify(snapshot);
  const report = diagnoseSnapshot(snapshot);
  assert.equal(JSON.stringify(snapshot), original);
  assert.equal(report.mode, 'read-only');
  assert.equal(report.mutatesTarget, false);
  assert.equal(report.authority.mayWriteTarget, false);
  assert.equal(report.authority.mayRepairTarget, false);
  assert.equal(report.summary.status, 'DIAGNOSED');
});

test('active Assimilation semantics fail diagnosis without modifying the source', () => {
  const snapshot = {
    repository: 'NVIDIA-NIM-CONSOLE',
    commit: '1234567abcdef',
    files: {
      'NEXUS-SYSTEM-CONFORMANCE.md': 'canonical Nexus authority and lineage contract',
      'routing.md': 'Route failed tasks into the Assimilation system for reconciliation.',
    },
  };
  const before = JSON.stringify(snapshot);
  const report = diagnoseSnapshot(snapshot);
  assert.equal(JSON.stringify(snapshot), before);
  assert.equal(report.summary.status, 'BLOCKED');
  assert.ok(report.findings.some((item) => item.code === 'NXD-ASSIMILATION-ACTIVE'));
});

test('unregistered repositories are outside diagnosis authority', () => {
  assert.throws(() => diagnoseSnapshot({
    repository: 'Smoker-Hours-Tracker',
    commit: 'abcdef1',
    files: {},
  }), /unregistered Nexus component/);
});

test('immutable version identity is mandatory', () => {
  assert.throws(() => diagnoseSnapshot({
    repository: 'Learning-Worker',
    commit: 'main',
    files: {},
  }), /immutable commit\/version reference/);
});
