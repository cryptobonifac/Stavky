-- Migration: Fix database functions after removing match_date from betting_tips
-- Created: 2025-01-21
--
-- After removing match_date, match, betting_company_id, and sport_id columns from betting_tips,
-- these functions need to be updated to get match_date from betting_tip_items instead.
-- For tips with multiple items, we use the earliest match_date for grouping purposes.

-- Fix month_has_losing_tip function
-- This function checks if a given month has any losing tips
create or replace function public.month_has_losing_tip(
  target_month date default date_trunc('month', timezone('utc', now()) - interval '1 month')
)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.betting_tips bt
    where bt.status = 'loss'
      and date_trunc('month', coalesce(
        (select min(bti.match_date)
         from public.betting_tip_items bti
         where bti.betting_tip_id = bt.id),
        bt.created_at
      )) = date_trunc('month', target_month)
  );
$$;

-- Fix month_loss_count function
-- This function counts the number of losing tips in a given month
create or replace function public.month_loss_count(target_month date)
returns integer
language sql
stable
as $$
  select count(*)::integer
  from public.betting_tips bt
  where bt.status = 'loss'
    and date_trunc('month', coalesce(
      (select min(bti.match_date)
       from public.betting_tip_items bti
       where bti.betting_tip_id = bt.id),
      bt.created_at
    )) = date_trunc('month', target_month);
$$;

-- Fix tip_monthly_summary function
-- This function is used by the statistics page to get monthly summaries
create or replace function public.tip_monthly_summary(months_back integer default 12)
returns table (
  month_start date,
  wins integer,
  losses integer,
  pending integer,
  total integer,
  success_rate numeric
)
language sql
stable
as $$
  with month_limits as (
    select greatest(months_back, 1) as months_to_show
  ),
  tip_dates as (
    -- Get the earliest match_date from betting_tip_items for each tip
    -- Fallback to created_at if no items exist
    select 
      bt.id,
      bt.status,
      coalesce(
        (select min(bti.match_date) 
         from public.betting_tip_items bti 
         where bti.betting_tip_id = bt.id),
        bt.created_at
      ) as match_date
    from public.betting_tips bt
  ),
  cutoff_date as (
    select date_trunc(
      'month',
      timezone('utc', now())
      - ((month_limits.months_to_show - 1) * interval '1 month')
    ) as cutoff
    from month_limits
  )
  select
    date_trunc('month', td.match_date)::date as month_start,
    count(*) filter (where td.status = 'win')::integer as wins,
    count(*) filter (where td.status = 'loss')::integer as losses,
    count(*) filter (where td.status = 'pending')::integer as pending,
    count(*)::integer as total,
    case
      when count(*) filter (where td.status in ('win', 'loss')) = 0 then 0
      else round(
        count(*) filter (where td.status = 'win')::numeric
        / nullif(count(*) filter (where td.status in ('win', 'loss')), 0)
        * 100,
        2
      )
    end as success_rate
  from tip_dates td, month_limits, cutoff_date
  where td.match_date >= cutoff_date.cutoff
  group by month_start
  order by month_start desc
  limit (select months_to_show from month_limits);
$$;

-- Fix tip_success_rate function
-- This function calculates success rate for a specific month
create or replace function public.tip_success_rate(target_month date)
returns table (
  month_start date,
  wins integer,
  losses integer,
  pending integer,
  total integer,
  success_rate numeric
)
language sql
stable
as $$
  with tip_dates as (
    -- Get the earliest match_date from betting_tip_items for each tip
    -- Fallback to created_at if no items exist
    select 
      bt.id,
      bt.status,
      coalesce(
        (select min(bti.match_date) 
         from public.betting_tip_items bti 
         where bti.betting_tip_id = bt.id),
        bt.created_at
      ) as match_date
    from public.betting_tips bt
  ),
  monthly as (
    select td.status
    from tip_dates td
    where date_trunc('month', td.match_date) = date_trunc('month', target_month)
  )
  select
    date_trunc('month', target_month)::date as month_start,
    coalesce(sum(case when status = 'win' then 1 else 0 end), 0) as wins,
    coalesce(sum(case when status = 'loss' then 1 else 0 end), 0) as losses,
    coalesce(sum(case when status = 'pending' then 1 else 0 end), 0) as pending,
    count(*) as total,
    case
      when count(*) filter (where status in ('win', 'loss')) = 0 then 0
      else round(
        coalesce(sum(case when status = 'win' then 1 else 0 end), 0)::numeric
        / nullif(count(*) filter (where status in ('win', 'loss')), 0)
        * 100,
        2
      )
    end as success_rate
  from monthly;
$$;

-- Fix apply_free_month_from_loss trigger function
-- This function is triggered when a tip status changes to 'loss'
-- It needs to get the match_date from betting_tip_items to determine the month
create or replace function public.apply_free_month_from_loss()
returns trigger
language plpgsql
as $$
declare
  target_month date;
  earliest_match_date timestamptz;
begin
  if coalesce(old.status, 'pending') = new.status then
    return new;
  end if;

  if new.status <> 'loss' then
    return new;
  end if;

  -- Get the earliest match_date from betting_tip_items
  -- Fallback to created_at if no items exist
  select coalesce(
    (select min(bti.match_date)
     from public.betting_tip_items bti
     where bti.betting_tip_id = new.id),
    new.created_at
  ) into earliest_match_date;

  target_month := date_trunc('month', earliest_match_date)::date;

  if public.should_grant_free_month(target_month) then
    update public.user_subscriptions
    set next_month_free = true
    where month = target_month
      and next_month_free = false;
  end if;

  return new;
end;
$$;

-- Create the trigger for apply_free_month_from_loss
drop trigger if exists trg_betting_tips_loss_free_month on public.betting_tips;
create trigger trg_betting_tips_loss_free_month
after update on public.betting_tips
for each row
execute function public.apply_free_month_from_loss();






