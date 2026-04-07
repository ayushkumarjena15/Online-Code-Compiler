import React, { useState, useEffect } from 'react';
import { Database, Search, Award, CheckCircle2, Play, Trophy } from 'lucide-react';
import { DSA_PROBLEMS, SQL_PROBLEMS, PYTHON_PROBLEMS, JAVA_PROBLEMS, JS_PROBLEMS } from './problemData';
import CertificateModal from './CertificateModal';

export default function Problems({ onSelectProblem, user, supabase }) {
  const [activeTab, setActiveTab] = useState('dsa');
  const [search, setSearch] = useState('');
  const [solvedProblems, setSolvedProblems] = useState({});
  const [showCertificate, setShowCertificate] = useState(false);
  const [certData, setCertData] = useState({ lang: '', title: '' });

  useEffect(() => {
    const fetchProgress = async () => {
      let stored = JSON.parse(localStorage.getItem('solvedProblems') || '{}');
      if (user && supabase) {
        try {
          const { data, error } = await supabase
            .from('user_progress')
            .select('problem_id')
            .eq('user_id', user.id);
          
          if (!error && data) {
             const serverSolved = {};
             data.forEach(row => serverSolved[row.problem_id] = true);
             stored = { ...stored, ...serverSolved };
             localStorage.setItem('solvedProblems', JSON.stringify(stored));
          }
        } catch (e) {
          console.error("Failed to fetch progress from DB:", e);
        }
      }
      setSolvedProblems(stored);
    };
    fetchProgress();
  }, [activeTab, user, supabase]);

  const activeProblems = activeTab === 'dsa' ? DSA_PROBLEMS :
                         activeTab === 'sql' ? SQL_PROBLEMS :
                         activeTab === 'python' ? PYTHON_PROBLEMS :
                         activeTab === 'java' ? JAVA_PROBLEMS :
                         activeTab === 'javascript' ? JS_PROBLEMS : [];
                         
  const filteredProblems = activeProblems.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.topic.toLowerCase().includes(search.toLowerCase())
  );

  const getCategoryStats = () => {
    const solvedCount = activeProblems.filter(p => solvedProblems[p.id]).length;
    const totalCount = activeProblems.length;
    const target = activeTab === 'dsa' ? 20 : 15;
    const progressPct = Math.min(100, Math.round((solvedCount / target) * 100));
    return { solvedCount, totalCount, target, progressPct };
  };

  const stats = getCategoryStats();

  const handleSolve = (prob) => {
    onSelectProblem(prob, activeTab);
  };

  const handleViewCert = () => {
    const titles = {
      dsa: 'DSA 5 ⭐ Associate',
      sql: 'SQL 5 ⭐ Associate',
      python: 'Python 5 ⭐ Associate',
      java: 'Java 5 ⭐ Associate',
      javascript: 'JavaScript 5 ⭐ Associate'
    };
    setCertData({ lang: activeTab.toUpperCase(), title: titles[activeTab] });
    setShowCertificate(true);
  };

  const getDifficultyColor = (diff) => {
    switch(diff) {
      case 'Easy': case '1 Star': return '#22c55e';
      case '2 Stars': return '#84cc16';
      case 'Medium': case '3 Stars': return '#eab308';
      case '4 Stars': return '#f97316';
      case 'Hard': case '5 Stars': return '#ef4444';
      default: return 'var(--text)';
    }
  };

  return (
    <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>
      {showCertificate && (
        <CertificateModal lang={certData.lang} title={certData.title} user={user} onClose={() => setShowCertificate(false)} />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Database size={28} color="#a855f7" />
            Masterclass Challenges
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-2)', fontSize: '0.95rem' }}>
            Complete the curriculum to unlock your professional verified {activeTab.toUpperCase()} certification.
          </p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '300px', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--panel-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-3)' }}>
            <span style={{ fontWeight: 600 }}>Category Mastery</span>
            <span style={{ color: stats.progressPct === 100 ? '#fbbf24' : '#3b82f6', fontWeight: 800 }}>{stats.solvedCount}/{stats.target}</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${stats.progressPct}%`, background: stats.progressPct === 100 ? '#fbbf24' : '#3b82f6', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
          </div>
          {stats.progressPct === 100 ? (
            <button 
              onClick={handleViewCert}
              style={{ marginTop: '0.6rem', background: 'linear-gradient(to right, #fbbf24, #d97706)', border: 'none', color: '#000', padding: '0.4rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
            >
              <Trophy size={14} /> View Certificate
            </button>
          ) : (
            <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', textAlign: 'center', marginTop: '4px' }}>
              Solve {stats.target - stats.solvedCount} more to unlock certificate
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--panel-border)', paddingBottom: '1rem', flexWrap: 'wrap' }}>
        {['dsa', 'sql', 'python', 'java', 'javascript'].map(tab => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab)}
             style={{
               background: activeTab === tab ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
               color: activeTab === tab ? '#d8b4fe' : 'var(--text-3)',
               border: `1px solid ${activeTab === tab ? '#a855f7' : 'transparent'}`,
               padding: '0.6rem 1.2rem',
               borderRadius: '8px',
               cursor: 'pointer',
               display: 'flex', alignItems: 'center', gap: '0.5rem',
               fontWeight: 600, transition: 'all 0.2s',
               textTransform: 'capitalize'
             }}
           >
             {tab === 'dsa' ? 'Algorithms' : tab}
           </button>
        ))}

        <div style={{ marginLeft: 'auto', position: 'relative', minWidth: '250px' }}>
          <Search size={16} color="var(--text-3)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Filter problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem',
              background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)',
              borderRadius: '8px', color: '#fff', outline: 'none', fontSize: '0.9rem'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '60px 4fr 1.5fr 3fr 120px', padding: '1rem', background: 'rgba(0,0,0,0.1)', borderBottom: '1px solid var(--panel-border)', fontWeight: 700, color: 'var(--text-2)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
        <div>#</div>
        <div>Problem Name</div>
        <div>Level</div>
        <div>Category</div>
        <div style={{ textAlign: 'right' }}>Status</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {filteredProblems.map((prob, index) => (
          <div 
            key={prob.id} 
            onClick={() => handleSolve(prob)}
            style={{
              display: 'grid', gridTemplateColumns: '60px 4fr 1.5fr 3fr 120px',
              padding: '1.25rem 1rem',
              background: 'var(--panel-bg)',
              borderBottom: '1px solid var(--panel-border)',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--panel-bg)'}
          >
            <div style={{ color: 'var(--text-3)', fontSize: '0.85rem' }}>{index + 1}</div>
            <div style={{ fontWeight: 600, color: '#fff', fontSize: '1rem' }}>{prob.title}</div>
            <div style={{ color: getDifficultyColor(prob.difficulty), fontWeight: 700, fontSize: '0.8rem' }}>{prob.difficulty}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {prob.topic.split(',').map(t => (
                <span key={t} style={{ fontSize: '0.7rem', color: 'var(--text-3)', padding: '2px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>{t.trim()}</span>
              ))}
            </div>
            <div style={{ textAlign: 'right' }}>
              {solvedProblems[prob.id] ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#22c55e', fontWeight: 700, fontSize: '0.85rem' }}>
                   <CheckCircle2 size={16} /> Solved
                </div>
              ) : (
                <button
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    color: '#60a5fa',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer',
                    fontWeight: 700, fontSize: '0.8rem'
                  }}
                >
                  Solve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
