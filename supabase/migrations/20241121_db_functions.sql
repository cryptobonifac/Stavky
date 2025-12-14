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

-- Note: tip_success_rate, apply_free_month_from_loss, and related trigger
-- have been removed from this migration as they reference the old schema.
-- These functions are properly defined in 20250121_fix_functions_after_column_removal.sql
-- with the correct schema that uses betting_tip_items.


