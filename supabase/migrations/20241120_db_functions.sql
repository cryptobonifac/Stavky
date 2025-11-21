-- Additional database functions and triggers for business logic

create or replace function public.user_has_active_account(target_user_id uuid)
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

create or replace function public.validate_odds_range(input_odds numeric)
returns numeric
language plpgsql
immutable
as $$
begin
  if input_odds < 1.001 or input_odds > 2.0 then
    raise exception using
      message = format(
        'Odds %.3f are outside of the allowed range (1.001 - 2.00)',
        input_odds
      ),
      errcode = '22003';
  end if;
  return input_odds;
end;
$$;

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
  with monthly as (
    select status
    from public.betting_tips
    where date_trunc('month', match_date) = date_trunc('month', target_month)
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

create or replace function public.apply_free_month_from_loss()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'loss' and coalesce(old.status, 'pending') <> 'loss' then
    update public.user_subscriptions
    set next_month_free = true
    where month = date_trunc('month', new.match_date)::date
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


