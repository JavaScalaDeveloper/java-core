������̽�� springboot ����������ģ�����ʹ�õ��� demo λ��?[gitee/funcy](https://gitee.com/funcy/spring-boot/tree/v2.2.2.RELEASE_learn/spring-boot-project/spring-boot-learn/src/main/java/org/springframework/boot/learn/autoconfigure/demo01).

## 1\. ��?`Demo01Application#main(...)`?��ʼ

springboot ��������ʽ�ǳ��򵥣���һ�У�

```
@SpringBootApplication
public class Demo01Application {

    public static void main(String[] args) {
        // ��һ�о�����������springboot��
        SpringApplication.run(Demo01Application.class, args);
    }
}

```

Ȼ�����Ǿͽ����������������������ʲô��

```
public class SpringApplication {
    ...
    // primarySource �������Ǵ���� Demo01Application.class��
    // args ���� main() �����Ĳ���
    public static ConfigurableApplicationContext run(
            Class<?> primarySource, String... args) {
        // �� primarySource ��װ�����飬�������� run(...) ����
        return run(new Class<?>[] { primarySource }, args);
    }

    // primarySources �������Ǵ���� Demo01Application.class ��װ�ɵ����飬
    // args ���� main() �����Ĳ���
    public static ConfigurableApplicationContext run(
            Class<?>[] primarySources, String[] args) {
        // ���￪ʼ��������
        return new SpringApplication(primarySources).run(args);
    }
    ...
}

```

ͨ������һ����׷����ȥ�������?`SpringApplication#run(Class<?>[], String[])`?�������ؼ��������£�

```
return new SpringApplication(primarySources).run(args);

```

��������Ҫ�����������Բ�����������֣�

*   ���췽����`SpringApplication#SpringApplication(Class<?>...)`
*   ʵ��������`SpringApplication#run(String...)`

�������������������� springboot ���������������ˣ����������Ǿ�������������������

## 2\. ����?`SpringApplication`��`SpringApplication#SpringApplication(Class<?>...)`

```
public class SpringApplication {
    public SpringApplication(Class<?>... primarySources) {
        // ��������
        this(null, primarySources);
    }

    /**
     * ��������յ��õĹ��췽����
     * resourceLoader Ϊ null
     * primarySources Ϊ Demo01Application.class
     */
    @SuppressWarnings({ "unchecked", "rawtypes" })
    public SpringApplication(ResourceLoader resourceLoader, Class<?>... primarySources) {
        // 1\. �������resourceLoader���õ���Ա�����������ֵΪnull
        this.resourceLoader = resourceLoader;
        Assert.notNull(primarySources, "PrimarySources must not be null");
        // 2\. �������primarySources���õ���Ա�����������ֵΪ Demo01Application.class
        this.primarySources = new LinkedHashSet<>(Arrays.asList(primarySources));
        // 3\. ��ǰ�� web Ӧ�����ͣ�REACTIVE��NONE��SERVLET
        this.webApplicationType = WebApplicationType.deduceFromClasspath();
        // 4\. ���ó�ʼ������getSpringFactoriesInstances���� META-INF/spring.factories �л�ȡ����
        setInitializers((Collection) getSpringFactoriesInstances(ApplicationContextInitializer.class));
        // 5\. ���ü�������getSpringFactoriesInstances���� META-INF/spring.factories �л�ȡ����
        setListeners((Collection) getSpringFactoriesInstances(ApplicationListener.class));
        // 6\. ���ذ���main()������class
        this.mainApplicationClass = deduceMainApplicationClass();
    }
}

```

��������������»��ǱȽ������ģ�������ݶ����ڴ�����ע���ˣ�������Щ��������Ҫչ�������������Ǿ���������

### 2.1 ��ȡ��ǰ web Ӧ�����ͣ�`WebApplicationType.deduceFromClasspath()`

`WebApplicationType.deduceFromClasspath()`?�����������ƶϵ�ǰ��Ŀ��ʲô���͵ģ��������£�

```
public enum WebApplicationType {
    // ���� web Ӧ��
    NONE,

    // servlet ���͵� web Ӧ��
    SERVLET,

    // reactive ���͵� web Ӧ��
    REACTIVE;

    ...

    private static final String[] SERVLET_INDICATOR_CLASSES = { 
            "javax.servlet.Servlet",
            "org.springframework.web.context.ConfigurableWebApplicationContext" };

    private static final String WEBMVC_INDICATOR_CLASS 
            = "org.springframework.web.servlet.DispatcherServlet";

    private static final String WEBFLUX_INDICATOR_CLASS 
            = "org.springframework.web.reactive.DispatcherHandler";

    private static final String JERSEY_INDICATOR_CLASS 
            = "org.glassfish.jersey.servlet.ServletContainer";

    static WebApplicationType deduceFromClasspath() {
        // classpath �н����� WEBFLUX �����
        if (ClassUtils.isPresent(WEBFLUX_INDICATOR_CLASS, null) 
                && !ClassUtils.isPresent(WEBMVC_INDICATOR_CLASS, null)
                && !ClassUtils.isPresent(JERSEY_INDICATOR_CLASS, null)) {
            return WebApplicationType.REACTIVE;
        }
        // classpath ������ SERVLET �����
        for (String className : SERVLET_INDICATOR_CLASSES) {
            if (!ClassUtils.isPresent(className, null)) {
                return WebApplicationType.NONE;
            }
        }
        // Ĭ�� web ����Ϊ SERVLET
        // Ҳ����˵��ͬʱ���� WEBFLUX �� SERVLET ����࣬���շ��ص��� SERVLET
        return WebApplicationType.SERVLET;
    }

    ...
}

```

���Կ�����springboot ������������Ŀ���ͣ�`NONE`(���� web Ӧ��)��`SERVLET`(`servlet`?���͵� web Ӧ��)��`REACTIVE`(`reactive`?���͵� web Ӧ��)��`WebApplicationType.deduceFromClasspath()`?��ִ���������£�

1.  ���?`classpath`?�н�����?`WEBFLUX`?����࣬�������ǰ��Ŀ��?`reactive`?���͵� web Ӧ�ã����أ�
2.  ���?`classpath`?�в�����?`SERVLET`?����࣬�������ǰ��Ŀ���� web Ӧ�ã����أ�
3.  ������������������㣬�������ǰ��Ŀ��?`servlet`?���͵� web Ӧ�á�

���� demo ������?`spring-boot-starter-web`?�����������˵�ǰ��Ŀ��?`servlet`?���͵� web Ӧ�á�

### 2.2 ���ó�ʼ������`setInitializers(...)`

���������£�

```
setInitializers((Collection) getSpringFactoriesInstances(ApplicationContextInitializer.class));

```

���д����Ϊ������:

*   ��ȡ?`ApplicationContextInitializer`��`getSpringFactoriesInstances(ApplicationContextInitializer.class)`
*   ���ó�ʼ������`setInitializers(...)`

��������������ȡ?`ApplicationContextInitializer`?�����̣��������£�

```
public class SpringApplication {
    ...

    // type Ϊ ApplicationContextInitializer.class
    private <T> Collection<T> getSpringFactoriesInstances(Class<T> type) {
        return getSpringFactoriesInstances(type, new Class<?>[] {});
    }

    /**
     * type Ϊ ApplicationContextInitializer.class
     * parameterTypes Ϊ ew Class<?>[] {}
     * args Ϊ null
     */
    private <T> Collection<T> getSpringFactoriesInstances(Class<T> type, 
            Class<?>[] parameterTypes, Object... args) {
        ClassLoader classLoader = getClassLoader();
        // �� META-INF/spring.factories ��������
        Set<String> names = new LinkedHashSet<>(
                SpringFactoriesLoader.loadFactoryNames(type, classLoader));
        // ʵ������ʹ�õķ������
        List<T> instances = createSpringFactoriesInstances(
                type, parameterTypes, classLoader, args, names);
        // ���򣬱Ƚϵ��� @Order ע�⣬��ʵ�ֵ� Orderd �ӿ�
        AnnotationAwareOrderComparator.sort(instances);
        return instances;
    }
    ...
}

```

���ϴ���Ƚϼ򵥣��ȴ�?`META-INF/spring.factories`?��ȡ���ݣ�Ȼ��ʹ�÷������ʵ����������������ٷ��ء�

����?`SpringFactoriesLoader.loadFactoryNames(...)`�������ջ��?`META-INF/spring.factories`?�������ݣ�`META-INF/spring.factories`?�������Ϊһ�������ļ���key Ϊ����� type���÷�������ϸ���������Բο�?[springboot �Զ�װ��֮�����Զ�װ����](https://my.oschina.net/funcy/blog/4870868)��

���ջ��ж��ٸ�?`ApplicationContextInitializer`?���ؽ����أ�ͨ�����ԣ�����һ���� 7 ����

![](https://oscimg.oschina.net/oscnet/up-53f764fefeb0c55fcfef6e34634805162f5.png)

���� 7 ��?`ApplicationContextInitializer`��˵�����£�

*   `ConfigurationWarningsApplicationContextInitializer`������ IOC ������һЩ�����Ĵ�������
*   `ContextIdApplicationContextInitializer`������ Spring Ӧ�������ĵ� ID
*   `DelegatingApplicationContextInitializer`������?`application.properties`?��?`context.initializer.classes`?���õ���
*   `RSocketPortInfoApplicationContextInitializer`����?`RSocketServer`?ʵ��ʹ�õļ����˿�д�뵽?`Environment`?����������
*   `ServerPortInfoApplicationContextInitializer`�������� servlet ����ʵ��ʹ�õļ����˿�д�뵽?`Environment`?����������
*   `SharedMetadataReaderFactoryContextInitializer`������һ��?`SpringBoot`?��?`ConfigurationClassPostProcessor`?���õ�?`CachingMetadataReaderFactory`?����
*   `ConditionEvaluationReportLoggingListener`����?`ConditionEvaluationReport`?д����־

��ȡ��?`ApplicationContextInitializer`��������������?`setInitializers(...)`?������

```
public class SpringApplication {
    ...
    public void setInitializers(
            Collection<? extends ApplicationContextInitializer<?>> initializers) {
        this.initializers = new ArrayList<>(initializers);
    }
    ...
}

```

����һ����׼��?`setter`?�����������ľ�ֻ�����ó�Ա������

### 2.3 ���ü�������`setListeners(...)`

���ü������Ĵ������£�

```
setListeners((Collection) getSpringFactoriesInstances(ApplicationListener.class));

```

����ʽ�Ͽ���ͬ?`Initializer`?һ����Ҳ���ȴ�?`META-INF/spring.factories`?�м���?`ApplicationListener`��Ȼ����ӵ���Ա�����У���������ֱ�ӿ��ܻ�ȡ����Щ?`listener`��

![](https://oscimg.oschina.net/oscnet/up-0440eb21c69a75686850a1b44eb9f1287c8.png)

���Կ�����һ�����Ի�ȡ�� 11 ��?`listener`����Щ?`listener`?���������£�

*   `ClearCachesApplicationListener`��Ӧ�������ļ�����ɺ�Ի������������
*   `ParentContextCloserApplicationListener`������˫��Ӧ�������ĵĹر��¼������Լ�����Ӧ���������д���
*   `CloudFoundryVcapEnvironmentPostProcessor`����?`CloudFoundry`?�ṩ֧��
*   `FileEncodingApplicationListener`�����ϵͳ�ļ�������Ӧ�û��������Ƿ�һ�£����ϵͳ�ļ������Ӧ�û����ı��벻ͬ����ֹӦ������
*   `AnsiOutputApplicationListener`������?`spring.output.ansi.enabled`?��������?`AnsiOutput`
*   `ConfigFileApplicationListener`���ӳ�������ЩԼ����λ�ö�ȡ�����ļ�
*   `DelegatingApplicationListener`���������¼���ת����?`application.properties`?�����õ�?`context.listener.classes`?�ļ�����
*   `ClasspathLoggingApplicationListener`���Ի��������¼�?`ApplicationEnvironmentPreparedEvent`?��Ӧ��ʧ���¼�?`ApplicationFailedEvent`?������Ӧ
*   `LoggingApplicationListener`������?`LoggingSystem`��ʹ��?`logging.config`?��������ָ�������û���ȱʡ����
*   `LiquibaseServiceLocatorApplicationListener`��ʹ��һ�����Ժ�?`SpringBoot`?��ִ�� jar ����Ϲ����İ汾�滻?`LiquibaseServiceLocator`
*   `BackgroundPreinitializer`��ʹ��һ����̨�߳̾��紥��һЩ��ʱ�ĳ�ʼ������

��������?`SpringApplication#setListeners`��

```
public void setListeners(Collection<? extends ApplicationListener<?>> listeners) {
    this.listeners = new ArrayList<>(listeners);
}

```

��Ҳ��һ����׼��?`setter`?������

### 2.4 �ƶ����ࣺ`deduceMainApplicationClass()`

��ν���࣬���ǰ���?`main(String[])`��Ҳ���ǵ�ǰ spring Ӧ�õ������࣬`SpringApplication#deduceMainApplicationClass`?�������£�

```
private Class<?> deduceMainApplicationClass() {
    try {
        // ��ȡ����ջ
        StackTraceElement[] stackTrace = new RuntimeException().getStackTrace();
        // ��������ջ���� ��main����
        for (StackTraceElement stackTraceElement : stackTrace) {
            if ("main".equals(stackTraceElement.getMethodName())) {
                return Class.forName(stackTraceElement.getClassName());
            }
        }
    }
    catch (ClassNotFoundException ex) {
        // Swallow and continue
    }
    return null;
}

```

������Ҫ��ͨ��?`new RuntimeException().getStackTrace()`?��ȡ����ջ��Ȼ��������õ�����?`main`?�������࣬�õ��ĵ���ջ���£�

![](https://oscimg.oschina.net/oscnet/up-8c04487e6b05f583e7d45b83c293634f42a.png)

���Կ�����`main()`?�Ͱ����ڵ���ջ���ˡ�

### 2.5 �ܽ�

������Ҫ�ǽ���?`SpringApplication`?�Ĵ������̣������ص���������¼��㣺

1.  �ƶϵ�ǰ web Ӧ�����ͣ�NONE, SERVLET,REACTIVE��
2.  ���ó�ʼ������`ApplicationContextInitializer`��
3.  ���ü�������`ApplicationListener`��
4.  �ƶ����ࡣ

![](https://oscimg.oschina.net/oscnet/up-e9a43f1c523c0f19d37e4741580ed32ca08.png)

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4877610](https://my.oschina.net/funcy/blog/4877610)?���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_