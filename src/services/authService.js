import { supabase } from '../api/supabase';

export const authService = {
  /**
   * Sign in with Email and Password
   */
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    
    // Fetch profile and role
    const roleInfo = await this.getUserProfileAndRole(data.user.id);
    return {
      user: data.user,
      session: data.session,
      ...roleInfo
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
