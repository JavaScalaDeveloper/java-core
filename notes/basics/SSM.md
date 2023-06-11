# Spring
## Spring的事务传播机制有哪些？
Spring 事务传播机制是指在一个方法调用过程中涉及到多个事务操作时，如何定义这些事务的传播行为，以保证在多个事务之间进行协调与交互，从而实现事务的一致性和可靠性。Spring 事务传播机制是通过设置 @Transactional 注解的 propagation 属性来实现的。
- REQUIRED：如果当前已经存在一个事务，则加入该事务；否则新建一个事务。适用于增删改操作，例如在事务中新增一条记录或者删除一些数据。
 
- SUPPORTS：如果当前已经存在一个事务，则加入该事务；否则以非事务的方式继续执行。适用于只读的查询操作，例如统计某个表中数据的数量等操作。
 
- MANDATORY：如果当前已经存在一个事务，则加入该事务；否则抛出异常。必须在事务中执行，通常用于调用方法必须在事务内部执行的业务场景。
 
- REQUIRES_NEW：无论当前是否存在事务，都新建一个事务执行该方法，如果原来存在事务，则将其挂起。常用于与原有事务无关的独立操作，例如发送邮件或者审核某些数据。
 
- NOT_SUPPORTED：以非事务方式执行该方法，如果当前存在事务，则将其挂起。常用于特定场景下的非事务操作，例如获取某个锁或者资源等待。
 
- NEVER：以非事务方式执行该方法，如果当前存在事务，则抛出异常。通常用于需要禁止在事务中执行的业务场景。
 
- NESTED：如果当前已经存在一个事务，则开启一个子事务来执行该方法；如果不存在事务，则行为与 REQUIRED 一样。但是如果出现异常，只会回滚该子事务，而不影响父事务的提交。适用于需要基于当前事务创建嵌套事务的业务场景，例如支付中心退款等。

通过选择合适的事务传播行为，可以保证在多个事务操作之间进行协调与交互，从而实现事务的一致性和可靠性。实际使用中，应该根据业务需求选择合适的事务传播行为，并且合理地设置 @Transactional 注解的属性，以达到最佳的事务控制效果。
## 当Spring的一个方法用了@Transactional注解以后，方法里面调用的字方法没有用@Transactional注解，这时候字方法里出异常了，数据库会回滚吗？

如果 Spring 的一个方法用了 @Transactional 注解，并且调用了另外一个未使用 @Transactional 注解的方法，那么如果在调用该方法中发生异常，则 Spring 会回滚当前事务。

具体来说，当一个方法被声明为 @Transactional 注解时，Spring 会为该方法创建一个代理对象，在运行时该对象会被 Spring 事务管理器拦截。当该方法执行过程中调用了其他未使用 @Transactional 注解的方法时，如果在调用的方法中抛出异常，则整个事务都会回滚。

但是，如果在调用的方法中捕获了异常并进行处理，那么事务就不会回滚。此时可以在调用的方法中手动抛出一个 RuntimeException 或 Error，这样整个事务就会回滚。

总之，Spring 的事务管理器只对使用了 @Transactional 注解的方法进行事务管理，如果需要控制多个方法的事务，应该将它们放到一个使用 @Transactional 注解的方法中。同时，在使用 @Transactional 注解时，需要注意设置合适的传播属性和隔离级别，以保证事务的一致性和可靠性。
## 如果父方法没有使用@Transactional注解，而子方法使用了@Transactional注解，子方法出异常了，父方法里的事务会回滚吗？
如果在 Spring 的父方法没有使用 @Transactional 注解的情况下，子方法使用了 @Transactional 注解，并且在子方法中发生了异常，那么父方法中的事务不会自动回滚。

原因是，Spring 事务机制的本质是基于 AOP 的实现，通过动态代理的方式为使用了 @Transactional 注解的方法增加事务切面，从而实现事务的控制。但是，对于父方法没有使用 @Transactional 注解的情况，Spring 并没有为其创建事务代理对象，也就无法对其进行事务管理。

所以，如果需要在父方法中控制子方法的事务，应该在父方法中添加 @Transactional 注解，则父方法和子方法都会由 Spring 事务管理器来进行事务管理，如果子方法发生异常，则整个事务都会自动回滚。

总之，在使用 Spring 事务管理器时，应该根据业务场景的需求，合理地设置 @Transactional 注解的属性，确保事务的一致性和可靠性。

## Spring怎样使用RabbitMQ作为第三方事务管理？
在 Spring 中使用 RabbitMQ 作为第三方事务管理器，需要借助于 RabbitMQ 提供的 AMQP（Advanced Message Queuing Protocol）规范以及 Spring 提供的 RabbitMQ 支持。具体实现步骤如下：

- 首先，在 Spring 项目中引入 RabbitMQ 相关依赖，可以通过 Maven 或 Gradle 等方式进行依赖管理。

- 创建一个 RabbitMQ 的连接工厂对象，并设置相应的连接参数，如 host、port、username 和 password 等。可以继承 AbstractRoutingConnectionFactory 抽象类实现动态切换多个 RabbitMQ 的连接。

- 使用 RabbitTemplate 对象来发送消息到 RabbitMQ 中。RabbitTemplate 是 Spring 对 RabbitMQ 客户端 API 的封装，支持消息的发送和接收，以及声明队列、交换器等操作。

- 在代码层面，需要在需要开启事务的方法上添加 @Transactional 注解。Spring 提供了 RabbitMQ 的 TransactionManager 实现类，可以将 RabbitMQ 作为一个独立的事务管理器来使用。需要在配置文件中配置对应的 TransactionManager，如 RabbitTransactionManager，并将其注册到 Spring 容器中。

- 接下来，需要创建一个 RabbitMQ 的消息监听器，在消息消费前通过 Channel.txSelect() 方法开启 RabbitMQ 事务，消息消费后通过 Channel.txCommit() 或 Channel.txRollback() 方法提交或回滚事务。

代码示例：
```java
@Bean
public ConnectionFactory connectionFactory() {
    CachingConnectionFactory connectionFactory = new CachingConnectionFactory();
    return connectionFactory;
}

@Bean
public RabbitTransactionManager rabbitTransactionManager(ConnectionFactory connectionFactory) {
    return new RabbitTransactionManager(connectionFactory);
}
```
通过以上步骤，就可以在 Spring 中使用 RabbitMQ 作为第三方事务管理器了。需要注意的是，如果在消息消费过程中出现异常，需要手动回滚事务，否则该消息会一直占用 RabbitMQ 的资源，从而影响整个系统的性能和稳定性。


# SpringMVC


# Mybatis

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

