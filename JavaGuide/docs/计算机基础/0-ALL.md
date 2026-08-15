---
title: 计算机基础 ALL
---

# 计算机基础

> Aggregate of markdown under this directory (excludes README.md, TODO.md).


---

<!-- source: 操作系统/CPU 调度与系统负载详解.md -->

---
title: CPU 调度与系统负载详解
description: CPU 调度和系统负载高频面试题总结，从进程线程为什么需要调度讲起，讲清抢占、时间片、优先级、上下文切换、经典调度算法、Linux CFS/EEVDF、load average、CPU 使用率、I/O wait 和常用排查命令。
category: 计算机基础
tag:
  - 操作系统
  - Linux
  - CPU 调度
head:
  - - meta
    - name: keywords
      content: CPU 调度, 进程调度, 线程调度, 系统负载, load average, CPU 使用率, iowait, CFS, EEVDF, top, uptime, vmstat, pidstat, mpstat, perf top, 操作系统面试题
---

CPU 调度不只是 FCFS、RR、CFS 这些算法名词。排查线上问题时，还要弄清线程为什么被换下去、上下文切换的成本在哪里，以及 load average 很高但 CPU 使用率不高意味着什么。

这些问题背后是同一组约束：CPU 核心有限，任务需要排队，调度器负责决定谁先运行；系统指标则帮助判断任务是在争抢 CPU、等待 I/O，还是卡在内核、中断或虚拟化层。

比如一台有 8 个逻辑 CPU 的机器，load average 已到 40，但 CPU 还有空闲，`%Cpu(s)` 里的 `wa` 长期偏高。此时直接去找 CPU 热点函数可能没有结果，机器上更可能堆了一批等待 I/O 的任务。CPU 使用率和 load average 需要分开判断。

## 为什么需要 CPU 调度

CPU 核心有限，可运行任务可能很多。

在一个 Java 服务中，业务线程、GC 线程、JIT 线程、Netty 事件循环线程都可能要跑；同机还可能有日志采集、监控 Agent、定时任务和数据库客户端。如果系统可用的是 8 个逻辑 CPU，同一时刻最多只能让大约 8 个可运行任务占用 CPU，其余任务只能排队、睡眠或等待 I/O。容器环境还要看 CPU quota，不能只看宿主机物理核心数。

不同系统对调度对象的叫法不完全一样。后端排查时，可先把 Linux 的调度实体理解成能被内核单独安排到 CPU 上运行的执行单元。

一个进程可包含多个线程。它们共享进程地址空间和文件描述符，但各自有栈、寄存器、程序计数器等执行现场。

![程序、进程和线程的关系](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/relationship-between-program-process-and-thread.png)

在 Linux 内核里，进程和线程都用 task 表示，调度器实际调度的是 task 或调度实体；用户态看到的一条线程，大多对应一个内核可调度任务。

如果没有调度，单核机器上的一个死循环就能一直占着 CPU，其他程序没有机会响应。多核机器只是把同一时刻能运行的任务数从 1 个变成 N 个；任务数超过核心数后，仍然要排队和切换。

调度器要兼顾交互响应、公平性、吞吐量、优先级、实时任务、功耗和缓存局部性。这些目标经常互相牵制：时间片长一些，切换会减少，但交互任务可能等更久；时间片短一些，响应会改善，切换开销又会上升。

![CPU 调度取舍关系图](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/scheduler-tradeoff-triangle.webp)

## 任务离开 CPU 的几种情况

一个任务离开 CPU，大致有几类原因。时间片用完只是其中一种情况。

最常见的是任务主动让出 CPU。比如线程调用 `read()` 读取磁盘，数据还没有准备好，它就会进入等待；线程等待锁、条件变量、定时器时，也会从运行态离开。CPU 不应该陪着它空等，调度器会选择其他可运行任务。

另一类是被抢占。通用操作系统通常选用抢占式调度，任务运行一段时间后，时钟中断会给内核一个检查机会；如果当前任务已经运行够了，或者有更合适的任务变为可运行，内核就可能把当前任务换下去。

很多教材为了讲清楚抢占，常常把这个过程简化成：定时器周期性地产生时钟中断。

这个模型可以说明抢占的大致过程。不过，现代 Linux 支持 `NO_HZ` / tickless，会在空闲 CPU 或特定配置下减少调度时钟 tick。定时器和调度 tick 是内核获得抢占检查机会的重要机制，线上机器未必一直按固定频率打 tick。

优先级也会影响调度。高优先级任务排得更靠前，低优先级任务就更容易等待。如果系统完全偏向高优先级任务，低优先级任务可能长期拿不到 CPU，这就是饥饿。教材算法常用动态优先级、老化或队列提升来缓解饥饿；真实系统的处理方式取决于调度类和具体实现。

上下文切换发生在换任务的那一刻。内核要保存当前任务的寄存器、程序计数器、栈指针等现场，再恢复下一个任务。跨进程切换还可能带来页表、TLB、缓存局部性的额外成本。线程很多、锁竞争严重、任务频繁睡眠和唤醒时，业务代码没运行多少，CPU 时间可能先花在调度和同步上。

线程数量需要结合任务类型和 CPU 核数设置。线程可掩盖 I/O 等待，也可利用多核；但线程数量远大于 CPU 核数时，运行队列、上下文切换、缓存失效、锁竞争都会随之上升。

## 经典调度算法

面试里经常会问 FCFS、SJF、RR、优先级、多级反馈队列。

把这些算法放到短任务、长任务和交互任务如何排队的场景中，更容易看出差异。它们主要是教材中的简化模型；真实 Linux 的普通任务调度不会直接照搬某一个算法，还会涉及 CFS/EEVDF、实时调度类、cgroup、CPU affinity、NUMA 等机制。

| 算法         | 选择方式                           | 容易被追问的问题                             |
| ------------ | ---------------------------------- | -------------------------------------------- |
| FCFS         | 先到先服务                         | 长任务排在前面，短任务也要等待               |
| SJF          | 预计运行时间短的先运行             | 很难提前知道任务还要运行多久，长任务可能饥饿 |
| RR           | 每个任务轮流运行一个时间片         | 时间片太短会放大上下文切换，太长又接近 FCFS  |
| 优先级调度   | 优先级高的先运行                   | 低优先级任务可能长期等不到 CPU               |
| 多级反馈队列 | 多个优先级队列，按运行行为调整位置 | 规则和参数较多，实现更复杂                   |

举个例子，线程池前面排了几个大文件压缩任务，后面很多只查缓存的请求也要跟着等待，平均响应时间会被长任务拖坏。SJF 可改善这场景，但前提很强：系统得知道每个任务还要运行多久。真实系统没有这种上帝视角，只能根据历史行为、I/O 等待、交互特性来猜。

RR 更像分时系统的入门模型。每个任务运行一个时间片，运行完放回队列。用户敲命令、移动鼠标、发请求时，不必等长任务完全结束才有响应。上下文切换存在固定成本，因此时间片越短，切换开销占比越高；时间片拉长后，切换成本被摊薄，交互延迟又可能变大。

多级反馈队列同时考虑短任务的响应时间和长任务的推进。新任务一般先进入高优先级队列；如果它总是用完整个时间片，更接近 CPU 密集型长任务，可逐步降级；如果它经常主动等待 I/O，更接近交互或 I/O 型任务，可保留较高优先级。队列数量、时间片和升降级规则都会影响调度效果，实际系统还会叠加更多机制。

## 从 CFS 到 EEVDF

Linux 普通任务调度长期使用 CFS，也就是 Completely Fair Scheduler。

理解 CFS 时，先看 `vruntime`。

`vruntime` 记录任务在公平时间轴上已经运行了多少。任务真实运行一段时间后，内核会把这段时间折算进它的虚拟运行时间；nice 值不同，权重不同，折算速度也不同。调度器倾向于选择 `vruntime` 更小的任务，让各个任务长期按权重分到 CPU。

CFS 没有旧调度器那种固定 timeslice 概念，它更接近在一段时间内按权重分配 CPU 份额。可运行任务少，每个任务可多运行一点；可运行任务多，每个任务分到的片段会变短。CFS 使用红黑树维护按虚拟运行时间排序的可运行任务，通常选择最左边，也就是在公平时间轴上相对获得 CPU 较少的任务。

Linux 6.6 开始在普通任务调度中引入 EEVDF，也就是 Earliest Eligible Virtual Deadline First。

EEVDF 仍然围绕公平分配 CPU 展开，在选择任务时引入了 lag 和虚拟截止时间。lag 为正，表示任务还欠着 CPU 时间；符合条件的任务中，虚拟截止时间更早的任务优先运行。延迟敏感、请求较短时间片的任务，会更早获得调度机会。

在 Linux 的代码和工具输出中，普通任务仍归到 fair 调度类。EEVDF 改变的是 fair class 中的任务选择逻辑，并不意味着所有调度概念都换了一套名字。

线上机器是否已经使用 EEVDF，要看实际内核版本，以及发行版是否回补或调整了相关补丁。生产排查时，不要默认所有机器都是同一套调度实现。

后端面试通常需要说明 CFS 的 `vruntime`、权重和公平份额，以及 EEVDF 的 lag、虚拟截止时间和延迟敏感任务。更细的内容会涉及内核实现。

![CFS 与 EEVDF 对比图](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/cfs-eevdf-comparison.webp)

## load average 和 CPU 使用率不是一回事

`uptime` 里看到的三个 load average 数字，对应 1、5、15 分钟时间尺度上的平均负载。它们是指数衰减平均值，并不是最近 N 分钟采样值的简单算术平均。

load average 统计 R 状态的可运行任务，以及 D 状态的不可中断睡眠任务。D 状态经常与 I/O 有关，但排查时不能只盯本地磁盘，块设备、网络存储、文件系统、Swap 等不可中断等待路径都要考虑。

因此，load 高不等于 CPU 被打满。它既可能来自可运行任务争抢 CPU，也可能是大量任务卡在不可中断等待中。

判断 load 必须结合逻辑 CPU 数。8 个逻辑 CPU 的机器 load 8 左右，可能只是 CPU 被排满；load 40 通常说明大量任务在排队或处于不可中断睡眠。1 个逻辑 CPU 的机器 load 8 已经很紧张，64 个逻辑 CPU 的机器 load 8 可能还较轻。

`/proc/loadavg` 第四个字段形如 `3/1024`。斜杠前面是当前可运行的内核调度实体数量，后面是系统当前存在的调度实体总数。这个字段补充了采样时刻的任务数量，可与前三个平均负载值一起判断。

CPU 使用率看的是 CPU 时间花到了哪里。`top` 里的 `%Cpu(s)` 常见字段可这样读：

- `us`：未调整 nice 值的用户态时间。业务计算、JSON 序列化、正则、压缩、加解密常落在这里。
- `ni`：调整过 nice 值的用户态时间。常见于被调低优先级的用户进程。
- `sy`：内核态时间。系统调用、网络协议栈、文件系统、内核锁竞争会抬高它。
- `wa`：I/O wait。它表示 CPU 空闲且系统有未完成 I/O 请求的时间，适合作为排查线索，不能单独用于精确归因。
- `id`：空闲时间。CPU 没事做，或者任务堵在别的资源上。
- `hi` / `si`：硬中断 / 软中断时间。网络包量大、网卡中断集中、协议栈处理压力大时要关注。
- `st`：虚拟化环境里被宿主机拿走的 CPU 时间。云主机上这值高时，先不要急着改业务代码。

![load average 与 CPU 使用率对比图](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/load-average-vs-cpu-usage.webp)

`wa` 尤其容易被误读。iowait 不是可靠的归因：CPU 不会真的等待 I/O 完成；在多核系统里，等待 I/O 的任务也不运行在某个 CPU 上。因此，`wa` 高只能说明系统存在 I/O 等待线索，不能直接说明 CPU 忙于 I/O。

下一步，应该看 `vmstat` 的 `b`、`bi/bo`、`si/so`，再用 `pidstat -d` 和 `iostat -x` 找具体进程和块设备。

## 从 CPU 报警开始排查

排查时不要一上来就钻进 Java 栈。先把压力类型分出来，再下钻到进程、线程、CPU 核和热点函数。

![CPU 报警排查分支图](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/load-cpu-alert-triage.webp)

`uptime` 先看负载趋势。1 分钟高、5 分钟和 15 分钟不高，可能是短时尖刺；三个值都高，说明压力已持续了一段时间。再打开 `top`，看 `%Cpu(s)` 里是 `us`、`ni`、`sy`、`wa`、`si` 还是 `st` 抬头，同时看进程排序和任务状态。

如果 `us` 很高，先找业务热点。Java 进程可在 `top` 里按 `H` 切到线程视图，找到高 CPU 线程，把线程 ID 转成十六进制，再去 `jstack` 或 `jcmd Thread.print` 里找对应栈。单次 `jstack` 只是一瞬间，最好连续抓 2～3 次；如果同一个线程多次停在同一段业务栈，可信度会更高。也可以使用：

```bash
pidstat -u -t -p <pid> 1
```

它可按线程查看 CPU 使用率。定位到线程后，再看它是在业务循环、序列化、正则、加解密，还是在 GC/JIT。`jstack` 适合看线程当下栈帧；要找 CPU 热点，`perf top`、async-profiler 这类采样工具更可靠。

如果 `sy` 或 `si` 很高，先不要只盯 Java 栈。大量短连接、网络收包、文件 I/O、系统调用、软中断都可能把 CPU 时间抬到内核态。可以使用：

```bash
mpstat -P ALL 1
sudo perf top
```

`mpstat` 看是不是某几个 CPU 核特别忙，`perf top` 看热点符号落在用户态函数、内核网络栈、软中断，还是锁相关路径。某个核心 100%、其他核心很空时，要留意单线程瓶颈、软中断集中在单核、绑核配置或队列倾斜。

如果 load 高、`wa` 也高，先跑：

```bash
vmstat 1
```

重点看 `r`、`b`、`wa`、`bi`、`bo`、`si`、`so`。`r` 是可运行任务数量，`b` 不是所有睡眠线程数量，而是阻塞等待 I/O 的任务数量；`bi/bo` 是块设备读写吞吐，单位通常是 KiB/s，不是 I/O 请求次数；`si/so` 是 Swap 换入换出。`wa` 高同时 `b`、`bi/bo` 高，继续查磁盘；`wa` 高同时 `si/so` 高，内存压力和 Swap 可能已经把服务拖慢。

再用：

```bash
pidstat -d -p ALL 1
iostat -x 1
```

看哪个进程在读写、哪个块设备延迟高。`iostat -x` 重点看 `await`、`aqu-sz`、读写吞吐和请求数，`%util` 对机械盘有参考价值；RAID、SSD、NVMe 能并行处理请求，不能只靠它判断打满。`iostat` 第一行通常是自启动以来的平均值，排查当前问题时更应该看后续采样；必要时可用 `iostat -x -y 1` 跳过第一行。

业务进程 I/O 不高但系统 `wa` 高，也要看日志压缩、备份、数据库、镜像拉取、同节点其他容器。

如果系统支持 PSI，也可看：

```bash
cat /proc/pressure/cpu
cat /proc/pressure/io
cat /proc/pressure/memory
```

PSI 看的是任务因为 CPU、内存、I/O 压力停住了多久。`some` 表示至少有任务因为对应资源不足而停顿；对内存和 I/O，`full` 表示所有非 idle 任务同时停顿。系统级 `/proc/pressure/cpu` 的 `full` 没有诊断意义，排查 CPU 压力时主要看 `some`。PSI 能直接反映业务是否因资源压力而停顿，单看 CPU 使用率无法得到这个信息。

容器环境里还要看 cgroup 限制。一个容器只分到 2 核 quota，即使宿主机有 64 核，容器内的任务也可能已经在排队。排查时要结合 `cpu.max`、`cpu.stat`、`cpu.pressure`、`memory.current`、`memory.events`、`memory.pressure`、`io.stat`、`io.pressure` 等 cgroup 指标，而不是只看宿主机总体 CPU。这里列的是 cgroup v2 常见文件名；如果系统还在使用 cgroup v1，路径和文件名会分散在不同 controller 目录下。

如果 load 高、`wa` 不高，`vmstat 1` 里的 `r` 长期明显大于 CPU 核数，说明可运行任务在排队。接着看线程数、线程池、锁竞争和上下文切换：

```bash
vmstat 1
pidstat -w -p ALL 1
ps -eo pid,ppid,stat,ni,pri,psr,pcpu,comm --sort=-pcpu | head
```

`vmstat` 的 `cs` 可看到系统上下文切换频率，`pidstat -w` 里重点看 `cswch/s` 和 `nvcswch/s`。前者是自愿上下文切换，常见于等待 I/O、锁、条件变量；后者是非自愿上下文切换，常见于时间片用完后被抢占。线程池太大时，`r`、`cs`、CPU 使用率一起上升，请求延迟反而变差，继续加线程只会更堵。

`time` 命令适合看一个单次命令把时间花在哪里：

```bash
/usr/bin/time -p <command>
```

`real` 是墙钟时间，`user` 是用户态 CPU 时间，`sys` 是内核态 CPU 时间。`real` 很长但 `user + sys` 不高，常见于等待 I/O、网络或锁；`user` 很高，说明计算本身消耗 CPU；`sys` 高，则要看系统调用和内核路径。

## 常用排查命令

下面这些命令可以先把大多数 CPU/load 问题分出方向：

| 命令       | 常用写法                                            | 主要看什么                                         |
| ---------- | --------------------------------------------------- | -------------------------------------------------- |
| `uptime`   | `uptime`                                            | 1、5、15 分钟 load average                         |
| `top`      | `top`，进入后按 `H`                                 | 总 CPU、进程/线程 CPU、任务状态、load              |
| `vmstat`   | `vmstat 1`                                          | `r`、`b`、`us/sy/wa/id/st`、`cs`、`bi/bo`、`si/so` |
| `pidstat`  | `pidstat -u -d -w -t -p <pid> 1`                    | 单进程/线程 CPU、I/O、上下文切换                   |
| `iostat`   | `iostat -x 1`                                       | 块设备吞吐、队列长度、平均等待时间、设备利用率     |
| `mpstat`   | `mpstat -P ALL 1`                                   | 每个 CPU 核的使用率、iowait、softirq、steal        |
| `ps`       | `ps -eo pid,stat,ni,pri,psr,pcpu,comm --sort=-pcpu` | 进程状态、优先级、CPU 核、CPU 占用                 |
| `perf top` | `sudo perf top`                                     | 实时 CPU 热点函数，区分用户态和内核态热点          |
| `PSI`      | `cat /proc/pressure/{cpu,io,memory}`                | CPU、I/O、内存压力导致的任务停顿比例               |

`perf top` 的结果取决于 perf 权限以及内核符号、用户态符号和 JIT 符号能否解析；Java 场景下必要时还要结合 async-profiler。

## 面试回答要点

回答 CPU 调度时，需要交代任务为什么排队、内核何时切换任务以及切换会产生哪些成本。这比只背算法名称更完整。

### CPU 调度

> CPU 核心数有限，可运行的进程和线程可能很多。调度器从可运行队列里挑任务上 CPU；任务阻塞、时间片用完、优先级变化，或有更合适任务出现时，内核会调度和上下文切换。调度要在响应时间、吞吐量、公平性和切换开销之间做取舍，线程开太多反而可能把时间花在排队和切换上。

### 经典调度算法怎么回答

> FCFS 简单，但长任务会拖住短任务；SJF 平均周转时间好，但很难知道任务长度，也可能让长任务饥饿；RR 借助时间片改善响应时间，时间片太短会放大切换开销；优先级调度能表达任务紧急程度，但要处理低优先级饥饿；多级反馈队列会根据任务运行行为调整队列位置，尽量照顾交互任务，同时让长任务继续推进。

### Linux 调度

> Linux 普通任务调度不能直接套某个教材算法。CFS 用虚拟运行时间和权重分配 CPU，倾向选择已经获得 CPU 较少的任务；EEVDF 继续围绕公平份额做选择，用 lag 判断任务是否欠 CPU，再按虚拟截止时间选择任务。普通后端岗位讲到这层面即可。

### load average 和 CPU 使用率

> load average 统计 R 状态的可运行任务和 D 状态的不可中断睡眠任务，要结合 CPU 核数看。CPU 使用率描述 CPU 时间去向，`us/ni/sy/wa/id/hi/si/st` 分别对应普通用户态、nice 用户态、内核态、I/O wait、空闲、中断、软中断和虚拟化 steal。load 高但 CPU 不高，常见原因是大量任务处于不可中断睡眠；CPU 高但 load 不夸张，可能是少数线程把 CPU 打满。

如果继续追问排查方法，可以回答：用 `uptime` 和 `top` 定位现象，用 `vmstat` 判断是运行队列、I/O 还是上下文切换问题，再用 `pidstat`、`mpstat` 定位到进程和 CPU 核，必要时通过 `perf top` 查找热点函数。


---

<!-- source: 操作系统/IO 多路复用详解-select、poll、epoll 原理与区别.md -->

---
title: I/O 多路复用详解：select、poll、epoll 原理与区别
description: I/O 多路复用高频面试题总结，从网络读取的两个阶段讲起，拆解 select、poll、epoll 的实现原理、数据结构、性能差异、LT/ET 触发模式，以及 Redis、Nginx、Java NIO 和 Netty 的应用。
category: 计算机基础
tag:
  - 操作系统
  - 网络编程
  - Linux
head:
  - - meta
    - name: keywords
      content: I/O多路复用,IO多路复用,select,poll,epoll,Linux epoll,LT,ET,Java NIO,Netty,Redis,Nginx,操作系统面试题
---

写一个 TCP 服务端，最直觉的写法是：主线程 `accept` 一个连接，就丢给一个新线程去 `read`、处理、`write`。连接少的时候这套跑得很好。

可一旦连接数冲到上万，问题就来了。在不少 Linux 发行版里，新线程默认会预留数 MB 的栈空间，常见配置是 8 MB（实际值取决于 `ulimit -s`、运行库和线程属性）。一万个连接哪怕栈页是按需提交的，预留的地址空间、真正用到的栈页加上线程元数据叠起来也很可观；更要命的是几千上万个线程挤在几个 CPU 核上，光是线程间的上下文切换就把 CPU 啃掉一大半，真正干活的时间所剩无几。更别提大部分连接其实是空闲的——它们各自占着一个线程，却只是在那儿干等数据。

这就是经典的 C10K 问题：**怎么让一个（或少数几个）线程，同时盯着成千上万个连接，谁来数据了就处理谁。**

答案就是 **I/O 多路复用**。

下面按 select、poll、epoll 的顺序往下讲，它们解决的是同一个问题，但一个比一个聪明。

## 什么是 I/O 多路复用？

要讲清楚，得先知道一次网络读操作在内核里其实分成两个阶段：

1. **等数据就绪**：数据还在网卡、还在路上，内核要等它到达并拷进内核缓冲区。这一步往往很慢。
2. **拷数据**：数据到了内核缓冲区，再从内核态拷到用户态的应用缓冲区。这一步很快。

![网络读取中的两个阶段：先等待网卡数据进入内核缓冲区，再通过 copy_to_user 拷贝到用户缓冲区](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/io-multiplexing-io-two-phases.png)

一个连接一个线程的阻塞模型，问题出在第一阶段：线程调用 `recv` 后就卡死在那儿，专门为这一个连接等数据，等的时候什么也干不了。

I/O 多路复用换了个思路：把所有要监听的文件描述符（fd）交给内核，让线程阻塞在一个专门的监听系统调用上。只要这批 fd 里有任意一个就绪，这个调用就返回，告诉你谁可以读、谁可以写了，然后你再去处理那几个就绪的 fd。

打个比方：一个服务员同时管十张桌子，不是站在第一桌死等客人想好菜，而是来回扫一眼，哪桌举手了就去哪桌。

**多路** 指的是多个连接，**复用** 指的是复用同一个线程去处理它们。

注意一个容易混淆的点：多路复用本身仍然是**同步 I/O**。`select` 这类调用只报告 fd 已经就绪，应用仍要主动调用 `recv` 完成读取。同步不等于阻塞：这次 `recv` 是否会等待，还取决于 fd 是否设为非阻塞、就绪状态是否在读取前发生变化等因素。事件循环通常会配合非阻塞 fd 使用。

## 多路复用在五种 I/O 模型里的位置

UNP 把 Unix 下的 I/O 归成五种模型，搞清楚多路复用站在哪一格，比单看它本身更清楚：

- **阻塞 I/O**：调 `recv` 后线程一直睡，等数据就绪再加拷贝两个阶段全程卡死。最简单，也最浪费线程。
- **非阻塞 I/O**：`recv` 没数据立刻返回 `EWOULDBLOCK`，线程不睡，但你得反复轮询去问“好了没”，空转烧 CPU。
- **I/O 多路复用**：阻塞在 `select`/`poll`/`epoll` 上，一个线程同时等多个 fd，谁就绪处理谁。这就是本文主角。
- **信号驱动 I/O**：注册 `SIGIO`，数据就绪时内核发信号通知你，平时线程该干嘛干嘛。用得不多。
- **异步 I/O**：提交请求后立即返回，I/O 完成后再通知应用。这里描述的是语义模型，具体实现取决于平台和 API；例如 Linux glibc 的 POSIX `aio_read` 主要由用户态工作线程实现，不能直接等同于内核原生异步 I/O。

![五种 I/O 模型对比：阻塞 I/O、非阻塞 I/O、I/O 多路复用、信号驱动 I/O 和异步 I/O](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/io-multiplexing-five-io-models.png)

关键区别在于谁来完成“把数据从内核缓冲区搬到用户缓冲区”这个动作：前四种模型里，最终都得由应用自己调 `read`/`recv` 来完成这次复制，调用返回后才能用数据，所以都算**同步**（至于这次调用会不会真的睡，要看 fd 是否非阻塞以及当时数据在不在）；只有异步 I/O 把等待和复制全交给内核，完成后再通知你。多路复用的价值不在于让单次读取变快，而在于让一个线程把“等”这件事一次性摊到多个连接上。

## select 是怎么做的？

`select` 是最早的实现，几乎所有平台都支持。它的函数签名长这样：

```c
#include <sys/select.h>

int select(int nfds, fd_set *readfds, fd_set *writefds,
           fd_set *exceptfds, struct timeval *timeout);
```

核心是 `fd_set` 这个数据结构，本质是一个**位图**：每一位对应一个 fd，置 1 表示关心它。配套有四个宏来操作：

```c
void FD_ZERO(fd_set *set);          // 清空所有位
void FD_SET(int fd, fd_set *set);   // 把 fd 对应的位置 1
void FD_CLR(int fd, fd_set *set);   // 把 fd 对应的位清 0
int  FD_ISSET(int fd, fd_set *set); // 检查 fd 对应的位是否为 1
```

一个用 `select` 写的 echo 服务端，主循环大致是这样：

```c
fd_set rset;
int maxfd = listenfd;

while (1) {
    FD_ZERO(&rset);                       // 每轮都得重新清空
    FD_SET(listenfd, &rset);              // 再把关心的 fd 一个个塞回去
    for (int i = 0; i < n; i++)
        if (conns[i] >= 0) FD_SET(conns[i], &rset);

    // 写集合、异常集合不关心，传 NULL；最后一个 NULL 表示一直阻塞
    int ready = select(maxfd + 1, &rset, NULL, NULL, NULL);

    if (FD_ISSET(listenfd, &rset)) {      // 监听 fd 就绪，有新连接
        int connfd = accept(listenfd, NULL, NULL);
        // 存进 conns[]，更新 maxfd
    }
    for (int i = 0; i < n; i++)           // O(N) 挨个问：你就绪了吗？
        if (conns[i] >= 0 && FD_ISSET(conns[i], &rset)) {
            // 处理这个连接上的读事件
        }
}
```

这段代码里藏着 `select` 的几个硬伤，看清楚它们，才明白后面 poll 和 epoll 在改什么。

**第一，fd 数量有上限**。在 Linux/glibc 环境里，`fd_set` 位图的大小由 glibc 的常量 `FD_SETSIZE` 决定，默认是 1024，只能安全表示 0~1023 的 fd——这个限制来自用户态 glibc 的固定大小数据结构和 `FD_*` 宏，而不是 Linux 内核本身。对超出范围的 fd 使用这些宏属于未定义行为，也别指望靠重定义 `FD_SETSIZE` 或重新编译内核绕过去。真要盯更多连接，正确做法是换用 poll、epoll。

**第二，每次调用都要把位图在用户态和内核态之间来回拷一遍**。调用前你在用户态填好位图，`select` 把它拷进内核；返回时内核改写位图（把没就绪的位清掉），再拷回用户态。内核实际检查和回写的范围由 `nfds` 决定，所以 fd 编号越大、监听越多，这一来一回越费。

**第三，位图是“传入即传出”参数（value-result）**。内核返回时会把没就绪的位清零，所以你下一轮必须 `FD_ZERO` + 重新 `FD_SET` 一遍，老的关心列表不能复用。代码里那句“每轮都得重新清空”就是被这个逼出来的。

**第四，返回后还得自己 O(N) 遍历**。`select` 的返回值只给出就绪 fd 的数量，具体哪些 fd 就绪体现在被原地改写的 `fd_set` 中。应用仍要遍历候选范围并调用 `FD_ISSET`；一万个连接哪怕只有一个来数据，也可能要检查一万次。

`timeout` 这个参数倒是有点用：传 NULL 一直阻塞，传一个 0 值的 `timeval` 表示不等立即返回（轮询），传具体值表示最多等多久。

## poll 改进了什么？

`poll` 和 `select` 是同代产物，思路一致，但换掉了数据结构。它不用位图，改用一个 `pollfd` 结构体数组：

```c
#include <poll.h>

struct pollfd {
    int   fd;       // 要监听的文件描述符
    short events;   // 你关心的事件，调用前填，比如 POLLIN（可读）
    short revents;  // 实际发生的事件，由内核回填
};

int poll(struct pollfd *fds, nfds_t nfds, int timeout);
```

主循环长这样：

```c
struct pollfd fds[MAX];
fds[0].fd = listenfd;
fds[0].events = POLLIN;
// 其余 fds[i].fd = connfd; fds[i].events = POLLIN;

while (1) {
    int ready = poll(fds, nfds, -1);      // timeout 传 -1 表示一直阻塞
    for (int i = 0; i < nfds; i++) {
        if (fds[i].revents & POLLIN) {    // 内核把结果写在 revents 里
            // 处理读事件
        }
    }
}
```

相比 `select`，`poll` 改对了两件事：

**没有 1024 的硬上限**。监听多少个 fd 取决于你传入的数组多大，不再受 `FD_SETSIZE` 卡死，上限主要看进程能打开的 fd 数。

**关心的事件和发生的事件分开了**。`events` 是你填的（输入），`revents` 是内核回填的（输出），两个字段各管各的。这样下一轮不用像 `select` 那样把整个关心列表重置，`events` 保持不动就行。

但 `poll` 没解决 `select` 最要命的两个性能问题：每次调用还是要把整个数组从用户态拷到内核态，返回后还是要 O(N) 遍历整个数组才能找出哪些 fd 就绪。连接规模一上去，开销照样是线性增长。

说白了，`poll` 是把 `select` 的接口擦干净了，性能模型没变。真正的质变在 epoll。

## epoll 为什么是质变？

`epoll` 是 Linux 专有的，由 Davide Libenzi 实现，在 **2.5.44** 内核引入，glibc 2.3.2 开始提供封装。它把“一个系统调用搞定一切”拆成了三个，各司其职：

```c
#include <sys/epoll.h>

int epoll_create1(int flags);  // 创建 epoll 实例，返回一个 fd（旧接口是 epoll_create(int size)）
int epoll_ctl(int epfd, int op, int fd, struct epoll_event *event);  // 增删改要监听的 fd
int epoll_wait(int epfd, struct epoll_event *events, int maxevents, int timeout);  // 等就绪事件
```

其中 `epoll_ctl` 的 `op` 有三种：`EPOLL_CTL_ADD`（注册）、`EPOLL_CTL_MOD`（修改）、`EPOLL_CTL_DEL`（删除）。事件用 `epoll_event` 描述：

```c
typedef union epoll_data {
    void     *ptr;
    int       fd;
    uint32_t  u32;
    uint64_t  u64;
} epoll_data_t;

struct epoll_event {
    uint32_t     events;   // 事件类型，如 EPOLLIN、EPOLLOUT、EPOLLET
    epoll_data_t data;     // 用户数据，epoll_wait 返回时原样带回，通常存 fd
};
```

完整用起来是这样：

```c
int epfd = epoll_create1(0);              // 第一步：建实例

struct epoll_event ev;
ev.events = EPOLLIN;                       // 关心可读，默认水平触发
ev.data.fd = listenfd;
epoll_ctl(epfd, EPOLL_CTL_ADD, listenfd, &ev);  // 第二步：注册一次就够

struct epoll_event events[MAX_EVENTS];
while (1) {
    // 第三步：只返回真正就绪的 fd，n 就是就绪个数
    int n = epoll_wait(epfd, events, MAX_EVENTS, -1);
    for (int i = 0; i < n; i++) {          // 只遍历就绪的，不扫描全集
        int fd = events[i].data.fd;
        if (fd == listenfd) {
            int connfd = accept(listenfd, NULL, NULL);
            ev.events = EPOLLIN;
            ev.data.fd = connfd;
            epoll_ctl(epfd, EPOLL_CTL_ADD, connfd, &ev);  // 新连接注册进去
        } else {
            // 处理 fd 上的读事件
        }
    }
}
```

对比 `select` 那段代码，差别一眼就看出来：注册 fd 和等事件被拆开了，`epoll_wait` 返回的 `events` 数组里**全是就绪的 fd**，遍历它就行，不用再拿所有 fd 挨个问。

这个差别不是接口设计上的小聪明，而是底层数据结构换了。一个 epoll 实例在内核里对应一个 `eventpoll` 结构，里面有两样关键东西：

- **一棵红黑树（rbr）**：存所有通过 `epoll_ctl` 注册进来的 fd（每个 fd 对应一个 `epitem` 节点）。增删改是 O（log N） 的树操作。fd 只在这里登记一次，之后一直待着，不像 select/poll 每次调用都要把全量列表搬进内核。
- **一条就绪链表（rdllist）**：一个双向链表，专门存“已经就绪”的 fd。

![epoll 内部架构：epoll_ctl 维护 interest list，fd 就绪后通过回调进入 ready list，epoll_wait 返回就绪事件](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/io-multiplexing-epoll-architecture.png)

关键在于回调机制。`epoll_ctl` 注册 fd 时，内核会给这个 fd 挂一个回调函数。当网卡来数据、某个 fd 变得可读时，这个回调被触发，把对应的就绪对象挂进就绪链表，并唤醒阻塞在 `epoll_wait` 上的线程。于是 `epoll_wait` 要做的只是看一眼就绪链表空不空——有就把里面的事件拷给用户态，没有就睡觉等回调来唤醒。（补一句：红黑树、就绪链表都是当前内核的实现方式，`epoll` 对用户态承诺的只是“注册集合 + 就绪列表”这层抽象语义，别把树结构当成稳定的 ABI。）

这就是 epoll 高效的根子：在海量连接、少量活跃的场景下，`epoll_wait` 返回后要遍历的就只是本批次就绪的事件，和“注册的 fd 总量”无关。注册十万个 fd、其中只有三个来数据，`epoll_wait` 就只处理这三个，不用像 select/poll 那样每次扫描全集。但要强调：epoll 的整体成本不只是 `epoll_wait` 返回这一下——注册变更（`epoll_ctl`）、事件回调、并发锁竞争、把就绪事件拷回用户态都有开销；当连接活跃比例接近 100% 时，它相对 select/poll 的优势也会缩小。一句话总结：select 和 poll 每次等待都要把完整监听集合交给内核并线性扫描；epoll 把监听集合长期保存在内核里，等待时只取已经就绪的事件，因此更适合大量 fd、少量活跃连接的场景。

数据拷贝也省了。fd 通过 `epoll_ctl` 一次性登记在红黑树上，之后 `epoll_wait` 反复调用都不用再重传整个 fd 列表。

这里得纠正一个流传很广的说法：“epoll 之所以快，是因为它用 mmap 在内核和用户态之间共享内存，省掉了拷贝。”这个说法是错的。翻 epoll 的内核实现就能看到，`epoll_wait` 返回时是实打实地用 `__put_user` 把就绪事件拷到用户态的 `events` 数组里，并没有什么 mmap 共享区。epoll 省掉的拷贝是另一回事：是省掉了 select/poll 那种“每次调用都把全量 fd 列表搬进内核”的重复拷贝，而不是省掉返回就绪事件这一次拷贝。这两件事别混为一谈。

## 水平触发和边缘触发，区别在哪？

epoll 支持两种触发模式，这是它比 select/poll 多出来的一个能力，也是面试和实战里最容易踩坑的地方。

**水平触发（LT，Level Triggered）** 是默认模式。只要 fd 上还有数据没读完（或者还有空间可写），每次 `epoll_wait` 都会一直通知你。select 和 poll 只有这一种模式。

**边缘触发（ET，Edge Triggered）** 要显式加 `EPOLLET` 标志。它只在状态**发生变化**的那一刻通知一次。

用一个具体场景说清楚区别（这也是 Linux man page 里的经典例子）：假设对端往一个 socket 写了 2 KB 数据。

- LT 模式：`epoll_wait` 通知你可读。你只读了 1 KB，缓冲区里还剩 1 KB。下次 `epoll_wait` 还会继续通知你“这儿有数据没读完”，直到你把 2 KB 读干净。
- ET 模式：`epoll_wait` 通知你一次。你只读了 1 KB 就走了，那剩下的 1 KB——除非对端又写了新数据、状态再次发生变化，`epoll_wait` 不会主动再为它通知你。这 1 KB 可能就长期躺在缓冲区里，连接迟迟得不到处理。

![水平触发和边缘触发对比：LT 在数据未读完时会持续通知，ET 只在状态变化时通知一次](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/io-multiplexing-lt-vs-et.png)

所以用 ET 必须遵守两条铁律：**fd 设为非阻塞**，并且**循环 `read` 直到返回 `EAGAIN`（或 `EWOULDBLOCK`）**，确保一次把数据彻底读空。典型的 ET 读法是这样：

```c
// 前提：connfd 已设为非阻塞，且注册时带了 EPOLLET
while (1) {
    ssize_t n = read(connfd, buf, sizeof(buf));
    if (n > 0) {
        // 处理这批数据，然后继续循环把缓冲区抽干
    } else if (n == 0) {
        close(connfd);                 // 对端关闭连接
        break;
    } else {  // n < 0
        if (errno == EAGAIN || errno == EWOULDBLOCK)
            break;                      // 数据读完了，这才是正常退出点
        if (errno == EINTR)
            continue;                   // 被信号打断，重试
        close(connfd);                  // 真出错了
        break;
    }
}
```

如果 fd 是阻塞的，最后一次没数据的 `read` 会把整个线程卡死在这里——这也是为什么 ET 和非阻塞 fd 必须成对出现。

ET 的好处是减少 `epoll_wait` 的唤醒次数，适合追求极致吞吐、又能把读写逻辑写严谨的场景；代价是编程门槛明显更高，漏读 `EAGAIN` 导致连接长期停滞是这类代码最常见的 bug。反过来，如果为了“读干净”在单个活跃 fd 上一直读，又可能饿死其他连接，所以工程上常给每个 fd 设单轮处理预算、配合应用层就绪队列轮转。LT 编程简单、不容易出错，绝大多数业务用 LT 就够了。Nginx 这类对性能敏感的服务才会用 ET。

写生产级事件循环时，光会读还不够，还有一圈边角要处理：`epoll_wait` 被信号打断返回 `EINTR` 要重试；ET 下 `accept` 同样得循环到 `EAGAIN`；`EPOLLERR`/`EPOLLHUP`/`EPOLLRDHUP` 要和读写事件一起判断；`read` 返回 0 表示对端关闭了写方向；`write` 可能短写，得自己缓存没发完的数据并按需注册 `EPOLLOUT`；多线程处理同一个 fd 时，考虑用 `EPOLLONESHOT` 配合重新武装（rearm）。

## 三者横向对比

把前面拆开讲的东西汇总成一张表，方便横向看：

| 维度               | select                                                                       | poll                                                                | epoll                                                                        |
| ------------------ | ---------------------------------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 平台               | 跨平台较好；Unix、Windows 均有（Windows 主要用于 socket）                    | 主要用于 Unix-like 系统                                             | Linux 专有（Linux 2.6+）                                                     |
| 内核侧管理         | 每次调用临时检查 fd 集合                                                     | 每次调用临时检查 fd 数组                                            | 长期维护 interest list 和 ready list；Linux 当前实现通常使用红黑树和就绪链表 |
| fd 数量限制        | 受 `FD_SETSIZE` 限制；Linux glibc 通常为 1024，只能安全处理编号 0~1023 的 fd | 不受 `FD_SETSIZE` 限制，但仍受 `RLIMIT_NOFILE` 和内存约束           | 不受 `FD_SETSIZE` 限制，但受文件描述符、内存和 `max_user_watches` 等限制     |
| 每次等待的传参     | 每轮传入完整位图，返回后集合被修改，下轮必须重建                             | 每轮传入完整 `pollfd` 数组，内核填写 `revents`（`events` 不用重建） | 监听集合通过 `epoll_ctl` 维护，`epoll_wait` 只接收就绪事件                   |
| 查找就绪 fd 的开销 | 扫描到 `nfds - 1`，通常记作 O(N)                                             | 遍历整个数组，O(N)                                                  | 等待阶段不扫描完整监听集合，返回成本主要与就绪事件数有关                     |
| 触发模式           | 仅 LT                                                                        | 仅 LT                                                               | 默认 LT，也支持 ET（`EPOLLET`）                                              |

![select、poll 和 epoll 对比：数据结构、fd 限制、每次等待传参、查找就绪 fd 的开销和触发模式](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/io-multiplexing-select-poll-epoll.png)

## epoll 不是银弹

讲到这儿很容易得出“epoll 全面碾压”的结论，但实战里没这么绝对，有几个边界值得记住。

**连接少且都很活跃时，epoll 不一定更快**。epoll 维护红黑树、挂回调、走就绪链表这套机制本身有固定开销。如果你只盯着几十个 fd，而且它们几乎每次都有数据，那么 select/poll 那种“一把梭遍历”反而更直接、更省。epoll 的主场是**海量连接 + 大部分空闲**：几万条长连接挂着，同一时刻只有少数活跃，这时候只盯就绪的那几个才真正划算。

**它是 Linux 专有的**。macOS 和 BSD 上对应的是 `kqueue`，Windows 上是 IOCP。要写跨平台的网络程序，一般不会直接调 epoll，而是用 libevent、libuv 这类封装库，让它们在 Linux 上走 epoll、在别的系统上走对应实现。

**惊群问题**。多个进程/线程在同一个 listen fd 上等事件时，一个连接到来可能把它们全唤醒，但只有一个能 `accept` 成功，其余白忙一场。Linux 4.5 之后可以用 `EPOLLEXCLUSIVE` 标志缓解，让内核在多个 exclusive waiter 里只唤醒一个、或较少的几个；它并不是在所有部署形态（比如多个 epoll 实例、混用非 exclusive 注册）下都“严格只唤醒一个”的保证。

**ET 模式的坑前面说过**：一旦漏读没到 `EAGAIN`，剩余数据可能长期不再触发通知，连接迟迟得不到处理。这不是性能问题，是正确性问题，调试起来还很隐蔽。没把握就老老实实用 LT。

## 它们都用在哪儿

这套机制不是停在课本上的概念，常见的高性能组件底层都靠它。

**Redis** 是单线程事件循环 + I/O 多路复用的典型。它没有为每个客户端开线程，而是用一个线程通过多路复用同时监听大量 socket，谁就绪了就调对应的事件处理器。Redis 自己封装了一层（`ae.c`），在不同平台上分别选 epoll、kqueue 或 select。这也是它单线程还能扛住高并发的关键之一，省掉了多线程的上下文切换和锁竞争。

![文件事件处理器（file event handler）](https://oss.javaguide.cn/github/javaguide/数据库/redis/redis-event-handler.png)

补充一个常被误解的点：Redis 6.0 引入了多线程，但加的只是网络 I/O 读写和协议解析这部分，命令的实际执行仍然是单线程。多路复用这套事件循环的内核没变，多线程只是把“读 socket、解析请求”这种耗时的活儿分摊到几个线程上，避免它成为单线程的瓶颈。

详细介绍推荐你看看这篇文章：[Redis常见面试题总结(上)](https://javaguide.cn/数据库/redis/redis-questions-01.html)。

**Nginx** 是多进程 + epoll，而且用的是 ET 模式，配合非阻塞 socket 把每次唤醒的处理压到最少，这是它能用很少的进程扛住海量连接的底子。

**Java NIO** 里的 `Selector` 就是多路复用的 Java 封装。在 Linux 上，`Selector` 底层走的就是 epoll（对应 `EPollSelectorImpl`）；换到别的系统会换成对应实现，这层切换对上层代码透明。

![Selector 选择器工作示意图](https://oss.javaguide.cn/github/javaguide/java/nio/selector-channel-selectionkey.png)

Netty 在标准 NIO 之外还额外提供了一套原生 epoll 传输（`EpollEventLoop`），直接对接 epoll、绕开 JDK 那层封装，在 Linux 上能榨出更高的性能。这里要留意版本差异：Netty 4.0 的原生 epoll transport 曾主打边缘触发；到了 Netty 4.2，`EpollMode` 已被标记废弃，并注明 transport 始终使用水平触发。中间 4.1 各小版本的行为以所用版本的源码和 API 为准。

另外，关于 Java I/O 模型的针对性详细介绍，可以阅读这篇文章：[Java I/O 模型详解](https://javaguide.cn/java/io/io-model.html)。

## 面试里怎么答？

问“I/O 多路复用解决什么问题”，别答成“让一次 read 更快”。它解决的是“等”的问题：一个线程不用阻塞在单个连接上，而是把一批 fd 交给 `select`、`poll` 或 `epoll`，哪个 fd 就绪了再处理哪个。真正把数据从内核缓冲区拷到用户缓冲区的 `read/recv` 仍然是应用自己调用，所以它属于同步 I/O 模型。

`select`、`poll`、`epoll` 的区别可以从三点展开。第一，数据结构不同：`select` 用固定大小的 `fd_set` 位图，Linux glibc 下通常受 1024 限制；`poll` 换成 `pollfd` 数组，绕开了 `FD_SETSIZE`，但数组仍然每次传进内核；`epoll` 把监听集合长期放在内核里，通过 `epoll_ctl` 增删改，`epoll_wait` 只拿就绪事件。

第二，性能模型不同。`select` 和 `poll` 每次等待都要传完整集合，返回后还得线性扫描，连接多但活跃少时很亏；`epoll` 适合大量 fd、少量活跃连接，因为等待阶段不用扫描完整监听集合，返回成本主要和本轮就绪事件数相关。不过它不是所有场景都更快，连接很少且都很活跃时，维护回调、红黑树和就绪链表的固定成本也要算进去。

第三，`epoll` 的 LT/ET 经常被追问。LT 是默认模式，只要缓冲区还有数据没读完，下次还会通知；ET 只在状态变化时通知一次，所以必须配合非阻塞 fd，并循环读到 `EAGAIN`。面试里能把这句话说清楚，再补上 `EINTR`、短写、`EPOLLHUP/EPOLLERR` 这些生产代码要处理的边角，基本就不是只会背概念了。

## 参考

- [W. Richard Stevens《UNIX Network Programming》Chapter 6（select/poll 与五种 I/O 模型）](https://notes.shichao.io/unp/ch6/)
- [epoll(7) - Linux manual page](https://man7.org/linux/man-pages/man7/epoll.7.html)
- [epoll_create(2) / epoll_ctl(2) / epoll_wait(2) - Linux manual pages](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)
- [epoll final interface（LWN，记录 epoll 在 2.5.44 引入）](https://lwn.net/Articles/16026/)


---

<!-- source: 操作系统/Linux 基础知识总结.md -->

---
title: Linux 基础知识总结
description: 简单介绍一下 Java 程序员必知的 Linux 的一些概念以及常见命令。
category: 计算机基础
tag:
  - 操作系统
  - Linux
head:
  - - meta
    - name: keywords
      content: Linux,基础命令,发行版,文件系统,权限,进程,网络
---

简单介绍一下 Java 程序员必知的 Linux 的一些概念以及常见命令。

## 初探 Linux

### Linux 简介

通过以下三点可以概括 Linux 到底是什么：

- **类 Unix 系统**：Linux 是一种自由、开放源码的类似 Unix 的操作系统。
- **Linux 本质是指 Linux 内核**：严格来讲，Linux 这个词本身只表示 Linux 内核，单独的 Linux 内核并不能成为一个可以正常工作的操作系统。所以，就有了各种 Linux 发行版。
- **Linux 之父（林纳斯·本纳第克特·托瓦兹 Linus Benedict Torvalds）**：一个编程领域的传奇式人物，真大佬！我辈崇拜敬仰之楷模。他是 **Linux 内核** 的最早作者，随后发起了这个开源项目，担任 Linux 内核的首要架构师。他还发起了 Git 这个开源项目，并为主要的开发者。

![Linux 创始人 Linus Torvalds](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/linux/linux-father.png)

### Linux 诞生

1989 年，Linus Torvalds 进入芬兰陆军新地区旅，服 11 个月的国家义务兵役，军衔为少尉，主要服务于计算机部门，任务是弹道计算。服役期间，购买了安德鲁·斯图尔特·塔能鲍姆所著的教科书及 minix 源代码，开始研究操作系统。1990 年，他退伍后回到大学，开始接触 Unix。

> **Minix** 是一个迷你版本的类 Unix 操作系统，由塔能鲍姆教授为了教学之用而创作，采用微核心设计。它启发了 Linux 内核的创作。

1991 年，Linus Torvalds 开源了 Linux 内核。Linux 以一只可爱的企鹅作为标志，象征着敢作敢为、热爱生活。

![Linux 操作系统 Logo](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/linux/Linux-Logo.png)

### 常见的 Linux 发行版本

![Linux 操作系统桌面与命令行界面](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/linux/linux.png)

Linus Torvalds 开源的只是 Linux 内核，我们上面也提到了操作系统内核的作用。一些组织或厂商将 Linux 内核与各种软件和文档包装起来，并提供系统安装界面和系统配置、设定与管理工具，就构成了 Linux 的发行版本。

> 内核主要负责系统的内存管理，硬件设备的管理，文件系统的管理以及应用程序的管理。

Linux 的发行版本可以大体分为两类：

- **商业公司维护的发行版本**：比如 Red Hat 公司维护支持的 Red Hat Enterprise Linux（RHEL）。
- **社区组织维护的发行版本**：比如基于 Red Hat Enterprise Linux（RHEL）的 CentOS、基于 Debian 的 Ubuntu。

对于初学者学习 Linux，不建议再无条件选择 CentOS。CentOS Linux 8 已在 2021 年底停止维护，CentOS Linux 7 也已在 2024 年 6 月结束生命周期；现在的 CentOS Stream 是 RHEL 的上游持续交付分支，定位和过去“稳定的 RHEL 兼容重构版”不一样。

更稳妥的选择是：

- 想学习企业服务器环境、RHEL 生态：优先选择 Rocky Linux 或 AlmaLinux。
- 想快速上手、资料多、桌面和服务器都常见：选择 Ubuntu LTS。
- 想要稳定、轻量、贴近社区发行版：选择 Debian。

如果你的公司环境仍在使用 CentOS，可以按实际环境学习对应版本；但新装学习环境时，更推荐选择仍在维护的发行版。

## Linux 文件系统

### Linux 文件系统简介

在 Linux 操作系统中，一切被操作系统管理的资源，如网络接口卡、磁盘驱动器、打印机、输入输出设备、普通文件或目录等，都被视为文件。这是 Linux 系统中一个重要的概念，即“一切都是文件”。

这种概念源自 UNIX 哲学，即将所有资源都抽象为文件的方式来进行管理和访问。Linux 的文件系统也借鉴了 UNIX 文件系统的设计理念。这种设计使得 Linux 系统可以通过统一的文件接口来管理和操作不同类型的资源，从而实现了一种统一的文件操作方式。例如，可以使用类似于读写文件的方式来对待网络接口、磁盘驱动器、设备文件等，使得操作和管理这些资源更加统一和简便。

这种文件为中心的设计理念为 Linux 系统带来了灵活性和可扩展性，使得 Linux 成为一种强大的操作系统。同时，这也是 Linux 系统的一大特点，深受广大用户和开发者的喜欢和推崇。

### inode 介绍

inode 是 Linux/Unix 文件系统的基础。那 inode 到底是什么？有什么作用呢？

通过以下五点可以概括 inode 到底是什么：

1. 硬盘以扇区（Sector）为最小物理存储单位，而操作系统和文件系统通常以块（Block）为单位进行读写，块由多个扇区组成。传统磁盘扇区常见大小是 512 字节，现代磁盘也常见 4 KB 物理扇区（例如 512e/4Kn 设备）；文件系统块大小也常见 4 KB，但两者不是一个概念。文件元信息（例如权限、大小、修改时间以及数据块或 extent 的映射）通常记录在 inode（索引节点）中。inode 号只保证在同一个文件系统内唯一，多个硬链接目录项可以指向同一个 inode。固态硬盘（SSD）虽然没有传统机械磁盘意义上的物理扇区，但仍然对外暴露逻辑块接口。
2. 在 ext2/ext3/ext4 这类文件系统中，磁盘上的 inode 记录大小会在创建文件系统时确定；其他 Linux 文件系统的元数据布局可能不同。
3. inode 的访问速度非常快，因为系统可以直接通过 inode 号码定位到文件的元数据信息，无需遍历整个文件系统。
4. ext2/ext3/ext4 等文件系统会在创建文件系统时确定可用 inode 数量，inode 用完后，即使还有数据块空间也无法创建新文件。并非所有 Linux 文件系统都采用固定 inode 表，排查时要结合具体文件系统实现。
5. 可以使用 `stat` 命令查看文件的 inode 信息，包括文件的 inode 号、文件类型、权限、所有者、文件大小、修改时间。

简单来说：inode 就是用来维护某个文件被分成几块、每一块在的地址、文件拥有者、创建时间、权限、大小等信息。

再总结一下 inode 和 block：

- **inode**：记录文件的属性信息，可以使用 `stat` 命令查看 inode 信息。
- **block/extent**：用于保存文件内容或描述连续的数据块范围。具体分配和共享方式取决于文件系统，不能概括成“一个块永远只属于一个文件”。

![stat 命令查看文件 inode 信息](./images/文件inode信息.png)

Linux/Unix 文件系统使用 inode 标识文件系统对象。同一文件系统内重命名文件时，通常只是修改目录项，inode 号不会改变；删除最后一个硬链接后，如果也没有进程继续打开该文件，inode 会被释放，其编号以后可能被复用。通过路径访问文件时仍要先解析目录项，不能绕过路径查找直接把 inode 号当成稳定的全局文件标识。

不过，使用 inode 号码也使得文件系统在用户和应用程序层面更加抽象和复杂，需要通过系统命令或文件系统接口来访问和管理文件的 inode 信息。

### 硬链接和软链接

在 Linux/类 Unix 系统上，硬链接和符号链接的实现并不相同：硬链接是另一个指向同一 inode 的目录项，符号链接则是具有独立 inode 的特殊文件。

**1、硬链接（Hard Link）**

- 在 Linux/类 Unix 文件系统中，每个文件和目录都有一个唯一的索引节点（inode）号，用来标识该文件或目录。硬链接通过 inode 节点号建立连接，硬链接和源文件的 inode 节点号相同，两者对文件系统来说是完全平等的（可以看作是互为硬链接，源头是同一份文件），删除其中任何一个对另外一个没有影响，可以通过给文件设置硬链接文件来防止重要文件被误删。
- 只有删除了源文件和所有对应的硬链接文件，该文件才会被真正删除。
- 硬链接具有一些限制，不能对目录以及不存在的文件创建硬链接，并且，硬链接也不能跨越文件系统。
- `ln` 命令用于创建硬链接。

**2、软链接（Symbolic Link 或 Symlink）**

- 软链接和源文件的 inode 节点号不同，而是指向一个文件路径。
- 源文件删除后，软链接依然存在，但是指向的是一个无效的文件路径。
- 软链接类似于 Windows 系统中的快捷方式。
- 不同于硬链接，可以对目录或者不存在的文件创建软链接，并且，软链接可以跨越文件系统。
- `ln -s` 命令用于创建软链接。

**硬链接为什么不能跨文件系统？**

我们之前提到过，硬链接是通过 inode 节点号建立连接的，而硬链接和源文件共享相同的 inode 节点号。

每个文件系统都有独立的 inode 命名空间，目录项只能引用本文件系统内的 inode，无法直接指向另一个文件系统中的 inode。因此，硬链接不能跨越文件系统边界，这不是简单的 inode 号冲突问题。

### Linux 文件类型

Linux 支持很多文件类型，其中非常重要的文件类型有：**普通文件**、**目录文件**、**链接文件**、**设备文件**、**管道文件**、**Socket 套接字文件** 等。

- **普通文件（-）**：用于存储信息和数据，Linux 用户可以根据访问权限对普通文件进行查看、更改和删除。比如：图片、声音、PDF、text、视频、源代码等等。
- **目录文件（d，directory file）**：目录也是文件的一种，用于表示和管理系统中的文件，目录文件中包含一些文件名和子目录名。打开目录事实上就是打开目录文件。
- **符号链接文件（l，symbolic link）**：保存目标路径字符串。访问符号链接时，内核会按这个路径重新解析目标。
- **字符设备（c，char）**：用来访问字符设备比如键盘。
- **设备文件（b，block）**：用来访问块设备比如硬盘、软盘。
- **管道文件（p，pipe）**：一种特殊类型的文件，用于进程之间的通信。
- **套接字文件（s，socket）**：用于进程间的网络通信，也可以用于本机之间的非网络通信。

每种文件类型都有不同的用途和属性，可以通过命令如 `ls`、`file` 等来查看文件的类型信息。

```bash
# 普通文件（-）
-rw-r--r--  1 user  group  1024 Apr 14 10:00 file.txt

# 目录文件（d，directory file）
drwxr-xr-x  2 user  group  4096 Apr 14 10:00 directory/

# 套接字文件(s，socket)
srwxrwxrwx  1 user  group    0 Apr 14 10:00 socket
```

### Linux 目录树

Linux 使用一种称为目录树的层次结构来组织文件和目录。目录树由根目录（/）作为起始点，向下延伸，形成一系列的目录和子目录。每个目录可以包含文件和其他子目录。结构层次鲜明，就像一棵倒立的树。

![Linux的目录结构](./images/Linux目录树.png)

**常见目录说明：**

- **/bin：** 存放二进制可执行文件（ls、cat、mkdir 等），常用命令一般都在这里。
- **/etc：** 存放系统管理和配置文件。
- **/home：** 存放所有用户文件的根目录，是用户主目录的基点，比如用户 user 的主目录就是 /home/user，可以用 ~user 表示。
- **/usr：** 用于存放系统应用程序。
- **/opt：** 额外安装的可选应用程序包所放置的位置。一般情况下，我们可以把 tomcat 等都安装到这里。
- **/proc：** 虚拟文件系统目录，是系统内存的映射。可直接访问这个目录来获取系统信息。
- **/root：** 超级用户（系统管理员）的主目录（特权阶级^o^）。
- **/sbin：** 存放二进制可执行文件，只有 root 才能访问。这里存放的是系统管理员使用的系统级别的管理命令和程序。如 ifconfig 等。
- **/dev：** 用于存放设备文件。
- **/mnt：** 系统管理员安装临时文件系统的安装点，系统提供这个目录是让用户临时挂载其他的文件系统。
- **/boot：** 存放用于系统引导时使用的各种文件。
- **/lib 和 /lib64：** 存放着和系统运行相关的库文件。
- **/tmp：** 用于存放各种临时文件，是公用的临时文件存储点。
- **/var：** 用于存放运行时需要改变数据的文件，也是某些大文件的溢出区，比方说各种服务的日志文件（系统启动日志等）等。
- **/lost+found：** 这个目录平时是空的，系统非正常关机而留下“无家可归”的文件（Windows 下叫什么 .chk）就在这里。

## Linux 常用命令

下面只是给出了一些比较常用的命令。

推荐一个 Linux 命令快查网站，非常不错，大家如果遗忘某些命令或者对某些命令不理解都可以在这里得到解决。Linux 命令在线速查手册：<https://wangchujiang.com/linux-command/>。

![Linux 命令快查](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/linux/linux-command-search.png)

另外，[shell.how](https://www.shell.how/) 这个网站可以用来解释常见命令的意思，对你学习 Linux 基本命令以及其他常用命令（如 Git、NPM）。

![shell.how 使用示例](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/linux/shell-now.png)

### 目录切换

- `cd usr`：切换到该目录下 usr 目录。
- `cd ..（或 cd../）`：切换到上一层目录。
- `cd /`：切换到系统根目录。
- `cd ~`：切换到用户主目录。
- **`cd -`：** 切换到上一个操作所在目录。

### 目录操作

- `ls`：显示目录中的文件和子目录的列表。例如：`ls /home`，显示 `/home` 目录下的文件和子目录列表。
- `ll`：`ll` 是 `ls -l` 的别名，ll 命令可以看到该目录下的所有目录和文件的详细信息。
- `mkdir [选项] 目录名`：创建新目录（增）。例如：`mkdir -m 755 my_directory`，创建一个名为 `my_directory` 的新目录，并将其权限设置为 755，其中所有者拥有读、写、执行权限，所属组和其他用户只有读、执行权限，无法修改目录内容（如创建或删除文件）。如果希望所有用户（包括所属组和其他用户）对目录都拥有读、写、执行权限，则应设置权限为 `777`，即：`mkdir -m 777 my_directory`。
- `find [路径] [表达式]`：在指定目录及其子目录中搜索文件或目录（查），非常强大灵活。例如：① 列出当前目录及子目录下所有文件和文件夹：`find .`；② 在 `/home` 目录下查找以 `.txt` 结尾的文件名：`find /home -name "*.txt"`，忽略大小写：`find /home -iname "*.txt"`；③ 当前目录及子目录下查找所有以 `.txt` 和 `.pdf` 结尾的文件：`find . \( -name "*.txt" -o -name "*.pdf" \)` 或 `find . -name "*.txt" -o -name "*.pdf"`。
- `pwd`：显示当前工作目录的路径。
- `rmdir [选项] 目录名`：删除空目录（删）。例如：`rmdir -p my_directory`，删除名为 `my_directory` 的空目录，并且会递归删除 `my_directory` 的空父目录，直到遇到非空目录或根目录。
- `rm [选项] 文件或目录名`：删除文件/目录（删）。例如：`rm -r my_directory`，删除名为 `my_directory` 的目录，`-r`（recursive，递归）表示会递归删除指定目录及其所有子目录和文件。
- `cp [选项] 源文件/目录 目标文件/目录`：复制文件或目录（移）。例如：`cp file.txt /home/file.txt`，将 `file.txt` 文件复制到 `/home` 目录下，并重命名为 `file.txt`。`cp -r source destination`，将 `source` 目录及其下的所有子目录和文件复制到 `destination` 目录下，并保留源文件的属性和目录结构。
- `mv [选项] 源文件/目录 目标文件/目录`：移动文件或目录（移），也可以用于重命名文件或目录。例如：`mv file.txt /home/file.txt`，将 `file.txt` 文件移动到 `/home` 目录下，并重命名为 `file.txt`。`mv` 与 `cp` 的结果不同，`mv` 好像文件“搬家”，文件个数并未增加。而 `cp` 对文件进行复制，文件个数增加了。

### 文件操作

像 `mv`、`cp`、`rm` 等文件和目录都适用的命令，这里就不重复列举了。

- `touch [选项] 文件名..`：创建新文件或更新已存在文件（增）。例如：`touch file1.txt file2.txt file3.txt`，创建 3 个文件。
- `ln [选项] <源文件> <硬链接/软链接文件>`：创建硬链接/软链接。例如：`ln -s file.txt file_link`，创建名为 `file_link` 的软链接，指向 `file.txt` 文件。`-s` 选项代表的就是创建软链接，s 即 symbolic（软链接又名符号链接）。
- `cat/more/less/tail 文件名`：文件的查看（查）。命令 `tail -f 文件` 可以对某个文件进行动态监控，例如 Tomcat 的日志文件，会随着程序的运行，日志会变化，可以使用 `tail -f catalina-2016-11-11.log` 监控文件的变化。
- `vim 文件名`：修改文件的内容（改）。vim 编辑器是 Linux 中的强大组件，是 vi 编辑器的加强版，vim 编辑器的命令和快捷方式有很多，但此处不一一阐述，大家也无需研究的很透彻，使用 vim 编辑修改文件的方式基本会使用就可以了。在实际开发中，使用 vim 编辑器主要作用就是修改配置文件，下面是一般步骤：`vim 文件------>进入文件----->命令模式------>按 i 进入编辑模式----->编辑文件------->按 Esc 进入底行模式----->输入：wq/q!`（输入 wq 代表写入内容并退出，即保存；输入 q! 代表强制退出不保存）。

### 文件压缩

**1）打包并压缩文件：**

Linux 中的打包文件一般是以 `.tar` 结尾的，压缩的命令一般是以 `.gz` 结尾的。而一般情况下打包和压缩是一起进行的，打包并压缩后的文件的后缀名一般 `.tar.gz`。

命令：`tar -zcvf 打包压缩后的文件名 要打包压缩的文件`，其中：

- z：调用 gzip 压缩命令进行压缩。
- c：打包文件。
- v：显示运行过程。
- f：指定文件名。

比如：假如 test 目录下有三个文件分别是：`aaa.txt`、`bbb.txt`、`ccc.txt`，如果我们要打包 `test` 目录并指定压缩后的压缩包名称为 `test.tar.gz` 可以使用命令：`tar -zcvf test.tar.gz aaa.txt bbb.txt ccc.txt` 或 `tar -zcvf test.tar.gz /test/`。

**2）解压压缩包：**

命令：`tar [-xvf] 压缩文件`

其中 x 代表解压。

示例：

- 将 `/test` 下的 `test.tar.gz` 解压到当前目录下可以使用命令：`tar -xvf test.tar.gz`。
- 将 /test 下的 test.tar.gz 解压到根目录 /usr 下：`tar -xvf test.tar.gz -C /usr`（`-C` 代表指定解压的位置）。

### 文件传输

- `scp [选项] 源文件 远程文件`（scp 即 secure copy，安全复制）：用于通过 SSH 协议进行安全的文件传输，可以实现从本地到远程主机的上传和从远程主机到本地的下载。例如：`scp -r my_directory user@remote:/home/user`，将本地目录 `my_directory` 上传到远程服务器 `/home/user` 目录下。`scp -r user@remote:/home/user/my_directory`，将远程服务器的 `/home/user` 目录下的 `my_directory` 目录下载到本地。需要注意的是，`scp` 命令需要在本地和远程系统之间建立 SSH 连接进行文件传输，因此需要确保远程服务器已经配置了 SSH 服务，并且具有正确的权限和认证方式。
- `rsync [选项] 源文件 远程文件`：可以在本地和远程系统之间高效地进行文件复制，并且能够智能地处理增量复制，节省带宽和时间。例如：`rsync -r my_directory user@remote:/home/user`，将本地目录 `my_directory` 上传到远程服务器 `/home/user` 目录下。
- `ftp`（File Transfer Protocol）：提供了一种简单的方式来连接到远程 FTP 服务器并进行文件上传、下载、删除等操作。使用之前需要先连接登录远程 FTP 服务器，进入 FTP 命令行界面后，可以使用 `put` 命令将本地文件上传到远程主机，可以使用 `get` 命令将远程主机的文件下载到本地，可以使用 `delete` 命令删除远程主机的文件。这里就不进行演示了。

### 文件权限

操作系统中每个文件都拥有特定的权限、所属用户和所属组。权限是操作系统用来限制资源访问的机制，在 Linux 中权限一般分为读（readable）、写（writable）和执行（executable），分为三组。分别对应文件的属主（owner）、属组（group）和其他用户（other），通过这样的机制来限制哪些用户、哪些组可以对特定的文件进行什么样的操作。

通过 **`ls -l`** 命令我们可以查看某个目录下的文件或目录的权限。

示例：在随意某个目录下 `ls -l`

![Linux 文件权限命令示例](./images/Linux权限命令.png)

第一列的内容的信息解释如下：

![Linux 文件权限字段解读](./images/Linux权限解读.png)

> 下面将详细讲解文件的类型、Linux 中权限以及文件有所有者、所在组、其它组具体是什么？

**文件的类型：**

- d：代表目录。
- -：代表文件。
- l：代表软链接（可以认为是 window 中的快捷方式）。

**Linux 中权限分为以下几种：**

- r：代表权限是可读，r 也可以用数字 4 表示。
- w：代表权限是可写，w 也可以用数字 2 表示。
- x：代表权限是可执行，x 也可以用数字 1 表示。

**文件和目录权限的区别：**

对文件和目录而言，读写执行表示不同的意义。

对于文件：

| 权限名称 |                  可执行操作 |
| :------- | --------------------------: |
| r        | 可以使用 cat 查看文件的内容 |
| w        |          可以修改文件的内容 |
| x        |    可以将其运行为二进制文件 |

对于目录：

| 权限名称 |               可执行操作 |
| :------- | -----------------------: |
| r        |       可以查看目录下列表 |
| w        | 可以创建和删除目录下文件 |
| x        |     可以使用 cd 进入目录 |

传统 root 通常拥有绕过普通文件自主访问控制（DAC）检查所需的 capability，但这不代表它能绕过 capabilities、LSM、挂载选项、immutable 标志等所有限制。权限为 `000` 的对象也不能简单概括成 root 一定可以执行或访问。

**在 Linux 中的每个用户必须属于一个组，不能独立于组外。在 Linux 中每个文件有所有者、所在组、其它组的概念。**

- **所有者（u）**：一般为文件的创建者，谁创建了该文件，就天然的成为该文件的所有者，用 `ls ‐ahl` 命令可以看到文件的所有者，也可以使用 chown 用户名 文件名来修改文件的所有者。
- **文件所在组（g）**：当某个用户创建了一个文件后，这个文件的所在组就是该用户所在的组，用 `ls ‐ahl` 命令可以看到文件的所有组，也可以使用 chgrp 组名 文件名来修改文件所在的组。
- **其它组（o）**：除开文件的所有者和所在组的用户外，系统的其它用户都是文件的其它组。

> 我们再来看看如何修改文件/目录的权限。

**修改文件/目录的权限的命令：`chmod`**

示例：修改 /test 下的 aaa.txt 的权限为文件所有者有全部权限，文件所有者所在的组有读写权限，其他用户只有读的权限。

**`chmod u=rwx,g=rw,o=r aaa.txt`** 或者 **`chmod 764 aaa.txt`**

![chmod 修改 Linux 文件权限示例](./images/修改文件权限.png)

**补充一个比较常用的东西：**

假如我们装了一个 zookeeper，我们每次开机到要求其自动启动该怎么办？

现在主流 Linux 发行版基本使用 systemd 管理服务，推荐做法是编写一个 `zookeeper.service` 单元文件，然后使用下面的命令设置开机自启：

```bash
sudo systemctl enable zookeeper
sudo systemctl start zookeeper
sudo systemctl status zookeeper
```

如果修改了 service 文件，需要先执行 `sudo systemctl daemon-reload` 让 systemd 重新加载配置。`chkconfig --add zookeeper`、`chkconfig --list` 属于 SysV init 时代的做法，只有在较老的发行版或兼容环境中才会用到。

### 用户管理

Linux 系统是一个多用户多任务的分时操作系统，任何一个要使用系统资源的用户，都必须首先向系统管理员申请一个账号，然后以这个账号的身份进入系统。

用户的账号一方面可以帮助系统管理员对使用系统的用户进行跟踪，并控制他们对系统资源的访问；另一方面也可以帮助用户组织文件，并为用户提供安全性保护。

**Linux 用户管理相关命令：**

- `useradd [选项] 用户名`：创建用户账号。使用 `useradd` 指令所建立的帐号，实际上是保存在 `/etc/passwd` 文本文件中。
- `userdel [选项] 用户名`：删除用户帐号。
- `usermod [选项] 用户名`：修改用户账号的属性和配置比如用户名、用户 ID、家目录。
- `passwd [选项] 用户名`：设置用户的认证信息，包括用户密码、密码过期时间等。例如：`passwd -S 用户名` 显示账号密码状态；`passwd -d 用户名` 会删除密码，使密码字段为空，是否允许空密码登录取决于 PAM 和登录服务配置；`passwd -l 用户名` 只锁定密码认证，SSH 密钥等其他认证方式仍可能可用；`passwd 用户名` 用于修改密码。
- `su [选项] 用户名`（su 即 Switch User，切换用户）：在当前登录的用户和其他用户之间切换身份。

### 用户组管理

每个用户都有一个用户组，系统可以对一个用户组中的所有用户进行集中管理。不同 Linux 系统对用户组的规定有所不同，如 Linux 下的用户属于与它同名的用户组，这个用户组在创建用户时同时创建。

用户组的管理涉及用户组的添加、删除和修改。组的增加、删除和修改实际上就是对 `/etc/group` 文件的更新。

**Linux 系统用户组的管理相关命令：**

- `groupadd [选项] 用户组`：增加一个新的用户组。
- `groupdel 用户组`：要删除一个已有的用户组。
- `groupmod [选项] 用户组`：修改用户组的属性。

### 系统状态

- `top [选项]`：用于实时查看系统的 CPU 使用率、内存使用率、进程信息等。
- `htop [选项]`：类似于 `top`，但提供了更加交互式和友好的界面，可让用户交互式操作，支持颜色主题，可横向或纵向滚动浏览进程列表，并支持鼠标操作。
- `uptime [选项]`：用于查看系统总共运行了多长时间、系统的平均负载等信息。
- `vmstat [间隔时间] [重复次数]`：vmstat（Virtual Memory Statistics）的含义为显示虚拟内存状态，但是它可以报告关于进程、内存、I/O 等系统整体运行状态。
- `free [选项]`：用于查看系统的内存使用情况，包括已用内存、可用内存、缓冲区和缓存等。
- `df [选项] [文件系统]`：用于查看系统的磁盘空间使用情况，包括磁盘空间的总量、已使用量和可用量等，可以指定文件系统上。例如：`df -a`，查看全部文件系统。
- `du [选项] [文件]`：用于查看指定目录或文件的磁盘空间使用情况，可以指定不同的选项来控制输出格式和单位。
- `sar [选项] [时间间隔] [重复次数]`：用于收集、报告和分析系统的性能统计信息，包括系统的 CPU 使用、内存使用、磁盘 I/O、网络活动等详细信息。它的特点是可以连续对系统取样，获得大量的取样数据。取样数据和分析的结果都可以存入文件，使用它时消耗的系统资源很小。
- `ps [选项]`：用于查看系统中的进程信息，包括进程的 ID、状态、资源使用情况等。`ps -ef`/`ps -aux`：这两个命令都是查看当前系统正在运行进程，两者的区别是展示格式不同。如果想要查看特定的进程可以使用这样的格式：`ps aux|grep redis`（查看包括 redis 字符串的进程），也可使用 `pgrep redis -a`。
- `systemctl [命令] [服务名称]`：用于管理系统的服务和单元，可以查看系统服务的状态、启动、停止、重启等。
- `journalctl [选项]`：用于查看 systemd 日志，排查服务启动失败、系统错误非常常用。例如：`journalctl -u nginx -f` 实时查看 nginx 服务日志，`journalctl -xe` 查看最近的系统错误上下文。

### 网络通信

- `ping [选项] 目标主机`：测试与目标主机的网络连接。
- `ifconfig` 或 `ip`：用于查看系统的网络接口信息，包括网络接口的 IP 地址、MAC 地址、状态等。
- `netstat [选项]`：用于查看系统的网络连接状态和网络统计信息，可以查看当前的网络连接情况、监听端口、网络协议等。
- `ss [选项]`：比 `netstat` 更好用，提供了更快速、更详细的网络连接信息。
- `nload`：`sar` 和 `nload` 都可以监控网络流量，但 `sar` 的输出是文本形式的数据，不够直观。`nload` 则是一个专门用于实时监控网络流量的工具，提供图形化的终端界面，更加直观。不过，`nload` 不保存历史数据，所以它不适合用于长期趋势分析。并且，系统并没有默认安装它，需要手动安装。
- `sudo hostnamectl set-hostname 新主机名`：更改主机名，并且重启后依然有效。`sudo hostname 新主机名` 也可以更改主机名。不过需要注意的是，使用 `hostname` 命令直接更改主机名只是临时生效，系统重启后会恢复为原来的主机名。

### 其他

- `sudo + 其他命令`：以系统管理者的身份执行指令，也就是说，经由 sudo 所执行的指令就好像是 root 亲自执行。
- `grep [选项] "搜索内容" 文件路径`：非常强大且常用的文本搜索命令，它可以根据指定的字符串或正则表达式，在文件或命令输出中进行匹配查找，适用于日志分析、文本过滤、快速定位等多种场景。示例：忽略大小写搜索 syslog 中所有包含 error 的行：`grep -i "error" /var/log/syslog`，查找所有与 java 相关的进程：`ps -ef | grep "java"`。
- `kill -9 进程的 pid`：杀死进程（-9 表示强制终止），先用 ps 查找进程，然后用 kill 杀掉。
- `shutdown`：`shutdown -h now`：指定现在立即关机；`shutdown +5 "System will shutdown after 5 minutes"`：指定 5 分钟后关机，同时送出警告信息给登入用户。
- `reboot`：`reboot`：重开机。`reboot -w`：做个重开机的模拟（只有纪录并不会真的重开机）。

## Linux 环境变量

在 Linux 系统中，环境变量是用来定义系统运行环境的一些参数，比如每个用户不同的主目录（HOME）。

### 环境变量分类

按照作用域来分，环境变量可以简单的分成：

- 用户级别环境变量：`~/.bashrc`、`~/.bash_profile`。
- 系统级别环境变量：`/etc/bashrc`、`/etc/environment`、`/etc/profile`、`/etc/profile.d`。

环境变量配置文件的加载顺序不是固定一条线，取决于当前 shell 是登录 shell、非登录交互 shell，还是非交互 shell。以 Bash 为例，登录 shell 通常会读取 `/etc/profile`，再读取用户目录下第一个存在且可读的 `~/.bash_profile`、`~/.bash_login` 或 `~/.profile`；交互式非登录 shell 通常读取 `~/.bashrc`。很多发行版会在 `~/.bash_profile` 中手动加载 `~/.bashrc`，所以你实际看到的加载链路还会受发行版默认配置影响。

如果要修改系统级别环境变量文件，需要管理员具备对该文件的写入权限。

建议用户级别环境变量在 `~/.bash_profile` 中配置，系统级别环境变量在 `/etc/profile.d` 中配置。

按照生命周期来分，环境变量可以简单的分成：

- 永久的：需要用户修改相关的配置文件，变量永久生效。
- 临时的：用户利用 `export` 命令，在当前终端下声明环境变量，关闭 shell 终端失效。

### 读取环境变量

通过 `export` 命令可以输出当前系统定义的所有环境变量。

```bash
# 列出当前的环境变量值
export -p
```

除了 `export` 命令之外，`env` 命令也可以列出所有环境变量。

`echo` 命令可以输出指定环境变量的值。

```bash
# 输出当前的PATH环境变量的值
echo $PATH
# 输出当前的HOME环境变量的值
echo $HOME
```

### 环境变量修改

通过 `export` 命令可以修改指定的环境变量。不过，这种方式修改环境变量仅仅对当前 shell 终端生效，关闭 shell 终端就会失效。修改完成之后，立即生效。

```bash
export JAVA_HOME="/path/to/jdk"
export PATH="$JAVA_HOME/bin:$PATH"
```

通过 `vim` 命令修改环境变量配置文件。这种方式修改环境变量永久有效。

```bash
vim ~/.bash_profile
```

如果修改的是系统级别环境变量则对所有用户生效，如果修改的是用户级别环境变量则仅对当前用户生效。

修改完成之后，需要 `source` 命令让其生效或者关闭 shell 终端重新登录。

```bash
source ~/.bash_profile
```

<!-- @include: @article-footer.snippet.md -->


---

<!-- source: 操作系统/Shell 编程基础知识总结.md -->

---
title: Shell 编程基础知识总结
description: Shell 编程在我们的日常开发工作中非常实用，目前 Linux 系统下最流行的运维自动化语言就是 Shell 和 Python 了。这篇文章我会简单总结一下 Shell 编程基础知识，带你入门 Shell 编程！
category: 计算机基础
tag:
  - 操作系统
  - Linux
head:
  - - meta
    - name: keywords
      content: Shell,脚本,命令,自动化,运维,Linux,基础语法
---

Shell 编程在我们的日常开发工作中非常实用，目前 Linux 系统下最流行的运维自动化语言就是 Shell 和 Python 了。

这篇文章我会简单总结一下 Shell 编程基础知识，带你入门 Shell 编程！

## 版本说明

**本文示例适用于 bash 4.0+ 版本**。不同版本的 bash 在某些特性上可能有差异，特别是：

- **数组**：bash 2.0+ 支持，纯 POSIX sh（如 dash）不支持。
- **某些字符串操作**：如 `${var:offset:length}` 在较旧版本可能不支持。
- **算术扩展 `$((...))`**：bash 2.0+ 支持。

检查你的 bash 版本：

```shell
bash --version
# 或
echo $BASH_VERSION
```

## 走进 Shell 编程的大门

### 为什么要学 Shell？

学一个东西，我们大部分情况都是往实用性方向着想。从工作角度来讲，学习 Shell 是为了提高我们自己工作效率，提高产出，让我们在更少的时间完成更多的事情。

很多人会说 Shell 编程属于运维方面的知识了，应该是运维人员来做，我们做后端开发的没必要学。我觉得这种说法大错特错，相比于专门做 Linux 运维的人员来说，我们对 Shell 编程掌握程度的要求要比他们低，但是 Shell 编程也是我们必须要掌握的！

目前 Linux 系统下最流行的运维自动化语言就是 Shell 和 Python 了。

两者之间，Shell 几乎是 IT 企业必须使用的运维自动化编程语言，特别是在运维工作中的服务监控、业务快速部署、服务启动停止、数据备份及处理、日志分析等环节里，Shell 是不可缺的。Python 更适合处理复杂的业务逻辑，以及开发复杂的运维软件工具，实现通过 web 访问等。Shell 是一个命令解释器，解释执行用户所输入的命令和程序。一输入命令，就立即回应的交互的对话方式。

另外，了解 Shell 编程也是大部分互联网公司招聘后端开发人员的要求。下图是我截取的一些知名互联网公司对于 Shell 编程的要求。

![大型互联网公司对于shell编程技能的要求](https://oss.javaguide.cn/github/javaguide/计算机基础/shell/60190220.jpg)

### 什么是 Shell？

**Shell 是 Linux/Unix 系统的命令解释器**，它充当用户和操作系统内核之间的桥梁，负责接收用户输入的命令并调用相应的程序。

**Shell 编程**是通过 Shell 解释器（如 bash）将命令、控制结构（if/for/while）、变量和函数组合成自动化脚本的过程。Shell 既是命令解释器，也是一门完整的编程语言（支持变量、数组、函数、流程控制、管道、重定向等）。

**常见的 Shell 类型**：

- **bash**（Bourne Again Shell）：Linux 系统默认 Shell，最常用。
- **sh**（Bourne Shell）：Unix 传统 Shell，POSIX 标准。
- **zsh**：功能强大的交互式 Shell。
- **dash**：轻量级 Shell，Ubuntu 的 /bin/sh 默认指向它。
- **csh/tcsh**：C 风格的 Shell。

### Shell 编程的 Hello World

学习任何一门编程语言第一件事就是输出 HelloWorld 了！下面我会从新建文件到 Shell 代码编写来说下 Shell 编程如何输出 Hello World。

（1）新建一个文件 helloworld.sh：`touch helloworld.sh`，扩展名为 sh（sh 代表 Shell）（扩展名并不影响脚本执行，见名知意就好，如果你用 php 写 Shell 脚本，扩展名就用 php 好了）。

（2）使脚本具有执行权限：`chmod +x helloworld.sh`

（3）使用 vim 命令修改 helloworld.sh 文件：`vim helloworld.sh`（vim 文件------>进入文件----->命令模式------>按 i 进入编辑模式----->编辑文件------->按 Esc 进入底行模式----->输入:wq/q!（输入 wq 代表写入内容并退出，即保存；输入 q! 代表强制退出不保存。））

helloworld.sh 内容如下：

```shell
#!/bin/bash
set -euo pipefail  # 严格模式：遇错退出、未定义变量报错、管道失败报错
# 第一个 shell 小程序，echo 是 Linux 中的输出命令
echo "helloworld!"
```

Shell 中 `#` 符号表示注释。**Shell 的第一行比较特殊，一般都会以 `#!` 开始来指定使用的 Shell 类型。在 Linux 中，除了 bash Shell 以外，还有很多版本的 Shell，例如 zsh、dash 等等...不过 bash Shell 还是我们使用最多的。**

（4）运行脚本：`./helloworld.sh`。（注意，一定要写成 `./helloworld.sh`，而不是 `helloworld.sh`，运行其它二进制的程序也一样，直接写 `helloworld.sh`，Linux 系统会去 PATH 里寻找有没有叫 helloworld.sh 的，而只有 /bin、/sbin、/usr/bin、/usr/sbin 等在 PATH 里，你的当前目录通常不在 PATH 里，所以写成 `helloworld.sh` 是会找不到命令的，要用 `./helloworld.sh` 告诉系统说，就在当前目录找。）

![shell 编程Hello World](https://oss.javaguide.cn/github/javaguide/计算机基础/shell/55296212.jpg)

## Shell 变量

### Shell 编程中的变量介绍

**Shell 编程中一般分为三种变量：**

1. **自定义变量（局部变量）**：默认仅在当前 Shell 进程内有效，**子进程无法访问**。若需传递给子进程，需使用 `export` 声明为环境变量。
2. **环境变量**：例如 `PATH`、`HOME` 等，可被子进程继承。使用 `env` 命令可以查看所有环境变量，`set` 命令可以查看所有变量（包括环境变量和局部变量）。
3. **Shell 特殊变量**：由 Shell 设置的特殊变量（如 `$?`、`$$`、`$!` 等），用于保存进程状态、参数等信息。

**常用的环境变量：**

> PATH 决定了 Shell 将到哪些目录中寻找命令或程序。
> HOME 当前用户主目录。
> HISTSIZE 历史记录数。
> LOGNAME 当前用户的登录名。
> HOSTNAME 指主机的名称。
> SHELL 当前用户 Shell 类型。
> LANGUAGE 语言相关的环境变量，多语言可以修改此环境变量。
> MAIL 当前用户的邮件存放目录。
> PS1 基本提示符，对于 root 用户是 #，对于普通用户是 \$。

**使用 Linux 已定义的环境变量：**

比如我们要看当前用户目录可以使用：`echo $HOME` 命令；如果我们要看当前用户 Shell 类型可以使用 `echo $SHELL` 命令。可以看出，使用方法非常简单。

**使用自己定义的变量：**

```shell
#!/bin/bash
#自定义变量hello
hello="hello world"
echo $hello
echo  "helloworld!"
```

![使用自己定义的变量](https://oss.javaguide.cn/github/javaguide/计算机基础/shell/19835037.jpg)

**Shell 编程中的变量名的命名的注意事项：**

- 命名只能使用英文字母、数字和下划线，首个字符不能以数字开头，但是可以使用下划线（\_）开头。
- 中间不能有空格，可以使用下划线（\_）。
- 不能使用标点符号。
- 不能使用 bash 里的关键字（可用 help 命令查看保留关键字）。

### Shell 字符串入门

字符串是 Shell 编程中最常用最有用的数据类型（除了数字和字符串，也没啥其它类型好用了），字符串可以用单引号，也可以用双引号。这点和 Java 中有所不同。

在单引号中，所有特殊字符（如 `$`、反引号、`\` 等）都失去特殊含义，被视为字面量。

在双引号中，以下字符保留特殊含义：

- `$`：变量扩展（如 `$var`）和命令替换（如 `$(cmd)` 或 `` `cmd` ``）
- `\`：转义字符
- `` ` `` 或 `$()`：命令替换（推荐使用`$()` 语法）
- `!`：历史扩展（仅在交互式 Shell 中默认开启）
- `${}`：参数扩展

**注意**：单引号中的字符串是**完全字面量**，双引号中的字符串会进行变量和命令替换。

**单引号字符串：**

```shell
#!/bin/bash
name='SnailClimb'
hello='Hello, I am $name!'
echo $hello
```

输出内容：

```plain
Hello, I am $name!
```

**双引号字符串：**

```shell
#!/bin/bash
name='SnailClimb'
hello="Hello, I am $name!"
echo $hello
```

输出内容：

```plain
Hello, I am SnailClimb!
```

### Shell 字符串常见操作

**拼接字符串：**

```shell
#!/bin/bash
name="SnailClimb"
# 使用双引号拼接
greeting="hello, "$name" !"
greeting_1="hello, ${name} !"
echo $greeting  $greeting_1
# 使用单引号拼接
greeting_2='hello, '$name' !'
greeting_3='hello, ${name} !'
echo $greeting_2  $greeting_3
```

输出结果：

![Shell 字符串拼接命令输出结果](https://oss.javaguide.cn/github/javaguide/计算机基础/shell/51148933.jpg)

**获取字符串长度：**

```shell
#!/bin/bash
# 获取字符串长度
name="SnailClimb"
# 第一种方式（推荐）：bash 内置
echo ${#name}  # 输出 10
# 第二种方式：外部命令（性能较差）
expr length "$name"
```

输出结果：

```plain
10
10
```

**说明**：

- 推荐使用 `${#var}` 语法，这是 bash 内置功能，性能更好。
- `expr` 是外部命令，需要 fork 进程，性能较差。
- **`expr length` 是 GNU 扩展**，非 POSIX 标准。在 macOS 的 BSD expr 或其他系统上可能不支持。
- 如需可移植性，推荐使用 `${#var}` 或 `expr "$var" : '.*'`（POSIX 兼容）。

使用 expr 命令时，表达式中的运算符左右必须包含空格：

```shell
expr 5+6       # 直接输出 5+6（无空格）
expr 5 + 6     # 输出 11（有空格）
# 更推荐使用 bash 算术扩展：
echo $((5 + 6))  # 输出 11
```

对于某些运算符，还需要我们使用符号 `\` 进行转义：

```shell
expr 5 * 6       # 输出错误（未转义）
expr 5 \* 6      # 输出 30（正确转义）
```

**截取子字符串：**

简单的字符串截取：

```shell
#从字符串第 0 个字符开始往后截取 10 个字符（索引从 0 开始）
str="SnailClimb is a great man"
echo ${str:0:10} #输出:SnailClimb
```

根据表达式截取：

```shell
#!/bin/bash
# author: amau

var="https://www.runoob.com/linux/linux-shell-variable.html"
# %表示删除从后匹配, 最短结果
# %%表示删除从后匹配, 最长匹配结果
# #表示删除从头匹配, 最短结果
# ##表示删除从头匹配, 最长匹配结果
# 注: *为通配符, 意为匹配任意数量的任意字符
s1=${var%%t*} #h
s2=${var%t*}  #https://www.runoob.com/linux/linux-shell-variable.h
s3=${var%%.*} #https://www
s4=${var#*/}  #/www.runoob.com/linux/linux-shell-variable.html
s5=${var##*/} #linux-shell-variable.html
```

### Shell 数组

**bash 2.0+** 支持一维数组（不支持多维数组），并且没有限定数组的大小。

**重要提示**：数组是 bash 的**非 POSIX 扩展特性**，纯 POSIX sh（如 dash）不支持数组。若需编写可移植脚本，应避免使用数组。

下面是一个关于数组操作的 Shell 代码示例，通过该示例大家可以知道如何创建数组、获取数组长度、获取/删除特定位置的数组元素、删除整个数组以及遍历数组。

```shell
#!/bin/bash
array=(1 2 3 4 5);
# 获取数组长度
length=${#array[@]}
# 或者
length2=${#array[*]}
#输出数组长度
echo $length #输出：5
echo $length2 #输出：5
# 输出数组第三个元素
echo ${array[2]} #输出：3
unset 'array[1]' # 删除下标为 1 的元素，也就是第二个元素
for i in "${array[@]}"; do echo "$i"; done # 遍历数组，输出：1 3 4 5
unset array; # 删除数组中的所有元素
for i in "${array[@]}"; do echo "$i"; done # 遍历数组，数组元素为空，没有任何输出内容
```

**重要说明：数组索引空洞**：

使用 `unset array[1]` 删除元素后，数组会产生**索引空洞**：

```shell
#!/bin/bash
array=(1 2 3 4 5)
echo "删除前: ${array[@]}"  # 输出: 1 2 3 4 5
echo "索引1的值: ${array[1]}"  # 输出: 2

unset array[1]  # 删除索引1的元素
echo "删除后: ${array[@]}"  # 输出: 1 3 4 5
echo "索引1的值: ${array[1]}"  # 输出: (空值)
echo "索引2的值: ${array[2]}"  # 输出: 3 (索引2仍在)

# 遍历时索引不连续
for index in "${!array[@]}"; do
    echo "索引[$index] = ${array[$index]}"
done
# 输出:
# 索引[0] = 1
# 索引[2] = 3
# 索引[3] = 4
# 索引[4] = 5
```

**注意**：删除元素后，如果使用 `${array[1]}` 访问会得到空值。遍历数组时建议使用 `"${!array[@]}"` 获取有效索引，或使用 `"${array[@]}"` 直接遍历值。

## Shell 基本运算符

Shell 编程支持下面几种运算符：

- 算数运算符
- 关系运算符
- 布尔运算符
- 字符串运算符
- 文件测试运算符

### 算数运算符

| **运算符** | **说明** | **举例**                                         |
| ---------- | -------- | ------------------------------------------------ |
| **+**      | 加法     | `expr $a + $b`                                   |
| **-**      | 减法     | `expr $a - $b`                                   |
| **\***     | 乘法     | `expr $a \* $b`（注意星号需要转义）              |
| **/**      | 除法     | `expr $b / $a`                                   |
| **%**      | 取余     | `expr $b % $a`                                   |
| **=**      | 赋值     | `a=$b` 将变量 b 的值赋给 a                       |
| **==**     | 相等     | `[ "$a" == "$b" ]` 用于字符串比较，相同返回 true |
| **!=**     | 不相等   | `[ "$a" != "$b" ]` 用于字符串比较，不同返回 true |

**推荐使用 bash 内置算术扩展**：

```shell
#!/bin/bash
a=3; b=3
val=$((a + b))  # bash 算术扩展（推荐）
# 输出：Total value: 6
echo "Total value: $val"
```

**说明**：

- `$((...))` 是 bash 内置功能，无需 fork 外部进程，性能更好。
- **不推荐**使用 `expr` 命令（需 fork 进程，且运算符两边必须有空格）。
- **不推荐**使用反引号 `` `...` ``（已过时），应使用 `$(...)` 语法。

**如果需要兼容 POSIX sh**，可以使用：

```shell
val=$(expr "$a" + "$b")  # POSIX 兼容，但性能较差
```

### 关系运算符

关系运算符只支持数字，不支持字符串，除非字符串的值是数字。

| **运算符** | **说明**                           | **对应英文**  |
| ---------- | ---------------------------------- | ------------- |
| **-eq**    | 检测两个数是否**相等**             | equal         |
| **-ne**    | 检测两个数是否**不相等**           | not equal     |
| **-gt**    | 检测左边的数是否**大于**右边的     | greater than  |
| **-lt**    | 检测左边的数是否**小于**右边的     | less than     |
| **-ge**    | 检测左边的数是否**大于等于**右边的 | greater equal |
| **-le**    | 检测左边的数是否**小于等于**右边的 | less equal    |

通过一个简单的示例演示关系运算符的使用，下面 Shell 程序的作用是当 score=100 的时候输出 A 否则输出 B。

```shell
#!/bin/bash
score=90;
maxscore=100;
if [[ $score -eq $maxscore ]]
then
   echo "A"
else
   echo "B"
fi
```

输出结果：

```plain
B
```

### 逻辑运算符

| **运算符** | **说明**       | **举例**                                         |
| ---------- | -------------- | ------------------------------------------------ |
| **&&**     | 逻辑的 **AND** | `[[ $a -lt 100 && $b -gt 100 ]]`（全真才为真）   |
| **\|\|**   | 逻辑的 **OR**  | `[[ $a -lt 100 \|\| $b -gt 100 ]]`（一真即为真） |

**算术扩展中的逻辑运算**：

```shell
#!/bin/bash
a=$(( 1 && 0))
# 输出：0；逻辑与运算只有相与的两边都是1，与的结果才是1；否则与的结果是0
echo $a;
```

**命令短路执行（生产环境常用）**：

在运维自动化和 CI/CD 管道中，经常使用 `&&` 和 `||` 来控制命令链路的执行流程，这称为**短路执行**：

```shell
#!/bin/bash
set -euo pipefail

# &&：前一个命令成功（返回 0）时才执行后一个命令
mkdir -p "/tmp/app_data" && echo "目录就绪"

# ||：前一个命令失败（返回非 0）时才执行后一个命令
mkdir -p "/tmp/app_data" || echo "目录创建失败"

# 组合使用：生产环境典型的防御姿势
mkdir -p "/tmp/app_data" && echo "目录就绪" || exit 1

# 实际场景示例
# 1. 检查文件存在后再删除
[ -f "/tmp/old_file.log" ] && rm "/tmp/old_file.log"

# 2. 命令失败时输出错误信息并退出
cd /app/config || { echo "无法进入配置目录"; exit 1; }

# 3. 条件执行命令
command1 && command2 || command3
# ⚠️ 注意：此写法有陷阱！
# - 当 command1 成功时，执行 command2
# - 当 command1 失败时，执行 command3
# - 但如果 command1 成功但 command2 失败，command3 仍会执行！
#
# ✅ 更安全的写法（推荐）：
if command1; then
    command2
else
    command3
fi
#
# 或明确知道 command2 不会失败时才使用 && || 组合
```

**重要提示**：

- 短路执行依赖命令的**退出码（Exit Code）**：成功返回 0，失败返回非 0。
- 这与 `[[ ]]` 内部的 `&&` 和 `||` 不同，后者用于条件测试。
- `command1 && command2 || command3` 存在陷阱：若 command1 成功但 command2 失败，command3 仍会执行。
- 生产环境中强烈建议使用 if-then-else 结构，确保逻辑清晰。

### 布尔运算符

| **运算符** | **说明**                                                             | **举例**                                              |
| ---------- | -------------------------------------------------------------------- | ----------------------------------------------------- |
| **!**      | 将表达式的结果取反。如果表达式为 true，则返回 false；否则返回 true。 | `[ ! false ]` 返回 false，因为 `false` 是非空字符串。 |
| **-o**     | 有一个表达式为 true，则返回 true。                                   | `[ "$a" -lt 20 -o "$b" -gt 100 ]` 返回 true。         |
| **-a**     | 两个表达式都为 true 才会返回 true。                                  | `[ "$a" -lt 20 -a "$b" -gt 100 ]` 返回 false。        |

### 字符串运算符

| **运算符** | **说明**                          | **举例**                      |
| ---------- | --------------------------------- | ----------------------------- |
| **=**      | 检测两个字符串是否**相等**        | `[ "$a" = "$b" ]`             |
| **!=**     | 检测两个字符串是否**不相等**      | `[ "$a" != "$b" ]`            |
| **-z**     | 检测字符串长度是否为 **0** (zero) | `[ -z "$a" ]` 为空返回 true   |
| **-n**     | 检测字符串长度是否**不为 0**      | `[ -n "$a" ]` 不为空返回 true |
| **str**    | 直接检测字符串是否为空            | `[ "$a" ]` 不为空返回 true    |

简单示例：

```shell
#!/bin/bash
a="abc";
b="efg";
if [[ "$a" = "$b" ]]
then
   echo "a 等于 b"
else
   echo "a 不等于 b"
fi
```

输出：

```plain
a 不等于 b
```

### 文件相关运算符

用于检测 Unix/Linux 文件的各种属性（如权限、类型等）。

- **存在与类型检测：**
  - **-e file**：检测文件（包括目录）是否存在。
  - **-f file**：检测是否为普通文件（既不是目录也不是设备文件）。
  - **-d file**：检测是否为目录。
  - **-s file**：检测文件是否非空（文件大小大于 0 返回 true）。
  - **-b/-c/-p**：分别检测是否为块设备、字符设备、有名管道。
- **权限检测：**
  - **-r file**：检测文件是否可读。
  - **-w file**：检测文件是否可写。
  - **-x file**：检测文件是否可执行。
- **特殊标识检测：**
  - **-u / -g / -k**：分别检测文件是否设置了 SUID、SGID 或粘着位（Sticky Bit）。

使用方式很简单，比如我们定义好了一个文件路径 `file="/usr/learnshell/test.sh"`，如果我们想判断这个文件是否可读，可以这样 `if [ -r $file ]`；如果想判断这个文件是否可写，可以这样 `-w $file`，是不是很简单。

## Shell 流程控制

### if 条件语句

简单的 if else-if else 的条件语句示例：

```shell
#!/bin/bash
a=3;
b=9;
if [[ $a -eq $b ]]
then
   echo "a 等于 b"
elif [[ $a -gt $b ]]
then
   echo "a 大于 b"
else
   echo "a 小于 b"
fi
```

输出结果：

```plain
a 小于 b
```

相信大家通过上面的示例就已经掌握了 Shell 编程中的 if 条件语句。

**空语句的处理**：Shell 中空语句可以使用 `:`（冒号命令）或 `true` 命令实现：

```shell
if [[ condition ]]; then
    :  # 空语句（什么都不做）
fi

# 或
if [[ condition ]]; then
    true  # 空语句
fi
```

这在某些场景下很有用，例如在 while 循环中作为占位符。

### for 循环语句

通过下面三个简单的示例认识 for 循环语句最基本的使用，实际上 for 循环语句的功能比下面你看到的示例展现的要大得多。

**输出当前列表中的数据：**

```shell
for loop in 1 2 3 4 5
do
    echo "The value is: $loop"
done
```

**产生 10 个随机数：**

```shell
#!/bin/bash
for i in {0..9};
do
   echo $RANDOM;
done
```

**输出 1 到 5：**

通常情况下 Shell 变量调用需要加 $，但是 for 的 (()) 中不需要，下面来看一个例子：

```shell
#!/bin/bash
length=5
for((i=1;i<=length;i++));do
    echo $i;
done;
```

### while 语句

**基本的 while 循环语句：**

```shell
#!/bin/bash
int=1
while (( int <= 5 ))  # 算术上下文内变量无需 $
do
    echo $int
    (( int++ ))  # 推荐使用 (( )) 替代 let
done
```

**while 循环可用于读取键盘信息：**

```shell
echo '按下 <CTRL-D> 退出'
echo -n '输入你最喜欢的电影: '
while read -r FILM  # -r 选项禁止反斜杠转义，提高安全性
do
    echo "是的！$FILM 是一个好电影"
done
```

输出内容：

```plain
按下 <CTRL-D> 退出
输入你最喜欢的电影: 变形金刚
是的！变形金刚 是一个好电影
```

**无限循环：**

```shell
while true
do
    command
done
```

## Shell 函数

### 不带参数没有返回值的函数

```shell
#!/bin/bash
hello(){
    echo "这是我的第一个 shell 函数!"
}
echo "-----函数开始执行-----"
hello
echo "-----函数执行完毕-----"
```

输出结果：

```plain
-----函数开始执行-----
这是我的第一个 shell 函数!
-----函数执行完毕-----
```

### 有返回值的函数

**输入两个数字之后相加并输出结果：**

```shell
#!/bin/bash
set -euo pipefail

funWithReturn(){
    local aNum
    local anotherNum
    echo "输入第一个数字: "
    read -r aNum
    echo "输入第二个数字: "
    read -r anotherNum
    echo "两个数字分别为 $aNum 和 $anotherNum !"
    result=$((aNum + anotherNum))
}
result=0
funWithReturn
echo "输入的两个数字之和为 $result"
```

**重要说明**：

- **`local` 关键字**：将变量限制在函数作用域内，避免污染全局命名空间。
- **`read -r`**：`-r` 选项禁止反斜杠转义，提高安全性。
- **函数返回值**：`return` 设置的是 0-255 的退出状态，不适合传递计算结果。需要传递数据时，可以使用标准输出或变量。

**为什么使用 local？**

- 在复杂脚本或引入多个外部脚本时，非 local 变量可能被意外覆盖。
- 全局变量污染会导致难以排查的配置漂移或逻辑越权。
- 使用 `local` 是函数编程的最佳实践，类似于其他编程语言的局部变量概念。

输出结果：

```plain
输入第一个数字:
1
输入第二个数字:
2
两个数字分别为 1 和 2 !
输入的两个数字之和为 3
```

### 带参数的函数

```shell
#!/bin/bash
funWithParam(){
    echo "第一个参数为 $1"
    echo "第二个参数为 $2"
    echo "脚本名称为 $0"
    echo "第十个参数为 ${10}"   # 注意：参数 ≥ 10 时必须用 ${n}
    echo "第十一个参数为 ${11}"
    echo "参数总数有 $# 个"
    echo "所有参数为 $*"         # 作为单个字符串输出
    echo "所有参数为 $@"         # 作为独立的参数输出（推荐）
}
funWithParam 1 2 3 4 5 6 7 8 9 34 73
```

输出结果：

```plain
第一个参数为 1
第二个参数为 2
脚本名称为 ./script.sh
第十个参数为 34
第十一个参数为 73
参数总数有 11 个
所有参数为 1 2 3 4 5 6 7 8 9 34 73
所有参数为 1 2 3 4 5 6 7 8 9 34 73
```

**重要提示**：

- **位置参数 `$n` 当 `n >= 10` 时必须使用 `${n}` 语法**。
- 例如：`$10` 会被解析为 `$1` 和字面量 `0` 的拼接，而非第十个参数。
- `$0` 表示脚本本身的名称。
- `$#` 表示参数总数。

**`$*` 与 `$@` 的核心区别**：

| 表达式 | 未引用         | 双引号包裹                               |
| ------ | -------------- | ---------------------------------------- |
| `$*`   | 展开为所有参数 | 展开为**单个字符串**（所有参数合并）     |
| `$@`   | 展开为所有参数 | 展开为**独立的参数**（每个参数保持独立） |

**示例对比**：

```shell
#!/bin/bash
test_args() {
    echo "--- 使用 \$* （无引号）---"
    for arg in $*; do
        echo "参数: [$arg]"
    done

    echo -e "\n--- 使用 \$@ （无引号）---"
    for arg in $@; do
        echo "参数: [$arg]"
    done

    echo -e "\n--- 使用 \"\$*\" （双引号）---"
    for arg in "$*"; do
        echo "参数: [$arg]"
    done

    echo -e "\n--- 使用 \"\$@\" （双引号，推荐）---"
    for arg in "$@"; do
        echo "参数: [$arg]"
    done
}

# 调用函数，传递包含空格的参数
test_args "hello world" "foo bar"
```

**输出结果**：

```plain
--- 使用 $* （无引号）---
参数: [hello]
参数: [world]
参数: [foo]
参数: [bar]

--- 使用 $@ （无引号）---
参数: [hello]
参数: [world]
参数: [foo]
参数: [bar]

--- 使用 "$*" （双引号）---
参数: [hello world foo bar]  # 所有参数合并为一个字符串

--- 使用 "$@" （双引号，推荐）---
参数: [hello world]  # 每个参数保持独立
参数: [foo bar]
```

**结论**：在传递参数时，**始终使用 `"$@"`** 以确保每个参数的独立性（特别是当参数包含空格时）。

## Shell 编程最佳实践

在掌握了 Shell 编程的基础知识后，了解一些最佳实践能帮助你编写更安全、更高效的脚本。

### 脚本基础规范

**1. Shebang 规范**：

```shell
#!/usr/bin/env bash
# 通过 PATH 查找 bash
set -euo pipefail
```

**Shebang 两种写法**：

- `#!/bin/bash`：直接指定 bash 路径，适用于你知道 bash 位置的固定环境。
- `#!/usr/bin/env bash`：通过 env 查找 bash，更可移植，适合不同系统（如 macOS / Linux）。

**本文示例选择**：

- 教程示例使用 `#!/bin/bash`：简洁明了，适合初学者理解。
- 生产级示例使用 `#!/usr/bin/env bash`：强调可移植性。

**2. 变量引用**：

```shell
# 始终用双引号包裹变量
echo "$var"     # 推荐
echo $var       # 可能导致 word splitting 和 globbing 问题
```

**3. 使用 shellcheck**：

```bash
shellcheck your_script.sh  # 静态分析，发现常见问题
```

**4. 推荐语法**：

- 使用 `[[ ]]` 而非 `[ ]`（更安全、支持模式匹配）。
- 使用 `$((...))` 而非 `expr`（性能更好）。
- 使用 `$(...)` 而非反引号（可嵌套、更清晰）。
- 使用 `${n}` 访问位置参数 n >= 10。

### pipefail 工作原理

默认情况下，管道命令的返回值只取决于最后一个命令。启用 `pipefail` 后，管道的返回值将是最后一个失败命令的返回值，这能避免隐藏中间步骤的错误。

**示例对比**：

```shell
# 默认模式（危险）
cat huge_file.txt | grep "pattern" | head -n 10
# 即使 cat 失败（文件不存在），只要 head 成功，返回码就是 0

# pipefail 模式（安全）
set -o pipefail
cat huge_file.txt | grep "pattern" | head -n 10
# cat 失败会立即返回错误码，不会被忽略
```

## 把 Shell 脚本放进生产环境前

基础语法写对只是第一步。脚本进入定时任务、部署流程或线上机器后，还要处理失败退出、临时文件、网络超时和后台任务退出码。下面用几个完整的小例子说明。

`set -u` 和 `set -o pipefail` 的行为相对明确；`set -e` 的例外较多，在条件判断、函数、子 Shell 和命令替换中的行为都可能让人意外。可以把 `set -euo pipefail` 当作新脚本的起点，但不能用它代替显式的 `if ! command; then ... fi` 错误处理。变量展开仍应按场景加双引号，函数内部变量用 `local` 限定作用域。

### 给网络请求设置总预算

一次请求要同时限制连接阶段和整个传输时间。重试只能放在一层：如果外层循环和 `curl --retry` 同时启用，真实请求次数会相乘，总耗时也很难估算。下面的函数由外层统一控制尝试次数，并在每次失败后加入 0～2 秒的整数随机延迟：

```shell
#!/usr/bin/env bash

retry_request() {
    local url="$1"
    local max_attempts=5
    local attempt=1
    local delay
    local jitter

    while (( attempt <= max_attempts )); do
        if curl --fail --silent --show-error \
                --connect-timeout 3 \
                --max-time 10 \
                "$url"; then
            return 0
        fi

        if (( attempt == max_attempts )); then
            break
        fi

        delay=$((1 << (attempt - 1)))
        (( delay > 16 )) && delay=16
        jitter=$((RANDOM % 3))
        delay=$((delay + jitter))
        printf '第 %d 次请求失败，%d 秒后重试\n' "$attempt" "$delay" >&2
        sleep "$delay"
        ((attempt += 1))
    done

    return 1
}

command -v curl >/dev/null 2>&1 || {
    echo "curl 未安装" >&2
    exit 1
}

[[ $# -eq 1 ]] || {
    echo "用法: $0 <url>" >&2
    exit 1
}

retry_request "$1" || {
    echo "请求失败" >&2
    exit 1
}
```

真实脚本还要根据接口语义决定哪些错误可以重试。非幂等写请求、认证失败和参数错误通常不应直接重放。

### 临时文件和互斥锁

不要用 `/tmp/data_$$` 这类可预测路径。`mktemp` 会原子创建文件或目录，配合 `trap` 可以在正常退出和收到常见信号时清理：

```shell
#!/usr/bin/env bash

temp_dir=$(mktemp -d "${TMPDIR:-/tmp}/myapp.XXXXXXXX") || {
    echo "无法创建临时目录" >&2
    exit 1
}
cleanup() {
    rm -rf -- "$temp_dir"
}
trap cleanup EXIT
trap 'exit 129' HUP
trap 'exit 130' INT
trap 'exit 143' TERM

temp_file="$temp_dir/result.txt"
printf 'temporary data\n' > "$temp_file"
cat "$temp_file"
```

同一台机器上需要阻止脚本重复运行时，可以对应用自己管理的锁文件使用 `flock`：

```shell
exec 9>/var/lock/myapp.lock || exit 1
flock -n 9 || {
    echo "脚本已在运行" >&2
    exit 1
}
```

`flock` 是协作式锁，其他进程可以选择不遵守。Linux 的 NFS 客户端可以把它模拟为整文件 `fcntl` 锁，但实际行为还受客户端内核、服务端和 `local_lock` 等挂载选项影响。锁文件放在网络文件系统时，应在目标部署环境用两个独立客户端验证，不能预设一定有效或一定失效。跨机器互斥也不能只写一句 Redis `SET NX PX`：实现还要处理唯一 token、条件删除、租约续期和故障模型。

### 收集后台任务的退出码

不带参数的 `wait` 会等待所有后台任务，但 Bash 返回 0，无法告诉你其中哪个任务失败。下面的脚本并发统计多个文件的字节数，并逐个收集子进程状态：

```shell
#!/usr/bin/env bash
set -u

pids=()
for file in "$@"; do
    wc -c -- "$file" &
    pids+=("$!")
done

exit_code=0
for pid in "${pids[@]}"; do
    if ! wait "$pid"; then
        echo "后台任务 $pid 执行失败" >&2
        exit_code=1
    fi
done

exit "$exit_code"
```

直接写 `while wait -n; do ...; done` 也不完整：某个任务失败时 `wait -n` 返回非 0，循环会立即结束，剩余任务可能没有被收集。

### 常见误区

不要把整条命令的标准输出和标准错误都长期重定向到 `/dev/null`，否则失败时只剩退出码，没有诊断信息。只屏蔽确认不需要的输出，错误信息写入日志或保留在标准错误中。脚本依赖 `curl`、`jq` 等外部命令时，启动阶段先用 `command -v` 检查；管道需要感知中间命令失败时，再启用 `set -o pipefail`。

### 上线前怎么验证

验证内容应贴着脚本真实依赖来定。网络脚本至少覆盖连接失败、超时和不可重试的 HTTP 状态；并发脚本检查每个子进程的退出码；会创建临时资源的脚本还要验证正常退出和信号中断后是否完成清理。故障注入命令会修改防火墙、系统时间或挂载状态，不适合当作可直接复制的通用示例，应在隔离测试环境中按实际基础设施单独设计。

## 总结

Shell 适合把已有命令串成小型自动化流程。先掌握变量引用、条件、循环、函数和退出状态，再根据脚本实际使用的网络、文件和并发资源补上超时、清理与错误处理。

### 核心知识点回顾

| 知识模块     | 关键要点                                                                          |
| ------------ | --------------------------------------------------------------------------------- |
| **变量**     | 区分局部变量、环境变量和特殊变量；使用 `local` 避免全局污染；始终用双引号包裹变量 |
| **字符串**   | 推荐使用双引号；理解单引号和双引号的区别；掌握 `${#var}` 获取长度                 |
| **数组**     | bash 2.0+ 支持数组（非 POSIX）；注意删除元素后的索引空洞                          |
| **运算符**   | 优先使用 `$((...))` 进行算术运算；`[[ ]]` 比 `[ ]` 更安全                         |
| **流程控制** | 使用 `[[ ]]` 进行条件测试；避免 `command1 && command2 \|\| command3` 的陷阱       |
| **函数**     | 使用 `local` 限制变量作用域；函数只能返回 0-255 的退出码                          |
| **命令替换** | 使用 `$(...)` 替代反引号；使用 `read -r` 提高安全性                               |

### 学习建议

从日志筛选、批量改名、文件统计这类短任务开始，写完先用 `bash -n` 检查语法，再用 ShellCheck 找未引用变量、错误重定向等常见问题。脚本开始管理后台进程或系统服务后，再继续学习信号、作业控制、`sed`、`awk` 和 `grep`。超过几百行、需要复杂数据结构或异常恢复时，Python 等通用语言通常更容易维护。

### 参考资源

- **官方文档**：Bash Reference Manual（GNU）
- **代码检查**：ShellCheck - Shell Script Analysis Tool
- **编码规范**：Google Shell Style Guide
- **常见陷阱**：Bash Pitfalls (http://mywiki.wooledge.org/BashPitfalls)


---

<!-- source: 操作系统/操作系统常见面试题总结（上）.md -->

---
title: 操作系统常见面试题总结（上）
description: 最新操作系统高频面试题总结（上）：用户态与内核态、中断、异常、系统调用、进程线程、上下文切换、CPU 调度算法、Linux CFS/EEVDF、系统负载和死锁等核心考点。
category: 计算机基础
tag:
  - 操作系统
head:
  - - meta
    - name: keywords
      content: 操作系统面试题,用户态 vs 内核态,中断,异常,系统调用,进程 vs 线程,进程状态,PCB,TCB,fork,exec,wait,进程间通信IPC,CPU调度算法,CFS,EEVDF,load average,上下文切换,死锁必要条件
---

<!-- markdownlint-disable MD033 -->

很多读者抱怨计算操作系统的知识点比较繁杂，自己也没有多少耐心去看，但是面试的时候又经常会遇到。所以，我带着我整理好的操作系统的常见问题来啦！

这篇《操作系统常见面试题总结（上）》会先从操作系统基础讲起，再重点梳理 **用户态/内核态、系统调用、进程和线程、进程间通信、进程调度、死锁** 这些高频考点。它适合用来快速建立面试问题清单，也适合作为复习时查漏补缺的入口。

学习操作系统不只是为了背八股。缓存、调度、同步、内存映射、零拷贝、I/O 多路复用这些思想，在 Redis、Kafka、Nginx、Netty、JVM、数据库里都能看到影子。把底层机制想清楚，再理解上层框架和线上性能问题，会轻松很多。

本文偏“面试速查 + 核心概念串联”，深入学习还是建议搭配教材和专题文章一起看。文中部分内容参考了《现代操作系统》第三版，在此表示感谢。

## 操作系统基础

![操作系统基础知识导图](https://oss.javaguide.cn/2020-8/image-20200807161118901.png)

### 什么是操作系统？

通过以下四点可以概括操作系统到底是什么：

1. 操作系统（Operating System，简称 OS）是管理计算机硬件与软件资源的程序，是计算机的基石。
2. 操作系统本质上是一个运行在计算机上的软件程序，主要用于管理计算机硬件和软件资源。举例：运行在你电脑上的所有应用程序都通过操作系统来调用系统内存以及磁盘等等硬件。
3. 操作系统存在屏蔽了硬件层的复杂性。操作系统就像是硬件使用的负责人，统筹着各种相关事项。
4. 操作系统的内核（Kernel）是操作系统的核心部分，它负责系统的内存管理，硬件设备的管理，文件系统的管理以及应用程序的管理。内核是连接应用程序和硬件的桥梁，决定着系统的性能和稳定性。

很多人容易把操作系统的内核（Kernel）和中央处理器（CPU，Central Processing Unit）弄混。你可以简单从下面两点来区别：

1. 操作系统的内核（Kernel）属于操作系统层面，而 CPU 属于硬件。
2. CPU 主要提供运算，处理各种指令的能力。内核（Kernel）主要负责系统管理比如内存管理，它屏蔽了对硬件的操作。

下图清晰说明了应用程序、内核、CPU 这三者的关系。

![应用程序、内核和 CPU 的关系](https://oss.javaguide.cn/2020-8/Kernel_Layout.png)

### 操作系统主要有哪些功能？

从资源管理的角度来看，操作系统有 6 大功能：

1. **进程和线程的管理**：进程的创建、撤销、阻塞、唤醒，进程间的通信等。
2. **存储管理**：内存的分配与回收、地址转换、进程隔离、页面回收，以及外存空间管理等。
3. **文件管理**：把底层存储块组织成文件和目录，负责文件读写、创建、删除、权限控制和崩溃恢复等。
4. **设备管理**：完成设备（输入输出设备和外部存储设备等）的请求或释放，以及设备启动等功能。
5. **网络管理**：操作系统负责管理计算机网络的使用。网络是计算机系统中连接不同计算机的方式，操作系统需要管理计算机网络的配置、连接、通信和安全等，以提供高效可靠的网络服务。
6. **安全管理**：用户的身份认证、访问控制、文件加密等，以防止非法用户对系统资源的访问和操作。

内存管理和文件系统是操作系统面试里最容易继续追问的两块，会在这篇单独展开：[操作系统常见面试题总结（下）](./操作系统常见面试题总结（下）.md)。

### 常见的操作系统有哪些？

#### Windows

目前最流行的个人桌面操作系统，不做多的介绍，大家都清楚。界面简单易操作，软件生态非常好。

_玩玩电脑游戏还是必须要有 Windows 的，所以我现在是一台 Windows 用于玩游戏，一台 Mac 用于平时日常开发和学习使用。_

![Windows 桌面操作系统界面](./images/windows.png)

#### Unix

Unix 是早期最具影响力的多用户、多任务操作系统之一，后来的 Linux、BSD 等类 Unix 系统都受到它的影响。传统商业 Unix 的市场份额已经明显下降，但 Unix 标准、认证系统及其设计思想仍在使用。

![Unix 操作系统标识](./images/unix.png)

#### Linux

**Linux 是一套免费使用、开源的类 Unix 操作系统。** Linux 存在着许多不同的发行版本，但它们都使用了 **Linux 内核**。

> 严格来讲，Linux 这个词本身只表示 Linux 内核，在 GNU/Linux 系统中，Linux 实际就是 Linux 内核，而该系统的其余部分主要是由 GNU 工程编写和提供的程序组成。单独的 Linux 内核并不能成为一个可以正常工作的操作系统。
>
> **很多人更倾向使用 "GNU/Linux" 一词来表达人们通常所说的 "Linux"。**

![Linux 操作系统桌面与命令行界面](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/linux/linux.png)

#### Mac OS

苹果自家的操作系统，编程体验和 Linux 相当，但是界面、软件生态以及用户体验各方面都要比 Linux 操作系统更好。

![macOS 桌面操作系统界面](./images/macos.png)

### 用户态和内核态

#### 什么是用户态和内核态？

用户态和内核态描述的是 CPU 执行代码时的特权级别。应用代码通常在用户态运行；需要访问受保护资源时，CPU 会按规定入口进入内核态，由内核代表当前线程完成操作。

![用户态和内核态](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/usermode-and-kernelmode.png)

- **用户态（User Mode）**：权限较低，不能直接执行特权指令，也不能随意访问内核地址空间或操作硬件。应用读文件、收发网络数据时，需要通过系统调用请求内核服务。
- **内核态（Kernel Mode）**：权限较高，可以执行管理页表、中断、设备等特权操作。系统调用、中断或同步异常进入内核后，运行的是内核代码，不是把整个用户进程变成了“内核进程”。

用户态/内核态切换需要经过架构规定的入口、保存必要状态并执行权限和参数检查，因此比普通函数调用更重。但它不等于线程上下文切换：只有调度器换成另一个执行实体时，才会发生线程切换。

#### 为什么要有用户态和内核态？只有一个内核态不行么？

这样设计主要是为了**安全**和**稳定**。

- **限制特权操作**：修改页表、控制中断、访问特定设备寄存器等操作会影响整个系统，只能由内核执行。
- **隔离故障和权限**：如果应用都能以内核权限运行，一个越界写或恶意程序就可能破坏其他进程和内核数据，进程隔离也就失去了基础。

这套特权级机制把普通应用限制在受控环境中，硬件和系统资源则统一交给内核管理。

#### 用户态和内核态是如何切换的？

![用户态切换到内核态的 3 种方式](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/the-way-switch-between-user-mode-and-kernel-mode.drawio.png)

让 CPU 从用户态进入内核态的事件主要有三类：

1. **系统调用（Trap）**：应用程序主动执行 `syscall`、`ecall` 等指令，请求内核完成 `read()`、`send()` 等操作。它由当前指令触发，属于同步事件。
2. **硬件中断（Interrupt）**：由定时器、网卡、磁盘等外部硬件触发，与当前正在执行的指令没有直接关系，因此属于异步事件。
3. **同步异常（Exception）**：由当前指令触发，例如除零、非法指令或 Page Fault。异常不一定代表程序出错，懒分配、COW 和从文件调页也会触发可恢复的 Page Fault。

中断、异常和系统调用描述的是 CPU 为什么进入内核；信号则是内核通知进程或线程的一种软件机制。非法内存访问可能先触发 Page Fault，内核判断无法修复后，再向当前线程投递 `SIGSEGV`。

不同体系结构的入口细节不完全相同，但都会根据事件类型转到对应的内核处理入口。完整的概念对比和处理路径可以看：[中断、异常与系统调用详解：从内核入口到缺页异常](./中断、异常与系统调用详解-从内核入口到缺页异常.md)。

### 系统调用

#### 什么是系统调用？

系统调用是内核向用户程序提供的受控服务接口。应用不能直接操作磁盘、页表和网卡等受保护资源，需要通过系统调用让内核代为完成。

![用户程序通过系统调用请求内核服务](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/system-call.png)

这些系统调用按功能大致可分为如下几类：

- 设备管理：完成设备（输入输出设备和外部存储设备等）的请求或释放，以及设备启动等功能。
- 文件管理：完成文件的读、写、创建及删除等功能。
- 进程管理：进程的创建、撤销、阻塞、唤醒，进程间的通信等功能。
- 内存管理：完成内存的分配、回收以及获取作业占用内存区大小及地址等功能。
- 网络通信：创建 Socket、建立连接、收发数据等。

系统调用和库函数不是同一层概念。普通函数调用始终在用户态执行；glibc 等运行库提供的 `read()` 包装函数会按 ABI 准备系统调用号和参数，再执行特殊指令进入内核。也有很多库函数完全不需要系统调用。

#### 系统调用的过程了解吗？

以 Linux x86-64 下的 `read(fd, buf, count)` 为例，系统调用过程可以概括为：

1. glibc 包装函数按照调用约定，把系统调用号和参数放入指定寄存器，执行 `syscall`。
2. CPU 切换到内核特权级和对应入口。内核入口代码保存后续需要的寄存器状态，再根据系统调用号分发到 `read` 对应的处理逻辑。
3. 内核检查文件描述符、用户缓冲区、访问权限和文件状态，然后进入 VFS、文件系统、网络协议栈或设备驱动等路径。
4. 数据已经就绪时，内核完成读取并返回结果；数据未就绪时，当前线程可能进入等待状态，调度器转而运行其他可运行任务。
5. 调用完成后，返回值通过寄存器交给用户态。出错时，glibc 通常把内核错误码转换成 `-1` 和 `errno`。

![系统调用的过程](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/system-call-procedure.png)

#### 系统调用一定会发生上下文切换吗？

系统调用会让 CPU 进入内核态。如果内核很快处理完并返回原线程，整个过程只有用户态/内核态切换，没有切换线程。

当系统调用需要等待 I/O、锁或其他资源时，当前线程可能阻塞，调度器才会选择另一个可运行任务，此时会发生线程上下文切换。反过来，时钟中断进入内核后，如果调度器仍让原线程继续运行，也不会发生线程切换。

更完整的 `read()` 调用链、信号中断和系统调用重启可以看：[中断、异常与系统调用详解：从内核入口到缺页异常](./中断、异常与系统调用详解-从内核入口到缺页异常.md)。

## 进程和线程

进程和线程是操作系统面试里绕不开的一组概念。下面先给出高频问法的精简答案，想系统学习的话，可以继续阅读这些详细文章：

- [进程与线程详解：区别、状态、通信、上下文切换与虚拟线程](./进程与线程详解-区别、状态、通信、上下文切换与虚拟线程.md)，路径：`./进程与线程详解-区别、状态、通信、上下文切换与虚拟线程.md`
- [进程间通信（IPC）详解：管道、消息队列、共享内存、Socket 与 Binder](./进程间通信（IPC）详解-管道、消息队列、共享内存、Socket 与 Binder.md)，路径：`./进程间通信（IPC）详解-管道、消息队列、共享内存、Socket 与 Binder.md`
- [CPU 调度与系统负载详解](./CPU 调度与系统负载详解.md)，路径：`./CPU 调度与系统负载详解.md`

### 进程和线程的区别是什么？

进程和线程是操作系统中并发执行的两个核心概念，它们的关系可以理解为 **工厂和工人** 的关系。

![程序、进程和线程的关系](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/relationship-between-program-process-and-thread.png)

**进程（Process）就像一个工厂**。操作系统在分配资源时，是以进程为基本单位的。比如，当我启动一个微信，操作系统就为它建立了一个独立的工厂，分配给它专属的内存空间、文件句柄等资源。这个工厂与其他工厂（比如我打开的浏览器进程）是严格隔离的。

**线程（Thread）则像是工厂里的工人**。一个工厂里可以有很多工人，他们共享这个工厂的资源，但每个工人有自己的工具箱和任务清单，让他们可以独立地执行不同的任务。比如微信这个工厂里，可以有一个工人（线程）负责接收消息，一个工人负责渲染界面。

这是我用 AI 绘制的一张图片，可以说是非常形象了：

![用微信工厂类比进程和线程的区别](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/wechat-factory-process-thread.png)

下图是 Java 内存区域，我们从 JVM 的角度来说一下线程和进程之间的关系吧！

![Java 运行时数据区域（JDK1.8 之后）](https://oss.javaguide.cn/github/javaguide/java/jvm/java-runtime-data-areas-jdk1.8.png)

从上图可以看出：一个进程中可以有多个线程，多个线程共享进程的**堆**和**方法区（JDK1.8 之后的元空间）**资源，但是每个线程有自己的**程序计数器**、**虚拟机栈**和**本地方法栈**。

![线程共享和私有的内容](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/thread-shared-and-private-content.png)

可以从资源、调度、通信、开销和可靠性这 5 个角度总结：

| 维度          | 进程                                               | 线程                                                    |
| ------------- | -------------------------------------------------- | ------------------------------------------------------- |
| 基本定位      | 资源分配和隔离的基本单位                           | CPU 调度和执行的基本单位                                |
| 地址空间      | 默认拥有独立虚拟地址空间                           | 同一进程内的线程共享进程地址空间                        |
| 私有内容      | PID、地址空间、打开文件表、权限信息等进程级资源    | 线程 ID、栈、寄存器、程序计数器、线程本地存储等执行现场 |
| 通信方式      | 需要 IPC，例如管道、消息队列、共享内存、Socket     | 可以直接读写共享内存，但必须处理同步和线程安全          |
| 创建/切换成本 | 通常更高，进程切换可能涉及地址空间切换、TLB 失效等 | 通常更低，同进程线程切换一般不需要切换整套地址空间      |
| 故障影响      | 隔离性更好，一个进程崩溃通常不影响其他进程         | 一个线程出错可能导致整个进程退出                        |

比较完整的面试回答可以这样组织：

> 进程是程序运行时的资源容器，拥有独立虚拟地址空间和文件、权限等资源；线程是进程内的执行流，多个线程共享进程资源，但各自保存栈、寄存器、程序计数器等执行现场。进程间隔离更强，通信和切换成本更高；线程间协作更方便，创建和切换通常更轻，但共享内存带来线程安全问题。

### 有了进程为什么还需要线程？

核心原因就是**为了在单个应用内实现低开销、高效率的并发**。

如果一个服务端要同时处理网络读写、业务计算、日志刷盘，用多个进程当然也能做，但进程之间共享状态麻烦，通信要走 IPC，资源占用也更高。改成多个线程后，它们能直接共享堆内存和打开的连接，只要同步写对，协作成本低很多。

线程也能提高资源利用率。单核 CPU 上，一个线程阻塞在磁盘或网络 I/O 时，其他线程可以继续运行；多核 CPU 上，多个线程有机会在不同核心上并行执行。不过，线程不是越多越好。线程过多会带来栈内存占用、调度开销、锁竞争和缓存失效等问题，CPU 密集型任务和 I/O 密集型任务的线程数配置也不一样。

### 多线程一定能提高性能吗？

多线程能否提速取决于任务类型、CPU 核数和共享资源竞争：

- **I/O 密集型任务**：一个线程等待磁盘、网络或锁时，其他可运行线程可以继续使用 CPU，多线程能够隐藏一部分等待时间。
- **CPU 密集型任务**：可拆分且相互独立的计算可以分配到多个 CPU 核心并行执行，但加速效果还会受到串行部分、数据依赖、缓存和调度开销影响。
- **线程过多**：可运行线程远多于 CPU 核数后，运行队列会变长，上下文切换、缓存失效和锁竞争随之增加，吞吐量和延迟都可能变差。

线程数量需要结合任务特征、CPU quota、阻塞比例和压测结果设置，不能只按宿主机物理核心数或并发请求数直接推算。

### 线程间的同步的方式有哪些？

线程同步是两个或多个共享关键资源的线程的并发执行。应该同步线程以避免关键的资源使用冲突。

下面是几种常见的线程同步的方式：

1. **互斥锁（Mutex）**：采用互斥对象机制，只有拥有互斥对象的线程才有访问公共资源的权限。因为互斥对象只有一个，所以可以保证公共资源不会被多个线程同时访问。比如 Java 中的 `synchronized` 关键词和各种 `Lock` 都是这种机制。
2. **读写锁（Read-Write Lock）**：允许多个线程同时读取共享资源，但只有一个线程可以对共享资源进行写操作。
3. **信号量（Semaphore）**：它允许同一时刻多个线程访问同一资源，但是需要控制同一时刻访问此资源的最大线程数量。
4. **屏障（Barrier）**：屏障是一种同步原语，用于等待多个线程到达某个点再一起继续执行。当一个线程到达屏障时，它会停止执行并等待其他线程到达屏障，直到所有线程都到达屏障后，它们才会一起继续执行。比如 Java 中的 `CyclicBarrier` 是这种机制。
5. **条件变量（Condition Variable）/事件通知**：线程在条件不满足时等待，其他线程在条件变更后通知等待线程继续执行。它通常需要和互斥锁配合使用，避免“通知先发生、等待后发生”导致的丢通知问题。Java 中的 `Object.wait()/notify()`、`Condition.await()/signal()` 都属于这类思路；Windows 中的 Event 对象也可以看作事件通知类同步原语的一种实现。

### PCB 是什么？包含哪些信息？

**PCB（Process Control Block）** 即进程控制块，是操作系统中用来管理和跟踪进程的数据结构，每个进程都对应着一个独立的 PCB。你可以将 PCB 视为进程的大脑。

当操作系统创建一个新进程时，会为该进程分配一个唯一的进程 ID，并且为该进程创建一个对应的进程控制块。当进程执行时，PCB 中的信息会不断变化，操作系统会根据这些信息来管理和调度进程。

- **标识信息**：PID、父进程 ID、用户 ID 等。
- **进程状态和调度信息**：就绪、运行、阻塞、优先级、时间片、CPU 时间统计等。
- **CPU 上下文**：程序计数器、栈指针、通用寄存器、程序状态字 PSW 等，用于上下文切换后恢复执行。
- **内存管理信息**：虚拟地址空间、页表、内存映射等。
- **资源信息**：打开文件、文件描述符、I/O 状态、工作目录、信号处理信息等。
- ……

发生上下文切换时，操作系统会把当前进程的寄存器等现场保存到 PCB 中，再从下一个进程的 PCB 中恢复现场，让它能够从上次暂停的位置继续执行。

### TCB 是什么？和 PCB 有什么关系？

**TCB（Thread Control Block）** 即线程控制块，用来保存线程级别的控制信息，例如线程 ID、线程状态、寄存器现场、栈信息、调度优先级、线程本地存储等。

在一些教材或系统实现里，PCB 和 TCB 是分开的：PCB 更偏进程级资源，TCB 更偏线程级执行现场。Linux 的实现比较特殊，它把进程和线程都看成 task，用 `task_struct` 描述调度实体，再通过资源结构是否共享来区分进程和线程。理解时不用纠结名字，关键是分清：**地址空间、文件表等属于资源边界；栈、寄存器、程序计数器等属于执行现场**。

### 进程有哪几种状态？

我们一般把进程大致分为 5 种状态，这一点和线程很像：

- **创建状态（new）**：进程正在被创建，尚未到就绪状态。
- **就绪状态（ready）**：进程已处于准备运行状态，即进程获得了除了处理器之外的一切所需资源，一旦得到处理器资源（处理器分配的时间片）即可运行。
- **运行状态（running）**：进程正在处理器上运行（单核 CPU 下任意时刻只有一个进程处于运行状态）。
- **阻塞状态（waiting）**：又称为等待状态，进程正在等待某一事件而暂停运行如等待某资源为可用或等待 IO 操作完成。即使处理器空闲，该进程也不能运行。
- **结束状态（terminated）**：进程正在从系统中消失。可能是进程正常结束或其他原因中断退出运行。

![进程状态图转换图](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/state-transition-of-process.png)

状态转换要重点看触发原因：就绪态拿到 CPU 后进入运行态；运行态时间片用完，可能回到就绪态；运行中发起阻塞 I/O、等待锁或等待事件，会进入阻塞态；阻塞等待的事件完成后，通常先回到就绪态，等待下一次被调度。

有些教材还会加入**挂起状态**。挂起强调进程暂时不在内存中，或者被用户/系统暂停；阻塞强调进程在等待某个事件。二者不是一回事：进程可以阻塞但仍在内存里，也可以被换出到外存后处于阻塞挂起。

### 进程间的通信方式有哪些？

进程默认拥有独立虚拟地址空间，不能直接访问彼此的用户态内存，所以需要 **IPC（Inter-Process Communication，进程间通信）**。

面试里先按使用场景回答即可：

- 父子进程传少量字节流：匿名管道。
- 无亲缘关系进程做本机通信：命名管道、Unix Domain Socket。
- 小型结构化消息：消息队列。
- 本机大块数据交换：共享内存，但要配合信号量、互斥锁、`futex`、`eventfd` 等同步机制。
- 异步事件通知：信号。
- 跨机器通信：TCP/UDP Socket 或更上层的 RPC 框架。

更系统的分类、边界和选型可以看：[进程间通信（IPC）详解：管道、消息队列、共享内存、Socket 与 Binder](./进程间通信（IPC）详解-管道、消息队列、共享内存、Socket 与 Binder.md)，路径：`./进程间通信（IPC）详解-管道、消息队列、共享内存、Socket 与 Binder.md`。

### fork、exec、wait 分别做什么？

在 Unix/Linux 编程里，进程创建和程序替换常绕不开 `fork()`、`exec()`、`wait()` 这三个动作。这里先记面试短答，更多文件描述符继承、写时复制和多线程 `fork` 的细节可以看：[进程与线程详解](./进程与线程详解-区别、状态、通信、上下文切换与虚拟线程.md)，路径：`./进程与线程详解-区别、状态、通信、上下文切换与虚拟线程.md`。

![fork、exec、wait 的调用链路](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/fork-exec-wait-call-chain.png)

- **`fork()`**：创建子进程。父子进程从同一个位置继续执行，但返回值不同。
- **`exec()`**：在当前进程中装入另一个程序。它不会新建进程，而是替换当前进程的用户态代码和数据。
- **`wait()`/`waitpid()`**：等待子进程状态变化，并回收子进程退出后留在内核里的状态信息。

Shell 启动外部命令时，常见链路就是：Shell 先 `fork()` 出子进程，子进程再 `exec()` 成目标程序，父进程用 `wait()` 或 `waitpid()` 等待并回收退出状态。如果父进程一直不回收已退出的子进程，就可能留下僵尸进程。

### 什么是上下文切换？

上下文切换指 CPU 从一个执行实体切到另一个执行实体。操作系统需要保存当前执行实体的寄存器、程序计数器、栈指针等现场，再恢复下一个执行实体的现场。

![线程上下文切换和进程上下文切换的成本对比](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/context-switch-cost-comparison.png)

线程切换和进程切换都会有开销，但进程切换通常更重。原因是进程有独立地址空间，切换时可能涉及页表切换、TLB 失效、缓存局部性下降等成本；同一进程内的线程共享地址空间，切换时通常不需要换整套内存映射。

可以这样简化理解：同一进程内的线程切换，主要换线程自己的栈、寄存器、程序计数器等执行现场；跨进程切换除了换执行现场，还可能切换地址空间，并带来 TLB 和缓存局部性的影响。线上性能分析里，如果发现大量时间花在调度、锁等待、系统调用和上下文切换上，继续盲目加线程通常只会让情况更差。

还要区分**上下文切换**和**用户态/内核态切换**。系统调用、Page Fault、硬件中断都会进入内核，但只要内核处理后仍返回原线程，就没有发生线程上下文切换。

### 进程的调度算法有哪些？

![常见进程调度算法](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/scheduling-algorithms-of-process.png)

教材里的进程调度算法用于说明：当可运行任务多于 CPU 核数时，应该让谁先运行。调度器通常需要在**吞吐量、周转时间、响应时间、公平性**和切换开销之间做权衡。

这些算法可以分为**非抢占式**和**抢占式**两类。

**第一类：非抢占式调度（Non-Preemptive）**

这种方式下，一旦 CPU 分配给一个进程，它就会一直运行下去，直到任务完成或主动放弃（比如等待 I/O）。

1. **先到先服务（FCFS，First Come, First Served）**：按到达顺序运行，实现简单；长任务排在前面时，后面的短任务也要等待，会出现护航效应。
2. **短作业优先（SJF，Shortest Job First）**：优先运行预计执行时间短的任务，可以降低平均等待时间；现实中很难准确预测任务长度，也可能让长任务长期得不到运行。

**第二类：抢占式调度（Preemptive）**

操作系统可以暂停当前任务，把 CPU 交给另一个更合适的可运行任务。现代通用操作系统通常支持抢占。

- **时间片轮转（RR，Round-Robin）**：每个任务轮流运行一个时间片。时间片太短会放大上下文切换开销，太长又会逐渐接近 FCFS。
- **优先级调度（Priority）**：优先运行高优先级任务，能够表达任务的紧急程度，但需要处理低优先级任务饥饿问题。

**多级反馈队列（MLFQ，Multi-Level Feedback Queue）** 设置多个优先级队列，并根据任务的运行行为调整位置。新任务通常先进入高优先级队列；经常用完整个时间片的 CPU 密集型任务会逐步降级，经常主动等待 I/O 的交互任务可保留较高优先级。具体的升降级和防饥饿规则取决于实现。

FCFS、SJF、RR、优先级和 MLFQ 主要是教材中的简化模型。真实 Linux 调度的是 task 或调度实体，普通任务长期由 CFS 按权重和 `vruntime` 分配 CPU；Linux 6.6 开始在 fair 调度类中引入 EEVDF，用 lag 和虚拟截止时间改进任务选择。线上机器具体使用哪套实现，还要看内核版本和发行版补丁。

详细介绍：[CPU 调度与系统负载详解](./CPU 调度与系统负载详解.md)。

### 那究竟是谁来调度这个进程呢？

负责调度的是操作系统内核中的**调度器（Scheduler）**。当前任务阻塞、主动让出 CPU、时间片或运行额度耗尽、优先级变化，或者更合适的任务被唤醒时，内核都可能触发调度。

教材还会用**分派程序（Dispatcher）**描述把调度决定落到 CPU 上的过程：

- 调度器从可运行队列中选出下一个任务。
- 分派过程完成具体的上下文切换：
  - 保存当前进程的上下文（CPU 寄存器状态、程序计数器等）到其进程控制块（PCB）中。
  - 加载下一个被选中进程的上下文，从其 PCB 中读取状态，恢复到 CPU 寄存器。
  - 将 CPU 的控制权正式移交给新进程，让它开始运行。

现代 Linux 内核的实现不会严格拆成两个独立组件，面试时理解“选择下一个任务”和“完成上下文切换”这两项职责即可。

### load average 和 CPU 使用率有什么区别？

load average 反映一段时间内系统中可运行任务和不可中断睡眠任务的数量，Linux 下主要对应 R 状态和 D 状态；CPU 使用率描述 CPU 时间具体花在用户态、内核态、I/O wait、中断、空闲或虚拟化 steal 等位置。

load 高既可能是可运行任务在争抢 CPU，也可能是大量任务在等待块设备、网络存储、文件系统或 Swap，后一种情况下 CPU 仍可能有空闲。判断 load 还要结合逻辑 CPU 数：同样是 load 8，对 1 个逻辑 CPU 和 64 个逻辑 CPU 的压力完全不同。

排查时可以先用 `uptime` 看 1、5、15 分钟负载趋势，再结合 `top`、`vmstat 1`、`pidstat` 和 `mpstat` 判断任务是在争抢 CPU、等待 I/O，还是频繁发生上下文切换。更完整的指标解释和排查路径可以看：[CPU 调度与系统负载详解](./CPU 调度与系统负载详解.md)。

## 死锁

### 什么是死锁？

死锁（Deadlock）描述的是这样一种情况：一组进程/线程互相等待对方释放资源或完成动作，等待关系形成闭环，导致所有参与者都无法自行继续执行。

更具体地说，死锁不是“等得久”这么简单。普通阻塞可能等锁释放、I/O 返回或事务提交后继续执行；死锁里的等待链绕成了环，如果没有外力介入，这个环不会自然解开。

关于死锁的形成过程、Java 线程死锁排查和数据库死锁处理，可以看这篇更完整的专题：[死锁详解：四个必要条件、Java 死锁排查与数据库死锁处理](./死锁详解-四个必要条件、Java 死锁排查与数据库死锁处理.md)。

一个最经典的例子就是 **“交叉持锁”**。想象有两个线程和两个锁：

- 线程 1 先拿到了锁 A，然后尝试去获取锁 B。
- 几乎同时，线程 2 拿到了锁 B，然后尝试去获取锁 A。

这时，线程 1 等着线程 2 释放锁 B，线程 2 等着线程 1 释放锁 A，双方都持有对方需要的资源，并等待对方释放，就形成了一个等待环。

![死锁场景示意图：线程 A 持有 resource1 并等待 resource2，线程 B 持有 resource2 并等待 resource1，等待链形成闭环](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/dead-lock-deadlock-scenario.png)

### 产生死锁的四个必要条件是什么？

死锁的发生并不是偶然的，它需要同时满足**四个必要条件**：

1. **互斥**：资源必须处于非共享模式，即一次只有一个进程可以使用。如果另一进程申请该资源，那么必须等待直到该资源被释放为止。
2. **占有并等待**：一个进程至少应该占有一个资源，并等待另一资源，而该资源被其他进程所占有。
3. **非抢占**：资源不能被抢占。只能在持有资源的进程完成任务后，该资源才会被释放。
4. **循环等待**：有一组等待进程 `{P0, P1, ..., Pn}`，`P0` 等待的资源被 `P1` 占有，`P1` 等待的资源被 `P2` 占有，...，`Pn-1` 等待的资源被 `Pn` 占有，`Pn` 等待的资源又被 `P0` 占有。

![死锁四个必要条件示意图：互斥、请求与保持、非抢占、循环等待同时成立才会形成死锁](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/dead-lock-four-conditions.png)

**注意**：这四个条件是产生死锁的必要条件，必须同时成立。只满足其中一两个条件不一定会死锁；反过来，只要能稳定破坏其中任意一个条件，就可以从结构上预防死锁。

### 能写一个模拟产生死锁的代码吗？

下面通过一个实际的例子来复现上面的交叉持锁场景：

```java
public class DeadLockDemo {
    private static final Object resource1 = new Object(); // 资源 1
    private static final Object resource2 = new Object(); // 资源 2

    public static void main(String[] args) {
        new Thread(() -> {
            synchronized (resource1) {
                System.out.println(Thread.currentThread() + "get resource1");
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                System.out.println(Thread.currentThread() + "waiting get resource2");
                synchronized (resource2) {
                    System.out.println(Thread.currentThread() + "get resource2");
                }
            }
        }, "线程 1").start();

        new Thread(() -> {
            synchronized (resource2) {
                System.out.println(Thread.currentThread() + "get resource2");
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                System.out.println(Thread.currentThread() + "waiting get resource1");
                synchronized (resource1) {
                    System.out.println(Thread.currentThread() + "get resource1");
                }
            }
        }, "线程 2").start();
    }
}
```

Output

```text
Thread[线程 1,5,main]get resource1
Thread[线程 2,5,main]get resource2
Thread[线程 1,5,main]waiting get resource2
Thread[线程 2,5,main]waiting get resource1
```

线程 1 通过 `synchronized (resource1)` 获得 `resource1` 的监视器锁，线程 2 通过 `synchronized (resource2)` 获得 `resource2` 的监视器锁。`Thread.sleep(1000)` 不是死锁的原因，它只是把两个线程交错执行的窗口拉大，让死锁更容易复现。休眠结束后，两个线程都开始申请对方持有的资源，于是陷入互相等待。

### 解决死锁的方法

面试里回答到这个程度即可：解决死锁一般有 **预防、避免、检测和解除/恢复** 四类思路。

- **预防**：提前破坏死锁四个必要条件之一。工程里最常见的是固定加锁顺序、缩小锁范围、避免持锁做慢操作。
- **避免**：分配资源前判断系统是否仍处于安全状态，典型代表是银行家算法。这个方法更偏教材理解，普通业务系统很少直接实现。
- **检测**：允许等待发生，再检查等待图或资源分配图里是否出现环。Java 里可以用 `jcmd <pid> Thread.print -l`、`jstack -l <pid>` 或 `ThreadMXBean.findDeadlockedThreads()` 辅助排查；数据库也会检测事务等待环。
- **解除/恢复**：发现死锁后打破等待环，例如终止进程、回滚事务、抢占资源或让应用层重试。数据库事务天然支持回滚，因此更适合采用检测和恢复。

![死锁处理策略图：预防、避免、检测、恢复四类方法的作用位置和工程常见程度](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/dead-lock-strategies.png)

这部分面试不必展开太细，抓住层次即可。想继续看资源分配图、等待图、Java 线程栈排查和数据库死锁重试，可以看：[死锁详解：四个必要条件、Java 死锁排查与数据库死锁处理](./死锁详解-四个必要条件、Java 死锁排查与数据库死锁处理.md)。

## 参考

- 《计算机操作系统—汤小丹》第四版
- 《深入理解计算机系统》
- 《重学操作系统》
- 操作系统为什么要分用户态和内核态：<https://blog.csdn.net/chen134225/article/details/81783980>
- 从根上理解用户态与内核态：<https://juejin.cn/post/6923863670132850701>
- 什么是僵尸进程与孤儿进程：<https://blog.csdn.net/a745233700/article/details/120715371>

<!-- @include: @article-footer.snippet.md -->


---

<!-- source: 操作系统/操作系统常见面试题总结（下）.md -->

---
title: 操作系统常见面试题总结（下）
description: 最新操作系统高频面试题总结（下）：内存管理、VSZ/RSS/PSS、虚拟内存、TLB、Page Fault、页面置换、阻塞 I/O、I/O 多路复用、零拷贝、文件系统、Page Cache、fsync 和磁盘调度。
category: 计算机基础
tag:
  - 操作系统
head:
  - - meta
    - name: keywords
      content: 操作系统面试题,内存管理,VSZ,RSS,PSS,虚拟内存,进程地址空间,进程隔离,共享内存,分页 vs 分段,页面置换算法,内存碎片,伙伴系统,TLB,Page Fault,缺页异常,SIGSEGV,Swap,OOM,阻塞I/O,read系统调用,零拷贝,mmap,sendfile,splice,I/O多路复用,select,poll,epoll,文件系统,inode,VFS,Page Cache,fsync
---

<!-- @include: @article-header.snippet.md -->

这篇《操作系统常见面试题总结（下）》承接上篇，重点放在 **内存管理、虚拟内存、分页分段、TLB、缺页异常、页面置换、I/O 多路复用、零拷贝、文件系统和磁盘调度**。

如果说上篇更偏“进程、线程和并发控制”，这篇更偏“程序运行时到底怎么用内存、怎么做 I/O、怎么和文件系统交互”。这些内容看起来离业务代码比较远，但很多后端问题最终都会落到这里：为什么 mmap 能少一次拷贝？为什么 epoll 能撑住大量连接？为什么同一个虚拟地址在不同进程里互不影响？为什么频繁缺页会让系统变慢？

建议阅读时抓住一条主线：**操作系统通过虚拟内存管理地址和隔离，通过 I/O 机制管理数据流动，通过文件系统管理持久化数据**。把这条线串起来，很多零散概念就不再只是名词。

## 内存管理

### 内存管理主要做了什么？

![内存管理职责概览](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/memory-management-responsibilities.webp)

面试里回答“内存管理做什么”，可以从 5 件事说起：

- **分配和回收内存**：用户态分配器会通过 `brk()`、`mmap()` 等接口向内核申请或释放虚拟地址区域；内核再管理物理页和内核对象。
- **地址转换**：程序访问虚拟地址，CPU 中的 MMU 配合页表和 TLB，把虚拟地址翻译成物理地址。
- **进程隔离和权限保护**：每个进程都有自己的地址空间，页表项还能记录读、写、执行、用户态/内核态等权限。
- **页面回收和换页**：物理内存紧张时，内核会回收文件页或匿名页，必要时把匿名页写入 Swap。
- **共享和映射**：动态库共享、共享内存 IPC、`mmap()` 文件映射、写时复制（COW）都依赖虚拟地址到物理页的映射能力。

面试里可以抓住一条主线：内存管理把程序看到的地址和真实物理内存隔开，再用分配、映射、保护和回收把内存管起来。

### VSZ、RSS 和 PSS 有什么区别？

Linux 里看进程内存，最容易混的是 VSZ、RSS 和 PSS。

- **VSZ**：进程已经映射的虚拟地址空间大小。它包含尚未真正驻留的匿名映射、文件映射、共享库和预留地址，不能直接当成物理内存占用。
- **RSS**：当前已经驻留在 RAM 中、并映射给该进程的页面总量。共享库、共享内存和 Page Cache 中的共享页也会算进相关进程的 RSS。
- **PSS**：按比例分摊共享页后的内存占用。一个物理页如果被 4 个进程共享，每个进程的 PSS 只算四分之一。

所以，看单个进程常驻内存可以参考 RSS；要估算多个进程合计占用，PSS 更合适。直接把多个进程的 RSS 相加，通常会把共享页重复算进去。

常用命令：

```bash
grep -E 'VmSize|VmRSS|RssAnon|RssFile|RssShmem|VmSwap' /proc/<pid>/status
cat /proc/<pid>/smaps_rollup
```

### 什么是内存碎片？

内存碎片是由内存的申请和释放产生的，通常分为下面两种：

- **内部内存碎片（Internal Memory Fragmentation，简称为内存碎片）**：已经分配给进程使用但未被使用的内存。导致内部内存碎片的主要原因是，当采用固定比例比如 2 的幂次方进行内存分配时，进程所分配的内存可能会比其实际所需要的大。举个例子，一个进程只需要 65 字节的内存，但为其分配了 128（2^7）大小的内存，那 63 字节的内存就成为了内部内存碎片。
- **外部内存碎片（External Memory Fragmentation，简称为外部碎片）**：由于未分配的连续内存区域太小，以至于不能满足任意进程所需要的内存分配请求，这些小片段且不连续的内存空间被称为外部碎片。也就是说，外部内存碎片指的是那些并未分配给进程但又不能使用的内存。我们后面介绍的分段机制就会导致外部内存碎片。

![连续内存分配与碎片](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/memory-fragmentation.webp)

内存碎片会导致内存利用率下降，如何减少内存碎片是内存管理要非常重视的一件事情。

### 常见的内存管理方式有哪些？

内存管理方式可以简单分为下面两种：

- **连续内存管理**：为一个用户程序分配一个连续的内存空间，内存利用率一般不高。
- **非连续内存管理**：允许一个程序使用的内存分布在离散或者说不相邻的内存中，相对更加灵活一些。

#### 连续内存管理

**块式管理** 是早期计算机操作系统的一种连续内存管理方式，存在严重的内存碎片问题。块式管理会将内存分为几个固定大小的块，每个块中只包含一个进程。如果程序运行需要内存的话，操作系统就分配给它一块，如果程序运行只需要很小的空间的话，分配的这块内存很大一部分几乎被浪费了。这些在每个块中未被利用的空间，我们称之为内部内存碎片。除了内部内存碎片之外，由于两个内存块之间可能还会有外部内存碎片，这些不连续的外部内存碎片由于太小了无法再进行分配。

在 Linux 系统中，连续内存管理采用了 **伙伴系统（Buddy System）算法** 来实现，这是一种经典的连续内存分配算法，可以有效解决外部内存碎片的问题。伙伴系统的主要思想是将内存按 2 的幂次划分（每一块内存大小都是 2 的幂次比如 2^6=64 KB），并将相邻的内存块组合成一对伙伴（注意：**必须是相邻的才是伙伴**）。

当进行内存分配时，伙伴系统会尝试找到大小最合适的内存块。如果找到的内存块过大，就将其一分为二，分成两个大小相等的伙伴块。如果还是大的话，就继续切分，直到到达合适的大小为止。

假设两块相邻的内存块都被释放，系统会将这两个内存块合并，进而形成一个更大的内存块，以便后续的内存分配。这样就可以减少内存碎片的问题，提高内存利用率。

![伙伴系统（Buddy System）内存管理](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/linux-buddy-system.png)

虽然解决了外部内存碎片的问题，但伙伴系统仍然存在内存利用率不高的问题（内部内存碎片）。这主要是因为伙伴系统只能分配大小为 2^n 的内存块，因此当需要分配的内存大小不是 2^n 的整数倍时，会浪费一定的内存空间。举个例子：如果要分配 65 大小的内存块，依然需要分配 2^7=128 大小的内存块。

![伙伴系统内存浪费问题](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/buddy-system-memory-waste.png)

对于小对象频繁分配带来的内部内存碎片和性能问题，Linux 还会使用 **SLAB/SLUB** 这类分配器优化。它们会把常用内核对象缓存起来，按对象类型复用已经初始化过的内存块，减少重复分配、初始化和释放的成本。由于这部分内容不是本篇文章的重点，这里点到为止。

#### 非连续内存管理

非连续内存管理存在下面 3 种方式：

- **段式管理**：以段（一段连续的物理内存）的形式管理/分配物理内存。应用程序的虚拟地址空间被分为大小不等的段，段是有实际意义的，每个段定义了一组逻辑信息，例如有主程序段 MAIN、子程序段 X、数据段 D 及栈段 S 等。
- **页式管理**：把物理内存分为连续等长的物理页，应用程序的虚拟地址空间也被划分为连续等长的虚拟页，是现代操作系统广泛使用的一种内存管理方式。
- **段页式管理机制**：结合了段式管理和页式管理。程序的地址空间先按逻辑分段，每个段再划分为固定大小的页，物理内存仍按页框分配。

### 虚拟内存

#### 什么是虚拟内存？有什么用？

**虚拟内存（Virtual Memory）** 是操作系统提供的一层内存抽象。程序看到的是连续、私有的虚拟地址空间，真正的数据放在物理内存的哪些位置，由操作系统和硬件共同决定。

简单来说，虚拟内存把“程序使用的地址”和“内存条上的真实地址”隔开了。进程访问虚拟地址时，CPU 中的 MMU 会根据页表等映射关系，把虚拟地址转换成物理地址，再去访问真正的内存。

![虚拟内存作为进程访问主存的桥梁](https://oss.javaguide.cn/xingqiu/virtual-memory.png)

总结来说，虚拟内存主要提供了下面这些能力：

- **隔离进程**：每个进程都有自己的虚拟地址空间和页表。不同进程即使使用相同的虚拟地址，也可以映射到不同的物理页，彼此不会直接踩内存。
- **提升物理内存利用率**：操作系统不需要把进程的全部代码和数据一次性装进物理内存，只把当前真正会用到的页加载进来。
- **简化内存管理**：进程看到的是一片连续的虚拟地址空间，物理内存可以是离散的页帧，复杂的拼接工作交给页表和 MMU。
- **多个进程共享物理内存**：进程在运行过程中会加载许多操作系统动态库，这些库对于多个进程而言可以共用同一份物理页；多个进程也可以通过共享内存 IPC 主动映射同一块物理内存，用于高效交换数据。
- **提高内存使用安全性**：控制进程对物理内存的访问，隔离不同进程的访问权限，提高系统的安全性。
- **提供更大的可使用内存空间**：当物理内存不够用时，可以把暂时不用的页换出到磁盘，需要时再换回来。这样程序感知到的可用内存空间可以超过实际物理内存，不过频繁换页会明显拖慢系统。

#### 没有虚拟内存有什么问题？

如果没有虚拟内存的话，程序直接访问和操作的都是物理内存，看似少了一层中介，但多了很多问题。

**具体有什么问题呢？** 这里举几个例子说明（参考虚拟内存提供的能力回答这个问题）：

1. 用户程序可以访问任意物理内存，可能会不小心操作到系统运行必需的内存，进而造成操作系统崩溃，严重影响系统的安全。
2. 同时运行多个程序容易崩溃。比如你想同时运行一个微信和一个 QQ 音乐，微信在运行的时候给内存地址 1xxx 赋值后，QQ 音乐也同样给内存地址 1xxx 赋值，那么 QQ 音乐对内存的赋值就会覆盖微信之前所赋的值，这就可能会造成微信这个程序会崩溃。
3. 程序运行过程中使用的所有数据或指令都要载入物理内存，根据局部性原理，其中很大一部分可能都不会用到，白白占用了宝贵的物理内存资源。
4. ……

#### 什么是虚拟地址和物理地址？

**物理地址（Physical Address）** 是真正的物理内存中地址，更具体点来说是内存地址寄存器中的地址。程序中访问的内存地址不是物理地址，而是 **虚拟地址（Virtual Address）**。

也就是说，我们编程开发的时候实际就是在和虚拟地址打交道。比如在 C 语言中，指针里面存储的数值就可以理解成为内存里的一个地址，这个地址也就是我们说的虚拟地址。

操作系统一般通过 CPU 芯片中的一个重要组件 **MMU（Memory Management Unit，内存管理单元）** 将虚拟地址转换为物理地址，这个过程被称为 **地址翻译/地址转换（Address Translation）**。在现代系统里，这个转换通常依赖页表完成，TLB 会缓存最近使用过的地址转换结果，减少查页表的开销。

![地址翻译过程](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/physical-virtual-address-translation.png)

通过 MMU 将虚拟地址转换为物理地址后，CPU 再访问对应的物理内存位置，完成读写请求。也正是因为有这层转换，不同进程里数值相同的虚拟地址，最终可以落到完全不同的物理页上。

这也是进程隔离和进程间通信的基础：默认情况下，一个进程不能直接读写另一个进程的用户态地址空间；如果两个进程确实需要交换数据，就要借助管道、消息队列、共享内存、Socket 等 IPC 机制。关于 IPC 的系统总结可以看：[进程间通信（IPC）详解：管道、消息队列、共享内存、Socket 与 Binder](./进程间通信（IPC）详解-管道、消息队列、共享内存、Socket 与 Binder.md)。

MMU 将虚拟地址翻译为物理地址的主要机制有两种：**分段机制** 和 **分页机制**。

#### 什么是虚拟地址空间和物理地址空间？

- 虚拟地址空间是虚拟地址的集合，是虚拟内存的范围。每一个进程都有一个一致且私有的虚拟地址空间。
- 物理地址空间是物理地址的集合，是物理内存的范围。

#### 虚拟地址与物理内存地址是如何映射的？

MMU 将虚拟地址翻译为物理地址的主要机制有 3 种：

1. 分段机制
2. 分页机制
3. 段页机制

其中，现代操作系统广泛采用分页机制，需要重点关注！

### 分段机制

**分段机制（Segmentation）** 按程序的逻辑结构来划分地址空间，比如代码段、数据段、堆、栈等。每个段的长度可以不同，段本身有明确的语义，也可以配合权限控制。

#### 段表有什么用？地址翻译过程是怎样的？

分段管理通过 **段表（Segment Table）** 映射虚拟地址和物理地址。段表项通常会记录段基址、段界限（段的长度）、访问权限等信息。

分段机制下的虚拟地址由两部分组成：

- **段号**：标识着该虚拟地址属于整个虚拟地址空间中的哪一个段。
- **段内偏移量**：相对于该段起始地址的偏移量。

具体的地址翻译过程如下：

1. MMU 首先解析得到虚拟地址中的段号；
2. 通过段号去该应用程序的段表中取出对应的段信息（找到对应的段表项）；
3. 检查段内偏移量是否超过段界限，检查访问权限是否合法；
4. 合法的话，用段基址加上段内偏移量得到最终的物理地址。

![分段地址转换示意图：虚拟地址由段号和段内偏移组成，通过段表查到基地址后计算物理地址](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/virtual-memory-segmentation.png)

举个例子，要访问段 3、偏移量 500 的地址，如果段 3 的基地址是 7000，且偏移量没有越界，那么最终物理地址就是 7000 + 500 = 7500。

如果段选择子无效、段内偏移越界或访问权限不符合要求，CPU 会触发体系结构规定的异常。页面是否已经驻留物理内存则属于分页和 Page Fault 处理的问题，不应和纯分段模型混在一起。

#### 分段机制为什么会导致内存外部碎片？

分段机制容易出现外部内存碎片，根本原因是**段的长度不固定，并且每个段通常需要一块连续的物理内存**。进程不断创建和释放段后，物理内存里会留下很多零散空洞；这些空洞总量可能够用，但单个空洞不够大，仍然无法分配给新的大段。

举个例子：假设可用物理内存为 5G 的系统使用分段机制分配内存。现在有 4 个进程，每个进程的内存占用情况如下：

- 进程 1：0~1G（第 1 段）
- 进程 2：1~3G（第 2 段）
- 进程 3：3~4.5G（第 3 段）
- 进程 4：4.5~5G（第 4 段）

此时，我们关闭了进程 1 和进程 4，则第 1 段和第 4 段的内存会被释放，空闲物理内存还有 1.5 GB。由于这 1.5 GB 物理内存并不是连续的，导致没办法将空闲的物理内存分配给一个需要 1.5 GB 连续物理内存的进程。

![分段机制导致外部内存碎片](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/segment-external-memory-fragmentation.png)

外部碎片可以通过内存紧凑来缓解，也就是把还在使用的段搬到一起，腾出连续空间。但搬移大段很费时间，如果还伴随换出、换入磁盘，系统会明显变慢。

### 分页机制

**分页机制（Paging）** 把虚拟地址空间和物理内存都切成固定大小的块。虚拟地址空间里的块叫虚拟页，物理内存里的块叫物理页或者页帧。Linux 下，一页通常是 4 KB。

**注意：这里的页是连续等长的，不同于分段机制下不同长度的段。**

在分页机制下，应用程序虚拟地址空间中的任意虚拟页可以映射到物理内存中的任意物理页帧上，因此物理内存可以离散分配。分页按照固定页大小管理内存，基本消除了分段机制中的外部内存碎片；不过最后一页可能装不满，会产生少量内部碎片。

分页还有一个很重要的能力：支持按需调页。程序并不需要一启动就把所有页装进物理内存，只有真正访问到某个虚拟页时，操作系统才把对应数据加载进来。

#### 页表有什么用？地址翻译过程是怎样的？

分页管理通过 **页表（Page Table）** 映射虚拟地址和物理地址。页表项记录虚拟页号和物理页帧号的对应关系，还会记录访问位、脏位、权限位、存在位等状态信息。我这里画了一张基于单级页表进行地址翻译的示意图。

![单级页表](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/page-table.png)

在分页机制下，每个进程都会有自己的页表。正因为页表是进程私有的，不同进程相同的虚拟页号可以映射到不同的物理页帧，从而实现地址空间隔离。

分页机制下的虚拟地址由两部分组成：

- **页号**：通过虚拟页号可以从页表中取出对应的物理页帧号；
- **页内偏移量**：物理页帧起始地址 + 页内偏移量 = 物理内存地址。

具体的地址翻译过程如下：

1. MMU 首先解析得到虚拟地址中的虚拟页号；
2. 通过虚拟页号去该进程的页表中取出对应的物理页帧号（找到对应的页表项）；
3. 用物理页帧号对应的起始地址加上虚拟地址中的页内偏移量，得到最终的物理地址。

![分页地址转换示意图：虚拟地址拆成页号和页内偏移，页表把虚拟页映射到物理页帧](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/virtual-memory-paging.png)

如果页表项不存在、页面当前不在物理内存中，或者访问权限不匹配，CPU 会触发 Page Fault。内核随后判断这次访问能否修复：可以修复就建立映射或调入页面，无法修复则通常向当前线程投递 `SIGSEGV`。

**通过虚拟页号一定能找到对应的物理页帧号吗？找到了物理页帧号得到最终的物理地址后，对应的物理页一定存在吗？**

不一定。页表项可能不存在，页面可能还没有驻留物理内存，访问方式也可能不符合页表项记录的权限。这些情况都会触发 Page Fault，具体处理过程会在后文介绍。

#### 单级页表有什么问题？为什么需要多级页表？

以 32 位环境为例，虚拟地址空间范围共有 2^32（4 GB）。假设一页大小是 2^12（4 KB），那就需要 4 GB / 4 KB = 2^20 个页表项。每个页表项占用 4 字节，整张单级页表大约就是 4 MB。也就是说，一个进程即使只用了一小段虚拟地址空间，单级页表也要为整个 4 GB 地址空间预留页表项。

系统运行的进程多起来后，这部分开销就很明显。更要命的是，绝大多数进程只会使用虚拟地址空间中的一小部分，单级页表里的大量页表项其实都是空的。

为了解决这个问题，操作系统引入了 **多级页表**。多级页表的核心思路是：顶层页表覆盖整个虚拟地址空间，下级页表按需创建；某段虚拟地址完全没用到，就不需要为它创建下级页表。

这里以二级页表为例进行介绍：一级页表共有 1024 个页表项，每个一级页表项可以指向一张二级页表；每张二级页表同样有 1024 个页表项。只有某个一级页表项覆盖的地址范围真的被使用时，才需要创建对应的二级页表。

假设只需要 2 个二级页表，那两级页表的内存占用情况为：4 KB（一级页表占用） + 4 KB \* 2（二级页表占用） = 12 KB。

![多级页表示意图：PGD、PUD、PMD、PTE 分层索引，只为实际使用的地址范围创建下级页表](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/virtual-memory-multi-level-page-table.png)

多级页表是在省页表空间：多走几层索引，换来更小的页表内存占用。实际系统会配合 TLB 缓存常用页表项，所以多级页表的额外查表开销不会每次都完整发生。

#### TLB 有什么用？使用 TLB 之后的地址翻译流程是怎样的？

为了提高虚拟地址到物理地址的转换速度，CPU/MMU 会使用 **转址旁路缓存（Translation Lookaside Buffer，TLB，也被称为快表）** 缓存近期的地址转换结果。

![加入 TLB 之后的地址翻译](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/physical-virtual-address-translation-mmu.png)

在主流的 AArch64 和 x86-64 体系结构下，TLB 是 MMU 使用的硬件缓存。可以把它理解为按虚拟页匹配物理页框的高速缓存，但不能把具体硬件结构等同于软件哈希表。操作系统负责维护页表；页表映射发生变化后，还要按体系结构要求使相关 TLB 项失效，避免 CPU 继续使用旧映射。

使用 TLB 之后的地址翻译流程是这样的：

1. CPU 使用虚拟页号以及地址空间标识等信息匹配 TLB 项；
2. 如果能查到对应的物理页的话，就不用再查询页表了，这种情况称为 TLB 命中（TLB hit）。
3. 如果不能查到对应的物理页的话，还是需要去查询主存中的页表，同时将页表中的该映射表项添加到 TLB 中，这种情况称为 TLB 未命中（TLB miss）。
4. 当 TLB 填满后，又要登记新页时，就按照一定的淘汰策略淘汰掉快表中的一个页。

![TLB 缓存地址转换结果的流程：CPU 先查 TLB，命中直接访问内存，未命中再查多级页表并更新 TLB](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/virtual-memory-tlb-cache.png)

由于页表也在主存中，因此在没有 TLB 之前，CPU 访问一个虚拟地址，往往要先访问内存查页表，再访问真正的数据；多级页表下查表次数还会更多。有了 TLB 之后，命中时可以跳过页表查询，直接拿到物理页帧号，地址转换会快很多。

TLB 的设计思想非常简单，但命中率往往很高，效果很好。这依赖的还是局部性原理：程序在一段时间内频繁访问的页通常只是少数几个。

看完了之后你会发现快表和我们平时经常在开发系统中使用的缓存（比如 Redis）很像，的确是这样的，操作系统中的很多思想、很多经典的算法，你都可以在我们日常开发使用的各种工具或者框架中找到它们的影子。

#### 换页机制有什么用？

换页机制的思想是：当物理内存不够用时，操作系统选择一些暂时不常用的物理页，把它们换出到磁盘；等进程再次访问这些页时，再把它们换回物理内存。也就是说，换页机制利用磁盘这种更低成本的存储设备，从逻辑上扩展了可用内存。

这也就解释了一个日常使用电脑常见的问题：为什么操作系统中所有进程运行所需的物理内存即使比真实的物理内存要大一些，这些进程也是可以正常运行的，只是运行速度会变慢。

这同样是一种时间换空间的策略，用页的调入调出时间，换来更大的可用内存空间。问题也很直接：一旦频繁发生主缺页和磁盘换页，系统会明显变慢，严重时会出现抖动（Thrashing），CPU 大部分时间都耗在换页上。

#### 什么是缺页异常（Page Fault）？

Page Fault 是 CPU 在地址翻译或页级权限检查无法直接完成时触发的**同步异常**。它由当前访存指令引起，不是外设触发的硬件中断，也不代表程序一定出错。

内核接管后，会检查地址是否落在进程合法的虚拟内存区域（VMA）中，以及访问类型是否符合权限要求：

- **可修复的 Page Fault**：例如匿名页第一次访问时才分配物理页、文件页或 Swap 页尚未驻留内存、写入 COW 页需要先复制。内核完成分配、调页或 COW，更新页表后，CPU 重新执行触发异常的指令。
- **不可修复的 Page Fault**：例如地址不属于任何合法 VMA、写只读映射、执行不可执行页面。Linux 通常向当前线程投递 `SIGSEGV`，进程按默认动作终止。

从性能统计角度，可修复的 Page Fault 常分为：

- **主缺页（Major Page Fault）**：处理过程需要从文件或 Swap 读取页面，涉及实际 I/O，开销较大。
- **次缺页（Minor Page Fault）**：不需要从存储设备读取页面，例如建立已有物理页的映射、分配零页或处理部分 COW 场景，开销通常更小。

C/C++ 越界访问也不保证立刻触发 `SIGSEGV`。如果越界地址仍落在已映射且权限允许的页面中，CPU 不会仅凭语言层面的数组边界识别错误，程序可能只是破坏了相邻数据。

![缺页异常处理流程：MMU 发现地址翻译或权限检查无法完成后进入内核，检查访问合法性、分配或置换页帧、更新页表并重试指令](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/virtual-memory-page-fault.png)

Page Fault 与系统调用、信号之间的关系可以看：[中断、异常与系统调用详解：从内核入口到缺页异常](./中断、异常与系统调用详解-从内核入口到缺页异常.md)。

#### 常见的页面置换算法有哪些？

当发生主缺页时，如果物理内存中没有空闲的物理页面可用，操作系统就必须将物理内存中的一个物理页淘汰出去，这样就可以腾出空间来加载新的页面。

用来选择淘汰哪一个物理页的规则叫做 **页面置换算法**，我们可以把页面置换算法看成是淘汰物理页的规则。

页缺失太频繁的发生会非常影响性能，一个好的页面置换算法应该是可以减少页缺失出现的次数。

常见的页面置换算法有下面这 5 种（其他还有很多页面置换算法都是基于这些算法改进得来的）：

![页面置换算法对比](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/memory-page-replacement.webp)

1. **最佳页面置换算法（OPT，Optimal）**：优先淘汰未来最长时间不会再被访问的页面，理论上缺页率最低。但它需要预知未来，现实中无法实现，通常作为衡量其他算法的基准。
2. **先进先出页面置换算法（FIFO，First In First Out）**：总是淘汰最早进入内存的页面，实现简单，但容易误伤热点页，并且可能出现 Belady 异常。
3. **最近最久未使用页面置换算法（LRU，Least Recently Used）**：淘汰最久没有被访问的页面。它利用的是时间局部性，效果接近 OPT，但精确实现需要维护时间戳或链表，成本较高。
4. **最少使用页面置换算法（LFU，Least Frequently Used）**：淘汰一段时间内访问次数最少的页面。它关注访问频率，但容易让早期频繁访问、后来不再使用的页面长期留在内存中，因此实际使用时常配合计数衰减。
5. **时钟页面置换算法（Clock）**：也叫二次机会算法，是 LRU 的一种低成本近似实现。它给每个页面维护一个访问位，页面排成环形队列；访问位为 1 时先清零并跳过，访问位为 0 时才淘汰。

![CLOCK 页面置换算法示意图：页面按环形队列排列，指针根据访问位 R 判断给第二次机会还是淘汰页面](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/virtual-memory-clock-algorithm.png)

**FIFO 页面置换算法性能为何不好？**

主要原因有二：

1. **经常访问或者需要长期存在的页面会被频繁调入调出**：较早调入的页往往是经常被访问或者需要长期存在的页，这些页会被反复调入和调出。
2. **存在 Belady 现象**：被置换的页面并不是进程不会访问的，有时就会出现分配的页面数增多但缺页率反而提高的异常现象。出现该异常的原因是因为 FIFO 算法只考虑了页面进入内存的顺序，而没有考虑页面访问的频率和紧迫性。

**哪一种页面置换算法实际用的比较多？**

LRU 及其近似算法在实际系统中应用较多，因为它比较符合程序的局部性规律。不过，真实系统通常不会原样照搬教科书算法，而是做大量工程化改造。比如 Linux 内核不是简单地在 OPT/FIFO/LRU/CLOCK 里挑一个，而是使用活跃/非活跃 LRU、workingset、refault 检测等机制做近似回收；InnoDB Buffer Pool 也对传统 LRU 做了改进，避免预读和全表扫描把热点页挤出去。

![Linux 页面回收思路](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/memory-page-reclaim.webp)

### Swap、工作集和抖动分别是什么？

**Swap** 是磁盘上的后备空间。匿名页没有对应的文件来源，物理内存紧张时，如果内核要回收这类页面，就可能把它们写入 Swap；以后进程再次访问，再从 Swap 读回内存。

Swap 不是免费的内存扩容。磁盘比内存慢很多，Swap 活跃时，业务延迟通常会变差。

**工作集** 是进程在一段时间内真正频繁访问的页面集合。只要物理内存能放下主要进程的工作集，缺页就比较可控；如果放不下，页面会被频繁换出又换入。

这种状态叫 **抖动（Thrashing）**。抖动时，CPU 不一定忙在业务计算上，可能大量时间耗在缺页处理、页面回收和磁盘 I/O 上。

排查时可以看这些指标：

```bash
free -h
vmstat 1
grep -E 'pgfault|pgmajfault|pswpin|pswpout|pgscan|pgsteal' /proc/vmstat
cat /proc/pressure/memory
```

### Overcommit 和 OOM 是什么关系？

Linux 允许进程申请的虚拟内存超过当前 RAM 和 Swap，这叫 **Overcommit**。它适合那些会预留很大地址空间、但不一定真正使用完的程序。

因此，`malloc()` 或 `mmap()` 成功，通常只表示虚拟地址空间申请成功，并不代表所有物理页已经准备好。很多物理页要等到首次访问时才会真正分配。

当进程实际访问页面时，如果内核无法通过回收、写回或 Swap 获得足够内存，就可能触发 **OOM Killer**，选择一个或多个进程杀掉来释放内存。

在容器环境里，还要看 cgroup 限制。宿主机还有空闲内存，不代表容器还能继续用；容器达到 `memory.max` 后，也可能先触发 cgroup 范围内的 OOM。

### mmap、COW 和共享内存有什么关系？

`mmap()` 会在进程虚拟地址空间里创建一段映射。它既可以映射文件，也可以创建匿名映射。映射建立时不一定马上读入数据，真正访问到某个页面时，才可能触发缺页异常。

多个进程映射同一个文件时，内核可以让它们共享 Page Cache 中的物理页。共享内存 IPC 也是类似思路：不同进程的虚拟地址映射到同一批物理页，进程之间读写数据不需要每次经过内核拷贝。

**COW（Copy-On-Write，写时复制）** 常见于 `fork()`。父子进程刚创建时可以共享同一批物理页，页表先标成只读；谁先写，谁触发缺页异常，内核再复制一份页面给写入方。

详细介绍：[操作系统内存管理详解：分页、分段、页面置换、Swap 与 OOM](./操作系统内存管理详解-分页、分段、页面置换、Swap 与 OOM.md)

### 分页机制和分段机制有哪些共同点和区别？

**共同点**：

- 都是非连续内存管理的方式。
- 都采用了地址映射的方法，将虚拟地址映射到物理地址，以实现对内存的管理和保护。

**区别**：

- **划分依据不同**：分页按固定大小切分地址空间和物理内存，页是内存管理的物理粒度；分段按程序的逻辑结构切分，比如代码段、数据段、堆、栈，段是更贴近程序语义的逻辑单位。
- **大小是否固定不同**：页大小固定，常见为 4 KB；段大小不固定，取决于程序中对应逻辑区域的大小。
- **碎片问题不同**：分段容易产生外部碎片，因为每个段需要连续空间；分页基本消除了外部碎片，但最后一页可能装不满，会产生少量内部碎片。
- **地址结构不同**：分页地址通常由页号和页内偏移组成，通过页表完成映射；分段地址由段号和段内偏移组成，通过段表完成映射。
- **工程使用不同**：现代通用操作系统主要依赖分页管理内存。以 x86 为例，硬件历史上支持分段和分页，但 Linux 基本把段基址设为 0，让分段“弱化”为权限和兼容机制，实际内存管理主要靠分页完成。

### 段页机制

结合了段式管理和页式管理的一种内存管理机制。程序视角中，内存被划分为多个逻辑段，每个逻辑段进一步被划分为固定大小的页。

在段页式机制下，地址翻译的过程分为两个步骤：

1. **段式地址映射（虚拟地址 -> 线性地址）**：
   - 虚拟地址 = 段选择符（段号）+段内偏移。
   - 根据段号查段表，找到段基址，加上段内偏移得到线性地址。
2. **页式地址映射（线性地址 -> 物理地址）**：
   - 线性地址 = 页号 + 页内偏移。
   - 根据页号查页表，找到物理页框号，加上页内偏移得到物理地址。

### 局部性原理

要想更好地理解虚拟内存技术，必须要知道计算机中著名的 **局部性原理（Locality Principle）**。另外，局部性原理既适用于程序结构，也适用于数据结构，是非常重要的一个概念。

局部性原理是指在程序执行过程中，数据和指令的访问存在一定的空间和时间上的局部性特点。其中，时间局部性是指一个数据项或指令在一段时间内被反复使用的特点，空间局部性是指一个数据项或指令在一段时间内与其相邻的数据项或指令被反复使用的特点。

在分页机制中，页表的作用是将虚拟地址转换为物理地址，从而完成内存访问。在这个过程中，局部性原理的作用体现在两个方面：

- **时间局部性**：由于程序中存在一定的循环或者重复操作，因此会反复访问同一个页或一些特定的页，这就体现了时间局部性的特点。为了利用时间局部性，分页机制中通常采用缓存机制来提高页面的命中率，即将最近访问过的一些页放入缓存中，如果下一次访问的页已经在缓存中，就不需要再次访问内存，而是直接从缓存中读取。
- **空间局部性**：由于程序中数据和指令的访问通常是具有一定的空间连续性的，因此当访问某个页时，往往会顺带访问其相邻的一些页。为了利用空间局部性，分页机制中通常采用预取技术来预先将相邻的一些页读入内存缓存中，以便在未来访问时能够直接使用，从而提高访问速度。

总之，局部性原理是计算机体系结构设计的重要原则之一，也是许多优化算法的基础。在分页机制中，利用时间局部性和空间局部性，采用缓存和预取技术，可以提高页面的命中率，从而提高内存访问效率。

### 虚拟内存是如何实现地址转换和进程隔离的？

面试里问虚拟内存，不要只背“隔离进程”。可以按这条线回答：**虚拟内存把进程看到的地址和真实物理地址隔开，再由 MMU、页表和 TLB 完成地址翻译**。

进程访问的是虚拟地址（VA），真正落到内存条上的是物理地址（PA）。每个进程都有自己的虚拟地址空间和页表，所以不同进程即使使用相同的虚拟地址，也可以映射到不同的物理页，从而实现进程隔离。

![虚拟地址到物理地址的映射过程：不同进程的相同虚拟地址通过 MMU 和页表映射到不同物理页](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/virtual-memory-virtual-physical-mapping.png)

不过，隔离不代表进程之间完全不能共享数据。操作系统可以有控制地让多个进程映射同一批物理页，例如动态库共享、`mmap` 文件映射、共享内存 IPC。区别在于：默认隔离由页表权限保证，共享则必须由内核显式建立映射并配合权限控制；如果是共享内存 IPC，还需要额外处理同步问题。

分页机制把虚拟地址空间和物理内存都切成固定大小的页，通过页表记录“虚拟页号 -> 物理页帧”的映射。这样基本消除了分段容易产生的外部碎片，也让物理内存可以离散分配；页表本身会占空间，所以现代系统会用多级页表按需创建下级页表。

TLB 可以理解为页表项缓存。CPU 先查 TLB，命中就直接拿到物理页帧号；未命中才去查多级页表，并把结果回填到 TLB。如果页表项显示页面不在内存，就会触发缺页异常，内核再判断访问是否合法，合法则分配页帧、必要时换出旧页、从文件或 Swap 调入页面，最后更新页表并重新执行那条指令。

页面置换算法可以抓住一句话：**换出去的页，最好是后面最晚再用到的页**。OPT 是理论最优但无法实现，LRU 接近 OPT 但实现成本高，CLOCK 用访问位近似 LRU，FIFO 简单但可能出现 Belady 异常。

详细介绍：[虚拟内存详解：地址转换、TLB、缺页异常与页面置换](./虚拟内存详解-地址转换、TLB、缺页异常与页面置换.md)

## I/O

### 一次阻塞 `read()` 经历了什么？

以 `read(fd, buf, count)` 为例，用户程序通常先调用 glibc 包装函数。包装函数按 ABI 准备系统调用号和参数，执行 `syscall` 等指令进入内核。内核检查文件描述符、用户缓冲区和访问权限，再进入 VFS、文件系统、Socket 或设备驱动对应的读取路径。

如果数据已经就绪，内核把数据复制到用户缓冲区并返回读取字节数；如果数据尚未就绪，阻塞 fd 会让当前线程进入等待状态，调度器可以运行其他可运行任务。磁盘 I/O 完成或网卡收到数据后，设备通过硬件中断通知内核，内核唤醒等待队列中的线程。该线程以后重新获得 CPU，才会继续完成 `read()` 并返回用户态。

这条路径可能同时出现系统调用、硬件中断和线程上下文切换，也可能只经历其中一部分。Page Cache 已经有数据时，`read()` 可以直接返回，不需要等待设备中断，也不需要切换到另一个线程。

详细介绍：[中断、异常与系统调用详解：从内核入口到缺页异常](./中断、异常与系统调用详解-从内核入口到缺页异常.md)。

### 什么是 I/O 多路复用？

I/O 多路复用解决的不是“单次读写更快”，而是**一个线程如何同时等待多个文件描述符（fd）的就绪事件**。

一次网络读取通常分成两个阶段：先等数据从网卡到达并进入内核缓冲区，再把数据从内核缓冲区拷贝到用户缓冲区。阻塞 I/O 的问题在第一阶段：一个线程调用 `recv` 后，如果这个连接没数据，线程就只能卡在那里等。

![网络读取中的两个阶段：先等待网卡数据进入内核缓冲区，再通过 copy_to_user 拷贝到用户缓冲区](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/io-multiplexing-io-two-phases.png)

I/O 多路复用把一批 fd 交给内核，让线程阻塞在 `select`、`poll` 或 `epoll` 这类系统调用上。只要其中任意 fd 就绪，调用就返回，应用再去处理对应的连接。这样一个线程就能管理成千上万个连接，特别适合大量连接空闲、少量连接活跃的场景，比如 Redis、Nginx、Netty 这类高性能网络程序。

需要注意：I/O 多路复用仍然属于**同步 I/O**。内核只是通知“可以读/可以写了”，真正的 `read`/`recv` 还得应用自己调用，数据从内核缓冲区拷到用户缓冲区这一步并没有被省掉。

详细介绍：[I/O 多路复用详解：select、poll、epoll 原理与区别](./IO 多路复用详解-select、poll、epoll 原理与区别.md)

### select、poll 和 epoll 有什么区别？

结论：`select` 和 `poll` 每次等待都要把完整监听集合交给内核，并在返回后线性扫描；`epoll` 把监听集合长期维护在内核里，`epoll_wait` 主要返回已经就绪的事件，更适合“连接很多但活跃连接较少”的场景。

`select` 使用固定大小的 `fd_set` 位图，Linux glibc 下通常受 `FD_SETSIZE` 限制，只能安全处理编号 0~1023 的 fd。每次调用前都要重新设置监听集合，返回后还要遍历位图找出哪些 fd 就绪。

`poll` 把位图换成了 `pollfd` 数组，绕开了 `FD_SETSIZE` 的限制，但本质上还是每次把完整数组传入内核，返回后遍历整个数组检查 `revents`。所以连接数量很大、活跃比例很低时，扫描成本仍然明显。

`epoll` 通过 `epoll_ctl` 维护监听集合，通过 `epoll_wait` 获取就绪事件。内核会维护 interest list 和 ready list，fd 就绪后进入 ready list，应用等待时只取这批就绪事件。它还支持 LT（水平触发）和 ET（边缘触发）：LT 只要缓冲区还有数据就会反复通知；ET 只在状态变化时通知一次，必须配合非阻塞 fd，并循环读到 `EAGAIN`。

![select、poll 和 epoll 对比：数据结构、fd 限制、每次等待传参、查找就绪 fd 的开销和触发模式](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/io-multiplexing-select-poll-epoll.png)

不过，epoll 不是所有场景都更快。如果连接数量很少，或者所有连接都很活跃，`epoll_ctl`、回调、就绪链表等维护成本也要算进去。它的主场是海量长连接、大部分时间空闲的服务端程序。

详细介绍：[I/O 多路复用详解：select、poll、epoll 原理与区别](./IO 多路复用详解-select、poll、epoll 原理与区别.md)

### 什么是零拷贝？

零拷贝不是完全没有拷贝，而是**尽量避免 CPU 在内核缓冲区和用户缓冲区之间搬运数据**，从而减少 CPU 拷贝和用户态/内核态切换。

以传统 `read + write` 文件发送为例，数据通常要经历 4 次拷贝：磁盘到内核缓冲区是 DMA 拷贝，内核缓冲区到用户缓冲区是 CPU 拷贝，用户缓冲区到 Socket 缓冲区还是 CPU 拷贝，Socket 缓冲区到网卡是 DMA 拷贝。这里最浪费的是中间两次 CPU 拷贝，因为应用并没有修改数据，只是让数据到用户空间绕了一圈。

![传统 read/write 的数据拷贝路径：磁盘到内核缓冲区、内核到用户缓冲区、用户到 Socket 缓冲区、Socket 到网卡](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/zero-copy-traditional-read-write.png)

零拷贝的思路就是让数据尽量留在内核路径里转发。比如 `sendfile` 可以把文件数据从 Page Cache 直接送到 Socket；如果网卡支持 SG-DMA，Socket 缓冲区里甚至可以只放描述信息，payload 由 DMA 从内核缓冲区直接送到网卡。

零拷贝很适合文件原样转发、大文件传输、消息队列日志发送这类场景。Kafka 消费端把日志段文件发送给消费者时，就很适合走 `FileChannel.transferTo` 这类 sendfile 路线。

详细介绍：[零拷贝详解：mmap、sendfile 与 splice](./零拷贝详解-mmap、sendfile 与 splice.md)

### mmap、sendfile 和 splice 有什么区别？

结论：**要改数据，用 mmap；只是文件到 Socket 原样转发，用 sendfile；更一般的 fd 之间转发，再考虑 splice**。

`mmap + write` 利用虚拟内存映射，把文件映射到进程地址空间。应用访问这段内存时，实际访问的是 Page Cache 对应的物理页，省掉了传统 `read` 中“内核缓冲区 -> 用户缓冲区”的那次 CPU 拷贝。不过后续 `write` 到 Socket 缓冲区通常还会有一次 CPU 拷贝。它适合需要在发送前读取、修改、解析数据的场景。

`sendfile` 更适合“文件 -> Socket”的原样发送。数据不进入用户态，系统调用次数也更少；在支持 SG-DMA 的网卡上，还能把 CPU payload 拷贝降到 0。静态文件服务器、Kafka 日志段发送这类场景很典型。

`splice` 借助 pipe 在内核中移动页引用，适合更一般的描述符之间转发，比如 socket 到 socket、文件到管道再到 socket。它的限制是路径里通常要有 pipe，而且文件到 socket 往往需要两次 `splice` 调用，代码复杂度和系统调用次数都要考虑。

![传统 read/write、mmap + write、sendfile + SG-DMA 和 splice 的拷贝次数与模式切换对比](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/zero-copy-four-ways-comparison.png)

零拷贝也有失效场景：TLS 加密、压缩、格式转换、内容过滤、水印处理等都需要应用真正处理 payload，数据就很难一直停留在内核路径里。小文件或随机访问下，映射、缺页、管道的固定成本也可能盖过收益。

详细介绍：[零拷贝详解：mmap、sendfile 与 splice](./零拷贝详解-mmap、sendfile 与 splice.md)

## 文件系统

### 文件系统主要做了什么？

文件系统负责把存储设备上的块组织成应用能理解的文件和目录。面试里可以从这 6 件事回答：

![文件系统职责概览](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/file-system-responsibilities.webp)

1. **命名**：用路径和文件名找到目标文件，例如 `/var/log/app.log`。
2. **组织**：用目录树管理文件和目录，让不同文件有清晰层次。
3. **定位**：把文件的第 N 个字节映射到底层数据块。
4. **空间管理**：分配、释放和复用磁盘块，记录哪些块空闲、哪些块已使用。
5. **权限保护**：记录所有者、权限、时间戳等元数据，并在访问时做检查。
6. **缓存和恢复**：用 Page Cache 提升读写性能，用日志机制减少崩溃后的文件系统结构损坏。

不是所有文件系统都对应本地磁盘。`tmpfs` 主要以内存作为后端，`procfs` 暴露内核运行状态，NFS 则把远端文件系统接入本地目录树。Linux 通过 VFS 给这些文件系统提供统一接口。

### 文件、目录、inode、dentry 有什么关系？

在 Linux/Unix 文件系统里，文件名通常不存放在 inode 中。

![文件名 dentry 和 inode 关系](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/file-inode-dentry-relation.webp)

- **目录项**：保存文件名到 inode 号的映射。
- **inode**：记录文件类型、权限、所有者、大小、时间戳、链接计数，以及数据块或 extent 的映射信息。
- **dentry**：VFS 在内存里维护的目录项缓存，用来加速路径查找。它通常指向 inode，也可能缓存“不存在”的查找结果，也就是 negative dentry。
- **数据块或 extent**：保存普通文件的实际内容。

这也解释了为什么同一个文件可以有多个名字：多个目录项可以指向同一个 inode。`mv a.txt b.txt` 如果发生在同一个文件系统内，很多时候只是修改目录项，文件内容本身不用移动。

可以用这些命令观察 inode 和元数据：

```bash
ls -li app.log
stat app.log
df -i
```

### open 一个文件时发生了什么？

`open()` 不会把整个文件读进内存，它主要做路径解析和打开对象创建。

![路径到文件描述符](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/file-path-to-fd.webp)

大致流程是：

1. 从根目录或当前目录开始解析路径，逐级查目录项和 dentry 缓存。
2. 找到目标 inode 后，检查权限、打开标志和文件类型。
3. 创建内核里的打开文件对象，记录当前文件偏移量、打开状态、读写标志等。
4. 在当前进程的文件描述符表里分配一个最小可用的非负整数，也就是 fd。

fd 是进程文件描述符表里的索引，不是 inode。`dup()`、`fork()` 之后，多个 fd 可能引用同一个打开文件对象，所以它们共享文件偏移量；两个进程分别 `open()` 同一个文件，通常会得到不同的打开文件对象，各自维护偏移量。

### 文件在磁盘上怎么存放？

文件系统会把一个分区或卷划分成很多块，再用元数据记录文件内容和块之间的关系。教材里常见三种分配方式：

![文件数据块定位方式](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/file-block-allocation.webp)

- **连续分配**：文件占用一段连续块，顺序读写和随机访问都快；缺点是文件增长麻烦，容易产生外部碎片。
- **链式分配**：每个块指向下一个块，不要求连续空间；缺点是随机访问差。
- **索引分配**：把数据块地址集中放在索引块中，随机访问更方便；缺点是需要额外索引空间。

经典 ext2/ext3 使用直接块指针、一级间接、二级间接和三级间接块定位文件数据。ext4 通常使用 extent tree，一个 extent 记录一段连续物理块的逻辑起点、物理起点和长度；对连续大文件来说，它比“每个块记录一个地址”更省元数据。

### 硬链接和软链接有什么区别？

硬链接和软链接都能让一个路径关联到另一个文件，但它们指向的对象不同。

![硬链接和软链接对比](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/file-hardlink-symlink.webp)

| 对比项           | 硬链接                                               | 软链接                               |
| ---------------- | ---------------------------------------------------- | ------------------------------------ |
| 指向对象         | 同一个 inode                                         | 另一个路径                           |
| 是否创建新 inode | 不创建新的目标文件 inode，只新增目录项并增加链接计数 | 软链接本身是独立文件，有自己的 inode |
| 删除源文件后     | 只要还有硬链接，数据还在                             | 软链接可能变成悬空链接               |
| 是否能跨文件系统 | 不能                                                 | 可以                                 |
| 是否能链接目录   | Linux 不允许普通用户对目录创建硬链接                 | 可以                                 |

可以用这几个命令做个小实验：

```bash
echo hello > a.txt
ln a.txt hard.txt
ln -s a.txt soft.txt

ls -li a.txt hard.txt soft.txt
```

`a.txt` 和 `hard.txt` 的 inode 号相同，`soft.txt` 的 inode 号不同。删除 `a.txt` 后，`hard.txt` 还能读到内容，`soft.txt` 会指向一个不存在的路径。

### 硬链接为什么不能跨文件系统？

硬链接指向的是 inode，而 inode 号只在当前文件系统内有意义。每个文件系统都有自己的 inode 表，另一个文件系统里的同一个 inode 号不代表同一个文件。

软链接保存的是路径字符串，解析时按路径重新查找目标文件，所以可以跨文件系统。

### write 成功后数据一定落盘了吗？

不一定。对于普通 buffered I/O，`write()` 成功通常只表示数据已经被内核接收，常见情况是进入 Page Cache 并被标记为脏页，不代表数据已经持久化到底层设备。

![文件写入到持久化路径](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/file-write-persistence.webp)

如果应用需要更强持久性，要调用：

- `fsync()`：同步文件数据和关联元数据。
- `fdatasync()`：同步文件数据，以及后续读取数据所必需的元数据，例如文件大小。
- 带同步语义的打开标志，例如 `O_SYNC`、`O_DSYNC`。

还要注意两个细节：

1. `write()` 可能只写入部分字节，调用方要处理 partial write。
2. 创建新文件、`rename()` 或 `unlink()` 后，如果要求掉电后目录项也可靠持久化，通常还需要对父目录 fd 调用 `fsync()`。

### 日志文件系统解决了什么问题？

文件系统一次操作常常要改多处元数据。比如创建文件时，要分配 inode、分配数据块、更新目录项、更新位图。机器在中途断电，文件系统可能停在不一致状态。

日志文件系统会先把即将进行的元数据变更写入日志区域，再更新正式位置。系统恢复时扫描日志，已经完整提交但还没写回正式位置的事务可以重放，没有完整提交的事务会被丢弃。

以 ext4 为例，常见数据模式有三种：

| 模式             | 说明                                                   |
| ---------------- | ------------------------------------------------------ |
| `data=writeback` | 只保证元数据日志，不保证相关数据块先于元数据写入       |
| `data=ordered`   | 默认模式，元数据进日志前，相关数据块会先写到主文件系统 |
| `data=journal`   | 数据和元数据都先写日志，再写最终位置，写放大更明显     |

日志文件系统主要保证文件系统结构一致性，不等于帮应用保证所有业务数据都不丢。事务级持久性仍然要靠应用正确使用 `fsync()`、写入顺序和恢复逻辑。

### 提高文件系统性能的方式有哪些？

可以从访问模式、缓存、元数据和硬件几方面答：

- **尽量顺序读写**：顺序 I/O 更容易被预读、合并写和 extent 这类连续空间映射利用。
- **利用 Page Cache**：普通文件读写会经过 Page Cache，命中时可以少访问磁盘；但缓存不是越大越好，还要看内存压力和回写压力。
- **减少小文件和元数据操作**：大量小文件会放大 inode、目录项、权限检查、创建删除等元数据成本。
- **控制刷盘频率**：频繁 `fsync()` 会降低吞吐，但完全不刷盘又会扩大掉电丢数据窗口，需要按业务持久性要求取舍。
- **选择合适的文件系统和挂载参数**：ext4、XFS、Btrfs 等实现不同，日志模式、atime、barrier 等参数也会影响性能和可靠性。
- **使用更合适的硬件**：SSD、NVMe、RAID、磁盘缓存策略都会影响读写延迟和吞吐。

排查时常看这些命令：

```bash
df -h
df -i
lsof +L1
iostat -x 1
```

`df` 很满但 `du` 找不到大文件时，优先查被删除但仍被进程打开的文件；小文件特别多时，`df -i` 可能比 `df -h` 更早暴露问题。

详细介绍：[操作系统文件系统详解：inode、VFS、Page Cache 与日志机制](./操作系统文件系统详解-inode、VFS、Page Cache 与日志机制.md)

### 常见的磁盘调度算法有哪些？

下面介绍的 SCAN、SSTF、LOOK 等算法主要面向机械硬盘。机械硬盘的一次读写由寻道时间、旋转延迟和传输时间组成，调度器可以调整请求顺序，减少磁头移动和等待时间。

常见的磁盘调度算法有下面这 6 种（其他还有很多磁盘调度算法都是基于这些算法改进得来的）：

![常见的磁盘调度算法](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/disk-scheduling-algorithms.png)

1. **先来先服务算法（First-Come First-Served，FCFS）**：按照请求到达磁盘调度器的顺序处理，实现简单，但没有考虑磁头移动的路径和方向，平均寻道时间可能较长。它不会把某个请求无限期跳过，因此通常没有算法意义上的饥饿问题，不过排在长请求后面的请求可能等待较久。
2. **最短寻道时间优先算法（Shortest Seek Time First，SSTF）**：也被称为最佳服务优先（Shortest Service Time First，SSTF）算法，优先选择距离当前磁头位置最近的请求进行服务。SSTF 算法能够最小化磁头的寻道时间，但容易出现饥饿问题，即磁头附近的请求不断被服务，远离磁头的请求长时间得不到响应。实际应用中，需要优化一下该算法的实现，避免出现饥饿问题。
3. **扫描算法（SCAN）**：也被称为电梯（Elevator）算法，基本思想和电梯非常类似。磁头沿着一个方向扫描磁盘，如果经过的磁道有请求就处理，直到到达磁盘的边界，然后改变移动方向，依此往复。SCAN 算法能够保证所有的请求得到服务，解决了饥饿问题。但是，如果磁头从一个方向刚扫描完，请求才到的话，这个请求就需要等到磁头从相反方向过来之后才能得到处理。
4. **循环扫描算法（Circular Scan，C-SCAN）**：SCAN 算法的变体，只在磁盘的一侧进行扫描，并且只按照一个方向扫描，直到到达磁盘边界，然后回到磁盘起点，重新开始循环。
5. **边扫描边观察算法（LOOK）**：SCAN 算法中磁头到了磁盘的边界才改变移动方向，这样可能会做很多无用功，因为磁头移动方向上可能已经没有请求需要处理了。LOOK 算法对 SCAN 算法进行了改进，如果磁头移动方向上已经没有别的请求，就可以立即改变磁头移动方向，依此往复。也就是边扫描边观察指定方向上还有无请求，因此叫 LOOK。
6. **均衡循环扫描算法（C-LOOK）**：C-SCAN 只有到达磁盘边界时才能改变磁头移动方向，并且磁头返回时也需要返回到磁盘起点，这样可能会做很多无用功。C-LOOK 算法对 C-SCAN 算法进行了改进，如果磁头移动的方向上已经没有磁道访问请求了，就可以立即让磁头返回，并且磁头只需要返回到有磁道访问请求的位置即可。

举个简单例子：假设磁头当前在 50 号磁道，请求序列是 82、170、43、140、24。FCFS 会按请求到达顺序处理，磁头移动路径可能很长；SSTF 会先找离 50 最近的 43，再逐步选择最近请求，平均寻道距离通常更短，但远处请求可能一直被推迟；SCAN/LOOK 则会固定一个扫描方向，沿途处理请求，更像电梯上下运行，公平性更好。

SSD 和 NVMe 设备没有机械寻道，不能直接套用上面的磁头调度模型。不过，现代 Linux 块层仍可能合并、排序请求，并通过 blk-mq 和 I/O 调度器处理吞吐、公平性和延迟目标；具体策略取决于设备、内核版本和所选调度器。

## 参考

- 《计算机操作系统—汤小丹》第四版
- 《深入理解计算机系统》
- 《重学操作系统》
- 《现代操作系统原理与实现》
- 王道考研操作系统知识点整理：<https://wizardforcel.gitbooks.io/wangdaokaoyan-os/content/13.html>
- 内存管理之伙伴系统与 SLAB：<https://blog.csdn.net/qq_44272681/article/details/124199068>
- 为什么 Linux 需要虚拟内存：<https://draveness.me/whys-the-design-os-virtual-memory/>
- 程序员的自我修养（七）：内存缺页错误：<https://liam.page/2017/09/01/page-fault/>
- 虚拟内存的那点事儿：<https://juejin.cn/post/6844903507594575886>

<!-- @include: @article-footer.snippet.md -->


---

<!-- source: 操作系统/操作系统内存管理详解-分页、分段、页面置换、Swap 与 OOM.md -->

---
title: 操作系统内存管理详解：分页、分段、页面置换、Swap 与 OOM
description: 操作系统内存管理高频面试题总结，从 VSZ/RSS/PSS、连续分配与内存碎片讲起，讲清伙伴系统、分页分段、页表、TLB、缺页异常、页面置换、Swap、Overcommit、OOM、mmap、COW 和大页。
category: 计算机基础
tag:
  - 操作系统
  - 内存管理
head:
  - - meta
    - name: keywords
      content: 操作系统内存管理,内存管理,内存管理面试题,Linux内存管理,虚拟内存,分页,分段,页表,TLB,缺页异常,页面置换,Swap,伙伴系统,Overcommit,OOM,mmap,COW,大页,操作系统面试题
---

打开一个普通进程的内存信息，你会看到很多看起来反直觉的数字：进程有自己的虚拟地址空间，地址范围可能很大；真正占用的物理内存又是另一回事；同一个动态库还可能被多个进程共享。

程序写代码时只是在访问地址，操作系统看到的却是一堆更具体的问题：这块内存给谁？能不能让别的进程碰？物理内存不够时换谁出去？释放之后留下的空洞还能不能继续用？

这就是内存管理要处理的事。小 G 建议不要一上来就背分页、分段、TLB 这些名词，先抓住一条线：**操作系统把程序看到的地址和真实物理内存隔开，再用分配、映射、保护和回收把内存管起来。**

## VSZ、RSS 和 PSS 分别代表什么？

Linux 里最容易看错的是进程内存数字。`ps` 里的 VSZ、`/proc/<pid>/status` 里的 `VmSize`，表示进程已经映射的虚拟地址空间大小。它可能包含尚未真正驻留的匿名映射、文件映射、共享库和预留地址，不能直接当成物理内存占用。

RSS 表示当前驻留在 RAM 中、并映射给该进程的页面总量。共享库、共享内存、Page Cache 中的共享页也会算进每个相关进程的 RSS，所以把多个进程 RSS 直接相加容易重复计算。

PSS 更适合估算进程的实际分摊占用。一个物理页如果被 4 个进程共享，每个进程的 PSS 只算四分之一。需要看汇总时可以用：

```bash
grep -E 'VmSize|VmRSS|RssAnon|RssFile|RssShmem|VmSwap' /proc/<pid>/status
cat /proc/<pid>/smaps_rollup
```

`smaps_rollup` 会给出进程级汇总；要分析每段映射，再看 `/proc/<pid>/smaps`。不过完整 `smaps` 会遍历进程的 VMA 和页表，线上高频采集要谨慎。

## 内存管理主要负责什么？

从操作系统视角看，内存管理至少要做 5 件事。

![内存管理职责概览](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/memory-management-responsibilities.webp)

**第一，分配和回收内存。** 用户态的 `malloc()`/`free()` 负责管理进程堆里的内存块。以 glibc 为例，分配器必要时会通过 `brk()`、`mmap()` 等接口扩展可用虚拟地址区域；虚拟区域建好后，物理页通常还要等首次访问时通过缺页路径建立。内核内部则通过页分配器和 SLAB/SLUB 这类对象分配器管理物理页与内核对象。

**第二，完成地址转换。** 程序访问的是虚拟地址，真正落到内存条上的是物理地址。CPU 里的 MMU 会配合页表、TLB，把虚拟地址翻译成物理地址。

**第三，做进程隔离和权限控制。** 每个进程都有自己的地址空间。A 进程里的 `0x1000` 和 B 进程里的 `0x1000` 可以映射到完全不同的物理页；页表项还能标记可读、可写、可执行，越权访问会触发异常。

**第四，在物理内存紧张时回收页面。** 干净的文件页可以直接丢弃，需要时再从文件读取；脏文件页通常要先回写；匿名页如果要回收，通常需要写入 Swap。Linux 会结合页面冷热、refault、内存水位、cgroup 和 `swappiness` 等因素选择回收对象，不是固定先回收某一种页面。

**第五，支持共享和映射。** 动态库共享、共享内存 IPC、`mmap()` 文件映射、写时复制（COW），都依赖“多个虚拟地址映射到同一批物理页”这个能力。

## 没有内存抽象会怎样？

早期或很小的系统里，程序可以直接访问物理地址。单个程序运行时，这种方式还能凑合；一旦多个程序同时运行，问题马上出现。

假设程序 A 往物理地址 1000 写数据，程序 B 也把自己的变量放在物理地址 1000。两个程序互相不知道对方存在，最后谁后写，谁就覆盖前者。更糟的是，普通用户程序也可能写到操作系统自己的内存，系统稳定性没法保证。

解决办法是引入**地址空间（Address Space）**。每个进程看到一套自己的地址，里面通常有代码段、数据段、堆、栈、内存映射区等。进程只和虚拟地址打交道，真实物理页由操作系统和硬件共同决定。

这样一来，进程隔离、按需加载、共享内存、COW 才有落脚点。

## 连续内存分配和碎片问题

最容易理解的内存分配方式是连续分配：一个进程需要多少内存，操作系统就找一整块连续物理内存给它。早期系统常用固定分区或动态分区管理。

连续分配的问题是碎片。

![连续内存分配与碎片](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/memory-fragmentation.webp)

**内部碎片**指已经分配出去、但实际没用上的空间。比如系统按 128 字节为单位分配，一个对象只需要 65 字节，剩下 63 字节就浪费在这个分配单元内部。

**外部碎片**指空闲空间总量够，但不连续，没法满足新的大块连续分配。比如内存里有两块空闲区，每块 128 MB，总共 256 MB；现在要申请一块连续 200 MB 空间，仍然失败。

动态分区常见的分配策略有首次适应、最佳适应、最坏适应等。它们能改变碎片出现的位置和速度，但不能从根上消除外部碎片。内存紧凑会迁移可移动页面，把分散的空闲页聚合成更大的连续物理区域。它不等同于 Swap I/O，但同步紧凑可能占用 CPU、迁移大量页面并造成延迟尖峰。

## Linux 的伙伴系统解决了什么？

Linux 管理物理页时使用**伙伴系统（Buddy System）**。它把空闲内存按 2 的幂次组织，比如 4 KB、8 KB、16 KB、32 KB……申请内存时，先找能满足请求的最小块；如果找到的块太大，就不断一分为二；释放时，如果相邻伙伴块也空闲，就合并成更大的块。

这个设计的好处是分裂和合并规则很简单，能较快找到连续物理页，也能减少外部碎片。

不过它也会浪费一些空间：伙伴系统的分配单位是 `2^order` 个连续物理页。以 4 KB 基础页为例，如果内核调用方需要至少 65 KB 的连续物理内存，就可能申请 32 页，也就是 128 KB 的 order-5 块，从而产生内部浪费。这个例子描述的是内核连续物理页申请，不代表用户调用 `malloc(65KB)` 就一定直接占用一块 128 KB 的 buddy block。

另外，伙伴系统主要按页管理物理内存。内核里还有大量比页小的对象，例如文件对象、inode、网络缓冲结构。如果每次都按页申请，会浪费太多。Linux 会在伙伴系统之上使用 SLAB/SLUB 这类分配器，按对象大小缓存和复用内存块，减少频繁分配、初始化和释放的成本。

## 分段、分页和段页式有什么区别？

地址空间不一定只能按一种方式拆。操作系统教材里常见三种：分段、分页、段页式。

| 方式   | 划分依据                               | 地址结构                   | 优点                                               | 主要问题                           |
| ------ | -------------------------------------- | -------------------------- | -------------------------------------------------- | ---------------------------------- |
| 分段   | 按程序逻辑划分，如代码段、数据段、栈段 | 段号 + 段内偏移            | 贴近程序结构，便于共享和保护                       | 段长不固定，容易产生外部碎片       |
| 分页   | 固定大小切分虚拟地址和物理内存         | 页号 + 页内偏移            | 物理内存可离散分配，减少进程连续分配导致的外部碎片 | 页表占空间，最后一页可能有内部碎片 |
| 段页式 | 先按逻辑分段，再把段切成页             | 段号 + 段内页号 + 页内偏移 | 兼顾逻辑保护和离散分配                             | 地址转换更复杂                     |

现代通用操作系统主要依赖分页管理内存。以 x86 为例，硬件历史上支持分段和分页；在 x86-64 长模式下，Linux 的普通用户地址空间主要依赖分页，传统代码段和数据段基本采用平坦模型。不过 FS/GS 仍然有实际用途，例如 FS 常用于用户态线程本地存储（TLS）。

还要补一个容易被教材简化掉的点：分页减少的是进程地址空间连续分配带来的外部碎片，并没有让物理内存自身的碎片问题消失。DMA、大页和部分内核申请仍可能需要连续物理页，所以空闲内存总量够，高阶连续页申请也可能失败，内核还需要伙伴合并和内存紧凑。

## 分页是怎么完成地址转换的？

分页把虚拟地址空间切成固定大小的虚拟页，把物理内存切成同样大小的页帧。常见 Linux x86-64 系统一页通常是 4 KB，但具体页大小和架构有关。

一个虚拟地址可以拆成两部分：

- **虚拟页号**：用来查页表，找到对应物理页帧。
- **页内偏移**：页内的具体位置。

地址转换大致是：CPU 发出虚拟地址，MMU 取出虚拟页号查页表，得到物理页帧号，再拼上页内偏移，得到物理地址。

![虚拟地址到物理地址转换](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/memory-address-translation.webp)

页表项不只保存物理页帧号，还会保存很多状态位，例如 present 位、读写权限、用户/内核权限、脏位、访问位等。present 位表示页面是否已经在物理内存里；权限位用于保护；访问位和脏位会参与页面回收判断。

## 为什么需要多级页表？

单级页表很好理解，但空间开销太大。

以 32 位地址空间、4 KB 页大小为例，一个进程有 4 GB 虚拟地址空间，需要 `4 GB / 4 KB = 2^20` 个页表项。如果每个页表项 4 字节，单个进程的页表就要约 4 MB。进程多起来后，这部分内存不能忽略。

更麻烦的是，大多数进程不会用满整个虚拟地址空间。单级页表却要为整片空间准备页表项，大量条目都是空的。

多级页表的做法是分层：顶层页表覆盖整片虚拟地址空间，下级页表按需创建。某段虚拟地址根本没用到，就不创建对应下级页表。Linux 的架构无关页表代码按照 5 层层级编写；如果具体架构或机器没有使用全部层级，多余层会被折叠。

![多级页表按需创建](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/memory-multilevel-page-table.webp)

在 x86-64 上，传统配置通常使用 4 级分页；CPU、内核和配置支持 LA57 后才会使用 5 级分页。Linux 文档说明，5 级分页可启用 56 位用户态虚拟地址空间，但为了兼容部分会使用指针高位的程序，内核默认不会主动在 47 位以上分配虚拟地址，除非应用通过高位 hint 地址显式请求。

## TLB 为什么重要？

多级页表省了空间，却让地址转换多走了几次内存访问。每次访问数据前都完整查多级页表，成本太高。

TLB（Translation Lookaside Buffer，快表）就是页表项缓存，通常在 MMU 里。CPU 访问内存时先查 TLB：

- 命中：直接得到物理页帧号。
- 未命中：再去走多级页表，查到后把结果放回 TLB。

程序访问内存有局部性：刚访问过的页，接下来大概率还会访问；访问某个地址，附近地址也可能很快被访问。TLB 正是吃这份局部性红利。

这也是大页有价值的原因之一。普通 4 KB 页下，一个 TLB 项只能覆盖 4 KB；如果使用 2 MB 大页，一个 TLB 项能覆盖更大的地址范围，TLB miss 可能减少。不过大页也会带来更大的分配和回收成本，数据库、JVM 这类程序是否启用 THP 或 HugeTLB，要按延迟和吞吐目标验证。

## 缺页异常（Page Fault）是怎么回事？

虚拟内存不是进程一启动就把所有页面装进物理内存。很多页面只有第一次访问时才真正加载，这叫按需调页。

Page Fault 是当前指令同步触发的处理器异常，不是外部设备异步产生的硬件中断。

当进程访问某个虚拟页，MMU 找不到有效翻译，就会触发缺页异常并进入内核处理。内核先判断访问是否落在合法 VMA 中，以及访问权限是否允许。非法地址或权限违规通常会转化为 `SIGSEGV`；合法缺页则根据映射类型处理：可能映射已有 Page Cache 页面、建立匿名零页、执行 COW、分配新页，或者从文件和 Swap 读取数据。处理完成后更新页表，再重新执行刚才那条指令。

Linux 的 `getrusage(2)` 把缺页统计分成两类：

- **次缺页（minor fault）**：处理时不需要实际 I/O。例如页面已经在内存里，只是当前进程还没建立映射；COW 触发复制也常见于这类路径。
- **主缺页（major fault）**：处理时需要 I/O，例如要从磁盘文件或 Swap 读入页面。

主缺页比次缺页慢得多。线上排查内存问题时，`majflt` 增长很快通常比 `minflt` 更值得警惕。

## 页面置换：内存不够时换谁出去？

物理内存满了，还要装入新页，就必须先回收一批页。页面置换要解决的问题很直接：内存不够时，先把哪一页换出去，才能尽量少影响后面的访问。

![页面置换算法对比](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/memory-page-replacement.webp)

最理想的是 OPT：直接换出未来最长时间不会再访问的页。它只能当理论上限，因为操作系统没法预知未来。FIFO 更容易实现，谁先进内存谁先出去，但它不关心页面是否还热，甚至会出现 Belady 异常：分配更多页框，缺页次数反而可能增加。

LRU 的直觉更接近真实程序：最近一直没访问的页，以后大概率也没那么快用到。问题在实现成本，精确维护每个页的访问顺序太贵。CLOCK 就是在这个背景下出现的折中方案，它用访问位和环形队列给页面一次“第二次机会”，用较低成本近似 LRU。LFU 走的是另一条路，按访问频率淘汰，但如果没有衰减机制，早期热点页可能长期占着位置，后面已经不用了也不容易被踢出去。

真实 Linux 不会照搬某个教科书算法。经典回收路径会使用文件页/匿名页、活跃/非活跃 LRU、workingset 和 refault 等机制近似识别冷热页面；较新的内核还可能启用 Multi-Gen LRU，用多个访问代际表示页面新旧程度。文件页、匿名页、cgroup、NUMA、内存水位都会影响回收路径，具体算法还取决于内核版本和配置。

![Linux 页面回收思路](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/memory-page-reclaim.webp)

因此，把 Linux 页面回收简单说成某一个算法并不准确。它更像一组围绕工作集保护、冷热识别和内存水位控制组合起来的策略。

## Swap、工作集和抖动

Swap 不是“多出来的内存”，更像一块低速后备区域。匿名页没有文件来源，内存紧张时如果要回收它，就可能写入 Swap；以后再访问，再从 Swap 读回。

一个进程真正活跃使用的页面集合叫工作集。只要物理内存能容纳系统里主要进程的工作集，缺页就比较可控；如果容纳不下，页面会被频繁换出又换入，系统进入抖动状态。

抖动时，CPU 看起来不一定忙在业务计算上，磁盘 I/O、主缺页、内存回收会变得很明显。排查时可以看这些指标：

```bash
# 系统整体
free -h
vmstat 1
cat /proc/meminfo
cat /proc/pressure/memory
grep -E 'pgfault|pgmajfault|pswpin|pswpout|pgscan|pgsteal' /proc/vmstat

# 单个进程
grep -E 'VmSize|VmRSS|RssAnon|RssFile|RssShmem|VmSwap' /proc/<pid>/status
cat /proc/<pid>/smaps_rollup
pmap -x <pid>
perf stat -e page-faults,major-faults <command>

# 容器 / cgroup v2
cat /sys/fs/cgroup/memory.current
cat /sys/fs/cgroup/memory.max
cat /sys/fs/cgroup/memory.events
cat /sys/fs/cgroup/memory.pressure
```

读这些指标时，可以按来源拆开看：进程侧看 RSS/PSS 和 `smaps_rollup`，确认常驻内存落在匿名页、文件页还是共享内存；缺页侧看 `pgmajfault` 和 `major-faults`，确认慢在 I/O 还是只是在建映射；系统侧看 Swap、回收扫描和 PSI，确认内存压力有没有传到业务延迟上。

排查时不要只看 `free`。Linux 会尽量把空闲内存用于 Page Cache，低 `MemFree` 不一定表示压力很大；更应结合 `MemAvailable`、Swap 活跃度、主缺页、回收扫描和 PSI 判断。PSI 里的 `some` 表示至少有任务因内存压力停顿，`full` 表示所有非 idle 任务都同时因该资源停顿，通常更能反映内存压力对业务延迟的影响。

## Overcommit 和 OOM：申请成功不等于物理内存已经准备好

Linux 可以允许进程承诺的虚拟内存超过当前 RAM 和 Swap，这叫内存 overcommit。它适合那些会申请很大地址空间、但只实际使用其中一部分的程序。

`vm.overcommit_memory` 常见有 3 种模式：

- `0`：启发式判断，拒绝明显不合理的申请。
- `1`：尽量允许申请，直到真正耗尽资源。
- `2`：使用更严格的 commit 限制。

因此，`malloc()` 或 `mmap()` 成功，通常只表示地址空间和 commit 检查通过，不代表对应物理页已经全部驻留。当页面实际被访问，内核又无法通过回收、写回或 Swap 获得足够内存时，可能触发 OOM Killer，选择进程终止以释放资源。

在容器里，还可能先触发 cgroup 范围内的 OOM。宿主机整体仍有可用内存，某个容器也可能因为 `memory.max` 达到上限而被限制；cgroup v2 的 `memory.events` 会记录 `high`、`max`、`oom`、`oom_kill` 等事件。

## mmap、COW 和共享内存

`mmap()` 会在进程虚拟地址空间里创建一段映射。它可以映射文件，也可以创建匿名映射。映射建立时不一定马上读入数据，真正访问到某个还没驻留的页时，才可能触发缺页。

文件映射适合随机访问、共享文件页，以及希望直接按内存地址访问文件内容的场景。它可以减少显式的用户态缓冲区拷贝和系统调用，但不保证一定比 `read()`/`write()` 更快；实际效果还取决于访问模式、缺页成本、预读、写回、异常处理和文件大小。

多个进程映射同一个文件时，内核可以让它们共享 Page Cache 中的物理页。`MAP_SHARED` 的修改可以对其他映射可见，并可写回底层文件；`MAP_PRIVATE` 创建的是私有 COW 映射，写入不会传播给其他进程，也不会写回原文件。共享内存 IPC 也是类似思路：不同进程的虚拟地址映射到同一批物理页，读写数据不需要每次经过内核拷贝。

COW（Copy-On-Write，写时复制）也很常见。`fork()` 后父子进程最开始可以共享同一批物理页，页表标成只读；谁先写，谁触发缺页，内核再复制一份页面给写入方。这样避免了 `fork()` 时立刻复制整个地址空间。

不过，COW 不是免费午餐。Redis 做 RDB 快照时会 `fork()` 子进程，父进程继续处理写请求；写请求越多，被复制的页越多，内存压力也越大。理解这点，才能看懂很多数据库、缓存系统里的 fork、mmap、Page Cache 和内存峰值问题。

## 内存管理和 Java 后端有什么关系？

操作系统内存管理并不只停在教材里。Java 后端平时会遇到很多相关现象。

**JVM 堆是虚拟地址空间的一部分。** `-Xmx` 限的是 Java 堆最大值，但进程 RSS 还会包含元空间、线程栈、JIT 代码缓存、DirectBuffer、本地库、mmap 文件映射等。看到 RSS 大于 `-Xmx`，不能直接判断是堆泄漏。

**线程栈也要占地址空间和物理页。** 平台线程很多时，线程栈、调度开销、TLB 和缓存失效都会变重。虚拟线程能降低大量阻塞任务对平台线程的依赖，但 CPU 密集型任务仍然受核心数限制。

**DirectBuffer 和 mmap 不在 Java 堆里。** 它们由 JVM 或本地代码管理，最终还是落到进程地址空间和物理页上。排查时不能只看 GC 日志，也要结合 NMT、`pmap`、`smaps_rollup`、cgroup 指标一起看。

HotSpot NMT 默认关闭，需要在 JVM 启动时加参数：

```bash
-XX:NativeMemoryTracking=summary
# 或
-XX:NativeMemoryTracking=detail

jcmd <pid> VM.native_memory summary
```

NMT 能按 JVM 子系统统计原生内存，例如 Java Heap、Class、Code、Thread 等；但它不是操作系统级的完整进程内存账本，也不能覆盖所有第三方 native library 分配。RSS/PSS、`smaps_rollup` 和容器内存限制仍然要一起看。

**大页不一定总是收益。** 大页能降低 TLB 压力，但 THP 的直接回收、内存紧凑、大页清零和 COW 都可能带来延迟波动。Redis 官方就明确提醒：RDB/AOF 后台任务依赖 `fork()` 和 COW，写密集时额外内存可能接近平时用量的一倍；THP 还可能放大 `fork()` 后的 COW 成本。JVM、数据库和缓存系统不能共用一套固定结论，应按产品文档和实际负载压测。

## 面试里怎么回答？

如果被问“操作系统内存管理做什么”，别从分页、分段这些名词开始背。先讲主线：

操作系统先给每个进程一套独立的虚拟地址空间，再通过页表、TLB 和 MMU 把虚拟地址翻译成物理地址。页表不只做地址翻译，还会记录权限、是否在内存、是否被修改、是否被访问过。等物理内存紧张时，内核再根据页面冷热、页面类型和系统水位回收文件页或匿名页，必要时才动用 Swap。

追问分页和分段时，把差别落到“怎么切地址空间”上。分页按固定大小切，物理内存可以离散分配，基本消除了外部碎片；分段按代码、数据、栈这类逻辑区域切，表达程序结构更直观，但段长不固定，容易留下外部碎片。现代通用系统主要靠分页，分段更多用于理解历史设计和逻辑保护。

缺页异常可以按处理过程讲：CPU 访问某个虚拟地址，页表项不存在、页面不在内存，或者权限不匹配，就会触发 page fault。内核先判断这次访问是否合法；非法访问通常变成 `SIGSEGV`，合法访问才会按映射类型建立页面，例如映射已有 Page Cache 页面、分配匿名页、处理 COW，或者从文件和 Swap 调页。`minor fault` 通常不需要 I/O，`major fault` 需要 I/O。

真要聊到线上排查，再补这个限制：教科书算法适合理解思路，但 Linux 的内存回收、THP、NUMA、cgroup 内存限制、内存压缩和数据库自己的缓存管理都会叠在一起。定位问题时，用一个“LRU”解释所有现象，通常不够。


---

<!-- source: 操作系统/操作系统锁与同步机制详解-mutex、semaphore、condition variable、spinlock 与 futex.md -->

---
title: 操作系统锁与同步机制详解：mutex、semaphore、condition variable、spinlock 与 futex
description: 操作系统锁与同步机制高频面试题总结，讲清临界区、mutex、spinlock、semaphore、condition variable、futex、原子指令、内存顺序、优先级反转，以及用户态锁和 Linux 内核锁的区别。
category: 计算机基础
tag:
  - 操作系统
  - Linux
  - 并发编程
head:
  - - meta
    - name: keywords
      content: 操作系统锁,同步机制,临界区,互斥锁,mutex,自旋锁,spinlock,信号量,semaphore,条件变量,condition variable,futex,原子指令,内存屏障,优先级反转,Linux内核锁,操作系统面试题,并发编程
---

两个线程同时给同一个计数器加 1，看起来很小的一件事，最后结果却可能少加一次。

原因其实很简单。`count++` 在源码里是一行，机器执行时通常要经历读取、计算、写回几个步骤。线程 A 刚读到旧值，还没写回；线程 B 也读到了同一个旧值。两边各自算出新值，最后写回的却是同一个结果。

为了避免这类并发问题，操作系统提供了锁和一系列同步机制。它们要解决的问题不只是一段代码能不能同时执行，还包括线程该不该阻塞、资源数量怎么控制、条件不满足时怎么等待。到了内核里，还要继续考虑中断、抢占、多 CPU、实时性和调度延迟。

这篇文章只讲操作系统视角下的同步机制。Java 里的 `synchronized`、`ReentrantLock`、AQS、CAS 和锁优化已经在 [Java 锁详解](../../java/并发/Java 锁详解-互斥锁、读写锁、自旋锁与 synchronized 锁优化.md) 里展开过，这里不会重复那套内容。本文重点看 mutex、semaphore、condition variable、spinlock、futex 这些概念各自解决什么问题。等理解了这些同步原语，再去看 [死锁详解](./死锁详解-四个必要条件、Java 死锁排查与数据库死锁处理.md)，就更容易看懂“等待关系为什么会绕成环”。

先通过一张表大致看一下这些同步机制分别解决什么问题：

| 机制               | 主要解决什么             | 等待方式                          | 常见场景                           |
| ------------------ | ------------------------ | --------------------------------- | ---------------------------------- |
| mutex              | 临界区互斥               | 语义上等待锁可用，实现可自旋/阻塞 | 保护共享结构                       |
| spinlock           | 极短临界区互斥           | 忙等                              | 内核中不能睡眠的路径               |
| semaphore          | 资源计数、并发数量控制   | 计数为 0 时等待                   | 缓冲区槽位、连接数、并发任务数     |
| condition variable | 等某个共享状态变为真     | 原子释放 mutex 并等待             | 队列非空、任务完成、缓冲区非满     |
| futex              | 用户态锁的阻塞/唤醒底座  | 用户态快路径，内核慢路径          | pthread mutex、运行时同步器        |
| memory barrier     | 约束内存访问顺序和可见性 | 通常不负责阻塞                    | 无锁结构、内核同步、设备寄存器访问 |

## 临界区到底在保护什么？

**临界区（critical section）** 指的是访问共享可变状态、并且不能被多个执行流随意交错执行的代码段。它可能是用户程序里的一段计数器更新，也可能是内核里修改调度队列、文件描述符表、页表、设备状态的代码。

![临界区保护访问协议示意图：多个线程通过统一加锁入口访问共享状态，绕开锁或更换锁对象都会破坏互斥关系](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/os-lock-critical-section.png)

评价一种锁或同步机制时，可以从正确性、进展性、公平性和性能这 4 个角度看。

**第一是正确性。** 同一时刻不能让多个执行流随意交错修改共享状态；多 CPU 场景里，还要有必要的同步语义，让一个线程释放锁前写入的状态，能被后续拿到同一把锁的线程按预期看到。

**第二是进展性。** 同步机制本身不能把所有等待者都困住，导致系统再也没人能往前走。

**第三是公平性。** 多个线程都在等同一把锁时，尽量避免某个线程长期拿不到锁。实际系统不一定严格 FIFO，但饥饿问题必须被认真对待。

**第四是性能。** 没有竞争时，加锁和解锁路径应该足够轻；竞争很激烈时，等待线程不能把 CPU 大量浪费在无效循环上。

OSTEP 讲锁时也会关注这些问题：能不能真的做到互斥，等待线程会不会饿死，没有竞争时要付多少成本，单 CPU 和多 CPU 下的表现有什么差别。只问“哪种锁最快”意义不大，同一把锁放到不同机器、不同临界区长度、不同竞争强度下，答案经常会变。

## 互斥锁：先把门关上，再改共享状态

回到前面的 `count++`。如果这段自增必须算对，最直接的办法就是在读、加、写这几个动作外面加一把 **互斥锁（mutex）**。谁先拿到锁，谁先改；没拿到锁的线程在门外等着。

用 POSIX 线程写出来大概是这样：

```c
pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;
int count = 0;

void increase(void) {
    pthread_mutex_lock(&mutex);
    count++;
    pthread_mutex_unlock(&mutex);
}
```

这段代码里，`pthread_mutex_lock()` 不只是做一次标记。从 POSIX 语义看，如果锁已经被其他线程持有，调用线程会等待锁变得可用，成功返回后才拥有这把锁。

具体实现可以更灵活。很多 pthread mutex 或语言运行时里的锁，可能先在用户态短暂自旋；如果竞争还没解除，再走 futex 之类的阻塞路径。对使用者来说，重点放在语义上：拿到锁之前不能进入临界区，拿到锁之后才拥有被保护状态的访问权。

mutex 适合守住边界清楚的共享状态修改。更新引用计数、改链表指针、维护进程表、更新一小段内存缓存，都很典型。写这类代码时，最该先确认的是这把锁负责保护哪一份状态，以及所有访问这份状态的入口有没有遵守同一套规则。

举个很常见的坑：一个共享对象有 5 条访问路径，其中 4 条都会拿同一把锁，剩下一条为了“方便”直接改字段。这样一来，前面 4 条路径写得再认真，互斥关系也被绕开了。锁保护的是访问协议，光把变量放在锁旁边没有用。

还有一个细节，mutex 通常有持有者语义。简单说，谁拿锁，谁释放。Linux 内核文档介绍 lock types 时专门提到 owner semantics，大多数锁都要求获取锁的上下文负责释放。信号量不太一样，它更像计数器，后面讲到它时这个差别会很明显。

## 自旋锁：别睡，原地等一小会儿

mutex 拿不到时，线程可以睡下去，等内核以后再唤醒它。**自旋锁（spin lock）** 反过来：先别睡，继续在 CPU 上循环检查锁有没有释放。

这听起来有点傻，实际要看等待时间。

![mutex 和 spinlock 等待方式对比：mutex 在可阻塞路径中睡眠等待，spinlock 在不能睡眠的短路径中短暂忙等](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/os-lock-mutex-spinlock.png)

如果一把锁只保护几行代码，持锁线程马上就会离开临界区，等待线程睡下去反而不划算。睡眠和唤醒都要经过调度器，期间还可能发生上下文切换；在多 CPU 机器上，持锁线程也许正在另一个 CPU 上执行，几条指令后就释放锁。这个时候，等待线程原地转几圈，成本可能更低。

但自旋有两个硬限制。

**第一，临界区必须短。** 持锁线程如果要访问磁盘、等待网络、分配可能睡眠的内存，等待方就会把 CPU 时间烧在空转上。

**第二，要小心单 CPU 或可抢占场景。** 如果持锁线程被抢占，而等待线程在同一个 CPU 上自旋，等待线程转得再努力也等不到释放动作。

在非 PREEMPT_RT Linux 内核里，普通 `spinlock_t` 获取后会隐式禁用抢占；如果还要防止中断处理程序在本 CPU 上打断当前临界区，才会使用 `spin_lock_irq()`、`spin_lock_irqsave()` 这类带后缀的接口。也就是说，plain `spin_lock()` 不等于总是禁用硬中断。

Linux 内核文档把锁粗分为 sleeping locks、CPU local locks 和 spinning locks。`mutex`、`semaphore`、`rw_semaphore` 属于可能睡眠的锁；`raw_spinlock_t` 在普通内核和 PREEMPT_RT 内核里都是严格自旋锁。`spinlock_t` 的语义会随 PREEMPT_RT 改变：非 PREEMPT_RT 下，它映射到 `raw_spinlock_t`；PREEMPT_RT 下，它基于 `rt_mutex` 实现，不再隐式禁用抢占，`_irq` / `_irqsave` 后缀也不再直接改变硬中断禁用状态。

用户态业务代码通常不应该自己写自旋锁。库和运行时可以在非常短的路径上做自适应自旋，但应用代码里手写 `while` 循环等锁，多数时候只是在把 CPU 变热。

## 信号量：不是只有 0 和 1 的锁

**信号量（semaphore）** 可以看成一个不会降到负数的计数器。`sem_wait()` 尝试把计数减 1；如果当前值大于 0，减完就继续；如果当前值是 0，调用线程阻塞。`sem_post()` 把计数加 1，并可能唤醒等待者。

计数初始值设为 1 时，信号量可以当互斥锁用：

```c
sem_t sem;

sem_init(&sem, 0, 1);

sem_wait(&sem);
// critical section
sem_post(&sem);
```

不过，信号量真正常见的用途是“资源计数”。比如缓冲区有 N 个空槽，连接池最多允许 N 个连接，某类任务最多同时跑 N 个。这个时候，信号量的初始值就是资源数量。

二值信号量可以模拟互斥，但它不等于 mutex。mutex 强调持有者和临界区所有权，semaphore 强调计数和许可数量。一个有界缓冲区通常会把这两类问题拆开：信号量管槽位数量，mutex 管缓冲区内部结构。

![semaphore 管理有界缓冲区资源数量示意图：empty_slots 记录空位数量，filled_slots 记录可消费数量，buffer_mutex 保护缓冲区结构](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/os-lock-semaphore-buffer.png)

下面代码省略了 `item_t` 和缓冲区的具体实现，只保留同步骨架：

```c
#include <errno.h>
#include <pthread.h>
#include <semaphore.h>
#include <stdlib.h>

#define BUFFER_SIZE 1024

sem_t empty_slots;
sem_t filled_slots;
pthread_mutex_t buffer_mutex = PTHREAD_MUTEX_INITIALIZER;

void init_buffer(void) {
    if (sem_init(&empty_slots, 0, BUFFER_SIZE) == -1) {
        abort();
    }
    if (sem_init(&filled_slots, 0, 0) == -1) {
        abort();
    }
}

static void wait_sem(sem_t *sem) {
    while (sem_wait(sem) == -1) {
        if (errno == EINTR) {
            continue;
        }
        abort();
    }
}

void producer(void) {
    item_t item = produce_item();

    wait_sem(&empty_slots);
    pthread_mutex_lock(&buffer_mutex);
    put_item(item);
    pthread_mutex_unlock(&buffer_mutex);
    sem_post(&filled_slots);
}

void consumer(void) {
    wait_sem(&filled_slots);
    pthread_mutex_lock(&buffer_mutex);
    item_t item = take_item();
    pthread_mutex_unlock(&buffer_mutex);
    sem_post(&empty_slots);

    consume(item);
}
```

`empty_slots` 记录还有多少空位，`filled_slots` 记录已经有多少可消费元素。生产者先消耗一个空位，放入数据后增加一个可消费元素；消费者反过来。`buffer_mutex` 只负责保护 `put_item()` 和 `take_item()` 对缓冲区结构的修改。

`wait_sem()` 里重试 `EINTR` 也不是装饰。Linux man-pages 明确列出 `sem_wait()` 可能因为信号处理程序打断而返回 `-1`，并把 `errno` 设为 `EINTR`。示例代码如果完全不处理这个分支，读者复制以后很容易留下偶发 bug。

Linux Kernel locking 文档明确说明，semaphore 可以用于串行化和等待；写新代码时，更推荐把互斥、事件完成这类语义拆到 mutex、completion 等机制里。原因之一是 semaphore 没有明确 owner，PREEMPT_RT 无法为它提供优先级继承，阻塞在 semaphore 上可能出现优先级反转。

## 条件变量：等的不是锁，是某个条件成立

mutex 解决的是“同一时刻谁能进临界区”。但很多时候，线程进入临界区后发现条件还没满足。

比如消费者拿到锁后发现队列为空。它不能继续取数据，也不能一直拿着锁睡觉。否则生产者拿不到锁，没法往队列里放数据，系统就僵住了。

**条件变量（condition variable）** 解决的就是这种等待条件的问题。它通常和 mutex 配套使用：

```c
pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t not_empty = PTHREAD_COND_INITIALIZER;
queue_t queue;

void consumer(void) {
    pthread_mutex_lock(&mutex);

    while (queue_empty(&queue)) {
        pthread_cond_wait(&not_empty, &mutex);
    }

    item_t item = queue_pop(&queue);
    pthread_mutex_unlock(&mutex);

    consume(item);
}

void producer(item_t item) {
    pthread_mutex_lock(&mutex);
    queue_push(&queue, item);
    pthread_cond_signal(&not_empty);
    pthread_mutex_unlock(&mutex);
}
```

`pthread_cond_wait()` 做了一件非常关键的事：它会原子地释放 mutex，并让当前线程等待条件变量；被唤醒返回前，又会重新获得 mutex。这个“释放锁并睡眠”的动作必须连在一起，否则就可能出现丢信号：线程刚准备睡，生产者已经发完通知，消费者随后睡下去，再也没人叫醒它。

![condition variable 等待条件成立流程图：线程在 while 中检查共享状态，条件不满足时释放 mutex 并睡眠，被 signal 唤醒后重新检查条件](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/os-lock-condition-variable.png)

条件变量有三条使用规则很重要。

**第一，等待条件要写在 `while` 里，不要写成 `if`。** POSIX 明确允许 condition wait 出现 spurious wakeup，也就是线程醒来时条件未必成立。即使没有这种唤醒，多个消费者同时被唤醒后，也可能只有一个线程抢到数据，其他线程再次发现队列为空。

**第二，条件变量本身不保存状态，真正的状态必须放在受 mutex 保护的共享变量里**。`pthread_cond_signal()` 不是往队列里塞一张永久有效的票。如果 signal 发生时没人等待，这次通知可能就过去了。真正决定消费者能不能继续执行的，是 `queue_empty()` 背后的队列长度。

**第三，同一个条件变量在有等待者期间，应该和同一把 mutex 配套使用。** POSIX 把这叫动态绑定：只要还有线程阻塞在某个 condition variable 上，其他线程如果拿另一把 mutex 去等待同一个 condition variable，行为就是未定义的。这个规则平时不常被提起，但它能解释为什么条件变量代码通常会把“状态变量、mutex、condvar”放在同一个数据结构里管理。

很多条件变量 bug 都出在这里：把 signal 当状态，或者醒来后不重新检查条件。

## futex：用户态先试，失败再找内核

Linux 里经常会听到 futex（fast userspace mutex）。名字里有 mutex，但 futex 更像一块搭锁的地基。

futex 的设计思路是：没有竞争时，完全在用户态用原子指令修改一个 32 位整数；只有需要睡眠或唤醒等待者时，才进入内核调用 `futex()`。这样可以避开每次加锁都系统调用的开销。

一个简化版流程是：

1. 线程先在用户态用原子操作尝试把锁字从 0 改成 1。
2. 如果成功，说明没人竞争，直接进入临界区。
3. 如果失败，说明锁被占用，再调用 `FUTEX_WAIT` 让内核把线程挂起。
4. 持锁线程释放锁后，如果发现有人等待，调用 `FUTEX_WAKE` 唤醒一个或多个等待者。

![futex 用户态快路径与内核慢路径示意图：无竞争时通过用户态原子操作拿锁，竞争失败后进入 FUTEX_WAIT，释放时通过 FUTEX_WAKE 唤醒等待线程](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/os-lock-futex.png)

`FUTEX_WAIT` 走的是 compare-and-block：内核会先确认 futex word 仍然等于调用者传入的期望值，只有匹配时才把线程挂起。这个比较和阻塞动作是原子的，所以它能把用户态原子操作和内核睡眠队列接起来。

man-pages 对 futex 的描述也强调了这一点：futex 操作围绕一个用户空间地址上的 32 位值展开，常见操作包括等待和唤醒。应用一般不会直接把 futex 当业务锁使用；pthread mutex、条件变量、运行时同步器这类库，会在更高层同步原语里用到它。

所以，看 Linux 用户态锁时可以记住这句话：快路径尽量留在用户态，慢路径才进内核排队睡眠。

## 原子指令：锁总得有一个不可拆的起点

无论 mutex、spinlock 还是 futex，最后都要落到某种硬件支持的原子操作上。否则“检查锁是否空闲”和“把锁标记为已占用”之间仍然会被别的线程插进来。

常见原子指令包括 test-and-set、compare-and-swap、fetch-and-add 等。它们保证对某个内存位置的读改写不会被其他 CPU 观察成半截状态。

早期教材里还会讲“关中断实现锁”。在单 CPU 内核里，关中断可以防止当前执行流被中断处理打断，从而保护某些内核临界区。但这个方法有很强边界：它只影响当前 CPU，不能阻止另一个 CPU 同时访问同一份内存。多处理器系统里，跨 CPU 的互斥仍然要靠原子指令、缓存一致性协议和内核锁规则。

这也是为什么操作系统课程会先讲原子指令，再讲锁实现。锁对程序员暴露的是 `lock()` / `unlock()`，底下靠的是 CPU 和内核共同维护的不可拆更新。

## 锁还负责内存顺序

锁不只是在临界区门口排队。多 CPU 系统里，CPU 和编译器都可能调整内存访问顺序；如果同步语义不够，一个 CPU 写入的状态，另一个 CPU 未必会按源码顺序看到。

所以，锁获取和锁释放通常还带有内存顺序含义。可以先按这两个词理解：

- acquire：拿到锁之后的内存访问，不能被重排到拿锁之前。
- release：释放锁之前的内存访问，不能被重排到释放锁之后。

Linux 内核内存屏障文档也把 LOCK 操作归到 acquire，把 UNLOCK 操作归到 release。正确使用 mutex、spinlock 这类同步原语时，开发者通常不需要手写内存屏障；只有写无锁结构、驱动、内核底层同步或设备交互时，才需要直接面对 memory barrier。

这里还有一个边界：acquire 和 release 是最小保证，二者配合不等于任意场景下的 full memory barrier。普通业务代码一般不需要背这些细节，但如果已经在写无锁队列、RCU、驱动或 MMIO 访问，这个差别就不能跳过。

## 优先级反转：锁也会影响调度

锁还会把调度问题带进来。

经典问题是优先级反转。低优先级线程 L 持有一把锁，高优先级线程 H 等这把锁；这时中优先级线程 M 持续运行，把 L 抢占掉。结果是 H 明明优先级最高，却一直等不到 L 释放锁。

解决思路之一是优先级继承。持锁的低优先级线程临时继承等待者中的最高优先级，尽快跑完临界区并释放锁。

POSIX mutex 的 protocol 属性里就有 `PTHREAD_PRIO_INHERIT` 和 `PTHREAD_PRIO_PROTECT`。Linux 的 `rt_mutex` 也围绕 priority inheritance 设计，用来支持 PI-futex 和带优先级继承属性的 pthread mutex。

这也是前面说 semaphore 没有 owner 会带来限制的原因。没有明确持有者，系统就不知道该提升谁的优先级；Linux Kernel locking 文档也指出，semaphore 在 PREEMPT_RT 下无法提供优先级继承，阻塞在 semaphore 上可能导致优先级反转。

## 用户态锁和内核锁有什么不同？

用户态程序关心的是线程之间如何协作。Pthreads 给你 mutex、condition variable、semaphore；C++、Java、Go、Rust 又在各自运行时和标准库里封装出更贴近语言的同步工具。

内核里的锁多了一层上下文约束。内核代码可能运行在普通进程上下文，也可能运行在中断、软中断或不可抢占区域；有些路径能睡眠，有些路径绝对不能睡；有些锁拿着时会禁用抢占或中断；实时内核还要处理优先级反转和调度延迟。

所以，看内核锁时要多问几句：

- 当前上下文能不能睡眠？
- 持锁期间能不能被抢占？
- 是否可能被中断处理程序重入？
- 它保护的是 per-CPU 数据，还是跨 CPU 共享数据？
- 当前运行的是普通内核，还是 PREEMPT_RT 内核？
- 是否需要优先级继承来控制实时延迟？

![用户态锁和内核锁的上下文差异示意图：用户态主要关注线程协作，内核态还要判断能否睡眠、能否抢占、是否处于中断路径以及是否跨 CPU 共享](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/os-lock-kernel-context.png)

可以先抓住几个常见区别：

- mutex 这类 sleeping lock 可以让任务睡眠，适合较长临界区，但不能在中断上下文随便使用。
- spinlock 适合非常短、不能睡的内核路径，持锁期间要避免调用可能阻塞的函数。
- rw_semaphore、rwlock 面向多读单写，但公平性和实时语义会随内核配置变化。
- local lock、关抢占、关中断更偏向保护当前 CPU 上的数据，不能自然替代跨 CPU 锁。

Linux Kernel locking 文档把这些规则写得很细，尤其是 PREEMPT_RT 下锁语义的变化。普通应用开发不需要背完整细节，但要知道一件事：内核锁不能只按“互斥/读写/自旋”几个名字理解，它还和当前上下文能不能睡、能不能被抢占、能不能处理中断紧紧绑在一起。

## 怎么选同步原语？

如果只是保护一段共享状态修改，先考虑 mutex。它表达清楚，等待时可以睡眠，适合大多数用户态临界区。

如果要限制某类资源同时被多少线程使用，信号量更自然。比如最多 10 个并发下载任务、连接池最多 50 个连接。这个场景的关键是“数量”，不是谁进入临界区。

如果线程要等某个状态变化，用条件变量。队列从空变非空、任务从未完成变完成、缓冲区从满变未满，都属于这种等待条件。记得把状态放在共享变量里，用 mutex 保护，并在 `while` 中等待。

如果在内核里保护非常短的路径，并且当前上下文不能睡，才考虑 spinlock。用户态业务代码里长期自旋通常是坏味道。

如果你在实现语言运行时、线程库或高性能同步器，futex 这类机制才会进入视野。普通业务代码更应该使用标准库或成熟并发库，而不是直接对 futex 系统调用编程。

这几个判断也解释了为什么 Java 文章里会把 `synchronized`、`ReentrantLock`、AQS、CAS 放在一起讲。Java 开发者面对的是语言级抽象；操作系统面对的是线程调度、阻塞唤醒、CPU 原子指令和内核上下文。

## 常见错误

**把锁当成性能开关。**

锁先保证正确性，再谈性能。如果共享状态会被写坏，少一把锁只会把 bug 交给调度时机决定。

**用 `if` 等条件变量。**

条件变量醒来不代表条件已经成立。醒来后必须重新检查条件。这里用 `while` 才符合条件变量的使用语义。

**把 semaphore 当万能锁。**

信号量能做很多事，也正因为如此，代码读起来容易失去语义。只是互斥就用 mutex；只是等一次性事件，内核里常见 completion 这类更直接的工具；需要资源计数时再用 semaphore。

**在持锁期间做慢操作。**

持锁时访问磁盘、发网络请求、等待外部系统，都会把临界区拖长。线程越多，锁竞争越容易放大成吞吐下降、排队积压甚至死锁。

**忽略锁顺序。**

两个线程分别按 `A -> B` 和 `B -> A` 拿锁，等待环很容易形成。操作系统、数据库、Java 线程都会遇到同样的问题。死锁的完整介绍可以看 [死锁详解](./死锁详解-四个必要条件、Java 死锁排查与数据库死锁处理.md)。

## 总结

操作系统里的锁不能只按某一个 API 理解。它是一组围绕共享状态、等待条件、资源数量和调度上下文设计出来的同步机制。

mutex 负责互斥，spinlock 用忙等换掉睡眠切换，semaphore 负责计数和限流，condition variable 让线程在条件不满足时睡下去，futex 把用户态原子操作和内核阻塞唤醒接在一起。它们看起来都和“等”有关，实际等待的对象并不一样：有的等进入临界区，有的等资源数量，有的等状态变化，有的等内核把自己重新放回可运行队列。

学 Java 锁时，很多细节会被 JVM 和类库包起来；回到操作系统这一层，重点就变成了：线程什么时候该睡，什么时候可以自旋，谁负责唤醒，哪段代码不能被抢占，哪个上下文不能阻塞。

## 参考资料

- [OSTEP: Locks](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-locks.pdf)
- [OSTEP: Condition Variables](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-cv.pdf)
- [OSTEP: Semaphores](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-sema.pdf)
- [POSIX Programmer's Manual: pthread_mutex_lock](https://man7.org/linux/man-pages/man3/pthread_mutex_lock.3p.html)
- [POSIX Programmer's Manual: pthread_cond_wait](https://man7.org/linux/man-pages/man3/pthread_cond_wait.3p.html)
- [POSIX Programmer's Manual: pthread_mutexattr_getprotocol](https://man7.org/linux/man-pages/man3/pthread_mutexattr_getprotocol.3p.html)
- [Linux man-pages: sem_wait](https://man7.org/linux/man-pages/man3/sem_wait.3.html)
- [Linux man-pages: futex](https://man7.org/linux/man-pages/man2/futex.2.html)
- [Linux Kernel Documentation: Lock types and their rules](https://docs.kernel.org/locking/locktypes.html)
- [Linux Kernel Documentation: Memory Barriers](https://www.kernel.org/doc/Documentation/memory-barriers.txt)
- [Linux Kernel Documentation: RT-mutex subsystem with PI support](https://docs.kernel.org/locking/rt-mutex.html)


---

<!-- source: 操作系统/操作系统文件系统详解-inode、VFS、Page Cache 与日志机制.md -->

---
title: 操作系统文件系统详解：inode、VFS、Page Cache 与日志机制
description: 文件系统高频面试题总结，从文件和目录讲起，讲清 inode、dentry、文件描述符、VFS、磁盘块分配、空闲空间管理、硬链接、软链接、Page Cache、fsync 和日志文件系统。
category: 计算机基础
tag:
  - 操作系统
  - Linux
head:
  - - meta
    - name: keywords
      content: 文件系统,操作系统文件系统,文件系统面试题,Linux文件系统,inode,dentry,VFS,文件描述符,硬链接,软链接,Page Cache,fsync,ext4,日志文件系统,操作系统面试题
---

写一个保存文件的接口，最直觉的写法是：拿到路径，`open` 一个文件，把数据 `write` 进去，最后 `close`。文件少、并发低、机器不出故障的时候，这套流程看起来没什么难度。

可一到面试追问，问题就来了。`open()` 返回的 fd 到底指向什么？文件名是存在 inode 里吗？两个硬链接为什么能看到同一份内容？`write()` 返回成功，数据是不是已经落盘？日志文件删了，为什么 `df -h` 还是显示磁盘满？

这些问题都绕不开文件系统。它要把路径解析成文件对象，把文件的第 N 个字节定位到底层数据块，还要处理权限、缓存、删除、重命名和崩溃恢复。

答案就藏在 inode、dentry、VFS、Page Cache 和日志机制里。

下面先从最基础的问题讲起：文件系统到底在管什么？

## 文件系统到底在管什么？

平时写代码，看到的是路径、文件名、目录、`read`、`write`。对于建立在本地块设备上的文件系统，底层通常是逻辑块、扇区和设备 I/O；文件系统把这些低层资源组织成文件、目录和元数据。

不过，并不是所有文件系统都对应本机磁盘。`tmpfs` 主要以内存作为后端，`procfs` 暴露内核运行状态，NFS 则把远端文件系统接入本地目录树。VFS 在这些实现之上提供统一的文件接口。

小 G 更建议这样看文件系统：它不是只负责“保存文件内容”，还要同时解决 4 件事。

![文件系统职责概览](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/file-system-responsibilities.webp)

- **命名**：用路径和文件名找到目标文件，例如 `/var/log/app.log`。
- **组织**：用目录树管理文件，让不同文件能归到不同目录下。
- **定位**：把文件的第 N 个字节映射到磁盘或 SSD 上的某个数据块。
- **保护**：记录权限、所有者、时间戳，并在访问时做检查。

没有文件系统，应用就得自己记住“第几个块到第几个块属于哪个文件”，还要自己处理删除、扩容、权限、崩溃恢复。文件系统把这些事收进统一接口里，应用只需要拿文件描述符读写。

本文主要按 Linux/Unix 风格讲。NTFS、APFS、Btrfs、XFS、ext4 的实现各有差异，但文件、目录、元数据、缓存、分配、恢复这些问题绕不开。

## 文件和目录分别是什么？

在 Unix/Linux 语境下，普通文件可以理解为一段带有名称和元数据的字节序列，通常由持久化存储保存。VFS 还会用类似的文件接口暴露目录、设备、FIFO、Socket 和伪文件系统对象。

所以，“一切皆文件”更准确的理解是：Linux 尽量让不同资源通过文件描述符和统一的 I/O 接口访问，而不是所有对象都会真正写到磁盘。管道的数据在内核缓冲区里，`/proc` 下的很多内容则是内核实时生成的伪文件。

目录也是一种文件，只是它的数据内容比较特殊。在 ext4 这类 Unix 风格文件系统中，目录的数据主要保存“文件名到 inode 号”的映射。用户通过路径找文件时，文件系统会逐级查目录：

```text
/home/guide/a.txt
  -> 查根目录 /
  -> 找到 home
  -> 进入 home 后找到 guide
  -> 进入 guide 后找到 a.txt
```

目录树让文件有了层次。挂载机制又把多个文件系统接到同一棵目录树上，例如把 `/dev/sda2` 挂载到 `/data` 后，访问 `/data/app.log` 时，实际访问的就是另一个分区里的文件系统。

目录虽然在文件系统内部也拥有数据块和 inode，但用户态通常不能像普通文件那样直接 `read()` 它，而要通过 `readdir()`、`getdents()` 这类目录遍历接口读取目录项。

## inode、dentry 和文件名有什么关系？

在 Linux/Unix 文件系统里，理解 inode 很关键。

**inode（索引节点）记录文件元数据**，常见内容包括文件类型、权限、所有者、大小、时间戳、链接计数，以及指向数据块的位置。

inode 通常不保存文件名。文件名属于目录项，同一个 inode 可以有多个文件名。普通文件的数据通常保存在独立的数据块或 extent 中，inode 只保存数据映射信息。不过部分文件系统存在内联优化，例如 ext4 可以把很小的文件内容或短符号链接目标直接放进 inode。

Linux VFS 还会在内存中维护 dentry。dentry 表示路径中的一个目录项，用来缓存名称查找结果；它通常指向 inode，但也可能是“不存在目标”的 negative dentry。可以粗略理解成：

- **文件名**：保存在磁盘目录项中。
- **dentry**：VFS 在内存中维护的路径组件和查找缓存。
- **inode**：代表文件系统对象，保存或关联其元数据与数据映射。
- **数据块或 extent**：保存普通文件的数据内容。

这也解释了为什么重命名文件通常很快。`mv a.txt b.txt` 如果发生在同一个文件系统内，很多时候只是修改目录项里的名字映射，文件内容本身不用移动。

![文件名 dentry 和 inode 关系](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/file-inode-dentry-relation.webp)

可以用下面几个命令观察这些信息：

```bash
# 查看 inode 号
ls -li app.log

# 查看文件元数据
stat app.log

# 查看文件系统 inode 使用情况
df -i
```

对于 ext4 这类预先建立 inode 表的文件系统，inode 数量也可能比数据块更早耗尽。服务器磁盘看起来仍有空间，但大量小文件占满 inode 后，创建文件仍可能报 `No space left on device`。不同文件系统的 inode 分配方式并不完全相同，因此 `df -i` 的解释也要结合具体文件系统。

## `open` 一个文件时发生了什么？

应用调用 `open()` 后，内核不会把整个文件读进内存。它主要做几件事：

1. 解析路径，找到对应目录项和 inode。
2. 检查权限、打开标志和文件类型是否合法。
3. 创建一个内核里的打开文件对象，记录文件偏移量、状态标志等信息。
4. 在当前进程的文件描述符表里分配一个最小可用的非负整数，也就是 fd。

Linux man-pages 对这块说得很清楚：`open()` 返回的是进程文件描述符表里的索引；每次 `open()` 还会创建一个系统范围内的 open file description，用来记录文件偏移和状态标志。

这几个结构容易混：

![路径到文件描述符](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/file-path-to-fd.webp)

| 结构          | 归属               | 主要记录什么                   |
| ------------- | ------------------ | ------------------------------ |
| 文件描述符表  | 每个进程一份       | fd 到打开文件对象的引用        |
| 打开文件对象  | 系统范围内         | 当前偏移量、打开状态、读写标志 |
| inode 表/缓存 | 文件系统和内核维护 | 文件元数据、数据块位置         |

`dup()`、`fork()` 之后，多个 fd 可能引用同一个打开文件对象，所以它们共享文件偏移量。两个进程分别 `open()` 同一个文件，则通常会得到两个不同的打开文件对象，各自维护偏移量。

这就是下面这种现象的来源：同一个文件被删除后，正在写它的进程可能还能继续写。`unlink()` 删除的是目录中的名称，并减少 inode 的链接计数。只有当最后一个硬链接已经删除，并且所有打开引用、内存映射等内核引用都释放后，文件占用的空间才会真正回收。

## 文件在磁盘上怎么放？

磁盘和 SSD 对外通常以块为单位读写。文件系统会把一个分区或卷划分成很多块，再用一些元数据结构管理它们。以 ext 系列文件系统为例，磁盘布局通常会包含这些区域：

- **超级块（superblock）**：记录文件系统整体信息，例如块大小、inode 数、空闲块数量、挂载状态。
- **inode 区**：保存 inode。
- **数据块区**：保存普通文件内容和目录内容。
- **位图或其他空闲空间结构**：记录哪些 inode、哪些数据块还没被使用。

教材里常见的文件分配方式有连续分配、链式分配和索引分配。它们适合用来理解设计取舍。

**连续分配**把一个文件放进一段连续块里。优点是顺序读写和随机访问都很直接，只要知道起始块和长度就能定位。缺点也直接：文件增长麻烦，反复创建删除后容易留下外部碎片。

**链式分配**让文件块分散在磁盘各处，每个块指向下一个块。它不要求连续空间，文件扩展方便，但随机访问差。要读第 1000 个块，可能得从第 1 个块一路跟指针走过去。FAT 文件系统把这些指针集中到文件分配表里，改善了部分查找问题，但表本身又成了需要维护的元数据。

**索引分配**把文件的数据块地址集中放在索引块里。要读第 i 个块，先查索引块第 i 项，再去读对应数据块。它支持随机访问，也没有连续分配那种外部碎片问题，代价是要额外保存索引块。

经典 ext2/ext3 使用直接块指针、一级间接、二级间接和三级间接块定位文件数据。ext4 通常改用 extent tree：一个 extent 记录一段连续物理块的逻辑起点、物理起点和长度；对于连续大文件，它比“每个块记录一个地址”节省大量映射元数据。

![文件数据块定位方式](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/file-block-allocation.webp)

其他现代文件系统也可能使用 B 树、extent、延迟分配、写时复制等不同组合，不能把直接/间接块结构当成所有现代文件系统的统一实现。

## 空闲空间怎么管理？

文件删除后，原来占用的数据块要归还给文件系统；新文件写入时，又要快速找到可用块。这就是空闲空间管理。

常见方法有几类：

- **空闲表**：记录每段连续空闲区域的起始块和长度。适合连续分配，但表会随着碎片增多而变复杂。
- **空闲链表**：把空闲块串成链表，分配和回收单个块比较直接，但查找连续空间不方便。
- **位图**：每个块对应 1 个 bit，0 表示空闲，1 表示已用。查找连续空闲块可以扫描位图，空间开销也可控。
- **成组链接**：把一批空闲块地址放在一个块里，再链接到下一批，早期 Unix 系统里常见。

位图很常见。假设文件系统大小为 1 TiB，块大小为 4 KiB，那么共有 `2^28` 个块。每个块使用 1 bit 标记，位图大小约为 32 MiB。这个开销可以接受，换来的是清晰的块状态管理。

真实文件系统还会结合分配策略减少碎片。比如优先把同一个目录下的文件、同一个大文件的连续 extent 放得近一些，让顺序读取更友好。SSD 没有机械磁盘的寻道问题，但连续写、写放大、擦除块、TRIM 等因素仍然会影响性能和寿命。

## VFS 解决了什么问题？

Linux 支持 ext4、XFS、Btrfs、tmpfs、procfs、NFS 等很多文件系统。用户程序不可能为每一种文件系统写一套 `open_ext4()`、`open_xfs()`。

VFS（Virtual File System，虚拟文件系统）就是中间抽象层。应用还是调用统一的 `open`、`read`、`write`、`close`，VFS 根据目标文件所在的文件系统，把操作转发给具体实现。

Linux 官方 VFS 文档把几个对象讲得很直接：

- **superblock**：代表一个已挂载文件系统。
- **inode**：代表文件系统里的一个对象，比如普通文件、目录、FIFO。
- **dentry**：代表路径中的一个目录项，通常指向 inode。
- **file**：代表一次打开后的文件对象，也就是 fd 背后的内核结构。

有了 VFS，`cat /proc/cpuinfo`、`cat /var/log/app.log`、读取 NFS 上的文件，都可以使用相同的用户态接口。差异被压到 VFS 下面的具体文件系统实现里。

## 硬链接和软链接有什么区别？

硬链接和软链接都能让一个路径关联到另一个文件，但它们指向的对象不同。

| 对比项           | 硬链接                                                   | 软链接                                   |
| ---------------- | -------------------------------------------------------- | ---------------------------------------- |
| 指向对象         | 同一个 inode                                             | 另一个路径                               |
| 是否创建新 inode | 不创建新的目标文件 inode，只新增一个目录项并增加链接计数 | 软链接本身是一个独立文件，有自己的 inode |
| 删除源文件后     | 只要还有硬链接，数据还在                                 | 软链接可能变成悬空链接                   |
| 是否能跨文件系统 | 不能                                                     | 可以                                     |
| 是否能链接目录   | Linux 不允许通过普通硬链接接口链接目录                   | 可以                                     |

![硬链接和软链接对比](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/file-hardlink-symlink.webp)

硬链接不能跨文件系统，因为 inode 号只在当前文件系统内有意义。另一个文件系统有自己的 inode 表，同一个数字不代表同一个文件。

可以用下面的命令做个小实验：

```bash
echo hello > a.txt
ln a.txt hard.txt
ln -s a.txt soft.txt

ls -li a.txt hard.txt soft.txt
```

你会看到 `a.txt` 和 `hard.txt` 的 inode 号相同，`soft.txt` 的 inode 号不同。删除 `a.txt` 后，`hard.txt` 还能读到内容，`soft.txt` 会指向一个不存在的路径。

## Page Cache 为什么影响文件读写性能？

直接读写磁盘太慢。Linux 会用 **Page Cache** 缓存文件数据，把磁盘文件的一部分页保存在内存里。

读文件时，如果目标页已经在 Page Cache 中，内核可以直接从内存复制给用户态，不需要真的读盘。没有命中时，才从磁盘把页读进 Page Cache，再返回给应用。

对于普通文件的 buffered I/O，`write()` 成功通常只表示数据已经被内核接收，常见情况是进入 Page Cache 并被标记为脏页。它既不保证完整写入请求的全部字节，也不保证数据已经持久化到底层设备。调用方要处理 partial write；如果需要持久性，还要检查 `fsync()`、`fdatasync()` 和 `close()` 的错误。

`fdatasync()` 也会同步文件数据，但只同步后续读取数据所必需的元数据，例如文件大小；`fsync()` 则同步文件数据和更完整的关联元数据。这里说的是普通 buffered I/O，`O_DIRECT`、`O_SYNC`、DAX 等路径会改变具体行为。

代价是崩溃风险。进程写完文件后，如果机器突然掉电，已经返回成功的写入不一定都落盘。需要更强持久性时，要使用 `fsync()`、`fdatasync()` 或带同步语义的打开标志，但这些操作会让应用等待刷盘，吞吐会下降。

还有一个很容易漏掉的点：`fsync(fileFd)` 只同步文件本身，不一定同步父目录中的文件名变化。创建新文件、执行 `rename()` 或 `unlink()` 后，如果要求掉电后目录项也可靠持久化，还需要打开父目录并对目录 fd 调用 `fsync()`。

一个典型的安全替换流程是：在同一目录创建临时文件，写入完整内容，对临时文件调用 `fsync()`，再用 `rename()` 原子替换目标文件，最后对父目录调用 `fsync()`。同一文件系统内的 `rename()` 可以原子替换目标名称，但“命名空间操作原子”不等于“掉电后一定持久”。

数据库、消息队列、日志系统都绕不开这点。它们经常自己管理刷盘策略：有的追求每次事务提交都尽量落盘，有的允许短窗口内的数据丢失来换取吞吐。这里没有通用最优解，只有业务能接受的恢复点目标。

![文件写入到持久化路径](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/file-write-persistence.webp)

## 日志文件系统是怎么减少崩溃损坏的？

文件系统最怕写到一半崩溃。比如创建文件时，既要分配 inode，又要分配数据块，还要更新目录项和位图。只写完其中一部分就断电，文件系统可能处于不一致状态。

日志文件系统（journaling filesystem）会先把即将进行的元数据变更写入日志区域，之后再更新正式位置。系统恢复时会扫描日志：已经完整提交、但还没全部写回正式位置的事务可以重放；没有 commit record 或校验失败的事务会被丢弃。日志的目标是避免文件系统结构停在“只更新了一半”的状态。

以 ext4 为例，官方文档列了 3 种数据模式：

- **`data=writeback`**：只保证元数据日志，不保证相关数据块先于元数据写入。性能通常更好，但崩溃后新写文件里可能出现旧数据。
- **`data=ordered`**：默认模式。元数据进入日志前，相关数据块会先写到主文件系统。它没有把文件数据本身写进日志，但降低了元数据指向未写数据的风险。
- **`data=journal`**：数据和元数据都先写日志，再写最终位置。对经过日志的数据提供更强的崩溃一致性保证，但写放大和性能成本也更高。

日志文件系统解决的是“文件系统结构一致性”，不是替应用保证所有业务数据都不丢。应用要保证事务级持久性，仍然要正确使用 `fsync()`，并处理重命名、临时文件、目录刷盘这些细节。

## 文件系统性能问题通常看哪里？

排查文件系统问题，不要只盯磁盘容量。下面这些指标更常见。

**inode 是否用完**：

```bash
df -i
```

小文件过多时，inode 可能比容量更早耗尽。

**文件描述符是否泄露**：

```bash
ulimit -n
cat /proc/<pid>/limits
lsof -p <pid>
ls /proc/<pid>/fd | wc -l
```

服务报 `Too many open files` 时，先看进程 fd 上限和当前 fd 数，再查有没有连接、日志文件、临时文件没有关闭。这里也要区分两类错误：`EMFILE` 表示当前进程的文件描述符达到上限，`ENFILE` 表示系统范围内的打开文件数量达到上限。

多线程程序创建 fd 时，尽量优先使用 `O_CLOEXEC` 这类原子 close-on-exec 选项，避免 fd 意外泄漏到 `exec()` 后的新程序。

**Page Cache 大小和内存压力**：

```bash
free -h
vmstat 1
```

`free -h` 和 `vmstat 1` 可以辅助判断缓存规模、内存压力、换页和 I/O 活动，但不能直接得出 Page Cache 命中率。Linux 会尽量用空闲内存做缓存，所以 `free` 里 buff/cache 很大不一定是坏事。真正要看的是应用是否频繁等待 I/O、是否有大量回写、是否因为内存压力导致缓存被反复回收。

需要观察具体文件的缓存页面时，新版 Linux 提供 `cachestat()`；也可以使用基于 eBPF 的 `cachestat` 一类工具，但生产使用前要评估采集开销。

**磁盘是否繁忙**：

```bash
iostat -x 1
```

对于传统串行设备，`%util` 长期接近 100% 可能意味着设备繁忙。但对于 NVMe SSD、RAID 和其他可以并行处理多个请求的设备，`%util` 不能直接等同于饱和度。还要结合 `await`、`r_await`、`w_await`、`aqu-sz`、吞吐量、IOPS 以及应用端延迟一起判断。

**`df` 很满，`du` 却找不到大文件**：

```bash
lsof +L1
ls -l /proc/<pid>/fd
```

`du` 统计目录树中仍有名字的文件；`df` 统计文件系统已经分配的块。如果一个大日志已经被 `unlink()`，但进程还保持 fd 打开，它不会再出现在目录遍历结果里，`du` 看不到它；底层空间却还没释放，所以 `df` 仍然很高。处理时通常应该让进程重新打开日志文件，或者正常重启服务，不要直接对 `/proc/<pid>/fd/*` 做未经验证的破坏性操作。

小 G 这里也留一个限制：不同文件系统、内核版本、挂载参数、硬件缓存策略都会改变表现。比如 `O_DIRECT` 在 Linux 下还有对齐限制，而且限制会随文件系统和内核版本变化。做性能判断时，最好结合当前系统的 `mount`、`uname -a`、`fio` 或真实业务压测结果，不要只按教材结论下判断。

## 面试里怎么回答文件系统？

如果面试问“文件系统是什么”，可以按这条线回答：

文件系统负责把存储设备上的块组织成用户能理解的文件和目录。它要管理命名、目录、元数据、数据块分配、空闲空间、权限、缓存和崩溃恢复。

讲 Linux 时，可以继续补上 inode、dentry、file 和 superblock。文件名保存在目录项里，inode 保存文件元数据和数据块位置；`open()` 解析路径、检查权限后返回 fd，fd 指向一次打开后的文件对象，读写时再通过 VFS 调到具体文件系统。

如果追问“硬链接和软链接”，抓住一句话：硬链接是多个目录项指向同一个 inode，软链接是一个独立文件，内容是目标路径。

如果追问“为什么写完文件还可能丢”，回答 Page Cache 和写回策略：`write()` 成功通常只代表数据进入内核缓存，不代表已经持久化；需要更强保证时要配合 `fsync()`、日志机制和正确的写入顺序。


---

<!-- source: 操作系统/进程间通信（IPC）详解-管道、消息队列、共享内存、Socket 与 Binder.md -->

---
title: 进程间通信（IPC）详解：管道、消息队列、共享内存、Socket 与 Binder
description: 进程间通信高频知识点总结，从进程地址空间隔离讲起，讲清管道、消息队列、共享内存、信号量、信号、Socket、Android Binder 和微内核 IPC 的设计取舍。
category: 计算机基础
tag:
  - 操作系统
  - Linux
  - IPC
head:
  - - meta
    - name: keywords
      content: 进程间通信,IPC,Linux IPC,管道,FIFO,消息队列,共享内存,信号量,信号,Socket,Unix Domain Socket,Android Binder,微内核 IPC,操作系统面试题
---

两个进程想交换一段数据，最直觉的想法是：A 进程把数据写到自己的内存里，然后 B 进程直接去读就行了。

不过，这在操作系统里行不通。每个进程都有独立的虚拟地址空间，A 进程里的 `0x7f...` 地址和 B 进程里的 `0x7f...` 地址并不是同一块内存。用户态进程之间不能随便互相摸内存，否则权限隔离也没法谈。

所以 **IPC（Inter-Process Communication，进程间通信）** 绕不开操作系统。

不要想得太复杂，我更习惯把 IPC 看成三件事：**怎么传数据、怎么同步控制流、怎么做命名和权限检查**。只记“管道、消息队列、共享内存”这些名字，很容易背完就忘。

![进程地址空间隔离导致进程间通信需要借助内核提供的 IPC 机制](https://oss.javaguide.cn/github/javaguide/java/新特性/ipc-why-ipc.png)

## IPC 到底在解决什么？

![IPC 需要同时解决数据传递、同步控制、命名寻址和权限检查等问题](https://oss.javaguide.cn/github/javaguide/java/新特性/what-problem-does-ipc-solve.png)

**IPC 先解决数据怎么过去。** 管道和字节流 Socket 传连续字节，消息边界由应用约定；消息队列、数据报 Socket、Binder 事务传一条条消息，天然有边界；共享内存让多个进程映射同一块物理内存，映射完成后读写共享区域不需要每次陷入内核。

**它还要解决同步。** 共享内存只解决“看见同一份数据”，不解决“谁先写、谁后读”。多个进程同时改同一个环形队列，如果没有互斥锁、信号量、futex 或条件变量，数据很快就会乱。

**命名和权限也不能少。** 匿名管道靠 `fork` 后继承文件描述符建立关系；FIFO 靠文件系统路径；System V IPC 靠 key 和内核对象 ID；Unix Domain Socket 可以绑定路径，也可以用 Linux 的 abstract namespace；Android Binder 借助 Service Manager 把服务名映射到 Binder 引用。

## 管道：字节流，简单，但边界少

管道（pipe）是最容易遇到的 IPC。Shell 里的 `ps aux | grep java`，中间那个 `|` 就是把前一个进程的标准输出接到后一个进程的标准输入。

Linux 里调用 `pipe()` 会得到两个文件描述符：一个读端，一个写端。父进程创建管道后再 `fork()`，子进程会继承这些文件描述符，于是父子进程就能靠同一条管道传数据。匿名管道没有名字，通常用于有亲缘关系的进程之间。

![管道通过内核缓冲区在父进程和子进程之间传递单向字节流](https://oss.javaguide.cn/github/javaguide/java/新特性/ipc-pipe-flow.png)

管道是单向字节流。POSIX 只要求它单向，双向通信通常建两条管道；它不理解消息边界，写端写了 3 次，读端不一定也读 3 次；缓冲区在内核里，写满后阻塞写会睡眠，非阻塞写可能返回 `EAGAIN`；它也不是普通文件，不能用 `lseek()` 随机定位。

Linux 上还有一个容易被问到的数字：`PIPE_BUF` 是 4096 字节。对管道或 FIFO 来说，单次 `write()` 不超过 `PIPE_BUF` 时，内核保证这次写入不会和其他写者的数据交错；阻塞模式下可能等待缓冲区空间，非阻塞模式下如果空间不足会返回 `EAGAIN`。超过 `PIPE_BUF` 的写入可能被拆分，也可能和其他写者的数据交错。这个保证不代表管道有消息边界。

命名管道（FIFO）用 `mkfifo` 在文件系统里创建一个特殊文件，两个无亲缘关系的进程按路径打开它就能通信。FIFO 有路径名，但数据并不是写进磁盘；路径只是命名入口，真正的数据仍在内核缓冲区里。

管道适合命令行工具串联、父子进程传少量数据。它不适合复杂协议和大对象传输。真要在字节流上做长度前缀、校验和、序列号，很多场景下不如换 Socket 或消息队列。

## 消息队列：内核保存消息，应用少处理切包

消息队列把数据拆成一条条消息存到内核对象里。发送方调用 `msgsnd()` 或 `mq_send()` 把消息放进队列，接收方调用 `msgrcv()` 或 `mq_receive()` 取出来。System V 消息队列和 POSIX 消息队列接口不同，但都属于“内核持有队列，进程按消息读写”的方案。

和管道相比，消息队列最直接的好处是**消息有边界**。System V 消息队列支持按消息类型接收；POSIX 消息队列支持优先级，Linux 上 `sysconf(_SC_MQ_PRIO_MAX)` 常见返回值是 32768，而 POSIX 标准只要求至少支持 0 到 31 这个范围。

代价也很直接：发送时，应用缓冲区的数据被拷进内核队列；接收时，再从内核队列拷回接收进程的用户缓冲区。队列本身也受内核参数限制，比如 POSIX 消息队列有 `/proc/sys/fs/mqueue/msg_max`、`msgsize_max` 等限制项。

所以消息队列适合传结构化小消息，比如任务通知、状态事件、控制命令。它不适合传大块图片、音视频帧或超大的序列化对象。Linux IPC 里的消息队列也不是 Kafka、RocketMQ 那种消息中间件，没有持久化日志、消费组和跨机器复制。

## 共享内存：少拷贝，但同步要自己负责

共享内存的思路很直接：让多个进程把同一块物理内存映射到各自的虚拟地址空间里。映射建立之后，A 进程写这块内存，B 进程就能读到更新。

Linux 上常见两类接口：System V 共享内存用 `shmget()`、`shmat()`、`shmdt()`、`shmctl()`；POSIX 共享内存用 `shm_open()` 创建对象，`ftruncate()` 设置大小，再用 `mmap()` 映射到进程地址空间。

![共享内存让多个进程映射同一块物理内存，但仍需要信号量、futex 等同步机制配合](https://oss.javaguide.cn/github/javaguide/java/新特性/ipc-shared-memory.png)

共享内存快在数据路径短。管道、消息队列、Socket 这类方式通常要把数据先交给内核，再由内核交给另一个进程；共享内存完成映射后，进程读写的是同一片物理页，数据本身不用每次都在用户态和内核态之间搬来搬去。日志采集、音视频处理、数据库缓存这类本机大块数据交换场景，才比较适合把它拿出来用。

不过，映射同一块内存只解决“能不能看见”的问题，不解决“什么时候能读”和“谁可以写”的问题。

以共享环形队列为例，生产者通常会写数据、更新 `tail`，消费者根据 `head` 和 `tail` 判断有没有新数据。如果生产者还没把一条记录写完整，就提前更新了 `tail`，消费者可能马上读到一条半成品。这个问题不能靠共享内存自己解决，需要把写入顺序、可见性和唤醒机制一起设计好：简单一点可以用进程间互斥锁、POSIX 信号量；追求性能时可能会用 `eventfd`、`futex`、原子变量和内存屏障。

还有一个细节很容易踩坑：共享内存里别直接放进程内指针。同一块共享内存在 A 进程里可能映射到 `0x7000...`，在 B 进程里可能映射到 `0x5000...`，A 写进去的地址，B 拿到后大概率没有意义。工程里更常见的写法是保存偏移量、数组下标，或者一开始就约定好固定布局结构。

所以共享内存不能只看拷贝次数。整体性能还会受缓存一致性、锁竞争、内存屏障、唤醒机制和数据布局影响。它适合数据量大、双方都在本机、并且愿意认真处理同步和内存布局的场景；如果只是传几个状态字段或一条控制命令，消息队列、管道、Unix Domain Socket 反而更省心。

## 信号量和信号有什么区别？

信号量（semaphore）经常和共享内存一起出现，但它不负责传业务数据。它更像一个计数器，用来控制有多少进程可以进入某段临界区，或者通知对方“现在有数据可读”。POSIX 信号量可以是命名的，也可以是未命名的；`sem_post()` 会把计数加一，`sem_wait()` 会尝试把计数减一，计数为 0 时调用方会阻塞等待。

信号（signal）更像异步事件通知：`SIGINT` 表示终端中断，`SIGTERM` 表示请求进程退出，`SIGCHLD` 表示子进程状态变化。Linux 支持标准信号和实时信号。信号能携带的信息少，处理函数也受 async-signal-safe 限制，生产代码里常让 signal handler 只修改 `volatile sig_atomic_t` 标志位，或者通过 async-signal-safe 的 `write(2)` 往 self-pipe 写一个字节、往 eventfd 写一个 `uint64_t` 计数值，再由主循环统一处理。

## Socket：本机和跨机器都能用

Socket 不只用于网络通信，也能做本机 IPC。

如果两个进程在不同机器上，基本就得走 TCP/UDP 这类网络 Socket。如果两个进程在同一台机器上，可以用 Unix Domain Socket。它的地址族是 `AF_UNIX` 或 `AF_LOCAL`，支持 `SOCK_STREAM`、`SOCK_DGRAM`、`SOCK_SEQPACKET` 等类型。

Unix Domain Socket 的接口接近网络 Socket，支持无亲缘关系进程通信；Linux 下既可以绑定文件系统路径，也可以使用 abstract namespace。它还可以借助 `sendmsg()` 的辅助数据和 `SCM_RIGHTS` 传文件描述符。对端身份这块，连接型 Unix Socket 常用 `SO_PEERCRED` 获取 pid、uid、gid；数据报场景也可以结合 `SO_PASSCRED` 和 `SCM_CREDENTIALS` 让凭据随消息传过来。

如果问“管道和 Unix Domain Socket 怎么选”，可以这样答：父子进程之间的简单字节流，用管道就够；要双向通信、请求响应、传 fd、服务端监听，Unix Domain Socket 更合适；要跨机器，换 TCP/UDP 或更上层的 RPC 框架。

## Android Binder：把 IPC 做成系统服务调用

![Android Binder 通过 AIDL、Parcel、Binder 驱动和 Service Manager 将 IPC 封装成系统服务调用](https://oss.javaguide.cn/github/javaguide/java/新特性/android-binder-turning-ipc-into-system-service-calls.png)

Android 里最典型的 IPC 是 Binder。应用调用系统服务、不同进程里的 Service 交互、AIDL 生成的远程接口，底层都离不开它。

Binder 有几个设计点值得单独看。AIDL 让客户端和服务端约定接口，Android 工具链生成参数编解码和代理代码；客户端像在调本地方法，实际会把参数打包成 Parcel，交给 Binder 驱动完成跨进程事务。系统里的 Service Manager 会向 Binder 驱动注册为 context manager，负责维护服务名到 Binder 引用的映射。

Binder 事务里可以携带 Binder 对象、handle、fd 等特殊对象。fd 传递让 Binder 可以和共享内存配合：Binder 传控制消息和句柄，大块数据放到共享内存里。Android 官方 AIDL 文档也提醒过：远程调用会从平台维护的 Binder 线程池分发进服务进程，服务实现必须考虑线程安全。

Binder 也不是拿来塞大对象的通道。Android 的 `TransactionTooLargeException` 文档写得很明确：Binder transaction buffer 当前是 1 MB，并且由进程内正在进行的事务共享。这个异常本身也是启发式判断：客户端无法准确知道失败发生在请求发送阶段，还是响应返回阶段。更稳的做法是让 Binder 传小请求、分页结果、fd 或资源标识。

## 微内核为什么特别在意 IPC？

Linux 这种宏内核把文件系统、网络协议栈、驱动等大量能力放在内核里。微内核会把尽可能多的服务移到用户态进程，比如文件系统服务、驱动服务、网络服务。隔离性更好，但 IPC 会变得非常频繁。

应用读一个文件，在宏内核里可能主要是一次系统调用进内核；在微内核里，可能要和文件系统服务、块设备服务多次通信。IPC 慢一点，整个系统都跟着慢。

所以微内核论文和系统实现里，IPC 优化一直是重点。

Mach 的代表设计是 port。port 可以理解成受内核保护的消息队列和能力句柄：任务持有某个 port right，才可以向对应对象发送或接收消息。L4 家族则尽量把常见 IPC 做短：短消息用寄存器传参，同步 IPC 采用 rendezvous 风格，直接进程切换（direct process switch）避免某些路径绕一圈调度器。LRPC（Lightweight Remote Procedure Call）也在做同一件事：减少同机跨保护域调用里的线程、缓冲和调度开销。

## 常见 IPC 怎么选？

选型时别只问“哪个最快”。更好的问题是：数据有多大？需不需要消息边界？通信双方有没有亲缘关系？要不要双向请求响应？要不要跨机器？要不要权限校验和身份识别？

| IPC 方式           | 数据形态               | 是否保留消息边界 | 是否适合大数据     | 是否跨机器       | 典型场景               |
| ------------------ | ---------------------- | ---------------- | ------------------ | ---------------- | ---------------------- |
| 匿名管道           | 字节流                 | 否               | 不适合             | 否               | 父子进程、Shell 管道   |
| FIFO               | 字节流                 | 否               | 不适合             | 否               | 无亲缘关系进程简单通信 |
| 消息队列           | 消息                   | 是               | 不适合             | 否               | 控制命令、状态事件     |
| 共享内存           | 共享区域               | 由应用定义       | 适合               | 否               | 大块本机数据交换       |
| Unix Domain Socket | 字节流、数据报、顺序包 | 取决于类型       | 中等               | 否               | 本机服务监听、传 fd    |
| TCP/UDP Socket     | 字节流或数据报         | 取决于协议       | 取决于协议和实现   | 是               | 跨机器通信             |
| Binder             | 事务、对象引用、fd     | 是               | 不适合直接传大对象 | 否，Android 本机 | Android 系统服务调用   |

![常见 IPC 方式在数据形态、消息边界、大数据传输和跨机器能力上的横向对比](https://oss.javaguide.cn/github/javaguide/java/新特性/ipc-ipc-comparison.png)

父子进程之间传少量字节流，管道够用；无亲缘关系进程需要双向请求响应，Unix Domain Socket 更顺手；小型结构化事件可以用消息队列；大块数据优先考虑共享内存加同步通知；跨机器通信交给 TCP/UDP 或更上层的 RPC；Android 应用跨进程调用则通常走 Binder。

![根据数据量、消息边界、跨机器和进程亲缘关系选择合适的 IPC 方式](https://oss.javaguide.cn/github/javaguide/java/新特性/ipc-ipc-selection.png)

## 面试里怎么答 IPC？

可以这样回答：进程默认不能直接访问彼此的用户态地址空间，所以 IPC 要么让内核代收代发数据，要么让内核创建一份可共享的对象或内存映射。

沿着这条线看，管道、FIFO、Socket 主要传字节流，消息边界通常要由应用协议处理；消息队列保留消息边界，适合较小的任务消息、状态变化和控制命令；共享内存把同一批物理页映射给多个进程，适合本机大块数据交换，但同步和内存布局要自己处理；信号偏事件通知，信号量、互斥锁、`futex` 这类机制更多是配合共享数据做同步。Android Binder 可以看作面向系统服务的本机 RPC/事务通道，常用于跨进程服务调用。

真正做选择时，不是看名字熟不熟，而是看数据量、消息边界、通信范围、双方关系和权限校验。比如父子进程串联命令，管道就够；本机服务要双向请求响应，还想传 fd，Unix Domain Socket 更合适；跨机器通信再考虑 TCP/UDP 或上层 RPC。

如果继续追问“共享内存为什么还需要信号量”，可以这样答：共享内存只是让两个进程看到同一块数据，不保证访问顺序。谁先写、谁后读、写到一半能不能读，都要靠信号量、进程间互斥锁、`futex`、`eventfd` 这类机制约束。

如果追问“Binder 为什么不适合传大对象”，可以补上 Android 官方文档里的 1 MB 事务缓冲限制，并说明这个缓冲由进程内进行中的事务共享。Binder 更适合传方法参数、返回值、对象引用和 fd；大块数据应该拆分、分页，或用共享内存传递。

记 IPC 时不要把它背成一串名词，可以先问这几个问题：数据大不大？要不要保留消息边界？通信双方是不是都在本机？要不要双向请求响应？同步和权限谁来管？这些问题答完，方案基本也就出来了。


---

<!-- source: 操作系统/进程与线程详解-区别、状态、通信、上下文切换与虚拟线程.md -->

---
title: 进程与线程详解：区别、状态、通信、上下文切换与虚拟线程
description: 进程与线程高频面试题总结，从操作系统视角梳理进程和线程的概念、资源模型、状态转换、PCB/TCB、fork/exec/wait、线程模型、上下文切换以及 Java 线程和虚拟线程的关系。
category: 计算机基础
tag:
  - 操作系统
  - 进程线程
  - Java 并发
head:
  - - meta
    - name: keywords
      content: 进程,线程,进程和线程的区别,进程状态,线程状态,PCB,TCB,fork,exec,wait,clone,pthread,上下文切换,线程模型,Java虚拟线程,操作系统面试题
---

进程和线程是操作系统里最基础、也最容易被混着背的两个概念。

面试里问它们的区别，很多回答会停在“进程是资源分配的基本单位，线程是 CPU 调度的基本单位”。这句话可以作为入口，但不够用。

继续往下追，就会遇到一串更具体的问题：为什么进程之间默认隔离？线程到底共享了什么？`fork()` 后父子进程有哪些东西相同、哪些东西已经分开？为什么多线程程序里随便 `fork()` 会出问题？Java 虚拟线程又算不算操作系统线程？

这篇文章就顺着这些问题展开。先把程序、进程、线程的边界讲清楚，再看 Linux 里的 `fork`、`exec`、`wait`、`clone`，最后回到上下文切换、线程模型和 Java 虚拟线程。读的时候可以抓住一条主线：进程更像资源和隔离边界，线程更像一条可以被调度的执行路径。

## 程序、进程和线程分别是什么？

![程序、进程和线程的关系](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/relationship-between-program-process-and-thread.png)

程序是存放在磁盘上的一组指令和数据，比如一个可执行文件、一个 JAR 包。它还没有真正运行，只是静态文件。

当操作系统把程序加载到内存，为它建立虚拟地址空间、文件描述符表等进程级资源，并为初始线程建立栈、寄存器上下文等执行现场后，程序的一次运行就变成了**进程**。同一个程序可以启动多次，对应多个进程；比如同时打开两个终端窗口，通常就是两个不同的进程实例。

线程是进程里的执行流。一个进程至少有一个线程，进程中的多个线程共享这份进程资源，但每个线程也有自己的执行现场。现代操作系统真正拿去调度的通常是线程：哪个线程处于可运行状态，调度器就可能把 CPU 时间片分给它。

可以用一句话先记住大方向：**进程侧重资源边界，线程侧重执行和调度。**

判断一个概念更偏进程还是更偏线程，也可以先问：它描述的是资源边界，还是一条执行路径？地址空间、打开文件表、权限信息更偏进程；栈、寄存器、程序计数器更偏线程。

![用微信工厂类比进程和线程的区别](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/wechat-factory-process-thread.png)

不过这句话只是学习时的抓手，不能当成所有系统的实现细节。比如 Linux 内核内部用 `task_struct` 描述调度实体，进程和线程更像是共享资源程度不同的任务；Windows 文档则明确把线程说成操作系统分配处理器时间的基本单位。不同系统名字不完全一样，但抽象层面的关系大致相通。

## 进程拥有哪些资源？

进程不是只有正在执行的代码。一个进程通常包含这些内容：

- **虚拟地址空间**：进程看到的是一段连续的虚拟内存，里面有代码段、数据段、堆、栈、内存映射区域等。
- **打开的文件和句柄**：比如文件描述符、Socket、管道、设备句柄。
- **安全和身份信息**：比如用户 ID、权限、凭据、安全上下文。
- **调度相关信息**：优先级、CPU 时间统计、亲和性、状态等。
- **信号、环境变量、工作目录等运行上下文**。

进程之间默认是隔离的。一个进程不能随便读写另一个进程的虚拟地址空间，这也是操作系统能把不同程序保护起来的基础。两个进程想交换数据，需要借助管道、消息队列、共享内存、Socket、文件、信号等 IPC 方式。

隔离带来安全，也带来成本。两个进程各自有地址空间和资源表，切换、通信、创建和销毁都比线程更重。

## 进程有哪些常见状态？

教材里常见的五状态模型够应付大多数面试题：

- **创建状态（New）**：进程正在创建，还没有进入就绪队列。
- **就绪状态（Ready）**：运行条件基本具备，只差 CPU。
- **运行状态（Running）**：正在 CPU 上执行。
- **阻塞状态（Blocked/Waiting）**：正在等某个事件，比如 I/O 完成、锁释放、定时器到期。
- **终止状态（Terminated/Exit）**：进程结束，操作系统回收相关资源。

![进程状态图转换图](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/state-transition-of-process.png)

状态转换的关键不在名词，而在触发原因。就绪态拿到 CPU 会变成运行态；运行中的时间片用完，可能回到就绪态；运行中发起阻塞 I/O，会进入阻塞态；阻塞等待的事件完成后，先回到就绪态，等待下一次被调度。

有些教材还会加入**挂起状态**。挂起强调进程暂时不在内存中，或者被用户/系统暂停；阻塞强调它在等待事件。二者不是一回事：一个进程可以阻塞但仍在内存里，也可以被换出到外存后处于阻塞挂起。

## PCB 是什么？

PCB（Process Control Block，进程控制块）是操作系统管理进程的数据结构。进程运行时的许多信息不会散落在空气里，而是由内核放在类似 PCB 的结构里维护。

PCB 通常记录：

- 进程标识信息：PID、父进程 ID、用户 ID 等。
- 进程状态和调度信息：就绪、运行、阻塞、优先级、时间统计。
- CPU 上下文：程序计数器、栈指针、通用寄存器等，方便切换回来继续执行。
- 内存管理信息：页表、虚拟地址空间、内存映射。
- 资源信息：打开文件、信号处理、工作目录、I/O 状态等。

发生上下文切换时，操作系统会把当前执行实体的寄存器等现场保存起来，再恢复下一个执行实体的现场。PCB/TCB 这类结构就是“下次从哪儿继续跑”的依据。

Linux 的实现有一点特别：它把进程和线程都看成 task，`task_struct` 里并不直接塞进所有资源，而是通过指针指向内存描述符、文件表、信号处理等资源结构。多个线程属于同一进程时，它们会指向同一批资源结构；不同进程则指向不同资源。这也是 Linux 上理解 `clone()` 很有用的原因。

## Linux 里 fork、exec、wait 分别做什么？

![fork、exec、wait 的调用链路](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/fork-exec-wait-call-chain.png)

在 Unix/Linux 编程里，进程创建常绕不开 `fork()`、`exec()`、`wait()` 这三个动作。

`fork()` 用来创建子进程。调用成功后，父子进程从同一个位置继续往下执行，只是返回值不同：父进程拿到子进程 PID，子进程拿到 0。父子进程拥有独立的虚拟地址空间，刚创建时内容看起来一样；现代系统一般配合写时复制，只有当某一方写内存时，内核才复制对应页面。

还要注意文件描述符。`fork()` 后，父子进程的文件描述符表是各自的副本，但对应 fd 会指向同一个 open file description，所以文件偏移量、打开状态标志等会共享。工程里常配合 `FD_CLOEXEC` 或 `O_CLOEXEC`，避免 `exec()` 后把不该继承的 fd 泄漏给新程序。

`exec()` 系列函数用于在当前进程里装入另一个程序。它不会新建进程，而是把当前进程的代码、数据、堆、栈等用户态内容替换成新程序。命令行里常见的模型就是：Shell 先 `fork()` 出子进程，子进程再 `exec()` 成目标程序。

`wait()`/`waitpid()` 用来等待子进程状态变化，并回收子进程退出后残留在内核里的状态信息。子进程已经退出但父进程还没有 `wait`，就会留下僵尸进程。僵尸进程不再执行代码，但仍占着 PID 和退出状态记录。

Shell 启动外部命令时，常见链路就是：Shell 调 `fork()` 创建子进程，子进程调 `exec()` 变成目标程序，父进程用 `wait()` 或 `waitpid()` 等待并回收退出状态。

这里有个容易忽略的细节：多线程进程调用 `fork()` 后，子进程里只保留调用 `fork()` 的那个线程。父进程其他线程的锁状态、条件变量状态、malloc 状态、stdio 状态可能被复制过去，但对应线程已经不存在。更严格地说，多线程程序 `fork()` 之后、`exec()` 之前，子进程只应调用 async-signal-safe 的函数；在这段窗口里做复杂逻辑很容易踩坑。

## 线程共享什么，又私有什么？

![线程共享资源和私有执行现场](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/thread-shared-and-private-content.png)

从操作系统角度看，同一进程内的线程共享进程的大部分资源，例如：

- 代码段、数据段、堆等进程地址空间里的内存区域；
- 打开的文件描述符、Socket、工作目录；
- 进程 ID、地址空间、信号处理配置中的一部分；
- 全局变量和堆对象。

如果换到 Java/JVM 语境，Java 线程还会共享同一个 JVM 进程里的堆、方法区/元空间等运行时数据区域。方法区/元空间不是通用操作系统概念，放在 JVM 这一层理解更合适。

在 Linux 用户态，同一进程内的多个线程调用 `getpid()` 通常看到的是同一个线程组 ID，也就是平时说的进程 ID；但每个线程在内核里仍有自己的 task/TID，可以用 `gettid()` 区分。

每个线程也有自己的私有内容：

- 栈：保存函数调用、局部变量、返回地址等。
- 寄存器和程序计数器：记录线程当前执行到哪里。
- 线程 ID、调度优先级、线程本地存储（TLS）。
- 线程状态和少量内核用于恢复执行的上下文信息。

共享让线程间通信很方便，一个线程往堆里的对象写入数据，另一个线程马上就可能看到。但共享也带来数据竞争：多个线程同时读写同一份可变数据，如果没有锁、原子变量、条件变量等同步手段，结果就可能不符合预期。

这也是线程和进程在工程上的重要差别：进程崩溃通常不会直接破坏另一个进程；同一进程内某个线程越界写内存、触发非法访问，往往会把整个进程带走。

## TCB 是什么？

TCB（Thread Control Block，线程控制块）可以理解为线程级别的控制信息。它通常记录线程 ID、线程状态、寄存器现场、栈信息、优先级、线程本地存储等内容。

在一些教材或系统实现里，PCB 和 TCB 是分开的：PCB 负责进程级资源，TCB 负责线程级执行现场。Linux 的 `task_struct` 则把调度实体统一为 task，再按资源结构是否共享来区分进程和线程。概念学习时不必纠结名字，关键是看清哪些信息属于资源边界，哪些信息属于执行现场。

## 有了进程为什么还需要线程？

主要是为了在同一个应用内用更低成本做并发。

如果一个服务端要同时处理网络读写、业务计算、日志刷盘，用多个进程当然也能做，但进程之间共享状态麻烦，通信要走 IPC，资源占用也更高。改成多个线程后，它们能直接共享堆内存和打开的连接，只要同步写对，协作成本低很多。

线程也能提高资源利用率。单核 CPU 上，一个线程阻塞在磁盘或网络 I/O 时，其他线程可以继续运行；多核 CPU 上，多个线程有机会在不同核心上同时执行。CPU 密集型任务、I/O 密集型任务对线程数的需求不同，不能简单理解为线程越多越快。

线程不是免费资源。Linux NPTL 下，如果进程启动时的 `RLIMIT_STACK` 软限制不是 `unlimited`，它会决定新线程的默认栈大小；常见 `ulimit -s` 为 8192 KB，因此常见默认线程栈是 8 MB。如果 `RLIMIT_STACK` 是 `unlimited`，则使用架构相关默认值，例如多数架构为 2 MB。也可以通过 `pthread_attr_setstacksize()` 指定线程栈大小，但不能低于 `PTHREAD_STACK_MIN`，Linux man-pages 给出的值是 16384 字节。除此之外，线程还受 PID 数量、`threads-max`、内存等限制。线上系统里盲目创建大量平台线程，常见后果是内存压力、调度开销和上下文切换增多。

## 用户线程、内核线程和线程模型怎么区分？

按“谁负责调度”来看，线程可以分为用户级线程和内核级线程。

**用户级线程**由用户态运行时或线程库管理，内核通常看不到这些线程。它的好处是创建、切换不一定需要系统调用；问题是如果所有用户线程只对应一个内核调度实体，那么其中一个线程发起阻塞系统调用，可能拖住整个进程，也很难利用多核。

**内核级线程**由操作系统内核创建和调度。某个线程阻塞，内核还能调度同进程的其他线程；多个线程也能在多核上并行执行。代价是创建、销毁、阻塞、唤醒、切换都要内核参与。

常见线程模型有三类：

![常见的三种线程模型](https://oss.javaguide.cn/github/javaguide/java/新特性/process-and-thread-three-thread-models.png)

| 模型   | 含义                           | 优点                       | 主要问题                                   |
| ------ | ------------------------------ | -------------------------- | ------------------------------------------ |
| 多对一 | 多个用户线程映射到一个内核线程 | 用户态切换快，实现成本低   | 一个阻塞可能影响整体，不能充分利用多核     |
| 一对一 | 一个用户线程映射到一个内核线程 | 能利用多核，阻塞影响较小   | 线程数量受系统资源限制，创建和切换成本更高 |
| 多对多 | 多个用户线程映射到多个内核线程 | 在灵活性和并行能力之间折中 | 运行时和调度实现更复杂                     |

Linux 的 POSIX 线程和 Windows 系统线程基本属于一对一模型。Linux 的 `pthread_create()` 底层会使用 `clone()`，并由 `CLONE_VM`、`CLONE_FILES`、`CLONE_FS`、`CLONE_THREAD` 等标志决定共享哪些资源。Linux 上进程和线程并不是两套完全割裂的创建机制，而是 `clone()` 参数不同带来的资源共享差异。

## 线程上下文切换和进程上下文切换有什么不同？

![线程上下文切换和进程上下文切换成本对比](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/context-switch-cost-comparison.png)

上下文切换指 CPU 从一个执行实体切到另一个执行实体。操作系统需要保存当前实体的寄存器、程序计数器、栈指针等现场，再恢复下一个实体的现场。

线程切换和进程切换都会有开销，但进程切换通常更重。原因是进程有独立地址空间，切换时可能涉及页表切换、TLB 失效、缓存局部性下降等成本；同一进程内的线程共享地址空间，切换时通常不需要换整套内存映射。

可以把它简化成两句话：同一进程内的线程切换，主要换线程自己的栈、寄存器、程序计数器等执行现场；跨进程切换除了换执行现场，还可能切换地址空间，并带来 TLB 和缓存局部性的影响。

不过，线程切换也不能只看成“保存几个寄存器”。跨核迁移、锁竞争、缓存行来回失效、线程数量远大于 CPU 核数时，线程调度照样会消耗很多 CPU。性能分析里如果看到大量时间花在调度、锁等待、系统调用和上下文切换上，继续加线程往往只会让情况更差。

## 纤程、协程和虚拟线程算线程吗？

纤程（Fiber）和协程通常运行在用户态，由应用或运行时调度。操作系统真正调度的是承载它们的内核线程，而不是每一个纤程或协程。因此，这类轻量执行单元切换时通常不需要陷入内核，成本可以更低。

但它们不是“免费线程”。如果运行时没有把阻塞 I/O 改造成可挂起、可恢复的形式，一个用户态任务阻塞住承载线程，同一承载线程上的其他任务也会受影响。另外，不同语言、运行时、CPU 架构和调用栈深度都会影响切换成本，不能把某个基准测试里的纳秒数字当成通用结论。

Java 21 引入的虚拟线程就是一个典型例子。它仍然是 `java.lang.Thread`，但不会长期独占一个操作系统线程。虚拟线程运行时会挂载到平台线程（platform thread）上，平台线程再对应底层的系统内核线程；当虚拟线程执行 JDK 支持的可挂起阻塞 I/O 时，JDK 可以先把它卸载下来，让这个平台线程去运行别的虚拟线程。

所以，虚拟线程适合大量“等 I/O”的任务，比如高并发请求、数据库访问、远程调用等。它提升的是并发承载能力和吞吐扩展性，不是让一段 CPU 计算代码跑得更快。CPU 密集型长任务仍然要看 CPU 核数、计算量和调度开销，不能无限量丢给虚拟线程。

虚拟线程、平台线程和系统内核线程的关系：

![虚拟线程、平台线程和系统内核线程的关系](https://oss.javaguide.cn/github/javaguide/java/新特性/virtual-threads-platform-threads-kernel-threads-relationship.png)

还要注意 pinning。以 Java 21 为例，虚拟线程在 `synchronized` 块/方法、native 方法或 foreign function 中执行阻塞操作时，可能无法从承载它的平台线程上卸载，结果就是平台线程也被一起占住，不能去运行其他虚拟线程。少量、短时间的 pinning 不会让程序出错，但频繁、长时间的 pinning 会影响扩展性。后续 JDK 对 `synchronized` 相关的 pinning 做过改进，实际判断时要以当前使用的 JDK 版本为准；native/foreign 调用这类边界仍然需要额外留意。

## 进程和线程的区别怎么总结？

面试里可以从资源、调度、通信、开销、可靠性 5 个角度答。

| 维度          | 进程                                       | 线程                             |
| ------------- | ------------------------------------------ | -------------------------------- |
| 基本定位      | 资源分配和隔离的基本单位                   | CPU 调度和执行的基本单位         |
| 地址空间      | 默认独立                                   | 同一进程内共享                   |
| 私有内容      | PID、地址空间、资源表等                    | 栈、寄存器、程序计数器、TLS 等   |
| 通信方式      | 需要 IPC，如管道、Socket、共享内存         | 可直接读写共享内存，但要同步     |
| 创建/切换成本 | 通常更高                                   | 通常更低                         |
| 故障影响      | 隔离性更好，一个进程崩溃通常不影响其他进程 | 一个线程崩溃可能导致整个进程退出 |

比较完整的回答可以这样组织：

进程是程序运行时的资源容器，拥有独立虚拟地址空间和文件、权限等资源；线程是进程内的执行流，多个线程共享进程资源，但各自保存栈、寄存器、程序计数器等执行现场。进程间隔离更强，通信和切换成本更高；线程间协作更方便，创建和切换通常更轻，但共享内存带来线程安全问题，一个线程出错也可能影响整个进程。

## 常见误区

**误区一：进程并行，线程并发。**

并发和并行描述的是执行关系，不是进程/线程的固定属性。单核上多个进程或线程都只能并发；多核上多个进程或线程都可能并行。

**误区二：线程越多，性能越好。**

线程适合掩盖 I/O 等待，也能利用多核；但线程过多会带来栈内存、调度、锁竞争和缓存失效。CPU 密集型任务通常更接近“核心数附近”的线程配置，I/O 密集型任务才可能需要更多并发执行单元。

**误区三：进程之间完全不能共享内存。**

默认隔离不等于不能共享。共享内存就是专门让多个进程映射同一块物理内存的 IPC 方式，只是程序员需要自己处理同步和生命周期。

**误区四：Java 虚拟线程就是操作系统线程。**

平台线程通常是 OS 线程的薄封装；虚拟线程由 Java 运行时调度，会挂载到平台线程上执行。它们都表现为 `Thread`，但资源模型和调度方式不同。


---

<!-- source: 操作系统/零拷贝详解-mmap、sendfile 与 splice.md -->

---
title: 零拷贝详解：mmap、sendfile 与 splice
description: 零拷贝高频面试题总结，讲清传统 read/write、mmap、sendfile、splice 的拷贝路径、上下文切换、SG-DMA、Java NIO、Kafka 和 RocketMQ 的应用场景。
category: 计算机基础
tag:
  - 操作系统
  - Linux
  - 高性能
head:
  - - meta
    - name: keywords
      content: 零拷贝,mmap,sendfile,splice,SG-DMA,Page Cache,Java NIO,FileChannel,transferTo,Kafka,RocketMQ,操作系统面试题
---

面试里有个很常见的套路：先问你“Kafka 为什么快”“RocketMQ 为什么扛得住堆积”，等你答出顺序写、Page Cache、零拷贝之后，面试官顺势往下挖：“零拷贝具体省掉了哪几次拷贝？”“mmap 和 sendfile 有什么区别？”“splice 又是干嘛的？”

到这一步，很多人就开始打太极了。能背出“零拷贝就是不经过用户态”的不少，能把四次拷贝、两次 DMA、几次上下文切换的账算清楚的不多。

这篇文章就从一次文件发送说起：**传统 I/O 会拷几次，零拷贝的“零”到底省在哪，mmap、sendfile、splice 三条路线分别省了什么，又各自要付出什么代价。**

在文章正式开始之前，我们需要把计算口径定下来。

后面提到“几次拷贝、几次切换”时，默认按下面这个简化模型来算。换了场景，数字就会变：

- 场景是把一个普通文件通过 TCP socket 发出去，且数据初始不在 Page Cache 里（需要真正读盘）。
- 不涉及 TLS 加密、压缩、格式转换这类要在用户态碰数据的处理。
- 设备支持常见的 DMA 与 scatter-gather。
- 数到的“拷贝次数”只算数据本身（payload），不含描述符、元数据。
- 下文说的“上下文切换”，准确讲是**用户态和内核态之间的模式切换**（一次系统调用进出各算一次），它和线程被调度器换上换下的“线程上下文切换”不是一回事；只有系统调用真的阻塞、线程被换出时，才会额外发生线程上下文切换。

Page Cache 命中、走 TLS、硬件不支持 SG-DMA，这些数字都会变。这里的假设只是为了把机制看清楚，别把数字当成所有环境里的固定答案。

## 传统 read/write 到底拷了几次

先看一个最常见的场景：一个文件下载接口，服务端要把磁盘上的文件，通过已经建立好的 socket 发给客户端。最直接的写法就是一个 read 加一个 write：

```c
while ((n = read(file_fd, buf, BUF_SIZE)) > 0)
    write(socket_fd, buf, n);
```

看着只有两行，底层却折腾得不轻。一次完整的“读磁盘 + 发网络”，CPU 和 DMA 一共要搬四趟数据，用户态和内核态之间还要来回切四次。

![传统 read/write 的数据拷贝路径：磁盘到内核缓冲区、内核到用户缓冲区、用户到 Socket 缓冲区、Socket 到网卡](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/zero-copy-traditional-read-write.png)

把这两行拆开看，read 这一半发生了什么：

1. 应用进程调用 read，发起系统调用，**上下文从用户态切到内核态**（第 1 次切换）。
2. DMA 控制器把数据从磁盘读进内核读缓冲区（第 1 次拷贝，DMA 拷贝）。
3. CPU 把内核读缓冲区的数据拷到用户缓冲区（第 2 次拷贝，CPU 拷贝），**上下文切回用户态**（第 2 次切换），read 返回。

write 这一半是对称的：

4. 应用进程调用 write，发起系统调用，**上下文切到内核态**（第 3 次切换）。
5. CPU 把用户缓冲区的数据拷到 socket 缓冲区（第 3 次拷贝，CPU 拷贝）。
6. DMA 把 socket 缓冲区的数据拷到网卡（第 4 次拷贝，DMA 拷贝），**上下文切回用户态**（第 4 次切换），write 返回。

数一下：**4 次模式切换，4 次数据拷贝**，其中 2 次是 DMA 拷贝、2 次是 CPU 拷贝。（严格说，`write` 把数据复制进 socket 发送缓冲区后通常就返回了，网卡的排队、分段和 DMA 发送是协议栈异步完成的，并不需要等 DMA 真正发完才切回用户态。这里把它画进一次调用里，只是为了把账算齐。）

这里插一句 DMA（Direct Memory Access，直接内存访问）。它是设备控制器或系统里的 DMA 引擎提供的能力，能在外设和内存之间直接搬数据，全程基本不用 CPU 盯着（现代硬件里它通常集成在设备控制器、SoC 或芯片组中，未必是一块独立芯片）。磁盘到内核缓冲区、socket 缓冲区到网卡这种纯体力活交给它，CPU 就能腾出手算别的，所以 DMA 拷贝并不烧 CPU。

真正难受的是那两次 **CPU 拷贝**。数据从内核读缓冲区拷到用户缓冲区，再从用户缓冲区原样拷回 socket 缓冲区，可我们这个下载接口压根没碰过它的内容，数据只是路过用户空间打了个转。CPU 全程在做无意义的搬运，外加四次切换的寄存器保存恢复开销。高并发、大文件场景下，这部分浪费会被放大得很明显。

零拷贝要省的，就是这部分。

## 零拷贝的“零”，零的是哪个拷贝

先纠正一个常见误解：零拷贝不是真的一次拷贝都没有。

在本文设定的“文件未命中 Page Cache，再通过 TCP 发出”的模型里，数据仍要经历磁盘到内存、内存到网卡这两段 DMA 搬运。**零拷贝省掉的是 CPU 在内存之间复制 payload 的工作，并可能减少用户态和内核态之间的模式切换。** 换成 Page Cache 已命中、设备直接访问持久内存等场景，搬运次数还会变化。

所以零拷贝更精确的定义是：在 I/O 操作中让 CPU 不再参与数据在内存之间的复制，从而减少 CPU 拷贝和用户态/内核态切换的次数。它是一类技术的统称，下面三条路线都是在围着“怎么干掉 CPU 拷贝”做文章。

## 路线一：mmap + write

第一个思路来自虚拟内存。现代操作系统用虚拟地址替代物理地址，这里有个关键特性：**多个虚拟地址可以指向同一块物理内存**。

mmap 用的正是这一点。它的函数签名长这样：

```c
void *mmap(void *addr, size_t length, int prot, int flags, int fd, off_t offset);
```

其中 fd 是要映射的文件描述符，length 是映射长度，offset 是文件偏移。调用之后，内核读缓冲区会和用户空间的一段虚拟地址映射到同一块物理内存上。换句话说，内核缓冲区和用户缓冲区“共享”了同一份数据，不再各存一份。

于是原来的 read + write 就变成了 mmap + write。这里要先破除一个常见误区：**`mmap` 调用本身只是建立文件到一段虚拟地址的映射，并不会立刻把文件读进内存**。真正的读盘发生在后面访问到尚未驻留的映射页、触发缺页异常时，由内核从 Page Cache（没有就从磁盘）按页加载。流程大致是：

1. 应用进程调用 `mmap`，内核建立文件到虚拟地址区间的映射，进出内核态各一次，调用返回。此时还没有任何文件数据被搬进来。
2. 后续访问这段映射区（典型是把它当作 `write` 的数据源），首次碰到未驻留的页就触发缺页异常；若 Page Cache 里没有该页，DMA 把数据从磁盘读进 Page Cache（DMA 拷贝）。
3. 页表建立映射后，这段内核 Page Cache 页同时映射进了用户地址空间，两边共享同一份物理内存。
4. 应用调用 `write`，CPU 把这份数据从内核 Page Cache 拷进 socket 缓冲区（CPU 拷贝）——因为共享物理内存，省掉了传统方式里“内核到用户、再回内核”那次多余的 CPU 拷贝。
5. DMA 把 socket 缓冲区的数据发往网卡（DMA 拷贝），`write` 返回。

![mmap + write 的数据拷贝路径：Page Cache 与 mmap 映射区共享物理内存，再复制到 Socket 缓冲区](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/zero-copy-mmap-write.png)

算账（缓存未命中、走完整路径时）：大致 **2 次 DMA + 1 次 CPU 拷贝**；切换上 `mmap` 一次、`write` 一次，外加首次访问的缺页处理。和传统方式比，mmap 干掉的是“内核到用户”那次 CPU 拷贝。

所以“mmap + write 固定是 4 次切换、3 次拷贝”只能当教学简化模型——Page Cache 命中与否、缺页发生在哪，都会让真实数字浮动。

mmap 还有个附带好处：用户进程不必再维护一份和 Page Cache 内容重复的用户态读缓冲区，省掉了这块额外的缓冲和复制。至于到底省多少物理内存，取决于处理窗口、缓冲区大小和访问模式，不能一概而论说“省一半”。

不过 mmap 不是没有坑。映射本身有成本，建立和拆除页表、处理缺页异常都要花时间，文件很小的时候，这点开销摊下来可能比老老实实 read/write 还慢，所以 mmap 更适合大文件、反复读写。还有个更隐蔽的雷：如果你映射的文件被另一个进程截断（truncate），你再去访问被截掉的那段映射区，会直接吃一个 SIGBUS 信号，程序当场挂掉。这类问题在生产环境里排查很费劲，用 mmap 时得心里有数。

## 路线二：sendfile

mmap 省了一次 CPU 拷贝，但它仍然绕不开 `mmap` 和 `write` 两类系统调用；如果只是把文件原样发出去，能不能用一次系统调用把内核内的数据传输做完？

Linux 2.1 内核引入的 sendfile 就是干这个的：

```c
ssize_t sendfile(int out_fd, int in_fd, off_t *offset, size_t count);
```

- in_fd：数据来源，必须是支持 mmap 式读取的对象（通常是普通文件），不能是 socket。
- out_fd：数据去向，在 Linux 2.6.33 之前只能是 socket，之后可以是任意文件。具体限制要绑定内核版本看。
- offset：从文件哪个位置开始读，传 NULL 表示用文件当前偏移。
- count：传输多少字节。

它的语义是：在两个文件描述符之间直接传数据，整个过程都在内核里完成，数据完全不经过用户空间。流程缩短成：

1. 应用进程调用 sendfile，**切到内核态**（第 1 次模式切换）。
2. DMA 把数据从磁盘拷到内核读缓冲区（DMA 拷贝）。
3. CPU 把内核读缓冲区的数据拷到 socket 缓冲区（CPU 拷贝）。
4. DMA 把 socket 缓冲区的数据拷到网卡（DMA 拷贝），**切回用户态**（第 2 次模式切换），sendfile 返回。

算账：**2 次模式切换，3 次数据拷贝（2 次 DMA + 1 次 CPU）**。

对比 mmap，sendfile 的核心优势是把文件到 socket 的转发收进一次系统调用里，通常少了一轮用户态/内核态来回；代价是数据全程在内核里走，用户态不能直接处理这份数据。如果传输前需要修改内容，sendfile 就不合适，应改用 mmap、普通 read/write 或其他会让数据进入用户态的处理方式。

走到这里还剩一次 CPU 拷贝（内核读缓冲区到 socket 缓冲区）。能不能连这一次也干掉？

## 路线三：sendfile + SG-DMA（真正的零拷贝）

Linux 2.4 给 sendfile 做了升级，关键是引入了 SG-DMA（scatter/gather DMA，分散/聚集 DMA）。这项硬件能力让 DMA 可以直接从内核读缓冲区把数据搬到网卡，不必先经过 socket 缓冲区。

升级后的流程：

1. 应用进程调用 sendfile，**切到内核态**（第 1 次模式切换）。
2. DMA 把数据从磁盘拷到内核读缓冲区（DMA 拷贝）。
3. CPU 不再拷贝数据本身，只把这份数据在内核缓冲区里的**描述信息**（内存地址 + 偏移量长度）写进 socket 缓冲区。
4. SG-DMA 根据这些描述信息，直接把数据从内核读缓冲区搬到网卡（DMA 拷贝），**切回用户态**（第 2 次模式切换），sendfile 返回。

![sendfile + SG-DMA 的数据拷贝路径：Socket 缓冲区只保存描述信息，网卡通过 SG-DMA 直接读取内核缓冲区](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/zero-copy-sendfile-sg-dma.png)

算账：**2 次模式切换，2 次数据拷贝，且两次都是 DMA 拷贝，payload 的 CPU 拷贝为 0**。

这才是名副其实的零拷贝：全程没有任何一次靠 CPU 搬运 payload，磁盘到网卡完全由 DMA 完成。第 3 步 CPU 写的那点描述信息只是几个字节的元数据，不算数据拷贝。不过能不能真走到这条路径有前提：网卡得支持 scatter-gather、内核版本够、协议栈中途不需要碰数据。一旦开启用户态 TLS 加密、要做格式转换，内核就得真正读到 payload，这条 0 CPU 拷贝的路就走不通了。

## 路线四：splice

sendfile 已经很好了，但它有个硬限制：in_fd 得是支持 mmap 式读取的对象（通常是普通文件），不能是 socket，out_fd 早期也只能是 socket。如果想在两个 socket 之间、或者更一般的两个描述符之间做零拷贝转发，sendfile 就不够用了。

Linux 2.6.17 内核引入的 splice（由 Jens Axboe 提交，需要 glibc 2.5 支持）补上了这块。它的思路是借道**管道（pipe）**：

```c
ssize_t splice(int fd_in, loff_t *off_in, int fd_out, loff_t *off_out,
               size_t len, unsigned int flags);
```

splice 要求 fd_in 和 fd_out 中**至少有一个是管道**。它为什么要绑着管道？因为 Linux 的管道底层是一组**引用计数的页指针**：管道缓冲区里存的不是数据本身，而是指向内核内存页的指针，外加每页的引用计数。所谓“把数据从管道挪到另一端”，多数情况下只是复制指针、给对应的页引用计数加一，不真正搬动 payload。要提醒的是，`SPLICE_F_MOVE` 只是给内核的一个提示，并非硬保证——遇到某些文件系统、设备或缓冲区形态无法直接移动页时，内核仍可能退化成真正的复制。

用 splice 实现文件到 socket 的传输，得**两步走、两次系统调用**：

```c
splice(file_fd, NULL, pipe_w, NULL, len, SPLICE_F_MOVE);   // 文件 → 管道写端
splice(pipe_r, NULL, socket_fd, NULL, len, SPLICE_F_MOVE); // 管道读端 → socket
```

![splice 的数据转发路径：文件页先挂到管道缓冲区，再从管道转发到 Socket](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/zero-copy-splice-flow.png)

第一次把 Page Cache 里的页挂到管道缓冲区上，第二次把这些页指针当作网络包的分片发往 socket。数据全程不进用户空间，CPU 不搬运 payload。但要看清楚：这是**两次 `splice` 调用**，进出内核态各算一次，合计大约 4 次模式切换，并不是有些文章说的“和 sendfile 一样只有一次系统调用、两次切换”。实际工程里两个 fd 还得设非阻塞、配合 epoll，并处理短传输和 `EAGAIN`。

splice 和前面几位的区别可以这么理解：

- **比 sendfile 通用**：sendfile 更专注于内核内 fd 到 fd 的传输（典型是文件到 socket）；splice 借助管道，能在更广的描述符之间转发数据，包括 socket 到 socket。有些内核版本内部会复用相关实现，但两者是独立的系统调用，参数限制和演进各不相同，别简单理解成严格的父子继承关系。
- **和 mmap 取向相反**：mmap 把数据映射到用户空间，让你能改；splice 的全部意义就在于数据压根不碰用户空间，你看不见也改不了。

补一个版本细节：在 Linux 2.6.30 及更早，fd_in 和 fd_out 必须恰好有一个是管道；从 2.6.31 开始，两端可以都是管道。

## 四种方式横向对比

把上面四条路线放一起看，账就一目了然了：

| 方式                       | CPU payload 拷贝         | DMA 拷贝 | 模式切换                               | 典型系统调用           |
| -------------------------- | ------------------------ | -------- | -------------------------------------- | ---------------------- |
| 传统 read + write          | 2                        | 2        | 4                                      | read + write           |
| mmap + write               | 1                        | 2        | 映射后发送通常至少 2，首次访问另有缺页 | mmap 一次 + write 多次 |
| sendfile                   | 0 或 1（取决于发送路径） | 通常 2   | 2                                      | sendfile               |
| splice（文件→管道→socket） | 通常可避免               | 通常 2   | 4                                      | splice 两次            |

![传统 read/write、mmap + write、sendfile + SG-DMA 和 splice 的拷贝次数与模式切换对比](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/zero-copy-four-ways-comparison.png)

（mmap 那行的拷贝/切换次数随 Page Cache 命中与缺页时机浮动，不宜钉成固定值；sendfile 在网卡支持 SG-DMA 时，CPU payload 拷贝降到 0。）

两个结论：

**第一，在本文的 cache miss 文件到 TCP 模型里，2 次 DMA 搬运仍然存在。** 它们分别对应“磁盘到内存”和“内存到网卡”。零拷贝主要减少的是 CPU payload 拷贝和模式切换；换一个 I/O 场景，不能继续照搬这个固定数字。

**第二，选哪条路，先看数据要不要被应用碰一下。** 传输前要改内容，用 mmap 更顺手；只是把文件原样发出去，sendfile 更合适，网卡支持 SG-DMA 时还能把 CPU payload 拷贝压到 0。splice 的位置更靠后：只有文件到 socket 之外的 fd 转发需求，比如 socket 到 socket，才值得把管道这层搬出来，同时也要接受两次系统调用的成本。

零拷贝也不是开关一拧就永远赚。开了 TLS、要压缩、要做格式转换，payload 迟早要进用户态处理；内容过滤、加水印、限速也是同一类问题。文件很小或者访问很随机时，映射、缺页、管道这些固定开销可能反而更显眼。

mmap 还要小心文件被 truncate 后访问旧映射触发 SIGBUS；零拷贝发送量很大时，Page Cache 被挤占、内存回收变重，也会把收益吃掉一部分。

## Java 里怎么用零拷贝

Java NIO 里能直接碰到的，主要就是 mmap 和 sendfile 这两条线。

**MappedByteBuffer 对应 mmap。** 用 `FileChannel.map` 拿到 `MappedByteBuffer` 后，文件（或文件的一部分）会被映射到内存里。后面读写这段 buffer，操作的就是映射区，不再像普通 `read/write` 那样先把数据拷进 JVM 自己维护的缓冲区：

```java
FileChannel channel = FileChannel.open(
        Paths.get("./data.bin"),
        StandardOpenOption.READ, StandardOpenOption.WRITE);
// 把文件映射到内存，底层是 mmap
MappedByteBuffer buffer = channel.map(
        FileChannel.MapMode.READ_WRITE, 0, channel.size());
```

**FileChannel.transferTo / transferFrom 更接近 sendfile 这条线。** 但这里别把 Java API 和 `sendfile` 直接画等号：`transferTo` 只承诺把字节写到目标 Channel，底层怎么传，要看 JDK、操作系统和目标 Channel 类型。目标是已连接的 `SocketChannel`，并且平台支持时，JDK 才可能走内核里的零拷贝传输；换成普通文件或其他 Channel，就可能走别的实现，甚至退回用户态复制。所以下面这个示例把目标写成 `SocketChannel`：

```java
FileChannel source = FileChannel.open(
        Paths.get("./in.dat"), StandardOpenOption.READ);
// socketChannel 是一条已连接的 SocketChannel
// 文件 → socket，JDK 在支持的平台上可能使用零拷贝优化（如 sendfile）
source.transferTo(0, source.size(), socketChannel);
```

这里有个容易踩的坑：`transferTo` 不保证一次就传完，调用方必须根据返回值循环处理剩余数据。底层若走 Linux `sendfile`，单次上限是 `0x7ffff000`（约 2 GB）字节；但 Java 层暴露的具体上限、以及到底走没走零拷贝路径，都要结合 JDK 版本和目标平台验证——比如 Windows 上的行为就和 Linux 不完全一致。

## Kafka 和 RocketMQ 各用了哪一种

零拷贝最常被拿来解释 Kafka、RocketMQ 为什么快，但这两家选的路线其实不一样，背后是各自读写模式的差异。

**Kafka 消费端用零拷贝发送。** 消费者来拉消息时，Kafka 要把日志段文件（log segment）从磁盘发到网络，这是典型的“只转发、不修改内容”，于是它用 `FileChannel.transferTo` 把日志直接从 Page Cache 送进 socket，数据不进 JVM 堆。再叠加生产端的顺序写和 Page Cache，高吞吐就是这么攒出来的。（顺带一提，Kafka 的索引文件用的是 mmap。）但零拷贝不是无条件生效：一旦需要做消息格式转换、解压重压缩，或开启了 TLS 要在用户态加密，payload 就得被读出来处理，这条路径会退化——能不能用零拷贝，要结合 Kafka、JDK 和操作系统版本判断。

**RocketMQ 主要走 mmap。** RocketMQ 的 CommitLog 用 MappedByteBuffer 做内存映射来读写文件，这也是它把 CommitLog 设计成固定大小文件的原因之一，固定大小便于映射管理。选 mmap 而不是 sendfile，是因为它的读写模式需要更灵活地操作映射出来的这段内存，而不只是把文件原样转发出去。

一句话区分：**单纯转发选 sendfile，需要操作映射内存选 mmap**，这正好呼应前面那条“要不要改数据”的判断标准。

## 延伸：Rust 的 zerocopy crate 是另一回事

搜"zerocopy"很容易搜到 Google 维护的一个 Rust 库 [google/zerocopy](https://github.com/google/zerocopy)，由 Google 工程师持续维护，下载量很大、活跃度没问题。它的版本号更新很快（写作时已到 0.8.x 系列），这里就不钉死某个具体数字了，以 crates.io 和 GitHub Release 为准。

但要提醒一句：**这个 crate 和本文讲的操作系统零拷贝不是一个概念**，别混淆。OS 层面的零拷贝说的是 I/O 过程中减少 CPU 在内核/用户缓冲区之间的数据搬运；而 Rust 的 zerocopy crate 解决的是**类型安全的内存转换**，在字节序列和结构体之间做安全转换（safe transmutation），不必拷贝、也不写 unsafe。两者都叫"zero copy"，一个在讲系统调用和 DMA，一个在讲语言层面的内存布局与类型安全，别在面试里混为一谈。

## 面试里怎么答？

面试里问“零拷贝是什么”，先把“零”说准：它不是没有任何拷贝，磁盘到内存、内存到网卡这两段 DMA 搬运通常还在；零拷贝主要省的是 CPU 在内核缓冲区和用户缓冲区之间搬 payload 的那几次，以及随之减少的模式切换。

传统 `read + write` 可以按 4 次拷贝来讲：磁盘到内核缓冲区是 DMA，内核到用户缓冲区是 CPU，用户缓冲区到 Socket 缓冲区还是 CPU，Socket 缓冲区到网卡是 DMA。这里最浪费的是两次 CPU 拷贝，因为应用并没有改数据，只是让数据经过用户空间转了一圈。

几种方案的回答顺序可以这么排：`mmap + write` 让用户空间和 Page Cache 映射同一批物理页，省掉“内核到用户”那次 CPU 拷贝，但还要 `write` 到 Socket 缓冲区；`sendfile` 把文件到 socket 的转发放进一次系统调用，数据不进用户态；配合 SG-DMA 时，Socket 缓冲区只放描述信息，payload 可以直接由 DMA 从内核缓冲区送到网卡；`splice` 则借助 pipe 传递页引用，更适合一般 fd 之间的转发，但通常要两次系统调用。

如果面试官把话题拉到 Kafka、RocketMQ，答案也不要混。Kafka 消费端把日志段文件原样发给消费者，适合走 `FileChannel.transferTo` 这类 sendfile 路线；RocketMQ 的 CommitLog 需要更灵活地读写映射内存，所以更常和 mmap 绑定。再补一句边界：TLS、压缩、格式转换、内容过滤这些场景需要应用真正处理 payload，零拷贝路径就会退化。


---

<!-- source: 操作系统/死锁详解-四个必要条件、Java 死锁排查与数据库死锁处理.md -->

---
title: 死锁详解：四个必要条件、Java 死锁排查与数据库死锁处理
description: 死锁高频面试题总结，从死锁定义和四个必要条件讲起，结合 Java synchronized、ReentrantLock、ThreadMXBean、jstack、jcmd、JConsole 以及 PostgreSQL、MySQL 数据库死锁排查与事务重试实践。
category: 计算机基础
tag:
  - 操作系统
  - Java 并发
  - 数据库
head:
  - - meta
    - name: keywords
      content: 死锁,Deadlock,死锁四个必要条件,Java死锁,线程死锁,synchronized,ReentrantLock,ThreadMXBean,jstack,jcmd,JConsole,数据库死锁,MySQL死锁,PostgreSQL死锁,操作系统面试题,Java并发面试题
---

线程 A 已经拿到了资源 1，线程 B 也拿到了资源 2。接下来，线程 A 想继续往下走，需要资源 2；线程 B 想继续往下走，又需要资源 1。

两个线程都没抛异常，也不是 CPU 把机器打满了。线上看到的现象可能只是几个请求一直不返回，线程池里的工作线程慢慢被占住。

这类问题麻烦就麻烦在这里：程序没有“算错”，而是卡在一条自己解不开的等待链上。

线程死锁说的就是这种情况：一组线程互相等对方释放资源，等待关系绕成闭环，参与其中的线程都没办法靠自己继续执行。

如果这些线程正好承载订单、支付、库存这类关键流程，外部看到的就不只是某个线程 `BLOCKED` 了，而是接口超时、队列堆积，甚至进程迟迟退不干净。

![死锁场景示意图：线程 A 持有 resource1 并等待 resource2，线程 B 持有 resource2 并等待 resource1，等待链形成闭环](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/dead-lock-deadlock-scenario.png)

把范围放大一点，死锁不只属于 Java 线程。进程、数据库事务、分布式任务，只要互相占着资源再继续等待，都可能卡成同样的形状。这里的资源也不一定是操作系统教材里的打印机、磁带机，它可以是 Java 对象监视器、`ReentrantLock`、数据库行锁、分布式锁、连接池里的连接、线程池里的工作线程，甚至是管道缓冲区。

后面会用 Java 代码演示，是因为这类例子最容易复现。但要记住，死锁不是 Java 专属的问题。只要系统里同时出现独占资源、持有后继续等待、资源不能被强制剥夺、等待关系成环，线程、进程和事务都会踩进去。

如果你想先把 mutex、semaphore、condition variable、futex 这些同步原语的职责边界理清楚，可以先看：[操作系统锁与同步机制详解：mutex、semaphore、condition variable、spinlock 与 futex](./操作系统锁与同步机制详解-mutex、semaphore、condition variable、spinlock 与 futex.md)。这篇死锁专题会把重点放在等待关系怎么成环，以及线上怎么排查和恢复。

这篇文章按排查时更常用的顺序来讲：先看等待环怎么形成，再看四个必要条件、Java 复现代码、资源分配图、处理策略，最后落到线上该怎么抓线程栈、怎么看数据库锁。

## 死锁是怎么卡住的？

先看并发编程里最常见的场景。系统里有两个线程和两份资源：

- 线程 A 先拿到资源 1，再去申请资源 2。
- 线程 B 先拿到资源 2，再去申请资源 1。

如果两个线程刚好交错执行，就会出现下面这个状态：

- 线程 A 持有资源 1，等待资源 2。
- 线程 B 持有资源 2，等待资源 1。

线程 A 想继续运行，必须等线程 B 释放资源 2；线程 B 想继续运行，又必须等线程 A 释放资源 1。两边都在等对方先动，但谁都没有继续执行到释放资源的机会。

所以，死锁和“等得久”不是一回事。普通阻塞还有自然恢复的机会：别的线程释放锁，事务提交，网络 I/O 返回，后面的线程就能继续跑。死锁里多了一个环，环上的每个参与者都在等别人先释放资源。

还有一个排查时很容易误判的点：**死锁不一定伴随高 CPU**。很多时候线程只是安静地停在 `BLOCKED` 或 `WAITING`，CPU 反而很低。接口超时、线程池占满、数据库连接耗尽时，CPU 只能作为线索之一，不能当成唯一判断依据。

## 死锁的四个必要条件

操作系统教材通常会讲 Coffman 条件。死锁要发生，下面 4 个条件必须同时成立：

| 条件                     | 含义                                     | 对应到 Java 或数据库                          |
| ------------------------ | ---------------------------------------- | --------------------------------------------- |
| 互斥                     | 某个资源同一时刻只能被一个执行单元占用   | `synchronized` 锁对象、行级排他锁、独占文件锁 |
| 请求与保持（占有并等待） | 已经拿着一部分资源，同时继续等待其他资源 | 线程持有 `resource1` 时继续申请 `resource2`   |
| 非抢占                   | 资源不能被外部强行拿走，只能由持有者释放 | Java 内置锁不能被另一个线程直接剥夺           |
| 循环等待                 | 等待关系形成闭环                         | 线程 1 等线程 2，线程 2 又等线程 1            |

![死锁四个必要条件示意图：互斥、请求与保持、非抢占、循环等待同时成立才会形成死锁](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/dead-lock-four-conditions.png)

这张表不要当成“满足其中一条就死锁”的清单。它真正表达的是：四项同时出现，死锁才具备发生条件；少掉任意一项，等待环就很难闭合。

写业务代码时，最容易下手的是第 2 条和第 4 条。

互斥通常绕不开。同一行库存、同一个账户余额、同一段共享内存，本来就不能让多个线程同时乱写。非抢占也不好硬改，锁保护的往往是一段尚未完成的状态，粗暴抢走可能留下半成品。相比之下，让线程一次拿齐资源，或者规定所有入口都按同一顺序拿锁，更容易变成团队能执行的代码规范。

## 用 Java 复现一个死锁

下面这段代码就是把图 1 写成 Java。两个 `Object` 分别充当资源 1 和资源 2，两个线程按相反顺序进入 `synchronized`。

`Thread.sleep(1000)` 不是死锁的原因，它只是把两个线程交错执行的窗口拉大，让问题更容易复现。

```java
public class DeadLockDemo {
    private static final Object resource1 = new Object();
    private static final Object resource2 = new Object();

    public static void main(String[] args) {
        new Thread(() -> {
            synchronized (resource1) {
                System.out.println(Thread.currentThread() + "get resource1");
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                System.out.println(Thread.currentThread() + "waiting get resource2");
                synchronized (resource2) {
                    System.out.println(Thread.currentThread() + "get resource2");
                }
            }
        }, "线程 1").start();

        new Thread(() -> {
            synchronized (resource2) {
                System.out.println(Thread.currentThread() + "get resource2");
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                System.out.println(Thread.currentThread() + "waiting get resource1");
                synchronized (resource1) {
                    System.out.println(Thread.currentThread() + "get resource1");
                }
            }
        }, "线程 2").start();
    }
}
```

比较典型的一次输出是：

```text
Thread[线程 1,5,main]get resource1
Thread[线程 2,5,main]get resource2
Thread[线程 1,5,main]waiting get resource2
Thread[线程 2,5,main]waiting get resource1
```

程序到这里就停住了。`sleep()` 早晚会结束，真正卡住的是第二层 `synchronized`：线程 1 进不去 `resource2`，线程 2 进不去 `resource1`。

把现场对回前面的四个条件：

- 互斥：`resource1` 和 `resource2` 同一时间只能被一个线程持有。
- 请求与保持：线程 1 拿着 `resource1` 等 `resource2`，线程 2 拿着 `resource2` 等 `resource1`。
- 非抢占：Java 不会强制把 `resource1` 从线程 1 手里拿走。
- 循环等待：线程 1 等线程 2，线程 2 又等线程 1。

四个条件都对上了，剩下的就是调度时序。也正因为触发依赖时序，有些死锁在线上不是每次都能复现，压测跑十次可能只有一两次卡住。

**怎么改这段代码才能没有死锁问题？**

最直接的修法是把加锁顺序固定下来。所有线程都先拿 `resource1`，再拿 `resource2`，等待链就没有机会绕回起点。

```java
public class OrderedLockDemo {
    private static final Object resource1 = new Object();
    private static final Object resource2 = new Object();

    public static void main(String[] args) {
        Runnable task = () -> {
            synchronized (resource1) {
                System.out.println(Thread.currentThread() + "get resource1");

                synchronized (resource2) {
                    System.out.println(Thread.currentThread() + "get resource2");
                }
            }
        };

        new Thread(task, "线程 1").start();
        new Thread(task, "线程 2").start();
    }
}
```

这个改法破坏的是“循环等待”。只要所有代码路径都遵守同一个顺序，就不会出现 A 等 B、B 又等 A 的闭环。

难点在“所有代码路径”。小例子里只有两个锁，一眼就能看完；业务系统里，锁可能散在订单、库存、支付几个模块里。A 链路先拿订单锁再拿库存锁，B 链路先拿库存锁再拿订单锁，单独看每个方法都像是合理的，组合起来才出问题。

实际项目里，我更建议把下面几条写进并发代码的检查清单：

- 资源要有稳定顺序。可以按业务 ID、数据库主键、账户号这类不会变的值排序，别依赖对象哈希这种不适合表达业务顺序的东西。
- 锁内只做必要的状态修改。RPC、慢 SQL、文件 I/O 这类操作尽量放到锁外，否则一次慢调用就会把等待链拉长。
- 拿不齐资源就退出来。已经拿到 A、拿不到 B 时，释放 A 后重试，比拿着 A 一直等 B 更安全。
- 业务允许失败时，用 `tryLock(timeout, unit)` 给等待加上上限，别让线程无限挂住。
- 如果两把锁总是一起出现，考虑合成一把更粗的锁。并发度会下降，但换来的是更容易证明的正确性。

最后这一条看起来有点“退步”，但工程里经常有用。锁拆得太细不一定更高级；如果几份状态天然强相关，拆开反而会给死锁留出空间。

## 资源分配图和等待图

操作系统教材里常用资源分配图来画死锁。图里其实就两类东西：

- 进程或线程节点。
- 资源节点。

箭头也分两种：

- 从线程指向资源，表示线程正在等待这个资源。
- 从资源指向线程，表示资源已经分配给这个线程。

先看一个最有用的结论：图里没有环，就没有死锁。

图里有环时，不能立刻一刀切，还要看资源实例数：

- 每类资源只有 1 个实例时，有环就代表死锁。
- 每类资源有多个实例时，有环只说明可能死锁，还要继续判断是否存在某个线程能先完成并释放资源。

拿数据库行锁举个例子。事务 T1 已经锁住订单 `id=1`，接着要更新 `id=2`；事务 T2 先锁住了 `id=2`，又回头更新 `id=1`。这时可以把资源节点先拿掉，只看事务之间的等待关系：

```text
T1 -> T2
T2 -> T1
```

这种只保留“谁等谁”的图叫等待图（Wait-for Graph），可以看成资源分配图的简化版。Java 线程死锁、数据库死锁检测、Linux lockdep 都会用到类似的图思维，只是使用时机不一样：数据库通常等事务真的阻塞后再检查等待环；lockdep 更像是记录锁获取顺序，提前发现某些顺序组合可能绕成环。

![资源分配图与等待图示意图：资源分配图包含线程和资源节点，等待图只保留线程之间的等待关系](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/dead-lock-resource-allocation-graph.png)

## 预防、避免、检测、恢复

讲死锁处理时，经常会看到 4 个词：预防、避免、检测、恢复。名字很像，但它们介入的时间点不同。

业务代码里最常见的是预防，比如统一加锁顺序、缩短持锁时间；数据库更习惯检测和恢复，因为事务可以回滚；银行家算法属于“避免”，很适合理解安全状态，但普通后端服务很少真的照着实现一套。

| 方法 | 做法                                           | 代价                             | 工程常见程度                   |
| ---- | ---------------------------------------------- | -------------------------------- | ------------------------------ |
| 预防 | 破坏死锁四条件之一，让死锁结构上不成立         | 可能降低并发度或增加编码约束     | 很常见                         |
| 避免 | 分配资源前判断这次分配会不会把系统推向危险状态 | 需要提前知道资源需求，检查成本高 | 教材常讲，通用系统少见         |
| 检测 | 允许死锁发生，定期或按需检查等待环             | 检测本身有成本                   | 数据库、JVM 工具、内核调试常见 |
| 恢复 | 检测到死锁后终止、回滚或抢占资源               | 可能丢弃已完成工作               | 数据库事务里比较自然           |

![死锁处理策略图：预防、避免、检测、恢复四类方法的作用位置和工程常见程度](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/dead-lock-strategies.png)

### 死锁预防

预防做的事很直接：别让四个必要条件同时凑齐。

**破坏互斥**：把资源改成可共享。只读数据、不可变对象、无锁数据结构、追加写日志，都能减少互斥需求。但这条路经常走不通，比如同一行库存扣减、同一个文件写入位置、同一个用户余额，本来就不能让多个执行单元随便同时改。

**破坏占有并等待**：要么一次拿齐资源，要么一个都不拿。这样就不会出现“手里攥着 A，又一直等 B”的状态。代价也清楚：资源利用率可能下降，调用方还得提前知道自己到底要哪些资源。

**破坏非抢占**：拿不到新资源时，主动释放已经拿到的资源，稍后再试。Java 内置锁不支持超时获取，也不能让别的线程强制撤销；`Lock` 接口提供的 `tryLock()`，可以把“等不到就退出来”写进代码里。

```java
boolean gotA = false;
boolean gotB = false;

try {
    gotA = lockA.tryLock(100, TimeUnit.MILLISECONDS);
    if (!gotA) {
        return;
    }

    gotB = lockB.tryLock(100, TimeUnit.MILLISECONDS);
    if (!gotB) {
        return;
    }

    // 同时拿到两把锁后再处理共享状态
    updateSharedState();
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();
    // 不要吞掉中断信号，具体是返回还是抛异常由业务决定。
} finally {
    if (gotB) {
        lockB.unlock();
    }
    if (gotA) {
        lockA.unlock();
    }
}
```

这段代码的好处是不会无限等下去。坏处也要看清：它只是把等待变成了失败返回，后面怎么重试、是否允许重试、有没有幂等键，都得由业务自己处理。否则死锁没了，频繁失败或活锁又来了。

**破坏循环等待**：给资源排一个稳定顺序，所有线程只能按这个顺序申请。后端业务里最常见的例子是批量更新数据库行时先按主键排序，再逐条更新。

### 死锁避免

死锁避免不直接拆四个条件，而是在资源分配前先问一句：这次分配出去之后，系统还找不找得到一条“大家都能陆续完成”的顺序？

教材里最典型的是银行家算法。它要求每个进程提前声明最大资源需求，系统每次准备分配资源前，都要做一次安全性检查：

- 如果分配后仍然存在一个安全序列，就允许分配。
- 如果分配后找不到安全序列，就先让申请方等待。

安全状态不会走到死锁；不安全状态也不是已经死锁，只是后面可能走进死锁。

银行家算法适合用来理解“安全状态”，但普通业务服务很少直接用它。原因并不玄乎：大多数程序很难提前说清最大资源需求，请求顺序也会随业务分支变化；每次分配前都做全局检查，成本还不低。

### 死锁检测

检测的思路换了一个方向：系统先正常运行，等线程或事务真的互相等住了，再去找等待环。

数据库很适合这么做。事务本来就有回滚边界，发现死锁后选一个事务回滚，另一个事务就能继续执行。应用侧要做的是识别这类错误，并决定是否重试整个事务。

Java 进程里也能做诊断。JDK 提供了 `ThreadMXBean`：

```java
import java.lang.management.ManagementFactory;
import java.lang.management.ThreadInfo;
import java.lang.management.ThreadMXBean;

public class DeadlockDetector {
    public static void printDeadlocks() {
        ThreadMXBean bean = ManagementFactory.getThreadMXBean();
        long[] threadIds = bean.findDeadlockedThreads();

        if (threadIds == null || threadIds.length == 0) {
            System.out.println("No deadlock found");
            return;
        }

        ThreadInfo[] threadInfos = bean.getThreadInfo(threadIds, true, true);
        for (ThreadInfo threadInfo : threadInfos) {
            System.out.println(threadInfo);
        }
    }
}
```

`findDeadlockedThreads()` 可以检查对象监视器，也能覆盖 `java.util.concurrent` 里的 ownable synchronizer。它更适合放在诊断工具或临时排障脚本里，不适合高频塞进业务主流程；这类检查本身也会有开销。

它的边界也要说清楚：它只能看到 JVM 内部可见的 monitor 和 ownable synchronizer。线程 A 拿着 Java 锁去等数据库行锁，线程 B 拿着数据库行锁又卡在另一个应用动作上，这种跨系统等待链，单靠 `ThreadMXBean` 看不完整，还得把线程栈、数据库锁视图和业务日志放在一起对。

线上更常见的是直接打线程栈：

```bash
jcmd <pid> Thread.print -l
jstack -l <pid>
```

如果输出里出现 `Found one Java-level deadlock`、`waiting to lock`、`which is held by`，通常就可以顺着等待链反查到业务代码。这里建议带上 `-l`，因为很多项目里用的是 `ReentrantLock`、`ReentrantReadWriteLock` 这类 JUC 锁；少了 `-l`，ownable synchronizer 的信息可能不完整。

本地复现时，JConsole、VisualVM 这类图形化工具也很好用。以 JConsole 为例，先找到 JDK 的 `bin` 目录并打开 `jconsole`。

![jconsole](https://oss.javaguide.cn/github/javaguide/java/并发/jdk-home-bin-jconsole.png)

连接目标 Java 进程后，进入“线程”页面，点击“检测死锁”。

![jconsole 检测死锁](https://oss.javaguide.cn/github/javaguide/java/并发/jconsole-check-deadlock.png)

如果目标进程里存在 Java 线程死锁，JConsole 会把相关线程单独列出来。

![jconsole 检测到死锁](https://oss.javaguide.cn/github/javaguide/java/并发/jconsole-check-deadlock-done.png)

线上环境一般还是优先用 `jcmd`、`jstack`。它们可以通过 SSH 执行，输出也容易留档。JConsole 更适合本地复现、教学演示，或者测试环境里快速看线程状态。生产环境远程连 JConsole 要额外考虑权限、网络暴露和运行开销，很多团队会选择先导出线程栈，再离线分析。

如果应用大量使用 Java 21+ 虚拟线程，还要多留一个心眼。虚拟线程不是长期绑定在某个 OS 线程上，传统 `jstack` 或 `Thread.print` 看到的信息可能不如平台线程直观。可以用下面的命令导出虚拟线程 dump：

```bash
jcmd <pid> Thread.dump_to_file -format=text thread-dump.txt
jcmd <pid> Thread.dump_to_file -format=json thread-dump.json
```

虚拟线程 dump 和传统线程 dump 的字段并不完全一样；对象地址、锁、JNI 统计、堆统计等传统线程 dump 里常见的信息未必都会包含。排查时别只看一份 dump，业务日志、JFR、数据库和外部依赖状态都要一起看。

### 死锁恢复

恢复比检测更棘手，因为系统得决定“牺牲谁”。

常见手段有 3 类：

- 终止所有参与死锁的执行单元。
- 一次终止一个，检测死锁是否解除。
- 抢占某些资源，回滚到可继续执行的状态。

数据库事务适合恢复，因为事务边界清楚，回滚以后可以重新执行。普通 Java 线程就麻烦得多：一个线程持锁时可能已经改了一半内存状态、写了一半文件、发了一半远程请求，直接杀掉通常不可取。Java 早就不推荐使用 `Thread.stop()`，也是这个原因。

应用代码更应该做的是避免把自己写进绝路：一旦卡住，只能靠杀进程恢复。

## 数据库里的死锁

死锁在数据库里很常见，尤其是多事务更新多行数据时。

假设有一张订单表：

```sql
CREATE TABLE orders (
  id BIGINT PRIMARY KEY,
  status VARCHAR(32) NOT NULL
);
```

两个事务这样执行：

```sql
-- 事务 T1
BEGIN;
UPDATE orders SET status = 'PAID' WHERE id = 1;
UPDATE orders SET status = 'PAID' WHERE id = 2;
COMMIT;
```

```sql
-- 事务 T2
BEGIN;
UPDATE orders SET status = 'CANCELLED' WHERE id = 2;
UPDATE orders SET status = 'CANCELLED' WHERE id = 1;
COMMIT;
```

如果 T1 先锁住 `id=1`，T2 先锁住 `id=2`，后面就会互相等待。

数据库一般不会让这两个事务一直挂着。PostgreSQL 有 `deadlock_timeout` 参数，默认是 `1s`；事务等锁超过这个时间后，数据库才开始检查死锁，因为构造和扫描等待图也要成本。MySQL InnoDB 默认开启死锁检测，发现等待环后会回滚一个事务来解开局面，通常倾向选择修改行数更少的事务。

应用层要配合两件事。

第一，事务失败后要能重跑。PostgreSQL 的死锁错误码是 SQLSTATE `40P01`；MySQL InnoDB 遇到死锁时会回滚整个事务。应用收到这类错误后，应该重新执行整个事务，而不是只补最后一条 SQL。

第二，加锁顺序要稳定。批量更新多行时，先按主键或唯一业务键排序，所有入口都按同一个顺序更新。这个习惯很普通，但能减少大量交叉等待。

重试前还要确认业务具备幂等能力。比较常见的做法是使用唯一请求号、业务流水号或状态机校验。否则数据库已经把死锁处理掉了，应用层却可能因为重试引入重复扣款、重复发货。

减少和排查数据库死锁时，可以先看这几类信息：

- 事务尽量短，别在事务里等用户输入、调用慢接口、处理大文件。
- 索引要正确，否则更新一行可能扫描并锁住更多记录。
- 少用不必要的 `SELECT ... FOR UPDATE`。
- MySQL 可以用 `SHOW ENGINE INNODB STATUS` 看最近一次 InnoDB 死锁信息；如果死锁很频繁，可以考虑开启 `innodb_print_all_deadlocks` 把所有死锁信息写入错误日志。
- PostgreSQL 可以结合错误日志、`pg_locks`、`pg_stat_activity` 查阻塞关系。

PostgreSQL 里可以先用下面这个查询看当前哪些会话正在等锁，以及它们被哪些 pid 阻塞：

```sql
SELECT
    a.pid,
    a.usename,
    a.state,
    a.wait_event_type,
    a.wait_event,
    pg_blocking_pids(a.pid) AS blocking_pids,
    a.query
FROM pg_stat_activity a
WHERE a.wait_event_type = 'Lock';
```

这条 SQL 只能看当前等待关系。分析一次已经发生的死锁，还要回到数据库错误日志里的死锁详情，找到应用日志里的 traceId/requestId，再还原两个事务各自执行 SQL 的顺序。

数据库死锁不是“数据库坏了”。更多时候，它是在提醒你：应用层访问同一批资源的顺序不够稳定。

## 死锁、饥饿和活锁有什么区别？

这几个概念都会表现成“程序没按预期往前走”，但现场差别很大。

| 问题 | 表现                                           | 典型原因                       |
| ---- | ---------------------------------------------- | ------------------------------ |
| 死锁 | 多个执行单元互相等待，形成闭环                 | 反向加锁、事务交叉更新         |
| 饥饿 | 某个执行单元长期拿不到资源，但系统整体仍在推进 | 优先级过低、非公平锁竞争       |
| 活锁 | 执行单元一直在动作，但总是互相让路，没人完成   | 失败后同时重试、退避策略太同步 |

![死锁、饥饿和活锁对比图：死锁表现为等待环，饥饿表现为长期拿不到资源，活锁表现为持续动作但没有进展](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/dead-lock-deadlock-vs-starvation-livelock.png)

可以用三个画面记：死锁像两辆车在窄桥中间顶住，谁都不倒车；饥饿像队伍里一直有人插队，队尾那个人始终轮不到；活锁像两个人迎面走来，每次都同时往同一边让，结果一直错不开。

排查时别只看“卡住”这一个现象。死锁要找等待环，饥饿要看调度或锁竞争是否长期偏向，活锁要看重试逻辑是不是把所有参与者绑在同一个节奏上。

## 哪些卡住不一定是死锁？

线上有不少“卡住”看起来像死锁，最后查下来并没有等待环。常见的有这些：

- **线程池耗尽**：所有工作线程都在跑慢任务，新请求只能排队。
- **连接池耗尽**：线程都在等数据库连接，但没有形成互相等待的闭环。
- **慢 SQL**：线程停在 JDBC 调用里，数据库还在执行。
- **外部服务超时**：线程卡在 HTTP/RPC 调用上，等待对方响应。
- **GC 或 safepoint 停顿**：所有 Java 线程短时间暂停。
- **饥饿**：某些线程长期抢不到资源，但系统整体仍在推进。

判断死锁，关键证据不是“慢”或“卡”，而是能不能找到稳定的等待环。

## 线上怎么排查 Java 死锁？

如果线上接口卡住，先别急着重启。只要进程还活着，就尽量先留下线程栈和现场指标。

### 1. 先确认是不是“全挂”

先看现象是不是集中在“线程不释放资源”上：

- 某些接口一直超时，但进程还活着。
- CPU 不高，线程数、连接数、请求队列持续堆积。
- 线程池活跃线程长期占满，队列不下降。
- 数据库连接池连接被占住不释放。

这些现象只能说明服务在等，不足以证明死锁。慢 SQL、外部依赖卡住、线程池配置不合理，也会制造类似现场。

### 2. 连续抓 2 到 3 次线程栈

线程栈建议连续抓几次，间隔 10 到 30 秒。只抓一次，很容易把瞬时阻塞误判成死锁：

```bash
jcmd <pid> Thread.print -l > thread-1.log
sleep 10
jcmd <pid> Thread.print -l > thread-2.log
sleep 10
jcmd <pid> Thread.print -l > thread-3.log
```

多次栈的价值在于对比。如果三次都停在同一把锁、同一个连接池、同一段业务代码上，判断会比单次栈可靠得多。

Java 能识别的线程死锁，线程栈通常会直接打印死锁信息。没有直接打印时，也可以观察大量线程是不是长期停在同一批锁、同一个连接池获取逻辑或同一段业务方法上。

### 3. 顺着 `waiting to lock` 找持有者

读线程栈时，先抓这几类信息：

- 线程名和线程状态，例如 `BLOCKED`、`WAITING`。
- 正在等待的锁对象。
- 当前已经持有的锁。
- 栈顶业务方法。
- `parking to wait for` 对应的 `Lock` 或条件队列。

如果能看到 A 等 B 持有的锁，B 又等 A 持有的锁，等待环基本就浮出来了。

`synchronized` 相关死锁通常会看到 `waiting to lock <...>` 和 `locked <...>`；`ReentrantLock` 这类 JUC 锁通常会看到 `parking to wait for <...>`，并且需要关注 `Locked ownable synchronizers`。因此抓栈时建议带上 `-l`。

### 4. 回到代码看锁顺序

定位到栈里的业务方法后，再回代码里查这些点：

- 是否存在多个入口反向获取同一组锁。
- 是否在持锁期间调用外部服务或数据库。
- 是否锁住了范围过大的对象，例如全局 `Map`、单例对象、`Class` 对象。
- 是否混用了 Java 锁和数据库事务锁，导致链路更长。
- 是否用了非公平锁、无限等待、无超时获取。

很多死锁不是某一行代码单独造成的，而是两个调用链组合以后才出现。单看 A 链路、B 链路都说得过去，放在一起才绕成环。

## 写代码时怎么减少死锁？

下面几条更像代码评审时的检查项，尤其适合多锁、多事务、多资源更新的场景。

### 固定加锁顺序

同时操作多个用户、订单或账户时，先排序再加锁。下面这个转账例子假设账户 ID 全局唯一，并且创建后不再变化。

```java
public void transfer(Account from, Account to, long amount) {
    if (from == to) {
        return;
    }

    Account first;
    Account second;
    int compare = Long.compare(from.id(), to.id());
    if (compare < 0) {
        first = from;
        second = to;
    } else if (compare > 0) {
        first = to;
        second = from;
    } else {
        throw new IllegalStateException("Account id must be unique");
    }

    synchronized (first) {
        synchronized (second) {
            from.withdraw(amount);
            to.deposit(amount);
        }
    }
}
```

这个例子里，不管是 A 给 B 转账，还是 B 给 A 转账，都会先锁 ID 小的账户，再锁 ID 大的账户。顺序固定后，循环等待就少了一条边。

### 避免持锁做慢操作

持锁期间尽量别做下面这些事：

- RPC 或 HTTP 请求。
- 慢 SQL 或大事务。
- 文件上传下载。
- 等待消息队列返回。
- 调用不清楚内部会不会加锁的第三方代码。

锁应该保护共享状态，而不是把整段业务流程都包进去。能提前算好的数据放在锁外算，锁内只留下最短的状态切换。

### 使用超时和失败策略

内置锁 `synchronized` 没有超时获取能力。业务允许失败或重试时，可以考虑 `ReentrantLock.tryLock()`：

```java
try {
    if (!lock.tryLock(200, TimeUnit.MILLISECONDS)) {
        throw new IllegalStateException("系统繁忙，请稍后重试");
    }

    try {
        updateSharedState();
    } finally {
        lock.unlock();
    }
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();
    throw new IllegalStateException("获取锁时被中断", e);
}
```

超时只能限制等待时间，不能自动保证业务正确。拿不到锁以后要不要重试、最多重试几次、会不会重复提交、是否需要幂等键，这些问题都要提前设计好。否则，超时只是让错误更快暴露出来。

### 少混用多套锁体系

比较难排的是跨层死锁，比如：

- Java 线程持有 JVM 锁，同时等待数据库行锁。
- 另一个请求持有数据库行锁，回调到应用逻辑里等待 JVM 锁。

这种等待链会同时出现在 JVM 线程栈和数据库日志里，单看一边都不完整。能把锁控制在同一层，就别让等待关系穿透太多组件；必须跨层时，至少要有超时、日志和统一顺序。

### 给锁命名，给线程命名

线上排查时，最怕看到的就是“Thread-17 等待 Object@4afcd809”这种信息。线程池自定义线程名、锁对象绑定业务 ID、日志里打印关键资源顺序，平时多写几行，出问题时能省很多时间。

比如线程名里带上业务池：

```java
private static final AtomicInteger THREAD_INDEX = new AtomicInteger();

ThreadFactory factory = runnable -> {
    Thread thread = new Thread(runnable);
    thread.setName("order-worker-" + THREAD_INDEX.incrementAndGet());
    return thread;
};
```

`AtomicInteger` 来自 `java.util.concurrent.atomic`。自己编号比直接依赖线程 ID 更稳，也兼容 Java 8/11 这类仍然很常见的运行环境。

命名本身不能防死锁，但能让你更快知道是哪一类业务线程卡住了。

## 面试怎么回答死锁？

面试里问死锁，不用一上来背很长的定义。可以先用一个两锁互等的例子把场景讲清楚：

> 死锁是多个线程或进程互相等待对方释放资源，导致所有参与者都无法继续执行的状态。典型例子是线程 A 拿着锁 1 等锁 2，线程 B 拿着锁 2 等锁 1。

然后补四个必要条件：

> 死锁要同时满足互斥、占有并等待、非抢占、循环等待这 4 个条件。只要能破坏其中一个条件，就可以从结构上避免死锁。

再说处理方法：

> 工程里最常用的是预防，比如统一加锁顺序、缩小锁范围、一次申请完整资源、使用超时锁。操作系统教材还会讲银行家算法，它属于死锁避免，需要提前知道最大资源需求。数据库一般采用检测和恢复，发现等待环后回滚一个事务，应用层再重试。

如果继续追问 Java 排查：

> Java 可以用 `jcmd <pid> Thread.print -l` 或 `jstack -l <pid>` 打线程栈，也可以用 `ThreadMXBean.findDeadlockedThreads()` 在程序里做诊断。排查时看线程状态、正在等待的锁、已经持有的锁，再回到代码里确认是否存在反向加锁或持锁慢操作。

这样答能覆盖概念、条件、方案和排查，比只背四个条件更完整。

## 总结

死锁最该记住的不是术语，而是等待关系。

只要代码里存在“已经持有一部分资源，又继续等待另一部分资源”的路径，就要多问一句：这些等待关系有没有可能绕成环？如果有，要么固定顺序，要么缩短持有时间，要么允许超时撤退，要么交给数据库事务这类能检测、能回滚的系统处理。

有些地方没法保证永远不死锁，比如复杂数据库事务、高并发批量更新、跨服务资源编排。更现实的目标是把概率降下来，把现场留住，把失败做成可以安全重试，而不是一路拖到只能重启进程。

## 参考资料

- [JavaGuide：操作系统常见面试题总结（上）](https://github.com/Snailclimb/JavaGuide)
- [用个通俗的例子讲一讲死锁 - 知乎专栏](https://zhuanlan.zhihu.com/p/26945588)
- [Yale CS：Deadlock](https://www.cs.yale.edu/homes/aspnes/pinewiki/Deadlock.html)
- [University of Wisconsin CS 537 Notes：Deadlock](https://pages.cs.wisc.edu/~bart/537/lecturenotes/s12.html)
- [Oracle Java Tutorials：Deadlock](https://docs.oracle.com/javase/Java 优质开源技术教程/essential/concurrency/deadlock.html)
- [Oracle JDK API：ReentrantLock](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/locks/ReentrantLock.html)
- [Oracle JDK API：ThreadMXBean](https://docs.oracle.com/javase/8/docs/api/java/lang/management/ThreadMXBean.html)
- [Oracle Troubleshooting Guide：The jstack Utility](https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/tooldescr016.html)
- [Oracle Java Documentation：Virtual Threads](https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html)
- [Linux Kernel Documentation：Runtime locking correctness validator](https://docs.kernel.org/locking/lockdep-design.html)
- [PostgreSQL Documentation：Lock Management](https://www.postgresql.org/docs/current/runtime-config-locks.html)
- [PostgreSQL Documentation：Error Codes](https://www.postgresql.org/docs/current/errcodes-appendix.html)
- [PostgreSQL Documentation：pg_locks](https://www.postgresql.org/docs/current/view-pg-locks.html)
- [MySQL 8.4 Reference Manual：Deadlock Detection](https://dev.mysql.com/doc/refman/8.4/en/innodb-deadlock-detection.html)
- [MySQL 8.4 Reference Manual：InnoDB Error Handling](https://dev.mysql.com/doc/refman/8.4/en/innodb-error-handling.html)


---

<!-- source: 操作系统/虚拟内存详解-地址转换、TLB、缺页异常与页面置换.md -->

---
title: 虚拟内存详解：地址转换、TLB、缺页异常与页面置换
description: 虚拟内存高频面试题总结，从进程隔离讲起，讲清虚拟地址到物理地址的分段、分页、多级页表、TLB、缺页异常、页面置换算法、Belady 异常，以及 mmap、COW、JVM 大页等工程场景。
category: 计算机基础
tag:
  - 操作系统
  - 内存管理
head:
  - - meta
    - name: keywords
      content: 虚拟内存,虚拟地址,物理地址,MMU,页表,多级页表,TLB,缺页异常,缺页中断,页面置换算法,CLOCK算法,Belady异常,mmap,COW,操作系统面试题
---

打开任务管理器时，你可能会看到一个挺反直觉的现象：每个进程都像拿着一大片“自己的内存”，有些进程里的地址看起来还差不多，但它们并不会互相影响。浏览器、IDE、数据库同时跑，大家都以为自己有一块连续、干净、独占的空间。

这不是因为程序之间互相信任，而是操作系统在中间加了一层翻译。

程序看到的是虚拟地址，真正落到内存条上的位置，由内核和硬件一起决定。虚拟内存要讲的，也就是这层翻译怎么做、进程为什么能隔离、内存不够时又怎么把一部分数据先挪到磁盘上。

## 没有虚拟内存会怎样？

先看一个反例。

很多人大学里玩过单片机。单片机上没有复杂的操作系统，CPU 直接操作物理地址。这个环境里如果想同时跑两个程序，麻烦马上就来了：第一个程序往地址 2000 写了个值，第二个程序也刚好把数据放在 2000，那一写就把对方的数据覆盖了，两个程序一起出问题。

原因也不绕：两个程序都在直接引用同一套物理地址，谁也躲不开谁。

操作系统的做法是加一层隔离：给每个进程发一套独立的“虚拟地址”。进程只跟自己的虚拟地址打交道，这个地址最后落到哪块物理内存上，进程不用知道，操作系统统一安排。

于是就有了两个概念：

- 程序里用的地址，叫 **虚拟地址（Virtual Address）**。
- 真正存在内存条上的地址，叫 **物理地址（Physical Address）**。

进程访问虚拟地址时，CPU 里的内存管理单元（MMU）会根据映射关系，把它翻译成物理地址，再去访问内存。不同进程写的虚拟地址哪怕数值一样，映射到的物理地址也可以完全不同，自然就不会打架。

![虚拟地址到物理地址的映射过程：不同进程的相同虚拟地址通过 MMU 和页表映射到不同物理页](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/virtual-memory-virtual-physical-mapping.png)

我们可以把虚拟内存的好处归成三条，后面整篇文章其实都在围绕它们展开：

- **进程隔离**：每个进程一套页表，互相看不到对方的物理内存，A 进程没法靠一个地址直接摸到 B 进程的数据。
- **突破物理内存大小限制**：程序运行有局部性，暂时用不到的页可以先放到磁盘上，需要时再换回来，所以进程“感觉到”的内存可以比物理内存大。
- **统一且连续的地址空间**：进程看到的是一整片连续的虚拟地址，物理上却可以东一块西一块。拼起来这件事，交给映射表。

接下来最重要的问题只有一个：**虚拟地址到物理地址，到底怎么映射？**

主要有两种办法：**分段和分页** 。

## 分段是怎么映射的？

分段（Segmentation）出现得比较早，思路也很符合程序员直觉。一个程序本来就由代码、数据、栈、堆这些部分组成，它们的访问权限和生命周期都不一样，那就按逻辑切成几个段。

分段下的虚拟地址由两部分组成：**段选择子和段内偏移量**。

段选择子放在段寄存器里，里面最关键的是段号，用来当段表的索引。段表里记录这个段的基地址、段界限（段有多长）和特权级。

翻译过程也不复杂：拿段号去段表里查到段基地址，再检查段内偏移量有没有超过段界限。在只使用分段、不启用分页的模型里，基地址加偏移量就是物理地址。比如要访问段 3、偏移 500 的地址，段 3 的基地址是 7000，那物理地址就是 7000 + 500 = 7500；如果系统还启用了分页，这一步得到的是线性地址，还要再经过页表转换。

![分段地址转换示意图：虚拟地址由段号和段内偏移组成，通过段表查到基地址后计算物理地址](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/virtual-memory-segmentation.png)

分段解决了“程序不用关心物理地址”的问题，但它也留下两个坑。

**第一个是外部内存碎片**。每个段的长度不固定，段与段之间很容易剩下一些零碎空隙。举个例子，物理内存里依次放了四段：A 占 256 MB、B 占 128 MB、C 占 256 MB、D 占 128 MB。现在释放掉 B 和 D，空闲总量有 256 MB，但它被 C 隔成了两块 128 MB。此时想再放一个连续 200 MB 的段，就放不下了。总量够，连续空间不够。

**第二个是整理碎片代价高**。想把这些零散空闲空间拼成一整块，就得做内存紧凑：把还在用的段挪位置，重新排成连续空间。如果搬移过程还伴随把段换出到磁盘 Swap、再换回来，就会多出一大块磁盘 I/O。不管怎么做，变长段这种大粒度搬移都很重，碰上大段，系统很容易卡住。

段的问题就卡在这里：粒度大、长度不固定，碎片和整理成本都不好控制。

## 分页又是怎么映射的？

分页（Paging）换了个办法：不按代码、数据、栈这种逻辑去切，而是把虚拟地址空间和物理地址空间都切成固定大小的小块，每一块叫一页（Page）。Linux 下一页默认是 4 KB。

虚拟地址到物理地址靠页表（Page Table）映射。页表在内存里，MMU 负责查表翻译。地址转换通常分三步：

- 把虚拟地址拆成页号和页内偏移；
- 用页号去页表里查出对应的物理页号；
- 物理页号拼上页内偏移，得到最终物理地址。

![分页地址转换示意图：虚拟地址拆成页号和页内偏移，页表把虚拟页映射到物理页帧](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/virtual-memory-paging.png)

分页怎么解决分段的毛病？

页大小固定，物理页也按固定粒度管理，不会像变长段那样在段与段之间留下奇怪的小空隙，所以基本**消除了外部碎片**。代价是页内可能浪费：一个程序哪怕只用了几个字节，也得占满一整页，这部分叫**内部碎片**。不过这个浪费通常可控，比外部碎片好处理。

管理粒度也变小了。物理内存不够时，操作系统可以挑一些“最近没怎么用”的页换出到磁盘（Swap Out），需要时再换入（Swap In）。调入调出的单位，从一整个变长段，缩到了固定大小的页。

别误会，分页不代表磁盘压力一定小。真遇到大量主缺页或者抖动，频繁的页级 I/O 一样能把系统拖垮。

分页还有一个很实用的点：程序不需要一次性全部装进内存。先把虚拟页和物理页的映射关系准备好，但不急着把页真的搬进物理内存。等程序访问到某个虚拟页，再把它加载进来。这就是按需调页（Demand Paging）的基础。

## 段页式：两者其实能合体

分段和分页不一定只能选一个，也可以合在一起用，这就是 **段页式内存管理** 。

做法是先分段再分页：先把程序切成有逻辑意义的段，再把每个段切成固定大小的页。地址也就变成三段：段号、段内页号、页内偏移。每个程序一张段表，每个段再挂一张页表，段表项里存这个段对应页表的起始地址。

缺点也很好理解：访问内存的次数变多。一次段页式地址转换要走三趟内存：

1. 第一趟查段表拿到页表起始地址；
2. 第二趟查页表拿到物理页号；
3. 第三趟才用物理页号加页内偏移访问真正的数据。

这里插一段历史，能解释为什么 Linux 看起来“既分段又分页”。Intel 从 80286 开始用段式管理，到 80386 补上了页式管理，但页式是建立在段式之上的：逻辑地址先经分段变成线性地址，也就是通常说的虚拟地址；线性地址再经分页变成物理地址。CPU 硬件就是这么设计的，Linux 只能配合。

32 位 x86 Linux 通常采用平坦内存模型，让主要代码段和数据段的基地址为 0，逻辑地址和线性地址在数值上相等，内存管理主要交给分页。到了 x86-64 长模式，CS、SS、DS、ES 的分段作用基本被弱化，但 FS 和 GS 仍可使用非零基址，常用于线程局部存储和内核的 per-CPU 数据。

## 单级页表为什么不够用？

分页落到真实系统里，最先碰到的不是思路问题，而是空间问题。

算一笔账。32 位环境下，虚拟地址空间是 4 GB，页大小 4 KB（2^12），那一个进程就有约 100 万（2^20）个页。每个页表项占 4 字节，整张页表就是 4 × 2^20 = 4 MB。

4 MB 看着还行，但别忘了，**每个进程都有自己的页表**。100 个进程就是 400 MB 内存用来存页表。到了 64 位环境，只会更夸张。

更别扭的是，单级页表得把整个虚拟地址空间一次性铺满。页表的工作是翻译地址，某个虚拟地址如果在页表里没有位置可查，翻译就断了。所以哪怕进程实际只用了一小片地址，那 100 万个页表项也得先建出来，绝大多数还都是空的。

这就太浪费了。

## 多级页表怎么省空间？

多级页表（Multi-Level Page Table）的招数很直接：**只给真正用到的地址建下级页表，没用到的就不建。**

还是 32 位、4 KB 页的场景。把 100 多万个页表项再分一层：一级页表（页目录）有 1024 项，每一项指向一张二级页表，每张二级页表也有 1024 项。1024 × 1024 正好覆盖那 100 多万个页表项。

你可能会马上反问：这不是多了一层吗？4 KB 的一级表，再加 4 MB 的二级表，岂不是更费？

如果真把 4 GB 虚拟地址全映射满，确实更费。但现实里，一个进程通常不会用满 4 GB。关键就在这里：一级页表必须常驻，它覆盖全部地址空间，但只占 4 KB；二级页表按需创建，某个一级表项没用到，对应的二级表就不建。

算个数。假设只有 20% 的一级表项被用到，那页表总开销就是 4 KB（一级）+ 20% × 4 MB（二级）≈ 0.804 MB。对比单级页表的 4 MB，省得很明显。这里省下来的内存，靠的是局部性原理：程序在一段时间内通常只访问地址空间里的一小块。

到了 64 位，两级就不够用了。当前 Linux 的通用页表抽象是五级，自顶向下是：

- 全局页目录 PGD（Page Global Directory）
- 第四级目录 P4D（Page 4th Directory）
- 上层页目录 PUD（Page Upper Directory）
- 中间页目录 PMD（Page Middle Directory）
- 页表项 PTE（Page Table Entry）

![多级页表示意图：PGD、PUD、PMD、PTE 分层索引，只为实际使用的地址范围创建下级页表](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/virtual-memory-multi-level-page-table.png)

在只用四级硬件分页的 x86-64 上，P4D 这一层会被“折叠”掉，不实际参与地址转换。所以你常听到的“四级页表”，说的是这种折叠后的形态，不是 Linux 只定义了四级。

具体到 x86-64，目前主流是四级分页，用 48 位虚拟地址（寻址 256 TB）。一个 64 位虚拟地址通常这样拆：高 16 位是符号扩展位，接下来 PGD、PUD、PMD、PTE 各占 9 位（每级 512 项，2^9），最低 12 位是页内偏移（对应 4 KB 页）。每个页表项 8 字节，512 项 × 8 字节 = 4 KB，每一级页表刚好占满一个页。

需要更大地址空间时，x86-64 提供五级分页（LA57），把规范线性地址从 48 位扩到 57 位，物理地址最多 52 位。这里别把时间线记错：Linux 从 4.14（2017 年）起支持五级分页，是否启用取决于 CPU 和内核配置；Intel 这边明确支持 57 位虚拟、52 位物理地址的是第三代至强可扩展（Ice Lake 服务器平台，2021 年发布）。Linux 文档还提到，五级分页最多给用户空间 56 位虚拟地址；为了兼容那些把指针高位拿去做 tagging 的程序，内核默认不会主动在 47 位以上分配地址，除非应用显式请求。普通机器默认还是四级更常见。

## TLB（快表）解决了什么？

多级页表省了空间，但会多花时间：原来查一次表，现在 64 位下可能要查四级。一次内存访问背后，如果还藏着四五次查表访存，代价就太高了。

还是靠局部性原理救场。程序在一段时间内反复访问的页，通常就那几批。那就把最常用的页表项，缓存到比内存快得多的硬件里。这块缓存就是 TLB（Translation Lookaside Buffer），中文叫快表、转址旁路缓存，封装在 CPU 的 MMU 里。

有了 TLB，CPU 寻址时先查 TLB：

- 命中（TLB Hit），直接拿到物理页号，跳过多级页表查找。
- 未命中（TLB Miss），再去查内存里的多级页表，查到后把这一项塞进 TLB，方便下次访问。

![TLB 缓存地址转换结果的流程：CPU 先查 TLB，命中直接访问内存，未命中再查多级页表并更新 TLB](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/virtual-memory-tlb-cache.png)

因为热点页就那么多，TLB 命中率通常不低。多级页表带来的查表成本，大多数时候都被 TLB 扛掉了。

## 缺页异常（Page Fault）是怎么走完的？

按需调页有个前提：进程访问某个虚拟页时，这个页不一定已经在物理内存里。MMU 查页表时，如果发现地址翻译或页级权限检查无法完成，CPU 会触发缺页异常，把控制权交给内核的缺页处理程序。中文资料也常把它称为“缺页中断”，但从体系结构分类看，它是由当前访存指令同步触发的异常，不是外设发起的硬件中断。

流程可以按这几步记：

1. CPU 拿着虚拟地址查页表，发现地址翻译或权限检查无法完成，触发缺页异常。
2. 进入内核态，缺页处理程序先判断这次访问是否合法。如果访问的是非法地址，比如野指针，就报段错误（Segmentation Fault），进程通常会被杀掉。
3. 合法的话，找一个空闲物理页帧。如果没有空闲帧，就回收或置换一个“受害者”页：干净的文件页可以直接丢弃，要用时再从原文件读回；脏的文件页要先写回原文件；匿名页则在启用了 Swap 时写入交换空间。到底会不会产生磁盘写，取决于页的类型以及脏不脏。
4. 把需要的页从磁盘（Swap 区或文件）读进物理内存，更新页表项，让它指向新的物理页帧。
5. 返回用户态，重新执行刚才触发缺页的那条指令，这次就能正常访问了。

![缺页异常处理流程：MMU 发现地址翻译或权限检查无法完成后进入内核，检查访问合法性、分配或置换页帧、更新页表并重试指令](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/virtual-memory-page-fault.png)

从 Linux 的性能统计角度看，缺页主要分两类，`getrusage` 里也只有 `ru_minflt` 和 `ru_majflt`：

- **次缺页（Minor Page Fault）**：页其实已经在物理内存里了，只是当前进程的页表还没建立映射，比如多个进程共享的库；写时复制（COW）触发的页复制通常也算次缺页，因为它要新建或复制页面，但不用读盘。开销小。
- **主缺页（Major Page Fault）**：页确实不在内存，必须从磁盘（文件或 Swap）读进来，开销大。

访问非法地址，比如野指针，也会由硬件触发 page-fault 异常进内核。但内核判定非法后，一般是给进程发 `SIGSEGV`。这属于错误处理，通常不和 minor/major 并列当成第三种性能统计类别。

如果物理内存太紧，系统大部分时间都在换入换出页，CPU 没怎么干正事，全在搬数据，这种状态叫**抖动（Thrashing）**。

## 页面置换算法：换谁出去？

物理内存满了，又要装新页，就得挑一个页换出去。挑得好，后面少缺页；挑得差，刚换出去的页转头又要用，白折腾。

常见算法有这么几个。

**OPT（最优置换）**：换出“未来最长时间内不会被访问”的页。它的缺页次数理论上最少，但需要预知未来，现实里实现不了，主要用来当衡量其他算法的参照。

**FIFO（先进先出）**：维护一个队列，谁最早进来就先换谁。实现简单，但很容易误伤热点页，因为一个页待得久，不代表以后就用不到。

**LRU（最近最少使用）**：换出“最久没被访问”的页。它赌的是局部性：最近用过的页，接下来大概率还会用。LRU 效果接近 OPT，但成本高，要么给每个页维护时间戳，要么用链表在每次访问时把页移到表头。纯软件实现很难扛住高频访问。

**CLOCK（时钟 / 二次机会）**：LRU 的近似实现，用来避开 LRU 的高成本。给每个页加一个访问位（reference bit），所有页排成一个环，一根指针像时钟一样转。要换页时，指针指到谁就看它的访问位：是 1，说明最近用过，给它“第二次机会”，把访问位清 0，指针往下走；是 0，就换这一页出去。一个访问位加一圈环形扫描，就能便宜地模拟“最近有没有被用过”。

![CLOCK 页面置换算法示意图：页面按环形队列排列，指针根据访问位 R 判断给第二次机会还是淘汰页面](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/virtual-memory-clock-algorithm.png)

**LFU（最不经常使用）**：给每个页记访问次数，换出访问次数最少的页。它看的是访问频率，不是访问时间。问题是早期被频繁访问、后来不用的页，计数很高却赖着不走，所以实际中常配合计数衰减来用。

横向对比一下：

| 算法  | 换出依据          | 实现成本          | 效果                 | 能不能落地       |
| ----- | ----------------- | ----------------- | -------------------- | ---------------- |
| OPT   | 未来最久不用      | 无法实现          | 理论最优             | 只作基准         |
| FIFO  | 进入时间最早      | 很低              | 一般，可能误伤热点页 | 能               |
| LRU   | 最久未访问        | 高（时间戳/链表） | 接近 OPT             | 纯软件较吃力     |
| CLOCK | 访问位 + 环形扫描 | 低                | 接近 LRU             | 能，主流近似方案 |
| LFU   | 访问次数最少      | 中（需计数）      | 看场景               | 能，常配衰减     |

这里别误会：上面这些是教科书算法，用来理解置换策略。真实的 Linux 内核不是在 OPT/FIFO/LRU/CLOCK 里直接挑一个，而是用活跃/非活跃双 LRU 链表、workingset、refault 检测这套近似机制；文件页和匿名页的回收策略也不一样，还会受 NUMA、cgroup、内存水位影响。所以“Linux 用的就是 CLOCK”这种说法不严谨。

## Belady 异常：加内存反而更慢？

按直觉，物理内存的页帧越多，缺页应该越少。但 FIFO 会打脸：**有时候增加页帧数，缺页次数反而变多**。这就是 Belady 异常（Belady's Anomaly），由 László Bélády 在 1960 年代发现。

用经典访问串就能复现。访问序列 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5，跑 FIFO：

- 3 个页帧时，缺页 9 次。
- 4 个页帧时，缺页 10 次。

多给了一个页帧，缺页反而多了一次。

原因在于 FIFO 不满足**栈性质（stack property）**：n 个页帧时驻留的页集合，不一定是 n+1 个页帧时驻留页集合的子集。这个包含关系一断，加页帧就可能踢错页。

满足栈性质的算法叫栈算法。它们对每个页的置换优先级和页帧数无关，所以从数学上可以避开 Belady 异常。OPT 和 LRU 都是栈算法，可以证明页帧数增加时，缺页只会减少或不变，不会反增。FIFO 不满足这个性质，所以会出问题。至于 LFU 会不会出现 Belady 异常，取决于它的频率统计方式，以及相同频率时怎么打破平局，不能直接说它一定免疫。

CLOCK 也别想当然。经典二次机会/CLOCK 是 LRU 的近似，但不具备 LRU 那种严格的栈性质；极端情况下，所有访问位都是 1，它还会退化成 FIFO。所以不能因为它“近似 LRU”，就推出它一定免疫 Belady 异常。稳妥的结论是：FIFO 存在能触发 Belady 异常的访问序列，OPT 和 LRU 一定不会，CLOCK、LFU 这类要看具体定义。

记住一个结论就够用了：Belady 异常是 FIFO 这类非栈算法的毛病，遇到“加内存性能反降”的诡异现象，先怀疑置换策略，而不是怀疑内存条坏了。

## 这些概念在工程里怎么用？

虚拟内存不是只活在操作系统课本里，往上层走几步就能撞见它。

**mmap 与零拷贝**：`mmap()` 把文件直接映射到进程的虚拟地址空间，读文件变成访问内存。映射建立时并不会立刻把文件读进来，等你访问到某一页，才触发缺页、按页加载，这就是按需调页。它省掉了一次从内核缓冲区到用户缓冲区的拷贝，所以经常出现在零拷贝方案里。

**Redis 的内存与碎片**：Redis 是纯内存数据库，但它申请的内存最终也要落到物理页上。内存分配器（默认 jemalloc）按固定大小档位（size class）分配，会有空间浪费。它和分页里“不足一页也占一页”在“分配粒度大于实际用量”这点上很像，但一个发生在用户态分配器，一个发生在操作系统分页层，位置和治理方式都不同，不能直接当成同一种碎片。Redis 持久化时 fork 出子进程做快照，靠的也是写时复制（Copy-On-Write）：父子进程先共享同一批物理页，谁写谁才触发页复制，背后还是页表那套机制。

**JVM 的堆**：JVM 向操作系统申请的堆，也是一片虚拟地址空间。大堆会让页表覆盖的范围变大，配大页（HugePage / 2 MB 大页）能减少页表项数量、缓解 TLB 压力，对降低 GC 期间的访存开销有帮助。GC 扫描对象时反复跳来跳去，访问局部性差，更直接的代价是 cache miss 和 TLB miss 增多；只有相关页还没驻留、被回收过，或者系统本身内存吃紧时，才会进一步表现为缺页。这也是大堆调优要盯 TLB 的原因。

往下是硬件的页表和 TLB，往上是数据库、JVM、零拷贝。虚拟内存这层东西，看起来偏底层，实际经常会从各种性能问题里冒出来。

## 面试里怎么答？

如果面试官问“为什么需要虚拟内存”，别一上来就只说“为了隔离”。可以先这么答：程序里用的是虚拟地址，不是内存条上的真实地址。CPU 访问内存时，MMU 会根据页表把虚拟地址翻译成物理地址。这样每个进程都像在用一片连续的独立内存，哪怕两个进程里的地址数值一样，最后也可能落到不同的物理内存上。

然后再补一句收益：进程之间改不到对方的数据，程序不用关心物理内存具体放在哪，操作系统还能按需分配内存、换页，以及用 COW 这种机制减少复制。

如果继续追问“分页解决了什么”，就拿它和分段对比。分段是按代码段、数据段、栈这些逻辑模块来切，长度不固定，所以容易留下外部碎片，后面整理起来也麻烦。分页就简单很多：虚拟地址空间和物理内存都切成固定大小的页，页表只负责记录“虚拟页号 → 物理页帧”的关系。这样基本消除了外部碎片，不过页内可能会浪费一点空间，也就是内部碎片。

多级页表也可以顺手带一下：它不是为了让查表更快，而是为了省内存。没用到的地址空间，不需要真的把下级页表建出来。

问到 TLB 和缺页异常时，可以按“先走快路径，再处理异常”来说。CPU 先查 TLB，命中就直接拿到物理页号；没命中，才去查多级页表。如果页表项显示这个页还不在内存里，就触发缺页异常。内核先判断这次访问合不合法，合法才分配页帧，必要时回收旧页，再从文件或 Swap 把页面调进来，最后更新页表，重新执行刚才那条指令。

minor fault 通常不用读盘，major fault 要读盘；如果是非法地址访问，最后一般会走到 `SIGSEGV`。

页面置换算法不用把名字挨个背一遍，抓住一句话就行：换出去的页，最好是后面很久都用不到的页。OPT 最优但现实里做不到；LRU 效果接近 OPT，但实现成本高；CLOCK 用访问位近似 LRU；FIFO 最简单，但可能出现 Belady 异常。真实 Linux 也不是照搬某个教科书算法，而是用活跃/非活跃 LRU、workingset、refault 等机制做近似回收。


---

<!-- source: 操作系统/中断、异常与系统调用详解-从内核入口到缺页异常.md -->

---
title: 中断、异常与系统调用详解：从内核入口到缺页异常
description: 中断、异常与系统调用高频面试题总结，以 read() 为线索讲清硬件中断、同步异常、系统调用、信号、时钟中断、缺页异常和线程上下文切换之间的关系。
category: 计算机基础
tag:
  - 操作系统
  - Linux
  - 系统调用
head:
  - - meta
    - name: keywords
      content: 中断,异常,系统调用,trap,信号,用户态,内核态,上下文切换,时钟中断,缺页异常,Page Fault,SIGSEGV,read,操作系统面试题
---

系统调用从用户态进入内核态，只是理解这条路径的起点。沿着一次 `read()` 往下看，还会遇到几个紧密相关的问题：

- `read()` 是怎么进入内核的？
- 时钟中断为什么能让正在运行的线程停下来？
- Page Fault 为什么有时是正常行为，有时又会变成 `SIGSEGV`？
- 系统调用进了内核，是否一定会发生线程上下文切换？

这些问题可借助一条 `read(fd, buf, count)` 调用串起来看。用户程序执行 `read()`，glibc 把系统调用号和参数放到约定寄存器里，CPU 执行 `syscall` 进内核。内核检查 fd、缓冲区地址、文件状态，再决定从 Page Cache、文件系统、socket 缓冲区或设备驱动里取数据。

如果数据已经准备好，内核把数据复制回用户缓冲区，`read()` 很快返回。数据没准备好时，当前线程可能睡眠；磁盘 I/O 完成或网卡收到数据后，硬件中断进入内核，内核再唤醒等待队列里的线程。线程再次被调度到 CPU 上，`read()` 才继续返回。

一次普通 I/O 跑起来后，系统调用、中断、异常、调度常连在一起。

## 进入内核的几类事件

CPU 正常执行用户程序时，下一条指令由程序计数器和跳转逻辑决定。外设事件、当前指令出错、用户程序主动请求内核服务，都会让控制流转到内核。CSAPP 把这类跳出正常指令流的情况称为异常控制流（Exceptional Control Flow），并把 interrupt、trap、fault、abort 作为不同类型。

常见入口可按来源分：

- **中断（Interrupt）**：来自外部硬件，和当前指令没有直接关系。网卡收包、磁盘 I/O 完成、定时器到点，都属于这一类。
- **陷入（Trap）**：程序主动执行特殊指令进入内核。系统调用就是最常见的 trap。
- **故障（Fault）**：当前指令执行时遇到问题，但内核可能进行修复。典型例子是缺页异常，修好后会重新执行触发 fault 的那条指令。
- **终止（Abort）**：处理器发现难以恢复的严重错误，通常不再回到原来的指令流。

![中断、异常与系统调用关系图](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/ecf-kernel-entry-map.webp)

`trap` 这个词在不同资料里的用法不完全一样。CSAPP 语境下，它通常指程序主动触发的同步异常，比如系统调用；RISC-V 则把 trap 定义为异常或中断引起的控制转移。本文提到“trap / 系统调用”时使用前一种狭义含义，涉及 RISC-V 时会单独说明。

## 中断、异常、系统调用和信号的关系

这几个词容易混，因为它们不在同一层。

硬件中断、同步异常和系统调用描述 CPU 为什么进入内核；信号则是内核向进程或线程交付的软件通知。信号可能由硬件异常转化而来，也可能由其他进程、终端或定时器产生。

先把这几个概念放到一张表里：

| 概念     | 触发来源                                             | 同步/异步                  | 谁处理                                    | 常见结果                             |
| -------- | ---------------------------------------------------- | -------------------------- | ----------------------------------------- | ------------------------------------ |
| 硬件中断 | 外设或定时器                                         | 异步                       | 内核中断处理程序                          | 处理设备事件、唤醒等待任务、触发调度 |
| 同步异常 | 当前指令执行过程                                     | 同步                       | 内核异常处理程序                          | 修复后重试、转成信号、终止进程       |
| 系统调用 | 用户程序执行 `syscall`/`ecall` 等指令主动触发的 trap | 同步                       | 内核系统调用入口                          | 返回结果、返回错误码、阻塞等待资源   |
| 信号     | 内核或进程发出的通知                                 | 通常异步，也可能由异常引发 | 目标进程的默认动作或用户态 signal handler | 忽略、终止、暂停、继续、执行 handler |

这张表里的同步/异步，看的是事件是不是由当前指令引出来。除零、非法指令、Page Fault、系统调用都和当前正在执行的指令有关，所以是同步事件。硬件中断来自外设或定时器，CPU 正在跑 Java 线程时，网卡也可能刚好收到包，这件事和当前那条用户代码没有直接关系，所以是异步事件。

阻塞和非阻塞是另一个维度。`read()` 进入内核这一步是同步的，但进入内核后，如果资源还没有准备好，阻塞 fd 会让线程睡眠；设置了 `O_NONBLOCK` 的 fd 可能直接返回 `EAGAIN`。

硬件中断像是外设敲了一下 CPU。比如 CPU 正在跑你的 Java 线程，时钟中断来了，CPU 跑完当前指令后会进入内核的中断入口。内核更新时钟、统计运行时间，必要时让调度器把 CPU 交给另一个线程。你的代码里没有写过让出 CPU，但它还是可能被抢占。

异常出在当前指令身上。除以 0、执行非法指令、访问没有权限的地址，都是这条指令触发的问题。缺页异常也算这一类：进程访问某个虚拟地址，页表里暂时没有有效映射，CPU 只能把现场交给内核。同步异常不代表一定能修好，内核修不了时，还是会投递信号或终止进程。

系统调用就是用户程序主动找内核帮忙。用户态程序不能直接读磁盘、改页表、操作网卡，所以 glibc 的 `read()`、`write()`、`fork()`、`mmap()` 最后都要走到内核提供的系统调用接口。

信号不属于 CPU 入口机制。它是内核给进程或线程发的通知。非法内存访问可能先触发 Page Fault，内核发现无法修复，再给进程投递 `SIGSEGV`。用户按下 `Ctrl+C`，终端驱动会让内核给前台进程组发 `SIGINT`。另一个进程也可调用 `kill()` 发信号。

几个容易混的维度可以拆开看：

| 维度              | 关注的问题                       | 例子                                                  |
| ----------------- | -------------------------------- | ----------------------------------------------------- |
| 同步/异步事件     | 事件是否由当前指令直接触发       | Page Fault 是同步异常；网卡中断是异步中断             |
| 阻塞/非阻塞 I/O   | 资源未就绪时线程是否等待         | 阻塞 `read()` 会睡眠；非阻塞 `read()` 可返回 `EAGAIN` |
| 用户态/内核态切换 | 是否进入内核执行特权代码         | `syscall`、Page Fault、硬件中断都会进入内核           |
| 线程上下文切换    | CPU 是否从一个线程切到另一个线程 | 阻塞、抢占、调度时可能发生                            |

信号 handler 也不是内核函数。内核通常在从内核态返回用户态前检查待处理信号；如果要执行 handler，就准备用户栈、寄存器和 trampoline，再让线程回到用户态执行 handler。因此，信号 handler 通常不是在任意机器指令之间立刻插入执行，而是等线程从内核态返回用户态，或从可中断等待中被唤醒后，再按内核安排进入 handler。多线程程序还要多留意一步：发给进程的信号，不一定由预想中的那个线程处理，内核会选择一个没有屏蔽该信号的线程。

事件处理完后，回到哪里也不一样：

| 类型            | 处理后通常回到哪里                                   |
| --------------- | ---------------------------------------------------- |
| 中断            | 回到被打断的位置继续执行，或者调度到别的线程         |
| Trap / 系统调用 | 通常回到陷入指令之后继续执行；系统调用重启等情况除外 |
| Fault / 缺页    | 修复后重新执行触发 fault 的那条指令                  |
| Abort           | 通常不返回原程序                                     |

这张表只描述最常见路径。真实系统里，内核还可能投递信号、重启系统调用、切换到别的线程，或者直接终止进程。

## 用户态/内核态切换与上下文切换

用户态和内核态的差别在 CPU 特权级。用户态不能执行特权指令，不能随便访问内核地址空间；内核态可以管理页表、设备、中断控制器和调度器。

从用户态进入内核态，不是普通函数调用。CPU 和内核必须留下足够的现场信息，否则后面不知道该回到用户程序哪条指令。

x86-64 上，64 位系统调用通常走 `syscall` 指令；异常和外部中断更多走 IDT 中配置好的入口。有些异常会压入错误码，有些不会；NMI、Double Fault 这类特殊入口还可能使用 IST 栈。

本文用 Linux x86-64 举例，所以主要写 `syscall`。其他架构或旧 ABI 可能使用 `int 0x80`、`sysenter`、`ecall`、`svc` 等入口指令，寄存器约定也不同。

`syscall` 指令本身做的事有限。它会把返回地址和标志寄存器放到 `RCX`、`R11`，但不会像普通函数调用那样保存完整寄存器现场，也不会自动切到内核栈。Linux 入口汇编还要继续完成切栈、`swapgs`、保存寄存器等工作。

还要区分用户态/内核态切换和线程上下文切换：

- 用户态/内核态切换：CPU 从低特权级进入高特权级，执行内核代码，再返回用户态。
- 上下文切换：调度器把 CPU 从一个线程或进程切给另一个执行实体。

系统调用一定会进入内核，但不一定切换到另一个线程。`getpid()` 这类调用通常很快返回，还是当前线程继续运行。`read()` 如果要等待数据，内核可能挂起当前线程，先调度别的线程。另外，一些时间相关接口可借助 vDSO 在用户态完成，比如 `clock_gettime()`、`gettimeofday()` 在某些架构和配置下可以读取内核映射给用户态的数据页，不一定每次都真正进入内核。

![用户态内核态切换与上下文切换对比图](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/kernel-mode-vs-context-switch.webp)

## `read()` 的系统调用路径

以 Linux x86-64 上的 `read(fd, buf, count)` 为例，业务代码一般调用的是 glibc 包装函数，不会自己写汇编。

![read 系统调用流程图](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/read-syscall-path.webp)

glibc 会把系统调用号放进 `rax`，把参数放进约定寄存器。x86-64 的系统调用参数依次放在 `rdi`、`rsi`、`rdx`、`r10`、`r8`、`r9`。

CPU 执行 `syscall` 后，会按架构约定跳到内核配置好的入口。Linux 入口代码保存后续要用到的寄存器状态，再根据系统调用号分发到 `read` 对应的处理函数。内核会检查 fd、访问权限和其他参数；真正向用户缓冲区复制数据时，地址问题仍可能导致 `EFAULT`。

目标是普通文件时，路径会走 VFS 和具体文件系统，优先从 Page Cache 拿数据。目标是 socket 时，内核会检查接收缓冲区有没有数据。数据准备好后，内核把数据复制到用户传入的 `buf`。

内核访问用户缓冲区时，也可能触发 Page Fault。Linux 会把这类可能 fault 的用户内存访问点记录在 exception table 里；如果 fault 发生在可修复位置，内核会跳到对应 fixup 代码，把结果转换成 `-EFAULT` 这类错误返回，而不是直接让内核崩溃。

例如，把 `read()` 的 `buf` 传成明显不可写的地址，系统调用通常不会把内核一起拖死，而是返回 `-1`，并把 `errno` 设为 `EFAULT`。

```c
#include <errno.h>
#include <fcntl.h>
#include <stdio.h>
#include <unistd.h>

int main(void) {
    int fd = open("/dev/zero", O_RDONLY);
    char *p = (char *)1;
    ssize_t n = read(fd, p, 1); // n == -1, errno == EFAULT
    printf("n=%zd errno=%d\n", n, errno);
}
```

`read(2)` 对 `EFAULT` 的描述就是用户缓冲区不在可访问地址空间里。对应到内核路径，问题出在内核把数据拷回用户缓冲区这一步。x86 的 exception table 文档里也用 `get_user()` 做例子：可能 fault 的用户内存访问指令会和一段 fixup 代码配对；Page Fault 发生后，内核能查到这对地址，就把返回值改成 `-EFAULT`，再跳到 fixup 路径继续收尾。

系统调用返回时，成功的 `read()` 返回实际读到的字节数，这个值可以小于 `count`，不算错误。失败时内核返回负错误码，glibc 包装函数通常把它转成 `-1` 并设置 `errno`。用户缓冲区不可访问时可能得到 `EFAULT`；阻塞等待期间被信号打断时，可能得到 `EINTR`。

写生产代码时，不要默认一次 `read()` 要么读满，要么失败。阻塞系统调用等待期间，如果线程收到信号并执行了 handler，系统调用可能返回 `EINTR`；如果信号到达前已经读到部分数据，`read()` 也可能直接返回已经读到的字节数，而不是失败。如果安装 handler 时使用了 `SA_RESTART`，部分阻塞系统调用会在 handler 返回后自动重启。是否重启，取决于接口类型和信号处理设置。

## 时钟中断与抢占

抢占式操作系统不能指望每个程序主动让出 CPU。教材通常把这条路径简化为内核配置定时器、硬件周期性产生中断。现代 Linux 支持 tickless，实际机器不一定始终按固定频率产生调度 tick，但定时器中断仍是理解抢占的基础模型。

假设线程 A 正在用户态运行。定时器到点后，CPU 进入内核的时钟中断处理程序。内核更新当前线程的运行时间，检查是否要进行调度。如果不用调度，处理结束后返回 A，A 继续执行；如果要调度，内核保存 A 的执行现场，选出线程 B，切到 B 的内核栈和寄存器上下文，最后从内核返回到 B 的用户态位置。

OSTEP 讲 Limited Direct Execution 时，也是按这条链路展开的：定时器中断先让硬件和内核保存当前进程的用户寄存器，内核再调用切换例程保存旧进程上下文、恢复新进程上下文，最后通过 return-from-trap 回到新进程。

这条路径一定发生了中断，是否发生上下文切换则取决于调度器是否选中了另一个线程。

硬件中断处理程序一般要快进快出，不能像普通进程上下文那样随便阻塞等待。较重的工作会被延后到软中断、工作队列或内核线程里处理。

网卡收包就是一个常见例子。Linux NAPI 的基本路径是：设备先用硬件中断通知主机，驱动在中断处理里调度 NAPI，后面的包处理通常在 softirq 上下文里运行。驱动调度 NAPI 后通常会保持 IRQ masked，直到 NAPI polling 结束，因为这段时间继续收硬中断没有必要。处理量过大或 softirq 被推迟时，也可能由 `ksoftirqd` 这类内核线程继续处理。线上看到 `ksoftirqd` 或 `%si` 长时间偏高时，要联想到网络包处理、软中断压力和中断亲和性。硬中断只负责挂起后续工作，批量处理 packet 时已经切到了 softirq 或内核线程上下文。

## 缺页异常的正常路径和错误路径

Page Fault 这个名字容易让人以为程序已经出错。实际上，它只表示 CPU 做地址翻译或权限检查时，当前页表项没法直接完成这次访问。

常见情况有几类：

1. 页还没分配物理内存，例如懒分配的堆页第一次被访问；
2. 页在文件或 Swap 里，当前还没驻留到内存；
3. COW 页被写入，页表暂时标成只读，要内核复制一份；
4. 访问权限不对，比如用户态访问内核页、写只读页、执行不可执行页；
5. 地址根本不属于进程合法的虚拟地址区域。

![Page Fault 处理分支图](https://oss.javaguide.cn/github/javaguide/计算机基础/操作系统/page-fault-branching.webp)

内核处理 Page Fault 时，先看地址是否落在进程合法的 VMA 中，再看访问类型和权限是否契合。

合法缺页可以修复。内核分配物理页、从文件读页、从 Swap 换入，或者处理 COW，更新页表后返回。CPU 会重新执行触发异常的那条指令。这类缺页可能是 minor fault，也可能是 major fault，差别在于是否要实际 I/O。

地址不属于任何合法 VMA，或者访问方式违反页级权限时，内核通常会向当前线程投递 `SIGSEGV`。访问 `NULL` 附近、写只读映射都属于这类情况。C/C++ 里的越界访问则不保证触发 Page Fault：如果目标地址仍在已映射且权限允许的页面内，程序可能只是破坏了相邻数据。只有越界地址落到未映射区域或违反页权限时，硬件才会通过 Page Fault 把问题交给内核。

xv6 的 COW fork 和 lazy allocation 很适合帮助理解这一点。父子进程先共享只读页，谁写谁触发页故障，内核复制页面后让写入继续；进程扩大地址空间时，内核可以先只记录范围，等第一次访问再分配物理页。两个场景都借助 Page Fault 把工作延后。

`userfaultfd(2)` 可以作为一个高级例子：用户态注册某段内存后，missing、minor 或 write-protect 这类 page fault 可以变成 fd 上的事件；触发 fault 的线程先阻塞，另一个用户态线程补页、继续或解除写保护后再让它继续。这类机制常用于虚拟机迁移、懒加载和脏页跟踪，但普通后端业务很少直接用。

## 系统调用的成本

系统调用比普通函数调用重。普通函数调用仍在用户态，按照 ABI 传递参数、保存必要现场并完成跳转和返回；系统调用还要切到内核态，经过入口代码保存现场、执行权限检查，并可能访问页表、文件对象、设备驱动或等待队列。从内核返回用户态前，内核还可能检查待处理信号、抢占和调度标志等状态。

但系统调用的成本不能一概而论。`getpid()` 这类调用主要花在进入和退出内核；`read()` 碰到磁盘 I/O 时，主要成本在等待设备和数据复制。基于 futex 实现的锁在无竞争时通常只执行用户态原子操作，不调用 `futex(2)`；发生竞争、需要线程睡眠或唤醒时，才通过 `futex(2)` 进入内核。

工程上不要为了少一次系统调用牺牲正确性。更常见的优化是批量化和减少无意义等待：缓冲 I/O、一次读写更多数据、I/O 多路复用、`sendfile()`、`mmap()`、`io_uring`，分别在不同场景里减少模式切换、复制或等待成本。

## 面试回答要点

回答“中断、异常、系统调用是什么关系”，可以按入口来源说：

> CPU 正常按指令流执行。外设事件、当前指令错误、用户程序主动请求内核服务，都会让控制流进入内核。硬件中断来自外部设备，是异步的；同步异常由当前指令触发；系统调用则是程序通过 `syscall`、`ecall` 等指令主动触发的 trap，也属于同步事件。内核处理完以后，可能返回原程序继续执行，也可能调度别的线程，或者向进程投递信号。

回答“系统调用流程”，可以抓 `read()`：

> glibc 包装函数把系统调用号和参数放到约定寄存器里，执行 `syscall`。CPU 先按架构约定进入内核入口，Linux 入口代码再保存后续需要的寄存器状态，并根据系统调用号分发到对应处理函数，检查参数和权限，执行 VFS、网络、内存管理等逻辑。返回时把结果放回寄存器；出错时通常由 glibc 转成 `-1` 和 `errno`。如果调用要等待 I/O，线程会阻塞，后续设备中断再唤醒它。

回答“缺页异常和非法访问的区别”，抓住内核分流：

> Page Fault 只是 CPU 发现这次地址翻译或权限检查过不去。内核会判断地址和权限是否合法。合法缺页可以修复，比如分配匿名页、从文件或 Swap 调页、处理 COW，然后重新执行触发异常的指令；非法访问无法修复，通常投递 `SIGSEGV`，进程默认终止。

用户态/内核态切换和线程上下文切换不是一回事。一次真正的系统调用一定进入内核，但只有调度器选择了另一个执行实体时，CPU 才会切换线程，例如当前线程阻塞、主动让出 CPU 或被抢占。


---

<!-- source: 计算机网络/《计算机网络》（谢希仁）内容总结.md -->

---
title: 《计算机网络》（谢希仁）内容总结
description: 基于《计算机网络》教材的学习笔记，梳理术语与分层模型等核心知识点，便于期末复习与面试巩固。
category: 计算机基础
tag:
  - 计算机网络
head:
  - - meta
    - name: keywords
      content: 计算机网络,谢希仁,术语,分层模型,链路,主机,教材总结
---

这篇笔记来自我大二学习计算机网络时的整理，大部分内容参考谢希仁老师的[《计算机网络》第七版](https://www.elias.ltd/usr/local/etc/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C%EF%BC%88%E7%AC%AC7%E7%89%88%EF%BC%89%E8%B0%A2%E5%B8%8C%E4%BB%81.pdf)。

计算机网络教材内容很散：术语、分层、链路、路由、运输层、应用层都要串起来看。为了复习起来更顺，我对原来的笔记做了一次重构，并补充了一些示意图。

这篇文章主要回答几个问题：

1. 计算机网络里常见基础术语分别是什么意思？
2. OSI、TCP/IP 分层模型分别如何理解？
3. 链路层、网络层、运输层、应用层各自解决什么问题？
4. 复习《计算机网络》这本书时，哪些概念最容易混淆？

![《计算机网络》教材知识点总结概览](https://oss.javaguide.cn/p3-juejin/fb5d8645cd55484ab0177f25a13e97db~tplv-k3u1fbpfcp-zoom-1.png)

相关问题：[如何评价谢希仁的计算机网络（第七版）？ - 知乎](https://www.zhihu.com/question/327872966)。

## 1. 计算机网络概述

### 1.1. 基本术语

1. **结点（node）**：网络中的结点可以是计算机，集线器，交换机或路由器等。
2. **链路（link）**：从一个结点到另一个结点的一段物理线路。中间没有任何其他交点。
3. **主机（host）**：连接在因特网上的计算机。
4. **ISP（Internet Service Provider）**：因特网服务提供者（提供商）。

   ![ISP (Internet Service Provider) Definition](https://oss.javaguide.cn/p3-juejin/e77e26123d404d438d0c5943e3c65893~tplv-k3u1fbpfcp-zoom-1.png)

5. **IXP（Internet eXchange Point）**：互联网交换点 IXP 的主要作用就是允许两个网络直接相连并交换分组，而不需要再通过第三个网络来转发分组。

   ![IXP Traffic Levels During the Stratos Skydive — RIPE Labs](https://oss.javaguide.cn/p3-juejin/7f9a6ddaa09441ceac11cb77f7a69d8f~tplv-k3u1fbpfcp-zoom-1.png)

   <p style="text-align:center;font-size:13px;color:gray">https://labs.ripe.net/Members/fergalc/ixp-traffic-during-stratos-skydive</p>

6. **RFC（Request For Comments）**：意思是“请求评议”，包含了关于 Internet 几乎所有的重要的文字资料。
7. **广域网 WAN（Wide Area Network）**：任务是通过长距离运送主机发送的数据。
8. **城域网 MAN（Metropolitan Area Network）**：用来将多个局域网进行互连。
9. **局域网 LAN（Local Area Network）**：学校或企业大多拥有多个互连的局域网。

   ![MAN & WMAN | Red de área metropolitana, Redes informaticas, Par trenzado](https://oss.javaguide.cn/p3-juejin/eb48d21b2e984a63a26250010d7adac4~tplv-k3u1fbpfcp-zoom-1.png)

   <p style="text-align:center;font-size:13px;color:gray">http://conexionesmanwman.blogspot.com/</p>

10. **个人区域网 PAN（Personal Area Network）**：在个人工作的地方把属于个人使用的电子设备用无线技术连接起来的网络。

    ![Advantages and disadvantages of personal area network (PAN) - IT Release](https://oss.javaguide.cn/p3-juejin/54bd7b420388494fbe917e3c9c13f1a7~tplv-k3u1fbpfcp-zoom-1.png)

    <p style=”text-align:center;font-size:13px;color:gray”>https://www.itrelease.com/2018/07/advantages-and-disadvantages-of-personal-area-network-pan/</p>

11. **分组（packet）**：因特网中传送的数据单元。由首部 header 和数据段组成。分组又称为包，首部可称为包头。
12. **存储转发（store and forward）**：路由器收到一个分组，先检查分组是否正确，并过滤掉冲突包错误。确定包正确后，取出目的地址，通过查找表找到想要发送的输出端口地址，然后将该包发送出去。

    ![路由器存储转发分组的过程](https://oss.javaguide.cn/p3-juejin/addb6b2211444a4da9e0ffc129dd444f~tplv-k3u1fbpfcp-zoom-1.gif)

13. **带宽（bandwidth）**：在计算机网络中，表示在单位时间内从网络中的某一点到另一点所能通过的“最高数据率”。常用来表示网络的通信线路所能传送数据的能力。单位是“比特每秒”，记为 b/s。
14. **吞吐量（throughput）**：表示在单位时间内通过某个网络（或信道、接口）的数据量。吞吐量更经常地用于对现实世界中的网络的一种测量，以便知道实际上到底有多少数据量能够通过网络。吞吐量受网络的带宽或网络的额定速率的限制。

### 1.2. 重要知识点总结

1. **计算机网络（简称网络）把许多计算机连接在一起，而互联网把许多网络连接在一起，是网络的网络。**
2. 小写字母 i 开头的 internet（互联网）是通用名词，它泛指由多个计算机网络相互连接而成的网络。在这些网络之间的通信协议（即通信规则）可以是任意的。大写字母 I 开头的 Internet（互联网）是专用名词，它指全球最大的，开放的，由众多网络相互连接而成的特定的互联网，并采用 TCP/IP 协议作为通信规则，其前身为 ARPANET。Internet 的推荐译名为因特网，现在一般流行称为互联网。
3. 路由器是实现分组交换的关键构件，其任务是转发收到的分组，这是网络核心部分最重要的功能。分组交换采用存储转发技术，表示把一个报文（要发送的整块数据）分为几个分组后再进行传送。在发送报文之前，先把较长的报文划分成为一个个更小的等长数据段。在每个数据段的前面加上一些由必要的控制信息组成的首部后，就构成了一个分组。分组又称为包。分组是在互联网中传送的数据单元，正是由于分组的头部包含了诸如目的地址和源地址等重要控制信息，每一个分组才能在互联网中独立的选择传输路径，并正确地交付到分组传输的终点。
4. 互联网按工作方式可划分为边缘部分和核心部分。主机在网络的边缘部分，其作用是进行信息处理。由大量网络和连接这些网络的路由器组成核心部分，其作用是提供连通性和交换。
5. 计算机通信是计算机中进程（即运行着的程序）之间的通信。计算机网络采用的通信方式是客户-服务器方式（C/S 方式）和对等连接方式（P2P 方式）。
6. 客户和服务器都是指通信中所涉及的应用进程。客户是服务请求方，服务器是服务提供方。
7. 按照作用范围的不同，计算机网络分为广域网 WAN，城域网 MAN，局域网 LAN，个人区域网 PAN。
8. **计算机网络最常用的性能指标是：速率，带宽，吞吐量，时延（发送时延，处理时延，排队时延），时延带宽积，往返时间和信道利用率。**
9. 网络协议即协议，是为进行网络中的数据交换而建立的规则。计算机网络的各层以及其协议集合，称为网络的体系结构。
10. **五层体系结构由应用层，运输层，网络层（网际层），数据链路层，物理层组成。运输层最主要的协议是 TCP 和 UDP 协议，网络层最重要的协议是 IP 协议。**

![计算机网络五层体系结构概览](https://oss.javaguide.cn/p3-juejin/acec0fa44041449b8088872dcd7c0b3a~tplv-k3u1fbpfcp-zoom-1.gif)

下面的内容会介绍计算机网络的五层体系结构：**物理层+数据链路层+网络层（网际层）+运输层+应用层**。

## 2. 物理层（Physical Layer）

![物理层](https://oss.javaguide.cn/p3-juejin/cf1bfdd36e5f4bde94aea44bbe7a6f8a~tplv-k3u1fbpfcp-zoom-1.png)

### 2.1. 基本术语

1. **数据（data）**：运送消息的实体。
2. **信号（signal）**：数据的电气的或电磁的表现。或者说信号是适合在传输介质上传输的对象。
3. **码元（code）**：在使用时间域（或简称为时域）的波形来表示数字信号时，代表不同离散数值的基本波形。
4. **单工（simplex）**：只能有一个方向的通信而没有反方向的交互。
5. **半双工（half duplex）**：通信的双方都可以发送信息，但不能双方同时发送（当然也就不能同时接收）。
6. **全双工（full duplex）**：通信的双方可以同时发送和接收信息。

   ![单工、半双工和全双工通信方式对比](https://oss.javaguide.cn/p3-juejin/b1f02095b7c34eafb3c255ee81f58c2a~tplv-k3u1fbpfcp-zoom-1.png)

7. **失真**：失去真实性，主要是指接受到的信号和发送的信号不同，有磨损和衰减。影响失真程度的因素：1.码元传输速率 2.信号传输距离 3.噪声干扰 4.传输媒体质量

   ![信号传输失真示意图](https://oss.javaguide.cn/p3-juejin/f939342f543046459ffabdc476f7bca4~tplv-k3u1fbpfcp-zoom-1.png)

8. **奈氏准则**：在任何信道中，码元的传输的效率是有上限的，传输速率超过此上限，就会出现严重的码间串扰问题，使接收端对码元的判决（即识别）成为不可能。
9. **香农定理**：在带宽受限且有噪声的信道中，为了不产生误差，信息的数据传输速率有上限值。
10. **基带信号（baseband signal）**：来自信源的信号。指没有经过调制的数字信号或模拟信号。
11. **带通（频带）信号（bandpass signal）**：把基带信号经过载波调制后，把信号的频率范围搬移到较高的频段以便在信道中传输（即仅在一段频率范围内能够通过信道），这里调制过后的信号就是带通信号。
12. **调制（modulation）**：对信号源的信息进行处理后加到载波信号上，使其变为适合在信道传输的形式的过程。
13. **信噪比（signal-to-noise ratio）**：指信号的平均功率和噪声的平均功率之比，记为 S/N。信噪比（dB）=10\*log10（S/N）。
14. **信道复用（channel multiplexing）**：指多个用户共享同一个信道。（并不一定是同时）。

    ![信道复用技术](https://oss.javaguide.cn/p3-juejin/5d9bf7b3db324ae7a88fcedcbace45d8~tplv-k3u1fbpfcp-zoom-1.png)

15. **比特率（bit rate）**：单位时间（每秒）内传送的比特数。
16. **波特率（baud rate）**：单位时间载波调制状态改变的次数。针对数据信号对载波的调制速率。
17. **复用（multiplexing）**：共享信道的方法。
18. **ADSL（Asymmetric Digital Subscriber Line）**：非对称数字用户线。
19. **光纤同轴混合网（HFC 网）**：在目前覆盖范围很广的有线电视网的基础上开发的一种居民宽带接入网

### 2.2. 重要知识点总结

1. **物理层的主要任务就是确定与传输媒体接口有关的一些特性，如机械特性，电气特性，功能特性，过程特性。**
2. 一个数据通信系统可划分为三大部分，即源系统，传输系统，目的系统。源系统包括源点（或源站，信源）和发送器，目的系统包括接收器和终点。
3. **通信的目的是传送消息。如话音，文字，图像等都是消息，数据是运送消息的实体。信号则是数据的电气或电磁的表现。**
4. 根据信号中代表消息的参数的取值方式不同，信号可分为模拟信号（或连续信号）和数字信号（或离散信号）。在使用时间域（简称时域）的波形表示数字信号时，代表不同离散数值的基本波形称为码元。
5. 根据双方信息交互的方式，通信可划分为单向通信（或单工通信），双向交替通信（或半双工通信），双向同时通信（全双工通信）。
6. 来自信源的信号称为基带信号。信号要在信道上传输就要经过调制。调制有基带调制和带通调制之分。最基本的带通调制方法有调幅，调频和调相。还有更复杂的调制方法，如正交振幅调制。
7. 要提高数据在信道上的传递速率，可以使用更好的传输媒体，或使用先进的调制技术。但数据传输速率不可能任意被提高。
8. 传输媒体可分为两大类，即导引型传输媒体（双绞线，同轴电缆，光纤）和非导引型传输媒体（无线，红外，大气激光）。
9. 为了有效利用光纤资源，在光纤干线和用户之间广泛使用无源光网络 PON。无源光网络无需配备电源，其长期运营成本和管理成本都很低。最流行的无源光网络是以太网无源光网络 EPON 和吉比特无源光网络 GPON。

### 2.3. 补充

#### 2.3.1. 物理层主要做啥？

物理层主要做的事情就是 **透明地传送比特流**。也可以将物理层的主要任务描述为确定与传输媒体的接口的一些特性，即：机械特性（接口所用接线器的一些物理属性如形状和尺寸），电气特性（接口电缆的各条线上出现的电压的范围），功能特性（某条线上出现的某一电平的电压的意义），过程特性（对于不同功能的各种可能事件的出现顺序）。

**物理层考虑的是怎样才能在连接各种计算机的传输媒体上传输数据比特流，而不是指具体的传输媒体。** 现有的计算机网络中的硬件设备和传输媒体的种类非常繁多，而且通信手段也有许多不同的方式。物理层的作用正是尽可能地屏蔽掉这些传输媒体和通信手段的差异，使物理层上面的数据链路层感觉不到这些差异，这样就可以使数据链路层只考虑完成本层的协议和服务，而不必考虑网络的具体传输媒体和通信手段是什么。

#### 2.3.2. 几种常用的信道复用技术

1. **频分复用（FDM）**：所有用户在同样的时间占用不同的带宽资源。
2. **时分复用（TDM）**：所有用户在不同的时间占用同样的频带宽度（分时不分频）。
3. **统计时分复用（Statistic TDM）**：改进的时分复用，能够明显提高信道的利用率。
4. **码分复用（CDM）**：用户使用经过特殊挑选的不同码型，因此各用户之间不会造成干扰。这种系统发送的信号有很强的抗干扰能力，其频谱类似于白噪声，不易被敌人发现。
5. **波分复用（WDM）**：波分复用就是光的频分复用。

#### 2.3.3. 几种常用的宽带接入技术，主要是 ADSL 和 FTTx

用户到互联网的宽带接入方法有非对称数字用户线 ADSL（用数字技术对现有的模拟电话线进行改造，而不需要重新布线。ADSL 的快速版本是甚高速数字用户线 VDSL。），光纤同轴混合网 HFC（是在目前覆盖范围很广的有线电视网的基础上开发的一种居民宽带接入网）和 FTTx（即光纤到······）。

## 3. 数据链路层（Data Link Layer）

![数据链路层](https://oss.javaguide.cn/p3-juejin/83ec6dafc8c14ca185bafb656d86f0b2~tplv-k3u1fbpfcp-zoom-1.png)

### 3.1. 基本术语

1. **链路（link）**：一个结点到相邻结点的一段物理链路。
2. **数据链路（data link）**：把实现控制数据运输的协议的硬件和软件加到链路上就构成了数据链路。
3. **循环冗余检验 CRC（Cyclic Redundancy Check）**：为了保证数据传输的可靠性，CRC 是数据链路层广泛使用的一种检错技术。
4. **帧（frame）**：一个数据链路层的传输单元，由一个数据链路层首部和其携带的封包所组成协议数据单元。
5. **MTU（Maximum Transfer Uint）**：最大传送单元。帧的数据部分的长度上限。
6. **误码率 BER（Bit Error Rate）**：在一段时间内，传输错误的比特占所传输比特总数的比率。
7. **PPP（Point-to-Point Protocol）**：点对点协议。即用户计算机和 ISP 进行通信时所使用的数据链路层协议。以下是 PPP 帧的示意图：
   ![PPP 点对点协议帧格式](https://oss.javaguide.cn/p3-juejin/6b0310d3103c4149a725a28aaf001899~tplv-k3u1fbpfcp-zoom-1.jpeg)
8. **MAC 地址（Media Access Control 或者 Medium Access Control）**：意译为媒体访问控制，或称为物理地址、硬件地址，用来定义网络设备的位置。在 OSI 模型中，第三层网络层负责 IP 地址，第二层数据链路层则负责 MAC 地址。因此一个主机会有一个 MAC 地址，而每个网络位置会有一个专属于它的 IP 地址。地址是识别某个系统的重要标识符，“名字指出我们所要寻找的资源，地址指出资源所在的地方，路由告诉我们如何到达该处。”

   ![ARP (Address Resolution Protocol) explained](https://oss.javaguide.cn/p3-juejin/057b83e7ec5b4c149e56255a3be89141~tplv-k3u1fbpfcp-zoom-1.png)

9. **网桥（bridge）**：一种用于数据链路层实现中继，连接两个或多个局域网的网络互连设备。
10. **交换机（switch）**：广义的来说，交换机指的是一种通信系统中完成信息交换的设备。这里工作在数据链路层的交换机指的是交换式集线器，其实质是一个多接口的网桥

### 3.2. 重要知识点总结

1. 链路是从一个结点到相邻结点的一段物理链路，数据链路则在链路的基础上增加了一些必要的硬件（如网络适配器）和软件（如协议的实现）
2. 数据链路层使用的主要是**点对点信道**和**广播信道**两种。
3. 数据链路层传输的协议数据单元是帧。数据链路层的三个基本问题是：**封装成帧**，**透明传输**和**差错检测**
4. **循环冗余检验 CRC** 是一种检错方法，而帧检验序列 FCS 是添加在数据后面的冗余码
5. **点对点协议 PPP** 是数据链路层使用最多的一种协议，它的特点是：简单，只检测差错而不去纠正差错，不使用序号，也不进行流量控制，可同时支持多种网络层协议
6. PPPoE 是为宽带上网的主机使用的链路层协议
7. **局域网的优点是：具有广播功能，从一个站点可方便地访问全网；便于系统的扩展和逐渐演变；提高了系统的可靠性，可用性和生存性。**
8. 计算机与外接局域网通信需要通过通信适配器（或网络适配器），它又称为网络接口卡或网卡。**计算器的硬件地址就在适配器的 ROM 中**。
9. 以太网采用的无连接的工作方式，对发送的数据帧不进行编号，也不要求对方发回确认。目的站收到有差错帧就把它丢掉，其他什么也不做
10. 以太网采用的协议是具有冲突检测的**载波监听多点接入 CSMA/CD**。协议的特点是：**发送前先监听，边发送边监听，一旦发现总线上出现了碰撞，就立即停止发送。然后按照退避算法等待一段随机时间后再次发送。** 因此，每一个站点在自己发送数据之后的一小段时间内，存在着遭遇碰撞的可能性。以太网上的各站点平等地争用以太网信道
11. 以太网的适配器具有过滤功能，它只接收单播帧，广播帧和多播帧。
12. 使用集线器可以在物理层扩展以太网（扩展后的以太网仍然是一个网络）

### 3.3. 补充

1. 数据链路层的点对点信道和广播信道的特点，以及这两种信道所使用的协议（PPP 协议以及 CSMA/CD 协议）的特点
2. 数据链路层的三个基本问题：**封装成帧**，**透明传输**，**差错检测**
3. 以太网的 MAC 层硬件地址
4. 适配器，转发器，集线器，网桥，以太网交换机的作用以及适用场合

## 4. 网络层（Network Layer）

![网络层](https://oss.javaguide.cn/p3-juejin/775dc8136bec486aad4f1182c68f24cd~tplv-k3u1fbpfcp-zoom-1.png)

### 4.1. 基本术语

1. **虚电路（Virtual Circuit）** : 在两个终端设备的逻辑或物理端口之间，通过建立的双向的透明传输通道。虚电路表示这只是一条逻辑上的连接，分组都沿着这条逻辑连接按照存储转发方式传送，而并不是真正建立了一条物理连接。
2. **IP（Internet Protocol）**：网际协议 IP 是 TCP/IP 体系中两个最主要的协议之一，是 TCP/IP 体系结构网际层的核心。配套的有 ARP，RARP，ICMP，IGMP。
3. **ARP（Address Resolution Protocol）** : 地址解析协议。地址解析协议 ARP 把 IP 地址解析为硬件地址。
4. **ICMP（Internet Control Message Protocol）**：网际控制报文协议（ICMP 允许主机或路由器报告差错情况和提供有关异常情况的报告）。
5. **子网掩码（subnet mask）**：它是一种用来指明一个 IP 地址的哪些位标识的是主机所在的子网以及哪些位标识的是主机的位掩码。子网掩码不能单独存在，它必须结合 IP 地址一起使用。
6. **CIDR（Classless Inter-Domain Routing）**：无分类域间路由选择（特点是消除了传统的 A 类、B 类和 C 类地址以及划分子网的概念，并使用各种长度的“网络前缀”（network-prefix）来代替分类地址中的网络号和子网号）。
7. **默认路由（default route）**：当在路由表中查不到能到达目的地址的路由时，路由器选择的路由。默认路由还可以减小路由表所占用的空间和搜索路由表所用的时间。
8. **路由选择算法（Routing Algorithm）**：路由选择协议的核心部分。因特网采用自适应的、分层次的路由选择协议。

### 4.2. 重要知识点总结

1. **TCP/IP 协议中的网络层向上只提供简单灵活的，无连接的，尽最大努力交付的数据报服务。网络层不提供服务质量的承诺，不保证分组交付的时限，所传送的分组可能出错、丢失、重复和失序。进程之间通信的可靠性由运输层负责**
2. 在互联网的交付有两种，一是在本网络直接交付不用经过路由器，另一种是和其他网络的间接交付，至少经过一个路由器，但最后一次一定是直接交付
3. 分类的 IP 地址由网络号字段（指明网络）和主机号字段（指明主机）组成。网络号字段最前面的类别指明 IP 地址的类别。IP 地址是一种分等级的地址结构。IP 地址管理机构分配 IP 地址时只分配网络号，主机号由得到该网络号的单位自行分配。路由器根据目的主机所连接的网络号来转发分组。一个路由器至少连接到两个网络，所以一个路由器至少应当有两个不同的 IP 地址
4. IP 数据报分为首部和数据两部分。首部的前一部分是固定长度，共 20 字节，是所有 IP 数据包必须具有的（源地址，目的地址，总长度等重要地段都固定在首部）。一些长度可变的可选字段固定在首部的后面。IP 首部中的生存时间给出了 IP 数据报在互联网中所能经过的最大路由器数。可防止 IP 数据报在互联网中无限制的兜圈子。
5. **地址解析协议 ARP 把 IP 地址解析为硬件地址。ARP 的高速缓存可以大大减少网络上的通信量。因为这样可以使主机下次再与同样地址的主机通信时，可以直接从高速缓存中找到所需要的硬件地址而不需要再去以广播方式发送 ARP 请求分组**
6. 无分类域间路由选择 CIDR 是解决目前 IP 地址紧缺的一个好办法。CIDR 记法在 IP 地址后面加上斜线“/”，然后写上前缀所占的位数。前缀（或网络前缀）用来指明网络，前缀后面的部分是后缀，用来指明主机。CIDR 把前缀都相同的连续的 IP 地址组成一个“CIDR 地址块”，IP 地址分配都以 CIDR 地址块为单位。
7. 网际控制报文协议是 IP 层的协议。ICMP 报文作为 IP 数据报的数据，加上首部后组成 IP 数据报发送出去。使用 ICMP 数据报并不是为了实现可靠传输。ICMP 允许主机或路由器报告差错情况和提供有关异常情况的报告。ICMP 报文的种类有两种，即 ICMP 差错报告报文和 ICMP 询问报文。
8. **要解决 IP 地址耗尽的问题，最根本的办法是采用具有更大地址空间的新版本 IP 协议-IPv6。** IPv6 所带来的变化有 ① 更大的地址空间（采用 128 位地址）② 灵活的首部格式 ③ 改进的选项 ④ 支持即插即用 ⑤ 支持资源的预分配 ⑥IPv6 的首部改为 8 字节对齐。
9. **虚拟专用网络 VPN 利用公用的互联网作为本机构专用网之间的通信载体。VPN 内使用互联网的专用地址。一个 VPN 至少要有一个路由器具有合法的全球 IP 地址，这样才能和本系统的另一个 VPN 通过互联网进行通信。所有通过互联网传送的数据都需要加密。**
10. MPLS 的特点是：① 支持面向连接的服务质量 ② 支持流量工程，平衡网络负载 ③ 有效的支持虚拟专用网 VPN。MPLS 在入口节点给每一个 IP 数据报打上固定长度的“标记”，然后根据标记在第二层（链路层）用硬件进行转发（在标记交换路由器中进行标记交换），因而转发速率大大加快。

## 5. 传输层（Transport Layer）

![传输层](https://oss.javaguide.cn/p3-juejin/9fe85e137e7f4f03a580512200a59609~tplv-k3u1fbpfcp-zoom-1.png)

### 5.1. 基本术语

1. **进程（process）**：指计算机中正在运行的程序实体。
2. **应用进程互相通信**：一台主机的进程和另一台主机中的一个进程交换数据的过程（另外注意通信真正的端点不是主机而是主机中的进程，也就是说端到端的通信是应用进程之间的通信）。
3. **传输层的复用与分用**：复用指发送方不同的进程都可以通过同一个运输层协议传送数据。分用指接收方的运输层在剥去报文的首部后能把这些数据正确的交付到目的应用进程。
4. **TCP（Transmission Control Protocol）**：传输控制协议。
5. **UDP（User Datagram Protocol）**：用户数据报协议。

   ![TCP 和 UDP](https://oss.javaguide.cn/p3-juejin/b136e69e0b9b426782f77623dcf098bd~tplv-k3u1fbpfcp-zoom-1.png)

6. **端口（port）**：端口的目的是为了确认对方机器的哪个进程在与自己进行交互，比如 MSN 和 QQ 的端口不同，如果没有端口就可能出现 QQ 进程和 MSN 交互错误。端口又称协议端口号。
7. **停止等待协议（stop-and-wait）**：指发送方每发送完一个分组就停止发送，等待对方确认，在收到确认之后在发送下一个分组。
8. **流量控制**：就是让发送方的发送速率不要太快，既要让接收方来得及接收，也不要使网络发生拥塞。
9. **拥塞控制**：防止过多的数据注入到网络中，这样可以使网络中的路由器或链路不致过载。拥塞控制所要做的都有一个前提，就是网络能够承受现有的网络负荷。

### 5.2. 重要知识点总结

1. **运输层提供应用进程之间的逻辑通信，也就是说，运输层之间的通信并不是真正在两个运输层之间直接传输数据。运输层向应用层屏蔽了下面网络的细节（如网络拓补，所采用的路由选择协议等），它使应用进程之间看起来好像两个运输层实体之间有一条端到端的逻辑通信信道。**
2. **网络层为主机提供逻辑通信，而运输层为应用进程之间提供端到端的逻辑通信。**
3. 运输层的两个重要协议是用户数据报协议 UDP 和传输控制协议 TCP。按照 OSI 的术语，两个对等运输实体在通信时传送的数据单位叫做运输协议数据单元 TPDU（Transport Protocol Data Unit）。但在 TCP/IP 体系中，则根据所使用的协议是 TCP 或 UDP，分别称之为 TCP 报文段或 UDP 用户数据报。
4. **UDP 在传送数据之前不需要先建立连接，远地主机在收到 UDP 报文后，不需要给出任何确认。虽然 UDP 不提供可靠交付，但在某些情况下 UDP 确是一种最有效的工作方式。TCP 提供面向连接的服务。在传送数据之前必须先建立连接，数据传送结束后要释放连接。TCP 不提供广播或多播服务。由于 TCP 要提供可靠的，面向连接的传输服务，难以避免地增加了许多开销，如确认，流量控制，计时器以及连接管理等。这不仅使协议数据单元的首部增大很多，还要占用许多处理机资源。**
5. 硬件端口是不同硬件设备进行交互的接口，而软件端口是应用层各种协议进程与运输实体进行层间交互的一种地址。UDP 和 TCP 的首部格式中都有源端口和目的端口这两个重要字段。当运输层收到 IP 层交上来的运输层报文时，就能够根据其首部中的目的端口号把数据交付应用层的目的应用层。（两个进程之间进行通信不光要知道对方 IP 地址而且要知道对方的端口号（为了找到对方计算机中的应用进程））
6. 运输层用一个 16 位端口号标志一个端口。端口号只有本地意义，它只是为了标志计算机应用层中的各个进程在和运输层交互时的层间接口。在互联网的不同计算机中，相同的端口号是没有关联的。协议端口号简称端口。虽然通信的终点是应用进程，但只要把所发送的报文交到目的主机的某个合适端口，剩下的工作（最后交付目的进程）就由 TCP 和 UDP 来完成。
7. 运输层的端口号分为服务器端使用的端口号（0&tilde;1023 指派给熟知端口，1024&tilde;49151 是登记端口号）和客户端暂时使用的端口号（49152&tilde;65535）
8. **UDP 的主要特点是 ① 无连接 ② 尽最大努力交付 ③ 面向报文 ④ 无拥塞控制 ⑤ 支持一对一，一对多，多对一和多对多的交互通信 ⑥ 首部开销小（只有四个字段：源端口，目的端口，长度和检验和）**
9. **TCP 的主要特点是 ① 面向连接 ② 每一条 TCP 连接只能是一对一的 ③ 提供可靠交付 ④ 提供全双工通信 ⑤ 面向字节流**
10. **TCP 用主机的 IP 地址加上主机上的端口号作为 TCP 连接的端点。这样的端点就叫做套接字（socket）或插口。套接字用（IP 地址：端口号）来表示。每一条 TCP 连接唯一地被通信两端的两个端点所确定。**
11. 停止等待协议是为了实现可靠传输的，它的基本原理就是每发完一个分组就停止发送，等待对方确认。在收到确认后再发下一个分组。
12. 为了提高传输效率，发送方可以不使用低效率的停止等待协议，而是采用流水线传输。流水线传输就是发送方可连续发送多个分组，不必每发完一个分组就停下来等待对方确认。这样可使信道上一直有数据不间断的在传送。这种传输方式可以明显提高信道利用率。
13. 停止等待协议中超时重传是指只要超过一段时间仍然没有收到确认，就重传前面发送过的分组（认为刚才发送过的分组丢失了）。因此每发送完一个分组需要设置一个超时计时器，其重传时间应比数据在分组传输的平均往返时间更长一些。这种自动重传方式常称为自动重传请求 ARQ。另外在停止等待协议中若收到重复分组，就丢弃该分组，但同时还要发送确认。连续 ARQ 协议可提高信道利用率。发送维持一个发送窗口，凡位于发送窗口内的分组可连续发送出去，而不需要等待对方确认。接收方一般采用累积确认，对按序到达的最后一个分组发送确认，表明到这个分组位置的所有分组都已经正确收到了。
14. TCP 报文段的前 20 个字节是固定的，其后有 40 字节长度的可选字段。如果加入可选字段后首部长度不是 4 的整数倍字节，需要在再在之后用 0 填充。因此，TCP 首部的长度取值为 20+4n 字节，最长为 60 字节。
15. **TCP 使用滑动窗口机制。发送窗口里面的序号表示允许发送的序号。发送窗口后沿的后面部分表示已发送且已收到确认，而发送窗口前沿的前面部分表示不允许发送。发送窗口后沿的变化情况有两种可能，即不动（没有收到新的确认）和前移（收到了新的确认）。发送窗口的前沿通常是不断向前移动的。一般来说，我们总是希望数据传输更快一些。但如果发送方把数据发送的过快，接收方就可能来不及接收，这就会造成数据的丢失。所谓流量控制就是让发送方的发送速率不要太快，要让接收方来得及接收。**
16. 在某段时间，若对网络中某一资源的需求超过了该资源所能提供的可用部分，网络的性能就要变坏。这种情况就叫拥塞。拥塞控制就是为了防止过多的数据注入到网络中，这样就可以使网络中的路由器或链路不致过载。拥塞控制所要做的都有一个前提，就是网络能够承受现有的网络负荷。拥塞控制是一个全局性的过程，涉及到所有的主机，所有的路由器，以及与降低网络传输性能有关的所有因素。相反，流量控制往往是点对点通信量的控制，是个端到端的问题。流量控制所要做到的就是抑制发送端发送数据的速率，以便使接收端来得及接收。
17. **为了进行拥塞控制，TCP 发送方要维持一个拥塞窗口 cwnd 的状态变量。拥塞控制窗口的大小取决于网络的拥塞程度，并且动态变化。发送方让自己的发送窗口取为拥塞窗口和接收方的接受窗口中较小的一个。**
18. **TCP 的拥塞控制采用了四种算法，即慢开始，拥塞避免，快重传和快恢复。在网络层也可以使路由器采用适当的分组丢弃策略（如主动队列管理 AQM），以减少网络拥塞的发生。**
19. 运输连接的三个阶段，即：连接建立，数据传送和连接释放。
20. **主动发起 TCP 连接建立的应用进程叫做客户，而被动等待连接建立的应用进程叫做服务器。TCP 连接采用三报文握手机制。服务器要确认用户的连接请求，然后客户要对服务器的确认进行确认。**
21. TCP 的连接释放采用四报文握手机制。任何一方都可以在数据传送结束后发出连接释放的通知，待对方确认后进入半关闭状态。当另一方也没有数据再发送时，则发送连接释放通知，对方确认后就完全关闭了 TCP 连接

### 5.3. 补充（重要）

以下知识点需要重点关注：

1. 端口和套接字的意义
2. UDP 和 TCP 的区别以及两者的应用场景
3. 在不可靠的网络上实现可靠传输的工作原理，停止等待协议和 ARQ 协议
4. TCP 的滑动窗口，流量控制，拥塞控制和连接管理
5. TCP 的三次握手，四次挥手机制

## 6. 应用层（Application Layer）

![应用层](https://oss.javaguide.cn/p3-juejin/0f13f0ee13b24af7bdddf56162eb6602~tplv-k3u1fbpfcp-zoom-1.png)

### 6.1. 基本术语

1. **域名系统（DNS）**：域名系统（DNS，Domain Name System）将人类可读的域名（例如，www.baidu.com）转换为机器可读的 IP 地址（例如，220.181.38.148）。我们可以将其理解为专为互联网设计的电话薄。

   ![DNS 将域名解析为 IP 地址的过程](https://oss.javaguide.cn/p3-juejin/e7da4b07947f4c0094d46dc96a067df0~tplv-k3u1fbpfcp-zoom-1.png)

   <p style="text-align:right;font-size:12px">https://www.seobility.net/en/wiki/HTTP_headers</p>

2. **文件传输协议（FTP）**：FTP 是 File Transfer Protocol（文件传输协议）的英文简称，而中文简称为“文传协议”。用于 Internet 上的控制文件的双向传输。同时，它也是一个应用程序（Application）。基于不同的操作系统有不同的 FTP 应用程序，而所有这些应用程序都遵守同一种协议以传输文件。在 FTP 的使用当中，用户经常遇到两个概念：“下载”（Download）和“上传”（Upload）。 “下载”文件就是从远程主机拷贝文件至自己的计算机上；“上传”文件就是将文件从自己的计算机中拷贝至远程主机上。用 Internet 语言来说，用户可通过客户机程序向（从）远程主机上传（下载）文件。

   ![FTP工作过程](https://oss.javaguide.cn/p3-juejin/f3f2caaa361045a38fb89bb9fee15bd3~tplv-k3u1fbpfcp-zoom-1.png)

3. **简单文件传输协议（TFTP）**：TFTP（Trivial File Transfer Protocol,简单文件传输协议）是 TCP/IP 协议族中的一个用来在客户机与服务器之间进行简单文件传输的协议，提供不复杂、开销不大的文件传输服务。端口号为 69。
4. **远程终端协议（TELNET）**：Telnet 协议是 TCP/IP 协议族中的一员，是 Internet 远程登陆服务的标准协议和主要方式。它为用户提供了在本地计算机上完成远程主机工作的能力。在终端使用者的电脑上使用 telnet 程序，用它连接到服务器。终端使用者可以在 telnet 程序中输入命令，这些命令会在服务器上运行，就像直接在服务器的控制台上输入一样。可以在本地就能控制服务器。要开始一个 telnet 会话，必须输入用户名和密码来登录服务器。Telnet 是常用的远程控制 Web 服务器的方法。
5. **万维网（WWW）**：WWW 是环球信息网的缩写，（亦作“Web”、“WWW”、“'W3'”，英文全称为“World Wide Web”），中文名字为“万维网”，“环球网”等，常简称为 Web。分为 Web 客户端和 Web 服务器程序。WWW 可以让 Web 客户端（常用浏览器）访问浏览 Web 服务器上的页面。是一个由许多互相链接的超文本组成的系统，通过互联网访问。在这个系统中，每个有用的事物，称为一样“资源”；并且由一个全局“统一资源标识符”（URI）标识；这些资源通过超文本传输协议（Hypertext Transfer Protocol）传送给用户，而后者通过点击链接来获得资源。万维网联盟（英语：World Wide Web Consortium，简称 W3C），又称 W3C 理事会。1994 年 10 月在麻省理工学院（MIT）计算机科学实验室成立。万维网联盟的创建者是万维网的发明者蒂姆·伯纳斯-李。万维网并不等同互联网，万维网只是互联网所能提供的服务其中之一，是靠着互联网运行的一项服务。
6. **万维网的大致工作工程：**

   ![万维网的大致工作工程](https://oss.javaguide.cn/p3-juejin/ba628fd37fdc4ba59c1a74eae32e03b1~tplv-k3u1fbpfcp-zoom-1.jpeg)

7. **统一资源定位符（URL）**：统一资源定位符是对可以从互联网上得到的资源的位置和访问方法的一种简洁的表示，是互联网上标准资源的地址。互联网上的每个文件都有一个唯一的 URL，它包含的信息指出文件的位置以及浏览器应该怎么处理它。
8. **超文本传输协议（HTTP）**：超文本传输协议（HTTP，HyperText Transfer Protocol）是互联网上应用最为广泛的一种网络协议。所有的 WWW 文件都必须遵守这个标准。设计 HTTP 最初的目的是为了提供一种发布和接收 HTML 页面的方法。1960 年美国人 Ted Nelson 构思了一种通过计算机处理文本信息的方法，并称之为超文本（hypertext）,这成为了 HTTP 超文本传输协议标准架构的发展根基。

   HTTP 协议的本质就是一种浏览器与服务器之间约定好的通信格式。HTTP 的原理如下图所示：

   ![HTTP 客户端和服务器请求响应过程](https://oss.javaguide.cn/p3-juejin/8e3efca026654874bde8be88c96e1783~tplv-k3u1fbpfcp-zoom-1.jpeg)

9. **代理服务器（Proxy Server）**：代理服务器（Proxy Server）是一种网络实体，它又称为万维网高速缓存。代理服务器把最近的一些请求和响应暂存在本地磁盘中。当新请求到达时，若代理服务器发现这个请求与暂时存放的请求相同，就返回暂存的响应，而不需要按 URL 的地址再次去互联网访问该资源。代理服务器可在客户端或服务器工作，也可以在中间系统工作。
10. **简单邮件传输协议（SMTP）**：SMTP（Simple Mail Transfer Protocol）即简单邮件传输协议，它是一组用于由源地址到目的地址传送邮件的规则，由它来控制信件的中转方式。SMTP 协议属于 TCP/IP 协议簇，它帮助每台计算机在发送或中转信件时找到下一个目的地。通过 SMTP 协议所指定的服务器，就可以把 E-mail 寄到收信人的服务器上了，整个过程只要几分钟。SMTP 服务器则是遵循 SMTP 协议的发送邮件服务器，用来发送或中转发出的电子邮件。

    ![一个电子邮件被发送的过程](https://oss.javaguide.cn/p3-juejin/2bdccb760474435aae52559f2ef9652f~tplv-k3u1fbpfcp-zoom-1.png)

    <p style="text-align:right;font-size:12px">https://www.campaignmonitor.com/resources/knowledge-base/what-is-the-code-that-makes-bcc-or-cc-operate-in-an-email/</p>

11. **搜索引擎**：搜索引擎（Search Engine）是指根据一定的策略、运用特定的计算机程序从互联网上搜集信息，在对信息进行组织和处理后，为用户提供检索服务，将用户检索相关的信息展示给用户的系统。搜索引擎包括全文索引、目录索引、元搜索引擎、垂直搜索引擎、集合式搜索引擎、门户搜索引擎与免费链接列表等。

12. **垂直搜索引擎**：垂直搜索引擎是针对某一个行业的专业搜索引擎，是搜索引擎的细分和延伸，是对网页库中的某类专门的信息进行一次整合，定向分字段抽取出需要的数据进行处理后再以某种形式返回给用户。垂直搜索是相对通用搜索引擎的信息量大、查询不准确、深度不够等提出来的新的搜索引擎服务模式，通过针对某一特定领域、某一特定人群或某一特定需求提供的有一定价值的信息和相关服务。其特点就是“专、精、深”，且具有行业色彩，相比较通用搜索引擎的海量信息无序化，垂直搜索引擎则显得更加专注、具体和深入。
13. **全文索引** :全文索引技术是目前搜索引擎的关键技术。试想在 1M 大小的文件中搜索一个词，可能需要几秒，在 100M 的文件中可能需要几十秒，如果在更大的文件中搜索那么就需要更大的系统开销，这样的开销是不现实的。所以在这样的矛盾下出现了全文索引技术，有时候有人叫倒排文档技术。
14. **目录索引**：目录索引（search index/directory），顾名思义就是将网站分门别类地存放在相应的目录中，因此用户在查询信息时，可选择关键词搜索，也可按分类目录逐层查找。

### 6.2. 重要知识点总结

1. 文件传输协议（FTP）使用 TCP 可靠的运输服务。FTP 使用客户服务器方式。一个 FTP 服务器进程可以同时为多个用户提供服务。在进行文件传输时，FTP 的客户和服务器之间要先建立两个并行的 TCP 连接：控制连接和数据连接。实际用于传输文件的是数据连接。
2. 万维网客户程序与服务器之间进行交互使用的协议是超文本传输协议 HTTP。HTTP 使用 TCP 连接进行可靠传输。但 HTTP 本身是无连接、无状态的。HTTP/1.1 协议使用了持续连接（分为非流水线方式和流水线方式）
3. 电子邮件把邮件发送到收件人使用的邮件服务器，并放在其中的收件人邮箱中，收件人可随时上网到自己使用的邮件服务器读取，相当于电子邮箱。
4. 一个电子邮件系统有三个重要组成构件：用户代理、邮件服务器、邮件协议（包括邮件发送协议，如 SMTP，和邮件读取协议，如 POP3 和 IMAP）。用户代理和邮件服务器都要运行这些协议。

### 6.3. 补充（重要）

以下知识点需要重点关注：

1. 应用层的常见协议（重点关注 HTTP 协议）
2. 域名系统-从域名解析出 IP 地址
3. 访问一个网站大致的过程
4. 系统调用和应用编程接口概念

<!-- @include: @article-footer.snippet.md -->


---

<!-- source: 计算机网络/ARP 协议详解（网络层）.md -->

---
title: ARP 协议详解（网络层）
description: 讲解 ARP 的地址解析机制与报文流程，结合 ARP 表与广播/单播详解常见攻击与防御策略。
category: 计算机基础
tag:
  - 计算机网络
head:
  - - meta
    - name: keywords
      content: ARP,地址解析,IP到MAC,广播问询,单播响应,ARP表,欺骗
---

IP 地址负责网络层寻址，但数据帧在局域网里真正转发时，还需要知道下一跳设备的 MAC 地址。

ARP 要解决的就是这个转换问题：**已知目标 IP 地址，如何找到对应的 MAC 地址**。它看起来简单，却串起了网络层和链路层，也是理解局域网通信、网关转发和 ARP 欺骗的基础。

这篇文章主要回答几个问题：

1. ARP 在协议栈中处于什么位置？
2. ARP 如何通过广播问询、单播响应完成地址解析？
3. ARP 表有什么作用，缓存过期会带来什么影响？
4. 常见 ARP 攻击是怎么发生的，又该如何防御？

## MAC 地址

在介绍 ARP 协议之前，有必要介绍一下 MAC 地址。

MAC 地址的全称是 **媒体访问控制地址（Media Access Control Address）**，用于标识链路层接口并在本地网络中传输数据帧。它属于网络接口，而不是整台设备的永久身份证；一台设备可以有多个网络接口，每个接口可以使用不同的 MAC 地址。

![路由器的背面就会注明 MAC 位址](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/router-back-will-indicate-mac-address.png)

MAC 地址也常被称为 LAN 地址、物理地址或以太网地址。与用于网络层路由的 IP 地址不同，MAC 地址主要在当前链路或广播域内使用。

> 还有一点要知道的是，不仅仅是网络资源才有 IP 地址，网络设备也有 IP 地址，比如路由器。但从结构上说，路由器等网络设备的作用是组成一个网络，而且通常是内网，所以它们使用的 IP 地址通常是内网 IP，内网的设备在与内网以外的设备进行通信时，需要用到 NAT 协议。

以太网常见的 MAC 地址是 6 字节（48 比特）的 EUI-48。IEEE 会分配 MA-L、MA-M、MA-S 等不同大小的地址块，由厂商继续分配全局管理地址；此外还存在本地管理地址，不需要由 IEEE 全局分配。操作系统可以修改或随机化 MAC 地址，因此地址并不保证永久不变，不同网络中也可能出现相同地址。

最后，记住，MAC 地址有一个特殊地址：FF-FF-FF-FF-FF-FF（全 1 地址），该地址表示广播地址。

## ARP 协议工作原理

ARP 协议工作时有一个大前提，那就是 **ARP 表**。

在一个局域网内，每个网络设备都自己维护了一个 ARP 表，ARP 表记录了某些其他网络设备的 IP 地址-MAC 地址映射关系，该映射关系以 `<IP, MAC, TTL>` 三元组的形式存储。其中，TTL 为该映射关系的生存周期，典型值为 20 分钟，超过该时间，该条目将被丢弃。

ARP 的工作原理将分两种场景讨论：

1. **同一局域网内的 MAC 寻址**；
2. **从一个局域网到另一个局域网中的网络设备的寻址**。

### 同一局域网内的 MAC 寻址

假设当前有如下场景：IP 地址为 `137.196.7.23` 的主机 A，想要给同一局域网内的 IP 地址为 `137.196.7.14` 主机 B，发送 IP 数据报文。

> 再次强调，当主机发送 IP 数据报文时（网络层），仅知道目的地的 IP 地址，并不清楚目的地的 MAC 地址，而 ARP 协议就是解决这一问题的。

为了达成这一目标，主机 A 将不得不通过 ARP 协议来获取主机 B 的 MAC 地址，并将 IP 报文封装成链路层帧，发送到下一跳上。在该局域网内，关于此将按照时间顺序，依次发生如下事件：

1. 主机 A 检索自己的 ARP 表，发现 ARP 表中并无主机 B 的 IP 地址对应的映射条目，也就无从知道主机 B 的 MAC 地址。

2. 主机 A 将构造一个 ARP 查询分组，并将其广播到所在的局域网中。

   ARP 查询和响应报文具有相同的字段格式，包含发送方和目标方的协议地址、硬件地址。主机 A 发送请求时，ARP 报文中的发送方 IP、发送方 MAC 和目标 IP 都已知，但目标硬件地址还未知，通常填全零。承载这个 ARP 请求的**以太网帧**才会把目的 MAC 设置为广播地址 `FF-FF-FF-FF-FF-FF`，从而让当前广播域内的接口都能收到请求。不要把以太网帧的目的 MAC 与 ARP 报文内部的目标硬件地址混为一谈。

3. 主机 A 构造的查询分组将在该局域网内广播，理论上，每一个设备都会收到该分组，并检查查询分组的接收 IP 地址是否为自己的 IP 地址，如果是，说明查询分组已经到达了主机 B，否则，该查询分组对当前设备无效，丢弃之。

4. 主机 B 收到了查询分组之后，验证是对自己的问询，接着构造一个 ARP 响应分组，该分组的目的地只有一个——主机 A，发送给主机 A。同时，主机 B 提取查询分组中的 IP 地址和 MAC 地址信息，在自己的 ARP 表中构造一条主机 A 的 IP-MAC 映射记录。

   ARP 响应分组具有和 ARP 查询分组相同的构造，不同的是，发送和接受的 IP 地址恰恰相反，发送的 MAC 地址为发送者本身，目标 MAC 地址为查询分组的发送者，也就是说，ARP 响应分组只有一个目的地，而非广播。

5. 主机 A 终将收到主机 B 的响应分组，提取出该分组中的 IP 地址和 MAC 地址后，构造映射信息，加入到自己的 ARP 表中。

![同一局域网内通过 ARP 获取目标主机 MAC 地址](./images/ARP 协议详解（网络层）/arp_same_lan.png)

在整个过程中，有几点需要补充说明的是：

1. 主机 A 想要给主机 B 发送 IP 数据报，如果主机 B 的 IP-MAC 映射信息已经存在于主机 A 的 ARP 表中，那么主机 A 无需广播，只需提取 MAC 地址并构造链路层帧发送即可。
2. ARP 表中的映射信息是有生存周期的，典型值为 20 分钟。
3. 目标主机接收到了问询主机构造的问询报文后，将先把问询主机的 IP-MAC 映射存进自己的 ARP 表中，这样才能获取到响应的目标 MAC 地址，顺利的发送响应分组。

总结来说，ARP 协议是一个**广播问询，单播响应**协议。

### 不同局域网内的 MAC 寻址

更复杂的情况是，发送主机 A 和接收主机 B 不在同一个子网中，假设一个一般场景，两台主机所在的子网由一台路由器联通。这里需要注意的是，一般情况下，我们说网络设备都有一个 IP 地址和一个 MAC 地址，这里说的网络设备，更严谨的说法应该是一个接口。路由器作为互联设备，具有多个接口，每个接口同样也应该具备不重复的 IP 地址和 MAC 地址。因此，在讨论 ARP 表时，路由器的多个接口都各自维护一个 ARP 表，而非一个路由器只维护一个 ARP 表。

以太网广播帧会被当前广播域内的接口接收，与 ARP 报文中的目标 IP 是否和发送方同一子网无关；但只有认为目标 IP 属于自己的节点才会正常响应。实际发送 IP 数据报前，主机会先查询路由表。如果目的地址不在直连前缀内，主机不会解析远端主机的 MAC，而是使用 ARP 解析下一跳路由器接口的 MAC。整个过程按照时间顺序发生的事件如下：

1. 主机 A 查询 ARP 表，期望寻找到目标路由器的本子网接口的 MAC 地址。

   目标路由器指的是，根据目的主机 B 的 IP 地址，分析出 B 所在的子网，能够把报文转发到 B 所在子网的那个路由器。

2. 主机 A 未能找到目标路由器的本子网接口的 MAC 地址，将采用 ARP 协议，问询到该 MAC 地址，由于目标接口与主机 A 在同一个子网内，该过程与同一局域网内的 MAC 寻址相同。

3. 主机 A 获取到目标接口的 MAC 地址，先构造 IP 数据报，其中源 IP 是 A 的 IP 地址，目的 IP 地址是 B 的 IP 地址，再构造链路层帧，其中源 MAC 地址是 A 的 MAC 地址，目的 MAC 地址是**本子网内与路由器连接的接口的 MAC 地址**。主机 A 将把这个链路层帧，以单播的方式，发送给目标接口。

4. 目标接口接收到了主机 A 发过来的链路层帧，解析，根据目的 IP 地址，查询转发表，将该 IP 数据报转发到与主机 B 所在子网相连的接口上。

   到此，该帧已经从主机 A 所在的子网，转移到了主机 B 所在的子网了。

5. 路由器接口查询 ARP 表，期望寻找到主机 B 的 MAC 地址。

6. 路由器接口如未能找到主机 B 的 MAC 地址，将采用 ARP 协议，广播问询，单播响应，获取到主机 B 的 MAC 地址。

7. 路由器接口将对 IP 数据报重新封装成链路层帧，目标 MAC 地址为主机 B 的 MAC 地址，单播发送，直到目的地。

![跨局域网通信时路由器通过 ARP 获取下一跳 MAC 地址](./images/ARP 协议详解（网络层）/arp_different_lan.png)

<!-- @include: @article-footer.snippet.md -->


---

<!-- source: 计算机网络/DNS 域名系统详解（应用层）.md -->

---
title: DNS 域名系统详解（应用层）
description: 详解 DNS 的层次结构与解析流程，覆盖递归/迭代、缓存与权威服务器，明确应用层端口与性能优化要点。
category: 计算机基础
tag:
  - 计算机网络
head:
  - - meta
    - name: keywords
      content: DNS,域名解析,递归查询,迭代查询,缓存,权威DNS,端口53,UDP
---

在浏览器地址栏输入域名之后，真正发起 HTTP 请求之前，通常要先经过 DNS 解析。

DNS 要解决的是**域名和 IP 地址的映射问题**。它看起来只是“把域名翻译成 IP”，但背后涉及本地缓存、递归查询、迭代查询、权威服务器、根服务器、UDP/TCP 切换等一整套机制。

这篇文章主要回答几个问题：

1. DNS 为什么需要分层设计？
2. 一次完整的域名解析通常会经过哪些步骤？
3. 递归查询和迭代查询有什么区别？
4. DNS 为什么通常基于 UDP，什么情况下会改用 TCP？

![DNS 将域名解析为 IP 地址的系统概览](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/dns-overview.png)

在实际使用中，有一种情况下，浏览器是可以不必动用 DNS 就可以获知域名和 IP 地址的映射的。浏览器在本地会维护一个 `hosts` 列表，一般来说浏览器要先查看要访问的域名是否在 `hosts` 列表中，如果有的话，直接提取对应的 IP 地址记录，就好了。如果本地 `hosts` 列表内没有域名-IP 对应记录的话，那么 DNS 就闪亮登场了。

目前 DNS 的设计采用的是分布式、层次数据库结构，**DNS 是应用层协议，通常基于 UDP 协议，端口为 53**。当响应数据超过 UDP 报文长度限制（512 字节，EDNS0 可扩展至更大）或进行区域传送（Zone Transfer）时，会改用 TCP 协议以保证数据完整性。

![TCP/IP 各层协议概览](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/network-protocol-overview.png)

## DNS 服务器

DNS 可以从两个维度描述。权威层次包括根、顶级域和具体区域的权威服务器；查询侧则包括存根解析器、递归解析器和转发器等角色。同一套软件或同一台服务器也可能承担多个角色，因此这些类别不是互斥且穷尽的“服务器类型”。

- 根 DNS 服务器。根服务器向查询方提供顶级域服务器的转介信息。
- 顶级域 DNS 服务器（TLD 服务器）。顶级域是指域名的后缀，如 `com`、`org`、`net` 和 `edu` 等。国家和地区也有自己的顶级域，如 `uk`、`fr` 和 `ca`。TLD 服务器通常返回目标域权威服务器的转介信息。
- 权威 DNS 服务器。权威服务器保存一个或多个 DNS 区域的数据，并对这些区域内的查询给出权威回答。
- 递归解析器。本地网络、ISP 或公共 DNS 服务通常会提供递归解析器。它接收客户端查询，先检查缓存，必要时再向根、TLD 和权威服务器逐级查询。递归解析器属于查询侧角色，不是权威 DNS 层次的一层。

**世界上真的只有 13 台根服务器吗？** 这是一个流传已久的技术误解。如果你在网上搜索，仍能看到许多陈旧文章宣称“全球仅有 13 台根服务器，且全部由美国控制”。

**事实并非如此。**

根服务器系统逻辑上有 13 个命名的根服务器标识，从 `a.root-servers.net` 到 `m.root-servers.net`，由 12 个独立运营组织负责。这个数量与早期 DNS 使用 UDP 传输时的报文大小约束有关，但不能理解为全球只有 13 台物理服务器。

每个根服务器标识背后可以通过 **IP 任播（Anycast）** 部署多个物理实例。BGP 会根据当前网络路由把查询引导到路径上合适的实例，而不一定是地理距离最近的实例。实例数量和地点会持续变化，应以 **[Root-Servers.org](https://root-servers.org/)** 的实时数据为准。

![Root-Servers.org 展示全球根服务器实例分布](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/root-servers-org.png)

## DNS 工作流程

以下图为例，介绍 DNS 的查询解析过程。DNS 的查询解析过程分为两种模式：

- **迭代**
- **递归**

下图是实践中常采用的方式，从请求主机到本地 DNS 服务器的查询是递归的，其余的查询时迭代的。

![DNS 递归查询与迭代查询结合的解析流程](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/DNS-process.png)

现在，主机 `cis.poly.edu` 想知道 `gaia.cs.umass.edu` 的 IP 地址。假设主机 `cis.poly.edu` 的本地 DNS 服务器为 `dns.poly.edu`，并且 `gaia.cs.umass.edu` 的权威 DNS 服务器为 `dns.cs.umass.edu`。

1. 首先，主机 `cis.poly.edu` 向本地 DNS 服务器 `dns.poly.edu` 发送一个 DNS 请求，该查询报文包含被转换的域名 `gaia.cs.umass.edu`。
2. 本地 DNS 服务器 `dns.poly.edu` 检查本机缓存，发现并无记录，也不知道 `gaia.cs.umass.edu` 的 IP 地址该在何处，不得不向根服务器发送请求。
3. 根服务器注意到请求报文中含有 `edu` 顶级域，因此告诉本地 DNS，你可以向 `edu` 的 TLD DNS 发送请求，因为目标域名的 IP 地址很可能在那里。
4. 本地 DNS 获取到了 `edu` 的 TLD DNS 服务器地址，向其发送请求，询问 `gaia.cs.umass.edu` 的 IP 地址。
5. `edu` 的 TLD DNS 服务器仍不清楚请求域名的 IP 地址，但是它注意到该域名有 `umass.edu` 前缀，因此返回告知本地 DNS，`umass.edu` 的权威服务器可能记录了目标域名的 IP 地址。
6. 这一次，本地 DNS 将请求发送给权威 DNS 服务器 `dns.cs.umass.edu`。
7. 终于，由于 `gaia.cs.umass.edu` 向权威 DNS 服务器备案过，在这里有它的 IP 地址记录，权威 DNS 成功地将 IP 地址返回给本地 DNS。
8. 最后，本地 DNS 获取到了目标域名的 IP 地址，将其返回给请求主机。

除了迭代式查询，还有一种递归式查询如下图，具体过程和上述类似，只是顺序有所不同。

![DNS 递归查询解析域名的流程](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/DNS-process2.png)

递归解析器会缓存此前查询得到的转介和资源记录，因此很多查询不需要每次都从根服务器开始。只要相关缓存仍在 TTL 有效期内，解析器就可以直接联系已知的 TLD 或权威服务器，从而缩短查询路径并减少上游服务器负担。

## DNS 报文格式

DNS 的报文格式如下图所示：

![DNS 查询报文和回答报文的字段格式](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/DNS-packet.png)

DNS 报文分为查询和回答报文，两种形式的报文结构相同。

- 标识符。16 比特，用于标识该查询。这个标识符会被复制到对查询的回答报文中，以便让客户用它来匹配发送的请求和接收到的回答。
- 标志。1 比特的“查询/回答”标识位，`0` 表示查询报文，`1` 表示回答报文；1 比特的“权威的”标志位（当某 DNS 服务器是所请求名字的权威 DNS 服务器时，且是回答报文，使用“权威的”标志）；1 比特的“希望递归”标志位，显式地要求执行递归查询；1 比特的“递归可用”标志位，用于回答报文中，表示 DNS 服务器支持递归查询。
- 问题数、回答 RR 数、权威 RR 数、附加 RR 数。分别指示了后面 4 类数据区域出现的数量。
- 问题区域。包含正在被查询的主机名字，以及正被询问的问题类型。
- 回答区域。包含了对最初请求的名字的资源记录。**在回答报文的回答区域中可以包含多条 RR，因此一个主机名能够有多个 IP 地址。**
- 权威区域。包含了其他权威服务器的记录。
- 附加区域。包含了其他有帮助的记录。

## DNS 记录

DNS 服务器在响应查询时，需要查询自己的数据库，数据库中的条目被称为 **资源记录（Resource Record，RR）**。RR 提供了主机名到 IP 地址的映射。RR 是一个包含了 `Name`、`Value`、`Type`、`TTL` 四个字段的四元组。

![DNS 资源记录的四元组字段](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/20210506174303797.png)

`TTL` 是该记录的生存时间，它决定了资源记录应当从缓存中删除的时间。

`Name` 和 `Value` 字段的取值取决于 `Type`：

![不同 DNS 资源记录类型的 Name 和 Value 含义](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/20210506170307897.png)

- 如果 `Type=A`，则 `Name` 是主机名信息，`Value` 是该主机名对应的 IP 地址。这样的 RR 记录了一条主机名到 IP 地址的映射。
- 如果 `Type=AAAA`（与 `A` 记录非常相似），唯一的区别是 A 记录使用的是 IPv4，而 `AAAA` 记录使用的是 IPv6。
- 如果 `Type=CNAME`（Canonical Name Record，真实名称记录），则 `Value` 是别名为 `Name` 的主机对应的规范主机名。`Value` 值才是规范主机名。`CNAME` 记录将一个主机名映射到另一个主机名。`CNAME` 记录用于为现有的 `A` 记录创建别名。下文有示例。
- 如果 `Type=NS`，则 `Name` 是个域，而 `Value` 是个知道如何获得该域中主机 IP 地址的权威 DNS 服务器的主机名。通常这样的 RR 是由 TLD 服务器发布的。
- 如果 `Type=MX`，则 `Value` 是个别名为 `Name` 的邮件服务器的规范主机名。既然有了 `MX` 记录，那么邮件服务器可以和其他服务器使用相同的别名。为了获得邮件服务器的规范主机名，需要请求 `MX` 记录；为了获得其他服务器的规范主机名，需要请求 `CNAME` 记录。

`CNAME` 记录总是指向另一则域名，而非 IP 地址。假设有下述 DNS zone：

```plain
NAME                    TYPE   VALUE
--------------------------------------------------
bar.example.com.        CNAME  foo.example.com.
foo.example.com.        A      192.0.2.23
```

当用户查询 `bar.example.com` 的时候，DNS Server 实际返回的是 `foo.example.com` 的 IP 地址。

## 参考

- DNS 服务器类型：<https://www.cloudflare.com/zh-cn/learning/DNS 域名系统详解（应用层）/dns-server-types/>
- DNS Message Resource Record Field Formats：<http://www.tcpipguide.com/free/t_DNSMessageResourceRecordFieldFormats-2.htm>
- Understanding Different Types of Record in DNS Server：<https://www.mustbegeek.com/understanding-different-types-of-record-in-dns-server/>

<!-- @include: @article-footer.snippet.md -->


---

<!-- source: 计算机网络/HTTP 1.0 vs HTTP 1.1-长连接、缓存、Host 头等核心差异（应用层）.md -->

---
title: HTTP 1.0 vs HTTP 1.1：长连接、缓存、Host 头等核心差异（应用层）
description: 细致对比 HTTP/1.0 与 HTTP/1.1 的协议差异，涵盖长连接、管道化、缓存与状态码增强等关键变更与实践影响。
category: 计算机基础
tag:
  - 计算机网络
head:
  - - meta
    - name: keywords
      content: HTTP/1.0,HTTP/1.1,长连接,管道化,缓存,状态码,Host,带宽优化
---

HTTP/1.0 和 HTTP/1.1 名字只差一个小版本，但它们在连接复用、缓存、Host 头、状态码和带宽优化上都有明显差异。

这些差异不是单纯的协议细节，它们直接影响浏览器如何发请求、服务器如何复用连接、缓存如何生效，以及虚拟主机如何工作。

这篇文章主要回答几个问题：

1. HTTP/1.1 相比 HTTP/1.0 新增了哪些常见状态码？
2. HTTP/1.0 和 HTTP/1.1 的缓存机制有什么差异？
3. HTTP/1.1 为什么默认支持长连接？
4. Host 头和带宽优化分别解决了什么问题？

开始之前，先简单回顾一下 HTTP 协议：

![HTTP：超文本传输协议概览](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/http-overview.png)

## 响应状态码

HTTP/1.0 仅定义了 16 种状态码。HTTP/1.1 中新加入了大量的状态码，光是错误响应状态码就新增了 24 种。比如说，`100 (Continue)`——允许客户端在发送较大的请求体前确认服务器是否愿意接收，`206 (Partial Content)`——范围请求的标识码，`409 (Conflict)`——请求与当前资源的规定冲突，`410 (Gone)`——目标资源已不可用，并且这种状态很可能是永久的，服务器也不知道可用的转发地址。

## 缓存处理

缓存技术通过避免用户与源服务器的频繁交互，节约了大量的网络带宽，降低了用户接收信息的延迟。

### HTTP/1.0

HTTP/1.0 提供的缓存机制非常简单。服务器端使用 `Expires` 标签来标志（时间）一个响应体，在 `Expires` 标志时间内的请求，都会获得该响应体缓存。服务器端在初次返回给客户端的响应体中，有一个 `Last-Modified` 标签，该标签标记了被请求资源在服务器端的最后一次修改。在请求头中，使用 `If-Modified-Since` 标签，该标签标志一个时间，意为客户端向服务器进行问询：“该时间之后，我要请求的资源是否有被修改过？”通常情况下，请求头中的 `If-Modified-Since` 的值即为上一次获得该资源时，响应体中的 `Last-Modified` 的值。

如果服务器接收到了请求头，并判断 `If-Modified-Since` 时间后，资源确实没有修改过，则返回给客户端一个 `304 Not Modified` 响应头，表示“缓冲可用，你从浏览器里拿吧！”。

如果服务器判断 `If-Modified-Since` 时间后，资源被修改过，则返回给客户端一个 `200 OK` 的响应体，并附带全新的资源内容，表示“你要的我已经改过的，给你一份新的”。

![HTTP/1.0 使用 Expires 和 Last-Modified 进行缓存校验](./images/HTTP vs HTTPS-区别在哪里、HTTPS 为什么更安全（应用层）/HTTP1.0cache1.png)

![HTTP/1.0 缓存命中时返回 304 Not Modified](./images/HTTP vs HTTPS-区别在哪里、HTTPS 为什么更安全（应用层）/HTTP1.0cache2.png)

### HTTP/1.1

HTTP/1.1 的缓存机制在 HTTP/1.0 的基础上，大大增加了灵活性和扩展性。基本工作原理和 HTTP/1.0 保持不变，而是增加了更多细致的特性。其中，请求头中最常见的特性就是 `Cache-Control`，详见 MDN Web 文档 [Cache-Control](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cache-Control)。

## 连接方式

**HTTP/1.0 默认使用短连接**，也就是说，客户端和服务器每进行一次 HTTP 操作，就建立一次连接，任务结束就中断连接。当客户端浏览器访问的某个 HTML 或其他类型的 Web 页中包含有其他的 Web 资源（如 JavaScript 文件、图像文件、CSS 文件等），每遇到这样一个 Web 资源，浏览器就会重新建立一个 TCP 连接，这样就会导致有大量的“握手报文”和“挥手报文”占用了带宽。

**为了解决 HTTP/1.0 存在的资源浪费的问题，HTTP/1.1 优化为默认长连接模式。** 采用长连接模式的请求报文会通知服务端：“我向你请求连接，并且连接成功建立后，请不要关闭”。因此，该 TCP 连接将持续打开，为后续的客户端-服务端的数据交互服务。也就是说在使用长连接的情况下，当一个网页打开完成后，客户端和服务器之间用于传输 HTTP 数据的 TCP 连接不会关闭，客户端再次访问这个服务器时，会继续使用这一条已经建立的连接。

如果 TCP 连接一直保持的话也是对资源的浪费，因此，一些服务器软件（如 Apache）还会支持超时时间选项。在超时时间之内没有新的请求到达，TCP 连接才会被关闭。

有必要说明的是，HTTP/1.0 仍提供了长连接选项，即在请求头中加入 `Connection: Keep-Alive`。同样的，在 HTTP/1.1 中，如果不希望使用长连接选项，也可以在请求头中加入 `Connection: close`，这样会通知服务器端：“我不需要长连接，连接成功后即可关闭”。

**HTTP 协议的长连接和短连接，实质上是 TCP 协议的长连接和短连接。**

**实现长连接需要客户端和服务端都支持长连接。**

## Host 头处理

域名系统（DNS）允许多个主机名绑定到同一个 IP 地址上，但是 HTTP/1.0 并没有考虑这个问题。假设我们有一个资源 URL 是 `http://example1.org/home.html`，HTTP/1.0 的请求报文中，将会请求的是 `GET /home.html HTTP/1.0`，也就是不会加入主机名。这样的报文送到服务器端，服务器是理解不了客户端想请求的真正网址。

因此，HTTP/1.1 在请求头中加入了 `Host` 字段。加入 `Host` 字段的报文头部将会是：

```plain
GET /home.html HTTP/1.1
Host: example1.org
```

这样，服务器端就可以确定客户端想要请求的真正的网址了。

## 带宽优化

### 范围请求

HTTP/1.1 引入了范围请求（range request）机制，以避免带宽的浪费。当客户端想请求一个文件的一部分，或者需要继续下载一个已经下载了部分但被终止的文件，HTTP/1.1 可以在请求中加入 `Range` 头部，以请求（并只能请求字节型数据）数据的一部分。服务器端可以忽略 `Range` 头部，也可以返回若干 `Range` 响应。

`206 (Partial Content)` 状态码的主要作用是确保客户端和代理服务器能正确识别部分内容响应，避免将其误认为完整资源并错误地缓存。这对于正确处理范围请求和缓存管理非常重要。

一个典型的 HTTP/1.1 范围请求示例：

```http
# 获取一个文件的前 1024 个字节
GET /z4d4kWk.jpg HTTP/1.1
Host: i.imgur.com
Range: bytes=0-1023
```

`206 Partial Content` 响应：

```http
HTTP/1.1 206 Partial Content
Content-Range: bytes 0-1023/146515
Content-Length: 1024
…
（二进制内容）
```

简单解释一下 HTTP 范围响应头部中的字段：

- **`Content-Range` 头部**：指示返回数据在整个资源中的位置，包括起始和结束字节以及资源的总长度。例如，`Content-Range: bytes 0-1023/146515` 表示服务器端返回了第 0 到 1023 字节的数据（共 1024 字节），而整个资源的总长度是 146,515 字节。
- **`Content-Length` 头部**：指示此次响应中实际传输的字节数。例如，`Content-Length: 1024` 表示服务器端传输了 1024 字节的数据。

`Range` 请求头不仅可以请求单个字节范围，还可以一次性请求多个范围。这种方式被称为“多重范围请求”（multiple range requests）。

客户端想要获取资源的第 0 到 499 字节以及第 1000 到 1499 字节：

```http
GET /path/to/resource HTTP/1.1
Host: example.com
Range: bytes=0-499,1000-1499
```

服务器端返回多个字节范围，每个范围的内容以分隔符分开：

```http
HTTP/1.1 206 Partial Content
Content-Type: multipart/byteranges; boundary=3d6b6a416f9b5

--3d6b6a416f9b5
Content-Type: application/octet-stream
Content-Range: bytes 0-499/2000

(第 0 到 499 字节的数据块)

--3d6b6a416f9b5
Content-Type: application/octet-stream
Content-Range: bytes 1000-1499/2000

(第 1000 到 1499 字节的数据块)

--3d6b6a416f9b5--
```

### 状态码 100

HTTP/1.1 中新加入了状态码 `100`。客户端准备发送较大的请求体时，可以在请求头中加入 `Expect: 100-continue`，先只发送请求头。服务器愿意接收请求体时返回 `100 Continue`，客户端再继续发送；服务器也可以直接返回最终响应，让客户端不必传输请求体。过程如下图：

![HTTP/1.1 使用 100 Continue 预确认大请求是否可发送](./images/HTTP vs HTTPS-区别在哪里、HTTPS 为什么更安全（应用层）/HTTP1.1continue1.png)

![客户端收到 100 Continue 后继续发送请求体](./images/HTTP vs HTTPS-区别在哪里、HTTPS 为什么更安全（应用层）/HTTP1.1continue2.png)

HTTP/1.0 中没有 `100 (Continue)` 状态码，也没有通过 `Expect: 100-continue` 获得上述预确认的机制；HTTP/1.0 服务器收到无法识别的 `Expect` 头部时应当忽略它。

### 压缩

许多格式的数据在传输时都会做预压缩处理。数据的压缩可以大幅优化带宽的利用。然而，HTTP/1.0 对数据压缩的选项提供的不多，不支持压缩细节的选择，也无法区分端到端（end-to-end）压缩或者是逐跳（hop-by-hop）压缩。

HTTP/1.1 则对内容编码（content-codings）和传输编码（transfer-codings）做了区分。内容编码总是端到端的，传输编码总是逐跳的。

HTTP/1.0 包含了 `Content-Encoding` 头部，对消息进行端到端编码。HTTP/1.1 加入了 `Transfer-Encoding` 头部，可以对消息进行逐跳传输编码。HTTP/1.1 还加入了 `Accept-Encoding` 头部，是客户端用来指示它能处理什么样的内容编码。

## 总结

1. **连接方式**：HTTP/1.0 为短连接，HTTP/1.1 支持长连接。
2. **状态响应码**：HTTP/1.1 中新加入了大量的状态码，光是错误响应状态码就新增了 24 种。比如说，`100 (Continue)`——允许客户端在发送较大的请求体前确认服务器是否愿意接收，`206 (Partial Content)`——范围请求的标识码，`409 (Conflict)`——请求与当前资源的规定冲突，`410 (Gone)`——目标资源已不可用，并且这种状态很可能是永久的，服务器也不知道可用的转发地址。
3. **缓存处理**：在 HTTP/1.0 中主要使用 header 里的 `If-Modified-Since`、`Expires` 来作为缓存判断的标准，HTTP/1.1 则引入了更多的缓存控制策略，例如 `Entity Tag`、`If-Unmodified-Since`、`If-Match`、`If-None-Match` 等更多可供选择的缓存头来控制缓存策略。
4. **带宽优化及网络连接的使用**：HTTP/1.0 中，存在一些浪费带宽的现象，例如客户端只是需要某个对象的一部分，而服务器却将整个对象送过来了，并且不支持断点续传功能。HTTP/1.1 则在请求头引入了 `Range` 头域，它允许只请求资源的某个部分，即返回码是 `206 (Partial Content)`，这样就方便了开发者自由选择以便于充分利用带宽和连接。
5. **Host 头处理**：HTTP/1.1 在请求头中加入了 `Host` 字段。

## 参考资料

[Key differences between HTTP/1.0 and HTTP/1.1](http://www.ra.ethz.ch/cdstore/www8/data/2136/pdf/pd1.pdf)

<!-- @include: @article-footer.snippet.md -->


---

<!-- source: 计算机网络/HTTP vs HTTPS-区别在哪里、HTTPS 为什么更安全（应用层）.md -->

---
title: HTTP vs HTTPS：区别在哪里、HTTPS 为什么更安全（应用层）
description: 对比 HTTP 与 HTTPS 的协议与安全机制，解析 SSL/TLS 工作原理与握手流程，明确应用层安全落地细节。
category: 计算机基础
tag:
  - 计算机网络
head:
  - - meta
    - name: keywords
      content: HTTP,HTTPS,SSL,TLS,加密,认证,端口,安全性,握手流程
---

HTTP 能传输网页内容，但默认是明文传输。请求和响应如果在网络中被监听、篡改或冒充，HTTP 本身没有足够的保护能力。

HTTPS 不是一个全新的应用层协议，而是使用 TLS 保护 HTTP 通信。在 HTTP/1.1 和常见的 HTTP/2 场景中，TLS 通常运行在 TCP 之上；HTTP/3 则把 HTTP 语义映射到基于 UDP 的 QUIC，并在 QUIC 中集成 TLS 1.3。

这篇文章主要回答几个问题：

1. HTTP 和 HTTPS 的核心区别是什么？
2. HTTPS 如何防止窃听、篡改和冒充？
3. SSL/TLS 握手大致做了哪些事情？
4. 为什么使用 HTTPS 后，证书、混合内容和性能优化仍然需要关注？

## HTTP 协议

### HTTP 协议介绍

HTTP 协议，全称超文本传输协议（Hypertext Transfer Protocol）。顾名思义，HTTP 协议就是用来规范超文本的传输，超文本，也就是网络上的包括文本在内的各式各样的消息，具体来说，主要是来规范浏览器和服务器端的行为的。

并且，HTTP 是一个无状态（stateless）协议，也就是说服务器不维护任何有关客户端过去所发请求的消息。这其实是一种懒政，有状态协议会更加复杂，需要维护状态（历史信息），而且如果客户或服务器失效，会产生状态的不一致，解决这种不一致的代价更高。

![HTTP：超文本传输协议概览](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/http-overview.png)

### HTTP 协议通信过程

HTTP 是应用层协议。下面以基于 TCP 的 HTTP/1.1 为例说明通信过程，`http` URL 的默认端口为 80：

1. 服务器在 80 端口等待客户的请求。
2. 浏览器发起到服务器的 TCP 连接（创建套接字 Socket）。
3. 服务器接收来自浏览器的 TCP 连接。
4. 浏览器（HTTP 客户端）与 Web 服务器（HTTP 服务器）交换 HTTP 消息。
5. 关闭 TCP 连接。

### HTTP 协议优点

扩展性强、速度快、跨平台支持性好。

## HTTPS 协议

### HTTPS 协议介绍

HTTPS（Hypertext Transfer Protocol Secure）使用 TLS 为 HTTP 提供机密性、完整性和身份认证，默认端口号是 443。HTTP/1.1 和 HTTP/2 通常使用 TLS over TCP；HTTP/3 使用集成 TLS 1.3 的 QUIC，QUIC 构建在 UDP 之上。

HTTPS 中，TLS 握手完成后，通信数据使用 AES-GCM、ChaCha20-Poly1305 等对称 AEAD 算法保护。握手可以使用 (EC)DHE 协商共享秘密，也可以在会话恢复等场景使用 PSK；旧版 TLS 还曾支持 RSA 密钥传输。ECDH/ECDHE 是密钥协商算法，不是使用公钥加密一把预先生成的对称密钥。

### HTTPS 协议优点

保密性好、信任度高。

## HTTPS 的核心—SSL/TLS 协议

HTTPS 的安全能力来自 TLS。TLS 对通信数据提供机密性和完整性保护，并通过证书等机制认证通信对端。接下来重点介绍 TLS 的工作原理。

### SSL 和 TLS 的区别？

**SSL 和 TLS 没有太大的区别。**

SSL 指安全套接层协议（Secure Sockets Layer），首次发布于 1996 年（SSL 3.0）。SSL 1.0 从未面世，SSL 2.0 则具有较大的缺陷（DROWN 缺陷——Decrypting RSA with Obsolete and Weakened eNcryption）。很快，在 1999 年，SSL 3.0 进一步升级，**新版本被命名为 TLS 1.0**。因此，TLS 是基于 SSL 之上的，但由于习惯叫法，通常把 HTTPS 中的核心加密协议混称为 SSL/TLS。目前 SSL 已完全废弃，TLS 1.2 和 TLS 1.3 是现代 HTTPS 的实际标准。

### SSL/TLS 的工作原理

#### 非对称加密

TLS 会使用非对称密码机制完成身份认证和/或密钥协商，再使用对称密钥保护业务数据。非对称密码并不只有“公钥加密、私钥解密”这一种用途：数字签名使用私钥签名、公钥验证，ECDHE 则通过双方的临时密钥协商共享秘密。下面的邮箱比喻只用于说明 RSA 等公钥加密方案的基本概念，不能代表所有 TLS 握手。

> 在某个自助邮局，每个通信信道都是一个邮箱，每一个邮箱所有者都在旁边立了一个牌子，上面挂着一把钥匙：这是我的公钥，发送者请将信件放入我的邮箱，并用公钥锁好。
>
> 但是公钥只能加锁，并不能解锁。解锁只能由邮箱的所有者——因为只有他保存着私钥。
>
> 这样，通信信息就不会被其他人截获了，这依赖于私钥的保密性。

![非对称加密中公钥加密和私钥解密的过程](./images/HTTP vs HTTPS-区别在哪里、HTTPS 为什么更安全（应用层）/public-key-cryptography.png)

非对称加密的公钥和私钥需要采用一种复杂的数学机制生成（密码学认为，为了较高的安全性，尽量不要自己创造加密方案）。公私钥对的生成算法依赖于单向陷门函数。

> 单向函数：已知单向函数 f，给定任意一个输入 x，易计算输出 y=f(x)；而给定一个输出 y，假设存在 f(x)=y，很难根据 f 来计算出 x。
>
> 单向陷门函数：一个较弱的单向函数。已知单向陷门函数 f，陷门 h，给定任意一个输入 x，易计算出输出 y=f(x;h)；而给定一个输出 y，假设存在 f(x;h)=y，很难根据 f 来计算出 x，但可以根据 f 和 h 来推导出 x。

![单向函数](./images/HTTP vs HTTPS-区别在哪里、HTTPS 为什么更安全（应用层）/OWF.png)

上图就是一个单向函数（不是单项陷门函数），假设有一个绝世秘籍，任何知道了这个秘籍的人都可以把苹果汁榨成苹果，那么这个秘籍就是“陷门”了吧。

在这里，函数 f 的计算方法相当于公钥，陷门 h 相当于私钥。公钥 f 是公开的，任何人对已有输入，都可以用 f 加密，而要想根据加密信息还原出原信息，必须要有私钥才行。

#### 对称加密

TLS 不会使用非对称密码算法直接加密大量业务数据。握手阶段完成身份认证和密钥建立后，记录层使用对称 AEAD 算法保护 HTTP 请求和响应。

> 对称加密：通信双方共享唯一密钥 k，加解密算法已知，加密方利用密钥 k 加密，解密方利用密钥 k 解密，保密性依赖于密钥 k 的保密性。

![对称加密中双方使用共享密钥加密通信](./images/HTTP vs HTTPS-区别在哪里、HTTPS 为什么更安全（应用层）/symmetric-encryption.png)

通信双方需要在不安全的网络上建立只有彼此知道的流量密钥。TLS 1.2 的静态 RSA 密钥交换会由客户端生成 `PreMasterSecret`，再用服务器 RSA 公钥加密发送；现代 TLS 更常使用 ECDHE，让双方交换临时公钥并各自计算出同一个共享秘密。TLS 1.3 已移除静态 RSA 密钥交换，允许 (EC)DHE、PSK 或 PSK+(EC)DHE 等密钥建立方式。无论使用哪种方式，最终都会派生出对称流量密钥来保护后续数据；任何密码方案都不能称为“绝对安全”。

#### 公钥传输的信赖性

SSL/TLS 介绍到这里，了解信息安全的朋友又会想到一个安全隐患。设想下面的场景：

> 客户端 C 和服务器 S 想要使用 SSL/TLS 通信，由上述 SSL/TLS 通信原理，C 需要先知道 S 的公钥，而 S 公钥的唯一获取途径，就是把 S 公钥在网络信道中传输。要注意网络信道通信中有几个前提：
>
> 1. 任何人都可以捕获通信包
> 2. 通信包的保密性由发送者设计
> 3. 保密算法设计方案默认为公开，而（解密）密钥默认是安全的
>
> 因此，假设 S 公钥不做加密，在信道中传输，那么很有可能存在一个攻击者 A，发送给 C 一个诈包，假装是 S 公钥，其实是诱饵服务器 AS 的公钥。当 C 收获了 AS 的公钥（却以为是 S 的公钥），C 后续就会使用 AS 公钥对数据进行加密，并在公开信道传输，那么 A 将捕获这些加密包，用 AS 的私钥解密，就截获了 C 本要给 S 发送的内容，而 C 和 S 二人全然不知。
>
> 同样的，S 公钥即使做加密，也难以避免这种信任性问题，C 被 AS 拐跑了！

![中间人替换服务器公钥导致客户端误信攻击者公钥](./images/HTTP vs HTTPS-区别在哪里、HTTPS 为什么更安全（应用层）/attack1.png)

为了公钥传输的信赖性问题，第三方机构应运而生——证书颁发机构（CA，Certificate Authority）。CA 默认是受信任的第三方。CA 会给各个服务器颁发证书，证书存储在服务器上，并附有 CA 的**电子签名**（见下节）。

当服务器使用证书认证时，客户端会获取服务器提供的证书链，并验证签名链是否能连接到本地信任的根，同时检查目标主机名、有效期、密钥用途和路径约束等信息。只有这些检查通过，客户端才能把证书中的公钥与目标服务身份绑定起来。PSK 等不使用证书的认证方式属于另一类场景。

#### 数字签名

好，到这一小节，已经是 SSL/TLS 的尾声了。上一小节提到了数字签名，数字签名要解决的问题，是防止证书被伪造。第三方信赖机构 CA 之所以能被信赖，就是 **靠数字签名技术**。

数字签名用于检测证书内容是否被篡改，并证明签名由持有 CA 私钥的一方生成。应当把这个过程描述为“私钥签名、公钥验证”，而不是普遍意义上的“私钥加密、公钥解密”。具体行为如下：

> CA 核验申请信息后，使用自己的私钥对证书待签名部分生成数字签名，并把签名附在证书中。
>
> 服务器将证书链发送给客户端。客户端使用签发者证书中的公钥验证当前证书的签名，并逐级验证到本地信任的根。
>
> 签名验证只是证书验证的一部分。客户端还需要检查目标主机名、有效期、用途、基本约束和名称约束等条件，全部通过后才接受服务器身份。

![CA 通过数字签名证明证书未被篡改](./images/HTTP vs HTTPS-区别在哪里、HTTPS 为什么更安全（应用层）/digital-signature.png)

总结来说，带有证书的公钥传输机制如下：

1. 设有服务器 S，客户端 C，和第三方信赖机构 CA。
2. CA 核验 S 的申请信息，为包含 S 公钥和身份信息的证书生成数字签名。
3. S 获得 CA 颁发的证书，将该证书传递给 C。
4. C 获得 S 的证书链，使用各级签发者公钥验证签名，并确认该链最终锚定到本地信任的根。
5. C 继续检查域名、有效期、用途和证书约束。全部通过后，才接受证书中公钥与目标服务身份的绑定关系。

![HTTPS 通过 CA 证书可信传递服务器公钥](./images/HTTP vs HTTPS-区别在哪里、HTTPS 为什么更安全（应用层）/public-key-transmission.png)

对于数字签名，我这里讲的比较简单，如果你没有搞清楚的话，强烈推荐你看看[数字签名及数字证书原理](https://www.bilibili.com/video/BV18N411X7ty/)这个视频，这是我看过最清晰的讲解。

![数字签名及数字证书原理视频讲解截图](https://oss.javaguide.cn/github/javaguide/image-20220321121814946.png)

## 总结

- **端口号**：HTTP 默认是 80，HTTPS 默认是 443。
- **URL 前缀**：HTTP 的 URL 前缀是 `http://`，HTTPS 的 URL 前缀是 `https://`。
- **安全性和传输方式**：未使用 TLS 的 HTTP 默认不提供机密性、完整性和对端身份认证。HTTPS 使用 TLS 保护 HTTP；HTTP/1.1 和 HTTP/2 通常使用 TLS over TCP，HTTP/3 使用集成 TLS 1.3 的 QUIC。TLS 握手负责认证对端并建立流量密钥，后续数据由对称 AEAD 算法保护。证书主要用于身份认证，不能笼统地说“证书加密了对称密钥”。

<!-- @include: @article-footer.snippet.md -->


---

<!-- source: 计算机网络/HTTP 常见状态码总结（应用层）.md -->

---
title: HTTP 常见状态码总结（应用层）
description: 汇总常见 HTTP 状态码含义与使用场景，强调 201/204 等易混淆点，提升接口设计与调试效率。
category: 计算机基础
tag:
  - 计算机网络
head:
  - - meta
    - name: keywords
      content: HTTP 状态码,2xx,3xx,4xx,5xx,重定向,错误码,201 Created,204 No Content
---

HTTP 状态码是服务端返回给客户端的处理结果摘要。看到一个状态码，基本就能判断请求是成功、重定向、客户端出错，还是服务端出错。

状态码看起来只是数字，但很多码很容易混淆：比如 301 和 302、401 和 403、500 和 502、201 和 204。

这篇文章主要回答几个问题：

1. 1xx、2xx、3xx、4xx、5xx 分别代表什么类型的结果？
2. 常见成功状态码如 200、201、204 有什么区别？
3. 常见客户端错误如 400、401、403、404 应该怎么理解？
4. 常见服务端错误如 500、502、503、504 通常意味着什么？

![常见 HTTP 状态码](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/http-status-code.png)

### 1xx Informational（信息性状态码）

相比于其他类别状态码来说，1xx 你平时你大概率不会碰到，所以这里直接跳过。

### 2xx Success（成功状态码）

- **200 OK**：请求被成功处理。例如，发送一个查询用户数据的 HTTP 请求到服务端，服务端正确返回了用户数据。这个是我们平时最常见的一个 HTTP 状态码。
- **201 Created**：请求被成功处理并且在服务端创建了~~一个新的资源~~。例如，通过 POST 请求创建一个新的用户。
- **202 Accepted**：服务端已经接收到了请求，但是还未处理。例如，发送一个需要服务端花费较长时间处理的请求（如报告生成、Excel 导出），服务端接收了请求但尚未处理完毕。
- **204 No Content**：服务端已经成功处理了请求，但是没有返回任何内容。例如，发送请求删除一个用户，服务器成功处理了删除操作但没有返回任何内容。

🐛 修正（参见：[issue#2458](https://github.com/Snailclimb/JavaGuide/issues/2458)）：201 Created 状态码更准确点来说是创建一个或多个新的资源，可以参考：<https://httpwg.org/specs/rfc9110.html#status.201>。

![RFC 9110 中 201 Created 状态码的定义](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/rfc9110-201-created.png)

这里格外提一下 204 状态码，平时学习/工作中见到的次数并不多。

[HTTP RFC 2616 对 204 状态码的描述](https://tools.ietf.org/html/rfc2616#section-10.2.5)如下：

> The server has fulfilled the request but does not need to return an
> entity-body, and might want to return updated metainformation. The
> response MAY include new or updated metainformation in the form of
> entity-headers, which if present SHOULD be associated with the
> requested variant.
>
> If the client is a user agent, it SHOULD NOT change its document view
> from that which caused the request to be sent. This response is
> primarily intended to allow input for actions to take place without
> causing a change to the user agent's active document view, although
> any new or updated metainformation SHOULD be applied to the document
> currently in the user agent's active view.
>
> The 204 response MUST NOT include a message-body, and thus is always
> terminated by the first empty line after the header fields.

简单来说，204 状态码描述的是我们向服务端发送 HTTP 请求之后，只关注处理结果是否成功的场景。也就是说我们需要的就是一个结果：true/false。

举个例子：你要追一个女孩子，你问女孩子：“我能追你吗？”，女孩子回答：“好！”。我们把这个女孩子当做是服务端就很好理解 204 状态码了。

### 3xx Redirection（重定向状态码）

- **301 Moved Permanently**：资源被永久重定向了。比如你的网站的网址更换了。
- **302 Found**：资源被临时重定向了。比如你的网站的某些资源被暂时转移到另外一个网址。

### 4xx Client Error（客户端错误状态码）

- **400 Bad Request**：发送的 HTTP 请求存在问题。比如请求参数不合法、请求方法错误。
- **401 Unauthorized**：未认证却请求需要认证之后才能访问的资源。
- **403 Forbidden**：直接拒绝 HTTP 请求，不处理。一般用来针对非法请求。
- **404 Not Found**：你请求的资源未在服务端找到。比如你请求某个用户的信息，服务端并没有找到指定的用户。
- **409 Conflict**：表示请求的资源与服务端当前的状态存在冲突，请求无法被处理。

### 5xx Server Error（服务端错误状态码）

- **500 Internal Server Error**：服务端出问题了（通常是服务端出 Bug 了）。比如你服务端处理请求的时候突然抛出异常，但是异常并未在服务端被正确处理。
- **502 Bad Gateway**：我们的网关将请求转发到服务端，但是服务端返回的却是一个错误的响应。

### 参考

- <https://www.restapitutorial.com/httpstatuscodes.html>
- <https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status>
- <https://en.wikipedia.org/wiki/List_of_HTTP_status_codes>
- <https://segmentfault.com/a/1190000018264501>

<!-- @include: @article-footer.snippet.md -->


---

<!-- source: 计算机网络/HTTPS 握手里的 RSA 和 ECDHE，到底差在哪？（应用层）.md -->

---
title: HTTPS 握手里的 RSA 和 ECDHE，到底差在哪？（应用层）
description: 对比 TLS 握手中 RSA 密钥交换与 ECDHE 密钥交换的核心差异，讲清前向安全、密码套件命名、TLS 1.3 变化及面试要点。
category: 计算机基础
tag:
  - 计算机网络
head:
  - - meta
    - name: keywords
      content: HTTPS,RSA,ECDHE,TLS,握手,前向安全,密钥交换,密码套件,TLS 1.3,PreMasterSecret
---

很多人第一次学 HTTPS，脑子里会留下一个很粗的印象：

**HTTPS = HTTP + 加密，加密 = RSA。所以，HTTPS = RSA 加密。**

这个理解不是凭空来的。早期很多 HTTPS 部署确实大量使用 RSA 相关的密码套件，很多入门讲解也喜欢拿 RSA 举例。

但严格说，HTTPS 从来不等于 RSA 加密。即使在 TLS 1.0、TLS 1.1 时代，RSA 也只是可选方案之一，协议里还存在 DHE 这类密钥交换方式。到了 TLS 1.3，静态 RSA 密钥交换已经被移除，RSA 更多出现在证书签名、身份认证这类位置。

所以，这篇文章真正要对比的不是“RSA 和 ECDHE 谁更高级”。

**RSA 握手里，会话密钥材料是客户端生成后加密发给服务端；ECDHE 握手里，会话密钥材料不是直接传过去的，而是客户端和服务端各自算出来的。**

这篇文章主要回答几个问题：

1. HTTPS 为什么不等于 RSA 加密？
2. RSA 握手和 ECDHE 握手的会话密钥材料分别是怎么来的？
3. ECDHE 为什么能提供前向安全性？
4. TLS 1.3 为什么移除静态 RSA 密钥交换？

把这些问题讲清楚了，`PreMasterSecret`、`Server Key Exchange`、前向安全、TLS 1.3 为什么移除静态 RSA，后面都能顺着理解。

![RSA 与 ECDHE 密钥交换：核心差异](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/https-rsa-ecdhe-rsa-and-ecdhe-key-exchange-core-differences.png)

## TLS 握手的两个核心问题

HTTPS 仍然使用 HTTP 语义。在本文重点讨论的 TLS 1.2 场景中，HTTP 报文通过 TLS over TCP 传输；HTTP/3 则运行在集成 TLS 1.3 的 QUIC 之上，不再使用 TCP。

握手完成后，真正保护业务数据的通常是 AES-GCM 这类对称加密算法，而不是拿 RSA 去加密完整的请求和响应。

这里有两个问题。

**第一个问题：浏览器和服务器需要协商出一份会话密钥。**

后面传输 HTTP 请求、Cookie、响应体时，就用这份会话密钥做对称加密。对称加密更适合处理大量数据；非对称加密计算成本高，一般不拿来直接加密完整网页内容。

**第二个问题：浏览器需要确认对面真的是目标网站。**

如果只是“服务器发一个公钥给浏览器”，那中间人也可以发自己的公钥。浏览器以为那是目标网站的公钥，后面就把秘密信息加密给了攻击者。证书、CA、数字签名解决的是这件事：证明这个公钥确实和这个域名绑定，而不是路上某个人塞进来的。

RSA 握手和 ECDHE 握手都会面对这两个问题。只是它们解决“会话密钥怎么来”的方式不同。

## RSA 握手：密钥材料加密发送

### 完整握手流程

先看 TLS 1.2 里的 RSA 密钥交换。

浏览器先发 `ClientHello`。这里面会带上客户端支持的 TLS 版本、支持的密码套件、一个随机数 `Client Random`。

服务器收到之后，回 `ServerHello`，选定 TLS 版本和密码套件，也给出一个随机数 `Server Random`，然后把自己的证书发给客户端。

到这里，客户端拿到了服务器证书。它会验证证书链、域名、有效期、签名这些信息。证书验证通过后，客户端就从证书里取出服务器的 RSA 公钥。

接下来是关键步骤：客户端生成一个新的随机值，也就是 `PreMasterSecret`。在 TLS 1.2 的 RSA 密钥交换里，这个值是 **48 字节**。客户端会用服务器证书里的 RSA 公钥加密 `PreMasterSecret`，再把加密结果放进 `Client Key Exchange` 发给服务器。

服务器收到后，用自己的 RSA 私钥解密，拿到同一份 `PreMasterSecret`。

这时，客户端和服务端手里都有三份材料：

```text
Client Random
Server Random
PreMasterSecret
```

双方再根据这三份材料派生出 `Master Secret`，后续的会话密钥也会从这里继续派生出来。真正传 HTTP 请求和响应时，用的是这些派生出来的对称密钥。

用一句话压缩：

**RSA 握手的会话密钥材料，是客户端生成后“包起来”寄给服务器的。**

这里的“包起来”，靠的就是服务器 RSA 公钥。只有持有对应 RSA 私钥的服务器，才能拆开这个包。

看起来挺合理。客户端生成秘密，服务器私钥解密，双方得到同一份材料，再结合两个随机数派生出后续会话密钥。

但问题也在这里。

### 没有前向安全：长期私钥太值钱

假设攻击者今天抓到了一段 HTTPS 流量，但当时没有服务器私钥，所以看不懂里面的内容。这时他可以先把流量保存下来。

一年后，如果服务器 RSA 私钥泄漏了，会发生什么？

在 RSA 密钥交换里，客户端当年发出的 `PreMasterSecret` 是用服务器 RSA 公钥加密的。如果攻击者完整捕获了握手阶段的明文随机数，也就是 `Client Random`、`Server Random`，同时保存了加密后的 `PreMasterSecret`，再结合后来泄漏的服务器私钥，就可能解开当时的 `PreMasterSecret`，继续派生出那次连接用过的会话密钥。

旧数据就有机会被翻出来。

这里要注意条件：不是“只要私钥泄漏，所有历史流量必然能解”。攻击者至少得拿到足够完整的握手数据和应用数据。如果只有单向片段，或者握手日志不完整，即使有私钥，也未必能把那次会话还原出来。

但从安全设计上看，这个风险已经足够麻烦。长期私钥一旦变成打开历史流量的总钥匙，它的影响就不再只覆盖未来连接，也会波及过去已经发生过的通信。

这里批评的不是 RSA 算法本身“不能用”。RSA 仍然可以用于签名认证，也可以出现在证书体系里。问题出在“用长期不变的服务器私钥去解密历史握手里的密钥材料”。

服务器私钥一旦泄漏，代价太大。

![静态 RSA 缺少前向安全：完整抓包 + 私钥泄漏可回溯历史流量](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/https-rsa-ecdhe-static-rsa-lacks-forward-secrecy.png)

### 另一个历史包袱：填充预言机攻击

RSA 密钥交换还有一个工程层面的麻烦：`PreMasterSecret` 不是直接裸加密，而是按 RSAES-PKCS1-v1_5 这类格式封装后再加密。

这个细节曾经引出过 Bleichenbacher 这类填充预言机攻击。

它的大致思路是：攻击者不一定要马上拿到服务器私钥，而是反复构造不同的密文发给服务器，观察服务器对“填充错误、版本错误、长度错误”的处理差异。如果服务端在错误码、响应时间、日志行为、连接关闭方式上露出差别，攻击者就可能一点点逼近明文。

这类攻击麻烦的地方在于，它不是单纯的数学问题，而是实现问题。

TLS 1.2 对这类情况做过防御要求：服务端即使解密失败，也不要把具体失败原因暴露出去，而是继续用随机值走完整个流程，避免攻击者通过差异行为判断密文是否接近正确格式。

可规范要求不等于实现可靠。2017 年的 ROBOT 攻击再次说明，一些服务端仍然可能因为细小的行为差异暴露出 RSA 解密 oracle。错误码、耗时、日志、分支路径，只要有一处表现不一致，都可能变成侧信道。

所以，静态 RSA 密钥交换被淘汰，不只是因为它没有前向安全，也因为它把太多风险压到了实现细节上。

### 能否被降级回 RSA？

这里还要补一个容易误解的点。

TLS 1.2 里，客户端会在 `ClientHello` 里带上自己支持的密码套件列表，服务端从里面选一个双方都支持的套件。理论上，如果服务端仍然开放 `TLS_RSA_*` 这类静态 RSA 密钥交换套件，老客户端就可能继续用 RSA 握手。

但这不等于“中间人随便把 ClientHello 里的 ECDHE 删掉，就能让连接悄悄降级到 RSA”。握手最后的 `Finished` 会校验握手 transcript，简单篡改 `ClientHello` 通常会导致校验失败，连接建立不起来。

历史上确实发生过降级相关攻击，比如 FREAK 和 Logjam。它们利用的是当时一些客户端、服务端仍然支持出口级弱密码套件，再结合实现和配置问题，把连接压到更弱的 RSA_EXPORT 或 DHE_EXPORT 路径上，而不是“随便删掉 ECDHE 就能静默成功”。TLS 1.3 在 `ServerHello.random` 里加入降级保护值，也是在提醒我们：协议本身一直在补这类历史攻击面。

真正需要关注的是服务端配置本身：如果已经不需要兼容很老的客户端，就应该关闭静态 RSA 密钥交换套件，只保留支持前向安全的套件。否则，环境里仍然可能存在客户端或错误配置走到 RSA 握手。

这也是排查 TLS 配置时要看密码套件实际协商结果的原因。只看“服务器支持 ECDHE”不够，还要看它是否同时保留了 `TLS_RSA_*` 这类旧套件。

## ECDHE 握手：密钥材料双方协商

### DH 的核心思路

ECDHE 里的 `DHE` 来自 Diffie-Hellman Ephemeral，意思是临时 Diffie-Hellman。前面的 `EC` 是 Elliptic Curve，表示基于椭圆曲线。

别被名字吓住。先不看椭圆曲线，先看 DH 想解决什么问题。

DH 的目标很有意思：通信双方不直接传输共享秘密，却能各自算出同一个共享秘密。

可以粗略理解成这样：

客户端生成一个临时私钥，只留在本地，再算出一个临时公钥发给服务器。服务器也生成一个临时私钥，只留在本地，再算出一个临时公钥发给客户端。

双方交换的都是公钥。攻击者在网络里能看到这些公钥，但看不到双方各自的临时私钥。

接着，客户端用“自己的临时私钥 + 服务器临时公钥”算出共享秘密；服务器用“自己的临时私钥 + 客户端临时公钥”也算出同一个共享秘密。

共享秘密没有在网络上传输过。

ECDHE 只是把这个过程放到椭圆曲线体系里做。椭圆曲线的数学理论更抽象，但在同等安全强度下，它通常能用更短的密钥达到相近的安全级别，运算和传输成本也比传统有限域 DHE 更低。对理解 TLS 握手来说，先记住一句话就够了：

**ECDHE 的会话密钥材料不是某一方生成后发给另一方，而是双方通过临时密钥协商出来的。**

### 完整握手流程

再看 TLS 1.2 里常见的 `ECDHE_RSA` 握手。

客户端还是先发 `ClientHello`，里面有 TLS 版本、支持的密码套件、`Client Random`。服务器回 `ServerHello`，选择一个密码套件，比如：

```text
TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
```

这个密码套件名要拆开看，不能看到 RSA 就以为它还在用 RSA 加密会话密钥。

- `ECDHE` 表示密钥交换方式。
- `RSA` 表示认证签名方式。
- `AES_256_GCM` 表示后续记录数据使用 AES，密钥长度 256 位，模式是 GCM。
- `SHA384` 指定 TLS 1.2 PRF 和 `Finished` 消息使用的哈希算法。

GCM 本身已经提供记录层的完整性保护，所以这里的 `SHA384` 不再表示记录层 MAC，而是主要参与握手阶段的密钥派生和验证。

服务端接着发证书。以 `ECDHE_RSA` 为例，证书里的 RSA 公钥主要用于验证服务端签名，而不是让客户端拿它加密 `PreMasterSecret`。

然后，ECDHE 和 RSA 握手开始分叉。

在 ECDHE 握手里，服务端会发送 `Server Key Exchange`。这个消息里会包含服务端选择的椭圆曲线参数，以及服务端临时 ECDHE 公钥。

**问题来了：客户端怎么知道这份临时 ECDHE 公钥没有被中间人换掉？**

**答案是签名。**

服务端会用证书对应的私钥，对握手参数做签名。客户端收到后，用证书里的公钥验证签名。如果签名验证通过，客户端就能确认：这份临时 ECDHE 公钥确实来自持有证书私钥的服务器，不是路上被人替换的。

随后客户端也生成自己的临时 ECDHE 私钥和公钥，把客户端临时公钥通过 `Client Key Exchange` 发给服务器。

到这一步，双方都有了计算共享秘密需要的材料。

客户端手里有：

```text
客户端临时私钥
服务端临时公钥
Client Random
Server Random
```

服务端手里有：

```text
服务端临时私钥
客户端临时公钥
Client Random
Server Random
```

两边各自计算出同一个共享秘密，再派生出后续使用的会话密钥。

这里再强调一次：

**ECDHE_RSA 里的 RSA，不是用来加密传输会话密钥的。它负责证明“这份 ECDHE 临时参数确实是服务器发的”。**

这也是很多人看到密码套件名字后最容易误会的地方。

![TLS 1.2 使用 ECDHE RSA 完成握手和密钥协商](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/https-rsa-ecdhe-tls-1-2-ecdhe-rsa-handshake-process.png)

### 密码套件名怎么读

TLS 1.2 的密码套件名字通常可以按这条线拆：

```text
TLS_密钥交换算法_认证算法_WITH_对称加密算法_哈希算法
```

例如：

```text
TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
```

可以拆成：

```text
ECDHE：密钥交换
RSA：身份认证，也就是服务端签名
AES_128_GCM：后续记录层加密算法
SHA256：TLS 1.2 PRF 和 Finished 消息使用的哈希算法；如果是 GCM 套件，它不再充当记录层 MAC
```

再看另一个：

```text
TLS_RSA_WITH_AES_128_GCM_SHA256
```

这里的 `RSA` 出现在 `WITH` 前面，而且没有 `ECDHE`，表示密钥交换和身份认证都和 RSA 绑定。这类就是典型的静态 RSA 密钥交换套件。

到了 TLS 1.3，密码套件命名变了，比如：

```text
TLS_AES_128_GCM_SHA256
```

你会发现，它不再把密钥交换和认证方式写进密码套件名里。TLS 1.3 把这些信息拆到其他扩展和握手消息中，密码套件名主要描述记录层 AEAD 算法和 HKDF 使用的哈希算法。

所以，看到 TLS 1.3 的 `TLS_AES_128_GCM_SHA256`，不要误以为它“没有密钥交换”。密钥交换还在，只是不用 TLS 1.2 那套命名方式写出来了。

![密码套件名拆解](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/https-rsa-ecdhe-cipher-suite-name-decomposition.png)

## 前向安全与性能代价

### ECDHE 为什么有前向安全

关键在 `E`，也就是 `Ephemeral`，临时。

ECDHE 握手里的私钥不是服务器证书那把长期私钥，而是握手过程中使用的临时私钥。连接结束后，正常情况下不应该再依赖这份临时材料。

这带来的结果是：攻击者今天抓包，未来某天拿到了服务器证书私钥，也不能仅靠这把长期私钥还原过去每次握手里的临时共享秘密。因为当时真正参与密钥协商的是那次握手里的 ECDHE 临时私钥，而不是证书私钥。

证书私钥在这里更像“签字笔”，不是“保险柜钥匙”。

RSA 密钥交换里，服务器私钥可以直接打开客户端发来的 `PreMasterSecret`；ECDHE 里，服务器私钥只是给临时参数签名，证明身份。它不直接参与每次连接共享秘密的计算。

这个角色变化，决定了两者在历史流量保护上的差异。

![ECDHE 前向安全原理：长期密钥 vs 临时密钥](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/https-rsa-ecdhe-ecdhe-forward-secrecy-principle-long-term-key-vs-ephemeral-key.png)

不过，前向安全不是免死金牌。

如果服务端随机数质量很差，临时私钥被日志记录下来，或者实现里出现内存泄漏，ECDHE 也救不了你。工程实现里，为了降低握手成本，部分实现还可能短时间复用临时 DH/ECDH 私密材料：有限域 DH 场景常说“指数复用”，ECDH 场景更常说“临时私钥/标量复用”。如果复用时间过长，前向安全的粒度就会变粗。

还有一类风险来自参数校验。比如服务端没有正确校验客户端发来的椭圆曲线点是否在合法曲线上，就可能给无效曲线攻击留下空间。正常开发者不一定会直接写这层代码，但它提醒我们：密码学协议不只是“选对算法”就结束了，TLS 库实现和配置同样重要。

### 会话恢复的影响

还有一个容易被忽略的点：**会话恢复。**

完整 ECDHE 握手要做临时密钥协商，成本不低。为了减少握手开销，TLS 支持会话恢复。客户端下次访问同一个站点时，可以尝试复用之前协商过的会话状态，避免每次都完整走一遍握手。

问题在于，会话恢复也有自己的安全边界。

以 TLS 1.2 的会话票据为例，服务端会用一把票据加密密钥保护会话状态，客户端后续带着票据回来，服务端解开票据后恢复会话。如果这把票据加密密钥长期不轮换，一旦它泄漏，攻击者就可能解开过去收集到的票据，并进一步还原相关恢复会话的密钥材料。

这时，前向安全的窗口就不再是“一次连接”，而会被拉长到“票据加密密钥的生命周期”。

所以线上配置不能只看“是否启用了 ECDHE”。会话票据密钥怎么生成、怎么轮换、是否在多台机器间共享、泄漏后影响多大，也要算进去。

### 性能不是免费的

ECDHE 带来了前向安全，但它也有成本。

RSA 密钥交换的主路径，是服务端用长期 RSA 私钥解开客户端发来的 `PreMasterSecret`。ECDHE_RSA 则需要完成临时 ECDH 协商，还要对服务端临时参数做签名。

对高并发服务来说，TLS 握手会消耗 CPU，尤其是短连接多、会话恢复命中率低的时候。

这里不能简单写成“ECDHE 一定比 RSA 慢”。实际开销取决于 RSA 密钥长度、椭圆曲线选择、签名算法、TLS 库实现、CPU 指令集、会话恢复命中率等因素。比如 X25519、P-256、RSA 2048、RSA 3072 在不同 CPU 和不同 TLS 库上的表现都不一样。

如果真要判断成本，最靠谱的方法不是引用别人的固定数字，而是在目标机器上压测。至少要区分三件事：

```text
1. 单次密码学操作耗时
2. 完整 TLS 握手耗时
3. 业务请求端到端耗时
```

第一项可以用 `openssl speed` 粗看数量级，比如测试 RSA、ECDH、X25519 的运算能力；第二项要看 TLS 库和服务端配置；第三项还会受网络、连接复用、应用逻辑影响。

所以线上不会只靠“换成 ECDHE”解决所有问题。更常见的做法是配合 TLS 1.3、会话恢复、合理的证书算法和曲线选择，必要时再用硬件加速。

安全性和性能不是二选一，但也不能假装没有成本。

## TLS 1.3 的变化

如果只看 TLS 1.2，RSA 和 ECDHE 可以作为两种密钥交换方式来对比。

但到了 TLS 1.3，静态 RSA 密钥交换已经被移除，握手结构也改了。

TLS 1.2 完整握手通常需要 2 个 RTT。客户端先发 `ClientHello`，服务端回 `ServerHello`、证书和相关握手消息，客户端再发密钥交换和 `Finished`，服务端最后回 `Finished`。

TLS 1.3 则把密钥交换参数提前放进 `ClientHello` 的 `key_share`。服务端第一轮响应就能返回自己的 `key_share`，完整握手通常压到 1 个 RTT。

2 RTT 变 1 RTT 能省多少毫秒，取决于网络环境。同机房可能只是几毫秒；跨地域、移动网络、高丢包场景下，少一个 RTT 才更容易被感知。

不过，TLS 1.3 也不是任何情况下都稳稳 1 RTT。如果客户端带的 `key_share` 和服务端支持的曲线不匹配，服务端会返回 `HelloRetryRequest`，要求客户端换一组参数再来一次。这时握手可能重新接近 2 RTT。

所以生产环境里，客户端和服务端对常见密钥协商组的支持要尽量对齐，比如 `X25519`、`secp256r1` 这类常见选择。否则 TLS 1.3 的 1 RTT 优势可能打折。

![TLS 1.2 vs TLS 1.3 握手 RTT 对比](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/https-rsa-ecdhe-tls-1-2-vs-tls-1-3-handshake-rtt-comparison.png)

至于后量子混合密钥交换、0-RTT、PSK-only、mTLS，这些都属于另一条线，本文不展开。

## RSA vs ECDHE 核心差异速查

放到一起看，差异就很清楚了。

| 对比项             | RSA 密钥交换                                            | ECDHE 密钥交换                                         |
| ------------------ | ------------------------------------------------------- | ------------------------------------------------------ |
| 常见版本背景       | TLS 1.2 及更早版本可见                                  | TLS 1.2 常见，TLS 1.3 延续临时密钥协商方向             |
| 会话密钥材料怎么来 | 客户端生成 `PreMasterSecret`，用服务器 RSA 公钥加密发送 | 双方各自生成临时密钥对，通过 ECDHE 算出共享秘密        |
| 服务器私钥的作用   | 解密客户端发来的 `PreMasterSecret`                      | 对临时 ECDHE 参数签名，证明参数来自真实服务端          |
| 网络上传了什么     | 加密后的 `PreMasterSecret`                              | 双方临时公钥和签名后的参数                             |
| 是否支持前向安全   | 不支持                                                  | 支持，前提是临时密钥正确生成、使用后不再保留           |
| 私钥泄漏后的影响   | 在握手数据完整捕获的情况下，历史流量可能被解密          | 仅靠证书私钥，通常无法解开历史流量                     |
| 典型问题           | 长期私钥价值过高，存在 PKCS#1 v1.5 填充预言机历史包袱   | 握手有额外计算成本，参数校验和临时密钥管理依赖实现质量 |
| TLS 1.3 情况       | 静态 RSA 密钥交换已移除                                 | 临时密钥协商成为主线                                   |

![RSA vs ECDHE 对比速查](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/https-rsa-ecdhe-rsa-vs-ecdhe-quick-reference.png)

### 常见误读：ECDHE_RSA 不是两种算法都加密

`ECDHE_RSA` 这个名字很容易让人误以为两种算法都在加密。以这个密码套件为例：

```text
TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
```

这里的分工是：ECDHE 负责密钥交换，RSA 负责身份认证签名，AES-256-GCM 负责保护记录层数据，SHA384 用于 TLS 1.2 的 PRF 和 `Finished` 验证。RSA 证书签名和 RSA 密钥交换是两件事；前者在现代 HTTPS 中仍然常见，后者已经从 TLS 1.3 中移除。

## 面试怎么回答：HTTPS 握手里的 RSA 和 ECDHE，到底差在哪？

RSA 和 ECDHE 的核心区别在于，会话密钥材料是“传过去的”，还是“协商出来的”。

在 TLS 1.2 的静态 RSA 握手里，客户端生成 `PreMasterSecret`，用服务器证书里的 RSA 公钥加密后发给服务端，服务端再用 RSA 私钥解密。问题是，如果攻击者保存了当年的握手流量，后来服务器私钥又泄漏，就可能回头解出历史会话密钥，所以它没有前向安全。

ECDHE 不直接传输共享秘密。客户端和服务端各自生成临时密钥对，交换临时公钥后，双方本地算出同一个共享秘密。服务器证书私钥主要用于签名认证，证明临时参数没被中间人替换，而不是用来解密会话密钥。

面试时可以这样回答：TLS 1.2 的静态 RSA 握手由客户端生成 `PreMasterSecret`，再使用服务器 RSA 公钥加密发送；如果攻击者保存了完整握手流量并在以后获得服务器私钥，历史会话可能被解密，因此它不具备前向安全。ECDHE 不直接传输共享秘密，双方交换临时公钥后各自在本地算出相同秘密；证书私钥主要用于签名认证，而不直接解密会话密钥。TLS 1.3 已移除静态 RSA 密钥交换，并使用 (EC)DHE、PSK 或两者结合的方式建立密钥。


---

<!-- source: 计算机网络/NAT 协议详解（网络层）.md -->

---
title: NAT 协议详解（网络层）
description: 解析 NAT 的地址转换与端口映射机制，结合 LAN/WAN 通信与转换表，理解家庭与企业网络的实践细节。
category: 计算机基础
tag:
  - 计算机网络
head:
  - - meta
    - name: keywords
      content: NAT,地址转换,端口映射,LAN,WAN,连接跟踪,DHCP
---

很多设备在家用网络、公司内网里使用的都是私有 IP 地址，比如 `192.168.x.x`、`10.x.x.x`。这些地址不能直接在公网中路由，但内网设备依然可以访问互联网。

这背后通常就有 NAT 在工作。NAT 会在内网地址和公网地址之间做转换，让多个内网设备共享一个或少量公网 IP 对外通信。

这篇文章主要回答几个问题：

1. NAT 主要解决什么问题？
2. NAT 转换表是如何记录内外网地址和端口映射的？
3. 内网主机访问公网时，源 IP 和端口会发生什么变化？
4. NAT 会带来哪些限制，比如外部主动访问内网主机为什么更麻烦？

## 应用场景

**NAT 协议（Network Address Translation）** 的应用场景如同它的名称——网络地址转换，应用于内部网到外部网的地址转换过程中。具体地说，在一个小的子网（局域网，Local Area Network，LAN）内，各主机使用的是同一个 LAN 下的 IP 地址，但在该 LAN 以外，在广域网（Wide Area Network，WAN）中，需要一个统一的 IP 地址来标识该 LAN 在整个 Internet 上的位置。

这个场景其实不难理解。随着一个个小型办公室、家庭办公室（Small Office, Home Office, SOHO）的出现，为了管理这些 SOHO，一个个子网被设计出来，从而在整个 Internet 中的主机数量将非常庞大。如果每个主机都有一个“绝对唯一”的 IP 地址，那么 IPv4 地址的表达能力可能很快达到上限（$2^{32}$）。因此，实际上，SOHO 子网中的 IP 地址是“相对的”，这在一定程度上也缓解了 IPv4 地址的分配压力。

SOHO 子网的“代理人”，也就是和外界的窗口，通常由路由器扮演。路由器的 LAN 一侧管理着一个小子网，而它的 WAN 接口才是真正参与到 Internet 中的接口，也就有一个“绝对唯一的地址”。NAT 协议，正是在 LAN 中的主机在与 LAN 外界通信时，起到了地址转换的关键作用。

## 细节

![NAT 将内网私有地址转换为公网地址的过程](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/nat-demo.png)

假设当前场景如上图。中间是一个路由器，它的右侧组织了一个 LAN，网络号为 `10.0.0/24`。LAN 侧接口的 IP 地址为 `10.0.0.4`，并且该子网内有至少三台主机，分别是 `10.0.0.1`、`10.0.0.2` 和 `10.0.0.3`。路由器的左侧连接的是 WAN，WAN 侧接口的 IP 地址为 `138.76.29.7`。

首先，针对以上信息，我们有如下事实需要说明：

1. 路由器右侧子网的网络地址为 `10.0.0.0/24`（网络前缀 24 位，主机号占 8 位），三台主机地址以及路由器的 LAN 侧接口地址，均由 DHCP 协议规定。而且，该 DHCP 运行在路由器内部（路由器自维护一个小 DHCP 服务器），从而为子网内提供 DHCP 服务。
2. 路由器的 WAN 侧接口地址同样由 DHCP 协议规定，但该地址是路由器从 ISP（网络服务提供商）处获得，也就是该 DHCP 通常运行在路由器所在区域的 DHCP 服务器上。

现在，路由器内部还运行着 NAT 协议，从而为 LAN-WAN 间通信提供地址转换服务。为此，一个很重要的结构是 **NAT 转换表**。为了说明 NAT 的运行细节，假设有以下请求发生：

1. 主机 `10.0.0.1` 向 IP 地址为 `128.119.40.186` 的 Web 服务器（端口 80）发送了 HTTP 请求（如请求页面）。此时，主机 `10.0.0.1` 将随机指派一个端口，如 `3345`，作为本次请求的源端口号，将该请求发送到路由器中（目的地址将是 `128.119.40.186`，但会先到达 `10.0.0.4`）。
2. `10.0.0.4` 即路由器的 LAN 接口收到 `10.0.0.1` 的请求。路由器将为该请求指派一个新的源端口号，如 `5001`，并将请求报文发送给 WAN 接口 `138.76.29.7`。同时，在 NAT 转换表中记录一条转换记录 **138.76.29.7:5001——10.0.0.1:3345**。
3. 请求报文到达 WAN 接口，继续向目的主机 `128.119.40.186` 发送。

之后，将会有如下响应发生：

1. 主机 `128.119.40.186` 收到请求，构造响应报文，并将其发送给目的地 `138.76.29.7:5001`。
2. 响应报文到达路由器的 WAN 接口。路由器查询 NAT 转换表，发现 `138.76.29.7:5001` 在转换表中有记录，从而将其目的地址和目的端口转换成为 `10.0.0.1:3345`，再发送到 `10.0.0.4` 上。
3. 被转换的响应报文到达路由器的 LAN 接口，继而被转发至目的地 `10.0.0.1`。

![LAN-WAN 间通信提供地址转换](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/nat-demo2.png)

🐛 修正（参见：[issue#2009](https://github.com/Snailclimb/JavaGuide/issues/2009)）：上图第四步的 Dest 值应该为 `10.0.0.1:3345` 而不是~~`138.76.29.7:5001`~~，这里笔误了。

## 划重点

针对以上过程，有以下几个重点需要强调：

1. 端口字段为 16 位，并不能推出一个 NAT 后面最多只能有约 65500 台主机。端口空间限制的是特定外部地址、传输协议、映射行为和映射生命周期下可同时维持的转换映射数量，而不是内网主机总数。一个主机可以创建多个映射，NAT 也可以使用多个公网地址。
2. 对于目的服务器来说，从来不知道“到底是哪个主机给我发送的请求”，它只知道是来自 `138.76.29.7:5001` 的路由器转发的请求。因此，可以说，**路由器在 WAN 和 LAN 之间起到了屏蔽作用**，所有内部主机发送到外部的报文，都具有同一个 IP 地址（不同的端口号），所有外部发送到内部的报文，也都只有一个目的地（不同端口号），是经过了 NAT 转换后，外部报文才得以正确地送达内部主机。
3. NAT 是否复用已有映射不能只看内网 IP。映射至少需要区分传输协议、内部 IP 和内部端口；是否还与远端地址和端口相关，取决于 NAT 的具体映射行为。只有报文与已有映射匹配时，NAT 才能复用相应的外部地址和端口。

总结 NAT 协议的特点，有以下几点：

1. NAT 协议通过对 WAN 屏蔽 LAN，有效地缓解了 IPv4 地址分配压力。
2. LAN 主机 IP 地址的变更，无需通告 WAN。
3. WAN 的 ISP 变更接口地址时，无需通告 LAN 内主机。
4. NAT 会隐藏内部地址和拓扑；许多 NAT 设备的过滤行为还会使没有既有映射的外部流量难以直接到达内部主机。不过，决定哪些入站报文可以通过的是过滤策略，而不是地址转换本身。NAT 不能替代状态防火墙、访问控制和主机安全措施。

然而，NAT 协议由于其独特性，存在着一些争议。比如，可能你已经注意到了，**NAT 协议在 LAN 以外，标识一个内部主机时，使用的是端口号，因为 IP 地址都是相同的**。这种将端口号作为主机寻址的行为，可能会引发一些误会。此外，路由器作为网络层的设备，修改了传输层的分组内容（修改了源 IP 地址和端口号），同样是不规范的行为。但是，尽管如此，NAT 协议作为 IPv4 时代的产物，极大地方便了一些本来棘手的问题，一直被沿用至今。

<!-- @include: @article-footer.snippet.md -->


---

<!-- source: 计算机网络/OSI 七层模型与 TCPIP 四层模型详解.md -->

---
title: OSI 七层模型与 TCP/IP 四层模型详解
description: 详解 OSI 与 TCP/IP 的分层模型与职责划分，结合历史与实践对比两者差异与工程取舍。
category: 计算机基础
tag:
  - 计算机网络
head:
  - - meta
    - name: keywords
      content: OSI 七层,TCP/IP 四层,分层模型,职责划分,协议栈,对比
---

网络分层是学习计算机网络的第一张地图。没有这张地图，HTTP、TCP、IP、以太网、DNS 这些概念很容易堆在一起，分不清谁依赖谁、谁负责什么。

常见的两套分层模型是 OSI 七层模型和 TCP/IP 四层模型。前者更适合建立概念框架，后者更贴近互联网实际落地。

这篇文章主要回答几个问题：

1. OSI 七层模型每一层分别做什么？
2. TCP/IP 四层模型和 OSI 七层模型如何对应？
3. 为什么 OSI 模型理论完整，但实际没有成为互联网主流实现？
4. 学习具体网络协议时，为什么要先知道它位于哪一层？

## OSI 七层模型

**OSI 七层模型** 是国际标准化组织提出一个网络分层模型，其大体结构以及每一层提供的功能如下图所示：

![OSI 七层模型各层功能划分](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/osi-7-model.png)

每一层都专注做一件事情，并且每一层都需要使用下一层提供的功能比如传输层需要使用网络层提供的路由和寻址功能，这样传输层才知道把数据传输到哪里去。

**OSI 的七层体系结构概念清楚，理论也很完整，但是它比较复杂而且不实用，而且有些功能在多个层中重复出现。**

上面这种图可能比较抽象，再来一个比较生动的图片。下面这个图片是我在国外的一个网站上看到的，非常赞！

![osi七层模型2](https://oss.javaguide.cn/github/javaguide/osi七层模型2.png)

**既然 OSI 七层模型这么厉害，为什么干不过 TCP/IP 四层模型呢？**

的确，OSI 七层模型当时一直被一些大公司甚至一些国家政府支持。这样的背景下，为什么会失败呢？我觉得主要有下面几方面原因：

1. OSI 的专家缺乏实际经验，他们在完成 OSI 标准时缺乏商业驱动力
2. OSI 的协议实现起来过分复杂，而且运行效率很低
3. OSI 制定标准的周期太长，因而使得按 OSI 标准生产的设备无法及时进入市场（20 世纪 90 年代初期，虽然整套的 OSI 国际标准都已经制定出来，但基于 TCP/IP 的互联网已经抢先在全球相当大的范围成功运行了）
4. OSI 的层次划分不太合理，有些功能在多个层次中重复出现。

OSI 七层模型虽然失败了，但是却提供了很多不错的理论基础。为了更好地去了解网络分层，OSI 七层模型还是非常有必要学习的。

最后再分享一个关于 OSI 七层模型非常不错的总结图片！

![OSI 七层模型和 TCP/IP 四层模型的层级对应关系](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/osi-model-detail.png)

## TCP/IP 四层模型

**TCP/IP 四层模型** 是目前被广泛采用的一种模型，我们可以将 TCP/IP 模型看作是 OSI 七层模型的精简版本，由以下 4 层组成：

1. 应用层
2. 传输层
3. 网络层
4. 网络接口层

需要注意的是，我们并不能将 TCP/IP 四层模型 和 OSI 七层模型完全精确地匹配起来，不过可以简单将两者对应起来，如下图所示：

![TCP/IP 四层模型各层功能划分](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-ip-4-model.png)

### 应用层（Application layer）

**应用层位于传输层之上，主要提供两个终端设备上的应用程序之间信息交换的服务，它定义了信息交换的格式，消息会交给下一层传输层来传输。** 我们把应用层交互的数据单元称为报文。

![网络五层模型在一次数据传输中的协作过程](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/network-five-layer-sample-diagram.png)

应用层协议定义了网络通信规则，对于不同的网络应用需要不同的应用层协议。在互联网中应用层协议很多，如支持 Web 应用的 HTTP 协议，支持电子邮件的 SMTP 协议等等。

**应用层常见协议**：

![应用层常见协议](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/application-layer-protocol.png)

- **HTTP（Hypertext Transfer Protocol，超文本传输协议）**：基于 TCP 协议，是一种用于传输超文本和多媒体内容的协议，主要是为 Web 浏览器与 Web 服务器之间的通信而设计的。当我们使用浏览器浏览网页的时候，我们网页就是通过 HTTP 请求进行加载的。
- **SMTP（Simple Mail Transfer Protocol，简单邮件发送协议）**：基于 TCP 协议，是一种用于发送电子邮件的协议。注意 ⚠️：SMTP 协议只负责邮件的发送，而不是接收。要从邮件服务器接收邮件，需要使用 POP3 或 IMAP 协议。
- **POP3/IMAP（邮件接收协议）**：基于 TCP 协议，两者都是负责邮件接收的协议。IMAP 协议是比 POP3 更新的协议，它在功能和性能上都更加强大。IMAP 支持邮件搜索、标记、分类、归档等高级功能，而且可以在多个设备之间同步邮件状态。几乎所有现代电子邮件客户端和服务器都支持 IMAP。
- **FTP（File Transfer Protocol，文件传输协议）**：基于 TCP 协议，是一种用于在计算机之间传输文件的协议，可以屏蔽操作系统和文件存储方式。注意 ⚠️：FTP 是一种不安全的协议，因为它在传输过程中不会对数据进行加密。建议在传输敏感数据时使用更安全的协议，如 SFTP。
- **Telnet（远程登陆协议）**：基于 TCP 协议，用于通过一个终端登陆到其他服务器。Telnet 协议的最大缺点之一是所有数据（包括用户名和密码）均以明文形式发送，这有潜在的安全风险。这就是为什么如今很少使用 Telnet，而是使用一种称为 SSH 的非常安全的网络传输协议的主要原因。
- **SSH（Secure Shell Protocol，安全的网络传输协议）**：基于 TCP 协议，通过加密和认证机制实现安全的访问和文件传输等业务
- **RTP（Real-time Transport Protocol，实时传输协议）**：通常基于 UDP 协议，但也支持 TCP 协议。它提供了端到端的实时传输数据的功能，但不包含资源预留存、不保证实时传输质量，这些功能由 WebRTC 实现。
- **DNS（Domain Name System，域名管理系统）**：通常基于 UDP 协议（端口 53），用于解决域名和 IP 地址的映射问题。当响应数据过大或进行区域传送时会改用 TCP。

关于这些协议的详细介绍请看 [应用层常见协议总结（应用层）](./常见应用层协议总结-HTTP、WebSocket、SMTP、FTP、SSH、DNS 等.md) 这篇文章。

### 传输层（Transport layer）

**传输层的主要任务就是负责向两台终端设备进程之间的通信提供通用的数据传输服务。** 应用进程利用该服务传送应用层报文。“通用的”是指并不针对某一个特定的网络应用，而是多种应用可以使用同一个运输层服务。

**传输层常见协议**：

![传输层常见协议](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/transport-layer-protocol.png)

- **TCP（Transmission Control Protocol，传输控制协议）**：提供 **面向连接** 的，**可靠** 的数据传输服务。
- **UDP（User Datagram Protocol，用户数据协议）**：提供 **无连接** 的，**尽最大努力** 的数据传输服务（不保证数据传输的可靠性），简单高效。

### 网络层（Network layer）

**网络层负责为分组交换网上的不同主机提供通信服务。** 在发送数据时，网络层把运输层产生的报文段或用户数据报封装成分组和包进行传送。在 TCP/IP 体系结构中，由于网络层使用 IP 协议，因此分组也叫 IP 数据报，简称数据报。

⚠️ 注意：**不要把运输层的“用户数据报 UDP”和网络层的“IP 数据报”弄混**。

**网络层的还有一个任务就是选择合适的路由，使源主机运输层所传下来的分组，能通过网络层中的路由器找到目的主机。**

这里强调指出，网络层中的“网络”二字已经不是我们通常谈到的具体网络，而是指计算机网络体系结构模型中第三层的名称。

互联网是由大量的异构（heterogeneous）网络通过路由器（router）相互连接起来的。互联网使用的网络层协议是无连接的网际协议（Internet Protocol）和许多路由选择协议，因此互联网的网络层也叫做 **网际层** 或 **IP 层**。

**网络层常见协议**：

![网络层常见协议](./images/network-model/nerwork-layer-protocol.png)

- **IP（Internet Protocol，网际协议）**：TCP/IP 协议中最重要的协议之一，主要作用是定义数据包的格式、对数据包进行路由和寻址，以便它们可以跨网络传播并到达正确的目的地。目前 IP 协议主要分为两种，一种是过去的 IPv4，另一种是较新的 IPv6，目前这两种协议都在使用，但后者已经被提议来取代前者。
- **ARP（Address Resolution Protocol，地址解析协议）**：ARP 协议解决的是网络层地址和链路层地址之间的转换问题。因为一个 IP 数据报在物理上传输的过程中，总是需要知道下一跳（物理上的下一个目的地）该去往何处，但 IP 地址属于逻辑地址，而 MAC 地址才是物理地址，ARP 协议解决了 IP 地址转 MAC 地址的一些问题。
- **ICMP（Internet Control Message Protocol，互联网控制报文协议）**：一种用于传输网络状态和错误消息的协议，常用于网络诊断和故障排除。例如，Ping 工具就使用了 ICMP 协议来测试网络连通性。
- **NAT（Network Address Translation，网络地址转换协议）**：NAT 协议的应用场景如同它的名称——网络地址转换，应用于内部网到外部网的地址转换过程中。具体地说，在一个小的子网（局域网，LAN）内，各主机使用的是同一个 LAN 下的 IP 地址，但在该 LAN 以外，在广域网（WAN）中，需要一个统一的 IP 地址来标识该 LAN 在整个 Internet 上的位置。
- **OSPF（Open Shortest Path First，开放式最短路径优先）**：一种内部网关协议（Interior Gateway Protocol，IGP），也是广泛使用的一种动态路由协议，基于链路状态算法，考虑了链路的带宽、延迟等因素来选择最佳路径。
- **RIP（Routing Information Protocol，路由信息协议）**：一种内部网关协议（Interior Gateway Protocol，IGP），也是一种动态路由协议，基于距离向量算法，使用固定的跳数作为度量标准，选择跳数最少的路径作为最佳路径。
- **BGP（Border Gateway Protocol，边界网关协议）**：一种用来在路由选择域之间交换网络层可达性信息（Network Layer Reachability Information，NLRI）的路由选择协议，具有高度的灵活性和可扩展性。

### 网络接口层（Network interface layer）

我们可以把网络接口层看作是数据链路层和物理层的合体。

1. 数据链路层（data link layer）通常简称为链路层（两台主机之间的数据传输，总是在一段一段的链路上传送的）。**数据链路层的作用是将网络层交下来的 IP 数据报组装成帧，在两个相邻节点间的链路上传送帧。每一帧包括数据和必要的控制信息（如同步信息，地址信息，差错控制等）。**
2. **物理层的作用是实现相邻计算机节点之间比特流的透明传送，尽可能屏蔽掉具体传输介质和物理设备的差异**

网络接口层重要功能和协议如下图所示：

![网络接口层重要功能和协议](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/network-interface-layer-protocol.png)

### 总结

简单总结一下每一层包含的协议和核心技术:

![TCP/IP 各层协议概览](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/network-protocol-overview.png)

**应用层协议**：

- HTTP（Hypertext Transfer Protocol，超文本传输协议）
- SMTP（Simple Mail Transfer Protocol，简单邮件发送协议）
- POP3/IMAP（邮件接收协议）
- FTP（File Transfer Protocol，文件传输协议）
- Telnet（远程登陆协议）
- SSH（Secure Shell Protocol，安全的网络传输协议）
- RTP（Real-time Transport Protocol，实时传输协议）
- DNS（Domain Name System，域名管理系统）
- ……

**传输层协议**：

- TCP 协议
  - 报文段结构
  - 可靠数据传输
  - 流量控制
  - 拥塞控制
- UDP 协议
  - 报文段结构
  - RDT（可靠数据传输协议）

**网络层协议**：

- IP（Internet Protocol，网际协议）
- ARP（Address Resolution Protocol，地址解析协议）
- ICMP 协议（控制报文协议，用于发送控制消息）
- NAT（Network Address Translation，网络地址转换协议）
- OSPF（Open Shortest Path First，开放式最短路径优先）
- RIP（Routing Information Protocol，路由信息协议）
- BGP（Border Gateway Protocol，边界网关协议）
- ……

**网络接口层**：

- 差错检测技术
- 多路访问协议（信道复用技术）
- CSMA/CD 协议
- MAC 协议
- 以太网技术
- ……

## 网络分层的原因

在这篇文章的最后，我想聊聊：“为什么网络要分层？”。

说到分层，我们先从我们平时使用框架开发一个后台程序来说，我们往往会按照每一层做不同的事情的原则将系统分为三层（复杂的系统分层会更多）:

1. Repository（数据库操作）
2. Service（业务操作）
3. Controller（前后端数据交互）

**复杂的系统需要分层，因为每一层都需要专注于一类事情。网络分层的原因也是一样，每一层只专注于做一类事情。**

好了，再来说回：“为什么网络要分层？”。我觉得主要有 3 方面的原因：

1. **各层之间相互独立**：各层之间相互独立，各层之间不需要关心其他层是如何实现的，只需要知道自己如何调用下层提供好的功能就可以了（可以简单理解为接口调用）**。这个和我们对开发时系统进行分层是一个道理。**
2. **提高了整体灵活性**：每一层都可以使用最适合的技术来实现，你只需要保证你提供的功能以及暴露的接口的规则没有改变就行了。**这个和我们平时开发系统的时候要求的高内聚、低耦合的原则也是可以对应上的。**
3. **大问题化小**：分层可以将复杂的网络问题分解为许多比较小的、界线比较清晰简单的小问题来处理和解决。这样使得复杂的计算机网络系统变得易于设计，实现和标准化。 **这个和我们平时开发的时候，一般会将系统功能分解，然后将复杂的问题分解为容易理解的更小的问题是相对应的，这些较小的问题具有更好的边界（目标和接口）定义。**

我想到了计算机世界非常非常有名的一句话，这里分享一下：

> 计算机科学领域的任何问题都可以通过增加一个间接的中间层来解决，计算机整个体系从上到下都是按照严格的层次结构设计的。

## 参考

- TCP/IP model vs OSI model：<https://fiberbit.com.tw/tcpip-model-vs-osi-model/>
- Data Encapsulation and the TCP/IP Protocol Stack：<https://docs.oracle.com/cd/E19683-01/806-4075/ipov-32/index.html>

<!-- @include: @article-footer.snippet.md -->


---

<!-- source: 计算机网络/TCP Keepalive 和 HTTP Keep-Alive 有什么区别？.md -->

---
title: TCP Keepalive 和 HTTP Keep-Alive 有什么区别？
description: 对比 TCP Keepalive 与 HTTP Keep-Alive 的协议层级、核心作用、默认行为、回收方式和典型使用场景，讲清 HTTP/1.0、HTTP/1.1、HTTP/2、HTTP/3 中 Keep-Alive 相关机制的演进。
category: 计算机基础
tag:
  - 计算机网络
head:
  - - meta
    - name: keywords
      content: TCP Keepalive,HTTP Keep-Alive,Keep-Alive,长连接,短连接,TCP保活,HTTP长连接,HTTP/1.0,HTTP/1.1,HTTP/2,HTTP/3,QUIC,UDP,SO_KEEPALIVE
---

你好，我是小 G。TCP Keepalive 和 HTTP Keep-Alive 的对比，经常作为面试题出现在技术面试中。这篇文章来详细聊一聊。

简单来说，这俩只是后缀名字一样，但完全不是一回事，毕竟一个在应用层，一个在传输层，根本不在同一层：

- **HTTP Keep-Alive** 是应用层的机制，解决的问题是：一个 TCP 连接能不能被多个 HTTP 请求复用，别每次请求都重新握手。
- **TCP Keepalive** 是传输层的机制，解决的问题是：一条 TCP 连接长时间没有数据往来，怎么判断对端还在不在，要不要把连接占用的资源回收掉。

![TCP/IP 四层模型中 HTTP 与 TCP 所在层次](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-ip-4-model.png)

一个管“连接要不要复用”，一个管“连接还活不活着”。协议层不同，目的也不同，只是名字撞了。

下面分开讲。

## HTTP 的 Keep-Alive 是什么？

先说问题。HTTP 1.0 的默认行为是：每个 TCP 连接只服务一次 HTTP 请求和响应。服务器发完响应，马上发起关闭连接的请求，客户端跟着关，TCP 连接就双向断开了。

![HTTP：超文本传输协议概览](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/http-overview.png)

你打开一个网页，HTML、CSS、JS、图片可能有几十个资源要加载。如果每个资源都独立建连接再销毁，光三次握手和四次挥手的开销就不小，TCP 连接的利用率很低。

这个问题很明显：**为什么一个 TCP 连接不能服务多次 HTTP 请求呢？**

于是 HTTP 引入了 `Connection` 头部。以 HTTP/1.0 为例，客户端可以在请求头里带上：

```
Connection: Keep-Alive
```

服务器如果也在响应头里确认这个字段，就表示双方都同意这次 HTTP 交易用到的 TCP 连接是一个**长连接（Persistent Connection）**——请求/响应结束后先别关，后续其他 HTTP 请求还可以接着复用这条连接，直到连接空闲超时、达到请求次数上限，或者被任意一方主动关闭。

**在不同 HTTP 版本里，Keep-Alive 的默认行为不一样：**

![不同 HTTP 版本里，Keep-Alive 的默认行为不一样](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/different-http-versions-have-different-default-keep-alive-behaviors.png)

- **HTTP 1.0**：默认是短连接。要用长连接，请求头里得显式带上 `Connection: Keep-Alive`，而且服务器也要在响应头里带上这个字段才算生效。
- **HTTP 1.1**：默认就是长连接，不需要额外声明。如果希望请求结束后关闭连接，需要显式指定： `Connection: close`。这也是为什么 HTTP/1.1 相比 HTTP/1.0 能明显减少 TCP 建连和挥手开销。
- **HTTP/2**：HTTP/2 不再沿用 HTTP/1.x “一个连接串行处理多个请求”的方式，而是引入了多路复用（Multiplexing），也就是说一个 TCP 连接上可以同时并发多个 Stream，请求和响应可以交错传输，不再互相阻塞，解决了 HTTP/1.1 应用层的队头阻塞问题。不过，HTTP/2 依然跑在单条 TCP 连接上，一旦底层 TCP 出现丢包，后续数据仍然要等待重传，因此它依然会受到 TCP 层队头阻塞的影响。这种基于 HTTP/1.x 的连接控制方式在 HTTP/2 中已经没有意义了。更严格地说，`Connection`、`Keep-Alive`、`Transfer-Encoding` 等 connection-specific headers 在 HTTP/2 中是被禁止使用的，带有这些头部的消息会被视为不合法。
- **HTTP/3**：HTTP/3 基于 QUIC，运行在 UDP 之上，不再依赖 TCP 连接，也不使用 HTTP/1.x 的 `Connection: Keep-Alive` 这套连接控制方式。QUIC 自己负责连接管理、保活和多路复用，并在传输层面缓解了 TCP 队头阻塞问题。

一句话总结：HTTP/1.0 需要显式 Keep-Alive，HTTP/1.1 默认连接复用，HTTP/2 从“连接复用”升级成了“单 TCP 连接上的多路复用”，而 HTTP/3 则直接换成了基于 QUIC 的连接管理。

## HTTP 长连接怎么关闭和回收？

长连接提高了 TCP 利用率，但也带来一个新的问题：客户端打开一个页面，TCP 连接建好了，结果用户就把页面扔在那里不管了。这条连接一直空闲着，服务器不能无限等下去，但也不能完全靠客户端自觉关闭。

如果这类空闲连接堆积多了，服务器的 TCB（TCP Control Block）资源会被白白占掉。

HTTP 的解决办法是在 `Keep-Alive` 头部里带两个参数：

```
Keep-Alive: timeout=5, max=10
```

- **timeout=5**：连接空闲超过 5 秒，服务器就可以关闭。
- **max=10**：这条连接最多服务 10 次 HTTP 请求，到了次数上限就强制关闭。

这里有个点容易忽略：**到了 timeout 或 max 的阈值，不管客户端当时在不在线，服务器都可以关闭连接。** 如果客户端刚好复用这条旧连接发送新请求，就可能遇到连接已经关闭、请求失败后需要重试的情况。

也就是说，HTTP Keep-Alive 的空闲连接回收通常由服务器配置主导。客户端当然可以主动关闭连接，但服务器不会一直等客户端“表态”。

在实际的 Web 服务器配置中，这些参数由服务端决定。比如 Nginx 的 `keepalive_timeout` 默认值是 75 秒，`keepalive_requests` 默认值是 1000（Nginx 1.19.10 之前的版本默认是 100）。

## TCP 的 Keepalive 是什么？

TCP Keepalive 要解决的问题完全不一样：它不关心连接上跑不跑 HTTP 请求，它关心的是——**对端到底还在不在**。

考虑这样一个场景：客户端和服务器之间建了一条 TCP 连接，但客户端突然断电了、网线被拔了、或者系统直接崩了。这时候服务器这边完全不知道对面已经没了，因为 TCP 又不像打电话，没有“忙音”。这条连接就变成了一条“半打开”（Half-Open）的死连接，白白占着服务器内存中的 TCB 资源。

TCP Keepalive 就是用来发现这种情况的。它的工作流程如下：

![TCP Keepalive 工作原理](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-keepalive-vs-http-keepalive-tcp-keepalive-working-principle.png)

1. 一条 TCP 连接上如果一段时间没有任何数据往来（默认 **7200 秒，也就是 2 小时**），内核会自动给对端发一个**探测报文（Probe）**。
2. 如果对端正常在线，会回复一个 ACK，然后计时器重置，再等 2 小时。
3. 如果对端没有回复，每隔 **75 秒** 重发一个探测包，最多重试 **9 次**。
4. 9 次都没回复，内核判定连接已死，发 RST 关闭连接，释放资源。

这三个参数在 Linux 上对应的内核配置是：

| 参数                   | 含义                         | Linux 默认值      |
| ---------------------- | ---------------------------- | ----------------- |
| `tcp_keepalive_time`   | 连接空闲多久后开始发送探测包 | 7200 秒（2 小时） |
| `tcp_keepalive_intvl`  | 两次探测包之间的间隔         | 75 秒             |
| `tcp_keepalive_probes` | 最多发送几次探测包           | 9 次              |

macOS 属于 BSD 系网络栈风格，没有 `net.ipv4.*`，对应的是：`net.inet.tcp.*`。

![Mac 下查看 TCP Keepalive 参数](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-keepalive-parameters.jpg)

按默认值算，从连接开始空闲到最终被判死，最长要等 **7200 + 75 × 9 = 7875 秒**，差不多 2 小时 11 分钟。

可以通过 `sysctl` 查看和修改：

```bash
sysctl net.ipv4.tcp_keepalive_time
sysctl net.ipv4.tcp_keepalive_intvl
sysctl net.ipv4.tcp_keepalive_probes
```

还有一个很容易踩的坑：**TCP Keepalive 默认是关闭的。** 应用程序必须在创建 socket 时通过 `SO_KEEPALIVE` 选项显式开启，否则内核不会发探测包。这在 RFC 1122 里有明确规定：Keepalive 是可选功能，必须默认不启用。

理解了工作原理之后，TCP Keepalive 的性质就很清楚了——它是一种**“温和”的资源回收机制**。它只能在确认对方不在线之后才回收资源。只要对方还在线、还能回 ACK，这条连接就只能继续维持着，定时器重置，再等下一个 2 小时。对方在线的时候，服务器没有任何办法通过 TCP Keepalive 来关掉这条连接。

这和 HTTP Keep-Alive 的“到时间就关，不管你在不在”形成了鲜明的对比。

## TCP Keepalive 探测后会出现哪几种情况？

内核发出探测报文后，根据对端的实际状态，会走向不同的结果：

![TCP Keepalive 探测机制](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-keepalive-vs-http-keepalive-tcp-keepalive-detection-mechanism.png)

**1. 对端正常在线**

对端收到探测包，TCP 栈回复一个 ACK。发送方收到 ACK，把空闲计时器重置为 `tcp_keepalive_time`，继续等待。连接不会被关闭。

**2. 对端曾经崩溃，但已经重启**

对端虽然在线，但由于重启过，内核里已经没有这条连接的上下文了。收到探测包后，对端的 TCP 栈会回复一个 RST（因为它不认识这条连接）。发送方收到 RST，立即关闭连接。

**3. 对端崩溃且未恢复，或者网络不可达**

探测包发出去后得不到任何回复。发送方每隔 `tcp_keepalive_intvl` 秒重试一次，连续 `tcp_keepalive_probes` 次都没响应，判定连接已死，内核关闭连接并释放资源。

第 3 种情况也覆盖了一些中间网络设备导致的问题。比如 NAT 网关通常有会话超时机制，如果一条连接长时间没有数据传输，NAT 表项会被清掉。后续的探测包就没法到达对端，效果和对端崩溃一样——都是得不到回复，最终超时关闭。

## TCP Keepalive 有什么局限？

这里的 TCP Keepalive 指的是 TCP 层的 keep-alive 探测机制，不是 HTTP 的 Keep-Alive 连接复用。它能检测死连接，但在生产环境中，光靠它通常不够，原因有几个：

**默认探测太慢了。** 以 Linux 默认配置为例，连接空闲 7200 秒后才开始发送探测；Windows 默认 keep-alive timeout 也是 2 小时。这个量级对大部分在线业务连接来说都偏长。Linux 的 `net.ipv4.tcp_keepalive_*` 是系统默认值，会影响未单独设置的连接；如果应用需要按连接区分策略，可以在支持的平台上逐 socket 设置 `TCP_KEEPIDLE`、`TCP_KEEPINTVL`、`TCP_KEEPCNT`。不过，这类选项不适合写成跨平台通用方案，具体还要看操作系统和语言运行时是否暴露。

**只能检测连接存活，不能检测应用健康。** TCP Keepalive 的探测包是内核发的，对端的 TCP 栈收到后直接回 ACK，应用层完全不参与。所以它只能说明对端内核还能收到包并返回 ACK，不能说明对端应用线程池、事件循环、数据库连接池、业务依赖是否正常。这是它最大的盲区。

**经过中间层时容易看错对象。** 如果客户端和服务器之间有 NAT、四层负载均衡或反向代理，要先看 TCP 连接有没有被中间层终止。如果中间层只是做 NAT/连接跟踪，Keepalive 间隔需要小于中间设备的空闲超时，才可能避免表项被清掉；如果中间层终止了 TCP 连接，后端检测到的只是后端到中间层这一段连接是否存活，不代表真实客户端一定还活着。

**各操作系统的实现和默认值不一致。** 比如 Linux 默认是 7200 秒后开始探测、75 秒间隔、最多 9 次；Windows 默认 timeout 也是 2 小时，但 interval 默认 1 秒，Windows Vista 及之后 probe 次数固定为 10，不能改；macOS 属于 BSD 系网络栈风格，没有 Linux 的 `net.ipv4.*` 这组 sysctl，相关参数通常在 `net.inet.tcp.*` 下面。靠 TCP Keepalive 做跨平台连接健康检查，一致性很难保证，具体参数名、单位和默认值最好以目标系统实测为准。

**不直接作用于 HTTP/3/QUIC。** 对真正的 HTTP/3/QUIC 连接来说，TCP Keepalive 不参与连接存活检测；但客户端如果因为 UDP 被阻断等原因回退到 HTTP/1.1 或 HTTP/2，那回退后的 TCP 连接仍然可能受 TCP Keepalive 影响。HTTP/3 的连接存活和超时由 QUIC 处理，例如 QUIC 有 idle timeout，必要时可以发送 PING frame 做 liveness testing；HTTP/3 层关闭连接时还可以用 GOAWAY 协助优雅关闭。

所以实际工程中，TCP Keepalive 更多是作为兜底手段，帮你清理那些明确已经死掉的连接。如果需要更快速、更细粒度、且能感知应用层状态的健康检查，还是得在应用层自己做心跳，比如 WebSocket 的 Ping/Pong、gRPC 的 keepalive ping，或者业务自定义的心跳协议。

应用层心跳也不是越频繁越好。心跳间隔太短会增加包量、服务端定时器压力和弱网误判概率；间隔太长又发现故障不及时。实际配置要结合连接规模、NAT/LB idle timeout、业务可接受的故障发现时间一起定。

## TCP Keepalive 和 HTTP Keep-Alive 对比总结

| 对比维度          | HTTP Keep-Alive                                         | TCP Keepalive                                       |
| ----------------- | ------------------------------------------------------- | --------------------------------------------------- |
| **所属层**        | 应用层（HTTP 协议）                                     | 传输层（TCP 协议）                                  |
| **解决的问题**    | 复用 TCP 连接，减少重复建连、挥手、慢启动等开销         | 探测长时间空闲的 TCP 连接，对端失联后释放连接资源   |
| **默认行为**      | HTTP/1.0 默认短连接；HTTP/1.1 默认长连接                | 默认关闭，应用需要显式开启 `SO_KEEPALIVE`           |
| **控制粒度**      | 由 HTTP 客户端、Web 服务器或代理按连接策略控制          | 由操作系统内核控制，也可在部分平台逐 socket 调整    |
| **常见参数**      | `Connection`、`Keep-Alive: timeout/max`、服务器超时配置 | `tcp_keepalive_time/intvl/probes` 或平台对应参数    |
| **关闭触发**      | 到达空闲超时、请求次数上限，或任意一方主动关闭          | 空闲后发探测包，多次无响应或收到 RST 才关闭         |
| **对端在线时**    | 服务端仍可按配置主动回收空闲连接                        | 只要对端内核能回 ACK，连接通常继续维持              |
| **能否替代心跳**  | 不能判断业务是否健康，只能管理 HTTP 连接复用            | 不能判断应用线程池、事件循环、业务依赖是否正常      |
| **中间层影响**    | 代理、网关可独立管理前后两段 HTTP/TCP 连接              | NAT/LB/反向代理可能让你探测到的只是某一段 TCP 连接  |
| **HTTP/2/3 关系** | HTTP/2 禁用连接级头；HTTP/3/QUIC 不使用这套机制         | 只作用于 TCP；真正的 HTTP/3/QUIC 连接不受它直接影响 |

如果从“谁来决定关连接”的角度看，两个机制的态度完全相反：

HTTP Keep-Alive 是“主动回收”——服务器到了超时或请求次数上限，就可以按自己的配置关闭连接，不需要先探测对方是否在线。它是一种比较主动的资源回收方式。

TCP Keepalive 是“被动回收”——它必须先发探测包去问“你还在吗？”。只要对方在线、能回 ACK，服务器就只能继续维持连接，刷新定时器。只有确认对方已经不在了，才能释放资源。这是一种温和的回收策略。

实际项目中，两者经常同时在跑，各管各的。HTTP Keep-Alive 管的是“一条连接最多用多久、服务多少次请求”，TCP Keepalive 管的是“如果长时间没数据，检查一下对方是不是已经消失了”。两者互不干扰，也不能互相替代。


---

<!-- source: 计算机网络/TCP TIMEWAIT 详解-为什么要等、会不会出问题、能不能复用？.md -->

---
title: TCP TIME_WAIT 详解：为什么要等、会不会出问题、能不能复用？
description: 深入分析 TCP TIME_WAIT 状态的两个存在原因（最后 ACK 补救机会 + 防旧包混入新连接），大量 TIME_WAIT 的危害边界与粗略估算，tcp_tw_reuse 的正确使用姿势，以及 TIME_WAIT 与 CLOSE_WAIT 的区分与线上排查思路。
category: 计算机基础
tag:
  - 计算机网络
head:
  - - meta
    - name: keywords
      content: TCP,TIME_WAIT,CLOSE_WAIT,2MSL,tcp_tw_reuse,tcp_tw_recycle,四次挥手,端口耗尽,连接复用,MSL,PAWS
---

TCP 四次挥手的最后一步，主动关闭方发完 ACK 后不是立刻关闭，而是进入 `TIME_WAIT` 状态，默认要等上 60 秒。

这 60 秒经常被误解：有人觉得是浪费资源，有人想着用内核参数强行关掉，有人把 `CLOSE_WAIT` 和 `TIME_WAIT` 混着排查。

这篇文章回答线上最常见的几个问题：

1. `TIME_WAIT` 到底在等什么？
2. `TIME_WAIT` 大量堆积会不会真的出问题？
3. `tcp_tw_reuse` 能不能随便开？
4. `TIME_WAIT` 和 `CLOSE_WAIT` 怎么区分？

## TIME_WAIT 不只是“等一会儿再关”

ACK 都已经发出去了，为什么还要占着端口等几十秒？

主动关闭方发出最后一个 ACK 后，不会立刻释放连接，而是进入 `TIME_WAIT`。RFC 9293 的连接状态图里也能看到，`TIME_WAIT` 会在 2MSL 超时后删除 TCB，并进入 `CLOSED`。

这里要注意一个细节：不是“谁收到 FIN 谁就一定进入 TIME_WAIT”。被动关闭方收到 FIN 后，通常会先进入 `CLOSE_WAIT`，等待本端应用处理完剩余数据并调用 `close()` 或 `shutdown()`。更常见的情况是，主动关闭方收到对端最后的 FIN，并回复最后一个 ACK 后，进入 `TIME_WAIT`。

**谁主动关闭连接，谁就更容易进入 TIME_WAIT。** 比如客户端主动断开 HTTP 短连接，`TIME_WAIT` 往往出现在客户端；如果服务端主动断开连接，服务端也可能堆出大量 `TIME_WAIT`。

看起来像是多等了一会儿，实际上是在解决两个问题。

## 第一个原因：让最后一个 ACK 有补救机会

主动关闭方发送最后一个 ACK 后，如果这个 ACK 在网络中丢了，被动关闭方会以为自己的 FIN 没被确认，于是重发 FIN。主动关闭方还在 `TIME_WAIT` 里，就能再次回复 ACK；如果它已经进入 `CLOSED`，就可能回 RST，让对端感知为异常关闭或连接被重置。

```mermaid
sequenceDiagram
  participant A as 主动关闭方
  participant B as 被动关闭方

  B->>A: FIN
  A-->>B: ACK 丢失
  Note over A: A 进入 TIME_WAIT<br/>没有立刻释放连接
  B->>A: 重传 FIN
  A-->>B: 再次 ACK
  Note over B: B 收到 ACK 后进入 CLOSED
```

**MSL（Maximum Segment Lifetime）** 是报文段在网络中的最大生存时间。2MSL 不是一次请求-响应的最大 RTT，而是一个保守等待窗口：既给最后 ACK 丢失后的 FIN 重传留出处理机会，也尽量保证旧连接中的延迟报文从网络中消失。

需要注意，RFC 里的 MSL 是协议层概念，具体系统实现可能不同。Linux 常见实现中，`TIME_WAIT` 保留时间通常是 60 秒。还有一个常见误区：`tcp_fin_timeout` 控制的是 orphaned connection 的 `FIN_WAIT_2` 超时，不是 `TIME_WAIT`。想缓解 `TIME_WAIT` 带来的端口压力，优先看连接复用、端口范围、主动关闭方和 `tcp_tw_reuse` 条件，而不是试图用 `tcp_fin_timeout` 缩短 `TIME_WAIT`。

## 第二个原因：别让旧连接的包混进新连接

TCP 连接靠四元组定位：源 IP、源端口、目的 IP、目的端口。如果旧连接刚关闭，立刻用同一个四元组建立新连接，旧连接里延迟到达的数据包可能刚好落在新连接接收窗口里，被当成新连接的数据处理。

举个例子：

```text
旧连接：client:50000 -> server:443
服务端发出的 SEQ=301 数据包在网络里绕了一圈，迟迟没到。

旧连接关闭后，客户端很快复用了同一个源端口：
新连接：client:50000 -> server:443

这时旧的 SEQ=301 抵达客户端。
如果它刚好落在新连接接收窗口里，就有可能被误收。
```

TCP 序列号空间是 0 到 2^32 - 1，会按模 2^32 回绕，所以不能只靠序列号永久区分新老报文。实际系统还有时间戳、PAWS（Protection Against Wrapped Sequences）、随机 ISN 等保护，但它们不是“完全替代 TIME_WAIT”的万能方案。RFC 1337 也讨论过旧重复报文导致的 TIME_WAIT 风险。

## 大量 TIME_WAIT 到底有没有问题？

`TIME_WAIT` 本身是正常状态。真正的问题通常出现在主动关闭方短时间内创建大量到同一个目标 IP + 目标端口的连接，导致本地临时端口被占住。

Linux 本地临时端口范围可通过 `net.ipv4.ip_local_port_range` 查看和调整。上游内核文档里的默认范围是 `32768 60999`，实际环境以本机输出为准：

```bash
cat /proc/sys/net/ipv4/ip_local_port_range
```

如果客户端短时间内反复连接同一个目标 IP + 目标端口，旧连接又都停在 `TIME_WAIT`，本地可用临时端口可能被占满，导致新连接无法分配源端口，常见报错如：

```text
Cannot assign requested address
```

可以按这个思路判断：

- **如果服务端上看到很多 TIME_WAIT**：先看是不是服务端主动关闭了连接，比如服务端主动断开短连接、网关主动关闭上游连接、连接池主动淘汰连接。
- **如果客户端或网关上看到很多 TIME_WAIT**：重点看是否存在短连接风暴、连接池未复用、HTTP keep-alive 没打开、上游频繁断连。

还可以做一个粗略估算：

```text
同一目标 IP:Port 的短连接上限 ≈ 可用临时端口数 / TIME_WAIT 保留时间
```

比如默认端口范围 `32768~60999`，大约 2.8 万个端口。如果 `TIME_WAIT` 保留约 60 秒，那么同一目标 IP:Port 上持续新建短连接的上限大约是数百 QPS 量级。实际结果还会受到连接复用、端口保留、NAT、内核策略和不同远端四元组复用规则影响，不能只看 `TIME_WAIT` 总数就下结论。

## 为什么不建议随便开 tcp_tw_reuse？

`tcp_tw_reuse` 允许在协议认为安全的条件下，为新的主动连接复用 `TIME_WAIT` socket。它看起来像是缓解端口压力的捷径，但这类参数改变的是 TCP 对旧连接报文的等待策略，不能当成通用开关。

这里要分三层看：

1. **它依赖时间戳等条件判断“新报文是否足够新”**。时间戳可以过滤一部分旧报文，但不是所有异常都能覆盖。RFC 1337 重点讨论过 `TIME_WAIT` 状态被旧 RST 等报文提前终止的风险。旧数据段如果落入新连接可接受窗口，可能造成新旧数据混淆；旧 ACK 的影响则依赖序列号、窗口和实现细节，不宜和旧 RST 直接并列成同一种断连风险。
2. **当前上游 Linux 文档中，`tcp_tw_reuse` 可取 0/1/2，默认值为 2**，表示仅允许 loopback 流量复用；`1` 才是全局开启。但旧版内核文档、发行版 man page 或历史资料可能仍写作“默认关闭”，实际机器必须以 `sysctl net.ipv4.tcp_tw_reuse` 为准。内核文档也明确提示，不要在没有专家建议或明确需求时修改。
3. **不要把 `tcp_tw_reuse` 和已经废弃的 `tcp_tw_recycle` 搞混**。`tcp_tw_recycle` 在 NAT 环境下会导致时间戳冲突，大量连接被异常丢弃，Linux 4.12 之后已经被移除。网上很多老文章仍然会建议同时打开 `tcp_tw_reuse` 和 `tcp_tw_recycle`，这类配置不要照搬。

一句话：`tcp_tw_reuse` 可以讨论，但必须结合 Linux 版本、是否 loopback、是否经过 NAT、是否启用时间戳、是否真的存在端口耗尽来判断。能在应用层解决的，优先在应用层解决。

## TIME_WAIT 和 CLOSE_WAIT：一个正常等待，一个更像应用没收尾

排查连接状态时，`CLOSE_WAIT` 通常比 `TIME_WAIT` 更值得警惕。

收到对端 FIN 后，本端内核会回 ACK，然后进入 `CLOSE_WAIT`，等待应用处理完剩余数据并调用 `close()` 或 `shutdown()`。在 Java 服务里，`CLOSE_WAIT` 堆积经常和连接没有正确关闭有关。比如手写 Socket、HTTP 客户端响应体没有 close、异常分支提前 return、连接池连接没有归还，都可能让内核已经 ACK 了对端 FIN，但应用迟迟不调用 close。

可以先按这个思路判断：

- **TIME_WAIT**：主动关闭方在等 2MSL，通常是协议设计的一部分。
- **CLOSE_WAIT**：被动关闭方已经知道对端不发了，但本端应用还没关闭 socket。大量堆积时，优先怀疑应用代码没释放连接、线程卡住、连接池归还异常、读写流程没有走到 finally。

| 状态       | 常见出现方 | 含义                                | 排查方向                                          |
| ---------- | ---------- | ----------------------------------- | ------------------------------------------------- |
| TIME_WAIT  | 主动关闭方 | 等最后 ACK 重传机会，也等旧报文消失 | 短连接、连接池、keep-alive、端口范围              |
| CLOSE_WAIT | 被动关闭方 | 对端已关闭，本端应用还没 close      | 代码是否释放 socket、线程是否卡住、连接池是否泄漏 |

## 排查时别只盯着数量，要先看谁在主动关闭

![TIME_WAIT 与 CLOSE_WAIT 问题的排查流程](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-time-wait-close-wait-troubleshooting-flowchart.png)

看到大量 `TIME_WAIT` 或 `CLOSE_WAIT`，可以先用下面几条命令定位方向：

`ss` 是 Linux 上 `iproute2` 提供的命令，macOS 默认没有。如果你的开发环境是 macOS，可以用 `netstat` 和 `lsof` 替代。

```bash
# Linux：查看各 TCP 状态数量
ss -ant | awk 'NR>1 {cnt[$1]++} END {for (s in cnt) print s, cnt[s]}'

# macOS：查看各 TCP 状态数量
netstat -anp tcp | awk '$1 ~ /^tcp/ {cnt[$NF]++} END {for (s in cnt) print s, cnt[s]}'

# Linux：查看 TIME-WAIT 主要集中在哪些目标
ss -ant state time-wait | awk 'NR>1 {print $5}' | sort | uniq -c | sort -nr | head

# macOS：查看 TIME-WAIT 主要集中在哪些远端
netstat -anp tcp | awk '$1 ~ /^tcp/ && $NF=="TIME_WAIT" {print $(NF-1)}' | sort | uniq -c | sort -nr | head

# Linux：查看 CLOSE-WAIT 对应哪个进程（需要 sudo 才能看到进程信息）
sudo ss -tanp state close-wait

# macOS：查看 CLOSE-WAIT 对应哪个进程
sudo lsof -nP -iTCP -sTCP:CLOSE_WAIT

# Linux：查看监听 socket 的 accept queue 情况
ss -ltn
```

![macOS：查看各 TCP 状态数量和 TIME-WAIT 主要集中在哪些远端](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/macos-check-tcp-state-count-and-time-wait-remote-distribution.png)

命令背后的判断：

- **TIME_WAIT 集中在某个远端服务**：检查是否短连接太多、HTTP 连接复用没生效、连接池配置过小、连接池被频繁销毁，或者对端频繁主动断开。
- **CLOSE_WAIT 集中在某个本地进程**：优先查应用代码，尤其是异常分支有没有关闭响应体、socket 或连接对象。
- **LISTEN socket 的 Recv-Q 长时间接近 Send-Q**：重点排查 accept queue 堆积，看看应用 accept 是否及时、线程池是否卡住、backlog 配置是否过小。
- 如果是网关、代理、爬虫、压测客户端，`TIME_WAIT` 更常见；如果是 Java 服务端内部依赖调用泄漏，`CLOSE_WAIT` 更常见。

## 克制的优化建议

按优先级排查：

1. **优先减少不必要的短连接**：开启 HTTP keep-alive，复用连接池。
2. **确认谁在主动关闭连接**：服务端、客户端、网关、连接池都有可能成为主动关闭方。
3. **检查应用侧资源释放**：尤其是 HTTP 响应体、Socket、数据库连接、连接池连接归还。
4. **扩大本地端口范围**：在客户端短连接确实很高、且存在端口耗尽证据时，再考虑调整 `ip_local_port_range`。
5. **最后才看内核参数**：`tcp_tw_reuse`、`tcp_abort_on_overflow`、`tcp_syncookies` 都要结合 Linux 版本、业务连接模型、是否经过 NAT、是否被攻击、是否有真实观测数据来判断，不建议直接照抄网上配置。

`TIME_WAIT` 多，不一定是故障；`CLOSE_WAIT` 多，通常要先看代码。这两个状态看起来都像“连接没关干净”，但问题方向完全不同。

## 参考

- RFC 9293: Transmission Control Protocol（TCP）：<https://www.rfc-editor.org/rfc/rfc9293>
- RFC 1337: TIME-WAIT Assassination Hazards in TCP：<https://www.rfc-editor.org/rfc/rfc1337>
- Linux 内核 ip-sysctl 文档：<https://www.kernel.org/doc/Documentation/networking/ip-sysctl.txt>
- SoByte - 为什么 TCP 需要 TIME_WAIT 状态：<https://www.sobyte.net/post/2022-10/TCP TIMEWAIT 详解-为什么要等、会不会出问题、能不能复用？/>

<!-- @include: @article-footer.snippet.md -->


---

<!-- source: 计算机网络/TCP 和 UDP 可以使用同一个端口吗？.md -->

---
title: TCP 和 UDP 可以使用同一个端口吗？
description: 讲清 TCP 和 UDP 是否可以使用同一个端口，以及端口空间、绑定规则和常见例子。
category: 计算机基础
tag:
  - 计算机网络
head:
  - - meta
    - name: keywords
      content: TCP,UDP,端口,socket,bind,DNS 53,HTTP3,QUIC,UDP 443
---

面试里经常会碰到这个问题：一台机器上，TCP 已经监听了 `8080`，UDP 还能不能再监听 `8080`？

先说结论：**可以。TCP 和 UDP 的端口绑定命名空间按传输层协议区分，同一个数字端口在不同协议下不冲突。** 一个进程监听 `TCP/8080`，另一个进程监听 `UDP/8080`，内核会根据协议栈分别分发。

## 端口号到底归谁管？

端口是传输层用来区分应用进程的编号。IP 地址定位主机，端口号定位这台主机上的具体应用。

TCP 和 UDP 报文头里都有源端口和目的端口字段，字段长度都是 16 位（16 bits），所以端口号范围都是 `0~65535`。不过端口 `0` 在实际 API 里通常有特殊含义，比如让系统自动分配临时端口，不适合作为普通服务监听端口讲解。

**数字范围相同，不代表绑定对象相同**。服务注册、监听、抓包、防火墙和安全组规则里，通常都要把传输层协议和端口一起看，比如 `TCP/53`、`UDP/53`、`TCP/443`、`UDP/443`。

`TCP/443` 和 `UDP/443` 只是数字一样，协议栈处理路径不同。收到 IP 包后，内核会先看 IP 层的协议标识：IPv4 里是 Protocol 字段，IPv6 里对应 Next Header。TCP 的协议号是 `6`，UDP 是 `17`。在进入端口分发之前，内核已经根据协议号把报文交给对应的 TCP 或 UDP 协议栈。

![内核协议分发流程](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/can-tcp-and-udp-use-the-same-port-kernel-protocol-dispatching-process.png)

TCP 和 UDP 虽然都在传输层，但差异很大。下表从 8 个维度对比一下，方便建立整体认知：

| 特性         | TCP                                           | UDP                                 |
| ------------ | --------------------------------------------- | ----------------------------------- |
| **连接性**   | 面向连接（三次握手建连、四次挥手释放）        | 无连接，直接发                      |
| **可靠性**   | 可靠（序列号、ACK、重传、流量控制、拥塞控制） | 不可靠，尽最大努力交付              |
| **状态维护** | 有状态，维护连接信息                          | 无状态，发完就不管了                |
| **传输效率** | 较低（建连、确认、重传开销大）                | 较高（结构简单、开销小）            |
| **传输形式** | 面向字节流，不保留消息边界                    | 面向报文，天然保留消息边界          |
| **首部开销** | 20~60 字节                                    | 固定 8 字节                         |
| **通信模式** | 点对点（单播）                                | 单播、多播、广播都支持              |
| **常见应用** | HTTP/HTTPS、FTP、SMTP、SSH                    | DNS、DHCP、SNMP、TFTP、VoIP、视频流 |

正因为 TCP 和 UDP 是两套完全独立的传输层协议，内核才会在端口分发之前先把它们分开处理。

## socket 绑定时为什么不冲突？

服务端程序通常会先创建 socket，再通过 `bind()` 绑定本地 IP 和端口。一个 TCP socket 绑定 `8080`，另一个 UDP socket 也绑定 `8080`，通常可以同时存在。内核判断冲突时，不只看端口数字，还会看协议、本地地址等信息。

对于 TCP 来说，一条已建立连接通常可以用四元组标识：源 IP、源端口、目的 IP、目的端口。在防火墙、NAT、抓包和流量排查里，也常把传输层协议加进去，称为五元组：

```text
协议、源 IP、源端口、目的 IP、目的端口
```

两条通信的目的端口都可以是 `8080`，只要协议不同，内核就不会把它们当成同一条通信。UDP 没有 TCP 那种连接状态机，但收发数据时同样会带上源 IP、源端口、目的 IP、目的端口。

## 简单验证一下

可以用 `nc` 快速试一下。不过不同系统里的 `nc` 实现不完全一样，`-l`、`-u` 和端口参数写法可能有差异。以下是 OpenBSD netcat 常见写法，命令报错时可以先用 `nc -h` 看本机帮助。

先启动 TCP 监听：

```bash
nc -l 8000
```

再启动 UDP 监听：

```bash
nc -u -l 8000
```

两个命令可以同时存在。在 Linux 上可以再查看：

```bash
ss -tulnp | grep 8000
```

通常会看到一条 `tcp` 和一条 `udp` 监听，端口号一样，但协议不同。

如果想避开 `nc` 参数差异，也可以用代码验证：Java 里 `ServerSocket(8000)` 和 `DatagramSocket(8000)` 可以同时创建；Go 里 `net.Listen("tcp", ":8000")` 和 `net.ListenPacket("udp", ":8000")` 也可以同时存在。再用同一种协议重复监听一次，通常就会看到地址已被占用。

## 什么时候会冲突？

![端口什么情况下会冲突](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/when-does-tcp-conflict-occur.png)

TCP 和 UDP 之间不冲突，不代表端口可以随便重复绑定。

更常见的冲突发生在**同一个协议**里。比如一个进程已经绑定 `0.0.0.0:8080`，通常会覆盖本机所有 IPv4 地址上的 `8080`，另一个进程再绑定某个具体 IPv4 地址的 `TCP/8080` 往往会冲突；但最终行为还会受绑定顺序、`SO_REUSEADDR`、`SO_REUSEPORT` 和操作系统实现影响。

如果两个进程绑定的是不同本地 IP，同协议同端口也可能成立，例如 `192.168.1.10:8080` 和 `192.168.1.11:8080` 都是 TCP。

还有一个容易被忽略的点：IPv6 的通配地址 `[::]:8080` 在一些环境下可能同时接收 IPv6 和 IPv4-mapped 地址，`IPV6_V6ONLY` 会影响它是否和 IPv4 socket 冲突。排查时可以用 `ss -tulnp` 同时看 `0.0.0.0:端口` 和 `[::]:端口`。

`SO_REUSEADDR`、`SO_REUSEPORT` 也会改变绑定规则，常用于快速重启、多进程监听、负载分摊等场景。这里小 G 建议先记住：

**TCP 和 UDP 分别监听同一个数字端口，靠的是协议不同，不需要 `SO_REUSEPORT`。`SO_REUSEADDR` / `SO_REUSEPORT` 主要影响同一协议下的地址端口复用、快速重启和多进程监听，但是否允许、如何分流，要看操作系统和具体 socket 类型。**

## 分享两个实际案例

### DNS 为什么同时用 TCP/UDP 53？

![DNS 和 HTTP/3 同时使用 TCP 与 UDP 端口的实际案例](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/can-tcp-and-udp-use-the-same-port-practical-application-example.png)

DNS 是最经典的例子。IANA 注册表里，`domain` 服务同时注册了 `TCP/53` 和 `UDP/53`，实际 DNS 服务也经常同时监听这两个端口。

日常域名查询通常走 UDP，因为查询和响应比较小，UDP 不需要建连，速度快。但以下几种情况会切换到 TCP：UDP 响应被截断（DNS 报文头 `TC` 标志位置 1，常见于响应超过 UDP 长度限制时）、区域传送（Zone Transfer，需要可靠传输保证数据完整性）、或者 DNSSEC 响应过大。这里不是“`UDP/53` 被占了，所以 `TCP/53` 不能用”，而是 DNS 本来就可以同时使用两套协议的 `53`。

### HTTPS 和 HTTP/3 的 443 也是这个道理

传统 HTTPS 通常是 HTTP/1.1 或 HTTP/2 over TLS over TCP，默认使用 `TCP/443`。HTTP/3 跑在 QUIC 上，而 QUIC 基于 UDP。浏览器通常会通过 `Alt-Svc` 或 `HTTPS` DNS 记录获知服务端支持 HTTP/3，然后尝试建立 QUIC 连接；常见部署是同时开放 `TCP/443` 和 `UDP/443`。

![HTTP/3 协议栈实现](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/http-3-implementation.png)

这不会和原来的 `TCP/443` 冲突。一个服务器完全可以同时提供：

```text
HTTPS（HTTP/1.1、HTTP/2） -> TCP/443
HTTP/3                  -> UDP/443
```

从外部看都是 `443`，从协议栈看是两条路。

生产环境里也要注意：只放行 `TCP/443` 时，HTTP/1.1 和 HTTP/2 可能都正常，但 HTTP/3 不会生效。云安全组、负载均衡、Nginx / 网关和主机防火墙都要分别检查 `TCP/443` 和 `UDP/443`，再用 `curl --http3` 或浏览器开发者工具确认协议是否真的切到 HTTP/3。

## 面试怎么回答？

TCP 和 UDP 可以使用同一个数字端口，因为它们是不同的传输层协议；内核会先按 IP 协议号分发到 TCP 栈或 UDP 栈，再在各自协议栈内按地址和端口找 socket，所以 `TCP/8080` 和 `UDP/8080` 可以共存。

真正容易冲突的是同协议下的绑定，比如两个 TCP 服务通常不能同时监听同一个本地 IP 和端口；这时才会涉及 `SO_REUSEADDR`、`SO_REUSEPORT` 这类 socket 复用选项。例子记两个就够了：DNS 同时使用 `UDP/53` 和 `TCP/53`；HTTP/3 常见部署是 `UDP/443`，可以和传统 HTTPS 的 `TCP/443` 同时存在。


---

<!-- source: 计算机网络/TCP 如何保证可靠传输？重传、滑动窗口与拥塞控制详解.md -->

---
title: TCP 如何保证可靠传输？重传、滑动窗口与拥塞控制详解
description: 系统梳理 TCP 的可靠性保障机制，覆盖重传/选择确认、流量与拥塞控制，明确端到端可靠传输的实现要点。
category: 计算机基础
tag:
  - 计算机网络
head:
  - - meta
    - name: keywords
      content: TCP,可靠性,重传,SACK,D-SACK,流量控制,拥塞控制,滑动窗口,校验和,CUBIC,BBR
---

TCP 常被说成可靠传输协议，但“可靠”不是一句抽象承诺，而是一组具体机制共同配合出来的结果。

丢包要重传，乱序要重排，接收方处理不过来要流量控制，网络拥塞时要主动降速。把这些机制串起来，才能真正理解 TCP 为什么能在不可靠的 IP 网络之上提供可靠传输。

这篇文章主要回答几个问题：

1. TCP 通过哪些机制保证数据可靠到达？
2. 超时重传、快速重传、SACK、D-SACK 分别解决什么问题？
3. TCP 如何通过滑动窗口实现流量控制？
4. 拥塞控制中的慢开始、拥塞避免、快速重传、快恢复分别怎么理解？

先澄清一个容易误解的点：TCP 可靠的是**字节流**，不是应用层的一条条“消息”。TCP 不会保留 HTTP、RPC 或业务协议里的消息边界，它做的是给字节流编号，并尽量把这些字节按序、无重复地交付给应用层。至于“一个请求从哪里开始、到哪里结束”，要靠上层协议自己定义，比如长度字段、分隔符、HTTP 报文格式等。

![TCP 粘包 / 拆包为什么会出现？](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-udp-byte-stream-tcp-sticky-split-causes.png)

## TCP 如何保证传输的可靠性？

1. **基于数据块传输**：应用数据被分割成 TCP 认为最适合发送的数据块，再传输给网络层，数据块被称为报文段或段。
2. **对失序数据重新排序以及去重**：TCP 不能阻止网络丢包，它能做的是给字节流编号，并通过 ACK、重传、排序、去重等机制，让应用层看到的是有序、无重复的数据流。TCP 的序列号本质上是字节序号，不是按报文段逐个编号。一个 TCP 段携带一段连续字节，接收端根据这些序号区间完成重排和去重。
3. **校验和**：TCP 会对 TCP 首部、数据以及 IP 伪首部计算校验和。这是一个端到端的校验和，目的是检测数据在传输过程中的变化。如果收到的报文段校验和有差错，TCP 会丢弃这个报文段，并且不会确认收到它。不过，TCP 校验和只是 16 位的一补和校验，主要用于发现常见的传输错误，并不是强完整性校验，也不能防止恶意篡改。实际系统里的数据完整性通常还会依赖链路层 CRC、TLS AEAD 或应用层 hash 等机制。
4. **重传机制**：在 TCP 段丢失或延迟的情况下，重新发送数据，直到收到对方的确认应答（ACK）。TCP 重传机制主要有：基于计时器的重传（也就是超时重传）、快速重传（基于接收端的反馈信息来引发重传）、SACK（选择确认，在 ACK 选项中携带已经收到的非连续数据块范围，这样发送方就知道哪些数据段已经到达接收方了）、D-SACK（重复 SACK，在 SACK 的基础上，额外告知发送方有哪些数据段被重复接收）。D-SACK 的价值在于帮助发送方判断一次重传是否可能是“误重传”：比如原始数据其实已经到达接收方，只是 ACK 丢失、网络乱序或重传定时器过早触发，导致发送方误以为丢包并触发重传。接收方通过 D-SACK 告诉发送方“这段数据我重复收到了”，发送方就能推断这次重传可能只是误判，而不一定是真正发生了拥塞。不过，D-SACK 只能提供线索，不能单独证明某一种具体原因。
5. **流量控制**：TCP 连接的每一方都有一定大小的缓冲空间。接收端通过接收窗口（rwnd）告诉发送端自己还能接收多少数据，发送端据此控制发送速率，避免接收端处理不过来而丢包。
6. **拥塞控制**：当网络拥塞时，减少数据的发送。TCP 在发送数据的时候，需要考虑两个因素：一是接收端当前可用接收缓冲区能力，二是网络的拥塞程度。接收方的接收能力由接收窗口（rwnd）表示，网络的拥塞程度由拥塞窗口（cwnd）表示。发送方允许保持在网络中的未确认数据量，通常受 `min(rwnd, cwnd)` 约束，这样既不会超过接收方的处理能力，也不会给网络注入过多数据。

## 先用 ARQ 理解 TCP 重传

上面几个机制里，最能体现“可靠传输”的是重传。为了不让超时重传、快速重传、SACK 这些概念显得凭空出现，我们先看 ARQ 这个抽象模型。

**自动重传请求**（Automatic Repeat-reQuest，ARQ）是 OSI 模型中数据链路层和传输层的错误纠正协议之一。它通过使用确认和超时这两个机制，在不可靠服务的基础上实现可靠的信息传输。如果发送方在发送后一段时间之内没有收到确认应答（Acknowledgments，ACK），它通常会重新发送，直到收到确认或者重试超过一定的次数。

TCP 可以用 ARQ 思想来理解，但它不是教材里的某一种简单 ARQ。现代 TCP 同时结合了累积 ACK、RTO、快速重传、SACK、拥塞控制和流量控制，重传策略会受到这些机制共同影响。

- 默认 ACK 是**累积确认**：ACK 表示“这个序号之前的数据我都已经收到了”。
- 开启 SACK 后，接收方还能额外告诉发送方“我已经乱序收到了哪些区间”，发送方可以只重传缺失的数据段。

因此，停止等待 ARQ 和 Go-Back-N 更适合理解可靠传输的基础思想，而现代 TCP 在 SACK 的帮助下更接近选择重传。

![ARQ 与 TCP 重传机制的关系](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-reliability-guarantee-arq-retransmission-model.png)

ARQ 包括停止等待 ARQ 协议和连续 ARQ 协议。

### 停止等待 ARQ 协议

停止等待协议是为了实现可靠传输的，它的基本原理就是每发完一个分组就停止发送，等待对方确认（回复 ACK）。如果过了一段时间（超时时间后），还是没有收到 ACK 确认，说明没有发送成功，需要重新发送，直到收到确认后再发下一个分组。

在停止等待协议中，若接收方收到重复分组，就丢弃该分组，但同时还要发送确认。

**1）无差错情况：**

发送方发送分组，接收方在规定时间内收到，并且回复确认。发送方再次发送。

**2）出现差错情况（超时重传）：**

停止等待协议中超时重传是指只要超过一段时间仍然没有收到确认，就重传前面发送过的分组（认为刚才发送过的分组丢失了）。因此每发送完一个分组需要设置一个超时计时器，其重传时间应比数据在分组传输的平均往返时间更长一些。这种自动重传方式常称为**自动重传请求（ARQ）**。另外在停止等待协议中若收到重复分组，就丢弃该分组，但同时还要发送确认。

**3）确认丢失和确认迟到**

- **确认丢失**：确认消息在传输过程丢失。当 A 发送 M1 消息，B 收到后，B 向 A 发送了一个 M1 确认消息，但却在传输过程中丢失。而 A 并不知道，在超时计时过后，A 重传 M1 消息，B 再次收到该消息后采取以下两点措施：1. 丢弃这个重复的 M1 消息，不向上层交付。2. 向 A 发送确认消息。（不会认为已经发送过了，就不再发送。A 能重传，就证明 B 的确认消息丢失）。
- **确认迟到**：确认消息在传输过程中迟到。A 发送 M1 消息，B 收到并发送确认。在超时时间内没有收到确认消息，A 重传 M1 消息，B 仍然收到并继续发送确认消息（B 收到了 2 份 M1）。此时 A 收到了 B 第二次发送的确认消息。接着发送其他数据。过了一会，A 收到了 B 第一次发送的对 M1 的确认消息（A 也收到了 2 份确认消息）。处理如下：1. A 收到重复的确认后，直接丢弃。2. B 收到重复的 M1 后，也直接丢弃重复的 M1。

### 连续 ARQ 协议

连续 ARQ 是一类滑动窗口式重传思想，典型形式包括 Go-Back-N 和选择重传。它可以提高信道利用率：发送方维持一个发送窗口，凡位于发送窗口内的分组可以连续发送出去，而不需要等待对方确认。接收方一般采用累计确认，对按序到达的最后一个分组发送确认，表明到这个分组为止的所有分组都已经正确收到了。

- **优点**：信道利用率高，容易实现，即使确认丢失，也不必重传。
- **缺点**：如果采用 Go-Back-N，不能向发送方反映出接收方已经正确收到的所有分组的信息。比如：发送方发送了 5 条消息，中间第三条丢失（3 号）。在 Go-Back-N 中，即使 4、5 号分组已经到达，接收方也会因为它们失序而丢弃，只重复确认最后一个按序收到的 2 号分组。发送方最终需要从 3 号开始回退重传。SACK 的作用，正是让 TCP 接收方能告诉发送方这些非连续但已经收到的数据区间，避免大量不必要的回退重传。

有了 ARQ 这条线，再看 TCP 的具体重传机制就顺了。

## TCP 重传机制速查

TCP 的重传不是只有一种触发方式。最基础的是**超时重传**：发送方等 ACK 等太久，就认为这段数据可能丢了，于是重传。后来又有**快速重传**：接收方连续 ACK 同一个旧序号，说明中间可能缺了一段，发送方就不用傻等超时。SACK 和 D-SACK 则是在 ACK 里带更多信息，让发送方知道“哪些段已经到了、哪些重传可能是误判”。

所以下面这张表不是新知识点，而是一张地图：先把几种重传相关机制摆在一起，后面再从最基础、也最兜底的 **RTO 超时重传** 开始展开。

| 机制            | 触发条件                                               | 解决什么问题                                 |
| --------------- | ------------------------------------------------------ | -------------------------------------------- |
| 超时重传（RTO） | 超过 RTO 仍未收到 ACK                                  | 兜底处理丢包                                 |
| 快速重传        | 收到 3 个 duplicate ACK，即连续确认同一个旧累计 ACK 号 | 不等超时，尽快重传疑似丢失的数据段           |
| SACK            | ACK 中携带已收到的数据区间                             | 告诉发送方哪些段已收到，只重传真正缺失的部分 |
| D-SACK          | SACK 中报告重复收到的数据段                            | 帮助识别误重传、ACK 丢失或网络乱序           |

## 超时重传如何实现？超时重传时间怎么确定？

先看表里的第一行：**超时重传（RTO）**。它是 TCP 重传机制的兜底方案。无论有没有 SACK、有没有触发快速重传，只要某段数据发出去以后迟迟没有等到 ACK，最终都要靠 RTO 来判断“不能再等了，该重传了”。

当发送方发送数据之后，它会启动一个定时器，等待目的端确认收到这个报文段。接收端对已成功收到的 TCP 段发回相应的 ACK。如果发送端在合理的往返时延（RTT）内未收到确认，那么对应的数据段就会被认为可能已经丢失，并进行重传。

- **RTT（Round Trip Time）**：往返时间，也就是 TCP 段从发出去到收到对应 ACK 的时间。
- **RTO（Retransmission Time Out）**：重传超时时间，即从数据发送时刻算起，超过这个时间便执行重传。

![RTO 超时时间的计算流程](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-reliability-guarantee-rto-calculation-flow.png)

RTO 的确定是一个关键问题，因为它直接影响到 TCP 的性能和效率。如果 RTO 设置得太小，会导致不必要的重传，增加网络负担；如果 RTO 设置得太大，会导致数据传输的延迟，降低吞吐量。因此，RTO 应该根据网络的实际状况，动态地进行调整。

RTT 的值会随着网络的波动而变化，所以 TCP 不能直接使用某一次 RTT 样本作为 RTO。现代 TCP 的 RTO 计算应以 RFC 6298 为主线：根据 RTT 样本维护平滑后的往返时间 SRTT 和往返时间波动 RTTVAR，再计算 RTO；发生超时后还会做指数退避。

Karn 算法的核心点是：对已经重传过的报文段，其 ACK 不用于 RTT 采样，避免“这个 ACK 到底对应原始发送还是重传”的样本歧义。

简单理解就是：RTO 不是 RTT，而是“平滑 RTT + 抖动余量”。如果一条连接的 RTT 样本大约是 100 ms，但抖动很大，RTO 就必须留出更大的安全余量；如果仍然超时，下一次 RTO 还会继续退避，避免在拥塞时把重传压力继续打到网络里。

## 快速重传是如何工作的？

超时重传可靠但偏慢，因为发送方必须等到 RTO 过期以后才会重传。快速重传（Fast Retransmit）解决的就是这个等待问题：它不依赖计时器，而是依赖接收方连续发回的重复 ACK 来更早发现疑似丢包。

TCP 使用累积确认。假设接收方已经按序收到了 `[0, 1000)` 这段字节，接下来期望收到从 1000 开始的数据。如果它先收到了 `[2000, 3000)`，说明中间 `[1000, 2000)` 这段还没到。接收方不会把 ACK 推进到 3000，而是继续回复 ACK = 1000，表示“我仍然在等 1000 之后的数据”。这种再次确认同一个旧 ACK 号的报文，就是 duplicate ACK。

发送方如果连续收到 3 个 duplicate ACK，通常会认为 ACK 指向的那段数据大概率已经丢失，于是不等 RTO 超时，直接重传缺失的数据段。之所以不是收到 1 个 duplicate ACK 就重传，是因为网络里可能出现短暂乱序：后发出的包先到，不一定代表前面的包真的丢了。3 个 duplicate ACK 是在“尽快恢复”和“避免误判乱序”之间做的折中。

快速重传只能更快定位“最早的缺口”。如果一个发送窗口里同时丢了多段数据，仅靠累积 ACK 仍然很难告诉发送方哪些区间已经到了、哪些区间还缺着，这就需要 SACK。

## SACK 是如何提升重传效率的？

SACK（Selective Acknowledgment，选择性确认）用来补足累积 ACK 的信息盲区。普通 ACK 只能表达“某个序号之前的数据都收到了”，但无法表达“后面的某些区间虽然乱序，也已经收到了”。SACK 会在 ACK 的 TCP 选项里携带已经收到的非连续字节区间，帮助发送方只重传真正缺失的部分。

SACK 需要在三次握手时通过 SACK-Permitted 选项协商。启用后，ACK 号本身仍然遵循累积确认规则，SACK 选项额外携带一个或多个 SACK block。每个 SACK block 由 Left Edge 和 Right Edge 组成，表示接收方已经收到的字节区间 `[Left Edge, Right Edge)`。

举个例子：发送方连续发送 `[0, 1000)`、`[1000, 2000)`、`[2000, 3000)`、`[3000, 4000)`，其中 `[1000, 2000)` 丢失，但后面两段已经到达。接收方的累计 ACK 仍然只能停在 ACK = 1000，但它可以在 SACK 里报告已经收到 `[2000, 4000)`。发送方据此就知道 `[1000, 2000)` 需要重传，而 `[2000, 4000)` 不必重复发送。

TCP 选项长度有限。SACK 选项本身需要 2 字节，每个 SACK block 需要 8 字节，所以一个 TCP 段最多能携带 4 个 SACK block；如果同时携带时间戳等其他 TCP 选项，可用空间还会更少。也就是说，SACK 不能无限记录所有乱序区间，但它已经足以显著减少多段丢包时的无效重传。

## D-SACK 有什么作用？

D-SACK（Duplicate SACK，重复选择性确认）是对 SACK 的扩展，定义在 RFC 2883 中。SACK 主要告诉发送方“哪些非连续区间已经收到”，D-SACK 则进一步告诉发送方“哪些区间被重复收到了”。

D-SACK 不引入新的 TCP 选项，而是复用 SACK block。它约定：如果第一个 SACK block 描述的是一段已经被累计 ACK 覆盖的数据，或者描述的是一段已经出现在后续 SACK block 中的数据，那么这个 block 就是在报告重复数据。

为什么重复数据有价值？因为一次重传不一定代表原始数据真的丢了。常见情况包括：

- 原始数据已经到达接收方，但 ACK 在返回途中丢失，发送方等到 RTO 后误以为数据丢了，于是重传。
- 原始数据在网络中严重乱序或延迟，发送方先触发了快速重传，随后原始数据和重传数据都到达接收方。

收到 D-SACK 后，发送方可以推断这次重传可能是误重传，并进一步判断网络中是否存在 ACK 丢失、严重乱序或 RTO 设置过小等问题。它不能单独证明某一种具体原因，但能为拥塞控制和排查重传异常提供重要线索。

## TCP 如何实现流量控制？

**TCP 利用滑动窗口实现流量控制。流量控制是为了控制发送方发送速率，保证接收方来得及接收。** 滑动窗口是 TCP 的核心机制之一，它既用于追踪“哪些数据已经发送但还没被 ACK”，也用于承载流量控制。接收方会在 ACK 报文中通过窗口字段通告自己的接收窗口（rwnd），发送方据此调整发送窗口。将窗口字段设置为 0，就表示接收方暂时没有可用缓冲区，发送方不能继续发送普通新数据。

TCP 首部里的窗口字段本身是 16 位，最大只能表示 65,535 字节。如果需要更大的接收窗口，还要依赖 TCP Window Scale 选项对窗口大小进行扩展。实际排查时，可以在三次握手的 SYN/SYN-ACK 报文里看到双方是否协商了 Window Scale。

**零窗口怎么恢复？** 当接收方通告 `rwnd = 0` 时，发送方会暂停发送新数据。但如果接收方后来腾出了缓冲区，并发送了新的窗口通告，而这个 ACK 在网络中丢失，双方就可能陷入互相等待：发送方等窗口打开，接收方等新数据到来。

![TCP 零窗口探测机制](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-reliability-guarantee-zero-window-probe.png)

为了解决这个问题，TCP 引入了**零窗口探测（Zero Window Probe）**。发送方在窗口为 0 时，依赖持续计时器（persist timer）定期发送很小的探测报文，迫使接收方回复当前窗口大小。这样即使之前的窗口更新 ACK 丢失，发送方也能重新得知窗口是否已经打开。

零窗口探测只负责打破“窗口更新 ACK 丢失”造成的僵持，不等于业务层连接健康检查。如果接收端应用长期不读取 socket，连接可能长期停留在小窗口或零窗口状态，仍然会占用双方资源。实际工程中通常还需要应用层读写超时、空闲连接回收等机制兜底。

**为什么需要流量控制？** 这是因为双方在通信的时候，发送方的速率与接收方的速率不一定相等。如果发送方的发送速率太快，会导致接收方处理不过来。如果接收方处理不过来，就只能把数据先放到 **接收缓冲区（receive buffer）** 里（失序的数据段也会被存放在缓冲区里）。正常情况下，接收方会通过缩小 `rwnd`，甚至通告零窗口，让发送方停止发送新数据。只有在窗口控制来不及生效、对端实现异常、缓冲耗尽或网络队列溢出时，才可能出现丢弃。因此，我们需要控制发送方的发送速率，让接收方与发送方处于一种动态平衡。

这里需要注意的是（常见误区）：

- 发送端不等同于客户端
- 接收端不等同于服务端

TCP 为全双工（Full-Duplex，FDX）通信，双方可以进行双向通信，客户端和服务端既可能是发送端，也可能是接收端。因此，两端各有一个发送缓冲区与接收缓冲区，两端都各自维护一个发送窗口和一个接收窗口。接收窗口大小取决于应用、系统、硬件的限制（TCP 传输速率不能大于应用的数据处理速率）。通信双方维护窗口的逻辑是类似的。

**TCP 发送窗口可以划分成四个部分**：

1. 已经发送并且确认的 TCP 段（已经发送并确认）；
2. 已经发送但是没有确认的 TCP 段（已经发送未确认）；
3. 未发送但是接收方准备接收的 TCP 段（可以发送）；
4. 未发送并且接收方也暂时不能接收的 TCP 段（不可发送）。

**TCP 发送窗口结构图示**：

![TCP发送窗口结构](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-send-window.png)

- **SND.WND**：发送窗口。
- **SND.UNA**：Send Unacknowledged，表示最早尚未被确认的序号，也就是发送窗口左边界。
- **SND.NXT**：Send Next 指针，指向可用窗口的第一个字节。

只看接收窗口约束时，**可用发送窗口大小** 约为 `SND.UNA + SND.WND - SND.NXT`。真实发送还要再受 `cwnd`、MSS、发送缓冲区等限制。

**TCP 接收窗口可以划分成三个部分**：

1. 已经接收并且已经确认的 TCP 段（已经接收并确认）；
2. 等待接收且允许发送方发送 TCP 段（可以接收未确认）；
3. 不可接收且不允许发送方发送 TCP 段（不可接收）。

**TCP 接收窗口结构图示**：

![TCP接收窗口结构](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-receive-window.png)

**接收窗口的大小是动态调整的。** 它通常会受应用读取速度、接收缓冲区占用、系统 socket buffer 配置和自动调优策略影响。

另外，这里的滑动窗口大小只是为了演示使用，实际窗口大小通常会远远大于这个值。

**糊涂窗口综合征（Silly Window Syndrome，SWS）** 指的是发送方或接收方不断以很小的粒度发送数据、通告窗口，导致网络中充满“头部很大、载荷很小”的小包，传输效率很差。

![SWS、Nagle 算法与延迟 ACK 的关系](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-reliability-guarantee-sws-nagle-delayed-ack.png)

常见优化有几类：

- **接收方侧 SWS 避免**：不要每释放一点点缓冲区就立刻通告新窗口，而是等到可用空间达到一定阈值后再更新窗口。
- **发送方侧 Nagle 算法**：如果还有未确认的小包在网络中，新的小数据先缓存起来，等收到 ACK 或凑够 MSS 后再发送。
- **延迟 ACK**：接收方不一定每收到一个段就马上 ACK，可以稍等一小段时间，看能否和反向数据一起发送，或对多个段合并确认。它本身是 ACK 生成策略，不是专门为 SWS 设计的机制，但会和小包发送策略发生交互。

需要注意，Nagle 算法和延迟 ACK 在某些小包交互场景下可能相互等待，带来几十毫秒级的额外延迟。对延迟敏感的交互式应用，常见做法是通过 `TCP_NODELAY` 关闭 Nagle。代价是小包数量可能增加，包头开销和系统中断压力也会升高。批量响应或文件发送更适合聚合写入；在 Linux 上还可以结合 `TCP_CORK` 这类平台相关选项控制“攒包”时机。

## TCP 的拥塞控制是怎么实现的？

在某段时间，若对网络中某一资源的需求超过了该资源所能提供的可用部分，网络性能就会下降，表现为排队变长、延迟升高、丢包增加。这种情况就叫拥塞。拥塞控制就是为了防止过多的数据注入到网络中，这样就可以使网络中的路由器或链路不致过载。拥塞控制所要做的都有一个前提，就是网络能够承受现有的网络负荷。拥塞控制是一个全局性的过程，涉及到所有的主机、路由器，以及与降低网络传输性能有关的所有因素。相反，流量控制往往是点对点通信量的控制，是个端到端的问题。流量控制所要做到的就是抑制发送端发送数据的速率，以便使接收端来得及接收。

![TCP的拥塞控制](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-congestion-control.png)

为了进行拥塞控制，TCP 发送方要维持一个 **拥塞窗口（cwnd）** 的状态变量。拥塞窗口的大小取决于网络的拥塞程度，并且动态变化。发送方让自己的发送窗口取为拥塞窗口和接收方的接收窗口中较小的一个。

按 RFC 5681 / Reno 系的基础框架，TCP 拥塞控制常拆成四个机制来讲，即 **慢开始**、**拥塞避免**、**快速重传（Fast Retransmit）** 和 **快恢复**。现代系统里的 CUBIC、BBR、DCTCP 会在这个基础上有不同实现和状态机。在网络层也可以使路由器采用适当的分组丢弃策略（如主动队列管理 AQM），以减少网络拥塞的发生。

- **慢开始**：慢开始算法的思路是当主机开始发送数据时，如果立即把大量数据字节注入到网络，可能会引起网络阻塞，因为现在还不知道网络的负荷情况。较好的方法是先探测一下，即由小到大逐渐增大发送窗口，也就是由小到大逐渐增大拥塞窗口。慢开始并不意味着一开始只能发送 1 个 MSS。RFC 6928 提议并实验性允许把初始窗口从 2～4 个段提高到最多 10 个段（IW10），很多现代实现采用了类似 IW10 的默认值，但仍要以具体系统配置为准。以常见 MSS 1460 字节计算，10 个 MSS 在首个 RTT 内大约可以发送 14 KB 数据，这对 HTTP 短连接和页面首屏加载很重要。慢开始阶段的关键是：根据 ACK 反馈快速增大窗口，通常表现为每经过一个 RTT，`cwnd` 近似翻倍。
- **拥塞避免**：拥塞避免算法的思路是让拥塞窗口 `cwnd` 缓慢增大。简化理解是每个 RTT 大约增加 1 个 MSS；实现上通常通过每个 ACK 小幅增加 `cwnd` 来近似线性增长。慢开始会在 `cwnd` 达到慢开始门限（ssthresh）后进入拥塞避免。`ssthresh` 初始值通常设得比较大，第一次有效调整往往发生在检测到丢包之后。
- **快速重传**：发送方收到 3 个 duplicate ACK，也就是连续 3 个 ACK 都在确认同一个旧的累计确认号时，通常认为后面某个段丢失，于是不等 RTO 超时就重传缺失的数据段。
- **快恢复**：下面是 Reno 语境下的经典快恢复流程。收到第 3 个 duplicate ACK 时，将 `ssthresh` 设置为当前拥塞窗口的一半；重传丢失的数据段，并将 `cwnd` 设置为 `ssthresh + 3 × MSS`；后续每多收到一个 duplicate ACK，`cwnd` 再增加 1 个 MSS；当收到新的 ACK，说明重传的数据已经被确认，将 `cwnd` 降回 `ssthresh`，进入拥塞避免阶段。快恢复不直接回到慢开始，是因为重复 ACK 说明后续数据仍然能到达接收方，网络并没有完全不可用。现代 TCP 如果启用了 SACK、NewReno、CUBIC 或 RACK/TLP，丢包恢复过程会更复杂，但理解 Reno 仍然是入门基础。

快速重传对单个报文段丢失很有效，但如果一个窗口内有多个报文段同时丢失，仅靠重复 ACK 很难一次性告诉发送方所有“洞”在哪里。这也是 SACK 出现的重要原因：接收方可以显式告诉发送方哪些数据段已经收到，发送方只重传缺失的部分。

需要注意的是，上面讲的慢开始、拥塞避免、快速重传、快恢复，是理解 TCP 拥塞控制的经典基础框架。现代操作系统通常还会在此基础上使用更复杂的拥塞控制算法：

- **CUBIC**：已经由 RFC 9438 更新为标准轨 TCP 拥塞控制算法，并取代旧版 CUBIC 规范。CUBIC 用三次函数调整拥塞窗口，在高带宽、长 RTT 链路上比 Reno 的线性增长更友好，目前已被 Linux、Windows、Apple 等主流协议栈采用为默认拥塞控制算法之一。
- **BBR**：Google 提出的基于模型（model-based）的拥塞控制算法，通过估计瓶颈带宽和最小 RTT 来控制发送速率，目标是高吞吐和低排队延迟。在 bufferbloat 明显的链路上可能表现更好。但 BBR 的具体效果受版本、队列管理、竞争流类型、RTT 公平性和部署环境影响，不能简单理解成“无脑替代 CUBIC”。
- **DCTCP**：主要用于受控数据中心网络，依赖 ECN 标记估算拥塞程度，目标是在浅缓冲交换机场景下降低排队延迟。它不适合直接拿到公网环境里泛用。

不过，慢开始、拥塞避免、快速重传、快恢复依然是理解这些现代算法的基础。

还有一个工程上很重要的边界：丢包不一定等于拥塞。传统 Reno/CUBIC 主要把丢包视为拥塞信号，但无线链路误码、路径切换、设备队列溢出也可能导致丢包；ECN 则可以在不丢包的情况下反馈拥塞。对比拥塞算法时，也不要只看平均吞吐量，还要看 P95/P99 RTT、丢包率、重传率、队列长度、与 CUBIC/Reno 共存表现，以及具体内核版本和参数配置。

## 总结

TCP 的可靠性不是“保证网络不丢包”，而是在不可靠的 IP 网络之上，通过一组机制让应用层看到的是**有序、无重复、尽量完整的字节流**。它的核心可以概括为四点：

1. **用序列号和 ACK 确认数据状态**：TCP 给字节流编号，接收方通过 ACK 告诉发送方哪些数据已经收到，发送方据此判断哪些数据还在路上、哪些数据需要继续等待。
2. **用重传机制补齐丢失数据**：超时重传负责兜底，快速重传用于更快发现单段丢失，SACK/D-SACK 则让发送方更精确地知道哪些数据已经到达、哪些重传可能是误判。
3. **用滑动窗口做流量控制**：接收方通过 `rwnd` 告诉发送方自己还能接收多少数据，发送方根据接收窗口控制在途数据量，避免把接收缓冲区打爆。
4. **用拥塞控制保护网络**：发送方通过 `cwnd` 估计网络承载能力，在慢开始、拥塞避免、快速重传、快恢复以及 CUBIC、BBR 等算法的配合下，尽量避免把过多数据注入网络。

一句话总结：TCP 不是让网络变得可靠，而是通过**编号、确认、重传、排序去重、流量控制和拥塞控制**，在不可靠网络之上“拼”出一个对应用层相对可靠的字节流通道。

## 参考

1. 《计算机网络（第 7 版）》
2. 《图解 HTTP》
3. TCP and UDP Tutorial：<https://www.9tut.com/tcp-and-udp-tutorial>
4. Computer Network：<https://github.com/wolverinn/Waking-Up/blob/master/Computer%20Network.md>
5. TCP Flow Control：<https://www.brianstorti.com/tcp-flow-control/>
6. TCP 流量控制（Flow Control）：<https://notfalse.net/24/tcp-flow-control>
7. TCP 之滑动窗口原理：<https://cloud.tencent.com/developer/article/1857363>
8. RFC 9293 - Transmission Control Protocol：<https://www.rfc-editor.org/rfc/rfc9293>
9. RFC 6928 - Increasing TCP's Initial Window：<https://www.rfc-editor.org/rfc/rfc6928>
10. RFC 5681 - TCP Congestion Control：<https://datatracker.ietf.org/doc/html/rfc5681>
11. RFC 2018 - TCP Selective Acknowledgment Options：<https://www.rfc-editor.org/rfc/rfc2018>
12. RFC 2883 - An Extension to the Selective Acknowledgement（SACK） Option for TCP：<https://www.rfc-editor.org/rfc/rfc2883>
13. RFC 9438 - CUBIC for Fast and Long-Distance Networks：<https://www.rfc-editor.org/rfc/rfc9438>
14. RFC 8257 - Data Center TCP（DCTCP）：<https://www.rfc-editor.org/rfc/rfc8257>
15. BBR: Congestion-Based Congestion Control, ACM Queue, 2016：<https://queue.acm.org/detail.cfm?id=3022184>
16. RFC 1122 - Requirements for Internet Hosts - Communication Layers：<https://datatracker.ietf.org/doc/html/rfc1122>
17. RFC 6298 - Computing TCP's Retransmission Timer：<https://www.rfc-editor.org/rfc/rfc6298>
18. RFC 7323 - TCP Extensions for High Performance：<https://datatracker.ietf.org/doc/rfc7323/>


---

<!-- source: 计算机网络/TCP 三次握手和四次挥手（传输层）.md -->

---
title: TCP 三次握手和四次挥手（传输层）
description: 一文讲清 TCP 三次握手与四次挥手：SEQ/ACK/SYN/FIN 如何同步，TIME_WAIT 与 2MSL 的原因，半连接队列（SYN Queue）与全连接队列（Accept Queue）的工作机制，以及 backlog/somaxconn/syncookies 在高并发与 SYN Flood 下的影响。
category: 计算机基础
tag:
  - 计算机网络
head:
  - - meta
    - name: keywords
      content: TCP,三次握手,四次挥手,三次握手为什么,四次挥手为什么,TIME_WAIT,CLOSE_WAIT,2MSL,状态机,SEQ,ACK,SYN,FIN,RST,半连接队列,全连接队列,SYN队列,Accept队列,backlog,somaxconn,SYN Flood,syncookies
---

TCP 三次握手和四次挥手很容易被背成一张流程图：客户端发 `SYN`，服务端回 `SYN+ACK`，最后再来一个 `ACK`；关闭连接时，再按 `FIN`、`ACK`、`FIN`、`ACK` 走一遍。

但真正排查网络问题、看抓包或者聊面试题时，只记顺序往往不够。比如：为什么建立连接不是两次握手？服务端收到第三次握手之后，连接到底放在哪个队列？四次挥手中的 ACK 和 FIN 为什么通常分开发？又在什么条件下能合并成三次挥手？

这篇文章就围绕 TCP 连接的建立和释放，把这些问题串起来讲清楚：

1. TCP 三次握手每一步分别做了什么？
2. 为什么建立连接需要三次握手，而不是两次或四次？
3. 半连接队列和全连接队列分别保存什么？
4. TCP 四次挥手每一步分别做了什么？
5. `TIME_WAIT`、`CLOSE_WAIT`、三次挥手这些细节该怎么理解？

> **术语约定**：本文正文统一使用 `SYN_RCVD`、`TIME_WAIT` 这类下划线写法；RFC 中常写作 `SYN-RECEIVED`、`TIME-WAIT`，Linux `ss` 命令中常显示为 `syn-recv`、`time-wait`。它们指向的是同一类 TCP 状态，只是不同语境下的写法不同。

## 建立连接：TCP 三次握手

![TCP 三次握手图解](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-shakes-hands-three-times.png)

在最常见的“一端主动发起连接、一端被动监听”的场景下，TCP 连接通常通过三次握手建立：

1. **第一次握手（SYN）**：客户端向服务端发送一个 SYN（Synchronize Sequence Numbers）报文段，其中包含客户端生成的初始序列号（Initial Sequence Number，ISN），例如 `seq=x`。发送后，客户端进入 `SYN_SENT` 状态，等待服务端确认。
2. **第二次握手（SYN+ACK）**：服务端收到 SYN 后，如果同意建立连接，会回复一个 SYN+ACK 报文段。这个报文段包含两个关键信息：
   - **SYN**：服务端也需要同步自己的初始序列号，因此会携带服务端生成的 ISN，例如 `seq=y`。
   - **ACK**：用于确认收到客户端的 SYN，确认号设置为客户端初始序列号加一，即 `ack=x+1`。
   - 发送该报文段后，服务端进入 `SYN_RCVD` 状态。
3. **第三次握手（ACK）**：客户端收到服务端的 SYN+ACK 后，会向服务端发送最终确认报文段。由于客户端的 SYN 会消耗一个序列号，因此这个 ACK 报文段的序列号通常为 `seq=x+1`；它用于确认服务端的 SYN，确认号为 `ack=y+1`。发送后，客户端进入 `ESTABLISHED` 状态。服务端收到这个 ACK 后，也进入 `ESTABLISHED` 状态。

至此，双方完成初始序列号同步，并确认这条连接可以开始双向传输数据。

### 什么是半连接队列和全连接队列？

```mermaid
sequenceDiagram
  autonumber
  participant C as 客户端 Client
  participant K as 服务端内核 TCP
  box 服务端内核队列
    participant SQ as 半连接队列 SYN queue
    participant AQ as 全连接队列 Accept queue
  end
  participant App as 用户态应用 Server app

  C->>K: SYN
  K-->>C: SYN+ACK
  Note over SQ: 内核为该连接创建请求条目<br/>连接状态 SYN_RCVD<br/>放入 SYN queue

  C->>K: ACK 第三次握手
  Note over SQ,AQ: 内核收到 ACK 后完成握手<br/>将连接从 SYN queue 迁移到 Accept queue<br/>队列未满才可进入
  Note over AQ: 连接已完成 可被 accept<br/>连接状态 ESTABLISHED

  App->>K: accept
  K-->>App: 返回已就绪的 socket
  Note over AQ: 该连接从 Accept queue 移除
```

在 TCP 三次握手过程中，服务端内核通常会用两个队列来管理连接请求。下面以常见 Linux 行为为例，不同操作系统、内核版本、socket 选项和部署环境可能会有细节差异。

1. **半连接队列（SYN Queue）**：
   - 保存“握手未完成”的请求。服务端收到 SYN 并回复 SYN+ACK 后，连接进入 `SYN_RCVD`，等待客户端最终 ACK。
   - 如果一直收不到 ACK，内核会按重传策略重发 SYN+ACK，最终超时清理。
   - 常见相关参数包括 `net.ipv4.tcp_max_syn_backlog`。在 SYN Flood 场景下，还会涉及 `net.ipv4.tcp_syncookies`。
2. **全连接队列（Accept Queue）**：

   - 保存“握手已完成但应用还没有 accept”的连接。服务端收到最终 ACK 后，连接变为 `ESTABLISHED`，并进入全连接队列，等待应用层 `accept()` 取走。
   - 队列容量受 `listen(fd, backlog)` 和系统上限 `net.core.somaxconn` 共同影响。实践中常见有效上限可以近似理解为 `min(backlog, somaxconn)`，具体行为仍要看内核版本和应用配置。

总结一下：

| 队列                       | 作用                                   | 状态          | 移出条件                 |
| -------------------------- | -------------------------------------- | ------------- | ------------------------ |
| 半连接队列（SYN Queue）    | 保存未完成握手的连接                   | `SYN_RCVD`    | 收到 ACK / 超时重传失败  |
| 全连接队列（Accept Queue） | 保存已完成握手、等待应用 accept 的连接 | `ESTABLISHED` | 被应用层 `accept()` 取出 |

当全连接队列满时，`net.ipv4.tcp_abort_on_overflow` 会影响处理策略：

- `0`（默认）：Linux 通常不会立即返回 RST，而可能丢弃第三次握手 ACK，使服务端继续停留在握手未完全完成的状态，并重传 SYN+ACK。客户端发出第三次 ACK 后，通常已经认为 `connect()` 成功；但服务端并没有把这个连接放进全连接队列，所以客户端后续发送数据时可能迟迟得不到正常响应，最终表现为首包阻塞、读超时或重试。
- `1`：直接对客户端回复 `RST`，让连接快速失败。

排查时可以用 `ss -ltn` 看监听 socket。对于 `LISTEN` 状态，`Recv-Q` 通常表示当前 backlog 中等待应用 accept 的连接数，`Send-Q` 表示 socket backlog 上限。如果 `Recv-Q` 长时间接近 `Send-Q`，就要重点怀疑应用 accept 不及时、backlog 偏小、线程池卡住、GC 抖动或者短时间连接突刺。

当半连接队列满时，如果 `tcp_syncookies=1`，Linux 会在 SYN backlog 溢出时启用 SYN Cookie：服务端把必要信息编码进返回的 SYN+ACK 中，而不是为每个请求都保留完整的半连接状态。也就是说，SYN Cookie 生效时，服务端不会为这个 SYN 在半连接队列中分配常规状态；只有收到合法的最终 ACK 后，内核才会校验 cookie，并重建连接所需的信息。

但 SYN Cookie 是防护手段，不是扩容手段。它能缓解 SYN Flood 对半连接队列的冲击，但仍会消耗 CPU；如果攻击流量已经打满带宽，SYN Cookie 也无法从根本上恢复可用性。另外，SYN Cookie 模式下部分 TCP 扩展能力可能受限，在高延迟、高带宽链路下可能出现性能退化。`tcp_syncookies=2` 更偏测试用途，不建议作为生产环境默认配置。

### 为什么要三次握手？

TCP 三次握手主要做两件事：**同步双方的初始序列号**，并且**确认双方的收发路径是可用的**。真正的数据可靠交付，还要依赖后续传输过程中的确认、重传、窗口控制和拥塞控制。

#### 1. 确认双方收发能力，并同步初始序列号

```mermaid
sequenceDiagram
  autonumber
  participant C as 客户端 Client
  participant S as 服务端 Server

  Note over C,S: 目标 同步双方 ISN 并确认双向可达

  C->>S: SYN seq=ISN_C
  Note right of S: 服务端知道 C→S 方向可达<br/>客户端能发 服务端能收
  Note right of S: 服务端状态 SYN_RCVD

  S->>C: SYN+ACK seq=ISN_S ack=ISN_C+1
  Note left of C: 客户端知道 S→C 方向可达<br/>也知道服务端收到了自己的 SYN

  C->>S: ACK seq=ISN_C+1 ack=ISN_S+1
  Note left of C: 客户端状态 ESTABLISHED
  Note right of S: 服务端知道客户端收到了 SYN+ACK<br/>握手闭环 双方 ISN 同步完成
  Note right of S: 服务端状态 ESTABLISHED

  Note over C,S: 连接建立 可以开始传输数据
```

TCP 依赖序列号（SEQ）和确认号（ACK）来保证数据有序、去重和重传。三次握手通过交换并确认双方的 ISN，让两端对“从哪个序号开始收发数据”达成一致，同时避免只凭单向信息就进入已建立状态。

可以用下面这张表来记：

| 步骤 | 报文         | 能确认什么                                                             |
| ---- | ------------ | ---------------------------------------------------------------------- |
| 1    | C→S：SYN     | 服务端知道：客户端能发，服务端能收，C→S 方向可达                       |
| 2    | S→C：SYN+ACK | 客户端知道：服务端能发，客户端能收；同时确认服务端收到了自己的 SYN     |
| 3    | C→S：ACK     | 服务端知道：客户端收到了 SYN+ACK，S→C 方向也被服务端确认；至此握手闭环 |

注意：第 2 步完成时，只有客户端确认了双向可达；服务端此时还不知道自己发出的 SYN+ACK 是否被客户端收到。服务端只有收到第 3 次握手的 ACK 后，才真正确认这个闭环，这也是两次握手不够的核心原因。

#### 2. 防止已失效的连接请求被错误建立

```mermaid
sequenceDiagram
    participant C as 客户端 Client
    participant S as 服务端 Server

    Note over C,S: 场景 旧的 SYN 报文在网络中滞留

    C->>S: 1. 发送 SYN 旧请求 滞留中
    Note over C: 客户端超时 放弃该请求

    C->>S: 2. 发送 SYN 新请求
    S-->>C: 3. 建立连接并正常释放

    rect rgb(255, 240, 240)
        Note right of S: 此时旧 SYN 终于到达服务端
        S->>C: 4. 发送 SYN+ACK 针对旧请求

        alt 如果是两次握手
            Note right of S: 假设服务端回复 SYN+ACK 后<br/>就认为连接建立
            Note right of S: 错误建立连接<br/>分配资源 造成浪费
        else 如果是三次握手
            Note left of C: 客户端无该连接状态<br/>或认为这是非期望报文
            C->>S: 5. 发送 RST 或直接丢弃
            Note right of S: 收到 RST 立即清理<br/>或等不到 ACK 后超时清理
        end
    end
```

设想一个场景：客户端发送的第一个连接请求 SYN1 因网络延迟而滞留。客户端超时后，重新发送 SYN2，并成功建立连接，数据传输完毕后连接也释放了。此时，延迟的 SYN1 才到达服务端。

- **如果是两次握手**：服务端收到这个失效的 SYN1 后，可能误认为这是一个新的连接请求，并立即分配资源、建立连接。但客户端已经没有这个连接意图，不会继续配合传输，服务端就会单方面维持一个无效连接。
- **有了第三次握手**：服务端收到失效的 SYN1 并回复 SYN+ACK 后，还要等待客户端最终 ACK。由于客户端当前没有这个连接状态，它可能直接丢弃，也可能发送 RST。服务端收不到合法 ACK，最终就会清理这个错误连接。

所以，三次握手不是“多发一次包而已”，它让连接建立过程形成闭环，避免网络中的延迟、重复历史请求干扰新的连接。

### 第 2 次握手已经传回 ACK，为什么还要传回 SYN？

第二次握手里的 ACK 是为了确认“服务端收到了客户端的 SYN”，也就是确认 C→S 方向的请求已经到达。

同时携带 SYN，是因为服务端也需要把自己的 ISN 同步给客户端，并要求客户端确认。只有双方的 ISN 都完成同步，后续可靠传输才有共同的序列号起点。

简言之：ACK 表示“我收到了你的 SYN”，SYN 表示“我也要同步我的初始序列号，请你确认”。

> SYN（Synchronize Sequence Numbers）是 TCP 建立连接时使用的同步信号。客户端先发送 SYN，服务端使用 SYN+ACK 应答，最后客户端再用 ACK 确认。这样双方才能完成初始序列号同步，建立一条可用于可靠数据传输的 TCP 连接。

### 三次握手过程中可以携带数据吗？

普通 TCP 中，第三次握手的 ACK 可以携带数据。RFC 9293 也允许连接同步阶段出现携带数据的报文，但接收端在确认数据有效前，不能把这部分数据交付给应用；通常需要等连接进入 `ESTABLISHED` 后，应用层才能读到这些数据。

如果第三次握手的 ACK 丢失，但客户端随后发送了一个携带数据且带 ACK 标志的报文，服务端收到后可以把它视为有效的第三次握手确认。连接被认为建立后，服务端再继续处理该数据。

需要注意，这和 TCP Fast Open（TFO）不是一回事。TFO 讨论的是第一次 SYN 就携带应用数据，需要客户端、服务端和系统配置共同支持，不是普通 TCP 默认行为。

## 断开连接：TCP 四次挥手

![TCP 四次挥手图解](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-waves-four-times.png)

TCP 是全双工通信，两端的发送方向彼此独立。关闭连接时，通常需要两个方向分别完成“我不发了”和“我确认你不发了”的过程，所以逻辑上常被讲成“四次挥手”。

不过要注意：四次挥手说的是逻辑动作，不一定意味着抓包时总能看到 4 个独立报文段。在某些场景下，ACK 和 FIN 可以合并在同一个报文段里。

典型流程如下：

1. **第一次挥手（FIN）**：客户端，或者任意一方，决定关闭自己的发送方向时，会发送一个 FIN 报文段，表示自己已经没有数据要发送了。该报文段包含一个序列号，例如 `seq=u`。发送后，主动关闭方进入 `FIN_WAIT_1` 状态。
2. **第二次挥手（ACK）**：服务端收到 FIN 后，会回复 ACK，确认号为 `ack=u+1`。发送后，服务端进入 `CLOSE_WAIT` 状态。客户端收到 ACK 后，进入 `FIN_WAIT_2` 状态。此时连接处于**半关闭（Half-Close）**状态：客户端到服务端的发送方向已关闭，但服务端仍然可以继续向客户端发送剩余数据。
3. **第三次挥手（FIN）**：当服务端确认剩余数据都发送完毕后，也会发送 FIN，表示自己也准备关闭发送方向。该报文段同样包含一个序列号，例如 `seq=v`；通常也会继续携带当前确认号，例如 `ack=u+1`。发送后，服务端进入 `LAST_ACK` 状态，等待客户端最终确认。
4. **第四次挥手（ACK）**：客户端收到服务端的 FIN 后，回复最终 ACK，确认号为 `ack=v+1`。发送后，客户端进入 `TIME_WAIT` 状态。服务端收到这个 ACK 后进入 `CLOSED`。客户端则在 `TIME_WAIT` 状态等待 2MSL 后，最终进入 `CLOSED`。

这里为了方便理解，用客户端发起关闭作为例子。实际中谁主动关闭连接，谁就会进入 `TIME_WAIT`，这和“客户端 / 服务端”的角色没有必然关系。

> 注意区分：**半关闭（Half-Close）** 指一个方向已经发送 FIN，另一个方向仍可继续发送数据；**半开连接（Half-Open Connection）** 通常指一端崩溃、重启或状态丢失后，另一端仍以为连接存在。两者不是同一个概念。

TCP 连接建立与关闭的常见状态迁移路径如下。图中省略了同时打开、同时关闭、RST、CLOSING 等少见或异常分支。

![TCP 连接建立与关闭的常见状态迁移路径](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-state-diagram.png)

### 为什么要四次挥手？

因为 TCP 是全双工的。A 不想发了，不代表 B 也立刻没有数据要发。

举个例子，A 和 B 打电话，通话即将结束：

1. A 说：“我没什么要说的了。”（A 发 FIN）
2. B 回答：“我知道了。”但 B 可能还有话要说。（B 回 ACK）
3. B 继续说完剩下的话，最后说：“我也说完了。”（B 发 FIN）
4. A 回答：“知道了。”（A 回 ACK）

这对应到 TCP 中，就是两个方向分别关闭、分别确认。

### 为什么通常不能把服务端发送的 ACK 和 FIN 合并起来，变成三次挥手？

```mermaid
sequenceDiagram
  autonumber
  participant C as 客户端
  participant K as 服务端内核
  participant A as 服务端应用

  Note over C,K: 客户端发起关闭
  C->>K: FIN
  Note right of K: 内核回复 ACK<br/>用于确认对端 FIN
  K-->>C: ACK
  Note right of K: 服务端状态变为 CLOSE_WAIT

  Note over K,A: 应用处理阶段
  K->>A: 通知本端应用<br/>对端已关闭发送方向 例如 read 返回 0
  A->>A: 读取和处理剩余数据
  A->>A: 发送最后响应
  A->>K: 调用 close 或 shutdown

  Note right of K: 发送本端 FIN<br/>并进入 LAST_ACK
  K-->>C: FIN
  Note left of C: 客户端回复 ACK<br/>并进入 TIME_WAIT
  C->>K: ACK
  Note right of K: 服务端收到最终 ACK<br/>进入 CLOSED
```

关键原因是：**回复 ACK** 和 **发送 FIN** 的触发时机通常不同。

- 当服务端收到客户端 FIN 时，内核协议栈需要回复 ACK，确认“我收到了你要关闭发送方向的请求”。此时服务端进入 `CLOSE_WAIT`，等待本端应用处理剩余数据。
- 只有当服务端应用处理完毕，并调用 `close()` 或 `shutdown()` 后，内核才会发送本端 FIN。
- 因此，“内核自动回 ACK”和“应用决定发 FIN”在时间上是解耦的，通常无法合并。只有在服务端恰好也准备立即关闭时，才可能出现 FIN+ACK 合并在一个报文段中的情况。

### CLOSE_WAIT 为什么会堆积？

`CLOSE_WAIT` 是被动关闭方收到 FIN、并回复 ACK 之后进入的状态。正常情况下，它只是一个过渡状态：应用读到对端关闭发送方向的信号后，处理完剩余数据，再调用 `close()` 或 `shutdown()`，连接就会继续进入 `LAST_ACK`。

如果机器上出现大量 `CLOSE_WAIT`，通常不是内核参数没调好，而是应用层没有及时关闭连接。常见原因包括：异常分支漏掉 `close()`、连接池归还和真实关闭逻辑不一致、业务线程被慢查询或外部调用卡住，导致代码迟迟走不到关闭 socket 的位置。

排查时可以用 `ss -tan state close-wait` 先看哪些连接停在 `CLOSE_WAIT`，再结合应用日志、线程栈和连接池监控定位具体代码路径。`CLOSE_WAIT` 的重点在“本端应用还没关闭”，所以单纯调 TCP 参数通常解决不了根因。

### 什么情况下会出现三次挥手？

四次挥手变成三次挥手，本质上不是少了关闭步骤，而是**第二次挥手的 ACK 和第三次挥手的 FIN 被合并到同一个报文段里**。

比较典型的条件是：被动关闭方收到 FIN 后，本端已经没有待发送的数据，应用也立刻决定关闭连接。

这里还要结合 TCP 延迟确认（Delayed ACK）来理解。延迟确认的目的，是让 ACK 有机会和窗口更新、应用响应或其他出站报文合并，减少纯 ACK 报文数量。RFC 1122 要求 ACK 不能被过度延迟，具体等待多久则由实现决定。在 Linux 等实现中，如果“确认对端 FIN”的 ACK 还在等待合并，本端应用又很快调用了 `close()` 或 `shutdown()`，内核就可以发出一个 FIN+ACK：既确认对端的 FIN，也表达“我这边也不再发送数据了”。

抓包时看到的流程就会变成：

1. 主动关闭方发送 FIN；
2. 被动关闭方发送 FIN+ACK；
3. 主动关闭方回复 ACK，并进入 `TIME_WAIT`。

这里有两个细节容易混淆：

- 三次挥手并不违背 TCP 全双工关闭语义。两个方向仍然都要关闭，只是被动关闭方的“确认”和“关闭发送方向”刚好放进了同一个 TCP 报文段。
- 能不能合并，还和具体 TCP 实现、延迟确认策略、应用关闭时机有关。如果 ACK 已经被内核单独发出，后面再发送 FIN 时就无法“倒回去”合并；如果开启了类似 `TCP_QUICKACK` 的快速确认策略，使 ACK 尽快独立发出，也更容易看到完整的四次挥手。

### 如果第二次挥手时服务端的 ACK 没有送达客户端，会怎样？

客户端发送第一次 FIN 后进入 `FIN_WAIT_1`，并启动重传计时器。如果在超时时间内没有收到对端对 FIN 的确认 ACK，客户端会重传 FIN。

服务端如果收到重复 FIN，通常会再次发送 ACK。如果由于网络问题 ACK 一直无法送达，客户端在达到一定重试或超时阈值后，可能报错或放弃。具体行为受实现和参数影响：在 Linux 中，如果 socket 已经被应用关闭、成为 orphaned socket，后续重试更直接受 `tcp_orphan_retries` 影响；普通存活连接上的 RTO 重传超时则和 `tcp_retries2` 有关。

### 为什么第四次挥手后要等待 2MSL？

第四次挥手时，主动关闭方发送给被动关闭方的最后一个 ACK 可能丢失。如果被动关闭方没有收到 ACK，就会重传 FIN。主动关闭方还在 `TIME_WAIT` 里，就能再次回复 ACK。

如果主动关闭方发完最后一个 ACK 后立刻进入 `CLOSED`，当对端重传 FIN 到达时，本端可能已经没有对应连接状态，只能回复 RST，导致对端看到异常关闭或连接被重置。

```mermaid
sequenceDiagram
  participant A as 主动关闭方
  participant B as 被动关闭方

  B->>A: FIN
  A-->>B: ACK 丢失
  Note over A: A 进入 TIME_WAIT<br/>没有立刻释放连接
  B->>A: 重传 FIN
  A-->>B: 再次 ACK
  Note over B: B 收到 ACK 后进入 CLOSED
```

**MSL（Maximum Segment Lifetime）** 是报文段在网络中的最大生存时间。2MSL 不是一次请求-响应的最大 RTT，而是一个保守等待窗口：既给最后 ACK 丢失后的 FIN 重传留出处理机会，也尽量保证旧连接中的延迟报文从网络中消失。

需要注意，RFC 里的 MSL 是协议层概念，具体系统实现可能不同。Linux 常见实现中，`TIME_WAIT` 保留时间通常是 60 秒，对应内核中的 `TCP_TIMEWAIT_LEN` 常量，并不是根据实时网络环境动态计算出来的“2 倍 MSL”。还有一个常见误区：`tcp_fin_timeout` 控制的是 orphaned connection 的 `FIN_WAIT_2` 超时，不是 `TIME_WAIT`。想缓解 `TIME_WAIT` 带来的端口压力，优先看连接复用、端口范围、主动关闭方和 `tcp_tw_reuse` 条件，而不是试图用 `tcp_fin_timeout` 缩短 `TIME_WAIT`。

## TIME_WAIT 常见问题：为什么要等、会不会出问题、能不能复用？

这部分内容已单独成文，详见 [TCP TIME_WAIT 详解：为什么要等、会不会出问题、能不能复用？](./TCP TIMEWAIT 详解-为什么要等、会不会出问题、能不能复用？.md)。

## 总结

TCP 三次握手的核心，不是“刚好发了三次包”，而是通过 `SYN`、`ACK` 和初始序列号同步，让客户端和服务端都确认连接具备双向通信能力。少一次握手，服务端就可能无法确认客户端是否收到了自己的 `SYN+ACK`，也更容易被网络中的旧连接请求干扰。

服务端在握手过程中会涉及半连接队列和全连接队列：前者保存还没完成握手的连接，后者保存已经建立、等待应用 `accept()` 的连接。排查连接建立慢、偶发超时、SYN Flood 或 accept 不及时等问题时，这两个队列是很重要的观察点。

TCP 四次挥手的核心，是全双工连接的两个发送方向要分别关闭。主动关闭方发 FIN，只表示“我不再发送数据了”，并不代表对端也立刻没有数据要发。因此，ACK 和 FIN 通常分开发送；只有被动关闭方没有待发数据、应用立刻关闭连接，并且 ACK 还可以借助延迟确认等机制等待合并时，ACK 和 FIN 才可能合并成一个 FIN+ACK，抓包上看起来就是三次挥手。`CLOSE_WAIT` 则通常提醒我们：被动关闭方的应用还没有真正关闭连接。

最后，`TIME_WAIT` 不是多余等待。它既给最后一个 ACK 丢失后的 FIN 重传留出处理机会，也尽量避免旧连接中的延迟报文影响后续新连接。理解这些状态和报文的触发时机，比单纯记住“几次握手、几次挥手”更有用。

## 参考

- 《计算机网络（第 7 版）》
- 《图解 HTTP》
- TCP and UDP Tutorial：<https://www.9tut.com/tcp-and-udp-tutorial>
- 从一次线上问题说起，详解 TCP 半连接队列、全连接队列：<https://mp.weixin.qq.com/s/YpSlU1yaowTs-pF6R43hMw>
- RFC 9293: Transmission Control Protocol（TCP）：<https://www.rfc-editor.org/rfc/rfc9293>
- RFC 1122: Requirements for Internet Hosts - Communication Layers：<https://www.rfc-editor.org/rfc/rfc1122>
- RFC 1337: TIME-WAIT Assassination Hazards in TCP：<https://www.rfc-editor.org/rfc/rfc1337>
- tcp(7) - Linux manual page：<https://www.man7.org/linux/man-pages/man7/tcp.7.html>
- Linux 内核 ip-sysctl 文档：<https://www.kernel.org/doc/Documentation/networking/ip-sysctl.txt>
- Linux 内核 `include/net/tcp.h`：<https://codebrowser.dev/linux/linux/include/net/tcp.h.html>
- SoByte - 为什么 TCP 需要 TIME_WAIT 状态：<https://www.sobyte.net/post/2022-10/TCP TIMEWAIT 详解-为什么要等、会不会出问题、能不能复用？/>

<!-- @include: @article-footer.snippet.md -->


---

<!-- source: 计算机网络/常见应用层协议总结-HTTP、WebSocket、SMTP、FTP、SSH、DNS 等.md -->

---
title: 常见应用层协议总结：HTTP、WebSocket、SMTP、FTP、SSH、DNS 等
description: 汇总应用层常见协议的核心概念与典型场景，重点对比 HTTP 与 WebSocket 的通信模型与能力边界。
category: 计算机基础
tag:
  - 计算机网络
head:
  - - meta
    - name: keywords
      content: 应用层协议,HTTP,WebSocket,DNS,SMTP,FTP,特性,场景
---

<!-- @include: @article-header.snippet.md -->

应用层协议很多，HTTP、WebSocket、SMTP、POP3/IMAP、FTP、Telnet、SSH、RTP、DNS 这些名字也经常一起出现。

这些协议不需要每一个都学到实现细节，但如果只记协议名，很容易在“用途、底层传输协议、典型场景”这几个点上混在一起。

这篇文章主要回答几个问题：

1. HTTP、WebSocket、SMTP、FTP、SSH、DNS 等协议分别解决什么问题？
2. 这些协议通常基于 TCP 还是 UDP，常见端口和使用场景是什么？
3. 哪些协议最容易混淆，面试和实践中应该怎么区分？

## HTTP：超文本传输协议

**超文本传输协议（HTTP，HyperText Transfer Protocol）** 是一种用于传输超文本和多媒体内容的应用层协议，最常见的使用场景就是 Web 浏览器与 Web 服务器之间的通信。

![HTTP：超文本传输协议概览](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/http-overview.png)

当我们在浏览器里访问一个网页时，浏览器会向服务器发送 HTTP 请求，服务器处理后返回 HTTP 响应。页面中的 HTML、CSS、JavaScript、图片、视频等资源，很多都是通过 HTTP 加载的。

HTTP 使用客户端-服务器模型，客户端发送 HTTP Request（请求），服务器返回 HTTP Response（响应），整个过程如下图所示。

![HTTP 协议](https://oss.javaguide.cn/github/javaguide/450px-HTTP-Header.png)

需要注意的是，HTTP 是应用层协议，它本身不直接负责可靠传输。不同版本的 HTTP 底层依赖也不完全一样：

- **HTTP/1.1**：基于 TCP。
- **HTTP/2**：通常也基于 TCP，但引入了多路复用、头部压缩等能力。
- **HTTP/3**：基于 QUIC，而 QUIC 基于 UDP，主要用于降低连接建立开销，并缓解 TCP 队头阻塞带来的影响。

在 HTTP/1.1 中，默认开启 Keep-Alive，也就是长连接。这样同一个 TCP 连接可以被多个 HTTP 请求复用，避免每次请求都重新建立 TCP 连接，从而减少三次握手带来的开销。

从连接复用角度看，HTTP/1.1 的 Keep-Alive 解决的是“同一个 TCP 连接复用多个请求”的问题，但同一连接上的请求处理仍然可能受到队头阻塞影响。

HTTP/2 在一个 TCP 连接上引入多路复用，可以并行传输多个请求和响应，减少了 HTTP 层面的队头阻塞。但由于底层仍然是 TCP，一旦某个 TCP 包丢失，整个连接上的数据仍然会受影响。

HTTP/3 基于 QUIC，QUIC 在 UDP 之上实现多路复用和可靠传输。不同流之间相互独立，可以缓解 TCP 层队头阻塞问题。

另外，HTTP 是一种**无状态协议**。服务端不会天然记住“上一次请求是谁发的、处于什么状态”。因此，在实际 Web 开发中，通常需要借助 Cookie、Session、Token（包括 JWT）等机制来维护用户登录态和会话状态。

## WebSocket：全双工通信协议

**WebSocket** 是一种基于 TCP 连接的全双工通信协议，客户端和服务器可以在同一条连接上同时发送和接收数据。

![WebSocket：全双工通信协议概览](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/websocket-overview.png)

它的典型特点是：**连接建立后，服务端也可以主动向客户端推送消息**。这正好弥补了传统 HTTP 请求-响应模型在实时通信场景下的不足。

WebSocket 协议在 2008 年诞生，2011 年成为国际标准，现代主流浏览器基本都已经支持。WebSocket 不只用于浏览器场景，很多编程语言、框架和服务器也都提供了对应支持。

WebSocket 本质上仍然是应用层协议。它通常先通过一次 HTTP 请求发起协议升级，升级成功后，客户端和服务端之间会建立一条持久连接，后续就可以进行双向数据传输。

![WebSocket 示意图](https://oss.javaguide.cn/github/javaguide/系统设计/Web 实时消息推送详解/1460000042192394.png)

WebSocket 的常见应用场景包括：

- 视频弹幕
- 实时消息推送，详见[Web 实时消息推送详解](https://javaguide.cn/系统设计/web-real-time-message-push.html)
- 实时游戏对战
- 多用户协同编辑
- 在线客服 / 社交聊天
- 股票行情、体育比分等实时数据更新

WebSocket 的工作过程可以简单分为下面几步：

1. 客户端向服务器发送一个 HTTP 请求，请求头中包含 `Upgrade: websocket`、`Connection: Upgrade`、`Sec-WebSocket-Key` 等字段，表示希望把当前连接升级为 WebSocket。
2. 服务器收到请求后，如果支持 WebSocket，会返回 HTTP `101 Switching Protocols` 状态码，响应头中包含 `Upgrade: websocket`、`Connection: Upgrade`、`Sec-WebSocket-Accept` 等字段，表示协议升级成功。
3. 协议升级后，客户端和服务器之间就建立了一条 WebSocket 连接，双方可以进行双向通信。
4. WebSocket 数据以帧（Frame）的形式传输。一条完整消息可能会被拆分成多个帧发送，接收端再重新组装成完整消息。
5. 客户端或服务器都可以主动发送关闭帧，另一方收到后也会回复关闭帧，然后双方关闭 TCP 连接。

另外，WebSocket 连接通常会配合**心跳机制**使用。比如定期发送 Ping/Pong 帧，或者在业务层发送心跳包，用来检测连接是否仍然可用，避免连接假死。

## SMTP：简单邮件传输协议

**简单邮件传输协议（SMTP，Simple Mail Transfer Protocol）** 是一种基于 TCP 的应用层协议，主要用于**发送和转发电子邮件**。

![SMTP：简单邮件传输协议概览](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/smtp-overview.png)

这里要注意一个容易混淆的点：

**SMTP 负责邮件发送和邮件服务器之间的转发；POP3/IMAP 负责用户从邮箱服务器收取邮件。**

也就是说，邮件从你的邮箱服务器发送到对方邮箱服务器，这个过程通常还是 SMTP；而用户使用客户端查看邮箱里的邮件，通常使用 POP3 或 IMAP。

![SMTP 协议](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/what-is-smtp.png)

常见 SMTP 相关端口有 25、465、587，三者用途不完全一样：

| 端口 | 常见用途               | 说明                                                                          |
| ---- | ---------------------- | ----------------------------------------------------------------------------- |
| 25   | 邮件服务器之间转发邮件 | 主要用于 MTA 到 MTA 的投递，很多云厂商或 ISP 会限制 25 端口出站，防止垃圾邮件 |
| 587  | 客户端提交邮件         | 标准的 Message Submission 端口，通常配合 STARTTLS 和身份认证使用              |
| 465  | 隐式 TLS 的邮件提交    | 客户端连接时直接建立 TLS 加密通道，很多邮件服务商仍然支持                     |

### 电子邮件的发送过程

比如我的邮箱是 `<dabai@cszhinan.com>`，我要向 `<xiaoma@qq.com>` 发送邮件，整个过程可以简单理解为：

1. 我通过邮箱客户端或网页邮箱写好邮件。
2. 邮件客户端通过 SMTP 协议，把邮件提交给 `cszhinan.com` 对应的邮件服务器。
3. 发送方邮件服务器根据收件人域名 `qq.com` 查询对应的邮件服务器地址。
4. 发送方邮件服务器再通过 SMTP，把邮件投递到 QQ 邮箱服务器。
5. QQ 邮箱服务器接收邮件并保存。
6. 用户 `<xiaoma@qq.com>` 通过 POP3 或 IMAP 协议从 QQ 邮箱服务器读取邮件。

### 如何判断邮箱是否真正存在？

一些场景下，我们可能需要判断某个邮箱地址是否真实存在。常见思路是基于 SMTP 做探测：

1. 查询邮箱域名对应的 MX 记录，找到邮件服务器。
2. 尝试连接目标邮件服务器。
3. 使用 SMTP 命令模拟投递流程。
4. 根据服务器返回结果判断邮箱地址是否可能存在。

不过，这种方式并不总是可靠。

很多邮件服务商为了防止垃圾邮件、撞库和隐私泄露，会屏蔽邮箱存在性探测，或者统一返回模糊结果。因此，SMTP 探测只能作为参考，不能 100% 判断邮箱一定存在或不存在。

推荐几个在线邮箱有效性检测工具：

1. <https://verify-email.org/>
2. <http://tool.chacuo.net/mailverify>
3. <https://www.emailcamel.com/>

## POP3/IMAP：邮件接收协议

**POP3 和 IMAP 都是用于接收邮件的协议**，二者也都是基于 TCP 的应用层协议。

![POP3/IMAP：邮件接收协议概览](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/pop3-imap-overview.png)

需要注意的是：**SMTP 主要负责邮件发送和转发，POP3/IMAP 主要负责用户从邮箱服务器读取邮件。**

POP3 的设计比较简单，常见模式是把邮件从服务器下载到本地。它适合单设备收信，但多设备同步体验较差。

IMAP 是更现代、更常用的邮件接收协议。它支持在服务器端管理邮件，能够同步邮件状态，比如已读、未读、删除、归档、文件夹分类等。因此，如果你同时在手机、电脑、网页端查看同一个邮箱，IMAP 的体验通常会更好。

简单对比一下：

| 协议 | 主要用途       | 特点                             |
| ---- | -------------- | -------------------------------- |
| POP3 | 接收邮件       | 偏下载到本地，多设备同步能力弱   |
| IMAP | 接收和管理邮件 | 支持多设备同步、搜索、标记、归档 |
| SMTP | 发送和转发邮件 | 负责邮件投递链路                 |

## FTP：文件传输协议

**FTP（File Transfer Protocol，文件传输协议）** 是一种基于 TCP 的应用层协议，用于在客户端和服务器之间传输文件。

![FTP：文件传输协议概览](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/ftp-overview.png)

FTP 采用客户端-服务器模型。它比较特殊的一点是：FTP 通常会建立两条 TCP 连接。

> FTP 与很多应用层协议不同，它在客户端和服务器之间使用两条连接：
>
> 1. **控制连接**：用于传输命令和响应，例如登录、切换目录、删除文件等。
> 2. **数据连接**：用于真正传输文件内容或目录列表。

这种将命令和数据分开传输的设计，能够让控制命令和文件数据互不干扰。

![FTP 工作过程](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/ftp.png)

FTP 有主动模式（PORT）和被动模式（PASV）两种数据连接方式：

- **主动模式**：客户端通过控制连接告诉服务端自己监听的端口，服务端再主动连接客户端的这个端口建立数据连接。由于服务端要主动连接客户端，如果客户端在 NAT 或防火墙后面，很容易连接失败。
- **被动模式**：客户端请求服务端开放一个数据端口，然后由客户端主动连接服务端的数据端口。因为连接方向仍然是客户端到服务端，更容易穿过 NAT 和防火墙，所以实际生产环境中更常用被动模式。

注意：FTP 本身是不安全的。它默认不会加密传输内容，用户名、密码和文件数据都可能被窃听或篡改。

因此，传输敏感文件时不建议使用普通 FTP，可以选择：

- **SFTP**：基于 SSH 的安全文件传输协议。
- **FTPS**：在 FTP 基础上增加 TLS/SSL 加密。

其中，SFTP 和 FTPS 名字相似，但不是同一个协议。SFTP 基于 SSH，FTPS 是 FTP over TLS。

## Telnet：远程登录协议

**Telnet** 是一种基于 TCP 的远程登录协议，默认端口是 23。它允许用户通过终端远程登录到服务器，并在远程机器上执行命令。

Telnet 最大的问题是：**明文传输**。

![Telnet：远程登录协议概览](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/telnet-overview.png)

用户名、密码、命令内容和返回结果都不会加密，攻击者如果能监听网络流量，就可能直接看到敏感信息。

![Telnet：远程登录协议](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/Telnet_is_vulnerable_to_eavesdropping-2.png)

因此，Telnet 现在已经很少用于真正的远程管理。实际生产环境中，通常使用 SSH 替代 Telnet。

## SSH：安全的网络传输协议

**SSH（Secure Shell）** 是一种基于 TCP 的安全网络协议，默认端口是 22。它通过加密和认证机制，为远程登录、命令执行和文件传输提供安全保障。

![SSH：安全的网络传输协议概览](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/ssh-overview.png)

SSH 最经典的用途是登录远程服务器：

```bash
ssh user@server_ip
```

除了远程登录，SSH 还支持：

- 远程执行命令
- 端口转发
- 隧道代理
- X11 转发
- 基于 SFTP 或 SCP 的安全文件传输

SSH 使用客户端-服务器模型。SSH Server 监听客户端连接请求，SSH Client 发起连接。双方会先协商加密算法，并通过密钥交换生成后续通信使用的对称加密密钥。之后的通信内容都会被加密传输。

![SSH：安全的网络传输协议](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/ssh-client-server.png)

需要注意的是，SSH 的安全性不仅来自加密传输，也来自身份认证机制。常见认证方式包括：

- 密码认证
- 公钥认证
- 多因素认证

实际生产环境中，更推荐使用公钥认证，并关闭弱密码登录。

## RTP：实时传输协议

**RTP（Real-time Transport Protocol，实时传输协议）** 是一种用于传输音频、视频等实时数据的协议。它通常运行在 UDP 之上。在 TCP/IP 分层模型中，UDP 之上就是应用层，所以 RTP 按分层规则被归入应用层。但它承担的职责（序列号、时间戳、同步、质量反馈）更接近传输层功能，RFC 3550 也说它“通常会集成到应用处理中，而不是作为独立层实现”。

![RTP：实时传输协议概览](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/rtp-overview.png)

RTP 主要用在语音通话、视频会议、直播等实时场景。它本身不保证可靠传输，也不保证按时到达，而是通过序列号、时间戳等信息帮助接收端进行排序、同步和播放控制。虽然也存在 RTP over TCP 的封装方式（如 RFC 4571），但更多用于穿越防火墙或兼容特定协议栈等特殊场景，实际实时音视频场景中 RTP 仍以 UDP 为主。

RTP 通常会和 RTCP 配合使用：

- **RTP**：负责传输实时音视频数据。
- **RTCP（RTP Control Protocol）**：负责传输控制信息和统计信息，比如丢包率、延迟、抖动等。

在 WebRTC 中，RTP/RTCP 是实时音视频传输的重要基础。WebRTC 还会结合 SRTP 加密、拥塞控制、抖动缓冲、NACK、FEC 等机制，提升实时通信的安全性和质量。

需要注意的是，RTP 本身不负责资源预留，也不保证实时传输质量。它提供的是实时媒体传输的基础能力，具体的质量控制需要依赖上层机制配合完成。

## DNS：域名系统

**DNS（Domain Name System，域名系统）** 用于解决域名和 IP 地址之间的映射问题。

![DNS：域名系统概览](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/dns-overview.png)

我们访问网站时，通常输入的是域名，例如：

```text
www.javaguide.cn
```

但网络通信实际需要的是 IP 地址。DNS 的作用就是把域名解析成对应的 IP 地址。

DNS 通常使用 UDP，默认端口是 53。之所以优先使用 UDP，是因为大多数 DNS 查询和响应都比较小，不需要 TCP 三次握手，响应更快。

在早期 DNS 规范中，UDP DNS 消息大小限制为 512 字节（不包含 IP 和 UDP 头）。如果响应过大，服务器会设置截断标志，客户端再通过 TCP 重试。

后来 EDNS0 扩展了 DNS over UDP 的报文大小上限，使 DNS 能承载更大的响应，比如 DNSSEC 相关数据。但如果响应超过协商的 UDP 大小，或者发生区域传送（DNS 服务器之间同步整域数据，普通域名解析几乎不会触发），仍然会使用 TCP。

现代网络中还出现了更安全的 DNS 方案，比如：

- **DoH（DNS over HTTPS）**
- **DoT（DNS over TLS）**

它们的目的都是减少 DNS 明文查询带来的隐私和安全问题。

## 常见应用层协议端口总结

| 协议      |                          默认端口 | 传输层协议 | 主要用途               |
| --------- | --------------------------------: | ---------- | ---------------------- |
| HTTP      |                                80 | TCP        | Web 页面访问           |
| HTTPS     |                               443 | TCP / QUIC | 加密 Web 访问          |
| WebSocket |                          80 / 443 | TCP        | 双向实时通信           |
| SMTP      |                    25 / 465 / 587 | TCP        | 邮件发送和转发         |
| POP3      |                         110 / 995 | TCP        | 邮件接收               |
| IMAP      |                         143 / 993 | TCP        | 邮件接收和同步         |
| FTP       |                           20 / 21 | TCP        | 文件传输               |
| SSH       |                                22 | TCP        | 安全远程登录和文件传输 |
| Telnet    |                                23 | TCP        | 明文远程登录           |
| DNS       |                                53 | UDP / TCP  | 域名解析               |
| RTP       | 动态端口（偶数），RTCP 用相邻奇数 | UDP 为主   | 实时音视频传输         |

这里 HTTPS 写成 TCP / QUIC，是因为传统 HTTPS 通常基于 TLS over TCP，而 HTTP/3 场景下会基于 QUIC。

## 小结

这篇文章只做了常见应用层协议的快速梳理，没有展开到协议报文和具体实现细节。

复习时可以重点记住几个容易混淆的点：

- HTTP 是应用层协议，HTTP/1.1 和 HTTP/2 通常基于 TCP，HTTP/3 基于 QUIC。
- HTTP/1.1 通过 Keep-Alive 复用 TCP 连接，HTTP/2 在一个 TCP 连接上做多路复用，HTTP/3 基于 QUIC 缓解 TCP 队头阻塞。
- WebSocket 通过 HTTP 升级建立连接，之后支持双向通信。
- SMTP 负责邮件发送和服务器间转发，POP3/IMAP 负责用户收取邮件。
- SMTP 常见端口包括 25、587、465，分别对应服务器间转发、客户端提交和隐式 TLS 提交等场景。
- FTP 有主动模式和被动模式，实际生产环境中被动模式更常见。
- FTP、SFTP、FTPS 不是一回事，FTP 明文传输，SFTP 基于 SSH，FTPS 基于 TLS。
- Telnet 明文传输，不适合生产环境远程管理，实际更常用 SSH。
- DNS 通常基于 UDP，但响应过大、发生截断、区域传送等场景下也会使用 TCP。
- RTP 运行在 UDP 之上，按分层规则归入应用层，但职责更接近传输层；RTP 用偶数端口，配套 RTCP 用相邻奇数端口。

## 参考

- 《计算机网络：自顶向下方法》（第七版）
- RTP 协议介绍：<https://mthli.xyz/rtp-introduction/>
- RFC 6455：The WebSocket Protocol
- RFC 9110：HTTP Semantics
- RFC 8446：TLS 1.3
- RFC 9000：QUIC
- RFC 3550：RTP: A Transport Protocol for Real-Time Applications
- RFC 4571：Framing Real-time Transport Protocol（RTP） and RTP Control Protocol（RTCP） Packets over Connection-Oriented Transport
- RFC 6891：Extension Mechanisms for DNS (EDNS(0))

<!-- @include: @article-footer.snippet.md -->


---

<!-- source: 计算机网络/从输入 URL 到页面展示到底发生了什么？.md -->

---
title: 从输入 URL 到页面展示到底发生了什么？
description: 串联从输入 URL 到页面渲染的完整链路，涵盖 DNS、TCP、HTTP、TLS、ARP、数据封装与浏览器渲染，助力面试与实践理解。
category: 计算机基础
tag:
  - 计算机网络
head:
  - - meta
    - name: keywords
      content: 访问网页流程,DNS,TCP 建连,HTTP 请求,TLS 握手,ARP,资源加载,浏览器渲染,关闭连接
---

在浏览器地址栏输入 URL 到页面展示，背后会串起 DNS、TCP、TLS、HTTP、ARP、数据封装与浏览器渲染等多个环节。

这道题经常被用来考察计网整体理解，因为它能把应用层、传输层、网络层和链路层的知识点都串起来。只背单个协议容易断片，按访问网页的全过程走一遍，会清楚很多。

这篇文章主要回答几个问题：

1. 输入 URL 后，浏览器会先做哪些本地处理？
2. DNS 解析域名的过程是怎样的？
3. TCP 连接如何建立？如果用了 HTTPS，TLS 握手又做了什么？
4. HTTP 请求和响应的交互流程是什么？
5. 数据包从主机到服务器，经过了哪些层的封装和转发？
6. 浏览器拿到 HTML 后，如何继续加载 CSS、JS、图片等资源并渲染页面？
7. 页面加载完成后，连接会如何复用或关闭？

总的来说，网络通信模型可以用下图来表示。访问网页的过程，就是数据从应用层逐层向下封装，经物理网络传输到对端，再逐层向上解封装的过程。

![五层网络模型在网页访问过程中的协作](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/five-layers.png)

开始之前，先简单过一遍完整流程：

1. **浏览器解析 URL 并检查缓存**：浏览器解析 URL 的各组成部分，并检查 HTTP 缓存（强缓存、协商缓存）是否已有该资源的有效副本。
2. **DNS 解析**：浏览器通过 DNS 协议，获取域名对应的 IP 地址。
3. **建立传输连接**：HTTP/1.1 和 HTTP/2 通常先通过 TCP 三次握手建立连接；HTTP/3 则建立基于 UDP 的 QUIC 连接。
4. **建立安全通道（HTTPS）**：HTTP/1.1 和 HTTP/2 通常在 TCP 建连后进行 TLS 握手；HTTP/3 在 QUIC 建连过程中集成 TLS 1.3，完成密钥协商和服务器身份验证。
5. **发送 HTTP 请求**：浏览器在连接上向服务器发送 HTTP 请求报文，请求获取网页内容。
6. **服务器处理并返回响应**：服务器收到请求后处理并返回 HTTP 响应报文。
7. **浏览器解析与渲染**：浏览器解析 HTML、CSS，执行 JavaScript，并加载页面中引用的其他资源（图片、字体等）。
8. **连接管理**：页面加载完成后，连接根据 keep-alive 策略复用或关闭。

下面按这个流程逐一展开。

## 第一步：解析 URL 与检查缓存

打开浏览器，在地址栏输入 URL 并回车。浏览器做的第一件事不是发请求，而是解析 URL 并检查是否可以直接使用本地缓存。

### URL 是什么

URL（Uniform Resource Locator，统一资源定位符）是互联网上资源的唯一地址。网络上的每个可访问资源都对应一个 URL，理论上文件和 URL 一一对应。实际上也有例外，比如重定向或 CDN 场景下，多个 URL 可能指向同一份资源。

### URL 的组成结构

![URL的组成结构](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/URL-parts.png)

一个完整的 URL 由以下几部分组成：

1. **协议**（Scheme）：URL 的前缀表示采用的协议，最常见的是 `http` 和 `https`，也有文件传输的 `ftp:` 等。
2. **域名**（Host）：访问目标的通用名，也可以直接使用 IP 地址。域名本质上是 IP 地址的可读版本。
3. **端口**（Port）：紧跟域名后面，用冒号隔开。HTTP 默认 80，HTTPS 默认 443，如果使用默认端口可以省略。
4. **资源路径**（Path）：从第一个 `/` 开始，表示服务器上的资源位置。早期设计中路径对应服务器上的物理文件，现在通常是后端路由映射的虚拟路径。
5. **查询参数**（Query）：`?` 之后的部分，采用 `key=value` 键值对形式，多个参数用 `&` 隔开。服务器解析请求时会提取这些参数。
6. **锚点**（Fragment）：`#` 之后的部分，用于定位到页面内的某个位置。锚点**不会**作为请求的一部分发送给服务端，仅由浏览器本地处理。

### 浏览器缓存检查

解析完 URL 之后，浏览器会先检查 HTTP 缓存，看是否已经有该资源的有效副本：

1. **强缓存**：检查 `Cache-Control`（如 `max-age`）或 `Expires` 头，判断缓存是否仍在有效期内。如果有效，直接使用缓存，跳过后续所有网络请求。
2. **协商缓存**：强缓存未命中时，浏览器向服务器发送验证请求（携带 `If-Modified-Since` 或 `If-None-Match`），服务器判断资源是否变化。如果未变化，返回 `304 Not Modified`，浏览器继续使用本地缓存；如果已变化，返回 `200 OK` 和新资源。

HTTP 缓存命中时，整个访问过程在此结束，无需发起网络请求。

### 域名解析准备

如果 HTTP 缓存未命中，浏览器需要向服务器发起网络请求，首先要拿到域名对应的 IP 地址。在正式发起 DNS 查询之前，浏览器还会依次检查：

1. **浏览器 DNS 缓存**：浏览器自身维护了一份 DNS 缓存，先看有没有该域名的记录。
2. **操作系统 DNS 缓存**：浏览器缓存未命中时，查询操作系统的 DNS 缓存。
3. **hosts 文件**：操作系统会检查本地 `hosts` 文件，看是否有域名到 IP 地址的直接映射。如果有，直接使用该 IP 地址，跳过 DNS 解析。

如果以上都没有命中，浏览器就需要发起完整的 DNS 查询。

## 第二步：DNS 解析

DNS（Domain Name System，域名系统）要解决的是**域名和 IP 地址的映射问题**。域名只是便于人类记忆的名字，网络通信真正需要的是 IP 地址。

### DNS 解析过程

浏览器拿到域名后，DNS 解析通常按以下步骤进行：

1. **浏览器 DNS 缓存**：浏览器自身维护了一份 DNS 缓存，先检查缓存中是否有该域名的记录且未过期。
2. **操作系统 DNS 缓存**：浏览器缓存未命中时，向操作系统发起 DNS 查询请求。操作系统也有自己的 DNS 缓存。
3. **本地 DNS 服务器**：操作系统配置的本地 DNS 服务器（通常由 ISP 提供，或使用公共 DNS 如 `8.8.8.8`、`114.114.114.114`）。本地 DNS 服务器如果有缓存且未过期，直接返回结果。
4. **递归/迭代查询**：本地 DNS 服务器缓存未命中时，它会代替客户端发起迭代查询——先问根 DNS 服务器，再问顶级域 DNS 服务器（如 `.com`），最后问权威 DNS 服务器，逐级获取目标 IP 地址。
5. **返回结果并缓存**：本地 DNS 服务器拿到最终结果后返回给客户端，同时在本地缓存一份，供后续查询使用。

下图展示了一个典型的 DNS 迭代查询过程：

![DNS 解析流程](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/DNS-process.png)

实际场景中，本地 DNS 服务器通常已经缓存了大量 TLD 服务器地址，多数查询不需要从根服务器开始，跳过根服务器直接查 TLD 的情况非常普遍。

> 关于 DNS 的更多细节（DNS 服务器层级、递归/迭代查询的区别、DNS 记录类型、为什么通常用 UDP 等），可以参考 [DNS 域名系统详解（应用层）](https://javaguide.cn/计算机基础/计算机网络/dns.html) 这篇文章。

## 第三步：建立传输连接

拿到目标服务器的 IP 地址后，浏览器需要与服务器建立传输连接。下面先介绍 HTTP/1.1 和 HTTP/2 常用的 TCP 连接；如果协商使用 HTTP/3，则会改为建立 QUIC 连接，QUIC 构建在 UDP 之上。

### TCP 三次握手

TCP 三次握手的目的是**同步双方的初始序列号**，并**确认双方的收发路径是可用的**。

![TCP 三次握手图解](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-shakes-hands-three-times.png)

1. **第一次握手（SYN）**：客户端发送 SYN 报文段，携带自己的初始序列号 `seq=x`，进入 `SYN_SENT` 状态。
2. **第二次握手（SYN+ACK）**：服务端收到后回复 SYN+ACK，携带自己的初始序列号 `seq=y`，确认号 `ack=x+1`，进入 `SYN_RCVD` 状态。
3. **第三次握手（ACK）**：客户端收到后发送 ACK，确认号 `ack=y+1`，双方进入 `ESTABLISHED` 状态，连接建立完成。

三次握手的设计不是为了「多走一次」，而是让双方都能确认：对方能收到自己的数据，自己也能收到对方的数据。两次握手做不到这一点——服务端在第二次握手后，还不知道客户端是否收到了自己的 SYN+ACK。

> 关于三次握手的详细分析、半连接队列/全连接队列、SYN Flood 防护等内容，可以参考 [TCP 三次握手和四次挥手（传输层）](https://javaguide.cn/计算机基础/计算机网络/tcp-connection-and-disconnection.html)。

### 如果是 HTTPS：TLS 握手

如果使用基于 TCP 的 HTTPS，TCP 连接建立之后还要进行 TLS 握手。HTTP/3 则在 QUIC 建连过程中集成 TLS 1.3。TLS 的核心目标是三个：**加密**（防窃听）、**认证**（防冒充）、**完整性校验**（防篡改）。

TLS 握手大致流程（以 TLS 1.2 RSA 密钥交换为例）：

1. **Client Hello**：客户端发送支持的 TLS 版本、加密套件列表和一个随机数。
2. **Server Hello**：服务端从中选择一个加密套件，返回自己的证书、另一个随机数。
3. **密钥交换**：客户端验证服务端证书的合法性（通过 CA 签名验证），然后生成预主密钥（Pre-Master Secret），用服务端公钥加密后发送给服务端。双方根据预主密钥和之前交换的两个随机数，计算出对称加密的会话密钥。
4. **完成**：双方用会话密钥加密通信，握手结束。

需要注意的是，上述流程描述的是 TLS 1.2 中基于 RSA 的密钥交换方式。现代 HTTPS 通常采用 ECDHE 密钥交换，TLS 1.3 也可以在会话恢复等场景使用 PSK 或 PSK+(EC)DHE。ECDHE 的共享秘密由双方通过临时密钥协商得到，不会直接在网络上传输；只获得服务器证书私钥，通常无法解密此前使用临时密钥协商的历史会话。TLS 1.3 进一步简化了握手流程，将完整握手通常压缩到 1-RTT，并移除了静态 RSA 密钥交换。

TLS 握手完成后，后续的 HTTP 请求和响应都会使用协商好的对称密钥进行加密传输。HTTPS 的安全性来自 TLS 层，而不是 HTTP 协议本身的改变。

> 关于 TLS 的加密原理（非对称加密、对称加密、数字签名、CA 证书）的详细分析，可以参考 [HTTP vs HTTPS（应用层）](https://javaguide.cn/计算机基础/计算机网络/http-vs-https.html)。关于 RSA 和 ECDHE 两种密钥交换方式的区别，可以参考 [HTTPS RSA vs ECDHE 握手过程](https://javaguide.cn/计算机基础/计算机网络/https-rsa-vs-ecdhe.html)。

## 第四步：发送 HTTP 请求

TCP 连接（以及可能的 TLS 通道）建立好之后，浏览器就可以发送 HTTP 请求了。

### HTTP 请求报文结构

一个典型的 HTTP/1.1 请求报文如下：

```http
GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)
Accept: text/html,application/xhtml+xml
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
Connection: keep-alive
Cookie: session_id=abc123
```

各部分含义：

- **请求行**：`GET /index.html HTTP/1.1` —— 请求方法（GET）、资源路径（`/index.html`）、协议版本（HTTP/1.1）。
- **Host 头**：指定目标主机名。这是 HTTP/1.1 的强制要求，因为同一台服务器（同一个 IP）可能通过虚拟主机托管多个网站。
- **其他请求头**：`User-Agent`（客户端信息）、`Accept`（可接受的响应类型）、`Accept-Encoding`（支持的压缩方式）、`Cookie`（携带的状态信息）等。

### 服务器处理请求

服务器收到请求后，经过一系列处理生成响应：

1. **接收请求**：Web 服务器（如 Nginx、Tomcat）接收并解析 HTTP 请求报文。
2. **路由分发**：根据 URL 路径将请求路由到对应的后端处理逻辑（Controller、Servlet 等）。
3. **业务处理**：执行具体的业务逻辑，可能涉及数据库查询、缓存读取、调用其他服务等。
4. **构建响应**：将处理结果封装成 HTTP 响应报文。

### HTTP 响应报文结构

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Encoding: gzip
Content-Length: 1256
Cache-Control: max-age=3600
Set-Cookie: session_id=xyz789; Path=/

<!DOCTYPE html>
<html>
...
</html>
```

各部分含义：

- **状态行**：`HTTP/1.1 200 OK` —— 协议版本、状态码（200）、状态描述。
- **响应头**：`Content-Type`（响应体类型）、`Content-Encoding`（压缩方式）、`Cache-Control`（缓存策略）、`Set-Cookie`（设置 Cookie）等。
- **响应体**：请求的实际内容，如 HTML 文档、JSON 数据、图片二进制数据等。

常见的状态码：

| 状态码 | 类别       | 常见示例                                      |
| ------ | ---------- | --------------------------------------------- |
| 2xx    | 成功       | 200 OK、206 Partial Content                   |
| 3xx    | 重定向     | 301 永久重定向、302 临时重定向、304 未修改    |
| 4xx    | 客户端错误 | 400 Bad Request、403 Forbidden、404 Not Found |
| 5xx    | 服务端错误 | 500 Internal Server Error、502 Bad Gateway    |

> 关于 HTTP 常见状态码的详细总结，可以参考 [HTTP 常见状态码总结（应用层）](https://javaguide.cn/计算机基础/计算机网络/http-status-codes.html)。

## 第五步：数据包的封装与转发

HTTP 请求从浏览器发出后，数据并不是直接「飞」到服务器的。它需要经过协议栈的逐层封装，在物理网络上一跳一跳地转发到目的地。

### 数据封装过程

应用层的 HTTP 报文，经过传输层、网络层、链路层的逐层封装，最终变成能在物理介质上传输的比特流：

![TCP/IP 各层协议概览](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/network-protocol-overview.png)

每一层只关心自己要添加的头部信息，并使用下层提供的服务来传输数据：

- **传输层（TCP）**：添加源端口和目的端口，用序列号和确认号保证可靠传输。
- **网络层（IP）**：添加源 IP 和目的 IP，负责寻址和路由，决定数据包从源到目的经过的路径。
- **链路层**：添加源 MAC 和目的 MAC 地址，负责在相邻节点之间传输数据帧。

### 网络层的路由转发

数据包从源主机到目的主机，通常需要经过多个路由器中转。网络层的核心功能就是**路由与转发**：

- **路由**：确定分组从源到目的经过的路径（由路由协议如 OSPF、BGP 等计算）。
- **转发**：将分组从路由器的输入端口转移到合适的输出端口。

每个路由器维护一张路由表，根据目的 IP 地址查表决定下一跳。数据包在网络中就像快递包裹，每一站只看「下一站发到哪里」，不用关心全程路径。

### ARP 协议：从 IP 地址到 MAC 地址

数据帧在链路层传输时，需要知道下一跳设备的 MAC 地址，而不能只用 IP 地址。ARP（Address Resolution Protocol，地址解析协议）就是解决「已知 IP 地址，如何获取对应 MAC 地址」的问题。

ARP 的工作方式是**广播问询、单播响应**：

1. 主机先查本地 ARP 缓存表，看是否已有目标 IP 对应的 MAC 地址。
2. 缓存未命中时，在局域网内广播一个 ARP 请求：「谁的 IP 是 xxx.xxx.xxx.xxx？请告诉我你的 MAC 地址。」
3. 目标设备（或路由器接口）收到后，以单播方式回复自己的 MAC 地址。
4. 请求方收到响应后，将 IP-MAC 映射存入 ARP 缓存表，后续通信直接使用。

如果目标主机不在同一子网，主机不需要知道最终目标的 MAC 地址，只需要知道**本地网关（路由器）的 MAC 地址**即可。数据包先发给网关，网关再逐跳转发到目标网络。

> 关于 ARP 的详细工作原理（同子网/跨子网寻址、ARP 表、常见攻击），可以参考 [ARP 协议详解（网络层）](https://javaguide.cn/计算机基础/计算机网络/arp.html)。

### 网络地址转换（NAT）

在大多数家庭和企业网络中，内网主机使用的是私有 IP 地址（如 `192.168.x.x`），不能直接在公网上路由。NAT（Network Address Translation）协议负责在内网和公网之间转换 IP 地址。

当内网主机发送数据包到公网时，NAT 设备（通常是路由器）会将源 IP 地址从私有地址替换为公网地址，并记录端口映射关系。响应数据包返回时，NAT 再根据映射表把目的地址转换回内网主机的私有地址。

## 第六步：浏览器解析与渲染

服务器返回 HTML 响应后，浏览器的工作才真正开始。浏览器需要解析 HTML、构建 DOM 树、加载子资源、计算样式、布局并最终渲染到屏幕上。

### HTML 解析与 DOM 构建

浏览器拿到 HTML 文档后，从上到下逐行解析：

1. **构建 DOM 树**：解析 HTML 标签，生成文档对象模型（DOM）树，表示页面的结构。
2. **构建 CSSOM 树**：遇到 `<link>` 引用的 CSS 文件或 `<style>` 标签时，下载并解析 CSS，生成 CSS 对象模型（CSSOM）树，表示页面的样式规则。
3. **构建渲染树**：将 DOM 树和 CSSOM 树合并，生成渲染树。渲染树只包含需要显示的节点及其样式信息（`display: none` 的元素不会出现在渲染树中）。
4. **布局（Layout）**：计算渲染树中每个节点的位置和大小。
5. **绘制（Paint）**：将布局后的渲染树转换为屏幕上的像素。
6. **合成（Composite）**：将不同图层合成最终画面显示在屏幕上。

### 子资源加载

HTML 文档通常会引用大量外部资源：

- **CSS 文件**（`<link rel="stylesheet">`）：普通阻塞样式表会阻塞渲染，浏览器通常会等 CSS 加载并解析完成后才进行布局和绘制，因为 CSS 可能改变元素的布局。通过 `media` 属性、动态加载或 `preload` 等方式可以改变这一行为。
- **JavaScript 文件**（`<script>`）：默认会阻塞 HTML 解析，因为 JavaScript 可能修改 DOM。可以通过 `async` 或 `defer` 属性改变加载行为。
- **图片、字体等**：不会阻塞 HTML 解析，但需要在加载完成后才能显示。

这些子资源的加载会触发额外的 HTTP 请求。如果使用 HTTP/1.1，浏览器通常会对同一域名维护最多 6 个并发 TCP 连接来并行下载资源。HTTP/2 的多路复用机制则允许在同一个 TCP 连接上并行传输多个资源。

### JavaScript 执行

JavaScript 的执行会阻塞 HTML 解析。浏览器遇到 `<script>` 标签时，会暂停 DOM 构建，先下载并执行脚本。如果脚本中有 DOM 操作，可能会触发 DOM 重构和页面重排（Reflow）或重绘（Repaint）。

现代前端开发中常用的优化手段包括：

- 将 `<script>` 放在 `<body>` 底部或使用 `defer` 属性，避免阻塞 DOM 解析。
- 使用 `async` 属性异步加载不影响 DOM 的脚本。
- 通过 CDN 加速静态资源加载。
- 利用浏览器缓存减少重复请求。

## 第七步：连接管理

页面和资源加载完成后，连接通常不会立刻断开，如何管理连接取决于 HTTP 版本和配置。下面的 HTTP/1.0、HTTP/1.1 和 HTTP/2 主要讨论 TCP 连接；HTTP/3 管理的是 QUIC 连接和流。

### HTTP/1.0 短连接

HTTP/1.0 默认使用短连接：每次请求-响应完成后就关闭 TCP 连接。如果页面引用了 10 个外部资源，浏览器需要建立 10 次独立的 TCP 连接，每次都要经历三次握手和四次挥手，大量时间花在连接的建立和释放上。

### HTTP/1.1 长连接（Keep-Alive）

HTTP/1.1 默认使用长连接（Connection: keep-alive）。一个 TCP 连接建立后可以连续发送多个请求和接收多个响应，不需要每次都重新握手。这样页面中的 CSS、JS、图片等子资源可以复用同一个 TCP 连接来加载。

长连接不是永久的。服务器通常配置了空闲超时时间（如 Apache 的 `KeepAliveTimeout`），如果在超时时间内没有新的请求，服务器才会主动关闭连接。

### HTTP/2 多路复用

HTTP/2 在长连接的基础上引入了多路复用。同一个 TCP 连接上可以同时传输多个请求和响应，数据被拆分成更小的帧并通过流（Stream）标识来区分归属。这解决了 HTTP/1.1 在应用层面的队头阻塞问题——前面的慢请求不会挡住后面的请求。需要注意的是，HTTP/2 仍然基于 TCP，当 TCP 层发生丢包时，同一连接上的所有流都会受影响（TCP 层队头阻塞）。HTTP/3 基于 QUIC 协议（UDP），才进一步缓解了这个问题。

### 连接关闭

当连接确实需要关闭时（主动关闭方发起）：

1. 主动关闭方发送 FIN，表示自己没有数据要发了。
2. 被动关闭方回复 ACK，进入 `CLOSE_WAIT` 状态，但还可以继续发送剩余数据。
3. 被动关闭方数据发完后也发送 FIN。
4. 主动关闭方回复最终 ACK，进入 `TIME_WAIT` 状态，等待 2MSL 后彻底关闭。

`TIME_WAIT` 状态的存在是为了确保最后的 ACK 能到达对端，同时让网络中残留的旧报文消散，避免干扰后续新连接。

> 关于 TCP 四次挥手、TIME_WAIT 的影响、CLOSE_WAIT 堆积排查等内容，可以参考 [TCP 三次握手和四次挥手（传输层）](https://javaguide.cn/计算机基础/计算机网络/tcp-connection-and-disconnection.html)。

## 完整流程总结

把上面的步骤串起来，完整的访问流程可以概括为：

1. **输入 URL** → 浏览器解析 URL 各部分，检查 HTTP 缓存；如需网络请求，再检查 hosts 文件。
2. **DNS 解析** → 依次查询浏览器缓存、操作系统缓存、本地 DNS 服务器，必要时经根 → TLD → 权威服务器迭代查询，获取目标 IP 地址。
3. **建立传输连接** → HTTP/1.1 和 HTTP/2 通常建立 TCP 连接；HTTP/3 建立 QUIC 连接。
4. **建立安全通道（HTTPS）** → 基于 TCP 的 HTTPS 继续进行 TLS 握手；HTTP/3 在 QUIC 建连过程中完成 TLS 1.3 握手。
5. **HTTP 请求与响应** → 浏览器发送请求，服务器处理并返回 HTML 响应。
6. **数据封装与转发** → 请求报文经 TCP → IP → 链路层逐层封装，通过路由器、交换机等中间设备一跳一跳转发到服务器；响应沿反方向回到浏览器。
7. **浏览器渲染** → 解析 HTML 构建 DOM 树，加载 CSS/JS/图片等子资源，构建渲染树，布局并绘制页面。
8. **连接管理** → 根据 HTTP 版本和配置复用或关闭 TCP 连接。

访问一个网页看似简单，实际上串起了计算机网络几乎所有的核心协议。按这个流程去理解，DNS、TCP、TLS、HTTP、IP、ARP 这些协议就不再是孤立的知识点，而是一条完整链路上的不同环节。

## 参考

1. 《计算机网络（第 7 版）》
2. 《图解 HTTP》
3. [What really happens when you navigate to a URL](https://stackoverflow.com/questions/2092527/what-really-happens-when-you-navigate-to-a-url)
4. [How browsers work](https://web.dev/howbrowserswork/)

<!-- @include: @article-footer.snippet.md -->


---

<!-- source: 计算机网络/计算机网络常见面试题总结（上）.md -->

---
title: 计算机网络常见面试题总结（上）
description: 汇总计算机网络常见面试题（上），覆盖网络分层、HTTP 各版本、HTTPS、DNS、WebSocket、SSE 与 PING 等基础知识。
category: 计算机基础
tag:
  - 计算机网络
head:
  - - meta
    - name: keywords
      content: 计算机网络面试题,TCP/IP四层模型,HTTP面试,HTTPS vs HTTP,HTTP/1.1 vs HTTP/2,HTTP/3 QUIC,TCP三次握手,UDP区别,DNS解析,WebSocket vs SSE,GET vs POST,应用层协议,网络分层,队头阻塞,PING命令,ARP协议
---

<!-- markdownlint-disable MD033 -->

计算机网络是后端面试和校招面试中绕不开的高频考点，尤其是 **TCP/IP 网络分层、HTTP、HTTPS、DNS、WebSocket、TCP 三次握手** 这些问题，几乎贯穿了“从输入 URL 到页面展示”“接口为什么变慢”“连接为什么失败”等真实开发场景。

这篇《计算机网络常见面试题总结（上）》会先从网络分层模型讲起，再梳理应用层和 HTTP 相关的核心知识点，适合用来系统复习计算机网络基础，也适合作为 Java 后端、后端开发、计算机基础面试前的速查清单。

## 计算机网络基础

### 网络分层模型

#### OSI 七层模型是什么？每一层的作用是什么？

**OSI 七层模型** 是国际标准化组织提出的一个网络分层模型，其大体结构以及每一层提供的功能如下图所示：

![OSI 七层模型各层功能划分](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/osi-7-model.png)

每一层都专注做一件事情，并且每一层都需要使用下一层提供的功能比如传输层需要使用网络层提供的路由和寻址功能，这样传输层才知道把数据传输到哪里去。

**OSI 的七层体系结构概念清楚，理论也很完整，但是它比较复杂而且不实用，而且有些功能在多个层中重复出现。**

上面这种图可能比较抽象，再来一个比较生动的图片。下面这个图片是我在国外的一个网站上看到的，非常赞！

![osi七层模型2](https://oss.javaguide.cn/github/javaguide/osi七层模型2.png)

#### ⭐️ TCP/IP 四层模型是什么？每一层的作用是什么？

**TCP/IP 四层模型** 是目前被广泛采用的一种模型，我们可以将 TCP/IP 模型看作是 OSI 七层模型的精简版本，由以下 4 层组成：

1. 应用层
2. 传输层
3. 网络层
4. 网络接口层

需要注意的是，我们并不能将 TCP/IP 四层模型 和 OSI 七层模型完全精确地匹配起来，不过可以简单将两者对应起来，如下图所示：

![TCP/IP 四层模型与 OSI 模型的对应关系](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-ip-4-model.png)

关于每一层作用的详细介绍，请看 [OSI 和 TCP/IP 网络分层模型详解（基础）](https://javaguide.cn/计算机基础/计算机网络/osi-and-tcp-ip-model.html) 这篇文章。

#### 为什么网络要分层？

说到分层，我们先从我们平时使用框架开发一个后台程序来说，我们往往会按照每一层做不同的事情的原则将系统分为三层（复杂的系统分层会更多）:

1. Repository（数据库操作）
2. Service（业务操作）
3. Controller（前后端数据交互）

**复杂的系统需要分层，因为每一层都需要专注于一类事情。网络分层的原因也是一样，每一层只专注于做一类事情。**

好了，再来说回：“为什么网络要分层？”。我觉得主要有 3 方面的原因：

1. **各层之间相互独立**：各层之间相互独立，各层之间不需要关心其他层是如何实现的，只需要知道自己如何调用下层提供好的功能就可以了（可以简单理解为接口调用）**。这个和我们对开发时系统进行分层是一个道理。**
2. **提高了灵活性和可替换性**：每一层都可以使用最适合的技术来实现，你只需要保证你提供的功能以及暴露的接口的规则没有改变就行了。并且，每一层都可以根据需要进行修改或替换，而不会影响到整个网络的结构。**这个和我们平时开发系统的时候要求的高内聚、低耦合的原则也是可以对应上的。**
3. **大问题化小**：分层可以将复杂的网络问题分解为许多比较小的、界线比较清晰简单的小问题来处理和解决。这样使得复杂的计算机网络系统变得易于设计，实现和标准化。 **这个和我们平时开发的时候，一般会将系统功能分解，然后将复杂的问题分解为容易理解的更小的问题是相对应的，这些较小的问题具有更好的边界（目标和接口）定义。**

我想到了计算机世界非常非常有名的一句话，这里分享一下：

> 计算机科学领域的任何问题都可以通过增加一个间接的中间层来解决，计算机整个体系从上到下都是按照严格的层次结构设计的。

### 常见网络协议

#### ⭐️ 应用层有哪些常见的协议？

![应用层常见协议](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/application-layer-protocol.png)

- **HTTP（Hypertext Transfer Protocol，超文本传输协议）**：是一种用于传输超文本和多媒体内容的应用层协议，主要为 Web 客户端与服务器之间的通信而设计。HTTP/1.x 和 HTTP/2 通常基于 TCP，HTTP/3 则运行在基于 UDP 的 QUIC 之上。
- **SMTP（Simple Mail Transfer Protocol，简单邮件发送协议）**：基于 TCP 协议，是一种用于发送电子邮件的协议。注意 ⚠️：SMTP 协议只负责邮件的发送，而不是接收。要从邮件服务器接收邮件，需要使用 POP3 或 IMAP 协议。
- **POP3/IMAP（邮件接收协议）**：基于 TCP 协议，两者都是负责邮件接收的协议。IMAP 协议是比 POP3 更新的协议，它在功能和性能上都更加强大。IMAP 支持邮件搜索、标记、分类、归档等高级功能，而且可以在多个设备之间同步邮件状态。几乎所有现代电子邮件客户端和服务器都支持 IMAP。
- **FTP（File Transfer Protocol，文件传输协议）**：基于 TCP 协议，是一种用于在计算机之间传输文件的协议，可以屏蔽操作系统和文件存储方式。注意 ⚠️：FTP 是一种不安全的协议，因为它在传输过程中不会对数据进行加密。建议在传输敏感数据时使用更安全的协议，如 SFTP。
- **Telnet（远程登陆协议）**：基于 TCP 协议，用于通过一个终端登陆到其他服务器。Telnet 协议的最大缺点之一是所有数据（包括用户名和密码）均以明文形式发送，这有潜在的安全风险。这就是为什么如今很少使用 Telnet，而是使用一种称为 SSH 的非常安全的网络传输协议的主要原因。
- **SSH（Secure Shell Protocol，安全的网络传输协议）**：基于 TCP 协议，通过加密和认证机制实现安全的访问和文件传输等业务
- **RTP（Real-time Transport Protocol，实时传输协议）**：通常基于 UDP 协议，但也支持 TCP 协议。它提供了端到端的实时传输数据的功能，但不包含资源预留存、不保证实时传输质量，这些功能由 WebRTC 实现。
- **DNS（Domain Name System，域名管理系统）**：通常基于 UDP 协议（端口 53），用于解决域名和 IP 地址的映射问题。当响应数据过大或进行区域传送时会改用 TCP。

关于这些协议的详细介绍请看 [应用层常见协议总结（应用层）](./常见应用层协议总结-HTTP、WebSocket、SMTP、FTP、SSH、DNS 等.md) 这篇文章。

#### 传输层有哪些常见的协议？

![传输层常见协议](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/transport-layer-protocol.png)

- **TCP（Transmission Control Protocol，传输控制协议）**：提供 **面向连接** 的，**可靠** 的数据传输服务。
- **UDP（User Datagram Protocol，用户数据协议）**：提供 **无连接** 的，**尽最大努力** 的数据传输服务（不保证数据传输的可靠性），简单高效。

#### 网络层有哪些常见的协议？

![网络层常见协议](./images/network-model/nerwork-layer-protocol.png)

- **IP（Internet Protocol，网际协议）**：TCP/IP 协议中最重要的协议之一，属于网络层的协议，主要作用是定义数据包的格式、对数据包进行路由和寻址，以便它们可以跨网络传播并到达正确的目的地。目前 IP 协议主要分为两种，一种是过去的 IPv4，另一种是较新的 IPv6，目前这两种协议都在使用，但后者已经被提议来取代前者。
- **ARP（Address Resolution Protocol，地址解析协议）**：ARP 协议解决的是网络层地址和链路层地址之间的转换问题。因为一个 IP 数据报在物理上传输的过程中，总是需要知道下一跳（物理上的下一个目的地）该去往何处，但 IP 地址属于逻辑地址，而 MAC 地址才是物理地址，ARP 协议解决了 IP 地址转 MAC 地址的一些问题。
- **ICMP（Internet Control Message Protocol，互联网控制报文协议）**：一种用于传输网络状态和错误消息的协议，常用于网络诊断和故障排除。例如，Ping 工具就使用了 ICMP 协议来测试网络连通性。
- **NAT（Network Address Translation，网络地址转换协议）**：NAT 协议的应用场景如同它的名称——网络地址转换，应用于内部网到外部网的地址转换过程中。具体地说，在一个小的子网（局域网，LAN）内，各主机使用的是同一个 LAN 下的 IP 地址，但在该 LAN 以外，在广域网（WAN）中，需要一个统一的 IP 地址来标识该 LAN 在整个 Internet 上的位置。
- **OSPF（Open Shortest Path First，开放式最短路径优先）**：一种内部网关协议（Interior Gateway Protocol，IGP），也是广泛使用的一种动态路由协议，基于链路状态算法，考虑了链路的带宽、延迟等因素来选择最佳路径。
- **RIP（Routing Information Protocol，路由信息协议）**：一种内部网关协议（Interior Gateway Protocol，IGP），也是一种动态路由协议，基于距离向量算法，使用固定的跳数作为度量标准，选择跳数最少的路径作为最佳路径。
- **BGP（Border Gateway Protocol，边界网关协议）**：一种用来在路由选择域之间交换网络层可达性信息（Network Layer Reachability Information，NLRI）的路由选择协议，具有高度的灵活性和可扩展性。

## HTTP

### ⭐️ 从输入 URL 到页面展示到底发生了什么？（非常重要）

> 类似的问题：打开一个网页，整个过程会使用哪些协议？

先来看一张图（来源于《图解 HTTP》）：

<img src="https://oss.javaguide.cn/github/javaguide/url%E8%BE%93%E5%85%A5%E5%88%B0%E5%B1%95%E7%A4%BA%E5%87%BA%E6%9D%A5%E7%9A%84%E8%BF%87%E7%A8%8B.jpg" alt="从输入 URL 到页面展示的完整流程" style="zoom:50%" />

上图有一个错误需要注意：是 OSPF 不是 OPSF。OSPF（Open Shortest Path First，ospf）开放最短路径优先协议，是由 Internet 工程任务组开发的路由选择协议

总体来说分为以下几个步骤:

1. 在浏览器中输入指定网页的 URL。
2. 浏览器通过 DNS 协议，获取域名对应的 IP 地址。
3. 浏览器根据 IP 地址和端口号，向目标服务器发起一个 TCP 连接请求。
4. 浏览器在 TCP 连接上，向服务器发送一个 HTTP 请求报文，请求获取网页的内容。
5. 服务器收到 HTTP 请求报文后，处理请求，并返回 HTTP 响应报文给浏览器。
6. 浏览器收到 HTTP 响应报文后，解析响应体中的 HTML 代码，渲染网页的结构和样式，同时根据 HTML 中的其他资源的 URL（如图片、CSS、JS 等），再次发起 HTTP 请求，获取这些资源的内容，直到网页完全加载显示。
7. 浏览器在不需要和服务器通信时，可以主动关闭 TCP 连接，或者等待服务器的关闭请求。

详细介绍可以查看这篇文章：[访问网页的全过程（知识串联）](https://javaguide.cn/计算机基础/计算机网络/the-whole-process-of-accessing-web-pages.html)（强烈推荐）。

### ⭐️ HTTP 状态码有哪些？

HTTP 状态码用于描述 HTTP 请求的结果，比如 2xx 就代表请求被成功处理。

![常见 HTTP 状态码](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/http-status-code.png)

关于 HTTP 状态码更详细的总结，可以看我写的这篇文章：[HTTP 常见状态码总结（应用层）](https://javaguide.cn/计算机基础/计算机网络/http-status-codes.html)。

### HTTP Header 中常见的字段有哪些？

| 请求头字段名        | 说明                                                                                                                                                                          | 示例                                                                             |
| :------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------- |
| Accept              | 能够接受的回应内容类型（Content-Types）。                                                                                                                                     | Accept: text/plain                                                               |
| Accept-Charset      | 能够接受的字符集                                                                                                                                                              | Accept-Charset: utf-8                                                            |
| Accept-Datetime     | 能够接受的按照时间来表示的版本                                                                                                                                                | Accept-Datetime: Thu, 31 May 2007 20:35:00 GMT                                   |
| Accept-Encoding     | 能够接受的编码方式列表。参考 HTTP 压缩。                                                                                                                                      | Accept-Encoding: gzip, deflate                                                   |
| Accept-Language     | 能够接受的回应内容的自然语言列表。                                                                                                                                            | Accept-Language: en-US                                                           |
| Authorization       | 用于超文本传输协议的认证的认证信息                                                                                                                                            | Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==                                |
| Cache-Control       | 用来指定在这次的请求/响应链中的所有缓存机制 都必须 遵守的指令                                                                                                                 | Cache-Control: no-cache                                                          |
| Connection          | 该浏览器想要优先使用的连接类型                                                                                                                                                | Connection: keep-alive                                                           |
| Content-Length      | 以八位字节数组（8 位的字节）表示的请求体的长度                                                                                                                                | Content-Length: 348                                                              |
| Content-MD5         | 请求体的内容的二进制 MD5 散列值，以 Base64 编码的结果                                                                                                                         | Content-MD5: Q2hlY2sgSW50ZWdyaXR5IQ==                                            |
| Content-Type        | 请求体的多媒体类型（用于 POST 和 PUT 请求中）                                                                                                                                 | Content-Type: application/x-www-form-urlencoded                                  |
| Cookie              | 之前由服务器通过 Set-Cookie（下文详述）发送的一个超文本传输协议 Cookie                                                                                                        | Cookie: $Version=1; Skin=new;                                                    |
| Date                | 发送该消息的日期和时间（按照 RFC 7231 中定义的“超文本传输协议日期”格式来发送）                                                                                                | Date: Tue, 15 Nov 1994 08:12:31 GMT                                              |
| Expect              | 表明客户端要求服务器做出特定的行为                                                                                                                                            | Expect: 100-continue                                                             |
| From                | 发起此请求的用户的邮件地址                                                                                                                                                    | From: `user@example.com`                                                         |
| Host                | 服务器的域名（用于虚拟主机），以及服务器所监听的传输控制协议端口号。如果所请求的端口是对应的服务的标准端口，则端口号可被省略。                                                | Host: en.wikipedia.org                                                           |
| If-Match            | 仅当客户端提供的实体与服务器上对应的实体相匹配时，才进行对应的操作。主要作用是用于像 PUT 这样的方法中，仅当从用户上次更新某个资源以来，该资源未被修改的情况下，才更新该资源。 | If-Match: "737060cd8c284d8af7ad3082f209582d"                                     |
| If-Modified-Since   | 允许服务器在请求的资源自指定的日期以来未被修改的情况下返回 `304 Not Modified` 状态码                                                                                          | If-Modified-Since: Sat, 29 Oct 1994 19:43:31 GMT                                 |
| If-None-Match       | 允许服务器在请求的资源的 ETag 未发生变化的情况下返回 `304 Not Modified` 状态码                                                                                                | If-None-Match: "737060cd8c284d8af7ad3082f209582d"                                |
| If-Range            | 如果该实体未被修改过，则向我发送我所缺少的那一个或多个部分；否则，发送整个新的实体                                                                                            | If-Range: "737060cd8c284d8af7ad3082f209582d"                                     |
| If-Unmodified-Since | 仅当该实体自某个特定时间以来未被修改的情况下，才发送回应。                                                                                                                    | If-Unmodified-Since: Sat, 29 Oct 1994 19:43:31 GMT                               |
| Max-Forwards        | 限制该消息可被代理及网关转发的次数。                                                                                                                                          | Max-Forwards: 10                                                                 |
| Origin              | 发起一个针对跨来源资源共享的请求。                                                                                                                                            | `Origin: http://www.example-social-network.com`                                  |
| Pragma              | 与具体的实现相关，这些字段可能在请求/回应链中的任何时候产生多种效果。                                                                                                         | Pragma: no-cache                                                                 |
| Proxy-Authorization | 用来向代理进行认证的认证信息。                                                                                                                                                | Proxy-Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==                          |
| Range               | 仅请求某个实体的一部分。字节偏移以 0 开始。参见字节服务。                                                                                                                     | Range: bytes=500-999                                                             |
| Referer             | 表示浏览器所访问的前一个页面，正是那个页面上的某个链接将浏览器带到了当前所请求的这个页面。                                                                                    | `Referer: http://en.wikipedia.org/wiki/Main_Page`                                |
| TE                  | 浏览器预期接受的传输编码方式：可使用回应协议头 Transfer-Encoding 字段中的值；                                                                                                 | TE: trailers, deflate                                                            |
| Upgrade             | 要求服务器升级到另一个协议。                                                                                                                                                  | Upgrade: HTTP/2.0, SHTTP/1.3, IRC/6.9, RTA/x11                                   |
| User-Agent          | 浏览器的浏览器身份标识字符串                                                                                                                                                  | User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:12.0) Gecko/20100101 Firefox/21.0 |
| Via                 | 向服务器告知，这个请求是由哪些代理发出的。                                                                                                                                    | Via: 1.0 fred, 1.1 example.com (Apache/1.1)                                      |
| Warning             | 一个一般性的警告，告知，在实体内容体中可能存在错误。                                                                                                                          | Warning: 199 Miscellaneous warning                                               |

### ⭐️ HTTP 和 HTTPS 有什么区别？（重要）

![HTTP 和 HTTPS 对比](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/http-vs-https.png)

- **端口号**：HTTP 默认是 80，HTTPS 默认是 443。
- **URL 前缀**：HTTP 的 URL 前缀是 `http://`，HTTPS 的 URL 前缀是 `https://`。
- **安全性和传输方式**：未使用 TLS 的 HTTP 默认不提供机密性、完整性和对端身份认证。HTTPS 使用 TLS 保护 HTTP；HTTP/1.1 和 HTTP/2 通常使用 TLS over TCP，HTTP/3 使用集成 TLS 1.3 的 QUIC。TLS 握手负责认证对端并建立流量密钥，后续数据由对称 AEAD 算法保护。证书主要用于身份认证，不能笼统地说“证书加密了对称密钥”。
- **SEO（搜索引擎优化）**：搜索引擎通常会更青睐使用 HTTPS 协议的网站，因为 HTTPS 能够提供更高的安全性和用户隐私保护。使用 HTTPS 协议的网站在搜索结果中可能会被优先显示，从而对 SEO 产生影响。

关于 HTTP 和 HTTPS 更详细的对比总结，可以看我写的这篇文章：[HTTP vs HTTPS（应用层）](https://javaguide.cn/计算机基础/计算机网络/http-vs-https.html)。

### HTTPS 握手里的 RSA 和 ECDHE，到底差在哪？（应用层）

RSA 和 ECDHE 的核心区别在于：**会话密钥材料是“传过去的”，还是“协商出来的”**。

在 TLS 1.2 的静态 RSA 握手里，客户端生成 `PreMasterSecret`，用服务器证书里的 RSA 公钥加密后发给服务端，服务端再用 RSA 私钥解密。问题是，如果攻击者保存了当年的握手流量，后来服务器私钥又泄漏，就可能回头解出历史会话密钥，所以它没有前向安全。

ECDHE 不直接传输共享秘密。客户端和服务端各自生成临时密钥对，交换临时公钥后，双方本地算出同一个共享秘密。服务器证书私钥主要用于签名认证，证明临时参数没被中间人替换，而不是用来解密会话密钥。

所以一句话总结：**RSA 是客户端把秘密加密送过去；ECDHE 是双方用临时密钥协商出秘密。ECDHE 支持前向安全，也因此成为现代 HTTPS 的主流方向。**

详细介绍：[HTTPS 握手里的 RSA 和 ECDHE，到底差在哪？（应用层）](./https-rsa-vs-ecdhe)

### ⭐️ 有了 HTTP，为什么还要 RPC？

HTTP 和 RPC 不是谁取代谁的关系，也不是谁更高级的问题。

HTTP 能调服务，RPC 也能调服务。真正的区别在于，你是想把远程调用当成一次“资源访问”，还是当成一次“方法调用”。

如果是对外接口，比如 Web、App、第三方系统接入，HTTP 通常更合适。它通用、好调试、接入成本低，别人拿 Postman、curl 就能测。  
如果是公司内部服务互调，尤其是服务多、调用链长、接口频繁调用，还要考虑服务发现、超时、重试、负载均衡、链路追踪这些问题，RPC 会更顺手一些。它不是单纯为了快，而是把内部服务调用里的很多麻烦事一起处理掉。

所以，别再简单背“HTTP 对外，RPC 对内”了。

这句话可以帮助入门，但真做项目时，还得看你的调用对象、团队基础设施、排查成本、性能要求和后续维护成本。

系统规模不大，用 HTTP 已经跑得很稳，就别为了“看起来更微服务”强上 RPC。

内部调用越来越复杂，HTTP SDK、网关、监控、重试这些东西越补越多，那就可以认真考虑 RPC。

一句话：**HTTP 没那么弱，RPC 也没那么神。选哪个，主要看它能不能用更低成本解决你现在的问题。**

详细介绍：[⭐️有了HTTP，为什么还要RPC？](./有了 HTTP 协议，为什么还要 RPC？HTTP 与 RPC 区别对比.md)

### HTTP/1.0 和 HTTP/1.1 有什么区别？

![HTTP/1.0 和 HTTP/1.1 对比](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/http1.0-vs-http1.1.png)

- **连接方式**：HTTP/1.0 为短连接，HTTP/1.1 支持长连接。HTTP 协议的长连接和短连接，实质上是 TCP 协议的长连接和短连接。
- **状态响应码**：HTTP/1.1 中新加入了大量的状态码，光是错误响应状态码就新增了 24 种。比如说，`100 (Continue)`——允许客户端在发送较大请求体前确认服务器愿意继续接收，`206 (Partial Content)`——范围请求的标识码，`409 (Conflict)`——请求与当前资源的规定冲突，`410 (Gone)`——目标资源已不再可用，这种状态很可能是永久的，并且服务器不知道可用的转发地址。
- **缓存机制**：在 HTTP/1.0 中主要使用 Header 里的 If-Modified-Since,Expires 来做为缓存判断的标准，HTTP/1.1 则引入了更多的缓存控制策略例如 Entity tag，If-Unmodified-Since, If-Match, If-None-Match 等更多可供选择的缓存头来控制缓存策略。
- **带宽**：HTTP/1.0 中，存在一些浪费带宽的现象，例如客户端只是需要某个对象的一部分，而服务器却将整个对象送过来了，并且不支持断点续传功能，HTTP/1.1 则在请求头引入了 range 头域，它允许只请求资源的某个部分，即返回码是 206（Partial Content），这样就方便了开发者自由的选择以便于充分利用带宽和连接。
- **Host 头（Host Header）处理**：HTTP/1.1 引入了 Host 头字段，允许在同一 IP 地址上托管多个域名，从而支持虚拟主机的功能。而 HTTP/1.0 没有 Host 头字段，无法实现虚拟主机。

关于 HTTP/1.0 和 HTTP/1.1 更详细的对比总结，可以看我写的这篇文章：[HTTP/1.0 vs HTTP/1.1（应用层）](https://javaguide.cn/计算机基础/计算机网络/http1.0-vs-http1.1.html)。

### ⭐️ HTTP/1.1 和 HTTP/2.0 有什么区别？

![HTTP/1.0 和 HTTP/1.1 对比](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/http1.1-vs-http2.0.png)

- **多路复用（Multiplexing）**：HTTP/2.0 在同一连接上可以同时传输多个请求和响应（可以看作是 HTTP/1.1 中长链接的升级版本），互不干扰。HTTP/1.1 则使用串行方式，每个请求和响应都需要独立的连接，而浏览器为了控制资源会有 6-8 个 TCP 连接的限制。这使得 HTTP/2.0 在处理多个请求时更加高效，减少了网络延迟和提高了性能。
- **二进制帧（Binary Frames）**：HTTP/2.0 使用二进制帧进行数据传输，而 HTTP/1.1 则使用文本格式的报文。二进制帧更加紧凑和高效，减少了传输的数据量和带宽消耗。
- **队头阻塞**：HTTP/2 引入了多路复用技术，允许多个请求和响应在单个 TCP 连接上并行交错传输，解决了 HTTP/1.1 应用层的队头阻塞问题，但 HTTP/2 依然受到 TCP 层队头阻塞的影响。
- **头部压缩（Header Compression）**：HTTP/1.1 支持 `Body` 压缩，`Header` 不支持压缩。HTTP/2.0 支持对 `Header` 压缩，使用了专门为 `Header` 压缩而设计的 HPACK 算法，减少了网络开销。
- **服务器推送（Server Push）**：HTTP/2.0 支持服务器推送，可以在客户端请求一个资源时，将其他相关资源一并推送给客户端，从而减少了客户端的请求次数和延迟。而 HTTP/1.1 需要客户端自己发送请求来获取相关资源。

HTTP/2.0 多路复用效果图（图源： [HTTP/2 For Web Developers](https://blog.cloudflare.com/http-2-for-web-developers/)）：

![HTTP/2 在单个 TCP 连接上多路复用多个请求和响应](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/http2.0-multiplexing.png)

可以看到，HTTP/2 的多路复用机制允许多个请求和响应共享一个 TCP 连接，从而避免了 HTTP/1.1 在应对并发请求时需要建立多个并行连接的情况，减少了重复连接建立和维护的额外开销。而在 HTTP/1.1 中，尽管支持持久连接，但为了缓解队头阻塞问题，浏览器通常会为同一域名建立多个并行连接。

### HTTP/2.0 和 HTTP/3.0 有什么区别？

![HTTP/2.0 和 HTTP/3.0 对比](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/http2.0-vs-http3.0.png)

- **传输协议**：HTTP/2 基于 TCP，HTTP/3 则把 HTTP 语义映射到 QUIC。QUIC 构建在 UDP 之上，在传输层实现可靠交付、拥塞控制、流量控制和 TLS 1.3 安全保护。
- **连接建立**：HTTP/2 的 HTTPS 连接需要先建立 TCP 连接，再完成 TLS 握手；HTTP/3 把传输参数协商和 TLS 1.3 握手结合在 QUIC 建连过程中。新的 QUIC 连接通常使用 1-RTT；0-RTT 只适用于客户端持有先前连接状态的恢复场景，而且早期数据存在重放风险。比较延迟时还要统一采用“何时可发送首个请求”或“何时收到首字节”等同一个指标。
- **头部压缩**：HTTP/2.0 使用 HPACK 算法进行头部压缩，而 HTTP/3.0 使用更高效的 QPACK 头压缩算法。
- **队头阻塞**：HTTP/2 的多个流复用同一个 TCP 连接，TCP 丢包会阻塞这条连接上的所有流。QUIC 在流之间提供独立的可靠有序交付；某个流的数据丢失后，该流会等待缺失数据恢复，但通常不会阻止其他流继续前进。
- **连接迁移**：QUIC 使用独立于 IP/端口四元组的 Connection ID 标识连接。Connection ID 不是固定 64 位：QUIC v1 可以使用零长度到 20 字节的 Connection ID，端点还可以签发和退役多个 Connection ID。网络地址变化后，端点可以验证新路径并维持同一逻辑连接。
- **错误恢复**：HTTP/3.0 具有更好的错误恢复机制，当出现丢包、延迟等网络问题时，可以更快地进行恢复和重传。而 HTTP/2.0 则需要依赖于 TCP 的错误恢复机制。
- **安全性**：HTTP/2 通常使用 TLS 保护 HTTP 头部和数据负载，但 IP、TCP 头以及 TLS 记录层的外部头字段仍然可见。QUIC 使用 TLS 派生的密钥保护报文载荷，并对包号和部分首字节字段做头部保护；IP/UDP 头和部分 QUIC 头字段仍然可见，Version Negotiation 等报文也不具备同样的密码学保护，因此不能说 QUIC 加密了整个数据包的全部报文头。

HTTP/1.0、HTTP/2.0 和 HTTP/3.0 的协议栈比较：

![HTTP/1、HTTP/2 和 HTTP/3 协议栈对比](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/http-3-implementation.png)

下图是一个更详细的 HTTP/2.0 和 HTTP/3.0 对比图：

![HTTP/2.0 和 HTTP/3.0 详细对比图](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/http2-and-http3-stacks-comparison.png)

从上图可以看出：

- **HTTP/2.0**：使用 TCP 作为传输协议、使用 HPACK 进行头部压缩、依赖 TLS 进行加密。
- **HTTP/3.0**：使用基于 UDP 的 QUIC 协议、使用更高效的 QPACK 进行头部压缩、在 QUIC 中直接集成了 TLS。QUIC 协议具备连接迁移、拥塞控制与避免、流量控制等特性。

关于 HTTP/1.0 -> HTTP/3.0 更详细的演进介绍，推荐阅读[HTTP1 到 HTTP3 的工程优化](https://dbwu.tech/posts/http_evolution/)。

### HTTP/1.1 和 HTTP/2.0 的队头阻塞有什么不同？

HTTP/1.1 队头阻塞的主要原因是无法多路复用：

- 在一个 TCP 连接中，资源的请求和响应是按顺序处理的。如果一个大的资源（如一个大文件）正在传输，后续的小资源（如较小的 CSS 文件）需要等待前面的资源传输完成后才能被发送。
- 如果浏览器需要同时加载多个资源（如多个 CSS、JS 文件等），它通常会开启多个并行的 TCP 连接（一般限制为 6 个）。但每个连接仍然受限于顺序的请求-响应机制，因此仍然会发生 **应用层的队头阻塞**。

虽然 HTTP/2.0 引入了多路复用技术，允许多个请求和响应在单个 TCP 连接上并行交错传输，解决了 **HTTP/1.1 应用层的队头阻塞问题**，但 HTTP/2.0 依然受到 **TCP 层队头阻塞** 的影响：

- HTTP/2.0 通过帧（frame）机制将每个资源分割成小块，并为每个资源分配唯一的流 ID，这样多个资源的数据可以在同一 TCP 连接中交错传输。
- TCP 作为传输层协议，要求数据按顺序交付。如果某个数据包在传输过程中丢失，即使后续的数据包已经到达，也必须等待丢失的数据包重传后才能继续处理。这种传输层的顺序性导致了 **TCP 层的队头阻塞**。
- 举例来说，如果 HTTP/2 的一个 TCP 数据包中携带了多个资源的数据（例如 JS 和 CSS），而该数据包丢失了，那么后续数据包中的所有资源数据都需要等待丢失的数据包重传回来，导致所有流（streams）都被阻塞。

最后，来一张表格总结补充一下：

| **方面**       | **HTTP/1.1 的队头阻塞**                  | **HTTP/2.0 的队头阻塞**                                            |
| -------------- | ---------------------------------------- | ------------------------------------------------------------------ |
| **层级**       | 应用层（HTTP 协议本身的限制）            | 传输层（TCP 协议的限制）                                           |
| **根本原因**   | 无法多路复用，请求和响应必须按顺序传输   | TCP 要求数据包按顺序交付，丢包时阻塞整个连接                       |
| **受影响范围** | 单个 HTTP 请求/响应会阻塞后续请求/响应。 | 单个 TCP 包丢失会影响所有 HTTP/2.0 流（依赖于同一个底层 TCP 连接） |
| **缓解方法**   | 开启多个并行的 TCP 连接                  | 减少网络掉包或者使用基于 UDP 的 QUIC 协议                          |
| **影响场景**   | 每次都会发生，尤其是大文件阻塞小文件时。 | 丢包率较高的网络环境下更容易发生。                                 |

### ⭐️ HTTP 是不保存状态的协议，如何保存用户状态？

HTTP 协议本身是 **无状态的（stateless）**。这意味着服务器默认情况下无法区分两个连续的请求是否来自同一个用户，或者同一个用户之前的操作是什么。这就像一个“健忘”的服务员，每次你跟他说话，他都不知道你是谁，也不知道你之前点过什么菜。

但在实际的 Web 应用中，比如网上购物、用户登录等场景，我们显然需要记住用户的状态（例如购物车里的商品、用户的登录信息）。为了解决这个问题，主要有以下几种常用机制：

**方案一：Session（会话）配合 Cookie（主流方式）：**

![Session 配合 Cookie 保存用户登录状态的流程](https://oss.javaguide.cn/github/javaguide/系统设计/安全/session-cookie-authentication-process.png)

这可以说是最经典也是最常用的方法了。基本流程是这样的：

1. 用户向服务器发送用户名、密码、验证码用于登陆系统。
2. 服务器验证通过后，会为这个用户创建一个专属的 Session 对象（可以理解为服务器上的一块内存，存放该用户的状态数据，如购物车、登录信息等）存储起来，并给这个 Session 分配一个唯一的 `SessionID`。
3. 服务器通过 HTTP 响应头中的 `Set-Cookie` 指令，把这个 `SessionID` 发送给用户的浏览器。
4. 浏览器接收到 `SessionID` 后，会将其以 Cookie 的形式保存在本地。当用户保持登录状态时，每次向该服务器发请求，浏览器都会自动带上这个存有 `SessionID` 的 Cookie。
5. 服务器收到请求后，从 Cookie 中拿出 `SessionID`，就能找到之前保存的那个 Session 对象，从而知道这是哪个用户以及他之前的状态了。

使用 Session 的时候需要注意下面几个点：

- **客户端 Cookie 支持**：依赖 Session 的核心功能要确保用户浏览器开启了 Cookie。
- **Session 过期管理**：合理设置 Session 的过期时间，平衡安全性和用户体验。
- **Session ID 安全**：为包含 `SessionID` 的 Cookie 设置 `HttpOnly` 标志可以防止客户端脚本（如 JavaScript）窃取，设置 Secure 标志可以保证 `SessionID` 只在 HTTPS 连接下传输，增加安全性。

Session 数据本身存储在服务器端。常见的存储方式有：

- **服务器内存**：实现简单，访问速度快，但服务器重启数据会丢失，且不利于多服务器间的负载均衡。这种方式适合简单且用户量不大的业务场景。
- **数据库（如 MySQL, PostgreSQL）**：数据持久化，但读写性能相对较低，一般不会使用这种方式。
- **分布式缓存（如 Redis）**：性能高，支持分布式部署，是目前大规模应用中非常主流的方案。

**方案二：当 Cookie 被禁用时：URL 重写（URL Rewriting）**

如果用户的浏览器禁用了 Cookie，或者某些情况下不便使用 Cookie，还有一种备选方案是 URL 重写。这种方式会将 `SessionID` 直接附加到 URL 的末尾，作为参数传递。例如：<http://www.example.com/page?sessionid=xxxxxx>。服务器端会解析 URL 中的 `sessionid` 参数来获取 `SessionID`，进而找到对应的 Session 数据。

这种方法一般不会使用，存在以下缺点：

- URL 会变长且不美观；
- `SessionID` 暴露在 URL 中，安全性较低（容易被复制、分享或记录在日志中）；
- 对搜索引擎优化（SEO）可能不友好。

**方案三：Token-based 认证（如 JWT - JSON Web Tokens）**

这是一种越来越流行的无状态认证方式，尤其适用于前后端分离的架构和微服务。

![JWT 身份验证示意图](https://oss.javaguide.cn/github/javaguide/系统设计/jwt/jwt-authentication%20process.png)

以 JWT 为例（普通 Token 方案也可以），简化后的步骤如下：

1. 用户向服务器发送用户名、密码以及验证码用于登陆系统。
2. 如果用户名、密码以及验证码校验正确的话，服务端会返回已经签名的 Token，也就是 JWT。
3. 客户端收到 Token 后自己保存起来（比如浏览器的 `localStorage`）。
4. 用户以后每次向后端发请求都在 Header 中带上这个 JWT。
5. 服务端检查 JWT 并从中获取用户相关信息。

JWT 详细介绍可以查看这两篇文章：

- [JWT 基础概念详解](https://javaguide.cn/系统设计/安全/jwt-intro.html)
- [JWT 身份认证优缺点分析](https://javaguide.cn/系统设计/安全/advantages-and-disadvantages-of-jwt.html)

总结来说，虽然 HTTP 本身是无状态的，但通过 Cookie + Session、URL 重写或 Token 等机制，我们能够有效地在 Web 应用中跟踪和管理用户状态。其中，**Cookie + Session 是最传统也最广泛使用的方式，而 Token-based 认证则在现代 Web 应用中越来越受欢迎。**

### URI 和 URL 的区别是什么？

- URI（Uniform Resource Identifier）是统一资源标志符，可以唯一标识一个资源。
- URL（Uniform Resource Locator）是统一资源定位符，可以提供该资源的路径。它是一种具体的 URI，即 URL 可以用来标识一个资源，而且还指明了如何 locate 这个资源。

URI 的作用像身份证号一样，URL 的作用更像家庭住址一样。URL 是一种具体的 URI，它不仅唯一标识资源，而且还提供了定位该资源的信息。

### Cookie 和 Session 有什么区别？

准确点来说，这个问题属于认证授权的范畴，你可以在 [认证授权基础概念详解](https://javaguide.cn/系统设计/安全/basis-of-authority-certification.html) 这篇文章中找到详细的答案。

### ⭐️ GET 和 POST 的区别

这个问题在知乎上被讨论的挺火热的，地址：<https://www.zhihu.com/question/28586791>。

GET 和 POST 是 HTTP 协议中两种常用的请求方法，它们在不同的场景和目的下有不同的特点和用法。一般来说，可以从以下几个方面来区分二者（重点搞清两者在语义上的区别即可）：

- 语义（主要区别）：GET 通常用于获取或查询资源，而 POST 通常用于创建或修改资源。
- 幂等：GET 请求是幂等的，即多次重复执行不会改变资源的状态，而 POST 请求是不幂等的，即每次执行可能会产生不同的结果或影响资源的状态。
- 格式：GET 请求的参数通常放在 URL 中，形成查询字符串（querystring），而 POST 请求的参数通常放在请求体（body）中，可以有多种编码格式，如 application/x-www-form-urlencoded、multipart/form-data、application/json 等。GET 请求的 URL 长度受到浏览器和服务器的限制，而 POST 请求的 body 大小则没有明确的限制。不过，实际上 GET 请求也可以用 body 传输数据，只是并不推荐这样做，因为这样可能会导致一些兼容性或者语义上的问题。
- 缓存：由于 GET 请求是幂等的，它可以被浏览器或其他中间节点（如代理、网关）缓存起来，以提高性能和效率。而 POST 请求则不适合被缓存，因为它可能有副作用，每次执行可能需要实时的响应。
- 安全性：GET 请求和 POST 请求如果使用 HTTP 协议的话，那都不安全，因为 HTTP 协议本身是明文传输的，必须使用 HTTPS 协议来加密传输数据。另外，GET 请求相比 POST 请求更容易泄露敏感数据，因为 GET 请求的参数通常放在 URL 中。

再次提示，重点搞清两者在语义上的区别即可，实际使用过程中，也是通过语义来区分使用 GET 还是 POST。不过，也有一些项目所有的请求都用 POST，这个并不是固定的，项目组达成共识即可。

## WebSocket

### 什么是 WebSocket?

WebSocket 是一种基于 TCP 连接的全双工通信协议，即客户端和服务器可以同时发送和接收数据。

WebSocket 协议在 2008 年诞生，2011 年成为国际标准，几乎所有主流较新版本的浏览器都支持该协议。不过，WebSocket 不只能在基于浏览器的应用程序中使用，很多编程语言、框架和服务器都提供了 WebSocket 支持。

WebSocket 协议本质上是应用层的协议，用于弥补 HTTP 协议在持久通信能力上的不足。客户端和服务器仅需一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输。

![WebSocket 建立持久连接实现双向通信](https://oss.javaguide.cn/github/javaguide/系统设计/Web 实时消息推送详解/1460000042192394.png)

下面是 WebSocket 的常见应用场景：

- 视频弹幕
- 实时消息推送，详见[Web 实时消息推送详解](https://javaguide.cn/系统设计/web-real-time-message-push.html)这篇文章
- 实时游戏对战
- 多用户协同编辑
- 社交聊天
- ……

### ⭐️ WebSocket 和 HTTP 有什么区别？

WebSocket 和 HTTP 两者都是基于 TCP 的应用层协议，都可以在网络中传输数据。

下面是二者的主要区别：

- WebSocket 是一种双向实时通信协议，而 HTTP 是一种单向通信协议。并且，HTTP 协议下的通信只能由客户端发起，服务器无法主动通知客户端。
- WebSocket 使用 ws:// 或 wss://（使用 SSL/TLS 加密后的协议，类似于 HTTP 和 HTTPS 的关系）作为协议前缀，HTTP 使用 http:// 或 https:// 作为协议前缀。
- WebSocket 可以支持扩展，用户可以扩展协议，实现部分自定义的子协议，如支持压缩、加密等。
- WebSocket 通信数据格式比较轻量，用于协议控制的数据包头部相对较小，网络开销小，而 HTTP 通信每次都要携带完整的头部，网络开销较大（HTTP/2.0 使用二进制帧进行数据传输，还支持头部压缩，减少了网络开销）。

### WebSocket 的工作过程是什么样的？

WebSocket 的工作过程可以分为以下几个步骤：

1. 客户端向服务器发送一个 HTTP 请求，请求头中包含 `Upgrade: websocket` 和 `Sec-WebSocket-Key` 等字段，表示要求升级协议为 WebSocket；
2. 服务器收到这个请求后，会进行升级协议的操作，如果支持 WebSocket，它将回复一个 HTTP 101 状态码，响应头中包含 `Connection: Upgrade` 和 `Sec-WebSocket-Accept: xxx` 等字段，表示成功升级到 WebSocket 协议。
3. 客户端和服务器之间建立了一个 WebSocket 连接，可以进行双向的数据传输。数据以帧（frames）的形式进行传送，WebSocket 的每条消息可能会被切分成多个数据帧（最小单位）。发送端会将消息切割成多个帧发送给接收端，接收端接收消息帧，并将关联的帧重新组装成完整的消息。
4. 客户端或服务器可以主动发送一个关闭帧，表示要断开连接。另一方收到后，也会回复一个关闭帧，然后双方关闭 TCP 连接。

另外，建立 WebSocket 连接之后，通过心跳机制来保持 WebSocket 连接的稳定性和活跃性。

### ⭐️ WebSocket 与短轮询、长轮询的区别

这三种方式，都是为了解决“**客户端如何及时获取服务器最新数据，实现实时更新**”的问题。它们的实现方式和效率、实时性差异较大。

**1.短轮询（Short Polling）**

- **原理**：客户端每隔固定时间（如 5 秒）发起一次 HTTP 请求，询问服务器是否有新数据。服务器收到请求后立即响应。
- **优点**：实现简单，兼容性好，直接用常规 HTTP 请求即可。
- **缺点**：
  - **实时性一般**：消息可能在两次轮询间到达，用户需等到下次请求才知晓。
  - **资源浪费大**：反复建立/关闭连接，且大多数请求收到的都是“无新消息”，极大增加服务器和网络压力。

**2.长轮询（Long Polling）**

- **原理**：客户端发起请求后，若服务器暂时无新数据，则会保持连接，直到有新数据或超时才响应。客户端收到响应后立即发起下一次请求，实现“伪实时”。
- **优点**：
  - **实时性较好**：一旦有新数据可立即推送，无需等待下次定时请求。
  - **空响应减少**：减少了无效的空响应，提升了效率。
- **缺点**：
  - **服务器资源占用高**：需长时间维护大量连接，消耗服务器线程/连接数。
  - **资源浪费大**：每次响应后仍需重新建立连接，且依然基于 HTTP 单向请求-响应机制。

**3. WebSocket**

- **原理**：客户端与服务器通过一次 HTTP Upgrade 握手后，建立一条持久的 TCP 连接。之后，双方可以随时、主动地发送数据，实现真正的全双工、低延迟通信。
- **优点**：
  - **实时性强**：数据可即时双向收发，延迟极低。
  - **资源效率高**：连接持续，无需反复建立/关闭，减少资源消耗。
  - **功能强大**：支持服务端主动推送消息、客户端主动发起通信。
- **缺点**：
  - **使用限制**：需要服务器和客户端都支持 WebSocket 协议。对连接管理有一定要求（如心跳保活、断线重连等）。
  - **实现麻烦**：实现起来比短轮询和长轮询要更麻烦一些。

![WebSocket 与短轮询和长轮询的通信方式对比](https://oss.javaguide.cn/github/javaguide/系统设计/Web 实时消息推送详解/1460000042192394.png)

### ⭐️ SSE 与 WebSocket 有什么区别？

SSE（Server-Sent Events）和 WebSocket 都是用来实现服务器向浏览器实时推送消息的技术，让网页内容能自动更新，而不需要用户手动刷新。虽然目标相似，但它们在工作方式和适用场景上有几个关键区别：

1. **通信方式:**
   - **SSE:** **单向通信**。只有服务器能向客户端（浏览器）发送数据。客户端不能通过同一个连接向服务器发送数据（需要发起新的 HTTP 请求）。
   - **WebSocket:** **双向通信（全双工）**。客户端和服务器可以随时互相发送消息，实现真正的实时交互。
2. **底层协议:**
   - **SSE:** 基于**标准的 HTTP/HTTPS 协议**。它本质上是一个“长连接”的 HTTP 请求，服务器保持连接打开并持续发送事件流。不需要特殊的服务器或协议支持，现有的 HTTP 基础设施就能用。
   - **WebSocket:** 使用**独立的 ws:// 或 wss:// 协议**。它需要通过一个特定的 HTTP "Upgrade" 请求来建立连接，并且服务器需要明确支持 WebSocket 协议来处理连接和消息帧。
3. **实现复杂度和成本:**
   - **SSE:** **实现相对简单**，主要在服务器端处理。浏览器端有标准的 EventSource API，使用方便。开发和维护成本较低。
   - **WebSocket:** **稍微复杂一些**。需要服务器端专门处理 WebSocket 连接和协议，客户端也需要使用 WebSocket API。如果需要考虑兼容性、心跳、重连等，开发成本会更高。
4. **断线重连:**
   - **SSE:** **浏览器原生支持**。EventSource API 提供了自动断线重连的机制。
   - **WebSocket:** **需要手动实现**。开发者需要自己编写逻辑来检测断线并进行重连尝试。
5. **数据类型:**
   - **SSE:** **主要设计用来传输文本**（UTF-8 编码）。如果需要传输二进制数据，需要先进行 Base64 等编码转换成文本。
   - **WebSocket:** **原生支持传输文本和二进制数据**，无需额外编码。

为了提供更好的用户体验和利用其简单、高效、基于标准 HTTP 的特性，**Server-Sent Events（SSE）是目前大型语言模型 API（如 OpenAI、DeepSeek 等）实现流式响应的常用甚至可以说是标准的技术选择**。

这里以 DeepSeek 为例，我们发送一个请求并打开浏览器控制台验证一下：

![DeepSeek 响应标头](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/deepseek-sse.png)

![DeepSeek SSE 响应使用 text/event-stream 持续传输事件](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/deepseek-sse-eventstream.png)

可以看到，响应头里包含了 `text/event-stream`，说明使用的确实是 SSE。并且，响应数据也确实是持续分块传输。

## PING

### PING 命令的作用是什么？

PING 命令是一种常用的网络诊断工具，经常用来测试网络中主机之间的连通性和网络延迟。

这里简单举一个例子，我们来 PING 一下百度。

```bash
# 发送4个PING请求数据包到 www.baidu.com
❯ ping -c 4 www.baidu.com

PING www.a.shifen.com (14.119.104.189): 56 data bytes
64 bytes from 14.119.104.189: icmp_seq=0 ttl=54 time=27.867 ms
64 bytes from 14.119.104.189: icmp_seq=1 ttl=54 time=28.732 ms
64 bytes from 14.119.104.189: icmp_seq=2 ttl=54 time=27.571 ms
64 bytes from 14.119.104.189: icmp_seq=3 ttl=54 time=27.581 ms

--- www.a.shifen.com ping statistics ---
4 packets transmitted, 4 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 27.571/27.938/28.732/0.474 ms
```

PING 命令的输出结果通常包括以下几部分信息：

1. **ICMP Echo Request（请求报文）信息**：序列号、TTL（Time to Live）值。
2. **目标主机的域名或 IP 地址**：输出结果的第一行。
3. **往返时间（RTT，Round-Trip Time）**：从发送 ICMP Echo Request（请求报文）到接收到 ICMP Echo Reply（响应报文）的总时间，用来衡量网络连接的延迟。
4. **统计结果（Statistics）**：包括发送的 ICMP 请求数据包数量、接收到的 ICMP 响应数据包数量、丢包率、往返时间（RTT）的最小、平均、最大和标准偏差值。

如果 PING 对应的目标主机无法得到正确的响应，则表明这两个主机之间的连通性存在问题（有些主机或网络管理员可能禁用了对 ICMP 请求的回复，这样也会导致无法得到正确的响应）。如果往返时间（RTT）过高，则表明网络延迟过高。

### PING 命令的工作原理是什么？

PING 基于网络层的 **ICMP（Internet Control Message Protocol，互联网控制报文协议）**，其主要原理就是通过在网络上发送和接收 ICMP 报文实现的。

ICMP 报文中包含了类型字段，用于标识 ICMP 报文类型。ICMP 报文的类型有很多种，但大致可以分为两类：

- **查询报文类型**：向目标主机发送请求并期望得到响应。
- **差错报文类型**：向源主机发送错误信息，用于报告网络中的错误情况。

PING 用到的 ICMP Echo Request（类型为 8）和 ICMP Echo Reply（类型为 0）属于查询报文类型。

- PING 命令会向目标主机发送 ICMP Echo Request。
- 如果两个主机的连通性正常，目标主机会返回一个对应的 ICMP Echo Reply。

### ⭐️ 能 Ping 通，TCP 就一定能连通吗？

先说结论：**不是**。

Ping 使用 ICMP（网络层），TCP 连接使用 TCP（传输层），两者可能经过同一条网络路径，但中间设备会按协议类型、端口、连接状态和安全策略分别处理。你能 Ping 通，只能说明 ICMP Echo 这条路径能往返，不等于目标 TCP 端口一定可达。

![ICMP与TCP路径差异](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/can-ping-but-tcp-may-not-connect-icmp-and-tcp-path-differences.png)

常见原因有这几种：

- **防火墙策略不同**：很多网络设备允许 ICMP（方便运维探测），但 TCP 端口规则收得更紧，可能只开放了 `22`、`80`、`443`，其他端口一律不放。
- **服务没启动或端口没监听**：主机能回 ICMP，但 Nginx 没启动、MySQL 没监听，Ping 通但 TCP 连不上。
- **中间有 NAT / 负载均衡 / 安全设备**：公网 IP 后面可能不是一台真实服务器，ICMP 响应可能来自中间设备，不能直接等同于后端服务可用。
- **HTTPS 还可能卡在 TLS 握手的 SNI**：TCP 三次握手可能成功了，但 `ClientHello` 里的 SNI 被中间设备识别并拦截，导致连接重置或卡住。

反过来也成立：**Ping 不通，不代表 TCP 一定不通**。有些服务器或云安全组直接禁 ICMP，但业务端口正常工作。

排查建议：先看 DNS（域名场景），再用 `ping` 看 ICMP，然后用 `nc` 测端口，最后用 `curl` 或 `openssl s_client` 看 HTTPS / TLS。别用一个命令过早下结论。

![HTTPS连接排查层次](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/can-ping-but-tcp-may-not-connect-https-connection-troubleshooting-layers.png)

详细介绍：[能 Ping 通，TCP 就一定能连通吗？](./能 Ping 通，TCP 就一定能连通吗？.md)

## DNS

### DNS 的作用是什么？

DNS（Domain Name System）域名管理系统，是当用户使用浏览器访问网址之后，使用的第一个重要协议。DNS 要解决的是**域名和 IP 地址的映射问题**。

![DNS 将域名解析为 IP 地址的系统概览](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/dns-overview.png)

在一台电脑上，可能存在浏览器 DNS 缓存，操作系统 DNS 缓存，路由器 DNS 缓存。如果以上缓存都查询不到，那么 DNS 就闪亮登场了。

目前 DNS 的设计采用的是分布式、层次数据库结构，**DNS 是应用层协议，它可以在 UDP 或 TCP 协议之上运行，端口为 53**。

### DNS 服务器有哪些？根服务器有多少个？

DNS 可以从两个维度描述。权威层次包括根、顶级域和具体区域的权威服务器；查询侧则包括存根解析器、递归解析器和转发器等角色。同一套软件或同一台服务器也可能承担多个角色，因此这些类别不是互斥且穷尽的“服务器类型”。

- 根 DNS 服务器向查询方提供顶级域服务器的转介信息。
- 顶级域 DNS 服务器通常返回目标域权威服务器的转介信息。
- 权威 DNS 服务器保存一个或多个区域的数据，并对这些区域内的查询给出权威回答。
- 递归解析器接收客户端查询，先检查缓存，必要时再向根、TLD 和权威服务器逐级查询。它属于查询侧角色，不是权威 DNS 层次的一层。

根服务器系统逻辑上有 13 个命名的根服务器标识，从 `a.root-servers.net` 到 `m.root-servers.net`，由 12 个独立运营组织负责。每个标识背后可以通过 Anycast 部署多个物理实例，实例数量和地点会持续变化，应以 [Root-Servers.org](https://root-servers.org/) 的实时数据为准。不能把 13 个逻辑标识理解为全球只有 13 台物理服务器。

### ⭐️ DNS 解析的过程是什么样的？

整个过程的步骤比较多，我单独写了一篇文章详细介绍：[DNS 域名系统详解（应用层）](https://javaguide.cn/计算机基础/计算机网络/dns.html)。

### DNS 劫持了解吗？如何应对？

DNS 劫持是一种网络攻击，它通过修改 DNS 服务器的解析结果，使用户访问的域名指向错误的 IP 地址，从而导致用户无法访问正常的网站，或者被引导到恶意的网站。DNS 劫持有时也被称为 DNS 重定向、DNS 欺骗或 DNS 污染。

## 参考

- 《图解 HTTP》
- 《计算机网络自顶向下方法》（第七版）
- 详解 HTTP/2.0 及 HTTPS 协议：<https://juejin.cn/post/7034668672262242318>
- HTTP 请求头字段大全| HTTP Request Headers：<https://www.flysnow.org/开发工具/table/http-request-headers/>
- HTTP1、HTTP2、HTTP3：<https://juejin.cn/post/6855470356657307662>
- 如何看待 HTTP/3？ - 车小胖的回答 - 知乎: <https://www.zhihu.com/question/302412059/answer/533223530>

<!-- @include: @article-footer.snippet.md -->


---

<!-- source: 计算机网络/计算机网络常见面试题总结（下）.md -->

---
title: 计算机网络常见面试题总结（下）
description: 汇总计算机网络常见面试题（下），覆盖 TCP/UDP、连接管理、可靠传输、HTTP/3、IP、IPv6、NAT 与 ARP 等基础知识。
category: 计算机基础
tag:
  - 计算机网络
head:
  - - meta
    - name: keywords
      content: 计算机网络面试题,TCP vs UDP,TCP三次握手,HTTP/3 QUIC,IPv4 vs IPv6,TCP可靠性,IP地址,NAT协议,ARP协议,传输层面试,网络层高频题,基于TCP协议,基于UDP协议,队头阻塞,四次挥手
---

计算机网络面试题里，真正容易被追问到细节的部分，往往集中在 **TCP、UDP、IP、ARP、NAT、IPv4/IPv6** 这些传输层和网络层知识点上。比如：为什么 TCP 可靠？为什么要三次握手和四次挥手？HTTP/3 为什么改用基于 UDP 的 QUIC？这些问题不仅考概念，也考你对网络通信过程的理解。

这篇《计算机网络常见面试题总结（下）》会重点梳理 TCP 与 UDP、TCP 连接管理、可靠传输、IP 地址、ARP、NAT 等后端面试高频内容，帮助你把传输层和网络层的核心考点串起来。

## TCP 与 UDP

### ⭐️ TCP 与 UDP 的区别（重要）

1. **是否面向连接**：
   - TCP 是面向连接的。在传输数据之前，必须先通过“三次握手”建立连接；数据传输完成后，还需要通过“四次挥手”来释放连接。这保证了双方都准备好通信。
   - UDP 是无连接的。发送数据前不需要建立任何连接，直接把数据包（数据报）扔出去。
2. **是否是可靠传输**：
   - TCP 提供可靠的数据传输服务。它通过序列号、确认应答（ACK）、超时重传、流量控制、拥塞控制等一系列机制，来确保数据能够无差错、不丢失、不重复且按顺序地到达目的地。
   - UDP 提供不可靠的传输。它尽最大努力交付（best-effort delivery），但不保证数据一定能到达，也不保证到达的顺序，更不会自动重传。收到报文后，接收方也不会主动发确认。
3. **是否有状态**：
   - TCP 是有状态的。因为要保证可靠性，TCP 需要在连接的两端维护连接状态信息，比如序列号、窗口大小、哪些数据发出去了、哪些收到了确认等。
   - UDP 是无状态的。它不维护连接状态，发送方发出数据后就不再关心它是否到达以及如何到达，因此开销更小（**这很“渣男”！**）。
4. **传输效率**：
   - TCP 因为需要建立连接、发送确认、处理重传等，其开销较大，传输效率相对较低。
   - UDP 结构简单，没有复杂的控制机制，开销小，传输效率更高，速度更快。
5. **传输形式**：
   - TCP 是面向字节流（Byte Stream）的。它将应用程序交付的数据视为一连串无结构的字节流，可能会对数据进行拆分或合并。
   - UDP 是面向报文（Message Oriented）的。应用程序交给 UDP 多大的数据块，UDP 就照样发送，既不拆分也不合并，保留了应用程序消息的边界。
6. **首部开销**：
   - TCP 的头部至少需要 20 字节，如果包含选项字段，最多可达 60 字节。
   - UDP 的头部非常简单，固定只有 8 字节。
7. **是否提供广播或多播服务**：
   - TCP 只支持点对点（Point-to-Point）的单播通信。
   - UDP 支持一对一（单播）、一对多（多播/Multicast）和一对所有（广播/Broadcast）的通信方式。
8. ……

为了更直观地对比，可以看下面这个表格：

| 特性         | TCP                        | UDP                                 |
| ------------ | -------------------------- | ----------------------------------- |
| **连接性**   | 面向连接                   | 无连接                              |
| **可靠性**   | 可靠                       | 不可靠（尽力而为）                  |
| **状态维护** | 有状态                     | 无状态                              |
| **传输效率** | 较低                       | 较高                                |
| **传输形式** | 面向字节流                 | 面向数据报（报文）                  |
| **头部开销** | 20 - 60 字节               | 8 字节                              |
| **通信模式** | 点对点（单播）             | 单播、多播、广播                    |
| **常见应用** | HTTP/HTTPS, FTP, SMTP, SSH | DNS, DHCP, SNMP, TFTP, VoIP, 视频流 |

### ⭐️ 什么时候选择 TCP，什么时候选 UDP?

选择 TCP 还是 UDP，主要取决于你的应用**对数据传输的可靠性要求有多高，以及对实时性和效率的要求有多高**。

当**数据准确性和完整性至关重要，一点都不能出错**时，通常选择 TCP。因为 TCP 提供了一整套机制（三次握手、确认应答、重传、流量控制等）来保证数据能够可靠、有序地送达。典型应用场景如下：

- **Web 浏览（HTTP/HTTPS）:** 网页内容、图片、脚本必须完整加载才能正确显示。
- **文件传输（FTP, SCP）:** 文件内容不允许有任何字节丢失或错序。
- **邮件收发（SMTP, POP3, IMAP）:** 邮件内容需要完整无误地送达。
- **远程登录（SSH, Telnet）:** 命令和响应需要准确传输。
- ……

当**实时性、速度和效率优先，并且应用能容忍少量数据丢失或乱序**时，通常选择 UDP。UDP 开销小、传输快，没有建立连接和保证可靠性的复杂过程。典型应用场景如下：

- **实时音视频通信（VoIP, 视频会议，直播）:** 偶尔丢失一两个数据包（可能导致画面或声音短暂卡顿）通常比因为等待重传（TCP 机制）导致长时间延迟更可接受。应用层可能会有自己的补偿机制。
- **在线游戏:** 需要快速传输玩家位置、状态等信息，对实时性要求极高，旧的数据很快就没用了，丢失少量数据影响通常不大。
- **DHCP（动态主机配置协议）:** 客户端在请求 IP 时自身没有 IP 地址，无法满足 TCP 建立连接的前提条件，并且 DHCP 有广播需求、交互模式简单以及自带可靠性机制。
- **物联网（IoT）数据上报:** 某些场景下，传感器定期上报数据，丢失个别数据点可能不影响整体趋势分析。
- ……

### HTTP 基于 TCP 还是 UDP？

~~**HTTP 协议是基于 TCP 协议的**，所以发送 HTTP 请求之前首先要建立 TCP 连接也就是要经历 3 次握手。~~

🐛 修正（参见 [issue#1915](https://github.com/Snailclimb/JavaGuide/issues/1915)）：

HTTP/3.0 之前是基于 TCP 协议的，而 HTTP/3.0 将弃用 TCP，改用 **基于 UDP 的 QUIC 协议**：

- **HTTP/1.x 和 HTTP/2.0**：这两个版本的 HTTP 协议都明确建立在 TCP 之上。TCP 提供了可靠的、面向连接的传输，确保数据按序、无差错地到达，这对于网页内容的正确展示非常重要。发送 HTTP 请求前，需要先通过 TCP 的三次握手建立连接。
- **HTTP/3.0**：这是一个重大的改变。HTTP/3 弃用了 TCP，转而使用 QUIC 协议，而 QUIC 是构建在 UDP 之上的。

![HTTP/1、HTTP/2 和 HTTP/3 协议栈对比](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/http-3-implementation.png)

**为什么 HTTP/3 要做这个改变呢？主要有两大原因：**

1. 解决队头阻塞（Head-of-Line Blocking，简写：HOL blocking）问题。
2. 减少连接建立的延迟。

下面我们来详细介绍这两大优化。

在 HTTP/2 中，虽然可以在一个 TCP 连接上并发传输多个请求/响应流（多路复用），但 TCP 本身的特性（保证有序、可靠）意味着如果其中一个流的某个 TCP 报文丢失或延迟，整个 TCP 连接都会被阻塞，等待该报文重传。这会导致所有在这个 TCP 连接上的 HTTP/2 流都受到影响，即使其他流的数据包已经到达。**QUIC（运行在 UDP 上）解决了这个问题**。QUIC 内部实现了自己的多路复用和流控制机制。不同的 HTTP 请求/响应流在 QUIC 层面是真正独立的。如果一个流的数据包丢失，它只会阻塞该流，而不会影响同一 QUIC 连接上的其他流（本质上是多路复用+轮询），大大提高了并发传输的效率。

除了解决队头阻塞问题，HTTP/3.0 还可以减少握手过程的延迟。在 HTTP/2.0 中，如果要建立一个安全的 HTTPS 连接，需要经过 TCP 三次握手和 TLS 握手：

RTT 指报文从一端到对端再返回的往返时间，不是单程传输时间。TCP 握手的延迟必须说明测量终点：客户端在发送 SYN 后约 1 RTT 收到 SYN-ACK，随后可以发送最终 ACK 和应用请求；服务器收到该 ACK 和请求还需要一个单程延迟。比较 HTTP/2 和 HTTP/3 时，应统一采用“客户端何时可以发送首个请求”或“客户端何时收到首字节”等同一个指标。

HTTP/2 的 HTTPS 连接需要先建立 TCP 连接，再完成 TLS 握手。HTTP/3 把传输参数协商和 TLS 1.3 握手结合在 QUIC 建连过程中。新的 QUIC 连接通常使用 1-RTT；0-RTT 只适用于客户端持有先前连接状态的恢复场景，可以在首个报文中携带早期数据，但存在重放风险，只适合可安全重放的请求。

相关证明可以参考下面这两个链接：

- <https://zh.wikipedia.org/zh/HTTP/3>
- <https://datatracker.ietf.org/doc/rfc9114/>

### 为什么 TCP 是面向字节流，UDP 是面向报文？

![TCP 与 UDP 的消息边界](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-udp-byte-stream-tcp-udp-message-boundary.png)

TCP 是面向字节流的。应用层写入的数据会进入内核缓冲区，TCP 只保证这些字节可靠、有序地到达对端，不保证一次 `send()` 对应一次 `recv()`，也不保留应用层消息边界。因此接收方可能一次读到多条消息，也可能只读到半条消息，这就是常说的粘包、拆包现象。
![TCP 粘包 / 拆包为什么会出现？](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-udp-byte-stream-tcp-sticky-split-causes.png)

UDP 是面向报文的。应用层交给 UDP 的一次数据会作为一个 UDP 数据报发送，接收端也是按数据报读取，所以天然保留消息边界。不过 UDP 不保证可靠到达，也不保证顺序。

解决 TCP 粘包/拆包，本质是应用层协议自己定义消息边界。常见方案有固定长度、分隔符、长度头。工程里更常用长度头，因为它对二进制协议和变长消息更友好，但要处理字节序、最大长度限制、半包缓存和异常连接关闭等问题。

![应用层如何定义消息边界？](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-udp-byte-stream-tcp-message-boundary-solutions.png)

详细介绍：[为什么 TCP 是面向字节流，UDP 是面向报文？](./为什么 TCP 是面向字节流，UDP 是面向报文？（传输层）.md)

### 你知道哪些基于 TCP/UDP 的协议？

TCP（传输控制协议）和 UDP（用户数据报协议）是互联网传输层的两大核心协议，它们为各种应用层协议提供了基础的通信服务。以下是一些常见的、分别构建在 TCP 和 UDP 之上的应用层协议：

**运行于 TCP 协议之上的协议（强调可靠、有序传输）：**

| 中文全称（缩写）            | 英文全称                           | 主要用途                     | 说明与特性                                                                                                                  |
| --------------------------- | ---------------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 超文本传输协议（HTTP）      | HyperText Transfer Protocol        | 传输网页、超文本、多媒体内容 | **HTTP/1.x 和 HTTP/2 基于 TCP**。早期版本不加密，是 Web 通信的基础。                                                        |
| 安全超文本传输协议（HTTPS） | HyperText Transfer Protocol Secure | 加密的网页传输               | 使用 TLS 保护 HTTP。HTTP/1.1 和 HTTP/2 通常使用 TLS over TCP，HTTP/3 使用集成 TLS 1.3 的 QUIC。                             |
| 文件传输协议（FTP）         | File Transfer Protocol             | 文件传输                     | 传统的 FTP **明文传输**，不安全。推荐使用其安全版本 **SFTP（SSH File Transfer Protocol）** 或 **FTPS (FTP over SSL/TLS)**。 |
| 简单邮件传输协议（SMTP）    | Simple Mail Transfer Protocol      | **发送**电子邮件             | 负责将邮件从客户端发送到服务器，或在邮件服务器之间传递。可通过 **STARTTLS** 升级到加密传输。                                |
| 邮局协议第 3 版（POP3）     | Post Office Protocol version 3     | **接收**电子邮件             | 通常将邮件从服务器**下载到本地设备后删除服务器副本**（可配置保留）。**POP3S** 是其 SSL/TLS 加密版本。                       |
| 互联网消息访问协议（IMAP）  | Internet Message Access Protocol   | **接收和管理**电子邮件       | 邮件保留在服务器，支持多设备同步邮件状态、文件夹管理、在线搜索等。**IMAPS** 是其 SSL/TLS 加密版本。现代邮件服务首选。       |
| 远程终端协议（Telnet）      | Teletype Network                   | 远程终端登录                 | **明文传输**所有数据（包括密码），安全性极差，基本已被 SSH 完全替代。                                                       |
| 安全外壳协议（SSH）         | Secure Shell                       | 安全远程管理、加密数据传输   | 提供了加密的远程登录和命令执行，以及安全的文件传输（SFTP）等功能，是 Telnet 的安全替代品。                                  |

**运行于 UDP 协议之上的协议（强调快速、低开销传输）：**

| 中文全称（缩写）         | 英文全称                              | 主要用途                   | 说明与特性                                                                                                         |
| ------------------------ | ------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 超文本传输协议（HTTP/3） | HyperText Transfer Protocol version 3 | 新一代网页传输             | 基于 **QUIC** 协议（QUIC 本身构建于 UDP 之上），旨在减少延迟、缓解 TCP 队头阻塞；会话恢复时可使用 0-RTT 早期数据。 |
| 动态主机配置协议（DHCP） | Dynamic Host Configuration Protocol   | 动态分配 IP 地址及网络配置 | 客户端从服务器自动获取 IP 地址、子网掩码、网关、DNS 服务器等信息。                                                 |
| 域名系统（DNS）          | Domain Name System                    | 域名到 IP 地址的解析       | **通常使用 UDP** 进行快速查询。当响应数据包过大或进行区域传送（AXFR）时，会**切换到 TCP** 以保证数据完整性。       |
| 实时传输协议（RTP）      | Real-time Transport Protocol          | 实时音视频数据流传输       | 常用于 VoIP、视频会议、直播等。追求低延迟，允许少量丢包。通常与 RTCP 配合使用。                                    |
| RTP 控制协议（RTCP）     | RTP Control Protocol                  | RTP 流的质量监控和控制信息 | 配合 RTP 工作，提供丢包、延迟、抖动等统计信息，辅助流量控制和拥塞管理。                                            |
| 简单文件传输协议（TFTP） | Trivial File Transfer Protocol        | 简化的文件传输             | 功能简单，常用于局域网内无盘工作站启动、网络设备固件升级等小文件传输场景。                                         |
| 简单网络管理协议（SNMP） | Simple Network Management Protocol    | 网络设备的监控与管理       | 允许网络管理员查询和修改网络设备的状态信息。                                                                       |
| 网络时间协议（NTP）      | Network Time Protocol                 | 同步计算机时钟             | 用于在网络中的计算机之间同步时间，确保时间的一致性。                                                               |

**总结一下：**

- **TCP** 更适合那些对数据**可靠性、完整性和顺序性**要求高的应用，如网页浏览（HTTP/HTTPS）、文件传输（FTP/SFTP）、邮件收发（SMTP/POP3/IMAP）。
- **UDP** 则更适用于那些对**实时性要求高、能容忍少量数据丢失**的应用，如域名解析（DNS）、实时音视频（RTP）、在线游戏、网络管理（SNMP）等。

### ⭐️ TCP Keepalive 和 HTTP Keep-Alive 有什么区别

| 对比维度          | HTTP Keep-Alive                                         | TCP Keepalive                                       |
| ----------------- | ------------------------------------------------------- | --------------------------------------------------- |
| **所属层**        | 应用层（HTTP 协议）                                     | 传输层（TCP 协议）                                  |
| **解决的问题**    | 复用 TCP 连接，减少重复建连、挥手、慢启动等开销         | 探测长时间空闲的 TCP 连接，对端失联后释放连接资源   |
| **默认行为**      | HTTP/1.0 默认短连接；HTTP/1.1 默认长连接                | 默认关闭，应用需要显式开启 `SO_KEEPALIVE`           |
| **控制粒度**      | 由 HTTP 客户端、Web 服务器或代理按连接策略控制          | 由操作系统内核控制，也可在部分平台逐 socket 调整    |
| **常见参数**      | `Connection`、`Keep-Alive: timeout/max`、服务器超时配置 | `tcp_keepalive_time/intvl/probes` 或平台对应参数    |
| **关闭触发**      | 到达空闲超时、请求次数上限，或任意一方主动关闭          | 空闲后发探测包，多次无响应或收到 RST 才关闭         |
| **对端在线时**    | 服务端仍可按配置主动回收空闲连接                        | 只要对端内核能回 ACK，连接通常继续维持              |
| **能否替代心跳**  | 不能判断业务是否健康，只能管理 HTTP 连接复用            | 不能判断应用线程池、事件循环、业务依赖是否正常      |
| **中间层影响**    | 代理、网关可独立管理前后两段 HTTP/TCP 连接              | NAT/LB/反向代理可能让你探测到的只是某一段 TCP 连接  |
| **HTTP/2/3 关系** | HTTP/2 禁用连接级头；HTTP/3/QUIC 不使用这套机制         | 只作用于 TCP；真正的 HTTP/3/QUIC 连接不受它直接影响 |

**不同 HTTP 版本里，Keep-Alive 的默认行为不一样**：

![不同 HTTP 版本里，Keep-Alive 的默认行为不一样](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/different-http-versions-have-different-default-keep-alive-behaviors.png)

如果从“谁来决定关连接”的角度看，两个机制的态度完全相反：

HTTP Keep-Alive 是“主动回收”——服务器到了超时或请求次数上限，就可以按自己的配置关闭连接，不需要先探测对方是否在线。它是一种比较主动的资源回收方式。

TCP Keepalive 是“被动回收”——它必须先发探测包去问“你还在吗？”。只要对方在线、能回 ACK，服务器就只能继续维持连接，刷新定时器。只有确认对方已经不在了，才能释放资源。这是一种温和的回收策略。

![TCP Keepalive 工作原理](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-keepalive-vs-http-keepalive-tcp-keepalive-working-principle.png)

![TCP Keepalive 探测机制](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-keepalive-vs-http-keepalive-tcp-keepalive-detection-mechanism.png)

实际项目中，两者经常同时在跑，各管各的。HTTP Keep-Alive 管的是“一条连接最多用多久、服务多少次请求”，TCP Keepalive 管的是“如果长时间没数据，检查一下对方是不是已经消失了”。两者互不干扰，也不能互相替代。

详细介绍：[TCP Keepalive 和 HTTP Keep-Alive 有什么区别？](./TCP Keepalive 和 HTTP Keep-Alive 有什么区别？.md)

### ⭐️ TCP 三次握手和四次挥手（非常重要）

**相关面试题**：

- 为什么要三次握手？
- 第 2 次握手传回了 ACK，为什么还要传回 SYN？
- 为什么要四次挥手？
- 为什么不能把服务器发送的 ACK 和 FIN 合并起来，变成三次挥手？
- 如果第二次挥手时服务器的 ACK 没有送达客户端，会怎样？
- 为什么第四次挥手客户端需要等待 2\*MSL（报文段最长寿命）时间后才进入 CLOSED 状态？

**参考答案**：[TCP 三次握手和四次挥手（传输层）](https://javaguide.cn/计算机基础/计算机网络/tcp-connection-and-disconnection.html)。

### TCP TIME_WAIT 到底在等什么？为什么要等？

**相关面试题**：

1. `TIME_WAIT` 到底在等什么？
2. `TIME_WAIT` 大量堆积会不会真的出问题？
3. `tcp_tw_reuse` 能不能随便开？
4. `TIME_WAIT` 和 `CLOSE_WAIT` 怎么区分？

**参考答案**： [TCP TIME_WAIT 详解：为什么要等、会不会出问题、能不能复用？](./TCP TIMEWAIT 详解-为什么要等、会不会出问题、能不能复用？.md)。

### ⭐️ TCP 如何保证传输的可靠性？（重要）

[TCP 传输可靠性保障（传输层）](https://javaguide.cn/计算机基础/计算机网络/tcp-reliability-guarantee.html)

### TCP 和 UDP 可以使用同一个端口吗？

结论：**可以**。TCP 和 UDP 的端口绑定命名空间按传输层协议区分，同一个数字端口在不同协议下不冲突。

内核收到 IP 包后，会先看 IP 层的协议标识（TCP 协议号是 `6`，UDP 是 `17`），根据协议号把报文交给对应的 TCP 或 UDP 协议栈，然后再在各自协议栈内按地址和端口分发。所以 `TCP/8080` 和 `UDP/8080` 可以共存，内核压根不会把它们当成同一条通信。

![内核协议分发流程](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/can-tcp-and-udp-use-the-same-port-kernel-protocol-dispatching-process.png)

真正容易冲突的是**同一协议**下的重复绑定，比如两个 TCP 服务通常不能同时监听同一个本地 IP 和端口；这时才涉及 `SO_REUSEADDR`、`SO_REUSEPORT` 这类 socket 复用选项。

经典例子：DNS 同时使用 `UDP/53`（日常查询）和 `TCP/53`（响应过大、区域传送）；HTTP/3 常见部署是 `UDP/443`（QUIC），可以和传统 HTTPS 的 `TCP/443` 同时存在。

![DNS 和 HTTP/3 同时使用 TCP 与 UDP 端口的实际案例](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/can-tcp-and-udp-use-the-same-port-practical-application-example.png)

详细介绍：[TCP 和 UDP 可以使用同一个端口吗？](./TCP 和 UDP 可以使用同一个端口吗？.md)

### ⭐️ 一台主机上只能保持最多 65535 个 TCP 连接吗？

结论：**不是**。`65535` 是最大端口号，不是连接数上限。

TCP 连接靠四元组区分：源 IP、源端口、目的 IP、目的端口。只要四元组不同，内核就识别为不同连接。服务端监听同一个端口时，只要客户端 IP 或客户端端口不同，连接就可以继续增加。

![TCP 连接靠四元组区分和真正的限制](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/maximum-number-of-tcp-connections-per-host-tcp-four-tuple-and-server-connection.png)

真正限制连接数的因素：

- **服务端**：主要受文件描述符、内存、CPU、网卡和应用处理能力限制，而不是端口数。
- **客户端**：连同一个目标时，源 IP 和目的 IP:Port 都固定，只剩源端口可变，更容易撞到临时端口上限（Linux 默认约 2.8 万个）。`TIME_WAIT` 堆积会加剧这个问题。
- **NAT 网关**：大量内网机器共享同一个公网 IP 访问同一个外部目标时，NAT 侧的公网源端口也会成为瓶颈。

生产环境最常见的坑不是端口不够，而是**连接池没配好导致短连接疯狂创建和销毁**，把临时端口耗光。排查时优先看连接池和 keep-alive 是否生效，不要一上来就改内核参数。

详细介绍：[一台主机上只能保持最多 65535 个 TCP 连接吗？](./一台主机上只能保持最多 65535 个 TCP 连接吗？.md)

## IP

### IP 协议的作用是什么？

**IP（Internet Protocol，网际协议）** 是 TCP/IP 协议中最重要的协议之一，属于网络层的协议，主要作用是定义数据包的格式、对数据包进行路由和寻址，以便它们可以跨网络传播并到达正确的目的地。

目前 IP 协议主要分为两种，一种是过去的 IPv4，另一种是较新的 IPv6，目前这两种协议都在使用，但后者已经被提议来取代前者。

### 什么是 IP 地址？IP 寻址如何工作？

IP 地址通常分配给网络接口，用于在特定作用域和路由上下文中标识通信端点。一个接口可以有多个地址，地址也可能动态变化；私有地址可以在不同网络中重复使用，Anycast 地址还可以分配给多个接口。IPv4 地址示例为 `192.168.1.1`，IPv6 地址示例为 `2001:0db8:85a3:0000:0000:8a2e:0370:7334`。

当网络设备发送 IP 数据包时，数据包中包含 **源 IP 地址** 和 **目的 IP 地址**。它们标识本次通信使用的源接口地址和目标地址，而不是设备永久不变的身份。

网络设备根据目的 IP 地址来判断数据包的目的地，并将数据包转发到正确的目的地网络或子网络，从而实现了设备间的通信。

这种基于 IP 地址的寻址方式是互联网通信的基础，它允许数据包在不同网络之间传递。地址是否唯一、能否全局路由取决于地址类型和作用域，不能笼统地把 IP 地址描述为每台设备全球唯一的身份证。

![IP 地址使数据包到达其目的地](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/internet_protocol_ip_address_diagram.png)

### 什么是 IP 地址过滤？

**IP 地址过滤（IP Address Filtering）** 简单来说就是限制或阻止特定 IP 地址或 IP 地址范围的访问。例如，你有一个图片服务突然被某一个 IP 地址攻击，那我们就可以禁止这个 IP 地址访问图片服务。

IP 地址过滤是一种简单的网络安全措施，实际应用中一般会结合其他网络安全措施，如认证、授权、加密等一起使用。单独使用 IP 地址过滤并不能完全保证网络的安全。

### ⭐️ IPv4 和 IPv6 有什么区别？

**IPv4（Internet Protocol version 4）** 是目前广泛使用的 IP 地址版本，其格式是四组由点分隔的数字，例如：123.89.46.72。IPv4 使用 32 位地址作为其 Internet 地址，这意味着共有约 42 亿（2^32）个可用 IP 地址。

![IPv4 地址使用点分十进制格式表示 32 位地址](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/Figure-1-IPv4Addressformatwithdotteddecimalnotation-29c824f6a451d48d8c27759799f0c995.png)

这么少当然不够用啦！为了解决 IP 地址耗尽的问题，最根本的办法是采用具有更大地址空间的新版本 IP 协议 - **IPv6（Internet Protocol version 6）**。IPv6 地址使用更复杂的格式，该格式使用由单或双冒号分隔的一组数字和字母，例如：2001:0db8:85a3:0000:0000:8a2e:0370:7334。IPv6 使用 128 位互联网地址，这意味着越有 2^128（3 开头的 39 位数字，恐怖如斯）个可用 IP 地址。

![IPv6 地址使用十六进制冒号分隔格式表示 128 位地址](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/Figure-2-IPv6Addressformatwithhexadecimalnotation-7da3a419bd81627a9b2cef3b0efb4940.png)

除了更大的地址空间之外，IPv6 的优势还包括：

- **无状态地址自动配置（Stateless Address Autoconfiguration，简称 SLAAC）**：主机可以根据路由器通告的前缀和接口标识生成 IPv6 地址，不必依赖 DHCPv6 分配地址。地址使用前通常会执行重复地址检测（DAD），但 DAD 检查的是本链路内是否存在重复，而且检测并非完全可靠，不能据此声称地址得到“全球唯一”保证。
- **NAT（Network Address Translation，网络地址转换）成为可选项**：IPv6 地址资源充足，可以给全球每个设备一个独立的地址。
- **对标头结构进行了改进**：IPv6 基本头部简化了常见转发路径上的部分处理，但实际性能仍取决于硬件、扩展头、网络策略和具体实现，不能只凭头部结构保证整体性能一定提高。
- **可选的扩展头**：允许在 IPv6 标头中添加不同的扩展头（Extension Headers），用于实现不同类型的功能和选项。
- **ICMPv6（Internet Control Message Protocol for IPv6）**：IPv6 中的 ICMPv6 相较于 IPv4 中的 ICMP 有了一些改进，如邻居发现、路径 MTU 发现等功能的改进，从而提升了网络的可靠性和性能。
- ……

### 如何获取客户端真实 IP？

获取客户端真实 IP 的方法有多种，主要分为应用层方法、传输层方法和网络层方法。

**应用层方法**：

`X-Forwarded-For` 是 HTTP 代理生态中广泛使用但未标准化的请求头；IETF 标准化的对应机制是 HTTP `Forwarded` 头。它们都属于 HTTP，不能直接套用于 SMTP 等其他应用层协议。业务服务也不能无条件信任客户端传入的 `X-Forwarded-For`：可信反向代理应覆盖或规范化外部传入值，服务端只解析由已知代理追加的部分。

**传输层方法**：

利用 TCP Options 字段承载真实源 IP 信息。这种方法适用于任何基于 TCP 的协议，不受应用层的限制。不过，这并非是 TCP 标准所支持的，所以需要通信双方都进行改造。也就是：对于发送方来说，需要有能力把真实源 IP 插入到 TCP Options 里面。对于接收方来说，需要有能力把 TCP Options 里面的 IP 地址读取出来。

也可以通过 Proxy Protocol 协议来传递客户端 IP 和 Port 信息。这种方法可以利用 Nginx 或者其他支持该协议的反向代理服务器来获取真实 IP 或者在业务服务器解析真实 IP。

**网络层方法**：

隧道 + DSR 模式。这种方法可以适用于任何协议，就是实施起来会比较麻烦，也存在一定限制，实际应用中一般不会使用这种方法。

### NAT 的作用是什么？

**NAT（Network Address Translation，网络地址转换）** 主要用于在不同网络之间转换 IP 地址。它允许将私有 IP 地址（如在局域网中使用的 IP 地址）映射为公有 IP 地址（在互联网中使用的 IP 地址）或者反向映射，从而实现局域网内的多个设备通过单一公有 IP 地址访问互联网。

NAT 不光可以缓解 IPv4 地址资源短缺的问题，还会隐藏内部地址和拓扑。许多 NAT 设备的过滤行为使没有既有映射的外部流量难以直接到达内部主机，但决定哪些入站报文可以通过的是过滤策略，而不是地址转换本身。NAT 不能替代状态防火墙、访问控制和主机安全措施。

![NAT 实现 IP地址转换](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/network-address-translation.png)

相关阅读：[NAT 协议详解（网络层）](https://javaguide.cn/计算机基础/计算机网络/nat.html)。

## ARP

### 什么是 Mac 地址？

MAC 地址的全称是 **媒体访问控制地址（Media Access Control Address）**，用于标识链路层接口并在本地网络中传输数据帧。它属于网络接口，而不是整台设备的永久身份证；一台设备可以有多个网络接口，每个接口可以使用不同的 MAC 地址。

![路由器的背面就会注明 MAC 位址](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/router-back-will-indicate-mac-address.png)

MAC 地址也常被称为 LAN 地址、物理地址或以太网地址。与用于网络层路由的 IP 地址不同，MAC 地址主要在当前链路或广播域内使用。

> 还有一点要知道的是，不仅仅是网络资源才有 IP 地址，网络设备也有 IP 地址，比如路由器。但从结构上说，路由器等网络设备的作用是组成一个网络，而且通常是内网，所以它们使用的 IP 地址通常是内网 IP，内网的设备在与内网以外的设备进行通信时，需要用到 NAT 协议。

以太网常见的 MAC 地址是 6 字节（48 比特）的 EUI-48。IEEE 会分配 MA-L、MA-M、MA-S 等不同大小的地址块，由厂商继续分配全局管理地址；此外还存在本地管理地址，不需要由 IEEE 全局分配。操作系统可以修改或随机化 MAC 地址，因此地址并不保证永久不变，不同网络中也可能出现相同地址。

最后，记住，MAC 地址有一个特殊地址：FF-FF-FF-FF-FF-FF（全 1 地址），该地址表示广播地址。

### ⭐️ ARP 协议解决了什么问题？

ARP 协议，全称 **地址解析协议（Address Resolution Protocol）**，它解决的是网络层地址和链路层地址之间的转换问题。因为一个 IP 数据报在物理上传输的过程中，总是需要知道下一跳（物理上的下一个目的地）该去往何处，但 IP 地址属于逻辑地址，而 MAC 地址才是物理地址，ARP 协议解决了 IP 地址转 MAC 地址的一些问题。

### ARP 协议的工作原理？

[ARP 协议详解(网络层)](https://javaguide.cn/计算机基础/计算机网络/arp.html)

## 复习建议

非常推荐大家看一下 《图解 HTTP》这本书，这本书页数不多，但是内容很是充实，不管是用来系统的掌握网络方面的一些知识还是说纯粹为了应付面试都有很大帮助。下面的一些文章只是参考。大二学习这门课程的时候，我们使用的教材是 《计算机网络第七版》（谢希仁编著），不推荐大家看这本教材，书非常厚而且知识偏理论，不确定大家能不能心平气和的读完。

## 参考

- 《图解 HTTP》
- 《计算机网络自顶向下方法》（第七版）
- 什么是 Internet 协议（IP）？：<https://www.cloudflare.com/zh-cn/learning/network-layer/internet-protocol/>
- 透传真实源 IP 的各种方法 - 极客时间：<https://time.geekbang.org/column/article/497864>
- What Is NAT and What Are the Benefits of NAT Firewalls?：<https://community.fs.com/blog/what-is-nat-and-what-are-the-benefits-of-nat-firewalls.html>

<!-- @include: @article-footer.snippet.md -->


---

<!-- source: 计算机网络/能 Ping 通，TCP 就一定能连通吗？.md -->

---
title: 能 Ping 通，TCP 就一定能连通吗？
description: 解释 Ping/ICMP 和 TCP 连通性的区别，说明为什么 Ping 通不代表端口可达，以及 HTTPS 也可能因为 SNI 被识别阻断。
category: 计算机基础
tag:
  - 计算机网络
head:
  - - meta
    - name: keywords
      content: Ping,ICMP,TCP,三次握手,端口连通性,防火墙,TLS,SNI,HTTPS
---

能 Ping 通，TCP 就一定能连通吗？小 G 先给结论：**不是**。

这时候你可能就会有疑问了：明明 Ping 通了，TCP 怎么就挂了？更准确地说，Ping 通只能说明 ICMP Echo 这条路径在当前策略下能往返，不等于目标 TCP 端口一定可达。

说实话，我认真学完了一遍网络，还看了挺多专栏资料，在面试中第一次遇到这个问题时，确实有点懵。

答案其实很简单：**Ping 使用 ICMP，TCP 连接使用 TCP。两者可能经过同一条网络路径，但中间设备会按协议类型、端口、连接状态和安全策略分别处理。**

ICMP 工作在网络层，TCP 工作在传输层，它们在协议栈里根本不在同一层：

![ICMP 和 TCP 位于 TCP/IP 协议栈的不同层次](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-ip-4-model.png)

## Ping 通，只能说明 ICMP 有回应

![ICMP与TCP路径差异](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/can-ping-but-tcp-may-not-connect-icmp-and-tcp-path-differences.png)

Ping 基于 ICMP（Internet Control Message Protocol，互联网控制报文协议），通过发送和接收 ICMP 报文来实现探测。

ICMP 报文分为两类：**查询报文**（如 Ping 用的 Echo Request / Echo Reply，类型分别为 8 和 0）和**差错报文**（报告网络错误情况，如 Destination Unreachable）。

常见系统里的 `ping` 默认使用 Echo 探测：IPv4 下是 ICMP Echo Request / Echo Reply，IPv6 下是 ICMPv6 Echo Request / Echo Reply。它不看端口，也不管目标机器上到底有没有服务在跑。如果是 `tcping`、`hping` 或云厂商探测工具，则要看具体探测类型。

你能 Ping 通一台机器，大概只能说明：ICMP 探测得到了响应；这条 ICMP 请求和响应的路径能走通。如果目标 IP 前面有 NAT、负载均衡、防火墙或 Anycast 调度，ICMP 回复可能来自中间设备或某个边缘节点，不能证明后端服务端口可达。

也只能说明到这个程度。

TCP 要看的东西更多。比如访问 `example.com:443`，客户端要先发 `SYN`，服务端要回 `SYN-ACK`，客户端再回 `ACK`。这三步走完，TCP 连接才算建立起来；后面的 TLS、HTTP、业务鉴权仍然可能失败。

中间任何一步被防火墙丢掉、被安全组拦住，或者服务端压根没人监听这个端口，TCP 都连不上。

所以，`ping` 可以拿来做第一眼判断，但别拿它直接证明 TCP 没问题。

## ICMP 放行了，不代表 TCP 也放行了

很多网络设备会允许 ICMP，因为它对运维很方便。机器在不在线、延迟大不大、有没有明显丢包，`ping` 一下就能看个大概。

但 TCP 规则通常收得更紧。服务器可能只开放 `22`、`80`、`443`，数据库端口、业务端口、调试端口一律不放。

于是就会看到这种情况：

```bash
ping 10.0.0.10
# 通

nc -vz 10.0.0.10 8080
# 超时或 refused
```

这不矛盾，ICMP 和 TCP 端口访问命中的不是同一套放行规则。

这里还要区分两种失败：

1. `Connection timed out` 通常说明 `SYN` 没拿到有效回应，可能是防火墙静默丢弃、路由或回程路径问题；
2. `Connection refused` 通常说明目标返回了 `RST`，常见原因是端口没监听或策略主动拒绝。

| 现象                   | 大致说明                                               |
| ---------------------- | ------------------------------------------------------ |
| `Connection refused`   | 通常收到了 `RST`，端口未监听或被主动拒绝               |
| `Connection timed out` | `SYN` 没拿到有效回应，可能被丢弃、路由异常或回程有问题 |
| `No route to host`     | 本机路由、邻近网络或 ICMP unreachable 相关问题         |
| TLS 握手失败           | TCP 可能已通，继续看 SNI、证书、协议版本或代理策略     |
| HTTP `4xx` / `5xx`     | TCP/TLS 已经走到应用层，问题更可能在应用或网关层       |

还有一种更直接：机器活着，服务没活。主机能回 ICMP，但 Nginx 没启动，或者 MySQL 没监听在你连的地址上。Ping 当然能通，TCP 当然会失败。

## 中间有网关时，更不能只看 Ping

公网 IP 后面经常不是一台真实服务器，而是防火墙、NAT 网关、负载均衡或安全设备。

你收到的 ICMP 响应可能来自 VIP 所在设备、边缘节点，也可能被转发到某个后端；具体取决于 NAT、负载均衡和防火墙实现。不能把 ICMP 响应直接等同于后端应用可用。

但 TCP 请求没这么简单。访问 `公网 IP:443` 时，流量可能还要继续转发到后端机器。端口映射没配、后端服务挂了、健康检查失败、安全组没放行，都会导致 TCP 卡住。

从外面看，就是一句话：IP 能 Ping 通，端口就是连不上。

所以真排查时，别只敲一个 `ping`。如果目标是域名，先看 DNS 解析结果，尤其是 A / AAAA 记录、CDN 调度和 IPv4 / IPv6 差异：

```bash
dig example.com A +short
dig example.com AAAA +short
```

应用访问和 `ping` 选择的地址族不一定相同，`curl` 还可能按 Happy Eyeballs 在 IPv6 / IPv4 之间择优。必要时可以用 `curl -4`、`curl -6` 或 `curl --resolve` 固定变量。

然后再测端口：

```bash
nc -vz example.com 443
```

如果端口是通的，再看应用层：

```bash
curl -v https://example.com
```

HTTPS 场景下，还可以直接看 TLS 握手：

```bash
openssl s_client -connect example.com:443 -servername example.com -brief
```

多域名共用同一个 IP 时，建议带上 `-servername`，否则可能拿到默认证书，导致误判。

如果还看不清，就抓包确认层次：

```bash
tcpdump -nn host <ip> and port <port>
tcpdump -nn icmp
```

只看到 `SYN` 重传，通常说明 TCP 层还没通；TCP 已建立但 TLS 卡住，再继续看 `ClientHello`、SNI、证书、代理和安全策略。

## HTTPS 也可能卡在 SNI

还有个容易误判的地方：同样是 `443`，同样是 HTTPS，也不代表一定能过。

HTTPS 的正文内容会加密，但 TLS 握手一开始的 `ClientHello` 里，通常会带 SNI（Server Name Indication，TLS 扩展）。SNI 的作用是告诉服务器“我要访问哪个域名”，这样同一个 IP 才能挂多个 HTTPS 站点。

问题是，传统 SNI 通常是明文的。

![TLS 1.2 ECDHE 握手流程](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/https-rsa-ecdhe-tls-1-2-ecdhe-rsa-handshake-process.png)

从上图可以看到，TLS 握手分为多个阶段：ClientHello（携带 SNI、支持的密码套件）→ ServerHello（选定密码套件）→ 证书 → 密钥交换 → 双方计算共享秘密 → 握手完成。中间设备不需要解密 HTTPS 内容，只需要看一眼 `ClientHello`，就可能知道你要访问哪个域名，并按域名策略处理这条连接。

TLS 生态后来引入了 ECH（Encrypted ClientHello）来加密更多 `ClientHello` 信息，包括真实 SNI。不过 ECH 是否生效取决于客户端、服务端、DNS `HTTPS` / SVCB 记录和网络环境，不能默认所有 HTTPS 都已经隐藏 SNI。

命中策略后，中间设备可能静默丢弃、注入 `RST`、终止 TLS、返回拦截页，或者让连接卡在 TLS 握手阶段。具体表现取决于防火墙、代理或安全设备实现。

这类问题抓包时会比较迷惑：TCP 三次握手可能已经成功，连接看起来也建立了，但 `ClientHello` 发出去之后就没响应，或者很快被重置。

所以，“TCP 通了”和“HTTPS 能正常访问”也不是同一句话。前者看三次握手，后者还要看 TLS 握手、SNI、证书、代理和安全策略。

## 小结

`ping` 测的是 ICMP；TCP 要看目标端口有没有监听、三次握手能不能完成、中间设备有没有放行；HTTPS 还可能卡在 TLS 握手，尤其是 SNI 这一步。

反过来也一样：Ping 不通，不代表 TCP 一定不通。有些服务器或云安全组会直接禁 ICMP，但业务端口仍然正常。所以排查时不要用一个命令下结论，要按层验证。

小 G 一般会按这个顺序查：如果是域名，先看 DNS；再用 `ping` 看 ICMP；然后用 `nc` 测端口；最后用 `curl` 或 `openssl s_client` 看 HTTPS/TLS。别让一个 `ping` 过早把问题定性了。

![HTTPS连接排查层次](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/can-ping-but-tcp-may-not-connect-https-connection-troubleshooting-layers.png)


---

<!-- source: 计算机网络/网络攻击常见手段总结（安全）.md -->

---
title: 网络攻击常见手段总结（安全）
description: 总结常见 TCP/IP 攻击与防护思路，覆盖 DDoS、IP/ARP 欺骗、中间人等手段，强调工程防护实践。
category: 计算机基础
tag:
  - 计算机网络
head:
  - - meta
    - name: keywords
      content: 网络攻击,DDoS,IP 欺骗,ARP 欺骗,中间人攻击,扫描,防护
---

> 本文整理完善自[TCP/IP 常见攻击手段 - 暖蓝笔记 - 2021](https://mp.weixin.qq.com/s/AZwWrOlLxRSSi-ywBgZ0fA)这篇文章。

TCP/IP 协议栈追求互联互通，但很多机制在设计之初并没有把今天的攻击规模和对抗强度都考虑进去。

IP 欺骗、SYN Flood、DDoS、ARP 欺骗、DNS 劫持这些攻击，表面上各不相同，本质上都在利用网络协议里的信任假设、资源消耗点或解析链路。

这篇文章主要回答几个问题：

1. TCP/IP 常见攻击手段分别利用了什么机制？
2. IP 欺骗、SYN Flood、DDoS 等攻击大致是怎么发生的？
3. 常见网络攻击会造成哪些影响？
4. 面对这些攻击，通常有哪些基础防御思路？

## IP 欺骗

### IP 是什么？

在网络中，所有的设备都会分配一个地址。这个地址就仿佛小蓝的家地址「**多少号多少室**」，这个号就是分配给整个子网的，「**室**」对应的号码即分配给子网中计算机的，这就是网络中的地址。「号」对应的号码为网络号，「**室**」对应的号码为主机号，这个地址的整体就是 **IP 地址**。

### 通过 IP 地址我们能知道什么？

通过 IP 地址，我们就可以判断访问对象服务器的位置，从而将消息发送到服务器。一般发送者发出的消息首先经过子网的集线器，转发到最近的路由器，然后根据路由位置访问下一个路由器的位置，直到终点。

**IP 头部格式**：

![IP 数据包头部字段格式](https://oss.javaguide.cn/p3-juejin/843fd07074874ee0b695eca659411b42~tplv-k3u1fbpfcp-zoom-1.png)

### IP 欺骗技术是什么？

骗呗，拐骗，诱骗！

IP 欺骗技术就是伪造某台主机的 IP 地址的技术。通过 IP 地址的伪装使得某台主机能够伪装另外的一台主机，而这台主机往往具有某种特权或者被另外的主机所信任。

假设合法用户 **(1.1.1.1)** 已经和服务器建立了 TCP 连接，攻击者可以尝试伪造源 IP 为 **1.1.1.1** 的 RST 报文来中断连接。不过，仅伪造源 IP 还不够：报文还必须命中连接四元组，并通过接收方对 RST 序列号的检查。路径内攻击者可以观察连接序列号；无法观察流量的攻击者则需要猜测可接受的序列号，现代 TCP 实现还可能通过 Challenge ACK 缓解盲 RST 攻击。

如果伪造的 RST 通过校验，服务器会关闭对应连接，合法用户后续发送的数据也无法再沿用这条连接，只能重新建立连接。正因为攻击者还需要获得或猜中连接参数，这类攻击并不是伪造大量源 IP 后发送任意 RST 就一定成功。

![攻击者伪造源 IP 发送 RST 数据段中断合法连接](https://oss.javaguide.cn/p3-juejin/7547a145adf9404aa3a05f01f5ca2e32~tplv-k3u1fbpfcp-zoom-1.png)

### 如何缓解 IP 欺骗？

虽然无法预防 IP 欺骗，但可以采取措施来阻止伪造数据包渗透网络。**入口过滤** 是防范欺骗的一种极为常见的防御措施，如 BCP38（通用最佳实践文档）所示。入口过滤是一种数据包过滤形式，通常在[网络边缘](https://www.cloudflare.com/learning/serverless/glossary/what-is-edge-computing/)设备上实施，用于检查传入的 IP 数据包并确定其源标头。如果这些数据包的源标头与其来源不匹配或者看上去很可疑，则拒绝这些数据包。一些网络还实施出口过滤，检查退出网络的 IP 数据包，确保这些数据包具有合法源标头，以防止网络内部用户使用 IP 欺骗技术发起出站恶意攻击。

## SYN Flood（洪水）

### SYN Flood 是什么？

SYN Flood 是互联网上最原始、最经典的 DDoS（Distributed Denial of Service，分布式拒绝服务）攻击之一，旨在耗尽可用服务器资源，致使服务器无法传输合法流量。

SYN Flood 利用了 TCP 协议的三次握手机制，攻击者通常利用工具或者控制僵尸主机向服务器发送海量的变源 IP 地址或变源端口的 TCP SYN 报文，服务器响应了这些报文后就会生成大量的半连接，当系统资源被耗尽后，服务器将无法提供正常的服务。
增加服务器性能、提供更多的连接能力对于 SYN Flood 的海量报文来说杯水车薪。防御 SYN Flood 的关键在于判断哪些连接请求来自于真实源，屏蔽非真实源的请求以保障正常的业务请求能得到服务。

![SYN Flood 攻击通过大量半连接耗尽服务器资源](https://oss.javaguide.cn/p3-juejin/2b3d2d4dc8f24890b5957df1c7d6feb8~tplv-k3u1fbpfcp-zoom-1.png)

### TCP SYN Flood 攻击原理是什么？

**TCP SYN Flood** 攻击利用的是 **TCP** 的三次握手（**SYN -> SYN/ACK -> ACK**），假设连接发起方是 A，连接接受方是 B，即 B 在某个端口（**Port**）上监听 A 发出的连接请求，过程如下图所示，左边是 A，右边是 B。

![TCP 三次握手建立连接的正常流程](https://oss.javaguide.cn/p3-juejin/a39355a1ea404323a11ca6644e009183~tplv-k3u1fbpfcp-zoom-1.png)

A 首先发送 **SYN**（Synchronization）消息给 B，要求 B 做好接收数据的准备；B 收到后反馈 **SYN-ACK**（Synchronization-Acknowledgement）消息给 A，这个消息的目的有两个：

- 向 A 确认已做好接收数据的准备，
- 同时要求 A 也做好接收数据的准备，此时 B 已向 A 确认好接收状态，并等待 A 的确认，连接处于**半开状态（Half-Open）**，顾名思义只开了一半；A 收到后再次发送 **ACK**（Acknowledgement）消息给 B，向 B 确认也做好了接收数据的准备，至此三次握手完成，「**连接**」就建立了，

大家注意到没有，最关键的一点在于双方是否都按对方的要求进入了**可以接收消息**的状态。而这个状态的确认主要是双方将要使用的**消息序号（**SequenceNum），**TCP** 为保证消息按发送顺序抵达接收方的上层应用，需要用**消息序号**来标记消息的发送先后顺序的。

**TCP**是「**双工**」（Duplex）连接，同时支持双向通信，也就是双方同时可向对方发送消息，其中 **SYN** 和 **SYN-ACK** 消息开启了 A→B 的单向通信通道（B 获知了 A 的消息序号）；**SYN-ACK** 和 **ACK** 消息开启了 B→A 单向通信通道（A 获知了 B 的消息序号）。

上面讨论的是双方在诚实守信，正常情况下的通信。

但实际情况是，网络可能不稳定会丢包，使握手消息不能抵达对方，也可能是对方故意不按规矩来，故意延迟或不发送握手确认消息。

假设 B 通过某 **TCP** 端口提供服务，B 在收到 A 的 **SYN** 消息时，积极的反馈了 **SYN-ACK** 消息，使连接进入**半开状态**，因为 B 不确定自己发给 A 的 **SYN-ACK** 消息或 A 反馈的 ACK 消息是否会丢在半路，所以会给每个待完成的半开连接都设一个**Timer**，如果超过时间还没有收到 A 的 **ACK** 消息，则重新发送一次 **SYN-ACK** 消息给 A，直到重试超过一定次数时才会放弃。

![SYN Flood 中大量半开连接占用服务器资源](https://oss.javaguide.cn/p3-juejin/7ff1daddcec44d61994f254e664987b4~tplv-k3u1fbpfcp-zoom-1.png)

B 为帮助 A 能顺利连接，需要**分配内核资源**维护半开连接，那么当 B 面临海量的连接 A 时，如上图所示，**SYN Flood** 攻击就形成了。攻击方 A 可以控制肉鸡向 B 发送大量 SYN 消息但不响应 ACK 消息，或者干脆伪造 SYN 消息中的 **Source IP**，使 B 反馈的 **SYN-ACK** 消息石沉大海，导致 B 被大量注定不能完成的半开连接占据，直到资源耗尽，停止响应正常的连接请求。

### SYN Flood 的常见形式有哪些？

恶意用户可通过三种不同方式发起 SYN Flood 攻击：

1. **直接攻击：** 不伪造 IP 地址的 SYN 洪水攻击称为直接攻击。在此类攻击中，攻击者完全不屏蔽其 IP 地址。由于攻击者使用具有真实 IP 地址的单一源设备发起攻击，因此很容易发现并清理攻击者。为使目标机器呈现半开状态，黑客将阻止个人机器对服务器的 SYN-ACK 数据包做出响应。为此，通常采用以下两种方式实现：部署防火墙规则，阻止除 SYN 数据包以外的各类传出数据包；或者，对传入的所有 SYN-ACK 数据包进行过滤，防止其到达恶意用户机器。实际上，这种方法很少使用（即便使用过也不多见），因为此类攻击相当容易缓解 – 只需阻止每个恶意系统的 IP 地址。哪怕攻击者使用僵尸网络（如 [Mirai 僵尸网络](https://www.cloudflare.com/learning/ddos/glossary/mirai-botnet/)），通常也不会刻意屏蔽受感染设备的 IP。
2. **欺骗攻击：** 恶意用户还可以伪造其发送的各个 SYN 数据包的 IP 地址，以便阻止缓解措施并加大身份暴露难度。虽然数据包可能经过伪装，但还是可以通过这些数据包追根溯源。此类检测工作很难开展，但并非不可实现；特别是，如果 Internet 服务提供商（ISP）愿意提供帮助，则更容易实现。
3. **分布式攻击（DDoS）：** 如果使用僵尸网络发起攻击，则追溯攻击源头的可能性很低。随着混淆级别的攀升，攻击者可能还会命令每台分布式设备伪造其发送数据包的 IP 地址。哪怕攻击者使用僵尸网络（如 Mirai 僵尸网络），通常也不会刻意屏蔽受感染设备的 IP。

### 如何缓解 SYN Flood？

#### 扩展积压工作队列

目标设备安装的每个操作系统都允许具有一定数量的半开连接。若要响应大量 SYN 数据包，一种方法是增加操作系统允许的最大半开连接数目。为成功扩展最大积压工作，系统必须额外预留内存资源以处理各类新请求。如果系统没有足够的内存，无法应对增加的积压工作队列规模，将对系统性能产生负面影响，但仍然好过拒绝服务。

#### 回收最先创建的 TCP 半开连接

另一种缓解策略是在填充积压工作后覆盖最先创建的半开连接。这项策略要求完全建立合法连接的时间低于恶意 SYN 数据包填充积压工作的时间。当攻击量增加或积压工作规模小于实际需求时，这项特定的防御措施将不奏效。

#### SYN Cookie

此策略要求服务器创建 Cookie。为避免在填充积压工作时断开连接，服务器使用 SYN-ACK 数据包响应每一项连接请求，而后从积压工作中删除 SYN 请求，同时从内存中删除请求，保证端口保持打开状态并做好重新建立连接的准备。如果连接是合法请求并且已将最后一个 ACK 数据包从客户端机器发回服务器，服务器将重建（存在一些限制）SYN 积压工作队列条目。虽然这项缓解措施势必会丢失一些 TCP 连接信息，但好过因此导致对合法用户发起拒绝服务攻击。

## UDP Flood（洪水）

### UDP Flood 是什么？

**UDP Flood** 也是一种拒绝服务攻击，将大量的用户数据报协议（**UDP**）数据包发送到目标服务器，目的是压倒该设备的处理和响应能力。防火墙保护目标服务器也可能因 **UDP** 泛滥而耗尽，从而导致对合法流量的拒绝服务。

### UDP Flood 攻击原理是什么？

**UDP Flood** 主要通过利用服务器响应发送到其中一个端口的 **UDP** 数据包所采取的步骤。在正常情况下，当服务器在特定端口接收到 **UDP** 数据包时，会经过两个步骤：

- 服务器首先检查是否正在运行正在侦听指定端口的请求的程序。
- 如果没有程序在该端口接收数据包，IPv4 协议栈通常会返回 **ICMP Destination Unreachable**，其中 Type 为 3、Code 为 3，即 **Port Unreachable**。它不是 Ping 使用的 ICMP Echo 报文；实际网络中，这类 ICMP 错误也可能被防火墙丢弃或被协议栈限速。

举个例子。假设今天要联系酒店的小蓝，酒店客服接到电话后先查看房间的列表来确保小蓝在客房内，随后转接给小蓝。

首先，接待员接收到呼叫者要求连接到特定房间的电话。接待员然后需要查看所有房间的清单，以确保客人在房间中可用，并愿意接听电话。碰巧的是，此时如果突然间所有的电话线同时亮起来，那么他们就会很快就变得不堪重负了。

当服务器接收到每个新的 **UDP** 数据包时，它将通过步骤来处理请求，并利用该过程中的服务器资源。发送 **UDP** 报文时，每个报文将包含源设备的 **IP** 地址。在这种类型的 **DDoS** 攻击期间，攻击者通常不会使用自己的真实 **IP** 地址，而是会欺骗 **UDP** 数据包的源 **IP** 地址，从而阻止攻击者的真实位置被暴露并潜在地饱和来自目标的响应数据包服务器。

由于目标服务器利用资源检查并响应每个接收到的 **UDP** 数据包的结果，当接收到大量 **UDP** 数据包时，目标的资源可能会迅速耗尽，导致对正常流量的拒绝服务。

![UDP Flood 通过大量 UDP 数据包消耗服务器资源](https://oss.javaguide.cn/p3-juejin/23dbbc8243a84ed181e088e38bffb37a~tplv-k3u1fbpfcp-zoom-1.png)

### 如何缓解 UDP Flood？

大多数操作系统部分限制了 **ICMP** 报文的响应速率，以中断需要 ICMP 响应的 **DDoS** 攻击。这种缓解的一个缺点是在攻击过程中，合法的数据包也可能被过滤。如果 **UDP Flood** 的容量足够高以使目标服务器的防火墙的状态表饱和，则在服务器级别发生的任何缓解都将不足以应对目标设备上游的瓶颈。

## HTTP Flood（洪水）

### HTTP Flood 是什么？

HTTP Flood 是一种大规模的 DDoS（Distributed Denial of Service，分布式拒绝服务）攻击，旨在利用 HTTP 请求使目标服务器不堪重负。目标因请求而达到饱和，且无法响应正常流量后，将出现拒绝服务，拒绝来自实际用户的其他请求。

![HTTP Flood 通过大量应用层请求压垮目标服务器](https://oss.javaguide.cn/p3-juejin/aa64869551d94c8d89fa80eaf4395bfa~tplv-k3u1fbpfcp-zoom-1.png)

### HTTP Flood 的攻击原理是什么？

HTTP 洪水攻击是“第 7 层”DDoS 攻击的一种。第 7 层是 OSI 模型的应用程序层，指的是 HTTP 等互联网协议。HTTP 是基于浏览器的互联网请求的基础，通常用于加载网页或通过互联网发送表单内容。缓解应用程序层攻击特别复杂，因为恶意流量和正常流量很难区分。

为了获得最大效率，恶意行为者通常会利用或创建僵尸网络，以最大程度地扩大攻击的影响。通过利用感染了恶意软件的多台设备，攻击者可以发起大量攻击流量来进行攻击。

HTTP 洪水攻击有两种：

- **HTTP GET 攻击**：在这种攻击形式下，多台计算机或其他设备相互协调，向目标服务器发送对图像、文件或其他资产的多个请求。当目标被传入的请求和响应所淹没时，来自正常流量源的其他请求将被拒绝服务。
- **HTTP POST 攻击**：一般而言，在网站上提交表单时，服务器必须处理传入的请求并将数据推送到持久层（通常是数据库）。与发送 POST 请求所需的处理能力和带宽相比，处理表单数据和运行必要数据库命令的过程相对密集。这种攻击利用相对资源消耗的差异，直接向目标服务器发送许多 POST 请求，直到目标服务器的容量饱和并拒绝服务为止。

### 如何防护 HTTP Flood？

如前所述，缓解第 7 层攻击非常复杂，而且通常要从多方面进行。一种方法是对发出请求的设备实施质询，以测试它是否是机器人，这与在线创建帐户时常用的 CAPTCHA 测试非常相似。通过提出 JavaScript 计算挑战之类的要求，可以缓解许多攻击。

其他阻止 HTTP 洪水攻击的途径包括使用 Web 应用程序防火墙（WAF）、管理 IP 信誉数据库以跟踪和有选择地阻止恶意流量，以及由工程师进行动态分析。Cloudflare 具有超过 2000 万个互联网设备的规模优势，能够分析来自各种来源的流量并通过快速更新的 WAF 规则和其他防护策略来缓解潜在的攻击，从而消除应用程序层 DDoS 流量。

## DNS Flood（洪水）

### DNS Flood 是什么？

域名系统（DNS）服务器是互联网的“电话簿”；互联网设备通过这些服务器来查找特定 Web 服务器以便访问互联网内容。DNS Flood 攻击是一种分布式拒绝服务（DDoS）攻击，攻击者用大量流量淹没某个域的 DNS 服务器，以尝试中断该域的 DNS 解析。如果用户无法找到电话簿，就无法查找到用于调用特定资源的地址。通过中断 DNS 解析，DNS Flood 攻击将破坏网站、API 或 Web 应用程序响应合法流量的能力。很难将 DNS Flood 攻击与正常的大流量区分开来，因为这些大规模流量往往来自多个唯一地址，查询该域的真实记录，模仿合法流量。

### DNS Flood 的攻击原理是什么？

![DNS Flood 使用大量 DNS 查询淹没 DNS 服务器](https://oss.javaguide.cn/p3-juejin/97ea11a212924900b10d159226783887~tplv-k3u1fbpfcp-zoom-1.png)

域名系统的功能是将易于记忆的名称（例如 example.com）转换成难以记住的网站服务器地址（例如 192.168.0.1），因此成功攻击 DNS 基础设施将导致大多数人无法使用互联网。DNS Flood 攻击是一种相对较新的基于 DNS 的攻击，这种攻击是在高带宽[物联网（IoT）](https://www.cloudflare.com/learning/ddos/glossary/internet-of-things-iot/)[僵尸网络](https://www.cloudflare.com/learning/ddos/what-is-a-ddos-botnet/)（如 [Mirai](https://www.cloudflare.com/learning/ddos/glossary/mirai-botnet/)）兴起后激增的。DNS Flood 攻击使用 IP 摄像头、DVR 盒和其他 IoT 设备的高带宽连接直接淹没主要提供商的 DNS 服务器。来自 IoT 设备的大量请求淹没 DNS 提供商的服务，阻止合法用户访问提供商的 DNS 服务器。

DNS Flood 攻击不同于 [DNS 放大攻击](https://www.cloudflare.com/zh-cn/learning/ddos/dns-amplification-ddos-attack/)。与 DNS Flood 攻击不同，DNS 放大攻击反射并放大不安全 DNS 服务器的流量，以便隐藏攻击的源头并提高攻击的有效性。DNS 放大攻击使用连接带宽较小的设备向不安全的 DNS 服务器发送无数请求。这些设备对非常大的 DNS 记录发出小型请求，但在发出请求时，攻击者伪造返回地址为目标受害者。这种放大效果让攻击者能借助有限的攻击资源来破坏较大的目标。

### 如何防护 DNS Flood？

DNS Flood 对传统上基于放大的攻击方法做出了改变。借助轻易获得的高带宽僵尸网络，攻击者现能针对大型组织发动攻击。除非被破坏的 IoT 设备得以更新或替换，否则抵御这些攻击的唯一方法是使用一个超大型、高度分布式的 DNS 系统，以便实时监测、吸收和阻止攻击流量。

## TCP 重置攻击

在 **TCP** 重置攻击中，攻击者通过向通信的一方或双方发送伪造的 RST 报文，尝试让接收方提前关闭连接。TCP 是否发送或接受 RST，取决于当前连接状态以及报文的序列号、确认号等字段。对于已建立连接，接收方只会在 RST 通过序列号校验后关闭连接；窗口外的 RST 会被丢弃，实现 RFC 5961 防护的端点还会对窗口内但不精确匹配的 RST 发送 Challenge ACK。

**TCP** 重置攻击利用这一机制，通过向通信方发送伪造的重置报文段，欺骗通信双方提前关闭 TCP 连接。如果伪造的重置报文段完全逼真，接收者就会认为它有效，并关闭 **TCP** 连接，防止连接被用来进一步交换信息。服务端可以创建一个新的 **TCP** 连接来恢复通信，但仍然可能会被攻击者重置连接。万幸的是，攻击者需要一定的时间来组装和发送伪造的报文，所以一般情况下这种攻击只对长连接有杀伤力，对于短连接而言，你还没攻击呢，人家已经完成了信息交换。

普通 TCP 不会对 TCP 头部进行密码学认证，因此 TLS 无法保护 TCP 层的 RST。需要在更低层验证报文时，可以使用 IPsec 或 TCP-AO 等机制，但它们需要通信双方和网络环境提供相应支持。

## 模拟攻击

> 以下实验是在 `OSX` 系统中完成的，其他系统请自行测试。

现在来总结一下伪造一个 **TCP** 重置报文要做哪些事情：

- 嗅探通信双方的交换信息。
- 截获一个 `ACK` 标志位置位 1 的报文段，并读取其 `ACK` 号。
- 伪造一个 TCP 重置报文段（`RST` 标志位置为 1），其序列号等于上面截获的报文的 `ACK` 号。这只是理想情况下的方案，假设信息交换的速度不是很快。大多数情况下为了增加成功率，可以连续发送序列号不同的重置报文。
- 将伪造的重置报文发送给通信的一方或双方，使其中断连接。

为了实验简单，我们可以使用本地计算机通过 `localhost` 与自己通信，然后对自己进行 TCP 重置攻击。需要以下几个步骤：

- 在两个终端之间建立一个 TCP 连接。
- 编写一个能嗅探通信双方数据的攻击程序。
- 修改攻击程序，伪造并发送重置报文。

下面正式开始实验。

> 建立 TCP 连接

可以使用 netcat 工具来建立 TCP 连接，这个工具很多操作系统都预装了。打开第一个终端窗口，运行以下命令：

```bash
nc -nvl 8000
```

这个命令会启动一个 TCP 服务，监听端口为 `8000`。接着再打开第二个终端窗口，运行以下命令：

```bash
nc 127.0.0.1 8000
```

该命令会尝试与上面的服务建立连接，在其中一个窗口输入一些字符，就会通过 TCP 连接发送给另一个窗口并打印出来。

![使用 nc 建立本地 TCP 连接并传输数据](https://oss.javaguide.cn/p3-juejin/df0508cbf26446708cf98f8ad514dbea~tplv-k3u1fbpfcp-zoom-1.gif)

> 嗅探流量

编写一个攻击程序，使用 Python 网络库 `scapy` 来读取两个终端窗口之间交换的数据，并将其打印到终端上。代码比较长，下面为一部份，完整代码后台回复 TCP 攻击，代码的核心是调用 `scapy` 的嗅探方法：

![使用 Scapy 嗅探本地 TCP 连接数据包的代码](https://oss.javaguide.cn/p3-juejin/27feb834aa9d4b629fd938611ac9972e~tplv-k3u1fbpfcp-zoom-1.png)

这段代码告诉 `scapy` 在 `lo0` 网络接口上嗅探数据包，并记录所有 TCP 连接的详细信息。

- **iface**：告诉 scapy 在 `lo0`（localhost）网络接口上进行监听。
- **lfilter**：这是个过滤器，告诉 scapy 忽略所有不属于指定的 TCP 连接（通信双方皆为 `localhost`，且端口号为 `8000`）的数据包。
- **prn**：scapy 通过这个函数来操作所有符合 `lfilter` 规则的数据包。上面的例子只是将数据包打印到终端，下文将会修改函数来伪造重置报文。
- **count**：scapy 函数返回之前需要嗅探的数据包数量。

> 发送伪造的重置报文

下面开始修改程序，发送伪造的 TCP 重置报文来进行 TCP 重置攻击。根据上面的解读，只需要修改 prn 函数就行了，让其检查数据包，提取必要参数，并利用这些参数来伪造 TCP 重置报文并发送。

例如，假设该程序截获了一个从（`src_ip`, `src_port`）发往（`dst_ip`, `dst_port`）的报文段，该报文段的 ACK 标志位已置为 1，ACK 号为 `100,000`。攻击程序接下来要做的是：

- 由于伪造的数据包是对截获的数据包的响应，所以伪造数据包的源 `IP/Port` 应该是截获数据包的目的 `IP/Port`，反之亦然。
- 将伪造数据包的 `RST` 标志位置为 1，以表示这是一个重置报文。
- 将伪造数据包的序列号设置为截获数据包的 ACK 号，因为这是发送方期望收到的下一个序列号。
- 调用 `scapy` 的 `send` 方法，将伪造的数据包发送给截获数据包的发送方。

对于我的程序而言，只需将这一行取消注释，并注释这一行的上面一行，就可以全面攻击了。按照步骤 1 的方法设置 TCP 连接，打开第三个窗口运行攻击程序，然后在 TCP 连接的其中一个终端输入一些字符串，你会发现 TCP 连接被中断了！

> 进一步实验

1. 可以继续使用攻击程序进行实验，将伪造数据包的序列号加减 1 看看会发生什么，是不是确实需要和截获数据包的 `ACK` 号完全相同。
2. 打开 `Wireshark`，监听 lo0 网络接口，并使用过滤器 `ip.src == 127.0.0.1 && ip.dst == 127.0.0.1 && tcp.port == 8000` 来过滤无关数据。你可以看到 TCP 连接的所有细节。
3. 在连接上更快速地发送数据流，使攻击更难执行。

## 中间人攻击

猪八戒要向小蓝表白，于是写了一封信给小蓝，结果第三者小黑拦截到了这封信，把这封信进行了篡改，于是乎在他们之间进行搞破坏行动。这个马文才就是中间人，实施的就是中间人攻击。好我们继续聊聊什么是中间人攻击。

### 什么是中间人？

中间人攻击英文名叫 Man-in-the-Middle Attack，简称「MITM 攻击」。指攻击者与通讯的两端分别创建独立的联系，并交换其所收到的数据，使通讯的两端认为他们正在通过一个私密的连接与对方直接对话，但事实上整个会话都被攻击者完全控制。我们画一张图：

![中间人攻击拦截并篡改通信双方消息](https://oss.javaguide.cn/p3-juejin/d69b74e63981472b852797f2fa08976f~tplv-k3u1fbpfcp-zoom-1.png)

从这张图可以看到，中间人其实就是攻击者。通过这种原理，有很多实现的用途，比如说，你在手机上浏览不健康网站的时候，手机就会提示你，此网站可能含有病毒，是否继续访问还是做其他的操作等等。

### 中间人攻击的原理是什么？

举个例子，我和公司签了一个一份劳动合同，一人一份合同。不晓得哪个可能改了合同内容，不知道真假了，怎么搞？只好找专业的机构来鉴定，自然就要花钱。

在安全领域有句话：**我们没有办法杜绝网络犯罪，只好想办法提高网络犯罪的成本**。既然没法杜绝这种情况，那我们就想办法提高作案的成本，今天我们就简单了解下基本的网络安全知识，也是面试中的高频面试题了。

为了避免双方说话不算数的情况，双方引入第三家机构，将合同原文给可信任的第三方机构，只要这个机构不监守自盗，合同就相对安全。

**如果第三方机构内部不严格或容易出现纰漏？**

虽然我们将合同原文给第三方机构了，为了防止内部人员的更改，需要采取什么措施呢？

一种可行的办法是引入 **摘要算法**。哈希函数把任意长度的数据映射为固定长度的摘要。哈希不是加密，不提供可逆解密能力；不同输入也可能产生相同摘要，因此不能把摘要称为绝对唯一值。对于安全的密码学哈希函数，输入发生变化时，摘要通常也会随之变化。

#### 有哪些常用的摘要算法呢？

目前比较常用的加密算法有消息摘要算法和安全散列算法（**SHA**）。**MD5** 是将任意长度的文章转化为一个 128 位的散列值，可是在 2004 年，**MD5** 被证实了容易发生碰撞，即两篇原文产生相同的摘要。这样的话相当于直接给黑客一个后门，轻松伪造摘要。

所以在大部分的情况下都会选择 **SHA 算法**。

**出现内鬼了怎么办？**

看似很安全的场面了，理论上来说杜绝了篡改合同的做法。主要某个员工同时具有修改合同和摘要的权利，那搞事儿就是时间的问题了，毕竟没哪个系统可以完全的杜绝员工接触敏感信息，除非敏感信息都不存在。所以能不能考虑将合同和摘要分开存储呢？

**那如何确保员工不会修改合同呢？**

这确实蛮难的，不过办法总比困难多。我们将合同放在双方手中，摘要放在第三方机构，篡改难度进一步加大。

**那么员工万一和某个用户串通好了呢？**

看来放在第三方的机构还是不好使，同样存在不小风险。所以还需要寻找新的方案，这就出现了**数字签名和证书**。

#### 数字证书和签名有什么用？

同样举个例子。Sum 和 Mike 两个人签合同。Sum 使用签名算法和自己的私钥对合同生成数字签名，再把合同、签名和用于验证的公钥交给 Mike。

![数字签名生成与公钥验签示意图](https://oss.javaguide.cn/p3-juejin/e4b7d6fca78b45c8840c12411b717f2f~tplv-k3u1fbpfcp-zoom-1.png)

Mike 收到后，使用 Sum 的公钥验证签名。验证成功说明签名与该公钥以及当前合同内容相匹配，可以检测合同是否被篡改，并确认签名由持有 Sum 私钥的一方生成。

Mike 如果修改合同内容，原签名将无法通过验证；没有 Sum 的私钥，也无法为修改后的合同生成有效签名。私钥必须由 Sum 妥善保管，公钥则可以提供给验证者。

数字签名应理解为“私钥签名、公钥验证”，而不是普遍意义上的“私钥加密、公钥解密”。RSA、ECDSA、EdDSA 等签名算法的数学过程不同，都以签名和验证来描述更准确。

隐私保护？不是吓唬大家，信息是透明的兄 die，不过尽量去维护个人的隐私吧，今天学习对称加密和非对称加密。

大家先读读这个字“钥”,是读"yao"，我以前也是，其实读"yue"

#### 什么是对称加密？

对称加密，顾名思义，加密方与解密方使用同一钥匙（秘钥）。具体一些就是，发送方通过使用相应的加密算法和秘钥，对将要发送的信息进行加密；对于接收方而言，使用解密算法和相同的秘钥解锁信息，从而有能力阅读信息。

![对称加密中通信双方使用同一密钥加解密](https://oss.javaguide.cn/p3-juejin/ef81cb5e2f0a4d3d9ac5a44ecf97e3cc~tplv-k3u1fbpfcp-zoom-1.png)

#### 常见的对称加密算法有哪些？

**DES**

DES 使用的密钥表面上是 64 位的，然而只有其中的 56 位被实际用于算法，其余 8 位可以被用于奇偶校验，并在算法中被丢弃。因此，**DES** 的有效密钥长度为 56 位，通常称 **DES** 的密钥长度为 56 位。假设秘钥为 56 位，采用暴力破 Jie 的方式，其秘钥个数为 2 的 56 次方，那么每纳秒执行一次解密所需要的时间差不多 1 年的样子。当然，没人这么干。**DES** 现在已经不是一种安全的加密方法，主要因为它使用的 56 位密钥过短。

![DES 对称加密算法示意图](https://oss.javaguide.cn/p3-juejin/9eb3a2bf6cf14132a890bc3447480eeb~tplv-k3u1fbpfcp-zoom-1.jpeg)

**IDEA**

国际数据加密算法（International Data Encryption Algorithm）。秘钥长度 128 位，优点没有专利的限制。

**AES**

当 DES 被破解以后，没过多久推出了 **AES** 算法，提供了三种长度供选择，128 位、192 位和 256 位，为了保证性能不受太大的影响，选择 128 即可。

**SM1 和 SM4**

之前几种都是国外的，我们国内自行研究了国密 **SM1** 和 **SM4**。其中 S 都属于国家标准，算法公开。优点就是国家的大力支持和认可。

**总结**：

![常见对称加密算法对比总结](https://oss.javaguide.cn/p3-juejin/578961e3175540e081e1432c409b075a~tplv-k3u1fbpfcp-zoom-1.png)

#### 常见的非对称加密算法有哪些？

在对称加密中，发送方与接收方使用相同的秘钥。那么在非对称加密中则是发送方与接收方使用的不同的秘钥。其主要解决的问题是防止在秘钥协商的过程中发生泄漏。比如在对称加密中，小蓝将需要发送的消息加密，然后告诉你密码是 123balala,ok,对于其他人而言，很容易就能劫持到密码是 123balala。那么在非对称的情况下，小蓝告诉所有人密码是 123balala,对于中间人而言，拿到也没用，因为没有私钥。所以，非对称密钥其实主要解决了密钥分发的难题。如下图

![非对称加密使用公钥和私钥完成加解密](https://oss.javaguide.cn/p3-juejin/153cf04a0ecc43c38003f3a1ab198cc0~tplv-k3u1fbpfcp-zoom-1.png)

其实我们经常都在使用非对称加密，比如使用多台服务器搭建大数据平台 Hadoop，为了方便多台机器设置免密登录，是不是就会涉及到秘钥分发。再比如搭建 Docker 集群也会使用相关非对称加密算法。

常见的非对称加密算法：

- RSA（RSA 加密算法，RSA Algorithm）：安全性基于大整数分解的计算难度，应用广泛，兼容性好。缺点是性能相对较慢，且密钥越长（如 2048/4096 位）安全性越高，但运算开销也随之增大。
- ECC：基于椭圆曲线提出，是目前加密强度最高的非对称加密算法。
- SM2：同样基于椭圆曲线问题设计，最大优势就是国家认可和大力支持。

总结：

![常见非对称加密算法对比总结](https://oss.javaguide.cn/p3-juejin/28b96fb797904d4b818ee237cdc7614c~tplv-k3u1fbpfcp-zoom-1.png)

#### 常见的散列算法有哪些？

散列算法常用于完整性校验、内容寻址等场景，但不同场景的安全要求并不相同。密码验证值不能按普通文件摘要处理：服务端应为每个密码生成独立的盐，并使用带成本参数、适合密码存储的哈希方案；同时保存盐、算法标识和成本参数，以便后续提高计算成本或迁移算法。

**MD5**（不推荐）

MD5 可以生成 128 位消息摘要，但已经不具备可靠的抗碰撞能力，不应再用于数字签名、证书、安全完整性校验或密码存储。若只是检测非对抗环境中的偶然传输错误，也要明确它只是校验和，不提供安全保证。MD5、SHA-1 以及一次普通 SHA-256 都不适合直接存储密码。

**SHA**

安全散列算法。**SHA** 包括 **SHA-1**、**SHA-2** 和 **SHA-3** 等系列。它把输入数据映射为固定长度的散列值（或消息摘要），这个过程不可逆，但散列值不是密文，也不等同于消息认证码。SHA-1 已不再适合需要抗碰撞能力的安全场景，新的系统通常选择 SHA-2 或 SHA-3 系列中的具体算法。

**SM3**

国密算法 **SM3**。加密强度和 SHA-256 算法相差不多。主要是受到了国家的支持。

**总结**：

![常见散列算法对比总结](https://oss.javaguide.cn/p3-juejin/79c3c2f72d2f44c7abf2d73a49024495~tplv-k3u1fbpfcp-zoom-1.png)

对称加密、非对称密码和散列算法解决的问题不同：对称加密用于保护大量数据，非对称密码可用于密钥协商、加密或数字签名，散列算法用于生成摘要。具体方案还要根据保密性、完整性、身份认证和密码存储等目标选择，不能只按“是否可逆”判断。

#### 第三方机构和证书机制有什么用？

问题还有，此时如果 Sum 否认给过 Mike 的公钥和合同，不久就麻烦了。

所以需要 Sum 过的话做过的事儿需要足够的信誉，这就引入了**第三方机构和证书机制**。

证书之所以会有信用，是因为证书的签发方拥有信用。所以如果 Sum 想让 Mike 承认自己的公钥，Sum 不会直接将公钥给 Mike，而是提供由第三方机构签发的含有公钥的证书。如果 Mike 也信任这个机构，法律都认可，那信任关系成立。

![第三方机构签发证书并完成验签的过程](https://oss.javaguide.cn/p3-juejin/b1a3dbf87e3e41ff894f39512a10f66d~tplv-k3u1fbpfcp-zoom-1.png)

如上图所示，Sum 将证书申请提交给证书机构。机构核验申请信息后，使用自己的私钥对证书待签名部分生成数字签名。Mike 拿到证书后，使用签发机构的公钥验证签名；验签通过，说明证书内容未被篡改，并且签名由持有该机构私钥的一方生成。

这个方案依赖第三方机构为身份与公钥的绑定关系提供信用背书。如果签发机构被攻破或错误签发，依赖它的证书验证就可能受到影响。

实际 PKI 通常采用根 CA、中间 CA 和终端证书组成的分层结构，便于隔离根私钥、委派签发权限和限制证书用途。链条更长本身并不会自动消除信任风险。

![根证书到终端证书的信任链](https://oss.javaguide.cn/p3-juejin/1481f0409da94ba6bb0fee69bf0996f8~tplv-k3u1fbpfcp-zoom-1.png)

上图中，由信誉最好的根证书机构提供根证书，然后根证书机构去签发二级机构的证书；二级机构去签发三级机构的证书；最后有由三级机构去签发 Sum 证书。

验证 Sum 证书时，需要使用三级机构证书中的公钥验证 Sum 证书的数字签名。

验证三级机构证书时，需要使用二级机构证书中的公钥验证其数字签名。

验证二级机构证书时，需要使用受信根对应的公钥验证其数字签名。客户端还要检查证书有效期、名称、用途、路径约束等条件，最终确认该路径是否锚定到本地信任的根。

以上构成了一条证书信任链。链中的某个受信 CA 如果被攻破或错误签发，就可能在其授权范围内签发欺诈证书，并不需要所有机构同时合谋。

### 中间人攻击如何避免？

既然知道了中间人攻击的原理也知道了他的危险，现在我们看看如何避免。相信我们都遇到过下面这种状况：

![浏览器提示证书不受信任的安全警告](https://oss.javaguide.cn/p3-juejin/0dde4b76be6240699312d822a3fe1ed3~tplv-k3u1fbpfcp-zoom-1.png)

浏览器证书告警表示证书验证没有通过。原因可能是证书过期、域名不匹配、证书链不受信、本机时间错误或服务器配置错误，也可能是中间人攻击；仅凭告警界面无法确定具体原因，用户不应绕过告警继续访问。

受控 App 可以在明确的威胁模型下考虑证书或公钥固定，但需要同时设计证书轮换、备用密钥和失效恢复机制，否则证书更新时可能导致客户端无法连接。对于普通浏览器访问，正确做法是依赖系统信任库完成证书链、域名和有效期校验，而不是自行信任未知证书。

## DDoS

通过上面的描述，前面好多种攻击都属于 DDoS 攻击，所以简单总结一下这个攻击的相关内容。

其实，像全球互联网各大公司，均遭受过大量的 **DDoS**。

2018 年，GitHub 在一瞬间遭到高达 1.35Tbps 的带宽攻击。这次 DDoS 攻击几乎可以堪称是互联网有史以来规模最大、威力最大的 DDoS 攻击了。在 GitHub 遭到攻击后，仅仅一周后，DDoS 攻击又开始对 Google、亚马逊甚至 Pornhub 等网站进行了 DDoS 攻击。后续的 DDoS 攻击带宽最高也达到了 1Tbps。

### DDoS 攻击究竟是什么？

DDos 全名 Distributed Denial of Service，翻译成中文就是**分布式拒绝服务**。指的是处于不同位置的多个攻击者同时向一个或数个目标发动攻击，是一种分布的、协同的大规模攻击方式。单一的 DoS 攻击一般是采用一对一方式的，它利用网络协议和操作系统的一些缺陷，采用**欺骗和伪装**的策略来进行网络攻击，使网站服务器充斥大量要求回复的信息，消耗网络带宽或系统资源，导致网络或系统不胜负荷以至于瘫痪而停止提供正常的网络服务。

> 举个例子

我开了一家有五十个座位的重庆火锅店，由于用料上等，童叟无欺。平时门庭若市，生意特别红火，而对面二狗家的火锅店却无人问津。二狗为了对付我，想了一个办法，叫了五十个人来我的火锅店坐着却不点菜，让别的客人无法吃饭。

上面这个例子讲的就是典型的 DDoS 攻击，一般来说是指攻击者利用“肉鸡”对目标网站在较短的时间内发起大量请求，大规模消耗目标网站的主机资源，让它无法正常服务。在线游戏、互联网金融等领域是 DDoS 攻击的高发行业。

攻击方式很多，比如 **ICMP Flood**、**UDP Flood**、**NTP Flood**、**SYN Flood**、**CC 攻击**、**DNS Query Flood**等等。

### 如何应对 DDoS 攻击？

#### 高防服务器

还是拿开的重庆火锅店举例，高防服务器就是我给重庆火锅店增加了两名保安，这两名保安可以让保护店铺不受流氓骚扰，并且还会定期在店铺周围巡逻防止流氓骚扰。

高防服务器主要是指能独立硬防御 50Gbps 以上的服务器，能够帮助网站拒绝服务攻击，定期扫描网络主节点等。

#### 黑名单

面对火锅店里面的流氓，我一怒之下将他们拍照入档，并禁止他们踏入店铺，但是有的时候遇到长得像的人也会禁止他进入店铺。这个就是设置黑名单，此方法秉承的就是“错杀一千，也不放一百”的原则，会封锁正常流量，影响到正常业务。

#### DDoS 清洗

**DDos** 清洗，就是我发现客人进店几分钟以后，但是一直不点餐，我就把他踢出店里。

**DDoS** 清洗会对用户请求数据进行实时监控，及时发现 **DOS** 攻击等异常流量，在不影响正常业务开展的情况下清洗掉这些异常流量。

#### CDN 加速

CDN 加速，我们可以这么理解：为了减少流氓骚扰，我干脆将火锅店开到了线上，承接外卖服务，这样流氓找不到店在哪里，也耍不来流氓了。

在现实中，CDN 服务将网站访问流量分配到了各个节点中，这样一方面隐藏网站的真实 IP，另一方面即使遭遇 **DDoS** 攻击，也可以将流量分散到各个节点中，防止源站崩溃。

## 参考

- HTTP 洪水攻击 - CloudFlare：<https://www.cloudflare.com/zh-cn/learning/ddos/http-flood-ddos-attack/>
- SYN 洪水攻击：<https://www.cloudflare.com/zh-cn/learning/ddos/syn-flood-ddos-attack/>
- 什么是 IP 欺骗？：<https://www.cloudflare.com/zh-cn/learning/ddos/glossary/ip-spoofing/>
- 什么是 DNS 洪水？| DNS 洪水 DDoS 攻击：<https://www.cloudflare.com/zh-cn/learning/ddos/dns-flood-ddos-attack/>

<!-- @include: @article-footer.snippet.md -->


---

<!-- source: 计算机网络/为什么 TCP 是面向字节流，UDP 是面向报文？（传输层）.md -->

---
title: 为什么 TCP 是面向字节流，UDP 是面向报文？（传输层）
description: 讲清 TCP 字节流与 UDP 报文的本质差异，解析粘包/拆包成因与解决方案，覆盖 Nagle、Delayed ACK 等常见面试考点。
category: 计算机基础
tag:
  - 计算机网络
head:
  - - meta
    - name: keywords
      content: TCP,UDP,字节流,报文,粘包,拆包,消息边界,Nagle,Delayed ACK,TCP_NODELAY
---

前面说 TCP 是面向字节流，UDP 是面向报文。这个点看起来像一句定义，但很多粘包、拆包问题，其实都藏在这里。

先说结论：**TCP 只保证字节可靠、有序地到达，不保证应用层消息边界；UDP 会保留应用层交给它的报文边界。**

这篇文章主要回答几个问题：

1. 为什么说 TCP 是面向字节流，UDP 是面向报文？
2. TCP 粘包、拆包到底是怎么产生的？
3. 应用层应该如何定义消息边界？
4. Nagle 算法和 Delayed ACK 为什么可能让小包变慢？

举个例子，应用层连续发送两条消息：

```
消息 1：hello
消息 2：world
```

如果用 UDP 发送，通常会对应两个 UDP 数据报。接收方调用 `recvfrom()` 时，也是按数据报来读：一次读取一个 UDP 报文，不会把两次发送的报文合成一个流。UDP 的接收队列里，一个元素就是一个数据报，消息边界天然保留了下来。

不过这里也有一个细节：UDP 保留的是传输层报文边界，不代表它适合发送任意大的消息。数据报太大时，底层 IP 层仍可能分片；接收端缓冲区太小时，也可能出现截断。所以 UDP 的“面向报文”不是“随便发多大都没事”，而是说它不会像 TCP 那样把应用数据抽象成一条连续字节流。RFC 768 对 UDP 的定义就是 datagram mode，并说明它提供的是最小协议机制，不保证可靠交付和去重。

如果用 TCP 发送，就不能这么理解。应用层调用两次 `send()`，只是把两段字节写进内核发送缓冲区。至于这些字节什么时候发、合成几个 TCP 段发、对端一次 `recv()` 能读到多少，都不是由这两次 `send()` 直接决定的。

比如，接收端可能一次读到（粘包）：

```
helloworld
```

也可能分几次读到（拆包）：

```
hel
lowor
ld
```

这不是 TCP 出错，而是 TCP 的工作方式本来就是这样。TCP 处理的是连续字节流，它只关心这些字节是否可靠、有序地到达，不关心应用层定义的“第几条消息”从哪里开始、到哪里结束。RFC 9293 也明确提到，TCP segment 和应用层 `send()` / socket write 的边界通常不是一一对应的，TCP 不保证应用读写缓冲区边界和网络分段边界相关。

![TCP 与 UDP 的消息边界](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-udp-byte-stream-tcp-udp-message-boundary.png)

所以，“TCP 粘包/拆包”这个说法更像是应用层视角下的现象。严格来说，TCP 没有“包”的概念，它传的是连续字节流。真正需要解决的是：**应用层协议如何定义消息边界**。

#### 为什么会出现粘包和拆包？

常见原因有这几个。

**1. TCP 是字节流协议，没有应用层消息边界。**

TCP 负责把字节可靠、有序地送到对端，但不会记录“这 20 个字节是第一条消息，那 30 个字节是第二条消息”。

**2. 一次 `send()` 不等于一次网络发送。**

`send()` 成功通常只表示数据从应用进程拷贝到了内核发送缓冲区。至于什么时候真正发出去、拆成几个 TCP 段发，要看 MSS、发送窗口、拥塞窗口、Nagle 算法、网卡队列等因素。

**3. 一次 `recv()` 也不等于读到一条完整消息。**

接收端只是从 TCP 接收缓冲区取字节。缓冲区里可能已经堆了多条消息，也可能只有半条消息。`recv()` 只会把当前可读的数据拷贝给应用，不会帮你按业务消息切分。

**4. 小包优化可能改变发送时机。**

Nagle 算法、Delayed ACK、Linux 自动合并小写入等机制，都可能影响小数据的发送时机。比如 Linux 从 3.14 开始有 `tcp_autocorking`，内核会尽量合并连续的小写入，减少发送包数量；应用也可以用 `TCP_CORK` 明确控制何时“拔塞”发送。

这也是为什么在 Netty、Dubbo、自定义 RPC、IM 网关、游戏服务里，协议编解码都很重要。只要底层用的是 TCP，就必须在应用层定义清楚消息边界。

![TCP 粘包 / 拆包为什么会出现？](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-udp-byte-stream-tcp-sticky-split-causes.png)

#### 怎么解决 TCP 粘包/拆包？

核心思路只有一个：**让接收方知道一条消息到哪里结束。**

![应用层如何定义消息边界？](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-udp-byte-stream-tcp-message-boundary-solutions.png)

常见做法有三种。

**1. 固定长度**

规定每条消息都是固定长度，比如 64 字节。接收方每读满 64 字节，就认为读到了一条完整消息。

这种方式实现简单，但灵活性差。消息短了要补齐，浪费空间；消息长了又要额外拆分。它适合消息格式非常固定的场景，不太适合通用业务协议。

**2. 分隔符**

在消息之间加特殊分隔符，比如换行符 `\n`、`\r\n`，或者自定义结束标记。

```
hello\n
world\n
```

接收方不断从缓冲区读数据，只要遇到分隔符，就切出一条完整消息。很多文本协议都会用类似思路。

这种方式直观，但要注意两个问题：第一，分隔符可能刚好出现在消息体里，这时需要转义；第二，分隔符本身也可能被拆在两次读取里，所以接收端解析时不能假设一次 `recv()` 就能读到完整分隔符。

**3. 长度头**

这是工程里更常见的一种方式。协议头里固定放一个长度字段，表示后面的消息体有多少字节。

```
| 4 字节长度 | 消息体 |
```

接收方先读固定长度的协议头，解析出消息体长度，再继续读取指定字节数。只要没有读满，就继续等待；如果读多了，就把多出来的字节留在缓冲区，作为下一条消息的开头。

很多二进制协议、RPC 协议都会用这种方式。实际设计时，协议头里通常不只放长度，还会放魔数、版本号、消息类型、序列号、序列化方式等字段。

长度头方案也有坑。长度字段要约定字节序，通常使用网络字节序；还要限制最大包体长度，避免对端传一个特别大的长度值，把内存撑爆。线上做协议解析时，不能只考虑正常路径，还要处理半包、异常长度、连接中途关闭、恶意构造请求等情况。

#### Nagle 算法和 Delayed ACK 为什么会让小包变慢？

讲粘包时，经常会顺带问到 Nagle 算法。

Nagle 算法的目标是减少小包数量。早期网络带宽有限，如果应用每次只写 1 个字节，TCP/IP 头部却有几十个字节，网络里就会充满“小包”，效率很低。RFC 896 讨论的就是这类 small-packet problem，并提出当连接上还有未确认数据时，新的小数据可以先暂缓发送，等 ACK 到来后再继续发送。

Delayed ACK 是接收端的优化。接收端收到数据后，不一定立刻发 ACK，而是等一小段时间，看能不能把 ACK 和要返回的数据一起发出去，减少纯 ACK 包数量。RFC 9293 也把这种“少于每个数据段一个 ACK”的策略称为 delayed ACK。

这两个机制单独看都有道理，放在一起就可能放大延迟。典型场景是：

```
客户端 write 小数据 A
客户端马上 write 小数据 B
客户端等待服务端响应
```

![Nagle + Delayed ACK 为什么可能让小包变慢？](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-udp-byte-stream-nagle-delayed-ack-latency.png)

小数据 A 发出去了，小数据 B 可能因为 Nagle 算法暂存在发送缓冲区里，等待 A 的 ACK。服务端收到 A 后，如果暂时没有业务响应要返回，Delayed ACK 又可能延迟发送 ACK。于是发送端等 ACK，接收端等更多数据或等延迟确认定时器，延迟就被放大了。

这类问题在短小 RPC、交互式协议、游戏同步、远程终端里更容易被感知。

解决思路不是“无脑关 Nagle”。更稳的做法是：

- 能合并的小写入，在应用层先合并成一次完整消息，再调用一次 `write()`。
- 请求/响应模型里，尽量避免连续多次小 `write()` 后马上等待响应。
- 对延迟敏感、消息很小的连接，可以评估开启 `TCP_NODELAY`，让小数据尽快发送。
- 对吞吐优先、希望攒够数据再发的场景，可以在 Linux 上评估 `TCP_CORK`，但它不适合写跨平台代码。
- 调参前先抓包确认，不要看到“慢”就直接改 socket 选项。

在 Java 里，很多网络框架都会暴露 `TCP_NODELAY` 配置，例如 Netty 的 `ChannelOption.TCP_NODELAY`。它确实能降低小消息的等待时间，但也可能增加小包数量。对高 QPS 服务来说，这个 trade-off 要结合消息大小、RTT、吞吐、CPU 和网卡包量一起看。Linux `tcp(7)` 也说明，`TCP_NODELAY` 会关闭 Nagle 算法，而 `TCP_CORK` 则用于避免发送不完整帧、等应用确认“可以发了”再发送。

#### 面试时怎么回答？

可以这么回答：

TCP 是面向字节流的。应用层写入的数据会进入内核缓冲区，TCP 只保证这些字节可靠、有序地到达对端，不保证一次 `send()` 对应一次 `recv()`，也不保留应用层消息边界。因此接收方可能一次读到多条消息，也可能只读到半条消息，这就是常说的粘包、拆包现象。

UDP 是面向报文的。应用层交给 UDP 的一次数据会作为一个 UDP 数据报发送，接收端也是按数据报读取，所以天然保留消息边界。不过 UDP 不保证可靠到达，也不保证顺序。

解决 TCP 粘包/拆包，本质是应用层协议自己定义消息边界。常见方案有固定长度、分隔符、长度头。工程里更常用长度头，因为它对二进制协议和变长消息更友好，但要处理字节序、最大长度限制、半包缓存和异常连接关闭等问题。

<!-- @include: @article-footer.snippet.md -->


---

<!-- source: 计算机网络/一台主机上只能保持最多 65535 个 TCP 连接吗？.md -->

---
title: 一台主机上只能保持最多 65535 个 TCP 连接吗？
description: 从 TCP 四元组、临时端口、文件描述符、内存、TIME_WAIT 与 NAT 等角度，解释一台主机能保持多少 TCP 连接。
category: 计算机基础
tag:
  - 计算机网络
head:
  - - meta
    - name: keywords
      content: TCP连接数,65535,TCP四元组,TIME_WAIT,临时端口,文件描述符,NAT
---

一台主机最多只能保持 65535 个 TCP 连接吗？小 G 先给结论：**不是**。

`65535` 这个数字来自端口号范围。TCP 首部里的源端口和目的端口字段都是 16 位，可以表示 `0~65535`，一共 2^16 = 65536 个取值。**65535 是最大端口号，不是连接数上限。**

但 TCP 连接数和端口号数不是一回事。要搞清楚这个问题，得从 TCP 连接是怎么被标识的开始讲。

## TCP 连接靠四元组来区分

TCP 连接不是靠“本地端口”唯一标识，而是靠四元组标识：

```text
源 IP、源端口、目的 IP、目的端口
```

只要四元组不同，内核就可以把它们识别为不同连接。

为了避免混淆，下面统一用**客户端发起连接时的视角**来写四元组：`（客户端 IP, 客户端端口, 服务端 IP, 服务端端口）`。

假设服务器 IP 是 `192.168.1.100`，监听端口 `8080`：

![TCP 连接靠四元组区分和真正的限制](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/maximum-number-of-tcp-connections-per-host-tcp-four-tuple-and-server-connection.png)

- 客户端 A（`10.0.0.1:50000`）连过来 → 四元组 `(10.0.0.1, 50000, 192.168.1.100, 8080)`
- 客户端 A（`10.0.0.1:50001`）再连过来 → 四元组 `(10.0.0.1, 50001, 192.168.1.100, 8080)`
- 客户端 B（`10.0.0.2:50000`）连过来 → 四元组 `(10.0.0.2, 50000, 192.168.1.100, 8080)`

三条连接，服务端的 IP 和端口都没变，但因为客户端 IP 或端口不同，四元组各不相同，所以是三条独立的连接。

这里有个容易混淆的点：服务端 `8080` 端口只有**一个监听 socket**，但每 `accept()` 一次，内核就会生成一个新的**已连接 socket**，用四元组来区分。所以多个连接共享同一个服务端端口，完全不冲突。

## 为什么服务端可以超过 65535？

假设 Web 服务监听 `192.168.1.100:443`，服务端 IP 和端口固定，但客户端 IP 和端口会变化。比如 `(10.0.0.1, 50001, 192.168.1.100, 443)` 和 `(10.0.0.2, 50001, 192.168.1.100, 443)` 的服务端端口都是 443，但四元组不同，所以是两条不同 TCP 连接。

纯从 IPv4 四元组组合看，固定服务端 IP 和端口后，客户端 IP 理论上有 `2^32` 种可能，客户端端口有 `2^16` 种可能，理论组合数非常大。

真实上限来自资源和配置。

## 真正的限制是什么？

**1、文件描述符（File Descriptor，FD）和内存。**

在 Linux 里，socket 也是文件。对应用进程来说，`accept()` 后的每条已建立连接通常对应一个 socket FD；**监听 socket 本身也占一个 FD**。还没被 `accept()` 的连接会先停留在内核队列里，不应简单都算成应用已持有的 FD。

进程可打开文件数不够时，常见报错是 `Too many open files`。

每条 TCP 连接都需要内核维护 socket、TCP 控制块、发送缓冲区、接收缓冲区等数据。连接空闲时开销较小，一旦有数据收发，缓冲区和应用对象也会继续占内存。

不建议死记“一个连接占多少 KB”。这个值会受内核版本、socket 选项、缓冲区大小和业务收发情况影响。

**2、握手队列和 accept 速度。**

Linux 实际上维护两个队列：

- **SYN 队列（半连接队列）**：收到 SYN、发出 SYN-ACK、尚未完成三次握手的连接，受 `tcp_max_syn_backlog` 限制，实际大小还会结合 `somaxconn` 和 `listen()` backlog 计算。
- **accept 队列（全连接队列）**：已完成握手、等待应用 `accept()` 的连接，上限为 `min(listen(fd, backlog), net.core.somaxconn)`。

它们影响的是**连接建立阶段的排队和丢弃**，不是 ESTABLISHED 连接总数的简单上限。

半连接队列溢出时，Linux 可以启用 SYN Cookie 机制：服务端把必要信息编码进 SYN-ACK 的序列号，不在本地保留完整的半连接状态，收到合法 ACK 后再重建连接信息。SYN Cookie 是防护手段，不是扩容手段。

全连接队列溢出时，行为取决于 `tcp_abort_on_overflow`：默认值 `0` 时，服务端会丢弃客户端发来的 ACK，让客户端重传，服务端有机会重传 SYN-ACK；设为 `1` 时，直接回复 RST，快速失败。生产环境通常保持默认值 `0`，避免误拒正常连接。排查全连接队列溢出可以用 `ss -ltn`：如果 Recv-Q 长时间接近 Send-Q，说明 accept 不够及时，要检查应用线程池是否卡住或 backlog 配置是否过小。

**3、CPU、网卡和业务处理能力。**

空闲长连接主要考验内存、FD 上限、内核连接表和连接保活策略；活跃连接还会带来系统调用、加解密、协议解析、线程调度和网卡中断等压力。

## 客户端为什么更容易撞到端口限制？

![客户端直连和 NAT 网关瓶颈](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/maximum-number-of-tcp-connections-per-host-client-and-nat-port-restriction.png)

服务端不是 65535 上限，但客户端访问同一个目标时，临时端口可能先耗尽。

例如客户端固定为 `192.168.1.10`，不断连接 `10.0.0.1:443`。这时目的 IP、目的端口、源 IP 都固定，只剩源端口可变。源端口用完后，就无法再创建新四元组。

Linux 自动分配临时端口范围可以这样看：

```bash
sysctl net.ipv4.ip_local_port_range
```

Mac 下可以这样查看：

![Mac 下自动分配临时端口范围查看](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/check-automatic-temporary-port-range-mac.jpg)

很多 Linux 环境默认临时端口范围是 `32768 60999`，大约 2.8 万个端口；实际值以 `sysctl net.ipv4.ip_local_port_range` 输出为准，且不是全部 `0~65535` 都会自动拿来做临时端口。

看到 `Cannot assign requested address` / `EADDRNOTAVAIL`、大量 `connect` 失败，且目标 `IP:Port` 很集中时，要怀疑临时端口耗尽或 `TIME_WAIT` 堆积。

## NAT 网关这层也可能先顶不住

还有一种情况容易被忽略：很多内网机器并不是直接访问公网，而是先经过 NAT 网关。

NAT 做的事情是把内网地址转换成公网地址。比如内网机器 `192.168.1.10:50000` 访问外部服务时，NAT 可能会改成 `203.0.113.1:40000`，并在本地记录这条映射。响应包回来后，再根据映射关系转发回原来的内网机器。

如果大量内网机器共享同一个公网 IP，并集中访问**同一个外部 `IP:Port`**，NAT 侧可用的公网源端口数量就会成为限制因素。如果目标分散，端口复用空间会更大。端口不够只是其中一类问题，NAT 设备的连接跟踪表、CPU、内存也可能先到瓶颈。

所以排查连接数问题时，不要只盯着客户端和服务端，链路中间的 NAT 网关也要看。

常见的 NAT 侧排查指标包括：NAT 连接跟踪表使用率、SNAT 端口使用率、单公网 IP 到单目标的连接数，以及 NAT 设备的 CPU、内存、丢包和连接创建速率。如果 NAT 确实成了瓶颈，可以考虑增加公网 IP、拆分出口或做连接复用。

## TIME_WAIT 会怎样影响连接数？

![TIME_WAIT 状态占用本地端口并影响可建立连接数](https://oss.javaguide.cn/github/javaguide/ai/上下文工程/how-time-wait-affects-number-of-connections.png)

典型情况下，**主动关闭连接的一方会进入 `TIME_WAIT`**——因为它需要在发送最后一个 ACK 后等待一段时间，防止最后 ACK 丢失以及旧报文影响后续连接。（同时关闭场景下，双方都会进入 TIME_WAIT，不过日常碰到的绝大多数是前者。）

问题在于，`TIME_WAIT` 会让对应连接在一段时间内不能被随意复用。对客户端高频短连接同一目标来说，可用临时端口会被大量 `TIME_WAIT` 消耗，从而更容易撞到端口上限。

这也是为什么高并发调用**优先建议使用连接池和 HTTP keep-alive**，从源头减少短连接创建。

说到连接复用，很多人分不清 TCP Keepalive 和 HTTP Keep-Alive，其实它们解决的问题完全不同。

简单说：HTTP Keep-Alive 管的是“一条连接最多用多久、服务多少次请求”，TCP Keepalive 管的是“如果长时间没数据，检查一下对方是不是已经消失了”。两者互不干扰，也不能互相替代。详细介绍可以看这篇文章：[TCP Keepalive 和 HTTP Keep-Alive 有什么区别？](./TCP Keepalive 和 HTTP Keep-Alive 有什么区别？.md)。

至于内核参数，别一看到 `TIME_WAIT` 多就急着改。

`tcp_tw_reuse` 要结合内核版本、业务场景和真实的端口耗尽证据来看，不适合当成万能优化项。`tcp_tw_recycle` 更不用碰了，Linux 4.12 之后已经被移除。

也别想着清理 TIME_WAIT。它不是脏东西，而是 TCP 协议里的正常机制。

看到 `TIME_WAIT` 数量很多，第一反应应该是回到业务链路看问题：是不是一直在创建短连接？连接池有没有生效？HTTP keep-alive 有没有打开？客户端是不是每次请求完都主动断开？

生产环境里很常见的一个坑，就是**连接池没配好，最后把临时端口耗光了**。

比如：

- HTTP 客户端没开 keep-alive，也没用连接池，每次请求都新建连接，请求完就关，`TIME_WAIT` 很快堆起来。
- 连接池最大连接数、每个目标地址的连接数配置太小，导致连接一直被创建和销毁。
- DNS 最后解析到单个 IP，请求目标太集中，四元组里主要只剩源端口在变，更容易把端口打满。

排查这类问题，优先修连接复用。确认连接池、keep-alive、超时和关闭策略都没问题之后，再考虑扩大临时端口范围，或者增加源 IP。不要一上来就改内核参数。

![TIME_WAIT 与 CLOSE_WAIT 问题的排查流程](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-time-wait-close-wait-troubleshooting-flowchart.png)

排查时可以用 `ss -ant` 统计各 TCP 状态数量，`ss -ant state time-wait | awk 'NR>1 {print $5}' | sort | uniq -c | sort -nr | head` 查看 TIME_WAIT 集中在哪些目标，`ss -ltn` 查看监听 socket 的 accept queue 堆积情况。看到 TIME_WAIT 集中在某个远端服务，检查短连接和连接池；看到 CLOSE_WAIT 集中在某个本地进程，优先查应用代码有没有正确关闭连接。

## 回到问题

一台主机最多只能保持 65535 个 TCP 连接吗？

答案是：不能这么理解。

`65535` 对应的是端口号范围，不是 TCP 连接数上限。TCP 连接靠四元组区分：源 IP、源端口、目的 IP、目的端口。服务端监听同一个端口时，只要客户端 IP 或客户端端口不同，连接就可以继续增加。

不过，理论上能区分出来，不代表机器一定扛得住。实际连接数通常会被文件描述符、内存、CPU、网卡、应用处理能力、握手队列等资源限制住。客户端如果频繁短连接访问同一个目标，还会碰到临时端口和 `TIME_WAIT` 的压力；如果中间经过 NAT，还要看 NAT 网关能不能撑住。

小 G 这里再压缩成一句话：**服务端连接数主要看机器资源，客户端连同一个目标主要看临时端口，中间有 NAT 时还要看 NAT 网关。`65535` 只是端口号上限，不是所有 TCP 连接的上限。**


---

<!-- source: 计算机网络/有了 HTTP 协议，为什么还要 RPC？HTTP 与 RPC 区别对比.md -->

---
title: 有了 HTTP 协议，为什么还要 RPC？HTTP 与 RPC 区别对比
category: 计算机基础
description: 深入对比 HTTP 与 RPC 的本质区别，解析微服务通信选型。涵盖序列化性能、连接复用、gRPC、RESTful、服务治理等核心知识点。
head:
  - - meta
    - name: keywords
      content: HTTP,RPC,HTTP vs RPC区别,微服务通信,RPC协议,TCP通信,序列化协议,RESTful,gRPC,Dubbo,Protobuf,服务调用,远程调用,HTTP协议,微服务选型
---

你好，我是小 G。在我大二下学期那年，看黑马的免费课程，第一次接触到 RPC，当时还是挺懵逼的。

HTTP 接口不是已经能调了吗？

前端调后端是 HTTP，服务端调服务端也可以用 HTTP。写一个 `/user/getById` 接口，传个用户 ID，返回用户信息，这不也能完成远程调用吗？

那为什么还要再搞一个 RPC 增加学习成本呢？这不纯闹嘛！

更容易让人混乱的是，很多文章特别喜欢把 HTTP 和 RPC 放在一起对比，好像它们是同一层的两个协议。看完之后你可能记住了几句话：**HTTP 面向资源，RPC 面向方法；HTTP 对外，RPC 对内；RPC 性能更好。**

这些话不是完全错，但太粗了。

真到项目里，你还是会遇到问题：**用 HTTP 行不行？用 RPC 是不是过度设计？gRPC 明明基于 HTTP/2，为什么又说它是 RPC？**

这篇文章就围绕这个问题聊清楚。

## RPC 不是某一个具体协议

这是一个常见的误区，开始后面的文章之前，非常有必要先提一下。

**HTTP 是协议。而 RPC 不是某一个具体协议，它更像是一种调用方式。**

RPC 全称是 Remote Procedure Call，翻译过来就是远程过程调用。它想解决的问题很朴素：**让你调用远程服务时，尽量像调用本地方法一样。**

![RPC 通过本地代理隐藏远程调用细节](https://oss.javaguide.cn/github/javaguide/分布式/rpc/rpc-overview.png)

比如本地代码里调用用户服务：

```java
User user = userService.getUser(1001);
```

如果 `userService` 就在当前进程里，这只是一次普通方法调用。

但如果用户服务部署在另一台机器上，这件事就复杂了。你要发网络请求，要传方法名和参数，要序列化数据，要处理超时、失败、重试，还要拿到返回结果再反序列化。

RPC 框架想做的事情，就是把这些麻烦尽量封装掉。调用方代码看起来还是：

```java
User user = userService.getUser(1001);
```

但底下已经完成了网络通信、序列化、服务寻址和结果返回。

所以更准确的说法不是“HTTP 和 RPC 谁更强”，而是：

**HTTP 是一种应用层协议，RPC 是一种远程调用模型。**

![HTTP：超文本传输协议概览](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/http-overview.png)

具体到实现上，RPC 可以有很多种。Dubbo 是 RPC 框架，Thrift 是 RPC 框架，gRPC 也是 RPC 框架。gRPC 官方文档里也说得很直接：客户端可以像调用本地对象一样，调用另一台机器上服务端应用的方法；服务端定义可远程调用的方法以及参数和返回类型。 

![Dubbo3 使用 Triple 协议同时支持 HTTP/1、HTTP/2 和 HTTP/3](https://oss.javaguide.cn/github/javaguide/分布式/rpc/image-20220716111545343.png)

这就解释了一个很容易绕晕的点：**gRPC 是 RPC，但它基于 HTTP/2。**

它不是 HTTP 的反面，只是在 HTTP/2 之上提供 RPC 调用。

gRPC 的 GitHub 上专门有一篇文章 [gRPC over HTTP2  基于 HTTP2 的 gRPC 协议](https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md) 详细介绍：

![gRPC over HTTP2 基于 HTTP2 的 gRPC 协议](https://oss.javaguide.cn/github/javaguide/分布式/rpc/grpc-over-http2-github.png)

## **光有 TCP 还不够**

要理解 HTTP 和 RPC 的差别，最好先往下看一层。

很多同学知道 HTTP 基于 TCP，RPC 也经常基于 TCP，于是会想：那我直接用 TCP 不就行了吗？

理论上可以，实际很麻烦。

TCP 负责的是可靠传输，它传的是一串连续的字节流。它不关心你的业务消息从哪里开始，到哪里结束。

比如客户端连续发了两次请求：

```text
getUser:1001
getOrder:8888
```

服务端收到的可能不是两段规规整整的消息，而是一段字节流。你必须自己判断：第一条消息在哪里结束，第二条消息从哪里开始。还要考虑半包、粘包、编码、超时、错误码、请求 ID 等问题。

![TCP 与 UDP 的消息边界](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/tcp-udp-byte-stream-tcp-udp-message-boundary.png)

这就是为什么应用层协议一定要定义消息格式。

HTTP 定义了一套通用格式：请求行、Header、Body、状态码等。MDN 对 HTTP 的定义也很清楚：它是应用层协议，最初用于浏览器和 Web 服务器通信，但也可以用于机器之间通信和 API 访问。 

RPC 框架也会定义自己的消息格式。只不过它通常不会围绕 URL 和资源来设计，而是围绕服务、方法、参数和返回值来设计。

说白了，HTTP 和 RPC 都在解决一个问题：

**两个进程隔着网络，怎么把一次业务调用说清楚。**

只是它们的建模方式不一样。

## **HTTP 更像访问资源，RPC 更像调用方法**

HTTP / REST 常见写法是这样的：

```http
GET /users/1001
POST /orders
PUT /orders/888/status
DELETE /comments/9527
```

它的心智模型是资源。

`/users/1001` 是一个用户资源，`GET` 表示读取它；`POST /orders` 表示创建订单；`PUT /orders/888/status` 表示修改订单状态。

这种方式很适合对外开放 API。

因为它通用、好理解、好调试。浏览器能访问，Postman 能调，curl 能测，网关也好处理。你给第三方提供接口时，让对方按 HTTP 文档接入，门槛比较低。

RPC 的写法更像这样：

```java
userService.getUser(1001);
orderService.createOrder(request);
inventoryService.deductStock(skuId, count);
```

它的心智模型是方法调用。

调用方更关心的是：我要调哪个服务？哪个方法？传什么参数？返回什么对象？

![RPC 原理图](https://oss.javaguide.cn/github/javaguide/分布式/rpc/rpc-principle.png)

这和 Java 后端平时写代码的习惯更接近。尤其是微服务内部调用时，服务和服务之间本来就是围绕业务方法协作，比如创建订单、扣库存、查询余额、校验权限。RPC 把这种调用关系表达得更直接。

所以 HTTP 和 RPC 最大的区别，不是一个能不能调通，另一个能不能调通。

两者都能调通。

区别在于：**你是把远程交互建模成一次资源访问，还是一次方法调用。**

## **公司内部为什么更常见 RPC？**

HTTP 当然能做内部服务调用。

很多公司内部服务全用 HTTP，也跑得好好的。尤其是服务规模不大、调用链不复杂的时候，HTTP 更简单。

但服务数量上来之后，RPC 的优势会慢慢变明显。

**第一个明显变化是：调用方不想关心对方机器在哪。**

你写业务代码的时候，最好只关心“我要调用用户服务”，而不是关心用户服务有几台机器、IP 是什么、哪台刚下线、哪台权重高。

这就需要服务发现。

Dubbo 官方文档里对服务发现的描述很典型：Provider 把地址注册到注册中心，Consumer 从注册中心读取并订阅地址列表，地址变化时注册中心通知消费者。Dubbo 支持 Nacos、Consul、ZooKeeper 等常见注册中心。

![Dubbo 架构中的核心角色](https://oss.javaguide.cn/%E6%BA%90%E7%A0%81/Dubbo 面试题总结-架构原理、SPI、负载均衡、服务治理与集群容错/dubbo-relation.jpg)

这类能力当然也可以用 HTTP 做。你可以用注册中心、网关、负载均衡、SDK 自己拼一套。

但 RPC 框架通常会把这些东西直接放进服务调用体系里。

调用方写的是服务接口，底下自动完成服务发现、负载均衡、连接管理、超时控制。业务代码不用到处拼 URL。

**第二个变化是：接口契约会变得更重要。**

HTTP + JSON 很灵活，但灵活也意味着容易松散。

字段名改了，类型改了，枚举值多了一个，调用方可能到运行时才炸。接口文档如果没及时更新，联调时就会很痛苦。

RPC 框架通常会用更强的契约来约束双方。以 gRPC 为例，它常用 Protocol Buffers 作为接口定义语言和消息交换格式。Protocol Buffers 官方文档也说明，它是一种语言无关、平台无关、可扩展的结构化数据序列化机制，可以通过 `.proto` 定义结构并生成不同语言的代码。

这带来的好处是，接口变更更容易被代码生成和编译阶段暴露出来。

当然，契约强不代表不会出事故。

字段怎么兼容，老版本客户端怎么处理，新字段能不能删，枚举能不能改，这些还是要认真设计。只是相比“大家约定一下 JSON 字段”，IDL 会更硬一点。

**第三个变化是：高频内部调用会更在意机器处理效率。**

HTTP + JSON 的好处是可读性强，人类看起来舒服。但机器处理时，它不是最省的方式。字段名、文本格式、解析成本，都会带来额外开销。

RPC 框架常用二进制序列化，比如 Protobuf、Thrift。体积更小，解析也更适合机器处理。

但这里不能说死。

“RPC 一定比 HTTP 快”这句话不严谨。HTTP/2、连接复用、压缩、不同 JSON 库、不同网络环境，都会影响结果。gRPC 自己也基于 HTTP/2，它的优势并不是一句“不是 HTTP”就能解释完。

更稳的说法是：

**在高频服务互调场景里，RPC 框架通常会把序列化、连接复用、超时、重试、负载均衡、链路追踪这些能力做得更贴近内部服务调用。**

这才是它在公司内部常见的原因。

## **RPC 的价值不只是“调用快一点”**

很多人讲 RPC，喜欢把重点放在性能上。

性能当然重要，但我觉得 RPC 更大的价值是服务治理。

一个内部调用真正上线后，不只是发请求、拿响应这么简单。你很快会遇到一堆问题：

- 这个调用超时时间设多少？失败了要不要重试？重试会不会导致重复扣款？
- 下游服务挂了，上游要不要降级？
- 哪个接口最近错误率升高了？
- 一次用户请求经过了几个服务？

这些问题如果全靠业务代码处理，很快就会乱。

RPC 框架通常会和治理能力绑在一起，比如超时控制、负载均衡、服务发现、熔断降级、链路追踪、调用统计等。gRPC 官方介绍里也提到，它支持负载均衡、Tracing、健康检查和认证等可插拔能力。 

HTTP 也能做这些。

很多公司会用 API Gateway、服务网格、HTTP SDK、拦截器、链路追踪组件来补齐。做得好也没问题。

所以不要把 RPC 理解成“比 HTTP 高级的东西”。它更像是把内部服务调用里常见的一堆问题，按“远程方法调用”这条路径整理了一遍。

## **那 HTTP 就不适合内部调用吗？**

并不是的哈。如果服务规模不大，团队人数也不多，反而用 HTTP 更省心。

比如一个后台管理系统，拆了几个服务，调用频率也不高。你用 Spring Boot 写几个 REST 接口，配合 OpenAPI 文档、统一错误码、网关鉴权、日志追踪，完全够用。

强上 RPC 可能还会带来额外成本，没意义。

你要引入注册中心，要维护 IDL，要处理代码生成，要培训团队，还要解决本地调试和网关转发问题。服务没几个，调用链也不复杂的时候，这些成本不一定值得。

HTTP 适合这些场景：

- 对外开放 API，比如 Web、App、第三方合作方接入；
- 团队更看重通用性和调试方便；
- 服务调用频率不高；
- 没有成熟 RPC 基础设施；
- 已经有统一 HTTP 网关、SDK、限流、鉴权和监控体系。

这里有个很简单的判断，分享给大家：

**如果你的系统用 HTTP 已经稳定跑着，也没有明显的调用治理痛点，就没必要为了“微服务味更浓”换 RPC。**

技术选型不是贴标签。

能稳定解决问题更重要。

## **gRPC 为什么容易把人绕晕？**

gRPC 经常让人混乱，就是因为它同时踩在两个概念上。

**一方面，它是 RPC 框架。**

你定义服务和方法，生成客户端和服务端代码，然后像调用方法一样调用远程服务。

**另一方面，它基于 HTTP/2 传输。**

![gRPC over HTTP2 基于 HTTP2 的 gRPC 协议](https://oss.javaguide.cn/github/javaguide/分布式/rpc/grpc-over-http2-github.png)

所以你不能把它简单理解成“HTTP 的对立面”。

更准确地说： **gRPC 用 HTTP/2 做传输，默认使用 Protobuf 作为 IDL 和消息序列化格式，再用 RPC 模型组织调用。**

这里要注意，Protobuf 是 gRPC 最常见的默认搭配，但不是 gRPC 的定义本身。gRPC 协议层允许 `application/grpc+proto`、`application/grpc+json` 或自定义编码。

还有一点经常被忽略：正常 gRPC 响应里，HTTP 层通常是 `:status: 200`，真正的调用结果放在 HTTP/2 Trailers 里的 `grpc-status`、`grpc-message`。

这会带来一个很实际的排查差异。

看 HTTP 接口时，我们习惯先看 HTTP 状态码。`200` 基本代表请求成功，`404` 代表资源不存在，`500` 代表服务端异常。

但看 gRPC 时，不能只看 HTTP 状态码。HTTP 是 200，不代表这次 RPC 业务调用一定成功，还要继续看 `grpc-status`。

这也带来一个工程问题：网关、负载均衡、代理、Service Mesh 是否正确支持 HTTP/2 Trailers，会直接影响 gRPC 调用。如果链路里有组件处理不好 Trailers，问题会很隐蔽。

所以，gRPC 不是“HTTP/2 + Protobuf”这么简单。

HTTP 这一层，它跑在 HTTP/2 上。

编码上，默认搭配 Protobuf，但协议允许其他编码。

调用体验上，它让你像调本地方法一样调远程服务。

状态返回上，它又用了 HTTP/2 Trailers 承载 RPC 调用结果。

这些东西叠在一起，才是它容易把人绕晕的原因。

## **真实选型时，别问哪个更高级**

我更建议你按调用关系选：

- 如果是浏览器、移动端、第三方系统调用，优先 HTTP。原因很简单：通用，接入成本低，调试工具多。对外接口最怕别人接不动。HTTP 在这方面优势太明显了。
- 如果是公司内部微服务高频互调，可以考虑 RPC。尤其是服务数量多、接口数量多、调用链复杂，对超时、重试、注册发现、链路追踪、负载均衡要求都比较高的时候，RPC 框架会省掉很多重复工作。
- 如果团队已经有成熟 HTTP 基础设施，也没必要强上 RPC。比如统一网关、服务发现、SDK、链路追踪、限流熔断都有了，大家也习惯用 HTTP，那继续用 HTTP 没问题。

如果要用 gRPC，要提前想清楚几个问题：

- 浏览器不能像后端服务一样直接使用标准 gRPC，通常需要 gRPC-Web 或代理层；
- 网关和负载均衡是否支持；本地调试是不是方便；
- 团队是否接受 `.proto` 和代码生成；
- 线上排查时二进制消息是否会增加理解成本。

gRPC 很强，但不是零成本。

这点要提前说清楚。

## 几个常见误解

### HTTP 和 RPC 谁性能更好？

不能一刀切。

如果拿 HTTP/1.1 + JSON 去和基于 HTTP/2 + Protobuf 的 gRPC 比，在高频内部调用场景里，后者通常更省。

但换个实现，结果就可能不一样。

消息大小、序列化方式、连接复用、压缩、框架实现、网络环境都会影响结果。真正要比，应该拿你自己的接口、数据量和部署环境压测，而不是背一句“RPC 更快”。

### RPC 是不是只能走 TCP？

不是。

RPC 是调用模型，不是传输协议。它可以基于 TCP，也可以基于 HTTP/2。gRPC 就是一个很典型的例子。

### REST 和 RPC 是不是互斥？

不完全互斥。

REST 更偏资源建模，RPC 更偏方法调用。实际项目里经常混用：外部接口走 REST，内部服务走 RPC。这很正常。

### 有了 HTTP/2，还需要 RPC 吗？

HTTP/2 在 HTTP 这一层引入了帧、流、多路复用、头部压缩等能力，提高了同一条 TCP 连接上的并发利用率。

但它不会自动帮你定义服务接口，不会自动生成客户端代码，也不会自动解决服务发现、超时重试、调用治理和版本契约。

还有一个很容易被忽略的差异：调用模式。

普通 HTTP API 大多是一问一答。gRPC 除了最常见的 Unary 调用，还原生支持服务端流、客户端流和双向流。gRPC 官方文档也明确列出了 Unary、Server streaming、Client streaming、Bidirectional streaming 这四种调用模式。 

比如日志订阅、长任务进度推送、批量上传、实时同步这类场景，用 streaming 会更自然。你当然也可以用 SSE、WebSocket，或者自己基于 HTTP/2 封装，但那就相当于又在补 RPC 框架已经做好的那部分能力。

所以 HTTP/2 很重要，但它不是 RPC 框架的全部。

### gRPC 是不是等于 HTTP/2 + Protobuf？

不是。

这句话只能用来帮助初学者快速建立印象，不能当严格定义。

更准确的说法是：gRPC 基于 HTTP/2 承载 RPC 调用，默认使用 Protobuf 描述接口和消息，但协议本身允许 JSON 或自定义编码；同时，它还定义了请求路径、Content-Type、Length-Prefixed-Message、Trailers 里的 `grpc-status` 等一整套规则。

所以 gRPC 不是单纯换了一个序列化格式，它是一套 RPC 调用协议和工程约定。

## 最后

HTTP 和 RPC 不是谁取代谁的关系，也不是谁更高级的问题。

HTTP 能调服务，RPC 也能调服务。真正的区别在于，你是想把远程调用当成一次“资源访问”，还是当成一次“方法调用”。

如果是对外接口，比如 Web、App、第三方系统接入，HTTP 通常更合适。它通用、好调试、接入成本低，别人拿 Postman、curl 就能测。
如果是公司内部服务互调，尤其是服务多、调用链长、接口频繁调用，还要考虑服务发现、超时、重试、负载均衡、链路追踪这些问题，RPC 会更顺手一些。它不是单纯为了快，而是把内部服务调用里的很多麻烦事一起处理掉。

所以，别再简单背“HTTP 对外，RPC 对内”了。

这句话可以帮助入门，但真做项目时，还得看你的调用对象、团队基础设施、排查成本、性能要求和后续维护成本。

系统规模不大，用 HTTP 已经跑得很稳，就别为了“看起来更微服务”强上 RPC。

内部调用越来越复杂，HTTP SDK、网关、监控、重试这些东西越补越多，那就可以认真考虑 RPC。

一句话：**HTTP 没那么弱，RPC 也没那么神。选哪个，主要看它能不能用更低成本解决你现在的问题。**


---

<!-- source: 数据结构/LRU 缓存面试题总结-哈希表、双向链表与 LinkedHashMap.md -->

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

<!-- source: 数据结构/Trie 前缀树面试题总结-字典树原理、前缀匹配与 Java 实现.md -->

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

<!-- source: 数据结构/并查集面试题总结-路径压缩、连通性与 Java 模板.md -->

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

<!-- source: 数据结构/布隆过滤器详解（原理、实现、应用场景）.md -->

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

<!-- source: 数据结构/堆详解（最大堆、最小堆、优先队列）.md -->

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

<!-- source: 数据结构/哈希表面试题总结-哈希冲突、扩容与 Java HashMap.md -->

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

<!-- source: 数据结构/红黑树详解（性质、旋转、应用）.md -->

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

<!-- source: 数据结构/树结构详解（二叉树、AVL、BB+树）.md -->

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

<!-- source: 数据结构/跳表面试题总结-多级索引、范围查询与 Redis ZSet.md -->

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

<!-- source: 数据结构/图详解（DFS、BFS、最短路径）.md -->

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

<!-- source: 数据结构/线性数据结构详解（数组、链表、栈、队列）.md -->

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


---

<!-- source: 算法/DFS 与 BFS 面试题总结-树、图、矩阵搜索与最短路径模板.md -->

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

<!-- source: 算法/Top K 问题面试题总结-堆、快排分区、桶计数与数据流.md -->

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

<!-- source: 算法/常见数据结构经典 LeetCode 题目推荐.md -->

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

<!-- source: 算法/动态规划面试题总结-状态转移、背包、子序列与 Java 模板.md -->

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

<!-- source: 算法/二分查找面试题总结-左右边界、答案二分与 Java 模板.md -->

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

<!-- source: 算法/回溯算法面试题总结-组合、排列、子集、剪枝与 Java 模板.md -->

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

<!-- source: 算法/几道常见的链表算法题.md -->

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

<!-- source: 算法/几道常见的字符串算法题.md -->

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

<!-- source: 算法/剑指offer部分编程题.md -->

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

<!-- source: 算法/经典算法思想总结（含 LeetCode 题目推荐）.md -->

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

<!-- source: 算法/十大经典排序算法总结.md -->

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

<!-- source: 算法/时间复杂度和空间复杂度面试指南-Big O、递归复杂度与常见误区.md -->

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

<!-- source: 算法/双指针与滑动窗口面试题总结-数组、链表、字符串高频模板.md -->

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

<!-- source: 算法/贪心算法面试题总结-区间贪心、跳跃游戏与证明思路.md -->

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

