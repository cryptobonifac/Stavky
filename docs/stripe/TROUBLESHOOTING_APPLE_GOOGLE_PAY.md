# Troubleshooting: Apple Pay and Google Pay Not Showing

## Quick Checklist

If Apple Pay or Google Pay buttons are not appearing on your Stripe Checkout page, check these items:

### 1. Stripe Dashboard Configuration ⚠️ MOST COMMON ISSUE

**Apple Pay:**
1. Go to: https://dashboard.stripe.com/settings/payment_methods
2. Find "Apple Pay" in the list
3. Toggle it to **ON** (enabled)
4. For production: Go to https://dashboard.stripe.com/settings/payment_methods/apple_pay
5. Add your domain and upload the verification file

**Google Pay:**
1. Go to: https://dashboard.stripe.com/settings/payment_methods
2. Find "Google Pay" in the list
3. Toggle it to **ON** (enabled)

### 2. Browser and Device Requirements

**Apple Pay:**
- ✅ Safari browser (macOS 10.14.1+ or iOS 12.1+)
- ✅ Valid card added to Apple Wallet
- ✅ Supported country (check Stripe's supported countries list)
- ❌ Does NOT work in Chrome, Firefox, or Edge

**Google Pay:**
- ✅ Google Chrome (version 61+) or Safari
- ✅ Valid card saved in Google Pay account
- ✅ Supported country
- ❌ May not work in all browsers

### 3. HTTPS Requirements

- **Production:** Must use HTTPS (not HTTP)
- **Development:** localhost works without HTTPS
- **Testing:** Use `https://localhost:3000` or a tool like ngrok for HTTPS testing

### 4. Domain Verification (Apple Pay - Production Only)

For production websites, Apple Pay requires domain verification:

1. Go to: https://dashboard.stripe.com/settings/payment_methods/apple_pay
2. Click "Add domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Download the verification file
5. Upload it to: `https://yourdomain.com/.well-known/apple-developer-merchantid-domain-association`
6. Wait a few minutes for verification

**Note:** For localhost development, domain verification is NOT required.

### 5. Test Mode vs Live Mode

- Ensure you're testing with the correct mode:
  - Test mode keys → Test mode checkout
  - Live mode keys → Live mode checkout
- Payment methods must be enabled in the same mode you're using

### 6. Country Support

Apple Pay and Google Pay are only available in supported countries. Check:
- [Stripe Apple Pay Countries](https://stripe.com/docs/apple-pay)
- [Stripe Google Pay Countries](https://stripe.com/docs/google-pay)

Your account is in: **CZ (Czech Republic)** - verify if Apple Pay/Google Pay are supported there.

## Testing Steps

1. **Enable in Dashboard:**
   ```bash
   # Run diagnostic script
   node tmp/diagnose-apple-google-pay.js
   ```

2. **Check Browser:**
   - Apple Pay: Use Safari on macOS/iOS
   - Google Pay: Use Chrome or Safari

3. **Verify Cards:**
   - Apple Pay: Add test card to Apple Wallet
   - Google Pay: Add test card to Google Pay account

4. **Test Cards:**
   - Apple Pay test cards: https://stripe.com/docs/testing#apple-pay
   - Google Pay test cards: https://stripe.com/docs/testing#google-pay

5. **Check Console:**
   - Open browser DevTools (F12)
   - Check for any errors related to payment methods
   - Look for Stripe-related errors

## Common Issues and Solutions

### Issue: "Payment methods not showing in Safari"

**Solution:**
- Ensure Apple Pay is enabled in Stripe Dashboard
- Verify you have a card in Apple Wallet
- Check you're using Safari (not Chrome/Firefox)
- For production: Verify domain is registered

### Issue: "Google Pay not showing in Chrome"

**Solution:**
- Ensure Google Pay is enabled in Stripe Dashboard
- Verify you have a card in Google Pay account
- Check Chrome version (needs 61+)
- Clear browser cache and cookies

### Issue: "Works in test mode but not production"

**Solution:**
- Verify payment methods are enabled in LIVE mode (not just test mode)
- For Apple Pay: Complete domain verification for production domain
- Ensure production site uses HTTPS

### Issue: "Not showing on localhost"

**Solution:**
- Apple Pay/Google Pay should work on localhost
- Ensure payment methods are enabled in Stripe Dashboard
- Use Safari for Apple Pay, Chrome for Google Pay
- Verify you have cards in your wallet

## Verification Commands

```bash
# Run diagnostic script
node tmp/diagnose-apple-google-pay.js

# Check Stripe configuration
node tmp/verify-stripe-config.js
```

## Still Not Working?

1. **Double-check Stripe Dashboard:**
   - Settings → Payment Methods
   - Ensure both Apple Pay and Google Pay are toggled ON
   - Check if there are any warnings or errors

2. **Test in Different Environment:**
   - Try production URL (if domain is verified)
   - Try different browser/device
   - Try different test card

3. **Check Stripe Logs:**
   - Go to Stripe Dashboard → Developers → Logs
   - Look for any errors related to payment methods

4. **Contact Stripe Support:**
   - If all else fails, contact Stripe support with:
     - Your account ID
     - Browser/device information
     - Screenshot of checkout page
     - Any console errors

## Additional Resources

- [Stripe Apple Pay Documentation](https://docs.stripe.com/apple-pay)
- [Stripe Google Pay Documentation](https://docs.stripe.com/google-pay)
- [Stripe Payment Methods Settings](https://dashboard.stripe.com/settings/payment_methods)
- [Stripe Testing Guide](https://stripe.com/docs/testing)

