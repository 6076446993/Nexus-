# Learning-Worker to Oversight Contract

## Purpose

This contract governs the controlled handoff from Learning-Worker candidate output to Vetting-and-Governance-oversite. for governance review.

The handoff transfers candidate information and a request for governed review. It does not transfer authority.

Learning-Worker remains responsible for source processing, candidate extraction, candidate evidence, and extraction lineage.

Vetting-and-Governance-oversite. remains responsible for governance review, governance decisions, STOP/CLEAR actions, and custody eligibility.

---

# Source Governance Boundary

Learning-Worker's repository governance establishes that extracted material is candidate evidence and begins as INSUFFICIENT_EVIDENCE.

Learning-Worker does not verify claims, approve learning, promote trusted knowledge, or write trusted custody.

The authoritative handoff object is the candidate/oversight export produced by Learning-Worker. A governance request may reference that export, but the worker must not represent the request as an approval or verification result.

---

# Handoff Object

The handoff consists of an OversightExport or equivalent candidate-only delivery and its referenced extraction records.

Minimum handoff contents:

- Export Identifier
- Candidate Evidence References
- Source References
- Extraction References
- Worker Version
- Lineage References
- Provenance References
- Content or Artifact Version
- Handoff Timestamp
- Handoff Status

Where the implementation uses a separate review-request identifier, that identifier must reference the candidate export rather than replacing it.

The receiving governance system must be able to reconstruct each candidate from its source and extraction history.

---

# Authority Boundary

Learning-Worker may:

- Consume inputs allowed by its own source-intake governance.
- Extract candidate evidence.
- Preserve source, worker, custody, and export lineage.
- Publish candidate-only oversight exports.
- Submit candidate material for governance review through the defined integration path.

Learning-Worker may not:

- Declare extracted material verified.
- Declare extracted material approved.
- Grant custody eligibility.
- Issue governance decisions.
- Write trusted Crucible learning state.
- Treat candidate evidence as knowledge.

Vetting-and-Governance-oversite. may:

- Receive and review candidate exports.
- Evaluate governance eligibility.
- Issue governance decisions.
- Grant or deny custody eligibility.
- Issue STOP or CLEAR governance actions.

Vetting-and-Governance-oversite. may not:

- Rewrite historical extraction records as if produced by Learning-Worker.
- Convert candidate evidence into scientific verification.
- Treat governance approval as custody acceptance.
- Assume custody ownership without the custody contract.

---

# Required Traceability

The candidate handoff shall preserve:

Source Material
↓
Extraction Record
↓
Candidate Evidence
↓
Oversight Export
↓
Governance Review
↓
Governance Decision
↓
Custody Eligibility
↓
Custody Handoff

Each transition must reference the preceding state where applicable.

Missing lineage, provenance, or version information is a handoff failure.

---

# Handoff States

## PREPARED

Learning-Worker has produced the candidate export.

No governance decision exists.

## SUBMITTED

The candidate export has been delivered for governance review.

## UNDER_REVIEW

Governance review is active.

The candidate remains unverified and unapproved.

## APPROVED

Governance has approved the eligible transition according to applicable governance rules.

Approval does not constitute scientific verification or custody.

## REJECTED

Governance has rejected the submitted candidate or requested transition.

The rejection preserves its reason, timestamp, lineage, and decision reference.

## STOPPED

Governance has issued a STOP affecting the handoff or its processing.

The STOP remains auditable.

## SUPERSEDED

A later candidate/export or governed review has superseded the current handoff.

Ancestry must remain preserved.

---

# Acceptance Requirements

Vetting-and-Governance-oversite. shall not treat a candidate export as reviewable unless the required references are present.

At minimum:

1. Unique export identifier.
2. Candidate evidence references.
3. Source references.
4. Extraction references.
5. Worker version.
6. Lineage references.
7. Provenance references.
8. Version information.
9. Handoff timestamp.
10. Sufficient extraction history to reconstruct the candidate.

An incomplete export shall be rejected, quarantined, or returned for correction according to the applicable governance rules. It shall not be treated as approved.

---

# Governance Review Boundary

Governance review determines whether the submitted candidate is eligible for the next governed state.

Governance review does not:

- Establish scientific truth.
- Replace Crucible verification.
- Rewrite source material.
- Create evidence that was not submitted.
- Transfer extraction authority to oversight.
- Create custody merely by issuing approval.

Verification remains the responsibility of The-Crucible.

Custody remains the responsibility of Crucible-Vetted-Learning-State.

---

# Custody Transition

When governance determines that a candidate or learning package is eligible for custody, the GovernanceDecision and CustodyEligibility must identify:

- The exact approved candidate/export version.
- The applicable governance review.
- The governance decision.
- The lineage chain.
- The provenance chain.
- The custody transition reference.

Governance eligibility does not create a CustodyRecord.

Crucible-Vetted-Learning-State must establish custody through its own acceptance contract.

---

# Rejection and Recovery

A rejected candidate or review remains part of the audit trail.

Learning-Worker may produce a corrected candidate only through a traceable subsequent extraction or transformation.

A corrected submission must preserve:

- The original candidate/export reference.
- The reason for correction.
- The new version identifier.
- The new extraction/transformation reference.
- The new lineage reference.

Historical rejected states must not be silently overwritten.

---

# Failure Conditions

The handoff is invalid when:

- Required lineage is missing.
- Source provenance cannot be established.
- Version ancestry cannot be established.
- The candidate cannot be reconstructed.
- Learning-Worker claims verification, approval, or custody authority.
- Oversight modifies historical extraction evidence without a governed record.
- Governance approval is represented as scientific verification.
- Governance approval is represented as custody.
- A STOP is ignored or bypassed.
- Candidate evidence is written directly into trusted custody without the custody contract.

Failures shall be recorded using the Nexus failure and lineage contracts.

---

# Audit Requirements

The audit trail shall identify:

- Source material.
- Extraction activity.
- Worker version.
- Candidate/export version.
- Handoff timestamp.
- Governance review.
- Governance decision.
- Custody eligibility, if granted.
- Subsequent custody record, if accepted.

No authoritative transition may depend solely on undocumented in-memory or ephemeral state.

---

# Invariants

1. Learning-Worker owns candidate extraction.
2. Vetting-and-Governance-oversite. owns governance.
3. The-Crucible owns verification.
4. Crucible-Vetted-Learning-State owns custody.
5. Candidate evidence is not knowledge.
6. Governance approval is not verification.
7. Governance approval is not custody.
8. Information transfer does not transfer authority.
9. Lineage and provenance survive the handoff.
10. No repository may bypass a required governance boundary.

---

# Related Contracts

- LEARNING-CONTRACTS.md
- GOVERNANCE-CONTRACTS.md
- CUSTODY-CONTRACTS.md
- EVIDENCE-CONTRACTS.md
- VERIFICATION-CONTRACTS.md
- LINEAGE-CONTRACTS.md
- FAILURE-CONTRACTS.md
- OVERSIGHT-TO-CUSTODY.md
- NEXUS-CROSS-REPOSITORY-HANDOFFS.md
- CONTRACT-GOVERNANCE-MANIFEST.md

---

# Architectural Rule

Learning-Worker produces candidate evidence and candidate-only oversight exports.

Vetting-and-Governance-oversite. governs eligibility.

Crucible-Vetted-Learning-State establishes custody.

The-Crucible independently verifies where verification is required.

No stage may silently assume the authority of another stage.
