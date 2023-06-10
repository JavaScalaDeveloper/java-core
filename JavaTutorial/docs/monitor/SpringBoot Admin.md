## ժҪ

Spring Boot Admin ���Զ�SpringBootӦ�õĸ���ָ����м�أ�������Ϊ΢����ܹ��еļ��������ʹ�ã����Ľ������÷�������ϸ���ܡ�

## Spring Boot Admin ���

SpringBootӦ�ÿ���ͨ��Actuator����¶Ӧ�����й����еĸ���ָ�꣬Spring Boot Adminͨ����Щָ�������SpringBootӦ�ã�Ȼ��ͨ��ͼ�λ�������ֳ�����Spring Boot Admin�������Լ�ص���Ӧ�ã������Ժ�Spring Cloud��ע���������������΢����Ӧ�á�

Spring Boot Admin �����ṩӦ�õ����¼����Ϣ��

*   ���Ӧ�����й����еĸ�����Ϣ��
*   ����ָ����Ϣ������JVM��Tomcat��������Ϣ��
*   ����������Ϣ������ϵͳ���ԡ�ϵͳ���������Լ�Ӧ��������Ϣ��
*   �鿴���д�����Bean��Ϣ��
*   �鿴Ӧ���е�����������Ϣ��
*   �鿴Ӧ��������־��Ϣ��
*   �鿴JVM��Ϣ��
*   �鿴���Է��ʵ�Web�˵㣻
*   �鿴HTTP������Ϣ��

## ����admin-serverģ��

> �������Ǵ���һ��admin-serverģ������Ϊ���������ʾ�书�ܡ�

*   ��pom.xml��������������





````
<dependency>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
 <groupId>de.codecentric</groupId>
 <artifactId>spring-boot-admin-starter-server</artifactId>
</dependency>

````

*   ��application.yml�н������ã�





````spring:
 application:
 name: admin-server
server:
 port: 9301
````

*   �������������@EnableAdminServer������admin-server���ܣ�




````
@EnableAdminServer
@SpringBootApplication
public class AdminServerApplication {

 public static void main(String[] args) {
 SpringApplication.run(AdminServerApplication.class, args);
 }

}
````

## ����admin-clientģ��

> �������Ǵ���һ��admin-clientģ����Ϊ�ͻ���ע�ᵽadmin-server��

*   ��pom.xml��������������



````
<dependency>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
 <groupId>de.codecentric</groupId>
 <artifactId>spring-boot-admin-starter-client</artifactId>
</dependency>
````

*   ��application.yml�н������ã�








```
spring:
 application:
 name: admin-client
 boot:
 admin:
 client:
 url: http://localhost:9301 #����admin-server��ַ
server:
 port: 9305
management:
 endpoints:
 web:
 exposure:
 include: '*'
 endpoint:
 health:
 show-details: always
logging:
 file: admin-client.log #��ӿ���admin����־���
```

*   ����admin-server��admin-client����

## �����Ϣ��ʾ

*   �������µ�ַ��Spring Boot Admin����ҳ��[http://localhost:9301](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A9301 "http://localhost:9301")

![image-20230531001002163](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230531001002163.png)





*   ���wallboard��ť��ѡ��admin-client�鿴�����Ϣ��

*   �����Ϣ������

![image-20230531001023644](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230531001023644.png)





*   ����ָ����Ϣ������JVM��Tomcat��������Ϣ��

![image-20230531001053279](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230531001053279.png)





*   ����������Ϣ������ϵͳ���ԡ�ϵͳ���������Լ�Ӧ��������Ϣ��

![image-20230531001103093](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230531001103093.png)





*   �鿴���д�����Bean��Ϣ��

![image-20230531001111221](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230531001111221.png)





*   �鿴Ӧ���е�����������Ϣ��

![image-20230531001124678](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230531001124678.png)





*   �鿴��־��Ϣ����Ҫ����������ò��ܿ�����



`logging:
file: admin-client.log #��ӿ���admin����־���`

![image-20230531001136184](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230531001136184.png)




*   �鿴JVM��Ϣ��

![image-20230531001144614](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230531001144614.png)





*   �鿴���Է��ʵ�Web�˵㣻

![image-20230531001156191](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230531001156191.png)





*   �鿴HTTP������Ϣ��

![image-20230531001206364](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230531001206364.png)





## ���ע������ʹ��

> Spring Boot Admin���Spring Cloud ע������ʹ�ã�ֻ�轫admin-server��ע���������ϼ��ɣ�admin-server ���Զ���ע�����Ļ�ȡ�����б�Ȼ�󰤸���ȡ�����Ϣ��������Eurekaע������Ϊ���������¸ù��ܡ�

### �޸�admin-server

*   ��pom.xml��������������




````
<dependency>
 <groupId>org.springframework.cloud</groupId>
 <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
````

*   ��application-eureka.yml�н������ã�ֻ�����ע���������ü��ɣ�




````
spring:
 application:
 name: admin-server
server:
 port: 9301
eureka:
 client:
 register-with-eureka: true
 fetch-registry: true
 service-url:
 defaultZone: http://localhost:8001/eureka/
````

*   �������������@EnableDiscoveryClient�����÷���ע�Ṧ�ܣ�





````
`@EnableDiscoveryClient
@EnableAdminServer
@SpringBootApplication
public class AdminServerApplication {

 public static void main(String[] args) {
 SpringApplication.run(AdminServerApplication.class, args);
 }

}
````

### �޸�admin-client

*   ��pom.xml��������������



````
<dependency>
 <groupId>org.springframework.cloud</groupId>
 <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
````

*   ��application-eureka.yml�н������ã�ɾ��ԭ����admin-server��ַ���ã����ע���������ü��ɣ�





```
spring:
 application:
 name: admin-client
server:
 port: 9305
management:
 endpoints:
 web:
 exposure:
 include: '*'
 endpoint:
 health:
 show-details: always
logging:
 file: admin-client.log #��ӿ���admin����־���
eureka:
 client:
 register-with-eureka: true
 fetch-registry: true
 service-url:
 defaultZone: http://localhost:8001/eureka/
```

*   �������������@EnableDiscoveryClient�����÷���ע�Ṧ�ܣ�





```
@EnableDiscoveryClient
@SpringBootApplication
public class AdminClientApplication {

 public static void main(String[] args) {
 SpringApplication.run(AdminClientApplication.class, args);
 }

}
```

### ������ʾ

*   ����eureka-server��ʹ��application-eureka.yml��������admin-server��admin-client��

*   �鿴ע�����ķ��ַ������ע�᣺[http://localhost:8001/](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A8001%2F "http://localhost:8001/")

![image-20230531001221519](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230531001221519.png)


*   �鿴Spring Boot Admin ��ҳ���ֿ��Կ���������Ϣ��[http://localhost:9301](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A9301 "http://localhost:9301")

![image-20230531001232048](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230531001232048.png)


## ��ӵ�¼��֤

> ���ǿ���ͨ����admin-server���Spring Security֧������õ�¼��֤���ܡ�

### ����admin-security-serverģ��

*   ��pom.xml��������������



```
<dependency>
 <groupId>org.springframework.cloud</groupId>
 <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
<dependency>
 <groupId>de.codecentric</groupId>
 <artifactId>spring-boot-admin-starter-server</artifactId>
 <version>2.1.5</version>
</dependency>
<dependency>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

*   ��application.yml�н������ã����õ�¼�û��������룬����admin-security-server�ļ����Ϣ��





```
spring:
 application:
 name: admin-security-server
 security: # ���õ�¼�û���������
 user:
 name: macro
 password: 123456
 boot:  # ����ʾadmin-security-server�ļ����Ϣ
 admin:
 discovery:
 ignored-services: ${spring.application.name}
server:
 port: 9301
eureka:
 client:
 register-with-eureka: true
 fetch-registry: true
 service-url:
 defaultZone: http://localhost:8001/eureka/
```

*   ��SpringSecurity�������ã��Ա�admin-client����ע�᣺





scss

���ƴ���





```
/**
 * Created by macro on 2019/9/30.
 */
@Configuration
public class SecuritySecureConfig extends WebSecurityConfigurerAdapter {
 private final String adminContextPath;

 public SecuritySecureConfig(AdminServerProperties adminServerProperties) {
 this.adminContextPath = adminServerProperties.getContextPath();
 }

 @Override
 protected void configure(HttpSecurity http) throws Exception {
 SavedRequestAwareAuthenticationSuccessHandler successHandler = new SavedRequestAwareAuthenticationSuccessHandler();
 successHandler.setTargetUrlParameter("redirectTo");
 successHandler.setDefaultTargetUrl(adminContextPath + "/");

 http.authorizeRequests()
 //1.�������о�̬��Դ�͵�¼ҳ���Թ�������
 .antMatchers(adminContextPath + "/assets/**").permitAll()
 .antMatchers(adminContextPath + "/login").permitAll()
 .anyRequest().authenticated()
 .and()
 //2.���õ�¼�͵ǳ�·��
 .formLogin().loginPage(adminContextPath + "/login").successHandler(successHandler).and()
 .logout().logoutUrl(adminContextPath + "/logout").and()
 //3.����http basic֧�֣�admin-clientע��ʱ��Ҫʹ��
 .httpBasic().and()
 .csrf()
 //4.��������cookie��csrf����
 .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
 //5.������Щ·����csrf�����Ա�admin-clientע��
 .ignoringAntMatchers(
 adminContextPath + "/instances",
 adminContextPath + "/actuator/**"
 );
 }
}
```

*   �޸������࣬����AdminServer��ע�ᷢ�ֹ��ܣ�





```
@EnableDiscoveryClient
@EnableAdminServer
@SpringBootApplication
public class AdminSecurityServerApplication {

 public static void main(String[] args) {
 SpringApplication.run(AdminSecurityServerApplication.class, args);
 }
}
```

*   ����eureka-server��admin-security-server������Spring Boot Admin ��ҳ������Ҫ��¼���ܷ��ʣ�[http://localhost:9301](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A9301 "http://localhost:9301")

![image-20230531001242361](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230531001242361.png)





## ʹ�õ���ģ��





```
springcloud-learning
������ eureka-server -- eurekaע������
������ admin-server -- admin������ķ���
������ admin-client -- admin������ļ�ص�Ӧ�÷���
������ admin-security-server -- ����¼��֤��admin������ķ���` 
```