'use client'

import { Link } from '@/i18n/routing'
import { Button, Paper, Stack, Typography } from '@mui/material'

const CallToActionCard = () => (
  <Paper
    variant="outlined"
    sx={{
      p: { xs: 3, md: 4 },
      borderRadius: 4,
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      alignItems: { xs: 'flex-start', md: 'center' },
      justifyContent: 'space-between',
      gap: 3,
    }}
  >
    <Stack spacing={1}>
      <Typography variant="h4">Ready to publish winning tips?</Typography>
      <Typography variant="body1" color="text.secondary">
        Register as a betting expert to create new picks or join as a customer
        to unlock the latest premium recommendations.
      </Typography>
    </Stack>
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
      <Button
        component={Link}
        href="/signup"
        variant="contained"
        color="primary"
        size="large"
      >
        Create account
      </Button>
      <Button
        component={Link}
        href="/login"
        variant="outlined"
        size="large"
      >
        Sign in
      </Button>
    </Stack>
  </Paper>
)

export default CallToActionCard


