import { supabase } from '../api/supabase';

export const certificateService = {
  /**
   * Issue official digital scholarship award certificate
   */
  async issueCertificate({ applicationId, studentName, schemeName = 'JMF Scholarship Yojna 2026-27', grantAmount = 12000 }) {
    const certNumber = `CERT-JMF-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const { data, error } = await supabase
      .from('certificates')
      .insert({
        certificate_number: certNumber,
        application_id: applicationId,
        student_name: studentName,
        scheme_name: schemeName,
        grant_amount: grantAmount,
        issue_date: new Date().toISOString().split('T')[0]
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
      .single();

    if (error) return null;
    return data;
  },

  /**
   * Get certificate by application ID
   */
  async getCertificateByAppId(appId) {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('application_id', appId)
      .maybeSingle();

    if (error) return null;
    return data;
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
