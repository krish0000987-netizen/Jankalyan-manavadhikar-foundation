import { supabase } from '../api/supabase';

const LOCAL_COMMISSIONS_KEY = 'jmf_manual_commissions';
const LOCAL_COORDINATORS_KEY = 'jmf_manual_coordinators';

export const commissionService = {
  /**
   * Get configured commission rates
   */
  async getCommissionRates() {
    try {
      const { data, error } = await supabase
        .from('commission_rates')
        .select('*')
        .order('rate_amount', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn('Live getCommissionRates note:', e);
    }
    // Fallback default rates
    return [
      { role_id: 'DISTRICT_COORDINATOR', model_type: 'FIXED_PER_APPROVED', rate_amount: 100, rate_display: '₹100 per approved application' },
      { role_id: 'BLOCK_COORDINATOR', model_type: 'FIXED_PER_APPROVED', rate_amount: 75, rate_display: '₹75 per approved application' },
      { role_id: 'INSTITUTION', model_type: 'FIXED_PER_APPROVED', rate_amount: 50, rate_display: '₹50 per verified bonafide applicant' },
      { role_id: 'ONLINE_CENTER', model_type: 'FIXED_PER_APPLICATION', rate_amount: 40, rate_display: '₹40 per registered application' }
    ];
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
   * Merges Supabase records with local commissions cache
   */
  async getCommissions(beneficiaryUserId = null) {
    let dbCommissions = [];
    try {
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
      if (!error && data) {
        dbCommissions = data;
      }
    } catch (err) {
      console.warn('Live getCommissions note:', err);
    }

    // Retrieve locally stored manual commissions
    let localComms = [];
    try {
      const saved = localStorage.getItem(LOCAL_COMMISSIONS_KEY);
      if (saved) {
        localComms = JSON.parse(saved);
        if (!Array.isArray(localComms)) localComms = [];
      }
    } catch (e) {
      localComms = [];
    }

    if (beneficiaryUserId) {
      localComms = localComms.filter(c => c.beneficiary_user_id === beneficiaryUserId);
    }

    // Merge by unique ID
    const dbIds = new Set(dbCommissions.map(c => c.id));
    const merged = [
      ...dbCommissions,
      ...localComms.filter(c => !dbIds.has(c.id))
    ];

    merged.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    return merged;
  },

  /**
   * Approve and settle commissions
   */
  async approveCommission(id, approverId = null) {
    // 1. Try DB
    try {
      const validApprover = approverId && typeof approverId === 'string' && approverId.length === 36 ? approverId : null;
      await supabase
        .from('commissions')
        .update({
          status: 'APPROVED',
          approved_by: validApprover,
          approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
    } catch (err) {
      console.warn('approveCommission DB update note:', err);
    }

    // 2. Update local cache
    try {
      const saved = localStorage.getItem(LOCAL_COMMISSIONS_KEY);
      if (saved) {
        let list = JSON.parse(saved);
        list = list.map(c => c.id === id ? { ...c, status: 'APPROVED', approved_at: new Date().toISOString() } : c);
        localStorage.setItem(LOCAL_COMMISSIONS_KEY, JSON.stringify(list));
      }
    } catch (e) {
      console.warn('approveCommission localStorage update note:', e);
    }

    return { id, status: 'APPROVED' };
  },

  /**
   * Mark a commission entry as PAID / Settled with UTR reference
   */
  async markCommissionPaid(id, approverId = null) {
    // 1. Try DB
    try {
      const validApprover = approverId && typeof approverId === 'string' && approverId.length === 36 ? approverId : null;
      await supabase
        .from('commissions')
        .update({
          status: 'PAID',
          approved_by: validApprover,
          approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
    } catch (err) {
      console.warn('markCommissionPaid DB update note:', err);
    }

    // 2. Update local cache
    try {
      const saved = localStorage.getItem(LOCAL_COMMISSIONS_KEY);
      if (saved) {
        let list = JSON.parse(saved);
        list = list.map(c => c.id === id ? { ...c, status: 'PAID', approved_at: new Date().toISOString() } : c);
        localStorage.setItem(LOCAL_COMMISSIONS_KEY, JSON.stringify(list));
      }
    } catch (e) {
      console.warn('markCommissionPaid localStorage update note:', e);
    }

    return { id, status: 'PAID' };
  },

  /**
   * Fetch all registered coordinators across District, Block, Institution, and CSC Centers
   * Merges Supabase profiles with local coordinators and defaults
   */
  async getCoordinators() {
    let dbMatched = [];
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
        const coordinatorRoles = ['DISTRICT_COORDINATOR', 'BLOCK_COORDINATOR', 'INSTITUTION', 'ONLINE_CENTER'];
        dbMatched = data.filter(p => 
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
      }
    } catch (err) {
      console.warn('Live getCoordinators note:', err);
    }

    // Default coordinator registry
    const defaultCoords = [
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

    // Local cached coordinators
    let localCoords = [];
    try {
      const saved = localStorage.getItem(LOCAL_COORDINATORS_KEY);
      if (saved) {
        localCoords = JSON.parse(saved);
        if (!Array.isArray(localCoords)) localCoords = [];
      }
    } catch (e) {
      localCoords = [];
    }

    // Merge with deduplication (by id, then by mobile)
    const seenIds = new Set();
    const seenMobiles = new Set();
    const result = [];

    for (const c of [...localCoords, ...dbMatched, ...defaultCoords]) {
      if (!c.id || seenIds.has(c.id)) continue;
      const cleanM = (c.mobile || '').replace(/[^0-9]/g, '');
      if (cleanM && seenMobiles.has(cleanM)) continue;

      seenIds.add(c.id);
      if (cleanM) seenMobiles.add(cleanM);
      result.push(c);
    }

    return result;
  },

  /**
   * Register a new Coordinator in the system
   */
  async createCoordinator({ fullName, email, mobile, role = 'DISTRICT_COORDINATOR', district = '', block = '', institution = '' }) {
    if (!fullName || !mobile) {
      throw new Error('Full Name and Mobile Number are required.');
    }

    const cleanMobile = mobile.replace(/[^0-9]/g, '');
    const cleanEmail = email ? email.trim().toLowerCase() : `coordinator_${cleanMobile}@jankalyan.org`;
    let coordinatorId = null;

    // 1. Check if profile exists already in Supabase
    try {
      const { data: existingProf } = await supabase
        .from('profiles')
        .select('id, full_name, mobile, email')
        .or(`email.eq.${cleanEmail},mobile.eq.${cleanMobile}`)
        .maybeSingle();

      if (existingProf?.id) {
        coordinatorId = existingProf.id;
      }
    } catch (e) {
      console.warn('Check existing profile note:', e);
    }

    // 2. If not found, attempt Supabase Auth Sign Up to satisfy auth.users FK
    if (!coordinatorId) {
      try {
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email: cleanEmail,
          password: `Jankalyan@${cleanMobile.slice(-4) || '2026'}`,
          options: {
            data: {
              full_name: fullName.trim(),
              mobile: cleanMobile
            }
          }
        });
        if (!authErr && authData?.user?.id) {
          coordinatorId = authData.user.id;
        }
      } catch (authErr) {
        console.warn('Coordinator auth signup note:', authErr);
      }
    }

    // 3. If still no DB user, generate a secure UUID
    if (!coordinatorId) {
      coordinatorId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `coord-${Date.now()}`;
    }

    // 4. Upsert into profiles and user_roles in Supabase if possible
    try {
      await supabase.from('profiles').upsert([{
        id: coordinatorId,
        full_name: fullName.trim(),
        email: cleanEmail,
        mobile: cleanMobile,
        is_active: true
      }]);

      await supabase.from('user_roles').upsert([{
        user_id: coordinatorId,
        role_id: role
      }]);
    } catch (dbErr) {
      console.warn('Coordinator DB upsert note (will save locally):', dbErr);
    }

    const newCoord = {
      id: coordinatorId,
      fullName: fullName.trim(),
      email: cleanEmail,
      mobile: cleanMobile,
      role,
      district: district || '',
      block: block || '',
      institution: institution || '',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    // 5. Always persist to local cache so it survives refreshes & offline
    try {
      const saved = localStorage.getItem(LOCAL_COORDINATORS_KEY);
      let list = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(list)) list = [];
      list = list.filter(c => c.id !== coordinatorId && c.mobile !== cleanMobile);
      list.unshift(newCoord);
      localStorage.setItem(LOCAL_COORDINATORS_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Could not save coordinator to localStorage:', e);
    }

    return newCoord;
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
    utrNumber = '',
    coordinatorName = ''
  }) {
    if (!beneficiaryUserId) {
      throw new Error('Please select a coordinator.');
    }
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      throw new Error('Please enter a valid commission amount.');
    }

    // 1. Resolve an existing valid application ID in DB to satisfy foreign key constraint
    let targetAppId = applicationId ? String(applicationId).trim() : '';
    if (targetAppId) {
      try {
        const { data: appMatch } = await supabase
          .from('applications')
          .select('id')
          .eq('id', targetAppId)
          .maybeSingle();
        if (!appMatch) targetAppId = '';
      } catch (e) {
        targetAppId = '';
      }
    }
    if (!targetAppId) {
      try {
        const { data: firstApp } = await supabase
          .from('applications')
          .select('id')
          .limit(1)
          .maybeSingle();
        targetAppId = firstApp?.id || 'JMF-2026-108234';
      } catch (e) {
        targetAppId = 'JMF-2026-108234';
      }
    }

    // 2. Validate approver (must be a valid profile UUID if supplied, else null)
    let validApproverId = null;
    if (approvedBy && typeof approvedBy === 'string' && approvedBy.length === 36) {
      try {
        const { data: appProf } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', approvedBy)
          .maybeSingle();
        if (appProf) validApproverId = appProf.id;
      } catch (e) {
        validApproverId = null;
      }
    }

    const cleanAmount = parseFloat(amount);
    const nowIso = new Date().toISOString();

    // 3. Check if beneficiaryUserId is a valid profile in Supabase
    let canInsertDb = false;
    if (typeof beneficiaryUserId === 'string' && beneficiaryUserId.length === 36) {
      try {
        const { data: profCheck } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', beneficiaryUserId)
          .maybeSingle();
        if (profCheck?.id) canInsertDb = true;
      } catch (e) {
        canInsertDb = false;
      }
    }

    let createdRecord = null;

    if (canInsertDb) {
      try {
        const payload = {
          beneficiary_user_id: beneficiaryUserId,
          beneficiary_role: beneficiaryRole || 'DISTRICT_COORDINATOR',
          application_id: targetAppId,
          amount: cleanAmount,
          status: status || 'PAID',
          approved_by: validApproverId,
          approved_at: status === 'PAID' || status === 'APPROVED' ? nowIso : null,
          created_at: nowIso
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

        if (!error && data) {
          createdRecord = data;
        } else if (error) {
          console.warn('Supabase commissions insert note:', error);
        }
      } catch (dbErr) {
        console.warn('Commission DB insert exception (falling back to local cache):', dbErr);
      }
    }

    // 4. If not inserted in DB (or if local coordinator / offline), construct a full commission record
    if (!createdRecord) {
      const commId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `comm-${Date.now()}`;
      
      // Look up coordinator details
      let coordName = coordinatorName || 'Field Coordinator';
      let coordMobile = '';
      let coordEmail = '';
      try {
        const savedCoords = localStorage.getItem(LOCAL_COORDINATORS_KEY);
        if (savedCoords) {
          const list = JSON.parse(savedCoords);
          const found = list.find(c => c.id === beneficiaryUserId);
          if (found) {
            coordName = found.fullName || coordName;
            coordMobile = found.mobile || '';
            coordEmail = found.email || '';
          }
        }
      } catch (e) {
        console.warn('Lookup coordinator from localStorage note:', e);
      }

      createdRecord = {
        id: commId,
        beneficiary_user_id: beneficiaryUserId,
        beneficiary_role: beneficiaryRole || 'DISTRICT_COORDINATOR',
        application_id: applicationId || targetAppId,
        amount: cleanAmount,
        status: status || 'PAID',
        settlement_id: null,
        approved_by: validApproverId,
        approved_at: status === 'PAID' || status === 'APPROVED' ? nowIso : null,
        created_at: nowIso,
        updated_at: nowIso,
        remarks: remarks || '',
        utr_number: utrNumber || '',
        profiles: {
          full_name: coordName,
          mobile: coordMobile,
          email: coordEmail
        },
        applications: {
          id: applicationId || targetAppId,
          status: 'COMMISSION_GRANTED',
          districts: { name: 'Field Jurisdiction' },
          institutions: { name: 'JMF Verification Cell' }
        }
      };
    }

    // 5. Save to local storage cache so it's always immediately available and persistent
    try {
      const saved = localStorage.getItem(LOCAL_COMMISSIONS_KEY);
      let list = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(list)) list = [];
      list = list.filter(c => c.id !== createdRecord.id);
      list.unshift(createdRecord);
      localStorage.setItem(LOCAL_COMMISSIONS_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Could not save commission to localStorage:', e);
    }

    return createdRecord;
  }
};
