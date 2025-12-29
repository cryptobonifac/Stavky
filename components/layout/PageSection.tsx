import { Container, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

type PageSectionProps = {
  title?: string
  subtitle?: string
  maxWidth?: false | 'sm' | 'md' | 'lg' | 'xl'
  children: ReactNode
}

const PageSection = ({
  title,
  subtitle,
  maxWidth = 'lg',
  children,
}: PageSectionProps) => (
  <Container
    maxWidth={maxWidth}
    sx={{
      py: { xs: 2, md: 3 },
      px: { xs: 2, md: 3 },
      display: 'flex',
      flexDirection: 'column',
      gap: { xs: 2, md: 3 },
    }}
  >
    {subtitle && (
      <Stack spacing={1}>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontSize: { xs: '0.875rem', md: '1rem' },
          }}
        >
          {subtitle}
        </Typography>
      </Stack>
    )}
    {children}
  </Container>
)

export default PageSection


