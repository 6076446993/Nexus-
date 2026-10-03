# Nexus System Integration Contract

## Purpose

The active Nexus repositories are components of one coordinated Nexus system. Repository separation is an implementation and authority boundary, not a license for incompatible state, handoff, failure, evidence, or lifecycle semantics.

Assimilation is obsolete and excluded. No active component may route new work through an Assimilation lifecycle or treat assimilation as a Nexus authority.

## Active components

- Nexus- — architecture coordination and integration governance.
- NVIDIA-NIM-CONSOLE — user interface and routing.
- AI-collaboration- — bounded multi-AI reasoning and collaboration.
- The-Crucible — failure classification and verification authority.
- Learning-Worker — candidate extraction.
- Crucible-Learning-State — encrypted project-bound durable candidate state.
- Crucible-Vetted-Learning-State — independently vetted durable custody.
- Vetting-and-Governance-oversite. — governance and independent vetting.
- Nexus-Public-CI — public hosted execution/status boundary.

Smoke Stack is outside Nexus.

## One-system rule

Every cross-component operation must preserve one canonical Nexus envelope. A component may add role-specific fields but must not silently reinterpret, delete, or upgrade canonical fields.

Required canonical fields:

- schemaVersion
- eventId
- eventType
- timestamp
- nexusSystemId
- sourceComponent
- targetComponent
- projectIdentity
- taskRunId when available
- sourceCommit or immutable version reference
- lifecycleState
- authority
- evidenceReferences
- lineage
- uncertainty and dissent when applicable
- failureReferences
- remediationReferences
- learningDisposition
- governanceDecisionReference when applicable
- custodyReference when applicable
- verificationReference when applicable
- humanAuthorizationReference when required

## Canonical lifecycle semantics

UNVERIFIED, EVIDENCE_AVAILABLE, VERIFICATION_IN_PROGRESS, VERIFIED, GOVERNED, CUSTODIED, BLOCKED, REJECTED, and SUPERSEDED have the same meaning across every component.

No component may infer a stronger state from a weaker state. UI presentation, AI consensus, extraction, storage, custody, governance approval, CI success, or repair activity cannot independently substitute for Crucible verification.

## Canonical event families

All active components must recognize, preserve, or explicitly reject as out-of-role:

- TASK_REQUESTED / TASK_ROUTED / TASK_BLOCKED / TASK_COMPLETED
- COUNCIL_REQUESTED / COUNCIL_RESULT / COUNCIL_DISSENT
- EVIDENCE_CREATED / EVIDENCE_CHALLENGED / EVIDENCE_SUPERSEDED
- FAILURE_OBSERVED / FAILURE_CLASSIFIED
- REPAIR_ATTEMPTED / REPAIR_REGRESSION / REMEDIATION_VERIFIED
- LEARNING_CANDIDATE / LEARNING_INHIBITED / LEARNING_VERIFIED
- GOVERNANCE_REVIEW / GOVERNANCE_APPROVED / GOVERNANCE_REJECTED / GOVERNANCE_REVOKED
- CUSTODY_STORED / CUSTODY_QUARANTINED / CUSTODY_REVOKED
- VERIFICATION_STARTED / VERIFICATION_PASSED / VERIFICATION_FAILED
- CI_STARTED / CI_PASSED / CI_FAILED
- RELEASE_CANDIDATE / RELEASE_BLOCKED / RELEASE_VERIFIED

## Authority preservation

Nexus coordinates but does not manufacture verification, governance, custody, or learning authority.
AI Collaboration reasons but does not verify or promote.
NIM presents/routes but does not upgrade state.
Crucible classifies failures and verifies evidence within its contract.
Learning Worker extracts candidates but does not create knowledge.
Learning State stores encrypted candidate state but does not vet it.
Vetted Learning State preserves independently vetted custody but does not self-approve promotion.
Oversight governs/vets but does not substitute for Crucible scientific verification.
Public CI reports execution evidence but does not acquire private-repository or promotion authority.

## Failure and repair integration

Every component emits failures into the same lineage. Repair attempts are linked to the failure they address. If a repair introduces or materially contributes to a new failure, the system creates a REPAIR_REGRESSION candidate preserving repair, pre-repair, failure, correction, and prevention evidence. Crucible classifies causality. Confirmed repair regressions enter governed learning as negative evidence and remain historical after remediation.

## Learning integration

Learning candidates preserve the canonical envelope and exact source/evidence lineage. Extraction, durable storage, vetting, custody, verification, and active use remain distinct states. No component may promote a candidate by relabeling it during transport.

## User-facing integration

NIM and any future Nexus interface should present Nexus as one system while retaining component provenance. A user should not need to understand repository boundaries to follow a task, but the interface must expose which component currently holds the task, its state, blockers, evidence, and authority when requested.

## CI and status integration

Private and public CI use the same task/event identity and immutable commit/version references. Public CI may publish bounded status but cannot convert CI success into verification, governance, custody, or release authority.

## Conformance

A component is Nexus-conformant only when it:
1. accepts or maps the canonical envelope without semantic loss;
2. preserves immutable lineage and authority references;
3. fails closed on missing mandatory identity/version/evidence;
4. never upgrades lifecycle state outside its authority;
5. records rejection/blocking rather than silently dropping an event;
6. retains repair/failure history;
7. can correlate its output to the originating Nexus event/task.

Cross-repository compatibility is an operational requirement, not merely documentation. Tests and adapters should enforce this contract at each active handoff.

## Obsolete Assimilation

Assimilation is not an active Nexus component, lifecycle stage, authority, or routing destination. Historical Assimilation records may remain as immutable history, but active code, policies, interfaces, and handoffs must not depend on Assimilation.
