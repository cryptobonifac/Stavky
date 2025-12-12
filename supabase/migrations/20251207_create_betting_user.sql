-- Migration: Create betting user (betting1@gmail.com)
-- 
-- IMPORTANT: This migration assumes the user already exists in auth.users
-- To create the auth user first, use one of these methods:
--
-- Method 1: Via Supabase Dashboard
--   1. Go to Authentication → Users
--   2. Click "Add user" → "Create new user"
--   3. Email: betting1@gmail.com
--   4. Password: betting123
--   5. Auto Confirm User: Yes
--
-- Method 2: Via Supabase Admin API (using the create-betting-user.js script)
--   node scripts/create-betting-user.js betting1@gmail.com betting123 betting
--
-- Method 3: Via Supabase CLI
--   supabase auth users create betting1@gmail.com --password betting123 --email-confirm
--
-- After creating the auth user, run this migration to set up the public.users entry.

-- Function to create or update a user in public.users with a specific role
create or replace function public.create_or_update_user(
  user_email text,
  user_role public.user_role default 'customer'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  user_id uuid;
begin
  -- Find the user in auth.users by email
  select id into user_id
  from auth.users
  where email = user_email
  limit 1;

  if user_id is null then
    raise exception 'User with email % does not exist in auth.users. Please create the user in Supabase Auth first.', user_email;
  end if;

  -- Insert or update the user in public.users
  insert into public.users (id, email, role)
  values (user_id, user_email, user_role)
  on conflict (id) do update
  set 
    email = excluded.email,
    role = excluded.role,
    updated_at = timezone('utc', now());

  return user_id;
end;
$$;

-- Create the betting user
-- This will fail if the user doesn't exist in auth.users
do $$
declare
  user_id uuid;
begin
  -- Create or update the betting user
  user_id := public.create_or_update_user('betting1@gmail.com', 'betting');
  
  raise notice 'User betting1@gmail.com created/updated successfully with ID: %', user_id;
exception
  when others then
    raise warning 'Failed to create user betting1@gmail.com: %', sqlerrm;
    raise notice 'Please ensure the user exists in auth.users first.';
    raise notice 'You can create the user via:';
    raise notice '  1. Supabase Dashboard → Authentication → Users → Add user';
    raise notice '  2. Or run: node scripts/create-betting-user.js betting1@gmail.com betting123 betting';
end;
$$;

-- Grant execute permission on the function to authenticated users (optional, for future use)
grant execute on function public.create_or_update_user(text, public.user_role) to authenticated;






