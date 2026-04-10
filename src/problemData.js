export const ALL_LANGUAGES = [
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

export const SNIPPETS = ALL_LANGUAGES.reduce((acc, lang) => {
  acc[lang.id] = lang.snippet;
  return acc;
}, {});

export const LANGUAGES = ALL_LANGUAGES.map(({ id, name, monaco }) => ({ id, name, monaco }));

export const FALLBACK_COMPILERS = {
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

export const DSA_PROBLEMS = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: '1 Star',
    topic: 'Array, Hash Table',
    url: 'https://leetcode.com/problems/two-sum/',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.`,
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] == 9, so return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]' },
    ],
    constraints: '2 ≤ nums.length ≤ 10⁴\n-10⁹ ≤ nums[i] ≤ 10⁹\n-10⁹ ≤ target ≤ 10⁹\nOnly one valid answer exists.',
    templateCode: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here

    }
};

int main() {
    Solution sol;
    auto check = [](vector<int> r, vector<int> e) {
        sort(r.begin(),r.end()); sort(e.begin(),e.end()); return r==e;
    };
    { vector<int> n={2,7,11,15}; cout<<"Test 1: "<<(check(sol.twoSum(n,9),{0,1})?"PASS":"FAIL")<<"\\n"; }
    { vector<int> n={3,2,4}; cout<<"Test 2: "<<(check(sol.twoSum(n,6),{1,2})?"PASS":"FAIL")<<"\\n"; }
    { vector<int> n={3,3}; cout<<"Test 3: "<<(check(sol.twoSum(n,6),{0,1})?"PASS":"FAIL")<<"\\n"; }
    return 0;
}`,
  },
  {
    id: 2,
    title: 'Add Two Numbers',
    difficulty: '1 Star',
    topic: 'Linked List, Math',
    url: 'https://leetcode.com/problems/add-two-numbers/',
    description: `You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nYou may assume the two numbers do not contain any leading zero, except the number 0 itself.`,
    examples: [
      { input: 'l1 = [2,4,3], l2 = [5,6,4]', output: '[7,0,8]', explanation: '342 + 465 = 807.' },
      { input: 'l1 = [0], l2 = [0]', output: '[0]' },
      { input: 'l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]', output: '[8,9,9,9,0,0,0,1]' },
    ],
    constraints: 'The number of nodes in each linked list is in the range [1, 100].\n0 ≤ Node.val ≤ 9\nIt is guaranteed that the list represents a number that does not have leading zeros.',
    templateCode: `#include <iostream>
#include <vector>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        // Write your solution here

    }
};

ListNode* makeList(vector<int> v) {
    ListNode* h = nullptr; ListNode** p = &h;
    for(int x : v) { *p = new ListNode(x); p = &(*p)->next; }
    return h;
}
bool checkList(ListNode* l, vector<int> e) {
    for(int x : e) { if(!l || l->val!=x) return false; l=l->next; }
    return !l;
}

int main() {
    Solution sol;
    cout<<"Test 1: "<<(checkList(sol.addTwoNumbers(makeList({2,4,3}),makeList({5,6,4})),{7,0,8})?"PASS":"FAIL")<<"\\n";
    cout<<"Test 2: "<<(checkList(sol.addTwoNumbers(makeList({0}),makeList({0})),{0})?"PASS":"FAIL")<<"\\n";
    cout<<"Test 3: "<<(checkList(sol.addTwoNumbers(makeList({9,9,9,9,9,9,9}),makeList({9,9,9,9})),{8,9,9,9,0,0,0,1})?"PASS":"FAIL")<<"\\n";
    return 0;
}`,
  },
  {
    id: 3,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: '2 Stars',
    topic: 'Hash Table, String',
    url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    description: `Given a string s, find the length of the longest substring without repeating characters.`,
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
      { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with the length of 3.' },
    ],
    constraints: '0 ≤ s.length ≤ 5 * 10⁴\ns consists of English letters, digits, symbols and spaces.',
    templateCode: `#include <iostream>
#include <string>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // Write your solution here

    }
};

int main() {
    Solution sol;
    cout<<"Test 1: "<<(sol.lengthOfLongestSubstring("abcabcbb")==3?"PASS":"FAIL")<<"\\n";
    cout<<"Test 2: "<<(sol.lengthOfLongestSubstring("bbbbb")==1?"PASS":"FAIL")<<"\\n";
    cout<<"Test 3: "<<(sol.lengthOfLongestSubstring("pwwkew")==3?"PASS":"FAIL")<<"\\n";
    cout<<"Test 4: "<<(sol.lengthOfLongestSubstring("")==0?"PASS":"FAIL")<<"\\n";
    return 0;
}`,
  },
  {
    id: 4,
    title: 'Median of Two Sorted Arrays',
    difficulty: '5 Stars',
    topic: 'Array, Binary Search',
    url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/',
    description: `Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).`,
    examples: [
      { input: 'nums1 = [1,3], nums2 = [2]', output: '2.00000', explanation: 'Merged array = [1,2,3] and median is 2.' },
      { input: 'nums1 = [1,2], nums2 = [3,4]', output: '2.50000', explanation: 'Merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.' },
    ],
    constraints: 'nums1.length == m\nnums2.length == n\n0 ≤ m ≤ 1000\n0 ≤ n ≤ 1000\n1 ≤ m + n ≤ 2000\n-10⁶ ≤ nums1[i], nums2[i] ≤ 10⁶',
    templateCode: `#include <iostream>
#include <vector>
#include <cmath>
using namespace std;

class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        // Write your solution here

    }
};

int main() {
    Solution sol;
    { vector<int> a={1,3}, b={2}; double r=sol.findMedianSortedArrays(a,b); cout<<"Test 1: "<<(fabs(r-2.0)<1e-5?"PASS":"FAIL")<<"\\n"; }
    { vector<int> a={1,2}, b={3,4}; double r=sol.findMedianSortedArrays(a,b); cout<<"Test 2: "<<(fabs(r-2.5)<1e-5?"PASS":"FAIL")<<"\\n"; }
    { vector<int> a={}, b={1}; double r=sol.findMedianSortedArrays(a,b); cout<<"Test 3: "<<(fabs(r-1.0)<1e-5?"PASS":"FAIL")<<"\\n"; }
    return 0;
}`,
  },
  {
    id: 5,
    title: 'Longest Palindromic Substring',
    difficulty: '2 Stars',
    topic: 'String, DP',
    url: 'https://leetcode.com/problems/longest-palindromic-substring/',
    description: `Given a string s, return the longest palindromic substring in s.`,
    examples: [
      { input: 's = "babad"', output: '"bab"', explanation: '"aba" is also a valid answer.' },
      { input: 's = "cbbd"', output: '"bb"' },
    ],
    constraints: '1 ≤ s.length ≤ 1000\ns consist of only digits and English letters.',
    templateCode: `#include <iostream>
#include <string>
using namespace std;

class Solution {
public:
    string longestPalindrome(string s) {
        // Write your solution here

    }
};

bool isPalin(const string& s) {
    int l=0, r=s.size()-1;
    while(l<r) if(s[l++]!=s[r--]) return false;
    return true;
}

int main() {
    Solution sol;
    string r1=sol.longestPalindrome("babad");
    cout<<"Test 1: "<<(isPalin(r1)&&r1.size()==3?"PASS":"FAIL")<<"\\n";
    string r2=sol.longestPalindrome("cbbd");
    cout<<"Test 2: "<<(r2=="bb"?"PASS":"FAIL")<<"\\n";
    string r3=sol.longestPalindrome("a");
    cout<<"Test 3: "<<(r3=="a"?"PASS":"FAIL")<<"\\n";
    return 0;
}`,
  },
  {
    id: 11,
    title: 'Container With Most Water',
    difficulty: '3 Stars',
    topic: 'Array, Two Pointers',
    url: 'https://leetcode.com/problems/container-with-most-water/',
    description: `You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the iᵗʰ line are (i, 0) and (i, height[i]).\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.\n\nNotice that you may not slant the container.`,
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'The vertical lines are at indices 1 and 8. The container holds 49 units.' },
      { input: 'height = [1,1]', output: '1' },
    ],
    constraints: 'n == height.length\n2 ≤ n ≤ 10⁵\n0 ≤ height[i] ≤ 10⁴',
    templateCode: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    int maxArea(vector<int>& height) {
        // Write your solution here

    }
};

int main() {
    Solution sol;
    { vector<int> h={1,8,6,2,5,4,8,3,7}; cout<<"Test 1: "<<(sol.maxArea(h)==49?"PASS":"FAIL")<<"\\n"; }
    { vector<int> h={1,1}; cout<<"Test 2: "<<(sol.maxArea(h)==1?"PASS":"FAIL")<<"\\n"; }
    { vector<int> h={4,3,2,1,4}; cout<<"Test 3: "<<(sol.maxArea(h)==16?"PASS":"FAIL")<<"\\n"; }
    return 0;
}`,
  },
  {
    id: 15,
    title: '3Sum',
    difficulty: '3 Stars',
    topic: 'Array, Two Pointers',
    url: 'https://leetcode.com/problems/3sum/',
    description: `Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.\n\nNotice that the solution set must not contain duplicate triplets.`,
    examples: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' },
      { input: 'nums = [0,1,1]', output: '[]' },
      { input: 'nums = [0,0,0]', output: '[[0,0,0]]' },
    ],
    constraints: '3 ≤ nums.length ≤ 3000\n-10⁵ ≤ nums[i] ≤ 10⁵',
    templateCode: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        // Write your solution here

    }
};

int main() {
    Solution sol;
    { vector<int> n={-1,0,1,2,-1,-4}; auto r=sol.threeSum(n); sort(r.begin(),r.end()); vector<vector<int>> e={{-1,-1,2},{-1,0,1}}; cout<<"Test 1: "<<(r==e?"PASS":"FAIL")<<"\\n"; }
    { vector<int> n={0,1,1}; auto r=sol.threeSum(n); cout<<"Test 2: "<<(r.empty()?"PASS":"FAIL")<<"\\n"; }
    { vector<int> n={0,0,0}; auto r=sol.threeSum(n); cout<<"Test 3: "<<(r==vector<vector<int>>{{0,0,0}}?"PASS":"FAIL")<<"\\n"; }
    return 0;
}`,
  },
  {
    id: 20,
    title: 'Valid Parentheses',
    difficulty: '1 Star',
    topic: 'String, Stack',
    url: 'https://leetcode.com/problems/valid-parentheses/',
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n- Open brackets must be closed by the same type of brackets.\n- Open brackets must be closed in the correct order.\n- Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    constraints: '1 ≤ s.length ≤ 10⁴\ns consists of parentheses only \'()[]{}\' ',
    templateCode: `#include <iostream>
#include <string>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        // Write your solution here

    }
};

int main() {
    Solution sol;
    cout<<"Test 1: "<<(sol.isValid("()")==true?"PASS":"FAIL")<<"\\n";
    cout<<"Test 2: "<<(sol.isValid("()[]{}")==true?"PASS":"FAIL")<<"\\n";
    cout<<"Test 3: "<<(sol.isValid("(]")==false?"PASS":"FAIL")<<"\\n";
    cout<<"Test 4: "<<(sol.isValid("{[]}")==true?"PASS":"FAIL")<<"\\n";
    cout<<"Test 5: "<<(sol.isValid("([)]")==false?"PASS":"FAIL")<<"\\n";
    return 0;
}`,
  },
  {
    id: 21,
    title: 'Merge Two Sorted Lists',
    difficulty: '1 Star',
    topic: 'Linked List',
    url: 'https://leetcode.com/problems/merge-two-sorted-lists/',
    description: `You are given the heads of two sorted linked lists list1 and list2.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.`,
    examples: [
      { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' },
      { input: 'list1 = [], list2 = []', output: '[]' },
      { input: 'list1 = [], list2 = [0]', output: '[0]' },
    ],
    constraints: 'The number of nodes in both lists is in the range [0, 50].\n-100 ≤ Node.val ≤ 100\nBoth list1 and list2 are sorted in non-decreasing order.',
    templateCode: `#include <iostream>
#include <vector>
using namespace std;

struct ListNode {
    int val; ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        // Write your solution here

    }
};

ListNode* makeList(vector<int> v) { ListNode* h=nullptr; ListNode** p=&h; for(int x:v){*p=new ListNode(x);p=&(*p)->next;} return h; }
bool checkList(ListNode* l, vector<int> e) { for(int x:e){if(!l||l->val!=x)return false;l=l->next;} return !l; }

int main() {
    Solution sol;
    cout<<"Test 1: "<<(checkList(sol.mergeTwoLists(makeList({1,2,4}),makeList({1,3,4})),{1,1,2,3,4,4})?"PASS":"FAIL")<<"\\n";
    cout<<"Test 2: "<<(checkList(sol.mergeTwoLists(nullptr,nullptr),{})?"PASS":"FAIL")<<"\\n";
    cout<<"Test 3: "<<(checkList(sol.mergeTwoLists(nullptr,makeList({0})),{0})?"PASS":"FAIL")<<"\\n";
    return 0;
}`,
  },
  {
    id: 33,
    title: 'Search in Rotated Sorted Array',
    difficulty: '4 Stars',
    topic: 'Array, Binary Search',
    url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
    description: `There is an integer array nums sorted in ascending order (with distinct values).\n\nPrior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 ≤ k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]].\n\nGiven the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.\n\nYou must write an algorithm with O(log n) runtime complexity.`,
    examples: [
      { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4' },
      { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1' },
      { input: 'nums = [1], target = 0', output: '-1' },
    ],
    constraints: '1 ≤ nums.length ≤ 5000\n-10⁴ ≤ nums[i] ≤ 10⁴\nAll values of nums are unique.\n-10⁴ ≤ target ≤ 10⁴',
    templateCode: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    int search(vector<int>& nums, int target) {
        // Write your solution here

    }
};

int main() {
    Solution sol;
    { vector<int> n={4,5,6,7,0,1,2}; cout<<"Test 1: "<<(sol.search(n,0)==4?"PASS":"FAIL")<<"\\n"; }
    { vector<int> n={4,5,6,7,0,1,2}; cout<<"Test 2: "<<(sol.search(n,3)==-1?"PASS":"FAIL")<<"\\n"; }
    { vector<int> n={1}; cout<<"Test 3: "<<(sol.search(n,0)==-1?"PASS":"FAIL")<<"\\n"; }
    return 0;
}`,
  },
  {
    id: 42,
    title: 'Trapping Rain Water',
    difficulty: '5 Stars',
    topic: 'Array, Two Pointers',
    url: 'https://leetcode.com/problems/trapping-rain-water/',
    description: `Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.`,
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: 'The elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped.' },
      { input: 'height = [4,2,0,3,2,5]', output: '9' },
    ],
    constraints: 'n == height.length\n1 ≤ n ≤ 2 * 10⁴\n0 ≤ height[i] ≤ 10⁵',
    templateCode: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    int trap(vector<int>& height) {
        // Write your solution here

    }
};

int main() {
    Solution sol;
    { vector<int> h={0,1,0,2,1,0,1,3,2,1,2,1}; cout<<"Test 1: "<<(sol.trap(h)==6?"PASS":"FAIL")<<"\\n"; }
    { vector<int> h={4,2,0,3,2,5}; cout<<"Test 2: "<<(sol.trap(h)==9?"PASS":"FAIL")<<"\\n"; }
    { vector<int> h={3,0,2,0,4}; cout<<"Test 3: "<<(sol.trap(h)==7?"PASS":"FAIL")<<"\\n"; }
    return 0;
}`,
  },
  {
    id: 53,
    title: 'Maximum Subarray',
    difficulty: '3 Stars',
    topic: 'Array, DP',
    url: 'https://leetcode.com/problems/maximum-subarray/',
    description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.\n\nA subarray is a contiguous non-empty sequence of elements within an array.`,
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: 'nums = [1]', output: '1' },
      { input: 'nums = [5,4,-1,7,8]', output: '23' },
    ],
    constraints: '1 ≤ nums.length ≤ 10⁵\n-10⁴ ≤ nums[i] ≤ 10⁴',
    templateCode: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        // Write your solution here

    }
};

int main() {
    Solution sol;
    { vector<int> n={-2,1,-3,4,-1,2,1,-5,4}; cout<<"Test 1: "<<(sol.maxSubArray(n)==6?"PASS":"FAIL")<<"\\n"; }
    { vector<int> n={1}; cout<<"Test 2: "<<(sol.maxSubArray(n)==1?"PASS":"FAIL")<<"\\n"; }
    { vector<int> n={5,4,-1,7,8}; cout<<"Test 3: "<<(sol.maxSubArray(n)==23?"PASS":"FAIL")<<"\\n"; }
    { vector<int> n={-1}; cout<<"Test 4: "<<(sol.maxSubArray(n)==-1?"PASS":"FAIL")<<"\\n"; }
    return 0;
}`,
  },
  {
    id: 70,
    title: 'Climbing Stairs',
    difficulty: '1 Star',
    topic: 'Math, DP',
    url: 'https://leetcode.com/problems/climbing-stairs/',
    description: `You are climbing a staircase. It takes n steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
    examples: [
      { input: 'n = 2', output: '2', explanation: '1+1 or 2. There are 2 ways to climb.' },
      { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, or 2+1. There are 3 ways.' },
    ],
    constraints: '1 ≤ n ≤ 45',
    templateCode: `#include <iostream>
using namespace std;

class Solution {
public:
    int climbStairs(int n) {
        // Write your solution here

    }
};

int main() {
    Solution sol;
    cout<<"Test 1: "<<(sol.climbStairs(1)==1?"PASS":"FAIL")<<"\\n";
    cout<<"Test 2: "<<(sol.climbStairs(2)==2?"PASS":"FAIL")<<"\\n";
    cout<<"Test 3: "<<(sol.climbStairs(3)==3?"PASS":"FAIL")<<"\\n";
    cout<<"Test 4: "<<(sol.climbStairs(5)==8?"PASS":"FAIL")<<"\\n";
    cout<<"Test 5: "<<(sol.climbStairs(10)==89?"PASS":"FAIL")<<"\\n";
    return 0;
}`,
  },
  {
    id: 121,
    title: 'Best Time to Buy and Sell Stock',
    difficulty: '1 Star',
    topic: 'Array, DP',
    url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    description: `You are given an array prices where prices[i] is the price of a given stock on the iᵗʰ day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.`,
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.' },
      { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'No transactions are done and the max profit = 0.' },
    ],
    constraints: '1 ≤ prices.length ≤ 10⁵\n0 ≤ prices[i] ≤ 10⁴',
    templateCode: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        // Write your solution here

    }
};

int main() {
    Solution sol;
    { vector<int> p={7,1,5,3,6,4}; cout<<"Test 1: "<<(sol.maxProfit(p)==5?"PASS":"FAIL")<<"\\n"; }
    { vector<int> p={7,6,4,3,1}; cout<<"Test 2: "<<(sol.maxProfit(p)==0?"PASS":"FAIL")<<"\\n"; }
    { vector<int> p={2,4,1}; cout<<"Test 3: "<<(sol.maxProfit(p)==2?"PASS":"FAIL")<<"\\n"; }
    return 0;
}`,
  },
  {
    id: 146,
    title: 'LRU Cache',
    difficulty: '4 Stars',
    topic: 'Hash Table, Linked List',
    url: 'https://leetcode.com/problems/lru-cache/',
    description: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the LRUCache class:\n- LRUCache(int capacity) Initialize the LRU cache with positive size capacity.\n- int get(int key) Return the value of the key if the key exists, otherwise return -1.\n- void put(int key, int value) Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.\n\nThe functions get and put must each run in O(1) average time complexity.`,
    examples: [
      { input: '["LRUCache","put","put","get","put","get","put","get","get","get"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]', output: '[null,null,null,1,null,-1,null,-1,3,4]' },
    ],
    constraints: '1 ≤ capacity ≤ 3000\n0 ≤ key ≤ 10⁴\n0 ≤ value ≤ 10⁵\nAt most 2 * 10⁵ calls will be made to get and put.',
    templateCode: `#include <iostream>
#include <unordered_map>
#include <list>
using namespace std;

class LRUCache {
public:
    LRUCache(int capacity) {
        // Initialize here

    }

    int get(int key) {
        // Write your solution here

    }

    void put(int key, int value) {
        // Write your solution here

    }
};

int main() {
    LRUCache cache(2);
    cache.put(1,1);
    cache.put(2,2);
    cout<<"Test 1: "<<(cache.get(1)==1?"PASS":"FAIL")<<"\\n";
    cache.put(3,3);
    cout<<"Test 2: "<<(cache.get(2)==-1?"PASS":"FAIL")<<"\\n";
    cache.put(4,4);
    cout<<"Test 3: "<<(cache.get(1)==-1?"PASS":"FAIL")<<"\\n";
    cout<<"Test 4: "<<(cache.get(3)==3?"PASS":"FAIL")<<"\\n";
    cout<<"Test 5: "<<(cache.get(4)==4?"PASS":"FAIL")<<"\\n";
    return 0;
}`,
  },
  {
    id: 200,
    title: 'Number of Islands',
    difficulty: '3 Stars',
    topic: 'Array, DFS, BFS',
    url: 'https://leetcode.com/problems/number-of-islands/',
    description: `Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    examples: [
      { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1' },
      { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3' },
    ],
    constraints: 'm == grid.length\nn == grid[i].length\n1 ≤ m, n ≤ 300\ngrid[i][j] is \'0\' or \'1\'.',
    templateCode: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        // Write your solution here

    }
};

int main() {
    Solution sol;
    {
        vector<vector<char>> g={{'1','1','1','1','0'},{'1','1','0','1','0'},{'1','1','0','0','0'},{'0','0','0','0','0'}};
        cout<<"Test 1: "<<(sol.numIslands(g)==1?"PASS":"FAIL")<<"\\n";
    }
    {
        vector<vector<char>> g={{'1','1','0','0','0'},{'1','1','0','0','0'},{'0','0','1','0','0'},{'0','0','0','1','1'}};
        cout<<"Test 2: "<<(sol.numIslands(g)==3?"PASS":"FAIL")<<"\\n";
    }
    {
        vector<vector<char>> g={{'1'}};
        cout<<"Test 3: "<<(sol.numIslands(g)==1?"PASS":"FAIL")<<"\\n";
    }
    return 0;
}`,
  },
  {
    id: 206,
    title: 'Reverse Linked List',
    difficulty: '1 Star',
    topic: 'Linked List',
    url: 'https://leetcode.com/problems/reverse-linked-list/',
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list.`,
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', output: '[2,1]' },
      { input: 'head = []', output: '[]' },
    ],
    constraints: 'The number of nodes in the list is the range [0, 5000].\n-5000 ≤ Node.val ≤ 5000',
    templateCode: `#include <iostream>
#include <vector>
using namespace std;

struct ListNode {
    int val; ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        // Write your solution here

    }
};

ListNode* makeList(vector<int> v) { ListNode* h=nullptr; ListNode** p=&h; for(int x:v){*p=new ListNode(x);p=&(*p)->next;} return h; }
bool checkList(ListNode* l, vector<int> e) { for(int x:e){if(!l||l->val!=x)return false;l=l->next;} return !l; }

int main() {
    Solution sol;
    cout<<"Test 1: "<<(checkList(sol.reverseList(makeList({1,2,3,4,5})),{5,4,3,2,1})?"PASS":"FAIL")<<"\\n";
    cout<<"Test 2: "<<(checkList(sol.reverseList(makeList({1,2})),{2,1})?"PASS":"FAIL")<<"\\n";
    cout<<"Test 3: "<<(checkList(sol.reverseList(nullptr),{})?"PASS":"FAIL")<<"\\n";
    return 0;
}`,
  },
  {
    id: 238,
    title: 'Product of Array Except Self',
    difficulty: '3 Stars',
    topic: 'Array, Prefix Sum',
    url: 'https://leetcode.com/problems/product-of-array-except-self/',
    description: `Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].\n\nThe product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.\n\nYou must write an algorithm that runs in O(n) time and without using the division operation.`,
    examples: [
      { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' },
      { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]' },
    ],
    constraints: '2 ≤ nums.length ≤ 10⁵\n-30 ≤ nums[i] ≤ 30\nThe product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.',
    templateCode: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        // Write your solution here

    }
};

int main() {
    Solution sol;
    { vector<int> n={1,2,3,4}; auto r=sol.productExceptSelf(n); cout<<"Test 1: "<<(r==vector<int>{24,12,8,6}?"PASS":"FAIL")<<"\\n"; }
    { vector<int> n={-1,1,0,-3,3}; auto r=sol.productExceptSelf(n); cout<<"Test 2: "<<(r==vector<int>{0,0,9,0,0}?"PASS":"FAIL")<<"\\n"; }
    { vector<int> n={2,3}; auto r=sol.productExceptSelf(n); cout<<"Test 3: "<<(r==vector<int>{3,2}?"PASS":"FAIL")<<"\\n"; }
    return 0;
}`,
  },
  {
    id: 49,
    title: 'Group Anagrams',
    difficulty: '3 Stars',
    topic: 'Array, Hash Table, String',
    url: 'https://leetcode.com/problems/group-anagrams/',
    description: `Given an array of strings strs, group the anagrams together. You can return the answer in any order.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
      { input: 'strs = [""]', output: '[[""]]' },
      { input: 'strs = ["a"]', output: '[["a"]]' },
    ],
    constraints: '1 ≤ strs.length ≤ 10⁴\n0 ≤ strs[i].length ≤ 100\nstrs[i] consists of lowercase English letters.',
    templateCode: `#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<string>> groupAnagrams(vector<string>& strs) {\n        // Write your solution here\n\n    }\n};\n\nint main() {\n    Solution sol;\n    { vector<string> s={"eat","tea","tan","ate","nat","bat"}; auto r=sol.groupAnagrams(s); cout<<"Test 1: "<<(r.size()==3?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<string> s={""}; auto r=sol.groupAnagrams(s); cout<<"Test 2: "<<(r.size()==1?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<string> s={"a"}; auto r=sol.groupAnagrams(s); cout<<"Test 3: "<<(r.size()==1?"PASS":"FAIL")<<"\\\\n"; }\n    return 0;\n}`,
  },
  {
    id: 56,
    title: 'Merge Intervals',
    difficulty: '3 Stars',
    topic: 'Array, Sorting',
    url: 'https://leetcode.com/problems/merge-intervals/',
    description: `Given an array of intervals where intervals[i] = [startᵢ, endᵢ], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].' },
      { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]', explanation: 'Intervals [1,4] and [4,5] are considered overlapping.' },
    ],
    constraints: '1 ≤ intervals.length ≤ 10⁴\nintervals[i].length == 2\n0 ≤ startᵢ ≤ endᵢ ≤ 10⁴',
    templateCode: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        // Write your solution here\n\n    }\n};\n\nint main() {\n    Solution sol;\n    { vector<vector<int>> i={{1,3},{2,6},{8,10},{15,18}}; auto r=sol.merge(i); cout<<"Test 1: "<<(r==vector<vector<int>>{{1,6},{8,10},{15,18}}?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<vector<int>> i={{1,4},{4,5}}; auto r=sol.merge(i); cout<<"Test 2: "<<(r==vector<vector<int>>{{1,5}}?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<vector<int>> i={{1,4},{0,4}}; auto r=sol.merge(i); cout<<"Test 3: "<<(r.size()==1?"PASS":"FAIL")<<"\\\\n"; }\n    return 0;\n}`,
  },
  {
    id: 76,
    title: 'Minimum Window Substring',
    difficulty: '5 Stars',
    topic: 'Hash Table, String, Sliding Window',
    url: 'https://leetcode.com/problems/minimum-window-substring/',
    description: `Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string "".\n\nThe testcases will be generated such that the answer is unique.`,
    examples: [
      { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"', explanation: 'The minimum window substring "BANC" includes A, B, and C from string t.' },
      { input: 's = "a", t = "a"', output: '"a"' },
      { input: 's = "a", t = "aa"', output: '""', explanation: 'Both a\'s from t must be in the window.' },
    ],
    constraints: 'm == s.length\nn == t.length\n1 ≤ m, n ≤ 10⁵\ns and t consist of uppercase and lowercase English letters.',
    templateCode: `#include <iostream>\n#include <string>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    string minWindow(string s, string t) {\n        // Write your solution here\n\n    }\n};\n\nint main() {\n    Solution sol;\n    cout<<"Test 1: "<<(sol.minWindow("ADOBECODEBANC","ABC")=="BANC"?"PASS":"FAIL")<<"\\\\n";\n    cout<<"Test 2: "<<(sol.minWindow("a","a")=="a"?"PASS":"FAIL")<<"\\\\n";\n    cout<<"Test 3: "<<(sol.minWindow("a","aa")==""?"PASS":"FAIL")<<"\\\\n";\n    cout<<"Test 4: "<<(sol.minWindow("ab","b")=="b"?"PASS":"FAIL")<<"\\\\n";\n    return 0;\n}`,
  },
  {
    id: 78,
    title: 'Subsets',
    difficulty: '3 Stars',
    topic: 'Array, Backtracking, Bit Manipulation',
    url: 'https://leetcode.com/problems/subsets/',
    description: `Given an integer array nums of unique elements, return all possible subsets (the power set).\n\nThe solution set must not contain duplicate subsets. Return the solution in any order.`,
    examples: [
      { input: 'nums = [1,2,3]', output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]' },
      { input: 'nums = [0]', output: '[[],[0]]' },
    ],
    constraints: '1 ≤ nums.length ≤ 10\n-10 ≤ nums[i] ≤ 10\nAll the numbers of nums are unique.',
    templateCode: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> subsets(vector<int>& nums) {\n        // Write your solution here\n\n    }\n};\n\nint main() {\n    Solution sol;\n    { vector<int> n={1,2,3}; auto r=sol.subsets(n); cout<<"Test 1: "<<(r.size()==8?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> n={0}; auto r=sol.subsets(n); cout<<"Test 2: "<<(r.size()==2?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> n={1,2}; auto r=sol.subsets(n); cout<<"Test 3: "<<(r.size()==4?"PASS":"FAIL")<<"\\\\n"; }\n    return 0;\n}`,
  },
  {
    id: 98,
    title: 'Validate Binary Search Tree',
    difficulty: '4 Stars',
    topic: 'Binary Tree, DFS, BST',
    url: 'https://leetcode.com/problems/validate-binary-search-tree/',
    description: `Given the root of a binary tree, determine if it is a valid binary search tree (BST).\n\nA valid BST is defined as follows:\n- The left subtree of a node contains only nodes with keys less than the node's key.\n- The right subtree of a node contains only nodes with keys greater than the node's key.\n- Both the left and right subtrees must also be binary search trees.`,
    examples: [
      { input: 'root = [2,1,3]', output: 'true' },
      { input: 'root = [5,1,4,null,null,3,6]', output: 'false', explanation: 'The root node value is 5 but its right child value is 4.' },
    ],
    constraints: 'The number of nodes in the tree is in the range [1, 10⁴].\n-2³¹ ≤ Node.val ≤ 2³¹ - 1',
    templateCode: `#include <iostream>\n#include <climits>\nusing namespace std;\n\nstruct TreeNode {\n    int val; TreeNode *left; TreeNode *right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nclass Solution {\npublic:\n    bool isValidBST(TreeNode* root) {\n        // Write your solution here\n\n    }\n};\n\nint main() {\n    Solution sol;\n    { TreeNode* r=new TreeNode(2); r->left=new TreeNode(1); r->right=new TreeNode(3); cout<<"Test 1: "<<(sol.isValidBST(r)?"PASS":"FAIL")<<"\\\\n"; }\n    { TreeNode* r=new TreeNode(5); r->left=new TreeNode(1); r->right=new TreeNode(4); r->right->left=new TreeNode(3); r->right->right=new TreeNode(6); cout<<"Test 2: "<<(!sol.isValidBST(r)?"PASS":"FAIL")<<"\\\\n"; }\n    { TreeNode* r=new TreeNode(1); r->left=new TreeNode(1); cout<<"Test 3: "<<(!sol.isValidBST(r)?"PASS":"FAIL")<<"\\\\n"; }\n    return 0;\n}`,
  },
  {
    id: 102,
    title: 'Binary Tree Level Order Traversal',
    difficulty: '3 Stars',
    topic: 'Binary Tree, BFS',
    url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
    description: `Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).`,
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' },
      { input: 'root = [1]', output: '[[1]]' },
      { input: 'root = []', output: '[]' },
    ],
    constraints: 'The number of nodes in the tree is in the range [0, 2000].\n-1000 ≤ Node.val ≤ 1000',
    templateCode: `#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nstruct TreeNode {\n    int val; TreeNode *left; TreeNode *right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nclass Solution {\npublic:\n    vector<vector<int>> levelOrder(TreeNode* root) {\n        // Write your solution here\n\n    }\n};\n\nint main() {\n    Solution sol;\n    { TreeNode* r=new TreeNode(3); r->left=new TreeNode(9); r->right=new TreeNode(20); r->right->left=new TreeNode(15); r->right->right=new TreeNode(7); auto res=sol.levelOrder(r); cout<<"Test 1: "<<(res==vector<vector<int>>{{3},{9,20},{15,7}}?"PASS":"FAIL")<<"\\\\n"; }\n    { TreeNode* r=new TreeNode(1); auto res=sol.levelOrder(r); cout<<"Test 2: "<<(res==vector<vector<int>>{{1}}?"PASS":"FAIL")<<"\\\\n"; }\n    { auto res=sol.levelOrder(nullptr); cout<<"Test 3: "<<(res.empty()?"PASS":"FAIL")<<"\\\\n"; }\n    return 0;\n}`,
  },
  {
    id: 104,
    title: 'Maximum Depth of Binary Tree',
    difficulty: '1 Star',
    topic: 'Binary Tree, DFS, BFS',
    url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
    description: `Given the root of a binary tree, return its maximum depth.\n\nA binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.`,
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '3' },
      { input: 'root = [1,null,2]', output: '2' },
    ],
    constraints: 'The number of nodes in the tree is in the range [0, 10⁴].\n-100 ≤ Node.val ≤ 100',
    templateCode: `#include <iostream>\nusing namespace std;\n\nstruct TreeNode {\n    int val; TreeNode *left; TreeNode *right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nclass Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        // Write your solution here\n\n    }\n};\n\nint main() {\n    Solution sol;\n    { TreeNode* r=new TreeNode(3); r->left=new TreeNode(9); r->right=new TreeNode(20); r->right->left=new TreeNode(15); r->right->right=new TreeNode(7); cout<<"Test 1: "<<(sol.maxDepth(r)==3?"PASS":"FAIL")<<"\\\\n"; }\n    { TreeNode* r=new TreeNode(1); r->right=new TreeNode(2); cout<<"Test 2: "<<(sol.maxDepth(r)==2?"PASS":"FAIL")<<"\\\\n"; }\n    { cout<<"Test 3: "<<(sol.maxDepth(nullptr)==0?"PASS":"FAIL")<<"\\\\n"; }\n    return 0;\n}`,
  },
  {
    id: 136,
    title: 'Single Number',
    difficulty: '1 Star',
    topic: 'Array, Bit Manipulation',
    url: 'https://leetcode.com/problems/single-number/',
    description: `Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.\n\nYou must implement a solution with a linear runtime complexity and use only constant extra space.`,
    examples: [
      { input: 'nums = [2,2,1]', output: '1' },
      { input: 'nums = [4,1,2,1,2]', output: '4' },
      { input: 'nums = [1]', output: '1' },
    ],
    constraints: '1 ≤ nums.length ≤ 3 * 10⁴\n-3 * 10⁴ ≤ nums[i] ≤ 3 * 10⁴\nEach element appears twice except for one element which appears once.',
    templateCode: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int singleNumber(vector<int>& nums) {\n        // Write your solution here\n\n    }\n};\n\nint main() {\n    Solution sol;\n    { vector<int> n={2,2,1}; cout<<"Test 1: "<<(sol.singleNumber(n)==1?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> n={4,1,2,1,2}; cout<<"Test 2: "<<(sol.singleNumber(n)==4?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> n={1}; cout<<"Test 3: "<<(sol.singleNumber(n)==1?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> n={-1,-1,-2}; cout<<"Test 4: "<<(sol.singleNumber(n)==-2?"PASS":"FAIL")<<"\\\\n"; }\n    return 0;\n}`,
  },
  {
    id: 141,
    title: 'Linked List Cycle',
    difficulty: '1 Star',
    topic: 'Linked List, Two Pointers',
    url: 'https://leetcode.com/problems/linked-list-cycle/',
    description: `Given head, the head of a linked list, determine if the linked list has a cycle in it.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. Internally, pos is used to denote the index of the node that tail's next pointer is connected to. Note that pos is not passed as a parameter.\n\nReturn true if there is a cycle in the linked list. Otherwise, return false.`,
    examples: [
      { input: 'head = [3,2,0,-4], pos = 1', output: 'true', explanation: 'There is a cycle where tail connects to the 1st node.' },
      { input: 'head = [1,2], pos = 0', output: 'true' },
      { input: 'head = [1], pos = -1', output: 'false' },
    ],
    constraints: 'The number of nodes in the list is in the range [0, 10⁴].\n-10⁵ ≤ Node.val ≤ 10⁵\npos is -1 or a valid index in the linked list.',
    templateCode: `#include <iostream>\nusing namespace std;\n\nstruct ListNode {\n    int val; ListNode *next;\n    ListNode(int x) : val(x), next(nullptr) {}\n};\n\nclass Solution {\npublic:\n    bool hasCycle(ListNode *head) {\n        // Write your solution here (Floyd's cycle detection)\n\n    }\n};\n\nint main() {\n    Solution sol;\n    { ListNode* h=new ListNode(3); h->next=new ListNode(2); h->next->next=new ListNode(0); h->next->next->next=new ListNode(-4); h->next->next->next->next=h->next; cout<<"Test 1: "<<(sol.hasCycle(h)?"PASS":"FAIL")<<"\\\\n"; }\n    { ListNode* h=new ListNode(1); h->next=new ListNode(2); h->next->next=h; cout<<"Test 2: "<<(sol.hasCycle(h)?"PASS":"FAIL")<<"\\\\n"; }\n    { ListNode* h=new ListNode(1); cout<<"Test 3: "<<(!sol.hasCycle(h)?"PASS":"FAIL")<<"\\\\n"; }\n    { cout<<"Test 4: "<<(!sol.hasCycle(nullptr)?"PASS":"FAIL")<<"\\\\n"; }\n    return 0;\n}`,
  },
  {
    id: 152,
    title: 'Maximum Product Subarray',
    difficulty: 'Medium',
    topic: 'Array, DP',
    url: 'https://leetcode.com/problems/maximum-product-subarray/',
    description: `Given an integer array nums, find a subarray that has the largest product, and return the product.\n\nThe test cases are generated so that the answer will fit in a 32-bit integer.`,
    examples: [
      { input: 'nums = [2,3,-2,4]', output: '6', explanation: '[2,3] has the largest product 6.' },
      { input: 'nums = [-2,0,-1]', output: '0', explanation: 'The result cannot be 2, because [-2,-1] is not a subarray.' },
    ],
    constraints: '1 ≤ nums.length ≤ 2 * 10⁴\n-10 ≤ nums[i] ≤ 10\nThe product of any prefix or suffix is guaranteed to fit in a 32-bit integer.',
    templateCode: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxProduct(vector<int>& nums) {\n        // Write your solution here\n\n    }\n};\n\nint main() {\n    Solution sol;\n    { vector<int> n={2,3,-2,4}; cout<<"Test 1: "<<(sol.maxProduct(n)==6?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> n={-2,0,-1}; cout<<"Test 2: "<<(sol.maxProduct(n)==0?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> n={-2,3,-4}; cout<<"Test 3: "<<(sol.maxProduct(n)==24?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> n={-2}; cout<<"Test 4: "<<(sol.maxProduct(n)==-2?"PASS":"FAIL")<<"\\\\n"; }\n    return 0;\n}`,
  },
  {
    id: 155,
    title: 'Min Stack',
    difficulty: 'Medium',
    topic: 'Stack, Design',
    url: 'https://leetcode.com/problems/min-stack/',
    description: `Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.\n\nImplement the MinStack class:\n- MinStack() initializes the stack object.\n- void push(int val) pushes the element val onto the stack.\n- void pop() removes the element on the top of the stack.\n- int top() gets the top element of the stack.\n- int getMin() retrieves the minimum element in the stack.\n\nYou must implement a solution with O(1) time complexity for each function.`,
    examples: [
      { input: '["MinStack","push","push","push","getMin","pop","top","getMin"]\n[[],[-2],[0],[-3],[],[],[],[]]', output: '[null,null,null,null,-3,null,0,-2]' },
    ],
    constraints: '-2³¹ ≤ val ≤ 2³¹ - 1\nMethods pop, top and getMin operations will always be called on non-empty stacks.\nAt most 3 * 10⁴ calls will be made to push, pop, top, and getMin.',
    templateCode: `#include <iostream>\n#include <stack>\nusing namespace std;\n\nclass MinStack {\npublic:\n    MinStack() {\n        // Initialize here\n\n    }\n    void push(int val) {\n        // Write your solution here\n\n    }\n    void pop() {\n        // Write your solution here\n\n    }\n    int top() {\n        // Write your solution here\n\n    }\n    int getMin() {\n        // Write your solution here\n\n    }\n};\n\nint main() {\n    MinStack ms;\n    ms.push(-2); ms.push(0); ms.push(-3);\n    cout<<"Test 1: "<<(ms.getMin()==-3?"PASS":"FAIL")<<"\\\\n";\n    ms.pop();\n    cout<<"Test 2: "<<(ms.top()==0?"PASS":"FAIL")<<"\\\\n";\n    cout<<"Test 3: "<<(ms.getMin()==-2?"PASS":"FAIL")<<"\\\\n";\n    return 0;\n}`,
  },
  {
    id: 191,
    title: 'Number of 1 Bits',
    difficulty: 'Easy',
    topic: 'Bit Manipulation',
    url: 'https://leetcode.com/problems/number-of-1-bits/',
    description: `Write a function that takes the binary representation of a positive integer and returns the number of set bits it has (also known as the Hamming weight).`,
    examples: [
      { input: 'n = 11', output: '3', explanation: 'The input binary string 1011 has three set bits.' },
      { input: 'n = 128', output: '1', explanation: 'The input binary string 10000000 has one set bit.' },
      { input: 'n = 2147483645', output: '30' },
    ],
    constraints: '1 ≤ n ≤ 2³¹ - 1',
    templateCode: `#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    int hammingWeight(int n) {\n        // Write your solution here\n\n    }\n};\n\nint main() {\n    Solution sol;\n    cout<<"Test 1: "<<(sol.hammingWeight(11)==3?"PASS":"FAIL")<<"\\\\n";\n    cout<<"Test 2: "<<(sol.hammingWeight(128)==1?"PASS":"FAIL")<<"\\\\n";\n    cout<<"Test 3: "<<(sol.hammingWeight(7)==3?"PASS":"FAIL")<<"\\\\n";\n    cout<<"Test 4: "<<(sol.hammingWeight(1)==1?"PASS":"FAIL")<<"\\\\n";\n    return 0;\n}`,
  },
  {
    id: 198,
    title: 'House Robber',
    difficulty: 'Medium',
    topic: 'Array, DP',
    url: 'https://leetcode.com/problems/house-robber/',
    description: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.\n\nGiven an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.`,
    examples: [
      { input: 'nums = [1,2,3,1]', output: '4', explanation: 'Rob house 1 (money = 1) and then rob house 3 (money = 3). Total = 1 + 3 = 4.' },
      { input: 'nums = [2,7,9,3,1]', output: '12', explanation: 'Rob house 1 (2), house 3 (9), and house 5 (1). Total = 2 + 9 + 1 = 12.' },
    ],
    constraints: '1 ≤ nums.length ≤ 100\n0 ≤ nums[i] ≤ 400',
    templateCode: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int rob(vector<int>& nums) {\n        // Write your solution here\n\n    }\n};\n\nint main() {\n    Solution sol;\n    { vector<int> n={1,2,3,1}; cout<<"Test 1: "<<(sol.rob(n)==4?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> n={2,7,9,3,1}; cout<<"Test 2: "<<(sol.rob(n)==12?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> n={0}; cout<<"Test 3: "<<(sol.rob(n)==0?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> n={100}; cout<<"Test 4: "<<(sol.rob(n)==100?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> n={2,1,1,2}; cout<<"Test 5: "<<(sol.rob(n)==4?"PASS":"FAIL")<<"\\\\n"; }\n    return 0;\n}`,
  },
  {
    id: 226,
    title: 'Invert Binary Tree',
    difficulty: 'Easy',
    topic: 'Binary Tree, DFS, BFS',
    url: 'https://leetcode.com/problems/invert-binary-tree/',
    description: `Given the root of a binary tree, invert the tree, and return its root.\n\nInverting a tree means swapping every left child with its corresponding right child.`,
    examples: [
      { input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]' },
      { input: 'root = [2,1,3]', output: '[2,3,1]' },
      { input: 'root = []', output: '[]' },
    ],
    constraints: 'The number of nodes in the tree is in the range [0, 100].\n-100 ≤ Node.val ≤ 100',
    templateCode: `#include <iostream>\nusing namespace std;\n\nstruct TreeNode {\n    int val; TreeNode *left; TreeNode *right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nclass Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        // Write your solution here\n\n    }\n};\n\nint main() {\n    Solution sol;\n    { TreeNode* r=new TreeNode(4); r->left=new TreeNode(2); r->right=new TreeNode(7); r->left->left=new TreeNode(1); r->left->right=new TreeNode(3); r->right->left=new TreeNode(6); r->right->right=new TreeNode(9); auto res=sol.invertTree(r); cout<<"Test 1: "<<(res->left->val==7&&res->right->val==2?"PASS":"FAIL")<<"\\\\n"; }\n    { TreeNode* r=new TreeNode(2); r->left=new TreeNode(1); r->right=new TreeNode(3); auto res=sol.invertTree(r); cout<<"Test 2: "<<(res->left->val==3&&res->right->val==1?"PASS":"FAIL")<<"\\\\n"; }\n    { cout<<"Test 3: "<<(sol.invertTree(nullptr)==nullptr?"PASS":"FAIL")<<"\\\\n"; }\n    return 0;\n}`,
  },
  {
    id: 322,
    title: 'Coin Change',
    difficulty: 'Medium',
    topic: 'Array, DP, BFS',
    url: 'https://leetcode.com/problems/coin-change/',
    description: `You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.\n\nYou may assume that you have an infinite number of each kind of coin.`,
    examples: [
      { input: 'coins = [1,5,10], amount = 12', output: '3', explanation: '12 = 10 + 1 + 1' },
      { input: 'coins = [2], amount = 3', output: '-1' },
      { input: 'coins = [1], amount = 0', output: '0' },
    ],
    constraints: '1 ≤ coins.length ≤ 12\n1 ≤ coins[i] ≤ 2³¹ - 1\n0 ≤ amount ≤ 10⁴',
    templateCode: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        // Write your solution here\n\n    }\n};\n\nint main() {\n    Solution sol;\n    { vector<int> c={1,5,10}; cout<<"Test 1: "<<(sol.coinChange(c,12)==3?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> c={2}; cout<<"Test 2: "<<(sol.coinChange(c,3)==-1?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> c={1}; cout<<"Test 3: "<<(sol.coinChange(c,0)==0?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> c={1,2,5}; cout<<"Test 4: "<<(sol.coinChange(c,11)==3?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> c={2}; cout<<"Test 5: "<<(sol.coinChange(c,0)==0?"PASS":"FAIL")<<"\\\\n"; }\n    return 0;\n}`,
  },
  {
    id: 46,
    title: 'Permutations',
    difficulty: 'Medium',
    topic: 'Array, Backtracking',
    url: 'https://leetcode.com/problems/permutations/',
    description: `Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.`,
    examples: [
      { input: 'nums = [1,2,3]', output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]' },
      { input: 'nums = [0,1]', output: '[[0,1],[1,0]]' },
      { input: 'nums = [1]', output: '[[1]]' },
    ],
    constraints: '1 ≤ nums.length ≤ 6\n-10 ≤ nums[i] ≤ 10\nAll the integers of nums are unique.',
    templateCode: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> permute(vector<int>& nums) {\n        // Write your solution here\n\n    }\n};\n\nint main() {\n    Solution sol;\n    { vector<int> n={1,2,3}; auto r=sol.permute(n); cout<<"Test 1: "<<(r.size()==6?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> n={0,1}; auto r=sol.permute(n); cout<<"Test 2: "<<(r.size()==2?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> n={1}; auto r=sol.permute(n); cout<<"Test 3: "<<(r.size()==1?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> n={1,2,3,4}; auto r=sol.permute(n); cout<<"Test 4: "<<(r.size()==24?"PASS":"FAIL")<<"\\\\n"; }\n    return 0;\n}`,
  },
  {
    id: 215,
    title: 'Kth Largest Element in an Array',
    difficulty: 'Medium',
    topic: 'Array, Heap, Sorting',
    url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
    description: `Given an integer array nums and an integer k, return the kth largest element in the array.\n\nNote that it is the kth largest element in the sorted order, not the kth distinct element.\n\nCan you solve it without sorting?`,
    examples: [
      { input: 'nums = [3,2,1,5,6,4], k = 2', output: '5' },
      { input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4', output: '4' },
    ],
    constraints: '1 ≤ k ≤ nums.length ≤ 10⁵\n-10⁴ ≤ nums[i] ≤ 10⁴',
    templateCode: `#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findKthLargest(vector<int>& nums, int k) {\n        // Write your solution here\n\n    }\n};\n\nint main() {\n    Solution sol;\n    { vector<int> n={3,2,1,5,6,4}; cout<<"Test 1: "<<(sol.findKthLargest(n,2)==5?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> n={3,2,3,1,2,4,5,5,6}; cout<<"Test 2: "<<(sol.findKthLargest(n,4)==4?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> n={1}; cout<<"Test 3: "<<(sol.findKthLargest(n,1)==1?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> n={-1,-2,-3,-4}; cout<<"Test 4: "<<(sol.findKthLargest(n,2)==-2?"PASS":"FAIL")<<"\\\\n"; }\n    return 0;\n}`,
  },
  {
    id: 300,
    title: 'Longest Increasing Subsequence',
    difficulty: 'Medium',
    topic: 'Array, Binary Search, DP',
    url: 'https://leetcode.com/problems/longest-increasing-subsequence/',
    description: `Given an integer array nums, return the length of the longest strictly increasing subsequence.`,
    examples: [
      { input: 'nums = [10,9,2,5,3,7,101,18]', output: '4', explanation: 'The longest increasing subsequence is [2,3,7,101], therefore the length is 4.' },
      { input: 'nums = [0,1,0,3,2,3]', output: '4' },
      { input: 'nums = [7,7,7,7,7,7,7]', output: '1' },
    ],
    constraints: '1 ≤ nums.length ≤ 2500\n-10⁴ ≤ nums[i] ≤ 10⁴',
    templateCode: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLIS(vector<int>& nums) {\n        // Write your solution here\n\n    }\n};\n\nint main() {\n    Solution sol;\n    { vector<int> n={10,9,2,5,3,7,101,18}; cout<<"Test 1: "<<(sol.lengthOfLIS(n)==4?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> n={0,1,0,3,2,3}; cout<<"Test 2: "<<(sol.lengthOfLIS(n)==4?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> n={7,7,7,7,7,7,7}; cout<<"Test 3: "<<(sol.lengthOfLIS(n)==1?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> n={1,2,3,4,5}; cout<<"Test 4: "<<(sol.lengthOfLIS(n)==5?"PASS":"FAIL")<<"\\\\n"; }\n    return 0;\n}`,
  },
  {
    id: 39,
    title: 'Combination Sum',
    difficulty: 'Medium',
    topic: 'Array, Backtracking',
    url: 'https://leetcode.com/problems/combination-sum/',
    description: `Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order.\n\nThe same number may be chosen from candidates an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.`,
    examples: [
      { input: 'candidates = [2,3,6,7], target = 7', output: '[[2,2,3],[7]]' },
      { input: 'candidates = [2,3,5], target = 8', output: '[[2,2,2,2],[2,3,3],[3,5]]' },
      { input: 'candidates = [2], target = 1', output: '[]' },
    ],
    constraints: '1 ≤ candidates.length ≤ 30\n2 ≤ candidates[i] ≤ 40\nAll elements of candidates are distinct.\n1 ≤ target ≤ 40',
    templateCode: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {\n        // Write your solution here\n\n    }\n};\n\nint main() {\n    Solution sol;\n    { vector<int> c={2,3,6,7}; auto r=sol.combinationSum(c,7); sort(r.begin(),r.end()); cout<<"Test 1: "<<(r.size()==2?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> c={2,3,5}; auto r=sol.combinationSum(c,8); cout<<"Test 2: "<<(r.size()==3?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> c={2}; auto r=sol.combinationSum(c,1); cout<<"Test 3: "<<(r.empty()?"PASS":"FAIL")<<"\\\\n"; }\n    return 0;\n}`,
  },
  {
    id: 55,
    title: 'Jump Game',
    difficulty: '3 Stars',
    topic: 'Array, Greedy, DP',
    url: 'https://leetcode.com/problems/jump-game/',
    description: `You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.\n\nReturn true if you can reach the last index, or false otherwise.`,
    examples: [
      { input: 'nums = [2,3,1,1,4]', output: 'true', explanation: 'Jump 1 step from index 0 to 1, then 3 steps to the last index.' },
      { input: 'nums = [3,2,1,0,4]', output: 'false', explanation: 'You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible.' },
    ],
    constraints: '1 ≤ nums.length ≤ 10⁴\n0 ≤ nums[i] ≤ 10⁵',
    templateCode: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool canJump(vector<int>& nums) {\n        // Write your solution here\n\n    }\n};\n\nint main() {\n    Solution sol;\n    { vector<int> n={2,3,1,1,4}; cout<<"Test 1: "<<(sol.canJump(n)?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> n={3,2,1,0,4}; cout<<"Test 2: "<<(!sol.canJump(n)?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> n={0}; cout<<"Test 3: "<<(sol.canJump(n)?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> n={2,0,0}; cout<<"Test 4: "<<(sol.canJump(n)?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> n={1,0,1,0}; cout<<"Test 5: "<<(!sol.canJump(n)?"PASS":"FAIL")<<"\\\\n"; }\n    return 0;\n}`,
  },
  {
    id: 23,
    title: 'Merge k Sorted Lists',
    difficulty: '5 Stars',
    topic: 'Linked List, Heap, Divide and Conquer',
    url: 'https://leetcode.com/problems/merge-k-sorted-lists/',
    description: `You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.`,
    examples: [
      { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]' },
      { input: 'lists = []', output: '[]' },
      { input: 'lists = [[]]', output: '[]' },
    ],
    constraints: 'k == lists.length\n0 ≤ k ≤ 10⁴\n0 ≤ lists[i].length ≤ 500\n-10⁴ ≤ lists[i][j] ≤ 10⁴\nlists[i] is sorted in ascending order.\nThe sum of lists[i].length will not exceed 10⁴.',
    templateCode: `#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nstruct ListNode {\n    int val; ListNode *next;\n    ListNode() : val(0), next(nullptr) {}\n    ListNode(int x) : val(x), next(nullptr) {}\n};\n\nclass Solution {\npublic:\n    ListNode* mergeKLists(vector<ListNode*>& lists) {\n        // Write your solution here\n\n    }\n};\n\nListNode* makeList(vector<int> v) { ListNode* h=nullptr; ListNode** p=&h; for(int x:v){*p=new ListNode(x);p=&(*p)->next;} return h; }\nbool checkList(ListNode* l, vector<int> e) { for(int x:e){if(!l||l->val!=x)return false;l=l->next;} return !l; }\n\nint main() {\n    Solution sol;\n    { vector<ListNode*> ls={makeList({1,4,5}),makeList({1,3,4}),makeList({2,6})}; cout<<"Test 1: "<<(checkList(sol.mergeKLists(ls),{1,1,2,3,4,4,5,6})?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<ListNode*> ls={}; cout<<"Test 2: "<<(checkList(sol.mergeKLists(ls),{})?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<ListNode*> ls={makeList({})}; cout<<"Test 3: "<<(checkList(sol.mergeKLists(ls),{})?"PASS":"FAIL")<<"\\\\n"; }\n    return 0;\n}`,
  },
  {
    id: 48,
    title: 'Rotate Image',
    difficulty: '3 Stars',
    topic: 'Array, Matrix, Math',
    url: 'https://leetcode.com/problems/rotate-image/',
    description: `You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).\n\nYou have to rotate the image in-place, which means you have to modify the input 2D matrix directly. DO NOT allocate another 2D matrix and do the rotation.`,
    examples: [
      { input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[[7,4,1],[8,5,2],[9,6,3]]' },
      { input: 'matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]', output: '[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]' },
    ],
    constraints: 'n == matrix.length == matrix[i].length\n1 ≤ n ≤ 20\n-1000 ≤ matrix[i][j] ≤ 1000',
    templateCode: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    void rotate(vector<vector<int>>& matrix) {\n        // Write your solution here\n\n    }\n};\n\nint main() {\n    Solution sol;\n    { vector<vector<int>> m={{1,2,3},{4,5,6},{7,8,9}}; sol.rotate(m); cout<<"Test 1: "<<(m==vector<vector<int>>{{7,4,1},{8,5,2},{9,6,3}}?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<vector<int>> m={{1,2},{3,4}}; sol.rotate(m); cout<<"Test 2: "<<(m==vector<vector<int>>{{3,1},{4,2}}?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<vector<int>> m={{1}}; sol.rotate(m); cout<<"Test 3: "<<(m==vector<vector<int>>{{1}}?"PASS":"FAIL")<<"\\\\n"; }\n    return 0;\n}`,
  },
  {
    id: 236,
    title: 'Lowest Common Ancestor of a Binary Tree',
    difficulty: '4 Stars',
    topic: 'Binary Tree, DFS',
    url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/',
    description: `Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.\n\nAccording to the definition of LCA: "The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself)."`,
    examples: [
      { input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1', output: '3', explanation: 'The LCA of nodes 5 and 1 is 3.' },
      { input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4', output: '5', explanation: 'The LCA of nodes 5 and 4 is 5, since a node can be a descendant of itself.' },
    ],
    constraints: 'The number of nodes in the tree is in the range [2, 10⁵].\n-10⁹ ≤ Node.val ≤ 10⁹\nAll Node.val are unique.\np != q\np and q will exist in the tree.',
    templateCode: `#include <iostream>\nusing namespace std;\n\nstruct TreeNode {\n    int val; TreeNode *left; TreeNode *right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nclass Solution {\npublic:\n    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n        // Write your solution here\n\n    }\n};\n\nint main() {\n    Solution sol;\n    TreeNode *n3=new TreeNode(3),*n5=new TreeNode(5),*n1=new TreeNode(1),*n6=new TreeNode(6),*n2=new TreeNode(2),*n0=new TreeNode(0),*n8=new TreeNode(8),*n7=new TreeNode(7),*n4=new TreeNode(4);\n    n3->left=n5; n3->right=n1; n5->left=n6; n5->right=n2; n1->left=n0; n1->right=n8; n2->left=n7; n2->right=n4;\n    cout<<"Test 1: "<<(sol.lowestCommonAncestor(n3,n5,n1)->val==3?"PASS":"FAIL")<<"\\\\n";\n    cout<<"Test 2: "<<(sol.lowestCommonAncestor(n3,n5,n4)->val==5?"PASS":"FAIL")<<"\\\\n";\n    cout<<"Test 3: "<<(sol.lowestCommonAncestor(n3,n6,n4)->val==5?"PASS":"FAIL")<<"\\\\n";\n    return 0;\n}`,
  },
  {
    id: 347,
    title: 'Top K Frequent Elements',
    difficulty: '3 Stars',
    topic: 'Array, Hash Table, Heap',
    url: 'https://leetcode.com/problems/top-k-frequent-elements/',
    description: `Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.`,
    examples: [
      { input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1,2]' },
      { input: 'nums = [1], k = 1', output: '[1]' },
    ],
    constraints: '1 ≤ nums.length ≤ 10⁵\n-10⁴ ≤ nums[i] ≤ 10⁴\nk is in the range [1, the number of unique elements in the array].\nIt is guaranteed that the answer is unique.',
    templateCode: `#include <iostream>\n#include <vector>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> topKFrequent(vector<int>& nums, int k) {\n        // Write your solution here\n\n    }\n};\n\nint main() {\n    Solution sol;\n    { vector<int> n={1,1,1,2,2,3}; auto r=sol.topKFrequent(n,2); sort(r.begin(),r.end()); cout<<"Test 1: "<<(r==vector<int>{1,2}?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> n={1}; auto r=sol.topKFrequent(n,1); cout<<"Test 2: "<<(r==vector<int>{1}?"PASS":"FAIL")<<"\\\\n"; }\n    { vector<int> n={4,1,-1,2,-1,2,3}; auto r=sol.topKFrequent(n,2); sort(r.begin(),r.end()); cout<<"Test 3: "<<(r==vector<int>{-1,2}?"PASS":"FAIL")<<"\\\\n"; }\n    return 0;\n}`,
  },
];

export const SQL_PROBLEMS = [
  {
    id: 2000,
    title: 'SQL Problem 1',
    difficulty: '1 Star',
    topic: 'Core SQL',
    url: '#',
    description: `This is problem 1 for SQL\n\nDifficulty Level: 1 Star.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `-- Write your MySQL query statement\nSELECT * FROM dual;`
  },
  {
    id: 2001,
    title: 'SQL Problem 2',
    difficulty: '1 Star',
    topic: 'Core SQL',
    url: '#',
    description: `This is problem 2 for SQL\n\nDifficulty Level: 1 Star.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `-- Write your MySQL query statement\nSELECT * FROM dual;`
  },
  {
    id: 2002,
    title: 'SQL Problem 3',
    difficulty: '1 Star',
    topic: 'Core SQL',
    url: '#',
    description: `This is problem 3 for SQL\n\nDifficulty Level: 1 Star.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `-- Write your MySQL query statement\nSELECT * FROM dual;`
  },
  {
    id: 2003,
    title: 'SQL Problem 4',
    difficulty: '2 Stars',
    topic: 'Core SQL',
    url: '#',
    description: `This is problem 4 for SQL\n\nDifficulty Level: 2 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `-- Write your MySQL query statement\nSELECT * FROM dual;`
  },
  {
    id: 2004,
    title: 'SQL Problem 5',
    difficulty: '2 Stars',
    topic: 'Core SQL',
    url: '#',
    description: `This is problem 5 for SQL\n\nDifficulty Level: 2 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `-- Write your MySQL query statement\nSELECT * FROM dual;`
  },
  {
    id: 2005,
    title: 'SQL Problem 6',
    difficulty: '2 Stars',
    topic: 'Core SQL',
    url: '#',
    description: `This is problem 6 for SQL\n\nDifficulty Level: 2 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `-- Write your MySQL query statement\nSELECT * FROM dual;`
  },
  {
    id: 2006,
    title: 'SQL Problem 7',
    difficulty: '3 Stars',
    topic: 'Core SQL',
    url: '#',
    description: `This is problem 7 for SQL\n\nDifficulty Level: 3 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `-- Write your MySQL query statement\nSELECT * FROM dual;`
  },
  {
    id: 2007,
    title: 'SQL Problem 8',
    difficulty: '3 Stars',
    topic: 'Core SQL',
    url: '#',
    description: `This is problem 8 for SQL\n\nDifficulty Level: 3 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `-- Write your MySQL query statement\nSELECT * FROM dual;`
  },
  {
    id: 2008,
    title: 'SQL Problem 9',
    difficulty: '3 Stars',
    topic: 'Core SQL',
    url: '#',
    description: `This is problem 9 for SQL\n\nDifficulty Level: 3 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `-- Write your MySQL query statement\nSELECT * FROM dual;`
  },
  {
    id: 2009,
    title: 'SQL Problem 10',
    difficulty: '4 Stars',
    topic: 'Core SQL',
    url: '#',
    description: `This is problem 10 for SQL\n\nDifficulty Level: 4 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `-- Write your MySQL query statement\nSELECT * FROM dual;`
  },
  {
    id: 2010,
    title: 'SQL Problem 11',
    difficulty: '4 Stars',
    topic: 'Core SQL',
    url: '#',
    description: `This is problem 11 for SQL\n\nDifficulty Level: 4 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `-- Write your MySQL query statement\nSELECT * FROM dual;`
  },
  {
    id: 2011,
    title: 'SQL Problem 12',
    difficulty: '4 Stars',
    topic: 'Core SQL',
    url: '#',
    description: `This is problem 12 for SQL\n\nDifficulty Level: 4 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `-- Write your MySQL query statement\nSELECT * FROM dual;`
  },
  {
    id: 2012,
    title: 'SQL Problem 13',
    difficulty: '5 Stars',
    topic: 'Core SQL',
    url: '#',
    description: `This is problem 13 for SQL\n\nDifficulty Level: 5 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `-- Write your MySQL query statement\nSELECT * FROM dual;`
  },
  {
    id: 2013,
    title: 'SQL Problem 14',
    difficulty: '5 Stars',
    topic: 'Core SQL',
    url: '#',
    description: `This is problem 14 for SQL\n\nDifficulty Level: 5 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `-- Write your MySQL query statement\nSELECT * FROM dual;`
  },
  {
    id: 2014,
    title: 'SQL Problem 15',
    difficulty: '5 Stars',
    topic: 'Core SQL',
    url: '#',
    description: `This is problem 15 for SQL\n\nDifficulty Level: 5 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `-- Write your MySQL query statement\nSELECT * FROM dual;`
  },
];

export const PYTHON_PROBLEMS = [
  {
    id: 3000,
    title: 'Python Problem 1',
    difficulty: '1 Star',
    topic: 'Core Python',
    url: '#',
    description: `This is problem 1 for Python\n\nDifficulty Level: 1 Star.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `class Solution:\n    def solve(self):\n        # Your code here\n        pass`
  },
  {
    id: 3001,
    title: 'Python Problem 2',
    difficulty: '1 Star',
    topic: 'Core Python',
    url: '#',
    description: `This is problem 2 for Python\n\nDifficulty Level: 1 Star.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `class Solution:\n    def solve(self):\n        # Your code here\n        pass`
  },
  {
    id: 3002,
    title: 'Python Problem 3',
    difficulty: '1 Star',
    topic: 'Core Python',
    url: '#',
    description: `This is problem 3 for Python\n\nDifficulty Level: 1 Star.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `class Solution:\n    def solve(self):\n        # Your code here\n        pass`
  },
  {
    id: 3003,
    title: 'Python Problem 4',
    difficulty: '2 Stars',
    topic: 'Core Python',
    url: '#',
    description: `This is problem 4 for Python\n\nDifficulty Level: 2 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `class Solution:\n    def solve(self):\n        # Your code here\n        pass`
  },
  {
    id: 3004,
    title: 'Python Problem 5',
    difficulty: '2 Stars',
    topic: 'Core Python',
    url: '#',
    description: `This is problem 5 for Python\n\nDifficulty Level: 2 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `class Solution:\n    def solve(self):\n        # Your code here\n        pass`
  },
  {
    id: 3005,
    title: 'Python Problem 6',
    difficulty: '2 Stars',
    topic: 'Core Python',
    url: '#',
    description: `This is problem 6 for Python\n\nDifficulty Level: 2 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `class Solution:\n    def solve(self):\n        # Your code here\n        pass`
  },
  {
    id: 3006,
    title: 'Python Problem 7',
    difficulty: '3 Stars',
    topic: 'Core Python',
    url: '#',
    description: `This is problem 7 for Python\n\nDifficulty Level: 3 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `class Solution:\n    def solve(self):\n        # Your code here\n        pass`
  },
  {
    id: 3007,
    title: 'Python Problem 8',
    difficulty: '3 Stars',
    topic: 'Core Python',
    url: '#',
    description: `This is problem 8 for Python\n\nDifficulty Level: 3 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `class Solution:\n    def solve(self):\n        # Your code here\n        pass`
  },
  {
    id: 3008,
    title: 'Python Problem 9',
    difficulty: '3 Stars',
    topic: 'Core Python',
    url: '#',
    description: `This is problem 9 for Python\n\nDifficulty Level: 3 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `class Solution:\n    def solve(self):\n        # Your code here\n        pass`
  },
  {
    id: 3009,
    title: 'Python Problem 10',
    difficulty: '4 Stars',
    topic: 'Core Python',
    url: '#',
    description: `This is problem 10 for Python\n\nDifficulty Level: 4 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `class Solution:\n    def solve(self):\n        # Your code here\n        pass`
  },
  {
    id: 3010,
    title: 'Python Problem 11',
    difficulty: '4 Stars',
    topic: 'Core Python',
    url: '#',
    description: `This is problem 11 for Python\n\nDifficulty Level: 4 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `class Solution:\n    def solve(self):\n        # Your code here\n        pass`
  },
  {
    id: 3011,
    title: 'Python Problem 12',
    difficulty: '4 Stars',
    topic: 'Core Python',
    url: '#',
    description: `This is problem 12 for Python\n\nDifficulty Level: 4 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `class Solution:\n    def solve(self):\n        # Your code here\n        pass`
  },
  {
    id: 3012,
    title: 'Python Problem 13',
    difficulty: '5 Stars',
    topic: 'Core Python',
    url: '#',
    description: `This is problem 13 for Python\n\nDifficulty Level: 5 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `class Solution:\n    def solve(self):\n        # Your code here\n        pass`
  },
  {
    id: 3013,
    title: 'Python Problem 14',
    difficulty: '5 Stars',
    topic: 'Core Python',
    url: '#',
    description: `This is problem 14 for Python\n\nDifficulty Level: 5 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `class Solution:\n    def solve(self):\n        # Your code here\n        pass`
  },
  {
    id: 3014,
    title: 'Python Problem 15',
    difficulty: '5 Stars',
    topic: 'Core Python',
    url: '#',
    description: `This is problem 15 for Python\n\nDifficulty Level: 5 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `class Solution:\n    def solve(self):\n        # Your code here\n        pass`
  },
];

export const JAVA_PROBLEMS = [
  {
    id: 4000,
    title: 'Java Problem 1',
    difficulty: '1 Star',
    topic: 'Core Java',
    url: '#',
    description: `This is problem 1 for Java\n\nDifficulty Level: 1 Star.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`
  },
  {
    id: 4001,
    title: 'Java Problem 2',
    difficulty: '1 Star',
    topic: 'Core Java',
    url: '#',
    description: `This is problem 2 for Java\n\nDifficulty Level: 1 Star.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`
  },
  {
    id: 4002,
    title: 'Java Problem 3',
    difficulty: '1 Star',
    topic: 'Core Java',
    url: '#',
    description: `This is problem 3 for Java\n\nDifficulty Level: 1 Star.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`
  },
  {
    id: 4003,
    title: 'Java Problem 4',
    difficulty: '2 Stars',
    topic: 'Core Java',
    url: '#',
    description: `This is problem 4 for Java\n\nDifficulty Level: 2 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`
  },
  {
    id: 4004,
    title: 'Java Problem 5',
    difficulty: '2 Stars',
    topic: 'Core Java',
    url: '#',
    description: `This is problem 5 for Java\n\nDifficulty Level: 2 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`
  },
  {
    id: 4005,
    title: 'Java Problem 6',
    difficulty: '2 Stars',
    topic: 'Core Java',
    url: '#',
    description: `This is problem 6 for Java\n\nDifficulty Level: 2 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`
  },
  {
    id: 4006,
    title: 'Java Problem 7',
    difficulty: '3 Stars',
    topic: 'Core Java',
    url: '#',
    description: `This is problem 7 for Java\n\nDifficulty Level: 3 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`
  },
  {
    id: 4007,
    title: 'Java Problem 8',
    difficulty: '3 Stars',
    topic: 'Core Java',
    url: '#',
    description: `This is problem 8 for Java\n\nDifficulty Level: 3 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`
  },
  {
    id: 4008,
    title: 'Java Problem 9',
    difficulty: '3 Stars',
    topic: 'Core Java',
    url: '#',
    description: `This is problem 9 for Java\n\nDifficulty Level: 3 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`
  },
  {
    id: 4009,
    title: 'Java Problem 10',
    difficulty: '4 Stars',
    topic: 'Core Java',
    url: '#',
    description: `This is problem 10 for Java\n\nDifficulty Level: 4 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`
  },
  {
    id: 4010,
    title: 'Java Problem 11',
    difficulty: '4 Stars',
    topic: 'Core Java',
    url: '#',
    description: `This is problem 11 for Java\n\nDifficulty Level: 4 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`
  },
  {
    id: 4011,
    title: 'Java Problem 12',
    difficulty: '4 Stars',
    topic: 'Core Java',
    url: '#',
    description: `This is problem 12 for Java\n\nDifficulty Level: 4 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`
  },
  {
    id: 4012,
    title: 'Java Problem 13',
    difficulty: '5 Stars',
    topic: 'Core Java',
    url: '#',
    description: `This is problem 13 for Java\n\nDifficulty Level: 5 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`
  },
  {
    id: 4013,
    title: 'Java Problem 14',
    difficulty: '5 Stars',
    topic: 'Core Java',
    url: '#',
    description: `This is problem 14 for Java\n\nDifficulty Level: 5 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`
  },
  {
    id: 4014,
    title: 'Java Problem 15',
    difficulty: '5 Stars',
    topic: 'Core Java',
    url: '#',
    description: `This is problem 15 for Java\n\nDifficulty Level: 5 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`
  },
];

export const JS_PROBLEMS = [
  {
    id: 5000,
    title: 'JavaScript Problem 1',
    difficulty: '1 Star',
    topic: 'Core JavaScript',
    url: '#',
    description: `This is problem 1 for JavaScript\n\nDifficulty Level: 1 Star.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `function solve() {\n    // Your code here\n}\n`
  },
  {
    id: 5001,
    title: 'JavaScript Problem 2',
    difficulty: '1 Star',
    topic: 'Core JavaScript',
    url: '#',
    description: `This is problem 2 for JavaScript\n\nDifficulty Level: 1 Star.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `function solve() {\n    // Your code here\n}\n`
  },
  {
    id: 5002,
    title: 'JavaScript Problem 3',
    difficulty: '1 Star',
    topic: 'Core JavaScript',
    url: '#',
    description: `This is problem 3 for JavaScript\n\nDifficulty Level: 1 Star.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `function solve() {\n    // Your code here\n}\n`
  },
  {
    id: 5003,
    title: 'JavaScript Problem 4',
    difficulty: '2 Stars',
    topic: 'Core JavaScript',
    url: '#',
    description: `This is problem 4 for JavaScript\n\nDifficulty Level: 2 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `function solve() {\n    // Your code here\n}\n`
  },
  {
    id: 5004,
    title: 'JavaScript Problem 5',
    difficulty: '2 Stars',
    topic: 'Core JavaScript',
    url: '#',
    description: `This is problem 5 for JavaScript\n\nDifficulty Level: 2 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `function solve() {\n    // Your code here\n}\n`
  },
  {
    id: 5005,
    title: 'JavaScript Problem 6',
    difficulty: '2 Stars',
    topic: 'Core JavaScript',
    url: '#',
    description: `This is problem 6 for JavaScript\n\nDifficulty Level: 2 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `function solve() {\n    // Your code here\n}\n`
  },
  {
    id: 5006,
    title: 'JavaScript Problem 7',
    difficulty: '3 Stars',
    topic: 'Core JavaScript',
    url: '#',
    description: `This is problem 7 for JavaScript\n\nDifficulty Level: 3 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `function solve() {\n    // Your code here\n}\n`
  },
  {
    id: 5007,
    title: 'JavaScript Problem 8',
    difficulty: '3 Stars',
    topic: 'Core JavaScript',
    url: '#',
    description: `This is problem 8 for JavaScript\n\nDifficulty Level: 3 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `function solve() {\n    // Your code here\n}\n`
  },
  {
    id: 5008,
    title: 'JavaScript Problem 9',
    difficulty: '3 Stars',
    topic: 'Core JavaScript',
    url: '#',
    description: `This is problem 9 for JavaScript\n\nDifficulty Level: 3 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `function solve() {\n    // Your code here\n}\n`
  },
  {
    id: 5009,
    title: 'JavaScript Problem 10',
    difficulty: '4 Stars',
    topic: 'Core JavaScript',
    url: '#',
    description: `This is problem 10 for JavaScript\n\nDifficulty Level: 4 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `function solve() {\n    // Your code here\n}\n`
  },
  {
    id: 5010,
    title: 'JavaScript Problem 11',
    difficulty: '4 Stars',
    topic: 'Core JavaScript',
    url: '#',
    description: `This is problem 11 for JavaScript\n\nDifficulty Level: 4 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `function solve() {\n    // Your code here\n}\n`
  },
  {
    id: 5011,
    title: 'JavaScript Problem 12',
    difficulty: '4 Stars',
    topic: 'Core JavaScript',
    url: '#',
    description: `This is problem 12 for JavaScript\n\nDifficulty Level: 4 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `function solve() {\n    // Your code here\n}\n`
  },
  {
    id: 5012,
    title: 'JavaScript Problem 13',
    difficulty: '5 Stars',
    topic: 'Core JavaScript',
    url: '#',
    description: `This is problem 13 for JavaScript\n\nDifficulty Level: 5 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `function solve() {\n    // Your code here\n}\n`
  },
  {
    id: 5013,
    title: 'JavaScript Problem 14',
    difficulty: '5 Stars',
    topic: 'Core JavaScript',
    url: '#',
    description: `This is problem 14 for JavaScript\n\nDifficulty Level: 5 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `function solve() {\n    // Your code here\n}\n`
  },
  {
    id: 5014,
    title: 'JavaScript Problem 15',
    difficulty: '5 Stars',
    topic: 'Core JavaScript',
    url: '#',
    description: `This is problem 15 for JavaScript\n\nDifficulty Level: 5 Stars.\n\nPlease write your solution below to solve the given task.`,
    examples: [
      { input: 'None', output: 'None', explanation: 'Generic explanation' }
    ],
    constraints: 'Standard constraints apply.',
    templateCode: `function solve() {\n    // Your code here\n}\n`
  },
];

