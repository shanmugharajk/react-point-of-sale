import { auth } from '~/lib/auth.server'
import type { Role } from '~/lib/roles'
import { type ServiceContext, ServiceError } from '~/server/services/context'

// Shared by every adapter (server functions now, the mobile API later).
export async function getServiceContext(
  headers: Headers,
): Promise<ServiceContext> {
  const session = await auth.api.getSession({ headers })

  if (!session) {
    throw new ServiceError('Please sign in again')
  }

  return {
    user: { id: session.user.id },
    role: session.user.role as Role,
  }
}
