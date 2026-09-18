import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qvtrplnxipcagqozjdop.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2dHJwbG54aXBjYWdxb3pqZG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyOTgwNDMsImV4cCI6MjEwNDg3NDA0M30.HZnz3HlfbiSqvBXsWY6pifuHsQC5HPBq-W9q_nHma9c';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const SCHEMES = [
  {
    code: 'JMF-SCH-01',
    name: 'Class 5th to 7th Primary/Middle Scholarship (कक्षा 5वीं से 7वीं)',
    description: 'Annual Direct Benefit Transfer financial grant for students enrolled in Class 5th, 6th, and 7th.',
    academic_year: '2026-27',
    grant_amount: 4000,
    grant_amount_display: '₹4,000/- Yearly',
    application_start_date: '2026-09-15',
    application_end_date: '2026-11-30',
    application_fee: 1.00,
    is_fee_applicable: true,
    is_active: true,
    eligibility_overview: 'Class 5th-7th enrolled students with min 50% marks in previous examination and family annual income up to ₹3,00,000.',
    min_percentage: 50,
    max_annual_income: 300000,
    eligible_categories: ['General', 'OBC', 'SC', 'ST'],
    eligible_courses: ['Class 5th', 'Class 6th', 'Class 7th']
  },
  {
    code: 'JMF-SCH-02',
    name: 'Class 8th to 10th High School Scholarship (कक्षा 8वीं से 10वीं)',
    description: 'Annual Direct Benefit Transfer grant for high school students enrolled in Class 8th, 9th, and 10th.',
    academic_year: '2026-27',
    grant_amount: 8000,
    grant_amount_display: '₹8,000/- Yearly',
    application_start_date: '2026-09-15',
    application_end_date: '2026-11-30',
    application_fee: 1.00,
    is_fee_applicable: true,
    is_active: true,
    eligibility_overview: 'Class 8th-10th enrolled students with min 50% marks in previous examination and family annual income up to ₹3,00,000.',
    min_percentage: 50,
    max_annual_income: 300000,
    eligible_categories: ['General', 'OBC', 'SC', 'ST'],
    eligible_courses: ['Class 8th', 'Class 9th', 'Class 10th']
  },
  {
    code: 'JMF-SCH-03',
    name: 'Class 11th & 12th Higher Secondary Scholarship (कक्षा 11वीं से 12वीं)',
    description: 'Direct Benefit Transfer grant for Higher Secondary students in Class 11th & 12th (Arts, Science, Commerce, Agriculture).',
    academic_year: '2026-27',
    grant_amount: 12000,
    grant_amount_display: '₹12,000/- Yearly',
    application_start_date: '2026-09-15',
    application_end_date: '2026-11-30',
    application_fee: 1.00,
    is_fee_applicable: true,
    is_active: true,
    eligibility_overview: 'Class 11th-12th students with min 50% qualifying marks and family annual income up to ₹3,00,000.',
    min_percentage: 50,
    max_annual_income: 300000,
    eligible_categories: ['General', 'OBC', 'SC', 'ST'],
    eligible_courses: ['Class 11th', 'Class 12th']
  },
  {
    code: 'JMF-SCH-04',
    name: 'Diploma, Polytechnic & ITI Technical Grant (डिप्लोमा / ITI)',
    description: 'Technical and vocational educational assistance for students enrolled in Engineering Diplomas, Polytechnic, and ITI trades.',
    academic_year: '2026-27',
    grant_amount: 14000,
    grant_amount_display: '₹14,000/- Yearly',
    application_start_date: '2026-09-15',
    application_end_date: '2026-11-30',
    application_fee: 1.00,
    is_fee_applicable: true,
    is_active: true,
    eligibility_overview: 'Polytechnic/ITI technical diploma students with min 50% qualifying marks and family annual income up to ₹3,00,000.',
    min_percentage: 50,
    max_annual_income: 300000,
    eligible_categories: ['General', 'OBC', 'SC', 'ST'],
    eligible_courses: ['Polytechnic Diploma', 'ITI Trades', 'Vocational Diploma']
  },
  {
    code: 'JMF-SCH-05',
    name: 'Graduation (Bachelor Degree) Higher Education Grant (स्नातक)',
    description: 'Higher education financial assistance for undergraduate degree students pursuing B.A., B.Sc., B.Com., B.Tech, BCA, BBA.',
    academic_year: '2026-27',
    grant_amount: 16000,
    grant_amount_display: '₹16,000/- Yearly',
    application_start_date: '2026-09-15',
    application_end_date: '2026-11-30',
    application_fee: 1.00,
    is_fee_applicable: true,
    is_active: true,
    eligibility_overview: 'Undergraduate college degree students with min 50% qualifying marks and family annual income up to ₹3,00,000.',
    min_percentage: 50,
    max_annual_income: 300000,
    eligible_categories: ['General', 'OBC', 'SC', 'ST'],
    eligible_courses: ['B.A.', 'B.Sc.', 'B.Com.', 'B.Tech / B.E.', 'BCA', 'BBA', 'LLB']
  },
  {
    code: 'JMF-SCH-06',
    name: 'Post Graduation (Master Degree) Research & Advanced Grant (परास्नातक)',
    description: 'Premier higher education financial grant for Master\'s degree and postgraduate students (M.A., M.Sc., M.Com., MBA, M.Tech, MCA).',
    academic_year: '2026-27',
    grant_amount: 22000,
    grant_amount_display: '₹22,000/- Yearly',
    application_start_date: '2026-09-15',
    application_end_date: '2026-11-30',
    application_fee: 1.00,
    is_fee_applicable: true,
    is_active: true,
    eligibility_overview: 'Postgraduate students enrolled in Master\'s programs with min 50% marks in Graduation and family income up to ₹3,00,000.',
    min_percentage: 50,
    max_annual_income: 300000,
    eligible_categories: ['General', 'OBC', 'SC', 'ST'],
    eligible_courses: ['M.A.', 'M.Sc.', 'M.Com.', 'MBA', 'M.Tech', 'MCA', 'LLM']
  }
];

async function seedAllSchemes() {
  console.log('Seeding scholarship schemes...');

  // Update existing general umbrella scheme with clear title
  await supabase
    .from('scholarship_schemes')
    .update({
      name: 'Jankalyan Manavadhikar Scholarship Yojna 2026-27 (National Umbrella Scheme)',
      grant_amount_display: '₹4,000/- to ₹22,000/- Yearly',
      application_start_date: '2026-09-15',
      application_end_date: '2026-11-30'
    })
    .eq('id', 'd0000000-0000-0000-0000-000000000001');

  for (const s of SCHEMES) {
    // Check if scheme code already exists
    const { data: existing } = await supabase
      .from('scholarship_schemes')
      .select('id')
      .eq('code', s.code)
      .maybeSingle();

    let schemeId = existing?.id;

    if (!schemeId) {
      const { data: inserted, error: insErr } = await supabase
        .from('scholarship_schemes')
        .insert([{
          code: s.code,
          name: s.name,
          description: s.description,
          academic_year: s.academic_year,
          grant_amount: s.grant_amount,
          grant_amount_display: s.grant_amount_display,
          application_start_date: s.application_start_date,
          application_end_date: s.application_end_date,
          application_fee: s.application_fee,
          is_fee_applicable: s.is_fee_applicable,
          is_active: s.is_active,
          eligibility_overview: s.eligibility_overview
        }])
        .select()
        .single();

      if (insErr) {
        console.error('Error inserting scheme ' + s.code, insErr);
        continue;
      }
      schemeId = inserted.id;
      console.log(`Inserted scheme: ${s.code} -> ${schemeId}`);
    } else {
      await supabase
        .from('scholarship_schemes')
        .update({
          name: s.name,
          description: s.description,
          academic_year: s.academic_year,
          grant_amount: s.grant_amount,
          grant_amount_display: s.grant_amount_display,
          application_start_date: s.application_start_date,
          application_end_date: s.application_end_date,
          application_fee: s.application_fee,
          is_active: s.is_active,
          eligibility_overview: s.eligibility_overview
        })
        .eq('id', schemeId);
      console.log(`Updated scheme: ${s.code} -> ${schemeId}`);
    }

    // Upsert eligibility rule for this scheme
    const { data: exRule } = await supabase
      .from('scheme_eligibility_rules')
      .select('id')
      .eq('scheme_id', schemeId)
      .maybeSingle();

    if (!exRule) {
      await supabase
        .from('scheme_eligibility_rules')
        .insert([{
          scheme_id: schemeId,
          min_percentage: s.min_percentage,
          max_annual_income: s.max_annual_income,
          eligible_categories: s.eligible_categories,
          eligible_courses: s.eligible_courses
        }]);
      console.log(`Created eligibility rule for ${s.code}`);
    } else {
      await supabase
        .from('scheme_eligibility_rules')
        .update({
          min_percentage: s.min_percentage,
          max_annual_income: s.max_annual_income,
          eligible_categories: s.eligible_categories,
          eligible_courses: s.eligible_courses
        })
        .eq('id', exRule.id);
      console.log(`Updated eligibility rule for ${s.code}`);
    }
  }

  // Count total schemes
  const { data: total } = await supabase.from('scholarship_schemes').select('id, code, name, grant_amount');
  console.log(`\nTOTAL SCHOLARSHIP SCHEMES IN DATABASE: ${total?.length}`);
  total?.forEach(t => console.log(`- [${t.code}] ${t.name}: ₹${t.grant_amount}`));
}

seedAllSchemes();
