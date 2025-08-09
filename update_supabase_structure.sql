-- Update Supabase structure to match working Noest integration
-- Run this in Supabase SQL Editor

-- 1. Fix default values for can_open and stock to match working project
UPDATE orders SET can_open = 0 WHERE can_open = 1;
UPDATE orders SET stock = 0 WHERE stock = 1;

-- 2. Update constraints to allow 0 values (working project uses 0)
ALTER TABLE orders DROP CONSTRAINT IF EXISTS check_stock;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS check_can_open;

-- Re-add constraints with correct values
ALTER TABLE orders ADD CONSTRAINT check_stock CHECK (stock BETWEEN 0 AND 1);
ALTER TABLE orders ADD CONSTRAINT check_can_open CHECK (can_open BETWEEN 0 AND 1);

-- 3. Ensure all required Noest API fields have proper defaults
UPDATE orders SET 
  type_id = 1 WHERE type_id IS NULL,
  poids = 1 WHERE poids IS NULL OR poids <= 0,
  can_open = 0 WHERE can_open IS NULL,
  stock = 0 WHERE stock IS NULL,
  stop_desk = 0 WHERE stop_desk IS NULL,
  quantite = '1' WHERE quantite IS NULL OR quantite = '';

-- 4. Add status column if it doesn't exist (for order state management)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- 5. Create index on status for performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- 6. Verify the structure matches Noest API requirements
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
  AND column_name IN (
    'client', 'phone', 'adresse', 'wilaya_id', 'commune', 
    'montant', 'produit', 'type_id', 'poids', 'stop_desk', 
    'station_code', 'stock', 'quantite', 'can_open', 
    'tracking', 'status'
  )
ORDER BY column_name;
