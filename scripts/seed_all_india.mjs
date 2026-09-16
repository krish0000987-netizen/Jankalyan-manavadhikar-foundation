import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { INDIA_STATES_DATA, getAllStates, getDistrictsByState, getBlocksByDistrict } from '../src/data/indiaLocations.js';

const env = fs.readFileSync('.env', 'utf8');
const url = env.match(/VITE_SUPABASE_URL=([^\r\n]+)/)[1].trim();
const key = env.match(/VITE_SUPABASE_ANON_KEY=([^\r\n]+)/)[1].trim();
const supabase = createClient(url, key);

async function seed() {
  console.log('--- Seeding All 785 Districts to Supabase ---');
  
  // 1. Fetch existing districts
  const { data: existingDistricts, error: fetchErr } = await supabase
    .from('districts')
    .select('id, name, code, state');
  
  if (fetchErr) {
    console.error('Error fetching existing districts:', fetchErr);
    return;
  }

  const existingMap = new Map();
  const usedCodes = new Set();
  (existingDistricts || []).forEach(d => {
    existingMap.set(d.name.toLowerCase(), d);
    if (d.code) usedCodes.add(d.code.toUpperCase());
  });

  console.log(`Currently ${existingDistricts.length} districts in DB.`);

  // 2. Prepare new districts to insert
  const toInsert = [];
  let dIndex = 1;

  for (const [stateName, stateData] of Object.entries(INDIA_STATES_DATA)) {
    for (const districtName of Object.keys(stateData.districts)) {
      if (!existingMap.has(districtName.toLowerCase())) {
        let codeCandidate = `${stateData.code}-${districtName.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase()}`;
        if (usedCodes.has(codeCandidate)) {
          codeCandidate = `${codeCandidate}-${dIndex}`;
        }
        usedCodes.add(codeCandidate);
        dIndex++;

        toInsert.push({
          name: districtName,
          code: codeCandidate,
          state: stateName,
          is_active: true
        });
      }
    }
  }

  console.log(`New districts to insert: ${toInsert.length}`);

  // Insert in batches of 40
  for (let i = 0; i < toInsert.length; i += 40) {
    const chunk = toInsert.slice(i, i + 40);
    const { error: insErr } = await supabase.from('districts').insert(chunk);
    if (insErr) {
      console.warn(`Batch ${i / 40 + 1} insert warning:`, insErr.message);
      // Fallback single insert
      for (const item of chunk) {
        try {
          await supabase.from('districts').insert([item]);
        } catch (e) {
          // ignore duplicate
        }
      }
    }
  }

  // 3. Fetch all districts now in DB
  const { data: allDbDistricts } = await supabase.from('districts').select('id, name, state');
  console.log(`✅ Total districts in Supabase now: ${allDbDistricts?.length || 0}`);

  // 4. Seed blocks for all districts
  console.log('--- Seeding Blocks for All Districts in Supabase ---');
  const distDbMap = new Map();
  (allDbDistricts || []).forEach(d => distDbMap.set(d.name.toLowerCase(), d.id));

  // Fetch existing blocks to prevent duplicates
  const { data: existingBlocks } = await supabase.from('blocks').select('district_id, name');
  const existingBlockKeys = new Set();
  (existingBlocks || []).forEach(b => {
    existingBlockKeys.add(`${b.district_id}:${b.name.toLowerCase()}`);
  });

  console.log(`Currently ${existingBlocks?.length || 0} blocks in DB.`);

  const blocksToInsert = [];
  for (const [stateName, stateData] of Object.entries(INDIA_STATES_DATA)) {
    for (const [districtName, blkList] of Object.entries(stateData.districts)) {
      const distId = distDbMap.get(districtName.toLowerCase());
      if (distId && Array.isArray(blkList)) {
        blkList.forEach((bName, bIdx) => {
          const key = `${distId}:${bName.toLowerCase()}`;
          if (!existingBlockKeys.has(key)) {
            existingBlockKeys.add(key);
            blocksToInsert.push({
              district_id: distId,
              name: bName,
              code: `${districtName.replace(/[^A-Za-z0-9]/g, '').slice(0, 3).toUpperCase()}-${bIdx + 1}`,
              is_active: true
            });
          }
        });
      }
    }
  }

  console.log(`New blocks to insert: ${blocksToInsert.length}`);

  // Insert blocks in chunks of 50
  for (let i = 0; i < blocksToInsert.length; i += 50) {
    const chunk = blocksToInsert.slice(i, i + 50);
    const { error: bErr } = await supabase.from('blocks').insert(chunk);
    if (bErr) {
      // Chunk insert error fallback
      for (const item of chunk) {
        try {
          await supabase.from('blocks').insert([item]);
        } catch (e) {
          // ignore
        }
      }
    }
    if ((i + 50) % 500 === 0 || i + 50 >= blocksToInsert.length) {
      console.log(`Inserted ${Math.min(i + 50, blocksToInsert.length)} / ${blocksToInsert.length} blocks...`);
    }
  }

  const { data: finalBlocks } = await supabase.from('blocks').select('id');
  console.log(`🎉 Finished! Total blocks in Supabase: ${finalBlocks?.length || 0}`);
}

seed().catch(console.error);
