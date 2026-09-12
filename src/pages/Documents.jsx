import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  XCircle, 
  RefreshCw, 
  HelpCircle,
  Eye,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

export const Documents = () => {
  const { lang, t, navigate, activeStudentApp } = useApp();

  // Documents state for active student
  const [docList, setDocList] = useState([
    {
      id: 'photo',
      nameEn: 'Passport-size Photograph',
      nameHi: 'पासपोर्ट आकार का फोटो',
      required: true,
      status: 'Verified',
      file: 'photo_applicant.jpg',
      size: '142 KB',
      updated: '2026-09-02',
      reason: ''
    },
    {
      id: 'aadhaar',
      nameEn: 'Aadhaar Card (UIDAI)',
      nameHi: 'आधार कार्ड (UIDAI)',
      required: true,
      status: 'Verified',
      file: 'aadhaar_card.pdf',
      size: '480 KB',
      updated: '2026-09-02',
      reason: ''
    },
    {
      id: 'marksheet',
      nameEn: 'Qualifying Marksheet',
      nameHi: 'पिछली परीक्षा की अंकसूची',
      required: true,
      status: 'Verified',
      file: 'marksheet_qualifying.pdf',
      size: '620 KB',
      updated: '2026-09-02',
      reason: ''
    },
    {
      id: 'bonafide',
      nameEn: 'Admission / Bonafide Certificate',
      nameHi: 'प्रवेश / बोनाफाइड प्रमाण पत्र',
      required: true,
      status: 'Rejected',
      file: 'college_slip_blur.pdf',
      size: '310 KB',
      updated: '2026-09-08',
      reason: lang === 'hi' 
        ? 'अपलोड किया गया बोनाफाइड प्रमाण पत्र धुंधला है और प्राचार्य के हस्ताक्षर व सील स्पष्ट नहीं हैं। कृपया नया दस्तावेज़ अपलोड करें।'
        : 'Uploaded certificate is illegible. Missing principal seal and stamp. Please upload clear copy.'
    },
    {
      id: 'passbook',
      nameEn: 'Bank Passbook / Statement',
      nameHi: 'बैंक पासबुक / विवरण',
      required: true,
      status: 'Under Verification',
      file: 'bank_passbook_sbi.pdf',
      size: '540 KB',
      updated: '2026-09-09',
      reason: ''
    },
    {
      id: 'income',
      nameEn: 'Income Certificate',
      nameHi: 'सक्षम आय प्रमाण पत्र',
      required: false,
      status: 'Uploaded',
      file: 'income_cert.pdf',
      size: '390 KB',
      updated: '2026-09-03',
      reason: ''
    },
    {
      id: 'caste',
      nameEn: 'Caste / Category Certificate',
      nameHi: 'जाति / श्रेणी प्रमाण पत्र',
      required: false,
      status: 'Not Uploaded',
      file: null,
      size: '',
      updated: '',
      reason: ''
    }
  ]);

  const [uploadSuccessMsg, setUploadSuccessMsg] = useState(null);

  const handleReplaceDoc = (id) => {
    setDocList(prev => prev.map(d => {
      if (d.id === id) {
        return {
          ...d,
          status: 'Under Verification',
          file: `replaced_${id}_document.pdf`,
          size: '450 KB',
          updated: new Date().toISOString().split('T')[0],
          reason: ''
        };
      }
      return d;
    }));

    setUploadSuccessMsg(lang === 'hi' ? 'दस्तावेज़ सफलतापूर्वक प्रतिस्थापित कर दिया गया है। संवीक्षा प्रगति पर है।' : 'Document replaced successfully. Now under verification.');
    setTimeout(() => setUploadSuccessMsg(null), 4000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified':
        return <span className="badge badge-green"><CheckCircle2 size={12} /> Verified</span>;
      case 'Under Verification':
        return <span className="badge badge-blue"><Clock size={12} /> Under Scrutiny</span>;
      case 'Uploaded':
        return <span className="badge badge-yellow"><FileText size={12} /> Uploaded</span>;
      case 'Rejected':
        return <span className="badge badge-red"><XCircle size={12} /> Rejected</span>;
      default:
        return <span className="badge badge-navy">Not Uploaded</span>;
    }
  };

  return (
    <div className="section-py" style={{ backgroundColor: '#F8FAFC', minHeight: '80vh' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-navy" style={{ marginBottom: '0.5rem' }}>
              {lang === 'hi' ? 'दस्तावेज़ सत्यापन केंद्र' : 'DOCUMENT SCRUTINY PORTAL'}
            </span>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A' }}>
              {lang === 'hi' ? 'दस्तावेज़ प्रबंधन एवं सत्यापन स्थिति' : 'Document Upload & Verification Management'}
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
              {lang === 'hi'
                ? 'अपने अपलोड किए गए दस्तावेज़ों की जांच स्थिति देखें अथवा अस्वीकृत दस्तावेज़ों को पुनः अपलोड करें।'
                : 'Monitor scrutiny status, review verifier remarks, and replace rejected documents directly.'}
            </p>
          </div>

          <button className="btn btn-outline" onClick={() => navigate('/student-dashboard')}>
            <span>{lang === 'hi' ? 'विद्यार्थी डैशबोर्ड' : 'Student Dashboard'}</span>
          </button>
        </div>

        {uploadSuccessMsg && (
          <div style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '1rem 1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle2 size={20} />
            <span style={{ fontWeight: 600 }}>{uploadSuccessMsg}</span>
          </div>
        )}

        {/* Guidelines Banner */}
        <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '16px', padding: '1.5rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <ShieldCheck size={26} color="#1E40AF" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1E3A8A', marginBottom: '0.4rem' }}>
              {lang === 'hi' ? 'दस्तावेज़ सत्यापन दिशानिर्देश' : 'Standard Document Scrutiny Guidelines'}
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#1E40AF', lineHeight: 1.6 }}>
              {lang === 'hi'
                ? '1. सभी दस्तावेज़ मूल प्रतियों से स्पष्ट स्कैन किए गए होने चाहिए। 2. फोटो एवं हस्ताक्षर स्पष्ट होने चाहिए। 3. अस्वीकृत दस्तावेज़ों के कारण को पढ़कर उसी आधार पर नवीन स्पष्ट प्रति अपलोड करें।'
                : '1. Ensure scans are taken directly from original certificates. 2. Mobile photos must be glare-free. 3. For rejected documents, read the scrutiny remark carefully before uploading a replacement.'}
            </p>
          </div>
        </div>

        {/* Documents Cards Grid */}
        <div className="grid-2">
          {docList.map((doc) => (
            <div 
              key={doc.id} 
              className="card"
              style={{
                borderLeft: doc.status === 'Verified' ? '5px solid #16A34A' : doc.status === 'Rejected' ? '5px solid #DC2626' : '5px solid #1E40AF',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.2rem' }}>
                    {lang === 'hi' ? doc.nameHi : doc.nameEn}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: doc.required ? '#DC2626' : '#64748B', fontWeight: 600 }}>
                    {doc.required ? (lang === 'hi' ? 'अनिवार्य दस्तावेज़' : 'Compulsory Document') : (lang === 'hi' ? 'वैकल्पिक' : 'Optional')}
                  </div>
                </div>

                <div>
                  {getStatusBadge(doc.status)}
                </div>
              </div>

              {doc.file ? (
                <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #E2E8F0', marginBottom: '1rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: '#334155' }}>{doc.file}</span>
                    <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>{doc.size}</span>
                  </div>
                  {doc.updated && (
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                      Last Updated: {doc.updated}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ padding: '0.85rem 1rem', borderRadius: '10px', backgroundColor: '#FEF2F2', color: '#991B1B', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  {lang === 'hi' ? 'यह दस्तावेज़ अभी तक अपलोड नहीं किया गया है।' : 'No file uploaded yet.'}
                </div>
              )}

              {/* Rejection Alert & Action */}
              {doc.status === 'Rejected' && (
                <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#DC2626', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <AlertCircle size={16} />
                    <span>{lang === 'hi' ? 'अस्वीकृति का कारण (Rejection Reason)' : 'Rejection Reason'}</span>
                  </div>
                  <div style={{ color: '#991B1B', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    {doc.reason}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.5rem' }}>
                {doc.status === 'Rejected' ? (
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => handleReplaceDoc(doc.id)}
                  >
                    <RefreshCw size={14} />
                    <span>{lang === 'hi' ? 'नया दस्तावेज़ बदलें / अपलोड करें' : 'Upload Replacement'}</span>
                  </button>
                ) : doc.status === 'Not Uploaded' ? (
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleReplaceDoc(doc.id)}
                  >
                    <Upload size={14} />
                    <span>{lang === 'hi' ? 'दस्तावेज़ अपलोड करें' : 'Upload Document'}</span>
                  </button>
                ) : (
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => handleReplaceDoc(doc.id)}
                  >
                    <Upload size={14} />
                    <span>{lang === 'hi' ? 'प्रतिस्थापित करें' : 'Replace File'}</span>
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
