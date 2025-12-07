# Differences Between `npm run dev` and `npm run build`

## Overview

The key difference is that **`npm run dev`** runs in development mode with lenient type checking, while **`npm run build`** runs a production build with strict type checking and full static analysis.

## Key Differences

### 1. TypeScript Type Checking

#### Development Mode (`npm run dev`)
- **Lazy Type Checking**: TypeScript errors are checked on-demand as you navigate pages
- **Incremental Compilation**: Only checks files that have changed
- **Error Tolerance**: Some type errors may be ignored or shown as warnings
- **Fast Feedback**: Prioritizes speed over completeness
- **Type Generation**: Uses `.next/dev/types/**/*.ts` (as seen in `tsconfig.json` line 36)

#### Production Build (`npm run build`)
- **Full Type Checking**: TypeScript checks ALL files before building
- **Strict Validation**: All type errors must be resolved before the build completes
- **Complete Analysis**: Analyzes the entire codebase for type safety
- **Type Generation**: Uses `.next/types/**/*.ts` (production types)
- **Fails on Errors**: Build will fail if any TypeScript errors are found

### 2. Code Compilation

#### Development Mode
- **Turbopack (Fast Refresh)**: Uses Next.js Turbopack for fast compilation
- **Source Maps**: Full source maps for debugging
- **No Minification**: Code is readable and debuggable
- **Hot Module Replacement**: Changes reflect immediately

#### Production Build
- **Optimization**: Code is minified, tree-shaken, and optimized
- **Bundle Analysis**: Analyzes dependencies and creates optimized bundles
- **Static Generation**: Pre-renders pages where possible
- **Error Detection**: Catches issues that might not appear in dev mode

### 3. Static Analysis

#### Development Mode
- **Runtime Checks**: Many errors only appear at runtime
- **Loose Validation**: Some invalid code patterns may work
- **Dynamic Imports**: More lenient with dynamic imports

#### Production Build
- **Static Analysis**: Analyzes code statically before execution
- **Route Validation**: Validates all routes and their types
- **API Route Validation**: Checks API route handlers for correct types
- **Import Validation**: Strict validation of all imports and exports

### 4. Next.js Specific Differences

#### Development Mode
- **Fast Refresh**: React Fast Refresh for instant updates
- **Error Overlay**: Shows errors in browser overlay
- **Development Warnings**: Shows helpful warnings that don't block execution

#### Production Build
- **Route Generation**: Generates all routes and validates them
- **Middleware Validation**: Validates middleware types
- **Server Component Validation**: Strict validation of server component types
- **Client Component Validation**: Validates client component boundaries

### 5. Type Generation

Looking at `tsconfig.json`:
```json
"include": [
  "next-env.d.ts",
  "**/*.ts",
  "**/*.tsx",
  ".next/types/**/*.ts",
  ".next/dev/types/**/*.ts"  // Only in dev
]
```

- **Dev**: Uses `.next/dev/types/` - Generated types for development
- **Build**: Uses `.next/types/` - Production types with stricter validation

## Common Issues That Appear Only in Build

### 1. Type Assertions
```typescript
// Works in dev, fails in build
const data = (response as any).data as TipRecord[]
// Build requires proper typing
```

### 2. Null/Undefined Checks
```typescript
// Dev might allow this
if (!user) redirect('/login')
// Later: user.id  // TypeScript in build catches this
```

### 3. Route Handler Types
```typescript
// Next.js 16 requires params to be Promise
// Dev might not catch this, build will
export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Should be: { params: Promise<{ id: string }> }
}
```

### 4. Import/Export Mismatches
```typescript
// Dev: Dynamic imports with template literals might work
const messages = await import(`../../../messages/${locale}.json`)
// Build: Requires static analysis - fails with dynamic paths
```

### 5. Component Type Mismatches
```typescript
// Dev: Might allow type mismatches
<PendingTipsList tips={tips as TipRecord[]} />
// Build: Validates that tips actually matches TipRecord[]
```

## Why Your Build Fails

Based on the errors you've encountered:

1. **Type Assertions**: Using `as TipRecord[]` when the actual type doesn't match
2. **Null Checks**: TypeScript doesn't recognize that `redirect()` throws, so variables after redirect checks are still considered possibly null
3. **Route Handler Types**: Next.js 16 changed `params` to be a Promise, which build validates strictly
4. **Data Normalization**: Supabase returns arrays for relations, but your types expect objects

## Solutions

### 1. Fix Type Assertions
Instead of:
```typescript
const tips = (data ?? []) as TipRecord[]
```

Use proper normalization:
```typescript
const tips: TipRecord[] = (data ?? []).map(normalizeTip)
```

### 2. Use Non-Null Assertions After Guards
```typescript
if (!user) redirect('/login')
// TypeScript doesn't know redirect throws
const id = user!.id  // Use ! to assert non-null
```

### 3. Update Route Handlers
```typescript
// Next.js 16
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
}
```

### 4. Normalize Data Structures
```typescript
// Supabase returns arrays, normalize to objects
betting_companies: tip.betting_companies
  ? { name: tip.betting_companies.name ?? null }
  : null
```

## Best Practices

1. **Always test with `npm run build`** before deploying
2. **Fix TypeScript errors immediately** - don't rely on dev mode
3. **Use proper types** instead of `any` or type assertions
4. **Enable strict TypeScript** (already enabled in your `tsconfig.json`)
5. **Run type checking separately**: `npx tsc --noEmit` to catch errors early

## Checking Types Locally

You can run type checking without building:
```bash
npx tsc --noEmit
```

This will show you all TypeScript errors that would appear in the build.

## Summary

| Feature | Development (`npm run dev`) | Production Build (`npm run build`) |
|---------|----------------------------|-----------------------------------|
| Type Checking | Lazy, on-demand | Full, all files |
| Error Tolerance | High (warnings) | Zero (fails on error) |
| Compilation | Fast, incremental | Complete, optimized |
| Type Generation | `.next/dev/types/` | `.next/types/` |
| Static Analysis | Minimal | Complete |
| Route Validation | Runtime | Build-time |
| API Validation | Runtime | Build-time |

The production build is stricter because it needs to ensure the code will work correctly in production, where errors are harder to debug and fix.

