import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Scholarship } from './pages/Scholarship';
import { Apply } from './pages/Apply';
import { Documents } from './pages/Documents';
import { Track } from './pages/Track';
import { StudentDashboard } from './pages/StudentDashboard';
import { Admin } from './pages/Admin';
import { AdminLogin } from './pages/admin/AdminLogin';
import { Downloads } from './pages/Downloads';
import { Grievance } from './pages/Grievance';
import { Faq } from './pages/Faq';
import { Contact } from './pages/Contact';
import { Legal } from './pages/Legal';
import { NotFound } from './pages/NotFound';
import { QrVerify } from './pages/QrVerify';
import { CertificateView } from './pages/CertificateView';
import { MeritList } from './pages/MeritList';
import { Home as HomeIcon, Sparkles, Search, User, LifeBuoy } from 'lucide-react';

const MainRouter = () => {
  const { currentRoute, navigate, lang, authRole, activeStudentApp, authUser, authLoading } = useApp();

  const isStudentLoggedIn = Boolean(
    authRole === 'STUDENT' || 
    activeStudentApp || 
    authUser?.user_metadata?.role === 'STUDENT'
  );

  const renderRoute = () => {
    // Dynamic match for QR Verification: /verify/application/:id
    if (currentRoute.startsWith('/verify/application')) {
      const parts = currentRoute.split('/verify/application/');
      const token = parts[1] ? decodeURIComponent(parts[1]) : '';
      return <QrVerify verifyType="application" identifier={token} />;
    }

    // Dynamic match for QR Verification: /verify/certificate/:id
    if (currentRoute.startsWith('/verify/certificate')) {
      const parts = currentRoute.split('/verify/certificate/');
      const token = parts[1] ? decodeURIComponent(parts[1]) : '';
      return <QrVerify verifyType="certificate" identifier={token} />;
    }

    // Dynamic match for Certificate View: /certificate/:id
    if (currentRoute.startsWith('/certificate/')) {
      const certId = currentRoute.replace('/certificate/', '');
      return <CertificateView certId={decodeURIComponent(certId)} />;
    }

    switch (currentRoute) {
      case '/':
        return <Home />;
      case '/about':
        return <About />;
      case '/scholarship':
      case '/scholarship-yojna-2026':
      case '/scholarship-2026':
        return <Scholarship />;
      case '/apply':
        return <Apply />;
      case '/documents':
        return <Documents />;
      case '/track':
        return <Track />;
      case '/student-dashboard':
        return <StudentDashboard />;
      case '/login':
      case '/portal-login':
      case '/student-login':
      case '/student-register':
        return <AdminLogin defaultRole="STUDENT" />;
      case '/school-login':
      case '/college-login':
      case '/institution-login':
      case '/district-login':
      case '/block-login':
      case '/admin/login':
        return <AdminLogin defaultRole="SUPER_ADMIN" />;
      case '/admin': {
        if (authLoading) {
          return (
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' }}>
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3.5px solid #E2E8F0', borderTopColor: '#DC2626', borderRadius: '50%', margin: '0 auto 1.25rem' }} />
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>Verifying Administrative Access...</div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.35rem' }}>Jankalyan Manavadhikar Foundation</div>
              </div>
            </div>
          );
        }
        const isAdmin = Boolean(
          authUser && 
          ['SUPER_ADMIN', 'DISTRICT_COORDINATOR', 'BLOCK_COORDINATOR', 'INSTITUTION', 'ONLINE_CENTER'].includes(authRole)
        );
        if (!isAdmin) {
          return <AdminLogin defaultRole="SUPER_ADMIN" />;
        }
        return <Admin />;
      }
      case '/certificate':
        return <CertificateView />;
      case '/downloads':
        return <Downloads />;
      case '/merit-list':
      case '/merit':
      case '/selection-list':
      case '/results':
        return <MeritList />;
      case '/grievance':
        return <Grievance />;
      case '/faq':
        return <Faq />;
      case '/contact':
        return <Contact />;
      case '/privacy':
        return <Legal pageType="privacy" />;
      case '/terms':
        return <Legal pageType="terms" />;
      case '/disclaimer':
        return <Legal pageType="disclaimer" />;
      default:
        return <NotFound />;
    }
  };

  const isAdminRoute = currentRoute === '/admin';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAdminRoute && <Header />}
      <main style={{ flex: 1 }}>
        {renderRoute()}
      </main>
      {!isAdminRoute && <Footer />}

      {/* Mobile Bottom Navigation Bar (Home, Apply, Track, Login, Help) */}
      {!isAdminRoute && (
        <div className="mobile-bottom-nav no-print" style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          display: 'none',
          justifyContent: 'space-around',
          padding: '0.5rem 0',
          zIndex: 90,
          boxShadow: '0 -4px 12px rgba(0,0,0,0.06)'
        }}>
          <button 
            onClick={() => navigate('/')}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: currentRoute === '/' ? '#DC2626' : '#64748B', fontSize: '0.7rem', fontWeight: 600 }}
          >
            <HomeIcon size={18} />
            <span>{lang === 'hi' ? 'होम' : 'Home'}</span>
          </button>

          <button 
            onClick={() => navigate('/apply')}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: currentRoute === '/apply' ? '#DC2626' : '#64748B', fontSize: '0.7rem', fontWeight: 600 }}
          >
            <Sparkles size={18} />
            <span>{lang === 'hi' ? 'आवेदन' : 'Apply'}</span>
          </button>

          <button 
            onClick={() => navigate('/track')}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: currentRoute === '/track' ? '#DC2626' : '#64748B', fontSize: '0.7rem', fontWeight: 600 }}
          >
            <Search size={18} />
            <span>{lang === 'hi' ? 'ट्रैक' : 'Track'}</span>
          </button>

          <button 
            onClick={() => navigate(isStudentLoggedIn ? '/student-dashboard' : '/student-login')}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '2px', 
              color: (currentRoute === '/student-dashboard' || currentRoute === '/student-login' || currentRoute === '/login' || currentRoute === '/student-register') ? '#DC2626' : '#64748B', 
              fontSize: '0.7rem', 
              fontWeight: 600, 
              position: 'relative' 
            }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={18} />
              {isStudentLoggedIn && (
                <span style={{
                  position: 'absolute',
                  top: -2,
                  right: -4,
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#16A34A',
                  border: '1.5px solid #FFFFFF'
                }} />
              )}
            </div>
            <span>
              {isStudentLoggedIn 
                ? (lang === 'hi' ? 'डैशबोर्ड' : 'Dashboard') 
                : (lang === 'hi' ? 'लॉगिन' : 'Login')}
            </span>
          </button>

          <button 
            onClick={() => navigate('/contact')}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: currentRoute === '/contact' ? '#DC2626' : '#64748B', fontSize: '0.7rem', fontWeight: 600 }}
          >
            <LifeBuoy size={18} />
            <span>{lang === 'hi' ? 'सहायता' : 'Help'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
