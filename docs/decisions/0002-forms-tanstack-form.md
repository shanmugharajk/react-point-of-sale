# 0002 Forms: TanStack Form

Status: accepted (2026-11-13), adopt at the first real form (not before)

## Decision
Use TanStack Form with Zod schemas passed directly (Standard Schema, no resolver). The login form stays on plain `FormData` until a form needs it (e.g. product create).

## Why
- Strong type inference for nested and array fields, which fits cart line items and variants.
- Same ecosystem as Router and Start.

## Alternatives
- React Hook Form: safer default, ~30% smaller, far bigger ecosystem and docs. Pick it if TanStack Form's smaller ecosystem or v2 syntax churn hurts.

## Revisit if
TanStack Form v2 changes validation syntax badly, or forms become painful to build.
