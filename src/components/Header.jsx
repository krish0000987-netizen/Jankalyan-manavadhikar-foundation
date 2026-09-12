import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Phone, 
  Mail, 
  Globe, 
  User, 
  Sparkles, 
  Menu, 
  X, 
  Shield, 
  FileText, 
  CheckCircle, 
  ChevronRight,
  ChevronDown,
  Volume2
} from 'lucide-react';

export const Header = () => {
  const { lang, setSpecificLanguage, t, currentRoute, navigate, cms, authRole, setAuthRole } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  // Compact header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cycle announcements every 5s
  useEffect(() => {
    if (!cms.announcements || cms.announcements.length === 0) return;
    const timer = setInterval(() => {
      setAnnouncementIndex(prev => (prev + 1) % cms.announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [cms.announcements]);

  const activeAnnouncement = cms.announcements?.[announcementIndex] || cms.announcements?.[0];

  const navLinks = [
    { label: t.navHome, route: '/' },
    { label: t.navAbout, route: '/about' },
    { label: t.navScholarship, route: '/scholarship' },
    { label: t.navTrack, route: '/track' },
    { label: t.navDocuments, route: '/documents' },
    { label: t.navDownloads, route: '/downloads' },
    { label: t.navGrievance, route: '/grievance' },
    { label: t.navFaq, route: '/faq' },
    { label: t.navContact, route: '/contact' }
  ];

  const roles = [
    { id: 'guest', labelEn: 'Public View', labelHi: 'सामान्य दृश्य' },
    { id: 'student', labelEn: 'Student Portal', labelHi: 'विद्यार्थी पोर्टल' },
    { id: 'district', labelEn: 'District Coordinator', labelHi: 'जिला समन्वयक' },
    { id: 'block', labelEn: 'Block Coordinator', labelHi: 'ब्लॉक समन्वयक' },
    { id: 'institution', labelEn: 'School / College', labelHi: 'विद्यालय / कॉलेज' },
    { id: 'center', labelEn: 'Online Center (CSC)', labelHi: 'ऑनलाइन केंद्र' },
    { id: 'admin', labelEn: 'Super Admin', labelHi: 'सुपर एडमिन' }
  ];

  const handleRoleSelect = (roleId) => {
    setAuthRole(roleId);
    setRoleDropdownOpen(false);
    if (roleId === 'admin' || roleId === 'district' || roleId === 'block' || roleId === 'institution' || roleId === 'center') {
      navigate('/admin');
    } else if (roleId === 'student') {
      navigate('/student-dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="announcement-bar no-print">
        <div className="container">
          <div className="announcement-content">
            <div className="announcement-ticker">
              <span className="badge badge-yellow" style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem' }}>
                <Volume2 size={12} />
                {t.announcementLabel}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#E2E8F0' }}>
                {lang === 'hi' ? activeAnnouncement?.hi : activeAnnouncement?.en}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="hide-mobile">
              <a 
                href={`tel:${cms.officialMobile}`} 
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#CBD5E1', fontSize: '0.8rem' }}
              >
                <Phone size={13} color="#FEF08A" />
                <span>{cms.officialMobile}</span>
              </a>
              <a 
                href={`mailto:${cms.officialEmail}`} 
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#CBD5E1', fontSize: '0.8rem' }}
              >
                <Mail size={13} color="#FEF08A" />
                <span>{cms.officialEmail}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className={`site-header ${isScrolled ? 'compact' : ''}`}>
        <div className="container-wide">
          <div className="header-inner">
            
            {/* Left: Official Foundation Logo & Title */}
            <div 
              className="brand-identity" 
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer' }}
            >
              <img 
                src="/assets/logo.png" 
                alt="Jankalyan Manavadhikar Foundation Official Logo" 
                className="brand-logo-img"
              />
              <div className="brand-text">
                <h1>{t.brandName}</h1>
                <p>{t.brandSubtitle}</p>
              </div>
            </div>

            {/* Center Navigation Links (Desktop) */}
            <nav className="hide-mobile">
              <ul className="nav-menu">
                {navLinks.map((item) => (
                  <li key={item.route}>
                    <button
                      onClick={() => navigate(item.route)}
                      className={`nav-link ${currentRoute === item.route ? 'active' : ''}`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right Actions: Language Switcher & Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              
              {/* Language Switcher */}
              <div className="lang-switcher">
                <button
                  className={`lang-btn ${lang === 'hi' ? 'active' : ''}`}
                  onClick={() => setSpecificLanguage('hi')}
                  title="हिंदी में बदलें"
                >
                  हिंदी
                </button>
                <button
                  className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                  onClick={() => setSpecificLanguage('en')}
                  title="Switch to English"
                >
                  English
                </button>
              </div>

              {/* Role Switcher Gateway Dropdown */}
              <div style={{ position: 'relative' }} className="hide-mobile">
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  style={{ gap: '0.35rem' }}
                >
                  <Shield size={14} color="#1E40AF" />
                  <span>
                    {roles.find(r => r.id === authRole)?.[lang === 'hi' ? 'labelHi' : 'labelEn'] || 'Portal'}
                  </span>
                  <ChevronDown size={14} />
                </button>

                {roleDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    border: '1px solid #E2E8F0',
                    width: '230px',
                    padding: '0.5rem',
                    zIndex: 200
                  }}>
                    <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', borderBottom: '1px solid #F1F5F9' }}>
                      {lang === 'hi' ? 'भूमिका चयन (पोर्टल गेटवे)' : 'SELECT PORTAL / ROLE'}
                    </div>
                    {roles.map(r => (
                      <button
                        key={r.id}
                        onClick={() => handleRoleSelect(r.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          padding: '0.6rem 0.8rem',
                          fontSize: '0.85rem',
                          textAlign: 'left',
                          borderRadius: '8px',
                          color: authRole === r.id ? '#1E40AF' : '#1E293B',
                          backgroundColor: authRole === r.id ? '#EFF6FF' : 'transparent',
                          fontWeight: authRole === r.id ? 600 : 500
                        }}
                      >
                        <span>{lang === 'hi' ? r.labelHi : r.labelEn}</span>
                        {authRole === r.id && <CheckCircle size={14} color="#2563EB" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Student Login or Dashboard button */}
              <button
                className="btn btn-secondary btn-sm hide-mobile"
                onClick={() => {
                  if (authRole === 'admin') {
                    navigate('/admin');
                  } else {
                    navigate('/student-dashboard');
                  }
                }}
              >
                <User size={15} />
                <span>{authRole === 'admin' ? t.navAdmin : t.navStudentLogin}</span>
              </button>

              {/* Apply Now Primary CTA */}
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate('/apply')}
              >
                <Sparkles size={15} />
                <span>{t.navApplyNow}</span>
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                className="show-mobile-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{
                  padding: '0.5rem',
                  display: 'none',
                  color: '#1E293B'
                }}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '2px solid #E2E8F0',
            padding: '1.25rem 1.5rem',
            boxShadow: '0 20px 30px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {navLinks.map((item) => (
                <button
                  key={item.route}
                  onClick={() => {
                    navigate(item.route);
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    textAlign: 'left',
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: '8px',
                    color: currentRoute === item.route ? '#DC2626' : '#1E293B',
                    backgroundColor: currentRoute === item.route ? '#FEE2E2' : 'transparent'
                  }}
                >
                  <span>{item.label}</span>
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                className="btn btn-secondary"
                style={{ width: '100%' }}
                onClick={() => {
                  navigate('/student-dashboard');
                  setMobileMenuOpen(false);
                }}
              >
                <User size={16} />
                <span>{t.navStudentLogin}</span>
              </button>
              <button
                className="btn btn-outline"
                style={{ width: '100%' }}
                onClick={() => {
                  navigate('/admin');
                  setMobileMenuOpen(false);
                }}
              >
                <Shield size={16} />
                <span>{t.navAdmin}</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
