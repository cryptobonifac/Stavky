'use client'

import { Link } from '@/i18n/routing'
import { Box, Paper, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

type FooterLink = {
  label: string
  href: string
}

type AuthPageLayoutProps = {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: {
    prompt: string
    link: FooterLink
  }
}

const AuthPageLayout = ({
  title,
  subtitle,
  children,
  footer,
}: AuthPageLayoutProps) => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
      px: { xs: 1.5, sm: 2 },
      py: { xs: 2, md: 3 },
    }}
  >
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        maxWidth: 480,
        p: { xs: 3, sm: 4, md: 5 },
        borderRadius: { xs: 2, md: 4 },
        border: '1px solid rgba(15,23,42,0.1)',
      }}
    >
      <Stack spacing={{ xs: 2.5, md: 3 }}>
        <Stack spacing={1}>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              lineHeight: 1.3,
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.875rem', md: '1rem' },
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Stack>
        {children}
        {footer && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ 
              textAlign: 'center',
              fontSize: { xs: '0.75rem', md: '0.875rem' },
            }}
          >
            {footer.prompt}{' '}
            <Typography
              component={Link}
              href={footer.link.href}
              color="primary"
              fontWeight={600}
              sx={{ textDecoration: 'none' }}
            >
              {footer.link.label}
            </Typography>
          </Typography>
        )}
      </Stack>
    </Paper>
  </Box>
)

export default AuthPageLayout


