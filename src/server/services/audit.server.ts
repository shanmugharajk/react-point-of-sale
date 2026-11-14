import {
  type AuditAction,
  type AuditChanges,
  auditLog,
} from '~/db/audit-schema'
import type { db } from '~/db/db.server'

// Works with the db itself or a transaction handle, so callers can log inside their transaction.
export type AuditExecutor = Pick<typeof db, 'insert'>

export type AuditEntry = {
  userId: string
  action: AuditAction
  tableName: string
  recordId: string
  changes: AuditChanges
  reason?: string
}

type FieldValues = Record<string, unknown>

export function recordAudit(executor: AuditExecutor, entry: AuditEntry) {
  return executor.insert(auditLog).values(entry)
}

// Dates are separate objects even when equal, so compare their time instead.
function comparableValue(value: unknown) {
  return value instanceof Date ? value.getTime() : value
}

// Keeps only the fields whose value actually changed.
export function diffChanges(before: FieldValues, after: FieldValues) {
  const changes: AuditChanges = {}
  for (const field of Object.keys(after)) {
    // Undefined means the field was not part of the update, like Drizzle treats it.
    if (after[field] === undefined) {
      continue
    }
    if (comparableValue(before[field]) !== comparableValue(after[field])) {
      changes[field] = { from: before[field] ?? null, to: after[field] }
    }
  }
  return changes
}
