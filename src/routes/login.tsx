import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useState } from 'react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { getSession } from '~/lib/auth.functions'
import { authClient } from '~/lib/auth-client'

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    if (await getSession()) throw redirect({ to: '/' })
  },
  component: Login,
})

function Login() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const { error } = await authClient.signIn.email({
      email: String(formData.get('email')),
      password: String(formData.get('password')),
    })
    if (error) return setErrorMessage(error.message ?? 'Sign in failed')
    await router.invalidate()
    await router.navigate({ to: '/' })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex min-h-svh max-w-sm flex-col justify-center gap-4 p-8"
    >
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      {errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
      <Button type="submit">Sign in</Button>
    </form>
  )
}
