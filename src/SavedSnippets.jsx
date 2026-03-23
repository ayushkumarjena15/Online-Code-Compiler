import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Code2, Trash2, Calendar, FileCode2 } from 'lucide-react';

export default function SavedSnippets({ onBack, onOpenInEditor, user, supabase }) {
  const [snippets, setSnippets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSnippets();
  }, []);

  const fetchSnippets = async () => {
    try {
      if (!user) return;
      const { data, error } = await supabase
        .from('snippets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSnippets(data || []);
    } catch (error) {
      console.error('Error fetching snippets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSnippet = async (id, e) => {
    e.stopPropagation();
    try {
      const { error } = await supabase.from('snippets').delete().eq('id', id);
      if (error) throw error;
      setSnippets(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting snippet:', error);
    }
  };

  return (
    <div className="explore-page" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="explore-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: 'var(--panel-bg)', borderBottom: '1px solid var(--panel-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="icon-btn" onClick={onBack} title="Back to Editor" style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.4rem', borderRadius: '0.4rem' }}>
            <ArrowLeft size={18} />
          </button>
          <div style={{ fontSize: '1.25rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileCode2 size={22} color="#60a5fa" />
            <span>My Saved Snippets</span>
          </div>
        </div>
      </div>

      <div className="explore-content" style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', gap: '1rem', opacity: 0.5 }}>
            <div className="loader"></div>
            <p>Loading snippets...</p>
          </div>
        ) : snippets.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', gap: '1rem', opacity: 0.5 }}>
            <BookOpen size={48} />
            <h2>No snippets saved yet!</h2>
            <p>Save code from the editor to view it here.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
            {snippets.map((snip) => (
              <div 
                key={snip.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--panel-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                className="snippet-card"
                onClick={() => onOpenInEditor(snip.language, snip.code)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Code2 size={16} color="#a855f7" />
                    {snip.title || 'Untitled Snippet'}
                  </h3>
                  <button onClick={(e) => deleteSnippet(snip.id, e)} className="icon-btn" style={{ padding: '0.2rem', color: '#ef4444' }} title="Delete">
                     <Trash2 size={15} />
                  </button>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span style={{ background: 'rgba(96, 165, 250, 0.1)', color: '#60a5fa', padding: '0.2rem 0.5rem', borderRadius: '4px', textTransform: 'capitalize' }}>
                    {snip.language}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={13} /> {new Date(snip.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {snip.language === 'web' ? '🌐 Web Project (HTML, CSS, JS Stack) - Click to open in Web Playground' : snip.code}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
