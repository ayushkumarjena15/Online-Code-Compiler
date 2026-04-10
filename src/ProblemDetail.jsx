import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { ArrowLeft, Play, CheckCircle2, XCircle, ExternalLink, ChevronDown, Wand2, Network, Square, RefreshCw, AlignLeft } from 'lucide-react';
import Split from 'react-split';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

const WANDBOX_LANG = {
  cpp: 'gcc-head',
  python: 'cpython-3.14.0',
  java: 'openjdk-head',
  javascript: 'nodejs-head',
};

const GENERIC_TEMPLATES = {
  cpp: `class Solution {\npublic:\n    void solve() {\n        // Your code here\n        \n    }\n};\n`,
  python: `class Solution:\n    def solve(self):\n        # Your code here\n        pass\n`,
  java: `class Solution {\n    public void solve() {\n        // Your code here\n        \n    }\n}\n`,
  javascript: `class Solution {\n    solve() {\n        // Your code here\n        \n    }\n}\n`
};

function generateBoilerplate(cppCode, lang) {
  if (!cppCode || lang === 'cpp') return cppCode || GENERIC_TEMPLATES.cpp;
  
  const match = cppCode.match(/class Solution\s*\{\s*public:\s*([\w<>\*\[\]]+\s+\w+\s*\([^)]*\))\s*\{/);
  if (!match) return GENERIC_TEMPLATES[lang];
  
  let sig = match[1].trim(); 
  const sigMatch = sig.match(/^([\w<>\*\[\]]+)\s+(\w+)\s*\((.*)\)$/);
  if (!sigMatch) return GENERIC_TEMPLATES[lang];
  
  const returnType = sigMatch[1];
  const funcName = sigMatch[2];
  const argsStr = sigMatch[3];
  
  const args = argsStr.split(',').map(s => {
     let parts = s.trim().split(/\s+/);
     let name = parts.pop().replace(/[&*]/g, '');
     let type = parts.join(' ');
     return { type, name };
  }).filter(a => a.name);

  if (lang === 'python') {
     const pyArgs = args.map(a => a.name).join(', ');
     const pySig = pyArgs ? `, ${pyArgs}` : '';
     return `class Solution:\n    def ${funcName}(self${pySig}):\n        \n`;
  }
  if (lang === 'javascript') {
     const jsArgs = args.map(a => a.name).join(', ');
     const jsDocs = args.map(a => ` * @param {any} ${a.name}`).join('\n');
     return `/**\n${jsDocs}\n * @return {any}\n */\nvar ${funcName} = function(${jsArgs}) {\n    \n};\n`;
  }
  if (lang === 'java') {
     const mapType = (t) => {
        if (t.includes('vector<int>')) return 'int[]';
        if (t.includes('vector<vector<int>>')) return 'int[][]';
        if (t.includes('vector<string>')) return 'String[]';
        if (t.includes('string')) return 'String';
        if (t.includes('bool')) return 'boolean';
        return t.replace(/[&*]/g, '');
     };
     const javaArgs = args.map(a => `${mapType(a.type)} ${a.name}`).join(', ');
     const javaRet = mapType(returnType);
     return `class Solution {\n    public ${javaRet} ${funcName}(${javaArgs}) {\n        \n    }\n}\n`;
  }
  
  return GENERIC_TEMPLATES[lang];
}

const getDifficultyColor = (diff) => {
  switch(diff) {
    case 'Easy': case '1 Star': return '#22c55e';
    case '2 Stars': return '#84cc16';
    case 'Medium': case '3 Stars': return '#eab308';
    case '4 Stars': return '#f97316';
    case 'Hard': case '5 Stars': return '#ef4444';
    default: return '#9ca3af';
  }
};

function parseTestResults(output) {
  if (!output) return [];
  const lines = output.split('\n').filter(l => /^Test \d+:/.test(l.trim()));
  return lines.map(line => {
    const match = line.match(/^Test (\d+):\s*(PASS|FAIL)(.*)/);
    if (!match) return null;
    return { num: parseInt(match[1]), pass: match[2] === 'PASS', detail: match[3].trim() };
  }).filter(Boolean);
}

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

export default function ProblemDetail({ problem, onBack, problemLanguage, user, supabase, contest, onSolve }) {
  const [dsaLang, setDsaLang] = useState('cpp');
  const [code, setCode] = useState(problem.templateCode || '');
  const [solved, setSolved] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [rawOutput, setRawOutput] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [runError, setRunError] = useState('');
  const [outputTab, setOutputTab] = useState('execute');
  const [customInput, setCustomInput] = useState('');
  const [complexity, setComplexity] = useState(null);
  const [isAnalyzingComplexity, setIsAnalyzingComplexity] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const analyzeComplexity = async () => {
    setIsAnalyzingComplexity(true);
    setComplexity(null);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setComplexity({ time: 'Unknown', space: 'Unknown' });
        return;
      }
      const prompt = `Analyze this code and return ONLY a valid JSON object representing the asymptotic time and space complexity using Big O notation. Use exact format: {"time": "O(N)", "space": "O(1)"}. Do not use markdown blocks or explanation.\n\nCode:\n${code}`;
      let text = await generateAIContent(apiKey, prompt);
      text = text.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
      const match = text.match(/\{[\s\S]*?\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (parsed.time && parsed.space) {
          setComplexity(parsed);
          return;
        }
      }
      setComplexity({ time: 'O(?)', space: 'O(?)' });
    } catch {
      setComplexity({ time: 'O(Err)', space: 'O(Err)' });
    } finally {
      setIsAnalyzingComplexity(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!user) {
      alert("Please sign in to submit for review.");
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('code_submissions')
        .insert([{
          user_id: user.id,
          problem_id: problem.id,
          language: dsaLang || problemLanguage || 'unknown',
          code: code,
          status: 'pending',
          contest_id: contest?.id || null
        }]);
      
      if (error) throw error;
      alert("Code submitted for review! Check your profile later for feedback.");
    } catch (err) {
      alert("Submission error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  
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

  useEffect(() => {
    if (problem) {
      const draft = localStorage.getItem(`draft_${problem.title}`);
      if (draft) {
        setCode(draft);
      } else {
        if (problemLanguage === 'dsa') {
          setCode(generateBoilerplate(problem.templateCode, dsaLang));
        } else {
          setCode(problem.templateCode || '');
        }
      }
      const stored = JSON.parse(localStorage.getItem('solvedProblems') || '{}');
      setSolved(!!stored[problem.id]);
    }
  }, [problem, problemLanguage]);

  const handleMarkSolved = async () => {
    const stored = JSON.parse(localStorage.getItem('solvedProblems') || '{}');
    if (!solved) {
      stored[problem.id] = true;
      setSolved(true);
      if (user && supabase) {
        try {
           await supabase.from('user_progress').upsert(
              { user_id: user.id, problem_id: problem.id, language: dsaLang || problemLanguage || 'unknown', solved_at: new Date().toISOString(), code: code }, 
              { onConflict: 'user_id,problem_id' }
           );
        } catch(e) { console.error('DB sync error', e); }
      }
    } else {
      delete stored[problem.id];
      setSolved(false);
      if (user && supabase) {
        try {
           await supabase.from('user_progress').delete().match({ user_id: user.id, problem_id: problem.id });
        } catch(e) { console.error('DB load error', e); }
      }
    }
    localStorage.setItem('solvedProblems', JSON.stringify(stored));
    if (onSolve) onSolve();
  };

  useEffect(() => {
    if (problem) {
      localStorage.setItem(`draft_${problem.title}`, code);
    }
  }, [code, problem]);

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
  "uiText": "🔷 1. Structure of Node\\nEach node has 3 parts:\\n👉 data...", // Beautifully formatted text with emojis, headings, bullet points, and newlines.
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
      } catch {
         setExplanation(rawText);
         setTutorSteps([]);
         steps = [{ text: rawText }];
      }

      setIsSpeaking(true);
      speakNext(steps, 0);
      
    } catch {
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
      const prompt = `You are a helpful AI coding tutor. The user is asking a question about this code:\n\n${code}\n\nQuestion: ${question}\n\nProvide a concise and helpful answer without emojis. Keep it brief. Respond entirely in ${tutorConfigLang === 'hi-IN' ? 'Hindi (in Devanagari script)' : 'English'}.`;
      
      const text = await generateAIContent(apiKey, prompt);
      
      setTutorChat(prev => [...prev, { role: 'ai', content: text }]);
      setOutputTab('explain');
    } catch {
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
      const prompt = `You are a helpful AI coding tutor. The user wants a clean 2D flowchart diagram summarizing their code:\n\n${code}\n\nGenerate ONLY a strictly valid Mermaid.js graph chart (like flowchart TD or graph TD) representing the primary data structure, architecture, or algorithm control flow. DO NOT wrap it in markdown blockticks like \`\`\`mermaid. Start directly with the graph declaration. IMPORTANT: Use alphanumeric node IDs. Avoid quotes and special characters such as ()[]{} in node text unless strictly necessary, and surround labels with double quotes if they contain spaces. No subgraphs!`;
      
      let text = await generateAIContent(apiKey, prompt);
      text = text.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
      
      setMermaidCode(text);
    } catch (err) {
      console.error(err);
    } finally {
      setIsVisualizing(false);
    }
  };

  const editorRef = useRef(null);

  const language = problemLanguage === 'dsa' ? dsaLang : problemLanguage;
  const monacoLang = problemLanguage === 'dsa' ? dsaLang : problemLanguage;

  const runCode = async () => {
    setOutputTab('execute');
    if (!code.trim()) return;
    setIsRunning(true);
    setRawOutput('');
    setTestResults([]);
    setRunError('');
    setComplexity(null);
    if (problemLanguage !== 'sql') analyzeComplexity();

    if (problemLanguage === 'sql') {
      setRawOutput('SQL execution is not supported in the browser test runner.\nVerify your query logic manually or test on a local MySQL instance.');
      setIsRunning(false);
      return;
    }

    try {
      const wandboxLang = WANDBOX_LANG[language] || 'gcc-head';
      const requestBody = { compiler: wandboxLang, code, stdin: customInput, options: 'warning' };
      if (wandboxLang.includes('gcc') || wandboxLang.includes('clang')) {
        requestBody['compiler-option-raw'] = '-std=c++17';
      }
      const response = await axios.post(
        'https://wandbox.org/api/compile.json',
        requestBody,
        { headers: { 'Content-Type': 'application/json' } }
      );

      const output = response.data.program_output || '';
      const stderr = response.data.compiler_error || response.data.program_error || '';

      if (stderr && !output) {
        setRunError(stderr);
      } else {
        setRawOutput(output);
        const results = parseTestResults(output);
        if (results.length > 0) {
          setTestResults(results);
          if (results.filter(r => r.pass).length === results.length) {
             const stored = JSON.parse(localStorage.getItem('solvedProblems') || '{}');
             stored[problem.id] = true;
             localStorage.setItem('solvedProblems', JSON.stringify(stored));
             if (onSolve) onSolve();
             setSolved(true);
             if (user && supabase) {
                try {
                   await supabase.from('user_progress').upsert(
                      { user_id: user.id, problem_id: problem.id, language: dsaLang || problemLanguage || 'unknown', solved_at: new Date().toISOString(), code: code }, 
                      { onConflict: 'user_id,problem_id' }
                   );
                } catch(e) { console.error('Auto solve DB sync error', e); }
             }
          }
        }
      }
    } catch (err) {
      console.error(err);
      setRunError(err.response?.data?.error || 'Network error execution failed. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  const passCount = testResults.filter(r => r.pass).length;
  const totalCount = testResults.length;
  const allPassed = totalCount > 0 && passCount === totalCount;

  return (
    <Split sizes={[40, 60]} minSize={320} gutterSize={8} snapOffset={30} style={{ display: 'flex', flex: 1, overflow: 'hidden', height: '100%', width: '100%' }}>
      {/* Left panel: problem description */}
      <div style={{
        overflowY: 'auto',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        background: 'var(--panel-bg)',
      }}>
        {/* Header */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <button
              onClick={onBack}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                background: 'transparent', border: 'none', color: 'var(--text-2)',
                cursor: 'pointer', padding: '0.25rem 0',
                fontSize: '0.85rem',
              }}
            >
              <ArrowLeft size={14} /> Back to Problems
            </button>
            <button
              onClick={handleMarkSolved}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                background: solved ? 'rgba(34,197,94,0.15)' : 'transparent', 
                border: `1px solid ${solved ? '#22c55e' : 'var(--panel-border)'}`, 
                color: solved ? '#22c55e' : 'var(--text-2)',
                cursor: 'pointer', padding: '0.35rem 0.75rem', borderRadius: '4px',
                fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s'
              }}
            >
              {solved ? <CheckCircle2 size={14} /> : <div style={{width: 14, height: 14, border: '1px solid var(--text-2)', borderRadius: '50%'}}></div>}
              {solved ? 'Solved' : 'Mark as Solved'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text-main)', lineHeight: 1.3 }}>
              {problem.title}
            </h2>
            <a href={problem.url} target="_blank" rel="noreferrer" title="Open on LeetCode" style={{ flexShrink: 0, color: 'var(--text-3)', marginTop: '4px' }}>
              <ExternalLink size={15} />
            </a>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{
              color: getDifficultyColor(problem.difficulty),
              background: `${getDifficultyColor(problem.difficulty)}18`,
              border: `1px solid ${getDifficultyColor(problem.difficulty)}50`,
              padding: '2px 10px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600,
            }}>
              {problem.difficulty}
            </span>
            {problem.topic.split(',').map(t => (
              <span key={t} style={{
                background: 'rgba(255,255,255,0.06)', color: 'var(--text-3)',
                padding: '2px 8px', borderRadius: '99px', fontSize: '0.75rem',
              }}>{t.trim()}</span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div style={{ color: 'var(--text)', lineHeight: 1.75, fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
          {problem.description}
        </div>

        {/* Examples */}
        {problem.examples && problem.examples.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {problem.examples.map((ex, i) => (
              <div key={i} style={{
                background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)',
                borderRadius: '8px', padding: '1rem', fontSize: '0.88rem',
              }}>
                <div style={{ color: 'var(--text-2)', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Example {i + 1}
                </div>
                <div style={{ fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <div><span style={{ color: 'var(--text-3)' }}>Input: </span><span style={{ color: '#f8fafc' }}>{ex.input}</span></div>
                  <div><span style={{ color: 'var(--text-3)' }}>Output: </span><span style={{ color: '#f8fafc' }}>{ex.output}</span></div>
                  {ex.explanation && (
                    <div style={{ marginTop: '0.3rem', color: 'var(--text-2)', fontFamily: 'inherit' }}>
                      <span style={{ color: 'var(--text-3)' }}>Explanation: </span>{ex.explanation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Constraints */}
        {problem.constraints && (
          <div>
            <div style={{ color: 'var(--text-2)', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Constraints</div>
            <div style={{
              fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-3)',
              whiteSpace: 'pre-wrap', lineHeight: 1.7,
            }}>
              {problem.constraints}
            </div>
          </div>
        )}
      </div>

      {/* Right panel: editor + output */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Editor toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.6rem 1rem', borderBottom: '1px solid var(--panel-border)',
          background: 'var(--panel)', flexShrink: 0,
        }}>
          {problemLanguage === 'dsa' ? (
            <select
              value={dsaLang}
              onChange={(e) => {
                const newLang = e.target.value;
                setDsaLang(newLang);
                setCode(generateBoilerplate(problem.templateCode, newLang));
              }}
              style={{
                background: 'rgba(255,255,255,0.05)', color: 'var(--text-2)',
                border: '1px solid var(--panel-border)', borderRadius: '4px',
                padding: '3px 6px', fontSize: '0.82rem', outline: 'none', cursor: 'pointer'
              }}
            >
              <option value="cpp" style={{color:'black'}}>C++</option>
              <option value="python" style={{color:'black'}}>Python</option>
              <option value="java" style={{color:'black'}}>Java</option>
              <option value="javascript" style={{color:'black'}}>JavaScript</option>
            </select>
          ) : (
            <span style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontSize: '0.82rem', color: 'var(--text-2)',
              background: 'rgba(255,255,255,0.05)', padding: '3px 10px',
              borderRadius: '4px', border: '1px solid var(--panel-border)',
            }}>
              {problemLanguage === 'sql' ? 'SQL' : language.toUpperCase()}
            </span>
          )}

          <div style={{ flex: 1 }} />
          
          <button
            onClick={() => {
              if (editorRef.current) {
                editorRef.current.getAction('editor.action.formatDocument').run();
              }
            }}
            style={{
              background: 'transparent', color: 'var(--text-2)', border: '1px solid var(--panel-border)',
              padding: '0.45rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500
            }}
            title="Auto format code (Shift+Alt+F)"
          >
            <AlignLeft size={14} /> Format
          </button>

          <button
            onClick={handleExplainCode}
            disabled={isExplaining || !code.trim() || problemLanguage === 'sql'}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.45rem 1rem', borderRadius: '6px',
              background: 'rgba(168,85,247,0.2)', color: '#d8b4fe', border: '1px solid #a855f7', cursor: isExplaining ? 'default' : 'pointer',
              fontWeight: 600, fontSize: '0.85rem', opacity: (!code.trim() || problemLanguage === 'sql') ? 0.5 : 1
            }}
          >
            {isExplaining ? <span className="loader" style={{width: 12, height: 12, borderWidth: 2, borderColor: '#d8b4fe', borderTopColor: 'transparent'}} /> : <Wand2 size={13} />}
            Explain
          </button>

          <button
            onClick={handleVisualize}
            disabled={isVisualizing || !code.trim() || problemLanguage === 'sql'}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.45rem 1rem', borderRadius: '6px',
              background: 'rgba(59,130,246,0.2)', color: '#93c5fd', border: '1px solid #3b82f6', cursor: isVisualizing ? 'default' : 'pointer',
              fontWeight: 600, fontSize: '0.85rem', opacity: (!code.trim() || problemLanguage === 'sql') ? 0.5 : 1
            }}
          >
            {isVisualizing ? <span className="loader" style={{width: 12, height: 12, borderWidth: 2, borderColor: '#93c5fd', borderTopColor: 'transparent'}} /> : <Network size={13} />}
            Flowchart
          </button>

          {totalCount > 0 && (
            <span style={{
              fontSize: '0.85rem', fontWeight: 600,
              color: allPassed ? '#22c55e' : '#ef4444',
            }}>
              {passCount}/{totalCount} passed
            </span>
          )}

          <button
            onClick={runCode}
            disabled={isRunning || !code.trim()}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.45rem 1rem', borderRadius: '6px',
              background: isRunning ? 'rgba(168,85,247,0.2)' : '#a855f7',
              color: 'white', border: 'none', cursor: isRunning ? 'default' : 'pointer',
              fontWeight: 600, fontSize: '0.85rem', opacity: (!code.trim()) ? 0.5 : 1,
            }}
          >
            {isRunning ? <span className="loader" style={{ width: '12px', height: '12px', borderWidth: '2px' }} /> : <Play size={13} />}
            {isRunning ? 'Running…' : problemLanguage === 'sql' ? 'Check SQL' : 'Run Tests'}
          </button>

          <button
            onClick={handleSubmitForReview}
            disabled={isSubmitting || !code.trim()}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.45rem 1rem', borderRadius: '6px',
              background: 'rgba(34,197,94,0.1)',
              color: '#22c55e', border: '1px solid #22c55e', cursor: isSubmitting ? 'default' : 'pointer',
              fontWeight: 600, fontSize: '0.85rem', opacity: (!code.trim()) ? 0.5 : 1,
            }}
            title="Send your code to an admin for verification"
          >
            {isSubmitting ? <span className="loader" style={{ width: '12px', height: '12px', borderWidth: '2px', borderColor: '#22c55e' }} /> : <ExternalLink size={13} />}
            {isSubmitting ? 'Submitting…' : 'Submit for Review'}
          </button>
        </div>

        {/* Monaco Editor */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Editor
            height="100%"
            language={monacoLang}
            value={code}
            onChange={val => setCode(val || '')}
            onMount={e => { editorRef.current = e; }}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'off',
              tabSize: 4,
              automaticLayout: true,
            }}
          />
        </div>

        {/* Output Tabs Content */}
        {outputTab === 'execute' && (testResults.length > 0 || rawOutput || runError || isAnalyzingComplexity) && (
          <div style={{
            flexShrink: 0, maxHeight: '220px', overflowY: 'auto',
            borderTop: '1px solid var(--panel-border)',
            background: 'var(--panel-bg)',
          }}>
            {(complexity || isAnalyzingComplexity) && (
              <div style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--panel-border)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-3)' }}>Complexity</span>
                {isAnalyzingComplexity ? (
                  <span style={{ fontSize: '0.75rem', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span className="loader" style={{width: 10, height: 10, borderWidth: 2, borderColor: 'rgba(168,85,247,0.3)', borderTopColor: '#a855f7'}}/> Computing...</span>
                ) : complexity ? (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(59,130,246,0.15)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.3)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>⏱️ Time: {complexity.time}</span>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>💾 Space: {complexity.space}</span>
                  </div>
                ) : null}
              </div>
            )}
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

            <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--panel-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(0,0,0,0.2)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-3)' }}>Custom Input (stdin)</span>
              <textarea 
                value={customInput} 
                onChange={e => setCustomInput(e.target.value)} 
                placeholder="Enter custom input here..."
                style={{ 
                  background: 'var(--bg-2)', border: '1px solid var(--panel-border)', color: 'var(--text)', 
                  outline: 'none', padding: '0.5rem', borderRadius: '6px', minHeight: '60px', 
                  fontFamily: 'monospace', fontSize: '0.85rem', resize: 'vertical'
                }} 
              />
            </div>
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

             <div style={{ display: 'flex', gap: '0.5rem', padding: '0.4rem 0.75rem', flexWrap: 'wrap', borderTop: '1px solid var(--panel-border)', background: 'var(--panel-bg)' }}>
                <button onClick={() => { setTutorInput('Please review my code for best practices and space/time complexity.'); }} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', cursor: 'pointer', color: 'var(--text-2)', border: '1px solid var(--panel-border)', borderRadius: '4px', padding: '3px 8px' }}>Code Review</button>
                <button onClick={() => { setTutorInput('Give me a progressive hint on how to solve this without giving the code.'); }} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', cursor: 'pointer', color: 'var(--text-2)', border: '1px solid var(--panel-border)', borderRadius: '4px', padding: '3px 8px' }}>Get a Hint</button>
                <button onClick={() => { setTutorInput('Generate 3 edge cases for this problem that I could test my logic against.'); }} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', cursor: 'pointer', color: 'var(--text-2)', border: '1px solid var(--panel-border)', borderRadius: '4px', padding: '3px 8px' }}>Test Cases</button>
             </div>
             <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', borderTop: '1px solid var(--panel-border)', background: 'rgba(0,0,0,0.1)' }}>
                <input type="text" value={tutorInput} onChange={e => setTutorInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAskTutor()} placeholder="Ask a question..." style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--panel-border)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none', fontSize: '0.8rem' }} />
                <button onClick={handleAskTutor} disabled={isAskingTutor || !tutorInput.trim()} style={{ padding: '0 1rem', borderRadius: '4px', background: '#a855f7', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize:'0.8rem', opacity: (isAskingTutor || !tutorInput.trim()) ? 0.6 : 1 }}>
                  {isAskingTutor ? '...' : 'Ask'}
                </button>
             </div>
           </div>
        )}
      </div>
    </Split>
  );
}
