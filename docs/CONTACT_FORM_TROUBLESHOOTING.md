# Contact Form Troubleshooting Guide

## Error: "Email service is not configured"

This error occurs when `RESEND_API_KEY` is not properly configured or not accessible to the API route.

## 🚀 Quick Fix (Most Common Issue)

If your diagnostic shows `hasKey: false`, the variable is missing from `.env.local`:

1. **Open `.env.local`** in your project root
2. **Add this line** (if it doesn't exist):
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```
   Replace `re_xxxxxxxxxxxxx` with your actual Resend API key from [Resend Dashboard](https://resend.com/api-keys)

3. **Restart your dev server**:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

4. **Verify it works**:
   ```bash
   npm run verify:resend
   ```
   Or visit `http://localhost:3000/api/contact` - should show `resendConfigured: true`

## Quick Diagnostic Steps

### Step 0: Run Verification Script (Recommended)

Use the automated verification script to check your configuration:

```bash
npm run verify:resend
```

This script will:
- Check if `.env.local` exists
- Verify `RESEND_API_KEY` is defined
- Validate the format
- Provide specific fix instructions

### Step 1: Test the API Endpoint

Visit `http://localhost:3000/api/contact` in your browser. You should see a JSON response with diagnostics.

**Expected response (working):**
```json
{
  "message": "Contact API is working",
  "resendConfigured": true,
  "diagnostics": {
    "hasKey": true,
    "keyNotEmpty": true,
    "keyStartsWithRe": true,
    "keyLength": 40,
    "nodeEnv": "development",
    "issues": ["No issues detected"]
  }
}
```

**If `resendConfigured` is `false`**, check the `diagnostics` and `troubleshooting` fields for specific issues.

### Step 2: Check Your .env.local File

1. **Location**: `.env.local` must be in the project root (same directory as `package.json`)

2. **Format**: The variable must be formatted correctly:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

   ❌ **Wrong formats:**
   ```env
   RESEND_API_KEY="re_xxx"          # No quotes
   RESEND_API_KEY = re_xxx          # No spaces around =
   resend_api_key=re_xxx            # Wrong case
   RESEND_API_KEY_=re_xxx           # Extra underscore
   ```

   ✅ **Correct format:**
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

3. **Verify the key**:
   - Resend API keys always start with `re_`
   - Get your key from [Resend Dashboard](https://resend.com/api-keys)
   - Make sure you copied the entire key (usually 40+ characters)

### Step 3: Restart Development Server

**Critical**: Next.js loads environment variables when the server starts. If you:
- Added `RESEND_API_KEY` after starting the server
- Modified `.env.local` while the server was running
- Changed the variable value

You **must restart** the server:

```bash
# Stop the server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

### Step 4: Check Server Console

When you submit the contact form, check your terminal/console where `npm run dev` is running. You should see detailed diagnostic logs:

```
RESEND_API_KEY configuration issue detected
Detailed diagnostics: {
  hasKey: true/false,
  keyNotEmpty: true/false,
  keyLength: <number>,
  keyStartsWithRe: true/false,
  nodeEnv: 'development',
  allEnvKeys: [...]
}
```

## Common Issues and Solutions

### Issue 1: Variable Not Found

**Diagnostic shows**: `hasKey: false`

**Solutions:**
- Verify `.env.local` exists in project root
- Check variable name is exactly `RESEND_API_KEY` (case-sensitive)
- Restart dev server after adding the variable
- Check for typos in variable name

### Issue 2: Variable is Empty

**Diagnostic shows**: `hasKey: true`, `keyNotEmpty: false`

**Solutions:**
- Check that the value after `=` is not empty
- Remove any quotes around the value
- Ensure there are no extra spaces
- Verify you copied the entire API key

### Issue 3: Invalid Key Format

**Diagnostic shows**: `keyStartsWithRe: false`

**Solutions:**
- Resend API keys must start with `re_`
- Verify you're using the correct API key from Resend
- Check if you accidentally copied a different key (like a domain key)
- Get a new API key from [Resend Dashboard](https://resend.com/api-keys)

### Issue 4: Server Not Restarted

**Symptom**: Variable is in `.env.local` but still not working

**Solution**: 
```bash
# Stop server completely (Ctrl+C)
# Wait a few seconds
# Start again:
npm run dev
```

### Issue 5: Multiple Environment Files

**Symptom**: Variable works sometimes but not others

**Solution**:
- Next.js loads env files in this order: `.env.local` > `.env.development` > `.env`
- Remove `RESEND_API_KEY` from other env files
- Keep it only in `.env.local` for development

## Verification Checklist

- [ ] `.env.local` file exists in project root
- [ ] `RESEND_API_KEY=re_xxxxxxxxxxxxx` is in `.env.local` (no quotes, no spaces)
- [ ] Variable name is exactly `RESEND_API_KEY` (case-sensitive)
- [ ] API key starts with `re_`
- [ ] Dev server was restarted after adding/modifying the variable
- [ ] GET `/api/contact` shows `resendConfigured: true`
- [ ] Server console shows no errors related to RESEND_API_KEY

## Getting Help

If the issue persists after following these steps:

1. **Check the diagnostic endpoint**: Visit `http://localhost:3000/api/contact` and share the response
2. **Check server console**: Look for error messages when submitting the form
3. **Verify Resend account**: Ensure your Resend account is active and the API key is valid
4. **Test with a new key**: Generate a new API key in Resend dashboard and try again

## Production Deployment

For production (Vercel, etc.):

1. Add `RESEND_API_KEY` to your deployment platform's environment variables
2. Ensure it's set for the correct environment (Production, Preview, Development)
3. Redeploy after adding the variable
4. Test the contact form after deployment

