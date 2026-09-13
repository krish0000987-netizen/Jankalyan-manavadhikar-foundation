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
  sidebarOpen, 
  setSidebarOpen, 
  onExitPublic,
  unreadNotificationsCount = 2,
  onSearchChange,
  searchValue = ''
}) => {
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

      {/* Right: Role Switcher, Public Link & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        
        {/* Role Switcher (Super Admin can test any coordinator perspective) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Shield size={16} color="#1E40AF" />
          <select
            className="form-control"
            value={role}
            onChange={(e) => setRole(e.target.value)}
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
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="DISTRICT_COORDINATOR">District Coordinator</option>
            <option value="BLOCK_COORDINATOR">Block Coordinator</option>
            <option value="INSTITUTION">School / College</option>
            <option value="ONLINE_CENTER">Online Center (CSC)</option>
          </select>
        </div>

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid #E2E8F0', paddingLeft: '1rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#1E40AF', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
            {user?.email?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="admin-user-info" style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
              {user?.user_metadata?.full_name || (user?.email === 'admin@jankalyan.org' ? 'Super Administrator' : user?.email?.split('@')[0]) || 'Super Administrator'}
            </span>
            <span style={{ fontSize: '0.68rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {(role || 'SUPER_ADMIN').replace('_', ' ')}
            </span>
          </div>
        </div>

      </div>

    </header>
  );
};
