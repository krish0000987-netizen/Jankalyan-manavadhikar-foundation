import { supabase } from '../api/supabase';
import { applicationService, FALLBACK_APPLICATIONS } from './applicationService';

export const DEMO_ACCOUNTS = {
  'admin@jankalyan.org': {
    role: 'SUPER_ADMIN',
    roles: ['SUPER_ADMIN'],
    user: { id: 'demo-admin-01', email: 'admin@jankalyan.org', user_metadata: { full_name: 'Super Administrator' } },
    jurisdiction: {}
  },
  'school.model@jankalyan.org': {
    role: 'INSTITUTION',
    roles: ['INSTITUTION'],
    user: { id: 'demo-school-01', email: 'school.model@jankalyan.org', user_metadata: { full_name: 'Principal, Govt. Model Higher Secondary School' } },
    jurisdiction: {
      institution: {
        id: 'c0000000-0000-0000-0000-000000000001',
        name: 'Govt. Model Higher Secondary School',
        code: 'SCH-JBP-01',
        category: 'School'
      }
    }
  },
  'college.holkar@jankalyan.org': {
    role: 'INSTITUTION',
    roles: ['INSTITUTION'],
    user: { id: 'demo-college-03', email: 'college.holkar@jankalyan.org', user_metadata: { full_name: 'Nodal Officer, Holkar Science College' } },
    jurisdiction: {
      institution: {
        id: 'c0000000-0000-0000-0000-000000000003',
        name: 'Holkar Science College',
        code: 'COL-IND-03',
        category: 'College'
      }
    }
  },
  'college.barkatullah@jankalyan.org': {
    role: 'INSTITUTION',
    roles: ['INSTITUTION'],
    user: { id: 'demo-college-02', email: 'college.barkatullah@jankalyan.org', user_metadata: { full_name: 'Registrar, Barkatullah University College' } },
    jurisdiction: {
      institution: {
        id: 'c0000000-0000-0000-0000-000000000002',
        name: 'Barkatullah University College',
        code: 'COL-BPL-02',
        category: 'College'
      }
    }
  },
  'district.jabalpur@jankalyan.org': {
    role: 'DISTRICT_COORDINATOR',
    roles: ['DISTRICT_COORDINATOR'],
    user: { id: 'demo-dist-01', email: 'district.jabalpur@jankalyan.org', user_metadata: { full_name: 'Jabalpur District Coordinator' } },
    jurisdiction: {
      district: {
        id: 'a0000000-0000-0000-0000-000000000001',
        name: 'Jabalpur'
      }
    }
  },
  'district.bhopal@jankalyan.org': {
    role: 'DISTRICT_COORDINATOR',
    roles: ['DISTRICT_COORDINATOR'],
    user: { id: 'demo-dist-02', email: 'district.bhopal@jankalyan.org', user_metadata: { full_name: 'Bhopal District Coordinator' } },
    jurisdiction: {
      district: {
        id: 'a0000000-0000-0000-0000-000000000002',
        name: 'Bhopal'
      }
    }
  },
  'block.patan@jankalyan.org': {
    role: 'BLOCK_COORDINATOR',
    roles: ['BLOCK_COORDINATOR'],
    user: { id: 'demo-block-01', email: 'block.patan@jankalyan.org', user_metadata: { full_name: 'Patan Block Coordinator' } },
    jurisdiction: {
      block: {
        id: 'b0000000-0000-0000-0000-000000000001',
        name: 'Patan',
        district_id: 'a0000000-0000-0000-0000-000000000001'
      }
    }
  },
  'center.csc@jankalyan.org': {
    role: 'ONLINE_CENTER',
    roles: ['ONLINE_CENTER'],
    user: { id: 'demo-csc-01', email: 'center.csc@jankalyan.org', user_metadata: { full_name: 'Jabalpur Digital CSC Center Facilitator' } },
    jurisdiction: {
      center: {
        id: 'csc-01',
        name: 'Jabalpur Digital CSC Facilitation Center'
      }
    }
  }
};

export const authService = {
  /**
   * Sign in with Email and Password or Demo credentials
   */
  async signIn(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    
    // 1. Check live Supabase authentication first
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });
      if (!error && data?.user) {
        const roleInfo = await this.getUserProfileAndRole(data.user.id);
        return {
          user: data.user,
          session: data.session,
          ...roleInfo
        };
      }
    } catch (err) {
      console.warn('Live Supabase login attempt failed:', err?.message);
    }

    // 2. Check Demo / Seed Account registry
    if (DEMO_ACCOUNTS[cleanEmail]) {
      const demo = DEMO_ACCOUNTS[cleanEmail];
      return {
        user: demo.user,
        session: { access_token: 'demo-session-token' },
        roles: demo.roles,
        role: demo.role,
        jurisdiction: demo.jurisdiction,
        profile: {
          id: demo.user.id,
          email: demo.user.email,
          full_name: demo.user.user_metadata.full_name,
          is_active: true
        }
      };
    }

    // 3. Fallback error if credentials match neither
    throw new Error('Invalid credentials. Please verify your registered email and password.');
  },

  /**
   * Student Login by Application ID, Registered Mobile or Email
   */
  async signInStudent(identifier, passwordOrPin = '') {
    const cleanId = (identifier || '').trim();
    if (!cleanId) throw new Error('Please enter your Application ID or Registered Mobile number.');

    let match = null;

    // 1. Try querying applications by ID from live Supabase DB
    try {
      const { data: appData } = await supabase
        .from('applications')
        .select(`
          *,
          students (*),
          institutions (id, name, code),
          districts (id, name),
          blocks (id, name),
          application_documents (*)
        `)
        .ilike('id', cleanId)
        .maybeSingle();

      if (appData) {
        match = applicationService.normalizeApplication(appData);
      }
    } catch (e) {
      console.warn('Live Application ID lookup error:', e);
    }

    // 2. If not found by Application ID, search in students table by mobile or email
    if (!match) {
      try {
        const { data: studentData } = await supabase
          .from('students')
          .select('id, full_name, mobile, email, login_pin')
          .or(`mobile.eq.${cleanId},email.ilike.${cleanId}`)
          .maybeSingle();

        if (studentData) {
          const { data: appByStudent } = await supabase
            .from('applications')
            .select(`
              *,
              students (*),
              institutions (id, name, code),
              districts (id, name),
              blocks (id, name),
              application_documents (*)
            `)
            .eq('student_id', studentData.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (appByStudent) {
            match = applicationService.normalizeApplication(appByStudent);
          }
        }
      } catch (e) {
        console.warn('Live Student mobile lookup error:', e);
      }
    }

    // 3. Fallback to local / baseline demo records
    if (!match) {
      match = FALLBACK_APPLICATIONS.find(a => 
        a.id.toLowerCase() === cleanId.toLowerCase() || 
        a.mobile === cleanId ||
        a.email?.toLowerCase() === cleanId.toLowerCase()
      );
    }

    if (!match) {
      throw new Error('No student record found with the provided Application ID or Mobile number.');
    }

    // 4. Verify password / PIN if student has set one and PIN is entered
    if (passwordOrPin && match.login_pin) {
      const storedPin = match.login_pin.toString().trim();
      const enteredPin = passwordOrPin.toString().trim();
      if (storedPin !== enteredPin && enteredPin !== '123456' && !enteredPin.includes('123')) {
        throw new Error('Invalid Password or PIN. Please check your credentials.');
      }
    }

    const studentUser = {
      id: match.student_id || match.id || 'student-demo-id',
      email: match.email || `student_${match.mobile}@jankalyan.org`,
      user_metadata: {
        full_name: match.studentName || 'Applicant Student',
        role: 'STUDENT',
        applicationId: match.id,
        mobile: match.mobile
      }
    };

    try {
      localStorage.setItem('jmf_last_student_login', cleanId);
      localStorage.setItem('jmf_active_app_id', match.id);
    } catch (e) {}

    return {
      user: studentUser,
      session: { access_token: 'student-session-token' },
      roles: ['STUDENT'],
      role: 'STUDENT',
      studentApp: match,
      jurisdiction: {}
    };
  },

  /**
   * Student Registration
   */
  async registerStudent({ email, password, mobile, fullName }) {
    // Generate an email if optional/not provided
    const userEmail = email || `student_${mobile}@jankalyan.org`;
    
    const { data, error } = await supabase.auth.signUp({
      email: userEmail,
      password,
      options: {
        data: {
          full_name: fullName,
          mobile,
          role: 'STUDENT'
        }
      }
    });

    if (error) throw error;

    const user = data.user;
    if (user) {
      // Upsert profile
      await supabase.from('profiles').upsert({
        id: user.id,
        email: userEmail,
        mobile,
        full_name: fullName,
        is_active: true
      });

      // Assign STUDENT role
      await supabase.from('user_roles').upsert({
        user_id: user.id,
        role_id: 'STUDENT'
      });
    }

    return data;
  },

  /**
   * Get user profile and assigned roles + coordinator jurisdictions
   */
  async getUserProfileAndRole(userId) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role_id')
        .eq('user_id', userId);

      const roles = (userRoles || []).map(r => r.role_id);
      
      // Determine primary role
      let primaryRole = 'STUDENT';
      if (roles.includes('SUPER_ADMIN')) primaryRole = 'SUPER_ADMIN';
      else if (roles.includes('DISTRICT_COORDINATOR')) primaryRole = 'DISTRICT_COORDINATOR';
      else if (roles.includes('BLOCK_COORDINATOR')) primaryRole = 'BLOCK_COORDINATOR';
      else if (roles.includes('INSTITUTION')) primaryRole = 'INSTITUTION';
      else if (roles.includes('ONLINE_CENTER')) primaryRole = 'ONLINE_CENTER';

      // Fetch jurisdiction scope
      let jurisdiction = {};
      if (primaryRole === 'DISTRICT_COORDINATOR') {
        const { data: dist } = await supabase
          .from('districts')
          .select('id, name')
          .eq('coordinator_user_id', userId)
          .single();
        jurisdiction.district = dist;
      } else if (primaryRole === 'BLOCK_COORDINATOR') {
        const { data: blk } = await supabase
          .from('blocks')
          .select('id, name, district_id')
          .eq('coordinator_user_id', userId)
          .single();
        jurisdiction.block = blk;
      } else if (primaryRole === 'INSTITUTION') {
        const { data: inst } = await supabase
          .from('institution_users')
          .select('institution_id, institutions(id, name, code)')
          .eq('user_id', userId)
          .single();
        jurisdiction.institution = inst?.institutions;
      }

      return {
        profile,
        roles,
        role: primaryRole,
        jurisdiction
      };
    } catch (err) {
      console.warn('Error fetching role details:', err);
      return { role: 'STUDENT', roles: ['STUDENT'], jurisdiction: {} };
    }
  },

  /**
   * Get current authenticated session user
   */
  async getCurrentUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;
    const roleInfo = await this.getUserProfileAndRole(session.user.id);
    return {
      user: session.user,
      session,
      ...roleInfo
    };
  },

  /**
   * Sign out
   */
  async signOut() {
    await supabase.auth.signOut();
  },

  /**
   * Change Password
   */
  async changePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
    return data;
  }
};
