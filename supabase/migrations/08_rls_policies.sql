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
CREATE POLICY "Public can view active schemes" ON public.scholarship_schemes FOR SELECT USING (is_active = true OR public.is_super_admin(auth.uid()));
CREATE POLICY "Public can view active rules" ON public.scheme_eligibility_rules FOR SELECT USING (true);
CREATE POLICY "Public can view active hero slides" ON public.hero_slides FOR SELECT USING (is_active = true OR public.is_super_admin(auth.uid()));
CREATE POLICY "Public can view announcements" ON public.announcements FOR SELECT USING (is_active = true OR public.is_super_admin(auth.uid()));
CREATE POLICY "Public can view published notices" ON public.notices FOR SELECT USING (is_published = true OR public.is_super_admin(auth.uid()));
CREATE POLICY "Public can view active FAQs" ON public.faqs FOR SELECT USING (is_active = true OR public.is_super_admin(auth.uid()));
CREATE POLICY "Public can view active team members" ON public.team_members FOR SELECT USING (is_active = true OR public.is_super_admin(auth.uid()));
CREATE POLICY "Public can view active downloads" ON public.downloads FOR SELECT USING (is_active = true OR public.is_super_admin(auth.uid()));
CREATE POLICY "Public can view active CMS pages" ON public.cms_pages FOR SELECT USING (is_published = true OR public.is_super_admin(auth.uid()));
CREATE POLICY "Public can view active CMS sections" ON public.cms_sections FOR SELECT USING (is_active = true OR public.is_super_admin(auth.uid()));
CREATE POLICY "Public can view master document types" ON public.document_types FOR SELECT USING (true);
CREATE POLICY "Public can view active districts" ON public.districts FOR SELECT USING (is_active = true OR public.is_super_admin(auth.uid()));
CREATE POLICY "Public can view active blocks" ON public.blocks FOR SELECT USING (is_active = true OR public.is_super_admin(auth.uid()));
CREATE POLICY "Public can view active institutions" ON public.institutions FOR SELECT USING (is_active = true OR public.is_super_admin(auth.uid()));
CREATE POLICY "Public can view published merit lists" ON public.merit_lists FOR SELECT USING (status = 'PUBLISHED' OR public.is_super_admin(auth.uid()));
CREATE POLICY "Public can view published merit entries" ON public.merit_list_entries FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.merit_lists WHERE id = merit_list_entries.merit_list_id AND status = 'PUBLISHED')
    OR public.is_super_admin(auth.uid())
);
CREATE POLICY "Public can submit contact inquiry" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert QR scan log" ON public.qr_verifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view certificates by token" ON public.certificates FOR SELECT USING (true);

-- ---------------------------------------------------------------------------
-- 2. STUDENT POLICIES (Own Profile, Own Applications, Own Documents)
-- ---------------------------------------------------------------------------
CREATE POLICY "Users can read/update own profile" ON public.profiles FOR ALL USING (auth.uid() = id OR public.is_super_admin(auth.uid()));
CREATE POLICY "Users can view own roles or admin can view all" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.is_super_admin(auth.uid()));
CREATE POLICY "Super admin can manage user roles" ON public.user_roles FOR ALL USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Students can read own student record" ON public.students FOR SELECT USING (
    user_id = auth.uid() OR public.is_super_admin(auth.uid())
);
CREATE POLICY "Anyone or staff can create student record" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Students or staff can update student record" ON public.students FOR UPDATE USING (
    user_id = auth.uid() OR public.is_super_admin(auth.uid())
);

CREATE POLICY "Student access to own address" ON public.students_addresses FOR ALL USING (
    EXISTS (SELECT 1 FROM public.students s WHERE s.id = students_addresses.student_id AND (s.user_id = auth.uid() OR public.is_super_admin(auth.uid())))
);

CREATE POLICY "Student access to own academic" ON public.academic_records FOR ALL USING (
    EXISTS (SELECT 1 FROM public.students s WHERE s.id = academic_records.student_id AND (s.user_id = auth.uid() OR public.is_super_admin(auth.uid())))
);

CREATE POLICY "Student access to own bank" ON public.bank_details FOR ALL USING (
    EXISTS (SELECT 1 FROM public.students s WHERE s.id = bank_details.student_id AND (s.user_id = auth.uid() OR public.is_super_admin(auth.uid())))
);

-- Application RLS: Student owns application; Coordinator owns their district/block/institution; Super Admin has full
CREATE POLICY "Applications read policy" ON public.applications FOR SELECT USING (
    public.is_super_admin(auth.uid())
    OR EXISTS (SELECT 1 FROM public.students s WHERE s.id = applications.student_id AND s.user_id = auth.uid())
    OR (district_id IS NOT NULL AND public.is_district_coordinator_for(auth.uid(), district_id))
    OR (block_id IS NOT NULL AND public.is_block_coordinator_for(auth.uid(), block_id))
    OR (institution_id IS NOT NULL AND public.is_institution_officer_for(auth.uid(), institution_id))
    OR (online_center_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.online_centers c WHERE c.id = applications.online_center_id AND c.operator_user_id = auth.uid()))
);

CREATE POLICY "Applications insert policy" ON public.applications FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL OR true
);

CREATE POLICY "Applications update policy" ON public.applications FOR UPDATE USING (
    public.is_super_admin(auth.uid())
    OR (status = 'DRAFT' AND EXISTS (SELECT 1 FROM public.students s WHERE s.id = applications.student_id AND s.user_id = auth.uid()))
    OR (district_id IS NOT NULL AND public.is_district_coordinator_for(auth.uid(), district_id))
    OR (block_id IS NOT NULL AND public.is_block_coordinator_for(auth.uid(), block_id))
    OR (institution_id IS NOT NULL AND public.is_institution_officer_for(auth.uid(), institution_id))
);

-- Documents RLS
CREATE POLICY "Application documents read" ON public.application_documents FOR SELECT USING (
    public.is_super_admin(auth.uid())
    OR EXISTS (
        SELECT 1 FROM public.applications a 
        JOIN public.students s ON s.id = a.student_id 
        WHERE a.id = application_documents.application_id AND (
            s.user_id = auth.uid()
            OR (a.district_id IS NOT NULL AND public.is_district_coordinator_for(auth.uid(), a.district_id))
            OR (a.block_id IS NOT NULL AND public.is_block_coordinator_for(auth.uid(), a.block_id))
            OR (a.institution_id IS NOT NULL AND public.is_institution_officer_for(auth.uid(), a.institution_id))
        )
    )
);

CREATE POLICY "Application documents write" ON public.application_documents FOR ALL USING (
    public.is_super_admin(auth.uid())
    OR EXISTS (
        SELECT 1 FROM public.applications a 
        JOIN public.students s ON s.id = a.student_id 
        WHERE a.id = application_documents.application_id AND (
            s.user_id = auth.uid()
            OR public.is_district_coordinator_for(auth.uid(), a.district_id)
            OR public.is_block_coordinator_for(auth.uid(), a.block_id)
            OR public.is_institution_officer_for(auth.uid(), a.institution_id)
        )
    )
);

-- Payments RLS
CREATE POLICY "Payments read policy" ON public.payments FOR SELECT USING (
    public.is_super_admin(auth.uid())
    OR EXISTS (SELECT 1 FROM public.students s WHERE s.id = payments.student_id AND s.user_id = auth.uid())
);
CREATE POLICY "Payments admin full" ON public.payments FOR ALL USING (public.is_super_admin(auth.uid()));

-- Grievances RLS
CREATE POLICY "Grievances read policy" ON public.grievances FOR SELECT USING (
    public.is_super_admin(auth.uid())
    OR (mobile IS NOT NULL AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.mobile = grievances.mobile))
    OR EXISTS (SELECT 1 FROM public.applications a WHERE a.id = grievances.application_id AND a.district_id IS NOT NULL AND public.is_district_coordinator_for(auth.uid(), a.district_id))
);
CREATE POLICY "Grievances insert policy" ON public.grievances FOR INSERT WITH CHECK (true);
CREATE POLICY "Grievances update policy" ON public.grievances FOR UPDATE USING (public.is_super_admin(auth.uid()));

-- Grievance Messages RLS
CREATE POLICY "Grievance messages read" ON public.grievance_messages FOR SELECT USING (true);
CREATE POLICY "Grievance messages insert" ON public.grievance_messages FOR INSERT WITH CHECK (true);

-- Notifications RLS
CREATE POLICY "Notifications read own" ON public.notifications FOR SELECT USING (user_id = auth.uid() OR public.is_super_admin(auth.uid()));
CREATE POLICY "Notifications update own read" ON public.notifications FOR UPDATE USING (user_id = auth.uid() OR public.is_super_admin(auth.uid()));

-- Audit Logs (Read Only for Super Admin, Nobody Can Update/Delete)
CREATE POLICY "Audit logs select for super admin" ON public.audit_logs FOR SELECT USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Audit logs insert from authenticated" ON public.audit_logs FOR INSERT WITH CHECK (true);

-- Super Admin Full Access Fallback for CMS and Management
CREATE POLICY "Super Admin CMS Pages" ON public.cms_pages FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super Admin CMS Sections" ON public.cms_sections FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super Admin Hero Slides" ON public.hero_slides FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super Admin Announcements" ON public.announcements FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super Admin Notices" ON public.notices FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super Admin FAQs" ON public.faqs FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super Admin Team" ON public.team_members FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super Admin Downloads" ON public.downloads FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super Admin Media" ON public.media_assets FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super Admin Contact" ON public.contact_submissions FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super Admin Donors" ON public.donors FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super Admin Contributions" ON public.donor_contributions FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super Admin Allocations" ON public.fund_allocations FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super Admin Merit Rules" ON public.merit_rules FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super Admin Merit Lists" ON public.merit_lists FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super Admin Merit Entries" ON public.merit_list_entries FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super Admin Certificates" ON public.certificates FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super Admin Commissions" ON public.commissions FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super Admin Commission Rates" ON public.commission_rates FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super Admin Batches" ON public.payment_batches FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super Admin Reconciliation" ON public.payment_reconciliation FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super Admin System Settings" ON public.system_settings FOR ALL USING (public.is_super_admin(auth.uid()));
