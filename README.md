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
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. Run the development server:
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

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Linting**: ESLint + Prettier
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## Path Aliases

The project uses path aliases for cleaner imports:
- `@/components` - React components
- `@/lib` - Utility functions
- `@/app` - App router pages and layouts

## Development Status

This project is in active development. See `prompts/PLANNING.md` for the complete development plan.

