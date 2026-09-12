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

export const Apply = () => {
  const { lang, t, navigate, submitNewApplication, cms } = useApp();

  // Wizard Step (1 to 8, or 9 for Final Submission Confirmation)
  const [currentStep, setCurrentStep] = useState(1);

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
      block: 'Patan',
      villageCity: '',
      pincode: '',

      // Step 3: Academic
      institutionName: '',
      classCourse: '',
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
      aadhaarFile: null,
      marksheetFile: null,
      bonafideFile: null,
      passbookFile: null,
      incomeFile: null,
      casteFile: null,

      // Step 8: Declaration
      declared: false
    };
  });

  const [errors, setErrors] = useState({});
  const [draftSavedMsg, setDraftSavedMsg] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState(null);

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

  // OTP Simulation
  const handleSendOtp = () => {
    if (!formData.mobile || formData.mobile.length < 10) {
      setErrors(prev => ({ ...prev, mobile: lang === 'hi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें' : 'Please enter valid 10-digit mobile' }));
      return;
    }
    setFormData(prev => ({ ...prev, otpSent: true }));
  };

  const handleVerifyOtp = () => {
    if (formData.otp === '123456' || formData.otp.length === 6) {
      setFormData(prev => ({ ...prev, otpVerified: true }));
      setErrors(prev => ({ ...prev, otp: null }));
    } else {
      setErrors(prev => ({ ...prev, otp: lang === 'hi' ? 'अमान्य ओटीपी (परीक्षण हेतु 123456 दर्ज करें)' : 'Invalid OTP (use 123456 for demo)' }));
    }
  };

  // Step Validation
  const validateCurrentStep = () => {
    const errs = {};

    if (currentStep === 1) {
      if (!formData.mobile || formData.mobile.length < 10) {
        errs.mobile = lang === 'hi' ? 'मोबाइल नंबर आवश्यक है' : 'Mobile number required';
      }
      if (!formData.otpVerified) {
        errs.otp = lang === 'hi' ? 'कृपया पहले ओटीपी सत्यापित करें' : 'Please verify OTP first';
      }
      if (!formData.password) {
        errs.password = lang === 'hi' ? 'पासवर्ड बनाएं' : 'Password required';
      }
      if (formData.password && formData.password !== formData.confirmPassword) {
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

  const handleFinalSubmit = () => {
    if (!formData.declared) {
      setErrors({ declared: lang === 'hi' ? 'कृपया घोषणा स्वीकार करें' : 'Please accept declaration' });
      return;
    }

    const record = submitNewApplication(formData);
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

            {/* Applicant Summary Table */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.4rem' }}>
                Applicant Summary
              </h4>
              <div className="grid-2" style={{ gap: '0.85rem', fontSize: '0.9rem' }}>
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
                    <input 
                      type="text"
                      className="form-control"
                      value={formData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                    />
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
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.5rem' }}>
                  {t.step3Tab}
                </h3>

                <div className="form-group">
                  <label className="form-label required">{t.fieldInstitutionName}</label>
                  <input 
                    type="text"
                    className={`form-control ${errors.institutionName ? 'error' : ''}`}
                    placeholder="e.g. Govt. Model Higher Secondary School / College"
                    value={formData.institutionName}
                    onChange={(e) => handleInputChange('institutionName', e.target.value)}
                  />
                  {errors.institutionName && <div className="form-error">{errors.institutionName}</div>}
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
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                  {t.step7Tab}
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
                  {t.allowedFilesHint}
                </p>

                <div className="grid-2" style={{ gap: '1.25rem' }}>
                  
                  <div className="upload-dropzone">
                    <Upload size={24} color="#1E40AF" style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.uploadPhotoTitle}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.25rem 0' }}>JPG, PNG under 200KB</div>
                    <button className="btn btn-outline btn-sm" type="button">Select File</button>
                  </div>

                  <div className="upload-dropzone">
                    <Upload size={24} color="#1E40AF" style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.uploadAadhaarTitle}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.25rem 0' }}>PDF or JPG</div>
                    <button className="btn btn-outline btn-sm" type="button">Select File</button>
                  </div>

                  <div className="upload-dropzone">
                    <Upload size={24} color="#1E40AF" style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.uploadMarksheetTitle}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.25rem 0' }}>PDF or JPG</div>
                    <button className="btn btn-outline btn-sm" type="button">Select File</button>
                  </div>

                  <div className="upload-dropzone">
                    <Upload size={24} color="#1E40AF" style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.uploadBonafideTitle}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.25rem 0' }}>PDF or JPG</div>
                    <button className="btn btn-outline btn-sm" type="button">Select File</button>
                  </div>

                  <div className="upload-dropzone">
                    <Upload size={24} color="#1E40AF" style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.uploadPassbookTitle}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.25rem 0' }}>PDF or JPG</div>
                    <button className="btn btn-outline btn-sm" type="button">Select File</button>
                  </div>

                  <div className="upload-dropzone" style={{ borderStyle: 'dashed', borderColor: '#CBD5E1' }}>
                    <Upload size={24} color="#D97706" style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Income / Caste (Optional)</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.25rem 0' }}>If applying in category</div>
                    <button className="btn btn-outline btn-sm" type="button">Select File</button>
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
                    <div><strong>Course:</strong> {formData.classCourse || '-'}</div>
                    <div><strong>Category:</strong> {formData.category}</div>
                    <div><strong>Percentage:</strong> {formData.percentage ? `${formData.percentage}%` : '-'}</div>
                    <div><strong>Bank:</strong> {formData.bankName}</div>
                    <div><strong>IFSC:</strong> {formData.ifsc}</div>
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
