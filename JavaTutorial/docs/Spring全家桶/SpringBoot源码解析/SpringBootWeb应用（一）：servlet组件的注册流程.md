�� springboot �У����������Ҫע�� servlet ���������`servlet`��`filter`��`listener`������ô���أ�springboot ���ĵ�Ϊ�����ṩ�� 3 �ַ��������ľ��������� 3 �ַ�����Դ��ʵ�֡�

### 1\. ע�᷽ʽ

#### 1.1 ʹ�� `XxxRegistrationBean` ע��

springboot �ṩ���������͵� `RegistrationBean` ������ servlet ���������ע�ᣬ�ֱ��� `ServletRegistrationBean`��`FilterRegistrationBean`��`ServletListenerRegistrationBean`���������Ǽ�ʾ�������ǵ��÷���

```
/**
 * ׼����һ��servlet
 */
public class MyServlet extends HttpServlet {

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        // ����һЩ����
        ...
    }
}

/**
 * ����ע�����
 */
@Bean
public ServletRegistrationBean registerServlet() {
    ServletRegistrationBean servletRegistrationBean = new ServletRegistrationBean(
            new MyServlet(), "/myServlet");
    // ����һЩ���ò���
    servletRegistrationBean.setXxx();
    ...
    return servletRegistrationBean;
}

```

�����ṩ�� `servlet` ��ע�᷽ʽ��Ҫע�� `filter`��`listener`��ֻ��ʹ�ö�Ӧ�� `RegistrationBean` ���ɣ�����Ͳ�չʾ�ˡ�

#### 1.2 ʹ�� servlet ע��ע��

�� `Servlet 3.0`��servlet �����ṩ�� 3 ��ע�������� `servlet` ���������ע�᣺

*   `@WebServlet`: ���� `servlet` ע��
*   `@WebFilter`: ���� `filter` ע��
*   `@WebListener`: ���� `listener` ע��

������ `servlet` ע��Ϊ������������ `@WebServlet`:

```
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface WebServlet {
    String name() default "";

    String[] value() default {};

    String[] urlPatterns() default {};

    int loadOnStartup() default -1;

    WebInitParam[] initParams() default {};

    boolean asyncSupported() default false;

    String smallIcon() default "";

    String largeIcon() default "";

    String description() default "";

    String displayName() default "";
}

```

���Կ�����`@WebServlet` ֧�ֶ���������ã���ָ�� servlet �����ơ�ӳ��� url ������������ָ��������Ҳ�ṩһ��ʾ����

```
@WebServlet(name = "myServlet", urlPatterns = "/myServlet")
public class JavaServlet extends HttpServlet {

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        // ����һЩ����
        ...
    }

}

```

��������󣬻�Ҫ��һ����Ҫ�Ĳ������Ǿ���ʹ�� `@ServletComponentScan` ������ɨ�蹦�ܣ�

```
// ʹ�� @ServletComponentScan ������ servlet �����ɨ�蹦��
@ServletComponentScan
@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        ...
    }
}

```

#### 1.3 `ServletContextInitializer` ע��

ʹ�����ַ�ʽע�ᣬ��Ҫʵ�� `ServletContextInitializer` �ӿڣ�

```
/**
 * ׼��һ��servlet
 */
public class MyServlet extends HttpServlet {

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        // ����һЩ����
        ...
    }
}

/**
 * ʵ�� ServletContextInitializer 
 */
@Component
public class ServletConfig implements ServletContextInitializer {

    @Override
    public void onStartup(ServletContext servletContext) {
        // ʹ�� servletContext ����ע��
        ServletRegistration initServlet = servletContext.addServlet("myServlet", MyServlet.class);
        // ���Խ���һЩ����
        initServlet.addMapping("/myServlet");
    }

}

```

ʹ�����ַ�ʽע�ᣬ��Ҫʵ�� `ServletContextInitializer`��Ȼ����д `ServletContextInitializer#onStartup` �������� `ServletContextInitializer#onStartup` ʹ�� `ServletContext` �������ע�ᡣ`ServletContext` ������ servlet �����ṩ������������ע����ռ��࣬������ʹ�� `RegistrationBean` ע�ᣬ����ʹ�� `@ServletComponentScan` ɨ��ע�ᣬ���ն���ͨ�� `ServletContext` ע�ᵽ servlet �����С�

### 2\. Դ��ʵ��

�˽������ʹ�ú󣬽��������Ǿ� ����Դ�뿴����Щ���������ʵ�֡�

#### 2.1 `@ServletComponentScan` ɨ��

����ֱ�ӽ��� `@ServletComponentScan`��

```
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(ServletComponentScanRegistrar.class)
public @interface ServletComponentScan {
    ...
}

```

���ע���������� `@Import` ע�⣬������һ���ࣺ`ServletComponentScanRegistrar`�����ǿ�������྿������ɶ��

```
/**
 * ʵ����ImportBeanDefinitionRegistrar
 * ��������ע���� ServletComponentRegisteringPostProcessor
 */
class ServletComponentScanRegistrar implements ImportBeanDefinitionRegistrar {

    private static final String BEAN_NAME = "servletComponentRegisteringPostProcessor";

    @Override
    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, 
            BeanDefinitionRegistry registry) {
        Set<String> packagesToScan = getPackagesToScan(importingClassMetadata);
        if (registry.containsBeanDefinition(BEAN_NAME)) {
            updatePostProcessor(registry, packagesToScan);
        }
        else {
            // ע�� BeanFactoryPostProcessor
            addPostProcessor(registry, packagesToScan);
        }
    }

    /**
     * ע�� BeanFactoryPostProcessor
     * ע���� ServletComponentRegisteringPostProcessor
     */
    private void addPostProcessor(BeanDefinitionRegistry registry, Set<String> packagesToScan) {
        GenericBeanDefinition beanDefinition = new GenericBeanDefinition();
        // ServletComponentRegisteringPostProcessor: ����ɨ��� BeanFactoryPostProcessor
        beanDefinition.setBeanClass(ServletComponentRegisteringPostProcessor.class);
        beanDefinition.getConstructorArgumentValues().addGenericArgumentValue(packagesToScan);
        beanDefinition.setRole(BeanDefinition.ROLE_INFRASTRUCTURE);
        // ServletComponentScanRegistrar ����Ϊ��ע�� ServletComponentRegisteringPostProcessor
        registry.registerBeanDefinition(BEAN_NAME, beanDefinition);
    }

    ...

}

```

���Կ����������ʵ���� `ImportBeanDefinitionRegistrar`����Ҫ���� spring ������ע���� `ServletComponentRegisteringPostProcessor`�����Ǽ�������ȥ������ `ServletComponentRegisteringPostProcessor`��

```
class ServletComponentRegisteringPostProcessor implements BeanFactoryPostProcessor, 
        ApplicationContextAware {

    /**
     * ��Ҫɨ��İ�.
     */
    private final Set<String> packagesToScan;

    /**
     * Ҫɨ��İ��ɹ��췽������
     */
    ServletComponentRegisteringPostProcessor(Set<String> packagesToScan) {
        this.packagesToScan = packagesToScan;
    }

    /**
     * ��д��BeanFactoryPostProcessor�ķ���
     */
    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) 
            throws BeansException {
        // �ж��Ƿ���������Ƕ�� web ������
        if (isRunningInEmbeddedWebServer()) {
            // ɨ������������ɨ�����
            ClassPathScanningCandidateComponentProvider componentProvider 
                    = createComponentProvider();
            for (String packageToScan : this.packagesToScan) {
                // ���а�ɨ�����
                scanPackage(componentProvider, packageToScan);
            }
        }
    }

    ...

}

```

���Կ�����`ServletComponentRegisteringPostProcessor` ʵ���� `BeanFactoryPostProcessor`������д�� `BeanFactoryPostProcessor#postProcessBeanFactory` �����д���ɨ�������ɨ��ǰ�����Ǵ�����ɨ���� `ClassPathScanningCandidateComponentProvider`��Ȼ���ٽ���ɨ�衣

����������ɨ�����Ĵ������� `createComponentProvider()`��

```
// ������� handler
private static final List<ServletComponentHandler> HANDLERS;

static {
    List<ServletComponentHandler> servletComponentHandlers = new ArrayList<>();
    servletComponentHandlers.add(new WebServletHandler());
    servletComponentHandlers.add(new WebFilterHandler());
    servletComponentHandlers.add(new WebListenerHandler());
    HANDLERS = Collections.unmodifiableList(servletComponentHandlers);
}

/**
 * ����ɨ����
 */
private ClassPathScanningCandidateComponentProvider createComponentProvider() {
    // ��������
    ClassPathScanningCandidateComponentProvider componentProvider 
            = new ClassPathScanningCandidateComponentProvider(false);
    componentProvider.setEnvironment(this.applicationContext.getEnvironment());
    componentProvider.setResourceLoader(this.applicationContext);
    for (ServletComponentHandler handler : HANDLERS) {
        // ���ù��˹���
        componentProvider.addIncludeFilter(handler.getTypeFilter());
    }
    return componentProvider;
}

```

`createComponentProvider()` �����У����Ǵ�����ɨ��������Ȼ��������һЩ���ԣ����ž������ù��˹������������ص������¹��˹�������ã���Щ������ `WebServletHandler`/`WebFilterHandler`/`WebListenerHandler` �� `getTypeFilter()` �����ṩ��

`getTypeFilter()` ����λ��һ�����󷽷��У�

```
abstract class ServletComponentHandler {

    private final TypeFilter typeFilter;

    /**
     * ����ע�⣬ת��Ϊ AnnotationTypeFilter ����
     */
    protected ServletComponentHandler(Class<? extends Annotation> annotationType) {
        this.typeFilter = new AnnotationTypeFilter(annotationType);
        ...
    }

    /**
     * ���� TypeFilter
     */
    TypeFilter getTypeFilter() {
        return this.typeFilter;
    }
    ...
}

```

�� `ServletComponentHandler` �У���һ����Ա���� `typeFilter`���ڹ��췽���д���ע��ֵ���ת���� `AnnotationTypeFilter`��Ȼ��ֵ�� `typeFilter`���� `getTypeFilter()` �������صľ������ `typeFilter`��

�˽������ `typeFilter` ����Դ���������������ļ���ʵ���ࣺ

```
/**
 * WebFilterHandler ���췽������Ĳ����� WebFilter
 */
class WebFilterHandler extends ServletComponentHandler {
    WebFilterHandler() {
        super(WebFilter.class);
    }
    ...
}

/**
 * WebListenerHandler ���췽������Ĳ����� WebListener
 */
class WebListenerHandler extends ServletComponentHandler {
    WebListenerHandler() {
        super(WebListener.class);
    }
    ...
}

/**
 * WebServletHandler ���췽������Ĳ����� WebServlet
 */
class WebServletHandler extends ServletComponentHandler {
    WebServletHandler() {
        super(WebServlet.class);
    }
    ...
}

```

�ɴ˾������ˣ�`createComponentProvider()` �õ��� `ClassPathScanningCandidateComponentProvider` ֻ������� 3 ��ע����ࣺ

*   `@WebFilter`
*   `@WebListener`
*   `@WebServlet`

���Ǽ���������������ɨ�����̣�����Ϊ `ServletComponentRegisteringPostProcessor#scanPackage`:

```
private void scanPackage(ClassPathScanningCandidateComponentProvider componentProvider, 
        String packageToScan) {
    for (BeanDefinition candidate : componentProvider.findCandidateComponents(packageToScan)) {
        if (candidate instanceof AnnotatedBeanDefinition) {
            // ����õ��� BeanDefinition
            for (ServletComponentHandler handler : HANDLERS) {
                handler.handle(((AnnotatedBeanDefinition) candidate),
                        (BeanDefinitionRegistry) this.applicationContext);
            }
        }
    }
}

```

���ھ����ɨ�����̣�`ClassPathScanningCandidateComponentProvider#findCandidateComponents` ��������ͬ spring �İ�ɨ�����̻���һ�£�����Ͳ�չ��ϸ���ˣ����ǰ��ص���� `BeanDefinition` �Ĵ����ϣ�Ҳ���� `ServletComponentHandler#handle` ������

```
void handle(AnnotatedBeanDefinition beanDefinition, BeanDefinitionRegistry registry) {
    // ����� annotationType ���ǹ��췽���д����ע�⣬��@WebFilter��@WebListener ��
    Map<String, Object> attributes = beanDefinition.getMetadata()
            .getAnnotationAttributes(this.annotationType.getName());
    // �ж϶�Ӧ��ע���Ƿ���ڣ���������
    if (attributes != null) {
        doHandle(attributes, beanDefinition, registry);
    }
}

```

�ڴ���ɨ��õ��� `BeanDefinition` ʱ���ȱ������е� `handler`(`WebServletHandler`/`WebFilterHandler`/`WebListenerHandler`)��Ȼ����� `ServletComponentHandler#handle` �������д����� `ServletComponentHandler#handle` �У��ֻ�����Ƿ���ڶ�Ӧ��ע���Ƿ���ڣ�ʹ�� `AnnotatedBeanDefinition#getMetadata` ��ȡ��Ӧע�����Ϣ���������Ƿ��������� `doHandler()` ������

��ô��� `doHandler()` ��������ʲô�أ����ǽ��� `WebServletHandler#doHandle`��

```
public void doHandle(Map<String, Object> attributes, AnnotatedBeanDefinition beanDefinition,
        BeanDefinitionRegistry registry) {
    // ע����� ServletRegistrationBean ��Ӧ�� BeanDefinition
    BeanDefinitionBuilder builder = BeanDefinitionBuilder
            .rootBeanDefinition(ServletRegistrationBean.class);
    builder.addPropertyValue("asyncSupported", attributes.get("asyncSupported"));
    builder.addPropertyValue("initParameters", extractInitParameters(attributes));
    builder.addPropertyValue("loadOnStartup", attributes.get("loadOnStartup"));
    // ��ȡ servlet ���ƣ����ָ�������ƣ���ʹ��ָ�����ƣ����û��ָ������ʹ����bean������
    String name = determineName(attributes, beanDefinition);
    builder.addPropertyValue("name", name);
    builder.addPropertyValue("servlet", beanDefinition);
    builder.addPropertyValue("urlMappings", extractUrlPatterns(attributes));
    builder.addPropertyValue("multipartConfig", determineMultipartConfig(beanDefinition));
    registry.registerBeanDefinition(name, builder.getBeanDefinition());
}

```

���Կ��������������Ҫ�Ǵ��� `Servlet` �����ã������� spring ������ע����� `ServletRegistrationBean` ��Ӧ�� `beanDefinition`��

�������� `Handler` ��� `doHandle()` ������������Ҳ��࣬���������� spring ������ע��� `beanDefinition` ������ͬ������Ͳ�ϸ���ˡ�

�����ܽ����⼸��ע�������� spring ������ע��� `beanDefinition`��

*   `@WebServlet`: ע���� `ServletRegistrationBean` ��Ӧ�� `beanDefinition`
*   `@WebFilter`: ע���� `FilterRegistrationBean` ��Ӧ�� `beanDefinition`
*   `@WebListener`: ע���� `ServletListenerRegistrationBean` ��Ӧ�� `beanDefinition`

��ʹ�� `XxxRegistrationBean` ע��ʱ���������ֶ������� `XxxRegistrationBean`��Ȼ��ͨ�� `@Bean` ע��ע�ᵽ spring �����У���ʹ�� `@WebServlet`/`@WebFilter`/`@WebListener` ����һȦ������Ҳ�ǻص��� `XxxRegistrationBean`��

#### 2.2 `XxxRegistrationBean` ��ע��

������ʹ�� `XxxRegistrationBean` ע�ᣬ����ʹ�� `@ServletComponentScan` ɨ��ע�ᣬ���ն���õ� `XxxRegistrationBean` ��Ӧ�� bean�����������Ǿ���̽������Щ bean �����ע�ᵽ servlet �����еġ�

�Ӵ����Ͽ���`ServletRegistrationBean`��`FilterRegistrationBean` �� `ServletListenerRegistrationBean` ���� `ServletContextInitializer` �ӿڵ�ʵ���࣬`ServletRegistrationBean` �ļ̳нṹ���£�

![ͼƬ��������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-0397d56cfb328683ae349d0822db2320231.png)

`ServletContextInitializer` ��ֻ��һ������ `onStartup(...)`��

```
@FunctionalInterface
public interface ServletContextInitializer {

    /**
     * ������� servletContext�������������ǽ��� Servlet��filter��listener ��ע����
     */
    void onStartup(ServletContext servletContext) throws ServletException;

}

```

�����ڽ��� `servlet` ���������ע�᷽ʽʱ�������ᵽ����ͨ��ʵ�� `ServletContextInitializer`����д�� `onStartup()` ��ʵ�� `servlet` �����ע�ᣬ�� `XxxRegistrationBean` �ĵײ�ʵ��Ҳ����ô���ġ�

�� `ServletRegistrationBean`���������������� `onStartup(...)` ��������ɶ��

`ServletRegistrationBean` û����д `onStartup(...)` ������ֱ�Ӽ̳��� `RegistrationBean`:

```
public final void onStartup(ServletContext servletContext) throws ServletException {
    // ��ȡ������Ϣ 
    String description = getDescription();
    // �Ƿ���ע�ᣬĬ��Ϊtrue
    if (!isEnabled()) {
        logger.info(StringUtils.capitalize(description) + " was not registered (disabled)");
        return;
    }
    // ����ע�����
    register(description, servletContext);
}

```

��������������ӣ��Ȼ�ȡ��һ��������Ϣ��Ȼ���ж��Ƿ�����ע�ᣬ���ž��ǽ���ע������ˡ�����ֱ�Ӳ鿴ע����������� `DynamicRegistrationBean#register`:

```
protected final void register(String description, ServletContext servletContext) {
    D registration = addRegistration(description, servletContext);
    if (registration == null) {
        logger.info(...);
        return;
    }
    // ��������
    configure(registration);
}

```

���������Ҫ�����������£�ע�� `servlet` �봦�����ã�������������ע����������� `ServletRegistrationBean#addRegistration` ����:

```
protected ServletRegistration.Dynamic addRegistration(String description, 
        ServletContext servletContext) {
    String name = getServletName();
    // ע��
    return servletContext.addServlet(name, this.servlet);
}

```

ע��������ǱȽϼ򵥵ģ�ֱ�ӵ��� `ServletContext#addServlet` ���С�

�����鿴���ô������� `ServletRegistrationBean#configure` ������

```
protected void configure(ServletRegistration.Dynamic registration) {
    // ���ø���
    super.configure(registration);
    // ����urlMapping
    String[] urlMapping = StringUtils.toStringArray(this.urlMappings);
    if (urlMapping.length == 0 && this.alwaysMapUrl) {
        urlMapping = DEFAULT_MAPPINGS;
    }
    if (!ObjectUtils.isEmpty(urlMapping)) {
        registration.addMapping(urlMapping);
    }
    // ����loadOnStartup
    registration.setLoadOnStartup(this.loadOnStartup);
    // ��������һЩ��������
    if (this.multipartConfig != null) {
        registration.setMultipartConfig(this.multipartConfig);
    }
}

```

����������ǵ����˸���ķ�����Ȼ��������ô����ˣ��������������Ҫ�Ǵ����� `urlMapping` �� `loadOnStartup`���Ͳ����������ˡ�

������������ `super.configure(...)` ������ɶ������ `DynamicRegistrationBean#configure`:

```
/**
 * Ҳ�Ǵ���һЩ����
 */
protected void configure(D registration) {
    registration.setAsyncSupported(this.asyncSupported);
    // ���ó�ʼ������
    if (!this.initParameters.isEmpty()) {
        registration.setInitParameters(this.initParameters);
    }
}

```

���������Ҫ�����˳�ʼ���������á�

������ķ���������`ServletRegistrationBean` �� `onStartup(...)` ������Ҫ����������������

1.  �� `servlet` ��ӵ�������
2.  ���� `servlet` ��������

`FilterRegistrationBean` �� `ServletListenerRegistrationBean` ��ע��������ƣ�����Ͳ���˵�ˡ�

#### 2.3 `ServletContextInitializer#onStartup` ��ִ��

ע�������Ѿ������ˣ������������� `ServletContextInitializer#onStartup` ��������ִ�еġ�ע����һ�������̱Ƚϸ��ӣ����漰�� tomcat ���������̣�����ⲿ��ֻ��ע�ص���룬���������һ�������̡�

�� tomcat ����Ϊ��������һϵ�еĵ��������׷�٣����������� `TomcatStarter` �����еģ��������£�

```
class TomcatStarter implements ServletContainerInitializer {

    private final ServletContextInitializer[] initializers;

    TomcatStarter(ServletContextInitializer[] initializers) {
        this.initializers = initializers;
    }

    @Override
    public void onStartup(Set<Class<?>> classes, ServletContext servletContext) 
            throws ServletException {
        try {
            for (ServletContextInitializer initializer : this.initializers) {
                // ����ִ�� ServletContextInitializer#onStartup����
                initializer.onStartup(servletContext);
            }
        }
        catch (Exception ex) {
            this.startUpException = ex;
            ...
        }
    }

    ...

}

```

`TomcatStarter` �� springboot �ṩ���࣬��ʵ���� `ServletContainerInitializer`�������� `ServletContextInitializer`��`ServletContainerInitializer` ���� tomcat �ṩ�ģ��� tomcat ����ʱ����ִ�� `ServletContainerInitializer#onStartup` ������`servlt 3.0` �淶����

��ô `TomcatStarter` �������ӵ� tomcat �����е��أ���Ȼ `servlt 3.0` �淶����ͨ�� `spi` ����ɨ�赽 `ServletContainerInitializer` ��ʵ�֣������������Բ����������ģ���Ϊ����� tomcat ͨ�� `spi` ɨ��õ� `TomcatStarter` ��ʵ���������ĳ�Ա���� `initializers` ���޷���ֵ�ˣ���������ӵ� tomcat ǰ��`TomcatStarter` ��Ҫʵ�������� `initializers` ��Ҫ����ֵ��

������ε��ԣ����� `TomcatStarter` ���� `TomcatServletWebServerFactory#configureContext` ����ӵ� tomcat �����ģ��ؼ���������:

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-6625407ce4d1dad8de736db00db124a2a99.png)

���Կ�����`initializers` ����������������뵽 `TomcatStarter` �Ĺ��췽���У��õ� `TomcatStarter` ��ʵ�������ֶ���ӵ� tomcat �������ˡ�

��ô����� `initializers` ���������ȡ�����أ���ʵ�ϣ����ǵ� `XxxRegistrationBean` ��Ҫ spring �����У�Ҫ��ȡ�Ļ���ֻҪ���� `beanFactory.getBeansOfType(...)` �Ϳ����ˣ�`ServletContextInitializerBeans#addServletContextInitializerBean(String, ServletContextInitializer, ListableBeanFactory)` ���Ǹ�����µģ�

```
private void addServletContextInitializerBeans(ListableBeanFactory beanFactory) {
    for (Class<? extends ServletContextInitializer> initializerType : this.initializerTypes) {
        // ��ȡ ServletContextInitializer: getOrderedBeansOfType(beanFactory, initializerType)
        for (Entry<String, ? extends ServletContextInitializer> initializerBean 
                : getOrderedBeansOfType(beanFactory, initializerType)) {
            addServletContextInitializerBean(initializerBean.getKey(), 
                initializerBean.getValue(), beanFactory);
        }
    }
}

/**
 * ������Ӳ���
 */
private void addServletContextInitializerBean(String beanName, 
        ServletContextInitializer initializer, ListableBeanFactory beanFactory) {
    // ��� ServletRegistrationBean
    if (initializer instanceof ServletRegistrationBean) {
        Servlet source = ((ServletRegistrationBean<?>) initializer).getServlet();
        addServletContextInitializerBean(Servlet.class, beanName, initializer, 
                beanFactory, source);
    }
    // ��� FilterRegistrationBean
    else if (initializer instanceof FilterRegistrationBean) {
        Filter source = ((FilterRegistrationBean<?>) initializer).getFilter();
        addServletContextInitializerBean(Filter.class, beanName, initializer, 
                beanFactory, source);
    }
    // ��� DelegatingFilterProxyRegistrationBean
    else if (initializer instanceof DelegatingFilterProxyRegistrationBean) {
        String source = ((DelegatingFilterProxyRegistrationBean) initializer).getTargetBeanName();
        addServletContextInitializerBean(Filter.class, beanName, initializer, beanFactory, source);
    }
    // ��� ServletListenerRegistrationBean
    else if (initializer instanceof ServletListenerRegistrationBean) {
        EventListener source = ((ServletListenerRegistrationBean<?>) initializer).getListener();
        addServletContextInitializerBean(EventListener.class, beanName, initializer, 
                beanFactory, source);
    }
    else {
        // ������ ServletContextInitializer Bean
        addServletContextInitializerBean(ServletContextInitializer.class, beanName, 
                initializer, beanFactory, initializer);
    }
}

```

### 3\. �ܽ�

���ķ����� springboot ע�� servlet ������������̣�

1.  �� `Servlet` Ϊ���������� 3 ��ע�᷽ʽ��ʹ�� `XxxRegistrationBean` ע�ᡢʹ�� `servlet` ע�� (`@WebServlet`/`@WebFilter`/`@WebListener`) ע�ᣬ�Լ�ʵ�� `ServletContextInitializer` �ӿ��ֶ�ע�᣻
2.  ������ `@ServletComponentScan` ע���ɨ������
3.  �� `ServletRegistrationBean` Ϊ���������˽� `ServletRegistrationBean` ע�ᵽ servlet ������
4.  ������ `ServletContainerInitializer#onStartup` ��ִ��

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4951050](https://my.oschina.net/funcy/blog/4951050) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_