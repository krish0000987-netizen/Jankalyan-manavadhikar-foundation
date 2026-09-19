import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { uploadFile, validateDocumentFile, getSignedUrl, getDocumentViewUrl, downloadStorageFile } from '../api/storage';
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
  Loader2,
  ExternalLink,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  X
} from 'lucide-react';

export const Documents = () => {
  const { lang, t, navigate, activeStudentApp, setActiveStudentApp } = useApp();
  const fileInputRef = useRef(null);
  const [activeDocToUpload, setActiveDocToUpload] = useState(null);
  const [uploadingDocId, setUploadingDocId] = useState(null);
  const [searchAppId, setSearchAppId] = useState('');
  const [searching, setSearching] = useState(false);

  const [docViewUrls, setDocViewUrls] = useState({});
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewZoom, setPreviewZoom] = useState(1);
  const [previewRotate, setPreviewRotate] = useState(0);
  const [resolvingDocId, setResolvingDocId] = useState(null);

  // Documents state for active student
  const [docList, setDocList] = useState([
    {
      id: 'photo',
      nameEn: 'Passport-size Photograph',
      nameHi: 'पासपोर्ट आकार का फोटो',
      required: true,
      status: 'Verified',
      file: 'photo_applicant.jpg',
      filePath: null,
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
      filePath: null,
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
      filePath: null,
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
      filePath: null,
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
      filePath: null,
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
      filePath: null,
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
      filePath: null,
      size: '',
      updated: '',
      reason: ''
    }
  ]);

  // Synchronize docList with activeStudentApp.documents and server rejection remarks
  useEffect(() => {
    if (!activeStudentApp?.documents) return;
    setDocList(prev => prev.map(item => {
      const serverDoc = activeStudentApp.documents[item.id] || activeStudentApp.documents[item.id.toLowerCase()];
      if (serverDoc) {
        const isDocRejected = serverDoc.status === 'Rejected' || serverDoc.status === 'INVALID';
        const isDocCorrection = serverDoc.status === 'Correction Requested' || serverDoc.status === 'CORRECTION_REQUIRED';
        return {
          ...item,
          status: isDocRejected ? 'Rejected' : isDocCorrection ? 'Correction Requested' : serverDoc.status || item.status,
          file: serverDoc.file || serverDoc.file_name || item.file,
          filePath: serverDoc.filePath || serverDoc.file_path || serverDoc.fileUrl || serverDoc.file_url || item.filePath,
          bucketName: serverDoc.bucketName || serverDoc.bucket_name || 'student-documents',
          size: serverDoc.fileSizeKb ? `${serverDoc.fileSizeKb} KB` : item.size,
          reason: serverDoc.reason !== undefined && serverDoc.reason !== null && String(serverDoc.reason).trim() !== ''
            ? serverDoc.reason
            : (isDocRejected || isDocCorrection ? (activeStudentApp.rejectionReason || activeStudentApp.correctionRemarks || item.reason) : item.reason),
          updated: serverDoc.updated || item.updated
        };
      }
      return item;
    }));
  }, [activeStudentApp]);

  // Pre-fetch signed URLs for uploaded documents
  useEffect(() => {
    let isMounted = true;
    const resolveUrls = async () => {
      const urls = {};
      for (const d of docList) {
        if (d.filePath && !docViewUrls[d.id]) {
          try {
            const url = await getDocumentViewUrl(d.bucketName || 'student-documents', d.filePath, 3600);
            if (url && isMounted) {
              urls[d.id] = url;
            }
          } catch (e) {
            console.warn('Could not resolve signed view URL for doc', d.id, e);
          }
        }
      }
      if (isMounted && Object.keys(urls).length > 0) {
        setDocViewUrls(prev => ({ ...prev, ...urls }));
      }
    };
    resolveUrls();
    return () => { isMounted = false; };
  }, [docList]);

  const [uploadSuccessMsg, setUploadSuccessMsg] = useState(null);
  const [uploadErrorMsg, setUploadErrorMsg] = useState(null);

  const handleStartUpload = (docId) => {
    setActiveDocToUpload(docId);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleOpenPreview = async (doc) => {
    setResolvingDocId(doc.id);
    let viewUrl = docViewUrls[doc.id];
    if (!viewUrl && (doc.filePath || doc.file)) {
      const path = doc.filePath || `${activeStudentApp?.id || 'JMF-2026-108234'}/${doc.file}`;
      try {
        viewUrl = await getDocumentViewUrl(doc.bucketName || 'student-documents', path, 3600);
        if (viewUrl) {
          setDocViewUrls(prev => ({ ...prev, [doc.id]: viewUrl }));
        }
      } catch (err) {
        console.warn('Preview URL resolution failed:', err);
      }
    }
    setResolvingDocId(null);
    setPreviewDoc({
      ...doc,
      url: viewUrl || (typeof doc.file === 'string' && (doc.file.startsWith('http') || doc.file.startsWith('data:')) ? doc.file : null)
    });
    setPreviewZoom(1);
    setPreviewRotate(0);
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
            filePath: storagePath,
            size: fileSize,
            updated: new Date().toISOString().split('T')[0],
            reason: ''
          };
        }
        return d;
      }));

      // Update activeStudentApp state
      if (setActiveStudentApp) {
        setActiveStudentApp(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            documents: {
              ...(prev.documents || {}),
              [activeDocToUpload]: {
                ...(prev.documents?.[activeDocToUpload] || {}),
                status: 'Under Verification',
                file: file.name,
                fileName: file.name,
                filePath: storagePath,
                file_path: storagePath,
                bucketName: 'student-documents',
                reason: ''
              }
            }
          };
        });
      }

      // Generate signed URL immediately for fast preview
      try {
        const freshUrl = await getDocumentViewUrl('student-documents', storagePath, 3600);
        if (freshUrl) {
          setDocViewUrls(prev => ({ ...prev, [activeDocToUpload]: freshUrl }));
        }
      } catch (urlErr) {
        console.warn('Could not generate immediate signed URL:', urlErr);
      }

      // Persist to Supabase application_documents table if appId is valid
      if (activeStudentApp?.id) {
        try {
          const { data: existingDoc } = await supabase
            .from('application_documents')
            .select('id')
            .eq('application_id', activeStudentApp.id)
            .eq('document_type_id', activeDocToUpload)
            .maybeSingle();

          if (existingDoc?.id) {
            await supabase
              .from('application_documents')
              .update({
                file_name: file.name,
                file_path: storagePath,
                bucket_name: 'student-documents',
                file_size_kb: Math.round(file.size / 1024),
                mime_type: file.type || 'application/octet-stream',
                verification_status: 'UPLOADED',
                rejection_reason: null,
                updated_at: new Date().toISOString()
              })
              .eq('id', existingDoc.id);
          } else {
            await supabase
              .from('application_documents')
              .insert({
                application_id: activeStudentApp.id,
                document_type_id: activeDocToUpload,
                file_name: file.name,
                file_path: storagePath,
                bucket_name: 'student-documents',
                file_size_kb: Math.round(file.size / 1024),
                mime_type: file.type || 'application/octet-stream',
                verification_status: 'UPLOADED',
                rejection_reason: null
              });
          }
        } catch (dbErr) {
          console.warn('Could not sync to application_documents table:', dbErr);
        }
      }

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
    const query = searchAppId.trim();
    if (!query) return;
    setSearching(true);
    try {
      let fullApp = await applicationService.getApplicationById(query);
      if (!fullApp && query.toLowerCase().startsWith('jmf-')) {
        fullApp = await applicationService.getApplicationById(query.toUpperCase());
      }
      if (!fullApp) {
        const result = await applicationService.trackApplication(query);
        if (result?.id) {
          fullApp = await applicationService.getApplicationById(result.id) || result;
        }
      }

      if (fullApp && fullApp.id) {
        setActiveStudentApp(fullApp);
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
      case 'Correction Requested':
        return <span className="badge badge-yellow"><AlertCircle size={12} /> Correction Needed</span>;
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

              {/* Rejection / Defective Alert & Action */}
              {(doc.status === 'Rejected' || doc.status === 'Correction Requested' || (doc.reason && String(doc.reason).trim() !== '')) && (
                <div style={{ backgroundColor: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#DC2626', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <AlertCircle size={16} />
                    <span>{lang === 'hi' ? 'अस्वीकृति / त्रुटि का कारण (Scrutiny Remarks):' : 'Scrutiny Officer Rejection Reason:'}</span>
                  </div>
                  <div style={{ color: '#991B1B', fontSize: '0.85rem', lineHeight: 1.5, fontWeight: 600, backgroundColor: '#FFFFFF', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #FCA5A5' }}>
                    "{doc.reason || activeStudentApp?.rejectionReason || activeStudentApp?.correctionRemarks || (lang === 'hi' ? 'दस्तावेज़ स्पष्ट नहीं है अथवा निर्धारित प्रारूप में नहीं है।' : 'Document is unclear or missing mandatory verification stamp.')}"
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.5rem', flexWrap: 'wrap' }}>
                {(doc.file || doc.filePath || docViewUrls[doc.id]) && (
                  <button 
                    type="button"
                    className="btn btn-outline btn-sm"
                    disabled={resolvingDocId === doc.id}
                    onClick={() => handleOpenPreview(doc)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', borderColor: '#CBD5E1', color: '#1E40AF', fontWeight: 600 }}
                    title="Inspect uploaded document"
                  >
                    {resolvingDocId === doc.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Eye size={14} />
                    )}
                    <span>{lang === 'hi' ? 'दस्तावेज़ देखें' : 'View Doc'}</span>
                  </button>
                )}

                <button 
                  className={`btn ${(doc.status === 'Rejected' || doc.status === 'Correction Requested' || doc.reason) ? 'btn-primary' : doc.status === 'Not Uploaded' ? 'btn-secondary' : 'btn-outline'} btn-sm`}
                  disabled={uploadingDocId === doc.id}
                  onClick={() => handleStartUpload(doc.id)}
                  style={(doc.status === 'Rejected' || doc.status === 'Correction Requested' || doc.reason) ? { backgroundColor: '#DC2626', borderColor: '#DC2626' } : {}}
                >
                  {uploadingDocId === doc.id ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      {(doc.status === 'Rejected' || doc.status === 'Correction Requested' || doc.reason) ? <RefreshCw size={14} /> : <Upload size={14} />}
                      <span>
                        {(doc.status === 'Rejected' || doc.status === 'Correction Requested' || doc.reason)
                          ? (lang === 'hi' ? 'नवीन स्पष्ट दस्तावेज़ अपलोड करें' : 'Upload Replacement')
                          : (lang === 'hi' ? 'दस्तावेज़ चुनें व अपलोड करें' : 'Upload File')}
                      </span>
                    </>
                  )}
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Student Document Preview Modal */}
        {previewDoc && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(6px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem'
            }}
            onClick={() => setPreviewDoc(null)}
          >
            <div 
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '850px',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={18} color="#1E40AF" />
                    <span>{lang === 'hi' ? previewDoc.nameHi : previewDoc.nameEn}</span>
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                    {previewDoc.file || previewDoc.filePath || 'Uploaded Document'} {previewDoc.size ? `(${previewDoc.size})` : ''}
                  </p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {previewDoc.url && (
                    <>
                      <button 
                        type="button" 
                        className="btn btn-outline btn-sm"
                        onClick={() => setPreviewZoom(z => Math.min(z + 0.25, 3))}
                        title="Zoom in"
                        style={{ padding: '6px 10px' }}
                      >
                        <ZoomIn size={14} />
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline btn-sm"
                        onClick={() => setPreviewZoom(z => Math.max(z - 0.25, 0.5))}
                        title="Zoom out"
                        style={{ padding: '6px 10px' }}
                      >
                        <ZoomOut size={14} />
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline btn-sm"
                        onClick={() => setPreviewRotate(r => (r + 90) % 360)}
                        title="Rotate 90°"
                        style={{ padding: '6px 10px' }}
                      >
                        <RotateCw size={14} />
                      </button>
                      <a 
                        href={previewDoc.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-outline btn-sm"
                        title="Open in new tab"
                        style={{ padding: '6px 10px', textDecoration: 'none' }}
                      >
                        <ExternalLink size={14} />
                      </a>
                      <button 
                        type="button" 
                        className="btn btn-primary btn-sm"
                        onClick={() => downloadStorageFile(previewDoc.url, previewDoc.file || `${previewDoc.id}.jpg`)}
                        style={{ padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <Download size={14} />
                        <span>Download</span>
                      </button>
                    </>
                  )}
                  <button 
                    type="button"
                    onClick={() => setPreviewDoc(null)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px', color: '#64748B', borderRadius: '6px' }}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Viewer Body */}
              <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem', backgroundColor: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                {previewDoc.url ? (
                  (previewDoc.file?.toLowerCase().endsWith('.pdf') || (previewDoc.filePath && previewDoc.filePath.toLowerCase().endsWith('.pdf'))) ? (
                    <iframe 
                      src={`${previewDoc.url}#toolbar=1`} 
                      title={previewDoc.nameEn}
                      style={{ width: '100%', height: '520px', border: 'none', borderRadius: '8px', backgroundColor: '#FFFFFF' }}
                    />
                  ) : (
                    <div style={{ overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: '100%', maxHeight: '550px' }}>
                      <img 
                        src={previewDoc.url} 
                        alt={previewDoc.nameEn} 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '520px', 
                          objectFit: 'contain',
                          borderRadius: '6px',
                          transform: `scale(${previewZoom}) rotate(${previewRotate}deg)`,
                          transition: 'transform 0.2s ease',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                        }} 
                      />
                    </div>
                  )
                ) : (
                  <div style={{ color: '#E2E8F0', textAlign: 'center', padding: '2rem' }}>
                    <AlertCircle size={40} color="#F59E0B" style={{ margin: '0 auto 1rem auto' }} />
                    <p style={{ fontWeight: 600, fontSize: '1rem' }}>Secure Preview Unavailable</p>
                    <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.25rem' }}>
                      This document record is pending upload or awaiting signed storage token.
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', fontSize: '0.8rem', color: '#64748B' }}>
                <span>Status: <strong style={{ color: previewDoc.status === 'Verified' ? '#16A34A' : previewDoc.status === 'Rejected' ? '#DC2626' : '#1E40AF' }}>{previewDoc.status}</strong></span>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setPreviewDoc(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
