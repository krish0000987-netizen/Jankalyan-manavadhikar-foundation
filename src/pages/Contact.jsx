import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, ShieldCheck } from 'lucide-react';

export const Contact = () => {
  const { lang, t, cms } = useApp();
  const [formSent, setFormSent] = useState(false);
  const [contactData, setContactData] = useState({
    name: '',
    mobile: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    setContactData({ name: '', mobile: '', email: '', subject: '', message: '' });
    setTimeout(() => setFormSent(false), 5000);
  };

  return (
    <div className="section-py" style={{ backgroundColor: '#F8FAFC', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
          <span className="badge badge-navy" style={{ marginBottom: '0.75rem' }}>
            {lang === 'hi' ? 'आधिकारिक संपर्क केंद्र' : 'OFFICIAL CONTACT CENTER'}
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem' }}>
            {lang === 'hi' ? 'हमसे संपर्क करें (Contact Us)' : 'Contact Jankalyan Manavadhikar Foundation'}
          </h1>
          <p style={{ color: '#64748B', fontSize: '1rem' }}>
            {lang === 'hi'
              ? 'छात्रवृत्ति योजना से संबंधित किसी भी पूछताछ हेतु हमारे आधिकारिक संपर्क सूत्रों का उपयोग करें।'
              : 'Official verified communication channels for student, parent, and institutional inquiries.'}
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid-editorial" style={{ maxWidth: '1100px', margin: '0 auto 3.5rem' }}>
          
          {/* Left Column: Official Verified Contacts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div className="card" style={{ padding: '2rem', borderLeft: '5px solid #1E40AF' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                <Phone size={24} color="#1E40AF" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                    {lang === 'hi' ? 'मोबाइल हेल्पलाइन' : 'Mobile Helpline'}
                  </div>
                  <a href={`tel:${cms.officialMobile}`} style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                    {cms.officialMobile}
                  </a>
                  <div style={{ fontSize: '0.75rem', color: '#16A34A', marginTop: '0.2rem', fontWeight: 600 }}>
                    Active on all working days
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                <Phone size={24} color="#1E40AF" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                    {lang === 'hi' ? 'कार्यालय दूरभाष' : 'Office Telephone (Landline)'}
                  </div>
                  <a href={`tel:${cms.officialTelephone}`} style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                    {cms.officialTelephone}
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                <Mail size={24} color="#1E40AF" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                    {lang === 'hi' ? 'आधिकारिक ईमेल' : 'Official Email Address'}
                  </div>
                  <a href={`mailto:${cms.officialEmail}`} style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1E40AF', wordBreak: 'break-all' }}>
                    {cms.officialEmail}
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <MapPin size={24} color="#DC2626" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                    {lang === 'hi' ? 'कार्यालय पता' : 'Office Address'}
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginTop: '0.2rem' }}>
                    <span className="editable-field">{cms.officeAddress}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                    Editable via Admin CMS
                  </div>
                </div>
              </div>
            </div>

            {/* Working Hours Box */}
            <div className="card" style={{ padding: '1.5rem', backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Clock size={20} color="#1E40AF" />
                <div>
                  <div style={{ fontWeight: 700, color: '#1E3A8A', fontSize: '0.95rem' }}>
                    {lang === 'hi' ? 'कार्यालय कार्य समय' : 'Office Operating Hours'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#1E40AF' }}>
                    Monday – Saturday: 10:00 AM to 05:00 PM (Closed on Sundays & Gazetted Holidays)
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
              {lang === 'hi' ? 'संदेश भेजें' : 'Send an Official Message'}
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
              {lang === 'hi' ? 'हमारी सहायता टीम जल्द से जल्द आपसे संपर्क करेगी।' : 'Fill out the details below and our team will get in touch.'}
            </p>

            {formSent && (
              <div style={{ backgroundColor: '#DCFCE7', border: '1px solid #BBF7D0', padding: '1rem', borderRadius: '10px', color: '#166534', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <CheckCircle size={18} />
                <span>Your message has been sent successfully.</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label required">Your Name</label>
                  <input 
                    type="text"
                    className="form-control"
                    required
                    value={contactData.name}
                    onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">Mobile Number</label>
                  <input 
                    type="tel"
                    className="form-control"
                    maxLength={10}
                    required
                    value={contactData.mobile}
                    onChange={(e) => setContactData({ ...contactData, mobile: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email"
                  className="form-control"
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label required">Subject</label>
                <input 
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Scholarship Application Query"
                  value={contactData.subject}
                  onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label required">Message</label>
                <textarea 
                  className="form-control"
                  rows={4}
                  required
                  value={contactData.message}
                  onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                <Send size={18} />
                <span>Send Message</span>
              </button>
            </form>
          </div>

        </div>

        {/* Location Map Placeholder / Embed Container */}
        <div className="card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#F8FAFC', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <MapPin size={22} color="#DC2626" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
              Foundation Regional Location Map
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.5rem' }}>
            Location: <span className="editable-field">{cms.officeAddress}</span> (Configurable via Admin CMS)
          </p>

          <div style={{
            width: '100%',
            height: '280px',
            borderRadius: '12px',
            backgroundColor: '#E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #CBD5E1',
            color: '#64748B',
            fontSize: '0.95rem',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <MapPin size={36} color="#1E40AF" />
            <div>Interactive Google Map Embed Area</div>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{cms.officeAddress}</div>
          </div>
        </div>

      </div>
    </div>
  );
};
