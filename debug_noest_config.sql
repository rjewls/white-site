-- Debug: Check if Noest configuration is saved properly
-- Run this in your Supabase SQL editor

-- Check if the table exists and has data
SELECT * FROM noest_express_config;

-- If no data, let's insert a test record manually to see if the issue is with saving
-- Replace 'YOUR_API_TOKEN' and 'YOUR_GUID' with your actual values
-- INSERT INTO noest_express_config (api_token, guid) 
-- VALUES ('YOUR_API_TOKEN', 'YOUR_GUID');
