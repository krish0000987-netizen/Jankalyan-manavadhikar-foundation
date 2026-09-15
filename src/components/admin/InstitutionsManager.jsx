import React, { useState, useEffect } from 'react';
import { supabase } from '../../api/supabase';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Loader2, 
  RefreshCw,
  School,
  GraduationCap
} from 'lucide-react';

export const InstitutionsManager = () => {
  const [institutions, setInstitutions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [districtFilter, setDistrictFilter] = useState('ALL');

  // Modal & Form
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [form, setForm] = useState({
    name: '',
    code: '',
    type: 'School',
    district_id: '',
    block_id: '',
    csc_name: '',
    affiliation_board: 'MP Board',
    contact_person: '',
    mobile: '',
    email: '',
    is_verified: true,
    is_active: true
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [{ data: instData }, { data: distData }, { data: blkData }] = await Promise.all([
        supabase.from('institutions').select('*, districts(name), blocks(name)').order('name', { ascending: true }),
        supabase.from('districts').select('id, name').order('name', { ascending: true }),
        supabase.from('blocks').select('id, name, district_id').order('name', { ascending: true })
      ]);
      setInstitutions(instData || []);
      setDistricts(distData || []);
      setBlocks(blkData || []);
      if (distData?.length > 0 && !form.district_id) {
        const firstDistId = distData[0].id;
        const matchingBlk = (blkData || []).find(b => b.district_id === firstDistId);
        setForm(prev => ({ 
          ...prev, 
          district_id: firstDistId,
          block_id: matchingBlk?.id || ''
        }));
      }
    } catch (err) {
      console.error('Error loading institutions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.code || !form.district_id) return;
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        category: form.type || 'School',
        district_id: form.district_id,
        block_id: form.block_id || null,
        address: form.address || '',
        principal_name: form.contact_person || form.principal_name || '',
        contact_phone: form.mobile || form.contact_phone || '',
        contact_email: form.email || form.contact_email || '',
        verification_status: 'VERIFIED',
        is_active: true
      };
      const { error } = await supabase.from('institutions').insert([payload]);
      if (error) throw error;
      setFeedback({ type: 'success', message: `Institution "${form.name}" registered successfully with assigned District & Block Cells!` });
      setShowAddModal(false);
      setForm({
        name: '',
        code: '',
        type: 'School',
        district_id: districts[0]?.id || '',
        block_id: '',
        csc_name: '',
        affiliation_board: 'MP Board',
        contact_person: '',
        mobile: '',
        email: '',
        is_verified: true,
        is_active: true
      });
      loadData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to register institution.' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const toggleVerify = async (inst) => {
    try {
      const newStatus = (inst.verification_status === 'VERIFIED' || inst.is_verified) ? 'PENDING' : 'VERIFIED';
      const { error } = await supabase
        .from('institutions')
        .update({ verification_status: newStatus })
        .eq('id', inst.id);
      if (error) throw error;
      loadData();
    } catch (err) {
      console.error('Toggle verify error:', err);
    }
  };

  const filtered = institutions.filter(inst => {
    const matchesSearch = inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.code.toLowerCase().includes(search.toLowerCase()) ||
      (inst.contact_person && inst.contact_person.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === 'ALL' || inst.type === typeFilter;
    const matchesDistrict = districtFilter === 'ALL' || inst.district_id === districtFilter;
    return matchesSearch && matchesType && matchesDistrict;
  });

  const verifiedCount = institutions.filter(i => i.is_verified).length;
  const schoolCount = institutions.filter(i => i.type === 'School').length;
  const collegeCount = institutions.filter(i => i.type === 'College' || i.type === 'University').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={24} color="#1E40AF" />
            <span>Participating Educational Institutions</span>
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
            Affiliated schools, colleges, and nodal verification centers under the scholarship program.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline btn-sm" onClick={loadData}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
            <Plus size={15} />
            <span>Register Institution</span>
          </button>
        </div>
      </div>

      {/* Metric Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Total Registered</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A', marginTop: '0.2rem' }}>{institutions.length}</div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 700, textTransform: 'uppercase' }}>Verified Nodal Centers</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#16A34A', marginTop: '0.2rem' }}>{verifiedCount}</div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#1E40AF', fontWeight: 700, textTransform: 'uppercase' }}>Affiliated Schools</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1E40AF', marginTop: '0.2rem' }}>{schoolCount}</div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 700, textTransform: 'uppercase' }}>Colleges & Universities</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#D97706', marginTop: '0.2rem' }}>{collegeCount}</div>
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

      {/* Filter Bar */}
      <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            className="form-control"
            placeholder="Search by institution name, code, or nodal officer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.25rem', height: '38px', fontSize: '0.85rem' }}
          />
        </div>

        <select 
          className="form-control" 
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{ width: '160px', height: '38px', fontSize: '0.85rem' }}
        >
          <option value="ALL">All Types</option>
          <option value="School">Schools</option>
          <option value="College">Colleges</option>
          <option value="University">Universities</option>
          <option value="Institute">Institutes / ITI</option>
        </select>

        <select 
          className="form-control" 
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          style={{ width: '180px', height: '38px', fontSize: '0.85rem' }}
        >
          <option value="ALL">All Districts</option>
          {districts.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Code</th>
                <th style={{ padding: '0.75rem 1rem' }}>Institution Name & Affiliation</th>
                <th style={{ padding: '0.75rem 1rem' }}>District</th>
                <th style={{ padding: '0.75rem 1rem' }}>Type</th>
                <th style={{ padding: '0.75rem 1rem' }}>Nodal Contact</th>
                <th style={{ padding: '0.75rem 1rem' }}>Verification</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                    <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem' }} />
                    <span>Loading institutions...</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                    No institutions match the current search filters.
                  </td>
                </tr>
              ) : (
                filtered.map(inst => {
                  const isVerified = inst.verification_status === 'VERIFIED' || inst.is_verified;
                  return (
                    <tr key={inst.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 800, color: '#1E40AF' }}>
                        {inst.code}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 800, color: '#0F172A' }}>{inst.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{inst.affiliation_board || 'State Board'}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 700, color: '#1E40AF', fontSize: '0.825rem' }}>
                          📍 {inst.districts?.name || 'District Cell'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                          🏛️ {inst.blocks?.name || 'Assigned Block'}
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span className="badge badge-navy" style={{ fontSize: '0.7rem' }}>
                          {inst.category || inst.type || 'School'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 600, color: '#0F172A' }}>{inst.principal_name || inst.contact_person || '-'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{inst.contact_phone || inst.mobile || inst.contact_email || inst.email || '-'}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span className={`badge ${isVerified ? 'badge-green' : 'badge-yellow'}`} style={{ fontSize: '0.7rem' }}>
                          {isVerified ? 'Verified Nodal' : 'Pending Review'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <button 
                          onClick={() => toggleVerify(inst)}
                          className={`btn ${isVerified ? 'btn-outline' : 'btn-primary'} btn-sm`}
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                        >
                          {isVerified ? 'Revoke Status' : 'Verify Nodal'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Register Institution */}
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
          <div className="card" style={{ width: '560px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem' }}>
              Register Participating Institution
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.5rem' }}>
              Add a school, college, or university nodal center for student document verification.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="form-group">
                <label className="form-label required">Institution Full Name</label>
                <input 
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Govt Model Higher Secondary School"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label required">Institution Code (DISE/AISHE)</label>
                  <input 
                    type="text"
                    className="form-control"
                    required
                    placeholder="e.g. INST-JBL-001"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label required">Institution Type</label>
                  <select 
                    className="form-control"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="School">Higher Secondary School</option>
                    <option value="College">Degree College</option>
                    <option value="University">University</option>
                    <option value="Institute">Technical / ITI Institute</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label required">District Cell (जिला प्रकोष्ठ)</label>
                  <select 
                    className="form-control"
                    value={form.district_id}
                    onChange={(e) => {
                      const newDistId = e.target.value;
                      const matchingBlk = blocks.find(b => b.district_id === newDistId);
                      setForm({ 
                        ...form, 
                        district_id: newDistId,
                        block_id: matchingBlk?.id || ''
                      });
                    }}
                  >
                    {districts.map(d => (
                      <option key={d.id} value={d.id}>{d.name_en || d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Block Cell (ब्लॉक प्रकोष्ठ)</label>
                  <select 
                    className="form-control"
                    value={form.block_id}
                    onChange={(e) => setForm({ ...form, block_id: e.target.value })}
                  >
                    <option value="">-- Select Assigned Block Cell --</option>
                    {blocks
                      .filter(b => !form.district_id || b.district_id === form.district_id)
                      .map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Affiliation Board / Council</label>
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="e.g. MP Board / CBSE / UGC"
                    value={form.affiliation_board}
                    onChange={(e) => setForm({ ...form, affiliation_board: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Linked CSC Facilitation Center (Optional)</label>
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="e.g. Jabalpur Digital CSC Center"
                    value={form.csc_name}
                    onChange={(e) => setForm({ ...form, csc_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Nodal Officer Name</label>
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="Principal / In-Charge"
                    value={form.contact_person}
                    onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Mobile</label>
                  <input 
                    type="tel"
                    className="form-control"
                    maxLength={10}
                    placeholder="10-digit mobile"
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Official Email</label>
                <input 
                  type="email"
                  className="form-control"
                  placeholder="nodal.school@jankalyan.org"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  <span>Register Center</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
