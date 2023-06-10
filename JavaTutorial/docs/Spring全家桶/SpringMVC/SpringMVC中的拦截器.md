



# Spring MVC ʹ��HandlerInterceptor��������



2018-07-26 14:07 ����







Spring�Ĵ�����ӳ����ư����˴�������������������������ҪΪ�ض����͵�����Ӧ��һЩ����ʱ���ܺ����ã����磬����û���ݵȡ�

<section>

������ӳ�䴦��������õ�������������ʵ�� `org.springframework.web.servlet`���µ� `HandlerInterceptor`�ӿڡ�����ӿڶ��������������� `preHandle(..)`�����ڴ�����ʵ��ִ�� _֮ǰ_ �ᱻִ�У� `postHandle(..)`�����ڴ�����ִ�� _���_ �Ժ�ִ�У� `afterCompletion(..)`������ _�������������_ ֮��ִ�С�����������Ϊ�������͵�ǰ����ͺ��������ṩ���㹻������ԡ�

`preHandle(..)`��������һ��booleanֵ�������ͨ����������������Ƿ����ִ�д������еĲ��������������� `true`ʱ���������������ִ�У����������� `false`�� `DispatcherServlet`����Ϊ�����������Ѿ�����˶�����Ĵ�������˵���Ѿ���Ⱦ��һ�����ʵ���ͼ������ô������������Լ�ִ�����е������������Ͳ����ٱ�ִ���ˡ�

����������ͨ��`interceptors`���������ã���ѡ�������м̳���`AbstractHandlerMapping`�Ĵ�����ӳ����`HandlerMapping`���ṩ�����õĽӿڡ����������������ʾ��

```
<beans>
    <bean id="handlerMapping" class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping">
        <property name="interceptors">
            <list>
                <ref bean="officeHoursInterceptor"/>
            </list>
        </property>
    </bean>

    <bean id="officeHoursInterceptor" class="samples.TimeBasedAccessInterceptor">
        <property name="openingTime" value="9"/>
        <property name="closingTime" value="18"/>
    </bean>
<beans>

```

```
package samples;

public class TimeBasedAccessInterceptor extends HandlerInterceptorAdapter {

    private int openingTime;
    private int closingTime;

    public void setOpeningTime(int openingTime) {
        this.openingTime = openingTime;
    }

    public void setClosingTime(int closingTime) {
        this.closingTime = closingTime;
    }

    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
            Object handler) throws Exception {
        Calendar cal = Calendar.getInstance();
        int hour = cal.get(HOUR_OF_DAY);
        if (openingTime <= hour && hour < closingTime) {
            return true;
        }
        response.sendRedirect("http://host.com/outsideOfficeHours.html");
        return false;
    }
}

```

������������У����б��˴�������������󶼻ᱻ`TimeBasedAccessInterceptor`���������ء������ǰʱ���ڹ���ʱ�����⣬��ô�û��ͻᱻ�ض���һ��HTML�ļ���ʾ�û���������ʾ����ֻ���ڹ���ʱ��ſ��Է��ʱ���վ��֮�����Ϣ��

> ʹ��`RequestMappingHandlerMapping`ʱ��ʵ�ʵĴ�������һ������������`HandlerMethod`��ʵ��������ʶ��һ���������ڴ��������Ŀ�����������

����������Spring��������������`HandlerInterceptorAdapter`�ü̳�`HandlerInterceptor`�ӿڱ�ø����ˡ�

> ����������У����п�����������������󶼻ᱻ���õ������������ص�����������һ����С���ص�URL��Χ�������ͨ��MVC�����ռ��MVC Java��̵ķ�ʽ�����ã����ߣ�����һ��`MappedInterceptor`���͵�beanʵ��������������� [21.16.1 ����MVC Java������û�MVC�����ռ�����](https://www.w3cschool.cn/spring_mvc_documentation_linesh_translation/spring_mvc_documentation_linesh_translation-ouxg27ss.html)һС�ڡ�

��Ҫע����ǣ�`HandlerInterceptor`�ĺ�����`postHandle`������һ������������ע����`@ResponseBody`��`ResponseEntity`�ķ�������Щ�����У�`HttpMessageConverter`������������`postHandle`��������֮ǰ�Ͱ���Ϣд����Ӧ�С��������������޷��ٸı���Ӧ�ˣ�����Ҫ����һ����Ӧͷ֮��ġ���������������������Ӧ��ʵ��`ResponseBodyAdvice`�ӿڣ������䶨��Ϊһ��`@ControllerAdvice`bean��ֱ����`RequestMappingHandlerMapping`�����á�

</section>



