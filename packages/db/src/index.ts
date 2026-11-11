import { drizzle } from "drizzle-orm/better-sqlite3";
import { dbFilePath } from "./env";
import * as schema from "./schema";

// drizzle 1.0-rc: relations attach at db creation; the auth adapter maps
// tables explicitly.
export const db = drizzle(dbFilePath, {
  relations: schema.authRelations,
});
export { schema };
