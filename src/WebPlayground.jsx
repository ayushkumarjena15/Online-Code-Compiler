import React, { useState, useEffect, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { MonitorPlay, Save } from 'lucide-react';

const getDefaultHTML = (user) => {
  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '';
  if (user && name) {
    return `<div class="hero">
  <div class="greeting-badge">👋 Welcome back</div>
  <h1>Hello, <span class="highlight">${name}</span>!</h1>
  <p class="subtitle">Your personal web playground is ready. Build, experiment, and see your code come alive with the <strong>live preview</strong>.</p>
  <div class="cards">
    <div class="card" onclick="this.classList.toggle('flipped')">
      <div class="card-icon">🎨</div>
      <div class="card-label">HTML</div>
      <div class="card-desc">Structure</div>
    </div>
    <div class="card" onclick="this.classList.toggle('flipped')">
      <div class="card-icon">✨</div>
      <div class="card-label">CSS</div>
      <div class="card-desc">Style</div>
    </div>
    <div class="card" onclick="this.classList.toggle('flipped')">
      <div class="card-icon">⚡</div>
      <div class="card-label">JS</div>
      <div class="card-desc">Logic</div>
    </div>
  </div>
  <p class="hint">Click the cards above! Edit this code to start building ✌️</p>
  <div id="clock" class="clock"></div>
</div>`;
  }
  return `<div class="hero">
  <div class="greeting-badge">🌐 Web Dev Playground</div>
  <h1>Hello there! <span class="wave">👋</span></h1>
  <p class="subtitle">You can test your <strong>HTML</strong>, <strong>CSS</strong>, and <strong>JavaScript</strong> here and see a <strong>live preview</strong> instantly!</p>
  <div class="cards">
    <div class="card" onclick="this.classList.toggle('flipped')">
      <div class="card-icon">🎨</div>
      <div class="card-label">HTML</div>
      <div class="card-desc">Structure</div>
    </div>
    <div class="card" onclick="this.classList.toggle('flipped')">
      <div class="card-icon">✨</div>
      <div class="card-label">CSS</div>
      <div class="card-desc">Style</div>
    </div>
    <div class="card" onclick="this.classList.toggle('flipped')">
      <div class="card-icon">⚡</div>
      <div class="card-label">JS</div>
      <div class="card-desc">Logic</div>
    </div>
  </div>
  <p class="hint">Click the cards above! Edit the code on the left to get started 🚀</p>
  <div id="clock" class="clock"></div>
</div>`;
};

const DEFAULT_CSS = `* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
  color: #f1f5f9;
  overflow: hidden;
}

.hero {
  text-align: center;
  padding: 2.5rem;
  max-width: 560px;
  animation: fadeUp 0.6s ease-out;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.greeting-badge {
  display: inline-block;
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.35);
  color: #c4b5fd;
  padding: 0.35rem 1rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  margin-bottom: 1.25rem;
}

h1 {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  line-height: 1.2;
}

.highlight {
  background: linear-gradient(90deg, #a78bfa, #f472b6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.wave {
  display: inline-block;
  animation: wave 1.8s ease-in-out infinite;
  transform-origin: 70% 70%;
}
@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  15% { transform: rotate(14deg); }
  30% { transform: rotate(-8deg); }
  40% { transform: rotate(14deg); }
  50% { transform: rotate(-4deg); }
  60% { transform: rotate(10deg); }
  70% { transform: rotate(0deg); }
}

.subtitle {
  color: #94a3b8;
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 2rem;
}
.subtitle strong {
  color: #e2e8f0;
}

.cards {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.card {
  width: 100px;
  padding: 1.25rem 0.75rem;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.card:hover {
  transform: translateY(-4px) scale(1.04);
  background: rgba(139, 92, 246, 0.15);
  border-color: rgba(139, 92, 246, 0.4);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.2);
}

.card.flipped {
  background: linear-gradient(135deg, rgba(139,92,246,0.3), rgba(244,114,182,0.2));
  border-color: rgba(244,114,182,0.5);
  transform: translateY(-4px) rotateY(8deg) scale(1.04);
}

.card-icon {
  font-size: 1.8rem;
  margin-bottom: 0.4rem;
}
.card-label {
  font-weight: 700;
  font-size: 0.95rem;
  color: #e2e8f0;
}
.card-desc {
  font-size: 0.7rem;
  color: #64748b;
  margin-top: 2px;
}

.hint {
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 1rem;
}

.clock {
  font-size: 0.85rem;
  color: #6366f1;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  opacity: 0.8;
}`;

const DEFAULT_JS = `// Live clock to demonstrate JavaScript works!
function updateClock() {
  const el = document.getElementById('clock');
  if (el) {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    el.textContent = '🕐 ' + time;
  }
}
updateClock();
setInterval(updateClock, 1000);

console.log("🚀 Web Playground is active!");`;

export default function WebPlayground({ user, supabase, setToast, initialWebCode }) {
  const defaultHTML = useMemo(() => getDefaultHTML(user), [user]);
  const [html, setHtml] = useState(defaultHTML);
  const [css, setCss] = useState(DEFAULT_CSS);
  const [js, setJs] = useState(DEFAULT_JS);
  const [activeTab, setActiveTab] = useState('html');
  const [srcDoc, setSrcDoc] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialWebCode && typeof initialWebCode === 'object') {
      setHtml(initialWebCode.html || '');
      setCss(initialWebCode.css || '');
      setJs(initialWebCode.js || '');
    }
  }, [initialWebCode]);

  const handleSaveWebProject = async () => {
    if (!user) {
      setToast({ message: "Sign in to save your web project!", type: "error" });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    
    setIsSaving(true);
    const payload = JSON.stringify({ html, css, js });
    
    try {
      const { error } = await supabase.from('snippets').insert([{
        user_id: user.id,
        title: "Web Project " + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        language: "web",
        code: payload,
      }]);
      if (error) throw error;
      setToast({ message: "Web Project saved successfully!", type: "success" });
      setTimeout(() => setToast(null), 3000);
    } catch (e) {
      setToast({ message: "Failed to save project.", type: "error" });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <head>
            <style>${css}</style>
          </head>
          <body>
            ${html}
            <script>${js}</script>
          </body>
        </html>
      `);
    }, 500);
    return () => clearTimeout(timeout);
  }, [html, css, js]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>
      {/* Editor Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--panel-border)', background: 'var(--panel-bg)', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex' }}>
          <button 
            onClick={() => setActiveTab('html')} 
            style={{ 
              padding: '0.75rem 1.5rem', 
              background: 'transparent', 
              border: 'none', 
              color: activeTab === 'html' ? '#f8fafc' : 'var(--text-secondary)', 
              borderBottom: activeTab === 'html' ? '2px solid #ef4444' : '2px solid transparent', 
              cursor: 'pointer',
              fontWeight: activeTab === 'html' ? 600 : 400
            }}>
            index.html
          </button>
          <button 
            onClick={() => setActiveTab('css')} 
            style={{ 
              padding: '0.75rem 1.5rem', 
              background: 'transparent', 
              border: 'none', 
              color: activeTab === 'css' ? '#f8fafc' : 'var(--text-secondary)', 
              borderBottom: activeTab === 'css' ? '2px solid #3b82f6' : '2px solid transparent', 
              cursor: 'pointer',
              fontWeight: activeTab === 'css' ? 600 : 400
            }}>
            style.css
          </button>
          <button 
            onClick={() => setActiveTab('js')} 
            style={{ 
              padding: '0.75rem 1.5rem', 
              background: 'transparent', 
              border: 'none', 
              color: activeTab === 'js' ? '#f8fafc' : 'var(--text-secondary)', 
              borderBottom: activeTab === 'js' ? '2px solid #eab308' : '2px solid transparent', 
              cursor: 'pointer',
              fontWeight: activeTab === 'js' ? 600 : 400
            }}>
            script.js
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', paddingRight: '1rem' }}>
          <button onClick={handleSaveWebProject} disabled={isSaving} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: isSaving ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', opacity: isSaving ? 0.7 : 1 }}>
            {isSaving ? <span className="loader" style={{ width: 14, height: 14, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} /> : <Save size={14} />}
            {isSaving ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Editor Area */}
        <div style={{ flex: 1, borderRight: '1px solid var(--panel-border)', display: 'flex', flexDirection: 'column' }}>
           <Editor
             height="100%"
             language={activeTab}
             theme="vs-dark"
             value={activeTab === 'html' ? html : activeTab === 'css' ? css : js}
             onChange={(val) => {
               if (activeTab === 'html') setHtml(val || '');
               else if (activeTab === 'css') setCss(val || '');
               else setJs(val || '');
             }}
             options={{
                minimap: { enabled: false },
                fontSize: 15,
                fontFamily: 'Fira Code, monospace',
                padding: { top: 16 },
                wordWrap: "on",
                scrollBeyondLastLine: false
             }}
           />
        </div>
        
        {/* Live Preview Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
           <div style={{ background: '#f1f5f9', padding: '0.5rem 1rem', borderBottom: '1px solid #cbd5e1', color: '#334155', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
             <MonitorPlay size={16} color="#3b82f6" /> Live Preview
           </div>
           <iframe 
             srcDoc={srcDoc}
             title="output"
             sandbox="allow-scripts"
             frameBorder="0"
             width="100%"
             height="100%"
             style={{ border: 'none' }}
           />
        </div>
      </div>
    </div>
  );
}
