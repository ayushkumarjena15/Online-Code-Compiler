import React, { useState } from 'react';
import { Code2, Database, Search, ExternalLink, Play } from 'lucide-react';

const DSA_PROBLEMS = [
  { id: 1, title: 'Two Sum', difficulty: 'Easy', acceptance: '51.1%', topic: 'Array, Hash Table', url: 'https://leetcode.com/problems/two-sum/' },
  { id: 2, title: 'Add Two Numbers', difficulty: 'Medium', acceptance: '41.4%', topic: 'Linked List, Math', url: 'https://leetcode.com/problems/add-two-numbers/' },
  { id: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', acceptance: '34.3%', topic: 'Hash Table, String', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
  { id: 4, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', acceptance: '38.0%', topic: 'Array, Binary Search', url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },
  { id: 5, title: 'Longest Palindromic Substring', difficulty: 'Medium', acceptance: '33.2%', topic: 'String, DP', url: 'https://leetcode.com/problems/longest-palindromic-substring/' },
  { id: 11, title: 'Container With Most Water', difficulty: 'Medium', acceptance: '54.5%', topic: 'Array, Two Pointers', url: 'https://leetcode.com/problems/container-with-most-water/' },
  { id: 15, title: '3Sum', difficulty: 'Medium', acceptance: '33.7%', topic: 'Array, Two Pointers', url: 'https://leetcode.com/problems/3sum/' },
  { id: 20, title: 'Valid Parentheses', difficulty: 'Easy', acceptance: '40.2%', topic: 'String, Stack', url: 'https://leetcode.com/problems/valid-parentheses/' },
  { id: 21, title: 'Merge Two Sorted Lists', difficulty: 'Easy', acceptance: '63.3%', topic: 'Linked List', url: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
  { id: 33, title: 'Search in Rotated Sorted Array', difficulty: 'Medium', acceptance: '39.8%', topic: 'Array, Binary Search', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
  { id: 42, title: 'Trapping Rain Water', difficulty: 'Hard', acceptance: '60.4%', topic: 'Array, Two Pointers', url: 'https://leetcode.com/problems/trapping-rain-water/' },
  { id: 53, title: 'Maximum Subarray', difficulty: 'Medium', acceptance: '50.3%', topic: 'Array, DP', url: 'https://leetcode.com/problems/maximum-subarray/' },
  { id: 70, title: 'Climbing Stairs', difficulty: 'Easy', acceptance: '52.4%', topic: 'Math, DP', url: 'https://leetcode.com/problems/climbing-stairs/' },
  { id: 121, title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', acceptance: '53.9%', topic: 'Array, DP', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
  { id: 146, title: 'LRU Cache', difficulty: 'Medium', acceptance: '41.6%', topic: 'Hash Table, Linked List', url: 'https://leetcode.com/problems/lru-cache/' },
  { id: 200, title: 'Number of Islands', difficulty: 'Medium', acceptance: '58.3%', topic: 'Array, DFS, BFS', url: 'https://leetcode.com/problems/number-of-islands/' },
  { id: 206, title: 'Reverse Linked List', difficulty: 'Easy', acceptance: '74.8%', topic: 'Linked List', url: 'https://leetcode.com/problems/reverse-linked-list/' },
  { id: 238, title: 'Product of Array Except Self', difficulty: 'Medium', acceptance: '65.2%', topic: 'Array, Prefix Sum', url: 'https://leetcode.com/problems/product-of-array-except-self/' },
];

const SQL_PROBLEMS = [
  { id: 175, title: 'Combine Two Tables', difficulty: 'Easy', acceptance: '75.2%', topic: 'Database, Join', url: 'https://leetcode.com/problems/combine-two-tables/' },
  { id: 176, title: 'Second Highest Salary', difficulty: 'Medium', acceptance: '39.4%', topic: 'Database', url: 'https://leetcode.com/problems/second-highest-salary/' },
  { id: 177, title: 'Nth Highest Salary', difficulty: 'Medium', acceptance: '39.1%', topic: 'Database', url: 'https://leetcode.com/problems/nth-highest-salary/' },
  { id: 178, title: 'Rank Scores', difficulty: 'Medium', acceptance: '61.7%', topic: 'Database', url: 'https://leetcode.com/problems/rank-scores/' },
  { id: 181, title: 'Employees Earning More Than Their Managers', difficulty: 'Easy', acceptance: '70.8%', topic: 'Database', url: 'https://leetcode.com/problems/employees-earning-more-than-their-managers/' },
  { id: 182, title: 'Duplicate Emails', difficulty: 'Easy', acceptance: '71.1%', topic: 'Database', url: 'https://leetcode.com/problems/duplicate-emails/' },
  { id: 183, title: 'Customers Who Never Order', difficulty: 'Easy', acceptance: '68.9%', topic: 'Database', url: 'https://leetcode.com/problems/customers-who-never-order/' },
  { id: 184, title: 'Department Highest Salary', difficulty: 'Medium', acceptance: '50.1%', topic: 'Database, Join', url: 'https://leetcode.com/problems/department-highest-salary/' },
  { id: 196, title: 'Delete Duplicate Emails', difficulty: 'Easy', acceptance: '61.3%', topic: 'Database', url: 'https://leetcode.com/problems/delete-duplicate-emails/' },
  { id: 197, title: 'Rising Temperature', difficulty: 'Easy', acceptance: '49.5%', topic: 'Database', url: 'https://leetcode.com/problems/rising-temperature/' },
];

export default function Problems({ setView, setLanguage, setCode }) {
  const [activeTab, setActiveTab] = useState('dsa');
  const [search, setSearch] = useState('');

  const activeProblems = activeTab === 'dsa' ? DSA_PROBLEMS : SQL_PROBLEMS;
  const filteredProblems = activeProblems.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.topic.toLowerCase().includes(search.toLowerCase())
  );

  const handleSolve = (prob) => {
    if (activeTab === 'dsa') {
      setLanguage('cpp');
      setCode(`// Problem: ${prob.id}. ${prob.title}\n// Difficulty: ${prob.difficulty}\n// URL: ${prob.url}\n\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Write your solution here\n    \n};\n\nint main() {\n    Solution sol;\n    cout << "Testing ${prob.title}..." << endl;\n    return 0;\n}\n`);
    } else {
      setLanguage('sql');
      setCode(`-- Problem: ${prob.id}. ${prob.title}\n-- Difficulty: ${prob.difficulty}\n-- URL: ${prob.url}\n\n-- Write your MySQL query statement below\nSELECT * FROM table_name;\n`);
    }
    setView('editor');
  };

  const getDifficultyColor = (diff) => {
    switch(diff) {
      case 'Easy': return '#22c55e'; // green
      case 'Medium': return '#eab308'; // yellow
      case 'Hard': return '#ef4444'; // red
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
            {activeTab === 'dsa' ? 'Showing top selection of 3838 LeetCode DSA Problems' : 'Showing top selection of LeetCode SQL Questions'}
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
              <a href={prob.url} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                {prob.title} <ExternalLink size={12} color="var(--text-3)" />
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
