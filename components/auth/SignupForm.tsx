'use client'

import { useState } from 'react'
import {
  Alert,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'

import SocialLoginButtons from '@/components/auth/SocialLoginButtons'
import { useAuth } from '@/components/providers/auth-provider'

const SignupForm = () => {
  const t = useTranslations('auth.signup')
  const { signUpWithPassword } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError(t('passwordsDontMatch'))
      return
    }

    setSubmitting(true)
    const { error } = await signUpWithPassword(email, password)
    if (error) {
      setError(error.message)
      setSubmitting(false)
      return
    }
    router.replace('/bettings')
  }

  return (
    <Stack spacing={3} component="form" onSubmit={handleSubmit} data-testid="signup-form">
      {error && <Alert severity="error" data-testid="signup-error">{error}</Alert>}
      <Stack spacing={2}>
        <TextField
          label={t('email')}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          fullWidth
          inputProps={{ 'data-testid': 'signup-email-input' }}
        />
        <TextField
          label={t('password')}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          fullWidth
          helperText={t('passwordHelper')}
          inputProps={{ 'data-testid': 'signup-password-input' }}
        />
        <TextField
          label={t('confirmPassword')}
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
          fullWidth
          inputProps={{ 'data-testid': 'signup-confirm-password-input' }}
        />
      </Stack>
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={submitting}
        data-testid="signup-submit-button"
      >
        {submitting ? t('creatingAccount') : t('createAccount')}
      </Button>
      <Stack spacing={2}>
        <Divider>{t('orContinueWith')}</Divider>
        <SocialLoginButtons onError={setError} />
      </Stack>
      <Typography variant="caption" color="text.secondary" textAlign="center">
        {t('termsAgreement')}
      </Typography>
    </Stack>
  )
}

export default SignupForm


