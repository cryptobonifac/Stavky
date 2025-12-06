'use client'

import { useMemo, useState, useTransition } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import dayjs, { Dayjs } from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers'
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

import type { ManagedUser } from '@/components/settings/UserListSection'

type FreeMonthOverrideSectionProps = {
  users: ManagedUser[]
}

const FreeMonthOverrideSection = ({ users }: FreeMonthOverrideSectionProps) => {
  const t = useTranslations('settings.freeMonthOverride')
  const [selectedId, setSelectedId] = useState<string>(users[0]?.id ?? '')
  const [selectedMonth, setSelectedMonth] = useState<Dayjs | null>(
    users.length ? dayjs().startOf('month') : null
  )
  const [grantFreeMonth, setGrantFreeMonth] = useState(true)
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [isPending, startTransition] = useTransition()

  const userOptions = useMemo(
    () => users.map((user) => ({ label: user.email, id: user.id })),
    [users]
  )

  const handleSubmit = () => {
    if (!selectedId || !selectedMonth) {
      setFeedback({
        type: 'error',
        text: t('selectUserAndMonth'),
      })
      return
    }

    startTransition(async () => {
      setFeedback(null)
      const response = await fetch(
        '/api/settings/user-subscriptions/free-month',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: selectedId,
            month: selectedMonth.startOf('month').toISOString(),
            grantNextMonthFree: grantFreeMonth,
          }),
        }
      )

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        setFeedback({
          type: 'error',
          text: payload.error ?? t('updateFailed'),
        })
        return
      }

      setFeedback({
        type: 'success',
        text: grantFreeMonth
          ? t('freeMonthGranted')
          : t('freeMonthRemoved'),
      })
    })
  }

  if (users.length === 0) {
    return (
          <Typography color="text.secondary">
            {t('noUsersAvailable')}
          </Typography>
    )
  }

  return (
        <Stack spacing={3}>
            <Typography variant="body2" color="text.secondary">
              {t('description')}
            </Typography>
          {feedback && (
            <Alert
              severity={feedback.type}
              onClose={() => setFeedback(null)}
            >
              {feedback.text}
            </Alert>
          )}
          <Autocomplete
            options={userOptions}
            value={
              userOptions.find((option) => option.id === selectedId) ?? null
            }
            onChange={(_event, value) => setSelectedId(value?.id ?? '')}
            renderInput={(params) => (
          <TextField {...params} label={t('selectUser')} inputProps={{ ...params.inputProps, 'data-testid': 'settings-free-month-user-select' }} />
            )}
        data-testid="settings-free-month-user-autocomplete"
          />
          <DatePicker
            label={t('subscriptionMonth')}
            views={['year', 'month']}
            value={selectedMonth}
            onChange={(value) => setSelectedMonth(value)}
        slotProps={{ textField: { fullWidth: true, inputProps: { 'data-testid': 'settings-free-month-date-input' } } }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={grantFreeMonth}
                onChange={(event) => setGrantFreeMonth(event.target.checked)}
            data-testid="settings-free-month-grant-switch"
              />
            }
            label={
              grantFreeMonth
                ? t('grantNextMonthFree')
                : t('removeNextMonthFree')
            }
          />
          <Button
            variant="contained"
            disabled={isPending}
            onClick={handleSubmit}
        sx={{ alignSelf: 'flex-end' }}
        data-testid="settings-free-month-save-button"
          >
            {t('saveOverride')}
          </Button>
        </Stack>
  )
}

export default FreeMonthOverrideSection


