import re

with open('src/ProblemDetail.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
imports = """import { GoogleGenerativeAI } from '@google/generative-ai';
import { ArrowLeft, Play, CheckCircle2, XCircle, ExternalLink, ChevronDown, Wand2, Network, Square, RefreshCw } from 'lucide-react';"""
content = re.sub(r"import { ArrowLeft.*? } from 'lucide-react';", imports, content, flags=re.DOTALL)

# 2. genAI func
gen_ai_func = """
const generateAIContent = async (apiKey, prompt) => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-flash-lite", "gemini-2.0-flash-lite", "gemini-flash-lite-latest"];
  let lastError;
  for (const modelName of models) {
     try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        return result.response.text();
     } catch (err) {
        lastError = err;
        console.warn(`Dev Warning: AI Model ${modelName} encountered an error or 404. Dropping down to fallback...`);
     }
  }
  throw lastError;
};
"""
content = re.sub(r"export default function ProblemDetail", gen_ai_func + "\nexport default function ProblemDetail", content)

# 3. State
states = """  const [code, setCode] = useState(problem.templateCode || '');
  const [isRunning, setIsRunning] = useState(false);
  const [rawOutput, setRawOutput] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [runError, setRunError] = useState('');
  const [outputTab, setOutputTab] = useState('execute');
  
  const [explanation, setExplanation] = useState('');
  const [tutorSteps, setTutorSteps] = useState([]);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [isExplaining, setIsExplaining] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const [tutorChat, setTutorChat] = useState([]);
  const [tutorInput, setTutorInput] = useState('');
  const [isAskingTutor, setIsAskingTutor] = useState(false);
  const [tutorConfigLang, setTutorConfigLang] = useState('en-US');

  const [mermaidCode, setMermaidCode] = useState('');
  const [isVisualizing, setIsVisualizing] = useState(false);
  const decorationsRef = useRef([]);
  const abortSpeech = useRef(false);
"""
content = re.sub(r"  const \[code, setCode\].*?  const \[runError, setRunError\] = useState\(''\);", states, content, flags=re.DOTALL)

# 4. runCode
functions = """  const runCode = async () => {
    setOutputTab('execute');
    if (!code.trim()) return;"""
content = re.sub(r"  const runCode = async \(\) => {\n    if \(\!code\.trim\(\)\) return;", functions, content)

# 5. AI Methods
ai_functions = """
  const stopSpeaking = () => {
    abortSpeech.current = true;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    if (editorRef.current) {
       decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
    }
  };

  const speakNext = (steps, index) => {
     if (abortSpeech.current || index >= steps.length) {
        setIsSpeaking(false);
        setActiveStepIndex(-1);
        if (editorRef.current) {
          decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
        }
        return;
     }
     
     const step = steps[index];
     setActiveStepIndex(index);
     
     if (editorRef.current && step.line) {
        decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, [{
          range: { startLineNumber: step.line, startColumn: 1, endLineNumber: step.line, endColumn: 1 },
          options: { isWholeLine: true, className: 'ai-highlight-line' }
        }]);
        editorRef.current.revealLineInCenter(step.line);
     }
     
     const utterance = new SpeechSynthesisUtterance(step.spokenText || step.uiText || step.text);
     utterance.lang = tutorConfigLang;
     const voices = window.speechSynthesis.getVoices();
     const preferredVoice = voices.find(v => v.lang.includes(tutorConfigLang)) || voices.find(v => v.lang.includes(tutorConfigLang.split('-')[0])) || voices[0];
     if (preferredVoice) utterance.voice = preferredVoice;
     utterance.pitch = 1;
     utterance.rate = 0.9;
     
     utterance.onend = () => speakNext(steps, index + 1);
     utterance.onerror = () => { if (!abortSpeech.current) speakNext(steps, index + 1); };
     window.speechSynthesis.speak(utterance);
  };

  const handleExplainCode = async () => {
    if (!code.trim()) return;
    setIsExplaining(true);
    setOutputTab('explain');
    setExplanation('');
    setTutorSteps([]);
    setActiveStepIndex(-1);
    abortSpeech.current = false;
    stopSpeaking();
    abortSpeech.current = false;
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Missing API Key");
      
      const prompt = `You are a world-class AI coding tutor. You MUST strictly return a valid JSON array of step-by-step tutorial explanation objects for the provided code.
Each object must perfectly match this structure:
{
  "line": 4, // The EXACT line number (1-indexed) in the code this step explains. NEVER highlight a blank line or closing bracket! Point precisely to the active code syntax.
  "color": "#3b82f6", // A distinct vivid bright HEX color representing this step (use different colors like purple, green, yellow, pink, blue).
  "uiText": "🔷 1. Structure of Node\\\\nEach node has 3 parts:\\\\n👉 data...", // Beautifully formatted text with emojis, headings, bullet points, and newlines.
  "spokenText": "Step 1. Structure of Node. Each node has 3 parts, data, next, and previous." // A completely clean transcript. Do NOT include ANY syntax characters (no asterisks, slashes, brackets, parenthesis, or emojis) so the TTS engine speaks smoothly.
}
Do NOT wrap your response in markdown code blocks. Respond purely with a valid JSON array.
Translate both text fields to ${tutorConfigLang === 'hi-IN' ? 'Hindi (Devanagari script)' : 'English'}.

Code:
-----
${code}`;
      
      let rawText = await generateAIContent(apiKey, prompt);
      rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      
      let steps = [];
      try {
         steps = JSON.parse(rawText);
         setTutorSteps(steps);
         setExplanation('');
      } catch (e) {
         setExplanation(rawText);
         setTutorSteps([]);
         steps = [{ text: rawText }];
      }

      setIsSpeaking(true);
      speakNext(steps, 0);
      
    } catch (err) {
      setExplanation("Sorry, I could not generate an explanation. Please check your API key or network connection.");
    } finally {
      setIsExplaining(false);
    }
  };

  const handleAskTutor = async () => {
    if (!tutorInput.trim() || isAskingTutor) return;
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) return;

    const question = tutorInput;
    setTutorInput('');
    setTutorChat(prev => [...prev, { role: 'user', content: question }]);
    setIsAskingTutor(true);

    try {
      const prompt = `You are a helpful AI coding tutor. The user is asking a question about this code:\\n\\n${code}\\n\\nQuestion: ${question}\\n\\nProvide a concise and helpful answer without emojis. Keep it brief. Respond entirely in ${tutorConfigLang === 'hi-IN' ? 'Hindi (in Devanagari script)' : 'English'}.`;
      
      const text = await generateAIContent(apiKey, prompt);
      
      setTutorChat(prev => [...prev, { role: 'ai', content: text }]);
      setOutputTab('explain');
    } catch (err) {
      setTutorChat(prev => [...prev, { role: 'ai', content: "Error: I couldn't reach my brain. Please check your network." }]);
    } finally {
      setIsAskingTutor(false);
    }
  };

  const handleVisualize = async () => {
    if (isVisualizing || !code.trim()) return;
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) return;

    setIsVisualizing(true);
    setMermaidCode('');
    setOutputTab('visualize');

    try {
      const prompt = `You are a helpful AI coding tutor. The user wants a clean 2D flowchart diagram summarizing their code.\\n\\nAnalyze this code:\\n\\n${code}\\n\\nGenerate ONLY a strictly valid Mermaid.js graph chart (like flowchart TD or graph TD) representing the primary data structure, architecture, or algorithm control flow. DO NOT wrap it in markdown blockticks like \`\`\`mermaid. Start directly with the graph declaration.`;
      
      let text = await generateAIContent(apiKey, prompt);
      text = text.replace(/```mermaid/gi, '').replace(/```/g, '').trim();
      
      setMermaidCode(text);
    } catch (err) {
      console.error(err);
    } finally {
      setIsVisualizing(false);
    }
  };
"""
content = re.sub(r'  const language = isSql \? \'sql\' : \'cpp\';', ai_functions + "\n  const language = isSql ? 'sql' : 'cpp';", content)

# 6. Toolbar Buttons
toolbar_buttons = """          <div style={{ flex: 1 }} />
          
          <button
            onClick={handleExplainCode}
            disabled={isExplaining || !code.trim() || isSql}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.45rem 1rem', borderRadius: '6px',
              background: 'rgba(168,85,247,0.2)', color: '#d8b4fe', border: '1px solid #a855f7', cursor: isExplaining ? 'default' : 'pointer',
              fontWeight: 600, fontSize: '0.85rem'
            }}
          >
            {isExplaining ? <span className="loader" style={{width: 12, height: 12}} /> : <Wand2 size={13} />}
            Explain
          </button>

          <button
            onClick={handleVisualize}
            disabled={isVisualizing || !code.trim() || isSql}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.45rem 1rem', borderRadius: '6px',
              background: 'rgba(59,130,246,0.2)', color: '#93c5fd', border: '1px solid #3b82f6', cursor: isVisualizing ? 'default' : 'pointer',
              fontWeight: 600, fontSize: '0.85rem'
            }}
          >
            {isVisualizing ? <span className="loader" style={{width: 12, height: 12}} /> : <Network size={13} />}
            Flowchart
          </button>

          {totalCount > 0 && ("""
content = re.sub(r'          <div style={{ flex: 1 }} />\s*{totalCount > 0 && \(', toolbar_buttons, content)


# 7. Output Panels
bottom_section = """
        {outputTab === 'execute' && (testResults.length > 0 || rawOutput || runError) && (
          <div style={{
            flexShrink: 0, maxHeight: '220px', overflowY: 'auto',
            borderTop: '1px solid var(--panel-border)',
            background: 'var(--panel-bg)',
          }}>
            {/* Test case grid */}
            {testResults.length > 0 && (
              <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: '0.4rem',
                }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-2)' }}>Test Cases</span>
                  <span style={{
                    fontSize: '0.82rem', fontWeight: 700,
                    color: allPassed ? '#22c55e' : '#ef4444',
                    background: allPassed ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    padding: '2px 10px', borderRadius: '99px',
                  }}>
                    {allPassed ? 'All Passed!' : `${passCount}/${totalCount} Passed`}
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {testResults.map(r => (
                    <div key={r.num} style={{
                      display: 'flex', alignItems: 'center', gap: '0.35rem',
                      padding: '0.3rem 0.75rem', borderRadius: '6px',
                      background: r.pass ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                      border: `1px solid ${r.pass ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                      fontSize: '0.82rem',
                    }}>
                      {r.pass
                        ? <CheckCircle2 size={13} color="#22c55e" />
                        : <XCircle size={13} color="#ef4444" />}
                      <span style={{ color: r.pass ? '#86efac' : '#fca5a5', fontWeight: 600 }}>
                        Test {r.num}
                      </span>
                      {r.detail && (
                        <span style={{ color: 'var(--text-3)', fontSize: '0.78rem' }}>{r.detail}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Raw output (when no test cases parsed) or SQL message */}
            {rawOutput && testResults.length === 0 && (
              <pre style={{
                margin: 0, padding: '0.75rem 1rem',
                color: 'var(--text)', fontSize: '0.85rem',
                fontFamily: 'monospace', whiteSpace: 'pre-wrap',
              }}>
                {rawOutput}
              </pre>
            )}

            {/* Error */}
            {runError && (
              <pre style={{
                margin: 0, padding: '0.75rem 1rem',
                color: '#fca5a5', fontSize: '0.82rem',
                fontFamily: 'monospace', whiteSpace: 'pre-wrap',
                borderTop: testResults.length > 0 ? '1px solid var(--panel-border)' : 'none',
              }}>
                {runError}
              </pre>
            )}
          </div>
        )}

        {outputTab === 'visualize' && (
           <div style={{ flexShrink: 0, height: '300px', display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--panel-border)', background: 'var(--panel-bg)'}}>
             <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', borderBottom: '1px solid var(--panel-border)' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Network size={14}/> Visualizer</span>
                <button onClick={() => setOutputTab('execute')} style={{ background: 'transparent', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}><Square size={14}/></button>
             </div>
             {isVisualizing ? (
                <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--text-3)' }}>
                  <span className="loader" style={{ borderColor: 'rgba(59,130,246, 0.3)', borderTopColor: '#3b82f6', marginBottom: '1rem' }}></span>
                  <p>Generating flowchart...</p>
                </div>
             ) : mermaidCode ? (
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                    <button onClick={handleVisualize} disabled={isVisualizing || !code.trim()} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', zIndex: 10, padding: '0.3rem 0.6rem', background: 'rgba(59,130,246,0.2)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize:'0.75rem' }}>
                      <RefreshCw size={12} /> Regenerate
                    </button>
                    <iframe 
                      srcDoc={`<html><head><script type="module">import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs'; mermaid.initialize({ startOnLoad: true, theme: 'dark' });</script><style>body { margin: 0; padding: 1rem; background: transparent; color: white; display:flex; justify-content:center; align-items:flex-start} .mermaid { background: rgba(30,41,59,0.7); padding: 1rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); }</style></head><body><div class="mermaid">${mermaidCode}</div></body></html>`}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      sandbox="allow-scripts"
                    />
                </div>
             ) : (
                <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--text-3)', padding: '2rem' }}>
                  <Network size={32} opacity={0.3} style={{ marginBottom: '1rem' }} />
                  <p style={{ textAlign: 'center', fontSize: '0.85rem' }}>Failed or empty.</p>
                </div>
             )}
           </div>
        )}

        {outputTab === 'explain' && (
           <div style={{ flexShrink: 0, height: '350px', display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--panel-border)', background: 'var(--panel-bg)'}}>
             <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', borderBottom: '1px solid var(--panel-border)', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Wand2 size={14}/> AI Tutor</span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                   {isSpeaking && <button onClick={stopSpeaking} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display:'flex' }}><Square size={14}/></button>}
                   <select value={tutorConfigLang} onChange={(e) => setTutorConfigLang(e.target.value)} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', padding: '0.1rem 0.3rem', fontSize: '0.7rem', outline: 'none', cursor: 'pointer' }}>
                     <option value="en-US" style={{color:'black'}}>English</option>
                     <option value="hi-IN" style={{color:'black'}}>Hindi</option>
                   </select>
                   <button onClick={() => setOutputTab('execute')} style={{ background: 'transparent', border: 'none', color: 'var(--text-3)', cursor: 'pointer', display:'flex' }}><Square size={14}/></button>
                </div>
             </div>
             
             <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                {tutorSteps.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {tutorSteps.map((step, idx) => (
                       <div key={idx} style={{ 
                         padding: '0.75rem', lineHeight: '1.5', fontSize: '0.85rem', whiteSpace: 'pre-wrap', color: '#f8fafc',
                         background: `linear-gradient(to right, ${step.color || '#a855f7'}15, transparent)`,
                         borderLeft: `3px solid ${step.color || '#a855f7'}`, borderRadius: '0 6px 6px 0',
                         opacity: (activeStepIndex === -1 || activeStepIndex === idx) ? 1 : 0.4,
                         transform: activeStepIndex === idx ? 'translateX(3px)' : 'translateX(0)',
                         transition: 'all 0.3s ease',
                       }}>
                         {step.line && <div style={{ color: step.color || '#c084fc', fontWeight: 'bold', marginBottom: '0.3rem', fontSize: '0.7rem', textTransform: 'uppercase' }}>Line {step.line}</div>}
                         <span style={{ color: activeStepIndex === idx ? '#fff' : 'inherit' }}>{step.uiText || step.text}</span>
                       </div>
                    ))}
                  </div>
                ) : explanation ? (
                  <div style={{ padding: '0.75rem', lineHeight: '1.5', whiteSpace: 'pre-wrap', fontSize: '0.85rem', color: '#f8fafc', background: 'linear-gradient(to right, rgba(168, 85, 247, 0.15), transparent)', borderLeft: '3px solid #a855f7', borderRadius: '0 6px 6px 0' }}>
                    {explanation}
                  </div>
                ) : isExplaining ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-3)' }}>
                    <span className="loader" style={{ borderColor: 'rgba(168, 85, 247, 0.3)', borderTopColor: '#a855f7', marginBottom: '1rem' }}></span>
                    <p style={{fontSize: '0.85rem'}}>Analyzing code...</p>
                  </div>
                ) : null}

                {tutorChat.map((msg, i) => (
                   <div key={i} style={{ margin: '0.75rem 0', padding: '0.75rem', background: msg.role === 'user' ? 'rgba(59,130,246,0.1)' : 'rgba(168,85,247,0.1)', borderRadius: '6px', borderLeft: `3px solid ${msg.role === 'user' ? '#3b82f6' : '#a855f7'}` }}>
                      <strong style={{ color: msg.role === 'user' ? '#93c5fd' : '#d8b4fe', fontSize:'0.8rem' }}>{msg.role === 'user' ? 'You' : 'AI Tutor'}</strong>
                      <p style={{ marginTop: '0.3rem', whiteSpace: 'pre-wrap', color: '#f8fafc', fontSize: '0.85rem', lineHeight: 1.4 }}>{msg.content}</p>
                   </div>
                ))}
             </div>

             <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', borderTop: '1px solid var(--panel-border)', background: 'rgba(0,0,0,0.1)' }}>
                <input type="text" value={tutorInput} onChange={e => setTutorInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAskTutor()} placeholder="Ask a question..." style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--panel-border)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none', fontSize: '0.8rem' }} />
                <button onClick={handleAskTutor} disabled={isAskingTutor || !tutorInput.trim()} style={{ padding: '0 1rem', borderRadius: '4px', background: '#a855f7', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize:'0.8rem', opacity: (isAskingTutor || !tutorInput.trim()) ? 0.6 : 1 }}>
                  {isAskingTutor ? '...' : 'Ask'}
                </button>
             </div>
           </div>
        )}
"""
content = re.sub(r'        \{\(testResults\.length > 0 \|\| rawOutput \|\| runError\) && \((.*?)\)\}', bottom_section, content, flags=re.DOTALL)

with open('src/ProblemDetail.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated ProblemDetail.jsx")
