# Nexus Trust Model

## Purpose

This document defines how Nexus records trust-relevant states without collapsing evidence, verification, governance, or custody into one authority.

Trust is established through applicable evidence, verification, governance, and custody controls. AI output alone does not establish trust.

---

## Foundational Principles

- NIM: AI output is not completion.
- The-Crucible: Evidence is not proof.
- Learning-Worker: Extraction is not knowledge.
- Crucible-Vetted-Learning-State: Custody is not authority.
- Vetting-and-Governance-oversite.: Approval is not scientific proof.

---

## Trust-Relevant States

- UNVERIFIED
- EVIDENCE_AVAILABLE
- VERIFICATION_IN_PROGRESS
- VERIFIED
- GOVERNED
- CUSTODIED
- BLOCKED
- REJECTED
- SUPERSEDED

These states describe controlled properties; they are not a universal mandatory linear progression.

---

## Coding Path

For coding work, the normal controlled sequence is:

Request
↓
AI Collaboration
↓
Crucible Verification
↓
Console Presentation

AI collaboration may produce a proposal or consensus, but only The-Crucible can establish the authoritative verification state.

---

## Learning Path

For learning work, the controlled sequence is:

Source
↓
Extraction
↓
Candidate Evidence
↓
Governance Review
↓
Custody Eligibility
↓
Custody
↓
Crucible Verification where applicable
↓
Verified Capability

Governance and custody may therefore precede verification in the learning flow. This is not a contradiction of the coding path; the paths represent different controlled transitions.

---

## Trust Rules

1. Evidence availability does not imply verification.
2. Verification does not transfer governance authority.
3. Governance approval does not imply verification.
4. Custody does not imply verification.
5. AI consensus does not imply verification.
6. Presentation does not alter authoritative state.
7. A blocked, rejected, or superseded record must not be presented as current success.
8. Trust-relevant state changes must preserve lineage and version references.

---

## Architectural Rule

Nexus records trust-relevant state transitions explicitly.

No component may infer a stronger authoritative state merely because a weaker state exists.
