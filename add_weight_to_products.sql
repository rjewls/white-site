-- Add weight column to products table
-- This SQL should be run in the Supabase SQL Editor

-- Add weight column to products table (decimal to support fractional weights like 0.5kg, 1.2kg, etc.)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS weight DECIMAL(5,2) DEFAULT 1.0 CHECK (weight > 0);

-- Add helpful comment
COMMENT ON COLUMN products.weight IS 'Product weight in kilograms for shipping calculations';

-- Update existing products to have a default weight of 1kg if they don't have one
UPDATE products 
SET weight = 1.0 
WHERE weight IS NULL;

-- Create index for performance if you have many products
CREATE INDEX IF NOT EXISTS idx_products_weight ON products(weight);

-- Verify the column was added successfully
SELECT column_name, data_type, column_default, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'weight';
