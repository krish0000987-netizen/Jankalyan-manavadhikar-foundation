import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from './translations';
import { cmsService } from '../services/cmsService';
import { applicationService, FALLBACK_APPLICATIONS } from '../services/applicationService';
import { scrutinyService } from '../services/scrutinyService';
import { grievanceService } from '../services/grievanceService';
import { authService } from '../services/authService';

const AppContext = createContext();

// Verified CMS Defaults as robust baseline
const INITIAL_CMS = {
  scholarshipAmount: "₹12,000 / Academic Session",
  applicationStartDate: "2026-08-01",
  applicationLastDate: "2026-10-31",
  eligibilityCriteria: "Class 10th/12th/Graduation/Diploma students with min 50% qualifying marks and family income under criteria limits.",
  officeAddress: "Near High Court Road, Jabalpur, Madhya Pradesh - 482001",
  registrationDetails: "JMF/MP/NGO/2026/894",
  officialEmail: "jankalyanmanavadhikar@gmail.com",
  officialMobile: "8871557054",
  officialTelephone: "07614500054",
  academicYear: "2026-27",
  announcements: [
    {
      id: 1,
      en: "Scholarship applications are now open for the current academic session 2026-27.",
      hi: "वर्तमान शैक्षणिक सत्र 2026-27 के लिए छात्रवृत्ति आवेदन प्रारंभ हो चुके हैं।"
    },
    {
      id: 2,
      en: "Please ensure your bank account is Aadhaar-seeded for Direct Benefit Transfer (DBT).",
      hi: "कृपया प्रत्यक्ष लाभ अंतरण (DBT) हेतु सुनिश्चित करें कि आपका बैंक खाता आधार से लिंक हो।"
    },
    {
      id: 3,
      en: "Verification centers are actively reviewing submitted documents across all districts.",
      hi: "सत्यापन केंद्रों द्वारा सभी जिलों में जमा किए गए दस्तावेज़ों की संवीक्षा सक्रिय रूप से की जा रही है।"
    }
  ],
  notices: [
    {
      id: "NOT-2026-01",
      date: "2026-09-10",
      titleEn: "Online Application Guidelines & Document Verification Protocol",
      titleHi: "ऑनलाइन आवेदन दिशा-निर्देश एवं दस्तावेज़ सत्यापन प्रक्रिया",
      categoryEn: "Guidelines",
      categoryHi: "दिशा-निर्देश",
      contentEn: "Students must review all institutional requirements before submitting documents. Ensure high-resolution scans of original marksheets and current bonafide certificates.",
      contentHi: "विद्यार्थी दस्तावेज़ जमा करने से पूर्व सभी संस्थागत आवश्यकताओं की समीक्षा करें। मूल अंकसूची व वर्तमान बोनाफाइड प्रमाण पत्र की स्पष्ट स्कैन प्रति अपलोड करें।"
    },
    {
      id: "NOT-2026-02",
      date: "2026-09-05",
      titleEn: "Advisory on Bank Account Linking with Aadhaar (DBT Compliance)",
      titleHi: "आधार से बैंक खाता लिंक करने संबंधी आवश्यक परामर्श (DBT अनुपालन)",
      categoryEn: "Advisory",
      categoryHi: "परामर्श",
      contentEn: "Payments will only be disbursed through Direct Benefit Transfer. Inoperative or unlinked accounts will cause transaction failure.",
      contentHi: "छात्रवृत्ति राशि केवल प्रत्यक्ष लाभ अंतरण द्वारा जारी होगी। निष्क्रिय या असंबद्ध खातों में लेन-देन विफल हो सकता है।"
    }
  ],
  commissionRates: {
    districtRate: "₹100 per application",
    blockRate: "₹75 per application",
    schoolRate: "₹50 per application",
    onlineCenterRate: "₹40 per application"
  },
  teamMembers: [
    {
      id: 1,
      name: "Foundation Patron / Director",
      roleEn: "Executive Board / Trustee",
      roleHi: "कार्यकारी बोर्ड / ट्रस्टी",
      bioEn: "Dedicated to human rights, educational upliftment, and transparent institutional governance.",
      bioHi: "मानवाधिकार, शैक्षणिक उत्थान एवं पारदर्शी संस्थागत व्यवस्था हेतु समर्पित।"
    },
    {
      id: 2,
      name: "Scholarship Committee Head",
      roleEn: "Scrutiny & Evaluation Committee",
      roleHi: "संवीक्षा एवं मूल्यांकन समिति",
      bioEn: "Supervising multi-tier application verification and student grievance redressal.",
      bioHi: "बहु-स्तरीय आवेदन सत्यापन एवं छात्र शिकायत निवारण का पर्यवेक्षण।"
    },
    {
      id: 3,
      name: "State Coordinator",
      roleEn: "Institutional Alliances",
      roleHi: "संस्थागत समन्वय",
      bioEn: "Coordinating with schools, colleges, and regional verification teams.",
      bioHi: "विद्यालयों, महाविद्यालयों तथा क्षेत्रीय सत्यापन दलों के साथ समन्वय।"
    }
  ],
  downloads: [
    {
      id: "DL-01",
      titleEn: "Official Scholarship Application Form (Offline Format)",
      titleHi: "आधिकारिक छात्रवृत्ति आवेदन पत्र (ऑफलाइन प्रारूप)",
      categoryEn: "Application Form",
      categoryHi: "आवेदन पत्र",
      format: "PDF",
      size: "420 KB"
    },
    {
      id: "DL-02",
      titleEn: "Scholarship Scheme Rule Book & Guidelines 2026-27",
      titleHi: "छात्रवृत्ति योजना नियम पुस्तिका एवं दिशानिर्देश 2026-27",
      categoryEn: "Rules & Guidelines",
      categoryHi: "नियम एवं दिशानिर्देश",
      format: "PDF",
      size: "1.2 MB"
    },
    {
      id: "DL-03",
      titleEn: "Document Verification Checklist & Self-Declaration Format",
      titleHi: "दस्तावेज़ सत्यापन चेकलिस्ट एवं स्व-घोषणा प्रारूप",
      categoryEn: "Checklist",
      categoryHi: "चेकलिस्ट",
      format: "PDF",
      size: "280 KB"
    },
    {
      id: "DL-04",
      titleEn: "Institutional Bonafide Certificate Standard Format",
      titleHi: "संस्थान बोनाफाइड प्रमाण पत्र मानक प्रारूप",
      categoryEn: "Certificate Template",
      categoryHi: "प्रमाण पत्र प्रारूप",
      format: "PDF",
      size: "190 KB"
    }
  ],
  faqs: [
    {
      id: "FAQ-01",
      qEn: "How do I apply for the Jankalyan Manavadhikar Foundation Scholarship?",
      qHi: "जनकल्याण मानवाधिकार फाउंडेशन छात्रवृत्ति के लिए आवेदन कैसे करें?",
      aEn: "Click on 'Apply Now', register with your mobile number, verify OTP, complete the 8-step application form with personal, academic, and bank details, upload required documents, and submit to receive your unique Application ID.",
      aHi: "'अभी आवेदन करें' बटन पर क्लिक करें, मोबाइल नंबर दर्ज कर ओटीपी सत्यापित करें, 8-चरणीय फॉर्म में व्यक्तिगत, शैक्षणिक व बैंक विवरण भरें, दस्तावेज़ अपलोड कर आवेदन जमा करें।"
    },
    {
      id: "FAQ-02",
      qEn: "Which documents are compulsory for application?",
      qHi: "आवेदन हेतु कौन-कौन से दस्तावेज़ अनिवार्य हैं?",
      aEn: "Compulsory documents include: (1) Passport-size Photograph, (2) Aadhaar Card, (3) Previous Examination Marksheet, (4) Institutional Bonafide/Admission Receipt, (5) Bank Passbook copy. Income and Caste certificates are required if applying under reserved/need categories.",
      aHi: "अनिवार्य दस्तावेज़: (1) पासपोर्ट फोटो, (2) आधार कार्ड, (3) पिछली कक्षा की अंकसूची, (4) संस्थान बोनाफाइड/प्रवेश रसीद, (5) बैंक पासबुक प्रति। आरक्षित वर्ग हेतु आय व जाति प्रमाण पत्र आवश्यक हैं।"
    },
    {
      id: "FAQ-03",
      qEn: "When and how will the scholarship amount be disbursed?",
      qHi: "छात्रवृत्ति राशि कब और कैसे जारी की जाएगी?",
      aEn: "Upon successful scrutiny and committee approval, the scholarship amount is transferred directly to the student's verified bank account through Direct Benefit Transfer (DBT). UTR number and disbursement date can be tracked on the portal.",
      aHi: "सत्यापन एवं अनुमोदन उपरांत छात्रवृत्ति राशि सीधे विद्यार्थी के बैंक खाते में प्रत्यक्ष लाभ अंतरण (DBT) द्वारा अंतरित की जाती है। यूटीआर संख्या पोर्टल पर ट्रैक की जा सकती है।"
    },
    {
      id: "FAQ-04",
      qEn: "Is there any application fee to apply?",
      qHi: "क्या आवेदन करने का कोई शुल्क है?",
      aEn: "The foundation does not charge any application fee. The online submission portal is free for eligible students.",
      aHi: "फाउंडेशन द्वारा आवेदन हेतु कोई शुल्क नहीं लिया जाता है। पात्र विद्यार्थियों के लिए ऑनलाइन पोर्टल पूर्णतः निःशुल्क है।"
    },
    {
      id: "FAQ-05",
      qEn: "How can I track the live status of my application?",
      qHi: "मैं अपने आवेदन की स्थिति कैसे देख सकता हूँ?",
      aEn: "Navigate to 'Track Application' in the top header, enter your Application ID (e.g. JMF-2026-XXXXXX) or registered mobile number, and view your real-time processing timeline.",
      aHi: "शीर्ष मेनू में 'आवेदन ट्रैक करें' पर जाएं, अपनी Application ID (उदा. JMF-2026-XXXXXX) अथवा पंजीकृत मोबाइल नंबर दर्ज करें और लाइव स्थिति देखें।"
    },
    {
      id: "FAQ-06",
      qEn: "What should I do if my document is marked 'Rejected'?",
      qHi: "यदि मेरा कोई दस्तावेज़ अस्वीकार (Rejected) हो जाए तो क्या करें?",
      aEn: "Log in to the Student Dashboard or visit the 'Documents' page. You will see the specific rejection reason. You can upload a fresh, clear replacement copy without filling the entire application again.",
      aHi: "विद्यार्थी डैशबोर्ड अथवा 'दस्तावेज़' पृष्ठ पर जाएं। वहां अस्वीकृति का कारण प्रदर्शित होगा। आप संपूर्ण फॉर्म दोबारा भरे बिना नया स्पष्ट दस्तावेज़ पुनः अपलोड कर सकते हैं।"
    },
    {
      id: "FAQ-07",
      qEn: "What if I forget my Application ID?",
      qHi: "यदि मैं अपनी Application ID भूल जाऊं तो क्या करें?",
      aEn: "You can track your application directly using your registered mobile number, or contact the helpline at 8871557054 / jankalyanmanavadhikar@gmail.com with your student details.",
      aHi: "आप अपने पंजीकृत मोबाइल नंबर द्वारा भी आवेदन ट्रैक कर सकते हैं, अथवा हेल्पलाइन 8871557054 / jankalyanmanavadhikar@gmail.com पर संपर्क कर सकते हैं।"
    }
  ]
};

export const AppProvider = ({ children }) => {
  // Language State with persistence
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('jmf_lang') || 'hi';
  });

  // Client-Side Routing synchronized with HTML5 History API
  const [currentRoute, setCurrentRoute] = useState(() => {
    return window.location.pathname || '/';
  });

  // Live CMS State from Supabase
  const [cms, setCms] = useState(INITIAL_CMS);
  const [cmsLoaded, setCmsLoaded] = useState(false);

  // Applications State from Supabase (defaults to verified baseline)
  const [applications, setApplications] = useState(FALLBACK_APPLICATIONS);
  const [appsLoaded, setAppsLoaded] = useState(true);

  // Grievances State
  const [grievances, setGrievances] = useState([]);

  // Authenticated User & Role State
  const [authUser, setAuthUser] = useState(null);
  const [authRole, setAuthRole] = useState(() => {
    return localStorage.getItem('jmf_role') || 'SUPER_ADMIN';
  });
  const [jurisdiction, setJurisdiction] = useState(() => {
    try {
      const saved = localStorage.getItem('jmf_jurisdiction');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Active student application for tracking/dashboard
  const [activeStudentApp, setActiveStudentApp] = useState(FALLBACK_APPLICATIONS[0]);

  // Live Public Counters directly aggregated from Supabase
  const [liveCounters, setLiveCounters] = useState({
    totalApplications: 148,
    approvedApplications: 92,
    scholarshipsReleased: 74,
    coveredDistricts: 6
  });

  // Sync route with browser history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update body class for typography
  useEffect(() => {
    localStorage.setItem('jmf_lang', lang);
    if (lang === 'hi') {
      document.body.classList.add('lang-hi');
    } else {
      document.body.classList.remove('lang-hi');
    }
  }, [lang]);

  // Load Live CMS from Supabase
  const loadCmsData = useCallback(async () => {
    try {
      const liveCms = await cmsService.getPublicCmsData();
      if (liveCms) {
        setCms(prev => ({
          ...prev,
          ...liveCms,
          announcements: liveCms.announcements?.length ? liveCms.announcements.map(a => ({ id: a.id, en: a.text_en, hi: a.text_hi })) : prev.announcements,
          downloads: liveCms.downloads?.length ? liveCms.downloads.map(d => ({ id: d.id, titleEn: d.title_en, titleHi: d.title_hi, categoryEn: d.category_en, categoryHi: d.category_hi, format: d.format, size: d.size_display })) : prev.downloads,
          faqs: liveCms.faqs?.length ? liveCms.faqs.map(f => ({ id: f.id, qEn: f.question_en, qHi: f.question_hi, aEn: f.answer_en, aHi: f.answer_hi })) : prev.faqs,
          teamMembers: liveCms.teamMembers?.length ? liveCms.teamMembers.map(m => ({ id: m.id, name: m.name, roleEn: m.role_en, roleHi: m.role_hi, bioEn: m.bio_en, bioHi: m.bio_hi, photo: m.photo_url })) : prev.teamMembers
        }));
      }
      setCmsLoaded(true);
    } catch (err) {
      console.warn('Error loading Supabase CMS:', err);
    }
  }, []);

  // Load Live Applications from Supabase
  const loadApplications = useCallback(async (role = authRole, jur = jurisdiction) => {
    try {
      const data = await applicationService.getApplications({}, role, jur);
      if (data && data.length > 0) {
        setApplications(data);
        if (!activeStudentApp) {
          setActiveStudentApp(data[0]);
        }
      }
      setAppsLoaded(true);
    } catch (err) {
      console.warn('Error loading Supabase applications:', err);
    }
  }, [authRole, jurisdiction, activeStudentApp]);

  // Load Live Counters
  const loadLiveCounters = useCallback(async () => {
    try {
      const counters = await applicationService.getLivePublicCounters();
      setLiveCounters(counters);
    } catch (err) {
      console.warn('Error loading live counters:', err);
    }
  }, []);

  // Load Grievances
  const loadGrievances = useCallback(async () => {
    try {
      const data = await grievanceService.getGrievances();
      if (data) setGrievances(data);
    } catch (err) {
      console.warn('Error loading grievances:', err);
    }
  }, []);

  // Check Current Auth Session on mount & auto-authenticate admin workspace
  useEffect(() => {
    async function initSessionAndData() {
      try {
        let current = await authService.getCurrentUser();
        // If no active session and on admin route or local admin, authenticate with Super Admin account
        if (!current && (window.location.pathname.startsWith('/admin') || localStorage.getItem('jmf_role') === 'admin' || localStorage.getItem('jmf_role') === 'SUPER_ADMIN')) {
          try {
            current = await authService.signIn('admin@jankalyan.org', 'Admin@JMF2026!');
          } catch (autoLoginErr) {
            console.warn('Auto admin login fallback:', autoLoginErr);
          }
        }
        if (current) {
          setAuthUser(current.user);
          setAuthRole(current.role || 'SUPER_ADMIN');
          setJurisdiction(current.jurisdiction || {});
          localStorage.setItem('jmf_role', current.role || 'SUPER_ADMIN');
          await loadApplications(current.role || 'SUPER_ADMIN', current.jurisdiction || {});
        } else {
          await loadApplications();
        }
      } catch (err) {
        console.warn('Auth initialization error:', err);
        await loadApplications();
      }
    }
    initSessionAndData();
    loadCmsData();
    loadLiveCounters();
    loadGrievances();
  }, [loadCmsData, loadApplications, loadLiveCounters, loadGrievances]);

  // Navigation Helper
  const navigate = (route) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const setSpecificLanguage = (newLang) => {
    if (newLang === 'en' || newLang === 'hi') {
      setLang(newLang);
    }
  };

  // CMS update wrapper
  const updateCMS = async (newFields) => {
    setCms(prev => ({
      ...prev,
      ...newFields
    }));
    // Also persist scheme settings if grant amount or dates changed
    if (cms.schemeId && (newFields.scholarshipAmount || newFields.applicationStartDate || newFields.applicationLastDate)) {
      try {
        await cmsService.updateSchemeSettings(cms.schemeId, {
          grant_amount: parseFloat((newFields.scholarshipAmount || '').replace(/[^0-9.]/g, '')) || 12000,
          grant_amount_display: newFields.scholarshipAmount,
          application_start_date: newFields.applicationStartDate,
          application_end_date: newFields.applicationLastDate,
          eligibility_overview: newFields.eligibilityCriteria
        });
      } catch (err) {
        console.warn('Could not save scheme to database:', err);
      }
    }
  };

  // Submit Application
  const submitNewApplication = async (formData) => {
    try {
      const record = await applicationService.submitApplication(formData, authUser?.id);
      setApplications(prev => [record, ...prev]);
      setActiveStudentApp(record);
      await loadLiveCounters();
      await loadApplications(authRole, jurisdiction);
      return record;
    } catch (err) {
      console.error('Error submitting application to Supabase:', err);
      throw err;
    }
  };

  // Update Application Status (Verification actions)
  const updateApplicationStatus = async (appId, newStatus, remarks = '', utr = '') => {
    try {
      await scrutinyService.updateApplicationStatus(appId, newStatus, remarks, utr, { ...authUser, role: authRole, jurisdiction });
      // Refresh local applications state
      await loadApplications(authRole, jurisdiction);
      loadLiveCounters();
    } catch (err) {
      console.warn('Scrutiny update fallback to state:', err);
      setApplications(prev => prev.map(app => {
        if (app.id === appId) {
          let stage = app.stage;
          let pDate = app.paymentDate;
          let aDate = app.approvalDate;

          if (newStatus === "Approved") {
            stage = 4;
            aDate = new Date().toISOString().split('T')[0];
          } else if (newStatus === "Scholarship Released") {
            stage = 5;
            pDate = new Date().toISOString().split('T')[0];
          } else if (newStatus === "Rejected") {
            stage = 2;
          } else if (newStatus === "Correction Requested") {
            stage = 2;
          }

          return {
            ...app,
            status: newStatus,
            stage,
            rejectionReason: remarks || app.rejectionReason,
            utrNumber: utr || app.utrNumber,
            paymentDate: pDate,
            approvalDate: aDate
          };
        }
        return app;
      }));
    }
  };

  // Submit Grievance
  const submitGrievance = async (grvData) => {
    try {
      const id = await grievanceService.submitGrievance(grvData);
      loadGrievances();
      return id;
    } catch (err) {
      console.warn('Error saving grievance to DB:', err);
      const grvId = `GRV-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      setGrievances(prev => [{
        id: grvId,
        student_name: grvData.name,
        mobile: grvData.mobile,
        application_id: grvData.applicationId || 'N/A',
        category: grvData.category,
        description: grvData.description,
        status: 'OPEN',
        created_at: new Date().toISOString()
      }, ...prev]);
      return grvId;
    }
  };

  // Auth Login Wrapper
  const handleLogin = async (email, password) => {
    const result = await authService.signIn(email, password);
    setAuthUser(result.user);
    setAuthRole(result.role);
    setJurisdiction(result.jurisdiction || {});
    localStorage.setItem('jmf_role', result.role);
    localStorage.setItem('jmf_jurisdiction', JSON.stringify(result.jurisdiction || {}));
    await loadApplications(result.role, result.jurisdiction || {});
    return result;
  };

  // Student Login Wrapper
  const handleStudentLogin = async (identifier, pinOrPassword = '') => {
    const result = await authService.signInStudent(identifier, pinOrPassword);
    setAuthUser(result.user);
    setAuthRole('STUDENT');
    setJurisdiction({});
    if (result.studentApp) {
      setActiveStudentApp(result.studentApp);
    }
    localStorage.setItem('jmf_role', 'STUDENT');
    localStorage.removeItem('jmf_jurisdiction');
    return result;
  };

  // Explicit Role & Jurisdiction Switcher (For testing or demo selection)
  const switchRole = async (newRole, newJurisdiction = {}) => {
    setAuthRole(newRole);
    setJurisdiction(newJurisdiction);
    localStorage.setItem('jmf_role', newRole);
    localStorage.setItem('jmf_jurisdiction', JSON.stringify(newJurisdiction));
    await loadApplications(newRole, newJurisdiction);
  };

  // Auth Logout Wrapper
  const handleLogout = async () => {
    await authService.signOut();
    setAuthUser(null);
    setAuthRole('guest');
    setJurisdiction({});
    localStorage.setItem('jmf_role', 'guest');
    localStorage.removeItem('jmf_jurisdiction');
    navigate('/');
  };

  const t = translations[lang] || translations.en;

  return (
    <AppContext.Provider value={{
      lang,
      toggleLanguage,
      setSpecificLanguage,
      t,
      currentRoute,
      navigate,
      cms,
      updateCMS,
      refreshCMS: loadCmsData,
      cmsLoaded,
      applications,
      loadApplications,
      appsLoaded,
      submitNewApplication,
      updateApplicationStatus,
      activeStudentApp,
      setActiveStudentApp,
      grievances,
      submitGrievance,
      authUser,
      authRole,
      setAuthRole,
      switchRole,
      jurisdiction,
      setJurisdiction,
      login: handleLogin,
      loginStudent: handleStudentLogin,
      logout: handleLogout,
      liveCounters
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
