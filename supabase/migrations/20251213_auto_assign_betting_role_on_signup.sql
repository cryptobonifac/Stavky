-- Migration: Auto-assign betting role and activate account for specific emails on signup
-- This updates the handle_new_auth_user trigger to automatically assign betting role
-- and activate accounts for emails in the betting accounts list

-- List of emails that should get betting role automatically
create or replace function public.is_betting_account_email(user_email text)
returns boolean
language plpgsql
immutable
as $$
begin
  -- Check if email is in the betting accounts list
  return user_email in (
    'igorpod69@gmail.com',
    'busikpartners@gmail.com',
    'marek.rohon@gmail.com'
  );
end;
$$;

-- Update the trigger function to check for betting accounts
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
    -- Assign betting role and activate for 1 year
    user_role_val := 'betting'::public.user_role;
    account_active_until_val := (timezone('utc', now()) + interval '1 year');
  else
    -- Default: customer role, activate until 2099 (essentially forever)
    user_role_val := 'customer'::public.user_role;
    account_active_until_val := '2099-12-31 23:59:59+00'::timestamptz;
  end if;

  -- Insert user into public.users with appropriate role and activation
  insert into public.users (id, email, role, account_active_until)
  values (new.id, new.email, user_role_val, account_active_until_val)
  on conflict (id) do update
    set role = excluded.role,
        account_active_until = excluded.account_active_until,
        updated_at = timezone('utc', now());
  
  return new;
end;
$$;

-- The trigger already exists, but we've updated the function it calls
-- No need to recreate the trigger






