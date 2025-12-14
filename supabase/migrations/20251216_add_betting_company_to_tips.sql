-- Migration: Add betting_company_id back to betting_tips table
-- Created: 2025-12-16
--
-- The betting_company_id was previously removed from betting_tips table,
-- but it's needed to track which betting company each bet is placed with.
-- Since all tips within a bet must be from the same company (enforced by UI),
-- we store betting_company_id at the betting_tips level, not in betting_tip_items.

-- Add betting_company_id column back to betting_tips
alter table public.betting_tips
  add column if not exists betting_company_id uuid references public.betting_companies (id) on delete restrict;

-- Create index for better query performance
create index if not exists betting_tips_company_idx
  on public.betting_tips (betting_company_id);

-- Update any existing tips without betting_company_id to use the first available company
-- This is a safety measure for existing data
do $$
declare
  first_company_id uuid;
begin
  select id into first_company_id from public.betting_companies limit 1;

  if first_company_id is not null then
    update public.betting_tips
    set betting_company_id = first_company_id
    where betting_company_id is null;
  end if;
end $$;

-- Make betting_company_id required for new records
alter table public.betting_tips
  alter column betting_company_id set not null;
