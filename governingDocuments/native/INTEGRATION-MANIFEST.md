# Integration Manifest

## Purpose

Authoritative index of repository integration contracts within the Nexus architecture.

Integration transfers information and execution state. It does not transfer repository authority, governance, verification ownership, or custody.

## Operational Coding Flow

NVIDIA-NIM-CONSOLE
↓
AI-collaboration-
↓
The-Crucible
↓
NVIDIA-NIM-CONSOLE

Contracts:

- NIM-TO-COLLABORATION.md
- COLLABORATION-TO-CRUCIBLE.md
- CRUCIBLE-TO-NIM.md

## Learning Flow

Learning-Worker
↓
Vetting-and-Governance-oversite.
↓
Crucible-Vetted-Learning-State
↓
The-Crucible
↓
NVIDIA-NIM-CONSOLE

Contracts:

- LEARNING-WORKER-TO-OVERSIGHT.md
- OVERSIGHT-TO-CUSTODY.md
- CUSTODY-TO-CRUCIBLE.md
- CRUCIBLE-TO-NIM.md

## System Integration Rules

- NEXUS-INTEGRATION-RULES.md
- NEXUS-CROSS-REPOSITORY-HANDOFFS.md

## Required Integration Properties

Every integration must preserve:

- Authority boundaries
- Authentication and authorization
- Identity
- Provenance
- Evidence references
- Lineage
- Version history
- Failure state
- Auditability
- Supersession ancestry

## Verification Rule

The-Crucible remains the authoritative source for verification results.

No receiving component may manufacture or silently reinterpret a verification result.

## Learning Rule

Learning-Worker does not directly create trusted learning state.

Governance eligibility and custody acceptance are separate controlled transitions.

## Change Rule

Changes to an integration contract require corresponding updates to affected repository implementations, tests, manifests, and lineage references.

## Architectural Rule

Repositories operate as one coordinated architecture while remaining independently governed.
