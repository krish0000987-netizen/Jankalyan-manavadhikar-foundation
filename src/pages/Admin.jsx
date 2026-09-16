import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminTopNav } from '../components/admin/AdminTopNav';
import { ApplicationScrutinyModal } from '../components/admin/ApplicationScrutinyModal';
import { QrCodeDisplay } from '../components/common/QrCodeDisplay';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  CreditCard, 
  FileText, 
  Settings, 
  Sliders, 
  Search, 
  Filter, 
  Eye, 
  Check, 
  Copy,
  X, 
  AlertTriangle, 
  Download, 
  Edit3, 
  Save, 
  RefreshCw,
  Building,
  BarChart3,
  PieChart,
  Plus,
  Trash2,
  ExternalLink,
  Shield,
  HeartHandshake,
  Award,
  Bell,
  HelpCircle,
  ShieldAlert,
  Printer
} from 'lucide-react';
import { paymentService } from '../services/paymentService';
import { scrutinyService } from '../services/scrutinyService';
import { reportService } from '../services/reportService';
import { commissionService } from '../services/commissionService';
import { grievanceService } from '../services/grievanceService';
import { meritService } from '../services/meritService';
import { donorService } from '../services/donorService';
import { certificateService } from '../services/certificateService';
import { auditService } from '../services/auditService';
import { cmsService } from '../services/cmsService';
import { uploadFile } from '../api/storage';
import { DistrictsManager } from '../components/admin/DistrictsManager';
import { InstitutionsManager } from '../components/admin/InstitutionsManager';
import { SchemesManager } from '../components/admin/SchemesManager';
import { MeritManager } from '../components/admin/MeritManager';
import { DonorsManager } from '../components/admin/DonorsManager';
import { NotificationsManager } from '../components/admin/NotificationsManager';
import { MediaManager } from '../components/admin/MediaManager';
import { DownloadsManager } from '../components/admin/DownloadsManager';
import { QrVerifyManager } from '../components/admin/QrVerifyManager';
import { UsersManager } from '../components/admin/UsersManager';
import { SettingsManager } from '../components/admin/SettingsManager';
import { GrievanceManager } from '../components/admin/GrievanceManager';

export const Admin = () => {
  const { 
    lang, 
    t, 
    navigate, 
    applications, 
    loadApplications, 
    updateApplicationStatus, 
    cms, 
    updateCMS, 
    authUser, 
    authRole, 
    setAuthRole,
    switchRole,
    jurisdiction,
    logout,
    grievances 
  } = useApp();

  // Active module tab
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Application Filters
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [tableSearch, setTableSearch] = useState('');

  // Verification Queue State
  const [verificationFilter, setVerificationFilter] = useState('all'); // 'all' | 'pending' | 'correction' | 'approved' | 'rejected'
  const [verificationSearch, setVerificationSearch] = useState('');
  const [verificationDistrict, setVerificationDistrict] = useState('All');

  // Scrutiny & View Modals
  const [activeModalApp, setActiveModalApp] = useState(null);
  const [activeViewApp, setActiveViewApp] = useState(null);

  // Live MIS Summary
  const [misSummary, setMisSummary] = useState(null);

  // Beneficiary Bank Records & Manual Transfer state
  const [beneficiarySearch, setBeneficiarySearch] = useState('');
  const [beneficiaryDistrict, setBeneficiaryDistrict] = useState('All');
  const [beneficiaryFilterStatus, setBeneficiaryFilterStatus] = useState('all');
  const [copyFeedback, setCopyFeedback] = useState({});
  const [markingTransferredApp, setMarkingTransferredApp] = useState(null);
  const [transferModalForm, setTransferModalForm] = useState({
    paymentDate: new Date().toISOString().split('T')[0],
    utrNumber: '',
    disbursingBank: 'State Bank of India',
    remarks: 'Manually transferred via Net Banking'
  });

  // Commissions state
  const [commissionRates, setCommissionRates] = useState([]);
  const [commissionsList, setCommissionsList] = useState([]);

  // CMS Form State
  const [cmsForm, setCmsForm] = useState({ ...cms });
  const [cmsSaveAlert, setCmsSaveAlert] = useState(false);
  const [heroSlides, setHeroSlides] = useState(cms.heroSlides || []);
  const [noticesList, setNoticesList] = useState(cms.notices || []);
  const [faqsList, setFaqsList] = useState(cms.faqs || []);
  const [teamList, setTeamList] = useState(cms.teamMembers || []);
  const [downloadsList, setDownloadsList] = useState(cms.downloads || []);

  // Grievance / Audit / Certificates / Merit state
  const [auditLogs, setAuditLogs] = useState([]);
  const [issuedCertificates, setIssuedCertificates] = useState([]);
  const [meritLists, setMeritLists] = useState([]);
  const [donorsList, setDonorsList] = useState([]);

  // Load backend data on tab change
  useEffect(() => {
    loadApplications(authRole, jurisdiction);
    reportService.getDashboardSummary().then(setMisSummary);
    commissionService.getCommissionRates().then(setCommissionRates);
    commissionService.getCommissions().then(setCommissionsList);
    auditService.getAuditLogs().then(setAuditLogs);
    certificateService.getCertificates().then(setIssuedCertificates);
    meritService.getMeritLists().then(setMeritLists);
    donorService.getDonors().then(setDonorsList);
    cmsService.getHeroSlides().then(setHeroSlides);
    cmsService.getNotices().then(setNoticesList);
    cmsService.getFaqs().then(setFaqsList);
    cmsService.getTeamMembers().then(setTeamList);
    cmsService.getDownloads().then(setDownloadsList);
  }, [activeTab, authRole, jurisdiction]);

  // Keep cmsForm synced with cms context
  useEffect(() => {
    setCmsForm(prev => ({ ...prev, ...cms }));
  }, [cms]);

  // Base role-scoped applications
  const roleScopedApplications = applications.filter(app => {
    if (authRole === 'INSTITUTION' && jurisdiction?.institution) {
      const instName = (jurisdiction.institution.name || '').toLowerCase();
      const instId = jurisdiction.institution.id;
      return (instId && app.institutionId === instId) || 
             (instName && app.institution?.toLowerCase().includes(instName)) ||
             (instName && instName.includes(app.institution?.toLowerCase()));
    }
    if (authRole === 'DISTRICT_COORDINATOR' && jurisdiction?.district) {
      const distName = (jurisdiction.district.name || '').toLowerCase();
      const distId = jurisdiction.district.id;
      return (distId && app.districtId === distId) || 
             (distName && app.district?.toLowerCase() === distName);
    }
    if (authRole === 'BLOCK_COORDINATOR' && jurisdiction?.block) {
      const blkName = (jurisdiction.block.name || '').toLowerCase();
      const blkId = jurisdiction.block.id;
      return (blkId && app.blockId === blkId) || 
             (blkName && app.block?.toLowerCase() === blkName);
    }
    return true; // Super Admin sees all
  });

  // Filtered Applications (Search + Status + Category on top of scoped applications)
  const filteredApplications = roleScopedApplications.filter(app => {
    const matchesDistrict = selectedDistrict === 'All' || app.district === selectedDistrict;
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || app.status === selectedStatus;
    const searchTarget = (tableSearch || globalSearch).toLowerCase();
    const matchesSearch = !searchTarget || 
      app.id.toLowerCase().includes(searchTarget) || 
      app.studentName.toLowerCase().includes(searchTarget) ||
      app.institution.toLowerCase().includes(searchTarget) ||
      app.mobile.includes(searchTarget);
    return matchesDistrict && matchesCategory && matchesStatus && matchesSearch;
  });

  // KPI Calculations strictly based on roleScopedApplications
  const totalCount = roleScopedApplications.length;
  const approvedCount = roleScopedApplications.filter(a => a.status === 'Approved' || a.rawStatus === 'APPROVED').length;
  const releasedCount = roleScopedApplications.filter(a => a.status === 'Scholarship Released' || a.rawStatus === 'SCHOLARSHIP_RELEASED').length;
  const underVerificationCount = roleScopedApplications.filter(a => a.status === 'Under Verification' || a.rawStatus === 'UNDER_VERIFICATION' || a.status === 'Re-Submitted').length;
  const rejectedCount = roleScopedApplications.filter(a => a.status === 'Rejected' || a.rawStatus === 'REJECTED').length;
  const correctionCount = roleScopedApplications.filter(a => a.status === 'Correction Requested' || a.rawStatus === 'CORRECTION_REQUESTED').length;

  // Verification Queue Calculations & Scoped Dataset
  const queueTotalCount = roleScopedApplications.length;
  const queuePendingCount = roleScopedApplications.filter(a => 
    a.status === 'Under Verification' || a.status === 'Under Scrutiny' || a.status === 'Submitted' || a.status === 'Re-Submitted' || a.status === 'Bonafide Attested' || a.rawStatus === 'UNDER_VERIFICATION' || a.rawStatus === 'SUBMITTED' || a.rawStatus === 'RE_SUBMITTED' || a.rawStatus === 'INSTITUTION_RECOMMENDED'
  ).length;
  const queueCorrectionCount = roleScopedApplications.filter(a => 
    a.status === 'Correction Requested' || a.rawStatus === 'CORRECTION_REQUESTED'
  ).length;
  const queueApprovedCount = roleScopedApplications.filter(a => 
    a.status === 'Approved' || a.status === 'Scholarship Released' || a.rawStatus === 'APPROVED' || a.rawStatus === 'SCHOLARSHIP_RELEASED' || a.stage === 5
  ).length;
  const queueRejectedCount = roleScopedApplications.filter(a => 
    a.status === 'Rejected' || a.rawStatus === 'REJECTED'
  ).length;

  const verificationQueueApplications = roleScopedApplications.filter(app => {
    // 1. District filter
    if (verificationDistrict !== 'All' && app.district !== verificationDistrict) {
      return false;
    }

    // 2. Search filter
    if (verificationSearch.trim()) {
      const q = verificationSearch.toLowerCase();
      const matchId = (app.id || '').toLowerCase().includes(q);
      const matchName = (app.studentName || '').toLowerCase().includes(q);
      const matchMobile = (app.mobile || '').includes(q);
      const matchInst = (app.institution || '').toLowerCase().includes(q);
      const matchCourse = (app.course || '').toLowerCase().includes(q);
      if (!matchId && !matchName && !matchMobile && !matchInst && !matchCourse) {
        return false;
      }
    }

    // 3. Status filter tab
    const status = app.status;
    const raw = app.rawStatus || '';
    if (verificationFilter === 'pending') {
      return (
        status === 'Under Verification' ||
        status === 'Under Scrutiny' ||
        status === 'Submitted' ||
        status === 'Re-Submitted' ||
        status === 'Bonafide Attested' ||
        raw === 'UNDER_VERIFICATION' ||
        raw === 'SUBMITTED' ||
        raw === 'RE_SUBMITTED' ||
        raw === 'INSTITUTION_RECOMMENDED'
      );
    }
    if (verificationFilter === 'correction') {
      return status === 'Correction Requested' || raw === 'CORRECTION_REQUESTED';
    }
    if (verificationFilter === 'approved') {
      return (
        status === 'Approved' ||
        status === 'Scholarship Released' ||
        raw === 'APPROVED' ||
        raw === 'SCHOLARSHIP_RELEASED' ||
        app.stage === 5
      );
    }
    if (verificationFilter === 'rejected') {
      return status === 'Rejected' || raw === 'REJECTED';
    }

    return true; // 'all' displays every student!
  });

  // Handle CMS Save
  const handleSaveCMS = async (e) => {
    e?.preventDefault();
    await updateCMS(cmsForm);
    setCmsSaveAlert(true);
    setTimeout(() => setCmsSaveAlert(false), 3500);
  };

  // Export Applications to CSV
  const handleExportApplications = () => {
    const rows = filteredApplications.map(app => ({
      'Application ID': app.id,
      'Student Name': app.studentName,
      'Father Name': app.fatherName,
      'Mobile': app.mobile,
      'District': app.district,
      'Block': app.block,
      'Institution': app.institution,
      'Course': app.course,
      'Category': app.category,
      'Status': app.status,
      'Submission Date': app.submissionDate,
      'Approval Date': app.approvalDate,
      'Payment Date': app.paymentDate,
      'UTR Number': app.utrNumber
    }));
    reportService.exportToCsv(`JMF_Applications_${new Date().toISOString().slice(0,10)}.csv`, rows);
    auditService.log({
      actorId: authUser?.id,
      actorRole: authRole,
      action: 'EXPORT_DATA',
      entityType: 'application',
      newData: { recordsExported: rows.length }
    });
  };

  // Copy to clipboard helper for account / IFSC
  const handleCopyText = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopyFeedback(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopyFeedback(prev => ({ ...prev, [key]: false }));
    }, 1500);
  };

  // Approved beneficiaries ready for scholarship
  const approvedBeneficiaries = roleScopedApplications.filter(a => 
    a.status === 'Approved' || 
    a.rawStatus === 'APPROVED' || 
    a.status === 'Scholarship Released' || 
    a.rawStatus === 'SCHOLARSHIP_RELEASED' ||
    a.stage === 5
  );

  const readyBeneficiariesCount = approvedBeneficiaries.filter(a => 
    a.status !== 'Scholarship Released' && a.rawStatus !== 'SCHOLARSHIP_RELEASED'
  ).length;

  const transferredBeneficiariesCount = approvedBeneficiaries.filter(a => 
    a.status === 'Scholarship Released' || a.rawStatus === 'SCHOLARSHIP_RELEASED'
  ).length;

  const filteredBeneficiaries = approvedBeneficiaries.filter(a => {
    if (beneficiaryDistrict !== 'All' && a.district !== beneficiaryDistrict) {
      return false;
    }
    if (beneficiaryFilterStatus === 'ready') {
      if (a.status === 'Scholarship Released' || a.rawStatus === 'SCHOLARSHIP_RELEASED') return false;
    } else if (beneficiaryFilterStatus === 'transferred') {
      if (a.status !== 'Scholarship Released' && a.rawStatus !== 'SCHOLARSHIP_RELEASED') return false;
    }
    if (beneficiarySearch.trim()) {
      const q = beneficiarySearch.toLowerCase();
      const matchId = (a.id || '').toLowerCase().includes(q);
      const matchName = (a.studentName || '').toLowerCase().includes(q);
      const matchMobile = (a.mobile || '').includes(q);
      const matchBank = (a.bankName || '').toLowerCase().includes(q);
      const matchAcc = (a.accountNumber || '').includes(q);
      const matchIfsc = (a.ifsc || '').toLowerCase().includes(q);
      if (!matchId && !matchName && !matchMobile && !matchBank && !matchAcc && !matchIfsc) return false;
    }
    return true;
  });

  // Export Approved Beneficiaries Bank Transfer Sheet (CSV)
  const handleExportBeneficiaries = () => {
    if (!filteredBeneficiaries.length) {
      alert('No beneficiary records found matching current search or filters.');
      return;
    }
    const rows = filteredBeneficiaries.map((b, idx) => ({
      'Sr No': idx + 1,
      'Application ID': b.id,
      'Beneficiary Name': b.accountHolderName || b.studentName,
      'Father Name': b.fatherName || '-',
      'Mobile Number': b.mobile || '-',
      'Email': b.email || '-',
      'Bank Name': b.bankName || 'State Bank of India',
      'Branch Name': b.branchName || 'Main Branch',
      'Account Number': b.accountNumber,
      'IFSC Code': b.ifsc,
      'Aadhaar Seeded Status': b.isAadhaarSeeded ? 'YES' : 'PENDING',
      'Sanctioned Amount (INR)': 12000,
      'Institution': b.institution || '-',
      'District': b.district || '-',
      'Block': b.block || '-',
      'Course': b.course || '-',
      'Approval Date': b.approvalDate || '-',
      'Transfer Status': (b.status === 'Scholarship Released' || b.rawStatus === 'SCHOLARSHIP_RELEASED') ? 'TRANSFERRED_OFFLINE' : 'READY_FOR_BANK_TRANSFER',
      'Bank UTR Reference': b.utrNumber || '-',
      'Transfer Date': b.paymentDate || '-'
    }));

    reportService.exportToCsv(`Jankalyan_Beneficiary_Bank_Transfer_Sheet_${new Date().toISOString().split('T')[0]}.csv`, rows);
  };

  // Print Beneficiary Sanction Ledger Order
  const handlePrintSanctionLedger = () => {
    window.print();
  };

  // Open modal to mark a student's manual transfer as done
  const handleOpenMarkTransferred = (app) => {
    setMarkingTransferredApp(app);
    setTransferModalForm({
      paymentDate: new Date().toISOString().split('T')[0],
      utrNumber: '',
      disbursingBank: 'State Bank of India',
      remarks: 'Manually transferred via Net Banking'
    });
  };

  // Save manual offline transfer record
  const handleConfirmManualTransfer = async () => {
    if (!markingTransferredApp) return;
    try {
      const utr = transferModalForm.utrNumber.trim();
      const remarks = `${transferModalForm.remarks} (Bank: ${transferModalForm.disbursingBank})`;
      await scrutinyService.updateApplicationStatus(
        markingTransferredApp.id,
        'Scholarship Released',
        remarks,
        utr,
        { ...authUser, role: authRole }
      );

      try {
        await certificateService.issueCertificate({
          applicationId: markingTransferredApp.id,
          studentName: markingTransferredApp.studentName,
          schemeName: 'Jankalyan Manavadhikar Foundation Scholarship Scheme 2026-27',
          grantAmount: 12000
        });
      } catch (cErr) {}

      alert(`Manual bank transfer recorded for ${markingTransferredApp.studentName}! Application marked as Scholarship Released.`);
      setMarkingTransferredApp(null);
      await loadApplications();
    } catch (err) {
      alert('Failed to update record: ' + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      
      {/* Left Sidebar */}
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        role={authRole} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        readyCount={readyBeneficiariesCount}
        onLogout={logout}
      />

      {/* Main Admin Content Canvas */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Top Navigation */}
        <AdminTopNav 
          user={authUser}
          role={authRole}
          setRole={(newRole) => switchRole(newRole)}
          jurisdiction={jurisdiction}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onExitPublic={() => navigate('/')}
          onSearchChange={setGlobalSearch}
          searchValue={globalSearch}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          readyCount={readyBeneficiariesCount}
        />

        {/* Content Body */}
        <main style={{ flex: 1, padding: '2rem' }}>
          
          {/* ====================================================================
              MODULE 1: DASHBOARD
              ==================================================================== */}
          {activeTab === 'dashboard' && (
            <div className="animate-fade-in">
              
              {/* Top Banner */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <Shield size={18} color={authRole === 'INSTITUTION' ? '#0D9488' : '#1E40AF'} />
                    <span className={`badge ${authRole === 'INSTITUTION' ? 'badge-green' : 'badge-blue'}`}>
                      {authRole === 'INSTITUTION' ? 'SCHOOL & COLLEGE NODAL PORTAL' : 
                       authRole === 'DISTRICT_COORDINATOR' ? 'DISTRICT GOVERNANCE CELL' : 
                       authRole === 'BLOCK_COORDINATOR' ? 'BLOCK COORDINATION DESK' : 
                       authRole === 'ONLINE_CENTER' ? 'CSC FACILITATION DESK' : 'STATEWIDE GOVERNANCE DASHBOARD'}
                    </span>
                  </div>
                  <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A' }}>
                    {authRole === 'INSTITUTION'
                      ? (jurisdiction?.institution?.name || 'Institution Nodal Center')
                      : authRole === 'DISTRICT_COORDINATOR'
                      ? `${jurisdiction?.district?.name || 'District'} Administration Hub`
                      : authRole === 'BLOCK_COORDINATOR'
                      ? `${jurisdiction?.block?.name || 'Block'} Coordination Cell`
                      : 'Overview & Scrutiny Command Center'}
                  </h1>
                  <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                    {authRole === 'INSTITUTION'
                      ? `Enrolled students bonafide verification, marksheet attestation & institutional records (Code: ${jurisdiction?.institution?.code || 'INST-01'})`
                      : authRole === 'DISTRICT_COORDINATOR'
                      ? `District-level scrutiny, school oversight, and regional verification tracking for ${jurisdiction?.district?.name || 'District'}`
                      : 'Multi-tier scrutiny, direct benefit transfer reconciliation, and real-time CMS governance'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('applications')}>
                    <Users size={15} />
                    <span>View Applications ({totalCount})</span>
                  </button>

                  <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('verification')}>
                    <CheckCircle2 size={15} />
                    <span>Verification Queue ({underVerificationCount})</span>
                  </button>

                  <button 
                    className="btn btn-gold btn-sm" 
                    onClick={() => setActiveTab('payments')}
                    style={{ fontWeight: 800, backgroundColor: '#D97706', color: '#FFFFFF', borderColor: '#D97706' }}
                    title="View verified students ready for manual scholarship bank transfer"
                  >
                    <CreditCard size={15} />
                    <span>Beneficiary Bank Records ({approvedBeneficiaries.length} Ready)</span>
                  </button>

                  <button className="btn btn-outline btn-sm" onClick={handleExportApplications}>
                    <Download size={15} />
                    <span>Export MIS CSV</span>
                  </button>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid-5" style={{ marginBottom: '2rem' }}>
                <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #1E40AF', cursor: 'pointer' }} onClick={() => setActiveTab('applications')}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>TOTAL APPLICATIONS</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0F172A', margin: '0.2rem 0' }}>{totalCount}</div>
                  <div style={{ fontSize: '0.7rem', color: '#1E40AF' }}>All Registered Applicants</div>
                </div>

                <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #D97706', cursor: 'pointer' }} onClick={() => setActiveTab('verification')}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>UNDER SCRUTINY</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#D97706', margin: '0.2rem 0' }}>{underVerificationCount}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Pending Verification</div>
                </div>

                <div 
                  className="card" 
                  style={{ padding: '1.25rem', borderLeft: '4px solid #2563EB', cursor: 'pointer', transition: 'all 0.2s ease', backgroundColor: '#F8FAFC' }}
                  onClick={() => setActiveTab('payments')}
                  title="Click to view Beneficiary Bank Records"
                >
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>APPROVED BENEFICIARIES</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#2563EB', margin: '0.2rem 0' }}>{approvedBeneficiaries.length}</div>
                  <div style={{ fontSize: '0.7rem', color: '#1E40AF', fontWeight: 700 }}>Open Bank Records &rarr;</div>
                </div>

                <div 
                  className="card" 
                  style={{ padding: '1.25rem', borderLeft: '4px solid #16A34A', cursor: 'pointer' }}
                  onClick={() => setActiveTab('payments')}
                  title="Click to view Transferred Records"
                >
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>TRANSFERRED (OFFLINE)</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#16A34A', margin: '0.2rem 0' }}>{transferredBeneficiariesCount}</div>
                  <div style={{ fontSize: '0.7rem', color: '#16A34A' }}>₹{(transferredBeneficiariesCount * 12000).toLocaleString('en-IN')} Transferred</div>
                </div>

                <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #DC2626' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>REJECTED / CORRECTION</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#DC2626', margin: '0.2rem 0' }}>{rejectedCount + correctionCount}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{correctionCount} Awaiting Re-upload</div>
                </div>
              </div>

              {/* 2-Column Analytics Charts */}
              <div className="grid-2" style={{ marginBottom: '2rem' }}>
                
                {/* Geographic Distribution */}
                <div className="card" style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                      {authRole === 'INSTITUTION' ? 'Course / Class Breakdown' : 'Geographic Application Distribution'}
                    </h3>
                    <span className="badge badge-navy">
                      {authRole === 'INSTITUTION' ? 'Institutional Roster' : '6 Active Districts'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {authRole === 'INSTITUTION' ? (
                      [
                        { label: 'Higher Secondary (11th/12th)', count: roleScopedApplications.filter(a => (a.course || '').includes('12') || (a.course || '').includes('Secondary')).length, color: '#1E40AF' },
                        { label: 'High School (10th)', count: roleScopedApplications.filter(a => (a.course || '').includes('10')).length, color: '#2563EB' },
                        { label: 'Undergraduate / Degree', count: roleScopedApplications.filter(a => (a.course || '').includes('B.') || (a.course || '').includes('Graduation')).length, color: '#3B82F6' },
                        { label: 'Diploma / Technical', count: roleScopedApplications.filter(a => (a.course || '').includes('Polytechnic') || (a.course || '').includes('Diploma')).length, color: '#60A5FA' }
                      ].map(item => {
                        const pct = totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0;
                        return (
                          <div key={item.label}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 600 }}>
                              <span>{item.label}</span>
                              <span>{item.count} Candidates ({pct}%)</span>
                            </div>
                            <div style={{ height: '8px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${pct}%`, backgroundColor: item.color, borderRadius: '4px' }} />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      [
                        { district: 'Jabalpur', count: roleScopedApplications.filter(a => a.district === 'Jabalpur').length, color: '#1E40AF' },
                        { district: 'Bhopal', count: roleScopedApplications.filter(a => a.district === 'Bhopal').length, color: '#2563EB' },
                        { district: 'Indore', count: roleScopedApplications.filter(a => a.district === 'Indore').length, color: '#3B82F6' },
                        { district: 'Rewa', count: roleScopedApplications.filter(a => a.district === 'Rewa').length, color: '#60A5FA' },
                        { district: 'Mandla', count: roleScopedApplications.filter(a => a.district === 'Mandla').length, color: '#93C5FD' },
                        { district: 'Gwalior', count: roleScopedApplications.filter(a => a.district === 'Gwalior').length, color: '#BFDBFE' }
                      ].map(item => {
                        const pct = totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0;
                        return (
                          <div key={item.district}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 600 }}>
                              <span>{item.district}</span>
                              <span>{item.count} Candidates ({pct}%)</span>
                            </div>
                            <div style={{ height: '8px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${pct}%`, backgroundColor: item.color, borderRadius: '4px' }} />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Social Category Distribution */}
                <div className="card" style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                      Social Category Participation
                    </h3>
                    <span className="badge badge-yellow">Equitable Allocation</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                      { cat: 'General Category', count: roleScopedApplications.filter(a => a.category === 'General').length, color: '#1E293B' },
                      { cat: 'OBC (Other Backward Class)', count: roleScopedApplications.filter(a => a.category === 'OBC').length, color: '#D97706' },
                      { cat: 'SC (Scheduled Caste)', count: roleScopedApplications.filter(a => a.category === 'SC').length, color: '#DC2626' },
                      { cat: 'ST (Scheduled Tribe)', count: roleScopedApplications.filter(a => a.category === 'ST').length, color: '#16A34A' }
                    ].map(item => {
                      const pct = totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0;
                      return (
                        <div key={item.cat}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 600 }}>
                            <span>{item.cat}</span>
                            <span>{item.count} Candidates ({pct}%)</span>
                          </div>
                          <div style={{ height: '8px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, backgroundColor: item.color, borderRadius: '4px' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Recent Applications Table */}
              <div className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                    Recent Applications Awaiting Scrutiny
                  </h3>
                  <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('applications')}>
                    <span>View All Applications</span>
                  </button>
                </div>

                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Application ID</th>
                        <th>Student Name</th>
                        <th>District / Block</th>
                        <th>Institution</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roleScopedApplications.slice(0, 5).map(app => (
                        <tr key={app.id}>
                          <td style={{ fontWeight: 700, color: '#1E40AF', fontFamily: 'monospace' }}>{app.id}</td>
                          <td>
                            <div style={{ fontWeight: 700 }}>{app.studentName}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{app.mobile}</div>
                          </td>
                          <td>{app.district} / {app.block}</td>
                          <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.institution}</td>
                          <td>
                            <span className={`badge ${
                              app.status === 'Scholarship Released' ? 'badge-green' :
                              app.status === 'Approved' ? 'badge-blue' :
                              app.status === 'Rejected' ? 'badge-red' :
                              app.status === 'Correction Requested' ? 'badge-yellow' : 'badge-navy'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.8rem', color: '#64748B' }}>{app.submissionDate}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                              <button className="btn btn-secondary btn-sm" onClick={() => setActiveModalApp(app)}>
                                <Eye size={13} />
                                <span>Scrutiny</span>
                              </button>
                              {app.status === 'Approved' && (
                                <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>
                                  ✓ Ready for Payout
                                </span>
                              )}
                              {app.status === 'Scholarship Released' && (
                                <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>
                                  ✓ Transferred
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ====================================================================
              MODULE 2: APPLICATIONS & VERIFICATION TABLE
              ==================================================================== */}
          {activeTab === 'applications' && (
            <div className="animate-fade-in">
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>
                    {authRole === 'INSTITUTION' 
                      ? `${jurisdiction?.institution?.name || 'School / College'} — Enrolled Applications Master` 
                      : authRole === 'DISTRICT_COORDINATOR'
                      ? `${jurisdiction?.district?.name || 'District'} — District Applications Master`
                      : 'Application Master Registry & Fee Ledger'}
                  </h2>
                  <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
                    {authRole === 'INSTITUTION'
                      ? `Master database of enrolled students and official application forms for ${jurisdiction?.institution?.name || 'this institution'}`
                      : 'Official applicant master database: view student details, fee reconciliation ledger (Razorpay ₹211.30), printable forms, and CSV data export'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button 
                    type="button"
                    className="btn btn-gold btn-sm" 
                    onClick={() => setActiveTab('payments')}
                    style={{ fontWeight: 800, backgroundColor: '#D97706', color: '#FFFFFF', borderColor: '#D97706', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    title="Open Beneficiary Bank Records for manual scholarship bank transfers"
                  >
                    <CreditCard size={14} />
                    <span>Beneficiary Bank Records ({readyBeneficiariesCount} Ready)</span>
                  </button>

                  <button className="btn btn-outline btn-sm" onClick={handleExportApplications}>
                    <Download size={14} />
                    <span>Export CSV</span>
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => loadApplications()}>
                    <RefreshCw size={14} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Filter Bar */}
              <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <input 
                      type="text"
                      className="form-control"
                      placeholder="Filter by ID, Student, Mobile, Institution..."
                      value={tableSearch}
                      onChange={(e) => setTableSearch(e.target.value)}
                    />
                  </div>

                  <div style={{ minWidth: '150px' }}>
                    <select 
                      className="form-control"
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                    >
                      <option value="All">All Districts</option>
                      <option value="Jabalpur">Jabalpur</option>
                      <option value="Bhopal">Bhopal</option>
                      <option value="Indore">Indore</option>
                      <option value="Rewa">Rewa</option>
                      <option value="Mandla">Mandla</option>
                      <option value="Gwalior">Gwalior</option>
                    </select>
                  </div>

                  <div style={{ minWidth: '130px' }}>
                    <select 
                      className="form-control"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="All">All Categories</option>
                      <option value="General">General</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="OBC">OBC</option>
                    </select>
                  </div>

                  <div style={{ minWidth: '170px' }}>
                    <select 
                      className="form-control"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Under Verification">Under Verification</option>
                      <option value="Approved">Approved</option>
                      <option value="Scholarship Released">Scholarship Released</option>
                      <option value="Correction Requested">Correction Requested</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => { setSelectedDistrict('All'); setSelectedCategory('All'); setSelectedStatus('All'); setTableSearch(''); }}
                  >
                    <RefreshCw size={14} />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Application ID</th>
                      <th>Student Name</th>
                      <th>District / Block</th>
                      <th>Institution & Course</th>
                      <th>Category</th>
                      <th>Reg. Fee (₹ 211.30)</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map(app => (
                      <tr key={app.id}>
                        <td style={{ fontWeight: 700, color: '#1E40AF', fontFamily: 'monospace' }}>{app.id}</td>
                        <td>
                          <div style={{ fontWeight: 700 }}>{app.studentName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{app.mobile}</div>
                        </td>
                        <td>{app.district} / {app.block}</td>
                        <td>
                          <div style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.institution}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{app.course}</div>
                        </td>
                        <td><span className="badge badge-navy">{app.category}</span></td>
                        <td>
                          <div>
                            <span className={`badge ${app.registrationFeeStatus === 'PAID' ? 'badge-green' : 'badge-yellow'}`}>
                              {app.registrationFeeStatus === 'PAID' ? '✓ PAID ₹211.30' : 'PENDING'}
                            </span>
                            {app.razorpayPaymentId && (
                              <div style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#2563EB', marginTop: '3px' }}>
                                {app.razorpayPaymentId}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${
                            app.status === 'Scholarship Released' ? 'badge-green' :
                            app.status === 'Approved' ? 'badge-blue' :
                            app.status === 'Rejected' ? 'badge-red' :
                            app.status === 'Correction Requested' ? 'badge-yellow' : 'badge-navy'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: '#64748B' }}>{app.submissionDate}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                            <button 
                              className="btn btn-secondary btn-sm" 
                              onClick={() => setActiveViewApp(app)}
                              title="View full application form and fee payment details"
                            >
                              <FileText size={13} />
                              <span>View Form</span>
                            </button>
                            <button 
                              className="btn btn-outline btn-sm" 
                              onClick={() => window.open(`/certificate/${app.id}`, '_blank')}
                              title="View / Download Award Certificate"
                            >
                              <Award size={13} />
                            </button>
                            {app.status === 'Scholarship Released' && (
                              <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>
                                ✓ Disbursed
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ====================================================================
              MODULE 3: VERIFICATION QUEUE (Complete Multi-Tier Scrutiny)
              ==================================================================== */}
          {activeTab === 'verification' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>
                    {authRole === 'INSTITUTION' 
                      ? `${jurisdiction?.institution?.name || 'School / College'} — Institutional Verification Desk` 
                      : authRole === 'DISTRICT_COORDINATOR'
                      ? `${jurisdiction?.district?.name || 'District'} — District Scrutiny Desk`
                      : 'Verification & Document Scrutiny Desk'}
                  </h2>
                  <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
                    {authRole === 'INSTITUTION'
                      ? 'Actionable scrutiny queue: inspect student documents, validate uploaded photos, and attest institutional bonafide'
                      : 'Operational decision queue: audit candidate marksheets & income certificates, request corrections, and approve scholarship grants'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button 
                    type="button"
                    className="btn btn-gold btn-sm" 
                    onClick={() => setActiveTab('payments')}
                    style={{ fontWeight: 800, backgroundColor: '#D97706', color: '#FFFFFF', borderColor: '#D97706', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    title="Open Beneficiary Bank Records for manual scholarship bank transfers"
                  >
                    <CreditCard size={15} />
                    <span>Beneficiary Bank Records ({readyBeneficiariesCount} Ready)</span>
                  </button>

                  <button className="btn btn-primary btn-sm" onClick={() => loadApplications()}>
                    <RefreshCw size={14} />
                    <span>Refresh Queue</span>
                  </button>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${verificationFilter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setVerificationFilter('all')}
                  style={{ fontWeight: 700 }}
                >
                  All Students ({queueTotalCount})
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${verificationFilter === 'pending' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setVerificationFilter('pending')}
                  style={{ fontWeight: 700 }}
                >
                  Pending Scrutiny ({queuePendingCount})
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${verificationFilter === 'correction' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setVerificationFilter('correction')}
                  style={{ fontWeight: 700, borderColor: '#F59E0B', color: verificationFilter === 'correction' ? '#FFFFFF' : '#D97706' }}
                >
                  Correction Requested ({queueCorrectionCount})
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${verificationFilter === 'approved' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setVerificationFilter('approved')}
                  style={{ fontWeight: 700, borderColor: '#16A34A', color: verificationFilter === 'approved' ? '#FFFFFF' : '#16A34A' }}
                >
                  Approved / Ready ({queueApprovedCount})
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${verificationFilter === 'rejected' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setVerificationFilter('rejected')}
                  style={{ fontWeight: 700, borderColor: '#DC2626', color: verificationFilter === 'rejected' ? '#FFFFFF' : '#DC2626' }}
                >
                  Rejected ({queueRejectedCount})
                </button>
              </div>

              {/* Search and District Filter Toolbar */}
              <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ position: 'relative' }}>
                      <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input 
                        type="text"
                        className="form-control"
                        placeholder="Search by student name, ID, phone, institution or course..."
                        value={verificationSearch}
                        onChange={(e) => setVerificationSearch(e.target.value)}
                        style={{ paddingLeft: '2.4rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ minWidth: '160px' }}>
                    <select 
                      className="form-control"
                      value={verificationDistrict}
                      onChange={(e) => setVerificationDistrict(e.target.value)}
                    >
                      <option value="All">All Districts</option>
                      <option value="Jabalpur">Jabalpur</option>
                      <option value="Bhopal">Bhopal</option>
                      <option value="Indore">Indore</option>
                      <option value="Rewa">Rewa</option>
                      <option value="Mandla">Mandla</option>
                      <option value="Gwalior">Gwalior</option>
                    </select>
                  </div>

                  {(verificationSearch || verificationDistrict !== 'All' || verificationFilter !== 'all') && (
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => { setVerificationFilter('all'); setVerificationSearch(''); setVerificationDistrict('All'); }}
                    >
                      <RefreshCw size={13} />
                      <span>Reset Filters</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Verification Table */}
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Application ID</th>
                      <th>Applicant Name & Mobile</th>
                      <th>Institution & Course</th>
                      <th>District / Block</th>
                      <th>Uploaded Docs Status</th>
                      <th>Current Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verificationQueueApplications.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                          <div style={{ color: '#64748B', marginBottom: '0.5rem', fontWeight: 600 }}>
                            No student applications match the current filters.
                          </div>
                          <button 
                            className="btn btn-outline btn-sm" 
                            onClick={() => { setVerificationFilter('all'); setVerificationSearch(''); setVerificationDistrict('All'); }}
                          >
                            Reset All Filters
                          </button>
                        </td>
                      </tr>
                    ) : (
                      verificationQueueApplications.map(app => {
                        const docs = Object.values(app.documents || {});
                        const verifiedDocsCount = docs.filter(d => d.status === 'Verified' || d.status === 'VALID').length;
                        const totalDocsCount = Math.max(docs.length, 1);

                        return (
                          <tr key={app.id}>
                            <td style={{ fontWeight: 700, color: '#1E40AF', fontFamily: 'monospace' }}>
                              {app.id}
                            </td>
                            <td>
                              <div style={{ fontWeight: 700, color: '#0F172A' }}>{app.studentName}</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                {app.mobile} {app.fatherName ? `• S/O ${app.fatherName}` : ''}
                              </div>
                            </td>
                            <td>
                              <div style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>
                                {app.institution}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{app.course}</div>
                            </td>
                            <td>
                              <div style={{ fontWeight: 600 }}>{app.district}</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{app.block}</div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span className={`badge ${verifiedDocsCount === totalDocsCount && totalDocsCount > 0 ? 'badge-green' : 'badge-navy'}`} style={{ fontSize: '0.75rem' }}>
                                  {verifiedDocsCount}/{totalDocsCount} Verified
                                </span>
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${
                                app.status === 'Scholarship Released' || app.rawStatus === 'SCHOLARSHIP_RELEASED' ? 'badge-green' :
                                app.status === 'Approved' || app.rawStatus === 'APPROVED' ? 'badge-blue' :
                                app.status === 'Rejected' || app.rawStatus === 'REJECTED' ? 'badge-red' :
                                app.status === 'Correction Requested' || app.rawStatus === 'CORRECTION_REQUESTED' ? 'badge-yellow' : 'badge-navy'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                                <button className="btn btn-primary btn-sm" onClick={() => setActiveModalApp(app)}>
                                  <Eye size={13} />
                                  <span>Scrutinize / Verify</span>
                                </button>
                                {app.status === 'Under Verification' && (
                                  <button 
                                    type="button"
                                    className="btn btn-sm"
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      if (window.confirm(`Approve scholarship grant of ₹12,000 for ${app.studentName} (${app.id})? This will move the student to Beneficiary Bank Records for disbursal.`)) {
                                        await updateApplicationStatus(app.id, 'Approved', 'Approved by Committee from Verification Queue');
                                        try {
                                          await certificateService.issueCertificate({
                                            applicationId: app.id,
                                            studentName: app.studentName,
                                            schemeName: 'Jankalyan Manavadhikar Foundation Scholarship Scheme 2026-27',
                                            grantAmount: 12000
                                          });
                                        } catch (err) {
                                          // ignore duplicate cert
                                        }
                                        loadApplications();
                                      }
                                    }}
                                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', color: '#166534', backgroundColor: '#DCFCE7', border: '1px solid #BBF7D0', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}
                                    title="Quick Approve & Move to Beneficiary Bank Records for Disbursal"
                                  >
                                    <CheckCircle2 size={13} color="#16A34A" />
                                    <span>Approve (₹12k)</span>
                                  </button>
                                )}
                                {(app.status === 'Approved' || app.rawStatus === 'APPROVED') && (
                                  <button 
                                    type="button"
                                    className="btn btn-outline btn-sm"
                                    onClick={() => setActiveTab('payments')}
                                    style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', color: '#1E40AF', borderColor: '#BFDBFE', backgroundColor: '#EFF6FF', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                                    title="Open student in Beneficiary Bank Records"
                                  >
                                    <CreditCard size={12} />
                                    <span>Bank Record</span>
                                  </button>
                                )}
                                {(app.status === 'Scholarship Released' || app.rawStatus === 'SCHOLARSHIP_RELEASED') && (
                                  <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>
                                    ✓ Transferred
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ====================================================================
              MODULE 4: PAYMENTS & DBT DISBURSEMENT
              ==================================================================== */}
          {/* ====================================================================
              MODULE 4: SCHOLARSHIP BENEFICIARY RECORDS (READY FOR DISBURSEMENT)
              ==================================================================== */}
          {activeTab === 'payments' && (
            <div className="animate-fade-in">
              
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span>Scholarship Beneficiaries Record</span>
                    <span className="badge badge-green" style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem', fontWeight: 700 }}>
                      Ready for Manual Bank Transfer
                    </span>
                  </h2>
                  <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    Official ledger of all verified & approved students ready for scholarship transfer (₹12,000). Export bank transfer sheet (CSV) for manual corporate net banking or branch transfer.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button className="btn btn-outline" onClick={handlePrintSanctionLedger} title="Print Sanction Ledger Order">
                    <Printer size={16} />
                    <span>Print Sanction Ledger</span>
                  </button>
                  <button className="btn btn-primary" onClick={handleExportBeneficiaries} title="Export bank-ready CSV for Corporate Net Banking upload">
                    <Download size={16} />
                    <span>Export Bank Transfer Sheet (CSV)</span>
                  </button>
                </div>
              </div>

              {/* Metric Cards */}
              <div className="grid-4" style={{ marginBottom: '1.75rem', gap: '1rem' }}>
                <div className="metric-card" style={{ padding: '1.25rem' }}>
                  <div style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    Total Approved Beneficiaries
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#1E40AF', marginTop: '0.25rem' }}>
                    {approvedBeneficiaries.length}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                    Verified by Scrutiny Desk
                  </div>
                </div>

                <div className="metric-card" style={{ padding: '1.25rem' }}>
                  <div style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    Total Grant Sanctioned
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#16A34A', marginTop: '0.25rem' }}>
                    ₹{(approvedBeneficiaries.length * 12000).toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#16A34A', marginTop: '0.25rem' }}>
                    @ ₹12,000 per student
                  </div>
                </div>

                <div className="metric-card" style={{ padding: '1.25rem' }}>
                  <div style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    Ready for Bank Transfer
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#D97706', marginTop: '0.25rem' }}>
                    {readyBeneficiariesCount}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#D97706', marginTop: '0.25rem' }}>
                    Pending manual offline transfer
                  </div>
                </div>

                <div className="metric-card" style={{ padding: '1.25rem' }}>
                  <div style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    Transfers Completed
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#059669', marginTop: '0.25rem' }}>
                    {transferredBeneficiariesCount}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.25rem' }}>
                    Offline payout recorded
                  </div>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: '280px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                      <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input 
                        type="text"
                        placeholder="Search student, App ID, mobile, bank account, IFSC..."
                        value={beneficiarySearch}
                        onChange={(e) => setBeneficiarySearch(e.target.value)}
                        className="form-control"
                        style={{ paddingLeft: '36px' }}
                      />
                    </div>

                    <select 
                      className="form-control" 
                      style={{ width: 'auto', minWidth: '160px' }}
                      value={beneficiaryDistrict}
                      onChange={(e) => setBeneficiaryDistrict(e.target.value)}
                    >
                      <option value="All">All Districts</option>
                      <option value="Jabalpur">Jabalpur</option>
                      <option value="Bhopal">Bhopal</option>
                      <option value="Indore">Indore</option>
                      <option value="Gwalior">Gwalior</option>
                      <option value="Ujjain">Ujjain</option>
                      <option value="Sagar">Sagar</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: '#F1F5F9', padding: '0.3rem', borderRadius: '8px' }}>
                    <button 
                      className={`btn btn-sm ${beneficiaryFilterStatus === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setBeneficiaryFilterStatus('all')}
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      All Verified ({approvedBeneficiaries.length})
                    </button>
                    <button 
                      className={`btn btn-sm ${beneficiaryFilterStatus === 'ready' ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setBeneficiaryFilterStatus('ready')}
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      Ready for Transfer ({readyBeneficiariesCount})
                    </button>
                    <button 
                      className={`btn btn-sm ${beneficiaryFilterStatus === 'transferred' ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setBeneficiaryFilterStatus('transferred')}
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      Transferred ({transferredBeneficiariesCount})
                    </button>
                  </div>
                </div>
              </div>

              {/* Beneficiary Records Table */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Sanctioned Beneficiaries & Bank Account Ledger ({filteredBeneficiaries.length})
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    Showing verified students ready for manual bank payout
                  </span>
                </div>

                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Sr / App ID</th>
                        <th>Beneficiary Student</th>
                        <th>College / District</th>
                        <th>Sanction Amount</th>
                        <th>Bank Account Details</th>
                        <th>Approval Date</th>
                        <th>Transfer Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBeneficiaries.map((b, idx) => (
                        <tr key={b.id}>
                          <td>
                            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>#{idx + 1}</div>
                            <div 
                              style={{ fontWeight: 700, fontFamily: 'monospace', color: '#1E40AF', cursor: 'pointer' }}
                              onClick={() => setActiveViewApp(b)}
                              title="Click to view dossier"
                            >
                              {b.id}
                            </div>
                          </td>

                          <td>
                            <div style={{ fontWeight: 800, color: '#0F172A' }}>{b.accountHolderName || b.studentName}</div>
                            {b.fatherName && <div style={{ fontSize: '0.75rem', color: '#64748B' }}>S/o: {b.fatherName}</div>}
                            <div style={{ fontSize: '0.72rem', color: '#2563EB', marginTop: '2px' }}>{b.mobile}</div>
                          </td>

                          <td>
                            <div style={{ fontWeight: 600, fontSize: '0.82rem', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {b.institution}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                              {b.district} {b.block ? `/ ${b.block}` : ''}
                            </div>
                          </td>

                          <td>
                            <div style={{ fontWeight: 800, color: '#16A34A', fontSize: '1.05rem' }}>₹12,000</div>
                            <div style={{ fontSize: '0.68rem', color: '#64748B' }}>Sanctioned Grant</div>
                          </td>

                          <td>
                            <div style={{ backgroundColor: '#F8FAFC', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', minWidth: '220px' }}>
                              <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.bankName}</span>
                                <span className={`badge ${b.isAadhaarSeeded ? 'badge-green' : 'badge-yellow'}`} style={{ fontSize: '0.62rem', padding: '0.1rem 0.35rem' }}>
                                  {b.isAadhaarSeeded ? 'Aadhaar Seeded' : 'Pending'}
                                </span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1E40AF', fontSize: '0.85rem' }}>
                                  {b.accountNumber}
                                </span>
                                <button 
                                  onClick={() => handleCopyText(b.accountNumber, `acc_${b.id}`)}
                                  title="Copy Account Number"
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', display: 'flex', alignItems: 'center', color: copyFeedback[`acc_${b.id}`] ? '#16A34A' : '#64748B' }}
                                >
                                  {copyFeedback[`acc_${b.id}`] ? <Check size={13} color="#16A34A" /> : <Copy size={13} />}
                                </button>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.15rem' }}>
                                <span style={{ fontSize: '0.72rem', color: '#64748B', fontFamily: 'monospace' }}>
                                  IFSC: <strong>{b.ifsc}</strong>
                                </span>
                                <button 
                                  onClick={() => handleCopyText(b.ifsc, `ifsc_${b.id}`)}
                                  title="Copy IFSC Code"
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', display: 'flex', alignItems: 'center', color: copyFeedback[`ifsc_${b.id}`] ? '#16A34A' : '#64748B' }}
                                >
                                  {copyFeedback[`ifsc_${b.id}`] ? <Check size={13} color="#16A34A" /> : <Copy size={13} />}
                                </button>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#0F172A' }}>
                              {b.approvalDate && b.approvalDate !== '-' ? b.approvalDate : 'Verified'}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#16A34A', fontWeight: 600 }}>
                              ✓ Scrutiny Passed
                            </div>
                          </td>

                          <td>
                            {(b.status === 'Scholarship Released' || b.rawStatus === 'SCHOLARSHIP_RELEASED') ? (
                              <div>
                                <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>✓ Transferred</span>
                                {b.utrNumber && b.utrNumber !== '-' && (
                                  <div style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#15803D', marginTop: '2px' }}>
                                    Ref: {b.utrNumber}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="badge badge-blue" style={{ fontSize: '0.75rem' }}>
                                Ready for Transfer
                              </span>
                            )}
                          </td>

                          <td>
                            <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                              <button 
                                className="btn btn-outline btn-sm" 
                                onClick={() => setActiveViewApp(b)}
                                title="View full application form and documents"
                                style={{ padding: '0.3rem 0.55rem', fontSize: '0.75rem' }}
                              >
                                <FileText size={12} />
                                <span>View</span>
                              </button>
                              {(b.status !== 'Scholarship Released' && b.rawStatus !== 'SCHOLARSHIP_RELEASED') ? (
                                <button 
                                  className="btn btn-secondary btn-sm" 
                                  onClick={() => handleOpenMarkTransferred(b)}
                                  title="Mark that you have completed manual transfer offline"
                                  style={{ padding: '0.3rem 0.55rem', fontSize: '0.75rem' }}
                                >
                                  <CheckCircle2 size={12} />
                                  <span>Mark Paid</span>
                                </button>
                              ) : (
                                <span style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 700 }}>
                                  Recorded
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredBeneficiaries.length === 0 && (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#64748B' }}>
                            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>
                              No Beneficiaries Found
                            </div>
                            <div style={{ fontSize: '0.85rem' }}>
                              Once applications are approved in the Verification Queue, they will appear here ready for manual bank transfer.
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ====================================================================
              MODULE 5: LIVE CMS & POLICY EDITOR (Zero Code Changes Required)
              ==================================================================== */}
          {activeTab === 'cms' && (
            <div className="card animate-fade-in" style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>
                    Live CMS & Foundation Policy Editor
                  </h2>
                  <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
                    Changes made here instantly update the public website without editing source code
                  </p>
                </div>

                <button className="btn btn-primary" onClick={handleSaveCMS}>
                  <Save size={16} />
                  <span>Save CMS Content to Database</span>
                </button>
              </div>

              {cmsSaveAlert && (
                <div style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '1rem 1.5rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CheckCircle2 size={20} />
                  <span style={{ fontWeight: 700 }}>CMS updates successfully saved to Supabase! Public website updated.</span>
                </div>
              )}

              <form onSubmit={handleSaveCMS}>
                
                {/* 1. Core Scholarship Parameters */}
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
                  1. Scholarship Scheme Parameters
                </h3>
                <div className="grid-2" style={{ marginBottom: '2rem' }}>
                  <div className="form-group">
                    <label className="form-label required">Scholarship Grant Amount (Display Value)</label>
                    <input 
                      type="text"
                      className="form-control"
                      value={cmsForm.scholarshipAmount || ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, scholarshipAmount: e.target.value })}
                    />
                    <div className="form-hint">Controls the scholarship grant value displayed across all public pages</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Eligibility Overview Summary</label>
                    <input 
                      type="text"
                      className="form-control"
                      value={cmsForm.eligibilityCriteria || ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, eligibilityCriteria: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Application Start Date</label>
                    <input 
                      type="text"
                      className="form-control"
                      placeholder="e.g. 15/09/2026"
                      value={cmsForm.applicationStartDate || ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, applicationStartDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Application Last Date</label>
                    <input 
                      type="text"
                      className="form-control"
                      placeholder="e.g. 30/11/2026"
                      value={cmsForm.applicationLastDate || ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, applicationLastDate: e.target.value })}
                    />
                  </div>
                </div>

                {/* 2. Official Organization Contacts */}
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
                  2. Official Verified Contacts & Registration
                </h3>
                <div className="grid-3" style={{ marginBottom: '2rem' }}>
                  <div className="form-group">
                    <label className="form-label required">Helpline Mobile</label>
                    <input 
                      type="text"
                      className="form-control"
                      value={cmsForm.officialMobile || ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, officialMobile: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Helpline Telephone</label>
                    <input 
                      type="text"
                      className="form-control"
                      value={cmsForm.officialTelephone || ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, officialTelephone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Official Email</label>
                    <input 
                      type="email"
                      className="form-control"
                      value={cmsForm.officialEmail || ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, officialEmail: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row-2" style={{ marginBottom: '2rem' }}>
                  <div className="form-group">
                    <label className="form-label required">Official Office Address</label>
                    <input 
                      type="text"
                      className="form-control"
                      value={cmsForm.officeAddress || ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, officeAddress: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Official Registration Number</label>
                    <input 
                      type="text"
                      className="form-control"
                      value={cmsForm.registrationDetails || ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, registrationDetails: e.target.value })}
                    />
                  </div>
                </div>

                {/* 3. Hero Slideshow Editor */}
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
                  3. Homepage Hero Slideshow Manager ({heroSlides.length} Slides)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  {heroSlides.map((slide, idx) => (
                    <div key={slide.id || idx} style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <span className="badge badge-navy">Slide #{idx + 1}</span>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <label style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <input 
                              type="checkbox" 
                              checked={slide.is_active !== false}
                              onChange={(e) => {
                                const updated = [...heroSlides];
                                updated[idx].is_active = e.target.checked;
                                setHeroSlides(updated);
                              }}
                            />
                            <span>Active</span>
                          </label>
                        </div>
                      </div>

                      <div className="grid-2" style={{ gap: '0.75rem' }}>
                        <div>
                          <label className="form-label">Image URL / Media Path</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={slide.image_url || ''} 
                            onChange={(e) => {
                              const updated = [...heroSlides];
                              updated[idx].image_url = e.target.value;
                              setHeroSlides(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="form-label">Slide Duration (ms)</label>
                          <input 
                            type="number" 
                            className="form-control" 
                            value={slide.slide_duration_ms || 3000} 
                            onChange={(e) => {
                              const updated = [...heroSlides];
                              updated[idx].slide_duration_ms = parseInt(e.target.value) || 3000;
                              setHeroSlides(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="form-label">English Heading</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={slide.heading_en || ''} 
                            onChange={(e) => {
                              const updated = [...heroSlides];
                              updated[idx].heading_en = e.target.value;
                              setHeroSlides(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="form-label">Hindi Heading (हिंदी)</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={slide.heading_hi || ''} 
                            onChange={(e) => {
                              const updated = [...heroSlides];
                              updated[idx].heading_hi = e.target.value;
                              setHeroSlides(updated);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 4. Top Announcement Bar */}
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
                  4. Top Announcement Bar Ticker
                </h3>
                <div style={{ backgroundColor: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '2rem' }}>
                  <div className="form-row-2">
                    <div>
                      <label className="form-label">English Ticker Text</label>
                      <input 
                        type="text"
                        className="form-control"
                        value={cmsForm.announcements?.[0]?.en || ''}
                        onChange={(e) => {
                          const arr = [...(cmsForm.announcements || [])];
                          if (arr[0]) arr[0].en = e.target.value;
                          setCmsForm({ ...cmsForm, announcements: arr });
                        }}
                      />
                    </div>
                    <div>
                      <label className="form-label">Hindi Ticker Text (हिंदी)</label>
                      <input 
                        type="text"
                        className="form-control"
                        value={cmsForm.announcements?.[0]?.hi || ''}
                        onChange={(e) => {
                          const arr = [...(cmsForm.announcements || [])];
                          if (arr[0]) arr[0].hi = e.target.value;
                          setCmsForm({ ...cmsForm, announcements: arr });
                        }}
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg">
                  <Save size={18} />
                  <span>Save CMS Content to Database</span>
                </button>

              </form>
            </div>
          )}

          {/* ====================================================================
              MODULE 6: COMMISSIONS MANAGEMENT
              ==================================================================== */}
          {activeTab === 'commissions' && (
            <div className="animate-fade-in">
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>
                  Commission Rates & Coordinator Settlements
                </h2>
                <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
                  Configure role-based commission amounts per approved application and manage payouts
                </p>
              </div>

              {/* Commission Rates Configurator */}
              <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
                  Configured Role Commission Slabs
                </h3>

                <div className="grid-4" style={{ gap: '1rem' }}>
                  {commissionRates.map(rate => (
                    <div key={rate.id} style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                        {rate.role_id.replace('_', ' ')}
                      </div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#16A34A', margin: '0.25rem 0' }}>
                        ₹{parseFloat(rate.rate_amount).toFixed(2)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        Model: {rate.model_type}
                      </div>
                      <button 
                        className="btn btn-outline btn-sm"
                        style={{ marginTop: '0.75rem', width: '100%', fontSize: '0.75rem' }}
                        onClick={async () => {
                          const newRate = prompt(`Enter new commission rate (₹) for ${rate.role_id}:`, rate.rate_amount);
                          if (newRate && !isNaN(newRate)) {
                            await commissionService.updateCommissionRate(rate.role_id, parseFloat(newRate));
                            const updated = await commissionService.getCommissionRates();
                            setCommissionRates(updated);
                          }
                        }}
                      >
                        <Edit3 size={12} />
                        <span>Edit Rate</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Generated Commissions Table */}
              <div className="card" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
                  Coordinator Commission Ledger
                </h3>

                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Beneficiary</th>
                        <th>Role</th>
                        <th>Application ID</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commissionsList.map(c => (
                        <tr key={c.id}>
                          <td style={{ fontWeight: 700 }}>{c.profiles?.full_name || 'Coordinator'}</td>
                          <td><span className="badge badge-navy">{c.beneficiary_role}</span></td>
                          <td style={{ fontFamily: 'monospace' }}>{c.application_id}</td>
                          <td style={{ fontWeight: 700, color: '#16A34A' }}>₹{c.amount}</td>
                          <td>
                            <span className={`badge ${c.status === 'APPROVED' ? 'badge-green' : 'badge-yellow'}`}>
                              {c.status}
                            </span>
                          </td>
                          <td>
                            {c.status !== 'APPROVED' ? (
                              <button 
                                className="btn btn-secondary btn-sm"
                                onClick={async () => {
                                  await commissionService.approveCommission(c.id, authUser?.id);
                                  const updated = await commissionService.getCommissions();
                                  setCommissionsList(updated);
                                }}
                              >
                                Approve
                              </button>
                            ) : (
                              <span style={{ fontSize: '0.8rem', color: '#16A34A' }}>Settled</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {commissionsList.length === 0 && (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                            Commissions automatically accrue upon application verification and DBT approval.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ====================================================================
              MODULE 7: REPORTS & MIS
              ==================================================================== */}
          {activeTab === 'reports' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>
                    Management Information System (MIS) Reports
                  </h2>
                  <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
                    Real-time aggregated performance metrics, scheme utilization, and CSV exports
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn btn-outline" onClick={handleExportApplications}>
                    <Download size={15} />
                    <span>Export Application Master (CSV)</span>
                  </button>
                  <button className="btn btn-primary" onClick={() => window.print()}>
                    <Printer size={15} />
                    <span>Print MIS Summary</span>
                  </button>
                </div>
              </div>

              {/* Summary KPIs */}
              <div className="grid-4" style={{ marginBottom: '2rem' }}>
                <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>TOTAL APPLICANTS</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#1E40AF', margin: '0.25rem 0' }}>{totalCount}</div>
                </div>

                <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>SANCTIONED / APPROVED</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#2563EB', margin: '0.25rem 0' }}>{approvedCount + releasedCount}</div>
                </div>

                <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>STUDENTS DISBURSED</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#16A34A', margin: '0.25rem 0' }}>{releasedCount}</div>
                </div>

                <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>TOTAL FUNDS DISBURSED</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#16A34A', margin: '0.25rem 0' }}>
                    ₹{(releasedCount * 12000).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Printable Table of District Breakdown */}
              <div className="card" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
                  District-Wise Scrutiny & Disbursement Matrix
                </h3>

                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>District Name</th>
                        <th>Total Applicants</th>
                        <th>Approved</th>
                        <th>Disbursed</th>
                        <th>Under Scrutiny</th>
                        <th>Disbursed Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['Jabalpur', 'Bhopal', 'Indore', 'Rewa', 'Mandla', 'Gwalior'].map(d => {
                        const distApps = applications.filter(a => a.district === d);
                        const apprv = distApps.filter(a => a.status === 'Approved').length;
                        const disb = distApps.filter(a => a.status === 'Scholarship Released').length;
                        const underV = distApps.filter(a => a.status === 'Under Verification').length;
                        return (
                          <tr key={d}>
                            <td style={{ fontWeight: 700 }}>{d}</td>
                            <td>{distApps.length}</td>
                            <td>{apprv}</td>
                            <td>{disb}</td>
                            <td>{underV}</td>
                            <td style={{ fontWeight: 700, color: '#16A34A' }}>₹{(disb * 12000).toLocaleString('en-IN')}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ====================================================================
              MODULE 8: GRIEVANCES REDRESSAL
              ==================================================================== */}
          {activeTab === 'grievances' && (
            <div className="animate-fade-in">
              <GrievanceManager authUser={authUser} />
            </div>
          )}

          {/* ====================================================================
              MODULE 9: AUDIT LOGS
              ==================================================================== */}
          {activeTab === 'audit' && (
            <div className="animate-fade-in">
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>
                  System Audit Logs & Security Traceability
                </h2>
                <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
                  Tamper-resistant audit record of status transitions, logins, exports, and payment dispatches
                </p>
              </div>

              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Actor Role</th>
                      <th>Action</th>
                      <th>Entity</th>
                      <th>Entity ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map(log => (
                      <tr key={log.id}>
                        <td style={{ fontSize: '0.8rem', color: '#64748B' }}>{new Date(log.created_at).toLocaleString()}</td>
                        <td><span className="badge badge-navy">{log.actor_role || 'SYSTEM'}</span></td>
                        <td style={{ fontWeight: 700 }}>{log.action}</td>
                        <td>{log.entity_type}</td>
                        <td style={{ fontFamily: 'monospace' }}>{log.entity_id || '-'}</td>
                      </tr>
                    ))}
                    {auditLogs.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                          No audit entries recorded yet. System operations will automatically populate here.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ====================================================================
              MODULE 10: CERTIFICATES & QR
              ==================================================================== */}
          {activeTab === 'certificates' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>
                    Digital Scholarship Award Certificates
                  </h2>
                  <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
                    Digitally signed award certificates issued to approved candidates with QR verification
                  </p>
                </div>
              </div>

              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Certificate Number</th>
                      <th>Student Name</th>
                      <th>Application ID</th>
                      <th>Issue Date</th>
                      <th>QR Code</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issuedCertificates.map(cert => (
                      <tr key={cert.id}>
                        <td style={{ fontWeight: 700, fontFamily: 'monospace', color: '#1E40AF' }}>{cert.certificate_number}</td>
                        <td style={{ fontWeight: 700 }}>{cert.student_name}</td>
                        <td style={{ fontFamily: 'monospace' }}>{cert.application_id}</td>
                        <td>{cert.issue_date}</td>
                        <td>
                          <QrCodeDisplay value={`${window.location.origin}/verify/certificate/${cert.verification_token}`} size={42} />
                        </td>
                        <td>
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => navigate(`/certificate/${cert.application_id}`)}
                          >
                            <Eye size={13} />
                            <span>View / Print</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {issuedCertificates.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                          Certificates are automatically generated when an application is approved.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Real Functional Admin Modules */}
          {activeTab === 'districts' && <DistrictsManager />}
          {activeTab === 'institutions' && <InstitutionsManager />}
          {activeTab === 'schemes' && <SchemesManager />}
          {activeTab === 'merit' && <MeritManager />}
          {activeTab === 'donors' && <DonorsManager />}
          {activeTab === 'notifications' && <NotificationsManager />}
          {activeTab === 'media' && <MediaManager />}
          {activeTab === 'downloads' && <DownloadsManager />}
          {activeTab === 'qr_verify' && <QrVerifyManager />}
          {activeTab === 'users' && <UsersManager />}
          {activeTab === 'settings' && <SettingsManager />}

        </main>
      </div>

      {/* View-Only Application Master Dossier Modal */}
      {activeViewApp && (
        <ApplicationScrutinyModal 
          application={activeViewApp}
          onClose={() => setActiveViewApp(null)}
          readOnly={true}
          currentUser={{ ...authUser, role: authRole, jurisdiction }}
          onOpenBankRecords={() => {
            setActiveViewApp(null);
            setActiveTab('payments');
          }}
        />
      )}

      {/* Operational Scrutiny & Approval Modal */}
      {activeModalApp && (
        <ApplicationScrutinyModal 
          application={activeModalApp}
          onClose={() => setActiveModalApp(null)}
          readOnly={false}
          onOpenBankRecords={() => {
            setActiveModalApp(null);
            setActiveTab('payments');
          }}
          onStatusUpdated={(appId, newStatus, utr) => {
            loadApplications();
            setActiveModalApp(null);
          }}
          onDocumentVerified={(appId, docKey, newStatus, reason) => {
            setActiveModalApp(prev => {
              if (!prev || prev.id !== appId) return prev;
              const updatedDocs = {
                ...(prev.documents || {}),
                [docKey]: {
                  ...(prev.documents?.[docKey] || {}),
                  status: newStatus,
                  reason: reason
                }
              };
              return { ...prev, documents: updatedDocs };
            });
            loadApplications();
          }}
          currentUser={{ ...authUser, role: authRole, jurisdiction }}
        />
      )}

      {/* Manual Offline Transfer Confirmation Modal */}
      {markingTransferredApp && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '1rem',
          overflowY: 'auto',
          boxSizing: 'border-box'
        }}>
          <div 
            className="animate-fade-in" 
            style={{ 
              maxWidth: '520px', 
              width: '100%', 
              maxHeight: 'min(88vh, 600px)',
              backgroundColor: '#FFFFFF', 
              borderRadius: '16px', 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              margin: 'auto'
            }}
          >
            {/* Modal Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '1.25rem 1.5rem', 
              borderBottom: '1px solid #E2E8F0',
              flexShrink: 0
            }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Record Manual Bank Transfer
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.78rem', margin: '0.2rem 0 0 0' }}>
                  Offline transfer bookkeeping & UTR reference update
                </p>
              </div>
              <button 
                onClick={() => setMarkingTransferredApp(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1 }}>
              {/* Beneficiary Details Summary Card */}
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1.1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Beneficiary Student:</span>
                  <strong style={{ color: '#0F172A', fontSize: '0.85rem' }}>{markingTransferredApp.studentName} ({markingTransferredApp.id})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Grant Sanctioned:</span>
                  <strong style={{ color: '#16A34A', fontSize: '1rem' }}>₹12,000.00</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Beneficiary Bank:</span>
                  <span style={{ color: '#0F172A', fontWeight: 600, fontSize: '0.82rem' }}>{markingTransferredApp.bankName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Account No & IFSC:</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1E40AF', fontSize: '0.82rem' }}>
                    {markingTransferredApp.accountNumber} ({markingTransferredApp.ifsc})
                  </span>
                </div>
              </div>

              {/* Form Inputs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div className="form-group">
                  <label className="form-label required" style={{ fontSize: '0.82rem', marginBottom: '0.3rem' }}>Transfer Execution Date</label>
                  <input 
                    type="date"
                    value={transferModalForm.paymentDate}
                    onChange={(e) => setTransferModalForm(prev => ({ ...prev, paymentDate: e.target.value }))}
                    className="form-control"
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required" style={{ fontSize: '0.82rem', marginBottom: '0.3rem' }}>Disbursing Bank / Source Account</label>
                  <input 
                    type="text"
                    value={transferModalForm.disbursingBank}
                    onChange={(e) => setTransferModalForm(prev => ({ ...prev, disbursingBank: e.target.value }))}
                    placeholder="e.g. State Bank of India - Trust Account"
                    className="form-control"
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.82rem', marginBottom: '0.3rem' }}>Bank Transaction Reference / UTR (Optional)</label>
                  <input 
                    type="text"
                    value={transferModalForm.utrNumber}
                    onChange={(e) => setTransferModalForm(prev => ({ ...prev, utrNumber: e.target.value.toUpperCase() }))}
                    placeholder="e.g. SBIN409281729014 or CMS-992144"
                    className="form-control"
                    style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '0.2rem', display: 'block' }}>
                    If entered, the student will see this UTR on their dashboard and public tracking.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.82rem', marginBottom: '0.3rem' }}>Ledger Remarks (Optional)</label>
                  <input 
                    type="text"
                    value={transferModalForm.remarks}
                    onChange={(e) => setTransferModalForm(prev => ({ ...prev, remarks: e.target.value }))}
                    placeholder="e.g. Manually transferred via Net Banking"
                    className="form-control"
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer - Always Sticky at the Bottom */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: '0.75rem', 
              padding: '0.85rem 1.5rem', 
              borderTop: '1px solid #E2E8F0', 
              backgroundColor: '#F8FAFC',
              flexShrink: 0
            }}>
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => setMarkingTransferredApp(null)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary btn-sm"
                style={{ backgroundColor: '#16A34A', borderColor: '#16A34A', fontWeight: 800 }}
                onClick={handleConfirmManualTransfer}
              >
                <CheckCircle2 size={14} />
                <span>Confirm & Mark Transferred</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
