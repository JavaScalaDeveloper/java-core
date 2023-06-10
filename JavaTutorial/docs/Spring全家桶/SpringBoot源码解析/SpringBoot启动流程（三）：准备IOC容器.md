��һƪ�����ܽ� springboot �����������£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-07a6b491fbe69b8dcbd41e59a8543f06671.png)

�����ģ����Ǽ��������������Ĳ��衣

### 3.8 ���� ioc ����

���� ioc �����Ĵ������£�

```
ConfigurableApplicationContext context = null;
....
// ����applicationContext
context = createApplicationContext();

```

���ǽ��� `SpringApplication#createApplicationContext` ������

```
/** Ĭ�ϵ� ApplicationContext */
public static final String DEFAULT_CONTEXT_CLASS = "org.springframework.context."
        + "annotation.AnnotationConfigApplicationContext";

/** servlet Ӧ�õĵ� ApplicationContext */
public static final String DEFAULT_SERVLET_WEB_CONTEXT_CLASS = "org.springframework.boot."
        + "web.servlet.context.AnnotationConfigServletWebServerApplicationContext";

/** Reactive Ӧ�õ� ApplicationContext */
public static final String DEFAULT_REACTIVE_WEB_CONTEXT_CLASS = "org.springframework."
        + "boot.web.reactive.context.AnnotationConfigReactiveWebServerApplicationContext";

protected ConfigurableApplicationContext createApplicationContext() {
    Class<?> contextClass = this.applicationContextClass;
    if (contextClass == null) {
        try {
            // ����Ӧ��������������ͬ������
            switch (this.webApplicationType) {
            case SERVLET:
                // ʹ�õ��� AnnotationConfigServletWebServerApplicationContext
                contextClass = Class.forName(DEFAULT_SERVLET_WEB_CONTEXT_CLASS);
                break;
            case REACTIVE:
                contextClass = Class.forName(DEFAULT_REACTIVE_WEB_CONTEXT_CLASS);
                break;
            default:
                // Ĭ��ʹ�õ��� AnnotationConfigApplicationContext
                contextClass = Class.forName(DEFAULT_CONTEXT_CLASS);
            }
        }
        catch (ClassNotFoundException ex) {
            throw new IllegalStateException(...);
        }
    }
    // ʹ�÷������ʵ����
    return (ConfigurableApplicationContext) BeanUtils.instantiateClass(contextClass);
}

```

���������Ҫ���Ǹ���Ӧ��������������ͬ `ApplicationContext`��ʹ�÷���ķ�������ʵ��������Ӧ�����Ͷ�Ӧ�� `ApplicationContext` ���£�

1.  `servlet` Ӧ�ã�`AnnotationConfigServletWebServerApplicationContext`
2.  `reactive` Ӧ�ã�`AnnotationConfigReactiveWebServerApplicationContext`
3.  ���϶����ǣ�`AnnotationConfigApplicationContext`

��ǰӦ�õ������� `servlet`����˴����� `ApplicationContext` �� `AnnotationConfigReactiveWebServerApplicationContext`�����������Ĺ��췽����

```
public class AnnotationConfigServletWebServerApplicationContext 
        extends ServletWebServerApplicationContext implements AnnotationConfigRegistry {

    // �������� BeanDefinition ��ע��
    private final AnnotatedBeanDefinitionReader reader;

    // �����������ɨ��
    private final ClassPathBeanDefinitionScanner scanner;

    ...

    public AnnotationConfigServletWebServerApplicationContext() {
        this.reader = new AnnotatedBeanDefinitionReader(this);
        this.scanner = new ClassPathBeanDefinitionScanner(this);
    }

    ...
}

```

`AnnotationConfigServletWebServerApplicationContext` �Ĺ��췽�����ǱȽϼ򵥵ģ�ֻ���������������ԣ��Ͳ���˵�ˡ�����������ҲҪ��Ŀ���Զһ�㣬�����丸��Ĺ��췽���������� `GenericApplicationContext` �Ĺ��췽�����ҵ���ôһ�䣺

```
public GenericApplicationContext() {
    this.beanFactory = new DefaultListableBeanFactory();
}

```

���д��봴���� `DefaultListableBeanFactory` �����丳ֵ���� `beanFactory`������������� `ApplicationContext` ʹ�õ� `beanFactory` ���� `DefaultListableBeanFactory`��

### 3.9 ׼�� ioc ����

������ ioc �����󣬽��ž��Ƕ���������һЩ׼���������������£�

```
public class SpringApplication {

    ...

    private void prepareContext(ConfigurableApplicationContext context, 
            ConfigurableEnvironment environment, SpringApplicationRunListeners listeners, 
            ApplicationArguments applicationArguments, Banner printedBanner) {
        // �������õ�Ӧ�û������õ�IOC������
        context.setEnvironment(environment);
        // ����������һЩ����
        postProcessApplicationContext(context);
        // Ӧ��Initializer���г�ʼ������
        applyInitializers(context);
        //  ��������SpringApplicationRunListeners��contextPrepared����
        // ���ڴ�����׼��ApplicationContext֮�󣬵��ڼ���֮ǰ��
        listeners.contextPrepared(context);
        // ��ӡ����־
        if (this.logStartupInfo) {
            logStartupInfo(context.getParent() == null);
            logStartupProfileInfo(context);
        }
        // ��ȡbeanFactory
        ConfigurableListableBeanFactory beanFactory = context.getBeanFactory();
        // �����в�����Ϊbeanע�ᵽbeanFactory��
        beanFactory.registerSingleton("springApplicationArguments", applicationArguments);
        // �� banner ��Ϊbeanע�ᵽbeanFactory��
        if (printedBanner != null) {
            beanFactory.registerSingleton("springBootBanner", printedBanner);
        }
        if (beanFactory instanceof DefaultListableBeanFactory) {
            // �Ƿ�����bean����Ϣ������
            ((DefaultListableBeanFactory) beanFactory)
                    .setAllowBeanDefinitionOverriding(this.allowBeanDefinitionOverriding);
        }
        // ����������
        if (this.lazyInitialization) {
            context.addBeanFactoryPostProcessor(
                    new LazyInitializationBeanFactoryPostProcessor());
        }
        // ��ȡ������Դ
        Set<Object> sources = getAllSources();
        Assert.notEmpty(sources, "Sources must not be empty");
        // ���� class
        load(context, sources.toArray(new Object[0]));
        // �����¼�
        listeners.contextLoaded(context);
    }
}

```

׼�������Ĳ��軹�Ǻ������ģ���Ҫ���ݶ����ڴ����н�����ע�ͣ������һЩ����������΢չ���¡�

#### 1\. ���� `Environment`

�ò����Ĵ���Ϊ

```
private void prepareContext(ConfigurableApplicationContext context, 
        ConfigurableEnvironment environment, SpringApplicationRunListeners listeners, 
        ApplicationArguments applicationArguments, Banner printedBanner) {
    // �������õ�Ӧ�û������õ�IOC������
    context.setEnvironment(environment);
    ...
}

```

��� `environment` ����ǰ�洴���� `environment`��ioc ����Ҳ��ʹ��������������������ò�����

```
public class AnnotationConfigServletWebServerApplicationContext extends ... {

    ...

    @Override
    public void setEnvironment(ConfigurableEnvironment environment) {
        // ���ø���ķ�����������
        super.setEnvironment(environment);
        // Ҳ��environment���õ�������������
        this.reader.setEnvironment(environment);
        this.scanner.setEnvironment(environment);
    }

    ....
}

```

#### 2\. ���� ioc �Ĳ�������

���������� `postProcessApplicationContext(context);` �����Ĺ�����

```
public class SpringApplication {

    ...

    protected void postProcessApplicationContext(ConfigurableApplicationContext context) {
        // ���� beanNameGenerator���������� bean �����ƣ����ﴫ�����null
        if (this.beanNameGenerator != null) {
            context.getBeanFactory().registerSingleton(
                    AnnotationConfigUtils.CONFIGURATION_BEAN_NAME_GENERATOR,
                    this.beanNameGenerator);
        }
        // ���� resourceLoader����ز���������Ϊnull��if��Ĵ��벻��ִ��
        if (this.resourceLoader != null) {
            if (context instanceof GenericApplicationContext) {
                ((GenericApplicationContext) context).setResourceLoader(this.resourceLoader);
            }
            if (context instanceof DefaultResourceLoader) {
                ((DefaultResourceLoader) context).setClassLoader(
                        this.resourceLoader.getClassLoader());
            }
        }
        // �����ִ��
        if (this.addConversionService) {
            // ��������ת���������StringתNumber��
            context.getBeanFactory().setConversionService(
                    ApplicationConversionService.getSharedInstance());
        }
    }

    ...

}

```

�ⲿ�־������� `ApplicationContext` �ļ������ԣ������ǵ� demo �У�`beanNameGenerator` �� `resourceLoader` ���� `null`����������鶼�������У������еľ�ֻ�������룺

```
 context.getBeanFactory().setConversionService(
        ApplicationConversionService.getSharedInstance());

```

`ConversionService` ��ǰ��Ҳ�ᵽ��������Ҫ���������в�������ת���ġ�

#### 3\. Ӧ�ó�ʼ������`applyInitializers(context)`

`SpringApplication#applyInitializers` �������£�

```
public class SpringApplication {

    ...

    @SuppressWarnings({ "rawtypes", "unchecked" })
    protected void applyInitializers(ConfigurableApplicationContext context) {
        // getInitializers()����ȡ���еĳ�ʼ����
        for (ApplicationContextInitializer initializer : getInitializers()) {
            Class<?> requiredType = GenericTypeResolver.resolveTypeArgument(initializer.getClass(),
                    ApplicationContextInitializer.class);
            Assert.isInstanceOf(requiredType, context, "Unable to call initializer.");
            // ��һ����initializer��initialize(...)����
            initializer.initialize(context);
        }
    }

}

```

���������Ǻ������ģ����ǻ�ȡ���е� `Initializer`��Ȼ���������������� `initialize(...)` ������

���ﻹ��Ҫ���£�`getInitializers()` ����ô��ȡ `Initializer` ���أ���ش������£�

```
public class SpringApplication {

    private List<ApplicationContextInitializer<?>> initializers;

    ...

    // �ڹ��췽�������õ� initializers
    public SpringApplication(ResourceLoader resourceLoader, Class<?>... primarySources) {
        ...

        // ���ó�ʼ������getSpringFactoriesInstances���� META-INF/spring.factories �л�ȡ����
        setInitializers((Collection) getSpringFactoriesInstances(
                ApplicationContextInitializer.class));

        ...
    }

    // ��ȡ Initializer �Ĳ������������л�ȡ
    public Set<ApplicationContextInitializer<?>> getInitializers() {
        return asUnmodifiableOrderedSet(this.initializers);
    }

    ...

```

���˴���������ˣ���ǰ����� `SpringApplication` �Ĺ��췽��ʱ�������ᵽ springboot ��� `META-INF/spring.factories` ��ȡ���õ� `Initializer`���������õ� `initializers` ���ԣ����������ʹ�� `Initializer` �ĵط��ˡ�

#### 4\. ��ȡ������Դ

�������£�

```
private void prepareContext(ConfigurableApplicationContext context, 
        ConfigurableEnvironment environment, SpringApplicationRunListeners listeners, 
        ApplicationArguments applicationArguments, Banner printedBanner) {
    ...
    // ��ȡ������Դ
    Set<Object> sources = getAllSources();
    ...
}

```

���� `getAllSources()` ������

```
// �� primarySources ����set�У�Ȼ��setת��Ϊ���ɱ��set������
public Set<Object> getAllSources() {
    Set<Object> allSources = new LinkedHashSet<>();
    if (!CollectionUtils.isEmpty(this.primarySources)) {
        allSources.addAll(this.primarySources);
    }
    // sources Ϊ�գ�if��ִ��
    if (!CollectionUtils.isEmpty(this.sources)) {
        allSources.addAll(this.sources);
    }
    return Collections.unmodifiableSet(allSources);
}

```

��������ܼ򵥣���һ�������� `primarySources` ���� `set` �У�Ȼ�� `set` ת��Ϊ���ɱ�� `set`�����ء�

����� `primarySources` ��ɶ�أ������Ҫ�ص� `SpringApplication` �Ĺ��췽���ˣ�

```
public SpringApplication(ResourceLoader resourceLoader, Class<?>... primarySources) {
    ...
    // ���������� primarySources
    Assert.notNull(primarySources, "PrimarySources must not be null");
    this.primarySources = new LinkedHashSet<>(Arrays.asList(primarySources));
    ...
}

```

Ȼ��������ϣ������ `primarySources` �������� `main` �����д���ģ�

```
@SpringBootApplication
public class Demo01Application {

    public static void main(String[] args) {
        // Demo01Application.class ���� primarySources
        SpringApplication.run(Demo01Application.class, args);
    }

}

```

���Ǵ���� `Demo01Application.class` ���� `primarySources`��

��ˣ�`getAllSources()` ������һ�� set��set ��ֻ��һ��Ԫ�أ�`Demo01Application.class`������Ҳ����ͨ����������֤��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-29dd8056dc457c56e6fe41020516d02fe80.png)

#### 5\. ������Դ

��������Ĵ������£�

```
private void prepareContext(ConfigurableApplicationContext context, 
        ConfigurableEnvironment environment, SpringApplicationRunListeners listeners, 
        ApplicationArguments applicationArguments, Banner printedBanner) {
    ...
    // ���� class
    load(context, sources.toArray(new Object[0]));
    ...
}

```

���� `SpringApplication#load` ������

```
public class SpringApplication {
    ...

    protected void load(ApplicationContext context, Object[] sources) {
        // ����һ��BeanDefinition�ļ�����
        BeanDefinitionLoader loader = createBeanDefinitionLoader(
                getBeanDefinitionRegistry(context), sources);
        // ��ǰ beanNameGenerator Ϊ null��������
        if (this.beanNameGenerator != null) {
            loader.setBeanNameGenerator(this.beanNameGenerator);
        }
        // ��ǰ resourceLoader Ϊ null��������
        if (this.resourceLoader != null) {
            loader.setResourceLoader(this.resourceLoader);
        }
        // ��ǰ environment Ϊ null��������
        // ǰ�洴����environment��û�и�ֵ����Ա����
        if (this.environment != null) {
            loader.setEnvironment(this.environment);
        }
        loader.load();
    }
    ...
}

```

����������Ǵ�����һ�� `BeanDefinitionLoader` ʵ���������ȡ�� `source` ���� `BeanDefinitionLoader` �Ĺ��췽���д��뵽ʵ���У�Ȼ��Ը� `loader` ����һϵ�е��������ã�����ٵ����� `load()` ������������Ҫ˵�����ǣ���Ȼǰ�洴���� `environment`���� `this.environment` ����Ϊ `null`��ԭ����ǰ�洴���� `environment` ��û�и�ֵ�� `this.environment`��

���Ǽ��������� `BeanDefinitionLoader#load()`��

```
class BeanDefinitionLoader {

    ...

    int load() {
        int count = 0;
        // ����� sources �о�ֻ��һ��Ԫ�أ�Demo01Application.class
        for (Object source : this.sources) {
            count += load(source);
        }
        return count;
    }

    // ������ز���
    private int load(Object source) {
        Assert.notNull(source, "Source must not be null");
        // Class �������������
        if (source instanceof Class<?>) {
            // source Ϊ Demo01Application.class��������Ҫ��ע�������
            return load((Class<?>) source);
        }
        if (source instanceof Resource) {
            return load((Resource) source);
        }
        if (source instanceof Package) {
            return load((Package) source);
        }
        if (source instanceof CharSequence) {
            return load((CharSequence) source);
        }
        throw new IllegalArgumentException("Invalid source type " + source.getClass());
    }

    // Class ���͵ļ��ز���
    private int load(Class<?> source) {
        // ���� grouovy ���Եģ����ù�
        if (isGroovyPresent() && GroovyBeanDefinitionSource.class.isAssignableFrom(source)) {
            GroovyBeanDefinitionSource loader 
                    = BeanUtils.instantiateClass(source, GroovyBeanDefinitionSource.class);
            load(loader);
        }
        // �Ƿ��� @Component ע��
        if (isComponent(source)) {
            // ���������� BeanDefinition ���󣬲�ע�ᵽspring��
            this.annotatedReader.register(source);
            return 1;
        }
        return 0;
    }
    ...

```

�ڴ��� `BeanDefinitionLoader` ʵ��ʱ��ͨ���乹�췽���� `sources` ������ `BeanDefinitionLoader` ��ʵ���У�`sources` �о�ֻ��һ��Ԫ�أ�`Demo01Application.class`���������ֻ���ע `Class` ������Դ�ļ��ؾͿ����ˣ����յ��� `BeanDefinitionLoader#load(java.lang.Class<?>)` �������÷��������Ĳ���Ϊ���жϴ���� `Class` �Ƿ��� `@Component`������оͽ���ע�ᵽ ioc �����С�

��ô `Demo01Application.class` �Ƿ��� `@Component` ע���أ��еģ��������صñȽ����ע��㼶���£�

```
@SpringBootApplication
public class Demo01Application {
    ...
}

```

���� `@SpringBootApplication`��

```
...
@SpringBootConfiguration
...
public @interface SpringBootApplication {
    ...
}

```

�������� `@SpringBootApplication`��

```
...
@Configuration
public @interface SpringBootConfiguration {
    ...
}

```

�������� `@Configuration`��

```
...
@Component
public @interface Configuration {
    ...
}

```

�������ز��ۣ������� `@Configuration` ע�����ҵ��� `@Component`.

���� `this.annotatedReader.register(source)` ע��ľ������������� [spring ����](https://my.oschina.net/funcy/blog/4527454)�У��Ѿ��������ˣ�����Ͳ��ٷ����ˡ�

����ƪ�������ľ͵������ˣ���ƪ��������ʣ�µ����̡�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-fba95ddd84c68cdd1757f060ab131478a3c.png)

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4884127](https://my.oschina.net/funcy/blog/4884127) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_