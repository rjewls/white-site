import { createClient } from '@supabase/supabase-js';

// Environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nnoxedkedgiumjebdzlf.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ub3hlZGtlZGdpdW1qZWJkemxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyODU4OTMsImV4cCI6MjA2ODg2MTg5M30.hJe1HTssRdEp_jdi1oBgVW433FACxyfO_CdEoNOQruI';

// Storage key can be customized per site to avoid conflicts
const storageKey = import.meta.env.VITE_SUPABASE_STORAGE_KEY || 'belle-elle-auth';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: storageKey,
  }
});
