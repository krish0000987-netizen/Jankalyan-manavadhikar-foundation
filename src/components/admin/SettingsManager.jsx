import React, { useState, useEffect } from 'react';
import { supabase } from '../../api/supabase';
import { useApp } from '../../context/AppContext';
import { toIsoDate } from '../../services/cmsService';
import { 
  Settings, 
  Save, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  Calendar, 
  IndianRupee, 
  ShieldAlert, 
  CheckCircle2, 
  Loader2, 
  RefreshCw 
} from 'lucide-react';

export const SettingsManager = () => {
  const { cms, updateCmsField, refreshCMS } = useApp();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [settings, setSettings] = useState({
    academicSession: '2026-27',
    grantAmount: 22000,
    registrationFeeAmount: 1.00,
    razorpayKeyId: 'rzp_live_TceflpS8ncUJPO',
    applicationStartDate: '15/09/2026',
    applicationClosingDate: '30/11/2026',
    officialMobile: '8871557054',
    officialTelephone: '0761-4500054',
    officialEmail: 'jankalyanmanavadhikar@gmail.com',
    officeAddress: 'Ward No. 30, Shri Ram College Road, Dixit Colony, Jabalpur, Pin Code: 482002',
    dbtMode: 'MANUAL_DBT',
    maintenanceMode: false,
    autoApproveInstitutions: false
  });

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('system_settings').select('*');
      if (data && data.length > 0) {
        const mapped = {};
        data.forEach(item => {
          mapped[item.key] = item.value;
        });
        setSettings(prev => ({
          ...prev,
          ...mapped,
          officialMobile: mapped.officialMobile || cms?.officialMobile || prev.officialMobile,
          officialEmail: mapped.officialEmail || cms?.officialEmail || prev.officialEmail,
          officeAddress: mapped.officeAddress || cms?.officeAddress || prev.officeAddress
        }));
      }
    } catch (err) {
      console.warn('Load settings warning:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const grantNum = Number(settings.grantAmount) || 22000;
      const displayStr = `₹${grantNum.toLocaleString('en-IN')}/- Yearly`;

      // Deduplicate key-value pairs using a Map to strictly prevent PostgreSQL duplicate conflict target errors
      const settingsMap = new Map();

      Object.entries(settings).forEach(([key, value]) => {
        if (value !== undefined) {
          settingsMap.set(key, {
            key,
            value,
            is_public: true,
            updated_at: new Date().toISOString()
          });
        }
      });

      // Explicitly set grantAmount (parsed as number) and grantAmountDisplay
      settingsMap.set('grantAmount', {
        key: 'grantAmount',
        value: grantNum,
        is_public: true,
        updated_at: new Date().toISOString()
      });

      settingsMap.set('grantAmountDisplay', {
        key: 'grantAmountDisplay',
        value: displayStr,
        is_public: true,
        updated_at: new Date().toISOString()
      });

      const entries = Array.from(settingsMap.values());

      const { error } = await supabase
        .from('system_settings')
        .upsert(entries, { onConflict: 'key' });

      if (error) throw error;

      // Sync umbrella scheme in scholarship_schemes as well
      await supabase
        .from('scholarship_schemes')
        .update({
          grant_amount: grantNum,
          grant_amount_display: displayStr,
          application_start_date: toIsoDate(settings.applicationStartDate),
          application_end_date: toIsoDate(settings.applicationClosingDate),
          updated_at: new Date().toISOString()
        })
        .eq('id', 'd0000000-0000-0000-0000-000000000001');

      // Update CMS context fields if available
      if (updateCmsField) {
        updateCmsField('officialMobile', settings.officialMobile);
        updateCmsField('officialTelephone', settings.officialTelephone);
        updateCmsField('officialEmail', settings.officialEmail);
        updateCmsField('officeAddress', settings.officeAddress);
        updateCmsField('grantAmount', displayStr);
        updateCmsField('scholarshipAmount', displayStr);
        updateCmsField('applicationStartDate', settings.applicationStartDate);
        updateCmsField('applicationLastDate', settings.applicationClosingDate);
      }

      if (refreshCMS) {
        await refreshCMS();
      }

      try {
        localStorage.setItem('jmf_cms_updated', Date.now().toString());
      } catch (err) {}

      setFeedback({ type: 'success', message: 'All system settings saved and synchronized across portal!' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save settings.' });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={24} color="#1E40AF" />
            <span>Global System Configuration & Foundation Coordinates</span>
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
            Modify scholarship grant parameters, direct bank transfer policies, and official contact coordinates.
          </p>
        </div>

        <button className="btn btn-outline btn-sm" onClick={loadSettings}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Reload</span>
        </button>
      </div>

      {feedback && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          backgroundColor: feedback.type === 'success' ? '#DCFCE7' : '#FEE2E2',
          border: `1px solid ${feedback.type === 'success' ? '#86EFAC' : '#FCA5A5'}`,
          color: feedback.type === 'success' ? '#166534' : '#991B1B',
          fontSize: '0.875rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={18} />
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Section 1: Financial Grant & Academic Session */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <IndianRupee size={18} color="#16A34A" />
            <span>Scholarship Grant Parameters</span>
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.25rem' }}>
            Default disbursal amounts and application submission windows.
          </p>

          <div className="grid-editorial" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label required">Default Grant Amount (₹ per beneficiary)</label>
              <input 
                type="number"
                className="form-control"
                required
                value={settings.grantAmount}
                onChange={(e) => setSettings({ ...settings, grantAmount: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Current Academic Session</label>
              <input 
                type="text"
                className="form-control"
                required
                value={settings.academicSession}
                onChange={(e) => setSettings({ ...settings, academicSession: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Application Opening Date</label>
              <input 
                type="text"
                className="form-control"
                required
                placeholder="e.g. 15/09/2026"
                value={settings.applicationStartDate}
                onChange={(e) => setSettings({ ...settings, applicationStartDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Application Closing Deadline</label>
              <input 
                type="text"
                className="form-control"
                required
                placeholder="e.g. 30/11/2026"
                value={settings.applicationClosingDate}
                onChange={(e) => setSettings({ ...settings, applicationClosingDate: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Section 2: DBT Payment Disbursal Mode */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={18} color="#1E40AF" />
            <span>Direct Benefit Transfer (DBT) Banking Configuration</span>
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.25rem' }}>
            Select whether DBT payments are recorded manually via banking UTR or processed via payment gateway webhook.
          </p>

          <div className="form-group" style={{ maxWidth: '480px' }}>
            <label className="form-label required">Payment Disbursal Engine</label>
            <select 
              className="form-control"
              value={settings.dbtMode}
              onChange={(e) => setSettings({ ...settings, dbtMode: e.target.value })}
            >
              <option value="MANUAL_DBT">Bank DBT Transfer (Manual UTR Reconciliation - Recommended)</option>
              <option value="RAZORPAY">Razorpay Payouts / Route</option>
              <option value="CASHFREE">Cashfree AutoCollect / Payouts</option>
              <option value="PAYU">PayU Direct Transfer</option>
            </select>
          </div>
        </div>

        {/* Section 2B: Student Registration Fee & Razorpay Gateway Configuration */}
        <div className="card" style={{ padding: '1.75rem', borderLeft: '4px solid #2563EB' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <IndianRupee size={18} color="#2563EB" />
            <span>Student Registration Fee & Razorpay Payment Gateway</span>
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.25rem' }}>
            Configure the mandatory scholarship application registration fee and Razorpay merchant key.
          </p>

          <div className="grid-editorial" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label required">Scholarship Registration Fee (₹ INR)</label>
              <input 
                type="number"
                step="0.01"
                className="form-control"
                required
                value={settings.registrationFeeAmount}
                onChange={(e) => setSettings({ ...settings, registrationFeeAmount: parseFloat(e.target.value) || 0 })}
              />
              <span style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '3px', display: 'block' }}>
                Foundation scholarship application registration fee per student application.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label required">Razorpay Key ID</label>
              <input 
                type="text"
                className="form-control"
                placeholder="rzp_test_... or rzp_live_..."
                value={settings.razorpayKeyId}
                onChange={(e) => setSettings({ ...settings, razorpayKeyId: e.target.value })}
              />
              <span style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span>Public Key ID from your Razorpay Dashboard (API Keys).</span>
                {settings.razorpayKeyId?.startsWith('rzp_live_') ? (
                  <span style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '1px 6px', borderRadius: '4px', fontWeight: 800, fontSize: '0.68rem' }}>🟢 LIVE PRODUCTION</span>
                ) : (
                  <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '1px 6px', borderRadius: '4px', fontWeight: 800, fontSize: '0.68rem' }}>🟡 TEST SANDBOX</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Official Contact Channels */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Phone size={18} color="#D97706" />
            <span>Public Contact Coordinates</span>
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.25rem' }}>
            Official numbers and address rendered on website header, footer, and contact center.
          </p>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label required">Helpline Mobile Number</label>
              <input 
                type="text"
                className="form-control"
                required
                value={settings.officialMobile}
                onChange={(e) => setSettings({ ...settings, officialMobile: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Office Landline Number</label>
              <input 
                type="text"
                className="form-control"
                required
                value={settings.officialTelephone}
                onChange={(e) => setSettings({ ...settings, officialTelephone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label required">Official Email Address</label>
            <input 
              type="email"
              className="form-control"
              required
              value={settings.officialEmail}
              onChange={(e) => setSettings({ ...settings, officialEmail: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label required">Physical Office Address</label>
            <textarea 
              className="form-control"
              rows={2}
              required
              value={settings.officeAddress}
              onChange={(e) => setSettings({ ...settings, officeAddress: e.target.value })}
            />
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
          <button type="submit" disabled={saving} className="btn btn-primary btn-lg" style={{ minWidth: '220px', justifyContent: 'center' }}>
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span>{saving ? 'Synchronizing...' : 'Save Global Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
