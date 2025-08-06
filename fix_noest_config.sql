-- Fix Noest Express configuration access issue
-- Run this in your Supabase SQL editor

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Only authenticated users can manage noest config" ON noest_express_config;
DROP POLICY IF EXISTS "noest_config_policy" ON noest_express_config;

-- Create a more permissive policy for authenticated users
CREATE POLICY "noest_config_full_access" ON noest_express_config
  FOR ALL USING (auth.role() = 'authenticated');

-- Also ensure the table exists with correct structure
CREATE TABLE IF NOT EXISTS noest_express_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  api_token TEXT NOT NULL,
  guid TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alternative: Temporarily disable RLS for testing (remove this later when working)
-- ALTER TABLE noest_express_config DISABLE ROW LEVEL SECURITY;
