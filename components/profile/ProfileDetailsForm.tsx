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

import type { UserProfile } from '@/components/providers/auth-provider'
import { useAuth } from '@/components/providers/auth-provider'

type ProfileDetailsFormProps = {
  profile: UserProfile
}

const ProfileDetailsForm = ({ profile }: ProfileDetailsFormProps) => {
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
          text: payload.error ?? 'Unable to update profile.',
        })
        return
      }

      setMessage({ type: 'success', text: 'Profile updated successfully.' })
      await refreshProfile()
    })
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          <div>
            <Typography variant="h5">Profile details</Typography>
            <Typography variant="body2" color="text.secondary">
              Update how your name appears across the app.
            </Typography>
          </div>
          {message && (
            <Alert severity={message.type} onClose={() => setMessage(null)}>
              {message.text}
            </Alert>
          )}
          <TextField
            label="Full name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="e.g. Martin Novak"
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ProfileDetailsForm


