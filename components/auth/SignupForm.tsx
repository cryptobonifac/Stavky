'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

const SignupForm = () => {
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
      setError('Passwords do not match.')
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
          helperText="Use at least 8 characters"
        />
        <TextField
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
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
        {submitting ? 'Creating account...' : 'Create account'}
      </Button>
      <Stack spacing={2}>
        <Divider>or continue with</Divider>
        <SocialLoginButtons onError={setError} />
      </Stack>
      <Typography variant="caption" color="text.secondary" textAlign="center">
        By creating an account you agree to the Stavky terms of service.
      </Typography>
    </Stack>
  )
}

export default SignupForm


