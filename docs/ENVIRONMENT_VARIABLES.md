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

#### Facebook OAuth

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `FACEBOOK_CLIENT_ID` | Facebook App ID | [Facebook Developers](https://developers.facebook.com/) → My Apps → Settings → Basic |
| `FACEBOOK_CLIENT_SECRET` | Facebook App Secret | Same as above |
| `FACEBOOK_REDIRECT_URL` | Facebook OAuth redirect URI | Must match: `http://localhost:3000/auth/callback` (dev) or your production URL |

**Setup Instructions:**
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure OAuth redirect URIs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)

### Email Service (Resend)

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `RESEND_API_KEY` | Resend API key for sending emails | [Resend Dashboard](https://resend.com/api-keys) → Create API Key |

**Setup Instructions:**
1. Go to [Resend](https://resend.com/) and create an account
2. Navigate to API Keys section
3. Create a new API key
4. Copy the API key and add it to your environment variables
5. **Note**: For production, you'll need to verify your domain in Resend to send from custom email addresses. For development, you can use the default `onboarding@resend.dev` sender.

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

### Testing Contact Form API Configuration

To verify `RESEND_API_KEY` is configured correctly:

**Option 1: Use Verification Script (Recommended)**
```bash
npm run verify:resend
```

This automated script will:
- Check if `.env.local` exists
- Verify `RESEND_API_KEY` is defined
- Validate the format
- Provide specific fix instructions

**Option 2: Test API Endpoint**

1. **Visit the diagnostic endpoint**:
   ```
   http://localhost:3000/api/contact
   ```

2. **Check the response** - You should see:
   ```json
   {
     "message": "Contact API is working",
     "resendConfigured": true,
     "diagnostics": {
       "hasKey": true,
       "keyNotEmpty": true,
       "keyStartsWithRe": true,
       "keyLength": <number>,
       "nodeEnv": "development"
     }
   }
   ```

3. **If `resendConfigured` is `false`**, check the `diagnostics` and `troubleshooting` fields for specific issues.

**For detailed troubleshooting**, see [Contact Form Troubleshooting Guide](./CONTACT_FORM_TROUBLESHOOTING.md)

## Troubleshooting

### Common Issues

1. **"Email service is not configured" (RESEND_API_KEY)**

   **Symptoms:**
   - Contact form shows error: "Email service is not configured"
   - GET `/api/contact` shows `resendConfigured: false`

   **Solutions:**

   a. **Verify file location and format**:
      - `.env.local` must be in project root (same directory as `package.json`)
      - Format must be: `RESEND_API_KEY=re_xxxxxxxxxxxxx`
      - ❌ Wrong: `RESEND_API_KEY="re_xxx"` (quotes)
      - ❌ Wrong: `RESEND_API_KEY = re_xxx` (spaces)
      - ✅ Correct: `RESEND_API_KEY=re_xxxxxxxxxxxxx`

   b. **Restart development server**:
      ```bash
      # Stop server (Ctrl+C)
      # Then restart:
      npm run dev
      ```
      ⚠️ **Critical**: Next.js loads environment variables at startup. Changes to `.env.local` require a server restart.

   c. **Check variable name**:
      - Must be exactly `RESEND_API_KEY` (case-sensitive)
      - No typos: not `RESEND_API_KEY_` or `RESEND_APIKEY`

   d. **Verify key format**:
      - Resend API keys start with `re_`
      - Get your key from [Resend Dashboard](https://resend.com/api-keys)

   e. **Check for multiple env files**:
      - Next.js loads: `.env.local` > `.env.development` > `.env`
      - If `RESEND_API_KEY` exists in multiple files, `.env.local` takes precedence
      - Remove duplicate definitions

   f. **Use diagnostic endpoint**:
      - Visit `http://localhost:3000/api/contact` to see detailed diagnostics
      - Check server console for error logs

   **Example `.env.local` file:**
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

   # Resend (for contact form)
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

2. **"Missing Supabase environment variables"**
   - Ensure `.env.local` exists and contains all Supabase variables
   - Restart the development server after adding variables

2. **OAuth redirect errors**
   - Verify redirect URLs match exactly in both the app and OAuth provider settings
   - Check for trailing slashes or protocol mismatches (http vs https)

3. **Database connection errors**
   - Verify `SUPABASE_DB_PASSWORD` is correct
   - Check Supabase project status in the dashboard

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



