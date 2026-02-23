'use client'

import { useState } from 'react'
import {
  Alert,
  Button,
  Stack,
  TextField,
} from '@mui/material'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const UpdatePasswordForm = () => {
  const t = useTranslations('auth.updatePassword')
  const locale = useLocale()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    if (!password.trim()) {
      setError('passwordRequired')
      setSubmitting(false)
      return
    }

    if (password.length < 8) {
      setError('passwordTooShort')
      setSubmitting(false)
      return
    }

    if (password !== confirmPassword) {
      setError(null)
      setSubmitting(false)
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        setError('generic')
        setSubmitting(false)
        return
      }

      setSuccess(true)
    } catch {
      setError('generic')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <Stack spacing={3} data-testid="update-password-success">
        <Alert severity="success">
          {t('successMessage')}
        </Alert>
        <Button
          component={Link}
          href={`/${locale}/login`}
          variant="contained"
          size="large"
          fullWidth
        >
          {t('goToLogin')}
        </Button>
      </Stack>
    )
  }

  const passwordsMatch = password === confirmPassword || confirmPassword === ''

  return (
    <Stack spacing={3} component="form" onSubmit={handleSubmit} data-testid="update-password-form">
      {error && (
        <Alert severity="error" data-testid="update-password-error">
          {t(`errors.${error}`)}
        </Alert>
      )}
      {!passwordsMatch && (
        <Alert severity="warning">
          {t('passwordsDontMatch')}
        </Alert>
      )}
      <Stack spacing={2}>
        <TextField
          label={t('password')}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          fullWidth
          helperText={t('passwordHelper')}
          inputProps={{ 'data-testid': 'update-password-input' }}
        />
        <TextField
          label={t('confirmPassword')}
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          fullWidth
          inputProps={{ 'data-testid': 'update-password-confirm-input' }}
        />
      </Stack>
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={submitting || !passwordsMatch}
        data-testid="update-password-submit-button"
      >
        {submitting ? t('updating') : t('updatePassword')}
      </Button>
    </Stack>
  )
}

export default UpdatePasswordForm
