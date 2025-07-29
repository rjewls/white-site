import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nnoxedkedgiumjebdzlf.supabase.co'; // Replace with your Supabase Project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ub3hlZGtlZGdpdW1qZWJkemxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyODU4OTMsImV4cCI6MjA2ODg2MTg5M30.hJe1HTssRdEp_jdi1oBgVW433FACxyfO_CdEoNOQruI'; // Replace with your anon public key

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: 'belle-elle-auth',
  }
});
