import { sql } from 'drizzle-orm'
import { check, index, int, snakeCase, text } from 'drizzle-orm/sqlite-core'

import { baseColumns, cancellableColumns } from './columns'
import { products, vendors } from './reference-schema'

// One delivery from a vendor. Vendor is optional so opening stock needs none.
// Cancelling one sets its batches' quantity left to zero in the same transaction.
export const stockReceipts = snakeCase.table('stock_receipts', {
  ...cancellableColumns(),
  vendorId: text().references(() => vendors.id),
  receivedAt: int({ mode: 'timestamp_ms' }).notNull(),
  vendorBillNumber: text(),
  note: text(),
})

// One product on one receipt. Sale lines point here and read the cost from it.
export const stockBatches = snakeCase.table(
  'stock_batches',
  {
    ...baseColumns(),
    receiptId: text()
      .notNull()
      .references(() => stockReceipts.id),
    productId: text()
      .notNull()
      .references(() => products.id),
    quantityReceived: int().notNull(),
    // Kept up to date inside the same transaction as every sale, return and adjustment.
    quantityLeft: int().notNull(),
    costPricePaise: int().notNull(),
    sellingPricePaise: int().notNull(),
  },
  (table) => [
    index('stock_batches_product_idx').on(table.productId),
    check('stock_batches_quantity_left_check', sql`${table.quantityLeft} >= 0`),
    check(
      'stock_batches_quantity_received_check',
      sql`${table.quantityReceived} > 0`,
    ),
    check(
      'stock_batches_prices_check',
      sql`${table.costPricePaise} >= 0 and ${table.sellingPricePaise} >= 0`,
    ),
  ],
)

// Lost, damaged, miscounted or typo fixes after sales. Positive adds stock, negative removes it.
export const stockAdjustments = snakeCase.table('stock_adjustments', {
  ...baseColumns(),
  batchId: text()
    .notNull()
    .references(() => stockBatches.id),
  quantityChange: int().notNull(),
  reason: text().notNull(),
})
