# Local Supabase Studio Password Reset Issue

## Problem

When trying to reset the database password through the Supabase Studio UI (http://127.0.0.1:54323), you see:
- 404 errors in the browser console
- `PATCH /api/platform/projects/default/db-password` - 404 (Not Found)
- Password reset modal doesn't work

## Root Cause

The Supabase Studio UI includes cloud-only features. The "Reset database password" feature uses management API endpoints that **do not exist in local Supabase**. These endpoints (`/api/platform/...`) are only available in hosted Supabase projects.

## Solution

### For Local Development

**You don't need to change the password!** Local Supabase uses a fixed default password: `postgres`

You can verify this by running:
```bash
supabase status
```

You'll see the connection string:
```
│ URL │ postgresql://postgres:postgres@127.0.0.1:54322/postgres │
```

**Key Points:**
- ✅ Default password: `postgres`
- ✅ This is secure for local development (only accessible on your machine)
- ✅ No action needed - just use the default password
- ❌ Cannot change password through Studio UI (cloud-only feature)
- ❌ Console errors are harmless - Studio UI is trying to call non-existent APIs

### For Production/Cloud Projects

If you need to reset the database password for your **hosted Supabase project**:

1. Go to https://app.supabase.com
2. Select your project
3. Navigate to **Settings** → **Database**
4. Use the "Reset database password" feature there

This feature works correctly in the cloud dashboard.

## Why This Happens

The Supabase Studio UI is shared between local and cloud environments. Some features (like password reset) are designed for cloud management and call APIs that don't exist locally. The Studio UI gracefully handles this by showing errors, but your local database continues to work normally.

## Verification

To confirm your local database is working correctly:

```bash
# Check Supabase status
supabase status

# Connect to database (password is 'postgres')
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

If you can connect, everything is working correctly!

## Related Documentation

- [Supabase Troubleshooting Guide](./SUPABASE_TROUBLESHOOTING.md)
- [Local Supabase Start Guide](./LOCAL_SUPABASE_START_GUIDE.md)

