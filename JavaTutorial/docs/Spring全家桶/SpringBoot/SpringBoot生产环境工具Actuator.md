

# ������������

[Back to index](https://springdoc.cn/spring-boot/index.html)

*   [1\. �������������Ĺ���](https://springdoc.cn/spring-boot/actuator.html#actuator.enabling)
*   [2\. �˵㣨Endpoint��](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints)
*   [3\. ͨ��HTTP���м�غ͹���](https://springdoc.cn/spring-boot/actuator.html#actuator.monitoring)
*   [4\. ͨ��JMX���м�غ͹���](https://springdoc.cn/spring-boot/actuator.html#actuator.jmx)
*   [5\. �ɹ۲��ԣ�Observability��](https://springdoc.cn/spring-boot/actuator.html#actuator.observability)
*   [6\. ��־��¼����Logger��](https://springdoc.cn/spring-boot/actuator.html#actuator.loggers)
*   [7\. ָ�꣨Metrics��](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics)
*   [8\. ׷�٣�Tracing��](https://springdoc.cn/spring-boot/actuator.html#actuator.micrometer-tracing)
*   [9\. ���](https://springdoc.cn/spring-boot/actuator.html#actuator.auditing)
*   [10\. ��¼ HTTP Exchange](https://springdoc.cn/spring-boot/actuator.html#actuator.http-exchanges)
*   [11\. ���̼��](https://springdoc.cn/spring-boot/actuator.html#actuator.process-monitoring)
*   [12\. Cloud Foundry ��֧��](https://springdoc.cn/spring-boot/actuator.html#actuator.cloud-foundry)
*   [13\. ��������ʲô](https://springdoc.cn/spring-boot/actuator.html#actuator.whats-next)













|  | ��վ([springdoc.cn](https://springdoc.cn/))�е�������Դ�� [spring.io](https://spring.io/) ��ԭʼ��Ȩ������ [spring.io](https://spring.io/)���� [springboot.io - Spring Boot��������](https://springboot.io/) ���з��룬�����ɹ�����ѧϰ���о���δ����ɣ����ý����κ�ת�ء����û���֮��ص���Ϊ�� �̱�������Spring �� Pivotal Software, Inc. �������Լ��������ҵ��̱ꡣ |
| --- | --- |





Spring Boot����һЩ����Ĺ��ܣ��԰������ڽ�Ӧ�ó��򷢲�������ʱ��غ͹������Ӧ�ó��� �����ѡ��ͨ��ʹ��HTTP�˵��ʹ��JMX������ͼ�����Ӧ�ó��� ��ơ�������ָ���ռ�Ҳ�����Զ�Ӧ�������Ӧ�ó���









## [](https://springdoc.cn/spring-boot/actuator.html#actuator.enabling)1\. �������������Ĺ���





[`spring-boot-actuator`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator) ģ���ṩ������Spring Boot�������������ܡ� ������Щ���ܵ��Ƽ���������Ӷ� `spring-boot-starter-actuator` ��Starter�� ��������







Actuator�Ķ���



actuator��ִ������ ��һ���������ָ���������ƶ������ĳ��Ļ�еװ�á�actuator ���Դ�һ��С�ı仯�в����������˶���









Ҫ�ڻ���Maven����Ŀ�����actuator����������� ��Starter�� ������







```
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        spring-boot-starter-actuator
    </dependency>
</dependencies>
```







����Gradle��ʹ������������







```
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
}
```











## [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints)2\. �˵㣨Endpoint��





Actuator �˵㣨endpoint��������Լ�ز������Ӧ�ó��򻥶��� Spring Boot����һЩ���õĶ˵㣬������������Լ��Ķ˵㡣 ���磬`health` �˵��ṩ������Ӧ�ó��򽡿���Ϣ��





�����[���û����](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.enabling)ÿ�������Ķ˵㣬��[ͨ��HTTP��JMX�������ǣ�ʹ���ǿ���Զ�̷��ʣ�](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.exposing)����һ���˵㱻���úͱ�¶ʱ��������Ϊ�ǿ��õġ����õĶ˵�ֻ�������ǿ���ʱ�Żᱻ�Զ����á������Ӧ�ó���ѡ��ͨ��HTTP��¶�����ж˵��ID�� `/actuator` ��ǰ׺��ӳ�䵽һ��URL�����磬Ĭ������£�`health` �˵㱻ӳ�䵽 `/actuator/health`��





|  | Ҫ�˽�������actuator�Ķ˵��Լ����ǵ��������Ӧ��ʽ���뿴������API�ĵ��� [HTML](https://docs.spring.io/spring-boot/docs/3.1.0-SNAPSHOT/actuator-api/htmlsingle) �� [PDF](https://docs.spring.io/spring-boot/docs/3.1.0-SNAPSHOT/actuator-api/pdf/spring-boot-actuator-web-api.pdf)���� |
| --- | --- |





�����Ǽ����޹ص��նˡ�



<colgroup><col><col></colgroup>
| ID | ˵�� |
| --- | --- |
| `auditevents` | ������ǰӦ�ó��������¼���Ϣ�� ��Ҫһ�� `AuditEventRepository` bean�� |
| `beans` | ��ʾ���Ӧ�ó���������Spring Bean�������б� |
| `caches` | ��ʾ���õĻ��档 |
| `conditions` | ��ʾ�����ú��Զ�����������������������Լ����Ƿ��ϻ򲻷��ϵ�ԭ�� |
| `configprops` | ��ʾ���� `@ConfigurationProperties` �������б� |
| `env` | ��¶Spring�� `ConfigurableEnvironment` �е����ԡ� |
| `flyway` | ��ʾ�κ��Ѿ�Ӧ�õ�Flyway���ݿ�Ǩ�ơ� ��Ҫһ������ `Flyway` bean�� |
| `health` | ��ʾӦ�ó���Ľ�����Ϣ�� |
| `httpexchanges` | ��ʾ HTTP exchange ��Ϣ��Ĭ������£���� 100 �� HTTP request/response exchange���� ��Ҫһ�� `HttpExchangeRepository` bean�� |
| `info` | ��ʾ�����Ӧ�ó�����Ϣ�� |
| `integrationgraph` | ��ʾSpring����ͼ�� ��Ҫ���� `spring-integration-core`�� |
| `loggers` | ��ʾ���޸�Ӧ�ó�����logger�����á� |
| `liquibase` | ��ʾ�κ��Ѿ�Ӧ�õ�Liquibase���ݿ�Ǩ�ơ� ��Ҫһ������ `Liquibase` Bean�� |
| `metrics` | ��ʾ��ǰӦ�ó���� ��metrics�� ��Ϣ�� |
| `mappings` | ��ʾ���� `@RequestMapping` ·���������б� |
| `quartz` | ��ʾ�й�Quartz Scheduler Job����Ϣ�� |
| `scheduledtasks` | ��ʾ���Ӧ�ó����еļƻ����� |
| `sessions` | �����Spring Session֧�ֵĻỰ�洢�м�����ɾ���û��Ự�� ��Ҫһ��ʹ��Spring Session�Ļ���Servlet��WebӦ�ó��� |
| `shutdown` | ��Ӧ�ó������ŵعرա�ֻ��ʹ��jar���ʱ��Ч��Ĭ��������ǽ��õġ� |
| `startup` | ��ʾ�� `ApplicationStartup` �ռ���[������������](https://springdoc.cn/spring-boot/features.html#features.spring-application.startup-tracking)��Ҫ�� `SpringApplication` ������Ϊ `BufferingApplicationStartup`�� |
| `threaddump` | Performs a thread dump. |



������Ӧ�ó�����һ��WebӦ�ó���Spring MVC��Spring WebFlux��Jersey���������ʹ�����¶���Ķ˵㡣



<colgroup><col><col></colgroup>
| ID | ˵�� |
| --- | --- |
| `heapdump` | ����һ����dump�ļ��� ��HotSpot JVM�ϣ�����һ�� `HPROF` ��ʽ���ļ��� ��OpenJ9 JVM�ϣ�����һ�� `PHD` ��ʽ���ļ��� |
| `logfile` | ������־�ļ������ݣ���� `logging.file.name` �� `logging.file.path` �����ѱ����ã��� ֧��ʹ��HTTP `Range` ͷ��������־�ļ��Ĳ������ݡ� |
| `prometheus` | �Կɱ� Prometheus ������ץȡ�ĸ�ʽչʾ������metric���� ������ `micrometer-registry-prometheus`�� |



### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.enabling)2.1\. ���ö˵�



Ĭ������£��� `shutdown` ������ж˵㶼�����á� Ҫ����һ���˵�����ã���ʹ���� `management.endpoint.<id>.enabled` ���ԡ� ��������������� `shutdown` �˵㡣







Properties

Yaml





```
management.endpoint.shutdown.enabled=true

```







�����ϣ���˵������ǡ�ѡ�����á������ǡ�ѡ����á����뽫 `management.endpoints.enabled-by-default` ��������Ϊ `false`����ʹ�õ����˵�� `enabled` ������ѡ���������á� ��������������� `info` �˵㣬�����������������˵㡣







Properties

Yaml





```
management.endpoints.enabled-by-default=false
management.endpoint.info.enabled=true

```







|  | �����õĶ˵���Ӧ�ó�������������ȫɾ�����������ֻ�ı䱩¶�˵�ļ�������ʹ�� [`include` �� `exclude` ����](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.exposing)�����档 |
| --- | --- |







### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.exposing)2.2\. ��¶�˵�



Ĭ������£�ֻ��health�˵���ͨ��HTTP��JMX��¶�ġ� ���ڶ˵���ܰ���������Ϣ����Ӧ����ϸ���Ǻ�ʱ��¶���ǡ�





Ҫ�ı���Щ�˵㱻��¶����ʹ�������ض������� `include` �� `exclude` ���ԡ�



<colgroup><col><col></colgroup>
| ���� | Ĭ�� |
| --- | --- |
| `management.endpoints.jmx.exposure.exclude` |  |
| `management.endpoints.jmx.exposure.include` | `health` |
| `management.endpoints.web.exposure.exclude` |  |
| `management.endpoints.web.exposure.include` | `health` |



`include` �����г��˱���¶�Ķ˵��ID�� `exclude` �����г��˲�Ӧ�ñ������Ķ˵��ID�� `exclude` ���������� `include` ���ԡ� �������һ���˵�ID�б������� `include` �� `exclude` ���ԡ�





���磬Ҫͨ��JMXֻ���� `health` �� `info` �˵㣬��ʹ���������ԡ�







Properties

Yaml





```
management.endpoints.jmx.exposure.include=health,info

```







`*` ��������ѡ�����ж˵㡣 ���磬Ҫͨ��HTTP�������еĶ��������� `env` �� `beans` �˵㣬ʹ���������ԡ�







Properties

Yaml





```
management.endpoints.web.exposure.include=*
management.endpoints.web.exposure.exclude=env,beans

```







|  | `*` ��YAML�о������⺬�壬�������������������ų������еĶ˵㣬һ��Ҫ�����š� |
| --- | --- |





|  | ������Ӧ�ó����ǹ�����¶�ģ�����ǿ�ҽ�����Ҳ[������Ķ˵�](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.security)�� |
| --- | --- |





|  | ��������ڶ˵㱩¶ʱʵʩ�Լ��Ĳ��ԣ������ע��һ�� `EndpointFilter` bean�� |
| --- | --- |







### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.security)2.3\. ��ȫ��Security��



Ϊ�˰�ȫ�����Ĭ�������ֻ�� `/health` �˵�ͨ��HTTP������ �����ʹ�� `management.endpoints.web.exposure.include` ���������ñ���¶�Ķ˵㡣





|  | ������ `management.endpoints.web.exposure.include` ֮ǰ����ȷ����¶��ִ����������������Ϣ���������ڷ���ǽ֮�󣬻���Spring Security֮��Ķ�������֤��ȫ�� |
| --- | --- |





���Spring Security��classpath�ϣ�����û������ `SecurityFilterChain` bean����ô���� `/health` ֮�������ִ������actuator������Spring Boot�Զ���������֤��ȫ�� ����㶨����һ���Զ���� `SecurityFilterChain` bean��Spring Boot�Զ����þͻ�������������ȫ����ִ�����ķ��ʹ���





�������ΪHTTP�˵������Զ��尲ȫ�����磬ֻ�������ĳ�ֽ�ɫ���û����ʣ���Spring Boot�ṩ��һЩ����� `RequestMatcher` �����������Spring Security���ʹ�á�





һ�����͵�Spring Security���ÿ��ܿ���������������ӡ�







Java

Kotlin





```
@Configuration(proxyBeanMethods = false)
public class MySecurityConfiguration {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.securityMatcher(EndpointRequest.toAnyEndpoint());
        http.authorizeHttpRequests((requests) -> requests.anyRequest().hasRole("ENDPOINT_ADMIN"));
        http.httpBasic(withDefaults());
        return http.build();
    }

}

```







ǰ�������ʹ�� `EndpointRequest.toAnyEndpoint()` ��ƥ��һ�������κζ˵㣬Ȼ��ȷ�����еĶ˵㶼�� `ENDPOINT_ADMIN` �Ľ�ɫ�� `EndpointRequest` �ϻ�����������ƥ���������� �����API�ĵ��� [HTML](https://docs.spring.io/spring-boot/docs/3.1.0-SNAPSHOT/actuator-api/htmlsingle) �� [PDF](https://docs.spring.io/spring-boot/docs/3.1.0-SNAPSHOT/actuator-api/pdf/spring-boot-actuator-web-api.pdf)����





������ڷ���ǽ���沿��Ӧ�ó��������ϣ���������ִ�����˵㶼�ܱ����ʣ�������Ҫ��֤�� �����ͨ���ı� `management.endpoints.web.exposure.include` ������������һ�㣬������ʾ��







Properties

Yaml





```
management.endpoints.web.exposure.include=*

```







���⣬�������Spring Security������Ҫ����Զ��尲ȫ���ã�����δ����֤�ķ��ʶ˵㣬��������ʾ��







Java

Kotlin





```
@Configuration(proxyBeanMethods = false)
public class MySecurityConfiguration {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.securityMatcher(EndpointRequest.toAnyEndpoint());
        http.authorizeHttpRequests((requests) -> requests.anyRequest().permitAll());
        return http.build();
    }

}

```







|  | ��ǰ������������У�����ֻ������actuator�˵㡣 ����Spring Boot�İ�ȫ���������κ� `SecurityFilterChain` bean������¶�����ȫ�˳�����������Ҫ����һ������� `SecurityFilterChain` bean�������������Ӧ�ó�����������֡� |
| --- | --- |





#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.security.csrf)2.3.1\. ����վ����α�챣����CSRF��



����Spring Boot����Spring Security��Ĭ��ֵ��CSRF������Ĭ������±��򿪡� ����ζ����ʹ��Ĭ�ϰ�ȫ����ʱ����Ҫ `POST`��shutdown��loggers�˵㣩��`PUT` �� `DELETE` ��actuator�˵�����403����ֹ���Ĵ���





|  | ���ǽ���ֻ�����㴴���ķ��񱻷�������ͻ���ʹ��ʱ����ȫ����CSRF������ |
| --- | --- |





������� [Spring��ȫ�ο�ָ��](https://docs.spring.io/spring-security/reference/6.1.0-M1/features/exploits/csrf.html) ���ҵ�����CSRF������������Ϣ��









### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.caching)2.4\. ���ö˵�



�˵���Զ����治��Ҫ�κβ����Ķ�ȡ��������Ӧ�� Ҫ���ö˵㻺����Ӧ��ʱ�䣬��ʹ���� `cache.time-to-live` ���ԡ� ��������ӽ� `beans` �˵�Ļ�������ʱ������Ϊ10�롣







Properties

Yaml





```
management.endpoint.beans.cache.time-to-live=10s

```







|  | `management.endpoint.<name>` ǰ׺Ψһ�ر�ʶ���������õĶ˵㡣 |
| --- | --- |







### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.hypermedia)2.5\. ���� Actuator Web �˵�ĳ�ý�壨Hypermedia��



һ�� ��discovery page�� ����ӵ����ж˵�������С� Ĭ������£���discovery page�� �� `/actuator` ���ǿ��õġ�





Ҫ���� ��discovery page�����������Ӧ�ó�������������������ԡ�







Properties

Yaml





```
management.endpoints.web.discovery.enabled=false

```







��������һ���Զ���Ĺ���������·��ʱ����discovery page�� ���Զ��� `/actuator` �Ƶ����������ĵĸ����� ���磬�������������·���� `/management`��discovery page���Դ� `/management` ��á� ������������·��������Ϊ `/` ʱ������ҳ�����ã��Է�ֹ������mapping������ͻ�Ŀ����ԡ�







### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.cors)2.6\. CORS��֧��



[��Դ��Դ����](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)��CORS���� [W3C��һ���淶](https://www.w3.org/TR/cors/)���������������ķ�ʽָ�����ֿ���������Ȩ�������ʹ��Spring MVC��Spring WebFlux�����������Actuator��Web�˵���֧�����������





CORS֧����Ĭ��������ǽ��õģ�ֻ������������ `management.endpoints.web.cors.allowed-origins` ���Ժ�Ż����á� �������������� `example.com` �����е��� `GET` �� `POST`��







Properties

Yaml





```
management.endpoints.web.cors.allowed-origins=https://example.com
management.endpoints.web.cors.allowed-methods=GET,POST

```







|  | �μ� [`CorsEndpointProperties`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator-autoconfigure/src/main/java/org/springframework/boot/actuate/autoconfigure/endpoint/web/CorsEndpointProperties.java) �Ի��������ѡ���б� |
| --- | --- |







### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.implementing-custom)2.7\. ʵ���Զ���˵�



����������һ������ `@Endpoint` ע��� `@Bean`���κδ��� `@ReadOperation`��`@WriteOperation` �� `@DeleteOperation` ע�͵ķ��������Զ�ͨ��JMX��������WebӦ�ó�����Ҳ��ͨ��HTTP������ ͨ��ʹ��Jersey��Spring MVC��Spring WebFlux���˵����ͨ��HTTP��¶�� ���Jersey��Spring MVC�����ã���ʹ��Spring MVC��





��������ӱ�¶��һ����������������һ���Զ������







Java

Kotlin





```
@ReadOperation
public CustomData getData() {
    return new CustomData("test", 5);
}

```







��Ҳ����ͨ��ʹ�� `@JmxEndpoint` �� `@WebEndpoint` ����д�ض������Ķ˵㡣 ��Щ�˵㱻���������Ǹ��Եļ����ϡ� ���磬`@WebEndpoint` ֻͨ��HTTP��¶��������ͨ��JMX��





�����ͨ��ʹ�� `@EndpointWebExtension` �� `@EndpointJmxExtension` ����д�ض��ļ�����չ�� ��Щע�������ṩ�ض������Ĳ���������ǿ���еĶ˵㡣





����������Ҫ����Web��ܵ��ض����ܣ������ʵ��servlet��Spring�� `@Controller` �� `@RestController` �˵㣬���������ǲ���ͨ��JMX��ʹ�ò�ͬ��Web���ʱ���á�





#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.implementing-custom.input)2.7.1\. ��������



�˵��ϵĲ���ͨ��������������롣 ��ͨ��web����ʱ����Щ������ֵ����URL�Ĳ�ѯ������JSON�����塣 ��ͨ��JMX����ʱ��������ӳ�䵽MBean�����Ĳ����С� Ĭ������£������Ǳ���ġ� ���ǿ���ͨ��ʹ�� `@javax.annotation.Nullable` �� `@org.springframework.lang.Nullable` ����ע�����Ϊ��ѡ�





����Խ�JSON�������е�ÿ��������ӳ�䵽�˵��һ�������� ����һ�������JSON�����塣







```
{
    "name": "test",
    "counter": 42
}
```







���������������һ��д�������ò�����Ҫ `String name` �� `int counter` �������������������ʾ��







Java

Kotlin





```
@WriteOperation
public void updateData(String name, int counter) {
    // injects "test" and 42
}

```







|  | ��Ϊ�˵��Ǽ�������֪�ģ��ڷ���ǩ����ֻ��ָ���򵥵����͡� �ر��ǣ���֧���� `CustomData` ��������һ�������� `name` �� `counter` ���Եĵ�һ������ |
| --- | --- |





|  | Ϊ��������ӳ�䵽���������Ĳ�����ʵ�ֶ˵��Java����Ӧ���� `-parameters` ���룬��ʵ�ֶ˵��Kotlin����Ӧ���� `-java-parameters` ���롣 �����ʹ��Spring Boot��Gradle�����ʹ��Maven�� `spring-boot-starter-parent`���⽫�Զ������� |
| --- | --- |





##### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.implementing-custom.input.conversion)��������ת��



����б�Ҫ�����ݸ��˵���������Ĳ������Զ�ת��Ϊ�������͡� �ڵ��ò�������֮ǰ��ͨ��JMX��HTTP�յ������뱻ת��Ϊ��������ͣ�������ʹ�� `ApplicationConversionService` ��ʵ���Լ��κ� `Converter` �� `GenericConverter` Bean������ `@EndpointConverter` �޶���









#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.implementing-custom.web)2.7.2\. �Զ���WEB�˵�



�� `@Endpoint`��`@WebEndpoint` �� `@EndpointWebExtension` �������Զ�ʹ��Jersey��Spring MVC��Spring WebFluxͨ��HTTP������ ���Jersey��Spring MVC�����ã���ʹ��Spring MVC��





##### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.implementing-custom.web.request-predicates)WEB�˵�����ν�ʣ�Predicates��



һ������ν�ʻ�Ϊweb��¶�Ķ˵��ϵ�ÿ��������operation���Զ����ɡ�







##### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.implementing-custom.web.path-predicates)Path



pathν���ɶ˵��ID�����籩¶�Ķ˵�Ļ���·�������� Ĭ�ϵĻ���·���� `/actuator`�� ���磬һ��IDΪ `sessions` �Ķ˵���ν����ʹ�� `/actuator/sessions` ��Ϊ��·����





�����ͨ���� `@Selector` ע�����������һ��������������һ������·���� �����Ĳ�������Ϊһ��·��������ӵ�·��ν���С� �ڵ��ö˵����ʱ���ñ�����ֵ�ᱻ������������� ������벶������ʣ���·��Ԫ�أ�����������һ����������� `@Selector(Match=ALL_REMAINING)`����ʹ���Ϊһ���� `String[]` ת�����ݵ����͡�







##### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.implementing-custom.web.method-predicates)HTTP method��������



HTTP methodν�����ɲ������;����ģ����±���ʾ��



<colgroup><col><col></colgroup>
| Operation | HTTP method |
| --- | --- |
| `@ReadOperation` | `GET` |
| `@WriteOperation` | `POST` |
| `@DeleteOperation` | `DELETE` |





##### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.implementing-custom.web.consumes-predicates)Consumes



����ʹ��request body�� `@WriteOperation`��HTTP `POST`����ν�ʵ� `consumes` �Ӿ��� `application/vnd.spring-boot.actuator.v2+json, application/json`�� ������������������`consumes` �Ӿ��ǿյġ�







##### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.implementing-custom.web.produces-predicates)Produces



ν�ʵ� `produces` �Ӿ������ `@DeleteOperation`��`@ReadOperation` �� `@WriteOperation` ע�͵� `produces` ���Ծ����� �������ǿ�ѡ�ġ� �����ʹ������`produces` �Ӿ���Զ�ȷ����





��������������� `void` �� `Void`���� `produces` �Ӿ�Ϊ�ա� ��������������� `org.springframework.core.io.Resource`��`produces` �Ӿ��� `application/octet-stream`�� ������������������`produces` �Ӿ��� `application/vnd.spring-boot.actuator.v2+json, application/json`��







##### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.implementing-custom.web.response-status)WEB�˵���Ӧ״̬



�˵������Ĭ����Ӧ״̬ȡ���ڲ������ͣ�����д��ɾ�����Ͳ������ص����ݣ�����еĻ�����





��� `@ReadOperation` ����һ��ֵ����Ӧ״̬����200(Ok)�� �����û�з���һ��ֵ����Ӧ״̬����404(Not Found)��





��� `@WriteOperation` �� `@DeleteOperation` ����һ��ֵ����Ӧ״̬����200��OK���� �����û�з���һ��ֵ����Ӧ״̬����204��No Content����





���һ�������ڵ���ʱû������Ĳ��������߲������ܱ�ת��Ϊ��������ͣ����������Ͳ��ᱻ���ã���Ӧ״̬����400��Bad Request����







##### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.implementing-custom.web.range-requests)WEB�˵� Range ����



�����ʹ��HTTP range����������һ��HTTP��Դ��һ���֡� ��ʹ��Spring MVC��Spring Web Fluxʱ������ `org.springframework.core.io.Resource` �Ĳ����Զ�֧�ַ�Χ����





|  | ʹ��Jerseyʱ��֧�� Range ���� |
| --- | --- |







##### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.implementing-custom.web.security)Web�˵�İ�ȫ



��web�˵��web�ض��˵���չ�ϵĲ������Խ��յ�ǰ�� `java.security.Principal` �� `org.springframework.boot.actuate.endpoint.SecurityContext` ��Ϊ���������� ǰ��ͨ���� `@Nullable` һ��ʹ�ã�Ϊ����֤��δ��֤���û��ṩ��ͬ����Ϊ�� ����ͨ������ͨ��ʹ���� `isUserInRole(String)` ������ִ����Ȩ��顣









#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.implementing-custom.servlet)2.7.3\. Servlet �˵�



һ��Servlet������Ϊһ���˵㱩¶������������ʵ��һ���� `@ServletEndpoint` ע����࣬ͬʱʵ�� `Supplier<EndpointServlet>`�� Servlet�˵��ṩ����servlet�����ĸ����ε����ϣ���ȴ�����˿���ֲ�ԡ� ���ǵ�Ŀ�������������е�Servlet��Ϊһ���˵��������� �����µĶ˵㣬Ӧ������ѡ�� `@Endpoint` �� `@WebEndpoint` ע�⡣







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.implementing-custom.controller)2.7.4\. Controller �˵�



�����ʹ�� `@ControllerEndpoint` �� `@RestControllerEndpoint` ��ʵ��һ������Spring MVC��Spring WebFlux�����Ķ˵㡣 ����ͨ��ʹ��Spring MVC��Spring WebFlux�ı�׼ע�����ӳ�䣬�� `@RequestMapping` �� `@GetMapping`���˵��ID������·����ǰ׺�� �������˵��ṩ����Spring��Web��ܸ�����ļ��ɣ���ȴ�����˿���ֲ�ԡ� Ӧ������ѡ�� `@Endpoint` �� `@WebEndpoint` ע�⡣









### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.health)2.8\. ������Ϣ



�����ʹ�ý�����Ϣ����������е�Ӧ�ó����״̬�� ������������������������ϵͳ��������ʱ���ѱ��ˡ� `health` �˵㱩¶����Ϣȡ���� `management.endpoint.health.show-details` �� `management.endpoint.health.show-components` ���ԣ����ǿ�������Ϊ����ֵ֮һ��



<colgroup><col><col></colgroup>
| ֵ | ˵�� |
| --- | --- |
| `never` | ϸ�ڴӲ���ʾ�� |
| `when-authorized` | ϸ��ֻ��ʾ����Ȩ�û��� ��Ȩ�Ľ�ɫ����ͨ��ʹ�� `management.endpoint.health.roles` �������á� |
| `always` | ������ʾ�������û��� |



Ĭ��ֵ�� `never`�� ���û����ڶ˵��һ��������ɫ��ʱ�����Ǳ���Ϊ�Ǳ���Ȩ�ġ� ����˵�û�����ý�ɫ��Ĭ��ֵ����������֤���û�������Ϊ����Ȩ�ġ� �����ͨ��ʹ�� `management.endpoint.health.roles` ���������ý�ɫ��





|  | ������Ѿ����������Ӧ�ó���ϣ��ʹ�� `always`����İ�ȫ���ã�security configuration������������֤�ͷ���֤�û�����health�˵㡣 |
| --- | --- |





������Ϣ�Ǵ� [`HealthContributorRegistry`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/health/HealthContributorRegistry.java) ���������ռ��ģ�Ĭ������£����� [`HealthContributor`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/health/HealthContributor.java) ʵ������������� `ApplicationContext` �У��� Spring Boot����һЩ�Զ����õ� `HealthContributor`����Ҳ���Ա�д�Լ��ġ�





һ�� `HealthContributor` ������һ�� `HealthIndicator` ��һ�� `CompositeHealthContributor`�� һ�� `HealthIndicator` �ṩʵ�ʵĽ�����Ϣ������ `Status`�� һ�� `CompositeHealthContributor` �ṩ���� `HealthContributors` ����ϡ� �ۺ�������contributor�γ�һ����״�ṹ����ʾ����ϵͳ�Ľ���״����





Ĭ������£����յ�ϵͳ����״������һ�� `StatusAggregator` �ó��ģ�������һ�������״̬�б��ÿ�� `HealthIndicator` ��״̬�������� �����б��еĵ�һ��״̬���������彡��״̬�� ���û�� `HealthIndicator` ���ص�״̬�� `StatusAggregator` ��֪���ģ��ͻ�ʹ�� `UNKNOWN` ״̬��





|  | �����ʹ�� `HealthContributorRegistry` ��������ʱע���ȡ��ע�ὡ��ָ�ꡣ |
| --- | --- |





#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.health.auto-configured-health-indicators)2.8.1\. �Զ����õ�HealthIndicators



���ʵ���ʱ��Spring Boot���Զ������±����г��� `HealthIndicators`�� ��Ҳ����ͨ������ `management.health.key.enabled` �����û�ͣ����ѡָ�ꡣ ���±����г��� `key`��



<colgroup><col><col><col></colgroup>
| Key | Name | ˵�� |
| --- | --- | --- |
| `cassandra` | [`CassandraDriverHealthIndicator`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/cassandra/CassandraDriverHealthIndicator.java) | ���Cassandra���ݿ��Ƿ��Ѿ������� |
| `couchbase` | [`CouchbaseHealthIndicator`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/couchbase/CouchbaseHealthIndicator.java) | ���Couchbase��Ⱥ�Ƿ��Ѿ������� |
| `db` | [`DataSourceHealthIndicator`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/jdbc/DataSourceHealthIndicator.java) | ����Ƿ���Ի����`DataSource`�����ӡ� |
| `diskspace` | [`DiskSpaceHealthIndicator`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/system/DiskSpaceHealthIndicator.java) | �����̿ռ��Ƿ��㡣 |
| `elasticsearch` | [`ElasticsearchRestHealthIndicator`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/elasticsearch/ElasticsearchRestHealthIndicator.java) | ���Elasticsearch��Ⱥ�Ƿ��Ѿ������� |
| `hazelcast` | [`HazelcastHealthIndicator`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/hazelcast/HazelcastHealthIndicator.java) | ���Hazelcast�������Ƿ��Ѿ������� |
| `influxdb` | [`InfluxDbHealthIndicator`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/influx/InfluxDbHealthIndicator.java) | ���InfluxDB�������Ƿ��Ѿ������� |
| `jms` | [`JmsHealthIndicator`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/jms/JmsHealthIndicator.java) | ���һ��JMS�����Ƿ��Ѿ������� |
| `ldap` | [`LdapHealthIndicator`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/ldap/LdapHealthIndicator.java) | ���һ��LDAP�������Ƿ������� |
| `mail` | [`MailHealthIndicator`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/mail/MailHealthIndicator.java) | ���һ���ʼ��������Ƿ������� |
| `mongo` | [`MongoHealthIndicator`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/data/mongo/MongoHealthIndicator.java) | ���Mongo���ݿ��Ƿ��Ѿ������� |
| `neo4j` | [`Neo4jHealthIndicator`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/neo4j/Neo4jHealthIndicator.java) | ���Neo4j���ݿ��Ƿ��Ѿ������� |
| `ping` | [`PingHealthIndicator`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/health/PingHealthIndicator.java) | ������Ӧ `UP` �� |
| `rabbit` | [`RabbitHealthIndicator`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/amqp/RabbitHealthIndicator.java) | ���һ��Rabbit�������Ƿ��Ѿ������� |
| `redis` | [`RedisHealthIndicator`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/data/redis/RedisHealthIndicator.java) | ���Redis�������Ƿ��Ѿ������� |



|  | �����ͨ������ `management.health.defaults.enabled` �������������ǡ� |
| --- | --- |





����� `HealthIndicators` �ǿ��õģ�����Ĭ������²����á�



<colgroup><col><col><col></colgroup>
| Key | Name | ˵�� |
| --- | --- | --- |
| `livenessstate` | [`LivenessStateHealthIndicator`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/availability/LivenessStateHealthIndicator.java) | ��ʾ ��Liveness�� Ӧ�ó���Ŀ�����״̬�� |
| `readinessstate` | [`ReadinessStateHealthIndicator`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/availability/ReadinessStateHealthIndicator.java) | ��¶ ��Readiness�� Ӧ�ó���Ŀ�����״̬�� |





#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.health.writing-custom-health-indicators)2.8.2\. ��д�Զ���HealthIndicators



Ϊ���ṩ�Զ���Ľ�����Ϣ�������ע��ʵ�� [`HealthIndicator`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/health/HealthIndicator.java) �ӿڵ�Spring Bean�� ����Ҫ�ṩһ�� `health()` ������ʵ�֣�������һ�� `Health` ��Ӧ�� `Health` ��ӦӦ�ð���һ��status��������ѡ�����Ҫ��ʾ������ϸ�ڡ� ����Ĵ�����ʾ��һ�� `HealthIndicator` ��ʵ��������







Java

Kotlin





```
@Component
public class MyHealthIndicator implements HealthIndicator {

    @Override
    public Health health() {
        int errorCode = check();
        if (errorCode != 0) {
            return Health.down().withDetail("Error Code", errorCode).build();
        }
        return Health.up().build();
    }

    private int check() {
        // perform some specific health check
        return ...
    }

}

```







|  | һ�������� `HealthIndicator` �ı�ʶ����ID����û�� `HealthIndicator` ��׺��Bean�����֣���������ڵĻ��� ��ǰ��������У�������Ϣ������һ����Ϊ `my` ����Ŀ���ҵ��� |
| --- | --- |





|  | ����ָ��ͨ����ͨ��HTTP���õģ���Ҫ���κ����ӳ�ʱ֮ǰ������Ӧ�� ����κν���ָ�����Ӧʱ�䳬��10�룬Spring Boot����¼һ��������Ϣ�� ����������������ֵ�������ʹ�� `management.endpoint.health.logging.slow-indicator-threshold` ���ԡ� |
| --- | --- |





����Spring BootԤ����� [`Status`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/health/Status.java) �����⣬`Health` ���Է��ش�����ϵͳ״̬���Զ��� `Status`�� ����������£��㻹��Ҫ�ṩ `StatusAggregator` �ӿڵ��Զ���ʵ�֣����������ͨ��ʹ�� `management.endpoint.health.status.order` ��������������Ĭ��ʵ�֡�





���磬���������һ�� `HealthIndicator` ʵ����ʹ����һ������Ϊ `FATAL` ���� `Status`�� Ϊ������������˳�������Ӧ�ó�������������������ԡ�







Properties

Yaml





```
management.endpoint.health.status.order=fatal,down,out-of-service,unknown,up

```







��Ӧ�е�HTTP״̬���뷴ӳ�����彡��״̬�� Ĭ������£�`OUT_OF_SERVICE` �� `DOWN` ӳ�䵽503�� �κ�δӳ��Ľ���״̬������ `UP`����ӳ��Ϊ200�� �����ͨ��HTTP���ʽ����˵㣬����ܻ���ע���Զ���״̬ӳ�䡣 �����Զ���ӳ������ `DOWN` �� `OUT_OF_SERVICE` ��Ĭ��ӳ�䡣 ������뱣��Ĭ��ӳ�䣬�������ȷ���������ǣ��Լ��κ��Զ���ӳ�䡣 ���磬��������Խ� `FATAL` ӳ��Ϊ503�����񲻿��ã����������� `DOWN` �� `OUT_OF_SERVICE` ��Ĭ��ӳ�䡣







Properties

Yaml





```
management.endpoint.health.status.http-mapping.down=503
management.endpoint.health.status.http-mapping.fatal=503
management.endpoint.health.status.http-mapping.out-of-service=503

```







|  | �������Ҫ����Ŀ��ƣ�����Զ������Լ��� `HttpCodeStatusMapper` bean�� |
| --- | --- |





�±���ʾ������״̬��Ĭ��״̬ӳ�䡣



<colgroup><col><col></colgroup>
| Status | Mapping |
| --- | --- |
| `DOWN` | `SERVICE_UNAVAILABLE` (`503`) |
| `OUT_OF_SERVICE` | `SERVICE_UNAVAILABLE` (`503`) |
| `UP` | Ĭ�������û��ӳ�䣬����HTTP״̬Ϊ `200`�� |
| `UNKNOWN` | Ĭ�������û��ӳ�䣬����HTTP״̬Ϊ `200`�� |





#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.health.reactive-health-indicators)2.8.3\. ��Ӧʽ����ָ��



������ӦʽӦ�ó���������Щʹ��Spring WebFlux��Ӧ�ó���`ReactiveHealthContributor` �ṩ��һ������������Լ����ȡӦ�ó���Ľ���״���� �봫ͳ�� `HealthContributor` ���ƣ�������Ϣ�� [`ReactiveHealthContributorRegistry`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/health/ReactiveHealthContributorRegistry.java) ���������ռ���Ĭ������£����� [`HealthContributor`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/health/HealthContributor.java) �� [`ReactiveHealthContributor`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/health/ReactiveHealthContributor.java) ��ʵ����������� `ApplicationContext` ���





������ӦʽAPI���м��ĳ��� `HealthContributors` �ڵ��Ե�������ִ�С�





|  | ��һ����ӦʽӦ�ó����У���Ӧ��ʹ�� `ReactiveHealthContributorRegistry` ��������ʱע���ȡ��ע�ὡ��ָ�ꡣ �������Ҫע��һ����ͨ�� `HealthContributor`����Ӧ���� `ReactiveHealthContributor#adapt` ����װ���� |
| --- | --- |





Ϊ�˴���ӦʽAPI���ṩ�Զ���Ľ�����Ϣ�������ע��ʵ�� [`ReactiveHealthIndicator`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/health/ReactiveHealthIndicator.java) �ӿڵ�Spring Bean�� ����Ĵ�����ʾ��һ�� `ReactiveHealthIndicator` ��ʾ��ʵ�֡�







Java

Kotlin





```
@Component
public class MyReactiveHealthIndicator implements ReactiveHealthIndicator {

    @Override
    public Mono<Health> health() {
        return doHealthCheck().onErrorResume((exception) ->
            Mono.just(new Health.Builder().down(exception).build()));
    }

    private Mono<Health> doHealthCheck() {
        // perform some specific health check
        return ...
    }

}

```







|  | Ϊ���Զ�������󣬿��Կ��Ǵ� `AbstractReactiveHealthIndicator` ����չ�� |
| --- | --- |







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.health.auto-configured-reactive-health-indicators)2.8.4\. �Զ����õ� ReactiveHealthIndicators



���ʵ���ʱ��Spring Boot���Զ��������µ� `ReactiveHealthIndicators`��



<colgroup><col><col><col></colgroup>
| Key | Name | ˵�� |
| --- | --- | --- |
| `cassandra` | [`CassandraDriverReactiveHealthIndicator`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/cassandra/CassandraDriverReactiveHealthIndicator.java) | ���Cassandra���ݿ��Ƿ��Ѿ������� |
| `couchbase` | [`CouchbaseReactiveHealthIndicator`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/couchbase/CouchbaseReactiveHealthIndicator.java) | ���Couchbase��Ⱥ�Ƿ��Ѿ������� |
| `elasticsearch` | [`ElasticsearchReactiveHealthIndicator`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/data/elasticsearch/ElasticsearchReactiveHealthIndicator.java) | ���Elasticsearch��Ⱥ�Ƿ��Ѿ������� |
| `mongo` | [`MongoReactiveHealthIndicator`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/data/mongo/MongoReactiveHealthIndicator.java) | ���Mongo���ݿ��Ƿ��Ѿ������� |
| `neo4j` | [`Neo4jReactiveHealthIndicator`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/neo4j/Neo4jReactiveHealthIndicator.java) | ���Neo4j���ݿ��Ƿ��Ѿ������� |
| `redis` | [`RedisReactiveHealthIndicator`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/data/redis/RedisReactiveHealthIndicator.java) | ���Redis�������Ƿ��Ѿ������� |



|  | ����б�Ҫ����Ӧʽָ���ȡ������ָ�ꡣ ���⣬�κ�û�б���ȷ����� `HealthIndicator` ���ᱻ�Զ���װ������ |
| --- | --- |







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.health.groups)2.8.5\. Health���飨Health Groups��



��ʱ��������ָ����֯�ɿ������ڲ�ͬĿ�ĵ����Ǻ����õġ�





Ҫ����һ������ָ���飬�����ʹ�� `management.endpoint.health.group.<name>` ���ԣ���ָ��һ������ָ��ID�б��� `include` �� `exclude`�� ���磬Ҫ����һ��ֻ�������ݿ�ָ����飬����Զ������¡�







Properties

Yaml





```
management.endpoint.health.group.custom.include=db

```







Ȼ�������ͨ����� `[localhost:8080/actuator/health/custom](http://localhost:8080/actuator/health/custom)` ���������





ͬ����Ҫ����һ���飬�����ݿ�ָ���ų��ڸ���֮�⣬��������������ָ�꣬����Զ������¡�







Properties

Yaml





```
management.endpoint.health.group.custom.exclude=db

```







Ĭ������£���̳�����ϵͳ������ͬ�� `StatusAggregator` �� `HttpCodeStatusMapper` ���á� Ȼ������Ҳ������ÿ����Ļ����϶�����Щ�� �����Ҫ����Ҳ���Ը��� `show-details` �� `roles` ���ԡ�







Properties

Yaml





```
management.endpoint.health.group.custom.show-details=when-authorized
management.endpoint.health.group.custom.roles=admin
management.endpoint.health.group.custom.status.order=fatal,up
management.endpoint.health.group.custom.status.http-mapping.fatal=500
management.endpoint.health.group.custom.status.http-mapping.out-of-service=500

```







|  | �������Ҫע���Զ���� `StatusAggregator` �� `HttpCodeStatusMapper` Bean�������飬�����ʹ�� `@Qualifier("groupname")`�� |
| --- | --- |





һ��������Ҳ���԰���/�ų�һ�� `CompositeHealthContributor`�� ��Ҳ����ֻ����/�ų�һ�� `CompositeHealthContributor` ��ĳ������� �����ʹ���������ȫ��������ɣ�������ʾ��







```
management.endpoint.health.group.custom.include="test/primary"
management.endpoint.health.group.custom.exclude="test/primary/b"
```







������������У�`custom` �齫��������Ϊ `primary` �� `HealthContributor`�����Ǹ��� `test` ��һ����ɲ��֡� �����`primary` �������һ�������壬����Ϊ `b` �� `HealthContributor` �����ų��� `custom` ��֮�⡣





��������������˿ڻ����˿ڵĶ���·�����ṩ�� ����Kubernetes���ƻ����к����ã�����Щ�����У����ڰ�ȫ���ǣ�Ϊִ�����˵�ʹ��һ�������Ĺ���˿��Ǻܳ����ġ� ��һ�������Ķ˿ڿ��ܵ��²��ɿ��Ľ�����飬��Ϊ��ʹ�������ɹ�����Ӧ�ó���Ҳ�����޷����������� �����������һ�������·���������ã�������ʾ��







```
management.endpoint.health.group.live.additional-path="server:/healthz"
```







�⽫ʹ `live` �����������������˿� `/healthz` �Ͽ��á� ǰ׺��ǿ���Եģ������� `server:`���������������˿ڣ��� `management:`���������˿ڣ���������ã��� ·��������һ����һ��·���Ρ�







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.health.datasource)2.8.6\. ����Դ����



`DataSource` ����ָ����ʾ��׼����Դ��·������ԴBean�Ľ���״���� ·������Դ�Ľ���״��������ÿ��Ŀ������Դ�Ľ���״���� �ڽ����˵����Ӧ�У�·������Դ��ÿ��Ŀ�궼��ͨ��ʹ����·�ɼ��������ġ� ����㲻ϣ����ָ�������а���·������Դ���뽫 `management.health.db.ignore-routing-data-sources` ����Ϊ `true`��









### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.kubernetes-probes)2.9\. Kubernetes ̽��



������Kubernetes�ϵ�Ӧ�ó������ͨ�� [����̽��](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#container-probes) �ṩ�й����ڲ�״̬����Ϣ������ [���Kubernetes����](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)��kubelet�������Щ̽�벢�Խ��������Ӧ��





Ĭ������£�Spring Boot��������[Ӧ�ÿ�����״̬](https://springdoc.cn/spring-boot/features.html#features.spring-application.application-availability)�� ���������Kubernetes�����У�actuator�� `ApplicationAvailability` �ӿ����ռ� ��Liveness�� �� ��Readiness�� ��Ϣ������ר��[����ָ��](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.health.auto-configured-health-indicators)��ʹ����Щ��Ϣ��`LivenessStateHealthIndicator` �� `ReadinessStateHealthIndicator`�� ��Щָ����ʾ��ȫ�ֽ����˵㣨`"/actuator/health"`���� ����Ҳ����ͨ��ʹ��[������](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.health.groups)��Ϊ������HTTP̽�룺`"/actuator/health/liveness"` �� `"/actuator/health/readiness"`��





Ȼ������������¶˵���Ϣ�������Kubernetes������ʩ��







```
livenessProbe:
  httpGet:
    path: "/actuator/health/liveness"
    port: 
  failureThreshold: ...
  periodSeconds: ...

readinessProbe:
  httpGet:
    path: "/actuator/health/readiness"
    port: 
  failureThreshold: ...
  periodSeconds: ...
```







|  | `` Ӧ�ñ�����Ϊִ�����˵���õĶ˿ڡ� ����������Web�������Ķ˿ڣ�Ҳ������һ�������Ĺ���˿ڣ���� `"management.server.port"` �����Ѿ������á� |
| --- | --- |





ֻ�е�Ӧ�ó���[��Kubernetes����������ʱ](https://springdoc.cn/spring-boot/deployment.html#deployment.cloud.kubernetes)����Щ������Ż��Զ����á� �����ͨ��ʹ�� `management.endpoint.health.probes.enabled` �����������κλ������������ǡ�





|  | ���һ��Ӧ�ó��������ʱ�䳬�������õ���Ч�ڣ�Kubernetes ���ᵽ `"startupProbe"` ��Ϊһ�����ܵĽ��������һ����˵�����ﲻһ����Ҫ `"startupProbe"`����Ϊ `"readinessProbe"` �������������������֮ǰʧЧ������ζ�����Ӧ�ó�����׼����֮ǰ�����յ�������Ȼ����������Ӧ�ó�����Ҫ�ܳ�ʱ��������������Կ���ʹ�� `"startupProbe"` ��ȷ��Kubernetes���������Ӧ�ó�������������ɱ���������������[̽����Ӧ�ó������������е���Ϊ](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.kubernetes-probes.lifecycle)�Ĳ��֡� |
| --- | --- |





������Actuator�˵㱻������һ�������Ĺ����������У���ô��Щ�˵�Ͳ���������������ʹ����ͬ�����������ʩ���˿ڡ����ӳء����������� ����������£���ʹ���������������������磬�����ܽ����µ����ӣ���̽����Ҳ���ܳɹ��� �������ԭ�������������˿������� `liveness` �� `readiness` �������Ǹ������⡣ �����ͨ����������������ʵ�֡�







```
management.endpoint.health.probes.add-additional-paths=true
```







�⽫ʹ `liveness` �� `/livez` ���ã�`readiness` �� `readyz` �����������˿ڿ��á�





#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.kubernetes-probes.external-state)2.9.1\. ��Kubernetes̽�����ⲿ״̬



ִ������ ��liveness�� �� ��readiness�� ̽������Ϊ�����顣����ζ�����е�[������Ĺ���](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.health.groups)�����Ƕ��ǿ��õġ����磬��������ö���Ľ���ָ�ꡣ







Properties

Yaml





```
management.endpoint.health.group.readiness.include=readinessState,customCheck

```







Ĭ������£�Spring Boot��������Щ�������������ָ�ꡣ





��liveness�� ̽�벻Ӧ���������ⲿϵͳ�Ľ�����顣���[Ӧ�ó������Ч��״̬](https://springdoc.cn/spring-boot/features.html#features.spring-application.application-availability.liveness)���ƻ���Kubernetes�᳢��ͨ����������Ӧ�ó���ʵ�������������⡣����ζ�ţ����һ���ⲿϵͳ�������ݿ⡢Web API���ⲿ���棩���ֹ��ϣ�Kubernetes���ܻ�������������Ӧ�ó���ʵ�����������������ϡ�





���� ��readiness�� ̽�⣬����ⲿϵͳ��ѡ�������Ӧ�ó��򿪷���Ա�����������������ԭ��Spring Boot��׼��״̬̽���в������κζ���Ľ�����顣���[Ӧ�ó���ʵ����readiness state��unready](https://springdoc.cn/spring-boot/features.html#features.spring-application.application-availability.readiness)��Kubernetes�Ͳ��Ὣ����·�ɵ���ʵ����һЩ�ⲿϵͳ���ܲ���Ӧ��ʵ������������������£����ǿ��Ա�������׼��״̬̽���С������ⲿϵͳ���ܲ���Ӧ�ó���Ĺؼ���Ӧ�ó�������ж�·���ͻ��ˣ�������������£����Ǿ��Բ�Ӧ�ñ��������ڡ����ҵ��ǣ�һ��������Ӧ��ʵ��������ⲿϵͳ�ܳ���������������жϡ�����������׼������̽���У����������ⲿ����������ʱ��Ӧ�ó���ᱻֹͣ���񣬻��߲����������������ջ�и��߲�εĹ��ϣ�Ҳ��ͨ���ڵ�������ʹ�ö�·����





|  | ���һ��Ӧ�ó��������ʵ����û��׼���ã�`type=ClusterIP` �� `NodePort` ��Kubernetes���񲻽����κδ������ӡ�û��HTTP������Ӧ��503�ȣ�����Ϊû�����ӡ�`type=LoadBalancer` �ķ�����ܽ���Ҳ���ܲ��������ӣ���ȡ�����ṩ�ߡ�һ������ȷ [ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) �ķ���Ҳ����һ��ȡ����ʵ�ֵķ�ʽ������Ӧ��?��ڷ�������������δ����������ε� ��connection refused�����ڸ��ؾ���������ڵ�����£�HTTP 503�Ǻ��п��ܵġ� |
| --- | --- |





���⣬���һ��Ӧ�ó���ʹ�� Kubernetes [autoscaling](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)�������ܻ��Ӧ�ó��򱻴Ӹ���ƽ������ȡ��������ͬ�ķ�Ӧ����ȡ������autoscaler�����á�







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.kubernetes-probes.lifecycle)2.9.2\. Ӧ�ó����������ں�̽��״̬



Kubernetes Probes֧�ֵ�һ����Ҫ����������Ӧ�ó����������ڵ�һ���ԡ� `AvailabilityState`����Ӧ�ó�����ڴ��ڲ�״̬����ʵ�ʵ�̽�루��¶��״̬��֮����������������� ��ʵ�ʵ�̽�루��¶�˸�״̬��֮���кܴ������ ����Ӧ�ó����������ڵĲ�ͬ�׶Σ�̽������޷�ʹ�á�





Spring Boot��[�����͹ر��ڼ䷢��application event](https://springdoc.cn/spring-boot/features.html#features.spring-application.application-events-and-listeners)��̽����Լ�����Щ�¼�����¶�� `AvailabilityState` ��Ϣ��





�±���ʾ�˲�ͬ�׶ε� `AvailabilityState` ��HTTP connector��״̬��





��һ��Spring BootӦ�ó�������ʱ��



<colgroup><col><col><col><col><col></colgroup>
| �����׶� | LivenessState | ReadinessState | HTTP server | ��ע |
| --- | --- | --- | --- | --- |
| Starting | `BROKEN` | `REFUSING_TRAFFIC` | δ���� | Kubernetes��� "liveness" ̽�룬���ʱ�����������������Ӧ�ó��� |
| Started | `CORRECT` | `REFUSING_TRAFFIC` | �ܾ����� | Ӧ�ó��������ı�ˢ�¡�Ӧ�ó���ִ���������񣬻�û���յ������� |
| Ready | `CORRECT` | `ACCEPTING_TRAFFIC` | �������� | ���������Ѿ���ɡ���Ӧ�ó������ڽ��������� |



��һ��Spring BootӦ�ó���ر�ʱ��



<colgroup><col><col><col><col><col></colgroup>
| ͣ���׶� | Liveness State | Readiness State | HTTP server | ��ע |
| --- | --- | --- | --- | --- |
| Running | `CORRECT` | `ACCEPTING_TRAFFIC` | �������� | ��Ҫ��رա� |
| Graceful shutdown | `CORRECT` | `REFUSING_TRAFFIC` | �µ����󱻾ܾ� | ������ã� [���Źػ��ᴦ�������С�������](https://springdoc.cn/spring-boot/web.html#web.graceful-shutdown)�� |
| Shutdown complete | N/A | N/A | ���������ر� | Ӧ�ó��������ı��رգ�Ӧ�ó��򱻹رա� |



|  | ����Kubernetes����ĸ�����Ϣ����μ�[Kubernetes������������](https://springdoc.cn/spring-boot/deployment.html#deployment.cloud.kubernetes.container-lifecycle)���֡� |
| --- | --- |









### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.info)2.10\. Ӧ����Ϣ



Ӧ�ó�����Ϣ�����˴���� `ApplicationContext` �ж�������� [`InfoContributor`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/info/InfoContributor.java) Bean�ռ��ĸ�����Ϣ�� Spring Boot����һЩ�Զ����õ� `InfoContributor` Bean����Ҳ���Ա�д�Լ��ġ�





#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.info.auto-configured-info-contributors)2.10.1\. �Զ����õ� InfoContributor



���ʵ���ʱ��Spring���Զ��������� `InfoContributor` Bean��



<colgroup><col><col><col><col></colgroup>
| ID | Name | ˵�� | ǰ������ |
| --- | --- | --- | --- |
| `build` | [`BuildInfoContributor`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/info/BuildInfoContributor.java) | ��¶�˹�����Ϣ�� | һ�� `META-INF/build-info.properties` ��Դ�� |
| `env` | [`EnvironmentInfoContributor`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/info/EnvironmentInfoContributor.java) | ��¶ `Environment` �������� `info.` ��ͷ���κ����ԡ� | None. |
| `git` | [`GitInfoContributor`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/info/GitInfoContributor.java) | ��¶��git��Ϣ�� | һ�� `git.properties` ��Դ�� |
| `java` | [`JavaInfoContributor`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/info/JavaInfoContributor.java) | ��¶Java����ʱ��Runtime����Ϣ�� | None. |
| `os` | [`OsInfoContributor`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/info/OsInfoContributor.java) | ��¶����ϵͳ��Ϣ�� | None. |



���˹����ߣ�contributor���Ƿ����������� `management.info.<id>.enabled` ���Կ��ơ� ��ͬ��contributor����������в�ͬ��Ĭ��ֵ����ȡ�������ǵ��Ⱦ���������������¶����Ϣ�����ʡ�





����û���Ⱦ�������������Ӧ�ñ����ã�`env`��`java` �� `os` contributor Ĭ���ǽ��õġ� ����ͨ������ `management.info.<id>.enabled` ����Ϊ `true` ���������ǡ�





`build` �� `git` ��ϢcontributorĬ�������õġ� ����ͨ������ `management.info.<id>.enabled` ��������Ϊ `false` �����á� ���⣬Ҫ����ÿһ��Ĭ�����õ�contributor���뽫 `management.info.defaults.enabled` ������Ϊ `false`��







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.info.custom-application-information)2.10.2\. �Զ���Ӧ����Ϣ��Application Information��



�� `env` contributor ������ʱ�������ͨ������ `info.*` Spring���������� `info` �˵�����¶�����ݡ� `info` key�µ����� `Environment` ���Զ����Զ���¶�� ���磬���������� `application.properties` �ļ�������������á�







Properties

Yaml





```
info.app.encoding=UTF-8
info.app.java.source=17
info.app.java.target=17

```







|  | ����Ӳ������Щֵ���㻹���� [�ڹ���ʱ��չ��Ϣ����](https://springdoc.cn/spring-boot/howto.html#howto.properties-and-configuration.expand-properties)��������ʹ��Maven������Խ�ǰ������Ӹ�д���¡�PropertiesYaml```info.app.encoding=@project.build.sourceEncoding@info.app.java.source=@java.version@info.app.java.target=@java.version@``` |
| --- | --- |







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.info.git-commit-information)2.10.3\. Git Commit ��Ϣ



`info` �˵����һ�����õĹ��������ܹ������������ `git` Դ���������Ŀ����ʱ��״̬����Ϣ�� �����һ�� `GitProperties` bean�������ʹ�� `info` �˵���������Щ���ԡ�





|  | ���classpath�ĸ����� `git.properties` �ļ���`GitProperties` Bean�ͻᱻ�Զ����á�����ϸ�ڼ� "[�������git��Ϣ](https://springdoc.cn/spring-boot/howto.html#howto.build.generate-git-info)"�� |
| --- | --- |





Ĭ������£��˵�ᱩ¶ `git.branch`��`git.commit.id` �� `git.commit.time` ���ԣ�������ڣ��� ����㲻������Щ���Գ����ڶ˵���Ӧ�У���Ҫ�� `git.properties` �ļ����ų����ǡ� ���������ʾ������git��Ϣ���� `git.properties` ��ȫ�����ݣ���ʹ�� `management.info.git.mode` ���ԣ�������ʾ��







Properties

Yaml





```
management.info.git.mode=full

```







Ҫ�� `info` �˵���ȫ����git�ύ��Ϣ���� `management.info.git.enabled` ������Ϊ `false`��������ʾ��







Properties

Yaml





```
management.info.git.enabled=false

```









#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.info.build-information)2.10.4\. ������Ϣ



��� `BuildProperties` Bean�ǿ��õģ�`info` �˵�Ҳ���Է���������Ĺ�����Ϣ�����classpath�е� `META-INF/build-info.properties` �ļ����ã��ͻᷢ�����������





|  | Maven��Gradle������������ɸ��ļ������ "[������ɹ�����Ϣ](https://springdoc.cn/spring-boot/howto.html#howto.build.generate-info)"�� |
| --- | --- |







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.info.java-information)2.10.5\. Java��Ϣ



`info` �˵㷢���˹������Java���л�������Ϣ������ϸ�ڼ� [`JavaInfo`](https://docs.spring.io/spring-boot/docs/3.1.0-SNAPSHOT/api/org/springframework/boot/info/JavaInfo.html)��







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.info.os-information)2.10.6\. ����ϵͳ��OS����Ϣ



`info` �˵㷢��������Ĳ���ϵͳ����Ϣ������ϸ�ڼ� [`OsInfo`](https://docs.spring.io/spring-boot/docs/3.1.0-SNAPSHOT/api/org/springframework/boot/info/OsInfo.html)`��







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.info.writing-custom-info-contributors)2.10.7\. ��д�Զ��� InfoContributor



Ϊ���ṩ�Զ����Ӧ�ó�����Ϣ�������ע��ʵ�� [`InfoContributor`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/info/InfoContributor.java) �ӿڵ�Spring Bean��





��������ӹ�����һ��ֻ��һ��ֵ�� `example` ��Ŀ��







Java

Kotlin





```
@Component
public class MyInfoContributor implements InfoContributor {

    @Override
    public void contribute(Info.Builder builder) {
        builder.withDetail("example", Collections.singletonMap("key", "value"));
    }

}

```







��������� `info` �˵㣬��Ӧ�ÿ���һ���������¶�����Ŀ����Ӧ��







```
{
    "example": {
        "key" : "value"
    }
}
```















## [](https://springdoc.cn/spring-boot/actuator.html#actuator.monitoring)3\. ͨ��HTTP���м�غ͹���





��������ڿ���һ��WebӦ�ó���Spring Boot Actuator���Զ������������õĶ˵㣬ʹ��ͨ��HTTP������ Ĭ�ϵĹ�����ʹ�ö˵�� `id` �� `/actuator` ��ǰ׺��ΪURL·���� ���磬`health` �� `/actuator/health` ����ʽ������





|  | Actuator ֧�� Spring MVC��Spring WebFlux��Jersey�� ���Jersey��Spring MVC�����ã����ʹ��Spring MVC�� |
| --- | --- |





|  | Ϊ�˻��API�ĵ��� [HTML](https://docs.spring.io/spring-boot/docs/3.1.0-SNAPSHOT/actuator-api/htmlsingle) �� [PDF](https://docs.spring.io/spring-boot/docs/3.1.0-SNAPSHOT/actuator-api/pdf/spring-boot-actuator-web-api.pdf) ���м��ص���ȷ��JSON��Ӧ��Jackson��һ����Ҫ�������� |
| --- | --- |





### [](https://springdoc.cn/spring-boot/actuator.html#actuator.monitoring.customizing-management-server-context-path)3.1\. ���ƹ���˵�·��



��ʱ��Ϊ����˵㶨��ǰ׺�Ǻ����õġ� ���磬���Ӧ�ó�������Ѿ��� `/actuator` ��������Ŀ�ġ� �����ʹ�� `management.endpoints.web.base-path` �������ı����˵��ǰ׺���������������ʾ��







Properties

Yaml





```
management.endpoints.web.base-path=/manage

```







ǰ��� `application.properties` ���ӽ��˵�� `/actuator/{id}` ��Ϊ `/manage/{id}` �����磬`/manage/info`����





|  | ���ǹ���˿ڱ�����Ϊ[ʹ�ò�ͬ��HTTP�˿�](https://springdoc.cn/spring-boot/actuator.html#actuator.monitoring.customizing-management-server-port)����¶�˵㣬���� `management.endpoints.web.base-path` ������� `server.servlet.context-path` ������Servlet WebӦ�ã��� `spring.webflux.base-path` ������reactive WebӦ�ã������������ `management.server.port`�� `management.endpoints.web.base-path` ������� `management.server.base-path` �ġ� |
| --- | --- |





�������Ѷ˵�ӳ�䵽��ͬ��·���������ʹ�� `management.endpoints.web.path-mapping` ���ԡ�





��������ӽ� `/actuator/health` ����ӳ��Ϊ `/healthcheck`��







Properties

Yaml





```
management.endpoints.web.base-path=/
management.endpoints.web.path-mapping.health=healthcheck

```









### [](https://springdoc.cn/spring-boot/actuator.html#actuator.monitoring.customizing-management-server-port)3.2\. ���ƹ���������˿�



���ڻ����ƵĲ�����˵��ͨ��ʹ��Ĭ�ϵ�HTTP�˿�����¶����˵���һ�����ǵ�ѡ�� Ȼ����������Ӧ�ó��������Լ����������������У�����ܸ�ϲ��ʹ�ò�ͬ��HTTP�˿�����¶�˵㡣





��������� `management.server.port` �������ı�HTTP�˿ڣ��������������ʾ��







Properties

Yaml





```
management.server.port=8081

```







|  | �� Cloud Foundry �ϣ�Ĭ������£�Ӧ�ó�����ڶ˿� 8080 �Ͻ��� HTTP �� TCP ·�ɵ����� ��������� Cloud Foundry ��ʹ���Զ������˿ڣ�����Ҫ��ȷ����Ӧ�ó����·���Խ�����ת�����Զ���˿ڡ� |
| --- | --- |







### [](https://springdoc.cn/spring-boot/actuator.html#actuator.monitoring.management-specific-ssl)3.3\. �������Management���������SSL



������Ϊʹ���Զ���˿�ʱ����Ҳ����ͨ��ʹ�ø��� `management.server.ssl.*` ���������ù����������SSL�� ���磬�����������ù��������ͨ��HTTP�ṩ���񣬶���Ӧ�ó���ʹ��HTTPS������������������ʾ��







Properties

Yaml





```
server.port=8443
server.ssl.enabled=true
server.ssl.key-store=classpath:store.jks
server.ssl.key-password=secret
management.server.port=8080
management.server.ssl.enabled=false

```







���ߣ����������͹��������������ʹ��SSL����ʹ�ò�ͬ����Կ�洢��������ʾ��







Properties

Yaml





```
server.port=8443
server.ssl.enabled=true
server.ssl.key-store=classpath:main.jks
server.ssl.key-password=secret
management.server.port=8080
management.server.ssl.enabled=true
management.server.ssl.key-store=classpath:management.jks
management.server.ssl.key-password=secret

```









### [](https://springdoc.cn/spring-boot/actuator.html#actuator.monitoring.customizing-management-server-address)3.4\. ����Management��������������ַ



�����ͨ������ `management.server.address` �������ƹ���˵�Ŀ��õ�ַ�� �������ֻ���ڲ���������ά�������ϼ���������ֻ�������� `localhost` �����ӣ�������������á�





|  | ֻ�е��˿������������˿ڲ�ͬʱ��������ڲ�ͬ�ĵ�ַ�Ͻ��м����� |
| --- | --- |





��������� `application.properties` ������Զ�̹������ӡ�







Properties

Yaml





```
management.server.port=8081
management.server.address=127.0.0.1

```









### [](https://springdoc.cn/spring-boot/actuator.html#actuator.monitoring.disabling-http-endpoints)3.5\. ����HTTP�˵�



����㲻��ͨ��HTTP��¶�˵㣬����԰ѹ���˿�����Ϊ `-1`����������ʾ��







Properties

Yaml





```
management.server.port=-1

```







��Ҳ����ͨ��ʹ�� `management.endpoints.web.exposure.exclude` ������ʵ�֣���������ʾ��







Properties

Yaml





```
management.endpoints.web.exposure.exclude=*

```













## [](https://springdoc.cn/spring-boot/actuator.html#actuator.jmx)4\. ͨ��JMX���м�غ͹���





Java������չ��JMX���ṩ��һ����׼�Ļ�������غ͹���Ӧ�ó��� Ĭ������£��ù���δ�����á� �����ͨ������ `spring.jmx.enabled` ��������Ϊ `true` �������� Spring Boot������ʵ� `MBeanServer` ��ΪIDΪ `mbeanServer` ��Bean������ ����κδ���Spring JMXע���Bean��`@ManagedResource`��`@ManagedAttribute` �� `@ManagedOperation`�����ᱩ¶������





������ƽ̨�ṩ��һ����׼�� `MBeanServer` ��Spring Boot��ʹ���������ڱ�ҪʱĬ��ΪVM `MBeanServer`�� ���������Щ��ʧ���ˣ��ͻᴴ��һ���µ� `MBeanServer`��





����ϸ�ڼ� [`JmxAutoConfiguration`](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/jmx/JmxAutoConfiguration.java) �ࡣ





Ĭ������£�Spring BootҲ������˵���ΪJMX MBeans�� `org.springframework.boot` ���¹����� Ҫ��ȫ����JMX���еĶ˵�ע�ᣬ���Կ���ע�����Լ��� `EndpointObjectNameFactory` ʵ�֡�





### [](https://springdoc.cn/spring-boot/actuator.html#actuator.jmx.custom-mbean-names)4.1\. �Զ���MBean����



MBean������ͨ���ɶ˵�� `id` ���ɡ� ���磬 `health` �˵㱻��¶Ϊ `org.springframework.boot:type=Endpoint,name=Health`��





������Ӧ�ó������һ�����ϵ�Spring `ApplicationContext`������ܻᷢ�����ַ�����ͻ�� Ϊ�˽��������⣬����Խ� `spring.jmx.unique-names` ��������Ϊ `true`������MBean�����־�����Ψһ�ġ�





�㻹�����Զ��屩¶�˵��JMX�� �����������ʾ���� `application.properties` ����������һ�����ӡ�







Properties

Yaml





```
spring.jmx.unique-names=true
management.endpoints.jmx.domain=com.example.myapp

```









### [](https://springdoc.cn/spring-boot/actuator.html#actuator.jmx.disable-jmx-endpoints)4.2\. ����JMX�˵�



����㲻��ͨ��JMX��¶�˵㣬����԰� `management.endpoints.jmx.exposure.exclude` ��������Ϊ `*`����������ʾ��







Properties

Yaml





```
management.endpoints.jmx.exposure.exclude=*

```













## [](https://springdoc.cn/spring-boot/actuator.html#actuator.observability)5\. �ɹ۲��ԣ�Observability��





�ɹ۲�����ָ���ⲿ�۲�һ�������е�ϵͳ���ڲ�״̬����������������֧����ɣ���־�������͸��١�





���ڶ����͸��٣�Spring Bootʹ�� [Micrometer Observation](https://micrometer.io/docs/observation)��Ҫ�������Լ��Ĺ۲죨�⽫���¶����͸��٣��������ע��һ�� `ObservationRegistry`��







```
@Component
public class MyCustomObservation {

    private final ObservationRegistry observationRegistry;

    public MyCustomObservation(ObservationRegistry observationRegistry) {
        this.observationRegistry = observationRegistry;
    }

    public void doSomething() {
        Observation.createNotStarted("doSomething", this.observationRegistry)
                .lowCardinalityKeyValue("locale", "en-US")
                .highCardinalityKeyValue("userId", "42")
                .observe(() -> {
                    // Execute business logic here
                });
    }

}

```







|  | �Ϳ��ȵı�ǩ������ӵ�ָ���׷���У����߿��ȵı�ǩ��ֻ����ӵ�׷���С� |
| --- | --- |





`ObservationPredicate`��`GlobalObservationConvention` �� `ObservationHandler` ���͵� Bean �����Զ�ע�ᵽ `ObservationRegistry` �ϡ����������ע������������ `ObservationRegistryCustomizer` Bean����һ������ע���





����ϸ����� [Micrometer Observation �ĵ�](https://micrometer.io/docs/observation)��





|  | JDBC��R2DBC�Ŀɹ۲��ԣ�Observability������ʹ�õ�������Ŀ�������á����� JDBC�� [Datasource Micrometer ��Ŀ](https://github.com/jdbc-observations/datasource-micrometer) �ṩ��һ�� Spring Boot Starter���ڵ���JDBC����ʱ�Զ������۲졣�� [�ο��ĵ�](https://jdbc-observations.github.io/datasource-micrometer/docs/current/docs/html/)���Ķ��������������Ϣ������R2DBC�� [R2DBC�۲��Spring Boot�Զ�����](https://github.com/spring-projects-experimental/r2dbc-micrometer-spring-boot) ����ΪR2DBC��ѯ���ô����۲졣 |
| --- | --- |





���������½ڽ��ṩ������־��ָ���׷�ٵĸ���ϸ�ڡ�









## [](https://springdoc.cn/spring-boot/actuator.html#actuator.loggers)6\. ��־��¼����Logger��





Spring Boot Actuator����������ʱ�鿴������Ӧ�ó������־����Ĺ��ܡ� ����Բ鿴�����б�򵥸���־��¼�������ã�������ȷ���õ���־�����Լ���־��ܸ���������Ч��־������ɡ� ��Щ�������������֮һ��





*   `TRACE`

*   `DEBUG`

*   `INFO`

*   `WARN`

*   `ERROR`

*   `FATAL`

*   `OFF`

*   `null`





`null` ��ʾû����ȷ�����á�





### [](https://springdoc.cn/spring-boot/actuator.html#actuator.loggers.configure)6.1\. ����һ�� Logger



Ҫ����һ�������ļ�¼����`POST` һ������ʵ�嵽��Դ��URI���������������ʾ��







```
{
    "configuredLevel": "DEBUG"
}
```







|  | Ҫ ��reset�� �����ã���¼�����ض����𣨲�ʹ��Ĭ�����ã�������Դ���һ�� `null` ��ֵ��Ϊ `configuredLevel`�� |
| --- | --- |











## [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics)7\. ָ�꣨Metrics��





Spring Boot ActuatorΪ [Micrometer](https://micrometer.io/) �ṩ������������Զ����ã�Micrometer��һ��֧�� [�ڶ���ϵͳ](https://micrometer.io/docs) ��Ӧ�ó���ָ��ӿڣ�������





*   [AppOptics](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.appoptics)

*   [Atlas](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.atlas)

*   [Datadog](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.datadog)

*   [Dynatrace](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.dynatrace)

*   [Elastic](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.elastic)

*   [Ganglia](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.ganglia)

*   [Graphite](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.graphite)

*   [Humio](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.humio)

*   [Influx](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.influx)

*   [JMX](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.jmx)

*   [KairosDB](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.kairos)

*   [New Relic](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.newrelic)

*   [OpenTelemetry](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.otlp)

*   [Prometheus](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.prometheus)

*   [SignalFx](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.signalfx)

*   [Simple (in-memory)](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.simple)

*   [Stackdriver](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.stackdriver)

*   [StatsD](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.statsd)

*   [Wavefront](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.wavefront)





|  | Ҫ�˽�������Micrometer�Ĺ��ܣ���μ��� [�ο��ĵ�](https://micrometer.io/docs)���ر��� [�����](https://micrometer.io/docs/concepts)�� |
| --- | --- |





### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.getting-started)7.1\. ����



Spring Boot���Զ�����һ�����ϵ� `MeterRegistry`����Ϊ����classpath�Ϸ��ֵ�ÿ��֧�ֵ�ʵ�����һ��ע��� ���������ʱclasspath���ж� `micrometer-registry-{system}` ��������������Spring Boot����ע����ˡ�





�����ע����й�ͬ���ص㡣 ���磬��ʹ Micrometer ע����ʵ����classpath�ϣ���Ҳ���Խ���һ���ض���ע��� ��������ӽ�����Datadog��







Properties

Yaml





```
management.datadog.metrics.export.enabled=false

```







��Ҳ���Խ������е�ע�������ע����ض���������˵������������ʾ��







Properties

Yaml





```
management.defaults.metrics.export.enabled=false

```







Spring Boot�����κ��Զ����õ�ע�����ӵ� `Metrics` ���ϵ�ȫ�־�̬����ע�����������ȷ��������Ҫ��������







Properties

Yaml





```
management.metrics.use-global-registry=false

```







�����ע������������ `MeterRegistryCustomizer` Bean����һ������ע����������κα�ע��֮ǰӦ����ͨ��ǩ��







Java

Kotlin





```
@Configuration(proxyBeanMethods = false)
public class MyMeterRegistryConfiguration {

    @Bean
    public MeterRegistryCustomizer<MeterRegistry> metricsCommonTags() {
        return (registry) -> registry.config().commonTags("region", "us-east-1");
    }

}

```







�����ͨ��������ķ��ͽ�����Ӧ�����ض���ע���ʵ�֡�







Java

Kotlin





```
@Configuration(proxyBeanMethods = false)
public class MyMeterRegistryConfiguration {

    @Bean
    public MeterRegistryCustomizer<GraphiteMeterRegistry> graphiteMetricsNamingConvention() {
        return (registry) -> registry.config().namingConvention(this::name);
    }

    private String name(String name, Meter.Type type, String baseUnit) {
        return ...
    }

}

```







Spring Boot�� [���������� instrumentation](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.supported)�������ͨ�����û�ר��ע���������ơ�







### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export)7.2\. ֧�ֵļ��ϵͳ



���ڼ�Ҫ����ÿ��֧�ֵļ��ϵͳ��





#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.appoptics)7.2.1\. AppOptics



Ĭ������£�AppOpticsע�����Ļᶨ�ڽ�ָ�����͵� `[api.appoptics.com/v1/measurements](https://api.appoptics.com/v1/measurements)`��Ҫ��ָ�굼���� SaaS [AppOptics](https://micrometer.io/docs/registry/appOptics)�������ṩ���API���ơ�







Properties

Yaml





```
management.appoptics.metrics.export.api-token=YOUR_TOKEN

```









#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.atlas)7.2.2\. Atlas



Ĭ������£�ָ��ᱻ�������������㱾�ػ����ϵ� [Atlas](https://micrometer.io/docs/registry/atlas)��������ṩ [Atlas server](https://github.com/Netflix/atlas) ��λ�á�







Properties

Yaml





```
management.atlas.metrics.export.uri=https://atlas.example.com:7101/api/v1/publish

```









#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.datadog)7.2.3\. Datadog



һ��Datadogע�����Ļᶨ�ڽ�ָ�����͵� [datadoghq](https://www.datadoghq.com/)�� Ҫ����ָ�굽 [Datadog](https://micrometer.io/docs/registry/datadog)��������ṩ���API��Կ��







Properties

Yaml





```
management.datadog.metrics.export.api-key=YOUR_KEY

```







����������ṩһ��Ӧ����Կ����ѡ������ôԪ���ݣ����Ǳ����������ͺͻ�����λҲ����������







Properties

Yaml





```
management.datadog.metrics.export.api-key=YOUR_API_KEY
management.datadog.metrics.export.application-key=YOUR_APPLICATION_KEY

```







Ĭ������£�ָ�걻���͵�Datadog���� [site](https://docs.datadoghq.com/getting_started/site) ��`[api.datadoghq.com](https://api.datadoghq.com/)`���� ������Datadog��Ŀ�й���������վ�ϣ���������Ҫͨ��������ָ�꣬����Ӧ����URI��







Properties

Yaml





```
management.datadog.metrics.export.uri=https://api.datadoghq.eu

```







�㻹���Ըı���Datadog����ָ���ʱ������







Properties

Yaml





```
management.datadog.metrics.export.step=30s

```









#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.dynatrace)7.2.4\. Dynatrace



Dynatrace�ṩ������ָ����ȡAPI������Ϊ [Micrometer](https://micrometer.io/docs/registry/dynatrace) ʵ�ֵġ�������� [����](https://www.dynatrace.com/support/help/how-to-use-dynatrace/metrics/metric-ingestion/ingestion-methods/micrometer) �ҵ�Dynatrace����Micrometerָ��������ĵ���`v1` �����ռ��е���������ֻ�����ڵ����� [Timeseries v1 API](https://www.dynatrace.com/support/help/dynatrace-api/environment-api/metric-v1/) ʱ��`v2` �����ռ��е���������ֻ�����ڵ����� [Metrics v2 API](https://www.dynatrace.com/support/help/dynatrace-api/environment-api/metric-v2/post-ingest-metrics/) ʱ����ע�⣬�ü���ÿ��ֻ�ܵ�����API�� `v1` �� `v2` �汾��`v2` �汾����ѡ����� `device-id`��v1����Ҫ������v2���в�ʹ�ã��� `v1` �������ռ��б����ã���ômetric���������� `v1` ��˵㡣���򣬾ͼٶ��� `v2` �汾��





##### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.dynatrace.v2-api)v2 API



�����ͨ�����ַ�ʽʹ��v2 API��





###### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.dynatrace.v2-api.auto-config)�Զ�����



Dynatrace�Զ�������������OneAgent��Dynatrace Operator for Kubernetes��ص�������





**����OneAgent��**�������������OneAgent��ָ����Զ������ [local OneAgent ingest endpoint](https://www.dynatrace.com/support/help/how-to-use-dynatrace/metrics/metric-ingestion/ingestion-methods/local-api/) �� ��ȡ�˵㽫ָ��ת����Dynatrace��ˡ�





**Dynatrace Kubernetes Operator��**�ڰ�װ��Dynatrace Operator��Kubernetes������ʱ��ע����Զ��Ӳ���Ա�����ȡ��Ķ˵�URI��API���ơ�





����Ĭ����Ϊ���������� `io.micrometer:micrometer-registry-dynatrace` ֮�⣬����Ҫ�ر�����á�







###### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.dynatrace.v2-api.manual-config)�ֶ�����



���û���Զ����ã�����Ҫ [Metrics v2 API](https://www.dynatrace.com/support/help/dynatrace-api/environment-api/metric-v2/post-ingest-metrics/) �Ķ˵��һ�� API ���ơ�API���Ʊ����� ��Ingest metrics�� ��`metrics.ingest`����Ȩ�����á����ǽ��齫���Ƶķ�Χ��������һ��Ȩ���ϡ������ȷ���˵�URI����·�������磬`/api/v2/metrics/ingest`����





Metrics API v2��ȡ�˵��URL������Ĳ���ѡ�����ͬ��





*   SaaS: `https://{your-environment-id}.live.dynatrace.com/api/v2/metrics/ingest`

*   Managed deployments: `https://{your-domain}/e/{your-environment-id}/api/v2/metrics/ingest`





������������� `example` environment id ���ö���ֵ������







Properties

Yaml





```
management.dynatrace.metrics.export.uri=https://example.live.dynatrace.com/api/v2/metrics/ingest
management.dynatrace.metrics.export.api-token=YOUR_TOKEN

```







��ʹ��Dynatrace v2 APIʱ������ʹ�����¿�ѡ���ܣ�����ϸ�ڿ��� [Dynatrace�ĵ�](https://www.dynatrace.com/support/help/how-to-use-dynatrace/metrics/metric-ingestion/ingestion-methods/micrometer#dt-configuration-properties) ���ҵ�����





*   Metric key ��ǰ׺������һ��ǰ׺����ǰ׺������ӵ����е�����metric key�С�

*   ��DynatraceԪ��������ʵ�����OneAgent��Dynatrace����Ա�������У��ö����Ԫ���ݣ����磬�������������̻�Pod�����ḻָ�ꡣ

*   Ĭ��ά�ȡ�ָ����ӵ����е��������ļ�ֵ�ԡ� �����Micrometerָ���˾�����ͬ���ı�ǩ�����ǽ�����Ĭ��dimension��

*   ʹ��Dynatrace Summary instrument����ĳЩ����£�Micrometer Dynatraceע�������ָ�걻�ܾ��� ��Micrometer 1.9.x�У�ͨ������Dynatrace�ض���ժҪ���������������⡣ �������������Ϊ `false` ����ʹMicrometer�ص�1.9.x֮ǰ��Ĭ����Ϊ�� ֻ���ڴ�Micrometer 1.8.xǨ�Ƶ�1.9.xʱ��������ʱ�ſ���ʹ�á�





���Բ�ָ��URI��API���ƣ�������������ʾ�� ����������£���ʹ���Զ����õĶ˵㡣







Properties

Yaml





```
management.dynatrace.metrics.export.v2.metric-key-prefix=your.key.prefix
management.dynatrace.metrics.export.v2.enrich-with-dynatrace-metadata=true
management.dynatrace.metrics.export.v2.default-dimensions.key1=value1
management.dynatrace.metrics.export.v2.default-dimensions.key2=value2
management.dynatrace.metrics.export.v2.use-dynatrace-summary-instruments=true

```











##### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.dynatrace.v1-api)v1 API (Legacy)



Dynatrace v1 APIָ��ע���ͨ��ʹ�� [Timeseries v1 API](https://www.dynatrace.com/support/help/dynatrace-api/environment-api/metric-v1/) ���ڽ�ָ�����͵����õ�URI�� Ϊ�����������е����ã��� `device-id` ������ʱ��v1��Ҫ������v2�в�ʹ�ã���ָ�걻������Timeseries v1�˵㡣 Ҫ�� [Dynatrace](https://micrometer.io/docs/registry/dynatrace) ����ָ�꣬�����ṩ���API���ơ��豸ID��URI��







Properties

Yaml





```
management.dynatrace.metrics.export.uri=https://{your-environment-id}.live.dynatrace.com
management.dynatrace.metrics.export.api-token=YOUR_TOKEN
management.dynatrace.metrics.export.v1.device-id=YOUR_DEVICE_ID

```







����v1��API�������ָ����������URI������ָ��·������Ϊv1��Ķ˵�·�����Զ���ӡ�







##### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.dynatrace.version-independent-settings)��汾�޹ص�����



����API�˵�������⣬�㻹���Ըı���Dynatrace����ָ��ļ��ʱ�䡣 Ĭ�ϵĵ���ʱ������ `60s`�� ��������ӽ�����ʱ��������Ϊ30�롣







Properties

Yaml





```
management.dynatrace.metrics.export.step=30s

```







������� [Micrometer�ĵ�](https://micrometer.io/docs/registry/dynatrace) �� [Dynatrace�ĵ�](https://www.dynatrace.com/support/help/how-to-use-dynatrace/metrics/metric-ingestion/ingestion-methods/micrometer) ���ҵ��������ΪMicrometer����Dynatrace exporter�����������ĸ�����Ϣ��









#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.elastic)7.2.5\. Elastic



Ĭ������£�ָ�걻�������������㱾�ػ����ϵ� [Elastic](https://micrometer.io/docs/registry/elastic) �� �����ͨ��ʹ�����������ṩҪʹ�õ�Elastic��������λ�á�







Properties

Yaml





```
management.elastic.metrics.export.host=https://elastic.example.com:8086

```









#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.ganglia)7.2.6\. Ganglia



Ĭ������£�ָ�걻�������������㱾�ػ����ϵ� [Ganglia](https://micrometer.io/docs/registry/ganglia) ��������ṩ [Ganglia server](http://ganglia.sourceforge.net/) �������Ͷ˿ڣ���������ʾ��







Properties

Yaml





```
management.ganglia.metrics.export.host=ganglia.example.com
management.ganglia.metrics.export.port=9649

```









#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.graphite)7.2.7\. Graphite



Ĭ������£�ָ��ᱻ�������������㱾�ػ����ϵ� [Graphite](https://micrometer.io/docs/registry/graphite) ��������ṩ [Graphite server](https://graphiteapp.org/) �������Ͷ˿ڣ���������ʾ��







Properties

Yaml





```
management.graphite.metrics.export.host=graphite.example.com
management.graphite.metrics.export.port=9004

```







Micrometer�ṩ��һ��Ĭ�ϵ� `HierarchicalNameMapper`������dimensional meter ID���https://micrometer.io/docs/registry/graphite#_hierarchical_name_mapping[ӳ�䵽 flat hierarchical name]��





|  | Ҫ����������Ϊ���붨����� `GraphiteMeterRegistry` ���ṩ���Լ��� `HierarchicalNameMapper`�� �������Լ����壬������ṩһ���Զ����õ� `GraphiteConfig` �� `Clock` Bean��JavaKotlin```@Configuration(proxyBeanMethods = false)public class MyGraphiteConfiguration {    @Bean    public GraphiteMeterRegistry graphiteMeterRegistry(GraphiteConfig config, Clock clock) {        return new GraphiteMeterRegistry(config, clock, this::toHierarchicalName);    }    private String toHierarchicalName(Meter.Id id, NamingConvention convention) {        return ...    }}``` |
| --- | --- |







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.humio)7.2.8\. Humio



Ĭ������£�Humioע�����Ļᶨ�ڽ�ָ�����͵� [cloud.humio.com](https://cloud.humio.com/) �� Ҫ��ָ�굼����SaaS [Humio](https://micrometer.io/docs/registry/humio)��������ṩ���API���ơ�







Properties

Yaml





```
management.humio.metrics.export.api-token=YOUR_TOKEN

```







�㻹Ӧ������һ��������ǩ����ȷ������ָ�������Դ��







Properties

Yaml





```
management.humio.metrics.export.tags.alpha=a
management.humio.metrics.export.tags.bravo=b

```









#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.influx)7.2.9\. Influx



Ĭ������£�ָ��ᱻ�����������ڱ��ػ����ϵ� [Influx](https://micrometer.io/docs/registry/influx) v1ʵ����������Ĭ�����á�Ҫ����ָ�굽InfluxDB v2�������� `org`��`bucket` ������д��ָ���authentication `token`�������ͨ�����·�ʽ�ṩҪʹ�õ� [Influx server](https://www.influxdata.com/) ��λ�á�







Properties

Yaml





```
management.influx.metrics.export.uri=https://influx.example.com:8086

```









#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.jmx)7.2.10\. JMX



Micrometer�ṩ�˶� [JMX](https://micrometer.io/docs/registry/jmx) �ķֲ�ӳ�䣬��Ҫ����Ϊһ�����ۺͿ���ֲ�ķ�ʽ���鿴���صĶ����� Ĭ������£�ָ�걻������ `metrics` JMX�� �����ͨ�����·�ʽ�ṩҪʹ�õ���







Properties

Yaml





```
management.jmx.metrics.export.domain=com.example.app.metrics

```







Micrometer�ṩ��һ��Ĭ�ϵ� `HierarchicalNameMapper`������dimensional meter ID ��� [ӳ�䵽 flat hierarchical name](https://micrometer.io/docs/registry/jmx#_hierarchical_name_mapping)��





|  | Ҫ����������Ϊ���붨����� `JmxMeterRegistry` ���ṩ���Լ��� `HierarchicalNameMapper`�� �������Լ����壬������ṩһ���Զ����õ� `JmxConfig` �� `Clock` Bean��JavaKotlin```@Configuration(proxyBeanMethods = false)public class MyJmxConfiguration {    @Bean    public JmxMeterRegistry jmxMeterRegistry(JmxConfig config, Clock clock) {        return new JmxMeterRegistry(config, clock, this::toHierarchicalName);    }    private String toHierarchicalName(Meter.Id id, NamingConvention convention) {        return ...    }}``` |
| --- | --- |







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.kairos)7.2.11\. KairosDB



Ĭ������£�ָ�걻�������������㱾�ػ����ϵ� [KairosDB](https://micrometer.io/docs/registry/kairos) �������ͨ�����·�ʽ�ṩҪʹ�õ� [KairosDB server](https://kairosdb.github.io/) ��λ�á�







Properties

Yaml





```
management.kairos.metrics.export.uri=https://kairosdb.example.com:8080/api/v1/datapoints

```









#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.newrelic)7.2.12\. New Relic



New Relicע�����Ļᶨ�ڽ�ָ�����͵� [New Relic](https://micrometer.io/docs/registry/new-relic)��Ҫ����ָ�굽 [New Relic](https://newrelic.com/)��������ṩ���API��Կ���˻�ID��







Properties

Yaml





```
management.newrelic.metrics.export.api-key=YOUR_KEY
management.newrelic.metrics.export.account-id=YOUR_ACCOUNT_ID

```







�㻹���Ըı���New Relic����ָ���ʱ������







Properties

Yaml





```
management.newrelic.metrics.export.step=30s

```







Ĭ������£�ָ����ͨ��REST���÷����ģ����������classpath����Java Agent API����Ҳ����ʹ������







Properties

Yaml





```
management.newrelic.metrics.export.client-provider-type=insights-agent

```







��������ͨ���������Լ��� `NewRelicClientProvider` ������ȫ���ơ�







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.otlp)7.2.13\. OpenTelemetry



Ĭ������£�ָ�걻�������������㱾�ػ����ϵ� [OpenTelemetry](https://micrometer.io/docs/registry/otlp) �������ͨ�����·�ʽ�ṩҪʹ�õ� [OpenTelemtry metric endpoint](https://opentelemetry.io/) ��λ�á�







Properties

Yaml





```
management.otlp.metrics.export.url=https://otlp.example.com:4318/v1/metrics

```









#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.prometheus)7.2.14\. Prometheus



[Prometheus](https://micrometer.io/docs/registry/prometheus) ϣ��scrape����ѯ����Ӧ�ó���ʵ����ָ�ꡣSpring Boot�� `/actuator/prometheus` �ṩ��һ��actuator�˵㣬�Ա����ʵ��ĸ�ʽ���� [Prometheus scrape](https://prometheus.io/)��





|  | Ĭ������£��ö˵��ǲ����õģ����뱻��¶������ϸ����μ�[��¶�˵�](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.exposing)�� |
| --- | --- |





��������� `scrape_config` ��ӵ� `prometheus.yml`��







```
scrape_configs:
  - job_name: "spring"
    metrics_path: "/actuator/prometheus"
    static_configs:
      - targets: ["HOST:PORT"]
```







Ҳ֧�� [Prometheus Exemplars](https://prometheus.io/docs/prometheus/latest/feature_flags/#exemplars-storage)��Ҫ����������ܣ�Ӧ����һ�� `SpanContextSupplier` Bean�������ʹ�� [Micrometer Tracing](https://micrometer.io/docs/tracing)���⽫Ϊ���Զ����ã���������룬�����ǿ��Դ����Լ��ġ���鿴 [Prometheus �ĵ�](https://prometheus.io/docs/prometheus/latest/feature_flags/#exemplars-storage) ����Ϊ���������Ҫ��Prometheus�����ȷ���ã�����ֻ֧��ʹ�� [OpenMetrics](https://github.com/OpenObservability/OpenMetrics/blob/v1.0.0/specification/OpenMetrics.md#exemplars) ��ʽ��





���ڶ��ݵĻ����������ҵ�����ܴ��ڵ�ʱ�䲻�������޷�����ȡ�������ʹ�� [Prometheus Pushgateway](https://github.com/prometheus/pushgateway) ֧�֣���ָ�걩¶��Prometheus��Ҫ����Prometheus Pushgateway֧�֣����������Ŀ���������������







```
<dependency>
    <groupId>io.prometheus</groupId>
    simpleclient_pushgateway
</dependency>
```







��Prometheus Pushgateway������������classpath�ϣ����� `management.prometheus.metrics.export.pushgateway.enabled` ���Ա�����Ϊ `true` ʱ��һ�� `PrometheusPushGatewayManager` bean�ͱ��Զ������ˡ� �����������Prometheus Pushgateway����ָ��Ĺ�����





�����ͨ��ʹ�� `management.prometheus.metrics.export.pushgateway` �µ����������� `PrometheusPushGatewayManager`�� ���ڸ߼����ã���Ҳ�����ṩ���Լ��� `PrometheusPushGatewayManager` bean��







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.signalfx)7.2.15\. SignalFx



SignalFxע�����Ļᶨ�ڽ�ָ�����͵� [SignalFx](https://micrometer.io/docs/registry/signalFx)��Ҫ����ָ�굽 [SignalFx](https://www.signalfx.com/)��������ṩ���access token��







Properties

Yaml





```
management.signalfx.metrics.export.access-token=YOUR_ACCESS_TOKEN

```







��Ҳ���Ըı���SignalFx����ָ���ʱ������







Properties

Yaml





```
management.signalfx.metrics.export.step=30s

```









#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.simple)7.2.16\. Simple



Micrometer�ṩ��һ���򵥵ġ��ڴ��еĺ�ˣ����û����������ע����ú�˻��Զ���Ϊ���á���������㿴���� [metrics endpoint](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.endpoint) ���ռ�����Щ������





һ����ʹ���κ��������õĺ�ˣ��ڴ��еĺ�˾ͻ��Զ��رա���Ҳ������ȷ�ؽ�������







Properties

Yaml





```
management.simple.metrics.export.enabled=false

```









#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.stackdriver)7.2.17\. Stackdriver



Stackdriverע�����Ļᶨ���� [Stackdriver](https://cloud.google.com/stackdriver/) ����ָ�ꡣҪ����ָ�굽SaaS [Stackdriver](https://micrometer.io/docs/registry/stackdriver)��������ṩ���Google Cloud project ID��







Properties

Yaml





```
management.stackdriver.metrics.export.project-id=my-project

```







�㻹���Ըı���Stackdriver����ָ���ʱ������







Properties

Yaml





```
management.stackdriver.metrics.export.step=30s

```









#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.statsd)7.2.18\. StatsD



StatsDע����еؽ�ָ��ͨ��UDP���͸�StatsD agent��Ĭ������£�ָ�걻�������������㱾�ػ����ϵ� [StatsD](https://micrometer.io/docs/registry/statsD) agent�������ͨ�����·�ʽ�ṩStatsD������������˿ں�Э�飬�Ա�ʹ�á�







Properties

Yaml





```
management.statsd.metrics.export.host=statsd.example.com
management.statsd.metrics.export.port=9125
management.statsd.metrics.export.protocol=udp

```







�㻹���Ըı�Ҫʹ�õ�StatsD��·Э�飨Ĭ��ΪDatadog����







Properties

Yaml





```
management.statsd.metrics.export.flavor=etsy

```









#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.export.wavefront)7.2.19\. Wavefront



Wavefrontע����ڽ�ָ�����͵� [Wavefront](https://micrometer.io/docs/registry/wavefront)�������ֱ�ӽ�ָ�굼���� [Wavefront](https://www.wavefront.com/)��������ṩ���API token��







Properties

Yaml





```
management.wavefront.api-token=YOUR_API_TOKEN

```







���⣬�����������Ļ�����ʹ��Wavefront sidecar���ڲ�������ת��ָ�����ݵ�Wavefront API������







Properties

Yaml





```
management.wavefront.uri=proxy://localhost:2878

```







�������ָ�귢����Wavefront������ [Wavefront�ĵ�](https://docs.wavefront.com/proxies_installing.html) �������������������� `proxy://HOST:PORT` ��ʽ��





��Ҳ���Ըı���Wavefront����ָ���ʱ������







Properties

Yaml





```
management.wavefront.metrics.export.step=30s

```











### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.supported)7.3\. ֧�ֵ�ָ�� ��Metric���Ͷ�����Meter��



Spring BootΪ���ָ����ļ����ṩ���Զ�������ע�ᡣ �ڴ��������£�Ĭ��ֵ�ṩ�˺����ָ�꣬���Է������κ�֧�ֵļ��ϵͳ�С�





#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.supported.jvm)7.3.1\. JVMָ��



�Զ�����ͨ��ʹ�ú��� Micrometer ������JVM������ JVMָ���� `jvm.` meter name �·�����





�ṩ����JVMָ�ꡣ





*   �����ڴ�ͻ����ϸ��

*   �������ռ��йص�ͳ������

*   �߳�������

*   ���غ�ж�ص��������

*   JVM�İ汾��Ϣ

*   JIT ����ʱ��







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.supported.system)7.3.2\. ϵͳָ��



�Զ�����ͨ��ʹ�ú���Micrometer����ʵ��ϵͳ������ ϵͳָ���� `system.`��`process.` �� `disk.` meter ���·�����





�ṩ����ϵͳָ�ꡣ





*   CPUָ��

*   �ļ�������ָ��

*   ��������ʱ��ָ�꣨����Ӧ�ó����Ѿ����е�ʱ��;�������ʱ��Ĺ̶���������

*   ���õĴ��̿ռ�







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.supported.application-startup)7.3.3\. Ӧ�ó�������ָ��



�Զ����ñ�¶��Ӧ�ó��������ʱ��ָ�ꡣ





*   `application.started.time`: ����Ӧ�ó����ʱ�䡣

*   `application.ready.time`��Ӧ�ó���׼����Ϊ�����ṩ���������ʱ�䡣





ָ������Ӧ�������ȫ��������ǵġ�







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.supported.logger)7.3.4\. ��־��¼��ָ��



�Զ�����������Logback��Log4J2���¼������� ϸ���� `log4j2.events.` �� `logback.events.` meter���¹�����







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.supported.tasks)7.3.5\. ����ִ�к͵���ָ��



�Զ�����ʹ���п��õ� `ThreadPoolTaskExecutor` �� `ThreadPoolTaskScheduler` Bean���ܱ�������ֻҪ�ײ�� `ThreadPoolExecutor` ���á� ָ����executor����������ǣ�executor������������Bean�����ơ�







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.supported.spring-mvc)7.3.6\. Spring MVC ָ��



�Զ������ܹ��� Spring MVC Controller�ͱ��ʽhandler���������������ж����� Ĭ������£�ָ������ `http.server.requests` Ϊ�������ɵġ� �����ͨ������ `management.observations.http.server.requests.name` ���������Ƹ����ơ�





���ڲ����Ĺ۲�����observation���ĸ�����Ϣ����μ� [Spring Framework �ο��ĵ�](https://docs.spring.io/spring-framework/docs/6.0.5/reference/html/integration.html#integration.observability.http-server.servlet)��





Ҫ��ӵ�Ĭ�ϱ�ǩ�У����ṩһ���̳��� `org.springframework.http.server.observation` ���е� `DefaultServerRequestObservationConvention` �� `@Bean`��Ҫ�滻Ĭ�ϱ�ǩ�����ṩһ��ʵ�� `ServerRequestObservationConvention` �� `@Bean`��





|  | ��ĳЩ����£�Web�������д�����쳣���ᱻ��¼Ϊ���������ǩ��Ӧ�ó������ѡ����벢ͨ����[handled exception ����Ϊ request attribute](https://springdoc.cn/spring-boot/web.html#web.servlet.spring-mvc.error-handling)����¼�쳣�� |
| --- | --- |





Ĭ������£��������󶼱����� Ҫ�Զ�������������ṩһ��ʵ�� `FilterRegistrationBean<WebMvcMetricsFilter>` �� `@Bean`��







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.supported.spring-webflux)7.3.7\. Spring WebFlux ָ��



�Զ������ܹ���Spring WebFlux controller�ͱ��ʽhandler������������ж����� Ĭ������£�ָ������ `http.server.requests` Ϊ�����ɵġ� �����ͨ������ `management.observations.http.server.requests.name` ���������Ƹ����ơ�





���ڲ����Ĺ۲�����observation���ĸ�����Ϣ����μ� [Spring Framework �ο��ĵ�](https://docs.spring.io/spring-framework/docs/6.0.5/reference/html/integration.html#integration.observability.http-server.reactive)��





Ҫ��ӵ�Ĭ�ϱ�ǩ�У����ṩ�̳��� `org.springframework.http.server.reactive.observation` ���е� `DefaultServerRequestObservationConvention` �� `@Bean`��Ҫ�滻Ĭ�ϱ�ǩ�����ṩһ��ʵ�� `ServerRequestObservationConvention` �� `@Bean`��





|  | ��ĳЩ����£��������ʹ������д�����쳣���ᱻ��¼Ϊ���������ǩ��Ӧ�ó������ѡ����벢ͨ��[��handled exception����Ϊrequest attribute](https://springdoc.cn/spring-boot/web.html#web.reactive.webflux.error-handling)����¼�쳣�� |
| --- | --- |







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.supported.jersey)7.3.8\. Jersey Server ָ��



�Զ�����ʹJersey JAX-RSʵ������������������ܱ������� Ĭ������£�ָ������ `http.server.requests` Ϊ�������ɵġ� �����ͨ������ `management.observations.http.server.requests.name` �������������ơ�





Ĭ������£�Jersey������ָ�걻���Ϊ������Ϣ��



<colgroup><col><col></colgroup>
| Tag | ˵�� |
| --- | --- |
| `exception` | ��������ʱ�׳����κ��쳣�ļ������� |
| `method` | ����ķ��������磬`GET` �� `POST`���� |
| `outcome` | ����Ľ����������Ӧ��״̬���롣 1xx�� `INFORMATIONAL`��2xx�� `SUCCESS`��3xx�� `REDIRECTION`��4xx�� `CLIENT_ERROR`��5xx�� `SERVER_ERROR`�� |
| `status` | ��Ӧ��HTTP״̬���루���磬`200` �� `500`���� |
| `uri` | ������ܵĻ����ڽ��б����滻֮ǰ�������URIģ�壨���磺`/api/person/{id}`���� |



Ҫ���Ʊ�ǩ�����ṩһ��ʵ�� `JerseyTagsProvider` �� `@Bean`��







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.supported.http-clients)7.3.9\. HTTP Client ָ��



Spring Boot Actuator������� `RestTemplate` �� `WebClient` �Ĺ��ߡ�Ϊ�ˣ������ע���Զ����õĹ�������ʹ����������ʵ����





*   `RestTemplateBuilder` ���� `RestTemplate`

*   `WebClient.Builder` ���� `WebClient`





��Ҳ�����ֶ�Ӧ�ø���������ߵ�customizer���� `ObservationRestTemplateCustomizer` �� `ObservationWebClientCustomizer`��





Ĭ������£�ָ������ `http.client.requests` ����������ɵġ�





�����ͨ������ `management.observations.http.client.requests.name` ����������������֡�





���ڲ����Ĺ۲�����observation���ĸ�����Ϣ����μ� [Spring Framework �ο��ĵ�](https://docs.spring.io/spring-framework/docs/6.0.5/reference/html/integration.html#integration.observability.http-client)��





Ҫ��ʹ�� `RestTemplate` ʱ���Ʊ�ǩ�����ṩһ��ʵ���� `org.springframework.http.client.observation` ���� `ClientRequestObservationConvention` �� `@Bean`��Ҫ��ʹ�� `WebClient` ʱ�Զ����ǩ�����ṩһ��ʵ���� `org.springframework.web.reactive.function.client` ���� `ClientRequestObservationConvention` �� `@Bean`��







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.supported.tomcat)7.3.10\. Tomcat ָ��



�Զ����ý��� `MBeanRegistry` ������ʱ�Ż�����Tomcat�������� Ĭ������£�`MBeanRegistry` �ǽ��õģ��������ͨ������ `server.tomcat.mbeanregistry.enabled` Ϊ `true` ����������





Tomcat��ָ���� `tomcat.` meter ���·�����







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.supported.cache)7.3.11\. Cache ָ��



�Զ����ÿ���������ʱ�����п��õ� `Cache` ʵ�����м�⣬��ָ���� `cache` Ϊǰ׺��





�����Ǳ��Ǳ�׼���Ļ���ָ�꼯��





Ҳ����ʹ�ö���ġ���Ի����ָ�ꡣ





֧�����»���⡣





*   Cache2k

*   Caffeine

*   Hazelcast

*   �κμ��ݵ�JCache��JSR-107��ʵ��

*   Redis





ָ���ɻ�������ƺ� `CacheManager` ����������ǣ�`CacheManager` ����������Bean���������ġ�





|  | ֻ��������ʱ���õĻ��汻�󶨵�ע��� ����û���ڻ��������ж���Ļ��棬�����������׶κ���ʱ�����Ļ�����Ա�̷�ʽ�����Ļ��棬��Ҫ��ȷע�ᡣ һ�� `CacheMetricsRegistrar` Bean����ʹ������̸����ס� |
| --- | --- |







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.supported.spring-graphql)7.3.12\. Spring GraphQL ָ��



�μ� [Spring GraphQL �ο��ĵ�](https://docs.spring.io/spring-graphql/docs/1.1.2/reference/html/)��







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.supported.jdbc)7.3.13\. DataSource ָ��



�Զ�����ʹ���п��õ� `DataSource` �������������ָ��ǰ׺Ϊ `jdbc.connections`�� ����Դ���Ľ���Ǳ�ʾ���е�ǰ��ġ����еġ��������ĺ���С��������������Ǳ�





������׼Ҳ�ɻ���bean���Ƽ���� `DataSource` ����������ǡ�





|  | Ĭ������£�Spring BootΪ����֧�ֵ�����Դ�ṩԪ���ݡ� �����ϲ��������Դ����֧�֣��������Ӷ���� `DataSourcePoolMetadataProvider` Bean�� ����� `DataSourcePoolMetadataProvidersConfiguration` ���˽�ʵ���� |
| --- | --- |





���⣬Hikari�ض���ָ���� `hikaricp` ǰ׺��¶�� ÿ��ָ�궼��pool����������ǣ�������� `spring.datasource.name` �����ƣ���







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.supported.hibernate)7.3.14\. Hibernate ָ��



��� `org.hibernate.orm:hibernate-micrometer` ��classpath�ϣ�����������ͳ�ƹ��ܵ�Hibernate `EntityManagerFactory` ʵ�����ᱻһ����Ϊ `hibernate` ��ָ������⡣





������׼Ҳ�� `EntityManagerFactory` ����������ǣ�����������Bean���������ġ�





Ҫ����ͳ�ƣ���׼JPA���� `hibernate.generate_statistics` ��������Ϊ `true`�� ��������Զ����õ� `EntityManagerFactory` �����á�







Properties

Yaml





```
spring.jpa.properties[hibernate.generate_statistics]=true

```









#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.supported.spring-data-repository)7.3.15\. Spring Data Repository ָ��



�Զ������ܹ�������Spring Data `Repository` �����ĵ��ý��ж����� Ĭ������£�ָ���� `spring.data.repository.invocations` Ϊ�����ɡ� �����ͨ������ `management.metrics.data.repository.metric-name` �������Զ������ơ�





`io.micrometer.core.annotation` ���е� `@Timed` ע��֧�� `Repository` �ӿںͷ���������㲻���¼���� `Repository` ���õĶ�����metric��������Խ� `management.metrics.data.repository.autotime.enabled` ����Ϊ `false`����ר��ʹ�� `@Timed` ע�⡣





|  | һ������ `longTask = true` �� `@Timed` ע�����Ϊ�÷�������һ���������ʱ����������ʱ����Ҫһ�������� metric name�����ҿ����������ʱ����task timer�����ӡ� |
| --- | --- |





Ĭ������£�repository������صĶ�����׼�����Ϊ������Ϣ��



<colgroup><col><col></colgroup>
| Tag | ˵�� |
| --- | --- |
| `repository` | Դ `Repository` �ļ������� |
| `method` | �����õ� `Repository` ���������ơ� |
| `state` | ���״̬��`SUCCESS`, `ERROR`, `CANCELED`, `RUNNING`���� |
| `exception` | �������׳����κ��쳣�ļ������� |



Ҫ�滻Ĭ�ϱ�ǩ����Ҫ�ṩһ��ʵ���� `RepositoryTagsProvider` �� `@Bean`��







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.supported.rabbitmq)7.3.16\. RabbitMQ ָ��



�Զ�����ʹ���п��õ� RabbitMQ ���ӹ���������������ָ����Ϊ `rabbitmq`��







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.supported.spring-integration)7.3.17\. Spring Integration ָ��



ֻҪ�� `MeterRegistry` bean��Spring Integration�ͻ��Զ��ṩ [Micrometer support](https://docs.spring.io/spring-integration/docs/6.1.0-M1/reference/html/system-management.html#micrometer-integration)�� ������׼�� `spring.integration.` meter �����·�����







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.supported.kafka)7.3.18\. Kafka ָ��



�Զ�����Ϊ�Զ����õ������߹����������߹����ֱ�ע����һ�� `MicrometerConsumerListener` �� `MicrometerProducerListener`�� ����Ϊ `StreamsBuilderFactoryBean` ע����һ�� `KafkaStreamsMicrometerListener`�� ����ϸ�ڣ������Spring Kafka�ĵ��е� [Micrometer Native Metrics](https://docs.spring.io/spring-kafka/docs/3.0.3/reference/html/#micrometer-native) ���֡�







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.supported.mongodb)7.3.19\. MongoDB ָ��



���ڼ�Ҫ����MongoDB�Ŀ��ö�����





##### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.supported.mongodb.command)MongoDB����ָ��



�Զ����ý� `MongoMetricsCommandListener` ���Զ����õ� `MongoClient` ע�ᡣ





һ����Ϊ `mongodb.driver.commands` ��timerָ�걻������������ײ�MongoDB driver������ÿ����� Ĭ������£�ÿ��ָ�궼�����Ϊ������Ϣ��



<colgroup><col><col></colgroup>
| Tag | ˵�� |
| --- | --- |
| `command` | ��������������ơ� |
| `cluster.id` | ���͸�����ļ�Ⱥ�ı�ʶ���� |
| `server.address` | ��������ķ������ĵ�ַ�� |
| `status` | ����Ľ����`SUCCESS` �� `FAILED���� |



Ϊ���滻Ĭ�ϵĶ������ǩ������һ�� `MongoCommandTagsProvider` bean����������ʾ��







Java

Kotlin





```
@Configuration(proxyBeanMethods = false)
public class MyCommandTagsProviderConfiguration {

    @Bean
    public MongoCommandTagsProvider customCommandTagsProvider() {
        return new CustomCommandTagsProvider();
    }

}

```







Ҫ�����Զ����õ�����������������������ԡ�







Properties

Yaml





```
management.metrics.mongo.command.enabled=false

```









##### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.supported.mongodb.connection-pool)MongoDB ���ӳ�ָ��



�Զ����ý� `MongoMetricsConnectionPoolListener` ���Զ����õ� `MongoClient` ע�ᡣ





������Ϊ���ӳش����Ĳ���ָ�ꡣ





*   `mongodb.driver.pool.size` �������ӳصĵ�ǰ��С���������к�����ʹ�õĳ�Ա��

*   `mongodb.driver.pool.checkedout` ���浱ǰʹ���е���������

*   `mongodb.driver.pool.waitqueuesize` ����������ӵĵȴ����еĵ�ǰ��С��





Ĭ������£�ÿ��ָ�궼�����Ϊ������Ϣ��



<colgroup><col><col></colgroup>
| Tag | ˵�� |
| --- | --- |
| `cluster.id` | ���ӳ�����Ӧ�ļ�Ⱥ�ı�ʶ���� |
| `server.address` | ���ӳ�����Ӧ�ķ������ĵ�ַ�� |



Ҫȡ��Ĭ�ϵĶ������ǩ���붨��һ�� `MongoConnectionPoolTagsProvider` bean��







Java

Kotlin





```
@Configuration(proxyBeanMethods = false)
public class MyConnectionPoolTagsProviderConfiguration {

    @Bean
    public MongoConnectionPoolTagsProvider customConnectionPoolTagsProvider() {
        return new CustomConnectionPoolTagsProvider();
    }

}

```







Ҫ�����Զ����õ����ӳض������������������ԡ�







Properties

Yaml





```
management.metrics.mongo.connectionpool.enabled=false

```











#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.supported.jetty)7.3.20\. Jetty ָ��



�Զ�����ͨ��ʹ��Micrometer�� `JettyServerThreadPoolMetrics` ΪJetty�� `ThreadPool` ��ָ�ꡣ Jetty�� `Connector` ʵ����ָ��ͨ��ʹ��Micrometer�� `JettyConnectionMetrics` ���󶨣��� `server.ssl.enabled` ������Ϊ `true` ʱ��Micrometer�� `JettySslHandshakeMetrics`��







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.supported.timed-annotation)7.3.21\. @Timed ע���֧��



Ҫ��Spring Boot��ֱ��֧�ֵĵط�ʹ�� `@Timed`����ο� [Micrometer �ĵ�](https://micrometer.io/docs/concepts#_the_timed_annotation)��







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.supported.redis)7.3.22\. Redis ָ��



�Զ�����Ϊ�Զ����õ� `LettuceConnectionFactory` ע����һ�� `MicrometerCommandLatencyRecorder`�� ����ϸ�ڣ������Lettuce�ĵ��� [Micrometer Metrics����](https://lettuce.io/core/6.2.3.RELEASE/reference/index.html#command.latency.metrics.micrometer)��









### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.registering-custom)7.4\. ע���Զ���ָ��



Ҫע���Զ���������뽫 `MeterRegistry` ע���������С�







Java

Kotlin





```
@Component
public class MyBean {

    private final Dictionary dictionary;

    public MyBean(MeterRegistry registry) {
        this.dictionary = Dictionary.load();
        registry.gauge("dictionary.size", Tags.empty(), this.dictionary.getWords().size());
    }

}

```







�����Ķ�����׼����������Bean�����ǽ�����ʹ�� `MeterBinder` ��ע�����ǡ�







Java

Kotlin





```
public class MyMeterBinderConfiguration {

    @Bean
    public MeterBinder queueSize(Queue queue) {
        return (registry) -> Gauge.builder("queueSize", queue::size).register(registry);
    }

}

```







ʹ�� `MeterBinder` ����ȷ��������ȷ��������ϵ�������ڼ�������ֵ��ʱ��Bean�ǿ��õġ� ����㷢�����������Ӧ�ó������ظ�����һ��ָ�꣬��ô `MeterBinder` ��ʵ��Ҳ������á�





|  | Ĭ������£����� `MeterBinder` Bean��ָ�궼���Զ��󶨵�Spring����� `MeterRegistry`�� |
| --- | --- |







### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.customizing)7.5\. ���Ƹ���ָ��



�������Ҫ���ض��� `Meter` ʵ�������Զ��壬�����ʹ�� `io.micrometer.core.instrument.config.MeterFilter` �ӿڡ�





���磬�������������� `com.example` ��ͷ���Ǳ�ID�� `mytag.region` ��ǩ������Ϊ `mytag.area`������������¹�����







Java

Kotlin





```
@Configuration(proxyBeanMethods = false)
public class MyMetricsFilterConfiguration {

    @Bean
    public MeterFilter renameRegionTagMeterFilter() {
        return MeterFilter.renameTag("com.example", "mytag.region", "mytag.area");
    }

}

```







|  | Ĭ������£����е� `MeterFilter` Bean���Զ��󶨵�Spring����� `MeterRegistry`�� ��ȷ��ʹ��Spring����� `MeterRegistry` ��ע�����ָ�꣬������ʹ�� `Metrics` ���κξ�̬������ ��Щ����ʹ�õ��ǲ���Spring�����ȫ��ע��� |
| --- | --- |





#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.customizing.common-tags)7.5.1\. ������ǩ��Tag��



ͨ�ñ�ǩһ�����ڶ����л�������ά�����꣬��������ʵ�������򡢶�ջ�ȡ� ���ñ�ǩ�����������Ǳ����Խ������ã���������ʾ��







Properties

Yaml





```
management.metrics.tags.region=us-east-1
management.metrics.tags.stack=prod

```







ǰ�������Ϊ����ֵΪ `us-east-1` �� `prod` ���Ǳ������ `region` �� `stack` ��ǩ��





|  | �����ʹ��Graphite����ͨ��ǩ��˳���Ǻ���Ҫ�ġ� ����ʹ�����ַ������ܱ�֤������ǩ��˳�򣬽���Graphite�û�����һ���Զ���� `MeterFilter` �����档 |
| --- | --- |







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.customizing.per-meter-properties)7.5.2\. Per-meter Properties



���� `MeterFilter` Bean���㻹����ʹ��������ÿ����Ļ�����Ӧ��һ�����޵��Զ��幦�ܡ� ʹ��Spring Boot�� `PropertiesMeterFilter`��ÿ����Ķ��Ʊ�Ӧ�����Ը������ƿ�ͷ���κα��ID�� ��������ӹ��˵��κ�ID�� `example.remote` ��ͷ���Ǳ�







Properties

Yaml





```
management.metrics.enable.example.remote=false

```







�������������per-meter�Ķ��ơ�



<caption>Table 1\. Per-meter customizations</caption><colgroup><col><col></colgroup>
| Property | ˵�� |
| --- | --- |
| `management.metrics.enable` | �Ƿ���ܾ����ض�ID��Meter�� �����ܵ�Meter���� `MeterRegistry` �й��˵��� |
| `management.metrics.distribution.percentiles-histogram` | �Ƿ񷢲��ʺϼ���ɾۼ�����ά�ȣ��İٷ�λ������ֵ��ֱ��ͼ�� |
| `management.metrics.distribution.minimum-expected-value`, `management.metrics.distribution.maximum-expected-value` | ͨ��ǯ��Ԥ��ֵ�ķ�Χ���������ٵ�ֱ��ͼͰ�� |
| `management.metrics.distribution.percentiles` | ���������Ӧ�ó����м���İٷ�λֵ |
| `management.metrics.distribution.expiry`, `management.metrics.distribution.buffer-length` | ͨ���ڻ��λ������л�������������������Ǹ����Ȩ�أ����λ������ڿ����õĹ��ں���ת������������Ϊ �����õĻ��������ȡ� |
| `management.metrics.distribution.slo` | ����һ���ۻ�ֱ��ͼ�����е�Ͱ����ķ���ˮƽĿ�궨�塣 |



���� `percentiles-histogram` ���ٷ���-ֱ��ͼ����`percentiles`���ٷ������� `slo` ����ĸ���ĸ���ϸ�ڣ���μ�Micrometer�ĵ��е� [��Histograms and percentiles�� ��ֱ��ͼ�Ͱٷ���������](https://micrometer.io/docs/concepts#_histograms_and_percentiles)��









### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.endpoint)7.6\. ָ��˵�



Spring Boot�ṩ��һ�� `metrics` �˵㣬���������Ե�ʹ���������Ӧ�ó����ռ���ָ�ꡣ�ö˵�Ĭ��������ǲ����õģ����빫��������ϸ����μ� [��¶�˵�](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints.exposing)��





������ `/actuator/metrics` ����ʾһ�����õ��Ǳ������б� �����ͨ���ṩ������Ϊѡ����������鿴ĳ���ض��Ǳ����Ϣ�����磬`/actuator/metrics/jvm.memory.max`��





|  | ��������ʹ�õ�����Ӧ���������ʹ�õ�����һ�£������������������ļ��ϵͳ�о������������淶��������֡� ���仰˵����� `jvm.memory.max` ��Prometheus����ʾΪ `jvm_memory_max`����Ϊ����������������������ȻӦ��ʹ�� `jvm.memory.max` ��Ϊѡ�������� `metrics` �˵��м���Ǳ� |
| --- | --- |





��Ҳ������URL��ĩβ������������� `tag=KEY:VALUE` ��ѯ�������Զ��Ǳ����ά������?��?���磬`/actuator/metrics/jvm.memory.max?tag=area:nonheap`��





|  | ����Ĳ���ֵ���������Ǳ�������ƥ����Ǳ���κ���Ӧ�õı�ǩ��ͳ������ _�ܺ�_�� ��ǰ��������У����ص� `Value` ͳ���Ƕѵ� ��Code Cache������Compressed Class Space�� �� ��Metaspace�� ���������ڴ桰�㼣��֮�͡� �������ֻ���� ��Metaspace�� �����ߴ磬��������һ������� `tag=id:Metaspace` --�� `/actuator/metrics/jvm.memory.max?tag=area:nonheap&tag=id:Metaspace`�� |
| --- | --- |







### [](https://springdoc.cn/spring-boot/actuator.html#actuator.metrics.micrometer-observation)7.7\. ���� Micrometer Observation



һ�� `DefaultMeterObservationHandler` ���Զ�ע���� `ObservationRegistry` �ϣ���Ϊÿ����ɵĹ۲죨completed observation������������metric����











## [](https://springdoc.cn/spring-boot/actuator.html#actuator.micrometer-tracing)8\. ׷�٣�Tracing��





Spring Boot Actuator Ϊ Micrometer Tracing �ṩ�������Թ�����Զ����ã� [Micrometer Tracing](https://micrometer.io/docs/tracing) �����е�׷������tracer�����һ���ӿڣ�facade����





|  | Ҫ�˽������� Micrometer Tracing ���ܵ���Ϣ��������� [�ο��ĵ�](https://micrometer.io/docs/tracing)�� |
| --- | --- |





### [](https://springdoc.cn/spring-boot/actuator.html#actuator.micrometer-tracing.tracers)8.1\. ֧�ֵ�׷����



Spring BootΪ����׷�����ṩ���Զ����á�





*   ʹ�� [Zipkin](https://zipkin.io/) �� [Wavefront](https://docs.wavefront.com/) �� [OpenTelemetry](https://opentelemetry.io/)

*   ʹ�� [Zipkin](https://zipkin.io/) �� [Wavefront](https://docs.wavefront.com/) �� [OpenZipkin Brave](https://github.com/openzipkin/brave)







### [](https://springdoc.cn/spring-boot/actuator.html#actuator.micrometer-tracing.getting-started)8.2\. ����



������Ҫһ������������ʼ׷�ٵ�ʾ��Ӧ�ó��򡣾����ǵ�Ŀ�Ķ��ԣ���[getting-started.html](https://springdoc.cn/spring-boot/getting-started.html#getting-started.first-application)�� �������漰�ļ򵥵� ��Hello World!�� web������㹻�ˡ����ǽ�ʹ�� `OpenTelemetry` ׷������ `Zipkin` ��Ϊ׷�ٺ�ˡ�





�ع�һ�£����ǵ���ҪӦ�ô��뿴�����������ġ�







```
@RestController
@SpringBootApplication
public class MyApplication {

    private static final Log logger = LogFactory.getLog(MyApplication.class);

    @RequestMapping("/")
    String home() {
        logger.info("home() has been called");
        return "Hello World!";
    }

    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }

}

```







|  | �� `home()` �����У���һ�����ӵ�logger��䣬���ں�������Ҫ�� |
| --- | --- |





���ڣ����Ǳ���������������





*   `org.springframework.boot:spring-boot-starter-actuator`

*   `io.micrometer:micrometer-tracing-bridge-otel` - �������� Micrometer Observation API �� OpenTelemetry �ı�Ҫ������

*   `io.opentelemetry:opentelemetry-exporter-zipkin` - ������Zipkin���� [traces](https://micrometer.io/docs/tracing#_glossary) ����Ҫ�ġ�





������µ� application properties:







Properties

Yaml





```
management.tracing.sampling.probability=1.0

```







Ĭ������£�Spring Bootֻ��10%��������в������Է�ֹ׷�ٺ�˲����ظ��������Խ����л�Ϊ100%������ÿ�����󶼻ᱻ���͵����ٺ�ˡ�





Ϊ���ռ��Ϳ��ӻ����٣�������Ҫһ�����и��ٵĺ�ˡ�����������ʹ��Zipkin��Ϊ���ǵĸ��ٺ�ˡ� [Zipkin��������ָ��](https://zipkin.io/pages/quickstart) �ṩ������ڱ�������Zipkin��˵����





Zipkin���к�������������Ӧ�ó���





������web��������� `[localhost:8080](http://localhost:8080/)`����Ӧ�ÿ������������







 Hello World! 







��Ļ���Ѿ�ΪHTTP���󴴽���һ�� observation�������������Žӵ� `OpenTelemetry`��������Zipkin����һ���µĸ��٣�trace����





���ڣ��� `[localhost:9411](http://localhost:9411/)` ��Zipkin�û����棬��� "Run Query" ��ť���г������ռ����ĸ�����Ϣ����Ӧ�ÿ���һ��׷�١���� "Show" ��ť���鿴��׷�ٵ�ϸ�ڡ�





|  | �����ͨ���� `logging.pattern.level` ��������Ϊ `%5p [${spring.application.name:},%X{traceId:-},%X{spanId:-}]`������־�а�����ǰ�ĸ��٣�trace���� span id�� |
| --- | --- |







### [](https://springdoc.cn/spring-boot/actuator.html#actuator.micrometer-tracing.tracer-implementations)8.3\. ��������Tracer����ʵ��



����Micrometer Tracer֧�ֶ���ʾ������ʵ�֣����Spring Boot�����ж���������ϡ�





����׷������ʵ�ֶ���Ҫ `org.springframework.boot:spring-boot-starter-actuator` ������





#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.micrometer-tracing.tracer-implementations.otel-zipkin)8.3.1\. ʹ�� Zipkin �� OpenTelemetry



*   `io.micrometer:micrometer-tracing-bridge-otel` - �������� Micrometer Observation API �� OpenTelemetry �ı�Ҫ������

*   `io.opentelemetry:opentelemetry-exporter-zipkin` - ������Zipkin����trace����Ҫ�ġ�







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.micrometer-tracing.tracer-implementations.otel-wavefront)8.3.2\. ʹ�� Wavefront �� OpenTelemetry



*   `io.micrometer:micrometer-tracing-bridge-otel` - �������� Micrometer Observation API �� OpenTelemetry �ı�Ҫ������

*   `io.micrometer:micrometer-tracing-reporter-wavefront` - ������Wavefront����trace����Ҫ�ġ�







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.micrometer-tracing.tracer-implementations.brave-zipkin)8.3.3\. ʹ�� Zipkin �� OpenZipkin Brave



*   `io.micrometer:micrometer-tracing-bridge-brave` - �������� Micrometer Observation API �� Brave �ı�Ҫ������

*   `io.zipkin.reporter2:zipkin-reporter-brave` - ������Zipkin���� trace ����Ҫ�ġ�





|  | ��������Ŀû��ʹ��Spring MVC��Spring WebFlux��Ҳ��Ҫʹ�� `io.zipkin.reporter2:zipkin-sender-urlconnection` ����� |
| --- | --- |







#### [](https://springdoc.cn/spring-boot/actuator.html#actuator.micrometer-tracing.tracer-implementations.brave-wavefront)8.3.4\. ʹ��Wavefront��OpenZipkin Brave



*   `io.micrometer:micrometer-tracing-bridge-brave` - �������Ӳ�Micrometer Observation API��Brave�ı�Ҫ������

*   `io.micrometer:micrometer-tracing-reporter-wavefront` - ������Wavefront����trace����Ҫ�ġ�









### [](https://springdoc.cn/spring-boot/actuator.html#actuator.micrometer-tracing.creating-spans)8.4\. �����Զ����ȣ�span��



�����ͨ������һ�� observation ���������Լ���span��Ϊ�ˣ��� `ObservationRegistry` ע�뵽�������С�







```
@Component
class CustomObservation {

    private final ObservationRegistry observationRegistry;

    CustomObservation(ObservationRegistry observationRegistry) {
        this.observationRegistry = observationRegistry;
    }

    void someOperation() {
        Observation observation = Observation.createNotStarted("some-operation", this.observationRegistry);
        observation.lowCardinalityKeyValue("some-tag", "some-value");
        observation.observe(() -> {
            // Business logic ...
        });
    }

}

```







�⽫����һ����Ϊ "some-operation" �� observation����ǩΪ����ǩΪ "some-tag=some-value"��





|  | ��������ڲ�����metric������´���һ��span������Ҫʹ�� Micrometer �� [�ͼ�Tracer API](https://micrometer.io/docs/tracing#_using_micrometer_tracing_directly)�� |
| --- | --- |











## [](https://springdoc.cn/spring-boot/actuator.html#actuator.auditing)9\. ���





һ��Spring Security�������ã�Spring Boot Actuator����һ��������ƿ�ܣ����Է����¼���Ĭ��Ϊ ��authentication success��, ��failure�� �� ��access denied�� ���쳣���� ��һ���ܶ��ڱ����ʵʩ������֤ʧ�ܵ��������Էǳ����á�





�����ͨ����Ӧ�ó�����������ṩһ�� `AuditEventRepository` ���͵�bean��������ơ� Ϊ�˷��㣬Spring Boot�ṩ��һ�� `InMemoryAuditEventRepository`�� `InMemoryAuditEventRepository` �Ĺ������ޣ����ǽ���ֻ�ڿ���������ʹ������ ���������������뿼�Ǵ������Լ������ `AuditEventRepository` ʵ�֡�





### [](https://springdoc.cn/spring-boot/actuator.html#actuator.auditing.custom)9.1\. �������



Ϊ�˶��Ʒ����İ�ȫ�¼���������ṩ���Լ��� `AbstractAuthenticationAuditListener` �� `AbstractAuthorizationAuditListener` ��ʵ�֡�





��Ҳ����Ϊ���Լ���ҵ���¼�ʹ����Ʒ��� Ҫ������һ�㣬Ҫô�� `AuditEventRepository` beanע�����Լ��������ֱ��ʹ������Ҫô��Spring�� `ApplicationEventPublisher` ���� `AuditApplicationEvent`��ͨ��ʵ�� `ApplicationEventPublisherAware`����











## [](https://springdoc.cn/spring-boot/actuator.html#actuator.http-exchanges)10\. ��¼ HTTP Exchange





�����ͨ����Ӧ�ó�����������ṩһ�� `HttpExchangeRepository` ���͵� bean ������ HTTP exchange �ļ�¼��Ϊ�˷��������Spring Boot �ṩ�� `InMemoryHttpExchangeRepository`��Ĭ������£����洢�����100�� request/response exchange����׷�ٽ��������tracing solutions����ȣ�`InMemoryHttpExchangeRepository` �����޵ģ����ǽ���ֻ�ڿ���������ʹ�����������������������ǽ���ʹ��һ�����������ĸ��ٻ�۲����������� `Zipkin` �� `OpenTelemetry`�����⣬��Ҳ���Դ������Լ��� `HttpExchangeRepository`��





�����ʹ�� `httpexchanges` �˵�����ȡ�洢�� `HttpExchangeRepository` �е� request/response exchange ����Ϣ��





### [](https://springdoc.cn/spring-boot/actuator.html#actuator.http-exchanges.custom)10.1\. �Զ��� HTTP Exchange ��¼



Ҫ�Զ��������ÿ����¼�� exchange ��Ŀ����ʹ�� `management.httpexchanges.recording.include` �������ԡ�





Ҫ��ȫ��ֹ���±��룬�뽫 `management.httpexchanges.recording.enabled` ����Ϊ `false`��











## [](https://springdoc.cn/spring-boot/actuator.html#actuator.process-monitoring)11\. ���̼��





�� `spring-boot` ģ���У�������ҵ����������ļ����࣬��Щ�ļ��ڽ��̼����ͨ�������á�





*   `ApplicationPidFileWriter` ����һ������Ӧ�ó���PID���ļ���Ĭ������£���Ӧ�ó���Ŀ¼�£��ļ���Ϊ `application.pid`����

*   `WebServerPortFileWriter` ����һ�����������ļ������������е�Web�������Ķ˿ڣ�Ĭ������£���Ӧ�ó���Ŀ¼�£��ļ���Ϊ `application.port`����





Ĭ������£���Щд��û�б������������������ǡ�





*   [ͨ����չ����](https://springdoc.cn/spring-boot/actuator.html#actuator.process-monitoring.configuration)

*   [�Ա�̷�ʽʵ�ֽ��̼��](https://springdoc.cn/spring-boot/actuator.html#actuator.process-monitoring.programmatically)





### [](https://springdoc.cn/spring-boot/actuator.html#actuator.process-monitoring.configuration)11.1\. ��չ����



�� `META-INF/spring.factories` �ļ��У�����Լ���д��PID�ļ���listener��һ�����߶������







 org.springframework.context.ApplicationListener=\
org.springframework.boot.context.ApplicationPidFileWriter,\
org.springframework.boot.web.context.WebServerPortFileWriter 









### [](https://springdoc.cn/spring-boot/actuator.html#actuator.process-monitoring.programmatically)11.2\. �Ա�̷�ʽʵ�ֽ��̼��



��Ҳ����ͨ������ `SpringApplication.addListeners(��?)` �����������ʵ��� `Writer` ����������һ���������� ������������������� `Writer` ���캯�����Զ����ļ�����·����











## [](https://springdoc.cn/spring-boot/actuator.html#actuator.cloud-foundry)12\. Cloud Foundry ��֧��





Spring Boot ��actuatorģ����������֧�֣��������𵽼��ݵ� Cloud Foundry ʵ��ʱ����֧�ֽ������ `/cloudfoundryapplication` ·��Ϊ���� `@Endpoint` Bean�ṩ����һ����ȫ·�ߡ�





��չ֧��ʹ Cloud Foundry ���� UI�����������������鿴�Ѳ����Ӧ�ó���� Web Ӧ�ó��򣩵õ� Spring Boot ִ������Ϣ����ǿ�� ���磬Ӧ�ó���״̬ҳ����԰��������Ľ�����Ϣ�������ǵ��͵� ��running�� �� ��stopped�� ״̬��





|  | ��ͨ�û��޷�ֱ�ӷ��� `/cloudfoundryapplication` ·���� Ҫʹ�øö˵㣬�������������д���һ����Ч�� UAA ���ơ� |
| --- | --- |





### [](https://springdoc.cn/spring-boot/actuator.html#actuator.cloud-foundry.disable)12.1\. ������չ�� Cloud Foundry Actuator ֧��



���������ȫ���� `/cloudfoundryapplication` �˵㣬������������ `application.properties` �ļ�������������á�







Properties

Yaml





```
management.cloudfoundry.enabled=false

```









### [](https://springdoc.cn/spring-boot/actuator.html#actuator.cloud-foundry.ssl)12.2\. Cloud Foundry��ǩ��֤��



Ĭ������£�`/cloudfoundryapplication` �˵�İ�ȫ��֤��Ը��� Cloud Foundry ������� SSL ���á� ������� Cloud Foundry UAA �� Cloud Controller ����ʹ����ǩ��֤�飬����Ҫ�����������ԡ�







Properties

Yaml





```
management.cloudfoundry.skip-ssl-validation=true

```









### [](https://springdoc.cn/spring-boot/actuator.html#actuator.cloud-foundry.custom-context-path)12.3\. �Զ��� Context Path



����������� context-path ������Ϊ `/` ������κ����ݣ��� Cloud Foundry �˵���Ӧ�ó���ĸ��������á� ���磬��� `server.servlet.context-path=/app`���� Cloud Foundry �˵��� `/app/cloudfoundryapplication/*` �����á�





�����ϣ�� Cloud Foundry �˵�ʼ���� `/cloudfoundryapplication/*` �����ã����۷�������������·����Σ�����Ҫ������Ӧ�ó�������ȷ���á� ��������ʹ�õ� Web ��������ͬ����ͬ�� ���� Tomcat������������������á�







Java

Kotlin





```
@Configuration(proxyBeanMethods = false)
public class MyCloudFoundryConfiguration {

    @Bean
    public TomcatServletWebServerFactory servletWebServerFactory() {
        return new TomcatServletWebServerFactory() {

            @Override
            protected void prepareContext(Host host, ServletContextInitializer[] initializers) {
                super.prepareContext(host, initializers);
                StandardContext child = new StandardContext();
                child.addLifecycleListener(new Tomcat.FixContextListener());
                child.setPath("/cloudfoundryapplication");
                ServletContainerInitializer initializer = getServletContextInitializer(getContextPath());
                child.addServletContainerInitializer(initializer, Collections.emptySet());
                child.setCrossContext(true);
                host.addChild(child);
            }

        };
    }

    private ServletContainerInitializer getServletContextInitializer(String contextPath) {
        return (classes, context) -> {
            Servlet servlet = new GenericServlet() {

                @Override
                public void service(ServletRequest req, ServletResponse res) throws ServletException, IOException {
                    ServletContext context = req.getServletContext().getContext(contextPath);
                    context.getRequestDispatcher("/cloudfoundryapplication").forward(req, res);
                }

            };
            context.addServlet("cloudfoundry", servlet).addMapping("/*");
        };
    }

}

```













## [](https://springdoc.cn/spring-boot/actuator.html#actuator.whats-next)13\. ��������ʲô





��������һ�� [Graphite](https://graphiteapp.org/) ��ͼ�ι��ߡ�





��������Լ����Ķ� [������ѡ�](https://springdoc.cn/spring-boot/deployment.html#deployment) ����������ǰ��ȥ�˽��й�Spring Boot [�������߲�](https://springdoc.cn/spring-boot/build-tool-plugins.html#build-tool-plugins)����һЩ������Ϣ��







