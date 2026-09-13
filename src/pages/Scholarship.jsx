import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  CreditCard, 
  Calendar, 
  Clock, 
  GraduationCap, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle,
  Building,
  HelpCircle,
  ShieldCheck,
  Award
} from 'lucide-react';

export const Scholarship = () => {
  const { lang, t, navigate, cms } = useApp();

  return (
    <div>
      {/* 1. Scholarship Hero */}
      <section style={{ backgroundColor: '#1B2A4E', color: '#FFFFFF', padding: '5rem 0', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <div className="grid-editorial" style={{ alignItems: 'center' }}>
            <div>
              <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#FEF08A', marginBottom: '1rem' }}>
                {lang === 'hi' ? 'आधिकारिक छात्रवृत्ति योजना 2026-27' : 'OFFICIAL SCHOLARSHIP YOJNA 2026-27'}
              </span>
              <h1 style={{ fontSize: '2.85rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1.25rem', lineHeight: 1.2 }}>
                {lang === 'hi' ? 'जनकल्याण मानवाधिकार फाउंडेशन छात्रवृत्ति योजना' : 'Jankalyan Manavadhikar Foundation Scholarship Scheme'}
              </h1>
              <p style={{ color: '#CBD5E1', fontSize: '1.15rem', lineHeight: 1.65, marginBottom: '2rem' }}>
                {lang === 'hi'
                  ? 'योग्य एवं मेधावी छात्र-छात्राओं के उज्ज्वल भविष्य हेतु प्रत्यक्ष वित्तीय सहायता। संपूर्ण डिजिटल एवं पारदर्शी आवेदन प्रक्रिया।'
                  : 'Direct financial scholastic aid to support meritorious students in fulfilling their educational potential through a verifiable, transparent digital portal.'}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/apply')}>
                  <Sparkles size={18} />
                  <span>{t.heroCtaApply}</span>
                </button>
                <button className="btn btn-outline-white btn-lg" onClick={() => navigate('/track')}>
                  <span>{t.heroCtaTrack}</span>
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                backgroundColor: 'rgba(255,255,255,0.06)', 
                backdropFilter: 'blur(8px)',
                borderRadius: '20px', 
                padding: '2.5rem', 
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
              }}>
                <Award size={48} color="#FEF08A" style={{ marginBottom: '1rem' }} />
                <div style={{ fontSize: '0.85rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t.overviewAmountTitle}
                </div>
                <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#FFFFFF', margin: '0.5rem 0' }}>
                  <span className="editable-field" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF' }}>
                    {cms.scholarshipAmount}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '1.5rem' }}>
                  {t.overviewAmountDesc}
                </div>

                <button 
                  className="btn btn-gold" 
                  style={{ width: '100%' }}
                  onClick={() => navigate('/apply')}
                >
                  <Sparkles size={16} />
                  <span>{t.heroCtaApply}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2 & 3. Objective & Amount Details */}
      <section className="section-py" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div>
              <span className="badge badge-blue" style={{ marginBottom: '1rem' }}>
                {t.objBadge}
              </span>
              <h2 style={{ fontSize: '2.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem' }}>
                {lang === 'hi' ? 'योजना का उद्देश्य एवं वित्तीय सहायता' : 'Scheme Objectives & Financial Support'}
              </h2>
              <p style={{ color: '#334155', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                {t.objP1}
              </p>

              <div className="card" style={{ backgroundColor: '#F8FAFC', padding: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid #1E40AF' }}>
                <h4 style={{ fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>
                  {lang === 'hi' ? 'छात्रवृत्ति राशि (Scholarship Amount)' : 'Scholarship Grant Value'}
                </h4>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1B2A4E', margin: '0.4rem 0' }}>
                  <span className="editable-field">{cms.scholarshipAmount}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  {lang === 'hi'
                    ? 'स्वीकृत राशि विद्यार्थी के आधार-लिंक्ड बैंक खाते में प्रत्यक्ष लाभ अंतरण (DBT) द्वारा अंतरित की जाती है।'
                    : 'Transferred directly to the verified Aadhaar-linked bank account of the beneficiary with a valid banking UTR.'}
                </p>
              </div>

              <button className="btn btn-primary" onClick={() => navigate('/apply')}>
                <span>{t.heroCtaApply}</span>
                <ArrowRight size={16} />
              </button>
            </div>

            <div>
              <img 
                src="/assets/hero_slide_4.jpg" 
                alt="Academic support" 
                style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '18px', border: '1px solid #E2E8F0', boxShadow: '0 16px 36px rgba(0,0,0,0.08)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4, 5 & 6. Eligibility, Categories & Academic Requirements */}
      <section className="section-py" style={{ backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
            <span className="badge badge-navy" style={{ marginBottom: '0.75rem' }}>
              {t.whoBadge}
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem' }}>
              {lang === 'hi' ? 'पात्रता मापदंड एवं श्रेणियां' : 'Eligibility & Categories'}
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem' }}>
              {lang === 'hi' 
                ? 'प्रशासन द्वारा निर्धारित पात्रता नियम (CMS द्वारा संपादन योग्य)' 
                : 'Criteria configured and editable via Foundation CMS'}
            </p>
          </div>

          <div className="grid-3">
            
            <div className="card">
              <GraduationCap size={28} color="#1E40AF" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem' }}>
                {lang === 'hi' ? 'शैक्षणिक योग्यता' : 'Academic Standards'}
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, marginBottom: '1rem' }}>
                {lang === 'hi'
                  ? 'विद्यार्थी मान्यता प्राप्त विद्यालय अथवा विश्वविद्यालय में नियमित रूप से अध्ययनरत होना चाहिए तथा पिछली परीक्षा उत्तीर्ण होना अनिवार्य है।'
                  : 'Candidate must be a regularly enrolled student in a recognized institution with satisfactory qualifying marks.'}
              </p>
              <div style={{ fontSize: '0.85rem', color: '#1E40AF', fontWeight: 600 }}>
                <span className="editable-field">{cms.eligibilityCriteria}</span>
              </div>
            </div>

            <div className="card">
              <Building size={28} color="#DC2626" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem' }}>
                {lang === 'hi' ? 'सामाजिक श्रेणियां' : 'Social Categories'}
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, marginBottom: '1rem' }}>
                {lang === 'hi'
                  ? 'सामान्य, अनुसूचित जाति (SC), अनुसूचित जनजाति (ST), अन्य पिछड़ा वर्ग (OBC) तथा आर्थिक रूप से कमजोर वर्ग।'
                  : 'Open for General, SC, ST, OBC, and need-based economically weaker sections as configured by the foundation.'}
              </p>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span className="badge badge-navy">General</span>
                <span className="badge badge-navy">SC</span>
                <span className="badge badge-navy">ST</span>
                <span className="badge badge-navy">OBC</span>
              </div>
            </div>

            <div className="card">
              <CreditCard size={28} color="#D97706" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem' }}>
                {lang === 'hi' ? 'आय व निवास मापदंड' : 'Income & Domicile'}
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, marginBottom: '1rem' }}>
                {lang === 'hi'
                  ? 'विद्यार्थी भारतीय नागरिक होना चाहिए एवं आवश्यकता-आधारित वर्ग हेतु सक्षम अधिकारी द्वारा जारी आय प्रमाण पत्र संलग्न करना होगा।'
                  : 'Must be an Indian resident. Need-based applications require an income certificate issued by a competent authority.'}
              </p>
              <div style={{ fontSize: '0.85rem', color: '#D97706', fontWeight: 600 }}>
                {lang === 'hi' ? 'सत्यापन अनिवार्य' : 'Scrutiny Mandatory'}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7 & 8. Important Dates & Required Documents */}
      <section className="section-py" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div className="grid-editorial" style={{ alignItems: 'center' }}>
            <div>
              <span className="badge badge-red" style={{ marginBottom: '1rem' }}>
                {lang === 'hi' ? 'महत्वपूर्ण तिथियां' : 'IMPORTANT DATES'}
              </span>
              <h2 style={{ fontSize: '2.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.5rem' }}>
                {lang === 'hi' ? 'आवेदन समय-सारणी' : 'Application Schedule'}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <Calendar size={28} color="#1E40AF" />
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>{t.overviewStartTitle}</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                      <span className="editable-field">{cms.applicationStartDate}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', backgroundColor: '#FEF2F2', borderRadius: '12px', border: '1px solid #FECACA' }}>
                  <Clock size={28} color="#DC2626" />
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#991B1B', fontWeight: 600 }}>{t.overviewLastTitle}</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#991B1B' }}>
                      <span className="editable-field">{cms.applicationLastDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="btn btn-primary btn-lg" onClick={() => navigate('/apply')}>
                <Sparkles size={18} />
                <span>{t.heroCtaApply}</span>
              </button>
            </div>

            <div>
              <span className="badge badge-navy" style={{ marginBottom: '1rem' }}>
                {t.docBadge}
              </span>
              <h2 style={{ fontSize: '2.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.5rem' }}>
                {t.docTitle}
              </h2>

              <div className="grid-2" style={{ gap: '0.75rem' }}>
                <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>{t.doc1}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{t.doc1Sub}</div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>{t.doc2}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{t.doc2Sub}</div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>{t.doc3}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{t.doc3Sub}</div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>{t.doc4}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{t.doc4Sub}</div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>{t.doc5}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{t.doc5Sub}</div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#EFF6FF', borderRadius: '10px', border: '1px solid #BFDBFE' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1E40AF' }}>{t.doc6} & {t.doc7}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Income & Caste (if applicable)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9, 10 & 11. Selection, Verification & Release Process */}
      <section className="section-py" style={{ backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
            <span className="badge badge-blue" style={{ marginBottom: '0.75rem' }}>
              {lang === 'hi' ? 'सत्यापन एवं संवितरण' : 'VERIFICATION & DISBURSEMENT'}
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A' }}>
              {lang === 'hi' ? 'पारदर्शी संवीक्षा एवं भुगतान प्रक्रिया' : 'Transparent Selection Mechanism'}
            </h2>
          </div>

          <div className="grid-3">
            
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E40AF', marginBottom: '0.75rem' }}>
                चरण 1: दस्तावेज़ संवीक्षा
              </div>
              <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.65 }}>
                {lang === 'hi'
                  ? 'अपलोड किए गए सभी दस्तावेज़ों की प्राथमिक जांच ऑनलाइन पोर्टल पर अधिकृत समन्वयकों द्वारा की जाती है।'
                  : 'Initial document integrity check performed online by designated regional coordinators.'}
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#D97706', marginBottom: '0.75rem' }}>
                चरण 2: समिति अनुमोदन
              </div>
              <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.65 }}>
                {lang === 'hi'
                  ? 'संवीक्षा उपरांत पात्र विद्यार्थियों की सूची फाउंडेशन मूल्यांकन समिति द्वारा अनुमोदित की जाती है।'
                  : 'Qualified applicants are reviewed and formally approved by the Foundation Scrutiny Board.'}
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16A34A', marginBottom: '0.75rem' }}>
                चरण 3: प्रत्यक्ष बैंक अंतरण
              </div>
              <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.65 }}>
                {lang === 'hi'
                  ? 'स्वीकृत राशि सीधे बैंक खाते में जमा कर दी जाती है और विद्यार्थी को यूटीआर नंबर प्रदान किया जाता है।'
                  : 'Approved scholarship amount is credited directly to the student’s bank account with unique UTR reference.'}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 12 & 13. Important Instructions & Final Apply CTA */}
      <section className="section-py" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container-narrow">
          <div style={{ padding: '2.5rem', backgroundColor: '#FFFBEB', borderRadius: '16px', border: '1px solid #FCD34D', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <AlertTriangle size={24} color="#D97706" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#92400E' }}>
                {lang === 'hi' ? 'महत्वपूर्ण निर्देश (Important Instructions)' : 'Important Application Instructions'}
              </h3>
            </div>
            <ul style={{ paddingLeft: '1.5rem', color: '#78350F', fontSize: '0.95rem', lineHeight: 1.8 }}>
              <li>{lang === 'hi' ? 'आवेदन करते समय मोबाइल नंबर सही दर्ज करें, क्योंकि सभी सूचनाएं एवं ओटीपी इसी पर भेजे जाएंगे।' : 'Ensure registered mobile number is active; all OTPs and status alerts will be delivered to it.'}</li>
              <li>{lang === 'hi' ? 'बैंक खाता अनिवार्य रूप से विद्यार्थी के स्वयं के नाम से होना चाहिए तथा आधार से लिंक होना चाहिए।' : 'Bank account must be strictly in the student’s name and seeded with Aadhaar for DBT.'}</li>
              <li>{lang === 'hi' ? 'अस्पष्ट अथवा फर्जी दस्तावेज़ अपलोड करने पर आवेदन तत्काल निरस्त किया जाएगा।' : 'Illegible or fraudulent documents will result in immediate disqualification.'}</li>
              <li>{lang === 'hi' ? 'आवेदन पूर्ण करने के पश्चात प्राप्त आधिकारिक रसीद का प्रिंट अवश्य सुरक्षित रखें।' : 'Download and preserve your printed Application Receipt upon submission.'}</li>
            </ul>
          </div>

          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
              {lang === 'hi' ? 'अपने उज्ज्वल भविष्य के लिए आज ही आवेदन करें' : 'Ready to Apply for Scholarship?'}
            </h2>
            <p style={{ color: '#64748B', fontSize: '1.05rem', marginBottom: '2rem' }}>
              {lang === 'hi' ? 'सरल 8-चरणीय ऑनलाइन आवेदन प्रक्रिया पूर्ण करें' : 'Complete the streamlined 8-step digital application form.'}
            </p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/apply')}>
              <Sparkles size={20} />
              <span>{t.heroCtaApply}</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
