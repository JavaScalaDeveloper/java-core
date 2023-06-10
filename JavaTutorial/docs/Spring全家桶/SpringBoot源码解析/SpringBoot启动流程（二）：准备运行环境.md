�����ģ����Ǽ������������Ľ�����`SpringApplication#run(String...)`������

## 3.`springboot`�����У�`SpringApplication#run(String...)`

�����������£�

```
public ConfigurableApplicationContext run(String... args) {
    // 1\. ���� StopWatch ʵ������ʵ���Ǹ���ʱ��������ͳ��springboot������ʱ
    StopWatch stopWatch = new StopWatch();
    stopWatch.start();
    // ׼���յ�ApplicationContext���Լ�һ���쳣������
    ConfigurableApplicationContext context = null;
    Collection<SpringBootExceptionReporter> exceptionReporters = new ArrayList<>();
    // 2\. ����һ��ϵͳ���ԣ�java.awt.headless��java.awt.headlessģʽ��ϵͳ��һ������ģʽ��
    // ��ϵͳ����ȱ����ʾ�豸�����̻������Щ���������¿���ʹ�ø�ģʽ
    configureHeadlessProperty();
    // 3\. ��ȡ��������Ҳ�Ǵ� META-INF/spring.factories �л�ȡ
    SpringApplicationRunListeners listeners = getRunListeners(args);
    // starting()���״�����run����ʱ�������á������ڷǳ����ڵĳ�ʼ����׼������ʱ����֮ǰ����
    // 4\. �����¼�
    listeners.starting();
    try {
        // ��װ����Ĳ���
        ApplicationArguments applicationArguments = new DefaultApplicationArguments(args);
        // 5\. ����������
        ConfigurableEnvironment environment 
                = prepareEnvironment(listeners, applicationArguments);
        // 6\. ��������� spring.beaninfo.ignore���򽫸��������ý�ϵͳ����
        configureIgnoreBeanInfo(environment);
        // 7\. ���banner
        Banner printedBanner = printBanner(environment);
        // 8\. ����applicationContext
        context = createApplicationContext();
        // �������󱨸���Զ���ص��ӿ�
        exceptionReporters = getSpringFactoriesInstances(SpringBootExceptionReporter.class,
                new Class[] { ConfigurableApplicationContext.class }, context);
        // 9\. ׼�������ģ�������һϵ�е�����ֵ
        prepareContext(context, environment, listeners, applicationArguments, printedBanner);
        // 10\. ���� AbstractApplicationContext.refresh������spring����
        refreshContext(context);
        // 11\. ˢ�º�Ĵ���
        afterRefresh(context, applicationArguments);
        stopWatch.stop();
        if (this.logStartupInfo) {
            new StartupInfoLogger(this.mainApplicationClass)
                .logStarted(getApplicationLog(), stopWatch);
        }
        // 12\. �����¼�
        listeners.started(context);
        // 13\. ���� runner��ʵ���� ApplicationRunner��CommandLineRunner �Ľӿ�
        callRunners(context, applicationArguments);
    }
    catch (Throwable ex) {
        handleRunFailure(context, ex, exceptionReporters, listeners);
        throw new IllegalStateException(ex);
    }
    try {
        // 14\. �����¼�
        listeners.running(context);
    }
    catch (Throwable ex) {
        handleRunFailure(context, ex, exceptionReporters, null);
        throw new IllegalStateException(ex);
    }
    return context;
}

```

���������������£�

![](https://oscimg.oschina.net/oscnet/up-07a6b491fbe69b8dcbd41e59a8543f06671.png)

�������������ص������ 13 ���������̡�

### 3.1`stopWatch`��������ʱ��������

һ��ʼ��springboot �ʹ�����`stopWatch`ʵ����Ȼ�����`StopWatch#start()`������ʱ���ܣ����������ûɶ��˵�ģ������Ǹ���ʱ������������������ springboot ������ʱ��������־�е�ʱ������������ʱ���õ��ģ�

![](https://oscimg.oschina.net/oscnet/up-70a9e95e6c1208288334341bdb54bd59c17.png)

### 3.2 ����`java.awt.headless`����ֵ

`SpringApplication#configureHeadlessProperty`��������ش������£�

```
public class SpringApplication {

    private static final String SYSTEM_PROPERTY_JAVA_AWT_HEADLESS = "java.awt.headless";

    ...

    private boolean headless = true;

    public void setHeadless(boolean headless) {
        this.headless = headless;
    }
    ...

    private void configureHeadlessProperty() {
        // �� java.awt.headless ��ֵ���õ�ϵͳ����
        System.setProperty(SYSTEM_PROPERTY_JAVA_AWT_HEADLESS,
                System.getProperty(SYSTEM_PROPERTY_JAVA_AWT_HEADLESS, 
                Boolean.toString(this.headless)));
    }
    ...
}

```

������������ǽ�`java.awt.headless`��ֵ���õ���ϵͳ���������ó�`true`����ʾ����`java.awt.headless`ģʽ����ô���Ǹ�ɶģʽ�أ�����˵����ģʽ����ϵͳȱ������ʾ�豸�����̻����������ģʽ��������һ�㶼������������¹����ġ�

### 3.3 ��ȡ���м�����

��������һ���ǻ�ȡ���м����������Լ��������ڼ��һЩ״̬�������룺

```
// ��ȡ��������Ҳ�Ǵ� META-INF/spring.factories �л�ȡ
SpringApplicationRunListeners listeners = getRunListeners(args);

```

����`SpringApplication#getRunListeners`��

```
public class SpringApplication {
    ...

    private SpringApplicationRunListeners getRunListeners(String[] args) {
        Class<?>[] types = new Class<?>[] { SpringApplication.class, String[].class };
        return new SpringApplicationRunListeners(logger,
                // ��Ȼ�Ǵ�META-INF/spring.factories �л�ȡ��key �� SpringApplicationRunListener
                getSpringFactoriesInstances(SpringApplicationRunListener.class, types, this, args));
    }
    ...
}

```

���Կ�����`SpringApplicationRunListener`��Ȼ�Ǵ�`META-INF/spring.factories`�л�ȡ����`SpringApplicationRunListener`�Ǹ�ɶ�أ������������룺

```
public interface SpringApplicationRunListener {

    /**
     * �״�����run����ʱ�������á������ڷǳ����ڵĳ�ʼ����
     */
    default void starting() {
    }

    /**
     * ׼���û�����Environment������ɣ������ڴ���ApplicationContext֮ǰ���á�
     */
    default void environmentPrepared(ConfigurableEnvironment environment) {
    }

    /**
     * �ڴ����͹���ApplicationContext֮�󣬵��ڼ���֮ǰ���á�
     */
    default void contextPrepared(ConfigurableApplicationContext context) {
    }

    /**
     * ApplicationContext�Ѽ��ص���ˢ��֮ǰ���á�
     */
    default void contextLoaded(ConfigurableApplicationContext context) {
    }

    /**
     * ApplicationContext��ˢ�£�Ӧ�ó�����������
     * ����δ����CommandLineRunners��ApplicationRunners��
     */
    default void started(ConfigurableApplicationContext context) {
    }

    /**
     * �����з����������֮ǰ�������ã�
     * ˢ��ApplicationContext����������CommandLineRunners��ApplicationRunner��
     */
    default void running(ConfigurableApplicationContext context) {
    }

    /**
     * ������Ӧ�ó���ʱʧ��ʱ���á�
     */
    default void failed(ConfigurableApplicationContext context, Throwable exception) {
    }
}

```

`SpringApplicationRunListener`��һ���ӿڣ�������һϵ�еķ��������� springboot ���������̣�������˵���Ѿ����ĵ�������ϸ���壬���������Ҫ�� springboot �������е�ĳ��������һЩ���飬�Ϳ���ʵ��`SpringApplicationRunListener`Ȼ����д��Ӧ�ķ�����

ͨ�����ԣ����� springboot ��õ����м��������£�

![](https://oscimg.oschina.net/oscnet/up-3ed62d827b3bf1989af74f9c4db1fc0b9ce.png)

### 3.4 ���м�����������`listeners.starting()`

�ص�`SpringApplication#run(java.lang.String...)`����ȡ�����м������󣬻���������`starting()`���������������¼���

```
// ��ȡ������
SpringApplicationRunListeners listeners = getRunListeners(args);
// starting()���״�����run����ʱ�������á������ڷǳ����ڵĳ�ʼ����׼������ʱ����֮ǰ����
listeners.starting();

```

����`SpringApplicationRunListeners#starting`������

```
void starting() {
    for (SpringApplicationRunListener listener : this.listeners) {
        listener.starting();
    }
}

```

���Կ�������ν�ķ����¼������Ǳ������еļ���������һ������`starting()`���ˣ�`this.listeners`���������ȡ�������е����м�������������ˣ�`SpringApplicationRunListener`������������`environmentPrepared(...)`��`contextPrepared(...)`�ȶ��������ĵ�����·�����濴���˾Ͳ��ظ������ˡ�

### 3.5 ׼������ʱ����

�����������������������Ĵ����������£�

```
// ��װ����Ĳ���
ApplicationArguments applicationArguments = new DefaultApplicationArguments(args);
// ����������
ConfigurableEnvironment environment = prepareEnvironment(listeners, applicationArguments);

```

����`SpringApplication#prepareEnvironment`��

```
private ConfigurableEnvironment prepareEnvironment(SpringApplicationRunListeners listeners,
        ApplicationArguments applicationArguments) {
    // ��ȡ����������������򴴽�
    ConfigurableEnvironment environment = getOrCreateEnvironment();
    // ��������ʱ����
    configureEnvironment(environment, applicationArguments.getSourceArgs());
    ConfigurationPropertySources.attach(environment);
    //  SpringApplicationRunListener �� environmentPrepared ����
    // ��Environment������ɣ����ڴ���ApplicationContext֮ǰ��
    listeners.environmentPrepared(environment);
    // ������Ӧ�ð�
    bindToSpringApplication(environment);
    if (!this.isCustomEnvironment) {
        environment = new EnvironmentConverter(getClassLoader())
                .convertEnvironmentIfNecessary(environment, deduceEnvironmentClass());
    }
    ConfigurationPropertySources.attach(environment);
    return environment;
}

```

���Կ������ֻ���׼�����������ص㽲��

#### 1\. ��ȡ�򴴽�`Environment`

ֱ�ӽ���`SpringApplication#getOrCreateEnvironment`��

```
private ConfigurableEnvironment getOrCreateEnvironment() {
    if (this.environment != null) {
        return this.environment;
    }
    switch (this.webApplicationType) {
    case SERVLET:
        return new StandardServletEnvironment();
    case REACTIVE:
        return new StandardReactiveWebEnvironment();
    default:
        return new StandardEnvironment();
    }
}

```

�Ӵ�����������������Ǹ���Ӧ��������������Ӧ��`Environment`ʵ������ǰӦ��������`SERVLET`������ֱ�ӿ�`StandardServletEnvironment`����δ����ġ�

����֪������ java �У�������ʱ�����ȵ��ø���Ĺ��췽������������ֱ�ӽ���`AbstractEnvironment`���췽����

```

public abstract class AbstractEnvironment implements ConfigurableEnvironment {

    ...

    public AbstractEnvironment() {
        customizePropertySources(this.propertySources);
    }

    ...
}

```

������`AbstractEnvironment`�Ĺ��췽���У�������`customizePropertySources()`�������������`StandardServletEnvironment`ʵ�֣�

```
public class StandardServletEnvironment extends StandardEnvironment 
        implements ConfigurableWebEnvironment {
    public static final String SERVLET_CONTEXT_PROPERTY_SOURCE_NAME = "servletContextInitParams";
    public static final String SERVLET_CONFIG_PROPERTY_SOURCE_NAME = "servletConfigInitParams";
    public static final String JNDI_PROPERTY_SOURCE_NAME = "jndiProperties";

    @Override
    protected void customizePropertySources(MutablePropertySources propertySources) {
        // ��� servletConfigInitParams
        propertySources.addLast(new StubPropertySource(SERVLET_CONFIG_PROPERTY_SOURCE_NAME));
        // ��� servletContextInitParams
        propertySources.addLast(new StubPropertySource(SERVLET_CONTEXT_PROPERTY_SOURCE_NAME));
        if (JndiLocatorDelegate.isDefaultJndiEnvironmentAvailable()) {
            propertySources.addLast(new JndiPropertySource(JNDI_PROPERTY_SOURCE_NAME));
        }
        // ���ø���ķ���
        super.customizePropertySources(propertySources);
    }

    @Override
    public void initPropertySources(@Nullable ServletContext servletContext, 
            @Nullable ServletConfig servletConfig) {
        // �滻�������õ� servletContextInitParams Ϊ servletContext
        // �滻�������õ� servletConfigInitParams Ϊ servletConfig
        WebApplicationContextUtils.initServletPropertySources(
                getPropertySources(), servletContext, servletConfig);
    }

}

```

���Կ�����`StandardServletEnvironment`��`customizePropertySources()`����ֻ������˼��� servlet ��صĲ�����Ȼ���ȥ���ø���Ĺ��췽���ˣ����Ǽ�������`StandardEnvironment`��

������ƺ���û����ʲô�����Ǽ���׷�٣���������Ĺ��췽����

```
public class StandardEnvironment extends AbstractEnvironment {

    /** ϵͳ���� */
    public static final String SYSTEM_ENVIRONMENT_PROPERTY_SOURCE_NAME = "systemEnvironment";

    /** ϵͳ���� */
    public static final String SYSTEM_PROPERTIES_PROPERTY_SOURCE_NAME = "systemProperties";

    @Override
    protected void customizePropertySources(MutablePropertySources propertySources) {
        // ��ȡϵͳ���ԣ����õ��� System.getenv()
        propertySources.addLast(new PropertiesPropertySource(
                SYSTEM_PROPERTIES_PROPERTY_SOURCE_NAME, getSystemProperties()));
        // ��ȡϵͳ���������õ��� System.getProperties()
        propertySources.addLast(new SystemEnvironmentPropertySource(
                SYSTEM_ENVIRONMENT_PROPERTY_SOURCE_NAME, getSystemEnvironment()));
    }

}

```

���Կ�����`StandardEnvironment`��`customizePropertySources()`������Ҫ�ǽ�ϵͳ������ϵͳ������ӵ�`Environment`�С���ʵ���ϣ�`Environment`�а���������ϵͳ�뻷����صĲ���������Ҳ�ṩ��һЩ`getter`�������Ժܷ���ػ�ȡ��Щ������

![](https://oscimg.oschina.net/oscnet/up-d2d69692db15146f2981db94633e7c575d5.png)

��������Ǿ������ˣ�`StandardServletEnvironment`�а������������ݣ�

*   ϵͳ���ԣ�����ƽʱ����`System.getenv()`�õ��Ĳ�����
*   ϵͳ����������ƽʱ����`System.getProperties()`�õ��Ĳ�����
*   `servlet`��`servletContext`��`servletConfig`.

#### 2\. ���û���

���Ǽ������������ſ������û��������̣�Ҳ����`SpringApplication#configureEnvironment`������

```
protected void configureEnvironment(ConfigurableEnvironment environment, String[] args) {
    if (this.addConversionService) {
        // ���ת�����������������ת������ StringתNumber��IntegerתEnum��
        ConversionService conversionService = ApplicationConversionService.getSharedInstance();
        environment.setConversionService((ConfigurableConversionService) conversionService);
    }
    // ������������ӵ� environment ��
    configurePropertySources(environment, args);
    // ���� ActiveProfiles ֵ
    configureProfiles(environment, args);
}

```

����������벻�࣬�ؼ��㶼���ڴ�����ע������ˣ�������Ҫ��΢����`SpringApplication#configurePropertySources`��

```
protected void configurePropertySources(ConfigurableEnvironment environment, String[] args) {
    MutablePropertySources sources = environment.getPropertySources();
    // ����Ĭ�����ԣ����ָ����Ĭ�����ԣ�������������
    if (this.defaultProperties != null && !this.defaultProperties.isEmpty()) {
        sources.addLast(new MapPropertySource("defaultProperties", this.defaultProperties));
    }
    if (this.addCommandLineProperties && args.length > 0) {
        String name = CommandLinePropertySource.COMMAND_LINE_PROPERTY_SOURCE_NAME;
        if (sources.contains(name)) {
            PropertySource<?> source = sources.get(name);
            CompositePropertySource composite = new CompositePropertySource(name);
            composite.addPropertySource(
                    // ��������ʱ����Ĳ���
                    new SimpleCommandLinePropertySource("springApplicationCommandLineArgs", args));
            composite.addPropertySource(source);
            sources.replace(name, composite);
        }
        else {
            sources.addFirst(new SimpleCommandLinePropertySource(args));
        }
    }
}

```

������������Դ���Ĳ������н���������`SimpleCommandLinePropertySource`��

```
public class SimpleCommandLinePropertySource 
        extends CommandLinePropertySource<CommandLineArgs> {

    public SimpleCommandLinePropertySource(String... args) {
        super(new SimpleCommandLineArgsParser().parse(args));
    }
    ...
}

```

���ս����ķ�����`SimpleCommandLineArgsParser#parse`��

```
public class SimpleCommandLineArgsParser {
    public CommandLineArgs parse(String... args) {
        CommandLineArgs commandLineArgs = new CommandLineArgs();
        for (String arg : args) {
            if (arg.startsWith("--")) {
                String optionText = arg.substring(2, arg.length());
                String optionName;
                String optionValue = null;
                if (optionText.contains("=")) {
                    // -- ��ͷ�Ұ��� = �Ĳ������ᱻ������ key/value
                    optionName = optionText.substring(0, optionText.indexOf('='));
                    optionValue = optionText.substring(optionText.indexOf('=')+1, optionText.length());
                }
                else {
                    optionName = optionText;
                }
                if (optionName.isEmpty() || (optionValue != null && optionValue.isEmpty())) {
                    throw new IllegalArgumentException("Invalid argument syntax: " + arg);
                }
                commandLineArgs.addOptionArg(optionName, optionValue);
            }
            else {
                commandLineArgs.addNonOptionArg(arg);
            }
        }
        return commandLineArgs;
    }

    ...
}

```

�����������ǱȽϼ򵥵ģ������ַ����Ĵ�����ѡ�

springboot ������������ɶ�ý������أ������� spring ��Ŀʱ�����ǿ�������ָ��������

```
java -jar xxx.jar --a1=aaa --b1=bbb

```

Ȼ�����Ǿ���ͨ��`@Value("${a1}")`��ȡ�����ؼ�������������Կ�����springboot ��Ѵ����`--a1=aaa`��`--b1=bbb`������`a1/aaa`��`b1/bbb`��ֵ�Ե���ʽ�����浽`Environment`������Ҫ�õ�ʱ���Ϳɺܷ���ش�`Environment`�л�ȡ�ˡ�

���ˣ�׼�������ķ����͵������ˡ�

### 3.6 ����ϵͳ����

�����Ҫ��������һ��������`spring.beaninfo.ignore`�����������Ƿ�����`BeanInfo`���������`������Դ���֪Ĭ��ֵ��true`���о��õĲ��࣬�Ͳ������ˡ�

### 3.7 ��ӡ`banner`

`banner`���������ӡ���ģ�

```
Banner printedBanner = printBanner(environment);

```

����Ҳ�����Լ����� banner��������Ͻ̳�һ��ѣ�demo �Ͳ��ṩ�ˡ�

����`banner`���� springboot ���������̹�ϵ���󣬾Ͳ������ˣ�С�����ֻ���˽���ô���ü��ɡ�

���ˣ�����ƪ�������ľ͵������ˣ���ƪ���Ǽ�����

![](https://oscimg.oschina.net/oscnet/up-38d3824690292937a6b0cba5b081c8f8fec.png)

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4882417](https://my.oschina.net/funcy/blog/4882417)���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_