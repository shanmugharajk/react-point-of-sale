import { drizzle } from "drizzle-orm/better-sqlite3";
import { dbFilePath } from "./env";
import * as schema from "./schema";

// drizzle 1.0-rc: the db client no longer takes a schema option — the
// auth adapter in apps/web/lib/auth.ts is given the tables directly.
export const db = drizzle(dbFilePath, {
  relations: schema.authRelations,
});
export { schema };
