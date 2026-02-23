'use client'

import { Box, Typography, Button } from '@mui/material'
import { useTranslations, useLocale } from 'next-intl'
import { TrendingUp } from '@mui/icons-material'

const BlogCTA = () => {
  const t = useTranslations('blog')
  const locale = useLocale()

  return (
    <Box
      sx={{
        my: 6,
        p: 4,
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(184, 241, 93, 0.08) 0%, rgba(106, 140, 46, 0.04) 100%)',
        border: '1px solid',
        borderColor: '#2a3324',
        textAlign: 'center',
      }}
    >
      <TrendingUp
        sx={{
          fontSize: 40,
          color: '#b8f15d',
          mb: 2,
        }}
      />
      <Typography
        variant="h5"
        component="h3"
        sx={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontWeight: 700,
          color: '#f0f4ec',
          mb: 1.5,
        }}
      >
        {t('ctaTitle')}
      </Typography>
      <Typography
        sx={{
          color: '#8a9182',
          mb: 3,
          maxWidth: 400,
          mx: 'auto',
          lineHeight: 1.6,
        }}
      >
        {t('ctaDescription')}
      </Typography>
      <Button
        href={`/${locale}/statistics`}
        variant="contained"
        sx={{
          bgcolor: '#b8f15d',
          color: '#0c0f0a',
          fontWeight: 600,
          px: 4,
          py: 1.5,
          borderRadius: 2,
          textTransform: 'none',
          fontSize: '0.95rem',
          '&:hover': {
            bgcolor: '#a3d84e',
          },
        }}
      >
        {t('ctaButton')}
      </Button>
    </Box>
  )
}

export default BlogCTA
