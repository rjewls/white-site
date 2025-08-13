-- Complete Database Schema for Boutique Site Clone
-- Run this script in your Supabase SQL Editor to set up your database

-- Enable Row Level Security and create storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    oldprice DECIMAL(10,2),
    weight DECIMAL(5,2) DEFAULT 1.0,
    description TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    colors TEXT[] DEFAULT '{}',
    sizes TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client TEXT NOT NULL,
    phone TEXT NOT NULL,
    phone_2 TEXT DEFAULT '',
    adresse TEXT NOT NULL,
    wilaya_id INTEGER NOT NULL CHECK (wilaya_id >= 1 AND wilaya_id <= 48),
    commune TEXT NOT NULL,
    produit TEXT NOT NULL,
    montant DECIMAL(10,2) NOT NULL CHECK (montant > 0),
    poids DECIMAL(5,2) DEFAULT 1.0 CHECK (poids > 0),
    stop_desk INTEGER DEFAULT 0 CHECK (stop_desk IN (0, 1)),
    delivery_option TEXT DEFAULT 'home',
    tracking TEXT,
    is_validated BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'pending',
    station_code TEXT DEFAULT '',
    product_id UUID,
    product_title TEXT,
    product_price DECIMAL(10,2),
    selected_color TEXT,
    selected_size TEXT,
    quantity INTEGER DEFAULT 1,
    customer_name TEXT,
    customer_phone TEXT,
    delivery_address TEXT,
    total_price DECIMAL(10,2),
    type_id INTEGER DEFAULT 1 CHECK (type_id >= 1 AND type_id <= 3),
    remarque TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create delivery fees table
CREATE TABLE IF NOT EXISTS public.delivery_fees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wilaya_code INTEGER UNIQUE NOT NULL CHECK (wilaya_code >= 1 AND wilaya_code <= 48),
    wilaya_name TEXT NOT NULL,
    home_delivery INTEGER NOT NULL DEFAULT 600,
    stopdesk_delivery INTEGER NOT NULL DEFAULT 400,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create noest_express_config table
CREATE TABLE IF NOT EXISTS public.noest_express_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    api_token TEXT NOT NULL,
    guid TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.noest_express_config ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for products
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Products are editable by authenticated users" ON public.products;
CREATE POLICY "Products are editable by authenticated users" ON public.products FOR ALL USING (auth.uid() IS NOT NULL);

-- Create RLS policies for orders
DROP POLICY IF EXISTS "Orders are viewable by authenticated users" ON public.orders;
CREATE POLICY "Orders are viewable by authenticated users" ON public.orders FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Orders are editable by authenticated users" ON public.orders;
CREATE POLICY "Orders are editable by authenticated users" ON public.orders FOR ALL USING (auth.uid() IS NOT NULL);

-- Create RLS policies for delivery_fees
DROP POLICY IF EXISTS "Delivery fees are viewable by everyone" ON public.delivery_fees;
CREATE POLICY "Delivery fees are viewable by everyone" ON public.delivery_fees FOR SELECT USING (true);

DROP POLICY IF EXISTS "Delivery fees are editable by authenticated users" ON public.delivery_fees;
CREATE POLICY "Delivery fees are editable by authenticated users" ON public.delivery_fees FOR ALL USING (auth.uid() IS NOT NULL);

-- Create RLS policies for noest_express_config
DROP POLICY IF EXISTS "Noest config is viewable by authenticated users" ON public.noest_express_config;
CREATE POLICY "Noest config is viewable by authenticated users" ON public.noest_express_config FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Noest config is editable by authenticated users" ON public.noest_express_config;
CREATE POLICY "Noest config is editable by authenticated users" ON public.noest_express_config FOR ALL USING (auth.uid() IS NOT NULL);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_title ON public.products USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_tracking ON public.orders(tracking);
CREATE INDEX IF NOT EXISTS idx_orders_wilaya ON public.orders(wilaya_id);
CREATE INDEX IF NOT EXISTS idx_delivery_fees_wilaya_code ON public.delivery_fees(wilaya_code);

-- Create function for updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON public.products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON public.orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_delivery_fees_updated_at ON public.delivery_fees;
CREATE TRIGGER update_delivery_fees_updated_at 
    BEFORE UPDATE ON public.delivery_fees 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_noest_config_updated_at ON public.noest_express_config;
CREATE TRIGGER update_noest_config_updated_at 
    BEFORE UPDATE ON public.noest_express_config 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default delivery fees for all 48 Algerian wilayas
INSERT INTO public.delivery_fees (wilaya_code, wilaya_name, home_delivery, stopdesk_delivery) VALUES
(1, 'Adrar', 800, 600),
(2, 'Chlef', 600, 400),
(3, 'Laghouat', 700, 500),
(4, 'Oum El Bouaghi', 600, 400),
(5, 'Batna', 600, 400),
(6, 'Béjaïa', 600, 400),
(7, 'Biskra', 700, 500),
(8, 'Béchar', 900, 700),
(9, 'Blida', 500, 350),
(10, 'Bouira', 600, 400),
(11, 'Tamanrasset', 1200, 1000),
(12, 'Tébessa', 700, 500),
(13, 'Tlemcen', 700, 500),
(14, 'Tiaret', 650, 450),
(15, 'Tizi Ouzou', 550, 400),
(16, 'Alger', 400, 300),
(17, 'Djelfa', 700, 500),
(18, 'Jijel', 600, 400),
(19, 'Sétif', 600, 400),
(20, 'Saïda', 700, 500),
(21, 'Skikda', 600, 400),
(22, 'Sidi Bel Abbès', 700, 500),
(23, 'Annaba', 650, 450),
(24, 'Guelma', 650, 450),
(25, 'Constantine', 600, 400),
(26, 'Médéa', 550, 400),
(27, 'Mostaganem', 650, 450),
(28, 'M\'Sila', 650, 450),
(29, 'Mascara', 650, 450),
(30, 'Ouargla', 800, 600),
(31, 'Oran', 600, 400),
(32, 'El Bayadh', 750, 550),
(33, 'Illizi', 1000, 800),
(34, 'Bordj Bou Arréridj', 600, 400),
(35, 'Boumerdès', 500, 350),
(36, 'El Tarf', 700, 500),
(37, 'Tindouf', 1100, 900),
(38, 'Tissemsilt', 650, 450),
(39, 'El Oued', 750, 550),
(40, 'Khenchela', 650, 450),
(41, 'Souk Ahras', 650, 450),
(42, 'Tipaza', 500, 350),
(43, 'Mila', 600, 400),
(44, 'Aïn Defla', 600, 400),
(45, 'Naâma', 800, 600),
(46, 'Aïn Témouchent', 700, 500),
(47, 'Ghardaïa', 750, 550),
(48, 'Relizane', 650, 450)
ON CONFLICT (wilaya_code) DO NOTHING;

-- Create view for order analytics
DROP VIEW IF EXISTS order_analytics;
CREATE VIEW order_analytics AS
SELECT 
    DATE_TRUNC('day', created_at) as order_date,
    status,
    COUNT(*) as order_count,
    SUM(montant) as total_revenue,
    AVG(montant) as avg_order_value,
    COUNT(CASE WHEN tracking IS NOT NULL THEN 1 END) as tracked_orders,
    COUNT(CASE WHEN is_validated = true THEN 1 END) as validated_orders
FROM orders 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at), status
ORDER BY order_date DESC;

-- Create view for popular products
DROP VIEW IF EXISTS popular_products;
CREATE VIEW popular_products AS
SELECT 
    p.id,
    p.title,
    p.price,
    COUNT(o.id) as order_count,
    SUM(o.montant) as total_revenue,
    AVG(o.montant) as avg_order_value,
    MAX(o.created_at) as last_ordered
FROM products p
LEFT JOIN orders o ON p.title = o.produit
GROUP BY p.id, p.title, p.price
ORDER BY order_count DESC, total_revenue DESC;

-- Grant permissions for views
GRANT SELECT ON order_analytics TO authenticated;
GRANT SELECT ON popular_products TO authenticated;

-- Add storage policies for product images
DO $$
BEGIN
    -- Check if policies exist before creating them
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Public Access'
    ) THEN
        CREATE POLICY "Public Access" 
        ON storage.objects FOR SELECT 
        USING (bucket_id = 'product-images');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Authenticated users can upload'
    ) THEN
        CREATE POLICY "Authenticated users can upload" 
        ON storage.objects FOR INSERT 
        WITH CHECK (auth.uid() IS NOT NULL AND bucket_id = 'product-images');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Authenticated users can update'
    ) THEN
        CREATE POLICY "Authenticated users can update" 
        ON storage.objects FOR UPDATE 
        USING (auth.uid() IS NOT NULL AND bucket_id = 'product-images');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Authenticated users can delete'
    ) THEN
        CREATE POLICY "Authenticated users can delete" 
        ON storage.objects FOR DELETE 
        USING (auth.uid() IS NOT NULL AND bucket_id = 'product-images');
    END IF;
END $$;

-- Verification queries (uncomment to run and verify setup)
-- SELECT 'Products table' as table_name, COUNT(*) as row_count FROM products
-- UNION ALL
-- SELECT 'Orders table', COUNT(*) FROM orders
-- UNION ALL  
-- SELECT 'Delivery fees', COUNT(*) FROM delivery_fees
-- UNION ALL
-- SELECT 'Noest config', COUNT(*) FROM noest_express_config;

-- Success message
SELECT 'Database setup completed successfully! 🎉' as status;
