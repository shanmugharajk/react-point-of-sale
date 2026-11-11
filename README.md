# point-of-sale

Simple point-of-sale app built with Next.js, drizzle, SQLite and Turborepo.

## Commands

```sh
pnpm dev      # all apps in dev mode via Turborepo
pnpm build    # build every package; type-checking runs as part of the build
pnpm lint     # biome, repo-wide
```

## Environment

Create `apps/web/.env` (gitignored):

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
