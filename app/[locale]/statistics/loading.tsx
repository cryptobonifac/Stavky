'use client'

import { Typography, Box, CircularProgress } from '@mui/material'
import { useTranslations } from 'next-intl'

export default function StatisticsLoading() {
  const t = useTranslations('statistics')
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        gap: 2,
      }}
    >
      <CircularProgress size={40} />
      <Typography variant="body1" color="text.secondary">
        {t('loadingMatches')}
      </Typography>
    </Box>
  )
}









