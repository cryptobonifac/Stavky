'use client'

import { useState } from 'react'
import GoogleIcon from '@mui/icons-material/Google'
import { Button, Stack } from '@mui/material'
import { useTranslations } from 'next-intl'

import { useAuth } from '@/components/providers/auth-provider'

type SocialLoginButtonsProps = {
  onError?: (message: string) => void
}

const SocialLoginButtons = ({ onError }: SocialLoginButtonsProps) => {
  const t = useTranslations('auth.socialLogin')
  const { signInWithProvider } = useAuth()
  const [pendingProvider, setPendingProvider] = useState<'google' | null>(null)

  const handleSignIn = async (provider: 'google') => {
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
        data-testid="social-login-google-button"
      >
        {t('google')}
      </Button>
    </Stack>
  )
}

export default SocialLoginButtons


