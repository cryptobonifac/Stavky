# GitHub Environment Secrets vs Repository Secrets

## The Issue

If you configured `VERCEL_TOKEN` in the **Environment secrets** section, but your workflow doesn't specify an `environment:`, the secret won't be accessible.

## Two Types of Secrets in GitHub

### 1. Repository Secrets
- **Location**: Settings → Secrets and variables → Actions → **Repository secrets**
- **Access**: Available to all workflows via `${{ secrets.SECRET_NAME }}`
- **Use case**: Secrets used across all workflows

### 2. Environment Secrets
- **Location**: Settings → Secrets and variables → Actions → **Environments** → [Environment Name] → **Environment secrets**
- **Access**: Only available when workflow specifies `environment: [name]`
- **Use case**: Secrets specific to deployment environments (production, staging, etc.)

## Solution Options

### Option 1: Use Environment Secrets (Recommended for Production)

If your secrets are in an environment (e.g., "production"), update the workflow:

```yaml
deploy:
  runs-on: ubuntu-latest
  needs: build
  environment: production  # This matches your environment name
  steps:
    # ... rest of steps
```

**Important**: The `environment:` value must **exactly match** the environment name in GitHub.

### Option 2: Move to Repository Secrets (Simpler)

1. Go to: Settings → Secrets and variables → Actions → **Environments**
2. Click on your environment (e.g., "production")
3. Copy the secret values
4. Go to: Settings → Secrets and variables → Actions → **Repository secrets**
5. Add the secrets there
6. Remove the `environment:` line from the workflow (or keep it if you want environment protection)

## How to Check Where Your Secrets Are

1. Go to: `https://github.com/cryptobonifac/Stavky/settings/secrets/actions`
2. Check:
   - **Repository secrets** tab - secrets here work with `${{ secrets.SECRET_NAME }}`
   - **Environments** section - secrets here require `environment: [name]` in workflow

## Current Workflow Configuration

The workflow has been updated to use `environment: production`. 

**To make it work:**
1. Ensure you have an environment named "production" in GitHub
2. Ensure `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, and `VERCEL_ORG_ID` are in that environment's secrets

**OR**

1. Move the secrets from Environment secrets to Repository secrets
2. Remove the `environment: production` line from the workflow

## Benefits of Environment Secrets

- **Protection rules**: Can require reviewers, restrict branches
- **Deployment tracking**: GitHub tracks deployments per environment
- **Separate secrets**: Different secrets for production vs staging

## Benefits of Repository Secrets

- **Simpler**: No need to specify environment in workflow
- **Universal access**: Available to all workflows automatically
- **Easier setup**: One place to manage all secrets

## Recommendation

For this project, **Repository secrets** are simpler unless you need:
- Deployment protection (require reviewers)
- Separate staging/production environments
- Deployment tracking per environment

If you just want it to work, move the secrets to **Repository secrets**.











