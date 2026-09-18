import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Search, 
  Calendar, 
  CreditCard, 
  GraduationCap, 
  FileCheck, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Users, 
  FileText, 
  HelpCircle, 
  Phone, 
  Mail, 
  AlertCircle,
  Award,
  BookOpen,
  Send,
  Pause,
  Play
} from 'lucide-react';
import { INDIA_ZONES } from '../data/indiaLocations';

export const Home = () => {
  const { lang, t, navigate, cms, applications, liveCounters, refreshCMS } = useApp();

  // Guarantee homepage always displays live published CMS content on mount
  useEffect(() => {
    if (refreshCMS) {
      refreshCMS(true);
    }
  }, [refreshCMS]);

  // If admin edits in another tab/window and focuses homepage, immediately re-sync
  useEffect(() => {
    const handleFocus = () => {
      if (refreshCMS) {
        refreshCMS(true);
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refreshCMS]);

  // Fallback slides
  const defaultSlides = [
    { image: '/assets/hero_slide_1.jpg', alt: 'Indian students studying in open school courtyard', duration: 3000 },
    { image: '/assets/hero_slide_2.jpg', alt: 'College and university students collaborating in library', duration: 3000 },
    { image: '/assets/hero_slide_3.jpg', alt: 'Teacher imparting education in school classroom', duration: 3000 },
    { image: '/assets/hero_slide_4.jpg', alt: 'Student academic presentation and scholastic achievement', duration: 3000 },
    { image: '/assets/hero_slide_5.jpg', alt: 'Modern digital computer lab education', duration: 3000 },
    { image: '/assets/hero_slide_6.jpg', alt: 'Higher education research and university library study', duration: 3000 }
  ];

  // Dynamic CMS-driven hero slides
  const activeCmsSlides = (cms.heroSlides && cms.heroSlides.length > 0)
    ? cms.heroSlides.filter(s => s.is_active !== false)
    : [];

  const slides = activeCmsSlides.length > 0
    ? activeCmsSlides.map(s => ({
        ...s,
        image: s.image_url || s.image || '/assets/hero_slide_1.jpg',
        alt: lang === 'hi' ? (s.heading_hi || s.alt_text_hi || 'Scholarship Scheme') : (s.heading_en || s.alt_text_en || 'Scholarship Scheme'),
        duration: s.slide_duration_ms || 3000
      }))
    : defaultSlides;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeNoticeModal, setActiveNoticeModal] = useState(null);
  const [faqExpanded, setFaqExpanded] = useState(null);

  const activeSlide = slides[currentSlide] || slides[0];
  const heroEyebrowText = (lang === 'hi' 
    ? (activeSlide?.eyebrow_hi || activeSlide?.eyebrow_en) 
    : (activeSlide?.eyebrow_en || activeSlide?.eyebrow_hi)) || t.heroEyebrow;
  const heroTitleText = (lang === 'hi' 
    ? (activeSlide?.heading_hi || activeSlide?.heading_en) 
    : (activeSlide?.heading_en || activeSlide?.heading_hi)) || t.heroTitle;
  const heroDescText = (lang === 'hi' 
    ? (activeSlide?.description_hi || activeSlide?.description_en) 
    : (activeSlide?.description_en || activeSlide?.description_hi)) || t.heroDesc;

  // Dynamic slideshow timer adhering to configured duration
  useEffect(() => {
    if (!isPlaying || slides.length === 0) return;
    const duration = slides[currentSlide]?.duration || 3000;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, duration);
    return () => clearInterval(interval);
  }, [isPlaying, slides.length, currentSlide, slides]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div>
      {/* ====================================================================
          HERO SLIDESHOW SECTION (3-second auto transition, Ken Burns, Dual CTA)
          ==================================================================== */}
      <section className="hero-slider-container">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            aria-hidden={index !== currentSlide}
          >
            <img 
              src={slide.image} 
              alt={slide.alt} 
              className="hero-slide-bg" 
            />
            <div className="hero-overlay" />
          </div>
        ))}

        <div className="hero-caption">
          <div className="container">
            <div className="hero-content">
              <div className="hero-eyebrow">
                <Sparkles size={14} color="#FEF08A" />
                <span>{heroEyebrowText}</span>
              </div>

              <h1 className="hero-title">
                {heroTitleText}
              </h1>

              <p className="hero-description">
                {heroDescText}
              </p>

              <div className="hero-actions">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate('/apply')}
                  id="hero-apply-btn"
                >
                  <Sparkles size={18} />
                  <span>{t.heroCtaApply}</span>
                </button>

                <button 
                  className="btn btn-outline-white btn-lg"
                  onClick={() => navigate('/track')}
                  id="hero-track-btn"
                >
                  <Search size={18} />
                  <span>{t.heroCtaTrack}</span>
                </button>

                <button 
                  className="btn btn-outline-white btn-lg"
                  onClick={() => navigate('/merit-list')}
                  id="hero-merit-btn"
                  style={{ backgroundColor: 'rgba(254, 240, 138, 0.15)', borderColor: '#FEF08A', color: '#FEF08A' }}
                >
                  <Award size={18} />
                  <span>{lang === 'hi' ? 'मेरिट सूची 2026-27' : 'Merit List 2026-27'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Manual Slideshow Controls */}
        <button 
          className="slider-arrow prev" 
          onClick={handlePrevSlide} 
          aria-label="Previous Slide"
        >
          <ChevronLeft size={24} />
        </button>

        <button 
          className="slider-arrow next" 
          onClick={handleNextSlide} 
          aria-label="Next Slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Indicators & Play/Pause */}
        <div className="slider-indicators">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            style={{ color: '#FFFFFF', padding: '4px', marginRight: '6px' }}
            title={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          {slides.map((_, i) => (
            <button
              key={i}
              className={`slider-dot ${i === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ====================================================================
          SECTION 1: SCHOLARSHIP OVERVIEW CARDS (Using CMS / Editable values)
          ==================================================================== */}
      <section className="container">
        <div className="overview-grid">
          
          <div className="overview-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span className="badge badge-blue">Direct Benefit</span>
              <CreditCard size={20} color="#1E40AF" />
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
              {t.overviewAmountTitle || 'Annual Scholarship Grant Range'}
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1B2A4E', margin: '0.4rem 0' }}>
              <span className="editable-field">{cms.scholarshipAmount || '₹4,000/- to ₹22,000/- Yearly'}</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
              {t.overviewAmountDesc || '✓ Direct Benefit Transfer (DBT) directly into Student Bank Account'}
            </div>
          </div>

          <div className="overview-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span className="badge badge-red">Timeline</span>
              <Calendar size={20} color="#DC2626" />
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
              {t.overviewStartTitle}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1B2A4E', margin: '0.4rem 0' }}>
              <span className="editable-field">{cms.applicationStartDate || '15/09/2026'}</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
              {t.overviewStartDesc}
            </div>
          </div>

          <div className="overview-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span className="badge badge-yellow">Deadline</span>
              <Clock size={20} color="#D97706" />
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
              {t.overviewLastTitle}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1B2A4E', margin: '0.4rem 0' }}>
              <span className="editable-field">{cms.applicationLastDate || '30/11/2026'}</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
              {t.overviewLastDesc}
            </div>
          </div>

          <div className="overview-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span className="badge badge-green">Eligibility</span>
              <GraduationCap size={20} color="#16A34A" />
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
              {t.overviewEligibilityTitle || 'Eligibility Criteria'}
            </div>
            <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#1B2A4E', margin: '0.4rem 0', lineHeight: 1.45 }}>
              <span className="editable-field">
                {cms.eligibilityCriteria || t.overviewEligibilityDesc || 'Class 5th to Post Graduation students with min 50% marks in Graduation and family income up to ₹2,50,000.'}
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#16A34A', fontWeight: 700 }}>
              ✓ Class 5th to Post Graduation • Min 50% Marks • Income ≤ ₹2,50,000
            </div>
          </div>

        </div>
      </section>

      {/* ====================================================================
          SECTION 2: OBJECTIVE / योजना का उद्देश्य (2-Column Editorial Layout)
          ==================================================================== */}
      <section className="section-py" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div className="grid-editorial">
            <div>
              <span className="badge badge-blue" style={{ marginBottom: '1rem' }}>
                {t.objBadge}
              </span>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.5rem', lineHeight: 1.25 }}>
                {t.objTitle}
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#334155', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                {t.objP1}
              </p>
              <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7, marginBottom: '2rem' }}>
                {t.objP2}
              </p>

              <div className="form-row-2" style={{ marginBottom: '2rem' }}>
                <div style={{ padding: '1.25rem', backgroundColor: '#F8FAFC', borderRadius: '12px', borderLeft: '4px solid #1E40AF' }}>
                  <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem', fontSize: '0.95rem' }}>
                    {t.objFeature1}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                    {t.objFeature1Desc}
                  </div>
                </div>

                <div style={{ padding: '1.25rem', backgroundColor: '#F8FAFC', borderRadius: '12px', borderLeft: '4px solid #DC2626' }}>
                  <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem', fontSize: '0.95rem' }}>
                    {t.objFeature2}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                    {t.objFeature2Desc}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-secondary" onClick={() => navigate('/about')}>
                  <span>{lang === 'hi' ? 'फाउंडेशन के बारे में पढ़ें' : 'Read About Foundation'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(15, 23, 42, 0.12)',
                border: '1px solid #E2E8F0'
              }}>
                <img 
                  src="/assets/about_mission.jpg" 
                  alt="Students engaged in learning"
                  className="mission-img" style={{ width: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Floating Trust Emblem */}
              <div className="floating-trust-badge">
                <Award size={32} color="#F59E0B" />
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94A3B8', fontWeight: 600 }}>
                    {lang === 'hi' ? 'आधिकारिक योजना' : 'Official Yojna'}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                    Jankalyan Manavadhikar
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 3: WHO CAN APPLY? (Configurable Eligibility Categories)
          ==================================================================== */}
      <section className="section-py" style={{ backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
            <span className="badge badge-navy" style={{ marginBottom: '0.75rem' }}>
              {t.whoBadge}
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
              {t.whoTitle}
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem' }}>
              {t.whoDesc}
            </p>
          </div>

          <div className="grid-4">
            
            <div className="card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <BookOpen size={24} color="#1E40AF" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0F172A' }}>
                {t.whoCatSchool}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {t.whoCatSchoolDesc}
              </p>
              <div style={{ fontSize: '0.8rem', color: '#1E40AF', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>{lang === 'hi' ? 'नियमित अध्ययनरत' : 'Regular Enrolled'}</span>
                <CheckCircle2 size={14} />
              </div>
            </div>

            <div className="card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <GraduationCap size={24} color="#DC2626" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0F172A' }}>
                {t.whoCatCollege}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {t.whoCatCollegeDesc}
              </p>
              <div style={{ fontSize: '0.8rem', color: '#DC2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>{lang === 'hi' ? 'डिग्री व डिप्लोमा' : 'Degree & Diploma'}</span>
                <CheckCircle2 size={14} />
              </div>
            </div>

            <div className="card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Building2 size={24} color="#D97706" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0F172A' }}>
                {t.whoCatHigher}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {t.whoCatHigherDesc}
              </p>
              <div style={{ fontSize: '0.8rem', color: '#D97706', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>{lang === 'hi' ? 'तकनीकी व उच्च शिक्षा' : 'Technical & PG'}</span>
                <CheckCircle2 size={14} />
              </div>
            </div>

            <div className="card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Users size={24} color="#16A34A" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0F172A' }}>
                {t.whoCatSpecial}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {t.whoCatSpecialDesc}
              </p>
              <div style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>{lang === 'hi' ? 'आरक्षित एवं जरूरतमंद' : 'Need & Merit Based'}</span>
                <CheckCircle2 size={14} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 4: HOW IT WORKS (5-Step Road Map)
          ==================================================================== */}
      <section className="section-py" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
            <span className="badge badge-blue" style={{ marginBottom: '0.75rem' }}>
              {t.howBadge}
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
              {t.howTitle}
            </h2>
          </div>

          <div className="grid-5">
            
            <div style={{ padding: '1.5rem', backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0', position: 'relative' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1E40AF', opacity: 0.2, position: 'absolute', top: '1rem', right: '1.25rem' }}>
                01
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0F172A', marginBottom: '0.6rem' }}>
                {t.howStep1}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6 }}>
                {t.howStep1Desc}
              </div>
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0', position: 'relative' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#DC2626', opacity: 0.2, position: 'absolute', top: '1rem', right: '1.25rem' }}>
                02
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0F172A', marginBottom: '0.6rem' }}>
                {t.howStep2}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6 }}>
                {t.howStep2Desc}
              </div>
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0', position: 'relative' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#D97706', opacity: 0.2, position: 'absolute', top: '1rem', right: '1.25rem' }}>
                03
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0F172A', marginBottom: '0.6rem' }}>
                {t.howStep3}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6 }}>
                {t.howStep3Desc}
              </div>
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0', position: 'relative' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#16A34A', opacity: 0.2, position: 'absolute', top: '1rem', right: '1.25rem' }}>
                04
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0F172A', marginBottom: '0.6rem' }}>
                {t.howStep4}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6 }}>
                {t.howStep4Desc}
              </div>
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0', position: 'relative' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#7C3AED', opacity: 0.2, position: 'absolute', top: '1rem', right: '1.25rem' }}>
                05
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0F172A', marginBottom: '0.6rem' }}>
                {t.howStep5}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6 }}>
                {t.howStep5Desc}
              </div>
            </div>

          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/apply')}>
              <Sparkles size={18} />
              <span>{t.heroCtaApply}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 5: NOTICE BOARD (Live Official Notices)
          ==================================================================== */}
      <section className="section-py" style={{ backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-yellow" style={{ marginBottom: '0.5rem' }}>
                {t.noticeBadge}
              </span>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A' }}>
                {t.noticeTitle}
              </h2>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/downloads')}>
              <FileText size={15} />
              <span>{t.navDownloads}</span>
            </button>
          </div>

          <div className="grid-3">
            {(cms.notices || []).filter(n => n.isPublished !== false).map((n) => (
              <div key={n.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span className="badge badge-blue">
                    {lang === 'hi' ? n.categoryHi : n.categoryEn}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                    {n.date}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                  {lang === 'hi' ? n.titleHi : n.titleEn}
                </h3>

                <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6, marginBottom: '1.5rem', flexGrow: 1 }}>
                  {lang === 'hi' ? n.contentHi : n.contentEn}
                </p>

                <button 
                  className="btn btn-outline btn-sm" 
                  style={{ alignSelf: 'flex-start' }}
                  onClick={() => setActiveNoticeModal(n)}
                >
                  <span>{t.noticeReadMore}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notice Detail Modal */}
      {activeNoticeModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '600px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span className="badge badge-blue">
                {lang === 'hi' ? activeNoticeModal.categoryHi : activeNoticeModal.categoryEn}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                {activeNoticeModal.date}
              </span>
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
              {lang === 'hi' ? activeNoticeModal.titleHi : activeNoticeModal.titleEn}
            </h3>

            <div style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              {lang === 'hi' ? activeNoticeModal.contentHi : activeNoticeModal.contentEn}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveNoticeModal(null)}
              >
                {lang === 'hi' ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          SECTION 6: WHY APPLY? (Institutional Integrity Pillars)
          ==================================================================== */}
      <section className="section-py" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
            <span className="badge badge-red" style={{ marginBottom: '0.75rem' }}>
              {t.whyBadge}
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
              {t.whyTitle}
            </h2>
          </div>

          <div className="grid-3">
            
            <div className="card">
              <div style={{ color: '#1E40AF', marginBottom: '1rem' }}>
                <ShieldAlert size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                {t.whyPillar1Title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6 }}>
                {t.whyPillar1Desc}
              </p>
            </div>

            <div className="card">
              <div style={{ color: '#DC2626', marginBottom: '1rem' }}>
                <Send size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                {t.whyPillar2Title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6 }}>
                {t.whyPillar2Desc}
              </p>
            </div>

            <div className="card">
              <div style={{ color: '#D97706', marginBottom: '1rem' }}>
                <Search size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                {t.whyPillar3Title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6 }}>
                {t.whyPillar3Desc}
              </p>
            </div>

            <div className="card">
              <div style={{ color: '#16A34A', marginBottom: '1rem' }}>
                <FileCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                {t.whyPillar4Title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6 }}>
                {t.whyPillar4Desc}
              </p>
            </div>

            <div className="card">
              <div style={{ color: '#7C3AED', marginBottom: '1rem' }}>
                <CreditCard size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                {t.whyPillar5Title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6 }}>
                {t.whyPillar5Desc}
              </p>
            </div>

            <div className="card">
              <div style={{ color: '#0284C7', marginBottom: '1rem' }}>
                <HelpCircle size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                {t.whyPillar6Title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6 }}>
                {t.whyPillar6Desc}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 7: REQUIRED DOCUMENTS (Visual Document Cards)
          ==================================================================== */}
      <section className="section-py" style={{ backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
            <span className="badge badge-navy" style={{ marginBottom: '0.75rem' }}>
              {t.docBadge}
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem' }}>
              {t.docTitle}
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem' }}>
              {t.docSub}
            </p>
          </div>

          <div className="grid-4">
            
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ color: '#1E40AF', marginBottom: '0.75rem' }}><FileText size={22} /></div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.35rem' }}>{t.doc1}</h4>
              <p style={{ fontSize: '0.775rem', color: '#64748B' }}>{t.doc1Sub}</p>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ color: '#1E40AF', marginBottom: '0.75rem' }}><FileText size={22} /></div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.35rem' }}>{t.doc2}</h4>
              <p style={{ fontSize: '0.775rem', color: '#64748B' }}>{t.doc2Sub}</p>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ color: '#1E40AF', marginBottom: '0.75rem' }}><FileText size={22} /></div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.35rem' }}>{t.doc3}</h4>
              <p style={{ fontSize: '0.775rem', color: '#64748B' }}>{t.doc3Sub}</p>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ color: '#1E40AF', marginBottom: '0.75rem' }}><FileText size={22} /></div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.35rem' }}>{t.doc4}</h4>
              <p style={{ fontSize: '0.775rem', color: '#64748B' }}>{t.doc4Sub}</p>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ color: '#1E40AF', marginBottom: '0.75rem' }}><FileText size={22} /></div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.35rem' }}>{t.doc5}</h4>
              <p style={{ fontSize: '0.775rem', color: '#64748B' }}>{t.doc5Sub}</p>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ color: '#D97706', marginBottom: '0.75rem' }}><FileText size={22} /></div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.35rem' }}>{t.doc6}</h4>
              <p style={{ fontSize: '0.775rem', color: '#64748B' }}>{t.doc6Sub}</p>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ color: '#D97706', marginBottom: '0.75rem' }}><FileText size={22} /></div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.35rem' }}>{t.doc7}</h4>
              <p style={{ fontSize: '0.775rem', color: '#64748B' }}>{t.doc7Sub}</p>
            </div>

            <div className="card" style={{ padding: '1.25rem', backgroundColor: '#EFF6FF', borderColor: '#BFDBFE', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontWeight: 700, color: '#1E40AF', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                {lang === 'hi' ? 'दस्तावेज़ दिशानिर्देश' : 'Upload Guidelines'}
              </div>
              <p style={{ fontSize: '0.775rem', color: '#334155', marginBottom: '0.75rem' }}>
                {t.allowedFilesHint}
              </p>
              <button 
                className="btn btn-outline btn-sm" 
                style={{ backgroundColor: '#FFFFFF' }}
                onClick={() => navigate('/documents')}
              >
                <span>{t.navDocuments}</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 8: NATIONWIDE SCALE & PAN-INDIA REACH (All 28 States & UTs)
          ==================================================================== */}
      <section className="section-py" style={{ backgroundColor: '#0F172A', color: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle decorative background glow */}
        <div style={{ position: 'absolute', top: '-120px', right: '-120px', width: '380px', height: '380px', background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(15,23,42,0) 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '360px', height: '360px', background: 'radial-gradient(circle, rgba(220,38,38,0.15) 0%, rgba(15,23,42,0) 70%)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 3rem' }}>
            <span className="badge" style={{ backgroundColor: 'rgba(254,240,138,0.15)', color: '#FEF08A', marginBottom: '0.75rem', fontWeight: 800, letterSpacing: '0.05em' }}>
              🇮🇳 {t.impactBadge}
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.9rem', lineHeight: 1.25 }}>
              {t.impactTitle}
            </h2>
            <p style={{ color: '#CBD5E1', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {t.impactNote}
            </p>
          </div>

          {/* 4 Primary Nationwide Scale Pillars */}
          <div className="grid-stats" style={{ marginBottom: '2.5rem' }}>
            
            <div style={{ padding: '2rem 1.25rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', backdropFilter: 'blur(8px)' }}>
              <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '12px', backgroundColor: 'rgba(59,130,246,0.15)', marginBottom: '0.75rem', color: '#60A5FA' }}>
                <Building2 size={28} />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
                28+
              </div>
              <div style={{ color: '#F8FAFC', fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                {t.statStates}
              </div>
              <div style={{ color: '#94A3B8', fontSize: '0.8rem', lineHeight: 1.4 }}>
                {t.statStatesSub}
              </div>
            </div>

            <div style={{ padding: '2rem 1.25rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', backdropFilter: 'blur(8px)' }}>
              <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '12px', backgroundColor: 'rgba(250,204,21,0.15)', marginBottom: '0.75rem', color: '#FACC15' }}>
                <Award size={28} />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#FEF08A', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
                750+
              </div>
              <div style={{ color: '#F8FAFC', fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                {t.statDistricts}
              </div>
              <div style={{ color: '#94A3B8', fontSize: '0.8rem', lineHeight: 1.4 }}>
                {t.statDistrictsSub}
              </div>
            </div>

            <div style={{ padding: '2rem 1.25rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', backdropFilter: 'blur(8px)' }}>
              <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '12px', backgroundColor: 'rgba(96,165,250,0.15)', marginBottom: '0.75rem', color: '#93C5FD' }}>
                <GraduationCap size={28} />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#93C5FD', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
                100%
              </div>
              <div style={{ color: '#F8FAFC', fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                {t.statInstitutions}
              </div>
              <div style={{ color: '#94A3B8', fontSize: '0.8rem', lineHeight: 1.4 }}>
                {t.statInstitutionsSub}
              </div>
            </div>

            <div style={{ padding: '2rem 1.25rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', backdropFilter: 'blur(8px)' }}>
              <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '12px', backgroundColor: 'rgba(74,222,128,0.15)', marginBottom: '0.75rem', color: '#4ADE80' }}>
                <CheckCircle2 size={28} />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#4ADE80', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
                DBT
              </div>
              <div style={{ color: '#F8FAFC', fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                {t.statDisbursed}
              </div>
              <div style={{ color: '#94A3B8', fontSize: '0.8rem', lineHeight: 1.4 }}>
                {t.statDisbursedSub}
              </div>
            </div>

          </div>

          {/* Regional Zonal Presence Grid */}
          <div style={{ 
            backgroundColor: 'rgba(255,255,255,0.03)', 
            border: '1px solid rgba(255,255,255,0.08)', 
            borderRadius: '16px', 
            padding: '1.75rem',
            marginTop: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>🌐</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  {t.panIndiaCoverageTitle}
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge" style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: '#86EFAC', fontSize: '0.72rem', fontWeight: 700 }}>
                  ✓ Central & State Boards
                </span>
                <span className="badge" style={{ backgroundColor: 'rgba(59,130,246,0.15)', color: '#93C5FD', fontSize: '0.72rem', fontWeight: 700 }}>
                  ✓ Higher Education & ITI
                </span>
                <span className="badge" style={{ backgroundColor: 'rgba(234,179,8,0.15)', color: '#FDE047', fontSize: '0.72rem', fontWeight: 700 }}>
                  ✓ University & Colleges
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {INDIA_ZONES.map(zone => (
                <div key={zone.id} style={{ 
                  backgroundColor: 'rgba(255,255,255,0.04)', 
                  border: '1px solid rgba(255,255,255,0.06)', 
                  borderRadius: '12px', 
                  padding: '1rem' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 800, color: '#F1F5F9', fontSize: '0.9rem' }}>
                      {lang === 'hi' ? zone.nameHi : zone.nameEn}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#38BDF8', fontWeight: 700, backgroundColor: 'rgba(56,189,248,0.1)', padding: '2px 8px', borderRadius: '10px' }}>
                      Active Network
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8', lineHeight: 1.5 }}>
                    {zone.states.slice(0, 4).join(', ')}{zone.states.length > 4 ? ` & ${zone.states.length - 4} more` : ''}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              flexWrap: 'wrap', 
              gap: '1rem', 
              marginTop: '1.5rem', 
              paddingTop: '1.25rem', 
              borderTop: '1px solid rgba(255,255,255,0.08)' 
            }}>
              <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                {lang === 'hi' 
                  ? 'देश के किसी भी राज्य या केंद्र शासित प्रदेश के मान्यता प्राप्त संस्थान के विद्यार्थी आवेदन के पात्र हैं।' 
                  : 'Students enrolled in any recognized institution across all 28 States and 8 Union Territories are eligible to apply.'}
              </div>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => navigate('/apply')}
                style={{ backgroundColor: '#DC2626', borderColor: '#DC2626', fontWeight: 800, padding: '0.5rem 1.25rem' }}
              >
                <span>{lang === 'hi' ? 'अखिल भारतीय आवेदन करें' : 'Apply Online (All India)'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ====================================================================
          SECTION 9: FAQ ACCORDION PREVIEW
          ==================================================================== */}
      <section className="section-py" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container-narrow">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-yellow" style={{ marginBottom: '0.75rem' }}>
              {t.faqBadge}
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem' }}>
              {t.faqTitle}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {cms.faqs.slice(0, 4).map((f) => {
              const isOpen = faqExpanded === f.id;
              return (
                <div 
                  key={f.id}
                  style={{
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: isOpen ? '#F8FAFC' : '#FFFFFF'
                  }}
                >
                  <button
                    onClick={() => setFaqExpanded(isOpen ? null : f.id)}
                    style={{
                      width: '100%',
                      padding: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      fontWeight: 700,
                      color: '#0F172A',
                      fontSize: '1.05rem'
                    }}
                  >
                    <span>{lang === 'hi' ? f.qHi : f.qEn}</span>
                    <span style={{ fontSize: '1.5rem', color: '#64748B', lineHeight: 1 }}>
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 1.25rem 1.25rem', color: '#475569', fontSize: '0.95rem', lineHeight: 1.7 }}>
                      {lang === 'hi' ? f.aHi : f.aEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn btn-outline" onClick={() => navigate('/faq')}>
              <span>{t.faqViewAll}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 10: CONTACT & GRIEVANCE CTA BANNER
          ==================================================================== */}
      <section style={{ backgroundColor: '#F8FAFC', paddingBottom: '5rem' }}>
        <div className="container">
          <div className="cta-banner-box">
            <div style={{ maxWidth: '640px' }}>
              <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#FEF08A', marginBottom: '1rem' }}>
                {lang === 'hi' ? 'समर्पित सहायता' : 'Dedicated Support'}
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem', lineHeight: 1.3 }}>
                {t.ctaBannerTitle}
              </h2>
              <p style={{ color: '#CBD5E1', fontSize: '1.05rem', lineHeight: 1.6 }}>
                {t.ctaBannerDesc}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '340px' }}>
              <a 
                href={`tel:${cms.officialMobile}`} 
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                <Phone size={16} />
                <span>{t.ctaCallBtn} ({cms.officialMobile})</span>
              </a>

              <a 
                href={`mailto:${cms.officialEmail}`} 
                className="btn btn-outline-white"
                style={{ width: '100%' }}
              >
                <Mail size={16} />
                <span>{t.ctaEmailBtn}</span>
              </a>

              <button 
                className="btn btn-gold"
                style={{ width: '100%' }}
                onClick={() => navigate('/grievance')}
              >
                <AlertCircle size={16} />
                <span>{t.ctaGrievanceBtn}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
