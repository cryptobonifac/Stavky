import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations('terms')

  const title = `${t('title')} | SmartBet365`

  return {
    title,
    alternates: {
      canonical: `/${locale}/terms`,
      languages: {
        en: '/en/terms',
        cs: '/cs/terms',
        sk: '/sk/terms',
      },
    },
    openGraph: {
      title,
      type: 'website',
      siteName: 'SmartBet365',
    },
  }
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
