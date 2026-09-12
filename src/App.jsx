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
import { Downloads } from './pages/Downloads';
import { Grievance } from './pages/Grievance';
import { Faq } from './pages/Faq';
import { Contact } from './pages/Contact';
import { Legal } from './pages/Legal';
import { NotFound } from './pages/NotFound';
import { Home as HomeIcon, Sparkles, Search, User, LifeBuoy } from 'lucide-react';

const MainRouter = () => {
  const { currentRoute, navigate, lang } = useApp();

  const renderRoute = () => {
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
      case '/admin':
      case '/district-login':
      case '/block-login':
      case '/institution-login':
        return <Admin />;
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1 }}>
        {renderRoute()}
      </main>
      <Footer />

      {/* Mobile Bottom Navigation Bar (Home, Apply, Track, Login, Help) */}
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
