# 场景面试：百万粉丝大 V 发动态，粉丝如何收到通知？

> 核心矛盾：**写扩散（推）** 给 100 万粉丝各写一条 inbox/发一条 Push **不可行**；必须 **推拉混合 + 异步分级 + 通知与 Feed 解耦**。

---

## 1. 问题拆解

| 子问题 | 量级 | 要求 |
|--------|------|------|
| **Feed 可见** | 100 万粉丝 eventually 刷到 | 可秒～分钟级延迟 |
| **红点/未读** | 100 万用户 | 可合并、可近似 |
| **Push 推送** | 100 万设备 | 必须削峰、分批、可降级 |
| **站内信** | 可选 | 大 V 通常不进单独站内信列表 |
| **发帖本身** | 1 次写 | 毫秒级成功 |

**面试第一句**：「大 V **不做写扩散**；动态只写 **一条**；粉丝 **读时拉** 或 **拉关注列表+大 V 时间线**；通知走 **独立异步通道**，且 **不等于** 给每人 Push。」

---

## 2. 总体架构

```text
大 V 发帖
  │
  ├─① 同步（短路径）
  │    写 post 表（主库）→ 写 author 自己的 outbox/timeline
  │    返回 postId 成功
  │
  ├─② 异步 Fan-out（MQ，仅「普通粉丝体量」才写 inbox）
  │    判断粉丝数 > 阈值（如 1 万）→ 【跳过写扩散】
  │    只更新：大 V 个人页缓存 + 「大 V 最新 post」全局/分片缓存
  │
  ├─③ 通知子系统（与 Feed 解耦）
  │    post_created 事件 → 通知服务
  │      ├─ 在线粉丝：长连接/IM 通道「轻量提示」（可选）
  │      ├─ Push：分批 + 合并 + 用户偏好过滤
  │      └─ 不短信（除非订阅且付费）
  │
  └─④ 粉丝读 Feed 时
       拉取关注列表 → 普通用户走 inbox
                    → 大 V 走「大 V 拉模型」合并排序
```

---

## 3. 大 V 判定与推拉策略

### 3.1 粉丝数阈值（常见）

| 粉丝规模 | Feed 策略 | 通知策略 |
|----------|-----------|----------|
| **< 5k～1w** | **推**：异步写粉丝 inbox（MQ 扇出） | 可全量 Push（仍要限流） |
| **1w～100w** | **拉**：不写粉丝 inbox | Push **订阅制/互动粉优先** |
| **100w+** | **拉** + 大 V post 索引 | **默认不 Push**；仅「特别关心」 |

```text
user 表 / 计数服务：follower_count
发帖时：if follower_count > THRESHOLD → bigVMode = true
```

### 3.2 大 V 发帖写路径（只写 O(1)）

```text
1. INSERT post（content, media, author_id, ts, status）
2. INSERT author_timeline（author_id, post_id, ts）  // 作者自己的页
3. UPDATE/SET redis: bigv:latest:{authorId} = postId   // 可选热缓存
4. 发 MQ：post_created { postId, authorId, fanCount, ts }
5. 返回成功（不等待 fan-out）
```

**不做**：`INSERT INTO inbox VALUES (fan1...fan1000000)`。

### 3.3 粉丝读 Feed（读路径合并）

```text
GET /feed?cursor=ts&limit=20

1. 从 inbox:{userId}（ZSet）取普通关注对象的 post（已推好的）
2. 从「关注列表」筛出 bigV 列表（或维护 bigv_follow:{userId}）
3. 对每个 bigV（或批量）：
     - 读 bigv:timeline:{authorId} 最近 N 条
     - 或读 post 表 WHERE author_id IN (...) AND ts < cursor（带索引）
4. 多路归并排序（按 ts）→ 取 Top 20
5. 回填 post 详情（批量 mget post:{id}）
```

**优化**：

- 关注的大 V 不多（通常 < 50），**IN 查询 + 索引** 可接受。  
- 大 V 列表缓存到 Redis Set；变更关注时更新。

---

## 4. 粉丝如何「收到通知」？（分级）

### 4.1 通知 ≠ Feed 里能看到

| 通道 | 百万粉是否默认开 | 做法 |
|------|------------------|------|
| **Feed 时间线** | 是 | 读时拉取，无 Push 也能刷到 |
| **App 内红点** | 可选 | 「关注的人有新动态」聚合红点，不按人拆 100 万条 |
| **Push** | **否** | 默认关或仅「特关」；否则成本与骚扰爆炸 |
| **短信** | 否 | — |

### 4.2 Push 通道（若产品要做）

```text
post_created → 通知服务

1. 过滤：
   - 用户关闭「关注人 Push」→ 跳过
   - 非「特关/互动粉」→ 跳过（大 V 默认）
   - 免打扰时段 → 延迟到 morning

2. 受众圈选（不能 SELECT 100 万 id 一次查）：
   - 方案 A：只 Push 「特关」表（可能几千～几万）
   - 方案 B：Push 「最近 7 天互动过」的粉丝（活跃子集）
   - 方案 C：分桶延迟：100 万 → 100 批，每批 1 万，10 分钟发完

3. 发送：
   - 写 push_task 表 / MQ 分区
   - 多 worker 调 APNs/FCM/厂商通道
   - 渠道 QPS 限制（如 5 万/秒）+ 失败重试

4. 合并：
   - 5 分钟内同一 author 多条 → 合并「某某发了 3 条动态」
```

### 4.3 在线实时（可选）

- 粉丝 **WebSocket/长连接在线** → 网关广播 **「你有新 Feed」轻量信令**，不推全文。  
- 客户端收到后 **拉 /feed** 或 **增量接口**。  
- 100 万在线也不直推 100 万次 payload：只推 **「refresh_hint」**；按 **连接所在接入节点** 广播，或只推最近活跃会话。

### 4.4 未读数 / 红点

```text
不推荐：每个粉丝 Redis INCR unread:{userId}（100 万次写）

推荐：
  - 读 Feed 时对比 last_read_ts vs 关注列表最大 post_ts
  - 或维护 follow_feed_version，发帖只 author 侧 version++
  - 客户端拉「是否有更新」接口（轻量）
```

---

## 5. 异步 Fan-out（普通用户对比）

**普通用户**（粉丝 500）发帖：

```text
post_created → fanout_worker
  查 follower 列表（分页 500）
  批量 LPUSH / ZADD inbox:{followerId}
  可选：发 Push（量小可全发）
```

**MQ 设计**：

- Topic：`post_fanout`  
- 大 V 消息：**consumer 判断 fanCount**，直接 ack（或只更新 author 索引）  
- 普通用户：继续扇出  
- **幂等**：`(post_id, follower_id)` 去重

---

## 6. 存储设计

| 存储 | 用途 |
|------|------|
| **post** | 动态正文、媒体、状态 |
| **follow** | 关注关系（follower → followee） |
| **inbox** | 仅 **非大 V** 发帖写入；`inbox:{userId}` ZSet |
| **author_timeline** | 作者发过的 post |
| **bigv_follow:{userId}** | 我关注的大 V 列表（Set） |
| **user_counter** | follower_count 实时/近似 |

**分库**：post 按 `author_id`；follow 按 `follower_id`；inbox 按 `user_id`。

---

## 7. 事务 / 一致性

| 环节 | 方案 |
|------|------|
| 发帖 | **本地事务** 写 post + author_timeline |
| Fan-out | **最终一致**；MQ 至少一次 + 幂等 |
| Push | **最终一致**；允许少量漏 Push（Feed 仍可见） |
| 计数 | follower_count **最终一致**（Redis + 定时校准） |

**不用**分布式事务把「发帖 + 100 万 inbox + Push」绑一起。

---

## 8. 缓存

| Key | 说明 |
|-----|------|
| `post:{id}` | 详情 |
| `inbox:{userId}` | 前几百条 ZSet |
| `bigv:recent:{authorId}` | 大 V 最近 20 条 postId |
| `follow:list:{userId}` | 关注列表（分页） |

发帖后：**删 author 页缓存**；大 V **不删** 100 万个粉丝缓存。

---

## 9. 读写分离

- 发帖、关注关系变更：**主库**  
- Feed 拉取、post 详情：**从库 + Redis**（延迟可接受）  
- follower 列表扇出：读 **从库** 分页拉（避免打主库）

---

## 10. 高并发与降级

| 风险 | 应对 |
|------|------|
| 大 V 发帖 QPS 不高，但 **读风暴** | 读路径缓存 + CDN 静态媒体 |
| 错误地对大 V **写扩散** | 阈值硬编码 + 审核 fanCount |
| Push 打满通道 | 分批、降级为仅 Feed |
| 关注列表过大 | 限制关注数；Feed 只取最近活跃 |
| 热点 Key | 大 V post 详情 **本地缓存** + 多副本 Redis |

---

## 11. 与微博 / 推特 / ins 的对应（口述）

- **微博**：大 V 发博，粉丝 timeline **拉 + 聚合**；Push 给互动用户。  
- **Instagram**：偏 **拉**（following feed 聚合）。  
- **微信订阅号**：本质是 **拉** + 会话列表未读，不是给千万用户写 inbox。

---

## 12. 面试追问

| 追问 | 要点 |
|------|------|
| 100 万粉丝每人写 inbox？ | **不行**；O(粉丝数) 写爆炸；改拉 |
| 怎么保证粉丝一定能看到？ | 读 Feed 时 **合并大 V 时间线**；非 Push 必达 |
| 要不要给所有人 Push？ | **不要**；成本、卸载率、渠道限流 |
| 发帖接口要等多久？ | **只等写 post**；fan-out 异步 |
| 取消关注后？ | 删 inbox 里该 author 条目；大 V 拉列表移除 |

---

## 13. 30 秒收口

「百万粉大 V **不写扩散**：发帖只落 **一条 post**；粉丝 Feed **读时拉** 大 V 时间线并与普通 inbox **归并排序**。通知与 Feed **解耦**：默认 **不全员 Push**，仅特关/互动粉或分批 Push；在线用 **轻量信令** 促客户端拉取。普通小号仍 **MQ 异步推 inbox**。」

---

## 14. 关联

- Feed 模型：[Feed流.md](./Feed流.md)  
- 推送通道：[消息通知.md](./消息通知.md)  
- 朋友圈完整流程：[朋友圈.md](./朋友圈.md)
