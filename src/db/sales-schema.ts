import { sql } from 'drizzle-orm'
import { check, index, int, snakeCase, text } from 'drizzle-orm/sqlite-core'

import { user } from './auth-schema'
import { baseColumns, cancellableColumns } from './columns'
import { customers, serviceTypes } from './reference-schema'
import { stockBatches } from './stock-schema'

export const PaymentMode = {
  Cash: 'cash',
  Upi: 'upi',
  Card: 'card',
  Other: 'other',
} as const
export type PaymentMode = (typeof PaymentMode)[keyof typeof PaymentMode]

const paymentModeValues = Object.values(PaymentMode) as [
  PaymentMode,
  ...PaymentMode[],
]

export const ServiceStage = {
  Received: 'received',
  InProgress: 'in_progress',
  Ready: 'ready',
  Delivered: 'delivered',
} as const
export type ServiceStage = (typeof ServiceStage)[keyof typeof ServiceStage]

const serviceStageValues = Object.values(ServiceStage) as [
  ServiceStage,
  ...ServiceStage[],
]

// A product sale. Totals are saved when the bill is made and never change.
// Walk-ins have no customer; their optional name and mobile live on the bill.
export const bills = snakeCase.table(
  'bills',
  {
    ...cancellableColumns(),
    billNumber: int().notNull().unique(),
    customerId: text().references(() => customers.id),
    walkInName: text(),
    walkInMobile: text(),
    subtotalPaise: int().notNull(),
    discountPaise: int().notNull().default(0),
    extraChargesPaise: int().notNull().default(0),
    totalPaise: int().notNull(),
  },
  (table) => [index('bills_customer_idx').on(table.customerId)],
)

// One batch of a product at the price actually charged. Cost is read from the batch.
export const billItems = snakeCase.table(
  'bill_items',
  {
    ...baseColumns(),
    billId: text()
      .notNull()
      .references(() => bills.id),
    batchId: text()
      .notNull()
      .references(() => stockBatches.id),
    quantity: int().notNull(),
    pricePaise: int().notNull(),
    totalPaise: int().notNull(),
  },
  (table) => [
    index('bill_items_bill_idx').on(table.billId),
    index('bill_items_batch_idx').on(table.batchId),
    check('bill_items_quantity_check', sql`${table.quantity} > 0`),
  ],
)

// Cash refund is zero when the return only reduces the customer's balance.
export const billReturns = snakeCase.table(
  'bill_returns',
  {
    ...cancellableColumns(),
    billId: text()
      .notNull()
      .references(() => bills.id),
    returnValuePaise: int().notNull(),
    cashRefundPaise: int().notNull().default(0),
  },
  (table) => [index('bill_returns_bill_idx').on(table.billId)],
)

export const billReturnItems = snakeCase.table(
  'bill_return_items',
  {
    ...baseColumns(),
    returnId: text()
      .notNull()
      .references(() => billReturns.id),
    billItemId: text()
      .notNull()
      .references(() => billItems.id),
    quantity: int().notNull(),
  },
  (table) => [
    index('bill_return_items_return_idx').on(table.returnId),
    check('bill_return_items_quantity_check', sql`${table.quantity} > 0`),
  ],
)

// One service per order. `status` (active or cancelled) comes from the shared columns;
// `stage` is the work progress.
export const serviceOrders = snakeCase.table(
  'service_orders',
  {
    ...cancellableColumns(),
    orderNumber: int().notNull().unique(),
    customerId: text().references(() => customers.id),
    walkInName: text(),
    walkInMobile: text(),
    serviceTypeId: text()
      .notNull()
      .references(() => serviceTypes.id),
    description: text().notNull(),
    pricePaise: int().notNull(),
    dueAt: int({ mode: 'timestamp_ms' }).notNull(),
    assignedTo: text().references(() => user.id),
    stage: text({ enum: serviceStageValues })
      .notNull()
      .default(ServiceStage.Received),
    deliveredAt: int({ mode: 'timestamp_ms' }),
    // Cash handed back when an order with an advance is cancelled.
    cashRefundPaise: int().notNull().default(0),
  },
  (table) => [
    index('service_orders_customer_idx').on(table.customerId),
    index('service_orders_due_idx').on(table.dueAt),
  ],
)

// Money received. A registered customer's payments reduce their overall balance;
// the bill or service order is only where it was taken.
export const payments = snakeCase.table(
  'payments',
  {
    ...cancellableColumns(),
    amountPaise: int().notNull(),
    mode: text({ enum: paymentModeValues }),
    customerId: text().references(() => customers.id),
    billId: text().references(() => bills.id),
    serviceOrderId: text().references(() => serviceOrders.id),
  },
  (table) => [
    index('payments_customer_idx').on(table.customerId),
    check('payments_amount_check', sql`${table.amountPaise} > 0`),
  ],
)
