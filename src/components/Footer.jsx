import React from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, MapPin, ShieldCheck, Award, FileText, ChevronRight, Globe, ExternalLink, Clock } from 'lucide-react';

export const Footer = () => {
  const { lang, setSpecificLanguage, t, navigate, cms } = useApp();

  return (
    <footer className="site-footer no-print">
      <div className="container">
        <div className="footer-grid">
          
          {/* Col 1: Foundation Brand & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <img 
                src="/assets/logo.png" 
                alt="Jankalyan Manavadhikar Foundation" 
                style={{ 
                  width: '54px', 
                  height: '54px', 
                  objectFit: 'contain',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  padding: '2px'
                }} 
              />
              <div>
                <h3 style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 800 }}>
                  {t.brandName}
                </h3>
                <p style={{ color: '#F87171', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t.brandSubtitle}
                </p>
              </div>
            </div>

            <p style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: '1.65', marginBottom: '1.5rem' }}>
              {t.footerAboutDesc}
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.08)', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <ShieldCheck size={16} color="#4ADE80" />
              <span style={{ fontSize: '0.75rem', color: '#E2E8F0', fontWeight: 600 }}>
                {t.govtAffiliationDisclaimer}
              </span>
            </div>
          </div>

          {/* Col 2: Student Services */}
          <div className="footer-col">
            <h4>{t.footerColStudents}</h4>
            <ul className="footer-links">
              <li>
                <button onClick={() => navigate('/apply')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ChevronRight size={14} color="#DC2626" />
                  <span>{t.navApplyNow}</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/track')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ChevronRight size={14} color="#DC2626" />
                  <span>{t.navTrack}</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/student-dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ChevronRight size={14} color="#DC2626" />
                  <span>{t.navStudentLogin}</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/merit-list')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ChevronRight size={14} color="#DC2626" />
                  <span>{lang === 'hi' ? 'मेरिट चयन सूची (Merit List)' : 'Official Merit List'}</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/documents')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ChevronRight size={14} color="#DC2626" />
                  <span>{t.navDocuments}</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/downloads')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ChevronRight size={14} color="#DC2626" />
                  <span>{t.navDownloads}</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/faq')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ChevronRight size={14} color="#DC2626" />
                  <span>{t.navFaq}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Policies & Institutional Guidelines */}
          <div className="footer-col">
            <h4>{t.footerColImportant}</h4>
            <ul className="footer-links">
              <li>
                <button onClick={() => navigate('/scholarship')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ChevronRight size={14} color="#F59E0B" />
                  <span>{t.overviewEligibilityTitle}</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/scholarship')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ChevronRight size={14} color="#F59E0B" />
                  <span>{t.docTitle}</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/grievance')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ChevronRight size={14} color="#F59E0B" />
                  <span>{t.navGrievance}</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/privacy')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ChevronRight size={14} color="#F59E0B" />
                  <span>{t.footerPrivacy}</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/terms')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ChevronRight size={14} color="#F59E0B" />
                  <span>{t.footerTerms}</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/admin')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ChevronRight size={14} color="#F59E0B" />
                  <span>{t.navAdmin}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Contact Info */}
          <div className="footer-col">
            <h4>{t.footerColContact}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <Phone size={18} color="#F87171" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>{lang === 'hi' ? 'मोबाइल हेल्पलाइन' : 'Mobile Helpline'}</div>
                  <a href={`tel:${cms.officialMobile}`} style={{ color: '#FFFFFF', fontWeight: 600 }}>
                    {cms.officialMobile}
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <Phone size={18} color="#F87171" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>{lang === 'hi' ? 'कार्यालय दूरभाष' : 'Office Telephone'}</div>
                  <a href={`tel:${cms.officialTelephone}`} style={{ color: '#FFFFFF', fontWeight: 600 }}>
                    {cms.officialTelephone}
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <Clock size={18} color="#FEF08A" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>{lang === 'hi' ? 'हेल्पलाइन समय' : 'Help Line Hours'}</div>
                  <span style={{ color: '#FEF08A', fontWeight: 600, fontSize: '0.8rem' }}>
                    सुबह 10:00 बजे से शाम 7:00 बजे तक
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <Mail size={18} color="#F87171" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>{lang === 'hi' ? 'आधिकारिक ईमेल' : 'Official Email'}</div>
                  <a href={`mailto:${cms.officialEmail}`} style={{ color: '#FFFFFF', fontWeight: 600, wordBreak: 'break-all' }}>
                    {cms.officialEmail}
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <MapPin size={18} color="#F87171" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>{lang === 'hi' ? 'कार्यालय पता' : 'Office Address'}</div>
                  <span style={{ color: '#E2E8F0', fontStyle: 'italic' }}>
                    {cms.officeAddress}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Bar with Copyright & Legal */}
        <div className="footer-bottom">
          <div>
            © 2026 Jankalyan Manavadhikar Foundation. {t.footerRights}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/privacy')} style={{ color: '#94A3B8', fontSize: '0.8rem' }}>
              {t.footerPrivacy}
            </button>
            <span>•</span>
            <button onClick={() => navigate('/terms')} style={{ color: '#94A3B8', fontSize: '0.8rem' }}>
              {t.footerTerms}
            </button>
            <span>•</span>
            <button onClick={() => navigate('/disclaimer')} style={{ color: '#94A3B8', fontSize: '0.8rem' }}>
              {t.footerDisclaimer}
            </button>
            <span>•</span>
            <button onClick={() => navigate('/faq')} style={{ color: '#94A3B8', fontSize: '0.8rem' }}>
              {t.footerAccessibility}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
