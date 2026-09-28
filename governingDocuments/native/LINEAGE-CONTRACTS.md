# Lineage Contracts

## Purpose

This document defines lineage-related contracts used throughout the Nexus architecture.

Lineage preserves traceability across extraction, verification, governance, custody, coordination, presentation, and supersession.

Lineage is a system-wide responsibility shared by all participating repositories.

Lineage ownership remains with the repository that creates or owns the authoritative record. Other repositories preserve and reference that lineage without becoming its authority.

---

# Foundational Principles

- Lineage preserves traceability.
- Lineage preserves provenance.
- Lineage preserves accountability.
- Lineage preserves auditability.
- Lineage survives repository transitions.
- Lineage survives version changes.
- Lineage is mandatory for authoritative transitions.
- Historical lineage must not be silently rewritten.

---

# LineageRecord

## Purpose

Represents the traceability chain for an artifact, decision, verification activity, learning package, custody object, or cross-repository handoff.

## Required Fields

- Lineage Identifier
- Origin Reference
- Parent References
- Creation Timestamp
- Repository Reference
- Version Reference
- Provenance Reference
- Current State Reference where applicable

## Rules

Lineage records must remain auditable and preserve ancestry.

An authoritative record without sufficient lineage is incomplete and cannot be treated as a successfully completed governed transition.

---

# ParentReference

## Purpose

Represents a direct predecessor relationship.

## Required Fields

- Parent Identifier
- Relationship Type
- Timestamp
- Repository Reference
- Parent Version

## Relationship Types

- DERIVED_FROM
- GENERATED_FROM
- SUBMITTED_FROM
- REVIEWED_FROM
- VERIFIED_FROM
- APPROVED_FROM
- STORED_FROM
- TRANSFERRED_FROM
- SUPERSEDES
- RETRIES
- CORRECTS
- REFERENCES

The relationship type must accurately describe the transition. A reference must not be represented as derivation, and a supersession must not erase the superseded record.

---

# ProvenanceReference

## Purpose

Identifies the source or process history needed to establish where an artifact or decision came from.

## Required Fields

- Provenance Identifier
- Source Reference
- Source Version where applicable
- Origin Repository
- Creation or Acquisition Timestamp
- Transformation References
- Lineage Reference

## Rules

Provenance must remain attached across repository handoffs.

If provenance cannot be established, the receiving component must treat the artifact as incomplete or otherwise governed according to its failure contract.

---

# VersionReference

## Purpose

Identifies the exact version of an artifact, contract, decision, evidence package, learning package, custody state, or verification target.

## Required Fields

- Version Identifier
- Parent Version Reference where applicable
- Content or State Hash where applicable
- Creation Timestamp
- Repository Reference

## Rules

A result or decision must not be silently applied to a different version.

Superseding a version preserves the ancestry of the superseded version.

---

# HandoffLineage

## Purpose

Preserves lineage when information crosses a repository boundary.

## Required Fields

- Handoff Identifier
- Sender Repository
- Receiver Repository
- Object Reference
- Object Version
- Source Lineage Reference
- Destination Receipt Reference
- Timestamp

## Rules

A successful transport must not be treated as a successful operation unless the receiving contract accepts the handoff.

A receiver may add a receipt record but may not replace the sender's authoritative origin record.

---

# DecisionLineage

Governance decisions, verification results, custody records, and learning promotion decisions must reference the records that caused or supported the decision.

A decision must remain reconstructable from its cited inputs and applicable version.

---

# VerificationLineage

Every VerificationResult must identify:

- The verification request.
- The target version.
- The applicable evidence package.
- The executed checks.
- The result version or record.
- Any failure or remediation records.

Verification lineage is owned by The-Crucible for the authoritative verification record.

---

# LearningLineage

Learning lineage must preserve:

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
Promotion Request
↓
Governance Decision
↓
Custody Eligibility
↓
Custody Record
↓
Verification Activity where applicable

No stage may be silently skipped.

---

# CustodyLineage

A CustodyRecord must preserve ancestry to:

- The governance decision or eligibility that authorized the handoff.
- The exact learning version received.
- The source/provenance references.
- The custody transfer.
- Any later superseding custody version.

Custody lineage does not become verification lineage merely because The-Crucible later evaluates the custody artifact.

---

# Supersession

Supersession creates a new traceable record.

The superseding record must identify the superseded record and preserve its historical accessibility.

Supersession is not deletion, mutation, or retroactive replacement.

---

# Failure and Remediation Lineage

Failures and remediation activities must reference:

- Triggering record.
- Affected version.
- Failure identifier.
- Evidence references.
- Remediation request where applicable.
- Subsequent verification or closure record where applicable.

Remediation requested is not remediation completed.

---

# Failure Conditions

Lineage failure includes:

- Missing origin.
- Missing parent or version references where required.
- Broken provenance.
- Cross-repository handoff without source lineage.
- Applying a result to an untracked version.
- Silent overwriting of historical lineage.
- Supersession without ancestry.

Lineage failures must fail closed according to the applicable integration and failure contracts.

---

# Invariants

1. Every authoritative transition remains traceable.
2. Origin ownership is not transferred by handoff.
3. Version ancestry is preserved.
4. Provenance survives repository boundaries.
5. Historical records remain auditable.
6. Supersession preserves ancestry.
7. Transport success is not operation success.
8. Missing lineage prevents an authoritative success claim.

---

# Related Contracts

- CONTRACT-FOUNDATION.md
- AUTHORITY-CONTRACTS.md
- EVIDENCE-CONTRACTS.md
- VERIFICATION-CONTRACTS.md
- GOVERNANCE-CONTRACTS.md
- LEARNING-CONTRACTS.md
- CUSTODY-CONTRACTS.md
- FAILURE-CONTRACTS.md
- NEXUS-CROSS-REPOSITORY-HANDOFFS.md
- NEXUS-INTEGRATION-RULES.md

---

# Architectural Rule

Lineage follows the record across the Nexus architecture.

Repositories preserve lineage when they receive or transmit information, while the originating repository retains authority over the authoritative record it owns.
