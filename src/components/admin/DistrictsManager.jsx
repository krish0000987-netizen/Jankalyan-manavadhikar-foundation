import React, { useState, useEffect, useMemo } from 'react';
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
  RefreshCw,
  Globe,
  Compass
} from 'lucide-react';
import { 
  getAllStates, 
  getDistrictsByState, 
  getBlocksByDistrict, 
  INDIA_STATES_DATA 
} from '../../data/indiaLocations';

export const DistrictsManager = () => {
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState('Madhya Pradesh');
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchDistrictQuery, setSearchDistrictQuery] = useState('');
  const [searchBlockQuery, setSearchBlockQuery] = useState('');
  
  // Modals
  const [showAddDistrictModal, setShowAddDistrictModal] = useState(false);
  const [showAddBlockModal, setShowAddBlockModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Form states
  const [districtForm, setDistrictForm] = useState({
    name: '',
    code: '',
    state: 'Madhya Pradesh'
  });

  const [blockForm, setBlockForm] = useState({
    name: '',
    code: ''
  });

  const allStates = useMemo(() => getAllStates(), []);

  const loadData = async (stateToLoad = selectedState) => {
    setLoading(true);
    try {
      const { data: dData, error: dErr } = await supabase
        .from('districts')
        .select('*, blocks(*)')
        .eq('state', stateToLoad)
        .order('name', { ascending: true });
      if (dErr) throw dErr;
      setDistricts(dData || []);
    } catch (err) {
      console.error('Error loading districts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedState);
  }, [selectedState]);

  // Compute merged districts for selected state
  const stateDistricts = useMemo(() => {
    // 1. Get districts from DB for this state
    const dbDistricts = districts.filter(d => 
      (d.state || '').trim().toLowerCase() === selectedState.trim().toLowerCase()
    );
    const dbMap = new Map();
    dbDistricts.forEach(d => dbMap.set(d.name.toLowerCase(), d));

    // 2. Get master districts for this state from indiaLocations
    const masterDistList = getDistrictsByState(selectedState);
    const merged = dbDistricts.map((d, dIdx) => {
      const existingBlocks = d.blocks || [];
      if (existingBlocks.length === 0) {
        const masterBlocks = getBlocksByDistrict(selectedState, d.name).map((b, bIdx) => ({
          id: `master-blk-${d.id || dIdx}-${bIdx}`,
          district_id: d.id,
          name: b,
          code: `${d.name.slice(0, 3).toUpperCase()}-${bIdx + 1}`,
          is_active: true,
          isMasterVirtual: true
        }));
        return { ...d, blocks: masterBlocks };
      }
      return d;
    });

    masterDistList.forEach((masterName, idx) => {
      if (!dbMap.has(masterName.toLowerCase())) {
        const fallbackBlocks = getBlocksByDistrict(selectedState, masterName).map((b, bIdx) => ({
          id: `fb-blk-${idx}-${bIdx}`,
          name: b,
          code: `${INDIA_STATES_DATA[selectedState]?.code || 'IN'}-${masterName.slice(0, 3).toUpperCase()}`,
          is_active: true
        }));

        merged.push({
          id: `master-${selectedState.slice(0, 3)}-${idx}`,
          name: masterName,
          code: `${INDIA_STATES_DATA[selectedState]?.code || 'IN'}-${masterName.slice(0, 3).toUpperCase()}`,
          state: selectedState,
          is_active: true,
          blocks: fallbackBlocks,
          isMasterVirtual: true
        });
      }
    });

    return merged.sort((a, b) => a.name.localeCompare(b.name));
  }, [districts, selectedState]);

  // Keep selectedDistrict synchronized when state changes
  useEffect(() => {
    if (stateDistricts.length > 0) {
      // If current selectedDistrict is not in this state, select the first
      const stillInState = stateDistricts.find(d => d.id === selectedDistrict?.id || d.name === selectedDistrict?.name);
      if (!stillInState) {
        setSelectedDistrict(stateDistricts[0]);
      } else {
        setSelectedDistrict(stillInState);
      }
    } else {
      setSelectedDistrict(null);
    }
  }, [selectedState, stateDistricts]);

  // Filter districts by search
  const filteredDistricts = useMemo(() => {
    if (!searchDistrictQuery) return stateDistricts;
    const q = searchDistrictQuery.toLowerCase();
    return stateDistricts.filter(d => 
      d.name.toLowerCase().includes(q) || (d.code && d.code.toLowerCase().includes(q))
    );
  }, [stateDistricts, searchDistrictQuery]);

  // Active blocks for selected district
  const districtBlocks = useMemo(() => {
    if (!selectedDistrict) return [];
    const blks = selectedDistrict.blocks || [];
    if (!searchBlockQuery) return blks;
    const q = searchBlockQuery.toLowerCase();
    return blks.filter(b => 
      b.name.toLowerCase().includes(q) || (b.code && b.code.toLowerCase().includes(q))
    );
  }, [selectedDistrict, searchBlockQuery]);

  // Handle Add District to currently active state
  const handleAddDistrict = async (e) => {
    e.preventDefault();
    if (!districtForm.name || !districtForm.code) return;
    setSubmitting(true);
    try {
      const stateToUse = districtForm.state || selectedState;
      const { data, error } = await supabase.from('districts').insert([{
        name: districtForm.name.trim(),
        code: districtForm.code.trim().toUpperCase(),
        state: stateToUse.trim(),
        is_active: true
      }]).select();
      if (error) throw error;

      setFeedback({ type: 'success', message: `District "${districtForm.name}" created successfully under ${stateToUse}!` });
      setDistrictForm({ name: '', code: '', state: selectedState });
      setShowAddDistrictModal(false);
      await loadData();
      if (data && data[0]) {
        setSelectedState(stateToUse);
        setSelectedDistrict(data[0]);
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to add district.' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  // Handle Add Block to currently active district
  const handleAddBlock = async (e) => {
    e.preventDefault();
    if (!blockForm.name || !blockForm.code || !selectedDistrict) return;
    setSubmitting(true);
    try {
      let activeDistId = selectedDistrict.id;

      // If district was a virtual master record, ensure it is created in DB first
      if (selectedDistrict.isMasterVirtual || activeDistId.startsWith('master-')) {
        const { data: newDist, error: distErr } = await supabase.from('districts').insert([{
          name: selectedDistrict.name,
          code: selectedDistrict.code,
          state: selectedState,
          is_active: true
        }]).select();
        if (distErr && !distErr.message.includes('unique')) throw distErr;
        if (newDist && newDist[0]) {
          activeDistId = newDist[0].id;
        }
      }

      const { error } = await supabase.from('blocks').insert([{
        name: blockForm.name.trim(),
        code: blockForm.code.trim().toUpperCase(),
        district_id: activeDistId,
        is_active: true
      }]);
      if (error) throw error;

      setFeedback({ type: 'success', message: `Block "${blockForm.name}" added to ${selectedDistrict.name}!` });
      setBlockForm({ name: '', code: '' });
      setShowAddBlockModal(false);
      await loadData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to add block.' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const toggleDistrictStatus = async (district) => {
    if (district.isMasterVirtual) {
      // Save to db with opposite status
      try {
        await supabase.from('districts').insert([{
          name: district.name,
          code: district.code,
          state: selectedState,
          is_active: !district.is_active
        }]);
        loadData();
      } catch (err) {
        console.error(err);
      }
      return;
    }
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

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Compass size={24} color="#1E40AF" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              State, District & Block Administrative Hierarchy
            </h2>
          </div>
          <p style={{ color: '#64748B', fontSize: '0.85rem', margin: 0 }}>
            Cascading geographical jurisdiction workflow: <strong style={{ color: '#1E40AF' }}>State &gt; District &gt; Blocks / Tehsils</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline btn-sm" onClick={loadData} title="Refresh records">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button 
            className="btn btn-primary btn-sm" 
            onClick={() => {
              setDistrictForm({ name: '', code: '', state: selectedState });
              setShowAddDistrictModal(true);
            }}
          >
            <Plus size={15} />
            <span>Add District to {selectedState}</span>
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

      {/* Workflow Navigation Bar: Step 1 State Selector */}
      <div className="card" style={{ padding: '1.25rem', backgroundColor: '#F8FAFC', border: '1.5px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: '#1E3A8A', fontSize: '0.9rem' }}>
              <Globe size={18} color="#2563EB" />
              <span>Step 1: Select State / UT (राज्य):</span>
            </div>

            <select 
              className="form-control"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              style={{ minWidth: '240px', fontWeight: 700, borderColor: '#3B82F6', backgroundColor: '#FFFFFF' }}
            >
              {allStates.map(st => {
                const isUT = INDIA_STATES_DATA[st]?.isUT;
                return (
                  <option key={st} value={st}>
                    {st} {isUT ? '(UT)' : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Breadcrumb indicator */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.4rem', 
            fontSize: '0.82rem', 
            color: '#475569', 
            backgroundColor: '#FFFFFF', 
            padding: '0.4rem 0.85rem', 
            borderRadius: '8px', 
            border: '1px solid #CBD5E1' 
          }}>
            <span style={{ fontWeight: 800, color: '#1E40AF' }}>🇮🇳 India</span>
            <span>&gt;</span>
            <span style={{ fontWeight: 800, color: '#0F172A' }}>{selectedState}</span>
            <span>&gt;</span>
            <span style={{ fontWeight: 800, color: '#2563EB' }}>{selectedDistrict ? selectedDistrict.name : 'Select District'}</span>
            <span>&gt;</span>
            <span style={{ color: '#16A34A', fontWeight: 700 }}>{selectedDistrict?.blocks?.length || 0} Blocks</span>
          </div>

        </div>
      </div>

      {/* 2-Column Hierarchical Layout: Districts on Left (Level 2), Blocks on Right (Level 3) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Left: Districts in selected state */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '650px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={16} color="#2563EB" />
                <span>Districts in {selectedState}</span>
                <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>{filteredDistricts.length}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Step 2: Choose district to load jurisdiction blocks
              </div>
            </div>

            <div style={{ position: 'relative', width: '180px' }}>
              <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text"
                className="form-control"
                placeholder="Search district..."
                value={searchDistrictQuery}
                onChange={(e) => setSearchDistrictQuery(e.target.value)}
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
                No districts matching query. Click "Add District" to create one.
              </div>
            ) : (
              filteredDistricts.map(district => {
                const isSelected = selectedDistrict?.name === district.name;
                const blockCount = district.blocks?.length || 0;
                return (
                  <div 
                    key={district.id || district.name}
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
                      <div style={{ fontWeight: 800, color: isSelected ? '#1E40AF' : '#0F172A', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span>{district.name}</span>
                        {district.isMasterVirtual && (
                          <span style={{ fontSize: '0.65rem', backgroundColor: '#F1F5F9', color: '#475569', padding: '1px 5px', borderRadius: '4px' }}>
                            National
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>
                        Code: <strong style={{ color: '#1E293B' }}>{district.code || '-'}</strong> • {blockCount} Blocks • {selectedState}
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

        {/* Right: Blocks for Selected District (Level 3) */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '650px' }}>
          {selectedDistrict ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Layers size={16} color="#16A34A" />
                    <span>Blocks in {selectedDistrict.name}</span>
                    <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>{districtBlocks.length}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    Step 3: Administrative Tehsils & Blocks under {selectedDistrict.name}, {selectedState}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: '150px' }}>
                    <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="text"
                      className="form-control"
                      placeholder="Filter block..."
                      value={searchBlockQuery}
                      onChange={(e) => setSearchBlockQuery(e.target.value)}
                      style={{ paddingLeft: '1.8rem', height: '32px', fontSize: '0.75rem' }}
                    />
                  </div>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowAddBlockModal(true)}
                    style={{ height: '32px', padding: '0 0.75rem', fontSize: '0.75rem' }}
                  >
                    <Plus size={13} />
                    <span>Add Block</span>
                  </button>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                <table className="data-table" style={{ fontSize: '0.85rem' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '0.6rem 0.75rem' }}>Block / Tehsil Name</th>
                      <th style={{ padding: '0.6rem 0.75rem' }}>Block Code</th>
                      <th style={{ padding: '0.6rem 0.75rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {districtBlocks.map(b => (
                      <tr key={b.id || b.name}>
                        <td style={{ fontWeight: 700, color: '#0F172A', padding: '0.65rem 0.75rem' }}>
                          🏛️ {b.name}
                        </td>
                        <td style={{ padding: '0.65rem 0.75rem', color: '#64748B', fontFamily: 'monospace' }}>
                          {b.code || '-'}
                        </td>
                        <td style={{ padding: '0.65rem 0.75rem' }}>
                          <span className={`badge ${b.is_active !== false ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.7rem' }}>
                            {b.is_active !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {districtBlocks.length === 0 && (
                      <tr>
                        <td colSpan={3} style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748B' }}>
                          No administrative blocks found in this district. Click "Add Block" to create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8' }}>
              <Layers size={36} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
              <p style={{ margin: 0 }}>Select a district on the left to view registered administrative blocks.</p>
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
              Add District to {selectedState}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.25rem' }}>
              Register an official district jurisdiction for the scholarship portal.
            </p>

            <form onSubmit={handleAddDistrict} className="space-y-4">
              <div className="form-group">
                <label className="form-label required">State / UT (राज्य)</label>
                <select 
                  className="form-control"
                  value={districtForm.state || selectedState}
                  onChange={(e) => setDistrictForm({ ...districtForm, state: e.target.value })}
                >
                  {allStates.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label required">District Name (जिले का नाम)</label>
                <input 
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Jabalpur / लखनऊ / पटना"
                  value={districtForm.name}
                  onChange={(e) => setDistrictForm({ ...districtForm, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label required">District Code (3-4 Chars)</label>
                <input 
                  type="text"
                  className="form-control"
                  required
                  maxLength={10}
                  placeholder="e.g. JBP / LKO / PAT"
                  value={districtForm.code}
                  onChange={(e) => setDistrictForm({ ...districtForm, code: e.target.value.toUpperCase() })}
                />
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
              Add Block to {selectedDistrict?.name} ({selectedState})
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.25rem' }}>
              Register a new administrative block / tehsil under this district.
            </p>

            <form onSubmit={handleAddBlock} className="space-y-4">
              <div className="form-group">
                <label className="form-label required">Block Name (ब्लॉक / तहसील का नाम)</label>
                <input 
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Patan / Berasia / पाटन"
                  value={blockForm.name}
                  onChange={(e) => setBlockForm({ ...blockForm, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label required">Block Code</label>
                <input 
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. PAT-01"
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
