import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import IntroductionContent from '@/components/introduction/IntroductionContent'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations('introduction')

  const title = `${t('about.title')} | SmartBet365`
  const description = t('about.description')

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/introduction`,
      languages: {
        en: '/en/introduction',
        cs: '/cs/introduction',
        sk: '/sk/introduction',
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

export default function Introduction() {
  return <IntroductionContent />
}
