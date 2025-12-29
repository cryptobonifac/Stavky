'use client'

import { Box, Typography, Stack, Button, Divider, Paper, Container } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useCookieConsent } from '@/components/cookies'

export default function PrivacyPage() {
  const t = useTranslations('privacy')
  const { openSettings } = useCookieConsent()

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 4, md: 8, lg: 10 },
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2, md: 3 },
      }}
    >
      <Stack spacing={4} sx={{ maxWidth: 900, mx: 'auto', width: '100%' }}>
        {/* Page Header */}
        <Box>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' },
              mb: 2,
            }}
          >
            {t('title')}
          </Typography>
          <Divider sx={{ mb: 3 }} />
        </Box>

        {/* Introduction */}
        <Paper
          elevation={0}
          variant="outlined"
          sx={{
            p: { xs: 2.5, sm: 3, md: 4 },
            borderColor: 'rgba(15, 23, 42, 0.08)',
          }}
        >
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            {t('introduction.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            {t('introduction.content')}
          </Typography>
        </Paper>

        {/* Cookie Usage */}
        <Paper
          elevation={0}
          variant="outlined"
          sx={{
            p: { xs: 2.5, sm: 3, md: 4 },
            borderColor: 'rgba(15, 23, 42, 0.08)',
          }}
        >
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            {t('cookieUsage.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 3 }}>
            {t('cookieUsage.content')}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={openSettings}
            sx={{ textTransform: 'none' }}
          >
            {t('cookieUsage.manageCookies')}
          </Button>
        </Paper>

        {/* Data Collection */}
        <Paper
          elevation={0}
          variant="outlined"
          sx={{
            p: { xs: 2.5, sm: 3, md: 4 },
            borderColor: 'rgba(15, 23, 42, 0.08)',
          }}
        >
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            {t('dataCollection.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            {t('dataCollection.content')}
          </Typography>
        </Paper>

        {/* User Rights */}
        <Paper
          elevation={0}
          variant="outlined"
          sx={{
            p: { xs: 2.5, sm: 3, md: 4 },
            borderColor: 'rgba(15, 23, 42, 0.08)',
          }}
        >
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            {t('userRights.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            {t('userRights.content')}
          </Typography>
        </Paper>

        {/* Contact Information */}
        <Paper
          elevation={0}
          variant="outlined"
          sx={{
            p: { xs: 2.5, sm: 3, md: 4 },
            borderColor: 'rgba(15, 23, 42, 0.08)',
          }}
        >
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            {t('contact.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            {t('contact.content')}
          </Typography>
        </Paper>
      </Stack>
    </Container>
  )
}
