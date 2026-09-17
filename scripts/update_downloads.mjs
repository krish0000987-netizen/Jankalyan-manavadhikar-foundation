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
  console.log('1. Adding helpful columns to public.downloads...');
  await runSql(`
    ALTER TABLE public.downloads
    ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1,
    ADD COLUMN IF NOT EXISTS doc_number TEXT,
    ADD COLUMN IF NOT EXISTS authority TEXT,
    ADD COLUMN IF NOT EXISTS description_en TEXT,
    ADD COLUMN IF NOT EXISTS description_hi TEXT,
    ADD COLUMN IF NOT EXISTS preview_image_url TEXT;
  `);
  console.log('Columns added/ensured.');

  console.log('2. Removing whatever was added before (old mock downloads)...');
  await runSql(`
    DELETE FROM public.downloads 
    WHERE id IN ('DL-01', 'DL-02', 'DL-03', 'DL-04')
       OR file_url IS NULL;
  `);
  console.log('Old items removed.');

  console.log('3. Upserting authentic government certificates and registrations...');
  await runSql(`
    INSERT INTO public.downloads 
    (id, title_en, title_hi, category_en, category_hi, doc_number, authority, description_en, description_hi, file_url, preview_image_url, format, size_display, display_order, is_active, updated_at)
    VALUES
    (
      'DOC-MCA-COI',
      'Ministry of Corporate Affairs - Certificate of Incorporation (Section 8 Non-Profit)',
      'भारत सरकार कॉर्पोरेट कार्य मंत्रालय - कंपनी निगमन प्रमाण पत्र (धारा 8 एनजीओ)',
      'Legal & Statutory Registrations',
      'वैधानिक पंजीकरण एवं प्रमाण पत्र',
      'CIN: U85500MP2024NPL069532',
      'Ministry of Corporate Affairs, Govt. of India',
      'Certificate of Incorporation issued under Section 8(1) of the Companies Act, 2013 by the Central Registration Centre, Manesar. Registered office at Dixit Colony, Jabalpur, Madhya Pradesh.',
      'कंपनी अधिनियम 2013 की धारा 8(1) के अंतर्गत केंद्रीय पंजीकरण केंद्र (CRC मानेसर) द्वारा जारी वैधानिक निगमन प्रमाण पत्र। पंजीकृत कार्यालय: दीक्षित कॉलोनी, जबलपुर (म.प्र.)।',
      '/downloads/mca_certificate_of_incorporation.pdf',
      '/downloads/mca_incorporation_certified_copy.jpg',
      'PDF',
      '72.6 KB',
      1,
      true,
      NOW()
    ),
    (
      'DOC-IT-80G',
      'Income Tax Section 80G Provisional Approval Order (Form 10AC - 50% Tax Exemption)',
      'आयकर विभाग धारा 80G अनुमोदन आदेश (प्रपत्र 10AC - दानदाताओं हेतु 50% कर छूट)',
      'Tax Exemption & Approvals',
      'कर छूट एवं शासकीय स्वीकृतियां',
      'URN: AAGCJ3046CF20241',
      'Income Tax Department, Govt. of India',
      'Provisional approval order under section 80G(5)(iv) of the Income Tax Act, 1961 granting 50% income tax exemption to donors. Assessment Years: 2024-25 to 2026-2027.',
      'आयकर अधिनियम 1961 की धारा 80G(5) के तहत दानदाताओं हेतु 50% कर कटौती की वैधानिक स्वीकृति। प्रभाव: निर्धारण वर्ष 2024-25 से 2026-27।',
      '/downloads/form_10ac_80g_and_12a_approval.pdf',
      '/downloads/form_10ac_80g_and_12a_approval.pdf',
      'PDF',
      '440.5 KB',
      2,
      true,
      NOW()
    ),
    (
      'DOC-IT-12A',
      'Income Tax Section 12A Provisional Registration Order (Form 10AC - Charitable Entity)',
      'आयकर विभाग धारा 12A पंजीकरण आदेश (प्रपत्र 10AC - धर्मार्थ संस्था)',
      'Tax Exemption & Approvals',
      'कर छूट एवं शासकीय स्वीकृतियां',
      'URN: AAGCJ3046CE20231',
      'Income Tax Department, Govt. of India',
      'Provisional registration order under Section 12A(1)(ac)(vi) of the Income Tax Act, 1961 granting tax-exempt status to Jankalyan Manavadhikar Foundation for charitable education work.',
      'आयकर अधिनियम 1961 की धारा 12A(1)(ac)(vi) के तहत धर्मार्थ शैक्षणिक गतिविधियों हेतु कर-मुक्त संस्था के रूप में पंजीकरण आदेश। प्रभाव: निर्धारण वर्ष 2024-25 से 2026-27।',
      '/downloads/form_10ac_80g_and_12a_approval.pdf',
      '/downloads/form_10ac_80g_and_12a_approval.pdf',
      'PDF',
      '440.5 KB',
      3,
      true,
      NOW()
    ),
    (
      'DOC-IT-PAN',
      'Permanent Account Number (PAN) & TAN Official Card (Govt. of India)',
      'आयकर विभाग स्थायी खाता संख्या (PAN) एवं TAN कार्ड (भारत सरकार)',
      'Institutional Identity & KYC',
      'संस्थागत पहचान एवं केवाईसी',
      'PAN: AAGCJ3046C | TAN: JBPJ03720D',
      'Income Tax Department (NSDL / Protean eGov)',
      'Digitally certified Permanent Account Number (PAN) and Tax Deduction and Collection Account Number (TAN) issued by the Income Tax Department.',
      'आयकर विभाग भारत सरकार द्वारा जारी डिजिटल हस्ताक्षरित ई-पैन कार्ड (PAN: AAGCJ3046C) एवं टैन विवरण (TAN: JBPJ03720D)।',
      '/downloads/pan_card_jankalyan_foundation.jpg',
      '/downloads/pan_card_jankalyan_foundation.jpg',
      'JPG',
      '106.7 KB',
      4,
      true,
      NOW()
    ),
    (
      'DOC-LEI-GLOBAL',
      'Global Legal Entity Identifier (LEI) Certificate (RBI Guidelines Compliant)',
      'वैश्विक लीगल एंटिटी आइडेंटिफायर (LEI) प्रमाण पत्र (आरबीआई अनुपालन)',
      'Banking & Financial Compliance',
      'बैंकिंग एवं वित्तीय अनुपालन',
      'LEI: 391200G440EGSOONQG84',
      'Global LEI Foundation (GLEIF) / LEI Register India',
      'International 20-character Legal Entity Identifier code ensuring banking compliance, institutional transparency and verification under RBI guidelines. Valid through 2027-04-28.',
      'भारतीय रिज़र्व बैंक (RBI) दिशा-निर्देशों के अनुरूप संस्थागत पारदर्शिता, वैश्विक वित्तीय पहचान एवं बैंकिंग सत्यापन हेतु 20-अंकीय LEI कोड। अगली नवीनीकरण तिथि: 28-04-2027।',
      '/downloads/lei_certificate_jankalyan.jpg',
      '/downloads/lei_certificate_jankalyan.jpg',
      'JPG',
      '91.5 KB',
      5,
      true,
      NOW()
    ),
    (
      'DOC-MCA-CERTIFIED',
      'Digitally Verified MCA Incorporation Certificate (*.mca.gov.in Sealed)',
      'डिजिटल सत्यापित कॉर्पोरेट निगमन प्रमाण पत्र (*.mca.gov.in अधिकृत)',
      'Legal & Statutory Registrations',
      'वैधानिक पंजीकरण एवं प्रमाण पत्र',
      'CIN: U85500MP2024NPL069532',
      'Registrar of Companies, Central Registration Centre',
      'Certified authentic copy bearing the verified digital signature of Sheetal Kumari, Assistant Registrar of Companies, CRC Manesar and official Government of India emblem.',
      'सहायक कंपनी रजिस्ट्रार द्वारा डिजिटल रूप से हस्ताक्षरित एवं कॉर्पोरेट कार्य मंत्रालय के आधिकारिक पोर्टल (*.mca.gov.in) से सत्यापित प्रति।',
      '/downloads/mca_incorporation_certified_copy.jpg',
      '/downloads/mca_incorporation_certified_copy.jpg',
      'JPG',
      '147.8 KB',
      6,
      true,
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      title_en = EXCLUDED.title_en,
      title_hi = EXCLUDED.title_hi,
      category_en = EXCLUDED.category_en,
      category_hi = EXCLUDED.category_hi,
      doc_number = EXCLUDED.doc_number,
      authority = EXCLUDED.authority,
      description_en = EXCLUDED.description_en,
      description_hi = EXCLUDED.description_hi,
      file_url = EXCLUDED.file_url,
      preview_image_url = EXCLUDED.preview_image_url,
      format = EXCLUDED.format,
      size_display = EXCLUDED.size_display,
      display_order = EXCLUDED.display_order,
      is_active = true,
      updated_at = NOW();
  `);
  console.log('Official documents upserted successfully.');

  console.log('4. Verifying stored downloads:');
  const result = await runSql(`
    SELECT id, display_order, title_en, doc_number, category_en, format, size_display, file_url
    FROM public.downloads 
    ORDER BY display_order ASC;
  `);
  console.table(result);
}

main().catch(console.error);
