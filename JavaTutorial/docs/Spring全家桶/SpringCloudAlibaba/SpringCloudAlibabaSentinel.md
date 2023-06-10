## ժҪ

Spring Cloud Alibaba �������ṩ΢���񿪷���һվʽ���������Sentinel ��Ϊ��������֮һ�������۶���������һϵ�з��񱣻����ܣ����Ľ������÷�������ϸ���ܡ�

## Sentinel���

����΢��������У�����ͷ���֮����ȶ��Ա��Խ��Խ��Ҫ�� Sentinel ������Ϊ����㣬���������ơ��۶Ͻ�����ϵͳ���ر����ȶ��ά�ȱ���������ȶ��ԡ�

Sentinel������������:

*   �ḻ��Ӧ�ó������н��˰���Ͱͽ� 10 ���˫ʮһ��������ĺ��ĳ�����������ɱ������ʵʱ�۶����β�����Ӧ�ã�
*   �걸��ʵʱ��أ�ͬʱ�ṩʵʱ�ļ�ع��ܡ������ڿ���̨�п�������Ӧ�õĵ�̨�����뼶���ݣ����� 500 ̨���¹�ģ�ļ�Ⱥ�Ļ������������
*   �㷺�Ŀ�Դ��̬���ṩ���伴�õ���������Դ���/�������ģ�飬������ Spring Cloud��Dubbo��gRPC �����ϣ�
*   ���Ƶ� SPI ��չ�㣺�ṩ�����á����Ƶ� SPI ��չ�㡣������ͨ��ʵ����չ�㣬���ٵĶ����߼���

## ��װSentinel����̨

> Sentinel����̨��һ���������Ŀ���̨Ӧ�ã���������ʵʱ�鿴������Դ��ؼ���Ⱥ��Դ���ܣ����ṩ��һϵ�еĹ�������ܣ������ع��򡢽��������ȵ����ȡ�

*   �����ȴӹ�������Sentinel���������ص���`sentinel-dashboard-1.6.3.jar`�ļ������ص�ַ��[github.com/alibaba/Sen��](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Falibaba%2FSentinel%2Freleases "https://github.com/alibaba/Sentinel/releases")

*   ������ɺ�������������������������Sentinel����̨��

```
java -jar sentinel-dashboard-1.6.3.jar
���ƴ���
```

*   Sentinel����̨Ĭ��������8080�˿��ϣ���¼�˺������Ϊ`sentinel`��ͨ�����µ�ַ���Խ��з��ʣ�[http://localhost:8080](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080 "http://localhost:8080")

![image-20230423173003900](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230423173003900.png)






*   Sentinel����̨���Բ鿴��̨������ʵʱ������ݡ�

![image-20230423173019956](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230423173019956.png)






## ����sentinel-serviceģ��

> �������Ǵ���һ��sentinel-serviceģ�飬������ʾSentinel���۶����������ܡ�

*   ��pom.xml����������������������ʹ��Nacos��Ϊע�����ģ�������Ҫͬʱ���Nacos��������

```
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    spring-cloud-starter-alibaba-nacos-discovery
</dependency>
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    spring-cloud-starter-alibaba-sentinel
</dependency>
���ƴ���
```

*   ��application.yml�����������ã���Ҫ��������Nacos��Sentinel����̨�ĵ�ַ��

```
server:
  port: 8401
spring:
  application:
    name: sentinel-service
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848 #����Nacos��ַ
    sentinel:
      transport:
        dashboard: localhost:8080 #����sentinel dashboard��ַ
        port: 8719
service-url:
  user-service: http://nacos-user-service
management:
  endpoints:
    web:
      exposure:
        include: '*'
���ƴ���
```

## ��������

> Sentinel Starter Ĭ��Ϊ���е� HTTP �����ṩ��������㣬����Ҳ����ͨ��ʹ��@SentinelResource���Զ���һЩ������Ϊ��

### ����RateLimitController��

> ���ڲ����۶Ϻ��������ܡ�

```
/**
 * ��������
 * Created by macro on 2019/11/7.
 */
@RestController
@RequestMapping("/rateLimit")
public class RateLimitController {

    /**
     * ����Դ������������Ҫָ�����������߼�
     */
    @GetMapping("/byResource")
    @SentinelResource(value = "byResource",blockHandler = "handleException")
    public CommonResult byResource() {
        return new CommonResult("����Դ��������", 200);
    }

    /**
     * ��URL��������Ĭ�ϵ����������߼�
     */
    @GetMapping("/byUrl")
    @SentinelResource(value = "byUrl",blockHandler = "handleException")
    public CommonResult byUrl() {
        return new CommonResult("��url����", 200);
    }

    public CommonResult handleException(BlockException exception){
        return new CommonResult(exception.getClass().getCanonicalName(),200);
    }

}
���ƴ���
```

### ������Դ��������

> ���ǿ��Ը���@SentinelResourceע���ж����value����Դ���ƣ�����������������������Ҫָ�����������߼���

*   ���ع��������Sentinel����̨�������ã���������ʹ����Nacosע�����ģ�����������Nacos��sentinel-service��

*   ����Sentinel���õ������ع�����Ҫ�����ȷ����½ӿڣ�Sentinel����̨�вŻ��ж�Ӧ������Ϣ�������ȷ����¸ýӿڣ�[http://localhost:8401/rateLimit/byResource](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8401%2FrateLimit%2FbyResource "http://localhost:8401/rateLimit/byResource")

*   ��Sentinel����̨�������ع��򣬸���@SentinelResourceע���valueֵ��

![image-20230423173034164](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230423173034164.png)






*   ���ٷ�������Ľӿڣ����Է��ַ������Լ����������������Ϣ��

![image-20230423173044930](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230423173044930.png)






### ����URL����

> ���ǻ�����ͨ�����ʵ�URL���������᷵��Ĭ�ϵ�����������Ϣ��

*   ��Sentinel����̨�������ع���ʹ�÷��ʵ�URL��

![image-20230423173055243](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230423173055243.png)






*   ��η��ʸýӿڣ��᷵��Ĭ�ϵ�������������[http://localhost:8401/rateLimit/byUrl](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8401%2FrateLimit%2FbyUrl "http://localhost:8401/rateLimit/byUrl")

![image-20230423173105426](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230423173105426.png)






### �Զ������������߼�

> ���ǿ����Զ���ͨ�õ����������߼���Ȼ����@SentinelResource��ָ����

*   ����CustomBlockHandler�������Զ������������߼���

```
/**
 * Created by macro on 2019/11/7.
 */
public class CustomBlockHandler {

    public CommonResult handleException(BlockException exception){
        return new CommonResult("�Զ���������Ϣ",200);
    }
}
���ƴ���
```

*   ��RateLimitController��ʹ���Զ������������߼���

```
/**
 * ��������
 * Created by macro on 2019/11/7.
 */
@RestController
@RequestMapping("/rateLimit")
public class RateLimitController {

    /**
     * �Զ���ͨ�õ����������߼�
     */
    @GetMapping("/customBlockHandler")
    @SentinelResource(value = "customBlockHandler", blockHandler = "handleException",blockHandlerClass = CustomBlockHandler.class)
    public CommonResult blockHandler() {
        return new CommonResult("�����ɹ�", 200);
    }

}
���ƴ���
```

## �۶Ϲ���

> Sentinel ֧�ֶԷ������ý��б������Թ���Ӧ�ý����۶ϲ�������������ʹ��RestTemplate������nacos-user-service�������ṩ�Ľӿ�����ʾ�¸ù��ܡ�

*   ����������Ҫʹ��@SentinelRestTemplate����װ��RestTemplateʵ����

```
/**
 * Created by macro on 2019/8/29.
 */
@Configuration
public class RibbonConfig {

    @Bean
    @SentinelRestTemplate
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }
}
���ƴ���
```

*   ���CircleBreakerController�࣬�����nacos-user-service�ṩ�ӿڵĵ��ã�

```
/**
 * �۶Ϲ���
 * Created by macro on 2019/11/7.
 */
@RestController
@RequestMapping("/breaker")
public class CircleBreakerController {

    private Logger LOGGER = LoggerFactory.getLogger(CircleBreakerController.class);
    @Autowired
    private RestTemplate restTemplate;
    @Value("${service-url.user-service}")
    private String userServiceUrl;

    @RequestMapping("/fallback/{id}")
    @SentinelResource(value = "fallback",fallback = "handleFallback")
    public CommonResult fallback(@PathVariable Long id) {
        return restTemplate.getForObject(userServiceUrl + "/user/{1}", CommonResult.class, id);
    }

    @RequestMapping("/fallbackException/{id}")
    @SentinelResource(value = "fallbackException",fallback = "handleFallback2", exceptionsToIgnore = {NullPointerException.class})
    public CommonResult fallbackException(@PathVariable Long id) {
        if (id == 1) {
            throw new IndexOutOfBoundsException();
        } else if (id == 2) {
            throw new NullPointerException();
        }
        return restTemplate.getForObject(userServiceUrl + "/user/{1}", CommonResult.class, id);
    }

    public CommonResult handleFallback(Long id) {
        User defaultUser = new User(-1L, "defaultUser", "123456");
        return new CommonResult<>(defaultUser,"���񽵼�����",200);
    }

    public CommonResult handleFallback2(@PathVariable Long id, Throwable e) {
        LOGGER.error("handleFallback2 id:{},throwable class:{}", id, e.getClass());
        User defaultUser = new User(-2L, "defaultUser2", "123456");
        return new CommonResult<>(defaultUser,"���񽵼�����",200);
    }
}
���ƴ���
```

*   ����nacos-user-service��sentinel-service����

*   �������ǲ�û����nacos-user-service�ж���idΪ4���û������з������½ӿڻ᷵�ط��񽵼������[http://localhost:8401/breaker/fallback/4](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8401%2Fbreaker%2Ffallback%2F4 "http://localhost:8401/breaker/fallback/4")

```
{
	"data": {
		"id": -1,
		"username": "defaultUser",
		"password": "123456"
	},
	"message": "���񽵼�����",
	"code": 200
}
���ƴ���
```

*   ��������ʹ����exceptionsToIgnore����������NullPointerException���������Ƿ��ʽӿڱ���ָ��ʱ���ᷢ�����񽵼���[http://localhost:8401/breaker/fallbackException/2](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8401%2Fbreaker%2FfallbackException%2F2 "http://localhost:8401/breaker/fallbackException/2")

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/18/16e7eb0fb3df7c01~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.awebp)






## ��Feign���ʹ��

> SentinelҲ������Feign���������ʹ��Feign�����з�������ʱ��Ҳ����ʹ�����������۶ϡ�

*   ����������Ҫ��pom.xml�����Feign���������

```
<dependency>
    <groupId>org.springframework.cloud</groupId>
    spring-cloud-starter-openfeign
</dependency>
���ƴ���
```

*   ��application.yml�д�Sentinel��Feign��֧�֣�

```
feign:
  sentinel:
    enabled: true #��sentinel��feign��֧��
���ƴ���
```

*   ��Ӧ�������������@EnableFeignClients����Feign�Ĺ��ܣ�

*   ����һ��UserService�ӿڣ����ڶ����nacos-user-service����ĵ��ã�

```
/**
 * Created by macro on 2019/9/5.
 */
@FeignClient(value = "nacos-user-service",fallback = UserFallbackService.class)
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
���ƴ���
```

*   ����UserFallbackService��ʵ��UserService�ӿڣ����ڴ�����񽵼��߼���

```
/**
 * Created by macro on 2019/9/5.
 */
@Component
public class UserFallbackService implements UserService {
    @Override
    public CommonResult create(User user) {
        User defaultUser = new User(-1L, "defaultUser", "123456");
        return new CommonResult<>(defaultUser,"���񽵼�����",200);
    }

    @Override
    public CommonResult<User> getUser(Long id) {
        User defaultUser = new User(-1L, "defaultUser", "123456");
        return new CommonResult<>(defaultUser,"���񽵼�����",200);
    }

    @Override
    public CommonResult<User> getByUsername(String username) {
        User defaultUser = new User(-1L, "defaultUser", "123456");
        return new CommonResult<>(defaultUser,"���񽵼�����",200);
    }

    @Override
    public CommonResult update(User user) {
        return new CommonResult("����ʧ�ܣ����񱻽���",500);
    }

    @Override
    public CommonResult delete(Long id) {
        return new CommonResult("����ʧ�ܣ����񱻽���",500);
    }
}
���ƴ���
```

*   ��UserFeignController��ʹ��UserServiceͨ��Feign����nacos-user-service�����еĽӿڣ�

```
/**
 * Created by macro on 2019/8/29.
 */
@RestController
@RequestMapping("/user")
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
���ƴ���
```

*   �������½ӿڻᷢ�����񽵼������ط��񽵼�������Ϣ��[http://localhost:8401/user/4](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8401%2Fuser%2F4 "http://localhost:8401/user/4")

```
{
	"data": {
		"id": -1,
		"username": "defaultUser",
		"password": "123456"
	},
	"message": "���񽵼�����",
	"code": 200
}
���ƴ���
```

## ʹ��Nacos�洢����

> Ĭ������£���������Sentinel����̨�����ù���ʱ������̨���͹���ʽ��ͨ��API�������������ͻ��˲�ֱ�Ӹ��µ��ڴ��С�һ����������Ӧ�ã�������ʧ���������ǽ�������ν����ù�����г־û����Դ洢��NacosΪ����

### ԭ��ʾ��ͼ

![image-20230423173120010](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230423173120010.png)






*   ��������ֱ�����������Ĵ��������������Ľ��������͵��ͻ��ˣ�

*   Sentinel����̨Ҳ����������ȥ��ȡ������Ϣ��

### ������ʾ

*   ����pom.xml��������������

```
<dependency>
    <groupId>com.alibaba.csp</groupId>
    sentinel-datasource-nacos
</dependency>
���ƴ���
```

*   �޸�application.yml�����ļ������Nacos����Դ���ã�

```
spring:
  cloud:
    sentinel:
      datasource:
        ds1:
          nacos:
            server-addr: localhost:8848
            dataId: ${spring.application.name}-sentinel
            groupId: DEFAULT_GROUP
            data-type: json
            rule-type: flow
���ƴ���
```

*   ��Nacos��������ã�

![image-20230423173137516](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230423173137516.png)






*   ���������Ϣ���£�

```
[
    {
        "resource": "/rateLimit/byUrl",
        "limitApp": "default",
        "grade": 1,
        "count": 1,
        "strategy": 0,
        "controlBehavior": 0,
        "clusterMode": false
    }
]
���ƴ���
```

*   ��ز������ͣ�

    *   resource����Դ���ƣ�
    *   limitApp����ԴӦ�ã�
    *   grade����ֵ���ͣ�0��ʾ�߳�����1��ʾQPS��
    *   count��������ֵ��
    *   strategy������ģʽ��0��ʾֱ�ӣ�1��ʾ������2��ʾ��·��
    *   controlBehavior������Ч����0��ʾ����ʧ�ܣ�1��ʾWarm Up��2��ʾ�Ŷӵȴ���
    *   clusterMode���Ƿ�Ⱥ��
*   ����Sentinel����̨�Ѿ�����������������

![image-20230423173152487](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230423173152487.png)






*   ���ٷ��ʲ��Խӿڣ����Է��ַ���������������Ϣ��

![image-20230423173203461](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230423173203461.png)






## �ο�����

Spring Cloud Alibaba �ٷ��ĵ���[github.com/alibaba/spr��](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Falibaba%2Fspring-cloud-alibaba%2Fwiki "https://github.com/alibaba/spring-cloud-alibaba/wiki")

## ʹ�õ���ģ��

```
springcloud-learning
������ nacos-user-service -- ע�ᵽnacos���ṩUser����CRUD�ӿڵķ���
������ sentinel-service -- sentinel���ܲ��Է���
���ƴ���
```

## ��ĿԴ���ַ

[github.com/macrozheng/��](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmacrozheng%2Fspringcloud-learning "https://github.com/macrozheng/springcloud-learning")



���ߣ�MacroZheng
���ӣ�https://juejin.cn/post/6844903999876022279
��Դ��ϡ�����
����Ȩ���������С���ҵת������ϵ���߻����Ȩ������ҵת����ע��������

# �ο�����
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud