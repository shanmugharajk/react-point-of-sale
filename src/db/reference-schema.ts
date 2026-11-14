import { int, snakeCase, text } from 'drizzle-orm/sqlite-core'

import { referenceColumns } from './columns'

export const productTypes = snakeCase.table('product_types', {
  ...referenceColumns(),
  name: text().notNull().unique(),
})

export const products = snakeCase.table('products', {
  ...referenceColumns(),
  name: text().notNull(),
  productTypeId: text()
    .notNull()
    .references(() => productTypes.id),
  barcode: text().unique(),
  // Only prefills the stock entry screen; the real selling price lives on each batch.
  defaultSellingPricePaise: int().notNull(),
  unit: text().notNull().default('pcs'),
})

export const serviceTypes = snakeCase.table('service_types', {
  ...referenceColumns(),
  name: text().notNull().unique(),
  usualPricePaise: int().notNull(),
})

export const vendors = snakeCase.table('vendors', {
  ...referenceColumns(),
  name: text().notNull(),
  mobile: text(),
  email: text(),
  address: text(),
})

export const customers = snakeCase.table('customers', {
  ...referenceColumns(),
  name: text().notNull(),
  mobile: text().notNull().unique(),
  address: text(),
  email: text(),
})

export const expenseTypes = snakeCase.table('expense_types', {
  ...referenceColumns(),
  name: text().notNull().unique(),
})
