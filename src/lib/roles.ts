export const Role = { Admin: 'admin', Employee: 'employee' } as const
export type Role = (typeof Role)[keyof typeof Role]
