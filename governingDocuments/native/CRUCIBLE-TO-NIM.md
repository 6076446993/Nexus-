# Crucible to NIM Integration Specification

## Purpose

This document defines the governed interaction between `The-Crucible` and `NVIDIA-NIM-CONSOLE`.

The Crucible returns independently generated verification results to the console for presentation, workflow control, and subsequent action.

`NVIDIA-NIM-CONSOLE` may display and act upon Crucible results according to its own governing responsibilities, but it may not reinterpret, manufacture, alter, or suppress the underlying verification record.

Verification authority remains with The-Crucible.

---

# Integration Overview

Source Repository:

* The-Crucible

Destination Repository:

* NVIDIA-NIM-CONSOLE

Purpose:

* Return verification results
* Return failure information
* Return remediation requirements
* Return evidence references
* Provide verification status for user-facing workflows

---

# Ownership Boundaries

## The-Crucible Owns

* Verification execution
* Verification results
* Verification checks
* Evidence classification
* Failure classification
* Verification lineage
* Verification attestations

## NVIDIA-NIM-CONSOLE Owns

* Result presentation
* User interaction
* Workflow orchestration
* Display state
* Request routing
* User-visible status

The console does not become the owner of verification merely because it receives or displays a verification result.

---

# Allowed Handoff Objects

## VerificationResult

Represents the authoritative outcome of a Crucible verification activity.

### Required Fields

Verification Identifier

Request Reference

Verification Outcome

Check References

Evidence References

Timestamp

Lineage Reference

Version Reference

---

## FailureRecord

Represents a failure identified by Crucible.

### Required Fields

Failure Identifier

Failure Code Reference

Affected Component

Failure Description

Verification Reference

Evidence References

Timestamp

Lineage Reference

---

## RemediationRecord

Represents corrective action required following a Crucible failure.

### Required Fields

Remediation Identifier

Failure Reference

Required Action

Timestamp

Lineage Reference

---

## VerificationStatus

Represents the current Crucible status associated with a request.

### Valid States

PENDING

INCONCLUSIVE

VERIFIED

REJECTED

FAILED

SUPERSEDED

---

# Result
