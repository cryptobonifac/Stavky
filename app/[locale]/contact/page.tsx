import { getTranslations, getLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { Box, Container } from '@mui/material'

import ContactForm from '@/components/contact/ContactForm'
import Footer from '@/components/layout/Footer'
import TopNav from '@/components/navigation/TopNav'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations('contact')

  const title = `${t('title')} | SmartBet365`

  return {
    title,
    alternates: {
      canonical: `/${locale}/contact`,
      languages: {
        en: '/en/contact',
        cs: '/cs/contact',
        sk: '/sk/contact',
      },
    },
    openGraph: {
      title,
      type: 'website',
      siteName: 'SmartBet365',
    },
  }
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('contact')

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: { xs: 2, md: 4 }, pt: 3 }}>
        <TopNav showSettingsLink={false} />
      </Box>

      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="md">
          <ContactForm showTitle={true} showDescription={true} />
        </Container>
      </Box>

      <Footer />
    </Box>
  )
}















