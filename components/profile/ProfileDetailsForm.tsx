'use client'

import { useState, useTransition } from 'react'
import {
  Alert,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useTranslations } from 'next-intl'

import type { UserProfile } from '@/components/providers/auth-provider'
import { useAuth } from '@/components/providers/auth-provider'

type ProfileDetailsFormProps = {
  profile: UserProfile
}

const ProfileDetailsForm = ({ profile }: ProfileDetailsFormProps) => {
  const t = useTranslations('profile')
  const { refreshProfile } = useAuth()
  const [fullName, setFullName] = useState(profile.full_name ?? '')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  )
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)

    startTransition(async () => {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ full_name: fullName }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        setMessage({
          type: 'error',
          text: payload.error ?? t('updateFailed'),
        })
        return
      }

      setMessage({ type: 'success', text: t('profileUpdated') })
      await refreshProfile()
    })
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={3} component="form" onSubmit={handleSubmit} data-testid="profile-details-form">
          <div>
            <Typography variant="h5">{t('profileDetails')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('profileDetailsDescription')}
            </Typography>
          </div>
          {message && (
            <Alert severity={message.type} onClose={() => setMessage(null)} data-testid={`profile-${message.type}-message`}>
              {message.text}
            </Alert>
          )}
          <TextField
            label={t('fullName')}
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder={t('fullNamePlaceholder')}
            fullWidth
            inputProps={{ 'data-testid': 'profile-fullname-input' }}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isPending}
            data-testid="profile-save-button"
          >
            {isPending ? t('saving') : t('saveChanges')}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ProfileDetailsForm


