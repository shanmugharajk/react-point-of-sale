# point-of-sale

Simple point-of-sale app built with Next.js, drizzle, SQLite and Turborepo.

## Commands

```sh
pnpm dev        # all apps in dev mode via Turborepo
pnpm build      # build every package; type-checking runs as part of the build
pnpm lint       # biome, repo-wide

pnpm db:push    # create/update tables in the SQLite db (drizzle-kit)
pnpm db:seed    # seed sample customers (skips if the table has rows)
pnpm db:studio  # browse the database in the browser (drizzle studio)
```

The `db:*` commands delegate to `packages/db` and load `apps/web/.env`
themselves — run them from anywhere in the repo.

## Environment

Create `apps/web/.env` (gitignored):

```sh
DB_FILE_NAME=/Users/you/Code/react-point-of-sale/apps/web/local.db
BETTER_AUTH_SECRET=<openssl rand -base64 24>
BETTER_AUTH_URL=http://localhost:3000
```

`DB_FILE_NAME` must be an absolute path — relative values are rejected (each
tool would otherwise resolve them against its own folder). `*.db` is gitignored.

## Reset the database

Wipes everything — including users — and rebuilds from scratch. Stop the dev
server first; it holds the db file open. Delete the file `DB_FILE_NAME`
points at, plus any `-wal`/`-shm`/`-journal` siblings:

```sh
rm -f /path/from/DB_FILE_NAME*
pnpm db:push    # recreate all tables
pnpm db:seed    # seed sample customers
```

Then re-create users as below — same command, `--role admin` or `--role user`.

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
