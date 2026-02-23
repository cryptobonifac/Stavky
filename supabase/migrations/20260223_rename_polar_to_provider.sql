-- Rename polar_* columns to provider_* for payment provider abstraction
-- This allows for future payment provider replacement without column name coupling

ALTER TABLE public.users RENAME COLUMN polar_customer_id TO provider_customer_id;
ALTER TABLE public.users RENAME COLUMN polar_subscription_id TO provider_subscription_id;

-- Add comment to indicate these are generic provider fields
COMMENT ON COLUMN public.users.provider_customer_id IS 'Customer ID from payment provider (e.g., Stripe, Paddle)';
COMMENT ON COLUMN public.users.provider_subscription_id IS 'Subscription ID from payment provider';
