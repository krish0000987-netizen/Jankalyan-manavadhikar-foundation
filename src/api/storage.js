import { supabase } from './supabase';

/**
 * Upload a file to a specific Supabase storage bucket
 * @param {string} bucket - 'student-documents', 'cms-media', 'downloads', 'profile-photos'
 * @param {string} path - path inside the bucket, e.g. 'JMF-2026-108234/aadhaar.pdf'
 * @param {File|Blob} file - file object
 * @param {Object} options - { upsert: true }
 */
export async function uploadFile(bucket, path, file, options = { upsert: true }) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, options);

  if (error) throw error;
  return data;
}

/**
 * Get a public URL for public buckets ('cms-media', 'downloads')
 */
export function getPublicUrl(bucket, path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/assets/')) {
    return path;
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl || '';
}

/**
 * Get a secure signed URL for private buckets ('student-documents', 'certificates')
 * @param {string} bucket
 * @param {string} path
 * @param {number} expiresInSeconds (default 1 hour)
 */
export async function getSignedUrl(bucket, path, expiresInSeconds = 3600) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/assets/')) {
    return path;
  }
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresInSeconds);

  if (error) {
    console.warn(`Could not create signed URL for ${bucket}/${path}:`, error.message);
    return '';
  }
  return data?.signedUrl || '';
}

/**
 * Validate a file before uploading
 */
export function validateDocumentFile(file, maxKb = 3072, allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']) {
  if (!file) return { valid: false, error: 'No file selected' };
  
  if (file.size > maxKb * 1024) {
    return { 
      valid: false, 
      error: `File size exceeds ${Math.round(maxKb / 1024)}MB limit (${(file.size / (1024 * 1024)).toFixed(2)}MB)` 
    };
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Allowed: JPG, PNG, PDF`
    };
  }

  return { valid: true };
}
