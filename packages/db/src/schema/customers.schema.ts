import { sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const customers = sqliteTable(
  "customers",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    // The customer identity — one active customer per number.
    mobile: text("mobile").notNull(),
    email: text("email"),
    address: text("address"),
    // Soft delete: rows are hidden, never removed — bills and service orders
    // will reference customers later.
    deletedAt: integer("deleted_at", { mode: "timestamp_ms" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    // Partial: only active rows conflict, so a deleted customer's mobile can
    // be re-registered.
    uniqueIndex("customers_mobile_unique")
      .on(table.mobile)
      .where(sql`deleted_at is null`),
  ],
);
