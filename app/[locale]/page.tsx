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

// Mark as dynamic because useAuth requires client-side context
export const dynamic = 'force-dynamic'

export default function Home() {
  const theme = useTheme()
  const { profile } = useAuth()
  const t = useTranslations('home')

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: { xs: 1, sm: 2, md: 4 }, pt: { xs: 2, md: 3 } }}>
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
            py: { xs: 6, sm: 8, md: 10, lg: 12 },
            textAlign: 'center',
            background: `radial-gradient(circle at 50% 50%, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            px: { xs: 1, sm: 2 },
          }}
        >
          <Container maxWidth="md">
            <Typography
              component="h1"
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: { xs: 1.5, md: 2 },
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.75rem' },
                letterSpacing: '-0.02em',
                paddingTop: '2px',
                paddingBottom: '2px',
                lineHeight: { xs: 1.2, md: 1.1 },
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
              sx={{ 
                mb: { xs: 3, md: 4 }, 
                maxWidth: 600, 
                mx: 'auto', 
                lineHeight: 1.6,
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
                px: { xs: 1, sm: 0 },
              }}
            >
              {t('subtitle')}
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1.5, sm: 2 }}
              justifyContent="center"
              sx={{ width: '100%' }}
            >
              <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
                <Link href={profile ? '/bettings' : '/signup'} style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{ 
                      px: { xs: 3, md: 4 }, 
                      py: { xs: 1.25, md: 1.5 }, 
                      fontSize: { xs: '0.95rem', md: '1.1rem' },
                      minHeight: 44,
                    }}
                  >
                    {profile ? t('viewActiveTips') : t('getStarted')}
                  </Button>
                </Link>
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
                <Link href="/statistics" style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    sx={{ 
                      px: { xs: 3, md: 4 }, 
                      py: { xs: 1.25, md: 1.5 }, 
                      fontSize: { xs: '0.95rem', md: '1.1rem' },
                      minHeight: 44,
                    }}
                  >
                    {t('viewStatistics')}
                  </Button>
                </Link>
              </Box>
              {!profile && (
                <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
                  <Button
                    component="a"
                    href="#features"
                    variant="outlined"
                    size="large"
                    fullWidth
                    sx={{ 
                      px: { xs: 3, md: 4 }, 
                      py: { xs: 1.25, md: 1.5 }, 
                      fontSize: { xs: '0.95rem', md: '1.1rem' },
                      minHeight: 44,
                    }}
                  >
                    {t('learnMore')}
                  </Button>
                </Box>
              )}
            </Stack>
          </Container>
        </Box>

        {/* Value Props */}
        <Box id="features" sx={{ py: { xs: 6, sm: 8, md: 10 }, bgcolor: 'background.paper', px: { xs: 1, sm: 2 } }}>
          <Container maxWidth="lg">
            <Typography
              variant="h4"
              fontWeight="bold"
              textAlign="center"
              gutterBottom
              sx={{ 
                mb: { xs: 4, md: 6 },
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
              }}
            >
              {t('features.title')}
            </Typography>
            <Grid container spacing={{ xs: 3, md: 4 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper
                  elevation={0}
                  variant="outlined"
                  sx={{
                    p: { xs: 3, md: 4 },
                    height: '100%',
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                >
                  <TrendingUpIcon
                    sx={{ fontSize: { xs: 40, md: 48 }, color: 'secondary.main', mb: { xs: 1.5, md: 2 } }}
                  />
                  <Typography 
                    variant="h5" 
                    gutterBottom 
                    fontWeight="bold"
                    sx={{ fontSize: { xs: '1.1rem', md: '1.5rem' } }}
                  >
                    {t('features.verified.title')}
                  </Typography>
                  <Typography 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                  >
                    {t('features.verified.description')}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper
                  elevation={0}
                  variant="outlined"
                  sx={{
                    p: { xs: 3, md: 4 },
                    height: '100%',
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                >
                  <VerifiedUserIcon
                    sx={{ fontSize: { xs: 40, md: 48 }, color: 'secondary.main', mb: { xs: 1.5, md: 2 } }}
                  />
                  <Typography 
                    variant="h5" 
                    gutterBottom 
                    fontWeight="bold"
                    sx={{ fontSize: { xs: '1.1rem', md: '1.5rem' } }}
                  >
                    {t('features.highProbability.title')}
                  </Typography>
                  <Typography 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                  >
                    {t('features.highProbability.description')}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper
                  elevation={0}
                  variant="outlined"
                  sx={{
                    p: { xs: 3, md: 4 },
                    height: '100%',
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                >
                  <SpeedIcon
                    sx={{ fontSize: { xs: 40, md: 48 }, color: 'secondary.main', mb: { xs: 1.5, md: 2 } }}
                  />
                  <Typography 
                    variant="h5" 
                    gutterBottom 
                    fontWeight="bold"
                    sx={{ fontSize: { xs: '1.1rem', md: '1.5rem' } }}
                  >
                    {t('features.professional.title')}
                  </Typography>
                  <Typography 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                  >
                    {t('features.professional.description')}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box sx={{ 
          py: { xs: 6, sm: 8, md: 10 }, 
          bgcolor: 'primary.main', 
          color: 'primary.contrastText', 
          textAlign: 'center',
          px: { xs: 1, sm: 2 },
        }}>
          <Container maxWidth="md">
            <Typography 
              variant="h3" 
              fontWeight="bold" 
              sx={{ 
                mb: { xs: 3, md: 4 },
                fontSize: { xs: '1.75rem', sm: '2rem', md: '3rem' },
              }}
            >
              {t('cta.title')}
            </Typography>
            <Link href={profile ? '/bettings' : '/signup'} style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                sx={{ 
                  px: { xs: 4, md: 6 }, 
                  py: { xs: 1.5, md: 2 }, 
                  fontSize: { xs: '1rem', md: '1.2rem' }, 
                  fontWeight: 'bold',
                  minHeight: 44,
                }}
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


