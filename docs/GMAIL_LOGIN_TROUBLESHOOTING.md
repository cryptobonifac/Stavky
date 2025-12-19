# Gmail Login Troubleshooting: "OAuth client was not found"

## Error You're Seeing

- **"The OAuth client was not found"**
- **"Error 401: invalid_client"**
- **"Access blocked: Authorization Error"**

## Root Cause

This error means Google cannot find the OAuth client with the Client ID you're using. Common causes:

1. **OAuth client doesn't exist** in Google Cloud Console
2. **Wrong Client ID** in `.env.local`
3. **OAuth client was deleted** or disabled
4. **Redirect URI mismatch** - Google Console doesn't have the correct redirect URI

## Step-by-Step Fix

### Step 1: Verify OAuth Client Exists in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Look for an OAuth 2.0 Client ID that matches:
   ```
   161230976386-q99dtviv09l0v7sadohcb5rjr13bkbpg.apps.googleusercontent.com
   ```

**If the client doesn't exist:**
- The client may have been deleted
- You need to create a new one (see Step 2)

**If the client exists:**
- Check if it's enabled
- Verify the redirect URI (see Step 3)

### Step 2: Create/Verify OAuth Client

1. In Google Cloud Console → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. If prompted, configure OAuth consent screen first:
   - Choose **External** (unless you have Google Workspace)
   - Fill in:
     - **App name**: Stavky (or your app name)
     - **User support email**: Your email
     - **Developer contact**: Your email
   - Click **Save and Continue**
   - Add your email (`Marek.Rohon@gmail.com`) to **Test users** if in Testing mode
   - Click **Save and Continue**

4. For OAuth client:
   - **Application type**: Web application
   - **Name**: Stavky Local Dev (or your name)
   - **Authorized redirect URIs**: Add this **exact** URI:
     ```
     http://localhost:54321/auth/v1/callback
     ```
   - Click **Create**

5. **Copy the new Client ID and Client Secret**

### Step 3: Update .env.local

Open `.env.local` and update with the **correct** values:

```env
GOOGLE_CLIENT_ID=your-actual-client-id-from-google-console.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-actual-secret-from-google-console
```

**Important:**
- Remove quotes if present
- Use the exact values from Google Cloud Console
- Make sure there are no extra spaces

### Step 4: Restart Supabase with OAuth Credentials

**In PowerShell, run these commands in order:**

```powershell
# Set environment variables
$env:GOOGLE_CLIENT_ID = "your-actual-client-id-here"
$env:GOOGLE_CLIENT_SECRET = "your-actual-secret-here"

# Stop Supabase
supabase stop

# Start Supabase (it will pick up the environment variables)
supabase start

# Verify no warnings
supabase status
```

You should **NOT** see:
- ❌ `WARN: environment variable is unset: GOOGLE_CLIENT_ID`
- ❌ `WARN: environment variable is unset: GOOGLE_CLIENT_SECRET`

### Step 5: Verify Redirect URI in Google Console

**Critical:** The redirect URI must match **exactly**:

1. In Google Cloud Console → **Credentials** → Your OAuth Client
2. Under **Authorized redirect URIs**, make sure you have:
   ```
   http://localhost:54321/auth/v1/callback
   ```
3. **Check for:**
   - No trailing slash
   - `http://` not `https://`
   - `localhost` not `127.0.0.1`
   - Port `54321` (Supabase's local port)
   - Path `/auth/v1/callback` (Supabase's auth endpoint)

### Step 6: Test OAuth Login

1. Make sure Supabase is running: `supabase status`
2. Start your Next.js app: `npm run dev`
3. Go to login page
4. Click "Sign in with Google"
5. You should be redirected to Google's OAuth page (not an error)

## Common Issues

### Issue: "OAuth client was not found" even after creating it

**Possible causes:**
1. **Wrong project**: You created the client in a different Google Cloud project
2. **Client ID mismatch**: The Client ID in `.env.local` doesn't match Google Console
3. **Client deleted**: The client was deleted after you copied the ID

**Solution:**
1. Double-check the Client ID in Google Cloud Console
2. Copy it again and update `.env.local`
3. Restart Supabase

### Issue: "redirect_uri_mismatch"

**Solution:**
- In Google Console, verify the redirect URI is exactly:
  ```
  http://localhost:54321/auth/v1/callback
  ```
- Check for typos, wrong protocol (http vs https), wrong port

### Issue: "Access blocked: This app isn't verified"

**Solution:**
- Your app is in Testing mode
- Add your email (`Marek.Rohon@gmail.com`) to **Test users** in OAuth consent screen
- Or publish the app (requires verification for production)

### Issue: Environment variables not working

**Problem:** PowerShell environment variables are session-specific

**Solution:**
- Set variables in the **same PowerShell session** before starting Supabase
- Or use a startup script that loads from `.env.local`
- Don't close the terminal between setting variables and starting Supabase

## Verification Checklist

Before testing, verify:

- [ ] OAuth client exists in Google Cloud Console
- [ ] Client ID in `.env.local` matches Google Console exactly
- [ ] Redirect URI in Google Console is: `http://localhost:54321/auth/v1/callback`
- [ ] Environment variables are set before starting Supabase
- [ ] Supabase started without warnings about Google OAuth
- [ ] Your email is added to Test users (if app is in Testing mode)
- [ ] OAuth consent screen is configured

## Quick Test

After fixing everything, test:

1. **Check Supabase status:**
   ```powershell
   supabase status
   ```
   Should show no warnings about Google OAuth

2. **Test OAuth URL directly:**
   Open in browser:
   ```
   http://127.0.0.1:54321/auth/v1/authorize?provider=google
   ```
   Should redirect to Google OAuth page (not an error)

3. **Test in your app:**
   - Go to login page
   - Click "Sign in with Google"
   - Should redirect to Google (not show "OAuth client was not found")

## Still Not Working?

1. **Check Google Cloud Console logs:**
   - Go to Google Cloud Console → APIs & Services → Credentials
   - Check if there are any errors or warnings

2. **Verify the Client ID:**
   - In Google Console, click on your OAuth client
   - Copy the Client ID again
   - Compare with `.env.local` - must match exactly

3. **Check Supabase logs:**
   - Look for OAuth-related errors in Supabase Studio
   - Go to http://127.0.0.1:54323 (Supabase Studio)

4. **Try creating a new OAuth client:**
   - Sometimes old clients get into a bad state
   - Create a fresh one and update `.env.local`

## Related Documentation

- [OAuth Client Not Found Fix](./OAUTH_CLIENT_NOT_FOUND_FIX.md)
- [Local Supabase Start Guide](./LOCAL_SUPABASE_START_GUIDE.md)
- [Google OAuth Dashboard Setup](./GOOGLE_OAUTH_DASHBOARD_SETUP.md)
