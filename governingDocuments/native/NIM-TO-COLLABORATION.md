# NIM to Collaboration Integration Specification

## Purpose

This document defines the governed interaction between NVIDIA-NIM-CONSOLE and AI-collaboration-.

NVIDIA-NIM-CONSOLE serves as the user interaction and orchestration surface.

AI-collaboration- serves as the collaboration, council, reasoning, and provider coordination layer.

This integration does not transfer authority, verification ownership, governance ownership, or custody ownership.

---

# Integration Overview

Source Repository:

- NVIDIA-NIM-CONSOLE

Destination Repository:

- AI-collaboration-

Purpose:

- Prompt Submission
- Task Coordination
- Council Execution
- Provider Routing
- Reasoning Aggregation

---

# Ownership Boundaries

## NVIDIA-NIM-CONSOLE Owns

- User Interface
- Session State
- Routing Requests
- Presentation Logic
- User Interaction

## AI-collaboration- Owns

- Council Execution
- Provider Coordination
- Consensus Generation
- Reasoning Aggregation
- Collaboration Workflow

---

# Allowed Handoff Objects

## PromptRequest

### Purpose

Represents a user-initiated request.

### Required Fields

Request Identifier

Prompt Content

Timestamp

Session Reference

Lineage Reference

---

## TaskRequest

### Purpose

Represents a structured execution task.

### Required Fields

Task Identifier

Task Description

Task Type

Timestamp

Lineage Reference

---

## ContextPackage

### Purpose

Provides contextual information supporting execution.

### Required Fields

Context Identifier

Context References

Timestamp

Lineage Reference

---

# Prohibited Transfers

NVIDIA-NIM-CONSOLE shall not transfer:

- Governance Authority
- Verification Authority
- Custody Authority
- Repository Ownership

AI-collaboration- shall not receive:

- Governance Decisions
- Verification Decisions
- Custody Decisions

except through their governing repositories.

---

# Expected Response Objects

## CollaborationResult

### Required Fields

Result Identifier

Result Content

Council References

Timestamp

Lineage Reference

---

## ProviderResponse

### Required Fields

Response Identifier

Provider Identifier

Response Content

Timestamp

Lineage Reference

---

## ConsensusRecord

### Required Fields

Consensus Identifier

Consensus Outcome

Supporting References

Timestamp

Lineage Reference

---

# Traceability Requirements

All interactions shall preserve:

- Request Origin
- Session Reference
- Provider References
- Council References
- Lineage References

---

# Failure Handling

Failures shall be recorded using Nexus failure contracts.

Failures shall preserve:

- Lineage
- Request References
- Provider References
- Audit History

---

# Architectural Rule

NVIDIA-NIM-CONSOLE provides orchestration and presentation.

AI-collaboration- provides collaboration and reasoning.

Neither repository may assume authority owned by another repository.
