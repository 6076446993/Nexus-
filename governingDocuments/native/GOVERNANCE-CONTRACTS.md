# Governance Contracts

## Purpose

This document defines governance-related contracts used throughout the Nexus architecture.

Governance establishes oversight, eligibility, registration, authorization, suspension, recovery, and policy enforcement.

Governance authority belongs exclusively to Vetting-and-Governance-oversite.

Governance is distinct from verification, custody, learning extraction, and interface operations.

---

# Foundational Principles

- Governance is not verification.
- Governance is not scientific proof.
- Governance is not custody.
- Governance does not alter evidence.
- Governance requires auditability.
- Governance requires traceability.
- Governance actions preserve lineage.
- Governance decisions remain authoritative only within the governance authority domain that issued them.

---

# GovernanceDecision

## Purpose

Represents an oversight decision affecting repositories, workflows, learning candidates, custody eligibility, or operational authority.

## Owner

Vetting-and-Governance-oversite.

## Required Fields

- Decision Identifier
- Decision Type
- Decision Outcome
- Decision Reason
- Timestamp
- Signature Reference
- Lineage Reference
- Version Reference
- Target Reference

## Outcomes

- PENDING
- APPROVED
- REJECTED
- STOPPED
- CLEAR_GRANTED
- SUPERSEDED

## Rules

Governance decisions must be auditable and preserve lineage.

A governance decision may authorize an eligible transition, impose a STOP, or grant a governed CLEAR action according to applicable policy.

A governance decision does not create scientific or technical verification.

A governance decision does not create custody; custody requires a separate custody acceptance.

---

# GovernanceReview

## Purpose

Represents the governed review activity that evaluates a submitted request before a GovernanceDecision is issued.

## Owner

Vetting-and-Governance-oversite.

## Required Fields

- Review Identifier
- Target Reference
- Submitted Version
- Reviewer or Oversight Reference
- Review Scope
- Review Status
- Evidence References
- Start Timestamp
- Completion Timestamp
- Lineage Reference

## Status

- PENDING
- IN_REVIEW
- COMPLETED
- STOPPED
- SUPERSEDED

## Rules

A review must preserve the exact submitted version evaluated.

A review may request correction or additional evidence but may not rewrite historical source or extraction records as if they originated elsewhere.

---

# CustodyEligibility

## Purpose

Determines whether a governed artifact may be submitted to the custody boundary.

## Owner

Vetting-and-Governance-oversite.

## Required Fields

- Eligibility Identifier
- Target Reference
- Eligibility Status
- Decision Reference
- Eligible Version
- Timestamp
- Lineage Reference

## States

- PENDING
- ELIGIBLE
- INELIGIBLE
- REVOKED

## Rules

Eligibility is not verification.

Eligibility is not trust.

Eligibility is not custody acceptance.

The eligibility decision must identify the exact version to which it applies.

---

# RegisteredComponent

## Purpose

Defines a repository, subsystem, or governed component participating in Nexus.

## Owner

Vetting-and-Governance-oversite.

## Required Fields

- Repository Name
- Repository Identifier
- Repository Role
- Authority Domain
- Registration Status
- Version Reference
- Lineage Reference
- Registration Timestamp

## Registration Status

- REGISTERED
- PENDING
- SUSPENDED
- REVOKED

## Rules

Registration does not imply trust, verification, approval, or custody.

Suspension or revocation must preserve the historical registration record.

---

# StopOrder

## Purpose

Provides authoritative halt capability over a defined governance scope.

## Owner

Vetting-and-Governance-oversite.

## Required Fields

- Order Identifier
- Target Scope
- Reason
- Timestamp
- Signature Reference
- Lineage Reference
- Effective Version or Scope

## Rules

STOP orders are authoritative within their declared scope.

A STOP must not be silently bypassed by another repository.

A STOP remains part of the audit trail even after a later CLEAR.

---

# ClearOrder

## Purpose

Authorizes governed recovery from a previously stopped state.

## Owner

Vetting-and-Governance-oversite.

## Required Fields

- Order Identifier
- Referenced Stop Order
- Target Scope
- Reason
- Timestamp
- Signature Reference
- Lineage Reference

## Rules

A CLEAR must reference an existing applicable STOP.

A CLEAR does not erase the STOP history.

A CLEAR does not replace verification, evidence, custody acceptance, or other required gates.

---

# OversightSignature

## Purpose

Represents independent oversight authorization attached to a governed action.

## Owner

Vetting-and-Governance-oversite.

## Required Fields

- Signature Identifier
- Signer Identity
- Timestamp
- Target Reference
- Hash Reference
- Lineage Reference

## Rules

Signatures must be auditable and bound to the governed target.

Unsigned governance actions are invalid when a signature is required by the applicable governance rule.

---

# Governance Failure Boundary

Governance failure includes:

- Missing required decision authority.
- Invalid or missing oversight authorization.
- Missing lineage or provenance.
- A STOP action being bypassed.
- A governance decision being applied to a different version than the one reviewed.
- A governance decision being represented as verification.
- A governance decision being represented as custody acceptance.

Governance failures must preserve the triggering evidence and lineage and be recorded under FAILURE-CONTRACTS.md.

---

# Invariants

1. Governance authority remains with Vetting-and-Governance-oversite.
2. Governance does not transfer verification authority.
3. Governance does not transfer custody authority.
4. Governance decisions are version-specific and traceable.
5. STOP and CLEAR actions preserve their ancestry.
6. Historical governance records are not silently overwritten.
7. Eligibility is distinct from custody acceptance.
8. Approval is not scientific proof.
9. A missing governance decision cannot be converted into approval by presentation or AI output.

---

# Related Contracts

- AUTHORITY-CONTRACTS.md
- EVIDENCE-CONTRACTS.md
- VERIFICATION-CONTRACTS.md
- LEARNING-CONTRACTS.md
- CUSTODY-CONTRACTS.md
- LINEAGE-CONTRACTS.md
- FAILURE-CONTRACTS.md
- LEARNING-WORKER-TO-OVERSIGHT.md
- OVERSIGHT-TO-CUSTODY.md

---

# Architectural Rule

Vetting-and-Governance-oversite. governs eligibility and oversight decisions.

Governance authorizes governed transitions where applicable.

It does not manufacture verification, proof, or custody state.
