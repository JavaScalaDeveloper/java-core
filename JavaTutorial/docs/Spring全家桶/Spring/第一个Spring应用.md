## �������
�������ǿ����Ȱ� Spring ���� Jar ���Լ� Commons-loggin ���뵽��Ŀ�У��������������ӣ��������Ҫ�ٵ��� Spring ������ Jar��

````
org.springframework.core-5.3.13.jar
org.springframework.beans-5.3.13.jar
spring-context-5.3.13.jar
spring-expression-5.3.13.jar
commons.logging-1.2.jar
````
��Ȼ���������Ƽ�ʹ��maven��������

## ���� Java ��
   �� HelloSpring �д��� net.biancheng.c ����Ȼ����������´��� HelloWorld.java �� MainApp.java �ࡣ

HelloWorld.java ��Ĵ�������
````
package net.biancheng.c;
public class HelloWorld {
    private String message;
    public void setMessage(String message) {
        this.message = message;
    }
    public void getMessage() {
        System.out.println("message : " + message);
    }
}
````
MainApp.java ��Ĵ�������
````
package net.biancheng.c;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

    public class MainApp {
        public static void main(String[] args) {
            ApplicationContext context = new ClassPathXmlApplicationContext("Beans.xml");
            HelloWorld obj = context.getBean("helloWorld",HelloWorld.class);
            obj.getMessage();
        }
    }
````
�������ϴ��룬��Ҫע���������㣺

���� ApplicationContext ����ʱʹ���� ClassPathXmlApplicationContext �࣬��������ڼ��� Spring �����ļ��������ͳ�ʼ�����ж���Bean����
ApplicationContext.getBean() ����������ȡ Bean���÷�������ֵ����Ϊ Object��ͨ��ǿ������ת��Ϊ HelloWorld ��ʵ�����󣬵������е� getMessage() ������

## ���������ļ�

�� src Ŀ¼�£�����һ�� Spring �����ļ� Beans.xml���������¡�
````
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://www.springframework.org/schema/beans
http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">
    <bean id="helloWorld" class="net.biancheng.c.HelloWorld">
        <property name="message" value="Hello World!" />
    </bean>
</beans>
````
����Ҳ���Խ��������ļ�����Ϊ������Ч�����ƣ�����Ҫע����ǣ����ļ��������� MainApp.java �ж�ȡ�������ļ�����һ�¡�

Beans.xml ���ڸ���ͬ�� Bean ����Ψһ�� ID��������Ӧ�� Bean ���Ը�ֵ�����磬�����ϴ����У����ǿ����ڲ�Ӱ�������������£��� message ������ֵ��
## ���г���

   ���� MainApp.java��Eclipse IDE ����̨����ʾ��Ϣ���¡�
   message : Hello World!

���ˣ����Ǿͳɹ������˵�һ�� Spring Ӧ�ó���