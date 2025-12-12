# Environment Variables Documentation

This document describes all environment variables required for the Stavky application.

## Required Environment Variables

### Supabase Configuration

These variables are **required** for the application to function.

| Variable | Description | Example | Where to Find |
|----------|-------------|---------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` | Supabase Dashboard → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJhbGc...` | Supabase Dashboard → Settings → API → Project API keys → `anon` `public` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | `eyJhbGc...` | Supabase Dashboard → Settings → API → Project API keys → `service_role` `secret` |
| `SUPABASE_DB_PASSWORD` | Database password for CLI operations | `your-password` | Set during Supabase project creation or reset in Dashboard → Settings → Database |

**⚠️ Security Note**: The `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security (RLS). Never expose it to the client-side code or commit it to version control.

### Application URLs

These variables configure the application URLs for authentication callbacks and redirects.

| Variable | Description | Development | Production |
|----------|-------------|-------------|------------|
| `NEXT_PUBLIC_APP_URL` | Base application URL | `http://localhost:3000` | `https://yourdomain.com` |
| `NEXT_PUBLIC_AUTH_CALLBACK_URL` | OAuth callback URL | `http://localhost:3000/auth/callback` | `https://yourdomain.com/auth/callback` |
| `APP_SITE_URL` | Site URL for email templates | `http://localhost:3000` | `https://yourdomain.com` |
| `AUTH_REDIRECT_URL_LOGIN` | Redirect after login | `http://localhost:3000/login` | `https://yourdomain.com/login` |
| `AUTH_REDIRECT_URL_SIGNUP` | Redirect after signup | `http://localhost:3000/signup` | `https://yourdomain.com/signup` |
| `AUTH_REDIRECT_URL_CALLBACK` | OAuth callback endpoint | `http://localhost:3000/auth/callback` | `https://yourdomain.com/auth/callback` |

### OAuth Providers

#### Google OAuth

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Same as above |
| `GOOGLE_REDIRECT_URL` | Google OAuth redirect URI | Must match: `http://localhost:3000/auth/callback` (dev) or your production URL |

**Setup Instructions:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)

### Vercel Configuration (Optional)

These are only needed if deploying to Vercel or using Vercel CLI.

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `VERCEL_TOKEN` | Vercel authentication token | [Vercel Dashboard](https://vercel.com/account/tokens) → Create Token |
| `VERCEL_PROJECT_ID` | Vercel project ID | Vercel Dashboard → Project Settings → General |

## Environment File Setup

### Development

1. Create a `.env.local` file in the project root:
   ```bash
   cp prompts/env.development .env.local
   ```

2. Fill in all the required values from your Supabase and OAuth provider dashboards.

3. **Never commit `.env.local` to version control** (it's already in `.gitignore`).

### Production

1. In Vercel Dashboard → Project Settings → Environment Variables, add all required variables.

2. For Supabase production:
   - Use your production Supabase project credentials
   - Update OAuth redirect URLs in Supabase Dashboard → Authentication → URL Configuration

3. For OAuth providers:
   - Update authorized redirect URIs to your production domain

## Variable Naming Conventions

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser and can be accessed in client-side code.
- Variables without this prefix are server-side only and more secure.
- Use uppercase with underscores for all environment variable names.

## Verification

After setting up your environment variables, verify they're loaded correctly:

```bash
# Check if variables are set (development)
npm run dev

# The application should start without errors related to missing environment variables
```

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Ensure `.env.local` exists and contains all Supabase variables
   - Restart the development server after adding variables

2. **OAuth redirect errors**
   - Verify redirect URLs match exactly in both the app and OAuth provider settings
   - Check for trailing slashes or protocol mismatches (http vs https)

3. **Database connection errors**
   - Verify `SUPABASE_DB_PASSWORD` is correct
   - Check Supabase project status in the dashboard
   - For local development: Ensure Supabase is running (`npm run db:local`)
   - See [Supabase Troubleshooting Guide](./SUPABASE_TROUBLESHOOTING.md) for connection issues

4. **Service role key errors**
   - Ensure `SUPABASE_SERVICE_ROLE_KEY` is the `service_role` key, not the `anon` key
   - Never use service role key in client-side code

## Security Best Practices

1. ✅ **Do**: Use `.env.local` for local development
2. ✅ **Do**: Use Vercel environment variables for production
3. ✅ **Do**: Rotate keys periodically
4. ❌ **Don't**: Commit `.env.local` to version control
5. ❌ **Don't**: Share service role keys
6. ❌ **Don't**: Use production keys in development

## Troubleshooting

### Supabase Connection Issues

If you encounter connection errors like `ECONNREFUSED 127.0.0.1:54321` or `fetch failed` errors:

1. **Ensure Supabase is running:**
   ```bash
   npm run db:local
   # or
   supabase start
   ```

2. **Check Supabase status:**
   ```bash
   supabase status
   ```

3. **For detailed troubleshooting**, see the [Supabase Troubleshooting Guide](./SUPABASE_TROUBLESHOOTING.md)



