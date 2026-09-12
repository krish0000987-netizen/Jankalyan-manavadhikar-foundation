import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
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
  LifeBuoy
} from 'lucide-react';

export const Grievance = () => {
  const { lang, t, navigate, grievances, submitGrievance, cms } = useApp();

  // Registration Form State
  const [grvForm, setGrvForm] = useState({
    name: '',
    mobile: '',
    email: '',
    applicationId: '',
    category: 'Document Re-verification',
    description: ''
  });

  const [generatedId, setGeneratedId] = useState(null);
  const [trackQuery, setTrackQuery] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [trackSearched, setTrackSearched] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!grvForm.name || !grvForm.mobile || !grvForm.description) {
      alert('Please fill name, mobile, and description.');
      return;
    }
    const newId = submitGrievance(grvForm);
    setGeneratedId(newId);
    setGrvForm({
      name: '',
      mobile: '',
      email: '',
      applicationId: '',
      category: 'Document Re-verification',
      description: ''
    });
  };

  const handleTrackGrievance = (e) => {
    e.preventDefault();
    setTrackSearched(true);
    const q = trackQuery.trim();
    if (!q) return;

    const found = grievances.find(g => g.id.toLowerCase() === q.toLowerCase() || g.mobile === q);
    setTrackResult(found || null);
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

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                <Send size={18} />
                <span>{t.btnSubmitGrievance}</span>
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
                Enter Grievance ID (e.g. GRV-2026-00482) or registered mobile number.
              </p>

              <form onSubmit={handleTrackGrievance} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="GRV-2026-XXXXX"
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                />
                <button className="btn btn-secondary btn-sm" type="submit">
                  <Search size={14} />
                </button>
              </form>

              {trackSearched && trackResult && (
                <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 800, color: '#1E40AF' }}>{trackResult.id}</span>
                    <span className="badge badge-yellow">{trackResult.status}</span>
                  </div>
                  <div><strong>Category:</strong> {trackResult.category}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>{trackResult.description}</div>
                </div>
              )}

              {trackSearched && !trackResult && (
                <div style={{ color: '#DC2626', fontSize: '0.85rem', textAlign: 'center', padding: '0.5rem 0' }}>
                  No grievance record found with this query.
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
