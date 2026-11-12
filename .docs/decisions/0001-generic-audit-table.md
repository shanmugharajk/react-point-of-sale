# 0001 — One generic audit table

Date: 2026-11-12
Status: Accepted

## Context

D5 asks for a generic audit log of every write. Two shapes were on the
table: one shared `audit_log` table, or one audit table per entity.

## Decision

One append-only `audit_log` table: `entity`, `entityId`, `action`
(open set), `actorId` (no FK — audit survives user deletion), `details`
(JSON snapshot: after-state for create/update, before-state for delete),
`createdAt`. Indexed on `(entity, entityId)`. The audit row is written
inside the SAME transaction as the change — the seed of the transaction
recipe.

## Why

D5 says "generic"; one table is one helper, one pattern, carried straight
to bills and ledger. Per-entity tables would be migration ceremony with
no benefit at this scale.

## Reversal trigger

If a report needs to query a specific entity's history in ways the JSON
details can't serve, or the details blob grows unbounded — split then.
