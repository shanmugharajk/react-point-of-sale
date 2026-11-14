import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { Role } from '~/lib/roles'

export const Route = createFileRoute('/_protected/admin')({
  beforeLoad: ({ context }) => {
    if (context.role !== Role.Admin) throw redirect({ to: '/' })
  },
  component: Outlet,
})
