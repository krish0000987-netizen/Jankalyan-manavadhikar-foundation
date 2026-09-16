import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qvtrplnxipcagqozjdop.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2dHJwbG54aXBjYWdxb3pqZG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyOTgwNDMsImV4cCI6MjEwNDg3NDA0M30.HZnz3HlfbiSqvBXsWY6pifuHsQC5HPBq-W9q_nHma9c';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const OFFICE_ADDRESS = 'Ward No. 30, Shri Ram College Road, Dixit Colony, Jabalpur, Pin Code: 482002';
const START_DATE = '15/09/2026';
const END_DATE = '30 November 2026';
const GRANT_AMOUNT_DISPLAY = '₹4,000/- to ₹22,000/- Yearly';

async function updateDatabase() {
  console.log('1. Updating scholarship_schemes...');
  const { data: schemeData, error: schemeError } = await supabase
    .from('scholarship_schemes')
    .update({
      grant_amount_display: GRANT_AMOUNT_DISPLAY,
      application_start_date: '2026-09-15',
      application_end_date: '2026-11-30',
      updated_at: new Date().toISOString()
    })
    .eq('id', 'd0000000-0000-0000-0000-000000000001')
    .select();

  if (schemeError) {
    console.error('Failed to update scholarship_schemes:', schemeError);
  } else {
    console.log('✅ Updated scholarship_schemes:', schemeData);
  }

  console.log('\n2. Updating system_settings...');
  // First fetch current portal_config
  const { data: portalRow } = await supabase
    .from('system_settings')
    .select('value')
    .eq('key', 'portal_config')
    .single();

  const currentPortalConfig = portalRow?.value || {};
  const updatedPortalConfig = {
    ...currentPortalConfig,
    office_address: OFFICE_ADDRESS
  };

  const settingsToUpsert = [
    {
      key: 'applicationStartDate',
      value: START_DATE,
      is_public: true,
      updated_at: new Date().toISOString()
    },
    {
      key: 'applicationClosingDate',
      value: END_DATE,
      is_public: true,
      updated_at: new Date().toISOString()
    },
    {
      key: 'officeAddress',
      value: OFFICE_ADDRESS,
      is_public: true,
      updated_at: new Date().toISOString()
    },
    {
      key: 'grantAmountDisplay',
      value: GRANT_AMOUNT_DISPLAY,
      is_public: true,
      updated_at: new Date().toISOString()
    },
    {
      key: 'portal_config',
      value: updatedPortalConfig,
      is_public: true,
      updated_at: new Date().toISOString()
    }
  ];

  for (const s of settingsToUpsert) {
    const { error } = await supabase
      .from('system_settings')
      .upsert(s, { onConflict: 'key' });
    if (error) {
      console.error(`Error updating ${s.key}:`, error);
    } else {
      console.log(`✅ Updated system_settings [${s.key}]`);
    }
  }

  console.log('\n3. Verification read...');
  const { data: updatedSchemes } = await supabase.from('scholarship_schemes').select('*');
  console.log('Schemes now:', updatedSchemes);

  const { data: updatedSettings } = await supabase.from('system_settings').select('*');
  console.log('Settings now:');
  updatedSettings?.forEach(s => console.log(` - ${s.key}:`, JSON.stringify(s.value)));
}

updateDatabase();
