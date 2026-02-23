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

type MarketingLogicSectionProps = {
  settings: MarketingSettings | null
}

const MarketingLogicSection = ({ settings }: MarketingLogicSectionProps) => {
  const t = useTranslations('settings.marketing')
  const tCommon = useTranslations('common')
  const [autoFreeMonth, setAutoFreeMonth] = useState(
    Boolean(settings?.value?.autoFreeMonth)
  )
  const [threshold, setThreshold] = useState(
    (settings?.value?.lossThreshold as number | undefined) ?? 3
  )
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  )
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
        setFeedback({ type: 'error', text: payload.error ?? t('saveFailed') })
        return
      }
      setFeedback({ type: 'success', text: t('settingsSaved') })
    })
  }

  return (
    <Stack spacing={3}>
      <Typography variant="subtitle1" fontWeight={600}>
        {t('freeMonthLogicTitle')}
      </Typography>

      {feedback && (
        <Alert severity={feedback.type} onClose={() => setFeedback(null)}>
          {feedback.text}
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
        label={t('autoEnableDescription')}
      />

      <TextField
        type="number"
        label={t('lossThreshold')}
        value={threshold}
        onChange={(event) => setThreshold(Number(event.target.value) || 0)}
        size="small"
        sx={{ maxWidth: 200 }}
        inputProps={{
          min: 1,
          'data-testid': 'settings-marketing-loss-threshold-input',
        }}
      />

      <Button
        variant="contained"
        onClick={handleSave}
        disabled={isPending}
        sx={{ alignSelf: 'flex-start' }}
        data-testid="settings-marketing-save-button"
      >
        {tCommon('save')}
      </Button>
    </Stack>
  )
}

export default MarketingLogicSection
