# Nexus Dev Log

A running log of notable AI-agent-driven changes to this repository, and a
plain-language explanation of the governance that keeps multiple AI agents
(Claude, Codex, Gemini, Copilot, or anything else) working on Nexus without
stepping on each other. The binding rules live in `AGENTS.md`; this file
and `AI-HANDOFF.json` are the readable summary and the machine-readable
index of that same policy, kept in sync with it.

## Plain-language: AI conflict governance

If two AI agents — or two separate runs of the same agent — make changes
that could clash, that clash gets written down as an entry in
`AI-CONFLICTS.json` instead of one side silently overwriting the other. Any
conflict entry that's still open or incomplete blocks The Crucible CI gate,
so nothing broken can be promoted to `main` while a real conflict sits
unresolved. Nobody force-pushes, deletes, renames, or overwrites a branch
just to make a conflict disappear — it gets resolved and the resolution is
recorded.

## Plain-language: agent communication policy

Every attended progress or completion check-in an AI sends to the
repository owner must open with a timestamp, written as
`YYYY-MM-DD HH:MM:SS EDT/EST` (e.g. `2026-08-28 08:10:42 EDT`). That way the
owner can tell how fresh a status update is at a glance, and anyone
reading back later — including a different AI agent picking up the work —
can reconstruct the real order of events across multiple agents and
sessions. The full policy is recorded in `AI-HANDOFF.json` under
`agentCommunicationPolicy`.

## Plain-language: branch authority

Ordinary AI work happens only on `Development-branch`. An AI doesn't create
or use `claude/*`, `codex/*`, or other auxiliary branches, and doesn't
touch `main` directly, unless the repository owner explicitly authorizes
that exact branch or operation in the current conversation — and that
authorization doesn't carry over to the next task. `main` only changes
through the protected `promote-development-to-main.yml` workflow. The full,
binding rules are in `AGENTS.md`.

## Log

- **2026-08-29** — Added the trusted Crucible v0.3.0 learning host. Nexus now
  derives the learning identity from the canonical path of the workspace that
  is actually open, generates a per-workspace RSA signing identity and random
  transport key, encrypts private material with Electron `safeStorage`, and
  exposes no secret-bearing configuration channel to the renderer. The plugin
  security flow installs and enables the governed bundled plugin, performs its
  secure configuration inside the bounded host adapter, and fails closed unless
  the plugin's readiness check is green. Tests cover identity separation, OIDC
  claims and signature, token lifetime, secret scoping, installation,
  configuration persistence, and end-to-end readiness.
  The same change also records the already-public Firebase client identifier as
  a narrow, expiring Crucible security-review exception and keeps an expected
  missing branch-link manifest from resembling fabricated success handling.
- **2026-08-28** — Added `AI-HANDOFF.json`, this file, and the
  agent-communication timestamp policy, per the repository owner's request.

- **2026-09-29** — Codex repaired missing final newlines in Nexus Authority Matrix, Nexus Contract Categories, and Nexus Learning Lifecycle. Document text and authority boundaries remain intact. Current main run 36620737015 identified exactly these three pre-check actions; development CI verification is pending.

## Repair verification — 2026-09-29T20:44:46.705369Z

Codex verified hosted Crucible run 36626731433 succeeded on Development-branch commit 29d5ca3. The existing automatic repair restored the missing selfRepairCommit.js and regenerated the inventory after the governance newline changes. Local inventory verification covers all 276 files. This checkpoint triggers a fresh full release audit; the older e9dfcba audit failed on the stale inventory and is not evidence against the repaired tip. Production main remains unpromoted through the protected path.

## Self-repair workflow directory correction — 2026-09-29T20:49:16.522563Z

Codex diagnosed run 36628631446: checkout lives under target, but the apply step ran at workspace root and could not find scripts/selfRepairCommit.js. Added working-directory: target to that step; no script semantics or gates changed. Regenerated inventory and ran the existing pre-push privacy/inventory gate. Hosted verification pending.

## Release audit continuity — 2026-09-29

Inspected failed runs 36626647598, 36452779119, 36452770832, and 36451081117: inventory verification rejected stale manifests after governance/repair edits. Later audit 36632450016 passed all eleven jobs at d1d4d5d; promoted main 0538c5a has the identical tree 542b43da. Added main push auditing and full audit dispatch after bounded Development self-repair, so repaired commits and production promotion receive automatic verification. Historical failures remain as evidence. No release published; fresh hosted gates required.
