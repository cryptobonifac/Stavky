// Export individual modules for direct imports
// Use './client' for Client Components
// Use './server' for Server Components, Server Actions, Route Handlers
// Use './admin' for admin operations (server only)
// Use './middleware' for middleware.ts

export { createClient as createBrowserClient } from './client'
export { createClient as createServerClient } from './server'
export { createAdminClient } from './admin'
export { updateSession } from './middleware'

