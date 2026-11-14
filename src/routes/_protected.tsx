import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useRouter,
} from '@tanstack/react-router'

import { Button, buttonVariants } from '~/components/ui/button'
import { getSession } from '~/lib/auth.functions'
import { authClient } from '~/lib/auth-client'
import { Role } from '~/lib/roles'

export const Route = createFileRoute('/_protected')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session) throw redirect({ to: '/login' })
    return { user: session.user, role: session.user.role as Role }
  },
  component: ProtectedLayout,
})

// Router marks the current page's link with data-status="active".
const navLinkClass = buttonVariants({
  variant: 'ghost',
  size: 'sm',
  className: 'data-[status=active]:bg-muted',
})

function ProtectedLayout() {
  const { user, role } = Route.useRouteContext()
  const router = useRouter()

  async function signOut() {
    await authClient.signOut()
    await router.navigate({ to: '/login' })
  }

  return (
    <div className="min-h-svh">
      <header className="flex items-center gap-6 border-b px-8 py-3">
        <Link to="/" className="font-semibold">
          Point of Sale
        </Link>
        <nav className="flex flex-1 gap-1">
          {role === Role.Admin && (
            <Link to="/admin/product-types" className={navLinkClass}>
              Product types
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-2 text-sm">
          {user.name} ({role})
          <Button variant="ghost" size="sm" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </header>
      <Outlet />
    </div>
  )
}
