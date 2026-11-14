import { drizzle } from 'drizzle-orm/libsql'
import { dbUrl } from './url'

export const db = drizzle(dbUrl)
