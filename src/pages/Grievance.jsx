import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { grievanceService } from '../services/grievanceService';
import { 
  AlertCircle, 
  Send, 
  Search, 
  CheckCircle, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck,
  FileQuestion,
  LifeBuoy,
  Loader2,
  MessageSquare
} from 'lucide-react';

export const Grievance = () => {
  const { lang, t, navigate, cms } = useApp();

  // Registration Form State
  const [grvForm, setGrvForm] = useState({
    name: '',
    mobile: '',
    email: '',
    applicationId: '',
    category: 'Document Re-verification',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [generatedId, setGeneratedId] = useState(null);

  // Tracking State
  const [trackQuery, setTrackQuery] = useState('');
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackResult, setTrackResult] = useState(null);
  const [trackSearched, setTrackSearched] = useState(false);
  const [trackError, setTrackError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!grvForm.name || !grvForm.mobile || !grvForm.description) {
      setFormError('Please fill name, mobile, and description.');
      return;
    }
    setLoading(true);
    try {
      const newId = await grievanceService.submitGrievance(grvForm);
      setGeneratedId(newId);
      setGrvForm({
        name: '',
        mobile: '',
        email: '',
        applicationId: '',
        category: 'Document Re-verification',
        description: ''
      });
    } catch (err) {
      console.error('Submit grievance error:', err);
      setFormError(err.message || 'Failed to submit grievance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrackGrievance = async (e) => {
    e.preventDefault();
    const q = trackQuery.trim();
    if (!q) return;

    setTrackLoading(true);
    setTrackSearched(true);
    setTrackError('');
    try {
      const result = await grievanceService.trackGrievance(q);
      setTrackResult(result);
    } catch (err) {
      console.error('Track grievance error:', err);
      setTrackError('Error querying grievance status. Please try again.');
    } finally {
      setTrackLoading(false);
    }
  };

  return (
    <div className="section-py" style={{ backgroundColor: '#F8FAFC', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
          <span className="badge badge-red" style={{ marginBottom: '0.75rem' }}>
            {lang === 'hi' ? 'समस्या निवारण प्रकोष्ठ' : 'STUDENT GRIEVANCE REDRESSAL'}
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem' }}>
            {t.grievanceTitle}
          </h1>
          <p style={{ color: '#64748B', fontSize: '1rem' }}>
            {t.grievanceSub}
          </p>
        </div>

        {/* 2-Column Grid: Form & Tracker */}
        <div className="grid-editorial" style={{ maxWidth: '1080px', margin: '0 auto 3.5rem' }}>
          
          {/* Form Box */}
          <div className="card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
              {lang === 'hi' ? 'शिकायत / सहायता अनुरोध दर्ज करें' : 'Register a New Complaint'}
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
              {lang === 'hi' ? 'फाउंडेशन संवीक्षा दल 48 कार्य घंटों के भीतर समाधान प्रदान करता है।' : 'Our scrutiny cell resolves queries within 48 working hours.'}
            </p>

            {formError && (
              <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', color: '#991B1B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={18} />
                <span>{formError}</span>
              </div>
            )}

            {generatedId && (
              <div style={{ backgroundColor: '#DCFCE7', border: '1px solid #BBF7D0', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontWeight: 700, fontSize: '0.95rem' }}>
                  <CheckCircle size={18} />
                  <span>{t.grvSuccess}</span>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#166534', margin: '0.25rem 0' }}>
                  {generatedId}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#166534' }}>
                  {lang === 'hi' ? 'कृपया स्थिति जांचने हेतु इस आईडी को नोट कर लें।' : 'Please retain this Grievance ID for resolution tracking.'}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label required">Student / Parent Name</label>
                  <input 
                    type="text"
                    className="form-control"
                    required
                    value={grvForm.name}
                    onChange={(e) => setGrvForm({ ...grvForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">Mobile Number</label>
                  <input 
                    type="tel"
                    className="form-control"
                    maxLength={10}
                    required
                    value={grvForm.mobile}
                    onChange={(e) => setGrvForm({ ...grvForm, mobile: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Email Address (Optional)</label>
                  <input 
                    type="email"
                    className="form-control"
                    value={grvForm.email}
                    onChange={(e) => setGrvForm({ ...grvForm, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Application ID (if applicable)</label>
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="e.g. JMF-2026-XXXXXX"
                    value={grvForm.applicationId}
                    onChange={(e) => setGrvForm({ ...grvForm, applicationId: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label required">{t.fieldComplaintCat}</label>
                <select 
                  className="form-control"
                  value={grvForm.category}
                  onChange={(e) => setGrvForm({ ...grvForm, category: e.target.value })}
                >
                  <option value="Document Re-verification">Document Re-verification / Rejection Query</option>
                  <option value="Payment & DBT Inquiry">Payment & Bank DBT Transfer Inquiry</option>
                  <option value="Application Form Correction">Application Details Correction</option>
                  <option value="Eligibility Criteria Clarification">Eligibility Criteria Clarification</option>
                  <option value="Other">Other Technical / General Query</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label required">{t.fieldComplaintDesc}</label>
                <textarea 
                  className="form-control"
                  rows={4}
                  required
                  placeholder="Describe your issue with relevant details..."
                  value={grvForm.description}
                  onChange={(e) => setGrvForm({ ...grvForm, description: e.target.value })}
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                <span>{loading ? 'Submitting...' : t.btnSubmitGrievance}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Track Existing Ticket & Helpdesk */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Track Grievance Box */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                {lang === 'hi' ? 'शिकायत की स्थिति ट्रैक करें' : 'Track Grievance Ticket'}
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Enter Grievance ID (e.g. GRV-2026-XXXXX) or registered mobile number.
              </p>

              <form onSubmit={handleTrackGrievance} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="GRV-2026-XXXXX or Mobile"
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                />
                <button className="btn btn-secondary btn-sm" type="submit" disabled={trackLoading}>
                  {trackLoading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                </button>
              </form>

              {trackError && (
                <div style={{ color: '#DC2626', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  {trackError}
                </div>
              )}

              {trackSearched && trackResult && (
                <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span style={{ fontWeight: 800, color: '#1E40AF', fontSize: '1rem' }}>{trackResult.id}</span>
                    <span className={`badge ${trackResult.status === 'RESOLVED' ? 'badge-green' : trackResult.status === 'IN_REVIEW' ? 'badge-yellow' : 'badge-navy'}`}>
                      {trackResult.status}
                    </span>
                  </div>
                  <div style={{ marginBottom: '0.25rem' }}><strong>Category:</strong> {trackResult.category}</div>
                  <div style={{ marginBottom: '0.4rem' }}><strong>Student:</strong> {trackResult.student_name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#475569', backgroundColor: '#FFFFFF', padding: '0.6rem', borderRadius: '6px', border: '1px solid #CBD5E1', marginBottom: '0.5rem' }}>
                    <strong>Issue:</strong> {trackResult.description}
                  </div>
                  {trackResult.resolution_notes && (
                    <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '0.6rem', borderRadius: '6px', color: '#065F46' }}>
                      <strong>Resolution / Officer Remarks:</strong> {trackResult.resolution_notes}
                    </div>
                  )}
                </div>
              )}

              {trackSearched && !trackResult && !trackLoading && (
                <div style={{ color: '#DC2626', fontSize: '0.85rem', textAlign: 'center', padding: '0.5rem 0' }}>
                  No grievance record found with this query. Please check the ticket number.
                </div>
              )}
            </div>

            {/* Direct Official Helpdesk Contacts */}
            <div className="card" style={{ backgroundColor: '#1B2A4E', color: '#FFFFFF', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <LifeBuoy size={24} color="#FEF08A" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Direct Helpline Desk
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Phone size={18} color="#FEF08A" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Mobile Helpline</div>
                    <a href={`tel:${cms.officialMobile}`} style={{ fontWeight: 700, color: '#FFFFFF' }}>
                      {cms.officialMobile}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Phone size={18} color="#FEF08A" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Landline Telephone</div>
                    <a href={`tel:${cms.officialTelephone}`} style={{ fontWeight: 700, color: '#FFFFFF' }}>
                      {cms.officialTelephone}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Mail size={18} color="#FEF08A" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Official Email</div>
                    <a href={`mailto:${cms.officialEmail}`} style={{ fontWeight: 700, color: '#FFFFFF', wordBreak: 'break-all' }}>
                      {cms.officialEmail}
                    </a>
                  </div>
                </div>
              </div>

              <a 
                href={`tel:${cms.officialMobile}`}
                className="btn btn-gold btn-sm"
                style={{ width: '100%' }}
              >
                <Phone size={14} />
                <span>Call Helpline Now</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
