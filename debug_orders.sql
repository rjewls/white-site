-- Check orders data to debug validation issues
-- Run this in Supabase SQL Editor to see order data

-- Check recent orders with their weight and other key fields
SELECT 
    id,
    client,
    phone,
    adresse,
    wilaya_id,
    commune,
    montant,
    produit,
    poids,
    type_id,
    stop_desk,
    quantite,
    created_at,
    is_validated,
    tracking
FROM orders 
ORDER BY created_at DESC 
LIMIT 10;

-- Check for orders with missing or invalid weight
SELECT 
    id,
    client,
    poids,
    CASE 
        WHEN poids IS NULL THEN 'NULL'
        WHEN poids <= 0 THEN 'Invalid (<=0)'
        ELSE 'Valid'
    END as weight_status
FROM orders 
WHERE poids IS NULL OR poids <= 0
ORDER BY created_at DESC;

-- Check for orders with missing required fields
SELECT 
    id,
    CASE WHEN client IS NULL OR client = '' THEN 'Missing client' END as client_issue,
    CASE WHEN phone IS NULL OR phone = '' THEN 'Missing phone' END as phone_issue,
    CASE WHEN adresse IS NULL OR adresse = '' THEN 'Missing address' END as address_issue,
    CASE WHEN wilaya_id IS NULL OR wilaya_id < 1 OR wilaya_id > 48 THEN 'Invalid wilaya_id' END as wilaya_issue,
    CASE WHEN commune IS NULL OR commune = '' THEN 'Missing commune' END as commune_issue,
    CASE WHEN montant IS NULL OR montant <= 0 THEN 'Invalid amount' END as amount_issue,
    CASE WHEN produit IS NULL OR produit = '' THEN 'Missing product' END as product_issue
FROM orders 
WHERE client IS NULL OR client = '' 
   OR phone IS NULL OR phone = ''
   OR adresse IS NULL OR adresse = ''
   OR wilaya_id IS NULL OR wilaya_id < 1 OR wilaya_id > 48
   OR commune IS NULL OR commune = ''
   OR montant IS NULL OR montant <= 0
   OR produit IS NULL OR produit = ''
ORDER BY created_at DESC;
