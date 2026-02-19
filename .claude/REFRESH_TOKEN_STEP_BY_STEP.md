# Step-by-Step Guide: Implementing Refresh Token Handling in Next.js + Supabase

This guide provides a step-by-step process for implementing proper refresh token handling in any Next.js + Supabase SSR project.

## Prerequisites

- Next.js 13+ (App Router)
- `@supabase/ssr` package installed
- `@supabase/supabase-js` package installed
- Existing authentication setup with Supabase

## Step 1: Identify the Problem

### Check if you have refresh token errors:

1. **Review production logs (Vercel/your hosting platform):**
   ```
   [AuthApiError]: Invalid Refresh Token: Refresh Token Not Found
   refresh_token_not_found
   ```

2. **Identify files that call `supabase.auth.getUser()`:**
   ```bash
   # Find all server-side auth calls
   grep -r "supabase.auth.getUser()" app --include="*.ts" --include="*.tsx"
   ```

3. **Confirm the issue:**
   - Errors occur when sessions expire
   - Errors appear in server-side code (server components, API routes)
   - App works fine, but logs are flooded with errors

## Step 2: Create Safe Auth Client Wrapper

### Location: `lib/supabase/server.ts` (or wherever your server client is)

Add this function to your existing server Supabase client file:

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { SupabaseClient } from '@supabase/supabase-js'

// Keep your existing createClient function unchanged
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component context - ignore
          }
        },
      },
    }
  )
}

// ADD THIS NEW FUNCTION:
/**
 * Creates a Supabase client with automatic refresh token error handling.
 * Use this in server components and API routes to prevent unhandled errors
 * when refresh tokens expire in production.
 */
export async function createSafeAuthClient() {
  const supabase = await createClient()
  const originalAuth = supabase.auth

  // Create a proxy to intercept auth.getUser() calls
  const authProxy = new Proxy(originalAuth, {
    get(target, prop, receiver) {
      if (prop === 'getUser') {
        return async () => {
          try {
            return await target.getUser()
          } catch (error: any) {
            // Handle expected refresh token errors gracefully
            if (
              error?.code === 'refresh_token_not_found' ||
              error?.message?.includes('refresh_token_not_found') ||
              error?.message?.includes('Invalid Refresh Token')
            ) {
              // Return null user for expired/invalid tokens (expected behavior)
              return { data: { user: null }, error: null }
            }

            // Log unexpected auth errors
            console.error('Unexpected Supabase auth error:', error)
            throw error
          }
        }
      }
      return Reflect.get(target, prop, receiver)
    }
  })

  // Replace auth property while preserving all other client methods
  Object.defineProperty(supabase, 'auth', {
    value: authProxy,
    writable: false,
    configurable: true,
    enumerable: true
  })

  return supabase
}
```

### ⚠️ Critical Implementation Details:

1. **Use `Object.defineProperty`** (not spread operator):
   - ✅ Correct: `Object.defineProperty(supabase, 'auth', { value: authProxy })`
   - ❌ Wrong: `{ ...supabase, auth: authProxy }` (breaks `.from()`, `.storage`, etc.)

2. **Use `Reflect.get`** for other properties:
   - ✅ Correct: `Reflect.get(target, prop, receiver)`
   - ❌ Wrong: `target[prop]` (TypeScript error)

3. **Return the original client**:
   - ✅ Correct: `return supabase`
   - ❌ Wrong: `return { ...supabase, auth: authProxy } as SupabaseClient`

## Step 3: Update All Server-Side Imports

### Find all files that import from your server client:

```bash
# List all files that need updating
grep -r "from '@/lib/supabase/server'" app --include="*.ts" --include="*.tsx"
```

### Update each file's import:

**Before:**
```typescript
import { createClient } from '@/lib/supabase/server'
// or
import { createClient as createServerClient } from '@/lib/supabase/server'
```

**After:**
```typescript
import { createSafeAuthClient as createClient } from '@/lib/supabase/server'
// or
import { createSafeAuthClient as createServerClient } from '@/lib/supabase/server'
```

### Automated approach (Linux/Mac):

```bash
# Create a list of files to update
FILES=(
  "app/api/profile/route.ts"
  "app/[locale]/dashboard/page.tsx"
  # ... add all your files
)

# Update each file
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    sed -i "s/import { createClient as createServerClient } from '@\/lib\/supabase\/server'/import { createSafeAuthClient as createServerClient } from '@\/lib\/supabase\/server'/g" "$file"
    sed -i "s/import { createClient } from '@\/lib\/supabase\/server'/import { createSafeAuthClient as createClient } from '@\/lib\/supabase\/server'/g" "$file"
    echo "Updated: $file"
  fi
done
```

### Automated approach (Windows PowerShell):

```powershell
$files = @(
  "app\api\profile\route.ts",
  "app\[locale]\dashboard\page.tsx"
  # ... add all your files
)

foreach ($file in $files) {
  if (Test-Path $file) {
    $content = Get-Content $file -Raw
    $content = $content -replace "import { createClient as createServerClient } from '@/lib/supabase/server'","import { createSafeAuthClient as createServerClient } from '@/lib/supabase/server'"
    $content = $content -replace "import { createClient } from '@/lib/supabase/server'","import { createSafeAuthClient as createClient } from '@/lib/supabase/server'"
    Set-Content $file $content -NoNewline
    Write-Host "Updated: $file"
  }
}
```

### Verify all files updated:

```bash
# Should return 0 files
grep -r "createClient.*from '@/lib/supabase/server'" app --include="*.ts" --include="*.tsx" | grep -v "createSafeAuthClient"
```

## Step 4: Add Proactive Token Refresh (Optional but Recommended)

### Location: Your auth provider component (e.g., `components/providers/auth-provider.tsx`)

Add this `useEffect` hook to your auth provider:

```typescript
'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Session, User } from '@supabase/supabase-js'

export const AuthProvider = ({ children }) => {
  const supabase = useMemo(() => createClient(), [])
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)

  // ... existing code for getSession, onAuthStateChange, etc.

  // ADD THIS HOOK:
  // Proactive token refresh: refresh session 5 minutes before expiry
  useEffect(() => {
    if (!session?.expires_at) return

    // Calculate time until token expires (with 5 min buffer)
    const expiresAt = session.expires_at * 1000 // Convert to milliseconds
    const now = Date.now()
    const fiveMinutes = 5 * 60 * 1000
    const timeUntilRefresh = expiresAt - now - fiveMinutes

    // Only set timer if expiry is more than 5 minutes away
    if (timeUntilRefresh > 0) {
      const timer = setTimeout(async () => {
        try {
          const { data, error } = await supabase.auth.refreshSession()
          if (!error && data.session) {
            setSession(data.session)
            setUser(data.session.user)
          } else if (error) {
            // Silently handle refresh errors
            console.log('Session refresh failed:', error.message)
          }
        } catch (error) {
          console.log('Error refreshing session:', error)
        }
      }, timeUntilRefresh)

      return () => clearTimeout(timer)
    }
  }, [session, supabase])

  // ... rest of your provider code
}
```

### Key parameters to adjust:

- **Buffer time**: Default is 5 minutes (`5 * 60 * 1000`)
  - Shorter buffer (1-2 min): More aggressive refresh, lower chance of expiry
  - Longer buffer (10+ min): Less frequent refreshes, higher chance of edge case expiry

- **JWT expiry time**: Set in `supabase/config.toml`:
  ```toml
  jwt_expiry = 3600  # 1 hour in seconds
  ```

## Step 5: Test the Implementation

### Local Testing:

1. **Build the project:**
   ```bash
   npm run build
   # Should complete without TypeScript errors
   ```

2. **Start dev server:**
   ```bash
   npm run dev
   ```

3. **Test normal flow:**
   - Login to your app
   - Navigate between pages
   - Verify no errors in console
   - Check that protected routes work

4. **Test expired session:**
   - Login to app
   - Open DevTools → Application → Cookies
   - Delete the `sb-<project>-auth-token` cookie
   - Refresh the page
   - **Expected:** Clean redirect to login (no error page)

5. **Test proactive refresh (optional):**
   - Login to app
   - Open browser console
   - Check Network tab after 55 minutes (or adjust system time)
   - **Expected:** See refresh request, new session set

### Production Testing:

1. **Deploy to production:**
   ```bash
   git add .
   git commit -m "Implement refresh token handling"
   git push
   ```

2. **Monitor logs:**
   - Check your hosting platform logs (Vercel, etc.)
   - Search for `refresh_token_not_found`
   - **Expected:** Zero occurrences after deployment

3. **Test user flows:**
   - Login → Navigate → Let session expire → Navigate
   - **Expected:** Graceful redirect to login

## Step 6: Troubleshooting

### Issue: TypeScript error "Element implicitly has 'any' type"

**Error:**
```
Type error: Element implicitly has an 'any' type because expression of type 'string | symbol'
can't be used to index type 'SupabaseAuthClient'.
```

**Fix:**
```typescript
// Use Reflect.get instead of target[prop]
return Reflect.get(target, prop, receiver)
```

### Issue: "supabase.from is not a function"

**Error:**
```
Runtime TypeError: supabase.from is not a function
```

**Cause:** Using spread operator instead of `Object.defineProperty`

**Fix:**
```typescript
// ❌ Wrong:
return { ...supabase, auth: authProxy } as SupabaseClient

// ✅ Correct:
Object.defineProperty(supabase, 'auth', {
  value: authProxy,
  writable: false,
  configurable: true,
  enumerable: true
})
return supabase
```

### Issue: Errors still appearing in logs

**Check:**
1. Verify all imports updated:
   ```bash
   grep -r "createClient.*from '@/lib/supabase/server'" app | grep -v "createSafeAuthClient"
   ```

2. Check error message patterns match:
   ```typescript
   if (
     error?.code === 'refresh_token_not_found' ||
     error?.message?.includes('refresh_token_not_found') ||
     error?.message?.includes('Invalid Refresh Token')
   )
   ```

3. Verify middleware also has error handling:
   ```typescript
   // In your middleware.ts or proxy.ts
   try {
     await supabase.auth.getUser()
   } catch (error: any) {
     if (error?.code !== 'refresh_token_not_found') {
       console.error('Auth error:', error)
     }
   }
   ```

## Step 7: Verify Success

### Checklist:

- ✅ Build completes without errors
- ✅ TypeScript validation passes
- ✅ All pages load correctly in dev
- ✅ Protected routes redirect when not authenticated
- ✅ Login flow works (OAuth, email/password)
- ✅ Sessions persist across page refreshes
- ✅ No `refresh_token_not_found` in production logs
- ✅ Expired sessions redirect to login (no error page)
- ✅ All Supabase methods work (`.from()`, `.storage`, etc.)

## Complete Example: API Route

**Before:**
```typescript
// app/api/profile/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  // ❌ Throws error if refresh token expired

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ... rest of route
}
```

**After:**
```typescript
// app/api/profile/route.ts
import { createSafeAuthClient as createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  // ✅ Returns { user: null } if refresh token expired (no error thrown)

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ... rest of route (unchanged)
}
```

**Key point:** The consuming code doesn't change, only the import!

## Complete Example: Server Component

**Before:**
```typescript
// app/[locale]/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  // ❌ Throws error if refresh token expired

  if (!user) {
    redirect('/login')
  }

  // ... rest of component
}
```

**After:**
```typescript
// app/[locale]/dashboard/page.tsx
import { createSafeAuthClient as createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  // ✅ Returns { user: null } if refresh token expired (no error thrown)

  if (!user) {
    redirect('/login')
  }

  // ... rest of component (unchanged)
}
```

## Advanced: Custom Error Messages

If you want to customize error handling per route:

```typescript
export async function createSafeAuthClient(options?: {
  onRefreshTokenError?: (error: any) => void
}) {
  const supabase = await createClient()
  const originalAuth = supabase.auth

  const authProxy = new Proxy(originalAuth, {
    get(target, prop, receiver) {
      if (prop === 'getUser') {
        return async () => {
          try {
            return await target.getUser()
          } catch (error: any) {
            if (
              error?.code === 'refresh_token_not_found' ||
              error?.message?.includes('refresh_token_not_found')
            ) {
              // Call custom handler if provided
              options?.onRefreshTokenError?.(error)
              return { data: { user: null }, error: null }
            }
            console.error('Unexpected Supabase auth error:', error)
            throw error
          }
        }
      }
      return Reflect.get(target, prop, receiver)
    }
  })

  Object.defineProperty(supabase, 'auth', {
    value: authProxy,
    writable: false,
    configurable: true,
    enumerable: true
  })

  return supabase
}

// Usage:
const supabase = await createSafeAuthClient({
  onRefreshTokenError: (error) => {
    console.log('Custom handling for expired token in this route')
  }
})
```

## Summary

This implementation requires:
1. **One new function** (`createSafeAuthClient`)
2. **Import updates** (automated with find-replace)
3. **One useEffect hook** (optional proactive refresh)

**Benefits:**
- ✅ Zero unhandled errors in production
- ✅ Seamless user experience
- ✅ Minimal code changes
- ✅ Easy to maintain

**Time to implement:** 15-30 minutes for a typical project

You can now replicate this in any Next.js + Supabase project!
