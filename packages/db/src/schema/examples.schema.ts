import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Scaffolding to prove the pipeline — delete when real tables arrive.
export const examples = sqliteTable("examples", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});
