import { createMiddleware } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

import { ServiceError } from '~/server/services/context'
import { getServiceContext } from '~/server/session.server'

// Only messages we wrote reach the screen; anything else (SQL, bugs) is logged and hidden.
function toSafeError(error: unknown) {
  if (error instanceof ServiceError || !(error instanceof Error)) {
    return error
  }
  console.error(error)
  return new Error('Something went wrong')
}

// Gives every server function the signed-in user as the service context.
export const sessionMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    try {
      const serviceContext = await getServiceContext(getRequestHeaders())
      return await next({ context: { serviceContext } })
    } catch (error) {
      throw toSafeError(error)
    }
  },
)
