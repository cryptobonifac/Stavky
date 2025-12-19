'use client';

import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { useRouter } from '@/i18n/routing';

export default function CheckoutCancelPage() {
  const router = useRouter();

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
        <CancelIcon
          sx={{
            fontSize: 80,
            color: 'warning.main',
            mb: 3,
          }}
        />

        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Payment Cancelled
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Your payment has been cancelled. No charges have been made to your account.
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          If you encountered any issues during checkout, please try again or contact our support team.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push('/checkout')}
            fullWidth
          >
            Try Again
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => router.push('/')}
            fullWidth
          >
            Return to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

