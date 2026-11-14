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
- Import alias: `~/*` → `src/*`

## Conventions
- Define tables with `snakeCase.table` so camelCase keys map to snake_case columns (auth tables are generated, leave them)
- Single quotes, no semicolons, 2-space indent (Biome enforces it)
- Prefer the simplest thing that works; no speculative abstractions
- Imports: external, blank line, `~/` alias, blank line, `./` relative (Biome enforces order). Use the alias for anything outside the current directory; keep `.css` imports in the same groups
- Name every type (no inline object types in props or params) and every handler (no multi-line inline methods)
- Full descriptive names, no abbreviations (`event`, not `e`)
- Comments only when the code can't explain itself: plain words, the why, one line
- Treat TypeScript deprecation hints as errors; use the replacement API
- Conventional commits (`feat:`, `fix:`, `chore:` …)
