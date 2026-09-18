import { supabase } from '../api/supabase.js';

export function toIsoDate(str) {
  if (!str) return null;
  const trimmed = String(str).trim().split('T')[0];
  const parts = trimmed.split(/[/.-]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
    if (parts[2].length === 4) return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
  }
  return trimmed;
}

export function toDisplayDate(str) {
  if (!str) return '';
  const trimmed = String(str).trim().split('T')[0];
  const parts = trimmed.split(/[/.-]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[0]}`;
    if (parts[2].length === 4) return `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[2]}`;
  }
  return trimmed;
}

export const OFFICIAL_DEFAULT_DOWNLOADS = [
  {
    id: 'DOC-SCHOLARSHIP-FORM',
    title_en: 'National Scholarship Yojna 2026-27 : Official Prescribed Application Form',
    title_hi: 'राष्ट्रीय छात्रवृत्ति योजना 2026-27 : आधिकारिक विहित आवेदन प्रपत्र (डिजिटल व ऑफलाइन)',
    category_en: 'Scholarship Application Forms',
    category_hi: 'छात्रवृत्ति आवेदन प्रपत्र',
    doc_number: 'FORM NO: JMF-SCH-2026',
    authority: 'Jankalyan Manavadhikar Foundation (Regd. Under Section 8 MCA)',
    description_en: 'Official scholarship application form for Class 5th to PG & Diploma students. Fill directly through online digital portal or download high-resolution printable PDF for offline submission.',
    description_hi: 'कक्षा 5वीं से स्नातकोत्तर (PG) एवं डिप्लोमा विद्यार्थियों हेतु अधिकृत छात्रवृत्ति आवेदन प्रपत्र। सीधे ऑनलाइन भरें अथवा मुद्रण (प्रिंट) एवं ऑफलाइन जमा करने हेतु मूल PDF डाउनलोड करें।',
    file_url: '/downloads/scholarship_application_form_2026_27.pdf',
    preview_image_url: '/downloads/scholarship_application_form_page_1.png',
    preview_image_page2_url: '/downloads/scholarship_application_form_page_2.png',
    format: 'PDF',
    size_display: '6.8 KB (Vector PDF) / Printable A4',
    display_order: 0,
    is_active: true,
    is_form: true,
    online_apply_route: '/apply'
  },
  {
    id: 'DOC-MCA-COI',
    title_en: 'Ministry of Corporate Affairs - Certificate of Incorporation (Section 8 Non-Profit)',
    title_hi: 'भारत सरकार कॉर्पोरेट कार्य मंत्रालय - कंपनी निगमन प्रमाण पत्र (धारा 8 एनजीओ)',
    category_en: 'Legal & Statutory Registrations',
    category_hi: 'वैधानिक पंजीकरण एवं प्रमाण पत्र',
    doc_number: 'CIN: U85500MP2024NPL069532',
    authority: 'Ministry of Corporate Affairs, Govt. of India',
    description_en: 'Certificate of Incorporation issued under Section 8(1) of the Companies Act, 2013 by the Central Registration Centre, Manesar. Registered office at Dixit Colony, Jabalpur, Madhya Pradesh.',
    description_hi: 'कंपनी अधिनियम 2013 की धारा 8(1) के अंतर्गत केंद्रीय पंजीकरण केंद्र (CRC मानेसर) द्वारा जारी वैधानिक निगमन प्रमाण पत्र। पंजीकृत कार्यालय: दीक्षित कॉलोनी, जबलपुर (म.प्र.)।',
    file_url: '/downloads/mca_certificate_of_incorporation.pdf',
    preview_image_url: '/downloads/mca_certificate_of_incorporation_page_1.png',
    format: 'PDF',
    size_display: '72.6 KB',
    display_order: 1,
    is_active: true
  },
  {
    id: 'DOC-IT-80G',
    title_en: 'Income Tax Section 80G Provisional Approval Order (Form 10AC - 50% Tax Exemption)',
    title_hi: 'आयकर विभाग धारा 80G अनुमोदन आदेश (प्रपत्र 10AC - दानदाताओं हेतु 50% कर छूट)',
    category_en: 'Tax Exemption & Approvals',
    category_hi: 'कर छूट एवं शासकीय स्वीकृतियां',
    doc_number: 'URN: AAGCJ3046CF20241',
    authority: 'Income Tax Department, Govt. of India',
    description_en: 'Provisional approval order under section 80G(5)(iv) of the Income Tax Act, 1961 granting 50% income tax exemption to donors. Assessment Years: 2024-25 to 2026-2027.',
    description_hi: 'आयकर अधिनियम 1961 की धारा 80G(5) के तहत दानदाताओं हेतु 50% कर कटौती की वैधानिक स्वीकृति। प्रभाव: निर्धारण वर्ष 2024-25 से 2026-27।',
    file_url: '/downloads/form_10ac_80g_and_12a_approval.pdf',
    preview_image_url: '/downloads/form_10ac_80g_and_12a_approval_page_1.png',
    format: 'PDF',
    size_display: '440.5 KB',
    display_order: 2,
    is_active: true
  },
  {
    id: 'DOC-IT-12A',
    title_en: 'Income Tax Section 12A Provisional Registration Order (Form 10AC - Charitable Entity)',
    title_hi: 'आयकर विभाग धारा 12A पंजीकरण आदेश (प्रपत्र 10AC - धर्मार्थ संस्था)',
    category_en: 'Tax Exemption & Approvals',
    category_hi: 'कर छूट एवं शासकीय स्वीकृतियां',
    doc_number: 'URN: AAGCJ3046CE20231',
    authority: 'Income Tax Department, Govt. of India',
    description_en: 'Provisional registration order under Section 12A(1)(ac)(vi) of the Income Tax Act, 1961 granting tax-exempt status to Jankalyan Manavadhikar Foundation for charitable education work.',
    description_hi: 'आयकर अधिनियम 1961 की धारा 12A(1)(ac)(vi) के तहत धर्मार्थ शैक्षणिक गतिविधियों हेतु कर-मुक्त संस्था के रूप में पंजीकरण आदेश। प्रभाव: निर्धारण वर्ष 2024-25 से 2026-27।',
    file_url: '/downloads/form_10ac_80g_and_12a_approval.pdf',
    preview_image_url: '/downloads/form_10ac_80g_and_12a_approval_page_2.png',
    format: 'PDF',
    size_display: '440.5 KB',
    display_order: 3,
    is_active: true
  },
  {
    id: 'DOC-IT-PAN',
    title_en: 'Permanent Account Number (PAN) & TAN Official Card (Govt. of India)',
    title_hi: 'आयकर विभाग स्थायी खाता संख्या (PAN) एवं TAN कार्ड (भारत सरकार)',
    category_en: 'Institutional Identity & KYC',
    category_hi: 'संस्थागत पहचान एवं केवाईसी',
    doc_number: 'PAN: AAGCJ3046C | TAN: JBPJ03720D',
    authority: 'Income Tax Department (NSDL / Protean eGov)',
    description_en: 'Digitally certified Permanent Account Number (PAN) and Tax Deduction and Collection Account Number (TAN) issued by the Income Tax Department.',
    description_hi: 'आयकर विभाग भारत सरकार द्वारा जारी डिजिटल हस्ताक्षरित ई-पैन कार्ड (PAN: AAGCJ3046C) एवं टैन विवरण (TAN: JBPJ03720D)।',
    file_url: '/downloads/pan_card_jankalyan_foundation.jpg',
    preview_image_url: '/downloads/pan_card_jankalyan_foundation.jpg',
    format: 'JPG',
    size_display: '106.7 KB',
    display_order: 4,
    is_active: true
  },
  {
    id: 'DOC-LEI-GLOBAL',
    title_en: 'Global Legal Entity Identifier (LEI) Certificate (RBI Guidelines Compliant)',
    title_hi: 'वैश्विक लीगल एंटिटी आइडेंटिफायर (LEI) प्रमाण पत्र (आरबीआई अनुपालन)',
    category_en: 'Banking & Financial Compliance',
    category_hi: 'बैंकिंग एवं वित्तीय अनुपालन',
    doc_number: 'LEI: 391200G440EGSOONQG84',
    authority: 'Global LEI Foundation (GLEIF) / LEI Register India',
    description_en: 'International 20-character Legal Entity Identifier code ensuring banking compliance, institutional transparency and verification under RBI guidelines. Valid through 2027-04-28.',
    description_hi: 'भारतीय रिज़र्व बैंक (RBI) दिशा-निर्देशों के अनुरूप संस्थागत पारदर्शिता, वैश्विक वित्तीय पहचान एवं बैंकिंग सत्यापन हेतु 20-अंकीय LEI कोड। अगली नवीनीकरण तिथि: 28-04-2027।',
    file_url: '/downloads/lei_certificate_jankalyan.jpg',
    preview_image_url: '/downloads/lei_certificate_jankalyan.jpg',
    format: 'JPG',
    size_display: '91.5 KB',
    display_order: 5,
    is_active: true
  },
  {
    id: 'DOC-MCA-CERTIFIED',
    title_en: 'Digitally Verified MCA Incorporation Certificate (*.mca.gov.in Sealed)',
    title_hi: 'डिजिटल सत्यापित कॉर्पोरेट निगमन प्रमाण पत्र (*.mca.gov.in अधिकृत)',
    category_en: 'Legal & Statutory Registrations',
    category_hi: 'वैधानिक पंजीकरण एवं प्रमाण पत्र',
    doc_number: 'CIN: U85500MP2024NPL069532',
    authority: 'Registrar of Companies, Central Registration Centre',
    description_en: 'Certified authentic copy bearing the verified digital signature of Sheetal Kumari, Assistant Registrar of Companies, CRC Manesar and official Government of India emblem.',
    description_hi: 'सहायक कंपनी रजिस्ट्रार द्वारा डिजिटल रूप से हस्ताक्षरित एवं कॉर्पोरेट कार्य मंत्रालय के आधिकारिक पोर्टल (*.mca.gov.in) से सत्यापित प्रति।',
    file_url: '/downloads/mca_incorporation_certified_copy.jpg',
    preview_image_url: '/downloads/mca_incorporation_certified_copy.jpg',
    format: 'JPG',
    size_display: '147.8 KB',
    display_order: 6,
    is_active: true
  }
];

const CMS_CACHE_KEY = 'jmf_cms_public_cache_v4';
const CMS_CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache to avoid wasteful Supabase egress

export const cmsService = {
  /**
   * Clear local CMS cache on edits
   */
  clearCmsCache() {
    try {
      sessionStorage.removeItem(CMS_CACHE_KEY);
    } catch (e) {}
  },

  /**
   * Fetch complete consolidated CMS dataset for public pages and fallback
   * Uses 10-minute sessionStorage caching to drastically reduce Supabase network egress
   */
  async getPublicCmsData(forceRefresh = false) {
    if (!forceRefresh) {
      try {
        const cached = sessionStorage.getItem(CMS_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && (Date.now() - parsed.timestamp < CMS_CACHE_TTL) && parsed.data) {
            return parsed.data;
          }
        }
      } catch (e) {}
    }

    try {
      const [
        schemesRes,
        allSchemesRes,
        settingsRes,
        slidesRes,
        announcementsRes,
        noticesRes,
        faqsRes,
        teamRes,
        downloadsRes
      ] = await Promise.all([
        supabase.from('scholarship_schemes').select('*').eq('id', 'd0000000-0000-0000-0000-000000000001').maybeSingle(),
        supabase.from('scholarship_schemes').select('*').neq('id', 'd0000000-0000-0000-0000-000000000001').order('grant_amount', { ascending: true }),
        supabase.from('system_settings').select('*'),
        supabase.from('hero_slides').select('*').order('display_order', { ascending: true }),
        supabase.from('announcements').select('*').eq('is_active', true).order('display_order', { ascending: true }),
        supabase.from('notices').select('*').eq('is_published', true).order('is_pinned', { ascending: false }).order('publish_date', { ascending: false }),
        supabase.from('faqs').select('*').eq('is_active', true).order('display_order', { ascending: true }),
        supabase.from('team_members').select('*').eq('is_active', true).order('display_order', { ascending: true }),
        supabase.from('downloads').select('*').eq('is_active', true).order('display_order', { ascending: true })
      ]);

      const settingsMap = {};
      (settingsRes.data || []).forEach(s => {
        settingsMap[s.key] = s.value;
      });

      const portalConfig = settingsMap.portal_config || {};
      const activeScheme = schemesRes.data || {};

      const rawStartDate = settingsMap.applicationStartDate || activeScheme.application_start_date || '2026-09-15';
      const rawEndDate = settingsMap.applicationClosingDate || activeScheme.application_end_date || '2026-11-30';

      const allSchemesList = allSchemesRes.data || [];
      const dynamicSlabs = allSchemesList.length > 0 ? allSchemesList.map((sch, i) => ({
        id: `slab-${i + 1}`,
        schemeId: sch.id,
        classes: sch.name.split(' (')[0],
        titleHi: sch.name.includes('(') ? sch.name.split('(')[1].replace(')', '') : sch.name,
        titleEn: sch.name.split(' (')[0],
        amount: Number(sch.grant_amount),
        amountDisplay: sch.grant_amount_display || `₹${Number(sch.grant_amount).toLocaleString('en-IN')}/-`,
        period: 'वार्षिक / Yearly',
        eligibleDesc: sch.eligibility_overview || sch.description
      })) : null;

      const displayAmount = settingsMap.grantAmountDisplay || 
        activeScheme.grant_amount_display || 
        (settingsMap.grantAmount ? `₹${Number(settingsMap.grantAmount).toLocaleString('en-IN')}/- Yearly` : '₹4,000/- to ₹22,000/- Yearly');

      const result = {
        scholarshipAmount: displayAmount,
        grantAmountRaw: activeScheme.grant_amount || (settingsMap.grantAmount ? Number(settingsMap.grantAmount) : 22000),
        registrationFee: portalConfig.registration_fee || (settingsMap.registrationFeeAmount ? `₹ ${Number(settingsMap.registrationFeeAmount).toFixed(2)}/-` : '₹ 1.00/-'),
        registrationFeeAmount: settingsMap.registrationFeeAmount ? Number(settingsMap.registrationFeeAmount) : 1.00,
        registrationFeeNote: `₹ ${Number(settingsMap.registrationFeeAmount || 1).toFixed(2)}/- (केवल आवेदन प्रक्रिया हेतु)`,
        applicationStartDate: toDisplayDate(rawStartDate) || '15/09/2026',
        applicationLastDate: toDisplayDate(rawEndDate) || '30/11/2026',
        eligibilityCriteria: settingsMap.eligibilityCriteria || activeScheme.eligibility_overview || 'Class 5th to Post Graduation students with min 50% marks in Graduation and family income up to ₹2,50,000.',
        academicYear: settingsMap.academicSession || activeScheme.academic_year || '2026-27',
        schemeId: activeScheme.id || 'd0000000-0000-0000-0000-000000000001',
        
        // Contacts & Org
        officeAddress: settingsMap.officeAddress || portalConfig.office_address || 'Ward No. 30, Shri Ram College Road, Dixit Colony, Jabalpur, Pin Code: 482002',
        registrationDetails: settingsMap.registrationDetails || portalConfig.registration_number || 'JMF/MP/NGO/2026/894',
        officialEmail: settingsMap.officialEmail || portalConfig.official_email || 'jankalyanmanavadhikar@gmail.com',
        officialMobile: settingsMap.officialMobile || portalConfig.helpline_mobile || '8871557054',
        officialTelephone: settingsMap.officialTelephone || portalConfig.helpline_telephone || '0761-4500054',
        helplineHours: portalConfig.helpline_hours || 'सुबह 10:00 बजे से शाम 7:00 बजे तक (10:00 AM – 07:00 PM)',
        officialWebsite: 'https://jankalyanmanavadhikar.in',
        
        // Structured CMS lists
        heroSlides: slidesRes.data || [],
        announcements: announcementsRes.data || [],
        notices: noticesRes.data || [],
        faqs: faqsRes.data || [],
        teamMembers: teamRes.data || [],
        downloads: (downloadsRes.data && downloadsRes.data.length > 0) ? downloadsRes.data : OFFICIAL_DEFAULT_DOWNLOADS,
        schemes: allSchemesList,
        ...(dynamicSlabs ? { scholarshipSlabs: dynamicSlabs } : {}),
        statsDisplayConfig: settingsMap.stats_display_config || {}
      };

      try {
        sessionStorage.setItem(CMS_CACHE_KEY, JSON.stringify({
          timestamp: Date.now(),
          data: result
        }));
      } catch (e) {}

      return result;
    } catch (err) {
      console.warn('Error loading live CMS from Supabase, using defaults:', err);
      return {
        downloads: OFFICIAL_DEFAULT_DOWNLOADS
      };
    }
  },

  /**
   * Update Scholarship Scheme Details (Amount, Dates, Eligibility)
   */
  async updateSchemeSettings(schemeId, fields) {
    const updatePayload = {
      updated_at: new Date().toISOString()
    };
    if (fields.grant_amount !== undefined) updatePayload.grant_amount = fields.grant_amount;
    if (fields.grant_amount_display !== undefined) updatePayload.grant_amount_display = fields.grant_amount_display;
    if (fields.application_start_date !== undefined) updatePayload.application_start_date = toIsoDate(fields.application_start_date);
    if (fields.application_end_date !== undefined) updatePayload.application_end_date = toIsoDate(fields.application_end_date);
    if (fields.eligibility_overview !== undefined) updatePayload.eligibility_overview = fields.eligibility_overview;

    const { data, error } = await supabase
      .from('scholarship_schemes')
      .update(updatePayload)
      .eq('id', schemeId)
      .select()
      .maybeSingle();

    if (error) throw error;
    this.clearCmsCache();
    return data;
  },

  /**
   * Batch update System Settings key-value pairs
   */
  async updateSystemSettings(settingsObj) {
    const map = new Map();

    if (Array.isArray(settingsObj)) {
      for (const item of settingsObj) {
        if (item && item.key) {
          map.set(item.key, {
            key: item.key,
            value: item.value,
            is_public: item.is_public ?? true,
            updated_at: new Date().toISOString()
          });
        }
      }
    } else if (settingsObj && typeof settingsObj === 'object') {
      for (const [key, value] of Object.entries(settingsObj)) {
        if (value !== undefined) {
          map.set(key, {
            key,
            value,
            is_public: true,
            updated_at: new Date().toISOString()
          });
        }
      }
    }

    const entries = Array.from(map.values());
    if (entries.length === 0) return true;

    const { data, error } = await supabase
      .from('system_settings')
      .upsert(entries, { onConflict: 'key' });

    if (error) throw error;
    this.clearCmsCache();
    return data;
  },

  /**
   * Update Portal Settings (Contacts, Registration, Address)
   */
  async updatePortalConfig(configObj) {
    if (configObj.office_address) {
      await supabase.from('system_settings').upsert({
        key: 'officeAddress',
        value: configObj.office_address,
        updated_at: new Date().toISOString()
      });
    }
    const { data, error } = await supabase
      .from('system_settings')
      .upsert({
        key: 'portal_config',
        value: configObj,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    this.clearCmsCache();
    return data;
  },

  // ---------------- HERO SLIDES CRUD ----------------
  async getHeroSlides() {
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data;
  },

  async updateHeroSlides(slides) {
    if (!Array.isArray(slides) || slides.length === 0) return true;

    const results = [];
    for (let i = 0; i < slides.length; i++) {
      const s = slides[i];
      if (!s.id) continue;

      const payload = {
        image_url: s.image_url || s.image,
        slide_duration_ms: s.slide_duration_ms || 3000,
        heading_en: s.heading_en ?? '',
        heading_hi: s.heading_hi ?? '',
        is_active: s.is_active !== false,
        display_order: s.display_order || (i + 1),
        updated_at: new Date().toISOString()
      };
      if (s.eyebrow_en !== undefined) payload.eyebrow_en = s.eyebrow_en;
      if (s.eyebrow_hi !== undefined) payload.eyebrow_hi = s.eyebrow_hi;
      if (s.description_en !== undefined) payload.description_en = s.description_en;
      if (s.description_hi !== undefined) payload.description_hi = s.description_hi;

      const { data, error } = await supabase
        .from('hero_slides')
        .update(payload)
        .eq('id', s.id)
        .select();

      if (error) console.warn('Could not update slide ' + s.id + ':', error);
      else results.push(data);
    }
    return results;
  },

  async createHeroSlide(slide) {
    const { data, error } = await supabase
      .from('hero_slides')
      .insert(slide)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateHeroSlide(id, slide) {
    const { data, error } = await supabase
      .from('hero_slides')
      .update({ ...slide, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteHeroSlide(id) {
    const { error } = await supabase
      .from('hero_slides')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  // ---------------- ANNOUNCEMENTS CRUD ----------------
  async updateAnnouncements(announcements) {
    if (!Array.isArray(announcements) || announcements.length === 0) return true;

    for (let i = 0; i < announcements.length; i++) {
      const a = announcements[i];
      const textEn = a.en || a.text_en;
      const textHi = a.hi || a.text_hi;
      if (!textEn && !textHi) continue;

      if (a.id && typeof a.id === 'string' && a.id.length > 10) {
        await supabase
          .from('announcements')
          .update({
            text_en: textEn,
            text_hi: textHi,
            updated_at: new Date().toISOString()
          })
          .eq('id', a.id);
      } else {
        const { data: existing } = await supabase
          .from('announcements')
          .select('id')
          .order('display_order', { ascending: true })
          .limit(1);

        if (existing && existing.length > 0) {
          await supabase
            .from('announcements')
            .update({
              text_en: textEn,
              text_hi: textHi,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing[0].id);
        }
      }
    }
    return true;
  },

  // ---------------- NOTICES CRUD ----------------
  async getNotices() {
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('publish_date', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createNotice(notice) {
    const id = notice.id && String(notice.id).trim() !== '' ? notice.id : `NOT-2026-${Math.floor(10 + Math.random() * 90)}`;
    const payload = {
      id,
      title_en: notice.title_en || notice.titleEn || '',
      title_hi: notice.title_hi || notice.titleHi || '',
      category_en: notice.category_en || notice.categoryEn || 'Guidelines',
      category_hi: notice.category_hi || notice.categoryHi || 'दिशानिर्देश',
      content_en: notice.content_en || notice.contentEn || '',
      content_hi: notice.content_hi || notice.contentHi || '',
      publish_date: notice.publish_date || notice.date || new Date().toISOString().split('T')[0],
      priority: notice.priority || 'NORMAL',
      is_pinned: notice.is_pinned ?? notice.isPinned ?? false,
      is_published: notice.is_published ?? notice.isPublished ?? true,
      updated_at: new Date().toISOString()
    };
    if (notice.attachment_url) payload.attachment_url = notice.attachment_url;

    const { data, error } = await supabase
      .from('notices')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateNotice(id, notice) {
    const payload = {
      updated_at: new Date().toISOString()
    };
    if (notice.title_en !== undefined || notice.titleEn !== undefined) payload.title_en = notice.title_en ?? notice.titleEn;
    if (notice.title_hi !== undefined || notice.titleHi !== undefined) payload.title_hi = notice.title_hi ?? notice.titleHi;
    if (notice.category_en !== undefined || notice.categoryEn !== undefined) payload.category_en = notice.category_en ?? notice.categoryEn;
    if (notice.category_hi !== undefined || notice.categoryHi !== undefined) payload.category_hi = notice.category_hi ?? notice.categoryHi;
    if (notice.content_en !== undefined || notice.contentEn !== undefined) payload.content_en = notice.content_en ?? notice.contentEn;
    if (notice.content_hi !== undefined || notice.contentHi !== undefined) payload.content_hi = notice.content_hi ?? notice.contentHi;
    if (notice.publish_date !== undefined || notice.date !== undefined) payload.publish_date = notice.publish_date ?? notice.date;
    if (notice.priority !== undefined) payload.priority = notice.priority;
    if (notice.is_pinned !== undefined || notice.isPinned !== undefined) payload.is_pinned = notice.is_pinned ?? notice.isPinned;
    if (notice.is_published !== undefined || notice.isPublished !== undefined) payload.is_published = notice.is_published ?? notice.isPublished;
    if (notice.attachment_url !== undefined) payload.attachment_url = notice.attachment_url;

    const { data, error } = await supabase
      .from('notices')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteNotice(id) {
    const { error } = await supabase.from('notices').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // ---------------- FAQS CRUD ----------------
  async getFaqs() {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data;
  },

  async createFaq(faq) {
    const id = faq.id || `FAQ-${Math.floor(10 + Math.random() * 90)}`;
    const { data, error } = await supabase
      .from('faqs')
      .insert({ ...faq, id })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateFaq(id, faq) {
    const { data, error } = await supabase
      .from('faqs')
      .update({ ...faq, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteFaq(id) {
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // ---------------- DOWNLOADS CRUD ----------------
  async getDownloads() {
    const { data, error } = await supabase
      .from('downloads')
      .select('*')
      .order('id', { ascending: true });
    if (error) throw error;
    return data;
  },

  async createDownload(dl) {
    const id = dl.id || `DL-${Math.floor(10 + Math.random() * 90)}`;
    const { data, error } = await supabase
      .from('downloads')
      .insert({ ...dl, id })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateDownload(id, dl) {
    const { data, error } = await supabase
      .from('downloads')
      .update({ ...dl, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteDownload(id) {
    const { error } = await supabase.from('downloads').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // ---------------- TEAM MEMBERS CRUD ----------------
  async getTeamMembers() {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data;
  },

  async createTeamMember(member) {
    const { data, error } = await supabase
      .from('team_members')
      .insert(member)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateTeamMember(id, member) {
    const { data, error } = await supabase
      .from('team_members')
      .update({ ...member, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteTeamMember(id) {
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // ---------------- CONTACT INQUIRIES ----------------
  async submitContactInquiry(inquiry) {
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert({
        name: inquiry.name,
        mobile: inquiry.mobile,
        email: inquiry.email,
        subject: inquiry.subject,
        message: inquiry.message
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getContactSubmissions() {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // ---------------- DOWNLOADS & OFFICIAL FORMS CRUD ----------------
  async getDownloads() {
    const { data, error } = await supabase
      .from('downloads')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) {
      console.warn('Error fetching downloads from Supabase, returning fallback:', error);
      return OFFICIAL_DEFAULT_DOWNLOADS;
    }
    return (data && data.length > 0) ? data : OFFICIAL_DEFAULT_DOWNLOADS;
  },

  async createDownload(item) {
    const { data, error } = await supabase
      .from('downloads')
      .insert({
        ...item,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateDownload(id, item) {
    const { data, error } = await supabase
      .from('downloads')
      .update({ ...item, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteDownload(id) {
    const { error } = await supabase.from('downloads').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};
