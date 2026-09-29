# Learning Contracts

## Purpose

This document defines learning-related contracts used throughout the Nexus architecture.

Learning contracts govern extraction, candidate generation, delivery preparation, lineage preservation, and custody submission.

Learning authority belongs to Learning-Worker.

Learning extraction is distinct from verification, governance approval, custody ownership, and interface presentation.

---

# Foundational Principles

Extraction is not knowledge.

Extraction is not verification.

Extraction is not governance.

Extraction is not custody.

Learning outputs require lineage.

Learning outputs require provenance.

Learning outputs require auditability.

---

# CandidateEvidence

## Purpose

Represents extracted material that may support future verification or governance review.

## Owner

Learning-Worker

## Required Fields

Candidate Identifier

Source Reference

Extracted Content

Extraction Timestamp

Lineage Reference

Provenance Reference

Version Reference

## Rules

Candidate evidence is not verified.

Candidate evidence is not approved.

Candidate evidence must preserve source traceability.

---

# LearningPackage

## Purpose

Represents a collection of extracted learning artifacts.

## Owner

Learning-Worker

## Required Fields

Package Identifier

Package Version

Candidate References

Source References

Lineage Reference

Provenance Reference

Timestamp

## Rules

Learning packages must remain auditable.

Learning packages must preserve version history.

Learning packages must preserve source traceability.

---

# LearningDelivery

## Purpose

Represents a governed delivery prepared for custody review.

## Owner

Learning-Worker

## Required Fields

Delivery Identifier

Learning Package Reference

Candidate References

Timestamp

Lineage Reference

Version Reference

## Rules

Learning deliveries do not imply approval.

Learning deliveries do not imply verification.

Learning deliveries must preserve lineage.

---

# LearningVersion

## Purpose

Represents a versioned state of extracted learning material.

## Required Fields

Version Identifier

Parent Version

Creation Timestamp

Lineage Reference

Change Description

## Rules

Learning versions must remain immutable.

Learning versions must preserve ancestry.

Learning versions must remain auditable.

---

# LearningPromotionRequest

## Purpose

Represents a request for governance review and custody eligibility evaluation.

## Required Fields

Request Identifier

Delivery Reference

Request Timestamp

Lineage Reference

Supporting Evidence References

## Rules

Promotion requests do not imply approval.

Promotion requests do not imply verification.

Promotion requests require lineage preservation.

---

# SourceMaterial

## Purpose

Represents material ingested by the learning pipeline.

## Required Fields

Source Identifier

Source Type

Source Location

Acquisition Timestamp

Lineage Reference

Provenance Reference

## Rules

Source material must preserve origin information.

Source material must remain traceable.

Source material must remain auditable.

---

# ExtractionRecord

## Purpose

Represents a specific extraction activity.

## Owner

Learning-Worker

## Required Fields

Extraction Identifier

Source Reference

Extraction Method

Timestamp

Output References

Lineage Reference

## Rules

Extraction records must preserve methodology.

Extraction records must preserve lineage.

Extraction records must remain reviewable.

---

# Learning Ownership Matrix

## Learning-Worker

Owns:

CandidateEvidence

LearningPackage

LearningDelivery

LearningVersion

ExtractionRecord

SourceMaterial

LearningPromotionRequest

---

## Vetting-and-Governance-oversite.

Consumes:

Learning Deliveries

Promotion Requests

Candidate Evidence

Produces:

Custody Eligibility Decisions

Governance Decisions

---

## Crucible-Vetted-Learning-State

Consumes:

Approved Learning Deliveries

Custody Eligible Packages

Stores:

Version History

Lineage References

Governance References

---

## The-Crucible

Consumes:

Candidate Evidence

Learning Deliveries

Evidence Packages

Produces:

Verification Results

Scientific Validation

---

## NVIDIA-NIM-CONSOLE

Displays:

Learning Status

Verification Status

Governance Status

---

# Learning Lifecycle

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

Learning Promotion Request

↓

Governance Review

↓

Custody Eligibility

↓

Custody Storage

↓

Verification

---

# Architectural Rule

Learning authority remains exclusive to Learning-Worker.

No repository may treat extracted learning as verified knowledge without governance, custody, and verification processes.

All learning contracts must preserve:

- Lineage
- Provenance
- Auditability
- Source Traceability
- Version History
