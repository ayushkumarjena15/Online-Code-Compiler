import React, { useState } from 'react';
import { Github, Code2, ArrowLeft, Shield, User, Lock, Mail, ChevronRight } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function Login({ onBack, onAdminLogin }) {
  const [activePortal, setActivePortal] = useState('developer'); // 'developer' or 'admin'
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');

  const handleOAuthLogin = async (provider) => {
    await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  const handleAdminAuth = (e) => {
    e.preventDefault();
    // Specific hardcoded admin credentials as requested
    if (adminEmail === 'admin' && adminPassword === 'pass123') {
      onAdminLogin({ id: 'admin-001', email: 'admin@codez.com', role: 'admin' });
    } else {
      setError('Invalid Administrator Credentials');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="login-page">
      <button className="back-btn" onClick={onBack} style={{ position: 'absolute', top: '30px', left: '30px' }}>
        <ArrowLeft size={18} /> Back to Editor
      </button>

      <div className="login-container" style={{ 
        background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.1)', padding: 0, borderRadius: '24px',
        maxWidth: '480px', width: '100%', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
      }}>
        
        {/* Portal Selection Tabs */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)' }}>
          <button 
            onClick={() => setActivePortal('developer')}
            style={{ 
              flex: 1, padding: '1.25rem', border: 'none', background: activePortal === 'developer' ? 'transparent' : 'rgba(0,0,0,0.1)',
              color: activePortal === 'developer' ? '#3b82f6' : '#94a3b8', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              borderBottom: activePortal === 'developer' ? '2px solid #3b82f6' : 'none', transition: 'all 0.3s'
            }}
          >
            <User size={18} /> Developer
          </button>
          <button 
            onClick={() => setActivePortal('admin')}
            style={{ 
              flex: 1, padding: '1.25rem', border: 'none', background: activePortal === 'admin' ? 'transparent' : 'rgba(0,0,0,0.1)',
              color: activePortal === 'admin' ? '#fbbf24' : '#94a3b8', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              borderBottom: activePortal === 'admin' ? '2px solid #fbbf24' : 'none', transition: 'all 0.3s'
            }}
          >
            <Shield size={18} /> Administrator
          </button>
        </div>

        <div style={{ padding: '3rem 2.5rem' }}>
          <div className="login-logo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '2.5rem' }}>
            <div style={{ padding: '15px', borderRadius: '20px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
               <Code2 size={48} color={activePortal === 'admin' ? '#fbbf24' : '#a855f7'} />
            </div>
            <div style={{ textAlign: 'center' }}>
               <h1 style={{ margin: 0, color: '#fff', fontSize: '2rem', letterSpacing: '-1px' }}>CodeZ {activePortal === 'admin' ? 'OS' : 'Cloud'}</h1>
               <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: '0.95rem' }}>
                 {activePortal === 'admin' ? 'Access system management tools' : 'Join the global community of coders'}
               </p>
            </div>
          </div>

          {activePortal === 'developer' ? (
            <div className="developer-section" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                className="btn-provider github" 
                onClick={() => handleOAuthLogin('github')}
                style={{ 
                  background: '#24292e', color: '#fff', padding: '14px', borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                  fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: '1rem'
                }}
              >
                <Github size={20} /> Continue with GitHub
              </button>
              
              <button 
                className="btn-provider google" 
                onClick={() => handleOAuthLogin('google')}
                style={{ 
                  background: '#fff', color: '#1f2937', padding: '14px', borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                  fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: '1rem'
                }}
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '20px' }} />
                Continue with Google
              </button>
 
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '1rem 0' }}>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                  <span style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>or</span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
               </div>
 
               <p style={{ color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center' }}>
                 New to CodeZ? OAuth will automatically create your profile.
               </p>
             </div>
           ) : (
             <form onSubmit={handleAdminAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ position: 'relative' }}>
                   <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                   <input 
                     type="text" 
                     placeholder="Admin ID" 
                     value={adminEmail}
                     onChange={(e) => setAdminEmail(e.target.value)}
                     required
                     style={{ 
                       width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                       padding: '14px 14px 14px 48px', borderRadius: '12px', color: '#fff', outline: 'none'
                     }}
                   />
                </div>
               
               <div style={{ position: 'relative' }}>
                  <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="password" 
                    placeholder="Master Password" 
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    style={{ 
                      width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                      padding: '14px 14px 14px 48px', borderRadius: '12px', color: '#fff', outline: 'none'
                    }}
                  />
               </div>

               {error && (
                 <div style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '8px', borderRadius: '8px' }}>
                    {error}
                 </div>
               )}

               <button 
                 type="submit"
                 style={{ 
                   background: '#fbbf24', color: '#000', padding: '14px', borderRadius: '12px',
                   fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '1rem',
                   marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                 }}
               >
                 Authorize Command <ChevronRight size={18} />
               </button>

               <div 
                 onClick={() => onAdminLogin({ id: 'admin-001', email: 'admin@codez.com', role: 'admin' })}
                 style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b', cursor: 'pointer', marginTop: '1rem', textDecoration: 'underline' }}
               >
                 Fast track as Administrator (Debug)
               </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
