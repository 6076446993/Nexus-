# Custody to Crucible Contract

## Purpose

This contract governs the transfer of a custody-controlled learning artifact from Crucible-Vetted-Learning-State to The-Crucible for verification.

Custody provides controlled state and provenance. The-Crucible independently verifies the artifact.

Custody does not constitute verification.

## Handoff

The handoff shall include:

- CustodyRecord
- Custody Package Reference
- Custody Version
- Source and Provenance References
- Governance Decision Reference
- Lineage Reference
- Requested Verification Scope
- Handoff Timestamp

## Authority Boundaries

Crucible-Vetted-Learning-State owns custody.

The-Crucible owns verification.

The custody repository may not mark an artifact verified.

The Crucible may not rewrite historical custody state as part of verification.

## Verification Request

The-Crucible shall independently determine applicable verification checks.

A valid custody handoff does not guarantee a successful verification result.

## Outcomes

PENDING

INCONCLUSIVE

VERIFIED

REJECTED

FAILED

SUPERSEDED

The authoritative verification outcome belongs to The-Crucible.

## Evidence

Verification must preserve references to the custody version evaluated.

The verification result must remain traceable to the exact custody state and version.

## Failure Handling

A failed verification shall retain:

- Failure Identifier
- Custody Reference
- Verification Reference
- Evidence References
- Lineage
- Timestamp
- Remediation Requirements where applicable

A failed result does not invalidate the historical custody record.

## Re-Verification

A changed custody version requires a new traceable verification activity.

Supersession must preserve ancestry.

## Invariants

1. Custody is not verification.
2. Verification authority remains with The-Crucible.
3. The exact custody version under evaluation is identifiable.
4. Evidence and lineage survive the handoff.
5. Historical custody records remain auditable.
6. No custody artifact becomes verified merely by transfer.

## Architectural Rule

Custody supplies controlled material and provenance.

The-Crucible independently verifies what was supplied.
