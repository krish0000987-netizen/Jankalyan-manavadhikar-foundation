-- ============================================================================
-- Migration 05: Workflow History, DBT Payments, Gateway Abstraction & Commissions
-- Jankalyan Manavadhikar Foundation
-- ============================================================================

-- 1. Application Status Transition History (Immutable)
CREATE TABLE IF NOT EXISTS public.application_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id TEXT NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    actor_id UUID REFERENCES public.profiles(id),
    actor_role TEXT NOT NULL,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Payment Batches (DBT Bulk Distribution)
CREATE TABLE IF NOT EXISTS public.payment_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_number TEXT UNIQUE NOT NULL, -- e.g. 'BATCH-2026-09-001'
    academic_year TEXT DEFAULT '2026-27',
    total_students INT NOT NULL DEFAULT 0,
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'PENDING',
    -- 'PENDING', 'READY', 'PROCESSING', 'COMPLETED', 'FAILED', 'RECONCILED'
    created_by UUID REFERENCES public.profiles(id),
    processed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Individual Scholarship Payments (Direct Benefit Transfer Ledger)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id TEXT NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id),
    batch_id UUID REFERENCES public.payment_batches(id),
    amount NUMERIC(10,2) NOT NULL,
    bank_account_masked TEXT NOT NULL,
    ifsc_code TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    -- 'PENDING', 'READY', 'PROCESSING', 'SUCCESS', 'FAILED', 'RETRY_REQUIRED', 'CANCELLED'
    payment_method TEXT DEFAULT 'DIRECT_BENEFIT_TRANSFER', -- 'DIRECT_BENEFIT_TRANSFER', 'GATEWAY', 'NEFT', 'RTGS'
    utr_number TEXT,
    transaction_reference TEXT,
    gateway_provider TEXT DEFAULT 'MANUAL_DBT', -- 'MANUAL_DBT', 'RAZORPAY', 'CASHFREE', 'PAYU'
    failure_reason TEXT,
    payment_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Payment Gateway Webhook Transactions Log
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES public.payments(id),
    application_id TEXT REFERENCES public.applications(id),
    provider TEXT NOT NULL, -- 'razorpay', 'cashfree', 'payu', 'bank_dbt'
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    signature_verified BOOLEAN DEFAULT false,
    processed_status TEXT DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Payment Reconciliation
CREATE TABLE IF NOT EXISTS public.payment_reconciliation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID REFERENCES public.payment_batches(id),
    reconciliation_date DATE DEFAULT CURRENT_DATE,
    total_ledger_amount NUMERIC(12,2) NOT NULL,
    total_bank_amount NUMERIC(12,2) NOT NULL,
    matched_records INT DEFAULT 0,
    mismatched_records INT DEFAULT 0,
    duplicate_records INT DEFAULT 0,
    status TEXT DEFAULT 'RECONCILED',
    reconciled_by UUID REFERENCES public.profiles(id),
    discrepancy_details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Commission Configuration Rates
CREATE TABLE IF NOT EXISTS public.commission_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id TEXT NOT NULL REFERENCES public.roles(id),
    model_type TEXT NOT NULL DEFAULT 'FIXED_PER_APPROVED', -- 'PERCENTAGE', 'FIXED_PER_APPLICATION', 'FIXED_PER_APPROVED'
    rate_amount NUMERIC(10,2) NOT NULL DEFAULT 50.00,
    min_form_target INT DEFAULT 0,
    role_name_hi TEXT,
    role_name_en TEXT,
    display_order INT DEFAULT 1,
    rate_display TEXT DEFAULT '₹50 per verified application',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(role_id)
);

INSERT INTO public.commission_rates (role_id, model_type, rate_amount, min_form_target, role_name_hi, role_name_en, rate_display, display_order) VALUES
('DISTRICT_COORDINATOR', 'FIXED_PER_APPROVED', 50.00, 1000, 'जिला समन्वयक', 'District Coordinator', '₹50 प्रति सफल आवेदन (न्यूनतम लक्ष्य: 1000 फॉर्म)', 1),
('BLOCK_COORDINATOR', 'FIXED_PER_APPROVED', 40.00, 500, 'ब्लॉक समन्वयक', 'Block Coordinator', '₹40 प्रति सफल आवेदन (न्यूनतम लक्ष्य: 500 फॉर्म)', 2),
('TEHSIL_COORDINATOR', 'FIXED_PER_APPROVED', 35.00, 300, 'तहसील समन्वयक', 'Tehsil Coordinator', '₹35 प्रति सफल आवेदन (न्यूनतम लक्ष्य: 300 फॉर्म)', 3),
('GRAM_PANCHAYAT_COORDINATOR', 'FIXED_PER_APPROVED', 25.00, 100, 'ग्राम पंचायत समन्वयक', 'Gram Panchayat Coordinator', '₹25 प्रति सफल आवेदन (न्यूनतम लक्ष्य: 100 फॉर्म)', 4),
('ONLINE_CENTER', 'FIXED_PER_APPLICATION', 30.00, 50, 'ऑनलाइन शॉप / CSC / साइबर कैफे', 'Online Shop / CSC / Cyber Cafe', '₹30 प्रति सफल आवेदन (न्यूनतम लक्ष्य: 50 फॉर्म)', 5),
('SCHOOL_COORDINATOR', 'FIXED_PER_APPROVED', 25.00, 100, 'स्कूल', 'School Coordinator', '₹25 प्रति सफल आवेदन (न्यूनतम लक्ष्य: 100 फॉर्म)', 6),
('COLLEGE_COORDINATOR', 'FIXED_PER_APPROVED', 30.00, 150, 'कॉलेज', 'College Coordinator', '₹30 प्रति सफल आवेदन (न्यूनतम लक्ष्य: 150 फॉर्म)', 7),
('COACHING_CENTER', 'FIXED_PER_APPROVED', 20.00, 100, 'कोचिंग सेंटर', 'Coaching Center', '₹20 प्रति सफल आवेदन (न्यूनतम लक्ष्य: 100 फॉर्म)', 8),
('INSTITUTION', 'FIXED_PER_APPROVED', 25.00, 100, 'स्कूल / शैक्षणिक संस्थान', 'Educational Institution', '₹25 प्रति सफल आवेदन (न्यूनतम लक्ष्य: 100 फॉर्म)', 9)
ON CONFLICT (role_id) DO UPDATE SET
  rate_amount = EXCLUDED.rate_amount,
  min_form_target = EXCLUDED.min_form_target,
  role_name_hi = EXCLUDED.role_name_hi,
  role_name_en = EXCLUDED.role_name_en,
  rate_display = EXCLUDED.rate_display,
  display_order = EXCLUDED.display_order;

-- 7. Commissions Generated
CREATE TABLE IF NOT EXISTS public.commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_user_id UUID NOT NULL REFERENCES public.profiles(id),
    beneficiary_role TEXT NOT NULL,
    application_id TEXT NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    rate_id UUID REFERENCES public.commission_rates(id),
    amount NUMERIC(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'CALCULATED',
    -- 'CALCULATED', 'PENDING_APPROVAL', 'APPROVED', 'PAYMENT_PENDING', 'PAID', 'FAILED'
    settlement_id UUID,
    approved_by UUID REFERENCES public.profiles(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Commission Settlements / Payouts
CREATE TABLE IF NOT EXISTS public.commission_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    settlement_reference TEXT UNIQUE NOT NULL,
    beneficiary_user_id UUID NOT NULL REFERENCES public.profiles(id),
    total_amount NUMERIC(12,2) NOT NULL,
    total_applications INT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    bank_account_masked TEXT,
    ifsc_code TEXT,
    utr_number TEXT,
    disbursed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_status_history_app ON public.application_status_history(application_id);
CREATE INDEX IF NOT EXISTS idx_payments_app ON public.payments(application_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_batch ON public.payments(batch_id);
CREATE INDEX IF NOT EXISTS idx_commissions_beneficiary ON public.commissions(beneficiary_user_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON public.commissions(status);
