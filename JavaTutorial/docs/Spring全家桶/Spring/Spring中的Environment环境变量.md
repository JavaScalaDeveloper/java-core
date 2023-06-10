



��������ڰ����������ø��ٵĴ��롢�����д��������ϵͳ�� Spring Boot ��Ȼ��Ϊ Java Ӧ�ÿ�������ʵ��׼���� Spring Boot �ṩ���ڶ������У�**�Զ�����**�����Ƕ���������������������һ�����ԣ�Spring Boot ������һ����Ϊ������Ա�Զ����������ɿ��伴�á��߱�ĳһ���ܵ� Bean�����������£��Զ����õ� Bean �պ��������ҵ����󣬵���ĳЩ����£����ò������ظ������ǣ����ʱ��ֻ��Ҫ��������������͵� Bean ���ɣ���Ϊ��������Զ����õ� Bean ������`@ConditionalOnMissingBean`ע�����Ρ����˵��ǣ����ֻ����΢��һЩϸ�ڣ�����ĸĶ˿ں� (server.port) ������Դ URL (spring.datasource.url) ����ѹ��û��Ҫ��������`ServerProperties`��`DataSourceProperties`���� Bean �������Զ����õ� Bean�� Spring Boot Ϊ�Զ����õ� Bean �ṩ��1000�������΢�������ԣ�����Ҫ��������ʱ��ֻ��Ҫ�ڻ��������������в����������ļ� (application.properties/application.yml) �н���ָ�����ɣ������ Spring Boot ��`Externalized Configuration` (�����⻯) ���ԡ�

��Ȼ���ⲿ����Դ���������ڻ��������������в����������ļ������֣�����Ȥ�Ķ��߿��������Ķ� Spring Boot �ٷ��ĵ����� Spring �У�`BeanFactory`������ Bean �����Ľ�ɫ����`Environment`ͬ����λΪһ�����������ⲿ����Դ�е����Զ��ᱻ��ӵ� _Environment_ �С�**��΢�����������Ľ��죬�ⲿ����Դ����������_Disconf_��_Apollo_ �� _Nacos_ �ȷֲ�ʽ�������ģ����� Spring �ĵ��̣�����Ҫ�������ף������������ж�ȡ����������Ȼ�ᱻ׷�ӵ� _Environment_ ��**��

����֮����д��ƪ���£�����`jasypt`�������������һ�νӴ�������2018�꣬��ʱ�ͺܺ�������������������ʵ�ֶ��������Լӽ��ܵģ�����������Ҫ��ʵ����ôһ��������������Ҫ��Ϥ Bean ���������ڡ�IoC ������չ�� (IoC Container Extension Points) �� Spring Boot ���������̵�֪ʶ������Ҫ���� _Environment_��

> jasypt ����ʮ�ּ򵥡�����ͨ��`jasypt-maven-plugin`��һ maven ���Ϊ��������ֵ�������ģ�Ȼ����`ENC(����)`�滻��������ֵ���ɡ����£�
>
> ```
> jasypt.encryptor.password=crimson_typhoon
> 
> spring.datasource.url=jdbc:mysql://HOST:PORT/db_sql_boy?characterEncoding=UTF-8
> spring.datasource.hikari.driver-class-name=com.mysql.cj.jdbc.Driver
> spring.datasource.hikari.username=root
> spring.datasource.hikari.password=ENC(qS8+DEIlHxvhPHgn1VaW3oHkn2twrmwNOHewWLIfquAXiCDBrKwvIhDoqalKyhIF)
> ���ƴ���
> ```

## 1 ��ʶ Environmnent

��ʵ�ʹ����У������� _Environment_ �򽻵��Ļ��Ტ���ࣻ���ҵ�� Bean ȷʵ��Ҫ��ȡ�ⲿ����Դ�е�ĳһ����ֵ�������ֶ��� _Environment_ ע�뵽��ҵ�� Bean �У�Ҳ����ֱ��ʵ��`EnvironmentAware`�ӿڣ��õ� _Environment_ ���͵� Bean ʵ��֮�����ͨ��`getProperty()`��ȡ��������ֵ��_Environment_ �ӿ�����������ʾ��

```
public interface Environment extends PropertyResolver {
    String[] getActiveProfiles();
    String[] getDefaultProfiles();
    boolean acceptsProfiles(Profiles profiles);
}

public interface PropertyResolver {
    boolean containsProperty(String key);
    String getProperty(String key);
    String getProperty(String key, String defaultValue);
    <T> T getProperty(String key, Class<T> targetType);
    <T> T getProperty(String key, Class<T> targetType, T defaultValue);
    String resolvePlaceholders(String text);
}
���ƴ���
```

**��Ҳ�Ҫ�� _Environment_ �� _getProperty()_ �������󵼣��ⲿ����Դ�е����Բ������Ե�������Ϊά�ȱ���ӵ� _Environment_ �еģ�������`PropertySource`Ϊά��**��_PropertySource_ �Ƕ�����Դ���ƺ͸�����Դ��һ�����Եĳ���`MapPropertySource`��һ����򵥵�ʵ�֣���ͨ�� _Map<String, Object>_ ��������ص����ԡ�_PropertySource_ �������£�

```
public abstract class PropertySource<T> {
    protected final String name;
    protected final T source;

    public PropertySource(String name, T source) {
        this.name = name;
        this.source = source;
    }

    public String getName() { return this.name; }
    public T getSource() { return this.source; }
    public abstract Object getProperty(String name);
}
���ƴ���
```

������ _PropertySource_ ����������_PropertySource_ �����Ǿ߱�������������ȡ����ֵ��һ�����ġ�

####  ****getProperty()�ڲ�ִ���߼�****

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/QQ%E6%88%AA%E5%9B%BE20230416193319.jpg)

һ�㣬_Environment_ ʵ�����л����һ��`PropertyResolver`���͵ĳ�Ա�������������� _PropertyResolver_ ����ִ�� _getProperty()_ �߼���_PropertyResolver_ ʵ�������ֻ����������Ա�������ֱ��ǣ�`ConversionService`��`PropertySources`�����ȣ�_PropertyResolver_ ���� `PropertySources` �е� _PropertySource_����ȡԭ������ֵ��Ȼ��ί�� _ConversionService_ ��ԭ������ֵ������������ת�� (����б�Ҫ�Ļ�)��**��Ȼ PropertySource �����Ǿ߱�������������ȡ����ֵ��һ�����ģ������߱�ռλ������������ת���������������м�����߱������������� PropertyResolver�� ��Ҳӡ֤��һ�����ӣ��ڼ������ѧ�У�û��ʲô���������м��һ�������˵ģ�����У��Ǿ��ټ�һ��**��

####  ****PropertySource�ڲ������߼�****

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/QQ%E6%88%AA%E5%9B%BE20230416193319.jpg)

_Environment_ ʵ�����г��˳���`PropertyResolver`���͵ĳ�Ա�����⣬����һ��`MutablePropertySources`���͵ĳ�Ա�������������ṩֱ�Ӳ����� _MutablePropertySources_ �ķ���������ֻ��ͨ��`getPropertySources()`������ȡ _MutablePropertySources_ ʵ����Ȼ����� _MutablePropertySources_ �е�`addFirst()`��`addLast()`��`replace()`�ȷ���ȥ���� _PropertySource_��_MutablePropertySources_ �� _PropertySources_ Ψһһ��ʵ���࣬����ͼ��ʾ��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/20230416193420.png)

�ܵ���˵��_Environment_ �Ƕ� _PropertySource_ �� _Profile_ �Ķ�������������� _Profile_ �ĸ����Ӧ�ó�����Ҫ���𵽲�ͬ�����л���ʱ��һЩ������ͨ����������ͬ�����磬����Դ URL �ڿ��������Ͳ��Ի����ͻ᲻һ����Spring ��3.1�汾��ʼ֧�ֻ��� _Profile_ �����������á�

**Profile in Spring 3.1**

�� Spring ����3.1�汾ʱ��Spring Boot ��δ����������˵��ʱ�� _Profile_ ���Ի�����Щ**覴�**�ģ���覲���褡���Ҫ�����ڣ����ͬһ���͵� Bean������������Ρ�һ��������������С覴ã�

```
@Configuration(proxyBeanMethods = false)
public class DataSourceConfig {
    @Bean
    @Profile("dev")
    public DataSource devDataSource () {
        return DataSourceBuilder.create()
                .driverClassName("com.mysql.jdbc.Driver")
                .url("jdbc:mysql://DEV_HOST:PORT/db_sql_boy?characterEncoding=UTF-8")
                .username("dev")
                .password("dev")
                .build();
    }

    @Bean
    @Profile("test")
    public DataSource testDataSource () {
        return DataSourceBuilder.create()
                .driverClassName("com.mysql.jdbc.Driver")
                .url("jdbc:mysql://TEST_HOST:PORT/db_sql_boy?characterEncoding=UTF-8")
                .username("test")
                .password("test")
                .build();
    }
}
���ƴ���
```

**Profile in Spring Boot**

Spring Boot ������`@Profile`ע������ӵ����������ˡ��ٷ��������п϶�Ҳ��ʶ�� _Profile in Spring 3.1_ ������覴ã������� Spring Boot �ĵ�һ�汾 _(1.0.0.RELEASE)_ �о��Ȳ�������֧��Ϊ _application.properties_ �� _application.yml_ ������������� _Profile_ �ˡ�������ζ��һ�����������������ţ�

```
@Configuration(proxyBeanMethods = false)
public class DataSourceConfig {
    @Bean
    public DataSource devDataSource (DataSourceProperties dataSourceProperties) {
        return DataSourceBuilder.create()
                .driverClassName(dataSourceProperties.getDriverClassName())
                .url(dataSourceProperties.getUrl())
                .username(dataSourceProperties.getUsername())
                .password(dataSourceProperties.getPassword())
                .build();
    }
}
���ƴ���
```

_application-dev.properties_ �������£�

```
spring.datasource.url=jdbc:mysql://DEV_HOST:PORT/db_sql_boy?characterEncoding=UTF-8
spring.datasource.hikari.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.hikari.password=dev
spring.datasource.hikari.username=dev
���ƴ���
```

_application-test.properties_ �������£�

```
spring.datasource.url=jdbc:mysql://TEST_HOST:PORT/db_sql_boy?characterEncoding=UTF-8
spring.datasource.hikari.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.hikari.password=test
spring.datasource.hikari.username=test
���ƴ���
```

��ԭ�� Spring 3.1 �� Spring Boot �У�����ͨ��`spring.profiles.active`��Ϊ _Environment_ ָ������� _Profile_������_Environment_ ��Ĭ�ϼ���� _Profile_ ����Ϊ`default`��д����������Ժ�������һ�����⣺һ�㣬`@Profile` ע����Ҫ�� _@Configuration_ ע��� _@Bean_ ע�����ʹ�ã���� _spring.profiles.active_ ��ֵΪ _dev_ ʱ����ô��Щ�� _@Configuration_ �� _@Bean_ ע���� (��û��`@Profile`ע�����Ӱ��) �� Bean ���ᱻ����Ϊ����`BeanDefinition`ʵ���𣿴��ǻ�ġ�`ConfigurationClassPostProcessor`���� _@Configuration_ ���������Ϊ _BeanDefinition_���ڴ˹����л�ִ��`ConditionEvaluator`��`shouldSkip()`��������Ҫ�������£�

```
public class ConditionEvaluator {
    public boolean shouldSkip(AnnotatedTypeMetadata metadata, ConfigurationCondition.ConfigurationPhase phase) {
        if (metadata == null || !metadata.isAnnotated(Conditional.class.getName())) {
            return false;
        }

        if (phase == null) {
            if (metadata instanceof AnnotationMetadata &&
                    ConfigurationClassUtils.isConfigurationCandidate((AnnotationMetadata) metadata)) {
                return shouldSkip(metadata, ConfigurationCondition.ConfigurationPhase.PARSE_CONFIGURATION);
            }
            return shouldSkip(metadata, ConfigurationCondition.ConfigurationPhase.REGISTER_BEAN);
        }

        List<Condition> conditions = new ArrayList<>();
        for (String[] conditionClasses : getConditionClasses(metadata)) {
            for (String conditionClass : conditionClasses) {
                Condition condition = getCondition(conditionClass, this.context.getClassLoader());
                conditions.add(condition);
            }
        }

        AnnotationAwareOrderComparator.sort(conditions);

        for (Condition condition : conditions) {
            ConfigurationCondition.ConfigurationPhase requiredPhase = null;
            if (condition instanceof ConfigurationCondition) {
                requiredPhase = ((ConfigurationCondition) condition).getConfigurationPhase();
            }
            if ((requiredPhase == null || requiredPhase == phase) && !condition.matches(this.context, metadata)) {
                return true;
            }
        }

        return false;
    }
}
���ƴ���
```

`shouldSkip()`������һ�� _if_ �����Ǵ𰸣�`@Profile`ע����`@Conditional(ProfileCondition.class)`���Σ������һ��������ͷ��û��`Condition`����Ӱ��ֱ�ӷ���`false`�ˣ��Ǿ��ǲ����������������˼ඣ�

_Environment_ �е���Щ _PropertySource_ ������ɶ�ð�����Ȼ��Ϊ����� _Bean_ ඣ��ϻ�����˵����ͼ��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/20230416193443.png)

> ������ǰ������ visio �� processOn ��ͼ����һ������ draw.io��û�뵽������㣬ǿ�Ұ���һ����

## 2 Environmnent ��ʼ������

������Ҫ���� Spring Boot �������������� _Environmnt_ �о���ע������Щ _PropertySource_���������λ��`SpringApplication`�е�`run(String... args)`���������£�

```
public class SpringApplication {
    public ConfigurableApplicationContext run(String... args) {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();
        DefaultBootstrapContext bootstrapContext = createBootstrapContext();
        ConfigurableApplicationContext context = null;
        configureHeadlessProperty();
        SpringApplicationRunListeners listeners = getRunListeners(args);
        listeners.starting(bootstrapContext, this.mainApplicationClass);
        try {
            ApplicationArguments applicationArguments = new DefaultApplicationArguments(args);
            ConfigurableEnvironment environment = prepareEnvironment(listeners, bootstrapContext, applicationArguments);
            configureIgnoreBeanInfo(environment);
            Banner printedBanner = printBanner(environment);
            context = createApplicationContext();
            context.setApplicationStartup(this.applicationStartup);
            prepareContext(bootstrapContext, context, environment, listeners, applicationArguments, printedBanner);
            refreshContext(context);
            afterRefresh(context, applicationArguments);
            stopWatch.stop();
            if (this.logStartupInfo) {
                new StartupInfoLogger(this.mainApplicationClass).logStarted(getApplicationLog(), stopWatch);
            }
            listeners.started(context);
            callRunners(context, applicationArguments);
        } catch (Throwable ex) {
            handleRunFailure(context, ex, listeners);
            throw new IllegalStateException(ex);
        }

        try {
            listeners.running(context);
        } catch (Throwable ex) {
            handleRunFailure(context, ex, null);
            throw new IllegalStateException(ex);
        }
        return context;
    }
}
���ƴ���
```

�������Կ�����_Environmnt_ �ĳ�ʼ������`refreshContext(context)`֮ǰ��ɵģ����Ǻ������ʵġ�_run()_ �����ܸ��ӣ����뱾���������ϵ��߼�ֻ��**һ**����

```
prepareEnvironment(listeners, bootstrapContext, applicationArguments);
���ƴ���
```

����ֱ���������������߼���

### 2.1 prepareEnvironment()

��Ȼ���������ݶ���`prepareEnvironment()`�����ڣ������С����һ������

```
public class SpringApplication {
    private ConfigurableEnvironment prepareEnvironment(SpringApplicationRunListeners listeners,
                                                       DefaultBootstrapContext bootstrapContext,
                                                       ApplicationArguments applicationArguments) {
        // 2.1.1
        ConfigurableEnvironment environment = getOrCreateEnvironment();
        // 2.1.2
        configureEnvironment(environment, applicationArguments.getSourceArgs());
        // 2.1.3
        ConfigurationPropertySources.attach(environment);
        // 2.1.4
        listeners.environmentPrepared(bootstrapContext, environment);
        DefaultPropertiesPropertySource.moveToEnd(environment);
        bindToSpringApplication(environment);
        ConfigurationPropertySources.attach(environment);
        return environment;
    }
}
���ƴ���
```

#### 2.1.1 getOrCreateEnvironment()

`getOrCreateEnvironment()`��Ҫ���𹹽� _Environment_ ʵ���������ǰӦ���ǻ���`ͬ������I/O`ģ�͵ģ��� _Environment_ ѡ��`ApplicationServletEnvironment`���෴�أ������ǰӦ���ǻ���`�첽������I/O`ģ�͵ģ��� _Environment_ ѡ��`ApplicationReactiveWebEnvironment`�����ǹ����л������ǻ��� Spring MVC ����Ӧ�ã�Spring MVC ��һ�����`Servlet API`֮�ϡ�����ͬ������ I/O ģ�͵����� Java Web ������ܣ����� I/O ģ����ζ��һ�� HTTP �����Ӧһ���̣߳���ÿһ�� HTTP �������ڸ����߳�����������ɴ���ġ�_ApplicationServletEnvironment_ �̳й�ϵ����ͼ��ʾ��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/20230416193515.png)

����ͼ���Կ��� _ApplicationServletEnvironment_ �����൱�Ӵ���ִ�� _ApplicationServletEnvironment_ ���췽����ʱ���Ȼ�ᴥ���������๹�췽���е��߼���**����Ϊ**��

```
public abstract class AbstractEnvironment implements ConfigurableEnvironment {
    public AbstractEnvironment() {
        this(new MutablePropertySources());
    }

    protected AbstractEnvironment(MutablePropertySources propertySources) {
        this.propertySources = propertySources;
        // createPropertyResolver(propertySources)
        // |___ ConfigurationPropertySources.createPropertyResolver(propertySources)
        //      |___ new ConfigurationPropertySourcesPropertyResolver(propertySources)
        this.propertyResolver = createPropertyResolver(propertySources);
        customizePropertySources(propertySources);
    }
}
���ƴ���
```

```
public class StandardServletEnvironment extends StandardEnvironment implements ConfigurableWebEnvironment {
    @Override
    protected void customizePropertySources(MutablePropertySources propertySources) {
        propertySources.addLast(new StubPropertySource("servletConfigInitParams"));
        propertySources.addLast(new StubPropertySource("servletContextInitParams"));
        super.customizePropertySources(propertySources);
    }
}
���ƴ���
```

```
public class StandardEnvironment extends AbstractEnvironment {
    @Override
    protected void customizePropertySources(MutablePropertySources propertySources) {
        propertySources.addLast(
                new PropertiesPropertySource("systemProperties", (Map) System.getProperties()));
        propertySources.addLast(
                new SystemEnvironmentPropertySource("systemEnvironment", (Map) System.getenv()));
    }
}
���ƴ���
```

���� _ApplicationServletEnvironment_ ���췽����ִ�У���ʱ�� _Environment_ �� _MutablePropertySources_ ���͵ĳ�Ա����`propertySources`���Ѿ�����**��**�� _PropertySource_ �ˣ����������ǣ�`servletConfigInitParams`��`servletContextInitParams`��`systemProperties`��`systemEnvironment`�����⣬ҲҪ��ס _ApplicationServletEnvironment_ �е�������Ҫ��Ա��������`MutablePropertySources`��`ConfigurationPropertySourcesPropertyResolver`��

#### 2.1.2 configureEnvironment()

`configureEnvironment()`�����е��߼�Ҳ�ܼ򵥹������ȣ�Ϊ _Environment_ �е� _PropertySourcesPropertyResolver_ �趨 _ConversionService_��Ȼ���� _Environment_ �е� _MutablePropertySources_ ׷��һ������Ϊ`commandLineArgs`�� _PropertySource_ ʵ����ע��ʹ�õ���`addFirst()`����Ŷ������ζ���������Ϊ`commandLineArgs`�� _PropertySource_ ���ȼ�����ߵġ���Ҫ�߼����£�

```
public class SpringApplication {
    protected void configureEnvironment(ConfigurableEnvironment environment, String[] args) {
        if (this.addConversionService) {
            environment.getPropertyResolver().setConversionService(new ApplicationConversionService());
        }
        if (this.addCommandLineProperties && args.length > 0) {
            MutablePropertySources sources = environment.getPropertySources();
            sources.addFirst(new SimpleCommandLinePropertySource(args));
        }
    }
}
���ƴ���
```

����`SimpleCommandLinePropertySource`��

```
public class SimpleCommandLinePropertySource extends CommandLinePropertySource<CommandLineArgs> {
    public SimpleCommandLinePropertySource(String... args) {
        // �丸�๹�췽��Ϊ��super("commandLineArgs", source)
        super(new SimpleCommandLineArgsParser().parse(args));
    }
}
���ƴ���
```

�����в������ǱȽϳ��õģ��������������� Spring Boot Ӧ��ʱ���������������в�����`java -jar app.jar --server.port=8088`��

#### 2.1.3 ConfigurationPropertySources.attach()

`attach()`������Ҫ������ _Environment_ �� _MutablePropertySources_ ��ͷ��λ�ò����һ������Ϊ`configurationProperties`�� _PropertySource_ ʵ������Ҫ�߼����£�

```
public final class ConfigurationPropertySources {
    public static void attach(org.springframework.core.env.Environment environment) {
        MutablePropertySources sources = ((ConfigurableEnvironment) environment).getPropertySources();
        PropertySource<?> attached = getAttached(sources);
        if (attached != null && attached.getSource() != sources) {
            sources.remove(ATTACHED_PROPERTY_SOURCE_NAME);
            attached = null;
        }
        if (attached == null) {
            sources.addFirst(new ConfigurationPropertySourcesPropertySource("configurationProperties", new SpringConfigurationPropertySources(sources)));
        }
    }

    static PropertySource<?> getAttached(MutablePropertySources sources) {
        return (sources != null) ? sources.get("configurationProperties") : null;
    }
}
���ƴ���
```

���߶�������������˺þã�ѹ��û�����������Ϊ`configurationProperties`�� _PropertySource_ ������ɶ�á���󣬻����ڹٷ��ĵ��й���`Relaxed Binding` (���ɰ�) �������в³���Щ���ߡ�����ͨ������������Ƚ�ֱ�ӡ����ȣ��� _application.properties_ ��׷��һ�������`a.b.my-first-key=hello spring environment`��Ȼ��ͨ�� _Environment_ ȡ������������ֵ�����£�

```
@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        ConfigurableApplicationContext configurableApplicationContext = SpringApplication.run(DemoApplication.class, args);
        ConfigurableWebEnvironment environment = (ConfigurableWebEnvironment)
                configurableApplicationContext.getBean(Environment.class);
        System.out.println(environment.getProperty("a.b.my-first-key"));
    }
}
���ƴ���
```

����Ӧ�ú󣬿���̨��ӡ���� _hello spring environment_ ����������Ԥ��������ġ��ɵ�����ͨ��`environment.getProperty("a.b.myfirstkey")`����`environment.getProperty("a.b.my-firstkey")`��Ȼ�ܹ���ȡ������������ݡ�`a.b.myfirstkey`��`a.b.my-firstkey`�����������ļ��е��������ƣ�ֻ�����ƶ��ѣ����ȷ��**����**��������������Ȥ�Ķ��߿������� DEBUG �������е�ԭ��

#### 2.1.4 listeners.environmentPrepared()

�úڰ壬��λ���У����Ҫ���� ��`environmentPrepared()`������㲥һ��`ApplicationEnvironmentPreparedEvent`�¼���������`EnvironmentPostProcessorApplicationListener`��Ӧ���¼�����Ӧ���ǵ��͵�**�۲���ģʽ**����Ҫ�������£�

```
public class SpringApplicationRunListeners {
    private final List<SpringApplicationRunListener> listeners;

    void environmentPrepared(ConfigurableBootstrapContext bootstrapContext, ConfigurableEnvironment environment) {
        doWithListeners("spring.boot.application.environment-prepared",
                (listener) -> listener.environmentPrepared(bootstrapContext, environment));
    }

    private void doWithListeners(String stepName, Consumer<SpringApplicationRunListener> listenerAction) {
        StartupStep step = this.applicationStartup.start(stepName);
        this.listeners.forEach(listenerAction);
        step.end();
    }
}

public class EventPublishingRunListener implements SpringApplicationRunListener, Ordered {
    @Override
    public void environmentPrepared(ConfigurableBootstrapContext bootstrapContext,
                                    ConfigurableEnvironment environment) {
        this.initialMulticaster.multicastEvent(
                new ApplicationEnvironmentPreparedEvent(bootstrapContext, this.application, this.args, environment));
    }
}

public class SimpleApplicationEventMulticaster extends AbstractApplicationEventMulticaster {
    @Override
    public void multicastEvent(ApplicationEvent event) {
        multicastEvent(event, resolveDefaultEventType(event));
    }

    @Override
    public void multicastEvent(final ApplicationEvent event, @Nullable ResolvableType eventType) {
        ResolvableType type = (eventType != null ? eventType : resolveDefaultEventType(event));
        Executor executor = getTaskExecutor();
        for (ApplicationListener<?> listener : getApplicationListeners(event, type)) {
            if (executor != null) {
                executor.execute(() -> invokeListener(listener, event));
            } else {
                invokeListener(listener, event);
            }
        }
    }
}
���ƴ���
```

��������һ��`EnvironmentPostProcessorApplicationListener`��®ɽ����Ŀ��

```
public class EnvironmentPostProcessorApplicationListener implements SmartApplicationListener, Ordered {
    @Override
    public void onApplicationEvent(ApplicationEvent event) {
        if (event instanceof ApplicationEnvironmentPreparedEvent) {
            onApplicationEnvironmentPreparedEvent((ApplicationEnvironmentPreparedEvent) event);
        }
        if (event instanceof ApplicationPreparedEvent) {
            onApplicationPreparedEvent();
        }
        if (event instanceof ApplicationFailedEvent) {
            onApplicationFailedEvent();
        }
    }
    private void onApplicationEnvironmentPreparedEvent(ApplicationEnvironmentPreparedEvent event) {
        ConfigurableEnvironment environment = event.getEnvironment();
        SpringApplication application = event.getSpringApplication();
        for (EnvironmentPostProcessor postProcessor : getEnvironmentPostProcessors(application.getResourceLoader(), event.getBootstrapContext())) {
            postProcessor.postProcessEnvironment(environment, application);
        }
    }
}
���ƴ���
```

`EnvironmentPostProcessor`�� Spring Boot Ϊ _Environment_ ����������չ�㡣�������ùٷ��ĵ��бȽϾ�����һ�仰��_Allows for customization of the application's Environment prior to the application context being refreshed_��_EnvironmentPostProcessor_ ��һ�������Խӿڣ��������£�

```
public interface EnvironmentPostProcessor {
    void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application);
}
���ƴ���
```

������ _EnvironmentPostProcessorApplicationListener_ �¼������߼��У�`getEnvironmentPostProcessors`������س����е� _EnvironmentPostProcessor_ ����һ���ڲ������߼���

```
public interface EnvironmentPostProcessorsFactory {
    static EnvironmentPostProcessorsFactory fromSpringFactories(ClassLoader classLoader) {
        return new ReflectionEnvironmentPostProcessorsFactory(
                classLoader, 
                SpringFactoriesLoader.loadFactoryNames(EnvironmentPostProcessor.class, classLoader)
        );
    }
}
���ƴ���
```

��������`SpringFactoriesLoader`һ̽������

```
public final class SpringFactoriesLoader {

    public static final String FACTORIES_RESOURCE_LOCATION = "META-INF/spring.factories";

    public static List<String> loadFactoryNames(Class<?> factoryType, ClassLoader classLoader) {
        ClassLoader classLoaderToUse = classLoader;
        if (classLoaderToUse == null) {
            classLoaderToUse = SpringFactoriesLoader.class.getClassLoader();
        }
        String factoryTypeName = factoryType.getName();
        return loadSpringFactories(classLoaderToUse).getOrDefault(factoryTypeName, Collections.emptyList());
    }

    private static Map<String, List<String>> loadSpringFactories(ClassLoader classLoader) {
        Map<String, List<String>> result = cache.get(classLoader);
        if (result != null) {
            return result;
        }

        result = new HashMap<>();
        try {
            Enumeration<URL> urls = classLoader.getResources(FACTORIES_RESOURCE_LOCATION);
            while (urls.hasMoreElements()) {
                URL url = urls.nextElement();
                UrlResource resource = new UrlResource(url);
                Properties properties = PropertiesLoaderUtils.loadProperties(resource);
                for (Map.Entry<?, ?> entry : properties.entrySet()) {
                    String factoryTypeName = ((String) entry.getKey()).trim();
                    String[] factoryImplementationNames = StringUtils.commaDelimitedListToStringArray((String) entry.getValue());
                    for (String factoryImplementationName : factoryImplementationNames) {
                        result.computeIfAbsent(factoryTypeName, key -> new ArrayList<>())
                                .add(factoryImplementationName.trim());
                    }
                }
            }
            result.replaceAll((factoryType, implementations) -> implementations.stream().distinct()
                    .collect(Collectors.collectingAndThen(Collectors.toList(), Collections::unmodifiableList)));
            cache.put(classLoader, result);
        } catch (IOException ex) {
            throw new IllegalArgumentException("Unable to load factories from location [" + FACTORIES_RESOURCE_LOCATION + "]", ex);
        }
        return result;
    }
}
���ƴ���
```

> **Spring SPI**
>
> > _SpringFactoriesLoader_ ��һ���߼����� Spring �е�`SPI`���ƣ�ֱ�׵�˵�����Ǵ�`classpath`�µ�`META-INF/spring.factories` �ļ��м��� _EnvironmentPostProcessor_ ��������������ͽ��Լ�ʵ�ֵ� _EnvironmentPostProcessor_ �ŵ����ļ��о����ˡ���ʵ��`JDK`�е�`SPI`���ƺ����ƹ���

�ڵ�ǰ�汾��Spring Boot ������7�� _EnvironmentPostProcessor_ ʵ���ࡣ�������������Ƚϵ��͵ķ����¡�

**RandomValuePropertySourceEnvironmentPostProcessor**

`RandomValuePropertySourceEnvironmentPostProcessor`�� _Environment_ ��׷����һ������Ϊ`random`�� _PropertySource_����`RandomValuePropertySource`���������£�

```
public class RandomValuePropertySourceEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {
    public static final int ORDER = Ordered.HIGHEST_PRECEDENCE + 1;
    private final Log logger;

    public RandomValuePropertySourceEnvironmentPostProcessor(Log logger) {
        this.logger = logger;
    }

    @Override
    public int getOrder() {
        return ORDER;
    }

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        RandomValuePropertySource.addToEnvironment(environment, this.logger);
    }
}
���ƴ���
```

��ô��� _RandomValuePropertySource_ ��ɶ�����أ���Ҫ����������������������磺`environment.getProperty("random.int(5,10)")`���Ի�ȡһ�����������`random.int`Ϊ���������Ի�ȡһ�� _int_ ���͵����������`random.long`Ϊ���������Ի�ȡһ�� _long_ ���͵����������`random.int(5,10)`Ϊ���������Ի�ȡһ�� _[5, 10}_ ������ _int_ ���͵�������������淨�������̽����

_SystemEnvironmentPropertySourceEnvironmentPostProcessor_

��ǰ��_Environment_ ���Ѿ�����һ������Ϊ`systemEnvironment`�� _PropertySource_����`SystemEnvironmentPropertySource`��`SystemEnvironmentPropertySourceEnvironmentPostProcessor`���ڽ��� _SystemEnvironmentPropertySource_ �滻Ϊ`OriginAwareSystemEnvironmentPropertySource`��զ�е㡰�ѿ��ӷ�ƨ�����һ�١��ĸо��أ�������

```
public class SystemEnvironmentPropertySourceEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {
    public static final int DEFAULT_ORDER = SpringApplicationJsonEnvironmentPostProcessor.DEFAULT_ORDER - 1;
    private int order = DEFAULT_ORDER;

    @Override
    public int getOrder() {
        return this.order;
    }

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String sourceName = "systemEnvironment";
        PropertySource<?> propertySource = environment.getPropertySources().get(sourceName);
        if (propertySource != null) {
            replacePropertySource(environment, sourceName, propertySource, application.getEnvironmentPrefix());
        }
    }
    private void replacePropertySource(ConfigurableEnvironment environment, String sourceName,
                                       PropertySource<?> propertySource, String environmentPrefix) {
        Map<String, Object> originalSource = (Map<String, Object>) propertySource.getSource();
        SystemEnvironmentPropertySource source = new OriginAwareSystemEnvironmentPropertySource(sourceName, originalSource, environmentPrefix);
        environment.getPropertySources().replace(sourceName, source);
    }
}
���ƴ���
```

**SpringApplicationJsonEnvironmentPostProcessor**

������ͨ��`java -jar -Dspring.application.json={"name":"duxiaotou"} app.jar`���� Spring Boot Ӧ�õ�ʱ�򣬸����Իᱻ�Զ���ӵ� JVM ϵͳ������ (��ʵ _-Dkey=value_ ������ʽ�����Ծ������)�����Ч��`System.setProperty(key, value)`����������`SPRING_APPLICATION_JSON`��һϵͳ����ʱ����ȻҲ����`System.getenv()`�г��֡�ǰ�������ᵽ��`System.getProperties()`�������`systemProperties`��һ _PropertySource_����`System.getenv()`��������`systemEnvironment`��һ _PropertySource_��`SpringApplicationJsonEnvironmentPostProcessor`�������ڴ������� _PropertySource_ �г�ȡ�� _spring.application.json_ �� _SPRING_APPLICATION_JSON_ �� _JSON_ �������������� _Environment_ ��׷��һ������Ϊ`spring.application.json`�� _PropertySource_����`JsonPropertySource`��

**ConfigDataEnvironmentPostProcessor**

`ConfigDataEnvironmentPostProcessor`����`optional:classpath:/`��`optional:classpath:/config/`��`optional:file:./`��`optional:file:./config/`��`optional:file:./config/*/`��ЩĿ¼�µ� _application.properties_ �����ļ����س����������ָ���� _spring.profiles.active_�Ļ���ͬʱҲ�Ὣ��ЩĿ¼�µ� _application-{profile}.properties_ �����ļ����س��������գ�_ConfigDataEnvironmentPostProcessor_ ������ _Environment_ ��׷������`OriginTrackedMapPropertySource`������ _PropertySource_ λ�� _Environment_ ��β�������� _application-{profile}.properties_ ������� _OriginTrackedMapPropertySource_ ������ _application.properties_ ������� _OriginTrackedMapPropertySource_ ǰ��ģ���һ��ͦ��Ҫ��

## 3 jasypt ����ԭ����

> `jasypt`�����������`jasypt-spring-boot-starter`�ǲ�ͬ����д�ģ�����ֻ��Ϊ jasypt ��������� Spring Boot ��������������ѡ���������������ʵ������������������

_application.properties_ �����ļ��й�������Դ��������һ�����ܺ�����ģ����£�

```
spring.datasource.hikari.password=ENC(4+t9a5QG8NkNdWVS6UjIX3dj18UtYRMqU6eb3wUKjivOiDHFLZC/RTK7HuWWkUtV)
���ƴ���
```

��`HikariDataSource`��������������󣬸� Bean �� _password_ �ֶε�ֵզ�ͱ�Ϊ���ܺ�� _qwe@1234_ ��һ�������أ���Ȼ��Spring Boot Ϊ _Environment_ �ṩ��`EnvironmentPostProcessor`��һ��չ�����ʵ��͵�컻�գ�������û������������ʹ���� Spring �е�һ�� _IoC ��չ��_����`BeanFactoryPostProcessor`����Ҳ����ȫ���Եģ���Ϊ��ִ�е� _BeanFactoryPostProcessor_ �е�`postProcessBeanFactory()`�߼�ʱ��ֻ�����������`BeanDefinition`�ļ��أ�����û��ʵ���� _BeanDefinition_ ��������Ӧ�� Bean��

���濴һ��`EnableEncryptablePropertiesBeanFactoryPostProcessor`�е����ݣ�

```
public class EnableEncryptablePropertiesBeanFactoryPostProcessor implements BeanFactoryPostProcessor, Ordered {

    private final ConfigurableEnvironment environment;
    private final EncryptablePropertySourceConverter converter;

    public EnableEncryptablePropertiesBeanFactoryPostProcessor(ConfigurableEnvironment environment, EncryptablePropertySourceConverter converter) {
        this.environment = environment;
        this.converter = converter;
    }

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        MutablePropertySources propSources = environment.getPropertySources();
        converter.convertPropertySources(propSources);
    }

    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE - 100;
    }
}
���ƴ���
```

����Դ������� _BeanFactoryPostProcessor_ ����`EncryptablePropertySourceConverter`�� _MutablePropertySources_ ����һ��ת������ôת����ɶ���أ�

���ţ����� _EncryptablePropertySourceConverter_�������������£�

```
public class EncryptablePropertySourceConverter {

    public void convertPropertySources(MutablePropertySources propSources) {
        propSources.stream()
                .filter(ps -> !(ps instanceof EncryptablePropertySource))
                .map(this::makeEncryptable)
                .collect(toList())
                .forEach(ps -> propSources.replace(ps.getName(), ps));
    }

    public <T> PropertySource<T> makeEncryptable(PropertySource<T> propertySource) {
        if (propertySource instanceof EncryptablePropertySource 
                || skipPropertySourceClasses.stream().anyMatch(skipClass -> skipClass.equals(propertySource.getClass()))) {
            return propertySource;
        }
        PropertySource<T> encryptablePropertySource = convertPropertySource(propertySource);
        return encryptablePropertySource;
    }

    private <T> PropertySource<T> convertPropertySource(PropertySource<T> propertySource) {
        PropertySource<T> encryptablePropertySource;
        if (propertySource instanceof SystemEnvironmentPropertySource) {
            encryptablePropertySource = (PropertySource<T>) new EncryptableSystemEnvironmentPropertySourceWrapper((SystemEnvironmentPropertySource) propertySource, propertyResolver, propertyFilter);
        } else if (propertySource instanceof MapPropertySource) {
            encryptablePropertySource = (PropertySource<T>) new EncryptableMapPropertySourceWrapper((MapPropertySource) propertySource, propertyResolver, propertyFilter);
        } else if (propertySource instanceof EnumerablePropertySource) {
            encryptablePropertySource = new EncryptableEnumerablePropertySourceWrapper<>((EnumerablePropertySource) propertySource, propertyResolver, propertyFilter);
        } else {
            encryptablePropertySource = new EncryptablePropertySourceWrapper<>(propertySource, propertyResolver, propertyFilter);
        }
        return encryptablePropertySource;
    }
}
���ƴ���
```

��Ȼ���������ԭ�� _PropertySource_ ת��Ϊ��һ��`EncryptablePropertySourceWrapper`��������϶�����ʵ�����Ľ��ܣ�����ģ�

����������`EncryptablePropertySourceWrapper`���������£�

```
public class EncryptablePropertySourceWrapper<T> extends PropertySource<T> implements EncryptablePropertySource<T> {
    private final CachingDelegateEncryptablePropertySource<T> encryptableDelegate;

    public EncryptablePropertySourceWrapper(PropertySource<T> delegate, EncryptablePropertyResolver resolver, EncryptablePropertyFilter filter) {
        super(delegate.getName(), delegate.getSource());
        encryptableDelegate = new CachingDelegateEncryptablePropertySource<>(delegate, resolver, filter);
    }

    @Override
    public Object getProperty(String name) {
        return encryptableDelegate.getProperty(name);
    }

    @Override
    public PropertySource<T> getDelegate() {
        return encryptableDelegate;
    }
}
���ƴ���
```

ʧ����û����ɶ�����߼��������� _getProperty_ ��������������������߼�ί�ɸ���`CachingDelegateEncryptablePropertySource`��

û�취��ֻ�ܵ� _CachingDelegateEncryptablePropertySource_ ��һ̽�����ˣ�

```
public class CachingDelegateEncryptablePropertySource<T> extends PropertySource<T> implements EncryptablePropertySource<T> {
    private final PropertySource<T> delegate;
    private final EncryptablePropertyResolver resolver;
    private final EncryptablePropertyFilter filter;
    private final Map<String, Object> cache;

    public CachingDelegateEncryptablePropertySource(PropertySource<T> delegate, EncryptablePropertyResolver resolver, EncryptablePropertyFilter filter) {
        super(delegate.getName(), delegate.getSource());
        this.delegate = delegate;
        this.resolver = resolver;
        this.filter = filter;
        this.cache = new HashMap<>();
    }

    @Override
    public PropertySource<T> getDelegate() {
        return delegate;
    }

    @Override
    public Object getProperty(String name) {
        if (cache.containsKey(name)) {
            return cache.get(name);
        }
        synchronized (name.intern()) {
            if (!cache.containsKey(name)) {
                Object resolved = getProperty(resolver, filter, delegate, name);
                if (resolved != null) {
                    cache.put(name, resolved);
                }
            }
            return cache.get(name);
        }
    }
}
���ƴ���
```

���ڣ�������`EncryptablePropertySource`�п����˽��ܵ������߼������У�`EncryptablePropertyDetector`����̽����������Ƿ���Ҫ������ܣ���Ҫͨ���жϸ�����ֵ�Ƿ���`ENC()`������

```
public interface EncryptablePropertySource<T> extends OriginLookup<String> {
    default Object getProperty(EncryptablePropertyResolver resolver, EncryptablePropertyFilter filter, PropertySource<T> source, String name) {
        Object value = source.getProperty(name);
        if (value != null && filter.shouldInclude(source, name) && value instanceof String) {
            String stringValue = String.valueOf(value);
            return resolver.resolvePropertyValue(stringValue);
        }
        return value;
    }
}

public class DefaultPropertyResolver implements EncryptablePropertyResolver {

    private final Environment environment;
    private StringEncryptor encryptor;
    private EncryptablePropertyDetector detector;

    @Override
    public String resolvePropertyValue(String value) {
        return Optional.ofNullable(value)
                .map(environment::resolvePlaceholders)
                .filter(detector::isEncrypted)
                .map(resolvedValue -> {
                    try {
                        String unwrappedProperty = detector.unwrapEncryptedValue(resolvedValue.trim());
                        String resolvedProperty = environment.resolvePlaceholders(unwrappedProperty);
                        return encryptor.decrypt(resolvedProperty);
                    } catch (EncryptionOperationNotPossibleException e) {
                        throw new DecryptionException("Unable to decrypt property: " + value + " resolved to: " + resolvedValue + ". Decryption of Properties failed,  make sure encryption/decryption " +
                                "passwords match", e);
                    }
                })
                .orElse(value);
    }
}
���ƴ���
```

## 4 �ܽ�

�ܽ��Ե����־Ͳ���˵�ˣ�����������˼Ȫӿ����������ˮ300�֡����ϣ����Ҽ�ס�ڵ�ǰ Spring Boot �汾�У���`ApplicationServletEnvironment`���� _Environment_�������ս�ί��`ConfigurationPropertySourcesPropertyResolver`ȥ��ȡ����ֵ��



���ߣ�����Գ��Сͷ
���ӣ�https://juejin.cn/post/7098299623759937543
��Դ��ϡ�����
����Ȩ���������С���ҵת������ϵ���߻����Ȩ������ҵת����ע��������

# �ο�����

https://www.w3cschool.cn/wkspring
https://www.runoob.com/w3cnote/basic-knowledge-summary-of-spring.html
http://codepub.cn/2015/06/21/Basic-knowledge-summary-of-Spring
https://dunwu.github.io/spring-tutorial
https://mszlu.com/java/spring
http://c.biancheng.net/spring/aop-module.html