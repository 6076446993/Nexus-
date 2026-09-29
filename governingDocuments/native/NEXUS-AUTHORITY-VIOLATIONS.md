# Nexus Authority Violations

## Purpose

This document defines authority violations within the Nexus architecture.

---

## Authority Violation Definition

An authority violation occurs when a repository performs an action reserved for another repository.

---

## Examples

### Interface Violation

NVIDIA-NIM-CONSOLE declares verification complete.

Violation:

Verification authority belongs to The-Crucible.

---

### Governance Violation

AI-collaboration- approves learning promotion.

Violation:

Governance authority belongs to Vetting-and-Governance-oversite.

---

### Custody Violation

Learning-Worker stores approved learning directly.

Violation:

Custody authority belongs to Crucible-Vetted-Learning-State.

---

### Verification Violation

Oversight declares scientific truth.

Violation:

Scientific verification belongs to The-Crucible.

---

## Required Response

Authority violations shall:

- Be logged
- Preserve evidence
- Preserve lineage
- Preserve auditability

---

## Architectural Rule

Authority violations shall never silently succeed.

Authority violations shall be observable and reviewable.
