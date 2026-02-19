-- Rename Stripe columns to Polar columns
-- This migration replaces Stripe integration with Polar.sh

-- Rename stripe_customer_id to polar_customer_id
ALTER TABLE public.users RENAME COLUMN stripe_customer_id TO polar_customer_id;

-- Rename stripe_subscription_id to polar_subscription_id
ALTER TABLE public.users RENAME COLUMN stripe_subscription_id TO polar_subscription_id;

-- Rename the index
ALTER INDEX IF EXISTS users_stripe_customer_id_idx RENAME TO users_polar_customer_id_idx;

-- Update subscription_plan_type constraint to remove 'one-time' option
-- First drop the existing constraint
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_subscription_plan_type_check;

-- Add new constraint with only monthly and yearly options
ALTER TABLE public.users ADD CONSTRAINT users_subscription_plan_type_check
  CHECK (subscription_plan_type IN ('monthly', 'yearly'));

-- Clear any existing 'one-time' values (set to null since we're starting fresh)
UPDATE public.users SET subscription_plan_type = NULL WHERE subscription_plan_type = 'one-time';

-- Update column comment
COMMENT ON COLUMN public.users.polar_customer_id IS
  'Polar.sh customer ID for subscription management';

COMMENT ON COLUMN public.users.polar_subscription_id IS
  'Polar.sh subscription ID for active subscriptions';

COMMENT ON COLUMN public.users.subscription_plan_type IS
  'Polar subscription type: monthly or yearly. Persists after expiration for historical tracking.';
