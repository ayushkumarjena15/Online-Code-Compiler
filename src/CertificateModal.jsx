import React, { useMemo, useRef } from 'react';
import { Award, Medal, CheckCircle2, Trophy, X, Download, QrCode, Star } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function CertificateModal({ lang, title, user, onClose }) {
  const certRef = useRef(null);
  const certId = useMemo(() => Math.random().toString(36).substring(2, 10).toUpperCase(), []);
  const verifyUrl = `https://codez-eval.com/verify/${certId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(verifyUrl)}&bgcolor=111827&color=fbbf24`;

  const getIconUrlSafe = (id) => {
    const normalizedId = id?.toLowerCase().replace(/\s+/g, '') || '';
    const map = {
       cpp: 'cplusplus',
       csharp: 'csharp',
       sql: 'sqldeveloper',
       r: 'r',
       go: 'go',
       ruby: 'ruby',
       javascript: 'javascript',
       python: 'python',
       java: 'java'
    };
    const iconId = map[normalizedId] || normalizedId;
    return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${iconId}/${iconId}-original.svg`;
  };

  const handleDownloadPDF = async () => {
    if (!certRef.current) return;
    const element = certRef.current;
    
    // Create a temporary clone to ensure perfect capture
    const canvas = await html2canvas(element, {
      scale: 3, // High quality
      useCORS: true,
      backgroundColor: '#0a1122',
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`CodeZ_Certificate_${title?.replace(/\s+/g,'_') || 'Proficiency'}.pdf`);
  };

  return (
    <div style={{ 
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.98)', zIndex: 10000, 
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center', 
      padding: '20px', backdropFilter: 'blur(15px)', overflowY: 'auto' 
    }}>
      {/* Global CSS for Print and Animations */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0; padding: 0; }
          .cert-container { 
            position: fixed !important; 
            top: 0 !important; left: 0 !important; 
            width: 100vw !important; height: 100vh !important;
            margin: 0 !important; border: none !important; 
            box-shadow: none !important;
            transform: scale(1) !important;
          }
          .cert-paper { border: 15px solid #fbbf24 !important; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shine {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
      `}</style>

      <div style={{ width: '100%', maxWidth: '1100px', margin: '2rem auto', position: 'relative' }}>
        {/* Close Button UI */}
        <button 
          onClick={onClose} 
          className="no-print"
          style={{ 
            position: 'absolute', top: '-10px', right: '-10px', 
            background: '#ef4444', color: '#fff', border: '4px solid #000', 
            cursor: 'pointer', zIndex: 10001, borderRadius: '50%', 
            width: '40px', height: '40px', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)' 
          }}
        >
          <X size={20} fontWeight="bold" />
        </button>

        {/* Certificate Paper */}
        <div ref={certRef} className="cert-container" style={{ 
          width: '100%', aspectRatio: '1.414/1', background: '#0a1122', 
          border: '2px solid #1e293b', position: 'relative', 
          boxShadow: '0 50px 150px rgba(0,0,0,1)', borderRadius: '4px',
          overflow: 'hidden'
        }}>
          {/* Subtle Shine Effect */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'hidden', pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', width: '200%', height: '200%', background: 'linear-gradient(45deg, transparent, rgba(251, 191, 36, 0.03), transparent)', animation: 'shine 10s infinite linear' }}></div>
          </div>

          <div className="cert-paper" style={{ padding: '3.5rem', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
            {/* Outer Border with Gradient */}
            <div style={{ position: 'absolute', inset: '15px', border: '15px solid transparent', borderImage: 'linear-gradient(135deg, #fbbf24 0%, #d97706 50%, #fbbf24 100%) 1', pointerEvents: 'none' }}></div>
            
            <div style={{ border: '1px solid rgba(251, 191, 36, 0.3)', height: '100%', padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'radial-gradient(circle at center, #111827 0%, #0a0f1e 100%)' }}>
              
              {/* Header Section */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', marginBottom: '1rem' }}>
                <div style={{ marginBottom: '0.75rem', position: 'relative' }}>
                  <Award size={64} color="#fbbf24" style={{ filter: 'drop-shadow(0 0 15px rgba(251, 191, 36, 0.4))' }} />
                  {/* Course Specific Badge */}
                  <div style={{ position: 'absolute', bottom: '-10px', right: '-15px', background: '#0a1122', borderRadius: '50%', padding: '4px', border: '2px solid #fbbf24' }}>
                     <img 
                       src={getIconUrlSafe(lang)} 
                       alt={lang} 
                       style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                       onError={(e) => e.target.style.display = 'none'}
                     />
                  </div>
                </div>
                <h1 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '8px', color: '#fbbf24', fontSize: '1.2rem', fontWeight: 600 }}>Official Certificate of Proficiency</h1>
                
                {/* 5-STAR RATING SECTION */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', margin: '0.5rem 0' }}>
                   <div style={{ display: 'flex', gap: '4px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} color="#fbbf24" fill="#fbbf24" style={{ filter: 'drop-shadow(0 0 5px rgba(251, 191, 36, 0.6))' }} />
                      ))}
                   </div>
                   <div style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
                      {lang} 5-STAR PROFICIENCY
                   </div>
                </div>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem', fontWeight: 500 }}>THIS CREDENTIAL VERIFIES MASTERY AND EXPERTISE IN</p>
              </div>

              {/* Title Section */}
              <div style={{ margin: '0.5rem 0' }}>
                <h2 style={{ fontSize: '3.2rem', color: '#fff', margin: 0, letterSpacing: '2px', background: 'linear-gradient(to bottom, #fff 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>{title}</h2>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '0.25rem' }}>
                   <div style={{ height: '2px', width: '60px', background: 'linear-gradient(to right, transparent, rgba(251, 191, 36, 0.5))' }}></div>
                   <Trophy size={18} color="#fbbf24" opacity={0.8} />
                   <div style={{ height: '2px', width: '60px', background: 'linear-gradient(to left, transparent, rgba(251, 191, 36, 0.5))' }}></div>
                </div>
              </div>

              {/* Body Section */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.5rem' }}>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '1rem', fontStyle: 'italic', letterSpacing: '3px' }}>Awarded To</p>
                <h3 style={{ fontSize: '3.2rem', margin: '0.25rem 0', color: '#fff', fontWeight: 700, fontFamily: '"Libre Baskerville", serif', letterSpacing: '1px' }}>{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</h3>
                <p style={{ margin: '0 15%', color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>In recognition of successfully fulfilling all technical requirements and demonstrating advanced problem-solving capabilities within the CodeZ engineering ecosystem.</p>
              </div>

              {/* Footer Section */}
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', padding: '0 1rem' }}>
                {/* ID & QR SECTION */}
                <div style={{ textAlign: 'left', minWidth: '180px', display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
                  <div style={{ background: '#fff', padding: '6px', borderRadius: '4px', border: '2px solid #fbbf24', boxShadow: '0 0 15px rgba(251, 191, 36, 0.2)' }}>
                     <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verifyUrl)}`} alt="Verification QR" style={{ width: '70px', height: '70px', display: 'block' }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                       <CheckCircle2 size={14} color="#22c55e" />
                       <span style={{ fontSize: '0.75rem', color: '#fff', fontWeight: 800, letterSpacing: '0.5px' }}>ID: {certId}</span>
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>VERIFIED ON: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</div>
                  </div>
                </div>
                
                {/* SEAL SECTION */}
                <div style={{ transform: 'translateY(15px)' }}>
                   <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '4px double #fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(251, 191, 36, 0.05)', position: 'relative' }}>
                      <Medal size={48} color="#fbbf24" style={{ filter: 'drop-shadow(0 0 5px rgba(251, 191, 36, 0.5))' }} />
                      <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1px dashed rgba(251, 191, 36, 0.3)', borderRadius: '50%', animation: 'spin 20s linear infinite' }}></div>
                   </div>
                   <p style={{ margin: '8px 0 0 0', fontSize: '0.65rem', color: '#fbbf24', fontWeight: 800, letterSpacing: '2px' }}>OFFICIAL SEAL</p>
                </div>

                {/* SIGNATURE SECTION */}
                <div style={{ textAlign: 'right', minWidth: '180px' }}>
                  <div style={{ fontFamily: '"Great Vibes", cursive', fontSize: '1.8rem', color: '#fbbf24', marginBottom: '0.25rem', paddingRight: '1rem' }}>CodeZ Team</div>
                  <div style={{ width: '100%', height: '1px', background: 'linear-gradient(to left, #fbbf24, transparent)', marginBottom: '0.5rem' }}></div>
                  <p style={{ fontWeight: 800, fontSize: '0.85rem', color: '#fff', margin: 0, letterSpacing: '1px' }}>PLATFORM AUTHORITY</p>
                  <p style={{ fontSize: '0.65rem', color: '#64748b', margin: '2px 0 0 0' }}>VERIFIED ENGINEERING CREDENTIAL</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="no-print" style={{ 
          display: 'flex', gap: '1.5rem', justifyContent: 'center', 
          marginTop: '3.5rem', paddingBottom: '2rem'
        }}>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'rgba(255,255,255,0.05)', color: '#fff', 
              border: '1px solid rgba(255,255,255,0.2)', padding: '1rem 2.5rem', 
              borderRadius: '16px', fontSize: '1rem', fontWeight: 800, 
              cursor: 'pointer', transition: 'all 0.3s', display: 'flex', 
              alignItems: 'center', gap: '0.8rem', backdropFilter: 'blur(5px)'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            Close Viewer
          </button>
          <button 
            onClick={handleDownloadPDF}
            style={{ 
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', 
              color: '#000', border: 'none', padding: '1rem 3rem', 
              borderRadius: '16px', fontSize: '1.15rem', fontWeight: 900, 
              cursor: 'pointer', transition: 'all 0.3s', display: 'flex', 
              alignItems: 'center', gap: '0.8rem', boxShadow: '0 15px 30px rgba(245, 158, 11, 0.4)',
              transform: 'scale(1.05)'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1.05) translateY(0)'}
          >
            <Download size={22} strokeWidth={3} />
            SAVE AS PDF
          </button>
        </div>
      </div>
    </div>
  );
}
