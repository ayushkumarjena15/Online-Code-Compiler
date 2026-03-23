import { useState } from 'react';
import { Code2, Database, Cpu, Layers, ChevronRight, Play, ExternalLink } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'dsa',
    name: 'DSA',
    fullName: 'Data Structures & Algorithms',
    icon: <Cpu size={20} />,
    color: '#3b82f6',
    topics: [
      {
        title: 'Arrays & Two Pointers',
        description: 'Solve array problems efficiently using the two-pointer technique to avoid O(n²) complexity.',
        difficulty: 'Beginner',
        language: 'python',
        code: `# Two Pointers — find pair that sums to target
def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        s = arr[left] + arr[right]
        if s == target:
            return (left, right)
        elif s < target:
            left += 1
        else:
            right -= 1
    return None

arr = [1, 3, 5, 7, 9, 11]
print(two_sum_sorted(arr, 14))  # (2, 5) → 5+9

# Also: reverse array in-place
def reverse(arr):
    l, r = 0, len(arr) - 1
    while l < r:
        arr[l], arr[r] = arr[r], arr[l]
        l += 1; r -= 1
    return arr

print(reverse([1, 2, 3, 4, 5]))
`,
      },
      {
        title: 'Sliding Window',
        description: 'Find max/min subarrays or substrings of size k in linear time with a sliding window.',
        difficulty: 'Beginner',
        language: 'python',
        code: `# Max sum subarray of size k — O(n)
def max_subarray_sum(arr, k):
    window_sum = sum(arr[:k])
    max_sum = window_sum
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum

print(max_subarray_sum([2, 1, 5, 1, 3, 2], 3))  # 9

# Longest substring with at most k distinct chars
def longest_k_distinct(s, k):
    freq = {}
    left = result = 0
    for right, ch in enumerate(s):
        freq[ch] = freq.get(ch, 0) + 1
        while len(freq) > k:
            freq[s[left]] -= 1
            if freq[s[left]] == 0:
                del freq[s[left]]
            left += 1
        result = max(result, right - left + 1)
    return result

print(longest_k_distinct("araaci", 2))  # 4
`,
      },
      {
        title: 'Linked List',
        description: 'Build and manipulate singly linked lists — reversal, cycle detection, and merging.',
        difficulty: 'Beginner',
        language: 'python',
        code: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

# Reverse a linked list iteratively
def reverse(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev

# Detect cycle — Floyd's algorithm
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False

# Build: 1 -> 2 -> 3 -> 4
head = Node(1)
head.next = Node(2)
head.next.next = Node(3)
head.next.next.next = Node(4)

rev = reverse(head)
node, vals = rev, []
while node:
    vals.append(node.val)
    node = node.next
print("Reversed:", vals)  # [4, 3, 2, 1]
`,
      },
      {
        title: 'Stack & Queue',
        description: 'Use stacks for balanced parentheses and monotonic problems; queues for BFS.',
        difficulty: 'Beginner',
        language: 'python',
        code: `from collections import deque

# Stack: valid parentheses
def is_valid(s):
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for ch in s:
        if ch in '([{':
            stack.append(ch)
        elif not stack or stack[-1] != pairs[ch]:
            return False
        else:
            stack.pop()
    return len(stack) == 0

print(is_valid("()[]{}"))   # True
print(is_valid("(]"))       # False

# Queue: BFS shortest path in grid
def bfs(grid, start, end):
    rows, cols = len(grid), len(grid[0])
    queue = deque([(start, 0)])
    visited = {start}
    while queue:
        (r, c), dist = queue.popleft()
        if (r, c) == end:
            return dist
        for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            nr, nc = r+dr, c+dc
            if 0<=nr<rows and 0<=nc<cols and grid[nr][nc]==0 and (nr,nc) not in visited:
                visited.add((nr, nc))
                queue.append(((nr, nc), dist+1))
    return -1

grid = [[0,0,0],[0,1,0],[0,0,0]]
print(bfs(grid, (0,0), (2,2)))  # 4
`,
      },
      {
        title: 'Binary Search',
        description: 'Cut search space in half each step. Applies to sorted arrays, answer-space problems.',
        difficulty: 'Intermediate',
        language: 'python',
        code: `# Classic binary search
def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

arr = [1, 3, 5, 7, 9, 11, 13]
print(binary_search(arr, 7))   # 3
print(binary_search(arr, 6))   # -1

# Search in rotated sorted array
def search_rotated(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        if arr[lo] <= arr[mid]:
            if arr[lo] <= target < arr[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:
            if arr[mid] < target <= arr[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1

print(search_rotated([4,5,6,7,0,1,2], 0))  # 4
`,
      },
      {
        title: 'BFS & DFS',
        description: 'Traverse graphs and trees. BFS for shortest path; DFS for connectivity and cycles.',
        difficulty: 'Intermediate',
        language: 'python',
        code: `from collections import deque

graph = {
    0: [1, 2],
    1: [0, 3, 4],
    2: [0, 5],
    3: [1],
    4: [1, 5],
    5: [2, 4]
}

# BFS — level-order traversal
def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order

# DFS — recursive
def dfs(graph, node, visited=None):
    if visited is None:
        visited = set()
    visited.add(node)
    result = [node]
    for neighbor in graph[node]:
        if neighbor not in visited:
            result += dfs(graph, neighbor, visited)
    return result

print("BFS:", bfs(graph, 0))
print("DFS:", dfs(graph, 0))
`,
      },
      {
        title: 'Dynamic Programming',
        description: 'Break problems into overlapping subproblems. Covers Fibonacci, knapsack, and LCS.',
        difficulty: 'Advanced',
        language: 'python',
        code: `# 1) Fibonacci with memoization
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)

print([fib(i) for i in range(10)])

# 2) 0/1 Knapsack
def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            dp[i][w] = dp[i-1][w]
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i][w], dp[i-1][w-weights[i-1]] + values[i-1])
    return dp[n][capacity]

print(knapsack([2, 3, 4, 5], [3, 4, 5, 6], 8))  # 10

# 3) Longest Common Subsequence
def lcs(a, b):
    m, n = len(a), len(b)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(1, m+1):
        for j in range(1, n+1):
            if a[i-1] == b[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]

print(lcs("ABCBDAB", "BDCAB"))  # 4
`,
      },
      {
        title: 'Sorting Algorithms',
        description: 'Understand merge sort, quick sort, and heap sort with implementations and complexity.',
        difficulty: 'Intermediate',
        language: 'python',
        code: `import random

# Merge Sort — O(n log n), stable
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    result, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]

# Quick Sort — O(n log n) avg, in-place
def quick_sort(arr, lo=0, hi=None):
    if hi is None: hi = len(arr) - 1
    if lo < hi:
        pivot = arr[hi]
        i = lo - 1
        for j in range(lo, hi):
            if arr[j] <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
        arr[i+1], arr[hi] = arr[hi], arr[i+1]
        p = i + 1
        quick_sort(arr, lo, p - 1)
        quick_sort(arr, p + 1, hi)
    return arr

data = [64, 34, 25, 12, 22, 11, 90]
print("Merge Sort:", merge_sort(data))
print("Quick Sort:", quick_sort(data[:]))
`,
      },
      {
        title: 'Hash Tables',
        description: 'Build hash maps from scratch, handle collisions, and solve classic frequency problems.',
        difficulty: 'Beginner',
        language: 'python',
        code: `# Hash table from scratch — chaining collision resolution
class HashMap:
    def __init__(self, capacity=16):
        self.capacity = capacity
        self.buckets = [[] for _ in range(capacity)]
        self.size = 0

    def _hash(self, key):
        return hash(key) % self.capacity

    def put(self, key, value):
        idx = self._hash(key)
        for i, (k, v) in enumerate(self.buckets[idx]):
            if k == key:
                self.buckets[idx][i] = (key, value)
                return
        self.buckets[idx].append((key, value))
        self.size += 1

    def get(self, key, default=None):
        for k, v in self.buckets[self._hash(key)]:
            if k == key: return v
        return default

    def __contains__(self, key):
        return self.get(key) is not None

m = HashMap()
for word in "the quick brown fox jumps over the lazy fox".split():
    m.put(word, m.get(word, 0) + 1)

print("the:", m.get("the"))   # 2
print("fox:", m.get("fox"))   # 2

# Classic: Two Sum (unsorted)
def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i

print(two_sum([2, 7, 11, 15], 9))   # [0, 1]
print(two_sum([3, 2, 4], 6))        # [1, 2]
`,
      },
      {
        title: 'Heaps & Priority Queue',
        description: 'Min/max heap operations, heapify, and top-K problems using Python\'s heapq.',
        difficulty: 'Intermediate',
        language: 'python',
        code: `import heapq

# Min-heap (default in Python)
heap = []
for n in [5, 3, 8, 1, 9, 2]:
    heapq.heappush(heap, n)

print("Min:", heapq.heappop(heap))  # 1
print("Next min:", heap[0])         # 2

# Max-heap: negate values
max_heap = []
for n in [5, 3, 8, 1, 9, 2]:
    heapq.heappush(max_heap, -n)
print("Max:", -heapq.heappop(max_heap))  # 9

# heapify — O(n) build
data = [5, 3, 8, 1, 9, 2, 7]
heapq.heapify(data)
print("Heapified:", data)

# Top-K largest elements — O(n log k)
def top_k(nums, k):
    return heapq.nlargest(k, nums)

print("Top 3:", top_k([3,1,4,1,5,9,2,6,5,3], 3))

# K-th smallest
def kth_smallest(nums, k):
    return heapq.nsmallest(k, nums)[-1]

print("3rd smallest:", kth_smallest([7,10,4,3,20,15], 3))

# Merge k sorted lists
def merge_k_sorted(lists):
    heap = [(lst[0], i, 0) for i, lst in enumerate(lists) if lst]
    heapq.heapify(heap)
    result = []
    while heap:
        val, li, idx = heapq.heappop(heap)
        result.append(val)
        if idx + 1 < len(lists[li]):
            heapq.heappush(heap, (lists[li][idx+1], li, idx+1))
    return result

print(merge_k_sorted([[1,4,7],[2,5,8],[3,6,9]]))
`,
      },
      {
        title: 'Tries (Prefix Trees)',
        description: 'Build a trie for fast prefix search, autocomplete, and word dictionary operations.',
        difficulty: 'Intermediate',
        language: 'python',
        code: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False
        self.count = 0  # words passing through

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
            node.count += 1
        node.is_end = True

    def search(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children: return False
            node = node.children[ch]
        return node.is_end

    def starts_with(self, prefix):
        node = self.root
        for ch in prefix:
            if ch not in node.children: return []
            node = node.children[ch]
        # collect all words with this prefix
        results = []
        def dfs(n, path):
            if n.is_end: results.append(prefix[:-len(path)] + path if path else prefix)
            for ch, child in n.children.items():
                dfs(child, path + ch)
        dfs(node, "")
        return results

    def words_with_prefix(self, prefix):
        node = self.root
        for ch in prefix:
            if ch not in node.children: return 0
            node = node.children[ch]
        return node.count

trie = Trie()
for w in ["apple","app","application","apply","banana","band","bandana"]:
    trie.insert(w)

print(trie.search("app"))         # True
print(trie.search("ap"))          # False
print(trie.starts_with("app"))    # ['apple','app','application','apply']
print(trie.words_with_prefix("ban")) # 3
`,
      },
      {
        title: 'Backtracking',
        description: 'Explore all possibilities by building candidates and abandoning invalid paths early.',
        difficulty: 'Advanced',
        language: 'python',
        code: `# 1) Permutations
def permutations(nums):
    result = []
    def bt(path, used):
        if len(path) == len(nums):
            result.append(path[:])
            return
        for i, n in enumerate(nums):
            if not used[i]:
                used[i] = True
                path.append(n)
                bt(path, used)
                path.pop()
                used[i] = False
    bt([], [False]*len(nums))
    return result

print(permutations([1,2,3]))

# 2) Subsets
def subsets(nums):
    result = []
    def bt(start, path):
        result.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            bt(i+1, path)
            path.pop()
    bt(0, [])
    return result

print(subsets([1,2,3]))

# 3) N-Queens
def solve_n_queens(n):
    solutions = []
    cols = set(); diag1 = set(); diag2 = set()
    board = [['.']*n for _ in range(n)]
    def bt(row):
        if row == n:
            solutions.append([''.join(r) for r in board])
            return
        for col in range(n):
            if col in cols or (row-col) in diag1 or (row+col) in diag2:
                continue
            cols.add(col); diag1.add(row-col); diag2.add(row+col)
            board[row][col] = 'Q'
            bt(row+1)
            board[row][col] = '.'
            cols.discard(col); diag1.discard(row-col); diag2.discard(row+col)
    bt(0)
    return solutions

print(f"N-Queens(4): {len(solve_n_queens(4))} solutions")
`,
      },
      {
        title: 'Greedy Algorithms',
        description: 'Make locally optimal choices at each step. Covers interval scheduling, coin change, and Huffman.',
        difficulty: 'Intermediate',
        language: 'python',
        code: `# 1) Activity Selection — max non-overlapping intervals
def max_activities(intervals):
    intervals.sort(key=lambda x: x[1])  # sort by end time
    count = 0
    last_end = float('-inf')
    selected = []
    for start, end in intervals:
        if start >= last_end:
            selected.append((start, end))
            last_end = end
            count += 1
    return count, selected

intervals = [(1,3),(2,4),(3,5),(0,6),(5,7),(8,9),(5,9),(6,10),(8,11),(8,12),(2,13),(12,14)]
n, chosen = max_activities(intervals)
print(f"Max activities: {n}, chosen: {chosen}")

# 2) Coin Change (greedy works for canonical coin systems)
def coin_change_greedy(coins, amount):
    coins.sort(reverse=True)
    result = []
    for coin in coins:
        while amount >= coin:
            result.append(coin)
            amount -= coin
    return result if amount == 0 else []

print(coin_change_greedy([1,5,10,25], 41))  # [25,10,5,1]

# 3) Jump Game — can you reach the end?
def can_jump(nums):
    max_reach = 0
    for i, jump in enumerate(nums):
        if i > max_reach: return False
        max_reach = max(max_reach, i + jump)
    return True

print(can_jump([2,3,1,1,4]))  # True
print(can_jump([3,2,1,0,4]))  # False
`,
      },
      {
        title: 'Binary Trees',
        description: 'Tree traversals, height, LCA, and BST operations with recursive and iterative solutions.',
        difficulty: 'Intermediate',
        language: 'python',
        code: `class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build(vals):
    if not vals: return None
    from collections import deque
    root = TreeNode(vals[0])
    q = deque([root])
    i = 1
    while q and i < len(vals):
        node = q.popleft()
        if i < len(vals) and vals[i] is not None:
            node.left = TreeNode(vals[i]); q.append(node.left)
        i += 1
        if i < len(vals) and vals[i] is not None:
            node.right = TreeNode(vals[i]); q.append(node.right)
        i += 1
    return root

root = build([4,2,6,1,3,5,7])

# Traversals
def inorder(n):   return inorder(n.left) + [n.val] + inorder(n.right) if n else []
def preorder(n):  return [n.val] + preorder(n.left) + preorder(n.right) if n else []
def postorder(n): return postorder(n.left) + postorder(n.right) + [n.val] if n else []

print("In:", inorder(root))    # sorted for BST
print("Pre:", preorder(root))
print("Post:", postorder(root))

# Height
def height(n): return 1 + max(height(n.left), height(n.right)) if n else 0
print("Height:", height(root))  # 3

# Lowest Common Ancestor (BST)
def lca_bst(root, p, q):
    if p < root.val and q < root.val: return lca_bst(root.left, p, q)
    if p > root.val and q > root.val: return lca_bst(root.right, p, q)
    return root.val

print("LCA(1,3):", lca_bst(root, 1, 3))  # 2
print("LCA(1,7):", lca_bst(root, 1, 7))  # 4
`,
      },
      {
        title: 'Graph — Dijkstra & Topological Sort',
        description: "Dijkstra's shortest path and topological sort for DAGs using BFS/DFS.",
        difficulty: 'Advanced',
        language: 'python',
        code: `import heapq
from collections import defaultdict, deque

# Dijkstra — single source shortest path
def dijkstra(graph, start):
    dist = {start: 0}
    heap = [(0, start)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist.get(u, float('inf')): continue
        for v, w in graph[u]:
            nd = d + w
            if nd < dist.get(v, float('inf')):
                dist[v] = nd
                heapq.heappush(heap, (nd, v))
    return dist

graph = defaultdict(list)
edges = [(0,1,4),(0,2,1),(2,1,2),(1,3,1),(2,3,5),(3,4,3)]
for u,v,w in edges:
    graph[u].append((v,w))
    graph[v].append((u,w))

print("Shortest from 0:", dijkstra(graph, 0))

# Topological Sort — Kahn's algorithm (BFS)
def topo_sort(n, edges):
    adj = defaultdict(list)
    indegree = [0] * n
    for u, v in edges:
        adj[u].append(v)
        indegree[v] += 1
    queue = deque(i for i in range(n) if indegree[i] == 0)
    order = []
    while queue:
        u = queue.popleft()
        order.append(u)
        for v in adj[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                queue.append(v)
    return order if len(order) == n else []  # empty = cycle

deps = [(5,2),(5,0),(4,0),(4,1),(2,3),(3,1)]
print("Topo order:", topo_sort(6, deps))
`,
      },
      {
        title: 'Bit Manipulation',
        description: 'Use bitwise operators for fast, space-efficient solutions to classic problems.',
        difficulty: 'Advanced',
        language: 'python',
        code: `# Bit tricks cheat sheet

# Check if n is power of 2
is_power_of_2 = lambda n: n > 0 and (n & (n-1)) == 0
print([n for n in range(1,20) if is_power_of_2(n)])

# Count set bits (Brian Kernighan)
def count_bits(n):
    count = 0
    while n:
        n &= n - 1  # remove lowest set bit
        count += 1
    return count
print([count_bits(i) for i in range(9)])

# Find single number (others appear twice) — XOR
def single_number(nums):
    result = 0
    for n in nums: result ^= n
    return result

print(single_number([2,3,2,4,3]))  # 4

# Get / Set / Clear / Toggle bit at position i
def get_bit(n, i):    return (n >> i) & 1
def set_bit(n, i):    return n | (1 << i)
def clear_bit(n, i):  return n & ~(1 << i)
def toggle_bit(n, i): return n ^ (1 << i)

n = 0b1010  # 10
print(bin(set_bit(n, 0)))     # 0b1011
print(bin(clear_bit(n, 1)))   # 0b1000
print(bin(toggle_bit(n, 2)))  # 0b1110

# Subset enumeration using bits
def all_subsets(arr):
    n = len(arr)
    return [[arr[j] for j in range(n) if mask & (1<<j)]
            for mask in range(1 << n)]

print(all_subsets([1,2,3]))
`,
      },
    ],
  },
  {
    id: 'sql',
    name: 'SQL',
    fullName: 'SQL & Databases',
    icon: <Database size={20} />,
    color: '#10b981',
    topics: [
      {
        title: 'SELECT Basics',
        description: 'Query tables, filter rows with WHERE, sort with ORDER BY, and limit results.',
        difficulty: 'Beginner',
        language: 'sql',
        code: `-- Create and populate a sample table
CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT,
  department TEXT,
  salary INTEGER,
  hire_year INTEGER
);

INSERT INTO employees VALUES
  (1, 'Alice',   'Engineering', 95000, 2019),
  (2, 'Bob',     'Marketing',   65000, 2021),
  (3, 'Carol',   'Engineering', 105000, 2017),
  (4, 'David',   'HR',          58000, 2022),
  (5, 'Eve',     'Engineering', 88000, 2020),
  (6, 'Frank',   'Marketing',   72000, 2018);

-- Basic SELECT
SELECT name, salary FROM employees;

-- Filter
SELECT * FROM employees WHERE department = 'Engineering';

-- Sort
SELECT name, salary FROM employees ORDER BY salary DESC;

-- Limit
SELECT name FROM employees ORDER BY hire_year LIMIT 3;
`,
      },
      {
        title: 'JOINs',
        description: 'Combine rows from multiple tables using INNER, LEFT, and self JOINs.',
        difficulty: 'Beginner',
        language: 'sql',
        code: `CREATE TABLE departments (
  id INTEGER PRIMARY KEY,
  name TEXT,
  budget INTEGER
);
CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT,
  dept_id INTEGER,
  salary INTEGER
);

INSERT INTO departments VALUES (1,'Engineering',500000),(2,'Marketing',200000),(3,'HR',150000);
INSERT INTO employees VALUES
  (1,'Alice',1,95000),(2,'Bob',2,65000),(3,'Carol',1,105000),
  (4,'David',3,58000),(5,'Eve',1,88000),(6,'Frank',NULL,72000);

-- INNER JOIN — only matched rows
SELECT e.name, d.name AS dept, d.budget
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id;

-- LEFT JOIN — all employees, even without dept
SELECT e.name, COALESCE(d.name, 'Unassigned') AS dept
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.id;

-- Self JOIN — employees in same department as Alice
SELECT e2.name
FROM employees e1
JOIN employees e2 ON e1.dept_id = e2.dept_id
WHERE e1.name = 'Alice' AND e2.name != 'Alice';
`,
      },
      {
        title: 'Aggregations & GROUP BY',
        description: 'Summarize data with COUNT, SUM, AVG, MIN, MAX and group using GROUP BY / HAVING.',
        difficulty: 'Beginner',
        language: 'sql',
        code: `CREATE TABLE sales (
  id INTEGER, rep TEXT, region TEXT,
  product TEXT, amount INTEGER, month INTEGER
);
INSERT INTO sales VALUES
  (1,'Alice','North','Widget',1200,1),(2,'Bob','South','Widget',800,1),
  (3,'Alice','North','Gadget',2200,1),(4,'Carol','East','Widget',1500,2),
  (5,'Bob','South','Gadget',1800,2),(6,'Alice','North','Widget',950,2),
  (7,'Carol','East','Gadget',3100,3),(8,'Bob','South','Widget',600,3);

-- Count and total per rep
SELECT rep, COUNT(*) AS deals, SUM(amount) AS total
FROM sales
GROUP BY rep
ORDER BY total DESC;

-- Average sale by product
SELECT product, ROUND(AVG(amount), 2) AS avg_sale
FROM sales GROUP BY product;

-- HAVING — only reps with total > 3000
SELECT rep, SUM(amount) AS total
FROM sales
GROUP BY rep
HAVING total > 3000;

-- Month-over-month totals
SELECT month, SUM(amount) AS revenue
FROM sales GROUP BY month ORDER BY month;
`,
      },
      {
        title: 'Subqueries & CTEs',
        description: 'Nest queries inside SELECT/WHERE and use WITH clauses for readable multi-step logic.',
        difficulty: 'Intermediate',
        language: 'sql',
        code: `CREATE TABLE employees (
  id INTEGER, name TEXT, dept TEXT, salary INTEGER
);
INSERT INTO employees VALUES
  (1,'Alice','Eng',95000),(2,'Bob','Mkt',65000),(3,'Carol','Eng',105000),
  (4,'David','HR',58000),(5,'Eve','Eng',88000),(6,'Frank','Mkt',72000);

-- Subquery in WHERE — above average salary
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

-- Subquery in FROM — dept averages
SELECT dept, avg_sal
FROM (
  SELECT dept, AVG(salary) AS avg_sal
  FROM employees GROUP BY dept
) AS dept_avg
ORDER BY avg_sal DESC;

-- CTE — same result, more readable
WITH dept_avg AS (
  SELECT dept, AVG(salary) AS avg_sal
  FROM employees GROUP BY dept
)
SELECT e.name, e.salary, da.avg_sal AS dept_avg,
       ROUND(e.salary - da.avg_sal, 0) AS diff
FROM employees e
JOIN dept_avg da ON e.dept = da.dept
ORDER BY diff DESC;
`,
      },
      {
        title: 'Window Functions',
        description: 'Rank rows, compute running totals, and compare values without losing row detail.',
        difficulty: 'Advanced',
        language: 'sql',
        code: `CREATE TABLE sales (
  rep TEXT, month INTEGER, amount INTEGER
);
INSERT INTO sales VALUES
  ('Alice',1,1200),('Alice',2,950),('Alice',3,1800),
  ('Bob',1,800),('Bob',2,1800),('Bob',3,600),
  ('Carol',1,1500),('Carol',2,2200),('Carol',3,3100);

-- RANK by amount overall
SELECT rep, month, amount,
       RANK() OVER (ORDER BY amount DESC) AS overall_rank
FROM sales;

-- ROW_NUMBER within each rep
SELECT rep, month, amount,
       ROW_NUMBER() OVER (PARTITION BY rep ORDER BY month) AS rn
FROM sales;

-- Running total per rep
SELECT rep, month, amount,
       SUM(amount) OVER (PARTITION BY rep ORDER BY month) AS running_total
FROM sales;

-- Top performer per month
SELECT * FROM (
  SELECT rep, month, amount,
         RANK() OVER (PARTITION BY month ORDER BY amount DESC) AS rnk
  FROM sales
) WHERE rnk = 1;
`,
      },
      {
        title: 'Indexes & Performance',
        description: 'Speed up queries with indexes, understand EXPLAIN, and avoid common slow patterns.',
        difficulty: 'Advanced',
        language: 'sql',
        code: `-- Create a table with data
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  product TEXT,
  amount INTEGER,
  created_date TEXT
);

INSERT INTO orders
  SELECT value,
    ABS(RANDOM()) % 1000,
    CASE ABS(RANDOM())%3 WHEN 0 THEN 'Widget' WHEN 1 THEN 'Gadget' ELSE 'Doohickey' END,
    ABS(RANDOM()) % 500 + 10,
    date('2023-01-01', '+' || (ABS(RANDOM())%365) || ' days')
  FROM generate_series(1, 100);

-- Without index: full table scan
SELECT * FROM orders WHERE customer_id = 42;

-- Create index on customer_id
CREATE INDEX idx_customer ON orders(customer_id);

-- Composite index for multi-column filter
CREATE INDEX idx_product_date ON orders(product, created_date);

-- Covered query — uses only indexed columns
SELECT customer_id, COUNT(*) as order_count
FROM orders
GROUP BY customer_id
ORDER BY order_count DESC
LIMIT 10;

-- Check how SQLite plans the query
EXPLAIN QUERY PLAN
SELECT * FROM orders WHERE customer_id = 42;
`,
      },
      {
        title: 'Views & Virtual Tables',
        description: 'Create reusable named queries with views to simplify complex SQL logic.',
        difficulty: 'Intermediate',
        language: 'sql',
        code: `CREATE TABLE employees (id INTEGER, name TEXT, dept TEXT, salary INTEGER, manager_id INTEGER);
INSERT INTO employees VALUES
  (1,'Alice','Eng',95000,NULL),(2,'Bob','Mkt',65000,1),(3,'Carol','Eng',105000,1),
  (4,'David','HR',58000,2),(5,'Eve','Eng',88000,3),(6,'Frank','Mkt',72000,2);

-- Create a view — stored query, not data
CREATE VIEW high_earners AS
  SELECT id, name, dept, salary
  FROM employees
  WHERE salary > 80000;

-- Query the view like a table
SELECT * FROM high_earners ORDER BY salary DESC;

-- View joining multiple tables
CREATE VIEW dept_summary AS
  SELECT dept,
         COUNT(*) AS headcount,
         ROUND(AVG(salary), 0) AS avg_salary,
         MAX(salary) AS top_salary
  FROM employees
  GROUP BY dept;

SELECT * FROM dept_summary ORDER BY avg_salary DESC;

-- Views can be used in JOINs
SELECT e.name, e.salary, ds.avg_salary,
       ROUND(e.salary - ds.avg_salary, 0) AS vs_avg
FROM employees e
JOIN dept_summary ds ON e.dept = ds.dept
ORDER BY vs_avg DESC;
`,
      },
      {
        title: 'Transactions & ACID',
        description: 'Group statements into atomic transactions and roll back on failure.',
        difficulty: 'Intermediate',
        language: 'sql',
        code: `CREATE TABLE accounts (id INTEGER PRIMARY KEY, owner TEXT, balance REAL);
INSERT INTO accounts VALUES (1,'Alice',1000.00),(2,'Bob',500.00),(3,'Carol',750.00);

-- Basic transaction — transfer $200 from Alice to Bob
BEGIN TRANSACTION;
  UPDATE accounts SET balance = balance - 200 WHERE id = 1;
  UPDATE accounts SET balance = balance + 200 WHERE id = 2;
COMMIT;

SELECT owner, balance FROM accounts;

-- Simulate rollback on insufficient funds
BEGIN TRANSACTION;
  -- Try to withdraw more than Alice has
  UPDATE accounts SET balance = balance - 5000 WHERE id = 1;
  -- Check constraint violation (manual logic here)
  SELECT CASE WHEN balance < 0 THEN 'ROLLBACK' ELSE 'OK' END AS status
  FROM accounts WHERE id = 1;
ROLLBACK;  -- undo all changes in this transaction

-- Verify balance unchanged from the rolled-back tx
SELECT owner, balance FROM accounts WHERE id = 1;

-- SAVEPOINT — partial rollback
BEGIN TRANSACTION;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  SAVEPOINT after_debit;
  UPDATE accounts SET balance = balance + 100 WHERE id = 99; -- bad ID, no effect
  ROLLBACK TO after_debit;  -- only undo back to savepoint
COMMIT;

SELECT owner, balance FROM accounts;
`,
      },
      {
        title: 'String Functions & CASE',
        description: 'Manipulate text with UPPER, LIKE, SUBSTR, REPLACE, and conditional CASE expressions.',
        difficulty: 'Beginner',
        language: 'sql',
        code: `CREATE TABLE products (id INTEGER, name TEXT, category TEXT, price REAL, sku TEXT);
INSERT INTO products VALUES
  (1,'Apple iPhone 15','Electronics',999.99,'ELEC-001'),
  (2,'Samsung Galaxy S24','Electronics',849.99,'ELEC-002'),
  (3,'IKEA KALLAX Shelf','Furniture',129.99,'FURN-001'),
  (4,'Nike Air Max 2024','Footwear',189.99,'FOOT-001'),
  (5,'Levi 501 Jeans','Clothing',69.99,'CLTH-001'),
  (6,'Sony WH-1000XM5','Electronics',349.99,'ELEC-003');

-- String functions
SELECT
  UPPER(name)           AS upper_name,
  LOWER(category)       AS lower_cat,
  LENGTH(name)          AS name_len,
  SUBSTR(sku, 1, 4)     AS dept_code,
  REPLACE(name,' ','_') AS slug
FROM products LIMIT 3;

-- LIKE — pattern matching
SELECT name FROM products WHERE name LIKE '%Samsung%';
SELECT name FROM products WHERE sku LIKE 'ELEC%';

-- CASE — conditional column
SELECT name, price,
  CASE
    WHEN price < 100  THEN 'Budget'
    WHEN price < 500  THEN 'Mid-range'
    ELSE                   'Premium'
  END AS tier,
  CASE category
    WHEN 'Electronics' THEN '💻'
    WHEN 'Furniture'   THEN '🪑'
    ELSE                    '🛍️'
  END AS icon
FROM products ORDER BY price;

-- Aggregate with CASE
SELECT
  SUM(CASE WHEN price < 200 THEN 1 ELSE 0 END) AS budget_count,
  SUM(CASE WHEN price >= 500 THEN 1 ELSE 0 END) AS premium_count
FROM products;
`,
      },
      {
        title: 'Date & Time Functions',
        description: 'Work with dates: formatting, arithmetic, extracting parts, and grouping by period.',
        difficulty: 'Intermediate',
        language: 'sql',
        code: `CREATE TABLE orders (id INTEGER, customer TEXT, amount REAL, order_date TEXT);
INSERT INTO orders VALUES
  (1,'Alice',250.00,'2024-01-15'),(2,'Bob',89.99,'2024-01-22'),
  (3,'Carol',430.00,'2024-02-05'),(4,'Alice',175.50,'2024-02-18'),
  (5,'Bob',320.00,'2024-03-01'),(6,'Carol',99.99,'2024-03-14'),
  (7,'Alice',540.00,'2024-03-28'),(8,'Bob',210.00,'2024-04-10');

-- Current date
SELECT date('now') AS today, datetime('now') AS now_utc;

-- Date arithmetic
SELECT order_date,
  date(order_date, '+30 days')  AS plus_30,
  date(order_date, '-1 month')  AS prev_month,
  julianday('now') - julianday(order_date) AS days_ago
FROM orders LIMIT 3;

-- Extract parts
SELECT order_date,
  strftime('%Y', order_date) AS year,
  strftime('%m', order_date) AS month,
  strftime('%d', order_date) AS day,
  strftime('%W', order_date) AS week_num
FROM orders LIMIT 3;

-- Group by month
SELECT strftime('%Y-%m', order_date) AS month,
       COUNT(*) AS orders,
       ROUND(SUM(amount), 2) AS revenue
FROM orders
GROUP BY month
ORDER BY month;
`,
      },
    ],
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    fullName: 'JavaScript',
    icon: <Code2 size={20} />,
    color: '#f59e0b',
    topics: [
      {
        title: 'Array Methods',
        description: 'Master map, filter, reduce, find, every, and some for clean functional code.',
        difficulty: 'Beginner',
        language: 'javascript',
        code: `const products = [
  { name: 'Laptop',  price: 999,  category: 'Electronics', inStock: true  },
  { name: 'Phone',   price: 699,  category: 'Electronics', inStock: false },
  { name: 'Desk',    price: 299,  category: 'Furniture',   inStock: true  },
  { name: 'Chair',   price: 199,  category: 'Furniture',   inStock: true  },
  { name: 'Monitor', price: 449,  category: 'Electronics', inStock: true  },
];

// map — transform
const names = products.map(p => p.name);
console.log('Names:', names);

// filter — select
const electronics = products.filter(p => p.category === 'Electronics' && p.inStock);
console.log('Available electronics:', electronics.map(p => p.name));

// reduce — aggregate
const totalValue = products.reduce((sum, p) => sum + p.price, 0);
console.log('Total value:', totalValue);

// find — first match
const expensive = products.find(p => p.price > 800);
console.log('First expensive:', expensive?.name);

// every / some
console.log('All in stock?', products.every(p => p.inStock));
console.log('Any out of stock?', products.some(p => !p.inStock));

// Chaining
const result = products
  .filter(p => p.inStock)
  .map(p => ({ ...p, discounted: p.price * 0.9 }))
  .sort((a, b) => a.discounted - b.discounted);

console.log('Discounted prices:', result.map(p => \`\${p.name}: $\${p.discounted.toFixed(2)}\`));
`,
      },
      {
        title: 'Closures & Scope',
        description: 'Understand lexical scope, closures, and how to use them for private state and factories.',
        difficulty: 'Intermediate',
        language: 'javascript',
        code: `// Closure: function remembers its lexical scope
function makeCounter(start = 0) {
  let count = start;  // private state
  return {
    increment: () => ++count,
    decrement: () => --count,
    reset: () => { count = start; },
    value: () => count,
  };
}

const counter = makeCounter(10);
console.log(counter.increment()); // 11
console.log(counter.increment()); // 12
console.log(counter.decrement()); // 11
counter.reset();
console.log(counter.value());     // 10

// Factory pattern using closures
function createMultiplier(factor) {
  return (n) => n * factor;
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
console.log(double(5));  // 10
console.log(triple(5));  // 15

// Memoization with closure
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const slowSquare = memoize((n) => { return n * n; });
console.log(slowSquare(10)); // 100
console.log(slowSquare(10)); // 100 (from cache)
`,
      },
      {
        title: 'Promises & Async/Await',
        description: 'Handle async operations cleanly. Covers Promise.all, error handling, and sequential flows.',
        difficulty: 'Intermediate',
        language: 'javascript',
        code: `// Simulate API calls
const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function fetchUser(id) {
  await delay(50);
  const users = { 1: 'Alice', 2: 'Bob', 3: 'Carol' };
  if (!users[id]) throw new Error(\`User \${id} not found\`);
  return { id, name: users[id] };
}

async function fetchPosts(userId) {
  await delay(30);
  return [
    { id: 1, title: \`Post by user \${userId}\` },
    { id: 2, title: \`Another post\` }
  ];
}

// Sequential
async function sequential() {
  const user = await fetchUser(1);
  const posts = await fetchPosts(user.id);
  console.log('Sequential:', user.name, '-', posts.length, 'posts');
}

// Parallel with Promise.all
async function parallel() {
  const [u1, u2, u3] = await Promise.all([
    fetchUser(1), fetchUser(2), fetchUser(3)
  ]);
  console.log('Parallel:', u1.name, u2.name, u3.name);
}

// Error handling
async function withError() {
  try {
    const user = await fetchUser(99);
  } catch (err) {
    console.log('Caught:', err.message);
  }
}

// Promise.allSettled — don't fail on partial errors
async function partial() {
  const results = await Promise.allSettled([
    fetchUser(1), fetchUser(99), fetchUser(2)
  ]);
  results.forEach(r => {
    if (r.status === 'fulfilled') console.log('OK:', r.value.name);
    else console.log('ERR:', r.reason.message);
  });
}

sequential().then(parallel).then(withError).then(partial);
`,
      },
      {
        title: 'Destructuring & Spread',
        description: 'Extract values cleanly from arrays and objects, use rest/spread for immutable updates.',
        difficulty: 'Beginner',
        language: 'javascript',
        code: `// Array destructuring
const [first, second, ...rest] = [10, 20, 30, 40, 50];
console.log(first, second, rest);  // 10 20 [30,40,50]

// Swap without temp variable
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b);  // 2 1

// Object destructuring with rename & default
const user = { name: 'Alice', age: 30, role: 'admin' };
const { name: userName, age, role = 'user', city = 'Unknown' } = user;
console.log(userName, age, role, city);

// Nested destructuring
const { address: { street, zip } = { street: 'N/A', zip: '00000' } } = {};
console.log(street, zip);

// Spread — immutable updates
const original = { name: 'Alice', score: 50, active: true };
const updated = { ...original, score: 95 };
console.log(original.score, updated.score);  // 50  95

// Merge objects
const defaults = { theme: 'dark', lang: 'en', fontSize: 14 };
const userPrefs = { theme: 'light', fontSize: 16 };
const config = { ...defaults, ...userPrefs };
console.log(config);

// Function parameters
function greet({ name, greeting = 'Hello' }) {
  return \`\${greeting}, \${name}!\`;
}
console.log(greet({ name: 'Bob' }));
console.log(greet({ name: 'Carol', greeting: 'Hi' }));
`,
      },
      {
        title: 'Classes & OOP',
        description: 'Build class hierarchies with inheritance, getters/setters, static methods, and private fields.',
        difficulty: 'Intermediate',
        language: 'javascript',
        code: `class Animal {
  #name;  // private field

  constructor(name, sound) {
    this.#name = name;
    this.sound = sound;
  }

  get name() { return this.#name; }

  speak() {
    return \`\${this.#name} says \${this.sound}\`;
  }

  static create(type) {
    const map = { dog: new Dog('Rex'), cat: new Cat('Whiskers') };
    return map[type] ?? new Animal(type, '...');
  }
}

class Dog extends Animal {
  #tricks = [];

  constructor(name) {
    super(name, 'Woof');
  }

  learn(trick) {
    this.#tricks.push(trick);
    return this;
  }

  perform() {
    return \`\${this.name} performs: \${this.#tricks.join(', ')}\`;
  }
}

class Cat extends Animal {
  constructor(name) {
    super(name, 'Meow');
  }

  purr() { return \`Purrrr...\`; }
}

const dog = new Dog('Buddy');
dog.learn('sit').learn('shake').learn('roll over');

console.log(dog.speak());
console.log(dog.perform());

const cat = Animal.create('cat');
console.log(cat.speak());
console.log(cat.purr());

console.log(dog instanceof Animal);  // true
console.log(dog instanceof Cat);     // false
`,
      },
      {
        title: 'Map, Set & WeakMap',
        description: 'Use Map for keyed collections, Set for unique values, WeakMap for private data.',
        difficulty: 'Intermediate',
        language: 'javascript',
        code: `// Map — any key type, ordered, iterable
const map = new Map();
map.set('string-key', 1);
map.set(42, 'number-key');
map.set(true, 'boolean-key');

console.log(map.get(42));       // 'number-key'
console.log(map.size);          // 3

// Frequency counter with Map
function frequency(arr) {
  return arr.reduce((map, item) => {
    map.set(item, (map.get(item) ?? 0) + 1);
    return map;
  }, new Map());
}

const freq = frequency(['a','b','a','c','b','a']);
for (const [char, count] of freq.entries()) {
  console.log(char, '->', count);
}

// Set — unique values, O(1) lookup
const set = new Set([1, 2, 3, 2, 1]);
console.log([...set]);          // [1, 2, 3]

// Remove duplicates from array
const unique = arr => [...new Set(arr)];
console.log(unique([1,2,2,3,3,4]));

// Set operations
const a = new Set([1,2,3,4]);
const b = new Set([3,4,5,6]);

const union        = new Set([...a, ...b]);
const intersection = new Set([...a].filter(x => b.has(x)));
const difference   = new Set([...a].filter(x => !b.has(x)));

console.log('Union:', [...union]);
console.log('Intersection:', [...intersection]);
console.log('Difference:', [...difference]);
`,
      },
      {
        title: 'Generators & Iterators',
        description: 'Lazy sequences with function* and Symbol.iterator for memory-efficient pipelines.',
        difficulty: 'Intermediate',
        language: 'javascript',
        code: `// Generator function
function* range(start, end, step = 1) {
  for (let i = start; i < end; i += step) yield i;
}
console.log([...range(0, 10, 2)]);  // [0,2,4,6,8]

// Infinite generator
function* naturals() {
  let n = 1;
  while (true) yield n++;
}

function take(n, gen) {
  const result = [];
  for (const val of gen) {
    result.push(val);
    if (result.length === n) break;
  }
  return result;
}
console.log(take(5, naturals()));  // [1,2,3,4,5]

// Generator pipeline
function* map(fn, iter)    { for (const x of iter) yield fn(x); }
function* filter(fn, iter) { for (const x of iter) if (fn(x)) yield x; }

const result = take(5,
  filter(x => x % 2 === 0,
    map(x => x * x,
      naturals())));
console.log(result);  // [4,16,36,64,100]

// Custom iterable
class Range {
  constructor(start, end) { this.start = start; this.end = end; }
  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    return { next() { return current <= end ? { value: current++, done: false } : { done: true }; } };
  }
}
console.log([...new Range(1, 5)]);  // [1,2,3,4,5]
`,
      },
      {
        title: 'Regular Expressions',
        description: 'Pattern matching with RegExp: groups, lookaheads, replace, and split.',
        difficulty: 'Intermediate',
        language: 'javascript',
        code: `// Test and match
const email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
console.log(email.test('alice@example.com'));  // true
console.log(email.test('not-an-email'));       // false

// Capture groups
const dateRe = /(\d{4})-(\d{2})-(\d{2})/;
const m = '2024-03-15'.match(dateRe);
console.log(\`Year:\${m[1]} Month:\${m[2]} Day:\${m[3]}\`);

// Named groups
const named = /(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/;
const { year, month, day } = '2024-03-15'.match(named).groups;
console.log({ year, month, day });

// Global flag — all matches
const words = 'cat bat sat fat';
const matches = [...words.matchAll(/[a-z]at/g)].map(m => m[0]);
console.log(matches);  // ['cat','bat','sat','fat']

// Replace with function
const camelToSnake = s => s.replace(/[A-Z]/g, c => '_' + c.toLowerCase());
console.log(camelToSnake('camelCaseString'));  // camel_case_string

// Lookahead & lookbehind
const price = '100USD 200EUR 300GBP';
const amounts = [...price.matchAll(/\\d+(?=[A-Z])/g)].map(m => +m[0]);
console.log(amounts);  // [100, 200, 300]

// Split on multiple delimiters
const csv = 'alice,30;bob 25|carol,28';
console.log(csv.split(/[,;|\\s]+/));
`,
      },
      {
        title: 'Functional Programming',
        description: 'Compose, curry, pipe, and memoize — pure functional patterns in JavaScript.',
        difficulty: 'Advanced',
        language: 'javascript',
        code: `// Curry — transform f(a,b,c) into f(a)(b)(c)
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...more) => curried(...args, ...more);
  };
}

const add = curry((a, b, c) => a + b + c);
console.log(add(1)(2)(3));   // 6
console.log(add(1, 2)(3));   // 6
const add10 = add(10);
console.log(add10(5)(2));    // 17

// Compose — right to left
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

// Pipe — left to right
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

const process = pipe(
  x => x.trim(),
  x => x.toLowerCase(),
  x => x.replace(/\\s+/g, '-'),
  x => \`/posts/\${x}\`
);
console.log(process('  Hello World  '));  // /posts/hello-world

// Partial application
const partial = (fn, ...preset) => (...args) => fn(...preset, ...args);
const multiply = (a, b) => a * b;
const double = partial(multiply, 2);
const triple = partial(multiply, 3);
console.log([1,2,3,4,5].map(double));  // [2,4,6,8,10]
console.log([1,2,3,4,5].map(triple));  // [3,6,9,12,15]

// Transducer
const xform = compose(
  arr => arr.filter(x => x % 2 === 0),
  arr => arr.map(x => x * x)
);
console.log(xform([1,2,3,4,5,6]));  // [4,16,36]
`,
      },
      {
        title: 'Error Handling',
        description: 'Custom errors, error chaining, try/catch patterns, and Result types.',
        difficulty: 'Intermediate',
        language: 'javascript',
        code: `// Custom error classes
class AppError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
  }
}
class ValidationError extends AppError {}
class NotFoundError extends AppError {}
class NetworkError extends AppError {}

// Validate input
function validateUser(data) {
  const errors = [];
  if (!data.name?.trim()) errors.push('name is required');
  if (!data.email?.includes('@')) errors.push('email is invalid');
  if (data.age < 0 || data.age > 150) errors.push('age is invalid');
  if (errors.length) throw new ValidationError(errors.join('; '), 400, errors);
  return data;
}

try { validateUser({ name: '', email: 'bad', age: -1 }); }
catch (e) {
  console.log(\`[\${e.code}] \${e.name}: \${e.message}\`);
  console.log('Details:', e.details);
}

// Result type (no exceptions)
const Result = {
  ok: value => ({ ok: true, value }),
  err: error => ({ ok: false, error }),
};

function safeDivide(a, b) {
  if (b === 0) return Result.err('Division by zero');
  return Result.ok(a / b);
}

[safeDivide(10, 2), safeDivide(5, 0)].forEach(r => {
  if (r.ok) console.log('Result:', r.value);
  else console.log('Error:', r.error);
});
`,
      },
    ],
  },
  {
    id: 'python',
    name: 'Python',
    fullName: 'Python',
    icon: <Code2 size={20} />,
    color: '#8b5cf6',
    topics: [
      {
        title: 'List Comprehensions',
        description: 'Write concise, readable list, dict, and set comprehensions with conditions and nesting.',
        difficulty: 'Beginner',
        language: 'python',
        code: `# Basic list comprehension
squares = [x**2 for x in range(10)]
print(squares)

# With condition
evens = [x for x in range(20) if x % 2 == 0]
print(evens)

# Nested — flatten 2D list
matrix = [[1,2,3],[4,5,6],[7,8,9]]
flat = [n for row in matrix for n in row]
print(flat)

# Dict comprehension
words = ['hello', 'world', 'python', 'list']
word_len = {w: len(w) for w in words}
print(word_len)

# Set comprehension — unique lengths
unique_lengths = {len(w) for w in words}
print(unique_lengths)

# Complex: matrix transpose
transposed = [[matrix[r][c] for r in range(len(matrix))] for c in range(len(matrix[0]))]
print(transposed)

# Generator expression — memory efficient
total = sum(x**2 for x in range(1000000))
print(total)

# Walrus operator (:=) in comprehension
results = [y for x in range(20) if (y := x**2) > 50]
print(results[:5])
`,
      },
      {
        title: 'Decorators',
        description: 'Wrap functions with reusable behavior — timing, caching, retries, and validation.',
        difficulty: 'Intermediate',
        language: 'python',
        code: `import time
import functools

# Basic decorator
def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {(time.perf_counter()-start)*1000:.2f}ms")
        return result
    return wrapper

# Decorator with arguments
def retry(times=3, delay=0):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    print(f"Attempt {attempt} failed: {e}")
                    if attempt < times and delay:
                        time.sleep(delay)
            raise RuntimeError(f"All {times} attempts failed")
        return wrapper
    return decorator

# Memoize decorator
def memoize(func):
    cache = {}
    @functools.wraps(func)
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    return wrapper

@timer
@memoize
def fibonacci(n):
    if n <= 1: return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(35))

@retry(times=3)
def flaky(n=[0]):
    n[0] += 1
    if n[0] < 3:
        raise ValueError("Not yet!")
    return "Success!"

print(flaky())
`,
      },
      {
        title: 'Classes & OOP',
        description: 'Python OOP: dataclasses, properties, dunder methods, and class/static methods.',
        difficulty: 'Intermediate',
        language: 'python',
        code: `from dataclasses import dataclass, field
from typing import List

@dataclass
class Student:
    name: str
    grades: List[float] = field(default_factory=list)

    def add_grade(self, grade: float):
        if not 0 <= grade <= 100:
            raise ValueError("Grade must be 0-100")
        self.grades.append(grade)
        return self

    @property
    def average(self):
        return sum(self.grades) / len(self.grades) if self.grades else 0

    @property
    def letter_grade(self):
        avg = self.average
        if avg >= 90: return 'A'
        if avg >= 80: return 'B'
        if avg >= 70: return 'C'
        if avg >= 60: return 'D'
        return 'F'

    def __repr__(self):
        return f"Student({self.name!r}, avg={self.average:.1f}, grade={self.letter_grade})"

    def __lt__(self, other):
        return self.average < other.average

    @classmethod
    def from_dict(cls, data):
        s = cls(data['name'])
        for g in data.get('grades', []):
            s.add_grade(g)
        return s

alice = Student.from_dict({'name': 'Alice', 'grades': [92, 88, 95, 91]})
bob = Student.from_dict({'name': 'Bob', 'grades': [75, 82, 79, 68]})

print(alice)
print(bob)
print("Top student:", max(alice, bob).name)
`,
      },
      {
        title: 'Generators & Itertools',
        description: 'Lazy sequences with yield, infinite generators, and powerful itertools combinators.',
        difficulty: 'Intermediate',
        language: 'python',
        code: `import itertools

# Generator function — lazy evaluation
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

# Take first n from infinite generator
def take(n, gen):
    return list(itertools.islice(gen, n))

print(take(10, fibonacci()))

# Generator expression
def read_large_file(lines):
    return (line.strip().upper() for line in lines if line.strip())

data = ["  hello  ", "world", "", "  python  ", "generators"]
print(list(read_large_file(data)))

# itertools
# chain — flatten iterables
combined = list(itertools.chain([1,2,3], [4,5], [6]))
print("chain:", combined)

# groupby — group consecutive items
data = sorted([('A',1),('B',2),('A',3),('B',4),('C',5)], key=lambda x:x[0])
for key, group in itertools.groupby(data, key=lambda x: x[0]):
    print(key, list(group))

# combinations & permutations
items = ['a','b','c']
print("combinations:", list(itertools.combinations(items, 2)))
print("permutations:", list(itertools.permutations(items, 2)))

# accumulate — running totals
import operator
nums = [1,2,3,4,5]
print("running sum:", list(itertools.accumulate(nums)))
print("running product:", list(itertools.accumulate(nums, operator.mul)))
`,
      },
      {
        title: 'Error Handling & Context Managers',
        description: 'Robust exception handling, custom exceptions, and writing clean context managers.',
        difficulty: 'Intermediate',
        language: 'python',
        code: `from contextlib import contextmanager
import time

# Custom exception hierarchy
class AppError(Exception):
    def __init__(self, message, code=None):
        super().__init__(message)
        self.code = code

class ValidationError(AppError): pass
class NotFoundError(AppError): pass

def get_user(user_id):
    users = {1: "Alice", 2: "Bob"}
    if not isinstance(user_id, int):
        raise ValidationError("user_id must be int", code=400)
    if user_id not in users:
        raise NotFoundError(f"User {user_id} not found", code=404)
    return users[user_id]

# try / except / else / finally
for uid in [1, 99, "bad"]:
    try:
        name = get_user(uid)
    except ValidationError as e:
        print(f"Validation [{e.code}]: {e}")
    except NotFoundError as e:
        print(f"Not found [{e.code}]: {e}")
    else:
        print(f"Found: {name}")
    finally:
        pass  # always runs

# Context manager with contextlib
@contextmanager
def timer(label=""):
    start = time.perf_counter()
    try:
        yield
    finally:
        elapsed = (time.perf_counter() - start) * 1000
        print(f"{label} took {elapsed:.2f}ms")

with timer("Sum"):
    result = sum(range(1_000_000))
    print(f"Result: {result}")
`,
      },
      {
        title: 'Regular Expressions',
        description: 'Pattern matching, groups, substitution, and findall with Python\'s re module.',
        difficulty: 'Beginner',
        language: 'python',
        code: `import re

# Basic match / search / findall
text = "Order #1042 placed on 2024-03-15. Total: $249.99"

print(re.search(r'#(\\d+)', text).group(1))         # 1042
print(re.search(r'\\d{4}-\\d{2}-\\d{2}', text).group()) # 2024-03-15
print(re.findall(r'\\d+', text))                     # ['1042','2024','03','15','249','99']

# Named groups
m = re.search(r'(?P<year>\\d{4})-(?P<month>\\d{2})-(?P<day>\\d{2})', text)
print(m.groupdict())  # {'year':'2024','month':'03','day':'15'}

# Substitution
camel = "camelCaseVariableName"
snake = re.sub(r'(?<!^)(?=[A-Z])', '_', camel).lower()
print(snake)  # camel_case_variable_name

# Compile for reuse
email_re = re.compile(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')
emails = email_re.findall("Contact alice@example.com or bob@test.org for info")
print(emails)

# Split on multiple delimiters
csv = "alice,30;engineer|Python"
parts = re.split(r'[,;|]', csv)
print(parts)

# Lookahead / lookbehind
prices = "apple $1.99, mango $3.50, grape $2.25"
amounts = re.findall(r'(?<=\\$)[\\d.]+', prices)
print(amounts)  # ['1.99', '3.50', '2.25']
`,
      },
      {
        title: 'Type Hints & Protocols',
        description: 'Add static types with annotations, TypeVar, Generic, and structural subtyping via Protocol.',
        difficulty: 'Intermediate',
        language: 'python',
        code: `from typing import TypeVar, Generic, Protocol, Optional, Union, Callable
from dataclasses import dataclass

# Basic annotations
def greet(name: str, times: int = 1) -> str:
    return (f"Hello, {name}! " * times).strip()

print(greet("Alice", 2))

# TypeVar & Generic
T = TypeVar('T')

class Stack(Generic[T]):
    def __init__(self) -> None:
        self._items: list[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> Optional[T]:
        return self._items.pop() if self._items else None

    def peek(self) -> Optional[T]:
        return self._items[-1] if self._items else None

s: Stack[int] = Stack()
s.push(1); s.push(2); s.push(3)
print(s.pop(), s.peek())

# Protocol — structural subtyping (duck typing with types)
class Drawable(Protocol):
    def draw(self) -> str: ...

@dataclass
class Circle:
    radius: float
    def draw(self) -> str: return f"Circle(r={self.radius})"

@dataclass
class Square:
    side: float
    def draw(self) -> str: return f"Square(s={self.side})"

def render(shapes: list[Drawable]) -> None:
    for s in shapes: print(s.draw())

render([Circle(5.0), Square(3.0)])  # Both satisfy Drawable

# Union types (Python 3.10+ syntax)
def process(value: int | str | None) -> str:
    match value:
        case None: return "nothing"
        case int(n): return f"number: {n}"
        case str(s): return f"string: {s}"

print(process(42), process("hi"), process(None))
`,
      },
      {
        title: 'Async / Asyncio',
        description: 'Write concurrent I/O code with async/await, gather, and asyncio tasks.',
        difficulty: 'Advanced',
        language: 'python',
        code: `import asyncio
import time

# Simulate async I/O
async def fetch(url: str, delay: float) -> dict:
    await asyncio.sleep(delay)
    return {"url": url, "data": f"Response from {url}"}

async def fetch_with_timeout(url: str, timeout: float):
    try:
        return await asyncio.wait_for(fetch(url, 1.5), timeout=timeout)
    except asyncio.TimeoutError:
        return {"url": url, "error": "Timed out"}

# Sequential vs concurrent
async def sequential():
    start = time.perf_counter()
    r1 = await fetch("api/users", 0.3)
    r2 = await fetch("api/posts", 0.3)
    r3 = await fetch("api/comments", 0.3)
    elapsed = time.perf_counter() - start
    print(f"Sequential: {elapsed:.2f}s — got {len([r1,r2,r3])} responses")

async def concurrent():
    start = time.perf_counter()
    results = await asyncio.gather(
        fetch("api/users", 0.3),
        fetch("api/posts", 0.3),
        fetch("api/comments", 0.3),
    )
    elapsed = time.perf_counter() - start
    print(f"Concurrent: {elapsed:.2f}s — got {len(results)} responses")

async def with_timeout():
    results = await asyncio.gather(
        fetch_with_timeout("api/fast", timeout=2.0),
        fetch_with_timeout("api/slow", timeout=1.0),
    )
    for r in results: print(r)

async def main():
    await sequential()
    await concurrent()
    await with_timeout()

asyncio.run(main())
`,
      },
      {
        title: 'Functools & Itertools',
        description: 'Powerful higher-order functions: partial, reduce, lru_cache, chain, groupby, and more.',
        difficulty: 'Intermediate',
        language: 'python',
        code: `import functools
import itertools
import operator

# partial — fix some arguments
def power(base, exp): return base ** exp
square = functools.partial(power, exp=2)
cube   = functools.partial(power, exp=3)
print(list(map(square, range(6))))
print(list(map(cube,   range(6))))

# reduce — aggregate
print(functools.reduce(operator.mul, range(1, 6)))    # 5! = 120
print(functools.reduce(lambda a,b: a+b, range(101))) # 5050

# lru_cache
@functools.lru_cache(maxsize=128)
def fib(n):
    return n if n < 2 else fib(n-1) + fib(n-2)

print([fib(i) for i in range(10)])
print(fib.cache_info())

# itertools.chain
print(list(itertools.chain('ABC', [1,2,3], (True, False))))

# itertools.groupby
data = sorted("AAABBCCDDDDEE")
for key, grp in itertools.groupby(data):
    print(key, list(grp))

# itertools.product
print(list(itertools.product([1,2], ['a','b'])))

# itertools.combinations vs permutations
print(list(itertools.combinations('ABCD', 2)))
print(f"C(10,3) = {len(list(itertools.combinations(range(10), 3)))}")
`,
      },
    ],
  },
  {
    id: 'java',
    name: 'Java',
    fullName: 'Java',
    icon: <Layers size={20} />,
    color: '#ef4444',
    topics: [
      {
        title: 'Collections & Generics',
        description: 'Use ArrayList, HashMap, LinkedList, and TreeMap with generics for type-safe code.',
        difficulty: 'Beginner',
        language: 'java',
        code: `import java.util.*;
import java.util.stream.*;

class Main {
    public static void main(String[] args) {
        // ArrayList
        List<String> names = new ArrayList<>(Arrays.asList("Alice","Bob","Carol","David"));
        names.add("Eve");
        names.removeIf(n -> n.startsWith("C"));
        System.out.println("Names: " + names);

        // HashMap
        Map<String, Integer> scores = new HashMap<>();
        scores.put("Alice", 95); scores.put("Bob", 78);
        scores.put("Carol", 88); scores.put("David", 92);
        scores.merge("Bob", 5, Integer::sum); // Bob += 5
        System.out.println("Bob's score: " + scores.get("Bob"));

        // Sort by value
        scores.entrySet().stream()
            .sorted(Map.Entry.<String,Integer>comparingByValue().reversed())
            .forEach(e -> System.out.println(e.getKey() + ": " + e.getValue()));

        // LinkedList as deque
        Deque<Integer> deque = new LinkedList<>(Arrays.asList(1,2,3));
        deque.offerFirst(0);
        deque.offerLast(4);
        System.out.println("Deque: " + deque);

        // TreeMap — sorted keys
        TreeMap<String, Integer> sorted = new TreeMap<>(scores);
        System.out.println("First: " + sorted.firstKey());
        System.out.println("Last: " + sorted.lastKey());
    }
}
`,
      },
      {
        title: 'Streams API',
        description: 'Process collections declaratively with filter, map, reduce, collect, and parallel streams.',
        difficulty: 'Intermediate',
        language: 'java',
        code: `import java.util.*;
import java.util.stream.*;

class Main {
    record Employee(String name, String dept, int salary) {}

    public static void main(String[] args) {
        List<Employee> employees = List.of(
            new Employee("Alice", "Engineering", 95000),
            new Employee("Bob",   "Marketing",   65000),
            new Employee("Carol", "Engineering", 105000),
            new Employee("David", "HR",           58000),
            new Employee("Eve",   "Engineering",  88000),
            new Employee("Frank", "Marketing",    72000)
        );

        // Filter + map + collect
        List<String> highEarners = employees.stream()
            .filter(e -> e.salary() > 80000)
            .map(Employee::name)
            .sorted()
            .collect(Collectors.toList());
        System.out.println("High earners: " + highEarners);

        // Average salary
        OptionalDouble avg = employees.stream()
            .mapToInt(Employee::salary)
            .average();
        System.out.printf("Avg salary: $%.0f%n", avg.getAsDouble());

        // Group by department
        Map<String, List<Employee>> byDept = employees.stream()
            .collect(Collectors.groupingBy(Employee::dept));
        byDept.forEach((dept, list) ->
            System.out.println(dept + ": " + list.stream().map(Employee::name).toList()));

        // Avg salary per dept
        employees.stream()
            .collect(Collectors.groupingBy(Employee::dept, Collectors.averagingInt(Employee::salary)))
            .entrySet().stream()
            .sorted(Map.Entry.<String,Double>comparingByValue().reversed())
            .forEach(e -> System.out.printf("%s: $%.0f%n", e.getKey(), e.getValue()));
    }
}
`,
      },
      {
        title: 'OOP & Interfaces',
        description: 'Abstract classes, interfaces, default methods, and polymorphism in Java.',
        difficulty: 'Intermediate',
        language: 'java',
        code: `import java.util.*;

interface Shape {
    double area();
    default String describe() {
        return String.format("%s with area %.2f", getClass().getSimpleName(), area());
    }
    static Shape largest(List<Shape> shapes) {
        return shapes.stream().max(Comparator.comparingDouble(Shape::area)).orElseThrow();
    }
}

class Circle implements Shape {
    private final double radius;
    Circle(double r) { this.radius = r; }
    public double area() { return Math.PI * radius * radius; }
}

class Rectangle implements Shape {
    private final double w, h;
    Rectangle(double w, double h) { this.w = w; this.h = h; }
    public double area() { return w * h; }
}

class Triangle implements Shape {
    private final double base, height;
    Triangle(double b, double h) { this.base = b; this.height = h; }
    public double area() { return 0.5 * base * height; }
}

class Main {
    public static void main(String[] args) {
        List<Shape> shapes = List.of(
            new Circle(5), new Rectangle(4, 6),
            new Triangle(8, 10), new Circle(3)
        );

        shapes.forEach(s -> System.out.println(s.describe()));

        System.out.println("Largest: " + Shape.largest(shapes).describe());

        double totalArea = shapes.stream().mapToDouble(Shape::area).sum();
        System.out.printf("Total area: %.2f%n", totalArea);
    }
}
`,
      },
      {
        title: 'Optional & Null Safety',
        description: 'Eliminate NullPointerExceptions using Optional with map, flatMap, and orElse.',
        difficulty: 'Intermediate',
        language: 'java',
        code: `import java.util.*;

class Main {
    record Address(String street, String city, Optional<String> zip) {}
    record User(String name, Optional<Address> address) {}

    static Map<Integer, User> users = Map.of(
        1, new User("Alice", Optional.of(new Address("123 Main St", "Springfield", Optional.of("12345")))),
        2, new User("Bob",   Optional.of(new Address("456 Oak Ave", "Shelbyville", Optional.empty()))),
        3, new User("Carol", Optional.empty())
    );

    static Optional<User> findUser(int id) {
        return Optional.ofNullable(users.get(id));
    }

    public static void main(String[] args) {
        // Basic Optional usage
        for (int id : new int[]{1, 2, 3, 99}) {
            String city = findUser(id)
                .flatMap(u -> u.address())
                .map(Address::city)
                .orElse("Unknown");
            System.out.printf("User %d city: %s%n", id, city);
        }

        // orElseGet — lazy default
        User defaultUser = findUser(99)
            .orElseGet(() -> new User("Guest", Optional.empty()));
        System.out.println("Fallback: " + defaultUser.name());

        // orElseThrow
        try {
            findUser(99).orElseThrow(() -> new NoSuchElementException("User not found"));
        } catch (NoSuchElementException e) {
            System.out.println("Caught: " + e.getMessage());
        }

        // ifPresent / ifPresentOrElse
        findUser(1).ifPresentOrElse(
            u -> System.out.println("Found: " + u.name()),
            () -> System.out.println("Not found")
        );
    }
}
`,
      },
      {
        title: 'Functional Interfaces & Lambdas',
        description: 'Use Function, Predicate, Consumer, Supplier, and method references for clean code.',
        difficulty: 'Intermediate',
        language: 'java',
        code: `import java.util.*;
import java.util.function.*;
import java.util.stream.*;

class Main {
    public static void main(String[] args) {
        // Function<T,R> — transform
        Function<String, Integer> len = String::length;
        Function<Integer, Boolean> isEven = n -> n % 2 == 0;
        Function<String, Boolean> evenLength = len.andThen(isEven);

        List.of("hi","hello","hey","greetings").forEach(s ->
            System.out.println(s + " -> " + evenLength.apply(s)));

        // Predicate — filter
        Predicate<String> longWord  = s -> s.length() > 4;
        Predicate<String> startsH   = s -> s.startsWith("h");
        Predicate<String> combined  = longWord.and(startsH);

        List<String> words = List.of("hello","hi","hey","howdy","world","haskell");
        words.stream().filter(combined).forEach(System.out::println);

        // Consumer — side effects
        Consumer<String> print  = System.out::println;
        Consumer<String> upper  = s -> System.out.println(s.toUpperCase());
        words.stream().limit(3).forEach(print.andThen(upper));

        // Supplier — lazy value
        Supplier<List<String>> newList = ArrayList::new;
        List<String> list = newList.get();
        list.add("a"); list.add("b");
        System.out.println(list);

        // BiFunction
        BiFunction<Integer, Integer, String> compare =
            (a, b) -> a > b ? a + " wins" : b + " wins";
        System.out.println(compare.apply(10, 7));
    }
}
`,
      },
      {
        title: 'Design Patterns',
        description: 'Builder, Singleton, Observer, and Strategy patterns with clean Java implementations.',
        difficulty: 'Advanced',
        language: 'java',
        code: `import java.util.*;

class Main {
    // Builder Pattern
    static class HttpRequest {
        private final String url, method;
        private final Map<String,String> headers;
        private final String body;
        private HttpRequest(Builder b) {
            this.url=b.url; this.method=b.method;
            this.headers=b.headers; this.body=b.body;
        }
        public String toString() { return method+" "+url+" headers="+headers.size(); }

        static class Builder {
            private final String url;
            private String method = "GET";
            private Map<String,String> headers = new HashMap<>();
            private String body;
            Builder(String url) { this.url = url; }
            Builder method(String m) { this.method = m; return this; }
            Builder header(String k, String v) { headers.put(k,v); return this; }
            Builder body(String b) { this.body = b; return this; }
            HttpRequest build() { return new HttpRequest(this); }
        }
    }

    // Strategy Pattern
    interface SortStrategy { void sort(int[] arr); }
    static class BubbleSort implements SortStrategy {
        public void sort(int[] a) { for(int i=0;i<a.length-1;i++) for(int j=0;j<a.length-1-i;j++) if(a[j]>a[j+1]){int t=a[j];a[j]=a[j+1];a[j+1]=t;} }
    }
    static class Sorter {
        private SortStrategy strategy;
        Sorter(SortStrategy s) { this.strategy = s; }
        void sort(int[] arr) { strategy.sort(arr); }
    }

    public static void main(String[] args) {
        HttpRequest req = new HttpRequest.Builder("https://api.example.com/users")
            .method("POST")
            .header("Content-Type","application/json")
            .header("Authorization","Bearer token123")
            .body("{\"name\":\"Alice\"}")
            .build();
        System.out.println(req);

        int[] data = {5,3,8,1,9,2};
        Sorter sorter = new Sorter(new BubbleSort());
        sorter.sort(data);
        System.out.println(Arrays.toString(data));
    }
}
`,
      },
    ],
  },
  {
    id: 'cpp',
    name: 'C++',
    fullName: 'C++',
    icon: <Code2 size={20} />,
    color: '#06b6d4',
    topics: [
      {
        title: 'STL Containers',
        description: 'Use vector, map, set, queue, stack, and priority_queue from the Standard Library.',
        difficulty: 'Beginner',
        language: 'cpp',
        code: `#include <iostream>
#include <vector>
#include <map>
#include <set>
#include <queue>
#include <algorithm>
using namespace std;

int main() {
    // vector
    vector<int> v = {5, 3, 1, 4, 2};
    sort(v.begin(), v.end());
    cout << "Sorted vector: ";
    for (int x : v) cout << x << " ";
    cout << "\\n";

    // map (sorted by key)
    map<string, int> scores = {{"Alice",95},{"Bob",78},{"Carol",88}};
    scores["David"] = 92;
    for (auto& [name, score] : scores)
        cout << name << ": " << score << "\\n";

    // set (unique, sorted)
    set<int> nums = {3,1,4,1,5,9,2,6,5};
    cout << "Unique sorted: ";
    for (int n : nums) cout << n << " ";
    cout << "\\n";

    // priority_queue (max-heap by default)
    priority_queue<int> pq;
    for (int x : {3,1,4,1,5,9}) pq.push(x);
    cout << "Max-heap top: " << pq.top() << "\\n";

    // Min-heap
    priority_queue<int, vector<int>, greater<int>> minPQ;
    for (int x : {3,1,4,1,5,9}) minPQ.push(x);
    cout << "Min-heap top: " << minPQ.top() << "\\n";

    return 0;
}
`,
      },
      {
        title: 'Pointers & References',
        description: 'Understand raw pointers, smart pointers, references, and move semantics.',
        difficulty: 'Intermediate',
        language: 'cpp',
        code: `#include <iostream>
#include <memory>
#include <vector>
using namespace std;

struct Node {
    int val;
    shared_ptr<Node> next;
    Node(int v) : val(v), next(nullptr) {}
};

// unique_ptr — single owner
unique_ptr<int> makeValue(int x) {
    return make_unique<int>(x * 2);
}

// Reference vs pointer
void addByRef(int& x) { x += 10; }
void addByPtr(int* x) { *x += 10; }

int main() {
    // unique_ptr
    auto val = makeValue(21);
    cout << "unique_ptr value: " << *val << "\\n";

    // shared_ptr — reference counted
    auto n1 = make_shared<Node>(1);
    auto n2 = make_shared<Node>(2);
    n1->next = n2;
    cout << "Linked: " << n1->val << " -> " << n1->next->val << "\\n";
    cout << "n2 use count: " << n2.use_count() << "\\n";  // 2

    // References vs pointers
    int x = 5;
    addByRef(x);
    cout << "After ref: " << x << "\\n";  // 15
    addByPtr(&x);
    cout << "After ptr: " << x << "\\n";  // 25

    // Vector of smart pointers
    vector<unique_ptr<Node>> nodes;
    for (int i = 0; i < 5; i++)
        nodes.push_back(make_unique<Node>(i * 10));

    for (auto& n : nodes) cout << n->val << " ";
    cout << "\\n";

    return 0;  // all memory auto-freed
}
`,
      },
      {
        title: 'Templates & STL Algorithms',
        description: 'Write generic functions/classes with templates and use powerful STL algorithms.',
        difficulty: 'Advanced',
        language: 'cpp',
        code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>
#include <functional>
using namespace std;

// Function template
template<typename T>
T clamp(T val, T lo, T hi) {
    return max(lo, min(hi, val));
}

// Class template
template<typename T>
class Stack {
    vector<T> data;
public:
    void push(T val) { data.push_back(val); }
    T pop() { T v = data.back(); data.pop_back(); return v; }
    T top() const { return data.back(); }
    bool empty() const { return data.empty(); }
    size_t size() const { return data.size(); }
};

int main() {
    cout << clamp(15, 0, 10) << "\\n";  // 10
    cout << clamp(-5, 0, 10) << "\\n";  // 0

    Stack<int> s;
    for (int i : {3,1,4,1,5}) s.push(i);
    cout << "Top: " << s.top() << ", Size: " << s.size() << "\\n";

    // STL Algorithms
    vector<int> v = {5,3,8,1,9,2,7,4,6};

    // find_if, count_if
    auto it = find_if(v.begin(), v.end(), [](int x){ return x > 7; });
    cout << "First > 7: " << *it << "\\n";
    cout << "Count > 5: " << count_if(v.begin(), v.end(), [](int x){ return x>5; }) << "\\n";

    // transform
    vector<int> sq(v.size());
    transform(v.begin(), v.end(), sq.begin(), [](int x){ return x*x; });
    cout << "Sum of squares: " << accumulate(sq.begin(), sq.end(), 0) << "\\n";

    // partial_sort — top 3
    partial_sort(v.begin(), v.begin()+3, v.end(), greater<int>());
    cout << "Top 3: ";
    for (int i=0;i<3;i++) cout << v[i] << " ";
    cout << "\\n";

    return 0;
}
`,
      },
      {
        title: 'Lambda Expressions',
        description: 'Capture variables by value/reference, use lambdas with STL, and build closures.',
        difficulty: 'Intermediate',
        language: 'cpp',
        code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <functional>
using namespace std;

int main() {
    // Basic lambda
    auto greet = [](const string& name) { return "Hello, " + name + "!"; };
    cout << greet("World") << "\\n";

    // Capture by value [=] and by reference [&]
    int multiplier = 3;
    auto times = [multiplier](int x) { return x * multiplier; };
    auto addTo  = [&multiplier](int x) { multiplier += x; };

    cout << times(7) << "\\n";   // 21
    addTo(10);
    cout << multiplier << "\\n"; // 13

    // Mutable lambda
    auto counter = [count = 0]() mutable { return ++count; };
    cout << counter() << " " << counter() << " " << counter() << "\\n";

    // Lambda with STL
    vector<pair<string,int>> people = {{"Alice",30},{"Bob",25},{"Carol",35},{"Dave",28}};
    sort(people.begin(), people.end(), [](auto& a, auto& b){ return a.second < b.second; });
    for (auto& [name, age] : people) cout << name << ":" << age << " ";
    cout << "\\n";

    // std::function to store lambdas
    vector<function<int(int)>> fns;
    for (int i = 1; i <= 5; i++)
        fns.push_back([i](int x) { return x * i; });

    for (auto& f : fns) cout << f(10) << " ";
    cout << "\\n";

    return 0;
}
`,
      },
      {
        title: 'Move Semantics & RAII',
        description: 'Understand lvalues/rvalues, std::move, move constructors, and resource management.',
        difficulty: 'Advanced',
        language: 'cpp',
        code: `#include <iostream>
#include <vector>
#include <string>
#include <memory>
using namespace std;

// RAII — resource acquired in constructor, released in destructor
class FileHandle {
    string name;
    bool open;
public:
    FileHandle(string n) : name(move(n)), open(true) {
        cout << "Opened: " << name << "\\n";
    }
    ~FileHandle() {
        if (open) cout << "Closed: " << name << "\\n";
    }
    FileHandle(FileHandle&& other) noexcept
        : name(move(other.name)), open(other.open) {
        other.open = false;  // transfer ownership
    }
    FileHandle(const FileHandle&) = delete;  // no copy
};

// Move semantics with vector
void demonstrate_move() {
    vector<string> v1 = {"apple", "banana", "cherry"};
    cout << "v1 size before move: " << v1.size() << "\\n";

    vector<string> v2 = move(v1);  // O(1) — no copy
    cout << "v1 size after move:  " << v1.size() << "\\n";  // 0
    cout << "v2 size after move:  " << v2.size() << "\\n";  // 3
}

int main() {
    {
        FileHandle f1("data.txt");
        FileHandle f2 = move(f1);  // f1 no longer owns it
    }  // only f2 closes the file

    demonstrate_move();

    // unique_ptr — RAII for heap memory
    auto ptr = make_unique<vector<int>>(initializer_list<int>{1,2,3,4,5});
    cout << "Sum: ";
    for (int x : *ptr) cout << x << " ";
    cout << "\\n";
    // ptr automatically deleted here

    return 0;
}
`,
      },
      {
        title: 'Concurrency & Threads',
        description: 'Launch threads, use mutex for synchronization, and async/future for task-based concurrency.',
        difficulty: 'Advanced',
        language: 'cpp',
        code: `#include <iostream>
#include <thread>
#include <mutex>
#include <future>
#include <vector>
#include <numeric>
using namespace std;

mutex mtx;
int shared_counter = 0;

void increment(int times) {
    for (int i = 0; i < times; i++) {
        lock_guard<mutex> lock(mtx);
        ++shared_counter;
    }
}

// Parallel sum with async
long long parallel_sum(const vector<int>& data, int nthreads) {
    int chunk = data.size() / nthreads;
    vector<future<long long>> futures;
    for (int i = 0; i < nthreads; i++) {
        int start = i * chunk;
        int end   = (i == nthreads-1) ? data.size() : start + chunk;
        futures.push_back(async(launch::async, [&data, start, end]() {
            return accumulate(data.begin()+start, data.begin()+end, 0LL);
        }));
    }
    long long total = 0;
    for (auto& f : futures) total += f.get();
    return total;
}

int main() {
    // Threads with mutex
    vector<thread> threads;
    for (int i = 0; i < 4; i++)
        threads.emplace_back(increment, 250);
    for (auto& t : threads) t.join();
    cout << "Counter (expected 1000): " << shared_counter << "\\n";

    // async/future — fire-and-forget
    auto fut = async(launch::async, []() {
        return 42 * 42;
    });
    cout << "Async result: " << fut.get() << "\\n";

    // Parallel sum
    vector<int> data(1000);
    iota(data.begin(), data.end(), 1);
    cout << "Parallel sum 1..1000: " << parallel_sum(data, 4) << "\\n";

    return 0;
}
`,
      },
    ],
  },
];

const DIFFICULTY_COLORS = {
  Beginner:     { bg: 'rgba(16,185,129,0.15)', color: '#10b981', border: 'rgba(16,185,129,0.3)' },
  Intermediate: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
  Advanced:     { bg: 'rgba(239,68,68,0.15)',  color: '#ef4444', border: 'rgba(239,68,68,0.3)'  },
};

const GFG_LINKS = {
  dsa: 'https://www.geeksforgeeks.org/data-structures/',
  sql: 'https://www.geeksforgeeks.org/sql-tutorial/',
  javascript: 'https://www.geeksforgeeks.org/javascript/',
  python: 'https://www.geeksforgeeks.org/python-programming-language/',
  java: 'https://www.geeksforgeeks.org/java/',
  cpp: 'https://www.geeksforgeeks.org/c-plus-plus/',
  c: 'https://www.geeksforgeeks.org/c-programming-language/',
  ruby: 'https://www.geeksforgeeks.org/ruby/',
  typescript: 'https://www.geeksforgeeks.org/typescript/',
  php: 'https://www.geeksforgeeks.org/php/',
  csharp: 'https://www.geeksforgeeks.org/csharp-programming-language/',
  go: 'https://www.geeksforgeeks.org/go-programming-language/',
  rust: 'https://www.geeksforgeeks.org/rust-programming-language/',
  scala: 'https://www.geeksforgeeks.org/scala-programming-language/',
  r: 'https://www.geeksforgeeks.org/r-tutorial/',
};

export default function Explore({ onOpenInEditor }) {
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);
  const category = CATEGORIES.find(c => c.id === activeCat);

  return (
    <div className="explore-body">
      <aside className="explore-sidebar">
        <p className="explore-sidebar-label">Categories</p>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`explore-cat-btn ${activeCat === cat.id ? 'active' : ''}`}
            style={{ '--cat-color': cat.color }}
            onClick={() => setActiveCat(cat.id)}
          >
            <span className="explore-cat-icon" style={{ color: cat.color }}>{cat.icon}</span>
            <span className="explore-cat-name">{cat.name}</span>
            <span className="explore-cat-count">{cat.topics.length}</span>
            {activeCat === cat.id && <ChevronRight size={13} className="explore-cat-arrow" />}
          </button>
        ))}
      </aside>

      <main className="explore-main">
        <div className="explore-section-header">
          <div className="explore-section-title-row">
            <span className="explore-section-icon" style={{ color: category.color }}>{category.icon}</span>
            <div>
              <h2 className="explore-section-title">{category.fullName}</h2>
              <p className="explore-section-sub">{category.topics.length} topics</p>
            </div>
          </div>
          <a
            href={GFG_LINKS[category.id] || `https://www.geeksforgeeks.org/${category.name.toLowerCase().replace(/\s+/g, '-')}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="gfg-btn"
          >
            GeeksforGeeks <ExternalLink size={13} />
          </a>
        </div>

        <div className="explore-grid">
          {category.topics.map((topic, i) => {
            const diff = DIFFICULTY_COLORS[topic.difficulty];
            return (
              <div key={i} className="explore-card" style={{ '--cat-color': category.color }}>
                <div className="explore-card-top">
                  <h3 className="explore-card-title">{topic.title}</h3>
                  <span
                    className="explore-card-badge"
                    style={{ background: diff.bg, color: diff.color, border: `1px solid ${diff.border}` }}
                  >
                    {topic.difficulty}
                  </span>
                </div>
                <p className="explore-card-desc">{topic.description}</p>
                <button
                  className="explore-open-btn"
                  style={{ '--cat-color': category.color }}
                  onClick={() => onOpenInEditor(topic.language, topic.code)}
                >
                  <Play size={13} /> Open in Editor
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
