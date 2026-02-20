'use client'

import { Box, Typography, Stack, Divider, Paper } from '@mui/material'
import { useTranslations } from 'next-intl'
import MainLayout from '@/components/layout/MainLayout'
import TopNav from '@/components/navigation/TopNav'
import PageSection from '@/components/layout/PageSection'

export default function LegalDisclaimerPage() {
  const t = useTranslations('legalDisclaimer')

  const sections = [
    'generalInformation',
    'noGamblingServices',
    'noGuarantee',
    'financialRiskWarning',
    'personalResponsibility',
    'notFinancialAdvice',
    'thirdPartyPlatforms',
    'serviceNature',
    'regulatoryPositioning',
    'limitationOfLiability',
    'accuracyOfInformation',
    'userEligibility',
    'responsibleBetting',
    'intellectualProperty',
    'changesToDisclaimer',
    'contactInformation'
  ]

  return (
    <MainLayout>
      <TopNav />
      <PageSection maxWidth="lg">
        <Stack spacing={4} sx={{ maxWidth: 900, mx: 'auto', width: '100%' }}>
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

          {sections.map((section) => (
            <Paper
              key={section}
              elevation={0}
              variant="outlined"
              sx={{
                p: { xs: 2.5, sm: 3, md: 4 },
                borderColor: 'rgba(15, 23, 42, 0.08)',
              }}
            >
              <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
                {t(`${section}.title`)}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}
              >
                {t(`${section}.content`)}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </PageSection>
    </MainLayout>
  )
}
