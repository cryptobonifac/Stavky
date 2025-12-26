'use client';

import { useState } from 'react';
import { createCheckoutSession, createSubscriptionCheckoutSession } from '@/app/checkout/actions';
import { useLocale } from 'next-intl';
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
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read Price IDs from environment variables
  const ONE_TIME_PRICE_ID = process.env.NEXT_PUBLIC_ONE_TIME_PRICE_ID || '';
  const SUBSCRIPTION_PRICE_ID = process.env.NEXT_PUBLIC_SUBSCRIPTION_PRICE_ID || '';

  // Debug: Log environment variables (remove in production)
  if (typeof window !== 'undefined') {
    console.log('🔍 Stripe Price ID Environment Variables Check:');
    console.log('NEXT_PUBLIC_ONE_TIME_PRICE_ID:', ONE_TIME_PRICE_ID || '❌ NOT SET');
    console.log('NEXT_PUBLIC_SUBSCRIPTION_PRICE_ID:', SUBSCRIPTION_PRICE_ID || '❌ NOT SET');
    console.log('Is ONE_TIME valid?', ONE_TIME_PRICE_ID && ONE_TIME_PRICE_ID.startsWith('price_') ? '✅' : '❌');
    console.log('Is SUBSCRIPTION valid?', SUBSCRIPTION_PRICE_ID && SUBSCRIPTION_PRICE_ID.startsWith('price_') ? '✅' : '❌');
  }

  const isPlaceholderPriceId = (priceId: string | undefined) => {
    if (!priceId) return true;
    // Check for placeholder values
    if (priceId.includes('XXXXXXXX') || priceId.includes('YYYYYYYY')) return true;
    // Check if it's a Product ID instead of Price ID
    if (priceId.startsWith('prod_')) {
      console.error('❌ Error: You have a Product ID (prod_...) but need a Price ID (price_...). Go to Stripe Dashboard → Products → Select Product → Copy the Price ID from the Pricing section.');
      return true;
    }
    // Must start with 'price_'
    return !priceId.startsWith('price_');
  };

  const handleCheckout = async (priceId: string, isSubscription = false) => {
    try {
      setLoading(true);
      setError(null);

      // Validate price ID before making the request
      if (!priceId || isPlaceholderPriceId(priceId)) {
        throw new Error('Please configure a valid Stripe Price ID in your environment variables (NEXT_PUBLIC_ONE_TIME_PRICE_ID or NEXT_PUBLIC_SUBSCRIPTION_PRICE_ID).');
      }

      const { url } = isSubscription
        ? await createSubscriptionCheckoutSession(priceId, locale)
        : await createCheckoutSession(priceId, locale);

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received from Stripe');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setLoading(false);
      console.error('Checkout error:', err);
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
              disabled={loading || isPlaceholderPriceId(ONE_TIME_PRICE_ID)}
              onClick={() => handleCheckout(ONE_TIME_PRICE_ID)}
              sx={{ py: 1.5 }}
            >
              {loading ? 'Processing...' : 'Buy Now'}
            </Button>

            {isPlaceholderPriceId(ONE_TIME_PRICE_ID) && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mt: 2, textAlign: 'center', fontWeight: 'bold' }}>
                ⚠️ Configure NEXT_PUBLIC_ONE_TIME_PRICE_ID in your .env.local file
              </Typography>
            )}
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
              disabled={loading || isPlaceholderPriceId(SUBSCRIPTION_PRICE_ID)}
              onClick={() => handleCheckout(SUBSCRIPTION_PRICE_ID, true)}
              sx={{ py: 1.5 }}
            >
              {loading ? 'Processing...' : 'Subscribe Now'}
            </Button>

            {isPlaceholderPriceId(SUBSCRIPTION_PRICE_ID) && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mt: 2, textAlign: 'center', fontWeight: 'bold' }}>
                ⚠️ Configure NEXT_PUBLIC_SUBSCRIPTION_PRICE_ID in your .env.local file
              </Typography>
            )}
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




