-- Free month automation and tip evaluation improvements

drop trigger if exists trg_betting_tips_loss_free_month on public.betting_tips;

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

create or replace function public.should_grant_free_month(target_month date)
returns boolean
language plpgsql
stable
as $$
declare
  rules jsonb;
  auto_enabled boolean := true;
  threshold integer := 1;
  loss_total integer := 0;
begin
  select value
  into rules
  from public.marketing_settings
  where key = 'free_month_rules';

  if rules is not null then
    auto_enabled := coalesce((rules->>'autoFreeMonth')::boolean, true);
    threshold := coalesce((rules->>'lossThreshold')::integer, 1);
  end if;

  threshold := greatest(threshold, 1);

  if not auto_enabled then
    return false;
  end if;

  select public.month_loss_count(target_month)
  into loss_total;

  return loss_total >= threshold;
end;
$$;

-- Note: apply_free_month_from_loss function and trg_betting_tips_loss_free_month trigger
-- have been removed from this migration as they reference the old schema (match_date in betting_tips).
-- These are properly defined in 20250121_fix_functions_after_column_removal.sql
-- with the correct schema that gets match_date from betting_tip_items.

create or replace function public.extend_account_on_free_month()
returns trigger
language plpgsql
as $$
declare
  free_until timestamptz;
begin
  if coalesce(old.next_month_free, false) = false and new.next_month_free then
    free_until := timezone(
      'utc',
      (new.month::timestamp + interval '2 months') - interval '1 second'
    );

    update public.users
    set account_active_until = greatest(
      coalesce(account_active_until, free_until),
      free_until
    )
    where id = new.user_id;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_user_subscriptions_free_month on public.user_subscriptions;

create trigger trg_user_subscriptions_free_month
after insert or update on public.user_subscriptions
for each row
execute function public.extend_account_on_free_month();

-- Note: tip_monthly_summary function has been removed from this migration
-- as it references the old schema (match_date in betting_tips).
-- This function is properly defined in 20250121_fix_functions_after_column_removal.sql
-- with the correct schema that gets match_date from betting_tip_items.

drop policy if exists "active customers view history" on public.betting_tips;

create policy "active customers view history"
  on public.betting_tips
  for select
  using (
    public.is_active_customer()
    and status in ('win', 'loss')
  );


