# Vercel Environment Variables Setup

## Critical Issue: Internal Server Error

If you're seeing "Internal Server Error" or "Index file cannot be found" on Vercel, it's likely due to **missing environment variables**.

## Required Environment Variables

The following environment variables **MUST** be set in Vercel for the application to work:

### 1. Supabase Configuration (Required)

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Why these are critical:**
- The root page redirects to a locale, which requires Supabase client initialization
- The middleware/proxy needs Supabase to check authentication
- Without these, the app will fail to start

### 2. Optional but Recommended

```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## How to Add Environment Variables in Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Your Supabase project URL
   - **Environment**: Select all (Production, Preview, Development)
   - Click **Save**
4. Repeat for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Login
vercel login

# Link project (if not already linked)
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
```

## Getting Supabase Values

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## After Adding Variables

1. **Redeploy** your application:
   - Go to Vercel Dashboard → **Deployments**
   - Click the three dots (⋯) on the latest deployment
   - Click **Redeploy**

2. Or trigger a new deployment:
   - Push a new commit, or
   - Go to **Deployments** → **Redeploy**

## Verification

After redeploying, check:

1. The root URL should redirect to `/en` (or your default locale)
2. No "Internal Server Error" messages
3. The application loads correctly

## Common Issues

### Issue 1: "Internal Server Error" on Root

**Cause**: Missing `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Solution**: Add both environment variables in Vercel and redeploy

### Issue 2: "Index file cannot be found"

**Cause**: Build succeeded but runtime fails due to missing env vars

**Solution**: 
1. Check Vercel build logs - build should succeed
2. Check Vercel function logs - will show missing env var errors
3. Add missing environment variables
4. Redeploy

### Issue 3: Redirect Loop

**Cause**: Middleware failing due to missing Supabase config

**Solution**: Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set

## Debugging

### Check Vercel Function Logs

1. Go to Vercel Dashboard → Your Project
2. Click **Functions** tab
3. Check logs for errors

### Check Build Logs

1. Go to Vercel Dashboard → Your Project
2. Click **Deployments**
3. Click on a deployment
4. Check **Build Logs** for errors

### Test Locally

```bash
# Set environment variables
export NEXT_PUBLIC_SUPABASE_URL="your-url"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="your-key"

# Build and start
npm run build
npm start
```

If it works locally but not on Vercel, the issue is missing environment variables in Vercel.

## Quick Checklist

- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set in Vercel
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set in Vercel
- [ ] Variables are available for **Production** environment
- [ ] Application has been **redeployed** after adding variables
- [ ] No typos in variable names (case-sensitive!)

## Next Steps

1. Add the required environment variables in Vercel
2. Redeploy the application
3. Test the root URL - it should redirect to `/en` (or default locale)
4. Verify the application loads correctly


