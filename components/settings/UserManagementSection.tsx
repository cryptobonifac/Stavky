'use client'

import { useMemo, useState, useTransition } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import dayjs, { Dayjs } from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers'
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useTranslations } from 'next-intl'

import DateTimePickerField from '@/components/ui/date-time-picker-field'

export type ManagedUser = {
  id: string
  email: string
  role: 'betting' | 'customer'
  account_active_until: string | null
}

type UserManagementSectionProps = {
  users: ManagedUser[]
  variant?: 'user' | 'freeMonth'
}

const UserManagementSection = ({ users, variant = 'user' }: UserManagementSectionProps) => {
  const t = useTranslations('settings')
  const tCommon = useTranslations('common')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  // User management state
  const [drafts, setDrafts] = useState<Record<string, ManagedUser>>(() =>
    Object.fromEntries(users.map((user) => [user.id, user]))
  )
  const [selectedId, setSelectedId] = useState<string | null>(users[0]?.id ?? null)

  // Free month override state
  const [selectedMonth, setSelectedMonth] = useState<Dayjs | null>(
    users.length ? dayjs().startOf('month') : null
  )
  const [grantFreeMonth, setGrantFreeMonth] = useState(true)

  const userOptions = useMemo(
    () => users.map((user) => ({ label: user.email, id: user.id })),
    [users]
  )

  const selectedDraft = selectedId ? drafts[selectedId] : null

  const handleDateChange = (id: string, value: Dayjs | null) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        account_active_until: value ? value.toISOString() : null,
      },
    }))
  }

  const handleSaveUser = (id: string) => {
    const draft = drafts[id]
    startTransition(async () => {
      setFeedback(null)
      const response = await fetch(`/api/settings/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        setFeedback({ type: 'error', text: payload.error ?? t('users.updateFailed') })
        return
      }

      setFeedback({ type: 'success', text: t('users.userUpdated') })
    })
  }

  const handleSaveFreeMonth = () => {
    if (!selectedId || !selectedMonth) {
      setFeedback({
        type: 'error',
        text: t('freeMonthOverride.selectUserAndMonth'),
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
          text: payload.error ?? t('freeMonthOverride.updateFailed'),
        })
        return
      }

      setFeedback({
        type: 'success',
        text: grantFreeMonth
          ? t('freeMonthOverride.freeMonthGranted')
          : t('freeMonthOverride.freeMonthRemoved'),
      })
    })
  }

  if (users.length === 0) {
    return <Typography color="text.secondary">{t('users.noUsers')}</Typography>
  }

  if (variant === 'freeMonth') {
    return (
      <Stack spacing={3}>
        <Typography variant="subtitle1" fontWeight={600}>
          {t('freeMonthOverride.subtitle')}
        </Typography>

        {feedback && (
          <Alert severity={feedback.type} onClose={() => setFeedback(null)}>
            {feedback.text}
          </Alert>
        )}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Autocomplete
            options={userOptions}
            value={userOptions.find((option) => option.id === selectedId) ?? null}
            onChange={(_event, value) => setSelectedId(value?.id ?? null)}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('freeMonthOverride.selectUser')}
                size="small"
                inputProps={{ ...params.inputProps, 'data-testid': 'settings-free-month-user-select' }}
              />
            )}
            sx={{ flex: 1, minWidth: 200 }}
            data-testid="settings-free-month-user-autocomplete"
          />
          <DatePicker
            label={t('freeMonthOverride.subscriptionMonth')}
            views={['year', 'month']}
            value={selectedMonth}
            onChange={(value) => setSelectedMonth(value)}
            slotProps={{
              textField: {
                size: 'small',
                sx: { minWidth: 180 },
                inputProps: { 'data-testid': 'settings-free-month-date-input' },
              },
            }}
          />
        </Stack>

        <FormControlLabel
          control={
            <Switch
              checked={grantFreeMonth}
              onChange={(event) => setGrantFreeMonth(event.target.checked)}
              data-testid="settings-free-month-grant-switch"
            />
          }
          label={t('freeMonthOverride.grantNextMonthFree')}
        />

        <Button
          variant="contained"
          disabled={isPending}
          onClick={handleSaveFreeMonth}
          fullWidth
          data-testid="settings-free-month-save-button"
        >
          {t('freeMonthOverride.saveOverride')}
        </Button>
      </Stack>
    )
  }

  return (
    <Stack spacing={3}>
      {feedback && (
        <Alert severity={feedback.type} onClose={() => setFeedback(null)}>
          {feedback.text}
        </Alert>
      )}

      <Autocomplete
        options={userOptions}
        value={userOptions.find((option) => option.id === selectedId) ?? null}
        onChange={(_event, value) => setSelectedId(value?.id ?? null)}
        renderInput={(params) => (
          <TextField
            {...params}
            id="settings-user-search-autocomplete"
            label={t('users.searchUsers')}
            size="small"
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <>
                    {params.InputProps.endAdornment}
                    <ArrowForwardIcon sx={{ color: 'action.active', ml: 1 }} />
                  </>
                ),
              },
            }}
            inputProps={{ ...params.inputProps, 'data-testid': 'settings-user-search' }}
          />
        )}
        data-testid="settings-user-autocomplete"
      />

      {selectedDraft && (
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              value={selectedDraft.email}
              label={t('users.userEmail')}
              slotProps={{ input: { readOnly: true } }}
              size="small"
              sx={{ flex: 1 }}
              inputProps={{ 'data-testid': 'settings-user-email' }}
            />
            <Box sx={{ minWidth: 200 }}>
              <DateTimePickerField
                label={t('users.accountActiveUntil')}
                value={
                  selectedDraft.account_active_until
                    ? dayjs(selectedDraft.account_active_until)
                    : null
                }
                onChange={(value: Dayjs | null) => handleDateChange(selectedDraft.id, value)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    inputProps: { 'data-testid': 'settings-user-active-until' },
                  },
                }}
              />
            </Box>
          </Stack>
          <Button
            variant="contained"
            onClick={() => handleSaveUser(selectedDraft.id)}
            disabled={isPending}
            fullWidth
            data-testid="settings-user-save-button"
          >
            {tCommon('save')}
          </Button>
        </Stack>
      )}
    </Stack>
  )
}

export default UserManagementSection
