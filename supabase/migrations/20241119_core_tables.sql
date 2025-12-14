-- Core tables for Stavky sports betting application
-- Generated on 2024-11-19

create schema if not exists public;

create extension if not exists "pgcrypto";

do $$
begin
  if not exists (
    select 1 from pg_type typ
    join pg_namespace ns on ns.oid = typ.typnamespace
    where typ.typname = 'user_role'
      and ns.nspname = 'public'
  ) then
    create type public.user_role as enum ('betting', 'customer');
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_type typ
    join pg_namespace ns on ns.oid = typ.typnamespace
    where typ.typname = 'tip_status'
      and ns.nspname = 'public'
  ) then
    create type public.tip_status as enum ('pending', 'win', 'loss');
  end if;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  role public.user_role not null default 'customer',
  account_active_until timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_users_updated_at on public.users;
create trigger set_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();

create table if not exists public.betting_companies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.sports (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists sports_name_unique_idx
  on public.sports (lower(name));

create table if not exists public.leagues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sport_id uuid not null references public.sports (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (sport_id, name)
);

create index if not exists leagues_sport_id_idx
  on public.leagues (sport_id);

create table if not exists public.betting_tips (
  id uuid primary key default gen_random_uuid(),
  betting_company_id uuid not null references public.betting_companies (id) on delete restrict,
  sport_id uuid not null references public.sports (id) on delete restrict,
  league_id uuid not null references public.leagues (id) on delete restrict,
  match text not null,
  odds numeric(5,3) not null check (odds >= 1.001 and odds <= 2.0),
  match_date timestamptz not null,
  status public.tip_status not null default 'pending',
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_betting_tips_updated_at on public.betting_tips;
create trigger set_betting_tips_updated_at
before update on public.betting_tips
for each row execute function public.set_updated_at();

create index if not exists betting_tips_company_idx
  on public.betting_tips (betting_company_id);

create index if not exists betting_tips_sport_idx
  on public.betting_tips (sport_id);

create index if not exists betting_tips_league_idx
  on public.betting_tips (league_id);

create index if not exists betting_tips_status_idx
  on public.betting_tips (status);

create table if not exists public.user_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  month date not null,
  valid_to timestamptz,
  next_month_free boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, month)
);

create index if not exists user_subscriptions_user_idx
  on public.user_subscriptions (user_id, month);

create table if not exists public.marketing_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_marketing_settings_updated_at on public.marketing_settings;
create trigger set_marketing_settings_updated_at
before update on public.marketing_settings
for each row execute function public.set_updated_at();


