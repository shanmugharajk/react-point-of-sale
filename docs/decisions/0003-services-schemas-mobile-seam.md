# 0003 Services, schemas and the mobile seam

Status: accepted (2026-11-13)

## Decision
- `src/server/services/*`: plain functions `(input, context) => result`. Use db and Zod. No TanStack imports, no reading headers or cookies; the caller passes `{ user, role }`.
- `src/schemas/*`: Zod schemas and inferred types (inputs and response shapes). Framework-free so mobile can import them.
- Server functions are thin wrappers: `createServerFn().inputValidator(schema).handler(({ data }) => service(data, context))`.
- Mobile later: add `src/routes/api/v1/*` server routes that call the same services. Server functions are internal RPC (GET/POST only) and are not a public API.
- No tRPC, Hono or OpenAPI until mobile is real.

## Why
Web already gets end-to-end types from server functions. Putting the seam in the layout now makes a later typed client cheap to add and reversible, without building it speculatively.

## Later options (adapters over the same services)
- tRPC: `t.procedure.input(schema).query(({ input, ctx }) => service(input, ctx))`. Needs the `AppRouter` type importable by mobile (monorepo or shared package). Best if web and mobile are the only clients.
- Hono (mounted in one `/api/$` route) with its typed client and `@hono/zod-openapi`: lighter, plain HTTP, gives an OpenAPI spec if third parties ever need the API.
- Without either: mobile uses `fetch` with the shared types; drift is caught on the server side only.

## Revisit if
Mobile work starts, or a third-party client needs the API.
