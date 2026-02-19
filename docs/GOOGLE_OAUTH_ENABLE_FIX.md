# Fix: Google OAuth Not Working - Provider Disabled

## Problem Found

Looking at your Supabase Dashboard screenshot, **Google OAuth provider is DISABLED**.

The "Enable Sign in with Google" toggle switch is in the **OFF** (gray) position.

## Solution

### Step 1: Enable Google OAuth in Supabase Dashboard

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your **PRODUCTION** project: `ezhcfemzrbfsfkafqsav`
3. Navigate to **Authentication** → **Providers** → **Google**
4. **CRITICAL**: Toggle the **"Enable Sign in with Google"** switch to **ON** (it should turn blue/green)
5. Verify the settings:
   - **Client IDs**: `161230976386-q99dtviv0910v7sadohcb5rjr13bkbpg.apps.googleusercontent.com` ✅
   - **Client Secret (for OAuth)**: Should be filled (masked) ✅
   - **Callback URL**: `https://ezhcfemzrbfsfkafqsav.supabase.co/auth/v1/callback` ✅
6. Click **Save** (if there's a save button) or the changes should auto-save

### Step 2: Verify Google Cloud Console Configuration

Your Google Cloud Console looks correct:
- ✅ Supabase callback: `https://ezhcfemzrbfsfkafqsav.supabase.co/auth/v1/callback`
- ✅ App callback: `https://stavky.vercel.app/auth/callback`

**Note**: You have 2 client secrets enabled. This is fine, but consider disabling the older one once you verify the new one works.

### Step 3: Verify Supabase URL Configuration

Your URL Configuration looks correct:
- ✅ Site URL: `https://stavky.vercel.app` (no locale prefix)
- ✅ Redirect URLs: 
  - `https://stavky.vercel.app/auth/callback`
  - `https://*.vercel.app/auth/callback`

### Step 4: Test

1. **Wait 1-2 minutes** for Supabase changes to propagate
2. **Clear browser cache and cookies**
3. Go to: `https://stavky.vercel.app/en/login`
4. Click "Sign in with Google"
5. **Expected**: Should redirect to Google OAuth page
6. After authentication, should redirect to: `https://stavky.vercel.app/auth/callback?code=...&locale=en`

## Why This Happens

If the Google provider toggle is OFF:
- Supabase will not process Google OAuth requests
- Users will get errors when trying to sign in with Google
- The OAuth flow will fail at the Supabase level

## Verification Checklist

- [ ] Google OAuth provider toggle is **ON** (blue/green) in Supabase Dashboard
- [ ] Client ID matches Google Cloud Console
- [ ] Client Secret is set (not empty)
- [ ] Callback URL shows Supabase endpoint
- [ ] Site URL is `https://stavky.vercel.app` (no locale)
- [ ] Redirect URLs include `https://stavky.vercel.app/auth/callback`
- [ ] Google Cloud Console has Supabase callback URI
- [ ] Waited 1-2 minutes after enabling
- [ ] Cleared browser cache
- [ ] Tested OAuth login

## Additional Notes

### Multiple Client Secrets

You have 2 client secrets in Google Cloud Console:
- Created: December 19, 2025
- Created: December 28, 2025

**Recommendation**: Once you verify OAuth works with the current setup:
1. Identify which secret is being used in Supabase Dashboard
2. Disable/delete the older unused secret
3. This reduces security risk

### Client ID Verification

Your Client ID in Supabase should match Google Cloud Console:
- Supabase: `161230976386-q99dtviv0910v7sadohcb5rjr13bkbpg.apps.googleusercontent.com`
- Google Console: Should match exactly

## Related Documentation

- [Supabase Redirect Override Fix](SUPABASE_REDIRECT_OVERRIDE_FIX.md)
- [Production Google OAuth Fix](PRODUCTION_GOOGLE_OAUTH_FIX.md)





