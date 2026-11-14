import { sql } from 'drizzle-orm'
import { check, index, int, snakeCase, text } from 'drizzle-orm/sqlite-core'

import { user } from './auth-schema'
import { cancellableColumns, enumValues, type ValueOf } from './columns'
import { expenseTypes } from './reference-schema'

export const SalaryPaymentType = {
  Salary: 'salary',
  Advance: 'advance',
  Other: 'other',
} as const
export type SalaryPaymentType = ValueOf<typeof SalaryPaymentType>

export const expenses = snakeCase.table(
  'expenses',
  {
    ...cancellableColumns(),
    expenseTypeId: text()
      .notNull()
      .references(() => expenseTypes.id),
    amountPaise: int().notNull(),
    spentAt: int({ mode: 'timestamp_ms' }).notNull(),
    note: text(),
  },
  (table) => [
    index('expenses_spent_at_idx').on(table.spentAt),
    check('expenses_amount_check', sql`${table.amountPaise} > 0`),
  ],
)

// Salary, advances and similar. Counted as expenses in reports; advances are not auto-deducted.
export const salaryPayments = snakeCase.table(
  'salary_payments',
  {
    ...cancellableColumns(),
    employeeId: text()
      .notNull()
      .references(() => user.id),
    type: text({ enum: enumValues(SalaryPaymentType) }).notNull(),
    amountPaise: int().notNull(),
    // The month the payment is for, as YYYY-MM.
    forMonth: text().notNull(),
    paidAt: int({ mode: 'timestamp_ms' }).notNull(),
    note: text(),
  },
  (table) => [
    index('salary_payments_employee_idx').on(table.employeeId),
    index('salary_payments_paid_at_idx').on(table.paidAt),
    check('salary_payments_amount_check', sql`${table.amountPaise} > 0`),
  ],
)
