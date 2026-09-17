const token = process.env.SUPABASE_ACCESS_TOKEN;
const ref = process.env.SUPABASE_PROJECT_REF || 'qvtrplnxipcagqozjdop';

async function runSql(sql) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`SQL query failed (${res.status}): ${txt}`);
  }
  return await res.json();
}

async function main() {
  console.log('1. Adding columns to commission_rates table if not exists...');
  await runSql(`
    ALTER TABLE public.commission_rates 
    ADD COLUMN IF NOT EXISTS min_form_target INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS role_name_hi TEXT,
    ADD COLUMN IF NOT EXISTS role_name_en TEXT,
    ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
  `);
  console.log('Columns ensured successfully.');

  console.log('2. Upserting roles in public.roles...');
  await runSql(`
    INSERT INTO public.roles (id, name, description) VALUES
    ('DISTRICT_COORDINATOR', 'जिला समन्वयक (District Coordinator)', 'District Level Coordinator - Jurisdiction for district records and scrutiny'),
    ('BLOCK_COORDINATOR', 'ब्लॉक समन्वयक (Block Coordinator)', 'Block Level Coordinator - Jurisdiction for block records and scrutiny'),
    ('TEHSIL_COORDINATOR', 'तहसील समन्वयक (Tehsil Coordinator)', 'Tehsil Level Coordinator - Jurisdiction for tehsil records and scrutiny'),
    ('GRAM_PANCHAYAT_COORDINATOR', 'ग्राम पंचायत समन्वयक (Gram Panchayat Coordinator)', 'Gram Panchayat Level Coordinator - Village-level facilitation and verification'),
    ('ONLINE_CENTER', 'ऑनलाइन शॉप / CSC / साइबर कैफे (Online Shop / CSC / Cyber Cafe)', 'CSC / Cyber Cafe / Online Center Facilitator for student registrations'),
    ('SCHOOL_COORDINATOR', 'स्कूल (School Coordinator)', 'School Nodal Coordinator for student scholarship forms'),
    ('COLLEGE_COORDINATOR', 'कॉलेज (College Coordinator)', 'College Nodal Coordinator for higher education student verification'),
    ('COACHING_CENTER', 'कोचिंग सेंटर (Coaching Center)', 'Coaching Center Partner for applicant facilitation'),
    ('INSTITUTION', 'शैक्षणिक संस्थान (School / College Nodal Officer)', 'Educational Institution Nodal Coordinator')
    ON CONFLICT (id) DO UPDATE SET 
      name = EXCLUDED.name,
      description = EXCLUDED.description;
  `);
  console.log('Roles upserted successfully.');

  console.log('3. Upserting commission_rates with targets and rates from the official poster...');
  await runSql(`
    INSERT INTO public.commission_rates 
    (role_id, model_type, rate_amount, min_form_target, role_name_hi, role_name_en, rate_display, display_order, is_active, updated_at) 
    VALUES
    (
      'DISTRICT_COORDINATOR', 
      'FIXED_PER_APPROVED', 
      50.00, 
      1000, 
      'जिला समन्वयक', 
      'District Coordinator', 
      '₹50 प्रति सफल आवेदन (न्यूनतम लक्ष्य: 1000 फॉर्म)', 
      1, 
      true, 
      NOW()
    ),
    (
      'BLOCK_COORDINATOR', 
      'FIXED_PER_APPROVED', 
      40.00, 
      500, 
      'ब्लॉक समन्वयक', 
      'Block Coordinator', 
      '₹40 प्रति सफल आवेदन (न्यूनतम लक्ष्य: 500 फॉर्म)', 
      2, 
      true, 
      NOW()
    ),
    (
      'TEHSIL_COORDINATOR', 
      'FIXED_PER_APPROVED', 
      35.00, 
      300, 
      'तहसील समन्वयक', 
      'Tehsil Coordinator', 
      '₹35 प्रति सफल आवेदन (न्यूनतम लक्ष्य: 300 फॉर्म)', 
      3, 
      true, 
      NOW()
    ),
    (
      'GRAM_PANCHAYAT_COORDINATOR', 
      'FIXED_PER_APPROVED', 
      25.00, 
      100, 
      'ग्राम पंचायत समन्वयक', 
      'Gram Panchayat Coordinator', 
      '₹25 प्रति सफल आवेदन (न्यूनतम लक्ष्य: 100 फॉर्म)', 
      4, 
      true, 
      NOW()
    ),
    (
      'ONLINE_CENTER', 
      'FIXED_PER_APPLICATION', 
      30.00, 
      50, 
      'ऑनलाइन शॉप / CSC / साइबर कैफे', 
      'Online Shop / CSC / Cyber Cafe', 
      '₹30 प्रति सफल आवेदन (न्यूनतम लक्ष्य: 50 फॉर्म)', 
      5, 
      true, 
      NOW()
    ),
    (
      'SCHOOL_COORDINATOR', 
      'FIXED_PER_APPROVED', 
      25.00, 
      100, 
      'स्कूल', 
      'School Coordinator', 
      '₹25 प्रति सफल आवेदन (न्यूनतम लक्ष्य: 100 फॉर्म)', 
      6, 
      true, 
      NOW()
    ),
    (
      'COLLEGE_COORDINATOR', 
      'FIXED_PER_APPROVED', 
      30.00, 
      150, 
      'कॉलेज', 
      'College Coordinator', 
      '₹30 प्रति सफल आवेदन (न्यूनतम लक्ष्य: 150 फॉर्म)', 
      7, 
      true, 
      NOW()
    ),
    (
      'COACHING_CENTER', 
      'FIXED_PER_APPROVED', 
      20.00, 
      100, 
      'कोचिंग सेंटर', 
      'Coaching Center', 
      '₹20 प्रति सफल आवेदन (न्यूनतम लक्ष्य: 100 फॉर्म)', 
      8, 
      true, 
      NOW()
    ),
    (
      'INSTITUTION', 
      'FIXED_PER_APPROVED', 
      25.00, 
      100, 
      'स्कूल / शैक्षणिक संस्थान', 
      'Educational Institution', 
      '₹25 प्रति सफल आवेदन (न्यूनतम लक्ष्य: 100 फॉर्म)', 
      9, 
      true, 
      NOW()
    )
    ON CONFLICT (role_id) DO UPDATE SET 
      rate_amount = EXCLUDED.rate_amount,
      min_form_target = EXCLUDED.min_form_target,
      role_name_hi = EXCLUDED.role_name_hi,
      role_name_en = EXCLUDED.role_name_en,
      rate_display = EXCLUDED.rate_display,
      display_order = EXCLUDED.display_order,
      model_type = EXCLUDED.model_type,
      is_active = true,
      updated_at = NOW();
  `);
  console.log('Commission rates upserted successfully.');

  console.log('4. Verifying stored commission rates:');
  const result = await runSql(`
    SELECT cr.role_id, cr.display_order, cr.role_name_hi, cr.role_name_en, cr.min_form_target, cr.rate_amount, cr.rate_display 
    FROM public.commission_rates cr 
    ORDER BY cr.display_order ASC;
  `);
  console.table(result);
}

main().catch(console.error);
