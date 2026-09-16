import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { INDIA_STATES_DATA } from '../src/data/indiaLocations.js';

const env = fs.readFileSync('.env', 'utf8');
const url = env.match(/VITE_SUPABASE_URL=([^\r\n]+)/)[1].trim();
const key = env.match(/VITE_SUPABASE_ANON_KEY=([^\r\n]+)/)[1].trim();
const supabase = createClient(url, key);

async function seedBlocks() {
  console.log('Fetching districts from database...');
  const { data: districts, error } = await supabase.from('districts').select('id, name, state');
  if (error) {
    console.error('Error fetching districts:', error);
    return;
  }

  const distMap = new Map();
  districts.forEach(d => distMap.set(d.name, d.id));

  const blocksToInsert = [];
  for (const [stateName, stateData] of Object.entries(INDIA_STATES_DATA)) {
    for (const [distName, blocks] of Object.entries(stateData.districts)) {
      const distId = distMap.get(distName);
      if (distId && Array.isArray(blocks)) {
        blocks.forEach((blk, idx) => {
          blocksToInsert.push({
            district_id: distId,
            name: blk,
            code: `${distName.slice(0, 3).toUpperCase()}-${idx + 1}`,
            is_active: true
          });
        });
      }
    }
  }

  console.log(`Ensuring ${blocksToInsert.length} blocks across districts...`);

  // Insert in chunks of 50
  for (let i = 0; i < blocksToInsert.length; i += 50) {
    const chunk = blocksToInsert.slice(i, i + 50);
    await supabase.from('blocks').upsert(chunk, { onConflict: 'district_id,name', ignoreDuplicates: true });
  }

  const { data: finalBlocks } = await supabase.from('blocks').select('id');
  console.log(`✅ Current total blocks in Supabase: ${finalBlocks?.length || 0}`);
}

seedBlocks().catch(console.error);
