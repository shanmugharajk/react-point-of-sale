# 0004 Database checks: money and quantity signs only

Status: accepted (2026-11-14)

## Decision
- SQL `check` constraints only guard the sign of money and quantities (amount > 0, quantity left >= 0, refund >= 0).
- Formats and business rules (a real `YYYY-MM` month, a walk-in contact, a non-zero adjustment) live in Zod schemas and services, never in the database.

## Why
Sign checks are the last line of defence for stock and balances. Business rules already live in Zod and the service; repeating them in SQL is noise that drifts out of sync and needs `db:push` to change.

## Revisit if
Something other than our services starts writing to the database.
