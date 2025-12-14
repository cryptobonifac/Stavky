-- Migration to activate all existing users and ensure new registrations are activated
-- This function activates all users who don't have an active account (account_active_until is NULL or in the past)

create or replace function public.activate_all_users()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_count integer;
  activation_date timestamptz := '2099-12-31 23:59:59+00'::timestamptz;
begin
  -- Update all users where account_active_until is NULL or in the past
  update public.users
  set account_active_until = activation_date
  where account_active_until is null
     or account_active_until < timezone('utc', now());
  
  get diagnostics updated_count = row_count;
  
  return jsonb_build_object(
    'success', true,
    'users_activated', updated_count,
    'activation_date', activation_date
  );
end;
$$;

-- Execute the function to activate all existing users
select public.activate_all_users();









