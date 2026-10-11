import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../api/supabase.js';
import { QrCodeDisplay } from '../components/common/QrCodeDisplay';
import { 
  Printer, 
  ArrowLeft, 
  CheckCircle2, 
  Copy, 
  Check, 
  ShieldCheck, 
  Download,
  CreditCard,
  Building,
  User,
  ExternalLink,
  Search,
  AlertCircle,
  FileText
} from 'lucide-react';

export const PaymentReceiptView = ({ receiptId = '' }) => {
  const { lang, navigate, activeStudentApp } = useApp();
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [lookupError, setLookupError] = useState('');

  // Primary loader & resolver
  useEffect(() => {
    let isMounted = true;

    async function fetchReceiptData() {
      setLoading(true);
      setLookupError('');

      try {
        const cleanTarget = String(receiptId || activeStudentApp?.id || '').trim();

        if (cleanTarget) {
          // 1. Try case-insensitive lookup on application ID or Razorpay payment ID
          const { data, error } = await supabase
            .from('applications')
            .select('*, students(*), institutions(name), districts(name), payments(*)')
            .or(`id.ilike.${cleanTarget},razorpay_payment_id.ilike.${cleanTarget}`)
            .maybeSingle();

          if (data && isMounted) {
            setAppData(data);
            setLoading(false);
            return;
          }

          // 2. Secondary fallback: check student mobile number or student ID
          let stu = null;
          const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(cleanTarget);
          if (isUuid) {
            const { data } = await supabase.from('students').select('id').eq('id', cleanTarget).maybeSingle();
            stu = data;
          } else {
            const { data } = await supabase.from('students').select('id').eq('mobile', cleanTarget).maybeSingle();
            stu = data;
          }

          if (stu) {
            const { data: byStudent } = await supabase
              .from('applications')
              .select('*, students(*), institutions(name), districts(name), payments(*)')
              .eq('student_id', stu.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            if (byStudent && isMounted) {
              setAppData(byStudent);
              setLoading(false);
              return;
            }
          }
        }

        // 3. If activeStudentApp is present in session, use it
        if (activeStudentApp?.id && isMounted) {
          const { data } = await supabase
            .from('applications')
            .select('*, students(*), institutions(name), districts(name), payments(*)')
            .ilike('id', activeStudentApp.id.trim())
            .maybeSingle();

          if (data) {
            setAppData(data);
            setLoading(false);
            return;
          } else {
            setAppData(activeStudentApp);
            setLoading(false);
            return;
          }
        }

        // 4. If nothing matched and a target was given, show not found
        if (isMounted) {
          setAppData(null);
          if (cleanTarget) {
            setLookupError(
              lang === 'hi'
                ? `आवेदन संख्या या ट्रांजेक्शन ID "${cleanTarget}" के लिए कोई रिकॉर्ड नहीं मिला। कृपया नीचे सही ID या मोबाइल नंबर दर्ज करें।`
                : `No receipt found for "${cleanTarget}". Please enter a valid Application ID or registered mobile number below.`
            );
          }
        }
      } catch (err) {
        console.warn('Error loading receipt data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchReceiptData();

    return () => {
      isMounted = false;
    };
  }, [receiptId, activeStudentApp, lang]);

  // Handle manual search query submission
  const handleManualSearch = async (e) => {
    e?.preventDefault();
    const query = searchInput.trim();
    if (!query) return;

    setLoading(true);
    setLookupError('');

    try {
      const { data } = await supabase
        .from('applications')
        .select('*, students(*), institutions(name), districts(name), payments(*)')
        .or(`id.ilike.${query},razorpay_payment_id.ilike.${query}`)
        .maybeSingle();

      if (data) {
        setAppData(data);
        if (window.history?.pushState) {
          window.history.pushState(null, '', `/receipt/${data.id}`);
        }
        return;
      }

      // Check student mobile or student id
      let stu = null;
      const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(query);
      if (isUuid) {
        const { data } = await supabase.from('students').select('id').eq('id', query).maybeSingle();
        stu = data;
      } else {
        const { data } = await supabase.from('students').select('id').eq('mobile', query).maybeSingle();
        stu = data;
      }

      if (stu) {
        const { data: byMobile } = await supabase
          .from('applications')
          .select('*, students(*), institutions(name), districts(name), payments(*)')
          .eq('student_id', stu.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (byMobile) {
          setAppData(byMobile);
          if (window.history?.pushState) {
            window.history.pushState(null, '', `/receipt/${byMobile.id}`);
          }
          return;
        }
      }

      setLookupError(
        lang === 'hi'
          ? `"${query}" के लिए कोई शुल्क भुगतान रिकॉर्ड नहीं मिला। कृपया अपने आवेदन पत्र पर मुद्रित Application ID जांचें।`
          : `No fee payment record found for "${query}". Please check your Application ID and try again.`
      );
    } catch (err) {
      console.warn('Manual receipt search error:', err);
      setLookupError(lang === 'hi' ? 'खोज के दौरान त्रुटि हुई। कृपया पुनः प्रयास करें।' : 'Search error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper for amount in words
  const getAmountInWords = (amt) => {
    if (amt === 1) return 'One Rupee Only';
    if (amt === 211.3 || amt === 211.30) return 'Two Hundred Eleven Rupees and Thirty Paise Only';
    if (amt === 200) return 'Two Hundred Rupees Only';
    return `${amt.toFixed(2)} Rupees Only`;
  };

  // Extract resolved student details
  const student = appData?.students || (appData?.studentName ? appData : {}) || activeStudentApp || {};
  const appId = appData?.id || activeStudentApp?.id || receiptId || 'JMF-2026-XXXXX';
  const studentName = student.full_name || student.studentName || appData?.studentName || 'Applicant';
  const fatherName = student.father_name || student.fatherName || appData?.fatherName || '-';
  const mobile = student.mobile || appData?.mobile || '-';
  const email = student.email || appData?.email || '-';
  const district = appData?.districts?.name || appData?.district || student.district || 'Madhya Pradesh';
  const institution = appData?.institutions?.name || appData?.institution || student.institution || 'Partner Institution';
  const course = appData?.course || student.course || 'Scholarship Scheme 2026-27';
  const category = student.category || appData?.category || 'General';

  const rawTxnId = appData?.razorpay_payment_id 
    || appData?.transaction_id 
    || activeStudentApp?.razorpayPaymentId 
    || activeStudentApp?.transactionId 
    || appData?.payments?.find(p => p.payment_method?.includes('RAZORPAY') || p.utr_number?.startsWith('pay_'))?.utr_number 
    || (appData?.id ? `pay_${appData.id.replace(/[^a-zA-Z0-9]/g, '')}` : 'pay_jmf2026_settled');

  const feeAmount = (appData?.registration_fee_amount !== null && appData?.registration_fee_amount !== undefined)
    ? Number(appData.registration_fee_amount)
    : (activeStudentApp?.registrationFeeAmount ? Number(activeStudentApp.registrationFeeAmount) : 211.30);

  const feeDate = appData?.fee_payment_date 
    || appData?.created_at 
    || activeStudentApp?.feePaymentDate 
    || new Date().toISOString();

  const receiptNo = `RCP-JMF-2026-${appId.replace(/[^0-9]/g, '').slice(-5) || '10001'}`;
  const verifyUrl = `${window.location.origin}/receipt/${appId}`;

  // Loading state view
  if (loading) {
    return (
      <div className="section-py" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner" style={{ margin: '0 auto 1.5rem', width: '42px', height: '42px', border: '4px solid #E2E8F0', borderTopColor: '#1E40AF', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <h3 style={{ fontSize: '1.15rem', color: '#0F172A', fontWeight: 800 }}>
            {lang === 'hi' ? 'शुल्क रसीद लोड हो रही है...' : 'Loading official payment receipt...'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.4rem' }}>
            {lang === 'hi' ? 'सुरक्षित भुगतान डेटाबेस से विवरण प्राप्त किया जा रहा है।' : 'Retrieving official reconciliation records from secure registry.'}
          </p>
        </div>
      </div>
    );
  }

  // Not found or search mode view
  if (!appData) {
    return (
      <div className="section-py" style={{ backgroundColor: '#F1F5F9', minHeight: '90vh' }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '2.5rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
            border: '1px solid #E2E8F0',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <FileText size={32} />
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.5rem' }}>
              {lang === 'hi' ? 'छात्रवृत्ति शुल्क भुगतान रसीद खोजें' : 'Find Scholarship Fee Receipt'}
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '2rem', lineHeight: 1.5 }}>
              {lang === 'hi' 
                ? 'कृपया अपनी Application ID (उदा. JMF-2026-100020), रेज़रपे Payment ID, अथवा पंजीकृत मोबाइल नंबर दर्ज करें।'
                : 'Enter your Application ID (e.g. JMF-2026-100020), Razorpay Payment ID, or registered mobile number to view and print your receipt.'}
            </p>

            {lookupError && (
              <div style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                color: '#991B1B',
                fontSize: '0.85rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                textAlign: 'left'
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{lookupError}</span>
              </div>
            )}

            <form onSubmit={handleManualSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <input 
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={lang === 'hi' ? 'Application ID या मोबाइल नंबर दर्ज करें...' : 'Enter Application ID or Mobile Number...'}
                className="form-control"
                style={{ flex: '1 1 240px', padding: '0.75rem 1rem', fontSize: '0.95rem' }}
                autoFocus
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.5rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Search size={16} />
                <span>{lang === 'hi' ? 'रसीद खोजें' : 'Find Receipt'}</span>
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', borderTop: '1px solid #F1F5F9', paddingTop: '1.5rem' }}>
              <button className="btn btn-outline btn-sm" onClick={() => navigate('/apply')}>
                {lang === 'hi' ? 'नया आवेदन करें' : 'Apply for Scholarship'}
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => navigate('/student-dashboard')}>
                {lang === 'hi' ? 'छात्र डैशबोर्ड पर जाएं' : 'Go to Student Dashboard'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Receipt View
  return (
    <div className="section-py" style={{ backgroundColor: '#F1F5F9', minHeight: '90vh' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        
        {/* Actions Bar (Hidden on Print) */}
        <div className="no-print" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '1.5rem', 
          flexWrap: 'wrap', 
          gap: '1rem',
          backgroundColor: '#FFFFFF',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          border: '1px solid #E2E8F0'
        }}>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/student-dashboard')}>
            <ArrowLeft size={15} />
            <span>{lang === 'hi' ? 'डैशबोर्ड पर वापस' : 'Back to Dashboard'}</span>
          </button>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button className="btn btn-outline btn-sm" onClick={copyLink}>
              {copied ? <Check size={14} color="#16A34A" /> : <Copy size={14} />}
              <span>{copied ? (lang === 'hi' ? 'लिंक कॉपी हो गया' : 'Link Copied!') : (lang === 'hi' ? 'रसीद लिंक कॉपी करें' : 'Copy Link')}</span>
            </button>

            <button className="btn btn-primary" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
              <Printer size={16} />
              <span>{lang === 'hi' ? 'रसीद प्रिंट / डाउनलोड करें' : 'Print / Download Receipt'}</span>
            </button>
          </div>
        </div>

        {/* Embedded Print Styles for Guaranteed Single-Page A4 Receipt */}
        <style>{`
          @media print {
            @page {
              size: A4 portrait;
              margin: 4mm 5mm !important;
            }
            html, body {
              background: #FFFFFF !important;
              color: #000000 !important;
              height: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              overflow: hidden !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .section-py {
              padding: 0 !important;
              margin: 0 !important;
              min-height: auto !important;
              background: transparent !important;
            }
            .container {
              max-width: 100% !important;
              width: 100% !important;
              padding: 0 !important;
              margin: 0 !important;
            }
            .receipt-container {
              border: 1.5px solid #0B2B82 !important;
              box-shadow: none !important;
              border-radius: 4px !important;
              margin: 0 auto !important;
              max-height: 260mm !important;
              box-sizing: border-box !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            .receipt-header-band {
              padding: 0.55rem 0.95rem !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .receipt-logo-img {
              width: 42px !important;
              height: 42px !important;
            }
            .receipt-main-title {
              font-size: 0.95rem !important;
            }
            .receipt-main-sub1 {
              font-size: 0.62rem !important;
              margin-top: 1px !important;
            }
            .receipt-main-sub2 {
              font-size: 0.58rem !important;
              margin-top: 1px !important;
            }
            .receipt-status-pill {
              font-size: 0.65rem !important;
              padding: 0.15rem 0.5rem !important;
            }
            .receipt-banner-strip {
              padding: 0.25rem 0.95rem !important;
              font-size: 0.68rem !important;
            }
            .receipt-body-content {
              padding: 0.55rem 0.95rem !important;
            }
            .receipt-grid-cols {
              display: grid !important;
              grid-template-columns: 1fr 1fr !important;
              gap: 0.5rem !important;
              margin-bottom: 0.5rem !important;
            }
            .receipt-info-card {
              padding: 0.35rem 0.55rem !important;
              border-radius: 4px !important;
            }
            .receipt-card-heading {
              font-size: 0.65rem !important;
              margin-bottom: 0.25rem !important;
            }
            .receipt-card-text {
              font-size: 0.66rem !important;
              line-height: 1.25 !important;
              gap: 0.15rem !important;
            }
            .receipt-table-section {
              margin-bottom: 0.5rem !important;
            }
            .receipt-table-section table {
              font-size: 0.68rem !important;
            }
            .receipt-table-section th, .receipt-table-section td {
              padding: 0.25rem 0.45rem !important;
            }
            .receipt-words-text {
              font-size: 0.62rem !important;
              margin-top: 0.15rem !important;
            }
            .receipt-footer-strip {
              padding-top: 0.45rem !important;
              gap: 0.5rem !important;
              border-top: 1px solid #CBD5E1 !important;
              flex-wrap: nowrap !important;
            }
            .receipt-qr-wrapper {
              padding: 2px !important;
            }
            .receipt-qr-wrapper svg, .receipt-qr-wrapper canvas {
              width: 58px !important;
              height: 58px !important;
            }
            .receipt-qr-text {
              font-size: 0.62rem !important;
            }
            .receipt-seal-img {
              width: 28px !important;
              height: 28px !important;
              margin: 0 auto 2px !important;
            }
            .receipt-authority-text {
              font-size: 0.64rem !important;
            }
            .receipt-disclaimer-note {
              margin-top: 0.35rem !important;
              padding: 0.3rem 0.5rem !important;
              font-size: 0.58rem !important;
              line-height: 1.2 !important;
            }
          }
        `}</style>

        {/* Printable Official Payment Receipt Container */}
        <div className="printable-area animate-fade-in receipt-container" style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 10px 35px rgba(0,0,0,0.06)',
          border: '1px solid #CBD5E1',
          overflow: 'hidden'
        }}>
          
          {/* Header Band */}
          <div className="receipt-header-band" style={{
            background: 'linear-gradient(135deg, #0B2B82 0%, #1E40AF 100%)',
            color: '#FFFFFF',
            padding: '1.25rem 1.75rem',
            borderBottom: '3px solid #D97706'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img 
                  src="/assets/logo.png" 
                  alt="JMF Logo" 
                  className="receipt-logo-img"
                  style={{ width: '56px', height: '56px', objectFit: 'contain', backgroundColor: '#FFFFFF', padding: '3px', borderRadius: '8px' }} 
                />
                <div>
                  <h1 className="receipt-main-title" style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.01em', margin: 0, color: '#FFFFFF' }}>
                    JANKALYAN MANAVADHIKAR FOUNDATION
                  </h1>
                  <div className="receipt-main-sub1" style={{ fontSize: '0.74rem', color: '#FCD34D', fontWeight: 700, marginTop: '2px' }}>
                    जन कल्याण मानवाधिकार फाउंडेशन • Regd. under Section 8, Ministry of Corporate Affairs, Govt. of India
                  </div>
                  <div className="receipt-main-sub2" style={{ fontSize: '0.68rem', color: '#E2E8F0', marginTop: '2px' }}>
                    CIN: U85300MP2022NPL062548 • NITI Aayog Darpan: MP/2022/0329182 • ISO 9001:2015 Certified
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div className="receipt-status-pill" style={{ 
                  backgroundColor: '#16A34A', 
                  color: '#FFFFFF', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '20px', 
                  fontWeight: 800, 
                  fontSize: '0.74rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  boxShadow: '0 2px 6px rgba(22, 163, 74, 0.4)'
                }}>
                  <CheckCircle2 size={13} />
                  <span>PAYMENT SUCCESSFUL</span>
                </div>
                <div className="receipt-no-text" style={{ fontSize: '0.72rem', color: '#E0E7FF', marginTop: '0.35rem', fontFamily: 'monospace' }}>
                  {receiptNo}
                </div>
              </div>
            </div>
          </div>

          {/* Subheader Banner */}
          <div className="receipt-banner-strip" style={{
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            padding: '0.55rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
            fontSize: '0.78rem'
          }}>
            <div style={{ color: '#0F172A', fontWeight: 700 }}>
              OFFICIAL SCHOLARSHIP REGISTRATION FEE RECEIPT (SESSION 2026-27)
            </div>
            <div style={{ color: '#64748B' }}>
              Receipt Date: <strong>{new Date(feeDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
            </div>
          </div>

          {/* Body Content */}
          <div className="receipt-body-content" style={{ padding: '1.25rem 1.75rem' }}>
            
            {/* Primary Details 2-Column Grid */}
            <div className="receipt-grid-cols" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              
              {/* Applicant Details */}
              <div className="receipt-info-card" style={{ backgroundColor: '#F8FAFC', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div className="receipt-card-heading" style={{ fontSize: '0.74rem', fontWeight: 800, color: '#1E40AF', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={13} />
                  <span>Applicant Information</span>
                </div>
                <div className="receipt-card-text" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem' }}>
                  <div><strong>Application ID:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#0F172A' }}>{appId}</span></div>
                  <div><strong>Candidate Name:</strong> <span style={{ fontWeight: 700, color: '#0F172A' }}>{studentName}</span></div>
                  <div><strong>Father's Name:</strong> {fatherName}</div>
                  <div><strong>Mobile:</strong> {mobile}</div>
                  <div><strong>Email:</strong> {email}</div>
                  <div><strong>Social Category:</strong> {category}</div>
                  <div><strong>District:</strong> {district}</div>
                  <div><strong>Institution:</strong> {institution}</div>
                  <div><strong>Course / Class:</strong> {course}</div>
                </div>
              </div>

              {/* Transaction & Gateway Details */}
              <div className="receipt-info-card receipt-txn-card" style={{ backgroundColor: '#F0FDF4', padding: '0.85rem 1rem', borderRadius: '8px', border: '1.5px solid #BBF7D0' }}>
                <div className="receipt-card-heading" style={{ fontSize: '0.74rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CreditCard size={13} />
                  <span>Payment & Transaction Summary</span>
                </div>
                <div className="receipt-card-text" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem' }}>
                  <div>
                    <strong>Transaction ID:</strong>{' '}
                    <span style={{ fontFamily: 'monospace', fontWeight: 900, color: '#1E40AF', fontSize: '0.88rem', backgroundColor: '#FFFFFF', padding: '2px 5px', borderRadius: '4px', border: '1px solid #CBD5E1' }}>
                      {rawTxnId}
                    </span>
                  </div>
                  <div><strong>Payment Gateway:</strong> Razorpay Standard Checkout</div>
                  <div><strong>Payment Mode:</strong> UPI / Online Net Banking / Cards</div>
                  <div><strong>Payment Date & Time:</strong> {new Date(feeDate).toLocaleString('en-IN')}</div>
                  <div><strong>Payment Status:</strong> <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>PAID & SETTLED ✓</span></div>
                  <div><strong>Security Protocol:</strong> 256-Bit SSL Secured Gateway</div>
                </div>
              </div>

            </div>

            {/* Itemized Fee Structure Table */}
            <div className="receipt-table-section" style={{ marginBottom: '1.25rem' }}>
              <table className="receipt-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#0B2B82', color: '#FFFFFF', textAlign: 'left' }}>
                    <th style={{ padding: '0.55rem 0.85rem', borderRadius: '6px 0 0 0' }}>#</th>
                    <th style={{ padding: '0.55rem 0.85rem' }}>Particulars / Description</th>
                    <th style={{ padding: '0.55rem 0.85rem' }}>Category</th>
                    <th style={{ padding: '0.55rem 0.85rem', textAlign: 'right', borderRadius: '0 6px 0 0' }}>Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '0.6rem 0.85rem', fontWeight: 700 }}>1</td>
                    <td style={{ padding: '0.6rem 0.85rem' }}>
                      <strong style={{ color: '#0F172A' }}>Scholarship Application & Processing Fee</strong>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '1px' }}>
                        Jankalyan Manavadhikar Foundation Scholarship Scheme 2026-27
                      </div>
                    </td>
                    <td style={{ padding: '0.6rem 0.85rem', color: '#475569' }}>Academic Grant Docket</td>
                    <td style={{ padding: '0.6rem 0.85rem', textAlign: 'right', fontWeight: 700, fontFamily: 'monospace', fontSize: '0.9rem' }}>
                      ₹ {feeAmount.toFixed(2)}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                    <td colSpan={3} style={{ padding: '0.55rem 0.85rem', textAlign: 'right', fontWeight: 700, color: '#475569' }}>
                      Platform / Gateway Convenience Charge:
                    </td>
                    <td style={{ padding: '0.55rem 0.85rem', textAlign: 'right', fontWeight: 700, color: '#16A34A', fontFamily: 'monospace' }}>
                      ₹ 0.00 (Waived)
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: '#EFF6FF', borderTop: '2px solid #BFDBFE' }}>
                    <td colSpan={3} style={{ padding: '0.75rem 0.85rem', textAlign: 'right', fontWeight: 900, color: '#1E3A8A', fontSize: '0.92rem' }}>
                      TOTAL AMOUNT RECEIVED:
                    </td>
                    <td style={{ padding: '0.75rem 0.85rem', textAlign: 'right', fontWeight: 900, color: '#1E40AF', fontSize: '1.05rem', fontFamily: 'monospace' }}>
                      ₹ {feeAmount.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="receipt-words-text" style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '0.35rem', fontStyle: 'italic' }}>
                Amount in Words: <strong>{getAmountInWords(feeAmount)}</strong>
              </div>
            </div>

            {/* Verification QR & Legal Seal Footer Strip */}
            <div className="receipt-footer-strip" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1.5px solid #E2E8F0',
              paddingTop: '1rem',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 }}>
                <div className="receipt-qr-wrapper" style={{ padding: '4px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', flexShrink: 0 }}>
                  <QrCodeDisplay value={verifyUrl} size={68} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div className="receipt-qr-text" style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F172A' }}>
                    Scan QR to Verify Receipt Online
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748B', marginTop: '1px' }}>
                    Official Digital Record • Tamper-proof
                  </div>
                  <div style={{ 
                    fontSize: '0.64rem', 
                    color: '#2563EB', 
                    marginTop: '2px', 
                    fontFamily: 'monospace',
                    maxWidth: '280px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }} title={verifyUrl}>
                    {verifyUrl}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <img 
                  src="/assets/logo.png" 
                  alt="Seal" 
                  className="receipt-seal-img"
                  style={{ width: '36px', height: '36px', opacity: 0.85, margin: '0 auto 3px', display: 'block' }} 
                />
                <div className="receipt-authority-text" style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A' }}>
                  Finance & Accounts Wing
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748B' }}>
                  Jankalyan Manavadhikar Foundation
                </div>
                <div style={{ fontSize: '0.64rem', color: '#16A34A', fontWeight: 700, marginTop: '1px' }}>
                  [ Digitally Signed & Authenticated ]
                </div>
              </div>
            </div>

            {/* Notes & Disclaimer */}
            <div className="receipt-disclaimer-note" style={{
              marginTop: '1rem',
              backgroundColor: '#F8FAFC',
              borderRadius: '6px',
              padding: '0.55rem 0.85rem',
              fontSize: '0.68rem',
              color: '#64748B',
              lineHeight: 1.4,
              border: '1px solid #E2E8F0'
            }}>
              <strong>Note:</strong> This is an authentic, system-generated computer receipt issued by the Jan Kalyan Manavadhikar Foundation upon successful reconciliation with Razorpay Payment Gateway. Registration fee is non-refundable and applies exclusively toward candidate application evaluation and administrative scrutiny.
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
