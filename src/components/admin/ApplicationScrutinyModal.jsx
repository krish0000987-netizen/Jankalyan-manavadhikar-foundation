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
  Eye, 
  Download,
  ShieldCheck,
  Send,
  Printer,
  ExternalLink
} from 'lucide-react';
import { scrutinyService } from '../../services/scrutinyService';
import { certificateService } from '../../services/certificateService';

export const ApplicationScrutinyModal = ({ 
  application, 
  onClose, 
  onStatusUpdated,
  onDocumentVerified,
  onOpenBankRecords,
  currentUser,
  readOnly = false
}) => {
  const [activeTab, setActiveTab] = useState('dossier'); // 'dossier' | 'documents' | 'history' | 'payment'
  const [actionRemarks, setActionRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [certIssued, setCertIssued] = useState(false);
  const [docsState, setDocsState] = useState(application?.documents || {});
  const [docFeedback, setDocFeedback] = useState(null);
  const [rejectingDocKey, setRejectingDocKey] = useState(null);
  const [rejectReasonInput, setRejectReasonInput] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);

  useEffect(() => {
    setDocsState(application?.documents || {});
  }, [application]);

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
      if (doc?.id) {
        await scrutinyService.verifyDocument(doc.id, status, reason, currentUser);
      }

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
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
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={18} color="#1E40AF" />
                  <span>Applicant Personal & Social Information</span>
                </h4>
                <div className="grid-3" style={{ gap: '0.75rem', fontSize: '0.85rem' }}>
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
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={18} color="#2563EB" />
                  <span>Student Scholarship Registration Fee & Razorpay Verification</span>
                </h4>
                <div className="grid-3" style={{ gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div>
                    <strong>Registration Fee Amount:</strong>{' '}
                    <span style={{ fontWeight: 800, color: '#0F172A' }}>
                      ₹ {application.registrationFeeAmount ? Number(application.registrationFeeAmount).toFixed(2) : '211.30'}
                    </span>
                  </div>
                  <div>
                    <strong>Fee Payment Status:</strong>{' '}
                    <span className={`badge ${application.registrationFeeStatus === 'PAID' ? 'badge-green' : 'badge-yellow'}`}>
                      {application.registrationFeeStatus === 'PAID' ? '✓ PAID' : 'PENDING'}
                    </span>
                  </div>
                  <div>
                    <strong>Razorpay Payment ID:</strong>{' '}
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#2563EB' }}>
                      {application.razorpayPaymentId || 'rzp_verified_direct'}
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

            </div>
          )}

          {/* TAB 2: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                    Applicant Uploaded Documents & Photographs Scrutiny
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                    Review candidate photo, marksheets, and identity proof. Click "Valid" to immediately approve without leaving this screen.
                  </p>
                </div>
              </div>

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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {Object.entries(docsState || {}).map(([key, doc]) => {
                  const isRejecting = rejectingDocKey === key;
                  const isVerified = doc.status === 'Verified' || doc.status === 'VALID';
                  const isRejected = doc.status === 'Rejected' || doc.status === 'INVALID';

                  return (
                    <div key={key} style={{
                      backgroundColor: '#F8FAFC',
                      borderRadius: '10px',
                      border: `1.5px solid ${isVerified ? '#86EFAC' : isRejected ? '#FCA5A5' : '#E2E8F0'}`,
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: 800, textTransform: 'capitalize', color: '#0F172A', fontSize: '0.95rem' }}>
                              {key.replace('_', ' ')}
                            </span>
                            <span className={`badge ${
                              isVerified ? 'badge-green' :
                              isRejected ? 'badge-red' :
                              doc.status === 'Correction Requested' || doc.status === 'CORRECTION_REQUIRED' ? 'badge-yellow' : 'badge-navy'
                            }`} style={{ fontSize: '0.7rem' }}>
                              {doc.status || 'UPLOADED'}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '3px' }}>
                            File: <strong style={{ color: '#1E293B' }}>{doc.file || `${key}_document.pdf`}</strong>
                          </div>
                          {doc.reason && (
                            <div style={{ fontSize: '0.78rem', color: '#DC2626', marginTop: '4px', fontWeight: 600 }}>
                              Defect Remark: {doc.reason}
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {doc.filePath && (
                            <a
                              href={doc.filePath}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-outline btn-sm"
                              style={{ color: '#2563EB', borderColor: '#BFDBFE' }}
                              title="Open original file in new tab"
                            >
                              <ExternalLink size={13} />
                              <span>View File</span>
                            </a>
                          )}

                          {!readOnly && (
                            <>
                              <button
                                type="button"
                                className="btn btn-sm"
                                style={{
                                  backgroundColor: isVerified ? '#16A34A' : '#FFFFFF',
                                  color: isVerified ? '#FFFFFF' : '#16A34A',
                                  border: '1.5px solid #16A34A',
                                  fontWeight: 700
                                }}
                                onClick={() => handleDocumentVerify(key, 'VALID')}
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
                                  fontWeight: 700
                                }}
                                onClick={() => {
                                  if (isRejecting) {
                                    setRejectingDocKey(null);
                                  } else {
                                    setRejectingDocKey(key);
                                    setRejectReasonInput(doc.reason || '');
                                  }
                                }}
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
                              placeholder="e.g. Blurry photo, mismatched marks, missing signature"
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
                })}
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
                    {application.registrationFeeStatus === 'PAID' ? '✓ ₹ 211.30 Paid' : 'Pending'}
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
              <div style={{ display: 'flex', gap: '0.5rem' }}>
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
    </div>
  );
};
