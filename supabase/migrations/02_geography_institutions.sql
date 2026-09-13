-- ============================================================================
-- Migration 02: Geography, Administrative Hierarchy & Institutions
-- Jankalyan Manavadhikar Foundation
-- ============================================================================

-- 1. Districts Master Table
CREATE TABLE IF NOT EXISTS public.districts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code TEXT UNIQUE,
    state TEXT NOT NULL DEFAULT 'Madhya Pradesh',
    coordinator_user_id UUID REFERENCES public.profiles(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Blocks Master Table
CREATE TABLE IF NOT EXISTS public.blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district_id UUID NOT NULL REFERENCES public.districts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT,
    coordinator_user_id UUID REFERENCES public.profiles(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(district_id, name)
);

-- 3. Institutions (Schools, Colleges, Universities, Polytechnics)
CREATE TABLE IF NOT EXISTS public.institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT DEFAULT 'School', -- 'School', 'College', 'University', 'Polytechnic', 'ITI'
    code TEXT UNIQUE, -- AISHE / U-DISE Code
    district_id UUID NOT NULL REFERENCES public.districts(id),
    block_id UUID REFERENCES public.blocks(id),
    address TEXT,
    principal_name TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    verification_status TEXT DEFAULT 'VERIFIED', -- 'PENDING', 'VERIFIED', 'SUSPENDED'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Institution Users Binding
CREATE TABLE IF NOT EXISTS public.institution_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    designation TEXT DEFAULT 'Nodal Verification Officer',
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(institution_id, user_id)
);

-- 5. Online Centers (CSC / Kiosk / Cyber Centers)
CREATE TABLE IF NOT EXISTS public.online_centers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    center_code TEXT UNIQUE NOT NULL,
    operator_user_id UUID REFERENCES public.profiles(id),
    operator_name TEXT NOT NULL,
    operator_mobile TEXT NOT NULL,
    district_id UUID NOT NULL REFERENCES public.districts(id),
    block_id UUID REFERENCES public.blocks(id),
    address TEXT,
    commission_rate_override NUMERIC(10,2),
    is_verified BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blocks_district_id ON public.blocks(district_id);
CREATE INDEX IF NOT EXISTS idx_institutions_district_id ON public.institutions(district_id);
CREATE INDEX IF NOT EXISTS idx_institutions_block_id ON public.institutions(block_id);
CREATE INDEX IF NOT EXISTS idx_institution_users_user_id ON public.institution_users(user_id);
CREATE INDEX IF NOT EXISTS idx_online_centers_user_id ON public.online_centers(operator_user_id);
