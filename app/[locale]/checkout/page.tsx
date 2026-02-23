'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import {
  Box,
  Button,
  Container,
  Typography,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BuildIcon from '@mui/icons-material/Build';

export default function CheckoutPage() {
  const t = useTranslations('checkout');
  const router = useRouter();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, px: { xs: 1.5, sm: 2, md: 3 } }}>
      <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
        <Typography
          variant="h3"
          component="h1"
          fontWeight="bold"
          gutterBottom
          sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '3rem' } }}
        >
          {t('choosePlan')}
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <Alert
          severity="info"
          icon={<BuildIcon />}
          sx={{ mb: 4, py: 3 }}
        >
          <Typography variant="h6" gutterBottom>
            {t('maintenanceTitle') || 'Payment System Update'}
          </Typography>
          <Typography variant="body1">
            {t('maintenanceMessage') || 'Our payment system is currently being updated. Please check back soon or contact support for assistance.'}
          </Typography>
        </Alert>

        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            sx={{
              py: { xs: 1.25, md: 1.5 },
              px: { xs: 3, md: 4 },
              minHeight: 48,
              fontSize: { xs: '0.875rem', md: '1rem' },
              fontWeight: 500,
            }}
          >
            {t('backButton')}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
