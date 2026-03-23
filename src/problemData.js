export const DSA_PROBLEMS = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
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
    difficulty: 'Medium',
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
    difficulty: 'Medium',
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
    difficulty: 'Hard',
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
    difficulty: 'Medium',
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
    difficulty: 'Medium',
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
    difficulty: 'Medium',
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
    difficulty: 'Easy',
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
    difficulty: 'Easy',
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
    difficulty: 'Medium',
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
    difficulty: 'Hard',
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
    difficulty: 'Medium',
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
    difficulty: 'Easy',
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
    difficulty: 'Easy',
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
    difficulty: 'Medium',
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
    difficulty: 'Medium',
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
    difficulty: 'Easy',
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
    difficulty: 'Medium',
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
];

export const SQL_PROBLEMS = [
  {
    id: 175,
    title: 'Combine Two Tables',
    difficulty: 'Easy',
    topic: 'Database, Join',
    url: 'https://leetcode.com/problems/combine-two-tables/',
    description: `Table: Person\n+-------------+---------+\n| Column Name | Type    |\n+-------------+---------+\n| personId    | int     |\n| lastName    | varchar |\n| firstName   | varchar |\n+-------------+---------+\npersonId is the primary key.\n\nTable: Address\n+-------------+---------+\n| Column Name | Type    |\n+-------------+---------+\n| addressId   | int     |\n| personId    | int     |\n| city        | varchar |\n| state       | varchar |\n+-------------+---------+\naddressId is the primary key.\n\nWrite a solution to report the first name, last name, city, and state of each person in the Person table. If the address of a personId is not present in the Address table, report null instead.`,
    examples: [
      {
        input: 'Person: [[1,"Wang","Allen"],[2,"Alice","Bob"]]\nAddress: [[1,2,"New York City","New York"],[2,3,"Leetcode","California"]]',
        output: '[["Allen","Wang",null,null],["Bob","Alice","New York City","New York"]]',
      },
    ],
    constraints: 'No constraints specified.',
    templateCode: `-- Write your MySQL query statement below
-- Hint: Use a LEFT JOIN to combine the two tables

SELECT
    -- select the required columns here
FROM Person
-- join Address table here
;`,
  },
  {
    id: 176,
    title: 'Second Highest Salary',
    difficulty: 'Medium',
    topic: 'Database',
    url: 'https://leetcode.com/problems/second-highest-salary/',
    description: `Table: Employee\n+-------------+------+\n| Column Name | Type |\n+-------------+------+\n| id          | int  |\n| salary      | int  |\n+-------------+------+\nid is the primary key.\n\nWrite a solution to find the second highest salary from the Employee table. If there is no second highest salary, return null.`,
    examples: [
      { input: 'Employee: [[1,100],[2,200],[3,300]]', output: '200' },
      { input: 'Employee: [[1,100]]', output: 'null' },
    ],
    constraints: 'No constraints specified.',
    templateCode: `-- Write your MySQL query statement below
-- Hint: Use LIMIT with OFFSET or subquery

SELECT
    -- return the second highest salary (or null if not found)
FROM Employee
;`,
  },
  {
    id: 177,
    title: 'Nth Highest Salary',
    difficulty: 'Medium',
    topic: 'Database',
    url: 'https://leetcode.com/problems/nth-highest-salary/',
    description: `Table: Employee\n+-------------+------+\n| Column Name | Type |\n+-------------+------+\n| id          | int  |\n| salary      | int  |\n+-------------+------+\nid is the primary key.\n\nCreate a function getNthHighestSalary(N INT) that returns the Nᵗʰ highest salary from the Employee table. If there is no Nᵗʰ highest salary, return null.`,
    examples: [
      { input: 'Employee: [[1,100],[2,200],[3,300]], N = 2', output: '200' },
      { input: 'Employee: [[1,100]], N = 2', output: 'null' },
    ],
    constraints: 'No constraints specified.',
    templateCode: `CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
  SET N = N - 1;
  RETURN (
      -- Write your solution here
      SELECT DISTINCT salary
      FROM Employee
      ORDER BY salary DESC
      LIMIT 1 OFFSET N
  );
END`,
  },
  {
    id: 178,
    title: 'Rank Scores',
    difficulty: 'Medium',
    topic: 'Database',
    url: 'https://leetcode.com/problems/rank-scores/',
    description: `Table: Scores\n+-------------+---------+\n| Column Name | Type    |\n+-------------+---------+\n| id          | int     |\n| score       | decimal |\n+-------------+---------+\nid is the primary key.\n\nWrite a solution to find the rank of the scores. The ranking should be calculated according to the following rules:\n- The scores should be ranked from the highest to the lowest.\n- If there is a tie between two scores, both should have the same ranking.\n- After a tie, the next ranking number should be the next consecutive integer value (dense rank).`,
    examples: [
      { input: 'Scores: [[1,3.5],[2,3.65],[3,4.0],[4,3.85],[5,4.0],[6,3.65]]', output: '[[4.0,1],[4.0,1],[3.85,2],[3.65,3],[3.65,3],[3.5,4]]' },
    ],
    constraints: 'No constraints specified.',
    templateCode: `-- Write your MySQL query statement below
-- Hint: Use DENSE_RANK() window function

SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) AS \`rank\`
FROM Scores
ORDER BY score DESC;`,
  },
  {
    id: 181,
    title: 'Employees Earning More Than Their Managers',
    difficulty: 'Easy',
    topic: 'Database',
    url: 'https://leetcode.com/problems/employees-earning-more-than-their-managers/',
    description: `Table: Employee\n+-------------+---------+\n| Column Name | Type    |\n+-------------+---------+\n| id          | int     |\n| name        | varchar |\n| salary      | int     |\n| managerId   | int     |\n+-------------+---------+\nid is the primary key.\n\nWrite a solution to find the employees who earn more than their managers.`,
    examples: [
      { input: 'Employee: [[1,"Joe",70000,3],[2,"Henry",80000,4],[3,"Sam",60000,null],[4,"Max",90000,null]]', output: '[["Joe"]]' },
    ],
    constraints: 'No constraints specified.',
    templateCode: `-- Write your MySQL query statement below
SELECT e.name AS Employee
FROM Employee e
JOIN Employee m ON e.managerId = m.id
WHERE e.salary > m.salary;`,
  },
  {
    id: 182,
    title: 'Duplicate Emails',
    difficulty: 'Easy',
    topic: 'Database',
    url: 'https://leetcode.com/problems/duplicate-emails/',
    description: `Table: Person\n+-------------+---------+\n| Column Name | Type    |\n+-------------+---------+\n| id          | int     |\n| email       | varchar |\n+-------------+---------+\nid is the primary key.\n\nWrite a solution to report all the duplicate emails.`,
    examples: [
      { input: 'Person: [[1,"a@b.com"],[2,"c@d.com"],[3,"a@b.com"]]', output: '[["a@b.com"]]' },
    ],
    constraints: 'No constraints specified.',
    templateCode: `-- Write your MySQL query statement below
SELECT email AS Email
FROM Person
GROUP BY email
HAVING COUNT(*) > 1;`,
  },
  {
    id: 183,
    title: 'Customers Who Never Order',
    difficulty: 'Easy',
    topic: 'Database',
    url: 'https://leetcode.com/problems/customers-who-never-order/',
    description: `Table: Customers\n+-------------+---------+\n| Column Name | Type    |\n+-------------+---------+\n| id          | int     |\n| name        | varchar |\n+-------------+---------+\nid is the primary key.\n\nTable: Orders\n+-------------+------+\n| Column Name | Type |\n+-------------+------+\n| id          | int  |\n| customerId  | int  |\n+-------------+------+\nid is the primary key.\n\nWrite a solution to find all customers who never order anything.`,
    examples: [
      { input: 'Customers: [[1,"Joe"],[2,"Henry"],[3,"Sam"],[4,"Max"]]\nOrders: [[1,3],[2,1]]', output: '[["Henry"],["Max"]]' },
    ],
    constraints: 'No constraints specified.',
    templateCode: `-- Write your MySQL query statement below
SELECT name AS Customers
FROM Customers
WHERE id NOT IN (SELECT customerId FROM Orders);`,
  },
  {
    id: 184,
    title: 'Department Highest Salary',
    difficulty: 'Medium',
    topic: 'Database, Join',
    url: 'https://leetcode.com/problems/department-highest-salary/',
    description: `Table: Employee\n+-------------+---------+\n| Column Name | Type    |\n+-------------+---------+\n| id          | int     |\n| name        | varchar |\n| salary      | int     |\n| departmentId| int     |\n+-------------+---------+\n\nTable: Department\n+-------------+---------+\n| Column Name | Type    |\n+-------------+---------+\n| id          | int     |\n| name        | varchar |\n+-------------+---------+\n\nWrite a solution to find employees who have the highest salary in each department.`,
    examples: [
      { input: 'Employee: [[1,"Joe",70000,1],[2,"Jim",90000,1],[3,"Henry",80000,2],[4,"Sam",60000,2],[5,"Max",90000,1]]\nDepartment: [[1,"IT"],[2,"Sales"]]', output: '[["IT","Jim",90000],["IT","Max",90000],["Sales","Henry",80000]]' },
    ],
    constraints: 'No constraints specified.',
    templateCode: `-- Write your MySQL query statement below
SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary
FROM Employee e
JOIN Department d ON e.departmentId = d.id
WHERE (e.departmentId, e.salary) IN (
    SELECT departmentId, MAX(salary)
    FROM Employee
    GROUP BY departmentId
);`,
  },
  {
    id: 196,
    title: 'Delete Duplicate Emails',
    difficulty: 'Easy',
    topic: 'Database',
    url: 'https://leetcode.com/problems/delete-duplicate-emails/',
    description: `Table: Person\n+-------------+---------+\n| Column Name | Type    |\n+-------------+---------+\n| id          | int     |\n| email       | varchar |\n+-------------+---------+\nid is the primary key.\n\nWrite a solution to delete all duplicate emails, keeping only one unique email with the smallest id.`,
    examples: [
      { input: 'Person: [[1,"john@example.com"],[2,"bob@example.com"],[3,"john@example.com"]]', output: 'Person: [[1,"john@example.com"],[2,"bob@example.com"]]' },
    ],
    constraints: 'No constraints specified.',
    templateCode: `-- Write your MySQL query statement below
DELETE p1
FROM Person p1, Person p2
WHERE p1.email = p2.email AND p1.id > p2.id;`,
  },
  {
    id: 197,
    title: 'Rising Temperature',
    difficulty: 'Easy',
    topic: 'Database',
    url: 'https://leetcode.com/problems/rising-temperature/',
    description: `Table: Weather\n+---------------+---------+\n| Column Name   | Type    |\n+---------------+---------+\n| id            | int     |\n| recordDate    | date    |\n| temperature   | int     |\n+---------------+---------+\nid is the primary key.\n\nWrite a solution to find all dates id with higher temperatures compared to its previous dates (yesterday).`,
    examples: [
      { input: 'Weather: [[1,"2015-01-01",10],[2,"2015-01-02",25],[3,"2015-01-03",20],[4,"2015-01-04",30]]', output: '[[2],[4]]' },
    ],
    constraints: 'No constraints specified.',
    templateCode: `-- Write your MySQL query statement below
SELECT w1.id
FROM Weather w1
JOIN Weather w2 ON DATEDIFF(w1.recordDate, w2.recordDate) = 1
WHERE w1.temperature > w2.temperature;`,
  },
];
