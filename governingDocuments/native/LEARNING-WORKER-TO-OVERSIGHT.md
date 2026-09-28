# Learning-Worker to Oversight Contract

## Purpose

This document defines the controlled handoff between Learning-Worker and Vetting-and-Governance-oversite. within the Nexus architecture.

The contract governs the transition from extracted learning material and promotion requests into formal governance review.

A handoff transfers information and a request for review.

A handoff does not transfer authority.

Learning-Worker remains the authority for learning extraction and learning artifacts.

Vetting-and-Governance-oversite. remains the authority for governance decisions and custody eligibility.

---

# Participating Repositories

## Source

**Learning-Worker**

Owns:

- SourceMaterial
- ExtractionRecord
- CandidateEvidence
- LearningPackage
- LearningDelivery
- LearningVersion
- LearningPromotionRequest

## Receiving Authority

**Vetting-and-Governance-oversite.**

Owns:

- GovernanceDecision
- GovernanceReview
- CustodyEligibility
- Oversight authorization
- STOP and CLEAR governance actions

---

# Handoff Contract

The Learning-Worker to Oversight handoff consists of a LearningPromotionRequest and its referenced learning artifacts.

Minimum handoff contents:

- Request Identifier
- Delivery Identifier
- Learning Package Reference
- Candidate Evidence References
- Source References
- Lineage Reference
- Provenance References
- Version References
- Extraction References
- Handoff Timestamp
- Handoff Status

The receiving governance system must be able to trace every submitted learning artifact back to its source and extraction activity.

---

# Authority Boundary

Learning-Worker may:

- Extract source material.
- Produce candidate evidence.
- Assemble learning packages.
- Create learning deliveries.
- Create learning versions.
- Submit promotion requests.

Learning-Worker may not:

- Declare extracted material verified.
- Declare extracted material approved.
- Grant custody eligibility.
- Issue governance decisions.
- Activate governed knowledge.

Vetting-and-Governance-oversite. may:

- Review submitted learning artifacts.
- Evaluate governance eligibility.
- Issue governance decisions.
- Approve or reject promotion.
- Grant or deny custody eligibility.
- Issue STOP or CLEAR governance actions.

Vetting-and-Governance-oversite. may not:

- Rewrite source evidence as if it were extracted by Learning-Worker.
- Change the historical extraction record.
- Convert a governance decision into scientific verification.
- Assume custody ownership without a custody handoff.

---

# Required Traceability

Every promotion request shall preserve the following chain:

Source Material

↓

Extraction Record

↓

Candidate Evidence

↓

Learning Package

↓

Learning Delivery

↓

Learning Promotion Request

↓

Governance Review

↓

Governance Decision

↓

Custody Eligibility

↓

Custody Handoff

Each step must reference the preceding state where applicable.

Missing lineage is a handoff failure.

Missing provenance is a handoff failure.

Missing version information is a handoff failure.

---

# Handoff States

## PREPARED

Learning-Worker has assembled the delivery and promotion request.

No governance decision exists.

## SUBMITTED

The promotion request has been delivered to Vetting-and-Governance-oversite.

The request is awaiting governance review.

## UNDER_REVIEW

Governance review is active.

The submitted learning remains unverified and unapproved.

## APPROVED

Governance has approved the requested promotion according to applicable governance rules.

Approval does not itself constitute scientific verification or custody storage.

## REJECTED

Governance has rejected the promotion request.

The rejection must preserve its reason, timestamp, lineage, and decision reference.

## STOPPED

Governance has issued a STOP action affecting the handoff or its processing.

The STOP action must remain auditable.

## SUPERSEDED

The request has been replaced by a later governed version.

The superseding request must preserve ancestry and lineage.

---

# Acceptance Requirements

Vetting-and-Governance-oversite. shall not accept a promotion request as reviewable unless the required references are present.

At minimum, acceptance requires:

1. A unique request identifier.
2. A valid LearningDelivery reference.
3. Candidate evidence references.
4. Source references.
5. A lineage reference.
6. Provenance references.
7. Version information.
8. A timestamp.
9. Sufficient extraction history to reconstruct the origin of the submitted material.

An incomplete request shall be rejected or returned for correction rather than treated as approved.

---

# Governance Review Boundary

Governance review determines whether the submitted learning is eligible for the next governed state.

Governance review does not:

- Establish scientific truth.
- Replace Crucible verification.
- Rewrite source material.
- Create evidence that was not submitted.
- Transfer learning authority to the oversight repository.

Verification remains the responsibility of The-Crucible.

Custody remains the responsibility of Crucible-Vetted-Learning-State.

---

# Custody Handoff

When governance determines that a learning package is eligible for custody, the governance decision shall reference:

- The approved LearningDelivery.
- The applicable LearningPromotionRequest.
- The governance decision.
- The lineage chain.
- The version being transferred.
- The custody eligibility reference.

The resulting custody handoff is a separate contract boundary.

Governance eligibility does not itself create a CustodyRecord.

Crucible-Vetted-Learning-State must establish the custody record before the artifact is considered to be in custody.

---

# Rejection and Recovery

A rejected promotion request remains part of the audit trail.

Learning-Worker may create a corrected or new version only through a traceable subsequent learning operation.

A corrected submission shall preserve:

- The original request reference.
- The reason for correction.
- The new version identifier.
- The new extraction or transformation record where applicable.
- The new lineage reference.

Historical rejected states shall not be silently overwritten.

---

# Failure Conditions

The handoff is considered invalid when:

- Required lineage is missing.
- Source provenance cannot be established.
- Version ancestry cannot be established.
- The submitted artifact cannot be reconstructed.
- Learning-Worker claims verification or governance authority.
- Oversight modifies historical learning evidence without a governed record.
- Governance approval is represented as scientific verification.
- Governance approval is represented as custody.
- Custody is assumed without a CustodyRecord.
- A STOP action is ignored or bypassed.

Failures shall be recorded using the Nexus failure and lineage contracts.

---

# Audit Requirements

Every handoff shall be independently reconstructable from repository records.

The audit trail shall identify:

- Who or what created the learning artifact.
- Which source material was used.
- Which extraction produced the candidate.
- Which version was submitted.
- When the handoff occurred.
- Which governance review processed it.
- Which governance decision resulted.
- Whether custody eligibility was granted.
- Which custody record subsequently accepted the artifact, if applicable.

No handoff may depend on an undocumented state held only in memory or an ephemeral process.

---

# Contract Invariants

The following invariants apply:

1. Learning authority remains with Learning-Worker.
2. Governance authority remains with Vetting-and-Governance-oversite.
3. Verification authority remains with The-Crucible.
4. Custody authority remains with Crucible-Vetted-Learning-State.
5. Information transfer does not transfer authority.
6. Governance approval does not equal verification.
7. Governance approval does not equal custody.
8. Historical learning records remain traceable.
9. Every promotion request preserves lineage and provenance.
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
- NEXUS-CROSS-REPOSITORY-HANDOFFS.md
- CONTRACT-GOVERNANCE-MANIFEST.md

---

# Architectural Rule

Learning-Worker prepares and submits learning.

Vetting-and-Governance-oversite. governs eligibility.

The-Crucible verifies.

Crucible-Vetted-Learning-State holds custody.

No stage may silently assume the authority of another stage.
