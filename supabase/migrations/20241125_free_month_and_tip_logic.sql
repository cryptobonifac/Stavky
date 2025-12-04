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
    from public.betting_tips
    where date_trunc('month', match_date) = date_trunc('month', target_month)
      and status = 'loss'
  );
$$;

create or replace function public.month_loss_count(target_month date)
returns integer
language sql
stable
as $$
  select count(*)
  from public.betting_tips
  where date_trunc('month', match_date) = date_trunc('month', target_month)
    and status = 'loss';
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

create or replace function public.apply_free_month_from_loss()
returns trigger
language plpgsql
as $$
declare
  target_month date := date_trunc('month', new.match_date)::date;
begin
  if coalesce(old.status, 'pending') = new.status then
    return new;
  end if;

  if new.status <> 'loss' then
    return new;
  end if;

  if public.should_grant_free_month(target_month) then
    update public.user_subscriptions
    set next_month_free = true
    where month = target_month
      and next_month_free = false;
  end if;

  return new;
end;
$$;

create trigger trg_betting_tips_loss_free_month
after update on public.betting_tips
for each row
when (old.status is distinct from new.status)
execute function public.apply_free_month_from_loss();

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
  )
  select
    date_trunc('month', match_date)::date as month_start,
    count(*) filter (where status = 'win')::integer as wins,
    count(*) filter (where status = 'loss')::integer as losses,
    count(*) filter (where status = 'pending')::integer as pending,
    count(*)::integer as total,
    case
      when count(*) filter (where status in ('win', 'loss')) = 0 then 0
      else round(
        count(*) filter (where status = 'win')::numeric
        / nullif(count(*) filter (where status in ('win', 'loss')), 0)
        * 100,
        2
      )
    end as success_rate
  from public.betting_tips, month_limits
  where match_date >= date_trunc(
      'month',
      timezone('utc', now())
      - ((month_limits.months_to_show - 1) * interval '1 month')
    )
  group by 1
  order by month_start desc
  limit (select months_to_show from month_limits);
$$;

drop policy if exists "active customers view history" on public.betting_tips;

create policy "active customers view history"
  on public.betting_tips
  for select
  using (
    public.is_active_customer()
    and status in ('win', 'loss')
  );


