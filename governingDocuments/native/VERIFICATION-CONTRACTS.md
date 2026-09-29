# Verification Contracts

## Purpose

This document defines verification-related contracts used throughout the Nexus architecture.

Verification determines whether the applicable evidence and checks support a defined claim, hypothesis, capability, or system behavior.

Verification authority belongs exclusively to The-Crucible.

Verification is distinct from governance, custody, learning extraction, and interface presentation.

---

# Foundational Principles

- Evidence is not proof.
- Verification is not governance.
- Verification is not custody.
- Verification is not authority transfer.
- Verification requires applicable evidence and checks.
- Verification requires auditability.
- Verification requires reproducibility where applicable.
- A transport or presentation event is never itself verification.

---

# VerificationRequest

## Purpose

Requests a governed verification activity against a defined target and scope.

## Owner

The requesting component creates the request; The-Crucible owns verification execution.

## Required Fields

- Verification Request Identifier
- Target Reference
- Target Version
- Verification Scope
- Requested Checks
- Evidence References
- Origin Request Reference
- Lineage Reference
- Timestamp

## Rules

The request must identify the exact target version and scope.

An incomplete request must not be interpreted as a successful verification request.

---

# VerificationResult

## Purpose

Represents the authoritative outcome of a verification activity.

## Owner

The-Crucible

## Required Fields

- Verification Identifier
- Verification Request Reference
- Verification Scope
- Verification Outcome
- Evidence Package Reference
- Check References
- Timestamp
- Verifier Reference
- Lineage Reference
- Target Version
- Failure Reference when applicable

## Outcomes

- PENDING
- INCONCLUSIVE
- VERIFIED
- REJECTED
- FAILED
- SUPERSEDED

## Rules

Verification results must preserve lineage and evidence references.

A VERIFIED result requires the applicable checks and evidence to have actually completed according to The-Crucible's governing rules.

No receiving component may manufacture, upgrade, downgrade, or silently reinterpret the authoritative result.

A superseded result remains auditable and retains ancestry to the superseding activity.

---

# VerificationCheck

## Purpose

Represents a specific verification action performed during an evaluation.

## Required Fields

- Check Identifier
- Check Name
- Check Description
- Check Outcome
- Timestamp
- Evidence References
- Lineage Reference
- Target Version

## Outcomes

- PASSED
- FAILED
- BLOCKED
- INCONCLUSIVE
- NOT_APPLICABLE

## Rules

A check outcome must be supported by its recorded execution/evidence.

A blocked check is not a passed check.

A check from a different target version cannot be silently reused as the current result.

---

# EvidencePackage

## Purpose

Identifies the evidence set used by a verification activity.

## Required Fields

- Evidence Package Identifier
- Evidence References
- Target Reference
- Target Version
- Provenance References
- Collection Timestamp
- Lineage Reference

## Rules

The evidence package must be reconstructable.

Evidence provenance must survive repository handoff.

The existence of an evidence package does not by itself establish verification.

---

# Re-Verification

A changed target, changed evidence boundary, changed applicable check set, or superseding version requires a new traceable verification activity when required by the applicable verification rules.

A prior result may be referenced for lineage and history but must not be presented as verification of a materially different target.

---

# Failure Boundary

Verification failure includes:

- Missing required evidence.
- Missing lineage or provenance.
- Missing target version.
- Required checks not executed.
- A check failed or remained blocked.
- A verification result cannot be reconstructed.
- A non-Crucible component attempts to author a verification result.
- A governance, custody, or AI result is represented as verification without a Crucible result.

Failures must preserve the triggering evidence and lineage and be recorded under FAILURE-CONTRACTS.md.

---

# Invariants

1. The-Crucible owns verification.
2. Verification results identify the exact target and version evaluated.
3. Evidence references remain attached to verification results.
4. Verification does not transfer governance or custody authority.
5. Blocked or incomplete checks do not become successful verification.
6. Historical results remain auditable.
7. Supersession preserves ancestry.
8. No receiving component may fabricate a missing result.

---

# Related Contracts

- EVIDENCE-CONTRACTS.md
- FAILURE-CONTRACTS.md
- LINEAGE-CONTRACTS.md
- GOVERNANCE-CONTRACTS.md
- CUSTODY-CONTRACTS.md
- COLLABORATION-TO-CRUCIBLE.md
- CUSTODY-TO-CRUCIBLE.md
- CRUCIBLE-TO-NIM.md

---

# Architectural Rule

The-Crucible performs and owns verification.

Other repositories may request, consume, route, or present verification state only according to their contracts.
