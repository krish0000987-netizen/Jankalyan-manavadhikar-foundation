import React, { useState, useEffect } from 'react';
import { meritService } from '../../services/meritService';
import { supabase } from '../../api/supabase';
import { reportService } from '../../services/reportService';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Sliders, 
  FileText, 
  Plus, 
  Loader2, 
  RefreshCw,
  ExternalLink,
  Users,
  Download,
  Printer,
  Trash2,
  Search,
  Check,
  Globe
} from 'lucide-react';

export const MeritManager = () => {
  const [meritLists, setMeritLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [listEntries, setListEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Generate modal
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [schemes, setSchemes] = useState([]);
  const [generateForm, setGenerateForm] = useState({
    title: 'Merit Selection List Round 1 - Academic Session 2026-27',
    schemeId: 'd0000000-0000-0000-0000-000000000001',
    cutoffMarks: 50,
    maxIncome: 300000,
    quota: 15,
    roundNumber: 1
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [lists, { data: schData }] = await Promise.all([
        meritService.getMeritLists(),
        supabase.from('scholarship_schemes').select('id, name, code')
      ]);
      setMeritLists(lists || []);
      setSchemes(schData || []);
      if (schData?.length > 0 && !generateForm.schemeId) {
        setGenerateForm(prev => ({ ...prev, schemeId: schData[0].id }));
      }

      if (lists?.length > 0) {
        if (!selectedList) {
          selectList(lists[0]);
        } else {
          const found = lists.find(l => l.id === selectedList.id);
          if (found) selectList(found);
          else selectList(lists[0]);
        }
      }
    } catch (err) {
      console.error('Error loading merit data:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectList = async (list) => {
    setSelectedList(list);
    try {
      const entries = await meritService.getMeritListEntries(list.id);
      setListEntries(entries || []);
    } catch (err) {
      console.error('Error fetching list entries:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const newList = await meritService.generateMeritList({
        title: generateForm.title,
        schemeId: generateForm.schemeId,
        cutoffMarks: Number(generateForm.cutoffMarks) || 50,
        maxIncome: Number(generateForm.maxIncome) || 300000,
        quota: Number(generateForm.quota) || 50,
        roundNumber: Number(generateForm.roundNumber) || 1
      });
      setFeedback({ type: 'success', message: `Merit ranking generated successfully for ${newList.total_candidates} applicants!` });
      setShowGenerateModal(false);
      await loadData();
      selectList(newList);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to generate merit list.' });
    } finally {
      setGenerating(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleTogglePublish = async (list) => {
    setPublishing(true);
    try {
      if (list.status === 'PUBLISHED') {
        await meritService.unpublishMeritList(list.id);
        setFeedback({ type: 'success', message: 'Merit list reverted to DRAFT status (hidden from public).' });
      } else {
        await meritService.publishMeritList(list.id);
        setFeedback({ type: 'success', message: 'Merit list has been officially PUBLISHED to the public portal!' });
      }
      await loadData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update publication status.' });
    } finally {
      setPublishing(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleDeleteList = async (listId) => {
    if (!window.confirm('Are you sure you want to delete this merit list version? This action cannot be undone.')) return;
    try {
      await meritService.deleteMeritList(listId);
      setFeedback({ type: 'success', message: 'Merit list deleted successfully.' });
      setSelectedList(null);
      await loadData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete list.' });
    } finally {
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleUpdateCandidateStatus = async (entryId, currentStatus) => {
    const newStatus = currentStatus === 'SELECTED' ? 'WAITLISTED' : 'SELECTED';
    try {
      await meritService.updateEntryStatus(entryId, newStatus);
      setListEntries(prev => prev.map(entry => entry.id === entryId ? { ...entry, selection_status: newStatus } : entry));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleExportCSV = () => {
    if (!selectedList || listEntries.length === 0) return;
    const rows = listEntries.map(entry => {
      const student = entry.applications?.students || {};
      const marks = student.academic_records?.[0]?.prev_percentage || '-';
      return {
        'Merit Rank': entry.rank_number,
        'Application ID': entry.application_id,
        'Student Name': student.full_name || 'Applicant',
        'Father Name': student.father_name || '-',
        'Mobile': student.mobile || '-',
        'Category': student.category || 'General',
        'Qualifying Marks (%)': marks,
        'Annual Income (₹)': student.annual_income || '-',
        'Composite Merit Score (Max 100)': entry.calculated_score,
        'Selection Status': entry.selection_status,
        'Merit List Title': selectedList.title,
        'Academic Year': selectedList.academic_year || '2026-27'
      };
    });
    reportService.exportToCsv(`JMF_Official_Merit_List_${selectedList.round_number || 1}_${new Date().toISOString().slice(0,10)}.csv`, rows);
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter list entries
  const filteredEntries = listEntries.filter(entry => {
    const student = entry.applications?.students || {};
    const name = (student.full_name || '').toLowerCase();
    const appId = (entry.application_id || '').toLowerCase();
    const cat = (student.category || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = !query || name.includes(query) || appId.includes(query) || cat.includes(query);
    const matchesStatus = statusFilter === 'ALL' || entry.selection_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedCount = listEntries.filter(e => e.selection_status === 'SELECTED').length;
  const waitlistedCount = listEntries.filter(e => e.selection_status === 'WAITLISTED').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={24} color="#1E40AF" />
            <span>Merit Lists & Automated Candidate Ranking</span>
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
            Multi-factor scoring algorithm (70% qualifying exam marks + 30% family economic need) for objective, transparent allocation.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-outline btn-sm" onClick={loadData}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowGenerateModal(true)}>
            <Sparkles size={15} />
            <span>Generate New Ranking</span>
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
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <Sliders size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* 2-Column: Lists on Left, Entries on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.5rem' }}>
        
        {/* Left: Lists Column */}
        <div className="card" style={{ padding: '1.25rem', height: '720px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>
              Merit Versions ({meritLists.length})
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
              Round-wise
            </span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748B' }}>
                <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem' }} />
                <span>Loading merit lists...</span>
              </div>
            ) : meritLists.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748B', fontSize: '0.85rem' }}>
                No merit lists generated yet. Click "Generate New Ranking" to run the selection algorithm.
              </div>
            ) : (
              meritLists.map(list => {
                const isSelected = selectedList?.id === list.id;
                return (
                  <div
                    key={list.id}
                    onClick={() => selectList(list)}
                    style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      border: `1.5px solid ${isSelected ? '#1E40AF' : '#E2E8F0'}`,
                      backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(30, 64, 175, 0.08)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span className={`badge ${list.status === 'PUBLISHED' ? 'badge-green' : 'badge-yellow'}`} style={{ fontSize: '0.7rem' }}>
                        {list.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                        Round {list.round_number || 1}
                      </span>
                    </div>

                    <div style={{ fontWeight: 800, color: isSelected ? '#1E40AF' : '#0F172A', fontSize: '0.9rem', lineHeight: 1.3, marginBottom: '0.35rem' }}>
                      {list.title}
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      {list.total_candidates} Evaluated Applicants • {new Date(list.created_at).toLocaleDateString()}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Selected List Ranked Candidates */}
        <div className="card" style={{ padding: '1.5rem', height: '720px', display: 'flex', flexDirection: 'column' }}>
          {selectedList ? (
            <>
              {/* Header with Title & Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{selectedList.title}</span>
                    <span className={`badge ${selectedList.status === 'PUBLISHED' ? 'badge-green' : 'badge-yellow'}`} style={{ fontSize: '0.75rem' }}>
                      {selectedList.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.2rem' }}>
                    Selected: <strong style={{ color: '#16A34A' }}>{selectedCount}</strong> • Waitlisted: <strong style={{ color: '#D97706' }}>{waitlistedCount}</strong> • Total Ranked: <strong>{listEntries.length}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={handleExportCSV}
                    title="Export Merit List to CSV"
                  >
                    <Download size={14} />
                    <span>CSV Export</span>
                  </button>

                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={handlePrint}
                    title="Print Formal Merit Gazette"
                  >
                    <Printer size={14} />
                    <span>Print Gazette</span>
                  </button>

                  <button 
                    className={`btn ${selectedList.status === 'PUBLISHED' ? 'btn-outline' : 'btn-primary'} btn-sm`}
                    disabled={publishing}
                    onClick={() => handleTogglePublish(selectedList)}
                  >
                    {publishing ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />}
                    <span>{selectedList.status === 'PUBLISHED' ? 'Unpublish' : 'Publish to Portal'}</span>
                  </button>

                  {selectedList.status !== 'PUBLISHED' && (
                    <button 
                      className="btn btn-outline btn-sm"
                      style={{ color: '#DC2626', borderColor: '#FECDD3' }}
                      onClick={() => handleDeleteList(selectedList.id)}
                      title="Delete Draft"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                  <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="Search by student name, App ID, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {['ALL', 'SELECTED', 'WAITLISTED'].map(st => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        border: '1px solid',
                        borderColor: statusFilter === st ? '#1E40AF' : '#E2E8F0',
                        backgroundColor: statusFilter === st ? '#EFF6FF' : '#FFFFFF',
                        color: statusFilter === st ? '#1E40AF' : '#64748B',
                        cursor: 'pointer'
                      }}
                    >
                      {st === 'ALL' ? 'All Applicants' : st === 'SELECTED' ? `Selected (${selectedCount})` : `Waitlist (${waitlistedCount})`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table of ranked students */}
              <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', textAlign: 'left', position: 'sticky', top: 0, zIndex: 1 }}>
                      <th style={{ padding: '0.65rem 0.75rem' }}>Rank</th>
                      <th style={{ padding: '0.65rem 0.75rem' }}>Application ID</th>
                      <th style={{ padding: '0.65rem 0.75rem' }}>Student Name</th>
                      <th style={{ padding: '0.65rem 0.75rem' }}>Category</th>
                      <th style={{ padding: '0.65rem 0.75rem' }}>Marks %</th>
                      <th style={{ padding: '0.65rem 0.75rem' }}>Annual Income</th>
                      <th style={{ padding: '0.65rem 0.75rem' }}>Merit Score</th>
                      <th style={{ padding: '0.65rem 0.75rem' }}>Selection Status</th>
                      <th style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntries.map(entry => {
                      const student = entry.applications?.students || {};
                      const marks = student.academic_records?.[0]?.prev_percentage || '-';
                      const income = student.annual_income ? `₹${Number(student.annual_income).toLocaleString('en-IN')}` : '-';
                      const isSelected = entry.selection_status === 'SELECTED';

                      return (
                        <tr key={entry.id} style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: entry.rank_number <= 3 ? '#FFFBEB' : 'transparent' }}>
                          <td style={{ padding: '0.75rem', fontWeight: 900, color: entry.rank_number <= 3 ? '#D97706' : '#1E293B' }}>
                            #{entry.rank_number}
                          </td>
                          <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: '#1E40AF' }}>
                            {entry.application_id}
                          </td>
                          <td style={{ padding: '0.75rem', fontWeight: 700, color: '#0F172A' }}>
                            <div>{student.full_name || 'Applicant'}</div>
                            {student.father_name && <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 400 }}>S/D of {student.father_name}</div>}
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <span className="badge badge-navy" style={{ fontSize: '0.7rem' }}>
                              {student.category || 'General'}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem', color: '#1E293B', fontWeight: 600 }}>
                            {marks}%
                          </td>
                          <td style={{ padding: '0.75rem', color: '#64748B', fontSize: '0.8rem' }}>
                            {income}
                          </td>
                          <td style={{ padding: '0.75rem', fontWeight: 800, color: '#16A34A' }}>
                            {entry.calculated_score} <span style={{ fontSize: '0.7rem', color: '#64748B' }}>/100</span>
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <span className={`badge ${isSelected ? 'badge-green' : 'badge-yellow'}`} style={{ fontSize: '0.7rem' }}>
                              {entry.selection_status}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                            <button
                              onClick={() => handleUpdateCandidateStatus(entry.id, entry.selection_status)}
                              title={isSelected ? 'Move to Waitlist' : 'Promote to Selected'}
                              style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.7rem',
                                border: '1px solid #CBD5E1',
                                backgroundColor: isSelected ? '#FEF2F2' : '#F0FDF4',
                                color: isSelected ? '#DC2626' : '#16A34A',
                                cursor: 'pointer'
                              }}
                            >
                              {isSelected ? 'Waitlist' : 'Select'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredEntries.length === 0 && (
                      <tr>
                        <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                          No candidates match the search or filter criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748B' }}>
              Select a merit list version on the left or generate a new ranking to view candidate lists.
            </div>
          )}
        </div>

      </div>

      {/* Generate Modal */}
      {showGenerateModal && (
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
          <div className="card" style={{ width: '540px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} color="#1E40AF" />
              <span>Generate Automated Merit Ranking</span>
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.5rem', lineHeight: 1.4 }}>
              The algorithm transparently ranks students by weighting qualifying marks (70%) and economic need (30%) across all registered applicants.
            </p>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="form-group">
                <label className="form-label required">Merit List Title</label>
                <input 
                  type="text"
                  className="form-control"
                  required
                  value={generateForm.title}
                  onChange={(e) => setGenerateForm({ ...generateForm, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label required">Target Scholarship Scheme</label>
                <select 
                  className="form-control"
                  value={generateForm.schemeId}
                  onChange={(e) => setGenerateForm({ ...generateForm, schemeId: e.target.value })}
                >
                  {schemes.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label required">Min. Qualifying Marks %</label>
                  <input 
                    type="number"
                    className="form-control"
                    min="33"
                    max="100"
                    required
                    value={generateForm.cutoffMarks}
                    onChange={(e) => setGenerateForm({ ...generateForm, cutoffMarks: e.target.value })}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Cutoff threshold (e.g. 50%)</span>
                </div>

                <div className="form-group">
                  <label className="form-label required">Max Family Income (₹)</label>
                  <input 
                    type="number"
                    className="form-control"
                    step="10000"
                    required
                    value={generateForm.maxIncome}
                    onChange={(e) => setGenerateForm({ ...generateForm, maxIncome: e.target.value })}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Upper ceiling (e.g. ₹3,00,000)</span>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label required">Selection Quota (Seats)</label>
                  <input 
                    type="number"
                    className="form-control"
                    min="1"
                    required
                    value={generateForm.quota}
                    onChange={(e) => setGenerateForm({ ...generateForm, quota: e.target.value })}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Top candidates marked SELECTED</span>
                </div>

                <div className="form-group">
                  <label className="form-label required">Selection Round</label>
                  <input 
                    type="number"
                    className="form-control"
                    min="1"
                    max="5"
                    required
                    value={generateForm.roundNumber}
                    onChange={(e) => setGenerateForm({ ...generateForm, roundNumber: e.target.value })}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Round 1, Round 2, etc.</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowGenerateModal(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={generating} className="btn btn-primary btn-sm">
                  {generating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  <span>Calculate & Rank Applicants</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
