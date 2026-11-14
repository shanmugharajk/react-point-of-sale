import { eq, getTableName, sql } from 'drizzle-orm'

import { AuditAction } from '~/db/audit-schema'
import { db } from '~/db/db.server'
import { productTypes } from '~/db/reference-schema'
import type {
  CreateProductTypeInput,
  UpdateProductTypeInput,
} from '~/schemas/product-type'

import { diffChanges, recordAudit } from './audit.server'
import { assertAdmin, type ServiceContext, ServiceError } from './context'

export function listProductTypes() {
  return db
    .select()
    .from(productTypes)
    .orderBy(sql`lower(${productTypes.name})`)
}

type NameLookup = Pick<typeof db, 'select'>

// The unique index is case-sensitive, but "Pens" and "pens" are the same type to the shop.
async function assertNameIsFree(
  lookup: NameLookup,
  name: string,
  exceptId?: string,
) {
  const [existing] = await lookup
    .select({ id: productTypes.id })
    .from(productTypes)
    .where(sql`lower(${productTypes.name}) = lower(${name})`)
    .limit(1)

  if (existing && existing.id !== exceptId) {
    throw new ServiceError(`"${name}" already exists`)
  }
}

const tableName = getTableName(productTypes)

export function createProductType(
  input: CreateProductTypeInput,
  context: ServiceContext,
) {
  assertAdmin(context)

  return db.transaction(async (transaction) => {
    await assertNameIsFree(transaction, input.name)

    const [created] = await transaction
      .insert(productTypes)
      .values({ name: input.name, createdBy: context.user.id })
      .returning()

    await recordAudit(transaction, {
      userId: context.user.id,
      action: AuditAction.Created,
      tableName,
      recordId: created.id,
      changes: diffChanges({}, { name: created.name }),
    })

    return created
  })
}

export function updateProductType(
  input: UpdateProductTypeInput,
  context: ServiceContext,
) {
  assertAdmin(context)

  const { id, ...fields } = input
  return db.transaction(async (transaction) => {
    const [before] = await transaction
      .select()
      .from(productTypes)
      .where(eq(productTypes.id, id))

    if (!before) {
      throw new ServiceError('Product type not found')
    }

    if (fields.name !== undefined) {
      await assertNameIsFree(transaction, fields.name, id)
    }

    const changes = diffChanges(before, fields)
    if (Object.keys(changes).length === 0) {
      return before
    }

    const [updated] = await transaction
      .update(productTypes)
      .set(fields)
      .where(eq(productTypes.id, id))
      .returning()

    await recordAudit(transaction, {
      userId: context.user.id,
      action: AuditAction.Updated,
      tableName,
      recordId: id,
      changes,
    })

    return updated
  })
}
