import { createServerFn } from '@tanstack/react-start'

import {
  createProductTypeSchema,
  updateProductTypeSchema,
} from '~/schemas/product-type'
import * as productTypeService from '~/server/services/product-types.server'

import { sessionMiddleware } from './session-middleware'

export const listProductTypes = createServerFn({ method: 'GET' })
  .middleware([sessionMiddleware])
  .handler(() => productTypeService.listProductTypes())

export const createProductType = createServerFn({ method: 'POST' })
  .middleware([sessionMiddleware])
  .validator(createProductTypeSchema)
  .handler(({ data, context }) =>
    productTypeService.createProductType(data, context.serviceContext),
  )

export const updateProductType = createServerFn({ method: 'POST' })
  .middleware([sessionMiddleware])
  .validator(updateProductTypeSchema)
  .handler(({ data, context }) =>
    productTypeService.updateProductType(data, context.serviceContext),
  )
