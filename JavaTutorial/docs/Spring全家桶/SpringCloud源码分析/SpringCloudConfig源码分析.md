Ҫ���˽�spring cloud config�����Ǿͱ����˽�springboot��environment�����ļ��ع��̡�



```
SpringApplication.run(AppApiApplication.class, args);

public static ConfigurableApplicationContext run(Class<?>[] primarySources,
            String[] args) {
    return new SpringApplication(primarySources).run(args);
}

```



��`SpringApplication�Ĺ��췽����`������ôһ�δ���



```
setInitializers((Collection) getSpringFactoriesInstances(
                ApplicationContextInitializer.class));
        setListeners((Collection) getSpringFactoriesInstances(ApplicationListener.class));

```





```
Set<String> names = new LinkedHashSet<>(
                SpringFactoriesLoader.loadFactoryNames(type, classLoader));

```



��δ����о��Ǵ�META-INFĿ¼�����ȡ`ApplicationListener��ApplicationContextInitializer`���͵������ࡣ
��spring-boot.jar����spring.factories��������`ConfigFileApplicationListener`����࣬���û���Ҳ����application�ļ��ļ��ض���ͨ�������



```
# Application Listeners
org.springframework.context.ApplicationListener=\
org.springframework.boot.context.config.ConfigFileApplicationListener,\

# Run Listeners
org.springframework.boot.SpringApplicationRunListener=\
org.springframework.boot.context.event.EventPublishingRunListener

```



��������springboot�����׶�



```
    public ConfigurableApplicationContext run(String... args) {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();
        ConfigurableApplicationContext context = null;
        Collection<SpringBootExceptionReporter> exceptionReporters = new ArrayList<>();
        configureHeadlessProperty();
        SpringApplicationRunListeners listeners = getRunListeners(args);
        listeners.starting();
        try {
            ApplicationArguments applicationArguments = new DefaultApplicationArguments(
                    args);
            ConfigurableEnvironment environment = prepareEnvironment(listeners,
                    applicationArguments);
            configureIgnoreBeanInfo(environment);
            Banner printedBanner = printBanner(environment);
            context = createApplicationContext();
            exceptionReporters = getSpringFactoriesInstances(
                    SpringBootExceptionReporter.class,
                    new Class[] { ConfigurableApplicationContext.class }, context);
            prepareContext(context, environment, listeners, applicationArguments,
                    printedBanner);
            refreshContext(context);
            afterRefresh(context, applicationArguments);
            stopWatch.stop();
            if (this.logStartupInfo) {
                new StartupInfoLogger(this.mainApplicationClass)
                        .logStarted(getApplicationLog(), stopWatch);
            }
            listeners.started(context);
            callRunners(context, applicationArguments);
        }
        catch (Throwable ex) {
            handleRunFailure(context, ex, exceptionReporters, listeners);
            throw new IllegalStateException(ex);
        }

        try {
            listeners.running(context);
        }
        catch (Throwable ex) {
            handleRunFailure(context, ex, exceptionReporters, null);
            throw new IllegalStateException(ex);
        }
        return context;
    }

```





```
ConfigurableEnvironment environment = prepareEnvironment(listeners,
                    applicationArguments);
prepareContext(context, environment, listeners, applicationArguments,
                    printedBanner);

```



���������δ������װ�ػ����Ĵ���
��`prepareEnvironment`�����г�ʼ����`environment`��



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



��Ϊ����servlet��������`Environment`Ϊ`StandardServletEnvironment`�������ڸ���ĵĹ�������ִ����`customizePropertySources`����



```
    public AbstractEnvironment() {
        customizePropertySources(this.propertySources);
        if (logger.isDebugEnabled()) {
            logger.debug("Initialized " + getClass().getSimpleName() + " with PropertySources " + this.propertySources);
        }
    }

```





```
    protected void customizePropertySources(MutablePropertySources propertySources) {
        propertySources.addLast(new StubPropertySource(SERVLET_CONFIG_PROPERTY_SOURCE_NAME));
        propertySources.addLast(new StubPropertySource(SERVLET_CONTEXT_PROPERTY_SOURCE_NAME));
        if (JndiLocatorDelegate.isDefaultJndiEnvironmentAvailable()) {
            propertySources.addLast(new JndiPropertySource(JNDI_PROPERTY_SOURCE_NAME));
        }
        super.customizePropertySources(propertySources);
    }

```





```
    @Override
    protected void customizePropertySources(MutablePropertySources propertySources) {
        propertySources.addLast(new MapPropertySource(SYSTEM_PROPERTIES_PROPERTY_SOURCE_NAME, getSystemProperties()));
        propertySources.addLast(new SystemEnvironmentPropertySource(SYSTEM_ENVIRONMENT_PROPERTY_SOURCE_NAME, getSystemEnvironment()));
    }

```



������,���ǵõ���`StandardServletEnvironment`���Ҽ��ص�����˳����

1.  servletConfigInitParams
2.  servletContextInitParams
3.  jndiProperties
4.  systemProperties
5.  systemEnvironment



```
    protected void configureEnvironment(ConfigurableEnvironment environment,
            String[] args) {
        configurePropertySources(environment, args);
        configureProfiles(environment, args);
    }

    protected void configurePropertySources(ConfigurableEnvironment environment,
            String[] args) {
        MutablePropertySources sources = environment.getPropertySources();
        if (this.defaultProperties != null && !this.defaultProperties.isEmpty()) {
            sources.addLast(
                    new MapPropertySource("defaultProperties", this.defaultProperties));
        }
        if (this.addCommandLineProperties && args.length > 0) {
            String name = CommandLinePropertySource.COMMAND_LINE_PROPERTY_SOURCE_NAME;
            if (sources.contains(name)) {
                PropertySource<?> source = sources.get(name);
                CompositePropertySource composite = new CompositePropertySource(name);
                composite.addPropertySource(new SimpleCommandLinePropertySource(
                        "springApplicationCommandLineArgs", args));
                composite.addPropertySource(source);
                sources.replace(name, composite);
            }
            else {
                sources.addFirst(new SimpleCommandLinePropertySource(args));
            }
        }
    }

```



���������ǿ��Կ����ּ�����`defaultProperties`������������Լ�`SimpleCommandLinePropertySource`�����в�������ǰ�档��ˣ����ڵ�˳����

1.  SimpleCommandLinePropertySourcem����������
2.  servletConfigInitParams
3.  servletContextInitParams
4.  jndiProperties
5.  systemProperties
6.  systemEnvironment
7.  defaultProperties



```
    public void environmentPrepared(ConfigurableEnvironment environment) {
        for (SpringApplicationRunListener listener : this.listeners) {
            listener.environmentPrepared(environment);
        }
    }

    @Override
    public void environmentPrepared(ConfigurableEnvironment environment) {
        this.initialMulticaster.multicastEvent(new ApplicationEnvironmentPreparedEvent(
                this.application, this.args, environment));
    }

```



������`SpringApplicationRunListener`Ϊ`EventPublishingRunListener`,������ǰ���`getRunListeners`



```
    private SpringApplicationRunListeners getRunListeners(String[] args) {
        Class<?>[] types = new Class<?>[] { SpringApplication.class, String[].class };
        return new SpringApplicationRunListeners(logger, getSpringFactoriesInstances(
                SpringApplicationRunListener.class, types, this, args));
    }

```



��ͨ�����췽����ʼ����ʱ������this����������`initialMulticaster`�е�listenerΪapplication�е�listener



```
    public EventPublishingRunListener(SpringApplication application, String[] args) {
        this.application = application;
        this.args = args;
        this.initialMulticaster = new SimpleApplicationEventMulticaster();
        for (ApplicationListener<?> listener : application.getListeners()) {
            this.initialMulticaster.addApplicationListener(listener);
        }
    }

```



��������ᷢ�͸��¼�֪ͨ��������`ConfigFileApplicationListener`



```
    @Override
    public void onApplicationEvent(ApplicationEvent event) {
        if (event instanceof ApplicationEnvironmentPreparedEvent) {
            onApplicationEnvironmentPreparedEvent(
                    (ApplicationEnvironmentPreparedEvent) event);
        }
        if (event instanceof ApplicationPreparedEvent) {
            onApplicationPreparedEvent(event);
        }
    }

```





```
    private void onApplicationEnvironmentPreparedEvent(
            ApplicationEnvironmentPreparedEvent event) {
        List<EnvironmentPostProcessor> postProcessors = loadPostProcessors();
        postProcessors.add(this);
        AnnotationAwareOrderComparator.sort(postProcessors);
        for (EnvironmentPostProcessor postProcessor : postProcessors) {
            postProcessor.postProcessEnvironment(event.getEnvironment(),
                    event.getSpringApplication());
        }
    }

    List<EnvironmentPostProcessor> loadPostProcessors() {
        return SpringFactoriesLoader.loadFactories(EnvironmentPostProcessor.class,
                getClass().getClassLoader());
    }

```



���������и���չ�㣬ͨ����ȡ`spring.factories`�ļ������õ�`EnvironmentPostProcessor`�����`postProcessEnvironment`�������Լ�����Ҳ���뵽��`postProcessors`�����У����������ֻ��ߵ�`postProcessors`����



```
    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment,
            SpringApplication application) {
        addPropertySources(environment, application.getResourceLoader());
    }

```





```
    protected void addPropertySources(ConfigurableEnvironment environment,
            ResourceLoader resourceLoader) {
        RandomValuePropertySource.addToEnvironment(environment);
        new Loader(environment, resourceLoader).load();
    }

    public static void addToEnvironment(ConfigurableEnvironment environment) {
        environment.getPropertySources().addAfter(
                StandardEnvironment.SYSTEM_ENVIRONMENT_PROPERTY_SOURCE_NAME,
                new RandomValuePropertySource(RANDOM_PROPERTY_SOURCE_NAME));
        logger.trace("RandomValuePropertySource add to Environment");
    }

        public void load() {
            this.profiles = new LinkedList<>();
            this.processedProfiles = new LinkedList<>();
            this.activatedProfiles = false;
            this.loaded = new LinkedHashMap<>();
            initializeProfiles();
            while (!this.profiles.isEmpty()) {
                Profile profile = this.profiles.poll();
                if (profile != null && !profile.isDefaultProfile()) {
                    addProfileToEnvironment(profile.getName());
                }
                load(profile, this::getPositiveProfileFilter,
                        addToLoaded(MutablePropertySources::addLast, false));
                this.processedProfiles.add(profile);
            }
            resetEnvironmentProfiles(this.processedProfiles);
            load(null, this::getNegativeProfileFilter,
                    addToLoaded(MutablePropertySources::addFirst, true));
            addLoadedPropertySources();
        }

```



������ֽ�random���ü��뵽systemEnvironment֮���������ǵ����ü���˳�����
defaultProperties

1.  SimpleCommandLinePropertySourcem����������
2.  servletConfigInitParams
3.  servletContextInitParams
4.  jndiProperties
5.  systemProperties
6.  systemEnvironment
7.  RandomValuePropertySource
8.  defaultProperties

·��

> classpath:/,classpath:/config/,file:./,file:./config/
> spring.config.location=
> spring.config.additional-location=

�ļ���Ĭ��Ϊapplication

> ���������spring.config.name=
> �ļ�����Ϊspring.config.name���õ�����

����ͨ��`load`����������·�����ļ������ļ����뵽`environment��`�����������`spring.profiles.active`�����Ҽ���prefix + "-" + profile + fileExtension�ļ���Ҳ����`application-<spring.profiles.active>.properties`��`y`�ļ�



```
        private void load(Profile profile, DocumentFilterFactory filterFactory,
                DocumentConsumer consumer) {
            getSearchLocations().forEach((location) -> {
                boolean isFolder = location.endsWith("/");
                Set<String> names = isFolder ? getSearchNames() : NO_SEARCH_NAMES;
                names.forEach(
                        (name) -> load(location, name, profile, filterFactory, consumer));
            });
        }

        private void load(String location, String name, Profile profile,
                DocumentFilterFactory filterFactory, DocumentConsumer consumer) {
            if (!StringUtils.hasText(name)) {
                for (PropertySourceLoader loader : this.propertySourceLoaders) {
                    if (canLoadFileExtension(loader, location)) {
                        load(loader, location, profile,
                                filterFactory.getDocumentFilter(profile), consumer);
                        return;
                    }
                }
            }
            Set<String> processed = new HashSet<>();
            for (PropertySourceLoader loader : this.propertySourceLoaders) {
                for (String fileExtension : loader.getFileExtensions()) {
                    if (processed.add(fileExtension)) {
                        loadForFileExtension(loader, location + name, "." + fileExtension,
                                profile, filterFactory, consumer);
                    }
                }
            }
        }

```



������ͨ��`this.propertySourceLoaders`�����ж��Ƿ���ϸ�SourceLoader�ĺ�׺��������ϣ��ͽ���Դ���ؽ���,��`propertySourceLoaders`������`Loader`���췽��



```
        Loader(ConfigurableEnvironment environment, ResourceLoader resourceLoader) {
            this.environment = environment;
            this.resourceLoader = (resourceLoader != null) ? resourceLoader
                    : new DefaultResourceLoader();
            this.propertySourceLoaders = SpringFactoriesLoader.loadFactories(
                    PropertySourceLoader.class, getClass().getClassLoader());
        }

```





```
# PropertySource Loaders
org.springframework.boot.env.PropertySourceLoader=\
org.springframework.boot.env.PropertiesPropertySourceLoader,\
org.springframework.boot.env.YamlPropertySourceLoader

```



��˿��Լ���`yml`�ļ���`properties`�ļ�



```
        private void addLoadedPropertySources() {
            MutablePropertySources destination = this.environment.getPropertySources();
            List<MutablePropertySources> loaded = new ArrayList<>(this.loaded.values());
            Collections.reverse(loaded);
            String lastAdded = null;
            Set<String> added = new HashSet<>();
            for (MutablePropertySources sources : loaded) {
                for (PropertySource<?> source : sources) {
                    if (added.add(source.getName())) {
                        addLoadedPropertySource(destination, lastAdded, source);
                        lastAdded = source.getName();
                    }
                }
            }
        }

```



���շ��뵽��`environment`

���������Ǿ�������Spring cloud config

��`spring-cloud-context`��jar�У�`spring.factories`�������˸�`BootstrapApplicationListener`
���Ҹ�����������`ConfigFileApplicationListener`������������������springcloud�������ô
�¼�������������`BootstrapApplicationListener`



```
# Application Listeners
org.springframework.context.ApplicationListener=\
org.springframework.cloud.bootstrap.BootstrapApplicationListener,\

```





```
    @Override
    public void onApplicationEvent(ApplicationEnvironmentPreparedEvent event) {
        ConfigurableEnvironment environment = event.getEnvironment();
        if (!environment.getProperty("spring.cloud.bootstrap.enabled", Boolean.class,
                true)) {
            return;
        }
        // don't listen to events in a bootstrap context
        if (environment.getPropertySources().contains(BOOTSTRAP_PROPERTY_SOURCE_NAME)) {
            return;
        }
        ConfigurableApplicationContext context = null;
        String configName = environment
                .resolvePlaceholders("${spring.cloud.bootstrap.name:bootstrap}");
        for (ApplicationContextInitializer<?> initializer : event.getSpringApplication()
                .getInitializers()) {
            if (initializer instanceof ParentContextApplicationContextInitializer) {
                context = findBootstrapContext(
                        (ParentContextApplicationContextInitializer) initializer,
                        configName);
            }
        }
        if (context == null) {
            context = bootstrapServiceContext(environment, event.getSpringApplication(),
                    configName);
        }
        apply(context, event.getSpringApplication(), environment);
    }

```





```
    private ConfigurableApplicationContext bootstrapServiceContext(
            ConfigurableEnvironment environment, final SpringApplication application,
            String configName) {
        StandardEnvironment bootstrapEnvironment = new StandardEnvironment();
        MutablePropertySources bootstrapProperties = bootstrapEnvironment
                .getPropertySources();
        for (PropertySource<?> source : bootstrapProperties) {
            bootstrapProperties.remove(source.getName());
        }
        String configLocation = environment
                .resolvePlaceholders("${spring.cloud.bootstrap.location:}");
        Map<String, Object> bootstrapMap = new HashMap<>();
        bootstrapMap.put("spring.config.name", configName);
        // if an app (or test) uses spring.main.web-application-type=reactive, bootstrap will fail
        // force the environment to use none, because if though it is set below in the builder
        // the environment overrides it
        bootstrapMap.put("spring.main.web-application-type", "none");
        if (StringUtils.hasText(configLocation)) {
            bootstrapMap.put("spring.config.location", configLocation);
        }
        bootstrapProperties.addFirst(
                new MapPropertySource(BOOTSTRAP_PROPERTY_SOURCE_NAME, bootstrapMap));
        for (PropertySource<?> source : environment.getPropertySources()) {
            if (source instanceof StubPropertySource) {
                continue;
            }
            bootstrapProperties.addLast(source);
        }
        ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
        // Use names and ensure unique to protect against duplicates
        List<String> names = new ArrayList<>(SpringFactoriesLoader
                .loadFactoryNames(BootstrapConfiguration.class, classLoader));
        for (String name : StringUtils.commaDelimitedListToStringArray(
                environment.getProperty("spring.cloud.bootstrap.sources", ""))) {
            names.add(name);
        }
        // TODO: is it possible or sensible to share a ResourceLoader?
        SpringApplicationBuilder builder = new SpringApplicationBuilder()
                .profiles(environment.getActiveProfiles()).bannerMode(Mode.OFF)
                .environment(bootstrapEnvironment)
                // Don't use the default properties in this builder
                .registerShutdownHook(false).logStartupInfo(false)
                .web(WebApplicationType.NONE);
        final SpringApplication builderApplication = builder.application();
        if(builderApplication.getMainApplicationClass() == null){
            // gh_425:
            // SpringApplication cannot deduce the MainApplicationClass here
            // if it is booted from SpringBootServletInitializer due to the
            // absense of the "main" method in stackTraces.
            // But luckily this method's second parameter "application" here
            // carries the real MainApplicationClass which has been explicitly
            // set by SpringBootServletInitializer itself already.
            builder.main(application.getMainApplicationClass());
        }
        if (environment.getPropertySources().contains("refreshArgs")) {
            // If we are doing a context refresh, really we only want to refresh the
            // Environment, and there are some toxic listeners (like the
            // LoggingApplicationListener) that affect global static state, so we need a
            // way to switch those off.
            builderApplication
                    .setListeners(filterListeners(builderApplication.getListeners()));
        }
        List<Class<?>> sources = new ArrayList<>();
        for (String name : names) {
            Class<?> cls = ClassUtils.resolveClassName(name, null);
            try {
                cls.getDeclaredAnnotations();
            }
            catch (Exception e) {
                continue;
            }
            sources.add(cls);
        }
        AnnotationAwareOrderComparator.sort(sources);
        builder.sources(sources.toArray(new Class[sources.size()]));
        final ConfigurableApplicationContext context = builder.run();
        // gh-214 using spring.application.name=bootstrap to set the context id via
        // `ContextIdApplicationContextInitializer` prevents apps from getting the actual
        // spring.application.name
        // during the bootstrap phase.
        context.setId("bootstrap");
        // Make the bootstrap context a parent of the app context
        addAncestorInitializer(application, context);
        // It only has properties in it now that we don't want in the parent so remove
        // it (and it will be added back later)
        bootstrapProperties.remove(BOOTSTRAP_PROPERTY_SOURCE_NAME);
        mergeDefaultProperties(environment.getPropertySources(), bootstrapProperties);
        return context;
    }

```



������Ҫ��������������

1.  ����Environment��������spring.config.name=bootstrap
2.  ����һ���µ�SpringApplication����������������sourcesΪ��չ���µ�BootstrapConfiguration������



```
List<String> names = new ArrayList<>(SpringFactoriesLoader
                .loadFactoryNames(BootstrapConfiguration.class, classLoader));

```



�򵥵ľ��ǿ������Ϊ������һ���µ���������������ΪBootstrapConfiguration���õ��ࡣ����ͨ��run�����õ��˳�ʼ�����BeanFactory�������ҽ�contenxt��װ��AncestorInitializer���뵽�������Լ���SpringApplication��



```
application.addInitializers(new AncestorInitializer(context));

```



����`apply`������,��ȡ��`ApplicationContextInitializer`���͵����ж�����뵽�����ǵ�ǰ��`SpringApplication`��



```
    private void apply(ConfigurableApplicationContext context,
            SpringApplication application, ConfigurableEnvironment environment) {
        @SuppressWarnings("rawtypes")
        List<ApplicationContextInitializer> initializers = getOrderedBeansOfType(context,
                ApplicationContextInitializer.class);
        application.addInitializers(initializers
                .toArray(new ApplicationContextInitializer[initializers.size()]));
        addBootstrapDecryptInitializer(application);
    }

```



��`spring-cloud-context`���У�`spring.factories`�������������



```
org.springframework.cloud.bootstrap.BootstrapConfiguration=\
org.springframework.cloud.bootstrap.config.PropertySourceBootstrapConfiguration,\

```



����������������`SpringApplication`���Ѿ�����`AncestorInitializer,PropertySourceBootstrapConfiguration`����ApplicationContextInitializer

���ص�����������



```
    private void prepareContext(ConfigurableApplicationContext context,
            ConfigurableEnvironment environment, SpringApplicationRunListeners listeners,
            ApplicationArguments applicationArguments, Banner printedBanner) {
        context.setEnvironment(environment);
        postProcessApplicationContext(context);
        applyInitializers(context);
        listeners.contextPrepared(context);
        if (this.logStartupInfo) {
            logStartupInfo(context.getParent() == null);
            logStartupProfileInfo(context);
        }

        // Add boot specific singleton beans
        context.getBeanFactory().registerSingleton("springApplicationArguments",
                applicationArguments);
        if (printedBanner != null) {
            context.getBeanFactory().registerSingleton("springBootBanner", printedBanner);
        }

        // Load the sources
        Set<Object> sources = getAllSources();
        Assert.notEmpty(sources, "Sources must not be empty");
        load(context, sources.toArray(new Object[0]));
        listeners.contextLoaded(context);
    }

```





```
    protected void applyInitializers(ConfigurableApplicationContext context) {
        for (ApplicationContextInitializer initializer : getInitializers()) {
            Class<?> requiredType = GenericTypeResolver.resolveTypeArgument(
                    initializer.getClass(), ApplicationContextInitializer.class);
            Assert.isInstanceOf(requiredType, context, "Unable to call initializer.");
            initializer.initialize(context);
        }
    }

```



������ͻ���õ�`ApplicationContextInitializer.initialize`����
�ͻ�������`AncestorInitializer`



```
        @Override
        public void initialize(ConfigurableApplicationContext context) {
            while (context.getParent() != null && context.getParent() != context) {
                context = (ConfigurableApplicationContext) context.getParent();
            }
            reorderSources(context.getEnvironment());
            new ParentContextApplicationContextInitializer(this.parent)
                    .initialize(context);
        }

    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        if (applicationContext != this.parent) {
            applicationContext.setParent(this.parent);
            applicationContext.addApplicationListener(EventPublisher.INSTANCE);
        }
    }

```



���Կ������ｫBootStrap������������Ϊ���ǵ�ǰ�����ĸ����������Ҹ������еĶ��󶼳�ʼ�����ˣ�`PropertySourceBootstrapConfiguration`��Ҳ��ʼ������,���Ҹ�`ApplicationContextInitializer`���뵽�������Լ������������棬��˻���ó�ʼ�����˵�`PropertySourceBootstrapConfiguration.initialize`,��`PropertySourceLocator`��ע�������



```
# Bootstrap components
org.springframework.cloud.bootstrap.BootstrapConfiguration=\
org.springframework.cloud.config.client.ConfigServiceBootstrapConfiguration,\

```





```
    @Bean
    @ConditionalOnMissingBean(ConfigServicePropertySourceLocator.class)
    @ConditionalOnProperty(value = "spring.cloud.config.enabled", matchIfMissing = true)
    public ConfigServicePropertySourceLocator configServicePropertySource(ConfigClientProperties properties) {
        ConfigServicePropertySourceLocator locator = new ConfigServicePropertySourceLocator(
                properties);
        return locator;
    }

```





```
    @Autowired(required = false)
    private List<PropertySourceLocator> propertySourceLocators = new ArrayList<>();

    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        CompositePropertySource composite = new CompositePropertySource(
                BOOTSTRAP_PROPERTY_SOURCE_NAME);
        AnnotationAwareOrderComparator.sort(this.propertySourceLocators);
        boolean empty = true;
        ConfigurableEnvironment environment = applicationContext.getEnvironment();
        for (PropertySourceLocator locator : this.propertySourceLocators) {
            PropertySource<?> source = null;
            source = locator.locate(environment);
            if (source == null) {
                continue;
            }
            logger.info("Located property source: " + source);
            composite.addPropertySource(source);
            empty = false;
        }
        if (!empty) {
            MutablePropertySources propertySources = environment.getPropertySources();
            String logConfig = environment.resolvePlaceholders("${logging.config:}");
            LogFile logFile = LogFile.get(environment);
            if (propertySources.contains(BOOTSTRAP_PROPERTY_SOURCE_NAME)) {
                propertySources.remove(BOOTSTRAP_PROPERTY_SOURCE_NAME);
            }
            insertPropertySources(propertySources, composite);
            reinitializeLoggingSystem(environment, logConfig, logFile);
            setLogLevels(applicationContext, environment);
            handleIncludedProfiles(environment);
        }
    }

```



������ջ�����`ConfigServicePropertySourceLocator`��



```
    private Environment getRemoteEnvironment(RestTemplate restTemplate,
            ConfigClientProperties properties, String label, String state) {
        String path = "/{name}/{profile}";
        String name = properties.getName();
        String profile = properties.getProfile();
        String token = properties.getToken();
        int noOfUrls = properties.getUri().length;
        if (noOfUrls > 1) {
            logger.info("Multiple Config Server Urls found listed.");
        }

        Object[] args = new String[] { name, profile };
        if (StringUtils.hasText(label)) {
            if (label.contains("/")) {
                label = label.replace("/", "(_)");
            }
            args = new String[] { name, profile, label };
            path = path + "/{label}";
        }
        ResponseEntity<Environment> response = null;

        for (int i = 0; i < noOfUrls; i++) {
            Credentials credentials = properties.getCredentials(i);
            String uri = credentials.getUri();
            String username = credentials.getUsername();
            String password = credentials.getPassword();

            logger.info("Fetching config from server at : " + uri);

            try {
                HttpHeaders headers = new HttpHeaders();
                addAuthorizationToken(properties, headers, username, password);
                if (StringUtils.hasText(token)) {
                    headers.add(TOKEN_HEADER, token);
                }
                if (StringUtils.hasText(state) && properties.isSendState()) {
                    headers.add(STATE_HEADER, state);
                }

                final HttpEntity<Void> entity = new HttpEntity<>((Void) null, headers);
                response = restTemplate.exchange(uri + path, HttpMethod.GET, entity,
                        Environment.class, args);
            }
            catch (HttpClientErrorException e) {
                if (e.getStatusCode() != HttpStatus.NOT_FOUND) {
                    throw e;
                }
            }
            catch (ResourceAccessException e) {
                logger.info("Connect Timeout Exception on Url - " + uri
                        + ". Will be trying the next url if available");
                if (i == noOfUrls - 1)
                    throw e;
                else
                    continue;
            }

            if (response == null || response.getStatusCode() != HttpStatus.OK) {
                return null;
            }

            Environment result = response.getBody();
            return result;
        }

        return null;
    }

```



���Կ��������ǵ��÷���˵Ľӿڻ�ȡ���µ����á�
������ⲿ��������ŵ�systemEnvironment֮ǰ����˾ͻḲ�Ǳ������ã����ǿ���ͨ����������



```
@ConfigurationProperties("spring.cloud.config")
public class PropertySourceBootstrapProperties {

    /**
     * Flag to indicate that the external properties should override system properties.
     * Default true.
     */
    private boolean overrideSystemProperties = true;

    /**
     * Flag to indicate that {@link #isOverrideSystemProperties()
     * systemPropertiesOverride} can be used. Set to false to prevent users from changing
     * the default accidentally. Default true.
     */
    private boolean allowOverride = true;

    /**
     * Flag to indicate that when {@link #setAllowOverride(boolean) allowOverride} is
     * true, external properties should take lowest priority, and not override any
     * existing property sources (including local config files). Default false.
     */
    private boolean overrideNone = false;

```





```
if (!remoteProperties.isAllowOverride() || (!remoteProperties.isOverrideNone()
                && remoteProperties.isOverrideSystemProperties())) {
            propertySources.addFirst(composite);
            return;
        }
        if (remoteProperties.isOverrideNone()) {
            propertySources.addLast(composite);
            return;
        }
        if (propertySources
                .contains(StandardEnvironment.SYSTEM_ENVIRONMENT_PROPERTY_SOURCE_NAME)) {
            if (!remoteProperties.isOverrideSystemProperties()) {
                propertySources.addAfter(
                        StandardEnvironment.SYSTEM_ENVIRONMENT_PROPERTY_SOURCE_NAME,
                        composite);
            }
            else {
                propertySources.addBefore(
                        StandardEnvironment.SYSTEM_ENVIRONMENT_PROPERTY_SOURCE_NAME,
                        composite);
            }
        }
        else {
            propertySources.addLast(composite);
        }

```



**�ܽ�**

1.  ��չ��
    1.1 `EnvironmentPostProcessor`
    �Ի���������
    1.2 `PropertySourceLoader`
    ������ͬ�ĸ�ʽ���ļ�
    1.2 `ApplicationListener`
    spring-cloud����ͨ��������չBootstrapApplicationListener
    1.3 `BootstrapConfiguration`
    ͨ����չ�����������

2.  �ļ����ع���
    ͨ��ApplicationListener�¼�����һ���µ�SpringApliction�����ཫBootstrapConfiguration��չ����Ϊ���������࣬Ȼ������һ����ʼ���˵�BootStrap����������������װ��AncestorInitializer����뵽�����Լ����������У����þ��ǽ������Լ������ĸ���������ΪBootStrap������ͨ��BootStrap������ó�ʼ���ú��ApplicationContextInitializer���Ͷ��󣬶�����������PropertySourceBootstrapConfiguration���������࣬��������ע����PropertySourceLocator�࣬����ConfigServiceBootstrapConfiguration����������������bean����
    ConfigServicePropertySourceLocator���������ջὫBootStrap�г�ʼ�õ�PropertySourceBootstrapConfiguration���뵽�����Լ����������е��ã����յ���initialize����Ȼ�����ConfigServicePropertySourceLocator.locate����ȥConfig server�����ȡ���á�



���ߣ�ӵ���¶�_to
���ӣ�https://www.jianshu.com/p/60c6ab0e79d5
��Դ������
����Ȩ���������С���ҵת������ϵ���߻����Ȩ������ҵת����ע��������

# �ο�����
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud
https://github.com/macrozheng/springcloud-learning