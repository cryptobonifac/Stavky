---
name: Refactor GitHub workflow to use Stripe secrets from GitHub
overview: Refactor the GitHub Actions workflow to use Stripe environment variables from GitHub environment secrets (production) and automatically set them in Vercel during deployment using Vercel CLI.
todos:
  - id: update_workflow
    content: Update .github/workflows/main-pipeline.yml to add step that sets Stripe environment variables in Vercel using Vercel CLI or API
    status: pending
  - id: update_github_secrets_docs
    content: Update docs/GITHUB_SECRETS_SETUP.md to include Stripe secrets configuration instructions
    status: pending
  - id: update_vercel_deployment_docs
    content: Update docs/VERCEL_DEPLOYMENT.md to note that Stripe variables are automatically set by workflow
    status: pending
  - id: create_stripe_secrets_guide
    content: Create docs/STRIPE_GITHUB_SECRETS_SETUP.md with comprehensive setup guide for Stripe secrets
    status: pending
---

# Refactor GitHub Workflow for Stripe Secrets

## Overview

Move Stripe environment variables from local `.env.local` to GitHub environment secrets and update the workflow to automatically set them in Vercel during production deployment. This ensures Stripe payments work correctly in production by making environment variables available to Next.js at build time and runtime.

**Critical**: In production, Next.js reads environment variables from Vercel's environment, not from `.env.local`. The workflow must set these variables in Vercel BEFORE deployment so they're available during the build process.

## How Environment Variables Work in Production

### Local Development (`.env.local`)

- Next.js reads from `.env.local` file
- Variables are available via `process.env.VARIABLE_NAME`
- `NEXT_PUBLIC_*` variables are embedded in client bundle at build time

### Production (Vercel)

- Next.js reads from Vercel's environment variables (set in Vercel Dashboard or via API)
- Variables must be set BEFORE deployment for them to be available during build
- The same `process.env.VARIABLE_NAME` code works - Next.js automatically reads from Vercel's environment
- **No code changes needed** - the application code (`lib/stripe/stripe.ts`, `lib/stripe/stripe-client.ts`) will automatically use Vercel's environment variables

### Why This Approach Works

1. **GitHub Secrets** → Secure storage of production Stripe keys
2. **Workflow sets in Vercel** → Makes variables available to Next.js
3. **Next.js reads from Vercel** → Same `process.env` code works without changes
4. **Result** → Stripe payments work in production exactly like they do locally

## Stripe Environment Variables to Migrate

From `.env.local` (lines 19-24):

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`

- `NEXT_PUBLIC_ONE_TIME_PRICE_ID`
- `NEXT_PUBLIC_SUBSCRIPTION_PRICE_ID`

## Implementation Steps

### 1. Update GitHub Workflow

**File: `.github/workflows/main-pipeline.yml`**

Add a step BEFORE deployment to set Stripe environment variables in Vercel using the Vercel API (more reliable than CLI in CI/CD):

```yaml
deploy:
  runs-on: ubuntu-latest
  environment: production
  needs: migrate
  if: success()

  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    # Set Stripe environment variables in Vercel (BEFORE deployment)
    - name: Set Stripe environment variables in Vercel
      run: |
        set -e  # Exit on error
        
        # Function to set or update environment variable
        set_vercel_env() {
          local key=$1
          local value=$2
          
          echo "Setting $key in Vercel..."
          
          # Check if variable already exists
          EXISTING=$(curl -s -X GET "https://api.vercel.com/v10/projects/${{ secrets.VERCEL_PROJECT_ID }}/env" \
            -H "Authorization: Bearer ${{ secrets.VERCEL_TOKEN }}" \
            | jq -r ".envs[] | select(.key == \"$key\") | .id")
          
          if [ -n "$EXISTING" ]; then
            # Update existing variable
            echo "Updating existing variable $key"
            curl -s -X PATCH "https://api.vercel.com/v10/projects/${{ secrets.VERCEL_PROJECT_ID }}/env/$EXISTING" \
              -H "Authorization: Bearer ${{ secrets.VERCEL_TOKEN }}" \
              -H "Content-Type: application/json" \
              -d "{
                \"value\": \"$value\",
                \"target\": [\"production\"]
              }" > /dev/null
          else
            # Create new variable
            echo "Creating new variable $key"
            curl -s -X POST "https://api.vercel.com/v10/projects/${{ secrets.VERCEL_PROJECT_ID }}/env" \
              -H "Authorization: Bearer ${{ secrets.VERCEL_TOKEN }}" \
              -H "Content-Type: application/json" \
              -d "{
                \"key\": \"$key\",
                \"value\": \"$value\",
                \"type\": \"encrypted\",
                \"target\": [\"production\"]
              }" > /dev/null
          fi
          
          echo "✅ $key set successfully"
        }
        
        # Install jq for JSON parsing
        sudo apt-get update && sudo apt-get install -y jq
        
        # Set all Stripe environment variables
        set_vercel_env "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" "${{ secrets.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY }}"
        set_vercel_env "STRIPE_SECRET_KEY" "${{ secrets.STRIPE_SECRET_KEY }}"
        set_vercel_env "STRIPE_WEBHOOK_SECRET" "${{ secrets.STRIPE_WEBHOOK_SECRET }}"
        set_vercel_env "NEXT_PUBLIC_APP_URL" "${{ secrets.NEXT_PUBLIC_APP_URL }}"
        set_vercel_env "NEXT_PUBLIC_ONE_TIME_PRICE_ID" "${{ secrets.NEXT_PUBLIC_ONE_TIME_PRICE_ID }}"
        set_vercel_env "NEXT_PUBLIC_SUBSCRIPTION_PRICE_ID" "${{ secrets.NEXT_PUBLIC_SUBSCRIPTION_PRICE_ID }}"
        
        echo "✅ All Stripe environment variables set in Vercel"
      env:
        VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

    # Verify environment variables are set (optional but recommended)
    - name: Verify Stripe environment variables in Vercel
      run: |
        echo "Verifying Stripe environment variables..."
        curl -s -X GET "https://api.vercel.com/v10/projects/${{ secrets.VERCEL_PROJECT_ID }}/env" \
          -H "Authorization: Bearer ${{ secrets.VERCEL_TOKEN }}" \
          | jq -r '.envs[] | select(.key | startswith("STRIPE") or startswith("NEXT_PUBLIC_STRIPE") or . == "NEXT_PUBLIC_APP_URL") | "\(.key): \(if .value then "✅ Set" else "❌ Not set" end)"'

    - name: Deploy to Vercel (with cache reset)
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod --force'
```

**Key points:**
- Variables are set BEFORE deployment so they're available during Next.js build
- Uses Vercel API (more reliable than CLI in CI/CD)
- Updates existing variables or creates new ones (idempotent)
- Verifies variables are set before deployment
- All variables are scoped to "production" environment in Vercel

### 2. Update Documentation

**File: `docs/GITHUB_SECRETS_SETUP.md`**

Add a new section for Stripe secrets:

```markdown
### Stripe Secrets (Required for Payment Processing)

**⚠️ IMPORTANT**: Use **LIVE/Production** Stripe keys in GitHub secrets, NOT test keys.

Add these secrets to the **production environment**:

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (starts with `pk_live_` for production)
- `STRIPE_SECRET_KEY` - Stripe secret key (starts with `sk_live_` for production)
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret (starts with `whsec_`)
- `NEXT_PUBLIC_APP_URL` - Production app URL (e.g., `https://your-app.vercel.app`)
- `NEXT_PUBLIC_ONE_TIME_PRICE_ID` - Stripe price ID for one-time payments (starts with `price_`)
- `NEXT_PUBLIC_SUBSCRIPTION_PRICE_ID` - Stripe price ID for subscriptions (starts with `price_`)

**How to add:**
1. Go to Settings → Secrets and variables → Actions → Environments
2. Click on "production" environment
3. Click "Add secret" for each variable above
4. **Get production values from Stripe Dashboard** (switch to Live Mode):
   - Go to https://dashboard.stripe.com/apikeys (switch to Live mode)
   - Copy publishable key (starts with `pk_live_`)
   - Copy secret key (starts with `sk_live_`)
   - For webhook secret: Go to Developers → Webhooks → Your endpoint → Signing secret
   - For price IDs: Go to Products → Select product → Copy Price ID

**⚠️ Do NOT use test keys (`pk_test_`, `sk_test_`) in production environment secrets!**
```

**File: `docs/VERCEL_DEPLOYMENT.md`**

Update the environment variables section to note that Stripe variables are automatically set by GitHub Actions workflow.

### 3. Create Setup Guide

**File: `docs/STRIPE_GITHUB_SECRETS_SETUP.md`** (new file)

Create a comprehensive guide explaining:

- How Stripe environment variables work in Next.js (build-time vs runtime)
- How to add Stripe secrets to GitHub environment secrets
- Where to find production values in Stripe Dashboard (Live mode)
- How the workflow automatically sets them in Vercel
- Difference between test and live Stripe keys
- Troubleshooting common issues (missing variables, wrong keys, etc.)
- How to verify variables are set correctly in Vercel

## Key Considerations

1. **Environment Variables in Next.js Production**:

   - Next.js reads environment variables from Vercel's environment at build time and runtime
   - `NEXT_PUBLIC_*` variables are embedded in the client bundle at build time
   - Server-side variables (like `STRIPE_SECRET_KEY`) are available at runtime
   - Variables must be set in Vercel BEFORE deployment for them to be available during build

2. **Environment Scope**:

   - GitHub secrets are in the `production` environment, accessible when workflow specifies `environment: production`
   - Variables are set in Vercel with `target: ["production"]` so they only apply to production deployments

3. **Stripe Keys**:

   - **Production MUST use LIVE keys** (`pk_live_`, `sk_live_`), NOT test keys
   - Test keys in production will cause payment failures
   - Price IDs must match the Stripe account mode (live vs test)

4. **Idempotency**: The workflow checks if variables exist and updates them, or creates new ones - safe to run multiple times.

5. **Security**:

   - All secrets are encrypted in GitHub
   - Only accessible during workflow execution
   - Variables are encrypted in Vercel

6. **Timing**: Variables are set BEFORE deployment so they're available during Next.js build process.

## Testing & Verification

After implementation:

1. **Verify GitHub Secrets**:

   - Go to Settings → Secrets and variables → Actions → Environments → production
   - Confirm all 6 Stripe secrets are present
   - Verify they use LIVE keys (not test keys)

2. **Trigger Workflow**:

   - Push to main branch or manually trigger workflow
   - Watch the "Set Stripe environment variables in Vercel" step
   - Check logs for "✅ [key] set successfully" messages

3. **Verify in Vercel**:

   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Filter by "Production" environment
   - Verify all 6 variables are present and have values

4. **Test Deployment**:

   - After successful deployment, test Stripe checkout flow
   - Verify payments process correctly
   - Check webhook events are received
   - Monitor Vercel function logs for any Stripe-related errors

5. **Verify Application Code**:

   - The app uses `process.env.STRIPE_SECRET_KEY` (server-side)
   - The app uses `process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (client-side)
   - These will automatically read from Vercel's environment variables in production

## Files to Modify

- `.github/workflows/main-pipeline.yml` - Add step to set Vercel environment variables
- `docs/GITHUB_SECRETS_SETUP.md` - Add Stripe secrets section

- `docs/VERCEL_DEPLOYMENT.md` - Update to note automatic Stripe variable setup
- `docs/STRIPE_GITHUB_SECRETS_SETUP.md` - New comprehensive setup guide



