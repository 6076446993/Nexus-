# Oversight to Custody Contract

## Purpose

This contract governs the transition from governance-approved learning eligibility to controlled custody in Crucible-Vetted-Learning-State.

Governance determines eligibility. Custody establishes controlled storage and custody state.

Approval does not itself create custody.

## Handoff

The handoff shall reference:

- Governance Decision
- Learning Promotion Request
- Approved Learning Delivery
- Learning Version
- Lineage Reference
- Provenance References
- Custody Eligibility
- Handoff Timestamp

## Authority Boundaries

Vetting-and-Governance-oversite. owns governance decisions and custody eligibility.

Crucible-Vetted-Learning-State owns custody records, custody versions, custody transfers, retention, and custody snapshots.

Neither repository may claim the other's authority.

## Acceptance

Custody shall reject or quarantine a handoff when required lineage, provenance, version, governance decision, or custody eligibility is missing.

## Custody Creation

Acceptance shall create a distinct CustodyRecord referencing the approved source state.

The CustodyRecord must preserve ancestry to the governance decision and learning version.

A custody record must not be backdated or silently substituted for an earlier record.

## States

PREPARED

ELIGIBLE

TRANSFERRED

ACCEPTED

QUARANTINED

REJECTED

SUPERSEDED

RELEASED

## Invariants

1. Governance approval is not custody.
2. Custody acceptance requires traceable eligibility.
3. Historical governance decisions remain immutable.
4. Custody versions preserve lineage.
5. Quarantine does not equal approval.
6. Custody does not equal verification.
7. No artifact enters trusted custody without a custody record.

## Audit

The handoff must be reconstructable from governance, learning, lineage, and custody records.

## Architectural Rule

Oversight authorizes eligibility.

Custody establishes custody.

Neither stage may silently perform the other's function.
