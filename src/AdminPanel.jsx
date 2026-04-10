import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, MessageSquare, Code2, ExternalLink, Clock, User, Filter, Search, LayoutDashboard, Shield, Users, Activity, RefreshCw, Calendar, Plus, Trash2, Target, Trophy, Terminal } from 'lucide-react';
import { DSA_PROBLEMS } from './problemData';

export default function AdminPanel({ user, supabase }) {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ users: 0, submissions: 0, verified: 0, languages: {}, topProblems: [] });
  const [contests, setContests] = useState([]);
  const [isCreatingContest, setIsCreatingContest] = useState(false);
  const [newContest, setNewContest] = useState({ title: '', description: '', start_time: '', end_time: '', problems: [] });
  const [isScheduling, setIsScheduling] = useState(false);

  useEffect(() => {
    fetchSubmissions();
    if (activeTab === 'dashboard') fetchStats();
    if (activeTab === 'contests') fetchContests();
  }, [filter, activeTab]);

  useEffect(() => {
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
      const problemCounts = {};
      
      allSub.forEach(s => {
        langCounts[s.language] = (langCounts[s.language] || 0) + 1;
        problemCounts[s.problem_id] = (problemCounts[s.problem_id] || 0) + 1;
      });

      // Sort problems by popularity (highest first)
      const sortedProblems = Object.entries(problemCounts)
        .map(([id, count]) => ({ id, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Top 5

      setStats({
        users: uniqueUsers,
        submissions: allSub.length,
        verified,
        languages: langCounts,
        topProblems: sortedProblems
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
          profile: profiles ( email, full_name ),
          contest: contests ( title )
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

  const fetchContests = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          contest_problems (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContests(data || []);
    } catch (err) {
      console.error('Error fetching contests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateContest = async () => {
    if (isScheduling) return;
    
    try {
      if (!newContest.title || !newContest.start_time || !newContest.end_time || newContest.problems.length === 0) {
        alert('Validation Error: Please provide a Title, set Start/End times, and select at least one Problem.');
        return;
      }

      setIsScheduling(true);

      // 1. Create Contest
      const { data: contestData, error: contestError } = await supabase
        .from('contests')
        .insert({
          title: newContest.title,
          description: newContest.description,
          start_time: new Date(newContest.start_time).toISOString(),
          end_time: new Date(newContest.end_time).toISOString(),
          created_by: user.id
        })
        .select()
        .single();

      if (contestError) throw contestError;

      // 2. Add Problems
      const problemInserts = newContest.problems.map(probId => ({
        contest_id: contestData.id,
        problem_id: probId.toString()
      }));

      const { error: probError } = await supabase
        .from('contest_problems')
        .insert(problemInserts);

      if (probError) throw probError;

      alert('Contest scheduled successfully!');
      setIsCreatingContest(false);
      setNewContest({ title: '', description: '', start_time: '', end_time: '', problems: [] });
      fetchContests();
    } catch (err) {
      console.error('Admin Contest Error:', err);
      alert('Error: ' + err.message);
    } finally {
      setIsScheduling(false);
    }
  };

  const handleDeleteContest = async (id) => {
    if (!confirm('Are you sure you want to delete this contest?')) return;
    try {
      const { error } = await supabase.from('contests').delete().eq('id', id);
      if (error) throw error;
      fetchContests();
    } catch (err) {
      alert('Error deleting contest: ' + err.message);
    }
  };

  const handleReview = async (id, status) => {
    try {
      const { error } = await supabase
        .from('code_submissions')
        .update({ status, admin_feedback: feedback, reviewed_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      setSelectedSubmission(null);
      setFeedback('');
      fetchSubmissions();
      fetchStats();
      alert(`Submission ${status} successfully!`);
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
            >
               <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /> Refresh
            </button>
            <div style={{ display: 'flex', background: '#1e293b', borderRadius: '12px', padding: '4px' }}>
              <button 
                onClick={() => setActiveTab('dashboard')}
                style={{ padding: '0.6rem 1.25rem', border: 'none', borderRadius: '8px', background: activeTab === 'dashboard' ? '#fbbf24' : 'transparent', color: activeTab === 'dashboard' ? '#000' : '#94a3b8', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                 <LayoutDashboard size={18} /> Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('reviews')}
                style={{ position: 'relative', padding: '0.6rem 1.25rem', border: 'none', borderRadius: '8px', background: activeTab === 'reviews' ? '#fbbf24' : 'transparent', color: activeTab === 'reviews' ? '#000' : '#94a3b8', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                 <Code2 size={18} /> Reviews
                 {submissions.filter(s => s.status === 'pending').length > 0 && (
                    <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: '#fff', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '10px', border: '2px solid #0f172a', fontWeight: 800 }}>
                      {submissions.filter(s => s.status === 'pending').length}
                    </span>
                 )}
              </button>
              <button 
                onClick={() => setActiveTab('contests')}
                style={{ padding: '0.6rem 1.25rem', border: 'none', borderRadius: '8px', background: activeTab === 'contests' ? '#fbbf24' : 'transparent', color: activeTab === 'contests' ? '#000' : '#94a3b8', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                 <Calendar size={18} /> Contests
              </button>
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
               <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Users size={24} color="#3b82f6" />
                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Total Users</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.users}</div>
                  </div>
               </div>
               <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Code2 size={24} color="#a855f7" />
                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Submissions</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.submissions}</div>
                  </div>
               </div>
               <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <CheckCircle2 size={24} color="#22c55e" />
                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Verified</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.verified}</div>
                  </div>
               </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
               {/* Language Distribution */}
               <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '1.75rem' }}>
                  <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f8fafc' }}><Terminal size={20} color="#fbbf24" /> Language Distribution</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                     {Object.entries(stats.languages || {}).map(([lang, count]) => {
                        const percent = (count / (stats.submissions || 1)) * 100;
                        return (
                          <div key={lang}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                <span style={{ textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8' }}>{lang}</span>
                                <span style={{ color: '#f8fafc' }}>{count} ({Math.round(percent)}%)</span>
                             </div>
                             <div style={{ height: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${percent}%`, background: `linear-gradient(90deg, #fbbf24, #f59e0b)`, borderRadius: '4px' }}></div>
                             </div>
                          </div>
                        );
                     })}
                     {(!stats.languages || Object.keys(stats.languages).length === 0) && <p style={{ color: '#64748b', textAlign: 'center' }}>No submission data yet.</p>}
                  </div>
               </div>

               {/* Top Problems */}
               <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '1.75rem' }}>
                  <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f8fafc' }}><Trophy size={20} color="#3b82f6" /> Trending Challenges</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                     {(stats.topProblems || []).map((prob, idx) => (
                        <div key={prob.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
                           <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: idx === 0 ? '#fbbf24' : '#334155', color: idx === 0 ? '#000' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                              {idx + 1}
                           </div>
                           <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prob.id}</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{prob.count} submissions</div>
                           </div>
                           <div style={{ color: '#22c55e', fontSize: '0.75rem', fontWeight: 700 }}>+{Math.floor(Math.random() * 20)}%</div>
                        </div>
                     ))}
                     {(!stats.topProblems || stats.topProblems.length === 0) && <p style={{ color: '#64748b', textAlign: 'center' }}>No challenge data yet.</p>}
                  </div>
               </div>
            </div>
          </div>
        ) : activeTab === 'contests' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar /> Scheduled Arenas</h2>
               <button 
                 onClick={() => setIsCreatingContest(!isCreatingContest)} 
                 style={{ background: '#fbbf24', color: '#000', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
               >
                 <Plus size={18} /> {isCreatingContest ? 'Close Setup' : 'Create New Contest'}
               </button>
            </div>

            {isCreatingContest && (
              <div style={{ background: '#1e293b', border: '1px solid #fbbf24', borderRadius: '20px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 0 40px rgba(251,191,36,0.1)' }}>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                       <label style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>Contest Title</label>
                       <input 
                         type="text" 
                         placeholder="e.g. Masterclass Round #1" 
                         value={newContest.title}
                         onChange={(e) => setNewContest({...newContest, title: e.target.value})}
                         style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #334155', borderRadius: '10px', padding: '0.75rem', color: 'white', outline: 'none' }}
                       />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                       <label style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>Assignment (Select Questions)</label>
                       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid #334155', borderRadius: '10px', padding: '0.75rem', maxHeight: '150px', overflowY: 'auto' }}>
                          {DSA_PROBLEMS.map(prob => (
                            <label key={prob.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '6px', borderRadius: '8px', cursor: 'pointer', border: '1px solid', borderColor: newContest.problems.includes(prob.id) ? '#fbbf24' : 'transparent', background: newContest.problems.includes(prob.id) ? 'rgba(251,191,36,0.1)' : 'transparent' }}>
                               <input 
                                 type="checkbox" 
                                 checked={newContest.problems.includes(prob.id)}
                                 onChange={(e) => {
                                   if (e.target.checked) setNewContest({...newContest, problems: [...newContest.problems, prob.id]});
                                   else setNewContest({...newContest, problems: newContest.problems.filter(id => id !== prob.id)});
                                 }}
                                 style={{ width: '16px', height: '16px', accentColor: '#fbbf24' }}
                                />
                                <span style={{ fontSize: '0.8rem' }}>{prob.title}</span>
                            </label>
                          ))}
                       </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                       <label style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>Start Time</label>
                       <input 
                         type="datetime-local" 
                         value={newContest.start_time}
                         onChange={(e) => setNewContest({...newContest, start_time: e.target.value})}
                         style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #334155', borderRadius: '10px', padding: '0.75rem', color: 'white', outline: 'none' }}
                       />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                       <label style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>End Time</label>
                       <input 
                         type="datetime-local" 
                         value={newContest.end_time}
                         onChange={(e) => setNewContest({...newContest, end_time: e.target.value})}
                         style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #334155', borderRadius: '10px', padding: '0.75rem', color: 'white', outline: 'none' }}
                       />
                    </div>
                 </div>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>Description</label>
                    <textarea 
                      placeholder="Contest details..."
                      value={newContest.description}
                      onChange={(e) => setNewContest({...newContest, description: e.target.value})}
                      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #334155', borderRadius: '10px', padding: '0.75rem', color: 'white', outline: 'none', height: '80px', resize: 'none' }}
                    />
                 </div>

                 <button 
                   onClick={handleCreateContest}
                   disabled={isScheduling}
                   style={{ background: isScheduling ? '#475569' : '#fbbf24', color: '#000', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 800, cursor: isScheduling ? 'not-allowed' : 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                 >
                   {isScheduling ? <><RefreshCw className="animate-spin" /> Scheduling...</> : 'Schedule Contest Now'}
                 </button>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
               {contests.map(c => (
                 <div key={c.id} style={{ background: '#1e293b', borderRadius: '20px', border: '1px solid #334155', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <h3 style={{ margin: 0, color: '#fbbf24' }}>{c.title}</h3>
                       <button onClick={() => handleDeleteContest(c.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      <div style={{ marginBottom: '4px' }}>Starts: {new Date(c.start_time).toLocaleString()}</div>
                      <div>Ends: {new Date(c.end_time).toLocaleString()}</div>
                    </div>
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: new Date() > new Date(c.end_time) ? '#64748b' : new Date() >= new Date(c.start_time) ? '#22c55e' : '#3b82f6' }}>
                       <Target size={14} />
                       {new Date() > new Date(c.end_time) ? 'COMPLETED' : new Date() >= new Date(c.start_time) ? 'LIVE NOW' : 'UPCOMING'}
                    </div>
                 </div>
               ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e293b', padding: '1rem', borderRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Filter size={18} color="#94a3b8" />
                  <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #334155', borderRadius: '8px', padding: '0.5rem', color: 'white' }}>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                    <option value="all">All</option>
                  </select>
                </div>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #334155', borderRadius: '8px', padding: '0.5rem 1rem 0.5rem 2.5rem', color: 'white', width: '250px' }} />
                </div>
             </div>

             <div style={{ display: 'grid', gap: '1rem' }}>
                {filteredSubmissions.map(s => (
                  <div key={s.id} onClick={() => setSelectedSubmission(s)} style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '12px' }}>
                          <Code2 color="#a855f7" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{s.problem_id}</div>
                          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{s.profile?.email} • {s.language}</div>
                        </div>
                     </div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {s.contest?.title && <span style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24', fontSize: '0.7rem', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(251,191,36,0.2)' }}>{s.contest.title}</span>}
                        <span style={{ fontSize: '0.8rem', padding: '4px 12px', borderRadius: '10px', background: s.status === 'verified' ? 'rgba(34,197,94,0.1)' : s.status === 'rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(251,191,36,0.1)', color: s.status === 'verified' ? '#22c55e' : s.status === 'rejected' ? '#ef4444' : '#fbbf24' }}>
                          {s.status.toUpperCase()}
                        </span>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {selectedSubmission && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', zIndex: 1000 }}>
           <div style={{ background: '#0f172a', width: '100%', maxWidth: '900px', maxHeight: '90vh', borderRadius: '24px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <h3 style={{ margin: 0 }}>Review Submission: {selectedSubmission.problem_id}</h3>
                 <button onClick={() => setSelectedSubmission(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><XCircle size={24} /></button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                 <pre style={{ background: '#000', padding: '1.5rem', borderRadius: '12px', color: '#10b981', fontSize: '0.9rem', overflowX: 'auto', border: '1px solid #1e293b' }}>{selectedSubmission.code}</pre>
                 <div style={{ marginTop: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>Admin Feedback (Optional)</label>
                    <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff', padding: '1rem', minHeight: '100px', outline: 'none' }} placeholder="Write feedback for the developer..." />
                 </div>
              </div>
              <div style={{ padding: '1.5rem', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                 <button onClick={() => handleReview(selectedSubmission.id, 'rejected')} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid #ef4444', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>Reject Submission</button>
                 <button onClick={() => handleReview(selectedSubmission.id, 'verified')} style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>Verify & Award Points</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
