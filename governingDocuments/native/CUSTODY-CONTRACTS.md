# Custody Contracts

## Purpose

This document defines custody-related contracts used throughout the Nexus architecture.

Custody contracts govern retention, preservation, versioning, lineage continuity, and controlled storage of governed learning artifacts.

Custody authority belongs exclusively to Crucible-Vetted-Learning-State.

Custody is distinct from verification, governance, extraction, and interface operations.

---

# Foundational Principles

Custody is not authority.

Custody is not verification.

Custody is not governance.

Custody is not activation.

Custody preserves lineage.

Custody preserves provenance.

Custody preserves version history.

Custody preserves auditability.

---

# CustodyRecord

## Purpose

Represents a governed artifact placed into custody.

## Owner

Crucible-Vetted-Learning-State

## Required Fields

Custody Identifier

Artifact Reference

Custody Timestamp

Eligibility Reference

Lineage Reference

Version Reference

Retention Reference

## Rules

Custody records must remain immutable.

Custody records must preserve lineage.

Custody records must remain auditable.

---

# CustodyPackage

## Purpose

Represents a collection of governed artifacts stored under custody.

## Owner

Crucible-Vetted-Learning-State

## Required Fields

Package Identifier

Package Version

Artifact References

Governance References

Lineage Reference

Timestamp

## Rules

Custody packages must preserve version history.

Custody packages must preserve traceability.

Custody packages must remain auditable.

---

# CustodyVersion

## Purpose

Represents a versioned custody state.

## Required Fields

Version Identifier

Parent Version

Creation Timestamp

Lineage Reference

Change Description

## Rules

Versions must remain immutable.

Versions must preserve ancestry.

Versions must remain reviewable.

---

# CustodyTransfer

## Purpose

Represents movement of a governed artifact into or between custody states.

## Required Fields

Transfer Identifier

Source Reference

Destination Reference

Timestamp

Lineage Reference

Authorization Reference

## Rules

Transfers require authorization.

Transfers must preserve lineage.

Transfers must remain auditable.

Transfers do not transfer authority.

---

# RetentionRecord

## Purpose

Represents retention obligations for governed artifacts.

## Required Fields

Retention Identifier

Artifact Reference

Retention Policy

Retention Start

Retention End

Lineage Reference

## Rules

Retention records must remain auditable.

Retention records must preserve governance references.

Retention records must remain versioned.

---

# CustodySignature

## Purpose

Represents a preserved custody authorization signature.

## Required Fields

Signature Identifier

Target Reference

Signer Reference

Timestamp

Hash Reference

Lineage Reference

## Rules

Custody signatures must remain immutable.

Custody signatures must remain traceable.

Custody signatures must remain auditable.

---

# CustodySnapshot

## Purpose

Represents a point-in-time custody state.

## Required Fields

Snapshot Identifier

Snapshot Timestamp

Artifact References

Version References

Lineage Reference

## Rules

Snapshots preserve historical custody state.

Snapshots remain immutable.

Snapshots remain auditable.

---

# Custody Ownership Matrix

## Crucible-Vetted-Learning-State

Owns:

CustodyRecord

CustodyPackage

CustodyVersion

CustodyTransfer

RetentionRecord

CustodySignature

CustodySnapshot

---

## Vetting-and-Governance-oversite.

Provides:

Custody Eligibility

Governance Decisions

Oversight Signatures

Consumes:

Custody References

Retention Information

---

## Learning-Worker

Produces:

Learning Deliveries

Candidate Evidence

Source Material

Consumes:

Custody Status

---

## The-Crucible

Consumes:

Custodied Artifacts

Custody References

Lineage References

Produces:

Verification Results

Validation Outcomes

---

## NVIDIA-NIM-CONSOLE

Displays:

Custody Status

Version Status

Verification Status

---

# Custody Lifecycle

Learning Delivery

↓

Governance Review

↓

Custody Eligibility

↓

Custody Record

↓

Custody Package

↓

Version Preservation

↓

Retention Preservation

↓

Verification Consumption

---

# Architectural Rule

Custody authority remains exclusive to Crucible-Vetted-Learning-State.

No repository may assume custody ownership without governed custody records.

All custody contracts must preserve:

- Lineage
- Provenance
- Auditability
- Version History
- Retention History
- Governance References

Custody storage does not imply verification, approval, activation, or authority.
