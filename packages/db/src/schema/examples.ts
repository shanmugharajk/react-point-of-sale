import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Disposable pipeline-proving scaffolding — never a real app table.
export const examples = sqliteTable("examples", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});
