import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations('privacy')

  const title = `${t('title')} | SmartBet365`

  return {
    title,
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: {
        en: '/en/privacy',
        cs: '/cs/privacy',
        sk: '/sk/privacy',
      },
    },
    openGraph: {
      title,
      type: 'website',
      siteName: 'SmartBet365',
    },
  }
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
