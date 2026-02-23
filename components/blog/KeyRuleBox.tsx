'use client'

import { Box, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

type KeyRuleBoxProps = {
  children: React.ReactNode
  label?: string
  variant?: 'default' | 'golden'
}

const KeyRuleBox = ({ children, label, variant = 'default' }: KeyRuleBoxProps) => {
  const t = useTranslations('blog')

  const displayLabel = label || (variant === 'golden' ? t('goldenRule') : t('keyRule'))
  const accentColor = variant === 'golden' ? '#d4a843' : '#b8f15d'

  return (
    <Box
      sx={{
        my: 4,
        p: 3,
        bgcolor: '#1a2016',
        borderRadius: 2,
        border: '1px solid',
        borderColor: '#2a3324',
        position: 'relative',
      }}
    >
      <Typography
        component="span"
        sx={{
          position: 'absolute',
          top: -12,
          left: 16,
          bgcolor: '#1a2016',
          px: 1.5,
          py: 0.25,
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: accentColor,
        }}
      >
        {displayLabel}
      </Typography>
      <Box
        sx={{
          '& p': {
            mb: 0,
            color: '#d8ddd4',
            fontWeight: 500,
            lineHeight: 1.7,
          },
          '& strong': {
            color: '#f0f4ec',
          },
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default KeyRuleBox
