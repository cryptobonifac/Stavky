-- Migration: Remove Nike and Tipsport betting providers
-- Keeps only Bet365 as the sole betting provider

-- First, delete all tips linked to Nike and Tipsport
DELETE FROM public.betting_tip
WHERE betting_company_id IN (
  SELECT id FROM public.betting_companies WHERE LOWER(name) IN ('nike', 'tipsport')
);

-- Then delete Nike and Tipsport companies
DELETE FROM public.betting_companies WHERE LOWER(name) IN ('nike', 'tipsport');
