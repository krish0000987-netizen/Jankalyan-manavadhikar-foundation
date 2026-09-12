import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

const AppContext = createContext();

// Initial Verified CMS Data (using supplied contacts & exact placeholders requested)
const INITIAL_CMS = {
  scholarshipAmount: "[Scholarship Amount]",
  applicationStartDate: "[Application Start Date]",
  applicationLastDate: "[Application Last Date]",
  eligibilityCriteria: "[Eligibility Criteria]",
  officeAddress: "[Office Address]",
  registrationDetails: "[Official Registration Details]",
  officialEmail: "jankalyanmanavadhikar@gmail.com",
  officialMobile: "8871557054",
  officialTelephone: "07614500054",
  announcements: [
    {
      id: 1,
      en: "Scholarship applications are now open for the current academic session.",
      hi: "वर्तमान शैक्षणिक सत्र के लिए छात्रवृत्ति आवेदन प्रारंभ हो चुके हैं।"
    },
    {
      id: 2,
      en: "Please ensure your bank account is Aadhaar-seeded for Direct Benefit Transfer (DBT).",
      hi: "कृपया प्रत्यक्ष लाभ अंतरण (DBT) हेतु सुनिश्चित करें कि आपका बैंक खाता आधार से लिंक हो।"
    },
    {
      id: 3,
      en: "Verification centers are actively reviewing submitted documents.",
      hi: "सत्यापन केंद्रों द्वारा जमा किए गए दस्तावेज़ों की संवीक्षा सक्रिय रूप से की जा रही है।"
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
    },
    {
      id: "NOT-2026-03",
      date: "2026-08-28",
      titleEn: "District & Block Coordinator Scrutiny Schedule",
      titleHi: "जिला एवं ब्लॉक समन्वयकों हेतु संवीक्षा समय-सारणी",
      categoryEn: "Administration",
      categoryHi: "प्रशासनिक",
      contentEn: "Institutional coordinators must expedite primary stage verification of received applications within 5 working days.",
      contentHi: "संस्थागत समन्वयकों को प्राप्त आवेदनों का प्राथमिक सत्यापन 5 कार्यदिवसों के भीतर पूर्ण करना अनिवार्य है।"
    }
  ],
  commissionRates: {
    districtRate: "[Configured District Rate]",
    blockRate: "[Configured Block Rate]",
    schoolRate: "[Configured School Rate]",
    onlineCenterRate: "[Configured Online Center Rate]"
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
      qHi: "जंकल्याण मानवाधिकार फाउंडेशन छात्रवृत्ति के लिए आवेदन कैसे करें?",
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

// Initial Realistic Pre-Seeded Applications for Admin & Verification Workflow
const INITIAL_APPLICATIONS = [
  {
    id: "JMF-2026-108234",
    studentName: "Pooja Sharma",
    fatherName: "Ramesh Sharma",
    mobile: "9826112233",
    email: "pooja.sharma@example.com",
    dob: "2006-05-14",
    gender: "Female",
    district: "Jabalpur",
    block: "Patan",
    institution: "Govt. Model Higher Secondary School",
    course: "Class 12th (Science)",
    category: "General",
    annualIncome: "₹1,20,000",
    bankName: "State Bank of India",
    accountNumber: "38921049281",
    ifsc: "SBIN0001248",
    status: "Scholarship Released",
    stage: 5,
    submissionDate: "2026-08-15",
    approvalDate: "2026-08-28",
    paymentDate: "2026-09-02",
    utrNumber: "SBIN00291823901",
    disbursedAmount: "[Scholarship Amount]",
    documents: {
      photo: { status: "Verified", file: "photo_pooja.jpg" },
      aadhaar: { status: "Verified", file: "aadhaar_pooja.pdf" },
      marksheet: { status: "Verified", file: "marksheet_11th.pdf" },
      bonafide: { status: "Verified", file: "bonafide_school.pdf" },
      passbook: { status: "Verified", file: "passbook_sbi.pdf" }
    }
  },
  {
    id: "JMF-2026-109482",
    studentName: "Rahul Verma",
    fatherName: "Kishore Verma",
    mobile: "9425098765",
    email: "rahul.verma@example.com",
    dob: "2004-11-20",
    gender: "Male",
    district: "Bhopal",
    block: "Berasia",
    institution: "Barkatullah University College",
    course: "B.Sc Computer Science (2nd Year)",
    category: "OBC",
    annualIncome: "₹95,000",
    bankName: "Punjab National Bank",
    accountNumber: "19280029182",
    ifsc: "PUNB0192800",
    status: "Under Verification",
    stage: 2,
    submissionDate: "2026-09-04",
    approvalDate: "-",
    paymentDate: "-",
    utrNumber: "-",
    disbursedAmount: "-",
    documents: {
      photo: { status: "Verified", file: "photo_rahul.jpg" },
      aadhaar: { status: "Verified", file: "aadhaar_rahul.pdf" },
      marksheet: { status: "Under Verification", file: "marksheet_bsc.pdf" },
      bonafide: { status: "Under Verification", file: "college_id.pdf" },
      passbook: { status: "Uploaded", file: "pnb_passbook.pdf" }
    }
  },
  {
    id: "JMF-2026-110294",
    studentName: "Ananya Patel",
    fatherName: "Suresh Patel",
    mobile: "9893456789",
    email: "ananya.patel@example.com",
    dob: "2005-02-18",
    gender: "Female",
    district: "Indore",
    block: "Mhow",
    institution: "Holkar Science College",
    course: "B.Com (1st Year)",
    category: "OBC",
    annualIncome: "₹1,40,000",
    bankName: "Bank of Baroda",
    accountNumber: "02918239019",
    ifsc: "BARB0INDORE",
    status: "Approved",
    stage: 4,
    submissionDate: "2026-08-22",
    approvalDate: "2026-09-08",
    paymentDate: "Queued",
    utrNumber: "Pending Release",
    disbursedAmount: "[Scholarship Amount]",
    documents: {
      photo: { status: "Verified", file: "photo_ananya.jpg" },
      aadhaar: { status: "Verified", file: "aadhaar_ananya.pdf" },
      marksheet: { status: "Verified", file: "marksheet_12th.pdf" },
      bonafide: { status: "Verified", file: "holkar_bonafide.pdf" },
      passbook: { status: "Verified", file: "bob_passbook.pdf" }
    }
  },
  {
    id: "JMF-2026-112048",
    studentName: "Sunil Kumar Ahirwar",
    fatherName: "Gopal Ahirwar",
    mobile: "9179234567",
    email: "sunil.ahirwar@example.com",
    dob: "2007-09-10",
    gender: "Male",
    district: "Rewa",
    block: "Raipur Karchuliyan",
    institution: "Govt. Polytechnic College Rewa",
    course: "Diploma in Mechanical Engg",
    category: "SC",
    annualIncome: "₹60,000",
    bankName: "Union Bank of India",
    accountNumber: "48291048291",
    ifsc: "UBIN0548291",
    status: "Correction Requested",
    stage: 2,
    submissionDate: "2026-09-02",
    rejectionReason: "Uploaded college bonafide certificate is blurry. Please upload a clear stamped copy.",
    approvalDate: "-",
    paymentDate: "-",
    utrNumber: "-",
    disbursedAmount: "-",
    documents: {
      photo: { status: "Verified", file: "photo_sunil.jpg" },
      aadhaar: { status: "Verified", file: "aadhaar_sunil.pdf" },
      marksheet: { status: "Verified", file: "marksheet_10th.pdf" },
      bonafide: { status: "Rejected", file: "bonafide_blurry.pdf", reason: "Blurry scan without principal stamp" },
      passbook: { status: "Verified", file: "passbook_ubi.pdf" }
    }
  },
  {
    id: "JMF-2026-114890",
    studentName: "Kavita Gond",
    fatherName: "Ramdas Gond",
    mobile: "9755123489",
    email: "kavita.gond@example.com",
    dob: "2006-12-05",
    gender: "Female",
    district: "Mandla",
    block: "Bichhiya",
    institution: "Govt. Girls Higher Secondary School",
    course: "Class 11th (Arts)",
    category: "ST",
    annualIncome: "₹48,000",
    bankName: "Madhya Pradesh Gramin Bank",
    accountNumber: "88910294819",
    ifsc: "MPGB0001092",
    status: "Approved",
    stage: 4,
    submissionDate: "2026-08-30",
    approvalDate: "2026-09-11",
    paymentDate: "In Payment Queue",
    utrNumber: "Scheduled",
    disbursedAmount: "[Scholarship Amount]",
    documents: {
      photo: { status: "Verified", file: "photo_kavita.jpg" },
      aadhaar: { status: "Verified", file: "aadhaar_kavita.pdf" },
      marksheet: { status: "Verified", file: "marksheet_10th.pdf" },
      bonafide: { status: "Verified", file: "school_bonafide.pdf" },
      passbook: { status: "Verified", file: "passbook_mpgb.pdf" }
    }
  },
  {
    id: "JMF-2026-116342",
    studentName: "Deepak Yadav",
    fatherName: "Mahesh Yadav",
    mobile: "8871098765",
    email: "deepak.yadav@example.com",
    dob: "2003-08-15",
    gender: "Male",
    district: "Gwalior",
    block: "Dabra",
    institution: "Madhav Institute of Technology",
    course: "B.Tech (3rd Year)",
    category: "OBC",
    annualIncome: "₹2,80,000",
    bankName: "Canara Bank",
    accountNumber: "28192049281",
    ifsc: "CNRB0002819",
    status: "Rejected",
    stage: 2,
    submissionDate: "2026-08-20",
    rejectionReason: "Incomplete documentation: Family income certificate not matching criteria guidelines.",
    approvalDate: "-",
    paymentDate: "-",
    utrNumber: "-",
    disbursedAmount: "-",
    documents: {
      photo: { status: "Verified", file: "photo_deepak.jpg" },
      aadhaar: { status: "Verified", file: "aadhaar_deepak.pdf" },
      marksheet: { status: "Verified", file: "marksheet_btech.pdf" },
      bonafide: { status: "Verified", file: "bonafide_mits.pdf" },
      passbook: { status: "Verified", file: "canara_passbook.pdf" }
    }
  }
];

const INITIAL_GRIEVANCES = [
  {
    id: "GRV-2026-00482",
    name: "Sunil Kumar Ahirwar",
    mobile: "9179234567",
    applicationId: "JMF-2026-112048",
    category: "Document Re-upload",
    description: "I have uploaded the stamped bonafide certificate from my college principal. Please review.",
    status: "Under Review",
    date: "2026-09-10"
  },
  {
    id: "GRV-2026-00391",
    name: "Pooja Sharma",
    mobile: "9826112233",
    applicationId: "JMF-2026-108234",
    category: "Payment Query",
    description: "Thank you for the scholarship disbursement. Received UTR confirmation.",
    status: "Resolved",
    date: "2026-09-03"
  }
];

export const AppProvider = ({ children }) => {
  // Language State with persistence
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('jmf_lang') || 'hi';
  });

  // Current Active Route State for client-side navigation
  const [currentRoute, setCurrentRoute] = useState('/');

  // CMS Settings State
  const [cms, setCms] = useState(() => {
    const saved = localStorage.getItem('jmf_cms');
    return saved ? JSON.parse(saved) : INITIAL_CMS;
  });

  // Applications State
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('jmf_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  // Grievances State
  const [grievances, setGrievances] = useState(() => {
    const saved = localStorage.getItem('jmf_grievances');
    return saved ? JSON.parse(saved) : INITIAL_GRIEVANCES;
  });

  // User Auth & Role State
  // Roles: 'guest', 'student', 'admin', 'district', 'block', 'institution', 'center'
  const [authRole, setAuthRole] = useState(() => {
    return localStorage.getItem('jmf_role') || 'guest';
  });

  const [activeStudentApp, setActiveStudentApp] = useState(() => {
    const saved = localStorage.getItem('jmf_active_app');
    return saved ? JSON.parse(saved) : applications[0];
  });

  // Persist Changes
  useEffect(() => {
    localStorage.setItem('jmf_lang', lang);
    if (lang === 'hi') {
      document.body.classList.add('lang-hi');
    } else {
      document.body.classList.remove('lang-hi');
    }
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('jmf_cms', JSON.stringify(cms));
  }, [cms]);

  useEffect(() => {
    localStorage.setItem('jmf_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('jmf_grievances', JSON.stringify(grievances));
  }, [grievances]);

  useEffect(() => {
    localStorage.setItem('jmf_role', authRole);
  }, [authRole]);

  // Actions
  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const setSpecificLanguage = (newLang) => {
    if (newLang === 'en' || newLang === 'hi') {
      setLang(newLang);
    }
  };

  const navigate = (route) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateCMS = (newFields) => {
    setCms(prev => ({
      ...prev,
      ...newFields
    }));
  };

  const submitNewApplication = (formData) => {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const newId = `JMF-2026-${randomSuffix}`;

    const newRecord = {
      id: newId,
      studentName: formData.fullName || "Student Applicant",
      fatherName: formData.fatherName || "",
      mobile: formData.mobile || "",
      email: formData.email || "",
      dob: formData.dob || "",
      gender: formData.gender || "Male",
      district: formData.district || "Jabalpur",
      block: formData.block || "Central",
      institution: formData.institutionName || "State Institute",
      course: formData.classCourse || "12th Standard",
      category: formData.category || "General",
      annualIncome: formData.annualIncome ? `₹${formData.annualIncome}` : "₹[Income]",
      bankName: formData.bankName || "State Bank of India",
      accountNumber: formData.accountNumber || "XXXXXXXX1234",
      ifsc: formData.ifsc || "SBIN0001234",
      status: "Under Verification",
      stage: 2,
      submissionDate: new Date().toISOString().split('T')[0],
      approvalDate: "-",
      paymentDate: "-",
      utrNumber: "-",
      disbursedAmount: "-",
      documents: {
        photo: { status: "Uploaded", file: formData.photoFile || "student_photo.jpg" },
        aadhaar: { status: "Uploaded", file: formData.aadhaarFile || "aadhaar_card.pdf" },
        marksheet: { status: "Uploaded", file: formData.marksheetFile || "marksheet.pdf" },
        bonafide: { status: "Uploaded", file: formData.bonafideFile || "bonafide_certificate.pdf" },
        passbook: { status: "Uploaded", file: formData.passbookFile || "bank_passbook.pdf" }
      }
    };

    setApplications(prev => [newRecord, ...prev]);
    setActiveStudentApp(newRecord);
    localStorage.setItem('jmf_active_app', JSON.stringify(newRecord));
    return newRecord;
  };

  const updateApplicationStatus = (appId, newStatus, remarks = "", utr = "") => {
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
  };

  const submitGrievance = (grvData) => {
    const grvId = `GRV-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newGrv = {
      id: grvId,
      name: grvData.name,
      mobile: grvData.mobile,
      applicationId: grvData.applicationId || "N/A",
      category: grvData.category,
      description: grvData.description,
      status: "Submitted",
      date: new Date().toISOString().split('T')[0]
    };
    setGrievances(prev => [newGrv, ...prev]);
    return grvId;
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
      applications,
      submitNewApplication,
      updateApplicationStatus,
      activeStudentApp,
      setActiveStudentApp,
      grievances,
      submitGrievance,
      authRole,
      setAuthRole
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
