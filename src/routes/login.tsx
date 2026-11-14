import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useState } from 'react'

import { Button } from '~/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '~/components/ui/field'
import { Input } from '~/components/ui/input'
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
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </Field>
        {errorMessage && <FieldError>{errorMessage}</FieldError>}
        <Button type="submit">Sign in</Button>
      </FieldGroup>
    </form>
  )
}
