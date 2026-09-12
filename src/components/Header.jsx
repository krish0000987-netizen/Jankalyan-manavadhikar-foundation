import React, { useState, useEffect, useRef } from 'react';
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
  const dropdownRef = useRef(null);

  // Compact header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    { label: lang === 'hi' ? 'आवेदन ट्रैक' : t.navTrack, route: '/track' },
    { label: t.navDocuments, route: '/documents' },
    { label: t.navDownloads, route: '/downloads' },
    { label: lang === 'hi' ? 'शिकायत' : t.navGrievance, route: '/grievance' },
    { label: lang === 'hi' ? 'FAQ' : t.navFaq, route: '/faq' },
    { label: lang === 'hi' ? 'संपर्क' : t.navContact, route: '/contact' }
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
      {/* Top Announcement & Utility Bar */}
      <div className="announcement-bar no-print">
        <div className="container-wide">
          <div className="announcement-content">
            
            {/* Left: Announcement Ticker */}
            <div className="announcement-ticker">
              <span className="badge badge-yellow" style={{ fontSize: '0.68rem', padding: '0.15rem 0.55rem', flexShrink: 0 }}>
                <Volume2 size={11} />
                {t.announcementLabel}
              </span>
              <span style={{ fontSize: '0.825rem', color: '#E2E8F0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {lang === 'hi' ? activeAnnouncement?.hi : activeAnnouncement?.en}
              </span>
            </div>

            {/* Right: Helpline Contacts + Language Switcher + Role Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexShrink: 0 }} className="hide-mobile">
              <a 
                href={`tel:${cms.officialMobile}`} 
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#CBD5E1', fontSize: '0.78rem' }}
                title="Helpline Mobile"
              >
                <Phone size={12} color="#FEF08A" />
                <span>{cms.officialMobile}</span>
              </a>

              <a 
                href={`mailto:${cms.officialEmail}`} 
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#CBD5E1', fontSize: '0.78rem' }}
                title="Official Email"
              >
                <Mail size={12} color="#FEF08A" />
                <span>{cms.officialEmail}</span>
              </a>

              {/* Language Switcher in Top Bar */}
              <div className="lang-switcher">
                <button
                  className={`lang-btn ${lang === 'hi' ? 'active' : ''}`}
                  onClick={() => setSpecificLanguage('hi')}
                  title="हिंदी भाषा चुनें"
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

              {/* Role Switcher Gateway Dropdown in Top Bar */}
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button 
                  className="btn btn-outline-white btn-sm"
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  style={{ 
                    padding: '0.2rem 0.6rem', 
                    fontSize: '0.75rem', 
                    gap: '0.3rem', 
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    borderColor: 'rgba(255,255,255,0.25)' 
                  }}
                >
                  <Shield size={12} color="#FEF08A" />
                  <span>
                    {roles.find(r => r.id === authRole)?.[lang === 'hi' ? 'labelHi' : 'labelEn'] || 'Portal'}
                  </span>
                  <ChevronDown size={12} />
                </button>

                {roleDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '120%',
                    right: 0,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
                    border: '1px solid #E2E8F0',
                    width: '230px',
                    padding: '0.5rem',
                    zIndex: 300
                  }}>
                    <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', borderBottom: '1px solid #F1F5F9' }}>
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
                          padding: '0.55rem 0.75rem',
                          fontSize: '0.825rem',
                          textAlign: 'left',
                          borderRadius: '6px',
                          color: authRole === r.id ? '#1E40AF' : '#1E293B',
                          backgroundColor: authRole === r.id ? '#EFF6FF' : 'transparent',
                          fontWeight: authRole === r.id ? 700 : 500
                        }}
                      >
                        <span>{lang === 'hi' ? r.labelHi : r.labelEn}</span>
                        {authRole === r.id && <CheckCircle size={14} color="#2563EB" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className={`site-header ${isScrolled ? 'compact' : ''}`}>
        <div className="container-wide">
          <div className="header-inner">
            
            {/* Left: Official Foundation Logo & Full Undistorted Title */}
            <div 
              className="brand-identity" 
              onClick={() => navigate('/')}
              title="Jankalyan Manavadhikar Foundation"
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

            {/* Center: Clean Navigation Menu (Desktop) */}
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

            {/* Right: Student Login + Apply Now Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
              
              {/* Student Login or Admin button */}
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
                <User size={14} />
                <span>{authRole === 'admin' ? t.navAdmin : t.navStudentLogin}</span>
              </button>

              {/* Apply Now Primary CTA Button */}
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate('/apply')}
                id="header-apply-btn"
              >
                <Sparkles size={14} />
                <span>{t.navApplyNow}</span>
              </button>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                className="show-mobile-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{
                  padding: '0.5rem',
                  display: 'none',
                  color: '#1E293B',
                  backgroundColor: 'transparent'
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid #F1F5F9', marginBottom: '1rem' }}>
              <div className="lang-switcher">
                <button
                  className={`lang-btn ${lang === 'hi' ? 'active' : ''}`}
                  onClick={() => setSpecificLanguage('hi')}
                >
                  हिंदी
                </button>
                <button
                  className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                  onClick={() => setSpecificLanguage('en')}
                >
                  English
                </button>
              </div>

              <span className="badge badge-blue">
                {roles.find(r => r.id === authRole)?.[lang === 'hi' ? 'labelHi' : 'labelEn']}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
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
                    fontSize: '0.95rem',
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
