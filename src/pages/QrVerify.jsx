import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { applicationService } from '../services/applicationService';
import { certificateService } from '../services/certificateService';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  Building, 
  FileText, 
  Search,
  ArrowLeft
} from 'lucide-react';

export const QrVerify = ({ verifyType = 'application', identifier = '' }) => {
  const { lang, navigate } = useApp();
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState(null);
  const [error, setError] = useState(null);
  const [inputQuery, setInputQuery] = useState(identifier);

  useEffect(() => {
    async function doVerify() {
      if (!identifier) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        if (verifyType === 'certificate') {
          const cert = await certificateService.getCertificateByToken(identifier) 
            || await certificateService.getCertificateByAppId(identifier);
          if (cert) {
            setRecord({
              type: 'certificate',
              title: 'Official Scholarship Award Certificate',
              number: cert.certificate_number,
              name: cert.student_name,
              scheme: cert.scheme_name,
              year: cert.academic_year,
              amount: `₹${parseFloat(cert.grant_amount || 12000).toLocaleString('en-IN')}`,
              date: cert.issue_date,
              status: 'VERIFIED_VALID'
            });
          } else {
            setError('No official scholarship certificate record matches this verification token.');
          }
        } else {
          // Application Verification
          const app = await applicationService.trackApplication(identifier);
          if (app) {
            setRecord({
              type: 'application',
              title: 'Official Scholarship Application Docket',
              number: app.id,
              name: app.studentName,
              scheme: 'JMF Scholarship Yojna 2026-27',
              institution: app.institution,
              district: app.district,
              date: app.submissionDate,
              status: app.status,
              stage: app.stage,
              utrNumber: app.utrNumber
            });
          } else {
            setError('No official application record matches this identifier.');
          }
        }
      } catch (err) {
        setError('Verification lookup error: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    doVerify();
  }, [verifyType, identifier]);

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      navigate(`/verify/${verifyType}/${encodeURIComponent(inputQuery.trim())}`);
    }
  };

  return (
    <div className="section-py" style={{ backgroundColor: '#F8FAFC', minHeight: '85vh' }}>
      <div className="container-narrow">
        
        <button className="btn btn-outline btn-sm" onClick={() => navigate('/')} style={{ marginBottom: '1.5rem' }}>
          <ArrowLeft size={14} />
          <span>{lang === 'hi' ? 'मुख्य पृष्ठ पर लौटें' : 'Back to Home'}</span>
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#EFF6FF', color: '#1E40AF', padding: '0.4rem 1rem', borderRadius: '9999px', fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.75rem' }}>
            <ShieldCheck size={16} />
            <span>OFFICIAL QR VERIFICATION SYSTEM</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
            {lang === 'hi' ? 'दस्तावेज़ एवं प्रमाण पत्र प्रमाणीकरण' : 'Document & Certificate Verification'}
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
            Jankalyan Manavadhikar Foundation Public Verification Portal
          </p>
        </div>

        {/* Verification Result Card */}
        {loading ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <Clock size={40} color="#2563EB" style={{ margin: '0 auto 1rem', animation: 'spin 2s linear infinite' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>
              Verifying credentials with central database...
            </h3>
          </div>
        ) : record ? (
          <div className="card animate-fade-in" style={{ padding: '2.5rem', borderTop: '5px solid #16A34A', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <span className="badge badge-green" style={{ marginBottom: '0.2rem' }}>GENUINE & VERIFIED</span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>{record.title}</h3>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>IDENTIFIER</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E40AF', fontFamily: 'monospace' }}>{record.number}</div>
              </div>
            </div>

            <div className="grid-2" style={{ gap: '1rem', backgroundColor: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.75rem', fontSize: '0.95rem' }}>
              <div><strong>Recipient / Student:</strong> {record.name}</div>
              <div><strong>Scheme:</strong> {record.scheme}</div>
              {record.institution && <div><strong>Institution:</strong> {record.institution}</div>}
              {record.district && <div><strong>District:</strong> {record.district}</div>}
              {record.amount && <div><strong>Sanctioned Amount:</strong> <span style={{ color: '#16A34A', fontWeight: 800 }}>{record.amount}</span></div>}
              <div><strong>Record Status:</strong> <span className="badge badge-navy">{record.status}</span></div>
              {record.date && <div><strong>Sanction / Issue Date:</strong> {record.date}</div>}
              {record.utrNumber && record.utrNumber !== '-' && <div><strong>Banking UTR:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{record.utrNumber}</span></div>}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: '#64748B', borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
              <ShieldCheck size={18} color="#16A34A" />
              <span>This record has been digitally authenticated against the central database of Jankalyan Manavadhikar Foundation.</span>
            </div>

          </div>
        ) : (
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <XCircle size={40} color="#DC2626" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#991B1B', marginBottom: '0.5rem' }}>
              Record Not Found or Invalid Token
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {error || 'Please enter a valid Application ID or Certificate Token to verify.'}
            </p>

            {/* Search Input */}
            <form onSubmit={handleManualSearch} style={{ display: 'flex', gap: '0.5rem', maxWidth: '460px', margin: '0 auto' }}>
              <input 
                type="text" 
                className="form-control"
                placeholder="Enter Application ID or Certificate Token..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                <Search size={16} />
                <span>Verify</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
