# Production OAuth Redirect Fix

## Problem

After Google login in production, users are being redirected to `http://localhost:3000/sk?code=...` instead of the production URL. This happens because the redirect URL is hardcoded or misconfigured.

## Code Changes (Already Implemented)

The code has been updated in `components/providers/auth-provider.tsx` to always use `window.location.origin` for the callback URL, ensuring it works correctly in both development and production environments.

## Additional Configuration Steps Required

### Step 1: Update Supabase Dashboard Redirect URLs

1. **Go to Supabase Dashboard**:
   - Navigate to: https://supabase.com/dashboard
   - Select your production project

2. **Open Authentication Settings**:
   - Go to: **Authentication** → **URL Configuration**
   - Or: **Settings** → **Auth** → **URL Configuration**

3. **Update Redirect URLs**:
   - In the **Redirect URLs** section, add your production URLs:
     ```
     https://your-production-domain.com/auth/callback
     https://your-production-domain.vercel.app/auth/callback
     ```
   - If you have a custom domain, add:
     ```
     https://your-custom-domain.com/auth/callback
     ```
   - **Important**: Keep `http://localhost:3000/auth/callback` only if you need local development
   - **Remove** any incorrect localhost URLs that shouldn't be in production

4. **Update Site URL**:
   - Set **Site URL** to your production domain:
     ```
     https://your-production-domain.com
     ```
   - Or: `https://your-production-domain.vercel.app`

5. **Save Changes**:
   - Click **Save** to apply the changes

### Step 2: Configure Vercel Environment Variables

1. **Go to Vercel Dashboard**:
   - Navigate to: https://vercel.com/dashboard
   - Select your project

2. **Open Environment Variables**:
   - Go to: **Settings** → **Environment Variables**

3. **Update `NEXT_PUBLIC_AUTH_CALLBACK_URL`**:
   - **For Production**:
     ```
     https://your-production-domain.com/auth/callback
     ```
   - **For Preview** (optional):
     ```
     https://your-project.vercel.app/auth/callback
     ```
   - **Important**: Do NOT use `http://localhost:3000/auth/callback` in production environment variables

4. **Verify Other Environment Variables**:
   - Ensure `NEXT_PUBLIC_SUPABASE_URL` points to your production Supabase project
   - Ensure `NEXT_PUBLIC_SUPABASE_ANON_KEY` is your production anon key
   - Ensure `SUPABASE_SERVICE_ROLE_KEY` is your production service role key

5. **Redeploy**:
   - After updating environment variables, trigger a new deployment
   - Or wait for the next automatic deployment

### Step 3: Update Google Cloud Console (If Needed)

If Google OAuth is still redirecting to localhost, check Google Cloud Console:

1. **Go to Google Cloud Console**:
   - Navigate to: https://console.cloud.google.com
   - Select your project

2. **Open OAuth 2.0 Client IDs**:
   - Go to: **APIs & Services** → **Credentials**
   - Find your OAuth 2.0 Client ID

3. **Update Authorized Redirect URIs**:
   - Add your production Supabase redirect URI:
     ```
     https://your-supabase-project.supabase.co/auth/v1/callback
     ```
   - **Note**: This is Supabase's callback URL, not your app's callback URL
   - Supabase handles the OAuth flow and then redirects to your app

4. **Save Changes**:
   - Click **Save** to apply

### Step 4: Verify Supabase OAuth Provider Configuration

1. **Go to Supabase Dashboard**:
   - Navigate to: **Authentication** → **Providers**

2. **Check Google Provider**:
   - Ensure Google provider is enabled
   - Verify the **Client ID** and **Client Secret** are correct
   - The redirect URI in Supabase should be:
     ```
     https://your-supabase-project.supabase.co/auth/v1/callback
     ```
   - This is automatically configured by Supabase

3. **Check Additional Redirect URLs**:
   - In **Authentication** → **URL Configuration**
   - Verify **Additional Redirect URLs** includes:
     ```
     https://your-production-domain.com/auth/callback
     ```

## Testing Steps

### Test in Production

1. **Clear Browser Cache**:
   - Clear cookies and cache for your production domain
   - Or use an incognito/private window

2. **Test Google Login**:
   - Navigate to your production site
   - Click "Sign in with Google"
   - Complete the OAuth flow
   - **Expected**: Should redirect to `https://your-production-domain.com/sk/bettings` (or appropriate page)
   - **Not Expected**: Should NOT redirect to `http://localhost:3000`

3. **Verify Session**:
   - After login, check that you're authenticated
   - Navigate to protected routes
   - Verify user profile is loaded

### Test Locally

1. **Verify Local Environment**:
   - Ensure `.env.local` has:
     ```
     NEXT_PUBLIC_AUTH_CALLBACK_URL=http://localhost:3000/auth/callback
     ```

2. **Test Local Login**:
   - Start dev server: `npm run dev`
   - Test Google login
   - Should redirect to `http://localhost:3000/sk/bettings`

## Troubleshooting

### Issue: Still redirecting to localhost in production

**Possible Causes**:
1. Environment variables not updated in Vercel
2. Supabase redirect URLs not updated
3. Browser cache/cookies
4. Old deployment still running

**Solutions**:
1. Verify Vercel environment variables are set correctly
2. Check Supabase Dashboard redirect URLs
3. Clear browser cache and cookies
4. Trigger a new deployment in Vercel
5. Check Vercel deployment logs for environment variable issues

### Issue: Redirect URL mismatch error

**Error**: `redirect_uri_mismatch`

**Solution**:
1. Verify the redirect URL in Supabase Dashboard matches exactly
2. Check for trailing slashes or protocol mismatches (http vs https)
3. Ensure the URL is in the allowed list in Supabase

### Issue: Code changes not taking effect

**Solution**:
1. Verify the code changes are deployed
2. Check Vercel deployment logs
3. Clear browser cache
4. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

## Environment Variable Reference

### Production (Vercel)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
NEXT_PUBLIC_AUTH_CALLBACK_URL=https://your-production-domain.com/auth/callback
```

### Development (Local)

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-local-service-role-key
NEXT_PUBLIC_AUTH_CALLBACK_URL=http://localhost:3000/auth/callback
```

## Related Files

- `[components/providers/auth-provider.tsx](components/providers/auth-provider.tsx)` - OAuth redirect URL logic
- `[app/auth/callback/route.ts](app/auth/callback/route.ts)` - OAuth callback handler
- `[docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md)` - Vercel deployment guide
- `[docs/SUPABASE_GOOGLE_OAUTH_FIX.md](docs/SUPABASE_GOOGLE_OAUTH_FIX.md)` - Supabase OAuth configuration

## Summary

The code has been fixed to always use the current origin. However, you must also:

1. ✅ **Update Supabase Dashboard** - Add production redirect URLs
2. ✅ **Update Vercel Environment Variables** - Set production callback URL
3. ✅ **Verify Google Cloud Console** - Ensure redirect URIs are correct
4. ✅ **Test in Production** - Verify the fix works

After completing these steps, OAuth should work correctly in production, redirecting users to the production domain instead of localhost.

