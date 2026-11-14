import { createFileRoute, useRouter } from '@tanstack/react-router'

import { authClient } from '~/lib/auth-client'

export const Route = createFileRoute('/_protected/')({
  component: Home,
})

function Home() {
  const { user, role } = Route.useRouteContext()
  const router = useRouter()

  async function signOut() {
    await authClient.signOut()
    await router.navigate({ to: '/login' })
  }

  return (
    <div className="p-8">
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold">Point of Sale</h1>
        <div className="text-right text-sm">
          {user.name} ({role})
          <button type="button" onClick={signOut} className="ml-3 underline">
            Sign out
          </button>
        </div>
      </div>
      <p className="mt-4 text-lg">
        Sell, track inventory, and manage your shop.
      </p>
    </div>
  )
}
