# Stavky - Sports Betting Tips Application

A minimalist Next.js web application for sports betting tipsters with Supabase backend and Vercel deployment.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `.env.local.example` to `.env.local` (if it exists)
   - Or create `.env.local` with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   SUPABASE_DB_PASSWORD=your-supabase-db-password
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_AUTH_CALLBACK_URL=http://localhost:3000/auth/callback
   APP_SITE_URL=http://localhost:3000
   AUTH_REDIRECT_URL_LOGIN=http://localhost:3000/login
   AUTH_REDIRECT_URL_SIGNUP=http://localhost:3000/signup
   AUTH_REDIRECT_URL_CALLBACK=http://localhost:3000/auth/callback
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_REDIRECT_URL=http://localhost:3000/auth/callback
   ```

3. Configure Supabase CLI (for database migrations):
   - Update `supabase/config.toml` with your Supabase project ref (`project_id`) and service role key (`api_key`).
   - The CLI is installed as a dev dependency, so `npm install` also makes the `supabase` binary available locally.

4. Start local Supabase instance (required for local development):
```bash
npm run db:local
```
   **Important**: Always start Supabase before starting the Next.js dev server.

   **Windows Users**: Supabase works with both Docker Desktop and Podman. If using Podman, make sure to start the Podman machine first:
   ```bash
   podman machine start podman-machine-default
   ```

   See [Supabase Troubleshooting Guide](./docs/SUPABASE_TROUBLESHOOTING.md) for common issues and [Podman Setup Instructions](./docs/SUPABASE_TROUBLESHOOTING.md#using-podman-on-windows) for detailed Podman configuration.

5. Run the development server:
```bash
npm run dev
```

## Local Polar Webhook Testing

This project uses [Polar](https://polar.sh) for subscription payments. To test webhooks locally, you need to expose your local server to the internet.

### Setup Steps

1. **Start the Next.js dev server:**
   ```bash
   npm run dev
   ```

2. **In a separate terminal, start localtunnel:**
   ```bash
   npx localtunnel --port 3000
   ```

   This will output a public URL like:
   ```
   your url is: https://random-name.loca.lt
   ```

3. **Configure webhook in Polar Dashboard:**
   - Go to [Polar Dashboard](https://polar.sh) → Settings → Webhooks
   - Add a new webhook with URL: `https://random-name.loca.lt/api/webhooks/polar`
   - Select the events you want to receive:
     - `subscription.created`
     - `subscription.updated`
     - `subscription.canceled`
     - `checkout.created`
     - `checkout.updated`

4. **Copy the webhook secret from Polar** and add it to `.env.local`:
   ```env
   POLAR_WEBHOOK_SECRET=your-webhook-secret
   ```

5. **First visit to localtunnel URL:**
   - When you first visit the localtunnel URL in a browser, you may need to click through a confirmation page
   - This is a one-time step per tunnel session

### Important Notes

- The localtunnel URL changes each time you restart it
- You'll need to update the webhook URL in Polar Dashboard when it changes
- For persistent URLs, consider using [ngrok](https://ngrok.com) with a free account
- The tunnel must stay running while testing webhooks

### Alternative: Using ngrok

If you prefer ngrok (offers stable URLs with free account):
```bash
npx ngrok http 3000
```

Then use the provided `https://*.ngrok.io` URL in your Polar webhook configuration.

## Polar Sandbox Testing

Polar provides a sandbox environment for testing payments without real money.

### Environment Configuration

The project supports both sandbox and production Polar environments:

- **Production config** is stored in `.env` (default)
- **Sandbox config** can override in `.env.local`

To use sandbox, add these to `.env.local`:

```env
POLAR_ACCESS_TOKEN=your_sandbox_access_token
POLAR_ORGANIZATION_ID=your_sandbox_org_id
POLAR_WEBHOOK_SECRET=your_sandbox_webhook_secret
POLAR_MONTHLY_PRODUCT_ID=your_sandbox_monthly_product_id
POLAR_YEARLY_PRODUCT_ID=your_sandbox_yearly_product_id
POLAR_ENVIRONMENT=sandbox
```

### Getting Sandbox Credentials

1. Go to [Polar Sandbox Dashboard](https://sandbox.polar.sh) (NOT polar.sh)
2. Create an account or log in
3. Navigate to **Settings** → **Developers** → **Access Tokens**
4. Create a new token and copy it to `POLAR_ACCESS_TOKEN`
5. Get your Organization ID from the dashboard URL or settings
6. Create test products for monthly and yearly subscriptions
7. Copy the product IDs to the environment variables

### Test Credit Cards

Use Stripe's test card numbers in sandbox:

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 0002` | Card declined |
| `4000 0025 0000 3155` | Requires 3D Secure authentication |
| `4000 0000 0000 9995` | Insufficient funds |

For all test cards:
- **Expiry**: Any future date (e.g., `12/34`)
- **CVC**: Any 3 digits (e.g., `123`)
- **Name/Address/ZIP**: Any values

### Sandbox Webhook Setup

To test webhooks in sandbox environment:

1. **Start your local server and tunnel:**
   ```bash
   # Terminal 1 - Start Next.js
   npm run dev

   # Terminal 2 - Start tunnel (choose one)
   npx localtunnel --port 3000
   # or
   npx ngrok http 3000
   ```

2. **Configure webhook in Polar Sandbox Dashboard:**
   - Go to [sandbox.polar.sh](https://sandbox.polar.sh) → **Settings** → **Webhooks**
   - Click **Add Webhook**
   - URL: `https://your-tunnel-url.loca.lt/api/webhooks/polar`
   - Select events:
     - `subscription.created`
     - `subscription.updated`
     - `subscription.canceled`
     - `checkout.created`
     - `checkout.updated`

3. **Copy the webhook secret** and update `.env.local`:
   ```env
   POLAR_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

4. **Restart Next.js** to pick up the new secret:
   ```bash
   rm -rf .next && npm run dev
   ```

> **Note:** Use **sandbox.polar.sh** for sandbox webhooks, NOT polar.sh. The tunnel URL changes each restart, so you'll need to update the webhook URL in the dashboard accordingly.

### Switching Between Environments

1. **For sandbox**: Ensure `.env.local` has sandbox values with `POLAR_ENVIRONMENT=sandbox`
2. **For production**: Remove or comment out Polar variables in `.env.local` (falls back to `.env`)
3. **Restart** the Next.js dev server after changing environments:
   ```bash
   rm -rf .next && npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── app/              # Next.js App Router pages and layouts
├── components/       # Reusable React components
├── lib/             # Utility functions and helpers
├── prompts/         # Project documentation and planning
└── agents/          # Cursor AI agent configurations
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run db:push` - Push SQL migrations in `supabase/migrations` to Supabase

### Supabase CLI Tips

If the Supabase CLI starts failing to authenticate (for example after a password reset), run:

```bash
supabase logout
supabase login
supabase link --project-ref ezhcfemzrbfsfkafqsav
```

Then rerun `npm run db:push` with `SUPABASE_DB_PASSWORD` exported in your shell.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Linting**: ESLint + Prettier
- **Database**: Supabase (PostgreSQL)
- **Payments**: Polar
- **Deployment**: Vercel
- **Auth Providers**: Supabase Auth (Email/Password, Google OAuth)

## Authentication Setup

The Supabase CLI config (`supabase/config.toml`) enables:

- Email/password sign-in with custom magic-link and reset email templates located in `supabase/templates/`.
- Google OAuth provider using the environment variables above.
- Redirect URLs for login, signup, and shared OAuth callback paths (`/auth/callback`).

After populating the env vars, run `supabase start` locally or configure the same values in the Supabase Dashboard → Authentication → Providers section.

### Managing Roles

Every user gets a `'customer'` role by default. To promote someone to a betting admin in Supabase, run:

```sql
update public.users
set role = 'betting'
where email = 'user@example.com';
```

You can execute this in the Supabase SQL editor or via `supabase db remote exec`.工程*** End Patch

## Path Aliases

The project uses path aliases for cleaner imports:
- `@/components` - React components
- `@/lib` - Utility functions
- `@/app` - App router pages and layouts

## Development Status

This project is in active development. See `prompts/PLANNING.md` for the complete development plan.


- if you run `npm run db:push` always export `SUPABASE_DB_PASSWORD` from `env.local` file to the session


