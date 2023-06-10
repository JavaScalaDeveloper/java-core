IoC �� Inversion of Control �ļ�д����Ϊ�����Ʒ�ת����������һ�ż���������һ�����˼�룬��һ����Ҫ����������̷����ܹ�ָ�����������Ƴ�����ϡ��������ĳ���

Spring ͨ�� IoC �������������� Java �����ʵ�����ͳ�ʼ�������ƶ��������֮���������ϵ�����ǽ��� IoC ��������� Java �����Ϊ Spring Bean������ʹ�ùؼ��� new ������ Java ����û���κ�����

IoC ������ Spring ���������Ҫ�ĺ������֮һ�����ᴩ�� Spring �ӵ������ɳ����������̡�

## ���Ʒ�ת��IoC��

�ڴ�ͳ�� Java Ӧ���У�һ������Ҫ������һ�����е����Ի򷽷���ͨ���������������ͨ�� new Object() �ķ�ʽ�����ߵĶ��󴴽�������Ȼ�����ʵ�����Ի򷽷��ĵ��á�Ϊ�˷����������������ǿ��Խ�ǰ�߳�Ϊ�������ߡ��������߳�Ϊ���������ߡ���Ҳ����˵�������������ű������߶��󴴽��Ŀ���Ȩ��

���� Spring Ӧ���У�Java ���󴴽��Ŀ���Ȩ�������� IoC ��������ģ�����²������¡�

������Աͨ�� XML �����ļ���ע�⡢Java ������ȷ�ʽ���� Java ������ж��壬������ XML �����ļ���ʹ�� <bean> ��ǩ���� Java ����ʹ�� @Component ע��ȡ� 
Spring ����ʱ��IoC �������Զ����ݶ����壬����Щ���󴴽���������������Щ�� IoC ��������������Ķ��󱻳�Ϊ Spring Bean�� 
��������Ҫʹ��ĳ�� Bean ʱ������ֱ�Ӵ� IoC �����л�ȡ������ͨ�� ApplicationContext �� getBean() ��������������Ҫ�ֶ�ͨ�����루���� new Obejct() �ķ�ʽ��������

IoC ���������ı䲻�Ǵ������ģ����Ǵ�˼������Ϸ����ˡ����ӻ�λ���ĸı䡣ԭ����������������һ��������Ҫʹ��ʲô��Դ�ͻ������������Լ����������� Spring Ӧ���У�IoC ��������������Ȩ�������������˱�����һ���������ĵȴ� IoC ��������������Ҫ�Ķ���Bean����

���������ְ����淢���˿���Ȩ�ķ�ת����ԭ��������ͨ������ʵ�ֵĶ���Ĵ�������ת�� IoC ��������æʵ�֣�������ǽ�������̳�Ϊ Spring �ġ����Ʒ�ת����

## ����ע�루DI��

���˽��� IoC ֮�����ǻ���Ҫ�˽�����һ���ǳ���Ҫ�ĸ������ע�롣

����ע�루Denpendency Injection����дΪ DI���� Martin Fowler �� 2004 ���ڶԡ����Ʒ�ת�����н���ʱ����ġ�Martin Fowler ��Ϊ�����Ʒ�ת��һ�ʺܻ�ɬ���޷����˺�ֱ�ӵ���⡰���������ﷴת�ˡ������������ʹ�á�����ע�롱�����桰���Ʒ�ת����

����������У�����Ͷ���֮���Ǵ���һ�ֽ������������Ĺ�ϵ������˵��������ϵ������һ����������Ҫ�õ�����һ�����󣬼������д���һ�����ԣ�������������һ����Ķ���

���磬��һ����Ϊ B �� Java �࣬���Ĵ������¡�





 

public class  B { 
String  bid; 
A  a; 
}

 





�Ӵ�����Կ�����B �д���һ�� A ���͵Ķ������� a����ʱ���ǾͿ���˵ B �Ķ��������ڶ��� a��������ע����Ǿ��ǻ������֡�������ϵ���������ġ�

����֪�������Ʒ�ת����˼������� Spring �������Ĵ������ڶ��󴴽������У�Spring ���Զ�����������ϵ�����������Ķ���ע�뵽��ǰ�����У��������ν�ġ�����ע�롱��

����ע�뱾������ [Spring Bean ����ע��](http://c.biancheng.net/spring/attr-injection.html)��һ�֣�ֻ�������������һ���������Զ��ѡ�

## IoC �Ĺ���ԭ��

�� Java ������������У�ϵͳ�еĸ�������֮�䡢����ģ��֮�䡢���ϵͳ��Ӳ��ϵͳ֮�䣬�����ٶ�����һ������Ϲ�ϵ��

��һ��ϵͳ����϶ȹ��ߣ���ô�ͻ��������ά�������⣬����ȫû����ϵĴ��뼸���޷�����κι������������ڼ������еĹ��ܶ���Ҫ����֮���໥Э�����໥����������ɡ���������ڳ������ʱ�������е�˼��һ�㶼���ڲ�Ӱ��ϵͳ���ܵ�ǰ���£�����޶ȵĽ�����϶ȡ�

IoC �ײ�ͨ������ģʽ��Java �ķ�����ơ�XML �����ȼ��������������϶Ƚ��͵�����޶ȣ�����Ҫ�������¡�

�������ļ������� Bean.xml���У��Ը��������Լ�����֮���������ϵ�������ã�
���ǿ��԰� IoC ��������һ����������������Ĳ�Ʒ���� Spring Bean��
��������ʱ����ز�������Щ�����ļ����õ�����Ļ�����Ϣ�Լ�����֮���������ϵ��
IoC ���� Java �ķ�����ƣ���������������Ӧ�Ķ��󣨼� Spring Bean����������������ϵ���������ע�뵽�������Ķ����С�

���ڶ���Ļ�����Ϣ������֮���������ϵ�����������ļ��ж���ģ���û���ڴ����н�����ϣ���˼�ʹ�������ı䣬����Ҳֻ��Ҫ�������ļ��н����޸ļ��ɣ�������� Java ��������޸ģ������ Spring IoC ʵ�ֽ����ԭ��

## IoC ����������ʵ��

IoC ˼����� IoC ����ʵ�ֵģ�IoC �����ײ���ʵ����һ�� Bean ������Spring ���Ϊ�����ṩ�����ֲ�ͬ���� IoC ���������Ƿֱ��� BeanFactory �� ApplicationContext��

### BeanFactory

BeanFactory �� IoC �����Ļ���ʵ�֣�Ҳ�� Spring �ṩ����򵥵� IoC ���������ṩ�� IoC ����������Ĺ��ܣ��� org.springframework.beans.factory.BeanFactory �ӿڶ��塣

BeanFactory ���������أ�lazy-load�����ƣ������ڼ��������ļ�ʱ���������̴��� Java ����ֻ�г����л�ȡ��ʹ�ã�����Զ���ʱ�Żᴴ����

#### ʾ�� 1

��������ͨ��һ��ʵ����ʾ������ʾ�� BeanFactory ��ʹ�á�

1\. �� HelloSpring ��Ŀ�У��� MainApp �Ĵ����޸�Ϊʹ�� BeanFactory ��ȡ HelloWorld �Ķ��󣬾���������¡�





 

public static void main(String[] args) {
BeanFactory  context = new ClassPathXmlApplicationContext("Beans.xml");
HelloWorld  obj = context.getBean("helloWorld", HelloWorld.class);
obj.getMessage();
}

 





2. ���� MainApp.java������̨������¡�

 message : Hello World! 

> ע�⣺BeanFactory �� Spring �ڲ�ʹ�ýӿڣ�ͨ������²��ṩ��������Աʹ�á�

### ApplicationContext

ApplicationContext �� BeanFactory �ӿڵ��ӽӿڣ��Ƕ� BeanFactory ����չ��ApplicationContext �� BeanFactory �Ļ����������������ҵ���Ĺ��ܣ����� AOP�����������̣������ʻ�������֧�ֵȡ�

ApplicationContext �ӿ����������õ�ʵ���࣬�������±�

| ʵ���� | ���� | ʾ������ |
| --- | --- | --- |
| ClassPathXmlApplicationContext | ������·�� ClassPath ��ָ���� XML �����ļ�������� ApplicationContext ��ʵ�������� | ApplicationContext applicationContext = new ClassPathXmlApplicationContext(String configLocation); |
| FileSystemXmlApplicationContext | ����ָ�����ļ�ϵͳ·����ָ���� XML �����ļ�������� ApplicationContext ��ʵ�������� | ApplicationContext applicationContext = new FileSystemXmlApplicationContext(String configLocation); |

> ���ϱ��ʾ�������У����� configLocation ����ָ�� Spring �����ļ������ƺ�λ�ã��� Beans.xml��

#### ʾ�� 2

�������Ǿ�ͨ��һ��ʵ��������ʾ ApplicationContext ��ʹ�á�

1. �޸� HelloSpring ��Ŀ MainApp ���� main() �����Ĵ��룬����������¡�





 
````
public static void main(String[] args) {
//ʹ�� FileSystemXmlApplicationContext ����ָ��·���µ������ļ� Bean.xml
BeanFactory  context = new FileSystemXmlApplicationContext("D:\\eclipe workspace\\spring workspace\\HelloSpring\\src\\Beans.xml");
HelloWorld  obj = context.getBean("helloWorld", HelloWorld.class);
obj.getMessage();
}
````
 





2. ���� MainApp.java������̨������¡�

 message : Hello World! 

# �ο�����
https://www.w3cschool.cn/wkspring
https://www.runoob.com/w3cnote/basic-knowledge-summary-of-spring.html
http://codepub.cn/2015/06/21/Basic-knowledge-summary-of-Spring
https://dunwu.github.io/spring-tutorial
https://mszlu.com/java/spring
http://c.biancheng.net/spring/aop-module.html