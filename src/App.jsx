import React, { useState, useEffect, useRef } from 'react';
import Editor, { DiffEditor } from '@monaco-editor/react';
import { initVimMode } from 'monaco-vim';
import { Play, Code2, Terminal, ChevronDown, CheckCircle2, AlertCircle, RefreshCw, LogOut, Save, Github, X, User, BookOpen, Wand2, Square, FolderOpen, Share2, MonitorPlay, Network, Database, Flame, AlignLeft, Settings as SettingsIcon, Download, Wrench, Trophy, Award, Shield, LayoutDashboard, Users } from 'lucide-react';
import Split from 'react-split';
import axios from 'axios';
import { supabase } from './supabaseClient';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Login from './Login';
import Explore from './Explore';
import SavedSnippets from './SavedSnippets';
import WebPlayground from './WebPlayground';
import Leaderboard from './Leaderboard';
import Profile from './Profile';
import Problems from './Problems';
import ProblemDetail from './ProblemDetail';
import AdminPanel from './AdminPanel';
import { ALL_LANGUAGES, SNIPPETS, LANGUAGES, FALLBACK_COMPILERS, DSA_PROBLEMS } from "./problemData";

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


function App() {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(SNIPPETS.javascript);
  const [output, setOutput] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [compilerIds, setCompilerIds] = useState({});
  const [user, setUser] = useState(null);
  const [view, setView] = useState('editor');
  const [activeProblem, setActiveProblem] = useState(null);
  const [problemLanguage, setProblemLanguage] = useState('dsa');
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
  const [streak, setStreak] = useState(0);
  const [complexity, setComplexity] = useState(null);
  const [isAnalyzingComplexity, setIsAnalyzingComplexity] = useState(false);

  // --- NEW FEATURES STATE ---
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editorSettings, setEditorSettings] = useState({
    theme: 'vs-dark',
    fontSize: 15,
    vimMode: false,
    wordWrap: 'off',
    tabSize: 4
  });
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const vimRef = useRef(null);
  const profileMenuRef = useRef(null);
  
  const [diffCode, setDiffCode] = useState(null);
  const [isFixingBug, setIsFixingBug] = useState(false);

  const editorRef = useRef(null);
  const diffEditorRef = useRef(null);
  const inlineProviderRef = useRef(null);

  const analyzeComplexity = async () => {
    setIsAnalyzingComplexity(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) return;
      const prompt = `Analyze this code and return ONLY a valid JSON object in this exact format: {"time": "O(N)", "space": "O(1)"}. Give the time and space complexity in big O notation. No markdown formatting, wait or explanation.\n\nCode:\n${code}`;
      let text = await generateAIContent(apiKey, prompt);
      text = text.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(text);
      if (parsed.time && parsed.space) setComplexity(parsed);
    } catch {
      setComplexity(null);
    } finally {
      setIsAnalyzingComplexity(false);
    }
  };

  const decorationsRef = useRef([]);
  const abortSpeech = useRef(false);

  useEffect(() => {
    // Streak Validation Algorithm
    const lastActive = localStorage.getItem('codezLastActiveDate');
    const currentStreak = parseInt(localStorage.getItem('codezUserStreak') || '0', 10);
    const today = new Date().toDateString();

    if (lastActive !== today) {
      if (lastActive) {
        const lastDate = new Date(lastActive);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastDate.toDateString() === yesterday.toDateString()) {
          localStorage.setItem('codezUserStreak', currentStreak + 1);
          setStreak(currentStreak + 1);
        } else {
          localStorage.setItem('codezUserStreak', 1);
          setStreak(1);
        }
      } else {
        localStorage.setItem('codezUserStreak', 1);
        setStreak(1);
      }
      localStorage.setItem('codezLastActiveDate', today);
    } else {
      const streakVal = currentStreak || 1;
      setStreak(streakVal);
      if (user?.role === 'admin') setView('admin');
    }

    // Check URL for shared code
    const params = new URLSearchParams(window.location.search);
    const shareId = params.get('share');
    const legacyParam = params.get('s');
    if (shareId) {
      supabase.from('shared_snippets').select('lang, code').eq('id', shareId).single()
        .then(({ data, error }) => {
          if (!error && data) {
            setLanguage(data.lang);
            setCode(data.code);
            setToast({ message: "Loaded shared snippet!", type: 'success' });
            setTimeout(() => setToast(null), 3000);
          }
          window.history.replaceState({}, document.title, window.location.pathname);
        });
    } else if (legacyParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(legacyParam)));
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

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (user?.role !== 'admin') {
        setUser(session?.user ?? null);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // If logged in via standard supabase, set role to student by default
        // In a real app, you'd fetch the role from a profiles table
        const updatedUser = { ...session.user, role: session.user.role || 'student' };
        setUser(prev => prev?.role === 'admin' ? prev : updatedUser);
        
        // Auto-switch view based on role for new login
        if (_event === 'SIGNED_IN') {
           setView(updatedUser.role === 'admin' ? 'admin' : 'editor');
        }
      } else {
        setUser(null);
      }
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

      const handleClickOutside = (event) => {
        if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
          setIsProfileMenuOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        subscription.unsubscribe();
        document.removeEventListener('mousedown', handleClickOutside);
      };
  }, []);

  useEffect(() => {
    if (!editorRef.current) return;
    if (editorSettings.vimMode) {
      const statusNode = document.createElement('div');
      vimRef.current = initVimMode(editorRef.current, statusNode);
    } else if (vimRef.current) {
      vimRef.current.dispose();
      vimRef.current = null;
    }
    return () => {
      if (vimRef.current) {
         vimRef.current.dispose();
         vimRef.current = null;
      }
    };
  }, [editorSettings.vimMode, view]);

  const handleFixBug = async () => {
    if (!code.trim() || !output) return;
    setIsFixingBug(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        showToast("Missing VITE_GEMINI_API_KEY", "error");
        return;
      }
      const prompt = `You are an expert debugger. Fix the following code based on its execution error.\n\nCode:\n${code}\n\nError:\n${output}\n\nReturn EXACTLY and ONLY the fixed code without any markdown formatting, backticks, or explanation.`;
      
      let text = await generateAIContent(apiKey, prompt);
      text = text.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
      setDiffCode(text);
      setOutputTab('execute'); // Ensure diff is visible
    } catch (err) {
      showToast("Error generating fix.", "error");
    } finally {
      setIsFixingBug(false);
    }
  };

  const handleLanguageChange = (langId) => {
    setLanguage(langId);
    setCode(SNIPPETS[langId]);
    setOutput('');
  };

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleShare = async () => {
    try {
      const { data, error } = await supabase
        .from('shared_snippets')
        .insert([{ lang: language, code: code }])
        .select('id')
        .single();
      if (error) throw error;
      const url = `${window.location.origin}${window.location.pathname}?share=${data.id}`;
      await navigator.clipboard.writeText(url);
      setToast({ message: "Shareable link copied to clipboard!", type: 'success' });
      setTimeout(() => setToast(null), 3000);
    } catch(e) {
      setToast({ message: "Error generating share link", type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      setToast({ message: "Please login to submit code for review", type: "error" });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('code_submissions')
        .insert([{
          user_id: user.id,
          problem_id: 'playground-code',
          language,
          code,
          status: 'pending',
          submitted_at: new Date().toISOString()
        }]);

      if (error) throw error;
      setToast({ message: "Code submitted for review successfully!", type: "success" });
    } catch (err) {
      setToast({ message: "Failed to submit code: " + err.message, type: "error" });
    } finally {
      setIsLoading(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const executeCode = async () => {
    if (!code.trim()) return;
    
    setIsLoading(true);
    setOutput('');
    setIsError(false);
    setComplexity(null);
    
    if (language !== 'sql' && language !== 'web') {
      analyzeComplexity();
    }
    
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

  let autocompleteTimeout = null;
  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;

    if (inlineProviderRef.current) inlineProviderRef.current.dispose();
    inlineProviderRef.current = monaco.languages.registerInlineCompletionsProvider('*', {
      provideInlineCompletions: async (model, position, context, token) => {
        if (context.triggerKind !== monaco.languages.InlineCompletionTriggerKind.Automatic) {
           return { items: [] };
        }
        
        const lineContent = model.getLineContent(position.lineNumber);
        if (!lineContent.trim()) return { items: [] };

        const prefix = model.getValueInRange({ startLineNumber: 1, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column });
        
        return new Promise(resolve => {
           clearTimeout(autocompleteTimeout);
           autocompleteTimeout = setTimeout(async () => {
              if (token.isCancellationRequested) {
                 resolve({ items: [] });
                 return;
              }
              const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
              if (!apiKey) { resolve({ items: [] }); return; }

              try {
                 const prompt = `You are a code completion AI like GitHub Copilot. Complete the following code snippet. Return ONLY the predicted completion text that follows exactly after the cursor, with no markdown blockticks and no explanations. Start directly with the text to append. Code so far:\n${prefix}`;
                 let text = await generateAIContent(apiKey, prompt);
                 text = text.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
                 
                 resolve({
                   items: [{
                     insertText: text,
                     range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column)
                   }]
                 });
              } catch {
                 resolve({ items: [] });
              }
           }, 1000);
        });
      },
      freeInlineCompletions: () => {}
    });
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
      const prompt = `You are a helpful AI coding tutor. The user wants a clean 2D flowchart diagram summarizing their code.\n\nAnalyze this code:\n\n${code}\n\nGenerate ONLY a strictly valid Mermaid.js graph chart (like flowchart TD or graph TD) representing the primary data structure, architecture, or algorithm control flow. DO NOT wrap it in markdown blockticks like \`\`\`mermaid. Start directly with the graph declaration. IMPORTANT: Use alphanumeric node IDs. Avoid quotes and special characters such as ()[]{} in node text unless strictly necessary, and surround labels with double quotes if they contain spaces. No subgraphs!`;
      
      let text = await generateAIContent(apiKey, prompt);
      text = text.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
      
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
        <Login onBack={() => setView('editor')} onAdminLogin={(admin) => { setUser(admin); setView('admin'); }} />
      ) : (
        <>
          <header className="header">
            <div className="header-left">
              <div className="header-logo">
                <div className="logo-mark" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/logo-white.png" alt="CodeZ Logo" style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '8px', filter: 'drop-shadow(0 2px 6px rgba(168, 85, 247, 0.4))' }} />
                </div>
                <div className="logo-text-wrapper" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                  <span className="logo-text" style={{ fontSize: '1.2rem' }}>CodeZ</span>
                  <span className="logo-subtitle" style={{ fontSize: '0.65rem', color: 'var(--text-3)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Online Code Compiler</span>
                </div>
              </div>
              <nav className="header-nav">
                {user?.role === 'admin' ? (
                  <>
                    <button
                      className={`nav-tab ${view === 'admin' ? 'active' : ''}`}
                      onClick={() => setView('admin')}
                      style={{ color: '#fbbf24', borderBottom: view === 'admin' ? '2px solid #fbbf24' : 'none' }}
                    >
                      <Shield size={13} style={{ color: '#fbbf24' }} /> Admin OS
                    </button>
                    <button
                      className={`nav-tab ${view === 'editor' ? 'active' : ''}`}
                      onClick={() => setView('editor')}
                    >
                      <Code2 size={13} /> Code Editor
                    </button>
                    <button
                      className={`nav-tab ${view === 'problems' ? 'active' : ''}`}
                      onClick={() => setView('problems')}
                    >
                      <Terminal size={13} /> Manage Problems
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={`nav-tab ${view === 'editor' ? 'active' : ''}`}
                      onClick={() => setView('editor')}
                    >
                      <Code2 size={13} /> Editor
                    </button>
                    <button
                      className={`nav-tab ${view === 'problems' ? 'active' : ''}`}
                      onClick={() => setView('problems')}
                    >
                      <Terminal size={13} /> DSA Problems
                    </button>
                    <button
                      className={`nav-tab ${view === 'web' ? 'active' : ''}`}
                      onClick={() => setView('web')}
                    >
                      <MonitorPlay size={13} /> Web Dev
                    </button>
                  </>
                )}
                
                <button
                  className={`nav-tab ${view === 'explore' ? 'active' : ''}`}
                  onClick={() => setView('explore')}
                >
                  <BookOpen size={13} /> Explore
                </button>
                <button
                  className={`nav-tab ${view === 'leaderboard' ? 'active' : ''}`}
                  onClick={() => setView('leaderboard')}
                >
                  <Trophy size={13} /> Leaderboard
                </button>
              </nav>
            </div>

            <div className="header-right">
              {/* Editor tools moved to editor panel header */}

              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.3)', padding: '0.35rem 0.8rem', borderRadius: '20px', color: '#f97316', fontWeight: 'bold', fontSize: '0.85rem', marginRight: '0.5rem', gap: '0.35rem', cursor: 'default', boxShadow: '0 0 10px rgba(249, 115, 22, 0.15)' }} title="Your Current Login Streak!">
                <Flame size={15} style={{ fill: streak > 0 ? '#f97316' : 'transparent', color: '#f97316' }} />
                <span>{streak} Day{streak !== 1 ? 's' : ''}</span>
              </div>

              {user?.role === 'admin' && (
                <button 
                  className="btn-signin" 
                  onClick={() => setView('admin')}
                  style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid #fbbf24', marginRight: '0.5rem' }}
                >
                  <Shield size={14} /> Admin OS
                </button>
              )}
              {user ? (
                <div className="user-pill-container" ref={profileMenuRef}>
                  <div className="user-pill" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} style={{ cursor: 'pointer' }}>
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
                      {user.role === 'admin' && <span style={{ fontSize: '9px', background: '#fbbf24', color: '#000', padding: '2px 5px', borderRadius: '4px', marginLeft: '0.5rem', fontWeight: 800, letterSpacing: '0.5px' }}>ADMIN OS</span>}
                    </span>
                    <ChevronDown size={14} style={{ opacity: 0.6, transform: isProfileMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </div>

                  {isProfileMenuOpen && (
                    <div className="profile-dropdown">
                      <div className="dropdown-header">
                        <span className="dropdown-user-email">{user.email}</span>
                      </div>
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-item" onClick={() => { setView('profile'); setIsProfileMenuOpen(false); }}>
                        <User size={15} /> <span>My Profile</span>
                      </button>
                      <button className="dropdown-item" onClick={() => { setView('certifications'); setIsProfileMenuOpen(false); }}>
                        <Award size={15} /> <span>Certifications</span>
                      </button>
                      <button className="dropdown-item" onClick={() => { setView('snippets'); setIsProfileMenuOpen(false); }}>
                        <FolderOpen size={15} /> <span>My Snippets</span>
                      </button>
                      <button className="dropdown-item" onClick={handleSaveSnippet}>
                        <Save size={15} /> <span>Save current code</span>
                      </button>
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-item logout" onClick={() => { handleLogout(); setIsProfileMenuOpen(false); }}>
                        <LogOut size={15} /> <span>Sign out</span>
                      </button>
                    </div>
                  )}
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
          ) : view === 'problems' ? (
            <Problems onSelectProblem={(prob, lang) => { setActiveProblem(prob); setProblemLanguage(lang); setView('problem'); }} user={user} supabase={supabase} />
          ) : view === 'problem' && activeProblem ? (
            <ProblemDetail problem={activeProblem} problemLanguage={problemLanguage} onBack={() => setView('problems')} user={user} supabase={supabase} />
          ) : view === 'leaderboard' ? (
            <Leaderboard user={user} supabase={supabase} />
          ) : view === 'admin' && user?.role === 'admin' ? (
            <AdminPanel user={user} supabase={supabase} />
          ) : (view === 'profile' || view === 'certifications') ? (
            <Profile user={user} supabase={supabase} />
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
              <Split className="main-content" sizes={[60, 40]} minSize={300} gutterSize={8} snapOffset={30} direction="horizontal" style={{ display: 'flex', flex: 1, overflow: 'hidden', padding: '0.75rem', gap: 0 }}>
                <section className="editor-section" style={{ marginRight: '4px' }}>
                  <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="panel-header-left">
                      <span className="panel-header-title">Editor</span>
                      <span className="lang-badge" style={{ display: 'none' }}>{currentLang?.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div className="select-wrapper" style={{ marginRight: '0.5rem' }}>
                        <select value={language} onChange={(e) => handleLanguageChange(e.target.value)} className="language-select">
                          {ALL_LANGUAGES.map(lang => (
                            <option key={lang.id} value={lang.id}>{lang.name}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="select-icon" />
                      </div>
                      <button
                        className="btn-signin"
                        onClick={() => {
                          if (editorRef.current) {
                            editorRef.current.getAction('editor.action.formatDocument').run();
                          }
                        }}
                        title="Auto format code (Shift+Alt+F)"
                        style={{ padding: '0.38rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem', border: 'none' }}
                      >
                        <AlignLeft size={16} /> Format
                      </button>
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
                      <button 
                        className="btn-run" 
                        style={{ background: '#22c55e' }}
                        onClick={handleSubmitReview} 
                        disabled={isLoading || !code.trim() || !user || isExplaining}
                        title={!user ? "Login to submit for review" : "Submit your code for admin review"}
                      >
                         <CheckCircle2 size={15} />
                         <span>Submit Review</span>
                      </button>
                      <button className="icon-btn" onClick={handleShare} title="Share code via link" style={{ marginLeft: '4px' }}>
                        <Share2 size={16} />
                      </button>
                      <button className="icon-btn" onClick={() => setIsSettingsOpen(true)} title="Settings" style={{ marginLeft: '4px' }}>
                        <SettingsIcon size={16} />
                      </button>
                      <button className="icon-btn" onClick={() => {
                            const blob = new Blob([code], { type: 'text/plain' });
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.download = `script.${currentLang?.id || 'txt'}`;
                            link.click();
                            setToast({ message: "File downloaded!", type: "success" });
                      }} title="Export / Download" style={{ marginLeft: '4px' }}>
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                <div className="editor-wrapper" style={{ display: 'flex', flexDirection: 'column' }}>
                  {diffCode ? (
                    <>
                      <div style={{ padding: '8px', background: 'var(--panel-bg)', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--panel-border)', alignItems: 'center' }}>
                         <span>Review Fix vs Original</span>
                         <div style={{ display: 'flex', gap: '0.5rem' }}>
                           <button onClick={() => setDiffCode(null)} className="btn-close-modal" style={{ padding: '4px 8px', border: '1px solid var(--panel-border)', borderRadius: '4px' }}>Cancel</button>
                           <button onClick={() => { setCode(diffCode); setDiffCode(null); }} className="btn-run">Apply Fix</button>
                         </div>
                      </div>
                      <DiffEditor
                        height="100%"
                        original={code}
                        modified={diffCode}
                        language={currentLang?.monaco}
                        theme={editorSettings.theme}
                        onMount={(editor) => { diffEditorRef.current = editor; }}
                        options={{
                          minimap: { enabled: false },
                          fontSize: editorSettings.fontSize,
                          fontFamily: 'Fira Code, monospace',
                          lineHeight: 1.6,
                          padding: { top: 16 },
                          scrollBeyondLastLine: false,
                          smoothScrolling: true,
                          wordWrap: editorSettings.wordWrap,
                        }}
                      />
                    </>
                  ) : (
                    <Editor
                      height="100%"
                      language={currentLang?.monaco}
                      theme={editorSettings.theme}
                      value={code}
                      onChange={handleEditorChange}
                      onMount={handleEditorMount}
                      options={{
                        minimap: { enabled: false },
                        tabSize: editorSettings.tabSize,
                        fontSize: editorSettings.fontSize,
                        fontFamily: 'Fira Code, monospace',
                        lineHeight: 1.6,
                        padding: { top: 16 },
                        scrollBeyondLastLine: false,
                        smoothScrolling: true,
                        cursorBlinking: 'smooth',
                        cursorSmoothCaretAnimation: true,
                        wordWrap: editorSettings.wordWrap,
                        inlineSuggest: { enabled: true },
                      }}
                    />
                  )}
                  {editorSettings.vimMode && !diffCode && (
                    <div id="vim-status" style={{ height: '26px', background: 'var(--bg-2)', color: 'var(--text)', padding: '0 8px', fontSize: '13px', display: 'flex', alignItems: 'center', borderTop: '1px solid var(--panel-border)' }}></div>
                  )}
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
                    <button 
                      className={`tab-btn ${outputTab === 'mltools' ? 'active' : ''}`}
                      onClick={() => setOutputTab('mltools')}
                      style={outputTab === 'mltools' ? { borderBottom: '2px solid #a855f7' } : {}}
                    >
                      <Database size={14} /> AI Tools
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
                      <>
                        {isError && (
                          <button className="btn-run" onClick={handleFixBug} disabled={isFixingBug} style={{ padding: '0.2rem 0.5rem', background: '#ef4444', color: '#fff', marginRight: '0.5rem' }}>
                              {isFixingBug ? <span className="loader" /> : <Wrench size={14} />}
                              <span>{isFixingBug ? 'Fixing...' : 'Fix My Bug'}</span>
                          </button>
                        )}
                        <button className="icon-btn" onClick={handleClearOutput} title="Clear output">
                          <RefreshCw size={14} />
                        </button>
                      </>
                    ) : (
                      isSpeaking && (
                        <button className="icon-btn" onClick={stopSpeaking} title="Stop Speaking" style={{ color: '#ef4444' }}>
                          <Square size={14} fill="currentColor" />
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="output-body" style={{ flex: 1, padding: (outputTab === 'explain' || outputTab === 'mltools') ? 0 : '1.25rem', overflowY: outputTab === 'explain' ? 'hidden' : 'auto', display: 'flex', flexDirection: 'column', gap: (outputTab === 'explain' || outputTab === 'mltools') ? 0 : '1.5rem' }}>
                  {outputTab === 'execute' ? (
                    <>
                      {(complexity || isAnalyzingComplexity) && (
                        <div style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '6px' }}>
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
                        display: 'flex', gap: '0.5rem', padding: '0.4rem 1rem', flexWrap: 'wrap', 
                        borderTop: '1px solid var(--panel-border)', background: 'var(--panel-bg)',
                        position: 'sticky', bottom: '65px' 
                      }}>
                        <button onClick={() => { setTutorInput('Please review my code for best practices and space/time complexity.'); }} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', cursor: 'pointer', color: 'var(--text-2)', border: '1px solid var(--panel-border)', borderRadius: '4px', padding: '3px 8px' }}>Code Review</button>
                        <button onClick={() => { setTutorInput('Explain how I can optimize this code.'); }} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', cursor: 'pointer', color: 'var(--text-2)', border: '1px solid var(--panel-border)', borderRadius: '4px', padding: '3px 8px' }}>Optimize Code</button>
                        <button onClick={() => { setTutorInput('Generate a few edge case scenarios to test this code.'); }} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', cursor: 'pointer', color: 'var(--text-2)', border: '1px solid var(--panel-border)', borderRadius: '4px', padding: '3px 8px' }}>Test Cases</button>
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
                  ) : outputTab === 'mltools' ? (
                    <AIToolsPanel
                      code={code}
                      language={language}
                      output={output}
                      isError={isError}
                      setCode={setCode}
                      generateAIContent={generateAIContent}
                      onToast={(msg, type) => { setToast({ message: msg, type }); setTimeout(() => setToast(null), 3000); }}
                      allLanguages={ALL_LANGUAGES}
                    />
                  ) : null}
                </div>
              </section>
            </Split>
           </div>
          )}
        </>
      )}
      {isSettingsOpen && (
        <div className="modal-overlay" onClick={() => setIsSettingsOpen(false)}>
           <div className="settings-modal" onClick={e => e.stopPropagation()}>
             <div className="settings-header">
               <span>Editor Settings</span>
               <button className="btn-close-modal" onClick={() => setIsSettingsOpen(false)}><X size={18} /></button>
             </div>
             
             <div className="settings-group">
               <label>Theme</label>
               <select className="settings-input" value={editorSettings.theme} onChange={e => setEditorSettings({...editorSettings, theme: e.target.value})}>
                  <option value="vs-dark">VS Dark</option>
                  <option value="vs-light">Light</option>
                  <option value="hc-black">High Contrast</option>
               </select>
             </div>
             <div className="settings-group">
               <label>Font Size</label>
               <input type="number" className="settings-input" value={editorSettings.fontSize} onChange={e => setEditorSettings({...editorSettings, fontSize: Number(e.target.value)})} min="10" max="30" />
             </div>
             <div className="settings-group">
               <label>Tab Size</label>
               <input type="number" className="settings-input" value={editorSettings.tabSize} onChange={e => setEditorSettings({...editorSettings, tabSize: Number(e.target.value)})} min="2" max="8" />
             </div>
             <div className="settings-group">
               <label>Word Wrap</label>
               <select className="settings-input" value={editorSettings.wordWrap} onChange={e => setEditorSettings({...editorSettings, wordWrap: e.target.value})}>
                  <option value="off">Off</option>
                  <option value="on">On</option>
               </select>
             </div>
             <div className="settings-group">
               <label>Vim Mode</label>
               <input type="checkbox" className="settings-checkbox" checked={editorSettings.vimMode} onChange={e => setEditorSettings({...editorSettings, vimMode: e.target.checked})} />
             </div>
           </div>
        </div>
      )}
    </div>
  );
}

export default App;
