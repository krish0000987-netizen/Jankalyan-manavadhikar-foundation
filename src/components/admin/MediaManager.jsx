import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../api/supabase';
import { uploadFile, getPublicUrl } from '../../api/storage';
import { 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Copy, 
  Check, 
  ExternalLink, 
  Search, 
  FileText, 
  Loader2, 
  RefreshCw,
  Eye,
  Plus
} from 'lucide-react';

export const MediaManager = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [previewAsset, setPreviewAsset] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const fileInputRef = useRef(null);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch from media_assets table
      const { data: dbAssets, error: dbErr } = await supabase
        .from('media_assets')
        .select('*')
        .order('created_at', { ascending: false });

      // 2. Also list objects from 'cms-media' bucket
      const { data: storageFiles } = await supabase.storage
        .from('cms-media')
        .list('', { limit: 50, sortBy: { column: 'created_at', order: 'desc' } });

      const combined = [];
      const seenUrls = new Set();

      (dbAssets || []).forEach(a => {
        seenUrls.add(a.file_url);
        combined.push({
          id: a.id,
          fileName: a.file_name,
          url: a.file_url,
          size: a.file_size_bytes ? `${(a.file_size_bytes / 1024).toFixed(1)} KB` : '120 KB',
          mimeType: a.mime_type || 'image/jpeg',
          createdAt: a.created_at
        });
      });

      (storageFiles || []).forEach(f => {
        const publicUrl = getPublicUrl('cms-media', f.name);
        if (!seenUrls.has(publicUrl)) {
          seenUrls.add(publicUrl);
          combined.push({
            id: f.id || f.name,
            fileName: f.name,
            url: publicUrl,
            size: f.metadata?.size ? `${(f.metadata.size / 1024).toFixed(1)} KB` : '180 KB',
            mimeType: f.metadata?.mimetype || 'image/jpeg',
            createdAt: f.created_at || new Date().toISOString()
          });
        }
      });

      // Default seeded demonstration assets if empty
      if (combined.length === 0) {
        combined.push(
          {
            id: 'demo-1',
            fileName: 'foundation_emblem_logo.png',
            url: '/assets/logo.png',
            size: '84 KB',
            mimeType: 'image/png',
            createdAt: new Date().toISOString()
          },
          {
            id: 'demo-2',
            fileName: 'hero_scholarship_banner.jpg',
            url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80',
            size: '420 KB',
            mimeType: 'image/jpeg',
            createdAt: new Date().toISOString()
          },
          {
            id: 'demo-3',
            fileName: 'classroom_empowerment.jpg',
            url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&q=80',
            size: '390 KB',
            mimeType: 'image/jpeg',
            createdAt: new Date().toISOString()
          }
        );
      }

      setAssets(combined);
    } catch (err) {
      console.error('Error loading media assets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `uploads/${Date.now()}_${cleanName}`;

      // 1. Upload to Supabase Storage
      await uploadFile('cms-media', storagePath, file, { upsert: true });
      const publicUrl = getPublicUrl('cms-media', storagePath);

      // 2. Register in media_assets table
      await supabase.from('media_assets').insert([{
        file_name: file.name,
        file_url: publicUrl,
        bucket_name: 'cms-media',
        mime_type: file.type,
        file_size_bytes: file.size,
        alt_text: file.name
      }]);

      setFeedback({ type: 'success', message: `File "${file.name}" uploaded successfully to CMS Media!` });
      loadData();
    } catch (err) {
      console.error('Upload error:', err);
      setFeedback({ type: 'error', message: err.message || 'Upload failed.' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const copyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async (asset) => {
    if (!window.confirm(`Delete media asset "${asset.fileName}"?`)) return;
    try {
      await supabase.from('media_assets').delete().eq('file_url', asset.url);
      setAssets(prev => prev.filter(a => a.id !== asset.id));
      setFeedback({ type: 'success', message: 'Media asset removed.' });
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const filtered = assets.filter(a => 
    a.fileName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ImageIcon size={24} color="#1E40AF" />
            <span>Digital Media Library & Asset Storage</span>
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
            Upload, host, and manage public images, hero banners, and promotional media files.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline btn-sm" onClick={loadData}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*,video/*,application/pdf" 
            style={{ display: 'none' }} 
          />
          
          <button 
            className="btn btn-primary btn-sm" 
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            <span>{uploading ? 'Uploading to Storage...' : 'Upload Media File'}</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          backgroundColor: feedback.type === 'success' ? '#DCFCE7' : '#FEE2E2',
          border: `1px solid ${feedback.type === 'success' ? '#86EFAC' : '#FCA5A5'}`,
          color: feedback.type === 'success' ? '#166534' : '#991B1B',
          fontSize: '0.875rem',
          fontWeight: 600
        }}>
          {feedback.message}
        </div>
      )}

      {/* Filter / Search */}
      <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            className="form-control"
            placeholder="Search media files by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.25rem', height: '36px', fontSize: '0.85rem' }}
          />
        </div>
        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
          {filtered.length} files hosted in <code>cms-media</code> bucket
        </div>
      </div>

      {/* Grid of media cards */}
      {loading ? (
        <div className="card" style={{ padding: '4rem', textAlign: 'center', color: '#64748B' }}>
          <Loader2 size={28} className="animate-spin" style={{ margin: '0 auto 0.75rem' }} />
          <span>Loading assets from Supabase Storage...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: '4rem', textAlign: 'center', color: '#64748B' }}>
          <ImageIcon size={40} color="#CBD5E1" style={{ margin: '0 auto 1rem' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>No media assets found</h4>
          <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Upload high-resolution photography, hero banners, or documents.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {filtered.map(asset => {
            const isImage = asset.mimeType?.startsWith('image/') || asset.fileName?.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i);
            const isCopied = copiedId === asset.id;

            return (
              <div key={asset.id} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {/* Thumbnail */}
                <div style={{
                  height: '160px',
                  backgroundColor: '#0F172A',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {isImage ? (
                    <img 
                      src={asset.url} 
                      alt={asset.fileName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <FileText size={48} color="#94A3B8" />
                  )}

                  <div style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    display: 'flex',
                    gap: '0.35rem'
                  }}>
                    <button 
                      onClick={() => setPreviewAsset(asset)}
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.75)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.35rem',
                        cursor: 'pointer'
                      }}
                      title="Preview"
                    >
                      <Eye size={13} />
                    </button>
                    <a 
                      href={asset.url} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.75)',
                        color: '#FFFFFF',
                        borderRadius: '6px',
                        padding: '0.35rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Open in new tab"
                    >
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>

                {/* Body Details */}
                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.85rem', wordBreak: 'break-all', marginBottom: '0.25rem', lineHeight: 1.3 }}>
                    {asset.fileName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '0.75rem' }}>
                    {asset.size} • {asset.mimeType}
                  </div>

                  {/* Actions */}
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '0.65rem' }}>
                    <button 
                      onClick={() => copyUrl(asset.url, asset.id)}
                      className={`btn ${isCopied ? 'btn-primary' : 'btn-outline'} btn-sm`}
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                    >
                      {isCopied ? <Check size={12} /> : <Copy size={12} />}
                      <span>{isCopied ? 'Copied!' : 'Copy URL'}</span>
                    </button>

                    <button 
                      onClick={() => handleDelete(asset)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#DC2626',
                        cursor: 'pointer',
                        padding: '0.25rem'
                      }}
                      title="Delete asset"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      {previewAsset && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '2rem'
        }}>
          <div className="card" style={{ maxWidth: '800px', width: '100%', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>{previewAsset.fileName}</div>
              <button className="btn btn-outline btn-sm" onClick={() => setPreviewAsset(null)}>Close</button>
            </div>
            
            <div style={{ maxHeight: '500px', overflow: 'hidden', borderRadius: '8px', backgroundColor: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={previewAsset.url} alt={previewAsset.fileName} style={{ maxHeight: '480px', maxWidth: '100%', objectFit: 'contain' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <button className="btn btn-primary btn-sm" onClick={() => copyUrl(previewAsset.url, 'modal')}>
                <Copy size={14} />
                <span>Copy Asset URL</span>
              </button>
              <a href={previewAsset.url} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                <ExternalLink size={14} />
                <span>Open Full Resolution</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
