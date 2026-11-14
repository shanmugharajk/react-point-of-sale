import { useForm } from '@tanstack/react-form'
import { useState } from 'react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { errorMessage } from '~/lib/utils'
import { nameFormSchema } from '~/schemas/name'

type NameFormValues = { name: string }

type NameFormSubmit = { value: NameFormValues }

type NameFormProps = {
  initialName: string
  submitLabel: string
  placeholder?: string
  onSave: (name: string) => Promise<void>
  onCancel?: () => void
}

// One name field with save and optional cancel; used to add and to rename.
export function NameForm({
  initialName,
  submitLabel,
  placeholder,
  onSave,
  onCancel,
}: NameFormProps) {
  const [saveError, setSaveError] = useState('')
  const form = useForm({
    defaultValues: { name: initialName },
    validators: { onSubmit: nameFormSchema },
    onSubmit: handleSave,
  })

  async function handleSave({ value }: NameFormSubmit) {
    setSaveError('')
    try {
      await onSave(value.name.trim())
      form.reset()
    } catch (error) {
      setSaveError(errorMessage(error))
    }
  }

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    form.handleSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1">
      <form.Field name="name">
        {(field) => (
          <div className="flex gap-2">
            <Input
              name={field.name}
              value={field.state.value}
              placeholder={placeholder}
              aria-label="Name"
              aria-invalid={field.state.meta.errors.length > 0}
              autoFocus={Boolean(onCancel)}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
            />
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" disabled={isSubmitting}>
                  {submitLabel}
                </Button>
              )}
            </form.Subscribe>
            {onCancel && (
              <Button type="button" variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        )}
      </form.Field>
      <form.Subscribe selector={(state) => state.fieldMeta.name?.errors}>
        {(errors) =>
          errors?.[0] && (
            <p className="text-sm text-destructive">{errors[0].message}</p>
          )
        }
      </form.Subscribe>
      {saveError && <p className="text-sm text-destructive">{saveError}</p>}
    </form>
  )
}
