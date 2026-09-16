import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qvtrplnxipcagqozjdop.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2dHJwbG54aXBjYWdxb3pqZG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyOTgwNDMsImV4cCI6MjEwNDg3NDA0M30.HZnz3HlfbiSqvBXsWY6pifuHsQC5HPBq-W9q_nHma9c';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function inspectAll() {
  const { data: notices } = await supabase.from('notices').select('*');
  console.log('NOTICES:');
  notices?.forEach(n => console.log(n.id, n.title, n.publish_date, n.file_name));

  const { data: announcements } = await supabase.from('announcements').select('*');
  console.log('\nANNOUNCEMENTS:');
  announcements?.forEach(a => console.log(a.id, a.title_en, a.title_hi));

  const { data: slides } = await supabase.from('hero_slides').select('*');
  console.log('\nHERO SLIDES:');
  slides?.forEach(s => console.log(s.id, s.title, s.subtitle));
}

inspectAll();
