import React, { useState, useEffect } from 'react';
import { User, Award, CheckCircle2, Code2, Copy, Check, ChevronDown, ChevronRight, Activity, Calendar, Trophy, Clock, MessageSquare, XCircle } from 'lucide-react';
import { ALL_LANGUAGES } from './problemData';
import CertificateModal from './CertificateModal';

export default function Profile({ user, supabase }) {
  const [activeTab, setActiveTab] = useState('stats');
  const [progress, setProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [expandedCode, setExpandedCode] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [isSubmissionsLoading, setIsSubmissionsLoading] = useState(false);

  useEffect(() => {
    if (user && supabase) {
      fetchProgress();
      fetchSubmissions();
    } else {
      setIsLoading(false);
    }
  }, [user, supabase]);

  const fetchSubmissions = async () => {
    try {
      setIsSubmissionsLoading(true);
      const { data, error } = await supabase
        .from('code_submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });
      
      if (!error) setSubmissions(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmissionsLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('solved_at', { ascending: false });
        
      if (!error && data) {
        setProgress(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalSolved = progress.length;
  const langCounts = progress.reduce((acc, p) => {
    acc[p.language] = (acc[p.language] || 0) + 1;
    return acc;
  }, {});

  const getCertificatesWithProgress = () => {
    const certs = [];
    const categories = [
      { name: 'SQL', title: 'SQL 5 ⭐ Associate', range: [2000, 2999], target: 15 },
      { name: 'Python', title: 'Python 5 ⭐ Associate', range: [3000, 3999], target: 15 },
      { name: 'Java', title: 'Java 5 ⭐ Associate', range: [4000, 4999], target: 15 },
      { name: 'JavaScript', title: 'JavaScript 5 ⭐ Associate', range: [5000, 5999], target: 15 },
      { name: 'DSA', title: 'DSA 5 ⭐ Associate', range: [0, 1999], target: 20 },
    ];

    categories.forEach(cat => {
      const count = progress.filter(p => {
        const id = parseInt(p.problem_id);
        return !isNaN(id) && id >= cat.range[0] && id <= cat.range[1];
      }).length;

      certs.push({
        ...cat,
        count,
        earned: count >= cat.target,
        date: count >= cat.target ? new Date().toLocaleDateString() : null
      });
    });
    
    return certs;
  };

  const certificateProgress = getCertificatesWithProgress();
  const [selectedCert, setSelectedCert] = useState(null);

  return (
    <>
      {selectedCert && (
        <CertificateModal 
          lang={selectedCert.name} 
          title={selectedCert.title} 
          user={user} 
          onClose={() => setSelectedCert(null)} 
        />
      )}

      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* Profile Header Block */}
        <div style={{ 
          background: 'rgba(15, 23, 42, 0.4)', borderRadius: '28px', border: '1px solid var(--panel-border)', 
          padding: '2.5rem', display: 'flex', gap: '2.5rem', alignItems: 'center', 
          backdropFilter: 'blur(20px)', boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
        }}>
           <div style={{ 
             width: 120, height: 120, borderRadius: '32px', 
             background: 'linear-gradient(135deg, #a855f7, #3b82f6)', 
             display: 'flex', alignItems: 'center', justifyContent: 'center', 
             color: 'white', fontSize: '48px', fontWeight: 800, 
             boxShadow: '0 12px 24px rgba(168,85,247,0.3)', flexShrink: 0, overflow: 'hidden',
             border: '3px solid rgba(255,255,255,0.1)'
           }}>
             {user?.user_metadata?.avatar_url ? (
               <img src={user.user_metadata.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             ) : (
               user?.email?.charAt(0).toUpperCase() || 'U'
             )}
           </div>
           
           <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <h1 style={{ margin: 0, fontSize: '2.5rem', color: '#fff', fontWeight: 800, letterSpacing: '-1.5px' }}>
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Anonymous Developer'}
                </h1>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {certificateProgress.filter(c => c.earned).map((_, i) => (
                    <div key={i} title="Specialization Medal" style={{ padding: '6px', borderRadius: '8px', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                       <Trophy size={18} color="#fbbf24" style={{ filter: 'drop-shadow(0 0 5px rgba(251, 191, 36, 0.3))' }} />
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                 <p style={{ margin: 0, color: 'var(--text-2)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                    <Code2 size={18} color="#a855f7" /> {user?.email}
                 </p>
                 <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }}></div>
                 <span style={{ 
                   padding: '4px 12px', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', 
                   borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '0.85rem', fontWeight: 700 
                 }}>
                    Verified Account
                 </span>
              </div>
           </div>
           
           <div style={{ 
             display: 'flex', gap: '2rem', borderLeft: '1px solid rgba(255,255,255,0.05)', 
             paddingLeft: '2.5rem', alignItems: 'center' 
           }}>
              <div style={{ textAlign: 'center' }}>
                 <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#fbbf24', lineHeight: 1, letterSpacing: '-1px' }}>{totalSolved}</div>
                 <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', textTransform: 'uppercase', fontWeight: 800, marginTop: '8px', letterSpacing: '1.5px' }}>Problems</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                 <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#a855f7', lineHeight: 1, letterSpacing: '-1px' }}>{certificateProgress.filter(c => c.earned).length}</div>
                 <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', textTransform: 'uppercase', fontWeight: 800, marginTop: '8px', letterSpacing: '1.5px' }}>Achievements</div>
              </div>
           </div>
        </div>

        {/* Global Navigation Tabs */}
        <div style={{ 
          display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '6px', 
          borderRadius: '18px', width: 'fit-content', border: '1px solid rgba(255,255,255,0.04)' 
        }}>
           {[
             { id: 'stats', label: 'Overview', icon: <Activity size={18}/> },
             { id: 'solutions', label: 'Solutions', icon: <Code2 size={18}/> },
             { id: 'certs', label: 'Certifications', icon: <Award size={18}/> },
             { id: 'submissions', label: 'Code Feed', icon: <Clock size={18}/> }
           ].map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               style={{ 
                 padding: '0.75rem 1.75rem', borderRadius: '14px', border: 'none',
                 background: activeTab === tab.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                 color: activeTab === tab.id ? '#fff' : 'var(--text-3)', 
                 fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', 
                 display: 'flex', alignItems: 'center', gap: '0.6rem', transition: 'all 0.3s ease',
                 boxShadow: activeTab === tab.id ? '0 4px 15px rgba(0,0,0,0.2)' : 'none'
               }}
             >
               {tab.icon} {tab.label}
             </button>
           ))}
        </div>

        {/* Dynamic Content Surface */}
        <div style={{ minHeight: '400px', animation: 'fadeIn 0.5s ease-out' }}>
          {activeTab === 'solutions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {isLoading ? (
                 <div style={{ textAlign: 'center', padding: '6rem' }}><div className="loader" style={{ width: 40, height: 40, borderTopColor: '#a855f7' }}></div></div>
              ) : progress.length === 0 ? (
                 <div style={{ 
                   textAlign: 'center', padding: '6rem', background: 'rgba(15, 23, 42, 0.4)', 
                   borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)', color: 'var(--text-3)' 
                 }}>
                    <Code2 size={64} opacity={0.05} style={{ marginBottom: '1.5rem' }} />
                    <p style={{ fontSize: '1.1rem' }}>Initiate your first deployment to build your solutions portal.</p>
                 </div>
              ) : (
                 progress.map((p, i) => (
                   <div key={i} className="solution-card" style={{ 
                     background: 'rgba(15, 23, 42, 0.4)', borderRadius: '20px', 
                     border: '1px solid var(--panel-border)', overflow: 'hidden',
                     transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                   }}>
                      <div 
                        onClick={() => setExpandedCode(expandedCode === i ? null : i)}
                        style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: 'rgba(0,0,0,0.2)' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                          <div style={{ color: 'rgba(255,255,255,0.2)' }}>{expandedCode === i ? <ChevronDown size={20} /> : <ChevronRight size={20} />}</div>
                          <h4 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', fontWeight: 700 }}>{p.problem_id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                          <span style={{ 
                            padding: '4px 12px', borderRadius: '10px', background: 'rgba(59,130,246,0.12)', 
                            color: '#60a5fa', fontSize: '0.8rem', fontWeight: 800, border: '1px solid rgba(59,130,246,0.2)' 
                          }}>
                            {p.language.toUpperCase()}
                          </span>
                        </div>
                        <div style={{ color: 'var(--text-3)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Calendar size={16} /> {new Date(p.solved_at).toLocaleDateString()}
                        </div>
                      </div>
                      
                      {expandedCode === i && (
                        <div style={{ position: 'relative', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleCopy(p.code, i); }}
                            style={{ 
                              position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.05)', 
                              border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 16px', 
                              borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', 
                              fontSize: '0.85rem', fontWeight: 700, transition: 'all 0.2s', zIndex: 10
                            }}
                          >
                            {copiedId === i ? <><Check size={16} color="#10b981" /> Copied</> : <><Copy size={16} /> Copy Code</>}
                          </button>
                          <pre style={{ 
                            margin: 0, padding: '2rem', background: 'rgba(0,0,0,0.4)', 
                            color: '#94a3b8', overflowX: 'auto', fontSize: '0.95rem', 
                            fontFamily: "'Fira Code', monospace", lineHeight: 1.6
                          }}>
                            <code>{p.code || '// No source code available'}</code>
                          </pre>
                        </div>
                      )}
                   </div>
                 ))
              )}
            </div>
          )}

          {activeTab === 'certs' && (
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.75rem' }}>
                {certificateProgress.map((cert, i) => {
                   const progressPercent = Math.min(100, Math.round((cert.count / cert.target) * 100));
                   return (
                    <div key={i} className="cert-card" style={{ 
                      background: cert.earned ? 'rgba(251, 191, 36, 0.05)' : 'rgba(15, 23, 42, 0.4)', 
                      padding: '2rem', borderRadius: '24px', 
                      border: cert.earned ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid var(--panel-border)',
                      position: 'relative', overflow: 'hidden',
                      display: 'flex', flexDirection: 'column', gap: '1.5rem',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: cert.earned ? '0 10px 30px rgba(251, 191, 36, 0.05)' : 'none'
                    }}>
                       {cert.earned && (
                         <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.08, transform: 'rotate(15deg)' }}>
                            <Award size={140} color="#fbbf24" />
                         </div>
                       )}
                       
                       <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                          <div style={{ 
                            padding: '14px', borderRadius: '16px', 
                            background: cert.earned ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255,255,255,0.05)',
                            border: cert.earned ? '1px solid rgba(251, 191, 36, 0.2)' : '1px solid transparent'
                          }}>
                             <Award size={32} color={cert.earned ? '#fbbf24' : '#475569'} />
                          </div>
                          <div style={{ flex: 1 }}>
                             <h3 style={{ margin: 0, color: cert.earned ? '#fff' : '#64748b', fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.5px' }}>{cert.title}</h3>
                             <p style={{ margin: '4px 0 0', color: 'var(--text-3)', fontSize: '0.85rem', fontWeight: 600 }}>{cert.name} Specialization</p>
                          </div>
                       </div>

                       <div style={{ marginTop: 'auto' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                             <span style={{ color: cert.earned ? '#fbbf24' : 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {cert.earned ? 'Honor Earned' : 'Progress'}
                             </span>
                             <span style={{ color: 'var(--text-2)', fontWeight: 800 }}>{cert.count} / {cert.target}</span>
                          </div>
                          <div style={{ height: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.02)' }}>
                             <div style={{ height: '100%', width: `${progressPercent}%`, background: cert.earned ? 'linear-gradient(to right, #fbbf24, #f59e0b)' : 'linear-gradient(to right, #3b82f6, #8b5cf6)', borderRadius: '5px', transition: 'width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}></div>
                          </div>
                       </div>

                       {cert.earned ? (
                          <button 
                            onClick={() => setSelectedCert(cert)}
                            style={{
                              background: '#fff', color: '#000',
                              border: 'none', padding: '1rem', borderRadius: '16px', 
                              fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                              transition: 'all 0.3s'
                            }}
                            className="cert-btn"
                          >
                             <Trophy size={18} /> View Certificate
                          </button>
                       ) : (
                          <div style={{ 
                            padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', 
                            textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-3)', fontWeight: 600,
                            border: '1px solid rgba(255,255,255,0.03)'
                          }}>
                             Solve {cert.target - cert.count} more challenges
                          </div>
                       )}
                    </div>
                   );
                })}
             </div>
          )}

          {activeTab === 'submissions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {isSubmissionsLoading ? (
                <div style={{ textAlign: 'center', padding: '6rem' }}><div className="loader" style={{ width: 40, height: 40, borderTopColor: '#3b82f6' }}></div></div>
              ) : submissions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '6rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '24px', border: '1px dashed var(--panel-border)', color: 'var(--text-3)' }}>
                   <Clock size={64} opacity={0.05} style={{ marginBottom: '1.5rem' }} />
                   <p style={{ fontSize: '1.1rem' }}>Your code submission feed is currently empty.</p>
                </div>
              ) : (
                submissions.map((sub, i) => (
                  <div key={i} style={{ 
                    background: 'rgba(15, 23, 42, 0.4)', borderRadius: '24px', 
                    border: '1px solid var(--panel-border)', padding: '2rem', 
                    display: 'flex', flexDirection: 'column', gap: '1.5rem',
                    backdropFilter: 'blur(10px)'
                  }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 style={{ margin: 0, textTransform: 'capitalize', fontSize: '1.4rem', color: '#fff', fontWeight: 800, letterSpacing: '-0.5px' }}>{sub.problem_id.replace(/-/g, ' ')}</h4>
                          <div style={{ display: 'flex', gap: '10px', marginTop: '0.6rem' }}>
                             <span style={{ 
                               fontSize: '0.75rem', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', 
                               padding: '4px 12px', borderRadius: '8px', fontWeight: 700 
                             }}>{sub.language.toUpperCase()}</span>
                             <span style={{ 
                               fontSize: '0.75rem', 
                               background: sub.status === 'pending' ? 'rgba(251,191,36,0.1)' : sub.status === 'verified' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', 
                               color: sub.status === 'pending' ? '#fbbf24' : sub.status === 'verified' ? '#4ade80' : '#f87171', 
                               padding: '4px 12px', borderRadius: '8px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' 
                             }}>
                               {sub.status === 'pending' ? '🕒 Processing' : sub.status === 'verified' ? '✅ Approved' : '❌ Refined'}
                             </span>
                          </div>
                        </div>
                        <div style={{ color: 'var(--text-3)', fontSize: '0.9rem', fontWeight: 600 }}>{new Date(sub.submitted_at).toLocaleDateString()}</div>
                     </div>

                     {sub.admin_feedback && (
                        <div style={{ 
                          background: 'rgba(251, 191, 36, 0.05)', border: '1px solid rgba(251, 191, 36, 0.15)', 
                          borderRadius: '16px', padding: '1.25rem' 
                        }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                              <MessageSquare size={16} /> Technical Review
                           </div>
                           <p style={{ margin: 0, color: '#f1f5f9', fontSize: '1rem', lineHeight: 1.6, opacity: 0.9 }}>{sub.admin_feedback}</p>
                        </div>
                     )}

                     <button 
                        onClick={() => setExpandedCode(expandedCode === `sub_${i}` ? null : `sub_${i}`)}
                        style={{ 
                          width: 'fit-content', background: 'transparent', border: 'none', 
                          color: '#60a5fa', fontSize: '0.9rem', fontWeight: 700, 
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                          padding: 0
                        }}
                     >
                        {expandedCode === `sub_${i}` ? <><ChevronDown size={16}/> Hide Snapshot</> : <><ChevronRight size={16}/> Analyze My Code</>}
                     </button>

                     {expandedCode === `sub_${i}` && (
                        <pre style={{ 
                          margin: 0, padding: '1.75rem', background: 'rgba(0,0,0,0.5)', 
                          color: '#94a3b8', borderRadius: '16px', overflowX: 'auto', 
                          fontSize: '0.9rem', fontFamily: "'Fira Code', monospace", 
                          border: '1px solid rgba(255,255,255,0.03)' 
                        }}>
                          <code>{sub.code}</code>
                        </pre>
                     )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'stats' && (
             <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
               <div style={{ 
                 background: 'rgba(15, 23, 42, 0.4)', borderRadius: '24px', 
                 border: '1px solid var(--panel-border)', padding: '2rem', backdropFilter: 'blur(20px)' 
               }}>
                  <h3 style={{ margin: '0 0 2rem 0', color: '#fff', fontSize: '1.3rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Activity size={22} color="#3b82f6" /> Specializations
                  </h3>
                  {Object.entries(langCounts).length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {Object.entries(langCounts).sort((a,b) => b[1] - a[1]).map(([lang, count]) => {
                        const percentage = Math.round((count / totalSolved) * 100);
                        return (
                          <div key={lang}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.6rem', color: '#fff', fontWeight: 700 }}>
                              <span style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>{lang}</span>
                              <span style={{ color: 'var(--text-3)' }}>{percentage}% ({count})</span>
                            </div>
                            <div style={{ height: '8px', background: 'rgba(0,0,0,0.4)', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${percentage}%`, background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', borderRadius: '4px' }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-3)', fontSize: '1rem', textAlign: 'center', padding: '2rem 0' }}>No language data found yet.</div>
                  )}
               </div>
               
               <div style={{ 
                 background: 'rgba(15, 23, 42, 0.4)', borderRadius: '24px', 
                 border: '1px solid var(--panel-border)', padding: '2rem', backdropFilter: 'blur(20px)' 
               }}>
                  <h3 style={{ margin: '0 0 2rem 0', color: '#fff', fontSize: '1.3rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                     <CheckCircle2 size={22} color="#10b981" /> Activity Timeline
                  </h3>
                  {progress.length > 0 ? (
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {progress.slice(0, 6).map(p => (
                           <div key={p.id || p.problem_id + p.solved_at} style={{ 
                             display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', 
                             background: 'rgba(0,0,0,0.25)', borderRadius: '16px', 
                             borderLeft: '4px solid #10b981', transition: 'all 0.2s'
                           }} className="activity-item">
                             <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '50%' }}>
                                <CheckCircle2 size={18} color="#10b981" />
                             </div>
                             <div style={{ flex: 1 }}>
                                <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.2px' }}>Solved {p.problem_id.replace(/-/g, ' ')}</div>
                                <div style={{ color: 'var(--text-3)', fontSize: '0.85rem', marginTop: '4px', fontWeight: 600 }}>Deployed via {p.language.toUpperCase()} • {new Date(p.solved_at).toLocaleString()}</div>
                             </div>
                           </div>
                        ))}
                     </div>
                  ) : (
                     <div style={{ color: 'var(--text-3)', fontSize: '1rem', textAlign: 'center', padding: '4rem 0' }}>Silence on the timeline. Time to start the next project?</div>
                  )}
               </div>
             </div>
          )}
        </div>
        <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .solution-card:hover { border-color: rgba(168, 85, 247, 0.4); box-shadow: 0 10px 40px rgba(0,0,0,0.4); }
          .cert-card:hover { transform: translateY(-8px); border-color: rgba(251, 191, 36, 0.6); box-shadow: 0 15px 45px rgba(0,0,0,0.5); }
          .cert-btn:hover { background: #fbbf24 !important; transform: scale(1.02); }
          .activity-item:hover { background: rgba(0,0,0,0.35) !important; transform: translateX(5px); }
        `}</style>
      </div>
    </>
  );
}
