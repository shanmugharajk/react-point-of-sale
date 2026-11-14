import { z } from 'zod'

import { nameSchema } from './name'

export const createProductTypeSchema = z.object({ name: nameSchema })
export type CreateProductTypeInput = z.infer<typeof createProductTypeSchema>

export const updateProductTypeSchema = z.object({
  id: z.string().min(1),
  name: nameSchema.optional(),
  isActive: z.boolean().optional(),
})
export type UpdateProductTypeInput = z.infer<typeof updateProductTypeSchema>
