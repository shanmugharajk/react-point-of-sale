# Setup gotchas

Traps hit while standing this repository up. Each one cost real debugging
time — read before touching these areas. When a new area (auth, deploy,
payments…) collects its own scars, start a sibling file here named after it.

## The auth schema is CLI-generated, with one hand-written addition

`packages/db/src/schema/auth.schema.ts` is produced by the better-auth CLI —
except for the `defineRelations` block, which was hand-ported for drizzle
1.0-rc. Regenerating the file with the CLI silently wipes that block. After
any regen, re-apply it; the comment block inside the file explains what it
replaces and why.

## Native packages need build-script approval

pnpm blocks postinstall build scripts by default. `better-sqlite3`, `esbuild`,
`sharp` and `unrs-resolver` are pre-approved under `allowBuilds` in
`pnpm-workspace.yaml`. Any new native dependency must be added there too —
otherwise it installs cleanly but fails at runtime with a missing binary,
which looks like a code bug instead of a config one.

## `packages/db/drizzle/` is generated output

Everything inside comes from drizzle-kit. Never hand-edit it; the next
`db:push` (run from `packages/db`) overwrites your changes.

## `DB_FILE_NAME` must be an absolute path

`packages/db/src/env.ts` rejects relative values at startup. This is
deliberate: the Next dev server, drizzle-kit and the seed script all run from
different working directories, so a relative path would silently give each
tool its own database file. Absolute-only turns that ambiguity into a loud
error. Set it in `apps/web/.env` (see README → Environment). The parent
directory is not auto-created either — a missing directory fails at startup
with the path named, on purpose: silently `mkdir`-ing a typo'd path hides the
mistake until much later.

## db scripts load the env file themselves — Next is not there to do it

The one env file is `apps/web/.env`. When Next runs the app it loads that
file by itself. But `db:push`, `db:seed` and `db:studio` run drizzle-kit and
tsx as plain processes that never see it, so every script in
`packages/db/package.json` is wrapped with
`dotenv -e ../../apps/web/.env --`. A new db script without that wrapper dies
with `DB_FILE_NAME is required`, even though the env file exists.

## Imports: one dot only, no path aliases inside packages

Biome enforces the import law — node builtins, then packages, then `~/`
(apps/web alias), then `./` — and `../` imports are effectively banned. There
is no alias escape hatch inside `packages/db`: it is a source-exported
package, compiled by Turbopack with the *app's* tsconfig, so tsconfig `paths`
defined in the package are invisible at build time and every Node-side alias
(`#` imports) has to be maintained by hand in `package.json`. The fix for "I
need to reach a folder above" is restructuring, not aliases — `seed.ts` lives
directly in `src/` for exactly this reason.
