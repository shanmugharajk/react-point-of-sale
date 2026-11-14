import { z } from 'zod'

export const nameSchema = z
  .string()
  .trim()
  .min(1, 'Enter a name')
  .max(60, 'Keep it under 60 letters')

export const nameFormSchema = z.object({ name: nameSchema })
