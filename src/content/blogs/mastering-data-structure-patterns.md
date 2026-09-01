---
id: mastering-data-structure-patterns
title: "Mastering Data Structure & Algorithm Patterns: The 5-Problem Blueprint"
date: "Sep 2026"
readTime: "15 min read"
topic: "Algorithms & Data Structures"
featured: true
thumbnail: "/images/blogs/mastering-data-structure-patterns.svg"
tags:
  - DSA
  - Algorithms
  - Data Structures
  - Coding Patterns
  - Problem Solving
  - TypeScript
summary: "A structured roadmap to mastering algorithmic problem-solving. Covers the 10 essential algorithmic patterns with mental models, complexity trade-offs, and 5 curated problems solved per pattern."
keyTakeaways:
  - "Pattern Recognition over Memorization: Master core algorithmic archetypes (Two Pointers, Sliding Window, Fast & Slow, Monotonic Stack, Backtracking)."
  - "State Transition & Invariants: Identify window expansion/shrink conditions, two-pointer convergence rules, and DP memoization subproblems."
  - "Time & Space Complexity Budgets: Map input constraints (N <= 10^5 -> O(N) or O(N log N)) directly to pattern candidates."
  - "The 5-Problem Rule: Solve 1 foundational, 3 standard variations, and 1 hard edge-case problem per archetype to build intuition."
---

# Mastering Data Structure & Algorithm Patterns: The 5-Problem Blueprint

When preparing for engineering interviews or building performance-critical systems, trying to memorize hundreds of individual LeetCode problems is a guaranteed recipe for burnout.

Top engineers don't memorize problems — they master **algorithmic patterns**.

Every coding challenge is essentially a variation of **10 fundamental algorithmic archetypes**. By learning the mental model and solving **5 curated problems per pattern** (ranging from foundational to hard edge-cases), you build the muscle memory required to solve almost any unseen problem.

```text
Problem Input ──→ Constraint Analysis ──→ Identify Archetype ──→ Apply Canonical Template ──→ Optimize Edge Cases
```

---

# Pattern 1: Two Pointers (Opposite & Same Direction)

### Mental Model
When dealing with sorted arrays, palindromes, or linear sequences where searching pairs naively takes $O(N^2)$, maintaining two pointers converging inward or scanning conditionally reduces time complexity to $O(N)$.

```text
Left Pointer ──→                      ←── Right Pointer
[  1,   2,   4,   7,   11,   15  ]  (Target = 15)
   ↑                              ↑
Sum = 1 + 15 = 16 > 15 ──→ Move Right Pointer Inward (Right--)
```

### Canonical Template
```typescript
function twoPointersTemplate(arr: number[], target: number): number[] {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const currentSum = arr[left] + arr[right];
    if (currentSum === target) {
      return [left, right];
    } else if (currentSum < target) {
      left++; // Need larger sum
    } else {
      right--; // Need smaller sum
    }
  }
  return [-1, -1];
}
```

### 5 Core Problems to Master
1. **Two Sum II (Input Array Is Sorted):** Converge pointers inward based on sum comparison ($O(N)$ time, $O(1)$ space).
2. **3Sum:** Sort array, fix index $i$, and run Two Pointers on the remaining subarray, skipping duplicates to avoid redundant triplets.
3. **Container With Most Water:** Move the pointer with the shorter vertical line inward at each step, maximizing potential bounding area.
4. **Trapping Rain Water:** Maintain `leftMax` and `rightMax` state variables while converging inward, calculating trapped water per column in $O(N)$ time and $O(1)$ space.
5. **Valid Palindrome II:** When mismatch occurs at `(left, right)`, check if skipping either `left + 1` or `right - 1` yields a valid palindrome.

---

# Pattern 2: Sliding Window (Fixed & Dynamic)

### Mental Model
Used on contiguous subarrays or substrings. Instead of recalculating state from scratch for every window ($O(N \cdot K)$), expand the window with the `right` pointer and dynamically contract with the `left` pointer when constraints are violated ($O(N)$).

```text
[ a   b   c   a   b   c   b   b ]
  └───────┘  ──→ Window: {a, b, c} (Length = 3)
      └───────┘  ──→ Move Left to maintain uniqueness
```

### Canonical Template (Dynamic Window)
```typescript
function dynamicSlidingWindow(s: string): number {
  let left = 0;
  let maxLen = 0;
  const frequencyMap = new Map<string, number>();

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    frequencyMap.set(char, (frequencyMap.get(char) || 0) + 1);

    // Shrink window if constraint violated
    while (/* condition violated */ frequencyMap.get(char)! > 1) {
      const leftChar = s[left];
      frequencyMap.set(leftChar, frequencyMap.get(leftChar)! - 1);
      left++;
    }

    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
```

### 5 Core Problems to Master
1. **Maximum Sum Subarray of Size K:** Fixed-size window; slide by adding incoming element and subtracting outgoing element.
2. **Longest Substring Without Repeating Characters:** Dynamic window storing last seen character indices in a Hash Map.
3. **Minimum Window Substring:** Track character match count against pattern map; contract `left` aggressively once all target characters are satisfied.
4. **Longest Repeating Character Replacement:** Maintain `maxFreq` inside the window; shrink when `(windowLength - maxFreq) > k`.
5. **Subarrays with K Different Integers:** Solve as `exactly(K) = atMost(K) - atMost(K - 1)`.

---

# Pattern 3: Fast & Slow Pointers (Floyd's Cycle Finding)

### Mental Model
Two pointers moving through a sequence or linked list at different speeds (e.g., `slow` takes 1 step, `fast` takes 2 steps). If a cycle exists, `fast` is guaranteed to catch up to `slow` in $O(N)$ time and $O(1)$ auxiliary space.

```text
Head ──→ (1) ──→ (2) ──→ (3) ──→ (4)
                  ↑               │
                  └────── (5) ←───┘
Slow: 1 step | Fast: 2 steps ──→ Collision occurs inside cycle
```

### Canonical Template
```typescript
class ListNode {
  val: number;
  next: ListNode | null = null;
  constructor(val: number) { this.val = val; }
}

function hasCycle(head: ListNode | null): boolean {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true; // Cycle detected
  }
  return false;
}
```

### 5 Core Problems to Master
1. **Linked List Cycle Detection:** Standard Floyd's collision check.
2. **Middle of the Linked List:** When `fast` reaches the end, `slow` is precisely at the midpoint.
3. **Linked List Cycle II (Find Start of Cycle):** After collision, reset one pointer to `head`; move both by 1 step to meet at cycle origin.
4. **Find the Duplicate Number:** Treat array elements as pointer pointers `arr[i] -> arr[arr[i]]` and detect the cycle entrance without modifying the array.
5. **Happy Number:** Sum of squares of digits forms a cycle; use fast/slow pointers to detect loop ending in 1 or endless cycle.

---

# Pattern 4: Monotonic Stack & Queue

### Mental Model
Maintains elements in strictly increasing or decreasing order. When a new element violates the monotonicity, elements are popped. This allows finding the **Next Greater / Previous Smaller Element** in amortized $O(N)$ time instead of $O(N^2)$.

```text
Incoming: [2, 1, 5, 6, 2, 3]
Stack (Monotonic Increasing):
Push 2 ──→ [2]
Push 1 ──→ Pop 2 ──→ [1] (1 is smaller)
Push 5 ──→ [1, 5]
Push 6 ──→ [1, 5, 6]
Push 2 ──→ Pop 6, Pop 5 ──→ [1, 2] (Process popped heights)
```

### Canonical Template
```typescript
function nextGreaterElement(nums: number[]): number[] {
  const result = new Array(nums.length).fill(-1);
  const stack: number[] = []; // Stores indices

  for (let i = 0; i < nums.length; i++) {
    while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {
      const prevIndex = stack.pop()!;
      result[prevIndex] = nums[i];
    }
    stack.push(i);
  }
  return result;
}
```

### 5 Core Problems to Master
1. **Next Greater Element I & II:** Maintain a decreasing monotonic stack to find immediate greater items (handle circular array with `2N` iteration).
2. **Daily Temperatures:** Calculate index difference `i - prevIndex` to find days until warmer temperature.
3. **Largest Rectangle in Histogram:** Monotonic increasing stack to determine left and right boundaries for every bar height.
4. **Sliding Window Maximum:** Monotonic Double-Ended Queue (Deque) storing indices in decreasing order of value.
5. **Online Stock Span:** Monotonic stack tracking `[price, span]` pairs, collapsing smaller preceding spans.

---

# Pattern 5: Binary Search on Answer Space (Min-Max Feasibility)

### Mental Model
Binary search is not just for finding an element in a sorted array. If the answer space is monotonic (i.e. `feasible(x) === true` implies `feasible(x + 1) === true`), you can binary search directly over the range $[min, max]$ in $O(\log(\text{range}) \cdot N)$.

```text
Capacity Search Space: [1, 2, 3, 4, ..., MaxCapacity]
Feasibility Check:     [F, F, F, T,  T,   T]
                                 ↑
                        First Feasible Value (Optimal Minimum)
```

### Canonical Template
```typescript
function binarySearchAnswerSpace(low: number, high: number, isFeasible: (val: number) => boolean): number {
  let left = low;
  let right = high;
  let result = high;

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (isFeasible(mid)) {
      result = mid;       // Candidate found, try smaller
      right = mid - 1;
    } else {
      left = mid + 1;     // Infeasible, need larger
    }
  }
  return result;
}
```

### 5 Core Problems to Master
1. **Find First and Last Position of Element:** Standard binary search with boundary preservation.
2. **Search in Rotated Sorted Array:** Determine which half is monotonically sorted and discard the irrelevant half.
3. **Koko Eating Bananas:** Binary search over speed $k \in [1, \max(piles)]$ checking if $\sum \lceil pile / k \rceil \le h$.
4. **Capacity To Ship Packages Within D Days:** Search over ship capacity range $[\max(weights), \sum weights]$.
5. **Median of Two Sorted Arrays:** Binary search on partition cut in the smaller array in $O(\log(\min(M, N)))$.

---

# Pattern 6: Top 'K' Elements (Heaps & Priority Queues)

### Mental Model
To find the $K$ largest elements, maintain a **Min-Heap of size $K$**. Any incoming element larger than the root replaces it. After processing $N$ elements, the heap contains the $K$ largest elements in $O(N \log K)$ time and $O(K)$ space.

```text
Find 3 Largest in [7, 10, 4, 3, 20, 15]
Min-Heap (Capacity 3):
[4, 7, 10]
Incoming 20 > 4 ──→ Pop 4, Push 20 ──→ [7, 10, 20]
Incoming 15 > 7 ──→ Pop 7, Push 15 ──→ [10, 15, 20]
Result = [10, 15, 20]
```

### 5 Core Problems to Master
1. **Kth Largest Element in an Array:** Min-Heap of size $K$ or QuickSelect in average $O(N)$ time.
2. **Top K Frequent Elements:** Frequency map + Min-Heap or Bucket Sort by frequency.
3. **Merge K Sorted Lists:** Min-Heap storing `(node.val, node)` across $K$ heads, popping the smallest and advancing in $O(N \log K)$.
4. **Find Median from Data Stream:** Two heaps pattern — `maxHeap` for lower half, `minHeap` for upper half; balance sizes to get median in $O(1)$.
5. **Task Scheduler:** Max-Heap of task frequencies combined with a cooldown FIFO queue to minimize idle CPU slots.

---

# Pattern 7: Tree & Graph Traversal (DFS & BFS)

### Mental Model
* **BFS (Queue):** Level-by-level shortest path in unweighted graphs or level-order tree exploration.
* **DFS (Recursion/Stack):** Exhaustive path exploration, subtree calculations, cycle detection, and backtracking.

### 5 Core Problems to Master
1. **Binary Tree Level Order Traversal:** Standard BFS with level-size tracking.
2. **Binary Tree Right Side View:** BFS recording the last element in each level, or DFS visiting Right before Left.
3. **Lowest Common Ancestor (LCA):** Post-order DFS bubbling up non-null nodes from left and right subtrees.
4. **Binary Tree Maximum Path Sum:** Post-order DFS computing max gain per branch while updating global diameter.
5. **Word Ladder:** Shortest path transformation using bidirectional BFS with character set substitutions.

---

# Pattern 8: Backtracking (Combinatorial Search)

### Mental Model
Explore all possible candidates by building incrementally. When a branch fails or reaches completion, backtrack by reverting the state.

```text
Decision Tree:
             []
      ┌───────┴───────┐
     [1]             [2]
   ┌──┴──┐            │
 [1,2]  [1,3]       [2,3]
```

### Canonical Template
```typescript
function backtrackTemplate(nums: number[]): number[][] {
  const result: number[][] = [];

  function backtrack(start: number, currentPath: number[]) {
    result.push([...currentPath]); // Base condition / record state

    for (let i = start; i < nums.length; i++) {
      currentPath.push(nums[i]);        // 1. Make choice
      backtrack(i + 1, currentPath);   // 2. Recurse
      currentPath.pop();                // 3. Undo choice (Backtrack)
    }
  }

  backtrack(0, []);
  return result;
}
```

### 5 Core Problems to Master
1. **Subsets (Power Set):** Include / exclude recursion tree.
2. **Permutations:** Backtracking with a `visited` boolean array or in-place swapping.
3. **Combination Sum:** Unbounded candidate reuse ($i$ instead of $i+1$) with target deduction.
4. **Word Search:** 2D grid DFS backtracking, marking visited cells temporarily as `#`.
5. **N-Queens:** Diagonal & column safety sets bounding state-space placement.

---

# Pattern 9: Dynamic Programming (Memoization & Tabulation)

### Mental Model
Break down complex problems into overlapping subproblems with optimal substructure. Store subproblem solutions in a memo table (Top-Down) or DP array (Bottom-Up).

### 5 Core Problems to Master
1. **Climbing Stairs / House Robber:** 1D DP where $dp[i] = \max(dp[i-1], dp[i-2] + nums[i])$, optimized to $O(1)$ space.
2. **Coin Change:** Unbounded Knapsack where $dp[amount] = 1 + \min(dp[amount - coin])$.
3. **Longest Increasing Subsequence (LIS):** $O(N^2)$ DP or $O(N \log N)$ Patience Sorting using binary search tails.
4. **Longest Common Subsequence (LCS):** 2D Grid DP matching characters $dp[i][j] = 1 + dp[i-1][j-1]$.
5. **Edit Distance:** 2D DP matrix computing minimum operations (Insert, Delete, Replace).

---

# Pattern 10: Topological Sort & Union-Find (Disjoint Sets)

### Mental Model
* **Topological Sort (Kahn's Algorithm):** In-degree array + Queue for directed acyclic graphs (DAGs) to resolve build dependencies.
* **Union-Find with Path Compression & Rank:** Near $O(1)$ amortized $(\alpha(N))$ connectivity and cycle detection in undirected graphs.

### 5 Core Problems to Master
1. **Course Schedule I & II:** Kahn's in-degree BFS or cycle-detecting DFS for valid topological ordering.
2. **Alien Dictionary:** Build directed character graph from adjacent sorted dictionary words and perform topological sort.
3. **Number of Connected Components:** Union-Find tracking component count reductions.
4. **Redundant Connection:** Identify the edge that creates a cycle using Union-Find.
5. **Graph Valid Tree:** Check that edge count equals $V - 1$ and all nodes form a single connected component without cycles.

---

# The 5-Problem Mastery Roadmap Checklist

| Pattern | Mental Model | Time / Space Target | Key Trigger Clue |
|---|---|---|---|
| **Two Pointers** | Converging left/right pointers | $O(N) / O(1)$ | Sorted arrays, pair sums, palindromes |
| **Sliding Window** | Expand `right`, contract `left` | $O(N) / O(K)$ | Contiguous subarrays, substrings, distinct $K$ |
| **Fast & Slow** | Floyd's cycle detection | $O(N) / O(1)$ | Cycles, middle of linked list |
| **Monotonic Stack** | Maintain increasing/decreasing order | $O(N) / O(N)$ | Next greater/smaller, histograms |
| **Binary Search** | Discard half of monotonic space | $O(\log N) / O(1)$ | Rotated sorted, min-max capacity feasibility |
| **Top K Elements** | Min-Heap of size $K$ | $O(N \log K) / O(K)$ | Finding $K$ largest/frequent, streaming data |
| **Tree Traversal** | BFS (Queue) / DFS (Recursion) | $O(N) / O(H)$ | Level order, shortest path, subtrees |
| **Backtracking** | Choose $\rightarrow$ Recurse $\rightarrow$ Undo | $O(2^N \text{ or } N!) / O(N)$ | All combinations, permutations, grid search |
| **Dynamic Prog.** | Overlapping subproblems | $O(N \cdot M) / O(N)$ | Optimization (min/max), counting ways |
| **Topological Sort** | In-degrees + DAG ordering | $O(V + E) / O(V)$ | Prerequisites, task build order |

---

# Summary & Engineering Philosophy

Solving DSA problems isn't about memorizing 500 solutions. It's about immediately classifying an incoming problem into one of these 10 archetypes, identifying the invariant, and applying the canonical template with clean edge-case handling.

> **"Master the pattern, and you master all 1,000 variations of it."**
