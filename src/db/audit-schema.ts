import { index, int, snakeCase, text } from 'drizzle-orm/sqlite-core'

import { user } from './auth-schema'
import {
  createId,
  enumValues,
  nowInMilliseconds,
  type ValueOf,
} from './columns'

export const AuditAction = {
  Created: 'created',
  Updated: 'updated',
  Cancelled: 'cancelled',
  Paid: 'paid',
  StatusChanged: 'status_changed',
} as const
export type AuditAction = ValueOf<typeof AuditAction>

export type AuditChanges = Record<string, { from: unknown; to: unknown }>

// Append-only: written by the service layer in the same transaction as the change.
export const auditLog = snakeCase.table(
  'audit_log',
  {
    id: text().primaryKey().$defaultFn(createId),
    createdAt: int({ mode: 'timestamp_ms' })
      .notNull()
      .default(nowInMilliseconds),
    userId: text()
      .notNull()
      .references(() => user.id),
    action: text({ enum: enumValues(AuditAction) }).notNull(),
    tableName: text().notNull(),
    recordId: text().notNull(),
    changes: text({ mode: 'json' }).$type<AuditChanges>().notNull(),
    reason: text(),
  },
  (table) => [
    index('audit_log_record_idx').on(table.tableName, table.recordId),
    index('audit_log_created_at_idx').on(table.createdAt),
  ],
)
