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

export const cmsService = {
  /**
   * Fetch complete consolidated CMS dataset for public pages and fallback
   */
  async getPublicCmsData() {
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
        supabase.from('downloads').select('*').eq('is_active', true).order('id', { ascending: true })
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

      return {
        scholarshipAmount: displayAmount,
        grantAmountRaw: activeScheme.grant_amount || (settingsMap.grantAmount ? Number(settingsMap.grantAmount) : 22000),
        registrationFee: portalConfig.registration_fee || (settingsMap.registrationFeeAmount ? `₹ ${Number(settingsMap.registrationFeeAmount).toFixed(2)}/-` : '₹ 211.30/-'),
        registrationFeeNote: '₹ 211.30/- (केवल आवेदन प्रक्रिया हेतु)',
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
        downloads: downloadsRes.data || [],
        schemes: allSchemesList,
        ...(dynamicSlabs ? { scholarshipSlabs: dynamicSlabs } : {}),
        statsDisplayConfig: settingsMap.stats_display_config || {}
      };
    } catch (err) {
      console.warn('Error loading live CMS from Supabase, using defaults:', err);
      return null;
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
    return data;
  },

  /**
   * Batch update System Settings key-value pairs
   */
  async updateSystemSettings(settingsObj) {
    const entries = [];
    for (const [key, value] of Object.entries(settingsObj)) {
      if (value !== undefined) {
        entries.push({
          key,
          value,
          is_public: true,
          updated_at: new Date().toISOString()
        });
      }
    }

    if (entries.length === 0) return true;

    const { data, error } = await supabase
      .from('system_settings')
      .upsert(entries, { onConflict: 'key' });

    if (error) throw error;
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
  }
};
