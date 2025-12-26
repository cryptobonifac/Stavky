# Local Supabase Startup Guide

## Problem: "OAuth client was not found" or Supabase won't start

This guide will help you start local Supabase with Google OAuth properly configured.

## Quick Start (Recommended)

### Option 1: Use the Startup Script (Easiest)

1. **Make sure you have `.env.local` file** with your Google OAuth credentials:
   ```env
   GOOGLE_CLIENT_ID=your-google-client-id-here
   GOOGLE_CLIENT_SECRET=your-google-client-secret-here
   ```

2. **Run the startup script:**
   ```powershell
   .\scripts\start-supabase-with-oauth.ps1
   ```

   This script will:
   - Load Google OAuth credentials from `.env.local`
   - Stop any running Supabase instance
   - Start Supabase with OAuth configured
   - Verify no warnings appear

### Option 2: Manual Setup

1. **Set environment variables in PowerShell:**
   ```powershell
   $env:GOOGLE_CLIENT_ID = "your-google-client-id-here"
   $env:GOOGLE_CLIENT_SECRET = "your-google-client-secret-here"
   ```

2. **Start Supabase:**
   ```powershell
   supabase start
   ```

3. **Verify it started correctly:**
   ```powershell
   supabase status
   ```

   You should **NOT** see warnings like:
   - ❌ `WARN: environment variable is unset: GOOGLE_CLIENT_ID`
   - ❌ `WARN: environment variable is unset: GOOGLE_CLIENT_SECRET`

## Step-by-Step Instructions

### Step 1: Get Your Google OAuth Credentials

If you don't have Google OAuth credentials yet:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one)
3. Navigate to **APIs & Services** → **Credentials**
4. Find or create an **OAuth 2.0 Client ID**
5. Copy:
   - **Client ID** (e.g., `123456789-abc.apps.googleusercontent.com`)
   - **Client Secret** (e.g., `GOCSPX-xxxxx`)

### Step 2: Configure Google Console Redirect URI

1. In Google Cloud Console → **Credentials** → Click on your OAuth Client
2. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:54321/auth/v1/callback
   ```
   **Important:** This is Supabase's local auth endpoint, NOT your app's callback URL.

3. Click **Save**

### Step 3: Add Credentials to `.env.local`

1. Open or create `.env.local` in your project root
2. Add your Google OAuth credentials:
   ```env
   GOOGLE_CLIENT_ID=your-google-client-id-here
   GOOGLE_CLIENT_SECRET=your-google-client-secret-here
   ```
3. Save the file

### Step 4: Start Supabase

**Method A: Using the script (Recommended)**
```powershell
.\scripts\start-supabase-with-oauth.ps1
```

**Method B: Manual start**
```powershell
# Set environment variables
$env:GOOGLE_CLIENT_ID = "your-google-client-id"
$env:GOOGLE_CLIENT_SECRET = "your-google-client-secret"

# Start Supabase
supabase start
```

### Step 5: Verify Supabase Started Correctly

After starting, run:
```powershell
supabase status
```

**You should see:**
- ✅ Supabase is running
- ✅ Project URL: `http://127.0.0.1:54321`
- ✅ No warnings about Google OAuth

**You should NOT see:**
- ❌ `WARN: environment variable is unset: GOOGLE_CLIENT_ID`
- ❌ `WARN: environment variable is unset: GOOGLE_CLIENT_SECRET`

### Step 6: Verify Your App Configuration

Make sure your `.env.local` has the correct Supabase URL:
```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
```

## Common Issues and Solutions

### Issue 1: "Supabase is already running"

**Solution:**
```powershell
supabase stop
# Wait a few seconds
supabase start
```

### Issue 2: Environment variables not set

**Symptoms:**
- Warnings about `GOOGLE_CLIENT_ID` or `GOOGLE_CLIENT_SECRET` being unset
- OAuth login fails with "OAuth client was not found"

**Solution:**
1. Make sure you set environment variables **before** starting Supabase
2. If Supabase was already running, stop it first:
   ```powershell
   supabase stop
   $env:GOOGLE_CLIENT_ID = "your-id"
   $env:GOOGLE_CLIENT_SECRET = "your-secret"
   supabase start
   ```

### Issue 3: Port 54321 already in use

**Symptoms:**
- Error: "Port 54321 already in use"
- Supabase fails to start

**Solution:**

1. **Find what's using the port:**
   ```powershell
   Get-NetTCPConnection -LocalPort 54321
   ```

2. **Stop the conflicting process:**
   ```powershell
   # Find the process ID from above, then:
   Stop-Process -Id <PID> -Force
   ```

3. **Or stop Supabase if it's already running:**
   ```powershell
   supabase stop
   supabase start
   ```

### Issue 4: Docker/Podman not running

**Symptoms:**
- Supabase fails to start
- Error about Docker containers

**Solution:**

**For Docker Desktop users:**
1. Make sure Docker Desktop is running
2. Restart Docker Desktop if needed
3. Try starting Supabase again

**For Podman users (Windows):**
1. Start Podman machine:
   ```powershell
   podman machine start podman-machine-default
   ```
2. Verify it's running:
   ```powershell
   podman machine list
   ```
3. Try starting Supabase again

**Note:** Supabase works seamlessly with both Docker Desktop and Podman. For detailed Podman setup instructions, see [SUPABASE_TROUBLESHOOTING.md - Using Podman on Windows](./SUPABASE_TROUBLESHOOTING.md#using-podman-on-windows)

### Issue 5: Environment variables lost after closing terminal

**Symptoms:**
- OAuth works after setting variables
- Stops working after closing PowerShell

**Solution:**
- Use the startup script: `.\scripts\start-supabase-with-oauth.ps1`
- Or set variables each time before starting Supabase

## Verification Checklist

Before testing OAuth login, verify:

- [ ] Google OAuth Client ID and Secret are in `.env.local`
- [ ] Environment variables are set (or using startup script)
- [ ] Supabase started without warnings
- [ ] Google Console has redirect URI: `http://localhost:54321/auth/v1/callback`
- [ ] `.env.local` has: `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321`
- [ ] Supabase status shows it's running

## Testing OAuth Login

1. **Start your Next.js app:**
   ```powershell
   npm run dev
   ```

2. **Go to login page:**
   - Open `http://localhost:3000/login` (or your locale)

3. **Click "Sign in with Google"**

4. **You should be redirected to Google OAuth page** (not an error)

## Troubleshooting Commands

```powershell
# Check Supabase status
supabase status

# Stop Supabase
supabase stop

# Start Supabase
supabase start

# Reset database (WARNING: This deletes all data)
supabase db reset

# Check if port is in use
Get-NetTCPConnection -LocalPort 54321
```

## Next Steps

- If OAuth still doesn't work, see [OAUTH_CLIENT_NOT_FOUND_FIX.md](./OAUTH_CLIENT_NOT_FOUND_FIX.md)
- For general Supabase issues, see [SUPABASE_TROUBLESHOOTING.md](./SUPABASE_TROUBLESHOOTING.md)
- For OAuth policy errors, see [GOOGLE_OAUTH_POLICY_FIX.md](./GOOGLE_OAUTH_POLICY_FIX.md)



