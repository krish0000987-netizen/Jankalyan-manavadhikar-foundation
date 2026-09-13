-- ============================================================================
-- Migration 04: Document Management, Scrutiny & Storage Buckets
-- Jankalyan Manavadhikar Foundation
-- ============================================================================

-- 1. Document Types Catalog
CREATE TABLE IF NOT EXISTS public.document_types (
    id TEXT PRIMARY KEY, -- 'photo', 'aadhaar', 'marksheet', 'bonafide', 'passbook', 'income', 'caste'
    name_en TEXT NOT NULL,
    name_hi TEXT NOT NULL,
    is_required BOOLEAN DEFAULT true,
    max_size_kb INT DEFAULT 2048, -- 2MB
    allowed_mimes TEXT[] DEFAULT ARRAY['image/jpeg', 'image/png', 'application/pdf'],
    display_order INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.document_types (id, name_en, name_hi, is_required, max_size_kb, display_order) VALUES
('photo', 'Passport-size Photograph', 'पासपोर्ट आकार का फोटो', true, 1024, 1),
('aadhaar', 'Aadhaar Card (UIDAI)', 'आधार कार्ड (UIDAI)', true, 2048, 2),
('marksheet', 'Qualifying Marksheet', 'पिछली परीक्षा की अंकसूची', true, 3072, 3),
('bonafide', 'Institutional Bonafide / Admission Slip', 'संस्थान प्रवेश / बोनाफाइड प्रमाण पत्र', true, 3072, 4),
('passbook', 'Bank Passbook / Statement Copy', 'बैंक पासबुक / खाता विवरण प्रति', true, 2048, 5),
('income', 'Income Certificate', 'सक्षम आय प्रमाण पत्र', false, 2048, 6),
('caste', 'Caste / Category Certificate', 'जाति / श्रेणी प्रमाण पत्र', false, 2048, 7)
ON CONFLICT (id) DO NOTHING;

-- 2. Application Documents
CREATE TABLE IF NOT EXISTS public.application_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id TEXT NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    document_type_id TEXT NOT NULL REFERENCES public.document_types(id),
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size_kb INT,
    mime_type TEXT,
    bucket_name TEXT NOT NULL DEFAULT 'student-documents',
    verification_status TEXT NOT NULL DEFAULT 'UPLOADED',
    -- 'UPLOADED', 'UNDER_REVIEW', 'VALID', 'INVALID', 'CORRECTION_REQUIRED'
    rejection_reason TEXT,
    verifier_id UUID REFERENCES public.profiles(id),
    verified_at TIMESTAMPTZ,
    upload_timestamp TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(application_id, document_type_id)
);

-- 3. Document Scrutiny Audit Log
CREATE TABLE IF NOT EXISTS public.document_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.application_documents(id) ON DELETE CASCADE,
    application_id TEXT NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    verifier_id UUID NOT NULL REFERENCES public.profiles(id),
    previous_status TEXT,
    new_status TEXT NOT NULL,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Required Storage Buckets in storage.buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
('student-documents', 'student-documents', false, 5242880, ARRAY['image/jpeg', 'image/png', 'application/pdf']),
('profile-photos', 'profile-photos', false, 2097152, ARRAY['image/jpeg', 'image/png']),
('institution-documents', 'institution-documents', false, 5242880, ARRAY['image/jpeg', 'image/png', 'application/pdf']),
('downloads', 'downloads', true, 10485760, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
('cms-media', 'cms-media', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'video/mp4']),
('certificates', 'certificates', false, 5242880, ARRAY['application/pdf', 'image/png']),
('exports', 'exports', false, 10485760, ARRAY['text/csv', 'application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_app_docs_app_id ON public.application_documents(application_id);
CREATE INDEX IF NOT EXISTS idx_app_docs_status ON public.application_documents(verification_status);
CREATE INDEX IF NOT EXISTS idx_doc_verifs_app ON public.document_verifications(application_id);
