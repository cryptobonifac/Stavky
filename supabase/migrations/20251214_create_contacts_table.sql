-- Migration: Create contacts table for contact form submissions
-- Created: 2024-12-14

-- Create contacts table
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  mobile text,
  message text,
  created_at timestamptz not null default timezone('utc', now())
);

-- Create index on email for faster lookups
create index if not exists contacts_email_idx
  on public.contacts (email);

-- Create index on created_at for sorting
create index if not exists contacts_created_at_idx
  on public.contacts (created_at desc);

-- Enable RLS
alter table public.contacts enable row level security;
alter table public.contacts force row level security;

-- Policy: Only betting role can view all contacts
create policy "betting role can view all contacts"
  on public.contacts
  for select
  using (public.has_role('betting'));

-- Policy: Anyone can insert contacts (for contact form submissions)
create policy "public can insert contacts"
  on public.contacts
  for insert
  with check (true);

-- Policy: Only betting role can delete contacts
create policy "betting role can delete contacts"
  on public.contacts
  for delete
  using (public.has_role('betting'));







