�ڷֲ�ʽ΢����ϵͳ�У��������з�������ж��벻�������ļ���֧�֣���Щ�����ļ�ͨ���ɸ����������й����� properties �� yml ��ʽ�����ڸ���΢�������·���£����� application.properties �� application.yml �ȡ�

���ֽ������ļ�ɢ���ڸ��������еĹ���ʽ�������������⣺

*   **�����Ѷȴ�**�������ļ�ɢ���ڸ���΢�����У����Թ���
*   **��ȫ�Ե�**�����ø���Դ���뱣���ڴ�����У������������й©��
*   **ʱЧ�Բ�**��΢�����е������޸ĺ󣬱����������񣬷����޷���Ч��
*   **����������**���޷�֧�ֶ�̬������������־���ء����ܿ��ء�

Ϊ�˽����Щ���⣬ͨ�����Ƕ���ʹ���������Ķ����ý���ͳһ���������Ͽ�Դ�����������кܶ࣬����ٶȵ� Disconf���Ա��� diamond��360 �� QConf��Я�̵� Apollo �ȶ��ǽ����������ġ�Spring Cloud Ҳ���Լ��ķֲ�ʽ�������ģ��Ǿ��� Spring Cloud Config��

## Spring Cloud Config

Spring Cloud Config ���� Spring Cloud �Ŷӿ�������Ŀ��������Ϊ΢����ܹ��и���΢�����ṩ���л����ⲿ����֧�֡�

�򵥵�˵���ǣ�Spring Cloud Config ���Խ�����΢����������ļ����д洢��һ���ⲿ�Ĵ洢�ֿ��ϵͳ������ Git ��SVN �ȣ��У������õ�ͳһ������֧�ָ���΢��������С�
Spring Cloud Config ���������������֣�

*   Config Server��Ҳ����Ϊ�ֲ�ʽ�������ģ�����һ���������е�΢����Ӧ�ã������������òֿⲢΪ�ͻ����ṩ��ȡ������Ϣ��������Ϣ�ͽ�����Ϣ�ķ��ʽӿڡ�
*   Config Client��ָ����΢����ܹ��еĸ���΢��������ͨ�� Config Server �����ý��й������� Config Sever �л�ȡ�ͼ���������Ϣ��

Spring Cloud Config Ĭ��ʹ�� Git �洢������Ϣ�����ʹ�� Spirng Cloud Config ���������÷�������Ȼ��֧�ֶ�΢�������õİ汾�������ǿ���ʹ�� Git �ͻ��˹��߷���ض��������ݽ��й���ͷ��ʡ����� Git �⣬Spring Cloud Config ���ṩ�˶������洢��ʽ��֧�֣����� SVN�����ػ��ļ�ϵͳ�ȡ�

## Spring Cloud Config ����ԭ��

Spring Cloud Config ����ԭ������ͼ��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1019425240-0.png)
ͼ1��Spring Cloud Config ����ԭ��

Spring Cloud Config �����������£�

1.  ��������ά��Ա�ύ�����ļ���Զ�̵� Git �ֿ⡣
2.  Config ����ˣ��ֲ�ʽ�������ģ������������òֿ� Git������ Config �ͻ��˱�¶��ȡ���õĽӿڡ�
3.  Config �ͻ���ͨ�� Config ����˱�¶�����Ľӿڣ���ȡ���òֿ��е����á�
4.  Config �ͻ��˻�ȡ��������Ϣ����֧�ַ�������С�

## Spring Cloud Config ���ص�

Spring Cloud Config ���������ص㣺

*   Spring Cloud Config �� Spring Cloud �Ŷӿ���������˵�� Spring ���׶��ӣ��ܹ��� Spring ����̬��ϵ�޷켯�ɡ�
*   Spring Cloud Config ������΢����������ļ����д洢��һ���ⲿ�Ĵ洢�ֿ��ϵͳ������ Git���У�ͳһ����
*   Spring Cloud Config �������Ľ������� REST �ӿڵ���ʽ��¶������΢�����Է������΢�����ȡ��
*   ΢�������ͨ�� Spring Cloud Config ����������ͳһ��ȡ���������Լ���������Ϣ��
*   �����÷����仯ʱ��΢������Ҫ�������ɸ�֪�����õı仯�����Զ���ȡ��Ӧ���������á�
*   һ��Ӧ�ÿ����ж�����������翪����dev�����������ԣ�test��������������prod�������ȵȣ�������Ա����ͨ�� Spring Cloud Config �Բ�ͬ�����ĸ����ý��й������ܹ�ȷ��Ӧ���ڻ���Ǩ�ƺ���Ȼ������������֧�����������С�

�������Ǿ�ͨ������ʵ������ʾ Spring Cloud Config ��ʹ�á�

## � Config �����

1\. �� Github �ϴ���һ����Ϊ springcloud-config �Ĳֿ⣨Repository������ȡ�òֿ�ĵ�ַ������ Github վ����ڹ����û���˵�����ȶ����ܿ��ܴ��ڼ��ػ��������⣬������ǿ�����[����](https://gitee.com/)��ִ�иò�����

2\. �ڸ����� spring-cloud-demo2 �£�����һ����Ϊ micro-service-cloud-config-center-3344 �� Spring Boot ģ�飬���� pom.xml ����� Spring Cloud Config ������������������¡�





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
    <artifactId>micro-service-cloud-config-center-3344</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>micro-service-cloud-config-center-3344</name>
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
        <!--�������ķ���������-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-config-server</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
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





3\. �� micro-service-cloud-config-center-3344 ��·����/resources Ŀ¼���£�����һ����Ϊ application.yml �������ļ����������¡�





```

server:
  port: 3344 #�˿ں�
spring:
  application:
    name: spring-cloud-config-center #������
  cloud:
    config:
      server:
        git:
          # Git ��ַ��https://gitee.com/java-mohan/springcloud-config.git
          # ���ƣ�gitee����ַ uri: https://github.com/javmohan/springcloud-config.git  (github վ����ʽ����������������ʹ�� gitee)
          uri: https://gitee.com/java-mohan/springcloud-config.git
          #�ֿ���
          search-paths:
            - springcloud-config
          force-pull: true
          # ���Git�ֿ�Ϊ�����ֿ⣬���Բ���д�û��������룬�����˽�вֿ���Ҫ��д
          # username: ********
          # password: ********
      #��֧��
      label: master

eureka:                                            
  client: #���ͻ���ע�ᵽ eureka �����б���
    service-url: 
      defaultZone: http://eureka7001.com:7001/eureka/,http://eureka7002.com:7002/eureka/,http://eureka7003.com:7003/eureka/  #������ע�ᵽ Eureka ��Ⱥ
```





4\. �� micro-service-cloud-config-center-3344 �����������ϣ�ʹ�� @EnableConfigServer ע�⿪�� Spring Cloud Config �������Ĺ��ܣ��������¡�





```
package net.biancheng.c;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
@EnableConfigServer
public class MicroServiceCloudConfigCenter3344Application {

    public static void main(String[] args) {
        SpringApplication.run(MicroServiceCloudConfigCenter3344Application.class, args);
    }

}

```





5\. �½�һ����Ϊ config-dev.yml ���ļ����������ϴ��� springcloud-config �ֿ� master ��֧�£�config-dev.yml ���������¡�

```
config:
  info: c.biancheng.net
  version: 1.0
```


6\. ������������ע�����ģ���Ⱥ���� micro-service-cloud-config-center-3344��ʹ����������ʡ�http://localhost:3344/master/config-dev.yml�����������ͼ��

![Spring Cloud Config ���������ļ�](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1019423313-2.png)
ͼ2�����������ļ�

Spring Cloud Config �涨��һ�������ļ����ʹ������±�

| ���ʹ���                                  | ʾ��                   |
| ----------------------------------------- | ---------------------- |
| /{application}/{profile}[/{label}]        | /config/dev/master     |
| /{application}-{profile}.{suffix}         | /config-dev.yml        |
| /{label}/{application}-{profile}.{suffix} | /master/config-dev.yml |

���ʹ����ڸ�����˵�����¡�

*   {application}��Ӧ�����ƣ��������ļ������ƣ����� config-dev��
*   {profile}����������һ����Ŀͨ�����п�����dev���汾�����ԣ�test�������汾��������prod�������汾�������ļ����� application-{profile}.yml ����ʽ�������֣����� application-dev.yml��application-test.yml��application-prod.yml �ȡ�
*   {label}��Git ��֧����Ĭ���� master ��֧��������Ĭ�Ϸ�֧�µ������ļ�ʱ���ò�������ʡ�ԣ����ڶ��ַ��ʷ�ʽ��
*   {suffix}�������ļ��ĺ�׺������ config-dev.yml �ĺ�׺Ϊ yml��

ͨ�����׹���������������Ͼ�ֱ�Ӷ������ļ����з��ʡ�

7\. ��������Ϸ��ʡ�http://localhost:3344/config-dev.yml�����������ͼ��

![Spring Cloud Config ���������ļ�2](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1019422606-3.png)
ͼ3��Spring Cloud Config ���������ļ�

8\. ��������Ϸ��ʡ�http://localhost:3344/config/dev/master����������¡�

```
{"name":"config","profiles":["dev"],"label":"master","version":"9caafcc3498e04147463482f8b29e925e8afcc3a","state":null,"propertySources":[{"name":"https://gitee.com/java-mohan/springcloud-config.git/config-dev.yml","source":{"config.info":"c.biancheng.net","config.version":1.0}}]}
```

�Դ����Ǿ�����˶� Spring Cloud Config ����˵Ĵ�Ͳ��ԡ�

## � Config �ͻ���

1\. �ڸ����� spring-cloud-demo2 �£�����һ����Ϊ micro-service-cloud-config-client-3355 �� Spring Boot ģ�飬������ pom.xml ����� Spring Cloud Config �ͻ��˵������������������¡�





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
    <artifactId>micro-service-cloud-config-client-3355</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>micro-service-cloud-config-client-3355</name>
    <description>Demo project for Spring Boot</description>
    <properties>
        <java.version>1.8</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <!--Spring Cloud Config �ͻ�������-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-config</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```





2\. �� micro-service-cloud-config-client-3355 ����·����/resources Ŀ¼���£�����һ����Ϊ bootstrap.yml �������ļ����������¡�





```
#bootstrap.yml ��ϵͳ����ģ��������ȼ����� application.yml ��������ⲿ�������ò�����
server:
  port: 3355 #�˿ں�
spring:
  application:
    name: spring-cloud-config-client #������
  cloud:
    config:
      label: master #��֧����
      name: config  #�����ļ����ƣ�config-dev.yml �е� config
      profile: dev  #������  config-dev.yml �е� dev
      #���ﲻҪ������� http:// �����޷���ȡ
      uri: http://localhost:3344 #Spring Cloud Config ����ˣ��������ģ���ַ

eureka:
  client: #���ͻ���ע�ᵽ eureka �����б���
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka/,http://eureka7002.com:7002/eureka/,http://eureka7003.com:7003/eureka/  #������ע�ᵽ Eureka ��Ⱥ
```





3\. �� net.biancheng.c.controller ���£�����һ����Ϊ ConfigClientController ���࣬ͨ�������ȡ�����ļ��е����ã��������¡�





```

package net.biancheng.c.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

//��ȡ��������ָ�������ļ������ݣ���չʾ��ҳ��
@RestController
public class ConfigClientController {
    @Value("${server.port}")
    private String serverPort;

    @Value("${config.info}")
    private String configInfo;

    @Value("${config.version}")
    private String configVersion;

    @GetMapping(value = "/getConfig")
    public String getConfig() {
        return "info��" + configInfo + "<br/>version��" + configVersion + "<br/>port��" + serverPort;
    }
}
```





4\. �� micro-service-cloud-config-client-3355 �����������ϣ�ʹ�� @EnableEurekaClient ע�⿪�� Eureka �ͻ��˹��ܣ��������¡�





```

package net.biancheng.c;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class MicroServiceCloudConfigClient3355Application {

    public static void main(String[] args) {
        SpringApplication.run(MicroServiceCloudConfigClient3355Application.class, args);
    }

}

```





5\. ���� micro-service-cloud-config-client-3355��ʹ����������ʡ�http://localhost:3355/getConfig��,�������ͼ��

![Config �ͻ��˻�ȡ������Ϣ](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1019422604-4.png)
ͼ4��Spring Cloud Config �ͻ��˻�ȡ������Ϣ

6\. �������ļ� config-dev.yml �� config.version ��ֵ�޸�Ϊ 2.0���������¡�

```
config:
  info: c.biancheng.net
  version: 2.0
```


7\. �������� Eureka ����ע�����ģ���Ⱥ���� micro-service-cloud-config-center-3344�� ʹ����������ʡ�http://localhost:3344/master/config-dev.yml�����������ͼ��

![�������Ļ�ȡ�޸ĺ�������ļ�](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/10194255O-5.png)
ͼ5���������Ļ�ȡ�޸ĺ�������ļ�

��ͼ 6 ���Կ��������������Ѿ��ɹ��ػ�ȡ�����޸ĺ�����á�

8\. �ٴη��ʡ�http://localhost:3355/getConfig��������ͨ�� Spring Cloud Config �ͻ��˻�ȡ�޸ĺ��������Ϣ���������ͼ��

![Config �ͻ��˻�ȡ������Ϣ](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1019422604-4.png)
ͼ6��Spring Cloud Config �ͻ��˻�ȡ�޸ĺ��������Ϣ

9\. ���� micro-service-cloud-config-client-3355���ٴ�ʹ�÷��ʡ�http://localhost:3355/getConfig�����������ͼ��

![����Config �ͻ���](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1019425023-7.png)
ͼ7������ Spring Cloud Config �ͻ��˻�ȡ����

ͨ����ʵ�������ǿ��Եõ����� 2 ����ۣ�

*   ���ø��º�Spring Cloud Config ����ˣ�Server������ֱ�Ӵ� Git �ֿ��л�ȡ���µ����á�
*   �������� Spring Cloud Config �ͻ��ˣ�Client���������޷�ͨ�� Spring Cloud Config ����˻�ȡ���µ�������Ϣ��

## �ֶ�ˢ������

Ϊ�˽�������� Config �ͻ����޷���ȡ�������õ����⣬�����������ǾͶ� micro-service-cloud-config-client-3355 ���и��죬���첽�����¡�

1\. �� micro-service-cloud-config-client-3355 �� pom.xml ������������������� Spring Boot actuator ���ģ�顣





```


<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>

```





2\. �������ļ� bootstrap.yml ������������ã����Ⱪ¶ Spring Boot actuator �ļ�ؽڵ㡣





```

# Spring Boot 2.50�� actuator ��������˴�����Ľڵ㣬ֻ��¶�� health �ڵ㣬�������ã�*������Ϊ�˿������еĽڵ�
management:
  endpoints:
    web:
      exposure:
        include: "*"   # * ��yaml �ļ����ڹؼ��֣�������Ҫ������

```






3\. �� ConfigClientController ����ʹ�� @RefreshScope ע�⿪������ˢ�£��������¡�





```

package net.biancheng.c.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// ��ȡ��������ָ�������ļ������ݣ���չʾ��ҳ��
@RefreshScope //Ϊ���ö�̬���ֶ����Ļ�ȡ���µ�git ���ã������ actuator ��ؼ��� RefreshScope��
@RestController
public class ConfigClientController {
    @Value("${server.port}")
    private String serverPort;

    @Value("${config.info}")
    private String configInfo;

    @Value("${config.version}")
    private String configVersion;

    @GetMapping(value = "/getConfig")
    public String getConfig() {
        return "info��" + configInfo + "<br/> version��" + configVersion + "<br/>port��" + serverPort;
    }
}
```





4\. ���� micro-service-cloud-config-client-3355��Ȼ�������ļ� config-dev.yml �е� config.version �޸�Ϊ 3.0���������¡�

```
config:
  info: c.biancheng.net
  version: 3.0
```


5\. ʹ��������ٴη��ʡ�http://localhost:3355/getConfig�����������ͼ��

![����Config �ͻ���](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1019425023-7.png)
ͼ8������ Spring Cloud Config �ͻ��˺��ȡ����

��ͼ 9 ���Կ�������ʹ���Ƕ� Spring Cloud Config �ͻ��˽����˸��죬Ҳ��Ȼ�޷�ֱ�ӻ�ȡ���������á�

6\. �������д��ڣ�ʹ�����������һ�� POST ����ˢ�� Spring Cloud Config 3355 �ͻ��ˣ�֪ͨ�ͻ��������ļ��Ѿ��޸ģ���Ҫ������ȥ���á�

```curl -X POST "http://localhost:3355/actuator/refresh"```

7. ʹ��������ٴη��ʡ�http://localhost:3355/getConfig�����������ͼ��

![�ֶ�ˢ��](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/101942C62-9.png)
ͼ9���ֶ�ˢ�¿ͻ���

#### �ֶ�ˢ�����õ�����

�������ʵ���У�����ͨ���� Config �ͻ��ˣ��˿ںţ�3355�������� Spring Boot actuator ��������������õı仯��ʹ���ǿ����ڲ����� Config �ͻ��˵�����»�ȡ�����������ã�ԭ������ͼ��

![Spring Cloud Config �ֶ�ˢ��](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1019424S8-10.png)
ͼ10��Spring Cloud Congfig �ֶ�ˢ��

���ַ�ʽ��Ȼ��������� Config �ͻ��˲��ܻ�ȡ�������õ����⣬����һ������ȴҲ����������Ǿ���ֻҪ���òֿ��е����÷����ı䣬����Ҫ���ǰ����� Config �ͻ����ֶ����� POST ����֪ͨ����������ȡ���á�

����֪������ν�� Config �ͻ�����ʵ����һ��һ���ķ�����΢����ܹ��У�һ��ϵͳ��������ʮ��������ʮ�����������Ϊĳһ�������ļ����޸Ķ���ʮ��΢������ POST ��������Ȼ�ǲ�����ġ�

��ô��û�С�һ��֪ͨ��������Ч���ķ�ʽ�أ����ǿ϶��ġ�Spring Cloud Config ��� Bus �Ϳ���ʵ�����õĶ�̬ˢ�¡�

## Config+Bus ʵ�����õĶ�̬ˢ��

Spring Cloud Bus �ֱ���Ϊ��Ϣ���ߣ����ܹ�ͨ������������Ϣ�������� RabbitMQ��Kafka �ȣ���΢����ܹ��еĸ�����������������ʵ�ֹ㲥״̬���ġ��¼����͵ȹ��ܣ�������ʵ��΢����֮���ͨ�Ź��ܡ�

Ŀǰ Spring Cloud Bus ֧��������Ϣ����RabbitMQ �� Kafka��

#### Spring Cloud Bus �Ļ���ԭ��

Spring Cloud Bus ��ʹ��һ������������Ϣ����������һ����������Ϣ���� Topic��Ĭ��Ϊ��springCloudBus��������� Topic �е���Ϣ�ᱻ���з���ʵ�����������ѡ������е�һ������ˢ������ʱ��Spring Cloud Bus �����Ϣ���浽 Topic �У������������ Topic �ķ�����յ���Ϣ���Զ����ѡ�

#### Spring Cloud Bus ��̬ˢ�����õ�ԭ��

���� Spring Cloud Bus ��������ƿ���ʵ�ֺܶ๦�ܣ�������� Spring Cloud Config ʵ�����õĶ�̬ˢ�¾�������͵�Ӧ�ó���֮һ��

�� Git �ֿ��е����÷����˸ı䣬����ֻ��Ҫ��ĳһ�����񣨼ȿ����� Config ����ˣ�Ҳ������ Config �ͻ��ˣ�����һ�� POST ����Spring Cloud Bus �Ϳ���ͨ����Ϣ����֪ͨ��������������ȡ�������ã���ʵ�����õĶ�̬ˢ�¡�

Spring Cloud Bus ��̬ˢ�����õĹ���ԭ������ͼ��ʾ��

![bus+config ��̬ˢ������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/101942GY-11.png)
ͼ11��Bus+Config ʵ�����õĶ�̬ˢ��

����ͼ 12������ Spring Cloud Bus ʵ�����õĶ�̬ˢ����Ҫ���²���:

1.  �� Git �ֿ��е����÷����ı����ά��Ա�� Config ����˷���һ�� POST ��������·��Ϊ��/actuator/refresh����
2.  Config ����˽��յ�����󣬻Ὣ������ת������������ Spring Cloud Bus��
3.  Spring Cloud Bus �ӵ���Ϣ�󣬻�֪ͨ������ Config �ͻ��ˡ�
4.  Config �ͻ��˽��յ�֪ͨ������ Config �������ȡ�������á�
5.  ���� Config �ͻ��˶���ȡ�����µ����á�

#### Spring Cloud Bus ��̬ˢ�����ã�ȫ�ֹ㲥��

���������� RabbitMQ Ϊ��������ʾ���ʹ�� Config+Bus ʵ�����õĶ�̬ˢ�¡�

1\. �� micro-service-cloud-config-center-3344 �� pom.xml �У���� Spring Boot actuator ���ģ��� Spring Cloud Bus ���������������¡�





```

<!--�����Ϣ���ߣ�Bus���� RabbitMQ ��֧��-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-bus-amqp</artifactId>
</dependency>
<!--���Spring Boot actuator ���ģ�������-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>

```





2\. �� micro-service-cloud-config-center-3344 �������ļ� application.yml �У���� RabbitMQ �� Spring Boot actuator ��������ã������������¡�





```
##### RabbitMQ ������ã�15672 ��web �������Ķ˿ڣ�5672 �� MQ �ķ��ʶ˿�###########
spring:
  rabbitmq:
    host: 127.0.0.1
    port: 5672
    username: guest
    password: guest

# Spring Boot 2.50�� actuator ��������˴�����Ľڵ㣬ֻ��¶�� heath �ڵ㣬�������ã�*������Ϊ�˿������еĽڵ�
management:
  endpoints:
    web:
      exposure:
        include: 'bus-refresh'

```





3\. �� micro-service-cloud-config-client-3355 �� pom.xml �У���� Spring Cloud Bus ������������������¡�





```


1.  <!--�����Ϣ���ߣ�Bus���� RabbitMQ ��֧��-->
2.  <dependency>
3.  <groupId>org.springframework.cloud</groupId>
4.  spring-cloud-starter-bus-amqp
5.  </dependency>

```





4. �� micro-service-cloud-config-client-3355 �������ļ� bootstrap.yml ������������á�





```

<!--�����Ϣ���ߣ�Bus���� RabbitMQ ��֧��-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-bus-amqp</artifactId>
</dependency>

```





5\. ���� micro-service-cloud-config-client-3355���½�һ����Ϊ micro-service-cloud-config-client-bus-3366 �� Spring Boot ģ�飨�˿ں�Ϊ 3366���������������ļ� bootstrap.yml ������������á�





```

#bootstrap.yml ��ϵͳ����ģ��������ȼ����� application.yml ��������ⲿ�������ò�����
server:
  port: 3366  #�˿ں�Ϊ 3366
spring:
  application:
    name: spring-cloud-config-client-bus

  cloud:
    config:
      label: master #��֧����
      name: config  #�����ļ����ƣ�config-dev.yml �е� config
      profile: dev  #�����ļ��ĺ�׺��  config-dev.yml �е� dev
      #���ﲻҪ������� http:// �����޷���ȡ
      uri: http://localhost:3344 #spring cloud �������ĵ�ַ

##### RabbitMQ ������ã�15672 ��web �������Ķ˿ڣ�5672 �� MQ �ķ��ʶ˿�###########
  rabbitmq:
    host: 127.0.0.1
    port: 5672
    username: guest
    password: guest
###################### eureka ���� ####################
eureka:
  client: #���ͻ���ע�ᵽ eureka �����б���
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka/,http://eureka7002.com:7002/eureka/,http://eureka7003.com:7003/eureka/  #������ע�ᵽ Eureka ��Ⱥ

# Spring Boot 2.50�� actuator ��������˴�����Ľڵ㣬ֻ��¶�� heath �ڵ㣬�������ã�*������Ϊ�˿������еĽڵ�
management:
  endpoints:
    web:
      exposure:
        include: "*"   # * ��yaml �ļ����ڹؼ��֣�������Ҫ������

```





6\. �������� micro-service-cloud-config-center-3344��micro-service-cloud-config-client-3355��ʹ����������ʡ�http://localhost:3355/getConfig�����������ͼ��

![Bus ��̬���ø���](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1019422S4-12.png)
ͼ12��Spring Cloud Bus ��̬ˢ������

7\. ���� micro-service-cloud-config-client-bus-3366��ʹ����������ʡ�http://localhost:3366/getConfig�����������ͼ��

![Bus ��̬����](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/10194254S-13.png)
ͼ13��Spring Cloud Bus ��̬ˢ������

8.  �������ļ� config-dev.yml �е� config.version �޸�Ϊ 4.0���������¡�

```
config:
  info: c.biancheng.net
  version: 4.0
```


9\. �������д��ڣ�ʹ������������ micro-service-cloud-config-center-3344��Config Server������һ�� POST ����ˢ�����á�

```curl -X POST "http://localhost:3344/actuator/bus-refresh"```

10. ʹ��������ٴη��ʡ�http://localhost:3355/getConfig�����������ͼ��

![bus ��̬ˢ������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1019423453-14.png)
ͼ14��Spring Cloud Bus ��̬ˢ��

11. ʹ��������ٴη��ʡ�http://localhost:3366/getConfig�����������ͼ��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/10194222Y-15.png)
ͼ15��Spring Cloud Bus ��̬ˢ��

> ע�⣺��ʹ�� Spring Cloud Bus ʱ�����뱣֤ Bus �����ӵ���Ϣ������������� RabbitMQ���Ѿ���ȷ��װ������������

#### Spring Cloud Bus ��̬ˢ�����ã�����֪ͨ��

��ν����֪ͨ�����ǲ���֪ͨ���е� Config �ͻ��ˣ����Ǹ�������ֻ֪ͨ����ĳһ�� Config �ͻ��ˡ�

ʹ�� Spring Cloud Bus ʵ�ֶ���֪ͨ�ķ���ʮ�ּ򵥣�ֻҪ�����ڷ��� POST ����ʱʹ�����¸�ʽ���ɡ�

```http://{hostname}:{port}/actuator/bus-refresh/{destination}```

����˵�����£�

*   {hostname}�� ��ʾ Config ����˵�������ַ���ȿ�����������Ҳ������ IP ��ַ��
*   {port}����ʾ Config ����˵Ķ˿ں�.
*   {destination}����ʾ��Ҫ����֪ͨ�� Config �ͻ��ˣ�΢���񣩣��� Config �ͻ��˵ķ�������spring.application.name��+�˿ںţ�server.port����ɣ�����ֻ֪ͨ micro-service-cloud-config-client-3355 ˢ�����ã���ȡֵΪ spring-cloud-config-client:3355��

�������Ǿ�ͨ��һ���򵥵�ʵ��������ʾ�� Spring Cloud Bus ��̬ˢ�µĶ���֪ͨ��

1\. �������ļ� config-dev.yml �е� config.version �޸�Ϊ 5.0���������¡�

```
config:
  info: c.biancheng.net
  version: 5.0
```


2\. �������д��ڣ�ʹ������������ micro-service-cloud-config-center-3344 ����һ�� POST ����

```curl -X POST "http://localhost:3344/actuator/bus-refresh/spring-cloud-config-client:3355"```

3\. ʹ����������ʡ�http://localhost:3355/getConfig�����������ͼ��

![Bus ����֪ͨ 3355](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/10194233O-16.png)
ͼ16��Spring Cloud Bus ����֪ͨ

4\. ʹ��������ٴη��ʡ�http://localhost:3366/getConfig�����������ͼ��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/10194222Y-15.png)
ͼ17��Spring Cloud Bus ����֪ͨ


# �ο�����
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud
https://github.com/macrozheng/springcloud-learning