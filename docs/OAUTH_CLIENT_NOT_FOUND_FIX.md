# Fix: "The OAuth client was not found" Error

## Problem

You're seeing the error: **"The OAuth client was not found"**

This happens when:
- The Google OAuth Client ID in your `.env.local` is still a placeholder
- The Client ID doesn't exist in Google Cloud Console
- The credentials haven't been set up in Google Cloud Console

## Solution

### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** → **Credentials**
4. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
5. If prompted, configure the OAuth consent screen first:
   - Choose **External** (unless you have a Google Workspace)
   - Fill in required fields (App name, User support email, Developer contact)
   - Add your email to test users if needed
   - Save and continue
6. For OAuth client:
   - **Application type**: Web application
   - **Name**: Your app name (e.g., "Stavky Local Dev")
   - **Authorized redirect URIs**: Add:
     ```
     http://localhost:54321/auth/v1/callback
     ```
7. Click **Create**
8. Copy:
   - **Client ID** (looks like: `123456789-abc.apps.googleusercontent.com`)
   - **Client Secret** (looks like: `GOCSPX-xxxxx`)

### Step 2: Update .env.local

Open `.env.local` and replace the placeholder values:

```env
GOOGLE_CLIENT_ID=your-actual-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-actual-secret-here
```

**Important**: 
- Remove any quotes around the values
- Don't include spaces
- Use the exact values from Google Cloud Console

### Step 3: Restart Supabase with OAuth Credentials

Run the setup script:

```powershell
.\scripts\start-supabase-with-oauth.ps1
```

This will:
- Load credentials from `.env.local`
- Restart Supabase with the new credentials
- Verify everything is set up correctly

### Step 4: Verify Setup

1. Check that Supabase started without warnings:
   ```powershell
   supabase status
   ```

2. You should **NOT** see:
   - ❌ `WARN: environment variable is unset: GOOGLE_CLIENT_ID`
   - ❌ `WARN: environment variable is unset: GOOGLE_CLIENT_SECRET`

3. Test Google OAuth in your app:
   - Go to your login page
   - Click "Sign in with Google"
   - You should be redirected to Google's OAuth page (not an error)

## Common Issues

### Issue: Still getting "OAuth client was not found"

**Possible causes:**
1. **Wrong Client ID**: Double-check the Client ID in `.env.local` matches Google Cloud Console
2. **Client deleted**: The OAuth client might have been deleted in Google Cloud Console
3. **Wrong project**: Make sure you're using the correct Google Cloud project
4. **Credentials not loaded**: Supabase needs to be restarted after updating `.env.local`

**Solution:**
1. Verify in Google Cloud Console that the OAuth client exists
2. Copy the Client ID and Secret again
3. Update `.env.local` with the correct values
4. Restart Supabase: `.\scripts\start-supabase-with-oauth.ps1`

### Issue: "redirect_uri_mismatch" error

**Solution:**
- In Google Cloud Console → Your OAuth Client → Authorized redirect URIs
- Make sure this exact URI is listed:
  ```
  http://localhost:54321/auth/v1/callback
  ```
- Check for typos, http vs https, trailing slashes
- Must match exactly

### Issue: Environment variables lost after closing terminal

**Solution:**
- This is normal - PowerShell environment variables are session-specific
- Always use the script: `.\scripts\start-supabase-with-oauth.ps1`
- Or set variables manually each time:
  ```powershell
  $env:GOOGLE_CLIENT_ID = "your-client-id"
  $env:GOOGLE_CLIENT_SECRET = "your-client-secret"
  supabase start
  ```

## Verification Checklist

- [ ] Google OAuth Client ID and Secret are created in Google Cloud Console
- [ ] Authorized redirect URI is set to: `http://localhost:54321/auth/v1/callback`
- [ ] `.env.local` has real credentials (not placeholders)
- [ ] Supabase was restarted after updating `.env.local`
- [ ] No warnings in `supabase status` output
- [ ] Google OAuth sign-in works in your app

## Quick Reference

### Redirect URI
- **For local development**: `http://localhost:54321/auth/v1/callback`
- **For production**: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

### Environment Variables
- `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret

### Scripts
- `.\scripts\start-supabase-with-oauth.ps1`: Loads credentials and starts Supabase

## Still Having Issues?

1. **Check Google Cloud Console**:
   - Verify the OAuth client exists
   - Check the Client ID matches `.env.local`
   - Verify redirect URI is configured

2. **Check Supabase logs**:
   - Look for OAuth-related errors in Supabase Studio
   - Check browser console for detailed error messages

3. **Verify environment variables**:
   ```powershell
   echo $env:GOOGLE_CLIENT_ID
   echo $env:GOOGLE_CLIENT_SECRET
   ```

4. **Restart everything**:
   - Stop Supabase: `supabase stop`
   - Run setup script: `.\scripts\start-supabase-with-oauth.ps1`
   - Restart your Next.js app: `npm run dev`
