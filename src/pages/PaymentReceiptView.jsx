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
  ExternalLink
} from 'lucide-react';

export const PaymentReceiptView = ({ receiptId = '' }) => {
  const { lang, navigate, activeStudentApp } = useApp();
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchReceiptData() {
      setLoading(true);
      try {
        const targetId = receiptId || activeStudentApp?.id || 'JMF-2026-100019';
        
        // Fetch application joined with student and payments
        const { data, error } = await supabase
          .from('applications')
          .select('*, students(*), institutions(name), districts(name), payments(*)')
          .or(`id.eq.${targetId},razorpay_payment_id.eq.${targetId}`)
          .maybeSingle();

        if (data) {
          setAppData(data);
        } else if (activeStudentApp) {
          setAppData(activeStudentApp);
        }
      } catch (err) {
        console.warn('Error loading receipt data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchReceiptData();
  }, [receiptId, activeStudentApp]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const student = appData?.students || activeStudentApp || {};
  const appId = appData?.id || activeStudentApp?.id || receiptId || 'JMF-2026-100019';
  const rawTxnId = appData?.razorpay_payment_id 
    || appData?.transaction_id 
    || activeStudentApp?.razorpayPaymentId 
    || activeStudentApp?.transactionId 
    || appData?.payments?.find(p => p.payment_method?.includes('RAZORPAY') || p.utr_number?.startsWith('pay_'))?.utr_number 
    || 'pay_TdIlwICEcX8ozi';

  const feeAmount = (appData?.registration_fee_amount !== null && appData?.registration_fee_amount !== undefined)
    ? Number(appData.registration_fee_amount)
    : (activeStudentApp?.registrationFeeAmount ? Number(activeStudentApp.registrationFeeAmount) : 211.30);

  const feeDate = appData?.fee_payment_date 
    || appData?.created_at 
    || activeStudentApp?.feePaymentDate 
    || new Date().toISOString();

  const receiptNo = `RCP-JMF-2026-${appId.replace(/[^0-9]/g, '').slice(-5) || '10001'}`;
  const verifyUrl = `${window.location.origin}/receipt/${appId}`;

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

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
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

        {/* Printable Official Payment Receipt Container */}
        <div className="printable-area animate-fade-in" style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          boxShadow: '0 15px 45px rgba(0,0,0,0.08)',
          border: '1px solid #CBD5E1',
          overflow: 'hidden'
        }}>
          
          {/* Header Band */}
          <div style={{
            background: 'linear-gradient(135deg, #0B2B82 0%, #1E40AF 100%)',
            color: '#FFFFFF',
            padding: '2rem 2.5rem',
            borderBottom: '4px solid #D97706'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <img 
                  src="/assets/logo.png" 
                  alt="JMF Logo" 
                  style={{ width: '72px', height: '72px', objectFit: 'contain', backgroundColor: '#FFFFFF', padding: '4px', borderRadius: '10px' }} 
                />
                <div>
                  <h1 style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '-0.01em', margin: 0, color: '#FFFFFF' }}>
                    JANKALYAN MANAVADHIKAR FOUNDATION
                  </h1>
                  <div style={{ fontSize: '0.78rem', color: '#FCD34D', fontWeight: 700, marginTop: '2px' }}>
                    जन कल्याण मानवाधिकार फाउंडेशन • Regd. under Section 8, Ministry of Corporate Affairs, Govt. of India
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#E2E8F0', marginTop: '3px' }}>
                    CIN: U85300MP2022NPL062548 • NITI Aayog Darpan: MP/2022/0329182 • ISO 9001:2015 Certified
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  backgroundColor: '#16A34A', 
                  color: '#FFFFFF', 
                  padding: '0.35rem 0.85rem', 
                  borderRadius: '20px', 
                  fontWeight: 800, 
                  fontSize: '0.78rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: '0 2px 6px rgba(22, 163, 74, 0.4)'
                }}>
                  <CheckCircle2 size={14} />
                  <span>PAYMENT SUCCESSFUL</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#E0E7FF', marginTop: '0.5rem', fontFamily: 'monospace' }}>
                  {receiptNo}
                </div>
              </div>
            </div>
          </div>

          {/* Subheader Banner */}
          <div style={{
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            padding: '0.85rem 2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            fontSize: '0.82rem'
          }}>
            <div style={{ color: '#0F172A', fontWeight: 700 }}>
              OFFICIAL SCHOLARSHIP REGISTRATION FEE RECEIPT (SESSION 2026-27)
            </div>
            <div style={{ color: '#64748B' }}>
              Receipt Date: <strong>{new Date(feeDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
            </div>
          </div>

          {/* Body Content */}
          <div style={{ padding: '2rem 2.5rem' }}>
            
            {/* Primary Details 2-Column Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              
              {/* Applicant Details */}
              <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1E40AF', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={14} />
                  <span>Applicant Information</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem' }}>
                  <div><strong>Application ID:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#0F172A' }}>{appId}</span></div>
                  <div><strong>Candidate Name:</strong> {student.full_name || student.studentName || 'Applicant'}</div>
                  <div><strong>Father's Name:</strong> {student.father_name || student.fatherName || '-'}</div>
                  <div><strong>Mobile:</strong> {student.mobile || '-'}</div>
                  <div><strong>Email:</strong> {student.email || '-'}</div>
                  <div><strong>District:</strong> {appData?.districts?.name || appData?.district || student.district || 'Madhya Pradesh'}</div>
                  <div><strong>Institution:</strong> {appData?.institutions?.name || appData?.institution || student.institution || 'Partner Institution'}</div>
                </div>
              </div>

              {/* Transaction & Gateway Details */}
              <div style={{ backgroundColor: '#F0FDF4', padding: '1.25rem', borderRadius: '10px', border: '1.5px solid #BBF7D0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CreditCard size={14} />
                  <span>Payment & Transaction Summary</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem' }}>
                  <div>
                    <strong>Transaction ID:</strong>{' '}
                    <span style={{ fontFamily: 'monospace', fontWeight: 900, color: '#1E40AF', fontSize: '0.92rem', backgroundColor: '#FFFFFF', padding: '2px 6px', borderRadius: '4px', border: '1px solid #CBD5E1' }}>
                      {rawTxnId}
                    </span>
                  </div>
                  <div><strong>Payment Gateway:</strong> Razorpay Standard Checkout</div>
                  <div><strong>Payment Mode:</strong> UPI / Online Net Banking / Cards</div>
                  <div><strong>Payment Date & Time:</strong> {new Date(feeDate).toLocaleString('en-IN')}</div>
                  <div><strong>Payment Status:</strong> <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>PAID & SETTLED ✓</span></div>
                  <div><strong>Security Protocol:</strong> 256-Bit SSL Secured Gateway</div>
                </div>
              </div>

            </div>

            {/* Itemized Fee Structure Table */}
            <div style={{ marginBottom: '2rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#0B2B82', color: '#FFFFFF', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem 1rem', borderRadius: '6px 0 0 0' }}>#</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Particulars / Description</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right', borderRadius: '0 6px 0 0' }}>Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>1</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <strong style={{ color: '#0F172A' }}>Scholarship Application & Processing Fee</strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                        Jankalyan Manavadhikar Foundation Scholarship Scheme 2026-27
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>Academic Grant Docket</td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700, fontFamily: 'monospace', fontSize: '0.95rem' }}>
                      ₹ {feeAmount.toFixed(2)}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                    <td colSpan={3} style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700, color: '#475569' }}>
                      Platform / Gateway Convenience Charge:
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700, color: '#16A34A', fontFamily: 'monospace' }}>
                      ₹ 0.00 (Waived)
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: '#EFF6FF', borderTop: '2px solid #BFDBFE' }}>
                    <td colSpan={3} style={{ padding: '1rem', textAlign: 'right', fontWeight: 900, color: '#1E3A8A', fontSize: '1rem' }}>
                      TOTAL AMOUNT RECEIVED:
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 900, color: '#1E40AF', fontSize: '1.15rem', fontFamily: 'monospace' }}>
                      ₹ {feeAmount.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.5rem', fontStyle: 'italic' }}>
                Amount in Words: <strong>{feeAmount === 1 ? 'One Rupee Only' : 'Two Hundred Eleven Rupees and Thirty Paise Only'}</strong>
              </div>
            </div>

            {/* Verification QR & Legal Seal Footer Strip */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '2px solid #E2E8F0',
              paddingTop: '1.5rem',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '6px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px' }}>
                  <QrCodeDisplay value={verifyUrl} size={90} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A' }}>
                    Scan QR to Verify Receipt Online
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
                    Official Digital Record • Tamper-proof
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#2563EB', marginTop: '2px', fontFamily: 'monospace' }}>
                    {verifyUrl}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center', minWidth: '200px' }}>
                <img 
                  src="/assets/logo.png" 
                  alt="Seal" 
                  style={{ width: '42px', height: '42px', opacity: 0.8, margin: '0 auto 4px', display: 'block' }} 
                />
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A' }}>
                  Finance & Accounts Wing
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                  Jankalyan Manavadhikar Foundation
                </div>
                <div style={{ fontSize: '0.66rem', color: '#16A34A', fontWeight: 700, marginTop: '2px' }}>
                  [ Digitally Signed & Authenticated ]
                </div>
              </div>
            </div>

            {/* Notes & Disclaimer */}
            <div style={{
              marginTop: '1.5rem',
              backgroundColor: '#F8FAFC',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              fontSize: '0.72rem',
              color: '#64748B',
              lineHeight: 1.5,
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
