import React, { useState, useEffect, useRef } from 'react';
import { cmsService } from '../../services/cmsService';
import { supabase } from '../../api/supabase';
import { uploadFile, getPublicUrl } from '../../api/storage';
import { 
  Download, 
  Plus, 
  FileText, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  RefreshCw,
  Search,
  Upload
} from 'lucide-react';

export const DownloadsManager = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title_en: '',
    title_hi: '',
    category_en: 'Application Forms',
    category_hi: 'आवेदन प्रपत्र',
    file_url: '',
    format: 'PDF',
    size_display: '1.2 MB',
    is_active: true
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await cmsService.getDownloads();
      setDownloads(data || []);
    } catch (err) {
      console.error('Error loading downloads:', err);
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

    setSubmitting(true);
    try {
      const storagePath = `official_forms/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      await uploadFile('downloads', storagePath, file, { upsert: true });
      const publicUrl = getPublicUrl('downloads', storagePath);
      const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
      const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

      setForm(prev => ({
        ...prev,
        file_url: publicUrl,
        format: ext,
        size_display: sizeStr,
        title_en: prev.title_en || file.name.replace(/\.[^/.]+$/, '')
      }));
      setFeedback({ type: 'success', message: `File "${file.name}" uploaded to storage!` });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'File upload failed.' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title_en) return;
    setSubmitting(true);
    try {
      await cmsService.createDownload({
        title_en: form.title_en,
        title_hi: form.title_hi || form.title_en,
        category_en: form.category_en,
        category_hi: form.category_hi,
        file_url: form.file_url || 'https://jankalyan.org/downloads/sample_guidelines.pdf',
        format: form.format,
        size_display: form.size_display,
        is_active: form.is_active
      });

      setFeedback({ type: 'success', message: 'Download document published to public portal!' });
      setShowAddModal(false);
      setForm({
        title_en: '',
        title_hi: '',
        category_en: 'Application Forms',
        category_hi: 'आवेदन प्रपत्र',
        file_url: '',
        format: 'PDF',
        size_display: '1.2 MB',
        is_active: true
      });
      loadData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to create download.' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this download file?')) return;
    try {
      await cmsService.deleteDownload(id);
      setDownloads(prev => prev.filter(d => d.id !== id));
      setFeedback({ type: 'success', message: 'Download removed.' });
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const filtered = downloads.filter(d => 
    (d.title_en && d.title_en.toLowerCase().includes(search.toLowerCase())) ||
    (d.title_hi && d.title_hi.includes(search)) ||
    (d.category_en && d.category_en.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={24} color="#1E40AF" />
            <span>Download Center Management</span>
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
            Publish official application forms, rule books, checklists, and legal declaration templates.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline btn-sm" onClick={loadData}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
            <Plus size={15} />
            <span>Upload Document</span>
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
            placeholder="Search documents by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.25rem', height: '36px', fontSize: '0.85rem' }}
          />
        </div>
        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
          {filtered.length} official documents available on public /downloads
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Document Title</th>
                <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                <th style={{ padding: '0.75rem 1rem' }}>Format / Size</th>
                <th style={{ padding: '0.75rem 1rem' }}>Direct Link</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                    <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem' }} />
                    <span>Loading download files...</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                    No download items found.
                  </td>
                </tr>
              ) : (
                filtered.map(dl => (
                  <tr key={dl.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 800, color: '#0F172A' }}>{dl.title_en}</div>
                      {dl.title_hi && <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{dl.title_hi}</div>}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="badge badge-navy" style={{ fontSize: '0.7rem' }}>
                        {dl.category_en || 'General'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>
                      {dl.format || 'PDF'} ({dl.size_display || '1.2 MB'})
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <a 
                        href={dl.file_url} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#1E40AF', fontWeight: 600, fontSize: '0.8rem' }}
                      >
                        <ExternalLink size={13} />
                        <span>Inspect File</span>
                      </a>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={`badge ${dl.is_active !== false ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.7rem' }}>
                        {dl.is_active !== false ? 'Published' : 'Hidden'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleDelete(dl.id)}
                        style={{ backgroundColor: 'transparent', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '0.25rem' }}
                        title="Delete download"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }}>
          <div className="card" style={{ width: '540px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem' }}>
              Publish Downloadable File
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.5rem' }}>
              Upload an official PDF/DOCX to Supabase storage or provide a secure document URL.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              {/* File upload trigger */}
              <div style={{
                border: '2px dashed #CBD5E1',
                borderRadius: '12px',
                padding: '1.5rem',
                textAlign: 'center',
                backgroundColor: '#F8FAFC',
                marginBottom: '1rem',
                cursor: 'pointer'
              }}
              onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx"
                  style={{ display: 'none' }}
                />
                <Upload size={24} color="#1E40AF" style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9rem' }}>
                  {form.file_url ? 'File Selected & Uploaded' : 'Click to Upload Document (PDF / DOCX)'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>
                  {form.file_url ? form.file_url : 'Max file size: 10 MB'}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label required">Document Title (English)</label>
                <input 
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Scholarship Application Form 2026-27"
                  value={form.title_en}
                  onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Document Title (Hindi)</label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="उदा. छात्रवृत्ति आवेदन प्रपत्र 2026-27"
                  value={form.title_hi}
                  onChange={(e) => setForm({ ...form, title_hi: e.target.value })}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label required">Category (English)</label>
                  <select 
                    className="form-control"
                    value={form.category_en}
                    onChange={(e) => setForm({ ...form, category_en: e.target.value })}
                  >
                    <option value="Application Forms">Application Forms</option>
                    <option value="Guidelines & Rules">Guidelines & Rules</option>
                    <option value="Document Checklist">Document Checklist</option>
                    <option value="Affidavit Templates">Affidavit Templates</option>
                    <option value="Circulars & Notices">Circulars & Notices</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">File Format</label>
                  <select 
                    className="form-control"
                    value={form.format}
                    onChange={(e) => setForm({ ...form, format: e.target.value })}
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX</option>
                    <option value="ZIP">ZIP</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  <span>Publish Document</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
