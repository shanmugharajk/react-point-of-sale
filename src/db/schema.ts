import { int, snakeCase, text } from 'drizzle-orm/sqlite-core'

// Always define tables with `snakeCase.table` so camelCase keys map to
// snake_case columns (priceCents -> price_cents).
export const products = snakeCase.table('products', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  priceCents: int().notNull(),
})
