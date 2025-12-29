'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  CookieConsent,
  CookieCategory,
  getStoredConsent,
  setStoredConsent,
  DEFAULT_CONSENT,
} from '@/lib/cookies/consent'

interface CookieConsentContextValue {
  consent: CookieConsent
  hasConsented: boolean
  showBanner: boolean
  settingsOpen: boolean
  acceptAll: () => void
  rejectAll: () => void
  updateConsent: (category: CookieCategory, value: boolean) => void
  openSettings: () => void
  closeSettings: () => void
}

const CookieConsentContext = createContext<CookieConsentContextValue | undefined>(undefined)

export function useCookieConsent(): CookieConsentContextValue {
  const context = useContext(CookieConsentContext)
  if (!context) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider')
  }
  return context
}

interface CookieConsentProviderProps {
  children: React.ReactNode
}

export function CookieConsentProvider({ children }: CookieConsentProviderProps) {
  const [consent, setConsent] = useState<CookieConsent>(DEFAULT_CONSENT)
  const [hasConsented, setHasConsented] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Load consent from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const stored = getStoredConsent()

    if (stored) {
      setConsent(stored.consent)
      setHasConsented(true)
      setShowBanner(false)
    } else {
      setConsent(DEFAULT_CONSENT)
      setHasConsented(false)
      setShowBanner(true)
    }
  }, [])

  // Accept all cookies
  const acceptAll = useCallback(() => {
    const newConsent: CookieConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
    }

    setConsent(newConsent)
    setStoredConsent(newConsent)
    setHasConsented(true)
    setShowBanner(false)
    setSettingsOpen(false)

    console.log('Cookie consent: All cookies accepted')
  }, [])

  // Reject all non-essential cookies
  const rejectAll = useCallback(() => {
    const newConsent: CookieConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
    }

    setConsent(newConsent)
    setStoredConsent(newConsent)
    setHasConsented(true)
    setShowBanner(false)
    setSettingsOpen(false)

    console.log('Cookie consent: All non-essential cookies rejected')
  }, [])

  // Update consent for a specific category
  const updateConsent = useCallback((category: CookieCategory, value: boolean) => {
    setConsent((prev) => {
      const newConsent = {
        ...prev,
        [category]: category === 'necessary' ? true : value, // Necessary always true
      }

      setStoredConsent(newConsent)
      setHasConsented(true)

      return newConsent
    })
  }, [])

  // Open settings modal
  const openSettings = useCallback(() => {
    setSettingsOpen(true)
  }, [])

  // Close settings modal
  const closeSettings = useCallback(() => {
    setSettingsOpen(false)
  }, [])

  // Don't render children until mounted to avoid hydration issues
  if (!mounted) {
    return null
  }

  const value: CookieConsentContextValue = {
    consent,
    hasConsented,
    showBanner,
    settingsOpen,
    acceptAll,
    rejectAll,
    updateConsent,
    openSettings,
    closeSettings,
  }

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  )
}
