# SQL 题

表结构约定（第 1 题）：

```sql
CREATE TABLE student_score (
  student_id   INT         NOT NULL COMMENT '学生id',
  student_name VARCHAR(50) NOT NULL COMMENT '学生姓名',
  course_name  VARCHAR(50) NOT NULL COMMENT '课程名',
  score        DECIMAL(5,2) NULL COMMENT '课程成绩，NULL 表示缺考'
);
```

说明：一行是「某学生某门课」的成绩；缺考用 `score IS NULL`（或业务上用 -1，下面按 NULL 处理）。

---

## 1. 各科成绩均大于 90 分的学生；每个科目最高分的学生

### 1.1 各科成绩均大于 90 分的学生（1 条 SQL）

**考点**：分组过滤、`HAVING`、缺考要排除。

缺考（`NULL`）不能算「大于 90」。常见两种理解：

**理解 A（更严）**：该生所有已有成绩都 > 90，且**不能有缺考**。

```sql
SELECT student_id, student_name
FROM student_score
GROUP BY student_id, student_name
HAVING SUM(CASE WHEN score IS NULL OR score <= 90 THEN 1 ELSE 0 END) = 0;
```

等价写法：

```sql
SELECT student_id, student_name
FROM student_score
GROUP BY student_id, student_name
HAVING MIN(score) > 90;   -- MIN 遇到全是有效分才成立；有 NULL 时 MIN 会忽略 NULL，需再排除缺考
```

更稳妥（显式排除缺考）：

```sql
SELECT student_id, student_name
FROM student_score
GROUP BY student_id, student_name
HAVING COUNT(*) = COUNT(score)   -- 无缺考：总行数 = 非 NULL 成绩数
   AND MIN(score) > 90;
```

**理解 B**：只要求「已考科目」都 > 90，缺考不管（面试要先和面试官对齐）。

```sql
SELECT student_id, student_name
FROM student_score
WHERE score IS NOT NULL
GROUP BY student_id, student_name
HAVING MIN(score) > 90;
```

面试可补一句：若课程集合固定（如语数外三门），也可用：

```sql
SELECT student_id, student_name
FROM student_score
GROUP BY student_id, student_name
HAVING SUM(score > 90) = 3          -- 或 = 课程总数
   AND COUNT(score) = 3;            -- 三门都考了
```

### 1.2 每个科目最高分的学生（1 条 SQL）

**考点**：按科目求 MAX，再回表拿人；同分并列要一起查出。

```sql
SELECT s.course_name, s.student_id, s.student_name, s.score
FROM student_score s
INNER JOIN (
  SELECT course_name, MAX(score) AS max_score
  FROM student_score
  WHERE score IS NOT NULL          -- 缺考不参与最高分
  GROUP BY course_name
) t ON s.course_name = t.course_name
   AND s.score = t.max_score;
```

窗口函数写法（MySQL 8+）：

```sql
SELECT course_name, student_id, student_name, score
FROM (
  SELECT
    course_name, student_id, student_name, score,
    RANK() OVER (PARTITION BY course_name ORDER BY score DESC) AS rk
  FROM student_score
  WHERE score IS NOT NULL
) t
WHERE rk = 1;
```

`RANK` / `DENSE_RANK`：并列第一都会留下；只要唯一最高分可用 `ROW_NUMBER()`（同分只留一行，需约定排序规则）。

---

## 2. 连续登录 / 连续出现 N 天

表：`login(user_id, login_date)`，求连续登录 ≥ 3 天的用户。

**思路**：日期减去行号，连续段得到同一「分组锚点」。

```sql
SELECT user_id, COUNT(*) AS consecutive_days
FROM (
  SELECT
    user_id,
    login_date,
    DATE_SUB(login_date, INTERVAL ROW_NUMBER() OVER (
      PARTITION BY user_id ORDER BY login_date
    ) DAY) AS grp
  FROM (SELECT DISTINCT user_id, login_date FROM login) t
) x
GROUP BY user_id, grp
HAVING COUNT(*) >= 3;
```

无窗口函数时可用变量 / 自连接，面试说清「日期 - 序号 = 常量」即可。

---

## 3. 第 N 高的薪水（经典 LeetCode）

表：`Employee(id, salary)`，查第 N 高的不同薪水（N 由入参给出）。

```sql
SELECT DISTINCT salary AS SecondHighestSalary   -- 示例：第 2 高可改 LIMIT
FROM Employee
ORDER BY salary DESC
LIMIT 1 OFFSET 1;   -- 第 N 高：LIMIT 1 OFFSET N-1
```

更稳（不足 N 个返回 NULL）：

```sql
SELECT (
  SELECT DISTINCT salary
  FROM Employee
  ORDER BY salary DESC
  LIMIT 1 OFFSET 1
) AS SecondHighestSalary;
```

窗口函数：

```sql
SELECT salary
FROM (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rk
  FROM Employee
) t
WHERE rk = N;
```

注意：`RANK` 遇并列会跳号；「第 N 高不同值」一般用 `DENSE_RANK` 或 `DISTINCT + LIMIT`。

---

## 4. 部门工资最高的员工

表：`Employee(id, name, salary, departmentId)`，`Department(id, name)`。

```sql
SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary
FROM Employee e
JOIN Department d ON e.departmentId = d.id
JOIN (
  SELECT departmentId, MAX(salary) AS max_sal
  FROM Employee
  GROUP BY departmentId
) t ON e.departmentId = t.departmentId AND e.salary = t.max_sal;
```

---

## 5. 找出只出现一次 / 重复的数据

查重复邮箱：

```sql
SELECT email
FROM Person
GROUP BY email
HAVING COUNT(*) > 1;
```

删重复保留最小 id（MySQL）：

```sql
DELETE p1
FROM Person p1
INNER JOIN Person p2
  ON p1.email = p2.email AND p1.id > p2.id;
```

---

## 6. 自连接：比经理工资高的员工

表：`Employee(id, name, salary, managerId)`。

```sql
SELECT e.name AS Employee
FROM Employee e
JOIN Employee m ON e.managerId = m.id
WHERE e.salary > m.salary;
```

---

## 7. 左连接与「没有匹配」：没下过单的用户

```sql
SELECT u.id, u.name
FROM User u
LEFT JOIN Orders o ON u.id = o.user_id
WHERE o.id IS NULL;
```

`NOT EXISTS` 往往更清晰，也利于优化器：

```sql
SELECT u.id, u.name
FROM User u
WHERE NOT EXISTS (
  SELECT 1 FROM Orders o WHERE o.user_id = u.id
);
```

---

## 8. 分组 Top N：每类取前 2

订单表按用户取最近 2 笔：

```sql
SELECT user_id, order_id, create_time
FROM (
  SELECT
    user_id, order_id, create_time,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY create_time DESC) AS rn
  FROM orders
) t
WHERE rn <= 2;
```

---

## 9. 行转列 / 列转行（面试常问思路）

成绩表行转列（语数外三列）：

```sql
SELECT
  student_id,
  student_name,
  MAX(CASE WHEN course_name = '语文' THEN score END) AS chinese,
  MAX(CASE WHEN course_name = '数学' THEN score END) AS math,
  MAX(CASE WHEN course_name = '英语' THEN score END) AS english
FROM student_score
GROUP BY student_id, student_name;
```

---

## 10. 分页与深分页

普通分页：

```sql
SELECT * FROM article
ORDER BY id
LIMIT 20 OFFSET 10000;   -- 深分页会越扫越慢
```

推荐（基于上次最大 id）：

```sql
SELECT * FROM article
WHERE id > 10000
ORDER BY id
LIMIT 20;
```

---

## 面试答题模板（可套用）

1. **先确认语义**：NULL / 缺考、并列最高分、是否去重、时间是否含时分秒。
2. **说清思路**：过滤 → 分组 → 聚合 / 窗口 → 回表。
3. **给出 SQL**：能写窗口函数就写，再补兼容写法（子查询 + JOIN）。
4. **提性能**：索引字段、`WHERE` 先过滤、避免对索引列做函数、深分页改 seek。

---

## 小结

| 题型 | 核心手段 |
|------|----------|
| 全科都 > 90 | `GROUP BY` + `HAVING MIN(score) > 90`，并处理缺考 |
| 每科最高分 | `MAX` 子查询 JOIN，或 `RANK() OVER (PARTITION BY …)` |
| 连续 N 天 | 日期 − 行号得到连续段 |
| 第 N 高 | `DENSE_RANK` / `DISTINCT + LIMIT OFFSET` |
| 无匹配行 | `LEFT JOIN … IS NULL` 或 `NOT EXISTS` |
| 分组 Top N | `ROW_NUMBER() OVER (PARTITION BY …)` |
