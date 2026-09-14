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

  // Clean, perfectly proportioned links for desktop horizontal header bar
  const navLinks = [
    { label: t.navHome, route: '/' },
    { label: lang === 'hi' ? 'हमारे बारे में' : 'About', route: '/about' },
    { 
      label: lang === 'hi' ? 'छात्रवृत्ति योजना 2026' : 'Scholarship 2026', 
      route: '/scholarship',
      badge: '2026'
    },
    { label: lang === 'hi' ? 'आवेदन ट्रैक' : 'Track Status', route: '/track' },
    { label: lang === 'hi' ? 'दस्तावेज़' : 'Documents', route: '/documents' },
    { label: lang === 'hi' ? 'डाउनलोड' : 'Downloads', route: '/downloads' },
    { label: lang === 'hi' ? 'शिकायत' : 'Grievance', route: '/grievance' },
    { label: 'FAQ', route: '/faq' },
    { label: lang === 'hi' ? 'संपर्क' : 'Contact', route: '/contact' }
  ];

  // Full detailed links for mobile slide-out drawer
  const mobileNavLinks = [
    { label: t.navHome, route: '/' },
    { label: t.navAbout, route: '/about' },
    { label: lang === 'hi' ? '🌟 छात्रवृत्ति योजना 2026 (अंतिम राउंड)' : '🌟 Scholarship Yojna 2026 (Last Round)', route: '/scholarship' },
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
    setRoleDropdownOpen(false);
    if (roleId === 'student') {
      navigate('/student-login');
    } else if (roleId === 'institution') {
      navigate('/school-login');
    } else if (roleId === 'district') {
      navigate('/district-login');
    } else if (roleId === 'block') {
      navigate('/block-login');
    } else if (roleId === 'center') {
      navigate('/login');
    } else if (roleId === 'admin') {
      navigate('/admin/login');
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
              <span className="badge badge-yellow ticker-badge">
                <Volume2 size={11} />
                <span className="ticker-label-text">{t.announcementLabel}</span>
              </span>
              <span className="ticker-text">
                {lang === 'hi' ? activeAnnouncement?.hi : activeAnnouncement?.en}
              </span>
            </div>

            {/* Right: Helpline Contacts + Language Switcher + Role Selector */}
            <div className="announcement-actions">
              <div className="announcement-contacts hide-tablet-down">
                <a 
                  href={`tel:${cms.officialMobile}`} 
                  className="announcement-link"
                  title="Helpline Mobile"
                >
                  <Phone size={12} color="#FEF08A" />
                  <span>{cms.officialMobile}</span>
                </a>

                <a 
                  href={`mailto:${cms.officialEmail}`} 
                  className="announcement-link"
                  title="Official Email"
                >
                  <Mail size={12} color="#FEF08A" />
                  <span>{cms.officialEmail}</span>
                </a>
              </div>

              {/* Language Switcher in Top Bar (Always available on Desktop & Mobile) */}
              <div className="lang-switcher">
                <button
                  className={`lang-btn ${lang === 'hi' ? 'active' : ''}`}
                  onClick={() => setSpecificLanguage('hi')}
                  title="हिंदी भाषा चुनें"
                  aria-label="Switch to Hindi"
                >
                  हिंदी
                </button>
                <button
                  className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                  onClick={() => setSpecificLanguage('en')}
                  title="Switch to English"
                  aria-label="Switch to English"
                >
                  English
                </button>
              </div>

              {/* Role Switcher Gateway Dropdown in Top Bar */}
              <div style={{ position: 'relative' }} ref={dropdownRef} className="hide-tablet-down">
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
                    <div style={{ borderTop: '1px solid #F1F5F9', marginTop: '0.4rem', paddingTop: '0.4rem' }}>
                      <button
                        onClick={() => {
                          setRoleDropdownOpen(false);
                          navigate('/admin/login');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          width: '100%',
                          padding: '0.55rem 0.75rem',
                          fontSize: '0.8rem',
                          color: '#DC2626',
                          fontWeight: 700,
                          borderRadius: '6px',
                          backgroundColor: '#FEF2F2'
                        }}
                      >
                        <Shield size={14} color="#DC2626" />
                        <span>{lang === 'hi' ? 'अधिकारी लॉगिन (Password)' : 'Official Staff Login'}</span>
                      </button>
                    </div>
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
            
            {/* Left: Official Foundation Logo & Responsive Brand Heading */}
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
                <h1 className="brand-heading">{t.brandName}</h1>
                <p className="brand-subheading">{t.brandSubtitle}</p>
              </div>
            </div>

            {/* Center: Clean Navigation Menu (Desktop >= 1160px) */}
            <nav className="desktop-nav">
              <ul className="nav-menu">
                {navLinks.map((item) => (
                  <li key={item.route}>
                    <button
                      onClick={() => navigate(item.route)}
                      className={`nav-link ${currentRoute === item.route || (item.route === '/scholarship' && currentRoute === '/scholarship-yojna-2026') ? 'active' : ''}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span style={{
                          backgroundColor: '#DC2626',
                          color: '#FFFFFF',
                          fontSize: '0.62rem',
                          fontWeight: 800,
                          padding: '1px 5px',
                          borderRadius: '999px',
                          lineHeight: 1.2
                        }}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right: Student Login + Apply Now Action Buttons */}
            <div className="header-actions">
              
              {/* Multi-Role Portal Login Gateway (Desktop >= 1160px) */}
              <button
                className="btn btn-secondary btn-sm header-student-btn"
                onClick={() => {
                  if (authRole === 'STUDENT') {
                    navigate('/student-dashboard');
                  } else if (authRole && authRole !== 'guest' && authRole !== 'guest-view') {
                    navigate('/admin');
                  } else {
                    navigate('/login');
                  }
                }}
              >
                <User size={14} />
                <span>
                  {authRole && authRole !== 'guest' && authRole !== 'guest-view'
                    ? (lang === 'hi' ? 'डैशबोर्ड' : 'Dashboard') 
                    : (lang === 'hi' ? 'पोर्टल लॉगिन' : 'Portal Login')}
                </span>
              </button>

              {/* Apply Now Primary CTA Button */}
              <button
                className="btn btn-primary btn-sm header-apply-btn"
                onClick={() => navigate('/apply')}
                id="header-apply-btn"
              >
                <Sparkles size={14} />
                <span className="apply-btn-label">{t.navApplyNow}</span>
              </button>

              {/* Mobile & Tablet Hamburger Menu Toggle */}
              <button
                className="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-drawer animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.85rem', borderBottom: '1px solid #F1F5F9', marginBottom: '1rem' }}>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem' }}>
              {mobileNavLinks.map((item) => (
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
                    padding: '0.7rem 0.85rem',
                    textAlign: 'left',
                    fontSize: '0.925rem',
                    fontWeight: 600,
                    borderRadius: '8px',
                    color: currentRoute === item.route ? '#DC2626' : '#1E293B',
                    backgroundColor: currentRoute === item.route ? '#FEE2E2' : 'transparent',
                    transition: 'background-color 0.15s ease'
                  }}
                >
                  <span>{item.label}</span>
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.8rem' }}
                onClick={() => {
                  navigate('/apply');
                  setMobileMenuOpen(false);
                }}
              >
                <Sparkles size={16} />
                <span>{t.navApplyNow}</span>
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => {
                    navigate('/student-dashboard');
                    setMobileMenuOpen(false);
                  }}
                >
                  <User size={15} />
                  <span>{t.navStudentLogin}</span>
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => {
                    navigate('/admin');
                    setMobileMenuOpen(false);
                  }}
                >
                  <Shield size={15} />
                  <span>{t.navAdmin}</span>
                </button>
              </div>

              {/* Mobile Helpline & Support Direct Links */}
              <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: '#64748B' }}>
                <a href={`tel:${cms.officialMobile}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1E293B', fontWeight: 600 }}>
                  <Phone size={14} color="#DC2626" />
                  <span>{cms.officialMobile}</span>
                </a>
                <a href={`mailto:${cms.officialEmail}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1E293B', fontWeight: 500 }}>
                  <Mail size={14} color="#DC2626" />
                  <span>{cms.officialEmail}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
