# Nexus Contract Foundation

## Purpose

This document establishes the non-negotiable semantic boundaries for every Nexus contract.

Nexus is an integrated architecture composed of independently governed repositories. Contracts coordinate information and state transitions without collapsing repository authority.

## Foundational Distinctions

- Authority is not transferable.
- Evidence is not proof.
- Verification is not governance.
- Governance is not custody.
- Custody is not authority.
- Extraction is not trusted knowledge.
- AI output is not completion.
- AI consensus is not verification.
- Presentation is not authoritative state.
- Eligibility is not acceptance.
- Remediation requested is not remediation completed.
- A successful transport is not a successful operation.

## Contract Requirements

Every contract shall define:

1. Purpose.
2. Participating repositories.
3. Authority ownership.
4. Allowed handoff objects.
5. Required fields.
6. Validation requirements.
7. Failure behavior.
8. Version and supersession behavior.
9. Lineage and provenance requirements.
10. Audit requirements.
11. Explicit invariants.

## Authority Preservation

The repository that owns an authoritative record remains authoritative for that record.

A receiving repository may consume, present, validate, or route a record according to its contract, but may not silently replace the originating authority.

## Evidence and Verification

Evidence supports a claim or verification activity.

Verification requires the applicable checks and evidence defined by The-Crucible.

No AI-generated response, council agreement, governance approval, custody state, or UI status may be represented as Crucible verification without the corresponding authoritative verification record.

## Governance and Custody

Governance determines governed eligibility and may issue STOP or CLEAR decisions according to its authority.

Custody establishes controlled storage and custody lifecycle according to its authority.

Neither governance nor custody alone establishes scientific or technical verification.

## Learning Boundary

Learning-Worker produces candidate learning and promotion requests.

Vetting-and-Governance-oversite. governs eligibility.

Crucible-Vetted-Learning-State controls custody.

The-Crucible performs applicable verification.

These stages cannot be silently collapsed.

## Lineage

Every authoritative transition must preserve:

- Identity
- Origin
- Parent references
- Version
- Provenance
- Timestamp
- Repository ownership

Historical records remain auditable.

## Fail-Closed Principle

When a required authority, authorization, evidence, lineage, provenance, or verification result is missing, the system must not convert the incomplete state into success.

## Versioning

Contract changes must preserve traceability. Breaking changes require explicit versioning, migration rules, and retained historical references.

## Repository Independence

Nexus coordinates integration.

It does not absorb the governance or ownership of participating repositories.

## Definition of Contract Compliance

A contract is compliant only when its real implementation preserves the boundaries and evidence requirements defined here.

Documentation alone does not establish runtime compliance.

## Architectural Rule

Nexus contracts coordinate information.

They do not manufacture authority, proof, custody, verification, or completion.
