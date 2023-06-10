Netflix Feign �� Netflix ��˾������һ��ʵ�ָ��ؾ���ͷ�����õĿ�Դ�����Spring Cloud ������ Netflix �е�������Դ������������� Eureka��Ribbon �Լ� Hystrix �ȣ�һ�����Ͻ� Spring Cloud Netflix ģ���У����Ϻ�ȫ��Ϊ Spring Cloud Netflix Feign��

Feign �� [Ribbon](http://c.biancheng.net/springcloud/ribbon.html) �����˼��ɣ����� Ribbon ά����һ�ݿ��÷����嵥����ͨ�� Ribbon ʵ���˿ͻ��˵ĸ��ؾ��⡣

Feign ��һ������ʽ���������������� RestTemplate �Ļ��������˽�һ���ķ�װ��ͨ�� Feign������ֻ��Ҫ����һ���ӿڲ�ͨ��ע����м򵥵����ã������� Dao �ӿ������ Mapper ע��һ��������ʵ�ֶ� HTTP �ӿڵİ󶨡�

ͨ�� Feign�����ǿ�������ñ��ط���һ��������Զ�̷��񣬶���ȫ�о����������ڽ���Զ�̵��á�

Feign ֧�ֶ���ע�⣬���� Feign �Դ���ע���Լ� JAX-RS ע��ȣ����ź����� Feign ������֧�� Spring MVC ע�⣬�����ɻ����� Spring �û��������㡣

2019 �� Netflix ��˾���� Feign �����ʽ����ͣ��ά��״̬������ Spring �ٷ����Ƴ���һ����Ϊ OpenFeign �������Ϊ Feign �����������

## OpenFeign

OpenFeign ȫ�� Spring Cloud OpenFeign������ Spring �ٷ��Ƴ���һ������ʽ��������븺�ؾ�����������ĳ��־���Ϊ���������ͣ��ά��״̬�� Feign��

OpenFeign �� Spring Cloud �� Feign �Ķ��η�װ�������� Feign �����й��ܣ����� Feign �Ļ����������˶� Spring MVC ע���֧�֣����� @RequestMapping��@GetMapping �� @PostMapping �ȡ�

#### OpenFeign ����ע��

ʹ�� OpenFegin ����Զ�̷������ʱ������ע�����±�

| ע��                | ˵��                                                         |
| ------------------- | ------------------------------------------------------------ |
| @FeignClient        | ��ע������֪ͨ OpenFeign ����� @RequestMapping ע���µĽӿڽ��н�������ͨ����̬����ķ�ʽ����ʵ���࣬ʵ�ָ��ؾ���ͷ�����á� |
| @EnableFeignClients | ��ע�����ڿ��� OpenFeign ���ܣ��� Spring Cloud Ӧ������ʱ��OpenFeign ��ɨ����� @FeignClient ע��Ľӿڣ����ɴ���ע�ᵽ Spring �����С� |
| @RequestMapping     | Spring MVC ע�⣬�� Spring MVC ��ʹ�ø�ע��ӳ������ͨ������ָ����������Controller�����Դ�����Щ URL �����൱�� Servlet �� web.xml �����á� |
| @GetMapping         | Spring MVC ע�⣬����ӳ�� GET ��������һ�����ע�⣬�൱�� @RequestMapping(method = RequestMethod.GET) �� |
| @PostMapping        | Spring MVC ע�⣬����ӳ�� POST ��������һ�����ע�⣬�൱�� @RequestMapping(method = RequestMethod.POST) �� |

> Spring Cloud Finchley �����ϰ汾һ��ʹ�� OpenFeign ��Ϊ����������������� OpenFeign ���� 2019 �� Feign ͣ������ά�����Ƴ��ģ���˴���� 2019 �꼰�Ժ������Ŀʹ�õĶ��� OpenFeign���� 2018 ����ǰ����Ŀһ��ʹ�� Feign��

## Feign VS OpenFeign

�������Ǿ����Ա��� Feign �� OpenFeign ����ͬ��

#### ��ͬ��

Feign �� OpenFegin ����������ͬ�㣺

*   Feign �� OpenFeign ���� Spring Cloud �µ�Զ�̵��ú͸��ؾ��������
*   Feign �� OpenFeign ����һ����������ʵ�ַ����Զ�̵��ú͸��ؾ��⡣
*   Feign �� OpenFeign ���� Ribbon �����˼��ɣ������� Ribbon ά���˿��÷����嵥����ͨ�� Ribbon ʵ���˿ͻ��˵ĸ��ؾ��⡣
*   Feign �� OpenFeign �����ڷ��������ߣ��ͻ��ˣ��������󶨽ӿڲ�ͨ��ע��ķ�ʽ�������ã���ʵ��Զ�̷���ĵ��á�

#### ��ͬ��

Feign �� OpenFeign �������²�ͬ��

*   Feign �� OpenFeign �������ͬ��Feign ������Ϊ spring-cloud-starter-feign���� OpenFeign ������Ϊ spring-cloud-starter-openfeign��
*   Feign �� OpenFeign ֧�ֵ�ע�ⲻͬ��Feign ֧�� Feign ע��� JAX-RS ע�⣬����֧�� Spring MVC ע�⣻OpenFeign ����֧�� Feign ע��� JAX-RS ע���⣬��֧�� Spring MVC ע�⡣

## OpenFeign ʵ��Զ�̷������

�������Ǿ�ͨ��һ��ʵ��������ʾ��ͨ�� OpenFeign �����ʵ��Զ�̷�����õġ�

1\. �� spring-cloud-demo2 �´���һ����Ϊ micro-service-cloud-consumer-dept-feign �� Spring Boot ģ�飬���� pom.xml ���������������





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
    <artifactId>micro-service-cloud-consumer-dept-feign</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>micro-service-cloud-consumer-dept-feign</name>
    <description>Demo project for Spring Boot</description>
    <properties>
        <java.version>1.8</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>net.biancheng.c</groupId>
            <artifactId>micro-service-cloud-api</artifactId>
            <version>${project.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
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
        <!--Eureka Client ����-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        <!-- Ribbon ����-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-ribbon</artifactId>
        </dependency>
        <!--��� OpenFeign ����-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
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





2\. �� micro-service-cloud-consumer-dept-feign �µ���·������ /resources Ŀ¼���£����һ�� application.yml�������������¡�





```

server:
  port: 80
eureka:
  client:
    register-with-eureka: false #���������߿��Բ������ע������ע�����
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka/,http://eureka7002.com:7002/eureka/,http://eureka7003.com:7003/eureka/
    fetch-registry: true  #���������߿ͻ�����Ҫȥ��������
```





3\. �� net.biancheng.c.service ���´���һ����Ϊ DeptFeignService �Ľӿڣ����ڸýӿ���ʹ�� @FeignClient ע��ʵ�ֶԷ���ӿڵİ󶨣��������¡�





```
package net.biancheng.c.service;

import net.biancheng.c.entity.Dept;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

//���Ϊ�����ڵ�һ�����
@Component
// �����ṩ���ṩ�ķ������ƣ��� application.name
@FeignClient(value = "MICROSERVICECLOUDPROVIDERDEPT")
public interface DeptFeignService {
    //��Ӧ�����ṩ�ߣ�8001��8002��8003��Controller �ж���ķ���
    @RequestMapping(value = "/dept/get/{id}", method = RequestMethod.GET)
    public Dept get(@PathVariable("id") int id);

    @RequestMapping(value = "/dept/list", method = RequestMethod.GET)
    public List<Dept> list();
}

```





�ڱ�д����󶨽ӿ�ʱ����Ҫע������ 2 �㣺

*   �� @FeignClient ע���У�value ���Ե�ȡֵΪ�������ṩ�ߵķ��������������ṩ�������ļ���application.yml���� spring.application.name ��ȡֵ��
*   �ӿ��ж����ÿ��������������ṩ�ߣ��� micro-service-cloud-provider-dept-8001 �ȣ��� Controller ����ķ��񷽷���Ӧ��

4\. �� net.biancheng.c.controller ���£�����һ����Ϊ DeptController_Consumer �� Controller �࣬�������¡�





```

package net.biancheng.c.controller;

import net.biancheng.c.entity.Dept;
import net.biancheng.c.service.DeptFeignService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

@RestController
public class DeptController_Consumer {
    
    @Resource
    private DeptFeignService deptFeignService;

    @RequestMapping(value = "/consumer/dept/get/{id}")
    public Dept get(@PathVariable("id") Integer id) {
        return deptFeignService.get(id);
    }

    @RequestMapping(value = "/consumer/dept/list")
    public List<Dept> list() {
        return deptFeignService.list();
    }
}
```





5\. ��������������� @EnableFeignClients ע�⿪�� OpenFeign ���ܣ��������¡�





```

package net.biancheng.c;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients //���� OpenFeign ����
public class MicroServiceCloudConsumerDeptFeignApplication {

    public static void main(String[] args) {
        SpringApplication.run(MicroServiceCloudConsumerDeptFeignApplication.class, args);
    }
}
```





Spring Cloud Ӧ��������ʱ��OpenFeign ��ɨ����� @FeignClient ע��Ľӿ����ɴ�����ע�˵� Spring �����С�

6\. ������������ע�����ļ�Ⱥ�������ṩ���Լ� micro-service-cloud-consumer-dept-feign��������ɺ�ʹ����������ʡ�http://eureka7001.com/consumer/dept/list�����������ͼ��

![OpenFeign ʵ�ַ������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1014296212-0.png)
ͼ1��OpenFeign ʵ��Զ�̷������

7\. ������η��ʡ�http://eureka7001.com/consumer/dept/list�����������ͼ��

![OpenFeign Ĭ�ϸ��ؾ���](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1014294062-1.gif)
ͼ2��OpenFeign ���ؾ���

��ͼ 2 ���Կ��������� OpenFeign ������ Ribbon�������Ҳʵ���˿ͻ��˵ĸ��ؾ��⣬��Ĭ�ϸ��ؾ������Ϊ��ѯ���ԡ�

## OpenFeign ��ʱ����

OpenFeign �ͻ��˵�Ĭ�ϳ�ʱʱ��Ϊ 1 ���ӣ��������˴��������ʱ�䳬�� 1 ��ͻᱨ��Ϊ�˱��������������������Ҫ�� OpenFeign �ͻ��˵ĳ�ʱʱ����п��ơ�

�������Ǿ�ͨ��һ��ʵ��������ʾ OpenFeign ����ν��г�ʱ���Ƶġ�

1\. �����еķ����ṩ�ߣ�����ˣ��� DeptController �����һ����Ӧʱ��Ϊ 5 ��ķ��񣬴������¡�





```

//��ʱ����,�÷������Ӧʱ��Ϊ 5 ��
@RequestMapping(value = "/dept/feign/timeout")
public String DeptFeignTimeout() {
    //��ͣ 5 ��
    try {
        TimeUnit.SECONDS.sleep(5);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    return serverPort;
}

```





2\. �� micro-service-cloud-consumer-dept-feign �� DeptFeignService �ӿ���������´��룬�󶨷���˸ո���ӵĳ�ʱ����





```

@RequestMapping(value = "/dept/feign/timeout")
public String DeptFeignTimeout();

```





3\. �� micro-service-cloud-consumer-dept-feign �� DeptController_Consumer ������´��롣





```

@RequestMapping(value = "/consumer/dept/feign/timeout")
public String DeptFeignTimeout() {
    // openFeign-ribbon �ͻ���һ��Ĭ�ϵȴ�һ���ӣ�������ʱ��ͻᱨ��
    return deptFeignService.DeptFeignTimeout();
}

```





4\. �������з����ṩ�ߣ�ʹ����������η��ʡ�http://eureka7001.com:8001/dept/feign/timeout������http://eureka7001.com:8002/dept/feign/timeout���͡�http://eureka7001.com:8003/dept/feign/timeout����ȷ�����з����ṩ���ṩ�ĳ�ʱ����������ʹ�ã�����ͼ��

![�����ṩ�߳�ʱ����](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/10142a102-2.png)
ͼ3�������ṩ�ߵĳ�ʱ����

5\. ���� micro-service-cloud-consumer-dept-feign��ʹ����������ʡ�http://eureka7001.com/consumer/dept/feign/timeout�����������ͼ��

![OpenFeign ��ʱ����](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1014293G1-3.png)
ͼ4��OpenFeign ��ʱ����

6\. �� micro-service-cloud-consumer-dept-feign �� application.yml ������������ã�����ʱʱ������Ϊ 6 �롣





```


ribbon:
  ReadTimeout: 6000 #�����������õ�ʱ�䣬����������״������������£����������������õ�ʱ��
  ConnectionTimeout: 6000 #�������Ӻ󣬷�������ȡ��������Դ��ʱ��

```





> ע������ OpenFeign ������ Ribbon �����������Լ����ؾ����ڵײ㶼������ Ribbon ʵ�ֵģ���� OpenFeign ��ʱ����Ҳ��ͨ�� Ribbon ��ʵ�ֵġ�

7\. �ٴ����� micro-service-cloud-consumer-dept-feign��ʹ����������ʡ�http://eureka7001.com/consumer/dept/feign/timeout�����������ͼ��

![OpenFeign ��ʱ����](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/10142942D-4.png)
ͼ5��OpenFeign ��ʱ����

## OpenFeign ��־��ǿ

OpenFeign �ṩ����־��ӡ���ܣ����ǿ���ͨ�����õ�����־�������˽������ϸ�ڡ�

Feign Ϊÿһ�� FeignClient ���ṩ��һ�� feign.Logger ʵ����ͨ�������Զ� OpenFeign ����󶨽ӿڵĵ���������м�ء�

OpenFeign ��־��ӡ���ܵĿ�����ʽ�Ƚϼ򵥣��������Ǿ�ͨ��һ��ʵ��������ʾ��

1\. �� micro-service-cloud-consumer-dept-feign �� application.yml �������������ݡ�





```


logging:
  level:
    #feign ��־��ʲô���ļ����ظýӿ�
    net.biancheng.c.service.DeptFeignService: debug
```





��������˵�����£�

*   net.biancheng.c.service.DeptFeignService �ǿ��� @FeignClient ע��Ľӿڣ�������󶨽ӿڣ�������������Ҳ����ֻ���ò���·������ʾ��ظ�·���µ����з���󶨽ӿ�
*   debug����ʾ�����ýӿڵ���־����

�������õĺ�����ǣ�OpenFeign �� debug ������ net.biancheng.c.service.DeptFeignService �ӿڡ�

2. �� net.biancheng.c. config ���´���һ����Ϊ ConfigBean �������࣬�������¡�





```

package net.biancheng.c.config;
import feign.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
@Configuration
public class ConfigBean {
    /**
     * OpenFeign ��־��ǿ
     * ���� OpenFeign ��¼��Щ����
     */
    @Bean
    Logger.Level feginLoggerLevel() {
        return Logger.Level.FULL;
    }
}

```





�����õ�������ͨ�����õ� Logger.Level ������� OpenFeign ��¼��Щ��־���ݡ�

Logger.Level �ľ��弶�����£�

*   NONE������¼�κ���Ϣ��
*   BASIC������¼���󷽷���URL �Լ���Ӧ״̬���ִ��ʱ�䡣
*   HEADERS�����˼�¼ BASIC �������Ϣ�⣬�����¼�������Ӧ��ͷ��Ϣ��
*   FULL����¼������������Ӧ����ϸ������ͷ��Ϣ�������塢Ԫ���ݵȵȡ�

3\. ���� micro-service-cloud-consumer-dept-feign��ʹ����������ʡ�http://eureka7001.com/consumer/dept/list��������̨������¡�

```
2021-10-12 14:33:07.408 DEBUG 13388 --- [p-nio-80-exec-2] n.biancheng.c.service.DeptFeignService   : [DeptFeignService#list] ---> GET http://MICROSERVICECLOUDPROVIDERDEPT/dept/list HTTP/1.1
2021-10-12 14:33:07.408 DEBUG 13388 --- [p-nio-80-exec-2] n.biancheng.c.service.DeptFeignService   : [DeptFeignService#list] ---> END HTTP (0-byte body)
2021-10-12 14:33:07.983 DEBUG 13388 --- [p-nio-80-exec-2] n.biancheng.c.service.DeptFeignService   : [DeptFeignService#list] <--- HTTP/1.1 200 (574ms)
2021-10-12 14:33:07.983 DEBUG 13388 --- [p-nio-80-exec-2] n.biancheng.c.service.DeptFeignService   : [DeptFeignService#list] connection: keep-alive
2021-10-12 14:33:07.983 DEBUG 13388 --- [p-nio-80-exec-2] n.biancheng.c.service.DeptFeignService   : [DeptFeignService#list] content-type: application/json
2021-10-12 14:33:07.983 DEBUG 13388 --- [p-nio-80-exec-2] n.biancheng.c.service.DeptFeignService   : [DeptFeignService#list] date: Tue, 12 Oct 2021 06:33:07 GMT
2021-10-12 14:33:07.983 DEBUG 13388 --- [p-nio-80-exec-2] n.biancheng.c.service.DeptFeignService   : [DeptFeignService#list] keep-alive: timeout=60
2021-10-12 14:33:07.983 DEBUG 13388 --- [p-nio-80-exec-2] n.biancheng.c.service.DeptFeignService   : [DeptFeignService#list] transfer-encoding: chunked
2021-10-12 14:33:07.983 DEBUG 13388 --- [p-nio-80-exec-2] n.biancheng.c.service.DeptFeignService   : [DeptFeignService#list]
2021-10-12 14:33:07.991 DEBUG 13388 --- [p-nio-80-exec-2] n.biancheng.c.service.DeptFeignService   : [DeptFeignService#list] [{"deptNo":1,"deptName":"������","dbSource":"bianchengbang_jdbc"},{"deptNo":2,"deptName":"���²�","dbSource":"bianchengbang_jdbc"},{"deptNo":3,"deptName":"����","dbSource":"bianchengbang_jdbc"},{"deptNo":4,"deptName":"�г���","dbSource":"bianchengbang_jdbc"},{"deptNo":5,"deptName":"��ά��","dbSource":"bianchengbang_jdbc"}]
2021-10-12 14:33:07.991 DEBUG 13388 --- [p-nio-80-exec-2] n.biancheng.c.service.DeptFeignService   : [DeptFeignService#list] <--- END HTTP (341-byte body)```
```
# �ο�����
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud
https://github.com/macrozheng/springcloud-learning