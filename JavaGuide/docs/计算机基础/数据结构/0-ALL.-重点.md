---
title: 数据结构 重点汇总
---

# 数据结构 重点汇总

> 从 0-ALL.md 筛选：面试常问与企业开发常用内容。

## TOC

1. LRU 缓存面试题总结：哈希表、双向链表与 LinkedHashMap (`LRU 缓存面试题总结-哈希表、双向链表与 LinkedHashMap.md`)
2. Trie 前缀树面试题总结：字典树原理、前缀匹配与 Java 实现 (`Trie 前缀树面试题总结-字典树原理、前缀匹配与 Java 实现.md`)
3. 并查集面试题总结：路径压缩、连通性与 Java 模板 (`并查集面试题总结-路径压缩、连通性与 Java 模板.md`)
4. 布隆过滤器详解（原理、实现、应用场景） (`布隆过滤器详解（原理、实现、应用场景）.md`)
5. 堆详解（最大堆、最小堆、优先队列） (`堆详解（最大堆、最小堆、优先队列）.md`)
6. 哈希表面试题总结：哈希冲突、扩容与 Java HashMap (`哈希表面试题总结-哈希冲突、扩容与 Java HashMap.md`)
7. 红黑树详解（性质、旋转、应用） (`红黑树详解（性质、旋转、应用）.md`)
8. 树结构详解（二叉树、AVL、B/B+树） (`树结构详解（二叉树、AVL、BB+树）.md`)
9. 跳表面试题总结：多级索引、范围查询与 Redis ZSet (`跳表面试题总结-多级索引、范围查询与 Redis ZSet.md`)
10. 图详解（DFS、BFS、最短路径） (`图详解（DFS、BFS、最短路径）.md`)
11. 线性数据结构详解（数组、链表、栈、队列） (`线性数据结构详解（数组、链表、栈、队列）.md`)

---

<!-- source: LRU 缓存面试题总结-哈希表、双向链表与 LinkedHashMap.md -->

## [1] LRU 缓存面试题总结：哈希表、双向链表与 LinkedHashMap

---
title: LRU 缓存面试题总结：哈希表、双向链表与 LinkedHashMap
description: LRU 缓存面试题总结，讲解 LRU 淘汰策略、哈希表加双向链表实现、Java LinkedHashMap 写法、复杂度和缓存场景。
category: 计算机基础
tag:
  - 数据结构
head:
  - - meta
    - name: keywords
      content: LRU缓存,LRU,缓存淘汰,哈希表,双向链表,LinkedHashMap,Java LRU,页面置换,数据结构面试题
---

LRU 是 Least Recently Used 的缩写，意思是最近最少使用。当缓存容量满了，需要淘汰最久没有被访问的数据。

面试里手写 LRU 很高频，因为它把哈希表和双向链表结合在一起：哈希表负责 `O(1)` 查找节点，双向链表负责 `O(1)` 移动节点和删除尾节点。

文章内容概览：

1. 什么是 LRU 缓存？
2. LRU 为什么适合做缓存淘汰？
3. 为什么需要哈希表 + 双向链表？
4. 如何手写 `get` 和 `put`？
5. Java `LinkedHashMap` 如何实现 LRU？
6. 真实工程里的 LRU 还要考虑什么？

![LRU 缓存通过哈希表和双向链表维护最近访问顺序](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/lru-cache.png)

## 什么是 LRU 缓存？

缓存的核心矛盾是：空间有限，但希望尽量把“未来还会被访问”的数据留在内存里。

问题是，程序并不知道未来。LRU 的做法是用“最近访问过”去近似预测“接下来还可能访问”。如果一个数据刚刚被访问过，它很可能还会再被访问；如果一个数据很久没被访问，缓存满的时候就优先淘汰它。

举个例子，容量为 2 的缓存按顺序访问：

```text
put(1, 1)
put(2, 2)
get(1)
put(3, 3)
```

在 `put(3, 3)` 之前，缓存里有 `1` 和 `2`。虽然 `1` 更早插入，但它刚被 `get(1)` 访问过，所以最近最少使用的是 `2`，最终应该淘汰 `2`。

这个例子也说明了一点：LRU 看的不是“谁最早插入”，而是“谁最久没被访问”。

## 为什么需要缓存淘汰策略？

缓存不是无限大的。无论是本地内存缓存、Redis、数据库 Buffer Pool，还是操作系统里的页面缓存，都要面对容量上限。

容量满了之后，如果没有淘汰策略，就只能拒绝新数据或者随机删数据。随机删当然简单，但可能把刚好很热的数据删掉，导致命中率变差。LRU 则利用访问时间顺序做了一个经验判断：长期没被碰过的数据，短期内再次访问的概率通常更低。

常见淘汰策略可以简单对比一下：

| 策略 | 淘汰依据             | 特点                                         |
| ---- | -------------------- | -------------------------------------------- |
| FIFO | 最早进入缓存的数据   | 实现简单，但不关心数据后来是否被频繁访问     |
| LRU  | 最久没有被访问的数据 | 适合有时间局部性的访问模式                   |
| LFU  | 访问次数最少的数据   | 适合长期热点明显的场景，但需要维护频率信息   |
| TTL  | 过期时间             | 适合数据有明确有效期的场景，不等同于容量淘汰 |

LRU 之所以常被拿来面试，是因为它既有真实工程背景，又能很好地考察数据结构组合。

## 面试考察重点

- 能说清为什么只用哈希表或只用链表都不够。
- 能写 `get` 和 `put`。
- 能解释双向链表头尾分别代表什么。
- 能处理容量满、更新已有 key、删除尾节点等边界。
- 能知道 Java `LinkedHashMap` 可以实现 LRU。

## LRU 的访问顺序怎么维护？

LRU 缓存里，每一次访问都会改变数据的新旧程度。

通常我们会约定：

- 链表头部表示最近使用的数据。
- 链表尾部表示最久未使用的数据。
- `get(key)` 命中后，把对应节点移动到头部。
- `put(key, value)` 如果是新 key，把新节点插入头部。
- `put(key, value)` 如果是已有 key，更新 value 后也要移动到头部。
- 容量超过上限时，删除尾部节点。

这里最容易漏的是 `get()`。很多同学会觉得 `get()` 只是读数据，不该改结构。但对 LRU 来说，读也是一次访问；只要命中缓存，这个 key 的“最近使用时间”就变新了。

## 数据结构设计

| 组件                     | 作用                                             |
| ------------------------ | ------------------------------------------------ |
| `HashMap<Integer, Node>` | 根据 key 快速找到链表节点                        |
| 双向链表                 | 按访问时间排序，头部是最近使用，尾部是最久未使用 |
| 虚拟头尾节点             | 简化插入和删除边界                               |

访问一个 key 后，需要把它移动到链表头部。插入新 key 时，也放到头部。容量超限时，删除尾部前一个节点。

为什么必须两个结构配合？

只用哈希表，可以 `O(1)` 找到 value，但不知道哪个 key 最久没用。你还得额外维护访问顺序。

只用链表，可以维护访问顺序，尾部就是该淘汰的节点。但每次根据 key 查找节点都要从头扫到尾，复杂度是 `O(n)`。

哈希表 + 双向链表刚好补齐彼此短板：

- 哈希表让我们能根据 key 直接定位链表节点。
- 双向链表让我们能快速移动节点、删除尾部节点。
- 节点里同时存 key 和 value，是为了淘汰尾节点时能从哈希表里删除对应 key。

## 面试手写路径

LRU 的代码细节多，建议不要一上来就写完整类。面试时可以先把操作拆开：

1. 先定义链表顺序：头部表示最近使用，尾部表示最久未使用。
2. 再定义 `get`：查不到返回 `-1`，查到后移动到头部。
3. 再定义 `put`：已有 key 更新值并移动到头部；新 key 插入头部。
4. 最后处理淘汰：超过容量后删除尾部前一个节点，并从哈希表删除。
5. 把链表操作封装成 `addToHead`、`remove`、`moveToHead`、`removeTail`。

这样写的好处是，`get` 和 `put` 都只组合几个基础链表操作，不会在主流程里反复改指针，出错概率低很多。

## 为什么用双向链表？

把一个节点移动到头部，需要先把它从原位置摘下来，再插到头节点后面。

如果用单向链表，删除当前节点时必须知道它的前驱节点。哈希表里即使能直接找到当前节点，也找不到它前面的节点，还是要从头遍历。

双向链表的节点同时有 `prev` 和 `next`，删除任意节点只需要改四个指针：

```java
node.prev.next = node.next;
node.next.prev = node.prev;
```

这就是 LRU 要用双向链表的关键原因：它不只是要删除尾节点，还要在 `get()` 命中和 `put()` 更新已有 key 时，把任意节点移动到头部。

虚拟头尾节点也很重要。有了 `head` 和 `tail` 两个哨兵节点，插入头部、删除尾部、处理空链表时都能走同一套代码，不需要到处写 `null` 判断。

## 手写 LRU

```java
class LRUCache {
    private final int capacity;
    private final Map<Integer, Node> map = new HashMap<>();
    private final Node head = new Node(0, 0);
    private final Node tail = new Node(0, 0);

    LRUCache(int capacity) {
        this.capacity = capacity;
        head.next = tail;
        tail.prev = head;
    }

    int get(int key) {
        Node node = map.get(key);
        if (node == null) {
            return -1;
        }
        moveToHead(node);
        return node.value;
    }

    void put(int key, int value) {
        Node node = map.get(key);
        if (node != null) {
            node.value = value;
            moveToHead(node);
            return;
        }
        Node newNode = new Node(key, value);
        map.put(key, newNode);
        addToHead(newNode);
        if (map.size() > capacity) {
            Node removed = removeTail();
            map.remove(removed.key);
        }
    }

    private void moveToHead(Node node) {
        remove(node);
        addToHead(node);
    }

    private void addToHead(Node node) {
        node.prev = head;
        node.next = head.next;
        head.next.prev = node;
        head.next = node;
    }

    private void remove(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private Node removeTail() {
        Node node = tail.prev;
        remove(node);
        return node;
    }

    private static class Node {
        int key;
        int value;
        Node prev;
        Node next;

        Node(int key, int value) {
            this.key = key;
            this.value = value;
        }
    }
}
```

`get` 和 `put` 的时间复杂度都是 `O(1)`，空间复杂度是 `O(capacity)`。

## 操作过程示意

假设容量为 2，按顺序执行：

```text
put(1, 1)
put(2, 2)
get(1)
put(3, 3)
```

链表状态变化如下，左侧表示最近使用：

| 操作        | 链表状态 | 说明                     |
| ----------- | -------- | ------------------------ |
| 初始状态    | 空       | 虚拟头尾相连，缓存为空   |
| `put(1, 1)` | `1`      | 新节点插入头部           |
| `put(2, 2)` | `2 -> 1` | `2` 是最近使用           |
| `get(1)`    | `1 -> 2` | 访问 `1` 后移动到头部    |
| `put(3, 3)` | `3 -> 1` | 容量超限，淘汰尾部的 `2` |

这张表能帮助检查两个点：访问已有节点要更新使用顺序；淘汰节点时，删除的是最久未使用的尾部节点，而不是刚插入的新节点。

## LinkedHashMap 实现

Java 的 `LinkedHashMap` 支持按访问顺序维护元素：

```java
class LRUCacheWithLinkedHashMap extends LinkedHashMap<Integer, Integer> {
    private final int capacity;

    LRUCacheWithLinkedHashMap(int capacity) {
        super(capacity, 0.75f, true);
        this.capacity = capacity;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
        return size() > capacity;
    }
}
```

构造函数里的第三个参数 `accessOrder` 设置为 `true`，表示按照访问顺序排序，而不是插入顺序。

`LinkedHashMap` 官方文档里也专门提到过这种 access-order 模式适合构建 LRU 缓存。这里有两个点要记住：

1. `accessOrder = false` 时，遍历顺序是插入顺序；`accessOrder = true` 时，遍历顺序是访问顺序。
2. `removeEldestEntry()` 会在插入新映射后被调用，返回 `true` 时删除最旧的 entry。

不过，`LinkedHashMap` 不是线程安全的。如果要在多线程环境里直接用它做本地缓存，需要自己加锁，或者选择成熟缓存库。

## LRU 和 Redis 有什么关系？

Redis 作为缓存使用时，也需要在内存达到 `maxmemory` 上限后执行淘汰策略。Redis 支持 `allkeys-lru`、`volatile-lru` 等策略：

- `allkeys-lru`：从所有 key 里淘汰最近最少使用的 key。
- `volatile-lru`：只从设置了过期时间的 key 里淘汰最近最少使用的 key。

不过 Redis 的 LRU 不是面试手写题里的“精确 LRU”。为了节省内存和 CPU，Redis 使用的是近似 LRU：随机采样一小批 key，从中挑出最久没访问的 key 淘汰。采样数量可以通过 `maxmemory-samples` 调整。

这也能帮助我们理解真实工程和面试题的区别：面试题通常要求用哈希表 + 双向链表实现精确 LRU；工程系统会根据内存、吞吐、并发和命中率做折中。

## 工程场景

- 本地缓存淘汰。
- 操作系统页面置换。
- 热点数据缓存。
- 网关、客户端 SDK 或中间件里的小容量结果缓存。

真实工程里还要考虑线程安全、过期时间、最大内存、统计指标和淘汰回调。面试手写 LRU 主要考数据结构组合，不需要把这些都写进代码。

如果是 Java 项目里的本地缓存，很多时候不会自己手写 LRU，而是直接用 Caffeine 这类缓存库。原因也很现实：工程缓存不只要容量淘汰，还要处理过期、并发、加载、统计、异步刷新、不同 entry 的权重等问题。Caffeine 官方文档里就把淘汰分成基于大小、基于时间、基于引用等多类。

## 面试追问

| 追问                           | 回答重点                                                               |
| ------------------------------ | ---------------------------------------------------------------------- |
| 为什么不用单独的 `HashMap`？   | `HashMap` 能查值，但不知道谁最久没被使用                               |
| 为什么不用单独的链表？         | 链表能维护顺序，但按 key 查找节点需要 `O(n)`                           |
| 为什么要用双向链表？           | 删除任意节点时需要同时连接前驱和后继，单向链表无法 `O(1)` 找到前驱     |
| 为什么要用虚拟头尾节点？       | 统一空链表、头节点、尾节点的插入删除逻辑，减少分支判断                 |
| `LinkedHashMap` 怎么实现 LRU？ | 构造时开启 `accessOrder`，重写 `removeEldestEntry` 控制容量            |
| 真实缓存还要考虑什么？         | 线程安全、过期时间、最大内存、淘汰回调、命中率统计和缓存击穿等工程问题 |

## 易错点

- 更新已有 key 时，也要移动到头部。
- 删除尾节点后，别忘了从哈希表里删除 key。
- 双向链表删除节点时要同时改前后两个指针。
- 虚拟头尾节点可以减少空链表边界判断。
- `LinkedHashMap` 的 `accessOrder` 要设为 `true`。

## 高频问题自测

- LRU 为什么需要哈希表和双向链表配合？
- `get` 操作为什么也要移动节点？
- 更新已有 key 时，为什么不能只改 value？
- 淘汰尾节点后，为什么还要从哈希表删除 key？
- `LinkedHashMap` 的插入顺序和访问顺序有什么区别？

## 推荐练习题

- [146. LRU 缓存](https://leetcode.cn/problems/LRU 缓存面试题总结-哈希表、双向链表与 LinkedHashMap/)
- [460. LFU 缓存](https://leetcode.cn/problems/lfu-cache/)

## 参考资料

- [Java SE 17 API：LinkedHashMap](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/LinkedHashMap.html)
- [Redis Docs：Key eviction](https://redis.io/docs/latest/develop/reference/eviction/)
- [Operating Systems: Three Easy Pieces](https://pages.cs.wisc.edu/~remzi/OSTEP/)
- [Caffeine Wiki：Eviction](https://github.com/ben-manes/caffeine/wiki/Eviction)

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: Trie 前缀树面试题总结-字典树原理、前缀匹配与 Java 实现.md -->

## [2] Trie 前缀树面试题总结：字典树原理、前缀匹配与 Java 实现

---
title: Trie 前缀树面试题总结：字典树原理、前缀匹配与 Java 实现
description: Trie 前缀树面试题总结，讲解字典树节点结构、插入、查询、前缀匹配、复杂度、搜索提示、敏感词过滤和 LeetCode 高频题。
category: 计算机基础
tag:
  - 数据结构
head:
  - - meta
    - name: keywords
      content: Trie,前缀树,字典树,前缀匹配,字符串算法,搜索提示,敏感词过滤,Java Trie,LeetCode Trie,数据结构面试题
---

Trie，也叫前缀树或字典树，适合处理大量字符串的前缀匹配问题。搜索提示、词典查询、敏感词过滤、路由前缀匹配，都能看到它的影子。

它的核心思路很直接：把字符串按字符拆开，共享相同前缀。比如 `app`、`apple`、`apply` 会共用 `a -> p -> p` 这条路径。

文章内容概览：

1. 什么是 Trie？
2. Trie 为什么适合前缀匹配？
3. Trie 节点怎么设计？
4. Trie 的插入、查询和前缀查询怎么写？
5. Trie 和哈希表应该怎么选？

![Trie 树按字符路径组织字符串集合的结构示意图](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/trie.png)

## 什么是 Trie？

Trie 是一种专门面向字符串集合的数据结构。和二叉搜索树不同，Trie 的节点通常不靠“大小关系”组织，而是靠“字符路径”组织。

可以这样理解：

- 根节点不代表任何字符，只是所有字符串的入口。
- 从根节点出发，每向下一层走一步，就匹配字符串中的一个字符。
- 从根节点到某个节点经过的字符连起来，就是一个前缀。
- 如果某个节点被标记为单词结尾，说明从根到这个节点形成的字符串是一个完整单词。

举个例子，插入 `app`、`apple`、`apply` 之后，它们会共享 `a -> p -> p` 这段路径。`app` 对应的最后一个 `p` 节点需要标记为单词结尾，否则 Trie 只能知道 `app` 是某些单词的前缀，不能知道它本身也是一个完整单词。

这就是 `isWord` 变量存在的意义。没有它，就无法区分“这个路径只是前缀”还是“这个路径已经构成一个词”。

## Trie 为什么适合前缀匹配？

哈希表很适合判断一个完整字符串是否存在，比如查询 `apple` 在不在集合里。但如果问题变成“找出所有以 `app` 开头的词”，哈希表就不那么顺手了：除非额外维护前缀索引，否则需要扫描大量 key。

Trie 的优势在于，前缀天然对应树上的一条路径。查询 `app` 前缀时，只需要从根节点依次走 `a`、`p`、`p`：

- 如果中途某个字符路径不存在，说明没有任何单词以 `app` 为前缀。
- 如果能走到最后一个 `p`，说明这个节点下面的所有单词都以 `app` 开头。

所以，Trie 的前缀查询复杂度主要和前缀长度有关，而不是和词典中有多少个单词直接相关。这个特点在搜索提示、路由最长前缀匹配、词典过滤这类场景里很有用。

## 面试考察重点

- 能说清 Trie 为什么适合前缀查询。
- 能写插入、完整单词查询、前缀查询。
- 能分析时间复杂度和字符串长度有关。
- 能说明 Trie 的空间开销可能比较大。
- 能和哈希表做对比。

## 节点结构

Trie 节点通常包含两类信息：

1. 指向子节点的引用，用来继续匹配下一个字符。
2. 是否为完整单词结尾的标记。

如果只处理小写英文字母，可以用长度为 26 的数组：

```java
class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isWord;
}
```

如果字符集不固定，可以用 `Map<Character, TrieNode>`，空间更灵活，但每次访问有哈希表成本。

这两种写法没有绝对好坏：

| 节点实现方式                             | 优点                       | 缺点                     |
| ---------------------------------------- | -------------------------- | ------------------------ |
| `TrieNode[] children = new TrieNode[26]` | 访问快，适合固定小字符集   | 空节点多时比较浪费空间   |
| `Map<Character, TrieNode>`               | 只存实际出现的字符，更灵活 | 有额外对象和哈希访问成本 |

面试手写代码时，如果题目明确只有小写英文字母，用数组最清楚；如果字符集包含大小写、中文、路径片段或任意字符，用 `Map` 更稳妥。

## 基础实现

下面这个模板假设字符串只包含小写英文字母：

```java
class Trie {
    private final TrieNode root = new TrieNode();

    public void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            int index = c - 'a';
            if (node.children[index] == null) {
                node.children[index] = new TrieNode();
            }
            node = node.children[index];
        }
        node.isWord = true;
    }

    public boolean search(String word) {
        TrieNode node = find(word);
        return node != null && node.isWord;
    }

    public boolean startsWith(String prefix) {
        return find(prefix) != null;
    }

    private TrieNode find(String text) {
        TrieNode node = root;
        for (char c : text.toCharArray()) {
            int index = c - 'a';
            if (node.children[index] == null) {
                return null;
            }
            node = node.children[index];
        }
        return node;
    }
}
```

插入和查询的逻辑其实是同一条主线：从根节点开始，按字符一层一层往下走。插入时如果路径不存在就创建节点；查询时如果路径不存在就返回 `false`。区别只在最后一步：`search()` 要检查 `isWord`，`startsWith()` 只要能走完整个前缀即可。

## 删除操作怎么理解？

Trie 的删除比插入和查询更容易写错，因为删除一个单词时不能简单地把整条路径都删掉。

比如 Trie 里同时有 `app` 和 `apple`，删除 `app` 时，只能取消 `app` 最后一个 `p` 节点上的 `isWord` 标记，不能把 `a -> p -> p` 这条路径删掉，否则 `apple` 也会被破坏。

真正删除节点时，需要从单词末尾往回看：如果某个节点没有子节点，并且也不是其他单词的结尾，才可以被删除。面试中如果没有明确要求删除，一般先把插入、完整查询、前缀查询写稳。

## 复杂度

设字符串长度为 `L`：

- 插入：`O(L)`
- 查询完整单词：`O(L)`
- 查询前缀：`O(L)`

空间复杂度取决于节点数量。最坏情况下，如果字符串几乎没有公共前缀，空间开销会接近所有字符数量之和。

如果还要枚举某个前缀下的所有单词，复杂度就不只是 `O(L)` 了。定位前缀节点需要 `O(L)`，后面还要遍历这个节点下面的子树，额外成本和返回结果数量、子树规模有关。

## Trie 和哈希表怎么选？

| 场景             | Trie               | 哈希表       |
| ---------------- | ------------------ | ------------ |
| 完整字符串查询   | 可以做，但空间更大 | 更直接       |
| 前缀查询         | 很适合             | 需要额外处理 |
| 按前缀枚举所有词 | 很适合             | 不方便       |
| 字符集很大       | 需要优化节点结构   | 更省心       |

如果只是判断一个词是否存在，哈希表通常更简单。如果要频繁查前缀，Trie 更合适。

还有一个容易忽略的差异：哈希表的完整匹配通常更省空间、更通用；Trie 则把公共前缀显式存成路径，因此能自然支持前缀查询、按前缀枚举、最长前缀匹配。二者解决的问题重心不同，不是谁完全替代谁。

## 工程场景

- 搜索框自动补全：根据用户输入前缀找到候选词。
- 敏感词匹配：Trie 可以配合 AC 自动机做多模式匹配。
- IP 路由匹配：最长前缀匹配可以借鉴 Trie 思路。
- 词典校验：快速判断单词或前缀是否存在。

实际工程中还会看到一些 Trie 的变体：

- **压缩 Trie / Radix Tree**：把只有一个子节点的连续路径压缩成一段字符串，减少节点数量。
- **Ternary Search Trie（三向单词查找树）**：每个节点通过小于、等于、大于三个方向组织字符，在空间和查询灵活性之间做折中。
- **AC 自动机**：在 Trie 的基础上增加失败指针，用来做多模式字符串匹配。

这些变体不需要一开始就全背下来，但要知道 Trie 的基础思想是它们的共同起点：用路径表示字符串，用共享路径复用公共前缀。

## 易错点

- `isWord` 不能省，否则无法区分 `app` 和 `apple`。
- 字符集不一定只有小写字母，面试时要根据题目调整。
- 删除单词比插入查询复杂，需要判断节点是否还能被其他单词复用。
- Trie 查询复杂度和字符串长度有关，不直接和词典大小成正比。

## 推荐练习题

- [208. 实现 Trie](https://leetcode.cn/problems/implement-trie-prefix-tree/)
- [211. 添加与搜索单词](https://leetcode.cn/problems/design-add-and-search-words-data-structure/)
- [212. 单词搜索 II](https://leetcode.cn/problems/word-search-ii/)
- [648. 单词替换](https://leetcode.cn/problems/replace-words/)

## 参考资料

- [Algorithms, 4th Edition：Tries](https://algs4.cs.princeton.edu/52trie/)
- [Algorithms, 4th Edition：TrieST API](https://algs4.cs.princeton.edu/code/javadoc/edu/princeton/cs/algs4/TrieST.html)
- [Stanford CS166：Tries and Suffix Trees](https://web.stanford.edu/class/archive/cs/cs166/cs166.1216/lectures/16/Slides16.pdf)

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 并查集面试题总结-路径压缩、连通性与 Java 模板.md -->

## [3] 并查集面试题总结：路径压缩、连通性与 Java 模板

---
title: 并查集面试题总结：路径压缩、连通性与 Java 模板
description: 并查集面试题总结，讲解 Union Find、find、union、路径压缩、按大小合并、连通性、判环、省份数量和 LeetCode 高频题。
category: 计算机基础
tag:
  - 数据结构
head:
  - - meta
    - name: keywords
      content: 并查集,Union Find,路径压缩,按大小合并,连通性,图算法,判环,省份数量,Java并查集,LeetCode
---

并查集专门解决“分组”和“连通性”问题。两个元素是否属于同一组？合并两个集合后还有几个连通分量？图里加一条边是否会成环？这些都可以用并查集处理。

面试里它的代码不长，但 `find` 写不好会直接影响复杂度。

文章内容概览：

1. 什么是并查集？
2. 并查集如何用数组表示集合？
3. `find`、`union`、`connected` 分别做什么？
4. 路径压缩和按大小合并为什么能提速？
5. 并查集适合哪些连通性问题？

![并查集用父节点指针表示连通分量的森林结构](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/union-find.png)

## 什么是并查集？

并查集（Disjoint Set Union，DSU，也叫 Union Find）维护的是一组互不相交的集合。它最擅长回答两类问题：

1. **查询**：两个元素现在是不是属于同一个集合？
2. **合并**：把两个元素所在的集合合并成一个集合。

它不关心集合内部的完整结构，也不关心两个点之间具体经过哪些边。比如在社交关系里，并查集可以快速告诉你 A 和 B 是否属于同一个关系网络；但它不会告诉你 A 到 B 的最短路径是什么。

这也是并查集和 BFS/DFS 的区别：BFS/DFS 更像是每次沿着图现场搜索；并查集则是把连通关系在合并过程中维护起来，后续查询直接看两个元素的代表节点是否一致。

## 并查集如何表示集合？

并查集通常用一个 `parent` 数组表示若干棵树组成的森林：

- `parent[x]` 表示元素 `x` 的父节点。
- 如果 `parent[x] == x`，说明 `x` 是所在集合的根节点。
- 一个集合只需要用根节点作为代表。

初始化时，每个元素都是一个单独的集合，所以每个元素的父节点都是自己：

```text
parent[0] = 0
parent[1] = 1
parent[2] = 2
...
```

执行 `union(0, 1)` 后，可以让 `1` 的根节点挂到 `0` 的根节点下面。此时 `0` 和 `1` 就属于同一个集合。继续执行 `union(1, 2)` 时，虽然传入的是 `1` 和 `2`，但真正合并的是 `1` 的根节点和 `2` 的根节点。

所以，并查集里的关键不是“当前节点的父节点是谁”，而是“沿着父节点一直往上走，最终根节点是谁”。`find(x)` 做的就是这件事。

## 三个核心操作

并查集常见操作可以概括为三个：

| 操作              | 作用                                      |
| ----------------- | ----------------------------------------- |
| `find(x)`         | 找到 `x` 所在集合的代表节点，也就是根节点 |
| `union(a, b)`     | 合并 `a` 和 `b` 所在的两个集合            |
| `connected(a, b)` | 判断 `a` 和 `b` 的代表节点是否相同        |

如果两个元素的根节点相同，说明它们已经属于同一个集合；如果根节点不同，`union` 就把其中一个根节点挂到另一个根节点下面。

## 面试考察重点

- 能写 `find` 和 `union`。
- 能解释路径压缩的作用。
- 能用并查集统计连通分量。
- 能处理图中判环、朋友圈、省份数量、等式关系。
- 能说明并查集适合动态合并，不适合频繁删除。

## 从 Quick Find 到 Quick Union

理解并查集时，可以先看两个极端版本：

- **Quick Find**：数组里直接存每个元素所属集合编号。查询两个元素是否同组很快，但合并两个集合时，需要扫描整个数组修改集合编号。
- **Quick Union**：数组里存父节点，通过根节点代表集合。合并时只改一个根节点的父指针，但如果树很高，`find` 会变慢。

面试和刷题里常用的是 Quick Union 的优化版本：**路径压缩 + 按大小/秩合并**。

- **路径压缩**：每次 `find(x)` 时，把沿途节点直接挂到根节点下面，后续再查这些节点会更快。
- **按大小合并**：合并两个集合时，把小树挂到大树下面，尽量避免树长得太高。

这两个优化配合起来，能把并查集的多次操作压到非常接近常数时间。

## 基础模板

```java
class UnionFind {
    private final int[] parent;
    private final int[] size;
    private int count;

    UnionFind(int n) {
        parent = new int[n];
        size = new int[n];
        count = n;
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            size[i] = 1;
        }
    }

    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    boolean union(int a, int b) {
        int rootA = find(a);
        int rootB = find(b);
        if (rootA == rootB) {
            return false;
        }
        if (size[rootA] < size[rootB]) {
            parent[rootA] = rootB;
            size[rootB] += size[rootA];
        } else {
            parent[rootB] = rootA;
            size[rootA] += size[rootB];
        }
        count--;
        return true;
    }

    boolean connected(int a, int b) {
        return find(a) == find(b);
    }

    int count() {
        return count;
    }
}
```

`parent[x]` 表示 `x` 的父节点。根节点的父节点是自己。路径压缩会让查找路径上的节点直接挂到根节点下面，后续查询更快。

这份模板里有两个细节值得单独看：

1. `find()` 中的 `parent[x] = find(parent[x])` 是路径压缩。递归返回根节点后，顺手把 `x` 直接连到根节点。
2. `union()` 中通过 `size` 决定谁挂到谁下面，这是按大小合并。这样可以减少树的高度增长。

`count` 表示当前还有多少个连通分量。每次 `union()` 真正合并了两个原本不连通的集合，`count` 才减 1；如果两个元素本来就连通，不能重复减少。

## 复杂度

使用路径压缩和按大小合并后，并查集单次操作的均摊复杂度是 `O(α(n))`，其中 `α(n)` 是反阿克曼函数，增长极慢。实际面试里一般说“近似常数时间”即可。

空间复杂度是 `O(n)`，主要来自 `parent` 和 `size` 数组。

## 典型场景

| 场景                 | 处理方式                               |
| -------------------- | -------------------------------------- |
| 判断两个节点是否连通 | 比较 `find(a)` 和 `find(b)`            |
| 合并两个集合         | `union(a, b)`                          |
| 统计连通分量个数     | 初始化为 `n`，每次成功合并减 1         |
| 判断无向图是否有环   | 如果一条边两端已连通，再加边就成环     |
| 等式方程             | 先合并相等关系，再检查不等关系是否冲突 |

并查集特别适合“关系不断合并、查询是否同组”的问题，例如省份数量、冗余连接、账户合并、最小生成树中的 Kruskal 算法等。

不过，并查集不擅长处理删除关系。因为一旦两个集合合并，内部哪些边让它们连通的信息通常已经被压缩掉了。删除一条边后，集合是否仍然连通并不能靠简单修改 `parent` 数组得到。

## 易错点

- `find` 里要返回根节点，不是返回父节点。
- 路径压缩不要写丢递归返回值。
- `union` 时只有两个集合原本不连通，连通分量数量才减 1。
- 并查集适合合并，不擅长删除关系。
- 二维网格题需要把 `(i, j)` 映射成一维编号，例如 `i * cols + j`。

## 推荐练习题

- [547. 省份数量](https://leetcode.cn/problems/number-of-provinces/)
- [684. 冗余连接](https://leetcode.cn/problems/redundant-connection/)
- [990. 等式方程的可满足性](https://leetcode.cn/problems/satisfiability-of-equality-equations/)
- [1319. 连通网络的操作次数](https://leetcode.cn/problems/number-of-operations-to-make-network-connected/)
- [200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/)

## 参考资料

- [Algorithms, 4th Edition：Union-Find](https://algs4.cs.princeton.edu/15uf/)
- [Algorithms, 4th Edition：WeightedQuickUnionPathCompressionUF](https://algs4.cs.princeton.edu/15uf/WeightedQuickUnionPathCompressionUF.java.html)
- [CP-Algorithms：Disjoint Set Union](https://cp-algorithms.com/data_structures/disjoint_set_union.html)

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 布隆过滤器详解（原理、实现、应用场景）.md -->

## [4] 布隆过滤器详解（原理、实现、应用场景）

---
title: 布隆过滤器详解（原理、实现、应用场景）
description: 解析 Bloom Filter 的原理与误判特性，结合哈希与位数组实现，适用于海量数据去重与缓存穿透防护。
category: 计算机基础
tag:
  - 数据结构
head:
  - - meta
    - name: keywords
      content: 布隆过滤器,Bloom Filter,误判率,哈希函数,位数组,去重,缓存穿透
---

# 布隆过滤器

布隆过滤器相信大家没用过的话，也已经听过了。

布隆过滤器主要是为了解决海量数据的存在性问题。对于海量数据中判定某个数据是否存在且容忍轻微误差这一场景（比如缓存穿透、海量数据去重）来说，非常适合。

文章内容概览：

1. 什么是布隆过滤器？
2. 布隆过滤器的原理介绍。
3. 布隆过滤器使用场景。
4. 通过 Java 编程手动实现布隆过滤器。
5. 利用 Google 开源的 Guava 中自带的布隆过滤器。
6. Redis 中的布隆过滤器。

## 什么是布隆过滤器？

首先，我们需要了解布隆过滤器的概念。

布隆过滤器（Bloom Filter，BF）是一个叫做 Bloom 的老哥于 1970 年提出的。我们可以把它看作由二进制向量（或者说位数组）和一系列随机映射函数（哈希函数）两部分组成的数据结构。相比于我们平时常用的 List、Map、Set 等数据结构，它占用空间更少并且效率更高，但是缺点是其返回的结果是概率性的，而不是非常准确的。理论情况下添加到集合中的元素越多，误报的可能性就越大。并且，存放在布隆过滤器的数据不容易删除。

Bloom Filter 会使用一个较大的 bit 数组来保存所有的数据，数组中的每个元素都只占用 1 bit，并且每个元素只能是 0 或者 1（代表 false 或者 true），这也是 Bloom Filter 节省内存的核心所在。这样来算的话，申请一个 100w 个元素的位数组只占用 1000000 Bit / 8 = 125000 Byte = 125000 / 1024 KB ≈ 122 KB 的空间。

![布隆过滤器使用的位数组结构](https://oss.javaguide.cn/github/javaguide/计算机基础/算法/bloom-filter-bit-table.png)

总结：**一个名叫 Bloom 的人提出了一种来检索元素是否在给定大集合中的数据结构，这种数据结构是高效且性能很好的，但缺点是具有一定的错误识别率和删除难度。并且，理论情况下，添加到集合中的元素越多，误报的可能性就越大。**

## 布隆过滤器的原理介绍

**当一个元素加入布隆过滤器中的时候，会进行如下操作：**

1. 使用布隆过滤器中的哈希函数对元素值进行计算，得到哈希值（有几个哈希函数得到几个哈希值）。
2. 根据得到的哈希值，在位数组中把对应下标的值置为 1。

**当我们需要判断一个元素是否存在于布隆过滤器的时候，会进行如下操作：**

1. 对给定元素再次进行相同的哈希计算；
2. 检查这些哈希值对应的 bit：如果存在一个 bit 不为 1，说明该元素一定没有被插入；如果全部为 1，只能说明该元素可能被插入，仍然存在误判。

Bloom Filter 的简单原理图如下：

![Bloom Filter 的简单原理示意图](https://oss.javaguide.cn/github/javaguide/计算机基础/算法/bloom-filter-simple-schematic-diagram.png)

如图所示，当字符串要加入布隆过滤器时，该字符串首先由多个哈希函数生成不同的哈希值，然后将位数组中的对应位置设置为 1（位数组初始化时，所有位置均为 0）。再次查询相同字符串时，对应位置会全部为 1，因此布隆过滤器会返回“可能存在”；最终是否真的存在，仍需结合业务数据确认。

如果需要判断某个字符串是否在布隆过滤器中，只需对它再次进行相同的哈希计算。如果任一对应位置为 0，该元素一定没有被插入；如果所有对应位置都是 1，该元素可能被插入，也可能是其他元素共同造成的假阳性。

**不同的字符串可能哈希出来的位置相同，这种情况我们可以适当增加位数组大小或者调整我们的哈希函数。**

综上，我们可以得出：**布隆过滤器说某个元素存在，小概率会误判。布隆过滤器说某个元素不在，那么这个元素一定不在。**

## 布隆过滤器使用场景

1. 判断给定数据是否存在：比如判断一个数字是否存在于包含大量数字的数字集中（数字集很大，上亿）、防止缓存穿透（判断请求的数据是否有效避免直接绕过缓存请求数据库）等等、邮箱的垃圾邮件过滤（判断一个邮件地址是否在垃圾邮件列表中）、黑名单功能（判断一个 IP 地址或手机号码是否在黑名单中）等等。
2. 去重：比如爬给定网址的时候对已经爬取过的 URL 去重、对巨量的 QQ 号/订单号去重。

去重场景也需要用到判断给定数据是否存在，因此布隆过滤器主要是为了解决海量数据的存在性问题。

## 编码实战

### 通过 Java 编程手动实现布隆过滤器

我们上面已经说了布隆过滤器的原理，知道了布隆过滤器的原理之后就可以自己手动实现一个了。

如果你想要手动实现一个的话，你需要：

1. 一个合适大小的位数组保存数据
2. 几个不同的哈希函数
3. 添加元素到位数组（布隆过滤器）的方法实现
4. 判断给定元素是否存在于位数组（布隆过滤器）的方法实现。

下面给出一个我觉得写的还算不错的代码（参考网上已有代码改进得到，对于所有类型对象皆适用）：

```java
import java.util.BitSet;

public class MyBloomFilter {

    /**
     * 位数组的大小
     */
    private static final int DEFAULT_SIZE = 2 << 24;
    /**
     * 通过这个数组可以创建 6 个不同的哈希函数
     */
    private static final int[] SEEDS = new int[]{3, 13, 46, 71, 91, 134};

    /**
     * 位数组。数组中的元素只能是 0 或者 1
     */
    private BitSet bits = new BitSet(DEFAULT_SIZE);

    /**
     * 存放包含 hash 函数的类的数组
     */
    private SimpleHash[] func = new SimpleHash[SEEDS.length];

    /**
     * 初始化多个包含 hash 函数的类的数组，每个类中的 hash 函数都不一样
     */
    public MyBloomFilter() {
        // 初始化多个不同的 Hash 函数
        for (int i = 0; i < SEEDS.length; i++) {
            func[i] = new SimpleHash(DEFAULT_SIZE, SEEDS[i]);
        }
    }

    /**
     * 添加元素到位数组
     */
    public void add(Object value) {
        for (SimpleHash f : func) {
            bits.set(f.hash(value), true);
        }
    }

    /**
     * 判断指定元素是否存在于位数组
     */
    public boolean contains(Object value) {
        boolean ret = true;
        for (SimpleHash f : func) {
            ret = bits.get(f.hash(value));
            if(!ret)
              return ret;
        }
        return ret;
    }

    /**
     * 静态内部类。用于 hash 操作！
     */
    public static class SimpleHash {

        private int cap;
        private int seed;

        public SimpleHash(int cap, int seed) {
            this.cap = cap;
            this.seed = seed;
        }

        /**
         * 计算 hash 值
         */
        public int hash(Object value) {
            int h;
            return (value == null) ? 0 : Math.abs((cap - 1) & seed * ((h = value.hashCode()) ^ (h >>> 16)));
        }

    }
}
```

测试：

```java
String value1 = "https://javaguide.cn/";
String value2 = "https://github.com/Snailclimb";
MyBloomFilter filter = new MyBloomFilter();
System.out.println(filter.contains(value1));
System.out.println(filter.contains(value2));
filter.add(value1);
filter.add(value2);
System.out.println(filter.contains(value1));
System.out.println(filter.contains(value2));
```

Output:

```plain
false
false
true
true
```

测试：

```java
Integer value1 = 13423;
Integer value2 = 22131;
MyBloomFilter filter = new MyBloomFilter();
System.out.println(filter.contains(value1));
System.out.println(filter.contains(value2));
filter.add(value1);
filter.add(value2);
System.out.println(filter.contains(value1));
System.out.println(filter.contains(value2));
```

Output:

```java
false
false
true
true
```

### 利用 Google 开源的 Guava 中自带的布隆过滤器

自己实现的目的主要是为了让自己搞懂布隆过滤器的原理，Guava 中布隆过滤器的实现算是比较权威的，所以实际项目中我们不需要手动实现一个布隆过滤器。

首先我们需要在项目中引入 Guava 的依赖。版本建议由项目的依赖管理统一维护，并根据 [Guava Releases](https://github.com/google/guava/releases) 选择仍受维护的版本：

```xml
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>${guava.version}</version>
</dependency>
```

实际使用如下：

我们创建了一个预计插入 1500 个整数的布隆过滤器，并将目标误判率设置为 1%（0.01）。这里的 1500 是容量估计，不是达到后立即失效的硬上限。

```java
// 创建布隆过滤器对象
BloomFilter<Integer> filter = BloomFilter.create(
    Funnels.integerFunnel(),
    1500,
    0.01);
// 判断指定元素是否存在
System.out.println(filter.mightContain(1));
System.out.println(filter.mightContain(2));
// 将元素添加进布隆过滤器
filter.put(1);
filter.put(2);
System.out.println(filter.mightContain(1));
System.out.println(filter.mightContain(2));
```

在这个示例中，`mightContain()` 返回 `false` 表示该元素一定没有被插入；返回 `true` 只表示可能被插入。参数 `0.01` 表示在容量估计和实现假设成立时，对未插入元素查询的目标假阳性概率约为 1%，不能据此推导出“返回 true 后有 99% 的概率确实存在”。

**Guava 的布隆过滤器保存在当前进程内存中，使用简单，适合单进程或不需要跨节点共享的场景。如果多个节点需要共享同一份过滤器状态，可以考虑 RedisBloom 等集中式方案。**

## Redis 中的布隆过滤器

### 介绍

RedisBloom 提供布隆过滤器、布谷鸟过滤器等概率型数据结构。从 Redis 8 开始，这些能力已经包含在 Redis Open Source 中，不再需要安装旧的第三方 `rebloom` 镜像。具体命令和客户端支持可以查看 [Redis Bloom Filter 官方文档](https://redis.io/docs/latest/develop/data-types/probabilistic/布隆过滤器详解（原理、实现、应用场景）/)。

### 使用 Docker 安装

可以通过 Docker 启动 Redis 8 进行体验。实际项目建议固定经过验证的具体版本，不要依赖 `latest` 标签：

```bash
docker run -d --name redis -p 6379:6379 redis:8
docker exec -it redis redis-cli
```

生产环境的安装和版本选择请以 [Redis Open Source 安装文档](https://redis.io/docs/latest/operate/oss_and_stack/) 为准。

### 常用命令一览

> 注意：key：布隆过滤器的名称，item：添加的元素。

1. `BF.ADD`：将元素添加到布隆过滤器中，如果该过滤器尚不存在，则创建该过滤器。格式：`BF.ADD {key} {item}`。
2. `BF.MADD`：将一个或多个元素添加到布隆过滤器中，并创建一个尚不存在的过滤器。该命令的操作方式与 `BF.ADD` 相同，只不过它允许多个输入并返回多个值。格式：`BF.MADD {key} {item} [item ...]`。
3. `BF.EXISTS`：确定元素是否在布隆过滤器中存在。格式：`BF.EXISTS {key} {item}`。
4. `BF.MEXISTS`：确定一个或者多个元素是否在布隆过滤器中存在。格式：`BF.MEXISTS {key} {item} [item ...]`。

另外，`BF.RESERVE` 命令需要单独介绍一下：

这个命令的格式如下：

`BF.RESERVE {key} {error_rate} {capacity} [EXPANSION expansion]`。

下面简单介绍一下每个参数的具体含义：

1. key：布隆过滤器的名称
2. error_rate：期望的误报率。该值必须介于 0 到 1 之间。例如，对于期望的误报率 0.1%（1000 中为 1），error_rate 应该设置为 0.001。该数字越接近零，则每个项目的内存消耗越大，并且每个操作的 CPU 使用率越高。
3. capacity：预计插入的元素数量。可扩展过滤器超过该容量后会创建子过滤器，查询时需要检查更多子过滤器；如果使用 `NONSCALING` 创建固定容量过滤器，继续插入则会使实际误判率高于设定值。

可选参数：

- expansion：如果创建了一个新的子过滤器，则其大小将是当前过滤器的大小乘以 `expansion`。默认扩展值为 2。这意味着每个后续子过滤器将是前一个子过滤器的两倍。

### 实际使用

```shell
127.0.0.1:6379> BF.ADD myFilter java
(integer) 1
127.0.0.1:6379> BF.ADD myFilter javaguide
(integer) 1
127.0.0.1:6379> BF.EXISTS myFilter java
(integer) 1
127.0.0.1:6379> BF.EXISTS myFilter javaguide
(integer) 1
127.0.0.1:6379> BF.EXISTS myFilter github
(integer) 0
```

## 面试复盘重点

布隆过滤器面试最常见的 4 个问题是：为什么快、为什么省空间、为什么会误判、为什么不好删除。

| 问题             | 回答要点                                              |
| ---------------- | ----------------------------------------------------- |
| 为什么省空间？   | 用位数组和多个哈希函数表示集合，不存储原始元素        |
| 为什么会误判？   | 多个元素可能把同一批 bit 置为 1，查询时误以为目标存在 |
| 会不会漏判？     | 标准布隆过滤器不会把已加入元素判断为不存在            |
| 为什么删除困难？ | 一个 bit 可能被多个元素共享，清零会影响其他元素       |

典型工程场景：

- 缓存穿透：先用布隆过滤器判断 key 是否可能存在，不存在就不查数据库。
- 大规模去重：比如 URL 去重、黑名单过滤、推荐系统已读过滤。
- 分布式场景：单机 Guava 方案简单，但跨节点共享通常会考虑 RedisBloom。

回答时要主动补一句局限：布隆过滤器适合“允许少量误判，但不能接受漏判”的场景。如果业务要求 100% 精确存在性判断，就不能只靠布隆过滤器。

## 常见追问

- 误判率和位数组大小、哈希函数个数有什么关系？
- 布隆过滤器能不能删除元素？
- 缓存穿透、缓存击穿、缓存雪崩分别是什么？
- Guava 布隆过滤器和 RedisBloom 怎么选？
- 如果容量预估错了，会发生什么？

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 堆详解（最大堆、最小堆、优先队列）.md -->

## [5] 堆详解（最大堆、最小堆、优先队列）

---
title: 堆详解（最大堆、最小堆、优先队列）
description: 解析堆的性质与操作，理解优先队列实现与堆排序性能优势，掌握插入/删除的复杂度与实践场景。
category: 计算机基础
tag:
  - 数据结构
head:
  - - meta
    - name: keywords
      content: 堆,最大堆,最小堆,优先队列,堆化,上浮,下沉,堆排序
---

## 什么是堆

堆是一种满足以下条件的树：

堆中的每一个节点值都大于等于（或小于等于）子树中所有节点的值。或者说，任意一个节点的值都大于等于（或小于等于）所有子节点的值。

> 大家可以把堆（最大堆）理解为一个公司，这个公司很公平，谁能力强谁就当老大，不存在弱的人当老大，老大手底下的人一定不会比他强。这样有助于理解后续堆的操作。

**!!!特别提示：**

- 很多博客说堆是完全二叉树，其实并非如此，**堆不一定是完全二叉树**，只是为了方便存储和索引，我们通常用完全二叉树的形式来表示堆，事实上，广为人知的斐波那契堆和二项堆就不是完全二叉树，它们甚至都不是二叉树。
- （**二叉**）堆是一个数组，它可以被看成是一个 **近似的完全二叉树**。——《算法导论》第三版

大家可以尝试判断下面给出的图是否是堆？

![判断是否满足堆性质的示例](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/heap-1.png)

第 1 个和第 2 个是堆。第 1 个是最大堆，每个节点都比子树中所有节点大。第 2 个是最小堆，每个节点都比子树中所有节点小。

第 3 个不是，第三个中，根结点 1 比 2 和 15 小，而 15 却比 3 大，19 比 5 大，不满足堆的性质。

## 堆的用途

当我们只关心所有数据中的最大值或者最小值，存在多次获取最大值或者最小值，多次插入或删除数据时，就可以使用堆。

有小伙伴可能会想到用有序数组，初始化一个有序数组时间复杂度是 `O(nlog(n))`，查找最大值或者最小值时间复杂度都是 `O(1)`，但是，涉及到更新（插入或删除）数据时，时间复杂度为 `O(n)`，即使是使用复杂度为 `O(log(n))` 的二分法找到要插入或者删除的数据，在移动数据时也需要 `O(n)` 的时间复杂度。

**相对于有序数组而言，堆的主要优势在于插入和删除数据效率较高。** 因为堆是基于完全二叉树实现的，所以在插入和删除数据时，只需要在二叉树中上下移动节点，时间复杂度为 `O(log(n))`，相比有序数组的 `O(n)`，效率更高。

不过，需要注意的是：使用 Floyd 建堆法，从最后一个非叶节点开始依次执行下沉，时间复杂度为 `O(n)`；如果从空堆开始逐个插入 n 个元素，时间复杂度则为 `O(nlogn)`。

## 堆的分类

堆分为 **最大堆** 和 **最小堆**。二者的区别在于节点的排序方式。

- **最大堆**：堆中的每一个节点的值都大于等于子树中所有节点的值
- **最小堆**：堆中的每一个节点的值都小于等于子树中所有节点的值

如下图所示，图 1 是最大堆，图 2 是最小堆

![最大堆和最小堆示例](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/heap-2.png)

## 堆的存储

之前介绍树的时候说过，由于完全二叉树的优秀性质，利用数组存储二叉树即节省空间，又方便索引（若根结点的序号为 1，那么对于树中任意节点 i，其左子节点序号为 `2*i`，右子节点序号为 `2*i+1`）。

为了方便存储和索引，（二叉）堆可以用完全二叉树的形式进行存储。存储的方式如下图所示：

![堆的数组顺序存储示意图](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/heap-storage.png)

## 堆的操作

堆的更新操作主要包括两种：**插入元素** 和 **删除堆顶元素**。操作过程需要着重掌握和理解。

> 在进入正题之前，再重申一遍，堆是一个公平的公司，有能力的人自然会走到与他能力所匹配的位置

### 插入元素

> 插入元素，作为一个新入职的员工，初来乍到，这个员工需要从基层做起

**1. 将要插入的元素放到最后**

![堆插入元素：新元素放到数组末尾](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/heap-insert-1.png)

> 有能力的人会逐渐升职加薪，是金子总会发光的！！！

**2. 从底向上，如果父结点比该元素小，则该节点和父结点交换，直到无法交换**

![堆插入元素：新元素与父节点比较并上浮](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/heap-insert-2.png)

![堆插入元素：上浮后恢复堆性质](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/heap-insert-3.png)

### 删除堆顶元素

根据堆的性质可知，最大堆的堆顶元素为所有元素中最大的，最小堆的堆顶元素是所有元素中最小的。当我们需要多次查找最大元素或者最小元素的时候，可以利用堆来实现。

删除堆顶元素后，为了保持堆的性质，需要对堆的结构进行调整，我们将这个过程称之为“**堆化**”。常见调整方向有两种：

- 自底向上堆化：插入元素时，新元素从末尾向上移动，也叫上浮。
- 自顶向下堆化：删除堆顶时，末尾元素移到堆顶后向下移动，也叫下沉。

#### 一个不完整的空穴上移过程

> 在堆这个公司中，会出现老大离职的现象，老大离职之后，他的位置就空出来了

下面先看一种容易想到但不完整的做法：直接删除堆顶元素，使数组中下标为 1 的位置空出。

![删除堆顶元素：移除根节点](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/heap-delete-top-1.png)

> 那么他的位置由谁来接替呢，当然是他的直接下属了，谁能力强就让谁上呗

比较根结点的左子节点和右子节点，也就是下标为 2,3 的数组元素，将较大的元素填充到根结点（下标为 1）的位置。

![删除堆顶元素：较大的子节点上移到根节点](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/heap-delete-top-2.png)

> 这个时候又空出一个位置了，老规矩，谁有能力谁上

一直循环比较空出位置的左右子节点，并将较大者移至空位，直到堆的最底部。

![删除堆顶元素：自底向上堆化后留下空位](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/heap-delete-top-3.png)

此时虽然较大的子节点沿路径上移了，但数组内部留下了空位，已经不再满足完全二叉树的结构，因此不能算作一次完整、有效的堆顶删除。标准做法是先用末尾元素填补堆顶，再让它向下调整。

#### 自顶向下堆化

自顶向下的堆化用一个词形容就是“石沉大海”，那么第一件事情，就是把石头抬起来，从海面扔下去。这个石头就是堆的最后一个元素，我们将最后一个元素移动到堆顶。

![删除堆顶元素：将末尾元素移动到堆顶](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/heap-delete-top-4.png)

然后开始将这个石头沉入海底，不停与左右子节点的值进行比较，和较大的子节点交换位置，直到无法交换位置。

![删除堆顶元素：堆顶元素向下调整](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/heap-delete-top-5.png)

![删除堆顶元素：自顶向下堆化完成](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/heap-delete-top-6.png)

### 堆的操作总结

- **插入元素**：先将元素放至数组末尾，再自底向上堆化，将末尾元素上浮
- **删除堆顶元素**：将堆顶元素与末尾元素交换，缩小堆的大小，再从堆顶开始向下调整，直到恢复堆的性质。

## 堆排序

堆排序的过程分为两步：

- 第一步是建堆，将一个无序的数组建立为一个堆
- 第二步是排序，将堆顶元素取出，然后对剩下的元素进行堆化，反复迭代，直到所有元素被取出为止。

### 建堆

如果你已经足够了解堆化的过程，那么建堆的过程掌握起来就比较容易了。建堆的过程就是一个对所有非叶节点的自顶向下堆化过程。

首先要了解哪些是非叶节点，最后一个节点的父结点及它之前的元素，都是非叶节点。也就是说，如果节点个数为 n，那么我们需要对 n/2 到 1 的节点进行自顶向下（沉底）堆化。

具体过程如下图：

![建堆过程：初始无序数组对应的完全二叉树](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/heap-build-1.png)

将初始的无序数组抽象为一棵树，图中的节点个数为 6，所以 4,5,6 节点为叶节点，1,2,3 节点为非叶节点，所以要对 1-3 号节点进行自顶向下（沉底）堆化，注意，顺序是从后往前堆化，从 3 号节点开始，一直到 1 号节点。

3 号节点堆化结果：

![建堆过程：3 号节点完成下沉](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/heap-build-2.png)

2 号节点堆化结果：

![建堆过程：2 号节点完成下沉](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/heap-build-3.png)

1 号节点堆化结果：

![建堆过程：1 号节点完成下沉并形成最大堆](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/heap-build-4.png)

至此，数组所对应的树已经成为了一个最大堆，建堆完成！

### 排序

由于堆顶元素是所有元素中最大的，所以我们重复取出堆顶元素，将这个最大的堆顶元素放至数组末尾，并对剩下的元素进行堆化即可。

现在思考两个问题：

- 删除堆顶元素后需要执行自顶向下（沉底）堆化还是自底向上（上浮）堆化？
- 取出的堆顶元素存在哪，新建一个数组存？

先回答第一个问题，我们需要执行自顶向下（沉底）堆化，这个堆化一开始要将末尾元素移动至堆顶，这个时候末尾的位置就空出来了，由于堆中元素已经减小，这个位置不会再被使用，所以我们可以将取出的元素放在末尾。

机智的小伙伴已经发现了，这其实是做了一次交换操作，将堆顶和末尾元素调换位置，从而将取出堆顶元素和堆化的第一步（将末尾元素放至根结点位置）进行合并。

详细过程如下图所示：

取出第一个元素并堆化：

![堆排序过程：第 1 轮取出堆顶元素并堆化](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/heap-sort-1.png)

取出第二个元素并堆化：

![堆排序过程：第 2 轮取出堆顶元素并堆化](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/heap-sort-2.png)

取出第三个元素并堆化：

![堆排序过程：第 3 轮取出堆顶元素并堆化](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/heap-sort-3.png)

取出第四个元素并堆化：

![堆排序过程：第 4 轮取出堆顶元素并堆化](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/heap-sort-4.png)

取出第五个元素并堆化：

![堆排序过程：第 5 轮取出堆顶元素并堆化](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/heap-sort-5.png)

取出第六个元素并堆化：

![堆排序过程：所有元素完成排序](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/heap-sort-6.png)

堆排序完成！

## 面试复盘重点

堆在面试里常和优先队列、Top K、定时任务、延迟队列放在一起问。

| 操作     | 时间复杂度 | 说明                           |
| -------- | ---------- | ------------------------------ |
| 查看堆顶 | `O(1)`     | 最大堆堆顶最大，最小堆堆顶最小 |
| 插入元素 | `O(logn)`  | 插入末尾后上浮                 |
| 删除堆顶 | `O(logn)`  | 末尾元素换到堆顶后下沉         |
| 建堆     | `O(n)`     | 从最后一个非叶子节点开始下沉   |
| 堆排序   | `O(nlogn)` | 原地排序，但不稳定             |

Java 里的 `PriorityQueue` 默认是小顶堆：

```java
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
PriorityQueue<Integer> maxHeap = new PriorityQueue<>((a, b) -> Integer.compare(b, a));
```

不要写成 `b - a`，极端整数值下可能溢出，导致比较结果错误。

Top K 问题常见选择：

- 求第 K 大：维护大小为 K 的小顶堆。
- 求前 K 高频：先用哈希表计数，再用小顶堆保留 K 个高频元素。
- 数据流中位数：一个大顶堆维护较小的一半，一个小顶堆维护较大的一半。

## Java 代码模板

第 K 大问题可以用大小为 K 的小顶堆。堆顶始终是当前前 K 大里最小的那个元素，如果新元素比堆顶大，就替换堆顶。

```java
int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> heap = new PriorityQueue<>();
    for (int num : nums) {
        if (heap.size() < k) {
            heap.offer(num);
        } else if (num > heap.peek()) {
            heap.poll();
            heap.offer(num);
        }
    }
    return heap.peek();
}
```

前 K 高频元素通常是“哈希表计数 + 小顶堆”：

```java
int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> count = new HashMap<>();
    for (int num : nums) {
        count.put(num, count.getOrDefault(num, 0) + 1);
    }
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(a[1], b[1]));
    for (Map.Entry<Integer, Integer> entry : count.entrySet()) {
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

## 过程示意和边界样例

维护大小为 K 的小顶堆时，可以把堆理解成“候选池”：

```text
1. 候选池没满：直接放入。
2. 候选池已满，新元素 <= 堆顶：进不了前 K，跳过。
3. 候选池已满，新元素 > 堆顶：弹出堆顶，放入新元素。
4. 遍历结束后，堆顶就是第 K 大。
```

几个边界样例建议先过一遍：

- `k == 1`：求最大值。
- `k == nums.length`：求最小值。
- 数组里有重复元素：第 K 大通常按排序位置算，不是第 K 个不同元素。
- 比较器不要写 `b - a`，极端值可能溢出。

## 推荐练习题

- [215. 数组中的第 K 个最大元素](https://leetcode.cn/problems/kth-largest-element-in-an-array/)
- [347. 前 K 个高频元素](https://leetcode.cn/problems/top-k-frequent-elements/)
- [703. 数据流中的第 K 大元素](https://leetcode.cn/problems/kth-largest-element-in-a-stream/)
- [295. 数据流的中位数](https://leetcode.cn/problems/find-median-from-data-stream/)

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 哈希表面试题总结-哈希冲突、扩容与 Java HashMap.md -->

## [6] 哈希表面试题总结：哈希冲突、扩容与 Java HashMap

---
title: 哈希表面试题总结：哈希冲突、扩容与 Java HashMap
description: 哈希表面试题总结，讲解哈希函数、哈希冲突、拉链法、开放寻址法、负载因子、扩容、Java HashMap 和 LeetCode 高频题。
category: 计算机基础
tag:
  - 数据结构
head:
  - - meta
    - name: keywords
      content: 哈希表,HashMap,哈希函数,哈希冲突,拉链法,开放寻址法,负载因子,扩容,Java集合,数据结构面试题
---

哈希表（Hash Table，也叫散列表）的面试价值很高，因为它一头连着算法题里的快速查找和计数，另一头连着 Java `HashMap`、缓存、去重和分布式系统里的分片路由。

这个问题问的是：如何把一个 key 快速映射到数组下标，并在冲突、扩容和极端数据下仍然保持可接受的查询效率。

文章内容概览：

1. 什么是哈希表？
2. 哈希表怎么从 key 定位到数组下标？
3. 哈希冲突、负载因子和扩容分别解决什么问题？
4. Java `HashMap` 和普通哈希表有什么关系？
5. 哈希表在算法题和工程场景中怎么用？

![哈希表通过哈希函数把键映射到数组位置的结构示意图](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/hash-table.png)

## 什么是哈希表？

哈希表是一种用来存储 key-value 映射关系的数据结构。我们平时说的 Map、Dictionary、Associative Array，本质上都可以用哈希表来实现。

如果 key 是连续整数，比如学生编号刚好是 `0` 到 `999`，直接用数组就能做到 `students[id]` 这种 `O(1)` 访问。但真实业务里的 key 通常不是这么规整：可能是字符串、用户 ID、订单号、URL，也可能是自定义对象。哈希表要做的事情，就是先把这些不同类型、不同长度的 key 通过哈希函数转换成一个整数，再把这个整数映射到数组下标。

可以把哈希表拆成三层来看：

1. **数组**：真正存放数据的位置，也常被称为桶（bucket）。
2. **哈希函数**：负责把 key 转换成哈希值。
3. **冲突解决策略**：当多个 key 落到同一个桶时，决定这些 key 怎么继续存。

所以，哈希表不是“完全没有查找过程”，而是通过哈希函数把查找范围大幅缩小：理想情况下，一次定位就能找到目标桶；发生冲突时，再在桶内部做少量比较。

## 为什么需要哈希表？

假设要判断一个 URL 是否已经爬取过，最直接的方式是把爬过的 URL 放到列表里，每来一个新 URL 就从头扫一遍。数据量很小时问题不大，但如果已经爬了几百万个 URL，每次都线性扫描，性能很快就扛不住。

哈希表的思路是用空间换时间：多开一块数组空间，把 URL 通过哈希函数分散到不同桶里。查询时不再从头遍历所有 URL，而是先计算哈希值，直接跳到对应桶附近查找。

这也是哈希表适合做查找、计数、去重、缓存索引的原因。它不关心元素之间的大小关系，也不保证有序；它关心的是“给定 key，能不能尽快找到对应的 value”。

## 哈希函数要解决什么问题？

哈希函数的目标不是把 key 变得神秘，而是尽量把 key 均匀地分散到数组里。一个好的哈希函数通常要满足三个要求：

| 要求       | 含义                                             |
| ---------- | ------------------------------------------------ |
| 稳定       | 同一个 key 多次计算得到的哈希值应该一致          |
| 计算快     | 哈希函数本身不能太慢，否则会抵消哈希表的性能优势 |
| 分布尽量散 | 不同 key 尽量落到不同位置，减少哈希冲突          |

需要注意的是，普通哈希表里的哈希函数和密码学哈希不是一回事。哈希表更关注速度和分布质量；密码学哈希更关注抗碰撞、抗篡改等安全性质。

在 Java 里，自定义对象作为 `HashMap` 的 key 时，`hashCode()` 和 `equals()` 必须配合好：如果两个对象通过 `equals()` 判断相等，它们的 `hashCode()` 也必须相同；但两个对象的 `hashCode()` 相同，不代表它们一定相等。这一点正是哈希冲突会存在的根源之一。

## 面试考察重点

- 哈希函数负责把 key 映射成数组下标。
- 哈希冲突无法完全避免，只能设计策略处理。
- 哈希表平均查询、插入、删除是 `O(1)`，最坏情况可能退化。
- Java `HashMap` 使用数组 + 链表 + 红黑树，JDK 8 后链表过长会树化。
- 哈希表常用于快速查找、计数、去重、缓存索引。

## 哈希表怎么工作？

以插入一个 key-value 为例，哈希表通常会做这几步：

1. 对 key 计算哈希值。
2. 根据数组长度把哈希值映射成下标。
3. 如果该位置为空，直接放入。
4. 如果发生冲突，按冲突解决策略继续处理。

```java
int index = hash(key) & (table.length - 1);
```

`HashMap` 的容量是 2 的幂时，可以用位运算替代取模。位运算更快，也方便扩容后重新分布。

这里的 `hash(key)` 通常不是直接使用对象原始的 `hashCode()`，还会做一次扰动，让高位信息也参与到低位下标计算中。原因也很好理解：当数组长度是 2 的幂时，`length - 1` 的二进制低位全是 1，直接 `&` 会更依赖哈希值低位。如果低位分布不好，冲突就会更集中。

## 哈希冲突怎么解决？

| 方法       | 思路                     | 典型应用         | 注意点                   |
| ---------- | ------------------------ | ---------------- | ------------------------ |
| 拉链法     | 数组位置上挂链表或树     | Java `HashMap`   | 链表过长会影响查询       |
| 开放寻址法 | 冲突后继续探测下一个位置 | 一些高性能哈希表 | 删除和负载因子处理更复杂 |
| 再哈希     | 冲突后换一个哈希函数     | 理论方案较常见   | 实现成本更高             |

Java `HashMap` 主要使用拉链法。JDK 8 开始，当链表长度达到阈值并且数组容量足够大时，会把链表转换成红黑树，降低极端冲突下的查询成本。

拉链法的优点是实现直观，删除也比较容易。数组中的每个桶不只放一个元素，而是挂一条链表，冲突的元素追加到这条链上。查询时先通过哈希定位桶，再在桶里的链表或树中比较 key。

开放寻址法则不额外挂链表，所有元素都放在数组内部。发生冲突后，它会按照某种探测规则继续找下一个可用位置，比如线性探测、二次探测、双重哈希。它的好处是内存局部性通常更好，但删除元素、控制负载因子和处理连续聚集会更麻烦。

## 负载因子和扩容

负载因子表示哈希表使用程度：

```text
负载因子 = 元素数量 / 数组容量
```

`HashMap` 默认负载因子是 `0.75`。当元素数量超过 `capacity * loadFactor` 时触发扩容，容量通常变为原来的 2 倍。

扩容会带来一次 rehash 成本。面试里可以这样回答：哈希表单次插入平均是 `O(1)`，但触发扩容的那次会搬迁元素；从摊还角度看，多次插入仍然可以看作平均 `O(1)`。

负载因子不能只看“空间利用率”。负载因子越高，数组越满，空间越省，但冲突概率也会上升；负载因子越低，冲突少一些，但会浪费更多桶位。`0.75` 是 Java `HashMap` 在时间和空间之间做的一个经验折中。

## 哈希表为什么平均是 O(1)？

哈希表的 `O(1)` 说的是平均情况或者期望情况，不是所有输入下的绝对保证。

在哈希函数分布比较均匀、负载因子控制得当时，元素会比较分散，每个桶里的元素数量很少。因此查询时的主要成本就是：计算哈希值、定位数组下标、在桶里做少量比较，这些操作可以看作常数级。

但如果大量 key 落到同一个桶，哈希表就会退化。使用拉链法时，桶内链表太长，查询会接近 `O(n)`；JDK 8 之后的 `HashMap` 会在满足条件时树化，把极端冲突下的桶内查询成本降到 `O(logn)` 级别，但这不代表哈希表永远不会受冲突影响。

## 和 Java HashMap 的关系

`HashMap` 常见追问：

- 初始容量为什么建议设置成 2 的幂？
- 默认负载因子为什么是 `0.75`？
- JDK 8 为什么引入红黑树？
- `HashMap` 为什么线程不安全？
- `HashMap` 和 `ConcurrentHashMap` 有什么区别？

这些问题已经超出纯数据结构，但底层仍然是哈希表：数组负责定位，链表或红黑树负责处理冲突，扩容负责控制负载。

## 常见算法题模板

两数之和：

```java
int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int need = target - nums[i];
        if (map.containsKey(need)) {
            return new int[] {map.get(need), i};
        }
        map.put(nums[i], i);
    }
    return new int[] {-1, -1};
}
```

这段代码体现了哈希表最常见的用法：用空间换时间，把一次查找从 `O(n)` 降到平均 `O(1)`。

## 代表题精讲：和为 K 的子数组

[560. 和为 K 的子数组](https://leetcode.cn/problems/subarray-sum-equals-k/) 很适合用来理解“前缀和 + 哈希表”。题目要求统计连续子数组和等于 `k` 的个数。

如果只枚举左右端点，复杂度是 `O(n^2)`。换个角度看，假设当前前缀和是 `sum`，想找到一个之前的前缀和 `prev`，使得：

```text
sum - prev = k
```

也就是 `prev = sum - k`。所以只要用哈希表记录每个前缀和出现过几次，就能在遍历到当前位置时立刻知道有多少个子数组以当前位置结尾、和为 `k`。

```java
int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> count = new HashMap<>();
    count.put(0, 1);

    int sum = 0;
    int ans = 0;
    for (int num : nums) {
        sum += num;
        ans += count.getOrDefault(sum - k, 0);
        count.put(sum, count.getOrDefault(sum, 0) + 1);
    }
    return ans;
}
```

这里 `count.put(0, 1)` 很重要，它表示空前缀出现过一次。这样当从数组开头到当前位置的和刚好等于 `k` 时，也能被统计到。

另一个易错点是“先查再加”。如果先把当前 `sum` 加进哈希表，再查 `sum - k`，在 `k = 0` 时可能把当前前缀自己算进去，导致答案偏大。

比如 `nums = [1]`、`k = 0`。正确的“先查再加”不会找到和为 0 的非空子数组；如果先把当前前缀和 `1` 加进去，再查 `sum - k = 1`，就会把当前前缀和自己配对，错误地多算 1 次。

## Java HashMap 面试追问

哈希表文章只讲概念还不够，Java 后端面试里经常会继续追问 `HashMap`。可以按下面的层次准备：

| 追问                          | 回答重点                                                              |
| ----------------------------- | --------------------------------------------------------------------- |
| 为什么容量通常是 2 的幂？     | 方便用 `hash & (length - 1)` 定位，同时扩容后元素迁移更容易           |
| 为什么默认负载因子是 `0.75`？ | 在空间利用率和冲突概率之间取折中，太小浪费空间，太大冲突增多          |
| 为什么 JDK 8 引入红黑树？     | 极端冲突时链表查询会退化，树化后能把查询成本从链表长度级别降下来      |
| 为什么 `HashMap` 线程不安全？ | 多线程并发修改会破坏结构一致性，读写也没有可见性和互斥保证            |
| 自定义 key 要注意什么？       | `equals()` 和 `hashCode()` 要一致，参与计算的字段不要在放入后再被修改 |

面试里不用把源码细节全部背下来，但要讲清楚一条主线：数组定位、冲突处理、扩容迁移、极端冲突优化，这四件事共同决定了 `HashMap` 的性能表现。

## 易错点

- 哈希表平均 `O(1)` 不等于任何情况下都是 `O(1)`。
- 自定义对象作为 key 时，要正确重写 `equals()` 和 `hashCode()`。
- 可变对象不适合直接作为哈希表 key。
- 统计频率时，数组计数比 `HashMap` 更适合字符集很小的场景。
- 哈希表能加速查找，但会带来额外空间。

## 高频问题自测

- 哈希表为什么平均查询是 `O(1)`？什么情况下会退化？
- 拉链法和开放寻址法有什么区别？
- `HashMap` 为什么需要扩容？扩容成本怎么理解？
- 为什么自定义对象作为 key 时要同时重写 `equals()` 和 `hashCode()`？
- 前缀和 + 哈希表为什么要“先查再加”？

## 推荐练习题

- [1. 两数之和](https://leetcode.cn/problems/two-sum/)
- [242. 有效的字母异位词](https://leetcode.cn/problems/valid-anagram/)
- [49. 字母异位词分组](https://leetcode.cn/problems/group-anagrams/)
- [560. 和为 K 的子数组](https://leetcode.cn/problems/subarray-sum-equals-k/)
- [146. LRU 缓存](https://leetcode.cn/problems/LRU 缓存面试题总结-哈希表、双向链表与 LinkedHashMap/)

## 参考资料

- [Algorithms, 4th Edition：Hash Tables](https://algs4.cs.princeton.edu/34hash/)
- [Java SE 21 API：HashMap](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html)
- [OpenJDK：HashMap 源码](https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/util/HashMap.java)
- [Java SE 21 API：Object#hashCode](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html#hashCode%28%29)

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 红黑树详解（性质、旋转、应用）.md -->

## [7] 红黑树详解（性质、旋转、应用）

---
title: 红黑树详解（性质、旋转、应用）
description: 深入讲解红黑树的五大性质与旋转调整过程，理解自平衡机制及在标准库与索引结构中的应用。
category: 计算机基础
tag:
  - 数据结构
head:
  - - meta
    - name: keywords
      content: 红黑树,自平衡,旋转,插入删除,性质,黑高,时间复杂度
---

# 红黑树

## 红黑树介绍

红黑树（Red Black Tree）是一种自平衡二叉查找树。它是在 1972 年由 Rudolf Bayer 发明的，当时被称为平衡二叉 B 树（symmetric binary B-trees）。后来，在 1978 年被 Leo J. Guibas 和 Robert Sedgewick 修改为如今的“红黑树”。

由于其自平衡的特性，保证了最坏情形下在 O(logn) 时间复杂度内完成查找、增加、删除等操作，性能表现稳定。

在 JDK 中，`TreeMap`、`TreeSet` 以及 JDK1.8 的 `HashMap` 底层都用到了红黑树。

## 为什么需要红黑树？

红黑树的诞生就是为了解决二叉查找树的缺陷。

二叉查找树是一种基于比较的数据结构，它的每个节点都有一个键值，而且左子节点的键值小于父节点的键值，右子节点的键值大于父节点的键值。这样的结构可以方便地进行查找、插入和删除操作，因为只需要比较节点的键值就可以确定目标节点的位置。但是，二叉查找树有一个很大的问题，就是它的形状取决于节点插入的顺序。如果节点是按照升序或降序的方式插入的，那么二叉查找树就会退化成一个线性结构，也就是一个链表。这样的情况下，二叉查找树的性能就会大大降低，时间复杂度就会从 O(logn) 变为 O(n)。

红黑树的诞生就是为了解决二叉查找树的缺陷，因为二叉查找树在某些情况下会退化成一个线性结构。

## 红黑树特点

1. 每个节点非红即黑。
2. 根节点总是黑色的。
3. 每个空子链接都视为黑色的 NIL 叶节点。
4. 如果节点是红色的，则它的子节点必须是黑色的，也就是不会出现连续的红色节点。
5. 从任意节点到其所有后代 NIL 节点的每条路径，都包含相同数量的黑色节点，即具有相同的黑高。

在红黑树与 2-3 树的对应关系中，一个黑节点和与其相连的红节点可以共同表示一个多键节点。这只是一种结构映射，红黑树节点本身始终至多有两个子节点。

正是这些特点才保证了红黑树的平衡，让红黑树的高度不会超过 2log(n+1)。

## 红黑树数据结构

AVL 树和红黑树都是自平衡二叉搜索树，2-3 树则是多路搜索树。红黑树可以与 2-3 树或 2-3-4 树建立结构对应，但它们不能统称为 B 树。相比 AVL 树，红黑树的平衡条件更宽松，它通过颜色规则和黑高约束限制树高。

## 红黑树结构实现

```java
public class Node {

    public Class<?> clazz;
    public Integer value;
    public Node parent;
    public Node left;
    public Node right;

    // AVL 树所需属性
    public int height;
    // 红黑树所需属性
    public Color color = Color.RED;

}
```

### 1. 左倾染色

![红黑树左倾染色示意图](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/red-black-tree-1.png)

- 染色时根据当前节点的爷爷节点，找到当前节点的叔叔节点。
- 再把父节点染黑、叔叔节点染黑，爷爷节点染红。但爷爷节点染红是临时的，当平衡树高操作后会把根节点染黑。

### 2. 右倾染色

![红黑树右倾染色示意图](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/red-black-tree-2.png)

### 3. 左旋调衡

#### 3.1 一次左旋

![红黑树一次左旋调衡示意图](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/red-black-tree-3.png)

#### 3.2 右旋 + 左旋

![红黑树右旋加左旋调衡示意图](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/red-black-tree-4.png)

### 4. 右旋调衡

#### 4.1 一次右旋

![红黑树一次右旋调衡示意图](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/red-black-tree-5.png)

#### 4.2 左旋 + 右旋

![红黑树左旋加右旋调衡示意图](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/red-black-tree-6.png)

## 面试复盘重点

红黑树面试一般不会要求完整手写插入删除修复，更常见的是让你说清性质、为什么近似平衡、和 AVL 树有什么区别、Java 里哪里用到了。

| 对比点   | AVL 树             | 红黑树                               |
| -------- | ------------------ | ------------------------------------ |
| 平衡要求 | 更严格             | 相对宽松                             |
| 查询性能 | 更稳定             | 也能保持 `O(logn)`                   |
| 插入删除 | 旋转调整可能更多   | 调整次数通常更少                     |
| 常见应用 | 读多写少的搜索结构 | `TreeMap`、`TreeSet`、`HashMap` 树化 |

面试回答可以按这个顺序组织：

1. 普通二叉搜索树在有序插入时会退化成链表。
2. 红黑树通过颜色规则限制树高，保证查询、插入、删除仍然是 `O(logn)`。
3. 它不是完全平衡，而是近似平衡，所以插入删除时调整成本比 AVL 树更低。
4. Java 中 `TreeMap`、`TreeSet` 基于红黑树，JDK 8 后 `HashMap` 链表过长时也会树化为红黑树。

`HashMap` 树化还要满足容量条件，并不是链表长度到阈值就一定树化。这个细节在 Java 集合面试里经常被追问。

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 树结构详解（二叉树、AVL、BB+树）.md -->

## [8] 树结构详解（二叉树、AVL、B/B+树）

---
title: 树结构详解（二叉树、AVL、B/B+树）
description: 系统讲解树与二叉树的核心概念与遍历方法，结合高度/深度等指标，夯实数据结构基础与算法思维。
category: 计算机基础
tag:
  - 数据结构
head:
  - - meta
    - name: keywords
      content: 树,二叉树,二叉搜索树,平衡树,遍历,前序,中序,后序,层序,高度,深度
---

树就是一种类似现实生活中的树的数据结构（倒置的树）。任何一棵非空树只有一个根节点。

一棵树具有以下特点：

1. 一棵树中的任意两个结点有且仅有唯一的一条路径连通。
2. 一棵树如果有 n 个结点，那么它一定恰好有 n-1 条边。
3. 一棵树不包含回路。

下图就是一棵树，并且是一棵二叉树。

![二叉树](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/%E4%BA%8C%E5%8F%89%E6%A0%91-2.png)

如上图所示，通过上面这张图说明一下树中的常用概念：

- **节点**：树中的每个元素都可以统称为节点。
- **根节点**：顶层节点或者说没有父节点的节点。上图中 A 节点就是根节点。
- **父节点**：若一个节点含有子节点，则这个节点称为其子节点的父节点。上图中的 B 节点是 D 节点、E 节点的父节点。
- **子节点**：一个节点含有的子树的根节点称为该节点的子节点。上图中 D 节点、E 节点是 B 节点的子节点。
- **兄弟节点**：具有相同父节点的节点互称为兄弟节点。上图中 D 节点、E 节点的共同父节点是 B 节点，故 D 和 E 为兄弟节点。
- **叶子节点**：没有子节点的节点。上图中的 D、F、H、I 都是叶子节点。
- **节点的高度**：该节点到叶子节点的最长路径所包含的边数。
- **节点的深度**：根节点到该节点的路径所包含的边数。
- **节点的层数**：节点的深度+1。
- **树的高度**：根节点的高度。

> 关于树的深度和高度的定义可以看 stackoverflow 上的这个问题：[What is the difference between tree depth and height?](https://stackoverflow.com/questions/2603692/what-is-the-difference-between-tree-depth-and-height)。

## 二叉树的分类

**二叉树**（Binary tree）是每个节点最多只有两个分支（即不存在分支度大于 2 的节点）的树结构。

**二叉树** 的分支通常被称作“**左子树**”或“**右子树**”。并且，**二叉树** 的分支具有左右次序，不能随意颠倒。

**二叉树** 的第 i 层至多拥有 `2^(i-1)` 个节点。按照本文“根节点深度为 0”的定义，深度为 k 的二叉树至多有 `2^(k+1)-1` 个节点（满二叉树的情况），至少有 `k+1` 个节点（退化为一条链的情况）。关于节点深度的定义，国内资料存在不同约定，本文采用维基百科对[节点深度的定义](<https://zh.wikipedia.org/wiki/%E6%A0%91_(%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84)#/%E6%9C%AF%E8%AF%AD>)。

![维基百科对节点深度的定义](https://oss.javaguide.cn/github/javaguide/image-20220119112736158.png)

### 满二叉树

一个二叉树，如果每一个层的结点数都达到最大值，则这个二叉树就是 **满二叉树**。也就是说，如果一个二叉树的层数为 K，且结点总数是 `2^k -1`，则它就是 **满二叉树**。如下图所示：

![满二叉树](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/full-binary-tree.png)

### 完全二叉树

除最后一层外，若其余层都是满的，并且最后一层是满的或者是在右边缺少连续若干节点，则这个二叉树就是 **完全二叉树**。

大家可以想象为一棵树从根结点开始扩展，扩展完左子节点才能开始扩展右子节点，每扩展完一层，才能继续扩展下一层。如下图所示：

![完全二叉树](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/complete-binary-tree.png)

完全二叉树有一个很好的性质：**父结点和子节点的序号有着对应关系。**

细心的小伙伴可能发现了，当根节点的值为 1 的情况下，若父结点的序号是 i，那么左子节点的序号就是 2i，右子节点的序号就是 2i+1。这个性质使得完全二叉树利用数组存储时可以极大地节省空间，以及利用序号找到某个节点的父结点和子节点，后续二叉树的存储会详细介绍。

### AVL 树（高度平衡二叉搜索树）

**AVL 树** 是一棵高度平衡的二叉搜索树，且具有以下性质：

1. 可以是一棵空树。
2. 如果不是空树，它的左右两个子树的高度差的绝对值不超过 1，并且左右两个子树也都是 AVL 树。

红黑树、替罪羊树、加权平衡树等也用于避免二叉搜索树严重退化，但它们的平衡条件并不等同于 AVL 树的“左右子树高度差不超过 1”。伸展树则通过访问后的调整获得摊还复杂度保证。

在给大家展示平衡二叉树之前，先给大家看一棵树：

![斜树](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/oblique-tree.png)

**你管这玩意儿叫树？？？**

没错，这玩意儿还真叫树，只不过这棵树已经退化为一个链表了，我们管它叫 **斜树**。

**如果这样，那我为啥不直接用链表呢？**

谁说不是呢？

普通二叉树本身并不保证查询比链表更快。只有利用二叉搜索树的有序性或其他索引关系时，树结构才可能让数据的**搜索**和**修改**更高效；未平衡的二叉搜索树最坏仍会退化到 `O(n)`。

但是，如果二叉搜索树退化为一个链表了，那么有序结构带来的查询优势就难以表现出来，效率也会大打折扣。AVL 树使用更严格的高度平衡条件来避免这种情况：每个节点的左右子树高度差最多为 1，如下图所示：

![平衡二叉树](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/balanced-binary-tree.png)

## 二叉树的存储

二叉树的存储主要分为 **链式存储** 和 **顺序存储** 两种：

### 链式存储

和链表类似，二叉树的链式存储依靠指针将各个节点串联起来，不需要连续的存储空间。

每个节点包括三个属性：

- 数据 data。data 不一定是单一的数据，根据不同情况，可以是多个具有不同类型的数据。
- 左节点指针 left。
- 右节点指针 right。

可是 JAVA 没有指针啊！

那就直接引用对象呗（别问我对象哪里找）。

![链式存储二叉树](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/chain-store-binary-tree.png)

### 顺序存储

顺序存储就是利用数组进行存储，数组中的每一个位置仅存储节点的 data，不存储左右子节点的指针，子节点的索引通过数组下标完成。根结点的序号为 1，对于每个节点 Node，假设它存储在数组中下标为 i 的位置，那么它的左子节点就存储在 2i 的位置，它的右子节点存储在下标为 2i+1 的位置。

一棵完全二叉树的数组顺序存储如下图所示：

![完全二叉树的数组顺序存储](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/sequential-storage.png)

大家可以试着填写一下存储如下二叉树的数组，比较一下和完全二叉树的顺序存储有何区别：

![非完全二叉树的数组顺序存储](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/sequential-storage2.png)

可以看到，如果我们要存储的二叉树不是完全二叉树，在数组中就会出现空隙，导致内存利用率降低。

## 二叉树的遍历

### 先序遍历

![先序遍历](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/preorder-traversal.png)

二叉树的先序遍历，就是先输出根结点，再遍历左子树，最后遍历右子树。遍历左子树和右子树的时候，同样遵循先序遍历的规则，也就是说，我们可以递归实现先序遍历。

代码如下：

```java
public void preOrder(TreeNode root){
    if(root == null){
        return;
    }
    System.out.println(root.data);
    preOrder(root.left);
    preOrder(root.right);
}
```

### 中序遍历

![中序遍历](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/inorder-traversal.png)

二叉树的中序遍历，就是先递归中序遍历左子树，再输出根结点的值，再递归中序遍历右子树。大家可以想象成一巴掌把树压扁，父结点被拍到了左子节点和右子节点的中间，如下图所示：

![中序遍历](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/inorder-traversal2.png)

代码如下：

```java
public void inOrder(TreeNode root){
    if(root == null){
        return;
    }
    inOrder(root.left);
    System.out.println(root.data);
    inOrder(root.right);
}
```

### 后序遍历

![后序遍历](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/postorder-traversal.png)

二叉树的后序遍历，就是先递归后序遍历左子树，再递归后序遍历右子树，最后输出根结点的值。

代码如下：

```java
public void postOrder(TreeNode root){
    if(root == null){
        return;
    }
    postOrder(root.left);
    postOrder(root.right);
    System.out.println(root.data);
}
```

## 面试复盘重点

树结构面试通常会从二叉树遍历开始，逐步追问二叉搜索树、平衡树、B 树和 B+ 树。

| 结构       | 特点                                     | 常见追问                         |
| ---------- | ---------------------------------------- | -------------------------------- |
| 二叉树     | 每个节点最多两个子节点                   | 遍历、路径、最近公共祖先、构造树 |
| 二叉搜索树 | 左子树小于根，右子树大于根               | 中序遍历有序、退化成链表         |
| AVL 树     | 高度平衡                                 | 查询快，插入删除旋转更频繁       |
| 红黑树     | 近似平衡                                 | Java `TreeMap`、`HashMap` 树化   |
| B 树       | 多路平衡搜索树                           | 磁盘 IO 友好                     |
| B+ 树      | 数据通常在叶子节点，叶子节点有序链表相连 | MySQL 索引、范围查询             |

二叉树遍历模板要能手写：

```java
void dfs(TreeNode root) {
    if (root == null) {
        return;
    }
    // 前序位置
    dfs(root.left);
    // 中序位置
    dfs(root.right);
    // 后序位置
}
```

BST 高频回答：

- 中序遍历二叉搜索树可以得到递增序列。
- 如果插入数据本身有序，普通 BST 会退化成链表。
- AVL 树比红黑树更严格平衡，查询更稳定；红黑树平衡要求宽一些，插入删除调整成本更低。
- B+ 树适合数据库索引，一个节点能存更多 key，树高更低，叶子节点有序链表适合范围查询。

二叉树算法题可以先按“当前节点在递归里承担什么角色”来分类：

- 路径类：当前节点要加入路径，递归结束后撤销，常见于根到叶子路径和路径总和。
- 子树信息类：左右子树先给出结果，当前节点再合并，常见于高度、直径、平衡二叉树。
- 分叉汇合类：左右子树分别查找目标，当前节点判断是否是交汇点，常见于最近公共祖先。
- 构造类：先确定根节点，再把左右子树的区间切开，常见于前序 + 中序构造二叉树。

## Java 代码模板

层序遍历是二叉树面试中最常见的非递归模板，很多“每层最大值”“锯齿形遍历”“最小深度”都可以从它变形。

```java
List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> ans = new ArrayList<>();
    if (root == null) {
        return ans;
    }
    Queue<TreeNode> queue = new ArrayDeque<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        int size = queue.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            level.add(node.val);
            if (node.left != null) {
                queue.offer(node.left);
            }
            if (node.right != null) {
                queue.offer(node.right);
            }
        }
        ans.add(level);
    }
    return ans;
}
```

验证 BST 时，不要只比较当前节点和左右孩子。正确做法是给每棵子树传上下界：

```java
boolean isValidBST(TreeNode root) {
    return check(root, Long.MIN_VALUE, Long.MAX_VALUE);
}

boolean check(TreeNode node, long lower, long upper) {
    if (node == null) {
        return true;
    }
    if (node.val <= lower || node.val >= upper) {
        return false;
    }
    return check(node.left, lower, node.val) && check(node.right, node.val, upper);
}
```

最近公共祖先（LCA）可以用后序思路：左右子树先找目标节点，当前节点再根据返回值判断是否汇合。

```java
TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) {
        return root;
    }
    TreeNode left = lowestCommonAncestor(root.left, p, q);
    TreeNode right = lowestCommonAncestor(root.right, p, q);
    if (left != null && right != null) {
        return root;
    }
    return left != null ? left : right;
}
```

这段代码的含义是：如果 `p` 和 `q` 分别出现在左右子树，当前节点就是最近公共祖先；如果只在一边出现，就把那一边的结果继续向上返回。

前序 + 中序构造二叉树时，前序数组的第一个元素是根节点，中序数组中根节点左边是左子树，右边是右子树。为了避免每次在线性数组里查根节点，通常先用哈希表记录中序下标。

```java
TreeNode buildTree(int[] preorder, int[] inorder) {
    Map<Integer, Integer> index = new HashMap<>();
    for (int i = 0; i < inorder.length; i++) {
        index.put(inorder[i], i);
    }
    return build(preorder, 0, preorder.length - 1, 0, inorder.length - 1, index);
}

TreeNode build(
    int[] preorder,
    int preLeft,
    int preRight,
    int inLeft,
    int inRight,
    Map<Integer, Integer> index
) {
    if (preLeft > preRight) {
        return null;
    }
    int rootVal = preorder[preLeft];
    int rootIndex = index.get(rootVal);
    int leftSize = rootIndex - inLeft;
    TreeNode root = new TreeNode(rootVal);
    root.left = build(preorder, preLeft + 1, preLeft + leftSize, inLeft, rootIndex - 1, index);
    root.right = build(preorder, preLeft + leftSize + 1, preRight, rootIndex + 1, inRight, index);
    return root;
}
```

构造题最容易错的是区间边界。建议先写清 `preLeft/preRight` 和 `inLeft/inRight` 的含义，再根据左子树大小 `leftSize` 切分前序数组。

## 过程示意和边界样例

二叉树题可以先判断“当前节点要做什么”，再决定用前序、中序、后序还是层序。

```text
前序：先处理当前节点，再处理左右子树，适合复制树、构造路径。
中序：左 -> 根 -> 右，BST 中序结果有序。
后序：先处理左右子树，再处理当前节点，适合求高度、直径、删除节点。
层序：按层推进，适合最短深度、每层统计、序列化。
```

几个边界样例建议手写前先过一遍：

- 空树：很多题应该返回空列表、`0` 或 `true`。
- 只有一个节点：递归出口和层序队列都要能处理。
- 退化链表：递归深度可能达到 `n`，复杂度不要误写成 `O(logn)`。
- BST 中存在 `Integer.MIN_VALUE` / `Integer.MAX_VALUE`：上下界建议用 `long`。
- LCA 中一个目标节点是另一个目标节点的祖先：遇到目标节点时要直接返回当前节点。
- 构造树时数组为空：递归区间会变成 `preLeft > preRight`，应返回 `null`。

## 推荐练习题

- [144. 二叉树的前序遍历](https://leetcode.cn/problems/binary-tree-preorder-traversal/)
- [102. 二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)
- [98. 验证二叉搜索树](https://leetcode.cn/problems/validate-binary-search-tree/)
- [236. 二叉树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/)
- [105. 从前序与中序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 跳表面试题总结-多级索引、范围查询与 Redis ZSet.md -->

## [9] 跳表面试题总结：多级索引、范围查询与 Redis ZSet

---
title: 跳表面试题总结：多级索引、范围查询与 Redis ZSet
description: 跳表面试题总结，讲解 SkipList 多级索引、查询、插入、删除、复杂度、范围查询、红黑树对比和 Redis ZSet 底层实现。
category: 计算机基础
tag:
  - 数据结构
head:
  - - meta
    - name: keywords
      content: 跳表,SkipList,Redis ZSet,有序集合,范围查询,多级索引,红黑树对比,Redis面试题,数据结构面试题
---

跳表可以理解为“带多级索引的有序链表”。普通有序链表查询需要从头扫到尾，时间复杂度是 `O(n)`；跳表在链表上方加了多层索引，查询时可以从高层快速跳过一批节点，再逐层下降。

Redis 的有序集合 ZSet 底层就使用了跳表和哈希表的组合，所以跳表在后端面试里经常和 Redis 一起出现。

文章内容概览：

1. 什么是跳表？
2. 跳表为什么能把查询从 `O(n)` 降到平均 `O(logn)`？
3. 跳表如何查找、插入和删除？
4. 跳表和红黑树应该怎么对比？
5. Redis ZSet 为什么会用到跳表？

![跳表在有序链表上建立多级索引以加速查找](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/skip-list.png)

## 什么是跳表？

跳表（Skip List）是一种基于有序链表的数据结构。它的底层仍然是一条完整的有序链表，所有元素都会出现在最底层；在底层链表之上，跳表再建立若干层更稀疏的索引。

可以把它想成一本书的目录：

- 最底层链表像正文页码，信息最完整，但从第一页翻到最后一页很慢。
- 上层索引像目录，信息更少，但能快速跳到接近目标的位置。
- 查询时先从最高层索引往右跳，跳不动了就下降一层，直到最底层。

跳表和普通链表最大的区别就在这里：普通链表每次只能向后走一步；跳表可以在高层索引中一次跳过多个节点。

## 跳表的节点长什么样？

普通链表节点通常只有一个 `next` 指针，而跳表节点会有多个前进指针。一个节点如果出现在第 3 层，就意味着它在第 0、1、2 层都有对应指针。

抽象来看，跳表节点可以理解成这样：

```java
class SkipListNode {
    int value;
    SkipListNode[] forward;
}
```

这里的 `forward[i]` 表示当前节点在第 `i` 层指向的下一个节点。真实工程实现里还可能保存 score、member、backward 指针、span 等信息，用来支持排名、反向遍历和范围查询。

## 层数是怎么来的？

跳表并不通过旋转、变色来维持平衡，它依赖随机层数。

插入一个新节点时，通常会用随机函数决定它能升到多少层。可以把这个过程想成抛硬币：节点一定会出现在最底层；如果第一次抛到正面，就升一层；再抛到正面，再升一层；直到抛到反面或达到最大层数。

这样做的结果是：越高层的节点越少，越低层的节点越密。理想情况下，第 1 层大约保留一半节点，第 2 层再保留一半，第 3 层继续减少。虽然不是严格平衡，但从概率上看，高度会维持在 `O(logn)` 级别。

这也是跳表名字里“跳”的来源：高层索引允许查询过程跳过一段又一段元素。

## 面试考察重点

- 能说清跳表为什么比普通链表查询快。
- 能描述查找、插入、删除的大致过程。
- 能说明跳表平均查询、插入、删除是 `O(logn)`。
- 能解释跳表和红黑树的取舍。
- 能关联 Redis ZSet 的范围查询场景。

## 跳表怎么查找？

查找时从最高层索引开始：

1. 如果当前节点的下一个节点小于目标值，就向右走。
2. 如果下一个节点大于目标值或为空，就下降一层。
3. 到最底层后继续查找目标节点。

这个过程有点像在有序数组里二分，但跳表底层仍然是链表结构。

更准确地说，跳表每一层都是有序链表。查询时始终遵循一个原则：能往右走就往右走，不能往右走就往下走。

假设要查找 `26`：

1. 从最高层头节点开始。
2. 如果右侧节点值小于 `26`，说明目标还在右边，可以继续右移。
3. 如果右侧节点值大于 `26`，说明再往右就越过目标了，于是下降一层。
4. 重复这个过程，最后在最底层确认目标是否存在。

如果目标不存在，跳表也能找到它应该插入的位置：最底层中小于目标值的最后一个节点，就是插入位置的前驱节点。

## 插入和删除

插入一个节点时，需要先找到每一层中它的前驱节点，然后把新节点接进去。新节点能提升到多少层，通常由随机函数决定。

删除节点时，也要找到各层前驱节点，再把指针绕过目标节点。

跳表不靠旋转维持平衡，而是靠随机层数让索引高度保持在合理范围内。这也是它实现起来比红黑树更容易的地方。

实际写插入代码时，经常会维护一个 `update` 数组：`update[i]` 表示第 `i` 层中新节点应该插入在哪个节点后面。查找插入位置的过程中顺手把这些前驱节点记录下来，拿到随机层数后，就能逐层修改指针。

删除也是类似思路：先找到每一层的前驱节点，如果这一层的下一个节点正好是目标节点，就把前驱节点的 `forward` 指向目标节点的下一个节点。

因此，跳表的插入和删除并不是只改底层链表，还要同步维护目标节点出现过的那些索引层。

## 复杂度

| 操作     | 平均复杂度    | 说明                            |
| -------- | ------------- | ------------------------------- |
| 查找     | `O(logn)`     | 通过多级索引跳过节点            |
| 插入     | `O(logn)`     | 查找位置后更新多层指针          |
| 删除     | `O(logn)`     | 查找前驱后断开指针              |
| 范围查询 | `O(logn + k)` | 先定位起点，再顺序返回 k 个元素 |

空间复杂度是 `O(n)` 级别，但会比普通链表多一些索引指针。

这里的 `O(logn)` 是平均意义上的复杂度，依赖随机层数带来的概率平衡。跳表不像红黑树那样提供严格的最坏情况平衡约束，但在随机函数正常、参数设置合理的情况下，性能通常很稳定。

范围查询是跳表很舒服的场景：先用 `O(logn)` 定位到范围起点，再沿着最底层链表顺序向后遍历 `k` 个结果即可。

## 跳表和红黑树怎么选？

| 对比点     | 跳表                   | 红黑树                         |
| ---------- | ---------------------- | ------------------------------ |
| 平衡方式   | 随机层数               | 旋转和变色                     |
| 实现难度   | 相对更直接             | 插入删除修复更复杂             |
| 范围查询   | 顺着底层链表扫，很方便 | 中序遍历也可以，但实现更绕     |
| 最坏复杂度 | 依赖随机性             | 有严格平衡约束                 |
| 工程代表   | Redis ZSet             | Java `TreeMap`、`HashMap` 树化 |

## Redis ZSet 为什么用跳表？

ZSet 需要支持：

- 按 member 快速查 score。
- 按 score 排序。
- 按 score 范围查询。
- 获取排名。

哈希表适合按 member 查 score，跳表适合按 score 排序和范围查询。两者组合后，ZSet 能同时支持快速查找和有序遍历。

更具体一点：

- 通过哈希表，可以根据 member 直接找到对应 score。
- 通过跳表，可以按 score 从小到大维护顺序。
- 做 `ZRANGE`、`ZRANGEBYSCORE` 这类范围查询时，跳表可以先定位起点，再沿链表连续返回结果。
- 如果跳表节点维护 span 信息，还可以支持排名相关操作。

需要注意，Redis 会根据数据规模和配置使用不同的内部编码来节省内存。面试里说“ZSet 使用哈希表 + 跳表”通常是在讨论它面向较大有序集合时的核心结构。

## 易错点

- 跳表不是数组，也不是二叉树，它的底层是链表。
- 跳表平均复杂度是 `O(logn)`，不是靠严格平衡保证。
- 范围查询是跳表的强项，先定位起点，再沿底层链表遍历。
- Redis ZSet 不是只用跳表，还配合了哈希表。

## 高频问题自测

- 跳表为什么查询快？
- 跳表和红黑树有什么区别？
- Redis ZSet 为什么不用红黑树？
- 跳表的层数怎么决定？
- 跳表范围查询复杂度是多少？

## 参考资料

- [Skip Lists: A Probabilistic Alternative to Balanced Trees](https://dl.acm.org/doi/10.1145/78973.78977)
- [William Pugh：A Skip List Cookbook](https://drum.lib.umd.edu/bitstreams/17176ef8-8330-4a6c-8b75-4cd18c570bec/download)
- [Redis Docs：Sorted Sets](https://redis.io/docs/latest/develop/data-types/sorted-sets/)
- [Redis 源码：t_zset.c](https://github.com/redis/redis/blob/unstable/src/t_zset.c)

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 图详解（DFS、BFS、最短路径）.md -->

## [10] 图详解（DFS、BFS、最短路径）

---
title: 图详解（DFS、BFS、最短路径）
description: 介绍图的基本概念与常用表示，结合 DFS/BFS 等核心算法与应用场景，掌握图论入门必备知识。
category: 计算机基础
tag:
  - 数据结构
head:
  - - meta
    - name: keywords
      content: 图,邻接表,邻接矩阵,DFS,BFS,度,有向图,无向图,连通性
---

# 图

图是一种较为复杂的非线性结构。**为啥说其较为复杂呢？**

根据前面的内容，我们知道：

- 线性数据结构的元素满足唯一的线性关系，每个元素（除第一个和最后一个外）只有一个直接前趋和一个直接后继。
- 树形数据结构的元素之间有着明显的层次关系。

但是，图形结构的元素之间的关系是任意的。

**何为图呢？** 简单来说，图就是由顶点的有穷非空集合和顶点之间的边组成的集合。通常表示为：**G(V,E)**，其中，G 表示一个图，V 表示顶点的集合，E 表示边的集合。

下图所展示的就是图这种数据结构，并且还是一张有向图。

![有向图](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/directed-graph.png)

图在我们日常生活中的例子很多！比如我们在社交软件上好友关系就可以用图来表示。

## 图的基本概念

### 顶点

图中的数据元素，我们称之为顶点，图至少有一个顶点（非空有穷集合）。

对应到好友关系图，每一个用户就代表一个顶点。

### 边

顶点之间的关系用边表示。

对应到好友关系图，两个用户是好友的话，那两者之间就存在一条边。

### 度

度表示一个顶点包含多少条边，在有向图中，还分为出度和入度，出度表示从该顶点出去的边的条数，入度表示进入该顶点的边的条数。

对应到好友关系图，度就代表了某个人的好友数量。

### 无向图和有向图

边表示的是顶点之间的关系，有的关系是双向的，比如同学关系，A 是 B 的同学，那么 B 也肯定是 A 的同学，那么在表示 A 和 B 的关系时，就不用关注方向，用不带箭头的边表示，这样的图就是无向图。

有的关系是有方向的，比如父子关系，师生关系，微博的关注关系，A 是 B 的爸爸，但 B 肯定不是 A 的爸爸，A 关注 B，B 不一定关注 A。在这种情况下，我们就用带箭头的边表示二者的关系，这样的图就是有向图。

### 无权图和带权图

对于一个关系，如果我们只关心关系的有无，而不关心关系有多强，那么就可以用无权图表示二者的关系。

对于一个关系，如果我们既关心关系的有无，也关心关系的强度，比如描述地图上两个城市的关系，需要用到距离，那么就用带权图来表示，带权图中的每一条边用一个数值表示权值，代表关系的强度。

下图就是一个带权有向图。

![带权有向图](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/weighted-directed-graph.png)

## 图的存储

### 邻接矩阵存储

邻接矩阵将图用二维矩阵存储，是一种较为直观的表示方式。

如果第 i 个顶点和第 j 个顶点之间有关系，且关系权值为 n，则 `A[i][j]=n`。

在无向图中，我们只关心关系的有无，所以当顶点 i 和顶点 j 有关系时，`A[i][j]`=1，当顶点 i 和顶点 j 没有关系时，`A[i][j]`=0。如下图所示：

![无向图的邻接矩阵存储](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/adjacency-matrix-representation-of-undirected-graph.png)

值得注意的是：**无向图的邻接矩阵是一个对称矩阵，因为在无向图中，顶点 i 和顶点 j 有关系，则顶点 j 和顶点 i 必有关系。**

![有向图的邻接矩阵存储](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/adjacency-matrix-representation-of-directed-graph.png)

邻接矩阵存储的方式优点是简单直接（直接使用一个二维数组即可），并且，在获取两个顶点之间的关系的时候也非常高效（直接获取指定位置的数组元素的值即可）。但是，这种存储方式的缺点也比较明显，那就是比较浪费空间。

### 邻接表存储

针对上面邻接矩阵比较浪费内存空间的问题，诞生了图的另外一种存储方法——**邻接表**。

邻接链表使用一个链表来存储某个顶点的所有后继相邻顶点。对于图中每个顶点 Vi，把所有邻接于 Vi 的顶点 Vj 链成一个单链表，这个单链表称为顶点 Vi 的 **邻接表**。如下图所示：

![无向图的邻接表存储](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/adjacency-list-representation-of-undirected-graph.png)

![有向图的邻接表存储](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/adjacency-list-representation-of-directed-graph.png)

大家可以数一数邻接表中所存储的元素的个数以及图中边的条数，你会发现：

- 在无向图中，邻接表元素个数等于边的条数的两倍，如左图所示的无向图中，边的条数为 7，邻接表存储的元素个数为 14。
- 在有向图中，邻接表元素个数等于边的条数，如右图所示的有向图中，边的条数为 8，邻接表存储的元素个数为 8。

## 图的搜索

### 广度优先搜索

广度优先搜索就像水面上的波纹一样一层一层向外扩展，如下图所示：

![广度优先搜索图示](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/breadth-first-search.png)

**广度优先搜索的具体实现方式用到了之前所学过的线性数据结构——队列**。具体过程如下图所示：

**第 1 步：**

![广度优先搜索1](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/breadth-first-search1.png)

**第 2 步：**

![广度优先搜索2](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/breadth-first-search2.png)

**第 3 步：**

![广度优先搜索3](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/breadth-first-search3.png)

**第 4 步：**

![广度优先搜索4](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/breadth-first-search4.png)

**第 5 步：**

![广度优先搜索5](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/breadth-first-search5.png)

**第 6 步：**

![广度优先搜索6](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/breadth-first-search6.png)

### 深度优先搜索

深度优先搜索就是“一条路走到黑”，从源顶点开始，一直走到没有后继节点，才回溯到上一顶点，然后继续“一条路走到黑”，如下图所示：

![深度优先搜索图示](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/depth-first-search.png)

**和广度优先搜索类似，深度优先搜索的具体实现用到了另一种线性数据结构——栈**。具体过程如下图所示：

**第 1 步：**

![深度优先搜索1](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/depth-first-search1.png)

**第 2 步：**

![深度优先搜索2](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/depth-first-search2.png)

**第 3 步：**

![深度优先搜索3](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/depth-first-search3.png)

**第 4 步：**

![深度优先搜索4](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/depth-first-search4.png)

**第 5 步：**

![深度优先搜索5](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/depth-first-search5.png)

**第 6 步：**

![深度优先搜索6](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/depth-first-search6.png)

## 面试复盘重点

图题先选存储方式，再选遍历方式。面试里最常见的 4 类图题是：连通块、最短步数、依赖关系和判环。

| 存储方式 | 空间复杂度 | 判断两点是否相邻 | 遍历某点邻居 | 适合场景           |
| -------- | ---------- | ---------------- | ------------ | ------------------ |
| 邻接矩阵 | `O(V^2)`   | `O(1)`           | `O(V)`       | 稠密图、节点数较少 |
| 邻接表   | `O(V + E)` | 取决于邻接表结构 | 和度数有关   | 稀疏图、算法题常用 |

DFS/BFS 模板可以参考 [DFS 与 BFS 面试题总结](../算法/DFS 与 BFS 面试题总结-树、图、矩阵搜索与最短路径模板.md)。这里再补几个面试回答点：

- 邻接表下，DFS 和 BFS 的时间复杂度通常是 `O(V + E)`。
- 无权图求最短步数，优先考虑 BFS。
- 有向图依赖关系常用拓扑排序，典型题是课程表。
- 无向图连通性和判环可以用 DFS/BFS，也可以用并查集。
- 带权最短路径不是普通 BFS，常见算法有 Dijkstra、Bellman-Ford、Floyd，面试中按题目范围选择。

## Java 代码模板

算法题中最常用的是邻接表。节点编号通常是 `0` 到 `n - 1`，可以用 `List<Integer>[]` 表示。

```java
List<Integer>[] buildGraph(int n, int[][] edges) {
    List<Integer>[] graph = new ArrayList[n];
    for (int i = 0; i < n; i++) {
        graph[i] = new ArrayList<>();
    }
    for (int[] edge : edges) {
        int from = edge[0];
        int to = edge[1];
        graph[from].add(to);
        // 无向图需要再加一条反向边：
        // graph[to].add(from);
    }
    return graph;
}
```

BFS 适合求无权图最短步数：

```java
int bfs(List<Integer>[] graph, int start, int target) {
    boolean[] visited = new boolean[graph.length];
    Queue<Integer> queue = new ArrayDeque<>();
    queue.offer(start);
    visited[start] = true;
    int step = 0;
    while (!queue.isEmpty()) {
        int size = queue.size();
        for (int i = 0; i < size; i++) {
            int cur = queue.poll();
            if (cur == target) {
                return step;
            }
            for (int next : graph[cur]) {
                if (!visited[next]) {
                    visited[next] = true;
                    queue.offer(next);
                }
            }
        }
        step++;
    }
    return -1;
}
```

## 过程示意和边界样例

以无权图最短路径为例，BFS 的层序扩散过程可以这样理解：

```text
第 0 层：start
第 1 层：start 的所有未访问邻居
第 2 层：第 1 层节点的所有未访问邻居
...
第一次遇到 target 时，当前层数就是最短步数
```

几个边界样例建议先过一遍：

- `start == target`，答案应该是 `0`。
- 图不连通，目标点不可达，答案应该是 `-1`。
- 无向图建图时忘记加反向边，会把连通图误判成不连通。
- 有环图如果不标记 `visited`，BFS/DFS 会重复访问甚至死循环。

## 推荐练习题

- [200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/)
- [695. 岛屿的最大面积](https://leetcode.cn/problems/max-area-of-island/)
- [994. 腐烂的橘子](https://leetcode.cn/problems/rotting-oranges/)
- [207. 课程表](https://leetcode.cn/problems/course-schedule/)
- [547. 省份数量](https://leetcode.cn/problems/number-of-provinces/)

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 线性数据结构详解（数组、链表、栈、队列）.md -->

## [11] 线性数据结构详解（数组、链表、栈、队列）

---
title: 线性数据结构详解（数组、链表、栈、队列）
description: 总结数组/链表/栈/队列的特性与操作，配合复杂度分析与典型应用，掌握线性结构的选型与实现。
category: 计算机基础
tag:
  - 数据结构
head:
  - - meta
    - name: keywords
      content: 数组,链表,栈,队列,双端队列,复杂度分析,随机访问,插入删除
---

# 线性数据结构

## 1. 数组

**数组（Array）** 是一种很常见的数据结构。它由相同类型的元素（element）组成，并且是使用一块连续的内存来存储。

我们直接可以利用元素的索引（index）可以计算出该元素对应的存储地址。

数组的特点是：**提供随机访问** 并且容量有限。

```java
假如数组的长度为 n。
访问：O(1) //访问特定位置的元素
插入：O(n) //最坏的情况发生在插入发生在数组的首部并需要移动所有元素时
删除：O(n) //最坏的情况发生在删除数组的开头发生并需要移动第一元素后面所有的元素时
```

![数组](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/array.png)

## 2. 链表

### 2.1. 链表简介

**链表（LinkedList）** 虽然是一种线性表，但是并不会按线性的顺序存储数据，使用的不是连续的内存空间来存储数据。

链表的插入和删除操作的复杂度为 O(1)，只需要知道目标位置元素的上一个元素即可。但是，在查找一个节点或者访问特定位置的节点的时候复杂度为 O(n)。

使用链表结构可以克服数组需要预先知道数据大小的缺点，链表结构可以充分利用计算机内存空间，实现灵活的内存动态管理。但链表不会节省空间，相比于数组会占用更多的空间，因为链表中每个节点存放的还有指向其他节点的指针。除此之外，链表不具有数组随机读取的优点。

### 2.2. 链表分类

**常见链表分类：**

1. 单链表
2. 双向链表
3. 循环链表
4. 双向循环链表

```java
假如链表中有n个元素。
访问：O(n) //访问特定位置的元素
插入删除：O(1) //必须要要知道插入元素的位置
```

#### 2.2.1. 单链表

**单链表** 单向链表只有一个方向，结点只有一个后继指针 next 指向后面的节点。因此，链表这种数据结构通常在物理内存上是不连续的。我们习惯性地把第一个结点叫作头结点，链表通常有一个不保存任何值的 head 节点（头结点），通过头结点我们可以遍历整个链表。尾结点通常指向 null。

![单链表](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/single-linkedlist.png)

#### 2.2.2. 循环链表

**循环链表** 其实是一种特殊的单链表，和单链表不同的是循环链表的尾结点不是指向 null，而是指向链表的头结点。

![循环链表](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/circular-linkedlist.png)

#### 2.2.3. 双向链表

**双向链表** 包含两个指针，一个 prev 指向前一个节点，一个 next 指向后一个节点。

![双向链表](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/bidirectional-linkedlist.png)

#### 2.2.4. 双向循环链表

**双向循环链表** 最后一个节点的 next 指向 head，而 head 的 prev 指向最后一个节点，构成一个环。

![双向循环链表](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/bidirectional-circular-linkedlist.png)

### 2.3. 应用场景

- 如果需要支持随机访问的话，链表没办法做到。
- 如果需要存储的数据元素的个数不确定，并且需要经常添加和删除数据的话，使用链表比较合适。
- 如果需要存储的数据元素的个数确定，并且不需要经常添加和删除数据的话，使用数组比较合适。

### 2.4. 数组 vs 链表

- 数组支持随机访问，而链表不支持。
- 数组使用的是连续内存空间对 CPU 的缓存机制友好，链表则相反。
- 数组的大小固定，而链表则天然支持动态扩容。如果声明的数组过小，需要另外申请一个更大的内存空间存放数组元素，然后将原数组拷贝进去，这个操作是比较耗时的！

## 3. 栈

### 3.1. 栈简介

**栈（Stack）** 只允许在有序的线性数据集合的一端（称为栈顶 top）进行加入数据（push）和移除数据（pop）。因而按照 **后进先出（LIFO, Last In First Out）** 的原理运作。**在栈中，push 和 pop 的操作都发生在栈顶。**

栈常用一维数组或链表来实现，用数组实现的栈叫作 **顺序栈**，用链表实现的栈叫作 **链式栈**。

```java
假设堆栈中有n个元素。
访问：O(n) //最坏情况
插入删除：O(1) //顶端插入和删除元素
```

![栈的后进先出结构示意图](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/stack.png)

### 3.2. 栈的常见应用场景

当我们我们要处理的数据只涉及在一端插入和删除数据，并且满足 **后进先出（LIFO, Last In First Out）** 的特性时，我们就可以使用栈这个数据结构。

#### 3.2.1. 实现浏览器的回退和前进功能

我们只需要使用两个栈（Stack1 和 Stack2）就能实现这个功能。比如你按顺序查看了 1,2,3,4 这四个页面，我们依次把 1,2,3,4 这四个页面压入 Stack1 中。当你想回头看 2 这个页面的时候，你点击回退按钮，我们依次把 4,3 这两个页面从 Stack1 弹出，然后压入 Stack2 中。假如你又想回到页面 3，你点击前进按钮，我们将 3 页面从 Stack2 弹出，然后压入到 Stack1 中。示例图如下：

![使用两个栈实现浏览器后退和前进功能](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/stack-browser-back-forward.png)

#### 3.2.2. 检查符号是否成对出现

> 给定一个只包括 `'('`，`')'`，`'{'`，`'}'`，`'['`，`']'` 的字符串，判断该字符串是否有效。
>
> 有效字符串需满足：
>
> 1. 左括号必须用相同类型的右括号闭合。
> 2. 左括号必须以正确的顺序闭合。
>
> 比如 "()"、"()[]{}"、"{[]}" 都是有效字符串，而 "(]"、"([)]" 则不是。

这个问题实际是 Leetcode 的一道题目，我们可以利用栈 `Stack` 来解决这个问题。

1. 首先我们将括号间的对应规则存放在 `Map` 中，这一点应该毋容置疑；
2. 创建一个栈。遍历字符串，如果字符是左括号就直接加入 `stack` 中，否则将 `stack` 的栈顶元素与这个括号做比较，如果不相等就直接返回 false。遍历结束，如果 `stack` 为空，返回 `true`。

```java
public boolean isValid(String s){
    // 括号之间的对应规则
    HashMap<Character, Character> mappings = new HashMap<Character, Character>();
    mappings.put(')', '(');
    mappings.put('}', '{');
    mappings.put(']', '[');
    Stack<Character> stack = new Stack<Character>();
    char[] chars = s.toCharArray();
    for (int i = 0; i < chars.length; i++) {
        if (mappings.containsKey(chars[i])) {
            char topElement = stack.empty() ? '#' : stack.pop();
            if (topElement != mappings.get(chars[i])) {
                return false;
            }
        } else {
            stack.push(chars[i]);
        }
    }
    return stack.isEmpty();
}
```

#### 3.2.3. 反转字符串

将字符串中的每个字符先入栈再出栈就可以了。

#### 3.2.4. 维护函数调用

最后一个被调用的函数必须先完成执行，符合栈的 **后进先出（LIFO, Last In First Out）** 特性。
例如递归函数调用可以通过栈来实现，每次递归调用都会将参数和返回地址压栈。

#### 3.2.5 深度优先遍历（DFS）

在深度优先搜索过程中，栈被用来保存搜索路径，以便回溯到上一层。

### 3.3. 栈的实现

栈既可以通过数组实现，也可以通过链表来实现。不管基于数组还是链表，入栈、出栈的时间复杂度都为 O(1)。

下面我们使用数组来实现一个栈，并且这个栈具有 `push()`、`pop()`（返回栈顶元素并出栈）、`peek()`（返回栈顶元素不出栈）、`isEmpty()`、`size()` 这些基本的方法。

> 提示：每次入栈之前先判断栈的容量是否够用，如果不够用就用 `Arrays.copyOf()` 进行扩容；

```java
public class MyStack {
    private int[] storage;//存放栈中元素的数组
    private int capacity;//栈的容量
    private int count;//栈中元素数量
    private static final int GROW_FACTOR = 2;

    //不带初始容量的构造方法。默认容量为8
    public MyStack() {
        this.capacity = 8;
        this.storage=new int[8];
        this.count = 0;
    }

    //带初始容量的构造方法
    public MyStack(int initialCapacity) {
        if (initialCapacity < 1)
            throw new IllegalArgumentException("Capacity too small.");

        this.capacity = initialCapacity;
        this.storage = new int[initialCapacity];
        this.count = 0;
    }

    //入栈
    public void push(int value) {
        if (count == capacity) {
            ensureCapacity();
        }
        storage[count++] = value;
    }

    //确保容量大小
    private void ensureCapacity() {
        int newCapacity = capacity * GROW_FACTOR;
        storage = Arrays.copyOf(storage, newCapacity);
        capacity = newCapacity;
    }

    //返回栈顶元素并出栈
    public int pop() {
        if (count == 0)
            throw new IllegalArgumentException("Stack is empty.");
        count--;
        return storage[count];
    }

    //返回栈顶元素不出栈
    public int peek() {
        if (count == 0){
            throw new IllegalArgumentException("Stack is empty.");
        }else {
            return storage[count-1];
        }
    }

    //判断栈是否为空
    public boolean isEmpty() {
        return count == 0;
    }

    //返回栈中元素的个数
    public int size() {
        return count;
    }

}
```

验证：

```java
MyStack myStack = new MyStack(3);
myStack.push(1);
myStack.push(2);
myStack.push(3);
myStack.push(4);
myStack.push(5);
myStack.push(6);
myStack.push(7);
myStack.push(8);
System.out.println(myStack.peek());//8
System.out.println(myStack.size());//8
for (int i = 0; i < 8; i++) {
    System.out.println(myStack.pop());
}
System.out.println(myStack.isEmpty());//true
myStack.pop();//报错：java.lang.IllegalArgumentException: Stack is empty.
```

## 4. 队列

### 4.1. 队列简介

**队列（Queue）** 是 **先进先出（FIFO，First In, First Out）** 的线性表。在具体应用中通常用链表或者数组来实现，用数组实现的队列叫作 **顺序队列**，用链表实现的队列叫作 **链式队列**。**队列只允许在后端（rear）进行插入操作也就是入队 enqueue，在前端（front）进行删除操作也就是出队 dequeue。**

队列的操作方式和堆栈类似，唯一的区别在于队列只允许新数据在后端进行添加。

```java
假设队列中有n个元素。
访问：O(n) //最坏情况
插入删除：O(1) //后端插入前端删除元素
```

![队列](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/queue.png)

### 4.2. 队列分类

#### 4.2.1. 单队列

单队列就是常见的队列，每次添加元素时，都是添加到队尾。单队列又分为 **顺序队列（数组实现）** 和 **链式队列（链表实现）**。

**顺序队列存在“假溢出”的问题也就是明明有位置却不能添加的情况。**

假设下图是一个顺序队列，我们将前两个元素 1,2 出队，并入队两个元素 7,8。当进行入队、出队操作的时候，front 和 rear 都会持续往后移动，当 rear 移动到最后的时候，我们无法再往队列中添加数据，即使数组中还有空余空间，这种现象就是 **“假溢出”**。除了假溢出问题之外，如下图所示，当添加元素 8 的时候，rear 指针移动到数组之外（越界）。

> 为了避免当只有一个元素的时候，队头和队尾重合使处理变得麻烦，所以引入两个指针，front 指针指向对头元素，rear 指针指向队列最后一个元素的下一个位置，这样当 front 等于 rear 时，此队列不是还剩一个元素，而是空队列。——From 《大话数据结构》

![顺序队列假溢出](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/seq-queue-false-overflow.png)

#### 4.2.2. 循环队列

循环队列可以解决顺序队列的假溢出和越界问题。解决办法就是：从头开始，这样也就会形成头尾相接的循环，这也就是循环队列名字的由来。

还是用上面的图，我们将 rear 指针指向数组下标为 0 的位置就不会有越界问题了。当我们再向队列中添加元素的时候，rear 向后移动。

![循环队列](https://oss.javaguide.cn/github/javaguide/计算机基础/数据结构/circular-queue.png)

顺序队列中，我们说 `front==rear` 的时候队列为空，循环队列中则不一样，也可能为满，如上图所示。解决办法有两种：

1. 可以设置一个标志变量 `flag`，当 `front==rear` 并且 `flag=0` 的时候队列为空，当 `front==rear` 并且 `flag=1` 的时候队列为满。
2. 队列为空的时候就是 `front==rear`，队列满的时候，我们保证数组还有一个空闲的位置，rear 就指向这个空闲位置，如下图所示，那么现在判断队列是否为满的条件就是：`(rear+1) % QueueSize==front`。

#### 4.2.3 双端队列

**双端队列（Deque）** 是一种在队列的两端都可以进行插入和删除操作的队列，相比单队列来说更加灵活。

一般来说，我们可以对双端队列进行 `addFirst`、`addLast`、`removeFirst` 和 `removeLast` 操作。

#### 4.2.4 优先队列

**优先队列（Priority Queue）** 从底层结构上来讲并非线性的数据结构，它一般是由堆来实现的。

1. 在每个元素入队时，优先队列会将新元素插入堆中并调整堆。
2. 在队头出队时，优先队列会返回堆顶元素并调整堆。

关于堆的具体实现可以看 [堆](https://javaguide.cn/计算机基础/数据结构/heap.html) 这一节。

优先队列只保证队头是当前优先级最高（或最低）的元素，不保证底层数组、迭代器或整个集合全局有序。每次取出队头后，下一优先级的元素才会成为新的队头。

虽然优先队列通常由堆这种非线性结构实现，但它通过队列接口向使用者提供按优先级出队的能力。这里的“优先”只描述出队顺序，不能理解成集合中的所有元素会自动排好序。

### 4.3. 队列的常见应用场景

当我们需要按照一定顺序来处理数据的时候可以考虑使用队列这个数据结构。

- **阻塞队列：** 阻塞队列可以看成在队列基础上加了阻塞操作的队列。当队列为空的时候，出队操作阻塞，当队列满的时候，入队操作阻塞。使用阻塞队列我们可以很容易实现“生产者 - 消费者”模型。
- **线程池中的请求/任务队列：** 当线程池中没有空闲线程时，新的任务请求线程资源会被如何处理呢？答案是这些任务会被放入任务队列中，等待线程池中的线程空闲后再从队列中取出任务执行。任务队列分为无界队列（基于链表实现）和有界队列（基于数组实现）。无界队列的特点是队列容量理论上没有限制，任务可以持续入队，直到系统资源耗尽。例如：`FixedThreadPool` 使用的阻塞队列 `LinkedBlockingQueue`，其默认容量为 `Integer.MAX_VALUE`，因此可以被视为“无界队列”。而有界队列则不同，当队列已满时，如果再有新任务提交，由于队列无法继续容纳任务，线程池会拒绝这些任务，并抛出 `java.util.concurrent.RejectedExecutionException` 异常。
- **栈：** 双端队列可以实现栈的全部功能（`push`、`pop` 和 `peek`），并且在 `Deque` 接口中已经定义了相关方法。`Stack` 没有被标记为废弃，但它是较早的 `Vector` 子类，JDK 文档建议优先使用 `Deque` 及其实现（如 `ArrayDeque`）完成栈操作。
- **广度优先搜索（BFS）：** 在图的广度优先搜索过程中，队列被用于存储待访问的节点，保证按照层次顺序遍历图的节点。
- Linux 内核进程队列（按优先级排队）
- 现实生活中的派对，播放器上的播放列表；
- 消息队列
- 等等……

## 面试复盘重点

线性结构是算法题和 Java 集合的基础，面试里常把数组、链表、栈、队列放在一起对比。

| 结构 | 查询          | 插入/删除         | 典型 Java 类型         | 高频题型                     |
| ---- | ------------- | ----------------- | ---------------------- | ---------------------------- |
| 数组 | 按下标 `O(1)` | 中间位置 `O(n)`   | `ArrayList` 底层数组   | 二分、双指针、前缀和         |
| 链表 | `O(n)`        | 已知节点时 `O(1)` | `LinkedList`           | 反转链表、快慢指针、合并链表 |
| 栈   | 栈顶 `O(1)`   | 栈顶 `O(1)`       | `ArrayDeque`           | 括号匹配、单调栈、DFS        |
| 队列 | 队头 `O(1)`   | 入队/出队 `O(1)`  | `ArrayDeque`、阻塞队列 | BFS、生产者消费者、任务排队  |

几个回答面试题时很有用的点：

- 数组随机访问快，是因为内存连续，可以通过基地址和下标直接计算地址。
- 链表插入删除快有前提：已经拿到要操作位置的节点；如果还要先查找，整体仍然是 `O(n)`。
- Java 中不推荐继续使用 `Stack`，更常见的选择是 `Deque`，比如 `ArrayDeque`。
- 队列在工程里不只用于算法 BFS，也用于线程池任务队列、消息队列、限流削峰等场景。
- 循环队列的关键是区分队空和队满，常见做法是浪费一个位置或单独维护元素数量。

## 推荐练习题

- 数组：[704. 二分查找](https://leetcode.cn/problems/二分查找面试题总结-左右边界、答案二分与 Java 模板/)、[26. 删除有序数组中的重复项](https://leetcode.cn/problems/remove-duplicates-from-sorted-array/)
- 链表：[206. 反转链表](https://leetcode.cn/problems/reverse-linked-list/)、[19. 删除链表的倒数第 N 个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)
- 栈：[20. 有效的括号](https://leetcode.cn/problems/valid-parentheses/)、[739. 每日温度](https://leetcode.cn/problems/daily-temperatures/)
- 队列：[102. 二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)、[239. 滑动窗口最大值](https://leetcode.cn/problems/sliding-window-maximum/)

<!-- @include: @article-footer.snippet.md -->

