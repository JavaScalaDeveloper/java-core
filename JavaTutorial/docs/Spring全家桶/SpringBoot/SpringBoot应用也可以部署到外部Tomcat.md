

<header>

# Spring Boot Tomcat����

�������ݽ���վ�������Ѹ���ѧϰ�ʼǡ��ܽ���о��ղء�����֤��ȷ�ԣ���ʹ�ö������ķ����뱾վ�޹أ�

</header>



<script>( adsbygoogle = window.adsbygoogle || []).push({});</script>



ͨ��ʹ��Spring BootӦ�ó��򣬿��Դ���һ��war�ļ��Բ���Web�������С��ڱ����У���ѧϰ��δ���WAR�ļ�����Tomcat Web�������в���Spring BootӦ�ó���

## Spring Boot Servlet��ʼ������

��ͳ�Ĳ���ʽ��ʹSpring BootӦ�ó���`[@SpringBootApplication](https://github.com/SpringBootApplication "@SpringBootApplication")`����չ`SpringBootServletInitializer`�ࡣ `SpringBootServletInitializer`���ļ�������ʹ��Servlet��������ʱ����Ӧ�ó���

�������������JAR�ļ������Spring BootӦ�ó������ļ��Ĵ��� -

```
package com.yiibai.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {
   public static void main(String[] args) {
      SpringApplication.run(DemoApplication.class, args);
   }
}

```

��Ҫ��չ��`SpringBootServletInitializer`��֧��WAR�ļ����� Spring BootӦ�ó������ļ��Ĵ������� -

```
package com.yiibai.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;

@SpringBootApplication
public class DemoApplication  extends SpringBootServletInitializer {
   @Override
   protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
      return application.sources(DemoApplication.class);
   }
   public static void main(String[] args) {
      SpringApplication.run(DemoApplication.class, args);
   }
}

```

## ����Main��

��Spring Boot�У���Ҫ�ڹ����ļ���ָ�����������ࡣ
����Maven����`pom.xml`���������`start`�࣬������ʾ -

```
<start-class>com.yiibai.demo.DemoApplication</start-class>

```

����Gradle����`build.gradle`�������������������ʾ -

```
mainClassName="com.yiibai.demo.DemoApplication"

```

## �����JAR����ΪWAR

ʹ�����´��뽫��װJAR����ΪWAR��

����Maven����_pom.xml_ �н���װ���ΪWAR��������ʾ -

```
<packaging>war</packaging>

```

����Gradle����_build.gradle_ �����Ӧ�ó�������war�����������ʾ -

```
apply plugin: 'war'
apply plugin: 'application'

```

����GradlNow����дһ���򵥵�Rest�˵��������ַ���:`"Hello World from Tomcat"`�� Ҫ��дRest�˵㣬��Ҫ��Spring Boot Web starter��������ӵ������ļ��С�

����Maven��ʹ��������ʾ�Ĵ�����_pom.xml_ �����Spring Boot�������������� -

```
<dependency>
   <groupId>org.springframework.boot</groupId>
   spring-boot-starter-web
</dependency>

```

����Gradle��ʹ��������ʾ�Ĵ�����_build.gradle_ �����Spring Boot starter������ -

```
dependencies {
   compile('org.springframework.boot:spring-boot-starter-web')
}

```

���ڣ�ʹ��������ʾ�Ĵ�����Spring Boot Application���ļ��б�дһ���򵥵�Rest�˵� -

```
package com.yiibai.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class DemoApplication  extends SpringBootServletInitializer {
   @Override
   protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
      return application.sources(DemoApplication.class);
   }
   public static void main(String[] args) {
      SpringApplication.run(DemoApplication.class, args);
   }

   @RequestMapping(value = "/")
   public String hello() {
      return "Hello World from Tomcat";
   }
}

```

## ���Ӧ�ó���

���ڣ�ʹ��Maven��Gradle�����һ��WAR�ļ��Բ���Tomcat�������У��Դ��Ӧ�ó���������ʾ��

����Maven��ʹ������`mvn package`���Ӧ�ó��� Ȼ�󴴽�WAR�ļ���������Ŀ��Ŀ¼���ҵ������������������Ļ��ͼ��ʾ -

![](/uploads/images/2018/09/27/084613_17931.jpg)

����Gradle��ʹ������`gradle clean build`���Ӧ�ó��� Ȼ�󣬽�����WAR�ļ���������`build/libs`Ŀ¼���ҵ������۲�˴���������Ļ��ͼ�Ա���õ���� -

![](/uploads/images/2018/09/27/084717_10144.jpg)

## ����Tomcat

���ڣ�����Tomcat������������webappsĿ¼�²���WAR�ļ����۲�˴���ʾ����Ļ��ͼ�Ա���õ���� -

![](/uploads/images/2018/09/27/084759_50620.jpg)

�ɹ�����󣬵����ҳ������е�URL => `http://localhost:8080/demo-0.0.1-SNAPSHOT/`���۲�����������ͼ��ʾ -

![](/uploads/images/2018/09/27/084848_70593.jpg)

�����������£�

�ļ���_pom.xml_ -

```
<?xml version = "1.0" encoding = "UTF-8"?>
<project xmlns = "http://maven.apache.org/POM/4.0.0" 
   xmlns:xsi = "http://www.w3.org/2001/XMLSchema-instance"

xsi:schemaLocation = "http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
<modelVersion>4.0.0</modelVersion>

   <groupId>com.yiibai</groupId>
   demo
   <version>0.0.1-SNAPSHOT</version>
   <packaging>war</packaging>
   <name>demo</name>
   <description>Demo project for Spring Boot</description>

   <parent>
      <groupId>org.springframework.boot</groupId>
      spring-boot-starter-parent
      <version>1.5.8.RELEASE</version>
      <relativePath/> <!-- lookup parent from repository -->
   </parent>

   <properties>
      <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
      <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
      <java.version>1.8</java.version>
      <start-class>com.yiibai.demo.DemoApplication</start-class>
   </properties>

   <dependencies>
      <dependency>
         <groupId>org.springframework.boot</groupId>
         spring-boot-starter-web
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
         </plugin>
      </plugins>
   </build>

</project>

```

�ļ���_build.gradle_

```
buildscript {
   ext {
      springBootVersion = '1.5.8.RELEASE'
   }
   repositories {
      mavenCentral()
   }
dependencies {
      classpath("org.springframework.boot:spring-boot-gradle-plugin:${springBootVersion}")
   }
}

apply plugin: 'java'
apply plugin: 'eclipse'
apply plugin: 'org.springframework.boot'
apply plugin: 'war'
apply plugin: 'application'

group = 'com.yiibai'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = 1.8
mainClassName = "com.yiibai.demo.DemoApplication"

repositories {
   mavenCentral()
}
dependencies {
   compile('org.springframework.boot:spring-boot-starter-web')
   testCompile('org.springframework.boot:spring-boot-starter-test')
}

```

Spring BootӦ�ó������ļ��Ĵ������� -

```
package com.yiibai.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class DemoApplication  extends SpringBootServletInitializer {
   @Override
   protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
      return application.sources(DemoApplication.class);
   }
   public static void main(String[] args) {
      SpringApplication.run(DemoApplication.class, args);
   }

   @RequestMapping(value = "/")
   public String hello() {
      return "Hello World from Tomcat";
   }
}
```





//�������Ķ���https://www.yiibai.com/spring-boot/spring_boot_tomcat_deployment.html

