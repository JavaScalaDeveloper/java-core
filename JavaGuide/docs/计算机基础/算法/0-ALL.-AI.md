---
title: 算法 AI优化汇总
---

# 算法 AI优化汇总

> 基于 0-ALL.md 的 AI 优化版（原文较大）：正文收录重点篇并补充体系化内容；完整原文见 0-ALL.md。

## AI 补充：体系化梳理与易漏考点

> 本节在汇总原文基础上，补充面试追问、对比项与工程落地注意点。

### 知识地图
- 网络：TCP/HTTP/HTTPS/DNS
- 操作系统：进程线程、锁、内存、IO 多路复用
- 数据结构与算法：哈希、树、堆、图与题型模板

### 常漏追问
1. **TCP 与 UDP 怎么选？** 可靠有序选 TCP；实时弱网可 UDP + 应用层可靠。
2. **epoll 比 select 好在哪？** 事件驱动、FD 多时高效。
3. **进程与线程区别？** 地址空间、开销、通信方式。

### 工程落地检查清单
- [ ] 是否有明确指标（延迟、吞吐、错误率、积压）？
- [ ] 失败是否可重试且幂等？
- [ ] 是否有限流/超时/降级？
- [ ] 是否有日志、链路追踪与告警？
- [ ] 配置变更与回滚是否可操作？


## TOC

1. DFS 与 BFS 面试题总结：树、图、矩阵搜索与最短路径模板 (`DFS 与 BFS 面试题总结-树、图、矩阵搜索与最短路径模板.md`)
2. Top K 问题面试题总结：堆、快排分区、桶计数与数据流 (`Top K 问题面试题总结-堆、快排分区、桶计数与数据流.md`)
3. 常见数据结构经典 LeetCode 题目推荐 (`常见数据结构经典 LeetCode 题目推荐.md`)
4. 动态规划面试题总结：状态转移、背包、子序列与 Java 模板 (`动态规划面试题总结-状态转移、背包、子序列与 Java 模板.md`)
5. 二分查找面试题总结：左右边界、答案二分与 Java 模板 (`二分查找面试题总结-左右边界、答案二分与 Java 模板.md`)
6. 回溯算法面试题总结：组合、排列、子集、剪枝与 Java 模板 (`回溯算法面试题总结-组合、排列、子集、剪枝与 Java 模板.md`)
7. 几道常见的链表算法题 (`几道常见的链表算法题.md`)
8. 几道常见的字符串算法题 (`几道常见的字符串算法题.md`)
9. 剑指offer部分编程题 (`剑指offer部分编程题.md`)
10. 经典算法思想总结（含 LeetCode 题目推荐） (`经典算法思想总结（含 LeetCode 题目推荐）.md`)
11. 十大经典排序算法总结 (`十大经典排序算法总结.md`)
12. 时间复杂度和空间复杂度面试指南：Big O、递归复杂度与常见误区 (`时间复杂度和空间复杂度面试指南-Big O、递归复杂度与常见误区.md`)
13. 双指针与滑动窗口面试题总结：数组、链表、字符串高频模板 (`双指针与滑动窗口面试题总结-数组、链表、字符串高频模板.md`)
14. 贪心算法面试题总结：区间贪心、跳跃游戏与证明思路 (`贪心算法面试题总结-区间贪心、跳跃游戏与证明思路.md`)

---

<!-- source: DFS 与 BFS 面试题总结-树、图、矩阵搜索与最短路径模板.md -->

## [1] DFS 与 BFS 面试题总结：树、图、矩阵搜索与最短路径模板

---
title: DFS 与 BFS 面试题总结：树、图、矩阵搜索与最短路径模板
description: DFS 与 BFS 面试题总结，讲解深度优先搜索、广度优先搜索、树遍历、图遍历、矩阵搜索、层序遍历、最短路径和 Java 模板。
category: 计算机基础
tag:
  - 算法
head:
  - - meta
    - name: keywords
      content: DFS,BFS,深度优先搜索,广度优先搜索,树遍历,图遍历,矩阵搜索,层序遍历,最短路径,Java DFS,Java BFS,LeetCode
---

DFS 和 BFS 是树、图、矩阵题的基础。面试里不会只问“DFS 是什么”，更常见的是给你一个岛屿、课程依赖、最短步数或二叉树层序遍历，让你选搜索方式并写出边界处理。

一个简单判断：需要一路走到底、枚举路径或处理连通块时，优先想 DFS；需要按层推进、求最短步数时，优先想 BFS。

## 面试考察重点

- 能写递归 DFS、队列 BFS。
- 能说出树和图搜索的复杂度。
- 能处理 `visited`，避免重复访问和死循环。
- 能区分“遍历所有节点”和“求最短步数”。
- 能把矩阵题转换成图搜索。

## 怎么选择 DFS 还是 BFS？

DFS 和 BFS 都能遍历节点，但它们的天然优势不同。

| 目标             | 更常用            | 原因                         |
| ---------------- | ----------------- | ---------------------------- |
| 遍历所有节点     | DFS 或 BFS 都可以 | 只要不重复访问即可           |
| 找连通块面积     | DFS 更顺手        | 一路递归扩展，代码短         |
| 求无权图最短步数 | BFS               | 按层推进，第一次到达就是最短 |
| 枚举所有路径     | DFS               | 路径天然存在递归栈里         |
| 二叉树层序遍历   | BFS               | 队列正好按层处理             |

如果题目里出现“最少几步”“最短路径”“扩散到所有位置”，先想 BFS。如果题目里出现“所有方案”“是否存在一条路径”“连通块大小”，先想 DFS。

## DFS 模板

矩阵 DFS 常见写法：

```java
void dfs(char[][] grid, int i, int j) {
    if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length) {
        return;
    }
    if (grid[i][j] != '1') {
        return;
    }
    grid[i][j] = '2';
    dfs(grid, i + 1, j);
    dfs(grid, i - 1, j);
    dfs(grid, i, j + 1);
    dfs(grid, i, j - 1);
}
```

这里直接把访问过的陆地改成 `'2'`，相当于使用原数组做访问标记。如果题目不允许修改输入，就单独建 `boolean[][] visited`。

DFS 的递归函数要先定义清楚含义。上面这段代码可以解释为：从 `(i, j)` 出发，把和它连通的所有陆地都标记掉。

这个含义决定了代码顺序：

1. 越界直接返回。
2. 当前格子不是陆地直接返回。
3. 标记当前格子，避免重复访问。
4. 继续访问上下左右 4 个方向。

很多 DFS bug 都来自第 3 步写晚了。如果先递归邻居，再标记当前节点，就可能在两个相邻格子之间来回递归。

## BFS 模板

BFS 适合层序遍历和最短步数。下面的模板约定输入是非空矩形矩阵，其中 `0` 表示可以通行，`1` 表示障碍物；函数返回起点到目标点的最短步数，坐标越界或目标不可达时返回 `-1`：

```java
int bfs(int[][] grid, int startX, int startY, int targetX, int targetY) {
    if (grid == null || grid.length == 0 || grid[0].length == 0) {
        return -1;
    }
    int rows = grid.length;
    int columns = grid[0].length;
    if (startX < 0 || startX >= rows || startY < 0 || startY >= columns
            || targetX < 0 || targetX >= rows || targetY < 0 || targetY >= columns
            || grid[startX][startY] == 1 || grid[targetX][targetY] == 1) {
        return -1;
    }
    int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    Queue<int[]> queue = new ArrayDeque<>();
    queue.offer(new int[] {startX, startY});
    boolean[][] visited = new boolean[rows][columns];
    visited[startX][startY] = true;
    int step = 0;
    while (!queue.isEmpty()) {
        int size = queue.size();
        for (int k = 0; k < size; k++) {
            int[] cur = queue.poll();
            if (cur[0] == targetX && cur[1] == targetY) {
                return step;
            }
            for (int[] dir : dirs) {
                int x = cur[0] + dir[0];
                int y = cur[1] + dir[1];
                if (x < 0 || x >= rows || y < 0 || y >= columns
                        || visited[x][y] || grid[x][y] == 1) {
                    continue;
                }
                visited[x][y] = true;
                queue.offer(new int[] {x, y});
            }
        }
        step++;
    }
    return -1;
}
```

这段代码在目标节点第一次出队时返回当前层数，而不是等队列清空。具体题目的可通行条件可能不是 `0` 和 `1`，需要按题意调整。

BFS 的关键是“按层处理”。队列里一开始是第 0 层节点，每轮取出当前队列大小 `size`，只处理这一层的节点；它们扩展出来的新节点属于下一层。

为什么无权图 BFS 能求最短路径？因为每条边的代价相同。BFS 第一次到达某个节点时，一定是用了最少的边数。后面即使还能再次到达，也不会更短，所以可以直接标记访问。

多源 BFS 也很常见。比如“腐烂的橘子”里，所有烂橘子同时开始扩散。做法是先把所有初始烂橘子都入队，再按层扩散。

## 树搜索和图搜索的区别

树没有环，很多时候不需要 `visited`。图可能有环，必须考虑重复访问。

| 场景           | 是否常用 `visited` | 说明                   |
| -------------- | ------------------ | ---------------------- |
| 二叉树递归遍历 | 通常不用           | 节点没有回到父节点的边 |
| 无向图遍历     | 需要               | 否则两个节点会互相访问 |
| 有向图遍历     | 通常需要           | 可能存在环             |
| 矩阵搜索       | 需要               | 上下左右可能走回原点   |

## 复杂度

图搜索常用 `V` 表示顶点数，`E` 表示边数。邻接表存储时，DFS 和 BFS 的时间复杂度通常是 `O(V + E)`，空间复杂度是 `O(V)`。

矩阵搜索如果矩阵大小是 `m * n`，每个格子最多访问一次，时间复杂度是 `O(mn)`，访问标记或队列空间最坏也是 `O(mn)`。

## 矩阵题怎么转成图？

矩阵中的每个格子都可以看成图里的一个节点。上下左右 4 个方向，就是这个节点连出去的边。

常用方向数组：

```java
int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
```

遍历邻居时只需要做 3 件事：

1. 计算新坐标。
2. 判断是否越界。
3. 判断是否已经访问过，或是否符合题目要求。

如果题目允许斜向移动，把方向数组扩展成 8 个方向即可。不要在代码里手写 4 段几乎相同的递归调用，方向数组更不容易漏条件。

## 过程示意和边界样例

以岛屿数量为例，遇到一个未访问过的陆地格子，就从它开始 DFS/BFS，把整座岛都标记掉。

| 步骤 | 操作                   | 目的                   |
| ---- | ---------------------- | ---------------------- |
| 1    | 扫描矩阵，找到一个 `1` | 发现一座新岛           |
| 2    | 岛屿数量加 1           | 记录连通块             |
| 3    | 从当前格子 DFS/BFS     | 把这座岛所有陆地标记掉 |
| 4    | 继续扫描后续格子       | 避免重复统计同一座岛   |

矩阵搜索建议检查这些边界：

| 输入         | 重点                               |
| ------------ | ---------------------------------- |
| 空矩阵       | 是否先判断行列长度                 |
| 全是水       | 结果应该是 0                       |
| 全是陆地     | 只能统计成 1 个连通块              |
| 只有斜向相邻 | 如果题目只允许上下左右，不能算连通 |

常见错误写法：

```java
void dfs(char[][] grid, int i, int j) {
    dfs(grid, i + 1, j);
    grid[i][j] = '2'; // 错：标记太晚，可能来回递归
}
```

访问标记要在递归扩展邻居之前完成。图和矩阵里只要存在回边或相邻互访，标记太晚就可能重复访问甚至栈溢出。

## 易错点

- BFS 入队时就标记访问，避免同一个节点被重复入队。
- DFS 递归深度过大可能栈溢出，面试中可以说明可改成显式栈。
- 矩阵题先判断越界，再访问数组。
- 无向图要注意从子节点走回父节点的问题。
- 求最短步数时，BFS 的层数统计要和队列当前层大小绑定。

## 推荐练习题

- [102. 二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)
- [200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/)
- [695. 岛屿的最大面积](https://leetcode.cn/problems/max-area-of-island/)
- [994. 腐烂的橘子](https://leetcode.cn/problems/rotting-oranges/)
- [207. 课程表](https://leetcode.cn/problems/course-schedule/)

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: Top K 问题面试题总结-堆、快排分区、桶计数与数据流.md -->

## [2] Top K 问题面试题总结：堆、快排分区、桶计数与数据流

---
title: Top K 问题面试题总结：堆、快排分区、桶计数与数据流
description: Top K 问题面试题总结，讲解第 K 大、前 K 高频、小顶堆、快排分区、桶计数、数据流中位数、PriorityQueue 和 LeetCode 高频题。
category: 计算机基础
tag:
  - 算法
head:
  - - meta
    - name: keywords
      content: TopK,Top K,第K大,前K高频,堆,小顶堆,快排分区,桶计数,PriorityQueue,数据流中位数,LeetCode
---

Top K 问题在后端面试里很常见，因为它既能考算法，也能自然追问工程场景：排行榜、热词统计、数据流中位数、日志里最常见的错误码，都能落到 Top K。

这类题不要只记一种写法。面试官常会追问：如果数据量很大怎么办？如果是数据流怎么办？如果要求前 K 高频怎么办？不同条件下方案会变。

## 面试考察重点

- 能用堆解决第 K 大和前 K 高频。
- 能说清小顶堆和大顶堆怎么选。
- 能对比堆、快排分区、桶计数的复杂度。
- 能处理数据流场景。
- 能写出 Java `PriorityQueue` 比较器。

## Top K 题怎么选方案？

先看 3 个条件：

1. 是否只需要第 K 个元素，还是要完整的前 K 个元素？
2. 数据是一次性给出，还是持续到来的数据流？
3. 是否需要结果有序？

如果只是一次性数组里找第 K 大，快排分区平均更快；如果数据持续到来，维护一个大小为 K 的堆更自然；如果题目问前 K 高频，要先做频率统计，再对频率做 Top K。

## 方案对比

| 方案     | 适合场景                 | 时间复杂度         | 空间复杂度          |
| -------- | ------------------------ | ------------------ | ------------------- |
| 排序     | 数据量不大，代码简单优先 | `O(nlogn)`         | 取决于排序实现      |
| 小顶堆   | 找前 K 大或第 K 大       | `O(nlogk)`         | `O(k)`              |
| 快排分区 | 找第 K 大，平均效率高    | 平均 `O(n)`        | `O(1)` 到 `O(logn)` |
| 桶计数   | 频率范围有限，前 K 高频  | `O(n)`             | `O(n)`              |
| 双堆     | 数据流中位数             | 每次插入 `O(logn)` | `O(n)`              |

面试里可以这样回答取舍：

- 排序最简单，适合数据量不大或不追求最优复杂度。
- 堆适合 K 比 n 小很多的场景，空间只需要 `O(k)`。
- 快排分区适合一次性找第 K 大，平均 `O(n)`，但最坏会退化。
- 桶计数适合频率类问题，尤其是频率范围不超过 `n`。

## 小顶堆求第 K 大

```java
int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> heap = new PriorityQueue<>();
    for (int num : nums) {
        heap.offer(num);
        if (heap.size() > k) {
            heap.poll();
        }
    }
    return heap.peek();
}
```

堆里始终保留当前最大的 K 个数，堆顶就是这 K 个数里最小的，也就是整体第 K 大。

为什么是小顶堆？因为堆里要保留最大的 K 个元素。当新元素进来后，如果堆大小超过 K，就应该淘汰这 K + 1 个元素里最小的那个。小顶堆的堆顶正好是最小值。

如果求第 K 小，思路反过来：维护大小为 K 的大顶堆，超过 K 时弹出最大值。

## 代表题精讲：前 K 高频元素

[347. 前 K 个高频元素](https://leetcode.cn/problems/top-k-frequent-elements/) 是 Top K 里最常见的频率题。题目给定一个整数数组和整数 `k`，要求返回出现频率最高的 `k` 个元素，结果顺序通常不重要。

这题不要直接对原数组排序，因为要比较的是“频率”，不是元素值。更稳的拆法是两步：

1. 用 `HashMap` 统计每个元素出现次数。
2. 维护一个按频率升序的小顶堆，堆里只保留当前频率最高的 `k` 个元素。

为什么还是小顶堆？因为堆满以后，新元素进来时，只要堆大小超过 `k`，就弹出当前频率最低的元素。这样遍历完所有不同元素后，堆里剩下的就是前 `k` 高频。

```java
int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int num : nums) {
        freq.put(num, freq.getOrDefault(num, 0) + 1);
    }
    PriorityQueue<int[]> heap = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
    for (Map.Entry<Integer, Integer> entry : freq.entrySet()) {
        heap.offer(new int[] {entry.getKey(), entry.getValue()});
        if (heap.size() > k) {
            heap.poll();
        }
    }
    int[] ans = new int[k];
    for (int i = k - 1; i >= 0; i--) {
        ans[i] = heap.poll()[0];
    }
    return ans;
}
```

这里堆按频率升序，堆大小超过 K 时弹出频率最小的元素。

以 `nums = [1,1,1,2,2,3]`、`k = 2` 为例，频率表是 `{1=3, 2=2, 3=1}`。堆先放入 `1` 和 `2`，再放入 `3` 时大小超过 2，会弹出频率最低的 `3`，最终保留 `1` 和 `2`。

如果 `k` 等于不同元素个数，堆最后会保留全部元素；如果面试官要求输出按频率降序排列，最后还需要对结果额外排序。

如果面试官要求相同频率时按元素大小或字典序排序，比较器就要把第二排序规则写进去。比如前 K 高频单词通常要求频率高的在前，频率相同时字典序小的在前。

## 快排分区思路

快排分区适合找第 K 大，不要求输出有序的前 K 个元素。思路是每次把数组按 pivot 分成两边，根据 pivot 的排名决定继续搜索哪一边。平均时间复杂度是 `O(n)`，但最坏可能退化到 `O(n^2)`，实际写法通常会随机选 pivot。

快排分区的优势是不用维护堆，平均时间复杂度低；局限是它更适合内存中的一次性数据。如果数据流不断到来，或者数据太大不能一次性放进内存，堆方案更容易落地。

## 数据流场景

数据流题不能每来一个元素就重新排序。常见做法是持续维护一个数据结构：

- 数据流第 K 大：维护大小为 K 的小顶堆。
- 数据流中位数：维护两个堆，左边大顶堆放较小的一半，右边小顶堆放较大的一半。
- 滑动窗口中位数：还要处理过期元素，普通堆删除任意元素不方便，通常需要延迟删除或有序集合。

## 过程示意和边界样例

以数组 `[3, 2, 1, 5, 6, 4]` 求第 2 大为例，维护大小为 2 的小顶堆。表中为了方便阅读，按值升序展示堆中的元素，不代表 Java `PriorityQueue` 的内部数组顺序。

| 读入元素 | 候选元素    | 超过 K 后处理         |
| -------- | ----------- | --------------------- |
| 3        | `[3]`       | 不处理                |
| 2        | `[2, 3]`    | 不处理                |
| 1        | `[1, 2, 3]` | 弹出 1，保留 `[2, 3]` |
| 5        | `[2, 3, 5]` | 弹出 2，保留 `[3, 5]` |
| 6        | `[3, 5, 6]` | 弹出 3，保留 `[5, 6]` |
| 4        | `[4, 5, 6]` | 弹出 4，保留 `[5, 6]` |

最后堆顶是 `5`，也就是第 2 大。

常见错误写法：

```java
PriorityQueue<Integer> heap = new PriorityQueue<>((a, b) -> b - a);
```

这个比较器在极端整数值下可能溢出。更稳妥的写法是：

```java
PriorityQueue<Integer> heap = new PriorityQueue<>((a, b) -> Integer.compare(b, a));
```

## 易错点

- 找前 K 大通常用小顶堆，找前 K 小通常用大顶堆。
- `PriorityQueue` 默认是小顶堆。
- 前 K 高频要先统计频率，再对频率做 Top K。
- 如果要输出有序结果，堆或快排分区后还需要额外排序。
- 数据流场景不能把所有数据每次重新排序。

## 高频问题自测

- 找第 K 大为什么通常维护大小为 K 的小顶堆？
- 小顶堆和大顶堆分别适合哪些 Top K 场景？
- 堆方案和快排分区方案的时间复杂度、空间复杂度有什么区别？
- 前 K 高频元素为什么要先做频率统计？
- 数据流中位数为什么适合用两个堆维护？

## 推荐练习题

- [215. 数组中的第 K 个最大元素](https://leetcode.cn/problems/kth-largest-element-in-an-array/)
- [347. 前 K 个高频元素](https://leetcode.cn/problems/top-k-frequent-elements/)
- [692. 前 K 个高频单词](https://leetcode.cn/problems/top-k-frequent-words/)
- [703. 数据流中的第 K 大元素](https://leetcode.cn/problems/kth-largest-element-in-a-stream/)
- [295. 数据流的中位数](https://leetcode.cn/problems/find-median-from-data-stream/)

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 常见数据结构经典 LeetCode 题目推荐.md -->

## [3] 常见数据结构经典 LeetCode 题目推荐

---
title: 常见数据结构经典 LeetCode 题目推荐
description: 按数组、链表、栈、队列、哈希表、树、图、堆、Trie、并查集等结构整理 LeetCode 高频题，给出题型、模板、面试价值和复盘重点。
category: 计算机基础
tag:
  - 算法
  - 数据结构
  - LeetCode
head:
  - - meta
    - name: keywords
      content: LeetCode,数据结构,数组,链表,栈,队列,哈希表,二叉树,图,堆,Trie,并查集,题目推荐,刷题路线
---

刷数据结构题，不建议只按难度从 Easy 刷到 Hard。更稳的方式是按结构建立题型：数组看下标和区间，链表看指针，栈队列看顺序约束，树图看遍历，堆看优先级，哈希表看快速定位。

下面的题单控制在面试高频和模板代表题范围内。每类先做“必刷题”，再做“进阶题”。题目做完后，至少写下复杂度、边界样例和这题属于哪个模板。

## 怎么用这份题单

数据结构题不要只记结论。每刷一类题，先回到对应结构看一次“存储方式、核心操作、复杂度”，再动手写题。这样面试官追问 Java 集合、Redis、MySQL 索引或缓存场景时，答案不会只停在题解层面。

| 结构               | 先读什么                                                                                                                 | 刷题时重点看什么                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| 数组、链表、栈队列 | [线性数据结构详解](../数据结构/线性数据结构详解（数组、链表、栈、队列）.md)、[双指针与滑动窗口](./双指针与滑动窗口面试题总结-数组、链表、字符串高频模板.md) | 下标、指针更新、入栈出栈时机           |
| 哈希表             | [哈希表面试题总结](../数据结构/哈希表面试题总结-哈希冲突、扩容与 Java HashMap.md)                                                                      | key 的设计、计数时机、冲突和扩容       |
| 树和图             | [树结构详解](../数据结构/树结构详解（二叉树、AVL、BB+树）.md)、[图详解](../数据结构/图详解（DFS、BFS、最短路径）.md)、[DFS 与 BFS](./DFS 与 BFS 面试题总结-树、图、矩阵搜索与最短路径模板.md)                | 递归返回值、访问标记、BFS 层数统计     |
| 堆和 Top K         | [堆详解](../数据结构/堆详解（最大堆、最小堆、优先队列）.md)、[Top K 问题面试题总结](./Top K 问题面试题总结-堆、快排分区、桶计数与数据流.md)                                                  | 堆大小、比较器、数据流场景             |
| Trie 和并查集      | [Trie 前缀树面试题总结](../数据结构/Trie 前缀树面试题总结-字典树原理、前缀匹配与 Java 实现.md)、[并查集面试题总结](../数据结构/并查集面试题总结-路径压缩、连通性与 Java 模板.md)                  | 节点结构、结束标记、路径压缩、连通判断 |
| LRU                | [LRU 缓存面试题总结](../数据结构/LRU 缓存面试题总结-哈希表、双向链表与 LinkedHashMap.md)                                                                     | 哈希表和双向链表如何保持 O(1)          |

## 数组

| 题型     | 必刷题                                                                                          | 进阶题                                                                                                                                  | 面试价值         | 复盘重点                      |
| -------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ----------------------------- |
| 二分查找 | [704. 二分查找](https://leetcode.cn/problems/二分查找面试题总结-左右边界、答案二分与 Java 模板/)                                    | [34. 在排序数组中查找元素的第一个和最后一个位置](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/) | 考循环条件和边界 | `left <= right`、左右边界更新 |
| 原地修改 | [26. 删除有序数组中的重复项](https://leetcode.cn/problems/remove-duplicates-from-sorted-array/) | [80. 删除有序数组中的重复项 II](https://leetcode.cn/problems/remove-duplicates-from-sorted-array-ii/)                                   | 考双指针写法     | 慢指针含义、覆盖时机          |
| 双指针   | [977. 有序数组的平方](https://leetcode.cn/problems/squares-of-a-sorted-array/)                  | [15. 三数之和](https://leetcode.cn/problems/3sum/)                                                                                      | 高频数组题       | 排序后去重、左右指针移动      |
| 前缀和   | [303. 区域和检索 - 数组不可变](https://leetcode.cn/problems/range-sum-query-immutable/)         | [560. 和为 K 的子数组](https://leetcode.cn/problems/subarray-sum-equals-k/)                                                             | 子数组题入口     | 前缀和含义、哈希表计数        |

## 链表

| 题型     | 必刷题                                                                                          | 进阶题                                                                        | 面试价值         | 复盘重点                         |
| -------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------------- | -------------------------------- |
| 基础操作 | [707. 设计链表](https://leetcode.cn/problems/design-linked-list/)                               | [24. 两两交换链表中的节点](https://leetcode.cn/problems/swap-nodes-in-pairs/) | 考节点操作基本功 | 虚拟头节点、插入删除顺序         |
| 链表反转 | [206. 反转链表](https://leetcode.cn/problems/reverse-linked-list/)                              | [92. 反转链表 II](https://leetcode.cn/problems/reverse-linked-list-ii/)       | 高频手写题       | `prev`、`cur`、`next` 的更新顺序 |
| 快慢指针 | [141. 环形链表](https://leetcode.cn/problems/linked-list-cycle/)                                | [142. 环形链表 II](https://leetcode.cn/problems/linked-list-cycle-ii/)        | 常见追问题       | 相遇点和入环点推导               |
| 删除节点 | [19. 删除链表的倒数第 N 个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/) | [61. 旋转链表](https://leetcode.cn/problems/rotate-list/)                     | 考边界处理       | 链表长度、头节点被删             |

## 栈与队列

| 题型     | 必刷题                                                                          | 进阶题                                                                                              | 面试价值        | 复盘重点                   |
| -------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------- | -------------------------- |
| 结构模拟 | [232. 用栈实现队列](https://leetcode.cn/problems/implement-queue-using-stacks/) | [225. 用队列实现栈](https://leetcode.cn/problems/implement-stack-using-queues/)                     | 考结构理解      | 入队栈、出队栈职责         |
| 括号匹配 | [20. 有效的括号](https://leetcode.cn/problems/valid-parentheses/)               | [394. 字符串解码](https://leetcode.cn/problems/decode-string/)                                      | 字符串栈题入口  | 什么时候入栈、什么时候弹栈 |
| 单调栈   | [739. 每日温度](https://leetcode.cn/problems/daily-temperatures/)               | [84. 柱状图中最大的矩形](https://leetcode.cn/problems/largest-rectangle-in-histogram/)              | 中高频题型      | 栈中维护递增还是递减       |
| 单调队列 | [239. 滑动窗口最大值](https://leetcode.cn/problems/sliding-window-maximum/)     | [862. 和至少为 K 的最短子数组](https://leetcode.cn/problems/shortest-subarray-with-sum-at-least-k/) | Hard 题常见模板 | 队首过期、队尾维护单调性   |

## 哈希表

| 题型          | 必刷题                                                                      | 进阶题                                                                                   | 面试价值     | 复盘重点                       |
| ------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------ | ------------------------------ |
| 快速查找      | [1. 两数之和](https://leetcode.cn/problems/two-sum/)                        | [49. 字母异位词分组](https://leetcode.cn/problems/group-anagrams/)                       | 哈希表入门   | key 的设计                     |
| 计数          | [242. 有效的字母异位词](https://leetcode.cn/problems/valid-anagram/)        | [347. 前 K 个高频元素](https://leetcode.cn/problems/top-k-frequent-elements/)            | 高频统计题   | 数组计数和 Map 计数怎么选      |
| 前缀和 + 哈希 | [560. 和为 K 的子数组](https://leetcode.cn/problems/subarray-sum-equals-k/) | [974. 和可被 K 整除的子数组](https://leetcode.cn/problems/subarray-sums-divisible-by-k/) | 子数组题常考 | 先查再加，避免把当前前缀算进去 |
| 缓存结构      | [146. LRU 缓存](https://leetcode.cn/problems/LRU 缓存面试题总结-哈希表、双向链表与 LinkedHashMap/)                    | [460. LFU 缓存](https://leetcode.cn/problems/lfu-cache/)                                 | 手写设计题   | 哈希表和双向链表协作           |

## 二叉树

| 题型         | 必刷题                                                                                                                         | 进阶题                                                                                                                          | 面试价值   | 复盘重点                |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------- |
| 遍历         | [144. 二叉树的前序遍历](https://leetcode.cn/problems/binary-tree-preorder-traversal/)                                          | [102. 二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)                                        | 树题基础   | 递归边界、队列层数      |
| 路径问题     | [112. 路径总和](https://leetcode.cn/problems/path-sum/)                                                                        | [124. 二叉树中的最大路径和](https://leetcode.cn/problems/binary-tree-maximum-path-sum/)                                         | DFS 高频   | 返回值和全局答案分开    |
| 构造树       | [105. 从前序与中序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/) | [106. 从中序与后序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-inorder-and-postorder-traversal/) | 考递归区间 | 下标范围别写乱          |
| 最近公共祖先 | [236. 二叉树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/)                             | [235. 二叉搜索树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-search-tree/)                   | 高频追问   | 普通树和 BST 的解法差异 |

## 图

| 题型         | 必刷题                                                             | 进阶题                                                                  | 面试价值     | 复盘重点               |
| ------------ | ------------------------------------------------------------------ | ----------------------------------------------------------------------- | ------------ | ---------------------- |
| 网格 DFS/BFS | [200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/)   | [695. 岛屿的最大面积](https://leetcode.cn/problems/max-area-of-island/) | 图搜索入门   | 越界、访问标记         |
| 拓扑排序     | [207. 课程表](https://leetcode.cn/problems/course-schedule/)       | [210. 课程表 II](https://leetcode.cn/problems/course-schedule-ii/)      | 依赖关系题   | 入度数组、队列         |
| 最短路径     | [994. 腐烂的橘子](https://leetcode.cn/problems/rotting-oranges/)   | [127. 单词接龙](https://leetcode.cn/problems/word-ladder/)              | BFS 层序应用 | 每层步数统计           |
| 连通性       | [547. 省份数量](https://leetcode.cn/problems/number-of-provinces/) | [684. 冗余连接](https://leetcode.cn/problems/redundant-connection/)     | 并查集入口   | `find` 和 `union` 模板 |

## 堆

| 题型     | 必刷题                                                                                        | 进阶题                                                                                      | 面试价值    | 复盘重点           |
| -------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ----------- | ------------------ |
| 第 K 大  | [215. 数组中的第 K 个最大元素](https://leetcode.cn/problems/kth-largest-element-in-an-array/) | [703. 数据流中的第 K 大元素](https://leetcode.cn/problems/kth-largest-element-in-a-stream/) | Top K 高频  | 小顶堆大小保持为 K |
| 频率统计 | [347. 前 K 个高频元素](https://leetcode.cn/problems/top-k-frequent-elements/)                 | [692. 前 K 个高频单词](https://leetcode.cn/problems/top-k-frequent-words/)                  | 哈希表 + 堆 | 比较器写法         |
| 双堆     | [295. 数据流的中位数](https://leetcode.cn/problems/find-median-from-data-stream/)             | [480. 滑动窗口中位数](https://leetcode.cn/problems/sliding-window-median/)                  | 进阶设计题  | 大顶堆和小顶堆平衡 |

## Trie 与并查集

| 结构       | 必刷题                                                                     | 进阶题                                                                                                   | 面试价值     | 复盘重点               |
| ---------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------ | ---------------------- |
| Trie       | [208. 实现 Trie](https://leetcode.cn/problems/implement-trie-prefix-tree/) | [211. 添加与搜索单词](https://leetcode.cn/problems/design-add-and-search-words-data-structure/)          | 字符串集合题 | 节点结构、结束标记     |
| Trie + DFS | [212. 单词搜索 II](https://leetcode.cn/problems/word-search-ii/)           | [648. 单词替换](https://leetcode.cn/problems/replace-words/)                                             | 中高频题     | 前缀剪枝               |
| 并查集     | [547. 省份数量](https://leetcode.cn/problems/number-of-provinces/)         | [1319. 连通网络的操作次数](https://leetcode.cn/problems/number-of-operations-to-make-network-connected/) | 连通性模板   | 路径压缩               |
| 并查集判环 | [684. 冗余连接](https://leetcode.cn/problems/redundant-connection/)        | [990. 等式方程的可满足性](https://leetcode.cn/problems/satisfiability-of-equality-equations/)            | 图题常见变体 | 先合并等式，再检查冲突 |

## 复习路线入口

这篇文章只保留数据结构相关题单。7 天复习路线和 30 天复习路线统一维护在[数据结构复习总览](../数据结构/README.md)，避免题单文章和总览页重复维护同一套计划。

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 动态规划面试题总结-状态转移、背包、子序列与 Java 模板.md -->

## [4] 动态规划面试题总结：状态转移、背包、子序列与 Java 模板

---
title: 动态规划面试题总结：状态转移、背包、子序列与 Java 模板
description: 动态规划面试题总结，讲解状态定义、状态转移、初始化、遍历顺序、0-1 背包、完全背包、子序列、区间 DP 和 LeetCode 高频题。
category: 计算机基础
tag:
  - 算法
head:
  - - meta
    - name: keywords
      content: 动态规划,DP,状态转移,背包问题,0-1背包,完全背包,子序列,区间DP,Java动态规划,LeetCode动态规划
---

动态规划难，不是因为代码一定长，而是因为状态定义一旦错了，后面的转移方程、初始化和遍历顺序都会跟着错。

面试里不要一上来就背模板。先问自己两个问题：这个问题能不能拆成子问题？当前答案是否依赖前面已经算过的答案？如果这两个问题都成立，再考虑 DP。

## 面试考察重点

- 能说清 `dp[i]` 或 `dp[i][j]` 的含义。
- 能写出状态转移方程。
- 能处理初始化和遍历顺序。
- 能判断是否可以压缩空间。
- 能区分背包、子序列、区间等常见类型。

## 什么时候考虑动态规划？

DP 不是看到“最值”就套。更靠谱的判断是看两个条件：

1. 问题能不能拆成规模更小的同类问题。
2. 子问题会不会被反复计算。

比如斐波那契数列，`f(n)` 依赖 `f(n - 1)` 和 `f(n - 2)`，而 `f(n - 2)` 会在递归里被反复计算。把这些中间结果存下来，就是 DP。

面试里可以先从暴力递归说起，再说明哪里重复计算，最后把递归改成记忆化搜索或表格递推。这个过程比直接背 `dp` 数组更容易让面试官相信你真的理解。

## DP 五步法

1. 定义状态：`dp[i]` 到底表示什么。
2. 写转移：当前状态从哪些状态推出来。
3. 做初始化：没有前置状态时答案是什么。
4. 定遍历顺序：先算哪些状态，后算哪些状态。
5. 检查样例：用一个小输入手推数组。

其中最重要的是第 1 步。`dp[i]` 的含义一旦含糊，后面的代码就会变成试出来的。

一个好的状态定义通常满足：

- 能覆盖题目要问的答案。
- 能从更小状态推出来。
- 维度尽量少，但不要为了省空间把含义写乱。

## 一维 DP 示例

爬楼梯问题：

```java
int climbStairs(int n) {
    if (n <= 2) {
        return n;
    }
    int prev2 = 1;
    int prev1 = 2;
    for (int i = 3; i <= n; i++) {
        int cur = prev1 + prev2;
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}
```

状态含义：到第 `i` 阶有多少种走法。转移方程：`dp[i] = dp[i - 1] + dp[i - 2]`。

这题还可以从递归推出来：

```text
到第 i 阶的最后一步，要么从 i-1 走 1 步上来，要么从 i-2 走 2 步上来。
```

所以 `dp[i]` 只依赖前两个状态，可以把数组压缩成两个变量。空间压缩的前提是你确认旧状态以后不会再用。

## 0-1 背包模板

每个物品只能选一次：

```java
int knapsack01(int[] weights, int[] values, int capacity) {
    int[] dp = new int[capacity + 1];
    for (int i = 0; i < weights.length; i++) {
        for (int j = capacity; j >= weights[i]; j--) {
            dp[j] = Math.max(dp[j], dp[j - weights[i]] + values[i]);
        }
    }
    return dp[capacity];
}
```

容量要倒序遍历，避免同一个物品在一轮里被重复使用。

倒序遍历是 0-1 背包最容易被问的点。假设容量正序遍历，计算 `dp[j]` 时可能用到本轮刚更新过的 `dp[j - weight]`，等于同一个物品被选了多次。这就变成完全背包了。

0-1 背包的典型问法不一定直接叫背包，像“能否分成两个和相等的子集”，可以转成：能否从数组里选一些数，使它们的和等于总和的一半。

## 完全背包模板

每个物品可以选多次：

```java
int unboundedKnapsack(int[] weights, int[] values, int capacity) {
    int[] dp = new int[capacity + 1];
    for (int i = 0; i < weights.length; i++) {
        for (int j = weights[i]; j <= capacity; j++) {
            dp[j] = Math.max(dp[j], dp[j - weights[i]] + values[i]);
        }
    }
    return dp[capacity];
}
```

容量正序遍历，允许当前物品被重复使用。

完全背包里，正序遍历容量正是为了允许当前物品重复使用。比如零钱兑换，每种硬币可以用多次，计算更大金额时可以基于当前硬币已经参与过的状态继续转移。

如果题目问的是“组合数”还是“排列数”，遍历顺序也会变：

- 组合数：通常先遍历物品，再遍历容量。
- 排列数：通常先遍历容量，再遍历物品。

这块面试不一定问很深，但遇到零钱兑换 II 这类题时很关键。

## 常见题型

| 题型            | 状态设计                                               | 代表题        |
| --------------- | ------------------------------------------------------ | ------------- |
| 爬楼梯/打家劫舍 | `dp[i]` 表示前 `i` 个位置的最优值                      | 70、198       |
| 背包            | `dp[j]` 表示容量为 `j` 时的最优值或方案数              | 416、518、322 |
| 子序列          | `dp[i]` 或 `dp[i][j]` 表示以某位置结尾或两个前缀的答案 | 300、1143     |
| 回文            | `dp[i][j]` 表示区间 `[i, j]` 是否满足条件或最优值      | 647、516      |
| 路径            | `dp[i][j]` 表示走到格子 `(i, j)` 的答案                | 62、64        |

## 记忆化搜索和递推怎么选？

两种写法都在存子问题答案。

| 写法       | 特点                         | 适合场景                   |
| ---------- | ---------------------------- | -------------------------- |
| 记忆化搜索 | 从目标状态往下递归，按需计算 | 状态转移复杂、递归更自然   |
| 递推       | 从小状态往大状态填表         | 遍历顺序清楚、方便压缩空间 |

如果一开始想不清遍历顺序，可以先写记忆化搜索。等状态关系清楚后，再改成递推。很多树形 DP、区间 DP，用记忆化搜索更容易写对。

## 面试手写路径

DP 题不建议直接从代码开始。面试手写时，可以先把下面 4 句话讲清楚：

1. `dp` 数组的含义是什么，答案最终落在哪个位置。
2. 当前状态依赖哪些旧状态，为什么这些旧状态已经算过。
3. 初始化为什么这样写，尤其是 `0`、`1`、无穷大分别代表什么。
4. 遍历顺序为什么不会提前使用未计算或不该重复使用的状态。

如果这 4 句话说不清，代码大概率是靠记忆写出来的，遇到变体就容易散。

## 代表题精讲：零钱兑换

[322. 零钱兑换](https://leetcode.cn/problems/coin-change/) 是完全背包里很适合面试的一题。题目给定硬币面额和目标金额，问凑成目标金额最少需要多少枚硬币，每种硬币可以使用无限次。

状态定义可以这样说：

```text
dp[j] 表示凑成金额 j 所需的最少硬币数。
```

初始化是这题的关键。`dp[0] = 0`，表示凑成金额 0 不需要硬币；其他金额先设成一个不可能的较大值，表示暂时不可达。

代码里用到 `Arrays.fill`，需要导入 `java.util.Arrays`。

```java
int coinChange(int[] coins, int amount) {
    int max = amount + 1;
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, max);
    dp[0] = 0;

    for (int coin : coins) {
        for (int j = coin; j <= amount; j++) {
            dp[j] = Math.min(dp[j], dp[j - coin] + 1);
        }
    }

    return dp[amount] == max ? -1 : dp[amount];
}
```

为什么容量正序遍历？因为一枚硬币可以用多次。计算 `dp[j]` 时使用 `dp[j - coin]`，如果 `dp[j - coin]` 已经在本轮被当前硬币更新过，就代表当前硬币可以继续被使用，这正好符合完全背包。

如果题目变成“每种硬币只能用一次”，容量就要倒序遍历。遍历方向不是格式问题，而是在控制同一件物品能不能重复参与转移。

## 状态定义对比

DP 题经常不是不会写转移，而是状态含义选错。下面几组状态看起来接近，但写法完全不同：

| 题型           | 状态含义                                 | 常见转移关注点                 |
| -------------- | ---------------------------------------- | ------------------------------ |
| 最长递增子序列 | `dp[i]` 表示以 `nums[i]` 结尾的 LIS 长度 | 必须选 `nums[i]`，向前找更小值 |
| 打家劫舍       | `dp[i]` 表示前 `i` 间房子的最大金额      | 第 `i` 间偷或不偷              |
| 最长公共子序列 | `dp[i][j]` 表示两个前缀的 LCS 长度       | 比较两个前缀最后一个字符       |
| 回文子串       | `dp[i][j]` 表示区间 `[i, j]` 是否回文    | 依赖内部区间 `[i + 1, j - 1]`  |

面试里可以主动说一句：这里的 `dp[i]` 是“以 i 结尾”，不是“前 i 个元素里的最优值”。这句话能避免很多子序列题写错。

## 过程示意和边界样例

以爬楼梯为例，`n = 5` 时的状态变化如下：

| `i` | `dp[i - 2]` | `dp[i - 1]` | `dp[i]` |
| --- | ----------- | ----------- | ------- |
| 3   | 1           | 2           | 3       |
| 4   | 2           | 3           | 5       |
| 5   | 3           | 5           | 8       |

这张表要看的不是数字本身，而是状态只依赖前两个位置，所以可以压缩成两个变量。

DP 题建议检查这些边界：

| 输入             | 重点                     |
| ---------------- | ------------------------ |
| `n = 0` 或空数组 | 初始化是否覆盖           |
| 只有 1 个元素    | 是否越界访问 `dp[1]`     |
| 无法组成目标     | 初始值是否能表达“不可达” |
| 求方案数         | 初始化和遍历顺序是否正确 |

常见错误写法：

```java
for (int j = weights[i]; j <= capacity; j++) {
    dp[j] = Math.max(dp[j], dp[j - weights[i]] + values[i]); // 0-1 背包中是错的
}
```

0-1 背包中容量要倒序遍历，否则本轮刚更新的状态会被再次使用，相当于同一个物品被选了多次。

## 易错点

- `dp` 含义不要频繁变化。
- 初始化不是随便填 0，要看状态含义。
- 0-1 背包容量倒序，完全背包容量正序。
- 求方案数和求最值的初始化不同。
- 子序列题经常需要区分“以 i 结尾”和“前 i 个元素内”。

## 高频问题自测

- 为什么 DP 的第一步一定是定义状态？
- 记忆化搜索和递推的区别是什么？什么时候先写记忆化更稳？
- 0-1 背包为什么容量要倒序遍历？
- 完全背包为什么容量可以正序遍历？
- `dp[i]` 表示“以 i 结尾”和表示“前 i 个元素”时，转移有什么区别？
- 求最少次数、最大价值、方案数时，初始化分别要注意什么？

## 推荐练习题

- [70. 爬楼梯](https://leetcode.cn/problems/climbing-stairs/)
- [198. 打家劫舍](https://leetcode.cn/problems/house-robber/)
- [322. 零钱兑换](https://leetcode.cn/problems/coin-change/)
- [416. 分割等和子集](https://leetcode.cn/problems/partition-equal-subset-sum/)
- [300. 最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/)
- [1143. 最长公共子序列](https://leetcode.cn/problems/longest-common-subsequence/)

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 二分查找面试题总结-左右边界、答案二分与 Java 模板.md -->

## [5] 二分查找面试题总结：左右边界、答案二分与 Java 模板

---
title: 二分查找面试题总结：左右边界、答案二分与 Java 模板
description: 二分查找面试题总结，系统讲解基础二分、左边界、右边界、答案二分、Java 手写模板、复杂度分析和 LeetCode 高频题。
category: 计算机基础
tag:
  - 算法
head:
  - - meta
    - name: keywords
      content: 二分查找,二分查找模板,左右边界,答案二分,Java二分查找,LeetCode二分查找,算法面试题
---

二分查找最容易让人翻车的地方不是思想，而是边界。`left`、`right`、`mid`、循环条件、返回值，只要有一个含义没想清楚，就很容易写出死循环或者漏掉答案。

面试里判断能不能用二分，先看一句话：**答案所在空间是否有单调性**。数组有序只是最直观的一种情况，最小速度、最小容量、最小天数这类题，也可以在答案范围上二分。

## 面试考察重点

- 能写出基础二分模板。
- 能处理左边界、右边界。
- 能识别答案二分，而不是只会在数组里找数。
- 能解释为什么循环会结束，为什么不会漏答案。
- 能说出时间复杂度是 `O(logn)`，空间复杂度通常是 `O(1)`。

## 什么时候想到二分？

不要把二分查找理解成“只能在有序数组里找数字”。它真正依赖的是 **单调性**。

常见单调性有两类：

| 类型     | 例子                           | 判断方式                                   |
| -------- | ------------------------------ | ------------------------------------------ |
| 数组单调 | 有序数组中找 `target`          | `nums[mid]` 和 `target` 比较后能排除一半   |
| 答案单调 | 求最小速度、最小容量、最少天数 | 某个答案可行时，更大的答案也可行，或反过来 |

比如“爱吃香蕉的珂珂”里，吃香蕉速度越快，越容易在规定时间内吃完。这里数组本身不需要有序，单调的是“速度”和“是否能吃完”之间的关系。

面试时可以这样判断：

1. 题目是否在找一个位置、边界或最小/最大可行值？
2. 如果猜一个答案 `x`，能不能在 `O(n)` 或更低复杂度内判断它是否可行？
3. `x` 变大或变小时，可行性是否单调变化？

三个问题都能回答上来，基本就可以尝试二分。

## 基础二分模板

适合在有序数组中查找一个确定值：

```java
int binarySearch(int[] nums, int target) {
    int left = 0;
    int right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}
```

这个模板里，搜索区间是闭区间 `[left, right]`，所以循环条件是 `left <= right`。每次排除 `mid`，因此更新成 `mid + 1` 或 `mid - 1`。

用一句话记这个模板：**区间里每个位置都还可能是答案，循环结束时区间为空。**

举个例子，数组 `[1, 3, 5, 7, 9]` 中找 `7`：

1. `left = 0`，`right = 4`，`mid = 2`，`nums[mid] = 5`，目标在右侧。
2. 更新 `left = mid + 1 = 3`。
3. `mid = 3`，找到 `7`。

如果查找 `6`，最后会出现 `left > right`，说明闭区间已经被排空，返回 `-1`。

## 左边界模板

找第一个大于等于 `target` 的位置：

```java
int lowerBound(int[] nums, int target) {
    int left = 0;
    int right = nums.length;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] >= target) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}
```

这个模板的搜索区间是左闭右开 `[left, right)`。`right` 初始化为 `nums.length`，返回值可能等于 `nums.length`，表示数组中不存在大于等于 `target` 的位置。

左边界模板的关键不是“找到 target”，而是“找到第一个满足条件的位置”。这个写法能自然处理目标不存在的情况。

比如数组 `[1, 2, 2, 2, 4]`，找第一个大于等于 `2` 的位置：

- 当 `nums[mid] >= 2`，`mid` 可能就是答案，所以不能排除 `mid`，更新 `right = mid`。
- 当 `nums[mid] < 2`，`mid` 和它左边都不可能是答案，更新 `left = mid + 1`。

循环结束时，`left == right`，这个位置就是第一个满足条件的位置。

## 右边界模板

找最后一个小于等于 `target` 的位置，可以先找第一个大于 `target` 的位置，再减 1：

```java
int upperBound(int[] nums, int target) {
    int left = 0;
    int right = nums.length;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] > target) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left - 1;
}
```

这种写法的好处是左右边界只记一套思路：找第一个满足条件的位置。

右边界容易写错，推荐转化成左边界问题：

- 最后一个小于等于 `target` 的位置 = 第一个大于 `target` 的位置 - 1。
- 最后一个小于 `target` 的位置 = 第一个大于等于 `target` 的位置 - 1。

这样不需要维护两套模板，面试手写时更稳。

## 答案二分

答案二分不是在数组里找元素，而是在答案范围里找最小可行值或最大可行值。

典型问题：给定若干堆香蕉和总时间 `h`，求最小吃香蕉速度。速度越快，越容易在 `h` 小时内吃完，这就是单调性。

这类题通常分两步：

1. 确定答案范围。比如速度最小是 `1`，最大不超过最大那堆香蕉数。
2. 写 `check` 函数。给定一个速度，判断能不能在 `h` 小时内吃完。

这个上界成立依赖题目约束：`h >= piles.length`。因为速度等于最大堆大小时，每堆香蕉最多 1 小时吃完，总耗时不会超过堆数。

```java
int minEatingSpeed(int[] piles, int h) {
    int left = 1;
    int right = 0;
    for (int pile : piles) {
        right = Math.max(right, pile);
    }
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (canFinish(piles, h, mid)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}

boolean canFinish(int[] piles, int h, int speed) {
    long hours = 0;
    for (int pile : piles) {
        hours += (pile + speed - 1) / speed;
    }
    return hours <= h;
}
```

这里为什么返回 `left`？因为循环一直在找“第一个可行速度”。当 `canFinish(mid)` 为 true，说明 `mid` 可行，但可能还有更小的速度也可行，所以收缩右边界。最后左右边界重合的位置，就是最小可行速度。

答案二分的 `check` 函数往往比二分本身更重要。面试时建议先把 `check` 的含义说清楚，再写二分框架。

## 三类二分怎么选？

| 目标                         | 推荐模板 | 返回值                        |
| ---------------------------- | -------- | ----------------------------- |
| 找到某个等于 `target` 的下标 | 基础二分 | 找到返回下标，找不到返回 `-1` |
| 找第一个满足条件的位置       | 左边界   | 返回 `left`，可能等于数组长度 |
| 找最小可行答案               | 答案二分 | 返回最终的 `left`             |

如果题目里有“第一个”“最后一个”“最小可行”“最大可行”，不要急着写基础二分，先判断是不是边界问题。

## 面试手写路径

二分题的代码不长，面试里更容易被追问的是“你为什么敢丢掉一半”。手写时可以按这个顺序来：

1. 先说明搜索空间：是在数组下标里找，还是在答案范围里找。
2. 再说明单调性：`mid` 左右两侧为什么可以排除一边。
3. 明确区间含义：闭区间 `[left, right]` 还是左闭右开 `[left, right)`。
4. 写更新规则：`mid` 还能不能成为答案，决定写 `right = mid` 还是 `right = mid - 1`。
5. 最后说返回值：循环结束时 `left`、`right` 分别代表什么。

一个很实用的自检问题是：**当 `nums[mid]` 正好满足条件时，我有没有把可能的答案删掉？** 左边界、答案二分里，`mid` 经常仍然可能是答案，所以不能随手写成 `right = mid - 1`。

## 代表题精讲：查找第一个和最后一个位置

[34. 在排序数组中查找元素的第一个和最后一个位置](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/) 是边界二分的典型题。题目要求返回 `target` 的起始和结束位置，如果不存在返回 `[-1, -1]`。

这题不要写成“找到一个 target 后向两边扫描”。虽然能过一些用例，但最坏情况下会退化成 `O(n)`。更稳的写法是做两次边界查找：

- 第一次找第一个大于等于 `target` 的位置。
- 第二次找第一个大于 `target` 的位置，再减 1。

下面两个辅助方法与上文模板一致，这里保留完整代码，方便把返回值含义和主逻辑放在一起对照。

```java
int[] searchRange(int[] nums, int target) {
    int left = lowerBound(nums, target);
    if (left == nums.length || nums[left] != target) {
        return new int[] {-1, -1};
    }
    int right = upperBound(nums, target) - 1;
    return new int[] {left, right};
}

int lowerBound(int[] nums, int target) {
    int left = 0;
    int right = nums.length;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] >= target) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}

int upperBound(int[] nums, int target) {
    int left = 0;
    int right = nums.length;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] > target) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}
```

面试里这题常见追问是：如果数组中全是 `target` 怎么办？如果 `target` 不存在但应该插在中间怎么办？这两个问题其实都在考返回值含义。`lowerBound` 返回的是第一个满足条件的位置，不保证这个位置上的值一定等于 `target`，所以返回前要再检查一次。

## 过程示意和边界样例

以左边界模板为例，数组 `[1, 2, 2, 2, 4]` 中找第一个大于等于 `2` 的位置：

| 轮次 | `left` | `right` | `mid` | 判断            | 下一步      |
| ---- | ------ | ------- | ----- | --------------- | ----------- |
| 1    | 0      | 5       | 2     | `nums[2] >= 2`  | `right = 2` |
| 2    | 0      | 2       | 1     | `nums[1] >= 2`  | `right = 1` |
| 3    | 0      | 1       | 0     | `nums[0] < 2`   | `left = 1`  |
| 结束 | 1      | 1       | -     | `left == right` | 返回 1      |

几个边界样例建议手写前先过一遍：

| 输入        | 目标       | 预期                                 |
| ----------- | ---------- | ------------------------------------ |
| `[]`        | `1`        | 返回 `-1` 或插入位置 `0`，看题目要求 |
| `[1]`       | `1`        | 能命中唯一元素                       |
| `[1, 1, 1]` | 左边界 `1` | 返回 `0`                             |
| `[1, 3, 5]` | 左边界 `4` | 返回 `2`                             |
| `[1, 3, 5]` | 左边界 `6` | 返回 `3`                             |

常见错误写法：

```java
while (left < right) {
    int mid = (left + right) / 2;
    if (nums[mid] >= target) {
        right = mid - 1; // 错：mid 可能就是左边界，不能直接排除
    } else {
        left = mid + 1;
    }
}
```

左边界里，当 `nums[mid] >= target` 时，`mid` 仍然可能是答案，所以应该写 `right = mid`。

## 易错点

- `mid = (left + right) / 2` 可能整数溢出，推荐写成 `left + (right - left) / 2`。
- 不要混用闭区间和左闭右开区间的更新方式。
- 找边界时，命中目标后通常不能直接返回，还要继续收缩区间。
- 答案二分要先证明单调性，不能看到“最小值”就硬套。
- `canFinish` 这类判断函数里可能需要 `long`，避免累计值溢出。

## 高频问题自测

- `left < right` 和 `left <= right` 有什么区别？
- 二分查找为什么是 `O(logn)`？
- 找左边界时，为什么命中后要移动 `right`？
- 什么是答案二分？它和普通二分有什么区别？
- 二分查找一定要求数组有序吗？

## 推荐练习题

- [704. 二分查找](https://leetcode.cn/problems/二分查找面试题总结-左右边界、答案二分与 Java 模板/)
- [35. 搜索插入位置](https://leetcode.cn/problems/search-insert-position/)
- [34. 在排序数组中查找元素的第一个和最后一个位置](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/)
- [875. 爱吃香蕉的珂珂](https://leetcode.cn/problems/koko-eating-bananas/)
- [1011. 在 D 天内送达包裹的能力](https://leetcode.cn/problems/capacity-to-ship-packages-within-d-days/)

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 回溯算法面试题总结-组合、排列、子集、剪枝与 Java 模板.md -->

## [6] 回溯算法面试题总结：组合、排列、子集、剪枝与 Java 模板

---
title: 回溯算法面试题总结：组合、排列、子集、剪枝与 Java 模板
description: 回溯算法面试题总结，讲解回溯题型识别、组合模板、排列模板、子集模板、去重剪枝、复杂度分析和 LeetCode 高频题。
category: 计算机基础
tag:
  - 算法
head:
  - - meta
    - name: keywords
      content: 回溯算法,回溯模板,组合,排列,子集,N皇后,剪枝,Java回溯,LeetCode回溯,算法面试题
---

回溯题的特点很明显：题目让你找所有方案、所有路径、所有组合，或者在一堆选择里试探。它和 DFS 很像，区别在于回溯更强调“选择 -> 递归 -> 撤销选择”。

面试里写回溯，最重要的是先说清递归函数的含义。函数含义稳了，参数、结束条件和撤销选择就不容易乱。

## 面试考察重点

- 能写组合、排列、子集三类模板。
- 能解释 `path`、`startIndex`、`used` 的作用。
- 能根据题目判断是否需要去重。
- 能做简单剪枝，避免无效搜索。
- 能说清复杂度和结果规模有关。

## 回溯题怎么想？

回溯题可以先画成一棵“选择树”。树上的每一层代表一次选择，根节点代表还没选，叶子节点代表一个完整方案。

写代码前先回答 4 个问题：

1. 路径是什么？通常是已经选择的元素，代码里叫 `path`。
2. 选择列表是什么？当前还能选哪些元素。
3. 结束条件是什么？什么时候把 `path` 放进答案。
4. 是否需要剪枝？哪些选择一定不会得到合法答案。

回溯模板里的“撤销选择”不是形式主义。因为 `path` 是复用的，当前分支试完后必须还原现场，给下一个分支使用。

## 组合模板

组合不关心顺序，通常用 `startIndex` 控制下一层从哪里开始：

```java
List<List<Integer>> combine(int n, int k) {
    List<List<Integer>> ans = new ArrayList<>();
    backtrack(1, n, k, new ArrayList<>(), ans);
    return ans;
}

void backtrack(int start, int n, int k, List<Integer> path, List<List<Integer>> ans) {
    if (path.size() == k) {
        ans.add(new ArrayList<>(path));
        return;
    }
    for (int i = start; i <= n; i++) {
        path.add(i);
        backtrack(i + 1, n, k, path, ans);
        path.remove(path.size() - 1);
    }
}
```

组合问题不关心顺序，所以 `[1, 2]` 和 `[2, 1]` 是同一个答案。`start` 的作用就是保证后续只能选当前位置之后的数字，避免重复。

如果要从 `1..n` 里选 `k` 个数，还可以剪枝：

```java
for (int i = start; i <= n - (k - path.size()) + 1; i++) {
    // ...
}
```

含义是：如果从 `i` 开始，剩余数字数量已经不够凑满 `k` 个，就没必要继续枚举。

## 排列模板

排列关心顺序，通常用 `used` 标记元素是否已经被选过：

```java
List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> ans = new ArrayList<>();
    boolean[] used = new boolean[nums.length];
    backtrack(nums, used, new ArrayList<>(), ans);
    return ans;
}

void backtrack(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> ans) {
    if (path.size() == nums.length) {
        ans.add(new ArrayList<>(path));
        return;
    }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) {
            continue;
        }
        used[i] = true;
        path.add(nums[i]);
        backtrack(nums, used, path, ans);
        path.remove(path.size() - 1);
        used[i] = false;
    }
}
```

排列问题关心顺序，所以每一层都可以从所有数字里选，只是不能重复使用同一个数字。`used[i]` 表示 `nums[i]` 是否已经在当前路径里。

如果数组里有重复数字，排列去重要比组合更容易写错。通常先排序，然后在同一层跳过“前一个相同数字还没被使用”的情况：

```java
if (i > 0 && nums[i] == nums[i - 1] && !used[i - 1]) {
    continue;
}
```

这句的作用是固定重复数字在同一层的选择顺序，避免生成重复排列。

## 子集模板

子集问题通常每个节点都是一个答案：

```java
List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> ans = new ArrayList<>();
    backtrack(0, nums, new ArrayList<>(), ans);
    return ans;
}

void backtrack(int start, int[] nums, List<Integer> path, List<List<Integer>> ans) {
    ans.add(new ArrayList<>(path));
    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);
        backtrack(i + 1, nums, path, ans);
        path.remove(path.size() - 1);
    }
}
```

子集问题和组合问题很像，但它不是只在固定长度时收集答案，而是每到一个节点都收集一次。因为任何长度的路径都可以是一个子集。

如果题目要求去重，比如输入 `[1, 2, 2]`，仍然是先排序，再跳过同一层重复元素：

```java
if (i > start && nums[i] == nums[i - 1]) {
    continue;
}
```

## 去重怎么做？

如果输入有重复元素，通常先排序，再根据题型选择去重策略：

- 子集、组合这类按下标向后选择的题，跳过同一层重复元素，例如 `i > start && nums[i] == nums[i - 1]`。
- 全排列这类每层都可能从头扫描的题，通常还要结合 `used[]`，避免同一个位置被重复使用。
- 去重判断要区分“同一层重复选择”和“同一路径重复使用”。前者会产生重复答案，后者可能正是题目允许的选择。

## 过程示意和边界样例

以 `n = 3, k = 2` 的组合问题为例，选择树可以简化成下面这样：

| 第一层选择 | 第二层可选 | 产生结果           |
| ---------- | ---------- | ------------------ |
| 选 1       | 2、3       | `[1, 2]`、`[1, 3]` |
| 选 2       | 3          | `[2, 3]`           |
| 选 3       | 无         | 不足 2 个数，剪枝  |

回溯题建议检查这些边界：

| 输入         | 重点                    |
| ------------ | ----------------------- |
| 空数组       | 子集题通常要返回 `[[]]` |
| `k = 0`      | 组合题是否返回空组合    |
| 有重复元素   | 是否先排序并做同层去重  |
| 结果只有一个 | 是否正确拷贝 `path`     |

常见错误写法：

```java
ans.add(path); // 错：后续 path 会继续变化
```

应该写成：

```java
ans.add(new ArrayList<>(path));
```

回溯里的 `path` 是复用对象，不拷贝就会导致答案里的列表一起被后续递归修改。

## 易错点

- 加入答案时要拷贝 `path`，不能直接放引用。
- 组合用 `startIndex`，排列用 `used`，不要混着写。
- 去重通常要先排序。
- 剪枝条件必须不影响正确答案。
- 回溯复杂度经常和结果数量相同量级，不要随手写 `O(n)`。

## 推荐练习题

- [77. 组合](https://leetcode.cn/problems/combinations/)
- [78. 子集](https://leetcode.cn/problems/subsets/)
- [46. 全排列](https://leetcode.cn/problems/permutations/)
- [39. 组合总和](https://leetcode.cn/problems/combination-sum/)
- [51. N 皇后](https://leetcode.cn/problems/n-queens/)

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 几道常见的链表算法题.md -->

## [7] 几道常见的链表算法题

---
title: 几道常见的链表算法题
description: 精选链表高频题的思路与实现，覆盖两数相加、反转、环检测等场景，强调边界处理与复杂度分析。
category: 计算机基础
tag:
  - 算法
head:
  - - meta
    - name: keywords
      content: 链表算法,两数相加,反转链表,环检测,合并链表,复杂度分析
---

<!-- markdownlint-disable MD024 -->

## 1. 两数相加

### 题目描述

> Leetcode:给定两个非空链表来表示两个非负整数。位数按照逆序方式存储，它们的每个节点只存储单个数字。将两数相加返回一个新的链表。
>
> 你可以假设除了数字 0 之外，这两个数字都不会以零开头。

示例：

```plain
输入：(2 -> 4 -> 3) + (5 -> 6 -> 4)
输出：7 -> 0 -> 8
原因：342 + 465 = 807
```

### 问题分析

Leetcode 官方详细解答地址：

<https://leetcode-cn.com/problems/add-two-numbers/solution/>

> 要对头结点进行操作时，考虑创建哑节点 dummy，使用 dummy->next 表示真正的头节点。这样可以避免处理头节点为空的边界问题。

我们使用变量来跟踪进位，并从包含最低有效位的表头开始模拟逐位相加的过程。

![图1，对两数相加方法的可视化: 342 + 465 = 807， 每个结点都包含一个数字，并且数字按位逆序存储。](https://oss.javaguide.cn/github/javaguide/计算机基础/算法/34910956.jpg)

### Solution

**我们首先从最低有效位也就是列表 l1 和 l2 的表头开始相加。注意需要考虑到进位的情况！**

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
 //https://leetcode-cn.com/problems/add-two-numbers/description/
class Solution {
public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
    ListNode dummyHead = new ListNode(0);
    ListNode p = l1, q = l2, curr = dummyHead;
    //carry 表示进位数
    int carry = 0;
    while (p != null || q != null) {
        int x = (p != null) ? p.val : 0;
        int y = (q != null) ? q.val : 0;
        int sum = carry + x + y;
        //进位数
        carry = sum / 10;
        //新节点的数值为sum % 10
        curr.next = new ListNode(sum % 10);
        curr = curr.next;
        if (p != null) p = p.next;
        if (q != null) q = q.next;
    }
    if (carry > 0) {
        curr.next = new ListNode(carry);
    }
    return dummyHead.next;
}
}
```

## 2. 翻转链表

### 题目描述

> 剑指 offer:输入一个链表，反转链表后，输出链表的所有元素。

![翻转链表](https://oss.javaguide.cn/github/javaguide/计算机基础/算法/81431871.jpg)

### 问题分析

这道算法题，说直白点就是：如何让后一个节点指向前一个节点！在下面的代码中定义了一个 next 节点，该节点主要是保存要反转到头的那个节点，防止链表 “断裂”。

### Solution

```java
public class ListNode {
  int val;
  ListNode next = null;

  ListNode(int val) {
    this.val = val;
  }
}
```

```java
/**
 *
 * @author Snailclimb
 * @date 2018年9月19日
 * @Description: 反转单链表
 */
public class Solution {

  public ListNode ReverseList(ListNode head) {

    ListNode next = null;
    ListNode pre = null;

    while (head != null) {
      // 保存要反转到头的那个节点
      next = head.next;
      // 要反转的那个节点指向已经反转的上一个节点(备注:第一次反转的时候会指向null)
      head.next = pre;
      // 上一个已经反转到头部的节点
      pre = head;
      // 一直向链表尾走
      head = next;
    }
    return pre;
  }

}
```

测试方法：

```java
  public static void main(String[] args) {

    ListNode a = new ListNode(1);
    ListNode b = new ListNode(2);
    ListNode c = new ListNode(3);
    ListNode d = new ListNode(4);
    ListNode e = new ListNode(5);
    a.next = b;
    b.next = c;
    c.next = d;
    d.next = e;
    new Solution().ReverseList(a);
    while (e != null) {
      System.out.println(e.val);
      e = e.next;
    }
  }
```

输出：

```plain
5
4
3
2
1
```

## 3. 链表中倒数第 k 个节点

### 题目描述

> 剑指 offer: 输入一个链表，输出该链表中倒数第 k 个结点。

### 问题分析

> **链表中倒数第 k 个节点也就是正数第（L-K+1）个节点，知道了这一点，这一题基本就没问题！**

首先两个节点/指针，一个节点 node1 先开始跑，指针 node1 跑到 k-1 个节点后，另一个节点 node2 开始跑，当 node1 跑到最后时，node2 所指的节点就是倒数第 k 个节点也就是正数第（L-K+1）个节点。

### Solution

```java
/*
public class ListNode {
    int val;
    ListNode next = null;

    ListNode(int val) {
        this.val = val;
    }
}*/

// 时间复杂度O(n),一次遍历即可
// https://www.nowcoder.com/practice/529d3ae5a407492994ad2a246518148a?tpId=13&tqId=11167&tPage=1&rp=1&ru=/ta/coding-interviews&qru=/ta/coding-interviews/question-ranking
public class Solution {
  public ListNode FindKthToTail(ListNode head, int k) {
    // 如果链表为空或者k小于等于0
    if (head == null || k <= 0) {
      return null;
    }
    // 声明两个指向头结点的节点
    ListNode node1 = head, node2 = head;
    // 记录节点的个数
    int count = 0;
    // 记录k值，后面要使用
    int index = k;
    // p指针先跑，并且记录节点数，当node1节点跑了k-1个节点后，node2节点开始跑，
    // 当node1节点跑到最后时，node2节点所指的节点就是倒数第k个节点
    while (node1 != null) {
      node1 = node1.next;
      count++;
      if (k < 1) {
        node2 = node2.next;
      }
      k--;
    }
    // 如果节点个数小于所求的倒数第k个节点，则返回空
    if (count < index)
      return null;
    return node2;

  }
}
```

## 4. 删除链表的倒数第 N 个节点

> Leetcode:给定一个链表，删除链表的倒数第 n 个节点，并且返回链表的头结点。

**示例：**

```plain
给定一个链表: 1->2->3->4->5, 和 n = 2.

当删除了倒数第二个节点后，链表变为 1->2->3->5.

```

**说明：**

给定的 n 保证是有效的。

**进阶：**

你能尝试使用一趟扫描实现吗？

该题在 LeetCode 上有详细解答，具体可参考 LeetCode。

### 问题分析

我们注意到这个问题可以容易地简化成另一个问题：删除从列表开头数起的第（L - n + 1）个结点，其中 L 是列表的长度。只要我们找到列表的长度 L，这个问题就很容易解决。

![图 1. 删除列表中的第 L - n + 1 个元素](https://oss.javaguide.cn/github/javaguide/计算机基础/算法/94354387.jpg)

### Solution

**两次遍历法**

首先我们将添加一个 **哑结点** 作为辅助，该结点位于列表头部。哑结点用来简化某些极端情况，例如列表中只含有一个结点，或需要删除列表的头部。在第一次遍历中，我们找出列表的长度 L。然后设置一个指向哑结点的指针，并移动它遍历列表，直至它到达第（L - n）个结点那里。**我们把第（L - n）个结点的 next 指针重新链接至第（L - n + 2）个结点，完成这个算法。**

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
// https://leetcode-cn.com/problems/remove-nth-node-from-end-of-list/description/
public class Solution {
  public ListNode removeNthFromEnd(ListNode head, int n) {
    // 哑结点，哑结点用来简化某些极端情况，例如列表中只含有一个结点，或需要删除列表的头部
    ListNode dummy = new ListNode(0);
    // 哑结点指向头结点
    dummy.next = head;
    // 保存链表长度
    int length = 0;
    ListNode len = head;
    while (len != null) {
      length++;
      len = len.next;
    }
    length = length - n;
    ListNode target = dummy;
    // 找到 L-n 位置的节点
    while (length > 0) {
      target = target.next;
      length--;
    }
    // 把第 (L - n)个结点的 next 指针重新链接至第 (L - n + 2)个结点
    target.next = target.next.next;
    return dummy.next;
  }
}
```

**进阶——一次遍历法：**

> 链表中倒数第 N 个节点也就是正数第（L - n + 1）个节点。

其实这种方法就和我们上面第四题找“链表中倒数第 k 个节点”所用的思想是一样的。**基本思路就是：** 定义两个节点 node1、node2；node1 节点先跑，node1 节点跑到第 n+1 个节点的时候，node2 节点开始跑。当 node1 节点跑到最后一个节点时，node2 节点所在的位置就是第（L - n）个节点（L 代表总链表长度，也就是倒数第 n + 1 个节点）。

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
public class Solution {
  public ListNode removeNthFromEnd(ListNode head, int n) {

    ListNode dummy = new ListNode(0);
    dummy.next = head;
    // 声明两个指向头结点的节点
    ListNode node1 = dummy, node2 = dummy;

    // node1 节点先跑，node1节点 跑到第 n 个节点的时候,node2 节点开始跑
    // 当node1 节点跑到最后一个节点时，node2 节点所在的位置就是第 （L-n ） 个节点，也就是倒数第 n+1（L代表总链表长度）
    while (node1 != null) {
      node1 = node1.next;
      if (n < 1 && node1 != null) {
        node2 = node2.next;
      }
      n--;
    }

    node2.next = node2.next.next;

    return dummy.next;

  }
}
```

## 5. 合并两个排序的链表

### 题目描述

> 剑指 offer:输入两个单调递增的链表，输出两个链表合成后的链表，当然我们需要合成后的链表满足单调不减规则。

### 问题分析

我们可以这样分析：

1. 假设我们有两个链表 A，B；
2. A 的头节点 A1 的值与 B 的头结点 B1 的值比较，假设 A1 小，则 A1 为头节点；
3. A2 再和 B1 比较，假设 B1 小，则 A1 指向 B1；
4. A2 再和 B2 比较
5. 就这样循环往复就行了，应该还算好理解。

考虑通过递归的方式实现！

### Solution

**递归版本：**

```java
/*
public class ListNode {
    int val;
    ListNode next = null;

    ListNode(int val) {
        this.val = val;
    }
}*/
//https://www.nowcoder.com/practice/d8b6b4358f774294a89de2a6ac4d9337?tpId=13&tqId=11169&tPage=1&rp=1&ru=/ta/coding-interviews&qru=/ta/coding-interviews/question-ranking
public class Solution {
  public ListNode Merge(ListNode list1, ListNode list2) {
    if (list1 == null) {
      return list2;
    }
    if (list2 == null) {
      return list1;
    }
    if (list1.val <= list2.val) {
      list1.next = Merge(list1.next, list2);
      return list1;
    } else {
      list2.next = Merge(list1, list2.next);
      return list2;
    }
  }
}
```

## 面试复盘重点

链表题的代码通常不长，但指针更新顺序很容易写错。面试前至少要掌握 4 个模板：虚拟头节点、反转链表、快慢指针、合并链表。

| 模板       | 适用题型                           | 关键点                           |
| ---------- | ---------------------------------- | -------------------------------- |
| 虚拟头节点 | 删除节点、合并链表、头节点可能变化 | 返回 `dummy.next`                |
| 反转链表   | 整体反转、区间反转、K 个一组反转   | 保存 `next`，再改 `cur.next`     |
| 快慢指针   | 环检测、倒数第 K 个、中点          | 先判断 `fast` 和 `fast.next`     |
| 合并链表   | 两个有序链表、K 个有序链表         | 递归或迭代，注意尾部接上剩余链表 |

反转链表的迭代模板建议背熟：

```java
ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode cur = head;
    while (cur != null) {
        ListNode next = cur.next;
        cur.next = prev;
        prev = cur;
        cur = next;
    }
    return prev;
}
```

## 过程示意和边界样例

反转链表时，核心是先保存 `next`，再修改 `cur.next`。可以按下面的指针变化来记：

```text
初始：prev = null, cur = head

每一轮：
next = cur.next
cur.next = prev
prev = cur
cur = next

结束：cur == null，prev 指向新头节点
```

删除节点、合并链表这类题，优先考虑虚拟头节点：

```java
ListNode dummy = new ListNode(0);
dummy.next = head;
// 中间统一操作 dummy 后面的链表
return dummy.next;
```

几个易错点：

- 删除倒数第 N 个节点时，虚拟头节点能统一处理删除头节点的情况。
- 区间反转要先保存区间前一个节点和区间后一个节点。
- 判断链表有环时，循环条件是 `fast != null && fast.next != null`。
- 递归合并链表代码短，但链表很长时可能有递归栈风险。
- 空链表、单节点链表、删除头节点、删除尾节点都要单独过一遍。

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 几道常见的字符串算法题.md -->

## [8] 几道常见的字符串算法题

---
title: 几道常见的字符串算法题
description: 总结字符串高频算法与题型，重点讲解 KMP/BM 原理、滑动窗口等技巧，帮助读者理解高效匹配与实现。
category: 计算机基础
tag:
  - 算法
head:
  - - meta
    - name: keywords
      content: 字符串算法,KMP,BM,滑动窗口,子串,匹配,复杂度
---

> 作者：wwwxmu
>
> 原文地址：<https://www.weiweiblog.cn/13string/>

## 1. KMP 算法

谈到字符串问题，不得不提的就是 KMP 算法，它是用来解决字符串查找的问题，可以在一个字符串（S）中查找一个子串（W）出现的位置。KMP 算法把字符匹配的时间复杂度缩小到 O(m+n)，而空间复杂度也只有 O(m)。因为 “暴力搜索” 的方法会反复回溯主串，导致效率低下，而 KMP 算法可以利用已经部分匹配这个有效信息，保持主串上的指针不回溯，通过修改子串的指针，让模式串尽量地移动到有效的位置。

具体算法细节请参考：

- [从头到尾彻底理解 KMP:](https://blog.csdn.net/v_july_v/article/details/7041827)
- [如何更好的理解和掌握 KMP 算法?](https://www.zhihu.com/question/21923021)
- [KMP 算法详细解析](https://blog.sengxian.com/算法/kmp)
- [图解 KMP 算法](http://blog.jobbole.com/76611/)
- [汪都能听懂的 KMP 字符串匹配算法【双语字幕】](https://www.bilibili.com/video/av3246487/?from=search&seid=17173603269940723925)
- [KMP 字符串匹配算法 1](https://www.bilibili.com/video/av11866460?from=search&seid=12730654434238709250)

**除此之外，再来了解一下 BM 算法！**

> BM 算法也是一种精确字符串匹配算法，它采用从右向左比较的方法，同时应用到了两种启发式规则，即坏字符规则和好后缀规则，来决定向右跳跃的距离。基本思路就是从右往左进行字符匹配，遇到不匹配的字符后从坏字符表和好后缀表找一个最大的右移值，将模式串右移继续匹配。
> 《字符串匹配的 KMP 算法》：<http://www.ruanyifeng.com/blog/2013/05/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm.html>

## 2. 替换空格

> 剑指 offer：请实现一个函数，将一个字符串中的每个空格替换成 "%20"。例如，当字符串为 We Are Happy.则经过替换之后的字符串为 We%20Are%20Happy。

这里我提供了两种方法：① 常规方法；② 利用 API 解决。

```java
//https://www.weiweiblog.cn/replacespace/
public class Solution {

  /**
   * 第一种方法：常规方法。利用String.charAt(i)以及String.valueOf(char).equals(" "
   * )遍历字符串并判断元素是否为空格。是则替换为"%20",否则不替换
   */
  public static String replaceSpace(StringBuffer str) {

    int length = str.length();
    // System.out.println("length=" + length);
    StringBuffer result = new StringBuffer();
    for (int i = 0; i < length; i++) {
      char b = str.charAt(i);
      if (String.valueOf(b).equals(" ")) {
        result.append("%20");
      } else {
        result.append(b);
      }
    }
    return result.toString();

  }

  /**
   * 第二种方法：利用API替换掉所用空格，一行代码解决问题
   */
  public static String replaceSpace2(StringBuffer str) {

    return str.toString().replace(" ", "%20");
  }
}

```

对于替换固定字符（比如空格）的情况，第二种方法其实可以使用 `replace` 方法替换，性能更好！

```java
str.toString().replace(" ","%20");
```

## 3. 最长公共前缀

> Leetcode: 编写一个函数来查找字符串数组中的最长公共前缀。如果不存在公共前缀，返回空字符串 ""。

示例 1：

```plain
输入: ["flower","flow","flight"]
输出: "fl"
```

示例 2：

```plain
输入: ["dog","racecar","car"]
输出: ""
解释: 输入不存在公共前缀。
```

思路很简单！先利用 `Arrays.sort(strs)` 为数组排序，再将数组第一个元素和最后一个元素的字符从前往后对比即可！

```java
public class Main {
 public static String replaceSpace(String[] strs) {

  // 如果检查值不合法及就返回空串
  if (!checkStrs(strs)) {
   return "";
  }
  // 数组长度
  int len = strs.length;
  // 用于保存结果
  StringBuilder res = new StringBuilder();
  // 给字符串数组的元素按照升序排序(包含数字的话，数字会排在前面)
  Arrays.sort(strs);
  int m = strs[0].length();
  int n = strs[len - 1].length();
  int num = Math.min(m, n);
  for (int i = 0; i < num; i++) {
   if (strs[0].charAt(i) == strs[len - 1].charAt(i)) {
    res.append(strs[0].charAt(i));
   } else
    break;

  }
  return res.toString();

 }

 private static boolean checkStrs(String[] strs) {
  boolean flag = false;
  if (strs != null) {
   // 遍历strs检查元素值
   for (int i = 0; i < strs.length; i++) {
    if (strs[i] != null && strs[i].length() != 0) {
     flag = true;
    } else {
     flag = false;
     break;
    }
   }
  }
  return flag;
 }

 // 测试
 public static void main(String[] args) {
  String[] strs = { "customer", "car", "cat" };
  // String[] strs = { "customer", "car", null };//空串
  // String[] strs = {};//空串
  // String[] strs = null;//空串
  System.out.println(Main.replaceSpace(strs));// c
 }
}

```

## 4. 回文串

### 4.1. 最长回文串

> LeetCode: 给定一个包含大写字母和小写字母的字符串，找到通过这些字母构造成的最长的回文串。在构造过程中，请注意区分大小写。比如 `"Aa"` 不能当做一个回文字符串。注意：假设字符串的长度不会超过 1010。
>
> 回文串：“回文串” 是一个正读和反读都一样的字符串，比如 "level" 或者 "noon" 等等就是回文串。——百度百科 地址：<https://baike.baidu.com/item/%E5%9B%9E%E6%96%87%E4%B8%B2/1274921?fr=aladdin>

示例 1：

```plain
输入:
"abccccdd"

输出:
7

解释:
我们可以构造的最长的回文串是"dccaccd", 它的长度是 7。
```

我们上面已经知道了什么是回文串？现在我们考虑一下可以构成回文串的两种情况：

- 字符出现次数为双数的组合
- **字符出现次数为偶数的组合+单个字符中出现次数最多且为奇数次的字符**（参见 **[issue665](https://github.com/Snailclimb/JavaGuide/issues/665)**）

统计字符出现的次数即可，双数才能构成回文。因为允许中间一个数单独出现，比如 "abcba"，所以如果最后有字母落单，总长度可以加 1。首先将字符串转变为字符数组。然后遍历该数组，判断对应字符是否在 hashset 中，如果不在就加进去，如果在就让 count++，然后移除该字符！这样就能找到出现次数为双数的字符个数。

```java
//https://leetcode-cn.com/problems/longest-palindrome/description/
class Solution {
  public  int longestPalindrome(String s) {
    if (s.length() == 0)
      return 0;
    // 用于存放字符
    HashSet<Character> hashset = new HashSet<Character>();
    char[] chars = s.toCharArray();
    int count = 0;
    for (int i = 0; i < chars.length; i++) {
      if (!hashset.contains(chars[i])) {// 如果hashset没有该字符就保存进去
        hashset.add(chars[i]);
      } else {// 如果有,就让count++（说明找到了一个成对的字符），然后把该字符移除
        hashset.remove(chars[i]);
        count++;
      }
    }
    return hashset.isEmpty() ? count * 2 : count * 2 + 1;
  }
}
```

### 4.2. 验证回文串

> LeetCode: 给定一个字符串，验证它是否是回文串，只考虑字母和数字字符，可以忽略字母的大小写。说明：本题中，我们将空字符串定义为有效的回文串。

示例 1：

```plain
输入: "A man, a plan, a canal: Panama"
输出: true
```

示例 2：

```plain
输入: "race a car"
输出: false
```

```java
//https://leetcode-cn.com/problems/valid-palindrome/description/
class Solution {
  public  boolean isPalindrome(String s) {
    if (s.length() == 0)
      return true;
    int l = 0, r = s.length() - 1;
    while (l < r) {
      // 从头和尾开始向中间遍历
      if (!Character.isLetterOrDigit(s.charAt(l))) {// 字符不是字母和数字的情况
        l++;
      } else if (!Character.isLetterOrDigit(s.charAt(r))) {// 字符不是字母和数字的情况
        r--;
      } else {
        // 判断二者是否相等
        if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r)))
          return false;
        l++;
        r--;
      }
    }
    return true;
  }
}
```

### 4.3. 最长回文子串

> LeetCode: 最长回文子串 给定一个字符串 s，找到 s 中最长的回文子串。你可以假设 s 的最大长度为 1000。

示例 1：

```plain
输入: "babad"
输出: "bab"
注意: "aba"也是一个有效答案。
```

示例 2：

```plain
输入: "cbbd"
输出: "bb"
```

以某个元素为中心，分别计算偶数长度的回文最大长度和奇数长度的回文最大长度。

```java
//https://leetcode-cn.com/problems/longest-palindromic-substring/description/
class Solution {
  private int index, len;

  public String longestPalindrome(String s) {
    if (s.length() < 2)
      return s;
    for (int i = 0; i < s.length() - 1; i++) {
      PalindromeHelper(s, i, i);
      PalindromeHelper(s, i, i + 1);
    }
    return s.substring(index, index + len);
  }

  public void PalindromeHelper(String s, int l, int r) {
    while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
      l--;
      r++;
    }
    if (len < r - l - 1) {
      index = l + 1;
      len = r - l - 1;
    }
  }
}
```

### 4.4. 最长回文子序列

> LeetCode: 最长回文子序列
> 给定一个字符串 s，找到其中最长的回文子序列。可以假设 s 的最大长度为 1000。
> **最长回文子序列和上一题最长回文子串的区别是，子串是字符串中连续的一个序列，而子序列是字符串中保持相对位置的字符序列，例如，"bbbb" 可以是字符串 "bbbab" 的子序列但不是子串。**

给定一个字符串 s，找到其中最长的回文子序列。可以假设 s 的最大长度为 1000。

示例 1：

```plain
输入:
"bbbab"
输出:
4
```

一个可能的最长回文子序列为 "bbbb"。

示例 2：

```plain
输入:
"cbbd"
输出:
2
```

一个可能的最长回文子序列为 "bb"。

**动态规划：** `dp[i][j] = dp[i+1][j-1] + 2 if s.charAt(i) == s.charAt(j) otherwise, dp[i][j] = Math.max(dp[i+1][j], dp[i][j-1])`

```java
class Solution {
    public int longestPalindromeSubseq(String s) {
        int len = s.length();
        int [][] dp = new int[len][len];
        for(int i = len - 1; i>=0; i--){
            dp[i][i] = 1;
            for(int j = i+1; j < len; j++){
                if(s.charAt(i) == s.charAt(j))
                    dp[i][j] = dp[i+1][j-1] + 2;
                else
                    dp[i][j] = Math.max(dp[i+1][j], dp[i][j-1]);
            }
        }
        return dp[0][len-1];
    }
}
```

## 5. 括号匹配深度

> 爱奇艺 2018 秋招 Java：
> 一个合法的括号匹配序列有以下定义：
>
> 1. 空串 "" 是一个合法的括号匹配序列
> 2. 如果 "X" 和 "Y" 都是合法的括号匹配序列，"XY" 也是一个合法的括号匹配序列
> 3. 如果 "X" 是一个合法的括号匹配序列，那么 "(X)" 也是一个合法的括号匹配序列
> 4. 每个合法的括号序列都可以由以上规则生成。
>
> 例如：""，"()"，"()()"，"((()))" 都是合法的括号序列。
> 对于一个合法的括号序列我们又有以下定义它的深度：
>
> 1. 空串 "" 的深度是 0
> 2. 如果字符串 "X" 的深度是 x，字符串 "Y" 的深度是 y，那么字符串 "XY" 的深度为 max(x, y)
> 3. 如果 "X" 的深度是 x，那么字符串 "(X)" 的深度是 x+1
>
> 例如："()()()" 的深度是 1，"((()))" 的深度是 3。牛牛现在给你一个合法的括号序列，需要你计算出其深度。

```plain
输入描述:
输入包括一个合法的括号序列s,s长度length(2 ≤ length ≤ 50),序列中只包含'('和')'。

输出描述:
输出一个正整数,即这个序列的深度。
```

示例：

```plain
输入:
(())
输出:
2
```

代码如下：

```java
import java.util.Scanner;

/**
 * https://www.nowcoder.com/test/8246651/summary
 *
 * @author Snailclimb
 * @date 2018年9月6日
 * @Description: 求给定合法括号序列的深度
 */
public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    String s = sc.nextLine();
    int cnt = 0, max = 0, i;
    for (i = 0; i < s.length(); ++i) {
      if (s.charAt(i) == '(')
        cnt++;
      else
        cnt--;
      max = Math.max(max, cnt);
    }
    sc.close();
    System.out.println(max);
  }
}

```

## 6. 把字符串转换成整数

> 剑指 offer: 将一个字符串转换成一个整数（实现 `Integer.valueOf(string)` 的功能，但是 string 不符合数字要求时返回 0），要求不能使用字符串转换整数的库函数。数值为 0 或者字符串不是一个合法的数值则返回 0。

```java
//https://www.weiweiblog.cn/strtoint/
public class Main {

  public static int StrToInt(String str) {
    if (str.length() == 0)
      return 0;
    char[] chars = str.toCharArray();
    // 判断是否存在符号位
    int flag = 0;
    if (chars[0] == '+')
      flag = 1;
    else if (chars[0] == '-')
      flag = 2;
    int start = flag > 0 ? 1 : 0;
    int res = 0;// 保存结果
    for (int i = start; i < chars.length; i++) {
      if (Character.isDigit(chars[i])) {// 调用Character.isDigit(char)方法判断是否是数字，是返回True，否则False
        int temp = chars[i] - '0';
        res = res * 10 + temp;
      } else {
        return 0;
      }
    }
   return flag != 2 ? res : -res;

  }

  public static void main(String[] args) {
    String s = "-12312312";
    System.out.println("使用库函数转换：" + Integer.valueOf(s));
    int res = Main.StrToInt(s);
    System.out.println("使用自己写的方法转换：" + res);

  }

}

```

## 面试复盘重点

字符串题看起来杂，实际常见模板并不多：哈希计数、双指针、滑动窗口、KMP、回文、栈模拟。

| 题型       | 常用方法             | 代表题                           |
| ---------- | -------------------- | -------------------------------- |
| 字符计数   | 数组或哈希表         | 有效的字母异位词、字母异位词分组 |
| 子串问题   | 滑动窗口             | 最长无重复子串、最小覆盖子串     |
| 回文问题   | 双指针、中心扩展、DP | 验证回文串、最长回文子串         |
| 字符串匹配 | KMP、哈希            | 实现 `strStr()`                  |
| 括号和编码 | 栈                   | 有效的括号、字符串解码           |
| 数字转换   | 模拟                 | 字符串转换整数                   |

处理字符串题时可以先问 3 个问题：

1. 题目关心的是子串还是子序列？子串连续，子序列不要求连续。
2. 字符集范围有多大？只有小写字母时，数组计数比哈希表更直接。
3. 是否需要处理溢出、空串、空格、符号位这类边界？

几个易错点：

- Java 中 `String` 不可变，频繁拼接建议使用 `StringBuilder`。
- `char` 处理 Unicode 字符时可能不够，普通算法题多数只考 ASCII 或小写字母。
- 回文子串和回文子序列不是一类题，前者常用中心扩展，后者常用 DP。
- KMP 面试中通常不要求从零推导 `next` 数组的手工计算过程，但要理解它的作用是跳过已匹配前缀，避免重复匹配。

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 剑指offer部分编程题.md -->

## [9] 剑指offer部分编程题

---
title: 剑指offer部分编程题
description: 选编《剑指 Offer》常见编程题，给出递归与迭代等多种思路与示例，实现对高频题型的高效复盘。
category: 计算机基础
tag:
  - 算法
head:
  - - meta
    - name: keywords
      content: 剑指Offer,斐波那契,递归,迭代,链表,数组,面试题
---

# 剑指 Offer 部分编程题

## 斐波那契数列

**题目描述：**

大家都知道斐波那契数列，现在要求输入一个整数 n，请你输出斐波那契数列的第 n 项。n<=39

**问题分析：**

可以肯定的是这一题通过递归的方式是肯定能做出来，但是这样会有一个很大的问题，那就是递归大量的重复计算会导致内存溢出。另外可以使用迭代法，用 fn1 和 fn2 保存计算过程中的结果，并复用起来。下面我会把两个方法示例代码都给出来并给出两个方法的运行时间对比。

**示例代码：**

采用迭代法：

```java
int Fibonacci(int number) {
    if (number <= 0) {
        return 0;
    }
    if (number == 1 || number == 2) {
        return 1;
    }
    int first = 1, second = 1, third = 0;
    for (int i = 3; i <= number; i++) {
        third = first + second;
        first = second;
        second = third;
    }
    return third;
}
```

采用递归：

```java
public int Fibonacci(int n) {
    if (n <= 0) {
        return 0;
    }
    if (n == 1||n==2) {
        return 1;
    }

    return Fibonacci(n - 2) + Fibonacci(n - 1);
}
```

## 跳台阶问题

**题目描述：**

一只青蛙一次可以跳上 1 级台阶，也可以跳上 2 级。求该青蛙跳上一个 n 级的台阶总共有多少种跳法。

**问题分析：**

正常分析法：

> a.如果两种跳法，1 阶或者 2 阶，那么假定第一次跳的是一阶，那么剩下的是 n-1 个台阶，跳法是 f（n-1）;
> b.假定第一次跳的是 2 阶，那么剩下的是 n-2 个台阶，跳法是 f（n-2）
> c.由 a，b 假设可以得出总跳法为: f(n) = f（n-1） + f（n-2）
> d.然后通过实际的情况可以得出：只有一阶的时候 f(1) = 1 ,只有两阶的时候可以有 f(2) = 2

找规律分析法：

> f(1) = 1, f(2) = 2, f(3) = 3, f(4) = 5，可以总结出 f(n) = f（n-1） + f（n-2） 的规律。但是为什么会出现这样的规律呢？假设现在 6 个台阶，我们可以从第 5 跳一步到 6，这样的话有多少种方案跳到 5 就有多少种方案跳到 6，另外我们也可以从 4 跳两步跳到 6，跳到 4 有多少种方案的话，就有多少种方案跳到 6，其他的不能从 3 跳到 6 什么的啦，所以最后就是 f(6) = f(5) + f(4)；这样子也很好理解变态跳台阶的问题了。

**所以这道题其实就是斐波那契数列的问题。**

代码只需要在上一题的代码稍做修改即可。和上一题唯一不同的就是这一题的初始元素变为 1 2 3 5 8……而上一题为 1 1 2 3 5 ……。另外这一题也可以用递归做，但是递归效率太低，所以我这里只给出了迭代方式的代码。

**示例代码：**

```java
int jumpFloor(int number) {
    if (number <= 0) {
        return 0;
    }
    if (number == 1) {
        return 1;
    }
    if (number == 2) {
        return 2;
    }
    int first = 1, second = 2, third = 0;
    for (int i = 3; i <= number; i++) {
        third = first + second;
        first = second;
        second = third;
    }
    return third;
}
```

## 变态跳台阶问题

**题目描述：**

一只青蛙一次可以跳上 1 级台阶，也可以跳上 2 级……它也可以跳上 n 级。求该青蛙跳上一个 n 级的台阶总共有多少种跳法。

**问题分析：**

假设 n>=2，第一步有 n 种跳法：跳 1 级、跳 2 级、到跳 n 级
跳 1 级，剩下 n-1 级，则剩下跳法是 f（n-1）
跳 2 级，剩下 n-2 级，则剩下跳法是 f（n-2）
……
跳 n-1 级，剩下 1 级，则剩下跳法是 f(1)
跳 n 级，剩下 0 级，则剩下跳法是 f(0)
所以在 n>=2 的情况下：
f(n)=f（n-1）+f（n-2）+...+f(1)
因为 f（n-1）=f（n-2）+f（n-3）+...+f(1)
所以 f(n)=2\*f（n-1） 又 f(1)=1,所以可得**f(n)=2^（number-1）**

**示例代码：**

```java
int JumpFloorII(int number) {
    return 1 << --number;//2^(number-1)用位移操作进行，更快
}
```

**补充：**

Java 中有三种移位运算符：

1. "<<": **左移运算符**，等同于乘 2 的 n 次方
2. ">>": **右移运算符**，等同于除 2 的 n 次方
3. ">>>": **无符号右移运算符**，不管移动前最高位是 0 还是 1，右移后左侧产生的空位部分都以 0 来填充。与 >> 类似。

```java
int a = 16;
int b = a << 2;//左移2，等同于16 * 2的2次方，也就是16 * 4
int c = a >> 2;//右移2，等同于16 / 2的2次方，也就是16 / 4
```

## 二维数组查找

**题目描述：**

在一个二维数组中，每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。请完成一个函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。

**问题解析：**

这一道题还是比较简单的，我们需要考虑的是如何做，效率最快。这里有一种很好理解的思路：

> 矩阵是有序的，从左下角来看，向上数字递减，向右数字递增，
> 因此从左下角开始查找，当要查找数字比左下角数字大时。右移
> 要查找数字比左下角数字小时，上移。这样找的速度最快。

**示例代码：**

```java
public boolean Find(int target, int [][] array) {
    //基本思路从左下角开始找，这样速度最快
    int row = array.length-1;//行
    int column = 0;//列
    //当行数大于0，当前列数小于总列数时循环条件成立
    while((row >= 0)&& (column< array[0].length)){
        if(array[row][column] > target){
            row--;
        }else if(array[row][column] < target){
            column++;
        }else{
            return true;
        }
    }
    return false;
}
```

## 替换空格

**题目描述：**

请实现一个函数，将一个字符串中的空格替换成"%20"。例如，当字符串为 We Are Happy.则经过替换之后的字符串为 We%20Are%20Happy。

**问题分析：**

这道题不难，我们可以通过循环判断字符串的字符是否为空格，是的话就利用 append() 方法添加追加"%20"，否则还是追加原字符。

也可以直接使用 `String.replace()` 替换字面空格，一行代码就可以解决。

**示例代码：**

常规做法：

```java
public String replaceSpace(StringBuffer str) {
    StringBuffer out = new StringBuffer();
    for (int i = 0; i < str.toString().length(); i++) {
        char b = str.charAt(i);
        if(String.valueOf(b).equals(" ")){
            out.append("%20");
        }else{
            out.append(b);
        }
    }
    return out.toString();
}
```

一行代码解决：

```java
public String replaceSpace(StringBuffer str) {
    return str.toString().replace(" ", "%20");
}
```

## 数值的整数次方

**题目描述：**

给定一个 double 类型的浮点数 base 和 int 类型的整数 exponent，求 base 的 exponent 次方。

**问题解析：**

这道题可以使用**快速幂**。需要重点处理两个边界：底数为 0 且指数为负数时不能求倒数；`Integer.MIN_VALUE` 直接取负会溢出，因此要先把指数转换为 `long`。

对于“是否为精确的 0”这个业务条件，可以直接使用 `base == 0.0` 判断。使用 epsilon 比较会把很小但非零的底数误判为 0。

快速幂每轮把指数减半：指数当前位为 1 时，把当前底数乘入结果；随后将底数平方、指数右移一位。时间复杂度为 O(logn)。

**时间复杂度**：O(logn)

**示例代码：**

```java
public class Solution {
    public double Power(double base, int exponent) {
        if (base == 0.0 && exponent < 0) {
            throw new ArithmeticException("zero cannot be raised to a negative exponent");
        }

        long exp = exponent;
        if (exp < 0) {
            base = 1.0 / base;
            exp = -exp;
        }

        double result = 1.0;
        while (exp > 0) {
            if ((exp & 1L) != 0) {
                result *= base;
            }
            base *= base;
            exp >>= 1;
        }
        return result;
    }
}
```

当然这一题也可以采用笨方法：累乘。不过这种方法的时间复杂度为 O(n)，这样没有前一种方法效率高。

```java
// 使用累乘
public double powerAnother(double base, int exponent) {
    if (base == 0.0 && exponent < 0) {
        throw new ArithmeticException("zero cannot be raised to a negative exponent");
    }
    long exp = exponent;
    if (exp < 0) {
        exp = -exp;
    }
    double result = 1.0;
    for (long i = 0; i < exp; i++) {
        result *= base;
    }
    if (exponent >= 0) {
        return result;
    }
    return 1.0 / result;
}
```

## 调整数组顺序使奇数位于偶数前面

**题目描述：**

输入一个整数数组，实现一个函数来调整该数组中数字的顺序，使得所有的奇数位于数组的前半部分，所有的偶数位于位于数组的后半部分，并保证奇数和奇数，偶数和偶数之间的相对位置不变。

**问题解析：**

这道题有挺多种解法的，给大家介绍一种我觉得挺好理解的方法：
我们首先统计奇数的个数假设为 n，然后新建一个等长数组，然后通过循环判断原数组中的元素为偶数还是奇数。如果是则从数组下标 0 的元素开始，把该奇数添加到新数组；如果是偶数则从数组下标为 n 的元素开始把该偶数添加到新数组中。

**示例代码：**

时间复杂度为 O(n)，空间复杂度为 O(n) 的算法

```java
public class Solution {
    public void reOrderArray(int [] array) {
        //如果数组长度等于0或者等于1，什么都不做直接返回
        if(array.length==0||array.length==1)
            return;
        //oddCount：保存奇数个数
        //oddBegin：奇数从数组头部开始添加
        int oddCount=0,oddBegin=0;
        //新建一个数组
        int[] newArray=new int[array.length];
        //计算出（数组中的奇数个数）开始添加元素
        for(int i=0;i<array.length;i++){
            if((array[i]&1)==1) oddCount++;
        }
        for(int i=0;i<array.length;i++){
            //如果数为基数新数组从头开始添加元素
            //如果为偶数就从oddCount（数组中的奇数个数）开始添加元素
            if((array[i]&1)==1)
                newArray[oddBegin++]=array[i];
            else newArray[oddCount++]=array[i];
        }
        for(int i=0;i<array.length;i++){
            array[i]=newArray[i];
        }
    }
}
```

## 链表中倒数第 k 个节点

**题目描述：**

输入一个链表，输出该链表中倒数第 k 个结点

**问题分析：**

**一句话概括：**
两个指针一个指针 p1 先开始跑，指针 p1 跑到 k-1 个节点后，另一个节点 p2 开始跑，当 p1 跑到最后时，p2 所指的指针就是倒数第 k 个节点。

**思想的简单理解：**
前提假设：链表的结点个数（长度）为 n。
规律一：要找到倒数第 k 个结点，需要向前走多少步呢？比如倒数第一个结点，需要走 n 步，那倒数第二个结点呢？很明显是向前走了 n-1 步，所以可以找到规律是找到倒数第 k 个结点，需要向前走 n-k+1 步。

**算法开始：**

1. 设两个都指向 head 的指针 p1 和 p2，当 p1 走了 k-1 步的时候，停下来。p2 之前一直不动。
2. p1 的下一步是走第 k 步，这个时候，p2 开始一起动了。至于为什么 p2 这个时候动呢？看下面的分析。
3. 当 p1 走到链表的尾部时，即 p1 走了 n 步。由于我们知道 p2 是在 p1 走了 k-1 步才开始动的，也就是说 p1 和 p2 永远差 k-1 步。所以当 p1 走了 n 步时，p2 走的应该是在 n-（k-1）步。即 p2 走了 n-k+1 步，此时巧妙的是 p2 正好指向的是规律一的倒数第 k 个结点处。
   这样是不是很好理解了呢？

**考察内容：**

链表 + 代码的鲁棒性

**示例代码：**

```java
/*
//链表类
public class ListNode {
    int val;
    ListNode next = null;

    ListNode(int val) {
        this.val = val;
    }
}*/

//时间复杂度O(n),一次遍历即可
public class Solution {
    public ListNode FindKthToTail(ListNode head,int k) {
        ListNode pre=null,p=null;
        //两个指针都指向头结点
        p=head;
        pre=head;
        //记录k值
        int a=k;
        //记录节点的个数
        int count=0;
        //p指针先跑，并且记录节点数，当p指针跑了k-1个节点后，pre指针开始跑，
        //当p指针跑到最后时，pre所指指针就是倒数第k个节点
        while(p!=null){
            p=p.next;
            count++;
            if(k<1){
                pre=pre.next;
            }
            k--;
        }
        //如果节点个数小于所求的倒数第k个节点，则返回空
        if(count<a) return null;
        return pre;

    }
}
```

## 反转链表

**题目描述：**

输入一个链表，反转链表后，输出链表的所有元素。

**问题分析：**

链表的很常规的一道题，这一道题思路不算难，但自己实现起来真的可能会感觉无从下手，我是参考了别人的代码。
思路就是我们根据链表的特点，前一个节点指向下一个节点的特点，把后面的节点移到前面来。
就比如下图：我们把 1 节点和 2 节点互换位置，然后再将 3 节点指向 2 节点，4 节点指向 3 节点，这样以来下面的链表就被反转了。

![反转链表时交换相邻节点指向的过程](https://oss.javaguide.cn/p3-juejin/844773c7300e4373922bb1a6ae2a55a3~tplv-k3u1fbpfcp-zoom-1.png)

**考察内容：**

链表 + 代码的鲁棒性

**示例代码：**

```java
/*
public class ListNode {
    int val;
    ListNode next = null;

    ListNode(int val) {
        this.val = val;
    }
}*/
public class Solution {
    public ListNode ReverseList(ListNode head) {
       ListNode next = null;
       ListNode pre = null;
        while (head != null) {
              //保存要反转到头来的那个节点
               next = head.next;
               //要反转的那个节点指向已经反转的上一个节点
               head.next = pre;
               //上一个已经反转到头部的节点
               pre = head;
               //一直向链表尾走
               head = next;
        }
        return pre;
    }
}
```

## 合并两个排序的链表

**题目描述：**

输入两个单调递增的链表，输出两个链表合成后的链表，当然我们需要合成后的链表满足单调不减规则。

**问题分析：**

我们可以这样分析：

1. 假设我们有两个链表 A，B；
2. A 的头节点 A1 的值与 B 的头结点 B1 的值比较，假设 A1 小，则 A1 为头节点；
3. A2 再和 B1 比较，假设 B1 小，则 A1 指向 B1；
4. A2 再和 B2 比较……
   就这样循环往复就行了，应该还算好理解。

**考察内容：**

链表 + 代码的鲁棒性

**示例代码：**

非递归版本：

```java
/*
public class ListNode {
    int val;
    ListNode next = null;

    ListNode(int val) {
        this.val = val;
    }
}*/
public class Solution {
    public ListNode Merge(ListNode list1,ListNode list2) {
       //list1为空，直接返回list2
       if(list1 == null){
            return list2;
        }
        //list2为空，直接返回list1
        if(list2 == null){
            return list1;
        }
        ListNode mergeHead = null;
        ListNode current = null;
        //当list1和list2不为空时
        while(list1!=null && list2!=null){
            //取较小值作头结点
            if(list1.val <= list2.val){
                if(mergeHead == null){
                   mergeHead = current = list1;
                }else{
                   current.next = list1;
                    //current节点保存list1节点的值因为下一次还要用
                   current = list1;
                }
                //list1指向下一个节点
                list1 = list1.next;
            }else{
                if(mergeHead == null){
                   mergeHead = current = list2;
                }else{
                   current.next = list2;
                     //current节点保存list2节点的值因为下一次还要用
                   current = list2;
                }
                //list2指向下一个节点
                list2 = list2.next;
            }
        }
        if(list1 == null){
            current.next = list2;
        }else{
            current.next = list1;
        }
        return mergeHead;
    }
}
```

递归版本：

```java
public ListNode Merge(ListNode list1,ListNode list2) {
    if(list1 == null){
        return list2;
    }
    if(list2 == null){
        return list1;
    }
    if(list1.val <= list2.val){
        list1.next = Merge(list1.next, list2);
        return list1;
    }else{
        list2.next = Merge(list1, list2.next);
        return list2;
    }
}
```

## 用两个栈实现队列

**题目描述：**

用两个栈来实现一个队列，完成队列的 Push 和 Pop 操作。队列中的元素为 int 类型。

**问题分析：**

先来回顾一下栈和队列的基本特点：
**栈：** 后进先出（LIFO）
**队列：** 先进先出
很明显我们需要根据 JDK 给我们提供的栈的一些基本方法来实现。先来看一下 Stack 类的一些基本方法：

![Stack类的一些常见方法](https://oss.javaguide.cn/github/javaguide/计算机基础/算法/5985000.jpg)

既然题目给了我们两个栈，我们可以这样考虑当 push 的时候将元素 push 进 stack1，pop 的时候我们先把 stack1 的元素 pop 到 stack2，然后再对 stack2 执行 pop 操作，这样就可以保证是先进先出的。（负 [pop] 负 [pop] 得正 [先进先出]）

**考察内容：**

队列 + 栈

**示例代码：**

```java
//左程云的《程序员代码面试指南》的答案
import java.util.Stack;

public class Solution {
    Stack<Integer> stack1 = new Stack<Integer>();
    Stack<Integer> stack2 = new Stack<Integer>();

    //当执行push操作时，将元素添加到stack1
    public void push(int node) {
        stack1.push(node);
    }

    public int pop() {
        //如果两个队列都为空则抛出异常,说明用户没有push进任何元素
        if(stack1.empty()&&stack2.empty()){
            throw new RuntimeException("Queue is empty!");
        }
        //如果stack2不为空直接对stack2执行pop操作，
        if(stack2.empty()){
            while(!stack1.empty()){
                //将stack1的元素按后进先出push进stack2里面
                stack2.push(stack1.pop());
            }
        }
          return stack2.pop();
    }
}
```

## 栈的压入、弹出序列

**题目描述：**

输入两个整数序列，第一个序列表示栈的压入顺序，请判断第二个序列是否为该栈的弹出顺序。假设压入栈的所有数字均不相等。例如序列 1,2,3,4,5 是某栈的压入顺序，序列 4，5,3,2,1 是该压栈序列对应的一个弹出序列，但 4,3,5,1,2 就不可能是该压栈序列的弹出序列。（注意：这两个序列的长度是相等的）

**题目分析：**

这道题想了半天没有思路，参考了 [Alias 的答案](https://www.nowcoder.com/questionTerminal/d77d11405cc7470d82554cb392585106)，他的思路写的也很详细应该很容易看懂。

【思路】借用一个辅助的栈，遍历压栈顺序，先讲第一个放入栈中，这里是 1，然后判断栈顶元素是不是出栈顺序的第一个元素，这里是 4，很显然 1≠4，所以我们继续压栈，直到相等以后开始出栈，出栈一个元素，则将出栈顺序向后移动一位，直到不相等，这样循环等压栈顺序遍历完成，如果辅助栈还不为空，说明弹出序列不是该栈的弹出顺序。

举例：

入栈 1,2,3,4,5

出栈 4,5,3,2,1

首先 1 入辅助栈，此时栈顶 1≠4，继续入栈 2

此时栈顶 2≠4，继续入栈 3

此时栈顶 3≠4，继续入栈 4

此时栈顶 4=4，出栈 4，弹出序列向后一位，此时为 5，辅助栈里面是 1,2,3

此时栈顶 3≠5，继续入栈 5

此时栈顶 5=5，出栈 5，弹出序列向后一位，此时为 3，辅助栈里面是 1,2,3

……
依次执行，最后辅助栈为空。如果不为空说明弹出序列不是该栈的弹出顺序。

**考察内容：**

栈

**示例代码：**

```java
import java.util.ArrayList;
import java.util.Stack;
//这道题没想出来，参考了Alias同学的答案：https://www.nowcoder.com/questionTerminal/d77d11405cc7470d82554cb392585106
public class Solution {
    public boolean IsPopOrder(int [] pushA,int [] popA) {
        if(pushA.length == 0 || popA.length == 0)
            return false;
        Stack<Integer> s = new Stack<Integer>();
        //用于标识弹出序列的位置
        int popIndex = 0;
        for(int i = 0; i< pushA.length;i++){
            s.push(pushA[i]);
            //如果栈不为空，且栈顶元素等于弹出序列
            while(!s.empty() &&s.peek() == popA[popIndex]){
                //出栈
                s.pop();
                //弹出序列向后一位
                popIndex++;
            }
        }
        return s.empty();
    }
}
```

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 经典算法思想总结（含 LeetCode 题目推荐）.md -->

## [10] 经典算法思想总结（含 LeetCode 题目推荐）

---
title: 经典算法思想总结（含 LeetCode 题目推荐）
description: 总结二分、双指针、滑动窗口、DFS/BFS、回溯、动态规划、贪心、分治、拓扑排序、并查集、位运算等高频算法思想，并给出题型识别、模板、代表题和复盘重点。
category: 计算机基础
tag:
  - 算法
  - LeetCode
  - 面试
head:
  - - meta
    - name: keywords
      content: 算法思想,二分查找,双指针,滑动窗口,DFS,BFS,回溯,动态规划,贪心,分治,拓扑排序,并查集,位运算,LeetCode题目推荐
---

算法思想不要孤立背。面试里更有用的问法是：什么信号提示我该用它？模板里最容易错的地方在哪里？如果面试官改条件，我应该从哪个变量或状态开始调整？

这份题单按思想组织，每一类都给出“识别信号、常用模板、代表题、复盘重点”。题目数量控制在能代表模板的范围内，先把这些题讲明白，比机械刷更多题更划算。

## 怎么用这份题单

不要一上来就把所有题目按顺序刷完。更适合面试准备的方式是：先读对应的模板文章，确认自己能手写核心代码，再做“必刷题”，最后用“进阶题”检查边界和变体。

| 目标           | 建议动作                                                                                                                                |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 快速建立模板   | 先读 [二分查找](./二分查找面试题总结-左右边界、答案二分与 Java 模板.md)、[双指针与滑动窗口](./双指针与滑动窗口面试题总结-数组、链表、字符串高频模板.md)、[DFS/BFS](./DFS 与 BFS 面试题总结-树、图、矩阵搜索与最短路径模板.md) 这些高频模板文章 |
| 补齐搜索和 DP  | 继续读 [回溯算法](./回溯算法面试题总结-组合、排列、子集、剪枝与 Java 模板.md)、[动态规划](./动态规划面试题总结-状态转移、背包、子序列与 Java 模板.md)，每类至少手写 2 道基础题                                     |
| 面试前查漏补缺 | 用 [贪心算法](./贪心算法面试题总结-区间贪心、跳跃游戏与证明思路.md)、[Top K 问题](./Top K 问题面试题总结-堆、快排分区、桶计数与数据流.md)、[并查集](../数据结构/并查集面试题总结-路径压缩、连通性与 Java 模板.md) 补齐常见变体                            |
| 复盘自己的答案 | 每题写下题型识别信号、核心变量含义、复杂度、边界样例。如果这些讲不清，说明这题还没真正掌握                                              |

## 二分查找

| 项目     | 内容                                                                                                                                                                                                  |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 识别信号 | 有序数组、单调条件、找边界、找最小可行值或最大可行值                                                                                                                                                  |
| 常用模板 | 基础二分、左边界、右边界、答案二分                                                                                                                                                                    |
| 必刷题   | [704. 二分查找](https://leetcode.cn/problems/二分查找面试题总结-左右边界、答案二分与 Java 模板/)、[34. 在排序数组中查找元素的第一个和最后一个位置](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/) |
| 进阶题   | [35. 搜索插入位置](https://leetcode.cn/problems/search-insert-position/)、[875. 爱吃香蕉的珂珂](https://leetcode.cn/problems/koko-eating-bananas/)                                                    |
| 复盘重点 | 循环条件、`mid` 计算、边界更新后是否会死循环                                                                                                                                                          |

## 双指针

| 项目     | 内容                                                                                                                                                                            |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 识别信号 | 有序数组、原地修改、两端向中间收缩、链表快慢追赶                                                                                                                                |
| 常用模板 | 左右指针、快慢指针、读写指针                                                                                                                                                    |
| 必刷题   | [26. 删除有序数组中的重复项](https://leetcode.cn/problems/remove-duplicates-from-sorted-array/)、[977. 有序数组的平方](https://leetcode.cn/problems/squares-of-a-sorted-array/) |
| 进阶题   | [15. 三数之和](https://leetcode.cn/problems/3sum/)、[142. 环形链表 II](https://leetcode.cn/problems/linked-list-cycle-ii/)                                                      |
| 复盘重点 | 指针含义要固定，去重条件不要漏，链表题先画 3 个节点                                                                                                                             |

## 滑动窗口

| 项目     | 内容                                                                                                                                                                                      |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 识别信号 | 连续子数组、连续子串、最长/最短、窗口内满足某个条件                                                                                                                                       |
| 常用模板 | 固定窗口、可变窗口、计数 Map                                                                                                                                                              |
| 必刷题   | [3. 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)、[209. 长度最小的子数组](https://leetcode.cn/problems/minimum-size-subarray-sum/) |
| 进阶题   | [76. 最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/)、[438. 找到字符串中所有字母异位词](https://leetcode.cn/problems/find-all-anagrams-in-a-string/)                |
| 复盘重点 | 什么时候扩右边界，什么时候缩左边界，窗口内变量如何维护                                                                                                                                    |

## DFS 与 BFS

| 项目     | 内容                                                                                                                                                       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 识别信号 | 树遍历、图遍历、矩阵连通块、最短步数、层序遍历                                                                                                             |
| 常用模板 | 递归 DFS、栈模拟 DFS、队列 BFS、层序 BFS                                                                                                                   |
| 必刷题   | [102. 二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)、[200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/) |
| 进阶题   | [994. 腐烂的橘子](https://leetcode.cn/problems/rotting-oranges/)、[127. 单词接龙](https://leetcode.cn/problems/word-ladder/)                               |
| 复盘重点 | 访问标记、越界判断、BFS 层数统计                                                                                                                           |

## 回溯算法

| 项目     | 内容                                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------------------------- |
| 识别信号 | 枚举所有方案、路径选择、组合、排列、子集、棋盘约束                                                                  |
| 常用模板 | 路径 `path`、选择列表、递归层、撤销选择                                                                             |
| 必刷题   | [77. 组合](https://leetcode.cn/problems/combinations/)、[78. 子集](https://leetcode.cn/problems/subsets/)           |
| 进阶题   | [39. 组合总和](https://leetcode.cn/problems/combination-sum/)、[51. N 皇后](https://leetcode.cn/problems/n-queens/) |
| 复盘重点 | 递归参数代表什么，剪枝条件放在循环前还是循环内                                                                      |

## 动态规划

| 项目     | 内容                                                                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 识别信号 | 求最优值、方案数、能否到达、子序列、背包、区间合并                                                                                                                 |
| 常用模板 | 一维 DP、二维 DP、滚动数组、背包 DP                                                                                                                                |
| 必刷题   | [70. 爬楼梯](https://leetcode.cn/problems/climbing-stairs/)、[322. 零钱兑换](https://leetcode.cn/problems/coin-change/)                                            |
| 进阶题   | [300. 最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/)、[416. 分割等和子集](https://leetcode.cn/problems/partition-equal-subset-sum/) |
| 复盘重点 | `dp[i]` 的含义、初始化、遍历顺序、是否能压缩空间                                                                                                                   |

## 贪心算法

| 项目     | 内容                                                                                                                                      |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 识别信号 | 每一步选择当前最合适的对象，常伴随排序、区间、跳跃、买卖                                                                                  |
| 常用模板 | 排序后选择、维护最远边界、区间合并/覆盖                                                                                                   |
| 必刷题   | [455. 分发饼干](https://leetcode.cn/problems/assign-cookies/)、[55. 跳跃游戏](https://leetcode.cn/problems/jump-game/)                    |
| 进阶题   | [45. 跳跃游戏 II](https://leetcode.cn/problems/jump-game-ii/)、[435. 无重叠区间](https://leetcode.cn/problems/non-overlapping-intervals/) |
| 复盘重点 | 贪心策略为什么不会错，反例能否推翻当前策略                                                                                                |

## 分治算法

| 项目     | 内容                                                                                                                                                                       |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 识别信号 | 问题可以拆成同类子问题，子问题结果能合并                                                                                                                                   |
| 常用模板 | 递归拆分、子问题求解、合并结果                                                                                                                                             |
| 必刷题   | [108. 将有序数组转换为二叉搜索树](https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/)、[148. 排序链表](https://leetcode.cn/problems/sort-list/)      |
| 进阶题   | [23. 合并 K 个升序链表](https://leetcode.cn/problems/merge-k-sorted-lists/)、[215. 数组中的第 K 个最大元素](https://leetcode.cn/problems/kth-largest-element-in-an-array/) |
| 复盘重点 | 递归出口、左右区间是否重叠、合并复杂度                                                                                                                                     |

## 拓扑排序

| 项目     | 内容                                                                                                                                |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 识别信号 | 课程依赖、任务依赖、有向无环图、判断是否能完成                                                                                      |
| 常用模板 | 入度数组 + 队列，或 DFS 三色标记                                                                                                    |
| 必刷题   | [207. 课程表](https://leetcode.cn/problems/course-schedule/)                                                                        |
| 进阶题   | [210. 课程表 II](https://leetcode.cn/problems/course-schedule-ii/)、[269. 火星词典](https://leetcode.cn/problems/alien-dictionary/) |
| 复盘重点 | 入度什么时候减，结果数量是否等于节点数量                                                                                            |

## 并查集

| 项目     | 内容                                                                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 识别信号 | 连通性、分组、朋友圈、冗余边、等式关系                                                                                                                             |
| 常用模板 | `find`、`union`、路径压缩、按大小合并                                                                                                                              |
| 必刷题   | [547. 省份数量](https://leetcode.cn/problems/number-of-provinces/)                                                                                                 |
| 进阶题   | [684. 冗余连接](https://leetcode.cn/problems/redundant-connection/)、[990. 等式方程的可满足性](https://leetcode.cn/problems/satisfiability-of-equality-equations/) |
| 复盘重点 | `find` 是否路径压缩，什么时候判断冲突                                                                                                                              |

## 位运算

| 项目     | 内容                                                                                                                            |
| -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 识别信号 | 奇偶、是否为 2 的幂、只出现一次、状态压缩                                                                                       |
| 常用模板 | 异或、与运算清最低位 1、位掩码枚举                                                                                              |
| 必刷题   | [136. 只出现一次的数字](https://leetcode.cn/problems/single-number/)、[231. 2 的幂](https://leetcode.cn/problems/power-of-two/) |
| 进阶题   | [191. 位 1 的个数](https://leetcode.cn/problems/number-of-1-bits/)、[78. 子集](https://leetcode.cn/problems/subsets/)           |
| 复盘重点 | 异或性质、`n & (n - 1)` 的含义、负数位表示                                                                                      |

## 复习路线入口

这篇文章只保留经典题型和题单推荐，7 天速刷和 30 天系统路线统一维护在[算法面试复习总览](./README.md)。后续如果调整复习节奏，只需要更新总览页，避免多个题单里的路线表互相漂移。

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 十大经典排序算法总结.md -->

## [11] 十大经典排序算法总结

---
title: 十大经典排序算法总结
description: 系统梳理十大经典排序算法，附复杂度与稳定性对比，覆盖比较类与非比较类排序的核心原理与实现场景，帮助快速选型与优化。
category: 计算机基础
tag:
  - 算法
head:
  - - meta
    - name: keywords
      content: 排序算法,快速排序,归并排序,堆排序,冒泡排序,选择排序,插入排序,希尔排序,桶排序,计数排序,基数排序,时间复杂度,空间复杂度,稳定性
---

<!-- markdownlint-disable MD024 -->

## 引言

所谓排序，就是使一串记录，按照其中的某个或某些关键字的大小，递增或递减的排列起来的操作。排序算法，就是如何使得记录按照要求排列的方法。排序算法在很多领域得到相当地重视，尤其是在大量数据的处理方面。一个优秀的算法可以节省大量的资源。在各个领域中考虑到数据的各种限制和规范，要得到一个符合实际的优秀算法，得经过大量的推理和分析。

## 简介

### 排序算法总结

常见的内部排序算法有：**插入排序**、**希尔排序**、**选择排序**、**冒泡排序**、**归并排序**、**快速排序**、**堆排序**、**基数排序**等，本文只讲解内部排序算法。用一张表格概括：

| 排序算法 | 时间复杂度（平均） | 时间复杂度（最差） | 时间复杂度（最好） | 空间复杂度              | 是否原地 | 稳定性         |
| -------- | ------------------ | ------------------ | ------------------ | ----------------------- | -------- | -------------- |
| 冒泡排序 | O(n^2)             | O(n^2)             | O(n)               | O(1)                    | 是       | 稳定           |
| 选择排序 | O(n^2)             | O(n^2)             | O(n^2)             | O(1)                    | 是       | 不稳定         |
| 插入排序 | O(n^2)             | O(n^2)             | O(n)               | O(1)                    | 是       | 稳定           |
| 希尔排序 | 取决于增量序列     | O(n^2)             | O(nlogn)           | O(1)                    | 是       | 不稳定         |
| 归并排序 | O(nlogn)           | O(nlogn)           | O(nlogn)           | O(n)                    | 否       | 稳定           |
| 快速排序 | O(nlogn)           | O(n^2)             | O(nlogn)           | 平均 O(logn)，最坏 O(n) | 是       | 不稳定         |
| 堆排序   | O(nlogn)           | O(nlogn)           | O(nlogn)           | O(1)                    | 是       | 不稳定         |
| 计数排序 | O(n+k)             | O(n+k)             | O(n+k)             | O(n+k)                  | 否       | 稳定           |
| 桶排序   | 和数据分布有关     | 取决于桶内排序     | O(n+k)             | O(n+k)                  | 否       | 取决于桶内排序 |
| 基数排序 | O(d(n+r))          | O(d(n+r))          | O(d(n+r))          | O(n+r)                  | 否       | 稳定           |

**术语解释**：

- **n**：数据规模，表示待排序的数据量大小。
- **k**：计数范围大小或桶的数量，具体含义需要结合算法说明。
- **d**：基数排序处理的最大位数。
- **r**：基数排序使用的基数，例如十进制的 `r=10`。
- **内部排序**：待排序数据可以全部装入内存，排序操作主要在内存中完成。本文代码都是内部排序实现。
- **外部排序**：数据量大到无法全部装入内存时，借助磁盘等外部存储分批处理。同一种算法可以有内存实现，也可以被改造成外部排序方案，因此这不是算法固有的分类标签。
- **稳定**：如果 A 原本在 B 前面，而 $A=B$，排序之后 A 仍然在 B 的前面。
- **不稳定**：如果 A 原本在 B 的前面，而 $A=B$，排序之后 A 可能会出现在 B 的后面。
- **时间复杂度**：定性描述一个算法执行所耗费的时间。
- **空间复杂度**：定性描述一个算法执行所需内存的大小。

### 排序算法分类

十种常见排序算法可以分类两大类别：**比较类排序**和**非比较类排序**。

![排序算法分类](https://oss.javaguide.cn/github/javaguide/计算机基础/sorting-algorithms/sort2.png)

常见的**快速排序**、**归并排序**、**堆排序**以及**冒泡排序**等都属于**比较类排序算法**。比较类排序通过比较决定元素间的相对次序。在比较模型中，通用排序在最坏情况下需要 `Ω(nlogn)` 次比较。冒泡排序需要多轮扫描，平均时间复杂度为 `O(n²)`；归并排序和快速排序利用分治把问题拆成更小的子问题，平均时间复杂度为 `O(nlogn)`。

比较类排序的优势是，适用于各种规模的数据，也不在乎数据的分布，都能进行排序。可以说，比较排序适用于一切需要排序的情况。

而**计数排序**、**基数排序**、**桶排序**则属于**非比较类排序算法**。它们利用键值范围、数据分布或数字位数等额外信息绕开比较排序的下界，但并非都能通过一次遍历以 `O(n)` 完成。计数排序通常是 `O(n+k)`，桶排序的效率取决于数据分布和桶内排序，基数排序通常是 `O(d(n+r))`。

非比较排序时间复杂度低，但由于非比较排序需要占用空间来确定唯一位置。所以对数据规模和数据分布有一定的要求。

## 冒泡排序（Bubble Sort）

冒泡排序是一种简单的排序算法。它重复地遍历要排序的序列，依次比较两个元素，如果它们的顺序错误就把它们交换过来。遍历序列的工作是重复地进行直到没有再需要交换为止，此时说明该序列已经排序完成。这个算法的名字由来是因为越小的元素会经由交换慢慢 “浮” 到数列的顶端。

### 算法步骤

1. 比较相邻的元素。如果第一个比第二个大，就交换它们两个；
2. 对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对，这样在最后的元素应该会是最大的数；
3. 针对所有的元素重复以上的步骤，除了最后一个；
4. 重复步骤 1~3，直到排序完成。

### 图解算法

![冒泡排序](https://oss.javaguide.cn/github/javaguide/计算机基础/sorting-algorithms/bubble_sort.gif)

### 代码实现

```java
/**
 * 冒泡排序
 * @param arr
 * @return arr
 */
public static int[] bubbleSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        // Set a flag, if true, that means the loop has not been swapped,
        // that is, the sequence has been ordered, the sorting has been completed.
        boolean flag = true;
        for (int j = 0; j < arr.length - i; j++) {
            if (arr[j] > arr[j + 1]) {
                int tmp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tmp;
       // Change flag
                flag = false;
            }
        }
        if (flag) {
            break;
        }
    }
    return arr;
}
```

**此处对代码做了一个小优化，加入了 `is_sorted` Flag，目的是将算法的最佳时间复杂度优化为 `O(n)`，即当原输入序列就是排序好的情况下，该算法的时间复杂度就是 `O(n)`。**

### 算法分析

- **稳定性**：稳定
- **时间复杂度**：最佳：$O(n)$，最差：$O(n^2)$，平均：$O(n^2)$
- **空间复杂度**：$O(1)$
- **排序方式**：In-place

## 选择排序（Selection Sort）

选择排序是一种简单直观的排序算法，无论什么数据进去都是 $O(n^2)$ 的时间复杂度。所以用到它的时候，数据规模越小越好。唯一的好处可能就是不占用额外的内存空间了吧。它的工作原理：首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置，然后，再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。以此类推，直到所有元素均排序完毕。

### 算法步骤

1. 首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置
2. 再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。
3. 重复第 2 步，直到所有元素均排序完毕。

### 图解算法

![选择排序每轮选择最小元素放到已排序区末尾](https://oss.javaguide.cn/github/javaguide/计算机基础/sorting-algorithms/selection_sort.gif)

### 代码实现

```java
/**
 * 选择排序
 * @param arr
 * @return arr
 */
public static int[] selectionSort(int[] arr) {
    for (int i = 0; i < arr.length - 1; i++) {
        int minIndex = i;
        for (int j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex != i) {
            int tmp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = tmp;
        }
    }
    return arr;
}
```

### 算法分析

- **稳定性**：不稳定
- **时间复杂度**：最佳：$O(n^2)$，最差：$O(n^2)$，平均：$O(n^2)$
- **空间复杂度**：$O(1)$
- **排序方式**：In-place

## 插入排序（Insertion Sort）

插入排序是一种简单直观的排序算法。它的工作原理是通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。插入排序在实现上，通常采用 in-place 排序（即只需用到 $O(1)$ 的额外空间的排序），因而在从后向前扫描过程中，需要反复把已排序元素逐步向后挪位，为最新元素提供插入空间。

插入排序的代码实现虽然没有冒泡排序和选择排序那么简单粗暴，但它的原理应该是最容易理解的了，因为只要打过扑克牌的人都应该能够秒懂。插入排序是一种最简单直观的排序算法，它的工作原理是通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。

插入排序和冒泡排序一样，也有一种优化算法，叫做拆半插入。

### 算法步骤

1. 从第一个元素开始，该元素可以认为已经被排序；
2. 取出下一个元素，在已经排序的元素序列中从后向前扫描；
3. 如果该元素（已排序）大于新元素，将该元素移到下一位置；
4. 重复步骤 3，直到找到已排序的元素小于或者等于新元素的位置；
5. 将新元素插入到该位置后；
6. 重复步骤 2~5。

### 图解算法

![插入排序过程演示](https://oss.javaguide.cn/github/javaguide/计算机基础/sorting-algorithms/insertion_sort.gif)

### 代码实现

```java
/**
 * 插入排序
 * @param arr
 * @return arr
 */
public static int[] insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int preIndex = i - 1;
        int current = arr[i];
        while (preIndex >= 0 && current < arr[preIndex]) {
            arr[preIndex + 1] = arr[preIndex];
            preIndex -= 1;
        }
        arr[preIndex + 1] = current;
    }
    return arr;
}
```

### 算法分析

- **稳定性**：稳定
- **时间复杂度**：最佳：$O(n)$，最差：$O(n^2)$，平均：$O(n^2)$
- **空间复杂度**：$O(1)$
- **排序方式**：In-place

## 希尔排序（Shell Sort）

希尔排序是希尔（Donald Shell）于 1959 年提出的一种排序算法。希尔排序也是一种插入排序，它是简单插入排序经过改进之后的一个更高效的版本，也称为递减增量排序算法。它的性能高度依赖增量序列：一些后来设计的增量序列可以获得亚二次上界，但本文使用的 Shell 原始增量在最坏情况下仍为 $O(n^2)$。

希尔排序的基本思想是：先将整个待排序的记录序列分割成为若干子序列分别进行直接插入排序，待整个序列中的记录 “基本有序” 时，再对全体记录进行依次直接插入排序。

### 算法步骤

我们来看下希尔排序的基本步骤，在此我们选择增量 $gap=length/2$，缩小增量继续以 $gap = gap/2$ 的方式，这种增量选择我们可以用一个序列来表示，$\lbrace \frac{n}{2}, \frac{(n/2)}{2}, \dots, 1 \rbrace$，称为**增量序列**。希尔排序的增量序列的选择与证明是个数学难题，我们选择的这个增量序列是比较常用的，也是希尔建议的增量，称为希尔增量，但其实这个增量序列不是最优的。此处我们做示例使用希尔增量。

先将整个待排序的记录序列分割成为若干子序列分别进行直接插入排序，具体算法描述：

- 选择一个增量序列 $\lbrace t_1, t_2, \dots, t_k \rbrace$，其中 $t_i \gt t_j, i \lt j, t_k = 1$；
- 按增量序列个数 k，对序列进行 k 趟排序；
- 每趟排序，根据对应的增量 $t$，将待排序列分割成若干长度为 $m$ 的子序列，分别对各子表进行直接插入排序。仅增量因子为 1 时，整个序列作为一个表来处理，表长度即为整个序列的长度。

### 图解算法

![希尔排序按增量分组并插入排序的过程](https://oss.javaguide.cn/github/javaguide/计算机基础/sorting-algorithms/shell_sort.png)

### 代码实现

```java
/**
 * 希尔排序
 *
 * @param arr
 * @return arr
 */
public static int[] shellSort(int[] arr) {
    int n = arr.length;
    int gap = n / 2;
    while (gap > 0) {
        for (int i = gap; i < n; i++) {
            int current = arr[i];
            int preIndex = i - gap;
            // Insertion sort
            while (preIndex >= 0 && arr[preIndex] > current) {
                arr[preIndex + gap] = arr[preIndex];
                preIndex -= gap;
            }
            arr[preIndex + gap] = current;

        }
        gap /= 2;
    }
    return arr;
}
```

### 算法分析

- **稳定性**：不稳定
- **时间复杂度**：最佳：$O(nlogn)$，最差：$O(n^2)$，平均复杂度取决于增量序列
- **空间复杂度**：$O(1)$

## 归并排序（Merge Sort）

归并排序是建立在归并操作上的一种有效的排序算法。该算法是采用分治法（Divide and Conquer）的一个非常典型的应用。归并排序是一种稳定的排序方法。将已有序的子序列合并，得到完全有序的序列；即先使每个子序列有序，再使子序列段间有序。若将两个有序表合并成一个有序表，称为 2 - 路归并。

和选择排序一样，归并排序的性能不受输入数据的影响，但表现比选择排序好的多，因为始终都是 $O(nlogn)$ 的时间复杂度。代价是需要额外的内存空间。

### 算法步骤

归并排序算法是一个递归过程，边界条件为当输入序列仅有一个元素时，直接返回，具体过程如下：

1. 如果输入内只有一个元素，则直接返回，否则将长度为 $n$ 的输入序列分成两个长度为 $n/2$ 的子序列；
2. 分别对这两个子序列进行归并排序，使子序列变为有序状态；
3. 设定两个指针，分别指向两个已经排序子序列的起始位置；
4. 比较两个指针所指向的元素，选择相对小的元素放入到合并空间（用于存放排序结果），并移动指针到下一位置；
5. 重复步骤 3 ~ 4 直到某一指针达到序列尾；
6. 将另一序列剩下的所有元素直接复制到合并序列尾。

### 图解算法

![归并排序递归拆分数组并合并有序子数组](https://oss.javaguide.cn/github/javaguide/计算机基础/sorting-algorithms/merge_sort.gif)

### 代码实现

```java
/**
 * 归并排序
 *
 * @param arr
 * @return arr
 */
public static int[] mergeSort(int[] arr) {
    if (arr.length <= 1) {
        return arr;
    }
    int middle = arr.length / 2;
    int[] arr_1 = Arrays.copyOfRange(arr, 0, middle);
    int[] arr_2 = Arrays.copyOfRange(arr, middle, arr.length);
    return merge(mergeSort(arr_1), mergeSort(arr_2));
}

/**
 * Merge two sorted arrays
 *
 * @param arr_1
 * @param arr_2
 * @return sorted_arr
 */
public static int[] merge(int[] arr_1, int[] arr_2) {
    int[] sorted_arr = new int[arr_1.length + arr_2.length];
    int idx = 0, idx_1 = 0, idx_2 = 0;
    while (idx_1 < arr_1.length && idx_2 < arr_2.length) {
        if (arr_1[idx_1] <= arr_2[idx_2]) {
            sorted_arr[idx] = arr_1[idx_1];
            idx_1 += 1;
        } else {
            sorted_arr[idx] = arr_2[idx_2];
            idx_2 += 1;
        }
        idx += 1;
    }
    if (idx_1 < arr_1.length) {
        while (idx_1 < arr_1.length) {
            sorted_arr[idx] = arr_1[idx_1];
            idx_1 += 1;
            idx += 1;
        }
    } else {
        while (idx_2 < arr_2.length) {
            sorted_arr[idx] = arr_2[idx_2];
            idx_2 += 1;
            idx += 1;
        }
    }
    return sorted_arr;
}
```

### 算法分析

- **稳定性**：稳定
- **时间复杂度**：最佳：$O(nlogn)$，最差：$O(nlogn)$，平均：$O(nlogn)$
- **空间复杂度**：$O(n)$

## 快速排序（Quick Sort）

快速排序用到了分治思想，同样的还有归并排序。乍看起来快速排序和归并排序非常相似，都是将问题变小，先排序子串，最后合并。不同的是快速排序在划分子问题的时候经过多一步处理，将划分的两组数据划分为一大一小，这样在最后合并的时候就不必像归并排序那样再进行比较。但也正因为如此，划分的不定性使得快速排序的时间复杂度并不稳定。

快速排序的基本思想：通过一趟排序将待排序列分隔成独立的两部分，其中一部分记录的元素均比另一部分的元素小，则可分别对这两部分子序列继续进行排序，以达到整个序列有序。

### 算法步骤

快速排序使用[分治法](https://zh.wikipedia.org/wiki/分治法)（Divide and conquer）策略来把一个序列分为较小和较大的 2 个子序列，然后递归地排序两个子序列。具体算法描述如下：

1. **选择基准（Pivot）**：从数组中选一个元素作为基准。为了避免最坏情况，通常会随机选择。
2. **分区（Partition）**：重新排列序列，将所有比基准值小的元素摆放在基准前面，所有比基准值大的摆在基准的后面（相同的数可以到任一边）。在这个操作结束之后，该基准就处于数列的中间位置。
3. **递归（Recurse）**：递归地把小于基准值元素的子序列和大于基准值元素的子序列进行快速排序。

**关于性能，这也是它与归并排序的关键区别：**

- **平均和最佳情况：** 它的时间复杂度是 $O(nlogn)$。这种情况发生在每次分区都能把数组分成均等的两半。
- **最坏情况：** 它的时间复杂度会退化到 $O(n^2)$。这发生在每次我们选的基准都是当前数组的最小值或最大值时，比如对一个已经排好序的数组，每次都选第一个元素做基准，这就会导致分区极其不均，算法退化成类似冒泡排序。这就是为什么**随机选择基准**非常重要。

### 图解算法

![随机快速排序选择基准并递归划分子序列](https://oss.javaguide.cn/github/javaguide/计算机基础/sorting-algorithms/random_quick_sort.gif)

### 代码实现

```java
import java.util.concurrent.ThreadLocalRandom;

class Solution {
    public int[] sortArray(int[] a) {
        quick(a, 0, a.length - 1);
        return a;
    }

    // 快速排序的核心递归函数
    void quick(int[] a, int left, int right) {
        if (left >= right) { // 递归终止条件：区间只有一个或没有元素
            return;
        }
        int p = partition(a, left, right); // 分区操作，返回分区点索引
        quick(a, left, p - 1); // 对左侧子数组递归排序
        quick(a, p + 1, right); // 对右侧子数组递归排序
    }

    // 分区函数：将数组分为两部分，小于基准值的在左，大于基准值的在右
    int partition(int[] a, int left, int right) {
        // 随机选择一个基准点，避免最坏情况（如数组接近有序）
        int idx = ThreadLocalRandom.current().nextInt(right - left + 1) + left;
        swap(a, left, idx); // 将基准点放在数组的最左端
        int pv = a[left]; // 基准值
        int i = left + 1; // 左指针，指向当前需要检查的元素
        int j = right; // 右指针，从右往左寻找比基准值小的元素

        while (i <= j) {
            // 左指针向右移动，直到找到一个大于等于基准值的元素
            while (i <= j && a[i] < pv) {
                i++;
            }
            // 右指针向左移动，直到找到一个小于等于基准值的元素
            while (i <= j && a[j] > pv) {
                j--;
            }
            // 如果左指针尚未越过右指针，交换两个不符合位置的元素
            if (i <= j) {
                swap(a, i, j);
                i++;
                j--;
            }
        }
        // 将基准值放到分区点位置，使得基准值左侧小于它，右侧大于它
        swap(a, j, left);
        return j;
    }

    // 交换数组中两个元素的位置
    void swap(int[] a, int i, int j) {
        int t = a[i];
        a[i] = a[j];
        a[j] = t;
    }
}
```

### 算法分析

- **稳定性**：不稳定
- **时间复杂度**：最佳：$O(nlogn)$，最差：$O(n^2)$，平均：$O(nlogn)$
- **空间复杂度**：平均 $O(logn)$，最坏 $O(n)$（递归调用栈）

## 堆排序（Heap Sort）

堆排序是指利用堆这种数据结构所设计的一种排序算法。堆是一个近似完全二叉树的结构，并同时满足**堆的性质**：即**子结点的值总是小于（或者大于）它的父节点**。

### 算法步骤

1. 将初始待排序列 $(R_1, R_2, \dots, R_n)$ 构建成大顶堆，此堆为初始的无序区；
2. 将堆顶元素 $R_1$ 与最后一个元素 $R_n$ 交换，此时得到新的无序区 $(R_1, R_2, \dots, R_{n-1})$ 和新的有序区 $R_n$，且满足 $R_i \leqslant R_n (i \in 1, 2,\dots, n-1)$；
3. 由于交换后新的堆顶 $R_1$ 可能违反堆的性质，因此需要对当前无序区 $(R_1, R_2, \dots, R_{n-1})$ 调整为新堆，然后再次将 $R_1$ 与无序区最后一个元素交换，得到新的无序区 $(R_1, R_2, \dots, R_{n-2})$ 和新的有序区 $(R_{n-1}, R_n)$。不断重复此过程直到有序区的元素个数为 $n-1$，则整个排序过程完成。

### 图解算法

![堆排序构建大顶堆并依次取出堆顶元素](https://oss.javaguide.cn/github/javaguide/计算机基础/sorting-algorithms/heap_sort.gif)

### 代码实现

```java
// Global variable that records the length of an array;
static int heapLen;

/**
 * Swap the two elements of an array
 * @param arr
 * @param i
 * @param j
 */
private static void swap(int[] arr, int i, int j) {
    int tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

/**
 * Build Max Heap
 * @param arr
 */
private static void buildMaxHeap(int[] arr) {
    for (int i = arr.length / 2 - 1; i >= 0; i--) {
        heapify(arr, i);
    }
}

/**
 * Adjust it to the maximum heap
 * @param arr
 * @param i
 */
private static void heapify(int[] arr, int i) {
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    int largest = i;
    if (right < heapLen && arr[right] > arr[largest]) {
        largest = right;
    }
    if (left < heapLen && arr[left] > arr[largest]) {
        largest = left;
    }
    if (largest != i) {
        swap(arr, largest, i);
        heapify(arr, largest);
    }
}

/**
 * Heap Sort
 * @param arr
 * @return
 */
public static int[] heapSort(int[] arr) {
    // index at the end of the heap
    heapLen = arr.length;
    // build MaxHeap
    buildMaxHeap(arr);
    for (int i = arr.length - 1; i > 0; i--) {
        // Move the top of the heap to the tail of the heap in turn
        swap(arr, 0, i);
        heapLen -= 1;
        heapify(arr, 0);
    }
    return arr;
}
```

### 算法分析

- **稳定性**：不稳定
- **时间复杂度**：最佳：$O(nlogn)$，最差：$O(nlogn)$，平均：$O(nlogn)$
- **空间复杂度**：$O(1)$

## 计数排序（Counting Sort）

计数排序的核心在于将输入的数据值转化为键存储在额外开辟的数组空间中。作为一种线性时间复杂度的排序，**计数排序要求输入的数据必须是有确定范围的整数**。

计数排序（Counting sort）是一种稳定的排序算法。计数排序使用一个额外的数组 `C`，其中第 `i` 个元素是待排序数组 `A` 中值等于 `i` 的元素的个数。然后根据数组 `C` 来将 `A` 中的元素排到正确的位置。**它只能对整数进行排序**。

### 算法步骤

1. 找出数组中的最大值 `max`、最小值 `min`；
2. 创建一个新数组 `C`，其长度是 `max-min+1`，其元素默认值都为 0；
3. 遍历原数组 `A` 中的元素 `A[i]`，以 `A[i] - min` 作为 `C` 数组的索引，以 `A[i]` 的值在 `A` 中元素出现次数作为 `C[A[i] - min]` 的值；
4. 对 `C` 数组变形，**新元素的值是该元素与前一个元素值的和**，即当 `i>1` 时 `C[i] = C[i] + C[i-1]`；
5. 创建结果数组 `R`，长度和原始数组一样。
6. **从后向前**遍历原始数组 `A` 中的元素 `A[i]`，使用 `A[i]` 减去最小值 `min` 作为索引，在计数数组 `C` 中找到对应的值 `C[A[i] - min]`，`C[A[i] - min] - 1` 就是 `A[i]` 在结果数组 `R` 中的位置，做完上述这些操作，将 `count[A[i] - min]` 减小 1。

### 图解算法

![计数排序通过统计元素出现次数确定有序位置](https://oss.javaguide.cn/github/javaguide/计算机基础/sorting-algorithms/counting_sort.gif)

### 代码实现

```java
/**
 * Gets the maximum and minimum values in the array
 *
 * @param arr
 * @return
 */
private static int[] getMinAndMax(int[] arr) {
    int maxValue = arr[0];
    int minValue = arr[0];
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] > maxValue) {
            maxValue = arr[i];
        } else if (arr[i] < minValue) {
            minValue = arr[i];
        }
    }
    return new int[] { minValue, maxValue };
}

/**
 * Counting Sort
 *
 * @param arr
 * @return
 */
public static int[] countingSort(int[] arr) {
    if (arr.length < 2) {
        return arr;
    }
    int[] extremum = getMinAndMax(arr);
    int minValue = extremum[0];
    int maxValue = extremum[1];
    int[] countArr = new int[maxValue - minValue + 1];
    int[] result = new int[arr.length];

    for (int i = 0; i < arr.length; i++) {
        countArr[arr[i] - minValue] += 1;
    }
    for (int i = 1; i < countArr.length; i++) {
        countArr[i] += countArr[i - 1];
    }
    for (int i = arr.length - 1; i >= 0; i--) {
        int idx = countArr[arr[i] - minValue] - 1;
        result[idx] = arr[i];
        countArr[arr[i] - minValue] -= 1;
    }
    return result;
}
```

### 算法分析

当输入的元素是 `n` 个 `0` 到 `k` 之间的整数时，它的运行时间是 $O(n+k)$。计数排序不是比较排序，排序的速度快于任何比较排序算法。由于用来计数的数组 `C` 的长度取决于待排序数组中数据的范围（等于待排序数组的**最大值与最小值的差加上 1**），这使得计数排序对于数据范围很大的数组，需要大量额外内存空间。

- **稳定性**：稳定
- **时间复杂度**：最佳：$O(n+k)$，最差：$O(n+k)$，平均：$O(n+k)$
- **空间复杂度**：$O(n+k)$

## 桶排序（Bucket Sort）

桶排序是计数排序的升级版。它利用了函数的映射关系，高效与否的关键就在于这个映射函数的确定。为了使桶排序更加高效，我们需要做到这两点：

1. 在额外空间充足的情况下，尽量增大桶的数量
2. 使用的映射函数能够将输入的 N 个数据均匀的分配到 K 个桶中

桶排序的工作的原理：假设输入数据服从均匀分布，将数据分到有限数量的桶里，每个桶再分别排序（有可能再使用别的排序算法或是以递归方式继续使用桶排序进行。

### 算法步骤

1. 设置一个 BucketSize，作为每个桶所能放置多少个不同数值；
2. 遍历输入数据，并且把数据依次映射到对应的桶里去；
3. 对每个非空的桶进行排序，可以使用其它排序方法，也可以递归使用桶排序；
4. 从非空桶里把排好序的数据拼接起来。

### 图解算法

![桶排序将数据分配到多个桶后分别排序再合并](https://oss.javaguide.cn/github/javaguide/计算机基础/sorting-algorithms/bucket_sort.gif)

### 代码实现

```java
/**
 * Gets the maximum and minimum values in the array
 * @param arr
 * @return
 */
private static int[] getMinAndMax(List<Integer> arr) {
    int maxValue = arr.get(0);
    int minValue = arr.get(0);
    for (int i : arr) {
        if (i > maxValue) {
            maxValue = i;
        } else if (i < minValue) {
            minValue = i;
        }
    }
    return new int[] { minValue, maxValue };
}

/**
 * Bucket Sort
 * @param arr
 * @return
 */
public static List<Integer> bucketSort(List<Integer> arr, int bucket_size) {
    if (bucket_size <= 0) {
        throw new IllegalArgumentException("bucket_size must be positive");
    }
    if (arr.size() < 2) {
        return arr;
    }
    int[] extremum = getMinAndMax(arr);
    int minValue = extremum[0];
    int maxValue = extremum[1];
    int bucket_cnt = (maxValue - minValue) / bucket_size + 1;
    List<List<Integer>> buckets = new ArrayList<>();
    for (int i = 0; i < bucket_cnt; i++) {
        buckets.add(new ArrayList<Integer>());
    }
    for (int element : arr) {
        int idx = (element - minValue) / bucket_size;
        buckets.get(idx).add(element);
    }
    for (int i = 0; i < buckets.size(); i++) {
        if (buckets.get(i).size() > 1) {
            buckets.get(i).sort(Integer::compareTo);
        }
    }
    ArrayList<Integer> result = new ArrayList<>();
    for (List<Integer> bucket : buckets) {
        for (int element : bucket) {
            result.add(element);
        }
    }
    return result;
}
```

### 算法分析

- **稳定性**：取决于桶内排序。当前实现按原顺序入桶，并使用稳定的 `List.sort`，因此是稳定的
- **时间复杂度**：当前实现最佳为 $O(n+k)$；数据均匀分布时，期望接近 $O(n+k)$；最坏为 $O(nlogn+k)$。如果桶内改用插入排序，最坏情况会退化到 $O(n^2)$
- **空间复杂度**：$O(n+k)$

## 基数排序（Radix Sort）

基数排序也是非比较的排序算法，对元素中的每一位数字进行排序，从最低位开始排序。设数组长度为 $n$、最大位数为 $d$、基数为 $r$，复杂度为 $O(d(n+r))$。下面的十进制 LSD 实现仅支持非负整数。

基数排序是按照低位先排序，然后收集；再按照高位排序，然后再收集；依次类推，直到最高位。有时候有些属性是有优先级顺序的，先按低优先级排序，再按高优先级排序。最后的次序就是高优先级高的在前，高优先级相同的低优先级高的在前。基数排序基于分别排序，分别收集，所以是稳定的。

### 算法步骤

1. 取得数组中的最大数，并取得位数，即为迭代次数 $N$（例如：数组中最大数值为 1000，则 $N=4$）；
2. `A` 为原始数组，从最低位开始取每个位组成 `radix` 数组；
3. 对 `radix` 进行计数排序（利用计数排序适用于小范围数的特点）；
4. 将 `radix` 依次赋值给原数组；
5. 重复 2~4 步骤 $N$ 次

### 图解算法

![基数排序按数字位从低到高依次排序并收集](https://oss.javaguide.cn/github/javaguide/计算机基础/sorting-algorithms/radix_sort.gif)

### 代码实现

```java
/**
 * Radix Sort
 *
 * @param arr
 * @return
 */
public static int[] radixSort(int[] arr) {
    if (arr.length < 2) {
        return arr;
    }
    for (int element : arr) {
        if (element < 0) {
            throw new IllegalArgumentException("radixSort only supports non-negative integers");
        }
    }
    int N = 1;
    int maxValue = arr[0];
    for (int element : arr) {
        if (element > maxValue) {
            maxValue = element;
        }
    }
    while (maxValue / 10 != 0) {
        maxValue = maxValue / 10;
        N += 1;
    }
    for (int i = 0; i < N; i++) {
        List<List<Integer>> radix = new ArrayList<>();
        for (int k = 0; k < 10; k++) {
            radix.add(new ArrayList<Integer>());
        }
        for (int element : arr) {
            int idx = (element / (int) Math.pow(10, i)) % 10;
            radix.get(idx).add(element);
        }
        int idx = 0;
        for (List<Integer> l : radix) {
            for (int n : l) {
                arr[idx++] = n;
            }
        }
    }
    return arr;
}
```

### 算法分析

- **稳定性**：稳定
- **时间复杂度**：最佳、最差、平均均为 $O(d(n+r))$
- **空间复杂度**：$O(n+r)$

**基数排序 vs 计数排序 vs 桶排序**

这三种排序算法都利用了桶的概念，但对桶的使用方法上有明显差异：

- 基数排序：根据键值的每位数字来分配桶
- 计数排序：每个桶只存储单一键值
- 桶排序：每个桶存储一定范围的数值

## 参考文章

- [排序算法总结（本文主要参考来源）](https://www.cnblogs.com/guoyaohua/p/8600214.html)
- <https://en.wikipedia.org/wiki/Sorting_algorithm>
- <https://sort.hust.cc/>

## 面试复盘重点

排序算法面试一般不会要求你把 10 种排序全部手写，但复杂度、稳定性、原地排序和适用场景要能说清。

| 排序算法 | 平均时间复杂度 | 最坏时间复杂度 | 空间复杂度                  | 稳定性         | 是否原地 |
| -------- | -------------- | -------------- | --------------------------- | -------------- | -------- |
| 冒泡排序 | `O(n^2)`       | `O(n^2)`       | `O(1)`                      | 稳定           | 是       |
| 选择排序 | `O(n^2)`       | `O(n^2)`       | `O(1)`                      | 不稳定         | 是       |
| 插入排序 | `O(n^2)`       | `O(n^2)`       | `O(1)`                      | 稳定           | 是       |
| 归并排序 | `O(nlogn)`     | `O(nlogn)`     | `O(n)`                      | 稳定           | 否       |
| 快速排序 | `O(nlogn)`     | `O(n^2)`       | 平均 `O(logn)`，最坏 `O(n)` | 不稳定         | 是       |
| 堆排序   | `O(nlogn)`     | `O(nlogn)`     | `O(1)`                      | 不稳定         | 是       |
| 计数排序 | `O(n+k)`       | `O(n+k)`       | `O(n+k)`                    | 稳定           | 否       |
| 桶排序   | 和数据分布有关 | 取决于桶内排序 | `O(n+k)`                    | 取决于桶内排序 | 否       |
| 基数排序 | `O(d(n+r))`    | `O(d(n+r))`    | `O(n+r)`                    | 稳定           | 否       |

几个高频追问：

- 快排为什么最坏是 `O(n^2)`？如何降低退化概率？可以随机选 pivot 或三数取中。
- 归并排序为什么稳定？因为合并时相等元素可以优先取左侧元素。
- 堆排序为什么不稳定？因为堆调整和交换可能打乱相等元素原有顺序。
- 插入排序什么时候表现好？数组基本有序且规模不大时。
- 计数排序、桶排序、基数排序为什么不是通用排序？它们依赖数据范围、分布或位数。

## Java 代码模板

排序面试最常手写的是快速排序和归并排序。快速排序要特别注意分区边界，下面是一个常见写法：

```java
void quickSort(int[] nums, int left, int right) {
    if (left >= right) {
        return;
    }
    int pivotIndex = partition(nums, left, right);
    quickSort(nums, left, pivotIndex - 1);
    quickSort(nums, pivotIndex + 1, right);
}

int partition(int[] nums, int left, int right) {
    int pivot = nums[right];
    int less = left;
    for (int i = left; i < right; i++) {
        if (nums[i] <= pivot) {
            swap(nums, less, i);
            less++;
        }
    }
    swap(nums, less, right);
    return less;
}

void swap(int[] nums, int i, int j) {
    int temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;
}
```

如果担心有序数组导致快排退化，可以在分区前随机选择 pivot，并把它交换到 `right` 位置。

```java
int randomIndex = left + new Random().nextInt(right - left + 1);
swap(nums, randomIndex, right);
```

## 过程示意和边界样例

快速排序的一次分区可以这样理解：

```text
原数组区间：[left ... right]
pivot：选择 nums[right]
less：指向“小于等于 pivot 区域”的下一个位置
i：从 left 扫到 right - 1

扫描结束后：
[left ... less - 1] <= pivot
[less ... right - 1] > pivot
把 pivot 换到 less，pivot 左右两边分别递归
```

几个边界样例建议手写前先过一遍：

- 空数组或只有一个元素：直接返回。
- 已经有序或逆序：固定选择首尾元素做 pivot 容易退化。
- 大量重复元素：普通二路分区可能不够理想，可以了解三路快排。
- 面试官问稳定性时，不要说快排稳定；普通快排交换元素会打乱相等元素顺序。

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 时间复杂度和空间复杂度面试指南-Big O、递归复杂度与常见误区.md -->

## [12] 时间复杂度和空间复杂度面试指南：Big O、递归复杂度与常见误区

---
title: 时间复杂度和空间复杂度面试指南：Big O、递归复杂度与常见误区
description: 时间复杂度和空间复杂度面试指南，系统讲解 Big O、循环复杂度、递归复杂度、空间复杂度、输入规模判断和算法面试常见复杂度误区。
category: 计算机基础
tag:
  - 算法
head:
  - - meta
    - name: keywords
      content: 时间复杂度,空间复杂度,Big O,递归复杂度,循环复杂度,算法复杂度,复杂度分析,算法面试题,LeetCode复杂度
---

复杂度分析是算法面试的第一道门。面试官不一定要求你把证明写得很严，但会希望你能说清：这段代码跑了多少轮、额外用了多少空间、输入规模变大后会发生什么。

先把一个边界讲清楚：复杂度分析通常看输入规模趋近很大时的增长趋势，不是精确运行时间。`O(n)` 不代表一定比 `O(nlogn)` 快，常数、数据规模、缓存命中和实现细节都会影响真实耗时。不过面试里先按 Big O 说清增长量级，再补一句实际场景的限制，就够用了。

## 面试考察重点

- 能根据循环、递归、数据结构操作判断时间复杂度。
- 能区分额外空间和输入本身占用的空间。
- 能说清最好、最坏、平均复杂度分别适合哪些算法。
- 遇到递归代码时，能用递归树或子问题规模分析。
- 不把 `HashMap`、排序、堆操作都默认当成 `O(1)`。

## 面试里怎么讲复杂度？

回答复杂度时，不要只报一个结论。更好的说法是“代码做了什么，因此复杂度是多少”。

比如两数之和：

```text
数组遍历一遍，每个元素在 HashMap 中做一次查询和一次插入，哈希表操作平均 O(1)，所以时间复杂度是 O(n)。额外使用了一个 HashMap 存元素到下标的映射，最坏会存 n 个元素，所以空间复杂度是 O(n)。
```

这个回答比单说 `O(n)` 更稳，因为它把推导过程讲出来了。面试官如果继续追问哈希表最坏情况，也有接话空间。

## 常见复杂度量级

| 复杂度     | 常见场景                                 | 面试备注                   |
| ---------- | ---------------------------------------- | -------------------------- |
| `O(1)`     | 数组按下标访问、栈顶操作、哈希表平均查询 | 哈希表最坏可能退化         |
| `O(logn)`  | 二分查找、堆上浮/下沉、平衡树查询        | 每轮把规模缩小一部分       |
| `O(n)`     | 单次遍历数组、链表、字符串               | 看是否真的只扫一遍         |
| `O(nlogn)` | 快排平均、归并排序、堆排序               | 排序题最常见量级           |
| `O(n^2)`   | 双重循环、枚举两两组合                   | 面试中要警惕是否能优化     |
| `O(2^n)`   | 子集枚举、部分回溯                       | 子集枚举的搜索空间是指数级 |
| `O(n!)`    | 全排列、旅行商暴力解                     | 只适合小规模输入           |

一般来说，算法题输入规模会暗示可接受复杂度：

| 输入规模    | 通常可接受的复杂度     |
| ----------- | ---------------------- |
| `n <= 20`   | 指数级、回溯、状态压缩 |
| `n <= 100`  | `O(n^3)` 有时可以      |
| `n <= 1000` | `O(n^2)` 常见          |
| `n <= 10^5` | `O(nlogn)` 或 `O(n)`   |
| `n >= 10^6` | 通常要接近 `O(n)`      |

这不是硬规则，但能帮你在面试里判断暴力解是否可能超时。

## 循环复杂度怎么判断？

普通循环看执行次数：

```java
for (int i = 0; i < n; i++) {
    // O(1)
}
```

这段是 `O(n)`。

嵌套循环不能只看有几层，要看每层真实次数：

```java
for (int i = 0; i < n; i++) {
    for (int j = i; j < n; j++) {
        // O(1)
    }
}
```

内层次数是 `n + (n - 1) + ... + 1`，也就是 `n(n + 1) / 2`，复杂度记作 `O(n^2)`。

如果循环变量每次翻倍，通常是 `O(logn)`：

```java
for (int i = 1; i < n; i *= 2) {
    // O(1)
}
```

还有一种容易误判的情况是双指针：

```java
while (left < n && right < n) {
    if (needMoveRight()) {
        right++;
    } else {
        left++;
    }
}
```

虽然是 `while` 里嵌了条件，但 `left` 和 `right` 都只单调递增，最多各移动 `n` 次，所以整体是 `O(n)`，不是 `O(n^2)`。

## 递归复杂度怎么判断？

递归复杂度可以先看两个问题：

1. 每层递归有多少个子问题？
2. 每层除了递归调用，还做了多少额外工作？

二分查找每次只进入一个子问题，规模减半：

```java
int binarySearch(int[] nums, int target, int left, int right) {
    if (left > right) {
        return -1;
    }
    int mid = left + (right - left) / 2;
    if (nums[mid] == target) {
        return mid;
    }
    if (nums[mid] < target) {
        return binarySearch(nums, target, mid + 1, right);
    }
    return binarySearch(nums, target, left, mid - 1);
}
```

递归深度是 `logn`，每层只做 `O(1)` 工作，所以时间复杂度是 `O(logn)`，递归栈空间是 `O(logn)`。

归并排序每层拆成两个子问题，每层合并总工作量是 `O(n)`，层数是 `logn`，所以时间复杂度是 `O(nlogn)`，额外数组空间是 `O(n)`。

再看一个反例：普通递归斐波那契。

```java
int fib(int n) {
    if (n <= 1) {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
}
```

它不是 `O(n)`，因为每次会继续拆成两个递归调用，很多子问题被重复计算，时间复杂度接近 `O(2^n)`。如果加记忆化数组，每个状态只算一次，时间复杂度就变成 `O(n)`，空间复杂度也是 `O(n)`。

## 空间复杂度看什么？

空间复杂度看算法运行过程中额外使用的空间，常见来源有：

- 新建数组、哈希表、队列、栈。
- 递归调用栈。
- 排序或合并时的辅助空间。
- 结果集是否算额外空间，要看题目要求。面试时可以主动说明。

比如反转链表的迭代写法只用了几个指针，空间复杂度是 `O(1)`。如果用递归反转，虽然没有显式创建数组，但递归栈深度是 `n`，空间复杂度是 `O(n)`。

## 常见易错点

- 排序不是免费的。先排序再双指针，时间复杂度通常至少是 `O(nlogn)`。
- `HashMap` 查询平均是 `O(1)`，但最坏情况不是。
- 递归没有显式创建集合，也可能有递归栈空间。
- 二维矩阵遍历通常是 `O(mn)`，不要顺手写成 `O(n)`。
- BFS 的队列空间不是常数，最坏可能存下一层大量节点。
- 回溯题的复杂度经常和结果数量有关，不能只看递归深度。

## 高频问题自测

- 为什么复杂度分析通常忽略常数？
- `O(n)` 一定比 `O(nlogn)` 快吗？
- 快排的平均和最坏时间复杂度分别是多少？
- 递归算法的空间复杂度怎么算？
- DFS 和 BFS 的时间复杂度为什么通常是 `O(V + E)`？
- 哈希表查询为什么平均是 `O(1)`？

## 推荐练习题

- [704. 二分查找](https://leetcode.cn/problems/二分查找面试题总结-左右边界、答案二分与 Java 模板/)
- [912. 排序数组](https://leetcode.cn/problems/sort-an-array/)
- [206. 反转链表](https://leetcode.cn/problems/reverse-linked-list/)
- [200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/)

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 双指针与滑动窗口面试题总结-数组、链表、字符串高频模板.md -->

## [13] 双指针与滑动窗口面试题总结：数组、链表、字符串高频模板

---
title: 双指针与滑动窗口面试题总结：数组、链表、字符串高频模板
description: 双指针与滑动窗口面试题总结，讲解左右指针、快慢指针、读写指针、固定窗口、可变窗口、Java 模板和 LeetCode 高频题。
category: 计算机基础
tag:
  - 算法
head:
  - - meta
    - name: keywords
      content: 双指针,滑动窗口,快慢指针,左右指针,读写指针,固定窗口,可变窗口,数组算法,链表算法,字符串算法,LeetCode
---

双指针和滑动窗口经常放在一起复习，但它们解决的问题不完全一样。双指针更像一种移动策略，滑动窗口则强调维护一个连续区间里的状态。

一个实用判断：如果题目关心两个位置之间的关系，先想双指针；如果题目关心连续子数组或连续子串，并且窗口内有条件要维护，先想滑动窗口。

## 面试考察重点

- 能区分左右指针、快慢指针、读写指针。
- 能维护滑动窗口里的计数、和、最大值或匹配情况。
- 能解释为什么指针只向一个方向移动，时间复杂度是 `O(n)`。
- 能处理空数组、单元素、重复元素和窗口收缩边界。

## 两者到底有什么区别？

双指针是一种更宽泛的写法，只要用两个指针协作推进，都可以叫双指针。滑动窗口更具体，它维护的是一个连续区间 `[left, right]`，窗口里通常有一组状态，比如字符计数、元素和、最大值、匹配数量。

| 问题特征                            | 更可能使用 |
| ----------------------------------- | ---------- |
| 有序数组里找两个数                  | 左右指针   |
| 链表找环、找中点、找倒数第 K 个节点 | 快慢指针   |
| 原地删除或覆盖元素                  | 读写指针   |
| 连续子数组/子串的最长、最短、计数   | 滑动窗口   |

面试时先把指针含义说出来，比直接写代码更稳。比如“`left` 表示窗口左边界，`right` 表示正在尝试加入窗口的字符”，后面收缩窗口就不会乱。

## 左右指针

左右指针常用于有序数组或两端收缩问题：

```java
int[] twoSumSorted(int[] nums, int target) {
    int left = 0;
    int right = nums.length - 1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) {
            return new int[] {left, right};
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    return new int[] {-1, -1};
}
```

如果数组无序，通常先排序，再用左右指针。排序后要记得复杂度变成 `O(nlogn)`。

左右指针能工作的原因，是每次比较后可以排除一部分答案。以有序数组两数之和为例：

- 当前和太小，说明左指针指向的数太小，右指针再往左只会更小，所以只能左指针右移。
- 当前和太大，说明右指针指向的数太大，左指针再往右只会更大，所以只能右指针左移。

三数之和也是同一个思路，只是先固定一个数，再在剩余区间里做两数之和。难点在去重：固定数要去重，左右指针找到答案后也要跳过重复值。

## 快慢指针

快慢指针常用于链表：

```java
boolean hasCycle(ListNode head) {
    ListNode slow = head;
    ListNode fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) {
            return true;
        }
    }
    return false;
}
```

链表题的重点不是代码长，而是指针含义稳定。`fast != null && fast.next != null` 的顺序也不能反。

快慢指针常见有两种速度差：

- `fast` 每次走 2 步，`slow` 每次走 1 步：用于环检测和找链表中点。
- 一个指针先走 `k` 步，另一个指针再一起走：用于找倒数第 `k` 个节点。

找倒数第 `k` 个节点时，两个指针之间保持 `k` 个节点的距离。当前面的指针走到链表末尾，后面的指针刚好停在目标位置。删除倒数第 `N` 个节点时，通常会加虚拟头节点，避免删除头节点时单独处理。

## 读写指针

读写指针常用于原地修改数组：

```java
int removeDuplicates(int[] nums) {
    if (nums.length == 0) {
        return 0;
    }
    int write = 1;
    for (int read = 1; read < nums.length; read++) {
        if (nums[read] != nums[read - 1]) {
            nums[write] = nums[read];
            write++;
        }
    }
    return write;
}
```

`read` 负责扫描原数组，`write` 指向下一个可写入位置。面试里最好先把这两个变量的含义说出来。

读写指针的核心是“读完整个数组，只把需要保留的内容写回前面”。这类题经常要求原地修改，返回新长度，而不是创建新数组。

判断写入时机时，可以问自己：当前 `read` 指向的元素是否应该保留？如果应该保留，就写到 `write`，然后 `write++`；如果不应该保留，只移动 `read`。

## 可变滑动窗口

以“无重复字符的最长子串”为例：

```java
int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> count = new HashMap<>();
    int left = 0;
    int ans = 0;
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        count.put(c, count.getOrDefault(c, 0) + 1);
        while (count.get(c) > 1) {
            char d = s.charAt(left);
            count.put(d, count.get(d) - 1);
            left++;
        }
        ans = Math.max(ans, right - left + 1);
    }
    return ans;
}
```

这个模板里，右指针负责扩大窗口，左指针负责在窗口不合法时收缩。每个字符最多进窗口一次、出窗口一次，所以时间复杂度是 `O(n)`。

可变窗口一般有一个固定节奏：

1. 右指针加入新元素，更新窗口状态。
2. 当窗口不满足条件时，不断移动左指针，并同步更新状态。
3. 在窗口满足题意的位置更新答案。

最长问题和最短问题的更新时机不一样：

- 求最长合法窗口：通常在窗口恢复合法后更新答案。
- 求最短满足条件窗口：通常在窗口已经满足条件时更新答案，然后继续收缩左边界。

比如“最小覆盖子串”里，窗口一旦覆盖了目标字符，就要先更新答案，再尝试缩小窗口；“最长无重复子串”里，窗口有重复字符时要先缩到合法，再更新答案。

## 固定滑动窗口

固定窗口适合“长度为 k 的子数组/子串”：

```java
int maxSum(int[] nums, int k) {
    int window = 0;
    for (int i = 0; i < k; i++) {
        window += nums[i];
    }
    int ans = window;
    for (int right = k; right < nums.length; right++) {
        window += nums[right];
        window -= nums[right - k];
        ans = Math.max(ans, window);
    }
    return ans;
}
```

固定窗口的重点是右侧进一个元素，左侧出一个元素。

固定窗口不用 `while` 收缩，因为窗口长度始终固定。它更像一个滚动统计：

- 新元素进入窗口。
- 离开窗口的旧元素被移除。
- 更新当前窗口答案。

如果窗口里还要维护最大值或最小值，普通变量不够用，通常要用单调队列。比如“滑动窗口最大值”中，队列里存可能成为最大值的下标，队首就是当前窗口最大值。

## 面试手写路径

双指针和滑动窗口题，面试里最怕指针含义写到一半变了。建议按这个顺序写：

1. 先判断题型：是两端收缩、快慢追赶、原地覆盖，还是连续窗口。
2. 明确指针含义：`left`、`right`、`slow`、`fast`、`write` 分别指向哪里。
3. 明确窗口状态：窗口内维护的是和、计数、最大值，还是匹配数量。
4. 明确移动条件：什么时候右指针扩张，什么时候左指针收缩。
5. 明确答案更新时机：合法后更新最长，满足条件时更新最短。

一句话区分最长和最短：**最长题通常先修复窗口再更新答案，最短题通常先记录答案再继续收缩。**

## 代表题精讲：最小覆盖子串

[76. 最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/) 是滑动窗口里最能考细节的一题。题目要求在 `s` 中找到最短子串，使它覆盖 `t` 中所有字符和对应次数。

这题的关键不是会不会用窗口，而是能不能说清两个计数：

- `need`：目标字符串 `t` 里每个字符需要多少个。
- `window`：当前窗口里每个字符已经有多少个。
- `valid`：有多少种字符已经满足所需次数。

当 `valid == need.size()` 时，说明当前窗口已经覆盖 `t`，这时要更新答案，并尝试收缩左边界。

```java
String minWindow(String s, String t) {
    Map<Character, Integer> need = new HashMap<>();
    Map<Character, Integer> window = new HashMap<>();
    for (char c : t.toCharArray()) {
        need.put(c, need.getOrDefault(c, 0) + 1);
    }

    int left = 0;
    int valid = 0;
    int start = 0;
    int minLen = Integer.MAX_VALUE;

    for (int right = 0; right < s.length(); right++) {
        char in = s.charAt(right);
        if (need.containsKey(in)) {
            window.put(in, window.getOrDefault(in, 0) + 1);
            if (window.get(in).equals(need.get(in))) {
                valid++;
            }
        }

        while (valid == need.size()) {
            if (right - left + 1 < minLen) {
                start = left;
                minLen = right - left + 1;
            }
            char out = s.charAt(left);
            left++;
            if (need.containsKey(out)) {
                if (window.get(out).equals(need.get(out))) {
                    valid--;
                }
                window.put(out, window.get(out) - 1);
            }
        }
    }

    return minLen == Integer.MAX_VALUE ? "" : s.substring(start, start + minLen);
}
```

这里有两个容易写错的点：

- `valid--` 要发生在减少 `window[out]` 之前，因为此时窗口还刚好满足条件。
- 更新答案要放在 `while (valid == need.size())` 里面，因为只有当前窗口已经覆盖 `t`，才有资格参与最短答案比较。

## 过程示意和边界样例

以“无重复字符的最长子串”为例，字符串 `abba` 的窗口变化如下：

| 右指针字符 | 加入后窗口 | 是否合法 | 左指针怎么动                          | 当前最长 |
| ---------- | ---------- | -------- | ------------------------------------- | -------- |
| `a`        | `a`        | 合法     | 不动                                  | 1        |
| `b`        | `ab`       | 合法     | 不动                                  | 2        |
| `b`        | `abb`      | 不合法   | 移走 `a` 后仍不合法，再移走第一个 `b` | 2        |
| `a`        | `ba`       | 合法     | 不动                                  | 2        |

滑动窗口建议至少检查这些边界：

| 输入                 | 重点                     |
| -------------------- | ------------------------ |
| 空字符串或空数组     | 是否直接返回 0           |
| 全部字符相同         | 左边界是否持续收缩       |
| 没有重复字符         | 答案是否能更新到整个长度 |
| 最优窗口在开头或结尾 | 更新答案的时机是否正确   |

常见错误写法：

```java
if (count.get(c) > 1) {
    left++; // 错：只移动一次不一定能恢复合法窗口
}
```

可变窗口收缩时通常要用 `while`，直到窗口重新满足条件。只移动一次，遇到 `abba`、`aaabc` 这类输入就容易错。

## 易错点

- 双指针题先明确两个指针的含义，不要边写边猜。
- 滑动窗口里，更新答案的时机要看题目问的是最长还是最短。
- 窗口收缩时，窗口内的计数、和、匹配数都要同步更新。
- 链表快慢指针要先判断 `fast` 和 `fast.next`。
- 三数之和这类题，排序后的去重要单独处理。

## 高频问题自测

- 为什么双指针题通常是 `O(n)`，而不是两层循环的 `O(n^2)`？
- 三数之和为什么需要排序？去重分别发生在哪几个位置？
- 快慢指针找链表中点时，偶数长度返回前中点还是后中点？
- 滑动窗口什么时候用 `if` 收缩，什么时候必须用 `while` 收缩？
- 最长窗口和最短窗口的答案更新时机有什么区别？

## 推荐练习题

- [26. 删除有序数组中的重复项](https://leetcode.cn/problems/remove-duplicates-from-sorted-array/)
- [15. 三数之和](https://leetcode.cn/problems/3sum/)
- [141. 环形链表](https://leetcode.cn/problems/linked-list-cycle/)
- [3. 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)
- [76. 最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/)

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 贪心算法面试题总结-区间贪心、跳跃游戏与证明思路.md -->

## [14] 贪心算法面试题总结：区间贪心、跳跃游戏与证明思路

---
title: 贪心算法面试题总结：区间贪心、跳跃游戏与证明思路
description: 贪心算法面试题总结，讲解贪心题型识别、排序贪心、区间贪心、跳跃游戏、贪心证明思路和 LeetCode 高频题。
category: 计算机基础
tag:
  - 算法
head:
  - - meta
    - name: keywords
      content: 贪心算法,贪心算法模板,区间贪心,排序贪心,跳跃游戏,贪心证明,LeetCode贪心,算法面试题
---

贪心算法的代码往往不长，难点在于为什么当前选择不会影响全局最优。面试里如果只写代码，不解释贪心策略，很容易被追问到卡住。

可以先记一个判断方式：如果问题可以通过排序或维护一个当前最优边界，每一步做出局部选择，并且这个选择不会破坏后续最优解，就可以尝试贪心。

## 面试考察重点

- 能找出贪心策略。
- 能用交换、反证或直觉边界说明策略合理。
- 能处理排序后的遍历条件。
- 能区分贪心和动态规划。

## 贪心题怎么想？

贪心题最怕“凭感觉选”。写代码前至少要说清两个东西：

1. 每一步贪的是什么，比如结束时间最早、当前能跳到最远、当前收益为正。
2. 为什么这个选择不会让后面变差。

证明不一定要很形式化，但要能讲出取舍。比如区间调度里，选择结束最早的区间，是因为它给后面留下的可选空间最大；如果选择一个结束更晚的区间，不会让答案变得更多。

## 常见题型

| 题型       | 贪心策略                       | 代表题                             |
| ---------- | ------------------------------ | ---------------------------------- |
| 分配问题   | 优先满足最容易满足的对象       | 分发饼干                           |
| 股票买卖   | 把所有正收益累加               | 买卖股票的最佳时机 II              |
| 跳跃问题   | 维护当前能到达的最远位置       | 跳跃游戏                           |
| 区间问题   | 按右端点或左端点排序           | 无重叠区间、用最少数量的箭引爆气球 |
| 字符串重构 | 维护剩余可用次数或最远覆盖位置 | 划分字母区间                       |

贪心常常和排序一起出现，因为排序能让“当前最优选择”变得明确。区间题经常按左端点或右端点排序，分配题经常把需求和资源都排序后用双指针匹配。

## 跳跃游戏模板

```java
boolean canJump(int[] nums) {
    int farthest = 0;
    for (int i = 0; i < nums.length; i++) {
        if (i > farthest) {
            return false;
        }
        farthest = Math.max(farthest, i + nums[i]);
    }
    return true;
}
```

`farthest` 表示当前能到达的最远位置。遍历到 `i` 时，如果 `i > farthest`，说明当前位置根本不可达。

这题的贪心点是：不关心具体从哪一步跳到 `i`，只关心当前能覆盖到的最远位置。只要当前位置在覆盖范围内，就可以用它继续更新覆盖范围。

“跳跃游戏 II”多了一个最少步数。它维护两个边界：

- `curEnd`：当前步数能覆盖到的最远位置。
- `farthest`：在当前覆盖范围内再跳一步能到的最远位置。

当遍历到 `curEnd` 时，说明当前步数的范围用完了，必须多跳一步，并把 `curEnd` 更新为 `farthest`。

## 区间贪心模板

以无重叠区间为例，按右端点升序排序，每次保留结束最早的区间：

```java
int eraseOverlapIntervals(int[][] intervals) {
    if (intervals.length == 0) {
        return 0;
    }
    Arrays.sort(intervals, Comparator.comparingInt(a -> a[1]));
    int count = 1;
    int end = intervals[0][1];
    for (int i = 1; i < intervals.length; i++) {
        if (intervals[i][0] >= end) {
            count++;
            end = intervals[i][1];
        }
    }
    return intervals.length - count;
}
```

结束越早，留给后面区间的空间越大，这是这类题的核心选择。

区间题最容易错在排序字段。几个常见选择：

- 要选最多不重叠区间：按右端点升序。
- 要合并区间：按左端点升序。
- 要用最少箭引爆气球：按右端点升序，尽量用当前箭覆盖更多气球。

如果一个贪心策略不好解释，先用小样例找反例。比如“每次选长度最短的区间”看起来合理，但并不能保证选出最多不重叠区间。

## 代表题精讲：用最少数量的箭引爆气球

[452. 用最少数量的箭引爆气球](https://leetcode.cn/problems/minimum-number-of-arrows-to-burst-balloons/) 是区间贪心的典型题。题目给出一组气球区间 `[start, end]`，一支箭射在某个坐标 `x` 上，只要 `start <= x <= end`，这个气球就会被引爆，要求用最少的箭引爆所有气球。

这题的贪心点是：**每次把箭射在当前可选区间的最右边界**。先按右端点升序排序，第一支箭放在第一个气球的右端点。后面的气球如果左端点 `<= arrow`，说明这支箭还能覆盖它；如果左端点 `> arrow`，说明当前箭已经够不到了，必须新增一支箭，并把新箭放在这个气球的右端点。

代码里要注意两个边界：空数组返回 `0`；排序比较器不要写成 `a[1] - b[1]`，极端坐标下可能溢出。

```java
int findMinArrowShots(int[][] points) {
    if (points.length == 0) {
        return 0;
    }
    Arrays.sort(points, (a, b) -> Integer.compare(a[1], b[1]));
    int arrows = 1;
    int arrow = points[0][1];
    for (int i = 1; i < points.length; i++) {
        if (points[i][0] > arrow) {
            arrows++;
            arrow = points[i][1];
        }
    }
    return arrows;
}
```

如果样例是 `[[10,16],[2,8],[1,6],[7,12]]`，按右端点排序后是 `[1,6]、[2,8]、[7,12]、[10,16]`。第一支箭放在 `6`，能覆盖前两个区间；遇到 `[7,12]` 时左端点已经大于 `6`，必须新增一支箭，放在 `12`，它又能覆盖 `[10,16]`。最终答案是 `2`。

## 贪心和动态规划怎么区分？

| 对比点       | 贪心                     | 动态规划               |
| ------------ | ------------------------ | ---------------------- |
| 决策方式     | 当前一步直接选           | 依赖前面多个状态       |
| 是否回看历史 | 通常不回看               | 需要状态转移           |
| 证明重点     | 当前选择不会破坏全局最优 | 最优子结构和重叠子问题 |
| 常见题       | 区间、跳跃、分配         | 背包、子序列、路径     |

如果当前选择看起来合理，但举个小反例就会错，那它更可能需要 DP 或搜索。

## 易错点

- 贪心题常常需要先排序，排序字段错了答案就错。
- 区间题要看边界是否允许相等，比如 `[1,2]` 和 `[2,3]` 是否重叠。
- 跳跃游戏 II 里“步数增加”的时机和当前覆盖边界有关。
- 贪心策略要能解释，不要只说“每次选最优”。

## 高频问题自测

- 贪心和动态规划怎么区分？
- 区间题为什么经常按右端点排序？
- 跳跃游戏里为什么只维护最远可达位置就够了？
- 贪心题怎样用交换或反证说明策略正确？
- 区间边界允许相等时，判断条件应该怎么写？

## 推荐练习题

- [455. 分发饼干](https://leetcode.cn/problems/assign-cookies/)
- [122. 买卖股票的最佳时机 II](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii/)
- [55. 跳跃游戏](https://leetcode.cn/problems/jump-game/)
- [45. 跳跃游戏 II](https://leetcode.cn/problems/jump-game-ii/)
- [435. 无重叠区间](https://leetcode.cn/problems/non-overlapping-intervals/)
- [763. 划分字母区间](https://leetcode.cn/problems/partition-labels/)

<!-- @include: @article-footer.snippet.md -->

