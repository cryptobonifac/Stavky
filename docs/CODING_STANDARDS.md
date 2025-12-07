# Coding Standards & Best Practices

## Middleware vs Proxy

**CRITICAL RULE: DO NOT USE `middleware.ts`**

For this project, we explicitly use `proxy.ts` for all middleware logic (Routing, Internationalization, Auth, etc.).

- **NEVER** create or modify a `middleware.ts` file in the root directory.
- If Next.js documentation mentions `middleware.ts`, implement the equivalent logic in `proxy.ts`.
- The build system is configured to use `proxy.ts`. Presence of both files will cause build failures with the error:
  `Error: Both middleware file "./middleware.ts" and proxy file "./proxy.ts" are detected.`

### Why?
We use a custom proxy setup to handle complex routing requirements involving both `next-intl` (internationalization) and Supabase Auth. Having a single entry point (`proxy.ts`) ensures strict control over the order of operations.
