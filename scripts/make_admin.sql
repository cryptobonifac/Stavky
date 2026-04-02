-- Make a user admin (betting role) and activate their account
-- Usage: Replace 'user@example.com' with the target email address

DO $$
DECLARE
  target_email text := 'gejzah@gmail.com';  -- CHANGE THIS
  affected_rows int;
BEGIN
  UPDATE public.users
  SET role = 'betting',
      account_active_until = '2099-12-31T23:59:59Z'
  WHERE email = target_email;

  GET DIAGNOSTICS affected_rows = ROW_COUNT;

  IF affected_rows = 0 THEN
    RAISE EXCEPTION 'No user found with email: %', target_email;
  ELSE
    RAISE NOTICE 'User % is now admin with active account', target_email;
  END IF;
END $$;
