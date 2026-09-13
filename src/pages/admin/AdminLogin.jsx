import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

export const AdminLogin = () => {
  const { lang, navigate, login, setAuthRole } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSubmit = async (e) => {
    e?.preventDefault();
    if (!email || !password) {
      setErrorMessage(lang === 'hi' ? 'कृपया ईमेल और पासवर्ड दोनों दर्ज करें।' : 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage(err.message || 'Invalid credentials. Please verify and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    setErrorMessage('');
    try {
      await login(demoEmail, demoPassword);
      navigate('/admin');
    } catch (err) {
      console.error('Quick login error:', err);
      setErrorMessage(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-py" style={{ backgroundColor: '#0F172A', minHeight: '85vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        
        <div className="card animate-fade-in" style={{ padding: '2.5rem', borderRadius: '18px', boxShadow: '0 25px 60px rgba(0,0,0,0.4)', backgroundColor: '#FFFFFF' }}>
          
          {/* Top Logo & Title */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#EFF6FF', border: '2px solid #1E40AF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Shield size={28} color="#1E40AF" />
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>
              {lang === 'hi' ? 'प्रशासनिक लॉगिन' : 'Staff & Coordinator Login'}
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.3rem' }}>
              Jankalyan Manavadhikar Foundation Governance Portal
            </p>
          </div>

          {errorMessage && (
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', padding: '0.85rem 1rem', borderRadius: '10px', color: '#B91C1C', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit}>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label required">Official Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: '2.75rem' }}
                  placeholder="admin@jankalyan.org"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label required">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                  placeholder="••••••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', height: '48px', fontSize: '1rem' }}
              disabled={loading}
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Login Credentials Bar */}
          <div style={{ marginTop: '2rem', borderTop: '1px solid #E2E8F0', paddingTop: '1.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>
              Instant One-Click Demo Role Access:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button 
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => handleQuickDemoLogin('admin@jankalyan.org', 'Admin@JMF2026!')}
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.5rem' }}
              >
                Super Admin
              </button>

              <button 
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => handleQuickDemoLogin('district.jabalpur@jankalyan.org', 'District@JMF2026!')}
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.5rem' }}
              >
                District Coord
              </button>

              <button 
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => handleQuickDemoLogin('block.patan@jankalyan.org', 'Block@JMF2026!')}
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.5rem' }}
              >
                Block Coord
              </button>

              <button 
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => handleQuickDemoLogin('school.model@jankalyan.org', 'School@JMF2026!')}
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.5rem' }}
              >
                School Officer
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button 
              type="button" 
              onClick={() => navigate('/')} 
              style={{ color: '#64748B', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Exit to Public Website
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
