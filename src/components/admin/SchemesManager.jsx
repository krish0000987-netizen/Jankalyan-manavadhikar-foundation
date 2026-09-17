import React, { useState, useEffect } from 'react';
import { supabase } from '../../api/supabase';
import { useApp } from '../../context/AppContext';
import { toIsoDate } from '../../services/cmsService';
import { 
  GraduationCap, 
  Calendar, 
  IndianRupee, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Plus, 
  Loader2, 
  RefreshCw,
  ShieldCheck,
  BookOpen,
  Search,
  Filter,
  Check,
  AlertCircle,
  Clock,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export const SchemesManager = () => {
  const { refreshCMS } = useApp();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingScheme, setEditingScheme] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'CLOSED'

  const [form, setForm] = useState({
    code: '',
    name: '',
    description: '',
    academic_year: '2026-27',
    grant_amount: 12000,
    application_start_date: '2026-09-15',
    application_end_date: '2026-11-30',
    application_fee: 211.30,
    is_active: true,
    min_percentage: 50,
    max_annual_income: 300000,
    eligible_categories: ['General', 'OBC', 'SC', 'ST']
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('scholarship_schemes')
        .select('*, scheme_eligibility_rules(*)')
        .order('grant_amount', { ascending: true });
      if (error) throw error;
      setSchemes(data || []);
    } catch (err) {
      console.error('Error loading schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.code) return;
    setSubmitting(true);
    try {
      const grantNum = parseFloat(form.grant_amount) || 12000;
      const feeNum = parseFloat(form.application_fee) || 211.30;
      const minMarks = parseFloat(form.min_percentage) || 50;
      const maxIncome = parseFloat(form.max_annual_income) || 300000;

      if (editingScheme) {
        // 1. Update scholarship_schemes
        const { error } = await supabase
          .from('scholarship_schemes')
          .update({
            name: form.name.trim(),
            description: form.description?.trim() || '',
            grant_amount: grantNum,
            grant_amount_display: `₹${grantNum.toLocaleString('en-IN')}/- Yearly`,
            academic_year: form.academic_year.trim(),
            application_start_date: toIsoDate(form.application_start_date),
            application_end_date: toIsoDate(form.application_end_date),
            application_fee: feeNum,
            is_active: form.is_active,
            eligibility_overview: `Min ${minMarks}% marks in previous exam; family annual income up to ₹${maxIncome.toLocaleString('en-IN')}.`,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingScheme.id);

        if (error) throw error;

        // If editing the umbrella scheme, sync system_settings as well
        if (editingScheme.id === 'd0000000-0000-0000-0000-000000000001') {
          await supabase.from('system_settings').upsert([
            { key: 'grantAmount', value: grantNum, is_public: true, updated_at: new Date().toISOString() },
            { key: 'grantAmountDisplay', value: `₹${grantNum.toLocaleString('en-IN')}/- Yearly`, is_public: true, updated_at: new Date().toISOString() },
            { key: 'applicationStartDate', value: form.application_start_date, is_public: true, updated_at: new Date().toISOString() },
            { key: 'applicationClosingDate', value: form.application_end_date, is_public: true, updated_at: new Date().toISOString() }
          ], { onConflict: 'key' });
        }

        // 2. Update or insert scheme_eligibility_rules
        const existingRule = editingScheme.scheme_eligibility_rules?.[0];
        if (existingRule) {
          await supabase
            .from('scheme_eligibility_rules')
            .update({
              min_percentage: minMarks,
              max_annual_income: maxIncome,
              eligible_categories: form.eligible_categories || ['General', 'OBC', 'SC', 'ST']
            })
            .eq('id', existingRule.id);
        } else {
          await supabase
            .from('scheme_eligibility_rules')
            .insert([{
              scheme_id: editingScheme.id,
              min_percentage: minMarks,
              max_annual_income: maxIncome,
              eligible_categories: form.eligible_categories || ['General', 'OBC', 'SC', 'ST']
            }]);
        }

        setFeedback({ type: 'success', message: `Scheme "${form.name}" updated successfully!` });
        setEditingScheme(null);
      } else {
        // Insert new scheme
        const { data: newScheme, error } = await supabase
          .from('scholarship_schemes')
          .insert([{
            code: form.code.trim().toUpperCase(),
            name: form.name.trim(),
            description: form.description?.trim() || '',
            academic_year: form.academic_year.trim(),
            grant_amount: grantNum,
            grant_amount_display: `₹${grantNum.toLocaleString('en-IN')}/- Yearly`,
            application_start_date: toIsoDate(form.application_start_date),
            application_end_date: toIsoDate(form.application_end_date),
            application_fee: feeNum,
            is_fee_applicable: true,
            is_active: form.is_active,
            eligibility_overview: `Min ${minMarks}% marks; family annual income up to ₹${maxIncome.toLocaleString('en-IN')}.`
          }])
          .select()
          .single();

        if (error) throw error;

        if (newScheme) {
          await supabase
            .from('scheme_eligibility_rules')
            .insert([{
              scheme_id: newScheme.id,
              min_percentage: minMarks,
              max_annual_income: maxIncome,
              eligible_categories: form.eligible_categories || ['General', 'OBC', 'SC', 'ST']
            }]);
        }

        setFeedback({ type: 'success', message: 'New scholarship scheme created and published successfully!' });
        setShowAddModal(false);
      }
      await loadData();
      if (refreshCMS) {
        await refreshCMS();
      }
      try {
        localStorage.setItem('jmf_cms_updated', Date.now().toString());
      } catch (e) {}
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save scheme.' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleToggleStatus = async (scheme) => {
    const nextStatus = !scheme.is_active;
    try {
      const { error } = await supabase
        .from('scholarship_schemes')
        .update({ is_active: nextStatus, updated_at: new Date().toISOString() })
        .eq('id', scheme.id);

      if (error) throw error;

      setSchemes(prev => prev.map(s => s.id === scheme.id ? { ...s, is_active: nextStatus } : s));
      if (refreshCMS) {
        await refreshCMS();
      }
      try {
        localStorage.setItem('jmf_cms_updated', Date.now().toString());
      } catch (e) {}
      setFeedback({ 
        type: 'success', 
        message: `Scheme "${scheme.name}" is now ${nextStatus ? 'ACTIVE (Open for Applications)' : 'CLOSED'}` 
      });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const startEdit = (scheme) => {
    const rules = scheme.scheme_eligibility_rules?.[0] || {};
    setEditingScheme(scheme);
    setForm({
      code: scheme.code,
      name: scheme.name,
      description: scheme.description || '',
      academic_year: scheme.academic_year || '2026-27',
      grant_amount: scheme.grant_amount || 12000,
      application_start_date: scheme.application_start_date || '2026-09-15',
      application_end_date: scheme.application_end_date || '2026-11-30',
      application_fee: scheme.application_fee !== undefined ? scheme.application_fee : 211.30,
      is_active: scheme.is_active !== undefined ? scheme.is_active : true,
      min_percentage: rules.min_percentage !== undefined ? rules.min_percentage : 50,
      max_annual_income: rules.max_annual_income !== undefined ? rules.max_annual_income : 300000,
      eligible_categories: rules.eligible_categories || ['General', 'OBC', 'SC', 'ST']
    });
  };

  // Filter schemes by search and status
  const filteredSchemes = schemes.filter(s => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || 
      s.name.toLowerCase().includes(q) || 
      s.code.toLowerCase().includes(q) ||
      (s.description || '').toLowerCase().includes(q);

    const matchStatus = 
      filterStatus === 'ALL' ||
      (filterStatus === 'ACTIVE' && s.is_active) ||
      (filterStatus === 'CLOSED' && !s.is_active);

    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GraduationCap size={24} color="#1E40AF" />
            <span>Scholarship Schemes & Financial Grant Slabs</span>
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
            Manage and edit all scholarship tiers (₹4,000 to ₹22,000), eligibility cutoff rules, and application deadlines.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline btn-sm" onClick={loadData}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => {
            setEditingScheme(null);
            setForm({
              code: `JMF-SCH-0${schemes.length + 1}`,
              name: '',
              description: '',
              academic_year: '2026-27',
              grant_amount: 12000,
              application_start_date: '2026-09-15',
              application_end_date: '2026-11-30',
              application_fee: 211.30,
              is_active: true,
              min_percentage: 50,
              max_annual_income: 300000,
              eligible_categories: ['General', 'OBC', 'SC', 'ST']
            });
            setShowAddModal(true);
          }}>
            <Plus size={15} />
            <span>New Scheme</span>
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

      {/* Filter & Search Bar */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              className="form-control"
              placeholder="Search schemes by title, code (e.g. JMF-SCH-01), or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {[
              { id: 'ALL', label: `All Schemes (${schemes.length})` },
              { id: 'ACTIVE', label: `Active (${schemes.filter(s => s.is_active).length})` },
              { id: 'CLOSED', label: `Closed (${schemes.filter(s => !s.is_active).length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  border: '1px solid',
                  borderColor: filterStatus === tab.id ? '#1E40AF' : '#E2E8F0',
                  backgroundColor: filterStatus === tab.id ? '#EFF6FF' : '#FFFFFF',
                  color: filterStatus === tab.id ? '#1E40AF' : '#64748B',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', gridColumn: '1 / -1', color: '#64748B' }}>
            <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem' }} />
            <span>Loading scholarship schemes...</span>
          </div>
        ) : filteredSchemes.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', gridColumn: '1 / -1', color: '#64748B' }}>
            No scholarship schemes match your search filter.
          </div>
        ) : (
          filteredSchemes.map(scheme => {
            const rules = scheme.scheme_eligibility_rules?.[0] || {};
            return (
              <div 
                key={scheme.id} 
                className="card" 
                style={{ 
                  padding: '1.75rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  borderTop: `4px solid ${scheme.is_active ? '#1E40AF' : '#94A3B8'}`,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                  position: 'relative'
                }}
              >
                
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', gap: '0.5rem' }}>
                  <div>
                    <span className="badge badge-navy" style={{ marginBottom: '0.35rem', fontFamily: 'monospace', fontWeight: 700 }}>
                      {scheme.code}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.3 }}>
                      {scheme.name}
                    </h3>
                    {scheme.description && (
                      <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.35rem', lineHeight: 1.4 }}>
                        {scheme.description}
                      </div>
                    )}
                  </div>

                  <button 
                    type="button"
                    onClick={() => handleToggleStatus(scheme)}
                    title="Click to toggle Active/Closed status"
                    style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2px'
                    }}
                  >
                    <span className={`badge ${scheme.is_active ? 'badge-green' : 'badge-red'}`} style={{ cursor: 'pointer' }}>
                      {scheme.is_active ? '✓ Active' : '✕ Closed'}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: '#64748B' }}>Click to toggle</span>
                  </button>
                </div>

                {/* Key Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', backgroundColor: '#F8FAFC', padding: '0.85rem 1rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Grant Amount</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#16A34A', display: 'flex', alignItems: 'center', marginTop: '0.1rem' }}>
                      <IndianRupee size={15} />
                      <span>{Number(scheme.grant_amount || 12000).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Session</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', marginTop: '0.1rem' }}>
                      {scheme.academic_year}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Reg. Fee</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E40AF', marginTop: '0.1rem' }}>
                      ₹{Number(scheme.application_fee !== undefined ? scheme.application_fee : 211.30).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Application Window */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#475569', marginBottom: '1rem' }}>
                  <Calendar size={15} color="#1E40AF" />
                  <span>
                    Application Window: <strong>{scheme.application_start_date || '2026-09-15'}</strong> to <strong>{scheme.application_end_date || '2026-11-30'}</strong>
                  </span>
                </div>

                {/* Eligibility Criteria Box */}
                <div style={{ 
                  borderTop: '1px solid #E2E8F0', 
                  paddingTop: '0.85rem', 
                  marginBottom: '1.25rem',
                  backgroundColor: '#F8FAFC',
                  padding: '0.85rem',
                  borderRadius: '8px'
                }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#1E40AF', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <ShieldCheck size={14} />
                    <span>Eligibility Parameters</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.8rem', color: '#334155' }}>
                    <div>• Min Qualifying Marks: <strong>{rules.min_percentage !== undefined ? rules.min_percentage : 50}%</strong></div>
                    <div>• Max Family Income: <strong>₹{Number(rules.max_annual_income || 300000).toLocaleString('en-IN')}/year</strong></div>
                    <div>• Eligible Categories: <strong>{(rules.eligible_categories || ['General', 'OBC', 'SC', 'ST']).join(', ')}</strong></div>
                  </div>
                </div>

                {/* Card Action Button */}
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button className="btn btn-outline btn-sm" onClick={() => startEdit(scheme)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Edit3 size={14} />
                    <span>Configure / Edit Scheme</span>
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Edit / Add Modal */}
      {(editingScheme || showAddModal) && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '1rem'
        }}>
          <div className="card" style={{ width: '620px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Edit3 size={20} color="#1E40AF" />
              <span>{editingScheme ? `Configure Scheme: ${editingScheme.code}` : 'Create New Scholarship Scheme'}</span>
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '1.5rem' }}>
              Modify grant disbursal amounts, application deadlines, portal fee, and qualifying eligibility criteria.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label required">Scheme Code</label>
                  <input 
                    type="text"
                    className="form-control"
                    required
                    disabled={!!editingScheme}
                    placeholder="e.g. JMF-SCH-01"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  />
                  {editingScheme && <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Scheme code cannot be changed once assigned</span>}
                </div>
                <div className="form-group">
                  <label className="form-label required">Academic Session</label>
                  <input 
                    type="text"
                    className="form-control"
                    required
                    placeholder="2026-27"
                    value={form.academic_year}
                    onChange={(e) => setForm({ ...form, academic_year: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label required">Scheme Title (Bilingual / Descriptive)</label>
                <input 
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Class 11th & 12th Higher Secondary Scholarship"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description / Scope & Target Students</label>
                <textarea 
                  className="form-control"
                  rows={2}
                  placeholder="Describe student category, target qualification, or coverage..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label required">Grant Amount (₹ per Student)</label>
                  <input 
                    type="number"
                    className="form-control"
                    required
                    min="1000"
                    step="500"
                    value={form.grant_amount}
                    onChange={(e) => setForm({ ...form, grant_amount: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label required">Portal Application Fee (₹)</label>
                  <input 
                    type="number"
                    step="0.01"
                    className="form-control"
                    required
                    value={form.application_fee}
                    onChange={(e) => setForm({ ...form, application_fee: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label required">Application Start Date</label>
                  <input 
                    type="date"
                    className="form-control"
                    required
                    value={form.application_start_date}
                    onChange={(e) => setForm({ ...form, application_start_date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label required">Application Deadline</label>
                  <input 
                    type="date"
                    className="form-control"
                    required
                    value={form.application_end_date}
                    onChange={(e) => setForm({ ...form, application_end_date: e.target.value })}
                  />
                </div>
              </div>

              {/* Eligibility Parameters Section */}
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1rem', marginTop: '0.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1E40AF', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Candidate Eligibility Thresholds
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label required">Min Qualifying Exam Marks (%)</label>
                    <input 
                      type="number"
                      className="form-control"
                      required
                      min="33"
                      max="95"
                      value={form.min_percentage}
                      onChange={(e) => setForm({ ...form, min_percentage: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label required">Max Annual Family Income Ceiling (₹)</label>
                    <input 
                      type="number"
                      className="form-control"
                      required
                      step="10000"
                      value={form.max_annual_income}
                      onChange={(e) => setForm({ ...form, max_annual_income: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
                  <input 
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  />
                  <span>Scheme Open for Applications (Active)</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => {
                  setEditingScheme(null);
                  setShowAddModal(false);
                }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
