-- 1. Create Noest Express Configuration Table
CREATE TABLE IF NOT EXISTS noest_express_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  api_token TEXT NOT NULL,
  guid TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns if table already exists
ALTER TABLE noest_express_config 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Update existing records to have is_active = true
UPDATE noest_express_config 
SET is_active = TRUE 
WHERE is_active IS NULL;

-- Enable RLS
ALTER TABLE noest_express_config ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Only authenticated users can manage noest config" ON noest_express_config;

-- Create policy for authenticated users only
CREATE POLICY "noest_config_policy" ON noest_express_config
  FOR ALL USING (auth.role() = 'authenticated');

-- 2. Create Wilaya ID Mapping Table
CREATE TABLE IF NOT EXISTS wilaya_mapping (
  id SERIAL PRIMARY KEY,
  wilaya_name TEXT NOT NULL,
  wilaya_id INTEGER NOT NULL UNIQUE CHECK (wilaya_id BETWEEN 1 AND 58),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert wilaya mappings
INSERT INTO wilaya_mapping (wilaya_name, wilaya_id) VALUES
('Adrar', 1), ('Chlef', 2), ('Laghouat', 3), ('Oum El Bouaghi', 4),
('Batna', 5), ('Béjaïa', 6), ('Biskra', 7), ('Béchar', 8),
('Blida', 9), ('Bouira', 10), ('Tamanrasset', 11), ('Tébessa', 12),
('Tlemcen', 13), ('Tiaret', 14), ('Tizi Ouzou', 15), ('Alger', 16),
('Djelfa', 17), ('Jijel', 18), ('Sétif', 19), ('Saïda', 20),
('Skikda', 21), ('Sidi Bel Abbès', 22), ('Annaba', 23), ('Guelma', 24),
('Constantine', 25), ('Médéa', 26), ('Mostaganem', 27), ('M''Sila', 28),
('Mascara', 29), ('Ouargla', 30), ('Oran', 31), ('El Bayadh', 32),
('Illizi', 33), ('Bordj Bou Arréridj', 34), ('Boumerdès', 35), ('El Tarf', 36),
('Tindouf', 37), ('Tissemsilt', 38), ('El Oued', 39), ('Khenchela', 40),
('Souk Ahras', 41), ('Tipaza', 42), ('Mila', 43), ('Aïn Defla', 44),
('Naâma', 45), ('Aïn Témouchent', 46), ('Ghardaïa', 47), ('Relizane', 48)
ON CONFLICT (wilaya_id) DO NOTHING;

-- 3. Update Orders Table for API Compatibility
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
ADD COLUMN IF NOT EXISTS tracking TEXT,
ADD COLUMN IF NOT EXISTS is_validated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS driver_name TEXT,
ADD COLUMN IF NOT EXISTS driver_phone TEXT;

-- Drop existing conflicting constraint if it exists
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_delivery_option_check;

-- Add constraints
ALTER TABLE orders ADD CONSTRAINT IF NOT EXISTS check_wilaya_id CHECK (wilaya_id IS NULL OR wilaya_id BETWEEN 1 AND 58);
ALTER TABLE orders ADD CONSTRAINT IF NOT EXISTS check_type_id CHECK (type_id BETWEEN 1 AND 3);
ALTER TABLE orders ADD CONSTRAINT IF NOT EXISTS check_stop_desk CHECK (stop_desk BETWEEN 0 AND 1);
ALTER TABLE orders ADD CONSTRAINT IF NOT EXISTS check_stock CHECK (stock BETWEEN 0 AND 1);
ALTER TABLE orders ADD CONSTRAINT IF NOT EXISTS check_can_open CHECK (can_open BETWEEN 0 AND 1);
ALTER TABLE orders ADD CONSTRAINT IF NOT EXISTS check_delivery_option CHECK (delivery_option IN ('home', 'stopdesk'));

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_wilaya_id ON orders(wilaya_id);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);
CREATE INDEX IF NOT EXISTS idx_orders_tracking ON orders(tracking);
CREATE INDEX IF NOT EXISTS idx_orders_is_validated ON orders(is_validated);
CREATE INDEX IF NOT EXISTS idx_orders_stop_desk ON orders(stop_desk);

-- Migrate existing data (update existing orders with API-compatible fields)
UPDATE orders SET 
  client = COALESCE(customer_name, ''),
  phone = COALESCE(customer_phone, ''),
  adresse = COALESCE(delivery_address, ''),
  produit = COALESCE(product_title, ''),
  montant = COALESCE(product_price, 0)
WHERE client IS NULL OR phone IS NULL OR adresse IS NULL OR produit IS NULL OR montant IS NULL;

-- Update wilaya_id based on wilaya name for existing orders
UPDATE orders 
SET wilaya_id = wm.wilaya_id
FROM wilaya_mapping wm
WHERE orders.wilaya = wm.wilaya_name 
AND orders.wilaya_id IS NULL;

-- Set default wilaya_id for orders without a valid wilaya
UPDATE orders 
SET wilaya_id = 16 -- Default to Alger
WHERE wilaya_id IS NULL;
