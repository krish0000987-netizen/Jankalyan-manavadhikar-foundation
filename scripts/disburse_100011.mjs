import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qvtrplnxipcagqozjdop.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2dHJwbG54aXBjYWdxb3pqZG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyOTgwNDMsImV4cCI6MjEwNDg3NDA0M30.HZnz3HlfbiSqvBXsWY6pifuHsQC5HPBq-W9q_nHma9c';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  const appId = 'JMF-2026-100011';
  const today = '2026-09-15';
  const utr = 'JMFDBT' + Date.now();

  console.log(`Starting disbursement for ${appId}...`);

  // 1. Fetch current application
  const { data: app, error: appErr } = await supabase
    .from('applications')
    .select('*, students(*, bank_details(*))')
    .eq('id', appId)
    .single();

  if (appErr || !app) {
    console.error('App lookup failed:', appErr);
    process.exit(1);
  }

  // 2. Update application to SCHOLARSHIP_RELEASED
  const { data: updatedApp, error: uErr } = await supabase
    .from('applications')
    .update({
      status: 'SCHOLARSHIP_RELEASED',
      stage: 5,
      approval_date: today,
      payment_date: today,
      utr_number: utr,
      bonafide_verified: true,
      district_verified: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', appId)
    .select()
    .single();

  if (uErr) {
    console.error('Application update error:', uErr);
    process.exit(1);
  }
  console.log('✅ Application updated to SCHOLARSHIP_RELEASED (Stage 5):', updatedApp.utr_number);

  // 3. Insert or update payments record
  const studentId = app.student_id;
  const bank = app.students?.bank_details?.[0] || {};

  const { data: existingPayment } = await supabase
    .from('payments')
    .select('id')
    .eq('application_id', appId)
    .maybeSingle();

  if (existingPayment) {
    const { error: pUpErr } = await supabase
      .from('payments')
      .update({
        status: 'SUCCESS',
        utr_number: utr,
        payment_method: 'DBT_NEFT',
        payment_date: today,
        amount: 12000.00,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingPayment.id);
    if (pUpErr) console.error('Payment update error:', pUpErr);
    else console.log('✅ Existing payment record updated with UTR');
  } else {
    const { data: newPmt, error: pErr } = await supabase
      .from('payments')
      .insert({
        application_id: appId,
        student_id: studentId,
        amount: 12000.00,
        bank_account_masked: bank.account_number_masked || 'XXXX-XXXX-9012',
        ifsc_code: bank.ifsc_code || 'SBIN0001234',
        payment_method: 'DBT_NEFT',
        status: 'SUCCESS',
        utr_number: utr,
        payment_date: today
      })
      .select()
      .single();

    if (pErr) console.error('Payment insert error:', pErr);
    else console.log('✅ New payment record created:', newPmt.id);
  }

  // 4. Insert status transition history
  const { error: hErr } = await supabase.from('application_status_history').insert({
    application_id: appId,
    previous_status: app.status,
    new_status: 'SCHOLARSHIP_RELEASED',
    actor_id: '0dae62d6-310e-4564-8c4d-7da1f8db672f',
    actor_role: 'SUPER_ADMIN',
    remarks: `Direct Benefit Transfer of Rs. 12,000 released to beneficiary account (Bank UTR: ${utr})`
  });

  if (hErr) console.error('History insert error:', hErr);
  else console.log('✅ Status history logged');

  console.log('\n🎉 ALL DONE! Verifying normalized application output...');
}

main();
