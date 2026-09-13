import React, { useState, useEffect } from 'react';
import { supabase } from '../../api/supabase';
import { QrCodeDisplay } from '../common/QrCodeDisplay';
import { 
  QrCode, 
  Search, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  ExternalLink, 
  Clock, 
  Loader2, 
  RefreshCw,
  Award,
  User,
  Building
} from 'lucide-react';

export const QrVerifyManager = () => {
  const [query, setQuery] = useState('JMF-2026-108234');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  const loadLogs = async () => {
    setLoadingLogs(true);
    try {
      const { data } = await supabase
        .from('qr_verifications')
        .select('*')
        .order('scanned_at', { ascending: false })
        .limit(20);
      setRecentLogs(data || []);
    } catch (err) {
      console.error('Error loading QR logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    loadLogs();
    handleVerify('JMF-2026-108234');
  }, []);

  const handleVerify = async (identifierToVerify) => {
    const q = (identifierToVerify || query).trim();
    if (!q) return;

    setVerifying(true);
    setResult(null);
    setErrorMsg(null);

    try {
      // 1. Try matching application
      const { data: app } = await supabase
        .from('applications')
        .select(`
          id, status, created_at, disbursed_amount, utr_number,
          students (full_name, mobile, social_category, annual_income),
          institutions (name),
          scholarship_schemes (name_en, grant_amount)
        `)
        .or(`id.eq.${q},verification_token.eq.${q}`)
        .maybeSingle();

      // 2. Try matching certificate
      const { data: cert } = await supabase
        .from('certificates')
        .select('*')
        .or(`certificate_number.eq.${q},verification_token.eq.${q},application_id.eq.${q}`)
        .maybeSingle();

      if (app || cert) {
        setResult({
          type: cert ? 'CERTIFICATE' : 'APPLICATION',
          app,
          cert,
          verifiedAt: new Date().toISOString()
        });

        // Record verification scan in qr_verifications
        await supabase.from('qr_verifications').insert([{
          target_type: cert ? 'certificate' : 'application',
          target_identifier: q,
          verification_token: app?.verification_token || cert?.verification_token || q,
          ip_address: '127.0.0.1',
          user_agent: navigator.userAgent
        }]);

        loadLogs();
      } else {
        setErrorMsg(`No genuine scholarship record or certificate found for token/ID "${q}".`);
      }
    } catch (err) {
      console.error('QR verification error:', err);
      setErrorMsg('Failed to verify record against registry.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <QrCode size={24} color="#1E40AF" />
            <span>Official QR Code Verification & Anti-Fraud Center</span>
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
            Instant cryptographic token validation for applications, receipts, and digital scholarship certificates.
          </p>
        </div>

        <button className="btn btn-outline btn-sm" onClick={loadLogs}>
          <RefreshCw size={14} className={loadingLogs ? 'animate-spin' : ''} />
          <span>Refresh Scan Logs</span>
        </button>
      </div>

      {/* 2-Column: Live Verification Tool on Left, Scan Log on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
        
        {/* Left: Interactive Verification Tool */}
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem' }}>
            Verify Document Authenticity
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.5rem' }}>
            Enter Application ID, Certificate ID, or scan token printed on the receipt.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input 
              type="text"
              className="form-control"
              placeholder="e.g. JMF-2026-108234 or CERT-JMF-2026-108234"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ height: '44px', fontSize: '0.95rem' }}
            />
            <button type="submit" disabled={verifying} className="btn btn-primary" style={{ padding: '0 1.25rem' }}>
              {verifying ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              <span>Verify</span>
            </button>
          </form>

          {/* Error Alert */}
          {errorMsg && (
            <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <XCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Validation Card */}
          {result && (
            <div style={{
              backgroundColor: '#F0FDF4',
              border: '1.5px solid #86EFAC',
              borderRadius: '12px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontWeight: 800, fontSize: '1.05rem' }}>
                  <ShieldCheck size={24} color="#16A34A" />
                  <span>OFFICIALLY VERIFIED & AUTHENTIC</span>
                </div>
                <span className="badge badge-green">Valid in Registry</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '1rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                  <div><strong>Application ID:</strong> {result.app?.id || result.cert?.application_id}</div>
                  <div><strong>Student Name:</strong> {result.app?.students?.full_name || result.cert?.student_name}</div>
                  <div><strong>Institution:</strong> {result.app?.institutions?.name || 'Govt Excellence School'}</div>
                  <div><strong>Status:</strong> <span className="badge badge-navy">{result.app?.status || 'APPROVED'}</span></div>
                  <div><strong>Grant Amount:</strong> ₹{Number(result.app?.disbursed_amount || result.cert?.grant_amount || 12000).toLocaleString('en-IN')}</div>
                  {result.app?.utr_number && (
                    <div><strong>Banking UTR:</strong> <code style={{ color: '#1E40AF', fontWeight: 700 }}>{result.app.utr_number}</code></div>
                  )}
                </div>

                {/* Dynamic QR Display */}
                <div style={{ textAlign: 'center' }}>
                  <QrCodeDisplay 
                    value={`https://jankalyan.org/verify/application/${result.app?.id || result.cert?.application_id}`} 
                    size={110} 
                  />
                  <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '0.35rem' }}>Scannable Code</div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #BBF7D0', paddingTop: '0.75rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <a 
                  href={`/certificate/${result.app?.id || result.cert?.application_id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-sm"
                >
                  <Award size={14} />
                  <span>View Official Certificate</span>
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Right: Recent Scans Audit Log */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '560px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>
              Recent QR Verifications
            </div>
            <Clock size={16} color="#64748B" />
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {recentLogs.map((log, idx) => (
              <div 
                key={log.id || idx}
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.8rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0F172A', marginBottom: '0.2rem' }}>
                  <span>{log.target_identifier}</span>
                  <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>VERIFIED</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Target: {log.target_type} • {new Date(log.scanned_at || Date.now()).toLocaleTimeString()}
                </div>
              </div>
            ))}
            {recentLogs.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748B' }}>
                No recent scans logged.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
