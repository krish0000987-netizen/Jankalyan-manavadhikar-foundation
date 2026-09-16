import React, { useState, useEffect } from 'react';
import { supabase } from '../../api/supabase';
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
  BookOpen
} from 'lucide-react';

export const SchemesManager = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingScheme, setEditingScheme] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [form, setForm] = useState({
    code: '',
    name: '',
    description: '',
    academic_year: '2026-27',
    grant_amount: 22000,
    application_start_date: '2026-09-15',
    application_end_date: '2026-11-30',
    application_fee: 211.30,
    is_active: true
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('scholarship_schemes')
        .select('*, scheme_eligibility_rules(*)')
        .order('created_at', { ascending: false });
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
      if (editingScheme) {
        const { error } = await supabase
          .from('scholarship_schemes')
          .update({
            name: form.name.trim(),
            description: form.description?.trim() || '',
            grant_amount: parseFloat(form.grant_amount) || 12000,
            academic_year: form.academic_year.trim(),
            application_start_date: form.application_start_date,
            application_end_date: form.application_end_date,
            application_fee: parseFloat(form.application_fee) || 211.30,
            is_active: form.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingScheme.id);
        if (error) throw error;
        setFeedback({ type: 'success', message: 'Scheme parameters updated successfully!' });
        setEditingScheme(null);
      } else {
        const { error } = await supabase
          .from('scholarship_schemes')
          .insert([{
            code: form.code.trim().toUpperCase(),
            name: form.name.trim(),
            description: form.description?.trim() || '',
            academic_year: form.academic_year.trim(),
            grant_amount: parseFloat(form.grant_amount) || 12000,
            application_start_date: form.application_start_date,
            application_end_date: form.application_end_date,
            application_fee: parseFloat(form.application_fee) || 211.30,
            is_fee_applicable: true,
            is_active: form.is_active
          }]);
        if (error) throw error;
        setFeedback({ type: 'success', message: 'New scholarship scheme published successfully!' });
        setShowAddModal(false);
      }
      loadData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save scheme.' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const startEdit = (scheme) => {
    setEditingScheme(scheme);
    setForm({
      code: scheme.code,
      name: scheme.name,
      description: scheme.description || '',
      academic_year: scheme.academic_year,
      grant_amount: scheme.grant_amount,
      application_start_date: scheme.application_start_date || '2026-09-15',
      application_end_date: scheme.application_end_date || '2026-11-30',
      application_fee: scheme.application_fee || 211.30,
      is_active: scheme.is_active
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GraduationCap size={24} color="#1E40AF" />
            <span>Scholarship Schemes & Eligibility Criteria</span>
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
            Configure financial grant amounts, application deadline windows, and applicant eligibility rules.
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
              code: `SCHEME-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`,
              name: '',
              description: '',
              academic_year: '2026-27',
              grant_amount: 22000,
              application_start_date: '2026-09-15',
              application_end_date: '2026-11-30',
              application_fee: 211.30,
              is_active: true
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

      {/* Schemes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', gridColumn: '1 / -1', color: '#64748B' }}>
            <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem' }} />
            <span>Loading schemes...</span>
          </div>
        ) : (
          schemes.map(scheme => {
            const rules = scheme.scheme_eligibility_rules?.[0] || {};
            return (
              <div key={scheme.id} className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', borderTop: `4px solid ${scheme.is_active ? '#1E40AF' : '#94A3B8'}` }}>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <span className="badge badge-navy" style={{ marginBottom: '0.4rem' }}>{scheme.code}</span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.3 }}>
                      {scheme.name}
                    </h3>
                    {scheme.description && (
                      <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.2rem' }}>
                        {scheme.description}
                      </div>
                    )}
                  </div>

                  <span className={`badge ${scheme.is_active ? 'badge-green' : 'badge-red'}`}>
                    {scheme.is_active ? 'Active' : 'Closed'}
                  </span>
                </div>

                {/* Key Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Grant Amount</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#16A34A', display: 'flex', alignItems: 'center', marginTop: '0.1rem' }}>
                      <IndianRupee size={15} />
                      <span>{Number(scheme.grant_amount || 12000).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Academic Session</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', marginTop: '0.1rem' }}>
                      {scheme.academic_year}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Registration Fee</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E40AF', marginTop: '0.1rem' }}>
                      ₹{Number(scheme.application_fee || 211.30).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Application Window */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#475569', marginBottom: '1.25rem' }}>
                  <Calendar size={15} color="#1E40AF" />
                  <span>
                    Application Window: <strong>{scheme.application_start_date || '2026-09-15'}</strong> to <strong>{scheme.application_end_date || '2026-11-30'}</strong>
                  </span>
                </div>

                {/* Eligibility Rules */}
                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Eligibility Criteria
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: '#334155' }}>
                    <div>• Minimum Qualifying Marks: <strong>{rules.min_percentage || 50}%</strong> in previous exam</div>
                    <div>• Maximum Annual Family Income: <strong>₹{Number(rules.max_annual_income || 300000).toLocaleString('en-IN')}</strong></div>
                    <div>• Eligible Categories: <strong>{(rules.eligible_categories || ['General', 'OBC', 'SC', 'ST']).join(', ')}</strong></div>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-outline btn-sm" onClick={() => startEdit(scheme)}>
                    <Edit3 size={14} />
                    <span>Configure Scheme</span>
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
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }}>
          <div className="card" style={{ width: '560px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem' }}>
              {editingScheme ? `Configure Scheme: ${editingScheme.code}` : 'Create New Scholarship Scheme'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.5rem' }}>
              Adjust grant disbursal amount, academic session dates, and application parameters.
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
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label required">Academic Year</label>
                  <input 
                    type="text"
                    className="form-control"
                    required
                    value={form.academic_year}
                    onChange={(e) => setForm({ ...form, academic_year: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label required">Scheme Title</label>
                <input 
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Jankalyan Post-Matric Merit Scholarship Scheme"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description / Scope</label>
                <textarea 
                  className="form-control"
                  rows={2}
                  placeholder="Brief details about beneficiaries and qualification..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label required">Grant Amount (₹ per student)</label>
                  <input 
                    type="number"
                    className="form-control"
                    required
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

              <div className="form-group">
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
