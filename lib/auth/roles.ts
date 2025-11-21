export type UserRole = 'betting' | 'customer'

export const hasRole = (
  role: UserRole | string | null | undefined,
  expected: UserRole
) => role === expected

export const canManageBets = (role: UserRole | string | null | undefined) =>
  role === 'betting'

export const canViewCustomerContent = (
  role: UserRole | string | null | undefined
) => role === 'betting' || role === 'customer'

export const roleLabelMap: Record<UserRole, string> = {
  betting: 'Betting Admin',
  customer: 'Customer',
}


