import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Code2, Terminal, ChevronDown, CheckCircle2, AlertCircle, RefreshCw, LogOut, Save, Github, X, User, BookOpen, Wand2, Square, FolderOpen, Share2, MonitorPlay, Network } from 'lucide-react';
import axios from 'axios';
import { supabase } from './supabaseClient';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Login from './Login';
import Explore from './Explore';
import SavedSnippets from './SavedSnippets';
import WebPlayground from './WebPlayground';

const getIconUrlSafe = (id) => {
   const map = {
      cpp: 'cplusplus',
      csharp: 'csharp',
      sql: 'sqldeveloper',
      r: 'r',
      go: 'go',
      ruby: 'ruby'
   };
   const iconId = map[id] || id;
   return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${iconId}/${iconId}-original.svg`;
};

const generateAIContent = async (apiKey, prompt) => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const models = ["gemini-2.5-flash-preview-04-17", "gemini-2.0-flash", "gemini-1.5-flash"];
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

const checkNeedsInput = (code, langId) => {
  if (!code) return false;
  const text = code.toLowerCase();
  switch (langId) {
    case 'python': return text.includes('input(') || text.includes('sys.stdin');
    case 'java': return text.includes('scanner') || text.includes('system.in') || text.includes('bufferedreader');
    case 'cpp': return text.includes('cin') || text.includes('getline(');
    case 'c': return text.includes('scanf(') || text.includes('fgets(') || text.includes('getchar(');
    case 'javascript': return text.includes('prompt(') || text.includes('readline');
    default: return false;
  }
};

const ALL_LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', monaco: 'javascript', wandbox: 'JavaScript', snippet: `console.log("Hello, Web-Based Code Compiler!");\n\n// Write your JavaScript code here\nfunction calculateFactorial(initialNumber) {\n  let result = 1;\n  for(let i = 2; i <= initialNumber; i++) {\n    result *= i;\n  }\n  return result;\n}\n\nconsole.log(calculateFactorial(5));\n` },
  { id: 'python', name: 'Python', monaco: 'python', wandbox: 'Python', snippet: `print("Hello, Web-Based Code Compiler!")\n\n# Write your Python code here\ndef generate_fibonacci(n):\n    sequence = [0, 1]\n    while len(sequence) < n:\n        sequence.append(sequence[-1] + sequence[-2])\n    return sequence\n\nprint(generate_fibonacci(10))\n` },
  { id: 'java', name: 'Java', monaco: 'java', wandbox: 'Java', snippet: `class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Web-Based Code Compiler!");\n    }\n}\n` },
  { id: 'cpp', name: 'C++', monaco: 'cpp', wandbox: 'C++', snippet: `#include <iostream>\n\nusing namespace std;\n\nint main() {\n    cout << "Hello, Web-Based Code Compiler!" << endl;\n    return 0;\n}\n` },
  { id: 'c', name: 'C', monaco: 'c', wandbox: 'C', snippet: `#include <stdio.h>\n\nint main() {\n    printf("Hello, Web-Based Code Compiler!\\n");\n    return 0;\n}\n` },
  { id: 'csharp', name: 'C#', monaco: 'csharp', wandbox: 'C#', snippet: `using System;\n\nclass MainClass {\n    public static void Main (string[] args) {\n        Console.WriteLine ("Hello, Web-Based Code Compiler!");\n    }\n}\n` },
  { id: 'go', name: 'Go', monaco: 'go', wandbox: 'Go', snippet: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, Web-Based Code Compiler!")\n}\n` },
  { id: 'rust', name: 'Rust', monaco: 'rust', wandbox: 'Rust', snippet: `fn main() {\n    println!("Hello, Web-Based Code Compiler!");\n}\n` },
  { id: 'ruby', name: 'Ruby', monaco: 'ruby', wandbox: 'Ruby', snippet: `puts "Hello, Web-Based Code Compiler!"\n` },
  { id: 'typescript', name: 'TypeScript', monaco: 'typescript', wandbox: 'TypeScript', snippet: `const message: string = "Hello, Web-Based Code Compiler!";\nconsole.log(message);\n` },
  { id: 'php', name: 'PHP', monaco: 'php', wandbox: 'PHP', snippet: `<?php\n    echo "Hello, Web-Based Code Compiler!";\n?>\n` },

  { id: 'scala', name: 'Scala', monaco: 'scala', wandbox: 'Scala', snippet: `object Main {\n  def main(args: Array[String]): Unit = {\n    println("Hello, Web-Based Code Compiler!")\n  }\n}\n` },
  { id: 'nim', name: 'Nim', monaco: 'plaintext', wandbox: 'Nim', snippet: `echo "Hello, Web-Based Code Compiler!"\n` },
  { id: 'r', name: 'R', monaco: 'r', wandbox: 'R', snippet: `print("Hello, Web-Based Code Compiler!")\n` },
  { id: 'julia', name: 'Julia', monaco: 'julia', wandbox: 'Julia', snippet: `println("Hello, Web-Based Code Compiler!")\n` },
  { id: 'bash', name: 'Bash', monaco: 'shell', wandbox: 'Bash script', snippet: `echo "Hello, Web-Based Code Compiler!"\n` },
  { id: 'sql', name: 'SQL', monaco: 'sql', wandbox: 'SQL', snippet: `-- You can write SQLite queries here\nCREATE TABLE test (id INTEGER, name TEXT);\nINSERT INTO test VALUES (1, 'Hello, Web-Based Code Compiler!');\nSELECT * FROM test;\n` },
  { id: 'lua', name: 'Lua', monaco: 'lua', wandbox: 'Lua', snippet: `print("Hello, Web-Based Code Compiler!")\n` },
  { id: 'perl', name: 'Perl', monaco: 'perl', wandbox: 'Perl', snippet: `print "Hello, Web-Based Code Compiler!\\n";\n` },
  { id: 'haskell', name: 'Haskell', monaco: 'plaintext', wandbox: 'Haskell', snippet: `main :: IO ()\nmain = putStrLn "Hello, Web-Based Code Compiler!"\n` },
  { id: 'elixir', name: 'Elixir', monaco: 'plaintext', wandbox: 'Elixir', snippet: `IO.puts "Hello, Web-Based Code Compiler!"\n` },
  { id: 'd', name: 'D', monaco: 'plaintext', wandbox: 'D', snippet: `import std.stdio;\n\nvoid main()\n{\n    writeln("Hello, Web-Based Code Compiler!");\n}\n` },
  { id: 'groovy', name: 'Groovy', monaco: 'plaintext', wandbox: 'Groovy', snippet: `println "Hello, Web-Based Code Compiler!"\n` },
  { id: 'zig', name: 'Zig', monaco: 'plaintext', wandbox: 'Zig', snippet: `const std = @import("std");\n\npub fn main() !void {\n    const stdout = std.io.getStdOut().writer();\n    try stdout.print("Hello, Web-Based Code Compiler!\\n", .{});\n}\n` },
  { id: 'pascal', name: 'Pascal', monaco: 'pascal', wandbox: 'Pascal', snippet: `program Hello;\nbegin\n  writeln ('Hello, Web-Based Code Compiler!');\nend.\n` },
  { id: 'lisp', name: 'Lisp', monaco: 'plaintext', wandbox: 'Lisp', snippet: `(print "Hello, Web-Based Code Compiler!")\n` }
];

const SNIPPETS = ALL_LANGUAGES.reduce((acc, lang) => {
  acc[lang.id] = lang.snippet;
  return acc;
}, {});

const LANGUAGES = ALL_LANGUAGES.map(({ id, name, monaco }) => ({ id, name, monaco }));

const FALLBACK_COMPILERS = {
  javascript: 'nodejs-head',
  python:     'cpython-3.14.0',
  java:       'openjdk-head',
  cpp:        'gcc-head',
  c:          'gcc-head-c',
  csharp:     'mono-head',
  go:         'go-head',
  rust:       'rust-head',
  ruby:       'ruby-head',
  typescript: 'typescript-5.6.3',
  php:        'php-head',
  scala:      'scala-3.3.4',
  nim:        'nim-head',
  r:          'r-head',
  julia:      'julia-head',
  bash:       'bash',
  sql:        'sqlite-head',
  lua:        'lua-head',
  perl:       'perl-head',
  haskell:    'ghc-head',
  elixir:     'elixir-head',
  d:          'dmd-head',
  groovy:     'groovy-head',
  zig:        'zig-head',
  pascal:     'fpc-head',
  lisp:       'sbcl-head',
};

function App() {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(SNIPPETS.javascript);
  const [output, setOutput] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [compilerIds, setCompilerIds] = useState({});
  const [user, setUser] = useState(null);
  const [view, setView] = useState('editor');
  const [toast, setToast] = useState(null);
  const [outputTab, setOutputTab] = useState('execute');
  const [userInput, setUserInput] = useState('');
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

  const [initialWebCode, setInitialWebCode] = useState(null);

  const editorRef = useRef(null);
  const decorationsRef = useRef([]);
  const abortSpeech = useRef(false);

  useEffect(() => {
    // Check URL for shared code
    const params = new URLSearchParams(window.location.search);
    const sharedParam = params.get('s');
    if (sharedParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(sharedParam)));
        if (decoded.lang && decoded.code) {
          setLanguage(decoded.lang);
          setCode(decoded.code);
          setToast({ message: "Loaded shared snippet!", type: 'success' });
          setTimeout(() => setToast(null), 3000);
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {
         console.warn("Failed to parse shared snippet data", e);
      }
    }

    // Verify Supabase Connection
    console.log("Supabase Client Loaded:", supabase);

    // Track authentication state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Dynamically fetch Wandbox compiler versions
    axios.get('https://wandbox.org/api/list.json')
      .then(res => {
         const mapping = {};
         res.data.forEach(c => {
           if (!mapping[c.language]) mapping[c.language] = [];
           mapping[c.language].push(c.name);
         });
         
         // Always favor the latest/head compilers
         const ids = {};
         ALL_LANGUAGES.forEach(lang => {
           const compilers = mapping[lang.wandbox] || [];
           // Prefer stable compilers over 'head' or 'pypy' versions
           const stableCompiler = compilers.find(c => !c.includes('head') && !c.includes('pypy')) || compilers[0];
           ids[lang.id] = stableCompiler;
         });
         
         // Explicit overrides for known broken versions
         if (mapping['Scala'] && mapping['Scala'].includes('scala-3.3.4')) {
           ids.scala = 'scala-3.3.4';
         }
         
         // Fallbacks for all languages
         ALL_LANGUAGES.forEach(lang => {
           if (!ids[lang.id]) ids[lang.id] = FALLBACK_COMPILERS[lang.id];
         });

         setCompilerIds(ids);
      }).catch(err => {
         console.error("Failed to load generic compilers", err);
      });

      return () => subscription.unsubscribe();
  }, []);

  const handleLanguageChange = (langId) => {
    setLanguage(langId);
    setCode(SNIPPETS[langId]);
    setOutput('');
  };

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleShare = () => {
    try {
      const shareData = JSON.stringify({ lang: language, code: code });
      const encoded = btoa(encodeURIComponent(shareData));
      const url = `${window.location.origin}${window.location.pathname}?s=${encoded}`;
      navigator.clipboard.writeText(url);
      setToast({ message: "Shareable link copied to clipboard!", type: 'success' });
      setTimeout(() => setToast(null), 3000);
    } catch(e) {
      setToast({ message: "Error generating link", type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const executeCode = async () => {
    if (!code.trim()) return;
    
    setIsLoading(true);
    setOutput('');
    setIsError(false);
    
    try {
      const compiler = compilerIds[language] || FALLBACK_COMPILERS[language];
      
      setOutputTab('execute');

      const response = await axios.post('https://wandbox.org/api/compile.json', {
        compiler: compiler,
        code: code,
        stdin: userInput,
        save: false
      });
      
      const { status, program_output, program_error, compiler_error } = response.data;

      const STDIN_ERROR_PATTERNS = [
        /EOFError/i,
        /EOF when reading/i,
        /end of file/i,
        /NoSuchElementException/i,
        /java\.util\.NoSuchElementException/i,
        /Scanner.*No line found/i,
      ];

      const isStdinError = (text) =>
        text && STDIN_ERROR_PATTERNS.some(p => p.test(text));

      if (status !== '0') {
        const errText = compiler_error || program_error || 'Execution failed';
        setIsError(true);
        setOutput(errText);
        if (isStdinError(errText) && !userInput.trim()) {
          setOutputTab('input');
          showToast('Your code needs input — enter values in the Input tab, then run again.', 'error');
        }
      } else {
        const fullOutput = [];
        if (compiler_error) fullOutput.push(compiler_error);
        if (program_error) fullOutput.push(program_error);
        if (program_output) fullOutput.push(program_output);
        setOutput(fullOutput.join('\n').trim() || 'Execution successful with no output.');
      }
    } catch (error) {
      setIsError(true);
      setOutput(error.message || 'Network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearOutput = () => {
    setOutput('');
    setIsError(false);
  };

  const handleLogin = async (provider) => {
    await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveSnippet = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('snippets')
        .insert([{
          user_id: user.id,
          title: `My ${LANGUAGES.find(l => l.id === language).name} Snippet`,
          language: language,
          code: code,
          output: output || null
        }]);
      if (error) throw error;
      showToast('Snippet saved!');
    } catch(err) {
      showToast('Error: ' + err.message, 'error');
    }
  };

  const handleOpenInEditor = (lang, code) => {
    if (lang === 'web') {
      try {
        setInitialWebCode(JSON.parse(code));
      } catch (e) {
        setInitialWebCode(null);
      }
      setView('web');
      return;
    }
    setLanguage(lang);
    setCode(code);
    setOutput('');
    setUserInput('');
    setIsError(false);
    setView('editor');
  };

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
      const prompt = `You are a world-class AI coding tutor. You MUST strictly return a valid JSON array of step-by-step tutorial explanation objects for the provided code.
Each object must perfectly match this structure:
{
  "line": 4, // The most relevant line number in the user's code for this step. Use null if general.
  "color": "#3b82f6", // A distinct vivid bright HEX color representing this step (use different colors like purple, green, yellow, pink, blue).
  "uiText": "🔷 1. Structure of Node\\nEach node has 3 parts:\\n👉 data...", // Beautifully formatted text with emojis, headings, bullet points, and newlines.
  "spokenText": "Step 1. Structure of Node. Each node has 3 parts, data, next, and previous." // A completely clean transcript. Do NOT include ANY syntax characters (no asterisks, slashes, brackets, parenthesis, or emojis) so the TTS engine speaks smoothly.
}
Do NOT wrap your response in markdown code blocks. Respond purely with a valid JSON array.
Translate both text fields to ${tutorConfigLang === 'hi-IN' ? 'Hindi (Devanagari script)' : 'English'}.

Code:
-----
${code}`;
      
      let rawText = await generateAIContent(import.meta.env.VITE_GEMINI_API_KEY, prompt);
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
    if (!apiKey) {
      setToast({ message: "Please add VITE_GEMINI_API_KEY to your .env file.", type: "error" });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    const question = tutorInput;
    setTutorInput('');
    setTutorChat(prev => [...prev, { role: 'user', content: question }]);
    setIsAskingTutor(true);

    try {
      const prompt = `You are a helpful AI coding tutor. The user is asking a question about this code:\n\n${code}\n\nQuestion: ${question}\n\nProvide a concise and helpful answer without emojis. Keep it brief. Respond entirely in ${tutorConfigLang === 'hi-IN' ? 'Hindi (in Devanagari script)' : 'English'}.`;
      
      const text = await generateAIContent(apiKey, prompt);
      
      setTutorChat(prev => [...prev, { role: 'ai', content: text }]);
      setOutputTab('explain');
    } catch (err) {
       console.error(err);
      setTutorChat(prev => [...prev, { role: 'ai', content: "Error: I couldn't reach my brain. Please check your network." }]);
    } finally {
      setIsAskingTutor(false);
    }
  };

  const handleVisualize = async () => {
    if (isVisualizing || !code.trim()) return;
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setToast({ message: "Please add VITE_GEMINI_API_KEY to your .env file.", type: "error" });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setIsVisualizing(true);
    setMermaidCode('');
    setOutputTab('visualize');

    try {
      const prompt = `You are a helpful AI coding tutor. The user wants a clean 2D flowchart diagram summarizing their code.\n\nAnalyze this code:\n\n${code}\n\nGenerate ONLY a strictly valid Mermaid.js graph chart (like flowchart TD or graph TD) representing the primary data structure, architecture, or algorithm control flow. DO NOT wrap it in markdown blockticks like \`\`\`mermaid. Start directly with the graph declaration.`;
      
      let text = await generateAIContent(apiKey, prompt);
      text = text.replace(/```mermaid/gi, '').replace(/```/g, '').trim();
      
      setMermaidCode(text);
    } catch (err) {
      setToast({ message: "Failed to generate diagram.", type: "error" });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setIsVisualizing(false);
    }
  };

  const currentLang = ALL_LANGUAGES.find(l => l.id === language);

  return (
    <div className="app-container">

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success'
            ? <CheckCircle2 size={15} />
            : <AlertCircle size={15} />}
          <span>{toast.message}</span>
        </div>
      )}

      {view === 'login' && !user ? (
        <Login onBack={() => setView('editor')} />
      ) : (
        <>
          <header className="header">
            <div className="header-left">
              <div className="header-logo">
                <div className="logo-mark" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/logo.png" alt="CodeZ Logo" style={{ width: '44px', height: '44px', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(168, 85, 247, 0.5))' }} />
                </div>
                <span className="logo-text">CodeZ</span>
              </div>
              <nav className="header-nav">
                <button
                  className={`nav-tab ${view === 'editor' ? 'active' : ''}`}
                  onClick={() => setView('editor')}
                >
                  <Terminal size={13} /> Editor
                </button>
                <button
                  className={`nav-tab ${view === 'explore' ? 'active' : ''}`}
                  onClick={() => setView('explore')}
                >
                  <BookOpen size={13} /> Explore
                </button>
                <button
                  className={`nav-tab ${view === 'web' ? 'active' : ''}`}
                  onClick={() => setView('web')}
                >
                  <MonitorPlay size={13} /> Web Dev
                </button>
              </nav>
            </div>

            <div className="header-right">
              {view === 'editor' && (
                <>
                  <div className="select-wrapper">
                    <select value={language} onChange={(e) => handleLanguageChange(e.target.value)} className="language-select">
                      {ALL_LANGUAGES.map(lang => (
                        <option key={lang.id} value={lang.id}>{lang.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="select-icon" />
                  </div>
                  <button 
                    className="btn-run" 
                    style={{ background: '#a855f7' }}
                    onClick={handleExplainCode} 
                    disabled={isExplaining || !code.trim() || isLoading}
                  >
                    {isExplaining ? <span className="loader" /> : <Wand2 size={15} />}
                    <span>{isExplaining ? 'Thinking…' : 'Explain'}</span>
                  </button>
                  <button className="btn-run" onClick={executeCode} disabled={isLoading || !code.trim() || isExplaining}>
                    {isLoading ? <span className="loader" /> : <Play size={15} />}
                    <span>{isLoading ? 'Running…' : 'Run'}</span>
                  </button>
                  <button className="icon-btn" onClick={handleShare} title="Share code via link" style={{ marginLeft: '4px' }}>
                    <Share2 size={16} />
                  </button>
                  <div className="header-sep" />
                </>
              )}

              {user ? (
                <div className="user-pill">
                  <div className="user-avatar" style={{ overflow: 'hidden' }}>
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      (user.email?.[0] ?? 'U').toUpperCase()
                    )}
                  </div>
                  <span className="user-name" style={{ display: 'flex', alignItems: 'center' }}>
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    {user.app_metadata?.provider === 'github' && <Github size={14} style={{marginLeft: '0.4rem', opacity: 0.8, color: '#f8fafc'}} title="Logged in via GitHub" />}
                    {user.app_metadata?.provider === 'google' && <span style={{ fontSize: '9px', background: '#ea4335', color: 'white', padding: '2px 5px', borderRadius: '4px', marginLeft: '0.5rem', fontWeight: 700, letterSpacing: '0.5px' }} title="Logged in via Google">GOOGLE</span>}
                  </span>
                  <button className="icon-btn" onClick={handleSaveSnippet} title="Save snippet">
                    <Save size={15} />
                  </button>
                  <button className="icon-btn" onClick={() => setView('snippets')} title="My Snippets">
                    <FolderOpen size={15} />
                  </button>
                  <button className="icon-btn" onClick={handleLogout} title="Sign out">
                    <LogOut size={15} />
                  </button>
                </div>
              ) : (
                <button className="btn-signin" onClick={() => setView('login')}>
                  <User size={15} /> Sign In
                </button>
              )}
            </div>
          </header>

          {view === 'explore' ? (
            <Explore onOpenInEditor={handleOpenInEditor} />
          ) : view === 'snippets' ? (
            <SavedSnippets onBack={() => setView('editor')} onOpenInEditor={handleOpenInEditor} user={user} supabase={supabase} />
          ) : view === 'web' ? (
            <WebPlayground user={user} supabase={supabase} setToast={setToast} initialWebCode={initialWebCode} />
          ) : (
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              <aside className="language-sidebar">
                {ALL_LANGUAGES.map(lang => (
                  <button 
                    key={lang.id}
                    title={lang.name}
                    className={`lang-icon-btn ${language === lang.id ? 'active' : ''}`} 
                    onClick={() => handleLanguageChange(lang.id)}
                  >
                     <img 
                       src={getIconUrlSafe(lang.id)} 
                       alt={lang.name} 
                       style={['rust', 'bash'].includes(lang.id) ? { filter: 'invert(1) brightness(2)' } : {}}
                       onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} 
                     />
                     <div style={{ display: 'none', fontWeight: 'bold', fontSize: '0.65rem', textTransform: 'uppercase', color: '#f8fafc', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                        {lang.name.slice(0, 3)}
                     </div>
                  </button>
                ))}
              </aside>
              <main className="main-content">
                <section className="editor-section">
                  <div className="panel-header">
                    <div className="panel-header-left">
                      <span className="panel-header-title">Editor</span>
                      <span className="lang-badge">{currentLang?.name}</span>
                    </div>
                  </div>
                <div className="editor-wrapper">
                  <Editor
                    height="100%"
                    language={currentLang?.monaco}
                    theme="vs-dark"
                    value={code}
                    onChange={handleEditorChange}
                    onMount={(editor) => { editorRef.current = editor; }}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 15,
                      fontFamily: 'Fira Code, monospace',
                      lineHeight: 1.6,
                      padding: { top: 16 },
                      scrollBeyondLastLine: false,
                      smoothScrolling: true,
                      cursorBlinking: 'smooth',
                      cursorSmoothCaretAnimation: true,
                    }}
                  />
                </div>
              </section>

              <section className={`output-section ${outputTab === 'execute' && output ? (isError ? 'state-error' : 'state-success') : ''}`}>
                <div className="panel-header" style={{ display: 'flex', padding: 0, justifyContent: 'space-between', borderBottom: '1px solid var(--panel-border)' }}>
                  <div style={{ display: 'flex' }}>
                    <button 
                      className={`tab-btn ${outputTab === 'execute' ? 'active' : ''}`}
                      onClick={() => setOutputTab('execute')}
                    >
                      <Terminal size={14} /> Execution
                    </button>
                    <button 
                      className={`tab-btn ${outputTab === 'explain' ? 'active' : ''}`}
                      onClick={() => setOutputTab('explain')}
                    >
                      <Wand2 size={14} /> AI Tutor
                    </button>
                    <button 
                      className={`tab-btn ${outputTab === 'visualize' ? 'active' : ''}`}
                      onClick={() => setOutputTab('visualize')}
                    >
                      <Network size={14} /> Visualizer
                    </button>
                  </div>
                  
                  <div className="panel-actions" style={{ paddingRight: '1.25rem', gap: '0.8rem', display: 'flex', alignItems: 'center' }}>
                    {outputTab === 'explain' && (
                       <select 
                         value={tutorConfigLang} 
                         onChange={(e) => setTutorConfigLang(e.target.value)}
                         style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', padding: '0.2rem 0.5rem', fontSize: '0.75rem', outline: 'none', cursor: 'pointer', fontWeight: 600 }}
                       >
                         <option value="en-US" style={{ color: 'black' }}>English</option>
                         <option value="hi-IN" style={{ color: 'black' }}>Hindi</option>
                       </select>
                    )}
                    {outputTab === 'execute' ? (
                      <button className="icon-btn" onClick={handleClearOutput} title="Clear output">
                        <RefreshCw size={14} />
                      </button>
                    ) : (
                      isSpeaking && (
                        <button className="icon-btn" onClick={stopSpeaking} title="Stop Speaking" style={{ color: '#ef4444' }}>
                          <Square size={14} fill="currentColor" />
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="output-body" style={{ flex: 1, padding: outputTab === 'explain' ? 0 : '1.25rem', overflowY: outputTab === 'explain' ? 'hidden' : 'auto', display: 'flex', flexDirection: 'column', gap: outputTab === 'explain' ? 0 : '1.5rem' }}>
                  {outputTab === 'execute' ? (
                    <>
                      {(checkNeedsInput(code, language) || userInput.trim() !== '') && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
                          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>Standard Input (stdin)</span>
                          <textarea 
                             value={userInput} 
                             onChange={(e) => setUserInput(e.target.value)} 
                             placeholder="Type inputs here since your code needs them..."
                             spellCheck={false}
                             style={{ 
                               background: 'rgba(0,0,0,0.15)',
                               border: '1px solid var(--panel-border)',
                               borderRadius: '6px',
                               minHeight: '60px',
                               maxHeight: '150px',
                               color: 'var(--text-main)', 
                               resize: 'vertical', 
                               outline: 'none', 
                               fontFamily: 'var(--font-mono)', 
                               fontSize: '0.85rem',
                               padding: '0.75rem'
                             }}
                          />
                        </div>
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                           <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>Execution Output</span>
                        </div>
                        {output ? (
                          <div className={`output-content ${isError ? 'error' : ''}`} style={{ padding: 0 }}>
                            <div style={{ marginBottom: '0.8rem', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8 }}>
                              {isError ? <AlertCircle size={12} color="#ef4444" /> : <CheckCircle2 size={12} color="#10b981" />} 
                              <span style={{ color: isError ? '#ef4444' : '#10b981'}}>{isError ? 'Error Detected' : 'Output Success'}</span>
                            </div>
                            {output}
                          </div>
                        ) : (
                          <div className="output-placeholder">
                            <Terminal size={40} opacity={0.15} />
                            <p>Run your code to see output</p>
                          </div>
                        )}
                      </div>
                    </>
                  ) : outputTab === 'visualize' ? (
                     <div style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1 }}>
                       {isVisualizing ? (
                          <div className="output-placeholder">
                            <span className="loader" style={{ borderColor: 'rgba(59,130,246, 0.3)', borderTopColor: '#3b82f6' }}></span>
                            <p>Analyzing architecture & generating flowchart...</p>
                          </div>
                       ) : mermaidCode ? (
                          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#0f172a', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                             <button 
                               onClick={handleVisualize} 
                               disabled={isVisualizing || !code.trim()}
                               style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10, padding: '0.5rem 1rem', background: 'rgba(59,130,246,0.2)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', backdropFilter: 'blur(4px)' }}
                             >
                               <RefreshCw size={14} /> Regenerate
                             </button>
                             <iframe 
                               srcDoc={`
                                 <html>
                                 <head>
                                   <script type="module">
                                     import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
                                     mermaid.initialize({ startOnLoad: true, theme: 'dark' });
                                   </script>
                                   <style>
                                     body { display: flex; justify-content: center; align-items: flex-start; min-height: 100vh; margin: 0; padding: 2rem; background: #0f172a; color: white; overflow: auto; }
                                     .mermaid-wrapper {
                                       width: 100%;
                                       display: flex;
                                       justify-content: center;
                                     }
                                     .mermaid {
                                       background: rgba(30,41,59,0.7);
                                       padding: 2rem;
                                       border-radius: 12px;
                                       border: 1px solid rgba(255,255,255,0.1);
                                     }
                                   </style>
                                 </head>
                                 <body>
                                   <div class="mermaid-wrapper">
                                     <div class="mermaid">${mermaidCode}</div>
                                   </div>
                                 </body>
                                 </html>
                               `}
                               style={{ width: '100%', height: '100%', border: 'none' }}
                               sandbox="allow-scripts"
                             />
                          </div>
                       ) : (
                          <div className="output-placeholder">
                            <Network size={40} opacity={0.15} />
                            <p>Generate a flowchart summarizing your code's architecture, flow, or data structure.</p>
                            <button onClick={handleVisualize} disabled={isVisualizing || !code.trim()} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                              Generate Flowchart
                            </button>
                          </div>
                       )}
                     </div>
                  ) : outputTab === 'explain' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}>
                      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
                        {tutorSteps.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {tutorSteps.map((step, idx) => (
                               <div key={idx} className="output-content" style={{ 
                                 padding: '1.25rem', 
                                 lineHeight: '1.9', 
                                 fontSize: '0.95rem',
                                 whiteSpace: 'pre-wrap', 
                                 color: '#f8fafc',
                                 background: `linear-gradient(to right, ${step.color || '#a855f7'}15, transparent)`,
                                 borderLeft: `4px solid ${step.color || '#a855f7'}`,
                                 borderRadius: '0 8px 8px 0',
                                 opacity: (activeStepIndex === -1 || activeStepIndex === idx) ? 1 : 0.4,
                                 transform: activeStepIndex === idx ? 'translateX(5px)' : 'translateX(0)',
                                 transition: 'all 0.3s ease',
                               }}>
                                 {step.line && <div style={{ color: step.color || '#c084fc', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Line {step.line}</div>}
                                 <span style={{ color: activeStepIndex === idx ? '#fff' : 'inherit' }}>{step.uiText || step.text}</span>
                               </div>
                            ))}
                          </div>
                        ) : explanation ? (
                          <div className="output-content" style={{ 
                            padding: '1.25rem', 
                            lineHeight: '1.9', 
                            whiteSpace: 'pre-wrap', 
                            fontSize: '1rem', 
                            color: '#f8fafc',
                            background: 'linear-gradient(to right, rgba(168, 85, 247, 0.15), transparent)',
                            borderLeft: '4px solid #a855f7',
                            borderRadius: '0 8px 8px 0',
                            margin: '0.5rem 0'
                          }}>
                            {explanation}
                          </div>
                        ) : isExplaining ? (
                          <div className="output-placeholder">
                            <span className="loader" style={{ borderColor: 'rgba(168, 85, 247, 0.3)', borderTopColor: '#a855f7' }}></span>
                            <p>AI Tutor is analyzing your code...</p>
                          </div>
                        ) : (
                          <div className="output-placeholder">
                            <Wand2 size={40} opacity={0.15} />
                            <p>Click "Explain" to get a walkthrough, or ask a question below!</p>
                          </div>
                        )}

                        {/* Rendering Chat Array Below the Explanation */}
                        {tutorChat.map((msg, i) => (
                           <div key={i} style={{ 
                             margin: '1rem 0', 
                             padding: '1rem', 
                             background: msg.role === 'user' ? 'rgba(59,130,246,0.1)' : 'rgba(168,85,247,0.1)', 
                             borderRadius: '8px', 
                             borderLeft: `4px solid ${msg.role === 'user' ? '#3b82f6' : '#a855f7'}` 
                           }}>
                              <strong style={{ color: msg.role === 'user' ? '#93c5fd' : '#d8b4fe' }}>{msg.role === 'user' ? 'You' : 'AI Tutor'}</strong>
                              <p style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', color: '#f8fafc', fontSize: '0.95rem', lineHeight: 1.5 }}>
                                {msg.content}
                              </p>
                           </div>
                        ))}
                      </div>

                      <div style={{ 
                        display: 'flex', 
                        gap: '0.5rem', 
                        flexShrink: 0, 
                        borderTop: '1px solid var(--panel-border)', 
                        padding: '1rem',
                        background: 'var(--panel-bg)',
                        position: 'sticky',
                        bottom: 0
                      }}>
                        <input 
                          type="text" 
                          value={tutorInput} 
                          onChange={e => setTutorInput(e.target.value)} 
                          onKeyDown={e => e.key === 'Enter' && handleAskTutor()}
                          placeholder="Ask a question about the code or errors..." 
                          style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--panel-border)', background: 'rgba(0,0,0,0.15)', color: 'white', outline: 'none', fontSize: '0.9rem' }} 
                        />
                        <button 
                          onClick={handleAskTutor} 
                          disabled={isAskingTutor || !tutorInput.trim()} 
                          style={{ padding: '0 1.5rem', borderRadius: '6px', background: '#a855f7', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600, opacity: (isAskingTutor || !tutorInput.trim()) ? 0.6 : 1 }}
                        >
                          {isAskingTutor ? 'Thinking...' : 'Ask'}
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </section>
            </main>
           </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
