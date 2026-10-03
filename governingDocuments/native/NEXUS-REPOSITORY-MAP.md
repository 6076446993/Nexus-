# Nexus Repository Map

## Purpose

This document defines the repositories that participate in the Nexus architecture.

These repositories remain independently governed and independently versioned.

Nexus coordinates interaction between repositories.

---

## GitHub Organization

The Nexus system repositories are owned by the GitHub organization `6076446993`.

Canonical repository namespace:

`https://github.com/6076446993/<repository>`

`Smoker-Hours-Tracker` is a separate Smoke Stack project and is not part of the Nexus organization architecture.

---

## Repository Structure

Nexus

├── Nexus-

├── NVIDIA-NIM-CONSOLE

├── AI-collaboration-

├── The-Crucible

├── Learning-Worker

├── Crucible-Learning-State

├── Crucible-Vetted-Learning-State

├── Vetting-and-Governance-oversite.

└── Nexus-Public-CI

---

## Repository Roles

### Nexus-

Architecture coordination and integration-governance repository.

### NVIDIA-NIM-CONSOLE

Interface and routing layer.

### AI-collaboration-

Reasoning and collaboration layer.

### The-Crucible

Verification authority.

### Learning-Worker

Candidate extraction authority.

### Crucible-Learning-State

Encrypted project-bound durable learning-state custody used by The Crucible learning pipeline.

### Crucible-Vetted-Learning-State

Independently vetted learning custody authority.

### Vetting-and-Governance-oversite.

Governance and independent vetting authority.

### Nexus-Public-CI

Public hosted-CI boundary used to test and publish status for private Nexus components without exposing their source or secrets.

---

## Architectural Principle

The repositories operate as one coordinated architecture.

The repositories do not merge authority.

Each repository preserves its own governance, lifecycle, and responsibility boundaries.
