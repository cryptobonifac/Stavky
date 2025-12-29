'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Box,
  Typography,
  Switch,
  FormControlLabel,
} from '@mui/material'
import { useTranslations } from 'next-intl'
import { useCookieConsent } from './CookieConsentProvider'
import { CookieCategory } from '@/lib/cookies/consent'

interface CookieCategorySetting {
  category: CookieCategory
  enabled: boolean
  required: boolean
}

export function CookieSettingsModal() {
  const t = useTranslations('cookies.settings')
  const { settingsOpen, closeSettings, consent, updateConsent, acceptAll } = useCookieConsent()

  // Local state for managing toggles before saving
  const [settings, setSettings] = useState<CookieCategorySetting[]>([
    { category: 'necessary', enabled: true, required: true },
    { category: 'analytics', enabled: consent.analytics, required: false },
    { category: 'marketing', enabled: consent.marketing, required: false },
  ])

  // Update local settings when consent changes
  useEffect(() => {
    setSettings([
      { category: 'necessary', enabled: true, required: true },
      { category: 'analytics', enabled: consent.analytics, required: false },
      { category: 'marketing', enabled: consent.marketing, required: false },
    ])
  }, [consent])

  const handleToggle = (category: CookieCategory) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.category === category && !setting.required
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    )
  }

  const handleSave = () => {
    settings.forEach((setting) => {
      if (!setting.required) {
        updateConsent(setting.category, setting.enabled)
      }
    })
    closeSettings()
  }

  const handleCancel = () => {
    // Reset to current consent state
    setSettings([
      { category: 'necessary', enabled: true, required: true },
      { category: 'analytics', enabled: consent.analytics, required: false },
      { category: 'marketing', enabled: consent.marketing, required: false },
    ])
    closeSettings()
  }

  const handleAcceptAll = () => {
    acceptAll()
    closeSettings()
  }

  return (
    <Dialog
      open={settingsOpen}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, fontWeight: 600, fontSize: '1.5rem' }}>
        {t('title')}
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('description')}
        </Typography>

        <Stack spacing={3}>
          {/* Necessary Cookies */}
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={true}
                  disabled
                  color="primary"
                />
              }
              label={
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {t('necessary.title')}
                </Typography>
              }
              sx={{ mb: 0.5 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 6 }}>
              {t('necessary.description')}
            </Typography>
          </Box>

          {/* Analytics Cookies */}
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.find((s) => s.category === 'analytics')?.enabled || false}
                  onChange={() => handleToggle('analytics')}
                  color="primary"
                />
              }
              label={
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {t('analytics.title')}
                </Typography>
              }
              sx={{ mb: 0.5 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 6 }}>
              {t('analytics.description')}
            </Typography>
          </Box>

          {/* Marketing Cookies */}
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.find((s) => s.category === 'marketing')?.enabled || false}
                  onChange={() => handleToggle('marketing')}
                  color="primary"
                />
              }
              label={
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {t('marketing.title')}
                </Typography>
              }
              sx={{ mb: 0.5 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 6 }}>
              {t('marketing.description')}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button onClick={handleCancel} color="primary" variant="text">
          {t('cancel')}
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button onClick={handleAcceptAll} color="primary" variant="outlined" sx={{ mr: 1 }}>
          {t('acceptAll')}
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          {t('save')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
