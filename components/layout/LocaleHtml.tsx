'use client'

import { useEffect } from 'react'

type LocaleHtmlProps = {
  children: React.ReactNode
  locale: string
}

export default function LocaleHtml({ children, locale }: LocaleHtmlProps) {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Set the lang attribute
      document.documentElement.lang = locale
      
      // Prevent browser translation popup
      document.documentElement.setAttribute('translate', 'no')
      // Also set on body for extra protection
      document.body?.setAttribute('translate', 'no')
      
      // Add meta tag to prevent browser translation
      let metaTag = document.querySelector('meta[name="google"][content="notranslate"]')
      if (!metaTag) {
        metaTag = document.createElement('meta')
        metaTag.setAttribute('name', 'google')
        metaTag.setAttribute('content', 'notranslate')
        document.head.appendChild(metaTag)
      }
    }
  }, [locale])

  return <>{children}</>
}

