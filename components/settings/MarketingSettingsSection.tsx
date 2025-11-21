'use client'

import { useState, useTransition } from 'react'
import {
  Alert,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'

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
        setFeedback(payload.error ?? 'Failed to update marketing settings')
        return
      }
      setFeedback('Marketing settings saved.')
    })
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={3}>
          <div>
            <Typography variant="h5">Marketing & free month settings</Typography>
            <Typography variant="body2" color="text.secondary">
              Configure how free months are automatically granted after losing
              streaks.
            </Typography>
          </div>
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
              />
            }
            label="Grant free month automatically after loss threshold"
          />
          <TextField
            type="number"
            label="Loss threshold"
            value={threshold}
            onChange={(event) =>
              setThreshold(Number(event.target.value) || 0)
            }
            helperText="Number of losses in a month before granting a free month"
          />
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isPending}
          >
            Save settings
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default MarketingSettingsSection


