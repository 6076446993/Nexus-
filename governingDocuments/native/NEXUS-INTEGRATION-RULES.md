# Nexus Integration Rules

## Purpose

These rules govern all cross-repository integration within the Nexus architecture.

The participating repositories remain independent repositories with independent governance while operating as one coordinated system.

## Core Rules

1. Integration transfers information, not authority.
2. The originating repository remains authoritative for records it owns.
3. Every handoff preserves identity, provenance, lineage, and version.
4. Every authoritative state has a traceable source.
5. A receiving repository may not manufacture a missing authoritative result.
6. Presentation state is never automatically authoritative state.
7. AI output is not verification.
8. Governance approval is not technical or scientific verification.
9. Custody is not verification.
10. Extraction is not trusted knowledge.
11. Supersession preserves ancestry.
12. Historical records are not silently overwritten.
13. Required failures are fail-closed.
14. Missing required evidence produces an incomplete, blocked, failed, rejected, or unverified state as appropriate.
15. Security and authorization boundaries survive integration.

## Repository Authority

- NVIDIA-NIM-CONSOLE: prompt-based coding interface, presentation, workflow orchestration.
- AI-collaboration-: AI collaboration, provider routing, council execution, reasoning aggregation.
- The-Crucible: verification, checks, evidence assessment, failure classification, enforcement.
- Learning-Worker: candidate learning extraction and learning promotion requests.
- Vetting-and-Governance-oversite.: governance decisions, STOP/CLEAR, oversight, custody eligibility.
- Crucible-Vetted-Learning-State: controlled learning custody and custody lifecycle.
- Nexus: system integration architecture.

## Handoff Requirements

Every cross-repository handoff must define:

- Sender
- Receiver
- Object
- Required fields
- Authority owner
- Validation requirements
- Failure behavior
- Version behavior
- Lineage requirements
- Audit requirements

## Prohibited Shortcuts

No component may:

- Bypass Crucible verification.
- Bypass independent governance.
- Write directly into trusted custody without its required contract.
- Convert model consensus into verification.
- Convert custody into proof.
- Suppress or rewrite a failure.
- Drop lineage to simplify transport.
- Treat a UI status as an authoritative state without the source record.

## Compatibility

A contract change must preserve backward traceability or explicitly define a governed migration.

Incompatible changes require versioned contracts and migration evidence.

## Fail-Closed Rule

Where a required authority, evidence, authorization, lineage, or verification state cannot be established, the integration must not report success.

## Audit Rule

Every cross-repository state transition must be reconstructable from persistent records.

## Architectural Rule

Nexus coordinates the interfaces.

Each repository retains the authority assigned to it.

No integration may weaken the governance of another repository.
