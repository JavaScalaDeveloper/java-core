



# Spring MVC �������쳣������



2018-07-26 14:32 ����







Spring�Ĵ������쳣������`HandlerExceptionResolver`�ӿڵ�ʵ�ָ�������������ִ�й����г��ֵ��쳣��ĳ�̶ֳ��Ͻ���`HandlerExceptionResolver`������webӦ��������`web.xml`�ļ����ܶ�����쳣ӳ�䣨exception mapping�������񣬲������Ⱥ����ṩ�˸����ķ�ʽ�����������ṩ�쳣���׳�ʱ����ִ�е����ĸ���������������Ϣ�����ң�һ������programmatic�����쳣����ʽ����Ϊ���ṩ����ѡ��ʹ��������ֱ��ת����һ��URL֮ǰ������ʹ��Servlet�淶���쳣ӳ����һ���ģ��и���ķ�ʽ�������쳣��

<section>

ʵ��`HandlerExceptionResolver`�ӿڲ���ʵ���쳣�����Ψһ��ʽ����ֻ���ṩ��`resolveException(Exception, Hanlder)`������һ��ʵ�ֶ��ѣ������᷵��һ��`ModelAndView`������֮�⣬�㻹���Կ���ṩ��`SimpleMappingExceptionResolver`�����쳣��������ע��`@ExceptionHandler`��`SimpleMappingExceptionResolver`�������ȡ�����׳����쳣������֣�������ӳ�䵽һ����ͼ����ȥ������Servlet API�ṩ���쳣ӳ�������ǹ��ܵȼ۵ģ�����Ҳ���Ի��ڴ�ʵ�����ȸ���ϸ���쳣ӳ�䡣��`@ExceptionHandler`ע��ķ���������쳣�׳�ʱ�������Դ�����쳣�������ķ������Զ�����`@Controller`ע��Ŀ��������Ҳ���Զ�����`@ControllerAdvice`���У����߿���ʹ���쳣��������Ӧ�õ������`@Controller`�������С���һС�ڽ��ṩ��Ϊ��ϸ����Ϣ��

</section>







# Spring MVC ʹ��@ExceptionHandlerע��



2018-07-26 14:33 ����







<section>

`HandlerExceptionResolver`�ӿ��Լ�`SimpleMappingExceptionResolver`���������ʵ��ʹ����������ʽ�ؽ��쳣ӳ�䵽�ض�����ͼ�ϣ����������쳣��ת����forward������Ӧ����ͼǰʹ��Java������Щ�жϺ��߼���������һЩ�������ر�������`@ResponseBody`������Ӧ����������ͼ�������Ƶĳ����£�ֱ��������Ӧ��״̬�벢���ͻ�����Ҫ�Ĵ�����Ϣֱ��д����Ӧ���У������Ǹ�����ķ�����

��Ҳ����ʹ��`@ExceptionHandler`������������㡣���`@ExceptionHandler`�������ڿ������ڲ�����ģ���ô������ղ������ɿ������������κ����ࣩ�е�`@RequestMapping`�����׳����쳣������㽫`@ExceptionHandler`����������`@ControllerAdvice`���У���ô���ᴦ����ؿ��������׳����쳣������Ĵ����չʾ��һ�������ڿ������ڲ���`@ExceptionHandler`������

```
@Controller
public class SimpleController {

    // @RequestMapping methods omitted ...

    @ExceptionHandler(IOException.class)
    public ResponseEntity<String> handleIOException(IOException ex) {
        // prepare responseEntity
        return responseEntity;
    }

}

```

���⣬`@ExceptionHandler`ע�⻹���Խ���һ���쳣���͵�������Ϊ����ֵ�����׳��������б����������쳣����ô��Ӧ��`@ExceptionHandler`�������ᱻ���á����û�и�ע���κβ���ֵ����ôĬ�ϴ�����쳣���ͽ��Ƿ�����������������Щ�쳣��

���׼�Ŀ�����`@RequestMapping`ע�⴦����һ����`@ExceptionHandler`�����ķ��������ͷ���ֵҲ���Ժ������磬��Servlet�����·������Խ���`HttpServletRequest`��������Portlet�����·������Խ���`PortletRequest`����������ֵ������`String`���͡�����������»ᱻ����Ϊ��ͼ������������`ModelAndView`���͵Ķ���Ҳ������`ResponseEntity`�������㻹�����ڷ��������`@ResponseBody`ע����ʹ����Ϣת������ת����ϢΪ�ض����͵����ݣ�Ȼ�������д�ص���Ӧ���С�

</section>







# Spring MVC ����һ����쳣



2018-07-26 14:34 ����







��������Ĺ����У�Spring MVC���ܻ��׳�һЩ���쳣��`SimpleMappingExceptionResolver`���Ը�����Ҫ�ܷ���ؽ��κ��쳣ӳ�䵽һ��Ĭ�ϵĴ�����ͼ����������ͻ�����ͨ���Զ������Ӧ�ķ�ʽ���ַ������쳣�ģ���ô��˾���ҪΪ��Ӧ���ö�Ӧ��״̬�롣�����׳��쳣�����Ͳ�ͬ��������Ҫ���ò�ͬ��״̬������ʶ�ǿͻ��˴���4xx�����Ƿ������˴���5xx����

<section>

Ĭ�ϴ������쳣������`DefaultHandlerExceptionResolver`�ὫSpring MVC�׳����쳣ת���ɶ�Ӧ�Ĵ���״̬�롣�ý�������MVC�����ռ����û�MVC Java���õķ�ʽ��Ĭ���Ѿ���ע���ˣ����⣬ͨ��`DispatcherServlet`ע��Ҳ�ǿ��еģ�����ʹ��MVC�����ռ��Java��̷�ʽ�������õ�ʱ�򣩡��±��г��˸ý������ܴ����һЩ�쳣�������Ƕ�Ӧ��״̬�롣

| �쳣 | HTTP״̬�� |
| --- | --- |
| `BindException` | 400 (��Ч����) |
| `ConversionNotSupportedException` | 500 (�������ڲ�����) |
| `HttpMediaTypeNotAcceptableException` | 406 (������) |
| `HttpMediaTypeNotSupportedException` | 415 (��֧�ֵ�ý������) |
| `HttpMessageNotReadableException` | 400 (��Ч����) |
| `HttpMessageNotWritableException` | 500 (�������ڲ�����) |
| `HttpRequestMethodNotSupportedException` | 405 (��֧�ֵķ���) |
| `MethodArgumentNotValidException` | 400 (��Ч����) |
| `MissingServletRequestParameterException` | 400 (��Ч����) |
| `MissingServletRequestPartException` | 400 (��Ч����) |
| `NoHandlerFoundException` | 404 (����δ�ҵ�) |
| `NoSuchRequestHandlingMethodException` | 404 (����δ�ҵ�) |
| `TypeMismatchException` | 400 (��Ч����) |
| `MissingPathVariableException` | 500 (�������ڲ�����) |
| `NoHandlerFoundException` | 404 (����δ�ҵ�) |

���´����롣

The `DefaultHandlerExceptionResolver` works transparently by setting the status of the response. However, it stops short of writing any error content to the body of the response while your application may need to add developer- friendly content to every error response for example when providing a REST API. You can prepare a `ModelAndView` and render error content through view resolution?--?i.e. by configuring a `ContentNegotiatingViewResolver`, `MappingJackson2JsonView`, and so on. However, you may prefer to use`@ExceptionHandler` methods instead.

If you prefer to write error content via `@ExceptionHandler` methods you can extend `ResponseEntityExceptionHandler` instead. This is a convenient base for `@ControllerAdvice` classes providing an `@ExceptionHandler` method to handle standard Spring MVC exceptions and return `ResponseEntity`. That allows you to customize the response and write error content with message converters. See the `ResponseEntityExceptionHandler` javadocs for more details.

</section>







# Spring MVC ʹ��@ResponseStatusע��ҵ���쳣



2020-07-31 10:52 ����







ҵ���쳣����ʹ��`@ResponseStatus`��ע�⡣���쳣���׳�ʱ��`ResponseStatusExceptionResolver`��������Ӧ����Ӧ״̬�롣`DispatcherServlet`��Ĭ��ע��һ��`ResponseStatusExceptionResolver` �Թ�ʹ�á�

ResponseStatusע���ʹ�÷ǳ��򵥣����Ǵ���һ���쳣�࣬����ע��

```
package com.zj.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value=HttpStatus.FORBIDDEN,reason="�û���ƥ��")
public class UserNotMatchException extends RuntimeException{
}
```

> ResponseStatusע�����������
> �����������ԣ�value������http״̬�룬����404��500�ȡ�reason�Ǵ�����Ϣ

дһ��Ŀ�귽���׳����쳣

```
@RequestMapping("/testResponseStatus")
public String testResponseStatus(int i){
    if(i==0)
        throw new UserNotMatchException();
    return "hello";
}
```

> ʹ����ResponseStatusע��֮���û��������쳣�������������Լ�������쳣����������һ����û��������Ĵ��롣







# Spring MVC ��ServletĬ����������ҳ��Ķ��ƻ�



2018-07-26 14:36 ����







����Ӧ��״̬�뱻����Ϊ����״̬�룬������Ӧ����û������ʱ��Servlet����ͨ������Ⱦһ��HTML����ҳ������Ҫ��������Ĭ���ṩ�Ĵ���ҳ���������`web.xml`�ж���һ������ҳ��`<error-page>`Ԫ�ء���Servlet 3�淶����֮ǰ���ô���ҳԪ�ر��뱻��ʽָ��ӳ�䵽һ������Ĵ������һ���쳣���͡���Servlet 3��ʼ������ҳ������Ҫӳ�䵽������Ϣ�ˣ�����ζ�ţ���ָ����λ�þ��Ƕ�Servlet����Ĭ�ϴ���ҳ���Զ����ˡ�

<section>

```
<error-page>
    <location>/error</location>
</error-page>

```

�������ҳ��λ�����ڿ�����һ��JSPҳ�棬����������һЩURL��ֻҪ��ָ������������һ��`@Controller`�������µĴ�����������

д��`HttpServletResponse`�Ĵ�����Ϣ�ʹ���״̬������ڿ�������ͨ��������������ȡ��

```
@Controller
public class ErrorController {

    @RequestMapping(path = "/error", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public Map<String, Object> handle(HttpServletRequest request) {

        Map<String, Object> map = new HashMap<String, Object>();
        map.put("status", request.getAttribute("javax.servlet.error.status_code"));
        map.put("reason", request.getAttribute("javax.servlet.error.message"));

        return map;
    }

}

```

������JSP����ôʹ��:

```
<%@ page contentType="application/json" pageEncoding="UTF-8"%>
{
    status:<%=request.getAttribute("javax.servlet.error.status_code") %>,
    reason:<%=request.getAttribute("javax.servlet.error.message") %>
}
```

</section>



