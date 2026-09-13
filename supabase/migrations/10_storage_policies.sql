-- Storage RLS Policies
CREATE POLICY "Public Read for Public Buckets" ON storage.objects
FOR SELECT USING (bucket_id IN ('downloads', 'cms-media'));

CREATE POLICY "Allow Upload to Allowed Buckets" ON storage.objects
FOR INSERT WITH CHECK (bucket_id IN ('student-documents', 'profile-photos', 'cms-media', 'downloads', 'certificates', 'institution-documents', 'exports'));

CREATE POLICY "Allow Read on Private Buckets" ON storage.objects
FOR SELECT USING (true);

CREATE POLICY "Allow Update on Objects" ON storage.objects
FOR UPDATE USING (true);
