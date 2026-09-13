-- ============================================================================
-- Migration 01: Core Schema, Auth Roles, System Settings, Audit Logs
-- Jankalyan Manavadhikar Foundation
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    mobile TEXT,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Master Roles Table
CREATE TABLE IF NOT EXISTS public.roles (
    id TEXT PRIMARY KEY, -- 'SUPER_ADMIN', 'DISTRICT_COORDINATOR', 'BLOCK_COORDINATOR', 'INSTITUTION', 'ONLINE_CENTER', 'STUDENT'
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.roles (id, name, description) VALUES
('SUPER_ADMIN', 'Super Administrator', 'Unrestricted administrative authority across all modules and jurisdictions'),
('DISTRICT_COORDINATOR', 'District Coordinator', 'Jurisdiction restricted to assigned district records and scrutiny'),
('BLOCK_COORDINATOR', 'Block Coordinator', 'Jurisdiction restricted to assigned block records and scrutiny'),
('INSTITUTION', 'School / College Nodal Officer', 'Restricted to enrolled applicants and verification for own institution'),
('ONLINE_CENTER', 'Online Application Center (CSC)', 'Restricted to applications facilitated through own center'),
('STUDENT', 'Student Applicant', 'Personal applicant dashboard, document submission and tracking')
ON CONFLICT (id) DO NOTHING;

-- 3. User Roles Mapping Table (Users can have multiple roles if applicable)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_id TEXT NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- 4. System Settings (Key-Value Config for Global Parameters)
CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.profiles(id)
);

-- 5. Audit Logs Table (Tamper-Resistant Audit Trail)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id),
    actor_role TEXT,
    action TEXT NOT NULL, -- 'LOGIN', 'LOGOUT', 'STATUS_CHANGE', 'VERIFY_DOC', 'APPROVE_APP', 'REJECT_APP', 'PAYMENT_DISBURSED', 'CMS_UPDATE', 'EXPORT_DATA'
    entity_type TEXT NOT NULL, -- 'application', 'document', 'payment', 'cms', 'user', 'grievance'
    entity_id TEXT,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
