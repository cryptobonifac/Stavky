-- SQL script to set betting role for user: busikpartners@gmail.com
-- 
-- Direct SQL UPDATE statement to change user role to 'betting'
--
-- Usage:
--   1. Run this in Supabase SQL Editor (production)
--   2. Or run via Supabase CLI: supabase db execute -f scripts/set-betting-role-busikpartners.sql
--
-- Note: This assumes the user already exists in public.users table.
-- If the user doesn't exist, you may need to create them first via:
--   - Supabase Dashboard → Authentication → Users
--   - Or use: node scripts/create-betting-user.js busikpartners@gmail.com <password> betting

-- Update user role to betting
UPDATE public.users
SET 
  role = 'betting'::public.user_role,
  updated_at = timezone('utc', now())
WHERE email = 'busikpartners@gmail.com';

-- Verify the update
SELECT id, email, role, account_active_until, created_at, updated_at
FROM public.users
WHERE email = 'busikpartners@gmail.com';

