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
- `pnpm check:fix`: lint + format; run this before committing

## Layout
- `src/routes/`: file-based routes; `__root.tsx` holds the HTML shell and `<head>`
- `src/routeTree.gen.ts`: generated, never edit
- `public/`: static assets served at `/`
- Import alias: `~/*` → `src/*`

## Conventions
- Single quotes, no semicolons, 2-space indent (Biome enforces it)
- Prefer the simplest thing that works; no speculative abstractions
- Conventional commits (`feat:`, `fix:`, `chore:` …)
