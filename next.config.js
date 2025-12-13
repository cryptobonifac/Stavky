/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')('./i18n/request.ts')

// Base config that GitHub Pages action can modify
const baseConfig = {
  reactStrictMode: true,
  // Enforce strict type checking in development mode
  typescript: {
    // Don't ignore build errors - fail on TypeScript errors
    ignoreBuildErrors: false,
  },
  // Note: ESLint is configured via eslint.config.js or .eslintrc.json
  // Next.js 16 runs ESLint by default during build and fails on errors
  // Build caching is enabled by default and stored in .next/cache
  // GitHub Actions workflow caches this directory for faster rebuilds
  experimental: {
    optimizeCss: true,
  },
}

// WARNING: This app uses server-side features (API routes, server components, Supabase)
// and cannot be statically exported. If GitHub Pages action injects 'output: export',
// the build will fail. Consider deploying to Vercel, Netlify, or similar platforms
// that support Next.js server-side features.

// Export the config wrapped with next-intl
// The GitHub Pages action will try to inject 'output: export' into baseConfig
module.exports = withNextIntl(baseConfig)

