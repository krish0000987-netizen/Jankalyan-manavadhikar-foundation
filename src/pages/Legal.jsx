import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, FileText, ArrowLeft } from 'lucide-react';

export const Legal = ({ pageType = 'privacy' }) => {
  const { lang, navigate, cms } = useApp();

  const getContent = () => {
    if (pageType === 'privacy') {
      return {
        badge: lang === 'hi' ? 'डेटा सुरक्षा एवं गोपनीयता' : 'DATA PROTECTION NOTICE',
        title: lang === 'hi' ? 'गोपनीयता नीति (Privacy Policy)' : 'Foundation Privacy Policy',
        text: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', lineHeight: 1.8 }}>
            <p>
              The Jankalyan Manavadhikar Foundation Scholarship Yojna is committed to safeguarding student data, personal records, and scholastic documents in accordance with applicable data privacy frameworks.
            </p>
            <h4 style={{ fontWeight: 700, color: '#0F172A', marginTop: '1rem' }}>1. Collection of Information</h4>
            <p>
              Information collected through the scholarship portal is strictly limited to candidate identity, academic enrollment records, and bank account details required for direct scholarship disbursement.
            </p>
            <h4 style={{ fontWeight: 700, color: '#0F172A', marginTop: '1rem' }}>2. Aadhaar & Banking Data Masking</h4>
            <p>
              Aadhaar numbers and bank details are stored with strict encryption standards and never exposed in public lookup domains.
            </p>
            <h4 style={{ fontWeight: 700, color: '#0F172A', marginTop: '1rem' }}>3. Third-Party Sharing</h4>
            <p>
              The foundation does not sell, rent, or trade applicant information to commercial entities. Information is shared only with verified institutional coordinators and banking channels for Direct Benefit Transfer.
            </p>
          </div>
        )
      };
    } else if (pageType === 'terms') {
      return {
        badge: lang === 'hi' ? 'नियम एवं शर्तें' : 'TERMS & CONDITIONS',
        title: lang === 'hi' ? 'नियम एवं शर्तें (Terms & Conditions)' : 'Terms & Conditions of Portal Usage',
        text: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', lineHeight: 1.8 }}>
            <p>
              By accessing and applying through the Jankalyan Manavadhikar Foundation Scholarship Yojna portal, applicants, parents, and partner institutions agree to comply with all established rules.
            </p>
            <h4 style={{ fontWeight: 700, color: '#0F172A', marginTop: '1rem' }}>1. Accuracy of Submitted Data</h4>
            <p>
              Applicants bear full responsibility for the genuineness and accuracy of all uploaded marksheets, certificates, and bank information. Any fraudulent declaration shall lead to disqualification.
            </p>
            <h4 style={{ fontWeight: 700, color: '#0F172A', marginTop: '1rem' }}>2. Verification Prerogative</h4>
            <p>
              Submission of an application does not confer an automatic right to grant disbursement. All grants are subject to scrutiny, seat allotments, and committee sanctions.
            </p>
          </div>
        )
      };
    } else {
      return {
        badge: lang === 'hi' ? 'अस्वीकरण' : 'OFFICIAL DISCLAIMER',
        title: lang === 'hi' ? 'अस्वीकरण (Disclaimer)' : 'Legal & Institutional Disclaimer',
        text: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', lineHeight: 1.8 }}>
            <p>
              Jankalyan Manavadhikar Foundation is an autonomous social and educational initiative. The foundation does not falsely claim official government sponsorship where none has been granted.
            </p>
            <p>
              All grant values and application schedules displayed as placeholders are subject to institutional notifications issued via the official website from time to time.
            </p>
          </div>
        )
      };
    }
  };

  const content = getContent();

  return (
    <div className="section-py" style={{ backgroundColor: '#F8FAFC', minHeight: '80vh' }}>
      <div className="container-narrow">
        <button className="btn btn-outline btn-sm" onClick={() => navigate('/')} style={{ marginBottom: '2rem' }}>
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </button>

        <div className="card" style={{ padding: '3rem' }}>
          <span className="badge badge-navy" style={{ marginBottom: '0.75rem' }}>
            {content.badge}
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.5rem' }}>
            {content.title}
          </h1>

          <div style={{ color: '#334155', fontSize: '1rem' }}>
            {content.text}
          </div>
        </div>
      </div>
    </div>
  );
};
