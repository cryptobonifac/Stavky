# Fix: Supabase Redirecting to `/en/auth/v1/callback` (404 Error)

## Problem

After Google OAuth login, Supabase redirects to:
```
https://stavky.vercel.app/en/auth/v1/callback?code=...
```

This URL returns 404 because:
1. `/auth/v1/callback` is Supabase's **internal** endpoint, not your app's
2. Your app's callback is at `/auth/callback` (without `/v1`)
3. The locale prefix `/en/` shouldn't be in the callback URL

## Root Cause

Supabase Dashboard **Redirect URLs** configuration is incorrect. Supabase is using the wrong redirect URL after handling OAuth.

## Solution

### Step 1: Fix Supabase Dashboard Redirect URLs

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your **PRODUCTION** project
3. Navigate to **Authentication** → **URL Configuration**
4. Scroll to **Redirect URLs** section

#### Remove Incorrect URLs

Remove any of these if present:
- ❌ `https://stavky.vercel.app/auth/v1/callback`
- ❌ `https://stavky.vercel.app/en/auth/callback`
- ❌ `https://stavky.vercel.app/en/auth/v1/callback`
- ❌ `http://localhost:3000/auth/v1/callback`

#### Add Correct URLs

Add **exactly** these URLs:
- ✅ `https://stavky.vercel.app/auth/callback`
- ✅ `https://*.vercel.app/auth/callback` (for preview deployments)

**Important Notes**:
- Use `/auth/callback` (NOT `/auth/v1/callback`)
- Do NOT include locale prefix (`/en/`, `/cs/`, `/sk/`) in redirect URLs
- The callback route handles locale via query parameter (`?locale=en`)

### Step 2: Verify Site URL

1. In the same page, check **Site URL**:
   - Should be: `https://stavky.vercel.app`
   - **NOT** `http://localhost:3000`
   - **NOT** `https://stavky.vercel.app/en`

2. Click **Save**

### Step 3: Wait and Test

1. **Wait 1-2 minutes** for changes to propagate
2. **Clear browser cache and cookies**
3. Test OAuth login:
   - Go to: `https://stavky.vercel.app/en/login`
   - Click "Sign in with Google"
   - **Expected**: After Google auth, redirects to `https://stavky.vercel.app/auth/callback?code=...&locale=en`
   - **NOT**: `https://stavky.vercel.app/en/auth/v1/callback`

## Understanding the OAuth Flow

```
1. User clicks "Sign in with Google"
   ↓
2. App calls: supabase.auth.signInWithOAuth({
     provider: 'google',
     options: {
       redirectTo: 'https://stavky.vercel.app/auth/callback?locale=en'
     }
   })
   ↓
3. Supabase redirects to: https://accounts.google.com/...
   ↓
4. User authenticates with Google
   ↓
5. Google redirects to: https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   (This is Supabase's internal endpoint - configured in Google Cloud Console)
   ↓
6. Supabase handles OAuth callback internally
   ↓
7. Supabase redirects to: https://stavky.vercel.app/auth/callback?code=...&locale=en
   (This is your app's callback - configured in Supabase Dashboard Redirect URLs)
   ↓
8. Your app's /auth/callback route handles the code
   ↓
9. User is logged in and redirected to dashboard
```

## Key Points

- **Google Cloud Console** redirect URI: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback` (Supabase's endpoint)
- **Supabase Dashboard** redirect URL: `https://stavky.vercel.app/auth/callback` (Your app's endpoint)
- **Your app code** redirectTo: `https://stavky.vercel.app/auth/callback?locale=en` (Your app's endpoint with locale)

## Verification Checklist

- [ ] Supabase Dashboard Redirect URLs includes: `https://stavky.vercel.app/auth/callback`
- [ ] Supabase Dashboard Redirect URLs does NOT include `/auth/v1/callback`
- [ ] Supabase Dashboard Redirect URLs does NOT include locale prefixes (`/en/`, `/cs/`, `/sk/`)
- [ ] Supabase Dashboard Site URL is: `https://stavky.vercel.app` (no locale prefix)
- [ ] Google Cloud Console has: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
- [ ] Waited 1-2 minutes after making changes
- [ ] Cleared browser cache
- [ ] Tested OAuth login

## Common Mistakes

### ❌ Wrong: Including `/v1/callback` in app redirect URLs
- Supabase Dashboard should have: `https://stavky.vercel.app/auth/callback`
- **NOT**: `https://stavky.vercel.app/auth/v1/callback`

### ❌ Wrong: Including locale prefix in redirect URLs
- Supabase Dashboard should have: `https://stavky.vercel.app/auth/callback`
- **NOT**: `https://stavky.vercel.app/en/auth/callback`
- Locale is handled via query parameter, not path

### ❌ Wrong: Using localhost in production
- Production Supabase project should have production URLs
- Remove `http://localhost:3000` from production project settings

## Related Documentation

- [Production Google OAuth Fix](PRODUCTION_GOOGLE_OAUTH_FIX.md)
- [Production OAuth Redirect Fix](PRODUCTION_OAUTH_REDIRECT_FIX.md)





