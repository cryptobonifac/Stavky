# Google OAuth Login - Localhost Setup

## Configuration Overview

This project uses Google OAuth for authentication via Supabase Auth. The configuration uses **environment variables** stored in `.env` file, which are read by `supabase/config.toml`.

## File Structure

### 1. `.env` - Google OAuth Credentials (MAIN CONFIG)
**Location:** `/.env`

This is the **primary file** to update when Google OAuth credentials change:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=161230976386-q99dtviv09l0v7sadohcb5rjr13bkbpg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URL=http://127.0.0.1:54321/auth/v1/callback
```

**🔑 If Google credentials change:**
1. Update the values in `.env` file
2. Restart Supabase: `npx supabase stop && npx supabase start`
3. No need to change `config.toml` - it automatically reads from `.env`

### 2. `supabase/config.toml` - Supabase Configuration
**Location:** `/supabase/config.toml` (Lines 287-300)

This file reads credentials from environment variables:

```toml
[auth.external.google]
enabled = true
# Google OAuth credentials - stored in .env file for security
client_id = "env(GOOGLE_CLIENT_ID)"
secret = "env(GOOGLE_CLIENT_SECRET)"
# Overrides the default auth redirectUrl
redirect_uri = "env(GOOGLE_REDIRECT_URL)"
# If enabled, the nonce check will be skipped. Required for local sign in with Google auth.
skip_nonce_check = true
```

**⚠️ DO NOT hardcode credentials here** - always use `env(VARIABLE_NAME)` syntax.

### 3. `.env.local` - Next.js Environment Variables
**Location:** `/.env.local`

Contains Next.js-specific configuration (Supabase URL, keys, etc.):

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GOOGLE_CLIENT_ID=161230976386-q99dtviv09l0v7sadohcb5rjr13bkbpg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URL=http://127.0.0.1:54321/auth/v1/callback
```

**Note:** Google OAuth variables are duplicated here for Next.js usage, but Supabase reads from `.env`.

## Google Cloud Console Configuration

### Getting Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your project
3. Click on your OAuth 2.0 Client ID

### Required Settings

**Application Type:**
- Must be: **"Web application"**

**Authorized JavaScript origins:**
```
http://localhost:3000
http://127.0.0.1:3000
```

**Authorized redirect URIs (CRITICAL):**
```
http://localhost:54321/auth/v1/callback
http://127.0.0.1:54321/auth/v1/callback
```

**❌ Common Mistakes:**
- DO NOT add `http://localhost:3000/auth/callback` (this is wrong - causes `invalid_client` error)
- DO NOT add `http://127.0.0.1:3000/...` (wrong port)
- Google redirects to **Supabase** (port 54321), NOT to Next.js (port 3000)

### OAuth Consent Screen

1. Go to [OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent)
2. If in **"Testing"** mode:
   - Click **"ADD USERS"** under "Test users"
   - Add your Google email address
   - Click **"SAVE"**
3. Or switch to **"Production"** mode (for unrestricted access)

**⏱️ Propagation Time:**
- Changes can take **5 minutes to a few hours** to take effect
- Wait 10-15 minutes after making changes before testing

## OAuth Flow

1. User clicks "Sign in with Google" on Next.js app (`http://localhost:3000` or `http://127.0.0.1:3000`)
2. Next.js redirects to Supabase Auth → `http://127.0.0.1:54321/auth/v1/authorize?provider=google`
3. Supabase redirects to Google OAuth
4. **Google redirects to Supabase callback** → `http://127.0.0.1:54321/auth/v1/callback` (NOT to Next.js)
5. Supabase exchanges authorization code with Google for user session
6. Supabase redirects to Next.js callback → `http://localhost:3000/auth/callback` with code
7. Next.js exchanges code for session (via `app/auth/callback/route.ts`)

## How to Update Google OAuth Credentials

### Scenario 1: Client Secret or Client ID Changed

1. **Update `.env` file:**
   ```env
   GOOGLE_CLIENT_ID=<new-client-id>
   GOOGLE_CLIENT_SECRET=<new-client-secret>
   ```

2. **Update `.env.local` file** (for Next.js):
   ```env
   GOOGLE_CLIENT_ID=<new-client-id>
   GOOGLE_CLIENT_SECRET=<new-client-secret>
   ```

3. **Restart Supabase:**
   ```bash
   npx supabase stop && npx supabase start
   ```

4. **Restart Next.js dev server** (if running)

### Scenario 2: Changed Redirect URI

1. **Update `.env` file:**
   ```env
   GOOGLE_REDIRECT_URL=<new-redirect-uri>
   ```

2. **Update Google Console:**
   - Add the new redirect URI to "Authorized redirect URIs"
   - Click **"SAVE"**
   - Wait 10-15 minutes for propagation

3. **Restart Supabase:**
   ```bash
   npx supabase stop && npx supabase start
   ```

## Troubleshooting

### Error: `oauth2: "invalid_client" "Unauthorized"`

**Causes:**
1. Wrong Client ID or Secret in `.env`
2. Redirect URI mismatch between `.env` and Google Console
3. Using `localhost` vs `127.0.0.1` inconsistently
4. Google Console changes not yet propagated (wait 10-15 minutes)
5. User not added to Test users list (if in Testing mode)
6. Wrong Application Type (must be "Web application")

**Solution:**
1. Verify credentials in `.env` match Google Console exactly
2. Ensure both `localhost` AND `127.0.0.1` redirect URIs are in Google Console
3. Check user is added to Test users (if in Testing mode)
4. Wait 10-15 minutes after making changes in Google Console
5. Restart Supabase after any `.env` changes

### Error: `missing_code` or `unexpected_failure`

**Causes:**
1. Supabase not running
2. Wrong redirect URI configured
3. Network/firewall blocking localhost:54321

**Solution:**
1. Check Supabase is running: `npx supabase status`
2. Verify redirect URI in `.env` is `http://127.0.0.1:54321/auth/v1/callback`
3. Check browser console for errors

## Quick Reference

| What to Update | File to Edit | Restart Required |
|---------------|--------------|------------------|
| Google Client ID | `.env` + `.env.local` | Supabase + Next.js |
| Google Client Secret | `.env` + `.env.local` | Supabase + Next.js |
| Redirect URI | `.env` + Google Console | Supabase |
| Test Users | Google Console OAuth Consent Screen | No |
| JavaScript Origins | Google Console | No |

## Related Files
- `supabase/config.toml` - Reads credentials from `.env` using `env()` syntax
- `.env` - **Main configuration file** for Supabase (Google OAuth credentials)
- `.env.local` - Next.js environment variables (duplicates Google OAuth for client-side)
- `app/auth/callback/route.ts` - Handles OAuth callback from Supabase
