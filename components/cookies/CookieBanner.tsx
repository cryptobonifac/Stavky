'use client'

import React from 'react'
import { Box, Paper, Typography, Button, Stack, Slide, Link as MuiLink } from '@mui/material'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useCookieConsent } from './CookieConsentProvider'
import { CookieSettingsModal } from './CookieSettingsModal'

export function CookieBanner() {
  const t = useTranslations('cookies.banner')
  const { showBanner, acceptAll, rejectAll, openSettings, settingsOpen } = useCookieConsent()

  return (
    <>
      <Slide direction="up" in={showBanner} mountOnEnter unmountOnExit timeout={300}>
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1400,
          }}
        >
          <Paper
            elevation={8}
            sx={{
              borderTop: 1,
              borderColor: 'divider',
              borderRadius: 0,
              p: { xs: 2, md: 3 },
              maxWidth: 1200,
              mx: 'auto',
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={3}
              alignItems={{ xs: 'stretch', md: 'center' }}
              justifyContent="space-between"
            >
              {/* Content */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    fontSize: { xs: '1rem', md: '1.125rem' },
                  }}
                >
                  {t('title')}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {t('description')}
                </Typography>
                <MuiLink
                  component={Link}
                  href="/privacy"
                  color="primary"
                  underline="hover"
                  sx={{ fontSize: '0.875rem' }}
                >
                  {t('learnMore')}
                </MuiLink>
              </Box>

              {/* Buttons */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                sx={{ minWidth: { md: 'auto' } }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={rejectAll}
                  sx={{ minWidth: { xs: '100%', sm: 120 } }}
                >
                  {t('rejectAll')}
                </Button>
                <Button
                  variant="text"
                  color="primary"
                  onClick={openSettings}
                  size="small"
                  sx={{ minWidth: { xs: '100%', sm: 120 } }}
                >
                  {t('customize')}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={acceptAll}
                  sx={{ minWidth: { xs: '100%', sm: 120 } }}
                >
                  {t('acceptAll')}
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Slide>

      {/* Settings Modal */}
      {settingsOpen && <CookieSettingsModal />}
    </>
  )
}
