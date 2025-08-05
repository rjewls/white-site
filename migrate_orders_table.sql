-- Migration script to update existing orders table for Noest Express API compatibility
-- Run this AFTER creating the existing orders table

-- Step 1: Add new columns for Noest API compatibility
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS reference TEXT,
ADD COLUMN IF NOT EXISTS produit TEXT,
ADD COLUMN IF NOT EXISTS client TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS phone_2 TEXT,
ADD COLUMN IF NOT EXISTS adresse TEXT,
ADD COLUMN IF NOT EXISTS wilaya_id INTEGER,
ADD COLUMN IF NOT EXISTS montant DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS remarque TEXT,
ADD COLUMN IF NOT EXISTS type_id INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS poids INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS stop_desk INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS station_code TEXT,
ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS quantite TEXT,
ADD COLUMN IF NOT EXISTS can_open INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS is_validated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS driver_name TEXT,
ADD COLUMN IF NOT EXISTS driver_phone TEXT;

-- Step 2: Create backup columns (optional, for safety)
-- We'll keep the original columns as backup and populate new ones

-- Step 3: Update column constraints and checks
-- Add constraints for new columns
ALTER TABLE orders ADD CONSTRAINT check_wilaya_id CHECK (wilaya_id IS NULL OR wilaya_id BETWEEN 1 AND 48);
ALTER TABLE orders ADD CONSTRAINT check_type_id CHECK (type_id BETWEEN 1 AND 3);
ALTER TABLE orders ADD CONSTRAINT check_stop_desk CHECK (stop_desk BETWEEN 0 AND 1);
ALTER TABLE orders ADD CONSTRAINT check_stock CHECK (stock BETWEEN 0 AND 1);
ALTER TABLE orders ADD CONSTRAINT check_can_open CHECK (can_open BETWEEN 0 AND 1);

-- Step 4: Update status column to include new statuses
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'validated', 'shipped', 'delivered', 'cancelled', 'returned'));

-- Step 5: Migrate existing data to new columns
UPDATE orders SET 
  client = COALESCE(customer_name, ''),
  phone = COALESCE(customer_phone, ''),
  adresse = COALESCE(delivery_address, ''),
  produit = COALESCE(product_title, ''),
  montant = COALESCE(product_price, 0)
WHERE client IS NULL OR phone IS NULL OR adresse IS NULL OR produit IS NULL OR montant IS NULL;

-- Step 6: Set NOT NULL constraints for required API fields
-- First, ensure no NULL values exist
UPDATE orders SET 
  produit = COALESCE(produit, product_title, 'Unknown Product'),
  client = COALESCE(client, customer_name, 'Unknown Customer'),
  phone = COALESCE(phone, customer_phone, '0000000000'),
  adresse = COALESCE(adresse, delivery_address, 'Unknown Address'),
  commune = COALESCE(commune, 'Unknown Commune'),
  montant = COALESCE(montant, product_price, 0)
WHERE produit IS NULL OR client IS NULL OR phone IS NULL OR adresse IS NULL OR commune IS NULL OR montant IS NULL;

-- Now add NOT NULL constraints
ALTER TABLE orders ALTER COLUMN produit SET NOT NULL;
ALTER TABLE orders ALTER COLUMN client SET NOT NULL;
ALTER TABLE orders ALTER COLUMN phone SET NOT NULL;
ALTER TABLE orders ALTER COLUMN adresse SET NOT NULL;
ALTER TABLE orders ALTER COLUMN commune SET NOT NULL;
ALTER TABLE orders ALTER COLUMN montant SET NOT NULL;

-- Step 7: Add new indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_wilaya_id ON orders(wilaya_id);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);
CREATE INDEX IF NOT EXISTS idx_orders_tracking ON orders(tracking);
CREATE INDEX IF NOT EXISTS idx_orders_is_validated ON orders(is_validated);
CREATE INDEX IF NOT EXISTS idx_orders_stop_desk ON orders(stop_desk);

-- Step 8: Update/Create views with new structure
DROP VIEW IF EXISTS orders_summary;
CREATE OR REPLACE VIEW orders_summary AS
SELECT 
  id,
  reference,
  produit as product_name,
  client as customer_name,
  phone as customer_phone,
  wilaya_id,
  commune,
  CASE 
    WHEN stop_desk = 0 THEN 'home'
    WHEN stop_desk = 1 THEN 'stopdesk'
  END as delivery_type,
  montant as order_amount,
  total_price,
  status,
  tracking,
  is_validated,
  created_at,
  estimated_delivery_date,
  driver_name,
  driver_phone
FROM orders
ORDER BY created_at DESC;

-- Create new view for Noest API
CREATE OR REPLACE VIEW orders_for_noest_api AS
SELECT 
  id,
  reference,
  client,
  phone,
  phone_2,
  adresse,
  wilaya_id,
  commune,
  montant,
  remarque,
  produit,
  type_id,
  poids,
  stop_desk,
  station_code,
  stock,
  quantite,
  can_open,
  tracking,
  is_validated,
  created_at
FROM orders
WHERE is_validated = FALSE
ORDER BY created_at ASC;

-- Grant access to the views
GRANT SELECT ON orders_summary TO authenticated, anon;
GRANT SELECT ON orders_for_noest_api TO authenticated;

-- Step 9: Optional - Drop old columns after confirming migration worked
-- Uncomment these lines after verifying the migration was successful:
-- ALTER TABLE orders DROP COLUMN IF EXISTS customer_name;
-- ALTER TABLE orders DROP COLUMN IF EXISTS customer_phone;
-- ALTER TABLE orders DROP COLUMN IF EXISTS delivery_address;
-- ALTER TABLE orders DROP COLUMN IF EXISTS product_title;
-- ALTER TABLE orders DROP COLUMN IF EXISTS product_price;

COMMENT ON TABLE orders IS 'Orders table updated for Noest Express API compatibility';
COMMENT ON COLUMN orders.wilaya_id IS 'Wilaya ID (1-48) for Noest API';
COMMENT ON COLUMN orders.stop_desk IS '0=home delivery, 1=stopdesk delivery';
COMMENT ON COLUMN orders.tracking IS 'Tracking number from Noest API';
COMMENT ON COLUMN orders.is_validated IS 'Whether order has been validated with Noest API';
