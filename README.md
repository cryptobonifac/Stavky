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
   FACEBOOK_CLIENT_ID=your-facebook-app-id
   FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
   FACEBOOK_REDIRECT_URL=http://localhost:3000/auth/callback
   ```

3. Configure Supabase CLI (for database migrations):
   - Update `supabase/config.toml` with your Supabase project ref (`project_id`) and service role key (`api_key`).
   - The CLI is installed as a dev dependency, so `npm install` also makes the `supabase` binary available locally.

4. Run the development server:
```bash
npm run dev
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
- **Deployment**: Vercel
- **Auth Providers**: Supabase Auth (Email/Password, Google OAuth, Facebook OAuth)

## Authentication Setup

The Supabase CLI config (`supabase/config.toml`) enables:

- Email/password sign-in with custom magic-link and reset email templates located in `supabase/templates/`.
- Google and Facebook OAuth providers using the environment variables above.
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


