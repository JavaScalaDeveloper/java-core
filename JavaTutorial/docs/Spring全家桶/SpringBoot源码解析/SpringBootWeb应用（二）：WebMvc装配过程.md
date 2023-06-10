ƽʱ�����У�springboot ���������������е��� web ��Ŀ�����Ľ����� springboot �Զ� springMvc ��Ŀ�����̡�

### 1\. springMvc ���Զ�װ����

springMvc ���Զ�װ����Ϊ

```
@Configuration(proxyBeanMethods = false)
// ����װ������
@ConditionalOnWebApplication(type = Type.SERVLET)
@ConditionalOnClass({ Servlet.class, DispatcherServlet.class, WebMvcConfigurer.class })
// ���û���Զ���WebMvc�������࣬��ʹ�ñ�����
@ConditionalOnMissingBean(WebMvcConfigurationSupport.class)
// װ��˳��
@AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE + 10)
@AutoConfigureAfter({ 
        // DispatcherServlet ���Զ�װ��
        DispatcherServletAutoConfiguration.class, 
        // �̳߳ص��Զ�װ��
        TaskExecutionAutoConfiguration.class,
        // jsr 303 ��֤��ܵ��Զ�װ��
        ValidationAutoConfiguration.class })
public class WebMvcAutoConfiguration {
    ...
}

```

������� `@AutoConfigureAfter` ע���У�`WebMvcAutoConfiguration` ��Ҫ�� `DispatcherServletAutoConfiguration`��`TaskExecutionAutoConfiguration`��`ValidationAutoConfiguration` ����װ�����֮����װ�䣬����Щ��������о����£�

*   `DispatcherServletAutoConfiguration`��`DispatcherServlet` �Զ�װ��
*   `TaskExecutionAutoConfiguration`������ִ��������ʵ���Ǵ�����һ���̳߳�
*   `ValidationAutoConfiguration`��jsr 303 ��֤�����Զ�װ�䣬��֤���������� `@NotNull`��`@NotEmpty` ��ע�����֤����

�� 3 �����У��� springMvc �йص�ֻ�� `DispatcherServletAutoConfiguration`����������ʶһ������

```
@AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE)
@Configuration(proxyBeanMethods = false)
@ConditionalOnWebApplication(type = Type.SERVLET)
@ConditionalOnClass(DispatcherServlet.class)
// ��Ҫ�� ServletWebServerFactoryAutoConfiguration �Զ�װ����ɺ���
@AutoConfigureAfter(ServletWebServerFactoryAutoConfiguration.class)
public class DispatcherServletAutoConfiguration {
    ...
}

```

`DispatcherServletAutoConfiguration` ��Ҫ�� `ServletWebServerFactoryAutoConfiguration` �Զ�װ����ɲŽ���װ�䣬���������ʲô���أ���͸�£����Ǵ��� servlet ������`tomcat`, `jetty`, `undertow` �ȣ������ɵģ������������� `ServletWebServerFactoryAutoConfiguration`��

```
@Configuration(proxyBeanMethods = false)
@AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE)
@ConditionalOnClass(ServletRequest.class)
@ConditionalOnWebApplication(type = Type.SERVLET)
@EnableConfigurationProperties(ServerProperties.class)
// ������һЩ��
@Import({ ServletWebServerFactoryAutoConfiguration.BeanPostProcessorsRegistrar.class,
        // 3�� web ����
        ServletWebServerFactoryConfiguration.EmbeddedTomcat.class,
        ServletWebServerFactoryConfiguration.EmbeddedJetty.class,
        ServletWebServerFactoryConfiguration.EmbeddedUndertow.class })
public class ServletWebServerFactoryAutoConfiguration {
    ...
}

```

���Կ������������������û�� `@AutoConfigureAfter` ע���ˣ��������� springMvc ��������Զ�װ����࣬���ǵķ����ʹ�����࿪ʼ��

�ܽ������ϼ������װ��˳��

1.  `ServletWebServerFactoryAutoConfiguration`
2.  `DispatcherServletAutoConfiguration`
3.  `WebMvcAutoConfiguration`

���������ǵķ���Ҳ��������˳����һ������Щ�Զ�װ���ࡣ

### 2. `ServletWebServerFactoryAutoConfiguration` ���Զ�װ��

`ServletWebServerFactoryAutoConfiguration` �����£�

```
@Configuration(proxyBeanMethods = false)
@AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE)
@ConditionalOnClass(ServletRequest.class)
@ConditionalOnWebApplication(type = Type.SERVLET)
@EnableConfigurationProperties(ServerProperties.class)
// ������һЩ��
@Import({ ServletWebServerFactoryAutoConfiguration.BeanPostProcessorsRegistrar.class,
        // 3�� web ����
        ServletWebServerFactoryConfiguration.EmbeddedTomcat.class,
        ServletWebServerFactoryConfiguration.EmbeddedJetty.class,
        ServletWebServerFactoryConfiguration.EmbeddedUndertow.class })
public class ServletWebServerFactoryAutoConfiguration {
    ...
}

```

����������� `BeanPostProcessorsRegistrar`��`EmbeddedTomcat`��`EmbeddedJetty`��`EmbeddedUndertow`����������һ�����ɣ�

#### 2.1 `BeanPostProcessorsRegistrar`

`BeanPostProcessorsRegistrar` �� `ServletWebServerFactoryAutoConfiguration` ���ڲ��࣬�������£�

```
public static class BeanPostProcessorsRegistrar 
        implements ImportBeanDefinitionRegistrar, BeanFactoryAware {

    ...

    /**
     * ���� ImportBeanDefinitionRegistrar �ķ���
     */
    @Override
    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata,
            BeanDefinitionRegistry registry) {
        if (this.beanFactory == null) {
            return;
        }
        // ע�����
        registerSyntheticBeanIfMissing(registry, "webServerFactoryCustomizerBeanPostProcessor",
                WebServerFactoryCustomizerBeanPostProcessor.class);
        registerSyntheticBeanIfMissing(registry, "errorPageRegistrarBeanPostProcessor",
                ErrorPageRegistrarBeanPostProcessor.class);
    }

    /**
     * �����ע�����
     */
    private void registerSyntheticBeanIfMissing(BeanDefinitionRegistry registry, 
            String name, Class<?> beanClass) {
        if (ObjectUtils.isEmpty(this.beanFactory.getBeanNamesForType(beanClass, true, false))) {
            RootBeanDefinition beanDefinition = new RootBeanDefinition(beanClass);
            beanDefinition.setSynthetic(true);
            registry.registerBeanDefinition(name, beanDefinition);
        }
    }
}

```

�������Ҫ���� spring ������ע���������ࣺ`WebServerFactoryCustomizerBeanPostProcessor`��`ErrorPageRegistrarBeanPostProcessor`���������������Ƿֱ��Ǹ�ɶ��

##### 1. `WebServerFactoryCustomizerBeanPostProcessor`

`WebServerFactoryCustomizerBeanPostProcessor` �Ĵ������£�

```
public class WebServerFactoryCustomizerBeanPostProcessor 
        implements BeanPostProcessor, BeanFactoryAware {

    ...

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) 
            throws BeansException {
        // bean �������� WebServerFactory �Ŵ���
        if (bean instanceof WebServerFactory) {
            postProcessBeforeInitialization((WebServerFactory) bean);
        }
        return bean;
    }

    @SuppressWarnings("unchecked")
    private void postProcessBeforeInitialization(WebServerFactory webServerFactory) {
        LambdaSafe.callbacks(WebServerFactoryCustomizer.class, getCustomizers(), webServerFactory)
                .withLogger(WebServerFactoryCustomizerBeanPostProcessor.class)
                // ��������
                .invoke((customizer) -> customizer.customize(webServerFactory));
    }

    /**
     * ��ȡ WebServerFactoryCustomizer���õ�����һ�����ɱ�� List
     */
    private Collection<WebServerFactoryCustomizer<?>> getCustomizers() {
        if (this.customizers == null) {
            this.customizers = new ArrayList<>(getWebServerFactoryCustomizerBeans());
            this.customizers.sort(AnnotationAwareOrderComparator.INSTANCE);
            this.customizers = Collections.unmodifiableList(this.customizers);
        }
        return this.customizers;
    }

    /**
     * ��ȡ beanFactory �����е� WebServerFactoryCustomizer
     */
    private Collection<WebServerFactoryCustomizer<?>> getWebServerFactoryCustomizerBeans() {
        return (Collection) this.beanFactory.getBeansOfType(
                WebServerFactoryCustomizer.class, false, false).values();
    }

}

```

��������������� `WebServerFactory` ���Զ������õģ���ʵ���� `BeanPostProcessor`�� ������Ҫ��ע���� `postProcessBeforeInitialization(...)` ������

�� `WebServerFactoryCustomizerBeanPostProcessor` �� `postProcessBeforeInitialization(...)` �����У������ǰ bean �������� `WebServerFactory`�����Ȼ�ȡ `beanFactory` ����������Ϊ `WebServerFactoryCustomizer` �� bean��Ȼ����Щ `WebServerFactoryCustomizer` ���õ� `WebServerFactory`bean �С�

�������Ҫ�Զ��� `Tomcat` �����ã�������������

```
@Component
public class MyCustomizer implements WebServerFactoryCustomizer<TomcatServletWebServerFactory> {

    @Override
    public void customize(TomcatServletWebServerFactory factory) {
        factory.setPort(8091);
        factory.setContextPath("/");
        // ������������
        ...
    }

}

```

�� `ServletWebServerFactoryAutoConfiguration` ���ṩ������ `WebServerFactoryCustomizer`:

```
public class ServletWebServerFactoryAutoConfiguration {

    @Bean
    public ServletWebServerFactoryCustomizer servletWebServerFactoryCustomizer(
            ServerProperties serverProperties) {
        return new ServletWebServerFactoryCustomizer(serverProperties);
    }

    @Bean
    @ConditionalOnClass(name = "org.apache.catalina.startup.Tomcat")
    public TomcatServletWebServerFactoryCustomizer tomcatServletWebServerFactoryCustomizer(
            ServerProperties serverProperties) {
        return new TomcatServletWebServerFactoryCustomizer(serverProperties);
    }

    ...

}

```

�ӷ�������������������������ö������� `ServerProperties`��

```
@ConfigurationProperties(prefix = "server", ignoreUnknownFields = true)
public class ServerProperties {
    ...
}

```

�������� `ConfigurationProperties` ע�⣬`prefix` Ϊ "server"��������������ö����� `server` ��ͷ��֧�ֵ��������£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-586d95875e2eeefd295643c3e6acf0091e1.png)

���磬����Ҫ�������Ķ˿ڣ�ֻ���� `application.properties` ���������ü��ɣ�

```
server.port=8080

```

�����������ã�����Ͳ����������ˡ�

##### 2. `ErrorPageRegistrarBeanPostProcessor`

`ErrorPageRegistrarBeanPostProcessor` �Ĵ������£�

```
public class ErrorPageRegistrarBeanPostProcessor implements BeanPostProcessor, BeanFactoryAware {

    /**
     * ����BeanPostProcessor�ķ�������bean��ʼ��ǰִ��
     */
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) 
            throws BeansException {
        if (bean instanceof ErrorPageRegistry) {
            // ��� bean �� ErrorPageRegistry
            postProcessBeforeInitialization((ErrorPageRegistry) bean);
        }
        return bean;
    }

    private void postProcessBeforeInitialization(ErrorPageRegistry registry) {
        for (ErrorPageRegistrar registrar : getRegistrars()) {
            // ע�����ҳ
            registrar.registerErrorPages(registry);
        }
    }

    private Collection<ErrorPageRegistrar> getRegistrars() {
        if (this.registrars == null) {
            // ��ȡ���еĴ���ҳ
            this.registrars = new ArrayList<>(this.beanFactory.getBeansOfType(
                    ErrorPageRegistrar.class, false, false).values());
            this.registrars.sort(AnnotationAwareOrderComparator.INSTANCE);
            this.registrars = Collections.unmodifiableList(this.registrars);
        }
        return this.registrars;
    }

    ...
}

```

������Ҫ��ע `postProcessBeforeInitialization` �����̣�

1.  ��� bean �������� `ErrorPageRegistry`�����е� 2 ��
2.  ��ȡ beanFactory ������ `ErrorPageRegistrar` ���͵� bean���������е� 3 ��
3.  ���� `registrar.registerErrorPages(registry)` ���д���ҳ����

��������������Ҫ˵����

*   `ErrorPageRegistrar`������ҳע�������� `ErrorPageRegistry` �ɻ���ࣩ
*   `ErrorPageRegistry`�������ע�����ࣨʵ�ʸɻ���ࣩ

���������Ҫ�Զ������ҳ������ʵ�� `ErrorPageRegistry` �ӿڣ�

```
@Component
public class MyErrorPage implements ErrorPageRegistrar {

    /**
     * ע�����ҳ
     */
    @Override
    public void registerErrorPages(ErrorPageRegistry errorPageRegistry) {
        // ���յ��õ��� ErrorPageRegistry#addErrorPages ����ע��
        errorPageRegistry.addErrorPages(new ErrorPage("/error/page"));
    }
}

```

#### 2.2 `EmbeddedTomcat`

���� `ServletWebServerFactoryConfiguration.EmbeddedTomcat` �ࣺ

```
@Configuration(proxyBeanMethods = false)
class ServletWebServerFactoryConfiguration {

    @Configuration(proxyBeanMethods = false)
    // ����ע�⣬��������ʱ������
    @ConditionalOnClass({ Servlet.class, Tomcat.class, UpgradeProtocol.class })
    // ע�� ServletWebServerFactory�����ǿ�������ʵ�� tomcat ������װ��
    @ConditionalOnMissingBean(value = ServletWebServerFactory.class, 
        search = SearchStrategy.CURRENT)
    public static class EmbeddedTomcat {

        @Bean
        public TomcatServletWebServerFactory tomcatServletWebServerFactory(
                ObjectProvider<TomcatConnectorCustomizer> connectorCustomizers,
                ObjectProvider<TomcatContextCustomizer> contextCustomizers,
                ObjectProvider<TomcatProtocolHandlerCustomizer<?>> protocolHandlerCustomizers) {
            TomcatServletWebServerFactory factory = new TomcatServletWebServerFactory();
            // ����һЩ����
            factory.getTomcatConnectorCustomizers()
                    .addAll(connectorCustomizers.orderedStream().collect(Collectors.toList()));
            factory.getTomcatContextCustomizers()
                    .addAll(contextCustomizers.orderedStream().collect(Collectors.toList()));
            factory.getTomcatProtocolHandlerCustomizers()
                    .addAll(protocolHandlerCustomizers.orderedStream()
                    .collect(Collectors.toList()));
            return factory;
        }

    }

    ...
}

```

�������Ҫ���Ƿ��� `TomcatServletWebServerFactory` bean������ע��һЩ `connectorCustomizers`��`contextCustomizers`��`protocolHandlerCustomizers` �Ȳ��������Զ������ã���Щ�������Ǵ� `BeanPostProcessorsRegistrar` �����ġ�

�����и��ط���Ҫ��һ�£��������ʹ�� springboot �ṩ�� `TomcatServletWebServerFactory`�����ǿ����Լ�ʵ�� `TomcatServletWebServerFactory`����������

```
@Bean
public ServletWebServerFactory servletWebServerFactory() {
    TomcatServletWebServerFactory tomcat = new TomcatServletWebServerFactory();
    // �����Զ���ĸ�������
    ...
    return tomcat;
}

```

��������֮��springboot �ṩ�� `tomcatServletWebServerFactory` �Ͳ��ᴦ���ˡ�

���������� `EmbeddedJetty`��`EmbeddedUndertow`���� `EmbeddedTomcat` �Ĵ���������ƣ��Ͳ���˵�ˡ�

### 3. `DispatcherServletAutoConfiguration`

������������ `DispatcherServletAutoConfiguration`���ؼ��������£�

```
public class DispatcherServletAutoConfiguration {

    public static final String DEFAULT_DISPATCHER_SERVLET_BEAN_NAME = "dispatcherServlet";

    public static final String DEFAULT_DISPATCHER_SERVLET_REGISTRATION_BEAN_NAME 
            = "dispatcherServletRegistration";

    @Configuration(proxyBeanMethods = false)
    @Conditional(DefaultDispatcherServletCondition.class)
    @ConditionalOnClass(ServletRegistration.class)
    @EnableConfigurationProperties({ HttpProperties.class, WebMvcProperties.class })
    protected static class DispatcherServletConfiguration {

        /**
         * ���������� DispatcherServlet.
         * @param httpProperties http����.
         * @param webMvcProperties webMvc ����.
         * @return ���ض���
         */
        @Bean(name = DEFAULT_DISPATCHER_SERVLET_BEAN_NAME)
        public DispatcherServlet dispatcherServlet(HttpProperties httpProperties, 
                WebMvcProperties webMvcProperties) {
            DispatcherServlet dispatcherServlet = new DispatcherServlet();
            dispatcherServlet.setDispatchOptionsRequest(
                    webMvcProperties.isDispatchOptionsRequest());
            dispatcherServlet.setDispatchTraceRequest(webMvcProperties.isDispatchTraceRequest());
            dispatcherServlet.setThrowExceptionIfNoHandlerFound(
                    webMvcProperties.isThrowExceptionIfNoHandlerFound());
            dispatcherServlet.setPublishEvents(webMvcProperties.isPublishRequestHandledEvents());
            dispatcherServlet.setEnableLoggingRequestDetails(httpProperties.isLogRequestDetails());
            return dispatcherServlet;
        }

        /**
         * �ļ��ϴ����.
         * @param resolver ����.
         * @return ����ֵ.
         */
        @Bean
        @ConditionalOnBean(MultipartResolver.class)
        @ConditionalOnMissingBean(name = DispatcherServlet.MULTIPART_RESOLVER_BEAN_NAME)
        public MultipartResolver multipartResolver(MultipartResolver resolver) {
            return resolver;
        }

    }

    /**
     * ���� DispatcherServletRegistrationBean
     * ���ὫdispatcherServletע�ᵽservlet����
     */
    @Configuration(proxyBeanMethods = false)
    @Conditional(DispatcherServletRegistrationCondition.class)
    @ConditionalOnClass(ServletRegistration.class)
    @EnableConfigurationProperties(WebMvcProperties.class)
    @Import(DispatcherServletConfiguration.class)
    protected static class DispatcherServletRegistrationConfiguration {

        @Bean(name = DEFAULT_DISPATCHER_SERVLET_REGISTRATION_BEAN_NAME)
        @ConditionalOnBean(value = DispatcherServlet.class, 
                name = DEFAULT_DISPATCHER_SERVLET_BEAN_NAME)
        public DispatcherServletRegistrationBean dispatcherServletRegistration(
                DispatcherServlet dispatcherServlet, WebMvcProperties webMvcProperties, 
                ObjectProvider<MultipartConfigElement> multipartConfig) {
            // ���� DispatcherServletRegistrationBean�����ὫdispatcherServletע�ᵽservlet������
            DispatcherServletRegistrationBean registration = 
                    new DispatcherServletRegistrationBean(dispatcherServlet, 
                    webMvcProperties.getServlet().getPath());
            registration.setName(DEFAULT_DISPATCHER_SERVLET_BEAN_NAME);
            registration.setLoadOnStartup(webMvcProperties.getServlet().getLoadOnStartup());
            multipartConfig.ifAvailable(registration::setMultipartConfig);
            return registration;
        }

    }

    ...

}

```

����Ҫ��ע���� 3 �� bean��

*   `dispatcherServlet`��springMvc ��������ڣ�url �����ɴ˽��룬Ȼ��ת���� `requestMapping`
*   `multipartResolver`�������ļ��ϴ�
*   `dispatcherServletRegistration`������ `dispatcherServlet` ��ע�ᣬ���Ὣ `dispatcherServlet` ע�ᵽ servlet �����У����� springboot ע�� servlet ��������ݣ����Բο� [springboot web Ӧ��֮ servlet �����ע������](https://my.oschina.net/funcy/blog/4951050)��

### 4. `WebMvcAutoConfiguration`

������ `WebMvcAutoConfiguration`:

```
@Configuration(proxyBeanMethods = false)
...
// ���û���Զ���WebMvc�������࣬��ʹ�ñ�����
@ConditionalOnMissingBean(WebMvcConfigurationSupport.class)
...
public class WebMvcAutoConfiguration {
    ...
}

```

`WebMvcAutoConfiguration` ���и�ע����Ҫע���£�

```
@ConditionalOnMissingBean(WebMvcConfigurationSupport.class)

```

���д�������� `WebMvcAutoConfiguration` ֻ���� `WebMvcConfigurationSupport` ���͵� bean ������ʱ�����Ż�����Զ�װ�䡣

`WebMvcConfigurationSupport` �Ǹ�ɶ�أ��� [springmvc demo �� @EnableWebMvc ע��](https://my.oschina.net/funcy/blog/4696657)һ���У������ᵽ���� springMvc ��������ַ�ʽ��

*   ʹ�� `@EnableWebMvc` ע��
*   �̳� `WebMvcConfigurationSupport` ��

�����ַ������ն����� spring ��������������Ϊ `WebMvcConfigurationSupport` �� bean������� `springboot` ��Ŀ�У�������ǽ������������ֲ���֮һ����ô�������� `WebMvcConfigurationSupport`��`WebMvcAutoConfiguration` ���Զ�װ��Ͳ�ִ���ˡ�

������������ `WebMvcAutoConfiguration` װ��� bean��

#### 4.1 `WebMvcAutoConfigurationAdapter`

`WebMvcAutoConfigurationAdapter` �� `WebMvcAutoConfiguration` ���ڲ��࣬�������£�

```
@Configuration(proxyBeanMethods = false)
// ������ EnableWebMvcConfiguration
@Import(EnableWebMvcConfiguration.class)
@EnableConfigurationProperties({ WebMvcProperties.class, ResourceProperties.class })
@Order(0)
public static class WebMvcAutoConfigurationAdapter implements WebMvcConfigurer {
    ...
}

```

��ʵ���� `WebMvcConfigurer`���������� `EnableWebMvcConfiguration`��`WebMvcConfigurer` ������������ springMvc �����ã�ֻ��Ҫ��д���ж�Ӧ�ķ������ɣ�`EnableWebMvcConfiguration` �������������� ������ webMvc ���á�����Ҳ�� `WebMvcAutoConfiguration` ���ڲ��࣬����������������ɶ��

```
@Configuration(proxyBeanMethods = false)
public static class EnableWebMvcConfiguration extends DelegatingWebMvcConfiguration 
        implements ResourceLoaderAware {
    ...
}

```

���Կ��������� `DelegatingWebMvcConfiguration` �����࣬�� `DelegatingWebMvcConfiguration` ���Ǹ�ɶ�أ�����Ҳ���������Ķ��壺

```
@Configuration(proxyBeanMethods = false)
public class DelegatingWebMvcConfiguration extends WebMvcConfigurationSupport {
    ...
}

```

`DelegatingWebMvcConfiguration` ���� springMvc �ṩ�ģ����Կ�������ʵ���� `WebMvcConfigurationSupport`����ˣ�springboot ͨ�� `@Import(EnableWebMvcConfiguration.class)` �ķ�ʽ�� spring ������������ `WebMvcConfigurationSupport` ���͵� bean��

��ʵ�ϣ�`DelegatingWebMvcConfiguration` ���� `@EnableWebMvc` ����� bean��

```
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Documented
// ������ DelegatingWebMvcConfiguration
@Import(DelegatingWebMvcConfiguration.class)
public @interface EnableWebMvc {
    ...
}

```

springbot ��ֱ������ `DelegatingWebMvcConfiguration` ���������������� `EnableWebMvcConfiguration`����Ȼ��������һЩ�Զ������õġ�

���� `EnableWebMvcConfiguration` ������Щɶ������һ���ٷ������������� `WebMvcAutoConfigurationAdapter` ������ bean��

```
/**
 * http ��Ϣת����.
 */
@Override
public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
    this.messageConvertersProvider.ifAvailable(
            (customConverters) -> converters.addAll(customConverters.getConverters()));
}

/**
 * ��ͼ������.
 */
@Bean
@ConditionalOnMissingBean
public InternalResourceViewResolver defaultViewResolver() {
    InternalResourceViewResolver resolver = new InternalResourceViewResolver();
    resolver.setPrefix(this.mvcProperties.getView().getPrefix());
    resolver.setSuffix(this.mvcProperties.getView().getSuffix());
    return resolver;
}

@Bean
@ConditionalOnBean(View.class)
@ConditionalOnMissingBean
public BeanNameViewResolver beanNameViewResolver() {
    BeanNameViewResolver resolver = new BeanNameViewResolver();
    resolver.setOrder(Ordered.LOWEST_PRECEDENCE - 10);
    return resolver;
}

@Bean
@ConditionalOnBean(ViewResolver.class)
@ConditionalOnMissingBean(name = "viewResolver", value = ContentNegotiatingViewResolver.class)
public ContentNegotiatingViewResolver viewResolver(BeanFactory beanFactory) {
    ContentNegotiatingViewResolver resolver = new ContentNegotiatingViewResolver();
    resolver.setContentNegotiationManager(beanFactory.getBean(ContentNegotiationManager.class));
    resolver.setOrder(Ordered.HIGHEST_PRECEDENCE);
    return resolver;
}

/**
 * ������ʻ�����.
 */
@Bean
@ConditionalOnMissingBean
@ConditionalOnProperty(prefix = "spring.mvc", name = "locale")
public LocaleResolver localeResolver() {
    if (this.mvcProperties.getLocaleResolver() == WebMvcProperties.LocaleResolver.FIXED) {
        return new FixedLocaleResolver(this.mvcProperties.getLocale());
    }
    AcceptHeaderLocaleResolver localeResolver = new AcceptHeaderLocaleResolver();
    localeResolver.setDefaultLocale(this.mvcProperties.getLocale());
    return localeResolver;
}

/**
 * ��̬��Դӳ��
 */
@Override
public void addResourceHandlers(ResourceHandlerRegistry registry) {
    if (!this.resourceProperties.isAddMappings()) {
        logger.debug("Default resource handling disabled");
        return;
    }
    // ӳ��webjars
    Duration cachePeriod = this.resourceProperties.getCache().getPeriod();
    CacheControl cacheControl = this.resourceProperties.getCache()
            .getCachecontrol().toHttpCacheControl();
    if (!registry.hasMappingForPattern("/webjars/**")) {
        customizeResourceHandlerRegistration(registry.addResourceHandler("/webjars/**")
                .addResourceLocations("classpath:/META-INF/resources/webjars/")
                .setCachePeriod(getSeconds(cachePeriod)).setCacheControl(cacheControl));
    }
    // ӳ�侲̬��Դ·��
    String staticPathPattern = this.mvcProperties.getStaticPathPattern();
    if (!registry.hasMappingForPattern(staticPathPattern)) {
        customizeResourceHandlerRegistration(registry.addResourceHandler(staticPathPattern)
                // staticLocations Ĭ��Ϊ classpath:[/META-INF/resources/,
                // /resources/, /static/, /public/]
                .addResourceLocations(getResourceLocations(
                    this.resourceProperties.getStaticLocations()))
                .setCachePeriod(getSeconds(cachePeriod)).setCacheControl(cacheControl));
    }
}

```

���Կ�����`WebMvcAutoConfigurationAdapter` ���������� bean:

1.  http ��Ϣת����
2.  ��ͼ������
3.  ���ʻ�����

���������ص������� `http��Ϣת����`����ʹ�� springMvc ʱ��ͨ���� `Controller` ������еķ����ϱ�� `@ResponseBody`�����ز����ͻ�ת��Ϊ json������� `http��Ϣת����`�����Ĺ����ˡ�springboot Ĭ�ϵ� jaon ������ `jackson`������ʵ������ `JacksonAutoConfiguration` �У�װ��Ϊ `HttpMessageConverter` �Ĵ����� `JacksonHttpMessageConvertersConfiguration`������Ͳ�չ���ˡ�

������ �ķ����У���γ����� `WebMvcProperties` ���ã��������������Ǹ�ɶ��

```
@ConfigurationProperties(prefix = "spring.mvc")
public class WebMvcProperties {
    ...
}

```

�����ԣ����Ǹ������� �����Կ�������������ǰ׺Ϊ `spring.mvc`��֧�ֵ��������£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-062f490afbb74e496f50f4cad4bd13ede82.png)

#### 4.2 `EnableWebMvcConfiguration`

���������� `EnableWebMvcConfiguration` �Զ�������ã�

```
public static class EnableWebMvcConfiguration extends DelegatingWebMvcConfiguration 
        implements ResourceLoaderAware {

    /**
     * ����������
     */
    @Bean
    @Override
    public RequestMappingHandlerAdapter requestMappingHandlerAdapter(
            @Qualifier("mvcContentNegotiationManager") 
                ContentNegotiationManager contentNegotiationManager,
            @Qualifier("mvcConversionService") FormattingConversionService conversionService,
            @Qualifier("mvcValidator") Validator validator) {
        RequestMappingHandlerAdapter adapter = super.requestMappingHandlerAdapter(
                contentNegotiationManager, conversionService, validator);
        adapter.setIgnoreDefaultModelOnRedirect(this.mvcProperties == null 
                || this.mvcProperties.isIgnoreDefaultModelOnRedirect());
        return adapter;
    }

    /**
     * ·��ӳ��
     */
    @Bean
    @Primary
    @Override
    public RequestMappingHandlerMapping requestMappingHandlerMapping(
            @Qualifier("mvcContentNegotiationManager") 
                    ContentNegotiationManager contentNegotiationManager,
            @Qualifier("mvcConversionService") FormattingConversionService conversionService,
            @Qualifier("mvcResourceUrlProvider") ResourceUrlProvider resourceUrlProvider) {
        // Must be @Primary for MvcUriComponentsBuilder to work
        return super.requestMappingHandlerMapping(contentNegotiationManager, conversionService,
                resourceUrlProvider);
    }

    /**
     * ��ӭҳ
     */
    @Bean
    public WelcomePageHandlerMapping welcomePageHandlerMapping(
            ApplicationContext applicationContext, 
            FormattingConversionService mvcConversionService, 
            ResourceUrlProvider mvcResourceUrlProvider) {
        WelcomePageHandlerMapping welcomePageHandlerMapping = new WelcomePageHandlerMapping(
                new TemplateAvailabilityProviders(applicationContext), applicationContext, 
                getWelcomePage(), this.mvcProperties.getStaticPathPattern());
        welcomePageHandlerMapping.setInterceptors(getInterceptors(
                mvcConversionService, mvcResourceUrlProvider));
        return welcomePageHandlerMapping;
    }

    /**
     * mvc���ã���������ڸ�ʽ�Ĵ���
     */
    @Bean
    @Override
    public FormattingConversionService mvcConversionService() {
        WebConversionService conversionService 
            = new WebConversionService(this.mvcProperties.getDateFormat());
        addFormatters(conversionService);
        return conversionService;
    }

    /**
     * ����У����
     */
    @Bean
    @Override
    public Validator mvcValidator() {
        if (!ClassUtils.isPresent("javax.validation.Validator", getClass().getClassLoader())) {
            return super.mvcValidator();
        }
        return ValidatorAdapter.get(getApplicationContext(), getValidator());
    }

    /**
     * �쳣����
     */
    @Override
    protected ExceptionHandlerExceptionResolver createExceptionHandlerExceptionResolver() {
        if (this.mvcRegistrations != null 
                && this.mvcRegistrations.getExceptionHandlerExceptionResolver() != null) {
            return this.mvcRegistrations.getExceptionHandlerExceptionResolver();
        }
        return super.createExceptionHandlerExceptionResolver();
    }

    @Override
    protected void extendHandlerExceptionResolvers(
                List<HandlerExceptionResolver> exceptionResolvers) {
        super.extendHandlerExceptionResolvers(exceptionResolvers);
        if (this.mvcProperties.isLogResolvedException()) {
            for (HandlerExceptionResolver resolver : exceptionResolvers) {
                if (resolver instanceof AbstractHandlerExceptionResolver) {
                    ((AbstractHandlerExceptionResolver) resolver).setWarnLogCategory(
                            resolver.getClass().getName());
                }
            }
        }
    }
    ...
}

```

�����ԭ���� springMvc����������������������·��ӳ�䡢����У�顢�쳣����ȡ�

### 5\. �ܽ�

1.  `webMvc` ��װ��ʱ����װ�� `ServletWebServerFactoryAutoConfiguration`����װ�� `DispatcherServletAutoConfiguration`�����װ�� `WebMvcAutoConfiguration`
2.  `ServletWebServerFactoryAutoConfiguration` ���� servlet ������װ�䣬`DispatcherServletAutoConfiguration` ���� `DispatcherServlet` ��װ�䣬`WebMvcAutoConfiguration` ���� `webMvc` �������Ϣת��������ͼ����������̬��Դӳ��ȣ���װ��
3.  ����� spring ������������ `WebMvcConfigurationSupport`�� `WebMvcAutoConfiguration` ��װ�����������ִ��
4.  `servlet` ����������� `servlet` Ϊǰ׺��`webMvc` �������� `spring.mvc` Ϊǰ׺�����ǿ����������ļ���һ��Ϊ `application.properties/application.yml`���н�������

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4921595](https://my.oschina.net/funcy/blog/4921595) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_