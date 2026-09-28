# Authority Contracts

## Purpose

This document defines authority-related contracts used throughout the Nexus architecture.

Authority contracts establish ownership, responsibility, and governance boundaries.

Authority is never transferred implicitly.

Authority remains attached to the repository that owns it.

---

# Foundational Principles

Authority is not transferable.

Information sharing does not transfer authority.

Verification is not governance.

Governance is not custody.

Custody is not authority.

Repository coordination does not create authority inheritance.

---

# RegisteredComponent

## Purpose

Defines a repository, subsystem, or governed component participating in the Nexus architecture.

## Owner

Vetting-and-Governance-oversite.

## Required Fields

Repository Name

Repository Identifier

Repository Role

Authority Domain

Registration Status

Version Reference

Lineage Reference

## Registration Status

REGISTERED

PENDING

SUSPENDED

REVOKED

## Rules

Registration does not imply trust.

Registration does not imply verification.

Registration does not imply approval.

---

# AuthorityBoundary

## Purpose

Defines authority ownership for a specific domain.

## Required Fields

Authority Identifier

Authority Owner

Authority Domain

Authority Scope

Boundary Version

## Rules

Authority boundaries must remain explicit.

Authority boundaries must be auditable.

Authority boundaries must preserve lineage.

---

# GovernanceDecision

## Purpose

Represents an oversight decision affecting system governance.

## Owner

Vetting-and-Governance-oversite.

## Required Fields

Decision Identifier

Decision Type

Decision Outcome

Decision Timestamp

Decision Reason

Signature Reference

Lineage Reference

## Outcomes

PENDING

ACCEPTED

REJECTED

STOPPED

CLEAR_GRANTED

## Rules

Governance decisions are auditable.

Governance decisions preserve lineage.

Governance decisions do not create scientific proof.

---

# CustodyEligibility

## Purpose

Determines whether material may enter governed custody.

## Owner

Vetting-and-Governance-oversite.

## Required Fields

Eligibility Identifier

Target Reference

Eligibility Status

Decision Reference

Timestamp

## States

PENDING

ELIGIBLE

INELIGIBLE

## Rules

Eligibility is not verification.

Eligibility is not trust.

Eligibility is not authority.

---

# StopOrder

## Purpose

Provides authoritative halt capability.

## Owner

Vetting-and-Governance-oversite.

## Required Fields

Order Identifier

Target Scope

Reason

Timestamp

Signature Reference

Lineage Reference

## Rules

STOP orders are authoritative.

STOP orders must be auditable.

STOP orders preserve evidence.

STOP orders preserve lineage.

---

# ClearOrder

## Purpose

Authorizes recovery from a stopped state.

## Owner

Vetting-and-Governance-oversite.

## Required Fields

Order Identifier

Referenced Stop Order

Reason

Timestamp

Signature Reference

Lineage Reference

## Rules

CLEAR orders reference an existing STOP order.

CLEAR orders do not replace verification.

CLEAR orders do not replace governance ownership.

---

# OversightSignature

## Purpose

Represents independent oversight authorization.

## Owner

Vetting-and-Governance-oversite.

## Required Fields

Signature Identifier

Signer Identity

Timestamp

Target Reference

Hash Reference

Lineage Reference

## Rules

Signatures must be auditable.

Signatures must preserve lineage.

Unsigned governance actions are invalid.

---

# Authority Ownership Matrix

## NVIDIA-NIM-CONSOLE

Authority:

Interface

Routing

Presentation

---

## AI-collaboration-

Authority:

Pending Governance Review

---

## The-Crucible

Authority:

Verification

Evidence Assessment

Scientific Validation

Failure Classification

---

## Learning-Worker

Authority:

Candidate Extraction

Source Processing

Lineage Generation

---

## Crucible-Vetted-Learning-State

Authority:

Custody

Version Retention

Signature Retention

Lineage Retention

---

## Vetting-and-Governance-oversite.

Authority:

Governance

Registration

Custody Eligibility

STOP Authority

CLEAR Authority

---

## Nexus

Authority:

Architecture Coordination

Contract Governance

Repository Integration Governance

---

# Architectural Rule

No authority contract may grant authority owned by another repository.

Authority ownership must remain explicit, auditable, and governed.
