import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import HomePageContent from '@/components/home/HomePageContent'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations('home')

  const title = `${t('title')} ${t('titleHighlight')} | SmartBet365`
  const description = t('subtitle')

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        cs: '/cs',
        sk: '/sk',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'SmartBet365',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default function Home() {
  return <HomePageContent />
}
