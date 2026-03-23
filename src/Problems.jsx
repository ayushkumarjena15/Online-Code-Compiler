import { useState } from 'react';
import { Code2, Database, Search, ExternalLink, Play } from 'lucide-react';
import { DSA_PROBLEMS, SQL_PROBLEMS } from './problemData';

export default function Problems({ onSelectProblem }) {
  const [activeTab, setActiveTab] = useState('dsa');
  const [search, setSearch] = useState('');

  const activeProblems = activeTab === 'dsa' ? DSA_PROBLEMS : SQL_PROBLEMS;
  const filteredProblems = activeProblems.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.topic.toLowerCase().includes(search.toLowerCase())
  );

  const handleSolve = (prob) => {
    onSelectProblem(prob, activeTab === 'sql');
  };

  const getDifficultyColor = (diff) => {
    switch(diff) {
      case 'Easy': return '#22c55e';
      case 'Medium': return '#eab308';
      case 'Hard': return '#ef4444';
      default: return 'var(--text)';
    }
  };

  return (
    <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Database size={28} color="#a855f7" />
            Problem Set
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-2)', fontSize: '0.95rem' }}>
            {activeTab === 'dsa' ? 'Showing top selection of LeetCode DSA Problems' : 'Showing top selection of LeetCode SQL Questions'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--panel-border)', paddingBottom: '1rem' }}>
        <button
          onClick={() => setActiveTab('dsa')}
          style={{
            background: activeTab === 'dsa' ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
            color: activeTab === 'dsa' ? '#a855f7' : 'var(--text-2)',
            border: `1px solid ${activeTab === 'dsa' ? '#a855f7' : 'transparent'}`,
            padding: '0.6rem 1.2rem',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontWeight: 'bold', transition: 'all 0.2s'
          }}
        >
          <Code2 size={18} /> Data Structures & Algorithms
        </button>
        <button
          onClick={() => setActiveTab('sql')}
          style={{
            background: activeTab === 'sql' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
            color: activeTab === 'sql' ? '#38bdf8' : 'var(--text-2)',
            border: `1px solid ${activeTab === 'sql' ? '#38bdf8' : 'transparent'}`,
            padding: '0.6rem 1.2rem',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontWeight: 'bold', transition: 'all 0.2s'
          }}
        >
          <Database size={18} /> Database (SQL)
        </button>

        <div style={{ marginLeft: 'auto', position: 'relative', width: '300px' }}>
          <Search size={16} color="var(--text-2)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search problems or topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '0.6rem 1rem 0.6rem 2rem',
              background: 'var(--panel)', border: '1px solid var(--panel-border)',
              borderRadius: 'var(--radius-sm)', color: 'var(--text)', outline: 'none'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '80px 3fr 1fr 2fr 120px', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--panel-border)', fontWeight: 'bold', color: 'var(--text-2)', fontSize: '0.85rem' }}>
        <div>ID</div>
        <div>Title</div>
        <div>Difficulty</div>
        <div>Topics</div>
        <div style={{ textAlign: 'center' }}>Action</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {filteredProblems.map((prob, index) => (
          <div key={prob.id} style={{
            display: 'grid', gridTemplateColumns: '80px 3fr 1fr 2fr 120px',
            padding: '1rem',
            background: index % 2 === 0 ? 'var(--panel)' : 'transparent',
            borderBottom: '1px solid var(--panel-border)',
            alignItems: 'center',
            fontSize: '0.9rem'
          }}>
            <div style={{ color: 'var(--text-3)' }}>{index + 1}.</div>
            <div style={{ fontWeight: '500', color: 'var(--text-main)' }}>
              <button
                onClick={() => handleSolve(prob)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'inherit', padding: 0, textAlign: 'left',
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  fontWeight: 500, fontSize: 'inherit',
                }}
              >
                {prob.title}
              </button>
              <a href={prob.url} target="_blank" rel="noreferrer" style={{ color: 'var(--text-3)', marginLeft: '0.4rem' }} onClick={e => e.stopPropagation()}>
                <ExternalLink size={12} />
              </a>
            </div>
            <div style={{ color: getDifficultyColor(prob.difficulty), fontWeight: '600' }}>{prob.difficulty}</div>
            <div style={{ color: 'var(--text-3)', fontSize: '0.8rem', display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              {prob.topic.split(',').map(t => (
                <span key={t} style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '12px' }}>{t.trim()}</span>
              ))}
            </div>
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => handleSolve(prob)}
                style={{
                  background: 'color-mix(in srgb, var(--cat-color) 15%, transparent)',
                  color: 'var(--cat-color)',
                  border: '1px solid color-mix(in srgb, var(--cat-color) 30%, transparent)',
                  padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', width: '100%',
                  fontWeight: 'bold', fontSize: '0.8rem', transition: 'all 0.15s'
                }}
              >
                <Play size={12} /> Solve
              </button>
            </div>
          </div>
        ))}
        {filteredProblems.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-3)' }}>
            No problems found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}
