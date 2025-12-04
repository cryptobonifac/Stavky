import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'
import { AppThemeProvider } from '@/components/providers/app-theme-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import LocaleHtml from '@/components/layout/LocaleHtml'
import '../globals.css'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  other: {
    'google': 'notranslate',
  },
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Providing all messages to the client
  // Load messages explicitly for the current locale
  // This ensures the correct translation file is loaded
  const messages = (await import(`../../messages/${locale}.json`)).default

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LocaleHtml locale={locale}>
        <AppThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </AppThemeProvider>
      </LocaleHtml>
    </NextIntlClientProvider>
  )
}

