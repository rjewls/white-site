-- Check sample order data structure
SELECT 
    id,
    customer_name,
    customer_phone,
    delivery_address,
    total_price,
    product_title,
    quantity,
    status,
    wilaya_id,
    commune,
    client,
    phone,
    adresse,
    montant,
    produit,
    type_id,
    poids,
    remarque,
    delivery_option,
    station_code
FROM orders 
ORDER BY created_at DESC 
LIMIT 3;
