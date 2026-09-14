import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 'https://qvtrplnxipcagqozjdop.supabase.co';
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2dHJwbG54aXBjYWdxb3pqZG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyOTgwNDMsImV4cCI6MjEwNDg3NDA0M30.HZnz3HlfbiSqvBXsWY6pifuHsQC5HPBq-W9q_nHma9c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  }
});
