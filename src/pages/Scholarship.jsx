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
  Award,
  BookOpen,
  Wrench,
  Phone,
  Mail,
  MapPin,
  Globe,
  Download,
  Search,
  ExternalLink,
  ChevronRight,
  BadgePercent,
  Languages
} from 'lucide-react';

export const Scholarship = () => {
  const { lang, setSpecificLanguage, t, navigate, cms } = useApp();

  const isHindi = lang === 'hi';

  const baseSlabs = [
    {
      id: 'slab-1',
      classTitle: isHindi ? '5वीं से 7वीं' : '5th to 7th Class',
      classTitleHi: '5वीं से 7वीं',
      classTitleEn: '5th to 7th Class',
      subText: isHindi ? 'कक्षा 5, 6, 7 अध्ययनरत छात्र' : 'Students Enrolled in Class 5th, 6th & 7th',
      amount: '₹4,000/-',
      period: isHindi ? 'वार्षिक (प्रति वर्ष)' : 'Annual / Yearly Grant',
      badgeText: isHindi ? 'वार्षिक अनुदान' : 'ANNUAL GRANT',
      color: '#0284C7',
      bgGradient: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
      cardBg: '#F0F9FF',
      borderColor: '#BAE6FD',
      icon: BookOpen,
      qualifyingCourse: 'Class 5th - 7th'
    },
    {
      id: 'slab-2',
      classTitle: isHindi ? '8वीं से 10वीं' : '8th to 10th Class',
      classTitleHi: '8वीं से 10वीं',
      classTitleEn: '8th to 10th Class',
      subText: isHindi ? 'कक्षा 8, 9, 10 हाई स्कूल' : 'High School (Classes 8th, 9th & 10th)',
      amount: '₹8,000/-',
      period: isHindi ? 'वार्षिक (प्रति वर्ष)' : 'Annual / Yearly Grant',
      badgeText: isHindi ? 'वार्षिक अनुदान' : 'ANNUAL GRANT',
      color: '#16A34A',
      bgGradient: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
      cardBg: '#F0FDF4',
      borderColor: '#BBF7D0',
      icon: BookOpen,
      qualifyingCourse: 'Class 8th - 10th'
    },
    {
      id: 'slab-3',
      classTitle: isHindi ? '11वीं से 12वीं' : '11th to 12th Class',
      classTitleHi: '11वीं से 12वीं',
      classTitleEn: '11th to 12th Class',
      subText: isHindi ? 'कक्षा 11 व 12 हायर सेकेंडरी' : 'Higher Secondary (Classes 11th & 12th)',
      amount: '₹12,000/-',
      period: isHindi ? 'वार्षिक (प्रति वर्ष)' : 'Annual / Yearly Grant',
      badgeText: isHindi ? 'वार्षिक अनुदान' : 'ANNUAL GRANT',
      color: '#E11D48',
      bgGradient: 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)',
      cardBg: '#FFF1F2',
      borderColor: '#FECDD3',
      icon: BookOpen,
      qualifyingCourse: 'Class 11th - 12th'
    },
    {
      id: 'slab-4',
      classTitle: isHindi ? 'डिप्लोमा / पॉलिटेक्निक / ITI' : 'Diploma / Polytechnic / ITI',
      classTitleHi: 'Diploma / Polytechnic / ITI',
      classTitleEn: 'Diploma / Polytechnic / ITI',
      subText: isHindi ? 'तकनीकी एवं व्यावसायिक डिप्लोमा पाठ्यक्रम' : 'Technical & Vocational Diploma Courses',
      amount: '₹14,000/-',
      period: isHindi ? 'वार्षिक (प्रति वर्ष)' : 'Annual / Yearly Grant',
      badgeText: isHindi ? 'वार्षिक अनुदान' : 'ANNUAL GRANT',
      color: '#D97706',
      bgGradient: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
      cardBg: '#FFFBEB',
      borderColor: '#FDE68A',
      icon: Wrench,
      qualifyingCourse: 'Diploma / Polytechnic / ITI'
    },
    {
      id: 'slab-5',
      classTitle: isHindi ? 'Graduation (स्नातक)' : 'Graduation (Bachelor Degree)',
      classTitleHi: 'Graduation (स्नातक)',
      classTitleEn: 'Graduation (Degree)',
      subText: isHindi ? 'B.A., B.Sc., B.Com., B.Tech, आदि' : 'B.A., B.Sc., B.Com., B.Tech, BBA, etc.',
      amount: '₹16,000/-',
      period: isHindi ? 'वार्षिक (प्रति वर्ष)' : 'Annual / Yearly Grant',
      badgeText: isHindi ? 'वार्षिक अनुदान' : 'ANNUAL GRANT',
      color: '#7C3AED',
      bgGradient: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
      cardBg: '#F5F3FF',
      borderColor: '#DDD6FE',
      icon: GraduationCap,
      qualifyingCourse: 'Graduation'
    },
    {
      id: 'slab-6',
      classTitle: isHindi ? 'Post Graduation (परास्नातक)' : 'Post Graduation (Master Degree)',
      classTitleHi: 'Post Graduation (परास्नातक)',
      classTitleEn: 'Post Graduation (Master)',
      subText: isHindi ? 'M.A., M.Sc., M.Com., M.Tech, MBA, आदि' : 'M.A., M.Sc., M.Com., M.Tech, MBA, etc.',
      amount: '₹22,000/-',
      period: isHindi ? 'वार्षिक (प्रति वर्ष)' : 'Annual / Yearly Grant',
      badgeText: isHindi ? 'वार्षिक अनुदान' : 'ANNUAL GRANT',
      color: '#1E3A8A',
      bgGradient: 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)',
      cardBg: '#EFF6FF',
      borderColor: '#BFDBFE',
      icon: Award,
      qualifyingCourse: 'Post Graduation'
    }
  ];

  const slabs = baseSlabs.map(s => {
    const dynamic = (cms?.scholarshipSlabs || []).find(d => d.id === s.id);
    return dynamic ? { ...s, amount: dynamic.amountDisplay || s.amount } : s;
  });

  const eligibilityPoints = isHindi ? [
    { title: 'कक्षा 5वीं से पोस्ट ग्रेजुएशन', desc: 'कक्षा 5वीं से 12वीं, डिप्लोमा, स्नातक अथवा परास्नातक में नियमित अध्ययनरत छात्र।' },
    { title: 'न्यूनतम 50% अंक (Min 50% Marks)', desc: 'पूर्व उत्तीर्ण कक्षा / परीक्षा में न्यूनतम 50% प्राप्तांक या समकक्ष ग्रेड अनिवार्य।' },
    { title: 'वार्षिक आय सीमा ₹2,50,000', desc: 'परिवार अथवा अभिभावक की समस्त स्रोतों से कुल वार्षिक आय ₹2,50,000 से अधिक न हो।' },
    { title: 'भारतीय नागरिक एवं मान्यता प्राप्त संस्थान', desc: 'भारत का मूल नागरिक एवं शासन से मान्यता प्राप्त स्कूल, कॉलेज या विश्वविद्यालय में प्रवेशित।' }
  ] : [
    { title: 'Class 5th to Post Graduation', desc: 'Regularly enrolled in Class 5th to 12th, Diploma, Undergraduate or Post-Graduate courses.' },
    { title: 'Minimum 50% Marks', desc: 'Must have secured at least 50% marks or equivalent grade in the previous qualifying exam.' },
    { title: 'Annual Family Income up to ₹2,50,000', desc: 'Combined annual family income from all sources must not exceed ₹2,50,000 per annum.' },
    { title: 'Indian Citizen & Recognized Institution', desc: 'Bona fide Indian citizen enrolled in a recognized government/private school, college or university.' }
  ];

  const requiredDocuments = isHindi ? [
    'आधार कार्ड (Aadhaar Card)',
    'शैक्षणिक योग्यता अंकसूची (Marksheet)',
    'मूल निवास प्रमाण पत्र (Domicile)',
    'जाति प्रमाण पत्र (Caste Certificate)',
    'सक्षम अधिकारी द्वारा आय प्रमाण पत्र',
    'बैंक पासबुक की स्पष्ट प्रति (Bank Passbook)',
    'बोनाफाइड / प्रवेश प्रमाण पत्र (Admission Proof)',
    'पासपोर्ट साइज नवीनतम फोटो (Passport Photo)'
  ] : [
    'Aadhaar Card (UIDAI Verified)',
    'Previous Class Marksheet / Grade Sheet',
    'Domicile / Residence Certificate',
    'Caste Certificate (if applicable)',
    'Income Certificate issued by Competent Authority',
    'Bank Passbook Copy / Account Details',
    'Institution Bonafide / Admission Receipt',
    'Recent Passport Size Photograph'
  ];

  const keyFeatures = isHindi ? [
    'आर्थिक रूप से कमजोर एवं मेधावी विद्यार्थियों के लिए प्रत्यक्ष वित्तीय संबल',
    'सभी वर्गों (General, OBC, SC, ST) के लिए पारदर्शी एवं समान अवसर',
    'डिजिटल दस्तावेज़ अपलोड एवं संस्थागत सत्यापन से पूरी तरह निष्पक्ष चयन',
    'डायरेक्ट बेनिफिट ट्रांसफर (DBT) के माध्यम से बैंक खाते में सीधे अनुदान जारी'
  ] : [
    'Direct annual financial aid for economically weaker and deserving students',
    'Fair and equal opportunity across all categories (General, OBC, SC, ST)',
    'Fully transparent verification with digital photo and institutional attestation',
    'Direct Benefit Transfer (DBT) credited straight into student bank accounts'
  ];

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      
      {/* 1. Official Poster Header Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #1E3A8A 100%)',
        color: '#FFFFFF',
        padding: '3rem 0 2.75rem',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '4px solid #EAB308'
      }}>
        {/* Background decorative glow */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(234, 179, 8, 0.15) 0%, rgba(255,255,255,0) 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container">
          
          {/* Top Brand, Language Switcher & Tagline Bar from Poster */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.15)',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <img 
                src="/assets/logo.png" 
                alt="Jan Kalyan Manavadhikar Foundation Official Emblem" 
                style={{
                  width: '68px',
                  height: '68px',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  padding: '4px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  border: '2px solid #FEF08A'
                }}
              />
              <div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 900, letterSpacing: '0.04em', color: '#FFFFFF', margin: 0, textTransform: 'uppercase' }}>
                  JAN KALYAN MANAVADHIKAR FOUNDATION
                </h2>
                <div style={{ fontSize: '0.88rem', color: '#FEF08A', fontWeight: 700, marginTop: '2px' }}>
                  {isHindi 
                    ? '— सामाजिक सेवा, मानव अधिकार एवं जनकल्याण के लिए समर्पित —' 
                    : '— Dedicated to Social Welfare, Human Rights & Empowerment —'}
                </div>
              </div>
            </div>

            {/* In-Page Interactive Language Switcher + Tagline */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              
              {/* Language Switcher Buttons */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(10px)',
                borderRadius: '999px',
                padding: '4px',
                border: '1.5px solid rgba(255,255,255,0.25)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}>
                <button
                  type="button"
                  id="scholarship-lang-hi"
                  onClick={() => setSpecificLanguage('hi')}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '999px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    backgroundColor: isHindi ? '#EAB308' : 'transparent',
                    color: isHindi ? '#0F172A' : '#FFFFFF',
                    boxShadow: isHindi ? '0 2px 8px rgba(234, 179, 8, 0.4)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>🇮🇳</span>
                  <span>हिन्दी</span>
                </button>
                
                <button
                  type="button"
                  id="scholarship-lang-en"
                  onClick={() => setSpecificLanguage('en')}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '999px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    backgroundColor: !isHindi ? '#EAB308' : 'transparent',
                    color: !isHindi ? '#0F172A' : '#FFFFFF',
                    boxShadow: !isHindi ? '0 2px 8px rgba(234, 179, 8, 0.4)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Languages size={15} />
                  <span>English</span>
                </button>
              </div>

              {/* Patriotic / Mottos Pill */}
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                padding: '0.55rem 1.15rem',
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.18)',
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#FEF08A',
                letterSpacing: '0.02em',
                textAlign: 'center'
              }}>
                {isHindi ? '🇮🇳 शिक्षित युवा • सशक्त समाज • समृद्ध भारत' : '🇮🇳 Educated Youth • Empowered Society • Prosperous Bharat'}
              </div>
            </div>
          </div>

          {/* Center Poster Title & Last Round Badge */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 0.9fr)', gap: '2.5rem', alignItems: 'center' }}>
            <div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <span style={{
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  padding: '0.4rem 1rem',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  {isHindi ? '📢 2026 का अंतिम राउंड • LAST ROUND' : '📢 2026 FINAL CALL • LAST ROUND'}
                </span>

                <span style={{
                  backgroundColor: '#EAB308',
                  color: '#0F172A',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  fontWeight: 800
                }}>
                  {isHindi ? 'पड़ेगा भारत बढ़ेगा भारत' : 'Padhega Bharat Badhega Bharat'}
                </span>
              </div>

              <h1 style={{
                fontSize: '2.9rem',
                fontWeight: 950,
                color: '#FEF08A',
                lineHeight: 1.15,
                marginBottom: '0.75rem',
                textShadow: '0 4px 12px rgba(0,0,0,0.5)'
              }}>
                SCHOLARSHIP YOJNA 2026
              </h1>

              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem' }}>
                {isHindi ? 'शिक्षा के सपनों को मिलेगा आर्थिक सहयोग' : 'Financial Aid & Scholarship for Your Educational Dreams'}
              </div>

              <div style={{
                display: 'inline-block',
                backgroundColor: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.25)',
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#93C5FD',
                marginBottom: '1.75rem'
              }}>
                {isHindi 
                  ? '🎓 कक्षा 5वीं से Post Graduation एवं Diploma Courses तक' 
                  : '🎓 From Class 5th to Post Graduation & Diploma Courses'}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button 
                  className="btn btn-primary btn-lg" 
                  onClick={() => navigate('/apply')}
                  style={{
                    backgroundColor: '#EAB308',
                    borderColor: '#EAB308',
                    color: '#0F172A',
                    fontWeight: 900,
                    fontSize: '1.05rem',
                    padding: '0.85rem 1.85rem',
                    boxShadow: '0 8px 20px rgba(234, 179, 8, 0.35)'
                  }}
                >
                  <Sparkles size={20} />
                  <span>{isHindi ? 'अभी ऑनलाइन आवेदन करें' : 'Apply Online Now'}</span>
                </button>

                <button 
                  className="btn btn-outline-white btn-lg" 
                  onClick={() => navigate('/track')}
                  style={{ fontWeight: 700 }}
                >
                  <Search size={18} />
                  <span>{isHindi ? 'आवेदन स्थिति ट्रैक करें' : 'Track Application Status'}</span>
                </button>
              </div>
            </div>

            {/* Right: Registration Fee & Helpline Highlight Card from Poster */}
            <div>
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '2rem',
                color: '#0F172A',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                border: '3px solid #FEF08A',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-14px',
                  right: '24px',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  padding: '0.3rem 0.8rem',
                  borderRadius: '999px',
                  boxShadow: '0 4px 10px rgba(220, 38, 38, 0.3)'
                }}>
                  {isHindi ? '📢 अंतिम अवसर सक्रिय!' : '📢 Active Last Round!'}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#DC2626', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                  <BadgePercent size={20} />
                  <span>{isHindi ? 'Registration Fee (आवेदन शुल्क)' : 'Registration Fee (Application Processing)'}</span>
                </div>

                <div style={{ fontSize: '3rem', fontWeight: 950, color: '#DC2626', margin: '0.2rem 0', lineHeight: 1 }}>
                  ₹ 211.30/-
                </div>

                <div style={{ fontSize: '0.88rem', color: '#64748B', fontWeight: 700, marginBottom: '1.5rem' }}>
                  {isHindi 
                    ? '(केवल आवेदन प्रक्रिया हेतु / Application processing only)' 
                    : '(Charged strictly for application processing & verification)'}
                </div>

                <div style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: '1px solid #E2E8F0',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                    {isHindi ? 'कुल छात्रवृत्ति अनुदान सीमा' : 'Annual Scholarship Grant Range'}
                  </div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#1E3A8A', margin: '0.2rem 0' }}>
                    {isHindi ? '₹4,000/- से ₹22,000/- वार्षिक' : '₹4,000/- to ₹22,000/- Yearly'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#16A34A', fontWeight: 700 }}>
                    {isHindi ? '✓ प्रत्यक्ष बैंक अंतरण (Direct Benefit Transfer - DBT)' : '✓ Direct Benefit Transfer (DBT) directly into Student Bank Account'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: '#334155' }}>
                  <Clock size={16} color="#DC2626" />
                  <div>
                    <strong>{isHindi ? 'Help Line समय:' : 'Help Line Operating Hours:'}</strong> {isHindi ? 'सुबह 10:00 बजे से शाम 7:00 बजे तक' : '10:00 AM to 07:00 PM'}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. CHHATRAVRITTI RASHI (6 Color-Coded Slabs from the Poster) */}
      <section className="section-py" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#1E3A8A',
              color: '#FEF08A',
              padding: '0.45rem 1.25rem',
              borderRadius: '999px',
              fontSize: '0.95rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              marginBottom: '1rem',
              boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)'
            }}>
              <GraduationCap size={18} />
              <span>{isHindi ? 'छात्रवृत्ति राशि (SCHOLARSHIP SLABS)' : 'SCHOLARSHIP GRANT SLABS (6 TIERS)'}</span>
              <GraduationCap size={18} />
            </div>

            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.75rem' }}>
              {isHindi 
                ? 'प्रत्येक कक्षा एवं पाठ्यक्रम अनुसार स्वीकृत वार्षिक राशि' 
                : 'Approved Annual Grants for Each Class & Course Tier'}
            </h2>
            <p style={{ color: '#64748B', fontSize: '1.05rem', lineHeight: 1.6 }}>
              {isHindi 
                ? 'फाउंडेशन द्वारा कक्षा 5वीं से लेकर परास्नातक (PG) एवं डिप्लोमा पाठ्यक्रमों के विद्यार्थियों के लिए निर्धारित वित्तीय अनुदान:' 
                : 'Sanctioned yearly financial assistance for students across schools, colleges, ITIs, and professional institutes:'}
            </p>
          </div>

          {/* The 6 Slabs Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            {slabs.map((slab) => {
              const IconComponent = slab.icon;
              return (
                <div 
                  key={slab.id}
                  style={{
                    backgroundColor: slab.cardBg,
                    border: `2px solid ${slab.borderColor}`,
                    borderRadius: '18px',
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.05)';
                  }}
                >
                  {/* Top Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: slab.bgGradient,
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 6px 14px ${slab.color}40`
                    }}>
                      <IconComponent size={22} />
                    </div>

                    <span style={{
                      backgroundColor: slab.color,
                      color: '#FFFFFF',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '0.25rem 0.65rem',
                      borderRadius: '999px',
                      letterSpacing: '0.02em'
                    }}>
                      {slab.badgeText}
                    </span>
                  </div>

                  {/* Course Title */}
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
                      {slab.classTitle}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600, marginBottom: '1.25rem' }}>
                      {slab.subText}
                    </div>
                  </div>

                  {/* Grant Amount Box */}
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: `1px solid ${slab.borderColor}`,
                    marginBottom: '1.25rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '2.25rem', fontWeight: 950, color: slab.color, lineHeight: 1.1 }}>
                      {slab.amount}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, marginTop: '0.3rem' }}>
                      {slab.period}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button 
                    className="btn btn-sm"
                    onClick={() => navigate('/apply')}
                    style={{
                      width: '100%',
                      background: slab.bgGradient,
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '0.65rem',
                      fontWeight: 700,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{isHindi ? 'इस वर्ग हेतु आवेदन करें' : 'Apply for this Category'}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Registration Notice Strip */}
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '2px dashed #F87171',
            borderRadius: '14px',
            padding: '1.25rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <CreditCard size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#991B1B' }}>
                  {isHindi 
                    ? 'आवेदन प्रक्रिया शुल्क: ₹ 211.30/- (केवल आवेदन प्रक्रिया हेतु)' 
                    : 'Application Processing Fee: ₹ 211.30/- (Processing Fee Only)'}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#7F1D1D', marginTop: '2px' }}>
                  {isHindi 
                    ? 'सभी वर्गों एवं पाठ्यक्रमों के लिए एक समान पारदर्शी ऑनलाइन एवं ऑफलाइन आवेदन प्रक्रिया।' 
                    : 'Standard and transparent scrutiny process across all courses and categories without hidden costs.'}
                </div>
              </div>
            </div>

            <button 
              className="btn btn-primary"
              onClick={() => navigate('/apply')}
              style={{ backgroundColor: '#DC2626', borderColor: '#DC2626', fontWeight: 800 }}
            >
              <Sparkles size={16} />
              <span>{isHindi ? 'अभी आवेदन प्रारंभ करें' : 'Start Application Now'}</span>
            </button>
          </div>

        </div>
      </section>

      {/* 3. FOUR CORE PILLARS FROM THE POSTER (Eligibility, Documents, Features, Application Process) */}
      <section className="section-py" style={{ backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
            <span className="badge badge-navy" style={{ marginBottom: '0.75rem' }}>
              SCHEME BLUEPRINT & GUIDELINES
            </span>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 900, color: '#0F172A' }}>
              {isHindi ? 'योजना के चार मुख्य स्तंभ एवं आवश्यक जानकारी' : 'Four Core Pillars & Official Scheme Guidelines'}
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem', marginTop: '0.5rem' }}>
              {isHindi 
                ? 'आधिकारिक पोस्टर के अनुसार पात्रता, आवश्यक दस्तावेज, मुख्य विशेषताएं एवं आवेदन प्रक्रिया:' 
                : 'Official criteria for Eligibility, Required Documents, Advantages, and Step-by-Step Application:'}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.75rem'
          }}>

            {/* Pillar 1: पात्रता (Eligibility) */}
            <div className="card" style={{
              padding: '2rem',
              borderRadius: '16px',
              borderTop: '5px solid #1E40AF',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 12px 30px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#1E40AF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <GraduationCap size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {isHindi ? 'पात्रता (Eligibility)' : 'Eligibility Criteria'}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                    {isHindi ? 'कौन आवेदन कर सकता है' : 'Who Can Apply'}
                  </span>
                </div>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {eligibilityPoints.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.925rem', color: '#334155' }}>
                    <CheckCircle2 size={18} color="#16A34A" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span><strong>{item.title}:</strong> {item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pillar 2: आवश्यक दस्तावेज (Required Documents) */}
            <div className="card" style={{
              padding: '2rem',
              borderRadius: '16px',
              borderTop: '5px solid #DC2626',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 12px 30px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {isHindi ? 'आवश्यक दस्तावेज (Documents)' : 'Required Documents'}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                    {isHindi ? 'सत्यापन हेतु चेकलिस्ट' : 'Verification Checklist'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {requiredDocuments.map((doc, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#334155', backgroundColor: '#F8FAFC', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <CheckCircle2 size={15} color="#DC2626" style={{ flexShrink: 0 }} />
                    <span style={{ lineHeight: 1.3 }}>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pillar 3: योजना की मुख्य विशेषताएं (Key Features) */}
            <div className="card" style={{
              padding: '2rem',
              borderRadius: '16px',
              borderTop: '5px solid #D97706',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 12px 30px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {isHindi ? 'योजना की मुख्य विशेषताएं' : 'Key Scheme Highlights'}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                    {isHindi ? 'प्रमुख लाभ व उद्देश्य' : 'Benefits & Governance'}
                  </span>
                </div>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {keyFeatures.map((feat, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.925rem', color: '#334155' }}>
                    <CheckCircle2 size={18} color="#D97706" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pillar 4: आवेदन प्रक्रिया (Application Process) */}
            <div className="card" style={{
              padding: '2rem',
              borderRadius: '16px',
              borderTop: '5px solid #16A34A',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 12px 30px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {isHindi ? 'आवेदन प्रक्रिया (Process)' : 'Application Process'}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                    {isHindi ? 'चरणबद्ध आवेदन मार्गदर्शिका' : 'Step-by-Step Flow'}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.925rem', color: '#334155', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                {isHindi 
                  ? 'ऑनलाइन एवं ऑफलाइन आवेदन की प्रक्रिया, अंतिम तिथि एवं चयन संबंधी विस्तृत जानकारी Foundation द्वारा समय-समय पर आधिकारिक रूप से जारी की जाती है।' 
                  : 'Detailed timelines, online verification protocols, and merit selection lists are officially declared and published periodically by the Foundation.'}
              </p>

              <div style={{
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                color: '#166534',
                fontWeight: 700,
                textAlign: 'center'
              }}>
                {isHindi ? '🌟 शिक्षा ही सच्चा विकास है 🌟' : '🌟 Education is the True Development 🌟'}
              </div>

              <button 
                className="btn btn-primary"
                onClick={() => navigate('/apply')}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Sparkles size={16} />
                <span>{isHindi ? 'फॉर्म भरें (Start Application)' : 'Fill Application Form'}</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 4. OFFICIAL CONTACT & OFFICE ADDRESS (Directly from the poster image) */}
      <section style={{
        background: '#0F172A',
        color: '#FFFFFF',
        padding: '3.5rem 0',
        borderTop: '4px solid #DC2626'
      }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
            <span style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#FEF08A',
              padding: '0.35rem 1rem',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 800,
              letterSpacing: '0.05em'
            }}>
              VERIFIED FOUNDATION HEADQUARTERS
            </span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#FFFFFF', marginTop: '0.75rem' }}>
              {isHindi ? 'आधिकारिक संपर्क एवं कार्यालय पता' : 'Official Contact & Registered Office Address'}
            </h2>
            <div style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
              {isHindi 
                ? 'जनकल्याण मानवाधिकार फाउंडेशन — आपकी सेवा में सदैव तत्पर' 
                : 'Jan Kalyan Manavadhikar Foundation — At Your Service Always'}
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2.5rem'
          }}>

            {/* Address Box */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '14px',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem'
            }}>
              <MapPin size={28} color="#F87171" style={{ marginTop: '3px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.8rem', color: '#FEF08A', fontWeight: 800, textTransform: 'uppercase' }}>
                  {isHindi ? 'कार्यालय का पता (Office Address)' : 'Official Registered Address'}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginTop: '0.3rem', lineHeight: 1.5 }}>
                  {cms.officeAddress}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.4rem' }}>
                  {isHindi ? 'जबलपुर, मध्य प्रदेश - 482002' : 'Jabalpur, Madhya Pradesh - 482002'}
                </div>
              </div>
            </div>

            {/* Phone & Helpline */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '14px',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem'
            }}>
              <Phone size={28} color="#60A5FA" style={{ marginTop: '3px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.8rem', color: '#FEF08A', fontWeight: 800, textTransform: 'uppercase' }}>
                  {isHindi ? 'संपर्क करें (Helpline Numbers)' : 'Contact Helpline Numbers'}
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.3rem' }}>
                  <a href="tel:0761-4500054" style={{ color: '#FFFFFF', textDecoration: 'none' }}>0761-4500054</a>
                  <span style={{ margin: '0 8px', color: '#94A3B8' }}>|</span>
                  <a href="tel:8871557054" style={{ color: '#FFFFFF', textDecoration: 'none' }}>8871557054</a>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#4ADE80', marginTop: '0.4rem', fontWeight: 600 }}>
                  {isHindi ? 'Help Line समय: सुबह 10:00 बजे से शाम 7:00 बजे तक' : 'Help Line: 10:00 AM to 07:00 PM (IST)'}
                </div>
              </div>
            </div>

            {/* Email */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '14px',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem'
            }}>
              <Mail size={28} color="#FBBF24" style={{ marginTop: '3px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.8rem', color: '#FEF08A', fontWeight: 800, textTransform: 'uppercase' }}>
                  {isHindi ? 'ईमेल पता (Email Address)' : 'Official Email Address'}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginTop: '0.3rem', wordBreak: 'break-all' }}>
                  <a href={`mailto:${cms.officialEmail}`} style={{ color: '#93C5FD' }}>
                    {cms.officialEmail}
                  </a>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.4rem' }}>
                  {isHindi ? 'आधिकारिक शिकायत एवं आवेदन सहायता' : 'Official Queries & Grievances'}
                </div>
              </div>
            </div>

            {/* Website */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '14px',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem'
            }}>
              <Globe size={28} color="#34D399" style={{ marginTop: '3px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.8rem', color: '#FEF08A', fontWeight: 800, textTransform: 'uppercase' }}>
                  {isHindi ? 'आधिकारिक पोर्टल (Official Website)' : 'Official Web Portal'}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginTop: '0.3rem' }}>
                  <a href="https://jankalyanmanavadhikar.in" target="_blank" rel="noopener noreferrer" style={{ color: '#34D399', textDecoration: 'none' }}>
                    jankalyanmanavadhikar.in
                  </a>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.4rem' }}>
                  {isHindi ? '24x7 डिजिटल आवेदन सेवा' : '24x7 Online Scholarship Gateway'}
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Slogan Ribbon from Poster */}
          <div style={{
            textAlign: 'center',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            fontSize: '1.25rem',
            fontWeight: 900,
            color: '#FEF08A',
            letterSpacing: '0.05em'
          }}>
            {isHindi 
              ? '— शिक्षा से सशक्त, अधिकार से सुरक्षित —' 
              : '— Empowered by Education, Protected by Rights —'}
          </div>

        </div>
      </section>

    </div>
  );
};
