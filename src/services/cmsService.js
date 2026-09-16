import { supabase } from '../api/supabase';

export const cmsService = {
  /**
   * Fetch complete consolidated CMS dataset for public pages and fallback
   */
  async getPublicCmsData() {
    try {
      const [
        schemesRes,
        settingsRes,
        slidesRes,
        announcementsRes,
        noticesRes,
        faqsRes,
        teamRes,
        downloadsRes
      ] = await Promise.all([
        supabase.from('scholarship_schemes').select('*').eq('is_active', true).limit(1).single(),
        supabase.from('system_settings').select('*'),
        supabase.from('hero_slides').select('*').eq('is_active', true).order('display_order', { ascending: true }),
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

      return {
        scholarshipAmount: activeScheme.grant_amount_display || settingsMap.grantAmountDisplay || '₹4,000/- to ₹22,000/- Yearly',
        grantAmountRaw: activeScheme.grant_amount || 22000,
        registrationFee: portalConfig.registration_fee || '₹ 211.30/-',
        registrationFeeNote: '₹ 211.30/- (केवल आवेदन प्रक्रिया हेतु)',
        applicationStartDate: settingsMap.applicationStartDate || (activeScheme.application_start_date === '2026-09-15' ? '15/09/2026' : activeScheme.application_start_date) || '15/09/2026',
        applicationLastDate: settingsMap.applicationClosingDate || (activeScheme.application_end_date === '2026-11-30' ? '30 November 2026' : activeScheme.application_end_date) || '30 November 2026',
        eligibilityCriteria: activeScheme.eligibility_overview || 'Class 5th to Post Graduation & Diploma Courses in recognized institutions.',
        academicYear: activeScheme.academic_year || '2026-27',
        schemeId: activeScheme.id,
        
        // Contacts & Org
        officeAddress: settingsMap.officeAddress || portalConfig.office_address || 'Ward No. 30, Shri Ram College Road, Dixit Colony, Jabalpur, Pin Code: 482002',
        registrationDetails: portalConfig.registration_number || 'JMF/MP/NGO/2026/894',
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
    const { data, error } = await supabase
      .from('scholarship_schemes')
      .update({
        grant_amount: fields.grant_amount,
        grant_amount_display: fields.grant_amount_display,
        application_start_date: fields.application_start_date,
        application_end_date: fields.application_end_date,
        eligibility_overview: fields.eligibility_overview,
        updated_at: new Date().toISOString()
      })
      .eq('id', schemeId)
      .select()
      .single();

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
    const id = notice.id || `NOT-2026-${Math.floor(10 + Math.random() * 90)}`;
    const { data, error } = await supabase
      .from('notices')
      .insert({ ...notice, id })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateNotice(id, notice) {
    const { data, error } = await supabase
      .from('notices')
      .update({ ...notice, updated_at: new Date().toISOString() })
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
