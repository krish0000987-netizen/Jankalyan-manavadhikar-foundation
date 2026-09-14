import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Upload, 
  Printer, 
  Sparkles, 
  Search, 
  ShieldCheck, 
  AlertCircle, 
  FileCheck, 
  Lock,
  Eye,
  RefreshCw,
  Building,
  UserCheck
} from 'lucide-react';
import { QrCodeDisplay } from '../components/common/QrCodeDisplay';
import { applicationService } from '../services/applicationService';

export const SCHOLARSHIP_SLABS = [
  { id: 'slab-1', nameHi: '5वीं से 7वीं', nameEn: 'Class 5th - 7th', amount: 4000, amountDisplay: '₹4,000/-', period: 'वार्षिक', color: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD', defaultCourse: 'Class 6th' },
  { id: 'slab-2', nameHi: '8वीं से 10वीं', nameEn: 'Class 8th - 10th', amount: 8000, amountDisplay: '₹8,000/-', period: 'वार्षिक', color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0', defaultCourse: 'Class 10th' },
  { id: 'slab-3', nameHi: '11वीं से 12वीं', nameEn: 'Class 11th - 12th', amount: 12000, amountDisplay: '₹12,000/-', period: 'वार्षिक', color: '#E11D48', bg: '#FFF1F2', border: '#FECDD3', defaultCourse: 'Class 12th' },
  { id: 'slab-4', nameHi: 'Diploma / ITI', nameEn: 'Diploma / Polytechnic / ITI', amount: 14000, amountDisplay: '₹14,000/-', period: 'वार्षिक', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', defaultCourse: 'Polytechnic Diploma' },
  { id: 'slab-5', nameHi: 'Graduation (स्नातक)', nameEn: 'Graduation (Degree)', amount: 16000, amountDisplay: '₹16,000/-', period: 'वार्षिक', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', defaultCourse: 'B.Sc / B.A / B.Com' },
  { id: 'slab-6', nameHi: 'Post Graduation (परास्नातक)', nameEn: 'Post Graduation (Master)', amount: 22000, amountDisplay: '₹22,000/-', period: 'वार्षिक', color: '#1E3A8A', bg: '#EFF6FF', border: '#BFDBFE', defaultCourse: 'M.Sc / M.A / M.Com' }
];

export const Apply = () => {
  const { lang, t, navigate, submitNewApplication, cms } = useApp();

  // Wizard Step (1 to 8, or 9 for Final Submission Confirmation)
  const [currentStep, setCurrentStep] = useState(1);

  // Registered Institutions & Districts
  const [registeredInstitutions, setRegisteredInstitutions] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [isOtherInstitution, setIsOtherInstitution] = useState(false);
  const [institutionLevelFilter, setInstitutionLevelFilter] = useState('All'); // 'All' | 'School' | 'College'

  // Form State
  const [formData, setFormData] = useState(() => {
    const savedDraft = localStorage.getItem('jmf_app_draft');
    return savedDraft ? JSON.parse(savedDraft) : {
      // Step 1: Registration
      mobile: '',
      otp: '',
      otpSent: false,
      otpVerified: false,
      email: '',
      password: '',
      confirmPassword: '',

      // Step 2: Personal
      fullName: '',
      fatherName: '',
      motherName: '',
      dob: '',
      gender: 'Male',
      address: '',
      state: 'Madhya Pradesh',
      district: 'Jabalpur',
      districtId: 'a0000000-0000-0000-0000-000000000001',
      block: 'Patan',
      blockId: 'b0000000-0000-0000-0000-000000000001',
      villageCity: '',
      pincode: '',

      // Step 3: Academic & Poster Scholarship Slabs
      institutionId: 'c0000000-0000-0000-0000-000000000001',
      institutionName: 'Govt. Model Higher Secondary School',
      institutionCategory: 'School',
      selectedSlab: 'slab-3',
      scholarshipAmount: 12000,
      registrationFee: '₹ 211.30/-',
      classCourse: 'Class 12th',
      academicYear: '2026-27',
      boardUni: '',
      rollNo: '',
      enrollmentNo: '',
      prevExam: '',
      prevMarks: '',
      percentage: '',

      // Step 4: Category
      category: 'General',
      annualIncome: '',

      // Step 5: Bank Details
      accountHolder: '',
      bankName: 'State Bank of India',
      accountNumber: '',
      confirmAccount: '',
      ifsc: '',
      branch: '',

      // Step 6: Identity
      aadhaar: '',
      samagraId: '',

      // Step 7: Documents
      photoFile: null,
      photoFileName: '',
      aadhaarFile: null,
      aadhaarFileName: '',
      marksheetFile: null,
      marksheetFileName: '',
      bonafideFile: null,
      bonafideFileName: '',
      passbookFile: null,
      passbookFileName: '',
      incomeFile: null,
      incomeFileName: '',
      casteFile: null,
      casteFileName: '',

      // Step 8: Declaration
      declared: false
    };
  });

  const [errors, setErrors] = useState({});
  const [draftSavedMsg, setDraftSavedMsg] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState(null);

  // Load registered institutions and districts from DB
  useEffect(() => {
    async function loadMeta() {
      try {
        const [insts, dists] = await Promise.all([
          applicationService.getInstitutions(),
          applicationService.getDistricts()
        ]);
        if (insts && insts.length > 0) setRegisteredInstitutions(insts);
        if (dists && dists.length > 0) setDistrictsList(dists);
      } catch (err) {
        console.warn('Metadata load note:', err);
      }
    }
    loadMeta();
  }, []);

  // Autosave Draft
  const saveDraft = () => {
    localStorage.setItem('jmf_app_draft', JSON.stringify(formData));
    setDraftSavedMsg(true);
    setTimeout(() => setDraftSavedMsg(false), 3000);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleDistrictChange = (distName) => {
    let defaultBlock = 'Patan';
    if (distName === 'Bhopal') defaultBlock = 'Berasia';
    else if (distName === 'Indore') defaultBlock = 'Depalpur';
    else if (distName === 'Rewa') defaultBlock = 'Mauganj';
    else if (distName === 'Mandla') defaultBlock = 'Niwas';
    else if (distName === 'Gwalior') defaultBlock = 'Gwalior';

    setFormData(prev => {
      // Find matching institution in this district if currently set
      const matchingInst = registeredInstitutions.find(i => 
        (i.districts?.name || '').toLowerCase() === distName.toLowerCase()
      );

      return {
        ...prev,
        district: distName,
        block: defaultBlock,
        institutionId: matchingInst ? matchingInst.id : prev.institutionId,
        institutionName: matchingInst ? matchingInst.name : prev.institutionName
      };
    });
  };

  const handleInstitutionSelect = (e) => {
    const val = e.target.value;
    if (val === '__OTHER__') {
      setIsOtherInstitution(true);
      setFormData(prev => ({ ...prev, institutionId: '', institutionName: '' }));
    } else {
      setIsOtherInstitution(false);
      const selectedInst = registeredInstitutions.find(i => i.id === val);
      if (selectedInst) {
        setFormData(prev => ({
          ...prev,
          institutionId: selectedInst.id,
          institutionName: selectedInst.name,
          institutionCategory: selectedInst.category,
          district: selectedInst.districts?.name || prev.district,
          districtId: selectedInst.district_id || prev.districtId,
          block: selectedInst.blocks?.name || prev.block,
          blockId: selectedInst.block_id || prev.blockId
        }));
      }
    }
  };

  const handleFileSelect = (docKey, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData(prev => ({
      ...prev,
      [docKey + 'File']: file,
      [docKey + 'FileName']: file.name,
      [docKey + 'FileSize']: Math.round(file.size / 1024) + ' KB'
    }));
  };

  const handleAutoFillDemoDocs = () => {
    setFormData(prev => ({
      ...prev,
      photoFile: 'passport_photo.jpg',
      photoFileName: 'passport_photo.jpg',
      aadhaarFile: 'aadhaar_card.pdf',
      aadhaarFileName: 'aadhaar_card.pdf',
      marksheetFile: '12th_marksheet.pdf',
      marksheetFileName: '12th_marksheet.pdf',
      bonafideFile: 'bonafide_attestation.pdf',
      bonafideFileName: 'bonafide_attestation.pdf',
      passbookFile: 'bank_passbook.pdf',
      passbookFileName: 'bank_passbook.pdf'
    }));
  };

  // OTP Simulation
  const handleSendOtp = () => {
    if (!formData.mobile || formData.mobile.length < 10) {
      setErrors(prev => ({ ...prev, mobile: lang === 'hi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें' : 'Please enter valid 10-digit mobile' }));
      return;
    }
    setFormData(prev => ({ 
      ...prev, 
      otpSent: true, 
      otp: '123456', 
      otpVerified: true,
      password: prev.password || '123456',
      confirmPassword: prev.confirmPassword || '123456'
    }));
    setErrors(prev => ({ ...prev, mobile: null, otp: null }));
  };

  const handleVerifyOtp = () => {
    setFormData(prev => ({ ...prev, otp: prev.otp || '123456', otpVerified: true }));
    setErrors(prev => ({ ...prev, otp: null }));
  };

  // Step Validation
  const validateCurrentStep = () => {
    const errs = {};

    if (currentStep === 1) {
      if (!formData.mobile || formData.mobile.length < 10) {
        errs.mobile = lang === 'hi' ? 'मोबाइल नंबर आवश्यक है (10 अंक)' : 'Mobile number required (10 digits)';
      }
      if (!formData.password) {
        setFormData(prev => ({ ...prev, password: 'password123', confirmPassword: 'password123', otpVerified: true }));
      } else if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
        errs.confirmPassword = lang === 'hi' ? 'पासवर्ड मेल नहीं खा रहा है' : 'Passwords do not match';
      }
    }

    if (currentStep === 2) {
      if (!formData.fullName) errs.fullName = lang === 'hi' ? 'पूरा नाम अनिवार्य है' : 'Full name required';
      if (!formData.fatherName) errs.fatherName = lang === 'hi' ? 'पिता का नाम अनिवार्य है' : 'Father name required';
      if (!formData.dob) errs.dob = lang === 'hi' ? 'जन्म तिथि अनिवार्य है' : 'DOB required';
      if (!formData.district) errs.district = lang === 'hi' ? 'जिला अनिवार्य है' : 'District required';
      if (!formData.pincode || formData.pincode.length < 6) errs.pincode = lang === 'hi' ? '6 अंकों का पिन कोड दर्ज करें' : '6-digit PIN required';
    }

    if (currentStep === 3) {
      if (!formData.institutionName) errs.institutionName = lang === 'hi' ? 'संस्थान का नाम अनिवार्य है' : 'Institution name required';
      if (!formData.classCourse) errs.classCourse = lang === 'hi' ? 'कक्षा अथवा कोर्स अनिवार्य है' : 'Class / Course required';
      if (!formData.percentage) errs.percentage = lang === 'hi' ? 'प्राप्तांक प्रतिशत अनिवार्य है' : 'Percentage required';
    }

    if (currentStep === 5) {
      if (!formData.accountHolder) errs.accountHolder = lang === 'hi' ? 'खाताधारक का नाम अनिवार्य है' : 'Account holder name required';
      if (!formData.accountNumber) errs.accountNumber = lang === 'hi' ? 'खाता संख्या अनिवार्य है' : 'Account number required';
      if (formData.accountNumber !== formData.confirmAccount) errs.confirmAccount = lang === 'hi' ? 'खाता संख्या मेल नहीं खा रही' : 'Account numbers do not match';
      if (!formData.ifsc || formData.ifsc.length < 5) errs.ifsc = lang === 'hi' ? 'वैध IFSC कोड अनिवार्य है' : 'Valid IFSC required';
    }

    if (currentStep === 6) {
      if (!formData.aadhaar || formData.aadhaar.length < 12) {
        errs.aadhaar = lang === 'hi' ? '12 अंकों का वैध आधार नंबर अनिवार्य है' : 'Valid 12-digit Aadhaar required';
      }
    }

    if (currentStep === 8) {
      if (!formData.declared) {
        errs.declared = lang === 'hi' ? 'कृपया घोषणा को स्वीकार करें' : 'Please agree to declaration';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      saveDraft();
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinalSubmit = async () => {
    if (!formData.declared) {
      setErrors({ declared: lang === 'hi' ? 'कृपया घोषणा स्वीकार करें' : 'Please accept declaration' });
      return;
    }

    setIsSubmitting(true);
    try {
      const record = await submitNewApplication(formData);
      setSubmittedRecord(record);
      localStorage.removeItem('jmf_app_draft');
      setCurrentStep(9); // Confirmation Screen

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('Application submission error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    t.step1Tab,
    t.step2Tab,
    t.step3Tab,
    t.step4Tab,
    t.step5Tab,
    t.step6Tab,
    t.step7Tab,
    t.step8Tab
  ];

  return (
    <div className="section-py" style={{ backgroundColor: '#F8FAFC', minHeight: '80vh' }}>
      <div className="container">
        
        {/* Wizard Header Banner */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 2.5rem' }}>
          <span className="badge badge-red" style={{ marginBottom: '0.75rem' }}>
            {lang === 'hi' ? 'सत्र 2026-27' : 'Academic Session 2026-27'}
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
            {t.applyTitle}
          </h1>
          <p style={{ color: '#64748B', fontSize: '1rem' }}>
            {t.applySubtitle}
          </p>
        </div>

        {/* ====================================================================
            CONFIRMATION SCREEN (Step 9) - Generated Application ID & Printable Receipt
            ==================================================================== */}
        {currentStep === 9 && submittedRecord ? (
          <div className="card printable-area" style={{ maxWidth: '820px', margin: '0 auto', padding: '3rem 2.5rem', borderTop: '6px solid #16A34A' }}>
            
            {/* Printable Institutional Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #E2E8F0', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img 
                  src="/assets/logo.png" 
                  alt="Foundation Official Logo" 
                  style={{ width: '68px', height: '68px', objectFit: 'contain' }}
                />
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1B2A4E', margin: 0 }}>
                    {t.brandName}
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: '#DC2626', fontWeight: 700, margin: '2px 0' }}>
                    {t.brandSubtitle} - Official Acknowledgement Slip
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
                    Email: {cms.officialEmail} | Helpline: {cms.officialMobile}
                  </p>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-green" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
                  <CheckCircle size={14} />
                  <span>SUBMITTED</span>
                </span>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.5rem' }}>
                  Date: {submittedRecord.submissionDate}
                </div>
              </div>
            </div>

            {/* Success Heading */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }} className="no-print">
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                backgroundColor: '#DCFCE7', 
                color: '#16A34A', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 1rem' 
              }}>
                <CheckCircle size={36} />
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>
                {t.successTitle}
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
                {t.successSub}
              </p>
            </div>

            {/* Highlighted Application ID Box */}
            <div style={{
              backgroundColor: '#EFF6FF',
              border: '2px dashed #93C5FD',
              borderRadius: '16px',
              padding: '1.5rem',
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E40AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t.yourAppIdIs}
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#1E3A8A', margin: '0.4rem 0' }}>
                {submittedRecord.id}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                {lang === 'hi' 
                  ? 'कृपया भविष्य के संदर्भ एवं स्थिति जांच हेतु इस Application ID को सुरक्षित रखें।' 
                  : 'Please preserve this Application ID for tracking and all official correspondence.'}
              </div>
            </div>

            {/* Applicant Summary Table & Verification QR */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.4rem' }}>
                  Applicant Official Record
                </h4>
                <div className="grid-2" style={{ gap: '0.65rem', fontSize: '0.85rem' }}>
                  <div><strong>Student Name:</strong> {submittedRecord.studentName}</div>
                  <div><strong>Father's Name:</strong> {submittedRecord.fatherName}</div>
                  <div><strong>Registered Mobile:</strong> {submittedRecord.mobile}</div>
                  <div><strong>District:</strong> {submittedRecord.district}</div>
                  <div><strong>Institution:</strong> {submittedRecord.institution}</div>
                  <div><strong>Class / Course:</strong> {submittedRecord.course}</div>
                  <div><strong>Social Category:</strong> {submittedRecord.category}</div>
                  <div><strong>Bank Name:</strong> {submittedRecord.bankName}</div>
                  <div><strong>Account Number:</strong> {submittedRecord.accountNumber}</div>
                  <div><strong>IFSC Code:</strong> {submittedRecord.ifsc}</div>
                </div>
              </div>

              <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <QrCodeDisplay value={`${window.location.origin}/verify/application/${submittedRecord.id}`} size={110} />
                <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '0.4rem', fontWeight: 700 }}>
                  Scan to Verify Docket
                </div>
              </div>
            </div>

            {/* Actions (Hidden when printing) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', borderTop: '1px solid #E2E8F0', paddingTop: '2rem' }} className="no-print">
              <button 
                className="btn btn-primary"
                onClick={() => window.print()}
              >
                <Printer size={16} />
                <span>{t.btnDownloadReceipt}</span>
              </button>

              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/track')}
              >
                <Search size={16} />
                <span>{t.btnTrackNow}</span>
              </button>

              <button 
                className="btn btn-outline"
                onClick={() => navigate('/student-dashboard')}
              >
                <UserCheck size={16} />
                <span>{t.btnGoDashboard}</span>
              </button>
            </div>

          </div>
        ) : (

          /* ====================================================================
             8-STEP APPLICATION WIZARD
             ==================================================================== */
          <div className="card wizard-card">
            
            {/* Progress Bar & Steps Count */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1B2A4E' }}>
                Step {currentStep} of 8: {stepsList[currentStep - 1]}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
                {Math.round((currentStep / 8) * 100)}% Completed
              </span>
            </div>

            <div className="wizard-progress">
              <div className="wizard-bar">
                <div 
                  className="wizard-fill" 
                  style={{ width: `${(currentStep / 8) * 100}%` }} 
                />
              </div>
            </div>

            {/* Step 1: Student Registration & Mobile OTP */}
            {currentStep === 1 && (
              <div className="animate-fade-in">
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                  {t.step1Tab}
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
                  {t.uniqueAppIdNotice}
                </p>

                <div className="form-group">
                  <label className="form-label required">{t.fieldMobile}</label>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <input 
                      type="tel"
                      className={`form-control ${errors.mobile ? 'error' : ''}`}
                      placeholder="e.g. 9826112233"
                      maxLength={10}
                      value={formData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                    />
                    <button 
                      className="btn btn-secondary"
                      type="button"
                      onClick={handleSendOtp}
                    >
                      {formData.otpSent ? t.btnResendOtp : t.btnSendOtp}
                    </button>
                  </div>
                  {errors.mobile && <div className="form-error">{errors.mobile}</div>}
                </div>

                {formData.otpSent && (
                  <div className="form-group" style={{ backgroundColor: '#EFF6FF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #BFDBFE' }}>
                    <label className="form-label required">{t.fieldOtp}</label>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <input 
                        type="text"
                        className={`form-control ${errors.otp ? 'error' : ''}`}
                        placeholder="123456"
                        maxLength={6}
                        value={formData.otp}
                        onChange={(e) => handleInputChange('otp', e.target.value)}
                      />
                      <button 
                        className="btn btn-primary"
                        type="button"
                        onClick={handleVerifyOtp}
                      >
                        {formData.otpVerified ? 'Verified ✓' : 'Verify OTP'}
                      </button>
                    </div>
                    <div className="form-hint" style={{ color: '#1E40AF', fontWeight: 600 }}>
                      {t.otpHint}
                    </div>
                    {errors.otp && <div className="form-error">{errors.otp}</div>}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">{t.fieldEmail}</label>
                  <input 
                    type="email"
                    className="form-control"
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label required">{t.fieldPassword}</label>
                    <input 
                      type="password"
                      className={`form-control ${errors.password ? 'error' : ''}`}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                    />
                    {errors.password && <div className="form-error">{errors.password}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label required">{t.fieldConfirmPassword}</label>
                    <input 
                      type="password"
                      className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    />
                    {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && (
              <div className="animate-fade-in">
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.5rem' }}>
                  {t.step2Tab}
                </h3>

                <div className="form-group">
                  <label className="form-label required">{t.fieldFullName}</label>
                  <input 
                    type="text"
                    className={`form-control ${errors.fullName ? 'error' : ''}`}
                    placeholder="Student's official legal name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                  />
                  {errors.fullName && <div className="form-error">{errors.fullName}</div>}
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label required">{t.fieldFatherName}</label>
                    <input 
                      type="text"
                      className={`form-control ${errors.fatherName ? 'error' : ''}`}
                      value={formData.fatherName}
                      onChange={(e) => handleInputChange('fatherName', e.target.value)}
                    />
                    {errors.fatherName && <div className="form-error">{errors.fatherName}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t.fieldMotherName}</label>
                    <input 
                      type="text"
                      className="form-control"
                      value={formData.motherName}
                      onChange={(e) => handleInputChange('motherName', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label required">{t.fieldDob}</label>
                    <input 
                      type="date"
                      className={`form-control ${errors.dob ? 'error' : ''}`}
                      value={formData.dob}
                      onChange={(e) => handleInputChange('dob', e.target.value)}
                    />
                    {errors.dob && <div className="form-error">{errors.dob}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label required">{t.fieldGender}</label>
                    <select 
                      className="form-control"
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                    >
                      <option value="Male">{t.fieldMale}</option>
                      <option value="Female">{t.fieldFemale}</option>
                      <option value="Other">{t.fieldOther}</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label required">{t.fieldAddress}</label>
                  <textarea 
                    className="form-control"
                    rows={2}
                    placeholder="House / Street / Locality"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>

                <div className="form-row-3">
                  <div className="form-group">
                    <label className="form-label required">{t.fieldDistrict}</label>
                    <select 
                      className="form-control"
                      value={formData.district}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                    >
                      <option value="Jabalpur">Jabalpur</option>
                      <option value="Bhopal">Bhopal</option>
                      <option value="Indore">Indore</option>
                      <option value="Rewa">Rewa</option>
                      <option value="Mandla">Mandla</option>
                      <option value="Gwalior">Gwalior</option>
                      {districtsList.filter(d => !['Jabalpur','Bhopal','Indore','Rewa','Mandla','Gwalior'].includes(d.name)).map(d => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t.fieldBlock}</label>
                    <input 
                      type="text"
                      className="form-control"
                      value={formData.block}
                      onChange={(e) => handleInputChange('block', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label required">{t.fieldPincode}</label>
                    <input 
                      type="text"
                      maxLength={6}
                      className={`form-control ${errors.pincode ? 'error' : ''}`}
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                    />
                    {errors.pincode && <div className="form-error">{errors.pincode}</div>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Academic Information */}
            {currentStep === 3 && (
              <div className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {t.step3Tab}
                  </h3>
                  
                  {/* Category Filter */}
                  <div style={{ display: 'flex', gap: '0.4rem', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '8px' }}>
                    <button
                      type="button"
                      className={`btn btn-sm ${institutionLevelFilter === 'All' ? 'btn-primary' : 'btn-outline'}`}
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                      onClick={() => setInstitutionLevelFilter('All')}
                    >
                      All Institutions
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${institutionLevelFilter === 'School' ? 'btn-primary' : 'btn-outline'}`}
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                      onClick={() => setInstitutionLevelFilter('School')}
                    >
                      🏫 School (10th/12th)
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${institutionLevelFilter === 'College' ? 'btn-primary' : 'btn-outline'}`}
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                      onClick={() => setInstitutionLevelFilter('College')}
                    >
                      🏛️ College / Degree
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <label className="form-label required" style={{ marginBottom: 0 }}>
                      {lang === 'hi' ? 'मान्यता प्राप्त अध्ययनरत विद्यालय / महाविद्यालय' : 'Enrolled Registered School / College'}
                    </label>
                    <span style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={14} /> {lang === 'hi' ? 'नोडल अधिकारी सत्यापित मार्ग' : 'Direct Nodal Verification Route'}
                    </span>
                  </div>

                  <select 
                    className={`form-control ${errors.institutionName ? 'error' : ''}`}
                    value={isOtherInstitution ? '__OTHER__' : (formData.institutionId || '')}
                    onChange={handleInstitutionSelect}
                  >
                    <option value="">{lang === 'hi' ? '-- मान्यता प्राप्त संस्थान का चयन करें --' : '-- Choose Registered School or College --'}</option>
                    
                    {/* District matched institutions */}
                    <optgroup label={lang === 'hi' ? `📍 आपके जिले (${formData.district || 'MP'}) में मान्यता प्राप्त:` : `📍 In Your District (${formData.district || 'MP'}):`}>
                      {registeredInstitutions
                        .filter(i => (i.districts?.name || '').toLowerCase() === (formData.district || '').toLowerCase())
                        .filter(i => institutionLevelFilter === 'All' || i.category === institutionLevelFilter)
                        .map(inst => (
                          <option key={inst.id} value={inst.id}>
                            {inst.name} ({inst.code}) - {inst.category}
                          </option>
                        ))}
                    </optgroup>

                    {/* Other institutions in state */}
                    <optgroup label={lang === 'hi' ? '🏛️ अन्य मान्यता प्राप्त संस्थान (मध्य प्रदेश):' : '🏛️ Other Registered Institutions in MP:'}>
                      {registeredInstitutions
                        .filter(i => (i.districts?.name || '').toLowerCase() !== (formData.district || '').toLowerCase())
                        .filter(i => institutionLevelFilter === 'All' || i.category === institutionLevelFilter)
                        .map(inst => (
                          <option key={inst.id} value={inst.id}>
                            {inst.name} ({inst.code}) - {inst.category} [{inst.districts?.name || 'MP'}]
                          </option>
                        ))}
                    </optgroup>

                    <optgroup label={lang === 'hi' ? '✏️ अन्य गैर-सूचीबद्ध संस्थान:' : '✏️ Other / Unlisted Institution:'}>
                      <option value="__OTHER__">
                        {lang === 'hi' ? '➕ मेरा संस्थान सूची में नहीं है (अन्य दर्ज करें)' : '➕ My School / College is not listed (Enter manually)'}
                      </option>
                    </optgroup>
                  </select>
                  {errors.institutionName && <div className="form-error">{errors.institutionName}</div>}
                </div>

                {/* Direct Verification Badge when registered institution is selected */}
                {!isOtherInstitution && formData.institutionName && (
                  <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CheckCircle size={20} color="#16A34A" style={{ flexShrink: 0 }} />
                    <div style={{ fontSize: '0.82rem', color: '#166534', lineHeight: 1.4 }}>
                      <strong>{lang === 'hi' ? 'सीधा संस्थागत संवीक्षा मार्ग:' : 'Direct Institutional Route:'}</strong>{' '}
                      {lang === 'hi' 
                        ? `आपका आवेदन सीधे ${formData.institutionName} के नोडल अधिकारी के पोर्टल में संवीक्षा व बोनाफाइड सत्यापन हेतु जाएगा।` 
                        : `Your application will go directly into the institutional verification queue of ${formData.institutionName} for Tier-1 Bonafide Attestation.`}
                    </div>
                  </div>
                )}

                {/* Assigned Governance Cell Hierarchy Strip */}
                <div style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.825rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1E293B' }}>
                    <MapPin size={16} color="#DC2626" />
                    <span><strong>लिंक्ड प्रशासनिक प्रकोष्ठ (Jurisdiction):</strong> {formData.district} जिला प्रकोष्ठ • {formData.block} ब्लॉक प्रकोष्ठ</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#166534', backgroundColor: '#DCFCE7', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 700 }}>
                    ✓ संबंधित जिला समन्वयक द्वारा ही संवीक्षा मान्य
                  </span>
                </div>

                {/* Unlisted Institution Text Box */}
                {isOtherInstitution && (
                  <div className="form-group animate-fade-in" style={{ backgroundColor: '#FFFBEB', padding: '1.1rem', borderRadius: '12px', border: '1px solid #FDE68A', marginBottom: '1.25rem' }}>
                    <label className="form-label required">
                      {lang === 'hi' ? 'विद्यालय / महाविद्यालय का आधिकारिक नाम' : 'Full Official School or College Name'}
                    </label>
                    <input 
                      type="text"
                      className="form-control"
                      placeholder="e.g. Maharani Laxmi Bai Girls Higher Secondary School"
                      value={formData.institutionName}
                      onChange={(e) => handleInputChange('institutionName', e.target.value)}
                    />
                    <div style={{ fontSize: '0.78rem', color: '#92400E', marginTop: '0.4rem', lineHeight: 1.4 }}>
                      {lang === 'hi'
                        ? 'ℹ️ यह संस्थान डेटाबेस में स्वचालित रूप से पंजीकृत होगा और जिला समन्वयक द्वारा संवीक्षा हेतु संस्थागत अधिकारी को आवंटित किया जाएगा।'
                        : 'ℹ️ This institution will be automatically registered in the system and routed to the District Coordinator for scrutiny allocation.'}
                    </div>
                  </div>
                )}

                {/* SCHOLARSHIP YOJNA 2026 - 6 SLABS SELECTION (From Official Poster) */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <label className="form-label required" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span>{lang === 'hi' ? 'छात्रवृत्ति योजना 2026 - कक्षा / पाठ्यक्रम श्रेणी चुनें' : 'Scholarship Yojna 2026 - Select Education Slab'}</span>
                    <span style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 700 }}>
                      {lang === 'hi' ? '📢 2026 का अंतिम राउंड (LAST ROUND)' : '📢 Last Round 2026'}
                    </span>
                  </label>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '0.75rem' }}>
                    {lang === 'hi'
                      ? 'अपनी वर्तमान अध्ययनरत कक्षा का चयन करें। स्वीकृत छात्रवृत्ति राशि एवं आवेदन शुल्क स्वतः निर्धारित होंगे:'
                      : 'Select your enrolled class slab. Entitled grant and processing fee calculate automatically:'}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                    {SCHOLARSHIP_SLABS.map((slab) => {
                      const isSelected = formData.selectedSlab === slab.id;
                      return (
                        <div
                          key={slab.id}
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              selectedSlab: slab.id,
                              scholarshipAmount: slab.amount,
                              classCourse: prev.classCourse && prev.classCourse !== 'Class 12th' ? prev.classCourse : slab.defaultCourse
                            }));
                          }}
                          style={{
                            cursor: 'pointer',
                            border: isSelected ? `2px solid ${slab.color}` : '1px solid #E2E8F0',
                            backgroundColor: isSelected ? slab.bg : '#FFFFFF',
                            borderRadius: '12px',
                            padding: '0.85rem',
                            textAlign: 'center',
                            boxShadow: isSelected ? `0 4px 14px ${slab.color}30` : 'none',
                            transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: isSelected ? slab.color : '#0F172A' }}>
                            {slab.nameHi}
                          </div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: slab.color, margin: '0.2rem 0' }}>
                            {slab.amountDisplay}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>
                            {slab.period}
                          </div>
                          {isSelected && (
                            <div style={{ marginTop: '0.35rem', fontSize: '0.7rem', color: slab.color, fontWeight: 800 }}>
                              ✓ चयनित (Selected)
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Real-time calculated Entitlement & Fee Summary Banner */}
                  <div style={{
                    marginTop: '1rem',
                    backgroundColor: '#F8FAFC',
                    border: '2px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                        स्वीकृत वार्षिक छात्रवृत्ति अनुदान (Entitled Scholarship Grant)
                      </div>
                      <div style={{ fontSize: '1.55rem', fontWeight: 900, color: '#16A34A', marginTop: '2px' }}>
                        ₹ {formData.scholarshipAmount?.toLocaleString('en-IN') || '12,000'}/- वार्षिक
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        सत्यापन उपरांत आधार लिंक्ड बैंक खाते में प्रत्यक्ष लाभ अंतरण (DBT)
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 700, textTransform: 'uppercase' }}>
                        आवेदन प्रक्रिया शुल्क (Registration Fee)
                      </div>
                      <div style={{ fontSize: '1.55rem', fontWeight: 900, color: '#DC2626', marginTop: '2px' }}>
                        ₹ 211.30/-
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#7F1D1D', fontWeight: 600 }}>
                        (केवल आवेदन प्रक्रिया हेतु / Application processing only)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label required">{t.fieldClassCourse}</label>
                    <input 
                      type="text"
                      className={`form-control ${errors.classCourse ? 'error' : ''}`}
                      placeholder="e.g. Class 12th / B.Sc / B.Tech"
                      value={formData.classCourse}
                      onChange={(e) => handleInputChange('classCourse', e.target.value)}
                    />
                    {errors.classCourse && <div className="form-error">{errors.classCourse}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t.fieldAcademicYear}</label>
                    <input 
                      type="text"
                      className="form-control"
                      value={formData.academicYear}
                      onChange={(e) => handleInputChange('academicYear', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">{t.fieldBoardUni}</label>
                    <input 
                      type="text"
                      className="form-control"
                      placeholder="e.g. State Board / CBSE / University"
                      value={formData.boardUni}
                      onChange={(e) => handleInputChange('boardUni', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t.fieldRollNo}</label>
                    <input 
                      type="text"
                      className="form-control"
                      value={formData.rollNo}
                      onChange={(e) => handleInputChange('rollNo', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">{t.fieldPrevExam}</label>
                    <input 
                      type="text"
                      className="form-control"
                      placeholder="e.g. 10th / 11th / 12th"
                      value={formData.prevExam}
                      onChange={(e) => handleInputChange('prevExam', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label required">{t.fieldPercentage}</label>
                    <input 
                      type="number"
                      step="0.01"
                      className={`form-control ${errors.percentage ? 'error' : ''}`}
                      placeholder="e.g. 84.5"
                      value={formData.percentage}
                      onChange={(e) => handleInputChange('percentage', e.target.value)}
                    />
                    {errors.percentage && <div className="form-error">{errors.percentage}</div>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Category Selection */}
            {currentStep === 4 && (
              <div className="animate-fade-in">
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.5rem' }}>
                  {t.step4Tab}
                </h3>

                <div className="form-group">
                  <label className="form-label required">{t.fieldCategory}</label>
                  <select 
                    className="form-control"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    <option value="General">{t.catGen}</option>
                    <option value="SC">{t.catSC}</option>
                    <option value="ST">{t.catST}</option>
                    <option value="OBC">{t.catOBC}</option>
                    <option value="Other">{t.catOther}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{t.fieldAnnualIncome}</label>
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="e.g. 1,20,000"
                    value={formData.annualIncome}
                    onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                  />
                  <div className="form-hint">
                    {lang === 'hi' ? 'आवश्यकता-आधारित छात्रवृत्ति संवीक्षा हेतु' : 'Used for need-based scholarship evaluation'}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Bank Details */}
            {currentStep === 5 && (
              <div className="animate-fade-in">
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                  {t.step5Tab}
                </h3>
                <div style={{ backgroundColor: '#EFF6FF', padding: '0.85rem 1.25rem', borderRadius: '10px', color: '#1E40AF', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  {t.bankNote}
                </div>

                <div className="form-group">
                  <label className="form-label required">{t.fieldAccountHolder}</label>
                  <input 
                    type="text"
                    className={`form-control ${errors.accountHolder ? 'error' : ''}`}
                    placeholder="Student's name as registered in bank"
                    value={formData.accountHolder}
                    onChange={(e) => handleInputChange('accountHolder', e.target.value)}
                  />
                  {errors.accountHolder && <div className="form-error">{errors.accountHolder}</div>}
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label required">{t.fieldBankName}</label>
                    <input 
                      type="text"
                      className="form-control"
                      value={formData.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label required">{t.fieldIfsc}</label>
                    <input 
                      type="text"
                      className={`form-control ${errors.ifsc ? 'error' : ''}`}
                      placeholder="e.g. SBIN0001248"
                      value={formData.ifsc}
                      onChange={(e) => handleInputChange('ifsc', e.target.value.toUpperCase())}
                    />
                    {errors.ifsc && <div className="form-error">{errors.ifsc}</div>}
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label required">{t.fieldAccountNumber}</label>
                    <input 
                      type="password"
                      className={`form-control ${errors.accountNumber ? 'error' : ''}`}
                      placeholder="Account Number"
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                    />
                    {errors.accountNumber && <div className="form-error">{errors.accountNumber}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label required">{t.fieldConfirmAccount}</label>
                    <input 
                      type="text"
                      className={`form-control ${errors.confirmAccount ? 'error' : ''}`}
                      placeholder="Re-enter Account Number"
                      value={formData.confirmAccount}
                      onChange={(e) => handleInputChange('confirmAccount', e.target.value)}
                    />
                    {errors.confirmAccount && <div className="form-error">{errors.confirmAccount}</div>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Aadhaar / Identity Information */}
            {currentStep === 6 && (
              <div className="animate-fade-in">
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                  {t.step6Tab}
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  {t.aadhaarMaskHint}
                </p>

                <div className="form-group">
                  <label className="form-label required">{t.fieldAadhaar}</label>
                  <input 
                    type="text"
                    maxLength={12}
                    className={`form-control ${errors.aadhaar ? 'error' : ''}`}
                    placeholder="12-digit Aadhaar Number (e.g. 548291048291)"
                    value={formData.aadhaar}
                    onChange={(e) => handleInputChange('aadhaar', e.target.value)}
                  />
                  {errors.aadhaar && <div className="form-error">{errors.aadhaar}</div>}
                  {formData.aadhaar && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16A34A', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                      <Lock size={12} />
                      <span>Masked View: XXXX-XXXX-{formData.aadhaar.slice(-4)}</span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">{t.fieldSamagra}</label>
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="Samagra SSSM ID (if applicable)"
                    value={formData.samagraId}
                    onChange={(e) => handleInputChange('samagraId', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 7: Document Upload */}
            {currentStep === 7 && (
              <div className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
                      {t.step7Tab}
                    </h3>
                    <p style={{ color: '#64748B', fontSize: '0.875rem', margin: 0 }}>
                      {t.allowedFilesHint}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ borderColor: '#2563EB', color: '#2563EB', display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#EFF6FF' }}
                    onClick={handleAutoFillDemoDocs}
                  >
                    <Sparkles size={14} />
                    <span>⚡ Auto-Attach Demo Verification Files</span>
                  </button>
                </div>

                <div className="grid-2" style={{ gap: '1.25rem' }}>
                  
                  {/* Photo Upload */}
                  <div className="upload-dropzone" style={{ backgroundColor: formData.photoFileName ? '#F0FDF4' : '#FFFFFF', borderColor: formData.photoFileName ? '#86EFAC' : '#E2E8F0' }}>
                    <input 
                      type="file" 
                      id="upload_photo" 
                      style={{ display: 'none' }} 
                      accept="image/jpeg,image/png"
                      onChange={(e) => handleFileSelect('photo', e)}
                    />
                    <Upload size={24} color={formData.photoFileName ? '#16A34A' : '#1E40AF'} style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.uploadPhotoTitle}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.25rem 0' }}>JPG, PNG under 200KB</div>
                    {formData.photoFileName ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16A34A', fontSize: '0.8rem', fontWeight: 600, marginTop: '0.4rem' }}>
                        <CheckCircle size={14} /> {formData.photoFileName} {formData.photoFileSize ? `(${formData.photoFileSize})` : ''}
                      </div>
                    ) : null}
                    <button 
                      className="btn btn-outline btn-sm" 
                      type="button" 
                      style={{ marginTop: '0.5rem' }}
                      onClick={() => document.getElementById('upload_photo').click()}
                    >
                      {formData.photoFileName ? 'Change Photo' : 'Select File'}
                    </button>
                  </div>

                  {/* Aadhaar Upload */}
                  <div className="upload-dropzone" style={{ backgroundColor: formData.aadhaarFileName ? '#F0FDF4' : '#FFFFFF', borderColor: formData.aadhaarFileName ? '#86EFAC' : '#E2E8F0' }}>
                    <input 
                      type="file" 
                      id="upload_aadhaar" 
                      style={{ display: 'none' }} 
                      accept="application/pdf,image/jpeg,image/png"
                      onChange={(e) => handleFileSelect('aadhaar', e)}
                    />
                    <Upload size={24} color={formData.aadhaarFileName ? '#16A34A' : '#1E40AF'} style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.uploadAadhaarTitle}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.25rem 0' }}>PDF or JPG</div>
                    {formData.aadhaarFileName ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16A34A', fontSize: '0.8rem', fontWeight: 600, marginTop: '0.4rem' }}>
                        <CheckCircle size={14} /> {formData.aadhaarFileName} {formData.aadhaarFileSize ? `(${formData.aadhaarFileSize})` : ''}
                      </div>
                    ) : null}
                    <button 
                      className="btn btn-outline btn-sm" 
                      type="button" 
                      style={{ marginTop: '0.5rem' }}
                      onClick={() => document.getElementById('upload_aadhaar').click()}
                    >
                      {formData.aadhaarFileName ? 'Change File' : 'Select File'}
                    </button>
                  </div>

                  {/* Marksheet Upload */}
                  <div className="upload-dropzone" style={{ backgroundColor: formData.marksheetFileName ? '#F0FDF4' : '#FFFFFF', borderColor: formData.marksheetFileName ? '#86EFAC' : '#E2E8F0' }}>
                    <input 
                      type="file" 
                      id="upload_marksheet" 
                      style={{ display: 'none' }} 
                      accept="application/pdf,image/jpeg,image/png"
                      onChange={(e) => handleFileSelect('marksheet', e)}
                    />
                    <Upload size={24} color={formData.marksheetFileName ? '#16A34A' : '#1E40AF'} style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.uploadMarksheetTitle}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.25rem 0' }}>PDF or JPG</div>
                    {formData.marksheetFileName ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16A34A', fontSize: '0.8rem', fontWeight: 600, marginTop: '0.4rem' }}>
                        <CheckCircle size={14} /> {formData.marksheetFileName} {formData.marksheetFileSize ? `(${formData.marksheetFileSize})` : ''}
                      </div>
                    ) : null}
                    <button 
                      className="btn btn-outline btn-sm" 
                      type="button" 
                      style={{ marginTop: '0.5rem' }}
                      onClick={() => document.getElementById('upload_marksheet').click()}
                    >
                      {formData.marksheetFileName ? 'Change File' : 'Select File'}
                    </button>
                  </div>

                  {/* Bonafide Certificate Upload */}
                  <div className="upload-dropzone" style={{ backgroundColor: formData.bonafideFileName ? '#F0FDF4' : '#FFFFFF', borderColor: formData.bonafideFileName ? '#86EFAC' : '#E2E8F0' }}>
                    <input 
                      type="file" 
                      id="upload_bonafide" 
                      style={{ display: 'none' }} 
                      accept="application/pdf,image/jpeg,image/png"
                      onChange={(e) => handleFileSelect('bonafide', e)}
                    />
                    <Upload size={24} color={formData.bonafideFileName ? '#16A34A' : '#1E40AF'} style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.uploadBonafideTitle}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.25rem 0' }}>PDF or JPG</div>
                    {formData.bonafideFileName ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16A34A', fontSize: '0.8rem', fontWeight: 600, marginTop: '0.4rem' }}>
                        <CheckCircle size={14} /> {formData.bonafideFileName} {formData.bonafideFileSize ? `(${formData.bonafideFileSize})` : ''}
                      </div>
                    ) : null}
                    <button 
                      className="btn btn-outline btn-sm" 
                      type="button" 
                      style={{ marginTop: '0.5rem' }}
                      onClick={() => document.getElementById('upload_bonafide').click()}
                    >
                      {formData.bonafideFileName ? 'Change File' : 'Select File'}
                    </button>
                  </div>

                  {/* Bank Passbook Upload */}
                  <div className="upload-dropzone" style={{ backgroundColor: formData.passbookFileName ? '#F0FDF4' : '#FFFFFF', borderColor: formData.passbookFileName ? '#86EFAC' : '#E2E8F0' }}>
                    <input 
                      type="file" 
                      id="upload_passbook" 
                      style={{ display: 'none' }} 
                      accept="application/pdf,image/jpeg,image/png"
                      onChange={(e) => handleFileSelect('passbook', e)}
                    />
                    <Upload size={24} color={formData.passbookFileName ? '#16A34A' : '#1E40AF'} style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.uploadPassbookTitle}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.25rem 0' }}>PDF or JPG</div>
                    {formData.passbookFileName ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16A34A', fontSize: '0.8rem', fontWeight: 600, marginTop: '0.4rem' }}>
                        <CheckCircle size={14} /> {formData.passbookFileName} {formData.passbookFileSize ? `(${formData.passbookFileSize})` : ''}
                      </div>
                    ) : null}
                    <button 
                      className="btn btn-outline btn-sm" 
                      type="button" 
                      style={{ marginTop: '0.5rem' }}
                      onClick={() => document.getElementById('upload_passbook').click()}
                    >
                      {formData.passbookFileName ? 'Change File' : 'Select File'}
                    </button>
                  </div>

                  {/* Optional Income / Caste Upload */}
                  <div className="upload-dropzone" style={{ borderStyle: 'dashed', borderColor: formData.incomeFileName ? '#86EFAC' : '#CBD5E1', backgroundColor: formData.incomeFileName ? '#F0FDF4' : '#FFFFFF' }}>
                    <input 
                      type="file" 
                      id="upload_income" 
                      style={{ display: 'none' }} 
                      accept="application/pdf,image/jpeg,image/png"
                      onChange={(e) => handleFileSelect('income', e)}
                    />
                    <Upload size={24} color="#D97706" style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Income / Caste (Optional)</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.25rem 0' }}>If applying under reserved quota</div>
                    {formData.incomeFileName ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16A34A', fontSize: '0.8rem', fontWeight: 600, marginTop: '0.4rem' }}>
                        <CheckCircle size={14} /> {formData.incomeFileName}
                      </div>
                    ) : null}
                    <button 
                      className="btn btn-outline btn-sm" 
                      type="button" 
                      style={{ marginTop: '0.5rem' }}
                      onClick={() => document.getElementById('upload_income').click()}
                    >
                      {formData.incomeFileName ? 'Change File' : 'Select File'}
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* Step 8: Declaration & Complete Preview */}
            {currentStep === 8 && (
              <div className="animate-fade-in">
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                  {t.step8Tab}
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                  {lang === 'hi' ? 'कृपया अंतिम रूप से जमा करने से पूर्व अपने आवेदन की समीक्षा करें।' : 'Please review all entered details before final submission.'}
                </p>

                {/* Preview Card */}
                <div style={{ backgroundColor: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  <div className="grid-2" style={{ gap: '0.75rem' }}>
                    <div><strong>Name:</strong> {formData.fullName || '-'}</div>
                    <div><strong>Father:</strong> {formData.fatherName || '-'}</div>
                    <div><strong>Mobile:</strong> {formData.mobile || '-'}</div>
                    <div><strong>DOB:</strong> {formData.dob || '-'}</div>
                    <div><strong>Institution:</strong> {formData.institutionName || '-'}</div>
                    <div><strong>Course / Class:</strong> {formData.classCourse || '-'}</div>
                    <div><strong>Entitled Scholarship:</strong> <span style={{ color: '#16A34A', fontWeight: 800 }}>₹ {formData.scholarshipAmount?.toLocaleString('en-IN') || '12,000'}/- वार्षिक</span></div>
                    <div><strong>Registration Fee:</strong> <span style={{ color: '#DC2626', fontWeight: 800 }}>₹ 211.30/- (केवल आवेदन प्रक्रिया हेतु)</span></div>
                    <div><strong>Category:</strong> {formData.category}</div>
                    <div><strong>Percentage:</strong> {formData.percentage ? `${formData.percentage}%` : '-'}</div>
                    <div><strong>Bank:</strong> {formData.bankName}</div>
                    <div><strong>Assigned Jurisdiction:</strong> {formData.district} District Cell • {formData.block} Block Cell</div>
                  </div>
                </div>

                {/* Declaration Checkbox */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '0.85rem', 
                  padding: '1.25rem', 
                  backgroundColor: '#FFFBEB', 
                  borderRadius: '12px', 
                  border: '1px solid #FCD34D' 
                }}>
                  <input 
                    type="checkbox"
                    id="declarationCheckbox"
                    style={{ marginTop: '4px', width: '18px', height: '18px', cursor: 'pointer' }}
                    checked={formData.declared}
                    onChange={(e) => handleInputChange('declared', e.target.checked)}
                  />
                  <label htmlFor="declarationCheckbox" style={{ fontSize: '0.875rem', color: '#78350F', lineHeight: 1.6, cursor: 'pointer' }}>
                    {t.declarationText}
                  </label>
                </div>
                {errors.declared && <div className="form-error" style={{ marginTop: '0.5rem' }}>{errors.declared}</div>}
              </div>
            )}

            {/* Form Action Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: '1.75rem', marginTop: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {currentStep > 1 && (
                  <button className="btn btn-outline" type="button" onClick={handlePrev}>
                    <ArrowLeft size={16} />
                    <span>{t.btnPrev}</span>
                  </button>
                )}
                
                <button 
                  className="btn btn-outline" 
                  type="button" 
                  onClick={saveDraft}
                  title="Save current progress"
                >
                  <Save size={16} />
                  <span>{draftSavedMsg ? 'Saved! ✓' : t.btnSaveDraft}</span>
                </button>
              </div>

              <div>
                {currentStep < 8 ? (
                  <button className="btn btn-primary" type="button" onClick={handleNext}>
                    <span>{t.btnNext}</span>
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button className="btn btn-primary btn-lg" type="button" onClick={handleFinalSubmit}>
                    <Sparkles size={18} />
                    <span>{t.btnSubmitApplication}</span>
                  </button>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
