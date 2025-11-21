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
      py: { xs: 6, md: 10 },
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
    }}
  >
    {(title || subtitle) && (
      <Stack spacing={1}>
        {title && (
          <Typography variant="h3" component="h2">
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Stack>
    )}
    {children}
  </Container>
)

export default PageSection


