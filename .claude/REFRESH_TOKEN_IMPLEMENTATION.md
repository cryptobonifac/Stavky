# Refresh Token Implementation Documentation

## Overview

This document describes the refresh token handling mechanism implemented for the Next.js + Supabase application. The implementation ensures that expired or invalid refresh tokens don't cause unhandled errors in production, while maintaining automatic session refresh for active users.

## Problem Statement

### Initial Issue
- **Error**: `refresh_token_not_found` errors appearing in Vercel production logs
- **Root Cause**: 35+ server components and API routes called `supabase.auth.getUser()` without error handling
- **Impact**: Unhandled errors in serverless environment when refresh tokens expired/became invalid

### User Requirements
1. Implement proper automatic token refresh so users never see errors or get logged out unexpectedly
2. Eliminate `refresh_token_not_found` errors from production logs
3. Maintain Supabase SSR's automatic cookie-based token management (no localStorage)
4. Work seamlessly in Vercel serverless environment

## Architecture

### Token Storage Strategy

**Current Implementation:**
- ✅ HTTP-only cookies managed by `@supabase/ssr`
- ✅ Automatic token persistence via Supabase SSR library
- ✅ No client-side token storage (production-safe for serverless)
- ✅ Tokens automatically included in requests via cookies

**Session Configuration:**
- JWT Access Token Expiry: 1 hour
- Refresh Token Rotation: Enabled
- Refresh Token Reuse Interval: 10 seconds

### Implementation Components

#### 1. Safe Auth Client Wrapper (`lib/supabase/server.ts`)

**Purpose:** Centralized error handling for refresh token errors

**Implementation:**
```typescript
export async function createSafeAuthClient() {
  const supabase = await createClient()
  const originalAuth = supabase.auth

  // Proxy to intercept auth.getUser() calls
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

**Key Features:**
- Uses JavaScript Proxy to intercept `auth.getUser()` calls
- Returns `{ user: null, error: null }` for expected token errors
- Logs unexpected auth errors for debugging
- Preserves all other Supabase client methods (`.from()`, `.storage`, etc.)
- Uses `Object.defineProperty` to maintain prototype chain

#### 2. Proactive Token Refresh (`components/providers/auth-provider.tsx`)

**Purpose:** Automatically refresh sessions before they expire

**Implementation:**
```typescript
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
          console.log('Session refresh failed:', error.message)
        }
      } catch (error) {
        console.log('Error refreshing session:', error)
      }
    }, timeUntilRefresh)

    return () => clearTimeout(timer)
  }
}, [session, supabase])
```

**Key Features:**
- Refreshes session 5 minutes before JWT expiry
- Uses `setTimeout` based on `session.expires_at`
- Handles refresh failures gracefully
- Cleans up timer on unmount or session change

#### 3. Updated Import Pattern (35 files)

**Before:**
```typescript
import { createClient } from '@/lib/supabase/server'
```

**After:**
```typescript
import { createSafeAuthClient as createClient } from '@/lib/supabase/server'
```

**Files Updated:**
- 9 server page components in `app/[locale]/`
- 20 API routes in `app/api/`
- 3 server actions in `app/*/actions.ts`
- 3 other server files

## How It Works

### Server-Side Flow (Server Components & API Routes)

1. **Component/Route Calls Auth:**
   ```typescript
   const supabase = await createClient()
   const { data: { user } } = await supabase.auth.getUser()
   ```

2. **Proxy Intercepts Call:**
   - If refresh token is valid → Returns user data normally
   - If refresh token is expired/invalid → Returns `{ user: null, error: null }` instead of throwing

3. **Component Handles Response:**
   ```typescript
   if (!user) {
     redirect({ href: '/login', locale })
   }
   ```

4. **User Experience:**
   - Active sessions: Works normally, no interruption
   - Expired sessions: Clean redirect to login page
   - No error pages or crashes

### Client-Side Flow (Browser)

1. **User Logs In:**
   - OAuth flow completes
   - Session stored in HTTP-only cookies
   - `expires_at` timestamp set (current time + 1 hour)

2. **Proactive Refresh:**
   - Timer set for 55 minutes (1 hour - 5 min buffer)
   - At 55 minutes: `supabase.auth.refreshSession()` called automatically
   - New tokens stored in cookies
   - New timer set for next refresh

3. **User Experience:**
   - Session seamlessly refreshed in background
   - No interruption to user activity
   - User stays logged in indefinitely while active

### Edge Cases Handled

✅ **Expired Refresh Tokens**
- Server: Returns null user → Redirect to login
- Client: Refresh fails → onAuthStateChange triggers logout

✅ **Invalid/Corrupted Tokens**
- Caught by proxy → Returns null user gracefully
- No error thrown, clean redirect

✅ **First-Time Visitors**
- No tokens present → Returns null user
- Standard redirect to login page

✅ **Cleared Cookies**
- Same as expired tokens → Clean redirect to login

✅ **Token Rotation Failures**
- Logged appropriately for debugging
- User redirected to login

✅ **Serverless Cold Starts**
- No in-memory state dependency
- Relies entirely on cookies (persisted across invocations)

## Files Modified

### Core Library
- `lib/supabase/server.ts` - Added `createSafeAuthClient()` wrapper

### Server Components (9 files)
- `app/[locale]/bettings/customers/page.tsx`
- `app/[locale]/bettings/manage/page.tsx`
- `app/[locale]/bettings/page.tsx`
- `app/[locale]/contacts/page.tsx`
- `app/[locale]/history/page.tsx`
- `app/[locale]/newbet/page.tsx`
- `app/[locale]/profile/page.tsx`
- `app/[locale]/settings/page.tsx`
- `app/[locale]/statistics/page.tsx`

### API Routes (20 files)
- `app/api/balance-history/route.ts`
- `app/api/betting-tips/route.ts`
- `app/api/betting-tips/[id]/route.ts`
- `app/api/contacts/route.ts`
- `app/api/contacts/[id]/route.ts`
- `app/api/debug-db/route.ts`
- `app/api/profile/route.ts`
- `app/api/settings/betting-companies/route.ts`
- `app/api/settings/betting-companies/[id]/route.ts`
- `app/api/settings/delete-all-tips/route.ts`
- `app/api/settings/marketing/route.ts`
- `app/api/settings/results/route.ts`
- `app/api/settings/results/[id]/route.ts`
- `app/api/settings/sports/route.ts`
- `app/api/settings/sports/[id]/route.ts`
- `app/api/settings/user-subscriptions/free-month/route.ts`
- `app/api/settings/users/[id]/route.ts`
- `app/api/subscription/cancel/route.ts`
- `app/api/test-seed-data/route.ts`
- `app/api/test-supabase/route.ts`

### Server Actions (3 files)
- `app/bettings/manage/page.tsx`
- `app/checkout/actions.ts`
- `app/subscription/actions.ts`

### Client Provider
- `components/providers/auth-provider.tsx` - Added proactive token refresh

**Total: 34 files updated**

## Benefits

### Production Safety
✅ **No more `refresh_token_not_found` errors in logs**
- Expected token errors are caught and handled gracefully
- Only unexpected errors are logged

✅ **Graceful degradation**
- Expired sessions result in clean redirect to login
- No error pages shown to users

✅ **Proper error visibility**
- Actual auth issues (not token expiry) are logged
- Easier to identify real problems

### User Experience
✅ **Seamless sessions**
- Active users never experience interruptions
- Sessions automatically refresh every hour

✅ **No unexpected logouts**
- Proactive refresh prevents expiry during use
- Clean logout flow when truly expired

✅ **Fast page loads**
- No additional database queries for auth
- Cookies handled efficiently by browser/server

### Code Quality
✅ **Centralized error handling**
- No need to add try-catch to 35+ files
- Single source of truth for token error logic

✅ **Maintains existing patterns**
- No breaking changes to consuming code
- Existing `getUser()` calls work unchanged

✅ **Type-safe**
- Full TypeScript support
- No type casting required

## Testing

### Local Testing

1. **Test Normal Flow:**
   ```bash
   npm run dev
   ```
   - Login via Google OAuth
   - Navigate between pages
   - Verify no errors in console

2. **Test Expired Session:**
   - Login to app
   - Open browser DevTools → Application → Cookies
   - Delete `sb-<project>-auth-token` cookie
   - Refresh page
   - Should redirect to login (no error page)

3. **Test Proactive Refresh:**
   - Login to app
   - Open browser console
   - Wait 55 minutes (or manually trigger by adjusting system time)
   - Check Network tab for refresh request
   - Verify new session set

### Production Testing (Vercel)

1. **Deploy Changes:**
   ```bash
   git add .
   git commit -m "Implement refresh token handling"
   git push
   ```

2. **Monitor Logs:**
   - Go to Vercel dashboard
   - Check Runtime Logs
   - Verify no `refresh_token_not_found` errors

3. **Test User Flows:**
   - Login → Navigate → Wait for expiry → Navigate
   - Verify graceful logout behavior
   - Check that OAuth still works correctly

## Troubleshooting

### Issue: "supabase.from is not a function"

**Cause:** Using spread operator breaks prototype chain

**Solution:** Use `Object.defineProperty` to replace auth property:
```typescript
Object.defineProperty(supabase, 'auth', {
  value: authProxy,
  writable: false,
  configurable: true,
  enumerable: true
})
return supabase // Return original client
```

**Incorrect:**
```typescript
return { ...supabase, auth: authProxy } // Breaks methods
```

### Issue: Sessions still expiring unexpectedly

**Check:**
1. Verify proactive refresh is running:
   ```typescript
   // In auth-provider.tsx, add debug log
   console.log('Setting refresh timer for:', timeUntilRefresh)
   ```

2. Check session expiry:
   ```typescript
   // In browser console
   const { data } = await supabase.auth.getSession()
   console.log('Expires at:', new Date(data.session.expires_at * 1000))
   ```

3. Verify Supabase config:
   ```toml
   # supabase/config.toml
   jwt_expiry = 3600 # Should be 1 hour
   enable_refresh_token_rotation = true
   ```

### Issue: Refresh token errors still appearing in logs

**Check:**
1. Verify all imports updated:
   ```bash
   grep -r "createClient.*from '@/lib/supabase/server'" app --include="*.ts" --include="*.tsx" | grep -v "createSafeAuthClient"
   ```
   Should return 0 results.

2. Check middleware is using safe client:
   - `lib/supabase/middleware.ts` has try-catch
   - `proxy.ts` has try-catch

3. Verify error message patterns:
   ```typescript
   // In createSafeAuthClient
   if (
     error?.code === 'refresh_token_not_found' ||
     error?.message?.includes('refresh_token_not_found') ||
     error?.message?.includes('Invalid Refresh Token')
   )
   ```

### Issue: TypeScript errors after implementation

**Common Issues:**
1. Missing type import:
   ```typescript
   import type { SupabaseClient } from '@supabase/supabase-js'
   ```

2. Proxy receiver parameter:
   ```typescript
   get(target, prop, receiver) { // receiver is required
     return Reflect.get(target, prop, receiver)
   }
   ```

## Rollback Plan

If issues occur in production:

1. **Quick Rollback:**
   ```bash
   # Revert all imports back to createClient
   git revert HEAD
   git push
   ```

2. **Partial Rollback:**
   - Keep `createSafeAuthClient` but don't use it
   - Revert imports file by file
   - Isolate which component is causing issues

3. **Alternative Approach:**
   If proxy doesn't work, use explicit helper:
   ```typescript
   // lib/supabase/server.ts
   export async function getSafeUser() {
     const supabase = await createClient()
     try {
       return await supabase.auth.getUser()
     } catch (error: any) {
       if (error?.code === 'refresh_token_not_found') {
         return { data: { user: null }, error: null }
       }
       throw error
     }
   }
   ```

## Success Criteria

✅ **No `refresh_token_not_found` errors in Vercel logs**
✅ **Users with expired sessions see login page (not error page)**
✅ **Active users never experience session interruption**
✅ **OAuth login continues to work correctly**
✅ **Protected routes redirect properly on invalid session**
✅ **Build completes successfully with TypeScript validation**
✅ **All Supabase client methods work (`.from()`, `.storage`, etc.)**

## Additional Resources

- **Supabase SSR Documentation:** https://supabase.com/docs/guides/auth/server-side-rendering
- **Next.js Middleware:** https://nextjs.org/docs/app/building-your-application/routing/middleware
- **JavaScript Proxy:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
- **OAuth Flow Documentation:** See `.claude/CLAUDE.md`

## Maintenance

### When to Update

1. **Supabase SSR Package Updates:**
   - Review changelog for auth changes
   - Test refresh token handling still works
   - Update error message patterns if needed

2. **Adding New Server Components:**
   - Always use `createSafeAuthClient as createClient`
   - Follow existing pattern in other components

3. **Changing Session Configuration:**
   - Update `supabase/config.toml`
   - Adjust proactive refresh buffer if needed
   - Test with new expiry times

### Monitoring

**Production Metrics to Watch:**
- Vercel Runtime Logs: Filter for "auth error"
- User logout rate (should be low)
- Session refresh success rate
- OAuth callback success rate

**Alerts to Set:**
- Spike in "Unexpected Supabase auth error" logs
- Increase in 401 responses from API routes
- OAuth callback failures

## Summary

This implementation provides a production-safe, user-friendly refresh token handling mechanism that:
- Eliminates unhandled errors in production logs
- Maintains seamless sessions for active users
- Handles token expiry gracefully
- Requires minimal code changes
- Follows Supabase SSR best practices

The combination of server-side error handling and client-side proactive refresh ensures users have a smooth experience while maintaining security and proper error visibility for debugging.
