import React from 'react';
import { useApp } from '../context/AppContext';
import { Download, FileText, CheckCircle, FileCheck2, ArrowRight } from 'lucide-react';

export const Downloads = () => {
  const { lang, t, navigate, cms } = useApp();

  const handleDownload = (item) => {
    const fileUrl = item.file_url || item.fileUrl;
    if (fileUrl) {
      window.open(fileUrl, '_blank');
      return;
    }
    const title = (lang === 'hi' ? (item.title_hi || item.titleHi) : (item.title_en || item.titleEn)) || 'Document';
    const blob = new Blob([`Jankalyan Manavadhikar Foundation - Official Document\nDocument: ${title}\nAcademic Session: 2026-27\nOfficial Contact: ${cms.officialMobile || '+91 761 2400123'} | ${cms.officialEmail || 'info@jankalyan.org'}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadsList = cms.downloads || [];

  return (
    <div className="section-py" style={{ backgroundColor: '#F8FAFC', minHeight: '80vh' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
          <span className="badge badge-navy" style={{ marginBottom: '0.75rem' }}>
            {lang === 'hi' ? 'आधिकारिक प्रपत्र एवं नियम पुस्तिका' : 'OFFICIAL DOWNLOAD CENTER'}
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem' }}>
            {lang === 'hi' ? 'डाउनलोड केंद्र (Downloads)' : 'Institutional Download Center'}
          </h1>
          <p style={{ color: '#64748B', fontSize: '1rem' }}>
            {lang === 'hi' 
              ? 'छात्रवृत्ति आवेदन फॉर्म, नियम पुस्तिका, चेकलिस्ट तथा प्रारूप डाउनलोड करें।' 
              : 'Official application forms, rules handbook, document checklists, and declaration templates.'}
          </p>
        </div>

        {/* Downloads Grid */}
        <div className="grid-2" style={{ maxWidth: '960px', margin: '0 auto 3.5rem' }}>
          {downloadsList.map((item) => {
            const title = lang === 'hi' ? (item.title_hi || item.titleHi) : (item.title_en || item.titleEn);
            const category = lang === 'hi' ? (item.category_hi || item.categoryHi) : (item.category_en || item.categoryEn);
            const format = item.file_format || item.format || 'PDF';
            const size = item.file_size || item.size || '1.2 MB';

            return (
              <div key={item.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#EFF6FF', color: '#1E40AF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                      {title}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                      Category: <strong>{category}</strong> • {format} ({size})
                    </div>
                  </div>
                </div>

                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => handleDownload(item)}
                >
                  <Download size={14} />
                  <span>Download</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="card" style={{ maxWidth: '960px', margin: '0 auto', backgroundColor: '#EFF6FF', borderColor: '#BFDBFE', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1E3A8A', marginBottom: '0.25rem' }}>
              {lang === 'hi' ? 'क्या आप ऑनलाइन आवेदन करना चाहते हैं?' : 'Prefer to Apply Online Directly?'}
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#1E40AF' }}>
              {lang === 'hi' ? 'कागजरहित एवं त्वरित 8-चरणीय ऑनलाइन पोर्टल से आवेदन करें।' : 'Save paper and receive instant Application ID through our digital portal.'}
            </p>
          </div>

          <button className="btn btn-primary" onClick={() => navigate('/apply')}>
            <span>{t.heroCtaApply}</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};
