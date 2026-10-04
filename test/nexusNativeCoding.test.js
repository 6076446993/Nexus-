'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const {
  parseGitHubRemote,
  repositoryState,
  safeContext,
  requestCodingSession,
  applyCodingSession,
  rollbackCodingSession,
} = require('../nexusNativeCoding');

function commit(folder, message) {
  execFileSync('git', ['commit', '-m', message], {
    cwd: folder,
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: 'Nexus Test',
      GIT_AUTHOR_EMAIL: 'nexus-test.invalid',
      GIT_COMMITTER_NAME: 'Nexus Test',
      GIT_COMMITTER_EMAIL: 'nexus-test.invalid',
    },
  });
}

function fixture() {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-native-coding-'));
  execFileSync('git', ['init'], { cwd: folder });
  execFileSync('git', ['remote', 'add', 'origin', 'https://github.com/owner/example.git'], { cwd: folder });
  fs.writeFileSync(path.join(folder, 'a.txt'), 'old\n');
  fs.writeFileSync(path.join(folder, 'README.md'), '# Example\n');
  execFileSync('git', ['add', '.'], { cwd: folder });
  commit(folder, 'base');
  return folder;
}

test('parses supported GitHub remotes', () => {
  assert.equal(parseGitHubRemote('https://github.com/owner/repo.git').full, 'owner/repo');
  assert.equal(parseGitHubRemote(`git${'@'}github.com:owner/repo.git`).full, 'owner/repo');
  assert.equal(parseGitHubRemote('https://example.com/owner/repo.git'), null);
});

test('safe context excludes secret-like files and binds immutable state', () => {
  const folder = fixture();
  fs.writeFileSync(path.join(folder, '.env'), 'TOKEN=secret');
  execFileSync('git', ['add', '-f', '.env'], { cwd: folder });
  commit(folder, 'track-secret-fixture');
  const state = repositoryState(folder);
  assert.match(state.commit, /^[a-f0-9]{40}$/);
  assert.equal(state.coordinates.full, 'owner/example');
  assert.ok(!safeContext(folder, 'change README').some(item => item.path === '.env'));
  fs.rmSync(folder, { recursive: true, force: true });
});

test('native request pins repository and exact commit and accepts NIM proposal only', async () => {
  const folder = fixture();
  const commit = repositoryState(folder).commit;
  const fetchImpl = async (_url, options) => {
    const body = JSON.parse(options.body);
    assert.equal(body.repositoryReference, 'owner/example');
    assert.equal(body.targetVersion, commit);
    return {
      ok: true,
      status: 200,
      text: async () => JSON.stringify({
        integration: 'nexus-native-api',
        status: 'proposal-ready',
        coder: 'nvidia-nim',
        councilInvoked: false,
        authorizationGranted: false,
        codingProposal: {
          schemaVersion: 1,
          proposalId: 'p1',
          taskReference: body.taskReference,
          repositoryReference: body.repositoryReference,
          targetVersion: body.targetVersion,
          proposedChanges: { format: 'unified-diff', content: 'diff --git a/a.txt b/a.txt\n--- a/a.txt\n+++ b/a.txt\n@@ -1 +1 @@\n-old\n+new\n' },
          reasoningReference: 'a'.repeat(64),
          timestamp: '2026-10-03T15:00:00.000Z',
          lineageReference: body.lineageReference,
          collaborationArtifactSha256: 'b'.repeat(64),
          authorizationGranted: false,
        },
      }),
    };
  };
  const session = await requestCodingSession({ baseUrl: 'https://service.test', bearerToken: 'token', folder, taskDescription: 'change old to new', fetchImpl });
  assert.equal(session.coder, 'nvidia-nim');
  assert.equal(session.targetVersion, commit);
  assert.equal(session.state, 'PROPOSED');
  fs.rmSync(folder, { recursive: true, force: true });
});

test('apply is exact-base, auditable, and rollback restores the original tree', () => {
  const folder = fixture();
  const state = repositoryState(folder);
  const session = {
    sessionId: path.basename(folder),
    repositoryReference: state.coordinates.full,
    targetVersion: state.commit,
    proposal: {
      proposedChanges: { content: 'diff --git a/a.txt b/a.txt\n--- a/a.txt\n+++ b/a.txt\n@@ -1 +1 @@\n-old\n+new\n' },
    },
  };
  const applied = applyCodingSession(folder, session);
  assert.equal(applied.state, 'EXECUTED');
  assert.deepEqual(applied.executedPaths, ['a.txt']);
  assert.equal(fs.readFileSync(path.join(folder, 'a.txt'), 'utf8').replace(/\r\n/g, '\n'), 'new\n');
  rollbackCodingSession(folder, applied);
  assert.equal(fs.readFileSync(path.join(folder, 'a.txt'), 'utf8').replace(/\r\n/g, '\n'), 'old\n');
  assert.equal(repositoryState(folder).clean, true);
  fs.rmSync(folder, { recursive: true, force: true });
});
