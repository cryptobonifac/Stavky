-- Function to activate a user account by email
-- Usage: SELECT public.activate_account_by_email('user@example.com');

create or replace function public.activate_account_by_email(
  user_email text,
  active_until_date timestamptz default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  user_id_val uuid;
  activation_date timestamptz;
  result jsonb;
begin
  -- Default to 1 year from now if no date provided
  if active_until_date is null then
    activation_date := (timezone('utc', now()) + interval '1 year');
  else
    activation_date := active_until_date;
  end if;

  -- Find user by email
  select id into user_id_val
  from public.users
  where email = user_email;

  if user_id_val is null then
    return jsonb_build_object(
      'success', false,
      'error', 'User not found',
      'email', user_email
    );
  end if;

  -- Update account_active_until
  update public.users
  set account_active_until = activation_date,
      updated_at = timezone('utc', now())
  where id = user_id_val;

  -- Return success with user info
  select jsonb_build_object(
    'success', true,
    'email', email,
    'id', id,
    'role', role,
    'account_active_until', account_active_until
  ) into result
  from public.users
  where id = user_id_val;

  return result;
exception
  when others then
    return jsonb_build_object(
      'success', false,
      'error', sqlerrm,
      'email', user_email
    );
end;
$$;

-- Grant execute permission to authenticated users (or adjust as needed)
-- Note: PostgreSQL handles default parameters, so we only need to grant for the full signature
grant execute on function public.activate_account_by_email(text, timestamptz) to authenticated;

-- Example usage:
-- SELECT public.activate_account_by_email('customer5@gmail.com');
-- SELECT public.activate_account_by_email('customer5@gmail.com', '2025-12-31 23:59:59+00'::timestamptz);

