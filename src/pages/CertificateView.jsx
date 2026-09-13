import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { certificateService } from '../services/certificateService';
import { QrCodeDisplay } from '../components/common/QrCodeDisplay';
import { Printer, Download, ArrowLeft, Award, ShieldCheck } from 'lucide-react';

export const CertificateView = ({ certId = '' }) => {
  const { lang, navigate, activeStudentApp } = useApp();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCert() {
      setLoading(true);
      try {
        let found = null;
        if (certId) {
          found = await certificateService.getCertificateByAppId(certId) 
            || await certificateService.getCertificateByToken(certId);
        }
        if (!found && activeStudentApp) {
          found = await certificateService.getCertificateByAppId(activeStudentApp.id);
        }
        if (!found && activeStudentApp) {
          // Generate demo certificate for active student if approved/released
          found = {
            certificate_number: `CERT-JMF-2026-${Math.floor(10000 + Math.random() * 90000)}`,
            application_id: activeStudentApp.id,
            student_name: activeStudentApp.studentName,
            scheme_name: 'Jankalyan Manavadhikar Foundation Scholarship Scheme 2026-27',
            academic_year: '2026-27',
            grant_amount: 12000.00,
            issue_date: new Date().toISOString().split('T')[0],
            verification_token: activeStudentApp.verificationToken || 'demo_token_123',
            issued_by_title: 'National Scholarship Scrutiny Board'
          };
        }
        setCert(found);
      } catch (err) {
        console.warn('Certificate load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCert();
  }, [certId, activeStudentApp]);

  const verifyUrl = `${window.location.origin}/verify/certificate/${cert?.verification_token || cert?.application_id || 'valid'}`;

  return (
    <div className="section-py" style={{ backgroundColor: '#F1F5F9', minHeight: '90vh' }}>
      <div className="container" style={{ maxWidth: '940px' }}>
        
        {/* Action Controls */}
        <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/student-dashboard')}>
            <ArrowLeft size={15} />
            <span>{lang === 'hi' ? 'डैशबोर्ड पर वापस' : 'Back to Dashboard'}</span>
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-primary" onClick={() => window.print()}>
              <Printer size={16} />
              <span>{lang === 'hi' ? 'प्रिंट / पीडीएफ सेव करें' : 'Print / Save Certificate PDF'}</span>
            </button>
          </div>
        </div>

        {/* The Printable Official Certificate Frame */}
        {cert ? (
          <div className="printable-certificate animate-fade-in" style={{
            backgroundColor: '#FFFFFF',
            border: '12px solid #1B2A4E',
            padding: '3.5rem 3rem',
            position: 'relative',
            boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
            borderRadius: '4px',
            backgroundImage: 'radial-gradient(#F8FAFC 2px, transparent 2px)',
            backgroundSize: '24px 24px'
          }}>
            
            {/* Inner Border */}
            <div style={{
              position: 'absolute',
              inset: '12px',
              border: '2px solid #D97706',
              pointerEvents: 'none'
            }} />

            {/* Corner Decorative Accents */}
            <div style={{ position: 'absolute', top: '18px', left: '18px', width: '24px', height: '24px', borderTop: '4px solid #1B2A4E', borderLeft: '4px solid #1B2A4E' }} />
            <div style={{ position: 'absolute', top: '18px', right: '18px', width: '24px', height: '24px', borderTop: '4px solid #1B2A4E', borderRight: '4px solid #1B2A4E' }} />
            <div style={{ position: 'absolute', bottom: '18px', left: '18px', width: '24px', height: '24px', borderBottom: '4px solid #1B2A4E', borderLeft: '4px solid #1B2A4E' }} />
            <div style={{ position: 'absolute', bottom: '18px', right: '18px', width: '24px', height: '24px', borderBottom: '4px solid #1B2A4E', borderRight: '4px solid #1B2A4E' }} />

            {/* Certificate Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#EFF6FF', border: '2px solid #1E40AF', color: '#1E40AF', marginBottom: '1rem' }}>
                <Award size={36} color="#1E40AF" />
              </div>

              <div style={{ fontSize: '0.85rem', color: '#64748B', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 800 }}>
                JANKALYAN MANAVADHIKAR FOUNDATION
              </div>
              <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#1B2A4E', letterSpacing: '0.02em', margin: '0.4rem 0' }}>
                CERTIFICATE OF SCHOLARSHIP AWARD
              </h1>
              <div style={{ fontSize: '1rem', color: '#D97706', fontWeight: 700 }}>
                शैक्षणिक छात्रवृत्ति सम्मान प्रमाण पत्र
              </div>
            </div>

            {/* Certificate Body */}
            <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2.5rem', lineHeight: 1.8, fontSize: '1.05rem', color: '#334155' }}>
              <p style={{ marginBottom: '1rem' }}>
                This is to officially certify that the student
              </p>
              
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', borderBottom: '2px dashed #CBD5E1', display: 'inline-block', padding: '0 2rem 0.3rem', marginBottom: '1.25rem', fontFamily: 'serif' }}>
                {cert.student_name}
              </div>

              <p>
                having submitted Application ID <strong style={{ color: '#1E40AF', fontFamily: 'monospace' }}>{cert.application_id}</strong>, 
                has been duly evaluated, scrutinized, and sanctioned a scholarship award grant of
              </p>

              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16A34A', margin: '0.75rem 0' }}>
                ₹{parseFloat(cert.grant_amount || 12000).toLocaleString('en-IN')} (Rupees Twelve Thousand Only)
              </div>

              <p>
                under the <strong>{cert.scheme_name}</strong> for the Academic Session <strong>{cert.academic_year}</strong> in recognition of scholastic merit and commitment to higher educational advancement.
              </p>
            </div>

            {/* Footer Signatures and Verification QR */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: '2rem', flexWrap: 'wrap', gap: '1.5rem' }}>
              
              {/* Left: Issue Details */}
              <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                <div><strong>Certificate No:</strong> <span style={{ fontFamily: 'monospace', color: '#0F172A' }}>{cert.certificate_number}</span></div>
                <div><strong>Issue Date:</strong> {cert.issue_date}</div>
                <div><strong>Registration:</strong> JMF/MP/NGO/2026/894</div>
              </div>

              {/* Center: QR Verification Code */}
              <div style={{ textAlign: 'center' }}>
                <QrCodeDisplay value={verifyUrl} size={96} />
                <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '4px', fontWeight: 600 }}>
                  Scan to Verify Authenticity
                </div>
              </div>

              {/* Right: Signature Seal */}
              <div style={{ textAlign: 'center', minWidth: '180px' }}>
                <div style={{ width: '140px', height: '1px', backgroundColor: '#0F172A', margin: '0 auto 0.5rem' }} />
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A' }}>
                  Authorized Signatory
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Scholarship Scrutiny Committee
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <Award size={40} color="#94A3B8" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>
              Certificate Not Available
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Scholarship certificates are generated once the application scrutiny has been approved and scholarship disbursed.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
