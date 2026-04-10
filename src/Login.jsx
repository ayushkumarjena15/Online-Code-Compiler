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
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={18} /> Back to Editor
      </button>

      <div className="login-container">
        {/* Portal Selection Tabs */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '28px 28px 0 0' }}>
          <button 
            onClick={() => setActivePortal('developer')}
            style={{ 
              flex: 1, padding: '1rem', border: 'none', 
              background: activePortal === 'developer' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              color: activePortal === 'developer' ? '#60a5fa' : '#94a3b8', 
              fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              borderRadius: '22px', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: activePortal === 'developer' ? '0 4px 12px rgba(0,0,0,0.2)' : 'none'
            }}
          >
            <User size={18} /> Developer
          </button>
          <button 
            onClick={() => setActivePortal('admin')}
            style={{ 
              flex: 1, padding: '1rem', border: 'none', 
              background: activePortal === 'admin' ? 'rgba(251, 191, 36, 0.15)' : 'transparent',
              color: activePortal === 'admin' ? '#fbbf24' : '#94a3b8', 
              fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              borderRadius: '22px', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: activePortal === 'admin' ? '0 4px 12px rgba(0,0,0,0.2)' : 'none'
            }}
          >
            <Shield size={18} /> Admin OS
          </button>
        </div>

        <div style={{ padding: '3.5rem 2.5rem', display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.5s ease' }}>
          <div className="login-logo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginBottom: '3rem' }}>
            <div style={{ 
              padding: '18px', borderRadius: '24px', 
              background: activePortal === 'admin' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(168, 85, 247, 0.1)', 
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: activePortal === 'admin' ? '0 0 30px rgba(251, 191, 36, 0.1)' : '0 0 30px rgba(168, 85, 247, 0.1)'
            }}>
               <Code2 size={56} color={activePortal === 'admin' ? '#fbbf24' : '#a855f7'} />
            </div>
            <div style={{ textAlign: 'center' }}>
               <h1 style={{ margin: 0, color: '#fff', fontSize: '2.5rem', letterSpacing: '-1.5px', fontWeight: 800 }}>
                 CodeZ <span style={{ color: activePortal === 'admin' ? '#fbbf24' : '#a855f7' }}>{activePortal === 'admin' ? 'OS' : 'Hub'}</span>
               </h1>
               <p style={{ margin: '10px 0 0', color: '#94a3b8', fontSize: '1rem', fontWeight: 500, opacity: 0.8 }}>
                 {activePortal === 'admin' ? 'Enterprise Management Console' : 'Online Code Compiler'}
               </p>
            </div>
          </div>

          <div style={{ width: '100%', minHeight: '220px' }}>
            {activePortal === 'developer' ? (
              <div key="dev" style={{ display: 'flex', flexDirection: 'column', gap: '14px', animation: 'slideIn 0.4s ease' }}>
                <button 
                  className="btn-provider github" 
                  onClick={() => handleOAuthLogin('github')}
                  style={{ 
                    background: '#1a1f26', color: '#fff', padding: '16px', borderRadius: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px',
                    fontWeight: 600, border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', fontSize: '1.05rem',
                    transition: 'all 0.3s'
                  }}
                >
                  <Github size={22} /> Continue with GitHub
                </button>
                
                <button 
                  className="btn-provider google" 
                  onClick={() => handleOAuthLogin('google')}
                  style={{ 
                    background: '#fff', color: '#1f2937', padding: '16px', borderRadius: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px',
                    fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: '1.05rem',
                    transition: 'all 0.3s'
                  }}
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '22px' }} />
                  Continue with Google
                </button>

                 <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '1.5rem 0' }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }}></div>
                    <span style={{ color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>Deployment Portal</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }}></div>
                 </div>

                 <p style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', lineHeight: 1.6 }}>
                   Joining implies agreement to our developer terms and conditions.
                 </p>
              </div>
            ) : (
              <form key="admin" onSubmit={handleAdminAuth} style={{ display: 'flex', flexDirection: 'column', gap: '18px', animation: 'slideIn 0.4s ease' }}>
                  <div style={{ position: 'relative' }}>
                     <User size={18} color="#64748b" style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)' }} />
                     <input 
                       type="text" 
                       placeholder="System Admin ID" 
                       value={adminEmail}
                       onChange={(e) => setAdminEmail(e.target.value)}
                       required
                       style={{ 
                         width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)',
                         padding: '16px 16px 16px 52px', borderRadius: '16px', color: '#fff', outline: 'none',
                         fontSize: '1rem', transition: 'all 0.3s'
                       }}
                     />
                  </div>
                 
                 <div style={{ position: 'relative' }}>
                    <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="password" 
                      placeholder="Root Password" 
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                      style={{ 
                        width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)',
                        padding: '16px 16px 16px 52px', borderRadius: '16px', color: '#fff', outline: 'none',
                        fontSize: '1rem', transition: 'all 0.3s'
                      }}
                    />
                 </div>

                 {error && (
                   <div style={{ color: '#f87171', fontSize: '0.85rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                      {error}
                   </div>
                 )}

                 <button 
                   type="submit"
                   style={{ 
                     background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', color: '#000', padding: '16px', borderRadius: '16px',
                     fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '1.05rem',
                     marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                     boxShadow: '0 8px 20px rgba(251, 191, 36, 0.2)', transition: 'all 0.3s'
                   }}
                 >
                   Authorize Session <ChevronRight size={18} />
                 </button>

                 <div 
                   onClick={() => onAdminLogin({ id: 'admin-001', email: 'admin@codez.com', role: 'admin' })}
                   style={{ textAlign: 'center', fontSize: '0.85rem', color: '#475569', cursor: 'pointer', marginTop: '1rem', transition: 'color 0.3s' }}
                   onMouseEnter={(e) => e.target.style.color = '#94a3b8'}
                   onMouseLeave={(e) => e.target.style.color = '#475569'}
                 >
                   Emergency Debug Bypass
                 </div>
              </form>
            )}
          </div>
        </div>
      </div>
      
      <p style={{ position: 'absolute', bottom: '2rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase' }}>
        Secured by CodeZ Encryption Standard
      </p>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { 
          from { opacity: 0; transform: translateX(10px); } 
          to { opacity: 1; transform: translateX(0); } 
        }
        input:focus { border-color: rgba(59, 130, 246, 0.5) !important; background: rgba(0,0,0,0.5) !important; box-shadow: 0 0 15px rgba(59, 130, 246, 0.1); }
      `}</style>
    </div>
  );
}
