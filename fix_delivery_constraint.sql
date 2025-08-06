-- Fix delivery_option constraint issue
-- Run this in your Supabase SQL editor

-- Drop the conflicting constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_delivery_option_check;

-- Add the correct constraint that allows only the 2 delivery options used by the form
ALTER TABLE orders ADD CONSTRAINT IF NOT EXISTS orders_delivery_option_check 
CHECK (delivery_option = ANY (ARRAY['home'::text, 'stopdesk'::text]));
