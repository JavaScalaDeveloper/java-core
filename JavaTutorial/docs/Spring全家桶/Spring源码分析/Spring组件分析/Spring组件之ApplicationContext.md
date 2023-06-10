### 1. `ApplicationContext` ���

���������� spring ����ʱ��һ��������������

```
ApplicationContext context = new AnnotationConfigApplicationContext(Main.class);

```

��������

```
ApplicationContext context = new AnnotationConfigWebApplicationContext();
context.register(MvcConfig.class);
context.refresh();

```

����� `AnnotationConfigApplicationContext` �� `AnnotationConfigWebApplicationContext` ���� `ApplicationContext`�����ս��л���� `AbstractApplicationContext#refresh` �������� spring ������

`ApplicationContext` ����Ϊ **spring Ӧ��������**�������������Ի�ȡ spring �����ڼ�ĸ�����Ϣ���� `BeanFactory`��`Environment` �ȣ��� spring ��������Ҫ��һ���ࡣ

`ApplicationContext` �̳еĽӿ����£�

```
public interface ApplicationContext extends EnvironmentCapable, ListableBeanFactory, 
        HierarchicalBeanFactory, MessageSource, ApplicationEventPublisher, 
        ResourcePatternResolver {
    ...
}

```

��������Կ�����`ApplicationContext` ����Ҳ�������ӿڵ��ӽӿڣ���Щ�ӿڵĹ������£�

*   `EnvironmentCapable`���ṩ�˻������ù��ܣ�`applicationContext` ʵ���л���һ�� `Environment` ���͵ĳ�Ա����������ͨ�� `EnvironmentCapable#getEnvironment()` ����ȡ��
*   `ListableBeanFactory`��`BeanFactory` ���ӽӿڣ��ṩ���о� `BeanFactory` ������ `bean` �ķ���
*   `HierarchicalBeanFactory`��`BeanFactory` ���ӽӿڣ��ṩ�� `BeanFactory` ���Ƽ̳е����������Ի�ȡ�� `BeanFactory`��
*   `MessageSource`��ָ����Ϣ��Դ����������ʵ�ֹ��ʻ�����
*   `ApplicationEventPublisher`���¼��������������ṩ�� `publishEvent(...)` �����������¼�
*   `ResourcePatternResolver`����Դ���������ṩ�˻�ȡ��Դ��`Resource`���ķ�����`getResources(...)`

���������� `ApplicationContext` �����ṩ�ķ�����

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-82de66bd51d650aa8a1fda29bdda3efd6b4.png)

���Կ�����������ķ��������ࡣ

### 2. `ApplicationContext` �̳нṹ

�� `ApplicationContext` �����У�`ApplicationContext` ��Ҫ��Ϊ������ϵ�����Ǽ���������£�

*   �� web ���͵� `ApplicationContext`��������ͨ java Ӧ�õ� `ApplicationContext`��������Ϊ `AnnotationConfigApplicationContext`
*   web ���͵� `ApplicationContext`������ web Ӧ�õ� `ApplicationContext`��������Ϊ `AnnotationConfigWebApplicationContext`������ֻ���� `servlet` ���͵� web�������� `reactive` �� web��

������������ `AnnotationConfigApplicationContext` �ļ̳нṹ��

![ͼƬ��������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-6e20477e8f5948894a5f241cd41038cfa15.png)

������������ `AnnotationConfigWebApplicationContext` �ļ̳нṹ��

![ͼƬ��������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-23a6c84d82370afe39245a568cbcf918209.png)

### 3\. �� bean �л�ȡ `ApplicationContext`

�� spring bean �л�ȡ `ApplicationContext`������ͨ�� `ApplicationContextAware` �ӿ�������

```
@Component
public class TestBean implements ApplicationContextAware {

    private ApplicationContext applicationContext;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) 
            throws BeansException {
        this.applicationContext = applicationContext;
    }

    // ��������

}

```

�̳� `ApplicationContextAware` ��`ApplicationContextAwareProcessor` ���ڳ�ʼ����ɺ���� `setApplicationContext(xxx)` ��������������ֻ��Ҫ�� `TestBean` ��ά��һ����Ա�������� `applicationContext` ���漴�ɡ�

### 4. `ApplicationContextAwareProcessor`

`ApplicationContextAwareProcessor` ��һ�� `BeanPostProcessor`��������Ҫ��ע `ApplicationContextAwareProcessor#postProcessBeforeInitialization` �������������£�

```
@Override
@Nullable
public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
    /**
     * applicationContext �� Environment��ResourceLoader��
     * ApplicationEventPublisher��MessageSource �ȵ����࣬��Щ���aware�ӿڵĵ��ã�������
     * ͨ�� applicationContext ��������
     */
    if (!(bean instanceof EnvironmentAware || bean instanceof EmbeddedValueResolverAware ||
            bean instanceof ResourceLoaderAware || bean instanceof ApplicationEventPublisherAware ||
            bean instanceof MessageSourceAware || bean instanceof ApplicationContextAware)){
        return bean;
    }
    AccessControlContext acc = null;
    if (System.getSecurityManager() != null) {
        acc = this.applicationContext.getBeanFactory().getAccessControlContext();
    }
    if (acc != null) {
        AccessController.doPrivileged((PrivilegedAction<Object>) () -> {
            invokeAwareInterfaces(bean);
            return null;
        }, acc);
    }
    else {
        invokeAwareInterfaces(bean);
    }
    return bean;
}

/**
 * ���� Aware �ӿڵķ���
 * ����EmbeddedValueResolverAware�⣬����Ĵ���������� this.applicationContext
 */
private void invokeAwareInterfaces(Object bean) {
    if (bean instanceof EnvironmentAware) {
        ((EnvironmentAware) bean).setEnvironment(this.applicationContext.getEnvironment());
    }
    if (bean instanceof EmbeddedValueResolverAware) {
        // ע��embeddedValueResolver�Ļ�ȡ�������£�
        // new EmbeddedValueResolver(applicationContext.getBeanFactory());
        ((EmbeddedValueResolverAware) bean).setEmbeddedValueResolver(this.embeddedValueResolver);
    }
    if (bean instanceof ResourceLoaderAware) {
        ((ResourceLoaderAware) bean).setResourceLoader(this.applicationContext);
    }
    if (bean instanceof ApplicationEventPublisherAware) {
        ((ApplicationEventPublisherAware) bean).setApplicationEventPublisher(
                this.applicationContext);
    }
    if (bean instanceof MessageSourceAware) {
        ((MessageSourceAware) bean).setMessageSource(this.applicationContext);
    }
    // װ�� ʵ����ApplicationContextAware����� applicationContext
    if (bean instanceof ApplicationContextAware) {
        ((ApplicationContextAware) bean).setApplicationContext(this.applicationContext);
    }
}

```

����������ǱȽϼ򵥵ģ������ж� bean ���ͣ�Ȼ��ת�������÷�����

### 5. `ApplicationContext` �� `BeanFactory` �Ĺ�ϵ

����������������� `ApplicationContext` �� `BeanFactory` ���ߵĹ�ϵ������һ��ʼ��˵���� `ApplicationContext` �̳��� `BeanFactory` �Ľӿڣ���Ϊ�������Ǽ̳й�ϵ�����������˼̳й�ϵ�⣬���ǻ�����Ϲ�ϵ��`ApplicationContext` ���� `BeanFactory` �Ķ���ֱ�ӿ����룺

���� `AnnotationConfigApplicationContext`��`beanFactory` ��ֵ�������£�

```
public class GenericApplicationContext extends AbstractApplicationContext 
        implements BeanDefinitionRegistry {

    // ����ǳ��е� beanFactory ����
    private final DefaultListableBeanFactory beanFactory;

    public GenericApplicationContext() {
        this.beanFactory = new DefaultListableBeanFactory();
    }

    @Override
    public final ConfigurableListableBeanFactory getBeanFactory() {
        return this.beanFactory;
    }

    ...

}

```

���� `AnnotationConfigWebApplicationContext`��`beanFactory` ��ֵ�������£�

```
public abstract class AbstractRefreshableApplicationContext extends AbstractApplicationContext {

    // ����ǳ��е� beanFactory ����
    @Nullable
    private DefaultListableBeanFactory beanFactory;

    @Override
    protected final void refreshBeanFactory() throws BeansException {
        // �жϵ�ǰApplicationContext�Ƿ����BeanFactory��������ڵĻ����������� Bean���ر� BeanFactory
        if (hasBeanFactory()) {
            destroyBeans();
            closeBeanFactory();
        }
        try {
            // ��ʼ��DefaultListableBeanFactory��������Ĵ�������
            DefaultListableBeanFactory beanFactory = createBeanFactory();
            beanFactory.setSerializationId(getId());

            // ���� BeanFactory �������������ԣ��Ƿ����� Bean ���ǡ��Ƿ�����ѭ������
            customizeBeanFactory(beanFactory);

            // ���� Bean �� BeanFactory ��
            loadBeanDefinitions(beanFactory);
            synchronized (this.beanFactoryMonitor) {
                this.beanFactory = beanFactory;
            }
        }
        catch (IOException ex) {
            ...
        }
    }

    // ���� beanFactory
    protected DefaultListableBeanFactory createBeanFactory() {
        // ָ����beanFactory
        return new DefaultListableBeanFactory(getInternalParentBeanFactory());
    }

    // ��ȡ beanFactory
    @Override
    public final ConfigurableListableBeanFactory getBeanFactory() {
        synchronized (this.beanFactoryMonitor) {
            if (this.beanFactory == null) {
                ...
            }
            return this.beanFactory;
        }
    }

    ...

}

```

`BeanFactory` ����ط���ʵ�����£�

```
public abstract class AbstractApplicationContext extends DefaultResourceLoader
        implements ConfigurableApplicationContext {### 1\. ʲô�� `BeanDefinition`

`BeanDefinition` ������������������ `bean����`���������� spring bean ����Ϣ��

�� java �У�����һ�����Ԫ��Ϣ�����췽������Ա��������Ա�����ȣ���ʹ�õ��� `Class` �࣬һ��`.class` �ļ����ص� jvm �󣬶�������һ�� `Class` �����ڶ���ʵ����ʱ���͸������ `Class` �������Ϣ�����ɡ�

�� spring �У�Ҳ����ôһ���������� bean ����Ϣ���������� `BeanDefinition`���������� spring bean ������ɣ���γ�ʼ����������ٵȣ�������������֧�ֵĲ��ַ�����

```
public interface BeanDefinition extends AttributeAccessor, BeanMetadataElement {

    /**
     * ���ø� BeanDefinition
     * BeanDefinition �и����Ƽ̳еĸ������ָ���˸�BeanDefinition
     * ʵ����beanʱ����ϲ���BeanDefinition
     */
    void setParentName(@Nullable String parentName);

    /**
     * ��ȡ��Bean
     */
    @Nullable
    String getParentName();

    /**
     * ����beanClass����
     * ʵ����ʱ����ʵ��������� Class �Ķ���
     */
    void setBeanClassName(@Nullable String beanClassName);

    /**
     * ��ȡbeanClass����
     */
    @Nullable
    String getBeanClassName();

    /**
     * ����bean�����÷�Χ��������ԭ��
     */
    void setScope(@Nullable String scope);

    /**
     * ��ȡbean�����÷�Χ��������ԭ��
     */
    @Nullable
    String getScope();

    /**
     * ����������
     */
    void setLazyInit(boolean lazyInit);

    /**
     * �Ƿ�Ϊ������
     */
    boolean isLazyInit();

    /**
     * ���ø�Bean����������Bean
     * �� @DependsOn ָ����bean
     */
    void setDependsOn(@Nullable String... dependsOn);

    /**
     * ���ظ�Bean������������
     */
    @Nullable
    String[] getDependsOn();

    /**
     * �����Ƿ���Ϊ�Զ�ע��ĺ�ѡ����
     */
    void setAutowireCandidate(boolean autowireCandidate);

    /**
     * �Ƿ���Ϊ�Զ�ע��ĺ�ѡ����
     */
    boolean isAutowireCandidate();

    /**
     * �����Ƿ�Ϊ��Ҫ�ģ��������д��ڶ��ͬ���͵�beanʱ������ֻ������Ҫ��
     * ���� @Primary ������
     */
    void setPrimary(boolean primary);

    /**
     * �Ƿ�Ϊ��Ҫ��bean
     */
    boolean isPrimary();

    /**
     * ���factoryBean
     * ָ��factoryBean������
     */
    void setFactoryBeanName(@Nullable String factoryBeanName);

    /**
     * ���factoryBean
     * ��ȡfactoryBean������
     */
    @Nullable
    String getFactoryBeanName();

    /**
     * ���ù�������������
     * ���� @Bean ��ǵķ���
     */
    void setFactoryMethodName(@Nullable String factoryMethodName);

    /**
     * ���ع�������������
     * ���� @Bean ��ǵķ���
     */
    @Nullable
    String getFactoryMethodName();

    /**
     * ��ȡ�����ȥ�Ĳ���ֵ
     */
    ConstructorArgumentValues getConstructorArgumentValues();

    /**
     * ���췽���Ƿ��в���
     */
    default boolean hasConstructorArgumentValues() {
        return !getConstructorArgumentValues().isEmpty();
    }

    /**
     * ��ȡ����ֵ
     * ���������������ֵ��Ϊ���췽�������������Ĳ���
     */
    MutablePropertyValues getPropertyValues();

    /**
     * �Ƿ�������ֵ
     */
    default boolean hasPropertyValues() {
        return !getPropertyValues().isEmpty();
    }

    /**
     * ���ó�ʼ����������
     */
    void setInitMethodName(@Nullable String initMethodName);

    /**
     * ��ȡ��ʼ����������
     */
    @Nullable
    String getInitMethodName();

    /**
     * �������ٷ�������
     */
    void setDestroyMethodName(@Nullable String destroyMethodName);

    /**
     * ��ȡ���ٷ�������
     */
    @Nullable
    String getDestroyMethodName();

    /**
     * �Ƿ�Ϊ����bean
     */
    boolean isSingleton();

    /**
     * �Ƿ�Ϊԭ��bean
     */
    boolean isPrototype();

    /**
     * ������ Bean �Ǳ�����Ϊ abstract����ô����ʵ��������������Ϊ ��bean ���ڼ̳�
     */
    boolean isAbstract();

    ...

}

```

���Կ�����`BeanDefinition` ֧�ֵķ����ǳ��࣬�кܶ�������ƽʱʹ��ʱָ���ģ�

*   `setScope(...)`������ bean �����÷�Χ���� `@Scope` ָ��
*   `setLazyInit(...)`�����������أ��� `@Lazy` ָ��
*   `setDependsOn(...)`������ bean �������� `@DependsOn` ָ��
*   `setPrimary(...)`������Ϊ��Ҫ bean���� `@Primary` ָ��
*   `setFactoryMethodName(...)`�����ù����������ƣ������� `@Bean` ��ǵķ���

��������ע��ʱ������ָ���ģ�����Щ���� `xml` ʱ��ָ���ģ��磺

*   `setInitMethodName(...)`�����ó�ʼ������ ���� `init-method` ָ��
*   `setDestroyMethodName(...)`���������ٷ������� `destroy-method` ָ��

### 2\. spring �ṩ����Щ `BeanDefinition`

`BeanDefinition` ��һ���ӿڣ����ǵ�Ȼ����ֱ��ʹ�ã����������������� Spring �ṩ����Щ `BeanDefinition`��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-49cbc9cb32badc1db52717cd19a9447eca7.png)

spring �ṩ�� `BeanDefinition` ����������ͼ��ʾ�ļ����ˣ�����������Ҫ�������֣�

*   `RootBeanDefinition`
*   `ChildBeanDefinition`
*   `GenericBeanDefinition`
*   `ScannedGenericBeanDefinition`
*   `AnnotatedGenericBeanDefinition`

#### 2.1 `RootBeanDefinition` �� `ChildBeanDefinition`

��ǰ���ᵽ�� `BeanDefinition` ���ӵĸ�����������������̳еģ�һ����˵�����ǿ����� `RootBeanDefinition` ���幫��������Ȼ���� `ChildBeanDefinition` �ж�����Ե����ݣ�ʾ�����£�

```
public static void main(String[] args) {
AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();
// RootBeanDefinition
RootBeanDefinition root = new RootBeanDefinition();
root.setBeanClass(User.class);
root.getPropertyValues().add("name", "123");
// ����ע�᷽������չʾ��ʵ����Ŀ�в�����ʹ��
// ʹ����Ŀ����ʹ�õ� BeanDefinitionRegistryPostProcessor �ṩ�ķ���
context.registerBeanDefinition("root", root);

    // ChildBeanDefinition
    ChildBeanDefinition child1 = new ChildBeanDefinition("root");
    child1.getPropertyValues().add("age", "11");
    // ����ע�᷽������չʾ��ʵ����Ŀ�в�����ʹ��
    // ʹ����Ŀ����ʹ�õ� BeanDefinitionRegistryPostProcessor �ṩ�ķ���
    context.registerBeanDefinition("child1", child1);

    // ChildBeanDefinition
    ChildBeanDefinition child2 = new ChildBeanDefinition("root");
    child2.getPropertyValues().add("age", "12");
    // ����ע�᷽������չʾ��ʵ����Ŀ�в�����ʹ��
    // ʹ����Ŀ����ʹ�õ� BeanDefinitionRegistryPostProcessor �ṩ�ķ���
    context.registerBeanDefinition("child2", child2);
    // ��������
    context.refresh();

    User rootUser = (User) context.getBean("root");
    User child1User = (User) context.getBean("child1");
    User child2User = (User) context.getBean("child2");
    System.out.println(rootUser);
    System.out.println(child1User);
    System.out.println(child2User);
}

```

���н����

```
User{name='123', age=null}
User{name='123', age=11}
User{name='123', age=12}

```

���Կ�����`child1` �� `child1` ���гɹ��ش� `RootBeanDefinition` �̳е������ԡ�

#### 2.2 `GenericBeanDefinition`

���Ǹ�ͨ�õ� `BeanDefinition`��ֱ�Ӽ̳��� `AbstractBeanDefinition`���������ṩ�ķ������£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-5ed980070b301dc84926fac2494093d4fc6.png)

���Կ������������ṩ�ķ��������࣬����������̳� `AbstractBeanDefinition`��һ������£�����Ҫ�����Լ��� `BeanDefinition` ʱ��ֻ��Ҫʹ�������Ϳ����ˣ�����Ҳ�ṩһ��ʾ����

```
public static void main(String[] args) {
AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();

    GenericBeanDefinition userBeanDefinition = new GenericBeanDefinition();
    userBeanDefinition.setBeanClass(User.class);
    userBeanDefinition.getPropertyValues().add("name", "123");
    userBeanDefinition.getPropertyValues().add("age", "11");
    // ����ע�᷽������չʾ��ʵ����Ŀ�в�����ʹ��
    // ʹ����Ŀ����ʹ�õ� BeanDefinitionRegistryPostProcessor �ṩ�ķ���
    context.registerBeanDefinition("user", userBeanDefinition);

    // ��������
    context.refresh();

    User user = (User) context.getBean("user");
    System.out.println(user);
}

```

### 2.3 `ScannedGenericBeanDefinition`

`ScannedGenericBeanDefinition` �̳��� `GenericBeanDefinition`��ͬʱҲʵ���� `AnnotatedBeanDefinition` �ӿڣ������ṩ�ķ��������ࣺ

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-9ed3925090a9ae5fc1d4218ed5a59c2ea19.png)

������������� `GenericBeanDefinition`������Ͳ��ṩʾ���ˡ�

### 2.4 `AnnotatedGenericBeanDefinition`

`AnnotatedGenericBeanDefinition` �̳��� `GenericBeanDefinition`��ͬʱҲʵ���� `AnnotatedBeanDefinition` �ӿڣ������ṩ�ķ��������ࣺ

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-b2e7f49fcdcae4f7272e2670b4fbb92766a.png)

������������� `GenericBeanDefinition`������Ͳ��ṩʾ���ˡ�

### 3\. ���� spring ���������е� `BeanDefinition`

��������Ӷ����� spring ��������� `BeanDefinition`������Ҫ��β��� spring ���������е� `BeanDefinition` �أ�

#### 3.1 demo ׼��

��������׼��һ�� demo��

����׼������ `service`��

```
@Service
public class Service01 {

    private String name;

    public void hello() {
        System.out.println("hello " + name + ", from service01");
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

@Service
public class Service02 {

    private String name;

    public void hello() {
        System.out.println("hello " + name + ", from service02");
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

```

��������Ҫ�ࣺ

```
@ComponentScan
public class Demo02Main {

    public static void main(String[] args) {
        AnnotationConfigApplicationContext context
                = new AnnotationConfigApplicationContext();
        context.register(Demo02Main.class);
        context.refresh();

        Service01 service01 = (Service01) context.getBean("service01");
        Service02 service02 = (Service02) context.getBean("service02");
        service01.hello();
        service02.hello();

    }
}

```

���� ��������£�

```
hello null, from service01
hello null, from service02

```

��˵�����ǵ������Ѿ������ɹ��ˣ�`service01` �� `service02` Ҳ��ʼ���ɹ��ˡ�

#### 3.2 ���ɹ��ĳ���

�������Ƿ����£�`service01` �� `service02` �Ѿ���ʼ���ɹ��ˣ���˵�������б�Ȼ `service01` �� `service02` ��Ӧ�� `beanDefifnition`�������������� `beanDefifnition`���ͱ���Ҫ�Ȼ�ȡ��� `beanDefifnition`��

��λ�ȡ spring ���Ѿ����ڵ� `beanDefifnition` �أ��ο��� 2 �ڵ�ʾ�����������Ϊ�� `context.refresh()` ǰ��ȡ����������

```
public static void main(String[] args) {
AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();
context.register(Demo02Main.class);
// �������ȡ beanDefinition���ᱨ��
BeanDefinition service01Bd = context.getBeanDefinition("service01");
service01Bd.getPropertyValues().addPropertyValue("name", "123");

    context.refresh();

    Service01 service01 = (Service01) context.getBean("service01");
    Service02 service02 = (Service02) context.getBean("service02");
    service01.hello();
    service02.hello();
}

```

���У����ֻᱨ��

```
Exception in thread "main" org.springframework.beans.factory
.NoSuchBeanDefinitionException: No bean named 'service01' available

```

�������㣬һ�����뵽���� `context.refresh()` ǰ��ȡ�ᱨ������֮���أ�������������

```
public static void main(String[] args) {
AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();
context.register(Demo02Main.class);
context.refresh();

    // ��ȡ beanDefinition���޸Ĳ�������
    BeanDefinition service01Bd = context.getBeanDefinition("service01");
    service01Bd.getPropertyValues().addPropertyValue("name", "123");

    Service01 service01 = (Service01) context.getBean("service01");
    Service02 service02 = (Service02) context.getBean("service02");
    service01.hello();
    service02.hello();

}

```

���У�������£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-268bb546197c4eb9d1686118a12fabb0009.png)

ȷʵû�б����������ǵ��޸�Ҳû�����á��ڴ�������Ǹ� `service01` �� `name` ����ָ��ֵΪ `123`�����н������ `null`��û�����õ�ԭ���� `service01` ���� `context.refresh()` ���г�ʼ�� �ģ���������ô������ `BeanDefinition` �޸ģ�Ҳ���ֲ��������ϡ�

��ô����Ҫ��ô���أ�

#### 3.2 `BeanDefinitionRegistryPostProcessor`�����ƻ� `beanDefinition`

����������Ҫ�ų������ˣ�������о��ǣ�`BeanFactoryPostProcessor`����������Ľ��ܣ��������Ľ��ܣ����Բο� [spring ���֮ BeanFactoryPostProcessor](https://my.oschina.net/funcy/blog/4597545)������ֱ�Ӹ��½��ۣ�

> `BeanFactoryPostProcessor` �������� `spring beanFactory �ĺ��ô�����`�������������ƻ� `beanFactory` ��һЩ��Ϊ��spring Ϊ�����ṩ������ `BeanFactoryPostProcessor`��
>
> *   `BeanFactoryPostProcessor`�����ƻ� `beanFactory` ����Ϊ
> *   `BeanDefinitionRegistryPostProcessor`�����ƻ� `beanDefinition` ����Ϊ

�����ԣ�����Ӧ��ʹ�� `BeanDefinitionRegistryPostProcessor`��ֱ��ʵ������ӿڣ�

```
@Component
public class MyBeanDefinitionRegistryPostProcessor
implements BeanDefinitionRegistryPostProcessor {

    @Override
    public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) 
            throws BeansException {
        BeanDefinition service01Bd = registry.getBeanDefinition("service01");
        service01Bd.getPropertyValues().addPropertyValue("name", "123");
    }

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) 
            throws BeansException {
        // BeanDefinitionRegistryPostProcessor �� BeanFactoryPostProcessor ���ӽӿ�
        // postProcessBeanFactory(...) ���� BeanFactoryPostProcessor���������ﲻ����
    }
}

```

`main` �������������һ�£�

```
public static void main(String[] args) {
AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();
context.register(Demo02Main.class);
context.refresh();

    Service01 service01 = (Service01) context.getBean("service01");
    Service02 service02 = (Service02) context.getBean("service02");
    service01.hello();
    service02.hello();

}

```

���У�������£�

```
hello 123, from service01
hello null, from service02

```

���Կ��� `service01` �� `name` ȷʵ��� `123` �ˡ�

ʵ���ϣ�`BeanDefinitionRegistryPostProcessor#postProcessBeanDefinitionRegistry` ��Ҫ����ʹ�� `BeanDefinitionRegistry` ����� `BeanDefinition` �Ĳ�������֧�ֵķ������£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-5812a2cac994c5940d57c7e6ab55c23a63e.png)

��Ҫ�������£�

*   `getBeanDefinition(...)`����ȡ `BeanDefinition`�������򷵻أ��������򱨴��õ� `BeanDefinition` �󣬾Ϳ��Զ�����и��ֲ�����
*   `registerBeanDefinition(...)`��ע�� `BeanDefinition`�������Զ��� `BeanDefinition` ����Ȼ����ø÷���ע�ᵽ�����У�ǰ��������У��������� `context.refresh()` ǰ���� `context.registerBeanDefinition`��������Ҫ˵��������ǰ��ķ����ɣ����������е�����£������õ� `context.refresh()` �� `context`������ `springboot` �У�������Ƽ�ʹ�� `BeanDefinitionRegistryPostProcessor#postProcessBeanDefinitionRegistry` ����ע�� `BeanDefinition`
*   `removeBeanDefinition(...)`���Ƴ� `BeanDefinition`��һ�������Ӧ�ò����õ�
*   `containsBeanDefinition(...)`���ж��Ƿ����ĳ�� `BeanDefinition`

### 4\. �ܽ�

������Ҫ������ `BeanDefinition` �����ã�

1.  `BeanDefinition` �ķ���
2.  �������͵� `BeanDefinition` ��ʹ��
3.  ʹ�� `BeanDefinitionRegistryPostProcessor#postProcessBeanDefinitionRegistry` ���� `BeanDefinition`����Ҫ��ע�ᡢ�޸� `BeanDefinition`

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4597536](https://my.oschina.net/funcy/blog/4597536) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_

    ...
    @Override
    public <T> T getBean(Class<T> requiredType) throws BeansException {
        assertBeanFactoryActive();
        return getBeanFactory().getBean(requiredType);
    }

    @Override
    public <T> T getBean(Class<T> requiredType, Object... args) throws BeansException {
        assertBeanFactoryActive();
        return getBeanFactory().getBean(requiredType, args);
    }

    ...
}

```

��Щ������ʵ��ʱ�����ǵ��� `getBeanFactory()` ��ȡ�� `BeanFactory` ����Ȼ��ֱ�ӵ��� `BeanFactory` �ķ�����`getBeanFactory()` ���õľ��� `GenericApplicationContext` �� `AnnotationConfigWebApplicationContext` �� `getBeanFactory()` ������

���� `ApplicationContext` �����ݾͽ��ܵ������ˡ�

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4597456](https://my.oschina.net/funcy/blog/4597456) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_