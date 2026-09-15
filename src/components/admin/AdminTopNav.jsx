import { 
  Menu, 
  Search, 
  Bell, 
  ExternalLink, 
  Shield, 
  User, 
  Globe,
  CreditCard
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
        
        {/* Direct Beneficiary Bank Records Desk Button */}
        {setActiveTab && (
          <button 
            type="button"
            onClick={() => setActiveTab('payments')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              backgroundColor: activeTab === 'payments' ? '#D97706' : '#FEF3C7',
              border: activeTab === 'payments' ? '1px solid #B45309' : '1px solid #FCD34D',
              color: activeTab === 'payments' ? '#FFFFFF' : '#92400E',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.06)'
            }}
            title="Open Beneficiary Bank Records to view verified students ready for manual scholarship transfer"
          >
            <CreditCard size={15} color={activeTab === 'payments' ? '#FEF08A' : '#D97706'} />
            <span>Beneficiary Bank Records</span>
            <span style={{
              backgroundColor: activeTab === 'payments' ? '#FEF08A' : '#D97706',
              color: activeTab === 'payments' ? '#92400E' : '#FFFFFF',
              borderRadius: '999px',
              padding: '0.12rem 0.5rem',
              fontSize: '0.72rem',
              fontWeight: 900
            }}>
              {readyCount > 0 ? `${readyCount} Ready` : 'Records'}
            </span>
          </button>
        )}

        {/* Official Super Administrator Statewide Governance Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.4rem 0.85rem',
          borderRadius: '8px',
          backgroundColor: '#FEF2F2',
          border: '1px solid #FECACA',
          color: '#DC2626',
          fontSize: '0.8rem',
          fontWeight: 800
        }}>
          <Shield size={15} color="#DC2626" />
          <span>Super Admin (Statewide Authority)</span>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid #E2E8F0', paddingLeft: '0.85rem' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%', 
            backgroundColor: '#DC2626', 
            color: '#FFFFFF', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontWeight: 800, 
            fontSize: '0.85rem' 
          }}>
            A
          </div>
          <div className="admin-user-info" style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
              Super Administrator
            </span>
            <span style={{ fontSize: '0.68rem', color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
              Central Directorate
            </span>
          </div>
        </div>

      </div>

    </header>
  );
};
