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
  scholarshipAmount: "₹4,000/- to ₹22,000/- Yearly",
  registrationFee: "₹ 211.30/-",
  registrationFeeNote: "₹ 211.30/- (केवल आवेदन प्रक्रिया हेतु)",
  applicationStartDate: "15/09/2026",
  applicationLastDate: "30/11/2026",
  eligibilityCriteria: "Class 5th to Post Graduation students with min 50% marks in Graduation and family income up to ₹2,50,000.",
  officeAddress: "Ward No. 30, Shri Ram College Road, Dixit Colony, Jabalpur, Pin Code: 482002",
  registrationDetails: "JMF/MP/NGO/2026/894",
  officialEmail: "jankalyanmanavadhikar@gmail.com",
  officialMobile: "8871557054",
  officialTelephone: "0761-4500054",
  officialWebsite: "https://jankalyanmanavadhikar.in",
  helplineHours: "सुबह 10:00 बजे से शाम 7:00 बजे तक (10:00 AM – 07:00 PM)",
  academicYear: "2026-27",
  scholarshipSlabs: [
    {
      id: 'slab-1',
      classes: 'Class 5th - 7th',
      titleHi: '5वीं से 7वीं',
      titleEn: '5th to 7th Class',
      amount: 4000,
      amountDisplay: '₹4,000/-',
      period: 'वार्षिक / Yearly',
      themeColor: '#0284C7',
      bgLight: '#F0F9FF',
      borderLight: '#BAE6FD',
      eligibleDesc: 'कक्षा 5वीं, 6वीं एवं 7वीं के अध्ययनरत छात्र-छात्राएं'
    },
    {
      id: 'slab-2',
      classes: 'Class 8th - 10th',
      titleHi: '8वीं से 10वीं',
      titleEn: '8th to 10th Class',
      amount: 8000,
      amountDisplay: '₹8,000/-',
      period: 'वार्षिक / Yearly',
      themeColor: '#16A34A',
      bgLight: '#F0FDF4',
      borderLight: '#BBF7D0',
      eligibleDesc: 'कक्षा 8वीं, 9वीं एवं 10वीं (हाई स्कूल) के विद्यार्थी'
    },
    {
      id: 'slab-3',
      classes: 'Class 11th - 12th',
      titleHi: '11वीं से 12वीं',
      titleEn: '11th to 12th Class',
      amount: 12000,
      amountDisplay: '₹12,000/-',
      period: 'वार्षिक / Yearly',
      themeColor: '#E11D48',
      bgLight: '#FFF1F2',
      borderLight: '#FECDD3',
      eligibleDesc: 'कक्षा 11वीं एवं 12वीं (हायर सेकेंडरी / संकाय स्तर) के छात्र'
    },
    {
      id: 'slab-4',
      classes: 'Diploma / Polytechnic / ITI',
      titleHi: 'Diploma / Polytechnic / ITI',
      titleEn: 'Diploma / Polytechnic / ITI',
      amount: 14000,
      amountDisplay: '₹14,000/-',
      period: 'वार्षिक / Yearly',
      themeColor: '#D97706',
      bgLight: '#FFFBEB',
      borderLight: '#FDE68A',
      eligibleDesc: 'पॉलिटेक्निक, आईटीआई एवं तकनीकी डिप्लोमा पाठ्यक्रम'
    },
    {
      id: 'slab-5',
      classes: 'Graduation',
      titleHi: 'Graduation (स्नातक)',
      titleEn: 'Graduation (Undergraduate)',
      amount: 16000,
      amountDisplay: '₹16,000/-',
      period: 'वार्षिक / Yearly',
      themeColor: '#7C3AED',
      bgLight: '#F5F3FF',
      borderLight: '#DDD6FE',
      eligibleDesc: 'बी.ए., बी.एससी., बी.कॉम., बी.टेक., बी.सी.ए. एवं समकक्ष स्नातक'
    },
    {
      id: 'slab-6',
      classes: 'Post Graduation',
      titleHi: 'Post Graduation (परास्नातक)',
      titleEn: 'Post Graduation (Master Degree)',
      amount: 22000,
      amountDisplay: '₹22,000/-',
      period: 'वार्षिक / Yearly',
      themeColor: '#1E3A8A',
      bgLight: '#EFF6FF',
      borderLight: '#BFDBFE',
      eligibleDesc: 'एम.ए., एम.एससी., एम.कॉम., एम.टेक., एम.बी.ए. एवं समकक्ष परास्नातक'
    }
  ],
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
      date: "2026-09-15",
      titleEn: "Online Application Guidelines & Document Verification Protocol",
      titleHi: "ऑनलाइन आवेदन दिशा-निर्देश एवं दस्तावेज़ सत्यापन प्रक्रिया",
      categoryEn: "Guidelines",
      categoryHi: "दिशा-निर्देश",
      contentEn: "Students must review all institutional requirements before submitting documents. Ensure high-resolution scans of original marksheets and current bonafide certificates.",
      contentHi: "विद्यार्थी दस्तावेज़ जमा करने से पूर्व सभी संस्थागत आवश्यकताओं की समीक्षा करें। मूल अंकसूची व वर्तमान बोनाफाइड प्रमाण पत्र की स्पष्ट स्कैन प्रति अपलोड करें।"
    },
    {
      id: "NOT-2026-02",
      date: "2026-09-12",
      titleEn: "Advisory on Bank Account Linking with Aadhaar (DBT Compliance)",
      titleHi: "आधार से बैंक खाता लिंक करने संबंधी आवश्यक परामर्श (DBT अनुपालन)",
      categoryEn: "Advisory",
      categoryHi: "परामर्श",
      contentEn: "Scholarship grants will only be disbursed through Direct Benefit Transfer. Ensure bank account is active and linked with Aadhaar for seamless DBT credit.",
      contentHi: "छात्रवृत्ति राशि केवल प्रत्यक्ष लाभ अंतरण द्वारा जारी होगी। निर्बाध डीबीटी क्रेडिट हेतु बैंक खाता सक्रिय एवं आधार से लिंक होना सुनिश्चित करें।"
    },
    {
      id: "NOT-2026-03",
      date: "2026-09-10",
      titleEn: "Eligibility Notice: 50% Minimum Qualifying Marks & ₹2,50,000 Annual Income Limit",
      titleHi: "पात्रता सूचना: न्यूनतम 50% प्राप्तांक एवं ₹2,50,000 वार्षिक आय सीमा",
      categoryEn: "Eligibility",
      categoryHi: "पात्रता",
      contentEn: "Applicants across Class 5th to Post Graduation must possess at least 50% marks in their qualifying examination. Family annual income must not exceed ₹2,50,000 as certified by competent authority.",
      contentHi: "कक्षा 5वीं से पोस्ट ग्रेजुएशन तक के आवेदकों को पिछली परीक्षा में न्यूनतम 50% अंक प्राप्त होना आवश्यक है। सक्षम अधिकारी द्वारा प्रमाणित वार्षिक पारिवारिक आय ₹2,50,000 से अधिक नहीं होनी चाहिए।"
    },
    {
      id: "NOT-2026-04",
      date: "2026-09-08",
      titleEn: "Direct Benefit Transfer (DBT) Installment Payout & Disbursal Protocol",
      titleHi: "प्रत्यक्ष लाभ अंतरण (DBT) किस्त भुगतान एवं संवितरण प्रक्रिया",
      categoryEn: "Disbursement",
      categoryHi: "भुगतान",
      contentEn: "Sanctioned scholarship grants may be disbursed in scheduled bank installments. Both current credited installment and remaining balance can be tracked directly on student dashboard.",
      contentHi: "स्वीकृत छात्रवृत्ति राशि निर्धारित बैंक किस्तों में जारी की जा सकती है। वर्तमान भुगतान की गई किस्त एवं शेष राशि की स्थिति विद्यार्थी डैशबोर्ड पर लाइव देखी जा सकती है।"
    },
    {
      id: "NOT-2026-05",
      date: "2026-09-05",
      titleEn: "District & Block Nodal Scrutiny Schedule for Session 2026-27",
      titleHi: "सत्र 2026-27 हेतु जिला एवं ब्लॉक नोडल संवीक्षा समय-सारणी",
      categoryEn: "Administration",
      categoryHi: "प्रशासनिक",
      contentEn: "Institutional heads and district coordinators are instructed to complete primary verification of uploaded student records within 5 working days of receipt.",
      contentHi: "संस्था प्रमुखों एवं जिला समन्वयकों को प्राप्त विद्यार्थी आवेदनों का प्राथमिक दस्तावेज़ सत्यापन 5 कार्यदिवसों के भीतर पूर्ण करने के निर्देश दिए जाते हैं।"
    },
    {
      id: "NOT-2026-06",
      date: "2026-09-01",
      titleEn: "Grievance Redressal & Defective Document Re-upload Facility",
      titleHi: "छात्र शिकायत निवारण एवं दस्तावेज़ पुनः अपलोड सुविधा",
      categoryEn: "Support",
      categoryHi: "सहायता",
      contentEn: "If any uploaded certificate is marked defective during scrutiny, students can view the specific officer remarks and upload a replacement copy directly via Document Portal.",
      contentHi: "यदि संवीक्षा के दौरान कोई दस्तावेज़ त्रुटिपूर्ण पाया जाता है, तो विद्यार्थी संबंधित कारण देखकर दस्तावेज़ पोर्टल से सीधे नया स्पष्ट दस्तावेज़ पुनः अपलोड कर सकते हैं।"
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
      aEn: "Yes, a nominal application registration and scrutiny processing fee of ₹ 211.30 is required. It is payable securely online via Razorpay (UPI, Debit/Credit Card, Net Banking) during application submission.",
      aHi: "हाँ, सत्र 2026-27 हेतु छात्रवृत्ति आवेदन पंजीकरण एवं दस्तावेज़ संवीक्षा प्रक्रिया हेतु ₹ 211.30 का नाममात्र शुल्क अनिवार्य है। इसका भुगतान रेजरपे के माध्यम से ऑनलाइन (UPI, कार्ड, नेट बैंकिंग) सुरक्षित रूप से किया जाता है।"
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
  const [authLoading, setAuthLoading] = useState(true);
  const [authUser, setAuthUser] = useState(() => {
    try {
      const savedRole = localStorage.getItem('jmf_role');
      const savedAdmin = localStorage.getItem('jmf_admin_user');
      if (savedAdmin && savedRole && savedRole !== 'guest') {
        return JSON.parse(savedAdmin);
      }
      const savedStudent = localStorage.getItem('jmf_student_user');
      if (savedStudent && savedRole === 'STUDENT') {
        return JSON.parse(savedStudent);
      }
    } catch (e) {}
    return null;
  });
  const [authRole, setAuthRole] = useState(() => {
    try {
      const savedRole = localStorage.getItem('jmf_role');
      const savedAdmin = localStorage.getItem('jmf_admin_user');
      const savedStudent = localStorage.getItem('jmf_student_user');
      if (savedRole && (savedAdmin || savedStudent)) {
        return savedRole;
      }
    } catch (e) {}
    return 'guest';
  });
  const [jurisdiction, setJurisdiction] = useState(() => {
    try {
      const saved = localStorage.getItem('jmf_jurisdiction');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Active student application for tracking/dashboard (restored from localStorage, null by default)
  const [activeStudentApp, setActiveStudentApp] = useState(() => {
    try {
      const saved = localStorage.getItem('jmf_active_student_app');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Automatically keep localStorage in sync whenever activeStudentApp changes
  useEffect(() => {
    try {
      if (activeStudentApp) {
        localStorage.setItem('jmf_active_student_app', JSON.stringify(activeStudentApp));
        if (activeStudentApp.id) {
          localStorage.setItem('jmf_active_app_id', activeStudentApp.id);
        }
      } else {
        localStorage.removeItem('jmf_active_student_app');
        localStorage.removeItem('jmf_active_app_id');
      }
    } catch (e) {}
  }, [activeStudentApp]);

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
          heroSlides: liveCms.heroSlides?.length ? liveCms.heroSlides : prev.heroSlides,
          announcements: liveCms.announcements?.length ? liveCms.announcements.map(a => ({ id: a.id, en: a.text_en, hi: a.text_hi })) : prev.announcements,
          downloads: liveCms.downloads?.length ? liveCms.downloads.map(d => ({ id: d.id, titleEn: d.title_en, titleHi: d.title_hi, categoryEn: d.category_en, categoryHi: d.category_hi, format: d.format, size: d.size_display })) : prev.downloads,
          faqs: liveCms.faqs?.length ? liveCms.faqs.map(f => ({ id: f.id, qEn: f.question_en, qHi: f.question_hi, aEn: f.answer_en, aHi: f.answer_hi })) : prev.faqs,
          notices: liveCms.notices?.length ? liveCms.notices.map(n => ({
            id: n.id,
            date: n.publish_date || n.date,
            titleEn: n.title_en || n.titleEn,
            titleHi: n.title_hi || n.titleHi,
            categoryEn: n.category_en || n.categoryEn,
            categoryHi: n.category_hi || n.categoryHi,
            contentEn: n.content_en || n.contentEn,
            contentHi: n.content_hi || n.contentHi,
            priority: n.priority || 'NORMAL',
            isPinned: n.is_pinned ?? n.isPinned ?? false,
            isPublished: n.is_published ?? n.isPublished ?? true
          })) : prev.notices,
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
      }
      setAppsLoaded(true);
    } catch (err) {
      console.warn('Error loading Supabase applications:', err);
    }
  }, [authRole, jurisdiction]);

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

  // Check Current Auth Session on mount
  useEffect(() => {
    async function initSessionAndData() {
      try {
        const current = await authService.getCurrentUser();
        if (current && current.user) {
          setAuthUser(current.user);
          setAuthRole(current.role || 'guest');
          setJurisdiction(current.jurisdiction || {});
          localStorage.setItem('jmf_role', current.role || 'guest');

          // If student is logged in, refresh active student record with live DB data
          if (current.role === 'STUDENT') {
            const appId = current.user?.user_metadata?.applicationId || localStorage.getItem('jmf_active_app_id');
            const mobile = current.user?.user_metadata?.mobile || localStorage.getItem('jmf_last_student_login');
            try {
              let liveApp = null;
              if (appId) {
                liveApp = await applicationService.getApplicationById(appId);
              } else if (mobile) {
                const res = await authService.signInStudent(mobile);
                liveApp = res?.studentApp;
              }
              if (liveApp) {
                setActiveStudentApp(liveApp);
                localStorage.setItem('jmf_active_student_app', JSON.stringify(liveApp));
              } else if (current.studentApp) {
                setActiveStudentApp(current.studentApp);
              }
            } catch (err) {
              if (current.studentApp) setActiveStudentApp(current.studentApp);
            }
          }

          await loadApplications(current.role || 'SUPER_ADMIN', current.jurisdiction || {});
        } else {
          // Check if student was previously logged in via localStorage keys
          const savedRole = localStorage.getItem('jmf_role');
          const savedAppId = localStorage.getItem('jmf_active_app_id');
          const savedMobile = localStorage.getItem('jmf_last_student_login');
          if (savedRole === 'STUDENT' && (savedAppId || savedMobile)) {
            try {
              let restoredApp = null;
              if (savedAppId) {
                restoredApp = await applicationService.getApplicationById(savedAppId);
              } else if (savedMobile) {
                const res = await authService.signInStudent(savedMobile);
                restoredApp = res?.studentApp;
              }
              if (restoredApp) {
                setActiveStudentApp(restoredApp);
                localStorage.setItem('jmf_active_student_app', JSON.stringify(restoredApp));
                const studentUser = {
                  id: restoredApp.student_id || restoredApp.id,
                  email: restoredApp.email,
                  user_metadata: {
                    full_name: restoredApp.studentName,
                    role: 'STUDENT',
                    applicationId: restoredApp.id,
                    mobile: restoredApp.mobile
                  }
                };
                setAuthUser(studentUser);
                setAuthRole('STUDENT');
                setJurisdiction({});
                localStorage.setItem('jmf_student_user', JSON.stringify(studentUser));
              }
            } catch (e) {
              console.warn('Student restore from storage error:', e);
            }
          }
          await loadApplications();
        }
      } catch (err) {
        console.warn('Auth initialization error:', err);
        await loadApplications();
      } finally {
        setAuthLoading(false);
      }
    }
    initSessionAndData();
    loadCmsData();
    loadLiveCounters();
    loadGrievances();
  }, []);

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

  const updateCmsField = (field, value) => {
    setCms(prev => ({ ...prev, [field]: value }));
  };

  // CMS update wrapper
  const updateCMS = async (newFields) => {
    // 1. Optimistic update
    setCms(prev => ({
      ...prev,
      ...newFields
    }));

    try {
      const schemeId = newFields.schemeId || cms.schemeId || 'd0000000-0000-0000-0000-000000000001';
      const grantAmountRaw = parseFloat((newFields.scholarshipAmount || cms.scholarshipAmount || '').replace(/[^0-9.]/g, '')) || 22000;

      // 2. Persist scheme settings (dates, amounts, overview)
      await cmsService.updateSchemeSettings(schemeId, {
        grant_amount: grantAmountRaw,
        grant_amount_display: newFields.scholarshipAmount || cms.scholarshipAmount,
        application_start_date: newFields.applicationStartDate || cms.applicationStartDate,
        application_end_date: newFields.applicationLastDate || cms.applicationLastDate,
        eligibility_overview: newFields.eligibilityCriteria || cms.eligibilityCriteria
      });

      // 3. Persist system_settings key-value pairs (syncing dates, contacts, amounts)
      await cmsService.updateSystemSettings({
        applicationStartDate: newFields.applicationStartDate || cms.applicationStartDate,
        applicationClosingDate: newFields.applicationLastDate || cms.applicationLastDate,
        grantAmountDisplay: newFields.scholarshipAmount || cms.scholarshipAmount,
        grantAmount: grantAmountRaw,
        eligibilityCriteria: newFields.eligibilityCriteria || cms.eligibilityCriteria,
        officialMobile: newFields.officialMobile || cms.officialMobile,
        officialTelephone: newFields.officialTelephone || cms.officialTelephone,
        officialEmail: newFields.officialEmail || cms.officialEmail,
        officeAddress: newFields.officeAddress || cms.officeAddress,
        registrationDetails: newFields.registrationDetails || cms.registrationDetails,
        portal_config: {
          office_address: newFields.officeAddress || cms.officeAddress,
          official_email: newFields.officialEmail || cms.officialEmail,
          helpline_mobile: newFields.officialMobile || cms.officialMobile,
          helpline_telephone: newFields.officialTelephone || cms.officialTelephone,
          registration_number: newFields.registrationDetails || cms.registrationDetails
        }
      });

      // 4. Persist Hero Slides if provided
      if (newFields.heroSlides && Array.isArray(newFields.heroSlides)) {
        await cmsService.updateHeroSlides(newFields.heroSlides);
      }

      // 5. Persist Announcements if provided
      if (newFields.announcements && Array.isArray(newFields.announcements)) {
        await cmsService.updateAnnouncements(newFields.announcements);
      }

      // 6. Reload live consolidated CMS to ensure context is 100% updated
      await loadCmsData();
      return true;
    } catch (err) {
      console.error('Error in updateCMS:', err);
      throw err;
    }
  };

  // Submit Application
  const submitNewApplication = async (formData) => {
    try {
      const record = await applicationService.submitApplication(formData, authUser?.id);
      setApplications(prev => [record, ...prev]);
      setActiveStudentApp(record);
      const studentUser = {
        id: record.student_id || record.id,
        email: record.email,
        user_metadata: {
          full_name: record.studentName,
          role: 'STUDENT',
          applicationId: record.id,
          mobile: record.mobile
        }
      };
      setAuthUser(studentUser);
      setAuthRole('STUDENT');
      setJurisdiction({});
      localStorage.setItem('jmf_role', 'STUDENT');
      localStorage.removeItem('jmf_jurisdiction');
      localStorage.setItem('jmf_active_student_app', JSON.stringify(record));
      localStorage.setItem('jmf_active_app_id', record.id);
      localStorage.setItem('jmf_last_student_login', record.mobile || record.id);
      localStorage.setItem('jmf_student_user', JSON.stringify(studentUser));
      await loadLiveCounters();
      await loadApplications('STUDENT', {});
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
    localStorage.setItem('jmf_admin_user', JSON.stringify(result.user));
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
      localStorage.setItem('jmf_active_student_app', JSON.stringify(result.studentApp));
      localStorage.setItem('jmf_active_app_id', result.studentApp.id);
      localStorage.setItem('jmf_last_student_login', result.studentApp.mobile || result.studentApp.id);
      localStorage.setItem('jmf_student_user', JSON.stringify(result.user));
    }
    localStorage.setItem('jmf_role', 'STUDENT');
    localStorage.removeItem('jmf_admin_user');
    localStorage.removeItem('jmf_jurisdiction');
    return result;
  };

  // Create New Student Applicant & Auto-Login
  const handleCreateStudentApplicant = async (applicantData) => {
    const result = await authService.createStudentApplicant(applicantData);
    setAuthUser(result.user);
    setAuthRole('STUDENT');
    setJurisdiction({});
    if (result.studentApp) {
      setActiveStudentApp(result.studentApp);
      setApplications(prev => [result.studentApp, ...prev]);
      localStorage.setItem('jmf_active_student_app', JSON.stringify(result.studentApp));
      localStorage.setItem('jmf_active_app_id', result.studentApp.id);
      localStorage.setItem('jmf_last_student_login', result.studentApp.mobile || result.studentApp.id);
      localStorage.setItem('jmf_student_user', JSON.stringify(result.user));
    }
    localStorage.setItem('jmf_role', 'STUDENT');
    localStorage.removeItem('jmf_admin_user');
    localStorage.removeItem('jmf_jurisdiction');
    await loadLiveCounters();
    return result;
  };

  // Update Student Fee Payment via Razorpay
  const updateStudentFeePayment = async (appId, paymentData) => {
    try {
      const updated = await applicationService.updateFeePayment(appId, paymentData);
      if (updated) {
        setActiveStudentApp(updated);
        setApplications(prev => prev.map(a => a.id === appId ? updated : a));
        localStorage.setItem('jmf_active_student_app', JSON.stringify(updated));
        return updated;
      }
    } catch (err) {
      console.error('Error updating fee payment:', err);
    }
    return null;
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
    setActiveStudentApp(null);
    localStorage.setItem('jmf_role', 'guest');
    localStorage.removeItem('jmf_admin_user');
    localStorage.removeItem('jmf_jurisdiction');
    localStorage.removeItem('jmf_active_student_app');
    localStorage.removeItem('jmf_active_app_id');
    localStorage.removeItem('jmf_student_user');
    localStorage.removeItem('jmf_last_student_login');
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
      updateCmsField,
      refreshCMS: loadCmsData,
      cmsLoaded,
      applications,
      loadApplications,
      appsLoaded,
      submitNewApplication,
      updateApplicationStatus,
      updateStudentFeePayment,
      activeStudentApp,
      setActiveStudentApp,
      grievances,
      submitGrievance,
      authUser,
      authRole,
      authLoading,
      setAuthRole,
      switchRole,
      jurisdiction,
      setJurisdiction,
      login: handleLogin,
      loginStudent: handleStudentLogin,
      createStudentApplicant: handleCreateStudentApplicant,
      logout: handleLogout,
      liveCounters
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
