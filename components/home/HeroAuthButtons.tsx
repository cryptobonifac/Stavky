'use client'

import { Link } from '@/i18n/routing'
import { Button, Stack } from '@mui/material'

const HeroAuthButtons = () => (
  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
    <Button
      component={Link}
      href="/login"
      variant="contained"
      color="primary"
      size="large"
      fullWidth
      sx={{ maxWidth: 220 }}
      data-testid="hero-login-button"
    >
      Sign in
    </Button>
    <Button
      component={Link}
      href="/signup"
      variant="outlined"
      size="large"
      fullWidth
      sx={{ maxWidth: 220 }}
      data-testid="hero-signup-button"
    >
      Create account
    </Button>
  </Stack>
)

export default HeroAuthButtons


