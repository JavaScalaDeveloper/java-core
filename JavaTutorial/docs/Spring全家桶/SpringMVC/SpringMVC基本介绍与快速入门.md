



## MVC ��Ƹ���

������ Java Web �Ŀ����У�ͳһ����ʾ�㡢���Ʋ㡢���ݲ�Ĳ���ȫ������ JSP ���� JavaBean �����д������ǳ�֮Ϊ **Model1��**





![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7896890-7b3f9cd59394b017.png)





*   **���ֵı׶ˣ�**
*   JSP �� Java Bean ֮��������ϣ�Java ����� HTML ����Ҳ�������һ��
*   Ҫ�󿪷��߲���Ҫ���� Java ����Ҫ�и߳���ǰ��ˮƽ
*   ǰ�˺ͺ���໥������ǰ����Ҫ�ȴ������ɣ����Ҳ����ǰ����ɣ����ܽ�����Ч�Ĳ���
*   �������Ը���

����Ϊ��������ֱ׶ˣ����Ժܿ����ַ�ʽ�ͱ� Servlet + JSP + Java Bean ������ˣ����ڵ� MVC ģ��**��Model2��**������ͼ������





![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7896890-403a273b08fec826.png)





�����û�������ᵽ�� Servlet��Ȼ��������������Ӧ�� Java Bean���������е���ʾ������� JSP ȥ��ɣ�������ģʽ���Ǿͳ�Ϊ MVC ģʽ��

*   **M ���� ģ�ͣ�Model��**
    ģ����ʲô�أ� ģ�;������ݣ����� dao,bean
*   **V ���� ��ͼ��View��**
    ��ͼ��ʲô�أ� ������ҳ, JSP������չʾģ���е�����
*   **C ���� ��������controller)**
    ��������ʲô�� �����������þ��ǰѲ�ͬ������(Model)����ʾ�ڲ�ͬ����ͼ(View)�ϣ�Servlet ���ݵľ��������Ľ�ɫ��

> ��չ�Ķ���[Web����ģʽ](https://mp.weixin.qq.com/s?__biz=MzI4Njg5MDA5NA==&mid=2247483775&idx=1&sn=c9d7ead744c6e0c3ab2fe55c09bbe61f&chksm=ebd7407edca0c9688f3870d895b760836101271b912899821fb35c5704fe215da2fc5daff2f9#rd)

#### Spring MVC �ļܹ�

Ϊ����־ò���һֱδ����õ����ݿ�����ı�̣���Ϊ��ӭ�� NoSQL ��ǿ������Spring MVC �����˷�����





![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7896890-a25782fb05f315de.png)





**��ͳ��ģ�Ͳ㱻���Ϊ��ҵ���(Service)�����ݷ��ʲ㣨DAO,Data Access Object����** �� Service �¿���ͨ�� Spring ������ʽ����������ݷ��ʲ㣬����ҵ����ϻ��������Ƿ��� NoSQL ���������ܹ��������ͻ��� NoSQL ��ʹ���ˣ������Դ����߻�����ϵͳ�����ܡ�

*   **�ص㣺**
    �ṹ��ɢ������������ Spring MVC ��ʹ�ø�����ͼ
    ����ϣ�����ģ�����
    �� Spring �޷켯��

* * *

## Hello Spring MVC

��������дһ�����ǵĵ�һ�� Spring MVC ����

#### ��һ������ IDEA ���½� Spring MVC ��Ŀ





![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7896890-74ea4c339e8f35f8.png)





����ȡ��Ϊ ��HelloSpringMVC���������Finish����





![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7896890-cc6cb7d01573ceee.png)





IDEA ���Զ����������غñ�Ҫ�� jar ��������Ϊ���Ǵ�����һЩĬ�ϵ�Ŀ¼���ļ����������Ժ���Ŀ�ṹ���£�





![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7896890-f6fd3173da6e4939.png)





#### �ڶ������޸� web.xml

���Ǵ� web.xml ��������ͼ����޸ģ�





![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7896890-2d8a3a7b48dbe59a.png)





��`<url-pattern>`Ԫ�ص�ֵ��Ϊ / ����ʾҪ�������е����󣬲�����Spring MVC�ĺ�̨����������������֮��



```
<servlet-mapping>
    <servlet-name>dispatcher</servlet-name>
    <url-pattern>/</url-pattern>
</servlet-mapping>

```



#### ���������༭ dispatcher-servlet.xml

����ļ����Ŀ�ͷ dispatcher ������ web.xml �е� `<servlet-name>` Ԫ�����õ� dispatcher ��Ӧ������ Spring MVC ��ӳ�������ļ���xxx-servlet.xml�������Ǳ༭���£�



```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="simpleUrlHandlerMapping"
          class="org.springframework.web.servlet.handler.SimpleUrlHandlerMapping">
        <property name="mappings">
            <props>
                <!-- /hello ·�������󽻸� id Ϊ helloController �Ŀ���������-->
                <prop key="/hello">helloController</prop>
            </props>
        </property>
    </bean>
    <bean id="helloController" class="controller.HelloController"></bean>
</beans>

```



#### ���Ĳ�����д HelloController

�� Package��controller���´��� ��HelloController���࣬��ʵ�� org.springframework.web.servlet.mvc.Controller �ӿڣ�



```
package controller;

import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

public class HelloController implements Controller{
    @Override
    public ModelAndView handleRequest(javax.servlet.http.HttpServletRequest httpServletRequest, javax.servlet.http.HttpServletResponse httpServletResponse) throws Exception {
        return null;
    }
}

```



*   **���������⣺** javax.servlet ���Ҳ���
*   **�����** ������ Tomcat ��������Ŀ¼�¡�lib���ļ����µ� servlet-api.jar �����������̡�lib���ļ����£��������

Spring MVC ͨ�� ModelAndView �����ģ�ͺ���ͼ�����һ��



```
ModelAndView mav = new ModelAndView("index.jsp");
mav.addObject("message", "Hello Spring MVC");

```



�����ʾ��ͼ����index.jsp
ģ�����ݵ��� message�������� ��Hello Spring MVC��



```
package controller;

import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

public class HelloController implements Controller {

    public ModelAndView handleRequest(javax.servlet.http.HttpServletRequest httpServletRequest, javax.servlet.http.HttpServletResponse httpServletResponse) throws Exception {
        ModelAndView mav = new ModelAndView("index.jsp");
        mav.addObject("message", "Hello Spring MVC");
        return mav;
    }
}

```



#### ���岽��׼�� index.jsp

�� index.jsp �������޸�Ϊ��



```
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" isELIgnored="false"%>

<h1>${message}</h1>

```



���ݺܼ򵥣���El���ʽ��ʾ message �����ݡ�

#### ������������ Tomcat ����ػ���

�ڡ�Run���˵������ҵ���Edit Configurations��





![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7896890-bcca5f5a7c097d6b.png)





���� Tomcat ������





![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7896890-0600768275c85966.png)





ѡ��ñ��ص� Tomcat �����������ĺ����֣�





![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7896890-5f033d1463f08d7b.png)





�� Deployment ��ǩҳ��������²�����





![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7896890-02aa0ac9a6707685.png)





��� OK �ͺ��ˣ����ǵ�����Ͻǵ������ν� Tomcat ����������������

*   **���ֵ����⣺** Tomcat �������޷���������
*   **ԭ��** Tomcat �������Ҳ�����ص� jar ��
*   **���������** ����lib���ļ���������������WEB-INF���£������½���������





![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7896890-b8fcf3da677299cf.png)





#### ���߲�������������

�����������������ַ��localhost/hello





![](//upload-images.jianshu.io/upload_images/7896890-390fb571e9f6ff03.png)





> �ο����ϣ�[Spring MVC �̳�(how2j.cn)](http://how2j.cn/k/springmvc/springmvc-springmvc/615.html#step1891)

* * *

## ���� Spring MVC ������

ÿ���û��� Web ������е�����ӻ����ύ����ʱ������Ϳ�ʼ�����ˣ������ʵ�Աһ�������뿪�������ʼ����ȡ��Ӧ���أ����ᾭ���ܶ�վ�㣬��ÿһ��վ�㶼������һЩ��ϢͬʱҲ�����������Ϣ����ͼΪ Spring MVC ���������̣�





![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7896890-65ef874ad7da59a2.png)





#### ��һվ��DispatcherServlet

�������뿪������Ժ󣬵�һվ����ľ��� DispatcherServlet������������һ�� Servlet��ͨ�� J2EE ��ѧϰ������֪�� Servlet �������ز����� HTTP ����DispatcherServlet ���������е����󣬲��ҽ���Щ�����͸� Spring MVC ��������



```
<servlet>
    <servlet-name>dispatcher</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <load-on-startup>1</load-on-startup>
</servlet>
<servlet-mapping>
    <servlet-name>dispatcher</servlet-name>
    <!-- �������е����� -->
    <url-pattern>/</url-pattern>
</servlet-mapping>

```



*   **DispatcherServlet ������������������͸� Spring MVC ��������**

#### �ڶ�վ��������ӳ�䣨HandlerMapping��

*   **���⣺** ���͵�Ӧ�ó����п��ܻ��ж������������Щ���󵽵�Ӧ�÷�����һ���������أ�

���� DispatcherServlet ���ѯһ������������ӳ����ȷ���������һվ�����������ӳ���**����������Я���� URL ��Ϣ�����о���**����������������У�����ͨ������ simpleUrlHandlerMapping ���� /hello ��ַ���� helloController ����



```
<bean id="simpleUrlHandlerMapping"
      class="org.springframework.web.servlet.handler.SimpleUrlHandlerMapping">
    <property name="mappings">
        <props>
            <!-- /hello ·�������󽻸� id Ϊ helloController �Ŀ���������-->
            <prop key="/hello">helloController</prop>
        </props>
    </property>
</bean>
<bean id="helloController" class="controller.HelloController"></bean>

```



#### ����վ��������

һ��ѡ���˺��ʵĿ������� DispatcherServlet �Ὣ�����͸�ѡ�еĿ����������˿������������ж���为�أ��û��ύ�����󣩵ȴ���������������Щ��Ϣ��



```
public ModelAndView handleRequest(javax.servlet.http.HttpServletRequest httpServletRequest, javax.servlet.http.HttpServletResponse httpServletResponse) throws Exception {
    // �����߼�
    ....
}

```



#### ����վ������ DispatcherServlet

��������������߼������ͨ�������һЩ��Ϣ����Щ��Ϣ������Ҫ���ظ��û��������������ʾ����Ϣ�����Ǳ���Ϊ**ģ�ͣ�Model��**����������ԭʼ����Ϣʱ�����ġ�����Щ��Ϣ��Ҫ���û��Ѻõķ�ʽ���и�ʽ����һ����� HTML�����ԣ���Ϣ��Ҫ���͸�һ��**��ͼ��view��**��ͨ������ JSP��

���������������һ���¾��ǽ�ģ�����ݴ�������ұ�ʾ��������Ⱦ�������ͼ��**���߼���ͼ���������������Ὣ������ͬģ�ͺ���ͼ�����ͻ� DispatcherServlet��**



```
public ModelAndView handleRequest(javax.servlet.http.HttpServletRequest httpServletRequest, javax.servlet.http.HttpServletResponse httpServletResponse) throws Exception {
    // �����߼�
    ....
    // ���ظ� DispatcherServlet
    return mav;
}

```



#### ����վ����ͼ������

�����������������Ͳ�����ض�����ͼ����ϣ����ݸ� DispatcherServlet ����ͼ������ֱ�ӱ�ʾĳ���ض��� JSP����ʵ���ϣ�����������ȷ����ͼ���� JSP���෴��**�����ݵĽ�����һ���߼����ƣ�������ƽ����������Ҳ��������������ͼ��**

DispatcherServlet ����ʹ����ͼ��������view resolver�������߼���ͼ��ƥ��Ϊһ���ض�����ͼʵ�֣���������Ҳ���ܲ��� JSP

> �����������ֱ�Ӱ󶨵��� index.jsp ��ͼ

#### ����վ����ͼ

��Ȼ DispatcherServlet �Ѿ�֪�����ĸ���ͼ��Ⱦ����ˣ�����������������Ҳ������ˡ�

�������һվ����ͼ��ʵ�֣�������������ģ�����ݣ����������Ҳ������ˡ���ͼʹ��ģ��������Ⱦ������������������ͨ����Ӧ���󴫵ݸ��ͻ��ˡ�



```
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" isELIgnored="false"%>

<h1>${message}</h1>

```



* * *

## ʹ��ע������ Spring MVC

���������Ѿ��� Spring MVC ����һ�����˽⣬����ͨ�� XML ���õķ�ʽ�����˵�һ�� Spring MVC ������������������ע��Ӧ����ô���������������ã�

#### ��һ����Ϊ HelloController ���ע��



```
package controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class HelloController{

    @RequestMapping("/hello")
    public ModelAndView handleRequest(javax.servlet.http.HttpServletRequest httpServletRequest, javax.servlet.http.HttpServletResponse httpServletResponse) throws Exception {
        ModelAndView mav = new ModelAndView("index.jsp");
        mav.addObject("message", "Hello Spring MVC");
        return mav;
    }
}

```



��ʵ�ֵĽӿ�Ҳ��ȥ����

*   **�򵥽���һ�£�**
*   `@Controller` ע�⣺
    �����ԣ����ע�������������������ģ���ʵ�������ע��� Spring MVC �����Ӱ�첢���󡣣�Spring ʵս˵�������Ǹ���ʵ�����ɨ�裬������ `@Component` ע����棬�����Լ�������һ�²����У���Ϊ��������û������ JSP ��ͼ�������һ��Լ�����һ����û�гɹ�...��
*   `@RequestMapping` ע�⣺
    ����Ȼ����ͱ�ʾ·�� `/hello` ��ӳ�䵽�÷�����

#### �ڶ�����ȡ��֮ǰ�� XML ע��

�� dispatcher-servlet.xml �ļ��У�ע�͵�֮ǰ�����ã�Ȼ������һ�����ɨ�裺



```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">

    <!--<bean id="simpleUrlHandlerMapping"-->
                                        <!-->-->
    <!--<property name="mappings">-->
            <!--<props>-->
                <!--&lt;!&ndash; /hello ·�������󽻸� id Ϊ helloController �Ŀ���������&ndash;&gt;-->
                <!--<prop key="/hello">helloController</prop>-->
            <!--</props>-->
        <!--</property>-->
    <!--</bean>-->
    <!--<bean id="helloController" ></bean>-->

    <!-- ɨ��controller�µ���� -->
    <context:component-scan base-package="controller"/>
</beans>

```



#### ������������������

��������ɣ��������������������� `localhost/hello` ��ַ��Ȼ�ܿ���Ч����





![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7896890-390fb571e9f6ff03.png)





#### @RequestMapping ע��ϸ��

��� `@RequestMapping` ���������ϣ���ô���൱���Ǹ������������õ�ӳ���ַǰ������һ����ַ�����磺



```
@Controller
@RequestMapping("/wmyskxz")
public class HelloController {
    @RequestMapping("/hello")
    public ModelAndView handleRequest(....) throws Exception {
        ....
    }
}

```



*   ����ʵ�ַ�� `localhost/wmyskxz/hello`

* * *

## ������ͼ������

���ǵ����� Spring MVC ��������������ͼ����������λ��ͼ��������һ���� DispaterServlet ���ݹ������߼���ͼ����ƥ��һ���ض�����ͼ��

*   **����** ��һЩҳ�����ǲ�ϣ���û��û�ֱ�ӷ��ʵ�����������Ҫ���ݵ�ҳ�棬������ģ������֧�ŵ�ҳ�档
*   **��ɵ����⣺**
    ���ǿ����ڡ�web����Ŀ¼�·���һ����test.jsp��ģ��һ����Ҫ���ݵ�ҳ�棬����ʲô����������������������������ҳ������ `localhost/test.jsp` ���ܹ�ֱ�ӷ��ʵ��ˣ�������**����й¶**...
    �������ǿ���ֱ������ `localhost/index.jsp` ���ԣ�������������ĳ��������һ���հ׵�ҳ�棬��Ϊ��û�л�ȡ�� `${message}` ������ֱ�ӷ����ˣ����**Ӱ���û�����**

#### �������

���ǽ����ǵ� JSP �ļ������ڡ�WEB-INF���ļ����еġ�page���ļ����£���WEB-INF���� Java Web ��Ĭ�ϵİ�ȫĿ¼���ǲ������û�ֱ�ӷ��ʵ�_��Ҳ������˵��ͨ�� `localhost/WEB-INF/` �����ķ�ʽ����Զ���ʲ����ģ�_

����������Ҫ������߸���ͼ�������������� dispatcher-servlet.xml �ļ������������ã�



```
<bean id="viewResolver"
      class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <property name="prefix" value="/WEB-INF/page/" />
    <property name="suffix" value=".jsp" />
</bean>

```



����������һ�� Spring MVC ���õ�һ����ͼ���������ý���������ѭ��һ��Լ������**����ͼ�������ǰ׺�ͺ�׺������ȷ��һ�� Web Ӧ������ͼ��Դ������·���ġ�**������ʵ��������Ч����

#### ��һ�����޸� HelloController

���ǽ������޸�һ�£�





![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7896890-2ce49e171bd6d547.png)





#### �ڶ�����������ͼ��������

�������������ã���ɣ�



```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">

    <!--<bean id="simpleUrlHandlerMapping"-->
                                        <!-->-->
    <!--<property name="mappings">-->
            <!--<props>-->
                <!--&lt;!&ndash; /hello ·�������󽻸� id Ϊ helloController �Ŀ���������&ndash;&gt;-->
                <!--<prop key="/hello">helloController</prop>-->
            <!--</props>-->
        <!--</property>-->
    <!--</bean>-->
    <!--<bean id="helloController" ></bean>-->

    <!-- ɨ��controller�µ���� -->
    <context:component-scan base-package="controller"/>
    <bean id="viewResolver"
          class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/page/" />
        <property name="suffix" value=".jsp" />
    </bean>
</beans>

```



#### ������������ index.jsp �ļ�

�ڡ�WEB-INF���ļ������½�һ����page���ļ��У�������index.jsp���ļ����������棺





![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7896890-88995fd05ccd0f80.png)





#### ���Ĳ���������Դ����������

���� `localhost/hello` ·����������ȷЧ����





![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7896890-390fb571e9f6ff03.png)





*   **ԭ��**





![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7896890-a716a3ac8f7e541d.png)





���Ǵ�����߼���ͼ��Ϊ index ���ټ��� ��`/WEB-INF/page/`�� ǰ׺�� ��`.jsp`�� ��׺������ȷ��������ͼ��·���ˣ����������Ժ�Ϳ��Խ����е���ͼ���롾page���ļ������ˣ�

*   **ע�⣺**��ʱ�����ý��� dispatcher-servlet.xml �µ�

* * *

## ������������������

ʹ�ÿ��������ղ��������� Spring MVC ����ҵ���߼��ĵ�һ����Ϊ̽�� Spring MVC �Ĵ��η�ʽ��Ϊ��������������һ���򵥵ı������ύ���ݣ�



```
<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" import="java.util.*" isELIgnored="false"%>
<html>
<head>
    <meta charset="utf-8">
    <title>Spring MVC ���η�ʽ</title>
</head>
<body>
<form action="/param" role="form">
    �û�����<br/>
    ���룺<br/>
    
</form>
</body>
</html>

```



��ͳ����ɣ����Ǿ���������һ�£�





![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7896890-b50a42db8debde97.png)





#### ʹ�� Servlet ԭ�� API ʵ�֣�

���Ǻ�����֪���������ύ�� `/param` ���Ŀ¼����������ʹ�� Servlet ԭ���� API �������ܲ��ܻ�ȡ�����ݣ�



```
@RequestMapping("/param")
public ModelAndView getParam(HttpServletRequest request,
                         HttpServletResponse response) {
    String userName = request.getParameter("userName");
    String password = request.getParameter("password");

    System.out.println(userName);
    System.out.println(password);
    return null;
}

```



���Գɹ���





![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7896890-df21058b7ef71924.png)





#### ʹ��ͬ��ƥ�����

���ǿ��԰ѷ���������β��������óɺ�ǰ̨���������һ���ķ���������ȡ�����ݣ�ͬ��ƥ����򣩣�



```
@RequestMapping("/param")
public ModelAndView getParam(String userName,
                             String password) {
    System.out.println(userName);
    System.out.println(password);
    return null;
}

```



���Գɹ���





![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7896890-55a1c296c778e506.png)





*   **���⣺** �����ֻ��ǰ̨������ǿ����ϣ��������ǲ�ϣ����
*   **�����** ʹ�� `@RequestParam("ǰ̨������")` ��ע�룺





![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7896890-a649ad50866a01c5.png)





*   **`@RequestParam` ע��ϸ�ڣ�**
    ��ע��������������`value`��`required`��`defaultvalue`
*   `value` ��ָ�� `name` ���Ե�������ʲô��`value` ���Զ�����Ĭ�ϲ�д
*   `required` ���Ƿ����Ҫ�иò�������������Ϊ��true�����ߡ�false��
*   `defaultvalue` ������Ĭ��ֵ

#### ʹ��ģ�ʹ���

*   **Ҫ�� ǰ̨�������ֱ����ģ���е��ֶ���һ��**

����������Ϊ���ǵı�����һ�� User ģ�ͣ�



```
package pojo;

public class User {

    String userName;
    String password;

    /* getter and setter */
}

```



Ȼ�������Ȼ�ɹ���





![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7896890-471d26bcb335aee6.png)





#### ������������

*   **ע�⣺** �� Servlet �е�һ�����÷���ֻ�� POST ������Ч����Ϊ��ֱ�Ӵ���� request��

���ǿ���ͨ������ Spring MVC �ַ��������������ɣ��� web.xml ����ӣ�



```
<filter>
    <filter-name>CharacterEncodingFilter</filter-name>
    <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
    <init-param>
        <param-name>encoding</param-name>
        <!-- ���ñ����ʽ -->
        <param-value>utf-8</param-value>
    </init-param>
</filter>
<filter-mapping>
    <filter-name>CharacterEncodingFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>

```



* * *

## ��������������

ͨ�����棬����֪������ô�����������ݣ����ܽ�� POST ��������⣬��ô������ô���������أ�Ϊ�������ڡ�page���´���һ����test2.jsp����



```
<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" import="java.util.*" isELIgnored="false" %>
<html>
<head>
    <title>Spring MVC ���ݻ���</title>
</head>
<body>
<h1>�������ݣ�${message}</h1>
</body>
</html>

```



#### ʹ�� Servlet ԭ�� API ��ʵ��

������������һ�� Servlet ԭ���� API �Ƿ�������������



```
@RequestMapping("/value")
public ModelAndView handleRequest(HttpServletRequest request,
                                  HttpServletResponse response) {
    request.setAttribute("message","�ɹ���");
    return new ModelAndView("test1");
}

```



���������ַ�������룺`localhost/value` ����





![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7896890-66d2f24a876306e6.png)





#### ʹ�� Spring MVC ���ṩ�� ModelAndView ����





![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7896890-360ce67947be817d.png)





#### ʹ�� Model ����

�� Spring MVC �У�����ͨ������ʹ�������ķ�ʽ�������ݣ�





![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7896890-685dd384904ad28f.png)





*   **ʹ�� `@ModelAttribute` ע�⣺**



```
@ModelAttribute
public void model(Model model) {
    model.addAttribute("message", "ע��ɹ�");
}

@RequestMapping("/value")
public String handleRequest() {
    return "test1";
}

```



����д�ͻ��ڷ��ʿ��������� handleRequest() ʱ�������ȵ��� model() ������ `message` ��ӽ�ҳ�������ȥ������ͼ�п���ֱ�ӵ��ã���������д�ᵼ�¸ÿ��������еķ����������ȵ��� model() ��������ͬ����Ҳ�ܷ��㣬��Ϊ���Լ�����ָ��������ݡ�

* * *

## �ͻ�����ת

ǰ�治���ǵ�ַ `/hello` ��ת�� index.jsp ���� `/test` ��ת�� test.jsp����Щ���Ƿ���˵���ת��Ҳ���� `request.getRequestDispatcher("��ַ").forward(request, response);`

��������ν��пͻ�����ת�أ����Ǽ����� HelloController �б�д��



```
@RequestMapping("/hello")
public ModelAndView handleRequest(javax.servlet.http.HttpServletRequest httpServletRequest, javax.servlet.http.HttpServletResponse httpServletResponse) throws Exception {
    ModelAndView mav = new ModelAndView("index");
    mav.addObject("message", "Hello Spring MVC");
    return mav;
}

@RequestMapping("/jump")
public ModelAndView jump() {
    ModelAndView mav = new ModelAndView("redirect:/hello");
    return mav;
}

```



����ʹ�� `redirect:/hello` �ͱ�ʾ����Ҫ��ת�� `/hello` ���·���������������������ڵ�ַ�������룺`localhost/jump` �����Զ���ת�� `/hello` ·���£�





![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7896890-390fb571e9f6ff03.png)





Ҳ���������ã�



```
@RequestMapping("/jump")
public String jump() {
    return "redirect: ./hello";
}

```



* * *

## �ļ��ϴ�

���������ع�һ�´�ͳ���ļ��ϴ������أ�[����](https://www.jianshu.com/p/e7837435bf4c)

����������һ���� Spring MVC �����ʵ���ļ����ϴ�������

*   **ע�⣺** ��Ҫ�ȵ��� `commons-io-1.3.2.jar` �� `commons-fileupload-1.2.1.jar` ������

#### ��һ���������ϴ�������

�� dispatcher-servlet.xml ������һ�䣺



```
<bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver"/>

```



�������ϴ����ܵ�֧��

#### �ڶ�������д JSP

�ļ���Ϊ upload.jsp���Դ����ڡ�page���£�



```
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>�����ļ��ϴ�</title>
</head>
<body>
<form action="/upload" method="post" enctype="multipart/form-data">
    
    
</form>
</body>
</html>

```



#### ����������д������

�� Package��controller�����½���UploadController���ࣺ



```
package controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class UploadController {

    @RequestMapping("/upload")
    public void upload(@RequestParam("picture") MultipartFile picture) throws Exception {
        System.out.println(picture.getOriginalFilename());
    }

    @RequestMapping("/test2")
    public ModelAndView upload() {
        return new ModelAndView("upload");
    }

}

```



#### ���Ĳ�������

���������ַ�������룺`localhost/test2` ��ѡ���ļ�����ϴ������Գɹ���





![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7896890-531c47b14dbc71e5.png)





* * *

#### �ο����ϣ�

*   ��Java EE ������������������Ͽ�����
*   ��Spring ʵս��
*   [How2j Spring MVC ϵ�н̳�](http://how2j.cn/k/springmvc/springmvc-springmvc/615.html)
*   ȫ�ܵİٶȺ����ܵĴ���

* * *

> ��ӭת�أ�ת����ע��������
> ����ID��[@��û����������](https://www.jianshu.com/u/a40d61a49221)
> github��[wmyskxz](https://github.com/wmyskxz/)
> ��ӭ��ע����΢�źţ�wmyskxz
> �����Լ���ѧϰ & ѧϰ���� & ����
> ��Ҫ����������Ҳ���Լ�qqȺ��3382693



���ߣ���û����������
���ӣ�https://www.jianshu.com/p/91a2d0a1e45a
��Դ������
����Ȩ���������С���ҵת������ϵ���߻����Ȩ������ҵת����ע��������