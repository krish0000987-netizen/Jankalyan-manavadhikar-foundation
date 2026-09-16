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
  Volume2,
  LogOut
} from 'lucide-react';

export const Header = () => {
  const { lang, setSpecificLanguage, t, currentRoute, navigate, cms, authRole, setAuthRole, authUser, activeStudentApp, logout } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const dropdownRef = useRef(null);
  const moreDropdownRef = useRef(null);

  // Student and Admin Auth Session Detection
  const isStudentLoggedIn = Boolean(
    authRole === 'STUDENT' || 
    activeStudentApp || 
    authUser?.user_metadata?.role === 'STUDENT'
  );
  const studentName = activeStudentApp?.studentName || authUser?.user_metadata?.full_name || 'Student';
  const studentFirstName = studentName.split(' ')[0] || studentName;
  const studentAppId = activeStudentApp?.id || authUser?.user_metadata?.applicationId || '';
  const isAdminLoggedIn = Boolean(
    authUser &&
    authRole && 
    authRole !== 'guest' && 
    authRole !== 'guest-view' && 
    authRole !== 'STUDENT'
  );

  // Compact header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setRoleDropdownOpen(false);
      }
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target)) {
        setMoreDropdownOpen(false);
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

  // Primary High-Priority Desktop Navigation (Fits on all laptop resolutions)
  const primaryNavLinks = [
    { label: t.navHome, route: '/' },
    { 
      label: lang === 'hi' ? 'छात्रवृत्ति 2026' : 'Scholarship 2026', 
      route: '/scholarship',
      badge: '2026'
    },
    { 
      label: lang === 'hi' ? 'मेरिट सूची' : 'Merit List', 
      route: '/merit-list',
      badge: 'New'
    },
    { label: lang === 'hi' ? 'आवेदन ट्रैक' : 'Track Status', route: '/track' },
    { label: lang === 'hi' ? 'दस्तावेज़' : 'Documents', route: '/documents' }
  ];

  // Secondary Links in Desktop "More" Dropdown Menu
  const moreNavLinks = [
    { label: lang === 'hi' ? 'हमारे बारे में' : 'About Foundation', route: '/about' },
    { label: lang === 'hi' ? 'डाउनलोड फॉर्म' : 'Downloads & Forms', route: '/downloads' },
    { label: lang === 'hi' ? 'शिकायत निवारण' : 'Grievance Desk', route: '/grievance' },
    { label: 'FAQ / प्रश्नोत्तरी', route: '/faq' },
    { label: lang === 'hi' ? 'संपर्क सहायता' : 'Contact Support', route: '/contact' }
  ];

  // Full detailed links for mobile slide-out drawer
  const mobileNavLinks = [
    { label: t.navHome, route: '/' },
    { label: t.navAbout, route: '/about' },
    { label: lang === 'hi' ? '🌟 छात्रवृत्ति योजना 2026 (अंतिम राउंड)' : '🌟 Scholarship Yojna 2026 (Last Round)', route: '/scholarship' },
    { label: lang === 'hi' ? '🏆 मेरिट चयन सूची 2026-27' : '🏆 Official Merit List 2026-27', route: '/merit-list' },
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
    { id: 'admin', labelEn: 'Super Admin', labelHi: 'सुपर एडमिन' }
  ];

  const handleRoleSelect = (roleId) => {
    setRoleDropdownOpen(false);
    if (roleId === 'student') {
      navigate('/student-login');
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
                        <span>{lang === 'hi' ? 'सुपर एडमिन लॉगिन' : 'Super Admin Login'}</span>
                      </button>
                    </div>
                    {(isStudentLoggedIn || isAdminLoggedIn) && (
                      <div style={{ borderTop: '1px solid #F1F5F9', marginTop: '0.4rem', paddingTop: '0.4rem' }}>
                        <button
                          onClick={() => {
                            setRoleDropdownOpen(false);
                            logout();
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
                            backgroundColor: '#FEF2F2',
                            border: '1px solid #FECACA',
                            cursor: 'pointer'
                          }}
                        >
                          <LogOut size={14} color="#DC2626" />
                          <span>{lang === 'hi' ? 'सत्र समाप्त / लॉगआउट' : 'Sign Out / Logout'}</span>
                        </button>
                      </div>
                    )}
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

            {/* Center: Streamlined Primary Navigation Menu + More Dropdown */}
            <nav className="desktop-nav">
              <ul className="nav-menu">
                {primaryNavLinks.map((item) => (
                  <li key={item.route}>
                    <button
                      onClick={() => navigate(item.route)}
                      className={`nav-link ${currentRoute === item.route || (item.route === '/scholarship' && currentRoute === '/scholarship-yojna-2026') ? 'active' : ''}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
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

                {/* More Secondary Nav Links Dropdown */}
                <li style={{ position: 'relative' }} ref={moreDropdownRef}>
                  <button
                    onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                    className={`nav-link ${moreNavLinks.some(m => currentRoute === m.route) ? 'active' : ''}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                  >
                    <span>{lang === 'hi' ? 'अन्य' : 'More'}</span>
                    <ChevronDown size={13} />
                  </button>

                  {moreDropdownOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '120%',
                      left: 0,
                      backgroundColor: '#FFFFFF',
                      borderRadius: '10px',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                      border: '1px solid #E2E8F0',
                      minWidth: '180px',
                      padding: '0.35rem',
                      zIndex: 250
                    }}>
                      {moreNavLinks.map((subItem) => (
                        <button
                          key={subItem.route}
                          onClick={() => {
                            setMoreDropdownOpen(false);
                            navigate(subItem.route);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            padding: '0.5rem 0.75rem',
                            fontSize: '0.82rem',
                            textAlign: 'left',
                            borderRadius: '6px',
                            color: currentRoute === subItem.route ? '#DC2626' : '#1E293B',
                            backgroundColor: currentRoute === subItem.route ? '#FEF2F2' : 'transparent',
                            fontWeight: currentRoute === subItem.route ? 700 : 500,
                            cursor: 'pointer'
                          }}
                        >
                          <span>{subItem.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </li>
              </ul>
            </nav>

            {/* Right: Student Identity, Status, Logout & Apply Now Actions */}
            <div className="header-actions" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              
              {isStudentLoggedIn ? (
                <>
                  {/* Logged-In Student Profile Chip (Click to go to Dashboard) */}
                  <div 
                    className="header-student-badge-chip hide-tablet-down"
                    onClick={() => navigate('/student-dashboard')}
                    title={lang === 'hi' ? 'विद्यार्थी डैशबोर्ड देखें' : 'Go to Student Dashboard'}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      backgroundColor: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      borderRadius: '999px',
                      padding: '0.2rem 0.6rem 0.2rem 0.25rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      flexShrink: 0
                    }}
                  >
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: '#1E40AF',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      flexShrink: 0
                    }}>
                      {studentName.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.15 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: '#16A34A',
                          display: 'inline-block',
                          boxShadow: '0 0 0 2px rgba(22, 163, 74, 0.25)',
                          flexShrink: 0
                        }} />
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1E3A8A', whiteSpace: 'nowrap' }}>
                          {studentFirstName}
                        </span>
                      </div>
                      {studentAppId ? (
                        <>
                          <span className="hide-on-laptop-narrow" style={{ fontSize: '0.62rem', color: '#2563EB', fontWeight: 600, whiteSpace: 'nowrap' }}>
                            {studentAppId}
                          </span>
                          <span className="show-on-laptop-narrow" style={{ fontSize: '0.62rem', color: '#16A34A', fontWeight: 700, whiteSpace: 'nowrap' }}>
                            {lang === 'hi' ? 'सक्रिय' : 'Active'}
                          </span>
                        </>
                      ) : (
                        <span style={{ fontSize: '0.62rem', color: '#16A34A', fontWeight: 700, whiteSpace: 'nowrap' }}>
                          {lang === 'hi' ? 'लॉग इन हैं' : 'Logged In'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Student Logout Button - Always visible, never clipped */}
                  <button
                    className="btn btn-sm header-logout-btn hide-tablet-down"
                    onClick={logout}
                    style={{
                      backgroundColor: '#FEF2F2',
                      color: '#DC2626',
                      border: '1px solid #FECACA',
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      gap: '4px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      flexShrink: 0,
                      whiteSpace: 'nowrap'
                    }}
                    title={lang === 'hi' ? 'विद्यार्थी सत्र से लॉगआउट करें' : 'Logout from Student Account'}
                  >
                    <LogOut size={13} />
                    <span>{lang === 'hi' ? 'लॉगआउट' : 'Logout'}</span>
                  </button>
                </>
              ) : isAdminLoggedIn ? (
                <>
                  {/* Logged-In Admin Profile Chip */}
                  <div 
                    className="header-student-badge-chip hide-tablet-down"
                    onClick={() => navigate('/admin')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      backgroundColor: '#FEF2F2',
                      border: '1px solid #FECACA',
                      borderRadius: '999px',
                      padding: '0.2rem 0.6rem 0.2rem 0.25rem',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: '#DC2626',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      flexShrink: 0
                    }}>
                      A
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.15 }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#991B1B', whiteSpace: 'nowrap' }}>
                        Admin
                      </span>
                      <span className="hide-on-laptop-narrow" style={{ fontSize: '0.62rem', color: '#DC2626', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {authRole}
                      </span>
                    </div>
                  </div>

                  {/* Admin Logout Button */}
                  <button
                    className="btn btn-sm header-logout-btn hide-tablet-down"
                    onClick={logout}
                    style={{
                      backgroundColor: '#FEF2F2',
                      color: '#DC2626',
                      border: '1px solid #FECACA',
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      gap: '4px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      flexShrink: 0,
                      whiteSpace: 'nowrap'
                    }}
                    title="Sign Out of Admin"
                  >
                    <LogOut size={13} />
                    <span>{lang === 'hi' ? 'लॉगआउट' : 'Logout'}</span>
                  </button>
                </>
              ) : (
                /* Guest / Not Logged In Portal Gateway Button */
                <button
                  className="btn btn-secondary btn-sm header-student-btn"
                  onClick={() => navigate('/login')}
                  title={lang === 'hi' ? 'विद्यार्थी अथवा पोर्टल लॉगिन' : 'Student or Portal Login'}
                  style={{ flexShrink: 0, whiteSpace: 'nowrap' }}
                >
                  <User size={14} />
                  <span>{lang === 'hi' ? 'विद्यार्थी लॉगिन' : 'Student Login'}</span>
                </button>
              )}

              {/* Apply Now Primary CTA Button */}
              <button
                className="btn btn-primary btn-sm header-apply-btn"
                onClick={() => navigate('/apply')}
                id="header-apply-btn"
                style={{ flexShrink: 0, whiteSpace: 'nowrap' }}
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.85rem', borderBottom: '1px solid #F1F5F9', marginBottom: '0.75rem' }}>
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

              {isStudentLoggedIn ? (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#DCFCE7',
                  color: '#166534',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  border: '1px solid #86EFAC'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
                  {lang === 'hi' ? 'लॉग इन हैं' : 'Logged In'}
                </span>
              ) : (
                <span className="badge badge-blue">
                  {roles.find(r => r.id === authRole)?.[lang === 'hi' ? 'labelHi' : 'labelEn'] || (lang === 'hi' ? 'सामान्य दृश्य' : 'Public View')}
                </span>
              )}
            </div>

            {/* Mobile Logged-in Student Identity Card or Guest Session Status */}
            {isStudentLoggedIn ? (
              <div style={{
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: '12px',
                padding: '0.85rem',
                marginBottom: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#1E40AF',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      fontWeight: 800
                    }}>
                      {studentName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1E293B' }}>
                        {studentName}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#1E40AF', fontWeight: 600 }}>
                        {studentAppId ? `App ID: ${studentAppId}` : (lang === 'hi' ? 'सक्रिय विद्यार्थी सत्र' : 'Active Student Session')}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ justifyContent: 'center', fontSize: '0.78rem' }}
                    onClick={() => {
                      navigate('/student-dashboard');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <User size={13} />
                    <span>{lang === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}</span>
                  </button>
                  <button
                    className="btn btn-sm"
                    style={{
                      backgroundColor: '#FEE2E2',
                      color: '#DC2626',
                      border: '1px solid #FCA5A5',
                      justifyContent: 'center',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut size={13} />
                    <span>{lang === 'hi' ? 'लॉगआउट' : 'Logout'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                backgroundColor: '#F8FAFC',
                border: '1px dashed #CBD5E1',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                marginBottom: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748B' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#94A3B8' }} />
                  <span>{lang === 'hi' ? 'स्थिति: आप लॉग इन नहीं हैं' : 'Status: Not logged in'}</span>
                </div>
                <button
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    backgroundColor: '#EFF6FF',
                    color: '#1E40AF',
                    border: '1px solid #BFDBFE',
                    padding: '2px 7px',
                    borderRadius: '5px',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    cursor: 'pointer'
                  }}
                >
                  {lang === 'hi' ? 'लॉगिन' : 'Login'}
                </button>
              </div>
            )}

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
                {isStudentLoggedIn ? (
                  <>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => {
                        navigate('/student-dashboard');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <User size={15} />
                      <span>{lang === 'hi' ? 'मेरा डैशबोर्ड' : 'My Dashboard'}</span>
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        backgroundColor: '#FEE2E2',
                        color: '#DC2626',
                        border: '1px solid #FCA5A5',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut size={14} />
                      <span>{lang === 'hi' ? 'लॉगआउट' : 'Logout'}</span>
                    </button>
                  </>
                ) : (
                  <>
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
                        navigate(isAdminLoggedIn ? '/admin' : '/admin/login');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Shield size={15} />
                      <span>{t.navAdmin}</span>
                    </button>
                  </>
                )}
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
