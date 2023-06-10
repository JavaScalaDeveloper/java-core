��΢����ܹ��У�һ��ϵͳ�����ɶ��΢������ɣ�����Щ������ܲ����ڲ�ͬ��������ͬ��������ͬ�����¡���������£��ͻ��ˣ�������������ֻ���������ߵȣ���Ҫֱ��������Щ���񣬾���Ҫ֪�����Ǿ���ĵ�ַ��Ϣ������ IP ��ַ���˿ںŵȡ�

���ֿͻ���ֱ���������ķ�ʽ�����������⣺

*   �����������ڶ�ʱ���ͻ�����Ҫά�������ķ����ַ������ڿͻ�����˵���Ƿǳ��������ӵġ�
*   ��ĳЩ�����¿��ܻ���ڿ�����������⡣
*   �����֤���Ѷȴ�ÿ��΢������Ҫ������֤��

���ǿ���ͨ�� API �����������Щ���⣬�����������������ʲô�� API ���ء�

## API ����

API ������һ����ڿͻ��˺�΢����֮��ķ������ǿ����� API �����д���һЩ��ҵ���ܵ��߼�������Ȩ����֤����ء����桢����·�ɵȡ�

API ���ؾ�������΢����ϵͳ������һ������ϵͳ�����Ψһ��ڡ����������ͻ��˻��Ƚ������͵� API ���أ�Ȼ���� API ���ظ�������ı�ʶ��Ϣ������ת����΢����ʵ����

![](http://c.biancheng.net/uploads/allimg/211210/101P46212-0.png)
ͼ1�����ַ�����ʷ�ʽ�Ա�

���ڷ��������ڶࡢ���ӶȽϸߡ���ģ�Ƚϴ��ϵͳ��˵��ʹ�� API ���ؾ������ºô���

*   �ͻ���ͨ�� API ������΢���񽻻�ʱ���ͻ���ֻ��Ҫ֪�� API ���ص�ַ���ɣ�������Ҫά�������ķ����ַ�����˿ͻ��˵Ŀ�����
*   �ͻ���ֱ���� API ����ͨ�ţ��ܹ����ٿͻ������������Ľ���������
*   �ͻ������˵ķ�����϶Ƚ��͡�
*   ��ʡ������������ܣ������û����顣
*   API ���ػ��ṩ�˰�ȫ�����ء����ˡ����桢�Ʒ��Լ���ص� API �����ܡ�

������ API ����ʵ�ַ�����Ҫ������ 5 �֣�

*   Spring Cloud Gateway
*   Spring Cloud Netflix Zuul
*   Kong
*   Nginx+Lua
*   Traefik

���ڣ����ǾͶ� Spring Cloud Gateway ������ϸ���ܡ�

## Spring Cloud Gateway```

Spring Cloud Gateway �� Spring Cloud �Ŷӻ��� Spring 5.0��Spring Boot 2.0 �� Project Reactor �ȼ��������ĸ����� API ���������

Spring Cloud Gateway ּ���ṩһ�ּ򵥶���Ч��;�������� API����Ϊ�����ṩ���й�ע�㣬���磺��ȫ�ԣ����/ָ��͵��ԡ�```

> Spring Cloud Gateway �ǻ��� WebFlux ���ʵ�ֵģ��� WebFlux ��ܵײ���ʹ���˸����ܵ� Reactor ģʽͨ�ſ�� Netty��

#### Spring Cloud Gateway ���ĸ���

Spring Cloud GateWay ����Ҫ�Ĺ��ܾ���·��ת�������ڶ���ת������ʱ��Ҫ�漰�������������ĸ�����±�

| ���ĸ��� | ���� |
| --- | --- |
| Route��·�ɣ� | �����������ģ�顣����һ�� ID��һ��Ŀ�� URI��һ����ԣ�Predicate����һ���������Filter����ɡ� |
| Predicate�����ԣ� | ·��ת�����ж����������ǿ���ͨ�� Predicate ��```HTTP �������ƥ�䣬��������ʽ������·��������ͷ�������ȣ�������������ƥ��ɹ���������ת������Ӧ�ķ��� |
| Filter���������� | �����������ǿ���ʹ����������������غ��޸ģ�������ʹ���������ĵ���Ӧ�����ٴ��� |

> ע�⣺���� Route �� Predicate ����ͬʱ������

#### Spring Cloud Gateway ������

Spring Cloud Gateway �����������ԣ�

*   ���� Spring Framework 5��Project Reactor �� Spring Boot 2.0 ������
*   �ܹ�����������������ƥ��·�ɡ�
*   predicates�����ԣ� �� filters�������������ض���·�ɵġ�
*   ������ Hystrix �۶�����
*   ������ Spring Cloud DiscoveryClient�������ֿͻ��ˣ���
*   ���ڱ�д���Ժ͹�������
*   �ܹ���������Ƶ�ʡ�
*   �ܹ���д����·����

## Gateway �Ĺ�������

Spring Cloud Gateway ������������ͼ��

![Spring Cloud Gateway ��������](http://c.biancheng.net/uploads/allimg/211210/101P45T2-1.png)
ͼ2��Spring Cloud Gateway ��������

Spring Cloud Gateway ��������˵�����£�

1.  �ͻ��˽������͵�```Spring Cloud Gateway �ϡ�
2.  Spring Cloud Gateway ͨ��```Gateway Handler Mapping �ҵ���������ƥ���·�ɣ����䷢�͸� Gateway Web Handler��
3.  Gateway Web Handler```ͨ��ָ���Ĺ���������Filter Chain����������ת����ʵ�ʵķ���ڵ��У�ִ��ҵ���߼�������Ӧ�����
4.  ������֮�������߷ֿ�����Ϊ���������ܻ���ת������֮ǰ��pre����֮��post��ִ��ҵ���߼���
5.  ��������Filter������������ת���������ǰ��������������غ��޸ģ��������У�顢Ȩ��У�顢������ء���־����Լ�Э��ת���ȡ�
6.  ��������������Ӧ���ؿͻ���֮ǰ������Ӧ�������غ��ٴ��������޸���Ӧ���ݻ���Ӧͷ����־�����������صȡ�
7.  ��Ӧԭ·���ظ��ͻ��ˡ�

�ܶ���֮���ͻ��˷��͵� Spring Cloud Gateway ��������Ҫͨ��һ����ƥ�����������ܶ�λ�������ķ���ڵ㡣�ڽ�����ת����������д���Ĺ���ǰ��pre �� post�������ǻ����Զ��������Ӧ����һЩ��ϸ�����ơ�

Predicate ����·�ɵ�ƥ���������� Filter ���Ƕ��������Ӧ���о�ϸ�����ƵĹ��ߡ�����������Ԫ�أ��ټ���Ŀ�� URI���Ϳ���ʵ��һ�������·���ˡ�

## Predicate ����

Spring Cloud Gateway ͨ��```Predicate ������ʵ�� Route ·�ɵ�ƥ����򡣼򵥵�˵��Predicate ��·��ת�����ж�����������ֻ�������� Predicate ���������Żᱻת����ָ���ķ����Ͻ��д���

ʹ�� Predicate ������Ҫע������ 3 �㣺

*   Route ·���� Predicate ���ԵĶ�Ӧ��ϵΪ��һ�Զࡱ��һ��·�ɿ��԰��������ͬ���ԡ�
*   һ��������Ҫת����ָ����·���ϣ��ͱ���ͬʱƥ��·���ϵ����ж��ԡ�
*   ��һ������ͬʱ������·�ɵĶ�������ʱ������ֻ�ᱻ�׸��ɹ�ƥ���·��ת����

![](http://c.biancheng.net/uploads/allimg/211210/101P42B6-2.png)
ͼ3��Predicate ����ƥ��

������ Predicate �������±�����ת���� URI Ϊ http://localhost:8001����

| ���� | ʾ�� | ˵�� |
| --- | --- | --- |
| Path | - Path=/dept/list/**``` | ������·���� /dept/list/** ƥ��ʱ����������ܱ�ת����```http://localhost:8001 �ϡ� |
| Before | - Before=2021-10-20T11:47:34.255+08:00[Asia/Shanghai] | ��```2021 �� 10 �� 20 �� 11 ʱ 47 �� 34.255 ��֮ǰ�����󣬲Żᱻת����```http://localhost:8001 �ϡ� |
| After | - After=2021-10-20T11:47:34.255+08:00[Asia/Shanghai] | �� 2021 �� 10 �� 20 �� 11 ʱ 47 �� 34.255 ��֮������󣬲Żᱻת����```http://localhost:8001 �ϡ� |
| Between | - Between=2021-10-20T15:18:33.226+08:00[Asia/Shanghai],2021-10-20T15:23:33.226+08:00[Asia/Shanghai] | �� 2021 �� 10 �� 20 �� 15 ʱ 18 �� 33.226 �� �� 2021 �� 10 �� 20 �� 15 ʱ 23 �� 33.226 ��֮������󣬲Żᱻת����```http://localhost:8001 �������ϡ� |
| Cookie | - Cookie=name,c.biancheng.net | Я��```Cookie �� Cookie ������Ϊ```name=c.biancheng.net �����󣬲Żᱻת���� http://localhost:8001 �ϡ� |
| Header | - Header=X-Request-Id,\d+ | ����ͷ��Я������ X-Request-Id ������ֵΪ���������󣬲Żᱻת���� http://localhost:8001 �ϡ� |
| Method | - Method=GET | ֻ�� GET ����Żᱻת���� http://localhost:8001 �ϡ� |

#### ʾ��

�������Ǿ�ͨ��һ��ʵ��������ʾ�� Predicate �����ʹ�õġ�

1\. �ڸ�����```spring-cloud-demo2 �´���һ����Ϊ```micro-service-cloud-gateway-9527 �� Spring Boot ģ�飬������ pom.xml ����������������������¡�





```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <artifactId>spring-cloud-demo2</artifactId>
        <groupId>net.biancheng.c</groupId>
        <version>0.0.1-SNAPSHOT</version>
    </parent>

    <groupId>net.biancheng.c</groupId>
    <artifactId>micro-service-cloud-gateway-9527</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>micro-service-cloud-gateway-9527</name>
    <description>Demo project for Spring Boot</description>
    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <!--�ر�ע�⣺�� gateway ���ط����в������� spring-boot-starter-web ������������ᱨ��-->
        <!-- Spring cloud gateway ��������-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-gateway</artifactId>
        </dependency>
        <!--Eureka �ͻ���-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```





2\. ��```micro-service-cloud-gateway-9527 ����·����/resources Ŀ¼���£��½�һ�������ļ� application.yml�������������¡�





```
server:
  port: 9527  #�˿ں�
spring:
  application:
    name: microServiceCloudGateway
  cloud:
    gateway: #����·������
      routes:
        #�� micro-service-cloud-provider-dept-8001 �ṩ�ķ�����������������¶���ͻ��ˣ�ֻ���ͻ��˱�¶ API ���صĵ�ַ 9527
        - id: provider_dept_list_routh   #·�� id,û�й̶����򣬵�Ψһ���������������Ӧ
          uri: http://localhost:8001          #ƥ����ṩ�����·�ɵ�ַ
          predicates:
            #�����Ƕ�����������ѡȫ����������
            - Path=/dept/list/**               #���ԣ�·��ƥ�� ע�⣺Path �� P Ϊ��д
            - Method=GET #ֻ��ʱ GET ����ʱ�����ܷ���

eureka:
  instance:
    instance-id: micro-service-cloud-gateway-9527
    hostname: micro-service-cloud-gateway
  client:
    fetch-registry: true
    register-with-eureka: true
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka/,http://eureka7002.com:7002/eureka/,http://eureka7003.com:7003/eureka/
```





���������У������� spring.cloud.gateway.routes ��ʹ�� predicates ���ԣ�������������������������

```
- Path=/dept/list/**            
- Method=GET
```

ֻ�е��ⲿ���ͻ��ˣ����͵� micro-service-cloud-gateway-9527 �� HTTP ����ͬʱ�����������еĶ���ʱ��������Żᱻת����ָ���ķ�����У��� http://localhost:8001����3\. ��```micro-service-cloud-gateway-9527 �����������ϣ�ʹ�� @EnableEurekaClient ע�⿪�� Eureka �ͻ��˹��ܣ��������¡�





```
package net.biancheng.c;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class MicroServiceCloudGateway9527Application {

    public static void main(String[] args) {
        SpringApplication.run(MicroServiceCloudGateway9527Application.class, args);
    }
}

```





4\. �������� Eureka ����ע�����ģ���Ⱥ����micro-service-cloud-provider-dept-8001 �Լ�```micro-service-cloud-gateway-9527��ʹ����������ʡ�http://localhost:9527/dept/list�����������ͼ��

![Spring Cloud ��������](http://c.biancheng.net/uploads/allimg/211210/101P43419-3.png)
ͼ4��Spring Cloud Gateway ·��ת��

## Spring Cloud Gateway ��̬·��

Ĭ������£�Spring Cloud Gateway ����ݷ���ע�����ģ����� Eureka Server����ά���ķ����б��Է�������spring.application.name����Ϊ·��������̬·�ɽ���ת�����Ӷ�ʵ�ֶ�̬·�ɹ��ܡ�

���ǿ����������ļ��У��� Route �� uri ��ַ�޸�Ϊ������ʽ��

```lb://service-name```

��������˵�����£�

*   lb��uri ��Э�飬��ʾ���� Spring Cloud Gateway �ĸ��ؾ��⹦�ܡ�
*   service-name����������Spring Cloud Gateway ���������ȡ�������΢�����ַ��

#### ʾ��

�������Ǿ�ͨ��һ��ʵ������չʾ�� Spring Cloud Gateway �����ʵ�ֶ�̬·�ɵġ�

1\. �޸�```micro-service-cloud-gateway-9527 �� application.yml �����ã�ʹ��ע�������е�΢������������̬·�ɽ���ת�����������¡�





```
server:
  port: 9527 #�˿ں�
 
spring:
  application:
    name: microServiceCloudGateway  #����ע������ע��ķ�����
   
  cloud:
    gateway: #����·������
      discovery:
        locator:
          enabled: true #Ĭ��ֵΪ true����Ĭ�Ͽ�����ע�����Ķ�̬����·�ɵĹ��ܣ�����΢����������·��

      routes:
        #�� micro-service-cloud-provider-dept-8001 �ṩ�ķ�����������������¶���ͻ��ˣ�ֻ���ͻ��˱�¶ API ���صĵ�ַ 9527
        - id: provider_dept_list_routh   #·�� id,û�й̶����򣬵�Ψһ���������������Ӧ
          uri: lb://MICROSERVICECLOUDPROVIDERDEPT #��̬·�ɣ�ʹ�÷�������������ľ�����˿�   http://eureka7001.com:9527/dept/list

          predicates:
            #�����Ƕ�����������ѡȫ����������
            - Path=/dept/list/**    #���ԣ�·��ƥ�� ע�⣺Path �� P Ϊ��д
            - Method=GET #ֻ��ʱ GET ����ʱ�����ܷ���

eureka:
  instance:
    instance-id: micro-service-cloud-gateway-9527
    hostname: micro-service-cloud-gateway
  client:
    fetch-registry: true
    register-with-eureka: true
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka/,http://eureka7002.com:7002/eureka/,http://eureka7003.com:7003/eureka/
```





2\. �������� Eureka ����ע�����ģ���Ⱥ���������ṩ�߼�Ⱥ��micro-service-cloud-provider-dept-8001/8002/8003���Լ�```micro-service-cloud-gateway-9527��

3\. ��������з��ʡ�http://localhost:9527/dept/list�����������ͼ��

![Gateway ��̬·��](http://c.biancheng.net/uploads/allimg/211210/101P46240-4.gif)
ͼ5��Spring Cloud ʵ�ֶ�̬·��

## Filter ������

ͨ������£����ڰ�ȫ����Ŀ��ǣ�������ṩ�ķ�������������һ����У���߼��������û���½״̬У�顢ǩ��У��ȡ�

��΢����ܹ��У�ϵͳ�ɶ��΢������ɣ�������Щ������Ҫ��ЩУ���߼�����ʱ���ǾͿ��Խ���ЩУ���߼�д�� Spring Cloud Gateway �� Filter �������С�

#### Filter �ķ���

Spring Cloud Gateway �ṩ�������������͵Ĺ����������Զ��������Ӧ���о�ϸ�����ơ�

| ���������� | ˵�� |
| --- | --- |
| Pre ���� | ���ֹ�����������ת����΢����֮ǰ���Զ�����������غ��޸ģ��������У�顢Ȩ��У�顢������ء���־����Լ�Э��ת���Ȳ����� |
| Post ���� | ���ֹ�������΢���������������Ӧ����Զ���Ӧ�������غ��ٴ��������޸���Ӧ���ݻ���Ӧͷ����־�����������صȡ� |

�������÷�Χ���֣�Spring Cloud gateway �� Filter ���Է�Ϊ 2 �ࣺ

*   GatewayFilter��Ӧ���ڵ���·�ɻ���һ��·���ϵĹ�������
*   GlobalFilter��Ӧ�������е�·���ϵĹ�������

#### GatewayFilter ���ع�����

GatewayFilter �� Spring Cloud Gateway �������ṩ��һ��Ӧ���ڵ�����һ��·���ϵĹ������������ԶԵ���·�ɻ���һ��·���ϴ��������ʹ�����Ӧ�������أ���ʵ��һЩ��ҵ���޹صĹ��ܣ������½״̬У�顢ǩ��У�顢Ȩ��У�顢��־�����������صȡ�

GatewayFilter �������ļ������� application.yml���е�д���� Predicate ���ƣ���ʽ���¡�





```

spring:
  cloud:
    gateway: 
      routes:
        - id: xxxx
          uri: xxxx
          predicates:
            - Path=xxxx
          filters:
            - AddRequestParameter=X-Request-Id,1024 #��������������ƥ�������ͷ����һ������ͷ������Ϊ X-Request-Id ֵΪ 1024
            - PrefixPath=/dept #������·��ǰ����� /dept
            ����
```





Spring Cloud Gateway �����˶�� 31 �� GatewayFilter���±����о��˼��ֳ��õ����ع���������ʹ��ʾ����

| ·�ɹ����� | ���� | ���� | ʹ��ʾ�� |
| --- | --- | --- | --- |
| AddRequestHeader | ```���ش�������󣬲������������һ��ָ��������ͷ������ | name����Ҫ��ӵ�����ͷ������ key��value����Ҫ��ӵ�����ͷ������ value�� | - AddRequestHeader=my-request-header,1024 |
| AddRequestParameter | ���ش�������󣬲������������һ��ָ������������� | name����Ҫ��ӵ���������� key��value����Ҫ��ӵ���������� value�� | - AddRequestParameter=my-request-param,c.biancheng.net |
| AddResponseHeader | ������Ӧ��������Ӧ�����һ��ָ������Ӧͷ������ | name����Ҫ��ӵ���Ӧͷ�� key��value����Ҫ��ӵ���Ӧͷ�� value�� | - AddResponseHeader=my-response-header,c.biancheng.net |
| PrefixPath | ���ش�������󣬲�������·������һ��ָ����ǰ׺�� | ```prefix����Ҫ���ӵ�·��ǰ׺�� | - PrefixPath=/consumer |
| PreserveHostHeader | ת������ʱ�����ֿͻ��˵� Host ��Ϣ���䣬Ȼ�������ݵ��ṩ��������΢�����С� | �� | - PreserveHostHeader |
| RemoveRequestHeader | �Ƴ�����ͷ��ָ���Ĳ����� | name����Ҫ�Ƴ�������ͷ�� key�� | - RemoveRequestHeader=my-request-header |
| RemoveResponseHeader | �Ƴ���Ӧͷ��ָ���Ĳ����� | name����Ҫ�Ƴ�����Ӧͷ�� | - RemoveResponseHeader=my-response-header |
| RemoveRequestParameter | �Ƴ�ָ������������� | name����Ҫ�Ƴ������������ | - RemoveRequestParameter=my-request-param |
| RequestSize | ����������Ĵ�С�������������ʱ�����᷵�� 413 Payload Too Large�� | maxSize��������Ĵ�С�� | - name: RequestSize`````````args:```````````````maxSize: 5000000 |

#### ʾ��

��������ͨ��һ��ʵ������ʾ GatewayFilter �����ã��������¡�

1\. ��```micro-service-cloud-gateway-9527 �� application.yml �������һ����̬·�ɣ������������¡�





```
spring:
  cloud:
    gateway: 
      routes:
        - id: xxxx
          uri: xxxx
          predicates:
            - Path=xxxx
          filters:
            - AddRequestParameter=X-Request-Id,1024 #��������������ƥ�������ͷ����һ������ͷ������Ϊ X-Request-Id ֵΪ 1024
            - PrefixPath=/dept #������·��ǰ����� /dept
            ����

```





2\. ����```micro-service-cloud-gateway-9527��ʹ����������ʡ�http://eureka7001.com:9527/get/1�����������ͼ��

![Gateway ·�ɹ�����](http://c.biancheng.net/uploads/allimg/211210/101P4J58-5.png)
ͼ6��·�ɹ�����ʾ��

#### GlobalFilter ȫ�ֹ�����

GlobalFilter ��һ�����������е�·���ϵ�ȫ�ֹ�������ͨ���������ǿ���ʵ��һЩͳһ����ҵ���ܣ�����Ȩ����֤��IP �������Ƶȡ���ĳ������·��ƥ��ʱ����ô���е� GlobalFilter ��͸�·���������õ� GatewayFilter ��ϳ�һ������������

Spring Cloud Gateway Ϊ�����ṩ�˶���Ĭ�ϵ� GlobalFilter��������ת����·�ɡ����ؾ������ص�ȫ�ֹ�����������ʵ�ʵ���Ŀ�����У�ͨ�����Ƕ����Զ���һЩ�Լ��� GlobalFilter ȫ�ֹ��������������������ҵ�����󣬶�����ֱ��ʹ�� Spring Cloud``` Config �ṩ��ЩĬ�ϵ� GlobalFilter��

> ����Ĭ�ϵ�ȫ�ֹ���������ϸ���ݣ���ο�```[Spring Cloud ����](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#global-filters)��

�������Ǿ�ͨ��һ��ʵ������ʾ�£�����Զ��� GlobalFilter ȫ�ֹ�������

1\. ��```net.biancheng.c.filter ���£��½�һ����Ϊ```MyGlobalFilter ȫ�ֹ����������࣬�������¡�





```
server:
  port: 9527 #�˿ں�
 
spring:
  application:
    name: microServiceCloudGateway  #����ע������ע��ķ�����
   
  cloud:
    gateway: #����·������
      discovery:
        locator:
          enabled: true #Ĭ��ֵΪ true����Ĭ�Ͽ�����ע�����Ķ�̬����·�ɵĹ��ܣ�����΢����������·��

      routes:
        #�� micro-service-cloud-provider-dept-8001 �ṩ�ķ�����������������¶���ͻ��ˣ�ֻ���ͻ��˱�¶ API ���صĵ�ַ 9527
        - id: provider_dept_list_routh   #·�� id,û�й̶����򣬵�Ψһ���������������Ӧ
          uri: lb://MICROSERVICECLOUDPROVIDERDEPT #��̬·�ɣ�ʹ�÷�������������ľ�����˿�   http://eureka7001.com:9527/dept/list

          predicates:
            #�����Ƕ�����������ѡȫ����������
            - Path=/dept/list/**    #���ԣ�·��ƥ�� ע�⣺Path �� P Ϊ��д
            - Method=GET #ֻ��ʱ GET ����ʱ�����ܷ���

eureka:
  instance:
    instance-id: micro-service-cloud-gateway-9527
    hostname: micro-service-cloud-gateway
  client:
    fetch-registry: true
    register-with-eureka: true
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka/,http://eureka7002.com:7002/eureka/,http://eureka7003.com:7003/eureka/

```





2\. ����```micro-service-cloud-gateway-9527��ʹ����������ʡ�http://eureka7001.com:9527/dept/list�������ǻᷢ�ַ��ʱ� 406 ���󣬿���̨������¡�

```2021-10-21 16:25:39.450  INFO 19116 --- [ctor-http-nio-4] net.biancheng.c.filter.MyGlobalFilter    : Thu Oct 21 16:25:39 CST 2021�����Զ����ȫ�ֹ����� MyGlobalFilter
2021-10-21 16:25:39.451  INFO 19116 --- [ctor-http-nio-4] net.biancheng.c.filter.MyGlobalFilter    : ���� uname ����Ϊ null��
```

3\. ʹ����������ʡ�http://eureka7001.com:9527/dept/list?uname=123��,�������ͼ��

![�Զ���ȫ�����ع�����](http://c.biancheng.net/uploads/allimg/211210/101P43096-6.png)
ͼ7���Զ���ȫ�����ع�����

# �ο�����
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud
https://github.com/macrozheng/springcloud-learning