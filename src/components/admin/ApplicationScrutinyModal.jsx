import React, { useState } from 'react';
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
  Printer
} from 'lucide-react';
import { scrutinyService } from '../../services/scrutinyService';
import { certificateService } from '../../services/certificateService';

export const ApplicationScrutinyModal = ({ 
  application, 
  onClose, 
  onStatusUpdated,
  currentUser 
}) => {
  const [activeTab, setActiveTab] = useState('dossier'); // 'dossier' | 'documents' | 'history' | 'payment'
  const [actionRemarks, setActionRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [certIssued, setCertIssued] = useState(false);

  if (!application) return null;

  const handleAction = async (newStatus) => {
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
      const doc = application.documents?.[docKey];
      if (doc?.id) {
        await scrutinyService.verifyDocument(doc.id, status, reason, currentUser);
        alert(`Document marked as ${status}`);
        if (onStatusUpdated) onStatusUpdated(application.id, application.status);
      }
    } catch (err) {
      alert('Error updating document: ' + err.message);
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
              Verification Dossier: {application.studentName}
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
                  <div><strong>Qualifying Percentage:</strong> 78.50%</div>
                </div>
              </div>

              {/* Section 3: Bank Details for DBT Transfer */}
              <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={18} color="#16A34A" />
                  <span>Direct Benefit Transfer (DBT) Banking Details</span>
                </h4>
                <div className="grid-3" style={{ gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div><strong>Bank Name:</strong> State Bank of India</div>
                  <div><strong>Account Number (Masked):</strong> XXXX-XXXX-4829</div>
                  <div><strong>IFSC Code:</strong> SBIN0001248</div>
                  <div><strong>Aadhaar DBT Status:</strong> <span className="badge badge-green">Seeded</span></div>
                  <div><strong>Payment Status:</strong> {application.paymentDate !== '-' ? 'Released' : 'Pending'}</div>
                  <div><strong>Bank UTR:</strong> <span style={{ fontFamily: 'monospace' }}>{application.utrNumber}</span></div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>
                Applicant Uploaded Documents Scrutiny
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {Object.entries(application.documents || {}).map(([key, doc]) => (
                  <div key={key} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, textTransform: 'capitalize', color: '#0F172A' }}>
                        {key.replace('_', ' ')}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                        File: {doc.file}
                      </div>
                      {doc.reason && (
                        <div style={{ fontSize: '0.78rem', color: '#DC2626', marginTop: '2px' }}>
                          Reason: {doc.reason}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`badge ${
                        doc.status === 'Verified' || doc.status === 'VALID' ? 'badge-green' :
                        doc.status === 'Rejected' || doc.status === 'INVALID' ? 'badge-red' :
                        doc.status === 'Correction Requested' || doc.status === 'CORRECTION_REQUIRED' ? 'badge-yellow' : 'badge-navy'
                      }`}>
                        {doc.status}
                      </span>

                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleDocumentVerify(key, 'VALID')}
                      >
                        <Check size={12} />
                        <span>Valid</span>
                      </button>

                      <button
                        className="btn btn-outline btn-sm"
                        style={{ color: '#DC2626', borderColor: '#FECACA' }}
                        onClick={() => {
                          const reason = prompt('Enter rejection reason for this document:');
                          if (reason) handleDocumentVerify(key, 'INVALID', reason);
                        }}
                      >
                        <X size={12} />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
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

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-outline btn-sm"
                style={{ color: '#DC2626', borderColor: '#FECACA' }}
                disabled={submitting}
                onClick={() => handleAction('Rejected')}
              >
                <XCircle size={14} />
                <span>Reject</span>
              </button>

              <button 
                className="btn btn-outline btn-sm"
                style={{ color: '#D97706', borderColor: '#FDE68A' }}
                disabled={submitting}
                onClick={() => handleAction('Correction Requested')}
              >
                <AlertTriangle size={14} />
                <span>Request Correction</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-secondary btn-sm"
                disabled={submitting}
                onClick={() => handleAction('Approved')}
              >
                <CheckCircle2 size={14} />
                <span>Approve Application</span>
              </button>

              {application.status === 'Approved' && (
                <button 
                  className="btn btn-gold btn-sm"
                  disabled={submitting}
                  onClick={() => handleAction('Scholarship Released')}
                >
                  <CreditCard size={14} />
                  <span>Disburse DBT Payment</span>
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
