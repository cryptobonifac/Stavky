# Removing Incorrect Supabase Integration from Vercel

## Problem

Vercel deployment is failing with "Provisioning integrations failed" because there's an incorrect Supabase integration named "supabase-farmerjoe" configured in your Vercel project.

## Solution: Remove the Incorrect Integration

### Step 1: Access Vercel Project Settings

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **stavky** project
3. Click on **Settings** (in the top navigation)

### Step 2: Navigate to Integrations

1. In the left sidebar, click on **Integrations**
2. You should see a list of all integrations connected to your project

### Step 3: Remove the Incorrect Supabase Integration

1. Look for any Supabase integrations, specifically:
   - `supabase-farmerjoe`
   - `supabase-farmerjoe: Supabase Preview Branch`
   
2. For each incorrect integration:
   - Click on the integration
   - Look for a **Remove** or **Disconnect** button
   - Click it to remove the integration
   - Confirm the removal

### Step 4: Verify Correct Supabase Configuration

After removing the incorrect integration, make sure you have the correct Supabase project configured via **Environment Variables**:

**Your correct Supabase project ID is:** `ezhcfemzrbfsfkafqsav` (from `supabase/config.toml`)

1. In Vercel project settings, go to **Environment Variables**
2. Verify you have these variables set (NOT from integrations, but as regular env vars):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://ezhcfemzrbfsfkafqsav.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-supabase-dashboard
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-from-supabase-dashboard
   ```

3. If these are missing or incorrect, add/update them:
   - Click **Add New**
   - Enter the variable name
   - Enter the value from your Supabase project dashboard (project ID: `ezhcfemzrbfsfkafqsav`)
   - Select environments (Production, Preview, Development)
   - Click **Save**

4. **To get the correct values:**
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Select project with ID: `ezhcfemzrbfsfkafqsav`
   - Go to **Settings** → **API**
   - Copy the **Project URL** and **anon public** key
   - Copy the **service_role** key (secret)

### Step 5: Redeploy

1. Go to **Deployments** tab
2. Find the failed deployment
3. Click the **⋯** (three dots) menu
4. Click **Redeploy**
5. The build should now succeed without the provisioning error

## Alternative: If You Can't Find Integrations Section

If you don't see an Integrations section, the integration might be configured at the team/account level:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your **Team/Account** settings (top right)
3. Go to **Integrations**
4. Look for Supabase integrations
5. Remove any that reference "farmerjoe"

## Why This Happens

Vercel Supabase integrations automatically provision Supabase projects and branches. If you previously connected a "farmerjoe" project or it was added by mistake, Vercel tries to provision it during each deployment, causing the failure.

## Best Practice

For this project, **use Environment Variables instead of Integrations**:
- ✅ More control over which Supabase project is used
- ✅ No automatic provisioning that can fail
- ✅ Easier to manage and update
- ✅ Works with any Supabase project (not just Vercel-provisioned ones)

## Verification

After removing the integration and redeploying:
- ✅ Build should complete successfully
- ✅ No "Provisioning integrations failed" error
- ✅ Application should deploy correctly
- ✅ Your correct Supabase project should be used (via environment variables)

## Need Help?

If you can't find the integration to remove:
1. Check Vercel project settings → Integrations
2. Check Vercel team/account settings → Integrations
3. Contact Vercel support if the integration persists

