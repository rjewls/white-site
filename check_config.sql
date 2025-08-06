-- Check current Noest configuration
SELECT 
    id,
    api_token,
    guid,
    is_active,
    created_at,
    updated_at
FROM noest_express_config 
ORDER BY created_at DESC;
