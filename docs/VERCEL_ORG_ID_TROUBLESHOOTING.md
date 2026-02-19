# Vercel "Project not found" Error - Troubleshooting

## Error Message
```
Error! Project not found ({"VERCEL_PROJECT_ID":"***","VERCEL_ORG_ID":"***"})
```

## Common Causes

### 1. Wrong VERCEL_ORG_ID (Most Common)

**For Personal Accounts:**
- `VERCEL_ORG_ID` must be your **Vercel User ID**, not a Team ID
- Team IDs start with `team_` but User IDs don't have that prefix
- If you're using a personal account, the `VERCEL_ORG_ID` should be your User ID

**How to Find Your Vercel User ID:**

1. **Method 1: Via Vercel Dashboard**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click on your profile/avatar (top right)
   - Go to **Settings** → **General**
   - Your **User ID** is displayed there (it's a long string, not starting with `team_`)

2. **Method 2: Via Vercel CLI**
   ```bash
   npx vercel whoami
   # Then check your .vercel/project.json or run:
   npx vercel link
   # This will show your org/user ID
   ```

3. **Method 3: Check .vercel folder**
   - If you've linked the project locally, check `.vercel/project.json`
   - Look for `orgId` - this is your User ID for personal accounts

4. **Method 4: Via API**
   ```bash
   curl -H "Authorization: Bearer YOUR_VERCEL_TOKEN" https://api.vercel.com/v2/user
   ```
   The response will contain your `user.id` field.

### 2. Wrong VERCEL_PROJECT_ID

**How to Find Your Project ID:**

1. **Via Vercel Dashboard**
   - Go to your project in Vercel
   - Click **Settings** → **General**
   - Scroll to **Project ID** section
   - Copy the Project ID (starts with `prj_`)

2. **Via .vercel folder**
   - Check `.vercel/project.json` in your project root
   - Look for `projectId` field

### 3. Token Doesn't Have Access

- Ensure your Vercel token has access to the project
- The token must be created with the correct permissions
- If using a team, the token must have team access

## Quick Fix Steps

### Step 1: Verify Your Account Type

**Personal Account:**
- Use your **User ID** as `VERCEL_ORG_ID`
- User ID is a long string (no `team_` prefix)

**Team Account:**
- Use your **Team ID** as `VERCEL_ORG_ID`
- Team ID starts with `team_`

### Step 2: Get the Correct Values

1. **Get User ID (Personal Account):**
   ```bash
   # Install Vercel CLI if needed
   npm i -g vercel
   
   # Login
   vercel login
   
   # Link your project (if not already linked)
   vercel link
   
   # Check the .vercel/project.json file
   cat .vercel/project.json
   ```
   
   Look for:
   ```json
   {
     "orgId": "your-user-id-here",  // This is VERCEL_ORG_ID
     "projectId": "prj_xxxxx"        // This is VERCEL_PROJECT_ID
   }
   ```

2. **Or via Dashboard:**
   - Settings → General → Copy User ID and Project ID

### Step 3: Update GitHub Secrets

1. Go to: `https://github.com/cryptobonifac/Stavky/settings/environments`
2. Click on **Production** environment
3. Update the secrets:
   - `VERCEL_ORG_ID`: Your User ID (for personal) or Team ID (for team)
   - `VERCEL_PROJECT_ID`: Your Project ID (starts with `prj_`)

### Step 4: Verify Token Permissions

1. Go to [Vercel Tokens](https://vercel.com/account/tokens)
2. Check your token has:
   - Full access to projects
   - Access to the correct team/user account

## Testing the Configuration

After updating secrets, you can test locally:

```bash
# Set environment variables
export VERCEL_TOKEN="your-token"
export VERCEL_ORG_ID="your-user-id"
export VERCEL_PROJECT_ID="prj_xxxxx"

# Test deployment
npx vercel --prod --token=$VERCEL_TOKEN
```

If this works locally, the GitHub Actions should work too.

## Common Mistakes

1. ❌ Using Team ID (`team_xxx`) for personal account
2. ❌ Using Project name instead of Project ID
3. ❌ Using old/expired token
4. ❌ Token doesn't have access to the project
5. ❌ Wrong project ID (from different account)

## Verification Checklist

- [ ] `VERCEL_ORG_ID` is your User ID (personal) or Team ID (team)
- [ ] `VERCEL_PROJECT_ID` starts with `prj_`
- [ ] `VERCEL_TOKEN` is valid and not expired
- [ ] Token has access to the project
- [ ] All values are in the Production environment secrets
- [ ] No extra spaces or line breaks in secret values

## Still Not Working?

1. **Check the workflow logs** - The verification step will show the values (masked)
2. **Try deploying manually** - Use Vercel CLI to verify credentials work
3. **Recreate the token** - Sometimes tokens need to be refreshed
4. **Check project ownership** - Ensure you own/have access to the project




















