import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, HelpCircle, ArrowRight, Phone, Mail } from 'lucide-react';

export const Faq = () => {
  const { lang, t, navigate, cms } = useApp();
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState(null);

  const filteredFaqs = cms.faqs.filter(f => {
    const q = search.toLowerCase();
    const qEn = f.qEn.toLowerCase();
    const qHi = f.qHi.toLowerCase();
    const aEn = f.aEn.toLowerCase();
    const aHi = f.aHi.toLowerCase();
    return qEn.includes(q) || qHi.includes(q) || aEn.includes(q) || aHi.includes(q);
  });

  return (
    <div className="section-py" style={{ backgroundColor: '#F8FAFC', minHeight: '80vh' }}>
      <div className="container-narrow">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-yellow" style={{ marginBottom: '0.75rem' }}>
            {lang === 'hi' ? 'सामान्य प्रश्नोत्तरी' : 'FREQUENTLY ASKED QUESTIONS'}
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem' }}>
            {t.faqTitle}
          </h1>
          <p style={{ color: '#64748B', fontSize: '1rem' }}>
            {lang === 'hi' 
              ? 'छात्रवृत्ति आवेदन, दस्तावेज़ संवीक्षा, प्रत्यक्ष अंतरण एवं प्रक्रिया संबंधी सभी प्रश्नों के समाधान।' 
              : 'Detailed answers to common questions about applications, documents, verification, and DBT.'}
          </p>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
          <Search size={20} color="#64748B" style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            className="form-control"
            style={{ paddingLeft: '3.25rem', fontSize: '1.05rem', height: '54px' }}
            placeholder={lang === 'hi' ? 'प्रश्न या कीवर्ड खोजें (उदा. दस्तावेज़, राशि, स्थिति)...' : 'Search question or topic (e.g. documents, fee, tracking)...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* FAQ Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3.5rem' }}>
          {filteredFaqs.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div 
                key={item.id}
                className="card"
                style={{
                  padding: '1.5rem',
                  backgroundColor: isOpen ? '#FFFFFF' : '#FFFFFF',
                  borderColor: isOpen ? '#2563EB' : '#E2E8F0',
                  boxShadow: isOpen ? '0 10px 25px rgba(37, 99, 235, 0.08)' : 'var(--shadow-card)'
                }}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: '#0F172A'
                  }}
                >
                  <span style={{ paddingRight: '1rem' }}>
                    {lang === 'hi' ? item.qHi : item.qEn}
                  </span>
                  <span style={{ fontSize: '1.5rem', color: '#1E40AF', lineHeight: 1 }}>
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9', color: '#334155', fontSize: '0.975rem', lineHeight: 1.75 }}>
                    {lang === 'hi' ? item.aHi : item.aEn}
                  </div>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <HelpCircle size={40} color="#94A3B8" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.15rem', color: '#0F172A', fontWeight: 700 }}>
                {lang === 'hi' ? 'कोई मेल खाता प्रश्न नहीं मिला' : 'No matching questions found'}
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                {lang === 'hi' ? 'कृपया हमारी सहायता टीम से सीधे संपर्क करें।' : 'Please reach out to our dedicated support desk directly.'}
              </p>
            </div>
          )}
        </div>

        {/* Still Have Questions Box */}
        <div className="card" style={{ backgroundColor: '#1B2A4E', color: '#FFFFFF', padding: '2.5rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
            {lang === 'hi' ? 'क्या आपका प्रश्न यहां सूचीबद्ध नहीं है?' : 'Still have unanswered questions?'}
          </h3>
          <p style={{ color: '#CBD5E1', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
            {lang === 'hi' ? 'हमारी हेल्पलाइन पर संपर्क करें अथवा एक ऑनलाइन शिकायत दर्ज करें।' : 'Contact our official helpdesk on all working days or raise an online support ticket.'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a href={`tel:${cms.officialMobile}`} className="btn btn-primary">
              <Phone size={16} />
              <span>Call Helpline ({cms.officialMobile})</span>
            </a>
            <button className="btn btn-outline-white" onClick={() => navigate('/grievance')}>
              <span>{t.ctaGrievanceBtn}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
