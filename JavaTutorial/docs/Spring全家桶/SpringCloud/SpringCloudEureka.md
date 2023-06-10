Eureka һ����Դ�ڹ�ϣ���ʻ㣬�ǡ������ˡ�����˼�����������Eureka �� Netflix ��˾������һ�Դ�ķ���ע���뷢�������

Spring Cloud �� Eureka �� Netflix �е�������Դ������������� Ribbon��Feign �Լ� Hystrix �ȣ�һ�����Ͻ� Spring Cloud Netflix ģ���У����Ϻ�����ȫ��Ϊ Spring Cloud Netflix Eureka��

Eureka �� Spring Cloud Netflix ģ�����ģ�飬���� Spring Cloud �� Netflix Eureka �Ķ��η�װ����Ҫ���� Spring Cloud �ķ���ע���뷢�ֹ��ܡ�

Spring Cloud ʹ�� Spring Boot ˼��Ϊ Eureka �������Զ������ã�������Աֻ��Ҫ�������������ע�⣬���ܽ� Spring Boot ������΢�������ɵ��� Eureka �������ϡ�

## Eureka �������

Eureka ���� CS��Client/Server���ͻ���/�������� �ܹ����������������������

*   **Eureka Server**��Eureka ����ע�����ģ���Ҫ�����ṩ����ע�Ṧ�ܡ���΢��������ʱ���Ὣ�Լ��ķ���ע�ᵽ Eureka Server��Eureka Server ά����һ�����÷����б��洢������ע�ᵽ Eureka Server �Ŀ��÷������Ϣ����Щ���÷�������� Eureka Server �Ĺ��������ֱ�ۿ�����
*   **Eureka Client**��Eureka �ͻ��ˣ�ͨ��ָ����΢����ϵͳ�и���΢������Ҫ���ں� Eureka Server ���н�������΢����Ӧ��������Eureka Client ���� Eureka Server ����������Ĭ������Ϊ 30 �룩���� Eureka Server �ڶ������������û�н��յ�ĳ�� Eureka Client ��������Eureka Server �����ӿ��÷����б����Ƴ���Ĭ�� 90 �룩��

> ע����������ָ����һ�ζ�ʱ���͵��Զ�����Ϣ���öԷ�֪���Լ���������ȷ�����ӵ���Ч�ԡ��󲿷� CS �ܹ���Ӧ�ó��򶼲������������ƣ�����˺Ϳͻ��˶����Է�������ͨ��������ǿͻ�����������˷���������������������жϿͻ����Ƿ����ߡ�

## Eureka ����ע���뷢��

Eureka ʵ�ַ���ע���뷢�ֵ�ԭ������ͼ��ʾ��

![Eureka ����ע���뷢��](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1010305209-0.png)
ͼ1��Eureka ԭ��ͼ

��ͼ�й��漰������ 3 ����ɫ��

*   **����ע�����ģ�Register Service��**������һ�� Eureka Server�������ṩ����ע��ͷ��ֹ��ܡ�
*   **�����ṩ�ߣ�Provider Service��**������һ�� Eureka Client�������ṩ���������Լ��ṩ�ķ���ע�ᵽ����ע�����ģ��Թ����������߷��֡�
*   **���������ߣ�Consumer Service��**������һ�� Eureka Client���������ѷ��������Դӷ���ע�����Ļ�ȡ�����б���������ķ���

Eureka ʵ�ַ���ע���뷢�ֵ��������£�

1.  �һ�� Eureka Server ��Ϊ����ע�����ģ�
2.  �����ṩ�� Eureka Client ����ʱ����ѵ�ǰ����������Ϣ�Է�������spring.application.name���ķ�ʽע�ᵽ����ע�����ģ�
3.  ���������� Eureka Client ����ʱ��Ҳ�������ע������ע�᣻
4.  ���������߻����ȡһ�ݿ��÷����б����б��а���������ע�ᵽ����ע�����ĵķ�����Ϣ�����������ṩ�ߺ��������Ϣ����
5.  �ڻ���˿��÷����б�󣬷���������ͨ�� HTTP ����Ϣ�м��Զ�̵��÷����ṩ���ṩ�ķ���

����ע�����ģ�Eureka Server�������ݵĽ�ɫʮ����Ҫ�����Ƿ����ṩ�ߺͷ���������֮��������������ṩ��ֻ�н��Լ��ķ���ע�ᵽ����ע�����Ĳſ��ܱ����������ߵ��ã�������������Ҳֻ��ͨ������ע�����Ļ�ȡ���÷����б�󣬲��ܵ�������ķ���

## ʾ�� 1

���棬����ͨ��һ��������չʾ�� Eureka �����ʵ�ַ���ע���뷢�ֵġ�

#### 1\. ���������̣�Maven Project��

���ڱ������У����漰������� Spring Boot ������΢����Ϊ�˷�������������ǲ��� Maven �Ķ� Module �ṹ����һ�� Project ������� Module�����������̡�

����һ����Ϊ spring-cloud-demo2 �� Maven ������ ��Ȼ���ڸ������̵� pom.xml ��ʹ�� dependencyManagement ������ Spring Cloud �İ汾���������¡�





```

<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <packaging>pom</packaging>
    <modules>
        <module>micro-service-cloud-api</module>
    </modules>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.3.6.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>net.biancheng.c</groupId>
    <artifactId>spring-cloud-demo2</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <junit.version>4.12</junit.version>
        <log4j.version>1.2.17</log4j.version>
        <lombok.version>1.16.18</lombok.version>
    </properties>
    <dependencyManagement>
        <dependencies>
            <!--����������ʹ�� dependencyManagement ���� Spring Cloud �İ汾��
            ���������ڵ� Module ������ Spring Cloud �������ʱ���Ͳ�������������İ汾��Ϣ
            ��֤ Spring Cloud �������һ����-->
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>Hoxton.SR12</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
    <build>
        <finalName>microservicecloud</finalName>
        <resources>
            <resource>
                <directory>src/main/resources</directory>
                <filtering>true</filtering>
            </resource>
        </resources>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-resources-plugin</artifactId>
                <configuration>
                    <delimiters>
                        <delimit>$</delimit>
                    </delimiters>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>

```





#### 2\. ����������ģ�飨Maven Module��

1) ���������£�����һ����Ϊ micro-service-cloud-api �� Maven Module��micro-service-cloud-api���� pom.xml �������¡�





```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>spring-cloud-demo2</artifactId>
        <groupId>net.biancheng.c</groupId>
        <version>0.0.1-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>
    <artifactId>micro-service-cloud-api</artifactId>
    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>
    </dependencies>
</project>

```





> ע��micro-service-cloud-api ���������̵Ĺ�����ģ�飬��������һЩ������ģ�鹲�е����ݣ�����ʵ���ࡢ���������ࡢ����������ȡ���������ģ����Ҫʹ�ù�����ģ���е�����ʱ��ֻ��Ҫ���� pom.xml ���빫����ģ����������ɡ�

2) �� micro-service-cloud-api �� net.biancheng.c.entity ���£�����һ����Ϊ Dept ��ʵ���࣬�������¡�





```

package net.biancheng.c.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.io.Serializable;

@NoArgsConstructor //�޲ι��캯��
@Data // �ṩ���get��set��equals��hashCode��canEqual��toString ����
@Accessors(chain = true)
public class Dept implements Serializable {
    private Integer deptNo;
    private String deptName;
    private String dbSource;
}

```





#### 3\. �����ע������

1) ���������´���һ����Ϊ micro-service-cloud-eureka-7001 �� Spring Boot Module ��Ϊ����ע�����ģ������� pom.xml ����������������





```

<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <!--�̳������̵� POM-->
    <parent>
        <artifactId>spring-cloud-demo2</artifactId>
        <groupId>net.biancheng.c</groupId>
        <version>0.0.1-SNAPSHOT</version>
    </parent>
    <groupId>net.biancheng.c</groupId>
    <artifactId>micro-service-cloud-eureka-7001</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>micro-service-cloud-eureka-7001</name>
    <description>Demo project for Spring Boot</description>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!--Ϊ����ע���������� Eureka Server ������-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
        </dependency>
        <!--devtools �� lombok ��Ϊ��������ģ�飬���������ʵ�ѡ��-->
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





2) �� micro-service-cloud-eureka-7001 ����·����/resouces Ŀ¼���£����һ�������ļ� application.yml�������������¡�





```
server:
  port: 7001  #�� Module �Ķ˿ں�

eureka:
  instance:
    hostname: localhost #eureka����˵�ʵ�����ƣ�

  client:
    register-with-eureka: false #false��ʾ����ע������ע���Լ���
    fetch-registry: false #false��ʾ�Լ��˾���ע�����ģ��ҵ�ְ�����ά������ʵ����������Ҫȥ��������
    service-url:
      defaultZone: http://${eureka.instance.hostname}:${server.port}/eureka/ #���������ע������
```





3) �� micro-service-cloud-eureka-7001 ������������ʹ�� @EnableEurekaServer ע�⿪������ע�����Ĺ��ܣ��������������ע�ᣬ�������¡�





```

package net.biancheng.c;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
@SpringBootApplication
@EnableEurekaServer //���� Eureka server,��������΢�����ע��
public class MicroServiceCloudEureka7001Application {
    public static void main(String[] args) {
        SpringApplication.run(MicroServiceCloudEureka7001Application.class, args);
    }
}

```





4) ���� micro-service-cloud-eureka-7001��ʹ����������� Eureka ����ע��������ҳ����ַΪ��http://localhost:7001/�����������ͼ��

![Eureka Server 7001 ����ע������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1010306360-1.png)

ͼ2��Eureka 7001 ����ע������

#### 4\. ������ṩ��

1) ���������´���һ����Ϊ micro-service-cloud-provider-dept-8001 �� Spring Boot Module�������� pom.xml ����������������





```

<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <!--���븸����pom-->
    <parent>
        <artifactId>spring-cloud-demo2</artifactId>
        <groupId>net.biancheng.c</groupId>
        <version>0.0.1-SNAPSHOT</version>
    </parent>

    <groupId>net.biancheng.c</groupId>
    <artifactId>micro-service-cloud-provider-dept-8001</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>micro-service-cloud-provider-dept-8001</name>
    <description>Demo project for Spring Boot</description>

    <properties>
        <java.version>1.8</java.version>
    </properties>
    <dependencies>
        <!--Spring Boot Web-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!--devtools ��������-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <!--Spring Boot ����-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <!--���빫����ģ��-->
        <dependency>
            <groupId>net.biancheng.c</groupId>
            <artifactId>micro-service-cloud-api</artifactId>
            <version>${project.version}</version>
        </dependency>
        <!--junit ����-->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
        </dependency>
        <!--mysql ����-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.49</version>
        </dependency>
        <!--logback ��־-->
        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-core</artifactId>
        </dependency>
        <!--���� mybatis -->
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>2.2.0</version>
        </dependency>
        <!-- �޸ĺ�������Ч���Ȳ��� -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>springloaded</artifactId>
            <version>1.2.8.RELEASE</version>
        </dependency>
        <!--���� Eureka Client ��������������ע�ᵽ Eureka Server-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        <!-- Spring Boot ���ģ��-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!--mybatis�Զ����ɴ�����-->
            <plugin>
                <groupId>org.mybatis.generator</groupId>
                <artifactId>mybatis-generator-maven-plugin</artifactId>
                <version>1.4.0</version>
                <configuration>
                    <configurationFile>src/main/resources/mybatis-generator/generatorConfig.xml</configurationFile>
                    <verbose>true</verbose>
                    <!-- �Ƿ񸲸ǣ�true��ʾ���滻���ɵ�JAVA�ļ���false�򲻸��� -->
                    <overwrite>true</overwrite>
                </configuration>
                <dependencies>
                    <!--mysql������-->
                    <dependency>
                        <groupId>mysql</groupId>
                        <artifactId>mysql-connector-java</artifactId>
                        <version>5.1.49</version>
                    </dependency>
                    <dependency>
                        <groupId>org.mybatis.generator</groupId>
                        <artifactId>mybatis-generator-core</artifactId>
                        <version>1.4.0</version>
                    </dependency>
                </dependencies>
            </plugin>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>

```





2) �� micro-service-cloud-provider-dept-8001 ��·����/resources Ŀ¼���£���������ļ� application.yml�������������¡�





```

server:
  port: 8001 #����˿ں�
spring:
  application:
    name: microServiceCloudProviderDept  #΢�������ƣ����Ⱪ©��΢�������ƣ�ʮ����Ҫ
################################################## JDBC ͨ������  ##########################################
  datasource:
    username: root        #���ݿ��½�û���
    password: root        #���ݿ��½����
    url: jdbc:mysql://127.0.0.1:3306/bianchengbang_jdbc       #���ݿ�url
    driver-class-name: com.mysql.jdbc.Driver                  #���ݿ�����

############################### ����� spring.config.import=configserver:##################
#  cloud:
#    config:
#      enabled: false
###################################### MyBatis ���� ######################################
mybatis:
  # ָ�� mapper.xml ��λ��
  mapper-locations: classpath:mybatis/mapper/*.xml
  #ɨ��ʵ�����λ��,�ڴ˴�ָ��ɨ��ʵ����İ����� mapper.xml �оͿ��Բ�дʵ�����ȫ·����
  type-aliases-package: net.biancheng.c.entity
  configuration:
    #Ĭ�Ͽ����շ������������Բ������ø�����
    map-underscore-to-camel-case: true
########################################### Spring cloud �Զ���������ƺ� ip ��ַ###############################################
eureka:
  client: #���ͻ���ע�ᵽ eureka �����б���
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka  #�����ַ�� 7001ע�������� application.yml �б�¶������ע���ַ �������棩

  instance:
    instance-id: spring-cloud-provider-8001 #�Զ������������Ϣ
    prefer-ip-address: true  #��ʾ����·���� ip ��ַ
########################################## spring cloud ʹ�� Spring Boot actuator ���������Ϣ###################################
# Spring Boot 2.50�� actuator ��������˴�����Ľڵ㣬ֻ��¶�� heath �ڵ㣬�������ã�*������Ϊ�˿������еĽڵ�
management:
  endpoints:
    web:
      exposure:
        include: "*"   # * ��yaml �ļ����ڹؼ��֣�������Ҫ������
info:
  app.name: micro-service-cloud-provider-dept
  company.name: c.biancheng.net
  build.aetifactId: @project.artifactId@
  build.version: @project.version@
```





3) �� net.biancheng.c.mapper ���´���һ����Ϊ DeptMapper �Ľӿڣ��������¡�





```

package net.biancheng.c.mapper;
import net.biancheng.c.entity.Dept;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;
@Mapper
public interface DeptMapper {
    //����������ȡ����
    Dept selectByPrimaryKey(Integer deptNo);
    //��ȡ���е�ȫ������
    List<Dept> GetAll();
}

```





4) �� resources/mybatis/mapper/ Ŀ¼�£�����һ����Ϊ DeptMapper.xml �� MyBatis ӳ���ļ��������������¡�





```

<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="net.biancheng.c.mapper.DeptMapper">
    <resultMap id="BaseResultMap" type="net.biancheng.c.entity.Dept">
        <id column="dept_no" jdbcType="INTEGER" property="deptNo"/>
        <result column="dept_name" jdbcType="VARCHAR" property="deptName"/>
        <result column="db_source" jdbcType="VARCHAR" property="dbSource"/>
    </resultMap>

    <sql id="Base_Column_List">
        dept_no
        , dept_name, db_source
    </sql>

    <select id="selectByPrimaryKey" parameterType="java.lang.Integer" resultMap="BaseResultMap">
        select
        <include refid="Base_Column_List"/>
        from dept
        where dept_no = #{deptNo,jdbcType=INTEGER}
    </select>
    <select id="GetAll" resultType="net.biancheng.c.entity.Dept">
        select *
        from dept;
    </select>
</mapper>

```





5) �� net.biancheng.c.service ���´���һ����Ϊ DeptService �Ľӿڣ��������¡�





```


package net.biancheng.c.service;
import net.biancheng.c.entity.Dept;
import java.util.List;
public interface DeptService {
    Dept get(Integer deptNo);
    List<Dept> selectAll();
}

```





6) �� net.biancheng.c.service.impl ���´��� DeptService �ӿڵ�ʵ���� DeptServiceImpl���������¡�





```
package net.biancheng.c.service.impl;

import net.biancheng.c.entity.Dept;
import net.biancheng.c.mapper.DeptMapper;
import net.biancheng.c.service.DeptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("deptService")
public class DeptServiceImpl implements DeptService {
    @Autowired
    private DeptMapper deptMapper;

    @Override
    public Dept get(Integer deptNo) {
        return deptMapper.selectByPrimaryKey(deptNo);
    }

    @Override
    public List<Dept> selectAll() {
        return deptMapper.GetAll();
    }
}

```





7) �� net.biancheng.c.controller ���´���һ����Ϊ DeptController �� Controller �࣬�������¡�





```

package net.biancheng.c.controller;

import lombok.extern.slf4j.Slf4j;
import net.biancheng.c.entity.Dept;
import net.biancheng.c.service.DeptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
* �����ṩ�ߵĿ��Ʋ�
* author:c���������� c.biancheng.net
*/
@RestController
@Slf4j
public class DeptController {
    @Autowired
    private DeptService deptService;
  
    @Value("${server.port}")
    private String serverPort;

    @RequestMapping(value = "/dept/get/{id}", method = RequestMethod.GET)
    public Dept get(@PathVariable("id") int id) {
        return deptService.get(id);
    }

    @RequestMapping(value = "/dept/list", method = RequestMethod.GET)
    public List<Dept> list() {
        return deptService.selectAll();
    }
}
```





8) �� micro-service-cloud-provider-dept-8001 �����������ϣ�ʹ�� @EnableEurekaClient ע�⿪�� Eureka �ͻ��˹��ܣ�������ע�ᵽ����ע�����ģ�Eureka Server�����������¡�





```


package net.biancheng.c;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient // Spring cloud Eureka �ͻ��ˣ��Զ���������ע�ᵽ Eureka Server ע��������
public class MicroServiceCloudProviderDept8001Application {

    public static void main(String[] args) {
        SpringApplication.run(MicroServiceCloudProviderDept8001Application.class, args);
    }
}

```





9) �������� micro-service-cloud-eureka-7001 �� micro-service-cloud-provider-dept-8001��ʹ����������ٴ��� Eureka ����ע��������ҳ��http://localhost:7001/��������ͼ��

![Eureka Client ע�ᵽ����ע������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1010304436-2.png)
ͼ3�������ṩ��ע�ᵽ����ע������

��ͼ 3 ���Կ����� Instances currently registered with Eureka ��ע�ᵽ Eureka Server ��ʵ����ѡ�����Ѿ�������һ��������Ϣ�����Ѿ��з���ע�ᵽ Eureka Server ���ˡ�

Instances currently registered with Eureka ѡ���а����������ݣ�

*   Application��MICROSERVICECLOUDPROVIDERDEPT����ȡֵΪ micro-service-cloud-provider-dept-8001 �����ļ� application.yml �� spring.application.name ��ȡֵ��
*   Status�� UP (1) - spring-cloud-provider-8001��UP ��ʾ�������ߣ� (1) ��ʾ�м�Ⱥ�з����������spring-cloud-provider-8001 ���� micro-service-cloud-provider-dept-8001 �����ļ� application.yml �� eureka.instance.instance-id ��ȡֵ��

10) �� MySQL �� bianchengbang_jdbc ���ݿ���ִ������ SQL��׼���������ݡ�

```
DROP TABLE IF EXISTS `dept`;
CREATE TABLE `dept` (
  `dept_no` int NOT NULL AUTO_INCREMENT,
  `dept_name` varchar(255) DEFAULT NULL,
  `db_source` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`dept_no`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO `dept` VALUES ('1', '������', 'bianchengbang_jdbc');
INSERT INTO `dept` VALUES ('2', '���²�', 'bianchengbang_jdbc');
INSERT INTO `dept` VALUES ('3', '����', 'bianchengbang_jdbc');
INSERT INTO `dept` VALUES ('4', '�г���', 'bianchengbang_jdbc');
INSERT INTO `dept` VALUES ('5', '��ά��', 'bianchengbang_jdbc');
```

11) ʹ����������ʡ�http://localhost:8001/dept/list�����������ͼ��

![Eureka Client 8001 �������ݿ�](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1010301b2-3.png)
ͼ4�������ṩ���ṩ����������ݿ�

## Eureka Server ��Ⱥ

��΢����ܹ��У�һ��ϵͳ������ʮ��������ʮ��������ɣ�������Щ����ȫ��ע�ᵽͬһ�� Eureka Server �У��ͼ��п��ܵ��� Eureka Server �򲻿��ظ������������յ�������ϵͳ̱����������������ֱ�ӵİ취���ǲ��� Eureka Server ��Ⱥ��

����֪������ Eureka ʵ�ַ���ע���뷢��ʱһ���漰�� 3 ����ɫ������ע�����ġ������ṩ���Լ����������ߣ���������ɫ�ֹ���ȷ����˾��ְ��������ʵ�� Eureka �У����з��񶼼��Ƿ���������Ҳ�Ƿ����ṩ�ߣ�����ע������ Eureka Server Ҳ�����⡣

�����ڴ����ע������ʱ���� application.yml ���漰�����������ã�





```


eureka:
  client:
    register-with-eureka: false  #false ��ʾ����ע������ע���Լ���
    fetch-registry: false  #false��ʾ�Լ��˾���ע�����ģ�ְ�����ά������ʵ����������Ҫȥ��������
```





�������õ�ԭ���� micro-service-cloud-eureka-7001 �����Լ����Ƿ���ע�����ģ�����ע�������ǲ��ܽ��Լ�ע�ᵽ�Լ����ϵģ�������ע�������ǿ��Խ��Լ���Ϊ�����������ķ���ע������ע���Լ��ġ�

�ٸ����ӣ������� Eureka Server �ֱ�Ϊ A �� B����Ȼ A ���ܽ��Լ�ע�ᵽ A �ϣ�B Ҳ���ܽ��Լ�ע�ᵽ B �ϣ��� A �ǿ�����Ϊһ��������Լ�ע�ᵽ B �ϵģ�ͬ�� B Ҳ���Խ��Լ�ע�ᵽ A �ϡ�

�����Ϳ����γ�һ�黥��ע��� Eureka Server ��Ⱥ���������ṩ�߷���ע������ Eureka Server ʱ��Eureka Server �Ὣ����ת������Ⱥ��������֮������ Eureka Server �ϣ���ʵ�� Eureka Server ֮��ķ���ͬ����

ͨ������ͬ�������������߿����ڼ�Ⱥ�е�����һ̨ Eureka Server �ϻ�ȡ�����ṩ���ṩ�ķ�����������ʹ��Ⱥ�е�ĳ������ע�����ķ������ϣ�������������Ȼ���ԴӼ�Ⱥ�е����� Eureka Server �л�ȡ������Ϣ�����ã������ᵼ��ϵͳ������̱��������� Eureka Server ��Ⱥ�ĸ߿����ԡ�

## ʾ�� 2

����������ʾ�� 1 �Ļ����Ͻ�����չ������һ��ӵ�� 3 �� Eureka Server ʵ���ļ�Ⱥ��

1\. ���� micro-service-cloud-eureka-7001 �Ĵ���̣����������������ٴ������� Eureka Server��micro-service-cloud-eureka-7002 �� micro-service-cloud-eureka-7003����ʱ�� 3 �� Eureka Server ������ Maven ���������뻹�����ö���һģһ���ġ�

2\. �޸� micro-service-cloud-eureka-7001��micro-service-cloud-eureka-7002��micro-service-cloud-eureka-7003 �� application.yml �����ã������������� ��

micro-service-cloud-eureka-7001 �� application.yml ���������¡�





```
server:
  port: 7001  #�˿ں�
eureka:
  instance:
    hostname: eureka7001.com #eureka����˵�ʵ������
  client:
    register-with-eureka: false #false ��ʾ����ע������ע���Լ���
    fetch-registry: false #false ��ʾ�Լ��˾���ע�����ģ��ҵ�ְ�����ά������ʵ����������Ҫȥ��������
    service-url:
      #defaultZone: http://${eureka.instance.hostname}:${server.port}/eureka/ #������
      defaultZone: http://eureka7002.com:7002/eureka/,http://eureka7003.com:7003/eureka/ #��Ⱥ�� ����ǰ�� Eureka Server ע�ᵽ 7003 �� 7003 �ϣ��γ�һ�黥��ע��� Eureka Server ��Ⱥ
```





micro-service-cloud-eureka-7002 �� application.yml ���������¡�





```

server:
  port: 7002 #�˿ں�

eureka:
  instance:
    hostname: eureka7002.com #Eureka Server ʵ������

  client:
    register-with-eureka: false #false ��ʾ����ע������ע���Լ���
    fetch-registry: false  #false ��ʾ�Լ��˾���ע�����ģ��ҵ�ְ�����ά������ʵ����������Ҫȥ��������
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka/,http://eureka7003.com:7003/eureka/ #����� Eureka Server ע�ᵽ 7001 �� 7003 ��
```





micro-service-cloud-eureka-7003 �� application.yml ���������¡�





```

server:
  port: 7003 #�˿ں�

eureka:
  instance:
    hostname: eureka7003.com #Eureka Server ʵ������

  client:
    register-with-eureka: false #false ��ʾ����ע������ע���Լ���
    fetch-registry: false  #false ��ʾ�Լ��˾���ע�����ģ��ҵ�ְ�����ά������ʵ����������Ҫȥ��������
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka/,http://eureka7002.com:7002/eureka/ #����� Eureka Server ע�ᵽ 7001 �� 7002 ��
```





3\. �����������ڱ��ش�� Eureka Server ��Ⱥ�����������Ҫ�޸ı��ص� host �ļ���Windows ����ϵͳ�ĵ����� C:/Windows/System/drivers/etc/hosts ���޸ģ�Mac ϵͳ�ĵ�������Ҫ�� vim/etc/hosts ���޸ģ��޸��������¡�

```
#Spring Cloud eureka ��Ⱥ
127.0.0.1 eureka7001.com
127.0.0.1 eureka7002.com
127.0.0.1 eureka7003.com
```


4\. �޸� micro-service-cloud-provider-dept-8001�������ṩ�ߣ������ļ� application.yml �� eureka.client.service-url.defaultZone ��ȡֵ��������ע�ᵽ Eureka Server ��Ⱥ�ϣ������������¡�





```

eureka:
  client: #���ͻ���ע�ᵽ eureka �����б���
    service-url:
      #defaultZone: http://eureka7001.com:7001/eureka  #�����ַ�� 7001 ע�������� application.yml �б�¶������ע���ַ �������棩
      defaultZone: http://eureka7001.com:7001/eureka/,http://eureka7002.com:7002/eureka/,http://eureka7003.com:7003/eureka/  #������ע�ᵽ Eureka Server ��Ⱥ
```





5\. ���� micro-service-cloud-eureka-7001��ʹ����������ʡ�http://eureka7001.com:7001/�����������ͼ��

![Eureka ��Ⱥ 7001](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1010302b3-4.png)

ͼ5��Eureka Server ��Ⱥ -7001

����ͼ���Կ����� �����ṩ�ߣ�micro-service-cloud-provider-dept-8001���ķ����Ѿ�ע�ᵽ�� Eureka Server 7001�������� DS Replicas ѡ����Ҳ��ʾ�˼�Ⱥ�е��������� Eureka Server��Eureka Server 7002 �� Eureka Server 7003��

6\. ���� micro-service-cloud-eureka-7002��ʹ����������ʡ�http://eureka7002.com:7002/�����������ͼ��

![Eureka ��Ⱥ 7002](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/101030E36-5.png)
ͼ6��Eureka Server ��Ⱥ -7002


����ͼ���Կ����� �����ṩ�ߣ�micro-service-cloud-provider-dept-8001�����ṩ�ķ����Ѿ�ע�ᵽ�� Eureka Server 7002�������� DS Replicas ѡ����Ҳ��ʾ�˼�Ⱥ�е��������� Eureka Server��Eureka Server 7001 �� Eureka Server 7003��

7. ���� micro-service-cloud-eureka-7003��ʹ����������ʡ�http://eureka7003.com:7003/�����������ͼ��

![Eureka ��Ⱥ 7003](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1010306034-6.png)
ͼ7��Eureka Server ��Ⱥ -7003

����ͼ���Կ����� �����ṩ�ߣ�micro-service-cloud-provider-dept-8001�����ṩ�ķ����Ѿ�ע�ᵽ�� Eureka Server 7003�������� DS Replicas ѡ����Ҳ��ʾ�˼�Ⱥ�е��������� Eureka Server��Eureka Server 7001 �� Eureka Server 7002��

�Դ����Ǿ������ Eureka Server ��Ⱥ�Ĵ��ʹ�á�

## Eureka ���ұ�������

�������ڱ��ص��Ի��� Eureka �ĳ���ʱ��Eureka ����ע�����ĺ��п��ܻ��������ͼ��ʾ�ĺ�ɫ���档

![Eureka ���ұ�������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/10103014a-7.png)
ͼ8��Eureka ���ұ�����ʾ


ʵ���ϣ���������Ǵ����� Eureka �����ұ������ƶ����ֵġ�Ĭ������£���� Eureka Server ��һ��ʱ���ڣ�Ĭ��Ϊ 90 �룩û�н��յ�ĳ�������ṩ�ߣ�Eureka Client�����������ͻὫ��������ṩ���ṩ�ķ���ӷ���ע������Ƴ��� �������������߾���Ҳ�޷��ӷ���ע�������л�ȡ����������ˣ����޷����ø÷���

����ʵ�ʵķֲ�ʽ΢����ϵͳ�У������ķ���Eureka Client��Ҳ�п��ܻ�����������ϣ����������ӳ١����١�ӵ����ԭ�򣩶��޷��� Eureka Server ����ͨѶ������ʱ Eureka Server ��Ϊû�н����������󽫽����ķ���ӷ����б����Ƴ�������Ȼ�ǲ�����ġ��� Eureka �����ұ������ƾ��������������ġ�

��ν ��Eureka �����ұ������ơ���������˼����ǡ��������������š������ Eureka Server ��һ��ʱ����û�н��յ� Eureka Client ����������ô Eureka Server �ͻῪ�����ұ���ģʽ�������е� Eureka Client ��ע����Ϣ����������������ֱ�Ӵӷ���ע������Ƴ���һ������ָ�����Щ Eureka Client �ṩ�ķ��񻹿��Լ������������������ѡ�

���ϣ�Eureka �����ұ���������һ��Ӧ�������쳣�İ�ȫ������ʩ�����ļܹ���ѧ�ǣ�����ͬʱ��������΢���񣨽����ķ���Ͳ������ķ��񶼻ᱣ����Ҳ��äĿ�Ƴ��κν����ķ���ͨ�� Eureka �����ұ������ƣ������� Eureka Server ��Ⱥ���ӵĽ�׳���ȶ���

> Eureka �����ұ�������Ҳ���ڱ׶ˡ������ Eureka ���ұ������ƴ����ڼ䣬�����ṩ���ṩ�ķ���������⣬��ô���������߾ͺ����׻�ȡ���Ѿ������ڵķ���������ֵ���ʧ�ܵ��������ʱ�����ǿ���ͨ���ͻ��˵��ݴ��������������⣬������ο� [Spring Cloud Netflix Ribbon](http://c.biancheng.net/springcloud/ribbon.html) �� [Spring Cloud Netflix Hystrix](http://c.biancheng.net/springcloud/hystrix.html)��

Ĭ������£�Eureka �����ұ��������ǿ����ģ������Ҫ�رգ�����Ҫ�������ļ�������������á�





```


eureka:
server:
enable-self-preservation: false # false �ر� Eureka �����ұ������ƣ�Ĭ���ǿ���,һ�㲻�������޸�

```





## ʾ�� 3

��������ͨ��һ��ʵ��������֤�� Eureka �����ұ������ơ�

1\. �� micro-service-cloud-eureka-7001 �������ļ� application.yml ������������ã��ر� Eureka �����ұ������ơ�





```


eureka:
server:
enable-self-preservation: false # false �ر� Eureka �����ұ������ƣ�Ĭ���ǿ���,һ�㲻�������޸�

```





2\. ��Ⱥ�е� micro-service-cloud-eureka-7002 �� micro-service-cloud-eureka-7002 �����κ��޸ģ������ǵ����ұ��������ǿ����ġ�

3\. ���� Eureka Server ��Ⱥ�Լ� micro-service-cloud-provider-dept-8001��ʹ����������ʡ�http://eureka7001.com:7001/�����������ͼ��

![Eureka ���ұ������� 7001](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/101030J48-8.png)
ͼ9��Eureka �ر����ұ�������

��ͼ 8 �������Կ����������ݣ�

*   �� DS Replicas ѡ����������˺�ɫ������Ϣ��THE SELF PRESERVATION MODE IS TURNED OFF. THIS MAY NOT PROTECT INSTANCE EXPIRY IN CASE OF NETWORK/OTHER PROBLEMS.�������ָ���Ϣ���ʾ�� Eureka ���ұ���ģʽ�ѹرա���
*   micro-service-cloud-provider-dept-8001 �ṩ�ķ����Ѿ�ע�ᵽ�� Eureka Server �С�

4\. ʹ����������ʡ�http://eureka7002.com:7002/�����������ͼ��

![Eureka ���ұ������� 7002](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1010301938-9.png)
ͼ10��Eureka ���ұ�������

��ͼ 9 ���Կ�����micro-service-cloud-provider-dept-8001 �ṩ�ķ���Ҳ�Ѿ�ע�ᵽ��ǰ Eureka Server �У��� DS Replicas ѡ���Ϸ�û���κξ�����ʾ��

5\. �ر� micro-service-cloud-provider-dept-8001���ȴ������ӣ��ٴη��ʡ�http://eureka7001.com:7001/�����������ͼ��

![Eureka ���ұ�������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/10103014J-10.png)
ͼ11��Eureka �ر����ұ�������-2

��ͼ 10 �� �����ǿ��Կ����������ݣ�

*   �� DS Replicas ѡ����������˺�ɫ������Ϣ��RENEWALS ARE LESSER THAN THE THRESHOLD. THE SELF PRESERVATION MODE IS TURNED OFF. THIS MAY NOT PROTECT INSTANCE EXPIRY IN CASE OF NETWORK/OTHER PROBLEMS.�������ָ���Ϣ���ʾ Eureka �����ұ���ģʽ�ѹرգ����Ѿ��з����Ƴ���
*   micro-service-cloud-provider-dept-8001 �ṩ�ķ����Ѿ��ӷ����б����Ƴ���

6\. �ٴη��ʡ�http://eureka7002.com:7002/�����������ͼ��

![Eureka ���ұ������ƿ���](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1010301210-11.png)
ͼ12��Eureka ���ұ���������Ч

��ͼ 11 �� �������Կ����������ݣ�

*   �� DS Replicas ѡ����������˺�ɫ������Ϣ��EMERGENCY! EUREKA MAY BE INCORRECTLY CLAIMING INSTANCES ARE UP WHEN THEY'RE NOT. RENEWALS ARE LESSER THAN THRESHOLD AND HENCE THE INSTANCES ARE NOT BEING EXPIRED JUST TO BE SAFE.�������ָ���Ϣ���� Eureka �����ұ������ƴ��ڿ���״̬�����Ѿ���������
*   micro-service-cloud-provider-dept-8001 �ķ�����Ϣ��Ȼ���� Eureka Server ����ע����У���δ���Ƴ���

# �ο�����
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud
https://github.com/macrozheng/springcloud-learning