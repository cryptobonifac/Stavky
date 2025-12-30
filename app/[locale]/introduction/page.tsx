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

// Mark as dynamic because useAuth requires client-side context
export const dynamic = 'force-dynamic'

export default function Introduction() {
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
