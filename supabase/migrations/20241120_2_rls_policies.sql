-- RLS configuration and policies for core tables

create or replace function public.has_role(target_role public.user_role)
returns boolean
language sql
stable
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
stable
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

alter table public.users enable row level security;
alter table public.users force row level security;

create policy "users can view own profile"
  on public.users
  for select
  using (auth.uid() = id);

create policy "betting role can view all users"
  on public.users
  for select
  using (public.has_role('betting'));

create policy "betting role can manage users"
  on public.users
  for all
  using (public.has_role('betting'))
  with check (public.has_role('betting'));

alter table public.betting_companies enable row level security;
alter table public.betting_companies force row level security;

-- Allow public read access to reference data (not sensitive)
create policy "public can view betting companies"
  on public.betting_companies
  for select
  using (true);

create policy "betting role can manage betting companies"
  on public.betting_companies
  for all
  using (public.has_role('betting'))
  with check (public.has_role('betting'));

alter table public.sports enable row level security;
alter table public.sports force row level security;

-- Allow public read access to reference data (not sensitive)
create policy "public can view sports"
  on public.sports
  for select
  using (true);

create policy "betting role can manage sports"
  on public.sports
  for all
  using (public.has_role('betting'))
  with check (public.has_role('betting'));

alter table public.leagues enable row level security;
alter table public.leagues force row level security;

-- Allow public read access to reference data (not sensitive)
create policy "public can view leagues"
  on public.leagues
  for select
  using (true);

create policy "betting role can manage leagues"
  on public.leagues
  for all
  using (public.has_role('betting'))
  with check (public.has_role('betting'));

alter table public.betting_tips enable row level security;
alter table public.betting_tips force row level security;

create policy "betting role manage betting tips"
  on public.betting_tips
  for all
  using (public.has_role('betting'))
  with check (public.has_role('betting'));

create policy "active customers view pending tips"
  on public.betting_tips
  for select
  using (
    public.is_active_customer()
    and status = 'pending'
  );

create policy "public homepage tips preview"
  on public.betting_tips
  for select
  using (
    coalesce(auth.role(), 'anon') = 'anon'
    and status = 'pending'
  );

alter table public.user_subscriptions enable row level security;
alter table public.user_subscriptions force row level security;

drop policy if exists "betting role manage user subscriptions" on public.user_subscriptions;
create policy "betting role manage user subscriptions"
  on public.user_subscriptions
  for all
  using (public.has_role('betting'))
  with check (public.has_role('betting'));

drop policy if exists "customers view own subscriptions" on public.user_subscriptions;
create policy "customers view own subscriptions"
  on public.user_subscriptions
  for select
  using (auth.uid() = user_id);

alter table public.marketing_settings enable row level security;
alter table public.marketing_settings force row level security;

drop policy if exists "betting role manage marketing settings" on public.marketing_settings;
create policy "betting role manage marketing settings"
  on public.marketing_settings
  for all
  using (public.has_role('betting'))
  with check (public.has_role('betting'));

drop policy if exists "homepage marketing settings" on public.marketing_settings;
create policy "homepage marketing settings"
  on public.marketing_settings
  for select
  using (
    coalesce(auth.role(), 'anon') in ('anon', 'authenticated')
    or public.is_active_customer()
    or public.has_role('betting')
  );


