# Nexus Authority Matrix

## Purpose

This document defines authority boundaries across the Nexus architecture.

Repositories remain independently governed.

Nexus coordinates repository interaction but does not replace repository authority.

---

## Authority Matrix

| Repository | Primary Authority |
|------------|-------------------|
| NVIDIA-NIM-CONSOLE | Interface and Routing |
| AI-collaboration- | Reasoning and Collaboration |
| The-Crucible | Verification |
| Learning-Worker | Candidate Extraction |
| Vetting-and-Governance-oversite. | Governance |
| Crucible-Vetted-Learning-State | Custody |
| Nexus | Coordination |

---

## Authority Separation Principles

No repository may assume authority delegated to another repository.

Verification authority remains exclusive to The-Crucible.

Governance authority remains exclusive to Vetting-and-Governance-oversite.

Custody authority remains exclusive to Crucible-Vetted-Learning-State.

Extraction authority remains exclusive to Learning-Worker.

Interface authority remains exclusive to NVIDIA-NIM-CONSOLE.

Coordination authority remains exclusive to Nexus.

---

## Architectural Rule

Authority boundaries are mandatory.

Cross-repository communication does not transfer authority.
