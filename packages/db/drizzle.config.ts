import { defineConfig } from "drizzle-kit";
import { dbFilePath } from "./src/env";

// drizzle-kit paths are cwd-relative — run from the package folder (the
// db:* scripts do). The db file path is anchored by src/env.ts.
export default defineConfig({
  dialect: "sqlite",
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dbCredentials: { url: dbFilePath },
});
