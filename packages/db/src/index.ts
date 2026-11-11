import { drizzle } from "drizzle-orm/better-sqlite3";
import { dbFilePath } from "./env";
import * as schema from "./schema";

// drizzle 1.0-rc: no schema option on the client — relations attach at
// creation; the auth adapter maps tables explicitly instead.
export const db = drizzle(dbFilePath);
export { schema };
