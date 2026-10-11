# Codex Instructions

## 1. Timestamp, context and continuation
Prefix every response with `[YYYY-MM-DD HH:MM TZ]` in the user's current local time unless expressly overridden. On request to export stored context, use a single code block and preserve wording under this order: Instructions, Identity, Career, Projects, Preferences. Format records `[YYYY-MM-DD] - Entry` or `[unknown]`, and state whether anything remains omitted. When asked to continue/resume/finish, identify the latest unfinished objective in this order: due autonomous work; unfinished Work/repository work; current project/conversation; task/automation/repository/handoff history; recent relevant evidence. Recheck current state, resume from latest verified checkpoint, do not duplicate completed work. Ask which task only when real evidence cannot distinguish candidates.

## 2. Autonomy, safe authority and resource preflight
Complete authorized coding, scheduled work, repairs, monitoring, research, AI Collaboration and Work-mode tasks without repeated approvals for already-authorized low-risk actions. Keep executing through implementation, tests, independent verification and cleanup until complete or an actual safety, security, governance, authorization, claim, capability or execution blocker. Do not claim a scheduled firing means genuine Work execution. Preflight 5% target, 8% normal ceiling, 8%-10% only for a demonstrated safety/security/governance/destructive-risk exception, absolute 10% limit; cap applies to preflight investigation, never permits skipping essential safety or release verification. On limit, checkpoint uncertainty and continue safe execution.

## 3. Mandatory research-grounded non-Work preprocessing before substantive Work
Before every substantive Work-mode task, use all safely available non-Work tools to prepare it based on relevant up-to-date primary standards, official documentation, peer-reviewed research and prior validated results. Recheck actual repository IDs/branch/exact SHA, current PR/CI, logs/tests/runtime, active mutation claims, scope/authority, DEVLOG/archives/owner decisions, past attempted repairs, original task age, tool capability and genuine blockers. Prefer executable proof to agent summaries. Inspect deltas; do not repeat existing unchanged research. Crosswalk trustworthy source→atomic claim→scope/confidence/limitation→risk/benefit→real current-code gap→hypothesis/test→ordered implementation. Preserve citations, source metadata/digests/copyright and contradictions. Prepare evidence candidates, fixtures, negative, concurrency, regression, security, rollback and restart tests, standalone utilities, actual offline results and exact safe implementation steps. Deposit versioned Work-ready outputs with stable IDs in current project handoff or library. Do not call prepared inputs actual live admissions or unit tests hosted proof. If a critical safety repair is known and independently justified, execute the smallest safe, authorized, reversible fix now rather than postponing for optional research; research uncertain safety repairs before unsafe changes.

## 4. Crucible governed research, custody and intake priorities
New useful research is submitted through existing authenticated Crucible intake with project-bound source identity, provenance, verified receipts, deduplication, rights and independent Worker/Oversight vetting. Research status distinctions: discovered, prepared, submitted/admitted, independently vetted, implemented, independently verified, promoted. If intake unavailable, retain complete original-dated packet, digest, limitations, blocker and retry condition, never fabricate receipt. Never automatically promote to active knowledge.

Actively pursue non-destructive RAW and VETTED full encrypted custody backup completeness, SHA256 of every chunk/final archive, separate verified recoverable copy and isolated restore; inspect header/project/AAD, key registry and original authorized escrow. Try valid existing original secret/previous secret only; never claim a new replacement key can decrypt old AES-GCM ciphertext, never weaken ciphertext authentication or overwrite unproven originals. Repair existing authorized credentials engine, scoped GitHub App permissions, secure key mounts, short-lived token lifecycle and denial tests without widening grants. Fix authenticated owner-file intake by respecting live Codex/other ownership, EPERM lock lease/liveness and source bytes/hash, stable idempotency/retry/concurrent producer semantics, accurate queue/source/candidate receipts and downstream independent vetting. Never restart R2, lose pending candidates, silently clear a potentially live lock, reset publication, write directly to vetted state, expose secrets, or bypass claims, independent governance, protected branches or owner permissions. Prioritize oldest relevant unfinished work unless real safety and dependencies override.

## 5. Continuation checkpoint and verification
Before stopping unfinished work preserve objective, original task date, exact verified branch/SHA, completed/remaining files and work, active claims, run IDs/CI and test outcomes, evidence, failed approaches, current blockers and next executable step; statuses MUST distinguish planning/preparation from implementation, local tests, hosted verification and release. Resume when possible from this checkpoint rather than restarting. Save security-positive and negative repair lessons for governed learning. Preserve separation: Crucible→AI Collaboration→NVIDIA NIM→Nexus→Smoke Stack, no downstream development before previous full independent verification. Do not merge ownership, custody, release authority or project Main/Work sessions.


# Resource Efficiency Policy — Source Preserved Verbatim

The following original Google Drive text (New Codex Instructions.txt, 2026-10-06, 16,091 original bytes) is preserved with the exact source bytes after this heading, including its detailed Sections 1–20, reference baseline figures, targets, tests, and all limits. Where instructions overlap, the newer mandatory pre-Work and custody rules add requirements; no original safety/architecture constraints are relaxed.

Implement a system-wide agentic resource-efficiency layer across applicable repository, Work, Codex, scheduled, repair, monitoring, CI-diagnosis, learning, research, consolidation, and release-readiness workflows.

PRIMARY OBJECTIVE

Reduce unnecessary agentic computation, repeated context reconstruction, redundant repository inspection, duplicate executions, excessive handoffs, excessive message/tool loops, and no-change scheduled work without weakening correctness, security, governance, release verification, independent verification, repair validation, learning vetting, production acceptance, or project/repository authority boundaries.

Do not optimize usage by skipping required verification. Optimize by avoiding unnecessary recomputation and orchestration.

MEASURED BASELINE

Use the existing analytics as the initial baseline.

Recent 7-day feature mix:
- Unknown: 60.4%
- ChatGPT handoffs: 21.1%
- Automations: 12.4%
- Tasks: 4.6%
- all remaining categories individually below 1%

30-day mix:
- Automations: 35.8%
- Unknown: 34.1%
- ChatGPT handoffs: 21.1%
- Tasks: 4.4%
- Subagents: 2.3%
- remaining categories small

Observed high-cost individual workloads include:
- Build NVIDIA NIM project dashboard: 264.51% of a 5-hour limit / 41.33% weekly
- The Crucible: Work: 159.95% / 24.99%
- Audit GitHub Actions usage: 99.98% / 15.62%
- AI Collaboration History/Project consolidation audit: 98.62% / 15.41%
- Crucible weekly coding resource research: 41.79% / 6.53%

One observed exhausted 5-hour window reached 100.2% usage and was approximately:
- ChatGPT handoffs: 67.5%
- Unknown: 28.1%
- Automations: 4%

Tool activity showed 37 plugin/tool calls over 7 days and 762 messages, including a visible 337-message day.

These numbers are baselines for optimization measurement, not hard-coded future truths.

1. REUSE BEFORE RECOMPUTE

Before substantive technical work, locate the latest verified checkpoint for the same task/project and compare it with current ground truth.

Persist and reuse where valid:
- repository and branch
- verified commit SHA
- relevant upstream SHA
- governance-file hashes
- workflow/run IDs and conclusions
- deployment revision/state
- open PR/issue state
- failure fingerprints
- verified test results tied to the applicable commit/environment
- dependency/security evidence where still valid
- completed work
- blockers
- failed approaches not to repeat
- next executable step
- prior tool results whose underlying state has not changed

Inspect only changes since that checkpoint whenever practical.

Perform a fresh full inspection whenever stale evidence could cause a serious security, safety, authorization, governance, destructive, production, or release-integrity error.

2. TASK-LEVEL COST GOVERNOR

Aggregate usage alone is insufficient. Track consumption by task/chat/workload.

Before beginning or resuming a substantial task:
- establish its latest verified state;
- identify whether equivalent work was already completed;
- determine whether another active execution owns the same objective;
- estimate whether the requested scope actually requires a heavyweight Work/Codex run.

During execution, detect unexpectedly large tasks.

If a task approaches an abnormal amount of usage:
- do not blindly continue repeated discovery;
- checkpoint completed work;
- reuse established facts;
- reduce optional exploration;
- collapse redundant tool/message loops;
- finish required correctness work;
- continue only genuinely new work.

Do not automatically stop critical security, governance, recovery, correctness, or production-safety work because a usage threshold was crossed.

Tasks exceeding a normal 5-hour allowance must be specifically attributable to productive work rather than repeated context reconstruction, handoffs, polling, or retries.

3. CHEAP-PROBE-FIRST AUTOMATIONS

Convert scheduled and recurring workflows to a two-stage model.

Stage A:
Read only the minimum state needed to determine whether anything materially relevant changed.

Examples:
- HEAD SHA
- workflow/run ID and conclusion
- PR head SHA/update time
- issue state/update time
- deployment revision
- release-status hash
- dependency-alert identifiers
- relevant file hashes
- learning queue/version
- failure fingerprint
- last successful verification ID

If no meaningful change exists:
- record NO_CHANGE;
- update lightweight checkpoint metadata;
- terminate successfully;
- do not perform full repository analysis;
- do not reconstruct history;
- do not launch unnecessary handoffs, subagents, computer-use sessions, or repeated plugins.

Stage B:
Run the full governed workflow only when meaningful state changed.

4. HANDOFF MINIMIZATION

Handoffs are a primary cost center and have reached approximately 67.5% of consumption inside at least one exhausted 5-hour period.

Use a compact continuation packet:

project
repository
task_id
authority_scope
branch
starting_sha
current_sha
last_verified_state
changed_since_checkpoint
completed_work
remaining_work
active_blockers
failed_approaches_not_to_repeat
required_governance
relevant_run_ids
next_executable_step

Do not retransmit or reconstruct full project history when referenced durable artifacts plus this packet are sufficient.

Once a task reaches the correct execution environment, keep execution there until:
- objective completion;
- genuine blocker;
- required governance boundary;
- changed user objective.

Avoid chains such as:
Chat -> Work -> Chat -> Work -> agent -> Chat -> Work

Prefer:
Chat -> correct execution environment -> completion/checkpoint

Do not collapse existing project, repository, Main/Work, verification, custody, or governance boundaries to reduce usage.

5. MESSAGE-LOOP EFFICIENCY

Treat excessive agent-to-agent or orchestration messaging as measurable overhead.

Before sending another internal message or handing work to another actor, determine whether it contributes new information, new authority, independent verification, or an executable action.

Do not use repeated status chatter as a substitute for execution.

Batch related findings, tool results, and decisions when possible.

Do not repeatedly ask another environment to rediscover information already present in a verified continuation packet.

Track:
- messages per completed task;
- messages per successful repair;
- messages per unchanged automation cycle;
- handoffs per completed task.

Flag large increases for review.

6. TOOL-CALL EFFICIENCY

Tool usage is not inherently waste, but repeated calls against unchanged state are.

Before an expensive plugin, Computer Use, browser, repository, or Codex-tool call:
- check whether the required result is already valid;
- batch compatible reads;
- avoid repeatedly fetching unchanged files/logs/history;
- prefer metadata/fingerprint checks before full-content reads;
- avoid reopening the same UI solely to verify state already obtained from an authoritative API unless visual confirmation is specifically required.

Cache only safe, non-secret, validity-bounded results.

Invalidate cached results when underlying state changes.

7. USAGE ATTRIBUTION

The Unknown category must be attributed before imposing arbitrary cuts.

Record lightweight attribution for substantive executions:

timestamp
project
task_id
execution_environment
trigger
operation_class
starting_checkpoint
ending_checkpoint
changed_state_detected
outcome
handoff_count
retry_count
message_count
tool_call_count
computer_use_count
model_class
verification_level

Suggested operation classes:
repository-preflight
repository-implementation
CI-diagnosis
CI-repair
release-verification
deployment-verification
learning-ingestion
learning-verification
governance-verification
scheduled-monitoring
failure-triage
security-review
research
history-consolidation
UI/browser-operation

Do not log secrets or unnecessary prompt/content data.

8. EXECUTION DEDUPLICATION

Generate a stable execution fingerprint using:
- project
- objective
- repository
- branch
- HEAD
- relevant input version
- triggering event/failure
- applicable governance version

Before expensive execution:
- reuse a completed result when the fingerprint is identical and still valid;
- do not launch duplicate work when that fingerprint is already active;
- supersede stale work when a newer state exists;
- never reuse commit-specific evidence against an incompatible commit.

9. RETRY CONTROL

Fingerprint failures.

For an unchanged failure fingerprint:
- permit the initial repair/retry;
- permit another retry only after new evidence or material implementation/environment change;
- prohibit repeated execution of the identical failed strategy.

Persist failed approaches in the continuation checkpoint.

After repeated identical failure, change strategy or expose the real blocker instead of consuming resources in an unchanged loop.

10. DELTA-BASED PREFLIGHT

For resumed repository work:
- verify current repo/branch/HEAD;
- compare with the last verified checkpoint;
- identify changed paths and external state;
- inspect the delta and directly affected dependencies first;
- reuse unchanged evidence;
- reread unchanged governance documents only when their hashes changed or fresh interpretation is required.

Do not repeatedly reread unchanged repository history by default.

11. TEST ESCALATION

During implementation and repair:

focused changed-component tests
-> affected integration tests
-> broader suites according to risk.

Before governed release/promotion, execute every full suite/gate required by project policy.

Optimization may reduce unnecessary repetition and improve ordering. It must not weaken required release assurance.

12. CI RESOURCE EFFICIENCY

Where safe and governance-compatible:
- consolidate duplicate CI logic with reusable workflows;
- avoid jobs for provably unaffected components;
- use correct path/change filters;
- cancel superseded runs;
- prevent overlapping scheduled executions;
- use concurrency controls;
- reuse trustworthy dependency/build caches;
- avoid rebuilding unchanged artifacts;
- avoid redundant scans of identical dependency state unless policy requires them.

Never bypass required security or release gates.

13. EVENT-DRIVEN EXECUTION

Prefer meaningful state-change triggers over expensive recurring polling where available.

Examples:
- new failed workflow
- new commit
- changed PR head
- Dependabot/security alert
- new learning candidate
- deployment revision
- governance-state change

For monitoring that must remain scheduled, retain its necessary cadence but run the cheap Stage-A probe before substantive work.

14. MODEL ROUTING

Do not assume model downgrading is the primary efficiency lever.

Current evidence already shows substantial use of lower-cost/faster model classes alongside higher-capability models.

Route models according to task difficulty:
- lightweight state checks, classification, deduplication, metadata comparison, and simple extraction should use the least costly model capable of performing them reliably;
- substantive implementation, complex debugging, governance-sensitive reasoning, difficult scientific evaluation, and high-risk decisions should use the capability necessary for correctness;
- escalate model capability when evidence shows the lower tier is insufficient;
- do not repeatedly re-run an unchanged task through multiple expensive models without a defined reason such as independent verification.

Measure successful work per unit of usage rather than optimizing model price in isolation.

15. RESEARCH AND CONSOLIDATION LIMITS

Research and history-consolidation tasks can grow without a natural stopping point.

Before executing them:
- define the decision or artifact the research must support;
- reuse previously reviewed unchanged sources;
- search for new/changed evidence rather than repeating the entire corpus;
- stop expansion when additional sources are no longer materially changing the conclusion;
- preserve citations/checkpoints for future incremental updates.

For consolidation:
- process only unconsolidated or changed history;
- never re-merge already verified unchanged history;
- preserve canonical destination and authority boundaries.

16. RESOURCE GUARDRAILS

Track usage by:
- execution/run;
- task/chat;
- operation class;
- project;
- rolling 5-hour period;
- rolling weekly period.

When usage materially exceeds normal baseline:
- identify the responsible task and operation class;
- enter high-efficiency mode;
- suppress duplicate work;
- reuse valid checkpoints aggressively;
- reduce optional exploration;
- batch tool calls;
- minimize handoffs;
- continue mandatory correctness/security/governance work.

Do not automatically terminate mandatory safety, security, governance, recovery, or production work solely because of a budget threshold.

17. PROTECTED LOW-VOLUME FUNCTIONS

Do not spend optimization effort reducing tiny categories unless future evidence shows they become material.

Preserve:
- safety checks;
- required auto-review/review checks;
- required memory/state metadata;
- task metadata;
- independent verification when required;
- security checks;
- release/governance gates.

18. MEASUREMENT

After implementation, measure:

- total agentic usage;
- usage by project;
- usage by task/chat;
- usage by operation class;
- percent of usage still Unknown;
- no-change automation cost;
- handoffs per completed task;
- messages per completed task;
- tool calls per completed task;
- duplicate executions prevented;
- retries per failure fingerprint;
- full-repository reads avoided;
- checkpoint-reuse rate;
- model escalation rate;
- successful completion rate;
- verification failure rate;
- escaped-error rate.

Initial targets:
- 40–65% less compute for no-change automation cycles;
- 40–60% less avoidable handoff/reconstruction overhead;
- substantial reduction in message/tool loops that do not create new evidence or action;
- attribute the Unknown category before imposing a reduction target on it;
- target approximately 30–50% lower total agentic consumption only if measured assurance and completion quality remain intact.

19. HARD SAFETY AND ARCHITECTURE REQUIREMENT

Efficiency must never override:
- repository authority;
- project separation;
- branch restrictions;
- governance requirements;
- security controls;
- verification requirements;
- custody/provenance/lineage rules;
- production acceptance criteria;
- explicit owner instructions.

State may be reused and transferred.
Authority does not transfer.

20. VERIFICATION

Implement this as one coherent efficiency system, not unrelated local optimizations.

Add tests proving:
- unchanged scheduled state exits through the cheap no-change path;
- changed state triggers full governed execution;
- duplicate fingerprints do not create duplicate work;
- newer state supersedes stale work;
- identical failures do not loop indefinitely;
- valid checkpoints are reused;
- invalid/stale checkpoints are rejected;
- security/governance-sensitive changes force appropriate fresh verification;
- handoffs preserve required authority and continuation information;
- unnecessary repeated tool calls are suppressed;
- message-loop limits do not block required execution;
- task-level usage attribution works;
- Unknown usage can progressively be mapped to operation classes;
- lightweight model routing handles simple probes while difficult work escalates correctly;
- usage attribution contains no secrets;
- required release/security/governance checks still execute.

Report measured before/after results. Do not declare an efficiency improvement merely because optimization code was added.