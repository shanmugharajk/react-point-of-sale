# point-of-sale

Full-stack point-of-sale app — Next.js monorepo with a shared data layer and auth.

## Develop

```sh
pnpm dev      # all apps in dev mode via Turborepo
pnpm build    # build every package; type-checking runs as part of the build
pnpm lint     # biome, repo-wide
```

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

