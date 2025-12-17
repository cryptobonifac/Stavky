-- Migration: Fix user creation trigger to ensure new users are created in public.users
-- Created: 2025-01-22
--
-- This migration ensures that the trigger on_auth_user_created exists and works correctly
-- to automatically create users in public.users when they register in auth.users

-- Ensure the is_betting_account_email function exists
-- This function determines which emails should automatically get betting role
create or replace function public.is_betting_account_email(user_email text)
returns boolean
language plpgsql
immutable
as $$
begin
  -- Check if email is in the betting accounts list
  -- These emails will automatically get betting role and 100 years activation
  return user_email in (
    'busikpartners@gmail.com',
    'igorpod69@gmail.com'
  );
end;
$$;

-- Ensure the trigger function exists and is correct
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role_val public.user_role;
  account_active_until_val timestamptz;
begin
  -- Check if this is a betting account email
  if public.is_betting_account_email(new.email) then
    -- Assign betting role and activate for 100 years
    user_role_val := 'betting'::public.user_role;
    account_active_until_val := (timezone('utc', now()) + interval '100 years');
  else
    -- Default: customer role, account NOT active (needs manual activation)
    user_role_val := 'customer'::public.user_role;
    account_active_until_val := null;
  end if;

  -- Insert user into public.users with appropriate role and activation
  insert into public.users (id, email, role, account_active_until)
  values (new.id, new.email, user_role_val, account_active_until_val)
  on conflict (id) do update
    set role = excluded.role,
        account_active_until = excluded.account_active_until,
        updated_at = timezone('utc', now());
  
  return new;
exception
  when others then
    -- Log error but don't fail the auth user creation
    raise warning 'Error creating user in public.users: %', sqlerrm;
    return new;
end;
$$;

-- Drop and recreate the trigger to ensure it exists and is enabled
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_auth_user();

-- Grant necessary permissions
grant execute on function public.handle_new_auth_user() to postgres, anon, authenticated, service_role;
grant execute on function public.is_betting_account_email(text) to postgres, anon, authenticated, service_role;
