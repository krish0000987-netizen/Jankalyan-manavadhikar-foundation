import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qvtrplnxipcagqozjdop.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2dHJwbG54aXBjYWdxb3pqZG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyOTgwNDMsImV4cCI6MjEwNDg3NDA0M30.HZnz3HlfbiSqvBXsWY6pifuHsQC5HPBq-W9q_nHma9c';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  console.log('--- Fetching scholarship_schemes ---');
  const { data: schemes, error: schErr } = await supabase.from('scholarship_schemes').select('*');
  console.log('Schemes:', schemes, schErr);

  console.log('--- Fetching system_settings ---');
  const { data: settings, error: setErr } = await supabase.from('system_settings').select('*');
  console.log('Settings:', settings, setErr);
}

main();
