-- ============================================================================
-- Migration 03: Schemes, Students & Multi-Step Scholarship Applications
-- Jankalyan Manavadhikar Foundation
-- ============================================================================

-- 1. Scholarship Schemes Master Table
CREATE TABLE IF NOT EXISTS public.scholarship_schemes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL, -- e.g. 'JMF-SCHOLARSHIP-2026'
    name TEXT NOT NULL,
    description TEXT,
    academic_year TEXT NOT NULL DEFAULT '2026-27',
    grant_amount NUMERIC(10,2) NOT NULL DEFAULT 12000.00,
    grant_amount_display TEXT DEFAULT '₹12,000 / Session',
    application_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    application_end_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '90 days'),
    application_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    is_fee_applicable BOOLEAN DEFAULT false,
    payment_required_before_submission BOOLEAN DEFAULT false,
    eligibility_overview TEXT DEFAULT 'Class 10th/12th/Graduation/Diploma/Post-Graduation students with min 50% qualifying marks and family income under criteria limits.',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Scheme Eligibility Rules Table
CREATE TABLE IF NOT EXISTS public.scheme_eligibility_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheme_id UUID NOT NULL REFERENCES public.scholarship_schemes(id) ON DELETE CASCADE,
    min_percentage NUMERIC(5,2) DEFAULT 50.00,
    max_annual_income NUMERIC(12,2) DEFAULT 300000.00,
    eligible_categories TEXT[] DEFAULT ARRAY['General', 'SC', 'ST', 'OBC', 'EWS', 'Minority'],
    eligible_courses TEXT[] DEFAULT ARRAY['Class 10th', 'Class 11th', 'Class 12th', 'Diploma / ITI', 'B.A.', 'B.Sc.', 'B.Com.', 'B.Tech / B.E.', 'M.A.', 'M.Sc.', 'M.Com.', 'MBA', 'MCA', 'Other'],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Students Entity (Links to auth.users if registered)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    father_name TEXT NOT NULL,
    mother_name TEXT,
    dob DATE NOT NULL,
    gender TEXT NOT NULL, -- 'Male', 'Female', 'Other'
    mobile TEXT NOT NULL,
    email TEXT,
    category TEXT NOT NULL DEFAULT 'General', -- 'General', 'SC', 'ST', 'OBC', 'EWS'
    aadhaar_masked TEXT, -- e.g. 'XXXX-XXXX-4829'
    aadhaar_hash TEXT, -- SHA-256 hash for duplicate check without exposing Aadhaar plaintext
    samagra_id TEXT,
    annual_income NUMERIC(12,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Student Addresses Table
CREATE TABLE IF NOT EXISTS public.students_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    address_line TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Madhya Pradesh',
    district TEXT NOT NULL,
    block TEXT NOT NULL,
    village_town TEXT,
    pincode TEXT NOT NULL,
    is_permanent BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Student Academic Records Table
CREATE TABLE IF NOT EXISTS public.academic_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    institution_id UUID REFERENCES public.institutions(id),
    institution_name TEXT NOT NULL,
    class_course TEXT NOT NULL,
    stream TEXT,
    academic_year TEXT NOT NULL DEFAULT '2026-27',
    board_university TEXT,
    roll_number TEXT,
    enrollment_number TEXT,
    admission_date DATE,
    prev_examination TEXT,
    prev_marks_obtained NUMERIC(8,2),
    prev_max_marks NUMERIC(8,2),
    prev_percentage NUMERIC(5,2) NOT NULL,
    prev_grade TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Student Bank Details Table
CREATE TABLE IF NOT EXISTS public.bank_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    account_holder_name TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    branch_name TEXT,
    account_number_masked TEXT NOT NULL, -- 'XXXX-XXXX-1234'
    account_number_encrypted TEXT, -- Securely stored full account
    ifsc_code TEXT NOT NULL,
    account_type TEXT DEFAULT 'Savings',
    is_aadhaar_seeded BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Sequence for Official Application ID (JMF-2026-XXXXXX)
CREATE SEQUENCE IF NOT EXISTS application_id_seq START 100001;

-- 8. Applications Master Table
CREATE TABLE IF NOT EXISTS public.applications (
    id TEXT PRIMARY KEY, -- 'JMF-2026-108234'
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    scheme_id UUID NOT NULL REFERENCES public.scholarship_schemes(id),
    institution_id UUID REFERENCES public.institutions(id),
    district_id UUID REFERENCES public.districts(id),
    block_id UUID REFERENCES public.blocks(id),
    online_center_id UUID REFERENCES public.online_centers(id),
    
    -- Status & Workflow
    status TEXT NOT NULL DEFAULT 'DRAFT',
    -- 'DRAFT', 'SUBMITTED', 'UNDER_VERIFICATION', 'CORRECTION_REQUESTED', 'RE_SUBMITTED', 
    -- 'INSTITUTION_RECOMMENDED', 'BLOCK_RECOMMENDED', 'DISTRICT_RECOMMENDED', 
    -- 'APPROVED', 'REJECTED', 'PAYMENT_PENDING', 'PAYMENT_PROCESSING', 'PAYMENT_FAILED', 'SCHOLARSHIP_RELEASED'
    
    stage INT DEFAULT 1, -- 1 to 5 for UI timeline
    disbursed_amount NUMERIC(10,2),
    utr_number TEXT,
    submission_date DATE,
    approval_date DATE,
    payment_date DATE,
    rejection_reason TEXT,
    correction_remarks TEXT,
    
    -- Verification Token for QR Code
    verification_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
    
    -- Metadata
    academic_year TEXT DEFAULT '2026-27',
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-generate Application ID function & trigger
CREATE OR REPLACE FUNCTION generate_application_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.id IS NULL OR NEW.id = '' THEN
        NEW.id := 'JMF-2026-' || nextval('application_id_seq')::TEXT;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_generate_application_id ON public.applications;
CREATE TRIGGER trg_generate_application_id
BEFORE INSERT ON public.applications
FOR EACH ROW
EXECUTE FUNCTION generate_application_id();

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON public.applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_district_id ON public.applications(district_id);
CREATE INDEX IF NOT EXISTS idx_applications_block_id ON public.applications(block_id);
CREATE INDEX IF NOT EXISTS idx_applications_institution_id ON public.applications(institution_id);
CREATE INDEX IF NOT EXISTS idx_applications_center_id ON public.applications(online_center_id);
CREATE INDEX IF NOT EXISTS idx_applications_token ON public.applications(verification_token);
CREATE INDEX IF NOT EXISTS idx_students_mobile ON public.students(mobile);
CREATE INDEX IF NOT EXISTS idx_students_aadhaar_hash ON public.students(aadhaar_hash);
