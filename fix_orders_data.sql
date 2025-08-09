-- Update existing orders to have valid weight if missing
-- Run this in Supabase SQL Editor

-- First, check current state
SELECT 
    COUNT(*) as total_orders,
    COUNT(poids) as orders_with_weight,
    COUNT(*) - COUNT(poids) as orders_without_weight,
    MIN(poids) as min_weight,
    MAX(poids) as max_weight,
    AVG(poids) as avg_weight
FROM orders;

-- Update orders with missing or invalid weight to default 1kg
UPDATE orders 
SET poids = 1 
WHERE poids IS NULL OR poids <= 0;

-- Update type_id for orders that don't have it set
UPDATE orders 
SET type_id = 1 
WHERE type_id IS NULL OR type_id < 1 OR type_id > 3;

-- Update stop_desk for orders that don't have it properly set
UPDATE orders 
SET stop_desk = CASE 
    WHEN delivery_option = 'stopdesk' THEN 1 
    ELSE 0 
END
WHERE stop_desk IS NULL;

-- Update can_open for orders that don't have it set
UPDATE orders 
SET can_open = 1 
WHERE can_open IS NULL;

-- Update stock for orders that don't have it set
UPDATE orders 
SET stock = 1 
WHERE stock IS NULL;

-- Update quantite for orders that don't have it set
UPDATE orders 
SET quantite = '1' 
WHERE quantite IS NULL OR quantite = '';

-- Final check
SELECT 
    COUNT(*) as total_orders,
    COUNT(CASE WHEN poids > 0 THEN 1 END) as valid_weight_orders,
    COUNT(CASE WHEN type_id BETWEEN 1 AND 3 THEN 1 END) as valid_type_id_orders,
    COUNT(CASE WHEN stop_desk IN (0, 1) THEN 1 END) as valid_stop_desk_orders
FROM orders;
