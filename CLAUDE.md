# point-of-sale

A point-of-sale app for small shops. v2 rewrite (the old v1 lives on the `master` branch). Web first; mobile later.

## Stack
- TanStack Start (React 19, file-based routing) on Vite, served by Nitro
- Tailwind CSS v4
- Biome for lint + format (no ESLint/Prettier)
- pnpm

## Commands
- `pnpm dev`: dev server on :3000
- `pnpm build`: production build
- `pnpm db:push`: sync the schema straight to the local db. We are not generating migrations yet (no `db:generate`/`db:migrate`, no `drizzle/` folder) until we explicitly decide to
- `pnpm check:fix`: lint + format; run this before committing

## Layout
- `src/routes/`: file-based routes; `__root.tsx` holds the HTML shell and `<head>`
- `src/routeTree.gen.ts`: generated, never edit
- `public/`: static assets served at `/`
- `docs/`: `product/` holds what the shop needs (read `product/mvp-1.md` before building a feature); `decisions/` holds engineering decisions (add a numbered file when we decide something new). `docs/README.md` is the index
- Import alias: `~/*` → `src/*`

## Conventions
- Define tables with `snakeCase.table` so camelCase keys map to snake_case columns (auth tables are generated, leave them)
- Single quotes, no semicolons, 2-space indent (Biome enforces it)
- Prefer the simplest thing that works; no speculative abstractions
- Business logic goes in `src/server/services` (no TanStack imports), Zod schemas in `src/schemas`; server functions stay thin wrappers (see `docs/`)
- Server-only files (db, auth, services) end in `.server.ts`; throw `ServiceError` for messages the user should see
- UI: shadcn for every control (`yes n | pnpm exec shadcn add <name>` keeps existing files); no native `button`/`input`/`select`/`table` or hand-rolled styling. Fix Biome issues in added files. Button-styled links: `<Link className={buttonVariants(...)}>`, never `<Button render={<Link>}>`
- Imports: external, blank line, `~/` alias, blank line, `./` relative (Biome enforces order). Use the alias for anything outside the current directory; keep `.css` imports in the same groups
- Name every type (no inline object types in props or params) and every handler (no multi-line inline methods)
- Readability: a blank line between steps (fetch, check, write, audit, return); declare things next to their first use (hooks stay at the top); keep a file next to its only user, shared code in its shared folder
- Full descriptive names, no abbreviations (`event`, not `e`)
- Comments only when the code can't explain itself: plain words, the why, one line
- Treat TypeScript deprecation hints as errors; use the replacement API
- Conventional commits (`feat:`, `fix:`, `chore:` …)
