import { supabase } from '../api/supabase.js';

export const certificateService = {
  /**
   * Issue official digital scholarship award certificate (supports installments)
   */
  async issueCertificate({ 
    applicationId, 
    studentName, 
    schemeName = null, 
    grantAmount = 12000, 
    installmentNumber = null,
    utrNumber = null,
    paymentDate = null
  }) {
    const formattedScheme = schemeName || (
      installmentNumber 
        ? `Jankalyan Manavadhikar Foundation Scholarship Scheme 2026-27 (Installment #${installmentNumber})` 
        : 'Jankalyan Manavadhikar Foundation Scholarship Scheme 2026-27'
    );

    const certNumber = installmentNumber
      ? `CERT-JMF-2026-INST${installmentNumber}-${Math.floor(1000 + Math.random() * 9000)}`
      : `CERT-JMF-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const { data, error } = await supabase
      .from('certificates')
      .insert({
        certificate_number: certNumber,
        application_id: applicationId,
        student_name: studentName,
        scheme_name: formattedScheme,
        grant_amount: grantAmount,
        issue_date: paymentDate || new Date().toISOString().split('T')[0]
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get certificate by verification token for public QR scanning
   */
  async getCertificateByToken(token) {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('verification_token', token)
      .maybeSingle();

    if (error) return null;
    return data;
  },

  /**
   * Get certificate by certificate ID
   */
  async getCertificateById(id) {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) return null;
    return data;
  },

  /**
   * Get latest certificate by application ID
   */
  async getCertificateByAppId(appId) {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('application_id', appId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) return null;
    return data;
  },

  /**
   * Get all certificates for an application (e.g. for multi-installment payouts)
   */
  async getCertificatesByAppId(appId) {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('application_id', appId)
      .order('created_at', { ascending: true });

    if (error) return [];
    return data || [];
  },

  /**
   * Get all issued certificates for admin management
   */
  async getCertificates() {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};
