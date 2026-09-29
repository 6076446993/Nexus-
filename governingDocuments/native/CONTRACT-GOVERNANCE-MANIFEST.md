# Contract Governance Manifest

## Purpose

This document serves as the authoritative index of contract governance specifications used throughout the Nexus architecture.

The contract governance system establishes shared definitions, ownership boundaries, lifecycle rules, traceability requirements, and interoperability standards between participating repositories.

This manifest exists to provide discoverability, consistency, auditability, and contract traceability.

---

# Contract Governance Foundation

## Foundation

- CONTRACT-FOUNDATION.md

Defines foundational principles governing all Nexus contracts.

Establishes core architectural rules including:

- Authority is not transferable.
- Evidence is not proof.
- Verification is not governance.
- Governance is not custody.
- Custody is not authority.
- Extraction is not knowledge.
- AI output is not completion.

---

# Authority Contracts

## Authority Governance

- AUTHORITY-CONTRACTS.md

Defines authority ownership, authority boundaries, registration governance, custody eligibility governance, STOP authority, CLEAR authority, and oversight authorization.

Primary Owner:

- Vetting-and-Governance-oversite.

---

# Evidence Contracts

## Evidence Governance

- EVIDENCE-CONTRACTS.md

Defines evidence records, provenance records, observations, attestations, claims, and evidence packaging.

Primary Owner:

- The-Crucible

---

# Verification Contracts

## Verification Governance

- VERIFICATION-CONTRACTS.md

Defines verification results, verification checks, hypotheses, validation activities, and verification packages.

Primary Owner:

- The-Crucible

---

# Governance Contracts

## Oversight Governance

- GOVERNANCE-CONTRACTS.md

Defines governance decisions, STOP orders, CLEAR orders, oversight signatures, component registration, reviews, and policy exceptions.

Primary Owner:

- Vetting-and-Governance-oversite.

---

# Learning Contracts

## Learning Governance

- LEARNING-CONTRACTS.md

Defines extraction outputs, candidate evidence, learning packages, learning deliveries, source material, and promotion requests.

Primary Owner:

- Learning-Worker

---

# Custody Contracts

## Custody Governance

- CUSTODY-CONTRACTS.md

Defines custody records, custody packages, custody versions, custody transfers, retention records, custody signatures, and custody snapshots.

Primary Owner:

- Crucible-Vetted-Learning-State

---

# Lineage Contracts

## Traceability Governance

- LINEAGE-CONTRACTS.md

Defines lineage preservation, repository traceability, version ancestry, decision lineage, verification lineage, custody lineage, and learning lineage.

Shared Responsibility:

- All Nexus repositories

---

# Failure Contracts

## Failure Governance

- FAILURE-CONTRACTS.md

Defines failure codes, failure records, classifications, remediation activities, governance failures, lineage failures, custody failures, and learning failures.

Primary Owner:

- The-Crucible

---

# Repository Participation

The following repositories participate in the Nexus contract governance model:

- NVIDIA-NIM-CONSOLE
- AI-collaboration-
- The-Crucible
- Learning-Worker
- Crucible-Vetted-Learning-State
- Vetting-and-Governance-oversite.
- Nexus

---

# Contract Ownership Summary

| Contract Category | Primary Owner |
|------------------|---------------|
| Authority | Vetting-and-Governance-oversite. |
| Evidence | The-Crucible |
| Verification | The-Crucible |
| Governance | Vetting-and-Governance-oversite. |
| Learning | Learning-Worker |
| Custody | Crucible-Vetted-Learning-State |
| Lineage | Shared |
| Failure | The-Crucible |

---

# Pending Contract Categories

The following categories remain pending governance review of AI-collaboration-:

- Council Contracts
- Reasoning Contracts
- Consensus Contracts
- Provider Contracts
- Collaboration Contracts

These categories shall not be finalized until governance review is complete.

---

# Compliance Requirements

All Nexus contracts shall preserve:

- Auditability
- Traceability
- Lineage
- Provenance
- Version History
- Repository Ownership

All contract implementations shall remain consistent with repository governance.

---


# Cross-Repository Handoff Contracts

The following contracts govern controlled transitions between participating repositories:

- NIM-TO-COLLABORATION.md
- COLLABORATION-TO-CRUCIBLE.md
- CRUCIBLE-TO-NIM.md
- LEARNING-WORKER-TO-OVERSIGHT.md
- OVERSIGHT-TO-CUSTODY.md
- CUSTODY-TO-CRUCIBLE.md
- NEXUS-INTEGRATION-RULES.md
- NEXUS-CROSS-REPOSITORY-HANDOFFS.md

These contracts preserve authority, lineage, provenance, versioning, failure behavior, and auditability across repository boundaries.

# Revision Policy

When new contract categories are introduced, this manifest shall be updated.

When contract ownership changes, this manifest shall be updated.

When repositories join or leave the Nexus architecture, this manifest shall be updated.

This document serves as the authoritative entry point for Nexus contract governance.
