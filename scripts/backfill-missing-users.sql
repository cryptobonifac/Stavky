-- Script to backfill users from auth.users to public.users
-- 
-- This script finds users that exist in auth.users but not in public.users
-- and creates the missing entries with appropriate roles.
--
-- Usage:
--   1. Run this in Supabase SQL Editor (production)
--   2. Or run via Supabase CLI: supabase db execute -f scripts/backfill-missing-users.sql
--
-- Note: This script uses the is_betting_account_email function to determine roles

-- Ensure the is_betting_account_email function exists (in case migration hasn't run)
create or replace function public.is_betting_account_email(user_email text)
returns boolean
language plpgsql
immutable
as $$
begin
  -- These emails will automatically get betting role and 1 year activation
  return user_email in (
    'busikpartners@gmail.com',
    'igorpod69@gmail.com'
  );
end;
$$;

-- Insert missing users from auth.users into public.users
insert into public.users (id, email, role, account_active_until, created_at, updated_at)
select 
  au.id,
  au.email,
  case 
    when public.is_betting_account_email(au.email) then 'betting'::public.user_role
    else 'customer'::public.user_role
  end as role,
  case 
    when public.is_betting_account_email(au.email) then (timezone('utc', now()) + interval '100 years')
    else null
  end as account_active_until,
  coalesce(au.created_at, timezone('utc', now())) as created_at,
  timezone('utc', now()) as updated_at
from auth.users au
left join public.users pu on au.id = pu.id
where pu.id is null
  and au.email is not null;

-- Show summary of what was created
select 
  count(*) as users_backfilled,
  count(*) filter (where role = 'betting') as betting_users,
  count(*) filter (where role = 'customer') as customer_users
from public.users
where updated_at >= timezone('utc', now()) - interval '1 minute';

-- List the users that were backfilled
select 
  id,
  email,
  role,
  account_active_until,
  created_at
from public.users
where updated_at >= timezone('utc', now()) - interval '1 minute'
order by created_at desc;









