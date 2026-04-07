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
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-main)', padding: '2rem' }}>
      {selectedCert && (
        <CertificateModal 
          lang={selectedCert.name} 
          title={selectedCert.title} 
          user={user} 
          onClose={() => setSelectedCert(null)} 
        />
      )}

      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Profile Header */}
        <div style={{ background: 'var(--panel-bg)', borderRadius: '16px', border: '1px solid var(--panel-border)', padding: '2rem', display: 'flex', gap: '2rem', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
           <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '40px', fontWeight: 'bold', boxShadow: '0 8px 16px rgba(168,85,247,0.3)', flexShrink: 0, overflow: 'hidden' }}>
             {user?.user_metadata?.avatar_url ? (
               <img src={user.user_metadata.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             ) : (
               user?.email?.charAt(0).toUpperCase() || 'U'
             )}
           </div>
           <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <h1 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-main)', fontWeight: 800 }}>
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Anonymous User'}
                </h1>
                {certificateProgress.filter(c => c.earned).length > 0 && (
                   <div style={{ display: 'flex', gap: '4px' }}>
                     {certificateProgress.filter(c => c.earned).map((_, i) => <Trophy key={i} size={20} color="#fbbf24" style={{ filter: 'drop-shadow(0 0 5px rgba(251, 191, 36, 0.4))' }} />)}
                   </div>
                )}
              </div>
              <p style={{ margin: 0, color: 'var(--text-3)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <span><Code2 size={16} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }}/> {user?.email}</span>
                 <span style={{ padding: '2px 8px', background: 'rgba(59,130,246,0.1)', color: '#93c5fd', borderRadius: '4px', border: '1px solid rgba(59,130,246,0.3)', fontSize: '0.8rem', fontWeight: 600 }}>Verified Developer</span>
              </p>
           </div>
           
           <div style={{ display: 'flex', gap: '1.5rem', borderLeft: '1px solid var(--panel-border)', paddingLeft: '2rem', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                 <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fbbf24', lineHeight: 1 }}>{totalSolved}</div>
                 <div style={{ fontSize: '0.75rem', color: 'var(--text-2)', textTransform: 'uppercase', fontWeight: 700, marginTop: '4px', letterSpacing: '1px' }}>Solved</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                 <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#a855f7', lineHeight: 1 }}>{certificateProgress.filter(c => c.earned).length}</div>
                 <div style={{ fontSize: '0.75rem', color: 'var(--text-2)', textTransform: 'uppercase', fontWeight: 700, marginTop: '4px', letterSpacing: '1px' }}>Badges</div>
              </div>
           </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--panel-border)' }}>
          <button
            onClick={() => setActiveTab('stats')}
            style={{ padding: '1rem 1.5rem', background: 'transparent', border: 'none', borderBottom: activeTab === 'stats' ? '2px solid #a855f7' : '2px solid transparent', color: activeTab === 'stats' ? '#d8b4fe' : 'var(--text-3)', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
          >
            <Activity size={18} /> Overview
          </button>
          <button
            onClick={() => setActiveTab('solutions')}
            style={{ padding: '1rem 1.5rem', background: 'transparent', border: 'none', borderBottom: activeTab === 'solutions' ? '2px solid #a855f7' : '2px solid transparent', color: activeTab === 'solutions' ? '#d8b4fe' : 'var(--text-3)', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
          >
            <Code2 size={18} /> My Solutions
          </button>
          <button
            onClick={() => setActiveTab('certs')}
            style={{ padding: '1rem 1.5rem', background: 'transparent', border: 'none', borderBottom: activeTab === 'certs' ? '2px solid #a855f7' : '2px solid transparent', color: activeTab === 'certs' ? '#d8b4fe' : 'var(--text-3)', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
          >
            <Award size={18} /> Certificates
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            style={{ padding: '1rem 1.5rem', background: 'transparent', border: 'none', borderBottom: activeTab === 'submissions' ? '2px solid #a855f7' : '2px solid transparent', color: activeTab === 'submissions' ? '#d8b4fe' : 'var(--text-3)', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
          >
            <Clock size={18} /> Submissions
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'solutions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {isLoading ? (
               <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-3)' }}>Loading solutions...</div>
            ) : progress.length === 0 ? (
               <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--panel-bg)', borderRadius: '12px', border: '1px dashed var(--panel-border)', color: 'var(--text-3)' }}>
                  <Code2 size={48} opacity={0.2} style={{ marginBottom: '1rem' }} />
                  <p>You haven't solved any problems yet. Start coding to build your solutions portfolio!</p>
               </div>
            ) : (
               progress.map((p, i) => (
                 <div key={i} style={{ background: 'var(--panel-bg)', borderRadius: '12px', border: '1px solid var(--panel-border)', overflow: 'hidden' }}>
                    <div 
                      onClick={() => setExpandedCode(expandedCode === i ? null : i)}
                      style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: 'rgba(0,0,0,0.1)' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {expandedCode === i ? <ChevronDown size={18} color="var(--text-3)" /> : <ChevronRight size={18} color="var(--text-3)" />}
                        <h4 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.1rem' }}>{p.problem_id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(59,130,246,0.1)', color: '#93c5fd', fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(59,130,246,0.2)' }}>
                          {p.language}
                        </span>
                      </div>
                      <div style={{ color: 'var(--text-3)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Calendar size={14} />
                        {new Date(p.solved_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {expandedCode === i && (
                      <div style={{ position: 'relative', borderTop: '1px solid var(--panel-border)' }}>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleCopy(p.code, i); }}
                          style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', color: 'var(--text-2)', padding: '0.4rem 0.6rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
                        >
                          {copiedId === i ? <><Check size={14} color="#22c55e" /> Copied!</> : <><Copy size={14} /> Copy</>}
                        </button>
                        <pre style={{ margin: 0, padding: '1.5rem', background: 'rgba(0,0,0,0.3)', color: '#f8fafc', overflowX: 'auto', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                          <code>{p.code || '// No code saved for this submission'}</code>
                        </pre>
                      </div>
                    )}
                 </div>
               ))
            )}
          </div>
        )}

        {activeTab === 'certs' && (
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {certificateProgress.map((cert, i) => {
                 const progressPercent = Math.min(100, Math.round((cert.count / cert.target) * 100));
                 return (
                  <div key={i} style={{ 
                    background: cert.earned ? 'rgba(15, 23, 42, 0.6)' : 'rgba(15, 23, 42, 0.4)', 
                    padding: '1.75rem', borderRadius: '16px', 
                    border: cert.earned ? '1px solid #fbbf24' : '1px solid var(--panel-border)',
                    position: 'relative', overflow: 'hidden',
                    display: 'flex', flexDirection: 'column', gap: '1.25rem',
                    transition: 'transform 0.3s, box-shadow 0.3s'
                  }}>
                     {cert.earned && (
                       <div style={{ position: 'absolute', top: -10, right: -10, opacity: 0.1, transform: 'rotate(15deg)' }}>
                          <Award size={100} color="#fbbf24" />
                       </div>
                     )}
                     
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '10px', borderRadius: '12px', background: cert.earned ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255,255,255,0.05)' }}>
                           <Award size={24} color={cert.earned ? '#fbbf24' : '#64748b'} />
                        </div>
                        <div style={{ flex: 1 }}>
                           <h3 style={{ margin: 0, color: cert.earned ? '#fff' : '#94a3b8', fontSize: '1.1rem', fontWeight: 700 }}>{cert.title}</h3>
                           <p style={{ margin: '4px 0 0', color: 'var(--text-3)', fontSize: '0.8rem' }}>{cert.name} Specialization</p>
                        </div>
                     </div>

                     <div style={{ marginTop: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.85rem' }}>
                           <span style={{ color: cert.earned ? '#fbbf24' : 'var(--text-2)', fontWeight: 600 }}>
                              {cert.earned ? 'Completed' : 'In Progress'}
                           </span>
                           <span style={{ color: 'var(--text-3)' }}>{cert.count}/{cert.target} Solved</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(0,0,0,0.3)', borderRadius: '3px', overflow: 'hidden' }}>
                           <div style={{ height: '100%', width: `${progressPercent}%`, background: cert.earned ? '#fbbf24' : '#3b82f6', borderRadius: '3px', transition: 'width 1s ease-out' }}></div>
                        </div>
                     </div>

                     {cert.earned ? (
                        <button 
                          onClick={() => setSelectedCert(cert)}
                          style={{
                            background: 'linear-gradient(to right, #fbbf24, #d97706)', color: '#000',
                            border: 'none', padding: '0.75rem', borderRadius: '8px', 
                            fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                          }}
                        >
                           <Trophy size={16} /> View Official Certificate
                        </button>
                     ) : (
                        <p style={{ margin: 0, textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-3)', padding: '0.5rem', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                           Solve {cert.target - cert.count} more to unlock
                        </p>
                     )}
                  </div>
                 );
              })}
           </div>
        )}

        {activeTab === 'submissions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {isSubmissionsLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-3)' }}>Loading submissions...</div>
            ) : submissions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--panel-bg)', borderRadius: '12px', border: '1px dashed var(--panel-border)', color: 'var(--text-3)' }}>
                 <Clock size={48} opacity={0.2} style={{ marginBottom: '1rem' }} />
                 <p>You haven't submitted any code for verification yet.</p>
              </div>
            ) : (
              submissions.map((sub, i) => (
                <div key={i} style={{ background: 'var(--panel-bg)', borderRadius: '16px', border: '1px solid var(--panel-border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ margin: 0, textTransform: 'capitalize', fontSize: '1.1rem', color: '#fff' }}>{sub.problem_id.replace(/-/g, ' ')}</h4>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem' }}>
                           <span style={{ fontSize: '0.7rem', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>{sub.language}</span>
                           <span style={{ fontSize: '0.7rem', background: sub.status === 'pending' ? 'rgba(251,191,36,0.1)' : sub.status === 'verified' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: sub.status === 'pending' ? '#fbbf24' : sub.status === 'verified' ? '#4ade80' : '#f87171', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, textTransform: 'uppercase' }}>{sub.status}</span>
                        </div>
                      </div>
                      <div style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>{new Date(sub.submitted_at).toLocaleDateString()}</div>
                   </div>

                   {sub.admin_feedback && (
                      <div style={{ background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '12px', padding: '1rem' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                            <MessageSquare size={14} /> Admin Feedback
                         </div>
                         <p style={{ margin: 0, color: '#f8fafc', fontSize: '0.9rem', lineHeight: 1.5 }}>{sub.admin_feedback}</p>
                      </div>
                   )}

                   <div 
                      onClick={() => setExpandedCode(expandedCode === `sub_${i}` ? null : `sub_${i}`)}
                      style={{ borderTop: '1px solid var(--panel-border)', paddingTop: '0.75rem', color: '#a855f7', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                   >
                      {expandedCode === `sub_${i}` ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                      {expandedCode === `sub_${i}` ? 'Hide Submitted Code' : 'View Submitted Code'}
                   </div>

                   {expandedCode === `sub_${i}` && (
                      <pre style={{ margin: 0, padding: '1.25rem', background: 'rgba(0,0,0,0.3)', color: '#94a3b8', borderRadius: '12px', overflowX: 'auto', fontSize: '0.85rem', fontFamily: 'monospace', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <code>{sub.code}</code>
                      </pre>
                   )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'stats' && (
           <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr', gap: '1.5rem' }}>
             <div style={{ background: 'var(--panel-bg)', borderRadius: '12px', border: '1px solid var(--panel-border)', padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-main)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity size={18} color="#3b82f6" /> Languages Used
                </h3>
                {Object.entries(langCounts).length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {Object.entries(langCounts).sort((a,b) => b[1] - a[1]).map(([lang, count]) => {
                      const percentage = Math.round((count / totalSolved) * 100);
                      return (
                        <div key={lang}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem', color: 'var(--text-2)', fontWeight: 600 }}>
                            <span style={{ textTransform: 'capitalize' }}>{lang}</span>
                            <span>{percentage}% ({count})</span>
                          </div>
                          <div style={{ height: '6px', background: 'rgba(0,0,0,0.3)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${percentage}%`, background: '#3b82f6', borderRadius: '3px' }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ color: 'var(--text-3)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem 0' }}>No language data yet.</div>
                )}
             </div>
             
             <div style={{ background: 'var(--panel-bg)', borderRadius: '12px', border: '1px solid var(--panel-border)', padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-main)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <CheckCircle2 size={18} color="#22c55e" /> Recent Activity
                </h3>
                {progress.length > 0 ? (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {progress.slice(0, 5).map(p => (
                         <div key={p.id || p.problem_id + p.solved_at} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', borderLeft: '3px solid #22c55e' }}>
                           <div style={{ background: 'rgba(34,197,94,0.1)', padding: '0.5rem', borderRadius: '50%' }}>
                              <CheckCircle2 size={16} color="#22c55e" />
                           </div>
                           <div style={{ flex: 1 }}>
                              <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.95rem' }}>Solved {p.problem_id.replace(/-/g, ' ')}</div>
                              <div style={{ color: 'var(--text-3)', fontSize: '0.8rem', marginTop: '0.2rem' }}>in {p.language} • {new Date(p.solved_at).toLocaleString()}</div>
                           </div>
                         </div>
                      ))}
                   </div>
                ) : (
                   <div style={{ color: 'var(--text-3)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>No recent activity. Get coding!</div>
                )}
             </div>
           </div>
        )}

      </div>
    </div>
  );
}
