-- Migration: Add public RLS policy for statistics page
-- Created: 2025-01-23
--
-- This migration adds public RLS policies that allow all users (including anonymous)
-- to view all betting tips and tip items for statistics purposes, regardless of status.
-- Statistics should be visible for all users without restrictions.

-- Policy: Public can view all tips for statistics
-- This allows anyone (authenticated or anonymous) to SELECT all tips regardless of status
DROP POLICY IF EXISTS "public can view all tips for statistics" ON public.betting_tips;

CREATE POLICY "public can view all tips for statistics"
ON public.betting_tips
FOR SELECT
USING (true);

-- Policy: Public can view all tip items for statistics
-- This allows anyone to SELECT all betting_tip_items for statistics
DROP POLICY IF EXISTS "public can view all tip items for statistics" ON public.betting_tip_items;

CREATE POLICY "public can view all tip items for statistics"
ON public.betting_tip_items
FOR SELECT
USING (true);
