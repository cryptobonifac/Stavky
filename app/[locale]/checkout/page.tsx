'use client';

import { useState, useEffect } from 'react';
import { createPolarCheckoutSession, getPolarPrices } from '@/app/checkout/actions';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface PriceInfo {
  amount: number;
  currency: string;
  interval: string | null;
  intervalCount: number | null;
  productId: string;
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
  const t = useTranslations('checkout');
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | null>('yearly');
  const [loading, setLoading] = useState(false);
  const [pricesLoading, setPricesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthlyPrice, setMonthlyPrice] = useState<PriceInfo | null>(null);
  const [yearlyPrice, setYearlyPrice] = useState<PriceInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Check authentication status
  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);
      } catch (err) {
        console.error('Error checking auth:', err);
        setIsAuthenticated(false);
      } finally {
        setAuthChecking(false);
      }
    }

    checkAuth();
  }, []);

  useEffect(() => {
    async function fetchPrices() {
      try {
        setPricesLoading(true);
        const prices = await getPolarPrices();

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

  const handleCheckout = async (productId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated
      if (!isAuthenticated) {
        // Redirect to login with return URL
        router.push(`/login?redirect=${encodeURIComponent('/checkout')}`);
        return;
      }

      if (!productId) {
        throw new Error('Invalid product ID. Please configure valid Polar Product IDs in your environment variables.');
      }

      const { url } = await createPolarCheckoutSession(productId, locale);

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received from Polar');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setLoading(false);
      console.error('Checkout error:', err);
    }
  };

  const isPriceValid = (price: PriceInfo | null): boolean => {
    return price !== null && !price.error && price.amount > 0 && !!price.productId;
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
          {t('choosePlan')}
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' } }}
        >
          {t('selectPlanSubtitle')}
        </Typography>
      </Box>

      {error && (
        <Box sx={{ mb: { xs: 3, md: 4 }, p: { xs: 1.5, md: 2 }, bgcolor: 'error.light', borderRadius: 1 }}>
          <Typography color="error.dark" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
            {error}
          </Typography>
        </Box>
      )}

      {(pricesLoading || authChecking) ? (
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
              border: selectedPlan === 'monthly' ? '2px solid #1976d2' : undefined,
              boxShadow: selectedPlan === 'monthly' ? '0 0 0 2px #1976d2' : undefined,
              '&:hover': { transform: 'translateY(-8px)' },
              cursor: 'pointer',
            }}
            onClick={() => setSelectedPlan('monthly')}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 3 } }}>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ fontSize: { xs: '1.1rem', md: '1.5rem' } }}
                >
                  {t('monthlySubscription')}
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
                      {t('perMonth')}
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
                      {t('priceNotAvailable')}
                    </Typography>
                  </>
                )}
              </Box>

              <Stack spacing={{ xs: 1.5, md: 2 }} sx={{ mb: { xs: 3, md: 4 } }}>
              </Stack>

              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={loading ? <CircularProgress size={20} /> : <ShoppingCartIcon />}
                disabled={loading || !isPriceValid(monthlyPrice)}
                onClick={() => {
                  setSelectedPlan('monthly');
                  monthlyPrice && handleCheckout(monthlyPrice.productId);
                }}
                sx={{
                  py: { xs: 1.25, md: 1.5 },
                  minHeight: 44,
                  fontSize: { xs: '0.875rem', md: '1rem' },
                }}
              >
                {loading ? t('processing') : t('subscribeMonthly')}
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
                  {t('monthlyPriceIdWarning')}
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Yearly Subscription Card */}
          <Card
            sx={{
              flex: 1,
              maxWidth: { xs: '100%', md: 400 },
              border: selectedPlan === 'yearly' ? '2px solid #1976d2' : '2px solid',
              borderColor: selectedPlan === 'yearly' ? '#1976d2' : 'primary.main',
              boxShadow: selectedPlan === 'yearly' ? '0 0 0 2px #1976d2' : undefined,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-8px)' },
              cursor: 'pointer',
            }}
            onClick={() => setSelectedPlan('yearly')}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Box sx={{ textAlign: 'center', mb: 1 }}>
                <Chip
                  label={t('bestValue')}
                  color="primary"
                  size="small"
                  sx={{
                    mb: 2,
                    fontSize: { xs: '0.7rem', md: '0.75rem' },
                    height: { xs: 24, md: 28 },
                  }}
                />
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
                      {t('perYear')}
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
                        {t('savePerYear', {
                          amount: formatPrice(
                            monthlyPrice.amount * 12 - yearlyPrice.amount,
                            yearlyPrice.currency
                          )
                        })}
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
                      {t('priceNotAvailable')}
                    </Typography>
                  </>
                )}
              </Box>

              <Stack spacing={{ xs: 1.5, md: 2 }} sx={{ mb: { xs: 3, md: 4 } }}>
              </Stack>

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ShoppingCartIcon />}
                disabled={loading || !isPriceValid(yearlyPrice)}
                onClick={() => yearlyPrice && handleCheckout(yearlyPrice.productId)}
                sx={{
                  py: { xs: 1.25, md: 1.5 },
                  minHeight: 44,
                  fontSize: { xs: '0.875rem', md: '1rem' },
                }}
              >
                {loading ? t('processing') : t('subscribeYearly')}
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
                  {t('yearlyPriceIdWarning')}
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
          sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' }, mb: 3 }}
        >
          {t('securePayment')}
        </Typography>

        {/* Back button */}
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
    </Container>
  );
}
