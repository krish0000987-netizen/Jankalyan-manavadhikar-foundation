import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle, 
  Printer, 
  UserCheck, 
  Calendar, 
  CreditCard, 
  Building,
  ShieldCheck,
  FileText
} from 'lucide-react';

import { applicationService } from '../services/applicationService';

export const Track = () => {
  const { lang, t, navigate, applications, activeStudentApp, setActiveStudentApp } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e, customQuery = null) => {
    e?.preventDefault();
    const query = (customQuery !== null ? customQuery : searchQuery).trim();
    if (!query) return;
    if (customQuery !== null) {
      setSearchQuery(customQuery);
    }

    setHasSearched(true);
    setSearching(true);
    try {
      // 1. Query Supabase database
      const liveResult = await applicationService.trackApplication(query);
      if (liveResult) {
        setSearchResult(liveResult);
        setActiveStudentApp(liveResult);
        setNotFound(false);
      } else {
        // Fallback to local memory applications
        const found = applications.find(
          app => app.id.toLowerCase() === query.toLowerCase() || app.mobile === query
        );
        if (found) {
          setSearchResult(found);
          setActiveStudentApp(found);
          setNotFound(false);
        } else {
          setNotFound(true);
          setSearchResult(null);
        }
      }
    } catch (err) {
      console.warn('Track error:', err);
      const found = applications.find(
        app => app.id.toLowerCase() === query.toLowerCase() || app.mobile === query
      );
      if (found) {
        setSearchResult(found);
        setNotFound(false);
      } else {
        setNotFound(true);
        setSearchResult(null);
      }
    } finally {
      setSearching(false);
    }
  };

  const getStageClass = (stepNumber, currentStage, status) => {
    if (status === 'Rejected') {
      if (stepNumber <= currentStage) return 'rejected';
      return '';
    }
    if (stepNumber < currentStage) return 'completed';
    if (stepNumber === currentStage) return 'active';
    return '';
  };

  return (
    <div className="section-py" style={{ backgroundColor: '#F8FAFC', minHeight: '80vh' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.5rem' }}>
          <span className="badge badge-navy" style={{ marginBottom: '0.75rem' }}>
            {lang === 'hi' ? 'लाइव स्थिति ट्रैकिंग' : 'REAL-TIME TRACKING'}
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
            {t.trackTitle}
          </h1>
          <p style={{ color: '#64748B', fontSize: '1rem' }}>
            {t.trackSubtitle}
          </p>
        </div>

        {/* Search Bar */}
        <div className="card" style={{ maxWidth: '680px', margin: '0 auto 3rem', padding: '1.75rem' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem' }}>
            <input 
              type="text"
              className="form-control"
              placeholder={t.trackInputPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ fontSize: '1rem' }}
            />
            <button className="btn btn-primary" type="submit" disabled={searching}>
              <Search size={18} />
              <span>{searching ? '...' : t.btnSearchTrack}</span>
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.8rem', color: '#64748B' }}>
            <span>{lang === 'hi' ? 'त्वरित डेमो परीक्षण:' : 'Quick Demo Search:'}</span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                onClick={() => handleSearch(null, 'JMF-2026-108234')}
                style={{ color: '#1E40AF', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Released Demo
              </button>
              <span>•</span>
              <button 
                type="button" 
                onClick={() => handleSearch(null, 'JMF-2026-100001')}
                style={{ color: '#1E40AF', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Under Verification
              </button>
              <span>•</span>
              <button 
                type="button" 
                onClick={() => handleSearch(null, 'JMF-2026-112048')}
                style={{ color: '#DC2626', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Correction Required
              </button>
            </div>
          </div>

          {activeStudentApp && (
            <div style={{ marginTop: '0.85rem', padding: '0.65rem 1rem', backgroundColor: '#EFF6FF', borderRadius: '8px', border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', color: '#1E40AF' }}>
                {lang === 'hi' ? 'आपका सक्रिय आवेदन:' : 'Your Active Application:'} <strong>{activeStudentApp.id}</strong> ({activeStudentApp.studentName})
              </span>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setSearchQuery(activeStudentApp.id);
                  setSearchResult(activeStudentApp);
                  setNotFound(false);
                }}
                style={{ padding: '0.25rem 0.75rem', fontSize: '0.78rem', backgroundColor: '#2563EB', borderColor: '#2563EB' }}
              >
                {lang === 'hi' ? 'स्थिति देखें' : 'Track Now'}
              </button>
            </div>
          )}
        </div>

        {/* Search Not Found Alert */}
        {notFound && (
          <div className="card" style={{ maxWidth: '680px', margin: '0 auto 2rem', backgroundColor: '#FEF2F2', borderColor: '#FECACA', textAlign: 'center', padding: '2rem' }}>
            <AlertCircle size={36} color="#DC2626" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#991B1B', marginBottom: '0.4rem' }}>
              {lang === 'hi' ? 'आवेदन रिकॉर्ड नहीं मिला' : 'Application Not Found'}
            </h3>
            <p style={{ color: '#B91C1C', fontSize: '0.9rem' }}>
              {lang === 'hi' 
                ? 'कृपया दर्ज की गई Application ID अथवा मोबाइल नंबर की पुनः जांच करें।' 
                : 'Please verify the entered Application ID or 10-digit mobile number and try again.'}
            </p>
          </div>
        )}

        {/* Search Result Tracking Container */}
        {searchResult && (
          <div className="card animate-fade-in" style={{ maxWidth: '920px', margin: '0 auto', padding: '2.5rem' }}>
            
            {/* Summary Top Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge badge-navy" style={{ marginBottom: '0.4rem' }}>
                  Application ID
                </span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1B2A4E' }}>
                  {searchResult.id}
                </h2>
                <div style={{ fontSize: '0.9rem', color: '#64748B' }}>
                  Student: <strong>{searchResult.studentName}</strong> | {searchResult.institution} ({searchResult.course})
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className={`badge ${
                  searchResult.status === 'Scholarship Released' || searchResult.rawStatus === 'SCHOLARSHIP_RELEASED' || searchResult.stage === 5 ? 'badge-green' :
                  searchResult.status === 'Approved' ? 'badge-blue' :
                  searchResult.status === 'Rejected' ? 'badge-red' :
                  searchResult.status === 'Correction Requested' ? 'badge-yellow' : 'badge-navy'
                }`} style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
                  {searchResult.status}
                </span>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.4rem' }}>
                  Submitted: {searchResult.submissionDate}
                </div>
              </div>
            </div>

            {/* Rejection / Correction Banner */}
            {searchResult.status === 'Rejected' && (
              <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '1.25rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <XCircle size={22} color="#DC2626" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontWeight: 800, color: '#991B1B', fontSize: '1rem', marginBottom: '0.25rem' }}>
                    {lang === 'hi' ? 'आवेदन अस्वीकृति का कारण' : 'Application Rejection Remarks'}
                  </h4>
                  <p style={{ color: '#B91C1C', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    {searchResult.rejectionReason || (lang === 'hi' ? 'संस्थागत मापदंडों के अनुसार अपात्र पाया गया।' : 'Found ineligible as per foundation criteria.')}
                  </p>
                </div>
              </div>
            )}

            {searchResult.status === 'Correction Requested' && (
              <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '12px', padding: '1.25rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <AlertCircle size={22} color="#D97706" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div style={{ flexGrow: 1 }}>
                  <h4 style={{ fontWeight: 800, color: '#92400E', fontSize: '1rem', marginBottom: '0.25rem' }}>
                    {lang === 'hi' ? 'संशोधन / दस्तावेज़ प्रतिस्थापन अपेक्षित' : 'Action Required: Document Correction'}
                  </h4>
                  <p style={{ color: '#B45309', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                    {searchResult.rejectionReason}
                  </p>
                  <button className="btn btn-secondary btn-sm" onClick={() => navigate('/documents')}>
                    <span>{lang === 'hi' ? 'दस्तावेज़ पेज पर जाकर ठीक करें' : 'Go to Documents to Fix'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Horizontal Timeline */}
            <div style={{ marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.5rem' }}>
                {t.trackTimelineTitle}
              </h3>

              <div className="timeline-stepper">
                
                <div className={`timeline-step ${getStageClass(1, searchResult.stage, searchResult.status)}`}>
                  <div className="timeline-circle">01</div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A', marginBottom: '0.2rem' }}>
                    {t.stageSubmitted}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {searchResult.submissionDate}
                  </div>
                </div>

                <div className={`timeline-step ${getStageClass(2, searchResult.stage, searchResult.status)}`}>
                  <div className="timeline-circle">02</div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A', marginBottom: '0.2rem' }}>
                    {t.stageDocVerification}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {searchResult.stage >= 2 ? 'In Review' : 'Pending'}
                  </div>
                </div>

                <div className={`timeline-step ${getStageClass(3, searchResult.stage, searchResult.status)}`}>
                  <div className="timeline-circle">03</div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A', marginBottom: '0.2rem' }}>
                    {t.stageFieldVerification}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {searchResult.stage >= 3 ? 'Completed' : 'Pending'}
                  </div>
                </div>

                <div className={`timeline-step ${getStageClass(4, searchResult.stage, searchResult.status)}`}>
                  <div className="timeline-circle">04</div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A', marginBottom: '0.2rem' }}>
                    {t.stageApproved}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {searchResult.approvalDate}
                  </div>
                </div>

                <div className={`timeline-step ${getStageClass(5, searchResult.stage, searchResult.status)}`}>
                  <div className="timeline-circle">05</div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A', marginBottom: '0.2rem' }}>
                    {t.stageDisbursed}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {searchResult.paymentDate}
                  </div>
                </div>

              </div>
            </div>

            {/* Payment & Banking Status if Released or Approved */}
            {(searchResult.status === 'Scholarship Released' || searchResult.rawStatus === 'SCHOLARSHIP_RELEASED' || searchResult.stage === 5 || searchResult.status === 'Approved' || searchResult.rawStatus === 'APPROVED') && (
              <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '16px', padding: '1.75rem', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <CreditCard size={22} color="#16A34A" />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#166534' }}>
                    {searchResult.status === 'Approved' || searchResult.rawStatus === 'APPROVED' ? 'Sanctioned Grant & Target Bank Account' : t.paymentDetailsTitle}
                  </h3>
                </div>

                <div className="grid-4" style={{ gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{t.disbursedAmountLabel}</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#166534' }}>{searchResult.disbursedAmount}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{t.disbursementDateLabel}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>
                      {searchResult.paymentDate && searchResult.paymentDate !== '-' ? searchResult.paymentDate : 'Pending Manual Transfer'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{t.utrNumberLabel}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1E40AF', fontFamily: 'monospace' }}>
                      {searchResult.utrNumber && searchResult.utrNumber !== '-' ? searchResult.utrNumber : 'In Payout Queue'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Target Bank</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>{searchResult.bankName}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions Bottom Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/student-dashboard')}
              >
                <UserCheck size={16} />
                <span>{lang === 'hi' ? 'विद्यार्थी डैशबोर्ड खोलें' : 'Open Student Dashboard'}</span>
              </button>

              <button 
                className="btn btn-outline"
                onClick={() => navigate('/documents')}
              >
                <FileText size={16} />
                <span>{lang === 'hi' ? 'दस्तावेज़ स्थिति जांचें' : 'Check Uploaded Documents'}</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
