# Fix: Local Google OAuth "redirect_uri=env(GOOGLE_REDIRECT_URL)" Error

## Problem

You're seeing this error:
```
Error 400: invalid_request
redirect_uri=env(GOOGLE_REDIRECT_URL)
```

This means Supabase is trying to use the literal string `env(GOOGLE_REDIRECT_URL)` instead of the actual redirect URL.

## Solution

The `redirect_uri` in `config.toml` has been hardcoded to `http://localhost:54321/auth/v1/callback` for local development. However, you still need to set the Google OAuth credentials.

### Step 1: Set Environment Variables

**Before starting Supabase**, set these environment variables in PowerShell:

```powershell
$env:GOOGLE_CLIENT_ID = "your-google-client-id-here"
$env:GOOGLE_CLIENT_SECRET = "your-google-client-secret-here"
```

**OR** use the setup script (recommended):

```powershell
.\scripts\start-supabase-with-oauth.ps1
```

This script will:
- Load variables from `.env.local`
- Set all required environment variables
- Start Supabase

### Step 2: Verify Google Console Configuration

In Google Cloud Console → Credentials → Your OAuth Client:

**Authorized redirect URIs** must include:
```
http://localhost:54321/auth/v1/callback
```

**Important:** This is Supabase's local auth endpoint, NOT your app's callback URL.

### Step 3: Start Supabase

After setting environment variables:

```powershell
supabase start
```

### Step 4: Verify

Check that Supabase started without warnings:

```powershell
supabase status
```

You should **NOT** see:
- ❌ `WARN: environment variable is unset: GOOGLE_CLIENT_ID`
- ❌ `WARN: environment variable is unset: GOOGLE_CLIENT_SECRET`

You **should** see:
- ✅ Supabase is running
- ✅ No warnings about Google OAuth

## Quick Reference

### Environment Variables Needed

| Variable | Value |
|----------|-------|
| `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth Client Secret |

### Redirect URI

- **In config.toml**: `http://localhost:54321/auth/v1/callback` (now hardcoded)
- **In Google Console**: Must match exactly: `http://localhost:54321/auth/v1/callback`

## Common Issues

### Issue: Still seeing `env(GOOGLE_REDIRECT_URL)` error

**Solution:**
- The redirect URI is now hardcoded in `config.toml` ✅
- Make sure you set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` before starting Supabase
- If Supabase was already running, stop it and restart after setting variables

### Issue: Environment variables lost after closing terminal

**Solution:**
- This is normal - PowerShell environment variables are session-specific
- Use the setup script: `.\scripts\start-supabase-with-oauth.ps1`
- Or set variables each time before starting Supabase

### Issue: "redirect_uri_mismatch" in Google

**Solution:**
- Verify in Google Console: `http://localhost:54321/auth/v1/callback`
- Check for typos, http vs https, trailing slashes
- Must match exactly

## What Was Fixed

1. ✅ Hardcoded `redirect_uri` in `config.toml` to `http://localhost:54321/auth/v1/callback`
2. ✅ Fixed TOML syntax error in `project_id` line

## Next Steps

1. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` environment variables
2. Start Supabase: `supabase start`
3. Verify no warnings appear
4. Test Google OAuth sign-in in your app

