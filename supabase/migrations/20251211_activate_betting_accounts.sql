-- Migration to activate accounts and assign betting role to emails from active-bettings-accounts.txt
-- Emails: igorpod69@gmail.com, busikpartners@gmail.com, marek.rohon@gmail.com

do $$
declare
  email_list text[] := array[
    'igorpod69@gmail.com',
    'busikpartners@gmail.com',
    'marek.rohon@gmail.com'
  ];
  email_item text;
  role_result jsonb;
  activation_result jsonb;
  success_count integer := 0;
  error_count integer := 0;
  errors text[] := array[]::text[];
begin
  -- Loop through each email
  foreach email_item in array email_list
  loop
    begin
      -- First, set the betting role
      select public.set_betting_role_by_email(email_item) into role_result;
      
      if (role_result->>'success')::boolean = false then
        error_count := error_count + 1;
        errors := array_append(errors, format('Role assignment failed for %s: %s', email_item, role_result->>'error'));
        continue;
      end if;
      
      -- Then, activate the account (defaults to 1 year from now)
      select public.activate_account_by_email(email_item) into activation_result;
      
      if (activation_result->>'success')::boolean = false then
        error_count := error_count + 1;
        errors := array_append(errors, format('Account activation failed for %s: %s', email_item, activation_result->>'error'));
        continue;
      end if;
      
      success_count := success_count + 1;
      
    exception
      when others then
        error_count := error_count + 1;
        errors := array_append(errors, format('Exception for %s: %s', email_item, sqlerrm));
    end;
  end loop;
  
  -- Log results
  raise notice 'Activation complete: % successful, % errors', success_count, error_count;
  
  if array_length(errors, 1) > 0 then
    raise notice 'Errors: %', array_to_string(errors, '; ');
  end if;
end;
$$;

