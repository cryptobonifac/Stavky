'use client'

import { useState, useTransition } from 'react'
import {
  Alert,
  Button,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { useTranslations } from 'next-intl'

type MarketingSettings = {
  id: string
  key: string
  value: Record<string, unknown>
}

type MarketingSettingsSectionProps = {
  settings: MarketingSettings | null
}

const MarketingSettingsSection = ({
  settings,
}: MarketingSettingsSectionProps) => {
  const t = useTranslations('settings.marketing')
  const [autoFreeMonth, setAutoFreeMonth] = useState(
    Boolean(settings?.value?.autoFreeMonth)
  )
  const [threshold, setThreshold] = useState(
    (settings?.value?.lossThreshold as number | undefined) ?? 3
  )
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSave = () => {
    startTransition(async () => {
      setFeedback(null)
      const response = await fetch('/api/settings/marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          autoFreeMonth,
          lossThreshold: threshold,
        }),
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        setFeedback(payload.error ?? t('saveFailed'))
        return
      }
      setFeedback(t('settingsSaved'))
    })
  }

  return (
    <Stack spacing={3}>
      <Typography variant="body2" color="text.secondary">
        {t('freeMonthDescription')}
      </Typography>
      {feedback && (
        <Alert severity="success" onClose={() => setFeedback(null)}>
          {feedback}
        </Alert>
      )}
      <FormControlLabel
        control={
          <Switch
            checked={autoFreeMonth}
            onChange={(event) => setAutoFreeMonth(event.target.checked)}
            data-testid="settings-marketing-auto-free-month-switch"
          />
        }
        label={t('autoEnable')}
      />
      <TextField
        type="number"
        label={t('lossThreshold')}
        value={threshold}
        onChange={(event) =>
          setThreshold(Number(event.target.value) || 0)
        }
        helperText={t('lossThresholdHelper')}
        inputProps={{ 'data-testid': 'settings-marketing-loss-threshold-input' }}
      />
      <Button
        variant="contained"
        onClick={handleSave}
        disabled={isPending}
        sx={{ alignSelf: 'flex-start' }}
        data-testid="settings-marketing-save-button"
      >
        {t('saveSettings')}
      </Button>
    </Stack>
  )
}

export default MarketingSettingsSection


