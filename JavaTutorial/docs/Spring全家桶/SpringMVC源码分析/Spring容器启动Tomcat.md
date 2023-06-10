''�� [spring mvc ֮ springmvc demo �� @EnableWebMvc ע��](https://my.oschina.net/funcy/blog/4696657)һ���У������ṩ��һ��ʾ�� demo���� demo �������� servlet ������Ȼ��ͨ�� `servlet3.0` �淶�� `DispatcherServlet` ע�ᵽ `servlet` �����У�Ȼ���� `DispatcherServlet#init` ���������� spring �������������̾���������

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-0874fa7ef39ca9c405cdf55d99ca891ebf2.png)

��ûʲô���⣬����������Ҳ�������ã�ֻ���������� spring �������޷���ȡ `DispatcherServlet`����������

```
@Component
public class Test {
    // ��ǰ���ṩ��ʾ����tomcat������spring��������ע�벻�˵�
    @Autowired
    public DispatcherServlet dispatcherServlet;

    ...

}

```

����ʱ��spring �϶��ᱨ����Ϊ�Ҳ��� `DispatcherServlet` ��Ӧ�� bean��

����ڿ� springboot Դ��ʱ������ spring ������������ tomcat ���������ģ��෴��springboot �������� spring ������Ȼ���� spring �������� tomcat ��������������������أ����ﱾ���ṩһ�� demo ģ���¡�

### 1\. ׼�� `DispatcherServlet`

```
@Component
@EnableWebMvc
public class MvcConfig implements WebMvcConfigurer {

    @Override
    public void configureViewResolvers(ViewResolverRegistry registry) {
        InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
        viewResolver.setPrefix("/WEB-INF/views/");
        viewResolver.setSuffix(".html");
        registry.viewResolver(viewResolver);
    }

    /**
     * dispatcherServlet
     * @param webApplicationContext
     * @return
     */
    @Bean
    public DispatcherServlet dispatcherServlet(WebApplicationContext webApplicationContext) {
        return new DispatcherServlet(webApplicationContext);
    }

}

```

�Ը���˵�����£�

*   `MvcConfig` �౻ `@EnableWebMvc` ע���ǣ���ʾ��Ҫ������ `web mvc` ����
*   `MvcConfig` ʵ���� `WebMvcConfigurer`������ͨ����д `WebMvcConfigurer` �ķ�����ʵ���Զ��� `web mvc` ������
*   `MvcConfig` �л����� `DispatcherServlet` bean���� bean �ᱣ�浽 spring ������

### 2\. ׼��һ�� `WebApplicationInitializer` ʵ����

```
@Component
public class MyWebApplicationInitializer implements WebApplicationInitializer {

    private static BeanFactory beanFactory;

    private static AbstractRefreshableWebApplicationContext applicationContext;

    @Override
    public void onStartup(ServletContext servletContext) {
        // �� beanFactory �л�ȡ DispatcherServlet ��ע�ᵽservlet����
        DispatcherServlet servlet = beanFactory.getBean(DispatcherServlet.class);
        ServletRegistration.Dynamic registration = servletContext.addServlet("app", servlet);
        // loadOnStartup ���ó� -1 ʱ��ֻ���ڵ�һ������ʱ���Ż���� init ����
        registration.setLoadOnStartup(-1);
        registration.addMapping("/*");

        // Ϊ applicationContext ���� servletContext
        applicationContext.setServletContext(servletContext);
    }

    /**
     * ���� beanFactory
     * ΪʲôҪ���� beanFactory��ֵ����Ϊ DispatcherServlet Ҫ�� beanFactory �л�ȡ
     * @param beanFactory
     * @throws BeansException
     */
    public static void setBeanFactory(BeanFactory beanFactory) throws BeansException {
        MyWebApplicationInitializer.beanFactory = beanFactory;
    }

    /**
     * ���� applicationContext
     * ΪʲôҪ���� applicationContext ��ֵ����Ϊ servletContext Ҫ���õ� applicationContext
     * @param applicationContext
     */
    public static void setApplicationContext(
                AbstractRefreshableWebApplicationContext applicationContext) {
        MyWebApplicationInitializer.applicationContext = applicationContext;
    }
}

```

`WebApplicationInitializer` �� spring �� servlet 3.0 �淶��ʵ�֣��� [spring mvc ֮ springmvc demo �� @EnableWebMvc ע��](https://my.oschina.net/funcy/blog/4696657)һ��Ҳ��ϸ��������tomcat ������ʱ����ִ�� `WebApplicationInitializer#onStartup` ������

�� `MyWebApplicationInitializer` ˵�����£�

*   `MyWebApplicationInitializer` ����������̬��Ա������`beanFactory` �� `applicationContext`����Ӧ���ṩ��������̬ `set` ��������Ҫע����ǣ���������̬ `set` ����Ҫ�� `onStartup()` ����ǰ���ã�Ҳ���� tomcat ����ǰ���õ��ã�
*   �� `MyWebApplicationInitializer#onStartup` �����У��������Ǵ� `beanFactory` �л�ȡ�� `DispatcherServlet`��Ȼ����ע�ᵽ `servlet` �����У�Ȼ�� `onStartup(...)` �����Ĳ��� `servletContext` ���õ� `applicationContext` ��

### 3\. ׼��һ�� `ServletContextAwareProcessor` ������

```
public class MyServletContextAwareProcessor extends ServletContextAwareProcessor {

	AbstractRefreshableWebApplicationContext webApplicationContext;

	/**
	 * ���� webApplicationContext
	 * @param webApplicationContext
	 */
	public MyServletContextAwareProcessor(
                AbstractRefreshableWebApplicationContext webApplicationContext) {
		this.webApplicationContext = webApplicationContext;
	}

	/**
	 * ���� ServletContext
	 * �ȴ� webApplicationContext �л�ȡ�������ȡ�������ٴӸ��෽���л�ȡ
	 * @return
	 */
	@Override
	protected ServletContext getServletContext() {
		ServletContext servletContext = this.webApplicationContext.getServletContext();
		return (servletContext != null) ? servletContext : super.getServletContext();
	}

	@Override
	protected ServletConfig getServletConfig() {
		ServletConfig servletConfig = this.webApplicationContext.getServletConfig();
		return (servletConfig != null) ? servletConfig : super.getServletConfig();
	}
}

```

�� `MyWebApplicationInitializer#onStartup` �����ж� `applicationContext` ���õ� `servletContext` ����������ʹ�õģ�`MyServletContextAwareProcessor` �Ĺ��췽�������� `webApplicationContext`��Ȼ����д�� `getServletContext()` ��������ȡ `servletContext` ʱ���ȴ� `webApplicationContext` �л�ȡ�������ȡ�������ٴӸ��෽���л�ȡ��

### 4\. ׼��һ�� `ApplicationContext` ��ʵ����

`ApplicationContext` ������Ҫ����������ѡ��ֱ����չ `AnnotationConfigWebApplicationContext`��

```
public class MyWebApplicationContext extends AnnotationConfigWebApplicationContext {

    private Tomcat tomcat;

    /**
     * ��д postProcessBeanFactory ����
     * �������������������Զ���� MyServletContextAwareProcessor
     * @param beanFactory
     */
    @Override
    protected void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) {
        beanFactory.addBeanPostProcessor(new MyServletContextAwareProcessor(this));
        beanFactory.ignoreDependencyInterface(ServletContextAware.class);
        WebApplicationContextUtils.registerWebApplicationScopes(getBeanFactory());
    }

    /**
     * ��������������� tomcat
     */
    @Override
    protected void onRefresh() {
        // �ȵ��ø���ķ���
        super.onRefresh();
        // ���� MyWebApplicationInitializer �� beanFactory �� applicationContext
        MyWebApplicationInitializer.setBeanFactory(getBeanFactory());
        MyWebApplicationInitializer.setApplicationContext(this);

        // tomcat�Ĵ���������
        tomcat = new Tomcat();
        Connector connector = new Connector();
        connector.setPort(8080);
        connector.setURIEncoding("UTF-8");
        tomcat.getService().addConnector(connector);

        Context context = tomcat.addContext("", System.getProperty("java.io.tmpdir"));
        LifecycleListener lifecycleListener = null;
        try {
            lifecycleListener = (LifecycleListener) 
                    Class.forName(tomcat.getHost().getConfigClass())
                    .getDeclaredConstructor().newInstance();
            context.addLifecycleListener(lifecycleListener);
            // ����tomcat
            tomcat.start();
        } catch (Exception e) {
            System.out.println("�����쳣��");
            e.printStackTrace();
        }
    }

}

```

�������չ�� spring ���������̣�����һ����д����������������һһ������:

*   `postProcessBeanFactory()`�����������Ҫ��Ϊ��ע�� `MyServletContextAwareProcessor`��ǰ������׼���� `MyServletContextAwareProcessor` ����������ע��ģ�֮������д������Ϊ��ʹ�� `tomcat` �ṩ�� `ServletContext`��
*   `onRefresh()`�������������������� `MyWebApplicationInitializer` �� `beanFactory` �� `applicationContext` ����ֵ��Ȼ������ `tomcat`��

### 5\. ׼��һ���򵥵� `Controller`

׼��һ�� `Controller`����Ҫ�ǰ���������֤��Ŀ�Ƿ�����������

```
@RestController
@RequestMapping("/test")
public class TestController {

    @RequestMapping("/hello")
    public String hello() {
        System.out.println("hello!!!");
        return "hello world!";
    }

}

```

### 6\. ����

�����������ˣ���Ҫ�Ǵ��� spring ������������Ҳ���൱�򵥣�

```
@ComponentScan
public class MvcDemo03Main {

    public static void main(String[] args) throws Exception {
        MyWebApplicationContext webApplicationContext = new MyWebApplicationContext();
        webApplicationContext.register(MvcDemo03Main.class);
        webApplicationContext.refresh();
    }
}

```

���У����� `http://localhost:8080/test/hello`��������£�

ҳ�棺

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-d87b4a09e7a87e0535eb52a09759fcc6534.png)

����̨��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-c608886c751dcf595d74efb8506e5d67306.png)

### 7\. ���⣺������`DispatcherServlet#init` �������ٴ����� spring ������

ǰ�����Ƿ�������ʹ�� tomcat ���� spring �����ķ�ʽʱ��spring �������� `DispatcherServlet#init` �����������ģ�������ʹ�� **spring �������� tomcat** ��������ʽʱ��tomcat ִ�� `DispatcherServlet#init` ����ʱ�����ٴ����� spring ������

��������ֱ�ӽ��� `FrameworkServlet#initWebApplicationContext` ���������϶ϵ㣺

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-64ee29f90ef5683f7968f782b9175d42e0f.png)

����� `wac` �� `this.webApplicationContext` ���� `MyWebApplicationContext` ��ʵ�����ڴ��� `DispatcherServlet` ʱ�����:

```
@Bean
public DispatcherServlet dispatcherServlet(WebApplicationContext webApplicationContext) {
    // �ڹ��췽���Ĳ����д����� webApplicationContext
    return new DispatcherServlet(webApplicationContext);
}

```

����Ϊʲô�����������������Ϊ `DispatcherServlet#init` ���������ú�����������������ﴦ�� spring �����������ģ����ϵ����е� `if (!cwac.isActive()) {...` ʱ��`!cwac.isActive()` ���ؽ��Ϊ `false`����� `if` ��������� spring �����Ͳ���ִ�е��ˡ�

����������ͨ�� spring �������� tomcat ���� `DispatcherServlet#init` �ﲻ���ٴ����� spring ����������������`DispatcherServlet` ����һ�� spring bean�����ǾͿ����ڴ�����ʹ�� `@Autowired` ע�⽫��ע�뵽���������ˣ�

```
@Component
public class Test {
    // ���ĵ�ʾ������ spring ���������� tomcat���ǿ���ע��ɹ���
    @Autowired
    public DispatcherServlet dispatcherServlet;

    ...

}

```

���� `spring` ���� `tomcat` �ķ����͵�������е��ѵ�����**��ν� `tomcat` �ṩ�� `ServletContext` ���õ� `ServletContextAwareProcessor` ��**�����еĽ����ʽע����ᡣ

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4928222](https://my.oschina.net/funcy/blog/4928222) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_