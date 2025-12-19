-- Add Stripe-related fields to users table
alter table public.users
  add column if not exists stripe_customer_id text unique,
  add column if not exists stripe_subscription_id text;

-- Create index for faster lookups
create index if not exists users_stripe_customer_id_idx
  on public.users (stripe_customer_id);
