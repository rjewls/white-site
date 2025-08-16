-- =====================================================
-- SUPABASE PROJECT SETUP - Complete Database Schema
-- =====================================================
-- This file contains all the SQL statements needed to set up
-- a new Supabase project for the rosebud-boutique-builder app
-- 
-- Usage: Copy and paste these statements into your Supabase SQL editor
-- Execute them in order to create all necessary tables and policies
-- =====================================================

-- =====================================================
-- 1. DELIVERY FEES TABLE
-- =====================================================
-- Table to store delivery fees by wilaya (province)
-- Supports both home delivery and stopdesk delivery options

-- Create the sequence first
CREATE SEQUENCE delivery_fees_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Then create the table using the sequence
CREATE TABLE delivery_fees (
    "id" integer NOT NULL DEFAULT nextval('delivery_fees_id_seq'::regclass),
    "wilaya_code" integer NOT NULL,
    "wilaya_name" character varying(100) NOT NULL,
    "home_delivery" integer NOT NULL DEFAULT 0,
    "stopdesk_delivery" integer NOT NULL DEFAULT 0,
    "created_at" timestamp with time zone NULL DEFAULT now(),
    "updated_at" timestamp with time zone NULL DEFAULT now()
);

-- Set primary key for delivery_fees
ALTER TABLE ONLY delivery_fees
    ADD CONSTRAINT delivery_fees_pkey PRIMARY KEY (id);

-- Create unique constraint for wilaya_code
ALTER TABLE ONLY delivery_fees
    ADD CONSTRAINT delivery_fees_wilaya_code_unique UNIQUE (wilaya_code);

-- Create index for better query performance
CREATE INDEX idx_delivery_fees_wilaya_code ON delivery_fees(wilaya_code);

-- Enable Row Level Security (RLS)
ALTER TABLE delivery_fees ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for delivery_fees
CREATE POLICY "Allow read access to delivery_fees" ON delivery_fees 
    FOR SELECT TO PUBLIC USING (true);

CREATE POLICY "Allow admin access to delivery_fees" ON delivery_fees 
    FOR ALL TO PUBLIC USING ((auth.role() = 'authenticated'::text));

-- =====================================================
-- POPULATE DELIVERY FEES TABLE
-- =====================================================
-- Insert delivery fees for all Algerian wilayas (provinces)
-- Fees are in Algerian Dinars (DZD) for home delivery and stopdesk delivery

INSERT INTO delivery_fees (wilaya_code, wilaya_name, home_delivery, stopdesk_delivery) VALUES
(1, 'Adrar', 1300, 600),
(2, 'Chlef', 700, 300),
(3, 'Laghouat', 850, 450),
(4, 'Oum El Bouaghi', 700, 300),
(5, 'Batna', 700, 300),
(6, 'Béjaïa', 700, 250),
(7, 'Biskra', 800, 400),
(8, 'Béchar', 1000, 500),
(9, 'Blida', 450, 250),
(10, 'Bouira', 600, 250),
(11, 'Tamanrasset', 1700, 800),
(12, 'Tébessa', 750, 300),
(13, 'Tlemcen', 700, 350),
(14, 'Tiaret', 700, 350),
(15, 'Tizi Ouzou', 600, 250),
(16, 'Algiers', 400, 200),
(17, 'Djelfa', 850, 400),
(18, 'Jijel', 700, 300),
(19, 'Sétif', 700, 300),
(20, 'Saïda', 700, 300),
(21, 'Skikda', 700, 300),
(22, 'Sidi Bel Abbès', 700, 300),
(23, 'Annaba', 700, 300),
(24, 'Guelma', 750, 300),
(25, 'Constantine', 700, 300),
(26, 'Médéa', 650, 250),
(27, 'Mostaganem', 700, 300),
(28, 'M''Sila', 700, 300),
(29, 'Mascara', 700, 300),
(30, 'Ouargla', 900, 450),
(31, 'Oran', 700, 300),
(32, 'El Bayadh', 1000, 400),
(33, 'Illizi', 1900, 1000),
(34, 'Bordj Bou Arréridj', 700, 300),
(35, 'Boumerdès', 450, 250),
(36, 'El Tarf', 750, 300),
(37, 'Tindouf', 1400, 700),
(38, 'Tissemsilt', 700, 300),
(39, 'El Oued', 1000, 450),
(40, 'Khenchela', 750, 300),
(41, 'Souk Ahras', 750, 300),
(42, 'Tipaza', 500, 250),
(43, 'Mila', 700, 300),
(44, 'Aïn Defla', 700, 250),
(45, 'Naâma', 1000, 500),
(46, 'Aïn Témouchent', 700, 300),
(47, 'Ghardaïa', 850, 450),
(48, 'Relizane', 700, 300),
(49, 'Timimoun', 1400, 600),
(51, 'Ouled Djellal', 800, 400),
(52, 'Beni Abbes', 1100, 400),
(53, 'In Salah', 1700, 1000),
(55, 'Touggourt', 900, 450),
(57, 'El M''Ghair', 1000, 500),
(58, 'El Meniaa', 900, 450);

-- =====================================================
-- 2. NOEST EXPRESS CONFIG TABLE
-- =====================================================
-- Table to store Noest Express API configuration
-- Contains API credentials and settings for shipping integration

CREATE TABLE noest_express_config (
    "id" bigint NOT NULL,
    "api_token" text NULL DEFAULT ''::text,
    "guid" text NULL DEFAULT ''::text,
    "created_at" timestamp with time zone NULL DEFAULT now(),
    "updated_at" timestamp with time zone NULL DEFAULT now(),
    "is_active" boolean NULL DEFAULT true
);

-- Set primary key for noest_express_config
ALTER TABLE ONLY noest_express_config
    ADD CONSTRAINT noest_express_config_pkey PRIMARY KEY (id);

-- Create index for active status queries
CREATE INDEX idx_noest_express_config_is_active ON noest_express_config(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE noest_express_config ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for noest_express_config
CREATE POLICY "Enable all operations for authenticated users" ON noest_express_config 
    FOR ALL TO PUBLIC USING ((auth.uid() IS NOT NULL));

CREATE POLICY "Only authenticated users can manage noest config" ON noest_express_config 
    FOR ALL TO PUBLIC USING ((auth.role() = 'authenticated'::text));

-- =====================================================
-- 3. ORDERS TABLE
-- =====================================================
-- Table to store customer orders with complete order details
-- Supports both local order management and Noest Express integration
-- Contains fields for product info, customer details, delivery options, and tracking

-- Create the sequence first
CREATE SEQUENCE orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Then create the table using the sequence
CREATE TABLE orders (
    "id" integer NOT NULL DEFAULT nextval('orders_id_seq'::regclass),
    "product_id" text NOT NULL,
    "product_title" text NOT NULL,
    "product_price" numeric(10) NOT NULL,
    "customer_name" text NOT NULL,
    "customer_phone" text NOT NULL,
    "wilaya" text NOT NULL,
    "commune" text NOT NULL,
    "delivery_option" text NOT NULL,
    "delivery_address" text NOT NULL,
    "pickup_station" text NULL,
    "quantity" integer NOT NULL DEFAULT 1,
    "selected_color" text NULL,
    "selected_colors" text[] NULL,
    "selected_size" text NULL,
    "selected_sizes" text[] NULL,
    "delivery_fee" numeric(10) NOT NULL DEFAULT 0,
    "total_price" numeric(10) NOT NULL,
    "status" text NOT NULL DEFAULT 'pending'::text,
    "notes" text NULL,
    "created_at" timestamp with time zone NULL DEFAULT now(),
    "updated_at" timestamp with time zone NULL DEFAULT now(),
    "tracking_number" text NULL,
    "estimated_delivery_date" date NULL,
    "reference" text NULL,
    "produit" text NULL,
    "client" text NULL,
    "phone" text NULL,
    "phone_2" text NULL,
    "adresse" text NULL,
    "wilaya_id" integer NULL,
    "montant" numeric(10) NULL,
    "remarque" text NULL,
    "type_id" integer NULL DEFAULT 1,
    "poids" integer NULL DEFAULT 1,
    "stop_desk" integer NULL DEFAULT 0,
    "station_code" text NULL,
    "stock" integer NULL DEFAULT 0,
    "quantite" text NULL,
    "can_open" integer NULL DEFAULT 1,
    "tracking" text NULL,
    "is_validated" boolean NULL DEFAULT false,
    "driver_name" text NULL,
    "driver_phone" text NULL
);

-- Set primary key for orders
ALTER TABLE ONLY orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);

-- Create indexes for better query performance
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX idx_orders_product_id ON orders(product_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_wilaya_id ON orders(wilaya_id);
CREATE INDEX idx_orders_tracking_number ON orders(tracking_number);
CREATE INDEX idx_orders_is_validated ON orders(is_validated);

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for orders
CREATE POLICY "Users can view their own orders" ON orders 
    FOR SELECT TO PUBLIC USING (true);

CREATE POLICY "Only authenticated users can insert orders" ON orders 
    FOR INSERT TO PUBLIC WITH CHECK (true);

CREATE POLICY "Only admins can update orders" ON orders 
    FOR UPDATE TO PUBLIC USING ((auth.uid() IS NOT NULL));

CREATE POLICY "Only admins can delete orders" ON orders 
    FOR DELETE TO PUBLIC USING ((auth.uid() IS NOT NULL));

-- =====================================================
-- 4. ORDERS SUMMARY TABLE
-- =====================================================
-- Table to store summarized order information for quick queries and reports
-- Contains essential order details without the full complexity of the main orders table
-- Note: This table has no RLS policies - it's likely a view or materialized view

CREATE TABLE orders_summary (
    "id" integer NULL,
    "product_title" text NULL,
    "customer_name" text NULL,
    "customer_phone" text NULL,
    "wilaya" text NULL,
    "commune" text NULL,
    "delivery_option" text NULL,
    "total_price" numeric(10) NULL,
    "status" text NULL,
    "created_at" timestamp with time zone NULL,
    "estimated_delivery_date" date NULL
);

-- Create indexes for better query performance on summary table
CREATE INDEX idx_orders_summary_id ON orders_summary(id);
CREATE INDEX idx_orders_summary_status ON orders_summary(status);
CREATE INDEX idx_orders_summary_customer_phone ON orders_summary(customer_phone);
CREATE INDEX idx_orders_summary_created_at ON orders_summary(created_at);
CREATE INDEX idx_orders_summary_wilaya ON orders_summary(wilaya);

-- Note: No RLS policies are set on this table
-- This suggests it might be populated by triggers or used as a materialized view

-- =====================================================
-- 5. PRODUCTS TABLE
-- =====================================================
-- Table to store product catalog information
-- Contains all product details including pricing, inventory, and specifications
-- Note: This table has no RLS policies - public access for product catalog

CREATE TABLE products (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "title" text NULL DEFAULT '0'::text,
    "price" numeric NULL,
    "images" text NULL,
    "description" text NULL,
    "colors" text NULL,
    "sizes" text NULL,
    "stock" numeric NULL,
    "oldprice" numeric NULL,
    "weight" numeric(5) NULL DEFAULT 1.0
);

-- Set primary key for products
ALTER TABLE ONLY products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);

-- Create indexes for better query performance
CREATE INDEX idx_products_created_at ON products(created_at);
CREATE INDEX idx_products_title ON products(title);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_stock ON products(stock);

-- Create index for text search on title and description
CREATE INDEX idx_products_title_search ON products USING gin(to_tsvector('english', title));
CREATE INDEX idx_products_description_search ON products USING gin(to_tsvector('english', description));

-- Note: No RLS policies are set on this table
-- This allows public access to the product catalog for browsing

-- =====================================================
-- 6. WILAYA MAPPING TABLE
-- =====================================================
-- Table to store mapping between wilaya names and their numeric IDs
-- Used for address validation and shipping integration
-- Note: This table has no RLS policies - public access for address forms

-- Create the sequence first
CREATE SEQUENCE wilaya_mapping_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Then create the table using the sequence
CREATE TABLE wilaya_mapping (
    "id" integer NOT NULL DEFAULT nextval('wilaya_mapping_id_seq'::regclass),
    "wilaya_name" text NOT NULL,
    "wilaya_id" integer NOT NULL,
    "created_at" timestamp with time zone NULL DEFAULT now()
);

-- Set primary key for wilaya_mapping
ALTER TABLE ONLY wilaya_mapping
    ADD CONSTRAINT wilaya_mapping_pkey PRIMARY KEY (id);

-- Create unique constraints to prevent duplicates
ALTER TABLE ONLY wilaya_mapping
    ADD CONSTRAINT wilaya_mapping_wilaya_name_unique UNIQUE (wilaya_name);

ALTER TABLE ONLY wilaya_mapping
    ADD CONSTRAINT wilaya_mapping_wilaya_id_unique UNIQUE (wilaya_id);

-- Create indexes for better query performance
CREATE INDEX idx_wilaya_mapping_wilaya_name ON wilaya_mapping(wilaya_name);
CREATE INDEX idx_wilaya_mapping_wilaya_id ON wilaya_mapping(wilaya_id);

-- Note: No RLS policies are set on this table
-- This allows public access for address validation and form population

-- =====================================================
-- POPULATE WILAYA MAPPING TABLE
-- =====================================================
-- Insert all Algerian wilaya (province) data for address validation

INSERT INTO wilaya_mapping (wilaya_name, wilaya_id) VALUES
('Adrar', 1),
('Chlef', 2),
('Laghouat', 3),
('Oum El Bouaghi', 4),
('Batna', 5),
('Béjaïa', 6),
('Biskra', 7),
('Béchar', 8),
('Blida', 9),
('Bouira', 10),
('Tamanrasset', 11),
('Tébessa', 12),
('Tlemcen', 13),
('Tiaret', 14),
('Tizi Ouzou', 15),
('Alger', 16),
('Djelfa', 17),
('Jijel', 18),
('Sétif', 19),
('Saïda', 20),
('Skikda', 21),
('Sidi Bel Abbès', 22),
('Annaba', 23),
('Guelma', 24),
('Constantine', 25),
('Médéa', 26),
('Mostaganem', 27),
('M''Sila', 28),
('Mascara', 29),
('Ouargla', 30),
('Oran', 31),
('El Bayadh', 32),
('Illizi', 33),
('Bordj Bou Arréridj', 34),
('Boumerdès', 35),
('El Tarf', 36),
('Tindouf', 37),
('Tissemsilt', 38),
('El Oued', 39),
('Khenchela', 40),
('Souk Ahras', 41),
('Tipaza', 42),
('Mila', 43),
('Aïn Defla', 44),
('Naâma', 45),
('Aïn Témouchent', 46),
('Ghardaïa', 47),
('Relizane', 48);

-- =====================================================
-- DATABASE SETUP COMPLETE
-- =====================================================
-- All tables have been created with their exact structures and policies
-- 
-- Next steps after running this script:
-- 1. Enable RLS on tables that need it (some already have policies defined)
-- 2. Configure noest_express_config table with API credentials
-- 3. Set up Supabase Storage bucket 'product-images' for product photos
-- 4. Configure authentication providers if needed
-- 
-- Tables created:
-- ✓ delivery_fees (with RLS policies) - POPULATED with 55 delivery zones and rates
-- ✓ noest_express_config (with RLS policies) 
-- ✓ orders (with RLS policies)
-- ✓ orders_summary (no RLS - likely reporting table)
-- ✓ products (no RLS - public catalog)
-- ✓ wilaya_mapping (no RLS - public address data) - POPULATED with 48 Algerian wilayas
-- =====================================================

-- =====================================================
-- 7. STORAGE BUCKET SETUP
-- =====================================================
-- Create the 'product-images' storage bucket for product photos
-- This bucket is used to store product images uploaded by admins

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images', 
    true,
    52428800,  -- 50MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STORAGE POLICIES FOR PRODUCT-IMAGES BUCKET
-- =====================================================
-- Set up Row Level Security policies for the storage bucket

-- Policy 1: Allow public read access to images
CREATE POLICY "Public Access to product images" ON storage.objects
    FOR SELECT TO PUBLIC
    USING (bucket_id = 'product-images');

-- Policy 2: Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload product images" ON storage.objects
    FOR INSERT TO PUBLIC
    WITH CHECK (
        auth.uid() IS NOT NULL AND 
        bucket_id = 'product-images' AND
        (storage.foldername(name))[1] = 'products'
    );

-- Policy 3: Allow authenticated users to update images
CREATE POLICY "Authenticated users can update product images" ON storage.objects
    FOR UPDATE TO PUBLIC
    USING (
        auth.uid() IS NOT NULL AND 
        bucket_id = 'product-images'
    );

-- Policy 4: Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete product images" ON storage.objects
    FOR DELETE TO PUBLIC
    USING (
        auth.uid() IS NOT NULL AND 
        bucket_id = 'product-images'
    );

-- =====================================================
-- STORAGE SETUP COMPLETE
-- =====================================================
-- Storage bucket 'product-images' created with policies:
-- ✓ Public read access for product images
-- ✓ Authenticated upload/update/delete access
-- ✓ 50MB file size limit
-- ✓ Allowed MIME types: JPEG, PNG, WebP, GIF
-- =====================================================
