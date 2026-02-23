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
} from '@mui/material';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import BuildIcon from '@mui/icons-material/Build';
import { getSubscriptionStatus } from '@/app/subscription/actions';
import { useLocale } from 'next-intl';
import MainLayout from '@/components/layout/MainLayout';
import TopNav from '@/components/navigation/TopNav';
import PageSection from '@/components/layout/PageSection';

type SubscriptionStatus = {
  id: string;
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  customerId: string | null;
  planType?: string | null;
};

export default function SubscriptionPage() {
  const locale = useLocale();
  const t = useTranslations('subscription');

  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    loadSubscriptionStatus();
  }, []);

  const loadSubscriptionStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getSubscriptionStatus();

      if (result.maintenanceMode) {
        setMaintenanceMode(true);
      }

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
    // Redirect to checkout page
    window.location.href = `/${locale}/checkout`;
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

      {maintenanceMode && (
        <Alert severity="info" icon={<BuildIcon />} sx={{ mb: 4 }}>
          <Typography variant="body2">
            {t('maintenanceNotice') || 'Subscription management is currently being updated. Your existing subscription remains active.'}
          </Typography>
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
                      {t('status')}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                      {subscription.status}
                    </Typography>
                  </Box>

                  {subscription.planType && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {t('planType') || 'Plan Type'}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                        {subscription.planType}
                      </Typography>
                    </Box>
                  )}

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('activeUntil') || 'Active Until'}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
                  </Box>

                  {maintenanceMode && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      {t('managementDisabled') || 'Subscription management is temporarily disabled during system update.'}
                    </Alert>
                  )}
                </Stack>
              </Box>
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
                disabled={maintenanceMode}
                sx={{ px: 4, py: 1.5 }}
              >
                {t('createSubscription')}
              </Button>

              {maintenanceMode && (
                <Typography variant="body2" color="text.secondary">
                  {t('checkBackSoon') || 'Please check back soon to subscribe.'}
                </Typography>
              )}
            </Stack>
          )}
        </CardContent>
      </Card>

        </Container>
      </PageSection>
    </MainLayout>
  );
}
