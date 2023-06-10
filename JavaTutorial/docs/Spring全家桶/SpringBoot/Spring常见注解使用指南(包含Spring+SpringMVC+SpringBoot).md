# Springע��
## 1 ����

���Ƕ�֪��Spring����ĵ����Ծ���IOC+AOP��IOC��ԭ�����ʵ����һ��Spring������������������Spring Beanʵ��
DI��Ҳ��������ע�룬��������Ϊ��������Ҫ���ĵĺ��Ļ��⣬���ע��������ע���ĸ���������������Ҫ��ȷ֪���ġ�
����ǰ������ϰ������xml�����ļ�������һ��bean�������ڣ����Ǹ����ʹ��ע��ʹ��������DI�Ĺ���


���ǿ���ʹ�� org.springframework.beans.factory.annotation �� org.springframework.context.annotation ���е�ע�������� Spring DI ����Ĺ��ܡ�

����ͨ������Щ��Ϊ��Spring ����ע�͡������ǽ��ڱ��̳��ж�����лعˡ�


## 2 DI���ע��

### 2.1 @Autowired

���ǿ���ʹ�� @Autowired ����� Spring ��Ҫ������ע��������
���ǿ��Խ���ע���빹�캯����setter ���ֶ�ע��һ��ʹ�á�
Constructor injection:

**������ע��**

````
class Car {
    Engine engine;

    @Autowired
    Car(Engine engine) {
        this.engine = engine;
    }
}
````

**Setterע��**
````
class Car {
    Engine engine;

    @Autowired
    void setEngine(Engine engine) {
        this.engine = engine;
    }
}
````
**����ע��**
````
class Car {
    @Autowired
    Engine engine;
}
````

@Autowired ��һ����Ϊ required �Ĳ���������Ĭ��ֵΪ true��

�����Ҳ������ʵ� bean ������ʱ��������� Spring ����Ϊ�� ��Ϊ true ʱ�����׳��쳣�����������κ����ݡ�

��ע�⣬�������ʹ�ù��캯��ע�룬�����й��캯����������ǿ���Եġ�

�� 4.3 �汾��ʼ�����ǲ���Ҫ��ʽ��ʹ�� @Autowired ע�⹹�캯���������������������������캯����

### 2.2 @Bean

@Bean ���ʵ���� Spring bean �Ĺ���������

```
@Bean
Engine engine() {
    return new Engine();
}
````

����Ҫ�������͵���ʵ��ʱ��Spring �������Щ������

���ɵ� bean �빤������ͬ���� ����������Բ�ͬ�ķ�ʽ���������ǿ���ʹ�ô�ע�͵����ƻ�ֵ����������ֵ�ǲ������Ƶı�������

````
@Bean("engine")
Engine getEngine() {
    return new Engine();
}
````
����һ�ַǳ�������bean������ʽ����Ϊ�ܶ��bean����������һ��ʼ���ڴ����ﶨ��õģ���������Ҫ��������ʱ���������а��蹹����

���ǿ������ɵ������Ͷ���Bean������Ҳ���Ը������Զ����bean���ơ�

ע�⣬������@Bean ע�͵ķ�����������@Configuration ���С�

### 2.3 @Qualifier

����ʹ��@Qualifier ��@Autowired ���ṩ������Ҫ�ڲ���ȷ�����ʹ�õ�bean id ��bean ���ơ�

���磬�������� bean ʵ����ͬ�Ľӿڣ�
````
class Bike implements Vehicle {}

class Car implements Vehicle {}

````

��� Spring ��Ҫע��һ�� Vehicle bean�������Զ��ƥ�䶨������� ����������£����ǿ���ʹ�� @Qualifier ע����ʽ�ṩ bean �����ơ�

**������ע��**
````
@Autowired
Biker(@Qualifier("bike") Vehicle vehicle) {
this.vehicle = vehicle;
}
````

**Setterע��**

````
@Autowired
void setVehicle(@Qualifier("bike") Vehicle vehicle) {
this.vehicle = vehicle;
}
````
����:

````
@Autowired
@Qualifier("bike")
void setVehicle(Vehicle vehicle) {
this.vehicle = vehicle;
````
**����ע��**

````
@Autowired
@Qualifier("bike")
Vehicle vehicle;
````
���ע�����ǿ���ƽ���õĲ��࣬���ǵ�һ���ӿ��ж��ʵ����ʱ�����ͻᾭ�������ó���

### 2.4 @Required

@Required �� setter �����ϱ��������Ҫͨ�� XML ���������
````
@Required
void setColor(String color) {
this.color = color;
}
````
xml
````
<bean class="com.baeldung.annotations.Bike">
    <property name="color" value="green" />
</bean>
````
���򣬽��׳� BeanInitializationException��
�ǳ��ټ����÷���֪��һ�¾�����

### 2.5 @Value
���ǿ���ʹ�� @Value ������ֵע�� bean�� ���빹�캯����setter ���ֶ�ע����ݡ�

��Ҳ�Ƿǳ����õ�һ��ע�⣬��Ϊ���Ǻܶ�ʱ����Ҫ��application.properties�������������ļ�������ȡ��������ֵ��

**������ע��**
````
Engine(@Value("8") int cylinderCount) {
this.cylinderCount = cylinderCount;
}
````

**setterע��**

````
@Autowired
void setCylinderCount(@Value("8") int cylinderCount) {
this.cylinderCount = cylinderCount;
}
````

����:
````

@Value("8")
void setCylinderCount(int cylinderCount) {
this.cylinderCount = cylinderCount;
}
````

**����ע��**
````
@Value("8")
int cylinderCount;
````

��Ȼ��ע�뾲ֵ̬��û���õġ� ��ˣ����ǿ����� @Value ��ʹ��ռλ���ַ������������ⲿԴ�ж����ֵ�������� .properties �� .yaml �ļ��С�
````

engine.fuelType=petrol
````

���ǿ���ͨ�����·�ʽע�� engine.fuelType ��ֵ��

````
@Value("${engine.fuelType}")
String fuelType;
````

������������ʹ�� SpEL ��ʹ��@Value�� ����߼�ʾ�����������ǹ���@Value ���������ҵ���

### 2.6 @DependsOn
���ǿ���ʹ�ô�ע���� Spring ��ע��� bean ֮ǰ��ʼ������ bean�� ͨ��������Ϊ���Զ��ģ����� bean ֮�����ʽ������ϵ��

����ֻ������������ʽ��ʱ�����Ҫ���ע�⣬����JDBC�������ػ��߾�̬������ʼ����

���ǿ�����ָ������ bean ���Ƶ���������ʹ�� @DependsOn�� ע�͵�ֵ������Ҫһ���������� bean ���Ƶ����飺

````
@DependsOn("engine")
class Car implements Vehicle {}
````
Alternatively, if we define a bean with the @Bean annotation, the factory method should be annotated with @DependsOn:
````
@Bean
@DependsOn("fuel")
Engine engine() {
return new Engine();
}
````
### 2.7 @Lazy
������������س�ʼ�����ǵ� bean ʱ������ʹ�� @Lazy�� Ĭ������£�Spring ��Ӧ�ó��������ĵ�����/����ʱ���еش������е��� bean��

���ǣ���Щ�����������Ҫ������ʱ���� bean����������Ӧ�ó�������ʱ������

���ע�����Ϊ��������Ƿ�������ȷ��λ�ö�������ͬ�� ���ǿ��԰������ڣ�

һ�� @Bean ע�͵� bean �������������ӳٷ������ã���˴��� bean��
@Configuration ������а�����@Bean ���������ܵ�Ӱ��

һ�� @Component �࣬������ @Configuration �࣬��� bean �����ӳٳ�ʼ��

@Autowired ���캯����setter ���ֶΣ������ӳټ����������ͨ������

````
@Configuration
@Lazy
class VehicleFactoryConfig {

    @Bean
    @Lazy(false)
    Engine engine() {
        return new Engine();
    }
}
````
��ͬ������һ�����õ�ע�⡣

������ά��һ���д���bean����Ŀʱ���ᷢ���кܶ�bean���ܶ��ǰ���ʹ�õģ���һ����Ҫ��������ʼ��ʱ�ͽ��г�ʼ��������԰����ǽ�ʡ�ܶ�ʱ������ܡ�


### 2.8 @Lookup
ͬ����һ���Ƚ����õ���ע��

@Lookup ����� Spring �����ǵ�����ʱ���ط����������͵�ʵ����

�����ϣ�Spring ���������Ǵ�ע�͵ķ�����ʹ�����Ƿ����ķ������ͺͲ�����Ϊ BeanFactory#getBean �Ĳ�����

@Lookup �����ڣ�

��ԭ�� bean ע�������Լ���bean�������� Provider��

����������ɾ���ӵ��һ��ԭ�� Spring bean����ô���Ǽ����������������������⣺

���ǵĵ��� Spring bean ����η�����Щԭ�� Spring bean��

���ڣ�Provider �϶���һ�ַ�ʽ������ @Lookup ��ĳЩ�������ͨ�á�

Ҫע����ǣ�springĬ��ʹ�õĵ���bean�������������Ҫע��ԭ��bean�����ǲ���Ҫ�������Ķ��⹤��

���ȣ������Ǵ���һ��ԭ�� bean���Ժ����ǽ���ע�뵽���� bean �У�
````
@Component
@Scope("prototype")
public class SchoolNotification {
// ... prototype-scoped state
}
````
ʹ��@Lookup�����ǿ���ͨ������ bean ��ȡ SchoolNotification ��ʵ����

````
@Component
public class StudentServices {

    // ... member variables, etc.

    @Lookup
    public SchoolNotification getNotification() {
        return null;
    }

    // ... getters and setters
}
````
Using @Lookup, we can get an instance of SchoolNotification through our singleton bean:
````
@Test
public void whenLookupMethodCalled_thenNewInstanceReturned() {
// ... initialize context
StudentServices first = this.context.getBean(StudentServices.class);
StudentServices second = this.context.getBean(StudentServices.class);

    assertEquals(first, second); 
    assertNotEquals(first.getNotification(), second.getNotification()); 
}
````
��ע�⣬�� StudentServices �У����ǽ� getNotification ��������Ϊ�����

������Ϊ Spring ͨ������ beanFactory.getBean(StudentNotification.class) �����˸÷�����������ǿ��Խ������ա�


### 2.9 @Primary
��ʱ������Ҫ��������ͬ���͵�bean�� ����Щ����£�ע�뽫���ɹ�����Ϊ Spring ��֪��������Ҫ�ĸ� bean��

�����Ѿ������˴������������ѡ���@Qualifier ������н��ߵ㲢ָ������ bean �����ơ�

Ȼ���������ʱ��������Ҫһ���ض��� bean��������Ҫ���� bean��

���ǿ���ʹ��@Primary ����������������������@Primary �����õ�bean��������unqualified��ע����ϱ�ѡ��

````
@Component
@Primary
class Car implements Vehicle {}

@Component
class Bike implements Vehicle {}

@Component
class Driver {
@Autowired
Vehicle vehicle;
}

@Component
class Biker {
@Autowired
@Qualifier("bike")
Vehicle vehicle;
}
````
��ǰ���ʾ���У���������Ҫ������ ��ˣ��� Driver ���У�Spring ע����һ�� Car bean�� ��Ȼ���� Biker bean �У��ֶ� vehicle ��ֵ����һ�� Bike ������Ϊ����qualified�ġ�

### 2.10 @Scope

����ͨ����Ӧ����˵������bean��scopeĬ�϶��ǵ����ģ���ʵ����spring bean����֧�ֶ��ֶ��������÷�Χ���������Ų�ͬ���������ڡ�

����ʹ��@Scope ������@Component ���@Bean ����ķ�Χ�� �������ǵ�����ԭ�͡����󡢻Ự��globalSession ��һЩ�Զ��巶Χ��

��Ӧ��ö��ֵΪ
````
singleton
prototype
request
session
application
websocket
````

����
````
@Component
@Scope("prototype")
class Engine {}
````
���ǿ�������һЩ����������request��session��websocket�����������bean��ͨ��Ӧ���Ǻ�����������صģ������ô洢�û���Ϣ��session֮���bean��

������ôʹ�ã���Ҫ������ľ��峡����ѡ���ˣ������һ���ܴ�Ļ��⣬������Ȳ�չ���ˣ��Ժ�����ڵ�����������������ܡ�

## 3 ����������ע��
���ǿ���ʹ�ñ�����������ע��������Ӧ�ó��������ġ�


### 3.1 @Profile

�������ϣ�� Spring �����ض������ļ����ڻ״̬ʱʹ��@Component ���@Bean ���������ǿ���ʹ��@Profile ������б�ǡ�

���ǿ���ʹ��ע�͵�ֵ�������������ļ������ƣ�

����ͨ�����ע�������ò�ͬ���������á�
���������������

````
public interface DatasourceConfig {
public void setup();
}
````

�����ǿ������������ã�

````
@Component
@Profile("dev")
public class DevDatasourceConfig implements DatasourceConfig {
@Override
public void setup() {
System.out.println("Setting up datasource for DEV environment. ");
}
}
````
�������������������ã�

````
@Component
@Profile("production")
public class ProductionDatasourceConfig implements DatasourceConfig {
@Override
public void setup() {
System.out.println("Setting up datasource for PRODUCTION environment. ");
}
}
````
��Ȼ����Ҳ����ʹ��xml�����������͵������ļ��������������bean

xml
````
<beans profile="local">
    <bean id="localDatasourceConfig" 
      class="org.test.profiles.LocalDatasourceConfig" />
</beans>
````
### 3.2 @Import

���ǿ���ʹ���ض��� @Configuration �࣬������ʹ�ô�ע��������ɨ�衣 ���ǿ���Ϊ��Щ���ṩ@Import ��ֵ����

������˵�����Ҫ�õ�@Configurationע���bean����ôspringӦ�ñ���Ҫɨ�赽��Ŀ¼�����ǡ��û�жԸ�·������ɨ�裬��������ֻ����ʹ��·���µĵ��������࣬��ô���ǾͿ���ʹ��@Import����������������ˡ�

���ע�⻹�Ƿǳ����õģ���һ�������������

````
@Import(VehiclePartSupplier.class)
class VehicleFactoryConfig {}

@Configuration
class VehiclePartSupplier{
}
````

### 3.3 @ImportResource

����˵��������һ�� bean.xml �������ļ�����Ҫ���� beans.xml �ж���� bean���� �����뵽 Spring Boot �����������У�����β����أ�

1.Spring ��ʽ�������ļ� bean.xml �˴����ٸ�ʾ��������˵ xml ��������һ�� helloService��������ʾ
````
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!--�� HelloService ��xml�ķ�ʽ,ע�뵽������-->
    <bean id="helloService" class="com.demo.springboot.service.HelloService"></bean>
</beans>
````
2.ʹ��@ImportResourceע�⣬���� xml ����
````
/**
 * Spring Boot����û��Spring�������ļ��������Լ���д�������ļ���Ҳ�����Զ�ʶ��
 * �������Spring�������ļ���Ч�����ص�Spring ����������
 * ʹ��@ImportResourceע�⣬�����ע��һ����������(�˴�������������)
 */
@SpringBootApplication
@ImportResource(locations = {"classpath:beans.xml"})
public class BootApplication {

    public static void main(String[] args) {
        // SpringӦ����������         
        SpringApplication.run(BootApplication.class,args);

    }
}

````
### 3.4 @PropertySource
ͨ�����ע�⣬���ǿ���ΪӦ�ó������ö��������ļ���

@PropertySource ע���ṩ��һ�ַ���������Ի��ƣ����ڽ� PropertySource ��ӵ� Spring �� Environment �У��� @Configuration ��һ��ʹ�á�

�����ʹ�� @Value ȥ���ö�������ԣ����磺@Value("testbean.name")��Ҳ����ָ��Ĭ��ֵ���磺@Value("testbean.name:defaultValue")��

�÷�ʾ��

����һ�������ļ�app.properties
````
testbean.name=myTestBean
````
���� @Configuration ��ʹ�� @PropertySource �� app.properties ���ø� Environment �� PropertySources ���ϡ�
````
@Configuration
@PropertySource("classpath:/com/myco/app.properties")
public class AppConfig {

    @Autowired
    Environment env;
 
    @Bean
    public TestBean testBean() {
        TestBean testBean = new TestBean();
        testBean.setName(env.getProperty("testbean.name"));
        return testBean;
    }
}
````

ע�⣺ʹ�� @Autowired �� Environment ����ע�뵽�������У�Ȼ���� testBean() ������ʹ�á�
���������У����� testBean.getName() ���������ء�myTestBean���ַ�����

@PropertySource ������ Java 8 ���ظ�ע�����ԣ�����ζ�����ǿ���������α��һ���ࣺ

````
@Configuration
@PropertySource("classpath:/annotations.properties")
@PropertySource("classpath:/vehicle-factory.properties")
class VehicleFactoryConfig {}
````

### 3.5 @PropertySources
�÷�ͬ�ϣ�ֻ��������һ�����ǿ���ʹ�����ע��ָ�����@PropertySource ���ã�
````
@Configuration
@PropertySources({
@PropertySource("classpath:/annotations.properties"),
@PropertySource("classpath:/vehicle-factory.properties")
})
class VehicleFactoryConfig {}
````
��ע�⣬�� Java 8 ���������ǿ���ͨ�������ظ�ע�͹���ʵ����ͬ�Ĺ��ܡ�

## 4.����

�ڱ����У����ǿ���������� Spring ����ע�͵ĸ����� ���ǿ������������ bean ���Ӻ�Ӧ�������ģ��Լ����Ϊ���ɨ�����ࡣ

spring��ϵ�еĳ���ע�⻹�кܶ࣬һƪ���²�����ȫ�����ǣ�������©����ӭ���䡣

# Spring Beanע��

## 1 ����
�ڱ��̳��У����ǽ��������ڶ��岻ͬ���� bean ������� Spring bean ע�͡�

�м��ַ��������� Spring ���������� bean�� ���ȣ����ǿ���ʹ�� XML �����������ǡ� ���ǻ���������������ʹ��@Bean ע�������� bean��

������ǿ���ʹ�� org.springframework.stereotype ���е�ע��֮һ����Ǹ��࣬�������ಿ���������ɨ�衣

## 2 @ComponentScan
�������Ǿ�����ʹ�õ�һ��ע�⣬�����ǵ�Ӧ���У���ʱ��һ����ɨ�����еİ����ر��ǵ�����Ҫɨ���ⲿjar���е�beanʱ�����ǳ����á�

�����Լ���SpringBootApplication�ϣ�Ҳ���Լ���@configurationע���ϵ���������

������������ɨ�裬Spring �����Զ�ɨ����е� bean��

@ComponentScan ����ʹ��ע������ɨ����Щ�����ࡣ

���ǿ���ֱ��ʹ�� basePackages �� value ����֮һָ�����������ƣ�value �� basePackages �ı�����

````
@Configuration
@ComponentScan(basePackages = "com.baeldung.annotations")
class VehicleFactoryConfig {}
````
���⣬���ǿ���ʹ�� basePackageClasses ����ָ��������е��ࣺ

````
@Configuration
@ComponentScan(basePackageClasses = VehicleFactoryConfig.class)
class VehicleFactoryConfig {}
````

�����������������飬������ǿ���Ϊÿ�������ṩ�������

���δָ����������ɨ�跢���ڴ��� @ComponentScan ע�����ͬһ���С�

@ComponentScan ������ Java 8 ���ظ�ע�����ԣ�����ζ�����ǿ���������α��һ���ࣺ

````
@Configuration
@ComponentScan(basePackages = "com.baeldung.annotations")
@ComponentScan(basePackageClasses = VehicleFactoryConfig.class)
class VehicleFactoryConfig {}
````

���ߣ����ǿ���ʹ�� @ComponentScans ָ����� @ComponentScan ���ã�

````
@Configuration
@ComponentScans({
@ComponentScan(basePackages = "com.baeldung.annotations"),
@ComponentScan(basePackageClasses = VehicleFactoryConfig.class)
})
````
````
class VehicleFactoryConfig {
}
````
ʹ�� XML ����ʱ���������ɨ��ͬ���򵥣�

````
<context:component-scan base-package="com.baeldung"/>
````

### 3 @Component

@Component ���༶���ע�⡣ �����ɨ���ڼ䣬Spring Framework ���Զ����ʹ��@Component ע����ࣺ
````
@Component
class CarUtility {
// ...
}
````

Ĭ������£������ bean ʵ��������ͬ��������ĸСд�� ���⣬���ǿ���ʹ�ô�ע�͵Ŀ�ѡֵ����ָ����ͬ�����ơ�

����@Repository��@Service��@Configuration ��@Controller ���Ǵ���@Component ��ע�⣬���ǹ�����ͬ��bean ������Ϊ��

Spring ���������ɨ��������Զ�������ǡ�

ͨ����˵�����ǻ���mvcӦ�������ǻ��õ���������ע�⣬�������ڷ�webӦ���и���ؿ���ʹ��@component��ע��bean

### 4 @Repository

DAO or Repository classes usually represent the database access layer in an application, and should be annotated with @Repository:
````
@Repository
class VehicleRepository {
// ...
}
````
ʹ�ô�ע�͵�һ���ŵ������������Զ��־����쳣ת���� ��ʹ�ó־��Կ�ܣ��� Hibernate��ʱ����ʹ�� @Repository ע�͵������׳��ı����쳣���Զ�ת��Ϊ Spring �� DataAccessExeption �����ࡣ

Ҫ�����쳣ת����������Ҫ���������Լ��� PersistenceExceptionTranslationPostProcessor bean��
````
@Bean
public PersistenceExceptionTranslationPostProcessor exceptionTranslation() {
return new PersistenceExceptionTranslationPostProcessor();
}
````
��ע�⣬�ڴ��������£�Spring ���Զ�ִ���������衣

����ͨ�� XML ���ã�
````
<bean class=
"org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor"/>
````

### 5 @Service
Ӧ�ó����ҵ���߼�ͨ��פ���ڷ�����У�������ǽ�ʹ��@Service ע����ָʾһ�������ڸò㣺

````
@Service
public class VehicleService {
// ...    
}
````
### 6 @Controller
@Controller ��һ���༶���ע�⣬������ Spring Framework �������Ϊ Spring MVC �еĿ�������

spring���@Controller ע���bean���ܶ����飬�����������ǻ���SpringMVC��ص�����������

````
@Controller
public class VehicleController {
// ...
}

````
## 7 @Configuration

��������԰�����@Bean ע�͵� bean ���巽����
````
@Configuration
class VehicleFactoryConfig {

    @Bean
    Engine engine() {
        return new Engine();
    }

}
````
## 8 AOPע��
������ʹ�� Spring ������ע��ʱ�������״���һ������㣬������������о����ض������͵���ΪĿ�ꡣ

���磬������������� DAO �㷽����ִ��ʱ�䡣 ���ǽ��������·��棨ʹ�� AspectJ ע�ͣ������� @Repository �����ͣ�

```
@Aspect
@Component
public class PerformanceAspect {
@Pointcut("within(@org.springframework.stereotype.Repository *)")
public void repositoryClassMethods() {};

    @Around("repositoryClassMethods()")
    public Object measureMethodExecutionTime(ProceedingJoinPoint joinPoint) 
      throws Throwable {
        long start = System.nanoTime();
        Object returnValue = joinPoint.proceed();
        long end = System.nanoTime();
        String methodName = joinPoint.getSignature().getName();
        System.out.println(
          "Execution of " + methodName + " took " + 
          TimeUnit.NANOSECONDS.toMillis(end - start) + " ms");
        return returnValue;
    }
}
````

�ڴ�ʾ���У����Ǵ�����һ������㣬�������ƥ��ʹ��@Repository ע�͵����е����з����� Ȼ������ʹ��@Around ֪ͨ����λ�Ǹ�����㣬��ȷ�����ط������õ�ִ��ʱ�䡣

���⣬ʹ�����ַ��������ǿ���Ϊÿ��Ӧ�ó���������־��¼�����ܹ�����ƺ�������Ϊ��

��Ȼ�ˣ�aspectJ�����ע�⻹�ܶ࣬���������������棬δ������Ҳ�ᵥ��д�Ľ��ܡ�

## 9 ����

�ڱ����У����Ǽ���� Spring ������ע�Ͳ����������Ǹ��Դ�����������͡�

���ǻ�ѧϰ�����ʹ�����ɨ����������������������ҵ���ע�͵��ࡣ

��������˽�����Щע����ε��¸ɾ����ֲ������Լ�Ӧ�ó����ע��֮��ķ��롣 ���ǻ�ʹ���ø�С����Ϊ���ǲ�����Ҫ�ֶ���ʽ���� bean��
# SpringMVCע��
## 1. ����
�ڱ��̳��У����ǽ�̽�� org.springframework.web.bind.annotation ���е� Spring Web ע�͡�

## 2. @RequestMapping

�򵥵�˵��@RequestMapping ���@Controller ���ڲ�����������򷽷��� ������ʹ�����ã�

·����������������ƺ�ֵ������ӳ�䵽�ĸ� URL
���������ݵ� HTTP ����
params������ HTTP �����Ĵ��ڡ������ڻ�ֵ��������
headers������ HTTP ��ͷ�Ĵ��ڡ������ڻ�ֵ��������
���ģ��÷��������� HTTP ����������������Щý������
produces���÷��������� HTTP ��Ӧ������������Щý������
����һ���򵥵�ʾ����

````
@Controller
class VehicleController {

    @RequestMapping(value = "/vehicles/home", method = RequestMethod.GET)
    String home() {
        return "home";
    }
}
````
����������༶��Ӧ�ô�ע�ͣ����ǿ���Ϊ @Controller ���е����д�����򷽷��ṩĬ�����á� Ψһ�������� Spring ����ʹ�÷����������ø��ǵ��ḽ������·�����ֵ� URL��

���磬��������ú������Ч����һ���ģ�

````
@Controller
@RequestMapping(value = "/vehicles", method = RequestMethod.GET)
class VehicleController {

    @RequestMapping("/home")
    String home() {
        return "home";
    }
}
````

���⣬@GetMapping��@PostMapping��@PutMapping��@DeleteMapping ��@PatchMapping ��@RequestMapping �Ĳ�ͬ���壬��HTTP �����ѷֱ�����ΪGET��POST��PUT��DELETE ��PATCH��

��Щ�� Spring 4.3 �汾��ʼ���á�

## 3 @RequestBody

�����Ǽ���@RequestBody�������� HTTP ���������ӳ�䵽һ������

````
@PostMapping("/save")
void saveVehicle(@RequestBody Vehicle vehicle) {
// ...
}
````
�����л����Զ��ģ�ȡ����������������͡�

## 4 @PathVariable
������˵˵@PathVariable��

��ע��ָʾ���������󶨵� URI ģ������� ���ǿ���ʹ�� @RequestMapping ע��ָ�� URI ģ�壬��ʹ�� @PathVariable �����������󶨵�ģ�岿��֮һ��

���ǿ���ʹ�����ƻ����������ֵ������ʵ����һ�㣺

````
@RequestMapping("/{id}")
Vehicle getVehicle(@PathVariable("id") long id) {
// ...
}
````
���ģ���в��ֵ������뷽��������������ƥ�䣬���ǾͲ�����ע����ָ������

````
@RequestMapping("/{id}")
Vehicle getVehicle(@PathVariable long id) {
// ...
}
````
���⣬���ǿ���ͨ��������Ĳ�������Ϊ false ����·���������Ϊ��ѡ��

````
@RequestMapping("/{id}")
Vehicle getVehicle(@PathVariable(required = false) long id) {
// ...
}
````
## 5. @RequestParam
We use @RequestParam for accessing HTTP request parameters:
````
@RequestMapping
Vehicle getVehicleByParam(@RequestParam("id") long id) {
// ...
}
````
�������� @PathVariable ע����ͬ������ѡ�

������Щ����֮�⣬�� Spring �������з���û��ֵ��Ϊ��ֵʱ�����ǿ���ʹ�� @RequestParam ָ��ע��ֵ�� Ϊ�ˣ����Ǳ������� defaultValue ������

�ṩĬ��ֵ��ʽ���� required Ϊ false��
````
@RequestMapping("/buy")
Car buyCar(@RequestParam(defaultValue = "5") int seatCount) {
// ...
}
````
���˲���֮�⣬���ǻ����Է������� HTTP ���󲿷֣�cookie �ͱ�ͷ��

���ǿ��Էֱ�ʹ��ע��@CookieValue ��@RequestHeader ���������ǡ�


## 6. Response Handling Annotations
�ڽ������Ĳ����У����ǽ������� Spring MVC �в��� HTTP ��Ӧ�����ע�͡�

### 6.1 @ResponseBody
���������@ResponseBody �����������򷽷���Spring �Ὣ�����Ľ����Ϊ��Ӧ����

````
@ResponseBody
@RequestMapping("/hello")
String hello() {
return "Hello World!";
}
````
������������ע����ע�� @Controller �࣬������������򷽷�����ʹ������

### 6.2 @ExceptionHandler

ʹ�ô�ע�ͣ����ǿ�������һ���Զ����������򷽷��� ����������򷽷��׳��κ�ָ�����쳣ʱ��Spring ���ô˷�����

������쳣������Ϊ�������ݸ�������
````
@ExceptionHandler(IllegalArgumentException.class)
void onIllegalArgumentException(IllegalArgumentException exception) {
// ...
}
````

### 6.3 @ResponseStatus
�������ʹ�ô�ע�Ͷ���������򷽷�����ע�ͣ������ָ����Ӧ������ HTTP ״̬�� ���ǿ���ʹ�� code ����������� value ����������״̬���롣

���⣬���ǿ���ʹ�� reason �����ṩԭ��

����Ҳ���Խ�����@ExceptionHandler һ��ʹ�ã�

@ExceptionHandler(IllegalArgumentException.class)
@ResponseStatus(HttpStatus.BAD_REQUEST)
void onIllegalArgumentException(IllegalArgumentException exception) {
// ...
}

�й� HTTP ��Ӧ״̬�ĸ�����Ϣ������ʱ��ġ�

## 7 ���� Webע��
һЩע�Ͳ�ֱ�ӹ��� HTTP �������Ӧ�� �ڽ������Ĳ����У����ǽ���������ġ�

### 7.1 @Controller
���ǿ���ʹ��@Controller ����һ��Spring MVC �������� �йظ�����Ϣ����������ǹ��� Spring Bean Annotations �����¡�

### 7.2 @RestController
@RestController �����@Controller ��@ResponseBody��

��ˣ����������ǵ�Ч�ģ�

````
@Controller
@ResponseBody
class VehicleRestController {
// ...
}
````

````
@RestController
class VehicleRestController {
// ...
}
````
### 7.3 @ModelAttribute
ͨ�����ע�⣬���ǿ���ͨ���ṩģ�ͼ��������Ѿ������� MVC @Controller ģ���е�Ԫ�أ�

````
@PostMapping("/assemble")
void assembleVehicle(@ModelAttribute("vehicle") Vehicle vehicleInModel) {
// ...
}
````
��@PathVariable ��@RequestParam һ�����������������ͬ�����ƣ����ǲ���ָ��ģ�ͼ���

````
@PostMapping("/assemble")
void assembleVehicle(@ModelAttribute Vehicle vehicle) {
// ...
}
````
���⣬@ModelAttribute����һ����;�������������ע��һ��������Spring���Զ��������ķ���ֵ��ӵ�ģ���У�

````
@ModelAttribute("vehicle")
Vehicle getVehicle() {
// ...
}
````
����ǰһ�������ǲ���ָ��ģ�ͼ���Spring Ĭ��ʹ�÷��������ƣ�
````
@ModelAttribute
Vehicle vehicle() {
// ...
}
````
�� Spring ������������򷽷�֮ǰ����������������� @ModelAttribute ע�͵ķ�����

�й� @ModelAttribute �ĸ�����Ϣ������ı��ġ�

### 7.4 @CrossOrigin
@CrossOrigin Ϊ��ע�͵���������򷽷����ÿ���ͨ�ţ�

````
@CrossOrigin
@RequestMapping("/hello")
String hello() {
return "Hello World!";
}
````
��������������һ���࣬�����������е�������������򷽷���

���ǿ���ʹ�ô�ע�͵Ĳ���΢�� CORS ��Ϊ��

�й���ϸ��Ϣ������ʱ��ġ�

# SpringBootע��
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

# �ο�����
https://www.baeldung.com/spring-annotations
