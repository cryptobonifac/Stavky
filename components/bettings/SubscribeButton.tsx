'use client';

import { Button, Box, Typography, Card, CardContent } from '@mui/material';
import { useRouter } from '@/i18n/routing';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useTranslations } from 'next-intl';

interface SubscribeButtonProps {
  locale: string;
  title?: string;
  description?: string;
}

export default function SubscribeButton({
  locale,
  title,
  description
}: SubscribeButtonProps) {
  const router = useRouter();
  const t = useTranslations('bettings');

  const handleSubscribe = () => {
    router.push('/checkout');
  };

  return (
    <Card sx={{ mt: 3, border: '2px solid', borderColor: 'primary.main' }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {description}
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<CreditCardIcon />}
            onClick={handleSubscribe}
            sx={{
              py: 1.5,
              px: 4,
              fontSize: '1.1rem'
            }}
          >
            {t('subscribeNow')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
