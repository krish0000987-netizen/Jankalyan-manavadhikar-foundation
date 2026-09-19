import { supabase } from './supabase.js';

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
 * Clean path by stripping bucket prefix and leading slashes if present
 */
export function cleanStoragePath(bucket, path) {
  if (!path) return '';
  let cleaned = String(path).trim();
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://') || cleaned.startsWith('data:') || cleaned.startsWith('blob:')) {
    return cleaned;
  }
  // Remove leading slash
  if (cleaned.startsWith('/')) {
    cleaned = cleaned.slice(1);
  }
  // If bucket prefix was included, e.g. "student-documents/JMF-..."
  if (bucket && cleaned.startsWith(`${bucket}/`)) {
    cleaned = cleaned.slice(bucket.length + 1);
  }
  return cleaned;
}

/**
 * Get a secure signed URL for private buckets ('student-documents', 'certificates')
 * @param {string} bucket
 * @param {string} path
 * @param {number} expiresInSeconds (default 2 hours)
 */
export async function getSignedUrl(bucket, path, expiresInSeconds = 7200) {
  if (!path) return '';
  const cleaned = cleanStoragePath(bucket, path);
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://') || cleaned.startsWith('data:') || cleaned.startsWith('blob:') || cleaned.startsWith('/assets/')) {
    return cleaned;
  }
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(cleaned, expiresInSeconds);

  if (error) {
    console.warn(`Could not create signed URL for ${bucket}/${cleaned}:`, error.message);
    // Fallback attempt with getPublicUrl
    const pub = supabase.storage.from(bucket).getPublicUrl(cleaned);
    return pub?.data?.publicUrl || '';
  }
  return data?.signedUrl || '';
}

/**
 * Universal document URL resolver: returns a signed URL for private buckets or public URL for public ones
 */
export async function getDocumentViewUrl(bucket = 'student-documents', path, expiresInSeconds = 7200) {
  if (!path) return '';
  const cleaned = cleanStoragePath(bucket, path);
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://') || cleaned.startsWith('data:') || cleaned.startsWith('blob:') || cleaned.startsWith('/assets/')) {
    return cleaned;
  }

  // Private buckets require signed URLs
  const privateBuckets = ['student-documents', 'certificates', 'exports', 'institution-documents', 'profile-photos'];
  if (privateBuckets.includes(bucket)) {
    const signed = await getSignedUrl(bucket, cleaned, expiresInSeconds);
    if (signed) return signed;
  }

  return getPublicUrl(bucket, cleaned);
}

/**
 * Download a file from private or public Supabase storage
 */
export async function downloadStorageFile(bucket, path, fileName = 'document') {
  if (!path) return;
  const cleaned = cleanStoragePath(bucket, path);
  try {
    const { data: blob, error } = await supabase.storage
      .from(bucket)
      .download(cleaned);

    if (error || !blob) {
      // Fallback via signed URL fetch
      const url = await getSignedUrl(bucket, cleaned);
      if (url) {
        window.open(url, '_blank');
      }
      return;
    }

    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName || cleaned.split('/').pop() || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
  } catch (err) {
    console.warn('Storage download error:', err);
    const url = await getSignedUrl(bucket, cleaned);
    if (url) window.open(url, '_blank');
  }
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
