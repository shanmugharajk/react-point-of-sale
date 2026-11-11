# point-of-sale

Full-stack point-of-sale app — Next.js monorepo with a shared data layer and auth.

## Commands

```sh
pnpm dev      # all apps in dev mode via Turborepo
pnpm build    # build every package; type-checking runs as part of the build
pnpm lint     # biome, repo-wide
```

## Environment

One file: `apps/web/.env` (gitignored) — Next.js reads only the app
folder's own `.env`, and the db scripts load that same file.

```sh
DB_FILE_NAME=local.db
BETTER_AUTH_SECRET=<openssl rand -base64 24>
BETTER_AUTH_URL=http://localhost:3000
```

## First admin

```sh
export $(grep BETTER_AUTH_SECRET apps/web/.env | xargs)
pnpm dlx auth@latest create-admin \
  --config apps/web/lib/auth.ts \
  --email admin@example.com --name "Admin" \
  --password <password> --role admin --yes
```

Notes: run from the repo root — `--config` points at the auth config, and
the CLI takes `BETTER_AUTH_SECRET` from the process environment (nothing
loads `.env` for it). Non-interactive runs require `--password`.

