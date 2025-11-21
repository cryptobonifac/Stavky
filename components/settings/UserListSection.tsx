'use client'

import { useMemo, useState, useTransition } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import dayjs, { Dayjs } from 'dayjs'
import {
  Alert,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

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

  const handleRoleChange = (id: string, role: ManagedUser['role']) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], role },
    }))
  }

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
        setFeedback(payload.error ?? 'Failed to update user')
        return
      }

      setFeedback('User updated successfully')
    })
  }

  if (users.length === 0) {
    return <Typography color="text.secondary">No users found.</Typography>
  }

  return (
    <Stack spacing={2}>
      {feedback && <Alert onClose={() => setFeedback(null)}>{feedback}</Alert>}
      <Autocomplete
        options={userOptions}
        value={
          userOptions.find((option) => option.id === selectedId) ?? null
        }
        onChange={(_event, value) => setSelectedId(value?.id ?? null)}
        renderInput={(params) => (
          <TextField {...params} label="Search user by email" />
        )}
      />
      {selectedDraft && (
        <Card variant="outlined">
          <CardContent>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems={{ xs: 'stretch', md: 'center' }}
            >
              <Stack flex={1} spacing={1}>
                <TextField
                  value={selectedDraft.email}
                  label="User email"
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  select
                  label="Role"
                  value={selectedDraft.role}
                  onChange={(event) =>
                    handleRoleChange(
                      selectedDraft.id,
                      event.target.value as ManagedUser['role']
                    )
                  }
                  size="small"
                >
                  <MenuItem value="customer">Customer</MenuItem>
                  <MenuItem value="betting">Betting admin</MenuItem>
                </TextField>
              </Stack>
              <DateTimePickerField
                label="Account active until"
                value={
                  selectedDraft.account_active_until
                    ? dayjs(selectedDraft.account_active_until)
                    : null
                }
                onChange={(value) => handleDateChange(selectedDraft.id, value)}
              />
              <Button
                variant="contained"
                onClick={() => handleSave(selectedDraft.id)}
                disabled={isPending}
              >
                Save
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  )
}

export default UserListSection


