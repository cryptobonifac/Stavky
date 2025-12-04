-- Fix infinite recursion in RLS policies by making helper functions SECURITY DEFINER
-- This ensures they run with the privileges of the function creator (superuser)
-- and bypass RLS on the users table when checking roles.

create or replace function public.has_role(target_role public.user_role)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
      and role = target_role
  );
$$;

create or replace function public.is_active_customer()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
      and role = 'customer'
      and account_active_until is not null
      and account_active_until >= timezone('utc', now())
  );
$$;
