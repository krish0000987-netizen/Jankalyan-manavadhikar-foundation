import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminTopNav } from '../components/admin/AdminTopNav';
import { ApplicationScrutinyModal } from '../components/admin/ApplicationScrutinyModal';
import { QrCodeDisplay } from '../components/common/QrCodeDisplay';
import { getAllStates, getDistrictsByState, getBlocksByDistrict, findStateByDistrict } from '../data/indiaLocations';
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
  Printer,
  Pin,
  Loader2
} from 'lucide-react';
import { supabase } from '../api/supabase';
import { paymentService } from '../services/paymentService';
import { scrutinyService } from '../services/scrutinyService';
import { reportService } from '../services/reportService';
import { commissionService } from '../services/commissionService';
import { notificationService } from '../services/notificationService';
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

export const OFFICIAL_COORDINATOR_ROLES = [
  { id: 'DISTRICT_COORDINATOR', sno: 1, nameHi: 'जिला समन्वयक', nameEn: 'District Coordinator', target: 1000, rate: 50, color: '#1E40AF', bg: '#EFF6FF', border: '#BFDBFE', icon: '🏛️' },
  { id: 'BLOCK_COORDINATOR', sno: 2, nameHi: 'ब्लॉक समन्वयक', nameEn: 'Block Coordinator', target: 500, rate: 40, color: '#0369A1', bg: '#F0F9FF', border: '#BAE6FD', icon: '🏢' },
  { id: 'TEHSIL_COORDINATOR', sno: 3, nameHi: 'तहसील समन्वयक', nameEn: 'Tehsil Coordinator', target: 300, rate: 35, color: '#0D9488', bg: '#F0FDFA', border: '#99F6E4', icon: '🏛️' },
  { id: 'GRAM_PANCHAYAT_COORDINATOR', sno: 4, nameHi: 'ग्राम पंचायत समन्वयक', nameEn: 'Gram Panchayat Coordinator', target: 100, rate: 25, color: '#15803D', bg: '#F0FDF4', border: '#BBF7D0', icon: '🏘️' },
  { id: 'ONLINE_CENTER', sno: 5, nameHi: 'ऑनलाइन शॉप / CSC / साइबर कैफे', nameEn: 'Online Shop / CSC / Cyber Cafe', target: 50, rate: 30, color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', icon: '💻' },
  { id: 'SCHOOL_COORDINATOR', sno: 6, nameHi: 'स्कूल', nameEn: 'School Coordinator', target: 100, rate: 25, color: '#4338CA', bg: '#EEF2FF', border: '#C7D2FE', icon: '🏫' },
  { id: 'COLLEGE_COORDINATOR', sno: 7, nameHi: 'कॉलेज', nameEn: 'College Coordinator', target: 150, rate: 30, color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', icon: '🎓' },
  { id: 'COACHING_CENTER', sno: 8, nameHi: 'कोचिंग सेंटर', nameEn: 'Coaching Center', target: 100, rate: 20, color: '#BE123C', bg: '#FFF1F2', border: '#FECDD3', icon: '👨‍🏫' },
  { id: 'INSTITUTION', sno: 9, nameHi: 'शैक्षणिक संस्थान (School / College Nodal)', nameEn: 'Educational Institution', target: 100, rate: 25, color: '#334155', bg: '#F1F5F9', border: '#CBD5E1', icon: '🏫' }
];

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
    refreshCMS,
    authUser, 
    authRole, 
    authLoading,
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

  // Auth Guard: Ensure unauthenticated users are redirected to login
  useEffect(() => {
    if (authLoading) return;
    const isAuthorized = Boolean(
      authUser && 
      ['SUPER_ADMIN', 'DISTRICT_COORDINATOR', 'BLOCK_COORDINATOR', 'INSTITUTION', 'ONLINE_CENTER'].includes(authRole)
    );
    if (!isAuthorized) {
      navigate('/admin/login');
    } else if (applications.length === 0) {
      loadApplications(authRole, jurisdiction);
    }
  }, [authUser, authRole, authLoading, navigate, applications.length, loadApplications, jurisdiction]);

  // Loading state while verifying credentials on boot
  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3.5px solid #E2E8F0', borderTopColor: '#DC2626', borderRadius: '50%', margin: '0 auto 1.25rem' }} />
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>Loading Jankalyan Administrative Portal...</div>
          <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.35rem' }}>Verifying security credentials...</div>
        </div>
      </div>
    );
  }

  // Indian States master list
  const allStates = useMemo(() => getAllStates(), []);

  // Application Filters (State > District > Block cascading)
  const [selectedState, setSelectedState] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedBlock, setSelectedBlock] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [tableSearch, setTableSearch] = useState('');

  // Verification Queue State (State > District > Block cascading)
  const [verificationFilter, setVerificationFilter] = useState('all'); // 'all' | 'pending' | 'correction' | 'approved' | 'rejected'
  const [verificationSearch, setVerificationSearch] = useState('');
  const [verificationState, setVerificationState] = useState('All');
  const [verificationDistrict, setVerificationDistrict] = useState('All');
  const [verificationBlock, setVerificationBlock] = useState('All');

  // Scrutiny & View Modals
  const [activeModalApp, setActiveModalApp] = useState(null);
  const [activeViewApp, setActiveViewApp] = useState(null);

  // Live MIS Summary
  const [misSummary, setMisSummary] = useState(null);

  // Beneficiary Bank Records & Manual Transfer state (State > District > Block cascading)
  const [beneficiarySearch, setBeneficiarySearch] = useState('');
  const [beneficiaryState, setBeneficiaryState] = useState('All');
  const [beneficiaryDistrict, setBeneficiaryDistrict] = useState('All');
  const [beneficiaryBlock, setBeneficiaryBlock] = useState('All');
  const [beneficiaryFilterStatus, setBeneficiaryFilterStatus] = useState('all');

  // Matrix State Selector
  const [matrixState, setMatrixState] = useState('Madhya Pradesh');
  const [copyFeedback, setCopyFeedback] = useState({});
  const [markingTransferredApp, setMarkingTransferredApp] = useState(null);
  const [transferModalForm, setTransferModalForm] = useState({
    paymentDate: new Date().toISOString().split('T')[0],
    utrNumber: '',
    disbursingBank: 'State Bank of India',
    remarks: 'Manually transferred via Net Banking'
  });

  // Commissions & Coordinator state
  const [commissionRates, setCommissionRates] = useState([]);
  const [commissionsList, setCommissionsList] = useState([]);
  const [coordinatorsList, setCoordinatorsList] = useState([]);
  const [commissionSubTab, setCommissionSubTab] = useState('ledger'); // 'ledger' | 'coordinators' | 'slabs'
  const [coordinatorRoleFilter, setCoordinatorRoleFilter] = useState('ALL');
  const [isAddCoordinatorOpen, setIsAddCoordinatorOpen] = useState(false);
  const [isSubmittingCoordinator, setIsSubmittingCoordinator] = useState(false);
  const [newCoordinatorForm, setNewCoordinatorForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    role: 'DISTRICT_COORDINATOR',
    district: 'Jabalpur',
    block: '',
    tehsil: '',
    gramPanchayat: '',
    institution: '',
    centerName: '',
    minTarget: 1000,
    rateAmount: 50
  });
  const [isGiveCommissionOpen, setIsGiveCommissionOpen] = useState(false);
  const [isSubmittingCommission, setIsSubmittingCommission] = useState(false);
  const [manualCommissionForm, setManualCommissionForm] = useState({
    coordinatorId: '',
    role: 'DISTRICT_COORDINATOR',
    applicationCount: 1,
    amount: 50,
    applicationId: '',
    status: 'PAID',
    utrNumber: '',
    remarks: 'Field verification incentive for Session 2026-27'
  });

  // CMS Form State
  const [cmsForm, setCmsForm] = useState({ ...cms });
  const [cmsSaveAlert, setCmsSaveAlert] = useState(false);
  const [isSavingCMS, setIsSavingCMS] = useState(false);
  const [heroSlides, setHeroSlides] = useState(cms.heroSlides || []);
  const [noticesList, setNoticesList] = useState(cms.notices || []);
  const [editingNotice, setEditingNotice] = useState(null);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
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
    commissionService.getCoordinators().then(setCoordinatorsList);
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

  const [cmsSyncedInitial, setCmsSyncedInitial] = useState(false);

  // Keep cmsForm synced on initial load without clobbering active edits
  useEffect(() => {
    if (!cmsSyncedInitial && cms && (cms.scholarshipAmount || cms.applicationStartDate)) {
      setCmsForm(prev => ({ ...prev, ...cms }));
      if (cms.heroSlides && cms.heroSlides.length > 0) {
        setHeroSlides(cms.heroSlides);
      }
      setCmsSyncedInitial(true);
    }
  }, [cms, cmsSyncedInitial]);

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

  // Dynamic cascading options for Main Application Filters
  const availableDistricts = useMemo(() => {
    if (selectedState !== 'All') {
      return getDistrictsByState(selectedState);
    }
    const distSet = new Set(roleScopedApplications.map(a => a.district).filter(Boolean));
    ['Jabalpur', 'Bhopal', 'Indore', 'Gwalior', 'Rewa', 'Mandla'].forEach(d => distSet.add(d));
    return Array.from(distSet).sort();
  }, [selectedState, roleScopedApplications]);

  const availableBlocks = useMemo(() => {
    if (selectedDistrict === 'All') return [];
    return getBlocksByDistrict(selectedState !== 'All' ? selectedState : null, selectedDistrict);
  }, [selectedState, selectedDistrict]);

  // Filtered Applications (Search + Status + Category + State > District > Block cascading)
  const filteredApplications = roleScopedApplications.filter(app => {
    const matchesState = selectedState === 'All' || (app.state && app.state.toLowerCase() === selectedState.toLowerCase());
    const matchesDistrict = selectedDistrict === 'All' || (app.district && app.district.toLowerCase() === selectedDistrict.toLowerCase());
    const matchesBlock = selectedBlock === 'All' || (app.block && app.block.toLowerCase() === selectedBlock.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || app.status === selectedStatus;
    const searchTarget = (tableSearch || globalSearch).toLowerCase();
    const matchesSearch = !searchTarget || 
      app.id.toLowerCase().includes(searchTarget) || 
      app.studentName.toLowerCase().includes(searchTarget) ||
      app.institution.toLowerCase().includes(searchTarget) ||
      app.mobile.includes(searchTarget);
    return matchesState && matchesDistrict && matchesBlock && matchesCategory && matchesStatus && matchesSearch;
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

  // Verification Queue cascading options
  const verificationAvailableDistricts = useMemo(() => {
    if (verificationState !== 'All') {
      return getDistrictsByState(verificationState);
    }
    const distSet = new Set(roleScopedApplications.map(a => a.district).filter(Boolean));
    return Array.from(distSet).sort();
  }, [verificationState, roleScopedApplications]);

  const verificationAvailableBlocks = useMemo(() => {
    if (verificationDistrict === 'All') return [];
    return getBlocksByDistrict(verificationState !== 'All' ? verificationState : null, verificationDistrict);
  }, [verificationState, verificationDistrict]);

  const verificationQueueApplications = roleScopedApplications.filter(app => {
    // 1. State filter
    if (verificationState !== 'All' && (app.state || '').toLowerCase() !== verificationState.toLowerCase()) {
      return false;
    }
    // 2. District filter
    if (verificationDistrict !== 'All' && (app.district || '').toLowerCase() !== verificationDistrict.toLowerCase()) {
      return false;
    }
    // 3. Block filter
    if (verificationBlock !== 'All' && (app.block || '').toLowerCase() !== verificationBlock.toLowerCase()) {
      return false;
    }

    // 4. Search filter
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
    setIsSavingCMS(true);
    try {
      await updateCMS({
        ...cmsForm,
        heroSlides
      });
      cmsService.clearCmsCache();
      if (refreshCMS) await refreshCMS(true);
      setCmsSaveAlert(true);
      setTimeout(() => setCmsSaveAlert(false), 5000);
      alert('✓ CMS updates successfully published to database!\nAll changes are now live on the public website.');
    } catch (err) {
      console.error('Failed to save CMS changes:', err);
      alert('Failed to save CMS changes: ' + (err.message || err));
    } finally {
      setIsSavingCMS(false);
    }
  };

  // Notice Board CRUD Operations
  const handleOpenAddNotice = () => {
    setEditingNotice({
      id: '',
      title_en: '',
      title_hi: '',
      content_en: '',
      content_hi: '',
      category_en: 'Guidelines',
      category_hi: 'दिशानिर्देश',
      publish_date: new Date().toISOString().split('T')[0],
      priority: 'HIGH',
      is_pinned: false,
      is_published: true
    });
    setIsNoticeModalOpen(true);
  };

  const handleOpenEditNotice = (notice) => {
    setEditingNotice({
      id: notice.id,
      title_en: notice.title_en || notice.titleEn || '',
      title_hi: notice.title_hi || notice.titleHi || '',
      content_en: notice.content_en || notice.contentEn || '',
      content_hi: notice.content_hi || notice.contentHi || '',
      category_en: notice.category_en || notice.categoryEn || 'General',
      category_hi: notice.category_hi || notice.categoryHi || 'सामान्य',
      publish_date: notice.publish_date || notice.date || new Date().toISOString().split('T')[0],
      priority: notice.priority || 'NORMAL',
      is_pinned: notice.is_pinned ?? notice.isPinned ?? false,
      is_published: notice.is_published ?? notice.isPublished ?? true
    });
    setIsNoticeModalOpen(true);
  };

  const handleSaveNotice = async (e) => {
    e?.preventDefault();
    if (!editingNotice.title_en || !editingNotice.title_hi) {
      alert('Please enter both English and Hindi titles for the notice.');
      return;
    }
    try {
      if (editingNotice.id) {
        await cmsService.updateNotice(editingNotice.id, editingNotice);
      } else {
        await cmsService.createNotice(editingNotice);
      }
      cmsService.clearCmsCache();
      const refreshed = await cmsService.getNotices();
      setNoticesList(refreshed);
      if (refreshCMS) await refreshCMS(true);
      setIsNoticeModalOpen(false);
      setEditingNotice(null);
      alert('Notice saved successfully! Public Notice Board updated.');
    } catch (err) {
      alert('Failed to save notice: ' + err.message);
    }
  };

  const handleDeleteNotice = async (noticeId) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      await cmsService.deleteNotice(noticeId);
      cmsService.clearCmsCache();
      const refreshed = await cmsService.getNotices();
      setNoticesList(refreshed);
      if (refreshCMS) await refreshCMS(true);
      alert('Notice deleted successfully.');
    } catch (err) {
      alert('Failed to delete notice: ' + err.message);
    }
  };

  const handleTogglePinNotice = async (notice) => {
    try {
      const newPinned = !(notice.is_pinned ?? notice.isPinned);
      await cmsService.updateNotice(notice.id, { is_pinned: newPinned });
      cmsService.clearCmsCache();
      const refreshed = await cmsService.getNotices();
      setNoticesList(refreshed);
      if (refreshCMS) await refreshCMS(true);
    } catch (err) {
      alert('Failed to toggle pin: ' + err.message);
    }
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

  // Beneficiary cascading options
  const beneficiaryAvailableDistricts = useMemo(() => {
    if (beneficiaryState !== 'All') {
      return getDistrictsByState(beneficiaryState);
    }
    const distSet = new Set(roleScopedApplications.map(a => a.district).filter(Boolean));
    return Array.from(distSet).sort();
  }, [beneficiaryState, roleScopedApplications]);

  const beneficiaryAvailableBlocks = useMemo(() => {
    if (beneficiaryDistrict === 'All') return [];
    return getBlocksByDistrict(beneficiaryState !== 'All' ? beneficiaryState : null, beneficiaryDistrict);
  }, [beneficiaryState, beneficiaryDistrict]);

  const filteredBeneficiaries = approvedBeneficiaries.filter(a => {
    if (beneficiaryState !== 'All' && (a.state || '').toLowerCase() !== beneficiaryState.toLowerCase()) {
      return false;
    }
    if (beneficiaryDistrict !== 'All' && (a.district || '').toLowerCase() !== beneficiaryDistrict.toLowerCase()) {
      return false;
    }
    if (beneficiaryBlock !== 'All' && (a.block || '').toLowerCase() !== beneficiaryBlock.toLowerCase()) {
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

  // Open modal to mark a student's manual transfer / installment payout as done
  const handleOpenMarkTransferred = (app) => {
    setMarkingTransferredApp(app);
    const sanctioned = app.sanctionedAmount || 12000;
    const paidSoFar = app.rawDisbursedAmount || 0;
    const remaining = app.rawRemainingAmount !== undefined ? app.rawRemainingAmount : Math.max(0, sanctioned - paidSoFar);

    setTransferModalForm({
      installmentAmount: remaining > 0 ? remaining : sanctioned,
      paymentDate: new Date().toISOString().split('T')[0],
      utrNumber: '',
      disbursingBank: 'State Bank of India - Trust A/c',
      remarks: paidSoFar > 0 
        ? `Installment payout (Remaining balance: ₹${remaining.toLocaleString('en-IN')}) via DBT/NEFT` 
        : 'Scholarship grant disbursement via DBT/NEFT'
    });
  };

  // Save manual offline transfer / installment record
  const handleConfirmManualTransfer = async () => {
    if (!markingTransferredApp) return;
    try {
      const sanctioned = markingTransferredApp.sanctionedAmount || 12000;
      const currentPaid = markingTransferredApp.rawDisbursedAmount || 0;
      const installment = parseFloat(transferModalForm.installmentAmount) || Math.max(0, sanctioned - currentPaid);

      if (installment <= 0) {
        alert('Please enter a valid installment amount greater than 0.');
        return;
      }

      const newTotalPaid = currentPaid + installment;
      const newRemaining = Math.max(0, sanctioned - newTotalPaid);
      const isFullPayout = newRemaining <= 0;
      const nextStatus = isFullPayout ? 'Scholarship Released' : 'Partially Disbursed';

      const utr = transferModalForm.utrNumber.trim() || `JMFDBT${Date.now()}`;
      const remarks = `${transferModalForm.remarks} (Bank: ${transferModalForm.disbursingBank}, Paid: ₹${installment.toLocaleString('en-IN')}, Remaining: ₹${newRemaining.toLocaleString('en-IN')})`;

      // 1. Insert row into payments table
      try {
        await supabase.from('payments').insert({
          application_id: markingTransferredApp.id,
          student_id: markingTransferredApp.studentId || markingTransferredApp.id,
          amount: installment,
          bank_account_masked: markingTransferredApp.accountNumber,
          ifsc_code: markingTransferredApp.ifsc,
          payment_method: 'DBT_NEFT',
          status: 'SUCCESS',
          utr_number: utr,
          transaction_reference: transferModalForm.disbursingBank,
          payment_date: transferModalForm.paymentDate
        });
      } catch (pErr) {
        console.warn('Payment record insert note:', pErr);
      }

      // 2. Update application status and disbursed_amount
      await supabase
        .from('applications')
        .update({
          disbursed_amount: newTotalPaid,
          status: isFullPayout ? 'SCHOLARSHIP_RELEASED' : 'PARTIALLY_DISBURSED',
          stage: isFullPayout ? 5 : 4,
          payment_date: transferModalForm.paymentDate,
          utr_number: utr,
          updated_at: new Date().toISOString()
        })
        .eq('id', markingTransferredApp.id);

      // 3. Log history
      try {
        const { error: histErr } = await supabase.from('application_status_history').insert({
          application_id: markingTransferredApp.id,
          previous_status: markingTransferredApp.rawStatus || markingTransferredApp.status,
          new_status: isFullPayout ? 'SCHOLARSHIP_RELEASED' : 'PARTIALLY_DISBURSED',
          actor_id: authUser?.id && authUser.id.length === 36 ? authUser.id : null,
          actor_role: authRole,
          remarks
        });
        if (histErr) console.warn('Status history note:', histErr);
      } catch (e) {
        console.warn('Status history note:', e);
      }

      // 4. Issue official scholarship award certificate for each installment
      try {
        const existingCerts = await certificateService.getCertificatesByAppId(markingTransferredApp.id);
        const installmentNumber = (existingCerts?.length || 0) + 1;

        await certificateService.issueCertificate({
          applicationId: markingTransferredApp.id,
          studentName: markingTransferredApp.studentName,
          schemeName: `Jankalyan Manavadhikar Foundation Scholarship Scheme 2026-27 (Installment #${installmentNumber})`,
          grantAmount: installment,
          installmentNumber,
          utrNumber: utr,
          paymentDate: transferModalForm.paymentDate
        });
      } catch (cErr) {
        console.warn('Certificate issuance note:', cErr);
      }

      // 5. Automated Stage Notification Dispatch to Student Email & In-App Center
      try {
        await notificationService.sendStageStatusEmail({
          applicationId: markingTransferredApp.id,
          studentEmail: markingTransferredApp.email || `student_${markingTransferredApp.id}@jankalyan.org`,
          studentName: markingTransferredApp.studentName,
          stage: 5,
          status: isFullPayout ? 'SCHOLARSHIP_RELEASED' : 'PARTIALLY_DISBURSED',
          remarks: `${transferModalForm.remarks || 'DBT Transfer executed'}. Paid: ₹${installment.toLocaleString('en-IN')}, Remaining: ₹${newRemaining.toLocaleString('en-IN')}`,
          utrNumber: utr,
          amount: installment,
          remainingAmount: newRemaining,
          userId: markingTransferredApp.studentId
        });
      } catch (mailErr) {
        console.warn('Payment confirmation email dispatch note:', mailErr?.message);
      }

      alert(`✓ DBT Payment recorded for ${markingTransferredApp.studentName}!\nPaid Installment: ₹${installment.toLocaleString('en-IN')}\nTotal Disbursed: ₹${newTotalPaid.toLocaleString('en-IN')}\nRemaining Balance: ₹${newRemaining.toLocaleString('en-IN')}\nStatus: ${nextStatus}`);
      setMarkingTransferredApp(null);
      await loadApplications(authRole, jurisdiction);
    } catch (err) {
      alert('Failed to record transfer: ' + err.message);
    }
  };

  // Register new coordinator
  const handleCreateCoordinator = async (e) => {
    e.preventDefault();
    if (!newCoordinatorForm.fullName || !newCoordinatorForm.mobile) {
      alert('Please enter coordinator full name and mobile number.');
      return;
    }
    setIsSubmittingCoordinator(true);
    try {
      const created = await commissionService.createCoordinator(newCoordinatorForm);
      const updated = await commissionService.getCoordinators();
      setCoordinatorsList(updated);
      setIsAddCoordinatorOpen(false);
      setNewCoordinatorForm({
        fullName: '',
        email: '',
        mobile: '',
        role: 'DISTRICT_COORDINATOR',
        district: 'Jabalpur',
        block: '',
        tehsil: '',
        gramPanchayat: '',
        institution: '',
        centerName: '',
        minTarget: 1000,
        rateAmount: 50
      });
      alert(`✓ Coordinator "${created.fullName}" registered successfully!`);
    } catch (err) {
      alert('Failed to register coordinator: ' + (err.message || 'Error'));
    } finally {
      setIsSubmittingCoordinator(false);
    }
  };

  // Manually grant commission
  const handleGiveCommission = async (e) => {
    e.preventDefault();
    const coordId = manualCommissionForm.coordinatorId || coordinatorsList[0]?.id;
    if (!coordId) {
      alert('Please select a coordinator.');
      return;
    }
    const cleanAmt = parseFloat(manualCommissionForm.amount);
    if (!cleanAmt || isNaN(cleanAmt) || cleanAmt <= 0) {
      alert('Please enter a valid commission amount.');
      return;
    }

    setIsSubmittingCommission(true);
    try {
      const coord = coordinatorsList.find(c => c.id === coordId);
      const chosenRole = coord?.role || manualCommissionForm.role || 'DISTRICT_COORDINATOR';

      await commissionService.addManualCommission({
        beneficiaryUserId: coordId,
        beneficiaryRole: chosenRole,
        applicationId: manualCommissionForm.applicationId || null,
        amount: cleanAmt,
        status: manualCommissionForm.status || 'PAID',
        approvedBy: authUser?.id && authUser.id.length === 36 ? authUser.id : null,
        remarks: manualCommissionForm.remarks,
        utrNumber: manualCommissionForm.utrNumber,
        coordinatorName: coord?.fullName || 'Field Coordinator'
      });

      const updatedComms = await commissionService.getCommissions();
      setCommissionsList(updatedComms);
      setIsGiveCommissionOpen(false);
      alert(`✓ Commission of ₹${cleanAmt.toLocaleString('en-IN')} recorded for "${coord?.fullName || 'Coordinator'}" successfully!`);
    } catch (err) {
      alert('Failed to grant commission: ' + (err.message || 'Error'));
    } finally {
      setIsSubmittingCommission(false);
    }
  };

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
      
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
      <div className="admin-main-canvas" style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', minWidth: 0, maxWidth: '100%', overflowX: 'hidden' }}>
        
        {/* Top Navigation */}
        <AdminTopNav 
          user={authUser}
          role={authRole}
          setRole={(newRole) => switchRole(newRole)}
          jurisdiction={jurisdiction}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onExitPublic={() => navigate('/')}
          onLogout={logout}
          onSearchChange={setGlobalSearch}
          searchValue={globalSearch}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          readyCount={readyBeneficiariesCount}
        />

        {/* Content Body */}
        <main className="admin-main-content">
          
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
                      (() => {
                        const distCounts = {};
                        roleScopedApplications.forEach(a => {
                          const d = a.district || 'Unassigned';
                          distCounts[d] = (distCounts[d] || 0) + 1;
                        });
                        const colors = ['#1E40AF', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];
                        const sortedDists = Object.entries(distCounts)
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 6)
                          .map(([district, count], idx) => ({ district, count, color: colors[idx % colors.length] }));
                        
                        return sortedDists.map(item => {
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
                        });
                      })()
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
                      : 'Official applicant master database: view student details, fee reconciliation ledger (Razorpay), printable forms, and CSV data export'}
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

                  {/* Level 1: State Filter */}
                  <div style={{ minWidth: '150px' }}>
                    <select 
                      className="form-control"
                      value={selectedState}
                      onChange={(e) => {
                        setSelectedState(e.target.value);
                        setSelectedDistrict('All');
                        setSelectedBlock('All');
                      }}
                      title="Step 1: State Filter"
                      style={{ fontWeight: 600 }}
                    >
                      <option value="All">All States (समस्त राज्य)</option>
                      {allStates.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  {/* Level 2: District Filter */}
                  <div style={{ minWidth: '140px' }}>
                    <select 
                      className="form-control"
                      value={selectedDistrict}
                      onChange={(e) => {
                        setSelectedDistrict(e.target.value);
                        setSelectedBlock('All');
                      }}
                      title="Step 2: District Filter"
                    >
                      <option value="All">All Districts (समस्त जिले)</option>
                      {availableDistricts.map(dist => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>

                  {/* Level 3: Block Filter */}
                  <div style={{ minWidth: '140px' }}>
                    <select 
                      className="form-control"
                      value={selectedBlock}
                      onChange={(e) => setSelectedBlock(e.target.value)}
                      title="Step 3: Block Filter"
                      disabled={selectedDistrict === 'All'}
                    >
                      <option value="All">All Blocks (समस्त ब्लॉक)</option>
                      {availableBlocks.map(blk => (
                        <option key={blk} value={blk}>{blk}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ minWidth: '120px' }}>
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

                  <div style={{ minWidth: '160px' }}>
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
                    onClick={() => { 
                      setSelectedState('All'); 
                      setSelectedDistrict('All'); 
                      setSelectedBlock('All'); 
                      setSelectedCategory('All'); 
                      setSelectedStatus('All'); 
                      setTableSearch(''); 
                    }}
                    title="Reset all filters"
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
                      <th>Reg. Fee</th>
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
                              {app.registrationFeeStatus === 'PAID' ? `✓ PAID ₹${Number(app.registrationFeeAmount || 211.30).toFixed(2)}` : 'PENDING'}
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
                            {((app.rawRemainingAmount === undefined || app.rawRemainingAmount > 0) && app.status !== 'Scholarship Released' && app.rawStatus !== 'SCHOLARSHIP_RELEASED') ? (
                              <button 
                                className="btn btn-primary btn-sm" 
                                onClick={() => handleOpenMarkTransferred(app)}
                                title="Disburse scholarship grant or installment"
                                style={{ 
                                  padding: '0.3rem 0.6rem', 
                                  fontSize: '0.75rem', 
                                  backgroundColor: (app.rawDisbursedAmount || 0) > 0 ? '#D97706' : '#2563EB', 
                                  borderColor: (app.rawDisbursedAmount || 0) > 0 ? '#D97706' : '#2563EB', 
                                  color: '#FFFFFF',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem'
                                }}
                              >
                                <CreditCard size={12} />
                                <span>{(app.rawDisbursedAmount || 0) > 0 ? 'Pay Installment' : 'Disburse / Installment'}</span>
                              </button>
                            ) : (
                              <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>
                                ✓ Fully Disbursed
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

                  {/* Level 1: State Filter */}
                  <div style={{ minWidth: '150px' }}>
                    <select 
                      className="form-control"
                      value={verificationState}
                      onChange={(e) => {
                        setVerificationState(e.target.value);
                        setVerificationDistrict('All');
                        setVerificationBlock('All');
                      }}
                      title="Step 1: Filter by State"
                    >
                      <option value="All">All States (समस्त राज्य)</option>
                      {allStates.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  {/* Level 2: District Filter */}
                  <div style={{ minWidth: '140px' }}>
                    <select 
                      className="form-control"
                      value={verificationDistrict}
                      onChange={(e) => {
                        setVerificationDistrict(e.target.value);
                        setVerificationBlock('All');
                      }}
                      title="Step 2: Filter by District"
                    >
                      <option value="All">All Districts (समस्त जिले)</option>
                      {verificationAvailableDistricts.map(dist => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>

                  {/* Level 3: Block Filter */}
                  <div style={{ minWidth: '140px' }}>
                    <select 
                      className="form-control"
                      value={verificationBlock}
                      onChange={(e) => setVerificationBlock(e.target.value)}
                      title="Step 3: Filter by Block"
                      disabled={verificationDistrict === 'All'}
                    >
                      <option value="All">All Blocks (समस्त ब्लॉक)</option>
                      {verificationAvailableBlocks.map(blk => (
                        <option key={blk} value={blk}>{blk}</option>
                      ))}
                    </select>
                  </div>

                  {(verificationSearch || verificationState !== 'All' || verificationDistrict !== 'All' || verificationBlock !== 'All' || verificationFilter !== 'all') && (
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => { 
                        setVerificationFilter('all'); 
                        setVerificationSearch(''); 
                        setVerificationState('All');
                        setVerificationDistrict('All'); 
                        setVerificationBlock('All');
                      }}
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

                    {/* Beneficiary State > District > Block cascading */}
                    <select 
                      className="form-control" 
                      style={{ width: 'auto', minWidth: '150px' }}
                      value={beneficiaryState}
                      onChange={(e) => {
                        setBeneficiaryState(e.target.value);
                        setBeneficiaryDistrict('All');
                        setBeneficiaryBlock('All');
                      }}
                      title="Step 1: State Filter"
                    >
                      <option value="All">All States (समस्त राज्य)</option>
                      {allStates.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>

                    <select 
                      className="form-control" 
                      style={{ width: 'auto', minWidth: '140px' }}
                      value={beneficiaryDistrict}
                      onChange={(e) => {
                        setBeneficiaryDistrict(e.target.value);
                        setBeneficiaryBlock('All');
                      }}
                      title="Step 2: District Filter"
                    >
                      <option value="All">All Districts (समस्त जिले)</option>
                      {beneficiaryAvailableDistricts.map(dist => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>

                    <select 
                      className="form-control" 
                      style={{ width: 'auto', minWidth: '130px' }}
                      value={beneficiaryBlock}
                      onChange={(e) => setBeneficiaryBlock(e.target.value)}
                      title="Step 3: Block Filter"
                      disabled={beneficiaryDistrict === 'All'}
                    >
                      <option value="All">All Blocks (समस्त ब्लॉक)</option>
                      {beneficiaryAvailableBlocks.map(blk => (
                        <option key={blk} value={blk}>{blk}</option>
                      ))}
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
                        <th>Disbursed (Paid)</th>
                        <th>Remaining Balance</th>
                        <th>Bank Account Details</th>
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
                            <div style={{ fontWeight: 800, color: '#1E40AF', fontSize: '1rem' }}>
                              {b.sanctionedAmountFormatted || `₹${(b.sanctionedAmount || 12000).toLocaleString('en-IN')}`}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#64748B' }}>Total Sanctioned</div>
                          </td>

                          <td>
                            <div style={{ fontWeight: 800, color: '#16A34A', fontSize: '1rem' }}>
                              {b.disbursedAmount || `₹${(b.rawDisbursedAmount || 0).toLocaleString('en-IN')}`}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#64748B' }}>
                              {(b.paymentsList && b.paymentsList.length > 0) ? `${b.paymentsList.length} Installment(s)` : 'Disbursed To Date'}
                            </div>
                          </td>

                          <td>
                            <div style={{ fontWeight: 800, color: (b.rawRemainingAmount ?? 0) > 0 ? '#D97706' : '#16A34A', fontSize: '1rem' }}>
                              {b.remainingAmount ?? `₹${Math.max(0, (b.sanctionedAmount || 12000) - (b.rawDisbursedAmount || 0)).toLocaleString('en-IN')}`}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: (b.rawRemainingAmount ?? 0) > 0 ? '#B45309' : '#15803D', fontWeight: 600 }}>
                              {(b.rawRemainingAmount ?? 0) > 0 ? 'Pending Balance' : 'Settled In Full ✓'}
                            </div>
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
                            {(b.status === 'Scholarship Released' || b.rawStatus === 'SCHOLARSHIP_RELEASED' || (b.rawRemainingAmount !== undefined && b.rawRemainingAmount <= 0)) ? (
                              <div>
                                <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>✓ Fully Released</span>
                                {b.utrNumber && b.utrNumber !== '-' && (
                                  <div style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#15803D', marginTop: '2px' }}>
                                    Ref: {b.utrNumber}
                                  </div>
                                )}
                              </div>
                            ) : (b.rawDisbursedAmount || 0) > 0 ? (
                              <div>
                                <span className="badge badge-yellow" style={{ fontSize: '0.75rem' }}>Partially Paid</span>
                                <div style={{ fontSize: '0.68rem', color: '#B45309', marginTop: '2px', fontWeight: 600 }}>
                                  Bal: {b.remainingAmount || `₹${Math.max(0, (b.sanctionedAmount || 12000) - (b.rawDisbursedAmount || 0)).toLocaleString('en-IN')}`}
                                </div>
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
                              {((b.rawRemainingAmount === undefined || b.rawRemainingAmount > 0) && b.status !== 'Scholarship Released' && b.rawStatus !== 'SCHOLARSHIP_RELEASED') ? (
                                <button 
                                  className="btn btn-secondary btn-sm" 
                                  onClick={() => handleOpenMarkTransferred(b)}
                                  title="Disburse scholarship grant or installment"
                                  style={{ 
                                    padding: '0.3rem 0.55rem', 
                                    fontSize: '0.75rem',
                                    backgroundColor: (b.rawDisbursedAmount || 0) > 0 ? '#D97706' : '#1E40AF',
                                    borderColor: (b.rawDisbursedAmount || 0) > 0 ? '#D97706' : '#1E40AF',
                                    color: '#FFFFFF',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem'
                                  }}
                                >
                                  <CreditCard size={12} />
                                  <span>{(b.rawDisbursedAmount || 0) > 0 ? 'Pay Next Installment' : 'Disburse / Pay in Installments'}</span>
                                </button>
                              ) : (
                                <span style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                                  <CheckCircle2 size={13} color="#16A34A" /> Fully Paid
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

                <button className="btn btn-primary" onClick={handleSaveCMS} disabled={isSavingCMS}>
                  {isSavingCMS ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  <span>{isSavingCMS ? 'Saving CMS Content...' : 'Save CMS Content to Database'}</span>
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
                        <div>
                          <label className="form-label">English Eyebrow / Tagline</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="e.g. Empowering Tomorrow, Today"
                            value={slide.eyebrow_en || ''} 
                            onChange={(e) => {
                              const updated = [...heroSlides];
                              updated[idx].eyebrow_en = e.target.value;
                              setHeroSlides(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="form-label">Hindi Eyebrow / Tagline (हिंदी)</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="जैसे: उज्ज्वल भविष्य, आज से"
                            value={slide.eyebrow_hi || ''} 
                            onChange={(e) => {
                              const updated = [...heroSlides];
                              updated[idx].eyebrow_hi = e.target.value;
                              setHeroSlides(updated);
                            }}
                          />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <label className="form-label">Slide Subtitle / Description (English)</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={slide.description_en || ''} 
                            onChange={(e) => {
                              const updated = [...heroSlides];
                              updated[idx].description_en = e.target.value;
                              setHeroSlides(updated);
                            }}
                          />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <label className="form-label">Slide Subtitle / Description (हिंदी)</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={slide.description_hi || ''} 
                            onChange={(e) => {
                              const updated = [...heroSlides];
                              updated[idx].description_hi = e.target.value;
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
                          if (!arr[0]) arr[0] = { id: 'f0000000-0000-0000-0000-000000000001', en: '', hi: '' };
                          arr[0] = { ...arr[0], en: e.target.value };
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
                          if (!arr[0]) arr[0] = { id: 'f0000000-0000-0000-0000-000000000001', en: '', hi: '' };
                          arr[0] = { ...arr[0], hi: e.target.value };
                          setCmsForm({ ...cmsForm, announcements: arr });
                        }}
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ marginBottom: '2.5rem' }} disabled={isSavingCMS}>
                  {isSavingCMS ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  <span>{isSavingCMS ? 'Saving CMS Content...' : 'Save CMS Content to Database'}</span>
                </button>

              </form>

              {/* 5. Official Notice Board Manager */}
              <div className="card" style={{ padding: '1.75rem', marginTop: '1.5rem', borderTop: '4px solid #1E40AF' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Bell size={20} color="#1E40AF" />
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        5. Official Notice Board Manager
                      </h3>
                      <span className="badge badge-blue">{noticesList.length} Notices</span>
                    </div>
                    <p style={{ color: '#64748B', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
                      Publish official guidelines, DBT payout schedules, circulars, and announcements directly to the public Notice Board.
                    </p>
                  </div>

                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={handleOpenAddNotice}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                  >
                    <Plus size={16} />
                    <span>Create Official Notice</span>
                  </button>
                </div>

                {/* Notices List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {noticesList.map(notice => {
                    const isPinned = notice.is_pinned ?? notice.isPinned ?? false;
                    const priority = notice.priority || 'NORMAL';

                    return (
                      <div 
                        key={notice.id} 
                        style={{ 
                          backgroundColor: isPinned ? '#FEFCE8' : '#F8FAFC', 
                          border: `1.5px solid ${isPinned ? '#FDE047' : '#E2E8F0'}`, 
                          borderRadius: '12px', 
                          padding: '1.25rem',
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '1rem',
                          flexWrap: 'wrap'
                        }}
                      >
                        <div style={{ flex: 1, minWidth: '280px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                            {isPinned && (
                              <span className="badge badge-yellow" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                <Pin size={11} /> PINNED NOTICE
                              </span>
                            )}
                            <span className={`badge ${priority === 'HIGH' ? 'badge-red' : priority === 'MEDIUM' ? 'badge-yellow' : 'badge-navy'}`}>
                              {priority} PRIORITY
                            </span>
                            <span className="badge badge-blue">
                              {notice.category_en || notice.categoryEn || 'General'}
                            </span>
                            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                              Ref: {notice.id} • Date: {notice.publish_date || notice.date || '-'}
                            </span>
                          </div>

                          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0' }}>
                            {notice.title_en || notice.titleEn}
                          </h4>
                          <div style={{ fontSize: '0.92rem', color: '#1E3A8A', fontWeight: 700, marginBottom: '0.4rem' }}>
                            {notice.title_hi || notice.titleHi}
                          </div>

                          <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                            {notice.content_en || notice.contentEn}
                          </p>
                          {notice.content_hi && (
                            <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0.3rem 0 0 0', lineHeight: 1.5 }}>
                              {notice.content_hi || notice.contentHi}
                            </p>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
                          <button
                            type="button"
                            className={`btn btn-sm ${isPinned ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => handleTogglePinNotice(notice)}
                            title={isPinned ? "Unpin notice from top" : "Pin notice to top of public board"}
                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                          >
                            <Pin size={13} />
                            <span>{isPinned ? 'Pinned' : 'Pin'}</span>
                          </button>

                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => handleOpenEditNotice(notice)}
                            title="Edit notice details"
                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                          >
                            <Edit3 size={13} />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleDeleteNotice(notice.id)}
                            title="Delete this notice"
                            style={{ padding: '0.4rem 0.6rem', color: '#DC2626' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notice Edit/Create Modal */}
              {isNoticeModalOpen && editingNotice && (
                <div style={{
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1200,
                  padding: '1rem',
                  overflowY: 'auto'
                }}>
                  <div 
                    className="animate-fade-in"
                    style={{
                      maxWidth: '620px',
                      width: '100%',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        {editingNotice.id ? `Edit Notice (${editingNotice.id})` : 'Create New Official Notice'}
                      </h3>
                      <button 
                        onClick={() => { setIsNoticeModalOpen(false); setEditingNotice(null); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <form onSubmit={handleSaveNotice} style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label required">Notice Title (English)</label>
                        <input 
                          type="text" 
                          required
                          className="form-control"
                          placeholder="e.g. Schedule of Scrutiny & Direct Benefit Transfer"
                          value={editingNotice.title_en}
                          onChange={(e) => setEditingNotice({ ...editingNotice, title_en: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label required">Notice Title (Hindi - हिंदी)</label>
                        <input 
                          type="text" 
                          required
                          className="form-control"
                          placeholder="e.g. संवीक्षा एवं प्रत्यक्ष लाभ अंतरण (DBT) समय-सारिणी"
                          value={editingNotice.title_hi}
                          onChange={(e) => setEditingNotice({ ...editingNotice, title_hi: e.target.value })}
                        />
                      </div>

                      <div className="form-row-2">
                        <div className="form-group">
                          <label className="form-label">Category (English)</label>
                          <input 
                            type="text" 
                            className="form-control"
                            placeholder="e.g. Guidelines, DBT, Scrutiny"
                            value={editingNotice.category_en}
                            onChange={(e) => setEditingNotice({ ...editingNotice, category_en: e.target.value })}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Category (Hindi)</label>
                          <input 
                            type="text" 
                            className="form-control"
                            placeholder="e.g. दिशानिर्देश, डीबीटी"
                            value={editingNotice.category_hi}
                            onChange={(e) => setEditingNotice({ ...editingNotice, category_hi: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="form-row-2">
                        <div className="form-group">
                          <label className="form-label required">Publish Date</label>
                          <input 
                            type="date" 
                            required
                            className="form-control"
                            value={editingNotice.publish_date}
                            onChange={(e) => setEditingNotice({ ...editingNotice, publish_date: e.target.value })}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Priority Level</label>
                          <select 
                            className="form-control"
                            value={editingNotice.priority}
                            onChange={(e) => setEditingNotice({ ...editingNotice, priority: e.target.value })}
                          >
                            <option value="HIGH">HIGH (Urgent Announcement)</option>
                            <option value="MEDIUM">MEDIUM (Standard Notice)</option>
                            <option value="NORMAL">NORMAL (Informational)</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Detailed Content (English)</label>
                        <textarea 
                          className="form-control"
                          rows="3"
                          placeholder="Detailed instructions or notice text in English..."
                          value={editingNotice.content_en}
                          onChange={(e) => setEditingNotice({ ...editingNotice, content_en: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Detailed Content (Hindi - हिंदी)</label>
                        <textarea 
                          className="form-control"
                          rows="3"
                          placeholder="विस्तृत दिशानिर्देश या सूचना का विवरण हिंदी में..."
                          value={editingNotice.content_hi}
                          onChange={(e) => setEditingNotice({ ...editingNotice, content_hi: e.target.value })}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '0.5rem 0' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
                          <input 
                            type="checkbox"
                            checked={editingNotice.is_pinned}
                            onChange={(e) => setEditingNotice({ ...editingNotice, is_pinned: e.target.checked })}
                          />
                          <span>Pin to Top of Notice Board (विशेष सूचना)</span>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
                          <input 
                            type="checkbox"
                            checked={editingNotice.is_published}
                            onChange={(e) => setEditingNotice({ ...editingNotice, is_published: e.target.checked })}
                          />
                          <span>Published (सार्वजनिक रूप से प्रदर्शित)</span>
                        </label>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <button 
                          type="button" 
                          className="btn btn-outline"
                          onClick={() => { setIsNoticeModalOpen(false); setEditingNotice(null); }}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                          <Save size={16} />
                          <span>{editingNotice.id ? 'Update Notice' : 'Publish Notice'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ====================================================================
              MODULE 6: COMMISSIONS & COORDINATOR MANAGEMENT
              ==================================================================== */}
          {activeTab === 'commissions' && (
            <div className="animate-fade-in">
              {/* Header with Quick Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span>Coordinators & Commission Management</span>
                    <span className="badge badge-navy" style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}>
                      Manual & Automated
                    </span>
                  </h2>
                  <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    Manage registered coordinators across District, Block, Institution, and CSC Centers, and manually grant commissions & incentives.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setIsAddCoordinatorOpen(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#0B2B82', borderColor: '#0B2B82' }}
                  >
                    <Plus size={16} />
                    <span>Add New Coordinator</span>
                  </button>

                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      const defaultCoord = coordinatorsList[0];
                      setManualCommissionForm({
                        coordinatorId: defaultCoord?.id || '',
                        role: defaultCoord?.role || 'DISTRICT_COORDINATOR',
                        amount: 100,
                        applicationId: '',
                        status: 'PAID',
                        utrNumber: `COMM-${Date.now().toString().slice(-6)}`,
                        remarks: 'Field verification incentive for Session 2026-27'
                      });
                      setIsGiveCommissionOpen(true);
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#16A34A', borderColor: '#16A34A', fontWeight: 700 }}
                  >
                    <Award size={16} />
                    <span>+ Give / Add Commission</span>
                  </button>
                </div>
              </div>

              {/* Subtab Navigation Pills */}
              <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
                <button 
                  className={`btn btn-sm ${commissionSubTab === 'ledger' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setCommissionSubTab('ledger')}
                  style={{ borderRadius: '20px', padding: '0.4rem 1.25rem' }}
                >
                  <span>Commission Ledger</span>
                  <span style={{ marginLeft: '6px', opacity: 0.85, fontSize: '0.75rem', backgroundColor: commissionSubTab === 'ledger' ? 'rgba(255,255,255,0.25)' : '#E2E8F0', padding: '1px 6px', borderRadius: '10px', color: commissionSubTab === 'ledger' ? '#FFFFFF' : '#334155' }}>
                    {commissionsList.length}
                  </span>
                </button>

                <button 
                  className={`btn btn-sm ${commissionSubTab === 'coordinators' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setCommissionSubTab('coordinators')}
                  style={{ borderRadius: '20px', padding: '0.4rem 1.25rem' }}
                >
                  <Users size={14} />
                  <span>Registered Coordinators</span>
                  <span style={{ marginLeft: '6px', opacity: 0.85, fontSize: '0.75rem', backgroundColor: commissionSubTab === 'coordinators' ? 'rgba(255,255,255,0.25)' : '#E2E8F0', padding: '1px 6px', borderRadius: '10px', color: commissionSubTab === 'coordinators' ? '#FFFFFF' : '#334155' }}>
                    {coordinatorsList.length}
                  </span>
                </button>

                <button 
                  className={`btn btn-sm ${commissionSubTab === 'slabs' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setCommissionSubTab('slabs')}
                  style={{ borderRadius: '20px', padding: '0.4rem 1.25rem' }}
                >
                  <Sliders size={14} />
                  <span>Configured Role Rates</span>
                  <span style={{ marginLeft: '6px', opacity: 0.85, fontSize: '0.75rem', backgroundColor: commissionSubTab === 'slabs' ? 'rgba(255,255,255,0.25)' : '#E2E8F0', padding: '1px 6px', borderRadius: '10px', color: commissionSubTab === 'slabs' ? '#FFFFFF' : '#334155' }}>
                    {commissionRates.length}
                  </span>
                </button>
              </div>

              {/* TAB 1: COMMISSION LEDGER */}
              {commissionSubTab === 'ledger' && (
                <div>
                  {/* Summary Metric Cards */}
                  <div className="grid-3" style={{ gap: '1rem', marginBottom: '1.75rem' }}>
                    <div className="metric-card" style={{ padding: '1.25rem' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                        Total Commissions Disbursed
                      </div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#16A34A', marginTop: '0.25rem' }}>
                        ₹{commissionsList.reduce((acc, c) => acc + (parseFloat(c.amount) || 0), 0).toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>
                        Across all field coordinators & centers
                      </div>
                    </div>

                    <div className="metric-card" style={{ padding: '1.25rem' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                        Total Payout Transactions
                      </div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1E40AF', marginTop: '0.25rem' }}>
                        {commissionsList.length}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#1E40AF', marginTop: '0.25rem' }}>
                        {commissionsList.filter(c => c.status === 'PAID' || c.status === 'APPROVED').length} Settled / Paid
                      </div>
                    </div>

                    <div className="metric-card" style={{ padding: '1.25rem' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                        Pending Approvals
                      </div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#D97706', marginTop: '0.25rem' }}>
                        {commissionsList.filter(c => c.status !== 'PAID' && c.status !== 'APPROVED').length}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#D97706', marginTop: '0.25rem' }}>
                        Awaiting administrator signoff
                      </div>
                    </div>
                  </div>

                  {/* Commissions Table */}
                  <div className="card" style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        Manual & Accrued Commission Records
                      </h3>
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={async () => {
                          const list = await commissionService.getCommissions();
                          setCommissionsList(list);
                        }}
                      >
                        <RefreshCw size={13} />
                        <span>Refresh Ledger</span>
                      </button>
                    </div>

                    <div className="data-table-container">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Coordinator / Beneficiary</th>
                            <th>Role</th>
                            <th>Application Reference</th>
                            <th>Commission Amount</th>
                            <th>Payout Status</th>
                            <th>Date & Record</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {commissionsList.map(c => (
                            <tr key={c.id}>
                              <td>
                                <div style={{ fontWeight: 800, color: '#0F172A' }}>
                                  {c.profiles?.full_name || 'Coordinator'}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                  {c.profiles?.mobile || c.profiles?.email || 'Field Staff'}
                                </div>
                              </td>
                              <td>
                                <span className="badge badge-navy" style={{ fontSize: '0.72rem' }}>
                                  {(c.beneficiary_role || '').replace('_', ' ')}
                                </span>
                              </td>
                              <td>
                                <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1E40AF' }}>
                                  {c.application_id || 'GENERAL'}
                                </div>
                                {c.applications?.institutions?.name && (
                                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                                    {c.applications.institutions.name}
                                  </div>
                                )}
                              </td>
                              <td>
                                <div style={{ fontWeight: 900, color: '#16A34A', fontSize: '1.1rem' }}>
                                  ₹{parseFloat(c.amount || 0).toLocaleString('en-IN')}
                                </div>
                              </td>
                              <td>
                                <span className={`badge ${c.status === 'PAID' || c.status === 'APPROVED' ? 'badge-green' : 'badge-yellow'}`}>
                                  {c.status === 'PAID' ? 'PAID ✓' : (c.status === 'APPROVED' ? 'APPROVED' : c.status)}
                                </span>
                              </td>
                              <td>
                                <div style={{ fontSize: '0.8rem', color: '#0F172A' }}>
                                  {c.created_at ? new Date(c.created_at).toLocaleDateString('en-IN') : '-'}
                                </div>
                                {c.approved_at && (
                                  <div style={{ fontSize: '0.7rem', color: '#16A34A' }}>
                                    Settled: {new Date(c.approved_at).toLocaleDateString('en-IN')}
                                  </div>
                                )}
                              </td>
                              <td>
                                {c.status !== 'PAID' && c.status !== 'APPROVED' ? (
                                  <button 
                                    className="btn btn-secondary btn-sm"
                                    onClick={async () => {
                                      await commissionService.approveCommission(c.id, authUser?.id);
                                      const updated = await commissionService.getCommissions();
                                      setCommissionsList(updated);
                                    }}
                                  >
                                    Approve & Pay
                                  </button>
                                ) : (
                                  <span style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 700 }}>
                                    ✓ Settled
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                          {commissionsList.length === 0 && (
                            <tr>
                              <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                                <Award size={32} color="#94A3B8" style={{ margin: '0 auto 0.5rem auto', display: 'block' }} />
                                <div>No commission transactions recorded yet.</div>
                                <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                  Use the <strong>"+ Give / Add Commission"</strong> button above to manually award incentives to coordinators.
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

              {/* TAB 2: REGISTERED COORDINATORS DIRECTORY */}
              {commissionSubTab === 'coordinators' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>पंजीकृत सहयोगी एवं समन्वयक डायरेक्टरी (Registered Coordinators)</span>
                        <span className="badge badge-navy" style={{ fontSize: '0.75rem' }}>
                          {coordinatorsList.length} Active
                        </span>
                      </h3>
                      <p style={{ color: '#64748B', fontSize: '0.8rem', margin: '0.2rem 0 0 0' }}>
                        जिला, ब्लॉक, तहसील, ग्राम पंचायत समन्वयक, CSC केंद्र, स्कूल, कॉलेज एवं कोचिंग सहयोगी
                      </p>
                    </div>

                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => setIsAddCoordinatorOpen(true)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#0B2B82', borderColor: '#0B2B82' }}
                    >
                      <Plus size={14} />
                      <span>+ नया समन्वयक जोड़ें (Add Coordinator)</span>
                    </button>
                  </div>

                  {/* Role Filter Pills */}
                  <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
                    <button
                      type="button"
                      className={`btn btn-sm ${coordinatorRoleFilter === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
                      style={{ borderRadius: '20px', fontSize: '0.75rem', padding: '0.3rem 0.85rem' }}
                      onClick={() => setCoordinatorRoleFilter('ALL')}
                    >
                      सभी पद (All) ({coordinatorsList.length})
                    </button>
                    {OFFICIAL_COORDINATOR_ROLES.slice(0, 8).map(r => {
                      const count = coordinatorsList.filter(c => c.role === r.id).length;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          className={`btn btn-sm ${coordinatorRoleFilter === r.id ? 'btn-primary' : 'btn-outline'}`}
                          style={{ borderRadius: '20px', fontSize: '0.75rem', padding: '0.3rem 0.85rem', whiteSpace: 'nowrap' }}
                          onClick={() => setCoordinatorRoleFilter(r.id)}
                        >
                          <span>{r.icon} {r.nameHi}</span>
                          {count > 0 && <span style={{ marginLeft: '4px', opacity: 0.85 }}>({count})</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Coordinators Grid */}
                  <div className="grid-3" style={{ gap: '1.25rem' }}>
                    {coordinatorsList
                      .filter(c => coordinatorRoleFilter === 'ALL' || c.role === coordinatorRoleFilter)
                      .map(coord => {
                        const totalEarned = commissionsList
                          .filter(c => c.beneficiary_user_id === coord.id)
                          .reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);

                        const roleConfig = OFFICIAL_COORDINATOR_ROLES.find(r => r.id === coord.role) || {
                          sno: '-',
                          nameHi: coord.role?.replace('_', ' '),
                          nameEn: coord.role,
                          target: coord.minTarget || 100,
                          rate: coord.rateAmount || 30,
                          color: '#1E40AF',
                          bg: '#EFF6FF',
                          border: '#BFDBFE',
                          icon: '👤'
                        };

                        return (
                          <div key={coord.id} className="card" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: `1px solid ${roleConfig.border}` }}>
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem' }}>
                                <span style={{ 
                                  fontSize: '0.72rem', 
                                  fontWeight: 800, 
                                  backgroundColor: roleConfig.bg, 
                                  color: roleConfig.color, 
                                  padding: '3px 8px', 
                                  borderRadius: '6px',
                                  border: `1px solid ${roleConfig.border}`,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}>
                                  <span>{roleConfig.icon}</span>
                                  <span>#{roleConfig.sno} {roleConfig.nameHi}</span>
                                </span>
                                <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>
                                  सक्रिय (Active)
                                </span>
                              </div>

                              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.2rem' }}>
                                {coord.fullName}
                              </h4>
                              <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '0.75rem', fontWeight: 600 }}>
                                {roleConfig.nameEn}
                              </div>

                              {/* Target & Rate Badges */}
                              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
                                <div style={{ fontSize: '0.72rem', backgroundColor: '#F1F5F9', color: '#334155', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                                  🎯 लक्ष्य: {roleConfig.target} फॉर्म
                                </div>
                                <div style={{ fontSize: '0.72rem', backgroundColor: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                                  💰 दर: ₹{roleConfig.rate}/आवेदन
                                </div>
                              </div>

                              <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.6, marginBottom: '0.5rem' }}>
                                <div>📱 <strong>{coord.mobile}</strong></div>
                                {coord.email && <div style={{ fontSize: '0.75rem', color: '#64748B' }}>✉️ {coord.email}</div>}
                                {coord.district && <div>📍 जिला (District): <strong>{coord.district}</strong></div>}
                                {coord.tehsil && <div>🏛️ तहसील (Tehsil): <strong>{coord.tehsil}</strong></div>}
                                {coord.block && <div>🏢 ब्लॉक (Block): <strong>{coord.block}</strong></div>}
                                {coord.gramPanchayat && <div>🏘️ ग्राम पंचायत: <strong>{coord.gramPanchayat}</strong></div>}
                                {(coord.institution || coord.centerName) && (
                                  <div>🏫 संस्थान/केंद्र: <strong>{coord.institution || coord.centerName}</strong></div>
                                )}
                              </div>
                            </div>

                            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '0.85rem', marginTop: '0.5rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>कुल अर्जित प्रोत्साहन:</span>
                                <strong style={{ color: '#16A34A', fontSize: '1.05rem', fontWeight: 800 }}>
                                  ₹{totalEarned.toLocaleString('en-IN')}
                                </strong>
                              </div>

                              <button 
                                className="btn btn-outline btn-sm"
                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#16A34A', borderColor: '#86EFAC', backgroundColor: '#F0FDF4', fontWeight: 700 }}
                                onClick={() => {
                                  setManualCommissionForm({
                                    coordinatorId: coord.id,
                                    role: coord.role || 'DISTRICT_COORDINATOR',
                                    applicationCount: 1,
                                    amount: roleConfig.rate || 50,
                                    applicationId: '',
                                    status: 'PAID',
                                    utrNumber: `COMM-${Date.now().toString().slice(-6)}`,
                                    remarks: `Verification incentive for ${coord.fullName} (${roleConfig.nameHi})`
                                  });
                                  setIsGiveCommissionOpen(true);
                                }}
                              >
                                <Award size={14} />
                                <span>+ Give Commission (कमीशन प्रदान करें)</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* TAB 3: ROLE RATES SLABS & OFFICIAL POSTER STRUCTURE */}
              {commissionSubTab === 'slabs' && (
                <div className="space-y-6">
                  {/* Official Poster Header Banner */}
                  <div style={{
                    background: 'linear-gradient(135deg, #0B2B82 0%, #1E3A8A 50%, #0F172A 100%)',
                    borderRadius: '16px',
                    padding: '1.75rem 2rem',
                    color: '#FFFFFF',
                    boxShadow: '0 10px 25px -5px rgba(11, 43, 130, 0.25)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(234, 179, 8, 0.2)', border: '1px solid #EAB308', borderRadius: '999px', padding: '0.2rem 0.85rem', color: '#FEF08A', fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                          <span>★</span>
                          <span>SCHOLARSHIP YOJNA 2026 • आधिकारिक दिशा-निर्देश</span>
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF', margin: '0.25rem 0' }}>
                          प्रति सहयोगी निर्धारित फॉर्म लक्ष्य एवं प्रोत्साहन राशि
                        </h2>
                        <p style={{ color: '#93C5FD', fontSize: '0.85rem', margin: 0 }}>
                          जन कल्याण मानवाधिकार फाउंडेशन • कोऑर्डिनेटर / सेवा सहयोगी के लिए विशेष अवसर
                        </p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end' }}>
                        <span style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: '0.3rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
                          🇮🇳 पढ़ेगा इंडिया बढ़ेगा इंडिया
                        </span>
                        <span style={{ color: '#86EFAC', fontSize: '0.75rem', fontWeight: 700 }}>
                          ✓ सभी फॉर्म सत्यापित एवं पात्र विद्यार्थियों के ही स्वीकार होंगे
                        </span>
                      </div>
                    </div>

                    {/* Poster Highlights Badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                      <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#FDE047' }}>
                        🎯 फॉर्म लक्ष्य पूरा करना अनिवार्य नहीं है
                      </div>
                      <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#86EFAC' }}>
                        💰 प्रोत्साहन राशि केवल पात्र एवं सत्यापित आवेदनों पर देय
                      </div>
                      <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#BAE6FD' }}>
                        🚫 विद्यार्थी की छात्रवृत्ति राशि से कोई कमीशन नहीं काटा जाएगा
                      </div>
                      <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#DDD6FE' }}>
                        🤝 सेवा ही सच्चा सहयोग है (गैर-सरकारी संस्था NGO)
                      </div>
                    </div>
                  </div>

                  {/* Official Slabs Table Mirroring Poster */}
                  <div className="card" style={{ padding: '1.5rem', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                          आधिकारिक पदवार प्रोत्साहन स्लैब तालिका (Official Incentive Matrix)
                        </h3>
                        <p style={{ color: '#64748B', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                          पोस्टर के अनुसार 8 मुख्य सहयोगी श्रेणियां, उनके निर्धारित फॉर्म लक्ष्य एवं प्रति सफल आवेदन प्रोत्साहन राशि
                        </p>
                      </div>

                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={async () => {
                          const updated = await commissionService.getCommissionRates();
                          setCommissionRates(updated);
                        }}
                      >
                        <RefreshCw size={13} />
                        <span>Refresh Rates</span>
                      </button>
                    </div>

                    <div className="data-table-container">
                      <table className="data-table">
                        <thead>
                          <tr style={{ backgroundColor: '#F8FAFC', textAlign: 'left' }}>
                            <th style={{ width: '60px' }}>क्रमांक</th>
                            <th>सहयोगी / पद (Designation)</th>
                            <th>न्यूनतम फॉर्म लक्ष्य (प्रति सहयोगी)</th>
                            <th>प्रति सफल आवेदन प्रोत्साहन राशि (₹ में)</th>
                            <th>मॉडल प्रकार (Payout Model)</th>
                            <th>स्थिति (Status)</th>
                            <th style={{ textAlign: 'right' }}>कार्य (Action)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {OFFICIAL_COORDINATOR_ROLES.slice(0, 8).map(roleItem => {
                            const dbRate = commissionRates.find(r => r.role_id === roleItem.id);
                            const amount = dbRate ? parseFloat(dbRate.rate_amount) : roleItem.rate;
                            const target = dbRate?.min_form_target || roleItem.target;

                            return (
                              <tr key={roleItem.id}>
                                <td>
                                  <span style={{ 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    width: '26px', 
                                    height: '26px', 
                                    borderRadius: '50%', 
                                    backgroundColor: roleItem.color, 
                                    color: '#FFFFFF', 
                                    fontWeight: 900, 
                                    fontSize: '0.8rem' 
                                  }}>
                                    {roleItem.sno}
                                  </span>
                                </td>
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '1.2rem' }}>{roleItem.icon}</span>
                                    <div>
                                      <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.95rem' }}>
                                        {roleItem.nameHi}
                                      </div>
                                      <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                                        {roleItem.nameEn}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <span className="badge" style={{ backgroundColor: '#F1F5F9', color: '#1E293B', fontWeight: 800, fontSize: '0.85rem' }}>
                                    🎯 {target} फॉर्म
                                  </span>
                                </td>
                                <td>
                                  <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '2px' }}>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#16A34A' }}>
                                      ₹ {amount}/-
                                    </span>
                                    <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                                      /सफल आवेदन
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <span className="badge badge-navy" style={{ fontSize: '0.72rem' }}>
                                    {dbRate?.model_type || 'FIXED_PER_APPROVED'}
                                  </span>
                                </td>
                                <td>
                                  <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                                    सक्रिय (Active)
                                  </span>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                  <button 
                                    className="btn btn-outline btn-sm"
                                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                                    onClick={async () => {
                                      const newRate = prompt(`Enter new commission rate (₹) for ${roleItem.nameHi} (${roleItem.nameEn}):`, amount);
                                      if (newRate && !isNaN(newRate)) {
                                        const newTarget = prompt(`Enter minimum form target for ${roleItem.nameHi}:`, target);
                                        await commissionService.updateCommissionRate(
                                          roleItem.id, 
                                          parseFloat(newRate), 
                                          dbRate?.model_type || 'FIXED_PER_APPROVED',
                                          newTarget && !isNaN(newTarget) ? parseInt(newTarget, 10) : target
                                        );
                                        const updated = await commissionService.getCommissionRates();
                                        setCommissionRates(updated);
                                        alert(`✓ Updated ${roleItem.nameHi} rate to ₹${newRate} (Target: ${newTarget || target} forms)`);
                                      }
                                    }}
                                  >
                                    <Edit3 size={12} />
                                    <span>दर बदलें (Edit)</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Visual Cards Grid for all 8 categories */}
                  <div className="grid-4" style={{ gap: '1.25rem' }}>
                    {OFFICIAL_COORDINATOR_ROLES.slice(0, 8).map(r => {
                      const dbRate = commissionRates.find(rate => rate.role_id === r.id);
                      const currentAmount = dbRate ? parseFloat(dbRate.rate_amount) : r.rate;
                      const currentTarget = dbRate?.min_form_target || r.target;

                      return (
                        <div 
                          key={r.id} 
                          style={{ 
                            backgroundColor: '#FFFFFF', 
                            padding: '1.4rem', 
                            borderRadius: '12px', 
                            border: `1.5px solid ${r.border}`,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                              <span style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                width: '28px', 
                                height: '28px', 
                                borderRadius: '50%', 
                                backgroundColor: r.color, 
                                color: '#FFFFFF', 
                                fontWeight: 900, 
                                fontSize: '0.85rem' 
                              }}>
                                {r.sno}
                              </span>
                              <span style={{ 
                                fontSize: '0.7rem', 
                                fontWeight: 700, 
                                color: r.color, 
                                backgroundColor: r.bg, 
                                padding: '2px 8px', 
                                borderRadius: '4px' 
                              }}>
                                {r.icon} श्रेणी #{r.sno}
                              </span>
                            </div>

                            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.2rem 0' }}>
                              {r.nameHi}
                            </h4>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, marginBottom: '0.85rem' }}>
                              {r.nameEn}
                            </div>

                            <div style={{ backgroundColor: '#F8FAFC', padding: '0.65rem', borderRadius: '8px', marginBottom: '0.85rem', border: '1px solid #E2E8F0' }}>
                              <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                                न्यूनतम फॉर्म लक्ष्य
                              </div>
                              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B', marginTop: '2px' }}>
                                🎯 {currentTarget} फॉर्म
                              </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                              <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                                प्रति सफल आवेदन प्रोत्साहन राशि
                              </div>
                              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#16A34A', margin: '2px 0' }}>
                                ₹{currentAmount.toFixed(0)}/-
                              </div>
                              <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                                पात्र एवं सत्यापित आवेदन पर देय
                              </div>
                            </div>
                          </div>

                          <button 
                            className="btn btn-outline btn-sm"
                            style={{ width: '100%', fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                            onClick={async () => {
                              const newRate = prompt(`Enter new commission rate (₹) for ${r.nameHi}:`, currentAmount);
                              if (newRate && !isNaN(newRate)) {
                                const newTarget = prompt(`Enter minimum form target for ${r.nameHi}:`, currentTarget);
                                await commissionService.updateCommissionRate(
                                  r.id, 
                                  parseFloat(newRate), 
                                  dbRate?.model_type || 'FIXED_PER_APPROVED',
                                  newTarget && !isNaN(newTarget) ? parseInt(newTarget, 10) : currentTarget
                                );
                                const updated = await commissionService.getCommissionRates();
                                setCommissionRates(updated);
                              }
                            }}
                          >
                            <Edit3 size={13} />
                            <span>Edit Rate / Target</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Official Notice, Special Appeal & Objectives Cards (From Poster) */}
                  <div className="grid-3" style={{ gap: '1.25rem' }}>
                    {/* Important Information */}
                    <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #E11D48', backgroundColor: '#FFF1F2' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#BE123C' }}>
                        <Bell size={20} />
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>महत्वपूर्ण सूचना</h4>
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#881337', lineHeight: 1.8 }}>
                        <li><strong>फॉर्म लक्ष्य पूरा करना अनिवार्य नहीं है।</strong></li>
                        <li>प्रोत्साहन राशि केवल पात्र एवं सत्यापित सफल आवेदनों पर देय होगी।</li>
                        <li>यह योजना गैर-सरकारी संस्था (NGO) द्वारा संचालित है।</li>
                        <li><strong>यह राशि विद्यार्थी की छात्रवृत्ति से नहीं काटी जाएगी।</strong></li>
                        <li>फॉर्म भरते समय सही जानकारी देना अनिवार्य है।</li>
                      </ul>
                    </div>

                    {/* Special Appeal */}
                    <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #D97706', backgroundColor: '#FFFBEB' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#B45309' }}>
                        <AlertTriangle size={20} />
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>विशेष अपील</h4>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: '#78350F', lineHeight: 1.7 }}>
                        कृपया केवल जरूरतमंद एवं पात्र विद्यार्थियों को ही आवेदन करने के लिए प्रेरित करें। गलत जानकारी, अपात्र आवेदन या केवल कमीशन के उद्देश्य से किए गए आवेदन स्वीकार नहीं किए जाएंगे।
                      </p>
                      <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', fontWeight: 800, color: '#92400E' }}>
                        ★ आपका सहयोग ही किसी जरूरतमंद विद्यार्थी का भविष्य बदल सकता है।
                      </div>
                    </div>

                    {/* Our Objectives */}
                    <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #0284C7', backgroundColor: '#F0F9FF' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#0369A1' }}>
                        <CheckCircle2 size={20} />
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>हमारा उद्देश्य</h4>
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#0C4A6E', lineHeight: 1.8 }}>
                        <li>✓ <strong>शिक्षा का अधिकार</strong> — हर बच्चे तक पहुंच</li>
                        <li>✓ <strong>समाज में समानता</strong> — कोई भी वंचित न रहे</li>
                        <li>✓ <strong>हर वर्ग के लिए शिक्षा</strong> — गुणवत्तापूर्ण अवसर</li>
                        <li>✓ <strong>सशक्त भारत निर्माण</strong> — शिक्षित युवा, आत्मनिर्भर देश</li>
                      </ul>
                      <div style={{ marginTop: '0.6rem', fontSize: '0.75rem', color: '#0369A1', fontWeight: 700 }}>
                        ★ सेवा ही सच्चा सहयोग है
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL 1: ADD NEW COORDINATOR */}
              {isAddCoordinatorOpen && (
                <div style={{
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1200,
                  padding: '1rem'
                }}>
                  <div className="animate-fade-in" style={{
                    maxWidth: '600px',
                    width: '100%',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
                    padding: '2rem',
                    maxHeight: '90vh',
                    overflowY: 'auto'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                          नया समन्वयक पंजीकृत करें (Register Coordinator)
                        </h3>
                        <p style={{ color: '#64748B', fontSize: '0.8rem', margin: '0.2rem 0 0 0' }}>
                          Add a field officer, cyber cafe / CSC operator, school/college nodal or coaching center
                        </p>
                      </div>
                      <button 
                        onClick={() => setIsAddCoordinatorOpen(false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <form onSubmit={handleCreateCoordinator} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {/* Coordinator Role Selector */}
                      <div className="form-group">
                        <label className="form-label required">सहयोगी / पद (Coordinator Role)</label>
                        <select 
                          className="form-control"
                          value={newCoordinatorForm.role}
                          onChange={(e) => {
                            const chosenRole = e.target.value;
                            const roleMeta = OFFICIAL_COORDINATOR_ROLES.find(r => r.id === chosenRole);
                            setNewCoordinatorForm({ 
                              ...newCoordinatorForm, 
                              role: chosenRole,
                              minTarget: roleMeta?.target || 100,
                              rateAmount: roleMeta?.rate || 30
                            });
                          }}
                        >
                          <option value="DISTRICT_COORDINATOR">1. जिला समन्वयक (District Coordinator) — लक्ष्य: 1000 फॉर्म | ₹50/आवेदन</option>
                          <option value="BLOCK_COORDINATOR">2. ब्लॉक समन्वयक (Block Coordinator) — लक्ष्य: 500 फॉर्म | ₹40/आवेदन</option>
                          <option value="TEHSIL_COORDINATOR">3. तहसील समन्वयक (Tehsil Coordinator) — लक्ष्य: 300 फॉर्म | ₹35/आवेदन</option>
                          <option value="GRAM_PANCHAYAT_COORDINATOR">4. ग्राम पंचायत समन्वयक (Gram Panchayat Coordinator) — लक्ष्य: 100 फॉर्म | ₹25/आवेदन</option>
                          <option value="ONLINE_CENTER">5. ऑनलाइन शॉप / CSC / साइबर कैफे (Online Center) — लक्ष्य: 50 फॉर्म | ₹30/आवेदन</option>
                          <option value="SCHOOL_COORDINATOR">6. स्कूल (School Coordinator) — लक्ष्य: 100 फॉर्म | ₹25/आवेदन</option>
                          <option value="COLLEGE_COORDINATOR">7. कॉलेज (College Coordinator) — लक्ष्य: 150 फॉर्म | ₹30/आवेदन</option>
                          <option value="COACHING_CENTER">8. कोचिंग सेंटर (Coaching Center) — लक्ष्य: 100 फॉर्म | ₹20/आवेदन</option>
                          <option value="INSTITUTION">शैक्षणिक संस्थान नोडल अधिकारी (School / College Nodal Officer)</option>
                        </select>
                      </div>

                      {/* Role Incentive Information Pill */}
                      {(() => {
                        const meta = OFFICIAL_COORDINATOR_ROLES.find(r => r.id === newCoordinatorForm.role);
                        if (!meta) return null;
                        return (
                          <div style={{
                            padding: '0.65rem 1rem',
                            backgroundColor: meta.bg,
                            border: `1px solid ${meta.border}`,
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.8rem',
                            color: meta.color,
                            fontWeight: 700
                          }}>
                            <span>{meta.icon} {meta.nameHi} ({meta.nameEn})</span>
                            <span style={{ color: '#16A34A', fontWeight: 900 }}>
                              🎯 लक्ष्य: {meta.target} फॉर्म • 💰 ₹{meta.rate}/आवेदन
                            </span>
                          </div>
                        );
                      })()}

                      {/* Name & Mobile */}
                      <div className="grid-2" style={{ gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label required">पूरा नाम (Full Name)</label>
                          <input 
                            type="text"
                            required
                            className="form-control"
                            placeholder="e.g. Ramesh Chandra Sharma"
                            value={newCoordinatorForm.fullName}
                            onChange={(e) => setNewCoordinatorForm({ ...newCoordinatorForm, fullName: e.target.value })}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label required">मोबाइल नंबर (Mobile Number)</label>
                          <input 
                            type="tel"
                            required
                            maxLength="10"
                            className="form-control"
                            placeholder="e.g. 9826110005"
                            value={newCoordinatorForm.mobile}
                            onChange={(e) => setNewCoordinatorForm({ ...newCoordinatorForm, mobile: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* Email Address */}
                      <div className="form-group">
                        <label className="form-label">ईमेल पता (Email Address - Optional)</label>
                        <input 
                          type="email"
                          className="form-control"
                          placeholder="e.g. coordinator.jabalpur@jankalyan.org"
                          value={newCoordinatorForm.email}
                          onChange={(e) => setNewCoordinatorForm({ ...newCoordinatorForm, email: e.target.value })}
                        />
                      </div>

                      {/* Geographic Jurisdiction */}
                      <div className="grid-2" style={{ gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label required">आवंटित जिला (Assigned District)</label>
                          <input 
                            type="text"
                            required
                            className="form-control"
                            placeholder="e.g. Jabalpur / Indore / Bhopal"
                            value={newCoordinatorForm.district}
                            onChange={(e) => setNewCoordinatorForm({ ...newCoordinatorForm, district: e.target.value })}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">
                            {newCoordinatorForm.role === 'TEHSIL_COORDINATOR' ? 'आवंटित तहसील (Assigned Tehsil)' : 'आवंटित ब्लॉक (Assigned Block)'}
                          </label>
                          <input 
                            type="text"
                            className="form-control"
                            placeholder={newCoordinatorForm.role === 'TEHSIL_COORDINATOR' ? 'e.g. Sihora / Patan' : 'e.g. Patan / Panagar / Depalpur'}
                            value={newCoordinatorForm.role === 'TEHSIL_COORDINATOR' ? newCoordinatorForm.tehsil : newCoordinatorForm.block}
                            onChange={(e) => {
                              if (newCoordinatorForm.role === 'TEHSIL_COORDINATOR') {
                                setNewCoordinatorForm({ ...newCoordinatorForm, tehsil: e.target.value });
                              } else {
                                setNewCoordinatorForm({ ...newCoordinatorForm, block: e.target.value });
                              }
                            }}
                          />
                        </div>
                      </div>

                      {/* Contextual Gram Panchayat / Center Name / Institution Name */}
                      {newCoordinatorForm.role === 'GRAM_PANCHAYAT_COORDINATOR' && (
                        <div className="form-group">
                          <label className="form-label required">ग्राम पंचायत का नाम (Gram Panchayat Name)</label>
                          <input 
                            type="text"
                            required
                            className="form-control"
                            placeholder="e.g. Bargi / Shahpura / Belkheda"
                            value={newCoordinatorForm.gramPanchayat}
                            onChange={(e) => setNewCoordinatorForm({ ...newCoordinatorForm, gramPanchayat: e.target.value })}
                          />
                        </div>
                      )}

                      {newCoordinatorForm.role === 'ONLINE_CENTER' && (
                        <div className="form-group">
                          <label className="form-label required">ऑनलाइन शॉप / CSC / कैफे का नाम (Shop / CSC Center Name)</label>
                          <input 
                            type="text"
                            required
                            className="form-control"
                            placeholder="e.g. Shri Ram CSC Center & Cyber Cafe"
                            value={newCoordinatorForm.centerName}
                            onChange={(e) => setNewCoordinatorForm({ ...newCoordinatorForm, centerName: e.target.value, institution: e.target.value })}
                          />
                        </div>
                      )}

                      {['SCHOOL_COORDINATOR', 'COLLEGE_COORDINATOR', 'COACHING_CENTER', 'INSTITUTION'].includes(newCoordinatorForm.role) && (
                        <div className="form-group">
                          <label className="form-label required">
                            {newCoordinatorForm.role === 'COACHING_CENTER' ? 'कोचिंग सेंटर का नाम (Coaching Center Name)' : (newCoordinatorForm.role === 'COLLEGE_COORDINATOR' ? 'कॉलेज का नाम (College Name)' : 'स्कूल / संस्था का नाम (School Name)')}
                          </label>
                          <input 
                            type="text"
                            required
                            className="form-control"
                            placeholder={newCoordinatorForm.role === 'COACHING_CENTER' ? 'e.g. Career Point Classes' : 'e.g. Govt Model HSS or Mahakoshal College'}
                            value={newCoordinatorForm.institution}
                            onChange={(e) => setNewCoordinatorForm({ ...newCoordinatorForm, institution: e.target.value })}
                          />
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <button 
                          type="button" 
                          className="btn btn-outline"
                          onClick={() => setIsAddCoordinatorOpen(false)}
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="btn btn-primary" 
                          style={{ backgroundColor: '#0B2B82', borderColor: '#0B2B82' }}
                          disabled={isSubmittingCoordinator}
                        >
                          {isSubmittingCoordinator ? (
                            <span>समन्वयक पंजीकृत हो रहा है...</span>
                          ) : (
                            <>
                              <CheckCircle2 size={16} />
                              <span>Register Coordinator (पंजीकृत करें)</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* MODAL 2: GIVE / ADD COMMISSION MANUALLY */}
              {isGiveCommissionOpen && (
                <div style={{
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1200,
                  padding: '1rem'
                }}>
                  <div className="animate-fade-in" style={{
                    maxWidth: '580px',
                    width: '100%',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
                    padding: '2rem',
                    maxHeight: '90vh',
                    overflowY: 'auto'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                          प्रोत्साहन राशि प्रदान करें (Grant / Add Commission)
                        </h3>
                        <p style={{ color: '#64748B', fontSize: '0.8rem', margin: '0.2rem 0 0 0' }}>
                          सत्यापित आवेदनों के आधार पर सहयोगी को कमीशन / प्रोत्साहन राशि दर्ज करें
                        </p>
                      </div>
                      <button 
                        onClick={() => setIsGiveCommissionOpen(false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <form onSubmit={handleGiveCommission} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {/* Coordinator Selector */}
                      <div className="form-group">
                        <label className="form-label required">सहयोगी / समन्वयक चुनें (Select Coordinator)</label>
                        <select 
                          required
                          className="form-control"
                          value={manualCommissionForm.coordinatorId}
                          onChange={(e) => {
                            const chosen = coordinatorsList.find(c => c.id === e.target.value);
                            const roleMeta = OFFICIAL_COORDINATOR_ROLES.find(r => r.id === chosen?.role);
                            const count = manualCommissionForm.applicationCount || 1;
                            const rate = roleMeta?.rate || 30;
                            setManualCommissionForm({
                              ...manualCommissionForm,
                              coordinatorId: e.target.value,
                              role: chosen?.role || 'DISTRICT_COORDINATOR',
                              amount: count * rate
                            });
                          }}
                        >
                          <option value="">-- समन्वयक चुनें (Choose Coordinator) --</option>
                          {coordinatorsList.map(coord => {
                            const rMeta = OFFICIAL_COORDINATOR_ROLES.find(r => r.id === coord.role);
                            return (
                              <option key={coord.id} value={coord.id}>
                                {coord.fullName} ({rMeta?.nameHi || coord.role}) - {coord.mobile}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {/* Selected Coordinator Details Pill & Quick Form Count Calculator */}
                      {(() => {
                        const selectedCoord = coordinatorsList.find(c => c.id === manualCommissionForm.coordinatorId);
                        const rMeta = OFFICIAL_COORDINATOR_ROLES.find(r => r.id === (selectedCoord?.role || manualCommissionForm.role));
                        const baseRate = rMeta?.rate || 50;

                        return (
                          <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A' }}>
                                {rMeta?.icon} {rMeta?.nameHi} ({rMeta?.nameEn})
                              </span>
                              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16A34A', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '4px' }}>
                                निर्धारित दर: ₹{baseRate}/आवेदन
                              </span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', alignItems: 'center' }}>
                              <div>
                                <label style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                                  सत्यापित सफल आवेदन संख्या (Application Count):
                                </label>
                                <input 
                                  type="number"
                                  min="1"
                                  className="form-control"
                                  style={{ height: '36px', fontSize: '0.9rem', fontWeight: 700 }}
                                  value={manualCommissionForm.applicationCount || 1}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value, 10) || 1;
                                    setManualCommissionForm({
                                      ...manualCommissionForm,
                                      applicationCount: val,
                                      amount: val * baseRate
                                    });
                                  }}
                                />
                              </div>

                              <div>
                                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, marginBottom: '4px' }}>
                                  स्वतः गणना (Calculated Incentive):
                                </div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#16A34A' }}>
                                  {manualCommissionForm.applicationCount || 1} × ₹{baseRate} = ₹{(manualCommissionForm.applicationCount || 1) * baseRate}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Final Amount & Status */}
                      <div className="grid-2" style={{ gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label required">देय प्रोत्साहन राशि (Commission Amount ₹)</label>
                          <input 
                            type="number"
                            required
                            min="1"
                            step="1"
                            className="form-control"
                            style={{ fontSize: '1.25rem', fontWeight: 900, color: '#16A34A' }}
                            value={manualCommissionForm.amount}
                            onChange={(e) => setManualCommissionForm({ ...manualCommissionForm, amount: e.target.value })}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label required">भुगतान स्थिति (Payout Status)</label>
                          <select 
                            className="form-control"
                            value={manualCommissionForm.status}
                            onChange={(e) => setManualCommissionForm({ ...manualCommissionForm, status: e.target.value })}
                          >
                            <option value="PAID">PAID (भुगतान पूर्ण / Transferred Offline / UPI)</option>
                            <option value="APPROVED">APPROVED (अनुमोदित / Ready for Settlement)</option>
                            <option value="PENDING">PENDING (लंबित समीक्षा / Awaiting Review)</option>
                          </select>
                        </div>
                      </div>

                      {/* Linked Application / Student Reference */}
                      <div className="form-group">
                        <label className="form-label">संबद्ध छात्रवृत्ति आवेदन संदर्भ (Linked Application - Optional)</label>
                        <select 
                          className="form-control"
                          value={manualCommissionForm.applicationId}
                          onChange={(e) => setManualCommissionForm({ ...manualCommissionForm, applicationId: e.target.value })}
                        >
                          <option value="">-- सामान्य क्षेत्रीय सत्यापन / गैर-विशिष्ट (General Batch Incentive) --</option>
                          {applications.slice(0, 30).map(app => (
                            <option key={app.id} value={app.id}>
                              {app.id} - {app.studentName} ({app.institution || app.district})
                            </option>
                          ))}
                        </select>
                        <span style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.2rem', display: 'block' }}>
                          यदि खाली है, तो यह सामान्य फील्ड सत्यापन एवं मोबिलाइजेशन प्रोत्साहन के रूप में दर्ज होगा।
                        </span>
                      </div>

                      {/* UTR Reference & Remarks */}
                      <div className="form-group">
                        <label className="form-label">बैंक UTR / ट्रांजैक्शन संदर्भ (UTR / Reference - Optional)</label>
                        <input 
                          type="text"
                          className="form-control"
                          placeholder="e.g. UPI/62819283918 or SBIN-COMM-2026"
                          value={manualCommissionForm.utrNumber}
                          onChange={(e) => setManualCommissionForm({ ...manualCommissionForm, utrNumber: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">उद्देश्य / टिप्पणी (Purpose / Remarks)</label>
                        <input 
                          type="text"
                          className="form-control"
                          placeholder="e.g. Field verification incentive for Session 2026-27"
                          value={manualCommissionForm.remarks}
                          onChange={(e) => setManualCommissionForm({ ...manualCommissionForm, remarks: e.target.value })}
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <button 
                          type="button" 
                          className="btn btn-outline"
                          onClick={() => setIsGiveCommissionOpen(false)}
                        >
                          रद्द करें (Cancel)
                        </button>
                        <button 
                          type="submit" 
                          className="btn btn-primary"
                          style={{ backgroundColor: '#16A34A', borderColor: '#16A34A', fontWeight: 800 }}
                          disabled={isSubmittingCommission}
                        >
                          {isSubmittingCommission ? (
                            <span>प्रोत्साहन राशि दर्ज हो रही है...</span>
                          ) : (
                            <>
                              <Award size={16} />
                              <span>प्रोत्साहन राशि प्रदान करें (Grant Commission)</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    District-Wise Scrutiny & Disbursement Matrix
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>State (राज्य):</span>
                    <select
                      className="form-control"
                      value={matrixState}
                      onChange={(e) => setMatrixState(e.target.value)}
                      style={{ width: 'auto', minWidth: '200px', fontWeight: 700 }}
                    >
                      <option value="All">All States (समस्त राज्य)</option>
                      {allStates.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

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
                      {(() => {
                        const targetDistricts = matrixState !== 'All' 
                          ? getDistrictsByState(matrixState) 
                          : (() => {
                              const distSet = new Set(applications.map(a => a.district).filter(Boolean));
                              getDistrictsByState('Madhya Pradesh').slice(0, 10).forEach(d => distSet.add(d));
                              return Array.from(distSet).sort();
                            })();

                        return targetDistricts.map(d => {
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
                        });
                      })()}
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
          onOpenDisburse={handleOpenMarkTransferred}
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
          onOpenDisburse={handleOpenMarkTransferred}
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

                {/* 3-Pillar Financial Ledger Box */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '0.5rem', 
                  backgroundColor: '#FFFFFF', 
                  padding: '0.65rem 0.75rem', 
                  borderRadius: '8px', 
                  border: '1px solid #CBD5E1', 
                  margin: '0.5rem 0' 
                }}>
                  <div>
                    <div style={{ fontSize: '0.66rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Total Sanctioned</div>
                    <div style={{ fontWeight: 800, color: '#1E40AF', fontSize: '0.95rem' }}>
                      ₹{(markingTransferredApp.sanctionedAmount || 12000).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.66rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Paid So Far</div>
                    <div style={{ fontWeight: 800, color: '#16A34A', fontSize: '0.95rem' }}>
                      ₹{(markingTransferredApp.rawDisbursedAmount || 0).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.66rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Remaining Balance</div>
                    <div style={{ fontWeight: 800, color: (markingTransferredApp.rawRemainingAmount ?? 12000) > 0 ? '#D97706' : '#16A34A', fontSize: '0.95rem' }}>
                      ₹{(markingTransferredApp.rawRemainingAmount ?? Math.max(0, (markingTransferredApp.sanctionedAmount || 12000) - (markingTransferredApp.rawDisbursedAmount || 0))).toLocaleString('en-IN')}
                    </div>
                  </div>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <label className="form-label required" style={{ fontSize: '0.82rem', margin: 0 }}>
                      Installment / Payout Amount to Disburse (₹)
                    </label>
                    <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                      Select quick installment preset or enter custom amount
                    </span>
                  </div>

                  {/* Quick Installment Selectors */}
                  {(() => {
                    const sanc = markingTransferredApp.sanctionedAmount || 12000;
                    const paid = markingTransferredApp.rawDisbursedAmount || 0;
                    const rem = markingTransferredApp.rawRemainingAmount !== undefined 
                      ? markingTransferredApp.rawRemainingAmount 
                      : Math.max(0, sanc - paid);
                    const half = Math.round(sanc / 2);
                    const isFirstInstallment = paid === 0;
                    
                    return (
                      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                        {isFirstInstallment && rem >= half && (
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => setTransferModalForm(prev => ({ 
                              ...prev, 
                              installmentAmount: half,
                              remarks: `Installment #1 (50% Grant - ₹${half.toLocaleString('en-IN')}) via DBT/NEFT`
                            }))}
                            style={{ 
                              fontSize: '0.75rem', 
                              padding: '0.3rem 0.65rem',
                              borderColor: Number(transferModalForm.installmentAmount) === half ? '#2563EB' : '#CBD5E1',
                              backgroundColor: Number(transferModalForm.installmentAmount) === half ? '#EFF6FF' : '#FFF',
                              color: Number(transferModalForm.installmentAmount) === half ? '#1E40AF' : '#475569',
                              fontWeight: 700,
                              borderRadius: '6px'
                            }}
                          >
                            ⚡ 50% Installment (₹{half.toLocaleString('en-IN')})
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => setTransferModalForm(prev => ({ 
                            ...prev, 
                            installmentAmount: rem,
                            remarks: paid > 0 
                              ? `Final Installment (Remaining Balance - ₹${rem.toLocaleString('en-IN')}) via DBT/NEFT`
                              : `Full Scholarship Grant (₹${rem.toLocaleString('en-IN')}) via DBT/NEFT`
                          }))}
                          style={{ 
                            fontSize: '0.75rem', 
                            padding: '0.3rem 0.65rem',
                            borderColor: Number(transferModalForm.installmentAmount) === rem ? '#16A34A' : '#CBD5E1',
                            backgroundColor: Number(transferModalForm.installmentAmount) === rem ? '#DCFCE7' : '#FFF',
                            color: Number(transferModalForm.installmentAmount) === rem ? '#15803D' : '#475569',
                            fontWeight: 700,
                            borderRadius: '6px'
                          }}
                        >
                          ✓ Full Balance (₹{rem.toLocaleString('en-IN')})
                        </button>
                        {paid > 0 && (
                          <span style={{ 
                            alignSelf: 'center', 
                            fontSize: '0.72rem', 
                            fontWeight: 700, 
                            color: '#D97706', 
                            backgroundColor: '#FEF3C7', 
                            padding: '0.25rem 0.55rem', 
                            borderRadius: '4px',
                            border: '1px solid #FDE68A'
                          }}>
                            Installment #2 Payout
                          </span>
                        )}
                      </div>
                    );
                  })()}

                  <input 
                    type="number" 
                    value={transferModalForm.installmentAmount ?? ''}
                    onChange={(e) => setTransferModalForm(prev => ({ ...prev, installmentAmount: e.target.value }))}
                    className="form-control"
                    style={{ fontSize: '1.05rem', fontWeight: 800, color: '#16A34A' }}
                    min="1"
                    placeholder="Enter installment amount in rupees"
                  />
                  {/* Live Remaining Balance Calculation Preview */}
                  {(() => {
                    const sanc = markingTransferredApp.sanctionedAmount || 12000;
                    const prevPaid = markingTransferredApp.rawDisbursedAmount || 0;
                    const inst = parseFloat(transferModalForm.installmentAmount) || 0;
                    const newTotal = prevPaid + inst;
                    const newRem = Math.max(0, sanc - newTotal);
                    return (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: '6px', padding: '0.45rem 0.65rem', marginTop: '0.35rem', fontSize: '0.75rem' }}>
                        <span>New Balance after this payout:</span>
                        <strong style={{ color: newRem <= 0 ? '#16A34A' : '#D97706', fontSize: '0.85rem' }}>
                          ₹{newRem.toLocaleString('en-IN')} {newRem <= 0 ? '(Fully Paid ✓)' : '(Partial Installment)'}
                        </strong>
                      </div>
                    );
                  })()}
                </div>

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
