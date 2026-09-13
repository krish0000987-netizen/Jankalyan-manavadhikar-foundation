-- ============================================================================
-- Migration 07: Grievances, CSR Donors, Merit Lists, Certificates & Notifications
-- Jankalyan Manavadhikar Foundation
-- ============================================================================

-- 1. Grievance Redressal Tickets
CREATE TABLE IF NOT EXISTS public.grievances (
    id TEXT PRIMARY KEY, -- 'GRV-2026-00482'
    student_name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT,
    application_id TEXT REFERENCES public.applications(id),
    category TEXT NOT NULL, -- 'Document Re-upload', 'Payment Query', 'Eligibility Clarification', 'Correction Request', 'General Helpdesk'
    subject TEXT,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'OPEN',
    -- 'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'WAITING_FOR_STUDENT', 'RESOLVED', 'CLOSED', 'REOPENED'
    priority TEXT DEFAULT 'MEDIUM', -- 'LOW', 'MEDIUM', 'HIGH', 'URGENT'
    assigned_to UUID REFERENCES public.profiles(id),
    resolved_by UUID REFERENCES public.profiles(id),
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Grievance Message Threads (Student <-> Officer Conversation)
CREATE TABLE IF NOT EXISTS public.grievance_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grievance_id TEXT NOT NULL REFERENCES public.grievances(id) ON DELETE CASCADE,
    sender_user_id UUID REFERENCES public.profiles(id),
    sender_name TEXT NOT NULL,
    sender_role TEXT NOT NULL, -- 'STUDENT', 'OFFICER', 'ADMIN'
    message TEXT NOT NULL,
    attachment_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CSR Corporate & Philanthropic Donors
CREATE TABLE IF NOT EXISTS public.donors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    contact_email TEXT,
    contact_mobile TEXT,
    pan_number TEXT,
    csr_registration_number TEXT,
    tax_exemption_80g_number TEXT,
    address TEXT,
    logo_url TEXT,
    website TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Donor Contributions
CREATE TABLE IF NOT EXISTS public.donor_contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id UUID NOT NULL REFERENCES public.donors(id) ON DELETE CASCADE,
    amount NUMERIC(12,2) NOT NULL,
    contribution_date DATE NOT NULL DEFAULT CURRENT_DATE,
    reference_number TEXT NOT NULL,
    payment_mode TEXT DEFAULT 'NEFT/RTGS',
    academic_year TEXT DEFAULT '2026-27',
    purpose_scheme_id UUID REFERENCES public.scholarship_schemes(id),
    receipt_number TEXT UNIQUE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Fund Allocations
CREATE TABLE IF NOT EXISTS public.fund_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contribution_id UUID REFERENCES public.donor_contributions(id),
    scheme_id UUID REFERENCES public.scholarship_schemes(id),
    district_id UUID REFERENCES public.districts(id),
    allocated_amount NUMERIC(12,2) NOT NULL,
    utilized_amount NUMERIC(12,2) DEFAULT 0.00,
    allocation_date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Configurable Merit Selection Rules
CREATE TABLE IF NOT EXISTS public.merit_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheme_id UUID NOT NULL REFERENCES public.scholarship_schemes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    weight_percentage NUMERIC(5,2) DEFAULT 60.00, -- Weight for academic marks
    weight_income NUMERIC(5,2) DEFAULT 30.00, -- Weight for family income need
    weight_category NUMERIC(5,2) DEFAULT 10.00, -- Weight for priority categories
    min_cutoff_score NUMERIC(5,2) DEFAULT 60.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Merit Lists Master (Versioning Support)
CREATE TABLE IF NOT EXISTS public.merit_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheme_id UUID NOT NULL REFERENCES public.scholarship_schemes(id),
    merit_rule_id UUID REFERENCES public.merit_rules(id),
    title TEXT NOT NULL,
    academic_year TEXT DEFAULT '2026-27',
    round_number INT DEFAULT 1,
    total_candidates INT DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'DRAFT', -- 'DRAFT', 'PREVIEW', 'PUBLISHED', 'ARCHIVED'
    published_at TIMESTAMPTZ,
    published_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Merit List Entries (Individual Ranked Students)
CREATE TABLE IF NOT EXISTS public.merit_list_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merit_list_id UUID NOT NULL REFERENCES public.merit_lists(id) ON DELETE CASCADE,
    application_id TEXT NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    rank_number INT NOT NULL,
    calculated_score NUMERIC(6,2) NOT NULL,
    selection_status TEXT DEFAULT 'SELECTED', -- 'SELECTED', 'WAITLISTED', 'DISQUALIFIED'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(merit_list_id, application_id)
);

-- 9. Scholarship Award Certificates
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_number TEXT UNIQUE NOT NULL, -- e.g. 'CERT-JMF-2026-00124'
    application_id TEXT NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    scheme_name TEXT NOT NULL,
    academic_year TEXT NOT NULL DEFAULT '2026-27',
    grant_amount NUMERIC(10,2) NOT NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    verification_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
    qr_url TEXT,
    pdf_url TEXT,
    issued_by_title TEXT DEFAULT 'Scholarship Committee, Jankalyan Manavadhikar Foundation',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. QR Scan Verification Logs
CREATE TABLE IF NOT EXISTS public.qr_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_type TEXT NOT NULL, -- 'application', 'certificate', 'receipt'
    target_identifier TEXT NOT NULL,
    verification_token TEXT NOT NULL,
    scanned_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT
);

-- 11. Notification Templates (Bilingual)
CREATE TABLE IF NOT EXISTS public.notification_templates (
    id TEXT PRIMARY KEY, -- 'APP_SUBMITTED', 'DOC_CORRECTION', 'APP_APPROVED', 'SCHOLARSHIP_RELEASED', 'GRIEVANCE_RESOLVED'
    title_en TEXT NOT NULL,
    title_hi TEXT NOT NULL,
    body_en TEXT NOT NULL,
    body_hi TEXT NOT NULL,
    supported_channels TEXT[] DEFAULT ARRAY['IN_APP', 'SMS', 'EMAIL', 'WHATSAPP'],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.notification_templates (id, title_en, title_hi, body_en, body_hi) VALUES
('APP_SUBMITTED', 'Application Received', 'आवेदन प्राप्त हुआ', 'Dear {{student_name}}, your scholarship application {{application_id}} has been received successfully.', 'प्रिय {{student_name}}, आपका छात्रवृत्ति आवेदन {{application_id}} सफलतापूर्वक प्राप्त हो गया है।'),
('DOC_CORRECTION', 'Document Correction Required', 'दस्तावेज़ संशोधन आवश्यक', 'Dear {{student_name}}, correction is requested for your application {{application_id}}: {{remarks}}', 'प्रिय {{student_name}}, आपके आवेदन {{application_id}} में दस्तावेज़ सुधार आवश्यक है: {{remarks}}'),
('APP_APPROVED', 'Scholarship Approved', 'छात्रवृत्ति स्वीकृत', 'Congratulations {{student_name}}! Your scholarship application {{application_id}} has been approved by the committee.', 'बधाई हो {{student_name}}! आपका छात्रवृत्ति आवेदन {{application_id}} समिति द्वारा स्वीकृत कर लिया गया है।'),
('SCHOLARSHIP_RELEASED', 'Scholarship Disbursed', 'छात्रवृत्ति राशि जारी', 'Dear {{student_name}}, scholarship amount of {{scholarship_amount}} has been released to your bank account with UTR {{utr_number}}.', 'प्रिय {{student_name}}, छात्रवृत्ति राशि {{scholarship_amount}} आपके बैंक खाते में UTR {{utr_number}} द्वारा अंतरित कर दी गई है।'),
('GRIEVANCE_RESOLVED', 'Grievance Resolved', 'शिकायत का समाधान', 'Dear {{student_name}}, your grievance ticket {{grievance_id}} has been resolved: {{remarks}}', 'प्रिय {{student_name}}, आपकी शिकायत संख्या {{grievance_id}} का समाधान कर दिया गया है: {{remarks}}')
ON CONFLICT (id) DO NOTHING;

-- 12. User In-App Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    application_id TEXT REFERENCES public.applications(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    channel TEXT DEFAULT 'IN_APP',
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Centralized Notification Logs (Dispatch History)
CREATE TABLE IF NOT EXISTS public.notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_identifier TEXT NOT NULL, -- mobile or email
    template_id TEXT REFERENCES public.notification_templates(id),
    channel TEXT NOT NULL, -- 'SMS', 'EMAIL', 'WHATSAPP', 'IN_APP'
    payload JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'SENT', -- 'SENT', 'DELIVERED', 'FAILED'
    provider_response JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_grievances_app ON public.grievances(application_id);
CREATE INDEX IF NOT EXISTS idx_grievances_status ON public.grievances(status);
CREATE INDEX IF NOT EXISTS idx_certificates_app ON public.certificates(application_id);
CREATE INDEX IF NOT EXISTS idx_certificates_token ON public.certificates(verification_token);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);
