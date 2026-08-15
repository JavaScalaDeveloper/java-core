---
title: 框架 AI优化汇总
---

# 框架 AI优化汇总

> 基于 0-ALL.md 的 AI 优化版（原文较大）：正文收录重点篇并补充体系化内容；完整原文见 0-ALL.md。

## AI 补充：体系化梳理与易漏考点

> 本节在汇总原文基础上，补充面试追问、对比项与工程落地注意点。

### 知识地图
- 工程基础：API、命名、重构、单测
- 安全：认证授权、JWT、SSO、RBAC、加密脱敏
- 框架：Spring IoC/AOP/事务/自动装配

### 常漏追问
1. **@Transactional 失效场景？** 自调用、非 public、异常被吞等。
2. **JWT 优缺点？** 无状态易扩展；注销/续期/密钥轮换要设计。
3. **权限模型？** RBAC 为主，数据权限与菜单权限分层。

### 工程落地检查清单
- [ ] 是否有明确指标（延迟、吞吐、错误率、积压）？
- [ ] 失败是否可重试且幂等？
- [ ] 是否有限流/超时/降级？
- [ ] 是否有日志、链路追踪与告警？
- [ ] 配置变更与回滚是否可操作？


## TOC

1. MyBatis常见面试题总结 (`mybatis/MyBatis常见面试题总结.md`)
2. Async 注解原理分析 (`spring/Async 注解原理分析.md`)
3. IoC & AOP详解（快速搞懂） (`spring/IoC & AOP详解（快速搞懂）.md`)
4. Spring 事务详解 (`spring/Spring 事务详解.md`)
5. Spring 中的设计模式详解 (`spring/Spring 中的设计模式详解.md`)
6. Spring&SpringMVC&SpringBoot常用注解总结 (`spring/Spring&SpringMVC&SpringBoot常用注解总结.md`)
7. SpringBoot 自动装配原理详解 (`spring/SpringBoot 自动装配原理详解.md`)
8. Spring常见面试题总结 (`spring/Spring常见面试题总结.md`)

---

<!-- source: mybatis/MyBatis常见面试题总结.md -->

## [1] MyBatis常见面试题总结

---
title: MyBatis常见面试题总结
description: MyBatis常见面试题详解，涵盖#{}与${}区别、动态SQL、一级二级缓存、分页插件及Mapper映射原理。
category: 框架
icon: "mdi:database-outline"
tag:
  - MyBatis
head:
  - - meta
    - name: keywords
      content: MyBatis,MyBatis面试题,#{}与${},动态SQL,一级缓存,二级缓存,分页插件,Mapper映射
---

> 本篇文章由 JavaGuide 收集自网络，原出处不明。
>
> 比起这些枯燥的面试题，我更建议你看看文末推荐的 MyBatis 优质好文。

### #{} 和 \${} 的区别是什么？

注：这道题是面试官面试我同事的。

答：

- `${}`是 Properties 文件中的变量占位符，它可以用于标签属性值和 sql 内部，属于原样文本替换，可以替换任意内容，比如\${driver}会被原样替换为`com.mysql.jdbc. Driver`。

一个示例：根据参数按任意字段排序：

```sql
select * from users order by ${orderCols}
```

`orderCols`可以是 `name`、`name desc`、`name,sex asc`等固定片段，实现灵活的排序。但 `${}` 不会使用预编译参数，也不会自动转义内容，因此 `orderCols` 不能直接来自用户输入。实际项目应把前端传入的排序字段和方向映射为服务端预定义的枚举或白名单 SQL 片段，并拒绝白名单以外的值，否则会产生 SQL 注入风险。

- `#{}`是 sql 的参数占位符，MyBatis 会将 sql 中的`#{}`替换为? 号，在 sql 执行前会使用 PreparedStatement 的参数设置方法，按序给 sql 的? 号占位符设置参数值，比如 ps.setInt(1, parameterValue)（JDBC 参数下标从 1 开始），`#{item.name}` 的取值方式为使用反射从参数对象中获取 item 对象的 name 属性值，相当于 `param.getItem().getName()`。

### xml 映射文件中，除了常见的 select、insert、update、delete 标签之外，还有哪些标签？

注：这道题是京东面试官面试我时问的。

答：还有很多其他的标签， `<resultMap>`、 `<parameterMap>`、 `<sql>`、 `<include>`、 `<selectKey>` ，加上动态 sql 的 9 个标签， `trim|where|set|foreach|if|choose|when|otherwise|bind` 等，其中 `<sql>` 为 sql 片段标签，通过 `<include>` 标签引入 sql 片段， `<selectKey>` 为不支持自增的主键生成策略标签。

### Dao 接口的工作原理是什么？Dao 接口里的方法，参数不同时，方法能重载吗？

注：这道题也是京东面试官面试我被问的。

答：最佳实践中，通常一个 xml 映射文件，都会写一个 Dao 接口与之对应。Dao 接口就是人们常说的 `Mapper` 接口，接口的全限名，就是映射文件中的 namespace 的值，接口的方法名，就是映射文件中 `MappedStatement` 的 id 值，接口方法内的参数，就是传递给 sql 的参数。 `Mapper` 接口是没有实现类的，当调用接口方法时，接口全限名+方法名拼接字符串作为 key 值，可唯一定位一个 `MappedStatement` ，举例：`com.mybatis3.mappers. StudentDao.findStudentById` ，可以唯一找到 namespace 为 `com.mybatis3.mappers. StudentDao` 下面 `id = findStudentById` 的 `MappedStatement` 。在 MyBatis 中，每一个 `<select>`、 `<insert>`、 `<update>`、 `<delete>` 标签，都会被解析为一个 `MappedStatement` 对象。

~~Dao 接口里的方法，是不能重载的，因为是全限名+方法名的保存和寻找策略。~~

Java 接口允许声明重载方法，但 MyBatis 根据“接口全限定名 + 方法名”查找 `MappedStatement`，不会使用参数签名区分重载方法。因此，多个重载方法只能共享同一个映射，XML 中的 ID 也不能重复。只有当这个映射能够兼容各重载方法的参数和返回类型时，调用才可能正常执行，实际开发中不建议在 Mapper 接口中使用重载。

Mybatis 版本 3.3.0，亲测如下：

```java
/**
 * Mapper接口里面方法重载
 */
public interface StuMapper {

 List<Student> getAllStu();

 List<Student> getAllStu(@Param("id") Integer id);
}
```

然后在 `StuMapper.xml` 中利用 Mybatis 的动态 sql 就可以实现。

```xml
<select id="getAllStu" resultType="com.pojo.Student">
  select * from student
  <where>
    <if test="id != null">
      id = #{id}
    </if>
  </where>
</select>
```

这个特定示例能够正常运行，是因为两个重载方法最终调用的是同一个动态 SQL 映射，并不是 MyBatis 能够按方法签名选择不同的 SQL。

**MyBatis 的 Mapper XML 无法按重载签名分派 SQL。即使某些共享映射的重载示例可以运行，也应优先使用不同的方法名表达不同查询。**

相关 issue：[更正：Dao 接口里的方法可以重载，但是 Mybatis 的 xml 里面的 ID 不允许重复！](https://github.com/Snailclimb/JavaGuide/issues/1122)。

Dao 接口的工作原理是 JDK 动态代理，MyBatis 运行时会使用 JDK 动态代理为 Dao 接口生成代理 proxy 对象，代理对象 proxy 会拦截接口方法，转而执行 `MappedStatement` 所代表的 sql，然后将 sql 执行结果返回。

**补充**：

下面的测试用于展示共享映射时不同参数组合的行为，不是 MyBatis 对方法重载定义的通用规则。

**测试如下**：

`PersonDao.java`

```java
Person queryById();

Person queryById(@Param("id") Long id);

Person queryById(@Param("id") Long id, @Param("name") String name);
```

`PersonMapper.xml`

```xml
<select id="queryById" resultMap="PersonMap">
    select
      id, name, age, address
    from person
    <where>
        <if test="id != null">
            id = #{id}
        </if>
        <if test="name != null and name != ''">
            name = #{name}
        </if>
    </where>
    limit 1
</select>
```

`org.apache.ibatis.scripting.xmltags. DynamicContext. ContextAccessor#getProperty` 方法用于获取 `<if>` 标签中的条件值

```java
public Object getProperty(Map context, Object target, Object name) {
  Map map = (Map) target;

  Object result = map.get(name);
  if (map.containsKey(name) || result != null) {
    return result;
  }

  Object parameterObject = map.get(PARAMETER_OBJECT_KEY);
  if (parameterObject instanceof Map) {
    return ((Map)parameterObject).get(name);
  }

  return null;
}
```

`parameterObject` 为 map，存放的是 Dao 接口中参数相关信息。

`((Map)parameterObject).get(name)` 方法如下

```java
public V get(Object key) {
  if (!super.containsKey(key)) {
    throw new BindingException("Parameter '" + key + "' not found. Available parameters are " + keySet());
  }
  return super.get(key);
}
```

1. `queryById()`方法执行时，`parameterObject`为 null，`getProperty`方法返回 null 值，`<if>`标签获取的所有条件值都为 null，所有条件不成立，动态 sql 可以正常执行。
2. `queryById(1L)`方法执行时，`parameterObject`为 map，包含了`id`和`param1`两个 key 值。当获取`<if>`标签中`name`的属性值时，进入`((Map)parameterObject).get(name)`方法中，map 中 key 不包含`name`，所以抛出异常。
3. `queryById(1L,"1")`方法执行时，`parameterObject`中包含`id`,`param1`,`name`,`param2`四个 key 值，`id`和`name`属性都可以获取到，动态 sql 正常执行。

### MyBatis 是如何进行分页的？分页插件的原理是什么？

注：我出的。

答：**(1)** MyBatis 使用 RowBounds 对象进行分页，它不会改写 SQL，而是在 JDBC ResultSet 上跳过 offset 行并限制返回数量，属于客户端结果集分页而非物理分页，效率取决于 JDBC 驱动和结果集类型；**(2)** 可以在 sql 内直接书写带有物理分页的参数来完成物理分页功能，**(3)** 也可以使用分页插件来完成物理分页。对于大数据量和较大的 offset，通常应优先使用物理分页。

分页插件的基本原理是使用 MyBatis 提供的插件接口，实现自定义插件，在插件的拦截方法内拦截待执行的 sql，然后重写 sql，根据 dialect 方言，添加对应的物理分页语句和物理分页参数。

举例：`select _ from student` ，拦截 sql 后重写为：`select t._ from （select \* from student）t limit 0，10`

### 简述 MyBatis 的插件运行原理，以及如何编写一个插件

注：我出的。

答：MyBatis 仅可以编写针对 `ParameterHandler`、 `ResultSetHandler`、 `StatementHandler`、 `Executor` 这 4 种接口的插件，MyBatis 使用 JDK 的动态代理，为需要拦截的接口生成代理对象以实现接口方法拦截功能，每当执行这 4 种接口对象的方法时，就会进入拦截方法，具体就是 `InvocationHandler` 的 `invoke()` 方法，当然，只会拦截那些你指定需要拦截的方法。

实现 MyBatis 的 `Interceptor` 接口并复写 `intercept()` 方法，然后在给插件编写注解，指定要拦截哪一个接口的哪些方法即可，记住，别忘了在配置文件中配置你编写的插件。

### MyBatis 执行批量插入，能返回数据库主键列表吗？

注：我出的。

答：能，JDBC 都能，MyBatis 当然也能。

### MyBatis 动态 sql 是做什么的？都有哪些动态 sql？能简述一下动态 sql 的执行原理不？

注：我出的。

答：MyBatis 动态 sql 可以让我们在 xml 映射文件内，以标签的形式编写动态 sql，完成逻辑判断和动态拼接 sql 的功能。其执行原理为，使用 OGNL 从 sql 参数对象中计算表达式的值，根据表达式的值动态拼接 sql，以此来完成动态 sql 的功能。

MyBatis 提供了 9 种动态 sql 标签:

- `<if></if>`
- `<where></where>(trim,set)`
- `<choose></choose>（when, otherwise）`
- `<foreach></foreach>`
- `<bind/>`

关于 MyBatis 动态 SQL 的详细介绍，请看这篇文章：[Mybatis 系列全解（八）：Mybatis 的 9 大动态 SQL 标签你知道几个？](https://segmentfault.com/a/1190000039335704) 。

关于这些动态 SQL 的具体使用方法，请看这篇文章：[Mybatis【13】-- Mybatis 动态 sql 标签怎么使用？](https://cloud.tencent.com/developer/article/1943349)

### MyBatis 是如何将 sql 执行结果封装为目标对象并返回的？都有哪些映射形式？

注：我出的。

答：第一种是使用 `<resultMap>` 标签，逐一定义列名和对象属性名之间的映射关系。第二种是使用 sql 列的别名功能，将列别名书写为对象属性名，比如 T_NAME AS NAME，对象属性名一般是 name，小写，但是列名不区分大小写，MyBatis 会忽略列名大小写，智能找到与之对应对象属性名，你甚至可以写成 T_NAME AS NaMe，MyBatis 一样可以正常工作。

有了列名与属性名的映射关系后，MyBatis 通过反射创建对象，同时使用反射给对象的属性逐一赋值并返回，那些找不到映射关系的属性，是无法完成赋值的。

### MyBatis 能执行一对一、一对多的关联查询吗？都有哪些实现方式，以及它们之间的区别

注：我出的。

答：能。MyBatis 通常使用 `<association>` 映射“有一个”关系（如一对一、多对一），使用 `<collection>` 映射“有多个”关系（如一对多、多对多）。关系的基数由对象属性和映射结构决定，并不是简单地把 `selectOne()` 修改为 `selectList()`。

关联对象查询主要有两种实现方式：一种是 Nested Select，即执行另一个 mapped statement 查询关联对象，使用不当可能产生 N+1 查询；另一种是 Nested Results，即通过 join 得到包含重复数据的结果集，再使用嵌套结果映射组装对象图。后者只需执行一次 SQL，但需要正确配置主对象和关联对象的 `<id>` 映射。

那么问题来了，join 查询出来 100 条记录，如何确定主对象是 5 个，而不是 100 个？其去重复的原理是 `<resultMap>` 标签内的 `<id>` 子标签，指定了唯一确定一条记录的 id 列，MyBatis 根据 `<id>` 列值来完成 100 条记录的去重复功能， `<id>` 可以有多个，代表了联合主键的语意。

同样主对象的关联对象，也是根据这个原理去重复的，尽管一般情况下，只有主对象会有重复记录，关联对象一般不会重复。

举例：下面 join 查询出来 6 条记录，一、二列是 Teacher 对象列，第三列为 Student 对象列，MyBatis 去重复处理后，结果为 1 个老师 6 个学生，而不是 6 个老师 6 个学生。

| t_id | t_name  | s_id |
| ---- | ------- | ---- |
| 1    | teacher | 38   |
| 1    | teacher | 39   |
| 1    | teacher | 40   |
| 1    | teacher | 41   |
| 1    | teacher | 42   |
| 1    | teacher | 43   |

### MyBatis 是否支持延迟加载？如果支持，它的实现原理是什么？

注：我出的。

答：MyBatis 仅支持 association 关联对象和 collection 关联集合对象的延迟加载，association 指的就是一对一，collection 指的就是一对多查询。在 MyBatis 配置文件中，可以配置是否启用延迟加载 `lazyLoadingEnabled=true|false。`

它的原理是，为结果对象创建代理，在访问尚未加载的属性时由代理触发预先登记的关联查询，再将查询结果写入目标属性。MyBatis 3.3 及以上版本默认使用 Javassist 创建延迟加载代理；CGLIB 是旧版本可选方案，并已从 MyBatis 3.5.10 起被弃用。具体关联还可以通过 `fetchType` 覆盖全局 `lazyLoadingEnabled` 配置。

当然了，不光是 MyBatis，几乎所有的包括 Hibernate，支持延迟加载的原理都是一样的。

### MyBatis 的 xml 映射文件中，不同的 xml 映射文件，id 是否可以重复？

注：我出的。

答：不同的 xml 映射文件，id 可以重复。

原因就是 namespace+id 是作为 `Map<String, MappedStatement>` 的 key 使用的，如果 namespace 不同，即使 id 重复，key (namespace+id) 也是不同的。

### MyBatis 中如何执行批处理？

注：我出的。

答：使用 `BatchExecutor` 完成批处理。

### MyBatis 都有哪些 Executor 执行器？它们之间的区别是什么？

注：我出的

答：MyBatis 有三种基本的 `Executor` 执行器：

- **`SimpleExecutor`：** 每执行一次 update 或 select，就开启一个 Statement 对象，用完立刻关闭 Statement 对象。
- **`ReuseExecutor`：** 执行 update 或 select，以 sql 作为 key 查找 Statement 对象，存在就使用，不存在就创建，用完后，不关闭 Statement 对象，而是放置于 Map<String, Statement>内，供下一次使用。简言之，就是重复使用 Statement 对象。
- **`BatchExecutor`**：执行 update（没有 select，JDBC 批处理不支持 select），将所有 sql 都添加到批处理中（addBatch()），等待统一执行（executeBatch()），它缓存了多个 Statement 对象，每个 Statement 对象都是 addBatch()完毕后，等待逐一执行 executeBatch()批处理。与 JDBC 批处理相同。

作用范围：`Executor` 的这些特点，都严格限制在 SqlSession 生命周期范围内。

### MyBatis 中如何指定使用哪一种 Executor 执行器？

注：我出的

答：在 MyBatis 配置文件中，可以指定默认的 `ExecutorType` 执行器类型，也可以手动给 `DefaultSqlSessionFactory` 的创建 SqlSession 的方法传递 `ExecutorType` 类型参数。

### MyBatis 是否可以映射 Enum 枚举类？

注：我出的

答：MyBatis 可以映射枚举类，不单可以映射枚举类，MyBatis 可以映射任何对象到表的一列上。映射方式为自定义一个 `TypeHandler` ，实现 `TypeHandler` 的 `setParameter()` 和 `getResult()` 接口方法。 `TypeHandler` 有两个作用：

- 一是完成从 javaType 至 jdbcType 的转换；
- 二是完成 jdbcType 至 javaType 的转换，体现为 `setParameter()` 和 `getResult()` 两个方法，分别代表设置 sql 问号占位符参数和获取列查询结果。

### MyBatis 映射文件中，如果 A 标签通过 include 引用了 B 标签的内容，请问，B 标签能否定义在 A 标签的后面，还是说必须定义在 A 标签的前面？

注：我出的

答：虽然 MyBatis 解析 xml 映射文件是按照顺序解析的，但是，被引用的 B 标签依然可以定义在任何地方，MyBatis 都可以正确识别。

原理是，MyBatis 解析 A 标签，发现 A 标签引用了 B 标签，但是 B 标签尚未解析到，尚不存在，此时，MyBatis 会将 A 标签标记为未解析状态，然后继续解析余下的标签，包含 B 标签，待所有标签解析完毕，MyBatis 会重新解析那些被标记为未解析的标签，此时再解析 A 标签时，B 标签已经存在，A 标签也就可以正常解析完成了。

### 简述 MyBatis 的 xml 映射文件和 MyBatis 内部数据结构之间的映射关系？

注：我出的

答：MyBatis 将 xml 配置信息解析并保存到 `Configuration` 中。在 xml 映射文件中， `<parameterMap>` 标签会被解析为 `ParameterMap` 对象，其每个子元素会被解析为 `ParameterMapping` 对象。 `<resultMap>` 标签会被解析为 `ResultMap` 对象，其每个子元素会被解析为 `ResultMapping` 对象。每一个 `<select>、<insert>、<update>、<delete>` 标签均会被解析为 `MappedStatement` 对象，标签内的 SQL 会被解析为 `SqlSource`；执行时，`SqlSource` 再根据实际参数生成 `BoundSql`。

### 为什么说 MyBatis 是半自动 ORM 映射工具？它与全自动的区别在哪里？

注：我出的

答：Hibernate 属于全自动 ORM 映射工具，使用 Hibernate 查询关联对象或者关联集合对象时，可以根据对象关系模型直接获取，所以它是全自动的。而 MyBatis 在查询关联对象或关联集合对象时，需要手动编写 sql 来完成，所以，称之为半自动 ORM 映射工具。

面试题看似都很简单，但是想要能正确回答上来，必定是研究过源码且深入的人，而不是仅会使用的人或者用的很熟的人，以上所有面试题及其答案所涉及的内容，在我的 MyBatis 系列博客中都有详细讲解和原理分析。

<!-- @include: @article-footer.snippet.md -->

### 文章推荐

- [2W 字全面剖析 Mybatis 中的 9 种设计模式](https://juejin.cn/post/7273516671574687759)
- [从零开始实现一个 MyBatis 加解密插件](https://mp.weixin.qq.com/s/WUEAdFDwZsZ4EKO8ix0ijg)
- [MyBatis 最全使用指南](https://juejin.cn/post/7051910683264286750)
- [脑洞打开！第一次看到这样使用 MyBatis 的，看得我一愣一愣的。](https://juejin.cn/post/7269390456530190376)
- [MyBatis 居然也有并发问题](https://juejin.cn/post/7264921613551730722)


---

---

<!-- source: spring/Async 注解原理分析.md -->

## [2] Async 注解原理分析

---
title: Async 注解原理分析
description: Spring @Async异步注解原理详解，涵盖异步任务配置、线程池设置、@EnableAsync机制及常见使用问题。
category: 框架
tag:
  - Spring
head:
  - - meta
    - name: keywords
      content: Spring异步,@Async,EnableAsync,线程池,TaskExecutor,异步任务,Spring注解,方法异步
---

`@Async` 注解由 Spring 框架提供，被该注解标注的类或方法会在 **异步线程** 中执行。这意味着当方法被调用时，调用者将不会等待该方法执行完成，而是可以继续执行后续的代码。

`@Async` 注解的使用非常简单，需要两个步骤：

1. 在启动类上添加注解 `@EnableAsync` ，开启异步任务。
2. 在需要异步执行的方法或类上添加注解 `@Async` 。

```java
@SpringBootApplication
// 开启异步任务
@EnableAsync
public class YourApplication {

    public static void main(String[] args) {
        SpringApplication.run(YourApplication.class, args);
    }
}

// 异步服务类
@Service
public class MyService {

    // 推荐使用自定义线程池，这里只是演示基本用法
    @Async
    public CompletableFuture<String> doSomethingAsync() {

        // 这里会有一些业务耗时操作
        // ...
        // 使用 CompletableFuture 可以更方便地处理异步任务的结果，避免阻塞主线程
        return CompletableFuture.completedFuture("Async Task Completed");
    }

}
```

接下来，我们一起来看看 `@Async` 的底层原理。

## @Async 原理分析

`@Async` 可以异步执行任务，本质上是使用 **动态代理** 来实现的。通过 Spring 中的后置处理器 `BeanPostProcessor` 为使用 `@Async` 注解的类创建动态代理，之后 `@Async` 注解方法的调用会被动态代理拦截，在拦截器中将方法的执行封装为异步任务提交给线程池处理。

接下来，我们来详细分析一下。

### 开启异步

使用 `@Async` 之前，需要在启动类上添加 `@EnableAsync` 来开启异步，`@EnableAsync` 注解如下：

```JAVA
// 省略其他注解 ...
@Import(AsyncConfigurationSelector.class)
public @interface EnableAsync { /* ... */ }
```

在 `@EnableAsync` 注解上通过 `@Import` 注解引入了 `AsyncConfigurationSelector` ，因此 Spring 会去加载通过 `@Import` 注解引入的类。

`AsyncConfigurationSelector` 类实现了 `ImportSelector` 接口，因此在该类中会重写 `selectImports()` 方法来自定义加载 Bean 的逻辑，如下：

```JAVA
public class AsyncConfigurationSelector extends AdviceModeImportSelector<EnableAsync> {
	@Override
	@Nullable
	public String[] selectImports(AdviceMode adviceMode) {
		switch (adviceMode) {
	   // 基于 Spring AOP 代理织入的通知，具体可能使用 JDK 动态代理或 CGLIB
			case PROXY:
				return new String[] {ProxyAsyncConfiguration.class.getName()};
   // 基于 AspectJ 织入的通知
			case ASPECTJ:
				return new String[] {ASYNC_EXECUTION_ASPECT_CONFIGURATION_CLASS_NAME};
			default:
				return null;
		}
	}
}
```

在 `selectImports()` 方法中，会根据通知的不同类型来选择加载不同的类，其中 `adviceMode` 默认值为 `PROXY` 。

这里以基于 Spring AOP 代理的通知为例，此时会加载 `ProxyAsyncConfiguration` 类，如下：

```JAVA
@Configuration
@Role(BeanDefinition.ROLE_INFRASTRUCTURE)
public class ProxyAsyncConfiguration extends AbstractAsyncConfiguration {
	@Bean(name = TaskManagementConfigUtils.ASYNC_ANNOTATION_PROCESSOR_BEAN_NAME)
	@Role(BeanDefinition.ROLE_INFRASTRUCTURE)
	public AsyncAnnotationBeanPostProcessor asyncAdvisor() {
		 // ...
  // 加载后置处理器
		AsyncAnnotationBeanPostProcessor bpp = new AsyncAnnotationBeanPostProcessor();

  // ...
		return bpp;
	}
}
```

### 后置处理器

在 `ProxyAsyncConfiguration` 类中，会通过 `@Bean` 注解加载一个后置处理器 `AsyncAnnotationBeanPostProcessor` ，这个后置处理器是使 `@Async` 注解起作用的关键。

如果某一个类或者方法上使用了 `@Async` 注解，`AsyncAnnotationBeanPostProcessor` 处理器就会为该类创建一个动态代理。

该类的方法在执行时，会被代理对象的拦截器所拦截，其中被 `@Async` 注解标记的方法会异步执行。

`AsyncAnnotationBeanPostProcessor` 代码如下：

```JAVA
public class AsyncAnnotationBeanPostProcessor extends AbstractBeanFactoryAwareAdvisingPostProcessor {
	@Override
	public void setBeanFactory(BeanFactory beanFactory) {
		super.setBeanFactory(beanFactory);
  // 创建 AsyncAnnotationAdvisor，它是一个 Advisor
  // 用于拦截带有 @Async 注解的方法并将这些方法异步执行。
		AsyncAnnotationAdvisor advisor = new AsyncAnnotationAdvisor(this.executor, this.exceptionHandler);
  // 如果设置了自定义的 asyncAnnotationType，则将其设置到 advisor 中。
  // asyncAnnotationType 用于指定自定义的异步注解，例如 @MyAsync。
		if (this.asyncAnnotationType != null) {
			advisor.setAsyncAnnotationType(this.asyncAnnotationType);
		}
		advisor.setBeanFactory(beanFactory);
		this.advisor = advisor;
	}
}
```

`AsyncAnnotationBeanPostProcessor` 的父类实现了 `BeanFactoryAware` 接口，因此在该类中重写了 `setBeanFactory()` 方法作为扩展点，来加载 `AsyncAnnotationAdvisor` 。

#### 创建 Advisor

`Advisor` 是 `Spring AOP` 对 `Advice` 和 `Pointcut` 的抽象。`Advice` 为执行的通知逻辑，`Pointcut` 为通知执行的切入点。

在后置处理器 `AsyncAnnotationBeanPostProcessor` 中会去创建 `AsyncAnnotationAdvisor` ， 在它的构造方法中，会构建对应的 `Advice` 和 `Pointcut` ，如下：

```JAVA
public class AsyncAnnotationAdvisor extends AbstractPointcutAdvisor implements BeanFactoryAware {

    private Advice advice; // 异步执行的 Advice
    private Pointcut pointcut; // 匹配 @Async 注解方法的切点

    // 构造函数
    public AsyncAnnotationAdvisor(/* 参数省略 */) {
        // 1. 创建 Advice，负责异步执行逻辑
        this.advice = buildAdvice(executor, exceptionHandler);
        // 2. 创建 Pointcut，选择要被增强的目标方法
        this.pointcut = buildPointcut(asyncAnnotationTypes);
    }

    // 创建 Advice
    protected Advice buildAdvice(/* 参数省略 */) {
        // 创建处理异步执行的拦截器
        AnnotationAsyncExecutionInterceptor interceptor = new AnnotationAsyncExecutionInterceptor(null);
        // 使用执行器和异常处理器配置拦截器
        interceptor.configure(executor, exceptionHandler);
        return interceptor;
    }

    // 创建 Pointcut
    protected Pointcut buildPointcut(Set<Class<? extends Annotation>> asyncAnnotationTypes) {
        ComposablePointcut result = null;
        for (Class<? extends Annotation> asyncAnnotationType : asyncAnnotationTypes) {
            // 1. 类级别切点：如果类上有注解则匹配
            Pointcut cpc = new AnnotationMatchingPointcut(asyncAnnotationType, true);
            // 2. 方法级别切点：如果方法上有注解则匹配
            Pointcut mpc = new AnnotationMatchingPointcut(null, asyncAnnotationType, true);

            if (result == null) {
                result = new ComposablePointcut(cpc);
            } else {
                // 使用 union 合并之前的切点
                result.union(cpc);
            }
            // 将方法级别切点添加到组合切点
            result = result.union(mpc);
        }
        // 返回组合切点，如果没有提供注解类型则返回 Pointcut.TRUE
        return (result != null ? result : Pointcut.TRUE);
    }
}
```

`AsyncAnnotationAdvisor` 的核心在于构建 `Advice` 和 `Pointcut` ：

- 构建 `Advice` ：会创建 `AnnotationAsyncExecutionInterceptor` 拦截器，在拦截器的 `invoke()` 方法中会执行通知的逻辑。
- 构建 `Pointcut` ：由 `ClassFilter` 和 `MethodMatcher` 组成，用于匹配哪些方法需要执行通知（ `Advice` ）的逻辑。

#### 后置处理逻辑

`AsyncAnnotationBeanPostProcessor` 后置处理器中实现的 `postProcessAfterInitialization()` 方法在其父类 `AbstractAdvisingBeanPostProcessor` 中，在 `Bean` 初始化之后，会进入到 `postProcessAfterInitialization()` 方法进行后置处理。

在后置处理方法中，会判断 `Bean` 是否符合后置处理器中 `Advisor` 通知的条件，如果符合，则创建代理对象。如下：

```JAVA
// AbstractAdvisingBeanPostProcessor
public Object postProcessAfterInitialization(Object bean, String beanName) {
	if (this.advisor == null || bean instanceof AopInfrastructureBean) {
		return bean;
	}
	if (bean instanceof Advised) {
		Advised advised = (Advised) bean;
		if (!advised.isFrozen() && isEligible(AopUtils.getTargetClass(bean))) {
			if (this.beforeExistingAdvisors) {
				advised.addAdvisor(0, this.advisor);
			}
			else {
				advised.addAdvisor(this.advisor);
			}
			return bean;
		}
	}
 // 判断给定的 Bean 是否符合后置处理器中 Advisor 通知的条件，符合的话，就创建代理对象。
	if (isEligible(bean, beanName)) {
		ProxyFactory proxyFactory = prepareProxyFactory(bean, beanName);
		if (!proxyFactory.isProxyTargetClass()) {
			evaluateProxyInterfaces(bean.getClass(), proxyFactory);
		}
  // 添加 Advisor。
		proxyFactory.addAdvisor(this.advisor);
		customizeProxyFactory(proxyFactory);
  // 返回代理对象。
		return proxyFactory.getProxy(getProxyClassLoader());
	}
	return bean;
}
```

### @Async 注解方法的拦截

`@Async` 注解方法的执行会在 `AnnotationAsyncExecutionInterceptor` 中被拦截，在 `invoke()` 方法中执行拦截器的逻辑。此时会将 `@Async` 注解标注的方法封装为异步任务，交给执行器来执行。

`invoke()` 方法在 `AnnotationAsyncExecutionInterceptor` 的父类 `AsyncExecutionInterceptor` 中定义，如下：

```JAVA
public class AsyncExecutionInterceptor extends AsyncExecutionAspectSupport implements MethodInterceptor, Ordered {
	@Override
	@Nullable
	public Object invoke(final MethodInvocation invocation) throws Throwable {
		Class<?> targetClass = (invocation.getThis() != null ? AopUtils.getTargetClass(invocation.getThis()) : null);
		Method specificMethod = ClassUtils.getMostSpecificMethod(invocation.getMethod(), targetClass);
		final Method userDeclaredMethod = BridgeMethodResolver.findBridgedMethod(specificMethod);

  // 1、确定异步任务执行器
		AsyncTaskExecutor executor = determineAsyncExecutor(userDeclaredMethod);

  // 2、将要执行的方法封装为 Callable 异步任务
		Callable<Object> task = () -> {
			try {
    // 2.1、执行方法
				Object result = invocation.proceed();
    // 2.2、如果方法返回值是 Future 类型，阻塞等待结果
				if (result instanceof Future) {
					return ((Future<?>) result).get();
				}
			}
			catch (ExecutionException ex) {
				handleError(ex.getCause(), userDeclaredMethod, invocation.getArguments());
			}
			catch (Throwable ex) {
				handleError(ex, userDeclaredMethod, invocation.getArguments());
			}
			return null;
		};
		// 3、提交任务
		return doSubmit(task, executor, invocation.getMethod().getReturnType());
	}
}
```

在 `invoke()` 方法中，主要有 3 个步骤：

1. 确定执行异步任务的执行器。
2. 将 `@Async` 注解标注的方法封装为 `Callable` 异步任务。
3. 将任务提交给执行器执行。

#### 1、获取异步任务执行器

在 `determineAsyncExecutor()` 方法中，会获取异步任务的执行器（即执行异步任务的 **线程池** ）。代码如下：

```JAVA
// 确定异步任务的执行器
protected AsyncTaskExecutor determineAsyncExecutor(Method method) {
 // 1、先从缓存中获取。
	AsyncTaskExecutor executor = this.executors.get(method);
	if (executor == null) {
		Executor targetExecutor;
  // 2、获取执行器的限定符。
		String qualifier = getExecutorQualifier(method);
		if (StringUtils.hasLength(qualifier)) {
   // 3、根据限定符获取对应的执行器。
			targetExecutor = findQualifiedExecutor(this.beanFactory, qualifier);
		}
		else {
   // 4、如果没有限定符，则使用默认的执行器。即 Spring 提供的默认线程池：SimpleAsyncTaskExecutor。
			targetExecutor = this.defaultExecutor.get();
		}
		if (targetExecutor == null) {
			return null;
		}
  // 5、将执行器包装为 TaskExecutorAdapter 适配器。
  // TaskExecutorAdapter 是 Spring 对于 JDK 线程池做的一层抽象，还是继承自 JDK 的线程池 Executor。这里可以不用管太多，只要知道它是线程池就可以了。
		executor = (targetExecutor instanceof AsyncListenableTaskExecutor ?
				(AsyncListenableTaskExecutor) targetExecutor : new TaskExecutorAdapter(targetExecutor));
		this.executors.put(method, executor);
	}
	return executor;
}
```

在 `determineAsyncExecutor()` 方法中确定了异步任务的执行器（线程池），主要是通过 `@Async` 注解的 `value` 值来获取执行器的限定符，根据限定符再去 `BeanFactory` 中查找对应的执行器就可以了。

如果在 `@Async` 注解中没有指定线程池，则会通过 `this.defaultExecutor.get()` 来获取默认的线程池，其中 `defaultExecutor` 在下边方法中进行赋值：

```JAVA
// AsyncExecutionInterceptor
protected Executor getDefaultExecutor(@Nullable BeanFactory beanFactory) {
 // 1、尝试从 beanFactory 中获取线程池。
	Executor defaultExecutor = super.getDefaultExecutor(beanFactory);
 // 2、如果 beanFactory 中没有，则创建 SimpleAsyncTaskExecutor 线程池。
	return (defaultExecutor != null ? defaultExecutor : new SimpleAsyncTaskExecutor());
}
```

其中 `super.getDefaultExecutor()` 会在 `beanFactory` 中尝试获取 `Executor` 类型的线程池。代码如下：

```JAVA
protected Executor getDefaultExecutor(@Nullable BeanFactory beanFactory) {
	if (beanFactory != null) {
		try {
   // 1、从 beanFactory 中获取 TaskExecutor 类型的线程池。
			return beanFactory.getBean(TaskExecutor.class);
		}
		catch (NoUniqueBeanDefinitionException ex) {
			try {
				// 2、如果有多个，则尝试从 beanFactory 中获取执行名称的 Executor 线程池。
				return beanFactory.getBean(DEFAULT_TASK_EXECUTOR_BEAN_NAME, Executor.class);
			}
			catch (NoSuchBeanDefinitionException ex2) {
				if (logger.isInfoEnabled()) {
					// ...
				}
			}
		}
		catch (NoSuchBeanDefinitionException ex) {
			try {
    // 3、如果没有，则尝试从 beanFactory 中获取执行名称的 Executor 线程池。
				return beanFactory.getBean(DEFAULT_TASK_EXECUTOR_BEAN_NAME, Executor.class);
			}
			catch (NoSuchBeanDefinitionException ex2) {
				// ...
			}
		}
	}
	return null;
}
```

在 `getDefaultExecutor()` 中，如果从 `beanFactory` 获取线程池失败的话，则会创建 `SimpleAsyncTaskExecutor` 线程池。

该线程池的在每次执行异步任务时，都会创建一个新的线程去执行任务，并不会对线程进行复用，从而导致异步任务执行的开销很大。一旦在 `@Async` 注解标注的方法某一瞬间并发量剧增，应用就会大量创建线程，从而影响服务质量甚至出现服务不可用。

同一时刻如果向 `SimpleAsyncTaskExecutor` 线程池提交 10000 个任务，那么该线程池就会创建 10000 个线程，其的 `execute()` 方法如下：

```JAVA
// SimpleAsyncTaskExecutor：execute() 内部会调用 doExecute()
protected void doExecute(Runnable task) {
    // 创建新线程
    Thread thread = (this.threadFactory != null ? this.threadFactory.newThread(task) : createThread(task));
    thread.start();
}
```

**建议：在使用 `@Async` 时需要自己指定线程池，避免 Spring 默认线程池带来的风险。**

在 `@Async` 注解中的 `value` 指定了线程池的限定符，根据限定符可以获取 **自定义的线程池** 。获取限定符的代码如下：

```JAVA
// AnnotationAsyncExecutionInterceptor
protected String getExecutorQualifier(Method method) {
	// 1.从方法上获取 Async 注解。
	Async async = AnnotatedElementUtils.findMergedAnnotation(method, Async.class);
 // 2. 如果方法上没有找到 @Async 注解，则尝试从方法所在的类上获取 @Async 注解。
	if (async == null) {
		async = AnnotatedElementUtils.findMergedAnnotation(method.getDeclaringClass(), Async.class);
	}
 // 3. 如果找到了 @Async 注解，则获取注解的 value 值并返回，作为线程池的限定符。
 //    如果 "value" 属性值为空字符串，则使用默认的线程池。
 //    如果没有找到 @Async 注解，则返回 null，同样使用默认的线程池。
	return (async != null ? async.value() : null);
}
```

#### 2、将方法封装为异步任务

在 `invoke()` 方法获取执行器之后，会将方法封装为异步任务，代码如下：

```JAVA
// 将要执行的方法封装为 Callable 异步任务
Callable<Object> task = () -> {
    try {
        // 2.1、执行被拦截的方法 (proceed() 方法是 AOP 中的核心方法，用于执行目标方法)
        Object result = invocation.proceed();

        // 2.2、代理返回给调用方的是实际的异步 Future，而目标方法受方法签名约束，
        //     会先返回一个临时 Future，因此这里需要在工作线程中解包临时 Future 的结果。
        if (result instanceof Future) {
            return ((Future<?>) result).get(); // 阻塞等待 Future 的结果
        }
    }
    catch (ExecutionException ex) {
        // 2.3、处理 ExecutionException 异常。 ExecutionException 是 Future.get() 方法抛出的异常，
        handleError(ex.getCause(), userDeclaredMethod, invocation.getArguments()); // 处理原始异常
    }
    catch (Throwable ex) {
        // 2.4、处理其他类型的异常。 将异常、被拦截的方法和方法参数作为参数调用 handleError() 方法进行处理。
        handleError(ex, userDeclaredMethod, invocation.getArguments());
    }
    // 2.5、如果方法返回值不是 Future 类型，或者发生异常，则返回 null。
    return null;
};
```

相比于 `Runnable` ，`Callable` 可以返回结果，并且抛出异常。

将 `invocation.proceed()` 的执行（原方法的执行）封装为 `Callable` 异步任务。这里仅仅当 `result` （方法返回值）类型为 `Future` 才返回，如果是其他类型则直接返回 `null` 。

因此使用 `@Async` 注解标注的方法如果使用 `Future` 类型之外的返回值，则无法获取方法的执行结果。

#### 3、提交异步任务

在 `AsyncExecutionInterceptor#invoke()` 中将要执行的方法封装为 Callable 任务之后，就会将任务交给执行器来执行。下面是 Spring Framework 5.3.x 的 `doSubmit()` 源码节选，其中包含后来被弃用并移除的 `ListenableFuture` 相关 API：

```JAVA
protected Object doSubmit(Callable<Object> task, AsyncTaskExecutor executor, Class<?> returnType) {
    // 根据方法的返回值类型，选择不同的异步执行方式并返回结果。
    // 1. 如果方法返回值是 CompletableFuture 类型
    if (CompletableFuture.class.isAssignableFrom(returnType)) {
        // 使用 CompletableFuture.supplyAsync() 方法异步执行任务。
        return CompletableFuture.supplyAsync(() -> {
            try {
                return task.call();
            }
            catch (Throwable ex) {
                throw new CompletionException(ex); // 将异常包装为 CompletionException，以便在 future.get() 时抛出
            }
        }, executor);
    }
    // 2. 如果方法返回值是 ListenableFuture 类型
    else if (ListenableFuture.class.isAssignableFrom(returnType)) {
        // 将 AsyncTaskExecutor 强制转换为 AsyncListenableTaskExecutor，
        // 并调用 submitListenable() 方法提交任务。
        // AsyncListenableTaskExecutor 是 ListenableFuture 的专用异步执行器，
        // 它可以返回一个 ListenableFuture 对象，允许添加回调函数来监听任务的完成。
        return ((AsyncListenableTaskExecutor) executor).submitListenable(task);
    }
    // 3. 如果方法返回值是 Future 类型
    else if (Future.class.isAssignableFrom(returnType)) {
        // 直接调用 AsyncTaskExecutor 的 submit() 方法提交任务，并返回一个 Future 对象。
        return executor.submit(task);
    }
    // 4. 如果方法返回值是 void 或其他类型
    else {
        // 直接调用 AsyncTaskExecutor 的 submit() 方法提交任务。
        // 由于方法返回值是 void，因此不需要返回任何结果，直接返回 null。
        executor.submit(task);
        return null;
    }
}
```

在 `doSubmit()` 方法中，会根据 `@Async` 注解标注方法的返回值不同，来选择不同的任务提交方式，最后任务会由执行器（线程池）执行。

### 总结

![Async原理总结](./images/Async 注解原理分析/async.png)

理解 `@Async` 原理的核心在于理解 `@EnableAsync` 注解，该注解开启了异步任务的功能。

主要流程如上图，会通过后置处理器来创建代理对象，之后代理对象中 `@Async` 方法的执行会走到 `Advice` 内部的拦截器中，之后将方法封装为异步任务，并提交线程池进行处理。

## @Async 使用建议

### 自定义线程池

如果没有显式地配置线程池，在 `@Async` 底层会先在 `BeanFactory` 中尝试获取线程池，如果获取不到，则会创建一个 `SimpleAsyncTaskExecutor` 实现。`SimpleAsyncTaskExecutor` 本质上不算是一个真正的线程池，因为它对于每个请求都会启动一个新线程而不重用现有线程，这会带来一些潜在的问题，例如资源消耗过大。

具体线程池获取可以参考这篇文章：[浅析 Spring 中 Async 注解底层异步线程池原理｜得物技术](https://mp.weixin.qq.com/s/FySv5L0bCdrlb5MoSfQtAA)。

一定要显式配置一个线程池，推荐`ThreadPoolTaskExecutor`。并且，还可以根据任务的性质和需求，为不同的异步方法指定不同的线程池。

```java
@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "executor1")
    public Executor executor1() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(3);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(50);
        executor.setThreadNamePrefix("AsyncExecutor1-");
        executor.initialize();
        return executor;
    }

    @Bean(name = "executor2")
    public Executor executor2() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(4);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("AsyncExecutor2-");
        executor.initialize();
        return executor;
    }
}
```

`@Async` 注解中指定线程池的 Bean 名称：

```java
@Service
public class AsyncService {

    @Async("executor1")
    public void performTask1() {
        // 任务1的逻辑
        System.out.println("Executing Task1 with Executor1");
    }

    @Async("executor2")
    public void performTask2() {
        // 任务2的逻辑
        System.out.println("Executing Task2 with Executor2");
    }
}
```

### 避免 @Async 注解失效

`@Async` 注解会在以下几个场景失效，需要注意：

**1、同一类中调用异步方法**

如果你在同一个类内部调用一个`@Async`注解的方法，那这个方法将不会异步执行。

```java
@Service
public class MyService {

    public void myMethod() {
        // 直接通过 this 引用调用，绕过了 Spring 的代理机制，异步执行失效
        asyncMethod();
    }

    @Async
    public void asyncMethod() {
        // 异步执行的逻辑
    }
}
```

这是因为 Spring 的异步机制是通过 **代理** 实现的，而在同一个类内部的方法调用会绕过 Spring 的代理机制，也就是绕过了代理对象，直接通过 this 引用调用的。由于没有经过代理，所有的代理相关的处理（即将任务提交线程池异步执行）都不会发生。

为了避免这个问题，比较推荐的做法是将异步方法移至另一个 Spring Bean 中。

```java
@Service
public class AsyncService {
    @Async
    public void asyncMethod() {
        // 异步执行的逻辑
    }
}

@Service
public class MyService {
    @Autowired
    private AsyncService asyncService;

    public void myMethod() {
        asyncService.asyncMethod();
    }
}
```

**2、使用 static 关键字修饰异步方法**

如果`@Async`注解的方法被 `static` 关键字修饰，那这个方法将不会异步执行。

这是因为 Spring 的异步机制是通过代理实现的，由于静态方法不属于实例而是属于类且不参与继承，Spring 的代理机制（无论是基于 JDK 还是 CGLIB）无法拦截静态方法来提供如异步执行这样的增强功能。

篇幅问题，这里没有进一步详细介绍，不了解的代理机制的朋友，可以看看我写的 [Java 代理模式详解](https://javaguide.cn/java/基础/proxy.html)这篇文章。

如果你需要异步执行一个静态方法的逻辑，可以考虑设计一个非静态的包装方法，这个包装方法使用 `@Async` 注解，并在其内部调用静态方法

```java
@Service
public class AsyncService {

    @Async
    public void asyncWrapper() {
        // 调用静态方法
        SClass.staticMethod();
    }
}

public class SClass {
    public static void staticMethod() {
        // 执行一些操作
    }
}
```

**3、忘记开启异步支持**

Spring Boot 默认情况下不启用异步支持，确保在主配置类 `Application` 上添加`@EnableAsync`注解以启用异步功能。

```java
@SpringBootApplication
@EnableAsync
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

**4、`@Async` 注解的方法所在的类必须是 Spring Bean**

`@Async` 注解的方法必须位于 Spring 管理的 Bean 中，只有这样，Spring 才能在创建 Bean 时应用代理，代理能够拦截方法调用并实现异步执行的逻辑。如果该方法不在 Spring 管理的 bean 中，Spring 就无法创建必要的代理，`@Async` 注解就不会产生任何效果。

### 返回值类型

建议将 `@Async` 注解方法的返回值类型定义为 `void` 和 `Future` 。

- 如果不需要获取异步方法返回的结果，将返回值类型定义为 `void` 。
- 如果需要获取异步方法返回的结果，将返回值类型定义为 `Future`（通常使用 `CompletableFuture`）。`ListenableFuture` 属于旧版 Spring API，不应在 Spring 6.1 及以上版本中继续使用。

如果将 `@Async` 注解方法的返回值定义为其他类型（如 `Object` 、 `String` 等等），则无法获取方法返回值。

这种设计符合异步编程的基本原则，即调用者不应立即期待一个结果，而是应该能够在未来某个时间点获取结果。如果返回类型是 `Future`，调用者可以使用这个返回的 `Future` 对象来查询任务的状态，取消任务，或者在任务完成时获取结果。

### 处理异步方法中的异常

异步方法中抛出的异常不会直接由调用线程捕获。返回 `Future` 或 `CompletableFuture` 的异步方法会通过 Future 暴露异常，可以使用 `get()`、`join()` 或 `CompletableFuture` 的异常处理方法处理；返回 `void` 的异步方法无法把异常传给调用者，可以配置全局的 `AsyncUncaughtExceptionHandler`。

```java
@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer{

    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return new CustomAsyncExceptionHandler();
    }

}

// 自定义异常处理器
class CustomAsyncExceptionHandler implements AsyncUncaughtExceptionHandler {

    @Override
    public void handleUncaughtException(Throwable ex, Method method, Object... params) {
        // 日志记录或其他处理逻辑
    }
}
```

### 未考虑事务管理

`@Async`注解的方法需要事务支持时，务必在该异步方法上独立使用。

```java
@Service
public class AsyncTransactionalService {

    @Async
    // Propagation.REQUIRES_NEW 表示 Spring 在执行异步方法时开启一个新的、与当前事务无关的事务
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void asyncTransactionalMethod() {
        // 这里的操作会在新的事务中执行
        // 执行一些数据库操作
    }
}
```

### 未指定异步方法执行顺序

`@Async`注解的方法执行是非阻塞的，它们可能以任意顺序完成。如果需要按照特定的顺序处理结果，你可以将方法的返回值设定为 `Future` 或 `CompletableFuture` ，通过返回值对象来实现一个方法在另一个方法完成后再执行。

```java
@Async
public CompletableFuture<String> fetchDataAsync() {
    return CompletableFuture.completedFuture("Data");
}

@Async
public CompletableFuture<String> processDataAsync(String data) {
    // 方法本身已经由 @Async 调度到受 Spring 管理的执行器，不要再提交到 commonPool。
    return CompletableFuture.completedFuture("Processed " + data);
}
```

`processDataAsync` 方法在 `fetchDataAsync`后执行：

```java
CompletableFuture<String> dataFuture = asyncService.fetchDataAsync();
dataFuture.thenCompose(data -> asyncService.processDataAsync(data))
          .thenAccept(result -> System.out.println(result));
```

##


---

---

<!-- source: spring/IoC & AOP详解（快速搞懂）.md -->

## [3] IoC & AOP详解（快速搞懂）

---
title: IoC & AOP详解（快速搞懂）
description: Spring IoC与AOP核心原理详解，深入讲解控制反转、依赖注入、切面编程及动态代理的实现机制。
category: 框架
tag:
  - Spring
head:
  - - meta
    - name: keywords
      content: IoC,DI,AOP,Spring IoC容器,依赖注入,切面编程,动态代理,Spring原理
---

这篇文章会从下面从以下几个问题展开对 IoC & AOP 的解释

- 什么是 IoC？
- IoC 解决了什么问题？
- IoC 和 DI 的区别？
- 什么是 AOP？
- AOP 解决了什么问题？
- AOP 的应用场景有哪些？
- AOP 为什么叫做切面编程？
- AOP 实现方式有哪些？

首先声明：IoC & AOP 不是 Spring 提出来的，它们在 Spring 之前其实已经存在了，只不过当时更加偏向于理论。Spring 在技术层次将这两个思想进行了很好的实现。

## IoC （Inversion of control ）

### 什么是 IoC?

IoC （Inversion of Control ）即控制反转/反转控制。它是一种思想不是一个技术实现。描述的是：Java 开发领域对象的创建以及管理的问题。

例如：现有类 A 依赖于类 B

- **传统的开发方式** ：往往是在类 A 中手动通过 new 关键字来 new 一个 B 的对象出来
- **使用 IoC 思想的开发方式** ：不通过 new 关键字来创建对象，而是通过 IoC 容器(Spring 框架) 来帮助我们实例化对象。我们需要哪个对象，直接从 IoC 容器里面去取即可。

从以上两种开发方式的对比来看：我们 “丧失了一个权力” (创建、管理对象的权力)，从而也得到了一个好处（不用再考虑对象的创建、管理等一系列的事情）

**为什么叫控制反转?**

- **控制** ：指的是对象创建（实例化、管理）的权力
- **反转** ：控制权交给外部环境（IoC 容器）

![IoC 图解](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/IoC&Aop-ioc-illustration.png)

### IoC 解决了什么问题?

IoC 的思想就是两方之间不互相依赖，由第三方容器来管理相关资源。这样有什么好处呢？

1. 对象之间的耦合度或者说依赖程度降低；
2. 资源变的容易管理；比如你用 Spring 容器提供的话很容易就可以实现一个单例。

例如：现有一个针对 User 的操作，利用 Service 和 Dao 两层结构进行开发

在没有使用 IoC 思想的情况下，Service 层想要使用 Dao 层的具体实现的话，需要通过 new 关键字在`UserServiceImpl` 中手动 new 出 `IUserDao` 的具体实现类 `UserDaoImpl`（不能直接 new 接口类）。

很完美，这种方式也是可以实现的，但是我们想象一下如下场景：

开发过程中突然接到一个新的需求，针对`IUserDao` 接口开发出另一个具体实现类。因为 Server 层依赖了`IUserDao`的具体实现，所以我们需要修改`UserServiceImpl`中 new 的对象。如果只有一个类引用了`IUserDao`的具体实现，可能觉得还好，修改起来也不是很费力气，但是如果有许许多多的地方都引用了`IUserDao`的具体实现的话，一旦需要更换`IUserDao` 的实现方式，那修改起来将会非常的头疼。

![IoC&Aop-ioc-illustration-dao-service](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/IoC&Aop-ioc-illustration-dao-service.png)

使用 IoC 的思想，我们将对象的控制权（创建、管理）交由 IoC 容器去管理，我们在使用的时候直接向 IoC 容器 “要” 就可以了

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/IoC&Aop-ioc-illustration-dao.png)

### IoC 和 DI 有区别吗？

IoC（Inverse of Control:控制反转）是一种设计思想或者说是某种模式。这个设计思想就是 **将原本在程序中手动创建对象的控制权交给第三方比如 IoC 容器。** 对于我们常用的 Spring 框架来说， IoC 容器实际上就是个 Map（key，value）,Map 中存放的是各种对象。不过，IoC 在其他语言中也有应用，并非 Spring 特有。

IoC 最常见以及最合理的实现方式叫做依赖注入（Dependency Injection，简称 DI）。

老马（Martin Fowler）在一篇文章中提到将 IoC 改名为 DI，原文如下，原文地址：<https://martinfowler.com/articles/injection.html> 。

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/martin-fowler-injection.png)

老马的大概意思是 IoC 太普遍并且不表意，很多人会因此而迷惑，所以，使用 DI 来精确指名这个模式比较好。

## AOP（Aspect oriented programming）

这里不会涉及太多专业的术语，核心目的是将 AOP 的思想说清楚。

### 什么是 AOP？

AOP（Aspect Oriented Programming）即面向切面编程，AOP 是 OOP（面向对象编程）的一种延续，二者互补，并不对立。

AOP 的目的是将横切关注点（如日志记录、事务管理、权限控制、接口限流、接口幂等等）从核心业务逻辑中分离出来，通过动态代理、字节码操作等技术，实现代码的复用和解耦，提高代码的可维护性和可扩展性。OOP 的目的是将业务逻辑按照对象的属性和行为进行封装，通过类、对象、继承、多态等概念，实现代码的模块化和层次化（也能实现代码的复用），提高代码的可读性和可维护性。

### AOP 为什么叫面向切面编程？

AOP 之所以叫面向切面编程，是因为它的核心思想就是将横切关注点从核心业务逻辑中分离出来，形成一个个的**切面（Aspect）**。

![面向切面编程图解](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/aop-program-execution.jpg)

这里顺带总结一下 AOP 关键术语（不理解也没关系，可以继续往下看）：

- **横切关注点（cross-cutting concerns）** ：多个类或对象中的公共行为（如日志记录、事务管理、权限控制、接口限流、接口幂等等）。
- **切面（Aspect）**：对横切关注点进行封装的类，一个切面是一个类。切面可以定义多个通知，用来实现具体的功能。
- **连接点（JoinPoint）**：连接点是方法调用或者方法执行时的某个特定时刻（如方法调用、异常抛出等）。
- **通知（Advice）**：通知就是切面在某个连接点要执行的操作。通知有五种类型，分别是前置通知（Before）、后置通知（After）、返回通知（AfterReturning）、异常通知（AfterThrowing）和环绕通知（Around）。前四种通知都是在目标方法的前后执行，而环绕通知可以控制目标方法的执行过程。
- **切点（Pointcut）**：一个切点是一个表达式，它用来匹配哪些连接点需要被切面所增强。切点可以通过注解、正则表达式、逻辑运算等方式来定义。比如 `execution(* com.xyz.service..*(..))`匹配 `com.xyz.service` 包及其子包下的类或接口。
- **织入（Weaving）**：织入是将切面和目标对象连接起来的过程，也就是将通知应用到切点匹配的连接点上。常见的织入时机有两种，分别是编译期织入（Compile-Time Weaving 如：AspectJ）和运行期织入（Runtime Weaving 如：AspectJ、Spring AOP）。

### AOP 常见的通知类型有哪些？

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/aspectj-advice-types.jpg)

- **Before**（前置通知）：目标对象的方法调用之前触发
- **After** （后置通知）：目标对象的方法调用之后触发
- **AfterReturning**（返回通知）：目标对象的方法调用完成，在返回结果值之后触发
- **AfterThrowing**（异常通知）：目标对象的方法运行中抛出 / 触发异常后触发。AfterReturning 和 AfterThrowing 两者互斥。如果方法调用成功无异常，则会有返回值；如果方法抛出了异常，则不会有返回值。
- **Around** （环绕通知）：编程式控制目标对象的方法调用。环绕通知是所有通知类型中可操作范围最大的一种，因为它可以直接拿到目标对象，以及要执行的方法，所以环绕通知可以任意的在目标对象的方法调用前后搞事，甚至不调用目标对象的方法

### AOP 解决了什么问题？

OOP 不能很好地处理一些分散在多个类或对象中的公共行为（如日志记录、事务管理、权限控制、接口限流、接口幂等等），这些行为通常被称为 **横切关注点（cross-cutting concerns）** 。如果我们在每个类或对象中都重复实现这些行为，那么会导致代码的冗余、复杂和难以维护。

AOP 可以将横切关注点（如日志记录、事务管理、权限控制、接口限流、接口幂等等）从 **核心业务逻辑（core concerns，核心关注点）** 中分离出来，实现关注点的分离。

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/crosscut-logic-and-businesslogic-separation%20%20%20%20%20%20.png)

以日志记录为例进行介绍，假如我们需要对某些方法进行统一格式的日志记录，没有使用 AOP 技术之前，我们需要挨个写日志记录的逻辑代码，全是重复的逻辑。

```java
public CommonResponse<Object> method1() {
      // 业务逻辑
      xxService.method1();
      // 省略具体的业务处理逻辑
      // 日志记录
      ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
      HttpServletRequest request = attributes.getRequest();
      // 省略记录日志的具体逻辑 如：获取各种信息，写入数据库等操作...
      return CommonResponse.success();
}

public CommonResponse<Object> method2() {
      // 业务逻辑
      xxService.method2();
      // 省略具体的业务处理逻辑
      // 日志记录
      ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
      HttpServletRequest request = attributes.getRequest();
      // 省略记录日志的具体逻辑 如：获取各种信息，写入数据库等操作...
      return CommonResponse.success();
}

// ...
```

使用 AOP 技术之后，我们可以将日志记录的逻辑封装成一个切面，然后通过切入点和通知来指定在哪些方法需要执行日志记录的操作。

```java

// 日志注解
@Target({ElementType.PARAMETER,ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Log {

    /**
     * 描述
     */
    String description() default "";

    /**
     * 方法类型 INSERT DELETE UPDATE OTHER
     */
    MethodType methodType() default MethodType.OTHER;
}

// 日志切面
@Component
@Aspect
public class LogAspect {
  // 切入点，所有被 Log 注解标注的方法
  @Pointcut("@annotation(cn.javaguide.annotation.Log)")
  public void webLog() {
  }

   /**
   * 环绕通知
   */
  @Around("webLog()")
  public Object doAround(ProceedingJoinPoint joinPoint) throws Throwable {
    // 省略具体的处理逻辑
  }

  // 省略其他代码
}
```

这样的话，我们一行注解即可实现日志记录：

```java
@Log(description = "method1",methodType = MethodType.INSERT)
public CommonResponse<Object> method1() {
      // 业务逻辑
      xxService.method1();
      // 省略具体的业务处理逻辑
      return CommonResponse.success();
}
```

### AOP 的应用场景有哪些？

- 日志记录：自定义日志记录注解，利用 AOP，一行代码即可实现日志记录。
- 性能统计：利用 AOP 在目标方法的执行前后统计方法的执行时间，方便优化和分析。
- 事务管理：`@Transactional` 注解可以让 Spring 为我们进行事务管理比如回滚异常操作，免去了重复的事务管理逻辑。`@Transactional`注解就是基于 AOP 实现的。
- 权限控制：利用 AOP 在目标方法执行前判断用户是否具备所需要的权限，如果具备，就执行目标方法，否则就不执行。例如，SpringSecurity 利用`@PreAuthorize` 注解一行代码即可自定义权限校验。
- 接口限流：利用 AOP 在目标方法执行前通过具体的限流算法和实现对请求进行限流处理。
- 缓存管理：利用 AOP 在目标方法执行前后进行缓存的读取和更新。
- ……

### AOP 实现方式有哪些？

AOP 的常见实现方式有动态代理、字节码操作等方式。

Spring AOP 就是基于动态代理的，如果要代理的对象，实现了某个接口，那么 Spring AOP 会使用 **JDK Proxy**，去创建代理对象，而对于没有实现接口的对象，就无法使用 JDK Proxy 去进行代理了，这时候 Spring AOP 会使用 CGLIB 生成一个被代理对象的子类来作为代理，如下图所示：

![SpringAOPProcess](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/230ae587a322d6e4d09510161987d346.jpeg)

**Spring Boot 和 Spring 的动态代理的策略是不是也是一样的呢？**其实不一样，很多人都理解错了。

Spring Boot 2.0 之前，`spring.aop.proxy-target-class` 默认值为 `false`，有用户接口时通常使用 **JDK 动态代理**；如果目标类没有可用接口，Spring AOP 仍会回退到 **CGLIB 动态代理**，并不会仅仅因为目标类没有实现接口就抛出异常。Spring Boot 1.5.x 自动配置 AOP 代码如下：

```java
@Configuration
@ConditionalOnClass({ EnableAspectJAutoProxy.class, Aspect.class, Advice.class })
@ConditionalOnProperty(prefix = "spring.aop", name = "auto", havingValue = "true", matchIfMissing = true)
public class AopAutoConfiguration {

	@Configuration
	@EnableAspectJAutoProxy(proxyTargetClass = false)
 // 该配置类只有在 spring.aop.proxy-target-class=false 或未显式配置时才会生效。
 // 也就是说，如果开发者未明确选择代理方式，Spring 会默认加载 JDK 动态代理。
	@ConditionalOnProperty(prefix = "spring.aop", name = "proxy-target-class", havingValue = "false", matchIfMissing = true)
	public static class JdkDynamicAutoProxyConfiguration {

	}

	@Configuration
	@EnableAspectJAutoProxy(proxyTargetClass = true)
 // 该配置类只有在 spring.aop.proxy-target-class=true 时才会生效。
 // 即开发者通过属性配置明确指定使用 CGLIB 动态代理时，Spring 会加载这个配置类。
	@ConditionalOnProperty(prefix = "spring.aop", name = "proxy-target-class", havingValue = "true", matchIfMissing = false)
	public static class CglibAutoProxyConfiguration {

	}

}
```

Spring Boot 2.0 开始，如果用户什么都不配置的话，默认使用 **CGLIB 动态代理**。如果需要强制使用 JDK 动态代理，可以在配置文件中添加：`spring.aop.proxy-target-class=false`。Spring Boot 2.0 自动配置 AOP 代码如下：

```java
@Configuration
@ConditionalOnClass({ EnableAspectJAutoProxy.class, Aspect.class, Advice.class,
		AnnotatedElement.class })
@ConditionalOnProperty(prefix = "spring.aop", name = "auto", havingValue = "true", matchIfMissing = true)
public class AopAutoConfiguration {

	@Configuration
	@EnableAspectJAutoProxy(proxyTargetClass = false)
 // 该配置类只有在 spring.aop.proxy-target-class=false 时才会生效。
 // 即开发者通过属性配置明确指定使用 JDK 动态代理时，Spring 会加载这个配置类。
	@ConditionalOnProperty(prefix = "spring.aop", name = "proxy-target-class", havingValue = "false", matchIfMissing = false)
	public static class JdkDynamicAutoProxyConfiguration {

	}

	@Configuration
	@EnableAspectJAutoProxy(proxyTargetClass = true)
 // 该配置类只有在 spring.aop.proxy-target-class=true 或未显式配置时才会生效。
 // 也就是说，如果开发者未明确选择代理方式，Spring 会默认加载 CGLIB 代理。
	@ConditionalOnProperty(prefix = "spring.aop", name = "proxy-target-class", havingValue = "true", matchIfMissing = true)
	public static class CglibAutoProxyConfiguration {

	}

}
```

当然你也可以使用 **AspectJ** ！Spring AOP 已经集成了 AspectJ ，AspectJ 应该算的上是 Java 生态系统中最完整的 AOP 框架了。

**Spring AOP 属于运行时增强，AspectJ 支持编译时、后编译以及类加载时织入。** Spring AOP 基于代理(Proxying)，而 AspectJ 基于字节码操作(Bytecode Manipulation)。

Spring AOP 已经集成了 AspectJ ，AspectJ 应该算的上是 Java 生态系统中最完整的 AOP 框架了。AspectJ 相比于 Spring AOP 功能更加强大，但是 Spring AOP 相对来说更简单。

如果我们的切面比较少，那么两者性能差异不大。但是，当切面太多的话，最好选择 AspectJ ，它比 Spring AOP 快很多。

## 参考

- AOP in Spring Boot, is it a JDK dynamic proxy or a Cglib dynamic proxy?：<https://www.springcloud.io/post/2022-01/springboot-aop/>
- Spring Proxying Mechanisms：<https://docs.spring.io/spring-framework/reference/core/aop/proxying.html>


---

---

<!-- source: spring/Spring 事务详解.md -->

## [4] Spring 事务详解

---
title: Spring 事务详解
description: Spring事务管理详解，涵盖@Transactional注解、事务传播行为、隔离级别、事务失效场景及回滚规则。
category: 框架
tag:
  - Spring
head:
  - - meta
    - name: keywords
      content: Spring事务,@Transactional,事务传播,隔离级别,事务失效,回滚规则,声明式事务,AOP事务
---

前段时间答应读者的 **Spring 事务** 分析总结终于来了。这部分内容比较重要，不论是对于工作还是面试，但是网上比较好的参考资料比较少。

## 什么是事务？

**事务是逻辑上的一组操作，要么都执行，要么都不执行。**

相信大家应该都能背上面这句话了，下面我结合我们日常的真实开发来谈一谈。

我们系统的每个业务方法可能包括了多个原子性的数据库操作，比如下面的 `savePerson()` 方法中就有两个原子性的数据库操作。这些原子性的数据库操作是有依赖的，它们要么都执行，要不就都不执行。

```java
  public void savePerson() {
    personDao.save(person);
    personDetailDao.save(personDetail);
  }
```

另外，需要格外注意的是：**事务能否生效数据库引擎是否支持事务是关键。比如常用的 MySQL 数据库默认使用支持事务的 `innodb`引擎。但是，如果把数据库引擎变为 `myisam`，那么程序也就不再支持事务了！**

事务最经典也经常被拿出来说例子就是转账了。假如小明要给小红转账 1000 元，这个转账会涉及到两个关键操作就是：

> 1. 将小明的余额减少 1000 元。
> 2. 将小红的余额增加 1000 元。

万一在这两个操作之间突然出现错误比如银行系统崩溃或者网络故障，导致小明余额减少而小红的余额没有增加，这样就不对了。事务就是保证这两个关键操作要么都成功，要么都要失败。

![事务示意图](https://oss.javaguide.cn/github/javaguide/mysql/%E4%BA%8B%E5%8A%A1%E7%A4%BA%E6%84%8F%E5%9B%BE.png)

```java
public class OrdersService {
  private AccountDao accountDao;

  public void setOrdersDao(AccountDao accountDao) {
    this.accountDao = accountDao;
  }

  @Transactional(propagation = Propagation.REQUIRED,
                isolation = Isolation.DEFAULT, readOnly = false, timeout = -1)
  public void accountMoney() {
    //小红账户多1000
    accountDao.addMoney(1000,xiaohong);
    //模拟突然出现的异常，比如银行中可能为突然停电等等
    //如果没有配置事务管理的话会造成，小红账户多了1000而小明账户没有少钱
    int i = 10 / 0;
    //小王账户少1000
    accountDao.reduceMoney(1000,xiaoming);
  }
}
```

另外，数据库事务的 ACID 四大特性是事务的基础，下面简单来了解一下。

## 事务的特性（ACID）了解么?

1. **原子性**（`Atomicity`）：事务是最小的执行单位，不允许分割。事务的原子性确保动作要么全部完成，要么完全不起作用；
2. **一致性**（`Consistency`）：执行事务前后，数据保持一致，例如转账业务中，无论事务是否成功，转账者和收款人的总额应该是不变的；
3. **隔离性**（`Isolation`）：并发访问数据库时，一个用户的事务不被其他事务所干扰，各并发事务之间数据库是独立的；
4. **持久性**（`Durability`）：一个事务被提交之后。它对数据库中数据的改变是持久的，即使数据库发生故障也不应该对其有任何影响。

🌈 这里要额外补充一点：**只有保证了事务的持久性、原子性、隔离性之后，一致性才能得到保障。也就是说 A、I、D 是手段，C 是目的！** 想必大家也和我一样，被 ACID 这个概念被误导了很久! 我也是看周志明老师的公开课[《周志明的软件架构课》](https://time.geekbang.org/opencourse/项目介绍/100064201)才搞清楚的（多看好书！！！）。

![AID->C](https://oss.javaguide.cn/github/javaguide/mysql/AID->C.png)

另外，DDIA 也就是 [《Designing Data-Intensive Application（数据密集型应用系统设计）》](https://book.douban.com/subject/30329536/) 的作者在他的这本书中如是说：

> Atomicity, isolation, and durability are properties of the database, whereas consis‐ tency (in the ACID sense) is a property of the application. The application may rely on the database’s atomicity and isolation properties in order to achieve consistency, but it’s not up to the database alone.
>
> 翻译过来的意思是：原子性，隔离性和持久性是数据库的属性，而一致性（在 ACID 意义上）是应用程序的属性。应用可能依赖数据库的原子性和隔离属性来实现一致性，但这并不仅取决于数据库。因此，字母 C 不属于 ACID 。

《Designing Data-Intensive Application（数据密集型应用系统设计）》这本书强推一波，值得读很多遍！豆瓣有接近 90% 的人看了这本书之后给了五星好评。另外，中文翻译版本已经在 GitHub 开源，地址：[https://github.com/Vonng/ddia](https://github.com/Vonng/ddia) 。

## 详谈 Spring 对事务的支持

> ⚠️ 再提醒一次：你的程序是否支持事务首先取决于数据库 ，比如使用 MySQL 的话，如果你选择的是 innodb 引擎，那么恭喜你，是可以支持事务的。但是，如果你的 MySQL 数据库使用的是 myisam 引擎的话，那不好意思，从根上就是不支持事务的。

这里再多提一下一个非常重要的知识点：**MySQL 怎么保证原子性的？**

我们知道如果想要保证事务的原子性，就需要在异常发生时，对已经执行的操作进行**回滚**，在 MySQL 中，恢复机制是通过 **回滚日志（undo log）** 实现的，所有事务进行的修改都会先记录到这个回滚日志中，然后再执行相关的操作。如果执行过程中遇到异常的话，我们直接利用 **回滚日志** 中的信息将数据回滚到修改之前的样子即可！并且，回滚日志会先于数据持久化到磁盘上。这样就保证了即使遇到数据库突然宕机等情况，当用户再次启动数据库的时候，数据库还能够通过查询回滚日志来回滚之前未完成的事务。

### Spring 支持两种方式的事务管理

#### 编程式事务管理

通过 `TransactionTemplate`或者`TransactionManager`手动管理事务，实际应用中很少使用，但是对于你理解 Spring 事务管理原理有帮助。

使用`TransactionTemplate` 进行编程式事务管理的示例代码如下：

```java
@Autowired
private TransactionTemplate transactionTemplate;
public void testTransaction() {

        transactionTemplate.execute(new TransactionCallbackWithoutResult() {
            @Override
            protected void doInTransactionWithoutResult(TransactionStatus transactionStatus) {

                try {

                    // ....  业务代码
                } catch (Exception e){
                    //回滚
                    transactionStatus.setRollbackOnly();
                }

            }
        });
}
```

使用 `TransactionManager` 进行编程式事务管理的示例代码如下：

```java
@Autowired
private PlatformTransactionManager transactionManager;

public void testTransaction() {

  TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());
          try {
               // ....  业务代码
              transactionManager.commit(status);
          } catch (Exception e) {
              transactionManager.rollback(status);
          }
}
```

#### 声明式事务管理

推荐使用（代码侵入性最小），实际是通过 AOP 实现（基于`@Transactional` 的全注解方式使用最多）。

使用 `@Transactional`注解进行事务管理的示例代码如下：

```java
@Transactional(propagation = Propagation.REQUIRED)
public void aMethod() {
  //do something
  B b = new B();
  C c = new C();
  b.bMethod();
  c.cMethod();
}
```

### Spring 事务管理接口介绍

Spring 框架中，事务管理相关最重要的 3 个接口如下：

- **`PlatformTransactionManager`**：（平台）事务管理器，Spring 事务策略的核心。
- **`TransactionDefinition`**：事务定义信息（事务隔离级别、传播行为、超时、只读等）。
- **`TransactionStatus`**：事务运行状态。

我们可以把 **`PlatformTransactionManager`** 接口可以被看作是事务上层的管理者，而 **`TransactionDefinition`** 和 **`TransactionStatus`** 这两个接口可以看作是事务的描述。

**`PlatformTransactionManager`** 会根据 **`TransactionDefinition`** 的定义比如事务超时时间、隔离级别、传播行为等来进行事务管理 ，而 **`TransactionStatus`** 接口则提供了一些方法来获取事务相应的状态比如是否新事务、是否可以回滚等等。

#### PlatformTransactionManager:事务管理接口

**Spring 并不直接管理事务，而是提供了多种事务管理器** 。Spring 事务管理器的接口是：**`PlatformTransactionManager`** 。

通过这个接口，Spring 为各个平台如：JDBC(`DataSourceTransactionManager`)、Hibernate(`HibernateTransactionManager`)、JPA(`JpaTransactionManager`)等都提供了对应的事务管理器，但是具体的实现就是各个平台自己的事情了。

**`PlatformTransactionManager` 接口的具体实现如下:**

![](./images/Spring 事务详解/PlatformTransactionManager.png)

`PlatformTransactionManager`接口中定义了三个方法：

```java
package org.springframework.transaction;

import org.springframework.lang.Nullable;

public interface PlatformTransactionManager {
    //获得事务
    TransactionStatus getTransaction(@Nullable TransactionDefinition var1) throws TransactionException;
    //提交事务
    void commit(TransactionStatus var1) throws TransactionException;
    //回滚事务
    void rollback(TransactionStatus var1) throws TransactionException;
}

```

**这里多插一嘴。为什么要定义或者说抽象出来`PlatformTransactionManager`这个接口呢？**

主要是因为要将事务管理行为抽象出来，然后不同的平台去实现它，这样我们可以保证提供给外部的行为不变，方便我们扩展。

我前段时间在我的[知识星球](https://javaguide.cn/关于作者/zhishixingqiu-two-years.html)分享过：**“为什么我们要用接口？”** 。

> 《设计模式》（GOF 那本）这本书在很多年前都提到过说要基于接口而非实现编程，你真的知道为什么要基于接口编程么？
>
> 纵观开源框架和项目的源码，接口是它们不可或缺的重要组成部分。要理解为什么要用接口，首先要搞懂接口提供了什么功能。我们可以把接口理解为提供了一系列功能列表的约定，接口本身不提供功能，它只定义行为。但是谁要用，就要先实现我，遵守我的约定，然后再自己去实现我定义的要实现的功能。
>
> 举个例子，我上个项目有发送短信的需求，为此，我们定了一个接口，接口只有两个方法:
>
> 1.发送短信 2.处理发送结果的方法。
>
> 刚开始我们用的是阿里云短信服务，然后我们实现这个接口完成了一个阿里云短信的服务。后来，我们突然又换到了别的短信服务平台，我们这个时候只需要再实现这个接口即可。这样保证了我们提供给外部的行为不变。几乎不需要改变什么代码，我们就轻松完成了需求的转变，提高了代码的灵活性和可扩展性。
>
> 什么时候用接口？当你要实现的功能模块设计抽象行为的时候，比如发送短信的服务，图床的存储服务等等。

#### TransactionDefinition:事务属性

事务管理器接口 **`PlatformTransactionManager`** 通过 **`getTransaction(TransactionDefinition definition)`** 方法来得到一个事务，这个方法里面的参数是 **`TransactionDefinition`** 类 ，这个类就定义了一些基本的事务属性。

**什么是事务属性呢？** 事务属性可以理解成事务的一些基本配置，描述了事务策略如何应用到方法上。

`TransactionDefinition` 主要包含以下 4 个事务配置方面：

- 隔离级别
- 传播行为
- 是否只读
- 事务超时

此外，`getName()` 方法可以返回事务名称。回滚规则不属于 `TransactionDefinition` 本身；Spring 声明式事务使用的 `TransactionAttribute` 继承了 `TransactionDefinition`，并在其上增加回滚规则等能力。

```java
package org.springframework.transaction;

import org.springframework.lang.Nullable;

public interface TransactionDefinition {
    int PROPAGATION_REQUIRED = 0;
    int PROPAGATION_SUPPORTS = 1;
    int PROPAGATION_MANDATORY = 2;
    int PROPAGATION_REQUIRES_NEW = 3;
    int PROPAGATION_NOT_SUPPORTED = 4;
    int PROPAGATION_NEVER = 5;
    int PROPAGATION_NESTED = 6;
    int ISOLATION_DEFAULT = -1;
    int ISOLATION_READ_UNCOMMITTED = 1;
    int ISOLATION_READ_COMMITTED = 2;
    int ISOLATION_REPEATABLE_READ = 4;
    int ISOLATION_SERIALIZABLE = 8;
    int TIMEOUT_DEFAULT = -1;
    // 返回事务的传播行为，默认值为 REQUIRED。
    int getPropagationBehavior();
    //返回事务的隔离级别，默认值是 DEFAULT
    int getIsolationLevel();
    // 返回事务的超时时间，默认值为-1。如果超过该时间限制但事务还没有完成，则自动回滚事务。
    int getTimeout();
    // 返回是否为只读事务，默认值为 false
    boolean isReadOnly();

    @Nullable
    String getName();
}
```

#### TransactionStatus:事务状态

`TransactionStatus`接口用来记录事务的状态 该接口定义了一组方法,用来获取或判断事务的相应状态信息。

`PlatformTransactionManager.getTransaction(…)`方法返回一个 `TransactionStatus` 对象。

**TransactionStatus 接口内容如下：**

```java
public interface TransactionStatus{
    boolean isNewTransaction(); // 是否是新的事务
    boolean hasSavepoint(); // 是否有恢复点
    void setRollbackOnly();  // 设置为只回滚
    boolean isRollbackOnly(); // 是否为只回滚
    boolean isCompleted(); // 是否已完成
}
```

### 事务属性详解

实际业务开发中，大家一般都是使用 `@Transactional` 注解来开启事务，很多人并不清楚这个注解里面的参数是什么意思，有什么用。为了更好的在项目中使用事务管理，强烈推荐好好阅读一下下面的内容。

#### 事务传播行为

**事务传播行为是为了解决业务层方法之间互相调用的事务问题**。

当事务方法被另一个事务方法调用时，必须指定事务应该如何传播。例如：方法可能继续在现有事务中运行，也可能开启一个新事务，并在自己的事务中运行。

举个例子：我们在 A 类的`aMethod()`方法中调用了 B 类的 `bMethod()` 方法。这个时候就涉及到业务层方法之间互相调用的事务问题。如果我们的 `bMethod()`如果发生异常需要回滚，如何配置事务传播行为才能让 `aMethod()`也跟着回滚呢？这个时候就需要事务传播行为的知识了，如果你不知道的话一定要好好看一下。

下面的传播行为代码均为省略 import 和部分实现细节的示意片段，其中 `Propagation.xxx` 是待替换的占位符，不是可直接编译的完整类。

```java
@Service
class A {
    @Autowired
    B b;
    @Transactional(propagation = Propagation.xxx)
    public void aMethod() {
        //do something
        b.bMethod();
    }
}

@Service
class B {
    @Transactional(propagation = Propagation.xxx)
    public void bMethod() {
       //do something
    }
}
```

在`TransactionDefinition`定义中包括了如下几个表示传播行为的常量：

```java
public interface TransactionDefinition {
    int PROPAGATION_REQUIRED = 0;
    int PROPAGATION_SUPPORTS = 1;
    int PROPAGATION_MANDATORY = 2;
    int PROPAGATION_REQUIRES_NEW = 3;
    int PROPAGATION_NOT_SUPPORTED = 4;
    int PROPAGATION_NEVER = 5;
    int PROPAGATION_NESTED = 6;
    ......
}
```

不过，为了方便使用，Spring 相应地定义了一个枚举类：`Propagation`

```java
package org.springframework.transaction.annotation;

import org.springframework.transaction.TransactionDefinition;

public enum Propagation {

    REQUIRED(TransactionDefinition.PROPAGATION_REQUIRED),

    SUPPORTS(TransactionDefinition.PROPAGATION_SUPPORTS),

    MANDATORY(TransactionDefinition.PROPAGATION_MANDATORY),

    REQUIRES_NEW(TransactionDefinition.PROPAGATION_REQUIRES_NEW),

    NOT_SUPPORTED(TransactionDefinition.PROPAGATION_NOT_SUPPORTED),

    NEVER(TransactionDefinition.PROPAGATION_NEVER),

    NESTED(TransactionDefinition.PROPAGATION_NESTED);

    private final int value;

    Propagation(int value) {
        this.value = value;
    }

    public int value() {
        return this.value;
    }

}

```

**正确的事务传播行为可能的值如下**：

**1.`TransactionDefinition.PROPAGATION_REQUIRED`**

使用的最多的一个事务传播行为，我们平时经常使用的`@Transactional`注解默认使用就是这个事务传播行为。如果当前存在事务，则加入该事务；如果当前没有事务，则创建一个新的事务。也就是说：

- 如果外部方法没有开启事务的话，`Propagation.REQUIRED`修饰的内部方法会新开启自己的事务，且开启的事务相互独立，互不干扰。
- 如果外部方法开启事务并且被`Propagation.REQUIRED`的话，所有`Propagation.REQUIRED`修饰的内部方法和外部方法均属于同一事务 ，只要一个方法回滚，整个事务均回滚。

举个例子：如果我们上面的`aMethod()`和`bMethod()`使用的都是`PROPAGATION_REQUIRED`传播行为的话，两者使用的就是同一个事务，只要其中一个方法回滚，整个事务均回滚。

```java
@Service
class A {
    @Autowired
    B b;
    @Transactional(propagation = Propagation.REQUIRED)
    public void aMethod() {
        //do something
        b.bMethod();
    }
}
@Service
class B {
    @Transactional(propagation = Propagation.REQUIRED)
    public void bMethod() {
       //do something
    }
}
```

**`2.TransactionDefinition.PROPAGATION_REQUIRES_NEW`**

创建一个新的事务，如果当前存在事务，则把当前事务挂起。也就是说不管外部方法是否开启事务，`Propagation.REQUIRES_NEW`修饰的内部方法会新开启自己的事务，且开启的事务相互独立，互不干扰。

举个例子：如果我们上面的`bMethod()`使用`PROPAGATION_REQUIRES_NEW`事务传播行为修饰，`aMethod`还是用`PROPAGATION_REQUIRED`修饰的话。如果`aMethod()`发生异常回滚，`bMethod()`不会跟着回滚，因为 `bMethod()`开启了独立的事务。但是，如果 `bMethod()`抛出了未被捕获的异常并且这个异常满足事务回滚规则的话,`aMethod()`同样也会回滚，因为这个异常被 `aMethod()`的事务管理机制检测到了。

```java
@Service
class A {
    @Autowired
    B b;
    @Transactional(propagation = Propagation.REQUIRED)
    public void aMethod() {
        //do something
        b.bMethod();
    }
}

@Service
class B {
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void bMethod() {
       //do something
    }
}
```

**3.`TransactionDefinition.PROPAGATION_NESTED`**:

如果当前存在事务，则创建一个事务作为当前事务的嵌套事务执行； 如果当前没有事务，就执行与`TransactionDefinition.PROPAGATION_REQUIRED`类似的操作。也就是说：

- 在外部方法开启事务的情况下，在内部开启一个新的事务，作为嵌套事务存在。
- 如果外部方法无事务，则单独开启一个事务，与 `PROPAGATION_REQUIRED` 类似。

`TransactionDefinition.PROPAGATION_NESTED`代表的嵌套事务以父子关系呈现，其核心理念是子事务不会独立提交，依赖于父事务，在父事务中运行；当父事务提交时，子事务也会随着提交，理所当然的，当父事务回滚时，子事务也会回滚；

> 与`TransactionDefinition.PROPAGATION_REQUIRES_NEW`区别于：`PROPAGATION_REQUIRES_NEW`是独立事务，不依赖于外部事务，以平级关系呈现，执行完就会立即提交，与外部事务无关；

子事务也有自己的特性，可以独立进行回滚，不会引发父事务的回滚，但是前提是需要处理子事务的异常，避免异常被父事务感知导致外部事务回滚；

举个例子：

- 如果 `aMethod()` 回滚的话，作为嵌套事务的`bMethod()`会回滚。
- 如果 `bMethod()` 回滚的话，`aMethod()`是否回滚，要看`bMethod()`的异常是否被处理：

  - `bMethod()`的异常没有被处理，即`bMethod()`内部没有处理异常，且`aMethod()`也没有处理异常，那么`aMethod()`将感知异常致使整体回滚。

    ```java
    @Service
    class A {
        @Autowired
        B b;
        @Transactional(propagation = Propagation.REQUIRED)
        public void aMethod (){
            //do something
            b.bMethod();
        }
    }

    @Service
    class B {
        @Transactional(propagation = Propagation.NESTED)
        public void bMethod (){
           //do something and throw an exception
        }
    }
    ```

  - `bMethod()`处理异常或`aMethod()`处理异常，`aMethod()`不会回滚。

    ```java
    @Service
    class A {
        @Autowired
        B b;
        @Transactional(propagation = Propagation.REQUIRED)
        public void aMethod (){
            //do something
            try {
                b.bMethod();
            } catch (Exception e) {
                System.out.println("方法回滚");
            }
        }
    }

    @Service
    class B {
        @Transactional(propagation = Propagation.NESTED)
        public void bMethod() {
           //do something and throw an exception
        }
    }
    ```

**4.`TransactionDefinition.PROPAGATION_MANDATORY`**

如果当前存在事务，则加入该事务；如果当前没有事务，则抛出异常。（mandatory：强制性）

这个使用的很少，就不举例子来说了。

**以下 3 种传播行为对现有事务的处理方式不同，不能按同一种回滚规则理解。**

- **`TransactionDefinition.PROPAGATION_SUPPORTS`**：如果当前存在事务，则加入该事务，其中的操作会参与该事务的提交或回滚；如果当前没有事务，则以非事务方式运行。
- **`TransactionDefinition.PROPAGATION_NOT_SUPPORTED`**：始终以非事务方式运行；如果当前存在事务，则先把它挂起。因此，在该传播边界内执行的操作不受被挂起外层事务的回滚控制。
- **`TransactionDefinition.PROPAGATION_NEVER`**：仅允许以非事务方式运行；如果检测到当前存在事务，则直接抛出异常。

更多关于事务传播行为的内容请看这篇文章：[《太难了~面试官让我结合案例讲讲自己对 Spring 事务传播行为的理解。》](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247486668&idx=2&sn=0381e8c836442f46bdc5367170234abb&chksm=cea24307f9d5ca11c96943b3ccfa1fc70dc97dd87d9c540388581f8fe6d805ff548dff5f6b5b&token=1776990505&lang=zh_CN#rd)

#### 事务隔离级别

`TransactionDefinition` 接口中定义了五个表示隔离级别的常量：

```java
public interface TransactionDefinition {
    ......
    int ISOLATION_DEFAULT = -1;
    int ISOLATION_READ_UNCOMMITTED = 1;
    int ISOLATION_READ_COMMITTED = 2;
    int ISOLATION_REPEATABLE_READ = 4;
    int ISOLATION_SERIALIZABLE = 8;
    ......
}
```

和事务传播行为那块一样，为了方便使用，Spring 也相应地定义了一个枚举类：`Isolation`

```java
public enum Isolation {

  DEFAULT(TransactionDefinition.ISOLATION_DEFAULT),

  READ_UNCOMMITTED(TransactionDefinition.ISOLATION_READ_UNCOMMITTED),

  READ_COMMITTED(TransactionDefinition.ISOLATION_READ_COMMITTED),

  REPEATABLE_READ(TransactionDefinition.ISOLATION_REPEATABLE_READ),

  SERIALIZABLE(TransactionDefinition.ISOLATION_SERIALIZABLE);

  private final int value;

  Isolation(int value) {
    this.value = value;
  }

  public int value() {
    return this.value;
  }

}
```

下面我依次对每一种事务隔离级别进行介绍：

- **`TransactionDefinition.ISOLATION_DEFAULT`** :使用后端数据库默认的隔离级别，MySQL 默认采用的 `REPEATABLE_READ` 隔离级别 Oracle 默认采用的 `READ_COMMITTED` 隔离级别.
- **`TransactionDefinition.ISOLATION_READ_UNCOMMITTED`** :最低的隔离级别，使用这个隔离级别很少，因为它允许读取尚未提交的数据变更，**可能会导致脏读、幻读或不可重复读**
- **`TransactionDefinition.ISOLATION_READ_COMMITTED`** : 允许读取并发事务已经提交的数据，**可以阻止脏读，但是幻读或不可重复读仍有可能发生**
- **`TransactionDefinition.ISOLATION_REPEATABLE_READ`** : 对同一字段的多次读取结果都是一致的，除非数据是被本身事务自己所修改，**可以阻止脏读和不可重复读，但幻读仍有可能发生。**
- **`TransactionDefinition.ISOLATION_SERIALIZABLE`** : 最高的隔离级别，完全服从 ACID 的隔离级别。所有的事务依次逐个执行，这样事务之间就完全不可能产生干扰，也就是说，**该级别可以防止脏读、不可重复读以及幻读**。但是这将严重影响程序的性能。通常情况下也不会用到该级别。

相关阅读：[MySQL 事务隔离级别详解](https://javaguide.cn/数据库/mysql/transaction-isolation-level.html)。

#### 事务超时属性

所谓事务超时，就是指一个事务所允许执行的最长时间，如果超过该时间限制但事务还没有完成，则自动回滚事务。在 `TransactionDefinition` 中以 int 的值来表示超时时间，其单位是秒，默认值为-1，这表示事务的超时时间取决于底层事务系统或者没有超时时间。

#### 事务只读属性

```java
package org.springframework.transaction;

import org.springframework.lang.Nullable;

public interface TransactionDefinition {
    ......
    // 返回是否为只读事务，默认值为 false
    boolean isReadOnly();

}
```

对于只有读取数据查询的事务，可以指定事务类型为 readonly，即只读事务。只读事务不涉及数据的修改，数据库会提供一些优化手段，适合用在有多条数据库查询操作的方法中。

很多人就会疑问了，为什么我一个数据查询操作还要启用事务支持呢？

拿 MySQL 的 innodb 举例子，根据官网 [https://dev.mysql.com/doc/refman/5.7/en/innodb-autocommit-commit-rollback.html](https://dev.mysql.com/doc/refman/5.7/en/innodb-autocommit-commit-rollback.html) 描述：

> MySQL 默认对每一个新建立的连接都启用了`autocommit`模式。在该模式下，每一个发送到 MySQL 服务器的`sql`语句都会在一个单独的事务中进行处理，执行结束后会自动提交事务，并开启一个新的事务。

但是，如果你给方法加上了 `@Transactional` 注解，这个方法执行的所有 SQL 会被放在一个事务中。声明只读事务后，Spring 会把只读提示传递给底层事务系统；是否以及如何优化取决于数据库、驱动和事务管理器，它也不保证写操作一定失败。

如果不加`Transactional`，每条`sql`会开启一个单独的事务，中间被其它事务改了数据，都会实时读取到最新值。

分享一下关于事务只读属性，其他人的解答：

- 如果你一次执行单条查询语句，则没有必要启用事务支持，数据库默认支持 SQL 执行期间的读一致性；
- 如果你一次执行多条查询语句，例如统计查询，报表查询，在这种场景下，多条查询 SQL 必须保证整体的读一致性，否则，在前条 SQL 查询之后，后条 SQL 查询之前，数据被其他用户改变，则该次整体的统计查询将会出现读数据不一致的状态，此时，应该启用事务支持

#### 事务回滚规则

这些规则定义了哪些异常会导致事务回滚而哪些不会。默认情况下，事务只有遇到运行期异常（`RuntimeException` 的子类）时才会回滚，`Error` 也会导致事务回滚，但是，在遇到检查型（Checked）异常时不会回滚。

![](./images/Spring 事务详解/roollbackFor.png)

如果你想要回滚你定义的特定的异常类型的话，可以这样：

```java
@Transactional(rollbackFor= MyException.class)
```

### @Transactional 注解使用详解

#### `@Transactional` 的作用范围

1. **方法**：推荐将注解使用于方法上。Spring 6 的类代理默认还支持 `protected` 和包可见方法；接口代理要求方法是接口中定义的 `public` 方法。较早版本的代理模式通常只支持 `public` 方法。
2. **类**：如果这个注解使用在类上，表明该类中符合上述代理可见性规则的方法都应用相同的事务语义。
3. **接口**：不推荐在接口上使用。

#### `@Transactional` 的常用配置参数

`@Transactional`注解源码如下，里面包含了基本事务属性的配置：

```java
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Documented
public @interface Transactional {

  @AliasFor("transactionManager")
  String value() default "";

  @AliasFor("value")
  String transactionManager() default "";

  Propagation propagation() default Propagation.REQUIRED;

  Isolation isolation() default Isolation.DEFAULT;

  int timeout() default TransactionDefinition.TIMEOUT_DEFAULT;

  boolean readOnly() default false;

  Class<? extends Throwable>[] rollbackFor() default {};

  String[] rollbackForClassName() default {};

  Class<? extends Throwable>[] noRollbackFor() default {};

  String[] noRollbackForClassName() default {};

}
```

**`@Transactional` 的常用配置参数总结（只列出了 5 个我平时比较常用的）：**

| 属性名      | 说明                                                                                         |
| :---------- | :------------------------------------------------------------------------------------------- |
| propagation | 事务的传播行为，默认值为 REQUIRED，可选的值在上面介绍过                                      |
| isolation   | 事务的隔离级别，默认值采用 DEFAULT，可选的值在上面介绍过                                     |
| timeout     | 事务的超时时间，默认值为-1（不会超时）。如果超过该时间限制但事务还没有完成，则自动回滚事务。 |
| readOnly    | 指定事务是否为只读事务，默认值为 false。                                                     |
| rollbackFor | 用于指定能够触发事务回滚的异常类型，并且可以指定多个异常类型。                               |

#### `@Transactional` 事务注解原理

面试中在问 AOP 的时候可能会被问到的一个问题。简单说下吧！

我们知道，**`@Transactional` 的工作机制是基于 AOP 实现的，AOP 又是使用动态代理实现的。如果目标对象实现了接口，默认情况下会采用 JDK 的动态代理，如果目标对象没有实现了接口,会使用 CGLIB 动态代理。**

🤐 多提一嘴：`createAopProxy()` 方法 决定了是使用 JDK 还是 Cglib 来做动态代理，源码如下：

```java
public class DefaultAopProxyFactory implements AopProxyFactory, Serializable {

  @Override
  public AopProxy createAopProxy(AdvisedSupport config) throws AopConfigException {
    if (config.isOptimize() || config.isProxyTargetClass() || hasNoUserSuppliedProxyInterfaces(config)) {
      Class<?> targetClass = config.getTargetClass();
      if (targetClass == null) {
        throw new AopConfigException("TargetSource cannot determine target class: " +
            "Either an interface or a target is required for proxy creation.");
      }
      if (targetClass.isInterface() || Proxy.isProxyClass(targetClass)) {
        return new JdkDynamicAopProxy(config);
      }
      return new ObjenesisCglibAopProxy(config);
    }
    else {
      return new JdkDynamicAopProxy(config);
    }
  }
  .......
}
```

如果一个类或者一个类中的 public 方法上被标注`@Transactional` 注解的话，Spring 容器就会在启动的时候为其创建一个代理类，在调用被`@Transactional` 注解的 public 方法的时候，实际调用的是，`TransactionInterceptor` 类中的 `invoke()`方法。这个方法的作用就是在目标方法之前开启事务，方法执行过程中如果遇到异常的时候回滚事务，方法调用完成之后提交事务。

> `TransactionInterceptor` 类中的 `invoke()`方法内部实际调用的是 `TransactionAspectSupport` 类的 `invokeWithinTransaction()`方法。由于新版本的 Spring 对这部分重写很大，而且用到了很多响应式编程的知识，这里就不列源码了。

#### Spring AOP 自调用问题

当一个方法被标记了`@Transactional` 注解的时候，Spring 事务管理器只会在被其他类方法调用的时候生效，而不会在一个类中方法调用生效。

这是因为 Spring AOP 工作原理决定的。因为 Spring AOP 使用动态代理来实现事务的管理，它会在运行的时候为带有 `@Transactional` 注解的方法生成代理对象，并在方法调用的前后应用事物逻辑。如果该方法被其他类调用我们的代理对象就会拦截方法调用并处理事务。但是在一个类中的其他方法内部调用的时候，我们代理对象就无法拦截到这个内部调用，因此事务也就失效了。

`MyService` 类中的`method1()`调用`method2()`就会导致`method2()`的事务失效。

```java
@Service
public class MyService {

private void method1() {
     method2();
     //......
}
@Transactional
 public void method2() {
     //......
  }
}
```

解决办法就是避免同一类中自调用或者使用 AspectJ 取代 Spring AOP 代理。

[issue #2091](https://github.com/Snailclimb/JavaGuide/issues/2091)补充了一个例子：

```java
@Service
public class MyService {

private void method1() {
     // 需要先配置 @EnableAspectJAutoProxy(exposeProxy = true)
     ((MyService) AopContext.currentProxy()).method2();
     //......
}
@Transactional
 public void method2() {
     //......
  }
}
```

上面的代码只有在启用 `exposeProxy`（例如配置 `@EnableAspectJAutoProxy(exposeProxy = true)`）后才能通过 `AopContext.currentProxy()` 获取当前代理对象。这样调用 `method2()` 会经过代理，事务注解才会生效。由于这种写法会让业务代码依赖 AOP 上下文，通常更推荐拆分类职责来避免自调用。

#### `@Transactional` 的使用注意事项总结

- `@Transactional` 的方法可见性限制取决于代理类型和 Spring 版本：Spring 6 的类代理默认支持 `public`、`protected` 和包可见方法，接口代理要求方法是接口中定义的 `public` 方法；较早版本的代理模式通常只支持 `public` 方法；
- 避免同一个类中调用 `@Transactional` 注解的方法，这样会导致事务失效；
- 正确的设置 `@Transactional` 的 `rollbackFor` 和 `propagation` 属性，否则事务可能会回滚失败;
- 被 `@Transactional` 注解的方法所在的类必须被 Spring 管理，否则不生效；
- 底层使用的数据库必须支持事务机制，否则不生效；
- ……

## 参考

- [总结]Spring 事务管理中@Transactional 的参数:[http://www.mobabel.net/spring 事务管理中 transactional 的参数/](http://www.mobabel.net/spring事务管理中transactional的参数/)
- Spring 官方文档：[https://docs.spring.io/spring/docs/4.2.x/spring-framework-reference/html/transaction.html](https://docs.spring.io/spring/docs/4.2.x/spring-framework-reference/html/transaction.html)
- 《Spring5 高级编程》
- 透彻的掌握 Spring 中@transactional 的使用: [https://www.ibm.com/developerworks/cn/java/j-master-spring-transactional-use/index.html](https://www.ibm.com/developerworks/cn/java/j-master-spring-transactional-use/index.html)
- Spring 事务的传播特性：[https://github.com/love-somnus/Spring/wiki/Spring 事务的传播特性](https://github.com/love-somnus/Spring/wiki/Spring事务的传播特性)
- [Spring 事务传播行为详解](https://segmentfault.com/a/1190000013341344)：[https://segmentfault.com/a/1190000013341344](https://segmentfault.com/a/1190000013341344)
- 全面分析 Spring 的编程式事务管理及声明式事务管理：[https://www.ibm.com/developerworks/cn/education/opensource/os-cn-spring-trans/index.html](https://www.ibm.com/developerworks/cn/education/opensource/os-cn-spring-trans/index.html)

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: spring/Spring 中的设计模式详解.md -->

## [5] Spring 中的设计模式详解

---
title: Spring 中的设计模式详解
description: Spring框架设计模式详解，涵盖工厂模式、代理模式、单例模式、模板方法等在Spring源码中的应用实践。
category: 框架
tag:
  - Spring
head:
  - - meta
    - name: keywords
      content: Spring设计模式,工厂模式,代理模式,模板方法,单例,策略模式,适配器模式,Spring源码
---

“JDK 中用到了哪些设计模式? Spring 中用到了哪些设计模式? ”这两个问题，在面试中比较常见。

我在网上搜索了一下关于 Spring 中设计模式的讲解几乎都是千篇一律，而且大部分都年代久远。所以，花了几天时间自己总结了一下。

由于我的个人能力有限，文中如有任何错误各位都可以指出。另外，文章篇幅有限，对于设计模式以及一些源码的解读我只是一笔带过，这篇文章的主要目的是回顾一下 Spring 中的设计模式。

## 控制反转(IoC)和依赖注入(DI)

**IoC(Inversion of Control,控制反转)** 是 Spring 中一个非常非常重要的概念，它不是什么技术，而是一种解耦的设计思想。IoC 的主要目的是借助于“第三方”(Spring 中的 IoC 容器) 实现具有依赖关系的对象之间的解耦(IOC 容器管理对象，你只管使用即可)，从而降低代码之间的耦合度。

**IoC 是一个原则，而不是一个模式，以下模式（但不限于）实现了 IoC 原则。**

![ioc-patterns](https://oss.javaguide.cn/github/javaguide/ioc-patterns.png)

**Spring IoC 容器就像是一个工厂一样，当我们需要创建一个对象的时候，只需要配置好配置文件/注解即可，完全不用考虑对象是如何被创建出来的。** IoC 容器负责创建对象，将对象连接在一起，配置这些对象，并从创建中处理这些对象的整个生命周期，直到它们被完全销毁。

在实际项目中一个 Service 类如果有几百甚至上千个类作为它的底层，我们需要实例化这个 Service，你可能要每次都要搞清这个 Service 所有底层类的构造函数，这可能会把人逼疯。如果利用 IOC 的话，你只需要配置好，然后在需要的地方引用就行了，这大大增加了项目的可维护性且降低了开发难度。

> 关于 Spring IOC 的理解，推荐看这一下知乎的一个回答：<https://www.zhihu.com/question/23277575/answer/169698662> ，非常不错。

**控制反转怎么理解呢?** 举个例子："对象 a 依赖了对象 b，当对象 a 需要使用 对象 b 的时候必须自己去创建。但是当系统引入了 IOC 容器后， 对象 a 和对象 b 之间就失去了直接的联系。这个时候，当对象 a 需要使用 对象 b 的时候， 我们可以指定 IOC 容器去创建一个对象 b 注入到对象 a 中"。 对象 a 获得依赖对象 b 的过程,由主动行为变为了被动行为，控制权反转，这就是控制反转名字的由来。

**DI(Dependency Inject,依赖注入)是实现控制反转的一种设计模式，依赖注入就是将实例变量传入到一个对象中去。**

## 工厂设计模式

Spring 使用工厂模式可以通过 `BeanFactory` 或 `ApplicationContext` 创建 bean 对象。

**两者对比：**

- `BeanFactory`：提供 Spring IoC 容器的基础能力。直接使用基础 `BeanFactory` 时，容器通常不会主动预实例化所有单例 Bean，而是在第一次请求 Bean 时创建。
- `ApplicationContext`：扩展了 `BeanFactory`，增加了事件发布、国际化、资源加载等能力，并默认在容器启动阶段预实例化非懒加载的单例 Bean；`prototype` Bean 和标记为 lazy 的 Bean 不会因此被一次性全部创建。

`ApplicationContext` 的三个常见实现类：

1. `ClassPathXmlApplicationContext`：把上下文文件当成类路径资源。
2. `FileSystemXmlApplicationContext`：从文件系统中的 XML 文件载入上下文定义信息。
3. `XmlWebApplicationContext`：从 Web 系统中的 XML 文件载入上下文定义信息。

Example:

```java
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.FileSystemXmlApplicationContext;

public class App {
  public static void main(String[] args) {
    ApplicationContext context = new FileSystemXmlApplicationContext(
        "C:/工作/IOC Containers/springframework.applicationcontext/src/main/resources/bean-factory-config.xml");

    HelloApplicationContext obj = (HelloApplicationContext) context.getBean("helloApplicationContext");
    obj.getMsg();
  }
}
```

## 单例设计模式

在我们的系统中，有一些对象其实我们只需要一个，比如说：线程池、缓存、对话框、注册表、日志对象、充当打印机、显卡等设备驱动程序的对象。事实上，这一类对象只能有一个实例，如果制造出多个实例就可能会导致一些问题的产生，比如：程序的行为异常、资源使用过量、或者不一致性的结果。

**使用单例模式的好处** :

- 对于频繁使用的对象，可以省略创建对象所花费的时间，这对于那些重量级对象而言，是非常可观的一笔系统开销；
- 由于 new 操作的次数减少，因而对系统内存的使用频率也会降低，这将减轻 GC 压力，缩短 GC 停顿时间。

**Spring 中 bean 的默认作用域就是 singleton(单例)的。** 除了 singleton 作用域，Spring 中 bean 还有下面几种作用域：

- **prototype** : 每次获取都会创建一个新的 bean 实例。也就是说，连续 `getBean()` 两次，得到的是不同的 Bean 实例。
- **request** （仅 Web 应用可用）: 每一次 HTTP 请求都会产生一个新的 bean（请求 bean），该 bean 仅在当前 HTTP request 内有效。
- **session** （仅 Web 应用可用） : 每一次来自新 session 的 HTTP 请求都会产生一个新的 bean（会话 bean），该 bean 仅在当前 HTTP session 内有效。
- **application** （仅 Web 应用可用）：每个 `ServletContext` 对应一个 Bean 实例，该 bean 仅在当前 Web 应用生命周期内有效。旧版 Spring 还为 Portlet 应用提供过独立的 `globalSession` 作用域，它不属于当前标准作用域列表。
- **websocket** （仅 Web 应用可用）：每一次 WebSocket 会话产生一个新的 bean。

Spring 通过 `ConcurrentHashMap` 实现单例注册表的特殊方式实现单例模式。

Spring 实现单例的核心代码如下：

```java
// 通过 ConcurrentHashMap（线程安全） 实现单例注册表
private final Map<String, Object> singletonObjects = new ConcurrentHashMap<String, Object>(64);

public Object getSingleton(String beanName, ObjectFactory<?> singletonFactory) {
        Assert.notNull(beanName, "'beanName' must not be null");
        synchronized (this.singletonObjects) {
            // 检查缓存中是否存在实例
            Object singletonObject = this.singletonObjects.get(beanName);
            if (singletonObject == null) {
                //...省略了很多代码
                try {
                    singletonObject = singletonFactory.getObject();
                }
                //...省略了很多代码
                // 如果实例对象在不存在，我们注册到单例注册表中。
                addSingleton(beanName, singletonObject);
            }
            return (singletonObject != NULL_OBJECT ? singletonObject : null);
        }
    }
    //将对象添加到单例注册表
    protected void addSingleton(String beanName, Object singletonObject) {
            synchronized (this.singletonObjects) {
                this.singletonObjects.put(beanName, (singletonObject != null ? singletonObject : NULL_OBJECT));

            }
        }
}
```

**单例 Bean 存在线程安全问题吗？**

大部分时候我们并没有在项目中使用多线程，所以很少有人会关注这个问题。单例 Bean 存在线程问题，主要是因为当多个线程操作同一个对象的时候是存在资源竞争的。

常见的有两种解决办法：

1. 在 Bean 中尽量避免定义可变的成员变量。
2. 在类中定义一个 `ThreadLocal` 成员变量，将需要的可变成员变量保存在 `ThreadLocal` 中（推荐的一种方式）。

不过，大部分 Bean 实际都是无状态（没有实例变量）的（比如 Dao、Service），这种情况下， Bean 是线程安全的。

## 代理设计模式

### 代理模式在 AOP 中的应用

**AOP(Aspect-Oriented Programming，面向切面编程)** 能够将那些与业务无关，却为业务模块所共同调用的逻辑或责任（例如事务处理、日志管理、权限控制等）封装起来，便于减少系统的重复代码，降低模块间的耦合度，并有利于未来的可拓展性和可维护性。

Spring AOP 就是基于动态代理的，如果要代理的对象，实现了某个接口，那么 Spring AOP 会使用 **JDK Proxy**，去创建代理对象，而对于没有实现接口的对象，就无法使用 JDK Proxy 去进行代理了，这时候 Spring AOP 会使用 **Cglib** 生成一个被代理对象的子类来作为代理，如下图所示：

![SpringAOPProcess](https://oss.javaguide.cn/github/javaguide/SpringAOPProcess.jpg)

当然，你也可以使用 AspectJ ,Spring AOP 已经集成了 AspectJ ，AspectJ 应该算的上是 Java 生态系统中最完整的 AOP 框架了。

使用 AOP 之后我们可以把一些通用功能抽象出来，在需要用到的地方直接使用即可，这样大大简化了代码量。我们需要增加新功能时也方便，这样也提高了系统扩展性。日志功能、事务管理等等场景都用到了 AOP 。

### Spring AOP 和 AspectJ AOP 有什么区别?

**Spring AOP 属于运行时增强，而 AspectJ 是编译时增强。** Spring AOP 基于代理(Proxying)，而 AspectJ 基于字节码操作(Bytecode Manipulation)。

Spring AOP 已经集成了 AspectJ ，AspectJ 应该算的上是 Java 生态系统中最完整的 AOP 框架了。AspectJ 相比于 Spring AOP 功能更加强大，但是 Spring AOP 相对来说更简单。

如果我们的切面比较少，那么两者性能差异不大。但是，当切面太多的话，最好选择 AspectJ ，它比 Spring AOP 快很多。

## 模板方法

模板方法模式是一种行为设计模式，它定义一个操作中的算法的骨架，而将一些步骤延迟到子类中。 模板方法使得子类可以不改变一个算法的结构即可重定义该算法的某些特定步骤的实现方式。

```java
public abstract class Template {
    //这是我们的模板方法
    public final void TemplateMethod(){
        PrimitiveOperation1();
        PrimitiveOperation2();
        PrimitiveOperation3();
    }

    protected void  PrimitiveOperation1(){
        //当前类实现
    }

    //被子类实现的方法
    protected abstract void PrimitiveOperation2();
    protected abstract void PrimitiveOperation3();

}
public class TemplateImpl extends Template {

    @Override
    public void PrimitiveOperation2() {
        //当前类实现
    }

    @Override
    public void PrimitiveOperation3() {
        //当前类实现
    }
}

```

Spring 中 `JdbcTemplate`、`HibernateTemplate` 等以 Template 结尾的对数据库操作的类，它们就使用到了模板模式。一般情况下，我们都是使用继承的方式来实现模板模式，但是 Spring 并没有使用这种方式，而是使用 Callback 模式与模板方法模式配合，既达到了代码复用的效果，同时增加了灵活性。

## 观察者模式

观察者模式是一种对象行为型模式。它表示的是一种对象与对象之间具有依赖关系，当一个对象发生改变的时候，依赖这个对象的所有对象也会做出反应。Spring 事件驱动模型就是观察者模式很经典的一个应用。Spring 事件驱动模型非常有用，在很多场景都可以解耦我们的代码。比如我们每次添加商品的时候都需要重新更新商品索引，这个时候就可以利用观察者模式来解决这个问题。

### Spring 事件驱动模型中的三种角色

#### 事件角色

`ApplicationEvent` (`org.springframework.context`包下)充当事件的角色,这是一个抽象类，它继承了`java.util.EventObject`并实现了 `java.io.Serializable`接口。

Spring 中默认存在以下事件，他们都是对 `ApplicationContextEvent` 的实现(继承自`ApplicationContextEvent`)：

- `ContextStartedEvent`：`ApplicationContext` 启动后触发的事件;
- `ContextStoppedEvent`：`ApplicationContext` 停止后触发的事件;
- `ContextRefreshedEvent`：`ApplicationContext` 初始化或刷新完成后触发的事件;
- `ContextClosedEvent`：`ApplicationContext` 关闭后触发的事件。

![ApplicationEvent-Subclass](https://oss.javaguide.cn/github/javaguide/ApplicationEvent-Subclass.png)

#### 事件监听者角色

`ApplicationListener` 充当了事件监听者角色，它是一个接口，里面只定义了一个 `onApplicationEvent()`方法来处理`ApplicationEvent`。`ApplicationListener`接口类源码如下，可以看出接口定义看出接口中的事件只要实现了 `ApplicationEvent`就可以了。所以，在 Spring 中我们只要实现 `ApplicationListener` 接口的 `onApplicationEvent()` 方法即可完成监听事件

```java
package org.springframework.context;
import java.util.EventListener;
@FunctionalInterface
public interface ApplicationListener<E extends ApplicationEvent> extends EventListener {
    void onApplicationEvent(E var1);
}
```

#### 事件发布者角色

`ApplicationEventPublisher` 充当了事件的发布者，它也是一个接口。

```java
@FunctionalInterface
public interface ApplicationEventPublisher {
    default void publishEvent(ApplicationEvent event) {
        this.publishEvent((Object)event);
    }

    void publishEvent(Object var1);
}

```

`ApplicationEventPublisher` 接口的`publishEvent()`这个方法在`AbstractApplicationContext`类中被实现，阅读这个方法的实现，你会发现实际上事件真正是通过`ApplicationEventMulticaster`来广播出去的。具体内容过多，就不在这里分析了，后面可能会单独写一篇文章提到。

### Spring 的事件流程总结

1. 定义一个事件: 实现一个继承自 `ApplicationEvent`，并且写相应的构造函数；
2. 定义一个事件监听者：实现 `ApplicationListener` 接口，重写 `onApplicationEvent()` 方法；
3. 使用事件发布者发布消息: 可以通过 `ApplicationEventPublisher` 的 `publishEvent()` 方法发布消息。

Example:

```java
// 定义一个事件,继承自ApplicationEvent并且写相应的构造函数
public class DemoEvent extends ApplicationEvent{
    private static final long serialVersionUID = 1L;

    private String message;

    public DemoEvent(Object source,String message){
        super(source);
        this.message = message;
    }

    public String getMessage() {
         return message;
          }


// 定义一个事件监听者,实现ApplicationListener接口，重写 onApplicationEvent() 方法；
@Component
public class DemoListener implements ApplicationListener<DemoEvent>{

    //使用onApplicationEvent接收消息
    @Override
    public void onApplicationEvent(DemoEvent event) {
        String msg = event.getMessage();
        System.out.println("接收到的信息是："+msg);
    }

}
// 发布事件，可以通过ApplicationEventPublisher  的 publishEvent() 方法发布消息。
@Component
public class DemoPublisher {

    @Autowired
    ApplicationContext applicationContext;

    public void publish(String message){
        //发布事件
        applicationContext.publishEvent(new DemoEvent(this, message));
    }
}

```

当调用 `DemoPublisher` 的 `publish()` 方法的时候，比如 `demoPublisher.publish("你好")` ，控制台就会打印出:`接收到的信息是：你好` 。

## 适配器模式

适配器模式(Adapter Pattern) 将一个接口转换成客户希望的另一个接口，适配器模式使接口不兼容的那些类可以一起工作。

### Spring AOP 中的适配器模式

我们知道 Spring AOP 的实现是基于代理模式，但是 Spring AOP 的增强或通知(Advice)使用到了适配器模式，与之相关的接口是`AdvisorAdapter` 。

Advice 常用的类型有：`BeforeAdvice`（目标方法调用前,前置通知）、`AfterAdvice`（目标方法调用后,后置通知）、`AfterReturningAdvice`(目标方法执行结束后，return 之前)等等。每个类型 Advice（通知）都有对应的拦截器:`MethodBeforeAdviceInterceptor`、`AfterReturningAdviceInterceptor`、`ThrowsAdviceInterceptor` 等等。

Spring 预定义的通知要通过对应的适配器，适配成 `MethodInterceptor` 接口(方法拦截器)类型的对象（如：`MethodBeforeAdviceAdapter` 通过调用 `getInterceptor` 方法，将 `MethodBeforeAdvice` 适配成 `MethodBeforeAdviceInterceptor` ）。

### Spring MVC 中的适配器模式

在 Spring MVC 中，`DispatcherServlet` 根据请求信息调用 `HandlerMapping`，解析请求对应的 `Handler`。解析到对应的 `Handler`（也就是我们平常说的 `Controller` 控制器）后，开始由`HandlerAdapter` 适配器处理。`HandlerAdapter` 作为期望接口，具体的适配器实现类用于对目标类进行适配，`Controller` 作为需要适配的类。

**为什么要在 Spring MVC 中使用适配器模式？**

Spring MVC 中的 `Controller` 种类众多，不同类型的 `Controller` 通过不同的方法来对请求进行处理。如果不利用适配器模式的话，`DispatcherServlet` 直接获取对应类型的 `Controller`，需要的自行来判断，像下面这段代码一样：

```java
if(mappedHandler.getHandler() instanceof MultiActionController){
   ((MultiActionController)mappedHandler.getHandler()).xxx
}else if(mappedHandler.getHandler() instanceof XXX){
    ...
}else if(...){
   ...
}
```

假如我们再增加一个 `Controller`类型就要在上面代码中再加入一行 判断语句，这种形式就使得程序难以维护，也违反了设计模式中的开闭原则 – 对扩展开放，对修改关闭。

## 装饰者模式

装饰者模式可以动态地给对象添加一些额外的属性或行为。相比于使用继承，装饰者模式更加灵活。简单点儿说就是当我们需要修改原有的功能，但我们又不愿直接去修改原有的代码时，设计一个 Decorator 套在原有代码外面。其实在 JDK 中就有很多地方用到了装饰者模式，比如 `InputStream`家族，`InputStream` 类下有 `FileInputStream` (读取文件)、`BufferedInputStream` (增加缓存,使读取文件速度大大提升)等子类都在不修改`InputStream` 代码的情况下扩展了它的功能。

![装饰者模式示意图](https://oss.javaguide.cn/github/javaguide/Decorator.jpg)

## 总结

Spring 框架中用到了哪些设计模式？

- **工厂设计模式** : Spring 使用工厂模式通过 `BeanFactory`、`ApplicationContext` 创建 bean 对象。
- **代理设计模式** : Spring AOP 功能的实现。
- **单例设计模式** : Spring 中的 Bean 默认都是单例的。
- **模板方法模式** : Spring 中 `jdbcTemplate`、`hibernateTemplate` 等以 Template 结尾的对数据库操作的类，它们就使用到了模板模式。
- **观察者模式:** Spring 事件驱动模型就是观察者模式很经典的一个应用。
- **适配器模式** :Spring AOP 的增强或通知(Advice)使用到了适配器模式、spring MVC 中也是用到了适配器模式适配`Controller`。
- ……

## 参考

- 《Spring 技术内幕》
- <https://blog.eduonix.com/java-programming-2/learn-design-patterns-used-spring-framework/>
- <https://www.tutorialsteacher.com/ioc/inversion-of-control>
- <https://design-patterns.readthedocs.io/zh_CN/latest/behavioral_patterns/observer.html>
- <https://juejin.im/post/5a8eb261f265da4e9e307230>
- <https://juejin.im/post/5ba28986f265da0abc2b6084>

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: spring/Spring&SpringMVC&SpringBoot常用注解总结.md -->

## [6] Spring&SpringMVC&SpringBoot常用注解总结

---
title: Spring&SpringMVC&SpringBoot常用注解总结
description: Spring和SpringBoot常用注解大全，涵盖@Autowired、@Component、@RequestMapping等核心注解的用法详解。
category: 框架
tag:
  - SpringBoot
  - Spring
head:
  - - meta
    - name: keywords
      content: Spring注解,Spring Boot注解,@SpringBootApplication,@Autowired,@RequestMapping,@Configuration,@Component,常用注解
---

可以毫不夸张地说，这篇文章介绍的 Spring/SpringBoot 常用注解基本已经涵盖你工作中遇到的大部分常用的场景。对于每一个注解本文都提供了具体用法，掌握这些内容后，使用 Spring Boot 来开发项目基本没啥大问题了！

**为什么要写这篇文章？**

最近看到网上有一篇关于 Spring Boot 常用注解的文章被广泛转载，但文章内容存在一些误导性，可能对没有太多实际使用经验的开发者不太友好。于是我花了几天时间总结了这篇文章，希望能够帮助大家更好地理解和使用 Spring 注解。

**因为个人能力和精力有限，如果有任何错误或遗漏，欢迎指正！非常感激！**

## Spring Boot 基础注解

`@SpringBootApplication` 是 Spring Boot 应用的核心注解，通常用于标注主启动类。

示例：

```java
@SpringBootApplication
public class SpringSecurityJwtGuideApplication {
      public static void main(java.lang.String[] args) {
        SpringApplication.run(SpringSecurityJwtGuideApplication.class, args);
    }
}
```

我们可以把 `@SpringBootApplication`看作是下面三个注解的组合：

- **`@EnableAutoConfiguration`**：启用 Spring Boot 的自动配置机制。
- **`@ComponentScan`**：扫描 `@Component`、`@Service`、`@Repository`、`@Controller` 等注解的类。
- **`@Configuration`**：允许注册额外的 Spring Bean 或导入其他配置类。

源码如下：

```java
package org.springframework.boot.autoconfigure;
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = {
    @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
    @Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
public @interface SpringBootApplication {
   ......
}

package org.springframework.boot;
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Configuration
public @interface SpringBootConfiguration {

}
```

## Spring Bean

### 依赖注入（Dependency Injection, DI）

`@Autowired` 用于自动注入依赖项（即其他 Spring Bean）。它可以标注在构造器、字段、Setter 方法或配置方法上，Spring 容器会自动查找匹配类型的 Bean 并将其注入。

```java
@Service
public class UserServiceImpl implements UserService {
    // ...
}

@RestController
public class UserController {
    // 字段注入
    @Autowired
    private UserService userService;
    // ...
}
```

当存在多个相同类型的 Bean 时，`@Autowired` 默认按类型注入可能产生歧义。此时，可以与 `@Qualifier` 结合使用，通过指定 Bean 的名称来精确选择需要注入的实例。

```java
@Repository("userRepositoryA")
public class UserRepositoryA implements UserRepository { /* ... */ }

@Repository("userRepositoryB")
public class UserRepositoryB implements UserRepository { /* ... */ }

@Service
public class UserService {
    @Autowired
    @Qualifier("userRepositoryA") // 指定注入名为 "userRepositoryA" 的 Bean
    private UserRepository userRepository;
    // ...
}
```

`@Primary`同样是为了解决同一类型存在多个 Bean 实例的注入问题。在 Bean 定义时（例如使用 `@Bean` 或类注解）添加 `@Primary` 注解，表示该 Bean 是**首选**的注入对象。当进行 `@Autowired` 注入时，如果没有使用 `@Qualifier` 指定名称，Spring 将优先选择带有 `@Primary` 的 Bean。

```java
@Primary // 将 UserRepositoryA 设为首选注入对象
@Repository("userRepositoryA")
public class UserRepositoryA implements UserRepository { /* ... */ }

@Repository("userRepositoryB")
public class UserRepositoryB implements UserRepository { /* ... */ }

@Service
public class UserService {
    @Autowired // 会自动注入 UserRepositoryA，因为它是 @Primary
    private UserRepository userRepository;
    // ...
}
```

`@Resource(name="beanName")`是 JSR-250 规范定义的注解，也用于依赖注入。它默认按**名称 (by Name)** 查找 Bean 进行注入，而 `@Autowired`默认按**类型 (by Type)** 。如果未指定 `name` 属性，它会尝试根据字段名或方法名查找，如果找不到，则回退到按类型查找（类似 `@Autowired`）。

`@Resource`只能标注在字段 和 Setter 方法上，不支持构造器注入。

```java
@Service
public class UserService {
    @Resource(name = "userRepositoryA")
    private UserRepository userRepository;
    // ...
}
```

### Bean 作用域

`@Scope("scopeName")` 定义 Spring Bean 的作用域，即 Bean 实例的生命周期和可见范围。常用的作用域包括：

- **singleton** : IoC 容器中只有唯一的 bean 实例。Spring 中的 bean 默认都是单例的，是对单例设计模式的应用。
- **prototype** : 每次获取都会创建一个新的 bean 实例。也就是说，连续 `getBean()` 两次，得到的是不同的 Bean 实例。
- **request** （仅 Web 应用可用）: 每一次 HTTP 请求都会产生一个新的 bean（请求 bean），该 bean 仅在当前 HTTP request 内有效。
- **session** （仅 Web 应用可用） : 每一次来自新 session 的 HTTP 请求都会产生一个新的 bean（会话 bean），该 bean 仅在当前 HTTP session 内有效。
- **application/global-session** （仅 Web 应用可用）：每个 Web 应用在启动时创建一个 Bean（应用 Bean），该 bean 仅在当前应用启动时间内有效。
- **websocket** （仅 Web 应用可用）：每一次 WebSocket 会话产生一个新的 bean。

```java
@Component
// 每次获取都会创建新的 PrototypeBean 实例
@Scope("prototype")
public class PrototypeBean {
    // ...
}
```

### Bean 注册

Spring 容器需要知道哪些类需要被管理为 Bean。除了使用 `@Bean` 方法显式声明（通常在 `@Configuration` 类中），更常见的方式是使用 Stereotype（构造型） 注解标记类，并配合组件扫描（Component Scanning）机制，让 Spring 自动发现并注册这些类作为 Bean。这些 Bean 后续可以通过 `@Autowired` 等方式注入到其他组件中。

下面是常见的一些注册 Bean 的注解：

- `@Component`：通用的注解，可标注任意类为 `Spring` 组件。如果一个 Bean 不知道属于哪个层，可以使用`@Component` 注解标注。
- `@Repository` : 对应持久层即 Dao 层，主要用于数据库相关操作。
- `@Service` : 对应服务层，主要涉及一些复杂的逻辑，需要用到 Dao 层。
- `@Controller` : 对应 Spring MVC 控制层，主要用于接受用户请求并调用 Service 层返回数据给前端页面。
- `@RestController`：一个组合注解，等效于 `@Controller` + `@ResponseBody`。它专门用于构建 RESTful Web 服务的控制器。标注了 `@RestController` 的类，其所有处理器方法（handler methods）的返回值都会被自动序列化（通常为 JSON）并写入 HTTP 响应体，而不是被解析为视图名称。

`@Controller` vs `@RestController`：

- `@Controller`：主要用于传统的 Spring MVC 应用，方法返回值通常是逻辑视图名，需要视图解析器配合渲染页面。如果需要返回数据（如 JSON），则需要在方法上额外添加 `@ResponseBody` 注解。
- `@RestController`：专为构建返回数据的 RESTful API 设计。类上使用此注解后，所有方法的返回值都会默认被视为响应体内容（相当于每个方法都隐式添加了 `@ResponseBody`），通常用于返回 JSON 或 XML 数据。在现代前后端分离的应用中，`@RestController` 是更常用的选择。

关于`@RestController` 和 `@Controller`的对比，请看这篇文章：[@RestController vs @Controller](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247485544&idx=1&sn=3cc95b88979e28fe3bfe539eb421c6d8&chksm=cea247a3f9d5ceb5e324ff4b8697adc3e828ecf71a3468445e70221cce768d1e722085359907&token=1725092312&lang=zh_CN#rd)。

## 配置

### 声明配置类

`@Configuration` 主要用于声明一个类是 Spring 的配置类。虽然也可以用 `@Component` 注解替代，但 `@Configuration` 能够更明确地表达该类的用途（定义 Bean），语义更清晰，也便于 Spring 进行特定的处理（例如，通过 CGLIB 代理确保 `@Bean` 方法的单例行为）。

```java
@Configuration
public class AppConfig {

    // @Bean 注解用于在配置类中声明一个 Bean
    @Bean
    public TransferService transferService() {
        return new TransferServiceImpl();
    }

    // 配置类中可以包含一个或多个 @Bean 方法。
}
```

### 读取配置信息

在应用程序开发中，我们经常需要管理一些配置信息，例如数据库连接细节、第三方服务（如阿里云 OSS、短信服务、微信认证）的密钥或地址等。通常，这些信息会**集中存放在配置文件**（如 `application.yml` 或 `application.properties`）中，方便管理和修改。

Spring 提供了多种便捷的方式来读取这些配置信息。假设我们有如下 `application.yml` 文件：

```yaml
wuhan2020: 2020年初武汉爆发了新型冠状病毒，疫情严重，但是，我相信一切都会过去！武汉加油！中国加油！

my-profile:
  name: Guide哥
  email: koushuangbwcx@163.com

library:
  location: 湖北武汉加油中国加油
  books:
    - name: 天才基本法
      description: 二十二岁的林朝夕在父亲确诊阿尔茨海默病这天，得知自己暗恋多年的校园男神裴之即将出国深造的消息——对方考取的学校，恰是父亲当年为她放弃的那所。
    - name: 时间的秩序
      description: 为什么我们记得过去，而非未来？时间“流逝”意味着什么？是我们存在于时间之内，还是时间存在于我们之中？卡洛·罗韦利用诗意的文字，邀请我们思考这一亘古难题——时间的本质。
    - name: 了不起的我
      description: 如何养成一个新习惯？如何让心智变得更成熟？如何拥有高质量的关系？ 如何走出人生的艰难时刻？
```

下面介绍几种常用的读取配置的方式：

1、`@Value("${property.key}")` 注入配置文件（如 `application.properties` 或 `application.yml`）中的单个属性值。它还支持 Spring 表达式语言 (SpEL)，可以实现更复杂的注入逻辑。

```java
@Value("${wuhan2020}")
String wuhan2020;
```

2、`@ConfigurationProperties`可以读取配置信息并与 Bean 绑定，用的更多一些。

```java
@Component
@ConfigurationProperties(prefix = "library")
class LibraryProperties {
    @NotEmpty
    private String location;
    private List<Book> books;

    @Setter
    @Getter
    @ToString
    static class Book {
        String name;
        String description;
    }
  省略getter/setter
  ......
}
```

你可以像使用普通的 Spring Bean 一样，将其注入到类中使用。

```java
@Service
public class LibraryService {

    private final LibraryProperties libraryProperties;

    @Autowired
    public LibraryService(LibraryProperties libraryProperties) {
        this.libraryProperties = libraryProperties;
    }

    public void printLibraryInfo() {
        System.out.println(libraryProperties);
    }
}
```

### 加载指定的配置文件

`@PropertySource` 注解允许加载自定义的配置文件。适用于需要将部分配置信息独立存储的场景。

```java
@Component
@PropertySource("classpath:website.properties")

class WebSite {
    @Value("${url}")
    private String url;

  省略getter/setter
  ......
}
```

**注意**：当使用 `@PropertySource` 时，确保外部文件路径正确，且文件在类路径（classpath）中。

更多内容请查看我的这篇文章：[10 分钟搞定 SpringBoot 如何优雅读取配置文件？](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247486181&idx=2&sn=10db0ae64ef501f96a5b0dbc4bd78786&chksm=cea2452ef9d5cc384678e456427328600971180a77e40c13936b19369672ca3e342c26e92b50&token=816772476&lang=zh_CN#rd) 。

## MVC

### HTTP 请求

**5 种常见的请求类型:**

- **GET**：请求从服务器获取特定资源。举个例子：`GET /users`（获取所有学生）
- **POST**：在服务器上创建一个新的资源。举个例子：`POST /users`（创建学生）
- **PUT**：更新服务器上的资源（客户端提供更新后的整个资源）。举个例子：`PUT /users/12`（更新编号为 12 的学生）
- **DELETE**：从服务器删除特定的资源。举个例子：`DELETE /users/12`（删除编号为 12 的学生）
- **PATCH**：更新服务器上的资源（客户端提供更改的属性，可以看做作是部分更新），使用的比较少，这里就不举例子了。

#### GET 请求

`@GetMapping("users")` 等价于`@RequestMapping(value="/users",method=RequestMethod.GET)`。

```java
@GetMapping("/users")
public ResponseEntity<List<User>> getAllUsers() {
  return ResponseEntity.ok(userRepository.findAll());
}
```

#### POST 请求

`@PostMapping("users")` 等价于`@RequestMapping(value="/users",method=RequestMethod.POST)`。

`@PostMapping` 通常与 `@RequestBody` 配合，用于接收 JSON 数据并映射为 Java 对象。

```java
@PostMapping("/users")
public ResponseEntity<User> createUser(@Valid @RequestBody UserCreateRequest userCreateRequest) {
  User user = userService.create(userCreateRequest);
  return ResponseEntity.status(HttpStatus.CREATED).body(user);
}
```

#### PUT 请求

`@PutMapping("/users/{userId}")` 等价于`@RequestMapping(value="/users/{userId}",method=RequestMethod.PUT)`。

```java
@PutMapping("/users/{userId}")
public ResponseEntity<User> updateUser(@PathVariable(value = "userId") Long userId,
  @Valid @RequestBody UserUpdateRequest userUpdateRequest) {
  ......
}
```

#### DELETE 请求

`@DeleteMapping("/users/{userId}")`等价于`@RequestMapping(value="/users/{userId}",method=RequestMethod.DELETE)`

```java
@DeleteMapping("/users/{userId}")
public ResponseEntity deleteUser(@PathVariable(value = "userId") Long userId){
  ......
}
```

#### PATCH 请求

一般实际项目中，我们都是 PUT 不够用了之后才用 PATCH 请求去更新数据。

```java
  @PatchMapping("/profile")
  public ResponseEntity updateStudent(@RequestBody StudentUpdateRequest studentUpdateRequest) {
        studentRepository.updateDetail(studentUpdateRequest);
        return ResponseEntity.ok().build();
    }
```

### 参数绑定

在处理 HTTP 请求时，Spring MVC 提供了多种注解用于绑定请求参数到方法参数中。以下是常见的参数绑定方式：

#### 从 URL 路径中提取参数

`@PathVariable` 用于从 URL 路径中提取参数。例如：

```java
@GetMapping("/klasses/{klassId}/teachers")
public List<Teacher> getTeachersByClass(@PathVariable("klassId") Long klassId) {
    return teacherService.findTeachersByClass(klassId);
}
```

若请求 URL 为 `/klasses/123/teachers`，则 `klassId = 123`。

#### 绑定查询参数

`@RequestParam` 用于绑定查询参数。例如：

```java
@GetMapping("/klasses/{klassId}/teachers")
public List<Teacher> getTeachersByClass(@PathVariable Long klassId,
                                        @RequestParam(value = "type", required = false) String type) {
    return teacherService.findTeachersByClassAndType(klassId, type);
}
```

若请求 URL 为 `/klasses/123/teachers?type=web`，则 `klassId = 123`，`type = web`。

#### 绑定请求体中的 JSON 数据

`@RequestBody` 用于读取 Request 请求（可能是 POST,PUT,DELETE,GET 请求）的 body 部分并且**Content-Type 为 application/json** 格式的数据，接收到数据之后会自动将数据绑定到 Java 对象上去。系统会使用`HttpMessageConverter`或者自定义的`HttpMessageConverter`将请求的 body 中的 json 字符串转换为 java 对象。

我用一个简单的例子来给演示一下基本使用！

我们有一个注册的接口：

```java
@PostMapping("/sign-up")
public ResponseEntity signUp(@RequestBody @Valid UserRegisterRequest userRegisterRequest) {
  userService.save(userRegisterRequest);
  return ResponseEntity.ok().build();
}
```

`UserRegisterRequest`对象：

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRegisterRequest {
    @NotBlank
    private String userName;
    @NotBlank
    private String password;
    @NotBlank
    private String fullName;
}
```

我们发送 post 请求到这个接口，并且 body 携带 JSON 数据：

```json
{ "userName": "coder", "fullName": "shuangkou", "password": "123456" }
```

这样我们的后端就可以直接把 json 格式的数据映射到我们的 `UserRegisterRequest` 类上。

![](./images/spring-annotations/@RequestBody.png)

**注意**：

- 一个方法只能有一个 `@RequestBody` 参数，但可以有多个 `@PathVariable` 和 `@RequestParam`。
- 如果需要接收多个复杂对象，建议合并成一个单一对象。

## 数据校验

数据校验是保障系统稳定性和安全性的关键环节。即使在用户界面（前端）已经实施了数据校验，**后端服务仍必须对接收到的数据进行再次校验**。这是因为前端校验可以被轻易绕过（例如，通过开发者工具修改请求或使用 Postman、curl 等 HTTP 工具直接调用 API），恶意或错误的数据可能直接发送到后端。因此，后端校验是防止非法数据、维护数据一致性、确保业务逻辑正确执行的最后一道，也是最重要的一道防线。

Bean Validation 是一套定义 JavaBean 参数校验标准的规范 (JSR 303, 349, 380)，它提供了一系列注解，可以直接用于 JavaBean 的属性上，从而实现便捷的参数校验。

- **JSR 303 (Bean Validation 1.0):** 奠定了基础，引入了核心校验注解（如 `@NotNull`、`@Size`、`@Min`、`@Max` 等），定义了如何通过注解的方式对 JavaBean 的属性进行校验，并支持嵌套对象校验和自定义校验器。
- **JSR 349 (Bean Validation 1.1):** 在 1.0 基础上进行扩展，例如引入了对方法参数和返回值校验的支持、增强了对分组校验（Group Validation）的处理。
- **JSR 380 (Bean Validation 2.0):** 拥抱 Java 8 的新特性，并进行了一些改进，例如支持 `java.time` 包中的日期和时间类型、引入了一些新的校验注解（如 `@NotEmpty`, `@NotBlank`等）。

Bean Validation 本身只是一套**规范（接口和注解）**，我们需要一个实现了这套规范的**具体框架**来执行校验逻辑。目前，**Hibernate Validator** 是 Bean Validation 规范最权威、使用最广泛的参考实现。

- Hibernate Validator 4.x 实现了 Bean Validation 1.0 (JSR 303)。
- Hibernate Validator 5.x 实现了 Bean Validation 1.1 (JSR 349)。
- Hibernate Validator 6.x 实现了 Bean Validation 2.0（JSR 380），使用 `javax.validation` 包名。
- Hibernate Validator 7.x 和 8.x 实现了 Jakarta Bean Validation 3.0，使用 `jakarta.validation` 包名；Hibernate Validator 9.x 实现了 Jakarta Validation 3.1。

在 Spring Boot 项目中使用 Bean Validation 非常方便，这得益于 Spring Boot 的自动配置能力。关于依赖引入，需要注意：

- 在较早版本的 Spring Boot（通常指 2.3.x 之前）中，`spring-boot-starter-web` 依赖默认包含了 hibernate-validator。因此，只要引入了 Web Starter，就无需额外添加校验相关的依赖。
- 从 Spring Boot 2.3.x 版本开始，为了更精细化的依赖管理，校验相关的依赖被移出了 spring-boot-starter-web。如果你的项目使用了这些或更新的版本，并且需要 Bean Validation 功能，那么你需要显式地添加 `spring-boot-starter-validation` 依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

![](https://oss.javaguide.cn/2021/03/c7bacd12-1c1a-4e41-aaaf-4cad840fc073.png)

非 SpringBoot 项目需要自行引入相关依赖包，这里不多做讲解，具体可以查看我的这篇文章：[如何在 Spring/Spring Boot 中做参数校验？你需要了解的都在这里！](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247485783&idx=1&sn=a407f3b75efa17c643407daa7fb2acd6&chksm=cea2469cf9d5cf8afbcd0a8a1c9cc4294d6805b8e01bee6f76bb2884c5bc15478e91459def49&token=292197051&lang=zh_CN#rd)。

👉 需要注意的是：优先使用 Bean Validation/Jakarta Validation 规范提供的约束注解，而不是 Hibernate Validator 私有约束。Spring Boot 2.x 通常使用 `javax.validation.constraints`，Spring Boot 3.x 及以上版本使用 `jakarta.validation.constraints`。

### 一些常用的字段验证的注解

Bean Validation 规范及其实现（如 Hibernate Validator）提供了丰富的注解，用于声明式地定义校验规则。以下是一些常用的注解及其说明：

- `@NotNull`: 检查被注解的元素（任意类型）不能为 `null`。
- `@NotEmpty`: 检查被注解的元素（如 `CharSequence`、`Collection`、`Map`、`Array`）不能为 `null` 且其大小/长度不能为 0。注意：对于字符串，`@NotEmpty` 允许包含空白字符的字符串，如 `" "`。
- `@NotBlank`: 检查被注解的 `CharSequence`（如 `String`）不能为 `null`，并且去除首尾空格后的长度必须大于 0。（即，不能为空白字符串）。
- `@Null`: 检查被注解的元素必须为 `null`。
- `@AssertTrue` / `@AssertFalse`: 检查被注解的 `boolean` 或 `Boolean` 类型元素必须为 `true` / `false`。
- `@Min(value)` / `@Max(value)`: 检查被注解的数字类型（或其字符串表示）的值必须大于等于 / 小于等于指定的 `value`。适用于整数类型（`byte`、`short`、`int`、`long`、`BigInteger` 等）。
- `@DecimalMin(value)` / `@DecimalMax(value)`: 功能类似 `@Min` / `@Max`，但适用于包含小数的数字类型（`BigDecimal`、`BigInteger`、`CharSequence`、`byte`、`short`、`int`、`long`及其包装类）。 `value` 必须是数字的字符串表示。
- `@Size(min=, max=)`: 检查被注解的元素（如 `CharSequence`、`Collection`、`Map`、`Array`）的大小/长度必须在指定的 `min` 和 `max` 范围之内（包含边界）。
- `@Digits(integer=, fraction=)`: 检查被注解的数字类型（或其字符串表示）的值，其整数部分的位数必须 ≤ `integer`，小数部分的位数必须 ≤ `fraction`。
- `@Pattern(regexp=, flags=)`: 检查被注解的 `CharSequence`（如 `String`）是否匹配指定的正则表达式 (`regexp`)。`flags` 可以指定匹配模式（如不区分大小写）。
- `@Email`: 检查被注解的 `CharSequence`（如 `String`）是否符合 Email 格式（内置了一个相对宽松的正则表达式）。
- `@Past` / `@Future`: 检查被注解的日期或时间类型（`java.util.Date`、`java.util.Calendar`、JSR 310 `java.time` 包下的类型）是否在当前时间之前 / 之后。
- `@PastOrPresent` / `@FutureOrPresent`: 类似 `@Past` / `@Future`，但允许等于当前时间。
- ……

### 验证请求体(RequestBody)

当 Controller 方法使用 `@RequestBody` 注解来接收请求体并将其绑定到一个对象时，可以在该参数前添加 `@Valid` 注解来触发对该对象的校验。如果验证失败，它将抛出`MethodArgumentNotValidException`。

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Person {
    @NotNull(message = "classId 不能为空")
    private String classId;

    @Size(max = 33)
    @NotNull(message = "name 不能为空")
    private String name;

    @Pattern(regexp = "((^Man$|^Woman$|^UGM$))", message = "sex 值不在可选范围")
    @NotNull(message = "sex 不能为空")
    private String sex;

    @Email(message = "email 格式不正确")
    @NotNull(message = "email 不能为空")
    private String email;
}


@RestController
@RequestMapping("/api")
public class PersonController {
    @PostMapping("/person")
    public ResponseEntity<Person> getPerson(@RequestBody @Valid Person person) {
        return ResponseEntity.ok().body(person);
    }
}
```

### 验证请求参数(Path Variables 和 Request Parameters)

对于直接映射到方法参数的简单类型数据（如路径变量 `@PathVariable` 或请求参数 `@RequestParam`），校验方式会因 Spring Framework 版本而异：

1. **Spring Framework 6.1 及以上版本**：Spring MVC 内置支持 Handler Method Validation。将 `@Min`、`@Max`、`@Size`、`@Pattern` 等约束注解直接放在方法参数上即可，不要在 Controller 类上添加 `@Validated`，否则会改用基于 AOP 的方法校验。
2. **Spring Framework 6.0 及更早版本**：通常需要在 Controller 类上添加 Spring 提供的 `@Validated`，通过方法校验基础设施处理参数约束。

下面以 Spring Framework 6.1 及以上版本的内置校验方式为例：

```java
@RestController
@RequestMapping("/api")
public class PersonController {

    @GetMapping("/person/{id}")
    public ResponseEntity<Integer> getPersonByID(
            @PathVariable("id")
            @Max(value = 5, message = "ID 不能超过 5")
            Integer id
    ) {
        // Spring MVC 6.1+ 会在进入方法体前抛出 HandlerMethodValidationException。
        return ResponseEntity.ok().body(id);
    }

    @GetMapping("/person")
    public ResponseEntity<String> findPersonByName(
            @RequestParam("name")
            @NotBlank(message = "姓名不能为空") // 同样适用于 @RequestParam
            @Size(max = 10, message = "姓名长度不能超过 10")
            String name
    ) {
        return ResponseEntity.ok().body("Found person: " + name);
    }
}
```

## 全局异常处理

介绍一下我们 Spring 项目必备的全局处理 Controller 层异常。

**相关注解：**

1. `@ControllerAdvice` :注解定义全局异常处理类
2. `@ExceptionHandler` :注解声明异常处理方法

如何使用呢？拿我们在第 5 节参数校验这块来举例子。如果方法参数不对的话就会抛出`MethodArgumentNotValidException`，我们来处理这个异常。

```java
@ControllerAdvice
@ResponseBody
public class GlobalExceptionHandler {

    /**
     * 请求参数异常处理
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex, HttpServletRequest request) {
       ......
    }
}
```

更多关于 Spring Boot 异常处理的内容，请看我的这两篇文章：

1. [SpringBoot 处理异常的几种常见姿势](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247485568&idx=2&sn=c5ba880fd0c5d82e39531fa42cb036ac&chksm=cea2474bf9d5ce5dcbc6a5f6580198fdce4bc92ef577579183a729cb5d1430e4994720d59b34&token=2133161636&lang=zh_CN#rd)
2. [使用枚举简单封装一个优雅的 Spring Boot 全局异常处理！](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247486379&idx=2&sn=48c29ae65b3ed874749f0803f0e4d90e&chksm=cea24460f9d5cd769ed53ad7e17c97a7963a89f5350e370be633db0ae8d783c3a3dbd58c70f8&token=1054498516&lang=zh_CN#rd)

## 事务

在要开启事务的方法上使用`@Transactional`注解即可!

```java
@Transactional(rollbackFor = Exception.class)
public void save() {
  ......
}

```

我们知道 Exception 分为运行时异常 RuntimeException 和非运行时异常。在`@Transactional`注解中如果不配置`rollbackFor`属性,那么事务只会在遇到`RuntimeException`的时候才会回滚,加上`rollbackFor=Exception.class`,可以让事务在遇到非运行时异常时也回滚。

`@Transactional` 注解一般可以作用在`类`或者`方法`上。

- **作用于类**：当把`@Transactional` 注解放在类上时，表示所有该类的 public 方法都配置相同的事务属性信息。
- **作用于方法**：当类配置了`@Transactional`，方法也配置了`@Transactional`，方法的事务会覆盖类的事务配置信息。

更多关于 Spring 事务的内容请查看我的这篇文章：[可能是最漂亮的 Spring 事务管理详解](./Spring 事务详解.md) 。

## JPA

Spring Data JPA 提供了一系列注解和功能，帮助开发者轻松实现 ORM（对象关系映射）。

### 创建表

`@Entity` 用于声明一个类为 JPA 实体类，与数据库中的表映射。`@Table` 指定实体对应的表名。

```java
@Entity
@Table(name = "role")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    // 省略 getter/setter
}
```

### 主键生成策略

`@Id`声明字段为主键。`@GeneratedValue` 指定主键的生成策略。

Jakarta Persistence 3.1 提供了 5 种主键生成策略：

- **`GenerationType.TABLE`**：通过数据库表生成主键。
- **`GenerationType.SEQUENCE`**：通过数据库序列生成主键（适用于 Oracle 等数据库）。
- **`GenerationType.IDENTITY`**：主键自增长（适用于 MySQL 等数据库）。
- **`GenerationType.UUID`**：生成 RFC 4122 UUID，适用于 `UUID` 或 `String` 类型主键。
- **`GenerationType.AUTO`**：由 JPA 自动选择合适的生成策略（默认策略）。

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
```

通过 `@GenericGenerator` 声明自定义主键生成策略：

```java
@Id
@GeneratedValue(generator = "IdentityIdGenerator")
@GenericGenerator(name = "IdentityIdGenerator", strategy = "identity")
private Long id;
```

等价于：

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
```

下面是旧版 Hibernate 内部实现的源码节选，展示了当时 Hibernate 支持的字符串生成器策略。它不属于 JPA/Jakarta Persistence 标准 API，也不能替代上面的标准 `GenerationType` 枚举；新项目应以所使用 Hibernate 版本的官方文档为准。

```java
public class DefaultIdentifierGeneratorFactory
    implements MutableIdentifierGeneratorFactory, Serializable, ServiceRegistryAwareService {

  @SuppressWarnings("deprecation")
  public DefaultIdentifierGeneratorFactory() {
    register( "uuid2", UUIDGenerator.class );
    register( "guid", GUIDGenerator.class );      // can be done with UUIDGenerator + strategy
    register( "uuid", UUIDHexGenerator.class );      // "deprecated" for new use
    register( "uuid.hex", UUIDHexGenerator.class );   // uuid.hex is deprecated
    register( "assigned", Assigned.class );
    register( "identity", IdentityGenerator.class );
    register( "select", SelectGenerator.class );
    register( "sequence", SequenceStyleGenerator.class );
    register( "seqhilo", SequenceHiLoGenerator.class );
    register( "increment", IncrementGenerator.class );
    register( "foreign", ForeignGenerator.class );
    register( "sequence-identity", SequenceIdentityGenerator.class );
    register( "enhanced-sequence", SequenceStyleGenerator.class );
    register( "enhanced-table", TableGenerator.class );
  }

  public void register(String strategy, Class generatorClass) {
    LOG.debugf( "Registering IdentifierGenerator strategy [%s] -> [%s]", strategy, generatorClass.getName() );
    final Class previous = generatorStrategyToClassNameMap.put( strategy, generatorClass );
    if ( previous != null ) {
      LOG.debugf( "    - overriding [%s]", previous.getName() );
    }
  }

}
```

### 字段映射

`@Column` 用于指定实体字段与数据库列的映射关系。

- **`name`**：指定数据库列名。
- **`nullable`**：指定是否允许为 `null`。
- **`length`**：设置字段的长度（仅适用于 `String` 类型）。
- **`columnDefinition`**：指定字段的数据库类型和默认值。

```java
@Column(name = "user_name", nullable = false, length = 32)
private String userName;

@Column(columnDefinition = "tinyint(1) default 1")
private Boolean enabled;
```

### 忽略字段

`@Transient` 用于声明不需要持久化的字段。

```java
@Entity
public class User {

    @Transient
    private String temporaryField; // 不会映射到数据库表中
}
```

其他不被持久化的字段方式：

- **`static`**：静态字段不会被持久化。
- **`final`**：最终字段不会被持久化。
- **`transient`**：使用 Java 的 `transient` 关键字声明的字段不会被序列化或持久化。

### 大字段存储

`@Lob` 用于声明大字段（如 `CLOB` 或 `BLOB`）。

```java
@Lob
@Column(name = "content", columnDefinition = "LONGTEXT NOT NULL")
private String content;
```

### 枚举类型映射

`@Enumerated` 用于将枚举类型映射为数据库字段。

- **`EnumType.ORDINAL`**：存储枚举的序号（默认）。
- **`EnumType.STRING`**：存储枚举的名称（推荐）。

```java
public enum Gender {
    MALE,
    FEMALE
}

@Entity
public class User {

    @Enumerated(EnumType.STRING)
    private Gender gender;
}
```

数据库中存储的值为 `MALE` 或 `FEMALE`。

### 审计功能

通过 JPA 的审计功能，可以在实体中自动记录创建时间、更新时间、创建人和更新人等信息。

审计基类:

```java
@Data
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class AbstractAuditBase {

    @CreatedDate
    @Column(updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    @CreatedBy
    @Column(updatable = false)
    private String createdBy;

    @LastModifiedBy
    private String updatedBy;
}
```

配置审计功能:

```java
@Configuration
@EnableJpaAuditing
public class AuditConfig {

    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> Optional.ofNullable(SecurityContextHolder.getContext())
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(Authentication::getName);
    }
}
```

简单介绍一下上面涉及到的一些注解：

1. `@CreatedDate`: 表示该字段为创建时间字段，在这个实体被 insert 的时候，会设置值
2. `@CreatedBy` :表示该字段为创建人，在这个实体被 insert 的时候，会设置值 `@LastModifiedDate`、`@LastModifiedBy`同理。
3. `@EnableJpaAuditing`：开启 JPA 审计功能。

### 修改和删除操作

`@Modifying` 用于把 `@Query` 声明的语句标识为 INSERT、UPDATE、DELETE 或 DDL 等修改操作。派生删除方法（例如 `deleteByUserName`）不需要 `@Modifying`。事务边界既可以声明在 Repository 方法上，也可以由上层 Service 的工作单元统一管理。

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Modifying
    @Transactional
    @Query("delete from User user where user.userName = :userName")
    int deleteByUserName(@Param("userName") String userName);
}
```

### 关联关系

JPA 提供了 4 种关联关系的注解：

- **`@OneToOne`**：一对一关系。
- **`@OneToMany`**：一对多关系。
- **`@ManyToOne`**：多对一关系。
- **`@ManyToMany`**：多对多关系。

```java
@Entity
public class User {

    @OneToOne
    private Profile profile;

    @OneToMany(mappedBy = "user")
    private List<Order> orders;
}
```

## JSON 数据处理

在 Web 开发中，经常需要处理 Java 对象与 JSON 格式之间的转换。Spring 通常集成 Jackson 库来完成此任务，以下是一些常用的 Jackson 注解，可以帮助我们定制化 JSON 的序列化（Java 对象转 JSON）和反序列化（JSON 转 Java 对象）过程。

### 过滤 JSON 字段

有时我们不希望 Java 对象的某些字段被包含在最终生成的 JSON 中，或者在将 JSON 转换为 Java 对象时不处理某些 JSON 属性。

`@JsonIgnoreProperties` 作用在类上用于过滤掉特定字段不返回或者不解析。

```java
// 在生成 JSON 时忽略 userRoles 属性
// 如果允许未知属性（即 JSON 中有而类中没有的属性），可以添加 ignoreUnknown = true
@JsonIgnoreProperties({"userRoles"})
public class User {
    private String userName;
    private String fullName;
    private String password;
    private List<UserRole> userRoles = new ArrayList<>();
    // getters and setters...
}
```

`@JsonIgnore`作用于字段或`getter/setter` 方法级别，用于指定在序列化或反序列化时忽略该特定属性。

```java
public class User {
    private String userName;
    private String fullName;
    private String password;

    // 在生成 JSON 时忽略 userRoles 属性
    @JsonIgnore
    private List<UserRole> userRoles = new ArrayList<>();
    // getters and setters...
}
```

`@JsonIgnoreProperties` 更适用于在类定义时明确排除多个字段，或继承场景下的字段排除；`@JsonIgnore` 则更直接地用于标记单个具体字段。

### 格式化 JSON 数据

`@JsonFormat` 用于指定属性在序列化和反序列化时的格式。常用于日期时间类型的格式化。

比如：

```java
// 指定 Date 类型序列化为 ISO 8601 格式字符串，并设置时区为 GMT
@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "GMT")
private Date date;
```

### 扁平化 JSON 对象

`@JsonUnwrapped` 注解作用于字段上，用于在序列化时将其嵌套对象的属性“提升”到当前对象的层级，反序列化时执行相反操作。这可以使 JSON 结构更扁平。

假设有 `Account` 类，包含 `Location` 和 `PersonInfo` 两个嵌套对象。

```java
@Getter
@Setter
@ToString
public class Account {
    private Location location;
    private PersonInfo personInfo;

  @Getter
  @Setter
  @ToString
  public static class Location {
     private String provinceName;
     private String countyName;
  }
  @Getter
  @Setter
  @ToString
  public static class PersonInfo {
    private String userName;
    private String fullName;
  }
}

```

未扁平化之前的 JSON 结构：

```json
{
  "location": {
    "provinceName": "湖北",
    "countyName": "武汉"
  },
  "personInfo": {
    "userName": "coder1234",
    "fullName": "shaungkou"
  }
}
```

使用`@JsonUnwrapped` 扁平对象：

```java
@Getter
@Setter
@ToString
public class Account {
    @JsonUnwrapped
    private Location location;
    @JsonUnwrapped
    private PersonInfo personInfo;
    ......
}
```

扁平化后的 JSON 结构：

```json
{
  "provinceName": "湖北",
  "countyName": "武汉",
  "userName": "coder1234",
  "fullName": "shaungkou"
}
```

## 测试

`@ActiveProfiles`一般作用于测试类上， 用于声明生效的 Spring 配置文件。

```java
// 指定在 RANDOM_PORT 上启动应用上下文，并激活 "test" profile
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Slf4j
public abstract class TestBase {
    // Common test setup or abstract methods...
}
```

`@Test` 是 JUnit 框架（通常是 JUnit 5 Jupiter）提供的注解，用于标记一个方法为测试方法。虽然不是 Spring 自身的注解，但它是执行单元测试和集成测试的基础。

由 Spring TestContext 在测试线程中管理的 `@Transactional` 测试方法默认会在测试结束后回滚，避免污染测试数据。需要注意，如果使用 `RANDOM_PORT` 发起真实 HTTP 请求，服务端处理运行在另一个线程和事务中，不会随测试线程的事务自动回滚，此时需要使用隔离数据库或显式清理数据。

`@WithMockUser` 是 Spring Security Test 模块提供的注解，用于在测试期间模拟一个已认证的用户。可以方便地指定用户名、密码、角色（authorities）等信息，从而测试受安全保护的端点或方法。

```java
public class MyServiceTest extends TestBase { // Assuming TestBase provides Spring context

    @Test
    @Transactional // 测试数据将回滚
    @WithMockUser(username = "test-user", authorities = { "ROLE_TEACHER", "read" }) // 模拟一个名为 "test-user"，拥有 TEACHER 角色和 read 权限的用户
    void should_perform_action_requiring_teacher_role() throws Exception {
        // ... 测试逻辑 ...
        // 这里可以调用需要 "ROLE_TEACHER" 权限的服务方法
    }
}
```

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: spring/SpringBoot 自动装配原理详解.md -->

## [7] SpringBoot 自动装配原理详解

---
title: SpringBoot 自动装配原理详解
description: SpringBoot自动装配原理深度解析，详解@EnableAutoConfiguration、SpringFactories加载机制及条件注解工作原理。
category: 框架
tag:
  - SpringBoot
head:
  - - meta
    - name: keywords
      content: Spring Boot自动装配,AutoConfiguration,EnableAutoConfiguration,SpringFactories,条件注解,Starter,Spring Boot原理
---

> 作者：[Miki-byte-1024](https://github.com/Miki-byte-1024) & [Snailclimb](https://github.com/Snailclimb)

每次问到 Spring Boot， 面试官非常喜欢问这个问题：“讲述一下 SpringBoot 自动装配原理？”。

我觉得我们可以从以下几个方面回答：

1. 什么是 SpringBoot 自动装配？
2. SpringBoot 是如何实现自动装配的？如何实现按需加载？
3. 如何实现一个 Starter？

篇幅问题，这篇文章并没有深入，小伙伴们也可以直接使用 debug 的方式去看看 SpringBoot 自动装配部分的源代码。

## 前言

使用过 Spring 的小伙伴，一定有被 XML 配置统治的恐惧。即使 Spring 后面引入了基于注解的配置，我们在开启某些 Spring 特性或者引入第三方依赖的时候，还是需要用 XML 或 Java 进行显式配置。

举个例子。没有 Spring Boot 的时候，我们写一个 RestFul Web 服务，还首先需要进行如下配置。

```java
@Configuration
public class RESTConfiguration
{
    @Bean
    public View jsonTemplate() {
        MappingJackson2JsonView view = new MappingJackson2JsonView();
        view.setPrettyPrint(true);
        return view;
    }

    @Bean
    public ViewResolver viewResolver() {
        return new BeanNameViewResolver();
    }
}
```

`spring-servlet.xml`

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
    xmlns:mvc="http://www.springframework.org/schema/mvc"
    xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
    http://www.springframework.org/schema/context/ http://www.springframework.org/schema/context/spring-context.xsd
    http://www.springframework.org/schema/mvc/ http://www.springframework.org/schema/mvc/spring-mvc.xsd">

    <context:component-scan base-package="com.howtodoinjava.demo" />
    <mvc:annotation-driven />

    <!-- JSON Support -->
    <bean name="viewResolver" class="org.springframework.web.servlet.view.BeanNameViewResolver"/>
    <bean name="jsonTemplate" class="org.springframework.web.servlet.view.json.MappingJackson2JsonView"/>

</beans>
```

但是，Spring Boot 项目，我们只需要添加相关依赖，无需配置，通过启动下面的 `main` 方法即可。

```java
@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

并且，我们通过 Spring Boot 的全局配置文件 `application.properties`或`application.yml`即可对项目进行设置比如更换端口号，配置 JPA 属性等等。

**为什么 Spring Boot 使用起来这么酸爽呢？** 这得益于其自动装配。**自动装配可以说是 Spring Boot 的核心，那究竟什么是自动装配呢？**

## 什么是 SpringBoot 自动装配？

我们现在提到自动装配的时候，一般会和 Spring Boot 联系在一起。但是，实际上 Spring Framework 早就实现了这个功能。Spring Boot 只是在其基础上，通过 SPI 的方式，做了进一步优化。

> 在 Spring Boot 2.6 及更早版本中，自动配置类主要通过外部 jar 包中的 `META-INF/spring.factories` 注册。Spring Boot 2.7 引入了 `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`，同时兼容旧的注册方式；Spring Boot 3.0 移除了通过 `spring.factories` 中 `EnableAutoConfiguration` key 注册自动配置类的支持，但 `spring.factories` 的其他用途不受影响。

没有 Spring Boot 的情况下，如果我们需要引入第三方依赖，需要手动配置，非常麻烦。但是，Spring Boot 中，我们直接引入一个 starter 即可。比如你想要在项目中使用 redis 的话，直接在项目中引入对应的 starter 即可。

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

引入 starter 之后，我们通过少量注解和一些简单的配置就能使用第三方组件提供的功能了。

在我看来，自动装配可以简单理解为：**通过注解或者一些简单的配置就能在 Spring Boot 的帮助下实现某块功能。**

## SpringBoot 是如何实现自动装配的？

我们先看一下 SpringBoot 的核心注解 `SpringBootApplication` 。

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
<1.>@SpringBootConfiguration
<2.>@ComponentScan
<3.>@EnableAutoConfiguration
public @interface SpringBootApplication {

}

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Configuration //实际上它也是一个配置类
public @interface SpringBootConfiguration {
}
```

大概可以把 `@SpringBootApplication`看作是 `@Configuration`、`@EnableAutoConfiguration`、`@ComponentScan` 注解的集合。根据 SpringBoot 官网，这三个注解的作用分别是：

- `@EnableAutoConfiguration`：启用 SpringBoot 的自动配置机制
- `@Configuration`：允许在上下文中注册额外的 bean 或导入其他配置类
- `@ComponentScan`：扫描被`@Component` (`@Service`,`@Controller`)注解的 bean，注解默认会扫描启动类所在的包下所有的类 ，可以自定义不扫描某些 bean。如下图所示，容器中将排除`TypeExcludeFilter`和`AutoConfigurationExcludeFilter`。

![](https://oss.javaguide.cn/p3-juejin/bcc73490afbe4c6ba62acde6a94ffdfd~tplv-k3u1fbpfcp-watermark.png)

`@EnableAutoConfiguration` 是实现自动装配的重要注解，我们以这个注解入手。

### @EnableAutoConfiguration:实现自动装配的核心注解

`EnableAutoConfiguration` 只是一个简单地注解，自动装配核心功能的实现实际是通过 `AutoConfigurationImportSelector`类。

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage //作用：将main包下的所有组件注册到容器中
@Import({AutoConfigurationImportSelector.class}) //加载自动装配类 xxxAutoconfiguration
public @interface EnableAutoConfiguration {
    String ENABLED_OVERRIDE_PROPERTY = "spring.boot.enableautoconfiguration";

    Class<?>[] exclude() default {};

    String[] excludeName() default {};
}
```

我们现在重点分析下`AutoConfigurationImportSelector` 类到底做了什么？

### AutoConfigurationImportSelector:加载自动装配类

下面以 Spring Boot 2.1.x 的源码节选为例分析 `AutoConfigurationImportSelector`。这些代码省略了部分不影响流程的实现，不能作为独立类直接编译。Spring Boot 2.7 及以上版本的候选自动配置类主要从 `AutoConfiguration.imports` 文件读取，具体源码结构与下面的旧版本代码有所不同。

`AutoConfigurationImportSelector`类的继承体系如下：

```java
public class AutoConfigurationImportSelector implements DeferredImportSelector, BeanClassLoaderAware, ResourceLoaderAware, BeanFactoryAware, EnvironmentAware, Ordered {

}

public interface DeferredImportSelector extends ImportSelector {

}

public interface ImportSelector {
    String[] selectImports(AnnotationMetadata var1);
}
```

可以看出，`AutoConfigurationImportSelector` 类实现了 `ImportSelector`接口，也就实现了这个接口中的 `selectImports`方法，该方法主要用于**获取所有符合条件的类的全限定类名，这些类需要被加载到 IoC 容器中**。

```java
private static final String[] NO_IMPORTS = new String[0];

public String[] selectImports(AnnotationMetadata annotationMetadata) {
        // <1>.判断自动装配开关是否打开
        if (!this.isEnabled(annotationMetadata)) {
            return NO_IMPORTS;
        } else {
          //<2>.获取所有需要装配的bean
            AutoConfigurationMetadata autoConfigurationMetadata = AutoConfigurationMetadataLoader.loadMetadata(this.beanClassLoader);
            AutoConfigurationImportSelector.AutoConfigurationEntry autoConfigurationEntry = this.getAutoConfigurationEntry(autoConfigurationMetadata, annotationMetadata);
            return StringUtils.toStringArray(autoConfigurationEntry.getConfigurations());
        }
    }
```

这里我们需要重点关注一下`getAutoConfigurationEntry()`方法，这个方法主要负责加载自动配置类的。

该方法调用链如下：

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/3c1200712655443ca4b38500d615bb70~tplv-k3u1fbpfcp-watermark.png)

现在我们结合`getAutoConfigurationEntry()`的源码来详细分析一下：

```java
private static final AutoConfigurationEntry EMPTY_ENTRY = new AutoConfigurationEntry();

AutoConfigurationEntry getAutoConfigurationEntry(AutoConfigurationMetadata autoConfigurationMetadata, AnnotationMetadata annotationMetadata) {
        //<1>.
        if (!this.isEnabled(annotationMetadata)) {
            return EMPTY_ENTRY;
        } else {
            //<2>.
            AnnotationAttributes attributes = this.getAttributes(annotationMetadata);
            //<3>.
            List<String> configurations = this.getCandidateConfigurations(annotationMetadata, attributes);
            //<4>.
            configurations = this.removeDuplicates(configurations);
            Set<String> exclusions = this.getExclusions(annotationMetadata, attributes);
            this.checkExcludedClasses(configurations, exclusions);
            configurations.removeAll(exclusions);
            configurations = this.filter(configurations, autoConfigurationMetadata);
            this.fireAutoConfigurationImportEvents(configurations, exclusions);
            return new AutoConfigurationImportSelector.AutoConfigurationEntry(configurations, exclusions);
        }
    }
```

**第 1 步**:

判断自动装配开关是否打开。默认`spring.boot.enableautoconfiguration=true`，可在 `application.properties` 或 `application.yml` 中设置

![](https://oss.javaguide.cn/p3-juejin/77aa6a3727ea4392870f5cccd09844ab~tplv-k3u1fbpfcp-watermark.png)

**第 2 步**：

用于获取`EnableAutoConfiguration`注解中的 `exclude` 和 `excludeName`。

![](https://oss.javaguide.cn/p3-juejin/3d6ec93bbda1453aa08c52b49516c05a~tplv-k3u1fbpfcp-zoom-1.png)

**第 3 步**

在本文采用的 Spring Boot 2.1.x 源码中，获取需要自动装配的所有配置类时会读取 `META-INF/spring.factories`：

```plain
spring-boot/spring-boot-project/spring-boot-autoconfigure/src/main/resources/META-INF/spring.factories
```

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/58c51920efea4757aa1ec29c6d5f9e36~tplv-k3u1fbpfcp-watermark.png)

从下图可以看到这个文件的配置内容都被我们读取到了。`XXXAutoConfiguration`的作用就是按需加载组件。

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/94d6e1a060ac41db97043e1758789026~tplv-k3u1fbpfcp-watermark.png)

不光是这个依赖下的 `META-INF/spring.factories` 会被读取，类路径中其他 jar 包的同名资源也会被 `SpringFactoriesLoader` 合并读取。需要注意，Starter 通常只是用于聚合依赖的 jar，自动配置代码和注册文件可以放在独立的 autoconfigure 模块中，也可以和 Starter 合并，并不是每个 Starter 都必须包含 `spring.factories`。

所以，你可以清楚滴看到， druid 数据库连接池的 Spring Boot Starter 就创建了`META-INF/spring.factories`文件。

如果要为 Spring Boot 2.6 及更早版本编写自动配置，需要使用这种注册方式；面向 Spring Boot 3.x 的自动配置应改用 `AutoConfiguration.imports`。

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/68fa66aeee474b0385f94d23bcfe1745~tplv-k3u1fbpfcp-watermark.png)

**第 4 步**：

到这里可能面试官会问你:“`spring.factories`中这么多配置，每次启动都要全部加载么？”。

很明显，这是不现实的。我们 debug 到后面你会发现，`configurations` 的值变小了。

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/267f8231ae2e48d982154140af6437b0~tplv-k3u1fbpfcp-watermark.png)

因为，这一步有经历了一遍筛选，`@ConditionalOnXXX` 中的所有条件都满足，该类才会生效。

```java
@Configuration
// 检查相关的类：RabbitTemplate 和 Channel是否存在
// 存在才会加载
@ConditionalOnClass({ RabbitTemplate.class, Channel.class })
@EnableConfigurationProperties(RabbitProperties.class)
@Import(RabbitAnnotationDrivenConfiguration.class)
public class RabbitAutoConfiguration {
}
```

有兴趣的童鞋可以详细了解下 Spring Boot 提供的条件注解

- `@ConditionalOnBean`：当容器里有指定 Bean 的条件下
- `@ConditionalOnMissingBean`：当容器里没有指定 Bean 的情况下
- `@ConditionalOnSingleCandidate`：当指定 Bean 在容器中只有一个，或者虽然有多个但是指定首选 Bean
- `@ConditionalOnClass`：当类路径下有指定类的条件下
- `@ConditionalOnMissingClass`：当类路径下没有指定类的条件下
- `@ConditionalOnProperty`：指定的属性是否有指定的值
- `@ConditionalOnResource`：类路径是否有指定的值
- `@ConditionalOnExpression`：基于 SpEL 表达式作为判断条件
- `@ConditionalOnJava`：基于 Java 版本作为判断条件
- `@ConditionalOnJndi`：在 JNDI 存在的条件下差在指定的位置
- `@ConditionalOnNotWebApplication`：当前项目不是 Web 项目的条件下
- `@ConditionalOnWebApplication`：当前项目是 Web 项 目的条件下

## 如何实现一个 Starter

光说不练假把式，现在就来撸一个 starter，实现自定义线程池

第一步，创建`threadpool-spring-boot-starter`工程

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/1ff0ebe7844f40289eb60213af72c5a6~tplv-k3u1fbpfcp-watermark.png)

第二步，引入 Spring Boot 相关依赖

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/5e14254276604f87b261e5a80a354cc0~tplv-k3u1fbpfcp-watermark.png)

第三步，创建`ThreadPoolAutoConfiguration`

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/1843f1d12c5649fba85fd7b4e4a59e39~tplv-k3u1fbpfcp-watermark.png)

第四步，注册自动配置类。对于 Spring Boot 2.6 及更早版本，在`threadpool-spring-boot-starter`工程的 resources 包下创建`META-INF/spring.factories`文件；Spring Boot 2.7 及以上版本应使用 `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`，面向 Spring Boot 3.x 时自动配置类通常使用 `@AutoConfiguration` 标注。

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/97b738321f1542ea8140484d6aaf0728~tplv-k3u1fbpfcp-watermark.png)

最后新建工程引入`threadpool-spring-boot-starter`

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/edcdd8595a024aba85b6bb20d0e3fed4~tplv-k3u1fbpfcp-watermark.png)

测试通过！！！

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/9a265eea4de742a6bbdbbaa75f437307~tplv-k3u1fbpfcp-watermark.png)

## 总结

Spring Boot 通过`@EnableAutoConfiguration`开启自动装配，并加载类路径中注册的候选自动配置类。Spring Boot 2.6 及更早版本主要通过 `spring.factories` 注册，Spring Boot 2.7 及以上版本使用 `AutoConfiguration.imports`。自动配置类会结合 `@Conditional` 系列注解按需生效；Starter 的主要作用是聚合常用依赖，并不是自动配置生效所要求的固定包名。

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: spring/Spring常见面试题总结.md -->

## [8] Spring常见面试题总结

---
title: Spring常见面试题总结
description: Spring框架核心面试题详解，涵盖IoC容器、AOP原理、Bean生命周期、依赖注入等Spring核心知识点。
category: 框架
tag:
  - Spring
head:
  - - meta
    - name: keywords
      content: Spring面试题,Spring框架,Bean生命周期,IoC,AOP,依赖注入,事务,Spring常见问题
---

这篇文章主要是想通过一些问题，加深大家对于 Spring 的理解，所以不会涉及太多的代码！

下面的很多问题我自己在使用 Spring 的过程中也并没有注意，自己也是临时查阅了很多资料和书籍补上的。网上也有一些很多关于 Spring 常见问题/面试题整理的文章，我感觉大部分都是互相 copy，而且很多问题也不是很好，有些回答也存在问题。所以，自己花了一周的业余时间整理了一下，希望对大家有帮助。

## Spring 基础

### 什么是 Spring 框架?

Spring 是一款开源的轻量级 Java 开发框架，旨在提高开发人员的开发效率以及系统的可维护性。

我们一般说 Spring 框架指的都是 Spring Framework，它是很多模块的集合，使用这些模块可以很方便地协助我们进行开发，比如说 Spring 支持 IoC（Inversion of Control:控制反转） 和 AOP(Aspect-Oriented Programming:面向切面编程)、可以很方便地对数据库进行访问、可以很方便地集成第三方组件（电子邮件，任务，调度，缓存等等）、对单元测试支持比较好、支持 RESTful Java 应用程序的开发。

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/38ef122122de4375abcd27c3de8f60b4.png)

Spring 最核心的思想就是不重新造轮子，开箱即用，提高开发效率。

Spring 翻译过来就是春天的意思，可见其目标和使命就是为 Java 程序员带来春天啊！感动！

🤐 多提一嘴：**语言的流行通常需要一个杀手级的应用，Spring 就是 Java 生态的一个杀手级的应用框架。**

Spring 提供的核心功能主要是 IoC 和 AOP。学习 Spring ，一定要把 IoC 和 AOP 的核心思想搞懂！

- Spring 官网：<https://spring.io/>
- GitHub 地址： <https://github.com/spring-projects/spring-framework>

### Spring 包含的模块有哪些？

**Spring4.x 版本**：

![Spring4.x主要模块](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/jvme0c60b4606711fc4a0b6faf03230247a.png)

**Spring5.x 版本**：

![Spring5.x主要模块](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/20200831175708.png)

Spring5.x 版本中 Web 模块的 Portlet 组件已经被废弃掉，同时增加了用于异步响应式处理的 WebFlux 组件。

Spring 各个模块的依赖关系如下：

![Spring 各个模块的依赖关系](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/20200902100038.png)

#### Core Container

Spring 框架的核心模块，也可以说是基础模块，主要提供 IoC 依赖注入功能的支持。Spring 其他所有的功能基本都需要依赖于该模块，我们从上面那张 Spring 各个模块的依赖关系图就可以看出来。

- **spring-core**：Spring 框架基本的核心工具类。
- **spring-beans**：提供对 bean 的创建、配置和管理等功能的支持。
- **spring-context**：提供对国际化、事件传播、资源加载等功能的支持。
- **spring-expression**：提供对表达式语言（Spring Expression Language） SpEL 的支持，只依赖于 core 模块，不依赖于其他模块，可以单独使用。

#### AOP

- **spring-aspects**：该模块为与 AspectJ 的集成提供支持。
- **spring-aop**：提供了面向切面的编程实现。
- **spring-instrument**：提供了为 JVM 添加代理（agent）的功能。 具体来讲，它为 Tomcat 提供了一个织入代理，能够为 Tomcat 传递类文 件，就像这些文件是被类加载器加载的一样。没有理解也没关系，这个模块的使用场景非常有限。

#### Data Access/Integration

下面的模块列表主要基于 Spring Framework 5.x。现代 Spring Framework 已经移除了一些旧技术的集成，实际使用时应以目标 Spring 版本的官方模块清单为准。

- **spring-jdbc**：提供了对数据库访问的抽象 JDBC。不同的数据库都有自己独立的 API 用于操作数据库，而 Java 程序只需要和 JDBC API 交互，这样就屏蔽了数据库的影响。
- **spring-tx**：提供对事务的支持。
- **spring-orm**：在 Spring Framework 5.x 中提供对 Hibernate、JPA 等 ORM 技术的支持；更早的 Spring 版本还提供过 iBATIS 集成。
- **spring-oxm**：提供 OXM（Object-to-XML Mapping）抽象。不同 Spring 版本支持的具体实现不同，例如 JAXB；Castor、XMLBeans、JiBX 等属于旧版本集成。
- **spring-jms** : 消息服务。自 Spring Framework 4.1 以后，它还提供了对 spring-messaging 模块的继承。

#### Spring Web

- **spring-web**：对 Web 功能的实现提供一些最基础的支持。
- **spring-webmvc**：提供对 Spring MVC 的实现。
- **spring-websocket**：提供了对 WebSocket 的支持，WebSocket 可以让客户端和服务端进行双向通信。
- **spring-webflux**：提供对 WebFlux 的支持。WebFlux 是 Spring Framework 5.0 中引入的响应式、非阻塞 Web 框架，可以运行在 Netty 上，也可以运行在支持非阻塞 I/O 的 Servlet 容器上。应用是否端到端非阻塞，还取决于数据访问和其他下游调用是否包含阻塞操作。

#### Messaging

**spring-messaging** 是从 Spring4.0 开始新加入的一个模块，主要职责是为 Spring 框架集成一些基础的报文传送应用。

#### Spring Test

Spring 团队提倡测试驱动开发（TDD）。有了控制反转 (IoC)的帮助，单元测试和集成测试变得更简单。

Spring 的测试模块对 JUnit（单元测试框架）、TestNG（类似 JUnit）、Mockito（主要用来 Mock 对象）、PowerMock（解决 Mockito 的问题比如无法模拟 final, static， private 方法）等等常用的测试框架支持的都比较好。

### ⭐️Spring,Spring MVC,Spring Boot 之间什么关系?

很多人对 Spring,Spring MVC,Spring Boot 这三者傻傻分不清楚！这里简单介绍一下这三者，其实很简单，没有什么高深的东西。

Spring 包含了多个功能模块（上面刚刚提到过），其中最重要的是 Spring-Core（主要提供 IoC 依赖注入功能的支持） 模块， Spring 中的其他模块（比如 Spring MVC）的功能实现基本都需要依赖于该模块。

下图对应的是 Spring 4.x 版本。Spring 5.0 引入了用于响应式处理的 WebFlux，并逐步淘汰了 Portlet 相关支持；现代 Spring 版本的模块组成请以官方文档为准。

![Spring主要模块](https://oss.javaguide.cn/github/javaguide/jvme0c60b4606711fc4a0b6faf03230247a.png)

Spring MVC 是 Spring 中的一个很重要的模块，主要赋予 Spring 快速构建 MVC 架构的 Web 程序的能力。MVC 是模型(Model)、视图(View)、控制器(Controller)的简写，其核心思想是通过将业务逻辑、数据、显示分离来组织代码。

![](https://oss.javaguide.cn/java-guide-blog/image-20210809181452421.png)

使用 Spring 进行开发各种配置过于麻烦比如开启某些 Spring 特性时，需要用 XML 或 Java 进行显式配置。于是，Spring Boot 诞生了！

Spring 旨在简化 J2EE 企业应用程序开发。Spring Boot 旨在简化 Spring 开发（减少配置文件，开箱即用！）。

Spring Boot 只是简化了配置，如果你需要构建 MVC 架构的 Web 程序，你还是需要使用 Spring MVC 作为 MVC 框架，只是说 Spring Boot 帮你简化了 Spring MVC 的很多配置，真正做到开箱即用！

## Spring IoC

### ⭐️什么是 IoC?

IoC （Inversion of Control ）即控制反转/反转控制。它是一种思想不是一个技术实现。描述的是：Java 开发领域对象的创建以及管理的问题。

例如：现有类 A 依赖于类 B

- **传统的开发方式** ：往往是在类 A 中手动通过 new 关键字来 new 一个 B 的对象出来
- **使用 IoC 思想的开发方式** ：不通过 new 关键字来创建对象，而是通过 IoC 容器(Spring 框架) 来帮助我们实例化对象。我们需要哪个对象，直接从 IoC 容器里面去取即可。

从以上两种开发方式的对比来看：我们 “丧失了一个权力” (创建、管理对象的权力)，从而也得到了一个好处（不用再考虑对象的创建、管理等一系列的事情）

**为什么叫控制反转?**

- **控制** ：指的是对象创建（实例化、管理）的权力
- **反转** ：控制权交给外部环境（IoC 容器）

![IoC 图解](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/IoC&Aop-ioc-illustration.png)

### ⭐️IoC 解决了什么问题?

IoC 的思想就是两方之间不互相依赖，由第三方容器来管理相关资源。这样有什么好处呢？

1. 对象之间的耦合度或者说依赖程度降低；
2. 资源变的容易管理；比如你用 Spring 容器提供的话很容易就可以实现一个单例。

例如：现有一个针对 User 的操作，利用 Service 和 Dao 两层结构进行开发

在没有使用 IoC 思想的情况下，Service 层想要使用 Dao 层的具体实现的话，需要通过 new 关键字在`UserServiceImpl` 中手动 new 出 `IUserDao` 的具体实现类 `UserDaoImpl`（不能直接 new 接口类）。

很完美，这种方式也是可以实现的，但是我们想象一下如下场景：

开发过程中突然接到一个新的需求，针对`IUserDao` 接口开发出另一个具体实现类。因为 Server 层依赖了`IUserDao`的具体实现，所以我们需要修改`UserServiceImpl`中 new 的对象。如果只有一个类引用了`IUserDao`的具体实现，可能觉得还好，修改起来也不是很费力气，但是如果有许许多多的地方都引用了`IUserDao`的具体实现的话，一旦需要更换`IUserDao` 的实现方式，那修改起来将会非常的头疼。

![IoC&Aop-ioc-illustration-dao-service](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/IoC&Aop-ioc-illustration-dao-service.png)

使用 IoC 的思想，我们将对象的控制权（创建、管理）交由 IoC 容器去管理，我们在使用的时候直接向 IoC 容器 “要” 就可以了

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/IoC&Aop-ioc-illustration-dao.png)

### 什么是 Spring Bean？

简单来说，Bean 代指的就是那些被 IoC 容器所管理的对象。

我们需要告诉 IoC 容器帮助我们管理哪些对象，这个是通过配置元数据来定义的。配置元数据可以是 XML 文件、注解或者 Java 配置类。

```xml
<!-- Constructor-arg with 'value' attribute -->
<bean id="..." class="...">
   <constructor-arg value="..."/>
</bean>
```

下图简单地展示了 IoC 容器如何使用配置元数据来管理对象。

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/062b422bd7ac4d53afd28fb74b2bc94d.png)

`org.springframework.beans`和 `org.springframework.context` 这两个包是 IoC 实现的基础，如果想要研究 IoC 相关的源码的话，可以去看看

### 将一个类声明为 Bean 的注解有哪些?

- `@Component`：通用的注解，可标注任意类为 `Spring` 组件。如果一个 Bean 不知道属于哪个层，可以使用`@Component` 注解标注。
- `@Repository` : 对应持久层即 Dao 层，主要用于数据库相关操作。
- `@Service` : 对应服务层，主要涉及一些复杂的逻辑，需要用到 Dao 层。
- `@Controller` : 对应 Spring MVC 控制层，主要用于接受用户请求并调用 `Service` 层返回数据给前端页面。

### @Component 和 @Bean 的区别是什么？

- `@Component` 注解作用于类，而`@Bean`注解作用于方法。
- `@Component`通常是通过类路径扫描来自动侦测以及自动装配到 Spring 容器中（我们可以使用 `@ComponentScan` 注解定义要扫描的路径从中找出标识了需要装配的类自动装配到 Spring 的 bean 容器中）。`@Bean` 注解通常是我们在标有该注解的方法中定义产生这个 bean,`@Bean`告诉了 Spring 这是某个类的实例，当我需要用它的时候还给我。
- `@Bean` 注解比 `@Component` 注解的自定义性更强，而且很多地方我们只能通过 `@Bean` 注解来注册 bean。比如当我们引用第三方库中的类需要装配到 `Spring`容器时，则只能通过 `@Bean`来实现。

`@Bean`注解使用示例：

```java
@Configuration
public class AppConfig {
    @Bean
    public TransferService transferService() {
        return new TransferServiceImpl();
    }

}
```

上面的代码相当于下面的 xml 配置

```xml
<beans>
    <bean id="transferService" class="com.acme.TransferServiceImpl"/>
</beans>
```

下面这个例子是通过 `@Component` 无法实现的。

```java
@Bean
public OneService getService(status) {
    case (status)  {
        when 1:
                return new serviceImpl1();
        when 2:
                return new serviceImpl2();
        when 3:
                return new serviceImpl3();
    }
}
```

### 注入 Bean 的注解有哪些？

Spring 提供的 `@Autowired`，以及 Jakarta 规范提供的 `@Resource` 和 `@Inject`，都可以用于注入 Bean。

| Annotation   | Package                                        | Source                                 |
| ------------ | ---------------------------------------------- | -------------------------------------- |
| `@Autowired` | `org.springframework.beans.factory.annotation` | Spring 2.5+                            |
| `@Resource`  | `jakarta.annotation`（Spring 6+）              | Jakarta Annotations / JSR-250          |
| `@Inject`    | `jakarta.inject`（Spring 6+）                  | Jakarta Dependency Injection / JSR-330 |

`@Autowired` 和`@Resource`使用的比较多一些。

### ⭐️@Autowired 和 @Resource 的区别是什么？

`@Autowired` 是 Spring 内置的注解，默认注入逻辑为**先按类型（byType）匹配，若存在多个同类型 Bean，则再尝试按名称（byName）筛选**。

具体来说：

1. 优先根据接口 / 类的类型在 Spring 容器中查找匹配的 Bean。若只找到一个符合类型的 Bean，直接注入，无需考虑名称；
2. 若找到多个同类型的 Bean（例如一个接口有多个实现类），则会尝试通过**属性名或参数名**与 Bean 的名称进行匹配（默认 Bean 名称为类名首字母小写，除非通过 `@Bean(name = "...")` 或 `@Component("...")` 显式指定）。

当一个接口存在多个实现类时：

- 若属性名与某个 Bean 的名称一致，则注入该 Bean；
- 若属性名与所有 Bean 名称都不匹配，会抛出 `NoUniqueBeanDefinitionException`，此时需要通过 `@Qualifier` 显式指定要注入的 Bean 名称。

举例说明：

```java
// SmsService 接口有两个实现类：SmsServiceImpl1、SmsServiceImpl2（均被 Spring 管理）

// 报错：byType 匹配到多个 Bean，且属性名 "smsService" 与两个实现类的默认名称（smsServiceImpl1、smsServiceImpl2）都不匹配
@Autowired
private SmsService smsService;

// 正确：属性名 "smsServiceImpl1" 与实现类 SmsServiceImpl1 的默认名称匹配
@Autowired
private SmsService smsServiceImpl1;

// 正确：通过 @Qualifier 显式指定 Bean 名称 "smsServiceImpl1"
@Autowired
@Qualifier(value = "smsServiceImpl1")
private SmsService smsService;
```

实际开发实践中，我们还是建议通过 `@Qualifier` 注解来显式指定名称而不是依赖变量的名称。

`@Resource` 源自 **JSR-250** 规范。在 JDK 6 到 JDK 10 中，`javax.annotation.Resource` 曾随 JDK 提供；从 JDK 11 开始需要单独引入 API 依赖。Spring 5/Java EE 8 项目通常使用 `javax.annotation-api`，Spring 6/Jakarta EE 9 及以上项目使用 `jakarta.annotation-api`。

Spring 对 `@Resource`（无参数情况）的处理逻辑如下：

1. **按名称（byName）匹配：** 默认取字段名（Field Name）作为 bean 的名称去容器中查找。如果找到了该名称的 Bean，则直接注入。
2. **回退到按类型（byType）匹配：** 如果**没有**找到同名的 Bean，Spring 会退而求其次，尝试根据字段的**类型**去查找。**按类型匹配的结果判定**
   - **找到 1 个 Bean**：注入成功。
   - **找到 0 个 Bean**：抛出异常 (`NoSuchBeanDefinitionException`)。
   - **找到 >1 个 Bean**：抛出异常 (`NoUniqueBeanDefinitionException`)。

`@Resource` 有两个比较重要且日常开发常用的属性：`name`（名称）、`type`（类型）。

```java
public @interface Resource {
    String name() default "";
    Class<?> type() default Object.class;
}
```

如果仅指定 `name` 属性则注入方式为`byName`，如果仅指定`type`属性则注入方式为`byType`，如果同时指定`name` 和`type`属性（不建议这么做）则注入方式为`byType`+`byName`。

```java
// 报错，byName 和 byType 都无法匹配到 bean
@Resource
private SmsService smsService;
// 正确注入 SmsServiceImpl1 对象对应的 bean
@Resource
private SmsService smsServiceImpl1;
// 正确注入 SmsServiceImpl1 对象对应的 bean（比较推荐这种方式）
@Resource(name = "smsServiceImpl1")
private SmsService smsService;
```

**简单总结一下**：

- `@Autowired` 是 Spring 提供的注解，`@Resource` 是 Jakarta Annotations/JSR-250 规范提供的注解。
- `Autowired` 默认的注入方式为`byType`（根据类型进行匹配），`@Resource`默认注入方式为 `byName`（根据名称进行匹配）。
- 当一个接口存在多个实现类的情况下，`@Autowired` 和`@Resource`都需要通过名称才能正确匹配到对应的 Bean。`Autowired` 可以通过 `@Qualifier` 注解来显式指定名称，`@Resource`可以通过 `name` 属性来显式指定名称。
- `@Autowired` 支持在构造函数、方法、字段和参数上使用。`@Resource` 主要用于字段和方法上的注入，不支持在构造函数或参数上使用。

考虑到 `@Resource` 的语义更清晰（名称优先），并且是 Java 标准，能减少对 Spring 框架的强耦合，我们通常**更推荐使用 `@Resource`**，尤其是在需要按名称注入的场景下。而 `@Autowired` 配合构造器注入，在实现依赖注入的不可变性和强制性方面有优势，也是一种非常好的实践。

### 注入 Bean 的方式有哪些？

依赖注入 (Dependency Injection, DI) 的常见方式：

1. 构造函数注入：通过类的构造函数来注入依赖项。
1. Setter 注入：通过类的 Setter 方法来注入依赖项。
1. Field（字段） 注入：直接在类的字段上使用注解（如 `@Autowired` 或 `@Resource`）来注入依赖项。

构造函数注入示例：

```java
@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //...
}
```

Setter 注入示例：

```java
@Service
public class UserService {

    private UserRepository userRepository;

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //...
}
```

Field 注入示例：

```java
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    //...
}
```

### ⭐️构造函数注入还是 Setter 注入？

Spring 官方有对这个问题的回答：<https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html#beans-setter-injection>。

我这里主要提取总结完善一下 Spring 官方的建议。

**Spring 官方推荐构造函数注入**，这种注入方式的优势如下：

1. 依赖完整性：确保所有必需依赖在对象创建时就被注入，避免了空指针异常的风险。
2. 不可变性：有助于创建不可变对象，提高了线程安全性。
3. 初始化保证：组件在使用前已完全初始化，减少了潜在的错误。
4. 测试便利性：在单元测试中，可以直接通过构造函数传入模拟的依赖项，而不必依赖 Spring 容器进行注入。

构造函数注入适合处理**必需的依赖项**，而 **Setter 注入** 则更适合**可选的依赖项**，这些依赖项可以有默认值或在对象生命周期中动态设置。虽然 `@Autowired` 可以用于 Setter 方法来处理必需的依赖项，但构造函数注入仍然是更好的选择。

在某些情况下（例如第三方类不提供 Setter 方法），构造函数注入可能是**唯一的选择**。

### ⭐️Bean 的作用域有哪些?

Spring 中 Bean 的作用域通常有下面几种：

- **singleton** : IoC 容器中只有唯一的 bean 实例。Spring 中的 bean 默认都是单例的，是对单例设计模式的应用。
- **prototype** : 每次获取都会创建一个新的 bean 实例。也就是说，连续 `getBean()` 两次，得到的是不同的 Bean 实例。
- **request** （仅 Web 应用可用）: 每一次 HTTP 请求都会产生一个新的 bean（请求 bean），该 bean 仅在当前 HTTP request 内有效。
- **session** （仅 Web 应用可用） : 每一次来自新 session 的 HTTP 请求都会产生一个新的 bean（会话 bean），该 bean 仅在当前 HTTP session 内有效。
- **application/global-session** （仅 Web 应用可用）：每个 Web 应用在启动时创建一个 Bean（应用 Bean），该 bean 仅在当前应用启动时间内有效。
- **websocket** （仅 Web 应用可用）：每一次 WebSocket 会话产生一个新的 bean。

**如何配置 bean 的作用域呢？**

xml 方式：

```xml
<bean id="..." class="..." scope="singleton"></bean>
```

注解方式：

```java
@Bean
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public Person personPrototype() {
    return new Person();
}
```

### ⭐️Bean 是线程安全的吗？

Spring 框架中的 Bean 是否线程安全，取决于其作用域和状态。

我们这里以最常用的两种作用域 prototype 和 singleton 为例介绍。几乎所有场景的 Bean 作用域都是使用默认的 singleton ，重点关注 singleton 作用域即可。

prototype 作用域下，每次向容器获取都会创建一个新的 bean 实例，可以降低容器层面的共享概率，但作用域本身不提供线程安全保证：如果调用方把同一个 prototype 实例共享给多个线程，仍然可能发生资源竞争。singleton 作用域下，IoC 容器中只有唯一的 bean 实例，更容易出现共享状态竞争问题（取决于 Bean 是否有状态）。

有状态 Bean 示例：

```java
// 定义了一个购物车类，其中包含一个保存用户的购物车里商品的 List
@Component
public class ShoppingCart {
    private List<String> items = new ArrayList<>();

    public void addItem(String item) {
        items.add(item);
    }

    public List<String> getItems() {
        return items;
    }
}
```

不过，大部分 Bean 实际都是无状态（没有定义可变的成员变量）的（比如 Dao、Service），这种情况下， Bean 是线程安全的。

无状态 Bean 示例：

```java
// 定义了一个用户服务，它仅包含业务逻辑而不保存任何状态。
@Component
public class UserService {

    public User findUserById(Long id) {
        //...
    }
    //...
}
```

对于有状态单例 Bean 的线程安全问题，常见的三种解决办法是：

1. **避免可变成员变量**: 尽量设计 Bean 为无状态。
2. **使用`ThreadLocal`**: 将可变成员变量保存在 `ThreadLocal` 中，确保线程独立。
3. **使用同步机制**: 利用 `synchronized` 或 `ReentrantLock` 来进行同步控制，确保线程安全。

这里以 `ThreadLocal`为例，演示一下`ThreadLocal` 保存用户登录信息的场景：

```java
public class UserThreadLocal {

    private UserThreadLocal() {}

    private static final ThreadLocal<SysUser> LOCAL = ThreadLocal.withInitial(() -> null);

    public static void put(SysUser sysUser) {
        LOCAL.set(sysUser);
    }

    public static SysUser get() {
        return LOCAL.get();
    }

    public static void remove() {
        LOCAL.remove();
    }
}
```

### ⭐️Bean 的生命周期了解么?

1. **创建 Bean 的实例**：Bean 容器首先会找到配置文件中的 Bean 定义，然后选用适当的实例化策略（工厂方法、构造函数自动装配或者简单实例化）通过 Java 反射 API 来创建 Bean 的实例。
2. **Bean 属性赋值/填充**：为 Bean 设置相关属性和依赖，例如处理标记在字段或 Setter 方法上的 `@Autowired`、`@Value`、`@Resource` 等注解。
3. **Bean 初始化**：
   - 如果 Bean 实现了 `BeanNameAware` 接口，调用 `setBeanName()`方法，传入 Bean 的名字。
   - 如果 Bean 实现了 `BeanClassLoaderAware` 接口，调用 `setBeanClassLoader()`方法，传入 `ClassLoader`对象的实例。
   - 如果 Bean 实现了 `BeanFactoryAware` 接口，调用 `setBeanFactory()`方法，传入 `BeanFactory`对象的实例。
   - 与上面的类似，如果实现了其他 `*.Aware`接口，就调用相应的方法。
   - 如果有和加载这个 Bean 的 Spring 容器相关的 `BeanPostProcessor` 对象，执行`postProcessBeforeInitialization()` 方法
   - 如果 Bean 实现了`InitializingBean`接口，执行`afterPropertiesSet()`方法。
   - 如果 Bean 在配置文件中的定义包含 `init-method` 属性，执行指定的方法。
   - 如果有和加载这个 Bean 的 Spring 容器相关的 `BeanPostProcessor` 对象，执行`postProcessAfterInitialization()` 方法。
4. **销毁 Bean**：销毁并不是说要立马把 Bean 给销毁掉，而是把 Bean 的销毁方法先记录下来，将来需要销毁 Bean 或者销毁容器的时候，就调用这些方法去释放 Bean 所持有的资源。
   - 如果 Bean 实现了 `DisposableBean` 接口，执行 `destroy()` 方法。
   - 如果 Bean 在配置文件中的定义包含 `destroy-method` 属性，执行指定的 Bean 销毁方法。或者，也可以直接通过`@PreDestroy` 注解标记 Bean 销毁之前执行的方法。

`AbstractAutowireCapableBeanFactory` 的 `doCreateBean()` 方法中能看到依次执行了这 4 个阶段：

```java
protected Object doCreateBean(final String beanName, final RootBeanDefinition mbd, final @Nullable Object[] args)
    throws BeanCreationException {

    // 1. 创建 Bean 的实例
    BeanWrapper instanceWrapper = null;
    if (instanceWrapper == null) {
        instanceWrapper = createBeanInstance(beanName, mbd, args);
    }

    Object exposedObject = bean;
    try {
        // 2. Bean 属性赋值/填充
        populateBean(beanName, mbd, instanceWrapper);
        // 3. Bean 初始化
        exposedObject = initializeBean(beanName, exposedObject, mbd);
    }

    // 4. 销毁 Bean-注册回调接口
    try {
        registerDisposableBeanIfNecessary(beanName, bean, mbd);
    }

    return exposedObject;
}
```

`Aware` 接口能让 Bean 能拿到 Spring 容器资源。

Spring 中提供的 `Aware` 接口主要有：

1. `BeanNameAware`：注入当前 bean 对应 beanName；
2. `BeanClassLoaderAware`：注入加载当前 bean 的 ClassLoader；
3. `BeanFactoryAware`：注入当前 `BeanFactory` 容器的引用。

`BeanPostProcessor` 接口是 Spring 为修改 Bean 提供的强大扩展点。

```java
public interface BeanPostProcessor {

	// 初始化前置处理
	default Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
		return bean;
	}

	// 初始化后置处理
	default Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
		return bean;
	}

}
```

- `postProcessBeforeInitialization`：Bean 实例化、属性注入完成后，`InitializingBean#afterPropertiesSet`方法以及自定义的 `init-method` 方法之前执行；
- `postProcessAfterInitialization`：类似于上面，不过是在 `InitializingBean#afterPropertiesSet`方法以及自定义的 `init-method` 方法之后执行。

`InitializingBean` 和 `init-method` 是 Spring 为 Bean 初始化提供的扩展点。

```java
public interface InitializingBean {
 // 初始化逻辑
	void afterPropertiesSet() throws Exception;
}
```

指定 `init-method` 方法，指定初始化方法：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="demo" class="com.chaycao.Demo" init-method="init"/>

</beans>
```

**如何记忆呢？**

1. 整体上可以简单分为四步：实例化 —> 属性赋值 —> 初始化 —> 销毁。
2. 初始化这一步涉及到的步骤比较多，包含 `Aware` 接口的依赖注入、`BeanPostProcessor` 在初始化前后的处理以及 `InitializingBean` 和 `init-method` 的初始化操作。
3. 销毁这一步会注册相关销毁回调接口，最后通过`DisposableBean` 和 `destory-method` 进行销毁。

最后，再分享一张清晰的图解（图源：[如何记忆 Spring Bean 的生命周期](https://chaycao.github.io/2020/02/15/如何记忆Spring-Bean的生命周期.html)）。

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/spring-bean-lifestyle.png)

## Spring AOP

### ⭐️谈谈自己对于 AOP 的了解

AOP(Aspect-Oriented Programming:面向切面编程)能够将那些与业务无关，却为业务模块所共同调用的逻辑或责任（例如事务处理、日志管理、权限控制等）封装起来，便于减少系统的重复代码，降低模块间的耦合度，并有利于未来的可拓展性和可维护性。

Spring AOP 就是基于动态代理的，如果要代理的对象，实现了某个接口，那么 Spring AOP 会使用 **JDK Proxy**，去创建代理对象，而对于没有实现接口的对象，就无法使用 JDK Proxy 去进行代理了，这时候 Spring AOP 会使用 **Cglib** 生成一个被代理对象的子类来作为代理，如下图所示：

![SpringAOPProcess](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/230ae587a322d6e4d09510161987d346.jpeg)

当然你也可以使用 **AspectJ** ！Spring AOP 已经集成了 AspectJ ，AspectJ 应该算的上是 Java 生态系统中最完整的 AOP 框架了。

AOP 切面编程涉及到的一些专业术语：

| 术语              |                                 含义                                  |
| :---------------- | :-------------------------------------------------------------------: |
| 目标(Target)      |                             被通知的对象                              |
| 代理(Proxy)       |                 向目标对象应用通知之后创建的代理对象                  |
| 连接点(JoinPoint) |             目标对象的所属类中，定义的所有方法均为连接点              |
| 切入点(Pointcut)  | 被切面拦截 / 增强的连接点（切入点一定是连接点，连接点不一定是切入点） |
| 通知(Advice)      |      增强的逻辑 / 代码，也即拦截到目标对象的连接点之后要做的事情      |
| 切面(Aspect)      |                     切入点(Pointcut)+通知(Advice)                     |
| Weaving(织入)     |           将通知应用到目标对象，进而生成代理对象的过程动作            |

### ⭐️Spring AOP 和 AspectJ AOP 有什么区别？

| 特性           | Spring AOP                                               | AspectJ                                    |
| -------------- | -------------------------------------------------------- | ------------------------------------------ |
| **增强方式**   | 运行时增强（基于动态代理）                               | 编译时增强、类加载时增强（直接操作字节码） |
| **切入点支持** | 方法级（Spring Bean 范围内，不支持 final 和 staic 方法） | 方法级、字段、构造器、静态方法等           |
| **性能**       | 运行时依赖代理，有一定开销，切面多时性能较低             | 运行时无代理开销，性能更高                 |
| **复杂性**     | 简单，易用，适合大多数场景                               | 功能强大，但相对复杂                       |
| **使用场景**   | Spring 应用下比较简单的 AOP 需求                         | 高性能、高复杂度的 AOP 需求                |

**如何选择？**

- **功能考量**：AspectJ 支持更复杂的 AOP 场景，Spring AOP 更简单易用。如果你需要增强 `final` 方法、静态方法、字段访问、构造器调用等，或者需要在非 Spring 管理的对象上应用增强逻辑，AspectJ 是唯一的选择。
- **性能考量**：切面数量较少时两者性能差异不大，但切面较多时 AspectJ 性能更优。

**一句话总结**：简单场景优先使用 Spring AOP；复杂场景或高性能需求时，选择 AspectJ。

### ⭐️AOP 常见的通知类型有哪些？

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/aspectj-advice-types.jpg)

- **Before**（前置通知）：目标对象的方法调用之前触发
- **After** （后置通知）：目标对象的方法调用之后触发
- **AfterReturning**（返回通知）：目标对象的方法调用完成，在返回结果值之后触发
- **AfterThrowing**（异常通知）：目标对象的方法运行中抛出 / 触发异常后触发。AfterReturning 和 AfterThrowing 两者互斥。如果方法调用成功无异常，则会有返回值；如果方法抛出了异常，则不会有返回值。
- **Around** （环绕通知）：编程式控制目标对象的方法调用。环绕通知是所有通知类型中可操作范围最大的一种，因为它可以直接拿到目标对象，以及要执行的方法，所以环绕通知可以任意的在目标对象的方法调用前后搞事，甚至不调用目标对象的方法

### 多个切面的执行顺序如何控制？

1、通常使用`@Order` 注解直接定义切面顺序

```java
// 值越小优先级越高
@Order(3)
@Component
@Aspect
public class LoggingAspect implements Ordered {
```

**2、实现`Ordered` 接口重写 `getOrder` 方法。**

```java
@Component
@Aspect
public class LoggingAspect implements Ordered {

    // ....

    @Override
    public int getOrder() {
        // 返回值越小优先级越高
        return 1;
    }
}
```

## Spring MVC

### 说说自己对于 Spring MVC 了解?

MVC 是模型(Model)、视图(View)、控制器(Controller)的简写，其核心思想是通过将业务逻辑、数据、显示分离来组织代码。

![](https://oss.javaguide.cn/java-guide-blog/image-20210809181452421.png)

网上有很多人说 MVC 不是设计模式，只是软件设计规范，我个人更倾向于 MVC 同样是众多设计模式中的一种。**[java-design-patterns](https://github.com/iluwatar/java-design-patterns)** 项目中就有关于 MVC 的相关介绍。

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/159b3d3e70dd45e6afa81bf06d09264e.png)

想要真正理解 Spring MVC，我们先来看看 Model 1 和 Model 2 这两个没有 Spring MVC 的时代。

**Model 1 时代**

很多学 Java 后端比较晚的朋友可能并没有接触过 Model 1 时代下的 JavaWeb 应用开发。在 Model1 模式下，整个 Web 应用几乎全部用 JSP 页面组成，只用少量的 JavaBean 来处理数据库连接、访问等操作。

这个模式下 JSP 即是控制层（Controller）又是表现层（View）。显而易见，这种模式存在很多问题。比如控制逻辑和表现逻辑混杂在一起，导致代码重用率极低；再比如前端和后端相互依赖，难以进行测试维护并且开发效率极低。

![mvc-mode1](https://oss.javaguide.cn/java-guide-blog/mvc-mode1.png)

**Model 2 时代**

学过 Servlet 并做过相关 Demo 的朋友应该了解“Java Bean(Model)+ JSP（View）+Servlet（Controller） ”这种开发模式，这就是早期的 JavaWeb MVC 开发模式。

- Model:系统涉及的数据，也就是 dao 和 bean。
- View：展示模型中的数据，只是用来展示。
- Controller：接受用户请求，并将请求发送至 Model，最后返回数据给 JSP 并展示给用户

![](https://oss.javaguide.cn/java-guide-blog/mvc-model2.png)

Model2 模式下还存在很多问题，Model2 的抽象和封装程度还远远不够，使用 Model2 进行开发时不可避免地会重复造轮子，这就大大降低了程序的可维护性和复用性。

于是，很多 JavaWeb 开发相关的 MVC 框架应运而生比如 Struts2，但是 Struts2 比较笨重。

**Spring MVC 时代**

随着 Spring 轻量级开发框架的流行，Spring 生态圈出现了 Spring MVC 框架， Spring MVC 是当前最优秀的 MVC 框架。相比于 Struts2 ， Spring MVC 使用更加简单和方便，开发效率更高，并且 Spring MVC 运行速度更快。

MVC 是一种设计模式，Spring MVC 是一款很优秀的 MVC 框架。Spring MVC 可以帮助我们进行更简洁的 Web 层的开发，并且它天生与 Spring 框架集成。Spring MVC 下我们一般把后端项目分为 Service 层（处理业务）、Dao 层（数据库操作）、Entity 层（实体类）、Controller 层(控制层，返回数据给前台页面)。

### Spring MVC 的核心组件有哪些？

记住了下面这些组件，也就记住了 SpringMVC 的工作原理。

- **`DispatcherServlet`**：**核心的中央处理器**，负责接收请求、分发，并给予客户端响应。
- **`HandlerMapping`**：**处理器映射器**，根据 URL 去匹配查找能处理的 `Handler` ，并会将请求涉及到的拦截器和 `Handler` 一起封装。
- **`HandlerAdapter`**：**处理器适配器**，根据 `HandlerMapping` 找到的 `Handler` ，适配执行对应的 `Handler`；
- **`Handler`**：**请求处理器**，处理实际请求的处理器。
- **`ViewResolver`**：**视图解析器**，根据 `Handler` 返回的逻辑视图 / 视图，解析并渲染真正的视图，并传递给 `DispatcherServlet` 响应客户端

### ⭐️SpringMVC 工作原理了解吗?

**Spring MVC 原理如下图所示：**

> SpringMVC 工作原理的图解我没有自己画，直接图省事在网上找了一个非常清晰直观的，原出处不明。

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/de6d2b213f112297298f3e223bf08f28.png)

**流程说明（重要）：**

1. 客户端（浏览器）发送请求， `DispatcherServlet`拦截请求。
2. `DispatcherServlet` 根据请求信息调用 `HandlerMapping` 。`HandlerMapping` 根据 URL 去匹配查找能处理的 `Handler`（也就是我们平常说的 `Controller` 控制器） ，并会将请求涉及到的拦截器和 `Handler` 一起封装。
3. `DispatcherServlet` 调用 `HandlerAdapter`适配器执行 `Handler` 。
4. `Handler` 完成对用户请求的处理后，会返回一个 `ModelAndView` 对象给`DispatcherServlet`，`ModelAndView` 顾名思义，包含了数据模型以及相应的视图的信息。`Model` 是返回的数据对象，`View` 是个逻辑上的 `View`。
5. `ViewResolver` 会根据逻辑 `View` 查找实际的 `View`。
6. `DispaterServlet` 把返回的 `Model` 传给 `View`（视图渲染）。
7. 把 `View` 返回给请求者（浏览器）

上述流程是传统开发模式（JSP，Thymeleaf 等）的工作原理。然而现在主流的开发方式是前后端分离，这种情况下 Spring MVC 的 `View` 概念发生了一些变化。由于 `View` 通常由前端框架（Vue, React 等）来处理，后端不再负责渲染页面，而是只负责提供数据，因此：

- 前后端分离时，后端通常不再返回具体的视图，而是返回**纯数据**（通常是 JSON 格式），由前端负责渲染和展示。
- `View` 的部分在前后端分离的场景下往往不需要设置，Spring MVC 的控制器方法只需要返回数据，不再返回 `ModelAndView`，而是直接返回数据，Spring 会自动将其转换为 JSON 格式。相应的，`ViewResolver` 也将不再被使用。

怎么做到呢？

- 使用 `@RestController` 注解代替传统的 `@Controller` 注解，这样所有方法默认会返回 JSON 格式的数据，而不是试图解析视图。
- 如果你使用的是 `@Controller`，可以结合 `@ResponseBody` 注解来返回 JSON。

### 统一异常处理怎么做？

推荐使用注解的方式统一异常处理，具体会使用到 `@ControllerAdvice` + `@ExceptionHandler` 这两个注解 。

```java
@ControllerAdvice
@ResponseBody
public class GlobalExceptionHandler {

    @ExceptionHandler(BaseException.class)
    public ResponseEntity<?> handleAppException(BaseException ex, HttpServletRequest request) {
      //......
    }

    @ExceptionHandler(value = ResourceNotFoundException.class)
    public ResponseEntity<ErrorReponse> handleResourceNotFoundException(ResourceNotFoundException ex, HttpServletRequest request) {
      //......
    }
}
```

这种异常处理方式并不是给 `Controller` 创建 AOP 代理。`Controller` 方法抛出异常后，Spring MVC 会通过 `HandlerExceptionResolver` 处理链查找能够处理该异常的 `@ExceptionHandler` 方法。

`ExceptionHandlerMethodResolver` 中 `getMappedMethod` 方法决定了异常具体被哪个被 `@ExceptionHandler` 注解修饰的方法处理异常。

```java
@Nullable
  private Method getMappedMethod(Class<? extends Throwable> exceptionType) {
    List<Class<? extends Throwable>> matches = new ArrayList<>();
    //找到可以处理的所有异常信息。mappedMethods 中存放了异常和处理异常的方法的对应关系
    for (Class<? extends Throwable> mappedException : this.mappedMethods.keySet()) {
      if (mappedException.isAssignableFrom(exceptionType)) {
        matches.add(mappedException);
      }
    }
    // 不为空说明有方法处理异常
    if (!matches.isEmpty()) {
      // 按照匹配程度从小到大排序
      matches.sort(new ExceptionDepthComparator(exceptionType));
      // 返回处理异常的方法
      return this.mappedMethods.get(matches.get(0));
    }
    else {
      return null;
    }
  }
```

从源代码看出：**`getMappedMethod()`会首先找到可以匹配处理异常的所有方法信息，然后对其进行从小到大的排序，最后取最小的那一个匹配的方法(即匹配度最高的那个)。**

## Spring 框架中用到了哪些设计模式？

> 关于下面这些设计模式的详细介绍，可以看我写的 [Spring 中的设计模式详解](https://javaguide.cn/系统设计/框架/spring/spring-design-patterns-summary.html) 这篇文章。

- **工厂设计模式** : Spring 使用工厂模式通过 `BeanFactory`、`ApplicationContext` 创建 bean 对象。
- **代理设计模式** : Spring AOP 功能的实现。
- **单例设计模式** : Spring 中的 Bean 默认都是单例的。
- **模板方法模式** : Spring 中 `jdbcTemplate`、`hibernateTemplate` 等以 Template 结尾的对数据库操作的类，它们就使用到了模板模式。
- **包装器设计模式** : 我们的项目需要连接多个数据库，而且不同的客户在每次访问中根据需要会去访问不同的数据库。这种模式让我们可以根据客户的需求能够动态切换不同的数据源。
- **观察者模式:** Spring 事件驱动模型就是观察者模式很经典的一个应用。
- **适配器模式** : Spring AOP 的增强或通知(Advice)使用到了适配器模式、spring MVC 中也是用到了适配器模式适配`Controller`。
- ……

## ⭐️Spring 的循环依赖

### Spring 循环依赖了解吗，怎么解决？

循环依赖是指 Bean 对象循环引用，是两个或多个 Bean 之间相互持有对方的引用，例如 CircularDependencyA → CircularDependencyB → CircularDependencyA。

```java
@Component
public class CircularDependencyA {
    @Autowired
    private CircularDependencyB circB;
}

@Component
public class CircularDependencyB {
    @Autowired
    private CircularDependencyA circA;
}
```

单个对象的自我依赖也会出现循环依赖，但这种概率极低，属于是代码编写错误。

```java
@Component
public class CircularDependencyA {
    @Autowired
    private CircularDependencyA circA;
}
```

Spring 框架可以通过三级缓存解决部分单例 Bean 的 Setter/字段注入循环依赖。构造器循环依赖、原型 Bean 循环依赖等场景不能依靠该机制解决。

Spring 中的三级缓存其实就是三个 Map，如下：

```java
// 一级缓存
/** Cache of singleton objects: bean name to bean instance. */
private final Map<String, Object> singletonObjects = new ConcurrentHashMap<>(256);

// 二级缓存
/** Cache of early singleton objects: bean name to bean instance. */
private final Map<String, Object> earlySingletonObjects = new HashMap<>(16);

// 三级缓存
/** Cache of singleton factories: bean name to ObjectFactory. */
private final Map<String, ObjectFactory<?>> singletonFactories = new HashMap<>(16);
```

简单来说，Spring 的三级缓存包括：

1. **一级缓存（singletonObjects）**：存放最终形态的 Bean（已经实例化、属性填充、初始化），单例池，为“Spring 的单例属性”⽽⽣。一般情况我们获取 Bean 都是从这里获取的，但是并不是所有的 Bean 都在单例池里面，例如原型 Bean 就不在里面。
2. **二级缓存（earlySingletonObjects）**：存放过渡 Bean（半成品，尚未属性填充），也就是三级缓存中`ObjectFactory`产生的对象，与三级缓存配合使用的，可以防止 AOP 的情况下，每次调用`ObjectFactory#getObject()`都是会产生新的代理对象的。
3. **三级缓存（singletonFactories）**：存放`ObjectFactory`，`ObjectFactory`的`getObject()`方法（最终调用的是`getEarlyBeanReference()`方法）可以生成原始 Bean 对象或者代理对象（如果 Bean 被 AOP 切面代理）。三级缓存只会对单例 Bean 生效。

接下来说一下 Spring 创建 Bean 的流程：

1. 先去 **一级缓存 `singletonObjects`** 中获取，存在就返回；
2. 如果不存在或者对象正在创建中，于是去 **二级缓存 `earlySingletonObjects`** 中获取；
3. 如果还没有获取到，就去 **三级缓存 `singletonFactories`** 中获取，通过执行 `ObjectFacotry` 的 `getObject()` 就可以获取该对象，获取成功之后，从三级缓存移除，并将该对象加入到二级缓存中。

在三级缓存中存储的是 `ObjectFacoty` ：

```java
public interface ObjectFactory<T> {
    T getObject() throws BeansException;
}
```

Spring 在创建 Bean 的时候，如果允许循环依赖的话，Spring 就会将刚刚实例化完成，但是属性还没有初始化完的 Bean 对象给提前暴露出去，这里通过 `addSingletonFactory` 方法，向三级缓存中添加一个 `ObjectFactory` 对象：

```java
// AbstractAutowireCapableBeanFactory # doCreateBean #
public abstract class AbstractAutowireCapableBeanFactory ... {
	protected Object doCreateBean(...) {
        //...

        // 支撑循环依赖：将 ()->getEarlyBeanReference 作为一个 ObjectFactory 对象的 getObject() 方法加入到三级缓存中
		addSingletonFactory(beanName, () -> getEarlyBeanReference(beanName, mbd, bean));
    }
}
```

那么上边在说 Spring 创建 Bean 的流程时说了，如果一级缓存、二级缓存都取不到对象时，会去三级缓存中通过 `ObjectFactory` 的 `getObject` 方法获取对象。

```java
class A {
    // 使用了 B
    private B b;
}
class B {
    // 使用了 A
    private A a;
}
```

以上面的循环依赖代码为例，整个解决循环依赖的流程如下：

- 当 Spring 创建 A 之后，发现 A 依赖了 B ，又去创建 B，B 依赖了 A ，又去创建 A；
- 在 B 创建 A 的时候，那么此时 A 就发生了循环依赖，由于 A 此时还没有初始化完成，因此在 **一二级缓存** 中肯定没有 A；
- 那么此时就去三级缓存中调用 `getObject()` 方法去获取 A 的 **前期暴露的对象** ，也就是调用上边加入的 `getEarlyBeanReference()` 方法，生成一个 A 的 **前期暴露对象**；
- 然后就将这个 `ObjectFactory` 从三级缓存中移除，并且将前期暴露对象放入到二级缓存中，那么 B 就将这个前期暴露对象注入到依赖，来支持循环依赖。

**只用两级缓存够吗？** 在没有 AOP 的情况下，确实可以只使用一级和二级缓存来解决循环依赖问题。但是，当涉及到 AOP 时，三级缓存就显得非常重要了，因为它确保了即使在 Bean 的创建过程中有多次对早期引用的请求，也始终只返回同一个代理对象，从而避免了同一个 Bean 有多个代理对象的问题。

**最后总结一下 Spring 如何解决三级缓存**：

在三级缓存这一块，主要记一下 Spring 是如何支持循环依赖的即可，也就是如果发生循环依赖的话，就去 **三级缓存 `singletonFactories`** 中拿到三级缓存中存储的 `ObjectFactory` 并调用它的 `getObject()` 方法来获取这个循环依赖对象的前期暴露对象（虽然还没初始化完成，但是可以拿到该对象在堆中的存储地址了），并且将这个前期暴露对象放到二级缓存中，这样在循环依赖时，就不会重复初始化了！

不过，这种机制也有一些缺点，比如增加了内存开销（需要维护三级缓存，也就是三个 Map），降低了性能（需要进行多次检查和转换）。它只适用于部分单例 Bean 的 Setter/字段注入循环依赖，非单例 Bean、构造器循环依赖等场景仍然无法通过三级缓存解决。

### @Lazy 能解决循环依赖吗？

`@Lazy` 用来标识类是否需要懒加载/延迟加载，可以作用在类上、方法上、构造器上、方法参数上、成员变量中。

Spring Boot 2.2 新增了**全局懒加载属性**，开启后全局 bean 被设置为懒加载，需要时再去创建。

配置文件配置全局懒加载：

```properties
#默认false
spring.main.lazy-initialization=true
```

编码的方式设置全局懒加载：

```java
SpringApplication springApplication=new SpringApplication(Start.class);
springApplication.setLazyInitialization(true);
springApplication.run(args);
```

如非必要，尽量不要用全局懒加载。全局懒加载会让 Bean 第一次使用的时候加载会变慢，并且它会延迟应用程序问题的发现（当 Bean 被初始化时，问题才会出现）。

如果一个 Bean 没有被标记为懒加载，那么它会在 Spring IoC 容器启动的过程中被创建和初始化。如果一个 Bean 被标记为懒加载，那么它不会在 Spring IoC 容器启动时立即实例化，而是在第一次被请求时才创建。这可以帮助减少应用启动时的初始化时间，也可以用来解决循环依赖问题。

循环依赖问题是如何通过`@Lazy` 解决的呢？这里举一个例子，比如说有两个 Bean，A 和 B，他们之间发生了循环依赖，可以在 A 对 B 的注入点上添加 `@Lazy`，例如构造参数 `A(@Lazy B b)`。此时延迟解析的是依赖 B，而不是简单地把 `@Lazy` 标在 A 的构造器或类型上。

- 首先 Spring 会去创建 A 的 Bean，创建时需要注入 B 的属性；
- 由于在 A 对 B 的注入点上标注了 `@Lazy`，因此 Spring 会创建一个 B 的延迟解析代理对象，并将代理对象注入 A；
- 之后开始执行 B 的实例化、初始化，在注入 B 中的 A 属性时，此时 A 已经创建完毕了，就可以将 A 给注入进去。

从上面的加载流程可以看出： `@Lazy` 解决循环依赖的关键点在于代理对象的使用。

- **没有 `@Lazy` 的情况下**：在 Spring 容器初始化 `A` 时会立即尝试创建 `B`，而在创建 `B` 的过程中又会尝试创建 `A`，最终导致循环依赖（即无限递归，最终抛出异常）。
- **使用 `@Lazy` 的情况下**：Spring 不会立即创建 `B`，而是会注入一个 `B` 的代理对象。由于此时 `B` 仍未被真正初始化，`A` 的初始化可以顺利完成。等到 `A` 实例实际调用 `B` 的方法时，代理对象才会触发 `B` 的真正初始化。

`@Lazy` 注入点代理能够在一定程度上打破循环依赖链，包括某些构造器注入场景。但这并不是从设计上消除循环依赖，复杂依赖关系下也可能产生更隐蔽的初始化问题，因此最佳实践仍然是尽量避免设计上的循环依赖。

### SpringBoot 允许循环依赖发生么？

SpringBoot 2.6.x 以前是默认允许循环依赖的，也就是说你的代码出现了循环依赖问题，一般情况下也不会报错。SpringBoot 2.6.x 以后官方不再推荐编写存在循环依赖的代码，建议开发者自己写代码的时候去减少不必要的互相依赖。这其实也是我们最应该去做的，循环依赖本身就是一种设计缺陷，我们不应该过度依赖 Spring 而忽视了编码的规范和质量，说不定未来某个 SpringBoot 版本就彻底禁止循环依赖的代码了。

SpringBoot 2.6.x 以后，如果你不想重构循环依赖的代码的话，也可以采用下面这些方法：

- 在全局配置文件中设置允许循环依赖存在：`spring.main.allow-circular-references=true`。最简单粗暴的方式，不太推荐。
- 在导致循环依赖的 Bean 上添加 `@Lazy` 注解，这是一种比较推荐的方式。`@Lazy` 用来标识类是否需要懒加载/延迟加载，可以作用在类上、方法上、构造器上、方法参数上、成员变量中。
- ……

## ⭐️Spring 事务

关于 Spring 事务的详细介绍，可以看我写的 [Spring 事务详解](https://javaguide.cn/系统设计/框架/spring/spring-transaction.html) 这篇文章。

### Spring 管理事务的方式有几种？

- **编程式事务**：在代码中硬编码(在分布式系统中推荐使用) : 通过 `TransactionTemplate`或者 `TransactionManager` 手动管理事务，事务范围过大会出现事务未提交导致超时，因此事务要比锁的粒度更小。
- **声明式事务**：在 XML 配置文件中配置或者直接基于注解（单体应用或者简单业务系统推荐使用） : 实际是通过 AOP 实现（基于`@Transactional` 的全注解方式使用最多）

### Spring 事务中哪几种事务传播行为?

**事务传播行为是为了解决业务层方法之间互相调用的事务问题**。

当事务方法被另一个事务方法调用时，必须指定事务应该如何传播。例如：方法可能继续在现有事务中运行，也可能开启一个新事务，并在自己的事务中运行。

正确的事务传播行为可能的值如下:

**1.`TransactionDefinition.PROPAGATION_REQUIRED`**

使用的最多的一个事务传播行为，我们平时经常使用的`@Transactional`注解默认使用就是这个事务传播行为。如果当前存在事务，则加入该事务；如果当前没有事务，则创建一个新的事务。

**`2.TransactionDefinition.PROPAGATION_REQUIRES_NEW`**

创建一个新的事务，如果当前存在事务，则把当前事务挂起。也就是说不管外部方法是否开启事务，`Propagation.REQUIRES_NEW`修饰的内部方法会新开启自己的事务，且开启的事务相互独立，互不干扰。

**3.`TransactionDefinition.PROPAGATION_NESTED`**

如果当前存在事务，则创建一个事务作为当前事务的嵌套事务来运行；如果当前没有事务，则该取值等价于`TransactionDefinition.PROPAGATION_REQUIRED`。

**4.`TransactionDefinition.PROPAGATION_MANDATORY`**

如果当前存在事务，则加入该事务；如果当前没有事务，则抛出异常。（mandatory：强制性）

这个使用的很少。

另外 3 种事务传播行为也是合法配置，需要根据是否存在外部事务来理解：

- **`TransactionDefinition.PROPAGATION_SUPPORTS`**: 如果当前存在事务，则加入该事务；如果当前没有事务，则以非事务的方式继续运行。
- **`TransactionDefinition.PROPAGATION_NOT_SUPPORTED`**: 以非事务方式运行，如果当前存在事务，则把当前事务挂起。
- **`TransactionDefinition.PROPAGATION_NEVER`**: 以非事务方式运行，如果当前存在事务，则抛出异常。

### Spring 事务中的隔离级别有哪几种?

和事务传播行为这块一样，为了方便使用，Spring 也相应地定义了一个枚举类：`Isolation`

```java
public enum Isolation {

    DEFAULT(TransactionDefinition.ISOLATION_DEFAULT),
    READ_UNCOMMITTED(TransactionDefinition.ISOLATION_READ_UNCOMMITTED),
    READ_COMMITTED(TransactionDefinition.ISOLATION_READ_COMMITTED),
    REPEATABLE_READ(TransactionDefinition.ISOLATION_REPEATABLE_READ),
    SERIALIZABLE(TransactionDefinition.ISOLATION_SERIALIZABLE);

    private final int value;

    Isolation(int value) {
        this.value = value;
    }

    public int value() {
        return this.value;
    }

}
```

下面我依次对每一种事务隔离级别进行介绍：

- **`TransactionDefinition.ISOLATION_DEFAULT`** :使用后端数据库默认的隔离级别，MySQL 默认采用的 `REPEATABLE_READ` 隔离级别 Oracle 默认采用的 `READ_COMMITTED` 隔离级别.
- **`TransactionDefinition.ISOLATION_READ_UNCOMMITTED`** :最低的隔离级别，使用这个隔离级别很少，因为它允许读取尚未提交的数据变更，**可能会导致脏读、幻读或不可重复读**
- **`TransactionDefinition.ISOLATION_READ_COMMITTED`** : 允许读取并发事务已经提交的数据，**可以阻止脏读，但是幻读或不可重复读仍有可能发生**
- **`TransactionDefinition.ISOLATION_REPEATABLE_READ`** : 对同一字段的多次读取结果都是一致的，除非数据是被本身事务自己所修改，**可以阻止脏读和不可重复读，但幻读仍有可能发生。**
- **`TransactionDefinition.ISOLATION_SERIALIZABLE`** : 最高的隔离级别，完全服从 ACID 的隔离级别。所有的事务依次逐个执行，这样事务之间就完全不可能产生干扰，也就是说，**该级别可以防止脏读、不可重复读以及幻读**。但是这将严重影响程序的性能。通常情况下也不会用到该级别。

### @Transactional(rollbackFor = Exception.class)注解了解吗？

`Exception` 分为运行时异常 `RuntimeException` 和非运行时异常。事务管理对于企业应用来说是至关重要的，即使出现异常情况，它也可以保证数据的一致性。

当 `@Transactional` 注解作用于类上时，该类的所有 public 方法将都具有该类型的事务属性，同时，我们也可以在方法级别使用该标注来覆盖类级别的定义。

`@Transactional` 注解默认回滚策略是只有在遇到`RuntimeException`(运行时异常) 或者 `Error` 时才会回滚事务，而不会回滚 `Checked Exception`（受检查异常）。这是因为 Spring 认为`RuntimeException`和 Error 是不可预期的错误，而受检异常是可预期的错误，可以通过业务逻辑来处理。

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/spring-transactional-rollbackfor.png)

如果想要修改默认的回滚策略，可以使用 `@Transactional` 注解的 `rollbackFor` 和 `noRollbackFor` 属性来指定哪些异常需要回滚，哪些异常不需要回滚。例如，如果想要让所有的异常都回滚事务，可以使用如下的注解：

```java
@Transactional(rollbackFor = Exception.class)
public void someMethod() {
// some business logic
}
```

如果想要让某些特定的异常不回滚事务，可以使用如下的注解：

```java
@Transactional(noRollbackFor = CustomException.class)
public void someMethod() {
// some business logic
}
```

## Spring Data JPA

JPA 重要的是实战，这里仅对小部分知识点进行总结。

### 如何使用 JPA 在数据库中非持久化一个字段？

假如我们有下面一个类：

```java
@Entity(name="USER")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private Long id;

    @Column(name="USER_NAME")
    private String userName;

    @Column(name="PASSWORD")
    private String password;

    private String secrect;

}
```

如果我们想让`secrect` 这个字段不被持久化，也就是不被数据库存储怎么办？我们可以采用下面几种方法：

```java
static String transient1; // not persistent because of static
final String transient2 = "Satish"; // not persistent because of final
transient String transient3; // not persistent because of transient
@Transient
String transient4; // not persistent because of @Transient
```

一般使用后面两种方式比较多，我个人使用注解的方式比较多。

### JPA 的审计功能是做什么的？有什么用？

审计功能主要是帮助我们记录数据库操作的具体行为比如某条记录是谁创建的、什么时间创建的、最后修改人是谁、最后修改时间是什么时候。

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
@MappedSuperclass
@EntityListeners(value = AuditingEntityListener.class)
public abstract class AbstractAuditBase {

    @CreatedDate
    @Column(updatable = false)
    @JsonIgnore
    private Instant createdAt;

    @LastModifiedDate
    @JsonIgnore
    private Instant updatedAt;

    @CreatedBy
    @Column(updatable = false)
    @JsonIgnore
    private String createdBy;

    @LastModifiedBy
    @JsonIgnore
    private String updatedBy;
}
```

- `@CreatedDate`: 表示该字段为创建时间字段，在这个实体被 insert 的时候，会设置值

- `@CreatedBy` :表示该字段为创建人，在这个实体被 insert 的时候，会设置值

  `@LastModifiedDate`、`@LastModifiedBy`同理。

### 实体之间的关联关系注解有哪些？

- `@OneToOne` : 一对一。
- `@ManyToMany`：多对多。
- `@OneToMany` : 一对多。
- `@ManyToOne`：多对一。

利用 `@ManyToOne` 和 `@OneToMany` 也可以表达多对多的关联关系。

## Spring Security

Spring Security 重要的是实战，这里仅对小部分知识点进行总结。

### 有哪些控制请求访问权限的方法？

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/image-20220728201854641.png)

- `permitAll()`：无条件允许任何形式访问，不管你登录还是没有登录。
- `anonymous()`：允许匿名访问，也就是没有登录才可以访问。
- `denyAll()`：无条件决绝任何形式的访问。
- `authenticated()`：只允许已认证的用户访问。
- `fullyAuthenticated()`：只允许完整认证的用户访问，不接受匿名认证或 remember-me 认证。
- `hasRole(String)` : 只允许指定的角色访问。
- `hasAnyRole(String)` : 指定一个或者多个角色，满足其一的用户即可访问。
- `hasAuthority(String)`：只允许具有指定权限的用户访问
- `hasAnyAuthority(String)`：指定一个或者多个权限，满足其一的用户即可访问。
- `hasIpAddress(String)` : 只允许指定 ip 的用户访问。

### hasRole 和 hasAuthority 有区别吗？

可以看看松哥的这篇文章：[Spring Security 中的 hasRole 和 hasAuthority 有区别吗？](https://mp.weixin.qq.com/s/GTNOa2k9_n_H0w24upClRw)，介绍的比较详细。

### ⭐️如何对密码进行加密？

如果我们需要保存密码这类敏感数据到数据库，需要先通过自适应单向哈希函数编码再保存，而不是使用可逆加密。

Spring Security 提供了多种密码编码算法的实现，开箱即用。这些实现类的接口是 `PasswordEncoder`；如果需要自定义密码编码方案，也需要实现 `PasswordEncoder` 接口。

`PasswordEncoder` 接口有 `encode()` 和 `matches()` 两个必须实现的抽象方法，以及一个可以按需覆盖的默认方法 `upgradeEncoding()`。

```java
public interface PasswordEncoder {
    // 对原始密码进行单向编码
    String encode(CharSequence var1);
    // 比对原始密码和数据库中保存的密码
    boolean matches(CharSequence var1, String var2);
    // 判断已编码密码是否需要升级编码，默认返回 false
    default boolean upgradeEncoding(String encodedPassword) {
        return false;
    }
}
```

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/image-20220728183540954.png)

官方推荐使用可调节工作因子的自适应单向函数，并根据系统性能调优验证耗时，例如 bcrypt、PBKDF2、scrypt 或 Argon2。

### 如何优雅更换系统使用的加密算法？

如果我们在开发过程中，突然发现现有的加密算法无法满足我们的需求，需要更换成另外一个加密算法，这个时候应该怎么办呢？

推荐的做法是通过 `DelegatingPasswordEncoder` 兼容多种不同的密码加密方案，以适应不同的业务需求。

从名字也能看出来，`DelegatingPasswordEncoder` 其实就是一个代理类，并非是一种全新的加密算法，它做的事情就是代理上面提到的加密算法实现类。在 Spring Security 5.0 之后，默认就是基于 `DelegatingPasswordEncoder` 进行密码加密的。

## 参考

- 《Spring 技术内幕》
- 《从零开始深入学习 Spring》：<https://juejin.cn/book/6857911863016390663>
- <http://www.cnblogs.com/wmyskxz/p/8820371.html>
- <https://www.journaldev.com/2696/spring-interview-questions-and-answers>
- <https://www.edureka.co/blog/面试题/spring-interview-questions/>
- <https://www.cnblogs.com/clwydjgs/p/9317849.html>
- <https://howtodoinjava.com/面试题/top-spring-interview-questions-with-answers/>
- <http://www.tomaszezula.com/2014/02/09/spring-series-part-5-component-vs-bean/>
- <https://stackoverflow.com/questions/34172888/difference-between-bean-and-autowired>

<!-- @include: @article-footer.snippet.md -->

