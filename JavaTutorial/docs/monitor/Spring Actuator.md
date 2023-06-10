## ǰ��

��΢����ϵͳ�ܹ��У�����ļ���Ǳز����ٵġ�Ŀǰ�����΢����Ӧ�����ǻ���Spring Cloudϵ�У�Ҳ����˵�ǻ���Spring Bootϵ�еġ���ʱʹ��Spring Boot Actuator������΢����ļ�أ���������ȫ�棬���ҷǳ����㡣

����ƪ���¡�[Spring Boot Actuator���ɣ��ѵ���������ã�](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FBaNQWygQb8UXxktrXetOcw "https://mp.weixin.qq.com/s/BaNQWygQb8UXxktrXetOcw")���������Ѿ���������ν�Actuator���ɵ�Spring Boot��Ŀ�У����ҽ���������Զ���Endpoint���˵㣩������������˵�������룬��ô����ƪ�����أ����ǽ�����Actuatorԭ���˵�Ĺ��ܼ�����ʹ�ó�����

## Endpoints ����

Actuator����ν�� Endpoints ������Ϊ�˵㣩�ṩ���ⲿ����Ӧ�ó�����з��ʺͽ����Ĺ��ܡ� ����˵/health�˵��ṩ��Ӧ�ý����������Ϣ��metrics �˵��ṩ��Ӧ�ó����ָ�꣨JVM �ڴ�ʹ�á�ϵͳCPUʹ�õȣ���Ϣ��

Actuatorԭ���Ķ˵�ɷ�Ϊ�����ࣺ

*   Ӧ�������ࣺ��ȡӦ�ó����м��ص�Ӧ�����á������������Զ������ñ������Spring BootӦ��������ص���������Ϣ��
*   ����ָ���ࣺ��ȡӦ�ó������й��������ڼ�صĶ���ָ�꣬���磺�ڴ���Ϣ���̳߳���Ϣ��HTTP����ͳ�Ƶȡ�
*   ���������ࣺ�ṩ�˶�Ӧ�õĹرյȲ����๦�ܡ�

��ͬ�汾��Actuator�ṩ��ԭ���˵��������룬��ʹ�õĹ������������ʹ�ð汾�Ĺٷ��ĵ�Ϊ׼��ͬʱ��ÿ��ԭ���Ķ˵㶼����ͨ�������������Ľ��û����á�

����Actuator 2.x ��Ĭ�϶˵�������/actuatorǰ׺��ͬʱĬ��ֻ��¶�������˵�Ϊ/actuator/health�� /actuator/info�����ڶ˵㱩¶�����ã��ɲο�ǰһƪ���¡��������Spring Boot 2.2.2.RELEASE�汾���ص㽲��ÿ���˵�Ĺ��ܺ�Ӧ�ó�����

## actuator�˵�

Actuator 2.x������Ĭ�϶˵㣬����չʾĿǰӦ���б�¶�����Ķ˵���ܣ���������Ϊ���ö˵��Ŀ¼��

����URL��[http://localhost:8080/actuator](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2Factuator "http://localhost:8080/actuator") ����Ӧչʾ�������ͼ��

![image-20230530233537559](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230530233537559.png)

����ֻչʾ��һ���ֵĶ˵㣬���ؽ��Ϊ�����������������Ĳ��-Handler�����˸�ʽ������ͨ��actuator����ֱ�۵Ŀ���Ŀǰ��������Щ�˵㣬�Լ���Щ�˵�����ƺ�����·����

�������ǾͰ�����ʾactuator�˵�չʾ���б���һ���ܡ�

## auditevents�˵�

auditevents�˵�������ʾӦ�ñ�¶������¼� (������֤���롢����ʧ��)����ʹ���Ǵ������ж˵㣬Ĭ�������Ҳ�ǿ���������˵�ġ���Ϊʹ������ǰ������Ҫ��Spring�����д���һ������ΪAuditEventRepository��Bean�ġ�

�鿴�������ϴ�����̳̣������϶��ǽ�����auditevents�˵㹦�ܣ���δչʾ����ʵ�������߾����෽���ԣ����ڸ����д��һ������������

�����漰��Ȩ����֤����Ҫ������spring-boot-starter-security������

````
<dependency>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-starter-security</artifactId>
</dependency>` 
````

�����������������ǲ����ģ�����Ҫ����security�����ã���ȻAuthorizationAuditListener,AuthenticationAuditListener ����ʲô�¼���? ���,���Ǽ������´��룺


````
@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

 @Override
 protected void configure(AuthenticationManagerBuilder auth) throws Exception {

 auth.inMemoryAuthentication()
 .withUser("admin")
 .password(bcryptPasswordEncoder().encode("admin"))
 .roles("admin");
 }
````

````
 @Bean
 public PasswordEncoder bcryptPasswordEncoder() {
 return new BCryptPasswordEncoder();
 }
}
````

���������securityĬ�ϵĵ�¼�����Ȩ�޿��ƣ�Ҳ����˵���еķ��ʶ���Ҫ���е�¼������¼���û����������Ϊadmin��

���⣬ǰ���ᵽ��Ҫ�õ�AuditEventRepository��Bean�������ʼ��һ����Ӧ��Bean��




````
@Configuration
public class AuditEventConfig {

 @Bean
 public InMemoryAuditEventRepository repository(){
 return new InMemoryAuditEventRepository();
 }
}
````

InMemoryAuditEventRepository��AuditEventRepository�ӿڵ�Ψһʵ���ࡣ

������Ŀ��auditevents�˵������ˡ�����[http://localhost:8080/actuator](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2Factuator "http://localhost:8080/actuator") ,��ʱ����ת��Security�ṩ�ĵ�¼ҳ�棺

![image-20230530233604253](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230530233604253.png)

���������ָ�����û��������룬��¼�ɹ�����ת��/actuatorҳ�棺

![image-20230530233625068](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230530233625068.png)

���Կ���auditevents�˵��Ѿ��ɹ���ʾ�����ˡ��¿�ҳ�����[http://localhost:8080/actuator/auditevents](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2Factuator%2Fauditevents "http://localhost:8080/actuator/auditevents") ��չʾ�������£�

![image-20230530233716752](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230530233716752.png)

���Կ����Ѿ���¼����Ȩ����ص��¼������е�һ���¼�������ֱ�ӷ���actuator�˵�ʱ������֮ǰΪ��Ȩ�����棬�����¼�����Ϊ"AUTHORIZATION_FAILURE"��Ҳ������֤ʧ�ܡ���ʱ��ת����¼ҳ�棬Ȼ���ڵ�¼ҳ�������û��������룬��¼�ɹ�����Ӧ���¼�Ϊ"AUTHENTICATION_SUCCESS"��

Ҳ����˵auditevents��¼���û���֤��¼ϵͳ��ص��¼���Ϣ������ʱ�������֤�û����¼����͡����ʵ�ַ��sessionId�ȡ�

ʾ��Դ���ַ��[github.com/secbr/sprin��](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsecbr%2Fspringboot-all%2Ftree%2Fmaster%2Fspringboot-actuator-auditevents "https://github.com/secbr/springboot-all/tree/master/springboot-actuator-auditevents") ��

## beans�˵�

/beans�˵�᷵��Spring����������bean�ı��������͡��Ƿ�������������Ϣ��

����·��Ϊ[http://localhost:8080/actuator/beans](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2Factuator%2Fbeans "http://localhost:8080/actuator/beans") ����Χ������£�

![image-20230530233748286](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230530233748286.png)

����˵��չʾĿǰSpring�����г�ʼ��������Bean������һ�£������������һ��Bean������ȷ���Ƿ�ɹ�ʵ�������ǲ��ǾͿ���ͨ������˿ڲ�ѯһ���أ�

��������Ŀ�ж���һ��TestController����ע��һ��UserService��


````
@Controller
public class TestController {

 @Resource
 private UserService userService;
}
````

�������������ʸö˵㣬�ῴ��������Ϣ��

![image-20230530233805161](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230530233805161.png)

���Կ���TestController��ʵ�����ˣ�����������UserService��

## caches�˵�

caches�˵���Ҫ���ڱ�¶Ӧ�ó����еĻ��塣������Spring Boot�ṩ��Cache�����չʾһ��ʵ����

����Ŀ�м���spring-boot-starter-cache������������


````
<dependency>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
````

Ȼ���������������@EnableCaching���������湦�ܡ�

����һ��CacheController�����䷽��queryAllʹ�û�����ƣ�


````
@RestController
public class CacheController {

 @RequestMapping("/queryAll")
 @Cacheable(value = "queryAll")
 public Map<String, String> queryAll() {
 Map<String, String> map = new HashMap<>();
 map.put("1", "Tom");
 map.put("2", "Steven");
 return map;
 }
}
````

����ʹ��@Cacheableע����ʵ�ֻ��湦�ܣ������keyΪqueryAll����ʱ������[http://localhost:8080/actuator/caches](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2Factuator%2Fcaches "http://localhost:8080/actuator/caches") ����չʾ����ĸ����ݣ������沢û�л��档

����һ��[http://localhost:8080/queryAll](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2FqueryAll "http://localhost:8080/queryAll") ��Ҳ���Ǵ���һ�»������ݵ����ɡ���ʱ�ٷ�����������ӣ�����Կ���Ӧ�ó����еĻ�����Ϣ�ˣ�

![image-20230530233852486](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230530233852486.png)

���Կ��������ص����ݲ���չʾ��Ӧ�ó���Ļ����������ͬʱҲչʾ�˻����Key�ͻ������ݴ洢������Ϣ��

## caches-cache�˵�

caches-cache�˵��Ƕ�����caches�˵����չ��caches�˵�չʾ�����еĻ�����Ϣ�������ֱ�ӿ��������һ��������Ϣ�������ʹ��caches-cache�˵㡣

���ʵ�URLΪ��[http://localhost:8080/actuator/caches/{cache}](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2Factuator%2Fcaches%2F%257Bcache%257D "http://localhost:8080/actuator/caches/%7Bcache%7D") �����д������ڵ�ֵ�����滻Ϊ�����key��




`http://localhost:8080/actuator/caches/queryAll`

�������ռλ������queryAll�������key����ִ�н�����£�

![image-20230530233906164](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230530233906164.png)

���Կ�����ֻ��ѯ����ָ���Ļ�����Ϣ������������������������ƣ�key��������Ĵ洢���͡�

## health�˵�

health�˵��������Ӧ�õ�����״̬�����Ƶʹ�õ�һ���˵㡣���Ӧ��ʵ��������״̬�Լ�Ӧ�ò�����������ԭ�򣬱������ݿ����ӡ����̿ռ䲻���ȡ�

���ʵ�ַ��[http://localhost:8080/actuator/health](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2Factuator%2Fhealth "http://localhost:8080/actuator/health")

չʾ�����

`{
"status": "UP"
}`

�����ʵ�����ڼ򵥣�����Ŀ�а����ݿ�����ɽ�ȥ��

`<!--���ݿ��������-->

````
<dependency>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
<dependency>
 <groupId>mysql</groupId>
 <artifactId>mysql-connector-java</artifactId>
</dependency>` 
````

Ȼ����application�����ļ��н������ã�



```
spring:
 datasource:
 url: jdbc:mysql://xxx:3333/xxx?characterEncoding=utf8&serverTimezone=Asia/Shanghai
 username: root
 password: root
 driver-class-name: com.mysql.cj.jdbc.Driver
```

ͬʱ������Ҫ��application�����ļ�������һ��management.endpoint.health.show-details��ֵ����������������ѡ�

*   never ����չʾ��ϸ��Ϣ��up ���� down ��״̬��Ĭ�����ã�
*   when-authorized����ϸ��Ϣ����չʾ��ͨ����֤���û�����Ȩ�Ľ�ɫ����ͨ��management.endpoint.health.roles ���ã�
*   always���������û���¶��ϸ��Ϣ��

Ĭ��ֵ��never����������ֱ�ӷ��ʿ�����ֻ��UP��DOWN�����ڼ��������ݿ⣬ͬʱ�Ѹ���ֵ����Ϊalways����һ�����飺

![image-20230530233934501](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230530233934501.png)

���Կ�������״̬ΪUP��������������������ΪUP�������ݿ���MYSQL��������ݿ�����Ϊ��SELECT 1����ͬʱ����չʾ�˴�����Ϣ��ping��״̬��

�������ǰ����ݿ���û������������Ĵ��������ʿɵã�

![image-20230530233951145](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230530233951145.png)

״̬ΪDOWN�������db���������⣬״̬ΪDOWN�������������error��չʾ�����Կ����ǽ�������ʱ�����ˡ���ʵ���У����ǿ���ͨ��health�˿ڼ�����ݿ⡢Redis��MongoDB�����̵Ƚ��������ActuatorԤ����Ĵ�����Ϊ��DataSourceHealthIndicator, DiskSpaceHealthIndicator, MongoHealthIndicator, RedisHealthIndicator�ȡ�

����ÿ��ָ�궼���Ե����Ľ��п����͹رգ������ݿ��Ϊ����


````
management:
 health:
 db:
 enabled: true` 
````

## info�˵�

/info �˵������鿴�����ļ� application����info��ͷ��������Ϣ��Ĭ������� application�в�û�� info �ڵ����ã�����Ĭ��Ϊ�ա�

application������������ã�



````
info:
 user:
 type: ���ں�
 name: �������ӽ�
 wechat: zhuan2quan
````

����[http://localhost:8080/actuator/info](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2Factuator%2Finfo "http://localhost:8080/actuator/info") ��չʾ������£�

![image-20230530234019487](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230530234019487.png)

## conditions�˵�

Spring Boot�ṩ���Զ����ù��ܣ�ʹ�������ǳ����㡣����Щ�Զ���������ʲô�������Ч�ģ��Ƿ���Ч�ǱȽ����Ų�ġ���ʱ������ʹ�� conditions ��Ӧ������ʱ�鿴ĳ����������ʲô��������Ч����Ϊʲôû����Ч��

����URL��[http://localhost:8080/actuator/conditions](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2Factuator%2Fconditions "http://localhost:8080/actuator/conditions") �����ַ�����Ϣ���£�

![image-20230530234053134](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230530234053134.png)

���Կ���ĳ���Զ��������Ӧ����Ч��������ʾ��Ϣ��

## shutdown�˵�

shutdown�˵����ڲ���������˵㣬�������Źر� Spring Boot Ӧ�á���Ҫ�������ļ��п�����


````
management:
 endpoint:
 shutdown:
 enabled: true
````

�ö˵�ֻ֧��POST����ִ��������ؽ�����£�


```
curl -X POST "http://localhost:8080/actuator/shutdown" 
{
 "message": "Shutting down, bye..."
}
```

ִ��֮�󣬻ᷢ��Ӧ�ó����Ѿ����ر��ˡ����ڸö˵��ر�Ӧ�ó������ʹ������ҪС�ġ�

## configprops�˵�

��Spring Boot��Ŀ�У����Ǿ������õ�@ConfigurationPropertiesע��������ע��һЩ���ԣ���configprops�˵����������ʾ��Щ����ע���ע�������ࡣ

����ǰ���info���ã����ǾͿ��Զ���һ����InfoProperties��


````
@Component
@ConfigurationProperties(prefix = "info")
public class InfoProperties {

 private String type;

 private String name;

 private String wechat;
  
 // ʡ��getter/setter 
}
````

����URL��[http://localhost:8080/actuator/configprops](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2Factuator%2Fconfigprops "http://localhost:8080/actuator/configprops") ��������Ϣ���£�

![image-20230530234110515](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230530234110515.png)

�������Կ���ϵͳ��Ĭ�ϼ��ɵ���������Ϣ�������Կ��������Զ������������Ϣ��������Ҫע����Ƕ�Ӧ������Ҫ����ʵ������@Component��������ܹ�������

�����Զ�������з�����Bean�����ơ�����ǰ׺�������ProjectInfoProperties��������������Ϣ��

## env�˵�

env�˵����ڻ�ȡȫ���������ԣ�����application�����ļ��е����ݡ�ϵͳ�����ȡ�

����URL��[http://localhost:8080/actuator/env�����ز�����Ϣ��](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2Factuator%2Fenv%25EF%25BC%258C%25E8%25BF%2594%25E5%259B%259E%25E9%2583%25A8%25E5%2588%2586%25E4%25BF%25A1%25E6%2581%25AF%25EF%25BC%259A "http://localhost:8080/actuator/env%EF%BC%8C%E8%BF%94%E5%9B%9E%E9%83%A8%E5%88%86%E4%BF%A1%E6%81%AF%EF%BC%9A")

![image-20230530234200949](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230530234200949.png)

## env-toMatch�˵�

env-toMatch�˵���caches��caches-cache���ƣ�һ���ǻ�ȡ���еģ�һ���ǻ�ȡָ���ġ������env-toMatch�˵��ǻ�ȡָ��key�Ļ����������ԡ�

������ʽΪ��[http://localhost:8080/actuator/env/{toMatch}��](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2Factuator%2Fenv%2F%257BtoMatch%257D%25E3%2580%2582 "http://localhost:8080/actuator/env/%7BtoMatch%7D%E3%80%82") ʵ��URL��[http://localhost:8080/actuator/env/info.user.name](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2Factuator%2Fenv%2Finfo.user.name "http://localhost:8080/actuator/env/info.user.name") �����ؽ������ͼ��

![image-20230530234238073](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230530234238073.png)

����������Ϣ���������Ե���Դ��valueֵ����Ϣ��

## loggers�˵�

/loggers �˵㱩¶�˳����ڲ����õ����� logger ����Ϣ��������ͬ��package����ͬ�������־������Ϣ��

����URL��[http://localhost:8080/actuator/loggers](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2Factuator%2Floggers "http://localhost:8080/actuator/loggers") �����ַ��ؽ����

![image-20230530234301625](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230530234301625.png)

## loggers-name�˵�

loggers-name�˵�Ҳ��logger�˵��ϸ�֣�����ͨ��name����ĳһ��logger��

���������ʽ��[http://localhost:8080/actuator/loggers/{name}](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2Factuator%2Floggers%2F%257Bname%257D "http://localhost:8080/actuator/loggers/%7Bname%7D") ʾ������URL��[http://localhost:8080/actuator/loggers/com.secbro2.SpringbootActuatorApplication](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2Factuator%2Floggers%2Fcom.secbro2.SpringbootActuatorApplication "http://localhost:8080/actuator/loggers/com.secbro2.SpringbootActuatorApplication") �����ؽ�����£�



`{
"configuredLevel": null,
"effectiveLevel": "INFO"
}`

���Կ��������������־����ΪINFO��

## heapdump�˵�

heapdump�˵�᷵��һ��JVM ��dump��ͨ��JVM�Դ��ļ�ع���VisualVM�ɴ򿪴��ļ��鿴�ڴ���ա������ڴ��Ż������ڶ�ջ��������Ų��������

����URL��[http://localhost:8080/actuator/heapdump](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2Factuator%2Fheapdump "http://localhost:8080/actuator/heapdump") ��Mac����ϵͳ����������ʻ�����һ������Ϊheapdump���ļ����޺�׺��30M��

������ִ��jvisualvm�����VisualVM�����ε�����ļ�������װ�롱���ǵ��ļ�����Ҫѡ�񡰶�Dump(_.hprof,_.*)����Ȼ��ѡ��heapdump��

![image-20230530234346098](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230530234346098.png)

��ʱ�����ͨ�����������ж�ջ��Ϣ�ķ����ˡ�������������ķ����ṩ�˼�Ϊ�����ķ�ʽ��

## threaddump�˵�

/threaddump �˵�����ɵ�ǰ�̻߳�Ŀ��ա����ճ���λ�����ʱ��鿴�̵߳�����ǳ����ã���Ҫչʾ���߳������߳�ID���̵߳�״̬���Ƿ�ȴ�����Դ����Ϣ��

����URL��[http://localhost:8080/actuator/threaddump](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2Factuator%2Fthreaddump "http://localhost:8080/actuator/threaddump") �����ַ��ؽ����

![image-20230530234405331](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230530234405331.png)

���ǿ�ͨ���߳̿������Ų��������������⡣

## metrics�˵�

/metrics �˵�������¶��ǰӦ�õĸ�����Ҫ����ָ�꣬���磺�ڴ���Ϣ���߳���Ϣ������������Ϣ��tomcat�����ݿ����ӳصȡ�2.x�汾����ֻ��ʾ��һ��ָ����б�

����URL��[http://localhost:8080/actuator/metrics](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2Factuator%2Fmetrics "http://localhost:8080/actuator/metrics") ��

````
{
 "names": [
 "jvm.memory.max",
 "jvm.threads.states",
 "jvm.gc.pause",
 "http.server.requests",
 "process.files.max",
 "jvm.gc.memory.promoted",
 "system.load.average.1m",
 "jvm.memory.used",
 "jvm.gc.max.data.size",
 "jvm.memory.committed",
 "system.cpu.count",
 "logback.events",
 "jvm.buffer.memory.used",
 "tomcat.sessions.created",
 "jvm.threads.daemon",
 "system.cpu.usage",
 "jvm.gc.memory.allocated",
 "tomcat.sessions.expired",
 "jvm.threads.live",
 "jvm.threads.peak",
 "process.uptime",
 "tomcat.sessions.rejected",
 "process.cpu.usage",
 "jvm.classes.loaded",
 "jvm.classes.unloaded",
 "tomcat.sessions.active.current",
 "tomcat.sessions.alive.max",
 "jvm.gc.live.data.size",
 "process.files.open",
 "jvm.buffer.count",
 "jvm.buffer.total.capacity",
 "tomcat.sessions.active.max",
 "process.start.time"
 ]
}
````

/metrics�˵�����ṩӦ������״̬����������ָ�걨�棬����ܷǳ���ʵ�ã����Ƕ��ڼ��ϵͳ�еĸ����ع��ܣ����ǵļ�����ݡ������ռ�Ƶ�ʶ�������ͬ���������ÿ�ζ�ͨ��ȫ����ȡ����ķ�ʽ���ռ������Դֱ����ٷ�Ҳ�ǿ����Ǵ��ڴ˷���Ŀ��ǣ���Spring Boot 2.x֮��/metrics�˵�ֻ��ʾ��ָ����б�

�����Ҫ�鿴�����ĳ��ָ�꣬���ͨ��/metrics-requiredMetricName�˵���ʵ�֡�

## metrics-requiredMetricName�˵�

metrics-requiredMetricName�˵㣬���ڷ���ָ��ָ��ı��棬һ������/metrics�˵��Ȳ��ָ���б�Ȼ���ٲ�ѯ�����ĳ��ָ�ꡣ

������ʽ��[http://localhost:8080/actuator/metrics/{requiredMetricName}��](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2Factuator%2Fmetrics%2F%257BrequiredMetricName%257D%25E3%2580%2582 "http://localhost:8080/actuator/metrics/%7BrequiredMetricName%7D%E3%80%82") ʵ��URL��[http://localhost:8080/actuator/metrics/jvm.memory.max](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2Factuator%2Fmetrics%2Fjvm.memory.max "http://localhost:8080/actuator/metrics/jvm.memory.max") �����ؽ�����£�


````
{
 "name": "jvm.memory.max",
 "description": "The maximum amount of memory in bytes that can be used for memory management",
 "baseUnit": "bytes",
 "measurements": [
 {
 "statistic": "VALUE",
 "value": 5606211583
 }
 ],
 "availableTags": [
 {
 "tag": "area",
 "values": [
 "heap",
 "nonheap"
 ]
 },
 {
 "tag": "id",
 "values": [
 "Compressed Class Space",
 "PS Survivor Space",
 "PS Old Gen",
 "Metaspace",
 "PS Eden Space",
 "Code Cache"
 ]
 }
 ]
}
````

�������չʾ���������ڴ��������������ָ���չʾ�滻��Ӧ�����ֽ��в鿴���ɡ�

## scheduledtasks�˵�

/scheduledtasks�˵�����չʾӦ���еĶ�ʱ������Ϣ��

������Ŀ�й���������ʱ���������������������@EnableScheduling������ʱ�����ܡ�Ȼ�󴴽���ʱ�����ࣺ

````
@Component
public class MyTask {

 @Scheduled(cron = "0/10 * * * * *")
 public void work() {
 System.out.println("I am a cron job.");
 }

 @Scheduled(fixedDelay = 10000)
 public void work1() {
 System.out.println("I am a fixedDelay job.");
 }
}
````

���ж������������͵Ķ�ʱ����work�ǻ���cronʵ�ֵĶ�ʱ����work1�ǻ���fixedDelayʵ�ֵĶ�ʱ����

����URL��[http://localhost:8080/actuator/scheduledtasks](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2Factuator%2Fscheduledtasks "http://localhost:8080/actuator/scheduledtasks") �����ؽ����Ϣ���£�

```
{
 "cron": [
 {
 "runnable": {
 "target": "com.secbro2.job.MyTask.work"
 },
 "expression": "0/10 * * * * *"
 }
 ],
 "fixedDelay": [
 {
 "runnable": {
 "target": "com.secbro2.job.MyTask.work1"
 },
 "initialDelay": 0,
 "interval": 10000
 }
 ],
 "fixedRate": [],
 "custom": []
}
```

���Կ�����ͨ���ö˵������ȷ��֪����ǰӦ���ж���Ķ�ʱ�����Լ�ִ��ģʽ��Ƶ�Ρ�

## mappings�˵�

/mappings�˵���������ȫ���� URI ·�����Լ��Ϳ�������ӳ���ϵ������������ǱȽϳ��õ��ˣ������ϵͳ�Ĳ鿴URL��Ӧ��Controller������������ʹ�ô˶˵㡣

����URL��[http://localhost:8080/actuator/mappings](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8080%2Factuator%2Fmappings "http://localhost:8080/actuator/mappings") �����ַ��ؽ�����£�

![image-20230530234501440](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230530234501440.png)

���˹���Spring Boot Actuator�ṩ�����ж˵������ϡ�

## С��

����ͨ����Spring Boot Actuator�ṩ���ж˵㹹��ʵ������ʾ��������Ĵ�������ݺ�ʵ������ȫ����һ�����ϡ��ÿ�ܶ��Ų��������⣬�����Ż��ȶ��м���İ���������д���ĵĹ�����ҲԽ��Խ��̾Actuator�Ĺ���֮ǿ��ǿ���Ƽ���������

## �ο�����

���ߣ��������ӽ�
���ӣ�https://juejin.cn/post/6984550846876876814
��Դ��ϡ�����
����Ȩ���������С���ҵת������ϵ���߻����Ȩ������ҵת����ע��������

