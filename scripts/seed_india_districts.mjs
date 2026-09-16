import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { INDIA_STATES_DATA } from '../src/data/indiaLocations.js';

const env = fs.readFileSync('.env', 'utf8');
const url = env.match(/VITE_SUPABASE_URL=([^\r\n]+)/)[1].trim();
const key = env.match(/VITE_SUPABASE_ANON_KEY=([^\r\n]+)/)[1].trim();
const supabase = createClient(url, key);

async function seed() {
  console.log('Seeding districts from master India locations...');
  
  const rows = [];
  for (const [stateName, stateData] of Object.entries(INDIA_STATES_DATA)) {
    for (const districtName of Object.keys(stateData.districts)) {
      rows.push({
        name: districtName,
        code: `${stateData.code}-${districtName.slice(0, 3).toUpperCase()}`,
        state: stateName,
        is_active: true
      });
    }
  }

  console.log(`Total districts to ensure in DB: ${rows.length}`);

  // Insert in batches of 50
  for (let i = 0; i < rows.length; i += 50) {
    const chunk = rows.slice(i, i + 50);
    const { data, error } = await supabase
      .from('districts')
      .upsert(chunk, { onConflict: 'name', ignoreDuplicates: true })
      .select('id, name, state');
    
    if (error) {
      console.warn('Batch insert error (falling back to single inserts):', error.message);
      for (const item of chunk) {
        await supabase.from('districts').insert([item]).select();
      }
    }
  }

  const { data: finalDistricts } = await supabase.from('districts').select('id, name, state');
  console.log(`✅ Current total districts in Supabase: ${finalDistricts?.length || 0}`);
}

seed().catch(console.error);
