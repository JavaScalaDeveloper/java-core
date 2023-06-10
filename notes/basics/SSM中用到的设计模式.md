# Java的Spring框架用了哪些设计模式？

Spring框架的设计高度复杂，它使用了许多设计模式。以下是一些示例：

## 单例模式（Singleton Pattern）：

Spring中的Bean默认都是单例的，这就是单例模式的应用。每次通过Spring容器获取到的Bean，除非你自己设置，否则它都是同一个对象。
```java
@Configuration
public class AppConfig {
@Bean
public MyService myService() {
return new MyServiceImpl();
}
}
```
## 工厂模式（Factory Pattern）：
Spring使用工厂模式通过BeanFactory创建对象（Bean）。

```java
ApplicationContext context = new ClassPathXmlApplicationContext("Beans.xml");
HelloWorld obj = (HelloWorld) context.getBean("helloWorld");
```

## 模板模式（Template Pattern）：

Spring JDBC和Spring JMS都广泛使用了模板模式。这种模式在父类中定义了算法的结构，但是将一些步骤的实现推迟到子类。例如，JdbcTemplate，JmsTemplate等。
java
jdbcTemplate.execute("DROP TABLE CUSTOMER");
## 代理模式（Proxy Pattern）：

Spring AOP的实现就是典型的代理模式，用于在方法调用前后添加特定的逻辑。

```java
@Aspect
public class LoggingAspect {

@Before("execution(* com.example.myapp.*.*(..))")
public void logBefore(JoinPoint joinPoint) {
System.out.println("Method Called: " + joinPoint.getSignature().getName());
}
}
```
## 原型模式（Prototype Pattern）：

如果一个Bean被标记为prototype，那么Spring容器就会为每个请求返回一个新的Bean实例，这就是原型模式的应用。

```java
@Configuration
public class AppConfig {
@Scope("prototype")
@Bean
public MyService myService() {
return new MyServiceImpl();
}
}
```
## 观察者模式（Observer Pattern）：

Spring事件处理就是观察者模式的应用。当一个事件被触发时，所有关联的监听器得到通知并进行处理。

```java
@Component
public class MyEventListener implements ApplicationListener<MyEvent> {
public void onApplicationEvent(MyEvent event) {
// handle event
}
}
```
## 策略模式（Strategy Pattern）：

Spring资源文件的加载就使用了策略模式，根据资源文件路径的不同前缀（如"classpath:", "file:", "http:"等），使用不同的加载策略。

以上代码仅仅是演示这些模式在Spring中的应用，并未从Spring源码中提取，因为Spring的源码非常复杂，不适合用来解释设计模式的基础概念。但是一旦您熟悉了这些设计模式，您将能在Spring源码中看到这些模式的广泛应用。

# SpringMVC

SpringMVC 框架用到了多个设计模式，其中比较明显的有以下几种：

前端控制器模式（Front Controller Pattern）：SpringMVC 架构采用了前端控制器模式。DispatcherServlet 充当了前端控制器（Front Controller），它是请求的主要入口点，它负责将请求发送给适当的处理程序，并代表应用程序返回响应。

策略模式（Strategy Pattern）：SpringMVC 通过HandlerMapping 接口和 HandlerAdapter 接口来实现请求分派策略的选择和执行处理程序的策略选择。HandlerMapping 接口定义了为请求查找映射处理程序的策略。HandlerAdapter 接口定义了通过适当的策略调度处理程序的方式。

观察者模式（Observer Pattern）：SpringMVC 中 Observer 模式的具体实现是采用了监听器（Listener）机制。比如说，我们可以借助于 Spring 的 Event 监听机制获取容器启动或者关闭时的事件通知。

以下是一些源码示例：

## DispatcherServlet 类中使用了前端控制器模式：

```java
@Override
protected void doService(HttpServletRequest request, HttpServletResponse response) throws Exception {
// ...
// 前端控制器的核心方法，根据请求的 URI 找到相应的处理器进行处理
HandlerExecutionChain mappedHandler = getHandler(request);
// ...
// 执行处理器进行业务逻辑处理
ModelAndView mv = ha.handle(request, response, mappedHandler.getHandler());
// ...
}
```
## HandlerMapping 接口的具体实现类 BeanNameUrlHandlerMapping 实现了策略模式：

```java
public class BeanNameUrlHandlerMapping extends AbstractDetectingUrlHandlerMapping {
// ...
@Override
protected Object getHandlerInternal(HttpServletRequest request) throws Exception {
String lookupPath = getUrlPathHelper().getLookupPathForRequest(request);
Object handler = this.handlerMap.get(lookupPath);
if (handler == null) {
// ...
// 当找不到对应的请求时，使用智能匹配策略选择对应的处理器
handler = lookupHandler(lookupPath, request);
// ...
}
return handler;
}
// ...
}
```
## HandlerAdapter 接口的具体实现类 HttpRequestHandlerAdapter 使用了策略模式：

```java
public class HttpRequestHandlerAdapter implements HandlerAdapter {
// ...
@Override
public ModelAndView handle(HttpServletRequest request, HttpServletResponse response, Object handler)
throws Exception {
if (logger.isDebugEnabled()) {
logger.debug("Handling request [" + request.getMethod() + " " + request.getRequestURI() + "]");
}
HttpServletRequest processedRequest = request;
// ...
// 核心代码：执行请求处理器进行业务逻辑处理
HttpRequestHandler httpRequestHandler = (HttpRequestHandler) handler;
httpRequestHandler.handleRequest(processedRequest, response);
// ...
return null;
}
// ...
}
```
## Spring 的 Event 监听机制使用了观察者模式：

```java
// 容器启动完成事件监听器
public class ContainerStartedEventListener implements ApplicationListener<ContextRefreshedEvent> {
// ...
@Override
public void onApplicationEvent(ContextRefreshedEvent event) {
if (event.getApplicationContext().getParent() == null) {
// ...
LOGGER.info("Container started successfully.");
}
}
// ...
}

```

# Mybatis

MyBatis 框架用到了多个设计模式，其中比较明显的有以下几种：

数据访问对象（Data Access Object，DAO）模式：MyBatis 通过将 SQL 映射文件与 Java 接口相结合的方式实现了 DAO 模式。

工厂模式（Factory Pattern）：在 MyBatis 中，通过 SqlSessionFactoryBuilder 和 SqlSessionFactory 工厂类的组合实现了工厂模式。

建造者模式（Builder Pattern）：MyBatis 中的 Configuration 类就是一个经典的建造者模式的实现。

代理模式（Proxy Pattern）：MyBatis 在 Mapper 接口方法被调用时采用了代理模式将接口方法映射为 SQL 语句的执行操作。

以下是一些源码示例：

## MyBatis 的核心接口 SqlSession 和 SqlSessionFactory 接口实现了工厂模式：

```java
public interface SqlSessionFactory {
// ...
SqlSession openSession();
// ...
}
```

```java
public class SqlSessionFactoryBuilder {
// ...
public SqlSessionFactory build(InputStream inputStream, String environment, Properties properties) {
// ...
return build(configuration);
}
// ...
}
```
## MyBatis 的 Configuration 类实现了建造者模式：

```java
public final class Configuration {
// ...
private final MapperRegistry mapperRegistry = new MapperRegistry(this);
private final InterceptorChain interceptorChain = new InterceptorChain();
private final TypeHandlerRegistry typeHandlerRegistry = new TypeHandlerRegistry();
private final LanguageDriverRegistry languageRegistry = new LanguageDriverRegistry();
// ...
public Configuration(Environment environment) {
this();
this.environment = environment;
}
// ...
public void addMapper(Class<?> type) {
mapperRegistry.addMapper(type);
}
// ...
}
```
## MyBatis 在 Mapper 接口方法被调用时采用代理模式：

```java
public class MapperProxy<T> implements InvocationHandler, Serializable {
// ...
@Override
public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
// ...
return execute(method, args);
}
// ...
}
```
## MyBatis 通过将 SQL 映射文件与 Java 接口相结合的方式实现了 DAO 模式：

```xml
<!-- SQL 映射文件 -->
<mapper namespace="com.example.mapper.UserMapper">
   <select id="selectUserById" parameterType="int" resultType="com.example.entity.User">
       select * from user where id = #{id}
   </select>
</mapper>
```

```java
// 对应的 Java 接口
public interface UserMapper {
   User selectUserById(int id);
}
```

# SpringBoot
Spring Boot 框架用到了多个设计模式，其中比较明显的有以下几种：

依赖注入（Dependency Injection，DI）模式：Spring Boot 通过自动装配实现了依赖注入模式。

工厂模式（Factory Pattern）：Spring Boot 中的自动配置采用了工厂模式的思想。

模板方法（Template Method）模式：Spring Boot 中的 Starter 自动配置机制采用了模板方法模式。

装饰器（Decorator）模式：Spring Boot 中的过滤器(Filter)和拦截器(Interceptor)等组件采用了装饰器模式。

以下是一些源码示例：

## Spring Boot 中的自动装配实现了依赖注入模式：

```java
@Autowired
public MyService(MyRepository repository) {
this.repository = repository;
}
```
## Spring Boot 中的自动配置采用了工厂模式的思想：

```java
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(MyProperties.class)
@ConditionalOnClass(MyService.class)
@AutoConfigureAfter(MyAutoConfiguration.class)
public class MyAutoConfiguration {

@Bean
@ConditionalOnMissingBean
public MyService myService(MyRepository myRepository, MyProperties properties) {
return new MyService(myRepository, properties);
}

}
```
## Spring Boot 中的 Starter 自动配置机制采用了模板方法模式：

```java
public abstract class AbstractMongoClientConfiguration
extends AbstractMongoClientConfigurationSupport implements InitializingBean {

    private MongoClient mongo;

    @Override
    public final MongoClient mongoClient() {
        if (this.mongo != null) {
            return this.mongo;
        }
        try {
            MongoClientSettings settings = mongoClientSettings();
            this.mongo = MongoClients.create(settings);
            configureClientSettingsBuilder(settings);
            configureMongoClientSettingsBuilder(MongoClientSettings.builder()).applyToClusterSettings(builder ->
                    configureClusterSettings(builder.applyConnectionString(new ConnectionString(getConnectionString()))))
                    .build();
            return this.mongo;
        }
        catch (RuntimeException ex) {
            throw ex;
        }
        catch (Exception ex) {
            throw new IllegalStateException(ex);
        }
    }

    // ...
}
```
## Spring Boot 中的过滤器(Filter)和拦截器(Interceptor)等组件采用了装饰器模式：

```java
@Component
public class CustomFilter implements Filter {

@Override
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
System.out.println("executing custom filter before");
chain.doFilter(request, response);  // 调用原始的 FilterChain 对象继续执行请求的处理流程
System.out.println("executing custom filter after");
}

// ...
}
```