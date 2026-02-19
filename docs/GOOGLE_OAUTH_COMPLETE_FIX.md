# Complete Fix: Google OAuth Not Working

## Issues Found from Screenshots

### Issue 1: Google OAuth Provider is DISABLED ⚠️ CRITICAL

In your Supabase Dashboard screenshot:
- The **"Enable Sign in with Google"** toggle is **OFF** (gray)
- This prevents Google OAuth from working at all

### Issue 2: Redirect URL Configuration

Your configuration looks correct, but Supabase might be overriding the redirectTo parameter.

## Complete Fix Steps

### Step 1: Enable Google OAuth in Supabase (CRITICAL)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `ezhcfemzrbfsfkafqsav`
3. Navigate to **Authentication** → **Providers** → **Google**
4. **Toggle the "Enable Sign in with Google" switch to ON** (it should turn blue/green)
5. Verify settings:
   - **Client IDs**: `161230976386-q99dtviv0910v7sadohcb5rjr13bkbpg.apps.googleusercontent.com`
   - **Client Secret (for OAuth)**: Should be filled (the one created on Dec 28, 2025)
   - **Callback URL**: `https://ezhcfemzrbfsfkafqsav.supabase.co/auth/v1/callback` (auto-generated, don't change)
6. The changes should auto-save, or click **Save** if available

### Step 2: Verify Supabase URL Configuration

Your URL Configuration looks correct, but double-check:

1. Go to **Authentication** → **URL Configuration**
2. **Site URL** should be: `https://stavky.vercel.app` ✅ (you have this correct)
3. **Redirect URLs** should include:
   - `https://stavky.vercel.app/auth/callback` ✅ (you have this)
   - `https://*.vercel.app/auth/callback` ✅ (you have this)

**Important**: Make sure there are NO URLs with:
- ❌ `/v1/callback` (this is Supabase's internal endpoint)
- ❌ Locale prefixes like `/en/`, `/cs/`, `/sk/`

### Step 3: Verify Google Cloud Console

Your Google Cloud Console looks correct:
- ✅ Supabase callback: `https://ezhcfemzrbfsfkafqsav.supabase.co/auth/v1/callback`
- ✅ App callback: `https://stavky.vercel.app/auth/callback`

**Note about Client Secrets**: You have 2 secrets enabled. Once OAuth works, identify which one Supabase is using and disable/delete the other for security.

### Step 4: Test the Fix

1. **Wait 2-3 minutes** after enabling Google OAuth in Supabase
2. **Clear browser cache and cookies** completely
3. Go to: `https://stavky.vercel.app/en/login`
4. Click "Sign in with Google"
5. **Expected flow**:
   - Redirects to Google OAuth page ✅
   - After authentication, redirects to: `https://stavky.vercel.app/auth/callback?code=...&locale=en` ✅
   - User is logged in and redirected to dashboard ✅

## If Still Redirecting to `/en/auth/v1/callback`

If after enabling Google OAuth you still get redirected to `/en/auth/v1/callback`:

### Additional Fix: Check Supabase Project Settings

1. In Supabase Dashboard, go to **Settings** → **General**
2. Check **Reference ID**: Should be `ezhcfemzrbfsfkafqsav`
3. Verify this matches your `NEXT_PUBLIC_SUPABASE_URL` environment variable in Vercel

### Verify Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `stavky`
3. Go to **Settings** → **Environment Variables**
4. Verify:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://ezhcfemzrbfsfkafqsav.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your anon key)
5. If any are wrong, update and **redeploy**

### Clear Supabase Cache

Sometimes Supabase caches redirect URL configurations:

1. After making changes in Supabase Dashboard
2. Wait **5-10 minutes** (not just 1-2 minutes)
3. Clear browser cache completely
4. Try OAuth login again

## Debugging Steps

If it's still not working after enabling:

1. **Check browser console** (F12 → Console tab):
   - Look for any errors when clicking "Sign in with Google"
   - Check Network tab for the OAuth request

2. **Check Supabase logs**:
   - Go to Supabase Dashboard → **Logs** → **Auth Logs**
   - Look for OAuth-related errors

3. **Verify the redirectTo being sent**:
   - In browser DevTools → Network tab
   - Click "Sign in with Google"
   - Find the request to Supabase
   - Check the `redirect_to` parameter
   - Should be: `https://stavky.vercel.app/auth/callback?locale=en`

4. **Test with a simple redirectTo**:
   - Temporarily change the code to use just: `https://stavky.vercel.app/auth/callback` (no query params)
   - See if Supabase respects it
   - If yes, the issue is with query parameters
   - If no, the issue is with Supabase Dashboard configuration

## Verification Checklist

- [ ] Google OAuth provider toggle is **ON** in Supabase Dashboard
- [ ] Client ID in Supabase matches Google Cloud Console exactly
- [ ] Client Secret in Supabase matches Google Cloud Console (the Dec 28 one)
- [ ] Site URL is `https://stavky.vercel.app` (no locale, no trailing slash)
- [ ] Redirect URLs include `https://stavky.vercel.app/auth/callback` (exact match)
- [ ] Redirect URLs do NOT include `/v1/callback` or locale prefixes
- [ ] Google Cloud Console has Supabase callback URI
- [ ] Vercel environment variables are correct
- [ ] Waited 5-10 minutes after making changes
- [ ] Cleared browser cache completely
- [ ] Tested OAuth login

## Most Likely Cause

Based on your screenshots, the **primary issue** is that **Google OAuth is disabled** in Supabase Dashboard. Enable it first, then test. If you still get the wrong redirect URL, it's a Supabase caching/configuration issue that should resolve after waiting longer.

## Related Documentation

- [Google OAuth Enable Fix](GOOGLE_OAUTH_ENABLE_FIX.md)
- [Supabase Redirect Override Fix](SUPABASE_REDIRECT_OVERRIDE_FIX.md)
- [Production Google OAuth Fix](PRODUCTION_GOOGLE_OAUTH_FIX.md)





