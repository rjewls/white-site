-- Add image focal point support to products table
-- This allows admins to control which part of each image is shown in product cards

-- Add new column to store focal point data for each image
-- Structure: JSON array matching images array, each item contains {x: 0-100, y: 0-100}
-- Example: [{"x": 50, "y": 30}, {"x": 75, "y": 20}] means first image focuses at 50% horizontal, 30% vertical
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS image_focal_points JSONB DEFAULT '[]';

-- Add comment explaining the structure
COMMENT ON COLUMN products.image_focal_points IS 'Array of focal point objects {x: 0-100, y: 0-100} corresponding to images array. Controls which part of image is visible in product cards.';

-- Create index for performance when querying focal points
CREATE INDEX IF NOT EXISTS idx_products_focal_points ON products USING gin(image_focal_points);

-- Example data structure:
-- images: ["url1.jpg", "url2.jpg", "url3.jpg"]  
-- image_focal_points: [{"x": 50, "y": 30}, {"x": 75, "y": 20}, {"x": 25, "y": 60}]
-- 
-- x: 0-100 (0=left edge, 50=center, 100=right edge)
-- y: 0-100 (0=top edge, 50=center, 100=bottom edge)
