import { getTranslations, getLocale } from 'next-intl/server'
import { Box, Container } from '@mui/material'

import ContactForm from '@/components/contact/ContactForm'
import Footer from '@/components/layout/Footer'
import TopNav from '@/components/navigation/TopNav'

export async function generateMetadata() {
  const t = await getTranslations('contact')
  return {
    title: `${t('title')} | Stavky`,
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







