import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { applicationService } from '../services/applicationService';
import { authService } from '../services/authService';
import { grievanceService } from '../services/grievanceService';
import { 
  User, 
  Download, 
  Printer, 
  FileText, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Bell, 
  FileCheck, 
  ArrowRight,
  ShieldCheck,
  Building,
  Search,
  Award,
  ExternalLink,
  Loader2,
  AlertTriangle,
  Upload,
  CheckCircle,
  Sparkles,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { initiateScholarshipFeePayment, isRazorpayTestMode } from '../services/razorpayService';

export const StudentDashboard = () => {
  const { lang, t, navigate, activeStudentApp, setActiveStudentApp, updateStudentFeePayment, cms, grievances, logout } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [studentGrievances, setStudentGrievances] = useState([]);
  const [payingFee, setPayingFee] = useState(false);

  const [allStudentApps, setAllStudentApps] = useState([]);

  // Default to activeStudentApp or search
  const student = activeStudentApp;

  // Refresh active student application record directly from Supabase
  const refreshStudentApplication = async (silent = false) => {
    const targetId = student?.id || student?.mobile;
    if (!targetId) return;
    if (!silent) setRefreshing(true);
    try {
      let fresh = null;
      if (student.id) {
        fresh = await applicationService.getApplicationById(student.id);
      }
      if (!fresh && student.mobile) {
        const authRes = await authService.signInStudent(student.mobile);
        if (authRes?.studentApp) fresh = authRes.studentApp;
      }
      if (fresh && fresh.id) {
        setActiveStudentApp(fresh);
      }
      if (student.mobile) {
        const all = await applicationService.getApplicationsByMobile(student.mobile);
        if (all && all.length > 0) setAllStudentApps(all);
      }
    } catch (err) {
      console.warn('Dashboard sync error:', err);
    } finally {
      if (!silent) setRefreshing(false);
    }
  };

  // Sync on mount or when student id/mobile changes
  useEffect(() => {
    if (student?.id || student?.mobile) {
      refreshStudentApplication(true);
    }
  }, [student?.id, student?.mobile]);

  useEffect(() => {
    if (student?.mobile) {
      applicationService.getApplicationsByMobile(student.mobile).then(apps => {
        if (apps && apps.length > 0) setAllStudentApps(apps);
      }).catch(err => console.warn('Error fetching all apps for student:', err));
    }
  }, [student?.mobile]);

  useEffect(() => {
    if (student?.id || student?.mobile) {
      const q = student.id || student.mobile;
      grievanceService.getGrievances({ mobile: student.mobile }).then(grvs => {
        if (grvs) setStudentGrievances(grvs);
      }).catch(err => console.warn('Grievance fetch error:', err));
    }
  }, [student]);

  const getStageClass = (stepNumber, currentStage, status) => {
    if (status === 'Rejected' || status === 'REJECTED') {
      if (stepNumber <= currentStage) return 'rejected';
      return '';
    }
    if (stepNumber < currentStage) return 'completed';
    if (stepNumber === currentStage) return 'active';
    return '';
  };

  const handleLookup = async (e, directQuery = null) => {
    e?.preventDefault();
    const cleanQ = (directQuery || searchQuery).trim();
    if (!cleanQ) return;
    if (directQuery) setSearchQuery(directQuery);
    setLoading(true);
    setSearchError('');
    try {
      let found = null;
      // 1. Direct fetch by ID
      found = await applicationService.getApplicationById(cleanQ);

      // 2. Try uppercase if ID starts with jmf-
      if (!found && cleanQ.toLowerCase().startsWith('jmf-')) {
        found = await applicationService.getApplicationById(cleanQ.toUpperCase());
      }

      // 3. If searching by mobile or numeric ID, attempt direct student lookup
      if (!found) {
        try {
          const authRes = await authService.signInStudent(cleanQ);
          if (authRes?.studentApp) {
            found = authRes.studentApp;
          }
        } catch (authErr) {}
      }

      // 4. Fallback to public trackApplication
      if (!found) {
        const result = await applicationService.trackApplication(cleanQ);
        if (result?.id) {
          found = await applicationService.getApplicationById(result.id);
        }
      }

      if (found) {
        setActiveStudentApp(found);
      } else {
        setSearchError(lang === 'hi' ? 'इस आवेदन क्रमांक अथवा मोबाइल नंबर से कोई छात्रवृत्ति रिकॉर्ड नहीं मिला।' : 'No student application found matching this ID or Mobile number.');
      }
    } catch (err) {
      console.error('Lookup error:', err);
      setSearchError('Error retrieving application record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!student) {
    return (
      <div className="section-py" style={{ backgroundColor: '#F8FAFC', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#EFF6FF', color: '#1E40AF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <User size={32} />
            </div>
            <span className="badge badge-navy" style={{ marginBottom: '0.75rem' }}>STUDENT PORTAL</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
              {lang === 'hi' ? 'विद्यार्थी डैशबोर्ड लॉगिन / खोज' : 'Access Your Student Dashboard'}
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '2rem' }}>
              {lang === 'hi'
                ? 'अपने आवेदन पत्र की स्थिति, छात्रवृत्ति डीबीटी विवरण एवं प्रमाण पत्र देखने के लिए अपना आवेदन क्रमांक दर्ज करें।'
                : 'Enter your Application ID (e.g. JMF-2026-108234) or registered mobile number to access your portal.'}
            </p>

            {searchError && (
              <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', padding: '0.85rem', borderRadius: '10px', color: '#991B1B', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                {searchError}
              </div>
            )}

            <form onSubmit={handleLookup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                type="text"
                className="form-control"
                placeholder={lang === 'hi' ? 'आवेदन क्रमांक (उदा. JMF-2026-108234) अथवा मोबाइल' : 'Application ID (e.g. JMF-2026-108234) or Mobile'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ height: '48px', fontSize: '1rem', textAlign: 'center' }}
                required
              />
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                <span>{loading ? 'Searching Record...' : 'Access Dashboard'}</span>
              </button>
            </form>

            <div style={{ marginTop: '2rem', borderTop: '1px solid #E2E8F0', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button 
                  type="button"
                  className="btn btn-outline btn-sm" 
                  onClick={() => handleLookup(null, 'JMF-2026-108234')}
                  style={{ color: '#1E40AF', borderColor: '#BFDBFE', fontWeight: 700 }}
                >
                  Try Demo: JMF-2026-108234
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/student-register')} style={{ backgroundColor: '#2563EB', borderColor: '#2563EB', fontWeight: 700 }}>
                  ✨ {lang === 'hi' ? 'नया आवेदक खाता बनाएं' : 'Create New Applicant'}
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate('/apply')}>
                  {lang === 'hi' ? 'आवेदन फॉर्म भरें' : 'Fill Application Form'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isApproved = student.status === 'Approved' || student.status === 'APPROVED' || student.status === 'Scholarship Released' || student.status === 'SCHOLARSHIP_RELEASED' || student.stage === 5;
  const isReleased = student.status === 'Scholarship Released' || student.status === 'SCHOLARSHIP_RELEASED' || student.rawStatus === 'SCHOLARSHIP_RELEASED' || student.stage === 5;

  return (
    <div className="section-py" style={{ backgroundColor: '#F8FAFC', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Welcome Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
              <span className="badge badge-navy">
                {lang === 'hi' ? 'विद्यार्थी पोर्टल' : 'STUDENT SCHOLARSHIP PORTAL'}
              </span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '3px 9px',
                borderRadius: '999px',
                border: '1px solid #86EFAC'
              }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#16A34A', display: 'inline-block' }} />
                {lang === 'hi' ? 'सत्र सक्रिय (लॉग इन)' : 'Active Session (Logged In)'}
              </span>
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A' }}>
              {lang === 'hi' ? `नमस्ते, ${student.studentName}` : `Welcome, ${student.studentName}`}
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
              Application ID: <strong style={{ color: '#1E40AF' }}>{student.id}</strong> | Mobile: {student.mobile}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', maxWidth: '100%' }}>
            {/* Primary Logout Button - Prominent, first, never clipped */}
            <button 
              className="btn btn-sm" 
              onClick={logout} 
              style={{ 
                backgroundColor: '#FEF2F2', 
                color: '#DC2626', 
                borderColor: '#FECACA', 
                borderWidth: '1px', 
                borderStyle: 'solid', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '5px',
                fontWeight: 700,
                padding: '0.38rem 0.75rem',
                flexShrink: 0
              }}
              title={lang === 'hi' ? 'विद्यार्थी सत्र से लॉगआउट करें' : 'Logout from Student Session'}
            >
              <LogOut size={14} />
              <span>{lang === 'hi' ? 'लॉगआउट' : 'Logout'}</span>
            </button>

            <button className="btn btn-outline btn-sm" onClick={() => refreshStudentApplication(false)} title="Check latest updates from scrutiny officer" style={{ padding: '0.38rem 0.75rem', flexShrink: 0 }}>
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              <span>{refreshing ? 'Updating...' : (lang === 'hi' ? 'रीफ्रेश' : 'Refresh Status')}</span>
            </button>
            {isApproved && (
              <button className="btn btn-gold btn-sm" onClick={() => navigate(`/certificate/${student.id}`)} style={{ padding: '0.38rem 0.75rem', flexShrink: 0 }}>
                <Award size={14} />
                <span>View Certificate</span>
              </button>
            )}
            <button className="btn btn-outline btn-sm" onClick={() => {
              setActiveStudentApp(null);
              localStorage.removeItem('jmf_active_student_app');
              localStorage.removeItem('jmf_active_app_id');
              localStorage.removeItem('jmf_student_user');
            }} style={{ padding: '0.38rem 0.75rem', flexShrink: 0 }}>
              <span>{lang === 'hi' ? 'खाता बदलें' : 'Switch App'}</span>
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/merit-list')} style={{ color: '#1E40AF', borderColor: '#93C5FD', backgroundColor: '#EFF6FF', padding: '0.38rem 0.75rem', flexShrink: 0 }}>
              <Award size={14} />
              <span>{lang === 'hi' ? 'मेरिट सूची' : 'Merit List'}</span>
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => window.print()} style={{ padding: '0.38rem 0.75rem', flexShrink: 0 }}>
              <Printer size={14} />
              <span>{t.btnDownloadReceipt}</span>
            </button>
          </div>
        </div>

        {/* Multi-application dossier switcher if student has multiple applications */}
        {allStudentApps.length > 1 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1.25rem',
            backgroundColor: '#EFF6FF',
            borderRadius: '12px',
            border: '1px solid #BFDBFE',
            marginBottom: '1.75rem',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1E40AF' }}>
              {lang === 'hi' ? 'आपके पंजीकृत आवेदन पत्र:' : 'Your Registered Applications:'}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {allStudentApps.map(a => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => {
                    setActiveStudentApp(a);
                    localStorage.setItem('jmf_active_app_id', a.id);
                    localStorage.setItem('jmf_active_student_app', JSON.stringify(a));
                  }}
                  className={`btn btn-sm ${a.id === student.id ? 'btn-primary' : 'btn-outline'}`}
                  style={{
                    fontSize: '0.82rem',
                    padding: '0.35rem 0.85rem',
                    fontWeight: 700,
                    backgroundColor: a.id === student.id ? '#1E40AF' : '#FFFFFF',
                    borderColor: a.id === student.id ? '#1E40AF' : '#93C5FD'
                  }}
                >
                  <span>{a.id}</span>
                  <span className={`badge ${a.status === 'Scholarship Released' ? 'badge-green' : 'badge-navy'}`} style={{ fontSize: '0.7rem', marginLeft: '0.4rem', padding: '0.15rem 0.4rem' }}>
                    {a.status === 'Scholarship Released' ? '✓ Disbursed' : a.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid-editorial" style={{ gap: '2rem' }}>
          
          {/* Left Column: Application Details & Status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Phase 2 Alert: Correction Requested */}
            {student.status === 'Correction Requested' && (
              <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <AlertTriangle size={24} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#92400E' }}>
                    {lang === 'hi' ? 'दस्तावेज़ सुधार आवश्यक (Correction Requested)' : 'Document Correction Requested by Nodal Officer'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#78350F', marginTop: '0.35rem' }}>
                    <strong>Officer Remarks:</strong> {student.correctionRemarks || student.rejectionReason || 'Uploaded institutional bonafide/marksheet is blurry or mismatched. Please re-upload clear stamped copy.'}
                  </div>
                  <div style={{ marginTop: '0.85rem' }}>
                    <button className="btn btn-sm" style={{ backgroundColor: '#D97706', color: '#FFFFFF', borderColor: '#D97706' }} onClick={() => navigate('/documents')}>
                      <Upload size={14} />
                      <span>{lang === 'hi' ? 'दस्तावेज़ पुनः अपलोड करें' : 'Re-upload Corrected Documents'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Approved & Sanctioned Banner */}
            {!isReleased && (student.status === 'Approved' || student.rawStatus === 'APPROVED') && (
              <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #93C5FD', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CheckCircle size={28} color="#2563EB" />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1E40AF' }}>
                      {lang === 'hi' ? 'आवेदन स्वीकृत - छात्रवृत्ति राशि ₹12,000 स्वीकृत' : 'Application Approved - Scholarship Grant Sanctioned (₹12,000)'}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#1E3A8A', marginTop: '2px' }}>
                      {lang === 'hi' 
                        ? `दस्तावेज़ सत्यापन पूर्ण। ट्रस्ट प्रशासन द्वारा आपके बैंक खाते (${student.bankName || 'SBI'}, खाता: ${student.accountNumber || 'दर्ज'}, IFSC: ${student.ifsc || 'SBIN0001234'}) में राशि सीधे स्थानांतरित की जा रही है।`
                        : `Document scrutiny verified. Scholarship amount of ₹12,000 will be manually transferred by trust administration to your verified account (${student.bankName || 'SBI'}, A/c: ${student.accountNumber || 'Recorded'}, IFSC: ${student.ifsc || 'SBIN0001234'}).`}
                    </div>
                  </div>
                </div>
                <button className="btn btn-sm" style={{ backgroundColor: '#2563EB', color: '#FFFFFF', borderColor: '#2563EB' }} onClick={() => navigate(`/certificate/${student.id}`)}>
                  <Award size={14} />
                  <span>{lang === 'hi' ? 'स्वीकृति प्रमाण पत्र देखें' : 'View Sanction Certificate'}</span>
                </button>
              </div>
            )}

            {/* Phase 4 Banner: Scholarship Released & UTR Confirmation */}
            {isReleased && (
              <div style={{ backgroundColor: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CheckCircle size={28} color="#16A34A" />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#166534' }}>
                      {lang === 'hi' ? 'छात्रवृत्ति राशि बैंक खाते में जारी (DBT Payout Complete)' : 'Scholarship Grant Disbursed via Direct Benefit Transfer!'}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#14532D', marginTop: '2px' }}>
                      Banking UTR: <strong style={{ fontFamily: 'monospace' }}>{student.utrNumber}</strong> • Amount: <strong>{student.disbursedAmount}</strong>
                    </div>
                  </div>
                </div>
                <button className="btn btn-sm" style={{ backgroundColor: '#16A34A', color: '#FFFFFF', borderColor: '#16A34A' }} onClick={() => navigate(`/certificate/${student.id}`)}>
                  <Award size={14} />
                  <span>{lang === 'hi' ? 'प्रमाण पत्र डाउनलोड करें' : 'Download Award Certificate'}</span>
                </button>
              </div>
            )}

            {/* Live Status Card */}
            <div className="card" style={{ borderTop: '4px solid #1E40AF' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                  {t.dashAppDetails}
                </h3>
                <span className={`badge ${
                  isReleased ? 'badge-green' :
                  student.status === 'Approved' || student.rawStatus === 'APPROVED' ? 'badge-blue' :
                  student.status === 'Rejected' || student.rawStatus === 'REJECTED' ? 'badge-red' :
                  student.status === 'Correction Requested' || student.rawStatus === 'CORRECTION_REQUESTED' ? 'badge-yellow' : 'badge-navy'
                }`}>
                  {student.status}
                </span>
              </div>

              <div className="grid-2" style={{ gap: '0.75rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                <div><strong>Class / Course:</strong> {student.course}</div>
                <div><strong>Institution:</strong> {student.institution}</div>
                <div><strong>District:</strong> {student.district}</div>
                <div><strong>Social Category:</strong> {student.category}</div>
                <div><strong>Submission Date:</strong> {student.submissionDate}</div>
                <div><strong>Bank Name:</strong> {student.bankName}</div>
              </div>

              {/* Real-time Scholarship Status Tracking Stepper */}
              <div style={{ marginTop: '0.5rem', paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} color="#2563EB" />
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>
                      {lang === 'hi' ? 'छात्रवृत्ति प्रगति ट्रैकिंग' : 'Scholarship Progress Tracking'}
                    </span>
                  </div>
                  <span className={`badge ${
                    isReleased ? 'badge-green' :
                    student.status === 'Approved' ? 'badge-blue' :
                    student.status === 'Rejected' ? 'badge-red' :
                    student.status === 'Correction Requested' ? 'badge-yellow' : 'badge-navy'
                  }`} style={{ fontSize: '0.75rem' }}>
                    Stage {student.stage || (isReleased ? 5 : 2)} of 5 • {student.status}
                  </span>
                </div>

                {/* Stepper */}
                <div className="timeline-stepper" style={{ margin: '1.5rem 0' }}>
                  <div className={`timeline-step ${getStageClass(1, student.stage, student.status)}`}>
                    <div className="timeline-circle">01</div>
                    <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#0F172A', marginBottom: '0.2rem' }}>
                      {lang === 'hi' ? 'आवेदन' : 'Applied'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                      {student.submissionDate || 'Submitted'}
                    </div>
                  </div>

                  <div className={`timeline-step ${getStageClass(2, student.stage, student.status)}`}>
                    <div className="timeline-circle">02</div>
                    <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#0F172A', marginBottom: '0.2rem' }}>
                      {lang === 'hi' ? 'संवीक्षा' : 'Scrutiny'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                      {student.stage >= 2 ? 'In Review' : 'Pending'}
                    </div>
                  </div>

                  <div className={`timeline-step ${getStageClass(3, student.stage, student.status)}`}>
                    <div className="timeline-circle">03</div>
                    <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#0F172A', marginBottom: '0.2rem' }}>
                      {lang === 'hi' ? 'सत्यापन' : 'District Cell'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                      {student.stage >= 3 ? 'Verified' : 'Pending'}
                    </div>
                  </div>

                  <div className={`timeline-step ${getStageClass(4, student.stage, student.status)}`}>
                    <div className="timeline-circle">04</div>
                    <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#0F172A', marginBottom: '0.2rem' }}>
                      {lang === 'hi' ? 'अनुमोदन' : 'Approved'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                      {student.approvalDate && student.approvalDate !== '-' ? student.approvalDate : (student.stage >= 4 ? 'Approved' : 'Pending')}
                    </div>
                  </div>

                  <div className={`timeline-step ${getStageClass(5, student.stage, student.status)}`}>
                    <div className="timeline-circle">05</div>
                    <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#0F172A', marginBottom: '0.2rem' }}>
                      {lang === 'hi' ? 'डीबीटी' : 'Disbursed'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                      {student.paymentDate && student.paymentDate !== '-' ? student.paymentDate : (isReleased ? 'Disbursed' : 'Pending')}
                    </div>
                  </div>
                </div>

                {/* Progress bar line */}
                <div style={{ height: '6px', backgroundColor: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(Math.min(student.stage || 2, 5) / 5) * 100}%`, backgroundColor: student.status === 'Rejected' ? '#DC2626' : '#16A34A', transition: 'width 0.3s' }} />
                </div>
              </div>
            </div>

            {/* Payment & DBT Release Status */}
            <div className="card" style={{ borderTop: '4px solid #16A34A' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CreditCard size={22} color="#16A34A" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                    {t.dashPayment}
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>
                    {student.registrationFeeStatus === 'PAID' || student.razorpayPaymentId ? 'Fee: ₹211.30 Paid ✓' : 'Fee: Pending'}
                  </span>
                </div>
              </div>

              {/* Registration Fee Banner */}
              <div style={{
                backgroundColor: student.registrationFeeStatus === 'PAID' || student.razorpayPaymentId ? '#F0FDF4' : '#FFFBEB',
                border: `1px solid ${student.registrationFeeStatus === 'PAID' || student.razorpayPaymentId ? '#BBF7D0' : '#FCD34D'}`,
                borderRadius: '10px',
                padding: '0.85rem 1.25rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: student.registrationFeeStatus === 'PAID' || student.razorpayPaymentId ? '#DCFCE7' : '#FEF3C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: student.registrationFeeStatus === 'PAID' || student.razorpayPaymentId ? '#16A34A' : '#D97706'
                  }}>
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>
                      Scholarship Registration Fee: <strong>₹ 211.30</strong>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      {student.registrationFeeStatus === 'PAID' || student.razorpayPaymentId
                        ? `Paid via Razorpay • Ref: ${student.razorpayPaymentId || 'pay_jmf2026_verified'}`
                        : 'Application registration fee is pending. Pay securely via Razorpay to expedite processing.'}
                    </div>
                  </div>
                </div>

                {!(student.registrationFeeStatus === 'PAID' || student.razorpayPaymentId) && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    disabled={payingFee}
                    onClick={async () => {
                      setPayingFee(true);
                      try {
                        await initiateScholarshipFeePayment({
                          amountInRupees: 211.30,
                          student: {
                            fullName: student.studentName,
                            mobile: student.mobile,
                            email: student.email,
                            applicationId: student.id
                          },
                          onSuccess: async (paymentResult) => {
                            setPayingFee(false);
                            if (updateStudentFeePayment) {
                              await updateStudentFeePayment(student.id, paymentResult);
                            }
                            setActiveStudentApp(prev => ({
                              ...prev,
                              registrationFeeStatus: 'PAID',
                              razorpayPaymentId: paymentResult.paymentId,
                              feePaymentDate: paymentResult.date
                            }));
                            alert('Registration fee of ₹211.30 paid successfully via Razorpay!');
                          },
                          onFailure: (err) => {
                            setPayingFee(false);
                            alert('Payment note: ' + (err?.message || 'Transaction was not completed.'));
                          },
                          onDismiss: () => {
                            setPayingFee(false);
                          }
                        });
                      } catch (e) {
                        setPayingFee(false);
                      }
                    }}
                    style={{ backgroundColor: '#2563EB', borderColor: '#2563EB', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                  >
                    <Sparkles size={14} />
                    <span>{payingFee ? 'Processing...' : 'Pay ₹ 211.30 via Razorpay'}</span>
                    {isRazorpayTestMode() ? (
                      <span style={{ backgroundColor: '#FEF08A', color: '#854D0E', fontSize: '0.65rem', fontWeight: 900, padding: '1px 5px', borderRadius: '4px' }}>TEST MODE</span>
                    ) : (
                      <span style={{ backgroundColor: '#DCFCE7', color: '#166534', fontSize: '0.65rem', fontWeight: 900, padding: '1px 5px', borderRadius: '4px' }}>LIVE SECURED</span>
                    )}
                  </button>
                )}
              </div>

              <div className="grid-3" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Scholarship Amount</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16A34A', margin: '0.25rem 0' }}>
                    <span className="editable-field">{student.disbursedAmount}</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Direct Bank Transfer</div>
                </div>

                <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Payment Status</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0.25rem 0' }}>
                    {student.paymentDate === 'Queued' || student.paymentDate === 'In Payment Queue' ? 'In Bank Queue' : student.paymentDate !== '-' ? 'Released' : 'Under Review'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Date: {student.paymentDate}</div>
                </div>

                <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>UTR / Ref No.</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E40AF', fontFamily: 'monospace', margin: '0.25rem 0' }}>
                    {student.utrNumber}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Banking Acknowledgment</div>
                </div>
              </div>
            </div>

            {/* Documents Scrutiny Quick Status */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                  {t.dashDocs}
                </h3>
                <button className="btn btn-outline btn-sm" onClick={() => navigate('/documents')}>
                  <span>Manage All</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {Object.entries(student.documents || {}).map(([key, val]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: '#F8FAFC', borderRadius: '8px', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{key}</span>
                    <span className={`badge ${val.status === 'Verified' ? 'badge-green' : val.status === 'Rejected' ? 'badge-red' : 'badge-navy'}`}>
                      {val.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Notifications & Grievance Tickets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Quick Downloads Card */}
            <div className="card" style={{ backgroundColor: '#1B2A4E', color: '#FFFFFF' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem' }}>
                {lang === 'hi' ? 'आधिकारिक डाउनलोड' : 'Official Downloads'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button 
                  className="btn btn-outline-white btn-sm"
                  style={{ justifyContent: 'space-between' }}
                  onClick={() => window.print()}
                >
                  <span>Application Acknowledgement Slip</span>
                  <Printer size={14} />
                </button>
                <button 
                  className="btn btn-outline-white btn-sm"
                  style={{ justifyContent: 'space-between' }}
                  onClick={() => navigate('/downloads')}
                >
                  <span>Scheme Guidelines 2026-27</span>
                  <Download size={14} />
                </button>
              </div>
            </div>

            {/* Notifications Box */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Bell size={18} color="#1E40AF" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                  {lang === 'hi' ? 'महत्वपूर्ण सूचनाएं' : 'Recent Notifications'}
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ borderLeft: '3px solid #16A34A', paddingLeft: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>2026-09-10</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>Document Scrutiny Ongoing</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Your submitted records are currently under district coordinator review.</div>
                </div>

                <div style={{ borderLeft: '3px solid #1E40AF', paddingLeft: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>2026-09-02</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>Application Successfully Registered</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Your registration ID {student.id} was generated successfully.</div>
                </div>
              </div>
            </div>

            {/* Grievance Status & Help */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                  {t.dashGrievance}
                </h3>
                <button className="btn btn-outline btn-sm" onClick={() => navigate('/grievance')}>
                  <span>Raise New</span>
                </button>
              </div>

              {studentGrievances.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {studentGrievances.map((g) => (
                    <div key={g.id} style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                        <span>{g.id}</span>
                        <span className="badge badge-yellow">{g.status}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>{g.category}: {g.description}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: '#64748B', textAlign: 'center', padding: '1rem 0' }}>
                  No active grievances filed. Need help?
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
