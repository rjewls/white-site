-- Check the exact structure and values of your noest_express_config
-- Run this in your Supabase SQL editor

SELECT 
  id,
  api_token,
  guid,
  is_active,
  created_at,
  updated_at
FROM noest_express_config;

-- Also update the is_active field to make sure it's true
UPDATE noest_express_config 
SET is_active = true 
WHERE is_active IS NULL OR is_active = false;
