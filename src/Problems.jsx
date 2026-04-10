import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Database, 
  Play, 
  Search, 
  CheckCircle2, 
  Lock, 
  ChevronRight, 
  Award, 
  ExternalLink,
  Zap,
  Star
} from 'lucide-react';
import { 
  DSA_PROBLEMS, 
  SQL_PROBLEMS, 
  PYTHON_PROBLEMS, 
  JAVA_PROBLEMS, 
  JS_PROBLEMS 
} from './problemData';
import CertificateModal from './CertificateModal';

const Problems = ({ user, solvedProblems, onSelectProblem, contest, onClearContest }) => {
  const [activeTab, setActiveTab] = useState('dsa');
  const [search, setSearch] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);
  const [certData, setCertData] = useState(null);

  const getActiveProblems = () => {
    switch (activeTab) {
      case 'dsa': return DSA_PROBLEMS;
      case 'sql': return SQL_PROBLEMS;
      case 'python': return PYTHON_PROBLEMS;
      case 'java': return JAVA_PROBLEMS;
      case 'javascript': return JS_PROBLEMS;
      default: return DSA_PROBLEMS;
    }
  };

  const activeProblems = getActiveProblems();

  const getCategoryStats = () => {
    const solvedInCat = activeProblems.filter(p => !!solvedProblems[p.id]).length;
    return {
      solvedCount: solvedInCat,
      target: activeProblems.length,
      progressPct: (solvedInCat / activeProblems.length) * 100
    };
  };

  const stats = getCategoryStats();

  const handleSolve = (prob) => {
    onSelectProblem(prob, activeTab);
  };

  const handleViewCert = () => {
    const titles = {
      dsa: 'DSA Master Certified',
      sql: 'SQL Database Specialist',
      python: 'Python Core Developer',
      java: 'Java Systems Associate',
      javascript: 'JS Fullstack Architect'
    };
    setCertData({ 
      lang: activeTab === 'javascript' ? 'JavaScript' : activeTab.toUpperCase(), 
      title: titles[activeTab] 
    });
    setShowCertificate(true);
  };

  const getDifficultyColor = (diff) => {
    if (diff === '1 Star') return '#22c55e';
    if (diff === '2 Stars') return '#84cc16';
    if (diff === '3 Stars') return '#fbbf24';
    if (diff === '4 Stars') return '#f97316';
    if (diff === '5 Stars') return '#ef4444';
    return '#3b82f6';
  };

  const groupedByDifficulty = activeProblems.reduce((acc, prob) => {
    const diff = prob.difficulty || '1 Star';
    if (!acc[diff]) acc[diff] = [];
    acc[diff].push(prob);
    return acc;
  }, {});

  const difficultyOrder = ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'];

  return (
    <div style={{ padding: '2rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2.5rem', background: '#0f172a', color: '#f8fafc' }}>
      {showCertificate && (
        <CertificateModal
          user={user}
          certData={certData}
          onClose={() => setShowCertificate(false)}
        />
      )}

      {/* Hero Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
             <span style={{ background: 'linear-gradient(45deg, #a855f7, #6366f1)', padding: '0.4rem 0.8rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Journey</span>
             <div style={{ height: '2px', width: '40px', background: 'rgba(255,255,255,0.1)' }}></div>
          </div>
          <h1 style={{ margin: 0, fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Problem Arena
          </h1>
          <p style={{ color: '#94a3b8', margin: '0.5rem 0 0 0', fontSize: '1.1rem', maxWidth: '500px' }}>
            Master the art of coding step-by-step. Complete initial stars to unlock advanced challenges.
          </p>
        </div>

        {!contest && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(20px)', padding: '1.75rem', borderRadius: '28px', minWidth: '320px', boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.95rem' }}>Path Progress</span>
              <div style={{ padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', fontWeight: 800 }}>
                 {stats.solvedCount} / {stats.target}
              </div>
            </div>
            <div style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <div style={{ height: '100%', width: `${stats.progressPct}%`, background: stats.progressPct === 100 ? 'linear-gradient(90deg, #fbbf24, #f59e0b)' : 'linear-gradient(90deg, #3b82f6, #8b5cf6)', transition: 'width 2s ease-out' }}></div>
            </div>
            {stats.progressPct === 100 ? (
              <button 
                onClick={handleViewCert}
                style={{ width: '100%', background: 'linear-gradient(135deg, #fbbf24, #d97706)', border: 'none', color: '#000', padding: '0.85rem', borderRadius: '16px', fontSize: '0.95rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.3s' }}
              >
                <Trophy size={20} /> Claim Certicate
              </button>
            ) : (
              <div style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center', fontWeight: 600 }}>
                Solve {stats.target - stats.solvedCount} more to unlock your Certificate
              </div>
            )}
          </div>
        )}
      </div>

      {contest && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(251,191,36,0.1)', border: '1px solid #fbbf24', borderRadius: '20px', padding: '1.5rem 2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(251,191,36,0.2)', borderRadius: '50%' }}>
              <Trophy color="#fbbf24" size={32} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#fbbf24', fontWeight: 800 }}>Ongoing Contest: {contest.title}</h2>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.95rem', color: '#94a3b8' }}>Rank high to earn exclusive badges!</p>
            </div>
          </div>
          <button 
            onClick={onClearContest}
            style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24', padding: '0.75rem 1.5rem', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' }}
          >
            Exit Contest
          </button>
        </div>
      )}

      {/* Navigation & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        {!contest && (
          <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
            {[
              { id: 'dsa', label: 'DSA', icon: Award },
              { id: 'sql', label: 'SQL', icon: Database },
              { id: 'python', label: 'Python', icon: Zap },
              { id: 'java', label: 'Java', icon: Play },
              { id: 'javascript', label: 'JS', icon: Play }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                  border: 'none',
                  color: activeTab === tab.id ? '#c084fc' : '#64748b',
                  padding: '0.75rem 1.75rem',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  transition: 'all 0.3s',
                  border: activeTab === tab.id ? '1px solid rgba(168, 85, 247, 0.2)' : '1px solid transparent'
                }}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
          <Search style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={20} />
          <input
            type="text"
            placeholder="Find a challenge..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem 1.5rem 1rem 3.5rem', borderRadius: '18px', color: '#fff', outline: 'none', fontSize: '1rem', transition: 'all 0.3s' }}
            onFocus={e => e.target.style.borderColor = '#a855f7'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
          />
        </div>
      </div>

      {/* Grouped Problems List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
        {difficultyOrder.map(diff => {
          const problemsInGroup = groupedByDifficulty[diff]?.filter(p => 
            p.title.toLowerCase().includes(search.toLowerCase()) || 
            p.topic.toLowerCase().includes(search.toLowerCase())
          );
          if (!problemsInGroup || problemsInGroup.length === 0) return null;

          return (
            <div key={diff} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(255,255,255,0.03)', padding: '0.6rem 1.25rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Star size={20} style={{ color: getDifficultyColor(diff), fill: getDifficultyColor(diff) }} />
                    <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{diff} Tier</h2>
                  </div>
                  <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)' }}></div>
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.75rem' }}>
                 {problemsInGroup.map(prob => {
                    const problemIndexInActive = activeProblems.findIndex(p => p.id === prob.id);
                    const isSolved = !!solvedProblems[prob.id];
                    const isUnlocked = user?.role === 'admin' || contest || problemIndexInActive === 0 || !!solvedProblems[activeProblems[problemIndexInActive - 1].id];

                    return (
                      <div
                        key={prob.id}
                        onClick={() => isUnlocked && handleSolve(prob)}
                        style={{
                          background: isUnlocked ? 'rgba(255,255,255,0.02)' : 'rgba(15, 23, 42, 0.8)',
                          border: '1px solid',
                          borderColor: isSolved ? 'rgba(34,197,94,0.3)' : (isUnlocked ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)'),
                          borderRadius: '28px',
                          padding: '2rem',
                          cursor: isUnlocked ? 'pointer' : 'not-allowed',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          position: 'relative',
                          overflow: 'hidden',
                          opacity: isUnlocked ? 1 : 0.7,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1.5rem'
                        }}
                        onMouseEnter={e => {
                          if (!isUnlocked) return;
                          e.currentTarget.style.transform = 'translateY(-10px)';
                          e.currentTarget.style.borderColor = '#a855f7';
                          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                        }}
                        onMouseLeave={e => {
                          if (!isUnlocked) return;
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.borderColor = isSolved ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)';
                          e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                        }}
                      >
                        {!isUnlocked && (
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(6px)', zIndex: 10 }}>
                             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#64748b' }}>
                                <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)' }}>
                                  <Lock size={32} />
                                </div>
                                <span style={{ fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Locked</span>
                             </div>
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '14px' }}>
                            <div style={{ height: '8px', width: '8px', borderRadius: '50%', background: getDifficultyColor(diff), boxShadow: `0 0 10px ${getDifficultyColor(diff)}` }}></div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff' }}>{diff}</span>
                          </div>
                          {isSolved && (
                            <div style={{ background: 'rgba(34,197,94,0.15)', padding: '0.5rem', borderRadius: '50%' }}>
                              <CheckCircle2 size={24} color="#22c55e" style={{ filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.4))' }} />
                            </div>
                          )}
                        </div>

                        <div style={{ flex: 1 }}>
                          <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: isUnlocked ? '#fff' : '#475569', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
                            {prob.title}
                          </h3>
                          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
                            {prob.topic.split(',').map((t, idx) => (
                              <span key={idx} style={{ fontSize: '0.75rem', background: 'rgba(168, 85, 247, 0.1)', color: '#d8b4fe', padding: '5px 14px', borderRadius: '12px', fontWeight: 700, border: '1px solid rgba(168, 85, 247, 0.1)' }}>{t.trim()}</span>
                            ))}
                          </div>
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: '1.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                              <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bounty</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                 <Zap size={16} fill="#fbbf24" color="#fbbf24" />
                                 <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>{prob.points || '100'} <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>XP</span></span>
                              </div>
                           </div>
                           {isUnlocked && (
                             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: isSolved ? 'rgba(34,197,94,0.15)' : 'rgba(168, 85, 247, 0.15)', color: isSolved ? '#4ade80' : '#c084fc', padding: '0.85rem 1.75rem', borderRadius: '20px', fontSize: '1rem', fontWeight: 800, transition: 'all 0.3s' }}>
                               {isSolved ? 'Review' : 'Enter Arena'} <ChevronRight size={18} />
                             </div>
                           )}
                        </div>
                      </div>
                    );
                 })}
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Problems;
