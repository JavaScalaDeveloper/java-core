Spring Cloud Zuul ��Spring Cloud Netflix ����Ŀ�ĺ������֮һ��������Ϊ΢����ܹ��е�API����ʹ�ã�֧�ֶ�̬·������˹��ܣ����Ľ������÷�������ϸ���ܡ�

# Zuul���

API����Ϊ΢����ܹ��еķ����ṩ��ͳһ�ķ�����ڣ��ͻ���ͨ��API���ط�����ط���API���صĶ������������ģʽ�е�����ģʽ�����൱������΢����ܹ��е����棬���пͻ��˵ķ��ʶ�ͨ����������·�ɼ����ˡ���ʵ��������·�ɡ����ؾ��⡢У����ˡ������ݴ�����ۺϵȹ��ܡ�

#����һ��zuul-proxyģ��

�������Ǵ���һ��zuul-proxyģ������ʾzuul�ĳ��ù��ܡ�

#��pom.xml������������



    <dependency>
        <groupId>org.springframework.cloud</groupId>
        spring-cloud-starter-netflix-eureka-client
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        spring-cloud-starter-netflix-zuul
    </dependency>




# ��application.yml�н�������



    server:
      port: 8801
    spring:
      application:
        name: zuul-proxy
    eureka:
      client:
        register-with-eureka: true
        fetch-registry: true
        service-url:
          defaultZone: http://localhost:8001/eureka/


#�������������@EnableZuulProxyע��������Zuul��API���ع���



    @EnableZuulProxy
    @EnableDiscoveryClient
    @SpringBootApplication
    public class ZuulProxyApplication {
    
        public static void main(String[] args) {
            SpringApplication.run(ZuulProxyApplication.class, args);
        }
    
    }



# ���ù���

# ������ط���

��������ͨ������eureka-server������user-service��feign-service��zuul-proxy����ʾZuul�ĳ��ù��ܣ�������ע��������ʾ���¡�



# ����·�ɹ���

- ���ǿ���ͨ���޸�application.yml�е�����������·�ɹ����������ǽ�ƥ��/userService/**������·�ɵ�user-service������ȥ��ƥ��/feignService/**������·�ɵ�feign-service��ȥ��



    zuul:
      routes: #����������·��
        user-service:
          path: /userService/**
        feign-service:
          path: /feignService/**



- ����http://localhost:8801/userService/user/1open in new window���Է�������·�ɵ���user-service���ˣ�
- ����http://localhost:8801/feignService/user/1open in new window���Է�������·�ɵ���feign-service���ˡ�

# Ĭ��·�ɹ���

- Zuul��Eureka���ʹ�ã�����ʵ��·�ɵ��Զ����ã��Զ����õ�·���Է�������Ϊƥ��·�����൱���������ã�



    zuul:
      routes: #����������·��
        user-service:
          path: /user-service/**
        feign-service:
          path: /feign-service/**



- ����http://localhost:8801/user-service/user/1open in new windowͬ������·�ɵ���user-service���ˣ�
- ����http://localhost:8801/feign-service/user/1open in new windowͬ������·�ɵ���feign-service���ˡ�
- �������ʹ��Ĭ�ϵ�·�ɹ��򣬿��������������������Ĭ��·�����ã�



    zuul:
      ignored-services: user-service,feign-service #�ر�Ĭ��·������





# ���ؾ��⹦��

��ε���http://localhost:8801/user-service/user/1open in new window���в��ԣ����Է���������8201��8202��user-service�������ӡ������Ϣ��



    2019-10-05 10:31:58.738  INFO 11520 --- [nio-8202-exec-5] c.macro.cloud.controller.UserController  : ����id��ȡ�û���Ϣ���û�����Ϊ��macro
    2019-10-05 10:32:00.356  INFO 11520 --- [nio-8202-exec-6] c.macro.cloud.controller.UserController  : ����id��ȡ�û���Ϣ���û�����Ϊ��macro



# ���÷���ǰ׺

���ǿ���ͨ������������������·�����ǰ׺���˴������/proxyǰ׺������������Ҫ����http://localhost:8801/proxy/user-service/user/1open in new window���ܷ��ʵ�user-service�еĽӿڡ�



    zuul:
      prefix: /proxy #������·�����ǰ׺




# Header���˼��ض������Host

- Zuul������·��ʱ��Ĭ�ϻ���˵�һЩ���е�ͷ��Ϣ���������ÿ��Է�ֹ·��ʱ��Cookie��Authorization�Ķ�ʧ��



    zuul:
      sensitive-headers: Cookie,Set-Cookie,Authorization #���ù������е�����ͷ��Ϣ������Ϊ�վͲ������




- Zuul������·��ʱ���������������hostͷ��Ϣ���������ÿ��Խ����



    zuul:
      add-host-header: true #����Ϊtrue�ض����ǻ����host����ͷ



# �鿴·����Ϣ

���ǿ���ͨ��SpringBoot Actuator���鿴Zuul�е�·����Ϣ��

- ��pom.xml��������������



    <dependency>
        <groupId>org.springframework.boot</groupId>
        spring-boot-starter-actuator
    </dependency>






- �޸�application.yaml�����ļ��������鿴·�ɵĶ˵㣺



    management:
      endpoints:
        web:
          exposure:
            include: 'routes'





- ͨ������http://localhost:8801/actuator/routesopen in new window�鿴��·����Ϣ��



- ͨ������http://localhost:8801/actuator/routes/detailsopen in new window�鿴��ϸ·����Ϣ��



# ������

·���������Zuul��������Ĺ��ܣ�·�ɹ��ܸ����ⲿ����ת��������ķ���ʵ����ȥ����ʵ��ͳһ������ڵĻ��������˹��ܸ����������̽��ж���Ĵ���������У����˼�����ۺϵĻ�����

# ����������

Zuul�������¼��ֵ��͵Ĺ��������͡�

- pre��������·�ɵ�Ŀ�����ǰִ�У�����Ȩ��У�顢��ӡ��־�ȹ��ܣ�
- routing��������·�ɵ�Ŀ�����ʱִ�У�����ʹ��Apache HttpClient��Netflix Ribbon�����ͷ���ԭʼHTTP����ĵط���
- post��������·�ɵ�Ŀ������ִ�У������Ŀ��������Ӧ���ͷ��Ϣ���ռ�ͳ�����ݵȹ��ܣ�
- error�������������׶η�������ʱִ�С�

# ����������������

��ͼ������һ��HTTP���󵽴�API���غ�����ڸ��ֲ�ͬ���͵Ĺ���������ת�Ĺ��̡�



# �Զ��������

�����������Զ���һ������������ʾ�¹����������á�

# ���PreLogFilter��̳�ZuulFilter

����һ��ǰ�ù�����������������·�ɵ�Ŀ�����ǰ��ӡ������־��



    /**
     * Created by macro on 2019/9/9.
     */
    @Component
    public class PreLogFilter extends ZuulFilter {
        private Logger LOGGER = LoggerFactory.getLogger(this.getClass());
    
        /**
         * ���������ͣ���pre��routing��post��error���֡�
         */
        @Override
        public String filterType() {
            return "pre";
        }
    
        /**
         * ������ִ��˳����ֵԽС���ȼ�Խ�ߡ�
         */
        @Override
        public int filterOrder() {
            return 1;
        }
    
        /**
         * �Ƿ���й��ˣ�����true��ִ�й��ˡ�
         */
        @Override
        public boolean shouldFilter() {
            return true;
        }
    
        /**
         * �Զ���Ĺ������߼�����shouldFilter()����trueʱ��ִ�С�
         */
        @Override
        public Object run() throws ZuulException {
            RequestContext requestContext = RequestContext.getCurrentContext();
            HttpServletRequest request = requestContext.getRequest();
            String host = request.getRemoteHost();
            String method = request.getMethod();
            String uri = request.getRequestURI();
            LOGGER.info("Remote host:{},method:{},uri:{}", host, method, uri);
            return null;
        }
    }



# ������������ʾ

��ӹ����������Ƿ���http://localhost:8801/user-service/user/1open in new window�����£����ӡ������־��



    2019-10-05 15:13:10.232  INFO 11040 --- [nio-8801-exec-7] com.macro.cloud.filter.PreLogFilter      : Remote host:0:0:0:0:0:0:0:1,method:GET,uri:/user-service/user/1






# ���Ĺ�����

    ����������                  	�������� 	���ȼ� 	������������                                  
    ServletDetectionFilter 	pre  	-3  	��⵱ǰ������ͨ��DispatcherServlet�������еĻ���ZuulServlet���д���ġ�
    Servlet30WrapperFilter 	pre  	-2  	��ԭʼ��HttpServletRequest���а�װ��             
    FormBodyWrapperFilter  	pre  	-1  	��Content-TypeΪapplication/x-www-form-urlencoded��multipart/form-data�������װ��FormBodyRequestWrapper����
    DebugFilter            	route	1   	����zuul.debug.request�������������Ƿ��ӡdebug��־��  
    PreDecorationFilter    	route	5   	�Ե�ǰ�������Ԥ�����Ա�ִ�к���������                     
    RibbonRoutingFilter    	route	10  	ͨ��Ribbon��Hystrix�������ʵ���������󣬲������������з��ء�  
    SimpleHostRoutingFilter	route	100 	ֻ����������������routeHost�����Ľ��д���ֱ��ʹ��HttpClient��routeHost��Ӧ�������ַ����ת����
    SendForwardFilter      	route	500 	ֻ����������������forward.to�����Ľ��д������б�����ת��      
    SendErrorFilter        	post 	0   	�������������ڲ������쳣ʱ�Ļ����������д�������������Ӧ��          
    SendResponseFilter     	post 	1000	�������������ĵ���Ӧ��Ϣ����֯����ɹ�����Ӧ���ݡ�

# ���ù�����

- ���ǿ��ԶԹ��������н��õ����ã����ø�ʽ���£�



    zuul:
      filterClassName:
        filter:
          disable: true 



- �����ǽ���PreLogFilter��ʾ�����ã�



    zuul:
      PreLogFilter:
        pre:
          disable: true 



#Ribbon��Hystrix��֧��

����Zuul�Զ�������Ribbon��Hystrix������Zuul�������и��ؾ���ͷ����ݴ����������ǿ���ͨ��Ribbon��Hystrix������������Zuul�е���Ӧ���ܡ�

- ����ʹ��Hystrix������������·��ת��ʱHystrixCommand��ִ�г�ʱʱ�䣺



    hystrix:
      command: #���ڿ���HystrixCommand����Ϊ
        default:
          execution:
            isolation:
              thread:
                timeoutInMilliseconds: 1000 #����HystrixCommandִ�еĳ�ʱʱ�䣬ִ�г�����ʱ�����з��񽵼�����


- ����ʹ��Ribbon������������·��ת��ʱ�������Ӽ�����ĳ�ʱʱ�䣺



    ribbon: #ȫ������
      ConnectTimeout: 1000 #�����������ӳ�ʱʱ�䣨���룩
      ReadTimeout: 3000 #����������ʱʱ�䣨���룩


#��������



    zuul:
      routes: #����������·��
        user-service:
          path: /userService/**
        feign-service:
          path: /feignService/**
      ignored-services: user-service,feign-service #�ر�Ĭ��·������
      prefix: /proxy #������·�����ǰ׺
      sensitive-headers: Cookie,Set-Cookie,Authorization #���ù������е�����ͷ��Ϣ������Ϊ�վͲ������
      add-host-header: true #����Ϊtrue�ض����ǻ����host����ͷ
      retryable: true # �ر����Ի���
      PreLogFilter:
        pre:
          disable: false #�����Ƿ����ù�����


#ʹ�õ���ģ��



    springcloud-learning
    ������ eureka-server -- eurekaע������
    ������ user-service -- �ṩUser����CRUD�ӿڵķ���
    ������ feign-service -- feign������ò��Է���
    ������ zuul-proxy -- zuul��Ϊ���صĲ��Է���


#��ĿԴ���ַ

https://github.com/macrozheng/springcloud-learning
# �ο�����
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud