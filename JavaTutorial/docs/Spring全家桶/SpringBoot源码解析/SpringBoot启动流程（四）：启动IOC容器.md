��һƪ�����ܽ� springboot �����������£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-07a6b491fbe69b8dcbd41e59a8543f06671.png)

�����ģ����Ǽ��������������Ĳ��衣

### 3.10 ˢ�� ioc ����

���������������� `SpringApplication#refreshContext` ������

```
private void refreshContext(ConfigurableApplicationContext context) {
    // ����spring����
    refresh(context);
    if (this.registerShutdownHook) {
        try {
            // ע�� ShutdownHook
            context.registerShutdownHook();
        }
        catch (AccessControlException ex) {
            // Not allowed in some environments.
        }
    }
}

```

�������������������

1.  `refresh(context)`������ spring ������Ҳ���ǵ��� `AbstractApplicationContext#refresh` ������
2.  `context.registerShutdownHook()`��ע�� `ShutdownHook`�������� jvm ���̹ر�ʱ����һЩ�ض��Ĳ�����

#### 3.10.1 ���� spring ����

���� `SpringApplication#refresh`��

```
protected void refresh(ApplicationContext applicationContext) {
    Assert.isInstanceOf(AbstractApplicationContext.class, applicationContext);
    // spring ����������������
    ((AbstractApplicationContext) applicationContext).refresh();
}

```

��������ܼ򵥣����ж� `applicationContext` �������Ƿ�Ϊ `AbstractApplicationContext`��Ȼ���ٵ��� `AbstractApplicationContext#refresh()`��

���� `AbstractApplicationContext#refresh()`���ǿ��Ǵ������������÷��������� spring �������������̡����ڱ��Ĳ��Ƿ��� spring �����£�������Ͳ�չ�������ˣ���Ҫ�˽���������̵�С�����Բο��������£�

*   [��spring Դ�������spring �������̣��ģ�������ǰ��׼������](https://my.oschina.net/funcy/blog/4633169)
*   [��spring Դ�������spring �������̣��壩��ִ�� BeanFactoryPostProcessor](https://my.oschina.net/funcy/blog/4641114)
*   [��spring Դ�������spring �������̣�������ע�� BeanPostProcessor](https://my.oschina.net/funcy/blog/4657181)
*   [��spring Դ�������spring �������̣��ߣ������ʻ����¼�����](https://my.oschina.net/funcy/blog/4892120)
*   [��spring Դ�������spring �������̣��ˣ������ BeanFactory �ĳ�ʼ��](https://my.oschina.net/funcy/blog/4658230)
*   [��spring Դ�������spring �������̣��ţ������� bean �Ĵ���](https://my.oschina.net/funcy/blog/4659524)
*   [��spring Դ�������spring �������̣�ʮ����������ɵĴ���](https://my.oschina.net/funcy/blog/4892555)

�� `AbstractApplicationContext#refresh()` �У�spring �ṩ�˼�����չ�㣺

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-b86d0fb2e3790f63b5c6590884be9401354.png)

���ǵ�ǰʹ�õ� `applicationContext` Ϊ `AnnotationConfigServletWebServerApplicationContext`������Ҳʹ������Щ��չ�㣬������Ҫ��ע��Щ��չ���Ӧ�á�

##### 1\. ����ǰ׼����`prepareRefresh()`

�������Է��֣�`initPropertySources()` ���������е������������£�

```
AbstractApplicationContext#refresh
 |- AnnotationConfigServletWebServerApplicationContext#prepareRefresh
  |- AbstractApplicationContext#prepareRefresh
   |- GenericWebApplicationContext#initPropertySources

```

���յ��õ��� `GenericWebApplicationContext#initPropertySources`��

```
protected void initPropertySources() {
    ConfigurableEnvironment env = getEnvironment();
    if (env instanceof ConfigurableWebEnvironment) {
        ((ConfigurableWebEnvironment) env).initPropertySources(this.servletContext, null);
    }
}

```

����������Ȼ�ȡ `Environment`��Ȼ���ж��Ƿ�Ϊ `ConfigurableWebEnvironment` ��ʵ������ǰ�����**׼������ʱ����**ʱ�����ǵõ��� `Environment` Ϊ `StandardServletEnvironment`���� `ConfigurableWebEnvironment` �ķ��ϣ�Ȼ����� `ConfigurableWebEnvironment#initPropertySources` ������������� `StandardServletEnvironment#initPropertySources`��

```
public void initPropertySources(@Nullable ServletContext servletContext, 
        @Nullable ServletConfigservletConfig) {
    // �滻�������õ� servletContextInitParams Ϊ servletContext
    // �滻�������õ� servletConfigInitParams Ϊ servletConfig
    WebApplicationContextUtils.initServletPropertySources(getPropertySources(), 
        servletContext, servletConfig);
}

```

����������Ǻܼ򵥣�ֻ�ǽ� `servletContext` �� `servletConfig` ���õ��� `Environment` �С�

##### 2\. ��ȡ `beanFactory`: `obtainFreshBeanFactory()`

��ǰ `applicationContext` �Ը÷�������չ����������

##### 3\. ׼�� `beanFactory`: `prepareBeanFactory(beanFactory)`

��ǰ `applicationContext` �Ը÷�������չ����������

##### 4\. ��չ�㣺`postProcessBeanFactory(beanFactory)`

`AnnotationConfigServletWebServerApplicationContext` ��д�����������

```
@Override
protected void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) {
    // ���ø���ķ���
    super.postProcessBeanFactory(beanFactory);
    // ���а�ɨ�裬����İ���������
    if (this.basePackages != null && this.basePackages.length > 0) {
        this.scanner.scan(this.basePackages);
    }
    // ע��bean��Ϊ��
    if (!this.annotatedClasses.isEmpty()) {
        this.reader.register(ClassUtils.toClassArray(this.annotatedClasses));
    }
}

```

���������ִ�й������£�

1.  �����˸���ķ��� `super.postProcessBeanFactory(beanFactory)`
2.  ���а�ɨ�裬ͨ�����Է��֣������ `basePackages` Ϊ nul
3.  ע�� `annotatedClasses`������� `annotatedClasses` Ϊ��

������Ҫ������ `super.postProcessBeanFactory(beanFactory)`���÷����� `ServletWebServerApplicationContext` �У�

```
@Override
protected void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) {
    // ���һ�� BeanPostProcessor
    beanFactory.addBeanPostProcessor(
            new WebApplicationContextServletContextAwareProcessor(this));
    // ���� ServletContextAware ���Զ�ע��
    beanFactory.ignoreDependencyInterface(ServletContextAware.class);
    // ע�� web bean �ķ�Χ�������ע��request��session��globalSession��������
    registerWebApplicationScopes();
}

```

����������ݱȽϼ򵥣���Ҫ��ע�� `BeanPostProcessor` �Լ�ע�� `web bean` �����÷�Χ������������Ҫ���� `WebApplicationContextServletContextAwareProcessor` �����ã��������£�

```
public class WebApplicationContextServletContextAwareProcessor 
        extends ServletContextAwareProcessor {

    private final ConfigurableWebApplicationContext webApplicationContext;

    public WebApplicationContextServletContextAwareProcessor(
            ConfigurableWebApplicationContext webApplicationContext) {
        Assert.notNull(webApplicationContext, "WebApplicationContext must not be null");
        this.webApplicationContext = webApplicationContext;
    }

    /**
     * ��ȡ ServletContext
     */
    @Override
    protected ServletContext getServletContext() {
        ServletContext servletContext = this.webApplicationContext.getServletContext();
        return (servletContext != null) ? servletContext : super.getServletContext();
    }

    /**
     * ��ȡ ServletConfig
     */
    @Override
    protected ServletConfig getServletConfig() {
        ServletConfig servletConfig = this.webApplicationContext.getServletConfig();
        return (servletConfig != null) ? servletConfig : super.getServletConfig();
    }

}

```

������ƺ���û����ʲô�������ٸ������࣬�������Ǹ� `BeanPostProcessor`��������Ҫ��ע���� `postProcessBeforeInitialization()` �� `postProcessAfterInitialization()` ����������

```
public class ServletContextAwareProcessor implements BeanPostProcessor {

    ...

    public Object postProcessBeforeInitialization(Object bean, 
            String beanName) throws BeansException {
        // ���� ServletContext
        if (getServletContext() != null && bean instanceof ServletContextAware) {
            ((ServletContextAware) bean).setServletContext(getServletContext());
        }
        // ���� ServletConfig
        if (getServletConfig() != null && bean instanceof ServletConfigAware) {
            ((ServletConfigAware) bean).setServletConfig(getServletConfig());
        }
        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) {
        return bean;
    }

}

```

���Կ�������� `BeanPostProcessor` ���������� `ServletContextAware` �� `ServletConfigAware` ���� `Aware` �ӿڵģ���·ͬ���� `ApplicationAware`��`BeanFactoryAware` ��һ����

##### 5\. ִ�� `BeanFactoryPostProcessors`: `invokeBeanFactoryPostProcessors(beanFactory)`

��ǰ `applicationContext` �Ը÷�������չ����������

ֵ��һ����ǣ�����������У��и��ص� `BeanFactoryPostProcessor` �ᱻִ�У�`ConfigurationClassPostProcessor`��springboot ���Զ�װ�������ע�� `@EnableAutoConfiguration` �������ﴦ���Զ�װ����ļ��ء�����ע��Ҳ���� `ConfigurationClassPostProcessor` �С�

##### 6\. ע�� `BeanPostProcessor`: `registerBeanPostProcessors(beanFactory)`

��ǰ `applicationContext` �Ը÷�������չ����������

##### 7\. ��ʼ��` MessageSource`(���ڹ��ʻ�����): `initMessageSource()`

��ǰ `applicationContext` �Ը÷�������չ����������

##### 8\. ��ʼ���¼��㲥����`initApplicationEventMulticaster()`

��ǰ `applicationContext` �Ը÷�������չ����������

##### 9\. ��չ�㣺`onRefresh()`

��ǰ `applicationContext` �Ը÷�������չΪ `ServletWebServerApplicationContext#onRefresh` �������������£�

```
@Override
protected void onRefresh() {
    // ���ø��෽��
    super.onRefresh();
    try {
        // ����web����������tomcat,jetty��
        createWebServer();
    }
    catch (Throwable ex) {
        throw new ApplicationContextException(...);
    }
}

```

���� ������web ������������������д����ġ����� web �������Ĵ��������򵥣���Ҫ�������������жϣ�����������Ǻ�������ϸ˵����

##### 10\. ע���¼���������`registerListeners()`

��ǰ `applicationContext` �Ը÷�������չ����������

##### 11\. ��ʼ������ `bean`: `finishBeanFactoryInitialization(beanFactory)`

��ǰ `applicationContext` �Ը÷�������չ����������

##### 12\. �����������: `finishRefresh()`

��ǰ `applicationContext` �Ը÷�������չΪ `ServletWebServerApplicationContext#finishRefresh` �������������£�

```
@Override
protected void finishRefresh() {
    super.finishRefresh();
    // ����web����
    WebServer webServer = startWebServer();
    if (webServer != null) {
        // ���� ServletWebServerInitializedEvent �¼�
        publishEvent(new ServletWebServerInitializedEvent(webServer, this));
    }
}

/**
 * ����web����
 */
private WebServer startWebServer() {
    WebServer webServer = this.webServer;
    if (webServer != null) {
        webServer.start();
    }
    return webServer;
}

```

���Կ�������������������� web ������

##### 13\. �������: `resetCommonCaches()`

��ǰ `applicationContext` �Ը÷�������չ����������

#### 3.10.2 ע�� `ShutdownHook`

���������� `context.registerShutdownHook()`���÷����� `AbstractApplicationContext#registerShutdownHook` �ṩ��

```
public abstract class AbstractApplicationContext extends DefaultResourceLoader
        implements ConfigurableApplicationContext {
    ...
    @Override
    public void registerShutdownHook() {
        if (this.shutdownHook == null) {
            // ָ���̵߳�����
            this.shutdownHook = new Thread(SHUTDOWN_HOOK_THREAD_NAME) {
                @Override
                public void run() {
                    synchronized (startupShutdownMonitor) {
                        // ������� ShutdownHook ������
                        doClose();
                    }
                }
            };
            Runtime.getRuntime().addShutdownHook(this.shutdownHook);
        }
    }

    /**
     * ���������Ĺرղ���
     */
    protected void doClose() {
        // Check whether an actual close attempt is necessary...
        if (this.active.get() && this.closed.compareAndSet(false, true)) {
            LiveBeansView.unregisterApplicationContext(this);

            try {
                // �����ر��¼�
                publishEvent(new ContextClosedEvent(this));
            }
            catch (Throwable ex) {
                logger.warn(...);
            }

            // ���� lifecycle �� onClose() ����
            if (this.lifecycleProcessor != null) {
                try {
                    this.lifecycleProcessor.onClose();
                }
                catch (Throwable ex) {
                    logger.warn(...);
                }
            }

            // ���� bean
            destroyBeans();

            // �ر�����
            closeBeanFactory();

            // ��չ�㣬������ʵ��
            onClose();

            // ���������
            if (this.earlyApplicationListeners != null) {
                this.applicationListeners.clear();
                this.applicationListeners.addAll(this.earlyApplicationListeners);
            }

            // ���� active ��ʶ
            this.active.set(false);
        }
    }

    ...

}

```

���Կ�����`context.registerShutdownHook()` ʵ������������ `doClose()` �������������������Ĺرղ������ر� spring �����Ĺرգ�ע���Ѿ��൱����ˣ�����Ͳ������ˡ�

���ˣ������������ͷ����������ˣ����������������� spring ���������������չ���� `onRefresh()` �� `finishRefresh()`��ǰ�ߴ����� `webServer` ���������������� `webServer` ������

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-81033ec78641ad875623cf452ef9cd62eb6.png)

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4888129](https://my.oschina.net/funcy/blog/4888129) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_