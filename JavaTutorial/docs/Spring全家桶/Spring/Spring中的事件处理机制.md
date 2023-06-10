



# Spring �е��¼�����



2022-05-16 15:29 ����









## Spring �е��¼�����

���Ѿ��������������½��� Spring �ĺ����� **ApplicationContext**����������� beans �������������ڡ������� beans ʱ��ApplicationContext ����ĳЩ���͵��¼������磬������������ʱ��ContextStartedEvent ��������������ֹͣʱ��ContextStoppedEvent ������

ͨ�� ApplicationEvent ��� ApplicationListener �ӿ����ṩ�� ApplicationContext �д����¼������һ�� bean ʵ�� ApplicationListener����ôÿ�� ApplicationEvent �������� ApplicationContext �ϣ��Ǹ� bean �ᱻ֪ͨ��

Spring �ṩ�����µı�׼�¼���

| ��� | Spring �����¼� & ���� |
| --- | --- |
| 1 | **ContextRefreshedEvent**ApplicationContext ����ʼ����ˢ��ʱ�����¼�����������Ҳ������ ConfigurableApplicationContext �ӿ���ʹ�� refresh() ������������ |
| 2 | **ContextStartedEvent**��ʹ�� ConfigurableApplicationContext �ӿ��е� start() �������� ApplicationContext ʱ�����¼�������������Ե���������ݿ⣬����������ڽ��ܵ�����¼��������κ�ֹͣ��Ӧ�ó��� |
| 3 | **ContextStoppedEvent**��ʹ�� ConfigurableApplicationContext �ӿ��е� stop() ����ֹͣ ApplicationContext ʱ����������¼���������ڽ��ܵ�����¼�������Ҫ������Ĺ����� |
| 4 | **ContextClosedEvent**��ʹ�� ConfigurableApplicationContext �ӿ��е� close() �����ر� ApplicationContext ʱ�����¼���������һ���ѹرյ������ĵ�����������ĩ�ˣ������ܱ�ˢ�»������� |
| 5 | **RequestHandledEvent**����һ�� web-specific �¼����������� bean HTTP �����Ѿ������� |

���� Spring ���¼������ǵ��̵߳ģ��������һ���¼���������ֱ�����ҳ������еĽ����ߵõ��ĸ���Ϣ���ý��̱������������̽������������ˣ�����¼�����ʹ�ã������Ӧ�ó���ʱӦע�⡣

## �����������¼�

Ϊ�˼����������¼���һ�� bean Ӧ��ʵ��ֻ��һ������ **onApplicationEvent()** �� ApplicationListener �ӿڡ���ˣ�����дһ�������������¼�����δ����ģ��Լ���ο����ô�����ִ�л���ĳЩ�¼����������

��������ǡ����λ��ʹ�� Eclipse IDE��Ȼ��������Ĳ���������һ�� Spring Ӧ�ó���

| ���� | ���� |
| --- | --- |
| 1 | ����һ������Ϊ SpringExample ����Ŀ�������ڴ�����Ŀ�� **src** �ļ����д���һ���� com.tutorialspoint�� |
| 2 | ʹ�� Add External JARs ѡ��������� Spring �⣬���ͼ� Spring Hello World Example �½ڡ� |
| 3 | �� com.tutorialspoint ���д��� Java �� HelloWorld��CStartEventHandler��CStopEventHandler �� MainApp�� |
| 4 | �� **src** �ļ����д��� Bean �������ļ� Beans.xml�� |
| 5 | ���һ���Ǵ��������� Java �ļ��� Bean �����ļ������ݣ�������Ӧ�ó��򣬽���������ʾ�� |

������ **HelloWorld.java** �ļ������ݣ�

```
package com.tutorialspoint;
public class HelloWorld {
   private String message;
   public void setMessage(String message){
      this.message  = message;
   }
   public void getMessage(){
      System.out.println("Your Message : " + message);
   }
}
```

������ **CStartEventHandler.java** �ļ������ݣ�

```
package com.tutorialspoint;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextStartedEvent;
public class CStartEventHandler 
   implements ApplicationListener<ContextStartedEvent>{
   public void onApplicationEvent(ContextStartedEvent event) {
      System.out.println("ContextStartedEvent Received");
   }
}
```

������ **CStopEventHandler.java** �ļ������ݣ�

```
package com.tutorialspoint;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextStoppedEvent;
public class CStopEventHandler 
   implements ApplicationListener<ContextStoppedEvent>{
   public void onApplicationEvent(ContextStoppedEvent event) {
      System.out.println("ContextStoppedEvent Received");
   }
}
```

������ **MainApp.java** �ļ������ݣ�

```
package com.tutorialspoint;

import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class MainApp {
   public static void main(String[] args) {
      ConfigurableApplicationContext context = 
      new ClassPathXmlApplicationContext("Beans.xml");

      // Let us raise a start event.
      context.start();

      HelloWorld obj = (HelloWorld) context.getBean("helloWorld");

      obj.getMessage();

      // Let us raise a stop event.
      context.stop();
   }
}
```

�����������ļ� **Beans.xml** �ļ���

```
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">

   <bean id="helloWorld" class="com.tutorialspoint.HelloWorld">
      <property name="message" value="Hello World!"/>
   </bean>

   <bean id="cStartEventHandler" 
         class="com.tutorialspoint.CStartEventHandler"/>

   <bean id="cStopEventHandler" 
         class="com.tutorialspoint.CStopEventHandler"/>

</beans>
```

һ��������˴���Դ�� bean �������ļ������ǾͿ������и�Ӧ�ó���������Ӧ�ó���һ�ж������������������Ϣ��

```
ContextStartedEvent Received
Your Message : Hello World!
ContextStoppedEvent Received
```







## Spring �е��Զ����¼�

��д�ͷ����Լ����Զ����¼�����ಽ�衣��������һ�¸�����˵������д�������ʹ����Զ��� Spring �¼���

| ���� | ���� |
| --- | --- |
| 1 | ����һ������Ϊ SpringExample ����Ŀ�������ڴ�����Ŀ�� **src** �ļ����д���һ���� com.tutorialspoint�� |
| 2 | ʹ�� Add External JARs ѡ��������� Spring �⣬���ͼ� Spring Hello World Example �½ڡ� |
| 3 | ͨ����չ **ApplicationEvent**,����һ���¼��� CustomEvent���������붨��һ��Ĭ�ϵĹ��캯������Ӧ�ô� ApplicationEvent ���м̳еĹ��캯���� |
| 4 | һ�������¼��࣬����Դ��κ����з��������ٶ� EventClassPublisher ʵ���� ApplicationEventPublisherAware���㻹��Ҫ�� XML �����ļ��������������Ϊһ�� bean��֮������������ʶ�� bean ��Ϊ�¼������ߣ�����Ϊ��ʵ���� ApplicationEventPublisherAware �ӿڡ� |
| 5 | �������¼�������һ�����б������ٶ� EventClassHandler ʵ���� ApplicationListener �ӿڣ�����ʵ�����Զ����¼��� onApplicationEvent ������ |
| 6 | �� **src** �ļ����д��� bean �������ļ� Beans.xml �� MainApp �࣬��������Ϊһ�� Spring Ӧ�ó��������С� |
| 7 | ���һ���Ǵ��������� Java �ļ��� Bean �����ļ������ݣ�������Ӧ�ó��򣬽���������ʾ�� |

����� **CustomEvent.java** �ļ������ݣ�

```
package com.tutorialspoint;
import org.springframework.context.ApplicationEvent;
public class CustomEvent extends ApplicationEvent{ 
   public CustomEvent(Object source) {
      super(source);
   }
   public String toString(){
      return "My Custom Event";
   }
}

```

������ **CustomEventPublisher.java** �ļ������ݣ�

```
package com.tutorialspoint;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.ApplicationEventPublisherAware;
public class CustomEventPublisher 
   implements ApplicationEventPublisherAware {
   private ApplicationEventPublisher publisher;
   public void setApplicationEventPublisher
              (ApplicationEventPublisher publisher){
      this.publisher = publisher;
   }
   public void publish() {
      CustomEvent ce = new CustomEvent(this);
      publisher.publishEvent(ce);
   }
}
```

������ **CustomEventHandler.java** �ļ������ݣ�

```
package com.tutorialspoint;
import org.springframework.context.ApplicationListener;
public class CustomEventHandler 
   implements ApplicationListener<CustomEvent>{
   public void onApplicationEvent(CustomEvent event) {
      System.out.println(event.toString());
   }
}
```

������ **MainApp.java** �ļ������ݣ�

```
package com.tutorialspoint;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
public class MainApp {
   public static void main(String[] args) {
      ConfigurableApplicationContext context = 
      new ClassPathXmlApplicationContext("Beans.xml");    
      CustomEventPublisher cvp = 
      (CustomEventPublisher) context.getBean("customEventPublisher");
      cvp.publish();  
      cvp.publish();
   }
}
```

�����������ļ� **Beans.xml**��

```
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">

   <bean id="customEventHandler" 
      class="com.tutorialspoint.CustomEventHandler"/>

   <bean id="customEventPublisher" 
      class="com.tutorialspoint.CustomEventPublisher"/>

</beans>
```

һ��������˴���Դ�� bean �������ļ������ǾͿ������и�Ӧ�ó���������Ӧ�ó���һ�ж������������������Ϣ��

```
My Custom Event
My Custom Event
```

# �ο�����
https://www.w3cschool.cn/wkspring
https://www.runoob.com/w3cnote/basic-knowledge-summary-of-spring.html
http://codepub.cn/2015/06/21/Basic-knowledge-summary-of-Spring
https://dunwu.github.io/spring-tutorial
https://mszlu.com/java/spring
http://c.biancheng.net/spring/aop-module.html