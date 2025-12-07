# Quick Start: Google OAuth with Local Supabase

## The Problem

You're seeing this error because Supabase isn't reading the Google OAuth environment variables. The variables must be set **before** starting Supabase.

## Quick Fix (Windows PowerShell)

### Option 1: Use the Setup Script (Recommended)

**Prerequisites**: Make sure your `.env.local` file contains:
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Then run:
```powershell
.\scripts\start-supabase-with-oauth.ps1
```

This script will:
1. Load environment variables from `.env.local`
2. Stop Supabase if running
3. Set all required environment variables
4. Start Supabase with OAuth configured

### Option 2: Manual Setup

1. **Stop Supabase** (if running):
   ```powershell
   supabase stop
   ```

2. **Set environment variables**:
   ```powershell
   $env:GOOGLE_CLIENT_ID = "your-google-client-id"
   $env:GOOGLE_CLIENT_SECRET = "your-google-client-secret"
   $env:GOOGLE_REDIRECT_URL = "http://localhost:54321/auth/v1/callback"
   ```

3. **Start Supabase**:
   ```powershell
   supabase start
   ```

4. **Verify**:
   ```powershell
   supabase status
   ```
   You should NOT see warnings about `GOOGLE_CLIENT_ID` being unset.

## Google Console Configuration

**Critical**: In Google Cloud Console, add this redirect URI:

```
http://localhost:54321/auth/v1/callback
```

**NOT** `http://localhost:3000/auth/callback` - that's your app's callback, not Supabase's.

## Verify It's Working

After starting Supabase with the environment variables:

1. Check Supabase status - no warnings about Google OAuth
2. Try signing in with Google in your app
3. You should be redirected to Google (not see the error page)

## Common Issues

### Issue: Still seeing `env(GOOGLE_CLIENT_ID)` error

**Solution**: 
- Make sure you set the variables **before** running `supabase start`
- If Supabase was already running, you must stop and restart it
- Keep the terminal open - closing it loses the environment variables

### Issue: "redirect_uri_mismatch" in Google

**Solution**: 
- The redirect URI in Google Console must be exactly: `http://localhost:54321/auth/v1/callback`
- Check for typos, http vs https, trailing slashes

### Issue: Environment variables lost after closing terminal

**Solution**: 
- This is normal - PowerShell environment variables are session-specific
- Run the setup script again - it will automatically reload from `.env.local`
- The script reads from `.env.local` each time, so you don't need to manually set variables

## Environment Variables Reference

| Variable | Value (Local) |
|----------|---------------|
| `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth Client Secret |
| `GOOGLE_REDIRECT_URL` | `http://localhost:54321/auth/v1/callback` |

## Next Steps

Once local OAuth is working:
1. Test the complete authentication flow
2. Verify user creation works
3. Then configure for production Supabase (Dashboard settings)

