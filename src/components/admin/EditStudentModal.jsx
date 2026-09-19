import React, { useState } from 'react';
import { 
  X, 
  User, 
  Building, 
  CreditCard, 
  Save, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getAllStates, getDistrictsByState, getBlocksByDistrict } from '../../data/indiaLocations';

export const EditStudentModal = ({ application, onClose, onSaved }) => {
  const { lang, updateStudentApplication } = useApp();
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'academic' | 'bank'
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Initial Form State populated from Application dossier
  const [formData, setFormData] = useState({
    // Personal Details
    studentName: application?.studentName || '',
    fatherName: application?.fatherName || '',
    motherName: application?.motherName || '',
    mobile: application?.mobile || '',
    email: application?.email || '',
    gender: application?.gender || 'Male',
    dob: application?.dob || '',
    category: application?.category || 'General',
    annualIncome: application?.annualIncome ? String(application.annualIncome).replace(/[^0-9]/g, '') : '100000',
    samagraId: application?.samagraId || '',

    // Academic & Location Details
    course: application?.course || 'Class 12th',
    institution: application?.institution || '',
    institutionId: application?.institutionId || '',
    state: application?.state || 'Madhya Pradesh',
    district: application?.district || 'Jabalpur',
    districtId: application?.districtId || '',
    block: application?.block || 'Patan',
    blockId: application?.blockId || '',
    rollNumber: application?.rollNumber || '',

    // DBT Banking Details
    bankName: application?.bankName || 'State Bank of India',
    accountNumber: application?.accountNumber || '',
    ifsc: application?.ifsc || 'SBIN0001248',
    accountHolderName: application?.accountHolderName || application?.studentName || '',
    branchName: application?.branchName || 'Main Branch',
    isAadhaarSeeded: application?.isAadhaarSeeded ?? true
  });

  // Location helpers
  const allStates = getAllStates();
  const availableDistricts = getDistrictsByState(formData.state);
  const availableBlocks = getBlocksByDistrict(formData.state, formData.district);

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // Cascade state change to districts
      if (field === 'state') {
        const newDists = getDistrictsByState(value);
        updated.district = newDists[0] || '';
        const newBlocks = getBlocksByDistrict(value, updated.district);
        updated.block = newBlocks[0] || '';
      }
      // Cascade district change to blocks
      if (field === 'district') {
        const newBlocks = getBlocksByDistrict(prev.state, value);
        updated.block = newBlocks[0] || '';
      }
      return updated;
    });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Form Validations
    if (!formData.studentName.trim()) {
      setErrorMsg(lang === 'hi' ? 'कृपया छात्र का पूरा नाम दर्ज करें।' : 'Please enter student full name.');
      setActiveTab('personal');
      return;
    }
    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setErrorMsg(lang === 'hi' ? 'कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      setActiveTab('personal');
      return;
    }
    if (formData.accountNumber && formData.accountNumber.replace(/\D/g, '').length < 6) {
      setErrorMsg(lang === 'hi' ? 'कृपया वैध बैंक खाता संख्या दर्ज करें।' : 'Please enter a valid bank account number.');
      setActiveTab('bank');
      return;
    }
    if (formData.ifsc && formData.ifsc.trim().length < 8) {
      setErrorMsg(lang === 'hi' ? 'कृपया वैध IFSC कोड दर्ज करें।' : 'Please enter a valid IFSC code.');
      setActiveTab('bank');
      return;
    }

    setSaving(true);
    try {
      const refreshedApp = await updateStudentApplication(application.id, {
        ...formData,
        mobile: cleanMobile,
        ifsc: formData.ifsc.trim().toUpperCase(),
        accountHolderName: formData.accountHolderName.trim() || formData.studentName.trim()
      });

      setSuccessMsg(
        lang === 'hi'
          ? `आवेदन ${application.id} के विवरण सफलतापूर्वक अद्यतन कर दिए गए हैं!`
          : `Student details for application ${application.id} updated successfully!`
      );

      if (onSaved) {
        onSaved(refreshedApp);
      }

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Error saving student updates:', err);
      setErrorMsg(err.message || (lang === 'hi' ? 'विवरण अद्यतन करने में त्रुटि हुई।' : 'Failed to update student details.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div 
      className="modal-backdrop animate-fade-in" 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div 
        className="modal-card animate-scale-up" 
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '850px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #CBD5E1',
          overflow: 'hidden'
        }}
      >
        
        {/* Modal Header */}
        <div style={{
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '1.25rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '3px solid #2563EB'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <ShieldCheck size={20} color="#60A5FA" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                {lang === 'hi' ? 'छात्र आवेदन विवरण संशोधित करें' : 'Edit Student Application Information'}
              </h3>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '3px' }}>
              Application ID: <strong style={{ color: '#FCD34D', fontFamily: 'monospace' }}>{application?.id}</strong> • Candidate: <strong>{application?.studentName}</strong>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="btn btn-outline btn-sm"
            style={{ color: '#FFFFFF', borderColor: '#475569', backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.35rem 0.5rem' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #E2E8F0',
          backgroundColor: '#F8FAFC',
          padding: '0 1.5rem',
          gap: '0.5rem',
          overflowX: 'auto'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.85rem 1.15rem',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === 'personal' ? '3px solid #2563EB' : '3px solid transparent',
              color: activeTab === 'personal' ? '#1E40AF' : '#64748B',
              fontWeight: activeTab === 'personal' ? 800 : 600,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            <User size={16} />
            <span>{lang === 'hi' ? '1. व्यक्तिगत विवरण (Personal)' : '1. Personal & Contact'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('academic')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.85rem 1.15rem',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === 'academic' ? '3px solid #2563EB' : '3px solid transparent',
              color: activeTab === 'academic' ? '#1E40AF' : '#64748B',
              fontWeight: activeTab === 'academic' ? 800 : 600,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            <Building size={16} />
            <span>{lang === 'hi' ? '2. शैक्षणिक व संस्था (Academic)' : '2. Academic & Location'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bank')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.85rem 1.15rem',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === 'bank' ? '3px solid #2563EB' : '3px solid transparent',
              color: activeTab === 'bank' ? '#1E40AF' : '#64748B',
              fontWeight: activeTab === 'bank' ? 800 : 600,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            <CreditCard size={16} />
            <span>{lang === 'hi' ? '3. बैंक खाता (DBT Banking)' : '3. DBT Bank Account'}</span>
          </button>
        </div>

        {/* Alert Notifications */}
        {errorMsg && (
          <div style={{
            margin: '1rem 1.75rem 0',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            color: '#991B1B',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            margin: '1rem 1.75rem 0',
            backgroundColor: '#F0FDF4',
            border: '1px solid #86EFAC',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            color: '#166534',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1 }}>
            
            {/* TAB 1: Personal Details */}
            {activeTab === 'personal' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748B', backgroundColor: '#EFF6FF', padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
                  {lang === 'hi' 
                    ? 'कृपया छात्र का सही नाम, पिता का नाम, एवं मोबाइल नंबर दर्ज करें। ये विवरण रसीद एवं मेरिट प्रमाण पत्र पर मुद्रित होंगे।'
                    : 'Ensure candidate name, father\'s name, and mobile number match verified government ID proof. These details appear on official receipts and merit certificates.'}
                </div>

                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                      {lang === 'hi' ? 'छात्र का पूरा नाम (Student Name) *' : 'Student Full Name *'}
                    </label>
                    <input 
                      type="text"
                      className="form-control"
                      value={formData.studentName}
                      onChange={(e) => handleInputChange('studentName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                      {lang === 'hi' ? 'पिता / अभिभावक का नाम (Father / Guardian Name)' : 'Father / Guardian Name'}
                    </label>
                    <input 
                      type="text"
                      className="form-control"
                      value={formData.fatherName}
                      onChange={(e) => handleInputChange('fatherName', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                      {lang === 'hi' ? 'माता का नाम (Mother\'s Name)' : 'Mother\'s Name'}
                    </label>
                    <input 
                      type="text"
                      className="form-control"
                      value={formData.motherName}
                      onChange={(e) => handleInputChange('motherName', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                      {lang === 'hi' ? 'पंजीकृत मोबाइल नंबर (Mobile Number) *' : 'Registered Mobile Number *'}
                    </label>
                    <input 
                      type="tel"
                      maxLength={10}
                      className="form-control"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                      {lang === 'hi' ? 'ईमेल पता (Email Address)' : 'Email Address'}
                    </label>
                    <input 
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                      {lang === 'hi' ? 'जन्म तिथि (Date of Birth)' : 'Date of Birth'}
                    </label>
                    <input 
                      type="date"
                      className="form-control"
                      value={formData.dob}
                      onChange={(e) => handleInputChange('dob', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                      {lang === 'hi' ? 'लिंग (Gender)' : 'Gender'}
                    </label>
                    <select 
                      className="form-control"
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                    >
                      <option value="Male">Male / पुरुष</option>
                      <option value="Female">Female / महिला</option>
                      <option value="Other">Other / अन्य</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                      {lang === 'hi' ? 'सामाजिक श्रेणी (Social Category)' : 'Social Category'}
                    </label>
                    <select 
                      className="form-control"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                    >
                      <option value="General">General / सामान्य</option>
                      <option value="OBC">OBC / अन्य पिछड़ा वर्ग</option>
                      <option value="SC">SC / अनुसूचित जाति</option>
                      <option value="ST">ST / अनुसूचित जनजाति</option>
                      <option value="EWS">EWS / आर्थिक रूप से कमजोर वर्ग</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                      {lang === 'hi' ? 'वार्षिक पारिवारिक आय (Annual Income in ₹)' : 'Annual Family Income (in ₹)'}
                    </label>
                    <input 
                      type="number"
                      className="form-control"
                      value={formData.annualIncome}
                      onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                      {lang === 'hi' ? 'समग्र आईडी (Samagra ID)' : 'Samagra ID'}
                    </label>
                    <input 
                      type="text"
                      className="form-control"
                      value={formData.samagraId}
                      onChange={(e) => handleInputChange('samagraId', e.target.value)}
                      placeholder="उदा. 123456789"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Academic & Institutional Details */}
            {activeTab === 'academic' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748B', backgroundColor: '#F8FAFC', padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  {lang === 'hi'
                    ? 'संस्थान एवं पाठ्यक्रम का चयन करें ताकि छात्रवृत्ति पात्रता एवं प्रमाण पत्र सटीक रूप से तैयार हो सकें।'
                    : 'Select accurate academic course and institution to verify scholarship eligibility criteria.'}
                </div>

                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                      {lang === 'hi' ? 'संस्थान का नाम (Institution Name)' : 'Institution Name'}
                    </label>
                    <input 
                      type="text"
                      className="form-control"
                      value={formData.institution}
                      onChange={(e) => handleInputChange('institution', e.target.value)}
                      placeholder="उदा. Govt. Model Higher Secondary School"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                      {lang === 'hi' ? 'कक्षा / पाठ्यक्रम (Class / Course)' : 'Class / Course'}
                    </label>
                    <input 
                      type="text"
                      className="form-control"
                      value={formData.course}
                      onChange={(e) => handleInputChange('course', e.target.value)}
                      placeholder="उदा. Class 12th / B.Sc / Pharmacy"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                      {lang === 'hi' ? 'अनुक्रमांक / रोल नंबर (Roll / Enrollment Number)' : 'Roll / Enrollment Number'}
                    </label>
                    <input 
                      type="text"
                      className="form-control"
                      value={formData.rollNumber}
                      onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                      placeholder="उदा. 0232PY211058"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                      {lang === 'hi' ? 'राज्य (State)' : 'State'}
                    </label>
                    <select 
                      className="form-control"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                    >
                      {allStates.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                      {lang === 'hi' ? 'जिला (District)' : 'District'}
                    </label>
                    <select 
                      className="form-control"
                      value={formData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                    >
                      {availableDistricts.map(dst => (
                        <option key={dst} value={dst}>{dst}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                      {lang === 'hi' ? 'विकासखंड / तहसील (Block / Tehsil)' : 'Block / Tehsil'}
                    </label>
                    <select 
                      className="form-control"
                      value={formData.block}
                      onChange={(e) => handleInputChange('block', e.target.value)}
                    >
                      {availableBlocks.map(blk => (
                        <option key={blk} value={blk}>{blk}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: DBT Banking Details */}
            {activeTab === 'bank' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#166534', backgroundColor: '#F0FDF4', padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
                  {lang === 'hi'
                    ? 'अत्यंत महत्वपूर्ण: छात्रवृत्ति अनुदान DBT के माध्यम से सीधे इस बैंक खाते में प्रेषित किया जाएगा। कृपया खाता संख्या एवं IFSC कोड की दोहरी जांच करें।'
                    : 'Critical DBT Information: Scholarship grants and installments are disbursed via NEFT/DBT directly to this bank account. Double check account number and IFSC.'}
                </div>

                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                      {lang === 'hi' ? 'बैंक का नाम (Bank Name)' : 'Bank Name'}
                    </label>
                    <input 
                      type="text"
                      className="form-control"
                      value={formData.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                      placeholder="उदा. State Bank of India / Union Bank"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                      {lang === 'hi' ? 'खाता धारक का नाम (Account Holder Name)' : 'Account Holder Name'}
                    </label>
                    <input 
                      type="text"
                      className="form-control"
                      value={formData.accountHolderName}
                      onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                      placeholder="उदा. KRISHN KUMAR SEN"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                      {lang === 'hi' ? 'बैंक खाता संख्या (Account Number)' : 'Account Number'}
                    </label>
                    <input 
                      type="text"
                      className="form-control"
                      style={{ fontFamily: 'monospace', fontWeight: 700 }}
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                      placeholder="उदा. 38291049281"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                      {lang === 'hi' ? 'IFSC कोड (IFSC Code)' : 'IFSC Code'}
                    </label>
                    <input 
                      type="text"
                      className="form-control"
                      style={{ fontFamily: 'monospace', fontWeight: 700, textTransform: 'uppercase' }}
                      value={formData.ifsc}
                      onChange={(e) => handleInputChange('ifsc', e.target.value.toUpperCase())}
                      placeholder="उदा. SBIN0001248"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                      {lang === 'hi' ? 'शाखा का नाम (Branch Name)' : 'Branch Name'}
                    </label>
                    <input 
                      type="text"
                      className="form-control"
                      value={formData.branchName}
                      onChange={(e) => handleInputChange('branchName', e.target.value)}
                      placeholder="उदा. Main Branch Patan"
                    />
                  </div>

                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <input 
                      type="checkbox"
                      id="isAadhaarSeeded"
                      checked={formData.isAadhaarSeeded}
                      onChange={(e) => handleInputChange('isAadhaarSeeded', e.target.checked)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label htmlFor="isAadhaarSeeded" style={{ fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', margin: 0, color: '#0F172A' }}>
                      {lang === 'hi' ? 'खाता आधार कार्ड से लिंक है (Aadhaar Seeded for DBT)' : 'Account is Aadhaar Seeded for DBT Transfer'}
                    </label>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Modal Footer */}
          <div style={{
            backgroundColor: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            padding: '1rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
              {lang === 'hi' ? 'संशोधन सुरक्षित ऑडिट लॉग में दर्ज होगा।' : 'Modifications are tracked in administrative audit history.'}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button 
                type="button" 
                className="btn btn-outline"
                onClick={onClose}
                disabled={saving}
              >
                {lang === 'hi' ? 'रद्द करें (Cancel)' : 'Cancel'}
              </button>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={saving}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, backgroundColor: '#1E40AF', borderColor: '#1E40AF' }}
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>{lang === 'hi' ? 'सहेजा जा रहा है...' : 'Saving Changes...'}</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>{lang === 'hi' ? 'परिवर्तन सहेजें (Save Changes)' : 'Save Changes'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
