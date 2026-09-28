# Nexus Authority Boundaries

## Purpose

This document defines mandatory authority boundaries within the Nexus architecture.

Repositories may exchange information.

Repositories may not assume authority assigned to another repository.

---

## Authority Ownership

### NVIDIA-NIM-CONSOLE

Owns:

- User interaction
- Request intake
- Request routing
- Result presentation

Does Not Own:

- Verification
- Governance
- Custody
- Learning promotion

---

### AI-collaboration-

Owns:

- Collaborative reasoning
- Result generation
- Provider coordination

Does Not Own:

- Verification
- Governance approval
- Custody authority

---

### The-Crucible

Owns:

- Verification
- Evidence assessment
- Scientific validation
- Failure classification

Does Not Own:

- Governance approval
- Custody ownership
- Learning extraction

---

### Learning-Worker

Owns:

- Candidate extraction
- Source processing
- Lineage generation

Does Not Own:

- Verification
- Approval
- Custody

---

### Vetting-and-Governance-oversite.

Owns:

- Governance review
- Custody eligibility
- STOP authority
- CLEAR authority

Does Not Own:

- Scientific verification
- Runtime execution

---

### Crucible-Vetted-Learning-State

Owns:

- Custody
- Delivery retention
- Signature retention
- Version retention

Does Not Own:

- Verification
- Approval
- Promotion

---

### Nexus

Owns:

- Architectural coordination
- Shared contract governance
- Repository integration governance

Does Not Own:

- Repository-specific authority

---

## Architectural Rule

Authority is never transferred implicitly.

Authority remains attached to the repository that owns it.
