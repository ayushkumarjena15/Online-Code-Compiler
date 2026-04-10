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
    fetchInternalContests();
    fetchRankings();
  }, []);

  const [internalContests, setInternalContests] = useState([]);
  const [userJoinedContests, setUserJoinedContests] = useState([]);

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

  const fetchInternalContests = async () => {
    try {
      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          contest_problems (*),
          contest_participants (*)
        `)
        .order('start_time', { ascending: true });

      if (error) throw error;
      setInternalContests(data || []);
      
      if (user) {
        const joined = data.filter(c => 
          c.contest_participants.some(p => p.user_id === user.id)
        ).map(c => c.id);
        setUserJoinedContests(joined);
      }
    } catch (e) {
      console.error("Error fetching internal contests:", e);
    }
  };

  const handleJoinContest = async (contestId) => {
    if (!user) {
      alert("Please login to join the contest.");
      return;
    }
    try {
      const { error } = await supabase
        .from('contest_participants')
        .insert({
          contest_id: contestId,
          user_id: user.id
        });

      if (error) throw error;
      alert("Joined contest successfully!");
      fetchInternalContests();
    } catch (e) {
      alert("Error joining contest: " + e.message);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'transparent', padding: '2.5rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* Header Options */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--panel-border)', paddingBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ 
              padding: '16px', borderRadius: '20px', background: 'rgba(251, 191, 36, 0.1)', 
              border: '1px solid rgba(251, 191, 36, 0.2)', boxShadow: '0 0 30px rgba(251, 191, 36, 0.1)'
            }}>
               <Trophy size={40} color="#fbbf24" style={{ filter: 'drop-shadow(0 0 8px rgba(251,191,36,0.4))' }} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '2.4rem', color: '#fff', fontWeight: 800, letterSpacing: '-1.5px' }}>Top <span style={{ color: '#fbbf24' }}>Developers</span></h1>
              <p style={{ margin: '0.4rem 0 0 0', color: 'var(--text-2)', fontSize: '1rem', fontWeight: 500, opacity: 0.8 }}>Benchmark your skills against the global elite.</p>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '16px', 
            border: '1px solid var(--panel-border)', backdropFilter: 'blur(10px)'
          }}>
             <button
                onClick={() => setActiveTab('rankings')}
                style={{
                  background: activeTab === 'rankings' ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: activeTab === 'rankings' ? '#fff' : 'var(--text-3)',
                  border: 'none', padding: '0.6rem 1.25rem', borderRadius: '12px',
                  fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.65rem',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: activeTab === 'rankings' ? '0 4px 15px rgba(0,0,0,0.3)' : 'none'
                }}
             >
                <Medal size={18} /> Hall of Fame
             </button>
             <button
                onClick={() => setActiveTab('contests')}
                style={{
                  background: activeTab === 'contests' ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: activeTab === 'contests' ? '#fff' : 'var(--text-3)',
                  border: 'none', padding: '0.6rem 1.25rem', borderRadius: '12px',
                  fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.65rem',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: activeTab === 'contests' ? '0 4px 15px rgba(0,0,0,0.3)' : 'none'
                }}
             >
                <CalendarDays size={18} /> Live Contests
             </button>
          </div>
        </div>

        {/* Content */}
         {activeTab === 'rankings' && (
            <div style={{ 
              background: 'rgba(15, 23, 42, 0.4)', borderRadius: '24px', 
              border: '1px solid var(--panel-border)', overflow: 'hidden',
              backdropFilter: 'blur(20px)', boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
            }}>
              {isLoadingRankings ? (
                <div style={{ padding: '6rem', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '1.5rem' }}>
                   <div className="loader" style={{ width: 48, height: 48, borderTopColor: '#fbbf24', borderLeftWidth: '3px' }}></div>
                   <span style={{ color: 'var(--text-2)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Compiling Global Data...</span>
                </div>
              ) : rankings.length === 0 ? (
                <div style={{ padding: '6rem', textAlign: 'center', color: 'var(--text-3)' }}>
                  <Trophy size={64} opacity={0.05} style={{ marginBottom: '1.5rem' }} />
                  <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>The podium is currently empty. Be the first to claim it!</p>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'rgba(0,0,0,0.4)', color: 'var(--text-3)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                      <th style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--panel-border)', width: '100px', textAlign: 'center' }}>Rank</th>
                      <th style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--panel-border)' }}>Developer</th>
                      <th style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--panel-border)' }}>Badge</th>
                      <th style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--panel-border)' }}>Points</th>
                      <th style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--panel-border)' }}>Achievements</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.map((u, i) => (
                       <tr key={u.id} className="rank-row" style={{ 
                         borderBottom: '1px solid var(--panel-border)', 
                         background: u.id === user?.id ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                         transition: 'background 0.3s ease'
                       }}>
                         <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                           <div style={{ 
                             display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px',
                             borderRadius: '12px', fontWeight: 800, fontSize: '1.1rem',
                             background: i === 0 ? 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)' : 
                                         i === 1 ? 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)' :
                                         i === 2 ? 'linear-gradient(135deg, #b45309 0%, #78350f 100%)' : 'rgba(255,255,255,0.05)',
                             color: i < 3 ? '#000' : 'var(--text-2)',
                             boxShadow: i < 3 ? '0 4px 12px rgba(0,0,0,0.2)' : 'none'
                           }}>
                             {u.rank}
                           </div>
                         </td>
                         <td style={{ padding: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <div style={{ 
                                width: 44, height: 44, borderRadius: '14px', 
                                background: u.id === user?.id ? 'linear-gradient(135deg, #a855f7, #3b82f6)' : '#1e293b', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                color: '#fff', fontSize: '1.1rem', fontWeight: 700,
                                border: u.id === user?.id ? '2px solid rgba(168,85,247,0.5)' : '1px solid rgba(255,255,255,0.05)',
                                overflow: 'hidden'
                              }}>
                                {u.profile?.avatar_url ? (
                                  <img src={u.profile.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  u.name.charAt(0)
                                )}
                              </div>
                              <div>
                                <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  {u.name}
                                  {u.id === user?.id && <span style={{ fontSize: '0.65rem', background: '#3b82f6', color: '#fff', padding: '2px 8px', borderRadius: '6px', letterSpacing: '0.5px', fontWeight: 800 }}>YOU</span>}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginTop: '2px' }}>Member since 2026</div>
                              </div>
                            </div>
                         </td>
                         <td style={{ padding: '1.25rem' }}>
                            <span style={{ 
                              padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, 
                              background: 'rgba(59, 130, 246, 0.12)', color: '#60a5fa', 
                              border: '1px solid rgba(59, 130, 246, 0.25)', letterSpacing: '0.5px', textTransform: 'uppercase'
                            }}>
                               {u.badge}
                            </span>
                         </td>
                         <td style={{ padding: '1.25rem', fontWeight: 800, color: '#fbbf24', fontSize: '1.1rem' }}>{u.points.toLocaleString()}</td>
                         <td style={{ padding: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#10b981', fontWeight: 700 }}>
                               <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)' }}>
                                  <Target size={16} />
                               </div>
                               {u.solved} Problems Solved
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
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
             
             {/* Internal Contests Section */}
             {internalContests.length > 0 && (
               <div>
                  <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Medal color="#fbbf24" /> Platform Special Contests
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.75rem' }}>
                    {internalContests.map((c) => {
                      const isUpcoming = new Date() < new Date(c.start_time);
                      const isActive = new Date() >= new Date(c.start_time) && new Date() <= new Date(c.end_time);
                      const hasJoined = userJoinedContests.includes(c.id);
                      
                      return (
                        <div key={c.id} className="contest-card" style={{ 
                          background: 'rgba(15, 23, 42, 0.4)', border: '1px solid var(--panel-border)', 
                          borderRadius: '24px', padding: '1.75rem', display: 'flex', flexDirection: 'column', 
                          gap: '1.25rem', backdropFilter: 'blur(20px)', transition: 'all 0.4s'
                        }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ 
                                padding: '6px 14px', borderRadius: '10px', background: 'rgba(251, 191, 36, 0.1)', 
                                color: '#fbbf24', fontSize: '0.8rem', fontWeight: 700, border: '1px solid rgba(251, 191, 36, 0.3)',
                                letterSpacing: '0.5px'
                              }}>
                                Official Contest
                              </span>
                              {isActive && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(34, 197, 94, 0.1)', padding: '6px 12px', borderRadius: '10px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }}></div>
                                  <span style={{ color: '#22c55e', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Live Now</span>
                                </div>
                              )}
                           </div>
                           
                           <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#fff', fontWeight: 800 }}>{c.title}</h3>
                           <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-3)', lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>{c.description}</p>
                           
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.02)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--text-3)' }}>Starts</span>
                                <strong style={{ color: '#fff' }}>{formatDate(c.start_time)}</strong>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--text-3)' }}>Problems</span>
                                <strong style={{ color: '#fbbf24' }}>{c.contest_problems?.length || 0} Sets</strong>
                              </div>
                           </div>
                           
                           {!hasJoined ? (
                              <button 
                                onClick={() => handleJoinContest(c.id)}
                                style={{ 
                                  marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                  gap: '0.75rem', padding: '1rem', background: '#fbbf24', color: '#000', 
                                  borderRadius: '16px', border: 'none', fontWeight: 800, 
                                  fontSize: '0.95rem', transition: 'all 0.3s', cursor: 'pointer'
                                }}
                              >
                                Join Contest <Medal size={18} />
                              </button>
                           ) : (
                              <button 
                                disabled={!isActive}
                                onClick={() => {
                                  if (isActive) {
                                    window.dispatchEvent(new CustomEvent('switch-tab', { 
                                      detail: { tab: 'problems', contest: c } 
                                    }));
                                  }
                                }}
                                style={{ 
                                  marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                  gap: '0.75rem', padding: '1rem', background: isActive ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.05)', 
                                  color: isActive ? '#fff' : '#4b5563', 
                                  borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 800, 
                                  fontSize: '0.95rem', cursor: isActive ? 'pointer' : 'not-allowed'
                                }}
                              >
                                {isActive ? "Enter Arena" : "Joined & Waiting"} {isActive ? <Target size={18} /> : <Clock size={18} />}
                              </button>
                           )}
                        </div>
                      );
                    })}
                  </div>
               </div>
             )}

             <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: '0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
               <ExternalLink color="#3b82f6" /> Global Ecosystem Events
             </h2>

             {isLoadingContests ? (
               <div style={{ padding: '6rem', display: 'flex', justifyContent: 'center' }}>
                 <div className="loader" style={{ width: 40, height: 40, borderTopColor: '#3b82f6' }}></div>
               </div>
             ) : contests.length > 0 ? (
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.75rem' }}>
                 {contests.slice(0, 20).map((c, i) => (
                    <div key={i} className="contest-card" style={{ 
                      background: 'rgba(15, 23, 42, 0.4)', border: '1px solid var(--panel-border)', 
                      borderRadius: '24px', padding: '1.75rem', display: 'flex', flexDirection: 'column', 
                      gap: '1.25rem', backdropFilter: 'blur(20px)', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ 
                            padding: '6px 14px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', 
                            color: '#93c5fd', fontSize: '0.8rem', fontWeight: 700, border: '1px solid rgba(59, 130, 246, 0.3)',
                            letterSpacing: '0.5px'
                          }}>
                            {c.site}
                          </span>
                          {c.status === 'CODING' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(34, 197, 94, 0.1)', padding: '6px 12px', borderRadius: '10px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }}></div>
                              <span style={{ color: '#22c55e', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live Now</span>
                            </div>
                          )}
                       </div>
                       
                       <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#fff', fontWeight: 700, lineHeight: 1.4 }}>{c.name}</h3>
                       
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.02)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--text-3)', fontWeight: 500 }}>Global Start</span>
                            <strong style={{ color: '#f1f5f9' }}>{formatDate(c.start_time)}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--text-3)', fontWeight: 500 }}>Duration</span>
                            <strong style={{ color: '#f1f5f9' }}>48 Hours</strong>
                          </div>
                       </div>
                       
                       <a 
                         href={c.url} 
                         target="_blank" 
                         rel="noreferrer" 
                         style={{ 
                           marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                           gap: '0.75rem', padding: '1rem', background: '#3b82f6', color: '#fff', 
                           borderRadius: '16px', textDecoration: 'none', fontWeight: 700, 
                           fontSize: '0.95rem', transition: 'all 0.3s', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.2)'
                         }}
                         className="contest-link"
                       >
                          Register Now <ExternalLink size={18} />
                       </a>
                    </div>
                 ))}
               </div>
             ) : (
               <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-3)' }}>
                 <p style={{ fontSize: '1.2rem' }}>No upcoming battles detected on the radar.</p>
               </div>
             )}
           </div>
        )}

      </div>
      <style>{`
        .rank-row:hover { background: rgba(255,255,255,0.04) !important; }
        .contest-card:hover { transform: translateY(-8px); border-color: rgba(59, 130, 246, 0.5); box-shadow: 0 15px 40px rgba(0,0,0,0.4); }
        .contest-link:hover { background: #2563eb; transform: scale(1.02); }
      `}</style>
    </div>
  );
}
