# Supabase with Podman on Windows - Quick Setup Guide

This guide shows you how to run Supabase with Podman instead of Docker Desktop on Windows.

## Why Podman?

- **Lightweight**: Less resource-intensive than Docker Desktop
- **Free**: No licensing concerns for enterprise use
- **Docker-compatible**: Works seamlessly with tools that expect Docker
- **WSL Integration**: Runs natively on Windows with WSL 2

## Prerequisites

- Windows 10/11 with WSL 2
- Podman Desktop installed
- Node.js 18+ and npm

## Quick Start

### 1. Start Podman Machine

```bash
podman machine start podman-machine-default
```

Expected output:
```
Starting machine "podman-machine-default"
API forwarding listening on: npipe:////./pipe/docker_engine
Machine "podman-machine-default" started successfully
```

### 2. Start Supabase

```bash
npm run db:local
```

### 3. Verify Everything is Running

```bash
# Check Podman containers
podman ps

# Check Supabase status
npx supabase status
```

### 4. Start Your Next.js App

```bash
npm run dev
```

## Daily Workflow

Every time you start working:

```bash
# 1. Start Podman (if not already running)
podman machine start podman-machine-default

# 2. Start Supabase
npm run db:local

# 3. Start dev server
npm run dev
```

## How It Works

Podman provides a Docker-compatible API that Supabase CLI uses automatically:

- **No configuration needed**: Supabase CLI detects Podman automatically
- **Named pipe API**: Exposed via `npipe:////./pipe/docker_engine`
- **No DOCKER_HOST required**: Unlike some setups, environment variables aren't needed
- **Full compatibility**: All Supabase CLI commands work exactly as documented

## Useful Commands

### Podman Machine Management

```bash
# Check machine status
podman machine list

# Start machine
podman machine start podman-machine-default

# Stop machine
podman machine stop podman-machine-default

# Check Podman version
podman --version
```

### Container Management

```bash
# List running containers
podman ps

# List all containers (including stopped)
podman ps -a

# View container logs
podman logs <container-name>

# Stop a specific container
podman stop <container-name>
```

### Supabase Commands

```bash
# Start Supabase
npm run db:local
# or
npx supabase start

# Stop Supabase
npx supabase stop

# Check status
npx supabase status

# Reset database
npx supabase db reset

# View logs
npx supabase logs
```

## Troubleshooting

### Issue: "Supabase is already running" but containers are stopped

```bash
npx supabase stop
podman machine list  # Verify machine is running
npx supabase start --debug
```

### Issue: Podman machine won't start

```bash
# Check WSL status
wsl --list --verbose

# Update WSL
wsl --update

# Restart machine
podman machine stop podman-machine-default
podman machine start podman-machine-default
```

### Issue: Port conflicts

```bash
# Check what's using port 54321
Get-NetTCPConnection -LocalPort 54321

# Stop conflicting process
Stop-Process -Id <PID> -Force
```

### Issue: Permission errors

If you see permission errors, try switching to rootful mode:

```bash
podman machine stop podman-machine-default
podman machine set --rootful podman-machine-default
podman machine start podman-machine-default
```

## Switching from Docker Desktop

Already using Docker Desktop? Here's how to switch:

1. **Stop Supabase:**
   ```bash
   npx supabase stop
   ```

2. **Stop Docker Desktop** (optional)

3. **Start Podman:**
   ```bash
   podman machine start podman-machine-default
   ```

4. **Start Supabase with Podman:**
   ```bash
   npx supabase start
   ```

Your data is preserved in volumes and will work with Podman automatically.

## Verifying Your Setup

After starting everything, verify:

1. **Podman machine is running:**
   ```bash
   podman machine list
   ```
   Should show "Running now" status

2. **All Supabase containers are running:**
   ```bash
   podman ps
   ```
   Should show 12+ containers with "Up" status

3. **Supabase services are accessible:**
   - Studio: http://127.0.0.1:54323
   - API: http://127.0.0.1:54321
   - Database: postgresql://postgres:postgres@127.0.0.1:54322/postgres

4. **Next.js app connects successfully:**
   - No connection errors in browser console
   - Can sign in/sign up
   - Database queries work

## Performance Notes

Podman on Windows (WSL):
- **Startup time**: ~10-15 seconds for machine, ~30-45 seconds for Supabase
- **Memory usage**: ~2GB default (configurable)
- **CPU**: Uses host CPU cores efficiently
- **Disk**: ~100GB default disk size

## Known Issues

### Analytics Warning

You may see this warning:
```
WARNING: Analytics on Windows requires Docker daemon exposed on tcp://localhost:2375.
```

This is **non-critical**. Core Supabase functionality works perfectly. Analytics is the only affected feature.

### First Start May Be Slow

The first time you run `npx supabase start`, it downloads container images. This can take several minutes depending on your connection. Subsequent starts are much faster.

## Additional Resources

- [Podman Desktop](https://podman-desktop.io/)
- [Podman Documentation](https://docs.podman.io/)
- [Supabase Local Development](https://supabase.com/docs/guides/local-development)
- [Complete Troubleshooting Guide](./SUPABASE_TROUBLESHOOTING.md)
- [Supabase Start Guide](./LOCAL_SUPABASE_START_GUIDE.md)

## Support

If you encounter issues not covered here:

1. Check [SUPABASE_TROUBLESHOOTING.md](./SUPABASE_TROUBLESHOOTING.md#using-podman-on-windows) for detailed troubleshooting
2. Run with debug mode: `npx supabase start --debug`
3. Check Podman logs: `podman machine ssh podman-machine-default journalctl -u podman`

## Summary

Podman works great with Supabase on Windows:
- ✅ No special configuration needed
- ✅ Docker-compatible API
- ✅ All Supabase features work
- ✅ Lightweight and efficient
- ✅ Free for all use cases

The workflow is simple:
1. Start Podman machine
2. Start Supabase
3. Start your app
4. Build great things!
