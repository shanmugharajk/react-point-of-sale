import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

import { auth } from './auth'

export const getSession = createServerFn({ method: 'GET' }).handler(() =>
  auth.api.getSession({ headers: getRequestHeaders() }),
)
