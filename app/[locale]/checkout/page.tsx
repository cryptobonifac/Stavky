'use client';

import { useState, useEffect } from 'react';
import { createSubscriptionCheckoutSession, getStripePrices } from '@/app/checkout/actions';
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

interface PriceInfo {
  amount: number;
  currency: string;
  interval: string | null;
  intervalCount: number | null;
  priceId: string;
  error?: string;
}

function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: amount % 100 === 0 ? 0 : 2,
  }).format(amount / 100);
}

export default function CheckoutPage() {
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [pricesLoading, setPricesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthlyPrice, setMonthlyPrice] = useState<PriceInfo | null>(null);
  const [yearlyPrice, setYearlyPrice] = useState<PriceInfo | null>(null);

  useEffect(() => {
    async function fetchPrices() {
      try {
        setPricesLoading(true);
        const prices = await getStripePrices();
        
        if (prices.error) {
          setError(prices.error);
        }
        
        setMonthlyPrice(prices.monthly);
        setYearlyPrice(prices.yearly);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load prices';
        setError(errorMessage);
        console.error('Error fetching prices:', err);
      } finally {
        setPricesLoading(false);
      }
    }

    fetchPrices();
  }, []);

  const handleCheckout = async (priceId: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!priceId || !priceId.startsWith('price_')) {
        throw new Error('Invalid price ID. Please configure valid Stripe Price IDs in your environment variables.');
      }

      const { url } = await createSubscriptionCheckoutSession(priceId, locale);

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

  const isPriceValid = (price: PriceInfo | null): boolean => {
    return price !== null && !price.error && price.amount > 0 && price.priceId.startsWith('price_');
  };

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
          Choose Your Plan
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' } }}
        >
          Select the subscription plan that works best for you
        </Typography>
      </Box>

      {error && (
        <Box sx={{ mb: { xs: 3, md: 4 }, p: { xs: 1.5, md: 2 }, bgcolor: 'error.light', borderRadius: 1 }}>
          <Typography color="error.dark" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
            {error}
          </Typography>
        </Box>
      )}

      {pricesLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 6, md: 8 } }}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 3, md: 4 }}
          justifyContent="center"
          alignItems="stretch"
        >
          {/* Monthly Subscription Card */}
          <Card
            sx={{
              flex: 1,
              maxWidth: { xs: '100%', md: 400 },
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-8px)' },
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 3 } }}>
                <Typography 
                  variant="h5" 
                  fontWeight="bold" 
                  gutterBottom
                  sx={{ fontSize: { xs: '1.1rem', md: '1.5rem' } }}
                >
                  Monthly Subscription
                </Typography>
                {monthlyPrice && isPriceValid(monthlyPrice) ? (
                  <>
                    <Typography 
                      variant="h3" 
                      fontWeight="bold" 
                      color="primary"
                      sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
                    >
                      {formatPrice(monthlyPrice.amount, monthlyPrice.currency)}
                    </Typography>
                    <Typography 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                    >
                      per month
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography 
                      variant="h3" 
                      fontWeight="bold" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
                    >
                      —
                    </Typography>
                    <Typography 
                      color="error" 
                      variant="caption"
                      sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
                    >
                      Price not available
                    </Typography>
                  </>
                )}
              </Box>

              <Stack spacing={{ xs: 1.5, md: 2 }} sx={{ mb: { xs: 3, md: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    All premium features
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    Monthly updates
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    Priority support
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    Cancel anytime
                  </Typography>
                </Box>
              </Stack>

              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={loading ? <CircularProgress size={20} /> : <ShoppingCartIcon />}
                disabled={loading || !isPriceValid(monthlyPrice)}
                onClick={() => monthlyPrice && handleCheckout(monthlyPrice.priceId)}
                sx={{ 
                  py: { xs: 1.25, md: 1.5 },
                  minHeight: 44,
                  fontSize: { xs: '0.875rem', md: '1rem' },
                }}
              >
                {loading ? 'Processing...' : 'Subscribe Monthly'}
              </Button>

              {monthlyPrice && !isPriceValid(monthlyPrice) && (
                <Typography 
                  variant="caption" 
                  color="error" 
                  sx={{ 
                    display: 'block', 
                    mt: 2, 
                    textAlign: 'center', 
                    fontWeight: 'bold',
                    fontSize: { xs: '0.7rem', md: '0.75rem' },
                    px: 1,
                  }}
                >
                  ⚠️ Configure NEXT_PUBLIC_SUBSCRIPTION_MONTHLY_PRICE_ID in your environment variables
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Yearly Subscription Card */}
          <Card
            sx={{
              flex: 1,
              maxWidth: { xs: '100%', md: 400 },
              border: '2px solid',
              borderColor: 'primary.main',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-8px)' },
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Box sx={{ textAlign: 'center', mb: 1 }}>
                <Chip 
                  label="BEST VALUE" 
                  color="primary" 
                  size="small" 
                  sx={{ 
                    mb: 2,
                    fontSize: { xs: '0.7rem', md: '0.75rem' },
                    height: { xs: 24, md: 28 },
                  }} 
                />
                <Typography 
                  variant="h5" 
                  fontWeight="bold" 
                  gutterBottom
                  sx={{ fontSize: { xs: '1.1rem', md: '1.5rem' } }}
                >
                  Yearly Subscription
                </Typography>
                {yearlyPrice && isPriceValid(yearlyPrice) ? (
                  <>
                    <Typography 
                      variant="h3" 
                      fontWeight="bold" 
                      color="primary"
                      sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
                    >
                      {formatPrice(yearlyPrice.amount, yearlyPrice.currency)}
                    </Typography>
                    <Typography 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                    >
                      per year
                    </Typography>
                    {monthlyPrice && isPriceValid(monthlyPrice) && (
                      <Typography 
                        variant="caption" 
                        color="success.main" 
                        sx={{ 
                          display: 'block', 
                          mt: 1,
                          fontSize: { xs: '0.75rem', md: '0.875rem' },
                        }}
                      >
                        Save {formatPrice(
                          monthlyPrice.amount * 12 - yearlyPrice.amount,
                          yearlyPrice.currency
                        )} per year
                      </Typography>
                    )}
                  </>
                ) : (
                  <>
                    <Typography 
                      variant="h3" 
                      fontWeight="bold" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
                    >
                      —
                    </Typography>
                    <Typography 
                      color="error" 
                      variant="caption"
                      sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
                    >
                      Price not available
                    </Typography>
                  </>
                )}
              </Box>

              <Stack spacing={{ xs: 1.5, md: 2 }} sx={{ mb: { xs: 3, md: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    All premium features
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    Yearly updates
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    Priority support
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    Cancel anytime
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    Best value - save more
                  </Typography>
                </Box>
              </Stack>

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ShoppingCartIcon />}
                disabled={loading || !isPriceValid(yearlyPrice)}
                onClick={() => yearlyPrice && handleCheckout(yearlyPrice.priceId)}
                sx={{ 
                  py: { xs: 1.25, md: 1.5 },
                  minHeight: 44,
                  fontSize: { xs: '0.875rem', md: '1rem' },
                }}
              >
                {loading ? 'Processing...' : 'Subscribe Yearly'}
              </Button>

              {yearlyPrice && !isPriceValid(yearlyPrice) && (
                <Typography 
                  variant="caption" 
                  color="error" 
                  sx={{ 
                    display: 'block', 
                    mt: 2, 
                    textAlign: 'center', 
                    fontWeight: 'bold',
                    fontSize: { xs: '0.7rem', md: '0.75rem' },
                    px: 1,
                  }}
                >
                  ⚠️ Configure NEXT_PUBLIC_SUBSCRIPTION_YEARLY_PRICE_ID in your environment variables
                </Typography>
              )}
            </CardContent>
          </Card>
        </Stack>
      )}

      <Box sx={{ mt: { xs: 4, md: 6 }, textAlign: 'center' }}>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
        >
          Secure payment powered by Stripe
        </Typography>
      </Box>
    </Container>
  );
}

