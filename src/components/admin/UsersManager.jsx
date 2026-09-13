import React, { useState, useEffect } from 'react';
import { supabase } from '../../api/supabase';
import { 
  UserCog, 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Shield, 
  Mail, 
  Phone, 
  Loader2, 
  RefreshCw,
  UserCheck,
  Building
} from 'lucide-react';

export const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    mobile: '',
    role_id: 'DISTRICT_COORDINATOR'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [{ data: pData }, { data: rData }] = await Promise.all([
        supabase.from('profiles').select('*, user_roles(role_id)').order('created_at', { ascending: false }),
        supabase.from('roles').select('*')
      ]);
      setUsers(pData || []);
      setRoles(rData || []);
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    if (!form.email || !form.full_name) return;
    setSubmitting(true);
    try {
      // Create profile record
      const userId = crypto.randomUUID();
      const { error: pErr } = await supabase.from('profiles').insert([{
        id: userId,
        email: form.email,
        full_name: form.full_name,
        mobile: form.mobile,
        is_active: true
      }]);
      if (pErr) throw pErr;

      // Assign role
      const { error: rErr } = await supabase.from('user_roles').insert([{
        user_id: userId,
        role_id: form.role_id
      }]);
      if (rErr) throw rErr;

      setFeedback({ type: 'success', message: `Staff user "${form.full_name}" assigned as ${form.role_id}!` });
      setShowAddModal(false);
      setForm({
        email: '',
        password: '',
        full_name: '',
        mobile: '',
        role_id: 'DISTRICT_COORDINATOR'
      });
      loadData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to create user.' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const toggleStatus = async (user) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !user.is_active })
        .eq('id', user.id);
      if (error) throw error;
      loadData();
    } catch (err) {
      console.error('Status toggle error:', err);
    }
  };

  const filtered = users.filter(u => {
    const roleId = u.user_roles?.[0]?.role_id || 'STUDENT';
    const matchesRole = roleFilter === 'ALL' || roleId === roleFilter;
    const matchesSearch = (u.full_name && u.full_name.toLowerCase().includes(search.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
      (u.mobile && u.mobile.includes(search));
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserCog size={24} color="#1E40AF" />
            <span>Staff Users & Role-Based Access Control (RBAC)</span>
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
            Manage staff accounts, assign administrative roles, and configure regional coordinator permissions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline btn-sm" onClick={loadData}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
            <Plus size={15} />
            <span>Add Staff User</span>
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

      {/* Filter / Search Bar */}
      <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            className="form-control"
            placeholder="Search by staff name, email, or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.25rem', height: '38px', fontSize: '0.85rem' }}
          />
        </div>

        <select 
          className="form-control" 
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{ width: '220px', height: '38px', fontSize: '0.85rem' }}
        >
          <option value="ALL">All Roles</option>
          <option value="SUPER_ADMIN">Super Administrator</option>
          <option value="DISTRICT_COORDINATOR">District Coordinator</option>
          <option value="BLOCK_COORDINATOR">Block Coordinator</option>
          <option value="INSTITUTION">School / College Nodal</option>
          <option value="ONLINE_CENTER">Online CSC Center</option>
          <option value="STUDENT">Student</option>
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem' }}>User Full Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Email Address</th>
                <th style={{ padding: '0.75rem 1rem' }}>Assigned RBAC Role</th>
                <th style={{ padding: '0.75rem 1rem' }}>Mobile Number</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                    <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem' }} />
                    <span>Loading users & staff...</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                    No users found matching current filters.
                  </td>
                </tr>
              ) : (
                filtered.map(u => {
                  const roleId = u.user_roles?.[0]?.role_id || 'STUDENT';
                  return (
                    <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#0F172A' }}>
                        {u.full_name || 'Staff User'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>
                        {u.email}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span className={`badge ${
                          roleId === 'SUPER_ADMIN' ? 'badge-blue' :
                          roleId === 'DISTRICT_COORDINATOR' ? 'badge-navy' :
                          roleId === 'BLOCK_COORDINATOR' ? 'badge-yellow' : 'badge-green'
                        }`} style={{ fontSize: '0.7rem' }}>
                          {roleId}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace' }}>
                        {u.mobile || '-'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span className={`badge ${u.is_active !== false ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.7rem' }}>
                          {u.is_active !== false ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <button 
                          onClick={() => toggleStatus(u)}
                          className={`btn ${u.is_active !== false ? 'btn-outline' : 'btn-primary'} btn-sm`}
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                        >
                          {u.is_active !== false ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Staff User */}
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
          <div className="card" style={{ width: '520px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem' }}>
              Create Staff Account & Assign Role
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.5rem' }}>
              Assign role-based access to coordinators, institution officers, or system administrators.
            </p>

            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div className="form-group">
                <label className="form-label required">Full Name</label>
                <input 
                  type="text"
                  className="form-control"
                  required
                  placeholder="Officer / Coordinator Name"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label required">Email Address</label>
                  <input 
                    type="email"
                    className="form-control"
                    required
                    placeholder="officer@jankalyan.org"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input 
                    type="tel"
                    className="form-control"
                    maxLength={10}
                    placeholder="10-digit mobile"
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label required">Assigned Role</label>
                <select 
                  className="form-control"
                  value={form.role_id}
                  onChange={(e) => setForm({ ...form, role_id: e.target.value })}
                >
                  <option value="DISTRICT_COORDINATOR">District Coordinator</option>
                  <option value="BLOCK_COORDINATOR">Block Coordinator</option>
                  <option value="INSTITUTION">School / College Nodal Officer</option>
                  <option value="ONLINE_CENTER">Online CSC Center Operator</option>
                  <option value="SUPER_ADMIN">Super Administrator</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  <span>Save Staff Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
