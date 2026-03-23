import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { ArrowLeft, Play, CheckCircle2, XCircle, ExternalLink, ChevronDown } from 'lucide-react';
import axios from 'axios';

const WANDBOX_LANG = {
  cpp: 'gcc-head',
  python: 'cpython-3.14.0',
  java: 'openjdk-head',
};

const DIFFICULTY_COLOR = {
  Easy: '#22c55e',
  Medium: '#eab308',
  Hard: '#ef4444',
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

export default function ProblemDetail({ problem, onBack, isSql }) {
  const [code, setCode] = useState(problem.templateCode || '');
  const [isRunning, setIsRunning] = useState(false);
  const [rawOutput, setRawOutput] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [runError, setRunError] = useState('');
  const editorRef = useRef(null);

  const language = isSql ? 'sql' : 'cpp';
  const monacoLang = isSql ? 'sql' : 'cpp';

  const runCode = async () => {
    if (!code.trim()) return;
    setIsRunning(true);
    setRawOutput('');
    setTestResults([]);
    setRunError('');

    if (isSql) {
      setRawOutput('SQL execution is not supported in the browser test runner.\nVerify your query logic manually or test on a local MySQL instance.');
      setIsRunning(false);
      return;
    }

    try {
      const wandboxLang = WANDBOX_LANG[language] || 'gcc-head';
      const response = await axios.post(
        'https://wandbox.org/api/compile.json',
        { compiler: wandboxLang, code, options: 'warning', 'compiler-option-raw': '-std=c++17' },
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
        }
      }
    } catch (err) {
      setRunError('Network error. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  const passCount = testResults.filter(r => r.pass).length;
  const totalCount = testResults.length;
  const allPassed = totalCount > 0 && passCount === totalCount;

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: '100%' }}>
      {/* Left panel: problem description */}
      <div style={{
        width: '42%',
        minWidth: '320px',
        borderRight: '1px solid var(--panel-border)',
        overflowY: 'auto',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        background: 'var(--panel-bg)',
      }}>
        {/* Header */}
        <div>
          <button
            onClick={onBack}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              background: 'transparent', border: 'none', color: 'var(--text-2)',
              cursor: 'pointer', padding: '0.25rem 0', marginBottom: '1rem',
              fontSize: '0.85rem',
            }}
          >
            <ArrowLeft size={14} /> Back to Problems
          </button>

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
              color: DIFFICULTY_COLOR[problem.difficulty] || 'var(--text)',
              background: `${DIFFICULTY_COLOR[problem.difficulty]}18`,
              border: `1px solid ${DIFFICULTY_COLOR[problem.difficulty]}50`,
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
          <span style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            fontSize: '0.82rem', color: 'var(--text-2)',
            background: 'rgba(255,255,255,0.05)', padding: '3px 10px',
            borderRadius: '4px', border: '1px solid var(--panel-border)',
          }}>
            {isSql ? 'SQL' : 'C++'}
          </span>

          <div style={{ flex: 1 }} />

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
            {isRunning ? 'Running…' : isSql ? 'Check SQL' : 'Run Tests'}
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

        {/* Output / test results */}
        {(testResults.length > 0 || rawOutput || runError) && (
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
      </div>
    </div>
  );
}
