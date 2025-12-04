'use client'

import NextLink from 'next/link'
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
              Expert Betting Tips that{' '}
              <Box component="span" sx={{ color: 'primary.main' }}>
                Actually Win
              </Box>
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
            >
              Stop guessing. Start winning. Get access to verified, high-probability
              sports betting tips from professional analysts.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                component={NextLink}
                href={profile ? '/bettings' : '/signup'}
                variant="contained"
                size="large"
                sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
                data-testid="home-cta-primary-button"
              >
                {profile ? 'View Active Tips' : 'Get Started Free'}
              </Button>
              <Button
                component={NextLink}
                href="#features"
                variant="outlined"
                size="large"
                sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
                data-testid="home-cta-secondary-button"
              >
                Learn More
              </Button>
            </Stack>
          </Container>
        </Box>

        {/* Value Props */}
        <Box id="features" sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.paper' }}>
          <Container maxWidth="lg">
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
                    High Win Rate
                  </Typography>
                  <Typography color="text.secondary">
                    Our tips are backed by rigorous analysis and historical data to ensure consistent profitability over time.
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
                    Verified History
                  </Typography>
                  <Typography color="text.secondary">
                    Total transparency. We track and publish every win and loss so you know exactly what to expect.
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
                    Real-time Updates
                  </Typography>
                  <Typography color="text.secondary">
                    Get instant notifications for new tips. Never miss a valuable betting opportunity again.
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
              Ready to beat the bookies?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join hundreds of satisfied members who are already profiting from our expert analysis.
            </Typography>
            <Button
              component={NextLink}
              href={profile ? '/bettings' : '/signup'}
              variant="contained"
              color="secondary"
              size="large"
              sx={{ px: 6, py: 2, fontSize: '1.2rem', fontWeight: 'bold' }}
            >
              Start Winning Today
            </Button>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  )
}
