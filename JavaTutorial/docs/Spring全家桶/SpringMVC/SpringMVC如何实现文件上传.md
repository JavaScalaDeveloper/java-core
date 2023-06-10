



# Spring MVC �ļ��ϴ�����










Spring���öԶ�·�ϴ���֧�֣�ר�����ڴ���webӦ���е��ļ��ϴ��������ͨ��ע��һ���ɲ�ε�`MultipartResolver`���������ö��ļ���·�ϴ���֧�֡��ýӿ��ڶ�����`org.springframework.web.multipart`���¡�SpringΪ[_һ����ļ��ϴ�_](http://jakarta.apache.org/commons/fileupload)�ṩ��`MultipartResolver`�ӿڵ�һ��ʵ�֣�ΪServlet 3.0��·�����ת���ṩ����һ��ʵ�֡�

<section>

Ĭ������£�Spring�Ķ�·�ϴ�֧���ǲ������ģ���Ϊ��Щ������ϣ�����Լ��������·�������������Spring�Ķ�·�ϴ�֧�֣�����Ҫ��webӦ�õ������������һ����·�����������ÿ�����������󣬽������������ǲ���һ���ಿ�����������������������ģ��������������̱������������������һ����·������������������ע���`MultipartResolver`�������ᱻ�������������֮�������еĶ�·�ϴ����Ծ�����������һ���������Դ��ˡ������һ�䷭�Ĳ��ã�multipart����ɶ�·���Ƕಿ�ֻ��������С����Ķ���ע��˴�����

</section>







# Spring MVC ʹ��MultipartResolver��Commons FileUpload�����ļ�



2018-07-26 14:28 ����







����Ĵ���չʾ�����ʹ��һ��ͨ�õĶ�·�ϴ�������`CommonsMultipartResolver`��

<section>

```
<bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver">

    <!-- ֧�ֵ�����һ�����ԣ�֧�ֵ�����ļ���С�����ֽ�Ϊ��λ -->
    <property name="maxUploadSize" value="100000"/>

</bean>

```

��Ȼ��Ҫ�ö�·��������������������Ҫ��classpath·����׼�������jar�������ʹ�õ���ͨ�õĶ�·�ϴ�������`CommonsMultipartResolver`��������Ҫ��jar����`commons-fileupload.jar`��

��Spring��`DispatcherServlet`��⵽һ���ಿ������ʱ�����ἤ�������������������Ķ�·�������������󽻸�������������ѵ�ǰ��`HttpServletRequest`��������װ��һ��֧�ֶ�·�ļ��ϴ����������`MultipartHttpServletRequest`������`MultipartHttpServletRequest`�����㲻�����Ի�ȡ�ö�·�����е���Ϣ������������Ŀ������л�øö�·��������ݱ���

</section>







# Spring MVC ����Servlet 3.0�µ�MultipartResolver



2018-07-26 14:29 ����







Ҫʹ�û���Servlet 3.0�Ķ�·����ת�����ܣ��������`web.xml`��Ϊ`DispatcherServlet`���һ��`multipart-config`Ԫ�أ�����ͨ��Servlet��̵ķ���ʹ��`javax.servlet.MultipartConfigElement`����ע�ᣬ�����Լ��������Լ���Servlet�࣬�������ʹ��`javax.servlet.annotation.MultipartConfig`�������ע�⡣������������ļ���С��洢λ�õ�����ѡ����������Servlet�������ע�ᣬ��ΪServlet 3.0�������ڽ�����MultipartResolver�Ĳ㼶������Щ��Ϣ��

<section>

����ͨ��������һ�ַ�ʽ������Servlet 3.0��·����ת�����ܣ���Ϳ��԰�һ��`StandardServletMultipartResolver`��������ӵ����Spring������ȥ�ˣ�

```
<bean id="multipartResolver" class="org.springframework.web.multipart.support.StandardServletMultipartResolver">
</bean>
```

</section>






# Spring MVC ������е��ļ��ϴ�



2018-07-26 14:30 ����







��������`MultipartResolver`��ɴ���ʱ������������������һ�����������̴������ȣ�����һ�������ļ��ϴ��ı�����������ֱ���ϴ����������������ԣ�`enctype="multipart/form-data"`�����������֪����ζԶ�·�ϴ�����ı����б��루encode����

<section>

```
<html>
    <head>
        <title>Upload a file please</title>
    </head>
    <body>
        <h1>Please upload a file</h1>
        <form method="post" action="/form" enctype="multipart/form-data">
            
            
            
        </form>
    </body>
</html>

```

��һ���Ǵ���һ���ܴ����ļ��ϴ��Ŀ�������������Ҫ�Ŀ�������[һ��ע����`@Controller`�Ŀ�����](http://docs.spring.io/spring-framework/docs/4.2.4.RELEASE/spring-framework-reference/html/mvc.html#mvc-ann-controller)����һ�������������ܵķ�������������`MultipartHttpServletRequest`����`MultipartFile`��

```
@Controller
public class FileUploadController {

    @RequestMapping(path = "/form", method = RequestMethod.POST)
    public String handleFormUpload(@RequestParam("name") String name, @RequestParam("file") MultipartFile file) {

        if (!file.isEmpty()) {
            byte[] bytes = file.getBytes();
            // store the bytes somewhere
            return "redirect:uploadSuccess";
        }

        return "redirect:uploadFailure";
    }

}

```

������`@RequestParam`ע������ν�����������Ӧ�����еĶ���������ֶεġ�������������У������õ���`byte[]`�ļ����ݣ�ֻ��û�������κ��¡���ʵ��Ӧ���У�����ܻὫ�����浽���ݿ⡢�洢���ļ�ϵͳ�ϣ����������Ĵ���

��ʹ��Servlet 3.0�Ķ�·����ת��ʱ����Ҳ����ʹ��`javax.servlet.http.Part`��Ϊ����������

```
@Controller
public class FileUploadController {

    @RequestMapping(path = "/form", method = RequestMethod.POST)
    public String handleFormUpload(@RequestParam("name") String name, @RequestParam("file") Part file) {

        InputStream inputStream = file.getInputStream();
        // store bytes from uploaded file somewhere

        return "redirect:uploadSuccess";
    }

}
```

</section>







# Spring MVC ����ͻ��˷�����ļ��ϴ�����



2018-07-26 14:30 ����







��ʹ����RESTful����ĳ����£���������Ŀͻ���Ҳ����ֱ���ύ��·�ļ�������һ�ڽ�������������������������Ҳ��ͬ�����á������������ͬ���ǣ��ύ���ļ��ͼ򵥵ı��ֶΣ��ͻ��˷��͵����ݿ��Ը��Ӹ��ӣ����ݿ���ָ��Ϊĳ���ض����������ͣ�content type���������磬һ����·�ϴ�������ܵ�һ�����Ǹ��ļ������ڶ������Ǹ�JSON��ʽ�����ݣ�

<section>

```
    POST /someUrl
    Content-Type: multipart/mixed

    --edt7Tfrdusa7r3lNQc79vXuhIIMlatb7PQg7Vp
    Content-Disposition: form-data; name="meta-data"
    Content-Type: application/json; charset=UTF-8
    Content-Transfer-Encoding: 8bit

    {
        "name": "value"
    }
    --edt7Tfrdusa7r3lNQc79vXuhIIMlatb7PQg7Vp
    Content-Disposition: form-data; name="file-data"; filename="file.properties"
    Content-Type: text/xml
    Content-Transfer-Encoding: 8bit
    ... File Data ...

```

��������Ϊ`meta-data`�Ĳ��֣������ͨ�������������ϵ�`@RequestParam("meta-data") String metadata`��������á��������ǲ�����������ΪJSON��ʽ���ݵ���������ܸ���ͨ������һ����Ӧ��ǿ���Ͷ��󣬾���`@RequestBody`ͨ��`HttpMessageConverter`��һ�������������ת����һ������һ����

���ǿ��ܵģ������ʹ��`@RequestPart`ע����ʵ�֣�����`@RequestParam`����ע�⽫ʹ���ض���·����������屻����`HttpMessageConverter`��������ת��ʱ���Ƕ�·�����в�ͬ���������Ͳ���`'Content-Type'`��

```
@RequestMapping(path = "/someUrl", method = RequestMethod.POST)
public String onSubmit(@RequestPart("meta-data") MetaData metadata, @RequestPart("file-data") MultipartFile file) {

    // ...

}

```

��ע��`MultipartFile`��������������ܹ���`@RequestParam`��`@RequestPart`ע���»��õģ����ַ��������õ����ݡ���������ķ�������`@RequestPart("meta-data") MetaData`�����Ϊ�����е�������������ͷ`'Content-Type'`�������ΪJSON���ݣ�Ȼ����ͨ��`MappingJackson2HttpMessageConverter`��ת�����ض��Ķ���

</section>




