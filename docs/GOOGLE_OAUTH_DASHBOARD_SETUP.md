# Google OAuth Setup in Supabase Dashboard

## Critical Issue

The error shows Google is receiving:
- `redirect_uri: env(GOOGLE_REDIRECT_URL)` (literal string)
- `client_id: env(GOOGLE_CLIENT_ID)` (literal string)

This means Supabase is trying to use `config.toml` settings, which **only work for local development**. For production (Supabase Cloud), you **must** configure OAuth in the Dashboard.

## Step-by-Step Fix

### Step 1: Get Your Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one)
3. Navigate to **APIs & Services** → **Credentials**
4. Find or create an **OAuth 2.0 Client ID**
5. Copy:
   - **Client ID** (e.g., `123456789-abc.apps.googleusercontent.com`)
   - **Client Secret** (e.g., `GOCSPX-xxxxx`)

### Step 2: Configure Authorized Redirect URIs in Google

1. In Google Cloud Console → **Credentials** → Click on your OAuth Client
2. Under **Authorized redirect URIs**, add:
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
   Replace `YOUR_PROJECT_REF` with your Supabase project reference ID.

   **To find your project reference:**
   - Go to Supabase Dashboard → Your Project → Settings → General
   - Look for "Reference ID" (it's a short string like `abcdefghijklmnop`)

3. Click **Save**

### Step 3: Configure Google OAuth in Supabase Dashboard

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your **production project** (not local)
3. Navigate to **Authentication** → **Providers**
4. Scroll down to find **Google**
5. Click **Enable** or the edit icon (pencil)
6. Fill in the form:
   - **Client ID (for OAuth)**: Paste your Google Client ID
   - **Client Secret (for OAuth)**: Paste your Google Client Secret
7. **Important**: Leave **Redirect URL** empty or use the default (Supabase handles this automatically)
8. Click **Save**

### Step 4: Verify Configuration

After saving, the Google provider should show:
- ✅ **Enabled**: Yes
- **Client ID**: Your actual client ID (not `env(GOOGLE_CLIENT_ID)`)
- **Redirect URL**: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

### Step 5: Test the OAuth Flow

1. Go to your application
2. Click "Sign in with Google"
3. You should be redirected to Google's OAuth page (not an error page)
4. After authentication, you should be redirected back to your app

## Common Mistakes

### ❌ Mistake 1: Only configuring in config.toml
- `config.toml` only works for **local Supabase** (`supabase start`)
- **Production Supabase** ignores `config.toml` OAuth settings
- **Solution**: Configure in Dashboard for production

### ❌ Mistake 2: Wrong redirect URI in Google Console
- Don't use: `http://localhost:3000/auth/callback`
- Don't use: `https://your-app.vercel.app/auth/callback`
- **Use**: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

### ❌ Mistake 3: Using app redirect URL in Supabase
- The **Redirect URL** field in Supabase Dashboard should be left empty or use the default
- Supabase automatically uses: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
- Your app's `redirectTo` in code is different - that's where Supabase redirects **after** handling OAuth

## Understanding the Flow

```
1. User clicks "Sign in with Google"
   ↓
2. Your app calls: supabase.auth.signInWithOAuth({ provider: 'google' })
   ↓
3. Supabase redirects to: https://accounts.google.com/...
   ↓
4. User authenticates with Google
   ↓
5. Google redirects to: https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   (This is the redirect URI configured in Google Console)
   ↓
6. Supabase handles the OAuth callback
   ↓
7. Supabase redirects to: YOUR_APP_URL/auth/callback?code=...
   (This is the redirectTo in your app code)
   ↓
8. Your app's /auth/callback route exchanges code for session
   ↓
9. User is logged in and redirected to dashboard
```

## Verification Checklist

- [ ] Google OAuth Client ID and Secret are set in **Supabase Dashboard** (not just config.toml)
- [ ] Google OAuth is **Enabled** in Supabase Dashboard
- [ ] Authorized redirect URI in Google Console is: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
- [ ] Your Supabase project reference ID is correct
- [ ] You're testing on the **production** Supabase project (not local)
- [ ] The error no longer shows `env(GOOGLE_CLIENT_ID)` - it should show your actual client ID

## Still Getting the Error?

If you still see `env(GOOGLE_CLIENT_ID)` in the error:

1. **Double-check**: Are you configuring in the **correct Supabase project**?
   - Make sure you're in your **production** project, not a different one
   - Check the project URL matches your app's `NEXT_PUBLIC_SUPABASE_URL`

2. **Clear cache**: Sometimes Supabase caches settings
   - Wait a few minutes after saving
   - Try again

3. **Verify in Dashboard**: 
   - Go to Authentication → Providers → Google
   - Verify the Client ID shows your actual ID (not `env(GOOGLE_CLIENT_ID)`)
   - If it still shows the placeholder, the Dashboard configuration didn't save properly

4. **Check project reference**:
   - Your `NEXT_PUBLIC_SUPABASE_URL` should be: `https://YOUR_PROJECT_REF.supabase.co`
   - The redirect URI in Google Console must match: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

## Reference Links

- [Supabase OAuth Providers Documentation](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0 Setup Guide](https://developers.google.com/identity/protocols/oauth2)
- [Google OAuth Security Policies](https://developers.google.com/identity/protocols/oauth2/policies#secure-response-handling)











