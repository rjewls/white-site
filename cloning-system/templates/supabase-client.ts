import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-default-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-default-anon-key';
const storageKey = import.meta.env.VITE_SUPABASE_STORAGE_KEY || 'boutique-session';

// Validate required environment variables
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase configuration missing. Please check your .env.local file.');
  console.warn('Required variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
}

// Create Supabase client with configuration
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: window.localStorage,
    storageKey: storageKey,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'boutique-site'
    }
  }
});

// Export configuration for use in other parts of the app
export { supabaseUrl, supabaseKey, storageKey };

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !supabaseUrl.includes('your-default-project') && 
         !supabaseKey.includes('your-default-anon-key') &&
         supabaseUrl.includes('supabase.co');
};

// Helper function to test the connection
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
};
