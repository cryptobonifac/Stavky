/**
 * Cookie Consent Utilities
 * GDPR-compliant cookie consent management with localStorage persistence
 */

export type CookieCategory = 'necessary' | 'analytics' | 'marketing'

export interface CookieConsent {
  necessary: boolean // Always true
  analytics: boolean
  marketing: boolean
}

export interface StoredConsent {
  version: number
  consent: CookieConsent
  timestamp: number
  expiresAt: number
}

// localStorage key for storing consent
export const CONSENT_STORAGE_KEY = 'stavky_cookie_consent'

// Consent expires after 365 days (GDPR recommendation)
export const CONSENT_EXPIRY_DAYS = 365

/**
 * Default consent: Only necessary cookies enabled
 */
export const DEFAULT_CONSENT: CookieConsent = {
  necessary: true,
  analytics: false,
  marketing: false,
}

/**
 * Get stored consent from localStorage
 * Returns null if not found or expired
 */
export function getStoredConsent(): StoredConsent | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!stored) {
      return null
    }

    const data: StoredConsent = JSON.parse(stored)

    // Check if consent has expired
    if (isConsentExpired(data)) {
      localStorage.removeItem(CONSENT_STORAGE_KEY)
      return null
    }

    return data
  } catch (error) {
    console.error('Error reading cookie consent from localStorage:', error)
    return null
  }
}

/**
 * Save consent to localStorage
 */
export function setStoredConsent(consent: CookieConsent): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const now = Date.now()
    const expiresAt = now + CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000

    const data: StoredConsent = {
      version: 1,
      consent: {
        ...consent,
        necessary: true, // Always true
      },
      timestamp: now,
      expiresAt,
    }

    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving cookie consent to localStorage:', error)
  }
}

/**
 * Check if stored consent has expired
 */
export function isConsentExpired(stored: StoredConsent): boolean {
  return Date.now() > stored.expiresAt
}

/**
 * Clear stored consent from localStorage
 * Useful for testing or when user wants to reset preferences
 */
export function clearStoredConsent(): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing cookie consent from localStorage:', error)
  }
}

/**
 * Get consent status for a specific category
 */
export function hasConsentFor(category: CookieCategory): boolean {
  const stored = getStoredConsent()
  if (!stored) {
    return category === 'necessary' // Only necessary cookies by default
  }

  return stored.consent[category]
}
