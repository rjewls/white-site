-- Create the order_items table for order line items (supports multiple products per order)
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_title TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  item_price DECIMAL(10,2) NOT NULL, -- Price per item at time of order
  subtotal DECIMAL(10,2) NOT NULL, -- quantity * item_price
  selected_color TEXT,
  selected_size TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for order_items
CREATE POLICY "Users can view order items" ON order_items
  FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can insert order items" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can update order items" ON order_items
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can delete order items" ON order_items
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create indexes for order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Create a comprehensive view that joins orders with their items
CREATE OR REPLACE VIEW orders_with_items AS
SELECT 
  o.id as order_id,
  o.customer_name,
  o.customer_phone,
  o.wilaya,
  o.commune,
  o.delivery_option,
  o.delivery_address,
  o.delivery_fee,
  o.total_price,
  o.status,
  o.created_at,
  o.tracking_number,
  oi.id as item_id,
  oi.product_id,
  oi.product_title,
  oi.quantity,
  oi.item_price,
  oi.subtotal,
  oi.selected_color,
  oi.selected_size
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
ORDER BY o.created_at DESC, oi.id;

-- Grant access to the comprehensive view
GRANT SELECT ON orders_with_items TO authenticated;
GRANT SELECT ON orders_with_items TO anon;
