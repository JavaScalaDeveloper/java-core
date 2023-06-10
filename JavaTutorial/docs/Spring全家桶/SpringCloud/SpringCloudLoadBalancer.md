ǰ���ã��Ұ�Mall΢����汾ȫ�������� ����ͨ��Gateway���ص������������ʱ�򣬳�����Service Unavailable�����⡣�Ų�ԭ��ʱ������Ϊ���ؾ��������Ribbon�������ˣ���ΪNetflix��Դ��һ�������Ribbon���ѽ���ά��״̬�������Ƽ�ʹ�õ���Loadbalancer���������Ǿ�������Loadbalancer��ʹ�ã�

# LoadBalancer���

LoadBalancer��Spring Cloud�ٷ��ṩ�ĸ��ؾ�����������������Ribbon����ʹ�÷�ʽ��Ribbon�������ݣ����Դ�Ribbon����ƽ�����ɡ�

# ʹ��

���������LoadBalancer�Ļ���ʹ�ã����ǽ�ʹ��Nacos��Ϊע�����ģ�ͨ��nacos-loadbalancer-service��nacos-user-service�����������໥������������ʾ��

# ���ؾ���

���ǽ�ʹ��RestTemplate����ʾ��LoadBalancer�ĸ��ؾ��⹦�ܡ�

- ������nacos-loadbalancer-serviceģ���pom.xml�ļ������LoadBalancer���������



    <dependency>
        <groupId>org.springframework.cloud</groupId>
        spring-cloud-starter-loadbalancer
    </dependency>





- Ȼ�󴴽�Java�����࣬��������RestTemplate��ͬʱʹ��@LoadBalancedע�⸳���为�ؾ���������



    /**
     * RestTemplate�������
     * Created by macro on 2019/8/29.
     */
    @Configuration
    public class RestTemplateConfig {
    
        @Bean
        @ConfigurationProperties(prefix = "rest.template.config")
        public HttpComponentsClientHttpRequestFactory customHttpRequestFactory() {
            return new HttpComponentsClientHttpRequestFactory();
        }
    
        @Bean
        @LoadBalanced
        public RestTemplate restTemplate() {
            return new RestTemplate(customHttpRequestFactory());
        }
    }





- ��application.yml�п���ʹ���Զ������ö�RestTemplate�ĵ��ó�ʱ�������ã�



    rest:
      template:
        config: # RestTemplate���ó�ʱ����
          connectTimeout: 5000
          readTimeout: 5000




- Ȼ����Controller��ʹ��RestTemplate����Զ�̵��ã�



    /**
     * Created by macro on 2019/8/29.
     */
    @RestController
    @RequestMapping("/user")
    public class UserLoadBalancerController {
        @Autowired
        private RestTemplate restTemplate;
        @Value("${service-url.nacos-user-service}")
        private String userServiceUrl;
    
        @GetMapping("/{id}")
        public CommonResult getUser(@PathVariable Long id) {
            return restTemplate.getForObject(userServiceUrl + "/user/{1}", CommonResult.class, id);
        }
    
        @GetMapping("/getByUsername")
        public CommonResult getByUsername(@RequestParam String username) {
            return restTemplate.getForObject(userServiceUrl + "/user/getByUsername?username={1}", CommonResult.class, username);
        }
    
        @GetMapping("/getEntityByUsername")
        public CommonResult getEntityByUsername(@RequestParam String username) {
            ResponseEntity<CommonResult> entity = restTemplate.getForEntity(userServiceUrl + "/user/getByUsername?username={1}", CommonResult.class, username);
            if (entity.getStatusCode().is2xxSuccessful()) {
                return entity.getBody();
            } else {
                return new CommonResult("����ʧ��", 500);
            }
        }
    
        @PostMapping("/create")
        public CommonResult create(@RequestBody User user) {
            return restTemplate.postForObject(userServiceUrl + "/user/create", user, CommonResult.class);
        }
    
        @PostMapping("/update")
        public CommonResult update(@RequestBody User user) {
            return restTemplate.postForObject(userServiceUrl + "/user/update", user, CommonResult.class);
        }
    
        @PostMapping("/delete/{id}")
        public CommonResult delete(@PathVariable Long id) {
            return restTemplate.postForObject(userServiceUrl + "/user/delete/{1}", null, CommonResult.class, id);
        }
    }




- ��nacos-user-service�������Ѿ�ʵ������Щ�ӿڣ������ṩ��nacos-loadbalancer-service�������Զ�̵��ã�



- Ȼ������һ��nacos-loadbalancer-service��������nacos-user-service����ʱNacos�л���ʾ���·���



- ��ʱͨ��nacos-loadbalancer-service���ýӿڽ��в��ԣ��ᷢ������nacos-user-service�����ӡ��־��Ϣ��ʹ�õ�����ѯ���ԣ����ʵ�ַ��http://localhost:8308/user/1



# ����ʽ�������

��ȻLoadBalancer����ʹ��RestTemplate������Զ�̵��ã�������ʹ��OpenFeign����������ʽ������ã��������Ǿ��������¡�

- ����nacos-loadbalancer-serviceģ���pom.xml�ļ������OpenFeign�����������



    <dependency>
        <groupId>org.springframework.cloud</groupId>
        spring-cloud-starter-openfeign
    </dependency>





- Ȼ����OpenFeign�Ŀͻ��˽ӿ�����������Ҫ���õķ���ӿ��Լ����÷�ʽ��



    /**
     * Created by macro on 2019/9/5.
     */
    @FeignClient(value = "nacos-user-service")
    public interface UserService {
        @PostMapping("/user/create")
        CommonResult create(@RequestBody User user);
    
        @GetMapping("/user/{id}")
        CommonResult<User> getUser(@PathVariable Long id);
    
        @GetMapping("/user/getByUsername")
        CommonResult<User> getByUsername(@RequestParam String username);
    
        @PostMapping("/user/update")
        CommonResult update(@RequestBody User user);
    
        @PostMapping("/user/delete/{id}")
        CommonResult delete(@PathVariable Long id);
    }



- ����Controller��ʹ��OpenFeign�Ŀͻ��˽ӿ�������Զ�̷���



    /**
     * Created by macro on 2019/8/29.
     */
    @RestController
    @RequestMapping("/userFeign")
    public class UserFeignController {
        @Autowired
        private UserService userService;
    
        @GetMapping("/{id}")
        public CommonResult getUser(@PathVariable Long id) {
            return userService.getUser(id);
        }
    
        @GetMapping("/getByUsername")
        public CommonResult getByUsername(@RequestParam String username) {
            return userService.getByUsername(username);
        }
    
        @PostMapping("/create")
        public CommonResult create(@RequestBody User user) {
            return userService.create(user);
        }
    
        @PostMapping("/update")
        public CommonResult update(@RequestBody User user) {
            return userService.update(user);
        }
    
        @PostMapping("/delete/{id}")
        public CommonResult delete(@PathVariable Long id) {
            return userService.delete(id);
        }
    }





- �������������OpenFeign�ĳ�ʱ���õĻ���������application.yml������������ݣ�



    feign:
      client:
        config:
          default: # Feign���ó�ʱ����
            connectTimeout: 5000
            readTimeout: 5000



- ������ͨ�����Խӿڵ���Զ�̷��񣬷��ֿ����������ã����ʵ�ַ��http://localhost:8308/userFeign/1



# ����ʵ������

LoadBalancerΪ��������ܣ�������ÿ������ʱȥ��ȡʵ���б����ǽ�����ʵ���б�����˱��ػ��档

Ĭ�ϵĻ���ʱ��Ϊ35s��Ϊ�˼��ٷ��񲻿��û��ᱻѡ��Ŀ����ԣ����ǿ��Խ����������á�



    spring:
      cloud:
        loadbalancer:
          cache: # ���ؾ��⻺������
            enabled: true # ��������
            ttl: 5s # ���û���ʱ��
            capacity: 256 # ���û����С




# HTTP����ת��

���������ÿ��Զ�̵����д����Զ��������ͷ�Ļ�����������LoadBalancerRequestTransformer��ͨ�������Զ�ԭʼ�������һ����ת����

- ����������Ҫ���ú�LoadBalancerRequestTransformer��Beanʵ�����������ǽ�ServiceInstance��instanceId���뵽����ͷX-InstanceId�У�



    /**
     * LoadBalancer�������
     * Created by macro on 2022/7/26.
     */
    @Configuration
    public class LoadBalancerConfig {
        @Bean
        public LoadBalancerRequestTransformer transformer() {
            return new LoadBalancerRequestTransformer() {
                @Override
                public HttpRequest transformRequest(HttpRequest request, ServiceInstance instance) {
                    return new HttpRequestWrapper(request) {
                        @Override
                        public HttpHeaders getHeaders() {
                            HttpHeaders headers = new HttpHeaders();
                            headers.putAll(super.getHeaders());
                            headers.add("X-InstanceId", instance.getInstanceId());
                            return headers;
                        }
                    };
                }
            };
        }
    }





- Ȼ���޸�nacos-user-service�еĴ��룬��ӡ��ȡ��������ͷX-InstanceId����Ϣ��



    /**
     * Created by macro on 2019/8/29.
     */
    @RestController
    @RequestMapping("/user")
    public class UserController {
        @GetMapping("/{id}")
        public CommonResult<User> getUser(@PathVariable Long id) {
            User user = userService.getUser(id);
            LOGGER.info("����id��ȡ�û���Ϣ���û�����Ϊ��{}", user.getUsername());
            ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            HttpServletRequest request = servletRequestAttributes.getRequest();
            String instanceId = request.getHeader("X-InstanceId");
            if (StrUtil.isNotEmpty(instanceId)) {
                LOGGER.info("��ȡ���Զ�������ͷ:X-InstanceId={}", instanceId);
            }
            return new CommonResult<>(user);
        }
    }

- ���������ʽӿڽ��в��ԣ�nacos-user-service����̨����ӡ������־�������Զ�������ͷ�Ѿ��ɹ������ˣ����ʵ�ַ��http://localhost:8308/user/1



    2022-07-26 15:05:19.920  INFO 14344 --- [nio-8206-exec-5] c.macro.cloud.controller.UserController  : ����id��ȡ�û���Ϣ���û�����Ϊ��macro
    2022-07-26 15:05:19.921  INFO 14344 --- [nio-8206-exec-5] c.macro.cloud.controller.UserController  : ��ȡ���Զ�������ͷ:X-InstanceId=192.168.3.227#8206#DEFAULT#DEFAULT_GROUP@@nacos-user-service



# �ܽ�

����ͨ����LoadBalancer��һ��ʵ�����ǿ��Է��֣�ʹ��LoadBalancer��Ribbon��������ʵ��������Ҫ��һЩ���÷�ʽ����ͬ�������֮ǰʹ�ù�Ribbon�Ļ��������Ͽ����޷��л���LoadBalancer��

# �ο�����

�ٷ��ĵ���https://docs.spring.io/spring-cloud-commons/docs/current/reference/html/#spring-cloud-loadbalancer

# ��ĿԴ���ַ

https://github.com/macrozheng/springcloud-learning/tree/master/nacos-loadbalancer-service

# �ο�����
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud
https://github.com/macrozheng/springcloud-learning