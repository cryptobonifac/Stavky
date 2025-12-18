# GitHub Actions Setup Guide

## Current Workflow Configuration

The workflow (`/.github/workflows/nextjs.yml`) performs:
1. **Build & Test**: Builds the Next.js application and runs migrations
2. **Deploy to Vercel**: Deploys to Vercel (optional, requires secrets)

## Required GitHub Secrets

### For Build Job (Required)
These are needed for the build to complete:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### For Database Migrations (Optional)
If you want to run migrations automatically:

- `SUPABASE_PROJECT_ID` - Your Supabase project reference ID
- `SUPABASE_DB_PASSWORD` - Your Supabase database password

### For Vercel Deployment (Optional)
If you want to deploy to Vercel automatically:

- `VERCEL_TOKEN` - Your Vercel authentication token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID

## How to Add Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with its name and value
5. Click **Add secret**

## Getting the Values

### Supabase Secrets

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
   - `NEXT_PUBLIC_SUPABASE_URL`: Copy "Project URL"
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Copy "anon public" key
   - `SUPABASE_PROJECT_ID`: Copy "Reference ID" (from Settings → General)
   - `SUPABASE_DB_PASSWORD`: Your database password (Settings → Database)

### Vercel Secrets

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Go to **Settings** → **Tokens**
   - `VERCEL_TOKEN`: Create a new token
3. Go to your project → **Settings** → **General**
   - `VERCEL_ORG_ID`: Copy "Team ID" or "Personal Account ID"
   - `VERCEL_PROJECT_ID`: Copy "Project ID"

## Workflow Behavior

### Without Secrets

- ✅ **Build will still run** (but may have warnings about missing env vars)
- ⚠️ **Migrations will be skipped** (if Supabase secrets missing)
- ⚠️ **Vercel deployment will be skipped** (if Vercel secrets missing)

### With All Secrets

- ✅ Build runs with proper environment variables
- ✅ Migrations run automatically before build
- ✅ Application deploys to Vercel after successful build

## Troubleshooting

### Error: "Input required and not supplied: vercel-token"

**Solution**: Either:
1. Add `VERCEL_TOKEN` secret to GitHub, OR
2. The workflow will skip Vercel deployment automatically (it's conditional)

### Error: "Get Pages site failed"

**Solution**: This error appears if the workflow was previously configured for GitHub Pages. The current workflow is for Vercel, so this error can be ignored if you're using Vercel.

### Build Fails with TypeScript Errors

**Solution**: 
1. Run `npm run build` locally to catch errors
2. Fix all TypeScript errors
3. Commit and push again

### Migrations Fail

**Solution**:
1. Verify `SUPABASE_PROJECT_ID` and `SUPABASE_DB_PASSWORD` are correct
2. Check that your Supabase project allows connections from GitHub Actions IPs
3. Verify migration files are valid SQL

## Testing the Workflow

1. Push to `main` branch to trigger automatically, OR
2. Go to **Actions** tab → Select workflow → **Run workflow** → **Run workflow**

## Current Status

The workflow is configured to:
- ✅ Always build the application (verifies it compiles)
- ⚠️ Run migrations only if Supabase secrets are configured
- ⚠️ Deploy to Vercel only if Vercel secrets are configured

This means the build will always run, even without all secrets, allowing you to verify the code compiles correctly.












