'use client';

import { useState } from 'react';
import { createCheckoutSession, createSubscriptionCheckoutSession } from './actions';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Stack,
  Chip,
  CircularProgress,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (priceId: string, isSubscription = false) => {
    try {
      setLoading(true);
      setError(null);

      const { url } = isSubscription
        ? await createSubscriptionCheckoutSession(priceId)
        : await createCheckoutSession(priceId);

      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Choose Your Plan
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Select the plan that works best for you
        </Typography>
      </Box>

      {error && (
        <Box sx={{ mb: 4, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
          <Typography color="error.dark">{error}</Typography>
        </Box>
      )}

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={4}
        justifyContent="center"
        alignItems="stretch"
      >
        {/* One-time Payment Card */}
        <Card
          sx={{
            flex: 1,
            maxWidth: 400,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-8px)' },
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                One-Time Purchase
              </Typography>
              <Typography variant="h3" fontWeight="bold" color="primary">
                $29.99
              </Typography>
              <Typography color="text.secondary">One-time payment</Typography>
            </Box>

            <Stack spacing={2} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon color="success" fontSize="small" />
                <Typography>Full access to all features</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon color="success" fontSize="small" />
                <Typography>Lifetime updates</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon color="success" fontSize="small" />
                <Typography>Premium support</Typography>
              </Box>
            </Stack>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={loading ? <CircularProgress size={20} /> : <ShoppingCartIcon />}
              disabled={loading}
              onClick={() => handleCheckout('price_XXXXXXXXXXXXXX')}
              sx={{ py: 1.5 }}
            >
              {loading ? 'Processing...' : 'Buy Now'}
            </Button>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
              Replace 'price_XXXXXXXXXXXXXX' with your actual Stripe Price ID
            </Typography>
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card
          sx={{
            flex: 1,
            maxWidth: 400,
            border: '2px solid',
            borderColor: 'primary.main',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-8px)' },
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 1 }}>
              <Chip label="MOST POPULAR" color="primary" size="small" sx={{ mb: 2 }} />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Monthly Subscription
              </Typography>
              <Typography variant="h3" fontWeight="bold" color="primary">
                $9.99
              </Typography>
              <Typography color="text.secondary">per month</Typography>
            </Box>

            <Stack spacing={2} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon color="success" fontSize="small" />
                <Typography>All premium features</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon color="success" fontSize="small" />
                <Typography>Monthly updates</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon color="success" fontSize="small" />
                <Typography>Priority support</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon color="success" fontSize="small" />
                <Typography>Cancel anytime</Typography>
              </Box>
            </Stack>

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ShoppingCartIcon />}
              disabled={loading}
              onClick={() => handleCheckout('price_YYYYYYYYYYYYYY', true)}
              sx={{ py: 1.5 }}
            >
              {loading ? 'Processing...' : 'Subscribe Now'}
            </Button>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
              Replace 'price_YYYYYYYYYYYYYY' with your actual Stripe Price ID
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Secure payment powered by Stripe
        </Typography>
      </Box>
    </Container>
  );
}
