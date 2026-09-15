import { supabase } from '../api/supabase';

export const donorService = {
  async getDonors() {
    const { data, error } = await supabase
      .from('donors')
      .select('*, donor_contributions(*)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createDonor(donorData) {
    const orgName = donorData.organization_name || donorData.organization || donorData.name || 'Anonymous CSR Partner';
    const contactPerson = donorData.contact_person || donorData.name || 'CSR Representative';
    
    const { data, error } = await supabase
      .from('donors')
      .insert({
        organization_name: orgName,
        contact_person: contactPerson,
        contact_email: donorData.contact_email || donorData.email || null,
        contact_mobile: donorData.contact_mobile || donorData.mobile || null,
        pan_number: donorData.pan_number || donorData.pan_or_cin || null,
        csr_registration_number: donorData.csr_registration_number || `CSR000${Math.floor(10000 + Math.random() * 90000)}`,
        tax_exemption_80g_number: donorData.tax_exemption_80g_number || 'AAATJ9988C-80G',
        is_active: true
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async addContribution(contrib) {
    const receiptNumber = `CSR-80G-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('donor_contributions')
      .insert({
        donor_id: contrib.donor_id,
        amount: parseFloat(contrib.amount) || 100000,
        contribution_date: contrib.contribution_date || today,
        reference_number: contrib.reference_number || contrib.payment_reference || `TXN-CSR-${Date.now()}`,
        payment_mode: contrib.payment_mode || 'NEFT/RTGS',
        receipt_number: receiptNumber,
        notes: contrib.notes || 'CSR Grant Contribution under 80G Tax Exemption'
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
