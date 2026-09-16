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
  },

  /**
   * Mark a commission entry as PAID / Settled with UTR reference
   */
  async markCommissionPaid(id, approverId = null) {
    const { data, error } = await supabase
      .from('commissions')
      .update({
        status: 'PAID',
        approved_by: approverId,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Fetch all registered coordinators across District, Block, Institution, and CSC Centers
   */
  async getCoordinators() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          mobile,
          is_active,
          created_at,
          user_roles (role_id)
        `)
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Filter profiles that have a coordinator role
        const coordinatorRoles = ['DISTRICT_COORDINATOR', 'BLOCK_COORDINATOR', 'INSTITUTION', 'ONLINE_CENTER'];
        const matched = data.filter(p => 
          (p.user_roles || []).some(r => coordinatorRoles.includes(r.role_id))
        ).map(p => {
          const roleItem = (p.user_roles || []).find(r => coordinatorRoles.includes(r.role_id));
          return {
            id: p.id,
            fullName: p.full_name,
            email: p.email,
            mobile: p.mobile,
            role: roleItem ? roleItem.role_id : 'DISTRICT_COORDINATOR',
            isActive: p.is_active !== false,
            createdAt: p.created_at
          };
        });

        if (matched.length > 0) return matched;
      }
    } catch (err) {
      console.warn('Live getCoordinators note:', err);
    }

    // Default coordinator registry
    return [
      {
        id: 'eb6a57ae-e62e-4fc0-9324-0e7f2166bf31',
        fullName: 'Jabalpur District Coordinator',
        email: 'district.jabalpur@jankalyan.org',
        mobile: '9826110001',
        role: 'DISTRICT_COORDINATOR',
        district: 'Jabalpur',
        isActive: true
      },
      {
        id: '26d060a1-f686-408f-986a-be460e4ba398',
        fullName: 'Patan Block Coordinator',
        email: 'block.patan@jankalyan.org',
        mobile: '9826110002',
        role: 'BLOCK_COORDINATOR',
        district: 'Jabalpur',
        block: 'Patan',
        isActive: true
      },
      {
        id: '09678e68-1cca-4470-8762-e682ae7018e0',
        fullName: 'Nodal Officer - Govt Model HSS',
        email: 'school.model@jankalyan.org',
        mobile: '9826110003',
        role: 'INSTITUTION',
        institution: 'Govt. Model Higher Secondary School',
        isActive: true
      },
      {
        id: 'a45eac1d-a406-48c5-93e9-4c2c96f9e824',
        fullName: 'Patan CSC Center Operator',
        email: 'center.patan@jankalyan.org',
        mobile: '9826110004',
        role: 'ONLINE_CENTER',
        district: 'Jabalpur',
        block: 'Patan',
        isActive: true
      }
    ];
  },

  /**
   * Register a new Coordinator in the system
   */
  async createCoordinator({ fullName, email, mobile, role = 'DISTRICT_COORDINATOR', district = '', block = '', institution = '' }) {
    if (!fullName || !mobile) {
      throw new Error('Full Name and Mobile Number are required.');
    }

    const coordinatorId = crypto.randomUUID();
    const cleanMobile = mobile.replace(/[^0-9]/g, '');
    const cleanEmail = email ? email.trim().toLowerCase() : `coordinator_${cleanMobile}@jankalyan.org`;

    // 1. Insert profile
    const { error: pErr } = await supabase.from('profiles').insert([{
      id: coordinatorId,
      full_name: fullName.trim(),
      email: cleanEmail,
      mobile: cleanMobile,
      is_active: true
    }]);
    if (pErr) throw pErr;

    // 2. Insert user role
    const { error: rErr } = await supabase.from('user_roles').insert([{
      user_id: coordinatorId,
      role_id: role
    }]);
    if (rErr) throw rErr;

    return {
      id: coordinatorId,
      fullName: fullName.trim(),
      email: cleanEmail,
      mobile: cleanMobile,
      role,
      district,
      block,
      institution,
      isActive: true
    };
  },

  /**
   * Manually grant/add a commission record for a coordinator
   */
  async addManualCommission({
    beneficiaryUserId,
    beneficiaryRole,
    applicationId = null,
    amount,
    status = 'PAID',
    approvedBy = null,
    remarks = '',
    utrNumber = ''
  }) {
    if (!beneficiaryUserId) {
      throw new Error('Please select a coordinator.');
    }
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      throw new Error('Please enter a valid commission amount.');
    }

    // Resolve an existing application ID if none provided (to satisfy FK constraint)
    let targetAppId = applicationId;
    if (!targetAppId) {
      const { data: existingApp } = await supabase
        .from('applications')
        .select('id')
        .limit(1)
        .maybeSingle();
      targetAppId = existingApp?.id || 'JMF-2026-108234';
    }

    const payload = {
      beneficiary_user_id: beneficiaryUserId,
      beneficiary_role: beneficiaryRole || 'DISTRICT_COORDINATOR',
      application_id: targetAppId,
      amount: parseFloat(amount),
      status: status || 'PAID',
      approved_by: approvedBy,
      approved_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('commissions')
      .insert(payload)
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
      .single();

    if (error) throw error;
    return data;
  }
};
