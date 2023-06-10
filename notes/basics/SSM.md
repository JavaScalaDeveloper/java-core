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
