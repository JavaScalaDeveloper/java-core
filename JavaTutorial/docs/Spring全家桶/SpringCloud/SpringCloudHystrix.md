��΢����ܹ��У�һ��Ӧ�������ɶ��������ɣ���Щ����֮���໥������������ϵ���۸��ӡ�

����һ��΢����ϵͳ�д��� A��B��C��D��E��F �ȶ���������ǵ�������ϵ����ͼ��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/101623H11-0.png)

ͼ1������������ϵ

ͨ������£�һ���û�����������Ҫ���������ϲ�����ɡ���ͼ 1 ��ʾ�������з��񶼴��ڿ���״̬ʱ������ 1 ��Ҫ���� A��D��E��F �ĸ����������ɣ����� 2 ��Ҫ���� B��E��D �������������ɣ����� 3 ��Ҫ���÷��� C��F��E��D �ĸ����������ɡ�

������ E �������ϻ������ӳ�ʱ����������������

1.  ��ʹ�������з��񶼿��ã����ڷ��� E �Ĳ����ã���ô�û����� 1��2��3 ���ᴦ������״̬���ȴ����� E ����Ӧ���ڸ߲����ĳ����£��ᵼ���������������߳���Դ�ڶ�ʱ����Ѹ�����Ĵ�����
2.  ���������ڷ��� E ����������������� B��D �Լ� F Ҳ���ᴦ���߳�����״̬���ȴ����� E ����Ӧ��������Щ����Ĳ����á�
3.  ������������B��D �� F �ķ���������� A �ͷ��� C Ҳ�ᴦ���߳�����״̬���Եȴ����� D �ͷ��� F ����Ӧ�����·��� A �ͷ��� C Ҳ�����á�

�����Ϲ��̿��Կ�������΢����ϵͳ��һ��������ֹ���ʱ�����ϻ����ŷ���ĵ�����·��ϵͳ�з�����ӣ����յ�������΢����ϵͳ��̱��������ǡ�ѩ��ЧӦ����Ϊ�˷�ֹ�����¼��ķ�����΢����ܹ������ˡ��۶�������һϵ�з����ݴ�ͱ������ơ�

## �۶���

�۶�����Circuit Breaker��һ����Դ����ѧ�еĵ�·֪ʶ�����������ǵ���·���ֹ���ʱ��Ѹ���жϵ�Դ�Ա�����·�İ�ȫ��

��΢���������۶����������� Martin Fowler ��������� ��[Circuit Breake](https://martinfowler.com/bliki/CircuitBreaker.html)r��һ���������������ѧ�е��۶����������ƣ�΢����ܹ��е��۶����ܹ���ĳ�����������Ϻ��������÷�����һ������Ԥ�ڵġ��ɴ���Ľ�����Ӧ��FallBack���������ǳ�ʱ��ĵȴ������׳����÷��޷�������쳣�������ͱ�֤�˷�����÷����̲߳��ᱻ��ʱ�䡢����Ҫ��ռ�ã����������΢����ϵͳ�е����ӣ���ֹϵͳѩ��ЧӦ�ķ�����

## Spring Cloud Hystrix

Spring Cloud Hystrix ��һ������ķ����ݴ��뱣�������Ҳ�� Spring Cloud ������Ҫ�����֮һ��

Spring Cloud Hystrix �ǻ��� Netflix ��˾�Ŀ�Դ��� Hystrix ʵ�ֵģ����ṩ���۶������ܣ��ܹ���Ч����ֹ�ֲ�ʽ΢����ϵͳ�г����������ϣ������΢����ϵͳ�ĵ��ԡ�Spring Cloud Hystrix ���з��񽵼��������۶ϡ��̸߳��롢���󻺴桢����ϲ��Լ�ʵʱ���ϼ�ص�ǿ���ܡ�

> Hystrix [h?st'r?ks]�����ĺ����Ǻ�������ı��ϳ����˼��̣�ʹ��ӵ����ǿ������ұ����������� Spring Cloud Hystrix ��Ϊһ�������ݴ��뱣�������Ҳ�����÷���ӵ�����ұ��������������Ҳ���˽���Ϸ��Ϊ������硱��

��΢����ϵͳ�У�Hystrix �ܹ���������ʵ������Ŀ�꣺

*   **�����߳���Դ**����ֹ��������Ĺ��Ϻľ�ϵͳ�е������߳���Դ��
*   **����ʧ�ܻ���**����ĳ���������˹��ϣ����÷�����÷�һֱ�ȴ�������ֱ�ӷ�������ʧ�ܡ�
*   **�ṩ������FallBack������**��������ʧ�ܺ��ṩһ����ƺõĽ���������ͨ����һ�����׷�����������ʧ�ܺ󼴵��ø÷�����
*   **��ֹ������ɢ**��ʹ���۶ϻ��ƣ���ֹ������ɢ����������
*   **��ع���**���ṩ�۶������ϼ����� Hystrix Dashboard����ʱ����۶�����״̬��

## Hystrix ���񽵼�

Hystrix �ṩ�˷��񽵼����ܣ��ܹ���֤��ǰ����������������ϵ�Ӱ�죬��߷���Ľ�׳�ԡ�

���񽵼���ʹ�ó��������� 2 �֣�

*   �ڷ�����ѹ������ʱ������ʵ��ҵ���������������һЩ����Ҫ���������ķ�������в��Եز������򵥴����Ӷ��ͷŷ�������Դ�Ա�֤���ķ�������������
*   ��ĳЩ���񲻿���ʱ��Ϊ�˱��ⳤʱ��ȴ���ɷ��񿨶ٻ�ѩ��ЧӦ��������ִ�б��õĽ����߼����̷���һ���Ѻõ���ʾ���Ա�������ҵ����Ӱ�졣

���ǿ���ͨ����д HystrixCommand �� getFallBack() ������ HystrixObservableCommand �� resumeWithFallback() ������ʹ����֧�ַ��񽵼���

Hystrix ���񽵼� FallBack �ȿ��Է��ڷ���˽��У�Ҳ���Է��ڿͻ��˽��С�

Hystrix �������³����½��з��񽵼�����

*   ���������쳣
*   ����ʱ
*   �۶������ڴ�״̬
*   �̳߳���Դ�ľ�

## ʾ��1

�������Ǿ�ͨ��һ���������ֱ���ʾ�� Hystrix ����˷��񽵼��Ϳͻ��˷��񽵼���

#### ����˷��񽵼�

1\. �������� spring-cloud-demo2 �´���һ����Ϊ micro-service-cloud-provider-dept-hystrix-8004 �ķ����ṩ�ߣ������� pom.xml ���������������





```

<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <!--��pom-->
    <parent>
        <artifactId>spring-cloud-demo2</artifactId>
        <groupId>net.biancheng.c</groupId>
        <version>0.0.1-SNAPSHOT</version>
    </parent>

    <groupId>net.biancheng.c</groupId>
    <artifactId>micro-service-cloud-provider-dept-hystrix-8004</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>micro-service-cloud-provider-dept-hystrix-8004</name>
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
        <!--��� Spring Boot �ļ��ģ��-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <!-- eureka �ͻ���-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        <!--hystrix ����-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-hystrix</artifactId>
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





2\. ����·������ /resources Ŀ¼�������һ�������ļ� application.yml�������������¡�





```

spring:
  application:
    name: microServiceCloudProviderDeptHystrix  #΢�������ƣ����Ⱪ©��΢�������ƣ�ʮ����Ҫ

server:
  port: 8004
########################################### Spring cloud �Զ���������ƺ� ip ��ַ###############################################
eureka:
  client: #���ͻ���ע�ᵽ eureka �����б���
    service-url:
      #defaultZone: http://eureka7001:7001/eureka  #�����ַ�� 7001ע�������� application.yml �б�¶������ע���ַ �������棩
      defaultZone: http://eureka7001.com:7001/eureka/,http://eureka7002.com:7002/eureka/,http://eureka7003.com:7003/eureka/  #������ע�ᵽ Eureka ��Ⱥ
  instance:
    instance-id: spring-cloud-provider-8004 #�Զ������������Ϣ
    prefer-ip-address: true  #��ʾ����·���� ip ��ַ
#####################spring cloud ʹ�� Spring Boot actuator ���������Ϣ###########################################
# Spring Boot 2.50�� actuator ��������˴�����Ľڵ㣬ֻ��¶�� heath �ڵ㣬�������ã�*������Ϊ�˿������еĽڵ�
management:
  endpoints:
    web:
      exposure:
        include: "*"   # * ��yaml �ļ����ڹؼ��֣�������Ҫ������
info:
  app.name: micro-service-cloud-provider-dept-hystrix
  company.name: c.biancheng.net
  build.aetifactId: @project.artifactId@
  build.version: @project.version@

```





3\. �� net.biancheng.c.service ���´���һ����Ϊ  DeptService �Ľӿڣ��������¡�





```

package net.biancheng.c.service;

public interface DeptService {

    // hystrix �۶���ʾ�� ok
    public String deptInfo_Ok(Integer id);

    //hystrix �۶�����ʱ����
    public String deptInfo_Timeout(Integer id);
}

```





4\. �� net.biancheng.c.service.impl ���£����� DeptService �ӿڵ�ʵ���� DeptServiceImpl���������¡�





```
package net.biancheng.c.service.impl;

import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;
import com.netflix.hystrix.contrib.javanica.annotation.HystrixProperty;
import net.biancheng.c.service.DeptService;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service("deptService")
public class DeptServiceImpl implements DeptService {

    @Override
    public String deptInfo_Ok(Integer id) {
        return "�̳߳أ�" + Thread.currentThread().getName() + "  deptInfo_Ok,id:   " + id;
    }

    //һ���÷���ʧ�ܲ��׳����쳣��Ϣ�󣬻��Զ�����  @HystrixCommand ע���ע�� fallbackMethod ָ���ķ���
    @HystrixCommand(fallbackMethod = "dept_TimeoutHandler",
            commandProperties =
                    //�涨 5 �������ھͲ������������У����� 5 ��ͱ�������ָ���ķ���
                    {@HystrixProperty(name = "execution.isolation.thread.timeoutInMilliseconds", value = "5000")})
    @Override
    public String deptInfo_Timeout(Integer id) {
        int outTime = 6;
        try {
            TimeUnit.SECONDS.sleep(outTime);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return "�̳߳أ�" + Thread.currentThread().getName() + "  deptInfo_Timeout,id:   " + id + "  ��ʱ: " + outTime;
    }

    // ��������ֹ��Ϻ󣬵��ø÷��������Ѻ���ʾ
    public String dept_TimeoutHandler(Integer id) {
       return  "C������������������ϵͳ��æ���Ժ����ԣ�"+"�̳߳أ�" + Thread.currentThread().getName() + "  deptInfo_Timeout,id:   " + id;
    }
}

```





���ǿ��Կ��� deptInfo_Timeout() ������ʹ�� @HystrixCommand ע�⣬��ע��˵�����£�

*   ���� fallbackMethod ��������ָ������������
*   ���� execution.isolation.thread.timeoutInMilliseconds ��������������ó�ʱʱ��ķ�ֵ����ֵ�ڿ����������У�����ִ�н�������

5.  �� net.biancheng.c.controller ���´���һ����Ϊ DeptController �� Controller �࣬�������¡�





```

package net.biancheng.c.controller;

import lombok.extern.slf4j.Slf4j;
import net.biancheng.c.service.DeptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
public class DeptController {
    @Autowired
    private DeptService deptService;
    @Value("${server.port}")
    private String serverPort;

    @RequestMapping(value = "/dept/hystrix/ok/{id}")
    public String deptInfo_Ok(@PathVariable("id") Integer id) {
        String result = deptService.deptInfo_Ok(id);
        log.info("�˿ںţ�" + serverPort + " result:" + result);
        return result + "��   �˿ںţ�" + serverPort;
    }

    // Hystrix ����ʱ����
    @RequestMapping(value = "/dept/hystrix/timeout/{id}")
    public String deptInfo_Timeout(@PathVariable("id") Integer id) {
        String result = deptService.deptInfo_Timeout(id);
        log.info("�˿ںţ�" + serverPort + " result:" + result);
        return result + "��   �˿ںţ�" + serverPort;
    }

}

```





6\. �� micro-service-cloud-provider-dept-hystrix-8004 �����������ϣ�ʹ�� @EnableCircuitBreaker ע�⿪���۶������ܣ��������¡�





```


package net.biancheng.c;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.circuitbreaker.EnableCircuitBreaker;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient //���� Eureka �ͻ��˹���
@EnableCircuitBreaker //�����۶�������
public class MicroServiceCloudProviderDeptHystrix8004Application {

    public static void main(String[] args) {
        SpringApplication.run(MicroServiceCloudProviderDeptHystrix8004Application.class, args);
    }

}
```





7\. ������������ע�����ģ�Eureka Server����Ⱥ�� micro-service-cloud-provider-dept-hystrix-8004����ʹ����������ʡ�http://eureka7001.com:8004/dept/hystrix/ok/1�����������ͼ��

![Hystrix ok](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1016234615-1.png)
ͼ2��Hystrix ����������

8\. ʹ����������ʡ�http://eureka7001.com:8004/dept/hystrix/timeout/1�����������ͼ��

![Hystrix ���񽵼�](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/101623FR-2.png)
ͼ3��Hystrix ����˷��񽵼�

#### �ͻ��˷��񽵼�

ͨ������£����Ƕ����ڿͻ��˽��з��񽵼������ͻ��˵��õķ���˵ķ��񲻿���ʱ���ͻ���ֱ�ӽ��з��񽵼������������̱߳���ʱ�䡢����Ҫ��ռ�á�

�ͻ��˷��񽵼��������¡�

1\. �� micro-service-cloud-consumer-dept-feign �� pom.xml ����� Hystrix ���������������¡�





```


<!--hystrix ����-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-hystrix</artifactId>
</dependency>
```





2. �� micro-service-cloud-consumer-dept-feign �� application.yml ������������ã������ͻ��˵� Hystrix ���ܡ�





```

feign:
  hystrix:
    enabled: true #�����ͻ��� hystrix

```





3\. �� net.biancheng.c.service ���£�����һ����Ϊ DeptHystrixService �ķ���󶨽ӿڣ��� micro-service-cloud-provider-dept-hystrix-8004 ���ṩ�ķ���ӿڽ��а󶨣��������¡�





```

package net.biancheng.c.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Component
@FeignClient(value = "MICROSERVICECLOUDPROVIDERDEPTHYSTRIX")
public interface DeptHystrixService {
    @RequestMapping(value = "/dept/hystrix/ok/{id}")
    public String deptInfo_Ok(@PathVariable("id") Integer id);

    @RequestMapping(value = "/dept/hystrix/timeout/{id}")
    public String deptInfo_Timeout(@PathVariable("id") Integer id);
}
```





4\. �� net.biancheng.c.controller ���´���һ����Ϊ HystrixController_Consumer �� Controller ���������¡�





```
package net.biancheng.c.controller;

import com.netflix.hystrix.contrib.javanica.annotation.DefaultProperties;
import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;;
import lombok.extern.slf4j.Slf4j;
import net.biancheng.c.service.DeptHystrixService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@Slf4j
@RestController
public class HystrixController_Consumer {

    @Resource
    private DeptHystrixService deptHystrixService;

    @RequestMapping(value = "/consumer/dept/hystrix/ok/{id}")
    public String deptInfo_Ok(@PathVariable("id") Integer id) {
        return deptHystrixService.deptInfo_Ok(id);
    }

    //�ڿͻ��˽��н���
    @RequestMapping(value = "/consumer/dept/hystrix/timeout/{id}")
    @HystrixCommand(fallbackMethod = "dept_TimeoutHandler") //Ϊ������ָ��ר���Ļ��˷���
    public String deptInfo_Timeout(@PathVariable("id") Integer id) {
        String s = deptHystrixService.deptInfo_Timeout(id);
        log.info(s);
        return s;
    }

    // deptInfo_Timeout������ ר�� fallback ����
    public String dept_TimeoutHandler(@PathVariable("id") Integer id) {
        log.info("deptInfo_Timeout ���������ѱ�������");
        return "C�����������������������ϵͳ��æ�����Ժ����ԣ����ͻ��� deptInfo_Timeout ר���Ļ��˷���������";
    }
}

```





5\. �������ļ� appliction.yml ������������ã��ڿͻ�����������ʱ��ʱ�䡣





```
######################### Ribbon �ͻ��˳�ʱ���� ###################################
ribbon:
  ReadTimeout: 6000 #�����������õ�ʱ�䣬����������״������������£����������������õ�ʱ��
  ConnectionTimeout: 6000 #�������Ӻ󣬷�������ȡ��������Դ��ʱ��
######################��������ʱʱ��##########################
hystrix:
  command:
    default:
      execution:
        isolation:
          thread:
            timeoutInMilliseconds: 7000
####################���þ��巽����ʱʱ�� Ϊ 3 ��########################
    DeptHystrixService#deptInfo_Timeout(Integer):
      execution:
        isolation:
          thread:
            timeoutInMilliseconds: 3000

```





�������ļ����������ĳ�ʱʱ��ʱ����Ҫע������ 2 �㣺

1��Hystrix ������Ϊ�������󣨷��������ó�ʱʱ�䣨��λΪ���룩��������ʱ�򴥷�ȫ�ֵĻ��˷������д���

```hystrix.command.default.execution.isolation.thread.timeoutInMilliseconds=mmm```

2��Hystrix ������Ϊĳ���ض��ķ������󣨷��������ó�ʱʱ�䣬��ʽ���£�

```hystrix.command.xxx#yyy(zzz).execution.isolation.thread.timeoutInMilliseconds=mmm```

��ʽ˵�����£�

*   xxx��Ϊ�����÷��񷽷���������ƣ�ͨ��Ϊ����󶨽ӿڵ����ƣ������� DeptHystrixService �ӿڡ�
*   yyy�����񷽷��������� deptInfo_Timeout() ������
*   zzz�������ڵĲ������ͣ����� Integer��String �ȵ�
*   mmm��Ҫ���õĳ�ʱʱ�䣬��λΪ���루1 �� =1000 ���룩

6\. �� micro-service-cloud-consumer-dept-feign �����������ϣ�ʹ�� @EnableHystrix ע�⿪���ͻ��� Hystrix ���ܣ��������¡�





```

package net.biancheng.c;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.hystrix.EnableHystrix;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients //���� OpenFeign ����
@EnableHystrix //���� Hystrix
public class MicroServiceCloudConsumerDeptFeignApplication {

    public static void main(String[] args) {
        SpringApplication.run(MicroServiceCloudConsumerDeptFeignApplication.class, args);
    }
}

```





7\. �޸� micro-service-cloud-provider-dept-hystrix-8004 �� DeptServiceImpl �Ĵ��룬�� deptInfo_Timeout() ����������ʱ���޸�Ϊ 4 �루С�ڳ�ʱʱ�� 5 �룩���Ա�֤������������������������������¡�





```
//һ���÷���ʧ�ܲ��׳����쳣��Ϣ�󣬻��Զ�����  @HystrixCommand ע���ע�� fallbackMethod ָ���ķ���
@HystrixCommand(fallbackMethod = "dept_TimeoutHandler",
        commandProperties =
                //�涨 5 �������ھͲ������������У����� 5 ��ͱ�������ָ���ķ���
                {@HystrixProperty(name = "execution.isolation.thread.timeoutInMilliseconds", value = "5000")})
@Override
public String deptInfo_Timeout(Integer id) {
    int outTime = 4;
    try {
        TimeUnit.SECONDS.sleep(outTime);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    return "�̳߳أ�" + Thread.currentThread().getName() + "  deptInfo_Timeout,id:   " + id + "  ��ʱ: " + outTime;
}

```





8\. ���� micro-service-cloud-provider-dept-hystrix-8004 �� micro-service-cloud-consumer-dept-feign��ʹ����������ʡ�http://eureka7001.com:8004/dept/hystrix/timeout/1����ֱ�ӵ��÷���˵� deptInfo_Timeout() �������������ͼ��

![Hystrix �������������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1016231059-3.png)
ͼ4��Hystrix �������������

9\. ʹ����������ʡ�http://eureka7001.com/consumer/dept/hystrix/timeout/1�����������ͼ��

![Hystrix �ͻ��˷��񽵼�](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/101623C94-4.png)
ͼ5��Hystrix �ͻ��˷��񽵼�

��ͼ 5 ���Կ��������ڷ�������ĺ�ʱΪ 4 �룬�����˿ͻ���Ϊ������ָ���ĳ�ʱʱ�� ��3 �� ������˸÷��񱻽���������������ָ���Ļ��˷�����

## ȫ�ֽ�������

ͨ������ķ�ʽʵ�ַ��񽵼�ʱ����Ҫ�������ҵ�񷽷������ý����������⼫�п��ܻ���ɴ���ļ������͡�Ϊ�˽�������⣬���ǻ�����Ϊ����ҵ�񷽷�ָ��һ��ȫ�ֵĻ��˷��������岽�����¡�

1\. �� HystrixController_Consumer �������ϱ�ע @DefaultProperties ע�⣬��ͨ���� defaultFallback ����ָ��һ��ȫ�ֵĽ����������������¡�





```


@Slf4j
@RestController
@DefaultProperties(defaultFallback = "dept_Global_FallbackMethod") //ȫ�ֵķ��񽵼�����
public class HystrixController_Consumer {
����
}

```





2\. �� HystrixController_Consumer �У�����һ����Ϊ dept_Global_FallbackMethod ��ȫ�ֻط������������¡�





```


/**
 * ȫ�ֵ� fallback ������
 * ���˷�������� hystrix ��ִ�з�������ͬ����
 * @DefaultProperties(defaultFallback = "dept_Global_FallbackMethod") ����ע�⣬���󷽷���ʹ�� @HystrixCommand ע��
 */
public String dept_Global_FallbackMethod() {
    return "C���������������������г��������ϵͳ��æ�����Ժ����ԣ����ͻ���ȫ�ֻ��˷�������,��";
}

```





> **ע��**��������FallBack���������������Ӧ��ҵ�񷽷���ͬһ�����У������޷���Ч��

3\. �����е�ҵ�񷽷��϶���ע @HystrixCommand ע�⣬�������ǽ� deptInfo_Timeout() �����ϵ� @HystrixCommand(fallbackMethod = "dept_TimeoutHandler") �޸�Ϊ @HystrixCommand ���ɣ��������¡�





```


//�ڿͻ��˽��н���
@RequestMapping(value = "/consumer/dept/hystrix/timeout/{id}")
@HystrixCommand
public String deptInfo_Timeout(@PathVariable("id") Integer id) {
    String s = deptHystrixService.deptInfo_Timeout(id);
    log.info(s);
    return s;
}
```





> **ע��**��ȫ�ֽ������������ȼ��ϵͣ�ֻ��ҵ�񷽷�û��ָ���併������ʱ�����񽵼�ʱ�Żᴥ��ȫ�ֻ��˷�������ҵ�񷽷�ָ�����Լ��Ļ��˷�������ô�ڷ��񽵼�ʱ����ֻ��ֱ�Ӵ������Լ��Ļ��˷���������ȫ�ֻ��˷�����

4\. ���� micro-service-cloud-consumer-dept-feign��ʹ����������ʡ�http://eureka7001.com/consumer/dept/hystrix/timeout/1�����������ͼ��

![Hystrix ȫ�ֻ��˷���](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/101623J11-5.png)
ͼ6��ȫ�ֻ��˷���

## ������߼�

������ҵ�񷽷�ָ���Ľ�����������ȫ�ֽ������������Ƕ������ҵ�񷽷���ͬһ�����в�����Ч��ҵ���߼��뽵���߼���϶ȼ��ߡ�

�������Ƕ�ҵ���߼��뽵���߼����н�������������¡�

1\. �� micro-service-cloud-consumer-dept-feign �� net.biancheng.c.service ���£��½� DeptHystrixService �ӿڵ�ʵ���� DeptHystrixFallBackService��ͳһΪ DeptHystrixService �еķ����ṩ���񽵼����� ���������¡�





```

package net.biancheng.c.service;
import org.springframework.stereotype.Component;
/**
* Hystrix ���񽵼�
* ��������߼�
*/
@Component
public class DeptHystrixFallBackService implements DeptHystrixService {
    @Override
    public String deptInfo_Ok(Integer id) {
        return "--------------------C������������������ϵͳ��æ�����Ժ����ԣ���������˷���������-----------------------";
    }
    @Override
    public String deptInfo_Timeout(Integer id) {
        return "--------------------C������������������ϵͳ��æ�����Ժ����ԣ���������˷���������-----------------------";
    }
}

```





> **ע��**������������������ʽ��� Spring �����в�����Ч����õķ�ʽ���������ϱ�ע @Component ע�⡣

2\. �ڷ���󶨽ӿ� DeptHystrixService ��ע�� @FeignClient ע������� fallback ���ԣ�����ֵΪ DeptHystrixFallBackService.class���������¡�





```
package net.biancheng.c.service;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
@Component
@FeignClient(value = "MICROSERVICECLOUDPROVIDERDEPTHYSTRIX", fallback = DeptHystrixFallBackService.class)
public interface DeptHystrixService {
    @RequestMapping(value = "/dept/hystrix/ok/{id}")
    public String deptInfo_Ok(@PathVariable("id") Integer id);
    @RequestMapping(value = "/dept/hystrix/timeout/{id}")
    public String deptInfo_Timeout(@PathVariable("id") Integer id);
}

```





3\. ���� micro-service-cloud-consumer-dept-feign��Ȼ��رշ���� micro-service-cloud-provider-dept-hystrix-8004��ʹ����������ʡ�http://eureka7001.com/consumer/dept/hystrix/ok/1�����������ͼ��

![Hystrix ��������߼�](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1016233063-6.png)
ͼ7��Hystrix ������˷���

## Hystrix �����۶�

�۶ϻ�����Ϊ��Ӧ��ѩ��ЧӦ�����ֵ�һ��΢������·�������ơ�

��΢����ϵͳ�е�ĳ��΢���񲻿��û���Ӧʱ��̫��ʱ��Ϊ�˱���ϵͳ����������ԣ��۶�������ʱ�ж�����Ը÷���ĵ��ã������ٷ���һ���ѺõĴ�����Ӧ�������۶�״̬�������õģ��ھ�����һ����ʱ����۶������ٴμ���΢�����Ƿ�ָ�������������ָ�������ָ��������·��

#### �۶�״̬

���۶ϻ������漰�������۶�״̬��

*   �۶Ϲر�״̬��Closed�����������������ʱ���۶������ڹر�״̬��������÷����������ضԷ�����е��á�
*   �۶Ͽ���״̬��Open����Ĭ������£��ڹ̶�ʱ���ڽӿڵ��ó�����ʴﵽһ����ֵ������ 50%�����۶���������۶Ͽ���״̬�������۶�״̬�󣬺����Ը÷���ĵ��ö��ᱻ�жϣ��۶�����ִ�б��صĽ�����FallBack��������
*   ���۶�״̬��Half-Open���� ���۶Ͽ���һ��ʱ��֮���۶����������۶�״̬���ڰ��۶�״̬�£��۶����᳢�Իָ�������÷��Է���ĵ��ã�������������ø÷��񣬲��������óɹ��ʡ�����ɹ��ʴﵽԤ�ڣ���˵�������ѻָ��������۶�������ر�״̬������ɹ����Ծɺܵͣ������½����۶Ͽ���״̬��

�����۶�״̬֮���ת����ϵ����ͼ��

![�۶�״̬ת��](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/10162355X-7.png)
ͼ8�������۶�״̬ת��

#### Hystrix ʵ���۶ϻ���

�� Spring Cloud �У��۶ϻ�����ͨ�� Hystrix ʵ�ֵġ�Hystrix ����΢�������õ�״������ʧ�ܵ��õ�һ������ʱ������ 5 ����ʧ�� 20 �Σ����ͻ������۶ϻ��ơ�

Hystrix ʵ�ַ����۶ϵĲ������£�

1.  ������ĵ��ó����ʴﵽ�򳬹� Hystix �涨�ı��ʣ�Ĭ��Ϊ 50%�����۶��������۶Ͽ���״̬��
2.  �۶��������۶Ͽ���״̬��Hystrix ������һ������ʱ�䴰�������ʱ�䴰�ڣ��÷���Ľ����߼�����ʱ�䵱ҵ�����߼�����ԭ����ҵ�����߼������á�
3.  ���������ٴε��ø÷���ʱ����ֱ�ӵ��ý����߼����ٵط���ʧ����Ӧ���Ա���ϵͳѩ����
4.  ������ʱ�䴰���ں�Hystrix �������۶�ת̬������������Է���ԭ������ҵ���߼����е��ã����������óɹ��ʡ�
5.  ������óɹ��ʴﵽԤ�ڣ���˵�������ѻָ�������Hystrix �����۶Ϲر�״̬������ԭ������ҵ���߼��ָ������� Hystrix ���½����۶Ͽ���״̬������ʱ�䴰�����¼�ʱ�������ظ��� 2 ���� 5 ����

#### ʾ��

�������Ǿ�ͨ��һ��ʵ������֤�� Hystrix �����ʵ���۶ϻ��Ƶġ�

1\. �� micro-service-cloud-provider-dept-hystrix-8004 �е� DeptService �ӿ������һ�� deptCircuitBreaker() �������������¡�





```

package net.biancheng.c.service;
public interface DeptService {
    // hystrix �۶���ʾ�� ok
    public String deptInfo_Ok(Integer id);
   
    //hystrix �۶�����ʱ����
    public String deptInfo_Timeout(Integer id);
    // Hystrix �۶ϻ��ư���
    public String deptCircuitBreaker(Integer id);
}

```





2\. �� DeptService �ӿڵ�ʵ���� DeptServiceImpl ��� deptCircuitBreaker() �ķ���ʵ�ּ�����˷������������¡�





```
//Hystrix �۶ϰ���
@Override
@HystrixCommand(fallbackMethod = "deptCircuitBreaker_fallback", commandProperties = {
        //���²����� HystrixCommandProperties ������Ĭ������
        @HystrixProperty(name = "circuitBreaker.enabled", value = "true"), //�Ƿ����۶���
    @HystrixProperty(name = "metrics.rollingStats.timeInMilliseconds",value = "1000"), //ͳ��ʱ�䴰
        @HystrixProperty(name = "circuitBreaker.requestVolumeThreshold", value = "10"), //ͳ��ʱ�䴰���������
        @HystrixProperty(name = "circuitBreaker.sleepWindowInMilliseconds", value = "10000"), //����ʱ�䴰����
        @HystrixProperty(name = "circuitBreaker.errorThresholdPercentage", value = "60"), //��ͳ��ʱ�䴰�������ڣ�����ʧ���ʴﵽ 60% ʱ�����۶�״̬
})
public String deptCircuitBreaker(Integer id) {
    if (id < 0) {
        //������� id Ϊ����ʱ���׳��쳣�����ý�������
        throw new RuntimeException("c������������������id �����Ǹ�����");
    }
    String serialNum = IdUtil.simpleUUID();
    return Thread.currentThread().getName() + "\t" + "���óɹ�����ˮ��Ϊ��" + serialNum;
}

//deptCircuitBreaker �Ľ�������
public String deptCircuitBreaker_fallback(Integer id) {
    return "c������������������id �����Ǹ���,���Ժ�����!\t id:" + id;
}

```





�����ϴ����У����漰���� 4 ���� Hystrix �۶ϻ�����ص���Ҫ�������� 4 �������ĺ������±�

| ����                                     | ����                                                         |
| ---------------------------------------- | ------------------------------------------------------------ |
| metrics.rollingStats.timeInMilliseconds  | ͳ��ʱ�䴰��                                                 |
| circuitBreaker.sleepWindowInMilliseconds | ����ʱ�䴰���۶Ͽ���״̬����һ��ʱ����۶������Զ�������۶�״̬�����ʱ��ͱ���Ϊ���ߴ����ڡ� |
| circuitBreaker.requestVolumeThreshold    | ����������ֵ����ͳ��ʱ�䴰�ڣ������������뵽��һ������������Hystrix �ſ��ܻὫ�۶����򿪽����۶Ͽ���ת̬��������������������� ����������ֵ��Hystrix ����������ֵĬ��Ϊ 20�������ζ����ͳ��ʱ�䴰�ڣ����������ô������� 20 �Σ���ʹ���е����󶼵��ó����۶���Ҳ����򿪡� |
| circuitBreaker.errorThresholdPercentage  | ����ٷֱ���ֵ��������������ͳ��ʱ�䴰�ڳ���������������ֵ����������ó����ʳ���һ���ı������۶����Ż�򿪽����۶Ͽ���ת̬��������������Ǵ���ٷֱ���ֵ������ٷֱ���ֵ����Ϊ 50���ͱ�ʾ����ٷֱ�Ϊ 50%������������� 30 �ε��ã������� 15 �η����˴��󣬼������� 50% �Ĵ���ٷֱȣ���ʱ���۶����ͻ�򿪡� |

3\. �� DeptController �����һ�� deptCircuitBreaker() ���������ṩ���񣬴������¡�





```

// Hystrix �����۶�
@RequestMapping(value = "/dept/hystrix/circuit/{id}")
public String deptCircuitBreaker(@PathVariable("id") Integer id){
    String result = deptService.deptCircuitBreaker(id);
    log.info("result:"+result);
    return result;
}

```





4\. ���� micro-service-cloud-provider-dept-hystrix-8004��ʹ����������ʡ�http://eureka7001.com:8004/dept/hystrix/circuit/1�����������ͼ��

![Hystrix ʵ���۶ϻ��� ������ȷ](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1016233Q8-8.png)
ͼ9��Hystrix ʵ���۶ϻ��� ������ȷʾ��

5\. �������Σ����ô�����������������ֵ�����ʡ�http://eureka7001.com:8004/dept/hystrix/circuit/-2����ʹ���ó����ʴ��ڴ���ٷֱȷ�ֵ�������ͼ��

![Hystrix ʵ���۶ϻ��� �������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/10162332D-9.png)
ͼ10��Hystrix ʵ���۶ϻ��� �������

6\. ���½������޸�Ϊ�������������Ϊ 3����ʹ����������ʡ�http://eureka7001.com:8004/dept/hystrix/circuit/3�����������ͼ��

![Hystrix �۶Ͽ���ת̨](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1016235592-10.png)
ͼ11��Hystrix �۶Ͽ���״̬��������

ͨ��ͼ 11 ���Կ��������۶Ͽ���״̬�£���ʹ���Ǵ���Ĳ����Ѿ������������õ���Ȼ�����߼���

7\. �����������ʡ�http://eureka7001.com:8004/dept/hystrix/circuit/3���������ͼ��

![Hystrix �۶Ϲر�](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1016231R0-11.gif)
ͼ12��Hystrix �����۶Ϲر�״̬

ͨ��ͼ 12 ���Կ����������������ȷ��������һ�������ʺ�Hystrix �����۶Ϲر�״̬��

## Hystrix ���ϼ��

Hystrix ���ṩ��׼ʵʱ�ĵ��ü�أ�Hystrix Dashboard�����ܣ�Hystrix ������ؼ�¼����ͨ�� Hystrix ����������ִ����Ϣ������ͳ�Ʊ������ʽչʾ���û�������ÿ��ִ��������������ɹ������������ʧ������������ȡ�

�������Ǿ�ͨ��һ��ʵ����� Hystrix Dashboard����� micro-service-cloud-provider-dept-hystrix-8004 �����������

1\. �ڸ��������½�һ����Ϊ micro-service-cloud-consumer-dept-hystrix-dashboard-9002 ����ģ�飬������ pom.xml ���������������





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
    <artifactId>micro-service-cloud-consumer-dept-hystrix-dashboard-9002</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>micro-service-cloud-consumer-dept-hystrix-dashboard-9002</name>
    <description>Demo project for Spring Boot</description>
    <properties>
        <java.version>1.8</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>
        <!--Spring Boot ��������-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <!--hystrix-dashboard ��ص�����-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-hystrix-dashboard</artifactId>
        </dependency>
        <!--��� Spring Boot �ļ��ģ��-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
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





2\. �� micro-service-cloud-consumer-dept-hystrix-dashboard-9002 �� application.yml ������������á�





```

server:
  port: 9002  #�˿ں�

#http://eureka7001.com:9002/hystrix �۶������ҳ��
# localhost:8004//actuator/hystrix.stream ��ص�ַ
hystrix:
  dashboard:
    proxy-stream-allow-list:
      - "localhost"

```





3\. �� micro-service-cloud-consumer-dept-hystrix-dashboard-9002 ��������������� @EnableHystrixDashboard ע�⣬���� Hystrix ��ع��ܣ��������¡�





```

package net.biancheng.c;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.hystrix.dashboard.EnableHystrixDashboard;

@SpringBootApplication
@EnableHystrixDashboard
public class MicroServiceCloudConsumerDeptHystrixDashboard9002Application {

    public static void main(String[] args) {
        SpringApplication.run(MicroServiceCloudConsumerDeptHystrixDashboard9002Application.class, args);
    }

}

```





4\. �� micro-service-cloud-provider-dept-hystrix-8004 �� net.biancheng.c.config ���£�����һ����Ϊ HystrixDashboardConfig �������࣬�������¡�





```

package net.biancheng.c.config;

import com.netflix.hystrix.contrib.metrics.eventstream.HystrixMetricsStreamServlet;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class HystrixDashboardConfig {
    /**
     *  Hystrix dashboard ��ؽ����������
     * @return
     */
    @Bean
    public ServletRegistrationBean getServlet() {
        HystrixMetricsStreamServlet streamServlet = new HystrixMetricsStreamServlet();
        ServletRegistrationBean registrationBean = new ServletRegistrationBean(streamServlet);
        registrationBean.setLoadOnStartup(1);
        registrationBean.addUrlMappings("/actuator/hystrix.stream");//����·��
        registrationBean.setName("hystrix.stream");
        return registrationBean;
    }

}

```





5\. ���� micro-service-cloud-consumer-dept-hystrix-dashboard-9002��ʹ����������ʡ�http://eureka7001.com:9002/hystrix�����������ͼ��

![Hystrix ���](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1016234440-12.png)
ͼ13��Hystrix ���ҳ��

6\. ���� micro-service-cloud-provider-dept-hystrix-8004������������Ϣ� Hystrix ���ҳ���У�����ͼ��

![Hystrix �����Ϣ](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1016232636-13.png)
ͼ14��Hystrix �����Ϣ

7\. ����·��� Monitor Stream ��ť����ת�� Hystrix �� micro-service-cloud-provider-dept-hystrix-8004 �ļ��ҳ�棬����ͼ��

![Hystrix ��� 8004](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1016231229-14.png)
ͼ15��Hystrix ���΢�����������

8\. ʹ���������η��ʡ�http://eureka7001.com:8004/dept/hystrix/circuit/1���� ��http://eureka7001.com:8004/dept/hystrix/circuit/-1�����鿴 Hystrix ���ҳ�棬����ͼ��

![Hystrix ��� 8004 �������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/10162345J-15.png)
ͼ16��Hystrix ��ط����������

# �ο�����
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud
https://github.com/macrozheng/springcloud-learning