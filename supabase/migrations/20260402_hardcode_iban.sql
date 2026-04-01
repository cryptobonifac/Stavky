-- Hardcode IBAN to SK04 0900 0000 0006 5313 0128
-- This IBAN is read-only and cannot be changed by admin or any other user.

-- 1. Update the existing row to the correct IBAN
UPDATE public.activation_settings
SET iban = 'SK04 0900 0000 0006 5313 0128';

-- 2. Add a CHECK constraint so the IBAN can never be changed to anything else
ALTER TABLE public.activation_settings
ADD CONSTRAINT activation_settings_iban_fixed
CHECK (iban = 'SK04 0900 0000 0006 5313 0128');
