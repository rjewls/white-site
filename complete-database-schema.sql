-- ================================
-- COMPLETE DATABASE SCHEMA FOR BOUTIQUE CLONES
-- ================================
-- Run this entire script in your Supabase SQL editor
-- This will create all necessary tables, policies, and triggers

-- ================================
-- 1. UTILITY FUNCTIONS
-- ================================

-- Function to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ================================
-- 2. PRODUCTS TABLE
-- ================================

CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    oldprice DECIMAL(10,2), -- For sale prices
    weight DECIMAL(5,2) DEFAULT 1.0, -- Weight in kg for shipping
    images TEXT[], -- Array of image URLs
    description TEXT,
    colors TEXT[], -- Array of color values (supports "Label|#hex" format)
    sizes TEXT[], -- Array of available sizes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT price_positive CHECK (price > 0),
    CONSTRAINT weight_positive CHECK (weight > 0),
    CONSTRAINT oldprice_positive CHECK (oldprice IS NULL OR oldprice > 0)
);

-- Products policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products" ON products 
    FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can insert products" ON products 
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update products" ON products 
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete products" ON products 
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_title ON products USING gin(to_tsvector('english', title));

-- Products triggers
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- 3. ORDERS TABLE
-- ================================

CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Order Reference
    reference TEXT,
    
    -- Product Information  
    product_id TEXT NOT NULL,
    product_title TEXT NOT NULL,
    produit TEXT NOT NULL, -- Product name for Noest API
    product_price DECIMAL(10,2) NOT NULL,
    
    -- Customer Information (Noest API fields)
    client TEXT NOT NULL, -- Customer name (required | max:255)
    phone TEXT NOT NULL, -- Phone number (required | 9-10 digits)
    phone_2 TEXT, -- Optional second phone (9-10 digits)
    
    -- Delivery Information (Noest API fields)
    adresse TEXT NOT NULL, -- Customer address (required | max:255)
    wilaya_id INTEGER NOT NULL CHECK (wilaya_id BETWEEN 1 AND 48),
    commune TEXT NOT NULL, -- Commune name (required | max:255)
    
    -- Order Details
    quantity INTEGER NOT NULL DEFAULT 1,
    quantite TEXT, -- For Noest API compatibility
    selected_color TEXT,
    selected_colors TEXT[], -- For multiple color selections
    selected_size TEXT,
    selected_sizes TEXT[], -- For multiple size selections
    
    -- Pricing (Noest API fields)
    montant DECIMAL(10,2) NOT NULL, -- Total amount for Noest
    delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_price DECIMAL(10,2) NOT NULL,
    
    -- Noest API Specific Fields
    remarque TEXT, -- Remarks (max:255)
    type_id INTEGER NOT NULL DEFAULT 1 CHECK (type_id BETWEEN 1 AND 3),
    poids INTEGER NOT NULL DEFAULT 1, -- Package weight (integer)
    stop_desk INTEGER NOT NULL DEFAULT 0 CHECK (stop_desk BETWEEN 0 AND 1),
    station_code TEXT, -- Required if stop_desk = 1
    stock INTEGER DEFAULT 0 CHECK (stock BETWEEN 0 AND 1),
    can_open INTEGER DEFAULT 1 CHECK (can_open BETWEEN 0 AND 1),
    
    -- Order Status and Tracking
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'inséré', 'expédié', 'delivered', 'cancelled', 'returned')),
    tracking TEXT UNIQUE, -- Tracking number from Noest API
    is_validated BOOLEAN DEFAULT FALSE,
    
    -- Additional Information
    notes TEXT,
    delivery_option TEXT CHECK (delivery_option IN ('home', 'stopdesk')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Delivery tracking
    estimated_delivery_date DATE,
    driver_name TEXT,
    driver_phone TEXT,
    
    -- Constraints
    CONSTRAINT positive_prices CHECK (product_price > 0 AND montant > 0 AND total_price > 0),
    CONSTRAINT valid_quantity CHECK (quantity > 0),
    CONSTRAINT valid_phone CHECK (length(phone) BETWEEN 9 AND 10 AND phone ~ '^[0-9]+$'),
    CONSTRAINT valid_phone_2 CHECK (phone_2 IS NULL OR (length(phone_2) BETWEEN 9 AND 10 AND phone_2 ~ '^[0-9]+$'))
);

-- Orders policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view orders" ON orders 
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert orders" ON orders 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Only authenticated users can update orders" ON orders 
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete orders" ON orders 
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_wilaya_id ON orders(wilaya_id);
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);
CREATE INDEX IF NOT EXISTS idx_orders_tracking ON orders(tracking) WHERE tracking IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_is_validated ON orders(is_validated);
CREATE INDEX IF NOT EXISTS idx_orders_stop_desk ON orders(stop_desk);

-- Orders triggers
CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- 4. DELIVERY FEES TABLE
-- ================================

CREATE TABLE IF NOT EXISTS delivery_fees (
    id SERIAL PRIMARY KEY,
    wilaya_code INTEGER NOT NULL UNIQUE,
    wilaya_name TEXT NOT NULL,
    home_delivery INTEGER NOT NULL DEFAULT 0,
    stopdesk_delivery INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_wilaya_code CHECK (wilaya_code BETWEEN 1 AND 48),
    CONSTRAINT positive_fees CHECK (home_delivery >= 0 AND stopdesk_delivery >= 0)
);

-- Delivery fees policies
ALTER TABLE delivery_fees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view delivery fees" ON delivery_fees 
    FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can modify delivery fees" ON delivery_fees 
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Delivery fees indexes
CREATE INDEX IF NOT EXISTS idx_delivery_fees_wilaya_code ON delivery_fees(wilaya_code);
CREATE INDEX IF NOT EXISTS idx_delivery_fees_wilaya_name ON delivery_fees(wilaya_name);

-- Delivery fees triggers
CREATE TRIGGER update_delivery_fees_updated_at 
    BEFORE UPDATE ON delivery_fees 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- 5. NOEST EXPRESS CONFIGURATION TABLE
-- ================================

CREATE TABLE IF NOT EXISTS noest_express_config (
    id SERIAL PRIMARY KEY,
    api_token TEXT NOT NULL,
    guid TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT api_token_not_empty CHECK (length(trim(api_token)) > 0),
    CONSTRAINT guid_not_empty CHECK (length(trim(guid)) > 0)
);

-- Noest config policies
ALTER TABLE noest_express_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only authenticated users can access noest config" ON noest_express_config 
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Noest config triggers
CREATE TRIGGER update_noest_express_config_updated_at 
    BEFORE UPDATE ON noest_express_config 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- 6. USEFUL VIEWS
-- ================================

-- Orders summary view for admin dashboard
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
        ELSE 'unknown'
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

-- Orders pending Noest upload view
CREATE OR REPLACE VIEW orders_pending_noest AS
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
    created_at
FROM orders
WHERE status = 'pending' AND tracking IS NULL
ORDER BY created_at ASC;

-- Grant permissions on views
GRANT SELECT ON orders_summary TO authenticated, anon;
GRANT SELECT ON orders_pending_noest TO authenticated;

-- ================================
-- 7. STORAGE BUCKET SETUP
-- ================================
-- Note: You need to create the 'product-images' bucket manually in Supabase Storage
-- Then run these policies:

-- Storage policies for product images bucket
-- (Run these in the Supabase dashboard after creating the bucket)

/*
-- Allow public access to view images
INSERT INTO storage.policies (bucket_id, name, definition, check_expression, permissions, roles)
VALUES (
  'product-images',
  'Public Access',
  'SELECT',
  'true',
  '{"SELECT"}',
  '{"anon", "authenticated"}'
);

-- Allow authenticated users to upload images
INSERT INTO storage.policies (bucket_id, name, definition, check_expression, permissions, roles)
VALUES (
  'product-images',
  'Authenticated users can upload images',
  'INSERT',
  'auth.role() = ''authenticated''',
  '{"INSERT"}',
  '{"authenticated"}'
);

-- Allow authenticated users to update images
INSERT INTO storage.policies (bucket_id, name, definition, check_expression, permissions, roles)
VALUES (
  'product-images',
  'Authenticated users can update images',
  'UPDATE',
  'auth.role() = ''authenticated''',
  '{"UPDATE"}',
  '{"authenticated"}'
);

-- Allow authenticated users to delete images
INSERT INTO storage.policies (bucket_id, name, definition, check_expression, permissions, roles)
VALUES (
  'product-images',
  'Authenticated users can delete images',
  'DELETE',
  'auth.role() = ''authenticated''',
  '{"DELETE"}',
  '{"authenticated"}'
);
*/

-- ================================
-- 8. SAMPLE DATA (OPTIONAL)
-- ================================

-- Insert default delivery fees for all Algerian wilayas
INSERT INTO delivery_fees (wilaya_code, wilaya_name, home_delivery, stopdesk_delivery) VALUES
(1, 'Adrar', 800, 600),
(2, 'Chlef', 400, 300),
(3, 'Laghouat', 500, 400),
(4, 'Oum El Bouaghi', 400, 300),
(5, 'Batna', 400, 300),
(6, 'Béjaïa', 400, 300),
(7, 'Biskra', 500, 400),
(8, 'Béchar', 800, 600),
(9, 'Blida', 300, 250),
(10, 'Bouira', 400, 300),
(11, 'Tamanrasset', 1000, 800),
(12, 'Tébessa', 500, 400),
(13, 'Tlemcen', 500, 400),
(14, 'Tiaret', 450, 350),
(15, 'Tizi Ouzou', 350, 280),
(16, 'Alger', 250, 200),
(17, 'Djelfa', 450, 350),
(18, 'Jijel', 400, 300),
(19, 'Sétif', 400, 300),
(20, 'Saïda', 500, 400),
(21, 'Skikda', 400, 300),
(22, 'Sidi Bel Abbès', 500, 400),
(23, 'Annaba', 400, 300),
(24, 'Guelma', 400, 300),
(25, 'Constantine', 400, 300),
(26, 'Médéa', 350, 280),
(27, 'Mostaganem', 450, 350),
(28, 'M\'Sila', 450, 350),
(29, 'Mascara', 500, 400),
(30, 'Ouargla', 600, 500),
(31, 'Oran', 400, 300),
(32, 'El Bayadh', 600, 500),
(33, 'Illizi', 1000, 800),
(34, 'Bordj Bou Arréridj', 400, 300),
(35, 'Boumerdès', 300, 250),
(36, 'El Tarf', 500, 400),
(37, 'Tindouf', 1000, 800),
(38, 'Tissemsilt', 450, 350),
(39, 'El Oued', 600, 500),
(40, 'Khenchela', 500, 400),
(41, 'Souk Ahras', 450, 350),
(42, 'Tipaza', 300, 250),
(43, 'Mila', 400, 300),
(44, 'Aïn Defla', 400, 300),
(45, 'Naâma', 600, 500),
(46, 'Aïn Témouchent', 450, 350),
(47, 'Ghardaïa', 600, 500),
(48, 'Relizane', 450, 350)
ON CONFLICT (wilaya_code) DO NOTHING;

-- ================================
-- SETUP COMPLETE
-- ================================

SELECT 'Database schema setup complete!' as message;
SELECT 'Tables created: ' || count(*) || ' tables' as tables_created 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('products', 'orders', 'delivery_fees', 'noest_express_config');

SELECT 'Views created: ' || count(*) || ' views' as views_created
FROM information_schema.views 
WHERE table_schema = 'public' AND table_name IN ('orders_summary', 'orders_pending_noest');

-- Next steps reminder
SELECT 'NEXT STEPS:' as reminder;
SELECT '1. Create product-images storage bucket in Supabase Dashboard' as step1;
SELECT '2. Set up storage policies for product-images bucket' as step2;
SELECT '3. Create your admin user in Authentication' as step3;
SELECT '4. Configure your Noest Express API credentials via admin panel' as step4;
