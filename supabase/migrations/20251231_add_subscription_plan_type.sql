-- Add subscription_plan_type column to users table
-- This stores the type of Stripe payment: 'monthly', 'yearly', or 'one-time'
-- The value persists even after subscription expiration (for historical tracking)

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS subscription_plan_type TEXT
  CHECK (subscription_plan_type IN ('monthly', 'yearly', 'one-time'));

-- Create index for faster queries filtering by plan type
CREATE INDEX IF NOT EXISTS users_subscription_plan_type_idx
  ON public.users (subscription_plan_type)
  WHERE subscription_plan_type IS NOT NULL;

-- Add helpful comment explaining the column
COMMENT ON COLUMN public.users.subscription_plan_type IS
  'Stripe payment type: monthly/yearly (subscriptions) or one-time (single payment). Persists after expiration for historical tracking.';
