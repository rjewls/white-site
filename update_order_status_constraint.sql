-- Update the orders table status constraint to allow new status values
-- This migration adds support for 'inséré' and 'expédié' status values

-- First, drop the existing constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Add the new constraint with all allowed status values
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'inséré', 'expédié'));

-- Optional: Set default status for existing orders that might have NULL status
UPDATE orders SET status = 'pending' WHERE status IS NULL;

-- Optional: Add a comment to document the status values
COMMENT ON COLUMN orders.status IS 'Order status: pending, processing, shipped, delivered, cancelled, inséré (uploaded to Noest), expédié (validated/shipped)';
