import { supabase } from '../api/supabase';

export const commissionService = {
  /**
   * Get configured commission rates
   */
  async getCommissionRates() {
    const { data, error } = await supabase
      .from('commission_rates')
      .select('*')
      .order('rate_amount', { ascending: false });
    if (error) throw error;
    return data;
  },

  /**
   * Update commission rate for a role
   */
  async updateCommissionRate(roleId, amount, modelType = 'FIXED_PER_APPROVED') {
    const { data, error } = await supabase
      .from('commission_rates')
      .update({
        rate_amount: amount,
        model_type: modelType,
        rate_display: `₹${amount} per approved application`,
        updated_at: new Date().toISOString()
      })
      .eq('role_id', roleId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Fetch generated commissions with coordinator details
   */
  async getCommissions(beneficiaryUserId = null) {
    let query = supabase
      .from('commissions')
      .select(`
        *,
        profiles:beneficiary_user_id (full_name, mobile, email),
        applications (
          id,
          status,
          institutions (name),
          districts (name)
        )
      `)
      .order('created_at', { ascending: false });

    if (beneficiaryUserId) {
      query = query.eq('beneficiary_user_id', beneficiaryUserId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  /**
   * Approve and settle commissions
   */
  async approveCommission(id, approverId = null) {
    const { data, error } = await supabase
      .from('commissions')
      .update({
        status: 'APPROVED',
        approved_by: approverId,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
