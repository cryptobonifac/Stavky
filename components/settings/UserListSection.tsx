'use client'

import { useMemo, useState, useTransition } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import dayjs, { Dayjs } from 'dayjs'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useTranslations } from 'next-intl'

import DateTimePickerField from '@/components/ui/date-time-picker-field'

export type ManagedUser = {
  id: string
  email: string
  role: 'betting' | 'customer'
  account_active_until: string | null
}

type UserListSectionProps = {
  users: ManagedUser[]
}

const UserListSection = ({ users }: UserListSectionProps) => {
  const t = useTranslations('settings.users')
  const tCommon = useTranslations('common')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [drafts, setDrafts] = useState<Record<string, ManagedUser>>(() =>
    Object.fromEntries(users.map((user) => [user.id, user]))
  )
  const [selectedId, setSelectedId] = useState<string | null>(
    users[0]?.id ?? null
  )

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

  const handleSave = (id: string) => {
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
        setFeedback(payload.error ?? t('updateFailed'))
        return
      }

      setFeedback(t('userUpdated'))
    })
  }

  if (users.length === 0) {
    return <Typography color="text.secondary">{t('noUsers')}</Typography>
  }

  return (
    <Stack spacing={3}>
      {feedback && <Alert onClose={() => setFeedback(null)}>{feedback}</Alert>}
      <Autocomplete
        options={userOptions}
        value={
          userOptions.find((option) => option.id === selectedId) ?? null
        }
        onChange={(_event, value) => setSelectedId(value?.id ?? null)}
        renderInput={(params) => (
          <TextField 
            {...params} 
            id="settings-user-search-autocomplete"
            label={t('searchUsers')} 
            inputProps={{ ...params.inputProps, 'data-testid': 'settings-user-search' }} 
          />
        )}
        data-testid="settings-user-autocomplete"
      />
      {selectedDraft && (
        <Card
          variant="outlined"
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <CardContent>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems={{ xs: 'stretch', md: 'flex-end' }}
            >
              <TextField
                value={selectedDraft.email}
                label={t('userEmail')}
                InputProps={{ readOnly: true }}
                size="small"
                sx={{ flex: 1, minWidth: 250, maxWidth: 400 }}
                inputProps={{ 'data-testid': 'settings-user-email' }}
              />
              <Box sx={{ flex: 1, minWidth: 200, maxWidth: 250 }}>
                <DateTimePickerField
                  label={t('accountActiveUntil')}
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
              <Button
                variant="contained"
                onClick={() => handleSave(selectedDraft.id)}
                disabled={isPending}
                sx={{ minWidth: 100, ml: { md: -1 } }}
                data-testid="settings-user-save-button"
              >
                {tCommon('save')}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  )
}

export default UserListSection


