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
      id: 'DOC-SCHOLARSHIP-FORM',
      title_en: 'National Scholarship Yojna 2026-27 : Official Prescribed Application Form',
      title_hi: 'राष्ट्रीय छात्रवृत्ति योजना 2026-27 : आधिकारिक विहित आवेदन प्रपत्र (डिजिटल व ऑफलाइन)',
      category_en: 'Scholarship Application Forms',
      category_hi: 'छात्रवृत्ति आवेदन प्रपत्र',
      doc_number: 'FORM NO: JMF-SCH-2026',
      authority: 'Jankalyan Manavadhikar Foundation (Regd. Under Section 8 MCA)',
      description_en: 'Official scholarship application form for Class 5th to PG & Diploma students. Fill directly through online digital portal or download high-resolution printable PDF for offline submission.',
      description_hi: 'कक्षा 5वीं से स्नातकोत्तर (PG) एवं डिप्लोमा विद्यार्थियों हेतु अधिकृत छात्रवृत्ति आवेदन प्रपत्र। सीधे ऑनलाइन भरें अथवा मुद्रण (प्रिंट) एवं ऑफलाइन जमा करने हेतु मूल PDF डाउनलोड करें।',
      file_url: '/downloads/scholarship_application_form_2026_27.pdf',
      preview_image_url: '/downloads/scholarship_application_form_page_1.png',
      preview_image_page2_url: '/downloads/scholarship_application_form_page_2.png',
      format: 'PDF',
      size_display: '6.8 KB (Vector PDF) / Printable A4',
      display_order: 0,
      is_active: true,
      is_form: true,
      online_apply_route: '/apply'
    },
    {
      id: 'DOC-MCA-COI',
      title_en: 'Ministry of Corporate Affairs - Certificate of Incorporation (Section 8 Non-Profit)',
      title_hi: 'भारत सरकार कॉर्पोरेट कार्य मंत्रालय - कंपनी निगमन प्रमाण पत्र (धारा 8 एनजीओ)',
      category_en: 'Legal & Statutory Registrations',
      category_hi: 'वैधानिक पंजीकरण एवं प्रमाण पत्र',
      doc_number: 'CIN: U85500MP2024NPL069532',
      authority: 'Ministry of Corporate Affairs, Govt. of India',
      description_en: 'Certificate of Incorporation issued under Section 8(1) of the Companies Act, 2013 by the Central Registration Centre, Manesar. Registered office at Dixit Colony, Jabalpur, Madhya Pradesh.',
      description_hi: 'कंपनी अधिनियम 2013 की धारा 8(1) के अंतर्गत केंद्रीय पंजीकरण केंद्र (CRC मानेसर) द्वारा जारी वैधानिक निगमन प्रमाण पत्र। पंजीकृत कार्यालय: दीक्षित कॉलोनी, जबलपुर (म.प्र.)।',
      file_url: '/downloads/mca_certificate_of_incorporation.pdf',
      preview_image_url: '/downloads/mca_certificate_of_incorporation_page_1.png',
      format: 'PDF',
      size_display: '72.6 KB',
      display_order: 1,
      is_active: true
    },
    {
      id: 'DOC-IT-80G',
      title_en: 'Income Tax Section 80G Provisional Approval Order (Form 10AC - 50% Tax Exemption)',
      title_hi: 'आयकर विभाग धारा 80G अनुमोदन आदेश (प्रपत्र 10AC - दानदाताओं हेतु 50% कर छूट)',
      category_en: 'Tax Exemption & Approvals',
      category_hi: 'कर छूट एवं शासकीय स्वीकृतियां',
      doc_number: 'URN: AAGCJ3046CF20241',
      authority: 'Income Tax Department, Govt. of India',
      description_en: 'Provisional approval order under section 80G(5)(iv) of the Income Tax Act, 1961 granting 50% income tax exemption to donors. Assessment Years: 2024-25 to 2026-2027.',
      description_hi: 'आयकर अधिनियम 1961 की धारा 80G(5) के तहत दानदाताओं हेतु 50% कर कटौती की वैधानिक स्वीकृति। प्रभाव: निर्धारण वर्ष 2024-25 से 2026-27।',
      file_url: '/downloads/form_10ac_80g_and_12a_approval.pdf',
      preview_image_url: '/downloads/form_10ac_80g_and_12a_approval_page_1.png',
      format: 'PDF',
      size_display: '440.5 KB',
      display_order: 2,
      is_active: true
    },
    {
      id: 'DOC-IT-12A',
      title_en: 'Income Tax Section 12A Provisional Registration Order (Form 10AC - Charitable Entity)',
      title_hi: 'आयकर विभाग धारा 12A पंजीकरण आदेश (प्रपत्र 10AC - धर्मार्थ संस्था)',
      category_en: 'Tax Exemption & Approvals',
      category_hi: 'कर छूट एवं शासकीय स्वीकृतियां',
      doc_number: 'URN: AAGCJ3046CE20231',
      authority: 'Income Tax Department, Govt. of India',
      description_en: 'Provisional registration order under Section 12A(1)(ac)(vi) of the Income Tax Act, 1961 granting tax-exempt status to Jankalyan Manavadhikar Foundation for charitable education work.',
      description_hi: 'आयकर अधिनियम 1961 की धारा 12A(1)(ac)(vi) के तहत धर्मार्थ शैक्षणिक गतिविधियों हेतु कर-मुक्त संस्था के रूप में पंजीकरण आदेश। प्रभाव: निर्धारण वर्ष 2024-25 से 2026-27।',
      file_url: '/downloads/form_10ac_80g_and_12a_approval.pdf',
      preview_image_url: '/downloads/form_10ac_80g_and_12a_approval_page_2.png',
      format: 'PDF',
      size_display: '440.5 KB',
      display_order: 3,
      is_active: true
    },
    {
      id: 'DOC-IT-PAN',
      title_en: 'Permanent Account Number (PAN) & TAN Official Card (Govt. of India)',
      title_hi: 'आयकर विभाग स्थायी खाता संख्या (PAN) एवं TAN कार्ड (भारत सरकार)',
      category_en: 'Institutional Identity & KYC',
      category_hi: 'संस्थागत पहचान एवं केवाईसी',
      doc_number: 'PAN: AAGCJ3046C | TAN: JBPJ03720D',
      authority: 'Income Tax Department (NSDL / Protean eGov)',
      description_en: 'Digitally certified Permanent Account Number (PAN) and Tax Deduction and Collection Account Number (TAN) issued by the Income Tax Department.',
      description_hi: 'आयकर विभाग भारत सरकार द्वारा जारी डिजिटल हस्ताक्षरित ई-पैन कार्ड (PAN: AAGCJ3046C) एवं टैन विवरण (TAN: JBPJ03720D)।',
      file_url: '/downloads/pan_card_jankalyan_foundation.jpg',
      preview_image_url: '/downloads/pan_card_jankalyan_foundation.jpg',
      format: 'JPG',
      size_display: '106.7 KB',
      display_order: 4,
      is_active: true
    },
    {
      id: 'DOC-LEI-GLOBAL',
      title_en: 'Global Legal Entity Identifier (LEI) Certificate (RBI Guidelines Compliant)',
      title_hi: 'वैश्विक लीगल एंटिटी आइडेंटिफायर (LEI) प्रमाण पत्र (आरबीआई अनुपालन)',
      category_en: 'Banking & Financial Compliance',
      category_hi: 'बैंकिंग एवं वित्तीय अनुपालन',
      doc_number: 'LEI: 391200G440EGSOONQG84',
      authority: 'Global LEI Foundation (GLEIF) / LEI Register India',
      description_en: 'International 20-character Legal Entity Identifier code ensuring banking compliance, institutional transparency and verification under RBI guidelines. Valid through 2027-04-28.',
      description_hi: 'भारतीय रिज़र्व बैंक (RBI) दिशा-निर्देशों के अनुरूप संस्थागत पारदर्शिता, वैश्विक वित्तीय पहचान एवं बैंकिंग सत्यापन हेतु 20-अंकीय LEI कोड। अगली नवीनीकरण तिथि: 28-04-2027।',
      file_url: '/downloads/lei_certificate_jankalyan.jpg',
      preview_image_url: '/downloads/lei_certificate_jankalyan.jpg',
      format: 'JPG',
      size_display: '91.5 KB',
      display_order: 5,
      is_active: true
    },
    {
      id: 'DOC-MCA-CERTIFIED',
      title_en: 'Digitally Verified MCA Incorporation Certificate (*.mca.gov.in Sealed)',
      title_hi: 'डिजिटल सत्यापित कॉर्पोरेट निगमन प्रमाण पत्र (*.mca.gov.in अधिकृत)',
      category_en: 'Legal & Statutory Registrations',
      category_hi: 'वैधानिक पंजीकरण एवं प्रमाण पत्र',
      doc_number: 'CIN: U85500MP2024NPL069532',
      authority: 'Registrar of Companies, Central Registration Centre',
      description_en: 'Certified authentic copy bearing the verified digital signature of Sheetal Kumari, Assistant Registrar of Companies, CRC Manesar and official Government of India emblem.',
      description_hi: 'सहायक कंपनी रजिस्ट्रार द्वारा डिजिटल रूप से हस्ताक्षरित एवं कॉर्पोरेट कार्य मंत्रालय के आधिकारिक पोर्टल (*.mca.gov.in) से सत्यापित प्रति।',
      file_url: '/downloads/mca_incorporation_certified_copy.jpg',
      preview_image_url: '/downloads/mca_incorporation_certified_copy.jpg',
      format: 'JPG',
      size_display: '147.8 KB',
      display_order: 6,
      is_active: true
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
  ],
  heroSlides: [
    {
      id: 'e0000000-0000-0000-0000-000000000001',
      image_url: '/assets/hero_slide_1.jpg',
      heading_en: 'Dedicated to Human Rights & Direct Scholastic Empowerment',
      heading_hi: 'मानवाधिकार संरक्षण एवं प्रत्यक्ष शैक्षणिक प्रोत्साहन',
      eyebrow_en: 'Empowering Tomorrow, Today',
      eyebrow_hi: 'उज्ज्वल भविष्य, आज से',
      description_en: 'Empowering deserving and meritorious students across India with direct scholastic grants, verifiable multi-tier scrutiny, and transparent Direct Benefit Transfer.',
      description_hi: 'भारत भर के मेधावी एवं जरूरतमंद छात्र-छात्राओं को प्रत्यक्ष छात्रवृत्ति अनुदान, पारदर्शी बहु-स्तरीय संवीक्षा एवं प्रत्यक्ष लाभ अंतरण (DBT) द्वारा सशक्त बनाना।',
      slide_duration_ms: 3000,
      is_active: true
    },
    {
      id: 'e0000000-0000-0000-0000-000000000002',
      image_url: '/assets/hero_slide_2.jpg',
      heading_en: 'Supporting Academic Ambition Across Colleges & Universities',
      heading_hi: 'महाविद्यालयीन एवं विश्वविद्यालयीन छात्रों को आर्थिक संबल',
      eyebrow_en: 'Quality Higher Education',
      eyebrow_hi: 'गुणवत्तापूर्ण उच्च शिक्षा',
      description_en: 'Providing unconditional financial security so no aspiring student is forced to discontinue their higher education due to financial hardship.',
      description_hi: 'प्रत्येक मेधावी युवा की उच्च शिक्षा को निरंतर रखने हेतु निर्बाध वित्तीय सुरक्षा एवं संस्थागत सहयोग।',
      slide_duration_ms: 3000,
      is_active: true
    },
    {
      id: 'e0000000-0000-0000-0000-000000000003',
      image_url: '/assets/hero_slide_3.jpg',
      heading_en: 'Direct Financial Assistance Delivered to Deserving Classrooms',
      heading_hi: 'प्रत्येक पात्र विद्यार्थी तक शत-प्रतिशत निष्पक्ष सहायता',
      eyebrow_en: 'Transparent Direct Benefit Transfer',
      eyebrow_hi: 'पारदर्शी प्रत्यक्ष लाभ अंतरण',
      description_en: 'Direct Benefit Transfer ensures assistance reaches directly to verified student bank accounts without intermediaries.',
      description_hi: 'प्रत्यक्ष लाभ अंतरण (DBT) सुनिश्चित करता है कि सहायता बिना किसी बिचौलिए के सीधे सत्यापित बैंक खातों में पहुंचे।',
      slide_duration_ms: 3000,
      is_active: true
    },
    {
      id: 'e0000000-0000-0000-0000-000000000004',
      image_url: '/assets/hero_slide_4.jpg',
      heading_en: 'Recognizing Merit, Dedication, and Resilient Aspirations',
      heading_hi: 'प्रतिभा, लगन एवं परिश्रम का सच्चा सम्मान',
      eyebrow_en: 'Scholastic Excellence',
      eyebrow_hi: 'शैक्षणिक उत्कृष्टता',
      description_en: 'Awarding scholarship certificates, timely grants, and academic recognition through our unified digital portal.',
      description_hi: 'एकल डिजिटल पोर्टल के माध्यम से आधिकारिक प्रमाण पत्र, समयबद्ध छात्रवृत्ति अनुदान एवं शैक्षणिक सम्मान।',
      slide_duration_ms: 3000,
      is_active: true
    },
    {
      id: 'e0000000-0000-0000-0000-000000000005',
      image_url: '/assets/hero_slide_5.jpg',
      heading_en: '100% Paperless Online Verification & Redressal Cell',
      heading_hi: 'शत-प्रतिशत कागजरहित ऑनलाइन सत्यापन एवं समाधान',
      eyebrow_en: 'Digital India Integration',
      eyebrow_hi: 'डिजिटल सशक्तिकरण',
      description_en: 'Experience end-to-end transparency with QR-verifiable application receipts, grievance resolution within 48 hours, and live SMS updates.',
      description_hi: 'क्यूआर कोड युक्त रसीद, 48 घंटे में शिकायत निवारण और रियल-टाइम एसएमएस अलर्ट के साथ संपूर्ण पारदर्शिता।',
      slide_duration_ms: 3000,
      is_active: true
    },
    {
      id: 'e0000000-0000-0000-0000-000000000006',
      image_url: '/assets/hero_slide_6.jpg',
      heading_en: 'Encouraging Research, Innovation, and Higher Studies',
      heading_hi: 'उच्च अध्ययन, शोध एवं नवाचार को प्रोत्साहन',
      eyebrow_en: 'Higher Studies & Research',
      eyebrow_hi: 'उच्च अध्ययन एवं शोध',
      description_en: 'Nurturing innovative minds and supporting advanced degree aspirants across colleges, universities, and research institutes.',
      description_hi: 'महाविद्यालयों एवं विश्वविद्यालयों में अध्ययनरत प्रतिभावान विद्यार्थियों को उच्च शोध व नवाचार हेतु सहायता।',
      slide_duration_ms: 3000,
      is_active: true
    }
  ]
};

export const normalizeRoute = (path) => {
  if (!path) return '/';
  let clean = path.split('?')[0].split('#')[0].trim().toLowerCase();
  if (clean.length > 1 && clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }
  return clean || '/';
};

export const AppProvider = ({ children }) => {
  // Language State with persistence
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('jmf_lang') || 'hi';
  });

  // Client-Side Routing synchronized with HTML5 History API (Normalized)
  const [currentRoute, setCurrentRoute] = useState(() => {
    return normalizeRoute(window.location.pathname || '/');
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
      setCurrentRoute(normalizeRoute(window.location.pathname || '/'));
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

  // Multi-tab and window-focus live CMS synchronization
  useEffect(() => {
    const handleSync = () => {
      loadCmsData();
      loadLiveCounters();
    };

    const handleStorage = (e) => {
      if (e.key === 'jmf_cms_updated') {
        loadCmsData();
        loadLiveCounters();
      }
    };

    window.addEventListener('focus', handleSync);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('focus', handleSync);
      window.removeEventListener('storage', handleStorage);
    };
  }, [loadCmsData, loadLiveCounters]);

  // Navigation Helper
  const navigate = (route) => {
    const cleanRoute = normalizeRoute(route);
    setCurrentRoute(cleanRoute);
    window.history.pushState({}, '', cleanRoute);
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
      
      let grantAmountRaw = 22000;
      const amtStr = String(newFields.scholarshipAmount || cms.scholarshipAmount || '');
      const matchedNums = (amtStr.match(/\d[\d,]*/g) || []).map(n => parseFloat(n.replace(/,/g, '')));
      if (matchedNums.length > 0) {
        grantAmountRaw = matchedNums[matchedNums.length - 1];
      }

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

      // 7. Notify other tabs via storage event
      try {
        localStorage.setItem('jmf_cms_updated', Date.now().toString());
      } catch (e) {}

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
