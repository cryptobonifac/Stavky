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
      py: { xs: 4, md: 8, lg: 10 },
      display: 'flex',
      flexDirection: 'column',
      gap: { xs: 2, md: 3 },
    }}
  >
    {(title || subtitle) && (
      <Stack spacing={1}>
        {title && (
          <Typography 
            variant="h3" 
            component="h2"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
              lineHeight: { xs: 1.3, md: 1.2 },
            }}
          >
            {title}
          </Typography>
        )}
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
    )}
    {children}
  </Container>
)

export default PageSection


