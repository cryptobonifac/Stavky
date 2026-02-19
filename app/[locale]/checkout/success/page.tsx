'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useAuth } from '@/components/providers/auth-provider';
import { isAccountActive } from '@/lib/utils/account';

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkoutId = searchParams.get('checkout_id');
  const { refreshProfile, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [accountActivated, setAccountActivated] = useState(false);

  useEffect(() => {
    if (checkoutId) {
      // Refresh profile immediately to get updated account status
      refreshProfile();

      // Show success page after a brief delay
      const loadingTimer = setTimeout(() => {
        setLoading(false);
      }, 1000);

      // Poll for account activation (webhook might be delayed)
      let pollCount = 0;
      const maxPolls = 15; // Poll for up to 30 seconds (15 * 2 seconds)

      const pollInterval = setInterval(async () => {
        pollCount++;
        await refreshProfile();

        if (pollCount >= maxPolls) {
          // Stop polling after max attempts
          clearInterval(pollInterval);
        }
      }, 2000); // Poll every 2 seconds

      // Start countdown for auto-redirect
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearTimeout(loadingTimer);
        clearInterval(countdownInterval);
        clearInterval(pollInterval);
      };
    } else {
      setLoading(false);
    }
  }, [checkoutId, refreshProfile]);

  // Check if account is activated when profile updates
  useEffect(() => {
    if (profile && profile.account_active_until && isAccountActive(profile.account_active_until)) {
      setAccountActivated(true);
    }
  }, [profile]);

  // Separate effect for redirect to avoid React state update during render
  useEffect(() => {
    if (checkoutId && countdown === 0) {
      // Refresh profile one more time before redirecting
      refreshProfile().then(() => {
        // Use setTimeout to ensure redirect happens after state update is complete
        setTimeout(() => {
          router.push('/bettings');
        }, 100); // Small delay to ensure profile refresh completes
      });
    }
  }, [checkoutId, countdown, router, refreshProfile]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: 2,
        }}
      >
        <CheckCircleOutlineIcon
          sx={{
            fontSize: 80,
            color: 'success.main',
            mb: 3,
          }}
        />

        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Payment Successful!
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Thank you for your purchase. Your payment has been processed successfully.
        </Typography>

        {checkoutId && (
          <Box
            sx={{
              bgcolor: 'grey.100',
              p: 2,
              borderRadius: 1,
              mb: 4,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Checkout ID
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
              {checkoutId}
            </Typography>
          </Box>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          You will receive a confirmation email shortly.
        </Typography>

        {checkoutId && countdown > 0 && (
          <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
            Redirecting to bettings page in {countdown} second{countdown !== 1 ? 's' : ''}...
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push('/')}
            fullWidth
          >
            Return to Home
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => router.push('/bettings')}
            fullWidth
          >
            View My Bettings
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <Container maxWidth="sm" sx={{ py: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        </Container>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
