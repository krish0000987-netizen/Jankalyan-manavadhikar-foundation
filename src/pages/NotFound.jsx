import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  const { lang, navigate } = useApp();

  return (
    <div className="section-py" style={{ backgroundColor: '#F8FAFC', minHeight: '75vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <div style={{ maxWidth: '540px', margin: '0 auto' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            backgroundColor: '#FEF2F2', 
            color: '#DC2626', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 1.5rem' 
          }}>
            <AlertCircle size={44} />
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.5rem' }}>
            404
          </h1>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1B2A4E', marginBottom: '1rem' }}>
            {lang === 'hi' ? 'पृष्ठ नहीं मिला (Page Not Found)' : 'Page Not Found'}
          </h2>
          <p style={{ color: '#64748B', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            {lang === 'hi' 
              ? 'आप जिस पृष्ठ को खोज रहे हैं वह स्थानांतरित कर दिया गया है अथवा उपलब्ध नहीं है।' 
              : 'The requested portal page could not be located. Please return to the homepage or search for your application.'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              <Home size={16} />
              <span>{lang === 'hi' ? 'मुख्य पृष्ठ पर जाएं' : 'Go to Homepage'}</span>
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/track')}>
              <span>{lang === 'hi' ? 'आवेदन ट्रैक करें' : 'Track Application'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
