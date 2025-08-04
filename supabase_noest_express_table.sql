-- Create the noest_express_config table for storing API credentials
CREATE TABLE IF NOT EXISTS noest_express_config (
  id SERIAL PRIMARY KEY,
  api_token TEXT NOT NULL,
  guid TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE noest_express_config ENABLE ROW LEVEL SECURITY;

-- Create policy to only allow authenticated users (admin access only)
CREATE POLICY "Enable all operations for authenticated users" ON noest_express_config
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_noest_express_config_updated_at 
  BEFORE UPDATE ON noest_express_config 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert a default empty row (optional, for easier management)
INSERT INTO noest_express_config (api_token, guid) 
VALUES ('', '') 
ON CONFLICT DO NOTHING;
