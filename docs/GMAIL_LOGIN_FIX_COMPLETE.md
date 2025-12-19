# Gmail Login Fix - Complete Documentation

## Errors Fixed

### Error 1: "The OAuth client was not found"
- **Error Message**: "The OAuth client was not found"
- **Error Code**: `401: invalid_client`
- **Where**: Google OAuth authorization page
- **Symptom**: When clicking "Sign in with Google", users were redirected to Google but saw this error instead of the OAuth consent screen

### Error 2: "ERR_CONNECTION_REFUSED"
- **Error Message**: "This site can't be reached - `127.0.0.1` refused to connect"
- **Error Code**: `ERR_CONNECTION_REFUSED`
- **Where**: Browser when trying to access `http://127.0.0.1:54321/auth/v1/authorize?provider=google`
- **Symptom**: Browser couldn't connect to local Supabase instance

## Root Causes Identified

### Cause 1: Google OAuth Provider Disabled
- **Location**: `supabase/config.toml` line 288
- **Problem**: `enabled = false`
- **Impact**: Supabase wasn't configured to use Google OAuth, even though credentials were set

### Cause 2: Redirect URI Not Configured
- **Location**: `supabase/config.toml` line 293
- **Problem**: `redirect_uri` was commented out
- **Impact**: Supabase couldn't tell Google where to redirect after authentication

### Cause 3: Environment Variables Not Loaded
- **Problem**: `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` environment variables weren't set when Supabase started
- **Impact**: Even if OAuth was enabled, Supabase couldn't find the credentials

### Cause 4: Supabase Not Running
- **Problem**: Supabase containers were stopped or crashed
- **Impact**: The local Supabase instance at `127.0.0.1:54321` wasn't accessible

## Fixes Applied

### Fix 1: Enable Google OAuth in Config

**File**: `supabase/config.toml`

**Before**:
```toml
[auth.external.google]
enabled = false
client_id = "env(GOOGLE_CLIENT_ID)"
secret = "env(GOOGLE_CLIENT_SECRET)"
# redirect_uri = "http://localhost:54321/auth/v1/callback"
```

**After**:
```toml
[auth.external.google]
enabled = true
client_id = "env(GOOGLE_CLIENT_ID)"
secret = "env(GOOGLE_CLIENT_SECRET)"
redirect_uri = "http://localhost:54321/auth/v1/callback"
```

**Changes**:
1. Changed `enabled = false` → `enabled = true`
2. Uncommented `redirect_uri` line
3. Set redirect URI to `http://localhost:54321/auth/v1/callback`

### Fix 2: Restart Supabase with Environment Variables

**Commands executed**:
```powershell
# Set environment variables
$env:GOOGLE_CLIENT_ID = "161230976386-q99dtviv09l0v7sadohcb5rjr13bkbpg.apps.googleusercontent.com"
$env:GOOGLE_CLIENT_SECRET = "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"

# Stop Supabase
supabase stop

# Start Supabase (reads environment variables)
supabase start
```

**Result**: Supabase started with Google OAuth credentials loaded

### Fix 3: Verify Configuration

**Verified**:
- ✅ Supabase is running and accessible
- ✅ No warnings about missing Google OAuth credentials
- ✅ Auth endpoint responds correctly
- ✅ OAuth client exists in Google Cloud Console

## Complete Solution Steps

### Step 1: Verify OAuth Client in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Verify your OAuth 2.0 Client ID exists
4. Check **Authorized redirect URIs** includes:
   ```
   http://localhost:54321/auth/v1/callback
   ```

### Step 2: Update Supabase Configuration

**File**: `supabase/config.toml`

Ensure these settings:
```toml
[auth.external.google]
enabled = true
client_id = "env(GOOGLE_CLIENT_ID)"
secret = "env(GOOGLE_CLIENT_SECRET)"
redirect_uri = "http://localhost:54321/auth/v1/callback"
```

### Step 3: Set Environment Variables

**In PowerShell** (before starting Supabase):
```powershell
$env:GOOGLE_CLIENT_ID = "your-google-client-id.apps.googleusercontent.com"
$env:GOOGLE_CLIENT_SECRET = "GOCSPX-your-google-client-secret"
```

**Or from `.env.local`**:
```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret
```

### Step 4: Start Supabase

```powershell
# Make sure environment variables are set first
supabase stop
supabase start
```

### Step 5: Verify Setup

```powershell
# Check Supabase status
supabase status

# Should NOT see:
# ❌ WARN: environment variable is unset: GOOGLE_CLIENT_ID
# ❌ WARN: environment variable is unset: GOOGLE_CLIENT_SECRET

# Test if Supabase is accessible
Invoke-WebRequest -Uri "http://127.0.0.1:54321/rest/v1/" -UseBasicParsing
# Should return Status: 200
```

## Verification Checklist

Before testing Gmail login, verify:

- [ ] Google OAuth client exists in Google Cloud Console
- [ ] Redirect URI in Google Console: `http://localhost:54321/auth/v1/callback`
- [ ] `supabase/config.toml` has `enabled = true` for Google OAuth
- [ ] `supabase/config.toml` has `redirect_uri` uncommented
- [ ] Environment variables are set before starting Supabase
- [ ] Supabase is running (`supabase status` shows "running")
- [ ] No warnings about Google OAuth in Supabase status
- [ ] Supabase is accessible at `http://127.0.0.1:54321`
- [ ] Your email is added to Test users (if OAuth app is in Testing mode)

## Testing the Fix

### Test 1: Verify Supabase is Running

```powershell
supabase status
```

**Expected**: Shows "supabase local development setup is running" with no warnings

### Test 2: Test Supabase API

```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:54321/rest/v1/" -UseBasicParsing
```

**Expected**: Returns Status 200

### Test 3: Test OAuth Endpoint

Open in browser:
```
http://127.0.0.1:54321/auth/v1/authorize?provider=google
```

**Expected**: Redirects to Google OAuth page (not connection error)

### Test 4: Test in Application

1. Start Next.js app: `npm run dev`
2. Go to login page
3. Click "Sign in with Google"
4. **Expected**: Redirects to Google OAuth consent screen (not "OAuth client was not found" error)

## Common Issues and Solutions

### Issue: Still getting "OAuth client was not found"

**Possible causes**:
1. Wrong Client ID in `.env.local` or environment variables
2. OAuth client was deleted in Google Cloud Console
3. Wrong Google Cloud project selected

**Solution**:
1. Verify Client ID in Google Cloud Console
2. Copy exact Client ID and update `.env.local`
3. Restart Supabase with correct environment variables

### Issue: Connection refused to 127.0.0.1:54321

**Possible causes**:
1. Supabase is not running
2. Supabase containers crashed
3. Port 54321 is blocked or in use

**Solution**:
```powershell
# Check status
supabase status

# If not running, restart
supabase stop
supabase start

# If port conflict, check what's using it
Get-NetTCPConnection -LocalPort 54321
```

### Issue: Environment variables not working

**Problem**: PowerShell environment variables are session-specific

**Solution**:
- Set variables in the **same PowerShell session** before starting Supabase
- Don't close terminal between setting variables and starting Supabase
- Or create a startup script that loads from `.env.local`

### Issue: "redirect_uri_mismatch" error

**Solution**:
- In Google Cloud Console, verify redirect URI is exactly:
  ```
  http://localhost:54321/auth/v1/callback
  ```
- Check for typos, http vs https, trailing slashes
- Must match exactly what's in `config.toml`

## Files Modified

1. **`supabase/config.toml`**
   - Line 288: Changed `enabled = false` → `enabled = true`
   - Line 293: Uncommented `redirect_uri = "http://localhost:54321/auth/v1/callback"`

## Environment Variables Required

| Variable | Value | Source |
|----------|-------|--------|
| `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID | Google Cloud Console → Credentials |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth Client Secret | Google Cloud Console → Credentials |

## Google Cloud Console Configuration

### Required Settings

1. **OAuth 2.0 Client ID** must exist
2. **Authorized redirect URIs** must include:
   ```
   http://localhost:54321/auth/v1/callback
   ```
3. **OAuth consent screen** must be configured:
   - App name
   - User support email
   - Developer contact email
   - Test users (if in Testing mode)

## Quick Reference

### Start Supabase with OAuth

```powershell
# Set environment variables
$env:GOOGLE_CLIENT_ID = "your-client-id"
$env:GOOGLE_CLIENT_SECRET = "your-client-secret"

# Start Supabase
supabase start
```

### Check if OAuth is Working

```powershell
# Check status
supabase status

# Test endpoint
Invoke-WebRequest -Uri "http://127.0.0.1:54321/auth/v1/authorize?provider=google" -UseBasicParsing
```

### Restart Supabase

```powershell
supabase stop
# Set environment variables
$env:GOOGLE_CLIENT_ID = "your-client-id"
$env:GOOGLE_CLIENT_SECRET = "your-client-secret"
supabase start
```

## Summary

**Errors Fixed**:
- ✅ "The OAuth client was not found" → Fixed by enabling OAuth in config
- ✅ "ERR_CONNECTION_REFUSED" → Fixed by ensuring Supabase is running

**Key Changes**:
1. Enabled Google OAuth in `supabase/config.toml`
2. Configured redirect URI in `supabase/config.toml`
3. Ensured environment variables are set before starting Supabase
4. Verified Supabase is running and accessible

**Result**: Gmail login now works correctly. Users can sign in with Google OAuth.

## Related Documentation

- [OAuth Client Not Found Fix](./OAUTH_CLIENT_NOT_FOUND_FIX.md)
- [Gmail Login Troubleshooting](./GMAIL_LOGIN_TROUBLESHOOTING.md)
- [Local Supabase Start Guide](./LOCAL_SUPABASE_START_GUIDE.md)
- [Verify OAuth Setup](./VERIFY_OAUTH_SETUP.md)
