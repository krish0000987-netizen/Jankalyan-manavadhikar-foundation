import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Shield, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle, 
  Eye, 
  EyeOff, 
  GraduationCap, 
  Building2, 
  MapPin, 
  Layers, 
  Laptop, 
  User, 
  Sparkles,
  Phone,
  FileCheck
} from 'lucide-react';

export const AdminLogin = ({ defaultRole = null }) => {
  const { lang, currentRoute, navigate, login, loginStudent } = useApp();

  // Role Types
  const ROLE_CONFIGS = [
    {
      id: 'STUDENT',
      labelEn: 'Student',
      labelHi: 'विद्यार्थी',
      icon: GraduationCap,
      badgeEn: 'Student Applicant Portal',
      badgeHi: 'विद्यार्थी आवेदन पोर्टल',
      color: '#2563EB',
      bgLight: '#EFF6FF',
      descriptionEn: 'Access scholarship status, DBT payment timeline, verify documents, and download certificates.',
      descriptionHi: 'छात्रवृत्ति आवेदन स्थिति, डीबीटी भुगतान, दस्तावेज़ सत्यापन एवं प्रमाण पत्र डाउनलोड करें।',
      inputLabel: lang === 'hi' ? 'आवेदन क्रमांक / मोबाइल नंबर' : 'Application ID / Registered Mobile',
      inputPlaceholder: 'JMF-2026-108234 or 9826112233',
      identifierType: 'student',
      demoChips: [
        { label: 'Pooja Sharma (Released)', id: 'JMF-2026-108234', pin: 'pooja123', subtitle: 'Class 12th • Jabalpur' },
        { label: 'Rahul Verma (Verification)', id: 'JMF-2026-109482', pin: 'rahul123', subtitle: 'Excellence School • Bhopal' },
        { label: 'Ananya Patel (Approved)', id: 'JMF-2026-110294', pin: 'ananya123', subtitle: 'Holkar College • Indore' }
      ]
    },
    {
      id: 'INSTITUTION',
      labelEn: 'School / College',
      labelHi: 'स्कूल / कॉलेज',
      icon: Building2,
      badgeEn: 'Institutional Nodal Portal',
      badgeHi: 'संस्थागत नोडल पोर्टल',
      color: '#0D9488',
      bgLight: '#F0FDFA',
      descriptionEn: 'Verify student bonafides, review applications enrolled in your institution, and track school grants.',
      descriptionHi: 'अपने विद्यालय/कॉलेज के छात्रों के बोनाफाइड सत्यापित करें और संस्थागत प्रगति देखें।',
      inputLabel: lang === 'hi' ? 'संस्थान ईमेल / कोड' : 'Official Institution Email / Code',
      inputPlaceholder: 'school.model@jankalyan.org or SCH-JBP-01',
      identifierType: 'email',
      demoChips: [
        { label: 'Govt. Model School (Jabalpur)', email: 'school.model@jankalyan.org', pass: 'School@JMF2026!', code: 'SCH-JBP-01' },
        { label: 'Holkar Science College (Indore)', email: 'college.holkar@jankalyan.org', pass: 'College@JMF2026!', code: 'COL-IND-03' },
        { label: 'Barkatullah Univ. College (Bhopal)', email: 'college.barkatullah@jankalyan.org', pass: 'College@JMF2026!', code: 'COL-BPL-02' }
      ]
    },
    {
      id: 'DISTRICT_COORDINATOR',
      labelEn: 'District Cell',
      labelHi: 'जिला समन्वयक',
      icon: MapPin,
      badgeEn: 'District Governance Cell',
      badgeHi: 'जिला प्रशासनिक प्रकोष्ठ',
      color: '#D97706',
      bgLight: '#FFFBEB',
      descriptionEn: 'Second-tier district scrutiny, block oversight, certificate approvals, and district commission reports.',
      descriptionHi: 'द्वितीय-स्तरीय जिला संवीक्षा, ब्लॉक पर्यवेक्षण एवं जिला रिपोर्टिंग।',
      inputLabel: lang === 'hi' ? 'जिला अधिकारी ईमेल' : 'District Official Email',
      inputPlaceholder: 'district.jabalpur@jankalyan.org',
      identifierType: 'email',
      demoChips: [
        { label: 'Jabalpur District Cell', email: 'district.jabalpur@jankalyan.org', pass: 'District@JMF2026!' },
        { label: 'Bhopal District Cell', email: 'district.bhopal@jankalyan.org', pass: 'District@JMF2026!' }
      ]
    },
    {
      id: 'BLOCK_COORDINATOR',
      labelEn: 'Block Cell',
      labelHi: 'ब्लॉक समन्वयक',
      icon: Layers,
      badgeEn: 'Block Coordination Desk',
      badgeHi: 'ब्लॉक समन्वय प्रकोष्ठ',
      color: '#7C3AED',
      bgLight: '#F5F3FF',
      descriptionEn: 'Grassroots block verification, school-level liaison, and cluster documentation support.',
      descriptionHi: 'जमीनी स्तर पर ब्लॉक सत्यापन एवं स्थानीय विद्यालयों से समन्वय।',
      inputLabel: lang === 'hi' ? 'ब्लॉक अधिकारी ईमेल' : 'Block Official Email',
      inputPlaceholder: 'block.patan@jankalyan.org',
      identifierType: 'email',
      demoChips: [
        { label: 'Patan Block Cell (Jabalpur)', email: 'block.patan@jankalyan.org', pass: 'Block@JMF2026!' }
      ]
    },
    {
      id: 'ONLINE_CENTER',
      labelEn: 'CSC Center',
      labelHi: 'ऑनलाइन केंद्र',
      icon: Laptop,
      badgeEn: 'Facilitation Center Portal',
      badgeHi: 'सुविधा केंद्र पोर्टल',
      color: '#EA580C',
      bgLight: '#FFF7ED',
      descriptionEn: 'Assisted student registration, application submission, fee receipts, and facilitation commission.',
      descriptionHi: 'विद्यार्थी पंजीयन सहायता, रसीद प्रिंटिंग एवं सुविधा केंद्र कमीशन।',
      inputLabel: lang === 'hi' ? 'केंद्र आईडी / ईमेल' : 'CSC Center ID / Email',
      inputPlaceholder: 'center.csc@jankalyan.org',
      identifierType: 'email',
      demoChips: [
        { label: 'Jabalpur Digital CSC Center', email: 'center.csc@jankalyan.org', pass: 'Center@JMF2026!' }
      ]
    },
    {
      id: 'SUPER_ADMIN',
      labelEn: 'Super Admin',
      labelHi: 'सुपर एडमिन',
      icon: Shield,
      badgeEn: 'Statewide Governance & CMS',
      badgeHi: 'राज्यव्यापी प्रशासनिक नियंत्रण',
      color: '#DC2626',
      bgLight: '#FEF2F2',
      descriptionEn: 'Complete administrative authority, financial DBT batch processing, CMS management, and audit trails.',
      descriptionHi: 'संपूर्ण प्रशासनिक नियंत्रण, डीबीटी भुगतान प्रक्रिया, सीएमएस एवं ऑडिट लॉग।',
      inputLabel: lang === 'hi' ? 'प्रशासनिक ईमेल' : 'Super Admin Email',
      inputPlaceholder: 'admin@jankalyan.org',
      identifierType: 'email',
      demoChips: [
        { label: 'Head Office Super Admin', email: 'admin@jankalyan.org', pass: 'Admin@JMF2026!' }
      ]
    }
  ];

  // Derive initial selected role from route or prop
  const getInitialRole = () => {
    if (defaultRole) return defaultRole;
    if (currentRoute === '/student-login') return 'STUDENT';
    if (currentRoute === '/school-login' || currentRoute === '/college-login' || currentRoute === '/institution-login') return 'INSTITUTION';
    if (currentRoute === '/district-login') return 'DISTRICT_COORDINATOR';
    if (currentRoute === '/block-login') return 'BLOCK_COORDINATOR';
    if (currentRoute === '/admin/login' || currentRoute === '/admin') return 'SUPER_ADMIN';
    return 'STUDENT'; // default to student friendly view
  };

  const [activeRole, setActiveRole] = useState(getInitialRole);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Update active role if route changes
  useEffect(() => {
    if (currentRoute === '/student-login') setActiveRole('STUDENT');
    else if (currentRoute === '/school-login' || currentRoute === '/college-login' || currentRoute === '/institution-login') setActiveRole('INSTITUTION');
    else if (currentRoute === '/district-login') setActiveRole('DISTRICT_COORDINATOR');
    else if (currentRoute === '/block-login') setActiveRole('BLOCK_COORDINATOR');
    else if (currentRoute === '/admin/login') setActiveRole('SUPER_ADMIN');
  }, [currentRoute]);

  const currentRoleConfig = ROLE_CONFIGS.find(r => r.id === activeRole) || ROLE_CONFIGS[0];

  const handleFormSubmit = async (e) => {
    e?.preventDefault();
    if (!identifier) {
      setErrorMessage(lang === 'hi' ? 'कृपया आवश्यक विवरण दर्ज करें।' : 'Please enter your login details.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (activeRole === 'STUDENT') {
        await loginStudent(identifier, password);
        setSuccessMessage(lang === 'hi' ? 'लॉगिन सफल! डैशबोर्ड पर ले जाया जा रहा है...' : 'Login successful! Navigating to dashboard...');
        setTimeout(() => navigate('/student-dashboard'), 600);
      } else {
        if (!password) {
          throw new Error('Please enter your password.');
        }
        await login(identifier, password);
        setSuccessMessage(lang === 'hi' ? 'प्रमाणीकरण सफल! पोर्टल पर ले जाया जा रहा है...' : 'Authentication successful! Navigating to portal...');
        setTimeout(() => navigate('/admin'), 600);
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage(err.message || 'Invalid credentials. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  // Instant one-click demo login
  const handleQuickDemoClick = async (chip) => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (activeRole === 'STUDENT') {
        setIdentifier(chip.id);
        setPassword(chip.pin || '123456');
        await loginStudent(chip.id, chip.pin);
        setSuccessMessage(`Authenticated as ${chip.label}! Redirecting...`);
        setTimeout(() => navigate('/student-dashboard'), 500);
      } else {
        setIdentifier(chip.email);
        setPassword(chip.pass);
        await login(chip.email, chip.pass);
        setSuccessMessage(`Authenticated as ${chip.label}! Redirecting...`);
        setTimeout(() => navigate('/admin'), 500);
      }
    } catch (err) {
      console.error('Quick login failed:', err);
      setErrorMessage(err.message || 'Demo access failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-py" style={{ 
      backgroundColor: '#0B132B', 
      minHeight: '90vh', 
      display: 'flex', 
      alignItems: 'center',
      padding: '2.5rem 1rem'
    }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        
        {/* Top Header Card */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(37, 99, 235, 0.15)',
            border: '1px solid rgba(37, 99, 235, 0.3)',
            color: '#93C5FD',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            marginBottom: '0.75rem',
            textTransform: 'uppercase'
          }}>
            <Sparkles size={14} color="#FEF08A" />
            <span>{lang === 'hi' ? 'एकीकृत डिजिटल पोर्टल प्रवेश' : 'UNIFIED GOVERNANCE & STUDENT ACCESS PORTAL'}</span>
          </div>
          
          <h1 style={{ color: '#FFFFFF', fontSize: '2.2rem', fontWeight: 800, margin: '0 0 0.5rem 0', lineHeight: 1.2 }}>
            {lang === 'hi' ? 'जनकल्याण मानवाधिकार फाउंडेशन' : 'Jankalyan Manavadhikar Foundation'}
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1rem', maxWidth: '620px', margin: '0 auto' }}>
            {lang === 'hi' 
              ? 'कृपया अपनी निर्धारित भूमिका चुनें और पोर्टल में प्रवेश करें।' 
              : 'Select your designated institutional or applicant role to sign in to your authorized workspace.'}
          </p>
        </div>

        {/* Role Tabs Strip */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
          gap: '0.6rem', 
          marginBottom: '1.75rem' 
        }}>
          {ROLE_CONFIGS.map(roleItem => {
            const Icon = roleItem.icon;
            const isSelected = activeRole === roleItem.id;
            return (
              <button
                key={roleItem.id}
                type="button"
                onClick={() => {
                  setActiveRole(roleItem.id);
                  setErrorMessage('');
                  setSuccessMessage('');
                  setIdentifier('');
                  setPassword('');
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.85rem 0.6rem',
                  borderRadius: '12px',
                  border: isSelected ? `2px solid ${roleItem.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.6)',
                  color: isSelected ? '#FFFFFF' : '#94A3B8',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? `0 8px 24px ${roleItem.color}33` : 'none'
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: isSelected ? roleItem.color : 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isSelected ? '#FFFFFF' : '#94A3B8'
                }}>
                  <Icon size={20} />
                </div>
                <span style={{ fontSize: '0.825rem', fontWeight: isSelected ? 700 : 500, textAlign: 'center', lineHeight: 1.2 }}>
                  {lang === 'hi' ? roleItem.labelHi : roleItem.labelEn}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Login Form Container */}
        <div className="card animate-fade-in" style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: window.innerWidth > 768 ? '1.1fr 1fr' : '1fr'
        }}>

          {/* Left Column: Form Section */}
          <div style={{ padding: '2.5rem' }}>
            
            {/* Role Header Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: currentRoleConfig.bgLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: currentRoleConfig.color
              }}>
                <currentRoleConfig.icon size={24} />
              </div>
              <div>
                <span style={{
                  display: 'inline-block',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: currentRoleConfig.color
                }}>
                  {lang === 'hi' ? currentRoleConfig.badgeHi : currentRoleConfig.badgeEn}
                </span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {lang === 'hi' ? `${currentRoleConfig.labelHi} लॉगिन` : `${currentRoleConfig.labelEn} Sign In`}
                </h2>
              </div>
            </div>

            <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              {lang === 'hi' ? currentRoleConfig.descriptionHi : currentRoleConfig.descriptionEn}
            </p>

            {/* Error Message */}
            {errorMessage && (
              <div style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                padding: '0.8rem 1rem',
                borderRadius: '10px',
                color: '#B91C1C',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem'
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div style={{
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBF7D0',
                padding: '0.8rem 1rem',
                borderRadius: '10px',
                color: '#15803D',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem'
              }}>
                <CheckCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label required" style={{ fontSize: '0.825rem', fontWeight: 700 }}>
                  {currentRoleConfig.inputLabel}
                </label>
                <div style={{ position: 'relative' }}>
                  {activeRole === 'STUDENT' ? (
                    <User size={18} color="#94A3B8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  ) : (
                    <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  )}
                  <input
                    type="text"
                    className="form-control"
                    style={{ paddingLeft: '2.75rem' }}
                    placeholder={currentRoleConfig.inputPlaceholder}
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label required" style={{ fontSize: '0.825rem', fontWeight: 700 }}>
                    {activeRole === 'STUDENT' 
                      ? (lang === 'hi' ? 'पासवर्ड / जन्मतिथि / पिन (वैकल्पिक)' : 'Password / DOB / PIN (Optional for Demo)') 
                      : (lang === 'hi' ? 'सुरक्षा पासवर्ड' : 'Password')}
                  </label>
                  {activeRole === 'STUDENT' && (
                    <button 
                      type="button" 
                      onClick={() => navigate('/track')} 
                      style={{ fontSize: '0.75rem', color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      {lang === 'hi' ? 'बिना पासवर्ड ट्रैक करें' : 'Track without PIN'}
                    </button>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                    placeholder="••••••••••••"
                    required={activeRole !== 'STUDENT'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  width: '100%',
                  height: '48px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  backgroundColor: currentRoleConfig.color,
                  borderColor: currentRoleConfig.color
                }}
                disabled={loading}
              >
                <span>
                  {loading 
                    ? (lang === 'hi' ? 'सत्यापन हो रहा है...' : 'Authenticating...') 
                    : (lang === 'hi' ? `${currentRoleConfig.labelHi} पोर्टल में प्रवेश करें` : `Sign In to ${currentRoleConfig.labelEn} Portal`)}
                </span>
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Registration Helper for Students */}
            {activeRole === 'STUDENT' && (
              <div style={{ marginTop: '1.25rem', textAlign: 'center', padding: '0.85rem', backgroundColor: '#EFF6FF', borderRadius: '10px', border: '1px solid #BFDBFE' }}>
                <span style={{ fontSize: '0.82rem', color: '#1E40AF', display: 'block', marginBottom: '0.35rem' }}>
                  {lang === 'hi' ? 'नया छात्रवृत्ति आवेदन भरना चाहते हैं?' : 'New Applicant? Register & Submit Details'}
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/apply')}
                  style={{ fontWeight: 800, color: '#1D4ED8', fontSize: '0.85rem', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {lang === 'hi' ? '→ नया छात्रवृत्ति आवेदन प्रारंभ करें (Apply Now)' : '→ Start New Scholarship Application (Apply Now)'}
                </button>
              </div>
            )}

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => navigate('/')}
                style={{ color: '#64748B', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {lang === 'hi' ? '← मुख्य वेबसाइट पर वापस जाएं' : '← Back to Public Website'}
              </button>
            </div>
          </div>

          {/* Right Column: Instant One-Click Demo Access Cards */}
          <div style={{
            backgroundColor: '#F8FAFC',
            borderLeft: '1px solid #E2E8F0',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <Sparkles size={16} color={currentRoleConfig.color} />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {lang === 'hi' ? 'त्वरित डेमो परीक्षण लॉगिन' : 'Instant One-Click Demo Access'}
                </span>
              </div>
              
              <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.25rem', lineHeight: 1.4 }}>
                {lang === 'hi'
                  ? 'नीचे दिए गए किसी भी परीक्षण खाते पर क्लिक करके सीधे उस भूमिका के अधिकृत डैशबोर्ड में प्रवेश करें:'
                  : `Click any pre-configured sample ${currentRoleConfig.labelEn.toLowerCase()} profile below to log in instantly without typing:`}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {currentRoleConfig.demoChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickDemoClick(chip)}
                    disabled={loading}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '0.85rem 1rem',
                      borderRadius: '10px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = currentRoleConfig.color;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                        {chip.label}
                      </span>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        backgroundColor: currentRoleConfig.bgLight,
                        color: currentRoleConfig.color
                      }}>
                        {chip.code || 'DEMO'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', gap: '0.75rem' }}>
                      {chip.id && <span>ID: <strong>{chip.id}</strong></span>}
                      {chip.email && <span>{chip.email}</span>}
                    </div>

                    {chip.subtitle && (
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                        {chip.subtitle}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Help & Support Notice */}
            <div style={{
              marginTop: '1.75rem',
              padding: '1rem',
              borderRadius: '10px',
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <Phone size={20} color="#1D4ED8" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E3A8A' }}>
                  {lang === 'hi' ? 'संस्थागत सहायता हेल्पलाइन' : 'Official Portal Helpline'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#1D4ED8' }}>
                  8871557054 • jankalyanmanavadhikar@gmail.com
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
