import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, MessageSquare, Code2, ExternalLink, Clock, User, Filter, Search, LayoutDashboard, Shield, Users, Activity, RefreshCw } from 'lucide-react';

export default function AdminPanel({ user, supabase }) {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ users: 0, submissions: 0, verified: 0, languages: {} });

  useEffect(() => {
    fetchSubmissions();
    if (activeTab === 'dashboard') fetchStats();
  }, [filter, activeTab]);

  useEffect(() => {
    // Subscribe to real-time changes in code_submissions table
    const channel = supabase
      .channel('admin-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'code_submissions' },
        () => {
          fetchSubmissions();
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStats = async () => {
    try {
      const { data: allSub, error: subErr } = await supabase.from('code_submissions').select('*');
      if (subErr) throw subErr;

      const uniqueUsers = new Set(allSub.map(s => s.user_id)).size;
      const verified = allSub.filter(s => s.status === 'verified').length;
      const langCounts = {};
      allSub.forEach(s => {
        langCounts[s.language] = (langCounts[s.language] || 0) + 1;
      });

      setStats({
        users: uniqueUsers,
        submissions: allSub.length,
        verified,
        languages: langCounts
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('code_submissions')
        .select(`
          *,
          profile: profiles ( email, full_name )
        `)
        .order('submitted_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setSubmissions(data || []);
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = async (id, status) => {
    try {
      const { error } = await supabase
        .from('code_submissions')
        .update({
          status,
          admin_feedback: feedback,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      setSelectedSubmission(null);
      setFeedback('');
      fetchSubmissions();
      fetchStats();
    } catch (err) {
      alert('Error updating submission: ' + err.message);
    }
  };

  const filteredSubmissions = submissions.filter(s => 
    s.problem_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#0f172a', padding: '2rem', color: '#f8fafc' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2.2rem', fontWeight: 800, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Shield size={32} /> Administrator OS
            </h1>
            <p style={{ margin: '0.5rem 0 0 0', color: '#94a3b8', fontSize: '1rem' }}>Command center for system-wide verification & analytics</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => { fetchSubmissions(); fetchStats(); }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '0.6rem 1rem', borderRadius: '12px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
              title="Manually refresh data"
            >
               <RefreshCw size={16} className={isLoading ? 'loader' : ''} /> Refresh
            </button>
            <div style={{ display: 'flex', background: '#1e293b', borderRadius: '12px', padding: '4px' }}>
              <button 
                onClick={() => setActiveTab('dashboard')}
                style={{ padding: '0.6rem 1.25rem', border: 'none', borderRadius: '8px', background: activeTab === 'dashboard' ? '#fbbf24' : 'transparent', color: activeTab === 'dashboard' ? '#000' : '#94a3b8', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
              >
                 <LayoutDashboard size={18} /> Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('reviews')}
                style={{ position: 'relative', padding: '0.6rem 1.25rem', border: 'none', borderRadius: '8px', background: activeTab === 'reviews' ? '#fbbf24' : 'transparent', color: activeTab === 'reviews' ? '#000' : '#94a3b8', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
              >
                 <Code2 size={18} /> Code Reviews
                 {submissions.filter(s => s.status === 'pending').length > 0 && (
                    <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: '#fff', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '10px', border: '2px solid #0f172a', fontWeight: 800 }}>
                      {submissions.filter(s => s.status === 'pending').length}
                    </span>
                 )}
              </button>
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
               <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}>
                  <div style={{ width: '48px', height: '48px', background: 'rgba(59,130,246,0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={24} color="#3b82f6" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>Total Developers</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>{stats.users}</div>
                  </div>
               </div>
               
               <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}>
                  <div style={{ width: '48px', height: '48px', background: 'rgba(168,85,247,0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Code2 size={24} color="#a855f7" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>Total Submissions</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>{stats.submissions}</div>
                  </div>
               </div>

               <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}>
                  <div style={{ width: '48px', height: '48px', background: 'rgba(34,197,94,0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={24} color="#22c55e" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>Verified Solutions</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>{stats.verified}</div>
                  </div>
               </div>

               <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}>
                  <div style={{ width: '48px', height: '48px', background: 'rgba(251,191,36,0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Activity size={24} color="#fbbf24" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>Success Rate</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                      {stats.submissions > 0 ? Math.round((stats.verified / stats.submissions) * 100) : 0}%
                    </div>
                  </div>
               </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
               <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity size={18} color="#fbbf24" /> Language Popularity
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {Object.entries(stats.languages).sort((a,b) => b[1] - a[1]).map(([lang, count]) => {
                      const perc = Math.round((count / stats.submissions) * 100);
                      return (
                        <div key={lang}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem', color: '#94a3b8' }}>
                              <span style={{ textTransform: 'capitalize', fontWeight: 600, color: '#cbd5e1' }}>{lang}</span>
                              <span>{count} submissions ({perc}%)</span>
                           </div>
                           <div style={{ height: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${perc}%`, background: '#fbbf24', borderRadius: '4px' }}></div>
                           </div>
                        </div>
                      )
                    })}
                    {Object.keys(stats.languages).length === 0 && <p style={{ color: '#64748b', textAlign: 'center' }}>No data available yet</p>}
                  </div>
               </div>

               <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', color: '#fff' }}>Quick Actions</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                     <button onClick={() => { setFilter('pending'); setActiveTab('reviews'); }} style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)', padding: '1rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Clock size={18} /> View Pending Reviews ({submissions.filter(s => s.status === 'pending').length})
                     </button>
                     <button style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)', padding: '1rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Users size={18} /> Manage Developers
                     </button>
                  </div>
               </div>

               <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '1.5rem', gridColumn: 'span 2' }}>
                  <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity size={18} color="#fbbf24" /> Recent Activity
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {submissions.slice(0, 5).map(sub => (
                      <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                           <div style={{ padding: '8px', background: 'rgba(251,191,36,0.1)', borderRadius: '8px' }}>
                              <Code2 size={16} color="#fbbf24" />
                           </div>
                           <div>
                              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>{sub.profile?.full_name || sub.profile?.email || 'Anonymous'}</div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Submitted <span style={{ color: '#fbbf24' }}>{sub.problem_id}</span> in {sub.language}</div>
                           </div>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{new Date(sub.submitted_at).toLocaleTimeString()}</div>
                      </div>
                    ))}
                    {submissions.length === 0 && <p style={{ color: '#64748b', textAlign: 'center' }}>No recent activity</p>}
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: '#1e293b', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Filter size={18} color="#94a3b8" />
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                  style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #334155', borderRadius: '8px', padding: '0.5rem 1rem', color: 'white', outline: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
                >
                  <option value="pending">⏳ Pending Reviews</option>
                  <option value="verified">✅ Verified Solutions</option>
                  <option value="rejected">❌ Rejected Submissions</option>
                  <option value="all">📦 All History</option>
                </select>
              </div>
              
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input 
                  type="text" 
                  placeholder="Search problems, languages..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #334155', borderRadius: '8px', padding: '0.5rem 1rem 0.5rem 2.5rem', color: 'white', width: '300px', outline: 'none', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
                <div className="loader" style={{ width: '40px', height: '40px', borderColor: 'rgba(251,191,36,0.2)', borderTopColor: '#fbbf24' }}></div>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem', background: '#1e293b', borderRadius: '16px', border: '1px dashed #334155' }}>
                <Code2 size={64} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
                <h3>No submissions found</h3>
                <p style={{ color: '#64748b' }}>Try changing the filters or check back later.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {filteredSubmissions.map((sub) => (
                  <div key={sub.id} style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'transform 0.2s', cursor: 'pointer' }} onClick={() => setSelectedSubmission(sub)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ margin: 0, textTransform: 'capitalize', fontSize: '1.1rem' }}>{sub.problem_id.replace(/-/g, ' ')}</h3>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                          <span style={{ fontSize: '0.75rem', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>{sub.language}</span>
                          <span style={{ fontSize: '0.75rem', background: sub.status === 'pending' ? 'rgba(251,191,36,0.1)' : sub.status === 'verified' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: sub.status === 'pending' ? '#fbbf24' : sub.status === 'verified' ? '#4ade80' : '#f87171', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, textTransform: 'uppercase' }}>{sub.status}</span>
                        </div>
                      </div>
                      <Clock size={16} color="#64748b" />
                    </div>
                    <div style={{ borderTop: '1px solid #334155', paddingTop: '1rem' }}>
                      <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={14} /> Submitted by: <span style={{ color: '#f8fafc', fontWeight: 600 }}>{sub.profile?.full_name || sub.profile?.email || 'Anonymous'}</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>{new Date(sub.submitted_at).toLocaleString()}</p>
                    </div>
                    <button style={{ alignSelf: 'flex-start', background: 'transparent', border: '1px solid #334155', color: '#fbbf24', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      Review Code <ExternalLink size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {selectedSubmission && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ width: '100%', maxWidth: '1000px', height: '90vh', background: '#0f172a', borderRadius: '20px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div>
                  <h2 style={{ margin: 0, textTransform: 'capitalize' }}>Reviewing: {selectedSubmission.problem_id.replace(/-/g, ' ')}</h2>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>Developer: {selectedSubmission.profile?.full_name || selectedSubmission.profile?.email || 'Anonymous'}</p>
               </div>
               <button onClick={() => setSelectedSubmission(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><XCircle size={28} /></button>
            </div>
            
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
               <div style={{ flex: 2, borderRight: '1px solid #334155', overflowY: 'auto', background: '#020617', padding: '1.5rem' }}>
                  <pre style={{ margin: 0, fontFamily: 'Fira Code, monospace', fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.6 }}>
                    <code>{selectedSubmission.code}</code>
                  </pre>
               </div>
               <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MessageSquare size={18} color="#fbbf24" /> Admin Feedback</h4>
                    <textarea 
                      placeholder="Add suggestions or reasons for verification..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      style={{ width: '100%', height: '200px', background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1rem', color: 'white', resize: 'none', outline: 'none' }}
                    />
                  </div>
                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button 
                      onClick={() => handleReview(selectedSubmission.id, 'verified')}
                      style={{ background: '#22c55e', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                    >
                      <CheckCircle2 size={20} /> Verify & Approve
                    </button>
                    <button 
                      onClick={() => handleReview(selectedSubmission.id, 'rejected')}
                      style={{ background: '#ef4444', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                    >
                      <XCircle size={20} /> Reject Submission
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
