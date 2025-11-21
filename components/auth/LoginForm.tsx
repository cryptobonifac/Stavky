'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Alert,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import SocialLoginButtons from '@/components/auth/SocialLoginButtons'
import { useAuth } from '@/components/providers/auth-provider'

const LoginForm = () => {
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
    <Stack spacing={3} component="form" onSubmit={handleSubmit}>
      {error && <Alert severity="error">{error}</Alert>}
      <Stack spacing={2}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          fullWidth
        />
      </Stack>
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={submitting}
      >
        {submitting ? 'Signing in...' : 'Sign in'}
      </Button>
      <Stack spacing={2}>
        <Divider>or continue with</Divider>
        <SocialLoginButtons onError={setError} />
      </Stack>
      <Typography variant="caption" color="text.secondary" textAlign="center">
        By continuing you agree to the Stavky terms of service.
      </Typography>
    </Stack>
  )
}

export default LoginForm


