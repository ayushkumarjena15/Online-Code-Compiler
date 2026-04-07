import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle, Bug, TestTube, MessageSquare, Languages, Gauge,
  GraduationCap, ShieldCheck, Smile, TrendingUp, Activity,
  ScatterChart, Brain, Sparkles, ChevronRight, Loader2, Copy,
  Check, Zap, BarChart3, BookOpen, Target, Star, ArrowRight
} from 'lucide-react';

// ── Persistent Storage Helpers ──────────────────────────────
const getLocalJSON = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; }
  catch { return fallback; }
};
const setLocalJSON = (key, val) => localStorage.setItem(key, JSON.stringify(val));

// ── Adaptive Difficulty (Feature 10) ────────────────────────
const getUserSkill = () => getLocalJSON('codez_skill', { rating: 1200, solved: [], failed: [], topics: {} });
const saveUserSkill = (s) => setLocalJSON('codez_skill', s);

// ── ML Tool Card ────────────────────────────────────────────
function ToolCard({ icon: Icon, title, desc, color, onClick, loading, children, expanded }) {
  return (
    <div className="ml-tool-card" style={{ borderLeftColor: color }}>
      <div className="ml-tool-header" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden', flex: 1 }}>
          <div className="ml-tool-icon" style={{ background: `${color}22`, color }}>
            {loading ? <Loader2 size={18} className="spin-icon" /> : <Icon size={18} />}
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div className="ml-tool-title">{title}</div>
            <div className="ml-tool-desc">{desc}</div>
          </div>
        </div>
        {onClick && <ChevronRight size={16} style={{ color: '#94a3b8', transform: expanded ? 'rotate(90deg)' : 'none', transition: '0.2s', flexShrink: 0 }} />}
      </div>
      {expanded && <div className="ml-tool-body">{children}</div>}
    </div>
  );
}

// ── Result Display ──────────────────────────────────────────
function ResultBox({ text, color = 'var(--text)' }) {
  const [copied, setCopied] = useState(false);
  if (!text) return null;
  return (
    <div className="ml-result-box">
      <button className="ml-copy-btn" onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
        {copied ? <Check size={12} /> : <Copy size={12} />}
      </button>
      <pre style={{ color, whiteSpace: 'pre-wrap', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>{text}</pre>
    </div>
  );
}

// ── Score Badge ──────────────────────────────────────────────
function ScoreBadge({ score, label }) {
  const color = score >= 8 ? '#22c55e' : score >= 5 ? '#eab308' : '#ef4444';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0' }}>
      <div style={{ width: 42, height: 42, borderRadius: '50%', border: `3px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, color }}>{score}</div>
      <span style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>{label}</span>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────
export default function AIToolsPanel({ code, language, output, isError, setCode, generateAIContent, onToast, allLanguages }) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // Feature states
  const [activeCard, setActiveCard] = useState(null);
  const toggle = (id) => setActiveCard(prev => prev === id ? null : id);

  // 1. Smart Error Prediction
  const [predictions, setPredictions] = useState('');
  const [predicting, setPredicting] = useState(false);

  // 2. Code Smell
  const [smellResult, setSmellResult] = useState(null);
  const [smelling, setSmelling] = useState(false);

  // 3. Unit Tests
  const [testResult, setTestResult] = useState('');
  const [testing, setTesting] = useState(false);

  // 4. NL to Code
  const [nlPrompt, setNlPrompt] = useState('');
  const [nlResult, setNlResult] = useState('');
  const [nlLoading, setNlLoading] = useState(false);

  // 5. Code Translation
  const [targetLang, setTargetLang] = useState('python');
  const [transResult, setTransResult] = useState('');
  const [translating, setTranslating] = useState(false);

  // 6. Performance Prediction
  const [perfResult, setPerfResult] = useState('');
  const [perfLoading, setPerfLoading] = useState(false);

  // 7. Learning Path
  const [pathResult, setPathResult] = useState('');
  const [pathLoading, setPathLoading] = useState(false);

  // 8. Plagiarism / Similarity
  const [plagResult, setPlagResult] = useState('');
  const [plagLoading, setPlagLoading] = useState(false);

  // 9. Friendly Errors
  const [friendlyError, setFriendlyError] = useState('');
  const [friendlyLoading, setFriendlyLoading] = useState(false);

  // 10. Adaptive Difficulty
  const [skillData, setSkillData] = useState(getUserSkill());

  // 11. Anomaly Detection
  const [anomalyResult, setAnomalyResult] = useState('');
  const [anomalyLoading, setAnomalyLoading] = useState(false);

  // 12. Embedding Visualization
  const [embedData, setEmbedData] = useState(null);
  const [embedLoading, setEmbedLoading] = useState(false);
  const canvasRef = useRef(null);

  // 13. Personalized Tutor
  const [tutorInsight, setTutorInsight] = useState('');
  const [tutorLoading, setTutorLoading] = useState(false);

  const ai = async (prompt) => {
    if (!apiKey) { onToast?.("Missing API Key", "error"); return null; }
    try {
      let text = await generateAIContent(apiKey, prompt);
      return text.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
    } catch (err) {
      onToast?.("AI request failed", "error");
      return null;
    }
  };

  // ── Feature 1: Smart Error Prediction ─────────────────────
  const predictErrors = async () => {
    if (!code.trim()) return;
    setPredicting(true);
    setPredictions('');
    const result = await ai(`You are a static code analyzer. Analyze this ${language} code and predict potential bugs, errors, or issues BEFORE it runs. List each issue as a numbered item with the line number if possible and a brief explanation. If the code looks correct, say "No issues detected."\n\nCode:\n${code}`);
    setPredictions(result || 'Analysis failed.');
    setPredicting(false);
  };

  // ── Feature 2: Code Smell Detector ────────────────────────
  const detectSmells = async () => {
    if (!code.trim()) return;
    setSmelling(true);
    setSmellResult(null);
    const result = await ai(`Analyze this ${language} code for code smells and maintainability. Return ONLY a valid JSON object in this exact format (no markdown):
{"score": 7, "issues": ["issue1", "issue2"], "suggestions": ["suggestion1", "suggestion2"]}
Score is 1-10 (10 = perfect). List anti-patterns like: magic numbers, deep nesting, long functions, duplicate code, poor naming, missing error handling.

Code:\n${code}`);
    try {
      const parsed = JSON.parse(result);
      setSmellResult(parsed);
    } catch {
      setSmellResult({ score: '?', issues: [result || 'Failed to parse'], suggestions: [] });
    }
    setSmelling(false);
  };

  // ── Feature 3: Auto-Generate Unit Tests ───────────────────
  const generateTests = async () => {
    if (!code.trim()) return;
    setTesting(true);
    setTestResult('');
    const result = await ai(`Generate comprehensive unit tests for this ${language} code. Include:
- Edge cases (empty input, null, boundary values)
- Normal cases
- Error cases
Write the tests in ${language} using common testing patterns. Include test descriptions. Output ONLY the test code, ready to run.

Code:\n${code}`);
    setTestResult(result || 'Failed to generate tests.');
    setTesting(false);
  };

  // ── Feature 4: Natural Language → Code ────────────────────
  const nlToCode = async () => {
    if (!nlPrompt.trim()) return;
    setNlLoading(true);
    setNlResult('');
    const result = await ai(`Generate ${language} code for the following request. Return ONLY clean, well-commented code. No explanations outside the code.\n\nRequest: ${nlPrompt}`);
    setNlResult(result || 'Failed to generate code.');
    setNlLoading(false);
  };

  // ── Feature 5: Code Translation ───────────────────────────
  const translateCode = async () => {
    if (!code.trim()) return;
    setTranslating(true);
    setTransResult('');
    const result = await ai(`Translate this ${language} code to ${targetLang}. Preserve the logic, use idiomatic ${targetLang} patterns. Return ONLY the translated code with brief comments explaining any differences.

Code:\n${code}`);
    setTransResult(result || 'Translation failed.');
    setTranslating(false);
  };

  // ── Feature 6: Performance Predictor ──────────────────────
  const predictPerformance = async () => {
    if (!code.trim()) return;
    setPerfLoading(true);
    setPerfResult('');
    const result = await ai(`Analyze the performance characteristics of this ${language} code. Provide:
1. Time Complexity: Big-O notation with explanation
2. Space Complexity: Big-O notation with explanation
3. Estimated runtime for input sizes: N=100, N=1,000, N=10,000, N=100,000, N=1,000,000
4. Bottlenecks: Identify the slowest parts
5. Optimization suggestions with expected improvement
Format as a clear, concise report.

Code:\n${code}`);
    setPerfResult(result || 'Analysis failed.');
    setPerfLoading(false);
  };

  // ── Feature 7: Learning Path Recommender ──────────────────
  const recommendPath = async () => {
    if (!code.trim()) return;
    setPathLoading(true);
    setPathResult('');
    const skill = getUserSkill();
    const result = await ai(`Based on this ${language} code and the user's history (rating: ${skill.rating}, topics practiced: ${Object.keys(skill.topics).join(', ') || 'none'}), recommend a personalized learning path. Include:
1. What concepts this code demonstrates 
2. What the user should learn next (3-5 topics)
3. Suggested practice problems for each topic
4. Resources or tips
Be specific and actionable.

Code:\n${code}`);
    setPathResult(result || 'Failed to generate recommendations.');
    setPathLoading(false);
  };

  // ── Feature 8: Plagiarism/Similarity Check ────────────────
  const checkPlagiarism = async () => {
    if (!code.trim()) return;
    setPlagLoading(true);
    setPlagResult('');
    const result = await ai(`Analyze this ${language} code for originality:
1. Does it appear to be a common textbook/tutorial solution? (Yes/No with explanation)
2. Similarity assessment: How unique is the approach? (Score 1-10, 10=very original)
3. Common patterns detected: List any well-known algorithms or patterns used
4. If this looks like copied code, explain why and suggest how to make it more original
5. Code fingerprint: Describe the coding style (variable naming, structure, comments)

Code:\n${code}`);
    setPlagResult(result || 'Analysis failed.');
    setPlagLoading(false);
  };

  // ── Feature 9: Friendly Error Messages ────────────────────
  const friendlyfy = async () => {
    if (!output || !isError) { onToast?.("No error to explain", "error"); return; }
    setFriendlyLoading(true);
    setFriendlyError('');
    const result = await ai(`You are a kind, encouraging coding tutor. A beginner wrote this ${language} code and got an error. Explain the error in a friendly, non-technical way. Use analogies. Tell them exactly how to fix it step by step. Be encouraging!

Code:\n${code}\n\nError:\n${output}`);
    setFriendlyError(result || 'Could not simplify error.');
    setFriendlyLoading(false);
  };

  // ── Feature 11: Runtime Anomaly Detection ─────────────────
  const detectAnomalies = async () => {
    if (!output) { onToast?.("Run code first to analyze output", "error"); return; }
    setAnomalyLoading(true);
    setAnomalyResult('');
    const result = await ai(`Analyze this program's runtime output for anomalies:
1. Does the output suggest an infinite loop? (check for repeating patterns)
2. Is there a possible memory leak? (growing output size)
3. Are there unexpected values? (NaN, Infinity, null, undefined)
4. Is the output format consistent?
5. Performance red flags? (unusually slow, timeout indicators)
6. Any security concerns in the output? (exposed credentials, SQL injection artifacts)
Rate overall health: ✅ Healthy / ⚠️ Warning / 🚨 Critical

Code:\n${code}\n\nOutput:\n${output}`);
    setAnomalyResult(result || 'Analysis failed.');
    setAnomalyLoading(false);
  };

  // ── Feature 12: Code Embedding Visualization ──────────────
  const visualizeEmbeddings = async () => {
    setEmbedLoading(true);
    setEmbedData(null);
    // Get code history from localStorage
    const history = getLocalJSON('codez_code_history', []);
    const currentEntry = { code: code.substring(0, 200), lang: language, label: 'Current' };
    const entries = [currentEntry, ...history.slice(0, 9)];

    const result = await ai(`You are mapping code snippets to 2D coordinates for visualization. For each snippet below, assign an x,y coordinate (0-100 range) where similar code is close together. Group by: language similarity (x-axis) and complexity (y-axis).

Return ONLY a valid JSON array like: [{"label":"Current","x":50,"y":30,"lang":"javascript","complexity":"medium"}]

Snippets:
${entries.map((e, i) => `${i}. [${e.lang}] ${e.code.substring(0, 100)}`).join('\n')}`);

    try {
      const parsed = JSON.parse(result);
      setEmbedData(parsed);
    } catch {
      setEmbedData([{ label: 'Current', x: 50, y: 50, lang: language, complexity: 'unknown' }]);
    }
    setEmbedLoading(false);
  };

  // Draw embeddings on canvas
  useEffect(() => {
    if (!embedData || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const w = canvasRef.current.width;
    const h = canvasRef.current.height;
    ctx.clearRect(0, 0, w, h);

    // Background grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath(); ctx.moveTo(i * w / 10, 0); ctx.lineTo(i * w / 10, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * h / 10); ctx.lineTo(w, i * h / 10); ctx.stroke();
    }

    // Axes labels
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText('Language Similarity →', w / 2 - 50, h - 5);
    ctx.save();
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Complexity →', -h / 2 - 30, 12);
    ctx.restore();

    // Plot points
    const colors = { javascript: '#f7df1e', python: '#3b82f6', java: '#ef4444', cpp: '#22c55e', c: '#a855f7', default: '#94a3b8' };
    embedData.forEach((pt, i) => {
      const px = (pt.x / 100) * (w - 40) + 20;
      const py = h - ((pt.y / 100) * (h - 40) + 20);
      const col = colors[pt.lang] || colors.default;

      // Glow
      ctx.shadowColor = col;
      ctx.shadowBlur = i === 0 ? 15 : 8;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(px, py, i === 0 ? 8 : 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Label
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = `${i === 0 ? 'bold ' : ''}10px Inter, sans-serif`;
      ctx.fillText(pt.label || `#${i}`, px + 10, py + 3);
    });
  }, [embedData]);

  // ── Feature 13: Personalized AI Tutor ─────────────────────
  const getTutorInsight = async () => {
    setTutorLoading(true);
    setTutorInsight('');
    const skill = getUserSkill();
    const result = await ai(`You are a personalized coding tutor. Based on:
- Student's skill rating: ${skill.rating}/2000
- Languages practiced: ${Object.keys(skill.topics).join(', ') || 'unknown'}
- Problems solved: ${skill.solved.length}
- Problems failed: ${skill.failed.length}
- Current code language: ${language}

Provide a personalized insight:
1. Strengths: What they're doing well based on the code
2. Weaknesses: Areas to improve
3. Next challenge: A specific coding challenge tailored to their level
4. Motivation: An encouraging message
5. Study plan: What to practice this week

Current code:\n${code}`);
    setTutorInsight(result || 'Failed to generate insight.');
    setTutorLoading(false);
  };

  // ── Feature 10: Track adaptive difficulty ─────────────────
  const updateSkill = (solved, topic) => {
    const s = getUserSkill();
    const delta = solved ? 25 : -15;
    s.rating = Math.max(0, Math.min(2000, s.rating + delta));
    if (solved) s.solved.push(Date.now());
    else s.failed.push(Date.now());
    s.topics[topic] = (s.topics[topic] || 0) + 1;
    saveUserSkill(s);
    setSkillData({ ...s });
  };

  // Store code history for embedding viz
  useEffect(() => {
    if (!code || code.length < 20) return;
    const timer = setTimeout(() => {
      const history = getLocalJSON('codez_code_history', []);
      const entry = { code: code.substring(0, 200), lang: language, label: `${language} #${history.length + 1}`, ts: Date.now() };
      history.unshift(entry);
      setLocalJSON('codez_code_history', history.slice(0, 20));
    }, 5000);
    return () => clearTimeout(timer);
  }, [code, language]);

  // ── Render ────────────────────────────────────────────────
  const langOptions = allLanguages || [
    { id: 'python', name: 'Python' }, { id: 'javascript', name: 'JavaScript' },
    { id: 'java', name: 'Java' }, { id: 'cpp', name: 'C++' },
    { id: 'c', name: 'C' }, { id: 'go', name: 'Go' }, { id: 'ruby', name: 'Ruby' },
    { id: 'typescript', name: 'TypeScript' }, { id: 'rust', name: 'Rust' },
  ];

  return (
    <div className="ml-tools-panel">
      {/* ── Section: Pre-Run Analysis ── */}
      <div className="ml-section-header"><Zap size={14} /> Pre-Run Analysis</div>

      {/* 1. Smart Error Prediction */}
      <ToolCard icon={AlertTriangle} title="Smart Error Prediction" desc="Predict bugs before running" color="#f59e0b" onClick={() => { toggle('predict'); if (activeCard !== 'predict') predictErrors(); }} loading={predicting} expanded={activeCard === 'predict'}>
        {predictions && <ResultBox text={predictions} />}
      </ToolCard>

      {/* 2. Code Smell Detector */}
      <ToolCard icon={Bug} title="Code Smell Detector" desc="Maintainability score & anti-patterns" color="#ef4444" onClick={() => { toggle('smell'); if (activeCard !== 'smell') detectSmells(); }} loading={smelling} expanded={activeCard === 'smell'}>
        {smellResult && (
          <div>
            <ScoreBadge score={smellResult.score} label={`Maintainability Score (${smellResult.score >= 8 ? 'Excellent' : smellResult.score >= 5 ? 'Needs Work' : 'Poor'})`} />
            {smellResult.issues?.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <strong style={{ fontSize: '0.8rem', color: '#ef4444' }}>Issues Found:</strong>
                <ul className="ml-list">{smellResult.issues.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
            )}
            {smellResult.suggestions?.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <strong style={{ fontSize: '0.8rem', color: '#22c55e' }}>Suggestions:</strong>
                <ul className="ml-list">{smellResult.suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
            )}
          </div>
        )}
      </ToolCard>

      {/* 6. Performance Predictor */}
      <ToolCard icon={Gauge} title="Performance Predictor" desc="Time/space complexity & runtime estimates" color="#8b5cf6" onClick={() => { toggle('perf'); if (activeCard !== 'perf') predictPerformance(); }} loading={perfLoading} expanded={activeCard === 'perf'}>
        {perfResult && <ResultBox text={perfResult} />}
      </ToolCard>

      {/* ── Section: Code Generation ── */}
      <div className="ml-section-header"><Sparkles size={14} /> Code Generation</div>

      {/* 4. NL to Code */}
      <ToolCard icon={MessageSquare} title="Natural Language → Code" desc="Describe what you want, AI writes it" color="#3b82f6" onClick={() => toggle('nl')} expanded={activeCard === 'nl'}>
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <input
            type="text"
            value={nlPrompt}
            onChange={e => setNlPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && nlToCode()}
            placeholder="e.g., Sort an array using merge sort"
            className="ml-input"
          />
          <button className="ml-action-btn" onClick={nlToCode} disabled={nlLoading || !nlPrompt.trim()}>
            {nlLoading ? <Loader2 size={14} className="spin-icon" /> : <ArrowRight size={14} />}
          </button>
        </div>
        {nlResult && (
          <>
            <ResultBox text={nlResult} />
            <button className="ml-apply-btn" onClick={() => { setCode(nlResult); onToast?.("Code applied!", "success"); }}>
              Apply to Editor
            </button>
          </>
        )}
      </ToolCard>

      {/* 5. Code Translation */}
      <ToolCard icon={Languages} title="Code Translation" desc="Convert code to another language" color="#06b6d4" onClick={() => toggle('translate')} expanded={activeCard === 'translate'}>
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-2)', whiteSpace: 'nowrap' }}>Translate to:</span>
          <select className="ml-select" value={targetLang} onChange={e => setTargetLang(e.target.value)}>
            {langOptions.filter(l => l.id !== language).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <button className="ml-action-btn" onClick={translateCode} disabled={translating}>
            {translating ? <Loader2 size={14} className="spin-icon" /> : <Languages size={14} />}
          </button>
        </div>
        {transResult && (
          <>
            <ResultBox text={transResult} />
            <button className="ml-apply-btn" onClick={() => { setCode(transResult); onToast?.("Translated code applied!", "success"); }}>
              Apply to Editor
            </button>
          </>
        )}
      </ToolCard>

      {/* 3. Unit Tests */}
      <ToolCard icon={TestTube} title="Auto-Generate Tests" desc="AI writes unit tests for your code" color="#22c55e" onClick={() => { toggle('tests'); if (activeCard !== 'tests') generateTests(); }} loading={testing} expanded={activeCard === 'tests'}>
        {testResult && (
          <>
            <ResultBox text={testResult} />
            <button className="ml-apply-btn" onClick={() => { setCode(code + '\n\n// ── Auto-Generated Tests ──\n' + testResult); onToast?.("Tests appended!", "success"); }}>
              Append Tests to Code
            </button>
          </>
        )}
      </ToolCard>

      {/* ── Section: Post-Run Analysis ── */}
      <div className="ml-section-header"><Activity size={14} /> Post-Run Analysis</div>

      {/* 9. Friendly Errors */}
      <ToolCard icon={Smile} title="Friendly Error Explainer" desc="Beginner-friendly error messages" color="#f472b6" onClick={() => { toggle('friendly'); if (activeCard !== 'friendly') friendlyfy(); }} loading={friendlyLoading} expanded={activeCard === 'friendly'}>
        {!isError && !output && <p style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>Run code with an error first</p>}
        {friendlyError && <ResultBox text={friendlyError} color="#f9a8d4" />}
      </ToolCard>

      {/* 11. Anomaly Detection */}
      <ToolCard icon={Activity} title="Runtime Anomaly Detection" desc="Detect infinite loops, memory leaks, etc." color="#f97316" onClick={() => { toggle('anomaly'); if (activeCard !== 'anomaly') detectAnomalies(); }} loading={anomalyLoading} expanded={activeCard === 'anomaly'}>
        {!output && <p style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>Run code first to analyze output</p>}
        {anomalyResult && <ResultBox text={anomalyResult} />}
      </ToolCard>

      {/* 8. Plagiarism */}
      <ToolCard icon={ShieldCheck} title="Originality / Plagiarism Check" desc="Assess code uniqueness" color="#a78bfa" onClick={() => { toggle('plag'); if (activeCard !== 'plag') checkPlagiarism(); }} loading={plagLoading} expanded={activeCard === 'plag'}>
        {plagResult && <ResultBox text={plagResult} />}
      </ToolCard>

      {/* ── Section: Learning & Growth ── */}
      <div className="ml-section-header"><GraduationCap size={14} /> Learning & Growth</div>

      {/* 7. Learning Path */}
      <ToolCard icon={BookOpen} title="Learning Path Recommender" desc="Personalized next steps" color="#10b981" onClick={() => { toggle('path'); if (activeCard !== 'path') recommendPath(); }} loading={pathLoading} expanded={activeCard === 'path'}>
        {pathResult && <ResultBox text={pathResult} />}
      </ToolCard>

      {/* 13. Personalized Tutor */}
      <ToolCard icon={Brain} title="Personalized AI Tutor" desc="Strengths, weaknesses & study plan" color="#ec4899" onClick={() => { toggle('tutor'); if (activeCard !== 'tutor') getTutorInsight(); }} loading={tutorLoading} expanded={activeCard === 'tutor'}>
        {tutorInsight && <ResultBox text={tutorInsight} />}
      </ToolCard>

      {/* 10. Adaptive Difficulty / Skill Tracker */}
      <ToolCard icon={TrendingUp} title="Skill Tracker" desc={`Rating: ${skillData.rating} | Solved: ${skillData.solved.length}`} color="#6366f1" onClick={() => toggle('skill')} expanded={activeCard === 'skill'}>
        <div style={{ padding: '0.5rem 0' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
            <div className="ml-stat-box">
              <div className="ml-stat-value" style={{ color: '#6366f1' }}>{skillData.rating}</div>
              <div className="ml-stat-label">Rating</div>
            </div>
            <div className="ml-stat-box">
              <div className="ml-stat-value" style={{ color: '#22c55e' }}>{skillData.solved.length}</div>
              <div className="ml-stat-label">Solved</div>
            </div>
            <div className="ml-stat-box">
              <div className="ml-stat-value" style={{ color: '#ef4444' }}>{skillData.failed.length}</div>
              <div className="ml-stat-label">Failed</div>
            </div>
          </div>
          {/* Skill progress bar */}
          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: '4px' }}>
              Level: {skillData.rating < 400 ? 'Beginner' : skillData.rating < 800 ? 'Intermediate' : skillData.rating < 1400 ? 'Advanced' : 'Expert'}
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, (skillData.rating / 2000) * 100)}%`, background: 'linear-gradient(90deg, #6366f1, #a855f7)', borderRadius: 3, transition: 'width 0.5s' }} />
            </div>
          </div>
          {/* Topic breakdown */}
          {Object.keys(skillData.topics).length > 0 && (
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: '4px' }}>Topics Practiced:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {Object.entries(skillData.topics).map(([topic, count]) => (
                  <span key={topic} className="ml-topic-tag">{topic} ({count})</span>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
            <button className="ml-action-btn" style={{ flex: 1, fontSize: '0.75rem' }} onClick={() => updateSkill(true, language)}>
              <Check size={12} /> Mark Solved
            </button>
            <button className="ml-action-btn" style={{ flex: 1, fontSize: '0.75rem', background: 'rgba(239,68,68,0.2)', borderColor: 'rgba(239,68,68,0.3)' }} onClick={() => updateSkill(false, language)}>
              <Target size={12} /> Mark Failed
            </button>
          </div>
        </div>
      </ToolCard>

      {/* ── Section: Visualization ── */}
      <div className="ml-section-header"><ScatterChart size={14} /> Visualization</div>

      {/* 12. Code Embedding Viz */}
      <ToolCard icon={ScatterChart} title="Code Embedding Map" desc="Visualize code similarity in 2D" color="#14b8a6" onClick={() => { toggle('embed'); if (activeCard !== 'embed') visualizeEmbeddings(); }} loading={embedLoading} expanded={activeCard === 'embed'}>
        <canvas ref={canvasRef} width={350} height={220} style={{ width: '100%', height: 220, background: 'rgba(0,0,0,0.3)', borderRadius: 8, border: '1px solid var(--panel-border)' }} />
        {embedData && (
          <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', marginTop: '4px', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span>● <span style={{ color: '#f7df1e' }}>JS</span></span>
            <span>● <span style={{ color: '#3b82f6' }}>Python</span></span>
            <span>● <span style={{ color: '#ef4444' }}>Java</span></span>
            <span>● <span style={{ color: '#22c55e' }}>C++</span></span>
            <span>● <span style={{ color: '#a855f7' }}>C</span></span>
          </div>
        )}
      </ToolCard>
    </div>
  );
}
