# GitHub Secrets Setup Guide

## Required Secrets for Supabase Migrations

To enable automatic database migrations in GitHub Actions, you need to configure the following secrets in your GitHub repository.

## Steps to Add Secrets

1. **Go to GitHub Repository Settings**
   - Navigate to your repository on GitHub
   - Click on **Settings** (top navigation)
   - Click on **Secrets and variables** → **Actions** (left sidebar)

2. **Add Required Secrets**

   Click **New repository secret** for each of the following:

   ### `SUPABASE_PROJECT_ID`
   - **Description**: Your Supabase project reference ID
   - **How to find it**:
     1. Go to https://supabase.com/dashboard
     2. Select your project
     3. Go to **Settings** → **General**
     4. Find **Reference ID** (format: `xxxxxxxxxxxxx`)
   - **Example**: `abcdefghijklm`

   ### `SUPABASE_ACCESS_TOKEN`
   - **Description**: Your Supabase access token for CLI authentication
   - **How to create it**:
     1. Go to https://supabase.com/dashboard/account/tokens
     2. Click **Generate new token**
     3. Give it a name (e.g., "GitHub Actions")
     4. Copy the token (you won't see it again!)
   - **Note**: This token is used by Supabase CLI to authenticate

   ### `SUPABASE_DB_PASSWORD`
   - **Description**: Your Supabase database password
   - **How to find it**:
     1. Go to https://supabase.com/dashboard
     2. Select your project
     3. Go to **Settings** → **Database**
     4. Find **Database Password** section
     5. If you don't remember it, you can reset it (be careful - this will require updating all connections)

3. **Verify Secrets Are Added**
   - You should see all three secrets listed:
     - `SUPABASE_PROJECT_ID`
     - `SUPABASE_ACCESS_TOKEN`
     - `SUPABASE_DB_PASSWORD`

## Testing the Setup

After adding the secrets:

1. **Trigger a Workflow Run**
   - Push a commit to the `main` branch, or
   - Go to **Actions** tab → Select the workflow → Click **Run workflow**

2. **Check the Logs**
   - Go to the workflow run
   - Check the "Link to Supabase project" step
   - You should see:
     - `SUPABASE_PROJECT_ID is set: yes`
     - `SUPABASE_ACCESS_TOKEN is set: yes`
   - If you see "no", the secrets aren't being passed correctly

3. **Verify Migrations Run**
   - The "Run migrations" step should execute `supabase db push`
   - Check for any errors in the logs

## Troubleshooting

### Issue: Secrets show as "not set" in workflow logs

**Possible causes:**
1. Secrets not added to GitHub repository
   - **Solution**: Add them following the steps above

2. Secrets added to wrong repository
   - **Solution**: Ensure you're adding secrets to the correct repository

3. Secrets not passed to reusable workflow
   - **Solution**: The workflow files should already be configured correctly. If issues persist, check the workflow YAML syntax

### Issue: "Skipping migrations: Required secrets not configured"

This means the secrets are empty or not configured. Check:
1. Are the secrets actually added in GitHub Settings?
2. Are the secret names spelled correctly? (case-sensitive)
3. Did you push the latest workflow changes that pass secrets?

### Issue: "Error: Project not found" or authentication errors

**Possible causes:**
1. `SUPABASE_PROJECT_ID` is incorrect
   - **Solution**: Verify the Reference ID in Supabase Dashboard

2. `SUPABASE_ACCESS_TOKEN` is invalid or expired
   - **Solution**: Generate a new token and update the secret

3. Token doesn't have required permissions
   - **Solution**: Ensure the token has access to your project

## Security Notes

- **Never commit secrets to the repository**
- Secrets are encrypted and only visible to GitHub Actions
- Use repository secrets (not environment secrets) unless you need environment-specific values
- Rotate tokens periodically for security

## Related Documentation

- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Supabase CLI Authentication](https://supabase.com/docs/guides/cli/getting-started#authentication)
- [Supabase Project Settings](https://supabase.com/docs/guides/platform/project-settings)




















