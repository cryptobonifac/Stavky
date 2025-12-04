create or replace function public.is_user_account_active(target_user_id uuid)
returns boolean
language sql
stable
as $$
  select coalesce(
    (
      select account_active_until is not null
        and account_active_until >= timezone('utc', now())
      from public.users
      where id = target_user_id
    ),
    false
  );
$$;


