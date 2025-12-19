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

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (sessionId) {
      // Show success page after a brief delay
      const loadingTimer = setTimeout(() => {
        setLoading(false);
      }, 1000);

      // Start countdown for auto-redirect
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            // Redirect to bettings page after 3 seconds
            router.push('/bettings');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearTimeout(loadingTimer);
        clearInterval(countdownInterval);
      };
    } else {
      setLoading(false);
    }
  }, [sessionId, router]);

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

        {sessionId && (
          <Box
            sx={{
              bgcolor: 'grey.100',
              p: 2,
              borderRadius: 1,
              mb: 4,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Session ID
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
              {sessionId}
            </Typography>
          </Box>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          You will receive a confirmation email shortly.
        </Typography>

        {sessionId && countdown > 0 && (
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

