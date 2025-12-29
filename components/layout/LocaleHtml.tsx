'use client'

import { useEffect } from 'react'
import { inject } from '@vercel/analytics'
import { useCookieConsent } from '@/components/cookies'

type LocaleHtmlProps = {
  children: React.ReactNode
  locale: string
}

export default function LocaleHtml({ children, locale }: LocaleHtmlProps) {
  const { consent, hasConsented } = useCookieConsent()

  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Set the lang attribute for accessibility
      document.documentElement.lang = locale

      // Prevent browser translation popup - set on html element
      document.documentElement.setAttribute('translate', 'no')
      document.documentElement.setAttribute('data-translate', 'no')

      // Also set on body for extra protection
      if (document.body) {
        document.body.setAttribute('translate', 'no')
        document.body.setAttribute('data-translate', 'no')
      }

      // Add meta tag to prevent browser translation (Chrome/Edge)
      let metaTag = document.querySelector('meta[name="google"][content="notranslate"]')
      if (!metaTag) {
        metaTag = document.createElement('meta')
        metaTag.setAttribute('name', 'google')
        metaTag.setAttribute('content', 'notranslate')
        document.head.appendChild(metaTag)
      }

      // Also add class="notranslate" to html element (additional method)
      document.documentElement.classList.add('notranslate')
    }
  }, [locale])

  // Run immediately on mount as well
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Immediate execution to prevent translation prompt
      const html = document.documentElement
      html.setAttribute('translate', 'no')
      html.setAttribute('data-translate', 'no')
      html.classList.add('notranslate')

      if (document.body) {
        document.body.setAttribute('translate', 'no')
      }
    }
  }, [])

  useEffect(() => {
    // Initialize Vercel Web Analytics only if user has consented to analytics cookies
    if (hasConsented && consent?.analytics) {
      inject()
      console.log('Analytics enabled: User has consented to analytics cookies')
    } else if (hasConsented && !consent?.analytics) {
      console.log('Analytics disabled: User has not consented to analytics cookies')
    }
  }, [hasConsented, consent?.analytics])

  return <>{children}</>
}

