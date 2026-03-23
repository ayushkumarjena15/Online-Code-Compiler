import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { MonitorPlay, Save } from 'lucide-react';

export default function WebPlayground({ user, supabase, setToast, initialWebCode }) {
  const [html, setHtml] = useState('<div class="container">\n  <h1>Hello World ✨</h1>\n  <p>Start building your web app here!</p>\n</div>');
  const [css, setCss] = useState('body {\n  font-family: system-ui, sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  margin: 0;\n  background: #f8fafc;\n  color: #334155;\n}\n\n.container {\n  text-align: center;\n  padding: 2rem;\n  background: white;\n  border-radius: 12px;\n  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);\n}\n\nh1 {\n  color: #a855f7;\n  margin-bottom: 0.5rem;\n}');
  const [js, setJs] = useState('// Your JavaScript goes here\nconsole.log("Web Playground is active!");');
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
