# Supabase Local Development Troubleshooting

This document covers common issues when running Supabase locally and how to resolve them.

## Connection Errors

### Error: `ECONNREFUSED 127.0.0.1:54321`

**Symptoms:**
- Multiple `TypeError: fetch failed` errors in the console
- `Error: connect ECONNREFUSED 127.0.0.1:54321`
- `AuthRetryableFetchError: fetch failed`
- Invalid source map warnings (non-critical)

**Cause:**
The local Supabase instance is not running or has crashed. Port 54321 is the default Supabase local API port.

**Solution:**

1. **Check if Supabase is running:**
   ```bash
   supabase status
   ```

2. **If Supabase reports it's running but containers have exited:**
   ```bash
   # Stop any crashed containers
   supabase stop
   
   # Start Supabase fresh
   supabase start
   # or
   npm run db:local
   ```

3. **Verify Supabase is running correctly:**
   After starting, you should see:
   ```
   Started supabase local development setup.
   
   │ 🛠️  Development Tools                │
   ├─────────┬────────────────────────────┤
   │ Studio  │ http://127.0.0.1:54323     │
   │ Mailpit │ http://127.0.0.1:54324     │
   
   │ 🌐 APIs                              │
   ├────────────────┬─────────────────────┤
   │ Project URL    │ http://127.0.0.1:54321
   ```

4. **Restart your Next.js dev server:**
   ```bash
   # Stop the dev server (Ctrl+C)
   npm run dev
   ```

**Prevention:**
- Always start Supabase before starting your Next.js dev server
- Use `npm run db:local` to ensure Supabase is running before development

### Container Exited Unexpectedly

**Symptoms:**
- `supabase_db_* container is not running: exited`
- Supabase status shows "already running" but containers are stopped

**Solution:**

1. **Stop all Supabase containers:**
   ```bash
   supabase stop
   ```

2. **Start fresh:**
   ```bash
   supabase start
   ```

3. **If issues persist, check Docker:**
   ```bash
   docker ps -a | grep supabase
   ```

4. **For Windows users:**
   - Ensure Docker Desktop is running
   - Check Docker Desktop logs for container errors
   - Restart Docker Desktop if containers fail to start

## Environment Variable Warnings

### Warning: `environment variable is unset: AUTH_REDIRECT_URL_*`

**Symptoms:**
- Warnings when starting Supabase:
  ```
  WARN: environment variable is unset: AUTH_REDIRECT_URL_LOGIN
  WARN: environment variable is unset: AUTH_REDIRECT_URL_SIGNUP
  WARN: environment variable is unset: AUTH_REDIRECT_URL_CALLBACK
  ```

**Impact:**
These warnings are **non-critical** for basic Supabase operation. Supabase will start and function normally without them.

**When to Fix:**
Only set these if you're using OAuth authentication locally. They're required for Google OAuth to work properly.

**Solution:**

Add to your `.env.local` file:
```env
AUTH_REDIRECT_URL_LOGIN=http://localhost:3000/login
AUTH_REDIRECT_URL_SIGNUP=http://localhost:3000/signup
AUTH_REDIRECT_URL_CALLBACK=http://localhost:3000/auth/callback
```

Or set them in your shell environment before starting Supabase:
```powershell
# PowerShell
$env:AUTH_REDIRECT_URL_LOGIN = "http://localhost:3000/login"
$env:AUTH_REDIRECT_URL_SIGNUP = "http://localhost:3000/signup"
$env:AUTH_REDIRECT_URL_CALLBACK = "http://localhost:3000/auth/callback"
```

## Invalid Source Map Warnings

**Symptoms:**
- Console warnings: `Invalid source map. Only conformant source maps can be used to find the original code.`
- These appear repeatedly in the console

**Impact:**
These are **harmless warnings** from Next.js/Turbopack. They don't affect functionality and can be safely ignored.

**Cause:**
Next.js is trying to load source maps for debugging but encounters issues with Supabase auth library source maps.

**Solution:**
No action needed. These warnings don't affect application functionality. They're related to debugging tools and won't impact your app's behavior.

## Port Conflicts

### Error: Port 54321 already in use

**Symptoms:**
- Supabase fails to start
- Error message about port being in use

**Solution:**

1. **Find what's using the port:**
   ```bash
   # Windows PowerShell
   netstat -ano | findstr :54321
   
   # Or use Get-NetTCPConnection
   Get-NetTCPConnection -LocalPort 54321
   ```

2. **Stop the conflicting process or change Supabase port:**
   
   Option A: Stop conflicting process
   ```bash
   # Find process ID from netstat output, then:
   taskkill /PID <process_id> /F
   ```
   
   Option B: Change Supabase port in `supabase/config.toml`:
   ```toml
   [api]
   port = 54322  # Change to different port
   ```

## Database Connection Issues

### Error: Cannot connect to database

**Symptoms:**
- Database queries fail
- Connection timeout errors

**Solution:**

1. **Verify Supabase is running:**
   ```bash
   supabase status
   ```

2. **Check database URL in `.env.local`:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   ```

3. **Verify database is accessible:**
   ```bash
   # Connect to database directly
   psql postgresql://postgres:postgres@127.0.0.1:54322/postgres
   ```

4. **Check Supabase Studio:**
   - Open http://127.0.0.1:54323
   - Verify you can see tables and data

## Quick Reference

### Start Supabase
```bash
npm run db:local
# or
supabase start
```

### Stop Supabase
```bash
supabase stop
```

### Check Status
```bash
supabase status
```

### Reset Database
```bash
supabase db reset
```

### View Logs
```bash
supabase logs
```

### Access Supabase Studio
Open http://127.0.0.1:54323 in your browser

## Common Workflow

1. **Start Supabase first:**
   ```bash
   npm run db:local
   ```

2. **Wait for "Started supabase local development setup" message**

3. **Start Next.js dev server:**
   ```bash
   npm run dev
   ```

4. **If you see connection errors:**
   - Check Supabase is running: `supabase status`
   - Restart Supabase: `supabase stop && supabase start`
   - Restart Next.js dev server

## Additional Resources

- [Supabase Local Development Docs](https://supabase.com/docs/guides/local-development)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Local OAuth Setup](./LOCAL_SUPABASE_GOOGLE_OAUTH.md)


