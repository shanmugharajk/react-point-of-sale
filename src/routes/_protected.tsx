import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { getSession } from '~/lib/auth.functions'
import type { Role } from '~/lib/roles'

export const Route = createFileRoute('/_protected')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session) throw redirect({ to: '/login' })
    return { user: session.user, role: session.user.role as Role }
  },
  component: Outlet,
})
