'use client';

import { useEffect, useState } from 'react';
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

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // You can verify the session here if needed
      // For now, we'll just show success after a brief delay
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [sessionId]);

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

