# Fix: Google OAuth "invalid_request" Error

## Problem

The error shows:
```
redirect_uri: env(GOOGLE_REDIRECT_URL)
client_id: env(GOOGLE_CLIENT_ID)
```

Google is receiving literal strings instead of actual values, causing the OAuth flow to fail.

## Root Cause

The `supabase/config.toml` file is configured for **local Supabase development only**. When using **Supabase Cloud (production)**, OAuth providers must be configured directly in the Supabase Dashboard, not through the config file.

## Solution: Configure Google OAuth in Supabase Dashboard

### Step 1: Get Your Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one)
3. Go to **APIs & Services** → **Credentials**
4. Find or create an **OAuth 2.0 Client ID**
5. Copy:
   - **Client ID** (e.g., `123456789-abc.apps.googleusercontent.com`)
   - **Client Secret** (e.g., `GOCSPX-xxxxx`)

### Step 2: Configure Authorized Redirect URIs in Google

1. In Google Cloud Console → **Credentials** → Your OAuth Client
2. Under **Authorized redirect URIs**, add:
   - For local development: `http://localhost:54321/auth/v1/callback`
   - For production: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - Replace `YOUR_PROJECT_REF` with your Supabase project reference ID

### Step 3: Configure Google OAuth in Supabase Dashboard

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Find **Google** in the list
5. Click **Enable** or **Edit**
6. Fill in:
   - **Client ID (for OAuth)**: Paste your Google Client ID
   - **Client Secret (for OAuth)**: Paste your Google Client Secret
7. Click **Save**

### Step 4: Verify Redirect URI

The redirect URI in Supabase should be:
```
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

This is automatically set by Supabase - you don't need to configure it manually in the dashboard.

### Step 5: Update Your Application

Your application code is already correct. The `signInWithOAuth` call should use:

```typescript
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`
  }
})
```

**Important**: The `redirectTo` in your app code is where Supabase redirects **after** handling the OAuth callback. This is different from the Google OAuth redirect URI.

## Understanding the Flow

1. **User clicks "Sign in with Google"**
   - Your app calls `signInWithOAuth`
   - Supabase redirects to: `https://accounts.google.com/...`

2. **User authenticates with Google**
   - Google redirects back to: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - This is the **Google OAuth redirect URI** (configured in Google Cloud Console)

3. **Supabase handles the OAuth callback**
   - Supabase exchanges the code for tokens
   - Supabase redirects to: `YOUR_APP_URL/auth/callback`
   - This is the **Supabase redirect URI** (set in `redirectTo` option)

4. **Your app handles the final callback**
   - Your `/auth/callback` route exchanges the code for a session
   - User is logged in

## Common Mistakes

### ❌ Wrong: Configuring only in config.toml
- `config.toml` only works for local Supabase
- Production Supabase ignores `config.toml` OAuth settings

### ✅ Correct: Configure in Supabase Dashboard
- Production Supabase uses Dashboard settings
- `config.toml` is only for local development

### ❌ Wrong: Using app redirect URI in Google Console
- Don't use `http://localhost:3000/auth/callback` in Google Console
- Use Supabase's callback: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

### ✅ Correct: Two different redirect URIs
- **Google Console**: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
- **App code**: `http://localhost:3000/auth/callback` (or your production URL)

## Verification Checklist

- [ ] Google OAuth Client ID and Secret are set in Supabase Dashboard
- [ ] Google OAuth is enabled in Supabase Dashboard
- [ ] Authorized redirect URI in Google Console matches: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
- [ ] Your app's `redirectTo` points to: `${window.location.origin}/auth/callback`
- [ ] Test the OAuth flow - it should work now!

## Reference

- [Supabase OAuth Providers Documentation](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0 Setup](https://developers.google.com/identity/protocols/oauth2)









