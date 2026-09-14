import React from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  ExternalLink, 
  Shield, 
  User, 
  Globe 
} from 'lucide-react';

export const AdminTopNav = ({ 
  user, 
  role, 
  setRole, 
  jurisdiction,
  sidebarOpen, 
  setSidebarOpen, 
  onExitPublic,
  unreadNotificationsCount = 2,
  onSearchChange,
  searchValue = ''
}) => {
  const isSuperAdminUser = user?.email === 'admin@jankalyan.org' || user?.user_metadata?.role === 'SUPER_ADMIN' || !user;

  // Derive jurisdiction display name
  const jurisdictionLabel = jurisdiction?.institution?.name 
    ? `${jurisdiction.institution.name} (${jurisdiction.institution.code || 'INST'})`
    : jurisdiction?.district?.name 
    ? `${jurisdiction.district.name} District Cell`
    : jurisdiction?.block?.name
    ? `${jurisdiction.block.name} Block Desk`
    : jurisdiction?.center?.name
    ? jurisdiction.center.name
    : null;

  return (
    <header style={{
      height: '68px',
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E2E8F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 90,
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
    }}>
      
      {/* Left: Mobile Toggle & Global Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, maxWidth: '480px' }}>
        <button 
          className="admin-menu-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            cursor: 'pointer'
          }}
        >
          <Menu size={20} color="#0F172A" />
        </button>

        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            className="form-control"
            placeholder="Global search applications, students, UTR..."
            style={{ paddingLeft: '2.5rem', height: '38px', fontSize: '0.85rem', backgroundColor: '#F8FAFC' }}
            value={searchValue}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Right: Role Switcher / Jurisdiction Scope Badge, Public Link & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        
        {/* If Super Admin, show preview switcher; if scoped user, show official jurisdiction badge */}
        {isSuperAdminUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Shield size={16} color="#1E40AF" />
            <select
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              title="Super Admin Perspective Switcher"
              style={{
                height: '36px',
                padding: '0 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                backgroundColor: '#EFF6FF',
                borderColor: '#BFDBFE',
                color: '#1E40AF'
              }}
            >
              <option value="SUPER_ADMIN">Super Admin (Statewide)</option>
              <option value="INSTITUTION">School / College Nodal</option>
              <option value="DISTRICT_COORDINATOR">District Coordinator</option>
              <option value="BLOCK_COORDINATOR">Block Coordinator</option>
              <option value="ONLINE_CENTER">Online Center (CSC)</option>
            </select>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '6px',
            backgroundColor: role === 'INSTITUTION' ? '#F0FDFA' : '#EFF6FF',
            border: `1px solid ${role === 'INSTITUTION' ? '#99F6E4' : '#BFDBFE'}`,
            color: role === 'INSTITUTION' ? '#0F766E' : '#1E40AF',
            fontSize: '0.78rem',
            fontWeight: 700
          }}>
            <Shield size={14} />
            <span>{jurisdictionLabel || (role || '').replace('_', ' ')}</span>
          </div>
        )}

        {/* Notifications Icon */}
        <div style={{ position: 'relative' }}>
          <button style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <Bell size={18} color="#64748B" />
          </button>
          {unreadNotificationsCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              fontSize: '0.65rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {unreadNotificationsCount}
            </span>
          )}
        </div>

        {/* Exit to Public Website Button */}
        <button 
          className="btn btn-outline btn-sm"
          onClick={onExitPublic}
          style={{ fontSize: '0.8rem', height: '36px', padding: '0 0.85rem' }}
        >
          <span>Public Website</span>
          <ExternalLink size={13} />
        </button>

        {/* User Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid #E2E8F0', paddingLeft: '0.85rem' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%', 
            backgroundColor: role === 'INSTITUTION' ? '#0D9488' : '#1E40AF', 
            color: '#FFFFFF', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontWeight: 800, 
            fontSize: '0.85rem' 
          }}>
            {user?.email?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="admin-user-info" style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
              {user?.user_metadata?.full_name || (user?.email === 'admin@jankalyan.org' ? 'Super Administrator' : user?.email?.split('@')[0]) || 'Administrator'}
            </span>
            <span style={{ fontSize: '0.68rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {jurisdiction?.institution?.name || (role || 'SUPER_ADMIN').replace('_', ' ')}
            </span>
          </div>
        </div>

      </div>

    </header>
  );
};
