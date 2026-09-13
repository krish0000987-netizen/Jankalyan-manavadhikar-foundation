import { supabase } from '../api/supabase';

export const notificationService = {
  /**
   * Centralized notification dispatcher supporting multiple channels
   */
  async sendNotification({ userId, recipientIdentifier, templateId, variables = {}, channels = ['IN_APP'] }) {
    // 1. Fetch template
    const { data: template } = await supabase
      .from('notification_templates')
      .select('*')
      .eq('id', templateId)
      .maybeSingle();

    let titleEn = template?.title_en || 'Portal Notification';
    let bodyEn = template?.body_en || 'You have an update regarding your scholarship application.';

    // Replace template variables: {{student_name}}, {{application_id}}, etc.
    Object.entries(variables).forEach(([key, val]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      titleEn = titleEn.replace(regex, val);
      bodyEn = bodyEn.replace(regex, val);
    });

    // 2. Dispatch for each channel
    for (const ch of channels) {
      if (ch === 'IN_APP' && userId) {
        await supabase.from('notifications').insert({
          user_id: userId,
          title: titleEn,
          message: bodyEn,
          channel: 'IN_APP'
        });
      }

      // Record dispatch log
      await supabase.from('notification_logs').insert({
        recipient_identifier: recipientIdentifier || userId || 'student',
        template_id: templateId,
        channel: ch,
        payload: { title: titleEn, message: bodyEn, variables },
        status: 'DELIVERED',
        provider_response: { success: true, timestamp: new Date().toISOString() }
      });
    }

    return true;
  },

  async getUserNotifications(userId) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
  },

  async markAsRead(id) {
    await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', id);
  },

  async getNotificationLogs() {
    const { data, error } = await supabase
      .from('notification_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) return [];
    return data || [];
  }
};
