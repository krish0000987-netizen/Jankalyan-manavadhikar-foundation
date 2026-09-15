import React, { useState, useEffect } from 'react';
import { meritService } from '../../services/meritService';
import { supabase } from '../../api/supabase';
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
  Users
} from 'lucide-react';

export const MeritManager = () => {
  const [meritLists, setMeritLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [listEntries, setListEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Generate modal
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [schemes, setSchemes] = useState([]);
  const [generateForm, setGenerateForm] = useState({
    title: 'Merit List Round 1 - Academic Session 2026-27',
    schemeId: ''
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

      if (lists?.length > 0 && !selectedList) {
        selectList(lists[0]);
      } else if (selectedList) {
        const found = lists.find(l => l.id === selectedList.id);
        if (found) selectList(found);
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
      const { data: entries } = await supabase
        .from('merit_list_entries')
        .select(`
          *,
          applications (
            id,
            students (full_name, mobile, category, annual_income, academic_records(prev_percentage))
          )
        `)
        .eq('merit_list_id', list.id)
        .order('rank_number', { ascending: true });
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
        schemeId: generateForm.schemeId
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

  const handlePublish = async (listId) => {
    setPublishing(true);
    try {
      await meritService.publishMeritList(listId);
      setFeedback({ type: 'success', message: 'Merit list has been officially PUBLISHED!' });
      await loadData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to publish list.' });
    } finally {
      setPublishing(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

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
            Multi-factor scoring algorithm (qualifying exam % + family economic need) for fair allocation.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
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
        
        {/* Left: Lists */}
        <div className="card" style={{ padding: '1.25rem', height: '660px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontWeight: 800, color: '#0F172A', marginBottom: '1rem', fontSize: '1rem' }}>
            Merit List Versions ({meritLists.length})
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
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span className={`badge ${list.status === 'PUBLISHED' ? 'badge-green' : 'badge-yellow'}`} style={{ fontSize: '0.7rem' }}>
                        {list.status}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        Round {list.round_number || 1}
                      </span>
                    </div>

                    <div style={{ fontWeight: 800, color: isSelected ? '#1E40AF' : '#0F172A', fontSize: '0.9rem', lineHeight: 1.3, marginBottom: '0.35rem' }}>
                      {list.title}
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      {list.total_candidates} Ranked Students • {new Date(list.created_at).toLocaleDateString()}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Selected List Ranked Candidates */}
        <div className="card" style={{ padding: '1.5rem', height: '660px', display: 'flex', flexDirection: 'column' }}>
          {selectedList ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
                    {selectedList.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    Status: <strong style={{ color: selectedList.status === 'PUBLISHED' ? '#16A34A' : '#D97706' }}>{selectedList.status}</strong> • Total Ranked: {listEntries.length}
                  </div>
                </div>

                {selectedList.status !== 'PUBLISHED' && (
                  <button 
                    className="btn btn-primary btn-sm"
                    disabled={publishing}
                    onClick={() => handlePublish(selectedList.id)}
                  >
                    {publishing ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                    <span>Publish Official List</span>
                  </button>
                )}
              </div>

              {/* Table of ranked students */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', textAlign: 'left' }}>
                      <th style={{ padding: '0.6rem 0.75rem' }}>Rank</th>
                      <th style={{ padding: '0.6rem 0.75rem' }}>Application ID</th>
                      <th style={{ padding: '0.6rem 0.75rem' }}>Student Name</th>
                      <th style={{ padding: '0.6rem 0.75rem' }}>Marks %</th>
                      <th style={{ padding: '0.6rem 0.75rem' }}>Merit Score</th>
                      <th style={{ padding: '0.6rem 0.75rem' }}>Selection Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listEntries.map(entry => {
                      const student = entry.applications?.students || {};
                      const marks = student.academic_records?.[0]?.prev_percentage || '-';
                      return (
                        <tr key={entry.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '0.75rem', fontWeight: 900, color: entry.rank_number <= 3 ? '#D97706' : '#1E293B' }}>
                            #{entry.rank_number}
                          </td>
                          <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: '#1E40AF' }}>
                            {entry.application_id}
                          </td>
                          <td style={{ padding: '0.75rem', fontWeight: 700, color: '#0F172A' }}>
                            {student.full_name || 'Applicant'}
                          </td>
                          <td style={{ padding: '0.75rem', color: '#475569' }}>
                            {marks}%
                          </td>
                          <td style={{ padding: '0.75rem', fontWeight: 800, color: '#16A34A' }}>
                            {entry.calculated_score} / 100
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <span className={`badge ${entry.selection_status === 'SELECTED' ? 'badge-green' : 'badge-navy'}`} style={{ fontSize: '0.7rem' }}>
                              {entry.selection_status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {listEntries.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                          No ranked entries found in this merit list.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748B' }}>
              Select a merit list version to view candidate rankings.
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
          <div className="card" style={{ width: '520px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem' }}>
              Generate Automated Merit Ranking
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.5rem' }}>
              The algorithm evaluates qualifying marks (70% weight) and economic family need (30% weight) across all eligible applicants.
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowGenerateModal(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={generating} className="btn btn-primary btn-sm">
                  {generating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  <span>Calculate & Rank</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
