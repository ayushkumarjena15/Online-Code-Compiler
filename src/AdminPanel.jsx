import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Code2, 
  ExternalLink, 
  Clock, 
  User, 
  Filter, 
  Search, 
  LayoutDashboard, 
  Shield, 
  Users, 
  Activity, 
  RefreshCw, 
  Calendar, 
  Plus, 
  Trash2, 
  Target, 
  Trophy, 
  Terminal,
  BarChart3,
  PieChart,
  TrendingUp,
  Cpu,
  Monitor
} from 'lucide-react';
import { 
  DSA_PROBLEMS, 
  SQL_PROBLEMS, 
  PYTHON_PROBLEMS, 
  JAVA_PROBLEMS, 
  JS_PROBLEMS 
} from './problemData';

export default function AdminPanel({ user, supabase }) {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ 
    users: 0, 
    submissions: 0, 
    verified: 0, 
    languages: {}, 
    topProblems: [],
    recentActivity: [] 
  });
  const [contests, setContests] = useState([]);
  const [isCreatingContest, setIsCreatingContest] = useState(false);
  const [newContest, setNewContest] = useState({ title: '', description: '', start_time: '', end_time: '', problems: [], category: 'dsa' });
  const [isScheduling, setIsScheduling] = useState(false);

  const allAvailableProblems = [...DSA_PROBLEMS, ...SQL_PROBLEMS, ...PYTHON_PROBLEMS, ...JAVA_PROBLEMS, ...JS_PROBLEMS];

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

      const { data: allUsers, error: userErr } = await supabase.from('profiles').select('id');
      if (userErr) throw userErr;

      const verified = allSub.filter(s => s.status === 'verified').length;
      
      const langCounts = {};
      const problemCounts = {};
      
      allSub.forEach(s => {
        const lang = s.language || 'Unknown';
        langCounts[lang] = (langCounts[lang] || 0) + 1;
        
        const prob = allAvailableProblems.find(p => p.id.toString() === s.problem_id.toString());
        const title = prob ? prob.title : `Problem #${s.problem_id}`;
        problemCounts[title] = (problemCounts[title] || 0) + 1;
      });

      // Sort problems by popularity
      const sortedProblems = Object.entries(problemCounts)
        .map(([title, count]) => ({ title, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setStats({
        users: allUsers.length,
        submissions: allSub.length,
        verified,
        languages: langCounts,
        topProblems: sortedProblems,
        recentActivity: allSub.slice(0, 10)
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
        .select('*')
        .order('submitted_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;

      const userIds = [...new Set((data || []).map(s => s.user_id))];
      let profileMap = {};
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .in('id', userIds);
        (profiles || []).forEach(p => { profileMap[p.id] = p; });
      }

      const enriched = (data || []).map(s => {
        const prob = allAvailableProblems.find(p => p.id.toString() === s.problem_id.toString());
        return {
          ...s,
          problemTitle: prob ? prob.title : `Problem #${s.problem_id}`,
          profile: profileMap[s.user_id] || { email: 'Unknown', full_name: '' }
        };
      });

      setSubmissions(enriched);
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
        .select('*')
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
        alert('Missing required fields.');
        return;
      }

      setIsScheduling(true);

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

      const problemInserts = newContest.problems.map(probId => ({
        contest_id: contestData.id,
        problem_id: probId.toString()
      }));

      const { error: probError } = await supabase
        .from('contest_problems')
        .insert(problemInserts);

      if (probError) throw probError;

      alert('Contest created!');
      setIsCreatingContest(false);
      setNewContest({ title: '', description: '', start_time: '', end_time: '', problems: [], category: 'dsa' });
      fetchContests();
    } catch (err) {
      console.error('Contest Error:', err);
      alert('Error: ' + err.message);
    } finally {
      setIsScheduling(false);
    }
  };

  const handleDeleteContest = async (id) => {
    if (!confirm('Delete this contest?')) return;
    try {
      const { error } = await supabase.from('contests').delete().eq('id', id);
      if (error) throw error;
      fetchContests();
    } catch (err) {
      alert('Error: ' + err.message);
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
    } catch (err) {
      alert('Review Failed: ' + err.message);
    }
  };

  const getProblemsByCategory = (cat) => {
    switch(cat) {
      case 'dsa': return DSA_PROBLEMS;
      case 'sql': return SQL_PROBLEMS;
      case 'python': return PYTHON_PROBLEMS;
      case 'java': return JAVA_PROBLEMS;
      case 'javascript': return JS_PROBLEMS;
      default: return DSA_PROBLEMS;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0f172a', color: '#f8fafc', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{ width: '280px', background: '#1e293b', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', padding: '0.5rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', padding: '0.75rem', borderRadius: '16px', boxShadow: '0 8px 16px rgba(245, 158, 11, 0.2)' }}>
            <Shield color="#000" size={24} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Admin OS</h1>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
            { id: 'submissions', label: 'Code Reviews', icon: Terminal },
            { id: 'contests', label: 'Contest Engine', icon: Trophy },
            { id: 'users', label: 'System Users', icon: Users }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem 1.25rem',
                borderRadius: '16px',
                border: 'none',
                background: activeTab === item.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                color: activeTab === item.id ? '#fbbf24' : '#94a3b8',
                cursor: 'pointer',
                fontWeight: 700,
                transition: 'all 0.3s',
                textAlign: 'left'
              }}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Activity size={16} color="#22c55e" />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#22c55e' }}>System Online</span>
           </div>
           <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Version 2.4.0 High-Performance Hub</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '2.5rem', position: 'relative' }}>
        {activeTab === 'dashboard' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <header>
               <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, letterSpacing: '-0.03em' }}>System Analytics</h1>
               <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginTop: '0.5rem' }}>Real-time performance metrics and user engagement insights.</p>
            </header>

            {/* Top Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
               {[
                 { label: 'Total Enrolled', value: stats.users, icon: Users, color: '#3b82f6', trend: '+12%' },
                 { label: 'Submissions', value: stats.submissions, icon: Code2, color: '#fbbf24', trend: '+24%' },
                 { label: 'Verification Rate', value: `${stats.submissions ? Math.round((stats.verified / stats.submissions) * 100) : 0}%`, icon: CheckCircle2, color: '#22c55e', trend: '+5%' },
                 { label: 'Active Contests', value: contests.length, icon: Trophy, color: '#ef4444', trend: 'Live' }
               ].map((card, i) => (
                 <div key={i} style={{ background: '#1e293b', padding: '2rem', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                       <div style={{ background: `${card.color}15`, padding: '0.75rem', borderRadius: '14px' }}>
                          <card.icon color={card.color} size={28} />
                       </div>
                       <span style={{ color: card.trend === 'Live' ? '#ef4444' : '#22c55e', fontSize: '0.85rem', fontWeight: 800 }}>{card.trend}</span>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>{card.value}</div>
                    <div style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: 600 }}>{card.label}</div>
                 </div>
               ))}
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
               {/* Language Breakdown */}
               <div style={{ background: '#1e293b', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                     <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem' }}><PieChart color="#fbbf24" /> Language Distribution</h3>
                     <button style={{ background: 'transparent', border: 'none', color: '#fbbf24', cursor: 'pointer', fontWeight: 700 }}>Export CSV</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                     {Object.entries(stats.languages).map(([lang, count]) => {
                        const percent = (count / stats.submissions) * 100;
                        return (
                          <div key={lang}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                                <span style={{ fontWeight: 800, color: '#f8fafc' }}>{lang.toUpperCase()}</span>
                                <span style={{ color: '#94a3b8' }}>{count} items • {Math.round(percent)}%</span>
                             </div>
                             <div style={{ height: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${percent}%`, background: 'linear-gradient(90deg, #6366f1, #a855f7)', borderRadius: '6px', boxShadow: '0 0 10px rgba(99, 102, 241, 0.4)' }}></div>
                             </div>
                          </div>
                        );
                     })}
                  </div>
               </div>

               {/* Top Problems */}
               <div style={{ background: '#1e293b', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem' }}>
                  <h3 style={{ margin: '0 0 2rem 0', fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem' }}><TrendingUp color="#22c55e" /> Hottest Cases</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                     {stats.topProblems.map((prob, i) => (
                       <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: i === 0 ? '#fbbf24' : '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: i === 0 ? '#000' : '#fff' }}>{i + 1}</div>
                          <div style={{ flex: 1 }}>
                             <div style={{ fontWeight: 800, fontSize: '1rem' }}>{prob.title}</div>
                             <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{prob.count} submissions</div>
                          </div>
                          <BarChart3 size={20} color={i === 0 ? '#fbbf24' : '#334155'} />
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        ) : activeTab === 'submissions' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div>
                  <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: 0 }}>Review Command</h1>
                  <p style={{ color: '#94a3b8', margin: '0.25rem 0 0 0' }}>Approve or reject developer submissions.</p>
               </div>
               <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ background: '#1e293b', padding: '0.5rem', borderRadius: '14px', border: '1px solid #334155', display: 'flex', gap: '0.5rem' }}>
                    {['pending', 'verified', 'rejected', 'all'].map(f => (
                      <button 
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                          padding: '0.6rem 1.25rem',
                          borderRadius: '10px',
                          border: 'none',
                          background: filter === f ? '#fbbf24' : 'transparent',
                          color: filter === f ? '#000' : '#94a3b8',
                          cursor: 'pointer',
                          fontWeight: 700,
                          textTransform: 'capitalize'
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
               </div>
            </header>

            <div style={{ background: '#1e293b', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                     <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <th style={{ padding: '1.5rem', color: '#64748b', fontWeight: 800 }}>DEVELOPER</th>
                        <th style={{ padding: '1.5rem', color: '#64748b', fontWeight: 800 }}>CHALLENGE</th>
                        <th style={{ padding: '1.5rem', color: '#64748b', fontWeight: 800 }}>LANGUAGE</th>
                        <th style={{ padding: '1.5rem', color: '#64748b', fontWeight: 800 }}>TIME</th>
                        <th style={{ padding: '1.5rem', color: '#64748b', fontWeight: 800 }}>ACTION</th>
                     </tr>
                  </thead>
                  <tbody>
                     {submissions.map(s => (
                       <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: '1.5rem' }}>
                             <div style={{ fontWeight: 700 }}>{s.profile?.full_name || 'Anonymous'}</div>
                             <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{s.profile?.email}</div>
                          </td>
                          <td style={{ padding: '1.5rem', fontWeight: 700 }}>{s.problemTitle}</td>
                          <td style={{ padding: '1.5rem' }}>
                             <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800 }}>{s.language.toUpperCase()}</span>
                          </td>
                          <td style={{ padding: '1.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>{new Date(s.submitted_at).toLocaleString()}</td>
                          <td style={{ padding: '1.5rem' }}>
                             <button onClick={() => setSelectedSubmission(s)} style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.2)', color: '#fbbf24', padding: '0.6rem 1.25rem', borderRadius: '12px', cursor: 'pointer', fontWeight: 700 }}>Inspect Code</button>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
               {submissions.length === 0 && <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>No entries matched your filter.</div>}
            </div>
          </div>
        ) : activeTab === 'contests' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div>
                  <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: 0 }}>Arena Scheduler</h1>
                  <p style={{ color: '#94a3b8', margin: '0.25rem 0 0 0' }}>Deploy time-limited coding competitions.</p>
               </div>
               <button 
                 onClick={() => setIsCreatingContest(true)}
                 style={{ background: '#fbbf24', border: 'none', color: '#000', padding: '0.85rem 1.75rem', borderRadius: '16px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
               >
                 <Plus size={20} /> Deploy Contest
               </button>
            </header>

            {isCreatingContest && (
               <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)' }}>
                  <div style={{ background: '#1e293b', width: '100%', maxWidth: '900px', borderRadius: '32px', border: '1px solid #334155', padding: '3rem', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                     <button onClick={() => setIsCreatingContest(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><XCircle size={32} /></button>
                     <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-0.02em' }}>Configure Competition</h2>
                     
                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                           <label style={{ fontSize: '0.95rem', fontWeight: 800, color: '#94a3b8' }}>ARENA TITLE</label>
                           <input 
                             type="text" 
                             value={newContest.title}
                             onChange={e => setNewContest({...newContest, title: e.target.value})}
                             placeholder="e.g. Summer Blitz 2024" 
                             style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #334155', borderRadius: '14px', padding: '1rem', color: '#fff', outline: 'none' }} 
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                           <label style={{ fontSize: '0.95rem', fontWeight: 800, color: '#94a3b8' }}>TRACK CATEGORY</label>
                           <select 
                             value={newContest.category}
                             onChange={e => setNewContest({...newContest, category: e.target.value, problems: []})}
                             style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #334155', borderRadius: '14px', padding: '1rem', color: '#fff', outline: 'none' }}
                           >
                              <option value="dsa">Advanced DSA</option>
                              <option value="sql">SQL Systems</option>
                              <option value="python">Python Core</option>
                              <option value="java">Java Backend</option>
                              <option value="javascript">Frontend / JS</option>
                           </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                           <label style={{ fontSize: '0.95rem', fontWeight: 800, color: '#94a3b8' }}>LAUNCH TIME</label>
                           <input type="datetime-local" value={newContest.start_time} onChange={e => setNewContest({...newContest, start_time: e.target.value})} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #334155', borderRadius: '14px', padding: '1rem', color: '#fff' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                           <label style={{ fontSize: '0.95rem', fontWeight: 800, color: '#94a3b8' }}>EXPIRY TIME</label>
                           <input type="datetime-local" value={newContest.end_time} onChange={e => setNewContest({...newContest, end_time: e.target.value})} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #334155', borderRadius: '14px', padding: '1rem', color: '#fff' }} />
                        </div>
                     </div>

                     <div style={{ marginBottom: '2rem' }}>
                        <label style={{ fontSize: '0.95rem', fontWeight: 800, color: '#94a3b8', display: 'block', marginBottom: '0.75rem' }}>ASSIGN CHALLENGES</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', maxHeight: '200px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '14px' }}>
                           {getProblemsByCategory(newContest.category).map(p => (
                             <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '12px', background: newContest.problems.includes(p.id) ? 'rgba(251,191,36,0.1)' : 'transparent', border: '1px solid', borderColor: newContest.problems.includes(p.id) ? '#fbbf24' : 'transparent', cursor: 'pointer' }}>
                                <input type="checkbox" checked={newContest.problems.includes(p.id)} onChange={e => e.target.checked ? setNewContest({...newContest, problems: [...newContest.problems, p.id]}) : setNewContest({...newContest, problems: newContest.problems.filter(id => id !== p.id)})} style={{ accentColor: '#fbbf24', transform: 'scale(1.2)' }} />
                                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{p.title}</span>
                             </label>
                           ))}
                        </div>
                     </div>

                     <button onClick={handleCreateContest} disabled={isScheduling} style={{ width: '100%', background: '#fbbf24', border: 'none', color: '#000', padding: '1.25rem', borderRadius: '18px', fontSize: '1.1rem', fontWeight: 900, cursor: 'pointer' }}>
                        {isScheduling ? 'PROVISIONING SYSTEM...' : 'FINALIZE & DEPLOY'}
                     </button>
                  </div>
               </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
               {contests.map(c => (
                 <div key={c.id} style={{ background: '#1e293b', padding: '2rem', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                       <div style={{ background: 'rgba(251,191,36,0.1)', padding: '0.75rem', borderRadius: '14px' }}><Trophy color="#fbbf24" size={24} /></div>
                       <button onClick={() => handleDeleteContest(c.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={20} /></button>
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 0.5rem 0' }}>{c.title}</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0 0 1.5rem 0', lineClamp: 2 }}>{c.description || 'No description provided.'}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(0,0,0,0.1)', padding: '1.25rem', borderRadius: '18px' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}><span style={{ color: '#64748b' }}>STARTS</span><span style={{ fontWeight: 800 }}>{new Date(c.start_time).toLocaleString()}</span></div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}><span style={{ color: '#64748b' }}>ENDS</span><span style={{ fontWeight: 800 }}>{new Date(c.end_time).toLocaleString()}</span></div>
                    </div>
                    <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                       <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: new Date() > new Date(c.end_time) ? '#64748b' : new Date() >= new Date(c.start_time) ? '#22c55e' : '#3b82f6' }}></div>
                       <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: new Date() > new Date(c.end_time) ? '#64748b' : new Date() >= new Date(c.start_time) ? '#22c55e' : '#3b82f6' }}>
                         {new Date() > new Date(c.end_time) ? 'CONCLUDED' : new Date() >= new Date(c.start_time) ? 'LIVE NOW' : 'SCHEDULED'}
                       </span>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        ) : (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
             <Users size={64} color="#334155" style={{ marginBottom: '1.5rem' }} />
             <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>User Management</h2>
             <p style={{ color: '#94a3b8' }}>User directory and deep-dive analytics coming in v3.0.</p>
          </div>
        )}
      </div>

      {/* Submission Review Modal */}
      {selectedSubmission && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(12px)', padding: '2rem' }}>
           <div style={{ background: '#1e293b', width: '100%', maxWidth: '1200px', height: '90vh', borderRadius: '32px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
              <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ background: '#fbbf24', color: '#000', padding: '0.75rem', borderRadius: '16px' }}><Code2 size={24} /></div>
                    <div>
                       <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>Submission Analysis</h2>
                       <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                          <span>{selectedSubmission.profile?.full_name}</span>
                          <span>•</span>
                          <span style={{ color: '#fbbf24', fontWeight: 800 }}>{selectedSubmission.problemTitle}</span>
                       </div>
                    </div>
                 </div>
                 <button onClick={() => setSelectedSubmission(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><XCircle size={32} /></button>
              </div>

              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.5fr 1fr', overflow: 'hidden' }}>
                 {/* Code View */}
                 <div style={{ padding: '2rem', background: '#0a0f1d', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                       <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b' }}>SOURCE CODE ({selectedSubmission.language.toUpperCase()})</span>
                       <button onClick={() => { navigator.clipboard.writeText(selectedSubmission.code); alert('Copied!'); }} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer' }}>Copy Code</button>
                    </div>
                    <pre style={{ margin: 0, padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)', color: '#e2e8f0', fontSize: '0.95rem', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.6 }}>
                       {selectedSubmission.code}
                    </pre>
                 </div>

                 {/* Review Controls */}
                 <div style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.01)', borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div>
                       <label style={{ fontSize: '0.95rem', fontWeight: 800, color: '#94a3b8', display: 'block', marginBottom: '1rem' }}>ADMIN FEEDBACK</label>
                       <textarea 
                         value={feedback}
                         onChange={e => setFeedback(e.target.value)}
                         placeholder="Provide technical insights or reason for rejection..." 
                         style={{ width: '100%', height: '200px', background: 'rgba(0,0,0,0.2)', border: '1px solid #334155', borderRadius: '20px', padding: '1.5rem', color: '#fff', outline: 'none', resize: 'none', fontSize: '1rem' }}
                       />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: 'auto' }}>
                       <button 
                         onClick={() => handleReview(selectedSubmission.id, 'verified')}
                         style={{ background: '#22c55e', border: 'none', color: '#fff', padding: '1.25rem', borderRadius: '20px', fontSize: '1.1rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', boxShadow: '0 10px 20px -5px rgba(34, 197, 94, 0.3)' }}
                       >
                         <CheckCircle2 size={24} /> VERIFY SUBMISSION
                       </button>
                       <button 
                         onClick={() => handleReview(selectedSubmission.id, 'rejected')}
                         style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '1.25rem', borderRadius: '20px', fontSize: '1.1rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                       >
                         <XCircle size={24} /> REJECT WORK
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
