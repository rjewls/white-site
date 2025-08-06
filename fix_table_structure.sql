-- Fix noest_express_config table structure
-- Run this in your Supabase SQL editor

-- Add the missing is_active column if it doesn't exist
ALTER TABLE noest_express_config 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Update all existing records to have is_active = true
UPDATE noest_express_config 
SET is_active = TRUE 
WHERE is_active IS NULL;
