'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const MAX_CONTEXT_FILES = 20;
const MAX_CONTEXT_BYTES = 96 * 1024;

function sha256(value) {
  return crypto.createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
}

function git(folder, args) {
  return execFileSync('git', args, { cwd: folder, encoding: 'utf8', windowsHide: true, maxBuffer: 16 * 1024 * 1024 }).trim();
}

function parseGitHubRemote(remote) {
  const value = String(remote || '').trim();
  let match = /^git@github\.com:([^/]+)\/([^/]+?)(?:\.git)?$/.exec(value);
  if (match) return { owner: match[1], repo: match[2], full: `${match[1]}/${match[2]}` };
  match = /^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/.exec(value);
  if (match) return { owner: match[1], repo: match[2], full: `${match[1]}/${match[2]}` };
  return null;
}

function repositoryState(folder) {
  const root = fs.realpathSync(folder);
  const coordinates = parseGitHubRemote(git(root, ['remote', 'get-url', 'origin']));
  if (!coordinates) throw new Error('Native Nexus coding requires a GitHub origin repository.');
  const commit = git(root, ['rev-parse', 'HEAD']);
  if (!/^[a-f0-9]{40}$/i.test(commit)) throw new Error('Could not resolve an immutable Git commit.');
  const branch = git(root, ['branch', '--show-current']);
  const status = git(root, ['status', '--porcelain']);
  return { root, coordinates, commit, branch, clean: status === '', status };
}

function safeContext(folder, taskDescription, { maxFiles = MAX_CONTEXT_FILES, maxBytes = MAX_CONTEXT_BYTES } = {}) {
  const root = fs.realpathSync(folder);
  const sensitive = /(^|\/)(\.env(?:\.|$)|.*secret.*|.*credential.*|.*private[-_.]?key.*|id_rsa|id_ed25519|\.nim_session_state\.json|\.nexus-nim\/)/i;
  const allowed = /\.(ps1|py|js|cjs|mjs|ts|tsx|jsx|json|md|yml|yaml|txt|html|css|scss|xml|toml|ini|cfg)$/i;
  const terms = [...new Set(String(taskDescription || '').toLowerCase().split(/[^a-z0-9_.-]+/).filter((term) => term.length >= 3))];
  const files = git(root, ['ls-files']).split(/\r?\n/).filter(Boolean);
  const candidates = [];
  for (const rel of files) {
    const normalized = rel.replace(/\\/g, '/');
    if (sensitive.test(normalized) || !allowed.test(normalized)) continue;
    const full = path.resolve(root, rel);
    const within = path.relative(root, full);
    if (!within || within.startsWith('..') || path.isAbsolute(within) || !fs.existsSync(full) || !fs.statSync(full).isFile()) continue;
    const bytes = fs.statSync(full).size;
    if (bytes > 32768) continue;
    let score = /(^|\/)(README|package\.json|\.thecrucible\.json)$/i.test(normalized) ? 2 : 0;
    const lower = normalized.toLowerCase();
    for (const term of terms) if (lower.includes(term)) score += 10;
    candidates.push({ rel: normalized, full, bytes, score });
  }
  candidates.sort((a, b) => b.score - a.score || a.bytes - b.bytes || a.rel.localeCompare(b.rel));
  const selected = [];
  let used = 0;
  for (const item of candidates) {
    if (selected.length >= maxFiles || used + item.bytes > maxBytes) continue;
    selected.push({ path: item.rel, content: fs.readFileSync(item.full, 'utf8') });
    used += item.bytes;
  }
  return selected;
}

function validateCodingResult(result, expected) {
  if (!result || result.status !== 'proposal-ready' || result.coder !== 'nvidia-nim') throw new Error(result?.blockReason || 'Native Nexus coding session returned no usable NIM proposal.');
  if (result.authorizationGranted !== false) throw new Error('AI Collaboration violated the Nexus authority boundary.');
  const proposal = result.codingProposal;
  if (!proposal || proposal.authorizationGranted !== false) throw new Error('Coding proposal is missing or improperly authorized.');
  if (proposal.repositoryReference !== expected.repositoryReference) throw new Error('Coding proposal repository identity does not match the current project.');
  if (proposal.targetVersion !== expected.targetVersion) throw new Error('Coding proposal target version does not match the current HEAD.');
  if (proposal.lineageReference !== expected.lineageReference || proposal.taskReference !== expected.taskReference) throw new Error('Coding proposal lineage does not match the request.');
  if (proposal.proposedChanges?.format !== 'unified-diff' || !/^diff --git /m.test(String(proposal.proposedChanges?.content || ''))) throw new Error('Coding proposal is not a unified Git diff.');
  return proposal;
}

async function requestCodingSession({ baseUrl, bearerToken, folder, taskDescription, struggle = null, fetchImpl = globalThis.fetch }) {
  if (!baseUrl || !bearerToken) throw new Error('Native Nexus coding requires AI Collaboration service URL and bearer token.');
  if (typeof fetchImpl !== 'function') throw new Error('Native Nexus coding requires fetch.');
  const state = repositoryState(folder);
  if (!state.clean) throw new Error('Native Nexus coding requires a clean working tree so exact-version lineage cannot mix with existing changes.');
  const taskReference = `task-${crypto.randomUUID()}`;
  const lineageReference = `lineage-${crypto.randomUUID()}`;
  const request = {
    taskReference,
    repositoryReference: state.coordinates.full,
    targetVersion: state.commit,
    taskDescription: String(taskDescription || '').trim(),
    lineageReference,
    relevantFiles: safeContext(folder, taskDescription),
    ...(struggle?.reasons?.length ? { struggle } : {}),
  };
  if (!request.taskDescription) throw new Error('Coding task is required.');
  const response = await fetchImpl(`${String(baseUrl).replace(/\/$/, '')}/api/nexus/coding-session`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${bearerToken}` },
    body: JSON.stringify(request),
  });
  const raw = await response.text();
  let result;
  try { result = raw ? JSON.parse(raw) : {}; } catch { throw new Error(`AI Collaboration returned invalid JSON (HTTP ${response.status}).`); }
  if (!response.ok) throw new Error(result?.blockReason || result?.error?.message || `AI Collaboration returned HTTP ${response.status}.`);
  const proposal = validateCodingResult(result, request);
  return {
    schemaVersion: 1,
    sessionId: `nexus-coding-${crypto.randomUUID()}`,
    requestedAt: new Date().toISOString(),
    taskDescription: request.taskDescription,
    taskReference,
    lineageReference,
    repositoryReference: request.repositoryReference,
    targetVersion: request.targetVersion,
    branch: state.branch,
    proposal,
    coder: result.coder,
    councilInvoked: result.councilInvoked === true,
    councilReview: result.councilReview || null,
    state: 'PROPOSED',
    authorizationGranted: false,
  };
}

function applyCodingSession(folder, session) {
  const state = repositoryState(folder);
  if (!state.clean) throw new Error('Working tree changed before proposal application.');
  if (state.coordinates.full !== session.repositoryReference || state.commit !== session.targetVersion) throw new Error('Repository moved after the coding proposal was generated.');
  const patch = path.join(os.tmpdir(), `${session.sessionId}.diff`);
  fs.writeFileSync(patch, session.proposal.proposedChanges.content, 'utf8');
  try {
    git(folder, ['apply', '--check', '--whitespace=error-all', '--', patch]);
    git(folder, ['apply', '--whitespace=error-all', '--', patch]);
    git(folder, ['diff', '--check']);
    const diff = git(folder, ['diff', '--binary', session.targetVersion]);
    if (!diff) throw new Error('Coding proposal produced no auditable working-tree diff.');
    const paths = git(folder, ['diff', '--name-only', session.targetVersion]).split(/\r?\n/).filter(Boolean);
    return {
      ...session,
      appliedAt: new Date().toISOString(),
      executedPaths: paths,
      executedDiffSha256: sha256(diff + '\n'),
      state: 'EXECUTED',
    };
  } catch (error) {
    try { git(folder, ['reset', '--hard', session.targetVersion]); } catch {}
    try { git(folder, ['clean', '-fd']); } catch {}
    throw error;
  } finally {
    try { fs.unlinkSync(patch); } catch {}
  }
}

function rollbackCodingSession(folder, session) {
  const state = repositoryState(folder);
  if (state.commit !== session.targetVersion) throw new Error('Cannot rollback a coding session after repository HEAD changed.');
  git(folder, ['reset', '--hard', session.targetVersion]);
  git(folder, ['clean', '-fd']);
  return { ...session, state: 'ROLLED_BACK', rolledBackAt: new Date().toISOString() };
}

module.exports = {
  MAX_CONTEXT_FILES,
  MAX_CONTEXT_BYTES,
  sha256,
  parseGitHubRemote,
  repositoryState,
  safeContext,
  validateCodingResult,
  requestCodingSession,
  applyCodingSession,
  rollbackCodingSession,
};
