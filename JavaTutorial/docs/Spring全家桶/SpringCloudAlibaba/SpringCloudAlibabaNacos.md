Nacos Ӣ��ȫ��Ϊ Dynamic Naming and Configuration Service����һ���ɰ���Ͱ��Ŷ�ʹ�� Java ���Կ����Ŀ�Դ��Ŀ��

Nacos ��һ�������ڰ���������ԭ��Ӧ�õĶ�̬�����֡����úͷ������ƽ̨���ο��� [Nacos ����](https://nacos.io/zh-cn/index.html)����

Nacos ���������� 3 ������ɣ�

| ��ɲ��� | ȫ��              | ����                                                         |
| -------- | ----------------- | ------------------------------------------------------------ |
| Na       | naming/nameServer | ������ע�����ģ��� Spring Cloud Eureka �Ĺ������ơ�          |
| co       | configuration     | ���������ģ��� Spring Cloud Config+Spring Cloud Bus �Ĺ������ơ� |
| s        | service           | �����񣬱�ʾ Nacos ʵ�ֵķ���ע�����ĺ��������Ķ����Է���Ϊ���ĵġ� |

���ǿ��Խ� Nacos ���ɷ���ע�����ĺ��������ĵ�����壬�������滻 [Eureka](http://c.biancheng.net/springcloud/eureka.html) ��Ϊ����ע�����ģ�ʵ�ַ����ע���뷢�֣��������滻 [Spring Cloud Config](http://c.biancheng.net/springcloud/config.html) ��Ϊ�������ģ�ʵ�����õĶ�̬ˢ�¡�

Nacos ��Ϊ����ע�����ľ�����ʮ�ꡰ˫ʮһ���ĺ�忼�飬���м����á��ȶ��ɿ�������׿Խ���ŵ㣬���԰����û������ݡ����׵ع����͹���΢����Ӧ�á�

Nacos ֧�ּ��������������͡����񡱵ķ��֡����ú͹���

*   [Kubernetes Service](https://kubernetes.io/docs/concepts/services-networking/service/)
*   [gRPC ](https://grpc.io/docs/what-is-grpc/core-concepts#service-definition)& [Dubbo RPC Service](https://dubbo.apache.org/zh/)
*   Spring Cloud RESTful Service

## Nacos ������

Nacos �ṩ��һϵ�м����õ����ԣ��ܹ��������ǿ��ٵ�ʵ�ֶ�̬�����֡��������õȹ��ܡ�

#### ������

Nacos ֧�ֻ��� DNS �� RPC �ķ����֡��������ṩ��ʹ��ԭ�� SDK��OpenAPI ��һ�������� Agent TODO �� Nacos ע�����󣬷��������߿����� Nacos ��ͨ�� DNS TODO �� HTTP&API ���ҡ����ַ���

#### ���񽡿����

Nacos �ṩ�Է����ʵʱ������飬�ܹ���ֹ�����͵����������������ʵ���ϡ�Nacos ���ṩ��һ����������Ǳ��̣��ܹ��������Ǹ��ݽ���״̬�������Ŀ����Լ�������

#### ��̬���÷���

��̬���÷�����������������Ļ����ⲿ���Ͷ�̬���ķ�ʽ���������л�����Ӧ�����úͷ������á�

��̬�������������ñ��ʱ���²���Ӧ�úͷ������Ҫ�������ù����ø��Ӹ�Ч�����ݡ�

�������Ļ�������ʵ����״̬�����ø��򵥣��÷����赯����չ��ø����ס�

Nacos �ṩ��һ��������õ� UI �������ǹ������з����Ӧ�õ����á�Nacos ���ṩ�������ð汾���١���˿ȸ������һ���ع������Լ��ͻ������ø���״̬�������ڵ�һϵ�п��伴�õ����ù������ԣ��������Ǹ���ȫ�������������й������ñ���ͽ������ñ�������ķ��ա�

#### ��̬ DNS ����

Nacos �ṩ�˶�̬ DNS �����ܹ������Ǹ����׵�ʵ�ָ��ؾ��⡢���������Լ��������������ļ� DNS ��������

Nacos �ṩ��һЩ�򵥵� DNS APIs TODO�����԰������ǹ������Ĺ��������Ϳ��õ� IP:PORT �б�

#### ������Ԫ���ݹ���

Nacos �������Ǵ�΢����ƽ̨������ӽǹ����������ĵ����з���Ԫ���ݣ��������������������������ڡ�����ľ�̬��������������Ľ���״̬���������������·�ɼ���ȫ���ԡ������ SLA �Լ� metrics ͳ�����ݡ�

## Nacos �������

�� Eureka ���ƣ�Nacos Ҳ���� CS��Client/Server���ͻ���/���������ܹ���������������������±�
��

| ���                                                         | ����                                                         | ����                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Nacos Server                                                 | Nacos ����ˣ��� Eureka Server ��ͬ��Nacos Server �ɰ���Ͱ��Ŷ�ʹ�� Java ���Ա�д���� Nacos Server �����ص�ַ���û����û�ֻ��Ҫֱ�����ز����м��ɡ� | Nacos Server ������Ϊ����ע�����ģ����� Nacos Client ʵ�ַ����ע���뷢�֡� |
| Nacos Server ������Ϊ�������ģ����� Nacos Client �ڲ�����������£�ʵ�����õĶ�̬ˢ�¡� |                                                              |                                                              |
| Nacos Client                                                 | Nacos �ͻ��ˣ�ͨ��ָ����΢����ܹ��еĸ����������û��Լ��������ʹ�ö������Ա�д�� | Nacos Client ͨ��������� spring-cloud-starter-alibaba-nacos-discovery���ڷ���ע�����ģ�Nacos Server����ʵ�ַ����ע���뷢�֡� |
| Nacos Client ͨ��������� spring-cloud-starter-alibaba-nacos-config�����������ģ�Nacos Server����ʵ�����õĶ�̬ˢ�¡� |                                                              |                                                              |

## Nacos ����ע������

Nacos ��Ϊ����ע�����Ŀ���ʵ�ַ����ע���뷢�֣���������ͼ��

![Nacos ����ע���뷢��](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1022563360-0.png)
ͼ1��Nacos ����ע���뷢��

��ͼ 1 �й��漰������ 3 ����ɫ��

*   ����ע�����ģ�Register Service��������һ�� Nacos Server������Ϊ�����ṩ�ߺͷ����������ṩ����ע��ͷ��ֹ��ܡ�
*   �����ṩ�ߣ�Provider Service��������һ�� Nacos Client�����ڶ�����������Լ��ṩ�ķ���ע�ᵽ����ע�����ģ��Թ����������߷��ֺ͵��á�
*   ���������ߣ�Consumer Service��������һ�� Nacos Client���������ѷ��������Դӷ���ע�����Ļ�ȡ�����б���������ķ���

Nacos ʵ�ַ���ע���뷢�ֵ��������£�

1.  �� Nacos �ٷ��ṩ������ҳ���У����� Nacos Server �����С�
2.  �����ṩ�� Nacos Client ����ʱ����ѷ����Է�������spring.application.name���ķ�ʽע�ᵽ����ע�����ģ�Nacos Server����
3.  ���������� Nacos Client ����ʱ��Ҳ�Ὣ�Լ��ķ���ע�ᵽ����ע�����ģ�
4.  ������������ע������ͬʱ��������ӷ���ע�����Ļ�ȡһ�ݷ���ע���б���Ϣ�����б��а���������ע�ᵽ����ע�������ϵķ������Ϣ�����������ṩ�ߺ��������Ϣ����
5.  �ڻ�ȡ�˷����ṩ�ߵ���Ϣ�󣬷���������ͨ�� HTTP ����Ϣ�м��Զ�̵��÷����ṩ���ṩ�ķ���

#### ��װ������ Nacos Server

���������� Nacos 2.0.3 Ϊ������ʾ����ΰ�װ������ Nacos Server���������¡�

1\. ʹ����������� [Nacos Server ����ҳ��](https://github.com/alibaba/nacos/releases/tag/2.0.3)������ҳ�����·�������� nacos-server-2.0.3.zip������ͼ��

![Nacos ����](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1022562c6-1.png)
ͼ2��Nacos Server ����

2\. ������ɺ󣬽�ѹ nacos-server-2.0.3.zip��Ŀ¼�ṹ���¡�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1022563922-2.png)
ͼ3��Nacos Server Ŀ¼�ṹ

Nacos Server �¸�Ŀ¼˵�����£�

*   bin�����ڴ�� Nacos �Ŀ�ִ�����
*   conf�����ڴ�� Nacos �����ļ���
*   target�����ڴ�� Nacos Ӧ�õ� jar ����

3\. �������д��ڣ���ת�� Nacos Server ��װĿ¼�� bin �£�ִ����������Ե���ģʽ���� Nacos Server��

startup.cmd -m standalone

4\. Nacos Server ������־���¡�

"nacos is starting with standalone"


         ,--.
       ,--.'|

   ,--,:  : |                                           Nacos 2.0.3
,`--.'`|  ' :                       ,---.               Running in stand alone mode, All function modules
|   :  :  | |                      '   ,'\   .--.--.    Port: 8848
:   |   \ | :  ,--.--.     ,---.  /   /   | /  /    '   Pid: 27512
|   : '  '; | /       \   /     \.   ; ,. :|  :  /`./   Console: http://192.168.3.138:8848/nacos/index.html
'   ' ;.    ;.--.  .-. | /    / ''   | |: :|  :  ;_
|   | | \   | \__\/: . ..    ' / '   | .; : \  \    `.      https://nacos.io
'   : |  ; .' ," .--.; |'   ; :__|   :    |  `----.   \
|   | '`--'  /  /  ,.  |'   | '.'|\   \  /  /  /`--'  /
'   : |     ;  :   .'   \   :    : `----'  '--'.     /
;   |.'     |  ,     .-./\   \  /            `--'---'
'---'        `--`---'     `----'
````
2021-11-08 16:16:38,877 INFO Bean 'org.springframework.security.access.expression.method.DefaultMethodSecurityExpressionHandler@5ab9b447' of type [org.springframework.security.access.expression.method
.DefaultMethodSecurityExpressionHandler] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying)
2021-11-08 16:16:38,884 INFO Bean 'methodSecurityMetadataSource' of type [org.springframework.security.access.method.DelegatingMethodSecurityMetadataSource] is not eligible for getting processed by al
l BeanPostProcessors (for example: not eligible for auto-proxying)
2021-11-08 16:16:40,001 INFO Tomcat initialized with port(s): 8848 (http)
2021-11-08 16:16:40,713 INFO Root WebApplicationContext: initialization completed in 14868 ms
2021-11-08 16:16:52,351 INFO Initializing ExecutorService 'applicationTaskExecutor'
2021-11-08 16:16:52,560 INFO Adding welcome page: class path resource [static/index.html]
2021-11-08 16:16:54,239 INFO Creating filter chain: Ant [pattern='/**'], []
2021-11-08 16:16:54,344 INFO Creating filter chain: any request, [org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter@7dd611c8, org.springframework.security.web.con
text.SecurityContextPersistenceFilter@5c7668ba, org.springframework.security.web.header.HeaderWriterFilter@fb713e7, org.springframework.security.web.csrf.CsrfFilter@6ec7bce0, org.springframework.secur
ity.web.authentication.logout.LogoutFilter@7d9ba6c, org.springframework.security.web.savedrequest.RequestCacheAwareFilter@158f4cfe, org.springframework.security.web.servletapi.SecurityContextHolderAwa
reRequestFilter@6c6333cd, org.springframework.security.web.authentication.AnonymousAuthenticationFilter@5d425813, org.springframework.security.web.session.SessionManagementFilter@13741d5a, org.springf
ramework.security.web.access.ExceptionTranslationFilter@3727f0ee]
2021-11-08 16:16:54,948 INFO Initializing ExecutorService 'taskScheduler'
2021-11-08 16:16:54,977 INFO Exposing 16 endpoint(s) beneath base path '/actuator'
2021-11-08 16:16:55,309 INFO Tomcat started on port(s): 8848 (http) with context path '/nacos'
2021-11-08 16:16:55,319 INFO Nacos started successfully in stand alone mode. use embedded storage
````
5\. ʹ����������ʡ�http://localhost:8848/nacos������ת�� Nacos Server ��½ҳ�棬����ͼ��

![Nacos ��½ҳ��](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1022562045-3.png)
ͼ4��Nacos Server ��½ҳ��

6\. �ڵ�½ҳ�����¼�������루Ĭ�϶��� nacos��������ύ��ť����ת�� Nacos Server ����̨��ҳ������ͼ��

![Nacos Server ��ҳ](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/10225633C-4.png)
ͼ5��Nacos Server ����̨

�Դˣ����Ǿ������ Nacos Server �����ء���װ�����й�����

#### ������ṩ��

���������������һ�������ṩ�ߣ��������¡�

1. ����һ����Ϊ spring-cloud-alibaba-demo �� Maven ���� ���ù��̵� pom.xml �������¡�




````
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <packaging>pom</packaging>
    <parent>
        <groupId>org.springframework.boot</groupId>
        spring-boot-starter-parent
        <version>2.5.6</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>net.biancheng.c</groupId>
    spring-cloud-alibaba-demo
    <version>1.0-SNAPSHOT</version>


    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <junit.version>4.12</junit.version>
        <log4j.version>1.2.17</log4j.version>
        <lombok.version>1.16.18</lombok.version>
        <spring-cloud.version>2020.0.4</spring-cloud.version>
    </properties>
    <dependencyManagement>
        <dependencies>
            <!--Spring Cloud Alibaba �İ汾��Ϣ-->
            <dependency>
                <groupId>com.alibaba.cloud</groupId>
                spring-cloud-alibaba-dependencies
                <version>2021.1</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <!--Spring Cloud �İ汾��Ϣ-->
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                spring-cloud-dependencies
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

</project>
````




> �ڸù��̵� pom.xml �У�����ͨ�� dependencyManagement �� Spring Cloud Alibaba �İ汾��Ϣ���й����ù����µĸ�����ģ�������� Spring Cloud Alibaba �ĸ������ʱ�Ͳ�Ҫ����ָ���汾���ˡ�

2\. �� spring-cloud-alibaba-demo �£�����һ����Ϊ spring-cloud-alibaba-provider-8001 �� Spring Boot ģ�飬������ pom.xml ����������������������¡�




````
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <!--������-->
    <parent>
        <groupId>net.biancheng.c</groupId>
        <version>1.0-SNAPSHOT</version>
        spring-cloud-alibaba-demo
    </parent>


    <groupId>net.biancheng.c</groupId>
    spring-cloud-alibaba-provider-8001
    <version>0.0.1-SNAPSHOT</version>
    <name>spring-cloud-alibaba-provider-8001</name>
    <description>Demo project for Spring Boot</description>
    <properties>
        <java.version>1.8</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            spring-boot-starter-web
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            spring-boot-devtools
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            lombok
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            spring-boot-starter-test
            <scope>test</scope>
        </dependency>
        <!--Spring Cloud Alibaba Nacos discovery -->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            spring-cloud-starter-alibaba-nacos-discovery
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                spring-boot-maven-plugin
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            lombok
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>

````



3\. �� spring-cloud-alibaba-provider-8001 �������ļ� application.properties ������������ã��������¡�
````
#�˿ں�
server.port=8001
#������
spring.application.name=spring-cloud-alibaba-provider
#Nacos Server �ĵ�ַ
spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848
management.endpoints.web.exposure.include=*
````

4\. �� net.biacheng.c.controller ���£�����һ����Ϊ DeptController �� Controller �࣬�������¡�




````
package net.biancheng.c.controller;


import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
public class DeptController {
    @Value("${server.port}")
    private String serverPort;

    @GetMapping(value = "/dept/nacos/{id}")
    public String getPayment(@PathVariable("id") Integer id) {
        return "<h2>c������������������������ʳɹ���</h2>��������spring-cloud-alibaba-provider<br /> �˿ںţ� " + serverPort + "<br /> ����Ĳ�����" + id;
    }

}

````



5\. �� spring-cloud-alibaba-provider-8001 �����������ϣ�ʹ�� @EnableDiscoveryClient ע�⿪�� Nacos �����ֹ��ܣ��������¡�





package net.biancheng.c;

````
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient //���������ֹ���
public class SpringCloudAlibabaProvider8001Application {

    public static void main(String[] args) {
        SpringApplication.run(SpringCloudAlibabaProvider8001Application.class, args);
    }

}
````




6\. ���� spring-cloud-alibaba-provider-8001��ʹ����������ʡ�http://localhost:8001/dept/nacos/1�����������ͼ��

![���ʷ����ṩ�ߵķ���](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/10225C033-5.png)
ͼ6�������ṩ��

7\. ʹ����������ʡ�http://localhost:8848/nacos�����鿴����������µġ������б�������ͼ��

[![Nacos �����б�](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/10225Ab5-6.png)](http://new-local.weixueyuan.net/uploads/allimg/211108/6-21110QJ12b02.png)
ͼ7������ע���б�

��ͼ 7 ���Կ��������Ǵ�ķ����ṩ�� spring-cloud-alibaba-provider-8001 ���ṩ�ķ����Ѿ���ע�ᵽ�� Nacos Server ���ˡ�

#### �����������

���棬���Ǿ����һ������������������ spring-cloud-alibaba-provider-8001 �ṩ�ķ��񣬲������¡�

1\. �������� spring-cloud-alibaba-demo �£�����һ����Ϊ spring-cloud-alibaba-consumer-nacos-8801 �� Spring Boot ģ�飬������ pom.xml ���������������



````

<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>net.biancheng.c</groupId>
        <version>1.0-SNAPSHOT</version>
        spring-cloud-alibaba-demo
    </parent>
    <groupId>net.biancheng.c</groupId>
    spring-cloud-alibaba-consumer-nacos-8081
    <version>0.0.1-SNAPSHOT</version>
    <name>spring-cloud-alibaba-consumer-nacos-8081</name>
    <description>Demo project for Spring Boot</description>
    <properties>
        <java.version>1.8</java.version>
    </properties>
    <dependencies>
        <!--SpringCloud ailibaba nacos discovery-->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            spring-cloud-starter-alibaba-nacos-discovery
        </dependency>
        <!--���� Netflix Ribbon ����ͣ��ά���׶Σ�����°汾�� Nacos discovery ���Ѿ��Ƴ��� Ribbon ����ʱ������Ҫ���� loadbalancer ���� -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            spring-cloud-loadbalancer
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            spring-boot-starter-web
        </dependency>


        <dependency>
            <groupId>org.springframework.boot</groupId>
            spring-boot-devtools
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            lombok
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            spring-boot-starter-test
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                spring-boot-maven-plugin
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            lombok
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>

````




> ע�⣺���� Netflix Ribbon �Ѿ�����ͣ��ά��״̬��Nacos Discovery �Ѿ�ͣ�˶� Ribbon ��֧�֣����������Ҫ�ڷ��������ߵ� pom.xml ������ spring-cloud-loadbalancer ���ܵ��÷����ṩ���ṩ�ķ���

2\. �� spring-cloud-alibaba-consumer-nacos-8801 �������ļ� application.yml �У�����������á�


````


server:
  port: 8801  #�˿ں�
spring:
  application:
    name: spring-cloud-alibaba-consumer #������
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848  #Nacos server �ĵ�ַ
````

#����������Ϣ������Ĭ�����ã����������Զ�������ã�Ŀ���ǲ��� Controller ��Ӳ��������ṩ�ߵķ�����
````
service-url:
  nacos-user-service: http://spring-cloud-alibaba-provider #�����ṩ�ߵķ�����
````




3\. �� spring-cloud-alibaba-consumer-nacos-8801 �����������ϣ�ʹ�� @EnableDiscoveryClient ע�⿪�������ֹ��ܣ��������¡�




````
package net.biancheng.c;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient // ��������ע���뷢�ֹ���
public class SpringCloudAlibabaConsumerNacos8801Application {

    public static void main(String[] args) {
        SpringApplication.run(SpringCloudAlibabaConsumerNacos8081Application.class, args);
    }

}
````




4\. �� net.biancheng.c.config ���´���һ����Ϊ ApplicationContextBean �������࣬��ʹ�� @LoadBalanced ע���� Ribbon ���м��ɿ������ؾ��⹦�ܣ��������¡�




````
package net.biancheng.c.config;


import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class ApplicationContextBean {

    @Bean
    @LoadBalanced //�� Ribbon ���ɣ����������ؾ��⹦��
    public RestTemplate getRestTemplate() {
        return new RestTemplate();
    }

}

````



5\. �� net.biancheng.c.controller ���£�����һ����Ϊ DeptController_Consumer �� Controller �࣬�������¡�




````
package net.biancheng.c.controller;


import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import javax.annotation.Resource;

@RestController
@Slf4j
public class DeptController_Consumer {

    @Resource
    private RestTemplate restTemplate;
    
    @Value("${service-url.nacos-user-service}")
    private String serverURL; //�����ṩ�ߵķ�����
    
    @GetMapping("/consumer/dept/nacos/{id}")
    public String paymentInfo(@PathVariable("id") Long id) {
        return restTemplate.getForObject(serverURL + "/dept/nacos/" + id, String.class);
    }

}
````




6\. ���� spring-cloud-alibaba-consumer-nacos-8801���鿴 Nacos Server �ķ����б�����ͼ��

[![������������ Nacos Server ](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/10225621N-7.png)](http://new-local.weixueyuan.net/uploads/allimg/211109/6-21110Z91435H1.png)
ͼ8������������

7\. ʹ����������ʡ�http://localhost:8801/consumer/dept/nacos/1�����������ͼ��

![Nacos �������������ѷ���](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/10225B156-8.png)
ͼ9�����������ߵ��÷���

## Nacos ��������

Nacos Server ��������Ϊ�������ģ��� Spring Cloud Ӧ�õ��ⲿ���ý���ͳһ�ؼ��л�����������ֻ��Ҫ��Ӧ�õ� POM �ļ������� spring-cloud-starter-alibaba-nacos-config ����ʵ�����õĻ�ȡ�붯̬ˢ�¡�

�����ù���ĽǶȿ���Nacos ����˵�� Spring Cloud Config ���������������Ⱥ��� Nacos ��ʹ�ø��򵥣���������Ҳ���١�

������������ͨ��һ��ʵ������ʾ�� Nacos �����ʵ�����õ�ͳһ����Ͷ�̬ˢ�µġ�

1\. �������� spring-cloud-alibaba-demo �£�����һ����Ϊ spring-cloud-alibaba-config-client-3377 �� Spring Boot ģ�飬������ pom.xml ���������������



````

<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>net.biancheng.c</groupId>
        <version>1.0-SNAPSHOT</version>
        spring-cloud-alibaba-demo
    </parent>
    <groupId>net.biancheng.c</groupId>
    spring-cloud-alibaba-config-client-3377
    <version>0.0.1-SNAPSHOT</version>
    <name>spring-cloud-alibaba-nacos-config-client-3377</name>
    <description>Demo project for Spring Boot</description>
    <properties>
        <java.version>1.8</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            spring-boot-starter-web
        </dependency>
        <!--SpringCloud2020���Ժ�İ汾Ĭ�ϲ����� bootstrap ���ã�������Ҫ��pom������ʽ�����룺-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            spring-cloud-starter-bootstrap
        </dependency>


        <dependency>
            <groupId>org.springframework.boot</groupId>
            spring-boot-devtools
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            lombok
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            spring-boot-starter-test
            <scope>test</scope>
        </dependency>
        <!--Spring Cloud Alibaba Config ����-->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            spring-cloud-starter-alibaba-nacos-config
        </dependency>
        <!--SpringCloud ailibaba nacos ����ע���뷢��ģ�� -->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            spring-cloud-starter-alibaba-nacos-discovery
        </dependency>
        <!--Spring Boot ���ģ��-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            spring-boot-starter-actuator
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                spring-boot-maven-plugin
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            lombok
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>

````



> ע�⣺����ʹ�õ� Spring Cloud 2020 �汾Ĭ�ϲ����� bootstrap������Ҫ��Ӧ������ʱ���� bootstrap ���ã����� bootstrap.yml �� bootstrap.properties��������Ҫ������ pom.xml ����ʽ������ spring-cloud-starter-bootstrap ������

2\. �� spring-cloud-alibaba-config-client-3377 ����·�������� /resources Ŀ¼���£����һ�� bootstrap.yml�������������¡�




````
server:
  port: 3377 #�˿ں�
spring:
  application:
    name: config-client #������
  cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848 #Nacos����ע�����ĵ�ַ


      config:
        server-addr: 127.0.0.1:8848 #Nacos��Ϊ�������ĵ�ַ
        file-extension: yaml #ָ��yaml��ʽ������

````



3\. �� spring-cloud-alibaba-config-client-3377 ����·�������� /resources Ŀ¼���£����һ�� application.yml�������������¡�




````
spring:
  profiles:
    active: dev #���� dev ������

````




4\. �� net.biancheng.c.controller ���£�����һ����Ϊ ConfigClientController �� Controller �࣬���ڸ�����ʹ�� @RefreshScope ע��ʵ�����õ��Զ����£��������¡�




````
package net.biancheng.c.controller;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RefreshScope
public class ConfigClientController {

    @Value("${config.info}")
    private String ConfigInfo;
    
    @GetMapping("/config/info")
    public String getConfigInfo(){
        return ConfigInfo;
    }

}
````




5\. �� spring-cloud-alibaba-config-client-3377 �����������ϣ�ʹ�� @EnableDiscoveryClient ע�⿪�������ֹ��ܣ��������¡�




````
package net.biancheng.c;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class SpringCloudAlibabaNacosConfigClient3377Application {

    public static void main(String[] args) {
        SpringApplication.run(SpringCloudAlibabaNacosConfigClient3377Application.class, args);
    }

}
````




6\. ���� Nacos Server������ Nacos Server ����̨�ġ����ù����µġ������б��У������+����ť���½��������á�
````
Data ID:        config-client-dev.yaml


Group  :        DEFAULT_GROUP

���ø�ʽ:        YAML

��������:      config:
                  info: c.biancheng.net
````
�� Nacos Server �У����õ� dataId���� Data ID����������ʽ���£�
````
${prefix}-${spring.profiles.active}.${file-extension}
````
dataId ��ʽ�и�����˵�����£�

*   ${prefix}��Ĭ��ȡֵΪ΢����ķ��������������ļ��� spring.application.name ��ֵ�����ǿ����������ļ���ͨ������ spring.cloud.nacos.config.prefix ��ָ����
*   ${spring.profiles.active}����ʾ��ǰ������Ӧ�� Profile������ dev��test��prod �ȡ���û��ָ�������� Profile ʱ�����Ӧ�����ӷ�Ҳ�������ڣ� dataId �ĸ�ʽ��� ${prefix}.${file-extension}��
*   ${file-extension}����ʾ�������ݵ����ݸ�ʽ�����ǿ����������ļ���ͨ�������� spring.cloud.nacos.config.file-extension �����ã����� properties �� yaml��

7\. ���� spring-cloud-alibaba-config-client-3377����ʹ����������ʡ�http://localhost:3377/config/info�����������ͼ��

![Nacos Config](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/10225B3C-9.png)
ͼ10��Nacos Config

8\. �� Nacos Server �У��� config-client-dev.yaml �е������޸ĳ��������ݡ�
````
config:
    info: this is c.biancheng.net
````

9\. �ڲ����� spring-cloud-alibaba-config-client-3377 ������£�ʹ��������ٴη��ʡ�http://localhost:3377/config/info�����������ͼ��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1022563A7-10.png)
ͼ11��Nacos Cofig

## Nacos Server ��Ⱥ������

��ʵ�ʵ���Ŀ�����У�һ��΢����ϵͳ������ʮ������ʮ���������ٸ�΢������ɡ� ��Щ������ȫ��ע�ᵽͬһ̨ Nacos Server���ͼ��п��ܵ��� Nacos Server ��Ϊ�����ظ������������յ�������΢����ϵͳ̱����������������ֱ�ӵİ취����ʹ�� Nacos Server ��Ⱥ��

Nacos Server �ļ�Ⱥ��������һ��ʮ�����Ե��ŵ㣬�Ǿ��ǿ��Ա���ϵͳ�ĸ߿����ԡ��ڼ�Ⱥ�������У�ֻҪ�������е� Nacos Server ��ֹͣ������Nacos Client �ͻ����ԴӼ�Ⱥ�������� Nacos Server �ϻ�ȡ������Ϣ�����ã������ᵼ��ϵͳ������̱��������� Nacos Server ��Ⱥ������ĸ߿����ԡ�

��ͼչʾ�� Nacos Server ��Ⱥ������Ļ����ܹ���

![Nacos Server ��Ⱥ�ܹ�](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1022563543-11.png)
ͼ12��Nacos Server ��Ⱥ�ܹ�

���������� Windows ϵͳΪ������ʾ��β��� Nacos Server ��Ⱥ��

1\. �� MySQL �У��½�һ����Ϊ nacos_config �����ݿ�ʵ�������ڸ����ݿ���ִ������ SQL ��䡣
````
/******************************************/
/*   ���ݿ�ȫ�� = nacos_config   */
/*   ������ = config_info   */
/******************************************/
CREATE TABLE `config_info` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `data_id` varchar(255) NOT NULL COMMENT 'data_id',
  `group_id` varchar(255) DEFAULT NULL,
  `content` longtext NOT NULL COMMENT 'content',
  `md5` varchar(32) DEFAULT NULL COMMENT 'md5',
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '����ʱ��',
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '�޸�ʱ��',
  `src_user` text COMMENT 'source user',
  `src_ip` varchar(50) DEFAULT NULL COMMENT 'source ip',
  `app_name` varchar(128) DEFAULT NULL,
  `tenant_id` varchar(128) DEFAULT '' COMMENT '�⻧�ֶ�',
  `c_desc` varchar(256) DEFAULT NULL,
  `c_use` varchar(64) DEFAULT NULL,
  `effect` varchar(64) DEFAULT NULL,
  `type` varchar(64) DEFAULT NULL,
  `c_schema` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_configinfo_datagrouptenant` (`data_id`,`group_id`,`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='config_info';


/******************************************/
/*   ���ݿ�ȫ�� = nacos_config   */
/*   ������ = config_info_aggr   */
/******************************************/
CREATE TABLE `config_info_aggr` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `data_id` varchar(255) NOT NULL COMMENT 'data_id',
  `group_id` varchar(255) NOT NULL COMMENT 'group_id',
  `datum_id` varchar(255) NOT NULL COMMENT 'datum_id',
  `content` longtext NOT NULL COMMENT '����',
  `gmt_modified` datetime NOT NULL COMMENT '�޸�ʱ��',
  `app_name` varchar(128) DEFAULT NULL,
  `tenant_id` varchar(128) DEFAULT '' COMMENT '�⻧�ֶ�',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_configinfoaggr_datagrouptenantdatum` (`data_id`,`group_id`,`tenant_id`,`datum_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='�����⻧�ֶ�';

/******************************************/
/*   ���ݿ�ȫ�� = nacos_config   */
/*   ������ = config_info_beta   */
/******************************************/
CREATE TABLE `config_info_beta` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `data_id` varchar(255) NOT NULL COMMENT 'data_id',
  `group_id` varchar(128) NOT NULL COMMENT 'group_id',
  `app_name` varchar(128) DEFAULT NULL COMMENT 'app_name',
  `content` longtext NOT NULL COMMENT 'content',
  `beta_ips` varchar(1024) DEFAULT NULL COMMENT 'betaIps',
  `md5` varchar(32) DEFAULT NULL COMMENT 'md5',
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '����ʱ��',
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '�޸�ʱ��',
  `src_user` text COMMENT 'source user',
  `src_ip` varchar(50) DEFAULT NULL COMMENT 'source ip',
  `tenant_id` varchar(128) DEFAULT '' COMMENT '�⻧�ֶ�',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_configinfobeta_datagrouptenant` (`data_id`,`group_id`,`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='config_info_beta';

/******************************************/
/*   ���ݿ�ȫ�� = nacos_config   */
/*   ������ = config_info_tag   */
/******************************************/
CREATE TABLE `config_info_tag` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `data_id` varchar(255) NOT NULL COMMENT 'data_id',
  `group_id` varchar(128) NOT NULL COMMENT 'group_id',
  `tenant_id` varchar(128) DEFAULT '' COMMENT 'tenant_id',
  `tag_id` varchar(128) NOT NULL COMMENT 'tag_id',
  `app_name` varchar(128) DEFAULT NULL COMMENT 'app_name',
  `content` longtext NOT NULL COMMENT 'content',
  `md5` varchar(32) DEFAULT NULL COMMENT 'md5',
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '����ʱ��',
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '�޸�ʱ��',
  `src_user` text COMMENT 'source user',
  `src_ip` varchar(50) DEFAULT NULL COMMENT 'source ip',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_configinfotag_datagrouptenanttag` (`data_id`,`group_id`,`tenant_id`,`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='config_info_tag';

/******************************************/
/*   ���ݿ�ȫ�� = nacos_config   */
/*   ������ = config_tags_relation   */
/******************************************/
CREATE TABLE `config_tags_relation` (
  `id` bigint(20) NOT NULL COMMENT 'id',
  `tag_name` varchar(128) NOT NULL COMMENT 'tag_name',
  `tag_type` varchar(64) DEFAULT NULL COMMENT 'tag_type',
  `data_id` varchar(255) NOT NULL COMMENT 'data_id',
  `group_id` varchar(128) NOT NULL COMMENT 'group_id',
  `tenant_id` varchar(128) DEFAULT '' COMMENT 'tenant_id',
  `nid` bigint(20) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`nid`),
  UNIQUE KEY `uk_configtagrelation_configidtag` (`id`,`tag_name`,`tag_type`),
  KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='config_tag_relation';

/******************************************/
/*   ���ݿ�ȫ�� = nacos_config   */
/*   ������ = group_capacity   */
/******************************************/
CREATE TABLE `group_capacity` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '����ID',
  `group_id` varchar(128) NOT NULL DEFAULT '' COMMENT 'Group ID�����ַ���ʾ������Ⱥ',
  `quota` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '��0��ʾʹ��Ĭ��ֵ',
  `usage` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'ʹ����',
  `max_size` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '�������ô�С���ޣ���λΪ�ֽڣ�0��ʾʹ��Ĭ��ֵ',
  `max_aggr_count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '�ۺ�����������������0��ʾʹ��Ĭ��ֵ',
  `max_aggr_size` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '�����ۺ����ݵ������ô�С���ޣ���λΪ�ֽڣ�0��ʾʹ��Ĭ��ֵ',
  `max_history_count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '�������ʷ����',
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '����ʱ��',
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '�޸�ʱ��',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_group_id` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='��Ⱥ����Group������Ϣ��';

/******************************************/
/*   ���ݿ�ȫ�� = nacos_config   */
/*   ������ = his_config_info   */
/******************************************/
CREATE TABLE `his_config_info` (
  `id` bigint(64) unsigned NOT NULL,
  `nid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `data_id` varchar(255) NOT NULL,
  `group_id` varchar(128) NOT NULL,
  `app_name` varchar(128) DEFAULT NULL COMMENT 'app_name',
  `content` longtext NOT NULL,
  `md5` varchar(32) DEFAULT NULL,
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `src_user` text,
  `src_ip` varchar(50) DEFAULT NULL,
  `op_type` char(10) DEFAULT NULL,
  `tenant_id` varchar(128) DEFAULT '' COMMENT '�⻧�ֶ�',
  PRIMARY KEY (`nid`),
  KEY `idx_gmt_create` (`gmt_create`),
  KEY `idx_gmt_modified` (`gmt_modified`),
  KEY `idx_did` (`data_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='���⻧����';

/******************************************/
/*   ���ݿ�ȫ�� = nacos_config   */
/*   ������ = tenant_capacity   */
/******************************************/
CREATE TABLE `tenant_capacity` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '����ID',
  `tenant_id` varchar(128) NOT NULL DEFAULT '' COMMENT 'Tenant ID',
  `quota` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '��0��ʾʹ��Ĭ��ֵ',
  `usage` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'ʹ����',
  `max_size` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '�������ô�С���ޣ���λΪ�ֽڣ�0��ʾʹ��Ĭ��ֵ',
  `max_aggr_count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '�ۺ�������������',
  `max_aggr_size` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '�����ۺ����ݵ������ô�С���ޣ���λΪ�ֽڣ�0��ʾʹ��Ĭ��ֵ',
  `max_history_count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '�������ʷ����',
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '����ʱ��',
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '�޸�ʱ��',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='�⻧������Ϣ��';

CREATE TABLE `tenant_info` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `kp` varchar(128) NOT NULL COMMENT 'kp',
  `tenant_id` varchar(128) default '' COMMENT 'tenant_id',
  `tenant_name` varchar(128) default '' COMMENT 'tenant_name',
  `tenant_desc` varchar(256) DEFAULT NULL COMMENT 'tenant_desc',
  `create_source` varchar(32) DEFAULT NULL COMMENT 'create_source',
  `gmt_create` bigint(20) NOT NULL COMMENT '����ʱ��',
  `gmt_modified` bigint(20) NOT NULL COMMENT '�޸�ʱ��',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_info_kptenantid` (`kp`,`tenant_id`),
  KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='tenant_info';

CREATE TABLE `users` (
`username` varchar(50) NOT NULL PRIMARY KEY,
`password` varchar(500) NOT NULL,
`enabled` boolean NOT NULL
);

CREATE TABLE `roles` (
`username` varchar(50) NOT NULL,
`role` varchar(50) NOT NULL,
UNIQUE INDEX `idx_user_role` (`username` ASC, `role` ASC) USING BTREE
);

CREATE TABLE `permissions` (
    `role` varchar(50) NOT NULL,
    `resource` varchar(255) NOT NULL,
    `action` varchar(8) NOT NULL,
    UNIQUE INDEX `uk_role_permission` (`role`,`resource`,`action`) USING BTREE
);

INSERT INTO users (username, password, enabled) VALUES ('nacos', '$2a$10$EuWPZHzz32dJN7jexM34MOeYirDdFAZm2kuWj7VEOJhhZkDrxfvUu', TRUE);

INSERT INTO roles (username, role) VALUES ('nacos', 'ROLE_ADMIN');
````
2\. �� Nacos Server ��װĿ¼�µ� conf �ļ����У��� cluster.conf.example ������Ϊ cluster.conf��Ȼ���ڸ��ļ�������������ݡ�

    192.168.3.138:3333
    192.168.3.138:4444
    192.168.3.138:5555


����˵�����£�

*   192.168.138 Ϊ���ص��������� IP ��ַ��������ò�Ҫд�� localhost �� 127.0.0.1������ Nacos Server ��Ⱥ���ܻ�ʧ�ܣ�
*   ���δ�� Nacos Server ��Ⱥ�Ķ˿ڷֱ�Ϊ��3333��4444��5555��

3\. �� config Ŀ¼�µ� application.properties �У��� server.port���˿ںţ��޸�Ϊ 3333�����ڸ��ļ������ MySQL ���ݿ����ã������޸��������¡�
````
server.port=3333
################ MySQL ���ݿ�����##################
spring.datasource.platform=mysql


db.num=1
db.url.0=jdbc:mysql://127.0.0.1:3306/nacos_config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=Asia/Shanghai
db.user=root
db.password=root
````
4\. ���� Nacos Server Ŀ¼���Ƶ�������̨�����ϣ��������ǵĶ˿ںŷֱ��޸�Ϊ�� 4444 �� 5555��

5\. ���� Nginx�����޸� Nginx �� conf Ŀ¼�µ� nginx.conf �����ã��������¡�
````
#user  nobody;
worker_processes  1;


#error_log  logs/error.log;

#error_log  logs/error.log  notice;

#error_log  logs/error.log  info;

#pid        logs/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;
    upstream cluster{
        server 127.0.0.1:3333;
        server 127.0.0.1:4444;
        server 127.0.0.1:5555;
    }

    server {
        listen       1111;
        server_name  localhost;
        #charset koi8-r;
        #access_log  logs/host.access.log  main;
        location / {
            #root   html;
            #index  index.html index.htm;
            proxy_pass http://cluster;
        }
    }

}
````
6\. ������Ⱥ�����е� Nacos Server����������������ʱ����ʾ Nacos Server �����ɹ���
````
"nacos is starting with cluster"


         ,--.
       ,--.'|

   ,--,:  : |                                           Nacos 2.0.3
,`--.'`|  ' :                       ,---.               Running in cluster mode, All function modules
|   :  :  | |                      '   ,'\   .--.--.    Port: ****
:   |   \ | :  ,--.--.     ,---.  /   /   | /  /    '   Pid: 21592
|   : '  '; | /       \   /     \.   ; ,. :|  :  /`./   Console: http://192.168.3.138:3333/nacos/index.html
'   ' ;.    ;.--.  .-. | /    / ''   | |: :|  :  ;_
|   | | \   | \__\/: . ..    ' / '   | .; : \  \    `.      https://nacos.io
'   : |  ; .' ," .--.; |'   ; :__|   :    |  `----.   \
|   | '`--'  /  /  ,.  |'   | '.'|\   \  /  /  /`--'  /
'   : |     ;  :   .'   \   :    : `----'  '--'.     /
;   |.'     |  ,     .-./\   \  /            `--'---'
'---'        `--`---'     `----'

2021-11-09 16:25:00,993 INFO The server IP list of Nacos is [192.168.3.138:3333, 192.168.3.138:4444, 192.168.3.138:5555]

2021-11-09 16:27:07,318 INFO Nacos is starting...

2021-11-09 16:27:08,325 INFO Nacos is starting...

2021-11-09 16:27:09,340 INFO Nacos is starting...

2021-11-09 16:27:10,343 INFO Nacos is starting...

2021-11-09 16:27:10,742 INFO Nacos started successfully in cluster mode. use external storage
````
7\. ����Ⱥ�е����� Nacos Server �������ɹ���˫�� Nignx ��װĿ¼�µ� nginx.exe������ Nginx��

![Nginx ](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/10225BO0-12.png)
ͼ13��Nginx �����ű�

8\. ʹ����������ʡ�http://localhost:1111/nacos/�������ɹ����� Nacos Server �Ŀ���̨����˵�� Nacos ��Ⱥ����ɹ�������ͼ��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/10225C554-13.png)
ͼ14��Nacos ��Ⱥ

9\. �������� spring-cloud-alibaba-demo ��������ģ�������ļ��е� Nacos Server ��ַͳһ�޸�Ϊ��localhost:1111�������� spring-cloud-alibaba-consumer-nacos-8801 Ϊ���������ļ� application.yml �������������¡�




````
server:
  port: 8801  #�˿ں�
spring:
  application:
    name: spring-cloud-alibaba-consumer #������
  cloud:
    nacos:
      discovery:
        #server-addr: localhost:8848  #������ Nacos Server �ĵ�ַ
        server-addr: localhost:1111  #��Ⱥ�� Nacos Server �ĵ�ַ
````

#����������Ϣ������Ĭ�����ã����������Զ�������ã�Ŀ���ǲ��� Controller ��Ӳ��������ṩ�ߵķ�����
````
service-url:
  nacos-user-service: http://spring-cloud-alibaba-provider #�����ṩ�ߵķ�����
````




10\. ���� spring-cloud-alibaba-consumer-nacos-8801����ʹ����������ʡ�http://localhost:1111/nacos�����鿴����������µġ������б����������ͼ��

[![Nacos ��Ⱥ 2](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/10225A913-14.png)](http://new-local.weixueyuan.net/uploads/allimg/211109/6-2111091H412N8.png)
ͼ15������ע�ᵽ Nacos Server ��Ⱥ��

# �ο�����
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud