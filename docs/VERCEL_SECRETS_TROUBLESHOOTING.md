# Vercel Secrets Troubleshooting

## Error: "Input required and not supplied: vercel-token"

This error means GitHub Actions cannot find or access the `VERCEL_TOKEN` secret.

## How to Fix

### Step 1: Verify Secrets Exist in GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Verify these secrets exist:
   - `VERCEL_TOKEN` (required)
   - `VERCEL_PROJECT_ID` (required)
   - `VERCEL_ORG_ID` (optional but recommended)

### Step 2: Check Secret Names

**Important**: Secret names are case-sensitive and must match exactly:
- ✅ `VERCEL_TOKEN` (correct)
- ❌ `vercel_token` (wrong - lowercase)
- ❌ `Vercel_Token` (wrong - mixed case)
- ❌ `VERCEL-TOKEN` (wrong - hyphen)

### Step 3: Verify Secret Values

1. Click on each secret to view/edit
2. Ensure the value is not empty
3. For `VERCEL_TOKEN`:
   - Should be a long string starting with something like `vercel_...`
   - Get it from: [Vercel Dashboard](https://vercel.com/account/tokens) → **Create Token**

### Step 4: Get Vercel Token

If you need to create a new token:

1. Go to [Vercel Dashboard](https://vercel.com/account/tokens)
2. Click **Create Token**
3. Give it a name (e.g., "GitHub Actions")
4. Set expiration (recommended: 90 days or custom)
5. Copy the token immediately (you won't see it again!)
6. Add it to GitHub as `VERCEL_TOKEN`

### Step 5: Get Vercel Project ID and Org ID

1. Go to your Vercel project
2. Click **Settings** → **General**
3. Find:
   - **Project ID**: Copy the "Project ID" value
   - **Team ID** or **Personal Account ID**: This is your `VERCEL_ORG_ID`

### Step 6: Add Secrets to GitHub

1. In GitHub: **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add each secret:
   - **Name**: `VERCEL_TOKEN`
   - **Secret**: Paste your Vercel token
   - Click **Add secret**
4. Repeat for:
   - `VERCEL_PROJECT_ID`
   - `VERCEL_ORG_ID`

### Step 7: Re-run the Workflow

1. Go to **Actions** tab in GitHub
2. Find the failed workflow run
3. Click **Re-run all jobs**

## Common Issues

### Issue 1: Secret Not Visible to Workflow

**Cause**: Secrets might be set at the organization level but not accessible to the repository.

**Solution**: 
- Ensure secrets are set at the **repository level** (not just organization level)
- Check repository settings → **Secrets and variables** → **Actions**

### Issue 2: Secret Name Mismatch

**Cause**: Typo in secret name.

**Solution**: 
- Double-check the exact name matches: `VERCEL_TOKEN` (all caps, underscore)
- The workflow uses: `${{ secrets.VERCEL_TOKEN }}`

### Issue 3: Empty Secret Value

**Cause**: Secret exists but value is empty.

**Solution**:
- Delete and recreate the secret with a valid value
- Ensure you copied the entire token (no spaces, no line breaks)

### Issue 4: Token Expired or Invalid

**Cause**: Vercel token expired or was revoked.

**Solution**:
- Create a new token in Vercel
- Update the `VERCEL_TOKEN` secret in GitHub

## Verification

After adding/updating secrets, the workflow should:
1. ✅ Build successfully
2. ✅ Deploy to Vercel without the "vercel-token" error

## Alternative: Skip Vercel Deployment

If you don't want to deploy to Vercel via GitHub Actions, you can:

1. Remove the `deploy` job from the workflow, OR
2. Make it conditional (already done - it will skip if secrets are missing)

The build will still run and verify your code compiles.

## Quick Checklist

- [ ] `VERCEL_TOKEN` exists in GitHub Secrets
- [ ] `VERCEL_PROJECT_ID` exists in GitHub Secrets
- [ ] `VERCEL_ORG_ID` exists in GitHub Secrets (optional)
- [ ] All secret names are exactly: `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_ORG_ID`
- [ ] All secret values are non-empty
- [ ] Vercel token is valid and not expired
- [ ] Secrets are set at repository level (not just org level)










