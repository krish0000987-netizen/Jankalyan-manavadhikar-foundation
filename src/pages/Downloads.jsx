import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Download, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Eye, 
  Copy, 
  Check, 
  ExternalLink, 
  Search, 
  FileCheck2, 
  Building2, 
  Award, 
  Sparkles,
  X,
  FileBadge,
  Printer
} from 'lucide-react';

export const Downloads = () => {
  const { lang, t, navigate, cms } = useApp();
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);

  const rawDownloadsList = (cms.downloads && cms.downloads.length > 0) ? cms.downloads : [
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
      preview_image_url: '/downloads/mca_incorporation_certified_copy.jpg',
      format: 'PDF',
      size_display: '72.6 KB',
      display_order: 1
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
      preview_image_url: '/downloads/form_10ac_80g_and_12a_approval.pdf',
      format: 'PDF',
      size_display: '440.5 KB',
      display_order: 2
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
      preview_image_url: '/downloads/form_10ac_80g_and_12a_approval.pdf',
      format: 'PDF',
      size_display: '440.5 KB',
      display_order: 3
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
      display_order: 4
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
      display_order: 5
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
      display_order: 6
    }
  ];

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownload = (item) => {
    const fileUrl = item.file_url || item.fileUrl;
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileUrl.split('/').pop() || 'official_document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
  };

  // Filter logic
  const filteredDownloads = rawDownloadsList.filter(item => {
    // Tab filter
    if (activeTab === 'MCA') {
      if (!item.id.includes('MCA')) return false;
    } else if (activeTab === 'TAX') {
      if (!item.id.includes('IT-80G') && !item.id.includes('IT-12A')) return false;
    } else if (activeTab === 'IDENTITY') {
      if (!item.id.includes('PAN') && !item.id.includes('LEI')) return false;
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchEn = item.title_en && item.title_en.toLowerCase().includes(term);
      const matchHi = item.title_hi && item.title_hi.toLowerCase().includes(term);
      const matchNum = item.doc_number && item.doc_number.toLowerCase().includes(term);
      const matchCat = item.category_en && item.category_en.toLowerCase().includes(term);
      return matchEn || matchHi || matchNum || matchCat;
    }
    return true;
  });

  return (
    <div className="section-py" style={{ backgroundColor: '#F8FAFC', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 1rem' }}>
        
        {/* Top Header Banner */}
        <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto 2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            color: '#1E40AF',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '1rem'
          }}>
            <ShieldCheck size={16} color="#2563EB" />
            <span>
              {lang === 'hi' 
                ? 'भारत सरकार कॉर्पोरेट कार्य मंत्रालय एवं आयकर विभाग द्वारा वैधानिक मान्यता प्राप्त' 
                : 'Recognized by Ministry of Corporate Affairs (Govt. of India) & Income Tax Department'}
            </span>
          </div>

          <h1 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem', lineHeight: 1.25 }}>
            {lang === 'hi' 
              ? 'वैधानिक पंजीकरण, कर छूट एवं आधिकारिक प्रपत्र केंद्र' 
              : 'Official Statutory Registrations, Tax Exemptions & Downloads Center'}
          </h1>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.6 }}>
            {lang === 'hi' 
              ? 'जनकल्याण मानवाधिकार फाउंडेशन के कॉर्पोरेट निगमन (धारा 8), आयकर छूट (12A एवं 80G), पैन कार्ड एवं वैश्विक LEI के आधिकारिक मूल दस्तावेज एवं सत्यापन प्रपत्र डाउनलोड अथवा सीधे निरीक्षण करें।' 
              : 'Directly inspect and download verified statutory documents, Section 8 Incorporation (MCA), Income Tax 12A & 80G Approval Orders, PAN & Global LEI Certificates for Jankalyan Manavadhikar Foundation.'}
          </p>
        </div>

        {/* 4 Pillars Trust Ribbon */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}>
          {/* Card 1: MCA */}
          <div className="card" style={{
            padding: '1.4rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRadius: '14px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderTop: '4px solid #2563EB',
            boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
            height: '100%'
          }}>
            <div>
              {/* Header: Icon + Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.9rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E40AF' }}>
                  <Building2 size={20} />
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '6px', backgroundColor: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE' }}>
                  MCA SECTION 8
                </span>
              </div>

              {/* Title & Code */}
              <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Corporate Identity No. (CIN)
              </div>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '0.84rem',
                fontWeight: 800,
                color: '#0F172A',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                padding: '0.4rem 0.65rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.3rem',
                marginBottom: '0.85rem'
              }}>
                <span style={{ letterSpacing: '0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  U85500MP2024NPL069532
                </span>
                <button
                  onClick={() => handleCopy('U85500MP2024NPL069532', 'cin')}
                  title="Copy CIN"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedId === 'cin' ? '#16A34A' : '#94A3B8', padding: '0.1rem', display: 'flex', alignItems: 'center' }}
                >
                  {copiedId === 'cin' ? <Check size={13} color="#16A34A" /> : <Copy size={13} />}
                </button>
              </div>
            </div>

            {/* Bottom Status */}
            <div style={{ fontSize: '0.76rem', color: '#15803D', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', paddingTop: '0.65rem', borderTop: '1px solid #F1F5F9' }}>
              <CheckCircle2 size={13} color="#16A34A" style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Inc: 29 Jan 2024 (CRC Manesar)</span>
            </div>
          </div>

          {/* Card 2: 80G */}
          <div className="card" style={{
            padding: '1.4rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRadius: '14px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderTop: '4px solid #16A34A',
            boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
            height: '100%'
          }}>
            <div>
              {/* Header: Icon + Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.9rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803D' }}>
                  <Award size={20} />
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '6px', backgroundColor: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0' }}>
                  INCOME TAX 80G
                </span>
              </div>

              {/* Title & Code */}
              <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Approval Order (URN)
              </div>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '0.84rem',
                fontWeight: 800,
                color: '#0F172A',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                padding: '0.4rem 0.65rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.3rem',
                marginBottom: '0.85rem'
              }}>
                <span style={{ letterSpacing: '0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  AAGCJ3046CF20241
                </span>
                <button
                  onClick={() => handleCopy('AAGCJ3046CF20241', '80g')}
                  title="Copy 80G URN"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedId === '80g' ? '#16A34A' : '#94A3B8', padding: '0.1rem', display: 'flex', alignItems: 'center' }}
                >
                  {copiedId === '80g' ? <Check size={13} color="#16A34A" /> : <Copy size={13} />}
                </button>
              </div>
            </div>

            {/* Bottom Status */}
            <div style={{ fontSize: '0.76rem', color: '#15803D', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', paddingTop: '0.65rem', borderTop: '1px solid #F1F5F9' }}>
              <CheckCircle2 size={13} color="#16A34A" style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>50% Tax Deduction on Donations</span>
            </div>
          </div>

          {/* Card 3: 12A */}
          <div className="card" style={{
            padding: '1.4rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRadius: '14px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderTop: '4px solid #D97706',
            boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
            height: '100%'
          }}>
            <div>
              {/* Header: Icon + Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.9rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B45309' }}>
                  <FileCheck2 size={20} />
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '6px', backgroundColor: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A' }}>
                  INCOME TAX 12A
                </span>
              </div>

              {/* Title & Code */}
              <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Registration Order (URN)
              </div>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '0.84rem',
                fontWeight: 800,
                color: '#0F172A',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                padding: '0.4rem 0.65rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.3rem',
                marginBottom: '0.85rem'
              }}>
                <span style={{ letterSpacing: '0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  AAGCJ3046CE20231
                </span>
                <button
                  onClick={() => handleCopy('AAGCJ3046CE20231', '12a')}
                  title="Copy 12A URN"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedId === '12a' ? '#16A34A' : '#94A3B8', padding: '0.1rem', display: 'flex', alignItems: 'center' }}
                >
                  {copiedId === '12a' ? <Check size={13} color="#16A34A" /> : <Copy size={13} />}
                </button>
              </div>
            </div>

            {/* Bottom Status */}
            <div style={{ fontSize: '0.76rem', color: '#B45309', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', paddingTop: '0.65rem', borderTop: '1px solid #F1F5F9' }}>
              <CheckCircle2 size={13} color="#D97706" style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Tax-Exempt Charitable Status</span>
            </div>
          </div>

          {/* Card 4: PAN & LEI */}
          <div className="card" style={{
            padding: '1.4rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRadius: '14px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderTop: '4px solid #7C3AED',
            boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
            height: '100%'
          }}>
            <div>
              {/* Header: Icon + Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.9rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6D28D9' }}>
                  <FileBadge size={20} />
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '6px', backgroundColor: '#FAF5FF', color: '#6D28D9', border: '1px solid #E9D5FF' }}>
                  PAN & LEI CODE
                </span>
              </div>

              {/* Title & Code */}
              <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Permanent Account No. (PAN)
              </div>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '0.84rem',
                fontWeight: 800,
                color: '#0F172A',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                padding: '0.4rem 0.65rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.3rem',
                marginBottom: '0.85rem'
              }}>
                <span style={{ letterSpacing: '0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  AAGCJ3046C
                </span>
                <button
                  onClick={() => handleCopy('AAGCJ3046C', 'pan')}
                  title="Copy PAN"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedId === 'pan' ? '#16A34A' : '#94A3B8', padding: '0.1rem', display: 'flex', alignItems: 'center' }}
                >
                  {copiedId === 'pan' ? <Check size={13} color="#16A34A" /> : <Copy size={13} />}
                </button>
              </div>
            </div>

            {/* Bottom Status */}
            <div style={{ fontSize: '0.76rem', color: '#6D28D9', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', paddingTop: '0.65rem', borderTop: '1px solid #F1F5F9' }}>
              <CheckCircle2 size={13} color="#7C3AED" style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>LEI: 391200G440EGSOONQG84</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Navigation Bar */}
        <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Tab Filters */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', labelHi: 'सभी दस्तावेज (All)', labelEn: 'All Documents' },
              { id: 'MCA', labelHi: 'कॉर्पोरेट पंजीकरण (MCA)', labelEn: 'MCA Incorporation' },
              { id: 'TAX', labelHi: 'आयकर छूट (12A / 80G)', labelEn: 'Tax Exemptions (80G/12A)' },
              { id: 'IDENTITY', labelHi: 'पहचान व LEI (PAN / Banking)', labelEn: 'KYC & LEI Code' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.45rem 0.95rem',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid',
                  transition: 'all 0.2s ease',
                  backgroundColor: activeTab === tab.id ? '#1E40AF' : '#F1F5F9',
                  borderColor: activeTab === tab.id ? '#1E40AF' : '#E2E8F0',
                  color: activeTab === tab.id ? '#FFFFFF' : '#475569'
                }}
              >
                {lang === 'hi' ? tab.labelHi : tab.labelEn}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              placeholder={lang === 'hi' ? 'दस्तावेज़ अथवा नंबर खोजें...' : 'Search certificate or ID...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '2.25rem',
                paddingRight: '0.75rem',
                paddingTop: '0.45rem',
                paddingBottom: '0.45rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.85rem'
              }}
            />
          </div>
        </div>

        {/* Documents Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem', marginBottom: '3rem' }}>
          {filteredDownloads.map((item, idx) => {
            const title = lang === 'hi' ? (item.title_hi || item.titleHi || item.title_en) : (item.title_en || item.titleEn);
            const category = lang === 'hi' ? (item.category_hi || item.categoryHi || item.category_en) : (item.category_en || item.categoryEn);
            const desc = lang === 'hi' ? (item.description_hi || item.description_en) : (item.description_en || item.description_hi);
            const format = item.format || 'PDF';
            const size = item.size_display || 'Official Copy';
            const docNum = item.doc_number;
            const authority = item.authority || 'Government Authority';

            return (
              <div 
                key={item.id || idx} 
                className="card hover-lift" 
                style={{ 
                  padding: '1.75rem', 
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
                  
                  {/* Left Column: Icon + Core Info */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flex: 1, minWidth: '300px' }}>
                    <div style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '14px',
                      backgroundColor: item.id.includes('MCA') ? '#EFF6FF' : item.id.includes('80G') ? '#DCFCE7' : item.id.includes('12A') ? '#FEF3C7' : '#F3E8FF',
                      color: item.id.includes('MCA') ? '#1E40AF' : item.id.includes('80G') ? '#166534' : item.id.includes('12A') ? '#B45309' : '#6D28D9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: '1px solid rgba(0,0,0,0.06)'
                    }}>
                      <FileText size={26} />
                    </div>

                    <div style={{ flex: 1 }}>
                      {/* Meta Tags Row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                        <span className="badge badge-navy" style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}>
                          {category}
                        </span>
                        
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.75rem',
                          color: '#15803D',
                          backgroundColor: '#F0FDF4',
                          border: '1px solid #BBF7D0',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '6px',
                          fontWeight: 700
                        }}>
                          <CheckCircle2 size={12} color="#16A34A" />
                          <span>{authority}</span>
                        </span>
                        
                        <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                          • {format} ({size})
                        </span>
                      </div>

                      {/* Main Title */}
                      <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.45rem', lineHeight: 1.35 }}>
                        {title}
                      </h3>

                      {/* Registration / ID Pill with copy button */}
                      {docNum && (
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          backgroundColor: '#F8FAFC',
                          border: '1px solid #CBD5E1',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '8px',
                          marginBottom: '0.65rem'
                        }}>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>
                            {docNum}
                          </span>
                          <button
                            onClick={() => handleCopy(docNum, item.id)}
                            title="Copy Identifier Number"
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              color: copiedId === item.id ? '#16A34A' : '#64748B',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              padding: '0.1rem 0.3rem',
                              borderRadius: '4px'
                            }}
                          >
                            {copiedId === item.id ? (
                              <>
                                <Check size={13} color="#16A34A" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={13} />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Description */}
                      <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.55, margin: 0 }}>
                        {desc}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '170px' }}>
                    {/* Preview Button */}
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => setPreviewDoc(item)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        fontWeight: 700,
                        height: '38px',
                        backgroundColor: '#FFFFFF',
                        borderColor: '#CBD5E1',
                        color: '#0F172A'
                      }}
                    >
                      <Eye size={15} color="#2563EB" />
                      <span>{lang === 'hi' ? 'दस्तावेज़ देखें' : 'View / Preview'}</span>
                    </button>

                    {/* Download Button */}
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleDownload(item)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        fontWeight: 700,
                        height: '38px'
                      }}
                    >
                      <Download size={15} />
                      <span>{lang === 'hi' ? 'डाउनलोड करें' : 'Download File'}</span>
                    </button>

                    {/* Direct link external */}
                    <a
                      href={item.file_url || '#'}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: '0.75rem',
                        color: '#64748B',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem',
                        marginTop: '0.2rem',
                        textDecoration: 'none'
                      }}
                    >
                      <span>{lang === 'hi' ? 'सीधे नए टैब में खोलें' : 'Open in New Tab'}</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Institutional Verification & Transparency Notice */}
        <div className="card" style={{
          padding: '2rem',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          marginBottom: '2.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#EFF6FF',
              color: '#1E40AF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldCheck size={26} />
            </div>

            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                {lang === 'hi' ? 'पारदर्शिता एवं आधिकारिक सत्यापन प्रक्रिया' : 'Public Verification & Statutory Transparency'}
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                {lang === 'hi'
                  ? 'जनकल्याण मानवाधिकार फाउंडेशन एक पूर्णतः विधिक एवं पंजीकृत गैर-लाभकारी (Section 8) संस्था है। कोई भी नागरिक, दानदाता अथवा शैक्षणिक संस्थान भारत सरकार के आधिकारिक पोर्टल्स (mca.gov.in एवं incometax.gov.in) पर जाकर हमारे कॉर्पोरेट पहचान संख्या (CIN) अथवा पैन नंबर की पुष्टि कर सकता है।'
                  : 'Jankalyan Manavadhikar Foundation is a fully compliant statutory Section 8 non-profit company. Any citizen, donor, or institution can independently verify our company incorporation on www.mca.gov.in using CIN: U85500MP2024NPL069532 and tax exemption approvals on www.incometax.gov.in using PAN: AAGCJ3046C.'}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                flexWrap: 'wrap',
                fontSize: '0.8rem',
                color: '#64748B',
                borderTop: '1px dashed #E2E8F0',
                paddingTop: '0.75rem'
              }}>
                <div>
                  <strong>पंजीकृत कार्यालय / Registered Office:</strong> Ward No. 30, Shri Ram College Road, Dixit Colony, Jabalpur, Madhya Pradesh - 482002
                </div>
                <div>
                  <strong>सहायता ईमेल:</strong> info@jankalyanmanavadhikarscholarship.com
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Apply Banner */}
        <div className="card" style={{
          backgroundColor: '#1E3A8A',
          color: '#FFFFFF',
          padding: '2rem 2.5rem',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: 'rgba(255,255,255,0.15)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              <Sparkles size={13} color="#FDE047" />
              <span>सत्र 2026-27 छात्रवृत्ति आवेदन खुला है</span>
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.35rem' }}>
              {lang === 'hi' ? 'छात्रवृत्ति हेतु डिजिटल ऑनलाइन आवेदन करें' : 'Apply for Official Scholarship Online'}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#BFDBFE', margin: 0 }}>
              {lang === 'hi' ? 'बिना किसी परेशानी के सीधे ऑनलाइन पोर्टल से 5 मिनट में आवेदन फॉर्म भरें।' : 'Complete your scholarship registration through the digital portal in 5 minutes.'}
            </p>
          </div>

          <button 
            className="btn btn-secondary" 
            onClick={() => navigate('/apply')}
            style={{
              padding: '0.85rem 1.75rem',
              fontWeight: 800,
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>{lang === 'hi' ? 'ऑनलाइन आवेदन प्रारंभ करें' : 'Start Online Application'}</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>

      {/* Interactive Lightbox / Document Preview Modal */}
      {previewDoc && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            width: '900px',
            maxWidth: '96vw',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#F8FAFC'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase' }}>
                  {previewDoc.authority}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {lang === 'hi' ? (previewDoc.title_hi || previewDoc.title_en) : previewDoc.title_en}
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => handleDownload(previewDoc)}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Download size={14} />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => window.open(previewDoc.file_url, '_blank')}
                  className="btn btn-outline btn-sm"
                  title="Open full file in new window"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <ExternalLink size={14} />
                </button>
                <button
                  onClick={() => setPreviewDoc(null)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748B',
                    padding: '0.4rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Close Modal"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Modal Content - Viewer */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              backgroundColor: '#0F172A',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '450px'
            }}>
              {previewDoc.format === 'PDF' ? (
                <iframe
                  src={`${previewDoc.file_url}#toolbar=1&navpanes=0`}
                  title={previewDoc.title_en}
                  style={{
                    width: '100%',
                    height: '650px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF'
                  }}
                />
              ) : (
                <img
                  src={previewDoc.preview_image_url || previewDoc.file_url}
                  alt={previewDoc.title_en}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '75vh',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                  }}
                />
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '0.85rem 1.5rem',
              borderTop: '1px solid #E2E8F0',
              backgroundColor: '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
              color: '#64748B'
            }}>
              <div>
                <strong>Registration Reference:</strong> {previewDoc.doc_number || 'Section 8 Registered'}
              </div>
              <div>
                File Format: {previewDoc.format} ({previewDoc.size_display || 'Official Document'})
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
