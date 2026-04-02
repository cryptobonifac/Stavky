import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations('riskWarning')

  const title = `${t('title')} | SmartBet365`

  return {
    title,
    alternates: {
      canonical: `/${locale}/risk-warning`,
      languages: {
        en: '/en/risk-warning',
        cs: '/cs/risk-warning',
        sk: '/sk/risk-warning',
      },
    },
    openGraph: {
      title,
      type: 'website',
      siteName: 'SmartBet365',
    },
  }
}

export default function RiskWarningLayout({ children }: { children: React.ReactNode }) {
  return children
}
