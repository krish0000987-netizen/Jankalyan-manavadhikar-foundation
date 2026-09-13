import React, { useState, useEffect } from 'react';
import { supabase } from '../../api/supabase';
import { 
  MapPin, 
  Plus, 
  Search, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Building, 
  Layers, 
  Trash2, 
  Edit3, 
  Loader2,
  RefreshCw
} from 'lucide-react';

export const DistrictsManager = () => {
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [showAddDistrictModal, setShowAddDistrictModal] = useState(false);
  const [showAddBlockModal, setShowAddBlockModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Form states
  const [districtForm, setDistrictForm] = useState({
    name_en: '',
    name_hi: '',
    code: '',
    state: 'Madhya Pradesh'
  });

  const [blockForm, setBlockForm] = useState({
    name_en: '',
    name_hi: '',
    code: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: dData, error: dErr } = await supabase
        .from('districts')
        .select('*, blocks(*)')
        .order('name_en', { ascending: true });
      if (dErr) throw dErr;
      setDistricts(dData || []);
      if (dData?.length > 0 && !selectedDistrict) {
        setSelectedDistrict(dData[0]);
      } else if (selectedDistrict) {
        const updated = dData.find(d => d.id === selectedDistrict.id);
        setSelectedDistrict(updated || dData[0]);
      }
    } catch (err) {
      console.error('Error loading districts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddDistrict = async (e) => {
    e.preventDefault();
    if (!districtForm.name_en || !districtForm.code) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('districts').insert([districtForm]);
      if (error) throw error;
      setFeedback({ type: 'success', message: `District "${districtForm.name_en}" created successfully!` });
      setDistrictForm({ name_en: '', name_hi: '', code: '', state: 'Madhya Pradesh' });
      setShowAddDistrictModal(false);
      loadData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to add district.' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleAddBlock = async (e) => {
    e.preventDefault();
    if (!blockForm.name_en || !blockForm.code || !selectedDistrict) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('blocks').insert([{
        ...blockForm,
        district_id: selectedDistrict.id
      }]);
      if (error) throw error;
      setFeedback({ type: 'success', message: `Block "${blockForm.name_en}" added to ${selectedDistrict.name_en}!` });
      setBlockForm({ name_en: '', name_hi: '', code: '' });
      setShowAddBlockModal(false);
      loadData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to add block.' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const toggleDistrictStatus = async (district) => {
    try {
      const { error } = await supabase
        .from('districts')
        .update({ is_active: !district.is_active })
        .eq('id', district.id);
      if (error) throw error;
      loadData();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const filteredDistricts = districts.filter(d => 
    d.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.name_hi && d.name_hi.includes(searchQuery)) ||
    d.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={24} color="#1E40AF" />
            <span>Districts & Administrative Blocks Management</span>
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
            Manage geographical jurisdictions, coordinator assignments, and local block operations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline btn-sm" onClick={loadData} title="Refresh records">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddDistrictModal(true)}>
            <Plus size={15} />
            <span>Add District</span>
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

      {/* 2-Column Layout: Districts on Left, Blocks on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Left: Districts List */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>
              Districts ({filteredDistricts.length})
            </div>
            <div style={{ position: 'relative', width: '200px' }}>
              <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text"
                className="form-control"
                placeholder="Search district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2rem', height: '34px', fontSize: '0.8rem' }}
              />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '4px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748B' }}>
                <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem' }} />
                <span>Loading districts...</span>
              </div>
            ) : filteredDistricts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748B' }}>
                No districts found. Click "Add District" to create one.
              </div>
            ) : (
              filteredDistricts.map(district => {
                const isSelected = selectedDistrict?.id === district.id;
                const blockCount = district.blocks?.length || 0;
                return (
                  <div 
                    key={district.id}
                    onClick={() => setSelectedDistrict(district)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '10px',
                      border: `1.5px solid ${isSelected ? '#1E40AF' : '#E2E8F0'}`,
                      backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, color: isSelected ? '#1E40AF' : '#0F172A', fontSize: '0.95rem' }}>
                        {district.name_en} {district.name_hi && <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>({district.name_hi})</span>}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>
                        Code: <strong style={{ color: '#1E293B' }}>{district.code}</strong> • {blockCount} Blocks • {district.state}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDistrictStatus(district);
                        }}
                        className={`badge ${district.is_active ? 'badge-green' : 'badge-red'}`}
                        style={{ border: 'none', cursor: 'pointer', fontSize: '0.7rem' }}
                        title="Click to toggle active status"
                      >
                        {district.is_active ? 'Active' : 'Inactive'}
                      </button>
                      <ChevronRight size={16} color={isSelected ? '#1E40AF' : '#94A3B8'} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Blocks for Selected District */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '640px' }}>
          {selectedDistrict ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#1E40AF', fontWeight: 800 }}>
                    Selected District
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                    {selectedDistrict.name_en} ({selectedDistrict.code})
                  </div>
                </div>

                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowAddBlockModal(true)}
                >
                  <Plus size={14} />
                  <span>Add Block</span>
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', textAlign: 'left' }}>
                      <th style={{ padding: '0.6rem 0.75rem' }}>Block Name (English)</th>
                      <th style={{ padding: '0.6rem 0.75rem' }}>Block Name (Hindi)</th>
                      <th style={{ padding: '0.6rem 0.75rem' }}>Code</th>
                      <th style={{ padding: '0.6rem 0.75rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedDistrict.blocks || []).map(b => (
                      <tr key={b.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '0.75rem', fontWeight: 700, color: '#0F172A' }}>
                          {b.name_en}
                        </td>
                        <td style={{ padding: '0.75rem', color: '#475569' }}>
                          {b.name_hi || '-'}
                        </td>
                        <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontWeight: 600 }}>
                          {b.code}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span className={`badge ${b.is_active ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.7rem' }}>
                            {b.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {(selectedDistrict.blocks || []).length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748B' }}>
                          No administrative blocks registered in this district yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748B' }}>
              Select a district to view registered blocks.
            </div>
          )}
        </div>

      </div>

      {/* Modal: Add District */}
      {showAddDistrictModal && (
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
          <div className="card" style={{ width: '460px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
              Add New District
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.25rem' }}>
              Configure a new operational district under Jankalyan Foundation jurisdiction.
            </p>

            <form onSubmit={handleAddDistrict} className="space-y-4">
              <div className="form-group">
                <label className="form-label required">District Name (English)</label>
                <input 
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Bhopal"
                  value={districtForm.name_en}
                  onChange={(e) => setDistrictForm({ ...districtForm, name_en: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">District Name (Hindi)</label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="उदा. भोपाल"
                  value={districtForm.name_hi}
                  onChange={(e) => setDistrictForm({ ...districtForm, name_hi: e.target.value })}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label required">District Code</label>
                  <input 
                    type="text"
                    className="form-control"
                    required
                    placeholder="e.g. BHO"
                    value={districtForm.code}
                    onChange={(e) => setDistrictForm({ ...districtForm, code: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input 
                    type="text"
                    className="form-control"
                    value={districtForm.state}
                    onChange={(e) => setDistrictForm({ ...districtForm, state: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowAddDistrictModal(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  <span>Save District</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Block */}
      {showAddBlockModal && (
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
          <div className="card" style={{ width: '460px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
              Add Block to {selectedDistrict?.name_en}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.25rem' }}>
              Register a new administrative block / tehsil.
            </p>

            <form onSubmit={handleAddBlock} className="space-y-4">
              <div className="form-group">
                <label className="form-label required">Block Name (English)</label>
                <input 
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Berasia"
                  value={blockForm.name_en}
                  onChange={(e) => setBlockForm({ ...blockForm, name_en: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Block Name (Hindi)</label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="उदा. बैरसिया"
                  value={blockForm.name_hi}
                  onChange={(e) => setBlockForm({ ...blockForm, name_hi: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label required">Block Code</label>
                <input 
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. BER"
                  value={blockForm.code}
                  onChange={(e) => setBlockForm({ ...blockForm, code: e.target.value.toUpperCase() })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowAddBlockModal(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  <span>Save Block</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
