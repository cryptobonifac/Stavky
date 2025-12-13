# GitHub Personal Access Token Setup

## Issue
GitHub is rejecting pushes to `.github/workflows/` files because your Personal Access Token doesn't have the `workflow` scope.

## Solution: Create/Update Token with Workflow Scope

### Step 1: Create a New Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name like: `Stavky Project - Full Access`
4. Set expiration (recommended: 90 days or custom)
5. **Select these scopes:**
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows) ← **This is required!**
6. Click **"Generate token"**
7. **Copy the token immediately** (you won't see it again!)

### Step 2: Update Git Credentials

#### On Windows (PowerShell):

```powershell
# Clear old credentials
git credential-manager-core erase
# Or use:
git credential reject https://github.com

# When you push next time, it will prompt for credentials
# Username: your-github-username
# Password: paste-your-new-token-here
```

#### Alternative: Update Credential Manager

1. Open **Windows Credential Manager**
   - Press `Win + R`, type `control /name Microsoft.CredentialManager`
   - Or search "Credential Manager" in Start menu
2. Go to **Windows Credentials**
3. Find `git:https://github.com`
4. Click **Edit**
5. Update the password with your new token
6. Click **Save**

### Step 3: Test the Push

```bash
git push origin main
```

## Alternative: Use SSH Instead

If you prefer not to manage tokens, you can switch to SSH:

### Step 1: Check if you have SSH keys

```bash
ls ~/.ssh/id_*.pub
```

If you see files, you have SSH keys. If not, generate one:

```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
```

### Step 2: Add SSH key to GitHub

1. Copy your public key:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
2. Go to: https://github.com/settings/keys
3. Click **"New SSH key"**
4. Paste the key and save

### Step 3: Switch remote to SSH

```bash
git remote set-url origin git@github.com:cryptobonifac/Stavky.git
```

### Step 4: Test

```bash
git push origin main
```

## Quick Fix: Temporarily Exclude Workflow File

If you need to push urgently and can't update the token right now:

```bash
# Remove workflow file from staging
git reset HEAD .github/workflows/nextjs.yml

# Commit and push other changes
git commit -m "Your commit message"
git push

# Later, after updating token, add workflow file back
git add .github/workflows/nextjs.yml
git commit -m "Add GitHub workflow for migrations"
git push
```

## Verification

After updating your token, verify it works:

```bash
git push origin main
```

You should see the push succeed without the workflow scope error.








