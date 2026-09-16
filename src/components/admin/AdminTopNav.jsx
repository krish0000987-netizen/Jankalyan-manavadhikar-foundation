import { 
  Menu, 
  Search, 
  Bell, 
  ExternalLink, 
  Shield, 
  User, 
  Globe,
  CreditCard,
  LogOut
} from 'lucide-react';

export const AdminTopNav = ({ 
  user, 
  role, 
  setRole, 
  jurisdiction,
  sidebarOpen, 
  setSidebarOpen, 
  onExitPublic,
  onLogout,
  unreadNotificationsCount = 2,
  onSearchChange,
  searchValue = '',
  activeTab,
  setActiveTab,
  readyCount = 0
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
      height: '64px',
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E2E8F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1rem',
      position: 'sticky',
      top: 0,
      zIndex: 90,
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      maxWidth: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      
      {/* Left: Mobile Toggle & Global Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: '1 1 auto', minWidth: '110px', maxWidth: '300px' }}>
        <button 
          className="admin-menu-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <Menu size={18} color="#0F172A" />
        </button>

        <div style={{ position: 'relative', width: '100%', minWidth: '80px' }}>
          <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            className="form-control"
            placeholder="Search..."
            style={{ paddingLeft: '2.2rem', height: '36px', fontSize: '0.82rem', backgroundColor: '#F8FAFC' }}
            value={searchValue}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Right: Role Switcher / Scope Badge, Public Link, Profile & High-Priority Sign Out */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0, marginLeft: 'auto' }}>
        
        {/* Direct Beneficiary Bank Records Desk Button */}
        {setActiveTab && (
          <button 
            type="button"
            onClick={() => setActiveTab('payments')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '8px',
              backgroundColor: activeTab === 'payments' ? '#D97706' : '#FEF3C7',
              border: activeTab === 'payments' ? '1px solid #B45309' : '1px solid #FCD34D',
              color: activeTab === 'payments' ? '#FFFFFF' : '#92400E',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
              flexShrink: 0,
              whiteSpace: 'nowrap'
            }}
            title="Open Beneficiary Bank Records to view verified students ready for manual scholarship transfer"
          >
            <CreditCard size={14} color={activeTab === 'payments' ? '#FEF08A' : '#D97706'} />
            <span className="hide-on-laptop-narrow">Bank Records</span>
            <span style={{
              backgroundColor: activeTab === 'payments' ? '#FEF08A' : '#D97706',
              color: activeTab === 'payments' ? '#92400E' : '#FFFFFF',
              borderRadius: '999px',
              padding: '0.1rem 0.45rem',
              fontSize: '0.7rem',
              fontWeight: 900
            }}>
              {readyCount > 0 ? `${readyCount}` : '0'}
            </span>
          </button>
        )}

        {/* Official Super Administrator Statewide Governance Badge */}
        <div 
          className="hide-on-laptop-narrow"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.65rem',
            borderRadius: '8px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#DC2626',
            fontSize: '0.78rem',
            fontWeight: 800,
            flexShrink: 0,
            whiteSpace: 'nowrap'
          }}
          title="Statewide Administrative Governance Authority"
        >
          <Shield size={14} color="#DC2626" />
          <span>Super Admin</span>
        </div>

        {/* Notifications Icon */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <Bell size={16} color="#64748B" />
          </button>
          {unreadNotificationsCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              fontSize: '0.62rem',
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
          className="btn btn-outline btn-sm hide-on-laptop-narrow"
          onClick={onExitPublic}
          style={{ fontSize: '0.78rem', height: '34px', padding: '0 0.65rem', flexShrink: 0, whiteSpace: 'nowrap' }}
          title="Open Public Website"
        >
          <span>Website</span>
          <ExternalLink size={12} />
        </button>

        {/* User Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderLeft: '1px solid #E2E8F0', paddingLeft: '0.5rem', flexShrink: 0 }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '50%', 
            backgroundColor: '#DC2626', 
            color: '#FFFFFF', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontWeight: 800, 
            fontSize: '0.8rem',
            flexShrink: 0
          }}>
            A
          </div>
          <div className="admin-user-info" style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
              Admin
            </span>
          </div>
        </div>

        {/* Top Navbar Sign Out / Logout Button - Always visible, never clipped */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="btn btn-sm admin-top-signout-btn"
            style={{
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              border: '1px solid #FECACA',
              height: '34px',
              padding: '0 0.75rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer',
              borderRadius: '8px',
              flexShrink: 0,
              whiteSpace: 'nowrap',
              boxShadow: '0 1px 2px rgba(220, 38, 38, 0.1)'
            }}
            title="Sign out of administrative session"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        )}

      </div>

    </header>
  );
};
