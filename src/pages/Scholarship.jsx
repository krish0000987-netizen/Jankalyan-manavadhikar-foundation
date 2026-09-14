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
  BadgePercent
} from 'lucide-react';

export const Scholarship = () => {
  const { lang, t, navigate, cms } = useApp();

  const slabs = [
    {
      id: 'slab-1',
      classTitleHi: '5वीं से 7वीं',
      classTitleEn: '5th to 7th Class',
      subText: 'कक्षा 5, 6, 7 अध्ययनरत',
      amount: '₹4,000/-',
      period: 'वार्षिक / Yearly',
      color: '#0284C7',
      bgGradient: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
      cardBg: '#F0F9FF',
      borderColor: '#BAE6FD',
      icon: BookOpen,
      qualifyingCourse: 'Class 5th - 7th'
    },
    {
      id: 'slab-2',
      classTitleHi: '8वीं से 10वीं',
      classTitleEn: '8th to 10th Class',
      subText: 'कक्षा 8, 9, 10 हाई स्कूल',
      amount: '₹8,000/-',
      period: 'वार्षिक / Yearly',
      color: '#16A34A',
      bgGradient: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
      cardBg: '#F0FDF4',
      borderColor: '#BBF7D0',
      icon: BookOpen,
      qualifyingCourse: 'Class 8th - 10th'
    },
    {
      id: 'slab-3',
      classTitleHi: '11वीं से 12वीं',
      classTitleEn: '11th to 12th Class',
      subText: 'कक्षा 11 व 12 हायर सेकेंडरी',
      amount: '₹12,000/-',
      period: 'वार्षिक / Yearly',
      color: '#E11D48',
      bgGradient: 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)',
      cardBg: '#FFF1F2',
      borderColor: '#FECDD3',
      icon: BookOpen,
      qualifyingCourse: 'Class 11th - 12th'
    },
    {
      id: 'slab-4',
      classTitleHi: 'Diploma / Polytechnic / ITI',
      classTitleEn: 'Diploma / Polytechnic / ITI',
      subText: 'तकनीकी एवं व्यावसायिक डिप्लोमा',
      amount: '₹14,000/-',
      period: 'वार्षिक / Yearly',
      color: '#D97706',
      bgGradient: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
      cardBg: '#FFFBEB',
      borderColor: '#FDE68A',
      icon: Wrench,
      qualifyingCourse: 'Diploma / Polytechnic / ITI'
    },
    {
      id: 'slab-5',
      classTitleHi: 'Graduation (स्नातक)',
      classTitleEn: 'Graduation (Degree)',
      subText: 'B.A., B.Sc., B.Com., B.Tech, etc.',
      amount: '₹16,000/-',
      period: 'वार्षिक / Yearly',
      color: '#7C3AED',
      bgGradient: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
      cardBg: '#F5F3FF',
      borderColor: '#DDD6FE',
      icon: GraduationCap,
      qualifyingCourse: 'Graduation'
    },
    {
      id: 'slab-6',
      classTitleHi: 'Post Graduation (परास्नातक)',
      classTitleEn: 'Post Graduation (Master)',
      subText: 'M.A., M.Sc., M.Com., M.Tech, MBA',
      amount: '₹22,000/-',
      period: 'वार्षिक / Yearly',
      color: '#1E3A8A',
      bgGradient: 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)',
      cardBg: '#EFF6FF',
      borderColor: '#BFDBFE',
      icon: Award,
      qualifyingCourse: 'Post Graduation'
    }
  ];

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      
      {/* 1. Official Poster Header Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #1E3A8A 100%)',
        color: '#FFFFFF',
        padding: '3.5rem 0 3rem',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '4px solid #EAB308'
      }}>
        {/* Background decorative elements */}
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
          {/* Top Brand & Tagline Bar from Poster */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
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
                <h2 style={{ fontSize: '1.55rem', fontWeight: 900, letterSpacing: '0.04em', color: '#FFFFFF', margin: 0, textTransform: 'uppercase' }}>
                  JAN KALYAN MANAVADHIKAR FOUNDATION
                </h2>
                <div style={{ fontSize: '0.88rem', color: '#FEF08A', fontWeight: 700, marginTop: '2px' }}>
                  — सामाजिक सेवा, मानव अधिकार एवं जनकल्याण के लिए समर्पित —
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              padding: '0.6rem 1.25rem',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.2)',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#FEF08A',
              letterSpacing: '0.02em',
              textAlign: 'center'
            }}>
              🇮🇳 शिक्षित युवा • सशक्त समाज • समृद्ध भारत
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
                  📢 2026 का अंतिम राउंड • LAST ROUND
                </span>

                <span style={{
                  backgroundColor: '#EAB308',
                  color: '#0F172A',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  fontWeight: 800
                }}>
                  पड़ेगा भारत बढ़ेगा भारत
                </span>
              </div>

              <h1 style={{
                fontSize: '3rem',
                fontWeight: 950,
                color: '#FEF08A',
                lineHeight: 1.15,
                marginBottom: '0.75rem',
                textShadow: '0 4px 12px rgba(0,0,0,0.5)'
              }}>
                SCHOLARSHIP YOJNA 2026
              </h1>

              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem' }}>
                शिक्षा के सपनों को मिलेगा आर्थिक सहयोग
              </div>

              <div style={{
                display: 'inline-block',
                backgroundColor: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.25)',
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#93C5FD',
                marginBottom: '1.75rem'
              }}>
                🎓 कक्षा 5वीं से Post Graduation एवं Diploma Courses तक
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
                  <span>{lang === 'hi' ? 'अभी ऑनलाइन आवेदन करें' : 'Apply Online Now'}</span>
                </button>

                <button 
                  className="btn btn-outline-white btn-lg" 
                  onClick={() => navigate('/track')}
                  style={{ fontWeight: 700 }}
                >
                  <Search size={18} />
                  <span>{lang === 'hi' ? 'आवेदन स्थिति ट्रैक करें' : 'Track Application'}</span>
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
                  📢 जल्द ही जारी किया जाएगा!
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#DC2626', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                  <BadgePercent size={20} />
                  <span>Registration Fee (आवेदन शुल्क)</span>
                </div>

                <div style={{ fontSize: '3rem', fontWeight: 950, color: '#DC2626', margin: '0.2rem 0', lineHeight: 1 }}>
                  ₹ 211.30/-
                </div>

                <div style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 700, marginBottom: '1.5rem' }}>
                  (केवल आवेदन प्रक्रिया हेतु / Application processing only)
                </div>

                <div style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: '1px solid #E2E8F0',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                    कुल छात्रवृत्ति अनुदान सीमा
                  </div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#1E3A8A', margin: '0.2rem 0' }}>
                    ₹4,000/- से ₹22,000/- वार्षिक
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#16A34A', fontWeight: 700 }}>
                    ✓ प्रत्यक्ष बैंक अंतरण (Direct Benefit Transfer - DBT)
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: '#334155' }}>
                  <Clock size={16} color="#DC2626" />
                  <div>
                    <strong>Help Line समय:</strong> सुबह 10:00 बजे से शाम 7:00 बजे तक
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
              <span>छात्रवृत्ति राशि (SCHOLARSHIP SLABS)</span>
              <GraduationCap size={18} />
            </div>

            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.75rem' }}>
              प्रत्येक कक्षा एवं पाठ्यक्रम अनुसार स्वीकृत वार्षिक राशि
            </h2>
            <p style={{ color: '#64748B', fontSize: '1.05rem', lineHeight: 1.6 }}>
              फाउंडेशन द्वारा कक्षा 5वीं से लेकर परास्नातक (PG) एवं डिप्लोमा पाठ्यक्रमों के विद्यार्थियों के लिए निर्धारित वित्तीय अनुदान:
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
                      ANNUAL GRANT
                    </span>
                  </div>

                  {/* Course Title */}
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
                      {slab.classTitleHi}
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
                    <span>इस वर्ग हेतु आवेदन करें</span>
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
                  आवेदन प्रक्रिया शुल्क: ₹ 211.30/- (केवल आवेदन प्रक्रिया हेतु)
                </div>
                <div style={{ fontSize: '0.85rem', color: '#7F1D1D', marginTop: '2px' }}>
                  सभी वर्गों एवं पाठ्यक्रमों के लिए एक समान पारदर्शी ऑनलाइन एवं ऑफलाइन आवेदन प्रक्रिया।
                </div>
              </div>
            </div>

            <button 
              className="btn btn-primary"
              onClick={() => navigate('/apply')}
              style={{ backgroundColor: '#DC2626', borderColor: '#DC2626', fontWeight: 800 }}
            >
              <Sparkles size={16} />
              <span>अभी आवेदन प्रारंभ करें</span>
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
              योजना के चार मुख्य स्तंभ एवं आवश्यक जानकारी
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem', marginTop: '0.5rem' }}>
              आधिकारिक पोस्टर के अनुसार पात्रता, आवश्यक दस्तावेज, मुख्य विशेषताएं एवं आवेदन प्रक्रिया:
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
                    पात्रता (Eligibility)
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Who Can Apply</span>
                </div>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.925rem', color: '#334155' }}>
                  <CheckCircle2 size={18} color="#16A34A" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span><strong>भारतीय नागरिक</strong> (Applicant must be an Indian citizen)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.925rem', color: '#334155' }}>
                  <CheckCircle2 size={18} color="#16A34A" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span><strong>कक्षा 5वीं से पोस्ट ग्रेजुएशन तक</strong> (Enrolled from Class 5th to PG level)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.925rem', color: '#334155' }}>
                  <CheckCircle2 size={18} color="#16A34A" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span><strong>सरकारी / मान्यता प्राप्त संस्थान में अध्ययनरत</strong> (Enrolled in Recognized/Govt Institution)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.925rem', color: '#334155' }}>
                  <CheckCircle2 size={18} color="#16A34A" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span><strong>आर्थिक रूप से कमजोर वर्ग</strong> (विभिन्न श्रेणियों के जरूरतमंद विद्यार्थी)</span>
                </li>
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
                    आवश्यक दस्तावेज (Documents)
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Checklist for Verification</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155', backgroundColor: '#F8FAFC', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <CheckCircle2 size={15} color="#DC2626" />
                  <span>आधार कार्ड</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155', backgroundColor: '#F8FAFC', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <CheckCircle2 size={15} color="#DC2626" />
                  <span>शैक्षणिक योग्यता प्रमाण पत्र</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155', backgroundColor: '#F8FAFC', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <CheckCircle2 size={15} color="#DC2626" />
                  <span>निवास प्रमाण पत्र</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155', backgroundColor: '#F8FAFC', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <CheckCircle2 size={15} color="#DC2626" />
                  <span>जाति प्रमाण पत्र (यदि लागू हो)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155', backgroundColor: '#F8FAFC', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <CheckCircle2 size={15} color="#DC2626" />
                  <span>आय प्रमाण पत्र</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155', backgroundColor: '#F8FAFC', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <CheckCircle2 size={15} color="#DC2626" />
                  <span>बैंक पासबुक की प्रति</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155', backgroundColor: '#F8FAFC', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <CheckCircle2 size={15} color="#DC2626" />
                  <span>Bonafide / Admission Proof</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155', backgroundColor: '#F8FAFC', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <CheckCircle2 size={15} color="#DC2626" />
                  <span>पासपोर्ट साइज फोटो</span>
                </div>
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
                    योजना की मुख्य विशेषताएं
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Key Advantages</span>
                </div>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.925rem', color: '#334155' }}>
                  <CheckCircle2 size={18} color="#D97706" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>आर्थिक रूप से कमजोर एवं सेवायति विद्यार्थियों के लिए प्रत्यक्ष संबल</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.925rem', color: '#334155' }}>
                  <CheckCircle2 size={18} color="#D97706" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>सभी वर्गों (General, OBC, SC, ST) के लिए समान व न्यायसंगत अवसर</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.925rem', color: '#334155' }}>
                  <CheckCircle2 size={18} color="#D97706" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>डिजिटल फोटो एवं ऑनलाइन सत्यापन से पारदर्शी प्रक्रिया</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.925rem', color: '#334155' }}>
                  <CheckCircle2 size={18} color="#D97706" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>शिक्षा, कौशल एवं उज्ज्वल भविष्य के लिए निरंतर सहयोग</span>
                </li>
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
                    आवेदन प्रक्रिया (Process)
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Step by Step</span>
                </div>
              </div>

              <p style={{ fontSize: '0.925rem', color: '#334155', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                ऑनलाइन एवं ऑफलाइन आवेदन की प्रक्रिया, अंतिम तिथि एवं चयन संबंधी विस्तृत जानकारी Foundation द्वारा समय-समय पर आधिकारिक रूप से जारी की जाती है।
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
                🌟 शिक्षा ही सच्चा विकास है 🌟
              </div>

              <button 
                className="btn btn-primary"
                onClick={() => navigate('/apply')}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Sparkles size={16} />
                <span>फॉर्म भरें (Start Application)</span>
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
              आधिकारिक संपर्क एवं कार्यालय पता
            </h2>
            <div style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
              जनकल्याण मानवाधिकार फाउंडेशन — आपकी सेवा में सदैव तत्पर
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
                  Office Address
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginTop: '0.3rem', lineHeight: 1.5 }}>
                  {cms.officeAddress}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.4rem' }}>
                  Ward No. 30, Dixit Colony, Pin: 482002
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
                  संपर्क करें (Contact Numbers)
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.3rem' }}>
                  <a href="tel:0761-4500054" style={{ color: '#FFFFFF', textDecoration: 'none' }}>0761-4500054</a>
                  <span style={{ margin: '0 8px', color: '#94A3B8' }}>|</span>
                  <a href="tel:8871557054" style={{ color: '#FFFFFF', textDecoration: 'none' }}>8871557054</a>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#4ADE80', marginTop: '0.4rem', fontWeight: 600 }}>
                  Help Line: सुबह 10:00 बजे से शाम 7:00 बजे तक
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
                  Email Address
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginTop: '0.3rem', wordBreak: 'break-all' }}>
                  <a href={`mailto:${cms.officialEmail}`} style={{ color: '#93C5FD' }}>
                    {cms.officialEmail}
                  </a>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.4rem' }}>
                  Official Grievance & Application Queries
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
                  Official Portal Website
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginTop: '0.3rem' }}>
                  <a href="https://jankalyanmanavadhikar.in" target="_blank" rel="noopener noreferrer" style={{ color: '#34D399', textDecoration: 'none' }}>
                    jankalyanmanavadhikar.in
                  </a>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.4rem' }}>
                  24x7 Digital Application Gateway
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
            — शिक्षा से सशक्त, अधिकार से सुरक्षित —
          </div>

        </div>
      </section>

    </div>
  );
};
