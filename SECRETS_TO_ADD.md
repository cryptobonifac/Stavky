# GitHub Secrets Setup Guide

The "Deploy to Vercel" action is failing because it cannot access your **Secrets** on GitHub.
You must manually add these in your repository settings.

**Go to:**
> **Settings** > **Secrets and variables** > **Actions** > **New repository secret**

Add these 5 secrets exactly as written below:

### 1. VERCEL_TOKEN
**Value:**
```
Vo9y6tdMIaDDbWKxQTEgne61
```

### 2. VERCEL_ORG_ID
**Value:**
```
team_XkG11udHVddz4sioFLNrLfG2
```
*Note: For personal accounts, this value corresponds to your Vercel User ID. In Vercel contexts, `organization_id` effectively means your User ID or Team ID depending on your plan.*

### 3. VERCEL_PROJECT_ID
**Value:**
```
prj_VytCa4X9M6HWVsf2kUwEMy33674R
```

### 4. SUPABASE_DB_PASSWORD
**Value:**
```
VkGfwAMepknab2KU
```

### 5. SUPABASE_PROJECT_ID
**Value:**
```
ezhcfemzrbfsfkafqsav
```

---
*Once you have added these 5 secrets, re-run the failed job in the Actions tab.*
