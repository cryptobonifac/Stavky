import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations('legalDisclaimer')

  const title = `${t('title')} | SmartBet365`

  return {
    title,
    alternates: {
      canonical: `/${locale}/legal-disclaimer`,
      languages: {
        en: '/en/legal-disclaimer',
        cs: '/cs/legal-disclaimer',
        sk: '/sk/legal-disclaimer',
      },
    },
    openGraph: {
      title,
      type: 'website',
      siteName: 'SmartBet365',
    },
  }
}

export default function LegalDisclaimerLayout({ children }: { children: React.ReactNode }) {
  return children
}
