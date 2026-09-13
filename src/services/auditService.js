import { supabase } from '../api/supabase';

export const auditService = {
  /**
   * Log an audit event
   */
  async log({ actorId = null, actorRole = 'SYSTEM', action, entityType, entityId = null, oldData = null, newData = null }) {
    try {
      await supabase.from('audit_logs').insert({
        actor_id: actorId,
        actor_role: actorRole,
        action,
        entity_type: entityType,
        entity_id: entityId,
        old_data: oldData,
        new_data: newData,
        user_agent: navigator.userAgent
      });
    } catch (err) {
      console.warn('Could not record audit log:', err.message);
    }
  },

  /**
   * Fetch audit logs for Super Admin inspection
   */
  async getAuditLogs(limit = 150) {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*, profiles:actor_id (full_name, email)')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.warn('Error fetching audit logs:', error.message);
      return [];
    }
    return data || [];
  }
};
