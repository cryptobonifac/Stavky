-- Migration: Create results table and add result_id to betting_tip
-- Created: 2025-01-25
--
-- This migration creates the results table and adds a result_id foreign key column to betting_tip

-- Step 1: Create results table
CREATE TABLE IF NOT EXISTS public.results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

-- Create unique index on name (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS results_name_unique_idx
  ON public.results (lower(name));

-- Enable RLS
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public can view all results (no role restrictions)
-- This allows anyone (including anonymous users) to read results
CREATE POLICY "public can view all results"
  ON public.results
  FOR SELECT
  USING (true);

-- RLS Policy: Betting role can manage results (INSERT, UPDATE, DELETE)
-- Note: SELECT is already covered by the public policy above
CREATE POLICY "betting role can manage results"
  ON public.results
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'betting'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'betting'
    )
  );

-- Seed initial data: 1, 2, X
INSERT INTO public.results (name)
VALUES ('1'), ('2'), ('X')
ON CONFLICT (lower(name)) DO NOTHING;

-- Step 2: Add result_id column to betting_tip table
ALTER TABLE public.betting_tip 
  ADD COLUMN IF NOT EXISTS result_id uuid REFERENCES public.results(id) ON DELETE RESTRICT;

-- Create index on result_id for better query performance
CREATE INDEX IF NOT EXISTS betting_tip_result_id_idx ON public.betting_tip(result_id);

-- Note: result_id remains nullable to allow migration of existing data
-- It can be set to NOT NULL later after all existing records have a default value









