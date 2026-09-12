import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Shield, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  CreditCard, 
  FileText, 
  Settings, 
  Sliders, 
  Search, 
  Filter, 
  Eye, 
  Check, 
  X, 
  AlertTriangle, 
  Download, 
  Edit3, 
  Save, 
  RefreshCw,
  Building,
  BarChart3,
  PieChart
} from 'lucide-react';

export const Admin = () => {
  const { lang, t, navigate, applications, updateApplicationStatus, cms, updateCMS, authRole, setAuthRole } = useApp();

  // Active Admin Subtab: 'applications' | 'cms' | 'payments' | 'analytics'
  const [activeTab, setActiveTab] = useState('applications');

  // Filters
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [tableSearch, setTableSearch] = useState('');

  // Selected Application for Scrutiny Modal
  const [activeModalApp, setActiveModalApp] = useState(null);
  const [actionRemarks, setActionRemarks] = useState('');

  // CMS Form State
  const [cmsForm, setCmsForm] = useState({ ...cms });
  const [cmsSaveAlert, setCmsSaveAlert] = useState(false);

  // Filtered Applications
  const filteredApplications = applications.filter(app => {
    const matchesDistrict = selectedDistrict === 'All' || app.district === selectedDistrict;
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || app.status === selectedStatus;
    const matchesSearch = !tableSearch || 
      app.id.toLowerCase().includes(tableSearch.toLowerCase()) || 
      app.studentName.toLowerCase().includes(tableSearch.toLowerCase()) ||
      app.institution.toLowerCase().includes(tableSearch.toLowerCase());
    return matchesDistrict && matchesCategory && matchesStatus && matchesSearch;
  });

  // KPI Calculations
  const totalCount = applications.length;
  const approvedCount = applications.filter(a => a.status === 'Approved').length;
  const releasedCount = applications.filter(a => a.status === 'Scholarship Released').length;
  const underVerificationCount = applications.filter(a => a.status === 'Under Verification').length;
  const rejectedCount = applications.filter(a => a.status === 'Rejected').length;
  const correctionCount = applications.filter(a => a.status === 'Correction Requested').length;

  // Handle Application Verification Actions
  const handleApprove = (appId) => {
    updateApplicationStatus(appId, 'Approved', 'Approved by Institutional Verification Board');
    setActiveModalApp(null);
  };

  const handleReleasePayment = (appId) => {
    const utr = `JMF${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    updateApplicationStatus(appId, 'Scholarship Released', 'Direct Benefit Transfer completed', utr);
    setActiveModalApp(null);
  };

  const handleReject = (appId) => {
    if (!actionRemarks) {
      alert('Please enter a rejection reason.');
      return;
    }
    updateApplicationStatus(appId, 'Rejected', actionRemarks);
    setActiveModalApp(null);
    setActionRemarks('');
  };

  const handleRequestCorrection = (appId) => {
    if (!actionRemarks) {
      alert('Please specify the required correction.');
      return;
    }
    updateApplicationStatus(appId, 'Correction Requested', actionRemarks);
    setActiveModalApp(null);
    setActionRemarks('');
  };

  // CMS Save
  const handleSaveCMS = (e) => {
    e.preventDefault();
    updateCMS(cmsForm);
    setCmsSaveAlert(true);
    setTimeout(() => setCmsSaveAlert(false), 3500);
  };

  return (
    <div className="section-py" style={{ backgroundColor: '#F8FAFC', minHeight: '85vh' }}>
      <div className="container-wide">
        
        {/* Top Portal Header & Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Shield size={20} color="#1E40AF" />
              <span className="badge badge-blue">
                {authRole.toUpperCase()} PORTAL
              </span>
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A' }}>
              {t.adminPortalTitle}
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
              Role-Based Governance, Multi-Tier Scrutiny, and Real-Time Content Management System
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <select 
              className="form-control"
              value={authRole}
              onChange={(e) => setAuthRole(e.target.value)}
              style={{ width: 'auto', fontWeight: 600 }}
            >
              <option value="admin">Super Admin</option>
              <option value="district">District Coordinator</option>
              <option value="block">Block Coordinator</option>
              <option value="institution">School / College</option>
              <option value="center">Online Center</option>
            </select>

            <button className="btn btn-outline btn-sm" onClick={() => navigate('/')}>
              <span>Exit to Public Portal</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #E2E8F0', marginBottom: '2rem' }}>
          <button 
            className={`btn ${activeTab === 'applications' ? 'btn-secondary' : 'btn-outline'}`}
            style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
            onClick={() => setActiveTab('applications')}
          >
            <Users size={16} />
            <span>Applications & Verification ({totalCount})</span>
          </button>

          <button 
            className={`btn ${activeTab === 'cms' ? 'btn-secondary' : 'btn-outline'}`}
            style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
            onClick={() => setActiveTab('cms')}
          >
            <Settings size={16} />
            <span>Live CMS & Policy Editor</span>
          </button>

          <button 
            className={`btn ${activeTab === 'analytics' ? 'btn-secondary' : 'btn-outline'}`}
            style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 size={16} />
            <span>Analytics & District Breakdown</span>
          </button>
        </div>

        {/* ====================================================================
            TAB 1: APPLICATIONS & VERIFICATION TABLE
            ==================================================================== */}
        {activeTab === 'applications' && (
          <div className="animate-fade-in">
            
            {/* KPI Metrics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
              
              <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #1E40AF' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{t.kpiTotalApps}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A', margin: '0.2rem 0' }}>{totalCount}</div>
                <div style={{ fontSize: '0.7rem', color: '#1E40AF' }}>All Districts</div>
              </div>

              <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #D97706' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{t.kpiUnderVerification}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#D97706', margin: '0.2rem 0' }}>{underVerificationCount}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Scrutiny Pending</div>
              </div>

              <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #2563EB' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{t.kpiApproved}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#2563EB', margin: '0.2rem 0' }}>{approvedCount}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Ready for DBT</div>
              </div>

              <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #16A34A' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{t.kpiDisbursed}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#16A34A', margin: '0.2rem 0' }}>{releasedCount}</div>
                <div style={{ fontSize: '0.7rem', color: '#16A34A' }}>With Bank UTR</div>
              </div>

              <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #DC2626' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{t.kpiRejected}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#DC2626', margin: '0.2rem 0' }}>{rejectedCount}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Ineligible</div>
              </div>

            </div>

            {/* Filter Bar */}
            <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', backgroundColor: '#FFFFFF' }}>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="Search by ID, student, institution..."
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                  />
                </div>

                <div style={{ minWidth: '150px' }}>
                  <select 
                    className="form-control"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                  >
                    <option value="All">All Districts</option>
                    <option value="Jabalpur">Jabalpur</option>
                    <option value="Bhopal">Bhopal</option>
                    <option value="Indore">Indore</option>
                    <option value="Rewa">Rewa</option>
                    <option value="Mandla">Mandla</option>
                    <option value="Gwalior">Gwalior</option>
                  </select>
                </div>

                <div style={{ minWidth: '130px' }}>
                  <select 
                    className="form-control"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    <option value="General">General</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="OBC">OBC</option>
                  </select>
                </div>

                <div style={{ minWidth: '170px' }}>
                  <select 
                    className="form-control"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Under Verification">Under Verification</option>
                    <option value="Approved">Approved</option>
                    <option value="Scholarship Released">Scholarship Released</option>
                    <option value="Correction Requested">Correction Requested</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <button 
                  className="btn btn-outline btn-sm"
                  onClick={() => { setSelectedDistrict('All'); setSelectedCategory('All'); setSelectedStatus('All'); setTableSearch(''); }}
                >
                  <RefreshCw size={14} />
                  <span>Reset</span>
                </button>

              </div>
            </div>

            {/* Applications Table */}
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Application ID</th>
                    <th>Student Name</th>
                    <th>District / Block</th>
                    <th>Institution & Course</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr key={app.id}>
                      <td style={{ fontWeight: 700, color: '#1E40AF', fontFamily: 'monospace' }}>
                        {app.id}
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#0F172A' }}>{app.studentName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{app.mobile}</div>
                      </td>
                      <td>
                        <div>{app.district}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{app.block}</div>
                      </td>
                      <td>
                        <div style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.institution}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{app.course}</div>
                      </td>
                      <td>
                        <span className="badge badge-navy">{app.category}</span>
                      </td>
                      <td>
                        <span className={`badge ${
                          app.status === 'Scholarship Released' ? 'badge-green' :
                          app.status === 'Approved' ? 'badge-blue' :
                          app.status === 'Rejected' ? 'badge-red' :
                          app.status === 'Correction Requested' ? 'badge-yellow' : 'badge-navy'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#64748B' }}>
                        {app.submissionDate}
                      </td>
                      <td>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => { setActiveModalApp(app); setActionRemarks(''); }}
                        >
                          <Eye size={13} />
                          <span>Scrutiny</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ====================================================================
            TAB 2: LIVE CMS & POLICY EDITOR (Zero Code Changes Required)
            ==================================================================== */}
        {activeTab === 'cms' && (
          <div className="card animate-fade-in" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
                  {t.cmsTitle}
                </h2>
                <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
                  {t.cmsSub}
                </p>
              </div>

              <button className="btn btn-primary" onClick={handleSaveCMS}>
                <Save size={16} />
                <span>{t.cmsBtnSave}</span>
              </button>
            </div>

            {cmsSaveAlert && (
              <div style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '1rem 1.5rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={20} />
                <span style={{ fontWeight: 700 }}>{t.cmsSavedSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveCMS}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                
                <div className="form-group">
                  <label className="form-label required">Scholarship Amount (Display / Grant Value)</label>
                  <input 
                    type="text"
                    className="form-control"
                    value={cmsForm.scholarshipAmount}
                    onChange={(e) => setCmsForm({ ...cmsForm, scholarshipAmount: e.target.value })}
                  />
                  <div className="form-hint">Editable placeholder or actual grant amount</div>
                </div>

                <div className="form-group">
                  <label className="form-label required">Eligibility Criteria Overview</label>
                  <input 
                    type="text"
                    className="form-control"
                    value={cmsForm.eligibilityCriteria}
                    onChange={(e) => setCmsForm({ ...cmsForm, eligibilityCriteria: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">Application Start Date</label>
                  <input 
                    type="text"
                    className="form-control"
                    value={cmsForm.applicationStartDate}
                    onChange={(e) => setCmsForm({ ...cmsForm, applicationStartDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">Application Last Date</label>
                  <input 
                    type="text"
                    className="form-control"
                    value={cmsForm.applicationLastDate}
                    onChange={(e) => setCmsForm({ ...cmsForm, applicationLastDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">Office Address</label>
                  <input 
                    type="text"
                    className="form-control"
                    value={cmsForm.officeAddress}
                    onChange={(e) => setCmsForm({ ...cmsForm, officeAddress: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">Official Registration Details</label>
                  <input 
                    type="text"
                    className="form-control"
                    value={cmsForm.registrationDetails}
                    onChange={(e) => setCmsForm({ ...cmsForm, registrationDetails: e.target.value })}
                  />
                </div>

              </div>

              {/* Commission Rates Configurator */}
              <div style={{ backgroundColor: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>
                  Commission Rates Management (Configurable Per Role)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                  <div>
                    <label className="form-label">District Coordinator</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={cmsForm.commissionRates?.districtRate || ''}
                      onChange={(e) => setCmsForm({
                        ...cmsForm,
                        commissionRates: { ...cmsForm.commissionRates, districtRate: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Block Coordinator</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={cmsForm.commissionRates?.blockRate || ''}
                      onChange={(e) => setCmsForm({
                        ...cmsForm,
                        commissionRates: { ...cmsForm.commissionRates, blockRate: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="form-label">School / College</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={cmsForm.commissionRates?.schoolRate || ''}
                      onChange={(e) => setCmsForm({
                        ...cmsForm,
                        commissionRates: { ...cmsForm.commissionRates, schoolRate: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Online Center</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={cmsForm.commissionRates?.onlineCenterRate || ''}
                      onChange={(e) => setCmsForm({
                        ...cmsForm,
                        commissionRates: { ...cmsForm.commissionRates, onlineCenterRate: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Top Announcement Bar Editor */}
              <div style={{ backgroundColor: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>
                  Top Announcement Ticker Item 1
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">English Text</label>
                    <input 
                      type="text"
                      className="form-control"
                      value={cmsForm.announcements?.[0]?.en || ''}
                      onChange={(e) => {
                        const arr = [...cmsForm.announcements];
                        arr[0].en = e.target.value;
                        setCmsForm({ ...cmsForm, announcements: arr });
                      }}
                    />
                  </div>
                  <div>
                    <label className="form-label">Hindi Text (हिंदी)</label>
                    <input 
                      type="text"
                      className="form-control"
                      value={cmsForm.announcements?.[0]?.hi || ''}
                      onChange={(e) => {
                        const arr = [...cmsForm.announcements];
                        arr[0].hi = e.target.value;
                        setCmsForm({ ...cmsForm, announcements: arr });
                      }}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg">
                <Save size={18} />
                <span>{t.cmsBtnSave}</span>
              </button>

            </form>
          </div>
        )}

        {/* ====================================================================
            TAB 3: ANALYTICS & DISTRICT CHARTS
            ==================================================================== */}
        {activeTab === 'analytics' && (
          <div className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              
              {/* Chart 1: Applications by District (SVG Bar Chart) */}
              <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.5rem' }}>
                  Applications by District (Geographic Distribution)
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { district: 'Jabalpur', count: 18, color: '#1E40AF' },
                    { district: 'Bhopal', count: 14, color: '#2563EB' },
                    { district: 'Indore', count: 12, color: '#3B82F6' },
                    { district: 'Rewa', count: 9, color: '#60A5FA' },
                    { district: 'Mandla', count: 7, color: '#93C5FD' },
                    { district: 'Gwalior', count: 6, color: '#BFDBFE' }
                  ].map((item) => (
                    <div key={item.district}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>
                        <span>{item.district}</span>
                        <span>{item.count} Applicants</span>
                      </div>
                      <div style={{ height: '10px', backgroundColor: '#F1F5F9', borderRadius: '6px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(item.count / 20) * 100}%`, backgroundColor: item.color, borderRadius: '6px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart 2: Applications by Category */}
              <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.5rem' }}>
                  Applications by Social Category
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {[
                    { cat: 'General', pct: '30%', count: 18, color: '#1E293B' },
                    { cat: 'OBC (Other Backward Class)', pct: '38%', count: 23, color: '#D97706' },
                    { cat: 'SC (Scheduled Caste)', pct: '18%', count: 11, color: '#DC2626' },
                    { cat: 'ST (Scheduled Tribe)', pct: '14%', count: 8, color: '#16A34A' }
                  ].map((item) => (
                    <div key={item.cat}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>
                        <span>{item.cat}</span>
                        <span>{item.pct} ({item.count})</span>
                      </div>
                      <div style={{ height: '10px', backgroundColor: '#F1F5F9', borderRadius: '6px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: item.pct, backgroundColor: item.color, borderRadius: '6px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ====================================================================
            APPLICATION SCRUTINY & ACTION MODAL
            ==================================================================== */}
        {activeModalApp && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem'
          }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '740px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <span className="badge badge-blue" style={{ marginBottom: '0.25rem' }}>
                    {activeModalApp.id}
                  </span>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
                    {activeModalApp.studentName}
                  </h3>
                </div>
                <button 
                  onClick={() => setActiveModalApp(null)}
                  style={{ color: '#64748B', fontSize: '1.5rem', fontWeight: 700 }}
                >
                  ✕
                </button>
              </div>

              {/* Applicant Info Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', fontSize: '0.875rem', backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
                <div><strong>Father:</strong> {activeModalApp.fatherName}</div>
                <div><strong>Mobile:</strong> {activeModalApp.mobile}</div>
                <div><strong>Institution:</strong> {activeModalApp.institution}</div>
                <div><strong>Course:</strong> {activeModalApp.course}</div>
                <div><strong>District / Block:</strong> {activeModalApp.district} / {activeModalApp.block}</div>
                <div><strong>Category:</strong> {activeModalApp.category}</div>
                <div><strong>Bank:</strong> {activeModalApp.bankName}</div>
                <div><strong>Account No:</strong> {activeModalApp.accountNumber}</div>
                <div><strong>IFSC:</strong> {activeModalApp.ifsc}</div>
                <div><strong>Current Status:</strong> <span className="badge badge-navy">{activeModalApp.status}</span></div>
              </div>

              {/* Scrutiny Remarks Box */}
              <div className="form-group">
                <label className="form-label">Verifier Remarks / Rejection Reason</label>
                <textarea 
                  className="form-control"
                  rows={3}
                  placeholder="Enter specific verification comments, rejection reasons, or correction requirements..."
                  value={actionRemarks}
                  onChange={(e) => setActionRemarks(e.target.value)}
                />
              </div>

              {/* Verification Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => handleReject(activeModalApp.id)}
                  >
                    <X size={14} />
                    <span>Reject</span>
                  </button>

                  <button 
                    className="btn btn-outline btn-sm"
                    style={{ borderColor: '#D97706', color: '#D97706' }}
                    onClick={() => handleRequestCorrection(activeModalApp.id)}
                  >
                    <AlertTriangle size={14} />
                    <span>Request Correction</span>
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleApprove(activeModalApp.id)}
                  >
                    <Check size={14} />
                    <span>Approve Application</span>
                  </button>

                  {activeModalApp.status === 'Approved' && (
                    <button 
                      className="btn btn-gold btn-sm"
                      onClick={() => handleReleasePayment(activeModalApp.id)}
                    >
                      <CreditCard size={14} />
                      <span>Release DBT Payment</span>
                    </button>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
