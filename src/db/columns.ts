import { sql } from 'drizzle-orm'
import { int, text } from 'drizzle-orm/sqlite-core'

import { user } from './auth-schema'

export type ValueOf<T> = T[keyof T]

// Drizzle's text enum needs a non-empty tuple; Object.values only gives an array.
export function enumValues<T extends Record<string, string>>(values: T) {
  return Object.values(values) as [ValueOf<T>, ...ValueOf<T>[]]
}

export const RecordStatus = {
  Active: 'active',
  Cancelled: 'cancelled',
} as const
export type RecordStatus = ValueOf<typeof RecordStatus>

export const nowInMilliseconds = sql`(cast(unixepoch('subsecond') * 1000 as integer))`

export function createId() {
  return crypto.randomUUID()
}

function touchTimestamp() {
  return new Date()
}

// Every table. These are functions so each table gets its own column builders.
export function baseColumns() {
  return {
    id: text().primaryKey().$defaultFn(createId),
    createdAt: int({ mode: 'timestamp_ms' })
      .notNull()
      .default(nowInMilliseconds),
    createdBy: text()
      .notNull()
      .references(() => user.id),
    updatedAt: int({ mode: 'timestamp_ms' })
      .notNull()
      .default(nowInMilliseconds)
      .$onUpdate(touchTimestamp),
  }
}

// Reference data: never deleted, only marked inactive.
export function referenceColumns() {
  return {
    ...baseColumns(),
    isActive: int({ mode: 'boolean' }).notNull().default(true),
  }
}

// Money records (bills, payments, ...): never deleted, only cancelled with a reason.
export function cancellableColumns() {
  return {
    ...baseColumns(),
    status: text({ enum: enumValues(RecordStatus) })
      .notNull()
      .default(RecordStatus.Active),
    cancelledAt: int({ mode: 'timestamp_ms' }),
    cancelledBy: text().references(() => user.id),
    cancelReason: text(),
  }
}
