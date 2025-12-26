/**
 * Check if a user account is currently active
 * @param accountActiveUntil - The account expiration timestamp (ISO string or null)
 * @returns true if account is active (expiration date is in the future or null means inactive)
 */
export function isAccountActive(accountActiveUntil: string | null): boolean {
  if (!accountActiveUntil) return false
  return new Date(accountActiveUntil) >= new Date()
}
