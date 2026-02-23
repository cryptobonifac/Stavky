-- Add full_name column to users table for author display
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Create 3 dummy author accounts
DO $$
DECLARE
  author1_id uuid := gen_random_uuid();
  author2_id uuid := gen_random_uuid();
  author3_id uuid := gen_random_uuid();
BEGIN
  -- Author 1: John Smith
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role)
  VALUES (
    author1_id,
    'john.smith@stavky.com',
    crypt('author123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "John Smith"}',
    'authenticated',
    'authenticated'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    author1_id,
    jsonb_build_object('sub', author1_id, 'email', 'john.smith@stavky.com'),
    'email',
    author1_id::text,
    NOW(),
    NOW()
  )
  ON CONFLICT (provider_id, provider) DO NOTHING;

  INSERT INTO public.users (id, email, role, full_name, account_active_until)
  VALUES (author1_id, 'john.smith@stavky.com', 'betting', 'John Smith', NOW() + INTERVAL '10 years')
  ON CONFLICT (id) DO UPDATE SET full_name = 'John Smith', role = 'betting';

  -- Author 2: Sarah Johnson
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role)
  VALUES (
    author2_id,
    'sarah.johnson@stavky.com',
    crypt('author123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Sarah Johnson"}',
    'authenticated',
    'authenticated'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    author2_id,
    jsonb_build_object('sub', author2_id, 'email', 'sarah.johnson@stavky.com'),
    'email',
    author2_id::text,
    NOW(),
    NOW()
  )
  ON CONFLICT (provider_id, provider) DO NOTHING;

  INSERT INTO public.users (id, email, role, full_name, account_active_until)
  VALUES (author2_id, 'sarah.johnson@stavky.com', 'betting', 'Sarah Johnson', NOW() + INTERVAL '10 years')
  ON CONFLICT (id) DO UPDATE SET full_name = 'Sarah Johnson', role = 'betting';

  -- Author 3: Mike Wilson
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role)
  VALUES (
    author3_id,
    'mike.wilson@stavky.com',
    crypt('author123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Mike Wilson"}',
    'authenticated',
    'authenticated'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    author3_id,
    jsonb_build_object('sub', author3_id, 'email', 'mike.wilson@stavky.com'),
    'email',
    author3_id::text,
    NOW(),
    NOW()
  )
  ON CONFLICT (provider_id, provider) DO NOTHING;

  INSERT INTO public.users (id, email, role, full_name, account_active_until)
  VALUES (author3_id, 'mike.wilson@stavky.com', 'betting', 'Mike Wilson', NOW() + INTERVAL '10 years')
  ON CONFLICT (id) DO UPDATE SET full_name = 'Mike Wilson', role = 'betting';

  RAISE NOTICE 'Created 3 dummy author accounts';
END $$;
