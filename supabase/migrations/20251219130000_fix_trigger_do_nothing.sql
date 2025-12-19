-- Migration: Fix auth trigger to not update existing users
-- Date: 2025-12-19
-- Issue: The trigger was updating existing users on every login, resetting their account_active_until to null
-- Fix: Change "on conflict do update" to "on conflict do nothing" so only NEW users get null activation

-- Update the trigger function to NOT update existing users
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
    -- Default: customer role, account NOT active (needs payment via Stripe)
    user_role_val := 'customer'::public.user_role;
    account_active_until_val := null;
  end if;

  -- Insert user into public.users ONLY if they don't exist
  -- DO NOT update existing users - this preserves their current activation status
  insert into public.users (id, email, role, account_active_until)
  values (new.id, new.email, user_role_val, account_active_until_val)
  on conflict (id) do nothing;

  return new;
exception
  when others then
    -- Log error but don't fail the auth user creation
    raise warning 'Error creating user in public.users: %', sqlerrm;
    return new;
end;
$$;

-- Grant necessary permissions
grant execute on function public.handle_new_auth_user() to postgres, anon, authenticated, service_role;
