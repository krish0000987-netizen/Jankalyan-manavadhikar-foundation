import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Building2, 
  MapPin, 
  GraduationCap, 
  CreditCard, 
  Percent, 
  BarChart3, 
  Award, 
  HeartHandshake, 
  HelpCircle, 
  Bell, 
  Sliders, 
  Image as ImageIcon, 
  Download, 
  FileCheck, 
  QrCode, 
  ShieldAlert, 
  UserCog, 
  Settings, 
  LogOut,
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';

export const AdminSidebar = ({ 
  activeTab, 
  setActiveTab, 
  role = 'SUPER_ADMIN', 
  sidebarOpen, 
  setSidebarOpen,
  readyCount = 0,
  onLogout 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'DISTRICT_COORDINATOR', 'BLOCK_COORDINATOR', 'INSTITUTION', 'ONLINE_CENTER'] },
    { id: 'applications', label: 'Applications', icon: Users, roles: ['SUPER_ADMIN', 'DISTRICT_COORDINATOR', 'BLOCK_COORDINATOR', 'INSTITUTION', 'ONLINE_CENTER'] },
    { id: 'verification', label: 'Verification Queue', icon: CheckSquare, roles: ['SUPER_ADMIN', 'DISTRICT_COORDINATOR', 'BLOCK_COORDINATOR', 'INSTITUTION'] },
    { id: 'payments', label: 'Beneficiary Bank Records', icon: CreditCard, roles: ['SUPER_ADMIN', 'DISTRICT_COORDINATOR', 'BLOCK_COORDINATOR', 'INSTITUTION'] },
    { id: 'institutions', label: 'Institutions', icon: Building2, roles: ['SUPER_ADMIN', 'DISTRICT_COORDINATOR', 'BLOCK_COORDINATOR'] },
    { id: 'districts', label: 'Districts & Blocks', icon: MapPin, roles: ['SUPER_ADMIN'] },
    { id: 'schemes', label: 'Scholarship Schemes', icon: GraduationCap, roles: ['SUPER_ADMIN'] },
    { id: 'commissions', label: 'Commissions', icon: Percent, roles: ['SUPER_ADMIN', 'DISTRICT_COORDINATOR', 'BLOCK_COORDINATOR', 'INSTITUTION', 'ONLINE_CENTER'] },
    { id: 'reports', label: 'Reports & MIS', icon: BarChart3, roles: ['SUPER_ADMIN', 'DISTRICT_COORDINATOR', 'BLOCK_COORDINATOR'] },
    { id: 'merit', label: 'Merit Lists', icon: Award, roles: ['SUPER_ADMIN', 'DISTRICT_COORDINATOR', 'BLOCK_COORDINATOR', 'INSTITUTION'] },
    { id: 'donors', label: 'CSR & Donors', icon: HeartHandshake, roles: ['SUPER_ADMIN'] },
    { id: 'grievances', label: 'Grievance Redressal', icon: HelpCircle, roles: ['SUPER_ADMIN', 'DISTRICT_COORDINATOR', 'BLOCK_COORDINATOR'] },
    { id: 'notifications', label: 'Notification Center', icon: Bell, roles: ['SUPER_ADMIN'] },
    { id: 'cms', label: 'CMS Content Editor', icon: Sliders, roles: ['SUPER_ADMIN'] },
    { id: 'media', label: 'Media Library', icon: ImageIcon, roles: ['SUPER_ADMIN'] },
    { id: 'downloads', label: 'Download Center', icon: Download, roles: ['SUPER_ADMIN'] },
    { id: 'certificates', label: 'Certificates', icon: FileCheck, roles: ['SUPER_ADMIN', 'DISTRICT_COORDINATOR'] },
    { id: 'qr_verify', label: 'QR Verification Center', icon: QrCode, roles: ['SUPER_ADMIN', 'DISTRICT_COORDINATOR', 'BLOCK_COORDINATOR', 'INSTITUTION', 'ONLINE_CENTER'] },
    { id: 'audit', label: 'Audit Logs', icon: ShieldAlert, roles: ['SUPER_ADMIN'] },
    { id: 'users', label: 'Users & Roles', icon: UserCog, roles: ['SUPER_ADMIN'] },
    { id: 'settings', label: 'System Settings', icon: Settings, roles: ['SUPER_ADMIN'] },
  ];

  // Super Admin manages all modules directly
  const visibleItems = menuItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 99
          }}
          className="sidebar-backdrop"
        />
      )}

      <aside 
        className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}
      >
        {/* Brand Header with Mobile Close Button */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1E293B', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={20} color="#FEF08A" />
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>
                Jankalyan Mission
              </div>
              <div style={{ fontSize: '0.65rem', color: '#F87171', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                {role || 'SUPER ADMIN DIRECTORATE'}
              </div>
            </div>
          </div>

          <button 
            type="button"
            className="admin-sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#CBD5E1',
              cursor: 'pointer',
              padding: '0.35rem',
              borderRadius: '8px'
            }}
            title="Close navigation"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Menu Navigation */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {visibleItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isPayments = item.id === 'payments';

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    backgroundColor: isActive 
                      ? '#1E40AF' 
                      : (isPayments ? 'rgba(217, 119, 6, 0.15)' : 'transparent'),
                    color: isActive 
                      ? '#FFFFFF' 
                      : (isPayments ? '#FBBF24' : '#94A3B8'),
                    border: isPayments && !isActive 
                      ? '1px solid rgba(217, 119, 6, 0.45)' 
                      : '1px solid transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: isActive || isPayments ? 700 : 500,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = isPayments ? 'rgba(217, 119, 6, 0.25)' : '#1E293B';
                      e.currentTarget.style.color = '#FFFFFF';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = isPayments ? 'rgba(217, 119, 6, 0.15)' : 'transparent';
                      e.currentTarget.style.color = isPayments ? '#FBBF24' : '#94A3B8';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Icon size={17} color={isActive ? '#FEF08A' : (isPayments ? '#F59E0B' : '#94A3B8')} />
                    <span>{item.label}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {isPayments && (
                      <span style={{
                        backgroundColor: isActive ? '#FEF08A' : '#D97706',
                        color: isActive ? '#1E40AF' : '#FFFFFF',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '0.12rem 0.45rem',
                        borderRadius: '999px',
                        lineHeight: 1
                      }}>
                        {readyCount > 0 ? `${readyCount} Ready` : 'Records'}
                      </span>
                    )}
                    {isActive && <ChevronRight size={14} color="#FEF08A" />}
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer Logout */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #1E293B' }}>
          <button
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              width: '100%',
              padding: '0.65rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              color: '#F87171',
              border: '1px solid rgba(220, 38, 38, 0.2)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>
    </>
  );
};
