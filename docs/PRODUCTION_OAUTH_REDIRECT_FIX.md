# Production OAuth Redirect Fix - Documentation

## Problem

After Google OAuth login in production, users are being redirected to `http://localhost:3000/sk?code=...` instead of the production URL. This happens because:

1. **Supabase Dashboard Site URL** is set to `http://localhost:3000` in the production project
2. **Supabase validates redirect URLs** against its dashboard configuration and may override the `redirectTo` parameter
3. **Environment variables** might contain localhost values in Vercel production settings

**Critical**: Even if your code correctly uses `window.location.origin`, Supabase will validate the redirect URL against its dashboard settings. If the production URL is not in the allowed list, Supabase may fall back to the Site URL (which might be localhost).

## Code Changes Made

The following code changes have been implemented to ensure the redirect URL always uses the current origin:

### File: `components/providers/auth-provider.tsx`

The `signInWithProvider` function now:
- Always uses `window.location.origin` to build the callback URL
- Replaces the hostname from environment variables with the current origin
- Ensures the redirect URL matches the current environment (production or local)

**Key Change**: The callback URL is now dynamically built based on `window.location.origin`, which will be:
- `http://localhost:3000` in local development
- `https://your-production-domain.com` in production

## Additional Configuration Required

### 1. Supabase Dashboard Configuration (CRITICAL - Most Likely Cause)

**This is the most common cause of the localhost redirect issue.** Supabase validates all redirect URLs against its dashboard configuration. If your production URL is not in the allowed list, Supabase will use the Site URL (which might be localhost).

#### Steps:

1. **Go to Supabase Dashboard**:
   - Navigate to: https://supabase.com/dashboard
   - **IMPORTANT**: Select your **PRODUCTION** project (not local/staging)

2. **Open Authentication Settings**:
   - Go to: **Authentication** → **URL Configuration**

3. **Configure Site URL (CRITICAL)**:
   - Set **Site URL** to your production domain:
     ```
     https://your-production-domain.com
     ```
   - **DO NOT** use `http://localhost:3000` in production
   - This is the default redirect URL Supabase uses if validation fails
   - **This is likely the root cause** - if Site URL is localhost, users will be redirected there

4. **Configure Redirect URLs (REQUIRED)**:
   - In the **Redirect URLs** section, add your production URLs:
     ```
     https://your-production-domain.com/auth/callback
     https://your-production-domain.vercel.app/auth/callback
     https://*.vercel.app/auth/callback
     ```
   - **IMPORTANT**: The exact URL must match what your code sends (including `/auth/callback` path)
   - Keep `http://localhost:3000/auth/callback` ONLY if you need it for local development
   - **Remove** `http://localhost:3000` from production project settings

5. **Verify Google OAuth Provider Settings**:
   - Go to: **Authentication** → **Providers** → **Google**
   - Ensure the redirect URI shown matches your Supabase callback:
     ```
     https://xxxxx.supabase.co/auth/v1/callback
     ```
   - This is different from your app's callback URL

6. **Save Changes**:
   - Click **Save** to apply the changes
   - **Wait 1-2 minutes** for changes to propagate

### 2. Vercel Environment Variables

Ensure the following environment variables are set correctly in Vercel:

#### Required Variables:

1. **`NEXT_PUBLIC_AUTH_CALLBACK_URL`** (Optional but recommended):
   - **Production**: `https://your-production-domain.com/auth/callback`
   - **Preview**: `https://your-preview-branch.vercel.app/auth/callback`
   - **Note**: If not set, the code will use `window.location.origin/auth/callback` automatically

2. **`NEXT_PUBLIC_SUPABASE_URL`**:
   - Your Supabase project URL
   - Example: `https://xxxxx.supabase.co`

3. **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**:
   - Your Supabase anonymous key

#### Steps to Set Environment Variables in Vercel:

1. **Go to Vercel Dashboard**:
   - Navigate to: https://vercel.com/dashboard
   - Select your project

2. **Open Settings**:
   - Click on **Settings** → **Environment Variables**

3. **Add/Update Variables**:
   - For each variable:
     - Click **Add New**
     - Enter the variable name
     - Enter the value
     - Select environments: **Production**, **Preview**, and/or **Development**
     - Click **Save**

4. **Redeploy**:
   - After adding/updating variables, trigger a new deployment:
     - Go to **Deployments**
     - Click **Redeploy** on the latest deployment
     - Or push a new commit to trigger automatic deployment

### 3. Google Cloud Console Configuration

Ensure Google OAuth redirect URIs are configured correctly for production.

#### Steps:

1. **Go to Google Cloud Console**:
   - Navigate to: https://console.cloud.google.com
   - Select your project

2. **Open OAuth Credentials**:
   - Go to: **APIs & Services** → **Credentials**
   - Find your OAuth 2.0 Client ID

3. **Configure Authorized Redirect URIs**:
   - Click **Edit** on your OAuth client
   - In **Authorized redirect URIs**, add:
     ```
     https://your-production-domain.com/auth/callback
     https://your-production-domain.vercel.app/auth/callback
     ```
   - **Important**: For Supabase OAuth, you should also have:
     ```
     https://xxxxx.supabase.co/auth/v1/callback
     ```
   - Keep `http://localhost:3000/auth/callback` for local development

4. **Save Changes**:
   - Click **Save** to apply changes

### 4. Verify Configuration

After making all the above changes, verify the configuration:

#### Checklist:

- [ ] Supabase Dashboard has production redirect URLs configured
- [ ] Supabase Site URL is set to production domain
- [ ] Vercel environment variables are set correctly
- [ ] Google Cloud Console has production redirect URIs
- [ ] Application has been redeployed after environment variable changes

## Testing

### Local Testing:

1. Start local development server:
   ```bash
   npm run dev
   ```

2. Test Google OAuth login:
   - Navigate to `http://localhost:3000/sk/login`
   - Click "Sign in with Google"
   - Verify redirect goes to `http://localhost:3000/auth/callback?code=...&locale=sk`
   - Verify final redirect goes to `http://localhost:3000/sk/bettings`

### Production Testing:

1. Deploy to production (or use preview deployment)

2. Test Google OAuth login:
   - Navigate to `https://your-production-domain.com/sk/login`
   - Click "Sign in with Google"
   - Verify redirect goes to `https://your-production-domain.com/auth/callback?code=...&locale=sk`
   - Verify final redirect goes to `https://your-production-domain.com/sk/bettings`

3. **Important**: If you see `localhost` in the redirect URL:
   - Check Supabase Dashboard redirect URLs
   - Check Vercel environment variables
   - Verify the code is using `window.location.origin` (check browser console)

## Troubleshooting

### Issue: Still redirecting to localhost in production

**This is the most common issue. Follow these steps in order:**

**Step 1: Check Supabase Dashboard Site URL (MOST LIKELY CAUSE)**
1. Go to Supabase Dashboard → Your Production Project
2. Navigate to: **Authentication** → **URL Configuration**
3. Check the **Site URL** field
4. **If it says `http://localhost:3000`**, this is your problem!
5. Change it to: `https://your-production-domain.com`
6. Save and wait 1-2 minutes

**Step 2: Verify Redirect URLs List**
1. In the same page, check **Redirect URLs**
2. Ensure your production URL is listed: `https://your-production-domain.com/auth/callback`
3. Remove `http://localhost:3000/auth/callback` if it's there
4. Save changes

**Step 3: Check Vercel Environment Variables**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Check if `NEXT_PUBLIC_AUTH_CALLBACK_URL` is set
3. **If it contains `localhost`**, either:
   - Remove it (recommended - code will use `window.location.origin`)
   - Or change it to your production URL
4. Redeploy after changing environment variables

**Step 4: Verify Code is Using Correct URL**
1. Open browser console in production
2. Look for `[Auth] OAuth redirect URL:` log message (in development)
3. In production, check Network tab → OAuth request → see what `redirectTo` parameter is sent
4. Verify it's the production URL, not localhost

**Step 5: Clear Browser Cache**
1. Clear browser cookies and cache
2. Try OAuth login again
3. Check if issue persists

**Step 6: Verify Correct Supabase Project**
1. Ensure you're configuring the **production** Supabase project
2. Not a local/staging/test project
3. Check the project URL matches your `NEXT_PUBLIC_SUPABASE_URL` environment variable

### Issue: Redirect URL mismatch error from Google

**Possible Causes**:
1. Google Cloud Console doesn't have the production redirect URI
2. Redirect URI doesn't exactly match (including protocol, domain, path)

**Solutions**:
1. Add exact redirect URI to Google Cloud Console
2. Ensure protocol is `https://` (not `http://`) for production
3. Ensure path is exactly `/auth/callback` (no trailing slash)

### Issue: Supabase redirect URL not in allowed list

**Error**: "redirect_uri is not allowed"

**Solutions**:
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add the exact redirect URL to the **Redirect URLs** list
3. Ensure the URL matches exactly (including protocol and path)
4. Save and wait a few minutes for changes to propagate

## Related Files

- `[components/providers/auth-provider.tsx](components/providers/auth-provider.tsx)` - OAuth redirect URL logic
- `[app/auth/callback/route.ts](app/auth/callback/route.ts)` - OAuth callback handler
- `[docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md)` - Vercel deployment guide
- `[docs/SUPABASE_GOOGLE_OAUTH_FIX.md](docs/SUPABASE_GOOGLE_OAUTH_FIX.md)` - Supabase OAuth configuration

## Summary

### Code Changes Made

The code has been updated to:
- **Always use `window.location.origin`** to build the redirect URL (no dependency on environment variables)
- **Add production detection** to prevent localhost URLs in production
- **Add validation and logging** to help debug redirect URL issues
- **Simplify logic** to remove dependency on `NEXT_PUBLIC_AUTH_CALLBACK_URL` environment variable

### Configuration Required

**CRITICAL**: Even with correct code, Supabase validates redirect URLs against its dashboard settings. You MUST configure:

1. **Supabase Dashboard Site URL** (MOST IMPORTANT):
   - Set to your production domain: `https://your-production-domain.com`
   - **NOT** `http://localhost:3000`
   - This is likely the root cause of your issue

2. **Supabase Dashboard Redirect URLs**:
   - Add: `https://your-production-domain.com/auth/callback`
   - Remove localhost from production project

3. **Vercel Environment Variables** (Optional):
   - Remove `NEXT_PUBLIC_AUTH_CALLBACK_URL` if it contains localhost
   - Or set it to production URL (code will still use `window.location.origin`)

4. **Google Cloud Console**:
   - Add production redirect URIs

### Verification Steps

After making changes:
1. Wait 1-2 minutes for Supabase changes to propagate
2. Redeploy your Vercel application
3. Clear browser cache and cookies
4. Test OAuth login in production
5. Check browser console/network tab to verify redirect URL is production, not localhost

**If still redirecting to localhost**: The Supabase Dashboard Site URL is almost certainly set to localhost. Check and fix that first.
