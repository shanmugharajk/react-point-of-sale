# 0001 Validation: Zod 4

Status: accepted (2026-11-13)

## Decision
Use Zod 4 for all runtime validation. Schemas are the source of truth for input types.

## Why
- `better-auth` already depends on Zod, so it adds nothing to the bundle.
- Drizzle can derive Zod schemas from tables, so no duplicate hand-written schemas.
- TanStack Start validators and TanStack Form both accept Standard Schema, so we are not locked in.

## Alternatives
- Valibot: much smaller (~1 KB vs ~17 KB), but bundle size is irrelevant for a logged-in POS, and it would sit on top of the Zod that better-auth ships.

## Revisit if
Bundle size starts to matter, or Zod stops being a transitive dependency.
