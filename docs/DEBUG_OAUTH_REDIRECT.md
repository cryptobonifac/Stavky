# Debug OAuth Redirect Issue

## Current Problem

Supabase is redirecting to:
```
https://stavky.vercel.app/en/auth/v1/callback?code=...&locale=en
```

Instead of:
```
https://stavky.vercel.app/auth/callback?code=...&locale=en
```

## Debugging Steps

### Step 1: Check Browser Console

After deploying the updated code:

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Navigate to: `https://stavky.vercel.app/en/login`
4. Click "Sign in with Google"
5. Look for log messages starting with `[Auth] OAuth Configuration:`
6. **Check**: What does "Redirect URL being sent to Supabase" show?
   - Should be: `https://stavky.vercel.app/auth/callback`
   - If different, that's the issue

### Step 2: Check Network Request

1. In DevTools, go to **Network** tab
2. Click "Sign in with Google"
3. Look for a request to Supabase (usually to `/auth/v1/authorize`)
4. Click on that request
5. Go to **Payload** or **Query String Parameters** tab
6. **Check**: What is the `redirect_to` parameter?
   - Should be: `https://stavky.vercel.app/auth/callback`
   - If different, Supabase is modifying it

### Step 3: Check Supabase Logs

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `ezhcfemzrbfsfkafqsav`
3. Navigate to **Logs** → **Auth Logs**
4. Look for recent OAuth attempts
5. **Check**: What redirect URL is Supabase using?
6. Look for any errors or warnings

### Step 4: Verify Supabase Configuration One More Time

Double-check these exact settings:

#### URL Configuration
- **Site URL**: `https://stavky.vercel.app` (exact, no trailing slash, no locale)
- **Redirect URLs**:
  - `https://stavky.vercel.app/auth/callback` (exact match, no trailing slash)
  - `https://*.vercel.app/auth/callback` (for previews)

#### Google Provider
- **Enabled**: ON (green/blue toggle)
- **Client ID**: `161230976386-q99dtviv0910v7sadohcb5rjr13bkbpg.apps.googleusercontent.com`
- **Client Secret**: (filled, not empty)

## Possible Root Causes

### 1. Supabase Caching Issue
- Supabase might be caching old redirect URL configuration
- **Solution**: Wait 10-15 minutes, clear browser cache, try again

### 2. redirectTo Parameter Being Ignored
- Supabase might not be recognizing the redirectTo parameter
- **Solution**: Check if the URL in Network request matches what we're sending

### 3. Site URL Being Used as Base
- Supabase might be using Site URL + default path
- **Solution**: Ensure Site URL is exactly `https://stavky.vercel.app` (no locale)

### 4. Middleware Interference
- Next.js middleware might be modifying the redirect
- **Solution**: Check if `/auth/callback` is properly excluded from middleware

### 5. Supabase Bug
- This could be a Supabase platform bug
- **Solution**: Contact Supabase support with:
  - Project reference ID: `ezhcfemzrbfsfkafqsav`
  - The exact redirectTo being sent
  - The exact redirect URL Supabase is using
  - Screenshots of URL Configuration

## Alternative Workaround: Handle `/en/auth/v1/callback`

If Supabase continues to redirect to `/en/auth/v1/callback`, we could create a route handler that redirects from there to the correct callback:

### Option 1: Create Redirect Route

Create `app/[locale]/auth/v1/callback/route.ts` that redirects to `/auth/callback`:

```typescript
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  // Extract code and other params
  const code = url.searchParams.get('code')
  const locale = url.pathname.match(/^\/(en|cs|sk)/)?.[1] || 'en'
  
  // Redirect to the correct callback URL
  const redirectUrl = new URL(`/auth/callback`, url.origin)
  redirectUrl.searchParams.set('code', code || '')
  if (locale) redirectUrl.searchParams.set('locale', locale)
  
  // Copy all other query params
  url.searchParams.forEach((value, key) => {
    if (key !== 'code' && key !== 'locale') {
      redirectUrl.searchParams.set(key, value)
    }
  })
  
  return NextResponse.redirect(redirectUrl)
}
```

This would catch the wrong redirect and fix it.

## Next Steps

1. **Deploy the updated code** with enhanced logging
2. **Check browser console** for the debug logs
3. **Check Network tab** for the actual request
4. **Share the logs** so we can see what's actually being sent
5. If logs show correct URL but Supabase still redirects wrong, it's a Supabase configuration or bug issue

