import {
  type CustomerCreateInput,
  CustomerCreateSchema,
  type CustomerDto,
  type CustomerListQuery,
  type CustomerListResult,
  type CustomerUpdateInput,
  CustomerUpdateSchema,
} from "@point-of-sale/contracts";
import { db, schema } from "@point-of-sale/db";
import { and, desc, eq, isNull, ne, sql } from "drizzle-orm";

import type { Actor } from "./actor";
import { AppError } from "./app-error";
import { recordAudit } from "./audit";

const MOBILE_TAKEN_MESSAGE = "This mobile number is already registered";

type CustomerRow = typeof schema.customers.$inferSelect;

function toDto(row: CustomerRow): CustomerDto {
  return {
    id: row.id,
    name: row.name,
    mobile: row.mobile,
    email: row.email,
    address: row.address,
    createdAt: row.createdAt,
  };
}

export const customersService = {
  // Counter staff may add customers — no role gate on create.
  // Re-parse defensively: actions already validate, but this is the layer
  // every future caller goes through.
  async create(input: CustomerCreateInput, actor: Actor): Promise<CustomerDto> {
    const parsed = CustomerCreateSchema.safeParse(input);
    if (!parsed.success) {
      throw new AppError(
        "invalid_input",
        parsed.error.issues[0]?.message ?? "Invalid customer details",
      );
    }

    return db.transaction((tx) => {
      const clash = tx
        .select({ id: schema.customers.id })
        .from(schema.customers)
        .where(
          and(
            eq(schema.customers.mobile, parsed.data.mobile),
            isNull(schema.customers.deletedAt),
          ),
        )
        .get();
      if (clash) {
        throw new AppError("mobile_taken", MOBILE_TAKEN_MESSAGE, {
          field: "mobile",
        });
      }

      const row = tx
        .insert(schema.customers)
        .values({
          name: parsed.data.name,
          mobile: parsed.data.mobile,
          email: parsed.data.email ?? null,
          address: parsed.data.address ?? null,
        })
        .returning()
        .get();
      recordAudit(tx, {
        entity: "customer",
        entityId: row.id,
        action: "create",
        actorId: actor.userId,
        details: JSON.stringify(row),
      });

      return toDto(row);
    });
  },

  async update(input: CustomerUpdateInput, actor: Actor): Promise<CustomerDto> {
    if (actor.role !== "admin") {
      throw new AppError("forbidden", "Only admins can edit customers");
    }

    const parsed = CustomerUpdateSchema.safeParse(input);
    if (!parsed.success) {
      throw new AppError(
        "invalid_input",
        parsed.error.issues[0]?.message ?? "Invalid customer details",
      );
    }

    return db.transaction((tx) => {
      const current = tx
        .select()
        .from(schema.customers)
        .where(
          and(
            eq(schema.customers.id, parsed.data.id),
            isNull(schema.customers.deletedAt),
          ),
        )
        .get();
      if (!current) {
        throw new AppError("not_found", "Customer not found");
      }

      const clash = tx
        .select({ id: schema.customers.id })
        .from(schema.customers)
        .where(
          and(
            eq(schema.customers.mobile, parsed.data.mobile),
            isNull(schema.customers.deletedAt),
            ne(schema.customers.id, parsed.data.id),
          ),
        )
        .get();
      if (clash) {
        throw new AppError("mobile_taken", MOBILE_TAKEN_MESSAGE, {
          field: "mobile",
        });
      }

      const row = tx
        .update(schema.customers)
        .set({
          name: parsed.data.name,
          mobile: parsed.data.mobile,
          email: parsed.data.email ?? null,
          address: parsed.data.address ?? null,
        })
        .where(eq(schema.customers.id, parsed.data.id))
        .returning()
        .get();
      if (!row) {
        throw new AppError("not_found", "Customer not found");
      }
      recordAudit(tx, {
        entity: "customer",
        entityId: parsed.data.id,
        action: "update",
        actorId: actor.userId,
        details: JSON.stringify(row),
      });

      return toDto(row);
    });
  },

  async remove(id: string, actor: Actor): Promise<void> {
    if (actor.role !== "admin") {
      throw new AppError("forbidden", "Only admins can remove customers");
    }

    db.transaction((tx) => {
      // Snapshot BEFORE the soft delete so the pre-delete state is preserved.
      const current = tx
        .select()
        .from(schema.customers)
        .where(
          and(eq(schema.customers.id, id), isNull(schema.customers.deletedAt)),
        )
        .get();
      if (!current) {
        throw new AppError("not_found", "Customer not found");
      }

      tx.update(schema.customers)
        .set({ deletedAt: new Date() })
        .where(eq(schema.customers.id, id))
        .run();
      recordAudit(tx, {
        entity: "customer",
        entityId: id,
        action: "delete",
        actorId: actor.userId,
        details: JSON.stringify(current),
      });
    });
  },

  // Reads need no actor.
  async list(query: CustomerListQuery): Promise<CustomerListResult> {
    const activeOnly = isNull(schema.customers.deletedAt);

    const rows = db
      .select()
      .from(schema.customers)
      .where(activeOnly)
      .orderBy(desc(schema.customers.createdAt))
      .limit(query.pageSize)
      .offset((query.page - 1) * query.pageSize)
      .all();

    const countRows = db
      .select({ total: sql<number>`count(*)` })
      .from(schema.customers)
      .where(activeOnly)
      .all();
    const total = countRows[0]?.total ?? 0;

    return {
      items: rows.map(toDto),
      total,
      page: query.page,
      pageSize: query.pageSize,
    };
  },
};

export type CustomersService = typeof customersService;
