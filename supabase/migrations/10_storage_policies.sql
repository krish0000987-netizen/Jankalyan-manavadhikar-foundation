-- ============================================================================
-- Migration 10: Storage RLS Policies (Idempotent)
-- Jankalyan Manavadhikar Foundation
-- ============================================================================

DROP POLICY IF EXISTS "Public Read for Public Buckets" ON storage.objects;
CREATE POLICY "Public Read for Public Buckets" ON storage.objects
FOR SELECT USING (bucket_id IN ('downloads', 'cms-media'));

DROP POLICY IF EXISTS "Allow Upload to Allowed Buckets" ON storage.objects;
CREATE POLICY "Allow Upload to Allowed Buckets" ON storage.objects
FOR INSERT WITH CHECK (bucket_id IN ('student-documents', 'profile-photos', 'cms-media', 'downloads', 'certificates', 'institution-documents', 'exports'));

DROP POLICY IF EXISTS "Allow Read on Private Buckets" ON storage.objects;
CREATE POLICY "Allow Read on Private Buckets" ON storage.objects
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow Update on Objects" ON storage.objects;
CREATE POLICY "Allow Update on Objects" ON storage.objects
FOR UPDATE USING (true);
