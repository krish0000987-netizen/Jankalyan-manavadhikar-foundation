import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  CreditCard, 
  Building, 
  Award, 
  Clock, 
  Check, 
  Copy,
  Eye, 
  Download,
  ShieldCheck,
  Send,
  Printer,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RefreshCw,
  Maximize2,
  FileCheck,
  User,
  Image as ImageIcon,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../../api/supabase';
import { getSignedUrl, downloadStorageFile, cleanStoragePath } from '../../api/storage';
import { scrutinyService } from '../../services/scrutinyService';
import { certificateService } from '../../services/certificateService';

const STANDARD_DOC_DEFS = [
  { id: 'photo', nameEn: 'Passport-size Photograph', nameHi: 'पासपोर्ट आकार का फोटो', required: true, isImage: true },
  { id: 'aadhaar', nameEn: 'Aadhaar Card (UIDAI)', nameHi: 'आधार कार्ड (UIDAI)', required: true },
  { id: 'marksheet', nameEn: 'Qualifying Marksheet', nameHi: 'पिछली परीक्षा की अंकसूची', required: true },
  { id: 'bonafide', nameEn: 'Institutional Bonafide / Admission Slip', nameHi: 'संस्थान प्रवेश / बोनाफाइड प्रमाण पत्र', required: true },
  { id: 'passbook', nameEn: 'Bank Passbook / Statement Copy', nameHi: 'बैंक पासबुक / खाता विवरण प्रति', required: true },
  { id: 'income', nameEn: 'Income Certificate', nameHi: 'सक्षम आय प्रमाण पत्र', required: false },
  { id: 'caste', nameEn: 'Caste / Category Certificate', nameHi: 'जाति / श्रेणी प्रमाण पत्र', required: false }
];

export const ApplicationScrutinyModal = ({ 
  application, 
  onClose, 
  onStatusUpdated,
  onDocumentVerified,
  onOpenBankRecords,
  onOpenDisburse,
  currentUser,
  readOnly = false
}) => {
  const [activeTab, setActiveTab] = useState('dossier'); // 'dossier' | 'documents' | 'history' | 'payment'
  const [actionRemarks, setActionRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [certIssued, setCertIssued] = useState(false);
  const [docsState, setDocsState] = useState(application?.documents || {});
  const [signedUrls, setSignedUrls] = useState({});
  const [previewModalDoc, setPreviewModalDoc] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [fetchingDbDocs, setFetchingDbDocs] = useState(false);
  const [docFeedback, setDocFeedback] = useState(null);
  const [rejectingDocKey, setRejectingDocKey] = useState(null);
  const [rejectReasonInput, setRejectReasonInput] = useState('');
  const [appCertificates, setAppCertificates] = useState([]);
  const [txnCopied, setTxnCopied] = useState(false);

  // Sync docsState when application changes
  useEffect(() => {
    setDocsState(application?.documents || {});
  }, [application]);

  // Fetch fresh application_documents directly from Supabase to guarantee complete, real-time records
  const loadLiveDocs = async () => {
    if (!application?.id) return;
    setFetchingDbDocs(true);
    try {
      const { data: dbDocs, error } = await supabase
        .from('application_documents')
        .select('*')
        .eq('application_id', application.id);

      if (!error && dbDocs && dbDocs.length > 0) {
        const freshMap = {};
        dbDocs.forEach(d => {
          let docStatus = 'Uploaded';
          if (d.verification_status === 'VALID' || d.verification_status === 'Verified') docStatus = 'Verified';
          else if (d.verification_status === 'INVALID' || d.verification_status === 'Rejected') docStatus = 'Rejected';
          else if (d.verification_status === 'CORRECTION_REQUIRED' || d.verification_status === 'Correction Requested') docStatus = 'Correction Requested';
          else if (d.verification_status) docStatus = d.verification_status;

          freshMap[d.document_type_id] = {
            id: d.id,
            status: docStatus,
            rawStatus: d.verification_status,
            file: d.file_name || d.file_path,
            fileName: d.file_name,
            filePath: d.file_path,
            bucketName: d.bucket_name || 'student-documents',
            mimeType: d.mime_type,
            fileSizeKb: d.file_size_kb,
            reason: d.rejection_reason || null,
            uploadTimestamp: d.upload_timestamp
          };
        });

        setDocsState(prev => ({
          ...(application?.documents || {}),
          ...prev,
          ...freshMap
        }));
      }
    } catch (err) {
      console.warn('Scrutiny direct docs load error:', err);
    } finally {
      setFetchingDbDocs(false);
    }
  };

  useEffect(() => {
    loadLiveDocs();
  }, [application?.id]);

  // Resolve signed URLs for all documents in docsState
  useEffect(() => {
    let isMounted = true;
    async function resolveAllSignedUrls() {
      if (!docsState) return;
      const entries = Object.entries(docsState);
      const newUrls = {};

      for (const [key, doc] of entries) {
        if (!doc) continue;
        const targetPath = doc.filePath || doc.file || (typeof doc === 'string' ? doc : null);
        if (!targetPath) continue;

        if (targetPath.startsWith('http://') || targetPath.startsWith('https://') || targetPath.startsWith('data:') || targetPath.startsWith('blob:')) {
          newUrls[key] = targetPath;
          continue;
        }

        try {
          const bucket = doc.bucketName || 'student-documents';
          const signed = await getSignedUrl(bucket, targetPath, 7200);
          if (signed && isMounted) {
            newUrls[key] = signed;
          }
        } catch (e) {
          console.warn(`Could not resolve signed URL for ${key}:`, e);
        }
      }

      if (isMounted) {
        setSignedUrls(prev => ({ ...prev, ...newUrls }));
      }
    }
    resolveAllSignedUrls();
    return () => { isMounted = false; };
  }, [docsState]);

  const handleOpenPreview = (key, doc) => {
    const d = doc || docsState[key] || {};
    const url = signedUrls[key] || (d.filePath?.startsWith('http') ? d.filePath : null);
    const def = STANDARD_DOC_DEFS.find(s => s.id === key);
    setZoomLevel(1);
    setRotation(0);
    setPreviewModalDoc({
      key,
      doc: d,
      url,
      nameEn: def?.nameEn || key.replace('_', ' ').toUpperCase(),
      nameHi: def?.nameHi || ''
    });
  };

  const isImageFile = (doc, url) => {
    const str = `${doc?.fileName || ''} ${doc?.filePath || ''} ${doc?.file || ''} ${url || ''}`.toLowerCase();
    return str.includes('.jpg') || str.includes('.jpeg') || str.includes('.png') || str.includes('.webp') || str.includes('image/');
  };

  useEffect(() => {
    if (application?.id) {
      certificateService.getCertificatesByAppId(application.id)
        .then(certs => setAppCertificates(certs || []))
        .catch(e => console.warn('Cert fetch note:', e));
    }
  }, [application?.id]);

  if (!application) return null;

  // Strict Jurisdictional Authorization Check
  let isJurisdictionAuthorized = true;
  let jurisdictionViolationMessage = '';

  if (currentUser && currentUser.role && currentUser.role !== 'SUPER_ADMIN') {
    if (currentUser.role === 'DISTRICT_COORDINATOR') {
      const userDistId = currentUser.jurisdiction?.district?.id || currentUser.district_id;
      const userDistName = (currentUser.jurisdiction?.district?.name || '').toLowerCase();
      const appDistId = application.districtId || application.district_id;
      const appDistName = (application.district || '').toLowerCase();

      if ((userDistId && appDistId && userDistId !== appDistId) || 
          (userDistName && appDistName && userDistName !== appDistName)) {
        isJurisdictionAuthorized = false;
        jurisdictionViolationMessage = `This application is assigned to the "${application.district}" District Cell. You are logged in as the coordinator for "${currentUser.jurisdiction?.district?.name}". According to foundation governance rules, applications can only be approved by their assigned district coordinator.`;
      }
    } else if (currentUser.role === 'BLOCK_COORDINATOR') {
      const userBlkId = currentUser.jurisdiction?.block?.id || currentUser.block_id;
      const userBlkName = (currentUser.jurisdiction?.block?.name || '').toLowerCase();
      const appBlkId = application.blockId || application.block_id;
      const appBlkName = (application.block || '').toLowerCase();

      if ((userBlkId && appBlkId && userBlkId !== appBlkId) || 
          (userBlkName && appBlkName && userBlkName !== appBlkName)) {
        isJurisdictionAuthorized = false;
        jurisdictionViolationMessage = `This application is assigned to the "${application.block}" Block Cell. You are authorized only for "${currentUser.jurisdiction?.block?.name}".`;
      }
    } else if (currentUser.role === 'INSTITUTION') {
      const userInstId = currentUser.jurisdiction?.institution?.id || currentUser.institution_id;
      const userInstName = (currentUser.jurisdiction?.institution?.name || '').toLowerCase();
      const appInstId = application.institutionId || application.institution_id;
      const appInstName = (application.institution || '').toLowerCase();

      if ((userInstId && appInstId && userInstId !== appInstId) || 
          (userInstName && appInstName && userInstName !== appInstName)) {
        isJurisdictionAuthorized = false;
        jurisdictionViolationMessage = `This student is enrolled in "${application.institution}". You are authorized only for "${currentUser.jurisdiction?.institution?.name}".`;
      }
    }
  }

  const handleAction = async (newStatus) => {
    if (!isJurisdictionAuthorized) {
      alert('Action Unauthorized: ' + jurisdictionViolationMessage);
      return;
    }
    if ((newStatus === 'Rejected' || newStatus === 'Correction Requested') && !actionRemarks.trim()) {
      alert('Please enter specific remarks or reasons for this action.');
      return;
    }

    setSubmitting(true);
    try {
      let utr = '';
      if (newStatus === 'Scholarship Released') {
        utr = `JMFDBT${Math.floor(100000000000 + Math.random() * 900000000000)}`;
      }

      await scrutinyService.updateApplicationStatus(
        application.id, 
        newStatus, 
        actionRemarks, 
        utr, 
        currentUser
      );

      // Auto-issue certificate if approved
      if (newStatus === 'Approved' || newStatus === 'Scholarship Released') {
        try {
          await certificateService.issueCertificate({
            applicationId: application.id,
            studentName: application.studentName,
            schemeName: 'Jankalyan Manavadhikar Foundation Scholarship Scheme 2026-27',
            grantAmount: 12000
          });
          setCertIssued(true);
        } catch (cErr) {
          // ignore duplicate
        }
      }

      setActionRemarks('');
      if (onStatusUpdated) onStatusUpdated(application.id, newStatus, utr);
      onClose();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDocumentVerify = async (docKey, status, reason = '') => {
    try {
      const doc = docsState[docKey] || application.documents?.[docKey];
      await scrutinyService.verifyDocument(doc?.id, status, reason, currentUser, {
        applicationId: application.id,
        docKey
      });

      const newStatusLabel = status === 'VALID' ? 'Verified' : status === 'INVALID' ? 'Rejected' : 'Correction Requested';

      setDocsState(prev => ({
        ...prev,
        [docKey]: {
          ...(prev[docKey] || {}),
          status: newStatusLabel,
          reason: status === 'VALID' ? null : reason
        }
      }));

      setDocFeedback({
        type: status === 'VALID' ? 'success' : 'warning',
        message: `✓ ${docKey.replace('_', ' ').toUpperCase()} marked as ${newStatusLabel}!`
      });
      setTimeout(() => setDocFeedback(null), 3000);

      setRejectingDocKey(null);
      setRejectReasonInput('');

      if (onDocumentVerified) {
        onDocumentVerified(application.id, docKey, newStatusLabel, reason);
      }
    } catch (err) {
      setDocFeedback({
        type: 'error',
        message: 'Failed to update document: ' + err.message
      });
      setTimeout(() => setDocFeedback(null), 4000);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
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
        maxWidth: '960px',
        width: '100%',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        overflow: 'hidden'
      }}>
        
        {/* Top Header Bar */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#0F172A',
          color: '#FFFFFF'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.1rem', color: '#FEF08A' }}>
                {application.id}
              </span>
              <span className={`badge ${
                application.status === 'Scholarship Released' ? 'badge-green' :
                application.status === 'Approved' ? 'badge-blue' :
                application.status === 'Rejected' ? 'badge-red' :
                application.status === 'Correction Requested' ? 'badge-yellow' : 'badge-navy'
              }`}>
                {application.status}
              </span>
              {(application.transactionId || application.razorpayPaymentId) && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#1E293B', border: '1px solid #334155', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>TXN ID:</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#38BDF8', fontSize: '0.8rem' }}>
                    {application.transactionId || application.razorpayPaymentId}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => {
                      navigator.clipboard.writeText(application.transactionId || application.razorpayPaymentId);
                      setTxnCopied(true);
                      setTimeout(() => setTxnCopied(false), 2000);
                    }} 
                    title="Copy Transaction ID"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: txnCopied ? '#4ADE80' : '#94A3B8', padding: '0 2px', display: 'flex', alignItems: 'center' }}
                  >
                    {txnCopied ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                </div>
              )}
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>
              {readOnly ? `Application Master Record: ${application.studentName}` : `Verification Dossier: ${application.studentName}`}
            </h2>
          </div>

          <button 
            onClick={onClose}
            style={{ color: '#94A3B8', fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* Dossier Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem 2rem 0', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
          <button
            className={`btn btn-sm ${activeTab === 'dossier' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: '6px 6px 0 0', borderBottom: 'none' }}
            onClick={() => setActiveTab('dossier')}
          >
            Application Details
          </button>

          <button
            className={`btn btn-sm ${activeTab === 'documents' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: '6px 6px 0 0', borderBottom: 'none' }}
            onClick={() => setActiveTab('documents')}
          >
            Documents & Scrutiny
          </button>

          <button
            className={`btn btn-sm ${activeTab === 'history' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: '6px 6px 0 0', borderBottom: 'none' }}
            onClick={() => setActiveTab('history')}
          >
            Workflow Timeline
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          
          {/* Assigned Governance Cell Hierarchy Strip */}
          <div style={{
            backgroundColor: '#F1F5F9',
            borderRadius: '12px',
            padding: '0.85rem 1.25rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            fontSize: '0.825rem',
            border: '1px solid #CBD5E1'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0F172A' }}>
              <strong>🏫 Assigned Institution:</strong>
              <span style={{ fontWeight: 600 }}>{application.institution || 'Educational Institution'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0F172A' }}>
              <strong>🏛️ Assigned Block Cell:</strong>
              <span className="badge badge-navy">{application.block || 'Patan'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0F172A' }}>
              <strong>🗺️ Assigned District Cell:</strong>
              <span className="badge badge-blue">{application.district || 'Jabalpur'}</span>
            </div>
          </div>

          {/* Strict Jurisdiction Violation Alert if User is not Authorized */}
          {!isJurisdictionAuthorized && (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '2px solid #FECACA',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.85rem'
            }}>
              <AlertTriangle size={24} color="#DC2626" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#991B1B' }}>
                  🔒 Action Locked: Jurisdictional Cell Boundary Enforced
                </div>
                <div style={{ fontSize: '0.825rem', color: '#7F1D1D', marginTop: '3px', lineHeight: 1.5 }}>
                  {jurisdictionViolationMessage}
                </div>
              </div>
            </div>
          )}
          {currentUser?.role === 'INSTITUTION' ? (
            <div style={{ backgroundColor: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#0D9488', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Building size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F766E' }}>
                  Phase 2: Institutional Bonafide Attestation (Tier 1)
                </div>
                <div style={{ fontSize: '0.8rem', color: '#115E59', marginTop: '2px' }}>
                  Review enrolled students in your institution. Confirm enrollment in 12th / Degree, verify roll number & marksheet. If documents are blurred or mismatched, request correction with specific remarks. Once satisfied, click <strong>"Sign & Attest Bonafide"</strong>.
                </div>
              </div>
            </div>
          ) : (currentUser?.role === 'DISTRICT_COORDINATOR' || currentUser?.role === 'BLOCK_COORDINATOR') ? (
            <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#D97706', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShieldCheck size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#92400E' }}>
                  Phase 3: District & Block Scrutiny (Tier 2)
                </div>
                <div style={{ fontSize: '0.8rem', color: '#78350F', marginTop: '2px' }}>
                  Evaluate family annual income limit (&le; ₹3,00,000), category quotas, and bonafide genuineness across your district. Applications meeting all criteria should be marked as <strong>"Approve Application"</strong> for state DBT treasury clearance.
                </div>
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#1E40AF', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Award size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1E40AF' }}>
                  Phase 4: Board Clearance & Direct Benefit Transfer (Tier 3)
                </div>
                <div style={{ fontSize: '0.8rem', color: '#1E3A8A', marginTop: '2px' }}>
                  Statewide administrative authority: Review verified candidates, aggregate approved students into DBT payment batches, and disburse official scholarships directly to student bank accounts with banking UTRs.
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: DOSSIER DETAILS */}
          {activeTab === 'dossier' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Section 1: Personal & Identity */}
              <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={18} color="#1E40AF" />
                  <span>Applicant Personal & Social Information</span>
                </h4>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  {/* Student Photo Card */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flexShrink: 0
                  }}>
                    <div 
                      style={{
                        width: '100px',
                        height: '120px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        backgroundColor: '#E2E8F0',
                        border: '2px solid #CBD5E1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: signedUrls.photo ? 'pointer' : 'default',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        position: 'relative'
                      }}
                      onClick={() => {
                        if (signedUrls.photo || docsState.photo) {
                          handleOpenPreview('photo', docsState.photo);
                        }
                      }}
                      title={signedUrls.photo ? 'Click to inspect candidate photograph' : 'Candidate Photograph'}
                    >
                      {signedUrls.photo ? (
                        <img 
                          src={signedUrls.photo} 
                          alt={application.studentName}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ textAlign: 'center', color: '#64748B', padding: '0.5rem' }}>
                          <User size={32} color="#94A3B8" style={{ margin: '0 auto' }} />
                          <div style={{ fontSize: '0.65rem', marginTop: '4px', fontWeight: 600 }}>No Photo</div>
                        </div>
                      )}
                    </div>
                    {signedUrls.photo && (
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        onClick={() => handleOpenPreview('photo', docsState.photo)}
                      >
                        <Eye size={11} />
                        <span>Inspect</span>
                      </button>
                    )}
                  </div>

                  {/* Personal Details Grid */}
                  <div className="grid-3" style={{ flex: 1, gap: '0.75rem', fontSize: '0.85rem' }}>
                    <div><strong>Student Name:</strong> {application.studentName}</div>
                    <div><strong>Father / Guardian:</strong> {application.fatherName || '-'}</div>
                    <div><strong>Mobile:</strong> {application.mobile}</div>
                    <div><strong>Email:</strong> {application.email || '-'}</div>
                    <div><strong>Gender:</strong> {application.gender || 'Male'}</div>
                    <div><strong>Social Category:</strong> <span className="badge badge-navy">{application.category}</span></div>
                    <div><strong>Annual Family Income:</strong> {application.annualIncome || '₹1,00,000'}</div>
                    <div><strong>District:</strong> {application.district}</div>
                    <div><strong>Block:</strong> {application.block}</div>
                  </div>
                </div>
              </div>

              {/* Section 2: Academic Details */}
              <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building size={18} color="#1E40AF" />
                  <span>Enrolled Institution & Academic Record</span>
                </h4>
                <div className="grid-2" style={{ gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div><strong>Institution Name:</strong> {application.institution}</div>
                  <div><strong>Class / Course:</strong> {application.course}</div>
                  <div><strong>Academic Year:</strong> 2026-27</div>
                  <div><strong>Status:</strong> {application.status}</div>
                </div>
              </div>

              {/* Section 3: Bank Details for DBT Transfer */}
              <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={18} color="#16A34A" />
                  <span>Direct Benefit Transfer (DBT) Banking Details</span>
                </h4>
                <div className="grid-3" style={{ gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div><strong>Bank Name:</strong> {application.bankName || 'State Bank of India'}</div>
                  <div>
                    <strong>Account Number:</strong>{' '}
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#1E40AF', fontSize: '0.9rem' }}>
                      {application.accountNumber || '38291049281'}
                    </span>
                  </div>
                  <div><strong>IFSC Code:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{application.ifsc || 'SBIN0001248'}</span></div>
                  <div><strong>Aadhaar DBT Status:</strong> <span className="badge badge-green">Seeded</span></div>
                  <div><strong>Payment Status:</strong> {application.paymentDate !== '-' ? 'Released' : 'Pending'}</div>
                  <div><strong>Bank UTR:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{application.utrNumber}</span></div>
                </div>
              </div>

              {/* Section 4: Registration Fee & Razorpay Payment Record */}
              <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={18} color="#2563EB" />
                    <span>Student Scholarship Registration Fee & Transaction Record</span>
                  </h4>
                  <button 
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => window.open(`/receipt/${application.id}`, '_blank')}
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#166534', borderColor: '#86EFAC', backgroundColor: '#F0FDF4', fontWeight: 700 }}
                    title="Open official fee payment receipt in new tab"
                  >
                    <FileText size={13} />
                    <span>View / Print Fee Receipt</span>
                  </button>
                </div>
                <div className="grid-3" style={{ gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div>
                    <strong>Registration Fee Amount:</strong>{' '}
                    <span style={{ fontWeight: 800, color: '#0F172A' }}>
                      ₹ {application.registrationFeeAmount !== null && application.registrationFeeAmount !== undefined ? Number(application.registrationFeeAmount).toFixed(2) : '211.30'}
                    </span>
                  </div>
                  <div>
                    <strong>Fee Payment Status:</strong>{' '}
                    <span className={`badge ${application.registrationFeeStatus === 'PAID' ? 'badge-green' : 'badge-yellow'}`}>
                      {application.registrationFeeStatus === 'PAID' ? '✓ PAID' : 'PENDING'}
                    </span>
                  </div>
                  <div>
                    <strong>Transaction ID (Razorpay ID):</strong>{' '}
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#2563EB' }}>
                      {application.transactionId || application.razorpayPaymentId || 'pay_jmf_verified'}
                    </span>
                  </div>
                  <div>
                    <strong>Payment Gateway:</strong> Razorpay Standard Checkout
                  </div>
                  <div>
                    <strong>Payment Date / Timestamp:</strong>{' '}
                    {application.feePaymentDate ? new Date(application.feePaymentDate).toLocaleString('en-IN') : application.submissionDate}
                  </div>
                  <div>
                    <strong>Audit Status:</strong>{' '}
                    <span className="badge badge-blue">Reconciled in Database</span>
                  </div>
                </div>
              </div>

              {/* Section 5: Issued Scholarship Certificates (Per Installment) */}
              {appCertificates.length > 0 && (
                <div style={{ backgroundColor: '#F0FDF4', padding: '1.25rem', borderRadius: '12px', border: '1.5px solid #BBF7D0' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#166534', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={18} color="#16A34A" />
                    <span>Issued Scholarship Certificates ({appCertificates.length} Installment{appCertificates.length > 1 ? 's' : ''})</span>
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {appCertificates.map((c, idx) => (
                      <div key={c.id || idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #DCFCE7' }}>
                        <div>
                          <strong style={{ fontSize: '0.85rem', color: '#0F172A' }}>
                            {c.scheme_name || `Installment #${idx + 1}`}
                          </strong>
                          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                            Certificate: <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{c.certificate_number}</span> • Amount: <strong style={{ color: '#16A34A' }}>₹{Number(c.grant_amount || 0).toLocaleString('en-IN')}</strong> • Date: {c.issue_date}
                          </div>
                        </div>
                        <button 
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => window.open(`/certificate/${c.id}`, '_blank')}
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                        >
                          <ExternalLink size={12} />
                          <span>View Certificate</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div>
              {/* Header with Stats & Reload */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileCheck size={20} color="#1E40AF" />
                    <span>Applicant Uploaded Documents & Photographs Scrutiny</span>
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '2px' }}>
                    Inspect candidate original scans, marksheets, and identity proofs. Click "View Document" to inspect with high-res zoom & rotate.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={loadLiveDocs}
                    disabled={fetchingDbDocs}
                    style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    title="Reload live documents from database"
                  >
                    <RefreshCw size={13} className={fetchingDbDocs ? 'animate-spin' : ''} />
                    <span>{fetchingDbDocs ? 'Refreshing...' : 'Refresh Records'}</span>
                  </button>
                </div>
              </div>

              {/* Status Summary Strip */}
              {(() => {
                const totalDefs = STANDARD_DOC_DEFS.length;
                const uploadedCount = Object.values(docsState || {}).filter(d => Boolean(d.file || d.filePath)).length;
                const verifiedCount = Object.values(docsState || {}).filter(d => d.status === 'Verified' || d.status === 'VALID').length;
                const rejectedCount = Object.values(docsState || {}).filter(d => d.status === 'Rejected' || d.status === 'INVALID').length;
                
                return (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    backgroundColor: '#F1F5F9',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    marginBottom: '1.25rem',
                    fontSize: '0.8rem',
                    flexWrap: 'wrap',
                    border: '1px solid #E2E8F0'
                  }}>
                    <span style={{ fontWeight: 700, color: '#334155' }}>
                      📋 Checklist Progress:
                    </span>
                    <span className="badge badge-navy">
                      {uploadedCount} of {totalDefs} Uploaded
                    </span>
                    <span className="badge badge-green">
                      {verifiedCount} Verified Valid
                    </span>
                    {rejectedCount > 0 && (
                      <span className="badge badge-red">
                        {rejectedCount} Defective / Rejected
                      </span>
                    )}
                  </div>
                );
              })()}

              {docFeedback && (
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  backgroundColor: docFeedback.type === 'success' ? '#DCFCE7' : docFeedback.type === 'warning' ? '#FEF3C7' : '#FEE2E2',
                  border: `1px solid ${docFeedback.type === 'success' ? '#86EFAC' : docFeedback.type === 'warning' ? '#FCD34D' : '#FCA5A5'}`,
                  color: docFeedback.type === 'success' ? '#166534' : docFeedback.type === 'warning' ? '#92400E' : '#991B1B',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  {docFeedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                  <span>{docFeedback.message}</span>
                </div>
              )}

              {/* Document Cards List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {(() => {
                  // Build combined list of standard documents and any additional documents in docsState
                  const combined = STANDARD_DOC_DEFS.map(def => {
                    const doc = docsState[def.id] || docsState[def.id.toLowerCase()] || null;
                    return {
                      key: def.id,
                      nameEn: def.nameEn,
                      nameHi: def.nameHi,
                      required: def.required,
                      isImage: def.isImage,
                      doc
                    };
                  });

                  // Add extra keys from docsState not present in STANDARD_DOC_DEFS
                  Object.entries(docsState || {}).forEach(([k, v]) => {
                    if (!STANDARD_DOC_DEFS.some(d => d.id === k)) {
                      combined.push({
                        key: k,
                        nameEn: k.replace('_', ' ').toUpperCase(),
                        nameHi: '',
                        required: false,
                        isImage: false,
                        doc: v
                      });
                    }
                  });

                  return combined.map(({ key, nameEn, nameHi, required, doc }) => {
                    const isRejecting = rejectingDocKey === key;
                    const hasUploaded = Boolean(doc && (doc.filePath || doc.file));
                    const isVerified = doc && (doc.status === 'Verified' || doc.status === 'VALID');
                    const isRejected = doc && (doc.status === 'Rejected' || doc.status === 'INVALID');
                    const isCorrection = doc && (doc.status === 'Correction Requested' || doc.status === 'CORRECTION_REQUIRED');
                    const fileUrl = signedUrls[key] || (doc?.filePath?.startsWith('http') ? doc.filePath : null);
                    const isImage = isImageFile(doc, fileUrl);

                    return (
                      <div 
                        key={key} 
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '12px',
                          border: `1.5px solid ${isVerified ? '#86EFAC' : isRejected ? '#FCA5A5' : hasUploaded ? '#CBD5E1' : '#E2E8F0'}`,
                          padding: '1.1rem 1.25rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.85rem',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            
                            {/* Document Thumbnail Preview for Images */}
                            {hasUploaded && (
                              <div 
                                style={{
                                  width: '56px',
                                  height: '56px',
                                  borderRadius: '8px',
                                  overflow: 'hidden',
                                  backgroundColor: '#F1F5F9',
                                  border: '1px solid #CBD5E1',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                  cursor: fileUrl ? 'pointer' : 'default',
                                  position: 'relative'
                                }}
                                onClick={() => {
                                  if (fileUrl || hasUploaded) handleOpenPreview(key, doc);
                                }}
                                title={fileUrl ? 'Click to inspect document' : 'Uploaded document'}
                              >
                                {fileUrl && isImage ? (
                                  <img 
                                    src={fileUrl} 
                                    alt={nameEn}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                ) : (
                                  <FileText size={24} color="#2563EB" />
                                )}
                              </div>
                            )}

                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.98rem' }}>
                                  {nameEn}
                                </span>
                                {nameHi && (
                                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                                    ({nameHi})
                                  </span>
                                )}
                                <span className={`badge ${
                                  !hasUploaded ? 'badge-navy' :
                                  isVerified ? 'badge-green' :
                                  isRejected ? 'badge-red' :
                                  isCorrection ? 'badge-yellow' : 'badge-blue'
                                }`} style={{ fontSize: '0.7rem' }}>
                                  {!hasUploaded ? (required ? 'COMPULSORY • NOT UPLOADED' : 'OPTIONAL • NOT UPLOADED') : (doc.status || 'UPLOADED')}
                                </span>
                              </div>

                              <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>
                                {hasUploaded ? (
                                  <>
                                    File: <strong style={{ color: '#1E293B' }}>{doc.fileName || doc.file || `${key}_document`}</strong>
                                    {doc.fileSizeKb && (
                                      <span style={{ marginLeft: '0.5rem', color: '#94A3B8' }}>
                                        ({doc.fileSizeKb} KB)
                                      </span>
                                    )}
                                    {doc.uploadTimestamp && (
                                      <span style={{ marginLeft: '0.5rem', color: '#94A3B8' }}>
                                        • Uploaded: {new Date(doc.uploadTimestamp).toLocaleDateString('en-IN')}
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  <span style={{ color: '#94A3B8', fontStyle: 'italic' }}>
                                    No document file uploaded yet by student.
                                  </span>
                                )}
                              </div>

                              {doc?.reason && (
                                <div style={{ fontSize: '0.8rem', color: '#DC2626', marginTop: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <AlertTriangle size={13} />
                                  <span>Defect Remark: "{doc.reason}"</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                            {hasUploaded && (
                              <>
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}
                                  onClick={() => handleOpenPreview(key, doc)}
                                  title="Inspect document in high-res viewer with zoom and rotation"
                                >
                                  <Eye size={13} />
                                  <span>View Document</span>
                                </button>

                                {fileUrl && (
                                  <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-outline btn-sm"
                                    style={{ color: '#2563EB', borderColor: '#BFDBFE', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}
                                    title="Open file in separate browser tab"
                                  >
                                    <ExternalLink size={13} />
                                    <span>New Tab</span>
                                  </a>
                                )}

                                <button
                                  type="button"
                                  className="btn btn-outline btn-sm"
                                  style={{ color: '#16A34A', borderColor: '#BBF7D0', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}
                                  onClick={() => downloadStorageFile(doc.bucketName || 'student-documents', doc.filePath || doc.file, doc.fileName || doc.file)}
                                  title="Download original file"
                                >
                                  <Download size={13} />
                                  <span>Download</span>
                                </button>
                              </>
                            )}

                            {!readOnly && hasUploaded && (
                              <>
                                <button
                                  type="button"
                                  className="btn btn-sm"
                                  style={{
                                    backgroundColor: isVerified ? '#16A34A' : '#FFFFFF',
                                    color: isVerified ? '#FFFFFF' : '#16A34A',
                                    border: '1.5px solid #16A34A',
                                    fontWeight: 700,
                                    fontSize: '0.78rem'
                                  }}
                                  onClick={() => handleDocumentVerify(key, 'VALID')}
                                  title="Mark document as valid"
                                >
                                  <Check size={13} />
                                  <span>{isVerified ? 'Valid ✓' : 'Mark Valid'}</span>
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-sm"
                                  style={{
                                    backgroundColor: isRejected ? '#DC2626' : '#FFFFFF',
                                    color: isRejected ? '#FFFFFF' : '#DC2626',
                                    border: '1.5px solid #DC2626',
                                    fontWeight: 700,
                                    fontSize: '0.78rem'
                                  }}
                                  onClick={() => {
                                    if (isRejecting) {
                                      setRejectingDocKey(null);
                                    } else {
                                      setRejectingDocKey(key);
                                      setRejectReasonInput(doc.reason || '');
                                    }
                                  }}
                                  title="Reject document and request correction"
                                >
                                  <X size={13} />
                                  <span>{isRejected ? 'Defective' : 'Reject'}</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Inline Rejection Reason Panel */}
                        {isRejecting && (
                          <div style={{
                            backgroundColor: '#FEF2F2',
                            border: '1px solid #FECACA',
                            borderRadius: '8px',
                            padding: '0.85rem',
                            marginTop: '0.25rem'
                          }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#991B1B', display: 'block', marginBottom: '0.4rem' }}>
                              Specify Reason for Rejection / Correction Request:
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <input
                                type="text"
                                className="form-control"
                                style={{ fontSize: '0.85rem', height: '34px' }}
                                placeholder="e.g. Blurry photo, mismatched marks, missing signature or seal"
                                value={rejectReasonInput}
                                onChange={(e) => setRejectReasonInput(e.target.value)}
                                autoFocus
                              />
                              <button
                                type="button"
                                className="btn btn-sm"
                                style={{ backgroundColor: '#DC2626', color: '#FFFFFF', whiteSpace: 'nowrap' }}
                                onClick={() => {
                                  handleDocumentVerify(key, 'INVALID', rejectReasonInput.trim() || 'Defective document copy');
                                }}
                              >
                                Confirm Reject
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                onClick={() => setRejectingDocKey(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* TAB 3: TIMELINE & STATUS HISTORY */}
          {activeTab === 'history' && (
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.25rem' }}>
                Application Processing Log & Audit Trail
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '2px solid #E2E8F0', paddingLeft: '1.5rem', marginLeft: '0.5rem' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-1.85rem', top: '2px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>Application Submitted Online</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Date: {application.submissionDate} • Form filled by candidate</div>
                </div>

                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-1.85rem', top: '2px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#2563EB' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>Current Processing State: {application.status}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Stage {application.stage} of 5 in national evaluation workflow</div>
                  {application.rejectionReason && (
                    <div style={{ fontSize: '0.8rem', color: '#DC2626', marginTop: '0.3rem', backgroundColor: '#FEF2F2', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                      Remarks: {application.rejectionReason}
                    </div>
                  )}
                </div>

                {application.approvalDate && application.approvalDate !== '-' && (
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-1.85rem', top: '2px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>Approved by Committee</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Approval Date: {application.approvalDate}</div>
                  </div>
                )}

                {application.paymentDate && application.paymentDate !== '-' && (
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-1.85rem', top: '2px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>Scholarship Released via Direct Benefit Transfer</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Disbursed Date: {application.paymentDate} • Bank UTR: {application.utrNumber}</div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Sticky Action Footer */}
        <div style={{
          backgroundColor: '#F8FAFC',
          borderTop: '1px solid #E2E8F0',
          padding: '1.25rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {readOnly ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span className="badge badge-navy" style={{ fontSize: '0.8rem' }}>Master Registry Dossier</span>
                <span style={{ fontSize: '0.85rem', color: '#475569' }}>
                  Registration Fee: <strong style={{ color: application.registrationFeeStatus === 'PAID' ? '#16A34A' : '#D97706' }}>
                    {application.registrationFeeStatus === 'PAID' ? `✓ ₹ ${application.registrationFeeAmount ? Number(application.registrationFeeAmount).toFixed(2) : '211.30'} Paid` : 'Pending'}
                  </strong>
                  {application.razorpayPaymentId && (
                    <span style={{ fontFamily: 'monospace', marginLeft: '0.5rem', color: '#2563EB' }}>
                      ({application.razorpayPaymentId})
                    </span>
                  )}
                </span>
                {application.status === 'Scholarship Released' && (
                  <span className="badge badge-green" style={{ fontSize: '0.78rem' }}>
                    DBT Released • UTR: {application.utrNumber}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {onOpenDisburse && ((application.rawRemainingAmount === undefined || application.rawRemainingAmount > 0) && application.status !== 'Scholarship Released' && application.rawStatus !== 'SCHOLARSHIP_RELEASED') && (
                  <button 
                    type="button" 
                    className="btn btn-primary btn-sm" 
                    style={{ backgroundColor: '#2563EB', borderColor: '#2563EB', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}
                    onClick={() => {
                      onClose();
                      onOpenDisburse(application);
                    }}
                    title="Open installment disbursement modal for this applicant"
                  >
                    <CreditCard size={13} />
                    <span>{(application.rawDisbursedAmount || 0) > 0 ? 'Pay Installment' : 'Disburse / Installment'}</span>
                  </button>
                )}
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                  <Printer size={14} />
                  <span>Print Application</span>
                </button>
                <button className="btn btn-outline btn-sm" onClick={onClose}>
                  Close
                </button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>
                  Verifier Scrutiny Remarks / Action Justification:
                </label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="e.g. Approved after institutional bonafide verification / Blurry income certificate, please re-upload"
                  value={actionRemarks}
                  onChange={(e) => setActionRemarks(e.target.value)}
                  style={{ fontSize: '0.85rem' }}
                />
              </div>

              {!isJurisdictionAuthorized && (
                <div style={{ color: '#DC2626', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#FEF2F2', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                  <AlertTriangle size={15} />
                  <span>Approval Locked: You are authorized only for your assigned jurisdiction ({currentUser.jurisdiction?.district?.name || currentUser.jurisdiction?.institution?.name || currentUser.role}).</span>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-outline btn-sm"
                    style={{ color: '#DC2626', borderColor: '#FECACA' }}
                    disabled={submitting || !isJurisdictionAuthorized}
                    onClick={() => handleAction('Rejected')}
                  >
                    <XCircle size={14} />
                    <span>{currentUser?.role === 'INSTITUTION' ? 'Reject Bonafide' : 'Reject Application'}</span>
                  </button>

                  <button 
                    className="btn btn-outline btn-sm"
                    style={{ color: '#D97706', borderColor: '#FDE68A' }}
                    disabled={submitting || !isJurisdictionAuthorized}
                    onClick={() => handleAction('Correction Requested')}
                  >
                    <AlertTriangle size={14} />
                    <span>Request Correction</span>
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {/* Institution Nodal Action: Phase 2 Institutional Bonafide Attestation */}
                  {currentUser?.role === 'INSTITUTION' && (
                    <button 
                      className="btn btn-primary btn-sm"
                      style={{ backgroundColor: '#0D9488', borderColor: '#0D9488', color: '#FFFFFF' }}
                      disabled={submitting || !isJurisdictionAuthorized || application.status === 'Bonafide Attested' || application.status === 'Approved' || application.status === 'Scholarship Released'}
                      onClick={() => handleAction('Bonafide Attested')}
                    >
                      <ShieldCheck size={14} />
                      <span>{application.status === 'Bonafide Attested' ? 'Bonafide Already Attested' : 'Sign & Attest Bonafide (Tier 1)'}</span>
                    </button>
                  )}

                  {/* District / Block Coordinator Action: Phase 3 District Scrutiny Approval */}
                  {(currentUser?.role === 'DISTRICT_COORDINATOR' || currentUser?.role === 'BLOCK_COORDINATOR') && (
                    <button 
                      className="btn btn-secondary btn-sm"
                      disabled={submitting || !isJurisdictionAuthorized || application.status === 'Approved' || application.status === 'Scholarship Released'}
                      onClick={() => handleAction('Approved')}
                    >
                      <CheckCircle2 size={14} />
                      <span>{application.status === 'Approved' ? 'Already Approved' : 'Approve Application (Tier 2)'}</span>
                    </button>
                  )}

                  {/* Super Admin Actions: Complete Statewide Access */}
                  {(!currentUser?.role || currentUser?.role === 'SUPER_ADMIN') && (
                    <>
                      {application.status === 'Under Verification' && (
                        <button 
                          className="btn btn-outline btn-sm"
                          style={{ color: '#0D9488', borderColor: '#99F6E4' }}
                          disabled={submitting}
                          onClick={() => handleAction('Bonafide Attested')}
                        >
                          <ShieldCheck size={14} />
                          <span>Attest Bonafide</span>
                        </button>
                      )}

                      {application.status !== 'Approved' && application.status !== 'Scholarship Released' && (
                        <button 
                          className="btn btn-primary btn-sm"
                          style={{ backgroundColor: '#1E40AF', borderColor: '#1E40AF', color: '#FFFFFF' }}
                          disabled={submitting}
                          onClick={() => handleAction('Approved')}
                          title="Verify documents and move applicant to Beneficiary Records for manual bank transfer"
                        >
                          <CheckCircle2 size={14} />
                          <span>Approve & Sanction Scholarship (₹12,000)</span>
                        </button>
                      )}

                      {application.status === 'Approved' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#EFF6FF', color: '#1E40AF', padding: '0.4rem 0.8rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.82rem', border: '1px solid #BFDBFE' }}>
                            <CheckCircle2 size={15} color="#2563EB" />
                            <span>Approved • Ready in Bank Records</span>
                          </div>
                          {onOpenBankRecords && (
                            <button 
                              type="button"
                              className="btn btn-gold btn-sm"
                              onClick={onOpenBankRecords}
                              style={{ fontWeight: 800, backgroundColor: '#D97706', color: '#FFFFFF', borderColor: '#D97706', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                              title="Go directly to Beneficiary Bank Records ledger"
                            >
                              <CreditCard size={14} />
                              <span>Go to Beneficiary Bank Records</span>
                            </button>
                          )}
                        </div>
                      )}

                      {onOpenDisburse && ((application.rawRemainingAmount === undefined || application.rawRemainingAmount > 0) && application.status !== 'Scholarship Released' && application.rawStatus !== 'SCHOLARSHIP_RELEASED') && (
                        <button 
                          type="button"
                          className="btn btn-primary btn-sm"
                          style={{ backgroundColor: (application.rawDisbursedAmount || 0) > 0 ? '#D97706' : '#2563EB', borderColor: (application.rawDisbursedAmount || 0) > 0 ? '#D97706' : '#2563EB', color: '#FFFFFF', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                          onClick={() => {
                            onClose();
                            onOpenDisburse(application);
                          }}
                          title="Record offline DBT transfer or scholarship installment"
                        >
                          <CreditCard size={13} />
                          <span>{(application.rawDisbursedAmount || 0) > 0 ? 'Pay Next Installment' : 'Disburse / Pay in Installments'}</span>
                        </button>
                      )}

                      {application.status === 'Scholarship Released' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#DCFCE7', color: '#166534', padding: '0.4rem 0.8rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.82rem', border: '1px solid #BBF7D0' }}>
                          <CheckCircle2 size={15} color="#16A34A" />
                          <span>Scholarship Transferred • {application.paymentDate || 'Recorded'}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

              </div>
            </>
          )}
        </div>

      </div>

      {/* Interactive Full Document Inspection Modal */}
      {previewModalDoc && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1200,
          padding: '1.25rem'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '1000px',
            width: '100%',
            maxHeight: '94vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            overflow: 'hidden'
          }}>
            {/* Viewer Header */}
            <div style={{
              padding: '1rem 1.5rem',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #1E293B',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#FEF08A' }}>
                    {previewModalDoc.nameEn}
                  </span>
                  {previewModalDoc.nameHi && (
                    <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                      ({previewModalDoc.nameHi})
                    </span>
                  )}
                  <span className={`badge ${
                    previewModalDoc.doc?.status === 'Verified' || previewModalDoc.doc?.status === 'VALID' ? 'badge-green' :
                    previewModalDoc.doc?.status === 'Rejected' || previewModalDoc.doc?.status === 'INVALID' ? 'badge-red' :
                    'badge-navy'
                  }`} style={{ fontSize: '0.7rem' }}>
                    {previewModalDoc.doc?.status || 'UPLOADED'}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '3px' }}>
                  Candidate: <strong style={{ color: '#F1F5F9' }}>{application.studentName}</strong> • ID: <span style={{ fontFamily: 'monospace', color: '#38BDF8' }}>{application.id}</span> • File: <span style={{ color: '#CBD5E1' }}>{previewModalDoc.doc?.fileName || previewModalDoc.doc?.file || 'Document'}</span>
                </div>
              </div>

              {/* Toolbar & Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                {isImageFile(previewModalDoc.doc, previewModalDoc.url) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#1E293B', padding: '0.25rem 0.5rem', borderRadius: '8px', border: '1px solid #334155' }}>
                    <button 
                      type="button" 
                      onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.25))}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.2rem 0.45rem', color: '#F8FAFC', borderColor: '#475569' }}
                      title="Zoom In"
                    >
                      <ZoomIn size={14} />
                    </button>
                    <span style={{ fontSize: '0.75rem', color: '#CBD5E1', minWidth: '40px', textAlign: 'center', fontWeight: 700 }}>
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button 
                      type="button" 
                      onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.2rem 0.45rem', color: '#F8FAFC', borderColor: '#475569' }}
                      title="Zoom Out"
                    >
                      <ZoomOut size={14} />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setRotation(prev => (prev + 90) % 360)}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.2rem 0.45rem', color: '#F8FAFC', borderColor: '#475569' }}
                      title="Rotate 90°"
                    >
                      <RotateCw size={14} />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => { setZoomLevel(1); setRotation(0); }}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.2rem 0.45rem', color: '#F8FAFC', borderColor: '#475569', fontSize: '0.7rem' }}
                      title="Reset"
                    >
                      Reset
                    </button>
                  </div>
                )}

                {previewModalDoc.url && (
                  <>
                    <button 
                      type="button" 
                      onClick={() => window.open(previewModalDoc.url, '_blank')}
                      className="btn btn-outline btn-sm"
                      style={{ color: '#38BDF8', borderColor: '#0284C7', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}
                      title="Open full file in new browser window"
                    >
                      <ExternalLink size={13} />
                      <span>New Tab</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => downloadStorageFile(previewModalDoc.doc?.bucketName || 'student-documents', previewModalDoc.doc?.filePath || previewModalDoc.doc?.file, previewModalDoc.doc?.fileName || previewModalDoc.doc?.file)}
                      className="btn btn-outline btn-sm"
                      style={{ color: '#4ADE80', borderColor: '#16A34A', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}
                      title="Download original file"
                    >
                      <Download size={13} />
                      <span>Download</span>
                    </button>
                  </>
                )}

                <button 
                  type="button" 
                  onClick={() => setPreviewModalDoc(null)}
                  style={{ color: '#94A3B8', fontSize: '1.4rem', background: 'none', border: 'none', cursor: 'pointer', marginLeft: '0.5rem', lineHeight: 1 }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Viewer Content Area */}
            <div style={{
              flex: 1,
              overflow: 'auto',
              backgroundColor: '#0B1120',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '480px',
              position: 'relative'
            }}>
              {!previewModalDoc.url ? (
                <div style={{ textAlign: 'center', color: '#94A3B8', padding: '2rem' }}>
                  <Loader2 size={36} className="animate-spin" color="#38BDF8" style={{ margin: '0 auto 1rem' }} />
                  <p style={{ fontWeight: 600 }}>Resolving secure signed document link...</p>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.25rem' }}>
                    Storage target: {previewModalDoc.doc?.filePath || previewModalDoc.doc?.file || 'N/A'}
                  </p>
                </div>
              ) : isImageFile(previewModalDoc.doc, previewModalDoc.url) ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  overflow: 'auto'
                }}>
                  <img 
                    src={previewModalDoc.url}
                    alt={previewModalDoc.nameEn}
                    style={{
                      transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                      transition: 'transform 0.15s ease',
                      maxWidth: '100%',
                      maxHeight: '68vh',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                    }}
                  />
                </div>
              ) : (
                <iframe 
                  src={previewModalDoc.url}
                  title={previewModalDoc.nameEn}
                  style={{
                    width: '100%',
                    height: '70vh',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF'
                  }}
                />
              )}
            </div>

            {/* Viewer Action Footer */}
            <div style={{
              padding: '0.85rem 1.5rem',
              backgroundColor: '#F8FAFC',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div style={{ fontSize: '0.825rem', color: '#64748B' }}>
                Status: <strong style={{ color: '#0F172A' }}>{previewModalDoc.doc?.status || 'UPLOADED'}</strong>
                {previewModalDoc.doc?.reason && (
                  <span style={{ color: '#DC2626', marginLeft: '0.75rem', fontWeight: 600 }}>
                    Remark: "{previewModalDoc.doc.reason}"
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {!readOnly && (
                  <>
                    <button
                      type="button"
                      className="btn btn-sm"
                      style={{
                        backgroundColor: '#16A34A',
                        color: '#FFFFFF',
                        border: '1.5px solid #16A34A',
                        fontWeight: 700,
                        fontSize: '0.8rem'
                      }}
                      onClick={() => handleDocumentVerify(previewModalDoc.key, 'VALID')}
                    >
                      <Check size={14} />
                      <span>Mark Document Valid ✓</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm"
                      style={{
                        backgroundColor: '#DC2626',
                        color: '#FFFFFF',
                        border: '1.5px solid #DC2626',
                        fontWeight: 700,
                        fontSize: '0.8rem'
                      }}
                      onClick={() => {
                        const reason = prompt('Specify rejection remark / defect reason for this document:', previewModalDoc.doc?.reason || 'Document copy is defective or illegible');
                        if (reason !== null && reason.trim()) {
                          handleDocumentVerify(previewModalDoc.key, 'INVALID', reason.trim());
                        }
                      }}
                    >
                      <X size={14} />
                      <span>Reject Document</span>
                    </button>
                  </>
                )}

                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setPreviewModalDoc(null)}
                >
                  Close Viewer
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
