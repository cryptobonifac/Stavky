# Vercel Deployment Guide

This guide walks you through deploying the Stavky application to Vercel.

## Prerequisites

- A GitHub account with the Stavky repository
- A Vercel account (sign up at [vercel.com](https://vercel.com))
- A production Supabase project (see [Supabase Production Setup](#supabase-production-setup))

## Step 1: Connect GitHub Repository to Vercel

1. **Sign in to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in (or create an account)
   - You can sign in with your GitHub account for easier integration

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Choose your GitHub account and select the `Stavky` repository
   - Click "Import"

3. **Configure Project**
   - **Project Name**: `stavky` (or your preferred name)
   - **Framework Preset**: Next.js (should be auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (should be auto-detected)
   - **Output Directory**: `.next` (should be auto-detected)
   - **Install Command**: `npm install` (should be auto-detected)

4. **Click "Deploy"** (we'll add environment variables in the next step)

## Step 2: Configure Environment Variables

After the initial deployment (which will fail without environment variables), configure all required environment variables:

1. **Go to Project Settings**
   - In your Vercel project dashboard, click "Settings"
   - Navigate to "Environment Variables"

2. **Add Supabase Variables**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

   **Where to find these:**
   - Go to your Supabase project dashboard
   - Settings → API
   - Copy the "Project URL" for `NEXT_PUBLIC_SUPABASE_URL`
   - Copy the "anon public" key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy the "service_role secret" key for `SUPABASE_SERVICE_ROLE_KEY`

3. **Add Application URL Variables**
   ```
   NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
   NEXT_PUBLIC_AUTH_CALLBACK_URL=https://your-project.vercel.app/auth/callback
   APP_SITE_URL=https://your-project.vercel.app
   AUTH_REDIRECT_URL_LOGIN=https://your-project.vercel.app/sk/login
   AUTH_REDIRECT_URL_SIGNUP=https://your-project.vercel.app/sk/signup
   AUTH_REDIRECT_URL_CALLBACK=https://your-project.vercel.app/auth/callback
   ```

   **Note**: Replace `your-project.vercel.app` with your actual Vercel deployment URL. If you have a custom domain, use that instead.

4. **Add OAuth Provider Variables (if using OAuth)**
   
   **Google OAuth:**
   ```
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_REDIRECT_URL=https://your-project.vercel.app/auth/callback
   ```

   **Facebook OAuth:**
   ```
   FACEBOOK_CLIENT_ID=your-facebook-app-id
   FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
   FACEBOOK_REDIRECT_URL=https://your-project.vercel.app/auth/callback
   ```

5. **Set Environment Scope**
   - For each variable, select the appropriate environment:
     - **Production**: For production deployments
     - **Preview**: For preview deployments (pull requests)
     - **Development**: For local development (optional, usually not needed)

6. **Save Variables**
   - Click "Save" after adding each variable or use "Add Another" to add multiple at once

## Step 3: Configure Build Settings

The build configuration is already set up in `vercel.json`, but you can verify in Vercel:

1. **Go to Project Settings → General**
2. **Verify Build & Development Settings:**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
   - Development Command: `npm run dev`

3. **Node.js Version**
   - Vercel automatically detects Node.js version from `package.json`
   - Ensure your `package.json` specifies Node.js 18+:
     ```json
     "engines": {
       "node": ">=18.0.0"
     }
     ```

## Step 4: Redeploy with Environment Variables

1. **Trigger a New Deployment**
   - Go to the "Deployments" tab
   - Click the three dots (⋯) on the latest deployment
   - Select "Redeploy"
   - Or push a new commit to trigger automatic deployment

2. **Monitor Build Logs**
   - Watch the build process in real-time
   - Check for any errors related to missing environment variables
   - Verify the build completes successfully

## Step 5: Configure Custom Domain (Optional)

If you have a custom domain:

1. **Go to Project Settings → Domains**
2. **Add Domain**
   - Enter your domain name (e.g., `stavky.com`)
   - Follow Vercel's DNS configuration instructions
3. **Update Environment Variables**
   - After adding the domain, update all URL-related environment variables to use your custom domain
   - Redeploy the application

## Step 6: Verify Deployment

1. **Test the Application**
   - Visit your Vercel deployment URL
   - Test all major features:
     - Homepage loads correctly
     - Language switching works (`/en`, `/cs`, `/sk`)
     - Authentication (login/signup)
     - OAuth providers (if configured)
     - Protected routes (bettings, history, profile)
     - Admin features (if you have betting role)

2. **Check Console for Errors**
   - Open browser DevTools
   - Check for any console errors
   - Verify API calls are working

3. **Test Locale Routing**
   - Visit `/en` (should show English)
   - Visit `/cs` (should show Czech)
   - Visit `/sk` (should show Slovak)
   - Test language switcher component

## Supabase Production Setup

Before deploying to Vercel, ensure your Supabase production project is configured:

### 1. Create Production Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Create a new project (or use existing)
3. Wait for the project to be fully provisioned

### 2. Run Database Migrations

1. **Using Supabase CLI:**
   ```bash
   # Link to your production project
   supabase link --project-ref your-project-ref
   
   # Push all migrations
   supabase db push
   ```

2. **Or manually via SQL Editor:**
   - Go to Supabase Dashboard → SQL Editor
   - Run all migration files from `supabase/migrations/` in order
   - Check migration file names for chronological order

### 3. Configure OAuth Redirect URLs

1. **In Supabase Dashboard:**
   - Go to Authentication → URL Configuration
   - Add your production URLs:
     - Site URL: `https://your-project.vercel.app`
     - Redirect URLs:
       - `https://your-project.vercel.app/auth/callback`
       - `https://your-project.vercel.app/**` (wildcard for all routes)

2. **In OAuth Provider Dashboards:**
   - **Google Cloud Console:**
     - Add `https://your-project.vercel.app/auth/callback` to authorized redirect URIs
   - **Facebook Developers:**
     - Add `https://your-project.vercel.app/auth/callback` to Valid OAuth Redirect URIs

### 4. Seed Production Data (Optional)

If you need initial data:
```bash
# Using Supabase CLI
supabase db push --db-url "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

Or run seed SQL manually in the SQL Editor.

## Environment Variables Checklist

Use this checklist to ensure all variables are set:

### Required Variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `NEXT_PUBLIC_APP_URL`
- [ ] `NEXT_PUBLIC_AUTH_CALLBACK_URL`
- [ ] `APP_SITE_URL`
- [ ] `AUTH_REDIRECT_URL_LOGIN`
- [ ] `AUTH_REDIRECT_URL_SIGNUP`
- [ ] `AUTH_REDIRECT_URL_CALLBACK`

### Optional Variables (if using OAuth)
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `GOOGLE_REDIRECT_URL`
- [ ] `FACEBOOK_CLIENT_ID`
- [ ] `FACEBOOK_CLIENT_SECRET`
- [ ] `FACEBOOK_REDIRECT_URL`

## Troubleshooting

### Build Fails with "Module not found"
- Ensure all dependencies are in `package.json`
- Check that `npm install` completes successfully
- Verify Node.js version compatibility

### Environment Variables Not Working
- Ensure variables are set for the correct environment (Production/Preview)
- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)
- Verify `NEXT_PUBLIC_` prefix for client-side variables

### Locale Routing Not Working
- Verify `vercel.json` rewrites are correct
- Check that `middleware.ts` exists and is properly configured
- Ensure `next-intl` is properly installed

### OAuth Redirect Errors
- Verify redirect URLs match exactly in:
  - Vercel environment variables
  - Supabase dashboard
  - OAuth provider dashboards (Google/Facebook)
- Check for trailing slashes or protocol mismatches (http vs https)

### Database Connection Errors
- Verify Supabase URL and keys are correct
- Check that RLS policies are set up correctly
- Ensure service role key is only used server-side

## Continuous Deployment

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every pull request creates a preview deployment

### Branch Protection
- Configure branch protection in GitHub to require reviews before merging
- Vercel preview deployments allow testing before production

## Monitoring

1. **Vercel Analytics** (optional)
   - Enable in Project Settings → Analytics
   - Monitor performance and errors

2. **Error Tracking**
   - Consider integrating Sentry or similar
   - Monitor production errors

3. **Supabase Dashboard**
   - Monitor database usage
   - Check API request logs
   - Review authentication logs

## Next Steps

After successful deployment:
1. ✅ Test all features in production
2. ✅ Set up monitoring and error tracking
3. ✅ Configure custom domain (if needed)
4. ✅ Set up automated backups for Supabase
5. ✅ Document production URLs and access

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Production Guide](https://supabase.com/docs/guides/hosting/overview)
- [next-intl Deployment](https://next-intl-docs.vercel.app/docs/next-13/server-components)
















