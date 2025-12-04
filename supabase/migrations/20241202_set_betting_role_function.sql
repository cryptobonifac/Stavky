-- Function to set betting role for a user by email
-- Usage: SELECT public.set_betting_role_by_email('user@example.com');

create or replace function public.set_betting_role_by_email(
  user_email text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  user_id_val uuid;
  result jsonb;
begin
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

  -- Update role to betting
  update public.users
  set role = 'betting'::public.user_role,
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

-- Grant execute permission to authenticated users
grant execute on function public.set_betting_role_by_email(text) to authenticated;

-- Example usage:
-- SELECT public.set_betting_role_by_email('admin@example.com');

