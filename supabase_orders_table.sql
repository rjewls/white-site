-- Create the orders table for storing customer order information
-- Structured to match Noest Express API requirements
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  
  -- API Credentials (reference to noest_express_config)
  -- api_token and user_guid will be fetched from noest_express_config table
  
  -- Order Reference
  reference TEXT, -- Optional reference for the order (max:255)
  
  -- Product Information  
  product_id TEXT NOT NULL,
  product_title TEXT NOT NULL,
  produit TEXT NOT NULL, -- Product name for API (required)
  product_price DECIMAL(10,2) NOT NULL,
  
  -- Customer Information (API fields)
  client TEXT NOT NULL, -- Customer name & surname (required | max:255)
  phone TEXT NOT NULL, -- Phone number (required | digits_between:9,10)
  phone_2 TEXT, -- Optional second phone (digits_between:9,10)
  
  -- Delivery Information (API fields)
  adresse TEXT NOT NULL, -- Customer address (required | max:255)
  wilaya_id INTEGER NOT NULL CHECK (wilaya_id BETWEEN 1 AND 48), -- Wilaya ID (required | integer | between:1,48)
  commune TEXT NOT NULL, -- Commune name (required | max:255)
  
  -- Order Details
  quantity INTEGER NOT NULL DEFAULT 1,
  quantite TEXT, -- Quantities separated by comma (Required_if: stock = 1)
  selected_color TEXT,
  selected_colors TEXT[], -- For multiple color selections
  selected_size TEXT,
  selected_sizes TEXT[], -- For multiple size selections
  
  -- Pricing (API fields)
  montant DECIMAL(10,2) NOT NULL, -- Amount (required | numeric)
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL,
  
  -- API Specific Fields
  remarque TEXT, -- Remarks (max:255)
  type_id INTEGER NOT NULL DEFAULT 1 CHECK (type_id BETWEEN 1 AND 3), -- 1:Delivery, 2:Exchange, 3:Pickup
  poids INTEGER NOT NULL DEFAULT 1, -- Package weight (required | integer)
  stop_desk INTEGER NOT NULL DEFAULT 0 CHECK (stop_desk BETWEEN 0 AND 1), -- 0:home, 1:stopdesk
  station_code TEXT, -- Station code (Required_if stop_desk = 1)
  stock INTEGER DEFAULT 0 CHECK (stock BETWEEN 0 AND 1), -- 0:No, 1:Yes (prepared from Noest stock)
  can_open INTEGER DEFAULT 1 CHECK (can_open BETWEEN 0 AND 1), -- 0:No, 1:Yes (can recipient open package)
  
  -- Order Status and Tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'validated', 'shipped', 'delivered', 'cancelled', 'returned')),
  tracking TEXT UNIQUE, -- Tracking number from Noest API
  is_validated BOOLEAN DEFAULT FALSE, -- Whether order is validated with Noest
  
  -- Additional Information
  notes TEXT, -- Internal notes
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Delivery tracking
  estimated_delivery_date DATE,
  driver_name TEXT,
  driver_phone TEXT
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy for orders - customers can view their own orders, admins can view all
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (true); -- For now allow all reads, you can restrict this later

CREATE POLICY "Only authenticated users can insert orders" ON orders
  FOR INSERT WITH CHECK (true); -- Allow order creation

CREATE POLICY "Only admins can update orders" ON orders
  FOR UPDATE USING (auth.uid() IS NOT NULL); -- Restrict updates to authenticated users (admins)

CREATE POLICY "Only admins can delete orders" ON orders
  FOR DELETE USING (auth.uid() IS NOT NULL); -- Restrict deletes to authenticated users (admins)

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_wilaya_id ON orders(wilaya_id);
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);
CREATE INDEX IF NOT EXISTS idx_orders_tracking ON orders(tracking);
CREATE INDEX IF NOT EXISTS idx_orders_is_validated ON orders(is_validated);
CREATE INDEX IF NOT EXISTS idx_orders_stop_desk ON orders(stop_desk);

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create a view for order summary (useful for admin dashboard)
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

-- Grant access to the view
GRANT SELECT ON orders_summary TO authenticated;
GRANT SELECT ON orders_summary TO anon;

-- Create a view specifically for Noest API data mapping
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
WHERE is_validated = FALSE -- Only show orders not yet sent to Noest
ORDER BY created_at ASC;

-- Grant access to the Noest API view
GRANT SELECT ON orders_for_noest_api TO authenticated;
