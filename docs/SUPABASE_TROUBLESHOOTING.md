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
   - Ensure Docker Desktop is running (or Podman, see [Using Podman on Windows](#using-podman-on-windows))
   - Check Docker Desktop logs for container errors
   - Restart Docker Desktop if containers fail to start

## Using Podman on Windows

Supabase CLI works seamlessly with Podman as an alternative to Docker Desktop on Windows. Podman provides a Docker-compatible API that Supabase can use without any special configuration.

### Prerequisites

- Podman installed on Windows
- Podman configured with WSL backend

### Setup Steps

1. **Start Podman Machine:**
   ```bash
   podman machine start podman-machine-default
   ```

   Expected output:
   ```
   Starting machine "podman-machine-default"
   API forwarding listening on: npipe:////./pipe/docker_engine
   Docker API clients default to this address. You do not need to set DOCKER_HOST.
   Machine "podman-machine-default" started successfully
   ```

2. **Verify Podman is Running:**
   ```bash
   podman machine list
   ```

   You should see your machine status as "Currently running":
   ```
   NAME                     VM TYPE     CREATED      LAST UP      CPUS    MEMORY    DISK SIZE
   podman-machine-default*  wsl         7 weeks ago  Running now  10      2GiB      100GiB
   ```

3. **Start Supabase:**
   ```bash
   npm run db:local
   # or
   npx supabase start
   ```

4. **Verify All Containers are Running:**
   ```bash
   podman ps --format "table {{.Names}}\t{{.Status}}"
   ```

### Key Points

- **No Special Configuration Required**: Podman exposes a Docker-compatible API via named pipe (`npipe:////./pipe/docker_engine`), so Supabase CLI works without any modifications
- **No DOCKER_HOST Needed**: Unlike some Docker setups, you don't need to set the `DOCKER_HOST` environment variable
- **Analytics Warning**: You may see a warning about Analytics requiring Docker daemon on `tcp://localhost:2375` - this is non-critical and doesn't affect core Supabase functionality

### Daily Workflow with Podman

```bash
# 1. Start Podman machine (if not already running)
podman machine start podman-machine-default

# 2. Start Supabase
npm run db:local

# 3. Start your Next.js dev server
npm run dev

# Or for Stripe webhook testing:
npm run dev:with-webhooks
```

### Troubleshooting Podman

**Issue: Supabase says "already running" but containers are stopped**

Solution:
```bash
# Stop Supabase
npx supabase stop

# Verify Podman machine is running
podman machine list

# If stopped, start it
podman machine start podman-machine-default

# Start Supabase with debug mode to see detailed logs
npx supabase start --debug
```

**Issue: Podman machine won't start**

Solution:
```bash
# Check machine status
podman machine list

# Try stopping and restarting
podman machine stop podman-machine-default
podman machine start podman-machine-default

# If issues persist, check WSL status
wsl --list --verbose
```

**Issue: "Cannot connect to Podman" errors**

Solution:
1. Ensure WSL 2 is installed and up to date:
   ```bash
   wsl --update
   ```

2. Restart Podman machine:
   ```bash
   podman machine stop podman-machine-default
   podman machine start podman-machine-default
   ```

3. If problems persist, try setting machine to rootful mode:
   ```bash
   podman machine set --rootful podman-machine-default
   podman machine start podman-machine-default
   ```

### Switching from Docker Desktop to Podman

If you're switching from Docker Desktop to Podman:

1. **Stop Docker Desktop** (optional, but recommended to avoid conflicts)

2. **Stop any running Supabase instance:**
   ```bash
   npx supabase stop
   ```

3. **Start Podman machine:**
   ```bash
   podman machine start podman-machine-default
   ```

4. **Start Supabase with Podman:**
   ```bash
   npx supabase start
   ```

Your existing Supabase data volumes will be preserved and automatically detected by Podman.

### Verifying Podman Setup

To confirm Supabase is using Podman correctly:

```bash
# Check Podman version
podman --version

# List running containers (should show all Supabase containers)
podman ps

# Check Supabase status
npx supabase status
```

You should see all Supabase services running:
- ✅ Database (PostgreSQL)
- ✅ API (Kong Gateway)
- ✅ Auth
- ✅ Storage
- ✅ Realtime
- ✅ Studio
- ✅ Mailpit

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

## Studio UI Limitations

### Error: Cannot Reset Database Password in Studio UI

**Symptoms:**
- "Reset database password" modal in Studio UI shows errors
- Console shows 404 errors for API endpoints:
  - `PATCH /api/platform/projects/default/db-password` - 404
  - `GET /api/v1/projects/default/network-bans/retrieve` - 404
  - `GET /api/v1/projects/default/ssl-enforcement` - 404
  - `GET /api/v1/projects/default/network-restrictions` - 404

**Cause:**
The Supabase Studio UI includes features designed for cloud/hosted Supabase projects. The "Reset database password" feature uses management API endpoints (`/api/platform/...`) that are **not available in local Supabase**. These endpoints only exist in the hosted Supabase platform.

**Solution:**

**For Local Development:**
The local Supabase database uses a fixed password: `postgres`

You can see the connection string in `supabase status`:
```
│ URL │ postgresql://postgres:postgres@127.0.0.1:54322/postgres │
```

**Important Notes:**
- ✅ **You don't need to change the password** for local development
- ✅ The password `postgres` is the default and works fine for local use
- ❌ **You cannot change the database password through Studio UI** in local Supabase
- ❌ The Studio UI password reset feature is **cloud-only**

**If You Need a Different Password (Advanced):**
Changing the local database password requires modifying the Docker/Podman container configuration, which is complex and not recommended. The default `postgres` password is secure for local development since it's only accessible on your machine.

**For Production/Cloud:**
If you need to reset the database password for your **hosted Supabase project**, use the Supabase Dashboard at https://app.supabase.com:
1. Go to your project
2. Navigate to **Settings** → **Database**
3. Use the "Reset database password" feature there

**Workaround:**
Ignore the Studio UI password reset feature for local development. The console errors are harmless - they're just the Studio UI trying to call APIs that don't exist locally. Your local database works perfectly with the default `postgres` password.

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











