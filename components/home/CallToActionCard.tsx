'use client'

import { Link } from '@/i18n/routing'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'

const CallToActionCard = () => (
  <Paper
    variant="outlined"
    sx={{
      p: { xs: 2.5, sm: 3, md: 4 },
      borderRadius: { xs: 2, md: 4 },
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      alignItems: { xs: 'flex-start', md: 'center' },
      justifyContent: 'space-between',
      gap: { xs: 2, md: 3 },
    }}
  >
    <Stack spacing={1} sx={{ width: '100%' }}>
      <Typography 
        variant="h4"
        sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.125rem' } }}
      >
        Ready to publish winning tips?
      </Typography>
      <Typography 
        variant="body1" 
        color="text.secondary"
        sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
      >
        Register as a betting expert to create new picks or join as a customer
        to unlock the latest premium recommendations.
      </Typography>
    </Stack>
    <Stack 
      direction={{ xs: 'column', sm: 'row' }} 
      spacing={{ xs: 1.5, sm: 2 }}
      sx={{ width: { xs: '100%', md: 'auto' } }}
    >
      <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
        <Button
          component={Link}
          href="/signup"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          sx={{ 
            minHeight: 44,
            fontSize: { xs: '0.875rem', md: '1rem' },
          }}
        >
          Create account
        </Button>
      </Box>
      <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
        <Button
          component={Link}
          href="/login"
          variant="outlined"
          size="large"
          fullWidth
          sx={{ 
            minHeight: 44,
            fontSize: { xs: '0.875rem', md: '1rem' },
          }}
        >
          Sign in
        </Button>
      </Box>
    </Stack>
  </Paper>
)

export default CallToActionCard


