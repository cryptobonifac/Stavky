# Apple Pay and Google Pay Setup for Stripe Checkout

## Overview

Apple Pay and Google Pay are **automatically enabled** in Stripe Checkout when certain conditions are met. The checkout code has been updated to support these payment methods.

## Requirements

### 1. Stripe Dashboard Configuration

1. **Enable Payment Methods:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/settings/payment_methods)
   - Navigate to **Settings** → **Payment Methods**
   - Ensure **Apple Pay** and **Google Pay** are enabled

2. **Domain Verification (Apple Pay only):**
   - Go to **Settings** → **Payment Methods** → **Apple Pay**
   - Click **Add domain** and enter your domain
   - Download the domain verification file
   - Upload it to your website at: `https://yourdomain.com/.well-known/apple-developer-merchantid-domain-association`
   - For localhost development, Apple Pay will work without domain verification

### 2. Website Requirements

- **HTTPS Required:** Your website must be served over HTTPS (or localhost for development)
- **Domain Registration:** Apple Pay requires domain verification (see above)
- **Google Pay:** No domain registration needed

### 3. Customer Requirements

**Apple Pay:**
- Safari browser on macOS (10.14.1+) or iOS (12.1+)
- Valid card added to Apple Wallet

**Google Pay:**
- Google Chrome or Safari browser
- Valid card saved in Google Pay account

## How It Works

Stripe Checkout **automatically displays** Apple Pay and Google Pay buttons when:
- ✅ Payment methods are enabled in Stripe Dashboard
- ✅ Domain is verified (for Apple Pay)
- ✅ Customer's device/browser supports it
- ✅ Customer has a valid card in their wallet

**No additional code changes are needed** - the buttons appear automatically in the checkout flow.

## Testing

### Test Mode

1. Use test cards in your Apple Wallet or Google Pay
2. Apple Pay test cards: https://stripe.com/docs/testing#apple-pay
3. Google Pay test cards: https://stripe.com/docs/testing#google-pay

### Production

1. Ensure your domain is verified in Stripe Dashboard
2. Test with real cards in Apple Wallet/Google Pay
3. Verify HTTPS is working correctly

## Current Implementation

The checkout sessions have been configured with:
- `payment_method_types: ['card', 'link']` - Includes card payments and Stripe Link
- Apple Pay and Google Pay are automatically shown when available (no explicit configuration needed)

## Troubleshooting

**Apple Pay/Google Pay buttons not showing:**
- Check that payment methods are enabled in Stripe Dashboard
- Verify domain is registered (for Apple Pay)
- Ensure HTTPS is enabled (or using localhost)
- Check customer's device/browser supports the payment method
- Verify customer has cards in their wallet

**Domain verification issues:**
- Ensure the verification file is accessible at the correct path
- Check file permissions and server configuration
- Wait a few minutes after uploading - verification can take time

## Additional Resources

- [Stripe Apple Pay Documentation](https://docs.stripe.com/apple-pay)
- [Stripe Google Pay Documentation](https://docs.stripe.com/google-pay)
- [Stripe Payment Methods Settings](https://dashboard.stripe.com/settings/payment_methods)





