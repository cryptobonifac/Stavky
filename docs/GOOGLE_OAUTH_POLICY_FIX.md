# Fix: Google OAuth "Doesn't Comply with OAuth 2.0 Policy" Error

## Problem

You're seeing this error:
- **"Access blocked: Authorization Error"**
- **"You can't sign in to this app because it doesn't comply with Google's OAuth 2.0 policy for keeping apps secure."**
- **Error 400: invalid_request**

## Root Cause

This error occurs when your Google OAuth consent screen is not properly configured or the app is in testing mode without the user added to test users.

## Solution: Configure OAuth Consent Screen

### Step 1: Go to OAuth Consent Screen

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **OAuth consent screen**

### Step 2: Configure User Type

**For Development/Testing:**
1. Select **"Internal"** (if you have a Google Workspace account)
   - Only users in your organization can sign in
   - No verification needed
   - Fastest option for testing

**OR**

2. Select **"External"** (for public use)
   - Any Google user can sign in
   - Requires verification for production
   - Can be in "Testing" mode for development

### Step 3: Fill Required Information

**Required Fields:**
1. **App name**: Enter your app name (e.g., "Stavky")
2. **User support email**: Your email address
3. **Developer contact information**: Your email address
4. **App logo** (optional but recommended)
5. **App domain** (optional for testing)
6. **Authorized domains** (optional for testing)

**For Testing Mode (External apps):**
- You can skip some fields, but fill in at least:
  - App name
  - User support email
  - Developer contact email

### Step 4: Add Scopes

1. Click **"Add or Remove Scopes"**
2. For basic Google sign-in, you typically need:
   - `openid` (automatically added)
   - `email` (automatically added)
   - `profile` (automatically added)
3. Click **"Update"** then **"Save and Continue"**

### Step 5: Add Test Users (For Testing Mode) ⚠️ **MOST COMMON ISSUE**

**If your app is in "Testing" mode:**

1. In OAuth consent screen, scroll down to **"Test users"** section
2. Click **"Add Users"** button
3. Add the email addresses that should be able to sign in:
   - **CRITICAL:** Add `Marek.Rohon@gmail.com` (the exact email from the error)
   - Add any other test users who need access
4. Click **"Add"**
5. **IMPORTANT:** Click **"Save and Continue"** or **"Save"** at the bottom
6. **Wait 2-5 minutes** for Google to update the settings

**Important:** 
- Only users added to the test users list can sign in when the app is in Testing mode
- The email must match **exactly** (case-sensitive for the domain part)
- Changes may take a few minutes to propagate

### Step 6: Review and Publish (For Production)

**For Production Use:**

1. Complete all required fields
2. Add **Privacy Policy URL** (required for production)
3. Add **Terms of Service URL** (required for production)
4. Click **"Save and Continue"** through all steps
5. Click **"Back to Dashboard"**
6. Click **"PUBLISH APP"** button

**Note:** Publishing may require app verification if you're requesting sensitive scopes. For basic email/profile scopes, publishing is usually instant.

## Quick Fix Checklist

### For Testing/Development:

- [ ] OAuth consent screen configured
- [ ] App name filled in
- [ ] User support email filled in
- [ ] Developer contact email filled in
- [ ] App is in "Testing" mode (External) or "Internal" mode
- [ ] Test users added (including `Marek.Rohon@gmail.com`)
- [ ] Scopes configured (openid, email, profile)
- [ ] Save all changes

### For Production:

- [ ] All testing requirements met
- [ ] Privacy Policy URL added
- [ ] Terms of Service URL added
- [ ] App published (not in Testing mode)
- [ ] App verified (if required for sensitive scopes)

## Common Issues

### Issue 1: "User is not a test user"

**Solution:** Add the user's email to the Test users list in OAuth consent screen.

### Issue 2: "App is in Testing mode"

**Solution:** Either:
- Add all users to Test users list, OR
- Publish the app (requires Privacy Policy and Terms of Service URLs)

### Issue 3: "App needs verification"

**Solution:** 
- For basic scopes (email, profile), publishing should work immediately
- For sensitive scopes, you may need to submit for verification
- This can take several days

### Issue 4: Missing Privacy Policy/Terms

**Solution:**
- Create simple privacy policy and terms pages
- Add URLs to OAuth consent screen
- Required for production apps

## Testing After Fix

1. Go to your app
2. Click "Sign in with Google"
3. You should see Google's consent screen (not an error)
4. After granting permission, you should be redirected back to your app
5. User should be logged in

## Still Getting the Error?

### Step-by-Step Troubleshooting:

1. **Verify Test User is Added:**
   - Go to OAuth consent screen → Test users section
   - Confirm `Marek.Rohon@gmail.com` is in the list
   - If not, add it and **Save**
   - Wait 2-5 minutes

2. **Check Redirect URI in Google Cloud Console:**
   - Go to **APIs & Services** → **Credentials**
   - Click on your OAuth 2.0 Client ID
   - Under **Authorized redirect URIs**, verify you have:
     - For production: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
     - For local: `http://localhost:54321/auth/v1/callback`
   - The redirect URI must match exactly what Supabase uses

3. **Verify Supabase Configuration:**
   - Go to Supabase Dashboard → Authentication → Providers → Google
   - Ensure Google is **Enabled**
   - Verify Client ID and Secret are set (not showing `env(GOOGLE_CLIENT_ID)`)
   - Check the Redirect URL shown matches your Google Console setting

4. **Clear Cache and Retry:**
   - Wait 5 minutes after making changes
   - Clear browser cache or try incognito mode
   - Try signing in again

5. **Check App Publishing Status:**
   - In OAuth consent screen, check if app shows "Testing" status
   - If you want to publish (remove test user limit), you need:
     - Privacy Policy URL
     - Terms of Service URL
     - Then click "PUBLISH APP"

6. **Verify Scopes:**
   - In OAuth consent screen → Scopes
   - Should have: `openid`, `email`, `profile`
   - These are usually auto-added, but verify they're there

## Reference Links

- [Google OAuth Consent Screen Setup](https://support.google.com/cloud/answer/10311615)
- [Google OAuth 2.0 Policies](https://developers.google.com/identity/protocols/oauth2/policies)
- [Supabase Google OAuth Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)

