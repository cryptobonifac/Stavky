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
      p: { xs: 3, md: 4 },
      height: '100%',
      borderColor: 'rgba(15, 23, 42, 0.08)',
      display: 'flex',
    }}
  >
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Stack spacing={0.5}>
        <Typography variant="h5" component="h3">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Stack>
      {children}
    </Stack>
  </Paper>
)

export default SectionCard


