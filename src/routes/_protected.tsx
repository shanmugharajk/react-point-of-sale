import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useRouter,
} from '@tanstack/react-router'

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

const navLinkClass = 'text-muted-foreground hover:text-foreground'
const activeNavLinkProps = { className: 'text-foreground font-medium' }

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
        <nav className="flex flex-1 gap-4 text-sm">
          {role === Role.Admin && (
            <Link
              to="/admin/product-types"
              className={navLinkClass}
              activeProps={activeNavLinkProps}
            >
              Product types
            </Link>
          )}
        </nav>
        <div className="text-sm">
          {user.name} ({role})
          <button type="button" onClick={signOut} className="ml-3 underline">
            Sign out
          </button>
        </div>
      </header>
      <Outlet />
    </div>
  )
}
