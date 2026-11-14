# 0003 Services, schemas and the mobile seam

Status: accepted (2026-11-13)

## Decision
- `src/server/services/*`: plain functions `(input, context) => result`. Use db and Zod. No TanStack imports, no reading headers or cookies; the caller passes `{ user, role }`.
- `src/schemas/*`: Zod schemas and inferred types (inputs and response shapes). Framework-free so mobile can import them.
- Server functions are thin wrappers: `createServerFn().middleware([sessionMiddleware]).validator(schema).handler(({ data, context }) => service(data, context.serviceContext))`. `sessionMiddleware` calls `getServiceContext(headers)` (`src/server/session.server.ts`) to turn the login into `{ user, role }`; services check the role themselves (`assertAdmin`).
- Errors: services throw `ServiceError` for problems the user can fix; its message is shown. Anything else is logged and shown as "Something went wrong". The mobile API maps them to 400 and 500.
- Server-only files (db, auth, services that touch the db) end in `.server.ts`. Start's import protection fails the build if browser code imports one.
- Mobile later: add `src/routes/api/v1/*` server routes that call the same services and `getServiceContext`. Server functions are internal RPC (GET/POST only) and are not a public API.
- No tRPC, Hono or OpenAPI until mobile is real.

## Why
Web already gets end-to-end types from server functions. Putting the seam in the layout now makes a later typed client cheap to add and reversible, without building it speculatively.

## Later options (adapters over the same services)
- tRPC: `t.procedure.input(schema).query(({ input, ctx }) => service(input, ctx))`. Needs the `AppRouter` type importable by mobile (monorepo or shared package). Best if web and mobile are the only clients.
- Hono (mounted in one `/api/$` route) with its typed client and `@hono/zod-openapi`: lighter, plain HTTP, gives an OpenAPI spec if third parties ever need the API.
- Without either: mobile uses `fetch` with the shared types; drift is caught on the server side only.

## Revisit if
Mobile work starts, or a third-party client needs the API.
