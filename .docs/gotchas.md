# Gotchas

- `packages/db/src/schema/auth-schema.ts` is CLI-generated. Regenerating
  it silently replaces the drizzle 1.0-rc `defineRelations` hand-port —
  re-apply it (see the comment block in that file).
- pnpm blocks native build scripts; `better-sqlite3`/`esbuild`/`sharp` are
  pre-approved in `pnpm-workspace.yaml` (`allowBuilds`) — add new native
  deps there too.
- `packages/db/drizzle/**` is generated output — never hand-edited.
- Relative `DB_FILE_NAME` resolves from each process's cwd — it is
  anchored to the repo root by `packages/db/src/env.ts`; don't bypass that.
