-- Set up working Noest API configuration
-- Run this in Supabase SQL Editor

-- Clear any existing config
DELETE FROM noest_express_config;

-- Insert working configuration
-- IMPORTANT: These are the REAL working credentials from successful test
INSERT INTO noest_express_config (api_token, guid, is_active) VALUES 
('T16o0j0unC4B2ezppK1Pt2ENuvvz6iJ9hzI', 'QWJYXWLP', true);

-- Verify the configuration was saved
SELECT 
  id,
  api_token,
  guid,
  is_active,
  created_at
FROM noest_express_config 
WHERE is_active = true;

-- Test query to make sure everything is set up
SELECT 
  'Noest API configuration is ready!' as status,
  'API Token length: ' || LENGTH(api_token) as token_info,
  'GUID: ' || guid as guid_info
FROM noest_express_config 
WHERE is_active = true;
