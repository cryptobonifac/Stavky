'use client'

import { useState } from 'react'
import {
  Alert,
  Button,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const ForgotPasswordForm = () => {
  const t = useTranslations('auth.forgotPassword')
  const locale = useLocale()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    if (!email.trim()) {
      setError('emailRequired')
      setSubmitting(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('invalidEmail')
      setSubmitting(false)
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery&locale=${locale}`,
      })

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
      <Stack spacing={3} data-testid="forgot-password-success">
        <Alert severity="success">
          <Typography variant="subtitle1" fontWeight="bold">
            {t('successTitle')}
          </Typography>
          <Typography variant="body2">
            {t('successMessage', { email })}
          </Typography>
        </Alert>
        <Button
          component={Link}
          href={`/${locale}/login`}
          variant="outlined"
          size="large"
          fullWidth
        >
          {t('backToLogin')}
        </Button>
      </Stack>
    )
  }

  return (
    <Stack spacing={3} component="form" onSubmit={handleSubmit} data-testid="forgot-password-form">
      <Typography variant="body2" color="text.secondary">
        {t('pageSubtitle')}
      </Typography>
      {error && (
        <Alert severity="error" data-testid="forgot-password-error">
          {t(`errors.${error}`)}
        </Alert>
      )}
      <TextField
        label={t('email')}
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        fullWidth
        inputProps={{ 'data-testid': 'forgot-password-email-input' }}
      />
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={submitting}
        data-testid="forgot-password-submit-button"
      >
        {submitting ? t('sending') : t('sendResetLink')}
      </Button>
      <Typography variant="body2" textAlign="center">
        <Link href={`/${locale}/login`} style={{ textDecoration: 'none' }}>
          {t('backToLogin')}
        </Link>
      </Typography>
    </Stack>
  )
}

export default ForgotPasswordForm
