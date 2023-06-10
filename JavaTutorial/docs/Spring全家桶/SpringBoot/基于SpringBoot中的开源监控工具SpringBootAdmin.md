Spring Boot Admin(SBA)��һ����Դ��������Ŀ�����ڹ���ͼ�� Spring Boot Ӧ�ó���Ӧ�ó������ͨ�� http �ķ�ʽ���� Spring Cloud �����ֻ���ע�ᵽ SBA �У�Ȼ��Ϳ���ʵ�ֶ� Spring Boot ��Ŀ�Ŀ��ӻ�����Ͳ鿴�ˡ�

Spring Boot Admin ���Լ�� Spring Boot ������Ⱥ��Ŀ�����ṩ��ϸ�Ľ��� (Health)��Ϣ���ڴ���Ϣ��JVM ϵͳ�ͻ������ԡ�����������Ϣ����־���úͲ鿴����ʱ����鿴��Spring Boot ����鿴�͹���ȹ��ܡ�����������һ�������ʹ�ðɡ�

�����յ�չʾЧ�����£�

[![](https://s5.51cto.com/oss/202201/14/5d142e8c6b544f7b981b3eff8099b3d8.png)](https://s5.51cto.com/oss/202201/14/5d142e8c6b544f7b981b3eff8099b3d8.png)

## 1.�SBA��ض�

������Ҫ����һ�� Spring Boot Admin ��Ŀ��������غ͹������ǵ� Spring Boot ��Ŀ����ķ�ʽ�ʹ�����ͨ�� Spring Boot ��Ŀ���ƣ����岽�����¡�ʹ�� Idea ����һ�� Spring Boot ��Ŀ��

[![](https://s5.51cto.com/oss/202201/14/d97c492785db6ff2ded49175184ceda9.png)](https://s5.51cto.com/oss/202201/14/d97c492785db6ff2ded49175184ceda9.png)

[![](https://s3.51cto.com/oss/202201/14/8bb1f0389b95e174b56ac01ba313ec7b.png)](https://s3.51cto.com/oss/202201/14/8bb1f0389b95e174b56ac01ba313ec7b.png)

������Ҫע�⣬��Ҫ��� Spring Boot Admin(Server)����˿�ܵ�֧�֣�����ͼ��ʾ��

[![](https://s4.51cto.com/oss/202201/14/122e9f0726fde8ac0c8936c79ef12f5f.png)](https://s4.51cto.com/oss/202201/14/122e9f0726fde8ac0c8936c79ef12f5f.png)

Ҳ���Ǵ����� Spring Boot ��Ŀ��Ҫ�������������Ҫ�Ŀ��֧�֣�



<button data-clipboard-target="#code_id_0">����</button>

```
<dependency> 
   <groupId>org.springframework.boot</groupId> 
   spring-boot-starter-web 
</dependency> 
<dependency> 
  <groupId>de.codecentric</groupId> 
  spring-boot-admin-starter-server 
</dependency> 

```





<dependency></dependency>

### 1.1 ����SBA����

��������Ŀ֮����Ҫ���������Ͽ��� SBA ����



<button data-clipboard-target="#code_id_1">����</button>

```
import de.codecentric.boot.admin.server.config.EnableAdminServer; 
import org.springframework.boot.SpringApplication; 
import org.springframework.boot.autoconfigure.SpringBootApplication; 

@EnableAdminServer // ��Ӵ��д��� 
@SpringBootApplication  
public class SbaserverApplication { 
    public static void main(String[] args) { 
        SpringApplication.run(SbaserverApplication.class, args); 
    } 
} 

```





### 1.2 ����SBA�˿ں�

�� application.properties ������һ����Ŀ�Ķ˿ںžͿ���ֱ�������ˣ������õĶ˿ں��� 9001��



<button data-clipboard-target="#code_id_2">����</button>

```
server.port=9001 

```





PS�����ö˿ںŵ���ҪĿ����Ϊ�˲������� Spring Boot ��Ŀ��ͻ����� SBA �ǵ�������˲�����Ժ��ԡ�

������Ŀ֮�󣬾Ϳ��Կ��� SBA ����ҳ�ˣ�����ͼ��ʾ��

[![](https://s5.51cto.com/oss/202201/14/20418ce88230b20b234f9e9c15e07f47.png)](https://s5.51cto.com/oss/202201/14/20418ce88230b20b234f9e9c15e07f47.png)

��ʱ SBA �л�û������κ���Ҫ��ص���Ŀ�������������ٴ���һ�� Spring Boot ��Ŀ�����뵽 SBA �������м�غ͹���ɡ�

## 2.����һ����ͨSpringBoot��Ŀ

���ȣ�������Ҫ����һ����ͨ�� Spring Boot ��Ŀ������Ĵ�����������Ͳ���ʾ�ˡ��������� Spring Boot ��Ŀ֮����Ҫ����� Spring Boot ��Ŀ����Ҫ��� SBA �ͻ��˿�ܵ�֧�֣�Ҳ������ pom.xml �������������ݣ�

<dependency></dependency>



<button data-clipboard-target="#code_id_3">����</button>

```
<dependency> 
  <groupId>de.codecentric</groupId> 
  spring-boot-admin-starter-client 
</dependency> 

```





Ȼ���� application.properties �ļ������� SBA �������˵�ַ��Ҳ�������ǵ�һ������ SBA ��Ŀ�ĵ�ַ�������������£�



<button data-clipboard-target="#code_id_4">����</button>

```
# ��ǰ��Ŀ�˿ں� 
server.port=8080 
# Spring Boot Admin ��ط������˵�ַ 
spring.boot.admin.client.url=http://localhost:9001 

```





���С�spring.boot.admin.client.url��Ϊ SBA ��ص�ַ��

## 3.SpringBootAdmin�������

������������Ϣ֮�󣬴�ʱ�鿴 Spring Boot Admin ҳ���о��б���ص� Spring Boot ��Ŀ�ˣ�����ͼ��ʾ��

[![](https://s5.51cto.com/oss/202201/14/c010770a5cdfe5fad0ad1e8f0c3b07dc.png)](https://s5.51cto.com/oss/202201/14/c010770a5cdfe5fad0ad1e8f0c3b07dc.png)

Ҳ���Ե����Ӧ��ǽ���鿴 Spring Boot Admin �����б���ص� Spring Boot ��Ŀ������ͼ��ʾ��

[![](https://s4.51cto.com/oss/202201/14/d88e33f87e116000f9717e8c19c43cc4.png)](https://s4.51cto.com/oss/202201/14/d88e33f87e116000f9717e8c19c43cc4.png)

���Ӧ�ý�������ҳ�棬����ͼ��ʾ��

[![](https://s2.51cto.com/oss/202201/14/4c3609840ea5cb45779eafbc2b260324.png)](https://s2.51cto.com/oss/202201/14/4c3609840ea5cb45779eafbc2b260324.png)

[![](https://s4.51cto.com/oss/202201/14/2912ed434d97f8dd49c27ce73252d34c.png)](https://s4.51cto.com/oss/202201/14/2912ed434d97f8dd49c27ce73252d34c.png)

�¼���־�а��� Spring Boot ����״̬��չʾ(UP Ϊ������OFFLINE Ϊ�쳣)�ͷ�����ʱ�䣬����ͼ��ʾ��

[![](https://s5.51cto.com/oss/202201/14/5792a62fbcafe6978bfe3bd26cf1e3ab.png)](https://s5.51cto.com/oss/202201/14/5792a62fbcafe6978bfe3bd26cf1e3ab.png)

## 4.SpringBoot�쳣���

�������ֶ��ѱ���ص� Spring Boot ��Ŀֹ֮ͣ���� Spring Boot Admin �оͿ��Բ鿴��һ��Ӧ���Ѿ���ͣ���ˣ�����ͼ��ʾ��

[![](https://s5.51cto.com/oss/202201/14/47569a3fe09e62b2364c26bdbd7da4bc.png)](https://s5.51cto.com/oss/202201/14/47569a3fe09e62b2364c26bdbd7da4bc.png)

����Ҳ����ͨ���¼���־�鿴 Spring Boot 崻��ľ���ʱ�䣬����ͼ��ʾ��

[![](https://s2.51cto.com/oss/202201/14/b63f631561fa646f85ccf3e1e4321939.png)](https://s2.51cto.com/oss/202201/14/b63f631561fa646f85ccf3e1e4321939.png)

## 5.���ò鿴��������

ͨ��������������ǿ��Կ�������ص� Spring Boot ѡ��ǱȽ��ٵģ���ô���ܲ鿴����ļ������?Ҫ���������⣬������Ҫ�ڱ���ص� Spring Boot ��Ŀ����� spring-boot-starter-actuator ��ܵ�֧�֣��������鿴���м��������ò��У�����չʾЧ�����£�

[![](https://s4.51cto.com/oss/202201/14/03938ac0bded4487b6720fc4657f9e99.png)](https://s4.51cto.com/oss/202201/14/03938ac0bded4487b6720fc4657f9e99.png)

����������������һ����Щ����

### 5.1 ���actuator���֧��

�ڱ���ص� Spring Boot ��Ŀ����� actuator ���֧�֣�Ҳ������ pom.xml ������������ã�

<dependency></dependency>



<button data-clipboard-target="#code_id_5">����</button>

```
<dependency> 
    <groupId>org.springframework.boot</groupId> 
    spring-boot-starter-actuator 
</dependency> 

```





�ֶ���� Maven ����������(����������Զ����룬�˲���ɺ���)��

### 5.2 ���ÿ������м����

�ڱ���ص� Spring Boot ��Ŀ������������ã�



<button data-clipboard-target="#code_id_6">����</button>

```
# ������������� 
management.endpoints.web.exposure.include=* 

```





���ϵ������ǿ��ż������ѡ�������֮�������� Spring Boot ��Ŀ��Ȼ����ˢ�� Spring Boot Admin ����ļ�����չʾ�����ˣ�����ͼ��ʾ��

[![](https://s6.51cto.com/oss/202201/14/2cc24e05bc6185ba1869872db5a864a5.png)](https://s6.51cto.com/oss/202201/14/2cc24e05bc6185ba1869872db5a864a5.png)

### 5.3 �����ĿԤ��

�� Spring Boot �����м�������֮��ͨ�� SBA �Ϳ��Բ鿴���������ˣ�

*   ����ʱ�䡢�ۼ�����ʱ��;
*   ���̺��߳�������ռ�õ� CPU ��Դ;
*   ��������������Ϣ�����մ����ͻ���ʱ��;
*   JVM �߳�ת�����ڴ�ת������Ͷ�Ӧ���ļ�����;
*   ���Բ鿴������ Spring Boot ��Ŀ�е���־����;
*   �鿴 Spring Boot ��Ŀ���ܼ��;
*   �鿴 Spring Boot ���л�����Ϣ;
*   �鿴 Spring Boot ��������Ϣ;
*   �鿴 Spring Boot �еĶ�ʱ����;
*   �鿴�͹��� Spring Boot ��Ŀ�е����л��档

�����Ǽ�����Ҫҳ��Ľ�ͼ������һ��������

### 5.3.1 �鿴���л���

[![](https://s5.51cto.com/oss/202201/14/a9db77b1b0e378450086edd1ab438df5.png)](https://s5.51cto.com/oss/202201/14/a9db77b1b0e378450086edd1ab438df5.png)

[![](https://s2.51cto.com/oss/202201/14/17604f4f5eb388a2a6c08f55e1e050ac.png)](https://s2.51cto.com/oss/202201/14/17604f4f5eb388a2a6c08f55e1e050ac.png)

### 5.3.2 �鿴��ʱ����

[![](https://s5.51cto.com/oss/202201/14/113d94b9bd488e239967915aededc89c.png)](https://s5.51cto.com/oss/202201/14/113d94b9bd488e239967915aededc89c.png)

### 5.3.3 ��Ŀ��־��������

[![](https://s3.51cto.com/oss/202201/14/8da60846eecbdbd9472ae6dbf17d951f.png)](https://s3.51cto.com/oss/202201/14/8da60846eecbdbd9472ae6dbf17d951f.png)

���ǿ���ͨ�� Spring Boot Admin ����̬��������Ŀ�е���־����

### 5.3.4 JVM�̺߳��ڴ�鿴

[![](https://s2.51cto.com/oss/202201/14/d3f98228a8b19675475c863457821034.png)](https://s2.51cto.com/oss/202201/14/d3f98228a8b19675475c863457821034.png)

### 5.3.5 �鿴SpringBoot���л���

[![](https://s5.51cto.com/oss/202201/14/ae811102080c26b11135be50cd889710.png)](https://s5.51cto.com/oss/202201/14/ae811102080c26b11135be50cd889710.png)

��Ȼ���ǻ����Զ���Щ�������ɾ��������

## 6.�鿴��Ŀʵʱ��־

��Ҫ�鿴�����Ŀ�е���־��Ϣ����һ��ǰ��������ǰ���������㱻��ص� Spring Boot ��Ŀ��������������־�ı���·��������־�����ļ�����ֻ�������������е�����һ���� Spring Boot ��Ŀ�ŻὫ��־���浽�����ϣ���������ͨ�� SBA �鿴���������õ�����־·������ Spring Boot �� application.properties �����ļ�������������ã�



<button data-clipboard-target="#code_id_7">����</button>

```
# ������־����·�� 
logging.file.path=C:\\work\\log 

```





�������֮��������� Spring Boot ��Ŀ��Ȼ��ˢ�� SBA ҳ�棬����չʾЧ�����£�

[![](https://s6.51cto.com/oss/202201/14/3f03c6402cc8a2532ed45ab43be156ac.png)](https://s6.51cto.com/oss/202201/14/3f03c6402cc8a2532ed45ab43be156ac.png)

��ʱ���ǾͿ��Բ鿴ʵʱ����־��Ϣ�ˣ���Ȼ��Ҳ������ʱ������־�������Ҫ�Ļ���

## �ܽ�

Spring Boot Admin(SBA)��һ��������Դ��Ŀ�����ڹ���ͼ��� Spring Boot Ӧ�ó������ṩ��ϸ�Ľ��� (Health)��Ϣ���ڴ���Ϣ��JVM ϵͳ�ͻ������ԡ�����������Ϣ����־���úͲ鿴����ʱ����鿴��Spring Boot ����鿴�͹���ȹ��ܡ�

������Ҫ����һ�� SBA ���������������һ������ Spring Boot ��Ŀ������ص� Spring Boot ��ĿҪ��� SBA Client ��ܵ�֧�֣������ actuator ��ܺ���Ӧ�����ã��Ϳ���ʵ�ֶ� Spring Boot ��Ŀ����������ˡ�