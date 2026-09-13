-- ============================================================================
-- Migration 06: Zero-Code CMS, Hero Slideshow, Media Library & Notices
-- Jankalyan Manavadhikar Foundation
-- ============================================================================

-- 1. CMS Pages Metadata (SEO, OG, Page Configuration)
CREATE TABLE IF NOT EXISTS public.cms_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL, -- 'home', 'about', 'scholarship', 'documents', 'downloads', 'faq', 'contact', 'grievance', 'privacy', 'terms', 'disclaimer'
    title_en TEXT NOT NULL,
    title_hi TEXT NOT NULL,
    meta_description_en TEXT,
    meta_description_hi TEXT,
    og_image_url TEXT,
    is_published BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.profiles(id)
);

-- 2. CMS Reusable Content Sections
CREATE TABLE IF NOT EXISTS public.cms_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES public.cms_pages(id) ON DELETE CASCADE,
    section_key TEXT NOT NULL, -- 'hero', 'overview', 'mission', 'vision', 'objectives', 'trust_indicators', 'contact_details'
    title_en TEXT,
    title_hi TEXT,
    content_en TEXT,
    content_hi TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 1,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(page_id, section_key)
);

-- 3. Hero Slides (Dynamic Slideshow with Configurable Duration & Media)
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    video_url TEXT,
    alt_text_en TEXT,
    alt_text_hi TEXT,
    eyebrow_en TEXT DEFAULT 'Official Scholarship Scheme 2026-27',
    eyebrow_hi TEXT DEFAULT 'आधिकारिक छात्रवृत्ति योजना 2026-27',
    heading_en TEXT,
    heading_hi TEXT,
    description_en TEXT,
    description_hi TEXT,
    cta_apply_text_en TEXT DEFAULT 'Apply Online Now',
    cta_apply_text_hi TEXT DEFAULT 'ऑनलाइन आवेदन करें',
    cta_apply_url TEXT DEFAULT '/apply',
    cta_track_text_en TEXT DEFAULT 'Track Application',
    cta_track_text_hi TEXT DEFAULT 'आवेदन स्थिति ट्रैक करें',
    cta_track_url TEXT DEFAULT '/track',
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    slide_duration_ms INT DEFAULT 3000, -- Default 3 seconds
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Top Announcement Ticker Items
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text_en TEXT NOT NULL,
    text_hi TEXT NOT NULL,
    link_url TEXT,
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Official Notices & Circulars
CREATE TABLE IF NOT EXISTS public.notices (
    id TEXT PRIMARY KEY, -- 'NOT-2026-01'
    title_en TEXT NOT NULL,
    title_hi TEXT NOT NULL,
    category_en TEXT NOT NULL DEFAULT 'Guidelines',
    category_hi TEXT NOT NULL DEFAULT 'दिशा-निर्देश',
    content_en TEXT NOT NULL,
    content_hi TEXT NOT NULL,
    attachment_url TEXT,
    priority TEXT DEFAULT 'NORMAL', -- 'NORMAL', 'HIGH', 'CRITICAL'
    publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE,
    is_pinned BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FAQs (Bilingual Frequently Asked Questions)
CREATE TABLE IF NOT EXISTS public.faqs (
    id TEXT PRIMARY KEY, -- 'FAQ-01'
    question_en TEXT NOT NULL,
    question_hi TEXT NOT NULL,
    answer_en TEXT NOT NULL,
    answer_hi TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Team Members & Executive Board
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role_en TEXT NOT NULL,
    role_hi TEXT NOT NULL,
    bio_en TEXT,
    bio_hi TEXT,
    photo_url TEXT,
    contact_email TEXT,
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Downloads Center (PDF Application Forms, Handbooks, Templates)
CREATE TABLE IF NOT EXISTS public.downloads (
    id TEXT PRIMARY KEY, -- 'DL-01'
    title_en TEXT NOT NULL,
    title_hi TEXT NOT NULL,
    category_en TEXT NOT NULL,
    category_hi TEXT NOT NULL,
    file_url TEXT,
    format TEXT DEFAULT 'PDF',
    size_display TEXT DEFAULT '500 KB',
    version TEXT DEFAULT '1.0',
    download_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Media Assets Library (Images, Videos, PDFs)
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size_kb INT,
    mime_type TEXT NOT NULL,
    bucket_name TEXT NOT NULL DEFAULT 'cms-media',
    alt_text TEXT,
    caption TEXT,
    category TEXT DEFAULT 'general', -- 'hero', 'about', 'team', 'notices', 'gallery', 'general'
    uploaded_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Contact Inquiries Submissions Table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'NEW', -- 'NEW', 'IN_REVIEW', 'RESPONDED', 'ARCHIVED'
    response_notes TEXT,
    responded_by UUID REFERENCES public.profiles(id),
    responded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_hero_slides_order ON public.hero_slides(display_order);
CREATE INDEX IF NOT EXISTS idx_notices_published ON public.notices(is_published, publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_faqs_order ON public.faqs(display_order);
CREATE INDEX IF NOT EXISTS idx_downloads_active ON public.downloads(is_active);
CREATE INDEX IF NOT EXISTS idx_contact_status ON public.contact_submissions(status);
