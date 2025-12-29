'use client'

import { Box, Typography, Stack, Link as MuiLink } from '@mui/material'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

const Footer = () => {
  const t = useTranslations('footer')
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: { xs: 2, md: 6 },
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        spacing={{ xs: 1.5, md: 2 }}
      >
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
        >
          {t('copyright', { year: new Date().getFullYear() })}
        </Typography>
        <Stack 
          direction="row" 
          spacing={{ xs: 2, md: 3 }}
          sx={{ flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-end' } }}
        >
          <MuiLink 
            component={Link} 
            href="/statistics" 
            color="text.secondary" 
            underline="hover"
            sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
          >
            {t('statistics')}
          </MuiLink>
          <MuiLink
            component={Link}
            href="/privacy"
            color="text.secondary"
            underline="hover"
            sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
          >
            {t('privacy')}
          </MuiLink>
        </Stack>
      </Stack>
    </Box>
  )
}

export default Footer

