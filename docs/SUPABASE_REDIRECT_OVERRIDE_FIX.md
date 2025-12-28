# Fix: Supabase Overriding redirectTo to `/en/auth/v1/callback`

## Problem

Even after setting correct redirect URLs in Supabase Dashboard, Supabase is still redirecting to:
```
https://stavky.vercel.app/en/auth/v1/callback?code=...&locale=en
```

Instead of the expected:
```
https://stavky.vercel.app/auth/callback?code=...&locale=en
```

## Root Cause

Supabase is **overriding** the `redirectTo` parameter you send in code. This happens when:

1. **Site URL in Supabase Dashboard includes locale prefix** (e.g., `https://stavky.vercel.app/en`)
2. **Redirect URLs in Supabase Dashboard are incorrect or missing**
3. **Supabase is using Site URL + default path** instead of your redirectTo

## Solution

### Step 1: Fix Supabase Dashboard Site URL (CRITICAL)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your **PRODUCTION** project
3. Navigate to **Authentication** → **URL Configuration**
4. Check **Site URL** field

**MUST BE**:
```
https://stavky.vercel.app
```

**MUST NOT BE**:
- ❌ `https://stavky.vercel.app/en`
- ❌ `http://localhost:3000`
- ❌ `https://stavky.vercel.app/en/`
- ❌ Any URL with locale prefix

5. Click **Save**

### Step 2: Fix Redirect URLs (CRITICAL)

In the same page, scroll to **Redirect URLs**:

**Remove ALL of these** (if present):
- ❌ `https://stavky.vercel.app/en/auth/callback`
- ❌ `https://stavky.vercel.app/en/auth/v1/callback`
- ❌ `https://stavky.vercel.app/auth/v1/callback`
- ❌ `http://localhost:3000/auth/callback`
- ❌ `http://localhost:3000/en/auth/callback`

**Add ONLY these**:
- ✅ `https://stavky.vercel.app/auth/callback`
- ✅ `https://*.vercel.app/auth/callback` (for preview deployments)

**Important**:
- Do NOT include `/v1/` in the path
- Do NOT include locale prefixes (`/en/`, `/cs/`, `/sk/`)
- The path must be exactly `/auth/callback`

6. Click **Save**

### Step 3: Verify Google OAuth Provider Settings

1. In Supabase Dashboard, go to **Authentication** → **Providers** → **Google**
2. Check the **Redirect URL** shown (this is read-only, auto-generated):
   - Should be: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - This is correct - this is Supabase's internal endpoint
3. Verify **Client ID** and **Client Secret** are correct (actual values, not env vars)

### Step 4: Clear Supabase Cache

After making changes:
1. **Wait 2-3 minutes** (Supabase needs time to propagate changes)
2. **Clear browser cache and cookies** completely
3. Try OAuth login again

### Step 5: Verify the Fix

1. Go to: `https://stavky.vercel.app/en/login`
2. Click "Sign in with Google"
3. After Google authentication, check the redirect URL in browser address bar
4. **Expected**: `https://stavky.vercel.app/auth/callback?code=...&locale=en`
5. **NOT**: `https://stavky.vercel.app/en/auth/v1/callback?code=...`

## Why This Happens

Supabase validates all `redirectTo` URLs against its Dashboard settings. If:

1. Your `redirectTo` doesn't match any URL in the Redirect URLs list
2. Site URL is set incorrectly (e.g., with locale prefix)
3. Supabase can't validate the redirect URL

Then Supabase will:
- Use the Site URL as base
- Append a default path (often `/auth/v1/callback`)
- This results in the wrong redirect URL

## Debugging

If the issue persists, check what redirectTo is being sent:

1. Open browser DevTools → Network tab
2. Go to login page
3. Click "Sign in with Google"
4. Look for the OAuth request to Supabase
5. Check the `redirect_to` parameter in the request
6. It should be: `https://stavky.vercel.app/auth/callback?locale=en`

If it's different, the issue is in your code. If it's correct but Supabase still redirects wrong, the issue is in Supabase Dashboard configuration.

## Common Mistakes

### ❌ Site URL with locale prefix
```
Site URL: https://stavky.vercel.app/en  ❌ WRONG
```
Supabase will use this as base and append paths, causing `/en/auth/v1/callback`

### ✅ Site URL without locale prefix
```
Site URL: https://stavky.vercel.app  ✅ CORRECT
```

### ❌ Redirect URLs with `/v1/`
```
Redirect URL: https://stavky.vercel.app/auth/v1/callback  ❌ WRONG
```
This is Supabase's internal endpoint, not your app's

### ✅ Redirect URLs without `/v1/`
```
Redirect URL: https://stavky.vercel.app/auth/callback  ✅ CORRECT
```

### ❌ Redirect URLs with locale prefix
```
Redirect URL: https://stavky.vercel.app/en/auth/callback  ❌ WRONG
```
Supabase will try to match this exactly, but your code sends URL without locale prefix

### ✅ Redirect URLs without locale prefix
```
Redirect URL: https://stavky.vercel.app/auth/callback  ✅ CORRECT
```
Locale is handled via query parameter (`?locale=en`), not path

## Verification Checklist

- [ ] Site URL is `https://stavky.vercel.app` (no locale, no trailing slash)
- [ ] Redirect URLs includes `https://stavky.vercel.app/auth/callback` (exact match)
- [ ] Redirect URLs does NOT include `/v1/` anywhere
- [ ] Redirect URLs does NOT include locale prefixes (`/en/`, `/cs/`, `/sk/`)
- [ ] Google OAuth provider has correct Client ID and Secret
- [ ] Waited 2-3 minutes after making changes
- [ ] Cleared browser cache completely
- [ ] Tested OAuth login and verified redirect URL is correct

## Still Not Working?

If you've verified all the above and it's still redirecting to `/en/auth/v1/callback`:

1. **Double-check you're editing the PRODUCTION project** in Supabase Dashboard
   - Not local, staging, or a different project
   - Check the project URL matches your `NEXT_PUBLIC_SUPABASE_URL` env var

2. **Check for multiple Supabase projects**
   - Make sure you're not accidentally configuring a different project
   - Verify the project reference ID matches

3. **Contact Supabase Support**
   - If all configuration is correct but still not working
   - Provide them with:
     - Your project reference ID
     - The exact redirect URL you're sending
     - The exact redirect URL Supabase is using

## Related Documentation

- [Supabase Redirect URL Fix](SUPABASE_REDIRECT_URL_FIX.md)
- [Production Google OAuth Fix](PRODUCTION_GOOGLE_OAUTH_FIX.md)

