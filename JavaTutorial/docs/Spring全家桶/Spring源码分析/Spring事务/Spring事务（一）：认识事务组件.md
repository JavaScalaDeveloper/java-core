ǰ��������� spring aop ��ع��ܺ󣬱��Ľ������� spring aop ��һ��Ӧ�� ���� �������

### 1\. ������ demo ����

����ʽ����ǰ����������˼���£�����������Լ������� spring aop �����һ����������ƣ������ʵ���أ����û�� spring�����ǵ����������һ�㳤������

```
public void fun() {
    // ��������
    start();
    try {
        // ҵ����
        xxx();
        // �ύ����
        commit();
    } catch(Exception e) {
        // �ع�����
        rollback();
        throw e;
    }
}

```

������Ĵ������������������ύ���񡢻ع����񣬶���ҵ������޹أ���Щ����ʹ�� spring aop ��ʵ�֣���˾������������� demo.

#### demo01������ `@Around` ע��ʵ������

���ǿ���ʹ�� `@Around` ע�����������������£�

1.  ����һ��ע�⣺`@MyTransactional`

```
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Documented
public @interface MyTransactional {
}

```

1.  ���� aop ����

```
@Aspect
@Component
public class MyAopAspectj {
    @Pointcut("@annotation(org.springframework.learn.tx.demo02.MyTransactional)")
    public void testAop(){

    }

    @Around("testAop()")
    public Object around(ProceedingJoinPoint p) throws Throwable {
        System.out.println("ִ��ǰ����������....");
        try {
            Object o = p.proceed();
            System.out.println("ִ����ɣ��ύ����....");
            return o;
        } catch (Throwable e) {
            System.out.println("�������쳣�������쳣���ͻع�����....");
            throw e;
        } finally {
            System.out.println("ִ�к�....");
        }
    }

}

```

1.  config������һЩ��Ҫ������

```
@Configuration
@ComponentScan("org.springframework.learn.tx.demo02")
@EnableAspectJAutoProxy(proxyTargetClass = true)
public class TxDemo02Config {

}

```

1.  ���һ�� service �࣬����һ���������� `@MyTransactional` ע��

```
@Service
public class TxTestService {

    @MyTransactional
    public void test01() {
        System.out.println("ִ��test01����");
    }

    public void test02() {
        System.out.println("ִ��test02����");
    }

}

```

1.  ����

```
public class TxDemo02Main {

    public static void main(String[] args) {
        AnnotationConfigApplicationContext applicationContext
                = new AnnotationConfigApplicationContext(TxDemo02Config.class);
        TxTestService service = applicationContext.getBean(TxTestService.class);
        System.out.println("-------------------");
        service.test01();
        System.out.println("-------------------");
        service.test02();

    }
}

```

���У�������£�

```
-------------------
ִ��ǰ����������....
ִ��test01����
ִ����ɣ��ύ����....
ִ�к�....
-------------------
ִ��test02����

```

��� demo �У�����ʹ�� `@Around` ע��������ҵ�����ִ��ǰ�����������Կ�����`@Around` ע������ڴ�������ǰ�������ǳ����쳣ʱ����һЩ����Ĳ�����

#### demo02���Զ��� `advisor` ʵ������

�����ǻ����� spring aop �� `@Around` ע��Ĵ���ʵ���� `@Around` ���ջ��װΪ `InstantiationModelAwarePointcutAdvisorImpl` ���󣬺���Ĵ���͸� `@Around` �޹��ˣ�`@Around` �� `InstantiationModelAwarePointcutAdvisorImpl` ����Ĺ��̣��ɲο� [spring aop ֮ AnnotationAwareAspectJAutoProxyCreator �������ϣ�](https://my.oschina.net/funcy/blog/4678817).

`InstantiationModelAwarePointcutAdvisorImpl` �Ǹ�ʲô�����أ����Ǹ� `advisor`��������˵���ǿ����ڷ�������ǿ������ spring aop ������ҵ���Ӧ���ڵ�ǰ������ `advisor` �ģ��ɲο� [spring aop ֮ AnnotationAwareAspectJAutoProxyCreator �������£�](https://my.oschina.net/funcy/blog/4687961)��

ͨ�����Ϸ������������ṩ����һ��˼·�����ǿ���ʵ�� `advisor` �ӿڣ����ƻ��Լ����߼����������£�

1.  ׼�� `advice`

```
/**
 * ���advice����advisor��һ�����ԣ������߼������ﴦ��
 */
public class MyAdvice implements MethodInterceptor {

    @Override
    public Object invoke(MethodInvocation invocation) throws Throwable {
        System.out.println("ִ��ǰ����������....");
        try {
            Object val = invocation.proceed();
            System.out.println("ִ����ɣ��ύ����....");
            return val;
        } catch (Throwable e) {
            System.out.println("�������쳣�������쳣���ͻع�����....");
            throw e;
        } finally {
            System.out.println("ִ�к�....");
        }
    }
}

```

1.  ׼�� `pointcut`

```
/**
 * �е�
 * �ж���Щ���������ڸ�advisor
 */
public class MyPointcut extends StaticMethodMatcherPointcut {
    /**
     * ƥ�䷽������ @MyTransactional ����򷽷��ͷ���true
     */
    @Override
    public boolean matches(Method method, Class<?> targetClass) {
        return null != AnnotationUtils.getAnnotation(method, MyTransactional.class)
                || null != AnnotationUtils.getAnnotation(targetClass, MyTransactional.class);
    }
}

```

1.  ׼�� `advisor`

```
/**
 * advisor �ɿ����� advice �� pointcut �İ�װ
 */
@Component
public class MyAdvisor extends AbstractBeanFactoryPointcutAdvisor {

    private static final long serialVersionUID = 2651364800145442305L;

    private MyPointcut pointcut;

    public MyAdvisor() {
        this.pointcut = new MyPointcut();
        this.setAdvice(new MyAdvice());
    }

    @Override
    public Pointcut getPointcut() {
        return this.pointcut;
    }

}

```

�����ǲ�ͬ��ע���ʵ�ַ�ʽ���������Ĵ������ע��һ���ˡ�

1.  ׼��һ��ע�⣺`@MyTransactional`

```
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Documented
public @interface MyTransactional {
}

```

1.  ������Ŀ����

```
@Configuration
@ComponentScan("org.springframework.learn.tx.demo01")
@EnableAspectJAutoProxy(proxyTargetClass = true)
public class TxDemo01Config {

}

```

1.  ׼��һ�� service

```
@Service
public class TxTestService {

    @MyTransactional
    public void test01() {
        System.out.println("ִ��test01����");
    }

    public void test02() {
        System.out.println("ִ��test02����");
    }

}

```

1.  ����

```
public class TxDemo01Main {

    public static void main(String[] args) {
        AnnotationConfigApplicationContext applicationContext
                = new AnnotationConfigApplicationContext(TxDemo01Config.class);
        TxTestService service = applicationContext.getBean(TxTestService.class);
        System.out.println("-------------------");
        service.test01();
        System.out.println("-------------------");
        service.test02();

    }
}

```

���У�������£�

```
-------------------
ִ��ǰ����������....
ִ��test01����
ִ����ɣ��ύ����....
ִ�к�....
-------------------
ִ��test02����

```

### 2\. ʹ�� spring �������

����ǰ�������С demo ��Ϊ��θ�ˣ����� spring �����������������һ����������ʶ��spring �ڴ�������ʱ��ʹ�õľ��ǵڶ��ַ�ʽ�������Զ���һ�� `advisor` ��ӵ� spring �����С����� spring ʵ������ľ���ϸ�ڣ����Ǵ��������������������һ�� demo������������ƽʱ����ôʹ������ġ�

Ϊ�˽������ݿ����ӣ�������Ҫ�������ݿ����ӳأ���������ʹ�õ��� mysql����Ҫ�� `spring-learn.gradle` �����������

```
optional("mysql:mysql-connector-java:5.1.48")

```

���ž��Ǵ����ˡ�

1.  ������

```
@Configuration
@ComponentScan("org.springframework.learn.tx.demo03")
@EnableTransactionManagement(proxyTargetClass = true)
public class TxDemo01Config {

    /**
     * ��������Դ
     * @return
     * @throws Exception
     */
    @Bean
    public DataSource dataSource() throws Exception {
        Driver driver = new com.mysql.jdbc.Driver();
        String url = "jdbc:mysql://localhost:3306/test";
        String username = "root";
        String password = "123";
        return new SimpleDriverDataSource(driver, url, username, password);
    }

    /**
     * ����jdbcTemplate�������������������������ݿ�Ĳ���
     * @param dataSource
     * @return
     */
    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

    /**
     * ���������
     * @param dataSource
     * @return
     */
    @Bean
    public DataSourceTransactionManager transactionManager(DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

}

```

1.  ���ݿ������

```
@Service
public class UserService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * ���ݿ���������ʹ�� @Transactional ��������
     * @return
     */
    @Transactional(rollbackFor = Exception.class)
    public int insert() {
        String sql = "insert into `user`(`login_name`, `nick`, `create_time`, `update_time`)"
                + "values (?, ?, ?, ?)";
        int result = jdbcTemplate.update(sql, "test", "test", new Date(), new Date());
        if(true) {
            //throw new RuntimeException("�׳����쳣");
        }
        System.out.println(result);
        return result;
    }

}

```

1.  ����

```
public class TxDemo01Main {

    public static void main(String[] args) {
        AnnotationConfigApplicationContext applicationContext
                = new AnnotationConfigApplicationContext(TxDemo01Config.class);
        UserService userService = applicationContext.getBean(UserService.class);
        userService.insert();

    }
}

```

demo �У�`DataSource` ʹ�� spring �Դ��� `SimpleDriverDataSource`��`orm` ���Ҳ�� spring �ṩ�� `jdbcTemplate`��ʹ�õ� `user` �� sql ���£�

```
CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '����id',
  `login_name` varchar(32) NOT NULL DEFAULT '0' COMMENT '��¼��',
  `nick` varchar(32) NOT NULL DEFAULT '0' COMMENT '�ǳ�',
  `create_time` datetime DEFAULT NULL COMMENT '����ʱ��',
  `update_time` datetime DEFAULT NULL COMMENT '����ʱ��',
  PRIMARY KEY (`id`),
  KEY `create_time` (`create_time`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='�û���';

```

ִ�н�����£�

��һ�β��׳��쳣�����ݿ�����

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-30bbe23a8e0491d1f59378469ad04703e03.png)

�ڶ����׳��쳣�����ݿ�����

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-edf98369ccef9735d83813cef7af7ea1dcd.png)

�����β��׳��쳣�����ݿ�����

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-fab4169dbec7661f27bba203c5e77232f65.png)

���Կ������ڶ����׳��쳣ʱ�����������ع��ˡ�

����������������� demo���������йصĴ�����������

*   `@EnableTransactionManagement(proxyTargetClass = true)`����������
*   `DataSourceTransactionManager`�����������
*   `@Transactional`��ָ����������ķ���

����� aop �� `@EnableAspectJAutoProxy`��`@EnableTransactionManagement` �������������ڣ��������Ǿʹ����ע�����֣����� spring ������������̡�

### 3. `@EnableTransactionManagement` ע��

```
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(TransactionManagementConfigurationSelector.class)
public @interface EnableTransactionManagement {

    /**
     * ѧ��aop����ض���������Ѿ�����Ϥ
     * true: ��ʾǿ��ʹ��cglib����
     * false�����Ŀ����ʵ���˽ӿڣ���ʹ��jdk��̬��������ʹ��cglib����
     * ���� mode Ϊ PROXY ����Ч
     */
    boolean proxyTargetClass() default false;

    /**
     * adviceģʽ��ʹ�ô�������ʹ�� aspectJ
     */
    AdviceMode mode() default AdviceMode.PROXY;

    /**
     * ִ��˳�򣬵�һ����������ж����ǿʱ����ʲô����˳����ִ��
     */
    int order() default Ordered.LOWEST_PRECEDENCE;

}

```

���ע�Ȿ��ûʲô�����������ԣ�ע���Ѿ�����ȷ�ˣ����ǹؼ����ǿ����ע��������ࣺ`TransactionManagementConfigurationSelector`��

```
public class TransactionManagementConfigurationSelector extends 
        AdviceModeImportSelector<EnableTransactionManagement> {
    @Override
    protected String[] selectImports(AdviceMode adviceMode) {
        switch (adviceMode) {
            case PROXY:
                // ���ڴ�����������������������
                return new String[] {AutoProxyRegistrar.class.getName(),
                        ProxyTransactionManagementConfiguration.class.getName()};
            case ASPECTJ:
                // ����aspectJ�������������������࣬���Ĳ�����
                return new String[] {determineTransactionAspectClass()};
            default:
                return null;
        }
    }
    // ʡ������
    ...

}

```

���ڴ����������������������ࣺ`AutoProxyRegistrar`��`ProxyTransactionManagementConfiguration`�����������Ǿ��������������ࡣ

#### 3.1 `AutoProxyRegistrar`

��������������`AutoProxyRegistrar` ��һ��ע���������ǵ�ǰ�� aop ��ע���� `AspectJAutoProxyRegistrar` ������һ������·��

�������������澿������ɶ��

```
public class AutoProxyRegistrar implements ImportBeanDefinitionRegistrar {

    private final Log logger = LogFactory.getLog(getClass());

    @Override
    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, 
            BeanDefinitionRegistry registry) {
        boolean candidateFound = false;
        Set<String> annTypes = importingClassMetadata.getAnnotationTypes();
        for (String annType : annTypes) {
            AnnotationAttributes candidate = AnnotationConfigUtils
                    .attributesFor(importingClassMetadata, annType);
            if (candidate == null) {
                continue;
            }
            Object mode = candidate.get("mode");
            Object proxyTargetClass = candidate.get("proxyTargetClass");
            // ����if�����ģ����� @EnableTransactionManagement ע��
            if (mode != null && proxyTargetClass != null && AdviceMode.class == mode.getClass() &&
                    Boolean.class == proxyTargetClass.getClass()) {
                candidateFound = true;
                if (mode == AdviceMode.PROXY) {
                    // ע�����������ע���� InfrastructureAdvisorAutoProxyCreator �࣬���������������
                    AopConfigUtils.registerAutoProxyCreatorIfNecessary(registry);
                    if ((Boolean) proxyTargetClass) {
                        // ʹ��cglib����
                        AopConfigUtils.forceAutoProxyCreatorToUseClassProxying(registry);
                        return;
                    }
                }
            }
        }
        if (!candidateFound && logger.isInfoEnabled()) {
            String name = getClass().getSimpleName();
            logger.info(...);
        }
    }
}

```

���д���ؼ��ľ�ֻ�� if ��ļ��У���˵�� if ������`mode != null && proxyTargetClass != null && AdviceMode.class == mode.getClass() &&Boolean.class == proxyTargetClass.getClass()`��ͨ������Ķ� `@EnableTransactionManagement`����˵�ľ������ˣ����� `mode == AdviceMode.PROXY`���������� `AopConfigUtils.registerAutoProxyCreatorIfNecessary(registry)`��������������ĵ��ã����ǽ������������������Ȼ���� `proxyTargetClass`��������Ե������� `@EnableAspectJAutoProxy` �е� `proxyTargetClass` һ�£�Ҳ�ǿ���ǿ��ʹ�� cglib ����

���������������� `AopConfigUtils.registerAutoProxyCreatorIfNecessary(registry)` �Ĺ��̣��������룺

> AopConfigUtils

```
    @Nullable
    public static BeanDefinition registerAutoProxyCreatorIfNecessary(BeanDefinitionRegistry registry) {
        // �������¿�
        return registerAutoProxyCreatorIfNecessary(registry, null);
    }

    @Nullable
    public static BeanDefinition registerAutoProxyCreatorIfNecessary(
            BeanDefinitionRegistry registry, @Nullable Object source) {
        // ���� InfrastructureAdvisorAutoProxyCreator �࣬��������
        return registerOrEscalateApcAsRequired(InfrastructureAdvisorAutoProxyCreator.class, 
            registry, source);
    }

```

��������ǲ��������������Ϥ�У�aop �е� `AspectJAnnotationAutoProxyCreator` Ҳ ����ôע��ģ����� `AopConfigUtils#registerOrEscalateApcAsRequired` ������

```
// AopConfigUtils ��ע����඼��������
private static final List<Class<?>> APC_PRIORITY_LIST = new ArrayList<>(3);

static {
    APC_PRIORITY_LIST.add(InfrastructureAdvisorAutoProxyCreator.class);
    APC_PRIORITY_LIST.add(AspectJAwareAdvisorAutoProxyCreator.class);
    APC_PRIORITY_LIST.add(AnnotationAwareAspectJAutoProxyCreator.class);
}

/**
 * ע�����
 */
private static BeanDefinition registerOrEscalateApcAsRequired(
        Class<?> cls, BeanDefinitionRegistry registry, @Nullable Object source) {
    Assert.notNull(registry, "BeanDefinitionRegistry must not be null");
    //����Ѵ������bean
    if (registry.containsBeanDefinition(AUTO_PROXY_CREATOR_BEAN_NAME)) {
        BeanDefinition apcDefinition = registry.getBeanDefinition(AUTO_PROXY_CREATOR_BEAN_NAME);
        //�ж����ȼ���������ȼ��ϸ����滻ԭ�ȵ�bean
        if (!cls.getName().equals(apcDefinition.getBeanClassName())) {
            int currentPriority = findPriorityForClass(apcDefinition.getBeanClassName());
            int requiredPriority = findPriorityForClass(cls);
            // �Ѵ����� �����ȼ� С������ע��ģ���ʹ������ע��ģ��Ѵ��ڵ�����������ȼ�Ϊ
            // 0: InfrastructureAdvisorAutoProxyCreator(��������)
            // 1: AspectJAwareAdvisorAutoProxyCreator(�������xml��aop)
            // 2: AnnotationAwareAspectJAutoProxyCreator(�������ע���aop)
            if (currentPriority < requiredPriority) {
                apcDefinition.setBeanClassName(cls.getName());
            }
        }
        return null;
    }
    //ע��XxxAutoProxyCreator��������
    RootBeanDefinition beanDefinition = new RootBeanDefinition(cls);
    beanDefinition.setSource(source);
    beanDefinition.getPropertyValues().add("order", Ordered.HIGHEST_PRECEDENCE);
    beanDefinition.setRole(BeanDefinition.ROLE_INFRASTRUCTURE);
    registry.registerBeanDefinition(AUTO_PROXY_CREATOR_BEAN_NAME, beanDefinition);
    return beanDefinition;
}

/**
 * ����ע��������ȼ�
 */
private static int findPriorityForClass(@Nullable String className) {
    for (int i = 0; i < APC_PRIORITY_LIST.size(); i++) {
        Class<?> clazz = APC_PRIORITY_LIST.get(i);
        if (clazz.getName().equals(className)) {
            return i;
        }
    }
    throw new IllegalArgumentException(
            "Class name [" + className + "] is not a known auto-proxy creator class");
}

```

`AopConfigUtils` ��ע���������������

*   `InfrastructureAdvisorAutoProxyCreator`����������
*   `AspectJAwareAdvisorAutoProxyCreator`��������� xml �� aop
*   `AnnotationAwareAspectJAutoProxyCreator`���������ע��� aop

�����ߵ����ȼ�Ϊ `AnnotationAwareAspectJAutoProxyCreator` > `AspectJAwareAdvisorAutoProxyCreator` > `InfrastructureAdvisorAutoProxyCreator`��ע��ʱ�����ж�ע��������ȼ������ȼ��ߵ����ջᱻע�뵽 spring �����С������͵�����һ�����⣺**�����Ŀ��ͬʱ������ aop (`@EnableAspectJAutoProxy`) ������ (`@EnableTransactionManagement`)����ô����ע�뵽�����Ľ��� `AnnotationAwareAspectJAutoProxyCreator`����Ҳ����˵��`AnnotationAwareAspectJAutoProxyCreator` Ҳ�ܴ�������** ��仰�ǳ��ؼ�������ζ������Ĵ�����̣�ʵ���ϾͰ�����ǰ������� aop �Ĺ������ˣ�

����Ҳ������ `InfrastructureAdvisorAutoProxyCreator`��

```
// �̳��� AbstractAdvisorAutoProxyCreator�������ǳ��ؼ�
public class InfrastructureAdvisorAutoProxyCreator extends AbstractAdvisorAutoProxyCreator {

    @Nullable
    private ConfigurableListableBeanFactory beanFactory;

    @Override
    protected void initBeanFactory(ConfigurableListableBeanFactory beanFactory) {
        super.initBeanFactory(beanFactory);
        this.beanFactory = beanFactory;
    }

    @Override
    protected boolean isEligibleAdvisorBean(String beanName) {
        return (this.beanFactory != null && 
                this.beanFactory.containsBeanDefinition(beanName) 
                &&  this.beanFactory.getBeanDefinition(beanName).getRole() 
                                == BeanDefinition.ROLE_INFRASTRUCTURE);
    }

}

```

`InfrastructureAdvisorAutoProxyCreator` ��ʵ��û����ʲô�� aop ��ص��£������̳���һ���ؼ����ࣺ`AbstractAdvisorAutoProxyCreator`���������Ǵ�����ͷ��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-2881f63ac07afc5095c449ddb9a0df2bb55.png)

�Ӽ̳й�ϵ�����������̳��� `AbstractAutoProxyCreator`���� `AbstractAutoProxyCreator` ���������� - [spring aop ֮ AnnotationAwareAspectJAutoProxyCreator �������ϣ�](https://my.oschina.net/funcy/blog/4678817) �� [spring aop ֮ AnnotationAwareAspectJAutoProxyCreator �������£�](https://my.oschina.net/funcy/blog/4687961)���ص�����ġ��������Ĳ������ڣ�

������������ `AnnotationAwareAspectJAutoProxyCreator`��`AspectJAwareAdvisorAutoProxyCreator` ��`InfrastructureAdvisorAutoProxyCreator` �����ߵĹ�ϵ��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-acd72335503eeb686abe81d930b45f1f3f0.png)

���Կ�����`AspectJAwareAdvisorAutoProxyCreator` ��`InfrastructureAdvisorAutoProxyCreator` ���̳��� `AbstractAdvisorAutoProxyCreator`��`AnnotationAwareAspectJAutoProxyCreator` �ּ̳��� `AspectJAwareAdvisorAutoProxyCreator`��

ͨ�����Ϸ�����`AutoProxyRegistrar` ������ spring ����ע���� `InfrastructureAdvisorAutoProxyCreator`(`aop` δ���õ������)����������� `aop`�����ע�� `AspectJAwareAdvisorAutoProxyCreator`(���� `xml` �� `aop`) �� `AnnotationAwareAspectJAutoProxyCreator`(���� `annotation` �� `aop`)��

#### 3.2 `ProxyTransactionManagementConfiguration`

���������������� `ProxyTransactionManagementConfiguration` �ࡣ���������������Ǹ������ࣺ

```
@Configuration(proxyBeanMethods = false)
public class ProxyTransactionManagementConfiguration 
        extends AbstractTransactionManagementConfiguration {

    /**
     * ��ȡSpring�� @Transactional ע�⣬������Ӧ���������Թ�����Spring����������ṹ
     */
    @Bean
    @Role(BeanDefinition.ROLE_INFRASTRUCTURE)
    public TransactionAttributeSource transactionAttributeSource() {
        return new AnnotationTransactionAttributeSource();
    }

    /**
     * TransactionInterceptor�̳���Advice��������Ǹ�advice���������������ִ�в���
     * @param transactionAttributeSource������������� transactionAttributeSource() ����
     */
    @Bean
    @Role(BeanDefinition.ROLE_INFRASTRUCTURE)
    public TransactionInterceptor transactionInterceptor(
            TransactionAttributeSource transactionAttributeSource) {
        TransactionInterceptor interceptor = new TransactionInterceptor();
        // �����������Դ�����󣬾����������� @Transactional ע�� �Ķ�ȡ
        interceptor.setTransactionAttributeSource(transactionAttributeSource);
        if (this.txManager != null) {
            interceptor.setTransactionManager(this.txManager);
        }
        return interceptor;
    }

    /**
     * ������ǿ��.
     * @param transactionAttributeSource������������� transactionAttributeSource() ����
     * @param transactionInterceptor������������� transactionInterceptor(...) ����
     */
    @Bean(name = TransactionManagementConfigUtils.TRANSACTION_ADVISOR_BEAN_NAME)
    @Role(BeanDefinition.ROLE_INFRASTRUCTURE)
    public BeanFactoryTransactionAttributeSourceAdvisor transactionAdvisor(
            TransactionAttributeSource transactionAttributeSource,
            TransactionInterceptor transactionInterceptor) {
        BeanFactoryTransactionAttributeSourceAdvisor advisor 
                = new BeanFactoryTransactionAttributeSourceAdvisor();
        // ���������࣬�������� @Transactional ������
        advisor.setTransactionAttributeSource(transactionAttributeSource);
        // ����advice����advice�ﴦ������
        advisor.setAdvice(transactionInterceptor);
        if (this.enableTx != null) {
            advisor.setOrder(this.enableTx.<Integer>getNumber("order"));
        }
        return advisor;
    }

}

```

���Կ��������������һ Щ `bean`��

*   `transactionAttributeSource`������Ϊ `AnnotationTransactionAttributeSource`���������� `@Transactional` ע�⣻
*   `transactionInterceptor`������Ϊ `TransactionInterceptor`��`Advice` �����࣬����������߼���������
*   `transactionAdvisor`������Ϊ `BeanFactoryTransactionAttributeSourceAdvisor`�����Ǹ� `Advisor`���������������߼����ڲ�������������������`transactionAttributeSource` �� `transactionInterceptor`��

`ProxyTransactionManagementConfiguration` �̳��� `AbstractTransactionManagementConfiguration`���� `AbstractTransactionManagementConfiguration` ��Ҳ������һЩ `bean`��

```
@Configuration
public abstract class AbstractTransactionManagementConfiguration implements ImportAware {

    @Nullable
    protected AnnotationAttributes enableTx;

    /**
     * �������������
     */
    @Nullable
    protected TransactionManager txManager;

    /**
     * ������ ImportAware �ӿڵķ���
     */
    @Override
    public void setImportMetadata(AnnotationMetadata importMetadata) {
        this.enableTx = AnnotationAttributes.fromMap(importMetadata
                .getAnnotationAttributes(EnableTransactionManagement.class.getName(), false));
        if (this.enableTx == null) {
            throw new IllegalArgumentException(
                    "@EnableTransactionManagement is not present on importing class " 
                    + importMetadata.getClassName());
        }
    }

    /**
     * �������������.
     * ע��spring���������е� TransactionManagementConfigurer ����
     * TransactionManagementConfigurer��ֻ��һ��������
     *  TransactionManager annotationDrivenTransactionManager()
     * ���������������һ�����������
     */
    @Autowired(required = false)
    void setConfigurers(Collection<TransactionManagementConfigurer> configurers) {
        if (CollectionUtils.isEmpty(configurers)) {
            return;
        }
        if (configurers.size() > 1) {
            throw new IllegalStateException("Only one TransactionManagementConfigurer may exist");
        }
        TransactionManagementConfigurer configurer = configurers.iterator().next();
        this.txManager = configurer.annotationDrivenTransactionManager();
    }

    /**
     * �����¼��������������� @TransactionalEventListener ע��ķ���.
     */
    @Bean(name = TransactionManagementConfigUtils.TRANSACTIONAL_EVENT_LISTENER_FACTORY_BEAN_NAME)
    @Role(BeanDefinition.ROLE_INFRASTRUCTURE)
    public static TransactionalEventListenerFactory transactionalEventListenerFactory() {
        return new TransactionalEventListenerFactory();
    }

}

```

*   `void setConfigurers(Collection<TransactionManagementConfigurer> configurers)`��ע�� `TransactionManagementConfigurer` ���󣬾����������ڴ���ע����˵����
*   `TransactionalEventListenerFactory`������Ϊ `TransactionalEventListenerFactory`���������������¼�����Ҫ�� `@TransactionalEventListener` ע��ķ����������ⲿ�ֵ����ݣ����ľͲ�չ���ˣ���

���ˣ�������Щ�����spring �Ϳ��Խ����������ˣ���Щ����������ƪ�����ٷ�����

### 4\. �ܽ�

�������Ǵ����� demo ���֣�ʾ����������������Լ�����һ������ spring aop ���������������ν��еģ���������һ�� demo ʾ�������ʹ�� spring �ṩ����������ܣ�Ȼ��;�������� spring ��������ע�� `@EnableTransactionManagement` �Ĺ��ܡ�

`@EnableTransactionManagement` �� spring ������������������ܵģ��� `AdviceMode` Ϊ `proxy` ģʽ�£���ע���� spring �������������ࣺ`AutoProxyRegistrar`��`ProxyTransactionManagementConfiguration`���������£�

*   `AutoProxyRegistrar`��`aop` δ���õ�����£����� spring ������ע�� `InfrastructureAdvisorAutoProxyCreator`����������� `aop`�����ע�� `AspectJAwareAdvisorAutoProxyCreator`(���� `xml` �� `aop`) �� `AnnotationAwareAspectJAutoProxyCreator`(���� `annotation` �� `aop`)���������඼�� `AbstractAdvisorAutoProxyCreator` �����࣬�������ɴ������

*   `ProxyTransactionManagementConfiguration`������һ�������࣬ͨ������ `@Bean` ע��ķ�����������������һϵ�е� bean���������������߼�������Щ bean������ֻ�����˽⼴�ɡ�

���ľ��ȵ������ˣ���ƪ���¼���������������ơ�

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4773454](https://my.oschina.net/funcy/blog/4773454) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_