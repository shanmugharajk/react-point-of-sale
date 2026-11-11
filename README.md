# point-of-sale

Full-stack point-of-sale app — Next.js monorepo with a shared data layer and auth.

## Develop

```sh
pnpm dev
```

Runs every workspace app in dev mode via Turborepo.

## Build

```sh
pnpm build
```

Builds all workspace packages; type-checking runs as part of the build task.

## Environment

`.env` at the repo root (gitignored). Next.js only reads the app folder's
own `.env`, so keep `apps/web/.env` a copy of it.

```sh
DB_FILE_NAME=local.db
BETTER_AUTH_SECRET=<openssl rand -base64 24>
BETTER_AUTH_URL=http://localhost:3000
```

## First admin

```sh
pnpm dlx auth@latest create-admin --email admin@example.com --name "Admin" --role admin --yes
```

Load `BETTER_AUTH_SECRET` first (`--env-file=.env` or export it).

## Gotchas

- `packages/db/src/schema/auth-schema.ts` is CLI-generated. Regenerating
  it silently replaces the drizzle 1.0-rc `defineRelations` hand-port —
  re-apply it (see the comment block in that file).
- pnpm blocks native build scripts; `better-sqlite3`/`esbuild`/`sharp` are
  pre-approved in `pnpm-workspace.yaml` (`allowBuilds`) — add new native
  deps there too.
- `packages/db/drizzle/**` is generated output — never hand-edited.

