import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
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
  FileCheck,
  UserPlus,
  BookOpen,
  Award,
  CheckCircle2
} from 'lucide-react';

export const AdminLogin = ({ defaultRole = null }) => {
  const { lang, currentRoute, navigate, login, loginStudent, createStudentApplicant, activeStudentApp, setActiveStudentApp, authRole } = useApp();

  // Role Types - Only Student and Super Admin
  const ROLE_CONFIGS = [
    {
      id: 'STUDENT',
      labelEn: 'Student Portal',
      labelHi: 'विद्यार्थी पोर्टल',
      icon: GraduationCap,
      badgeEn: 'Student Applicant Portal',
      badgeHi: 'विद्यार्थी आवेदन पोर्टल',
      color: '#2563EB',
      bgLight: '#EFF6FF',
      descriptionEn: 'Access scholarship status, pay registration fee ₹ 211.30 via Razorpay, track DBT payment timeline, verify documents, and download certificates.',
      descriptionHi: 'छात्रवृत्ति आवेदन स्थिति, रेजरपे द्वारा ₹ 211.30 पंजीकरण शुल्क भुगतान, डीबीटी स्थिति एवं प्रमाण पत्र देखें।',
      inputLabel: lang === 'hi' ? 'आवेदन क्रमांक / मोबाइल नंबर' : 'Application ID / Registered Mobile',
      inputPlaceholder: 'JMF-2026-108234 or 9826112233',
      identifierType: 'student',
      demoChips: [
        { label: 'Pooja Sharma (Released)', id: 'JMF-2026-108234', pin: 'pooja123', subtitle: 'Class 12th • Jabalpur • Fee Paid' },
        { label: 'Rahul Verma (Verification)', id: 'JMF-2026-109482', pin: 'rahul123', subtitle: 'Excellence School • Bhopal' },
        { label: 'Ananya Patel (Approved)', id: 'JMF-2026-110294', pin: 'ananya123', subtitle: 'Holkar College • Indore' }
      ]
    },
    {
      id: 'SUPER_ADMIN',
      labelEn: 'Super Admin Portal',
      labelHi: 'सुपर एडमिन पोर्टल',
      icon: Shield,
      badgeEn: 'Central Mission Directorate',
      badgeHi: 'केंद्रीय मिशन निदेशालय',
      color: '#DC2626',
      bgLight: '#FEF2F2',
      descriptionEn: 'Central statewide governance: complete application approvals, Razorpay transaction management, CMS content, grievance resolution, and system audit logs.',
      descriptionHi: 'केंद्रीकृत प्रशासन: आवेदन अनुमोदन, रेजरपे भुगतान प्रबंधन, सीएमएस संपादन एवं संपूर्ण पोर्टल नियंत्रण।',
      inputLabel: lang === 'hi' ? 'सुपर एडमिन ईमेल' : 'Super Admin Email',
      inputPlaceholder: 'admin@jankalyan.org',
      identifierType: 'email',
      demoChips: [
        { label: 'Super Administrator', email: 'admin@jankalyan.org', pass: 'Admin@JMF2026!', subtitle: 'Full Statewide Governance' }
      ]
    }
  ];

  // Derive initial selected role from route or prop
  const getInitialRole = () => {
    if (defaultRole) return defaultRole;
    if (currentRoute === '/admin/login' || currentRoute === '/admin') return 'SUPER_ADMIN';
    return 'STUDENT'; // default to student friendly view
  };

  const [activeRole, setActiveRole] = useState(getInitialRole);
  
  // Student Login vs Student Register Mode
  const [studentMode, setStudentMode] = useState(() => {
    return currentRoute === '/student-register' ? 'register' : 'login';
  });

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // New Student Applicant Registration Form State
  const [regForm, setRegForm] = useState({
    fullName: '',
    mobile: '',
    email: '',
    classCourse: 'Class 12th',
    selectedSlab: 'slab-3',
    scholarshipAmount: 12000,
    district: 'Jabalpur',
    districtId: 'a0000000-0000-0000-0000-000000000001',
    block: 'Patan',
    blockId: 'b0000000-0000-0000-0000-000000000001',
    institutionName: 'Govt. Model Higher Secondary School',
    institutionId: 'c0000000-0000-0000-0000-000000000001',
    password: '',
    confirmPassword: ''
  });

  const SCHOLARSHIP_TIERS = [
    { slab: 'slab-1', labelHi: '5वीं से 7वीं (₹4,000/-)', labelEn: 'Class 5th-7th (₹4,000/-)', amount: 4000, course: 'Class 6th' },
    { slab: 'slab-2', labelHi: '8वीं से 10वीं (₹8,000/-)', labelEn: 'Class 8th-10th (₹8,000/-)', amount: 8000, course: 'Class 10th' },
    { slab: 'slab-3', labelHi: '11वीं से 12वीं (₹12,000/-)', labelEn: 'Class 11th-12th (₹12,000/-)', amount: 12000, course: 'Class 12th' },
    { slab: 'slab-4', labelHi: 'डिप्लोमा / ITI (₹14,000/-)', labelEn: 'Diploma / ITI (₹14,000/-)', amount: 14000, course: 'Polytechnic Diploma' },
    { slab: 'slab-5', labelHi: 'Graduation / स्नातक (₹16,000/-)', labelEn: 'Graduation Degree (₹16,000/-)', amount: 16000, course: 'B.Sc / B.A / B.Com' },
    { slab: 'slab-6', labelHi: 'Post Graduation (₹22,000/-)', labelEn: 'Post Graduation (₹22,000/-)', amount: 22000, course: 'M.Sc / M.A / MBA' }
  ];

  const DISTRICT_OPTIONS = [
    { id: 'a0000000-0000-0000-0000-000000000001', name: 'Jabalpur', block: 'Patan', blockId: 'b0000000-0000-0000-0000-000000000001', defaultSchool: 'Govt. Model Higher Secondary School', instId: 'c0000000-0000-0000-0000-000000000001' },
    { id: 'a0000000-0000-0000-0000-000000000002', name: 'Bhopal', block: 'Berasia', blockId: 'b0000000-0000-0000-0000-000000000003', defaultSchool: 'Barkatullah University College', instId: 'c0000000-0000-0000-0000-000000000002' },
    { id: 'a0000000-0000-0000-0000-000000000003', name: 'Indore', block: 'Depalpur', blockId: 'b0000000-0000-0000-0000-000000000005', defaultSchool: 'Holkar Science College', instId: 'c0000000-0000-0000-0000-000000000003' },
    { id: 'a0000000-0000-0000-0000-000000000004', name: 'Rewa', block: 'Mauganj', blockId: 'b0000000-0000-0000-0000-000000000007', defaultSchool: 'Govt. Polytechnic College Rewa', instId: 'c0000000-0000-0000-0000-000000000004' },
    { id: 'a0000000-0000-0000-0000-000000000005', name: 'Mandla', block: 'Niwas', blockId: 'b0000000-0000-0000-0000-000000000008', defaultSchool: 'Govt. Girls Higher Secondary School', instId: 'c0000000-0000-0000-0000-000000000005' },
    { id: 'a0000000-0000-0000-0000-000000000006', name: 'Gwalior', block: 'Gwalior', blockId: 'b0000000-0000-0000-0000-000000000009', defaultSchool: 'Madhav Institute of Technology', instId: 'c0000000-0000-0000-0000-000000000006' }
  ];

  // Update active role if route changes
  useEffect(() => {
    if (currentRoute === '/admin/login' || currentRoute === '/admin') {
      setActiveRole('SUPER_ADMIN');
    } else {
      setActiveRole('STUDENT');
      setStudentMode(currentRoute === '/student-register' ? 'register' : 'login');
    }
  }, [currentRoute]);

  const currentRoleConfig = ROLE_CONFIGS.find(r => r.id === activeRole) || ROLE_CONFIGS[0];

  // 1. Handle Login Form Submit
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

  // 2. Handle Create New Applicant Registration Submit
  const handleRegisterSubmit = async (e) => {
    e?.preventDefault();
    const cleanMobile = (regForm.mobile || '').replace(/[^0-9]/g, '');
    if (!regForm.fullName?.trim()) {
      setErrorMessage(lang === 'hi' ? 'कृपया विद्यार्थी का पूरा नाम दर्ज करें।' : 'Please enter student full name.');
      return;
    }
    if (cleanMobile.length < 10) {
      setErrorMessage(lang === 'hi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (regForm.password && regForm.confirmPassword && regForm.password !== regForm.confirmPassword) {
      setErrorMessage(lang === 'hi' ? 'पासवर्ड और पुष्टि पासवर्ड मेल नहीं खा रहे हैं।' : 'Passwords do not match.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const chosenPass = regForm.password?.trim() || '123456';
      const result = await createStudentApplicant({
        fullName: regForm.fullName.trim(),
        mobile: cleanMobile,
        email: regForm.email?.trim() || `student_${cleanMobile}@jankalyan.org`,
        password: chosenPass,
        district: regForm.district,
        districtId: regForm.districtId,
        block: regForm.block,
        blockId: regForm.blockId,
        institutionName: regForm.institutionName,
        institutionId: regForm.institutionId,
        classCourse: regForm.classCourse,
        slab: regForm.selectedSlab,
        scholarshipAmount: regForm.scholarshipAmount
      });

      try {
        confetti({ particleCount: 90, spread: 65, origin: { y: 0.6 } });
      } catch (ce) {}

      setSuccessMessage(
        lang === 'hi'
          ? `🎉 नया आवेदक खाता बन गया! आवेदन क्रमांक: ${result.applicationId} | पिन: ${chosenPass}`
          : `🎉 New applicant created! Application ID: ${result.applicationId} | PIN: ${chosenPass}`
      );

      setTimeout(() => {
        navigate('/student-dashboard');
      }, 1200);
    } catch (err) {
      console.error('Registration error:', err);
      setErrorMessage(err.message || 'Could not create new applicant. Please try again.');
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
              ? 'कृपया अपना अधिकृत पोर्टल चुनें — विद्यार्थी पोर्टल या केंद्रीय सुपर एडमिनिस्ट्रेटर।' 
              : 'Select your designated portal to continue — Student Applicant Portal or Super Administrator.'}
          </p>
        </div>

        {/* Dual Portal Switcher: Student vs Super Admin */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1rem', 
          marginBottom: '2rem' 
        }}>
          {ROLE_CONFIGS.map(roleItem => {
            const Icon = roleItem.icon;
            const isSelected = activeRole === roleItem.id;
            return (
              <button
                key={roleItem.id}
                type="button"
                id={`portal-tab-${roleItem.id.toLowerCase()}`}
                onClick={() => {
                  setActiveRole(roleItem.id);
                  setErrorMessage('');
                  setSuccessMessage('');
                  setIdentifier('');
                  setPassword('');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.25rem 1.5rem',
                  borderRadius: '16px',
                  border: isSelected ? `2.5px solid ${roleItem.color}` : '1px solid rgba(255, 255, 255, 0.12)',
                  backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.65)',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isSelected ? `0 12px 28px ${roleItem.color}35` : 'none',
                  textAlign: 'left',
                  position: 'relative'
                }}
              >
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  backgroundColor: isSelected ? roleItem.color : 'rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isSelected ? '#FFFFFF' : '#94A3B8',
                  flexShrink: 0,
                  transition: 'all 0.2s ease'
                }}>
                  <Icon size={26} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: isSelected ? roleItem.color : '#94A3B8',
                    marginBottom: '2px'
                  }}>
                    {lang === 'hi' ? roleItem.badgeHi : roleItem.badgeEn}
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF' }}>
                    {lang === 'hi' ? roleItem.labelHi : roleItem.labelEn}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '3px' }}>
                    {roleItem.id === 'STUDENT'
                      ? (lang === 'hi' ? 'आवेदन, रेजरपे शुल्क एवं स्थिति ट्रैकिंग' : 'Applications, Razorpay fee & DBT status')
                      : (lang === 'hi' ? 'केंद्रीकृत राज्यव्यापी प्रशासन एवं नियंत्रण' : 'Statewide mission governance & control')}
                  </div>
                </div>
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: roleItem.color,
                    boxShadow: `0 0 10px ${roleItem.color}`
                  }} />
                )}
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
          gridTemplateColumns: window.innerWidth > 768 ? '1.15fr 0.85fr' : '1fr'
        }}>

          {/* Left Column: Form Section */}
          <div style={{ padding: '2.5rem' }}>
            
            {/* Role Header Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
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
                    {activeRole === 'STUDENT'
                      ? (studentMode === 'register' 
                          ? (lang === 'hi' ? 'नया विद्यार्थी आवेदक पंजीकरण' : 'Create New Applicant') 
                          : (lang === 'hi' ? 'विद्यार्थी लॉगिन' : 'Student Sign In'))
                      : (lang === 'hi' ? `${currentRoleConfig.labelHi} लॉगिन` : `${currentRoleConfig.labelEn} Sign In`)}
                  </h2>
                </div>
              </div>

              {/* In-tab Toggle between Login and Create New Applicant for Student */}
              {activeRole === 'STUDENT' && (
                <div style={{
                  display: 'inline-flex',
                  backgroundColor: '#F1F5F9',
                  borderRadius: '999px',
                  padding: '3px',
                  border: '1px solid #E2E8F0'
                }}>
                  <button
                    type="button"
                    id="student-tab-login"
                    onClick={() => {
                      setStudentMode('login');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: '999px',
                      border: 'none',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      backgroundColor: studentMode === 'login' ? '#2563EB' : 'transparent',
                      color: studentMode === 'login' ? '#FFFFFF' : '#64748B',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    🔑 {lang === 'hi' ? 'लॉगिन' : 'Sign In'}
                  </button>
                  <button
                    type="button"
                    id="student-tab-register"
                    onClick={() => {
                      setStudentMode('register');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: '999px',
                      border: 'none',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      backgroundColor: studentMode === 'register' ? '#2563EB' : 'transparent',
                      color: studentMode === 'register' ? '#FFFFFF' : '#64748B',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    ✨ {lang === 'hi' ? 'नया आवेदक बनाएं' : 'Create Applicant'}
                  </button>
                </div>
              )}
            </div>

            <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              {activeRole === 'STUDENT' && studentMode === 'register'
                ? (lang === 'hi' 
                    ? 'यदि आप पहली बार आए हैं, तो नीचे अपना विवरण भरकर तुरंत अपना विद्यार्थी आवेदक खाता बनाएं एवं लॉगिन करें।' 
                    : 'If you are applying for the first time, fill your details below to instantly create your applicant account and access your dashboard.')
                : (lang === 'hi' ? currentRoleConfig.descriptionHi : currentRoleConfig.descriptionEn)}
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

            {/* Active Student Logged-In Indicator */}
            {activeRole === 'STUDENT' && activeStudentApp && (
              <div style={{
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {lang === 'hi' ? 'वर्तमान में सक्रिय विद्यार्थी सत्र' : 'ACTIVE STUDENT SESSION'}
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                    {activeStudentApp.studentName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    Application ID: <strong style={{ color: '#1D4ED8' }}>{activeStudentApp.id}</strong> | Mobile: {activeStudentApp.mobile}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate('/student-dashboard')}
                    style={{ backgroundColor: '#2563EB', borderColor: '#2563EB', fontWeight: 700 }}
                  >
                    <span>{lang === 'hi' ? 'डैशबोर्ड पर जाएं' : 'Go to Dashboard'}</span>
                    <ArrowRight size={14} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setActiveStudentApp(null);
                      localStorage.removeItem('jmf_active_student_app');
                      localStorage.removeItem('jmf_active_app_id');
                      localStorage.removeItem('jmf_student_user');
                    }}
                    style={{ fontSize: '0.78rem' }}
                  >
                    <span>{lang === 'hi' ? 'अन्य खाता बदलें' : 'Switch Account'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* CASE A: STUDENT REGISTER FORM */}
            {activeRole === 'STUDENT' && studentMode === 'register' ? (
              <form onSubmit={handleRegisterSubmit} className="animate-fade-in">
                
                {/* Full Legal Name */}
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label required" style={{ fontSize: '0.825rem', fontWeight: 700 }}>
                    {lang === 'hi' ? 'विद्यार्थी का पूरा नाम (Full Name)' : 'Student Full Legal Name'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} color="#94A3B8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      className="form-control"
                      style={{ paddingLeft: '2.75rem' }}
                      placeholder="e.g. Rahul Sharma"
                      required
                      value={regForm.fullName}
                      onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                    />
                  </div>
                </div>

                {/* Mobile Number & Email */}
                <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label required" style={{ fontSize: '0.825rem', fontWeight: 700 }}>
                      {lang === 'hi' ? 'मोबाइल नंबर (10 Digit)' : 'Mobile Number (10 Digit)'}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} color="#94A3B8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="tel"
                        className="form-control"
                        style={{ paddingLeft: '2.5rem' }}
                        placeholder="9826112233"
                        maxLength={10}
                        required
                        value={regForm.mobile}
                        onChange={(e) => setRegForm({ ...regForm, mobile: e.target.value.replace(/[^0-9]/g, '') })}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.825rem', fontWeight: 700 }}>
                      {lang === 'hi' ? 'ईमेल (वैकल्पिक)' : 'Email Address (Optional)'}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="email"
                        className="form-control"
                        style={{ paddingLeft: '2.5rem' }}
                        placeholder="rahul@example.com"
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Scholarship Class & Grant Tier */}
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label required" style={{ fontSize: '0.825rem', fontWeight: 700 }}>
                    {lang === 'hi' ? 'कक्षा / छात्रवृत्ति वर्ग (Scholarship Tier)' : 'Select Qualifying Class / Course'}
                  </label>
                  <select
                    className="form-control"
                    value={regForm.selectedSlab}
                    onChange={(e) => {
                      const sel = SCHOLARSHIP_TIERS.find(t => t.slab === e.target.value) || SCHOLARSHIP_TIERS[2];
                      setRegForm({
                        ...regForm,
                        selectedSlab: sel.slab,
                        classCourse: sel.course,
                        scholarshipAmount: sel.amount
                      });
                    }}
                  >
                    {SCHOLARSHIP_TIERS.map(tier => (
                      <option key={tier.slab} value={tier.slab}>
                        {lang === 'hi' ? tier.labelHi : tier.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District & School/College */}
                <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label required" style={{ fontSize: '0.825rem', fontWeight: 700 }}>
                      {lang === 'hi' ? 'गृह जिला (District)' : 'District Cell'}
                    </label>
                    <select
                      className="form-control"
                      value={regForm.district}
                      onChange={(e) => {
                        const d = DISTRICT_OPTIONS.find(opt => opt.name === e.target.value) || DISTRICT_OPTIONS[0];
                        setRegForm({
                          ...regForm,
                          district: d.name,
                          districtId: d.id,
                          block: d.block,
                          blockId: d.blockId,
                          institutionName: d.defaultSchool,
                          institutionId: d.instId
                        });
                      }}
                    >
                      {DISTRICT_OPTIONS.map(d => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label required" style={{ fontSize: '0.825rem', fontWeight: 700 }}>
                      {lang === 'hi' ? 'स्कूल / कॉलेज का नाम' : 'School / College'}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Model Higher Secondary"
                      required
                      value={regForm.institutionName}
                      onChange={(e) => setRegForm({ ...regForm, institutionName: e.target.value })}
                    />
                  </div>
                </div>

                {/* Create PIN / Password */}
                <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label required" style={{ fontSize: '0.825rem', fontWeight: 700 }}>
                      {lang === 'hi' ? 'पासवर्ड / 4-6 अंकों का पिन' : 'Create PIN / Password'}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="••••••"
                      required
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label required" style={{ fontSize: '0.825rem', fontWeight: 700 }}>
                      {lang === 'hi' ? 'पिन की पुष्टि करें' : 'Confirm Password'}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="••••••"
                      required
                      value={regForm.confirmPassword}
                      onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>

                {/* Submit Register Button */}
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    height: '48px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    backgroundColor: '#2563EB',
                    borderColor: '#2563EB'
                  }}
                  disabled={loading}
                >
                  <UserPlus size={18} />
                  <span>
                    {loading 
                      ? (lang === 'hi' ? 'आवेदक खाता बनाया जा रहा है...' : 'Creating Applicant Account...') 
                      : (lang === 'hi' ? '✨ नया आवेदक खाता बनाएं एवं लॉगिन करें' : '✨ Create Applicant Account & Access Dashboard')}
                  </span>
                </button>

                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setStudentMode('login');
                      setErrorMessage('');
                    }}
                    style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    {lang === 'hi' ? 'पहले से खाता है? यहाँ लॉगिन करें →' : 'Already registered? Sign In here →'}
                  </button>
                </div>

              </form>
            ) : (

              /* CASE B: STANDARD SIGN IN FORM */
              <form onSubmit={handleFormSubmit} className="animate-fade-in">
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
            )}

            {/* Registration Helper for Students when in Login mode */}
            {activeRole === 'STUDENT' && studentMode === 'login' && (
              <div style={{ marginTop: '1.25rem', textAlign: 'center', padding: '0.85rem', backgroundColor: '#EFF6FF', borderRadius: '10px', border: '1px solid #BFDBFE' }}>
                <span style={{ fontSize: '0.82rem', color: '#1E40AF', display: 'block', marginBottom: '0.35rem' }}>
                  {lang === 'hi' ? 'पहली बार आवेदन कर रहे हैं?' : 'New Applicant? Create Your Student Account'}
                </span>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setStudentMode('register');
                      setErrorMessage('');
                    }}
                    style={{ fontWeight: 800, color: '#1D4ED8', fontSize: '0.85rem', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {lang === 'hi' ? '✨ यहाँ नया आवेदक बनाएं (Create Applicant)' : '✨ Register New Applicant Here'}
                  </button>
                  <span style={{ color: '#94A3B8' }}>|</span>
                  <button
                    type="button"
                    onClick={() => navigate('/apply')}
                    style={{ fontWeight: 700, color: '#2563EB', fontSize: '0.85rem', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {lang === 'hi' ? 'पूरा फॉर्म भरें (Apply)' : 'Full Application Form'}
                  </button>
                </div>
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
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#FFFFFF',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = currentRoleConfig.color;
                      e.currentTarget.style.backgroundColor = currentRoleConfig.bgLight;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                        {chip.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                        {chip.id || chip.email}
                      </div>
                      {chip.subtitle && (
                        <div style={{ fontSize: '0.7rem', color: currentRoleConfig.color, fontWeight: 600 }}>
                          {chip.subtitle}
                        </div>
                      )}
                    </div>
                    <ArrowRight size={14} color="#94A3B8" />
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Security Note */}
            <div style={{
              marginTop: '2rem',
              padding: '1rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <FileCheck size={24} color="#10B981" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.4 }}>
                <strong>{lang === 'hi' ? 'सुरक्षित प्रमाणीकरण:' : 'Verified Access:'}</strong>{' '}
                {lang === 'hi' 
                  ? 'सभी लॉगिन सत्र 256-बिट एन्क्रिप्शन एवं लाइव ऑडिट ट्रेल द्वारा सुरक्षित हैं।' 
                  : 'All portal sessions are encrypted with live Supabase RBAC session protection.'}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
