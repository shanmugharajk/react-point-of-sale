import { type db, schema } from "@point-of-sale/db";

// The transaction handle drizzle passes to db.transaction callbacks — derived
// from the library's own inference, not hand-written. The better-sqlite3
// driver is sync, so the handle's writes execute synchronously.
export type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export type AuditEntry = {
  entity: string;
  entityId: string;
  action: string;
  actorId: string;
  details: string;
};

export function recordAudit(tx: DbTransaction, entry: AuditEntry): void {
  tx.insert(schema.auditLog).values(entry).run();
}
