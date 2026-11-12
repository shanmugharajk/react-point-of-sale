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
DB_FILE_NAME=/Users/you/Code/react-point-of-sale/apps/web/local.db
BETTER_AUTH_SECRET=<openssl rand -base64 24>
BETTER_AUTH_URL=http://localhost:3000
```

`DB_FILE_NAME` must be an absolute path — relative values are rejected (each
tool would otherwise resolve them against its own folder). `*.db` is gitignored.

## First admin

```sh
# the CLI runs outside Next/dotenv — it needs the whole env file
# (auth config validates BETTER_AUTH_SECRET, URL and DB_FILE_NAME)
export $(grep -v '^#' apps/web/.env | xargs)
pnpm dlx auth@latest create-admin \
  --config apps/web/lib/auth.ts \
  --email admin@example.com --name "Admin" \
  --password <password> --role admin --yes
```
