-- Migration: Add betting_tip_items table to support multiple tips within one bet
-- Created: 2024-12-03

-- Create betting_tip_items table to store individual tips within a bet
-- Note: Uses text fields for sport and league (final schema after migrations)
create table if not exists public.betting_tip_items (
  id uuid primary key default gen_random_uuid(),
  betting_tip_id uuid not null references public.betting_tips (id) on delete cascade,
  sport text not null,
  league text not null,
  match text not null,
  odds numeric(5,3) not null check (odds >= 1.001 and odds <= 2.0),
  match_date timestamptz not null,
  status public.tip_status not null default 'pending',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Create trigger for updated_at
drop trigger if exists set_betting_tip_items_updated_at on public.betting_tip_items;
create trigger set_betting_tip_items_updated_at
before update on public.betting_tip_items
for each row execute function public.set_updated_at();

-- Create indexes
create index if not exists betting_tip_items_betting_tip_id_idx
  on public.betting_tip_items (betting_tip_id);

create index if not exists betting_tip_items_status_idx
  on public.betting_tip_items (status);

-- Update betting_tips table to support the new structure
-- Add a description field for the combined bet
alter table public.betting_tips
  add column if not exists description text;

-- Add RLS policies for betting_tip_items
alter table public.betting_tip_items enable row level security;

-- Policy: Betting admins can do everything
drop policy if exists "Betting admins can manage betting_tip_items" on public.betting_tip_items;
create policy "Betting admins can manage betting_tip_items"
  on public.betting_tip_items
  for all
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role = 'betting'
    )
  );

-- Policy: Customers can view items of active bets
drop policy if exists "Customers can view betting_tip_items of active bets" on public.betting_tip_items;
create policy "Customers can view betting_tip_items of active bets"
  on public.betting_tip_items
  for select
  using (
    exists (
      select 1 from public.betting_tips
      where betting_tips.id = betting_tip_items.betting_tip_id
      and betting_tips.status = 'pending'
      and exists (
        select 1 from public.users
        where users.id = auth.uid()
        and (
          users.role = 'betting'
          or (
            users.role = 'customer'
            and users.account_active_until >= timezone('utc', now())
          )
        )
      )
    )
  );

