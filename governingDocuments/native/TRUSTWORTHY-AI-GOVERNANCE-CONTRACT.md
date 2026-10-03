# Nexus Trustworthy AI Governance Contract

## Purpose

This contract applies trustworthy-AI governance principles across the Nexus architecture while preserving the existing repository, authority, verification, learning, custody, and oversight boundaries.

It is informed by the AI Advisory Council Terms of Reference supplied for the AI Collaboration council and the OECD Recommendation of the Council on Artificial Intelligence. Those sources are governance inputs; they do not supersede Nexus authority contracts.

Smoke Stack and Smoker-Hours-Tracker are explicitly outside this contract.

## Scope

This contract applies to Nexus-, NVIDIA-NIM-CONSOLE, AI-collaboration-, The-Crucible, Learning-Worker, Crucible-Learning-State, Crucible-Vetted-Learning-State, Vetting-and-Governance-oversite., and Nexus-Public-CI only to the extent that each component handles AI output, evidence, learning, verification, governance, custody, presentation, or lifecycle controls.

## Architectural Invariants

1. Trustworthy-AI safeguards do not merge repository authority.
2. AI output, consensus, extraction, evidence, approval, custody, presentation, and verification remain distinct states.
3. Existing stricter Nexus, Crucible, security, release, promotion, privacy, evidence, lineage, and governance controls prevail.
4. Human authorization is required wherever existing Nexus authority requires it; this contract creates no new autonomous authority.
5. Every material AI-derived artifact must remain traceable to its source, version, producing system or provider where known, applicable evidence, verification state, governance state, and custody state.
6. Uncertainty, dissent, failed checks, limitations, and unresolved risks must not be silently removed during cross-repository handoff.
7. A user-facing component must not present a weaker state as a stronger one.
8. A STOP, rejection, revocation, supersession, unsafe state, or failed verification must remain challengeable, auditable, and recoverable through the applicable governed process.

## Trustworthy-AI Safeguards

### Human agency and oversight
AI assists governed work; it does not acquire authority merely by producing an answer. Applicable human or owner authority, STOP/CLEAR controls, promotion boundaries, and repository ownership remain effective.

### Transparency and explainability
Where an AI-derived result materially affects a decision or action, preserve enough information to identify what produced it, its relevant limitations, the evidence or inputs used where available and permitted, and the authoritative state applied to it.

### Challengeability
Material AI-derived results must retain references sufficient for an authorized reviewer to question, reproduce where feasible, reject, supersede, or route the result for further verification without rewriting history.

### Robustness, security, and safety
AI-enabled paths must fail closed when required authorization, identity, evidence, provenance, security, or verification is missing. Applicable components must support bounded STOP, repair, rollback, supersession, or decommissioning according to their existing authority.

### Accountability and traceability
Material decisions and transitions preserve version, lineage, evidence, decision, and responsible authority references. Governance approval is not verification; verification is not custody; custody is not authority.

### Lifecycle risk management
Trustworthy-AI controls apply across planning/design, source/data intake, building/adaptation, testing/evaluation/verification, deployment/presentation, operation/monitoring, repair, and retirement/supersession. Each repository implements only the lifecycle phases inside its existing responsibility.

### Information integrity
AI-generated or transformed information must not be represented as independently verified merely because multiple models agree. Known provenance, conflicts, dissent, stale state, and verification status must remain visible to downstream governed components.

## Repository Responsibilities

### Nexus-
Owns architecture-wide discovery, integration contracts, lifecycle mapping, and preservation of authority boundaries. Nexus does not take over verification, governance, extraction, custody, or application authority.

### AI-collaboration-
Applies council-specific participation, dissent, threshold, evidence, uncertainty, provenance, and human-oversight rules. Council consensus is not Crucible verification.

### The-Crucible
Applies trustworthy-AI safeguards to verification, claim evaluation, repair, conflict handling, and learning gates. It preserves evidence, uncertainty, reproducibility, failure state, and safe repair/stop behavior without taking governance or custody authority.

### Learning-Worker
Preserves source provenance, extraction lineage, uncertainty, versioning, privacy/data boundaries, and candidate status. Extracted or generated candidates remain candidates until downstream governed transitions occur.

### Vetting-and-Governance-oversite.
Applies independent review, conflicts/disclosure where applicable, explicit decisions, dissent or unresolved risk records, STOP/CLEAR governance, reviewability, and custody eligibility. Oversight approval is not scientific or technical proof.

### Crucible-Vetted-Learning-State
Preserves immutable custody lineage, accepted version, governing decision reference, evidence references, provenance, supersession/revocation state, and withdrawal/deprecation history. Custody does not create authority or verification.

### Crucible-Learning-State
Preserves project-bound durable learning provenance and version lineage without presenting stored learning state as independently vetted or verified knowledge.

### NVIDIA-NIM-CONSOLE
Presents AI/council provenance and authoritative verification/governance state when available, material limitations or uncertainty where relevant, and must not convert presentation into authority. Human users retain applicable control over proposed actions.

### Nexus-Public-CI
May expose public execution evidence and trustworthy-AI control status without gaining authority over private repositories or disclosing protected source, credentials, or private evidence.

## Cross-Repository Handoff Minimum

For material AI-derived artifacts, handoffs preserve as applicable:
- artifact/task identifier;
- source and version/commit reference;
- producing component/provider identity where known;
- evidence and provenance references;
- verification status and verifier reference;
- governance status and decision reference;
- custody status and version reference;
- uncertainty, dissent, failed checks, and unresolved risk;
- STOP/rejection/supersession state;
- receiving repository and expected authority boundary.

Missing mandatory fields fail closed under the applicable existing contract and feed the existing failure/repair path rather than being silently inferred.

## Review and Repair

Governance defects are recorded under existing failure contracts and routed through existing repair/learning mechanisms where authorized. Repair must preserve the defective historical record and the evidence of correction.

This contract must be reviewed when participating repositories, AI providers, council composition rules, learning/custody paths, or authoritative lifecycle transitions materially change.

## Related Nexus Contracts

- NEXUS-GOVERNANCE-MANIFEST.md
- NEXUS-REPOSITORY-MAP.md
- Nexus Trust Model.md
- Nexus Learning Lifecycle.md
- AUTHORITY-CONTRACTS.md
- GOVERNANCE-CONTRACTS.md
- EVIDENCE-CONTRACTS.md
- VERIFICATION-CONTRACTS.md
- LEARNING-CONTRACTS.md
- CUSTODY-CONTRACTS.md
- LINEAGE-CONTRACTS.md
- FAILURE-CONTRACTS.md
- NEXUS-CROSS-REPOSITORY-HANDOFFS.md

## Architectural Rule

Trustworthy AI in Nexus means preserving human authority, evidence, traceability, challengeability, safety, accountability, lifecycle risk controls, and information integrity without collapsing the architecture's existing separation of powers.
