import { Role } from '~/lib/roles'

export type ServiceUser = { id: string }

export type ServiceContext = { user: ServiceUser; role: Role }

// A problem the user can fix (duplicate name, not allowed); its message is safe to show.
export class ServiceError extends Error {}

export function assertAdmin(context: ServiceContext) {
  if (context.role !== Role.Admin) {
    throw new ServiceError('Only admin can do this')
  }
}
