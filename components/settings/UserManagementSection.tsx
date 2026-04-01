'use client'

import { useMemo, useState, useTransition } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import dayjs, { Dayjs } from 'dayjs'
import {
  Alert,
  Box,
  Button,
  Stack,
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
}

const UserManagementSection = ({ users }: UserManagementSectionProps) => {
  const t = useTranslations('settings')
  const tCommon = useTranslations('common')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const [drafts, setDrafts] = useState<Record<string, ManagedUser>>(() =>
    Object.fromEntries(users.map((user) => [user.id, user]))
  )
  const [selectedId, setSelectedId] = useState<string | null>(users[0]?.id ?? null)

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

  if (users.length === 0) {
    return <Typography color="text.secondary">{t('users.noUsers')}</Typography>
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
