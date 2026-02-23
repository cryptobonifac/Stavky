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
        direction="column"
        alignItems="center"
        spacing={{ xs: 2, md: 2 }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={{ xs: 1.5, md: 2 }}
          sx={{ width: '100%' }}
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
            spacing={{ xs: 1.5, md: 3 }}
            sx={{ flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-end' }, gap: { xs: 0.5, md: 0 } }}
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
              href="/blog"
              color="text.secondary"
              underline="hover"
              sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
            >
              {t('blog')}
            </MuiLink>
            <MuiLink
              component={Link}
              href="/terms"
              color="text.secondary"
              underline="hover"
              sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
            >
              {t('terms')}
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
            <MuiLink
              component={Link}
              href="/legal-disclaimer"
              color="text.secondary"
              underline="hover"
              sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
            >
              {t('legalDisclaimer')}
            </MuiLink>
            <MuiLink
              component={Link}
              href="/risk-warning"
              color="text.secondary"
              underline="hover"
              sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
            >
              {t('riskWarning')}
            </MuiLink>
          </Stack>
        </Stack>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            fontSize: { xs: '0.65rem', md: '0.75rem' },
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.5
          }}
        >
          {t('disclaimer')}
        </Typography>
      </Stack>
    </Box>
  )
}

export default Footer

