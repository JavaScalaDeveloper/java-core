# SSM 面试笔记

Spring / SpringMVC / MyBatis。事务与循环依赖为高频，先抓结论再记细节。

---

# Spring

> 下面按 **资深面试官追问** 深度写：不只「会不会」，还要「源码怎么走、边界在哪、和 JDBC/AOP 如何咬合」。

---

## 事务传播行为（propagation）

| 传播 | 行为 | 典型场景 |
|------|------|----------|
| **REQUIRED**（默认） | 有则加入，无则新建 | 普通增删改 |
| **REQUIRES_NEW** | 总是新事务，外层挂起 | 独立日志、审计 |
| **NESTED** | 有则嵌套（保存点），无则同 REQUIRED | 局部可回滚 |
| **SUPPORTS** | 有则加入，无则非事务 | 只读查询 |
| **NOT_SUPPORTED** | 非事务执行，有则挂起 | 不需要事务 |
| **MANDATORY** | 必须已有事务，否则异常 | 强制外层开事务 |
| **NEVER** | 必须无事务，否则异常 | 禁止事务中执行 |

### 追问：NESTED 和 REQUIRES_NEW 在连接/回滚上差在哪？

| | REQUIRES_NEW | NESTED |
|--|--------------|--------|
| 物理事务 | **新连接/新事务**（外层挂起） | **同一连接**，JDBC Savepoint |
| 内层提交 | 真正 commit，外层回滚 **滚不掉** 已提交内层 | 只是释放保存点；最终随外层 commit |
| 内层回滚 | 只滚内层 | 回滚到保存点，外层还可继续 |
| 支持 | 普遍 | 依赖 `DataSourceTransactionManager` + JDBC 保存点；部分 JPA 场景行为不同 |

**坑：** 内层 `REQUIRES_NEW` 已成功写库，外层再抛错 → 内层数据还在，易出现「半成功」业务，要靠补偿或调整传播。

### 追问：挂起（suspend）时 ThreadLocal 里发生了什么？

Spring 用 `TransactionSynchronizationManager`（ThreadLocal）绑定：

- 当前 `Connection` / `EntityManager`
- 同步回调 `TransactionSynchronization`
- 事务名、只读、隔离级别等资源

`REQUIRES_NEW` / `NOT_SUPPORTED`：**挂起** = 把当前资源从 ThreadLocal 摘下压栈，新事务绑新资源；结束后 **恢复** 外层。  
所以事务是 **线程绑定** 的 → 换线程不会自动带过去（`@Async` 要小心）。

---

## 父子方法与 @Transactional

| 场景 | 结果 |
|------|------|
| 外层有事务，内层无注解，异常冒泡 | **整段回滚**（同一事务） |
| 外层无事务，内层有注解 | 仅内层事务 |
| **this 自调用** | 内层注解常 **失效** |
| 内层 catch 不抛 | 默认 **不回滚**（除非 setRollbackOnly） |

### 追问：内层抛错被外层 catch，事务还会滚吗？

会进入「**rollback-only**」标记场景：

1. 内层与外层同属 REQUIRED 大事务，内层抛错被事务拦截器标记 `rollbackOnly`。  
2. 外层 catch 住，方法「正常返回」。  
3. 提交时发现 rollback-only → 抛 `UnexpectedRollbackException`，**仍然回滚**。  

**不会**出现「外层以为成功却提交」——除非你根本没走代理 / 异常类型不触发回滚。

---

## Spring 事务失效的场景及解决（含深挖）

### 1. 非 public

代理模式下 Spring 对 `@Transactional` 的基础设施 Advisor 通常只拦 **public**。  
**解决：** 改 public；或 `mode = AdviceMode.ASPECTJ` 编译/加载时织入（能拦 private，运维成本高）。

### 2. 同类 this 自调用

```text
a() 有事务 → this.b() 也有事务  ⇒  b 的传播/开关事务不生效
```

**解决：** 拆 Bean；`@Lazy` 自注入代理；`AopContext.currentProxy()`（`exposeProxy=true`）；AspectJ。

**追问：自注入会不会又循环依赖？**  
同类自依赖是「自己依赖自己」的特殊环：单例 + `@Lazy`/`@Autowired` 自身通常能起来；仍建议拆模块更清晰。

### 3. 异常类型 / 被吞

| 情况 | 默认 |
|------|------|
| RuntimeException / Error | 回滚 |
| 受检 Exception | **不回滚** |
| catch 后不抛 | **不回滚** |

**解决：** `rollbackFor`；`setRollbackOnly()`；再抛出。  
**追问：** `rollbackFor` 与 `noRollbackFor` 同时匹配时以更具体规则为准，配置要避免打架。

### 4. 传播 / 管理器 / 引擎 / 异步

传播用错、未托管、`transactionManager` 名字错、MyISAM、`@Async` 新线程无绑定 —— 见上表解决。

### 5. 深挖：只读事务、超时、隔离级别

| 属性 | 深问点 |
|------|--------|
| `readOnly=true` | 给 ORM/驱动提示；**不保证** DB 拒绝写；可优化 flush；写操作仍可能成功 |
| `timeout` | 到点标记回滚；看具体 TM 实现 |
| `isolation` | 改隔离可能 **不能** 在已存在事务上中途改；REQUIRED 加入外层时用的是外层隔离 |

### 6. 深挖：多数据源事务

单 `@Transactional` 只管 **一个** `PlatformTransactionManager`。  
跨库要：`ChainedTransactionManager`（旧）、**JTA/Atomikos**、或业务层 TCC/Saga/本地消息表——Spring 注解 **不是** 分布式事务银弹。

### 失效速记

| 原因 | 解决 |
|------|------|
| 非 public / 自调用 / 无代理 | public、拆 Bean、走代理 |
| 异常类型/被吞 | rollbackFor / setRollbackOnly |
| 传播与多 TM | 核对边界与 Bean 名 |
| 跨线程 | 事务边界放在异步之前或各自独立开事务 |

---

## @Transactional 实现链路（源码向口述）

```text
@EnableTransactionManagement
  → 注册 InfrastructureAdvisorAutoProxyCreator / AnnotationTransactionAttributeSource
  → Bean 初始化后包装成 AOP 代理（TransactionInterceptor）

方法调用：
  TransactionInterceptor.invoke
    → 解析 @Transactional（类/方法，方法优先）
    → AbstractPlatformTransactionManager.getTransaction（传播决策）
    → 绑定 Connection 到 TransactionSynchronizationManager
    → proceed 业务
    → commit / rollback（含 rollback-only 检查）
```

| 点 | 说明 |
|----|------|
| JDK vs CGLIB | 有接口且允许时 JDK 代理；否则 CGLIB 子类；`final` 方法 CGLIB **拦不住** |
| 注解放哪 | 建议放在 **实现类方法**；仅标接口在代理模式下部分场景不生效（经典坑） |
| 连接从哪来 | `DataSourceUtils.getConnection` 与事务同步，保证 DAO 与事务同一连接 |

**编程式：** `TransactionTemplate.execute` —— 无代理问题，适合框架级代码。

---

## 循环依赖：三级缓存与解不了的环（深挖）

### 能解的前提

单例 + **构造完成后再注入**（Setter/字段）→ 可提前暴露「半成品/早期引用」。

### 三级缓存职责

```text
singletonObjects       // L1 成品
earlySingletonObjects  // L2 早期暴露的对象（原始或已是代理）
singletonFactories     // L3 ObjectFactory：按需 create early ref（可走 getEarlyBeanReference）
```

### 标准互依流程（A ↔ B）

略（见前：A 曝 L3 → 建 B → B 要 A 时从 L3 取早期引用进 L2 → B 成品入 L1 → A 完成入 L1）。

### 追问 1：为什么必须三级？二级不够吗？

若只有二级、一开始就把原始 A 放进去：

- A 稍后被 `BeanPostProcessor` 升成 **事务/AOP 代理**；  
- B 手里却握着 **原始 A** → 调 B 里注入的 A **无事务**。  

三级把「是否创建代理」推迟到 **第一次被别的 Bean 依赖时**，通过  
`SmartInstantiationAwareBeanPostProcessor.getEarlyBeanReference`（如 `AbstractAutoProxyCreator`）生成早期代理，保证 **注入出去的和最终暴露的是同一代理**。

### 追问 2：循环依赖发生时，AOP 代理何时创建？

正常无环：代理多在 `initializeBean` 末尾 `postProcessAfterInitialization`。  
有环且需提前注入：在 **getEarlyBeanReference** 阶段就可能创建代理，初始化后再用同一引用。

### 追问 3：构造器注入为什么解不了？

`doCreateBean` 必须先 `createBeanInstance`（调构造）才可能放 L3。  
构造参数要求对方 **已存在** → 双方都卡在实例化 → `BeanCurrentlyInCreationException`。

### 追问 4：还有哪些解不了 / 很刁钻？

| 场景 | 说明 |
|------|------|
| 构造器环 | 默认失败 |
| `@Lookup` / 多例注入进构造 | 复杂生命周期，易炸 |
| prototype ↔ prototype | 不走单例三级缓存 |
| 构造依赖 + 字段反依 | 仍卡在构造 |
| FactoryBean 环 | 另论，别和普通 Bean 混为一谈 |

### 追问 5：`@Async` / `@Transactional` 和循环依赖一起出现？

早期暴露的代理类型、Advisor 顺序可能导致：拿到的代理 **缺某个切面**，或初始化顺序敏感。  
原则：**能拆环就拆**；不要靠三级缓存硬扛复杂 AOP 图。

### 业务解环

Setter/`@Lazy` / 事件 / 中介接口 / 合并 Bean；**不要**把三级缓存当设计目标。

---

## Bean 生命周期（加深）

```text
InstantiationAwareBeanPostProcessor（可短路实例化）
→ 实例化（策略：构造 / 工厂方法）
→ 属性填充（@Autowired 在这里；循环依赖窗口也在这）
→ Aware（BeanName/Factory/ApplicationContext…）
→ BeanPostProcessor.before
→ 初始化 @PostConstruct / InitializingBean / init-method
→ BeanPostProcessor.after  ※ 常规 AOP 代理点
→ 注册 DisposableBean
→ 使用
→ 销毁
```

### 追问

| 问题 | 答法 |
|------|------|
| `@PostConstruct` 和 `InitializingBean` 顺序？ | 通常 PostConstruct（CommonAnnotationBPP）在 `InitializingBean.afterPropertiesSet` **之前**（以具体 BPP 顺序为准） |
| `BeanFactoryPostProcessor` vs `BeanPostProcessor`？ | 前者改 **BeanDefinition**（容器级，早）；后者加工 **Bean 实例** |
| 为何构造里不能用 `@Autowired` 字段？ | 字段注入在属性填充阶段，构造时还未注入（构造器注入参数除外） |

---

## BeanFactory vs FactoryBean（加深）

- `&beanName`：拿 FactoryBean 本身。  
- FactoryBean 常延迟 `getObject`；`isSingleton` 决定产品是否缓存。  
- **追问：** FactoryBean 与 `@Bean` 方法返回值的代理/作用域差异——Boot 里大量 starter 用 `@Bean`，不一定走 FactoryBean。

---

## IOC：new 与代理

- 容器 `new`/反射出 **目标实例**；若有 Advisor，对外发布 **代理**。  
- **追问：** `AopUtils.getTargetClass` / `((Advised)proxy).getTargetSource()` 如何拿原对象（调试用，业务慎用）。  
- `final` 类：CGLIB 难增强；`final` 方法：子类代理拦不住。

---

## 启动与自动配置（加深）

```text
SpringApplication.run
→ 准备 Environment、ApplicationContext
→ 加载 starters 的 AutoConfiguration（spring.factories / AutoConfiguration.imports）
→ @ConditionalOnClass/Bean/Property 过滤
→ 刷新上下文：BFPP → 单例预实例化 → 事件
```

**追问：** 自定义 starter 如何写？`@AutoConfiguration` + `@Conditional` + `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`。

---

## @Lazy 深问

- Bean 定义 lazy：启动不建，首次 getBean 再建。  
- 注入点 lazy：注入 **懒加载代理**，第一次方法调用才拿真实 Bean → 可打断 **构造期** 依赖。  
- **追问：** lazy 代理第一次调用若目标创建失败，异常出现在业务路径而非启动路径——排障更难。

---

## 资深连环追问（事务 + 循环依赖）

| 面试官问 | 答要点 |
|----------|--------|
| 事务注解标在接口上行为？ | 代理模式建议标实现类；接口上可能失效 |
| 同一类两个方法不同传播如何生效？ | 必须经代理调用；this 调无效 |
| 只读事务里调了写方法？ | 未必报错；靠纪律与代码 review |
| 如何证明当前在事务里？ | `TransactionSynchronizationManager.isActualTransactionActive()` |
| 三级缓存取出后为何删 L3？ | 早期引用只需生成一次，进 L2，避免重复创建代理 |
| 循环依赖一定是坏设计吗？ | 简单互调可接受；复杂领域环应拆 |
| 为何 Spring Boot 2.6+ 默认可禁循环依赖？ | `spring.main.allow-circular-references`；鼓励显式设计 |

---

## Spring 面试速记（含深度）

| 主题 | 一句话 |
|------|--------|
| 传播 | REQUIRED 共用；REQUIRES_NEW 真新事务；NESTED 保存点 |
| 挂起 | ThreadLocal 资源压栈/恢复 |
| 失效 | 自调用、非 public、异常、无代理；注意 rollback-only |
| 实现 | TransactionInterceptor + PlatformTransactionManager |
| 循环依赖 | L3 工厂为 AOP 早期代理；构造器环必死 |
| 生命周期 | 属性填充窗口解环；after 里常规代理 |
| 多数据源 | 单 TM 不够，上 JTA 或分布式方案 |

---

# SpringMVC

## 简述SpringMVC的执行流程
Spring MVC的执行流程主要包括以下几个步骤：

- 客户端发送请求：客户端通过浏览器或其他方式发送HTTP请求到Spring MVC应用程序。

- DispatcherServlet的接收：请求首先被前置的DispatcherServlet捕获，它是Spring MVC的核心Servlet。DispatcherServlet充当了控制器的角色，负责协调和处理请求。

- 处理器映射（Handler Mapping）：DispatcherServlet将根据配置的处理器映射器（Handler Mapping）来确定请求所对应的处理器（Controller）。处理器映射器将请求的URL与Controller进行匹配。

- 处理器适配器（Handler Adapter）：确定了处理器后，DispatcherServlet会根据配置的处理器适配器（Handler Adapter）来调用相应的处理器方法，并传入请求参数。处理器适配器会对各种不同类型的处理器进行适配，使得它们能够统一处理请求。

- 控制器处理请求：处理器（Controller）是真正处理请求的组件，它会根据请求的内容进行相应的逻辑处理，并返回一个ModelAndView对象，其中包含了处理结果和要渲染的视图名称。

- 视图解析器（View Resolver）：DispatcherServlet会使用视图解析器（View Resolver）来解析处理器返回的视图名称，从而确定要使用的具体视图。视图解析器可以根据配置规则将逻辑视图名称解析为物理视图路径。

- 视图渲染：根据确定的视图，DispatcherServlet将将数据模型（Model）中的数据传递给视图，并由视图负责渲染生成响应内容。

- 响应返回：DispatcherServlet最终将处理结果封装成HTTP响应，发送给客户端。

整个流程中，Spring MVC提供了一系列的组件来支持请求的处理和响应的生成。其中，DispatcherServlet充当总控制器，协调各个组件的工作。处理器映射器确定请求的处理器，处理器适配器调用处理器方法，视图解析器解析视图，而视图则负责渲染生成最终的响应内容。通过这种方式，Spring MVC能够将请求和处理分离，实现了松耦合的设计，提供了灵活且可扩展的Web开发框架。


# Mybatis
## 为什么要用Mybatis？它有什么优点？
MyBatis 是一个流行的持久层框架，它具有以下几个优点：

- 简化数据库操作：
MyBatis 使用简单的 XML 或注解配置来映射 Java 对象和 SQL 语句，使得数据库操作更加直观、易于维护。相比手动编写 JDBC 代码，MyBatis 可以大大减少样板代码的量，提高开发效率。

- 灵活的SQL编写：
MyBatis 支持原生的 SQL 查询，你可以编写自定义的 SQL 语句，灵活地控制数据库查询逻辑。你可以在 SQL 中使用条件、排序、连接等，满足复杂查询的需求，而不受框架的限制。

- 映射关系可配置：
MyBatis 提供了强大的对象-关系映射（ORM）功能，使用简单的配置文件或注解，可以轻松地将查询结果映射成 Java 对象。这种灵活性使得数据库表和 Java 类之间的映射变得非常方便。

- 提供缓存支持：
MyBatis 内置了缓存机制，默认情况下会对查询结果进行缓存，提高查询性能。如果应用程序需要频繁读取相同数据，可以启用 MyBatis 的缓存功能，减少数据库访问次数，提升系统性能。

- 跨数据库兼容性好：
MyBatis 并不依赖于特定的数据库，它支持多种主流数据库，例如 Oracle、MySQL、PostgreSQL、SQL Server 等。这使得应用程序在数据库迁移或切换时更加灵活。

总而言之，MyBatis 是一款简单、灵活、高效的持久层框架，通过提供简洁的 API 和丰富的功能，帮助开发人员更便捷地操作数据库，提高开发效率和系统性能。

## Mybatis为什么只有Mapper接口而没有具体的实现类，但是它能执行SQL语句？

MyBatis 的 Mapper 接口没有具体的实现类，而是通过动态代理技术来实现了 Mapper 接口对应的具体实现，从而达到执行 SQL 语句的目的。

在 MyBatis 中，当 Mapper 接口的方法被调用时，MyBatis 会使用 JDK 动态代理或者 CGLIB 字节码生成技术，根据接口定义和 XML 映射文件中配置的 SQL
语句，动态生成一个代理类，并将方法调用委托给该代理类完成具体的 SQL 执行操作，最终返回结果。

这种方式的好处是免去了手动编写 DAO 实现类的繁琐工作，把开发人员从 SQL 实现细节中解放出来，同时也使得 Mapper 接口更加清晰、简洁，提高了代码的可维护性和灵活性。

以下是一个示例，展示了 MyBatis 如何通过动态代理技术来实现 Mapper 接口的具体实现：

```java
public interface UserMapper {
    @Select("SELECT * FROM user WHERE id = #{id}")
    User getUserById(int id);
}
```

```xml
<mapper namespace="com.example.mapper.UserMapper">
    <select id="getUserById" resultType="com.example.entity.User">
        SELECT * FROM user WHERE id = #{id}
    </select>
</mapper>
```

```java
public class MapperProxy<T> implements InvocationHandler {
    // ...
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
// ...
// 根据 Method 对象查找对应的 MappedStatement，即对应的 SQL 语句
        MappedStatement ms = mappedStatements.get(statementKey);
// 获取 SqlSession 连接
        SqlSession sqlSession = getSqlSession();
        try {
// 执行 SQL 语句
            Object result = method.execute(sqlSession, args);
            return result;
        } catch (Throwable t) {
// 错误处理
        } finally {
// 关闭 SqlSession 连接
            closeSqlSession(sqlSession);
        }
    }
// ...
}
```

在上述示例中，Mapper 接口中的 getUserById 方法被调用时，会根据注解配置或 XML 映射文件中的 SQL 语句动态生成一个对应的 MappedStatement 对象，然后通过 SqlSession 来执行对应的
SQL，并返回结果。这个过程都是通过动态代理技术来实现的。

## Mybatis生成代理的方式是jdk动态代理还是cglib？

在 MyBatis 中，生成 Mapper 接口的代理实现可以采用 JDK 动态代理或者 CGLIB 字节码生成技术，MyBatis 会根据配置来决定使用哪种方式。

默认情况下，如果 Mapper 接口是基于 Java 接口定义的，则 MyBatis 会使用 JDK 动态代理来动态生成 Mapper 接口的代理实现。而对于那些没有接口定义或者强制要求使用 CGLIB 的情况，MyBatis 则会使用
CGLIB 来动态生成代理实现类。

如果要使用 CGLIB 来生成 Mapper 接口的代理实现，则需要在 MyBatis 配置文件中设置 proxyFactory 属性并将其值设置为 org.apache.ibatis.plugin.CglibProxyFactory。

```xml

<configuration>
    <plugins>
        <plugin interceptor="com.example.MyInterceptor"/>
    </plugins>
    <settings>
        <setting name="proxyFactory" value="org.apache.ibatis.plugin.CglibProxyFactory"/>
    </settings>
    <!-- ... -->
</configuration>
```

需要注意的是，在某些情况下，使用 CGLIB 进行动态代理会带来一些副作用，例如无法代理 final 类或方法，以及有可能因为类不是 public 而无法生成代理类等问题。因此，在选择使用 CGLIB 时，需要谨慎评估各种因素，权衡利弊。

## MyBatis如何进行数据库字段加解密？

MyBatis 本身并不提供数据库字段加解密的功能，但可以通过自定义 TypeHandler 和拦截器来实现对数据库字段的加解密处理。

首先，需要创建一个自定义的 TypeHandler，它是 MyBatis 中用于将 Java 对象类型和 JDBC 类型之间进行转换的机制。在 TypeHandler 中可以重写 getResult 和 setParameter
方法，在这两个方法中实现加解密逻辑。

例如，针对 MySQL 数据库中的某个表的 password 字段，可以定义一个 AES 加密的 TypeHandler 类，并在 getResult 方法中解密，setParameter 方法中加密。代码示例如下：

```java
public class AesTypeHandler extends BaseTypeHandler<String> {

  private final String key = "your-aes-key";

  @Override
  public void setNonNullParameter(PreparedStatement ps, int i, String parameter, JdbcType jdbcType) throws SQLException {
    String encrypted = AESUtil.encrypt(parameter, key);
    ps.setString(i, encrypted);
  }

  @Override
  public String getNullableResult(ResultSet resultSet, String columnName) throws SQLException {
    String encrypted = resultSet.getString(columnName);
    return AESUtil.decrypt(encrypted, key);
  }

  @Override
  public String getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
    String encrypted = rs.getString(columnIndex);
    return AESUtil.decrypt(encrypted, key);
  }

  @Override
  public String getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
    String encrypted = cs.getString(columnIndex);
    return AESUtil.decrypt(encrypted, key);
  }
}
```

然后，在映射文件中为需要进行加解密的字段配置使用自定义 TypeHandler：

```xml
<resultMap id="userResultMap" type="User">
    <result property="id" column="id"/>
    <result property="name" column="name"/>
    <result property="password" column="password" typeHandler="com.example.AesTypeHandler"/>
</resultMap>
```

最后，可以通过实现 MyBatis 的拦截器接口来实现对 SQL 语句进行加解密。在拦截器中，可以获取到正在执行的 SQL 语句及其参数，并对参数进行加密、解密处理。

总之，MyBatis 可以通过自定义 TypeHandler 和拦截器来实现对数据库字段的加解密处理，开发者可以根据具体的业务需求进行实现。

## Mybatis的核心流程是什么？

Mybatis 的核心流程主要包括 Configuration、SqlSessionFactoryBuilder、SqlSessionFactory、SqlSession 和 Executor，其大致流程如下：

- Configuration：是 Mybatis 的配置类，负责读取并解析配置文件（mybatis-config.xml 和 mapper.xml），创建 SqlSessionFactoryBuilder 对象，并管理全局配置信息。

- SqlSessionFactoryBuilder：是 Mybatis 的工厂类，负责创建 SqlSessionFactory 对象。

- SqlSessionFactory：是 Mybatis 的会话工厂类，负责创建 SqlSession 对象。

- SqlSession：是 Mybatis 的会话类，是 Mybatis 与数据库交互的主要接口，负责管理与数据库建立的会话和事务。

- Executor：是 Mybatis 的执行器接口，主要负责执行 SQL 命令，与数据库进行交互，并将结果映射为 Java 对象返回给调用方。

基于以上核心流程，Mybatis 的使用大致可以分为以下几个步骤：

- 配置 mybatis-config.xml 文件，一般包括数据源、事务管理器、类型别名等。

- 配置 mapper.xml 文件，一般包括 SQL 语句和参数映射规则等。

- 使用 SqlSessionFactoryBuilder 创建 SqlSessionFactory 对象，并加载配置文件。

- 使用 SqlSessionFactory 创建 SqlSession 对象，在使用过程中，SqlSession 可以通过多种方式获取到，例如通过 Spring 注入或者 Mybatis-Spring 等框架的配置。

- 使用 SqlSession 执行操作，例如插入、更新、查询、删除等操作，核心流程如下：

- 调用 SqlSession 的执行方法，传入 SQL 语句和参数信息；

- SqlSession 调用 Executor 执行具体的 SQL 操作，并返回操作结果；

- Executor 内部会创建 Statement 对象，将 SQL 语句和参数设置到 Statement 中并执行；

- Executor 将执行结果进行处理，并将结果映射为 Java 对象返回给调用方。

总之，Mybatis 的核心流程是 Configuration、SqlSessionFactoryBuilder、SqlSessionFactory、SqlSession 和 Executor 围绕着数据源和 Sql 语句进行的，其内部使用了许多设计模式和技术实现，并使得 Mybatis 成为一款强大的 ORM 框架。

## Mybatis缓存
- 一级缓存（本地缓存）：

  - 默认情况下，MyBatis启用了一级缓存。它是基于线程的缓存，在同一个SqlSession中，执行相同的SQL语句时，返回的结果会被缓存起来。
  - 一级缓存的范围是SqlSession级别，当SqlSession关闭或进行了更新操作（插入、更新、删除），缓存将被清空。
  - 可以通过手动清除缓存（调用clearCache()方法）或配置参数来禁用一级缓存。
- 二级缓存（全局缓存）：

  - 二级缓存是一个跨SqlSession的缓存，可以被多个SqlSession共享。它默认是禁用的，需要手动在Mapper XML或配置文件中进行配置开启。
  - 二级缓存是基于namespace的，同一个namespace下的语句执行结果会被缓存起来。
  - 二级缓存的范围是Mapper级别，当进行了更新操作并提交（或回滚）后，缓存将被清空。
  - 可以通过手动清除缓存（调用clearCache()方法）或配置参数来禁用二级缓存。

注意事项：

  - 一级缓存和二级缓存是两个独立的机制，相互之间没有关系。
  - 对于数据表的更新操作（插入、更新、删除），要保证缓存的一致性，需要及时清空缓存或更新缓存中对应的数据。
  - 缓存对于多表关联查询、复杂查询等情况下的性能提升有限，需要在实际使用中进行评估。
  - 对于并发环境下的数据一致性问题，需要谨慎使用缓存并考虑合适的缓存策略（如使用定时刷新或失效时间等）。

总结：MyBatis的缓存功能可以有效减少数据库访问次数，提高系统性能。一级缓存在SqlSession级别进行缓存，而二级缓存在Mapper级别进行缓存，使用时需要根据具体情况选择合适的缓存级别和缓存策略。
