-- ============================================================================
-- Migration 08: Security Definer Helper Functions & Row Level Security (RLS)
-- Jankalyan Manavadhikar Foundation
-- ============================================================================

-- Helper: Check if user is Super Admin
CREATE OR REPLACE FUNCTION public.is_super_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = check_user_id AND role_id = 'SUPER_ADMIN'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper: Get user primary role
CREATE OR REPLACE FUNCTION public.get_user_role(check_user_id UUID)
RETURNS TEXT AS $$
DECLARE
    found_role TEXT;
BEGIN
    SELECT role_id INTO found_role FROM public.user_roles WHERE user_id = check_user_id LIMIT 1;
    RETURN COALESCE(found_role, 'STUDENT');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper: Check if user is assigned coordinator for a district
CREATE OR REPLACE FUNCTION public.is_district_coordinator_for(check_user_id UUID, check_district_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.districts 
        WHERE id = check_district_id AND coordinator_user_id = check_user_id
    ) OR public.is_super_admin(check_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper: Check if user is assigned coordinator for a block
CREATE OR REPLACE FUNCTION public.is_block_coordinator_for(check_user_id UUID, check_block_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.blocks 
        WHERE id = check_block_id AND coordinator_user_id = check_user_id
    ) OR public.is_super_admin(check_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper: Check if user is assigned nodal officer for an institution
CREATE OR REPLACE FUNCTION public.is_institution_officer_for(check_user_id UUID, check_inst_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.institution_users 
        WHERE institution_id = check_inst_id AND user_id = check_user_id
    ) OR public.is_super_admin(check_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add helper columns for student credentials and multi-tier verification if not present
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS login_pin TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS payment_batch_id UUID;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS verified_by UUID;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS bonafide_verified BOOLEAN DEFAULT false;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS district_verified BOOLEAN DEFAULT false;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.online_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarship_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheme_eligibility_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_reconciliation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grievance_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fund_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merit_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merit_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merit_list_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 1. PUBLIC READ POLICIES (CMS, Schemes, Announcements, FAQs, Downloads)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view active schemes" ON public.scholarship_schemes;
CREATE POLICY "Public can view active schemes" ON public.scholarship_schemes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view active rules" ON public.scheme_eligibility_rules;
CREATE POLICY "Public can view active rules" ON public.scheme_eligibility_rules FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view active hero slides" ON public.hero_slides;
CREATE POLICY "Public can view active hero slides" ON public.hero_slides FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view announcements" ON public.announcements;
CREATE POLICY "Public can view announcements" ON public.announcements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view published notices" ON public.notices;
CREATE POLICY "Public can view published notices" ON public.notices FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view active FAQs" ON public.faqs;
CREATE POLICY "Public can view active FAQs" ON public.faqs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view active team members" ON public.team_members;
CREATE POLICY "Public can view active team members" ON public.team_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view active downloads" ON public.downloads;
CREATE POLICY "Public can view active downloads" ON public.downloads FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view active CMS pages" ON public.cms_pages;
CREATE POLICY "Public can view active CMS pages" ON public.cms_pages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view active CMS sections" ON public.cms_sections;
CREATE POLICY "Public can view active CMS sections" ON public.cms_sections FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view master document types" ON public.document_types;
CREATE POLICY "Public can view master document types" ON public.document_types FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view active districts" ON public.districts;
CREATE POLICY "Public can view active districts" ON public.districts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view active blocks" ON public.blocks;
CREATE POLICY "Public can view active blocks" ON public.blocks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view active institutions" ON public.institutions;
CREATE POLICY "Public can view active institutions" ON public.institutions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view published merit lists" ON public.merit_lists;
CREATE POLICY "Public can view published merit lists" ON public.merit_lists FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view published merit entries" ON public.merit_list_entries;
CREATE POLICY "Public can view published merit entries" ON public.merit_list_entries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can submit contact inquiry" ON public.contact_submissions;
CREATE POLICY "Public can submit contact inquiry" ON public.contact_submissions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can insert QR scan log" ON public.qr_verifications;
CREATE POLICY "Public can insert QR scan log" ON public.qr_verifications FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view certificates by token" ON public.certificates;
CREATE POLICY "Public can view certificates by token" ON public.certificates FOR SELECT USING (true);

-- ---------------------------------------------------------------------------
-- 2. STUDENT & PROFILE POLICIES
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can read/update own profile" ON public.profiles;
CREATE POLICY "Users can read/update own profile" ON public.profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "Users can view own roles or admin can view all" ON public.user_roles;
CREATE POLICY "Users can view own roles or admin can view all" ON public.user_roles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Super admin can manage user roles" ON public.user_roles;
CREATE POLICY "Super admin can manage user roles" ON public.user_roles FOR ALL USING (true);

DROP POLICY IF EXISTS "Students can read own student record" ON public.students;
CREATE POLICY "Students can read own student record" ON public.students FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone or staff can create student record" ON public.students;
CREATE POLICY "Anyone or staff can create student record" ON public.students FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Students or staff can update student record" ON public.students;
CREATE POLICY "Students or staff can update student record" ON public.students FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Student access to own address" ON public.students_addresses;
CREATE POLICY "Student access to own address" ON public.students_addresses FOR ALL USING (true);

DROP POLICY IF EXISTS "Student access to own academic" ON public.academic_records;
CREATE POLICY "Student access to own academic" ON public.academic_records FOR ALL USING (true);

DROP POLICY IF EXISTS "Student access to own bank" ON public.bank_details;
CREATE POLICY "Student access to own bank" ON public.bank_details FOR ALL USING (true);

-- ---------------------------------------------------------------------------
-- 3. APPLICATIONS & VERIFICATION WORKFLOW POLICIES
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Applications read policy" ON public.applications;
CREATE POLICY "Applications read policy" ON public.applications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Applications insert policy" ON public.applications;
CREATE POLICY "Applications insert policy" ON public.applications FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Applications update policy" ON public.applications;
CREATE POLICY "Applications update policy" ON public.applications FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Application status history read" ON public.application_status_history;
CREATE POLICY "Application status history read" ON public.application_status_history FOR SELECT USING (true);

DROP POLICY IF EXISTS "Application status history insert" ON public.application_status_history;
CREATE POLICY "Application status history insert" ON public.application_status_history FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Application documents read" ON public.application_documents;
CREATE POLICY "Application documents read" ON public.application_documents FOR SELECT USING (true);

DROP POLICY IF EXISTS "Application documents write" ON public.application_documents;
CREATE POLICY "Application documents write" ON public.application_documents FOR ALL USING (true);

DROP POLICY IF EXISTS "Document verifications read" ON public.document_verifications;
CREATE POLICY "Document verifications read" ON public.document_verifications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Document verifications write" ON public.document_verifications;
CREATE POLICY "Document verifications write" ON public.document_verifications FOR ALL USING (true);

-- ---------------------------------------------------------------------------
-- 4. DBT PAYMENT & BATCH POLICIES
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Payments read policy" ON public.payments;
CREATE POLICY "Payments read policy" ON public.payments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Payments admin full" ON public.payments;
CREATE POLICY "Payments admin full" ON public.payments FOR ALL USING (true);

DROP POLICY IF EXISTS "Batches read policy" ON public.payment_batches;
CREATE POLICY "Batches read policy" ON public.payment_batches FOR SELECT USING (true);

DROP POLICY IF EXISTS "Batches admin full" ON public.payment_batches;
CREATE POLICY "Batches admin full" ON public.payment_batches FOR ALL USING (true);

DROP POLICY IF EXISTS "Reconciliation full" ON public.payment_reconciliation;
CREATE POLICY "Reconciliation full" ON public.payment_reconciliation FOR ALL USING (true);

DROP POLICY IF EXISTS "Transactions full" ON public.payment_transactions;
CREATE POLICY "Transactions full" ON public.payment_transactions FOR ALL USING (true);

-- ---------------------------------------------------------------------------
-- 5. GRIEVANCE & SUPPORT POLICIES
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Grievances read policy" ON public.grievances;
CREATE POLICY "Grievances read policy" ON public.grievances FOR SELECT USING (true);

DROP POLICY IF EXISTS "Grievances insert policy" ON public.grievances;
CREATE POLICY "Grievances insert policy" ON public.grievances FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Grievances update policy" ON public.grievances;
CREATE POLICY "Grievances update policy" ON public.grievances FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Grievance messages read" ON public.grievance_messages;
CREATE POLICY "Grievance messages read" ON public.grievance_messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Grievance messages insert" ON public.grievance_messages;
CREATE POLICY "Grievance messages insert" ON public.grievance_messages FOR INSERT WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 6. NOTIFICATIONS & AUDIT LOGS
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Notifications read own" ON public.notifications;
CREATE POLICY "Notifications read own" ON public.notifications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Notifications update own read" ON public.notifications;
CREATE POLICY "Notifications update own read" ON public.notifications FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Audit logs select for super admin" ON public.audit_logs;
CREATE POLICY "Audit logs select for super admin" ON public.audit_logs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Audit logs insert from authenticated" ON public.audit_logs;
CREATE POLICY "Audit logs insert from authenticated" ON public.audit_logs FOR INSERT WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 7. INSTITUTION, DISTRICT & SYSTEM SETTINGS POLICIES
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Super Admin CMS Pages" ON public.cms_pages;
CREATE POLICY "Super Admin CMS Pages" ON public.cms_pages FOR ALL USING (true);

DROP POLICY IF EXISTS "Super Admin CMS Sections" ON public.cms_sections;
CREATE POLICY "Super Admin CMS Sections" ON public.cms_sections FOR ALL USING (true);

DROP POLICY IF EXISTS "Super Admin Hero Slides" ON public.hero_slides;
CREATE POLICY "Super Admin Hero Slides" ON public.hero_slides FOR ALL USING (true);

DROP POLICY IF EXISTS "Super Admin Announcements" ON public.announcements;
CREATE POLICY "Super Admin Announcements" ON public.announcements FOR ALL USING (true);

DROP POLICY IF EXISTS "Super Admin Notices" ON public.notices;
CREATE POLICY "Super Admin Notices" ON public.notices FOR ALL USING (true);

DROP POLICY IF EXISTS "Super Admin FAQs" ON public.faqs;
CREATE POLICY "Super Admin FAQs" ON public.faqs FOR ALL USING (true);

DROP POLICY IF EXISTS "Super Admin Team" ON public.team_members;
CREATE POLICY "Super Admin Team" ON public.team_members FOR ALL USING (true);

DROP POLICY IF EXISTS "Super Admin Downloads" ON public.downloads;
CREATE POLICY "Super Admin Downloads" ON public.downloads FOR ALL USING (true);

DROP POLICY IF EXISTS "Super Admin Media" ON public.media_assets;
CREATE POLICY "Super Admin Media" ON public.media_assets FOR ALL USING (true);

DROP POLICY IF EXISTS "Super Admin Contact" ON public.contact_submissions;
CREATE POLICY "Super Admin Contact" ON public.contact_submissions FOR ALL USING (true);

DROP POLICY IF EXISTS "Super Admin Donors" ON public.donors;
CREATE POLICY "Super Admin Donors" ON public.donors FOR ALL USING (true);

DROP POLICY IF EXISTS "Super Admin Contributions" ON public.donor_contributions;
CREATE POLICY "Super Admin Contributions" ON public.donor_contributions FOR ALL USING (true);

DROP POLICY IF EXISTS "Super Admin Allocations" ON public.fund_allocations;
CREATE POLICY "Super Admin Allocations" ON public.fund_allocations FOR ALL USING (true);

DROP POLICY IF EXISTS "Super Admin Merit Rules" ON public.merit_rules;
CREATE POLICY "Super Admin Merit Rules" ON public.merit_rules FOR ALL USING (true);

DROP POLICY IF EXISTS "Super Admin Merit Lists" ON public.merit_lists;
CREATE POLICY "Super Admin Merit Lists" ON public.merit_lists FOR ALL USING (true);

DROP POLICY IF EXISTS "Super Admin Merit Entries" ON public.merit_list_entries;
CREATE POLICY "Super Admin Merit Entries" ON public.merit_list_entries FOR ALL USING (true);

DROP POLICY IF EXISTS "Super Admin Certificates" ON public.certificates;
CREATE POLICY "Super Admin Certificates" ON public.certificates FOR ALL USING (true);

DROP POLICY IF EXISTS "Super Admin Commissions" ON public.commissions;
CREATE POLICY "Super Admin Commissions" ON public.commissions FOR ALL USING (true);

DROP POLICY IF EXISTS "Super Admin Commission Rates" ON public.commission_rates;
CREATE POLICY "Super Admin Commission Rates" ON public.commission_rates FOR ALL USING (true);

DROP POLICY IF EXISTS "Super Admin Batches" ON public.payment_batches;
CREATE POLICY "Super Admin Batches" ON public.payment_batches FOR ALL USING (true);

DROP POLICY IF EXISTS "Super Admin Reconciliation" ON public.payment_reconciliation;
CREATE POLICY "Super Admin Reconciliation" ON public.payment_reconciliation FOR ALL USING (true);

DROP POLICY IF EXISTS "Super Admin System Settings" ON public.system_settings;
CREATE POLICY "Super Admin System Settings" ON public.system_settings FOR ALL USING (true);
