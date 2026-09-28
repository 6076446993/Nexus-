# Governance Contracts

## Purpose

This document defines governance-related contracts used throughout the Nexus architecture.

Governance establishes oversight, eligibility, registration, authorization, suspension, recovery, and policy enforcement.

Governance authority belongs exclusively to Vetting-and-Governance-oversite.

Governance is distinct from verification, custody, learning extraction, and interface operations.

---

# Foundational Principles

Governance is not verification.

Governance is not scientific proof.

Governance is not custody.

Governance does not alter evidence.

Governance requires auditability.

Governance requires traceability.

Governance actions preserve lineage.

---

# GovernanceDecision

## Purpose

Represents an oversight decision affecting repositories, workflows, learning candidates, custody eligibility, or operational authority.

## Owner

Vetting-and-Governance-oversite.

## Required Fields

Decision Identifier

Decision Type

Decision Outcome

Decision Reason

Timestamp

Signature Reference

Lineage Reference

Version Reference

## Outcomes

PENDING

APPROVED

REJECTED

STOPPED

CLEAR_GRANTED

SUPERSEDED

## Rules

Governance decisions must be auditable.

Governance decisions must preserve lineage.

Governance decisions do not
