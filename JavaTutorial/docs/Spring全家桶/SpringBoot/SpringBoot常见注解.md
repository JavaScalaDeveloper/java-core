## 1 ����
Spring Boot ͨ�����Զ����ù���ʹ���� Spring ��ø������ס�

�ڱ����ٽ̳��У����ǽ�̽�� org.springframework.boot.autoconfigure �� org.springframework.boot.autoconfigure.condition ���е�ע�⡣

## 2 @SpringBootApplication
����ʹ�����ע������� Spring Boot Ӧ�ó�������ࣺ

@SpringBootApplication
����ʹ�����ע������� Spring Boot Ӧ�ó�������ࣺ
````
@SpringBootApplication
class VehicleFactoryApplication {

    public static void main(String[] args) {
        SpringApplication.run(VehicleFactoryApplication.class, args);
    }
}
````
@SpringBootApplication ��װ��@Configuration��@EnableAutoConfiguration ��@ComponentScan ע�⼰��Ĭ�����ԡ�

## 3 @EnableAutoConfiguration

@EnableAutoConfiguration������˼�壬�����Զ����á� ����ζ�� Spring Boot ������·���в����Զ����� bean ���Զ�Ӧ�����ǡ�

��ע�⣬���Ǳ��뽫��ע����@Configuration һ��ʹ�ã�

````
@Configuration
@EnableAutoConfiguration
class VehicleFactoryConfig {}
````

## 4 @Configuration�Լ������

@Configuration�����ã���ע�����ϣ�����spring����(Ӧ��������)��

����������spring������bean��ʹ�õ�xml�����ļ�������һ����bean����springboot�У�Ϊ�����������ã�spring����ṩ��@Configuration��һע��

�൱�ڰѸ�����Ϊspring��xml�����ļ��е�<beans>

@Configurationע������У�ʹ��@Beanע���ע�ķ��������ص����Ͷ���ֱ��ע��Ϊbean��

@Configureע��Ķ������£�
````
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface Configuration {
String value() default "";
}
````
�Ӷ����������ײ��Ǻ���@Component ������@Configuration ���к� @Component �����á����context:component-scan/����@ComponentScan���ܴ���@Configurationע����ࡣ

ͨ���������Ǳ�д�Զ����Զ�����ʱ������ϣ�� Spring ��������ʹ�����ǡ� ���ǿ���ͨ�������е�ע����ʵ����һ�㡣

���ǿ��Խ��˲����е�ע�ͷ���@Configuration ���@Bean �����ϡ�

�ڽ������Ĳ����У����ǽ�ֻ����ÿ����������Ļ������ ���˽������Ϣ���������ƪ���¡�

### 4.1 @ConditionalOnClass and @ConditionalOnMissingClass
����������һ�����������жϵ�����ע�⣬Ҫ֪�����ܶ�ʱ�����ǰ������bean�ģ������Ǹ����ⲿjar���Ƿ���������м��غ��жϵġ�

����ʱ�򣬾�Ҫ�����ⲿ���Ƿ�����������Ƿ��Ƿ���ظ�bean

ʹ����Щ���������ע�Ͳ����е������/�����ڣ�Spring ����ʹ�ñ�ǵ��Զ����� bean��

````
@Configuration
@ConditionalOnClass(DataSource.class)
class MySQLAutoconfiguration {
//...
}
````

### 4.2 @ConditionalOnBean and @ConditionalOnMissingBean

��������Ҫ�����ض� bean �Ĵ��ڻ򲻴�������������ʱ�����ǿ���ʹ����Щע�ͣ�

������һ��ע������Щ��ͬ����Ϊ���ǵ��ж����������bean

````
@Bean
@ConditionalOnBean(name = "dataSource")
LocalContainerEntityManagerFactoryBean entityManagerFactory() {
// ...
}
````
### 4.3 @ConditionalOnProperty
ͨ�����ע�⣬���ǿ��Զ����Ե�ֵ��������

Ҫע�⣬���������ֵ��Դ��application.properties�ļ��е�����

````
@Bean
@ConditionalOnProperty(
name = "usemysql",
havingValue = "local"
)
DataSource dataSource() {
// ...
}
````
 
### 4.4 @ConditionalOnResource

���ǿ����� Spring ���ڴ����ض���Դʱʹ�ö��壺
����˼�壬Ҫ��classpath���������Դ�ļ�ʱ�Ž��м��أ���Ҳ�Ǻܳ��õ�һ��ע�⡣

````

@ConditionalOnResource(resources = "classpath:mysql.properties")
Properties  ditionalProperties() {
// ...
}
````
 
### 4.5 @ConditionalOnWebApplication and @ConditionalOnNotWebApplication
���ע��ͨ�����ں�web��ǿ������������ȫ�޹�����������

ʹ����Щע�ͣ����ǿ��Ը��ݵ�ǰӦ�ó����Ƿ��� Web Ӧ�ó���������������
````

@ConditionalOnWebApplication
HealthCheckController healthCheckController() {
// ...
}
````
 
### 4.6 @ConditionalExpression
springboot���Ϊ�����뵽�������������������ע�⻹�����������Ҫ����ô�ɴ�������Լ�д������Ӧ��û������ɣ�

���ǿ����ڸ����ӵ������ʹ�����ע�⡣ �� SpEL ���ʽ������Ϊ��ʱ��Spring ��ʹ�ñ�ǵĶ��壺

````
@Bean
@ConditionalOnExpression("${usemysql} && ${mysqlserver == 'local'}")
DataSource dataSource() {
// ...
}
````

### 4.7 @Conditional
ʲô���������⣿
��springbootҲ�����ṩʲô���ʽ�����ˣ�ֱ�����û�дһ���ж�������������true����false������

���ڸ����ӵ����������ǿ��Դ���һ�������Զ����������ࡣ ���Ǹ��� Spring ������Զ��������� @Conditional һ��ʹ�ã�

````
@Conditional(HibernateCondition.class)
Properties  ditionalProperties() {
//...
}
````

## 5 �ܽ�
�ڱ����У����Ǹ��������΢���Զ����ù��̲�Ϊ�Զ����Զ����� bean �ṩ������