# Spring

## Spring的事务传播机制有哪些？

Spring 事务传播机制是指在一个方法调用过程中涉及到多个事务操作时，如何定义这些事务的传播行为，以保证在多个事务之间进行协调与交互，从而实现事务的一致性和可靠性。Spring 事务传播机制是通过设置 @Transactional 注解的
propagation 属性来实现的。

- REQUIRED：如果当前已经存在一个事务，则加入该事务；否则新建一个事务。适用于增删改操作，例如在事务中新增一条记录或者删除一些数据。

- SUPPORTS：如果当前已经存在一个事务，则加入该事务；否则以非事务的方式继续执行。适用于只读的查询操作，例如统计某个表中数据的数量等操作。

- MANDATORY：如果当前已经存在一个事务，则加入该事务；否则抛出异常。必须在事务中执行，通常用于调用方法必须在事务内部执行的业务场景。

- REQUIRES_NEW：无论当前是否存在事务，都新建一个事务执行该方法，如果原来存在事务，则将其挂起。常用于与原有事务无关的独立操作，例如发送邮件或者审核某些数据。

- NOT_SUPPORTED：以非事务方式执行该方法，如果当前存在事务，则将其挂起。常用于特定场景下的非事务操作，例如获取某个锁或者资源等待。

- NEVER：以非事务方式执行该方法，如果当前存在事务，则抛出异常。通常用于需要禁止在事务中执行的业务场景。

- NESTED：如果当前已经存在一个事务，则开启一个子事务来执行该方法；如果不存在事务，则行为与 REQUIRED
  一样。但是如果出现异常，只会回滚该子事务，而不影响父事务的提交。适用于需要基于当前事务创建嵌套事务的业务场景，例如支付中心退款等。

通过选择合适的事务传播行为，可以保证在多个事务操作之间进行协调与交互，从而实现事务的一致性和可靠性。实际使用中，应该根据业务需求选择合适的事务传播行为，并且合理地设置 @Transactional 注解的属性，以达到最佳的事务控制效果。

## 当Spring的一个方法用了@Transactional注解以后，方法里面调用的字方法没有用@Transactional注解，这时候字方法里出异常了，数据库会回滚吗？

如果 Spring 的一个方法用了 @Transactional 注解，并且调用了另外一个未使用 @Transactional 注解的方法，那么如果在调用该方法中发生异常，则 Spring 会回滚当前事务。

具体来说，当一个方法被声明为 @Transactional 注解时，Spring 会为该方法创建一个代理对象，在运行时该对象会被 Spring 事务管理器拦截。当该方法执行过程中调用了其他未使用 @Transactional
注解的方法时，如果在调用的方法中抛出异常，则整个事务都会回滚。

但是，如果在调用的方法中捕获了异常并进行处理，那么事务就不会回滚。此时可以在调用的方法中手动抛出一个 RuntimeException 或 Error，这样整个事务就会回滚。

总之，Spring 的事务管理器只对使用了 @Transactional 注解的方法进行事务管理，如果需要控制多个方法的事务，应该将它们放到一个使用 @Transactional 注解的方法中。同时，在使用 @Transactional
注解时，需要注意设置合适的传播属性和隔离级别，以保证事务的一致性和可靠性。

## 如果父方法没有使用@Transactional注解，而子方法使用了@Transactional注解，子方法出异常了，父方法里的事务会回滚吗？

如果在 Spring 的父方法没有使用 @Transactional 注解的情况下，子方法使用了 @Transactional 注解，并且在子方法中发生了异常，那么父方法中的事务不会自动回滚。

原因是，Spring 事务机制的本质是基于 AOP 的实现，通过动态代理的方式为使用了 @Transactional 注解的方法增加事务切面，从而实现事务的控制。但是，对于父方法没有使用 @Transactional
注解的情况，Spring 并没有为其创建事务代理对象，也就无法对其进行事务管理。

所以，如果需要在父方法中控制子方法的事务，应该在父方法中添加 @Transactional 注解，则父方法和子方法都会由 Spring 事务管理器来进行事务管理，如果子方法发生异常，则整个事务都会自动回滚。

总之，在使用 Spring 事务管理器时，应该根据业务场景的需求，合理地设置 @Transactional 注解的属性，确保事务的一致性和可靠性。

## Spring怎样使用RabbitMQ作为第三方事务管理？

在 Spring 中使用 RabbitMQ 作为第三方事务管理器，需要借助于 RabbitMQ 提供的 AMQP（Advanced Message Queuing Protocol）规范以及 Spring 提供的 RabbitMQ
支持。具体实现步骤如下：

- 首先，在 Spring 项目中引入 RabbitMQ 相关依赖，可以通过 Maven 或 Gradle 等方式进行依赖管理。

- 创建一个 RabbitMQ 的连接工厂对象，并设置相应的连接参数，如 host、port、username 和 password 等。可以继承 AbstractRoutingConnectionFactory 抽象类实现动态切换多个
  RabbitMQ 的连接。

- 使用 RabbitTemplate 对象来发送消息到 RabbitMQ 中。RabbitTemplate 是 Spring 对 RabbitMQ 客户端 API 的封装，支持消息的发送和接收，以及声明队列、交换器等操作。

- 在代码层面，需要在需要开启事务的方法上添加 @Transactional 注解。Spring 提供了 RabbitMQ 的 TransactionManager 实现类，可以将 RabbitMQ
  作为一个独立的事务管理器来使用。需要在配置文件中配置对应的 TransactionManager，如 RabbitTransactionManager，并将其注册到 Spring 容器中。

- 接下来，需要创建一个 RabbitMQ 的消息监听器，在消息消费前通过 Channel.txSelect() 方法开启 RabbitMQ 事务，消息消费后通过 Channel.txCommit() 或
  Channel.txRollback() 方法提交或回滚事务。

代码示例：

```java
@Bean
public ConnectionFactory connectionFactory(){
        CachingConnectionFactory connectionFactory=new CachingConnectionFactory();
        return connectionFactory;
        }

@Bean
public RabbitTransactionManager rabbitTransactionManager(ConnectionFactory connectionFactory){
        return new RabbitTransactionManager(connectionFactory);
        }
```

通过以上步骤，就可以在 Spring 中使用 RabbitMQ 作为第三方事务管理器了。需要注意的是，如果在消息消费过程中出现异常，需要手动回滚事务，否则该消息会一直占用 RabbitMQ 的资源，从而影响整个系统的性能和稳定性。

## Spring如何解决循环依赖？

Spring 框架是基于依赖注入设计的，因此在应用程序中很容易出现循环依赖的问题，即两个或多个 Bean 之间存在相互依赖关系，这会导致 Bean 的创建过程陷入死循环。Spring 框架通过以下两种方式解决循环依赖问题：

- 构造器注入：Spring 优先采用构造器注入的方式实现依赖注入，因为它可以保证在 Bean 实例化时所有依赖项都已经准备好了，从而避免了循环依赖的问题。

- 三级缓存：当使用属性注入或者 setter 方法注入时，Spring 会将正在创建的 Bean 放到一个 “Early Bean” 缓存中，如果另一个 Bean 需要引用该 Bean，则 Spring 会尝试提前暴露这个早期的 Bean
  实例，将其放到“Singleton Factory”缓存池中。如果发现另一个 Bean 也处于创建状态并且需要引用当前的 Bean，那么 Spring 就会将之前创建的 Bean 利用 CGLIB 进行代理，并将代理对象放到“Early
  Bean”缓存池中。等到所有 Bean 都创建完成后，在第三个步骤中进行依赖注入。

- 当然，有些复杂的情况，构造器注入也无法解决，比如循环依赖的类中存在单例实例的情况。对此，Spring 官方提供了一个解决方案，即使用 @Lazy 注解进行懒加载，并且在需要依赖注入时，通过代理来实现循环依赖的解决。

总之，Spring 使用构造器注入和三级缓存等方式解决循环依赖问题，但如果出现复杂的情况，则需要开发人员自行解决。

## Spring中BeanFactory和FactoryBean的区别？

在 Spring 框架中，BeanFactory 和 FactoryBean 是两个不同的概念。

- BeanFactory
BeanFactory 是 Spring 中最基础的工厂接口，它是 Spring IOC 容器管理 Bean 的核心接口。BeanFactory 的主要职责是加载和管理 Bean，包括创建 Bean 实例、维护 Bean 之间的依赖关系、配置 Bean 的属性等。常用的 BeanFactory 实现类包括 DefaultListableBeanFactory 和 XmlBeanFactory。

- FactoryBean
FactoryBean 接口是一个高级工厂，它允许开发者自定义实例化 Bean 的逻辑。FactoryBean 接口实现类本身也是一个 Bean，可以交由 Spring IOC 容器进行管理。通过 FactoryBean，开发者可以控制 Bean 的创建过程，并且可以在 Bean 创建前后执行一些自定义的操作，比如根据条件判断是否需要创建 Bean 实例、使用缓存来提高 Bean 的创建速度等。

需要注意的是，FactoryBean 接口实现类中的 getObject() 方法返回的不是所需的 Bean 实例本身，而是一个由 FactoryBean 管理的另一个对象，它可以是一个单独的 Bean，也可以是其他工厂类的实例。在获取 FactoryBean 管理的对象时，如果需要获取实际的 Bean 实例，可以通过使用"&"前缀来区分获取 FactoryBean 对象和其所管理的 Bean 对象。

因此，BeanFactory 是 Spring IOC 容器最基本的管理 Bean 的接口，而 FactoryBean 则是一个更高级的工厂，它可以帮助开发者自定义实例化 Bean 的过程。两者之间的区别在于，BeanFactory 直接管理和维护 Bean 实例，而 FactoryBean 通过 getObject() 方法委托给外部方法来创建 Bean 实例。

## 简述Spring Bean的生命周期
Spring Bean的生命周期由以下几个阶段组成：

- 实例化（Instantiation）：在该阶段，Spring容器会根据配置或注解创建Bean的实例。这可以通过构造函数实例化、工厂方法或者其他方式完成。

- 属性赋值（Population）：在实例化后，Spring会通过依赖注入或者其他方式为Bean的属性进行赋值。这可以使用@Autowired、@Value等注解来完成。

- 初始化（Initialization）：在属性赋值完成后，Spring会调用Bean的初始化方法，可以自定义初始化逻辑。常用的初始化方法有@PostConstruct注解、实现InitializingBean接口和配置init-method。

- 使用（In Use）：在初始化完成后，Bean进入可使用状态。此时，容器将Bean交给相关的组件使用。

- 销毁（Destruction）：当Bean不再需要时，容器会调用Bean的销毁方法进行资源释放和清理工作。常用的销毁方法有@PreDestroy注解、实现DisposableBean接口和配置destroy-method。

需要注意的是，Spring容器并不管理原型作用域（prototype scope）的Bean的销毁，因此如果某个Bean是原型作用域的，在使用完后需要手动进行资源的清理。

整个生命周期过程中，可以通过实现一些扩展接口或使用注解来对Bean的行为进行定制，例如BeanPostProcessor接口可以在Bean实例化前后进行一些处理，BeanFactoryPostProcessor接口可以对BeanFactory的配置进行修改等。

总之，Spring Bean的生命周期涵盖了实例化、属性赋值、初始化、使用和销毁等阶段。通过控制每个阶段的行为，我们可以灵活地管理和定制Bean的创建和管理过程。

## 简述Spring的启动流程
Spring的启动流程可以分为以下几个主要步骤：

- 加载配置文件：Spring会加载配置文件（通常是XML文件或注解配置）来获取应用程序的配置信息。

- 创建IOC容器：Spring容器会根据配置文件创建一个IOC（Inversion of Control）容器，用于管理Bean对象及其依赖关系。

- 扫描组件：Spring会扫描配置文件中指定的包或目录，查找带有特定注解的类（例如@Controller、@Service、@Repository等），并将它们注册为Bean对象。

- 创建Bean对象：在IOC容器创建过程中，Spring会根据配置信息通过反射机制实例化每个Bean对象，并将其放入IOC容器中。同时，Spring会注入依赖关系，将相互依赖的Bean对象进行关联。

- 属性赋值和初始化：在创建Bean对象后，Spring会根据配置文件中的属性注入方式，对Bean的属性进行赋值。这可以通过构造函数注入、Setter方法注入或字段注入实现。之后，Spring会调用初始化回调方法，如@PostConstruct注解、InitializingBean接口的afterPropertiesSet()方法或配置文件中的init-method来进行初始化操作。

- 就绪状态：完成属性赋值和初始化后，Bean对象进入就绪状态，表示它已经可以被其他组件使用。

- 应用程序使用Bean：在IOC容器初始化完毕后，应用程序可以通过获取Bean对象的方式来使用它们。这可以通过依赖注入、ApplicationContext的getBean()方法或使用注解进行自动装配来实现。

以上是Spring的基本启动流程，但实际情况可能因为具体的配置和使用方式而有所差异。另外，还有一些细节的处理过程，如AOP代理的创建、事件的发布等，这些步骤会在Spring的启动流程中被执行。

## Spring的自动配置是怎么实现的？

Spring的自动配置是通过条件化配置和Spring Boot的约定大于配置原则来实现的。下面是自动配置的实现方式：

- 条件化配置（Conditional Configuration）：Spring使用条件注解（@Conditional）来根据特定的条件来决定是否应用某个配置。条件注解可以标记在配置类上或者配置方法上，当满足条件时，相应的配置将会被启用。

- Spring Boot的约定大于配置原则：Spring Boot遵循一系列的约定来自动配置应用程序。例如，如果在类路径下存在某个特定的依赖关系，Spring Boot将自动配置相应的bean。Spring Boot提供了许多可以自动配置的场景，如数据源、视图解析器、事务管理器等。

- 自动扫描和组件注册：Spring Boot使用自动扫描机制来查找应用程序中的注解。通过对指定包及其子包进行扫描，Spring Boot能够自动检测到带有特定注解的组件，并将其注册为Spring管理的bean。

- 配置属性绑定：Spring Boot允许通过将配置属性绑定到Java类来自动配置应用程序。它提供了一种方便的方式来定义和使用配置属性，并通过自动绑定将这些属性与组件关联起来。

总之，Spring的自动配置利用条件化配置、约定大于配置原则、自动扫描和组件注册以及配置属性绑定等机制来自动根据应用程序的环境和依赖来进行配置，并为开发者提供了一种简化配置的方式。

## Spring使用IOC创建对象时，什么时候使用new？什么时候使用代理？

在 Spring 中，IoC（控制反转）容器负责创建和管理对象的生命周期。对于对象的创建，通常有两种方式：使用 new 关键字直接实例化对象和使用代理。

使用 new 关键字实例化对象：这是最常见和直接的方式，直接利用 new 关键字在代码中创建对象实例。这种方式适用于那些不需要额外的增强或扩展功能的普通类，可以直接通过构造函数进行实例化。
```java
MyClass myObject = new MyClass();
```
使用代理：Spring 提供了 AOP（面向切面编程）的支持，并且可以通过代理来实现对目标对象的增强。代理可以在目标对象的方法执行前、执行后或者执行过程中添加额外的逻辑，例如日志记录、事务管理等。Spring 使用代理将切面逻辑织入到目标对象的方法调用中。
Spring 使用动态代理和静态代理两种方式来实现代理。动态代理是在运行时通过生成代理对象的方式实现的，包括 JDK 动态代理和 CGLIB 动态代理。静态代理则是在编译时手动编写代理类。

```java
// 基于接口的动态代理
MyInterface proxy = (MyInterface) Proxy.newProxyInstance(
getClass().getClassLoader(),
new Class[] { MyInterface.class },
new MyInvocationHandler(targetObject)
);
```
```java
// 基于类的动态代理（CGLIB）
MyClass proxy = (MyClass) Enhancer.create(
MyClass.class,
new MyMethodInterceptor(targetObject)
);
```
使用代理的情况包括但不限于：

- AOP 面向切面编程：在目标对象的方法执行前、执行后或者执行过程中添加额外的逻辑，例如事务管理、日志记录等。
- 对象的延迟加载：当一个对象被使用时再进行创建，以避免不必要的资源消耗。
- 事务代理：将事务的起始、提交、回滚等操作封装到代理对象中，以确保事务的一致性。

需要注意的是，Spring 会根据对象的作用域和配置来确定是否使用代理。对于单例模式的对象，默认情况下 Spring 会使用代理来管理对象的生命周期和增强功能。而对于非单例的对象，默认情况下 Spring 会通过 new 关键字直接实例化对象。

## Spring是怎样通过@Transactional注解实现事务管理的？
在 Spring 框架中，@Transactional 注解用于实现事务管理。通过 @Transactional 注解，可以将一个方法或类标记为事务性操作，从而使得 Spring 在方法调用时处理事务的提交和回滚。

Spring 通过 AOP (Aspect-Oriented Programming) 织入的方式来实现 @Transactional 注解的事务管理，具体的实现步骤如下：

- 使用 @EnableTransactionManagement 注解启用事务管理功能。在 Spring 配置类上添加该注解，表示开启对 @Transactional 注解的支持。

- 配置事务管理器（TransactionManager）。Spring 使用事务管理器来管理事务的提交和回滚。可以根据具体的需求选择合适的事务管理器，如 DataSourceTransactionManager 或 JpaTransactionManager。

- 在需要进行事务管理的方法或类上使用 @Transactional 注解。该注解可以修饰方法和类，加在方法上表示该方法需要进行事务管理，加在类上表示该类下的所有方法都需要进行事务管理。

- 当调用被 @Transactional 注解修饰的方法时，Spring 就会通过 AOP 代理来拦截方法的调用，对事务进行管理。在方法调用之前，Spring 开启一个事务；如果方法正常执行完成，Spring 提交事务；如果方法中出现异常，Spring 回滚事务。

需要注意的是，@Transactional 注解有一些属性可以配置事务的传播行为、隔离级别、超时时间等。通过配置这些属性，可以对事务的行为进行进一步的控制和定制。

总结来说，Spring 通过 AOP 和代理机制，在 @Transactional 注解修饰的方法调用时自动管理事务。通过启用事务管理、配置事务管理器、使用 @Transactional 注解，并根据注解属性的配置，Spring 能够在方法调用期间处理事务的开启、提交或回滚。这样能够简化事务管理的代码，并提供了灵活的配置选项来适应各种事务场景需求。

## Spring的编程式事务管理和声明式事务管理是怎么实现的？

在 Spring 中，事务管理主要有两种方式：编程式事务管理和声明式事务管理。

- 编程式事务管理：

在编程式事务管理中，开发人员通过手动编写代码来控制事务的开始、提交或回滚。通常使用编程式事务管理时，需要在事务的开始和结束之间显式地调用相关的事务操作方法。

以下是使用编程式事务管理的基本步骤：

- 获取事务管理器（PlatformTransactionManager）

- 创建事务定义（TransactionDefinition），包括隔离级别、传播行为、超时等设置

- 开启事务（beginTransaction）
- 执行业务逻辑
- 根据业务结果判断是否提交或回滚事务（commitTransaction 或 rollbackTransaction）

- 编程式事务管理提供了更精细的控制能力，适用于一些复杂的事务场景，但由于需要手动编写代码，会增加开发的复杂性。

- 声明式事务管理：

声明式事务管理是通过 AOP（面向切面编程）实现的，开发人员只需要在配置文件或使用注解的方式上添加相应的事务管理配置，而无需在业务代码中显示处理事务的代码。Spring 提供了 @Transactional 注解来进行声明式事务管理。使用声明式事务管理时，Spring 将在运行时自动为标注了 @Transactional 注解的方法添加事务管理逻辑，包括事务的开始、提交或回滚等操作。

在声明式事务管理中，需要配置事务管理器（PlatformTransactionManager）和事务通知（TransactionAdvice），以及指定事务切入点（Pointcut）来确定哪些方法会被事务管理。

优点是代码简洁，事务与业务逻辑分离，减少了重复代码和提高了可重用性。同时，可以通过配置灵活地调整事务的传播行为、隔离级别、超时等设置。

总而言之，编程式事务管理需要手动编写事务控制代码，而声明式事务管理则通过 AOP 和注解的方式实现自动化的事务管理，为开发人员提供了更加便捷和灵活的事务控制方式。

## Spring的懒加载是什么意思？
在 Spring 中，懒加载（Lazy Loading）是一种延迟加载的机制。通常情况下，Spring 默认使用的是饿加载（Eager Loading）策略，即在容器启动时就会创建和初始化所有的 bean。而懒加载则是将 bean 的初始化推迟到第一次使用时进行。

使用懒加载机制可以提高应用程序的性能和资源利用效率。当一个应用程序存在大量的 bean，并且某些 bean 在启动时并不会立即被使用到，这时通过懒加载可以避免不必要的初始化和资源占用。

在 Spring 中，可以通过以下方式实现懒加载：

- 对于单个 bean，可以在 bean 的定义上添加 @Lazy 注解，表示该 bean 是懒加载的。在使用时，Spring 容器会在首次访问该 bean 时才进行初始化。

- 对于整个配置类或 XML 配置文件中的所有 bean，可以使用 @Configuration 或 <beans> 标签的 default-lazy-init 属性来进行设置。设置为 true 表示所有 bean 都是懒加载的。

需要注意的是，懒加载仅适用于单例作用域（Singleton Scope）的 bean。对于原型作用域（Prototype Scope）的 bean，无论是否懒加载，Spring 都会在每次请求时创建一个新的实例。

懒加载对于优化启动时间和减少不必要的资源占用是有益的，但也需要根据具体业务需求谨慎使用。懒加载可能会影响应用程序的实时性和响应性，因为在首次访问时可能会引入一定的延迟。因此，需要根据具体情况和性能需求来权衡是否使用懒加载。




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
