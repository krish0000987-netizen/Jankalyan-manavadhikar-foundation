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
import { Home as HomeIcon, Sparkles, Search, User, LifeBuoy } from 'lucide-react';

const MainRouter = () => {
  const { currentRoute, navigate, lang } = useApp();

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
        return <Scholarship />;
      case '/apply':
        return <Apply />;
      case '/documents':
        return <Documents />;
      case '/track':
        return <Track />;
      case '/student-dashboard':
        return <StudentDashboard />;
      case '/admin/login':
      case '/district-login':
      case '/block-login':
      case '/institution-login':
      case '/portal-login':
        return <AdminLogin />;
      case '/admin':
        return <Admin />;
      case '/certificate':
        return <CertificateView />;
      case '/downloads':
        return <Downloads />;
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
            onClick={() => navigate('/student-dashboard')}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: currentRoute === '/student-dashboard' ? '#DC2626' : '#64748B', fontSize: '0.7rem', fontWeight: 600 }}
          >
            <User size={18} />
            <span>{lang === 'hi' ? 'लॉगिन' : 'Login'}</span>
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
