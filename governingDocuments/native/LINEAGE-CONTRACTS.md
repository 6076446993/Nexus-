# Lineage Contracts

## Purpose

This document defines lineage-related contracts used throughout the Nexus architecture.

Lineage contracts preserve traceability across extraction, verification, governance, custody, coordination, and presentation activities.

Lineage is a system-wide responsibility shared by all participating repositories.

Lineage ownership is preserved by the originating repository and maintained throughout the artifact lifecycle.

---

# Foundational Principles

Lineage preserves traceability.

Lineage preserves provenance.

Lineage preserves accountability.

Lineage preserves auditability.

Lineage survives repository transitions.

Lineage survives version changes.

Lineage is mandatory.

---

# LineageRecord

## Purpose

Represents the complete traceability chain for an artifact, decision, verification activity, learning package, or custody object.

## Required Fields

Lineage Identifier

Origin Reference

Parent References

Creation Timestamp

Repository Reference

Version Reference

Provenance Reference

## Rules

Lineage records must remain immutable.

Lineage records must remain auditable.

Lineage records must preserve ancestry.

---

# ParentReference

## Purpose

Represents a direct predecessor relationship.

## Required Fields

Parent Identifier

Relationship Type

Timestamp

Repository Reference

## Relationship Types

DERIVED_FROM

GENER
