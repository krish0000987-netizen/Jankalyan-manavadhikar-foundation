import { supabase } from '../api/supabase';

export const grievanceService = {
  /**
   * Submit new student grievance
   */
  async submitGrievance({ name, mobile, email, applicationId, category, description }) {
    const id = `GRV-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const { data, error } = await supabase
      .from('grievances')
      .insert({
        id,
        student_name: name,
        mobile,
        email,
        application_id: applicationId || null,
        category: category || 'General Helpdesk',
        description,
        status: 'OPEN'
      })
      .select()
      .single();

    if (error) throw error;
    return id;
  },

  /**
   * Get list of grievances with optional filter
   */
  async getGrievances(filters = {}) {
    let query = supabase
      .from('grievances')
      .select(`
        *,
        applications (id, status, institutions(name)),
        profiles:assigned_to (full_name, mobile)
      `)
      .order('created_at', { ascending: false });

    if (filters.status && filters.status !== 'All') {
      query = query.eq('status', filters.status);
    }
    if (filters.mobile) {
      query = query.eq('mobile', filters.mobile);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  /**
   * Update grievance status and resolution remarks
   */
  async updateGrievanceStatus(id, newStatus, resolutionNotes = '', resolverId = null) {
    const updatePayload = {
      status: newStatus,
      updated_at: new Date().toISOString()
    };
    if (newStatus === 'RESOLVED' || newStatus === 'CLOSED') {
      updatePayload.resolution_notes = resolutionNotes;
      updatePayload.resolved_by = resolverId;
      updatePayload.resolved_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('grievances')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Log message in thread if remarks provided
    if (resolutionNotes) {
      await supabase.from('grievance_messages').insert({
        grievance_id: id,
        sender_user_id: resolverId,
        sender_name: 'Grievance Redressal Officer',
        sender_role: 'ADMIN',
        message: resolutionNotes
      });
    }

    return data;
  },

  /**
   * Get messages thread for a grievance
   */
  async getGrievanceMessages(grievanceId) {
    const { data, error } = await supabase
      .from('grievance_messages')
      .select('*')
      .eq('grievance_id', grievanceId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Track grievance by ID or mobile
   */
  async trackGrievance(query) {
    const q = (query || '').trim();
    if (!q) return null;

    let queryBuilder = supabase
      .from('grievances')
      .select('*, grievance_messages(*)')
      .order('created_at', { ascending: false })
      .limit(1);

    if (q.toUpperCase().startsWith('GRV-')) {
      queryBuilder = queryBuilder.ilike('id', `%${q}%`);
    } else {
      queryBuilder = queryBuilder.or(`id.ilike.%${q}%,mobile.eq.${q}`);
    }

    const { data, error } = await queryBuilder.maybeSingle();
    if (error) {
      console.error('Error tracking grievance:', error);
      throw error;
    }
    return data;
  }
};
