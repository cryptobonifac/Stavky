'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
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

const LoginForm = () => {
  const t = useTranslations('auth.login')
  const { signInWithPassword } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const redirectTo = searchParams.get('redirectedFrom') ?? '/bettings'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error } = await signInWithPassword(email, password)
    if (error) {
      setError(error.message)
      setSubmitting(false)
      return
    }
    router.replace(redirectTo)
  }

  return (
    <Stack spacing={3} component="form" onSubmit={handleSubmit} data-testid="login-form">
      {error && <Alert severity="error" data-testid="login-error">{error}</Alert>}
      <Stack spacing={2}>
        <TextField
          label={t('email')}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          fullWidth
          inputProps={{ 'data-testid': 'login-email-input' }}
        />
        <TextField
          label={t('password')}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          fullWidth
          inputProps={{ 'data-testid': 'login-password-input' }}
        />
      </Stack>
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={submitting}
        data-testid="login-submit-button"
      >
        {submitting ? t('signingIn') : t('signIn')}
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

export default LoginForm


