export { cn } from 'cn'

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong'
}
