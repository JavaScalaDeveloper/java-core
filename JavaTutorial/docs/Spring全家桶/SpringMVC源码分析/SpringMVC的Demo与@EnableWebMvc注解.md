### 1\. demo ׼��

Ϊ�˸��õط��� springmvc ���Դ�룬������Ҫ��׼��һ�� springmvc �� demo������� demo ���Ƿ��� `spring-learn` ģ�顣

#### 1\. ���� tomcat ��

�� tomcat 8 ֮��tomcat �ṩ�˶��������а�����Ҫʱֱ��������������Ϳ����ˣ���Ӧ�� gradle ��������:

```
optional("org.apache.tomcat.embed:tomcat-embed-core")

```

�� spring ��Ŀ�� `build.gradle` �У��Ѿ������� `tomcat-embed-core-9.0.29.jar`������� `spring-learn` ģ��������ʱ������ָ���汾��

#### 2\. ׼��������

```
package org.springframework.learn.mvc.demo01;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Component
@ComponentScan("org.springframework.learn.mvc.demo01")
@EnableWebMvc
public class MvcConfig {

}

```

������Ϊ `MvcConfig`������ָ������Ŀ�İ�ɨ��·�����Լ�ͨ�� `@EnableWebMvc` ���� mvc ���ܡ�

#### 3\. ʵ�� `WebApplicationInitializer`

```
package org.springframework.learn.mvc.demo01;

import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

import javax.servlet.ServletContext;
import javax.servlet.ServletRegistration;

public class MyWebApplicationInitializer implements WebApplicationInitializer {

    @Override
    public void onStartup(ServletContext servletContext) {
        AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
        context.register(MvcConfig.class);

        DispatcherServlet servlet = new DispatcherServlet(context);
        ServletRegistration.Dynamic registration = servletContext.addServlet("app", servlet);
        registration.setLoadOnStartup(1);
        registration.addMapping("/*");
    }
}

```

spring �ṩ��һ���ӿ� ����`WebApplicationInitializer`��ʵ�ָýӿ�ʱ�������� `onStartup(...)` �����д��� spring �� `applicationContext`��Ȼ���� servelet ��ע�� `DispatcherServlet`��

#### 4\. ׼�� controller

```
package org.springframework.learn.mvc.demo01;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

����׼����һ���򵥵� controller������һ���ַ��� "hello world".

#### 5\. ����

���������������ˣ�

```
package org.springframework.learn.mvc.demo01;

import org.apache.catalina.Context;
import org.apache.catalina.LifecycleListener;
import org.apache.catalina.connector.Connector;
import org.apache.catalina.startup.Tomcat;

public class MvcDemo01Main {

    public static void main(String[] args) throws Exception {
        Tomcat tomcat = new Tomcat();

        Connector connector = new Connector();
        connector.setPort(8080);
        connector.setURIEncoding("UTF-8");
        tomcat.getService().addConnector(connector);

        Context context = tomcat.addContext("", System.getProperty("java.io.tmpdir"));
        LifecycleListener lifecycleListener = (LifecycleListener) 
                Class.forName(tomcat.getHost().getConfigClass())
                .getDeclaredConstructor().newInstance();
        context.addLifecycleListener(lifecycleListener);
        tomcat.start();
        tomcat.getServer().await();
    }
}

```

�� `main` �����У���Ҫ���� tomcat �����߼���

���У�������£�

����̨��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-8d13bb650364488f8ce5e593eff00448ee1.png)

ҳ�淵�أ�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-6a8407a1945dccd6e4ef217a383d4309ec5.png)

���Կ�����һ���򵥵� springmvc ��Ŀ�ʹ����ˡ�

### 2. `servlet 3.0` �淶����

�����¹��ϵ� springmvc ��Ŀ��һ�����⼸�� xml �����ļ���

*   `web.xml`��servlet �����ļ������� web ����ʱ�Ĳ������Լ� `servlet`/`listener`/`filter`;
*   `spring.xml`��spring �����������ļ�����Ҫ�������� spring bean.
*   `spring-mvc.xml`��springmvc �����ļ����������� mvc ��ص� bean�����ļ��ϴ���ص� bean����ͼ���� bean��controller ��·���ȡ�

��Ŀ������ʱ�����ȼ��� `web.xml`���� `web.xml` �м��� spring ������ã����� spring ������

������� demo �У����Ƿ��ֲ� û����Щ���ã������� `web.xml` �ļ���û�У���ô������� web ��Ŀ����ô�������أ�

�� `servlet` �� `3.0` ֮���ṩ��һ�� spi �淶��spring ����ʵ�����£�

1.  �� `spring-web` ģ��� `/src/main/resources/META-INF/services/` �ļ����£������ļ� `javax.servlet.ServletContainerInitializer`����������

```
org.springframework.web.SpringServletContainerInitializer

```

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-92853ebc9c4388d325244b81557ecf80ddd.png)

1.  `org.springframework.web.SpringServletContainerInitializer` ʵ���� servlet �淶��

```
// @HandlesTypes ע��������servlet�淶����ʾ webAppInitializerClass Ϊ WebApplicationInitializer.class
@HandlesTypes(WebApplicationInitializer.class)
public class SpringServletContainerInitializer implements ServletContainerInitializer {

    /*
     * ��д ServletContainerInitializer �� onStartup ����
     * ������������Ҫ��ʵ���� spring �ṩ�� WebApplicationInitializer.class��Ȼ��ִ���� onStartup ����
     *
     * Set<Class<?>> webAppInitializerClasses �е�����Ϊ WebApplicationInitializer.class��
     * ��������� @HandlesTypes ע��ָ��
     */
    @Override
    public void onStartup(@Nullable Set<Class<?>> webAppInitializerClasses, ServletContext servletContext)
            throws ServletException {

        List<WebApplicationInitializer> initializers = new LinkedList<>();

        if (webAppInitializerClasses != null) {
            for (Class<?> waiClass : webAppInitializerClasses) {
                if (!waiClass.isInterface() && !Modifier.isAbstract(waiClass.getModifiers()) &&
                        WebApplicationInitializer.class.isAssignableFrom(waiClass)) {
                    try {
                       // ʹ�÷���ʵ���� WebApplicationInitializer ��ʵ���࣬��ӵ� initializers ��
                        initializers.add((WebApplicationInitializer)
                                ReflectionUtils.accessibleConstructor(waiClass).newInstance());
                    }
                    catch (Throwable ex) {
                        ...
                    }
                }
            }
        }

        servletContext.log(initializers.size() + " ...");
        // ����ʵ����Orderd�ӿڣ���ע @Order ע�⣬��ʵ���� PriorityOrderd �ӿ�
        AnnotationAwareOrderComparator.sort(initializers);
        for (WebApplicationInitializer initializer : initializers) {
           // ���� WebApplicationInitializer ʵ�����onStartup����
           initializer.onStartup(servletContext);
        }
    }

}

```

1.  `WebApplicationInitializer` ��ʵ�� ���������� demo �ж� `WebApplicationInitializer` ��ʵ�֣�

```
package org.springframework.learn.mvc.demo01;

import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

import javax.servlet.ServletContext;
import javax.servlet.ServletRegistration;

public class MyWebApplicationInitializer implements WebApplicationInitializer {

    /*
     * ���������� spring ��Ŀ
     */
    @Override
    public void onStartup(ServletContext servletContext) {
        // ���� spring �� ApplicationContext
        AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
        context.register(MvcConfig.class);

        // ��� DispatcherServlet �� servlet ��
        DispatcherServlet servlet = new DispatcherServlet(context);
        ServletRegistration.Dynamic registration = servletContext.addServlet("app", servlet);
        registration.setLoadOnStartup(1);
        registration.addMapping("/*");
    }
}

```

����ִ�й������£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-0874fa7ef39ca9c405cdf55d99ca891ebf2.png)

�ɴˣ�spring �����������ˡ�

### 3\. @EnableWebMvc ����

�� demo �У�����ͨ�� `@EnableWebMvc` ������ mvc ���ܣ���ô���ע������ʲô�أ����ǽ��� `EnableWebMvc` �ࣺ

```
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Documented
@Import(DelegatingWebMvcConfiguration.class)
public @interface EnableWebMvc {
}

```

���Կ��������ע��ͨ�� `@Import` ע�������� `DelegatingWebMvcConfiguration.class`�������������� `DelegatingWebMvcConfiguration`:

```
@Configuration(proxyBeanMethods = false)
public class DelegatingWebMvcConfiguration extends WebMvcConfigurationSupport {
    ...

}

```

�������� `@Configuration` ע�⣬�������Ǹ������࣬�����̳е��� `WebMvcConfigurationSupport`��������������`WebMvcConfigurationSupport` Ϊ "mvc ����֧��"�������������������ô��� mvc ��ص����õġ�

Ϊ�˸��õط����������Ƚ��ܼ����ࣺ

1. `DelegatingWebMvcConfiguration`���� `@EnableWebMvc` ������࣬�� `WebMvcConfigurationSupport` �����࣬��д�� `WebMvcConfigurationSupport` �ṩ�����÷�����

   ```
   /*
    * @Configuration���������Ǹ�������
    * extends WebMvcConfigurationSupport���̳���WebMvcConfigurationSupport��
    */
   @Configuration(proxyBeanMethods = false)
   public class DelegatingWebMvcConfiguration extends WebMvcConfigurationSupport {
   
       // WebMvcConfigurerComposite �� WebMvcConfigurer ����ϣ�������ᵽ
       private final WebMvcConfigurerComposite configurers = new WebMvcConfigurerComposite();
   
       /**
        * ����configurers
        * �����@Autowiredע�⣬��ʾ��spring�����е�����WebMvcConfigurer bean ��Ϊ
        * ����configurers��ֵ ��Ȼ����ø÷���
        */
       @Autowired(required = false)
       public void setConfigurers(List<WebMvcConfigurer> configurers) {
           if (!CollectionUtils.isEmpty(configurers)) {
               this.configurers.addWebMvcConfigurers(configurers);
           }
       }
   
       /**
        * ����PathMatch
        */
       @Override
       protected void configurePathMatch(PathMatchConfigurer configurer) {
           // ���� WebMvcConfigurerComposite �ķ�����������
           this.configurers.configurePathMatch(configurer);
       }
   
       // �������÷���Ҳ�ǵ��� WebMvcConfigurerComposite ��Ӧ�ķ����������õ�
       ...
   
   }
   
   ```

2. `WebMvcConfigurerComposite`��`WebMvcConfigurer` ����ϣ�

   ```
   /**
    * ʵ���� WebMvcConfigurer
    */
   class WebMvcConfigurerComposite implements WebMvcConfigurer {
   
       // delegates����Ϊ WebMvcConfigurer �ļ���
       private final List<WebMvcConfigurer> delegates = new ArrayList<>();
   
       /*
        * ��DelegatingWebMvcConfiguration#setConfigurers����
        * �����ǰѴ����configurers��ӵ�delegates(Ҳ����WebMvcConfigurer����)��
        */
       public void addWebMvcConfigurers(List<WebMvcConfigurer> configurers) {
           if (!CollectionUtils.isEmpty(configurers)) {
               this.delegates.addAll(configurers);
           }
       }
   
       /**
        * ����ʱ�������delegates(Ҳ����WebMvcConfigurer����)����������������õ�
        * �����е�ÿһ��WebMvcConfigurer
        */
       @Override
       public void configurePathMatch(PathMatchConfigurer configurer) {
           for (WebMvcConfigurer delegate : this.delegates) {
               delegate.configurePathMatch(configurer);
           }
       }
   
       // �����������ƣ�ʡ��
       ...
   }
   
   ```

3. `WebMvcConfigurer`��springmvc �����ýӿڣ��ṩ�˷ǳ��������

   ```
   public interface WebMvcConfigurer {
   
       default void configurePathMatch(PathMatchConfigurer configurer) {
       }
   
       default void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
       }
   
       default void configureAsyncSupport(AsyncSupportConfigurer configurer) {
       }
   
       ...
   }
   
   ```

4. `WebMvcConfigurationSupport`��springmvc ������֧����

   ```
   /**
    * ʵ��������aware�ӿ�
    */
   public class WebMvcConfigurationSupport implements ApplicationContextAware, ServletContextAware {
   
       //================= ���� XxxAware �ӿڵķ��� =================
       @Override
       public void setApplicationContext(@Nullable ApplicationContext applicationContext) {
           this.applicationContext = applicationContext;
       }
   
       @Override
       public void setServletContext(@Nullable ServletContext servletContext) {
           this.servletContext = servletContext;
       }
   
       //================= @Bean ��������spring����� bean =================
       @Bean
       public RequestMappingHandlerMapping requestMappingHandlerMapping(...) {
           RequestMappingHandlerMapping mapping = createRequestMappingHandlerMapping();
           mapping.setOrder(0);
           // getInterceptors(...) ��ȡ interceptors�����¿�
           mapping.setInterceptors(getInterceptors(conversionService, resourceUrlProvider));
           mapping.setContentNegotiationManager(contentNegotiationManager);
           // getCorsConfigurations(...) ��ȡCors���ã����¿�
           mapping.setCorsConfigurations(getCorsConfigurations());
           // getPathMatchConfigurer(...) ��ȡPathMatch���ã����¿�
           PathMatchConfigurer configurer = getPathMatchConfigurer();
   
           ...
   
           return mapping;
       }
       ...
       //================= get xxx ���÷��������spring�ṩ��Ĭ�����ã�����Զ������� =======
       // ��ȡ interceptors
       protected final Object[] getInterceptors(
               FormattingConversionService mvcConversionService,
               ResourceUrlProvider mvcResourceUrlProvider) {
           if (this.interceptors == null) {
               InterceptorRegistry registry = new InterceptorRegistry();
               // �������÷�������� interceptor�����¿�
               addInterceptors(registry);
               registry.addInterceptor(new ConversionServiceExposingInterceptor(mvcConversionService));
               registry.addInterceptor(new ResourceUrlProviderExposingInterceptor(mvcResourceUrlProvider));
               this.interceptors = registry.getInterceptors();
           }
           return this.interceptors.toArray();
       }
   
       // ��ȡCors����
       protected final Map<String, CorsConfiguration> getCorsConfigurations() {
           if (this.corsConfigurations == null) {
               CorsRegistry registry = new CorsRegistry();
               // �������÷�������� CorsMapping�����¿�
               addCorsMappings(registry);
               this.corsConfigurations = registry.getCorsConfigurations();
           }
           return this.corsConfigurations;
       }
   
       // ��ȡPathMatch����
       protected PathMatchConfigurer getPathMatchConfigurer() {
           if (this.pathMatchConfigurer == null) {
               this.pathMatchConfigurer = new PathMatchConfigurer();
               configurePathMatch(this.pathMatchConfigurer);
           }
           return this.pathMatchConfigurer;
       }
   
       ...
   
       //================= ���÷�������������ʵ�� =================
       // ����Զ��� Interceptor��������ʵ��
       protected void addInterceptors(InterceptorRegistry registry) {
       }
   
       // ����Զ��� CorsMapping��������ʵ��
       protected void addCorsMappings(CorsRegistry registry) {
       }
   
       // �����Զ��� PathMatch
       protected void configurePathMatch(PathMatchConfigurer configurer) {
       }
       ...
   
   }
   
   ```

   ���Կ����������ķ�����Ϊ���ࣺ

    *   ���� `XxxAware` �ķ�����`XxxAware` �ӿ��� spring �ṩ��bean ��ʼ�����ʱ����ص���
    *   �� `@Bean` ע��ķ������� spring ����� bean������ bean ʱ����� `getXxx` ������
    *   `getXxx` ��������ȡ���÷������ڸ÷����У������ spring �ṩ��Ĭ�����ã��Լ����� `addXxx/configureXxx` ��������Զ������ã�
    *   `addXxx/configureXxx` ������������ʵ�֣������� springmvc ������Զ������á�

�����ܽ����� 4 ����Ĺ�ϵ��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-5e25e6e7303044e7282b3472492c04cf656.png)

���������ĸ���Ĺ�ϵ��`@EnableWebMvc` ��ִ�����̾�һĿ��Ȼ�ˣ������ܽ����£�

1.  `@EnableWebMvc` �� spring ������������` DelegatingWebMvcConfiguration`��

2.  `DelegatingWebMvcConfiguration` ���а��� `@Autowired` ע��ķ��� `setConfigurers(List<WebMvcConfigurer>)`���� spring bean �������л����ִ�У�����Ϊ��ȡ���������� `WebMvcConfigurer` �� bean �������õ�` DelegatingWebMvcConfiguration` �������У�

3.  `DelegatingWebMvcConfiguration` �̳��� `WebMvcConfigurationSupport`���� spring bean �������лᴦ�� `WebMvcConfigurationSupport` ���� `@Bean` ע��ķ��������ַ����Ƚ϶࣬�� `requestMappingHandlerMapping()`��`mvcPathMatcher` �ȣ���Щ���� smvc �Ĺ��������

4.  �ڴ��� `WebMvcConfigurationSupport` ���� `@Bean` ע��ķ���ʱ������� `getXxx()` ��ȡ������ã������ð��� spring �ṩ��Ĭ�����ü��Զ������ã�`getXxx()` �� `WebMvcConfigurationSupport` �ṩ��

5.  �ڵ��� `WebMvcConfigurationSupport#getXxx()` ��ȡ�Զ�������ʱ������� `addXxx()/configureXxx()`���÷����� `WebMvcConfigurationSupport` ���ǿշ������������߼������� (Ҳ����` DelegatingWebMvcConfiguration`) �ṩ�����յ��÷�ʽ��**����ִ�е� 2 ����ȡ�� `WebMvcConfigurer` �� `addXxx()/configureXxx()`**��

������������ͼ��ʾ��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-4057f913076f01ba0b507b4654e5031391c.png)

������ springmvc ���ܣ�������Զ�������ʱ�����ǿ�����ô��:

1. ��ʽ 1��ʹ�� @EnableWebMvc ע������ mvc ���ܣ�ʵ�� WebMvcConfigurer������Զ�������

   ```
   // ʹ��@EnableWebMvcע������mvc����
   @Component
   @EnableWebMvc
   public class MvcConfig {
       ...
   }
   
   // ʵ�� WebMvcConfigurer������Զ�������
   @Component
   public class MyWebMvcConfigurer implements WebMvcConfigurer {
   
       // ��дWebMvcConfigurer�����������Զ�������
   }
   
   ```

2. ��ʽ 2��ʵ�� `WebMvcConfigurationSupport` �࣬��д���е����÷���

   ```
   @Component
   public class MyWebMvcConfigurationSupport extends WebMvcConfigurationSupport {
       // ��д���÷����������Զ�������
   
   }
   
   ```

   �����������ַ�ʽ����ʵ�� `WebMvcConfigurer` ����Զ������þͲ���Ч�ˣ��Զ�������ֻ���� `WebMvcConfigurationSupport` �������á�

springmvc �ṩ����Щ�������أ����������� `WebMvcConfigurer` �ṩ�ķ�����

*   `configurePathMatch`������·���������
*   `configureContentNegotiation`������Э������
*   `configureAsyncSupport`��
*   `configureDefaultServletHandling`��Ĭ�Ͼ�̬��Դ������
*   `addFormatters`��ע���Զ���ת����
*   `addInterceptors`������������
*   `addResourceHandlers`����Դ����
*   `addCorsMappings`��CORS ����
*   `addViewControllers`����ͼ��ת������
*   `configureViewResolvers`��������ͼ����
*   `addArgumentResolvers`������Զ��巽������������
*   `addReturnValueHandlers`������Զ��巵�ؽ��������
*   `configureMessageConverters`��������Ϣת���������ػḲ��Ĭ��ע��� `HttpMessageConverter`
*   `extendMessageConverters`��������Ϣת�����������һ���Զ���� `HttpMessageConverter`.
*   `configureHandlerExceptionResolvers`�������쳣ת����
*   `extendHandlerExceptionResolvers`������쳣ת����
*   `getValidator`:
*   `getMessageCodesResolver`��

�����Ҫ��������ֻ��Ҫ��д��ط��� ���ɡ�

��������������� `WebMvcConfigurationSupport` ����������Щ Bean���� `@Bean` ע��ķ������£�

*   `public RequestMappingHandlerMapping requestMappingHandlerMapping(...)`
*   `public PathMatcher mvcPathMatcher()`
*   `public UrlPathHelper mvcUrlPathHelper()`
*   `public ContentNegotiationManager mvcContentNegotiationManager()`
*   `public HandlerMapping viewControllerHandlerMapping(...)`
*   `public BeanNameUrlHandlerMapping beanNameHandlerMapping(...)`
*   `public RouterFunctionMapping routerFunctionMapping(...)`
*   `public HandlerMapping resourceHandlerMapping(...)`
*   `ResourceUrlProvider mvcResourceUrlProvider()`
*   `public HandlerMapping defaultServletHandlerMapping()`
*   `public RequestMappingHandlerAdapter requestMappingHandlerAdapter(...)`
*   `public HandlerFunctionAdapter handlerFunctionAdapter()`
*   `public FormattingConversionService mvcConversionService()`
*   `public Validator mvcValidator()`
*   `public CompositeUriComponentsContributor mvcUriComponentsContributor(...)`
*   `public HttpRequestHandlerAdapter httpRequestHandlerAdapter()`
*   `public SimpleControllerHandlerAdapter simpleControllerHandlerAdapter()`
*   `public HandlerExceptionResolver handlerExceptionResolver(...)`
*   `public ViewResolver mvcViewResolver(...)`
*   `HandlerMappingIntrospector mvcHandlerMappingIntrospector()`

��Щ���� springmvc ���õ���һЩ���������ľ������ݾͲ�չ���ˡ�

### 4\. �ܽ�

�������ݱȽ��ӣ����ṩ��һ�� springmvc �� demo��Ȼ������� demo �� `0 xml` ����ԭ�� (Ҳ���� `servlet 3.0` �淶�������Ž����� `@EnableWebMvc` �Ĺ��ܣ����ؽ����� `WebMvcConfigurationSupport` �����á�

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4696657](https://my.oschina.net/funcy/blog/4696657) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_