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
        spacing={2}
      >
        <Typography variant="body2" color="text.secondary">
          {t('copyright', { year: new Date().getFullYear() })}
        </Typography>
        <Stack direction="row" spacing={3}>
          <MuiLink component={Link} href="#" color="text.secondary" underline="hover">
            {t('terms')}
          </MuiLink>
          <MuiLink component={Link} href="#" color="text.secondary" underline="hover">
            {t('privacy')}
          </MuiLink>
          <MuiLink component={Link} href="/contact" color="text.secondary" underline="hover">
            {t('contact')}
          </MuiLink>
        </Stack>
      </Stack>
    </Box>
  )
}

export default Footer

