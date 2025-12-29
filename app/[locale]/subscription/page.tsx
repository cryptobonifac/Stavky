'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Stack,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { createSubscriptionCheckoutSession } from '@/app/checkout/actions';
import { getSubscriptionStatus, cancelSubscription } from '@/app/subscription/actions';
import { useLocale } from 'next-intl';
import MainLayout from '@/components/layout/MainLayout';
import TopNav from '@/components/navigation/TopNav';
import PageSection from '@/components/layout/PageSection';
import { useAuth } from '@/components/providers/auth-provider';

type SubscriptionStatus = {
  id: string;
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  customerId: string | null;
};

export default function SubscriptionPage() {
  const locale = useLocale();
  const t = useTranslations('subscription');
  const tCommon = useTranslations('common');
  const { profile } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  useEffect(() => {
    loadSubscriptionStatus();
  }, []);

  const loadSubscriptionStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getSubscriptionStatus();
      
      if (result.error) {
        setError(result.error);
      } else if (result.subscription) {
        setSubscription(result.subscription);
      } else {
        setSubscription(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscription status');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubscription = async () => {
    try {
      setError(null);
      const subscriptionPriceId = process.env.NEXT_PUBLIC_SUBSCRIPTION_PRICE_ID;
      
      if (!subscriptionPriceId || !subscriptionPriceId.startsWith('price_')) {
        setError('Subscription price ID is not configured. Please contact support.');
        return;
      }

      const { url } = await createSubscriptionCheckoutSession(subscriptionPriceId, locale);
      
      if (url) {
        window.location.href = url;
      } else {
        setError('Failed to create checkout session');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create subscription');
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setCancelling(true);
      setError(null);
      
      const result = await cancelSubscription();
      
      if (result.error) {
        setError(result.error);
      } else {
        // Reload subscription status to reflect cancellation
        await loadSubscriptionStatus();
        setCancelDialogOpen(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <TopNav />
        <PageSection>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        </PageSection>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <TopNav />
      <PageSection>
        <Container maxWidth="md">

      {error && (
        <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          {subscription ? (
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {t('activeSubscription')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('subscriptionActiveDescription')}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ pl: 7 }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionId')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {subscription.id}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('status')}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                      {subscription.status}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {subscription.cancelAtPeriodEnd ? t('cancelsOn') : t('renewsOn')}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
                  </Box>

                  {subscription.cancelAtPeriodEnd && (
                    <Alert severity="info">
                      {t('cancellationScheduled')}
                    </Alert>
                  )}
                </Stack>
              </Box>

              {!subscription.cancelAtPeriodEnd && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={() => setCancelDialogOpen(true)}
                  sx={{ alignSelf: 'flex-start', ml: 7 }}
                >
                  {t('cancelSubscription')}
                </Button>
              )}
            </Stack>
          ) : (
            <Stack spacing={3} alignItems="center">
              <Box sx={{ textAlign: 'center' }}>
                <CancelIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {t('noSubscription')}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  {t('noSubscriptionDescription')}
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                startIcon={<CardMembershipIcon />}
                onClick={handleCreateSubscription}
                sx={{ px: 4, py: 1.5 }}
              >
                {t('createSubscription')}
              </Button>
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>{t('confirmCancellation')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('confirmCancellationMessage')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)} disabled={cancelling}>
            {tCommon('cancel')}
          </Button>
          <Button 
            onClick={handleCancelSubscription} 
            color="error" 
            variant="contained"
            disabled={cancelling}
          >
            {cancelling ? <CircularProgress size={20} /> : t('confirmCancel')}
          </Button>
        </DialogActions>
      </Dialog>
        </Container>
      </PageSection>
    </MainLayout>
  );
}



