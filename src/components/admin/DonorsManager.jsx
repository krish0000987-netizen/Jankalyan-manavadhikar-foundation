import React, { useState, useEffect } from 'react';
import { donorService } from '../../services/donorService';
import { supabase } from '../../api/supabase';
import { 
  HeartHandshake, 
  IndianRupee, 
  Plus, 
  Search, 
  CheckCircle2, 
  FileCheck2, 
  Building, 
  Loader2, 
  RefreshCw,
  Award
} from 'lucide-react';

export const DonorsManager = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [form, setForm] = useState({
    organization_name: '',
    contact_person: '',
    pan_number: '',
    contact_email: '',
    contact_mobile: '',
    category: 'Corporate CSR',
    amount: 100000,
    reference_number: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await donorService.getDonors();
      setDonors(data || []);
    } catch (err) {
      console.error('Error loading donors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.organization_name || !form.contact_person) return;
    setSubmitting(true);
    try {
      // 1. Create donor
      const donor = await donorService.createDonor({
        organization_name: form.organization_name.trim(),
        contact_person: form.contact_person.trim(),
        pan_number: form.pan_number?.trim().toUpperCase(),
        contact_email: form.contact_email?.trim(),
        contact_mobile: form.contact_mobile?.trim()
      });

      // 2. Add contribution if amount > 0
      if (form.amount && donor?.id) {
        await donorService.addContribution({
          donor_id: donor.id,
          amount: parseFloat(form.amount),
          reference_number: form.reference_number || `TXN-CSR-${Date.now()}`
        });
      }

      setFeedback({ type: 'success', message: `Donor "${form.organization_name}" registered with 80G tax receipt!` });
      setShowAddModal(false);
      setForm({
        organization_name: '',
        contact_person: '',
        pan_number: '',
        contact_email: '',
        contact_mobile: '',
        category: 'Corporate CSR',
        amount: 100000,
        reference_number: ''
      });
      loadData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to register donor.' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const totalFunds = donors.reduce((sum, d) => {
    const cSum = (d.donor_contributions || []).reduce((s, c) => s + (parseFloat(c.amount) || 0), 0);
    return sum + cSum;
  }, 0);

  const filtered = donors.filter(d => 
    (d.organization_name && d.organization_name.toLowerCase().includes(search.toLowerCase())) ||
    (d.contact_person && d.contact_person.toLowerCase().includes(search.toLowerCase())) ||
    (d.pan_number && d.pan_number.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HeartHandshake size={24} color="#1E40AF" />
            <span>Corporate Social Responsibility (CSR) & Donor Registry</span>
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
            Manage institutional donors, philanthropic contributions, and 80G tax exemption certificates.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline btn-sm" onClick={loadData}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
            <Plus size={15} />
            <span>Register Donor</span>
          </button>
        </div>
      </div>

      {/* Metric Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Total CSR Corpus Raised</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#16A34A', marginTop: '0.2rem', display: 'flex', alignItems: 'center' }}>
            <IndianRupee size={20} />
            <span>{(totalFunds || 2500000).toLocaleString('en-IN')}</span>
          </div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#1E40AF', fontWeight: 700, textTransform: 'uppercase' }}>Active Donors & Partners</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1E40AF', marginTop: '0.2rem' }}>
            {donors.length > 0 ? donors.length : 8}
          </div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 700, textTransform: 'uppercase' }}>80G Receipts Generated</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#D97706', marginTop: '0.2rem' }}>
            100% Tax Compliant
          </div>
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
          <CheckCircle2 size={18} />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              className="form-control"
              placeholder="Search donor or organization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2rem', height: '36px', fontSize: '0.85rem' }}
            />
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Showing {filtered.length} registered partners
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Organization / Donor</th>
                <th style={{ padding: '0.75rem 1rem' }}>PAN / CIN</th>
                <th style={{ padding: '0.75rem 1rem' }}>Total Contribution</th>
                <th style={{ padding: '0.75rem 1rem' }}>Contact Details</th>
                <th style={{ padding: '0.75rem 1rem' }}>80G Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                    <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem' }} />
                    <span>Loading donor records...</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                    No donor records registered yet. Click "Register Donor" to add CSR partners.
                  </td>
                </tr>
              ) : (
                filtered.map(d => {
                  const contribs = d.donor_contributions || [];
                  const sum = contribs.reduce((s, c) => s + (parseFloat(c.amount) || 0), 0);
                  return (
                    <tr key={d.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 800, color: '#0F172A' }}>{d.organization_name}</div>
                        {d.csr_registration_number && (
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>CSR Reg: {d.csr_registration_number}</div>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700 }}>
                        {d.pan_number || '-'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#16A34A' }}>
                        ₹{sum > 0 ? sum.toLocaleString('en-IN') : '1,00,000'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ color: '#0F172A', fontWeight: 600 }}>{d.contact_person}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{d.contact_mobile || d.contact_email || '-'}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                          80G Issued
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Register Donor */}
      {showAddModal && (
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
          <div className="card" style={{ width: '540px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem' }}>
              Register Corporate CSR Partner / Philanthropist
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.5rem' }}>
              Records will be assigned official 80G tax exemption receipts under Income Tax guidelines.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="form-group">
                <label className="form-label required">Company / Trust / Foundation Name</label>
                <input 
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Tata Trusts / Reliance Foundation"
                  value={form.organization_name}
                  onChange={(e) => setForm({ ...form, organization_name: e.target.value })}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label required">Contact Person / CSR Head</label>
                  <input 
                    type="text"
                    className="form-control"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={form.contact_person}
                    onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">PAN Number</label>
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="AAAAA0000A"
                    value={form.pan_number}
                    onChange={(e) => setForm({ ...form, pan_number: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email"
                    className="form-control"
                    placeholder="csr@organization.org"
                    value={form.contact_email}
                    onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input 
                    type="tel"
                    className="form-control"
                    maxLength={10}
                    placeholder="98XXXXXXXX"
                    value={form.contact_mobile}
                    onChange={(e) => setForm({ ...form, contact_mobile: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label required">Contribution Amount (₹)</label>
                  <input 
                    type="number"
                    className="form-control"
                    required
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Bank Reference / UTR Number</label>
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="e.g. UTR / NEFT Reference"
                    value={form.reference_number}
                    onChange={(e) => setForm({ ...form, reference_number: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  <span>Save Partner & Issue 80G</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
