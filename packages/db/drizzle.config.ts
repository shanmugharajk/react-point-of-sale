import { defineConfig } from "drizzle-kit";

import { env } from "./src/env";

// DB_FILE_NAME is absolute (validated in src/env.ts); the db:* scripts in
// package.json load apps/web/.env via dotenv-cli before invoking drizzle-kit.
export default defineConfig({
  dialect: "sqlite",
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dbCredentials: { url: env.DB_FILE_NAME },
});
