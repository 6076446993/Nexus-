# Evidence Contracts

## Purpose

This document defines evidence-related contracts used throughout the Nexus architecture.

Evidence contracts preserve claims, observations, supporting material, provenance, and verification inputs.

Evidence is not proof.

Evidence supports verification.

Verification determines whether evidence is sufficient.

---

# Foundational Principles

Evidence is not proof.

Evidence is not governance.

Evidence is not trust.

Evidence is not authority.

Evidence may support verification.

Evidence must preserve provenance.

Evidence must preserve lineage.

---

# EvidenceRecord

## Purpose

Represents a piece of evidence used in evaluation, verification, governance review, or learning analysis.

## Owner

The-Crucible

## Required Fields

Evidence Identifier

Evidence Type

Evidence Content

Source Reference

Timestamp

Lineage Reference

Provenance Reference

Version Reference

## Rules

Evidence records must remain auditable.

Evidence records must preserve source references.

Evidence records must preserve provenance.

Evidence records must preserve lineage.

---

# EvidenceClassification

## Purpose

Defines the evaluation state of evidence.

## Owner

The-Crucible

## States

INSUFFICIENT_EVIDENCE

REJECTED_EVIDENCE

CRUCIBLE_ISSUE

SUPPORTED

VERIFIED

## Rules

Classification does not imply governance approval.

Classification does not imply custody eligibility.

Classification does not imply trust.

---

# Attestation

## Purpose

Represents a statement supporting a claim, observation, test result, or verification activity.

## Required Fields

Attestation Identifier

Attestation Source

Attestation Content

Timestamp

Evidence Reference

Lineage Reference

## Rules

Attestations must be traceable.

Attestations must reference supporting evidence.

Attestations are not proof by themselves.

---

# ProvenanceRecord

## Purpose

Preserves how evidence was obtained, processed, evaluated, and referenced.

## Owner

The-Crucible

## Required Fields

Provenance Identifier

Source Reference

Collection Method

Processing Method

Timestamp

Version Reference

Lineage Reference

## Rules

Provenance must remain immutable.

Provenance must remain auditable.

Provenance must survive repository transitions.

---

# ClaimRecord

## Purpose

Represents a claim supported or challenged by evidence.

## Required Fields

Claim Identifier

Claim Statement

Claim Source

Claim Timestamp

Evidence References

Lineage Reference

## Rules

Claims may exist without verification.

Claims may exist without approval.

Claims must preserve evidence references.

---

# ObservationRecord

## Purpose

Represents a recorded observation gathered during extraction, testing, or verification.

## Required Fields

Observation Identifier

Observation Content

Observation Source

Timestamp

Evidence Reference

Lineage Reference

## Rules

Observations must remain auditable.

Observations must preserve origin information.

Observations do not imply conclusions.

---

# Evidence Package

## Purpose

Represents a collection of evidence associated with a claim, verification effort, governance review, or learning candidate.

## Required Fields

Package Identifier

Package Version

Evidence References

Claim References

Lineage Reference

Provenance Reference

## Rules

Evidence packages must be versioned.

Evidence packages must preserve traceability.

Evidence packages must preserve auditability.

---

# Evidence Ownership Matrix

## Learning-Worker

Produces:

Candidate Evidence

Observations

Source References

---

## The-Crucible

Produces:

Evidence Evaluation

Evidence Classification

Provenance

Verification Evidence

---

## Vetting-and-Governance-oversite.

Consumes:

Evidence Packages

Evidence Classifications

Attestations

---

## Crucible-Vetted-Learning-State

Stores:

Evidence References

Lineage References

Provenance References

---

## NVIDIA-NIM-CONSOLE

Displays:

Evidence Status

Evidence References

Verification Status

---

# Architectural Rule

All evidence contracts must preserve:

- Auditability
- Lineage
- Provenance
- Versioning
- Source Traceability

Evidence may support verification.

Evidence alone does not establish truth.
