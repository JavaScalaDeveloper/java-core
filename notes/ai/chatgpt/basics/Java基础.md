# Java 基础面试笔记

多线程 / 集合并发 → JVM 内存与 GC → **JDK 21 & ZGC**。口述优先结论，再补细节。

---

# 一、多线程与并发

## notify vs notifyAll

| | `notify()` | `notifyAll()` |
|--|------------|---------------|
| 唤醒 | 等待队列中 **一个** 线程（不确定是谁） | **全部** 等待线程 |
| 风险 | 易唤醒「不相关」线程 → 假死/饥饿 | 竞争更激烈，但更安全 |
| 建议 | 明确只有一类等待者时才用 | **一般优先 notifyAll** |

配合 `while` 判条件，不要用 `if`（防止虚假唤醒）。

---

## CountDownLatch / CyclicBarrier / Semaphore

| 工具 | 一句话 | 可复用？ |
|------|--------|----------|
| **CountDownLatch** | 等 N 个事件/线程做完再往下走 | **否**（计数归零结束） |
| **CyclicBarrier** | N 个线程互相等到齐再一起过屏障 | **是**（可 reset） |
| **Semaphore** | 控制同时访问资源的许可数 | 是 |

---

## synchronized / ReentrantLock / ReadWriteLock

| 锁 | 场景 |
|----|------|
| **synchronized** | 简单互斥、JVM 内置、自动释放；非公平；有锁升级 |
| **ReentrantLock** | 要 **公平锁、可中断、tryLock 超时、多条件 Condition** |
| **ReadWriteLock** | **读多写少**；多读共享、写独占 |

### synchronized 锁升级

```text
偏向锁 → 轻量级锁（CAS）→ 重量级锁（OS Mutex）
```

- 偏向：几乎单线程反复进同步块。  
- 轻量：有竞争但短暂，自旋 CAS。  
- 重量：竞争激烈，阻塞/唤醒。  
- **非公平**（与 `ReentrantLock(true)` 公平锁相对）。

> JDK 15+ 默认关闭偏向锁（`-XX:+UseBiasedLocking` 已废弃方向）；面试仍按经典三级答，可补一句「新版本默认直接轻量/重量路径」。

### AQS（一句话 + 结构）

- **state（volatile int）+ CLH 变体等待队列**。  
- `acquire` 失败 → 入队自旋/park；`release` → unpark 后继。  
- 独占：`ReentrantLock`；共享：`Semaphore`、`CountDownLatch`。

---

## volatile

**能保证：** 可见性、有序性（禁止部分重排，写前读后屏障语义）。  
**不能保证：** 复合操作原子性（`i++` 仍要 Atomic / 锁）。

| 适合 volatile | 不适合 |
|---------------|--------|
| 状态标志 `boolean flag` | `counter++` |
| 单次写、多次读的配置 | 读改写复合逻辑 |
| DCL 中的实例引用（配合） | 需要互斥的临界区 |

**为何不能原子：** `i++` = 读 + 加 + 写 三步，中间可交错。

---

## Atomic 与 ABA

- `AtomicInteger` 等基于 **CAS**。  
- **ABA**：值 A→B→A，CAS 以为没变。  
- **解法：** `AtomicStampedReference` / `AtomicMarkableReference`（版本戳）。

---

## 集合线程安全

| 问题 | 原因 | 方案 |
|------|------|------|
| `ConcurrentModificationException` | 遍历中结构被改（fail-fast） | 并发容器 / 迭代器安全策略 |
| ArrayList/HashMap 并发写 | 非线程安全结构 | `Collections.synchronizedXxx`、`CopyOnWrite*`、`ConcurrentHashMap` |

**ConcurrentHashMap（JDK8+）：** 数组 + 链表/红黑树；写时 **CAS / synchronized 锁桶头**，**不是** JDK7 的 Segment。  
**CopyOnWriteArrayList：** 写时复制数组；适合 **读多写极少**（写贵）。

数组按下标访问 **O(1)**：连续内存，`base + index * size` 直接算地址。

---

## ThreadLocal 与弱引用

```text
Thread → ThreadLocalMap → Entry(弱引用 key=ThreadLocal, 强引用 value)
```

- key 弱引用：ThreadLocal 无强引用时可被 GC，避免 map 永远占着 key。  
- **仍可能泄漏：** value 强引用；线程池线程复用 → **用完 `remove()`**。

---

## 线程池（ThreadPoolExecutor）

| 参数 | 作用 |
|------|------|
| `corePoolSize` | 常驻核心线程 |
| `maximumPoolSize` | 最大线程 |
| `keepAliveTime` | 非核心（或允许超时的核心）空闲回收 |
| `workQueue` | 任务队列 |
| `threadFactory` | 建线程（命名、守护） |
| `handler` | 队列满且达最大线程时的拒绝策略 |

**执行顺序（默认）：** 核心满 → 入队 → 队列满再扩到 max → 再满则拒绝。

### 拒绝策略

| 策略 | 行为 | 生产常见 |
|------|------|----------|
| AbortPolicy | 抛异常（默认） | 要感知失败时用 |
| CallerRunsPolicy | 调用者线程跑 | **常用降级**，反压 |
| DiscardPolicy | 丢弃新任务 | 可丢日志类 |
| DiscardOldestPolicy | 丢队头再试 | 慎用 |

### 核心/最大线程经验

| 类型 | 经验 |
|------|------|
| CPU 密集 | ≈ `N` 或 `N+1`（N=CPU） |
| IO 密集 | ≈ `2N` 或 `N / (1-阻塞系数)` |

**例：8C16T，发 1～10000 封邮件（RPC 等 IO）**

- core ≈ 16～32，max 再留余量（如 64），有界队列 + CallerRuns 或 Abort+监控。  
- 邮件任务不是纯 CPU，**不要只按 8 配 core**；结合 RPC 耗时压测。  
- 有界队列防 OOM；拒绝策略要可观测（日志/指标）。

---

## 死锁检测与修复

- **检测：** `jstack`、`ThreadMXBean.findDeadlockedThreads()`、Arthas `thread -b`。  
- **修复：** 统一加锁顺序、`tryLock` 超时、缩小锁粒度、避免嵌套锁；必要时中断/重启单任务（慎）。

---

## 惊群

多个线程同等一个条件，一次 `notifyAll`/事件导致 **全被唤醒再竞争**，无效调度多。  
缓解：精确唤醒、更细锁、事件队列单消费者等。

---

## 乐观锁 / 悲观锁（Java 侧）

| | 代表 |
|--|------|
| 乐观 | CAS、版本号 `version` 字段更新 |
| 悲观 | `synchronized`、`ReentrantLock`、`SELECT FOR UPDATE`（DB） |

---

## Java 8 函数式（常考）

| 接口 | 作用 |
|------|------|
| Predicate | `T → boolean` |
| Consumer | `T → void` |
| Function | `T → R` |
| Supplier | `() → T` |

另有：Lambda、方法引用、Stream、Optional、接口 default 方法。

---

# 二、JVM

## 运行时内存（创建对象去哪）

| 区域 | 存什么 | 线程 |
|------|--------|------|
| 程序计数器 | 字节码行号 | 私有 |
| 虚拟机栈 | 栈帧：局部变量、操作数栈；**对象引用** | 私有 |
| 本地方法栈 | native | 私有 |
| **堆** | **对象实例、数组** | 共享 |
| 方法区/元空间 | 类元数据、常量、静态变量等 | 共享 |

```text
new 对象 → 堆分配实例
局部变量里的引用 → 栈帧局部变量表
```

大对象：`-XX:PretenureSizeThreshold`（部分收集器）可直接进老年代；年龄 ≥ `MaxTenuringThreshold`（默认 15）晋升。

**符号引用 → 直接引用：** 解析阶段把常量池符号变成真实指针/偏移，之后访问更快。

---

## Young GC / Full GC

| | 触发（常见） |
|--|--------------|
| **Young/Minor GC** | Eden 满 |
| **Full GC / Major** | 老年代空间不足、晋升失败、Metaspace 满、显式 `System.gc()`（可禁用）、并发模式失败（CMS 时代）等 |

Survivor 两个区 **对等轮换**（From/To）：复制算法每次清空一边，比例常见 Eden:S0:S1 = 8:1:1，两 Survivor **1:1** 便于复制。

### Full GC 怎么查、怎么调

- 日志：`-Xlog:gc*`（JDK9+）或旧版 `-XX:+PrintGCDetails`。  
- 工具：`jstat -gcutil`、Prometheus/Grafana、GCEasy、Arthas。  
- 调参方向：堆大小、新生代比例、换 G1/ZGC、减少大对象与泄漏、避免乱调 `System.gc()`。

---

## 内存泄漏判断

- 老年代/堆曲线 **只升不降**、频繁 Full GC 后占用仍高、OOM。  
- 手段：`jmap`/`jcmd GC.heap_dump` + MAT；查 ThreadLocal、缓存无界、监听器未卸、连接未关。  
- 「回收泄露内存」= **修代码断引用**，不是调大堆了事。

---

## 监控命令

| 命令 | 用途 |
|------|------|
| jstat | GC、类加载统计 |
| jmap / jcmd | 堆信息、dump |
| jstack / jcmd Thread.print | 线程栈、死锁线索 |
| jhsdb / JFR / JMC | 深度分析 |
| Arthas | 生产诊断：watch、jad、thread、dashboard |

---

## CMS vs G1（历史对比，面试仍问）

| | CMS | G1 |
|--|-----|-----|
| 目标 | 低停顿老年代 | **可预期停顿** + 吞吐平衡 |
| 堆布局 | 连续分代 | **Region** |
| 碎片 | 标记清除 → **碎片** | 复制整理，碎片少 |
| 现状 | JDK14 删除 | **JDK9+ 默认**（至 ZGC 普及前） |

Java 8 时代不少生产仍用 CMS。现在新项目优先 **G1 / ZGC**。

---

## G1 回收器（面试专题）

### G1 是什么？一句话

**Garbage-First**：把堆切成很多 **Region**，优先回收「垃圾最多」的 Region，在 **可预期停顿时间** 内尽量回收更多垃圾。JDK9～17 时代默认收集器，通用业务首选之一。

```text
-XX:+UseG1GC
-XX:MaxGCPauseMillis=200   # 停顿目标（软目标，非硬保证）
```

### Region 模型（必画）

```text
堆 = 大量等大 Region（1～32MB，随堆大小选定）
  ├─ Eden / Survivor  → 年轻代 Region（逻辑分代，物理不连续）
  ├─ Old              → 老年代 Region
  └─ Humongous        → 大对象（≥ Region 一半），占一个或多个连续 Region
```

| 概念 | 要点 |
|------|------|
| **Region** | 回收与空间管理的基本单位 |
| **Remembered Set (RSet)** | 记录「谁指向本 Region」，便于并行回收某几个 Region |
| **Collection Set (CSet)** | 本轮要回收的 Region 集合 |
| **Humongous** | 大对象；分配/回收代价高，易导致碎片感与并发周期压力 |

**口述：** G1 不是整代连续扫，而是按 Region「先收垃圾多的」。

### 回收过程（Young / Mixed）

| 阶段 | 做什么 |
|------|--------|
| **Young GC** | 回收 Eden + Survivor；存活对象拷到 Survivor 或晋升 Old；**STW**，停顿通常较短 |
| **并发标记** | 老年代占用到阈值后启动（如 `InitiatingHeapOccupancyPercent`）；与业务并发标记存活对象 |
| **Remark / Cleanup** | 短暂 STW，结束标记、统计、回收完全空白 Region |
| **Mixed GC** | Young + **部分 Old Region**（选垃圾比例高的进 CSet）；多轮 Mixed 逐步清老年代 |

```text
分配 → Eden 满 → Young GC
老年代占比升高 → 并发标记
标记完 → Mixed GC（年轻代 + 精选老年代 Region）
跟不上 / 失败 → Full GC（单线程压缩，很慢，应尽量避免）
```

### 为什么停顿可控？

- 有 **MaxGCPauseMillis** 目标：根据历史耗时估算本轮 CSet 能收多少 Region。  
- 优先收 **性价比高**（垃圾多）的 Region → Garbage-First。  
- 复制算法整理，**碎片少**（对比 CMS 标记清除）。

**不是硬实时：** 只是尽力满足；分配太猛、Humongous 多、RSet 过重时仍可能超目标甚至 Full GC。

### G1 常见参数（常考）

| 参数 | 含义 |
|------|------|
| `-XX:MaxGCPauseMillis` | 期望最大停顿（默认 200ms） |
| `-XX:InitiatingHeapOccupancyPercent` | 堆占用达该比例启动并发标记（默认约 45） |
| `-XX:G1HeapRegionSize` | Region 大小（一般让 JVM 自选） |
| `-XX:G1NewSizePercent` / `G1MaxNewSizePercent` | 年轻代占比上下限 |
| `-XX:ParallelGCThreads` / `ConcGCThreads` | 并行/并发 GC 线程数 |

调参原则：**先观察再改**；多数场景设好堆 + UseG1GC + 合理 Pause 即可，忌同时拧十几个旋钮。

### G1 优缺点与适用

| 优点 | 缺点 / 注意 |
|------|-------------|
| 停顿可预期、大堆友好 | RSet/标记有 **额外内存与 CPU** |
| 整理拷贝，碎片少 | Humongous 处理不好会抖 |
| 兼顾吞吐与延迟 | 极致低延迟可看 ZGC |
| 调参相对直观 | Full GC 一旦发生很痛（尤其旧版单线程 Full） |

**适用：** 中大堆通用服务、要控 P99、JDK8u40+ / 11/17 生产默认路线。  
**不太适合：** 要亚毫秒级延迟且堆极大 → 评估 ZGC；纯吞吐批处理 → Parallel 也可能更好。

### G1 追问速答

| 问题 | 答法 |
|------|------|
| 和 CMS 比？ | Region + 可预期停顿 + 少碎片；CMS 并发清但碎、已删除 |
| 和 ZGC 比？ | G1 更均衡、生态熟；ZGC 更追低延迟、吃 CPU |
| 什么是 Mixed GC？ | Young + 部分 Old Region，不是一次收完整个老年代 |
| 为何出现 Full GC？ | 并发失败、晋升失败、Metaspace、Humongous 分配失败等；看 GC 日志 |
| 大对象怎么办？ | 避免一次分配超大数组；控 Region；升级 JDK（G1 Full GC 并行化等改进） |

---

## 线上 OOM 故障排查（面试专题）

### OOM 有哪些类型？（先分类再查）

| 异常信息 | 通常含义 | 优先查 |
|----------|----------|--------|
| `Java heap space` | 堆不够或泄漏 | 堆 dump、老年代曲线、大对象 |
| `GC overhead limit exceeded` | GC 太频繁、回收太少 | 同堆泄漏 / 堆过小 |
| `Metaspace` / `PermGen` | 类元数据膨胀 | 动态类加载、热部署、CGLib 过多 |
| `Direct buffer memory` | 堆外直接内存 | Netty/NIO、未释放 DirectByteBuffer |
| `unable to create new native thread` | 线程过多 / 系统线程限制 | 线程池、泄漏线程、`ulimit` |
| `Requested array size exceeds VM limit` | 一次申请超大数组 | 业务 bug、解压/反序列化炸弹 |

**口述：** 先看 **OOM 后缀类型**，再决定 dump 堆还是查线程/堆外/Metaspace。

### 排查总流程（生产口述）

```text
1. 止血：扩容/限流/摘流/重启（保留现场优先）
2. 留证：heap dump、GC 日志、线程栈、监控曲线、变更记录
3. 定界：哪种 OOM？堆内 / Metaspace / 堆外 / 线程？
4. 分析：MAT / jhat / Arthas；定位 Dominator Tree 大户
5. 根因：泄漏 vs 容量不足 vs 突刺流量 vs 参数过小
6. 修复：改代码 / 调参 / 限流降级；回归压测
7. 预防：监控告警、定期 dump 抽样、-XX:+HeapDumpOnOutOfMemoryError
```

**关键原则：** 能留现场再重启；重启只恢复服务，**不代替根因分析**。

### 必开的保命参数

```text
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=/data/logs/heapdump.hprof
-Xlog:gc*:file=/data/logs/gc.log:time,uptime,level,tags   # JDK9+
# 或旧版：-XX:+PrintGCDetails -Xloggc:/data/logs/gc.log
```

配合：容器内存限制与 `-Xmx` 匹配；Prometheus 看堆、GC、线程、DirectMemory。

### 现场命令（常考）

| 步骤 | 命令 / 手段 |
|------|-------------|
| 确认进程 | `jps -lv` / `ps` |
| GC 概况 | `jstat -gcutil <pid> 1000` |
| 堆直方图（未 dump 时） | `jmap -histo:live <pid>` 或 `jcmd <pid> GC.class_histogram` |
| 堆 dump | `jmap -dump:format=b,file=heap.hprof <pid>` / `jcmd … GC.heap_dump` |
| 线程 | `jstack <pid>` / `jcmd Thread.print` |
| 在线诊断 | Arthas：`dashboard`、`heapdump`、`vmtool`、`thread` |
| 分析 dump | **MAT**：Leak Suspects、Dominator Tree、Path to GC Roots |

大堆 dump 慎用 `jmap` 停顿；优先 **已经 OOM 自动 dump**，或低峰 `jcmd`，容器注意磁盘空间。

### 堆 OOM：泄漏 vs 就是小了

| 线索 | 更像泄漏 | 更像容量不足 |
|------|----------|--------------|
| Full GC 后占用 | **降不下来** | 能降，但高峰顶满 |
| 曲线 | 阶梯/斜升数小时～数天 | 与流量高峰同步 |
| dump | 同一业务对象大量被静态集合/缓存引用 | 请求相关短命对象多，或合理缓存过大 |
| 变更 | 新缓存、新监听、ThreadLocal 未 remove | 大促、导入、报表一次拉全表 |

**常见泄漏点：** 无界缓存、`static Map`、监听器未注销、ThreadLocal + 线程池、连接/流未关、Unbounded Queue 线程池、生长的 UUID 级 Session。

### Metaspace OOM

- 动态代理/CGLib、Groovy/JSP、热部署反复加载类。  
- 查：类加载数量是否只增不减；`-XX:MaxMetaspaceSize`；是否自定义 ClassLoader 未卸载。  
- 修复：限制生成类、升级框架、允许类卸载、加大 Metaspace（治标）。

### 堆外 / DirectMemory OOM

- Netty、NIO、堆外缓存；`-XX:MaxDirectMemorySize`。  
- 查：DirectByteBuffer 是否被缓存引用；是否显式 `cleaner`/释放；还有 **native 内存**（jni、压缩库）要靠 OS `RSS` vs 堆对比。  
- **堆不大但进程 RSS 很大** → 怀疑堆外或线程栈、native。

### 线程创建失败

- 线程池无界、每次请求 new Thread、泄漏未结束的线程。  
- `jstack` 看线程数；Linux `ulimit -u`、容器 PID/threads 限制。  
- 修复：有界线程池 + 拒绝策略；虚拟线程场景也要 **限流**，不是无限建。

### 面试案例口述模板

```text
现象：服务 P99 升高后 OOM 重启
类型：日志为 Java heap space，且已配 HeapDumpOnOutOfMemoryError
分析：MAT 显示某 Cache 的 ConcurrentHashMap 占 60%+，Path to GC Roots 为 static 单例
根因：本地缓存无上限 + key 含用户维度，流量上涨后撑爆堆
处理：加 Caffeine 最大条目/TTL；热点改 Redis；临时扩 -Xmx 顶住
预防：缓存指标告警、堆使用率告警、大促前压测
```

### OOM 排查速记

| 问题 | 答法 |
|------|------|
| 第一步？ | 看 OOM **类型** + 是否已有 dump/GC 日志 |
| 怎么抓堆？ | `HeapDumpOnOutOfMemoryError`；或 `jcmd GC.heap_dump` |
| dump 怎么看？ | MAT Dominator Tree + GC Roots 路径 |
| 和 Full GC 关系？ | 堆泄漏常伴随频繁 Full GC 后占用不降 |
| 容器注意？ | `-Xmx` < limit；dump 路径可写；别把 cgroup 内存当无限 |

---

## 堆参数示例（16G 机器，勿照抄）

应用常只拿一部分内存给堆，例如机器 16G，堆给 **8～10G** 更稳（留给 OS、堆外、Metaspace）。

```text
# 示例：堆 8G，G1
-Xms8g -Xmx8g -XX:+UseG1GC -XX:MaxGCPauseMillis=200
-XX:MetaspaceSize=256m -XX:MaxMetaspaceSize=512m
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=/data/logs/heapdump.hprof
```

新生代不必再死板 `-Xmn` 卡死；G1/ZGC 更多靠 Region/自动调节。  
旧分代收集器才常谈 NewRatio、SurvivorRatio。

---

## 类加载

- 双亲委派：加载请求先交给父加载器。  
- 自定义：继承 `ClassLoader`，重写 `findClass`，`defineClass`；打破委派需谨慎改 `loadClass`。  
- 场景：插件隔离、热加载、加密 class、多版本共存。

---

## 值传递

Java **只有值传递**：基本类型传副本；引用类型传 **引用副本**（可改对象内容，不能让调用方引用指向新对象）。

---

## static vs static final

| | static | static final |
|--|--------|--------------|
| 共享 | 类级共享 | 类级共享 |
| 可变 | 可改 | **不可改**（引用常量：引用不可变，对象内容另说） |
| 初始化 | 类加载 | 声明或静态块必须赋值 |

---

# 三、JDK 21 面试专题

JDK 21 = **LTS**（继 11、17）。面试常问：为什么升、虚拟线程、模式匹配、GC 默认、与 17 差异。

## 为什么很多团队升 21？

| 点 | 说明 |
|----|------|
| LTS | 长期支持，比非 LTS 更适合生产 |
| **虚拟线程** | 高并发 IO 模型简化（Project Loom） |
| 语言特性 | Record、Pattern Matching、Sequenced Collection 等成熟 |
| GC | ZGC/G1 持续增强；21 上 ZGC 已生产可用且代际化 |
| 性能/安全 | 持续 JIT、加密、依赖更新 |

---

## 虚拟线程（Virtual Thread）— 最高频

### 是什么？

- JVM 调度的 **轻量线程**，不 1:1 绑操作系统线程。  
- 底层由少量 **Carrier（平台线程）** 承载；阻塞时尽量 **卸下载体去跑别的虚拟线程**。

```java
// 创建
Thread.startVirtualThread(() -> { /* task */ });
try (var exec = Executors.newVirtualThreadPerTaskExecutor()) {
    exec.submit(() -> callRpc());
}
```

### vs 平台线程 / 线程池

| | 平台线程 | 虚拟线程 |
|--|----------|----------|
| 成本 | 重（MB 级栈等） | 轻，可海量 |
| 适合 | CPU 密集、要绑核 | **大量阻塞 IO**（RPC、DB、HTTP） |
| 池化 | 常用线程池限流 | **按任务建虚拟线程**，少用大池限并发（用信号量等限流） |

### 注意点（易追问）

- **不要**在虚拟线程里跑长时间 CPU 占满而不分段。  
- **synchronized 钉住载体**（pinning）：阻塞时可能无法释放载体 → 吞吐下降；JDK 后续持续优化，热点路径可改 `ReentrantLock`。  
- 线程局部：可用，但海量虚拟线程时 ThreadLocal 内存要谨慎；考虑 **Scoped Values**（21 中预览/演进，面试知概念）。  
- 可观测：线程 dump 数量会非常大，工具链需跟进。

**口述：** 虚拟线程让「一请求一线程」重新可行，用同步写法吃异步扩展；本质是 IO 阻塞时挂起虚拟线程而非占死 OS 线程。

---

## 其他 JDK 21 常考特性

| 特性 | 要点 |
|------|------|
| **Record** | 不可变数据载体，自动 equals/hashCode/toString |
| **Pattern Matching for switch** | switch 按类型/模式分支，减少 cast |
| **SequencedCollection** | 有序集合统一 `getFirst`/`getLast`/`reversed` |
| **String Templates**（预览） | 更安全的字符串插值（注意版本是否最终转正） |
| **Foreign Function & Memory API** | 替代部分 JNI，更安全访问堆外/本地库 |
| **Structured Concurrency**（预览） | 结构化启动/取消子任务，防线程泄漏 |
| **Generational ZGC** | 见下一节 |

### 与 JDK 17 对比（速答）

- 17：密封类、模式匹配 instanceof 等已 LTS。  
- 21：虚拟线程转正、分代 ZGC、Sequenced 集合、更多语法打磨。  
- 升 21 最大业务动机常是：**Loom + LTS + GC/性能**。

---

# 四、ZGC 面试专题

## ZGC 是什么？

**Z Garbage Collector**：面向 **超大堆、低延迟** 的垃圾收集器。目标：**停顿时间与堆大小弱相关**（亚毫秒～毫秒级 Pause 目标，具体以版本与负载为准）。

| 项 | 说明 |
|----|------|
| 启用 | `-XX:+UseZGC`（分代：`-XX:+ZGenerational`，JDK21+ 推荐） |
| 堆 | 大堆友好（数十 G～TB 级场景常被提及） |
| 染色指针 | 用指针元数据做标记/重定位状态（Colored Pointers） |
| 读屏障 | Load Barrier，应用线程读引用时协助维护并发正确性 |
| 整理 | 并发转移，减少碎片 |

---

## 为什么能低延迟？

```text
并发标记 → 并发转移/重定位 → 极短 STW 做根扫描等必要阶段
停顿不随堆变大而线性恶化（设计目标）
```

- 多数重活与业务线程 **并发**。  
- **染色指针 + 读屏障**：迁移后仍能正确访问对象。  
- 对比 CMS：少碎片问题；对比 G1：更极致延迟，吞吐/CPU 占用需权衡。

---

## Generational ZGC（JDK 21 重点）

| | 非分代 ZGC | **分代 ZGC（21+）** |
|--|------------|---------------------|
| 想法 | 整堆同等对待 | **年轻代 / 老年代**，热点收年轻对象 |
| 收益 | 实现相对简单 | **吞吐更好、分配率高时更稳**、CPU 更省 |
| 面试点 | 低延迟鼻祖路线 | **21 默认推荐形态**（启用 ZGC 时走分代） |

**口述：** 对象朝生夕灭，分代 ZGC 把回收火力打在年轻对象上，保留 ZGC 低延迟，补上吞吐短板。

---

## ZGC vs G1 vs Parallel（怎么选）

| 收集器 | 更适合 |
|--------|--------|
| **Parallel** | 吞吐优先、可忍受停顿 |
| **G1** | 通用默认；平衡吞吐与停顿；大多数业务 |
| **ZGC** | **延迟敏感**、大堆、要稳定尾延迟（P99） |
| **Shenandoah** | 同类低延迟竞品（偏 OpenJDK 某些发行版） |

**不要说「ZGC 全面替代 G1」：** ZGC 更吃 CPU/内存带宽；小堆、纯吞吐任务 G1/Parallel 可能更香。

---

## ZGC 常见追问

| 问题 | 答法 |
|------|------|
| 停顿真是 0？ | **不是**；仍有极短 STW，但是 **目标与堆大小解耦** |
| 和 G1 Region？ | ZGC 也有类似页面/多映射思想，实现不同；主打染色指针与并发转移 |
| 调参多吗？ | 相对少；常设堆大小 + UseZGC；再观察分配速率与 CPU |
| 大页/ NUMA？ | 大堆生产常配合大页、NUMA 感知，属运维加分项 |
| 中断/ safepoint？ | 仍依赖 safepoint 做少量全局工作，但设计上缩短停顿 |

### 典型参数

```text
-XX:+UseZGC
-XX:+ZGenerational          # JDK21+ 分代
-Xms32g -Xmx32g             # 示例：大堆
-Xlog:gc*:file=gc.log:time,uptime,level,tags
```

---

## Full GC 与 ZGC

- 正常路径以 **并发循环** 为主，少谈传统「Young/Full」话术。  
- 仍可能出现分配失败、GC 跟不上分配等 → 监控 **分配停顿、heap capacity、GC cycle**。  
- 泄漏一样会导致频繁回收与最终 OOM，换 ZGC 治不好泄漏。

---

# 五、面试速记

| 主题 | 一句话 |
|------|--------|
| volatile | 可见+有序，不保 `i++` 原子 |
| AQS | state + 队列；Lock 基石 |
| CHM | JDK8 锁桶头+CAS，非 Segment |
| 线程池 | 核心→队列→最大→拒绝；IO 可多线程 |
| ThreadLocal | 弱 key 仍要 remove 防泄漏 |
| 对象在哪 | 实例在堆，引用常在栈 |
| G1 | Region + RSet/CSet；Young/Mixed；可预期停顿；Garbage-First |
| OOM 排查 | 先分类型 → dump/日志 → MAT 找 GC Roots → 泄漏或容量 |
| **JDK21** | LTS；**虚拟线程**；分代 ZGC |
| **虚拟线程** | 轻量、扛海量阻塞 IO；小心 pinning |
| **ZGC** | 低延迟大堆；染色指针+读屏障；21 分代更优 |

**收口：** 并发抓「可见性/原子/锁升级/线程池」；JVM 抓「G1 Region 模型与 OOM 分类排查」；21 抓「虚拟线程 + ZGC」。
