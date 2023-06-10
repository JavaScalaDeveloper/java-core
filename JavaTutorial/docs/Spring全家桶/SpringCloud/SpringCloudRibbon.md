Spring Cloud Ribbon ��һ�׻��� Netflix Ribbon ʵ�ֵĿͻ��˸��ؾ���ͷ�����ù��ߡ�

Netflix Ribbon �� Netflix ��˾�����Ŀ�Դ���������Ҫ�������ṩ�ͻ��˵ĸ��ؾ����㷨�ͷ�����á�Spring Cloud ������ Netflix �е�������Դ������������� Eureka��Feign �Լ� Hystrix �ȣ�һ�����Ͻ� Spring Cloud Netflix ģ���У����Ϻ�ȫ��Ϊ Spring Cloud Netflix Ribbon��

Ribbon �� Spring Cloud Netflix ģ�����ģ�飬���� Spring Cloud �� Netflix Ribbon �Ķ��η�װ��ͨ���������ǿ��Խ��������� REST ģ�壨RestTemplate������ת��Ϊ�ͻ��˸��ؾ���ķ�����á�

Ribbon �� Spring Cloud ��ϵ������ġ�����Ҫ�����֮һ������Ȼֻ��һ���������͵Ŀ�ܣ������� Eureka Server������ע�����ģ�������Ҫ�������𣬵�������������ÿһ��ʹ�� Spring Cloud ������΢�����С�

Spring Cloud ΢����֮��ĵ��ã�API ���ص�����ת�������ݣ�ʵ���϶���ͨ�� Spring Cloud Ribbon ��ʵ�ֵģ�������������Ҫ���ܵ� [OpenFeign](http://c.biancheng.net/springcloud/open-feign.html) Ҳ�ǻ�����ʵ�ֵġ�

## ���ؾ���

���κ�һ��ϵͳ�У����ؾ��ⶼ��һ��ʮ����Ҫ�Ҳ��ò�ȥʵʩ�����ݣ�����ϵͳ����߲�������������ѹ���ͷ�������ݵ���Ҫ�ֶ�֮һ��

���ؾ��⣨Load Balance�� ���򵥵�˵���ǽ��û�������ƽ̯���䵽��������������У��Դﵽ��չ������������ǿ���ݴ����������������������������Ŀ����Ժ�����Ե�Ŀ�ġ�

�����ĸ��ؾ��ⷽʽ�����֣�

*   ����˸��ؾ���
*   �ͻ��˸��ؾ���

#### ����˸��ؾ���

����˸��ؾ���������ĸ��ؾ��ⷽʽ���乤��ԭ������ͼ��

![����˸��ؾ��⹤��ԭ��](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/10122164F-0.png)
ͼ1������˸��ؾ��⹤��ԭ��

����˸��ؾ������ڿͻ��˺ͷ����֮�佨��һ�������ĸ��ؾ�����������÷������ȿ�����Ӳ���豸������ F5����Ҳ��������������� Nginx����������ؾ��������ά����һ�ݿ��÷�����嵥��Ȼ��ͨ������������ɾ�����ϵķ���˽ڵ㣬�Ա�֤�嵥�е����з���ڵ㶼�ǿ����������ʵġ�

���ͻ��˷�������ʱ�������󲻻�ֱ�ӷ��͵�����˽��д�������ȫ���������ؾ�����������ɸ��ؾ������������ĳ���㷨��������ѯ������ȣ�������ά���Ŀ��÷����嵥��ѡ��һ������ˣ�Ȼ�����ת����

����˸��ؾ�����������ص㣺

*   ��Ҫ����һ�������ĸ��ؾ����������
*   ���ؾ������ڿͻ��˷����������еģ���˿ͻ��˲���֪���������ĸ�������ṩ�ķ���
*   ���÷�����嵥�洢�ڸ��ؾ���������ϡ�

#### �ͻ��˸��ؾ���

����ڷ���˸��ؾ��⣬�ͻ��˷����ھ�������һ���Ƚ�С�ڵĸ��

�ͻ��˸��ؾ���Ĺ���ԭ������ͼ��

![�ͻ��˸��ؾ���ԭ��](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1012212Q4-1.png)

ͼ2���ͻ��˸��ؾ��⹤��ԭ��


�ͻ��˸��ؾ����ǽ����ؾ����߼��Դ������ʽ��װ���ͻ����ϣ������ؾ�����λ�ڿͻ��ˡ��ͻ���ͨ������ע�����ģ����� Eureka Server����ȡ��һ�ݷ�����ṩ�Ŀ��÷����嵥�����˷����嵥�󣬸��ؾ��������ڿͻ��˷�������ǰͨ�����ؾ����㷨ѡ��һ�������ʵ���ٽ��з��ʣ��Դﵽ���ؾ����Ŀ�ģ�

�ͻ��˸��ؾ���Ҳ��Ҫ��������ȥά��������嵥����Ч�ԣ����������Ҫ��Ϸ���ע������һ����ɡ�

�ͻ��˸��ؾ�����������ص㣺

*   ���ؾ�����λ�ڿͻ��ˣ�����Ҫ�����һ�����ؾ����������
*   ���ؾ������ڿͻ��˷�������ǰ���еģ���˿ͻ��������֪�����ĸ�������ṩ�ķ���
*   �ͻ��˶�ά����һ�ݿ��÷����嵥��������嵥���Ǵӷ���ע�����Ļ�ȡ�ġ�

Ribbon ����һ������ HTTP �� TCP �Ŀͻ��˸��ؾ������������ǽ� Ribbon �� Eureka һ��ʹ��ʱ��Ribbon ��� Eureka Server������ע�����ģ��л�ȡ������б�Ȼ��ͨ�����ؾ�����Խ������̯����������ṩ�ߣ��Ӷ��ﵽ���ؾ����Ŀ�ġ�

#### ����˸��ؾ��� VS �ͻ��˸��ؾ���

�������Ǿ����Ա��£�����˸��ؾ���Ϳͻ��˸��ؾ��⵽����ʲô�������±�

| ��ͬ��                       | ����˸��ؾ���                                               | �ͻ��˸��ؾ���                                               |
| ---------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| �Ƿ���Ҫ�������ؾ��������   | ��Ҫ�ڿͻ��˺ͷ����֮�佨��һ�������ĸ��ؾ����������       | �����ؾ�����߼��Դ������ʽ��װ���ͻ����ϣ���˲���Ҫ�����������ؾ���������� |
| �Ƿ���Ҫ����ע������         | ����Ҫ����ע�����ġ�                                         | ��Ҫ����ע�����ġ��ڿͻ��˸��ؾ����У����еĿͻ��˺ͷ���˶���Ҫ�����ṩ�ķ���ע�ᵽ����ע�������ϡ� |
| ���÷����嵥�洢��λ��       | ���÷����嵥�洢��λ�ڿͻ����������֮��ĸ��ؾ���������ϡ� | ���еĿͻ��˶�ά����һ�ݿ��÷����嵥����Щ�嵥���Ǵӷ���ע�����Ļ�ȡ�ġ� |
| ���ؾ����ʱ��               | �Ƚ������͵����ؾ����������Ȼ���ɸ��ؾ��������ͨ�����ؾ����㷨���ڶ�������֮��ѡ��һ�����з��ʣ����ڷ��������ٽ��и��ؾ����㷨���䡣�򵥵�˵���ǣ��ȷ��������ٽ��и��ؾ��⡣ | �ڷ�������ǰ����λ�ڿͻ��˵ķ����ؾ����������� Ribbon��ͨ�����ؾ����㷨ѡ��һ����������Ȼ����з��ʡ��򵥵�˵���ǣ��Ƚ��и��ؾ��⣬�ٷ������� |
| �ͻ����Ƿ��˽�����ṩ����Ϣ | ���ڸ��ؾ������ڿͻ��˷����������еģ���˿ͻ��˲���֪���������ĸ�������ṩ�ķ��� | ���ؾ������ڿͻ��˷�������ǰ���еģ���˿ͻ��������֪�����ĸ�������ṩ�ķ��� |

## Ribbon ʵ�ַ������

Ribbon ������ RestTemplate��Rest ģ�壩���ʹ�ã���ʵ��΢����֮��ĵ��á�

RestTemplate �� Spring �����е�һ���������ѵ����� REST ����������ܡ�RestTemplate ʵ���˶� HTTP ����ķ�װ���ṩ��һ��ģ�廯�ķ�����÷�����ͨ������Spring Ӧ�ÿ��Ժܷ���ضԸ������͵� HTTP ������з��ʡ�

RestTemplate ��Ը������͵� HTTP �����ṩ����Ӧ�ķ������д������� HEAD��GET��POST��PUT��DELETE �����͵� HTTP ���󣬷ֱ��Ӧ RestTemplate �е� headForHeaders()��getForObject()��postForObject()��put() �Լ� delete() ������

��������ͨ��һ���򵥵�ʵ��������ʾ Ribbon �����ʵ�ַ�����õġ�

1\. �������� spring-cloud-demo2 �£�����һ����Ϊ micro-service-cloud-consumer-dept-80 ��΢���񣬲����� pom.xml ������������������������¡�





```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <!--������-->
    <parent>
        <artifactId>spring-cloud-demo2</artifactId>
        <groupId>net.biancheng.c</groupId>
        <version>0.0.1-SNAPSHOT</version>
    </parent>

    <groupId>net.biancheng.c</groupId>
    <artifactId>micro-service-cloud-consumer-dept-80</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>micro-service-cloud-consumer-dept-80</name>
    <description>Demo project for Spring Boot</description>
    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <!--������ģ��-->
        <dependency>
            <groupId>net.biancheng.c</groupId>
            <artifactId>micro-service-cloud-api</artifactId>
            <version>${project.version}</version>
        </dependency>
        <!--Spring Boot Web-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!--lombok-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <!--Spring Boot ����-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <!--Spring Cloud Eureka �ͻ�������-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        <!--Spring Cloud Ribbon ����-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-ribbon</artifactId>
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





2. ����·������ /resource Ŀ¼���£��½�һ�������ļ� application.yml�������������¡�





```
server:
  port: 80 #�˿ں�

############################################# Spring Cloud Ribbon ���ؾ�������##########################
eureka:
  client:
    register-with-eureka: false #��΢����Ϊ���������ߣ�����Ҫ���Լ�ע�ᵽ����ע������
    fetch-registry: true  #��΢����Ϊ���������ߣ���Ҫ������ע��������������
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka/,http://eureka7002.com:7002/eureka/,http://eureka7003.com:7003/eureka/ #����ע�����ļ�Ⱥ
```





3\. �� net.biancheng.c.config ���£�����һ����Ϊ ConfigBean �������࣬�� RestTemplate ע�뵽�����У��������¡�





```


package net.biancheng.c.config;

import com.netflix.loadbalancer.IRule;

import com.netflix.loadbalancer.RetryRule;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
// ������ע��
@Configuration
public class ConfigBean {
    
    @Bean //�� RestTemplate ע�뵽������
    @LoadBalanced //�ڿͻ���ʹ�� RestTemplate ��������ʱ���������ؾ��⣨Ribbon��
    public RestTemplate getRestTemplate() {
        return new RestTemplate();
    }
}

```





4\. �� net.biancheng.c.controller ���£�����һ����Ϊ DeptController_Consumer �� Controller���� Controller �ж�����������ڵ��÷�����ṩ�ķ��񣬴������¡�





```
package net.biancheng.c.controller;

import net.biancheng.c.entity.Dept;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
public class DeptController_Consumer {
    //private static final String REST_URL_PROVIDER_PREFIX = "http://localhost:8001/"; ���ַ�ʽ��ֱ���÷��񷽵ķ���������û���õ� Spring Cloud

    //����΢�����̣���ͨ��΢�������������ȡ���õ�ַ
    private static final String REST_URL_PROVIDER_PREFIX = "http://MICROSERVICECLOUDPROVIDERDEPT"; // ʹ��ע�ᵽ Spring Cloud Eureka ����ע�������еķ��񣬼� application.name

    @Autowired
    private RestTemplate restTemplate; //RestTemplate ��һ�ּ򵥱�ݵķ��� restful ����ģ���࣬�� Spring �ṩ�����ڷ��� Rest ����Ŀͻ���ģ�幤�߼����ṩ�˶��ֱ�ݷ���Զ�� HTTP ����ķ���

    //��ȡָ��������Ϣ
    @RequestMapping(value = "/consumer/dept/get/{id}")
    public Dept get(@PathVariable("id") Integer id) {
        return restTemplate.getForObject(REST_URL_PROVIDER_PREFIX + "/dept/get/" + id, Dept.class);
    }
    //��ȡ�����б�
    @RequestMapping(value = "/consumer/dept/list")
    public List<Dept> list() {
        return restTemplate.getForObject(REST_URL_PROVIDER_PREFIX + "/dept/list", List.class);
    }
}
```





5\. �� micro-service-cloud-consumer-dept-80 �����������ϣ�ʹ�� @EnableEurekaClient ע�������� Eureka �ͻ��˹��ܣ��������¡�





```

package net.biancheng.c;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class MicroServiceCloudConsumerDept80Application {

    public static void main(String[] args) {
        SpringApplication.run(MicroServiceCloudConsumerDept80Application.class, args);
    }
}

```





6\. ������������ע������ micro-service-cloud-eureka-7001�������ṩ�� micro-service-cloud-provider-dept-8001 �Լ����������� micro-service-cloud-consumer-dept-80��

7\. ʹ����������ʡ�http://eureka7001.com:80/consumer/dept/list�����������ͼ��

![Ribbon ʵ�ַ������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/101221CG-2.png)
ͼ3��Ribbon ʵ�ַ������

## Ribbon ʵ�ָ��ؾ���

Ribbon ��һ���ͻ��˵ĸ��ؾ��������������� Eureka ���ʹ�����ɵ�ʵ�ֿͻ��˵ĸ��ؾ��⡣Ribbon ���ȴ� Eureka Server������ע�����ģ�ȥ��ȡ������б�Ȼ��ͨ�����ؾ�����Խ������̯���������ˣ��Ӷ��ﵽ���ؾ����Ŀ�ġ�

Spring Cloud Ribbon �ṩ��һ�� IRule �ӿڣ��ýӿ���Ҫ�������帺�ؾ�����ԣ����� 7 ��Ĭ��ʵ���࣬ÿһ��ʵ���඼��һ�ָ��ؾ�����ԡ�

| ��� | ʵ����                    | ���ؾ������                                                 |
| ---- | ------------------------- | ------------------------------------------------------------ |
| 1    | RoundRobinRule            | ����������ѯ���ԣ�������һ����˳������ѡȡ����ʵ��           |
| 2    | RandomRule                | ���ѡȡһ������ʵ��                                         |
| 3    | RetryRule                 | ���� RoundRobinRule����ѯ���Ĳ�������ȡ���������ȡ�ķ���ʵ��Ϊ null ���Ѿ�ʧЧ������ָ����ʱ��֮�ڲ��ϵؽ������ԣ�����ʱ��ȡ����Ĳ��Ի��� RoundRobinRule �ж���Ĳ��ԣ����������ָ��ʱ����Ȼû��ȡ������ʵ���򷵻� null �� |
| 4    | WeightedResponseTimeRule  | WeightedResponseTimeRule �� RoundRobinRule ��һ�����࣬���� RoundRobinRule �Ĺ��ܽ�������չ������ƽ����Ӧʱ�䣬���������з���ʵ����Ȩ�أ���Ӧʱ��Խ�̵ķ���ʵ��Ȩ��Խ�ߣ���ѡ�еĸ���Խ�󡣸�����ʱ�����ͳ����Ϣ���㣬��ʹ��������ѯ���ԣ�����Ϣ�㹻ʱ�����л��� WeightedResponseTimeRule�� |
| 5    | BestAvailableRule         | �̳��� ClientConfigEnabledRoundRobinRule���ȹ��˵���ϻ�ʧЧ�ķ���ʵ����Ȼ����ѡ�񲢷�����С�ķ���ʵ���� |
| 6    | AvailabilityFilteringRule | �ȹ��˵����ϻ�ʧЧ�ķ���ʵ����Ȼ����ѡ�񲢷�����С�ķ���ʵ���� |
| 7    | ZoneAvoidanceRule         | Ĭ�ϵĸ��ؾ�����ԣ��ۺ��жϷ�����������zone�������ܺͷ���server���Ŀ����ԣ���ѡ�����ʵ������û������Ļ����£��ò�������ѯ��RandomRule���������ơ� |

�������Ǿ���ͨ��һ��ʵ������֤�£�Ribbon Ĭ����ʹ��ʲô����ѡȡ����ʵ���ġ�

1. �� MySQL ���ݿ���ִ������ SQL ��䣬׼���������ݡ�

```
DROP DATABASE IF EXISTS spring_cloud_db2;
CREATE DATABASE spring_cloud_db2 CHARACTER SET UTF8;

USE spring_cloud_db2;

DROP TABLE IF EXISTS `dept`;
CREATE TABLE `dept` (
  `dept_no` int NOT NULL AUTO_INCREMENT,
  `dept_name` varchar(255) DEFAULT NULL,
  `db_source` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`dept_no`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `dept` VALUES ('1', '������', DATABASE());
INSERT INTO `dept` VALUES ('2', '���²�', DATABASE());
INSERT INTO `dept` VALUES ('3', '����', DATABASE());
INSERT INTO `dept` VALUES ('4', '�г���', DATABASE());
INSERT INTO `dept` VALUES ('5', '��ά��', DATABASE());

#############################################################################################

DROP DATABASE IF EXISTS spring_cloud_db3;

CREATE DATABASE spring_cloud_db3 CHARACTER SET UTF8;

USE spring_cloud_db3;

DROP TABLE IF EXISTS `dept`;
CREATE TABLE `dept` (
  `dept_no` int NOT NULL AUTO_INCREMENT,
  `dept_name` varchar(255) DEFAULT NULL,
  `db_source` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`dept_no`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `dept` VALUES ('1', '������', DATABASE());
INSERT INTO `dept` VALUES ('2', '���²�', DATABASE());
INSERT INTO `dept` VALUES ('3', '����', DATABASE());
INSERT INTO `dept` VALUES ('4', '�г���', DATABASE());
INSERT INTO `dept` VALUES ('5', '��ά��', DATABASE());```

2\. �ο� micro-service-cloud-provider-dept-8001���ٴ�������΢���� Moudle ��micro-service-cloud-provider-dept-8002 �� micro-service-cloud-provider-dept-8003��

3\. �� micro-service-cloud-provider-dept-8002 �� application.yml �У��޸Ķ˿ںš����ݿ�������Ϣ�Լ��Զ������������Ϣ��eureka.instance.instance-id�����޸ĵ��������¡�
```




```

server:
  port: 8002  #�˿ں��޸�Ϊ 8002

spring:
  application:
    name: microServiceCloudProviderDept  #΢�������ƣ������޸ģ��� micro-service-cloud-provider-dept-8001 �����ñ���һ��

  datasource:
    username: root        #���ݿ��½�û���
    password: root        #���ݿ��½����
    url: jdbc:mysql://127.0.0.1:3306/spring_cloud_db2       #���ݿ�url
    driver-class-name: com.mysql.jdbc.Driver                  #���ݿ�����

eureka:
  client: #���ͻ���ע�ᵽ eureka �����б���
    service-url:
     #defaultZone: http://eureka7001:7001/eureka  #�����ַ�� 7001ע�������� application.yml �б�¶������ע���ַ �������棩
      defaultZone: http://eureka7001.com:7001/eureka/,http://eureka7002.com:7002/eureka/,http://eureka7003.com:7003/eureka/  #������ע�ᵽ Eureka ��Ⱥ
  instance:
    instance-id: spring-cloud-provider-8002 #�޸��Զ���ķ���������Ϣ
    prefer-ip-address: true  #��ʾ����·���� ip ��ַ

```





4\. �� micro-service-cloud-provider-dept-8003 �� application.yml �У��޸Ķ˿ں��Լ����ݿ�������Ϣ���޸ĵ��������¡�





```

server:
  port: 8003  #�˿ں��޸�Ϊ 8003

spring:
  application:
    name: microServiceCloudProviderDept  #΢�������ƣ������޸ģ��� micro-service-cloud-provider-dept-8001 �����ñ���һ��

  datasource:
    username: root        #���ݿ��½�û���
    password: root        #���ݿ��½����
    url: jdbc:mysql://127.0.0.1:3306/spring_cloud_db3      #���ݿ�url
    driver-class-name: com.mysql.jdbc.Driver                  #���ݿ�����

eureka:
  client: #���ͻ���ע�ᵽ eureka �����б���
    service-url:
     #defaultZone: http://eureka7001:7001/eureka  #�����ַ�� 7001ע�������� application.yml �б�¶������ע���ַ �������棩
      defaultZone: http://eureka7001.com:7001/eureka/,http://eureka7002.com:7002/eureka/,http://eureka7003.com:7003/eureka/  #������ע�ᵽ Eureka ��Ⱥ
  instance:
    instance-id: spring-cloud-provider-8003 #�Զ������������Ϣ
    prefer-ip-address: true  #��ʾ����·���� ip ��ַ

```





5.  �������� micro-service-cloud-eureka-7001/7002/7003������ע�����ļ�Ⱥ����micro-service-cloud-provider-dept-8001/8002/8003�������ṩ�߼�Ⱥ���Լ� micro-service-cloud-consumer-dept-80�����������ߣ���

6\. ʹ��������������ʡ�http://eureka7001.com/consumer/dept/get/1��,�������ͼ��

![Ribbon Ĭ�ϸ��ؾ������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1012215133-3.gif)
ͼ4��Ribbon Ĭ�ϸ��ؾ������

ͨ��ͼ 4 �� dbSource �ֶ�ȡֵ�ı仯���Կ�����Spring Cloud Ribbon Ĭ��ʹ����ѯ���Խ��и��ؾ��⡣

## �л����ؾ������

Spring Cloud Ribbon Ĭ��ʹ����ѯ����ѡȡ����ʵ��������Ҳ���Ը�������������л����ؾ�����ԡ�

�л����ؾ�����Եķ����ܼ򵥣�����ֻ��Ҫ�ڷ��������ߣ��ͻ��ˣ����������У��� IRule ������ʵ����ע�뵽�����м��ɡ�

�������Ǿ�ͨ��һ��ʵ��������ʾ������л����ؾ���Ĳ��ԡ�

1\. �� micro-service-cloud-consumer-dept-80 �������� ConfigBean ��������´��룬�����ؾ�������л�Ϊ RandomRule���������





```


@Bean
public IRule myRule() {
    // RandomRule Ϊ�������
    return  new RandomRule();
}

```





2\. ���� micro-service-cloud-consumer-dept-80��ʹ����������ʡ�http://eureka7001.com/consumer/dept/get/1�����������ͼ��

![�л����ؾ������Ϊ���](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1012214B8-4.gif)
ͼ5���л����ؾ������Ϊ���

ͨ��ͼ 5 �� dbSource �ֶ�ȡֵ�ı仯���Կ����������Ѿ������ؾ�������л�Ϊ RandomRule���������

## ���Ƹ��ؾ������

ͨ������£�Ribbon �ṩ����ЩĬ�ϸ��ؾ�������ǿ����������ǵ�����ģ�����������Ҫ�����ǻ����Ը������������Ƹ��ؾ�����ԡ�

�������Ǿ�����ʾ����ζ��Ƹ��ؾ�����ԡ�

1\. �� micro-service-cloud-consumer-dept-80 ���½�һ�� net.biancheng.myrule �������ڸð��´���һ����Ϊ MyRandomRule ���࣬�������¡�





```

package net.biancheng.myrule;

import com.netflix.client.config.IClientConfig;
import com.netflix.loadbalancer.AbstractLoadBalancerRule;
import com.netflix.loadbalancer.ILoadBalancer;
import com.netflix.loadbalancer.Server;

import java.util.List;

/**
* ���� Ribbon ���ؾ������
*/
public class MyRandomRule extends AbstractLoadBalancerRule {
    private int total = 0;            // �ܹ������õĴ�����ĿǰҪ��ÿ̨������5��
    private int currentIndex = 0;    // ��ǰ�ṩ����Ļ�����

    public Server choose(ILoadBalancer lb, Object key) {
        if (lb == null) {
            return null;
        }
        Server server = null;

        while (server == null) {
            if (Thread.interrupted()) {
                return null;
            }
            //��ȡ������Ч�ķ���ʵ���б�
            List<Server> upList = lb.getReachableServers();
            //��ȡ���еķ���ʵ�����б�
            List<Server> allList = lb.getAllServers();

            //���û���κεķ���ʵ���򷵻� null
            int serverCount = allList.size();
            if (serverCount == 0) {
                return null;
            }
            //������������ƣ���ÿ������ʵ��ֻ���ڵ��� 3 ��֮�󣬲Ż���������ķ���ʵ��
            if (total < 3) {
                server = upList.get(currentIndex);
                total++;
            } else {
                total = 0;
                currentIndex++;
                if (currentIndex >= upList.size()) {
                    currentIndex = 0;
                }
            }
            if (server == null) {
                Thread.yield();
                continue;
            }
            if (server.isAlive()) {
                return (server);
            }
            server = null;
            Thread.yield();
        }
        return server;
    }

    @Override
    public Server choose(Object key) {
        return choose(getLoadBalancer(), key);
    }

    @Override
    public void initWithNiwsConfig(IClientConfig clientConfig) {
        // TODO Auto-generated method stub
    }
}

```





2\. �� net.biancheng.myrule ���´���һ����Ϊ MySelfRibbonRuleConfig �������࣬�����Ƕ��Ƶĸ��ؾ������ʵ����ע�뵽�����У��������¡�





```
package net.biancheng.myrule;

import com.netflix.loadbalancer.IRule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
* ���� Ribbon ���ؾ�����Ե�������
* ���Զ��� Ribbon ���ؾ������������ ������ net.biancheng.c �������Ӱ���
* �������е� Ribbon �ͻ��˶�����øò��ԣ��޷��ﵽ���⻯���Ƶ�Ŀ��
*/
@Configuration
public class MySelfRibbonRuleConfig {
    @Bean
    public IRule myRule() {
        //�Զ��� Ribbon ���ؾ������
        return new MyRandomRule(); //�Զ��壬���ѡ��ĳһ��΢����ִ�����
    }
}

```





3\. �޸�λ�� net.biancheng.c ���µ��������࣬�ڸ�����ʹ�� @RibbonClient ע�������Ƕ��Ƶĸ��ؾ��������Ч���������¡�





```


package net.biancheng.c;

import net.biancheng.myrule.MySelfRibbonRuleConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.ribbon.RibbonClient;

@SpringBootApplication
@EnableEurekaClient
//�Զ��� Ribbon ���ؾ������������������ʹ�� RibbonClient ע�⣬�ڸ�΢��������ʱ�������Զ�ȥ���������Զ���� Ribbon �����࣬�Ӷ���������Ч
// name Ϊ��Ҫ���Ƹ��ؾ�����Ե�΢�������ƣ�application name��
// configuration Ϊ���Ƶĸ��ؾ�����Ե������࣬
// �ҹٷ��ĵ�����ȷ������������಻���� ComponentScan ע�⣨SpringBootApplication ע���а����˸�ע�⣩�µİ������Ӱ��У����Զ��帺�ؾ��������಻���� net.biancheng.c �������Ӱ���
@RibbonClient(name = "MICROSERVICECLOUDPROVIDERDEPT", configuration = MySelfRibbonRuleConfig.class)
public class MicroServiceCloudConsumerDept80Application {

    public static void main(String[] args) {
        SpringApplication.run(MicroServiceCloudConsumerDept80Application.class, args);
    }
}

```





4\. ���� micro-service-cloud-consumer-dept-80��ʹ����������ʡ�http://eureka7001.com/consumer/dept/get/1�����������ͼ��

![���Ƹ��ؾ������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/10122152E-5.gif)
ͼ6�����Ƹ��ؾ������

ͨ��ͼ 6 �� dbSource �ֶ�ȡֵ�ı仯���Կ��������Ƕ��Ƶĸ��ؾ�������Ѿ���Ч��

# �ο�����
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud
https://github.com/macrozheng/springcloud-learning