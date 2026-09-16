import React, { useState, useEffect } from 'react';
import { grievanceService } from '../../services/grievanceService';
import { supabase } from '../../api/supabase';
import { 
  HelpCircle, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Send, 
  Eye, 
  Check, 
  X, 
  Loader2,
  Sliders,
  Filter,
  ArrowRight
} from 'lucide-react';

export const GrievanceManager = ({ authUser }) => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [resolutionText, setResolutionText] = useState('');
  const [newStatus, setNewStatus] = useState('RESOLVED');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [ticketMessages, setTicketMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const loadGrievances = async () => {
    setLoading(true);
    try {
      const data = await grievanceService.getGrievances();
      setGrievances(data || []);
    } catch (err) {
      console.error('Error fetching grievances:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrievances();
  }, []);

  const openTicketModal = async (ticket) => {
    setSelectedTicket(ticket);
    setNewStatus(ticket.status === 'RESOLVED' ? 'RESOLVED' : 'RESOLVED');
    setResolutionText(ticket.resolution_notes || '');
    setLoadingMessages(true);
    try {
      const msgs = await grievanceService.getGrievanceMessages(ticket.id);
      setTicketMessages(msgs || []);
    } catch (err) {
      console.error('Error fetching grievance thread:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;
    setSaving(true);
    try {
      await grievanceService.updateGrievanceStatus(
        selectedTicket.id,
        newStatus,
        resolutionText,
        authUser?.id
      );

      setFeedback({ 
        type: 'success', 
        message: `Ticket ${selectedTicket.id} updated to ${newStatus} with official resolution notes!` 
      });

      setSelectedTicket(null);
      await loadGrievances();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update ticket.' });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  // Status counts
  const openCount = grievances.filter(g => g.status === 'OPEN').length;
  const inProgressCount = grievances.filter(g => g.status === 'IN_PROGRESS').length;
  const resolvedCount = grievances.filter(g => g.status === 'RESOLVED' || g.status === 'Resolved').length;

  // Filtered grievances
  const filteredGrievances = grievances.filter(g => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      (g.id || '').toLowerCase().includes(q) ||
      (g.student_name || g.name || '').toLowerCase().includes(q) ||
      (g.mobile || '').toLowerCase().includes(q) ||
      (g.application_id || '').toLowerCase().includes(q) ||
      (g.description || '').toLowerCase().includes(q) ||
      (g.category || '').toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'ALL' || 
      (statusFilter === 'OPEN' && g.status === 'OPEN') ||
      (statusFilter === 'IN_PROGRESS' && g.status === 'IN_PROGRESS') ||
      (statusFilter === 'RESOLVED' && (g.status === 'RESOLVED' || g.status === 'Resolved'));

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle size={24} color="#DC2626" />
            <span>Student Grievance & Helpdesk Cell</span>
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
            Review student complaint messages, investigate verification queries, and post official resolution notes.
          </p>
        </div>

        <button className="btn btn-outline btn-sm" onClick={loadGrievances}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Tickets</span>
        </button>
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
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid-4">
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #1E40AF' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Total Tickets</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A', margin: '0.2rem 0' }}>{grievances.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Filed across all rounds</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #DC2626' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Pending / Open</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#DC2626', margin: '0.2rem 0' }}>{openCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#B91C1C' }}>Awaiting initial review</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #D97706' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>In Progress</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#D97706', margin: '0.2rem 0' }}>{inProgressCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#B45309' }}>Under scrutiny investigation</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #16A34A' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Resolved Tickets</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#16A34A', margin: '0.2rem 0' }}>{resolvedCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#15803D' }}>Officially addressed</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              className="form-control"
              placeholder="Search by ticket ID, student name, mobile, App ID, or message text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {[
              { id: 'ALL', label: `All (${grievances.length})` },
              { id: 'OPEN', label: `Open (${openCount})` },
              { id: 'IN_PROGRESS', label: `In Progress (${inProgressCount})` },
              { id: 'RESOLVED', label: `Resolved (${resolvedCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  border: '1px solid',
                  borderColor: statusFilter === tab.id ? '#1E40AF' : '#E2E8F0',
                  backgroundColor: statusFilter === tab.id ? '#EFF6FF' : '#FFFFFF',
                  color: statusFilter === tab.id ? '#1E40AF' : '#64748B',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table: Showing the Student's Complaint Message Prominently! */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#475569', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem', width: '130px' }}>Ticket ID</th>
                <th style={{ padding: '0.75rem 1rem', width: '180px' }}>Student Details</th>
                <th style={{ padding: '0.75rem 1rem', width: '150px' }}>Category</th>
                <th style={{ padding: '0.75rem 1rem', minWidth: '320px' }}>Student Message / Complaint</th>
                <th style={{ padding: '0.75rem 1rem', width: '110px' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', width: '110px' }}>Date</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center', width: '130px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrievances.map(g => {
                const isResolved = g.status === 'RESOLVED' || g.status === 'Resolved';
                const isPending = g.status === 'OPEN';

                return (
                  <tr key={g.id} style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: isPending ? '#FFFDF5' : 'transparent' }}>
                    {/* Ticket ID */}
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 800, fontFamily: 'monospace', color: '#DC2626', verticalAlign: 'top' }}>
                      {g.id}
                      {g.application_id && (
                        <div style={{ fontSize: '0.7rem', color: '#1E40AF', fontFamily: 'monospace', marginTop: '0.2rem' }}>
                          App: {g.application_id}
                        </div>
                      )}
                    </td>

                    {/* Student Details */}
                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: 800, color: '#0F172A' }}>
                        {g.student_name || g.name || 'Student'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem' }}>
                        <Phone size={12} />
                        <span>{g.mobile || '-'}</span>
                      </div>
                      {g.email && (
                        <div style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.1rem' }}>
                          <Mail size={12} />
                          <span>{g.email}</span>
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'top' }}>
                      <span className="badge badge-navy" style={{ fontSize: '0.7rem' }}>
                        {g.category || 'General'}
                      </span>
                    </td>

                    {/* STUDENT MESSAGE - PROMINENTLY DISPLAYED! */}
                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'top' }}>
                      <div style={{
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        padding: '0.6rem 0.85rem',
                        lineHeight: 1.5,
                        color: '#1E293B',
                        fontSize: '0.83rem',
                        fontStyle: 'normal'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#1E40AF', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                          <MessageSquare size={12} />
                          <span>Student Message:</span>
                        </div>
                        {g.description || g.message || (
                          <span style={{ color: '#94A3B8', fontStyle: 'italic' }}>No message body provided</span>
                        )}
                      </div>

                      {/* If resolved, also show resolution preview */}
                      {g.resolution_notes && (
                        <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: '#15803D', display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
                          <CheckCircle2 size={13} style={{ marginTop: '2px', flexShrink: 0 }} />
                          <div>
                            <strong>Resolution:</strong> {g.resolution_notes}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'top' }}>
                      <span className={`badge ${isResolved ? 'badge-green' : isPending ? 'badge-red' : 'badge-yellow'}`} style={{ fontSize: '0.72rem' }}>
                        {g.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', color: '#64748B', verticalAlign: 'top' }}>
                      {g.created_at ? new Date(g.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '-'}
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                        {g.created_at ? new Date(g.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                      </div>
                    </td>

                    {/* Action Button */}
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center', verticalAlign: 'top' }}>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => openTicketModal(g)}
                        style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                      >
                        <Eye size={13} />
                        <span>View / Reply</span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredGrievances.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3.5rem', color: '#64748B' }}>
                    {loading ? 'Loading grievance tickets from database...' : 'No grievance tickets match your search filter.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Details & Resolution Modal */}
      {selectedTicket && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div className="card" style={{ width: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'monospace', color: '#DC2626' }}>
                    {selectedTicket.id}
                  </span>
                  <span className={`badge ${selectedTicket.status === 'RESOLVED' || selectedTicket.status === 'Resolved' ? 'badge-green' : 'badge-yellow'}`}>
                    {selectedTicket.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.2rem' }}>
                  Category: <strong>{selectedTicket.category}</strong> • Filed on: {new Date(selectedTicket.created_at).toLocaleString()}
                </div>
              </div>

              <button 
                onClick={() => setSelectedTicket(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '0.25rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Student Info Box */}
            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem', border: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: '#64748B', fontSize: '0.75rem' }}>Student Name:</span>
                <div style={{ fontWeight: 800, color: '#0F172A' }}>{selectedTicket.student_name || selectedTicket.name}</div>
              </div>
              <div>
                <span style={{ color: '#64748B', fontSize: '0.75rem' }}>Contact Mobile:</span>
                <div style={{ fontWeight: 700, color: '#0F172A' }}>{selectedTicket.mobile}</div>
              </div>
              <div>
                <span style={{ color: '#64748B', fontSize: '0.75rem' }}>Application ID:</span>
                <div style={{ fontWeight: 700, fontFamily: 'monospace', color: '#1E40AF' }}>{selectedTicket.application_id || 'Not Provided'}</div>
              </div>
              <div>
                <span style={{ color: '#64748B', fontSize: '0.75rem' }}>Email:</span>
                <div style={{ fontWeight: 600, color: '#0F172A' }}>{selectedTicket.email || '-'}</div>
              </div>
            </div>

            {/* FULL STUDENT GRIEVANCE MESSAGE */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#1E3A8A', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Student's Grievance Message / Description:
              </label>
              <div style={{
                backgroundColor: '#EFF6FF',
                border: '1.5px solid #93C5FD',
                borderRadius: '10px',
                padding: '1.25rem',
                color: '#1E293B',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                fontWeight: 500
              }}>
                "{selectedTicket.description || selectedTicket.message || 'No description provided.'}"
              </div>
            </div>

            {/* Previous message thread if any */}
            {ticketMessages.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', color: '#64748B', marginBottom: '0.5rem' }}>
                  Response History:
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {ticketMessages.map(m => (
                    <div key={m.id} style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '0.75rem', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#166534', fontWeight: 700, marginBottom: '0.2rem' }}>
                        <span>{m.sender_name} ({m.sender_role})</span>
                        <span>{new Date(m.created_at).toLocaleString()}</span>
                      </div>
                      <div style={{ color: '#1E293B' }}>{m.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Official Resolution Form */}
            <form onSubmit={handleUpdateTicket} className="space-y-4">
              <div className="form-group">
                <label className="form-label required">Update Ticket Status</label>
                <select 
                  className="form-control"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  style={{ fontWeight: 700 }}
                >
                  <option value="OPEN">OPEN (Under Initial Review)</option>
                  <option value="IN_PROGRESS">IN_PROGRESS (Investigation Underway)</option>
                  <option value="RESOLVED">RESOLVED (Issue Addressed & Closed)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label required">Official Officer Resolution Remarks / Reply to Student</label>
                <textarea 
                  className="form-control"
                  rows={4}
                  required
                  placeholder="Enter detailed resolution note (e.g., Verified bonafide certificate, student moved to approved list; or instructed student on correct procedure)..."
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  style={{ fontSize: '0.9rem' }}
                />
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  This resolution remark is saved to the database and will be visible to the student when tracking their grievance.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setSelectedTicket(null)}>
                  Close
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary btn-sm">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  <span>Save Resolution & Update Status</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
