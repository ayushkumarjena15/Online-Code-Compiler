import React, { useState, useEffect } from 'react';
import { Database, Search, Award, CheckCircle2, Play, Trophy } from 'lucide-react';
import { DSA_PROBLEMS, SQL_PROBLEMS, PYTHON_PROBLEMS, JAVA_PROBLEMS, JS_PROBLEMS } from './problemData';
import CertificateModal from './CertificateModal';

export default function Problems({ onSelectProblem, user, supabase, contest, onClearContest }) {
  const [activeTab, setActiveTab] = useState('dsa');
  const [search, setSearch] = useState('');
  const [solvedProblems, setSolvedProblems] = useState({});
  const [certData, setCertData] = useState({ lang: '', title: '' });
  const [contestProblems, setContestProblems] = useState([]);
  const [isContestLoading, setIsContestLoading] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select('problem_id')
          .eq('user_id', user.id);
        
        if (!error && data) {
          const solved = {};
          data.forEach(p => solved[p.problem_id] = true);
          setSolvedProblems(solved);
        }
      } catch (err) {
        console.error("Error fetching progress:", err);
      }
    };

    const fetchContestProblems = async () => {
      if (!contest) return;
      setIsContestLoading(true);
      try {
        const { data, error } = await supabase
          .from('contest_problems')
          .select('problem_id')
          .eq('contest_id', contest.id);
        
        if (!error && data) {
          const ids = data.map(d => parseInt(d.problem_id));
          const filtered = DSA_PROBLEMS.filter(p => ids.includes(p.id));
          setContestProblems(filtered);
        }
      } catch (err) {
        console.error("Error fetching contest problems:", err);
      } finally {
        setIsContestLoading(false);
      }
    };

    fetchProgress();
    if (contest) fetchContestProblems();
  }, [activeTab, user, supabase, contest]);

  const activeProblems = contest ? contestProblems : 
                         activeTab === 'dsa' ? DSA_PROBLEMS :
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

  if (isContestLoading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)' }}>
        <RefreshCw className="animate-spin" size={32} />
        <span style={{ marginLeft: '1rem' }}>Loading contest problems...</span>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>
      {showCertificate && (
        <CertificateModal lang={certData.lang} title={certData.title} user={user} onClose={() => setShowCertificate(false)} />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.8rem', color: contest ? '#fbbf24' : 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              {contest ? <Trophy size={28} color="#fbbf24" /> : <Database size={28} color="#a855f7" />}
              {contest ? contest.title : 'Masterclass Challenges'}
            </h1>
            <p style={{ margin: 0, color: 'var(--text-2)', fontSize: '0.95rem' }}>
              {contest ? contest.description : 'Complete the curriculum to unlock your professional verified ' + activeTab.toUpperCase() + ' certification.'}
            </p>
          </div>
          
          {contest && (
            <button 
              onClick={onClearContest}
              style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
            >
              Exit Contest Arena
            </button>
          )}
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

      {!contest && (
        <div style={{ display: 'flex', gap: '0.8rem', borderBottom: '1px solid var(--panel-border)', paddingBottom: '0.5rem' }}>
          {[
            { id: 'dsa', label: 'DSA', icon: Trophy },
            { id: 'sql', label: 'SQL', icon: Database },
            { id: 'python', label: 'Python', icon: Play },
            { id: 'java', label: 'Java', icon: Play },
            { id: 'javascript', label: 'JS', icon: Play }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                border: 'none',
                color: activeTab === tab.id ? '#a855f7' : 'var(--text-2)',
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 600,
                transition: 'all 0.2s',
                border: activeTab === tab.id ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid transparent'
              }}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div style={{ position: 'relative' }}>
        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} size={18} />
        <input
          type="text"
          placeholder="Search by title or topic..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--panel-border)', padding: '0.8rem 1rem 0.8rem 3rem', borderRadius: '12px', color: 'var(--text)', outline: 'none' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.2rem' }}>
        {filteredProblems.map(prob => (
          <div
            key={prob.id}
            onClick={() => handleSolve(prob)}
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--panel-border)',
              borderRadius: '16px',
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--panel-border)';
            }}
          >
            {solvedProblems[prob.id] && (
              <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                <CheckCircle2 size={20} color="#22c55e" />
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <span style={{ fontSize: '0.75rem', color: getDifficultyColor(prob.difficulty || prob.rating), fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {prob.difficulty || prob.rating}
              </span>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{prob.title}</h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>{prob.topic}</span>
              </div>
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>{prob.points || '100'} pts</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#a855f7', fontSize: '0.85rem', fontWeight: 600 }}>
                  Solve <Play size={14} fill="currentColor" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
