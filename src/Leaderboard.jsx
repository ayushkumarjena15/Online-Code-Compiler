import React, { useState, useEffect } from 'react';
import { Trophy, CalendarDays, ExternalLink, Activity, Medal, Star, Target } from 'lucide-react';
import axios from 'axios';

export default function Leaderboard({ user, supabase }) {
  const [activeTab, setActiveTab] = useState('rankings');
  const [contests, setContests] = useState([]);
  const [isLoadingContests, setIsLoadingContests] = useState(true);
  
  const [rankings, setRankings] = useState([]);
  const [isLoadingRankings, setIsLoadingRankings] = useState(true);

  useEffect(() => {
    fetchContests();
    fetchRankings();
  }, []);

  const fetchRankings = async () => {
    try {
      setIsLoadingRankings(true);
      // Fetch all progress and profiles to aggregate
      const { data, error } = await supabase
        .from('user_progress')
        .select(`
          user_id,
          problem_id,
          profile: profiles ( id, full_name, email, avatar_url )
        `);

      if (!error && data) {
        // Aggregate solved count per user with profile details
        const userMap = data.reduce((acc, curr) => {
          const userId = curr.user_id;
          if (!acc[userId]) {
            acc[userId] = {
              id: userId,
              solved: 0,
              profile: curr.profile
            };
          }
          acc[userId].solved += 1;
          return acc;
        }, {});

        // Convert to array, sort and finalize
        const finalized = Object.values(userMap)
          .map(u => ({
            ...u,
            points: u.solved * 100,
            badge: u.solved > 10 ? 'Master' : u.solved > 5 ? 'Expert' : u.solved > 2 ? 'Advanced' : 'Newbie',
            name: u.profile?.full_name || u.profile?.email?.split('@')[0] || `User_${u.id.substring(0, 5)}`
          }))
          .sort((a, b) => b.solved - a.solved)
          .map((u, i) => ({ ...u, rank: i + 1 }));
        
        setRankings(finalized);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingRankings(false);
    }
  };

  const fetchContests = async () => {
    try {
      setIsLoadingContests(true);
      // Added 10s timeout to prevent hanging on network issues
      const res = await axios.get('https://kontests.net/api/v1/all', { timeout: 10000 });
      // Sort by start time soonest
      const upcoming = res.data
         .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
         .filter(c => new Date(c.end_time) > new Date());
      setContests(upcoming);
    } catch (e) {
      console.error("Error fetching contests:", e);
      setContests([]); // Ensure empty state on error
    } finally {
      setIsLoadingContests(false);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-main)', padding: '2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Header Options */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--panel-border)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Trophy size={32} color="#f97316" />
            <div>
              <h2 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-main)' }}>Global Leaderboard</h2>
              <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-3)', fontSize: '0.9rem' }}>Compete with programmers worldwide and track upcoming contests.</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '8px', border: '1px solid var(--panel-border)' }}>
             <button
                onClick={() => setActiveTab('rankings')}
                style={{
                  background: activeTab === 'rankings' ? 'var(--panel-bg)' : 'transparent',
                  color: activeTab === 'rankings' ? 'var(--text-main)' : 'var(--text-3)',
                  border: 'none', padding: '0.5rem 1rem', borderRadius: '6px',
                  fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                  boxShadow: activeTab === 'rankings' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                }}
             >
                <Medal size={16} /> Rankings
             </button>
             <button
                onClick={() => setActiveTab('contests')}
                style={{
                  background: activeTab === 'contests' ? 'var(--panel-bg)' : 'transparent',
                  color: activeTab === 'contests' ? 'var(--text-main)' : 'var(--text-3)',
                  border: 'none', padding: '0.5rem 1rem', borderRadius: '6px',
                  fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                  boxShadow: activeTab === 'contests' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                }}
             >
                <CalendarDays size={16} /> Contests
             </button>
          </div>
        </div>

        {/* Content */}
         {activeTab === 'rankings' && (
            <div style={{ background: 'var(--panel-bg)', borderRadius: '12px', border: '1px solid var(--panel-border)', overflow: 'hidden' }}>
              {isLoadingRankings ? (
                <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '1rem' }}>
                   <span className="loader" style={{ width: 32, height: 32, borderTopColor: '#a855f7' }}></span>
                   <span style={{ color: 'var(--text-3)' }}>Calculating rankings...</span>
                </div>
              ) : rankings.length === 0 ? (
                <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-3)' }}>
                  <Trophy size={48} opacity={0.1} style={{ marginBottom: '1rem' }} />
                  No rankings found. Be the first to solve a problem!
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--text-2)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '1rem', borderBottom: '1px solid var(--panel-border)', width: '80px', textAlign: 'center' }}>Rank</th>
                      <th style={{ padding: '1rem', borderBottom: '1px solid var(--panel-border)' }}>Developer</th>
                      <th style={{ padding: '1rem', borderBottom: '1px solid var(--panel-border)' }}>Badge</th>
                      <th style={{ padding: '1rem', borderBottom: '1px solid var(--panel-border)' }}>Points</th>
                      <th style={{ padding: '1rem', borderBottom: '1px solid var(--panel-border)' }}>Solved</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.map((u, i) => (
                       <tr key={u.id} style={{ borderBottom: '1px solid var(--panel-border)', background: u.id === user?.id ? 'rgba(168,85,247,0.05)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                         <td style={{ padding: '1rem', textAlign: 'center', fontSize: '1.2rem', fontWeight: 700, color: i === 0 ? '#fbbf24' : i === 1 ? '#e2e8f0' : i === 2 ? '#b45309' : 'var(--text-2)' }}>
                           #{u.rank}
                         </td>
                         <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600, color: u.id === user?.id ? '#d8b4fe' : 'var(--text-main)' }}>
                           <div style={{ width: 32, height: 32, borderRadius: '50%', background: u.id === user?.id ? 'linear-gradient(135deg, #a855f7, #3b82f6)' : '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', border: u.id === user?.id ? '2px solid rgba(168,85,247,0.5)' : 'none' }}>
                             {u.name.charAt(0)}
                           </div>
                           {u.name} {u.id === user?.id && <span style={{ fontSize: '0.6rem', background: '#a855f7', color: 'white', padding: '1px 4px', borderRadius: '4px', marginLeft: '4px' }}>YOU</span>}
                         </td>
                         <td style={{ padding: '1rem' }}>
                            <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(168,85,247,0.1)', color: '#cf9df7', border: '1px solid rgba(168,85,247,0.3)' }}>
                               {u.badge}
                            </span>
                         </td>
                         <td style={{ padding: '1rem', fontWeight: 700, color: '#fbbf24' }}>{u.points.toLocaleString()}</td>
                         <td style={{ padding: '1rem', color: 'var(--text-2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                               <Target size={14} color="#22c55e" /> {u.solved}
                            </div>
                         </td>
                       </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
         )}

        {activeTab === 'contests' && (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {isLoadingContests ? (
               <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}>
                 <span className="loader" style={{ width: 24, height: 24, borderTopColor: '#a855f7' }}></span>
               </div>
             ) : contests.length > 0 ? (
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                 {contests.slice(0, 20).map((c, i) => (
                    <div key={i} style={{ background: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'transform 0.2s, box-shadow 0.2s' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(59,130,246,0.1)', color: '#93c5fd', fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(59,130,246,0.2)' }}>
                            {c.site}
                          </span>
                          {c.status === 'CODING' && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#22c55e', fontSize: '0.75rem', fontWeight: 700 }}>
                              <Activity size={12} /> LIVE NEXT
                            </span>
                          )}
                       </div>
                       
                       <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)', lineHeight: 1.3 }}>{c.name}</h3>
                       
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                            <span style={{ color: 'var(--text-3)' }}>Starts:</span>
                            <strong style={{ color: '#e2e8f0' }}>{formatDate(c.start_time)}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                            <span style={{ color: 'var(--text-3)' }}>Ends:</span>
                            <strong style={{ color: '#e2e8f0' }}>{formatDate(c.end_time)}</strong>
                          </div>
                       </div>
                       
                       <a href={c.url} target="_blank" rel="noreferrer" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem', background: 'var(--bg-main)', color: 'var(--text-2)', border: '1px solid var(--panel-border)', borderRadius: '6px', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s' }}>
                          View Contest <ExternalLink size={14} />
                       </a>
                    </div>
                 ))}
               </div>
             ) : (
               <p style={{ color: 'var(--text-3)' }}>No upcoming contests found at this time.</p>
             )}
           </div>
        )}

      </div>
    </div>
  );
}
