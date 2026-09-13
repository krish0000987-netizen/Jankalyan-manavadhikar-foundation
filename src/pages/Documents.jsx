import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { uploadFile, validateDocumentFile, getSignedUrl } from '../api/storage';
import { supabase } from '../api/supabase';
import { applicationService } from '../services/applicationService';
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
  FileCheck,
  Search,
  Loader2
} from 'lucide-react';

export const Documents = () => {
  const { lang, t, navigate, activeStudentApp, setActiveStudentApp } = useApp();
  const fileInputRef = useRef(null);
  const [activeDocToUpload, setActiveDocToUpload] = useState(null);
  const [uploadingDocId, setUploadingDocId] = useState(null);
  const [searchAppId, setSearchAppId] = useState('');
  const [searching, setSearching] = useState(false);

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
  const [uploadErrorMsg, setUploadErrorMsg] = useState(null);

  const handleStartUpload = (docId) => {
    setActiveDocToUpload(docId);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeDocToUpload) return;

    const validation = validateDocumentFile(file, 3072);
    if (!validation.valid) {
      setUploadErrorMsg(validation.error);
      setTimeout(() => setUploadErrorMsg(null), 5000);
      return;
    }

    setUploadingDocId(activeDocToUpload);
    setUploadErrorMsg(null);

    try {
      const appId = activeStudentApp?.id || 'JMF-2026-108234';
      const ext = file.name.split('.').pop() || 'pdf';
      const storagePath = `${appId}/${activeDocToUpload}_${Date.now()}.${ext}`;

      // Upload to Supabase Storage
      await uploadFile('student-documents', storagePath, file, { upsert: true });

      // Update local state
      const fileSize = `${(file.size / 1024).toFixed(0)} KB`;
      setDocList(prev => prev.map(d => {
        if (d.id === activeDocToUpload) {
          return {
            ...d,
            status: 'Under Verification',
            file: file.name,
            size: fileSize,
            updated: new Date().toISOString().split('T')[0],
            reason: ''
          };
        }
        return d;
      }));

      setUploadSuccessMsg(lang === 'hi' ? 'दस्तावेज़ सफलतापूर्वक अपलोड हो गया है। संवीक्षा प्रगति पर है।' : `Document "${file.name}" uploaded to secure storage. Under scrutiny.`);
      setTimeout(() => setUploadSuccessMsg(null), 5000);
    } catch (err) {
      console.error('Document upload error:', err);
      setUploadErrorMsg(err.message || 'Upload failed. Please check network connection and try again.');
    } finally {
      setUploadingDocId(null);
      setActiveDocToUpload(null);
    }
  };

  const handleLookupApp = async (e) => {
    e.preventDefault();
    if (!searchAppId.trim()) return;
    setSearching(true);
    try {
      const result = await applicationService.trackApplication(searchAppId.trim());
      if (result) {
        setActiveStudentApp({
          id: result.id,
          studentName: result.student_name || 'Applicant',
          mobile: result.mobile || ''
        });
      } else {
        setUploadErrorMsg('Application ID not found.');
        setTimeout(() => setUploadErrorMsg(null), 4000);
      }
    } catch (err) {
      setUploadErrorMsg('Error finding application.');
    } finally {
      setSearching(false);
    }
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
              {activeStudentApp?.id ? (
                <span>Application ID: <strong style={{ color: '#1E40AF' }}>{activeStudentApp.id}</strong> ({activeStudentApp.studentName})</span>
              ) : (
                lang === 'hi'
                  ? 'अपने अपलोड किए गए दस्तावेज़ों की जांच स्थिति देखें अथवा अस्वीकृत दस्तावेज़ों को पुनः अपलोड करें।'
                  : 'Monitor scrutiny status, review verifier remarks, and upload new documents directly.'
              )}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <form onSubmit={handleLookupApp} style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Lookup App ID..." 
                value={searchAppId}
                onChange={(e) => setSearchAppId(e.target.value)}
                style={{ width: '180px', height: '38px', fontSize: '0.85rem' }}
              />
              <button type="submit" className="btn btn-secondary btn-sm" disabled={searching}>
                {searching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
              </button>
            </form>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/student-dashboard')}>
              <span>{lang === 'hi' ? 'विद्यार्थी डैशबोर्ड' : 'Student Dashboard'}</span>
            </button>
          </div>
        </div>

        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".jpg,.jpeg,.png,.pdf" 
          style={{ display: 'none' }} 
        />

        {uploadSuccessMsg && (
          <div style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '1rem 1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle2 size={20} />
            <span style={{ fontWeight: 600 }}>{uploadSuccessMsg}</span>
          </div>
        )}

        {uploadErrorMsg && (
          <div style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '1rem 1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #FCA5A5', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={20} />
            <span style={{ fontWeight: 600 }}>{uploadErrorMsg}</span>
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
                ? '1. सभी दस्तावेज़ मूल प्रतियों से स्पष्ट स्कैन किए गए होने चाहिए (अधिकतम 3 MB)। 2. फोटो एवं हस्ताक्षर स्पष्ट होने चाहिए। 3. अस्वीकृत दस्तावेज़ों के कारण को पढ़कर उसी आधार पर नवीन स्पष्ट प्रति अपलोड करें।'
                : '1. Scans must be taken from original certificates (max 3 MB, JPG/PNG/PDF). 2. Files are stored securely in Supabase storage. 3. Verifiers will re-scrutinize any replaced documents within 24-48 hours.'}
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
                <button 
                  className={`btn ${doc.status === 'Rejected' ? 'btn-primary' : doc.status === 'Not Uploaded' ? 'btn-secondary' : 'btn-outline'} btn-sm`}
                  disabled={uploadingDocId === doc.id}
                  onClick={() => handleStartUpload(doc.id)}
                >
                  {uploadingDocId === doc.id ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      {doc.status === 'Rejected' ? <RefreshCw size={14} /> : <Upload size={14} />}
                      <span>
                        {doc.status === 'Rejected' 
                          ? (lang === 'hi' ? 'नया दस्तावेज़ अपलोड करें' : 'Upload Replacement')
                          : (lang === 'hi' ? 'दस्तावेज़ चुनें व अपलोड करें' : 'Upload File')}
                      </span>
                    </>
                  )}
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
