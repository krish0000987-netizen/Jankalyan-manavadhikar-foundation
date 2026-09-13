import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qvtrplnxipcagqozjdop.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2dHJwbG54aXBjYWdxb3pqZG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyOTgwNDMsImV4cCI6MjEwNDg3NDA0M30.HZnz3HlfbiSqvBXsWY6pifuHsQC5HPBq-W9q_nHma9c';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runVerification() {
  console.log('🚀 Starting Jankalyan Foundation End-to-End Verification...\n');
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
    }
  }

  // 1. HTTP Server Check
  try {
    const res = await fetch('http://localhost:5173/');
    assert(res.status === 200, `Vite dev server responding at http://localhost:5173/ (Status: ${res.status})`);
  } catch (err) {
    assert(false, `Vite dev server error: ${err.message}`);
  }

  // 2. CMS Public Data Fetch
  try {
    const { data: slides, error: sErr } = await supabase.from('hero_slides').select('*').order('display_order');
    assert(!sErr && slides && slides.length >= 6, `Fetched ${slides?.length} Hero Slides from Supabase CMS`);

    const { data: notices, error: nErr } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
    assert(!nErr && notices && notices.length > 0, `Fetched ${notices?.length} Notices from Supabase CMS`);

    const { data: faqs, error: fErr } = await supabase.from('faqs').select('*').order('display_order');
    assert(!fErr && faqs && faqs.length >= 4, `Fetched ${faqs?.length} FAQs from Supabase CMS`);

    const { data: downloads, error: dErr } = await supabase.from('downloads').select('*');
    assert(!dErr && downloads && downloads.length >= 4, `Fetched ${downloads?.length} Official Downloads`);
  } catch (err) {
    assert(false, `CMS Fetch Error: ${err.message}`);
  }

  // 3. Staff Auth & Role Resolver
  let authClient = supabase;
  try {
    const { data: authData, error: aErr } = await supabase.auth.signInWithPassword({
      email: 'admin@jankalyan.org',
      password: 'Admin@JMF2026!'
    });
    assert(!aErr && authData.user, `Authenticated Super Admin user via Supabase Auth (${authData.user?.email})`);

    if (authData.user) {
      const { data: uRoles, error: rErr } = await supabase.from('user_roles').select('role_id').eq('user_id', authData.user.id);
      if (rErr) console.error('  DEBUG rErr:', rErr.message);
      const role = uRoles?.[0]?.role_id;
      assert(role === 'SUPER_ADMIN', `Resolved profile role: ${role}`);
    }
  } catch (err) {
    assert(false, `Auth Sign-In Error: ${err.message}`);
  }

  // 4. Applications with Relational Join (as Super Admin)
  try {
    const { data: apps, error: appErr } = await supabase
      .from('applications')
      .select(`
        id, status, created_at,
        students (
          id, full_name, mobile, category,
          academic_records (class_course, prev_percentage),
          bank_details (bank_name, is_verified)
        ),
        institutions (id, name, district_id, block_id)
      `)
      .order('created_at', { ascending: false });

    if (appErr) console.error('  DEBUG appErr:', appErr.message);
    assert(!appErr && apps && apps.length >= 6, `Retrieved ${apps?.length} applications with students, institutions, academic, and bank relations`);
    const sample = apps?.[0];
    assert(sample && sample.id.startsWith('JMF-2026-'), `Application sequence format verified: ${sample?.id}`);
  } catch (err) {
    assert(false, `Applications fetch error: ${err.message}`);
  }

  // 5. Live Public Counters
  try {
    const { count: totalApps } = await supabase.from('applications').select('*', { count: 'exact', head: true });
    assert(totalApps !== null && totalApps >= 6, `Aggregated live application counter: ${totalApps} applications`);

    const { count: approvedApps } = await supabase.from('applications').select('*', { count: 'exact', head: true }).in('status', ['APPROVED', 'SCHOLARSHIP_RELEASED']);
    assert(approvedApps !== null, `Aggregated live approved counter: ${approvedApps} approved`);
  } catch (err) {
    assert(false, `Live Counters Error: ${err.message}`);
  }

  // 6. Public Tracking Lookup (Privacy-compliant)
  try {
    const { data: trackApp, error: tErr } = await supabase
      .from('applications')
      .select(`
        id, status, created_at,
        students (full_name),
        institutions (name)
      `)
      .eq('id', 'JMF-2026-108234')
      .maybeSingle();

    if (tErr) console.error('  DEBUG tErr:', tErr.message);
    assert(!tErr && trackApp, `Public Tracking lookup succeeded for JMF-2026-108234 (Status: ${trackApp?.status})`);
  } catch (err) {
    assert(false, `Tracking lookup error: ${err.message}`);
  }

  // 7. Grievance Redressal (Submit & Track)
  try {
    const testGrvId = `GRV-2026-TEST${Math.floor(1000 + Math.random() * 9000)}`;
    const { data: grv, error: grvErr } = await supabase
      .from('grievances')
      .insert({
        id: testGrvId,
        student_name: 'Verification Bot',
        mobile: '9876543210',
        email: 'bot@test.org',
        category: 'Document Re-verification',
        description: 'Automated end-to-end integration testing.',
        status: 'OPEN'
      })
      .select()
      .single();

    assert(!grvErr && grv, `Created test grievance ${testGrvId}`);

    // Track grievance
    const { data: foundGrv, error: fGrvErr } = await supabase
      .from('grievances')
      .select('*')
      .eq('id', testGrvId)
      .single();

    assert(!fGrvErr && foundGrv?.id === testGrvId, `Public grievance tracking verified for ${testGrvId}`);
  } catch (err) {
    assert(false, `Grievance Redressal Error: ${err.message}`);
  }

  // 8. Payment Batches & DBT
  try {
    const { data: batches, error: bErr } = await supabase
      .from('payment_batches')
      .select('*, payments(*)');

    assert(!bErr && batches && batches.length > 0, `Retrieved ${batches?.length} Payment Batches with DBT payments`);
    const totalDisbursed = batches?.[0]?.total_amount || 0;
    assert(totalDisbursed > 0, `Disbursement batch verified with amount ₹${totalDisbursed.toLocaleString('en-IN')}`);
  } catch (err) {
    assert(false, `Payment Batches Error: ${err.message}`);
  }

  // 9. Contact Inquiry Submission
  try {
    const { data: inquiry, error: iErr } = await supabase
      .from('contact_submissions')
      .insert({
        name: 'Automated Verifier',
        mobile: '9876543210',
        email: 'verifier@test.org',
        subject: 'System Check',
        message: 'Verifying contact submission channel.'
      })
      .select()
      .single();

    assert(!iErr && inquiry, `Contact submission verified (Ticket ID: ${inquiry?.id})`);
  } catch (err) {
    assert(false, `Contact submission error: ${err.message}`);
  }

  // 10. Digital Certificate & QR Verification
  try {
    const { data: certs, error: cErr } = await supabase
      .from('certificates')
      .select('*')
      .eq('application_id', 'JMF-2026-108234');

    assert(!cErr, `Certificate query executed successfully (${certs?.length || 0} certificates found)`);
  } catch (err) {
    assert(false, `Certificate Error: ${err.message}`);
  }

  console.log(`\n==============================================`);
  console.log(`RESULTS: ${passed}/${total} checks PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log(`==============================================\n`);

  if (passed === total) {
    console.log('🎉 ALL PRODUCTION BACKEND & DATA SERVICES FULLY OPERATIONAL!\n');
  } else {
    process.exitCode = 1;
  }
}

runVerification();
