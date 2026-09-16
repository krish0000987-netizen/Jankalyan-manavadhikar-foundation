import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { meritService } from '../services/meritService';
import { 
  Award, 
  Search, 
  CheckCircle2, 
  Clock, 
  Download, 
  Printer, 
  ShieldCheck, 
  FileText, 
  AlertCircle, 
  Filter, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export const MeritList = () => {
  const { lang, cms, navigate } = useApp();
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [userQuery, setUserQuery] = useState('');
  const [lookupResult, setLookupResult] = useState(null);

  useEffect(() => {
    loadPublicMeritLists();
  }, []);

  const loadPublicMeritLists = async () => {
    setLoading(true);
    try {
      const published = await meritService.getPublishedMeritLists();
      setLists(published || []);
      if (published && published.length > 0) {
        selectList(published[0]);
      }
    } catch (err) {
      console.error('Error loading published merit lists:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectList = async (list) => {
    setSelectedList(list);
    try {
      const data = await meritService.getMeritListEntries(list.id);
      setEntries(data || []);
      setLookupResult(null);
      setUserQuery('');
    } catch (err) {
      console.error('Error loading entries:', err);
    }
  };

  const handleStudentLookup = (e) => {
    e.preventDefault();
    if (!userQuery.trim()) {
      setLookupResult(null);
      return;
    }
    const cleanQuery = userQuery.trim().toLowerCase();
    const found = entries.find(entry => {
      const s = entry.applications?.students || {};
      const idMatch = (entry.application_id || '').toLowerCase().includes(cleanQuery);
      const nameMatch = (s.full_name || '').toLowerCase().includes(cleanQuery);
      return idMatch || nameMatch;
    });
    setLookupResult(found || 'NOT_FOUND');
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter entries
  const filteredEntries = entries.filter(entry => {
    const student = entry.applications?.students || {};
    const name = (student.full_name || '').toLowerCase();
    const appId = (entry.application_id || '').toLowerCase();
    const cat = (student.category || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = !query || name.includes(query) || appId.includes(query) || cat.includes(query);
    const matchesStatus = statusFilter === 'ALL' || entry.selection_status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || student.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const selectedCount = entries.filter(e => e.selection_status === 'SELECTED').length;
  const waitlistedCount = entries.filter(e => e.selection_status === 'WAITLISTED').length;

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '4rem' }}>
      
      {/* 1. Header & Hero Section */}
      <section style={{ backgroundColor: '#1B2A4E', color: '#FFFFFF', padding: '3.5rem 0 2.5rem', borderBottom: '4px solid #1E40AF' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.4rem 0.85rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700, color: '#FEF08A', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.15)' }}>
            <Award size={16} />
            <span>{lang === 'hi' ? 'आधिकारिक चयन अधिसूचना • सत्र 2026-27' : 'OFFICIAL SELECTION NOTIFICATION • SESSION 2026-27'}</span>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '0.75rem', lineHeight: 1.2 }}>
            {lang === 'hi' ? 'छात्रवृत्ति चयन एवं मेरिट सूची 2026-27' : 'Scholarship Merit & Selection Lists 2026-27'}
          </h1>

          <p style={{ fontSize: '1rem', color: '#CBD5E1', maxWidth: '800px', lineHeight: 1.6, marginBottom: '2rem' }}>
            {lang === 'hi' 
              ? 'जनकल्याण मानवाधिकार फाउंडेशन द्वारा आयोजित छात्रवृत्ति योजना के अंतर्गत पारदर्शी योग्यता-सह-आवश्यकता सत्यापन के आधार पर चयनित विद्यार्थियों की आधिकारिक सूची।' 
              : 'Official provisional and final selection list of verified students shortlisted for Direct Benefit Transfer (DBT) scholarship grants under Jankalyan Manavadhikar Foundation.'}
          </p>

          {/* Quick Round Selector & Print Action */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}>
                {lang === 'hi' ? 'मेरिट राउंड चुनें:' : 'Select Merit Round:'}
              </span>
              {lists.map(l => (
                <button
                  key={l.id}
                  onClick={() => selectList(l)}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    backgroundColor: selectedList?.id === l.id ? '#1E40AF' : 'rgba(255,255,255,0.08)',
                    color: '#FFFFFF',
                    border: `1.5px solid ${selectedList?.id === l.id ? '#60A5FA' : 'rgba(255,255,255,0.2)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {l.title}
                </button>
              ))}
              {lists.length === 0 && !loading && (
                <span style={{ color: '#F87171', fontSize: '0.85rem' }}>
                  {lang === 'hi' ? 'वर्तमान में कोई मेरिट सूची प्रकाशित नहीं है।' : 'No published merit lists currently available.'}
                </span>
              )}
            </div>

            {selectedList && (
              <button 
                onClick={handlePrint}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  color: '#1B2A4E',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
              >
                <Printer size={16} />
                <span>{lang === 'hi' ? 'मेरिट सूची प्रिंट / डाउनलोड करें' : 'Print Official Gazette (PDF)'}</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. Main Content Area */}
      <section className="container" style={{ marginTop: '-1.5rem' }}>
        
        {/* Metric Summary Cards */}
        {selectedList && (
          <div className="grid-4" style={{ marginBottom: '2rem' }}>
            <div className="card" style={{ padding: '1.25rem', backgroundColor: '#FFFFFF', borderLeft: '4px solid #1E40AF' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                {lang === 'hi' ? 'कुल मूल्यांकित विद्यार्थी' : 'Total Evaluated'}
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A', margin: '0.25rem 0' }}>
                {entries.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                {lang === 'hi' ? 'सत्यापित आवेदन' : 'Verified Eligible Applicants'}
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', backgroundColor: '#FFFFFF', borderLeft: '4px solid #16A34A' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                {lang === 'hi' ? 'छात्रवृत्ति हेतु चयनित' : 'Selected for Grant (DBT)'}
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#16A34A', margin: '0.25rem 0' }}>
                {selectedCount}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#15803D' }}>
                {lang === 'hi' ? 'अनुदान राशि सीधे बैंक खाते में' : 'Direct Benefit Transfer Sanctioned'}
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', backgroundColor: '#FFFFFF', borderLeft: '4px solid #D97706' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                {lang === 'hi' ? 'प्रतीक्षारत सूची (Waitlist)' : 'Waitlisted Candidates'}
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#D97706', margin: '0.25rem 0' }}>
                {waitlistedCount}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#B45309' }}>
                {lang === 'hi' ? 'आगामी राउंड में विचार हेतु' : 'Considered for Next Seat Round'}
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', backgroundColor: '#FFFFFF', borderLeft: '4px solid #8B5CF6' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                {lang === 'hi' ? 'घोषणा तिथि' : 'Official Declaration'}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0.4rem 0' }}>
                {selectedList.published_at ? new Date(selectedList.published_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '15 Sep 2026'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                {lang === 'hi' ? 'संस्थागत प्रमाणन सहित' : 'Certified Digital Record'}
              </div>
            </div>
          </div>
        )}

        {/* 3. Student Instant Merit Status Checker */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem', backgroundColor: '#FFFFFF', border: '1px solid #BFDBFE', background: 'linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Sparkles size={20} color="#1E40AF" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1E3A8A' }}>
              {lang === 'hi' ? 'अपना मेरिट क्रमांक एवं चयन स्थिति तुरंत खोजें' : 'Check Your Merit Rank & Selection Status'}
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem' }}>
            {lang === 'hi' 
              ? 'अपना आवेदन क्रमांक (उदा. JMF-2026-108234) या पूरा नाम दर्ज करें और तुरंत परिणाम देखें:' 
              : 'Enter your Application ID (e.g. JMF-2026-108234) or Student Full Name to verify your ranking:'}
          </p>

          <form onSubmit={handleStudentLookup} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', maxWidth: '650px' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
              <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text"
                className="form-control"
                placeholder={lang === 'hi' ? 'आवेदन क्रमांक या विद्यार्थी का नाम...' : 'Application ID (JMF-2026-XXXX) or Full Name...'}
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                style={{ paddingLeft: '2.5rem', fontSize: '0.9rem', height: '44px' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem', height: '44px' }}>
              {lang === 'hi' ? 'स्थिति देखें' : 'Search Result'}
            </button>
          </form>

          {/* Lookup Result Feedback Card */}
          {lookupResult && lookupResult !== 'NOT_FOUND' && (
            <div style={{
              marginTop: '1.25rem',
              padding: '1.25rem',
              borderRadius: '12px',
              backgroundColor: lookupResult.selection_status === 'SELECTED' ? '#F0FDF4' : '#FFFBEB',
              border: `2px solid ${lookupResult.selection_status === 'SELECTED' ? '#86EFAC' : '#FDE68A'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: lookupResult.selection_status === 'SELECTED' ? '#DCFCE7' : '#FEF3C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: lookupResult.selection_status === 'SELECTED' ? '#166534' : '#B45309'
                }}>
                  #{lookupResult.rank_number}
                </div>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                    {lookupResult.applications?.students?.full_name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                    Application ID: <strong>{lookupResult.application_id}</strong> • Category: <strong>{lookupResult.applications?.students?.category || 'General'}</strong> • Score: <strong>{lookupResult.calculated_score} / 100</strong>
                  </div>
                </div>
              </div>

              <div>
                <span className={`badge ${lookupResult.selection_status === 'SELECTED' ? 'badge-green' : 'badge-yellow'}`} style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}>
                  {lookupResult.selection_status === 'SELECTED' 
                    ? (lang === 'hi' ? '✓ छात्रवृत्ति हेतु चयनित (SELECTED)' : '✓ Selected for Scholarship Grant')
                    : (lang === 'hi' ? 'प्रतीक्षारत (WAITLISTED)' : 'Waitlisted (Next Round)')}
                </span>
              </div>
            </div>
          )}

          {lookupResult === 'NOT_FOUND' && (
            <div style={{ marginTop: '1.25rem', padding: '1rem', borderRadius: '10px', backgroundColor: '#FEF2F2', border: '1px solid #FECDD3', color: '#991B1B', fontSize: '0.85rem' }}>
              {lang === 'hi' 
                ? 'कोई विद्यार्थी इस विवरण से नहीं मिला। कृपया अपना आवेदन क्रमांक (JMF-2026-XXXX) दोबारा जांचें।' 
                : 'No student found matching this search in the current published list. Please verify your Application ID.'}
            </div>
          )}
        </div>

        {/* 4. Filter & Search Toolbar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text"
                className="form-control"
                placeholder={lang === 'hi' ? 'मेरिट सूची में नाम, ID या वर्ग से खोजें...' : 'Filter merit list by Name, App ID, Category...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }}
              />
            </div>

            {/* Status Tabs */}
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {[
                { id: 'ALL', labelHi: 'सभी विद्यार्थी', labelEn: 'All Candidates' },
                { id: 'SELECTED', labelHi: `चयनित (${selectedCount})`, labelEn: `Selected (${selectedCount})` },
                { id: 'WAITLISTED', labelHi: `प्रतीक्षारत (${waitlistedCount})`, labelEn: `Waitlisted (${waitlistedCount})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  style={{
                    padding: '0.4rem 0.85rem',
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
                  {lang === 'hi' ? tab.labelHi : tab.labelEn}
                </button>
              ))}
            </div>

            {/* Category Dropdown */}
            <div>
              <select 
                className="form-control"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', height: 'auto' }}
              >
                <option value="ALL">{lang === 'hi' ? 'सभी वर्ग (All Categories)' : 'All Categories'}</option>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>

          </div>
        </div>

        {/* 5. Complete Official Merit Table */}
        <div className="card" style={{ padding: '0', overflow: 'hidden', backgroundColor: '#FFFFFF', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FAFBFD' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={20} color="#1E40AF" />
                <span>{selectedList ? selectedList.title : (lang === 'hi' ? 'मेरिट सूची' : 'Official Merit Gazette')}</span>
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.2rem' }}>
                {lang === 'hi' ? 'सत्र 2026-27 • प्रत्यक्ष लाभ अंतरण (DBT) छात्रवृत्ति योजना' : 'Session 2026-27 • Direct Benefit Transfer (DBT) Scholarship Program'}
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
              {lang === 'hi' ? `प्रदर्शित: ${filteredEntries.length} विद्यार्थी` : `Showing: ${filteredEntries.length} Candidates`}
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #E2E8F0', color: '#475569', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 1rem', width: '80px' }}>{lang === 'hi' ? 'मेरिट रैंक' : 'Merit Rank'}</th>
                  <th style={{ padding: '0.75rem 1rem' }}>{lang === 'hi' ? 'आवेदन क्रमांक' : 'Application ID'}</th>
                  <th style={{ padding: '0.75rem 1rem' }}>{lang === 'hi' ? 'विद्यार्थी का नाम' : 'Candidate Name'}</th>
                  <th style={{ padding: '0.75rem 1rem' }}>{lang === 'hi' ? 'वर्ग' : 'Category'}</th>
                  <th style={{ padding: '0.75rem 1rem' }}>{lang === 'hi' ? 'अंक %' : 'Marks %'}</th>
                  <th style={{ padding: '0.75rem 1rem' }}>{lang === 'hi' ? 'मेरिट स्कोर' : 'Merit Score'}</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>{lang === 'hi' ? 'चयन स्थिति' : 'Selection Status'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map(entry => {
                  const student = entry.applications?.students || {};
                  const marks = student.academic_records?.[0]?.prev_percentage || '-';
                  const isTop3 = entry.rank_number <= 3;
                  const isSelected = entry.selection_status === 'SELECTED';

                  return (
                    <tr 
                      key={entry.id} 
                      style={{ 
                        borderBottom: '1px solid #F1F5F9', 
                        backgroundColor: isTop3 ? '#FFFDF5' : 'transparent',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 900, fontSize: isTop3 ? '1rem' : '0.9rem', color: isTop3 ? '#D97706' : '#1E293B' }}>
                        #{entry.rank_number}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: '#1E40AF' }}>
                        {entry.application_id}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#0F172A' }}>
                        <div>{student.full_name || 'Applicant'}</div>
                        {student.father_name && (
                          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 400 }}>
                            {lang === 'hi' ? `आत्मज/आत्मजा: ${student.father_name}` : `S/D of ${student.father_name}`}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span className="badge badge-navy" style={{ fontSize: '0.7rem' }}>
                          {student.category || 'General'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#1E293B' }}>
                        {marks}%
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#16A34A' }}>
                        {entry.calculated_score} <span style={{ fontSize: '0.7rem', color: '#64748B' }}>/ 100</span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <span className={`badge ${isSelected ? 'badge-green' : 'badge-yellow'}`} style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
                          {isSelected 
                            ? (lang === 'hi' ? '✓ चयनित (SELECTED)' : '✓ Selected for DBT') 
                            : (lang === 'hi' ? 'प्रतीक्षारत (WAITLIST)' : 'Waitlisted')}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {filteredEntries.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '3.5rem', color: '#64748B' }}>
                      {loading 
                        ? (lang === 'hi' ? 'मेरिट सूची लोड हो रही है...' : 'Loading merit records...') 
                        : (lang === 'hi' ? 'इस फ़िल्टर के तहत कोई उम्मीदवार नहीं मिला।' : 'No candidates match the specified filter criteria.')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Notice inside table */}
          <div style={{ padding: '1rem 1.5rem', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#64748B' }}>
              <ShieldCheck size={16} color="#16A34A" />
              <span>
                {lang === 'hi' 
                  ? 'यह मेरिट सूची डिजिटल रूप से सत्यापित एवं आधिकारिक प्रशासन द्वारा अनुमोदित है।' 
                  : 'This merit gazette is digitally verified and published under Foundation Authority.'}
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#1E40AF', fontWeight: 700 }}>
              Jankalyan Manavadhikar Foundation • Jabalpur (M.P.)
            </div>
          </div>
        </div>

        {/* 6. Instructions for Selected Students */}
        <div className="card" style={{ padding: '1.75rem', marginTop: '2rem', backgroundColor: '#FFFFFF', borderLeft: '4px solid #16A34A' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={20} color="#16A34A" />
            <span>{lang === 'hi' ? 'चयनित विद्यार्थियों हेतु आवश्यक दिशा-निर्देश (DBT निर्देश)' : 'Important Guidelines for Shortlisted Candidates'}</span>
          </h4>
          <ul style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.7, paddingLeft: '1.25rem' }}>
            <li>
              {lang === 'hi'
                ? 'जिन विद्यार्थियों का नाम "चयनित (SELECTED)" सूची में है, उनकी छात्रवृत्ति राशि प्रत्यक्ष लाभ अंतरण (DBT) द्वारा उनके सत्यापित बैंक खाते में अंतरित की जाएगी।'
                : 'Candidates marked as "SELECTED" will receive their approved scholarship grant directly via Direct Benefit Transfer (DBT) into their verified bank account.'}
            </li>
            <li>
              {lang === 'hi'
                ? 'कृपया सुनिश्चित करें कि आपका बैंक खाता आधार से लिंक (Aadhaar Seeded) तथा सक्रिय हो ताकि अंतरण प्रक्रिया में कोई बाधा न आए।'
                : 'Ensure that your recorded bank account is actively seeded with Aadhaar for direct government DBT protocols.'}
            </li>
            <li>
              {lang === 'hi'
                ? 'प्रतीक्षारत (Waitlisted) विद्यार्थियों को आगामी चरण में सीटें रिक्त रहने पर प्राथमिकता के आधार पर अवसर प्रदान किया जाएगा।'
                : 'Waitlisted applicants will automatically be considered in subsequent allotment rounds based on quota vacancy.'}
            </li>
          </ul>
        </div>

      </section>

    </div>
  );
};
