# Quick Fix: Vercel Internal Server Error

## Error Message
```
Error: Your project's URL and Key are required to create a Supabase client!
```

## Solution: Add Environment Variables to Vercel

### Required Variables

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Get from: Supabase Dashboard → Settings → API → Project URL

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Get from: Supabase Dashboard → Settings → API → anon public key

### Steps

1. **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. **Add Variable 1:**
   ```
   Key: NEXT_PUBLIC_SUPABASE_URL
   Value: https://xxxxx.supabase.co
   Environments: ✅ Production ✅ Preview ✅ Development
   ```

3. **Add Variable 2:**
   ```
   Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Environments: ✅ Production ✅ Preview ✅ Development
   ```

4. **Redeploy:**
   - Go to **Deployments**
   - Click **⋯** on latest deployment
   - Click **Redeploy**

## Verification

After redeploying:
- ✅ Root URL should redirect to `/en` (or default locale)
- ✅ No "Internal Server Error"
- ✅ Application loads correctly

## Why This Happens

The middleware/proxy tries to initialize Supabase on every request. Without these environment variables, the Supabase client cannot be created, causing the 500 error.




















