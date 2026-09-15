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
  Sparkles
} from 'lucide-react';

export const AdminSidebar = ({ 
  activeTab, 
  setActiveTab, 
  role = 'SUPER_ADMIN', 
  sidebarOpen, 
  setSidebarOpen,
  onLogout 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'DISTRICT_COORDINATOR', 'BLOCK_COORDINATOR', 'INSTITUTION', 'ONLINE_CENTER'] },
    { id: 'applications', label: 'Applications', icon: Users, roles: ['SUPER_ADMIN', 'DISTRICT_COORDINATOR', 'BLOCK_COORDINATOR', 'INSTITUTION', 'ONLINE_CENTER'] },
    { id: 'verification', label: 'Verification Queue', icon: CheckSquare, roles: ['SUPER_ADMIN', 'DISTRICT_COORDINATOR', 'BLOCK_COORDINATOR', 'INSTITUTION'] },
    { id: 'institutions', label: 'Institutions', icon: Building2, roles: ['SUPER_ADMIN', 'DISTRICT_COORDINATOR', 'BLOCK_COORDINATOR'] },
    { id: 'districts', label: 'Districts & Blocks', icon: MapPin, roles: ['SUPER_ADMIN'] },
    { id: 'schemes', label: 'Scholarship Schemes', icon: GraduationCap, roles: ['SUPER_ADMIN'] },
    { id: 'payments', label: 'Beneficiary Bank Records', icon: CreditCard, roles: ['SUPER_ADMIN', 'DISTRICT_COORDINATOR'] },
    { id: 'commissions', label: 'Commissions', icon: Percent, roles: ['SUPER_ADMIN', 'DISTRICT_COORDINATOR', 'BLOCK_COORDINATOR', 'INSTITUTION', 'ONLINE_CENTER'] },
    { id: 'reports', label: 'Reports & MIS', icon: BarChart3, roles: ['SUPER_ADMIN', 'DISTRICT_COORDINATOR', 'BLOCK_COORDINATOR'] },
    { id: 'merit', label: 'Merit Lists', icon: Award, roles: ['SUPER_ADMIN'] },
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
        style={{
          width: '270px',
          backgroundColor: '#0F172A',
          color: '#F8FAFC',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          borderRight: '1px solid #1E293B',
          transition: 'transform 0.3s ease'
        }}
      >
        {/* Brand Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #1E293B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={20} color="#FEF08A" />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>
                Jankalyan Mission
              </div>
              <div style={{ fontSize: '0.68rem', color: '#F87171', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                SUPER ADMIN DIRECTORATE
              </div>
            </div>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {visibleItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
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
                    backgroundColor: isActive ? '#1E40AF' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#94A3B8',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 700 : 500,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#1E293B';
                      e.currentTarget.style.color = '#FFFFFF';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#94A3B8';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Icon size={17} color={isActive ? '#FEF08A' : '#94A3B8'} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={14} color="#FEF08A" />}
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
