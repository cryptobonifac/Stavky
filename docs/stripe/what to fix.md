The webhook endpoint is correctly implemented. The issue is likely that:
stripe listen is not running with the sandbox API key (--api-key flag)
The webhook secret doesn't match
The webhook events are from a different environment (Test Mode vs Sandbox)
The endpoint code itself is correct and follows Stripe's best practices for Next.js App Router.