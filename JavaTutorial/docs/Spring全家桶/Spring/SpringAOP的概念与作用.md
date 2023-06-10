# Spring ��ܵ� AOP

## Spring ��ܵ� AOP

Spring ��ܵ�һ���ؼ������**��������ı��**(AOP)��ܡ���������ı����Ҫ�ѳ����߼��ֽ�ɲ�ͬ�Ĳ��ֳ�Ϊ��ν�Ĺ�ע�㡣��һ��Ӧ�ó���Ķ����Ĺ��ܱ���Ϊ**���й�ע��**����Щ���й�ע���ڸ����϶�����Ӧ�ó����ҵ���߼�������������������и��ָ����ĺܺõ���������ӣ�����־��¼����ơ�����ʽ���񡢰�ȫ�Ժͻ���ȡ�

�� OOP �У��ؼ���Ԫģ������࣬���� AOP �е�Ԫģ��������档����ע��������Ӧ�ó�������໥����ϣ�AOP ���԰������������Ӱ��Ķ����жԺ��й�ע����AOP ���Ǳ�����ԵĴ������ Perl��.NET��Java �����������ԡ�

Spring AOP ģ���ṩ������������һ��Ӧ�ó������磬��ִ��һ������ʱ��������ڷ���ִ��֮ǰ��֮����Ӷ���Ĺ��ܡ�

## AOP ����

�����ǿ�ʼʹ�� AOP ����֮ǰ����������Ϥһ�� AOP ����������Щ���ﲢ���ض��� Spring�������� AOP �йصġ�

| �� | ���� |
| --- | --- |
| Aspect | һ��ģ�����һ���ṩ��������� APIs�����磬һ����־ģ��Ϊ�˼�¼��־���� AOP ������á�Ӧ�ó������ӵ�����������ķ��棬��ȡ�������� |
| Join point | �����Ӧ�ó�����������һ���㣬������ڲ�� AOP ���档��Ҳ��˵��������ʵ�ʵ�Ӧ�ó����У�����һ��������ʹ�� Spring AOP ��ܡ� |
| Advice | ����ʵ���ж�֮ǰ��֮��ִ�еķ����������ڳ���ִ���ڼ�ͨ�� Spring AOP ���ʵ�ʱ����õĴ��롣 |
| Pointcut | ����һ��һ���������ӵ㣬֪ͨӦ�ñ�ִ�С������ʹ�ñ��ʽ��ģʽָ��������������ǽ��� AOP �������п����ġ� |
| Introduction | ��������������·��������Ե����е����С� |
| Target object | ��һ�����߶��������֪ͨ�Ķ������������Զ��һ�����������Ҳ��Ϊ��֪ͨ���� |
| Weaving | Weaving �ѷ������ӵ�������Ӧ�ó������ͻ��߶����ϣ�������һ����֪ͨ�Ķ�����Щ�����ڱ���ʱ�������ʱ������ʱ��ɡ� |

## ֪ͨ������

Spring �������ʹ�������ᵽ������֪ͨ������

| ֪ͨ | ���� |
| --- | --- |
| ǰ��֪ͨ | ��һ������ִ��֮ǰ��ִ��֪ͨ�� |
| ����֪ͨ | ��һ������ִ��֮�󣬲�����������ִ��֪ͨ�� |
| ���غ�֪ͨ | ��һ������ִ��֮��ֻ���ڷ����ɹ����ʱ������ִ��֪ͨ�� |
| �׳��쳣��֪ͨ | ��һ������ִ��֮��ֻ���ڷ����˳��׳��쳣ʱ������ִ��֪ͨ�� |
| ����֪ͨ | �ڽ��鷽������֮ǰ��֮��ִ��֪ͨ�� |

## ʵ���Զ��巽��

Spring ֧�� **@AspectJ annotation style** �ķ�����**����ģʽ**�ķ�����ʵ���Զ��巽�档�����ַ����Ѿ������������ӽڽ�������ϸ���͡�

| ���� | ���� |
| --- | --- |
| [XML Schema based](https://www.w3cschool.cn/wkspring/omps1mm6.html) | ������ʹ�ó������Լ��������õ� XML ��ʵ�ֵġ� |
| [@AspectJ based](https://www.w3cschool.cn/wkspring/k4q21mm8.html) | @AspectJ ����һ����������ķ����Ϊ���� Java 5 ע�͵ĳ��� Java ��ע�͡� |



## Spring �л��� AOP �� XML�ܹ�

Ϊ���ڱ��ڵ�������ʹ�� aop �����ռ��ǩ������Ҫ���� spring-aop �ܹ�������������

```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xmlns:aop="http://www.springframework.org/schema/aop"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd 
    http://www.springframework.org/schema/aop 
    http://www.springframework.org/schema/aop/spring-aop-3.0.xsd ">

   <!-- bean definition & AOP specific configuration -->

</beans>

```

�㻹��Ҫ�����Ӧ�ó���� CLASSPATH ��ʹ������ AspectJ ���ļ�����Щ���ļ���һ�� AspectJ װ�õ� ��lib�� Ŀ¼���ǿ��õģ������������ Internet ���������ǡ�(ע��aspectjweaver.jar �Ѱ���������)

*   aspectjrt.jar

*   aspectjweaver.jar

*   aspectj.jar

*   aopalliance.jar

## ������һ�� aspect

һ�� **aspect** ��ʹ�� Ԫ�������ģ�֧�ֵ� bean ��ʹ�� **ref** �������õģ�������ʾ��

```

   
   ...
   

<bean id="aBean" class="...">
...
</bean>
```

�����aBean�� �������ú�����ע�룬����ǰ����½����㿴���������� Spring bean һ����

## ����һ�������

һ��**�����**������ȷ��ʹ�ò�ͬ����ִ�еĸ���Ȥ�����ӵ㣨�����������ڴ���������õ� XML �ܹ�ʱ������㽫�ᰴ��������ʾ���壺

```

   
   
   ...
   

<bean id="aBean" class="...">
...
</bean>
```

�����ʾ��������һ����Ϊ ��businessService�� ������㣬������㽫�� com.tutorialspoint ���µ� Student ���е� getName() ������ƥ�䣺

```

   
   
   ...
   

<bean id="aBean" class="...">
...
</bean>
```

## ��������

���������ʹ��Ԫ�����������������͵�֪ͨ�����£�

```

   
      
      <!-- a before advice definition -->
      
      <!-- an after advice definition -->
      
      <!-- an after-returning advice definition -->
      <!--The doRequiredTask method must have parameter named retVal -->
      
      <!-- an after-throwing advice definition -->
      <!--The doRequiredTask method must have parameter named ex -->
      
      <!-- an around advice definition -->
      
   ...
   

<bean id="aBean" class="...">
...
</bean>
```

����ԶԲ�ͬ�Ľ���ʹ����ͬ�� **doRequiredTask** ���߲�ͬ�ķ�������Щ����������Ϊ aspect ģ���һ���������塣

## ���� AOP �� XML �ܹ���ʾ��

Ϊ����������ᵽ�Ļ��� AOP �� XML �ܹ��ĸ�������Ǳ�дһ��ʾ��������ʵ�ּ������顣Ϊ�������ǵ�ʾ����ʹ�ü������飬������ʹ Eclipse IDE ���ڹ���״̬��Ȼ�������²��贴��һ�� Spring Ӧ�ó���

| ���� | ���� |
| --- | --- |
| 1 | ����һ����Ϊ _SpringExample_ ����Ŀ����������������Ŀ�� **src** �ļ����´���һ����Ϊ _com.tutorialspoint_ �İ��� |
| 2 | ʹ�� _Add External JARs_ ѡ���������� Spring ���ļ��������� _Spring Hello World Example_ �½��н��͵������� |
| 3 | ����Ŀ����� Spring AOP ָ���Ŀ��ļ� **aspectjrt.jar�� aspectjweaver.jar** �� **aspectj.jar**�� |
| 4 | �� _com.tutorialspoint_ ���´��� Java �� **Logging**�� _Student_ �� _MainApp_�� |
| 5 | �� **src** �ļ����´��� Beans �����ļ� _Beans.xml_�� |
| 6 | ���һ���Ǵ������� Java �ļ��� Bean �����ļ������ݣ����Ұ����½��͵���������Ӧ�ó��� |

������ **Logging.java** �ļ������ݡ���ʵ������ aspect ģ���һ��ʾ�������������ڸ�������õķ�����

```
package com.tutorialspoint;
public class Logging {
   /** 
    * This is the method which I would like to execute
    * before a selected method execution.
    */
   public void beforeAdvice(){
      System.out.println("Going to setup student profile.");
   }
   /** 
    * This is the method which I would like to execute
    * after a selected method execution.
    */
   public void afterAdvice(){
      System.out.println("Student profile has been setup.");
   }
   /** 
    * This is the method which I would like to execute
    * when any method returns.
    */
   public void afterReturningAdvice(Object retVal){
      System.out.println("Returning:" + retVal.toString() );
   }
   /**
    * This is the method which I would like to execute
    * if there is an exception raised.
    */
   public void AfterThrowingAdvice(IllegalArgumentException ex){
      System.out.println("There has been an exception: " + ex.toString());   
   }  
}
```

������ **Student.java** �ļ������ݣ�

```
package com.tutorialspoint;
public class Student {
   private Integer age;
   private String name;
   public void setAge(Integer age) {
      this.age = age;
   }
   public Integer getAge() {
      System.out.println("Age : " + age );
      return age;
   }
   public void setName(String name) {
      this.name = name;
   }
   public String getName() {
      System.out.println("Name : " + name );
      return name;
   }  
   public void printThrowException(){
       System.out.println("Exception raised");
       throw new IllegalArgumentException();
   }
}
```

������ **MainApp.java** �ļ������ݣ�

```
package com.tutorialspoint;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
public class MainApp {
   public static void main(String[] args) {
      ApplicationContext context = 
             new ClassPathXmlApplicationContext("Beans.xml");
      Student student = (Student) context.getBean("student");
      student.getName();
      student.getAge();      
      student.printThrowException();
   }
}
```

�����������ļ� **Beans.xml**��

```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xmlns:aop="http://www.springframework.org/schema/aop"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd 
    http://www.springframework.org/schema/aop 
    http://www.springframework.org/schema/aop/spring-aop-3.0.xsd ">

   
      
         
         
         
         
         
      
   

   <!-- Definition for student bean -->
   <bean id="student" class="com.tutorialspoint.Student">
      <property name="name"  value="Zara" />
      <property name="age"  value="11"/>      
   </bean>

   <!-- Definition for logging aspect -->
   <bean id="logging" class="com.tutorialspoint.Logging"/> 

</beans>

```

һ�����Ѿ���ɵĴ�����Դ�ļ��� bean �����ļ�������������һ��Ӧ�ó���������Ӧ�ó���һ�ж������Ļ����⽫�����������Ϣ��

```
Going to setup student profile.
Name : Zara
Student profile has been setup.
Returning:Zara
Going to setup student profile.
Age : 11
Student profile has been setup.
Returning:11
Going to setup student profile.
Exception raised
Student profile has been setup.
There has been an exception: java.lang.IllegalArgumentException
.....
other exception content
```

������������һ�����涨����� com.tutorialspoint �� ѡ�����з����� �������Ǽ���һ�£�����Ҫ��һ������ķ���֮ǰ����֮��ִ����Ľ��飬�����ͨ���滻ʹ����ʵ��ͷ������Ƶ�����㶨���е��Ǻţ�*�������������������������ִ�С�

```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xmlns:aop="http://www.springframework.org/schema/aop"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd 
    http://www.springframework.org/schema/aop 
    http://www.springframework.org/schema/aop/spring-aop-3.0.xsd ">

   
   
      
      
      
   
   

   <!-- Definition for student bean -->
   <bean id="student" class="com.tutorialspoint.Student">
      <property name="name"  value="Zara" />
      <property name="age"  value="11"/>      
   </bean>

   <!-- Definition for logging aspect -->
   <bean id="logging" class="com.tutorialspoint.Logging"/> 

</beans>

```

�������Ҫִ��ͨ����Щ����֮���ʾ��Ӧ�ó����⽫�����������Ϣ��

```
Going to setup student profile.
Name : Zara
Student profile has been setup.
Age : 11
Exception raised
.....
other exception content
```



## Spring �л��� AOP �� @AspectJ

@AspectJ ��Ϊͨ�� Java 5 ע��ע�͵���ͨ�� Java �࣬��ָ�������� aspects ��һ�ַ��ͨ������Ļ��ڼܹ��� XML �����ļ��а�������Ԫ�أ�@AspectJ ֧���ǿ��õġ�

```

```

�㻹��Ҫ�����Ӧ�ó���� CLASSPATH ��ʹ������ AspectJ ���ļ�����Щ���ļ���һ�� AspectJ װ�õ� ��lib�� Ŀ¼���ǿ��õģ����û�У�������� Internet ���������ǡ�

*   aspectjrt.jar

*   aspectjweaver.jar

*   aspectj.jar

*   aopalliance.jar

## ������һ�� aspect

Aspects ��������κ������� bean һ�����������ǽ����� @AspectJ ע��֮�⣬����������һ�������з������ֶΣ�������ʾ��

```
package org.xyz;
import org.aspectj.lang.annotation.Aspect;
@Aspect
public class AspectModule {
}
```

���ǽ��� XML �а������½������ã��ͺ������κ� bean һ����

```
<bean id="myAspect" class="org.xyz.AspectModule">
   <!-- configure properties of aspect here as normal -->
</bean>

```

## ����һ�������

һ��**�����**������ȷ��ʹ�ò�ͬ����ִ�еĸ���Ȥ�����ӵ㣨�����������ڴ���������õ� XML �ܹ�ʱ���������������������֣�

*   һ���������ʽ���������Ǹ���Ȥ���ĸ�������������ִ�С�

*   һ��������ǩ����һ�����ƺ����������Ĳ��������������������ǲ���ɵģ�����ʵ������Ӧ���ǿյġ�

�����ʾ���ж�����һ����Ϊ ��businessService�� ������㣬������㽫�� com.xyz.myapp.service ���µ����п��õ�ÿһ��������ƥ�䣺

```
import org.aspectj.lang.annotation.Pointcut;
@Pointcut("execution(* com.xyz.myapp.service.*.*(..))") // expression 
private void businessService() {}  // signature
```

�����ʾ���ж�����һ����Ϊ ��getname�� ������㣬������㽫�� com.tutorialspoint ���µ� Student ���е� getName() ������ƥ�䣺

```
import org.aspectj.lang.annotation.Pointcut;
@Pointcut("execution(* com.tutorialspoint.Student.getName(..))") 
private void getname() {}
```

## ��������

�����ʹ�� @{ADVICE-NAME} ע��������������е�����һ����������ʾ����������Ѿ�������һ��������ǩ���� businessService()��

```
@Before("businessService()")
public void doBeforeTask(){
 ...
}
@After("businessService()")
public void doAfterTask(){
 ...
}
@AfterReturning(pointcut = "businessService()", returning="retVal")
public void doAfterReturnningTask(Object retVal){
  // you can intercept retVal here.
  ...
}
@AfterThrowing(pointcut = "businessService()", throwing="ex")
public void doAfterThrowingTask(Exception ex){
  // you can intercept thrown exception here.
  ...
}
@Around("businessService()")
public void doAroundTask(){
 ...
}
```

�����Ϊ����һ�����鶨�����������������������ڽ���֮ǰ��������������һ��ʾ����

```
@Before("execution(* com.xyz.myapp.service.*.*(..))")
public doBeforeTask(){
 ...
}
```

## ���� AOP �� @AspectJ ʾ��

Ϊ����������ᵽ�Ĺ��ڻ��� AOP �� @AspectJ �ĸ�������Ǳ�дһ��ʾ��������ʵ�ּ������顣Ϊ�������ǵ�ʾ����ʹ�ü������飬������ʹ Eclipse IDE ���ڹ���״̬��Ȼ�������²��贴��һ�� Spring Ӧ�ó���

| ���� | ���� |
| --- | --- |
| 1 | ����һ����Ϊ _SpringExample_ ����Ŀ����������������Ŀ�� **src** �ļ����´���һ����Ϊ _com.tutorialspoint_ �İ��� |
| 2 | ʹ�� _Add External JARs_ ѡ���������� Spring ���ļ��������� _Spring Hello World Example_ �½��н��͵������� |
| 3 | ����Ŀ����� Spring AOP ָ���Ŀ��ļ� **aspectjrt.jar�� aspectjweaver.jar** �� **aspectj.jar**�� |
| 4 | �� _com.tutorialspoint_ ���´��� Java �� **Logging**�� _Student_ �� _MainApp_�� |
| 5 | �� **src** �ļ����´��� Beans �����ļ� _Beans.xml_�� |
| 6 | ���һ���Ǵ������� Java �ļ��� Bean �����ļ������ݣ����Ұ����½��͵���������Ӧ�ó��� |

������ **Logging.java** �ļ������ݡ���ʵ������ aspect ģ���һ��ʾ�������������ڸ�������õķ�����

```
package com.tutorialspoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Around;
@Aspect
public class Logging {
   /** Following is the definition for a pointcut to select
    *  all the methods available. So advice will be called
    *  for all the methods.
    */
   @Pointcut("execution(* com.tutorialspoint.*.*(..))")
   private void selectAll(){}
   /** 
    * This is the method which I would like to execute
    * before a selected method execution.
    */
   @Before("selectAll()")
   public void beforeAdvice(){
      System.out.println("Going to setup student profile.");
   }
   /** 
    * This is the method which I would like to execute
    * after a selected method execution.
    */
   @After("selectAll()")
   public void afterAdvice(){
      System.out.println("Student profile has been setup.");
   }
   /** 
    * This is the method which I would like to execute
    * when any method returns.
    */
   @AfterReturning(pointcut = "selectAll()", returning="retVal")
   public void afterReturningAdvice(Object retVal){
      System.out.println("Returning:" + retVal.toString() );
   }
   /**
    * This is the method which I would like to execute
    * if there is an exception raised by any method.
    */
   @AfterThrowing(pointcut = "selectAll()", throwing = "ex")
   public void AfterThrowingAdvice(IllegalArgumentException ex){
      System.out.println("There has been an exception: " + ex.toString());   
   }  
}
```

������ **Student.java** �ļ������ݣ�

```
package com.tutorialspoint;
public class Student {
   private Integer age;
   private String name;
   public void setAge(Integer age) {
      this.age = age;
   }
   public Integer getAge() {
      System.out.println("Age : " + age );
      return age;
   }
   public void setName(String name) {
      this.name = name;
   }
   public String getName() {
      System.out.println("Name : " + name );
      return name;
   }
   public void printThrowException(){
      System.out.println("Exception raised");
      throw new IllegalArgumentException();
   }
}
```

������ **MainApp.java** �ļ������ݣ�

```
package com.tutorialspoint;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
public class MainApp {
   public static void main(String[] args) {
      ApplicationContext context = 
             new ClassPathXmlApplicationContext("Beans.xml");
      Student student = (Student) context.getBean("student");
      student.getName();
      student.getAge();     
      student.printThrowException();
   }
}
```

�����������ļ� **Beans.xml**��

```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xmlns:aop="http://www.springframework.org/schema/aop"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd 
    http://www.springframework.org/schema/aop 
    http://www.springframework.org/schema/aop/spring-aop-3.0.xsd ">

    

   <!-- Definition for student bean -->
   <bean id="student" class="com.tutorialspoint.Student">
      <property name="name"  value="Zara" />
      <property name="age"  value="11"/>      
   </bean>

   <!-- Definition for logging aspect -->
   <bean id="logging" class="com.tutorialspoint.Logging"/> 

</beans>

```

һ�����Ѿ���ɵĴ�����Դ�ļ��� bean �����ļ�������������һ��Ӧ�ó���������Ӧ�ó���һ�ж������Ļ����⽫�����������Ϣ��

```
Going to setup student profile.
Name : Zara
Student profile has been setup.
Returning:Zara
Going to setup student profile.
Age : 11
Student profile has been setup.
Returning:11
Going to setup student profile.
Exception raised
Student profile has been setup.
There has been an exception: java.lang.IllegalArgumentException
.....
other exception content
```





# �ο�����
https://www.w3cschool.cn/wkspring
https://www.runoob.com/w3cnote/basic-knowledge-summary-of-spring.html
http://codepub.cn/2015/06/21/Basic-knowledge-summary-of-Spring
https://dunwu.github.io/spring-tutorial
https://mszlu.com/java/spring
http://c.biancheng.net/spring/aop-module.html