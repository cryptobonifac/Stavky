'use client'

import NextLink from 'next/link'
import { Button, Stack } from '@mui/material'

const HeroAuthButtons = () => (
  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
    <Button
      component={NextLink}
      href="/login"
      variant="contained"
      color="primary"
      size="large"
      fullWidth
      sx={{ maxWidth: 220 }}
    >
      Sign in
    </Button>
    <Button
      component={NextLink}
      href="/signup"
      variant="outlined"
      size="large"
      fullWidth
      sx={{ maxWidth: 220 }}
    >
      Create account
    </Button>
  </Stack>
)

export default HeroAuthButtons


