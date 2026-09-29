# Nexus Governance Manifest

## Purpose

This document is the authoritative discovery index for governance documents that define the Nexus architecture.

Nexus coordinates independently governed repositories operating as one architecture. This manifest provides discoverability, auditability, and governance traceability.

---

# Core Governance

## Constitution

- CONSTITUTION.md

Defines foundational governance principles for the Nexus architecture.

## Agent Governance

- AGENTS.md
- CLAUDE.md
- agent-progress-policy.md

Defines agent behavior, operating constraints, and governance expectations.

## Development Governance

- DEVLOG.md
- Nexus Coding Architecture — Development Plan

Maintains governance-relevant development history and the architecture implementation plan.

---

# Architecture Governance

## Repository Structure

- NEXUS-REPOSITORY-MAP.md
- Nexus Repository Responsibilities.md

Defines participating repositories and their responsibilities.

## Authority Governance

- Nexus Authority Matrix.md
- NEXUS-AUTHORITY-BOUNDARIES.md
- NEXUS-AUTHORITY-VIOLATIONS.md
- AUTHORITY-CONTRACTS.md

Defines authority ownership, boundaries, and violation handling.

## Trust Governance

- Nexus Trust Model.md

Defines trust-relevant states and prevents state conflation.

## Learning Governance

- Nexus Learning Lifecycle.md
- LEARNING-CONTRACTS.md
- LEARNING-WORKER-TO-OVERSIGHT.md
- OVERSIGHT-TO-CUSTODY.md

Defines learning lifecycle and controlled promotion/custody transitions.

## Contract Governance

- Nexus Contract Categories.md
- CONTRACT-FOUNDATION.md
- CONTRACT-GOVERNANCE-MANIFEST.md
- EVIDENCE-CONTRACTS.md
- VERIFICATION-CONTRACTS.md
- GOVERNANCE-CONTRACTS.md
- CUSTODY-CONTRACTS.md
- LINEAGE-CONTRACTS.md
- FAILURE-CONTRACTS.md

Defines shared contract categories, semantic boundaries, and domain contracts.

## Integration Governance

- INTEGRATION-MANIFEST.md
- NEXUS-INTEGRATION-RULES.md
- NEXUS-CROSS-REPOSITORY-HANDOFFS.md
- NIM-TO-COLLABORATION.md
- COLLABORATION-TO-CRUCIBLE.md
- CRUCIBLE-TO-NIM.md
- LEARNING-WORKER-TO-OVERSIGHT.md
- OVERSIGHT-TO-CUSTODY.md
- CUSTODY-TO-CRUCIBLE.md

Defines approved cross-repository transitions.

## Operational Governance

- required-check-rollout.md
- nexus-native-assimilation.md
- ai-conflict-resolution.md
- AI-CONFLICTS.json
- AI-HANDOFF.json
- TOKEN-HEALTH.json

These records govern or document current operational controls and agent handoff state.

---

# Repository Participation

The Nexus architecture currently coordinates:

- NVIDIA-NIM-CONSOLE
- AI-collaboration-
- The-Crucible
- Learning-Worker
- Crucible-Vetted-Learning-State
- Vetting-and-Governance-oversite.

Nexus itself is the architecture and integration-governance repository.

---

# Architectural Principles

### NVIDIA-NIM-CONSOLE

AI output is not completion.

### AI-collaboration-

AI collaboration does not become verification merely through consensus.

### The-Crucible

Evidence is not proof.

### Learning-Worker

Extraction is not knowledge.

### Crucible-Vetted-Learning-State

Custody is not authority.

### Vetting-and-Governance-oversite.

Approval is not scientific proof.

---

# Governance Audit Rule

Governance documents affecting architecture, authority, trust, learning, custody, verification, integration, or repository interaction must be discoverable through this manifest or through an explicitly indexed subordinate manifest.

Documents not referenced by this manifest should be reviewed for relevance, archival, or integration.

---

# Revision Policy

When governance documents are added, renamed, moved, or retired, this manifest must be updated.

Repository participation changes must also update this manifest.
