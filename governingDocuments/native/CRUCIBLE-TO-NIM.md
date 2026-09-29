# Crucible to NIM Integration Specification

## Purpose

This document defines the governed interaction between `The-Crucible` and `NVIDIA-NIM-CONSOLE`.

The Crucible returns independently generated verification results to the console for presentation, workflow control, and subsequent action.

`NVIDIA-NIM-CONSOLE` may display and act upon Crucible results according to its own governing responsibilities, but it may not reinterpret, manufacture, alter, or suppress the underlying verification record.

Verification authority remains with The-Crucible.

---

# Integration Overview

Source Repository:

* The-Crucible

Destination Repository:

* NVIDIA-NIM-CONSOLE

Purpose:

* Return verification results
* Return failure information
* Return remediation requirements
* Return evidence references
* Provide verification status for user-facing workflows

---

# Ownership Boundaries

## The-Crucible Owns

* Verification execution
* Verification results
* Verification checks
* Evidence classification
* Failure classification
* Verification lineage
* Verification attestations

## NVIDIA-NIM-CONSOLE Owns

* Result presentation
* User interaction
* Workflow orchestration
* Display state
* Request routing
* User-visible status

The console does not become the owner of verification merely because it receives or displays a verification result.

---

# Allowed Handoff Objects

## VerificationResult

Represents the authoritative outcome of a Crucible verification activity.

### Required Fields

Verification Identifier

Request Reference

Verification Outcome

Check References

Evidence References

Timestamp

Lineage Reference

Version Reference

---

## FailureRecord

Represents a failure identified by Crucible.

### Required Fields

Failure Identifier

Failure Code Reference

Affected Component

Failure Description

Verification Reference

Evidence References

Timestamp

Lineage Reference

---

## RemediationRecord

Represents corrective action required following a Crucible failure.

### Required Fields

Remediation Identifier

Failure Reference

Required Action

Timestamp

Lineage Reference

---

## VerificationStatus

Represents the current Crucible status associated with a request.

### Valid States

PENDING

INCONCLUSIVE

VERIFIED

REJECTED

FAILED

SUPERSEDED

---

# Result Consumption Contract

NVIDIA-NIM-CONSOLE may consume a Crucible result only as a distinct, traceable record.

The console shall preserve:

- Verification Identifier
- Request Reference
- Verification Outcome
- Evidence References
- Failure References
- Remediation References
- Timestamp
- Lineage Reference
- Version Reference

The console may transform a result for presentation, but the transformation must not change the authoritative meaning of the Crucible record.

---

# Verification Boundary

The following distinctions are mandatory:

VerificationResult is not a GovernanceDecision.

VerificationResult is not a CustodyRecord.

VerificationResult is not a LearningPackage.

VerificationResult is not a user-interface assertion.

A displayed status is a representation of the underlying Crucible result, not a new verification authority.

NVIDIA-NIM-CONSOLE shall not:

- Mark an unverified request as VERIFIED.
- Convert a governance approval into verification.
- Create verification evidence on behalf of The-Crucible.
- Suppress a failure record from the authoritative audit trail.
- Replace a Crucible result with a locally generated equivalent.

---

# Request and Response Lineage

Every verification request entering the Crucible path must have a traceable request reference.

The resulting VerificationResult shall reference:

1. The originating request.
2. The verification activity.
3. The checks performed.
4. The evidence used.
5. The version evaluated.
6. The resulting verification state.

The console must retain enough information to reconstruct the relationship between the request and the returned result.

---

# Failure Handling

When The-Crucible returns a FailureRecord, NVIDIA-NIM-CONSOLE shall preserve the failure identifier and failure-code reference.

A failure shall not be silently converted into a generic success or neutral status.

If remediation is required, the RemediationRecord shall remain linked to the FailureRecord.

A console-side presentation error must remain distinguishable from a Crucible verification failure.

---

# Result Integrity

Crucible results shall be treated as authoritative records for verification state.

NVIDIA-NIM-CONSOLE may:

- Display results.
- Route results to the appropriate workflow.
- Request remediation.
- Present evidence references.
- Present lineage information.
- Initiate a subsequent governed action.

NVIDIA-NIM-CONSOLE may not:

- Alter the authoritative result.
- Change verification ownership.
- Invent missing evidence.
- Remove lineage.
- Rewrite historical results.
- Treat presentation state as verification state.

---

# Supersession

When a later Crucible verification supersedes an earlier result, the console shall preserve the relationship between the two versions.

The superseding result must identify its predecessor through the applicable lineage/version references.

Historical results remain auditable.

Supersession does not erase the earlier result.

---

# Operational States

The console may represent the following states:

PENDING

INCONCLUSIVE

VERIFIED

REJECTED

FAILED

SUPERSEDED

The state displayed to a user must correspond to the current authoritative Crucible record.

If no authoritative Crucible result exists, the console must not manufacture one.

---

# Remediation Boundary

Remediation requested by Crucible is an operational requirement, not proof that remediation has been completed.

The console may:

- Present remediation requirements.
- Route remediation work.
- Record that remediation was requested.
- Request a subsequent verification.

The console may not:

- Declare remediation complete without evidence.
- Convert a remediation request into verification.
- Remove a failure solely because remediation was requested.

Completion remains subject to the applicable verification process.

---

# Audit Requirements

The handoff shall be independently reconstructable.

Audit records must identify:

- Originating request.
- Crucible verification identifier.
- Verification checks.
- Evidence references.
- Verification outcome.
- Failure and remediation references where applicable.
- Console receipt/consumption timestamp.
- Display or workflow reference.
- Version and lineage references.

No authoritative verification state may exist only in an ephemeral console session.

---

# Failure Conditions

The integration is invalid when:

- A result loses its lineage.
- Evidence references are discarded.
- A failure is hidden from the authoritative record.
- The console changes a Crucible verification outcome.
- A console-generated status is represented as Crucible verification.
- A governance decision is represented as scientific verification.
- A custody state is represented as verification.
- A missing Crucible result is replaced with a fabricated result.

Failures shall be recorded according to FAILURE-CONTRACTS.md and linked to the applicable lineage records.

---

# Contract Invariants

1. The-Crucible owns verification.
2. NVIDIA-NIM-CONSOLE owns presentation and workflow interaction.
3. Verification results remain traceable to their originating request.
4. Evidence and failure references remain attached to the result.
5. Presentation does not transfer verification authority.
6. Governance does not become verification through presentation.
7. Custody does not become verification through presentation.
8. Historical verification results remain auditable.
9. Supersession preserves ancestry.
10. No missing result may be silently fabricated.

---

# Related Contracts

- EVIDENCE-CONTRACTS.md
- VERIFICATION-CONTRACTS.md
- FAILURE-CONTRACTS.md
- LINEAGE-CONTRACTS.md
- GOVERNANCE-CONTRACTS.md
- CUSTODY-CONTRACTS.md
- NEXUS-CROSS-REPOSITORY-HANDOFFS.md
- CONTRACT-GOVERNANCE-MANIFEST.md

---

# Architectural Rule

The-Crucible verifies.

NVIDIA-NIM-CONSOLE receives, presents, and orchestrates around verification results.

The console may act on a Crucible result, but it may never become the source of that verification result.
