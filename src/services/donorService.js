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

  async createDonor(donor) {
    const { data, error } = await supabase
      .from('donors')
      .insert(donor)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async addContribution(contrib) {
    const receiptNumber = `CSR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const { data, error } = await supabase
      .from('donor_contributions')
      .insert({
        ...contrib,
        receipt_number: receiptNumber
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
