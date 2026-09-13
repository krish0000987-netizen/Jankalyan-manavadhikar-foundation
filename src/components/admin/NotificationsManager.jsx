import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import { supabase } from '../../api/supabase';
import { 
  Bell, 
  Send, 
  MessageSquare, 
  Mail, 
  Smartphone, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Loader2, 
  RefreshCw,
  Clock,
  Sparkles
} from 'lucide-react';

export const NotificationsManager = () => {
  const [activeSubTab, setActiveSubTab] = useState('templates'); // 'templates' | 'broadcast' | 'logs'
  const [templates, setTemplates] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [dispatching, setDispatching] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Broadcast state
  const [broadcast, setBroadcast] = useState({
    targetGroup: 'ALL_APPLICANTS',
    templateId: 'APP_APPROVED',
    customTitle: '',
    customMessage: '',
    channels: ['IN_APP', 'SMS']
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [{ data: tData }, logData] = await Promise.all([
        supabase.from('notification_templates').select('*').order('id'),
        notificationService.getNotificationLogs()
      ]);
      setTemplates(tData || []);
      setLogs(logData || []);
    } catch (err) {
      console.error('Error loading notification data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateTemplate = async (e) => {
    e.preventDefault();
    if (!editingTemplate) return;
    try {
      const { error } = await supabase
        .from('notification_templates')
        .update({
          title_en: editingTemplate.title_en,
          title_hi: editingTemplate.title_hi,
          body_en: editingTemplate.body_en,
          body_hi: editingTemplate.body_hi,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingTemplate.id);
      if (error) throw error;
      setFeedback({ type: 'success', message: `Template "${editingTemplate.id}" updated successfully!` });
      setEditingTemplate(null);
      loadData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update template.' });
    } finally {
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    setDispatching(true);
    try {
      // Simulate/trigger broadcast to matching applications
      const { data: apps } = await supabase
        .from('applications')
        .select('id, student_id, students(full_name, mobile)')
        .limit(25);

      let count = 0;
      for (const app of (apps || [])) {
        await notificationService.sendNotification({
          userId: app.student_id,
          recipientIdentifier: app.students?.mobile || app.id,
          templateId: broadcast.templateId,
          variables: {
            student_name: app.students?.full_name || 'Student',
            application_id: app.id,
            scholarship_amount: '₹12,000',
            utr_number: 'SBIN004829104829'
          },
          channels: broadcast.channels
        });
        count++;
      }

      setFeedback({ type: 'success', message: `Broadcast successfully dispatched to ${count} recipient devices!` });
      loadData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to dispatch broadcast.' });
    } finally {
      setDispatching(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={24} color="#1E40AF" />
            <span>Notification & Multi-Channel Dispatch Center</span>
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
            Configure bilingual SMS, In-App, and Email communication templates and trigger student alerts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline btn-sm" onClick={loadData}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          backgroundColor: feedback.type === 'success' ? '#DCFCE7' : '#FEE2E2',
          border: `1px solid ${feedback.type === 'success' ? '#86EFAC' : '#FCA5A5'}`,
          color: feedback.type === 'success' ? '#166534' : '#991B1B',
          fontSize: '0.875rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Sub-tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>
        <button 
          className={`btn btn-sm ${activeSubTab === 'templates' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveSubTab('templates')}
        >
          <span>Notification Templates</span>
        </button>
        <button 
          className={`btn btn-sm ${activeSubTab === 'broadcast' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveSubTab('broadcast')}
        >
          <span>Send Student Broadcast</span>
        </button>
        <button 
          className={`btn btn-sm ${activeSubTab === 'logs' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveSubTab('logs')}
        >
          <span>Dispatch History Logs ({logs.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: TEMPLATES */}
      {activeSubTab === 'templates' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1rem' }}>
          {templates.map(tmpl => (
            <div key={tmpl.id} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="badge badge-navy" style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                  {tmpl.id}
                </span>
                <button 
                  className="btn btn-outline btn-sm"
                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                  onClick={() => setEditingTemplate({ ...tmpl })}
                >
                  <Edit3 size={13} />
                  <span>Edit</span>
                </button>
              </div>

              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.95rem', marginBottom: '0.2rem' }}>
                {tmpl.title_en}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '0.75rem' }}>
                {tmpl.title_hi}
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.8rem', color: '#334155', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                {tmpl.body_en}
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, marginTop: 'auto' }}>
                {tmpl.body_hi}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 2: BROADCAST DISPATCH */}
      {activeSubTab === 'broadcast' && (
        <div className="card" style={{ maxWidth: '680px', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
            Dispatch Scholarship Broadcast Notification
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Send instant multi-channel push updates to student beneficiaries across portals.
          </p>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div className="form-group">
              <label className="form-label required">Target Beneficiary Segment</label>
              <select 
                className="form-control"
                value={broadcast.targetGroup}
                onChange={(e) => setBroadcast({ ...broadcast, targetGroup: e.target.value })}
              >
                <option value="ALL_APPLICANTS">All Registered Applicants (Active Session)</option>
                <option value="APPROVED_BENEFICIARIES">Approved Students (Awaiting Disbursal)</option>
                <option value="CORRECTION_REQUESTED">Pending Document Corrections</option>
                <option value="RELEASED_DBT">Scholarship Disbursed Cohort</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label required">Notification Message Template</label>
              <select 
                className="form-control"
                value={broadcast.templateId}
                onChange={(e) => setBroadcast({ ...broadcast, templateId: e.target.value })}
              >
                {templates.map(t => (
                  <option key={t.id} value={t.id}>{t.id} — {t.title_en}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Active Communication Channels</label>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.35rem' }}>
                {['IN_APP', 'SMS', 'EMAIL', 'WHATSAPP'].map(ch => (
                  <label key={ch} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input 
                      type="checkbox"
                      checked={broadcast.channels.includes(ch)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setBroadcast({ ...broadcast, channels: [...broadcast.channels, ch] });
                        } else {
                          setBroadcast({ ...broadcast, channels: broadcast.channels.filter(c => c !== ch) });
                        }
                      }}
                    />
                    <span>{ch}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ paddingTop: '1rem' }}>
              <button type="submit" disabled={dispatching} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                {dispatching ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                <span>{dispatching ? 'Dispatching Broadcast...' : 'Send Broadcast Campaign'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-TAB 3: LOGS */}
      {activeSubTab === 'logs' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Timestamp</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Recipient</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Template</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Channel</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Message Excerpt</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.8rem 1rem', color: '#64748B', whiteSpace: 'nowrap' }}>
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td style={{ padding: '0.8rem 1rem', fontWeight: 700, color: '#0F172A' }}>
                      {log.recipient_identifier}
                    </td>
                    <td style={{ padding: '0.8rem 1rem', fontFamily: 'monospace' }}>
                      {log.template_id}
                    </td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <span className="badge badge-navy" style={{ fontSize: '0.7rem' }}>
                        {log.channel}
                      </span>
                    </td>
                    <td style={{ padding: '0.8rem 1rem', color: '#334155', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.payload?.message || '-'}
                    </td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                      No notification logs recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Template Modal */}
      {editingTemplate && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }}>
          <div className="card" style={{ width: '560px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem' }}>
              Edit Template: {editingTemplate.id}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.25rem' }}>
              Dynamic placeholders: <code>{'{{student_name}}'}</code>, <code>{'{{application_id}}'}</code>, <code>{'{{scholarship_amount}}'}</code>, <code>{'{{utr_number}}'}</code>
            </p>

            <form onSubmit={handleUpdateTemplate} className="space-y-4">
              <div className="form-group">
                <label className="form-label required">Title (English)</label>
                <input 
                  type="text"
                  className="form-control"
                  required
                  value={editingTemplate.title_en}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, title_en: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label required">Title (Hindi)</label>
                <input 
                  type="text"
                  className="form-control"
                  required
                  value={editingTemplate.title_hi}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, title_hi: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label required">Message Body (English)</label>
                <textarea 
                  className="form-control"
                  rows={3}
                  required
                  value={editingTemplate.body_en}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, body_en: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label required">Message Body (Hindi)</label>
                <textarea 
                  className="form-control"
                  rows={3}
                  required
                  value={editingTemplate.body_hi}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, body_hi: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditingTemplate(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
