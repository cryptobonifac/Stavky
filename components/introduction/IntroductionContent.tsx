'use client'

import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  useTheme,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import TimelineIcon from '@mui/icons-material/Timeline'
import TopNav from '@/components/navigation/TopNav'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/components/providers/auth-provider'

const stepIcons = [
  <AnalyticsIcon key="analytics" sx={{ fontSize: 40, color: 'secondary.main' }} />,
  <CompareArrowsIcon key="compare" sx={{ fontSize: 40, color: 'secondary.main' }} />,
  <AccountBalanceWalletIcon key="wallet" sx={{ fontSize: 40, color: 'secondary.main' }} />,
  <TimelineIcon key="timeline" sx={{ fontSize: 40, color: 'secondary.main' }} />,
]

export default function IntroductionContent() {
  const theme = useTheme()
  const { profile } = useAuth()
  const t = useTranslations('introduction')

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
        {/* About Section */}
        <Box sx={{ py: { xs: 6, sm: 8, md: 10 }, bgcolor: 'background.paper', px: { xs: 1, sm: 2 } }}>
          <Container maxWidth="lg">
            <Typography
              component="h1"
              variant="h4"
              fontWeight="bold"
              textAlign="center"
              gutterBottom
              sx={{
                mb: { xs: 3, md: 4 },
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
              }}
            >
              {t('about.title')}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
              sx={{
                maxWidth: 800,
                mx: 'auto',
                fontSize: { xs: '0.875rem', md: '1.1rem' },
                lineHeight: 1.8,
                mb: { xs: 4, md: 6 },
              }}
            >
              {t('about.description')}
            </Typography>
          </Container>
        </Box>

        {/* How It Works Section */}
        <Box sx={{ py: { xs: 6, sm: 8, md: 10 }, bgcolor: 'background.default', px: { xs: 1, sm: 2 } }}>
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
              {t('howItWorks.title')}
            </Typography>
            <Grid container spacing={{ xs: 3, md: 4 }}>
              {(['step1', 'step2', 'step3', 'step4'] as const).map((step, index) => (
                <Grid key={step} size={{ xs: 12, sm: 6, md: 3 }}>
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
                    <Box sx={{ mb: 2 }}>
                      {stepIcons[index]}
                    </Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      fontWeight="bold"
                      sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                    >
                      {t(`howItWorks.${step}.title`)}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                    >
                      {t(`howItWorks.${step}.description`)}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Pricing Section */}
        <Box sx={{ py: { xs: 6, sm: 8, md: 10 }, bgcolor: 'background.paper', px: { xs: 1, sm: 2 } }}>
          <Container maxWidth="sm">
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
              {t('pricing.title')}
            </Typography>
            <Paper
              elevation={0}
              variant="outlined"
              sx={{
                p: { xs: 3, md: 5 },
                textAlign: 'center',
              }}
            >
              <Typography
                variant="h3"
                fontWeight="bold"
                color="primary.main"
                sx={{
                  mb: 1,
                  fontSize: { xs: '2.5rem', md: '3rem' },
                }}
              >
                {t('pricing.amount')}
              </Typography>
              <Typography
                variant="subtitle1"
                color="secondary.main"
                fontWeight="bold"
                sx={{ mb: 1 }}
              >
                {t('pricing.guarantee')}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                {t('pricing.guaranteeDescription')}
              </Typography>
              <List sx={{ maxWidth: 320, mx: 'auto', mb: 3 }}>
                {(['feature1', 'feature2', 'feature3', 'feature4', 'feature5'] as const).map((feature) => (
                  <ListItem key={feature} sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckCircleIcon color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={t(`pricing.features.${feature}`)}
                      primaryTypographyProps={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                    />
                  </ListItem>
                ))}
              </List>
              <Link href={profile ? '/bettings' : '/signup'} style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    px: { xs: 4, md: 6 },
                    py: { xs: 1.25, md: 1.5 },
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    fontWeight: 'bold',
                    minHeight: 44,
                  }}
                >
                  {t('cta.button')}
                </Button>
              </Link>
            </Paper>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            py: { xs: 6, sm: 8, md: 10 },
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            textAlign: 'center',
            px: { xs: 1, sm: 2 },
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                mb: 2,
                fontSize: { xs: '1.75rem', sm: '2rem', md: '3rem' },
              }}
            >
              {t('cta.title')}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: { xs: 3, md: 4 },
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
              }}
            >
              {t('cta.description')}
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
