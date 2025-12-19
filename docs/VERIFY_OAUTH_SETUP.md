# Verify OAuth Setup Checklist

Since your OAuth client exists in Google Cloud Console, let's verify all the configuration is correct.

## Step 1: Verify Redirect URI in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID: `161230976386-q99dtviv09l0v7sadohcb5rjr13bkbpg.apps.googleusercontent.com`
4. Under **Authorized redirect URIs**, verify you have **exactly** this:
   ```
   http://localhost:54321/auth/v1/callback
   ```

**Common mistakes:**
- ❌ `https://localhost:54321/auth/v1/callback` (wrong protocol)
- ❌ `http://127.0.0.1:54321/auth/v1/callback` (wrong hostname)
- ❌ `http://localhost:54321/auth/v1/callback/` (trailing slash)
- ❌ `http://localhost:3000/auth/callback` (wrong port/path)

**Must be exactly:**
- ✅ `http://localhost:54321/auth/v1/callback`

## Step 2: Verify OAuth Consent Screen

1. In Google Cloud Console → **APIs & Services** → **OAuth consent screen**
2. Check:
   - **User type**: External (or Internal if you have Google Workspace)
   - **App name**: Set
   - **User support email**: Set
   - **Developer contact**: Set
3. If in **Testing** mode:
   - Scroll to **Test users**
   - Make sure `Marek.Rohon@gmail.com` is added
   - If not, click **+ ADD USERS** and add your email

## Step 3: Verify .env.local Configuration

Open `.env.local` and check:

```env
GOOGLE_CLIENT_ID=161230976386-q99dtviv09l0v7sadohcb5rjr13bkbpg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

**Important:**
- Remove quotes if present: `GOOGLE_CLIENT_ID="..."` → `GOOGLE_CLIENT_ID=...`
- No spaces around the `=` sign
- Use exact values from Google Cloud Console

## Step 4: Restart Supabase with Environment Variables

**In PowerShell, run these commands in the same session:**

```powershell
# Set environment variables
$env:GOOGLE_CLIENT_ID = "161230976386-q99dtviv09l0v7sadohcb5rjr13bkbpg.apps.googleusercontent.com"
$env:GOOGLE_CLIENT_SECRET = "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"

# Verify they're set
echo "Client ID: $env:GOOGLE_CLIENT_ID"
echo "Client Secret: $env:GOOGLE_CLIENT_SECRET"

# Stop Supabase
supabase stop

# Wait a moment
Start-Sleep -Seconds 2

# Start Supabase (it will read the environment variables)
supabase start

# Check for warnings
supabase status
```

**You should NOT see:**
- ❌ `WARN: environment variable is unset: GOOGLE_CLIENT_ID`
- ❌ `WARN: environment variable is unset: GOOGLE_CLIENT_SECRET`

## Step 5: Test OAuth Directly

Test if Supabase can reach Google OAuth:

1. Open browser and go to:
   ```
   http://127.0.0.1:54321/auth/v1/authorize?provider=google
   ```

2. **Expected result:**
   - ✅ Redirects to Google OAuth page
   - ❌ Shows "OAuth client was not found" error

## Step 6: Verify Supabase Config

Check `supabase/config.toml` has:

```toml
[auth.external.google]
enabled = true
client_id = "env(GOOGLE_CLIENT_ID)"
secret = "env(GOOGLE_CLIENT_SECRET)"
redirect_uri = "http://localhost:54321/auth/v1/callback"
```

## Common Issues

### Issue: Still getting "OAuth client was not found"

**Possible causes:**
1. **Wrong Google Cloud Project**: The client exists but in a different project
   - Check which project you're viewing in Google Cloud Console
   - Make sure it's the same project where you created the client

2. **Client ID mismatch**: The ID in `.env.local` doesn't match Google Console
   - Copy the Client ID again from Google Console
   - Update `.env.local`
   - Restart Supabase

3. **Environment variables not loaded**: Supabase didn't pick up the variables
   - Make sure you set variables **before** starting Supabase
   - Don't close the terminal between setting variables and starting

4. **Redirect URI mismatch**: Google rejects because redirect URI doesn't match
   - Double-check the redirect URI in Google Console
   - Must be exactly: `http://localhost:54321/auth/v1/callback`

### Issue: "Access blocked: This app isn't verified"

**Solution:**
- Add your email to **Test users** in OAuth consent screen
- Or publish the app (requires verification)

### Issue: Environment variables lost

**Problem:** PowerShell environment variables are session-specific

**Solution:**
- Set variables in the **same PowerShell window** where you start Supabase
- Don't close the terminal
- Or create a startup script that loads from `.env.local`

## Quick Verification Script

Run this in PowerShell to verify everything:

```powershell
# Check .env.local
Write-Host "=== .env.local ===" -ForegroundColor Cyan
Get-Content .env.local | Select-String "GOOGLE_CLIENT"

# Set environment variables
$env:GOOGLE_CLIENT_ID = "161230976386-q99dtviv09l0v7sadohcb5rjr13bkbpg.apps.googleusercontent.com"
$env:GOOGLE_CLIENT_SECRET = "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"

# Verify they're set
Write-Host "`n=== Environment Variables ===" -ForegroundColor Cyan
Write-Host "GOOGLE_CLIENT_ID: $env:GOOGLE_CLIENT_ID"
Write-Host "GOOGLE_CLIENT_SECRET: $($env:GOOGLE_CLIENT_SECRET.Substring(0,10))..." # Show first 10 chars only

# Check Supabase status
Write-Host "`n=== Supabase Status ===" -ForegroundColor Cyan
supabase status
```

## Next Steps

If everything is verified but still not working:

1. **Check Google Cloud Console logs:**
   - Look for any errors or warnings about the OAuth client

2. **Try creating a new OAuth client:**
   - Sometimes clients get into a bad state
   - Create a fresh one and update `.env.local`

3. **Check Supabase logs:**
   - Open Supabase Studio: http://127.0.0.1:54323
   - Look for OAuth-related errors

4. **Test with a different browser:**
   - Clear cookies and cache
   - Try incognito/private mode
