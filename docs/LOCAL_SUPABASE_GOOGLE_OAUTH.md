# Google OAuth Setup for Local Supabase

## Overview

For local Supabase development, Google OAuth is configured in `supabase/config.toml` using environment variables. The redirect URI must point to **Supabase's local auth endpoint**, not your app's callback.

## Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one)
3. Navigate to **APIs & Services** → **Credentials**
4. Create or select an **OAuth 2.0 Client ID**
5. Copy:
   - **Client ID** (e.g., `123456789-abc.apps.googleusercontent.com`)
   - **Client Secret** (e.g., `GOCSPX-xxxxx`)

## Step 2: Configure Google Console Redirect URI

1. In Google Cloud Console → **Credentials** → Your OAuth Client
2. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:54321/auth/v1/callback
   ```
   **Important**: This is Supabase's local auth endpoint, not your app's callback URL.

3. Click **Save**

## Step 3: Set Environment Variables for Local Supabase

Local Supabase reads environment variables from your shell environment. You need to set:

- `GOOGLE_CLIENT_ID` - Your Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Your Google OAuth Client Secret  
- `GOOGLE_REDIRECT_URL` - Must be `http://localhost:54321/auth/v1/callback`

### Option 1: Set in PowerShell (Windows)

```powershell
# Set environment variables for current session
$env:GOOGLE_CLIENT_ID = "your-google-client-id"
$env:GOOGLE_CLIENT_SECRET = "your-google-client-secret"
$env:GOOGLE_REDIRECT_URL = "http://localhost:54321/auth/v1/callback"
```

### Option 2: Create a `.env.local` file for Supabase

Create a file `supabase/.env.local` (this file is gitignored):

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URL=http://localhost:54321/auth/v1/callback
```

Then load it before starting Supabase:

```powershell
# Load environment variables from file
Get-Content supabase\.env.local | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$') {
        [Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
    }
}
```

### Option 3: Use Supabase CLI with .env file

Supabase CLI can read from a `.env` file in the project root. Create `.env` in the project root:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URL=http://localhost:54321/auth/v1/callback
```

## Step 4: Verify config.toml

Your `supabase/config.toml` should have:

```toml
[auth.external.google]
enabled = true
client_id = "env(GOOGLE_CLIENT_ID)"
secret = "env(GOOGLE_CLIENT_SECRET)"
redirect_uri = "env(GOOGLE_REDIRECT_URL)"
```

## Step 5: Start Local Supabase

```bash
# Make sure environment variables are set first
supabase start
```

Verify the output shows Google OAuth is configured correctly.

## Step 6: Update Your App's .env.local

Your Next.js app needs to know about the local Supabase instance. In your project root `.env.local`:

```env
# Local Supabase
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<get-from-supabase-start-output>

# Your app callback (different from Supabase redirect URI)
NEXT_PUBLIC_AUTH_CALLBACK_URL=http://localhost:3000/auth/callback
```

**Important**: 
- `NEXT_PUBLIC_SUPABASE_URL` should be `http://localhost:54321` (local Supabase)
- `NEXT_PUBLIC_AUTH_CALLBACK_URL` is your app's callback (`http://localhost:3000/auth/callback`)

## Step 7: Test the OAuth Flow

1. Start local Supabase: `supabase start`
2. Start your Next.js app: `npm run dev`
3. Go to `http://localhost:3000`
4. Click "Sign in with Google"
5. You should be redirected to Google OAuth
6. After authentication, you should be redirected back to your app

## Understanding the Flow (Local)

```
1. User clicks "Sign in with Google"
   ↓
2. Your app calls: supabase.auth.signInWithOAuth({ provider: 'google' })
   ↓
3. Local Supabase (localhost:54321) redirects to: https://accounts.google.com/...
   ↓
4. User authenticates with Google
   ↓
5. Google redirects to: http://localhost:54321/auth/v1/callback
   (This is GOOGLE_REDIRECT_URL - Supabase's local auth endpoint)
   ↓
6. Local Supabase handles the OAuth callback
   ↓
7. Local Supabase redirects to: http://localhost:3000/auth/callback?code=...
   (This is redirectTo in your app code - your app's callback)
   ↓
8. Your app's /auth/callback route exchanges code for session
   ↓
9. User is logged in and redirected to dashboard
```

## Troubleshooting

### Issue: Still seeing `env(GOOGLE_CLIENT_ID)` error

**Solution**: Environment variables aren't being read by Supabase CLI.

1. Verify variables are set:
   ```powershell
   echo $env:GOOGLE_CLIENT_ID
   echo $env:GOOGLE_CLIENT_SECRET
   echo $env:GOOGLE_REDIRECT_URL
   ```

2. Restart Supabase after setting variables:
   ```bash
   supabase stop
   supabase start
   ```

### Issue: "redirect_uri_mismatch" error

**Solution**: The redirect URI in Google Console doesn't match.

- Must be exactly: `http://localhost:54321/auth/v1/callback`
- Check for typos, extra slashes, or http vs https

### Issue: Supabase can't read environment variables

**Solution**: Use explicit environment variable passing:

```bash
# Windows PowerShell
$env:GOOGLE_CLIENT_ID="your-id"; $env:GOOGLE_CLIENT_SECRET="your-secret"; $env:GOOGLE_REDIRECT_URL="http://localhost:54321/auth/v1/callback"; supabase start
```

Or create a startup script.

## Quick Reference

| Setting | Value (Local) |
|---------|---------------|
| **Google Console Redirect URI** | `http://localhost:54321/auth/v1/callback` |
| **GOOGLE_REDIRECT_URL env var** | `http://localhost:54321/auth/v1/callback` |
| **NEXT_PUBLIC_SUPABASE_URL** | `http://localhost:54321` |
| **NEXT_PUBLIC_AUTH_CALLBACK_URL** | `http://localhost:3000/auth/callback` |

## Next Steps

Once local OAuth is working:
1. Test the complete flow
2. Verify user creation and role assignment
3. Then configure for production Supabase (Dashboard settings)

