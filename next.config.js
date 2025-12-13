/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')('./i18n/request.ts')

const nextConfig = {
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

module.exports = withNextIntl(nextConfig)

