-- Migration: Fix customer account activation
-- Date: 2025-12-19
-- Issue: New customer registrations were being automatically activated until 2099
-- Fix: Set account_active_until to null for new customers (they need manual activation)

-- Update the trigger function to NOT auto-activate customer accounts
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
    -- Default: customer role, account NOT active (needs manual activation or payment)
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

-- Grant necessary permissions
grant execute on function public.handle_new_auth_user() to postgres, anon, authenticated, service_role;
