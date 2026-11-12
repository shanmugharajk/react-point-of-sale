# 0002 — Role union: one source, one narrowing point

Date: 2026-11-12
Status: Accepted

## Context

User roles were a loose `string` at every layer — drizzle column, session
mapping, `Actor`, service checks. A prior review kept it that way because
narrowing seemed to need a cast at the better-auth boundary.

## Decision

`ROLES = ["admin", "user"] as const` is defined once in
`@point-of-sale/contracts` (hand-written, survives better-auth CLI
regeneration). Drizzle (`text("role", { enum: ROLES })`), zod
(`RoleSchema`), and `Actor.role: Role` all derive from it. The ONE
narrowing point is `toActor` in the actions layer:
`RoleSchema.catch("user").parse(session.user.role)` — cast-free; unknown
values fall back to better-auth's own default ("user"), never "admin".

## Why

better-auth types `role` as a plain string (admin plugin schema) and its
session inference never reads the drizzle schema — so a drizzle-level
enum alone cannot type the session, and the definition must live
somewhere regen-proof. SQLite has no native ENUM; the drizzle enum is
TS-only (a `check()` constraint is possible if out-of-band writers ever
matter).

## Reversal trigger

If better-auth starts typing `role` beyond `string`, or a third role
appears, revisit the tuple and the `toActor` parse (both stay valid).
If the auth schema is regenerated, re-apply the enum per the file's
header note.
