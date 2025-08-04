-- Fix the RLS policy for noest_express_config table
-- Drop the existing policy
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON noest_express_config;

-- Create the correct policy using auth.uid()
CREATE POLICY "Enable all operations for authenticated users" ON noest_express_config
  FOR ALL USING (auth.uid() IS NOT NULL);
