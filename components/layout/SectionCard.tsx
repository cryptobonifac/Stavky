import { Paper, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

type SectionCardProps = {
  title: string
  description: string
  children?: ReactNode
}

const SectionCard = ({ title, description, children }: SectionCardProps) => (
  <Paper
    elevation={0}
    variant="outlined"
    sx={{
      p: { xs: 2.5, sm: 3, md: 4 },
      height: '100%',
      borderColor: 'rgba(15, 23, 42, 0.08)',
      display: 'flex',
    }}
  >
    <Stack spacing={{ xs: 1.5, md: 2 }} sx={{ width: '100%' }}>
      <Stack spacing={0.5}>
        <Typography 
          variant="h5" 
          component="h3"
          sx={{ fontSize: { xs: '1.1rem', md: '1.5rem' } }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ fontSize: { xs: '0.875rem', md: '0.875rem' } }}
        >
          {description}
        </Typography>
      </Stack>
      {children}
    </Stack>
  </Paper>
)

export default SectionCard


