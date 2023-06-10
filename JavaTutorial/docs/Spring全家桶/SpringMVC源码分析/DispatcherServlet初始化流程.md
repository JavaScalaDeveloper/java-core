��[��һƪ����](https://my.oschina.net/funcy/blog/4696657 "��һƪ����")�У�����ͨ��һ���򵥵� demo �ɹ������� springmvc Ӧ�ã����ṩ�� demo �У�����֪�� tomcat ������ʱ����� `MyWebApplicationInitializer#onStartup` ������Ȼ������ spring ��������ô tomcat ������������� spring ���أ�

### 1\. servlet ��ʼ����`DispatcherServlet#init`

�����ٻ����� `MyWebApplicationInitializer#onStartup` ������

```
@Override
public void onStartup(ServletContext servletContext) {
   System.out.println("webApplicationInitializer ...");
   // ���� spring �� applicationContext
   AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
   context.register(MvcConfig.class);

   // ʵ���� DispatcherServlet
   DispatcherServlet servlet = new DispatcherServlet(context);

   // ��DispatcherServletע�ᵽservlet����
   ServletRegistration.Dynamic registration = servletContext.addServlet("app", servlet);
   registration.setLoadOnStartup(1);
   registration.addMapping("/*");
}

```

��δ�����׼����һ�� `AnnotationConfigWebApplicationContext`��������Ϊ�������� `DispatcherServlet` �У�Ȼ���� servlet ��������� `DispatcherServlet`��������servlet ����������ʱ���ͻ����� spring �����ˡ���������Ҫ�ľ��� `DispatcherServlet`�����������Ǿ���������� servlet.

������������ `DispatcherServlet` �ļ̳нṹ��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-1df54493011b3fc9cb9cafbb944f1a88256.png)

����ͼ���Կ�����spring �ṩ�ġ��� servlet ��ص�����������`HttpServletBean`��`FrameworkServlet` �� `DispatcherServlet`����Ϊ servlet������֪�����ʼ������Ϊ `GenericServlet#init()`��Ҳ���� servlet ����ڷ��������ǵķ���Ҳ�������￪ʼ��

���� `DispatcherServlet` ʵ���� `HttpServletBean`��`FrameworkServlet`��`DispatcherServlet#init()` ʵ���ϼ̳��� `HttpServletBean#init`��

```
@Override
public final void init() throws ServletException {

    PropertyValues pvs = new ServletConfigPropertyValues(getServletConfig(), this.requiredProperties);
    if (!pvs.isEmpty()) {
        try {
            BeanWrapper bw = PropertyAccessorFactory.forBeanPropertyAccess(this);
            ResourceLoader resourceLoader = new ServletContextResourceLoader(getServletContext());
            bw.registerCustomEditor(Resource.class, new ResourceEditor(resourceLoader, getEnvironment()));
            initBeanWrapper(bw);
            bw.setPropertyValues(pvs, true);
        }
        catch (BeansException ex) {
            ...
        }
    }

    // ��ʼ�� servlet bean��spring��������þ�����������е�
    initServletBean();
}

```

���Կ������������������һЩ���ã�Ȼ��͵����� `initServletBean`����û����һЩ spring ʵ���Ե����ݡ����Ǽ����������������в���Ҫ�ķ�����������·���£�

```
-HttpServletBean#init
 -FrameworkServlet#initServletBean
  -FrameworkServlet#initWebApplicationContext

```

һֱ���� `FrameworkServlet#initWebApplicationContext`��

```
protected WebApplicationContext initWebApplicationContext() {
    // ��ȡ����ΪWebServerApplicationContext�ĸ�����������õ��Ľ��Ϊnull
    WebApplicationContext rootContext =
            WebApplicationContextUtils.getWebApplicationContext(getServletContext());
    WebApplicationContext wac = null;

    if (this.webApplicationContext != null) {
        // ���webApplicationContext��������MyWebApplicationInitializer#onStart������
        // �����AnnotationConfigWebApplicationContext
        wac = this.webApplicationContext;
        if (wac instanceof ConfigurableWebApplicationContext) {
            ConfigurableWebApplicationContext cwac = (ConfigurableWebApplicationContext) wac;
            if (!cwac.isActive()) {
                if (cwac.getParent() == null) {
                    cwac.setParent(rootContext);
                }
                // ��������� AbstractApplicationContext#refresh ����
                configureAndRefreshWebApplicationContext(cwac);
            }
        }
    }
    // wac��Ϊnull,���ﲻ������
    if (wac == null) {
        wac = findWebApplicationContext();
    }
    // wac��Ϊnull,���ﲻ������
    if (wac == null) {
        // ����WebApplicationContext����������AbstractApplicationContext#refresh
        wac = createWebApplicationContext(rootContext);
    }

    // ʵ���ϣ�refreshEventReceivedΪtrue��if��Ĵ��벢��ִ��
    if (!this.refreshEventReceived) {
        synchronized (this.onRefreshMonitor) {
            // ˢ��Ӧ�������ģ�springmvc��ش�������������
            onRefresh(wac);
        }
    }

    if (this.publishContext) {
        // �� WebApplicationContext��ΪservletContext һ�����ԣ����뵽 servletContext ��
        // ֮��Ϳ���ʹ��
        // WebApplicationContextUtils.getWebApplicationContext(ServletContext, String attrName)
        // ����ȡ
        String attrName = getServletContextAttributeName();
        getServletContext().setAttribute(attrName, wac);
    }

    return wac;
}

```

�����������ز�������������ע�ͣ�ʵ������������� ��Ҫ�Ĵ���Ϊ

```
protected WebApplicationContext initWebApplicationContext() {
    ...
    // ��������� AbstractApplicationContext#refresh ����
    configureAndRefreshWebApplicationContext(cwac);
    ...
    return wac;
}

```

��ط������£�

> FrameworkServlet#configureAndRefreshWebApplicationContext

```
protected void configureAndRefreshWebApplicationContext(ConfigurableWebApplicationContext wac) {
    if (ObjectUtils.identityToString(wac).equals(wac.getId())) {
        if (this.contextId != null) {
            wac.setId(this.contextId);
        }
        else {
            // Generate default id...
            wac.setId(ConfigurableWebApplicationContext.APPLICATION_CONTEXT_ID_PREFIX +
                    ObjectUtils.getDisplayString(getServletContext().getContextPath()) + 
                    '/' + getServletName());
        }
    }
    wac.setServletContext(getServletContext());
    wac.setServletConfig(getServletConfig());
    wac.setNamespace(getNamespace());
    // ����¼�������������spring��������¼�
    // ���������ʮ����Ҫ����������
    wac.addApplicationListener(new SourceFilteringListener(wac, new ContextRefreshListener()));
    ConfigurableEnvironment env = wac.getEnvironment();
    if (env instanceof ConfigurableWebEnvironment) {
        ((ConfigurableWebEnvironment) env).initPropertySources(getServletContext(), getServletConfig());
    }
    // ��չ�㣬û��ʲô���ܣ����Ժ���չ
    postProcessWebApplicationContext(wac);
    applyInitializers(wac);
    // ���þ��� AbstractApplicationContext.refresh
    wac.refresh();
}

```

�������ʵ���ϻ������� `ConfigurableWebApplicationContext` ��һЩ���ԣ������� `AbstractApplicationContext#refresh` ������ spring ���������� `AbstractApplicationContext#refresh` �ķ��������Բο� [spring ��������֮����ǰ��׼������](https://my.oschina.net/funcy/blog/4633169 "spring��������֮����ǰ��׼������")��

�����spring ���������������ˡ�

### 2. `SourceFilteringListener`�������¼�������

�����и����⣺�� springmvc �У�����֪�� spring ��ʶ�� `@Controller`���� `RequestMapping`/`@PostMapping`/`@GetMapping` ��ע���е�·����װΪһ�� uri���ȴ��ⲿ���ʣ���������һ·�������ƺ� spring ��û������Щ��������ô�ⲿ�ֵĹ�������������е��أ�

ʵ���ϣ�spring �ⲿ�ֵĹ���������������������ɵģ�Ҳ����

```
wac.addApplicationListener(new SourceFilteringListener(wac, new ContextRefreshListener()));

```

����������������� spring ������ �¼������� spring ����������ɺ���á�

���� spring ���¼�������ݣ����Բο� [spring ̽��֮ spring �¼�����](https://my.oschina.net/funcy/blog/4713339 "spring̽��֮spring �¼�����")������ֱ��˵���ۣ�spring ���ṩ�� `ApplicationEventPublisher#publishEvent(Object)`���¼�����������`ApplicationEvent`���¼����� `ApplicationListener` ���¼������������� spring ͨ�� `ApplicationEventPublisher#publishEvent(Object)` ���� `ApplicationEvent`���¼���ʱ��`ApplicationListener` ���¼��������������������

���������� `SourceFilteringListener`��

```
public class SourceFilteringListener implements GenericApplicationListener, SmartApplicationListener {

    private final Object source;

    @Nullable
    private GenericApplicationListener delegate;

    /**
     * ���췽�������� event �� listener
     */
    public SourceFilteringListener(Object source, ApplicationListener<?> delegate) {
        this.source = source;
        this.delegate = (delegate instanceof GenericApplicationListener ?
                (GenericApplicationListener) delegate : new GenericApplicationListenerAdapter(delegate));
    }

    /**
     * �¼���������
     */
    @Override
    public void onApplicationEvent(ApplicationEvent event) {
        if (event.getSource() == this.source) {
            // �����������¼�����
            onApplicationEventInternal(event);
        }
    }

    /**
     *  �����¼�
     */
    protected void onApplicationEventInternal(ApplicationEvent event) {
        if (this.delegate == null) {
            throw new IllegalStateException(...);
        }
        // ���ջ��ǵ��ô�����¼���������onApplicationEvent����
        this.delegate.onApplicationEvent(event);
    }

    // ʡ����һЩ����
    ...

```

���Կ�����`SourceFilteringListener` ͨ�����췽�������� `ContextRefreshListener` ��ʵ����Ȼ���� `SourceFilteringListener#onApplicationEvent` �����У����յ��õ��� `ContextRefreshListener#onApplicationEvent` ������

���������������� `ContextRefreshListener`��

> FrameworkServlet.ContextRefreshListener

```
private class ContextRefreshListener implements ApplicationListener<ContextRefreshedEvent> {

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        FrameworkServlet.this.onApplicationEvent(event);
    }
}

```

������� `FrameworkServlet` ���ڲ��࣬����ܼ򵥣����յ��õ��� `FrameworkServlet#onApplicationEvent`��

```
public void onApplicationEvent(ContextRefreshedEvent event) {
    // �޸�״̬������ܹؼ������������к�
    // FrameworkServlet#initWebApplicationContext���onRefresh(...)�Ͳ�������
    this.refreshEventReceived = true;
    synchronized (this.onRefreshMonitor) {
         // ������߼�����
         onRefresh(event.getApplicationContext());
    }
}

```

���������� `DispatcherServlet#onRefresh` �����ˣ�

```
@Override
protected void onRefresh(ApplicationContext context) {
    initStrategies(context);
}

/**
 * springmvc���ռ����ؾ���������
 * ��������У���ʼ����springmvc�ĸ������
 */
protected void initStrategies(ApplicationContext context) {
    initMultipartResolver(context);
    initLocaleResolver(context);
    initThemeResolver(context);
    initHandlerMappings(context);
    initHandlerAdapters(context);
    initHandlerExceptionResolvers(context);
    initRequestToViewNameTranslator(context);
    initViewResolvers(context);
    initFlashMapManager(context);
}

```

���Կ������������еķ����� `DispatcherServlet#initStrategies`�����������ֻ�������У��ҳ�ʼ���� springmvc �����������

### 3. `DispatcherServlet#initStrategies`����ʼ�� springmvc ���

spring ��������ɺ󣬻ᷢ����������¼���Ȼ���ɼ����� `SourceFilteringListener` ���������¼���ִ�м����߼������յ��õ� `DispatcherServlet#initStrategies`���������ǽ������� `DispatcherServlet#initStrategies` ��ִ�й��̡�

��ʵ��������ܼ򵥣������� 9 �д��룬ÿ�д��붼��ʼ���� springmvc ��һ��������� `initMultipartResolver`��

```
public static final String MULTIPART_RESOLVER_BEAN_NAME = "multipartResolver";

private void initMultipartResolver(ApplicationContext context) {
    try {
        // ��spring�����л�ȡmultipartResolver����
        this.multipartResolver = context.getBean(MULTIPART_RESOLVER_BEAN_NAME, MultipartResolver.class);
    }
    catch (NoSuchBeanDefinitionException ex) {
        // ��ȡʧ�ܣ�Ĭ��Ϊnull
        this.multipartResolver = null;
        }
    }
}

```

`multipartResolver` �����������ļ��ϴ��� bean���� spring �У����Ǵ����ļ��ϴ�ʱ��һ������������� `multipartResolver` bean��

```
@Bean(name = "multipartResolver")
public MultipartResolver multipartResolver() {
    CommonsMultipartResolver resolver = new CommonsMultipartResolver();
    resolver.setDefaultEncoding("UTF-8");
    resolver.setResolveLazily(true);
    resolver.setMaxInMemorySize(40960);
    //�����ϴ��ļ����Ϊ1G
    resolver.setMaxUploadSize(1024 * 1024 * 1024);
    return resolver;
}

```

���δ���� `multipartResolver` bean��spring Ĭ��Ϊ null���Ͳ��ܽ����ļ��ϴ��ˡ�

�������� `springmvc` `HandlerMappings` �ĳ�ʼ�����̣�

> DispatcherServlet

```
public static final String HANDLER_MAPPING_BEAN_NAME = "handlerMapping";

private static final String DEFAULT_STRATEGIES_PATH = "DispatcherServlet.properties";

private static final Properties defaultStrategies;

static {
    try {
        // ��static���м���DispatcherServlet.properties�ļ�
        ClassPathResource resource = new ClassPathResource(DEFAULT_STRATEGIES_PATH, 
                DispatcherServlet.class);
        defaultStrategies = PropertiesLoaderUtils.loadProperties(resource);
    }
    catch (IOException ex) {
        throw new IllegalStateException(...);
    }
}

/**
 * handlerMappings ����
 */
@Nullable
private List<HandlerMapping> handlerMappings;

/**
 * ��ʼ�� HandlerMappings
 * 1\. ��spring �����л�ȡ HandlerMapping bean��
 *     �����ȡ�ɹ�����ѵõ��Ľ����ֵ��handlerMappings
 * 2\. ���δ��ã����ȡĬ�ϵ� HandlerMapping bean
 */
private void initHandlerMappings(ApplicationContext context) {
    this.handlerMappings = null;
    if (this.detectAllHandlerMappings) {
        // ��������ʵ��HandlerMapping�ӿڵ�bean
        Map<String, HandlerMapping> matchingBeans = BeanFactoryUtils
                .beansOfTypeIncludingAncestors(context, HandlerMapping.class, true, false);
        // ���ﲻΪ�գ�������
        if (!matchingBeans.isEmpty()) {
            this.handlerMappings = new ArrayList<>(matchingBeans.values());
            // ����Spring����������Ǹ����������Ľ�����д���
            // �����ǰhandlerMapping�����Դ������׸���һ��
            AnnotationAwareOrderComparator.sort(this.handlerMappings);
        }
    }
    else {
        try {
            HandlerMapping hm = context.getBean(HANDLER_MAPPING_BEAN_NAME, HandlerMapping.class);
            this.handlerMappings = Collections.singletonList(hm);
        }
        catch (NoSuchBeanDefinitionException ex) {
            // Ignore, we'll add a default HandlerMapping later.
        }
    }
    if (this.handlerMappings == null) {
        // ���δ���handlerMappings�����ȡĬ�ϵ� handlerMappings
        this.handlerMappings = getDefaultStrategies(context, HandlerMapping.class);
    }
}

/**
 * ��ȡĬ�ϵĲ���
 */
protected <T> List<T> getDefaultStrategies(ApplicationContext context, Class<T> strategyInterface) {
    String key = strategyInterface.getName();
    // ��ȡ�����ļ�DispatcherServlet.properties��Ĭ�ϵ� class ����
    String value = defaultStrategies.getProperty(key);
    if (value != null) {
        String[] classNames = StringUtils.commaDelimitedListToStringArray(value);
        List<T> strategies = new ArrayList<>(classNames.length);
        for (String className : classNames) {
            try {
                // ʹ�÷��䴴��bean
                Class<?> clazz = ClassUtils.forName(className, DispatcherServlet.class.getClassLoader());
                Object strategy = createDefaultStrategy(context, clazz);
                strategies.add((T) strategy);
            }
            catch (ClassNotFoundException ex) {
                throw new BeanInitializationException(...);
            }
            catch (LinkageError err) {
                throw new BeanInitializationException(...);
            }
        }
        return strategies;
    }
    else {
        return new LinkedList<>();
    }
}

```

��ʼ�� `HandlerMappings` ʱ��

1.  �ȴ� spring �����л�ȡ `HandlerMapping` bean�������ȡ�ɹ���ʵ��������Ҳ�ܻ�ã�����ѵõ��Ľ����ֵ�� `DispatcherServlet` �� `handlerMappings` ���ԣ�
2.  ���δʧ�ܣ����� spring ������δ���� `HandlerMapping` �����ȡĬ�ϵ� `HandlerMapping` bean.
3.  ��ȡĬ�ϵ� `HandlerMapping` bean ʱ����ȡ `DispatcherServlet.properties` ���ã�Ȼ��ʹ�÷���ʵ������

���������� `DispatcherServlet.properties` �ļ������ļ�λ��` spring-webmvc/src/main/resources/org/springframework/web/servlet/DispatcherServlet.properties`�������������£�

```
org.springframework.web.servlet.LocaleResolver=org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver

org.springframework.web.servlet.ThemeResolver=org.springframework.web.servlet.theme.FixedThemeResolver

org.springframework.web.servlet.HandlerMapping=org.springframework.web.servlet.handler.BeanNameUrlHandlerMapping,\
    org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping,\
    org.springframework.web.servlet.function.support.RouterFunctionMapping
...

```

`DispatcherServlet#initStrategies` ������ `initXxx()` �������ƣ�����Ͳ�һһ�����ˡ�

### 4\. �ܽ�

������Ҫ������ springmvc ���������̣��ܽ����£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-7ab3fae1e39f545c1d7c1811351227fa434.png)

1.  servlet ������������ tomcat������ʱ��ͨ�� spi ����ִ�� `ServletContainerInitializer#onStartup` �������� springmvc ���ṩ�� `SpringServletContainerInitializer` ���������ʵ�֣����� `SpringServletContainerInitializer#onStartup` �����ᱻ���ã�
2.  `SpringServletContainerInitializer#onStartup` �����У�spring ����� `WebApplicationInitializer#onStartup` �������� `MyWebApplicationInitializer` ���������ʵ�֣����� `MyWebApplicationInitializer#onStartup` �ᱻ���ã�
3.  �� `MyWebApplicationInitializer#onStartup` ������ �����Ǵ�����һ�� `applicationContext` ���󣬽����� `DispatcherServlet` �󶨣�Ȼ�� `DispatcherServlet` ע�ᵽ servlet �����У������� tomcat����
4.  `DispatcherServlet` ע�ᵽ servlet �����У������� tomcat���󣬸��� servlet �������ڣ�`DispatcherServlet#init` ���ᱻ���ã�
5.  `DispatcherServlet#init` �л�ִ�� spring �������������̣�spring ���������󣬻ᷢ����������¼���
6.  spring ������ɺ�`ContextRefreshListener` ������� spring ��������¼���`FrameworkServlet.ContextRefreshListener#onApplicationEvent` �����ᱻ���ã����õ��õ� `DispatcherServlet#initStrategies`��
7.  spring ������ `DispatcherServlet#initStrategies` �г�ʼ�� `MultipartResolver`��`LocaleResolver` ���������ν�ĳ�ʼ������ʵ�ǻ�ȡ�򴴽���Ӧ�� bean��Ȼ��ֵ�� `DispatcherServlet` �����ԡ�

���ˣ�springmvc �����������̾�����ˡ������������Ƕ�û�п��� **spring ���� `@RequestMapping` ���������**����ô spring ����δ������������ ����һƪ���½�������

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4710330](https://my.oschina.net/funcy/blog/4710330) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_