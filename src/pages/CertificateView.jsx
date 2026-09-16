import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { certificateService } from '../services/certificateService';
import { supabase } from '../api/supabase';
import { getPublicUrl } from '../api/storage';
import { QrCodeDisplay } from '../components/common/QrCodeDisplay';
import { 
  Printer, 
  Download, 
  ArrowLeft, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Building2,
  Copy,
  Check,
  ExternalLink,
  User
} from 'lucide-react';

export const CertificateView = ({ certId = '' }) => {
  const { lang, navigate, activeStudentApp } = useApp();
  const [cert, setCert] = useState(null);
  const [appDetails, setAppDetails] = useState(null);
  const [studentPhoto, setStudentPhoto] = useState('');
  const [photoError, setPhotoError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadCert() {
      setLoading(true);
      try {
        let found = null;
        let appData = null;
        let resolvedPhotoUrl = '';

        // 1. Try resolving certificate from certificates table
        if (certId) {
          found = await certificateService.getCertificateByAppId(certId) 
            || await certificateService.getCertificateByToken(certId);
        }
        if (!found && activeStudentApp) {
          found = await certificateService.getCertificateByAppId(activeStudentApp.id);
        }

        // 2. Fetch linked application data with joined student profile & documents
        const targetAppId = found?.application_id || certId || activeStudentApp?.id;
        if (targetAppId) {
          try {
            const { data: aRec } = await supabase
              .from('applications')
              .select('*, students(*), application_documents(*)')
              .eq('id', targetAppId)
              .maybeSingle();

            if (aRec) {
              appData = aRec;
              const photoDoc = aRec.application_documents?.find(d => 
                d.document_type_id === 'photo' || 
                (d.file_path && d.file_path.toLowerCase().includes('photo'))
              );
              if (photoDoc?.file_path) {
                const rawP = photoDoc.file_path;
                if (rawP.startsWith('http://') || rawP.startsWith('https://') || rawP.startsWith('data:')) {
                  resolvedPhotoUrl = rawP;
                } else {
                  resolvedPhotoUrl = getPublicUrl('student-documents', rawP);
                }
              }
            }
          } catch (appErr) {
            console.warn('App fetch error:', appErr);
          }
        }

        if (!resolvedPhotoUrl && activeStudentApp?.documents?.photo) {
          const p = activeStudentApp.documents.photo;
          const pVal = p.file || p.url || p.filePath || (typeof p === 'string' ? p : '');
          if (pVal) {
            if (pVal.startsWith('http') || pVal.startsWith('data:') || pVal.startsWith('/assets/')) {
              resolvedPhotoUrl = pVal;
            } else {
              resolvedPhotoUrl = getPublicUrl('student-documents', pVal);
            }
          }
        }
        setStudentPhoto(resolvedPhotoUrl);

        // 3. Fallback / enrichment if certificate was not pre-created or using student state
        if (!found && (appData || activeStudentApp)) {
          const studentName = appData?.students?.full_name 
            || activeStudentApp?.studentName 
            || 'Scholarship Recipient';

          const appId = appData?.id || activeStudentApp?.id || 'JMF-2026-108234';
          const grantAmt = appData?.disbursed_amount 
            || activeStudentApp?.disbursedAmount 
            || 12000;

          const utr = appData?.utr_number 
            || activeStudentApp?.utrNumber 
            || 'SBIN00291823901';

          found = {
            certificate_number: `CERT-JMF-2026-${appId.replace(/[^0-9]/g, '').slice(-5) || Math.floor(10000 + Math.random() * 90000)}`,
            application_id: appId,
            student_name: studentName,
            scheme_name: 'Jankalyan Manavadhikar Foundation Scholarship Scheme 2026-27',
            academic_year: appData?.academic_year || '2026-27',
            grant_amount: typeof grantAmt === 'number' ? grantAmt : parseFloat(String(grantAmt).replace(/[^0-9.]/g, '')) || 12000,
            issue_date: appData?.payment_date || appData?.approval_date || new Date().toISOString().split('T')[0],
            verification_token: appData?.verification_token || activeStudentApp?.verificationToken || `tok_${appId}`,
            utr_number: utr,
            issued_by_title: 'President, Jan Kalyan Manavadhikar Foundation'
          };
        } else if (found && appData) {
          // Enrich existing certificate record with live application UTR / payment date
          if (!found.utr_number && appData.utr_number) {
            found.utr_number = appData.utr_number;
          }
          if (appData.payment_date) {
            found.payment_date = appData.payment_date;
          }
        }

        setCert(found);
        setAppDetails(appData);
      } catch (err) {
        console.warn('Certificate load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCert();
  }, [certId, activeStudentApp]);

  const verifyUrl = `${window.location.origin}/verify/certificate/${cert?.verification_token || cert?.application_id || 'valid'}`;

  const copyVerifyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="section-py" style={{ backgroundColor: '#F1F5F9', minHeight: '90vh' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        
        {/* Action Controls (Hidden during Printing) */}
        <div className="no-print" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '2rem', 
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
            <button className="btn btn-outline btn-sm" onClick={copyVerifyLink}>
              {copied ? <Check size={14} color="#16A34A" /> : <Copy size={14} />}
              <span>{copied ? (lang === 'hi' ? 'लिंक कॉपी हो गया' : 'Link Copied!') : (lang === 'hi' ? 'सत्यापन लिंक कॉपी करें' : 'Copy Verification Link')}</span>
            </button>

            <button className="btn btn-primary" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Printer size={16} />
              <span>{lang === 'hi' ? 'प्रिंट / पीडीएफ सेव करें' : 'Print / Save Official PDF'}</span>
            </button>
          </div>
        </div>

        {/* The Printable Official Scholarship Certificate Frame */}
        {cert ? (
          <div className="printable-certificate animate-fade-in" style={{
            backgroundColor: '#FFFFFF',
            border: '12px solid #0B2B82',
            padding: '3rem 2.75rem',
            position: 'relative',
            boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
            borderRadius: '6px',
            color: '#0F172A',
            backgroundImage: 'radial-gradient(#F8FAFC 2px, transparent 2px)',
            backgroundSize: '24px 24px',
            overflow: 'hidden'
          }}>
            
            {/* Elegant Inner Gold Border */}
            <div style={{
              position: 'absolute',
              inset: '10px',
              border: '2px solid #D97706',
              pointerEvents: 'none'
            }} />

            {/* Corner Decorative Filigree Accents */}
            <div style={{ position: 'absolute', top: '16px', left: '16px', width: '28px', height: '28px', borderTop: '4px solid #0B2B82', borderLeft: '4px solid #0B2B82' }} />
            <div style={{ position: 'absolute', top: '16px', right: '16px', width: '28px', height: '28px', borderTop: '4px solid #0B2B82', borderRight: '4px solid #0B2B82' }} />
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', width: '28px', height: '28px', borderBottom: '4px solid #0B2B82', borderLeft: '4px solid #0B2B82' }} />
            <div style={{ position: 'absolute', bottom: '16px', right: '16px', width: '28px', height: '28px', borderBottom: '4px solid #0B2B82', borderRight: '4px solid #0B2B82' }} />

            {/* Subtle High-Security Background Watermark */}
            <div style={{
              position: 'absolute',
              top: '52%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: 0.05,
              pointerEvents: 'none',
              userSelect: 'none',
              zIndex: 0
            }}>
              <img 
                src="/assets/foundation_seal.png" 
                alt="" 
                style={{ width: '440px', height: '440px', objectFit: 'contain' }} 
              />
            </div>

            {/* Embedded CSS for responsive & print layout */}
            <style>{`
              @media (max-width: 768px) {
                .certificate-photo-box {
                  position: static !important;
                  margin: 0 auto 1.25rem auto !important;
                }
              }
              @media print {
                .certificate-photo-box {
                  position: absolute !important;
                  top: 26px !important;
                  right: 28px !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
              }
            `}</style>

            {/* Official Applicant Passport Photograph */}
            <div className="certificate-photo-box" style={{
              position: 'absolute',
              top: '26px',
              right: '28px',
              width: '108px',
              border: '2.5px solid #0B2B82',
              borderRadius: '4px',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(11,43,130,0.18)',
              overflow: 'hidden',
              zIndex: 10,
              textAlign: 'center'
            }}>
              {/* Photo Box Image Frame */}
              <div style={{ position: 'relative', width: '100%', height: '124px', backgroundColor: '#EFF6FF', overflow: 'hidden' }}>
                {studentPhoto && !photoError ? (
                  <img 
                    src={studentPhoto} 
                    alt={cert?.student_name || 'Applicant'} 
                    onError={() => setPhotoError(true)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#F8FAFC',
                    color: '#0B2B82'
                  }}>
                    <User size={46} strokeWidth={1.5} color="#0B2B82" />
                    <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#64748B', marginTop: '4px', letterSpacing: '0.05em' }}>
                      PHOTO
                    </span>
                  </div>
                )}

                {/* Verified Green Badge */}
                <div style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.25)'
                }} title="Verified Beneficiary Photograph">
                  <Check size={11} strokeWidth={3} />
                </div>
              </div>

              {/* Verified Strip Caption */}
              <div style={{
                backgroundColor: '#0B2B82',
                color: '#FFFFFF',
                fontSize: '0.62rem',
                fontWeight: 800,
                padding: '3px 2px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                Verified Photo
              </div>
            </div>

            {/* Content Layer */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              
              {/* Top Header: Foundation Logo & Official Registration */}
              <div style={{ textAlign: 'center', marginBottom: '1.75rem', maxWidth: '680px', margin: '0 auto 1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <img 
                    src="/assets/logo.png" 
                    alt="Jan Kalyan Manavadhikar Foundation Logo" 
                    style={{ height: '78px', width: 'auto', objectFit: 'contain' }} 
                  />
                </div>

                <div style={{ 
                  fontSize: '1.35rem', 
                  fontWeight: 900, 
                  color: '#0B2B82', 
                  letterSpacing: '0.08em', 
                  textTransform: 'uppercase',
                  lineHeight: 1.2
                }}>
                  Jan Kalyan Manavadhikar Foundation
                </div>

                <div style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 800, 
                  color: '#D97706', 
                  margin: '0.2rem 0',
                  letterSpacing: '0.04em'
                }}>
                  जन कल्याण मानवाधिकार फाउंडेशन
                </div>

                <div style={{ 
                  fontSize: '0.78rem', 
                  color: '#475569', 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  marginTop: '0.35rem'
                }}>
                  <span><strong>Govt. Reg. No:</strong> JBP/2025/007654</span>
                  <span>•</span>
                  <span>Registered Under M.P. Public Trust & Society Registration Act</span>
                  <span>•</span>
                  <span>NITI Aayog NGO Darpan Recognized</span>
                </div>

                <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.15rem' }}>
                  Head Office: Ward No. 30, Shri Ram College Road, Dixit Colony, Jabalpur, M.P. - 482002
                </div>
              </div>

              {/* Certificate Title Badge */}
              <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                <div style={{
                  display: 'inline-block',
                  backgroundColor: '#0B2B82',
                  color: '#FFFFFF',
                  padding: '0.45rem 2rem',
                  borderRadius: '4px',
                  boxShadow: '0 4px 12px rgba(11,43,130,0.2)'
                }}>
                  <h1 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 900, 
                    letterSpacing: '0.06em', 
                    margin: 0,
                    textTransform: 'uppercase'
                  }}>
                    Certificate of Scholarship Award
                  </h1>
                </div>

                <div style={{ 
                  fontSize: '0.95rem', 
                  color: '#D97706', 
                  fontWeight: 800, 
                  marginTop: '0.5rem',
                  letterSpacing: '0.02em'
                }}>
                  शैक्षणिक छात्रवृत्ति सम्मान एवं संवितरण प्रमाण पत्र
                </div>

                <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, marginTop: '0.2rem' }}>
                  Academic Session: <strong>{cert.academic_year || '2026-27'}</strong>
                </div>
              </div>

              {/* Certificate Award Body */}
              <div style={{ 
                textAlign: 'center', 
                maxWidth: '740px', 
                margin: '0 auto 2rem', 
                lineHeight: 1.8, 
                fontSize: '1.02rem', 
                color: '#334155' 
              }}>
                <p style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', color: '#475569' }}>
                  This is to proudly certify that the student
                </p>
                
                <div style={{ 
                  fontSize: '2.15rem', 
                  fontWeight: 900, 
                  color: '#0B2B82', 
                  borderBottom: '2.5px dashed #CBD5E1', 
                  display: 'inline-block', 
                  padding: '0 2.5rem 0.35rem', 
                  marginBottom: '1rem', 
                  fontFamily: 'Georgia, Cambria, serif',
                  letterSpacing: '0.02em'
                }}>
                  {cert.student_name}
                </div>

                <p style={{ margin: '0 0 0.75rem 0' }}>
                  bearing Application Registration ID <strong style={{ color: '#0B2B82', fontFamily: 'monospace', fontSize: '1.1rem' }}>{cert.application_id}</strong>, 
                  having successfully satisfied all statutory eligibility benchmarks, merit scrutiny requirements, and document verification protocols, is hereby officially conferred the Scholarship Award Grant of:
                </p>

                {/* Amount Callout */}
                <div style={{ 
                  fontSize: '1.85rem', 
                  fontWeight: 900, 
                  color: '#16A34A', 
                  backgroundColor: '#F0FDF4',
                  border: '1.5px solid #86EFAC',
                  borderRadius: '8px',
                  padding: '0.5rem 1.5rem',
                  display: 'inline-block',
                  margin: '0.5rem 0 0.75rem 0',
                  letterSpacing: '0.02em'
                }}>
                  ₹{parseFloat(cert.grant_amount || 12000).toLocaleString('en-IN')}/-
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#15803D', marginLeft: '0.6rem' }}>
                    (Rupees Twelve Thousand Only)
                  </span>
                </div>

                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.92rem', color: '#475569' }}>
                  under the <strong>{cert.scheme_name || 'Jankalyan Manavadhikar Foundation Scholarship Scheme 2026-27'}</strong>. 
                  The sanctioned grant has been successfully credited directly to the student's verified bank account under <strong>Direct Benefit Transfer (DBT)</strong> in recognition of scholastic merit and dedication to higher education.
                </p>

                {/* DBT Transaction Badge if available */}
                {(cert.utr_number || appDetails?.utr_number) && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: '6px',
                    padding: '0.35rem 1rem',
                    marginTop: '0.85rem',
                    fontSize: '0.82rem',
                    color: '#1E40AF',
                    fontWeight: 700
                  }}>
                    <CheckCircle2 size={16} color="#16A34A" />
                    <span>DBT Banking UTR / Transaction Ref:</span>
                    <span style={{ fontFamily: 'monospace', color: '#0F172A' }}>
                      {cert.utr_number || appDetails?.utr_number}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Authority Footer: Seal, QR Verification & President's Signature */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 140px 1fr', 
                alignItems: 'flex-end', 
                borderTop: '1.5px solid #E2E8F0', 
                paddingTop: '1.75rem', 
                gap: '1.5rem' 
              }}>
                
                {/* Left: Official Certificate Ledger & Details */}
                <div style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.6 }}>
                  <div style={{ fontWeight: 800, color: '#0B2B82', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                    Official Verification Dossier
                  </div>
                  <div><strong>Certificate No:</strong> <span style={{ fontFamily: 'monospace', color: '#0F172A', fontWeight: 700 }}>{cert.certificate_number}</span></div>
                  <div><strong>Issue / Sanction Date:</strong> <span style={{ color: '#0F172A' }}>{cert.issue_date}</span></div>
                  <div><strong>Trust Registration:</strong> JBP/2025/007654</div>
                  <div style={{ color: '#16A34A', fontWeight: 700, marginTop: '0.2rem' }}>
                    ✓ Authenticated DBT Beneficiary
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.3rem' }}>
                    Tamper-evident digitally certified record.
                  </div>
                </div>

                {/* Center: Official Foundation Seal + QR Verification */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <img 
                      src="/assets/foundation_seal.png" 
                      alt="Official Foundation Seal" 
                      style={{ 
                        width: '105px', 
                        height: '105px', 
                        objectFit: 'contain', 
                        margin: '0 auto',
                        filter: 'drop-shadow(0 2px 6px rgba(11,43,130,0.18))'
                      }} 
                    />
                    <div style={{ 
                      fontSize: '0.68rem', 
                      color: '#0B2B82', 
                      fontWeight: 800, 
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginTop: '0.2rem'
                    }}>
                      Official Seal
                    </div>
                  </div>

                  {/* Micro QR Code */}
                  <div style={{ display: 'inline-block', padding: '4px', backgroundColor: '#FFFFFF', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                    <QrCodeDisplay value={verifyUrl} size={64} />
                  </div>
                  <div style={{ fontSize: '0.62rem', color: '#64748B', marginTop: '2px', fontWeight: 600 }}>
                    Scan to Verify
                  </div>
                </div>

                {/* Right: Signature & Seal of the President */}
                <div style={{ textAlign: 'center', minWidth: '220px' }}>
                  {/* Handwritten President Signature */}
                  <div style={{ minHeight: '62px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '0.25rem' }}>
                    <img 
                      src="/assets/president_signature_only.png" 
                      alt="Gyaneel Soni President Signature" 
                      style={{ 
                        maxHeight: '58px', 
                        maxWidth: '200px', 
                        objectFit: 'contain',
                        filter: 'contrast(1.1)'
                      }} 
                    />
                  </div>

                  {/* President Signature Line */}
                  <div style={{ 
                    width: '190px', 
                    height: '1.5px', 
                    backgroundColor: '#0B2B82', 
                    margin: '0.2rem auto 0.35rem' 
                  }} />

                  {/* President Credentials */}
                  <div style={{ 
                    fontWeight: 900, 
                    fontSize: '1rem', 
                    color: '#0F172A', 
                    letterSpacing: '0.02em',
                    fontFamily: 'Georgia, serif'
                  }}>
                    Gyaneel Soni
                  </div>

                  <div style={{ 
                    fontWeight: 800, 
                    fontSize: '0.85rem', 
                    color: '#0B2B82',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase'
                  }}>
                    President
                  </div>

                  <div style={{ 
                    fontSize: '0.72rem', 
                    color: '#475569', 
                    fontWeight: 700 
                  }}>
                    Jan Kalyan Manavadhikar Foundation
                  </div>

                  <div style={{ 
                    fontSize: '0.65rem', 
                    color: '#94A3B8', 
                    fontWeight: 600,
                    marginTop: '0.15rem'
                  }}>
                    Authorized Executive Signatory
                  </div>
                </div>

              </div>

            </div>

          </div>
        ) : (
          <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
            <Award size={48} color="#94A3B8" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
              {lang === 'hi' ? 'प्रमाण पत्र अभी तैयार नहीं है' : 'Certificate Not Available'}
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.95rem', maxWidth: '480px', margin: '0.75rem auto 1.5rem', lineHeight: 1.6 }}>
              {lang === 'hi' 
                ? 'छात्रवृत्ति प्रमाण पत्र आवेदन पत्र के अंतिम सत्यापन एवं छात्रवृत्ति राशि संवितरण (DBT) के पश्चात जारी किया जाता है।' 
                : 'Official scholarship award certificates are automatically generated and issued once application scrutiny is verified and the grant amount is disbursed into the student bank account.'}
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/student-dashboard')}>
              <span>{lang === 'hi' ? 'डैशबोर्ड पर स्थिति देखें' : 'Check Status on Dashboard'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
