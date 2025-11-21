'use client'

import { useState } from 'react'
import GoogleIcon from '@mui/icons-material/Google'
import FacebookIcon from '@mui/icons-material/Facebook'
import { Button, Stack } from '@mui/material'

import { useAuth } from '@/components/providers/auth-provider'

type SocialLoginButtonsProps = {
  onError?: (message: string) => void
}

const SocialLoginButtons = ({ onError }: SocialLoginButtonsProps) => {
  const { signInWithProvider } = useAuth()
  const [pendingProvider, setPendingProvider] = useState<
    'google' | 'facebook' | null
  >(null)

  const handleSignIn = async (provider: 'google' | 'facebook') => {
    setPendingProvider(provider)
    const { error } = await signInWithProvider(provider)
    if (error) {
      onError?.(error.message)
      setPendingProvider(null)
    }
    // On success Supabase redirects, so we don't reset state.
  }

  return (
    <Stack spacing={2}>
      <Button
        variant="outlined"
        fullWidth
        startIcon={<GoogleIcon />}
        onClick={() => handleSignIn('google')}
        disabled={pendingProvider !== null}
      >
        Continue with Google
      </Button>
      <Button
        variant="outlined"
        fullWidth
        startIcon={<FacebookIcon />}
        onClick={() => handleSignIn('facebook')}
        disabled={pendingProvider !== null}
      >
        Continue with Facebook
      </Button>
    </Stack>
  )
}

export default SocialLoginButtons


