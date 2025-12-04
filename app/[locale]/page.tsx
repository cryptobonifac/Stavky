'use client'

import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  useTheme,
  Paper,
} from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import SpeedIcon from '@mui/icons-material/Speed'
import TopNav from '@/components/navigation/TopNav'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/components/providers/auth-provider'

export default function Home() {
  const theme = useTheme()
  const { profile } = useAuth()
  const t = useTranslations('home')

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: { xs: 2, md: 4 }, pt: 3 }}>
        <TopNav showSettingsLink={false} />
      </Box>

      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Hero Section */}
        <Box
          sx={{
            py: { xs: 8, md: 12 },
            textAlign: 'center',
            background: `radial-gradient(circle at 50% 50%, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          }}
        >
          <Container maxWidth="md">
            <Typography
              component="h1"
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: '2.5rem', md: '3.75rem' },
                letterSpacing: '-0.02em',
              }}
            >
              {t('title')}{' '}
              <Box component="span" sx={{ color: 'primary.main' }}>
                {t('titleHighlight')}
              </Box>
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
            >
              {t('subtitle')}
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              <Link href={profile ? '/bettings' : '/signup'} style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
                >
                  {profile ? t('viewActiveTips') : t('getStarted')}
                </Button>
              </Link>
              <Button
                component="a"
                href="#features"
                variant="outlined"
                size="large"
                sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
              >
                {t('learnMore')}
              </Button>
            </Stack>
          </Container>
        </Box>

        {/* Value Props */}
        <Box id="features" sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.paper' }}>
          <Container maxWidth="lg">
            <Typography
              variant="h4"
              fontWeight="bold"
              textAlign="center"
              gutterBottom
              sx={{ mb: 6 }}
            >
              {t('features.title')}
            </Typography>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper
                  elevation={0}
                  variant="outlined"
                  sx={{
                    p: 4,
                    height: '100%',
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                >
                  <TrendingUpIcon
                    sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }}
                  />
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    {t('features.verified.title')}
                  </Typography>
                  <Typography color="text.secondary">
                    {t('features.verified.description')}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper
                  elevation={0}
                  variant="outlined"
                  sx={{
                    p: 4,
                    height: '100%',
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                >
                  <VerifiedUserIcon
                    sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }}
                  />
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    {t('features.highProbability.title')}
                  </Typography>
                  <Typography color="text.secondary">
                    {t('features.highProbability.description')}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper
                  elevation={0}
                  variant="outlined"
                  sx={{
                    p: 4,
                    height: '100%',
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                >
                  <SpeedIcon
                    sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }}
                  />
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    {t('features.professional.title')}
                  </Typography>
                  <Typography color="text.secondary">
                    {t('features.professional.description')}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'primary.main', color: 'primary.contrastText', textAlign: 'center' }}>
          <Container maxWidth="md">
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              {t('cta.title')}
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              {t('cta.description')}
            </Typography>
            <Link href={profile ? '/bettings' : '/signup'} style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                sx={{ px: 6, py: 2, fontSize: '1.2rem', fontWeight: 'bold' }}
              >
                {t('cta.button')}
              </Button>
            </Link>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  )
}


