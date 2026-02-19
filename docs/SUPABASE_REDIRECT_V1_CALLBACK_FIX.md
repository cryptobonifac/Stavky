# Fix: Supabase Redirecting to `/en/auth/v1/callback` Instead of `/auth/callback`

## Problem

Even with Google OAuth enabled and correct configuration, Supabase redirects to:
```
https://stavky.vercel.app/en/auth/v1/callback?code=...&locale=en
```

Instead of:
```
https://stavky.vercel.app/auth/callback?code=...&locale=en
```

## Root Cause Analysis

The `/v1/callback` path is **Supabase's internal OAuth callback endpoint**, not your app's callback. This suggests:

1. **Supabase is not recognizing your `redirectTo` parameter**
2. **Supabase is falling back to a default redirect mechanism**
3. **The redirect URL might not be matching the allowed list exactly**

## Solution: Add Locale-Prefixed URLs to Supabase Redirect URLs

Since Supabase seems to be constructing URLs with locale prefixes, add them to the allowed list as a workaround:

### Step 1: Update Supabase Redirect URLs

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `ezhcfemzrbfsfkafqsav`
3. Navigate to **Authentication** → **URL Configuration**
4. In **Redirect URLs**, add these URLs (in addition to existing ones):
   - `https://stavky.vercel.app/en/auth/callback`
   - `https://stavky.vercel.app/cs/auth/callback`
   - `https://stavky.vercel.app/sk/auth/callback`
   - `https://*.vercel.app/en/auth/callback` (for preview deployments)
   - `https://*.vercel.app/cs/auth/callback`
   - `https://*.vercel.app/sk/auth/callback`

5. **Keep existing URLs**:
   - `https://stavky.vercel.app/auth/callback` ✅
   - `https://*.vercel.app/auth/callback` ✅

6. Click **Save**

### Step 2: Verify Site URL

Ensure **Site URL** is still:
```
https://stavky.vercel.app
```
(No locale prefix, no trailing slash)

### Step 3: Debug What redirectTo is Being Sent

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Go to: `https://stavky.vercel.app/en/login`
4. Click "Sign in with Google"
5. Look for the log message: `[Auth] OAuth redirect URL being sent to Supabase:`
6. **Expected**: `https://stavky.vercel.app/auth/callback?locale=en`
7. **If different**: The issue is in the code

### Step 4: Check Network Request

1. In DevTools, go to **Network** tab
2. Click "Sign in with Google"
3. Look for the request to Supabase (usually to `/auth/v1/authorize`)
4. Check the `redirect_to` parameter in the request URL
5. **Expected**: `https://stavky.vercel.app/auth/callback?locale=en`

### Step 5: Wait and Test

1. **Wait 5-10 minutes** after adding redirect URLs (Supabase can be slow to propagate)
2. **Clear browser cache and cookies completely**
3. Test OAuth login again

## Alternative Solution: Remove Query Parameters from redirectTo

If adding locale-prefixed URLs doesn't work, try removing the `locale` query parameter from the redirectTo and handle it differently:

### Option A: Use Path-Based Locale in redirectTo

Modify the code to include locale in the path instead of query parameter:

```typescript
// Instead of: https://stavky.vercel.app/auth/callback?locale=en
// Use: https://stavky.vercel.app/en/auth/callback
const callbackUrl = new URL(`${currentOrigin}/${locale}/auth/callback`)
```

Then add these to Supabase Redirect URLs:
- `https://stavky.vercel.app/en/auth/callback`
- `https://stavky.vercel.app/cs/auth/callback`
- `https://stavky.vercel.app/sk/auth/callback`

### Option B: Handle Locale After Redirect

Remove locale from redirectTo and extract it from the referer or session:

1. Remove `callbackUrl.searchParams.set('locale', locale)`
2. In `/auth/callback` route, extract locale from referer header (already implemented)
3. This way redirectTo is simpler: `https://stavky.vercel.app/auth/callback`

## Why `/v1/callback` Appears

The `/v1/callback` path suggests Supabase is:
1. Not matching your `redirectTo` against allowed URLs
2. Using its internal callback endpoint instead
3. Constructing a redirect URL based on Site URL + some default path

This can happen when:
- The `redirectTo` URL doesn't exactly match an allowed URL
- Query parameters cause a mismatch
- Supabase has a bug or caching issue

## Verification Checklist

- [ ] Added locale-prefixed URLs to Supabase Redirect URLs
- [ ] Site URL is `https://stavky.vercel.app` (no locale)
- [ ] Checked browser console for the redirectTo being sent
- [ ] Checked Network tab for the actual request to Supabase
- [ ] Waited 5-10 minutes after making changes
- [ ] Cleared browser cache completely
- [ ] Tested OAuth login

## If Still Not Working

If after adding locale-prefixed URLs it still redirects to `/en/auth/v1/callback`:

1. **Check Supabase Logs**:
   - Go to Supabase Dashboard → **Logs** → **Auth Logs**
   - Look for OAuth-related errors or warnings
   - Check what redirect URL Supabase is using

2. **Try Without Query Parameters**:
   - Temporarily remove `?locale=en` from redirectTo
   - See if Supabase respects the simpler URL
   - If yes, handle locale extraction in the callback route

3. **Contact Supabase Support**:
   - This might be a Supabase bug
   - Provide them with:
     - Your project reference ID
     - The exact redirectTo you're sending
     - The exact redirect URL Supabase is using
     - Screenshots of your URL Configuration

## Related Documentation

- [Supabase Redirect Override Fix](SUPABASE_REDIRECT_OVERRIDE_FIX.md)
- [Google OAuth Complete Fix](GOOGLE_OAUTH_COMPLETE_FIX.md)





