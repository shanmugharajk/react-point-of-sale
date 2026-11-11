import { drizzle } from "drizzle-orm/better-sqlite3";
import { dbFilePath } from "./env";
import * as schema from "./schema";

// drizzle 1.0-rc: the db client no longer takes a schema option, so the
// auth adapter is given the tables directly (see schema: below).
export const db = drizzle(dbFilePath, {
  relations: schema.authRelations,
});
export { schema };
