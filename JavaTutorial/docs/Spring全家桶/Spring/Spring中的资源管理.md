## Resource �ӿ�

��Ա�׼ URL ���ʻ��ƣ�Spring �� `org.springframework.core.io.Resource` �ӿڳ����˶Եײ���Դ�ķ��ʽӿڣ��ṩ��һ�׸��õķ��ʷ�ʽ��



```
public interface Resource extends InputStreamSource {

    boolean exists();

    boolean isReadable();

    boolean isOpen();

    boolean isFile();

    URL getURL() throws IOException;

    URI getURI() throws IOException;

    File getFile() throws IOException;

    ReadableByteChannel readableChannel() throws IOException;

    long contentLength() throws IOException;

    long lastModified() throws IOException;

    Resource createRelative(String relativePath) throws IOException;

    String getFilename();

    String getDescription();
}

```



���� `Resource` �ӿڵĶ�����ʾ������չ�� `InputStreamSource` �ӿڡ�`Resource` ����ĵķ������£�

*   `getInputStream()` - ��λ���Ҵ򿪵�ǰ��Դ�����ص�ǰ��Դ�� `InputStream`��ÿ�ε��ö��᷵��һ���µ� `InputStream`����������Ҫ����ر�����
*   `exists()` - �жϵ�ǰ��Դ�Ƿ���Ĵ��ڡ�
*   `isOpen()` - �жϵ�ǰ��Դ�Ƿ���һ���Ѵ򿪵� `InputStream`�����Ϊ true���� `InputStream` ���ܱ���ζ�ȡ������ֻ��ȡһ��Ȼ��ر��Ա�����Դй©�������г�����Դʵ�ַ��� false��`InputStreamResource` ���⡣
*   `getDescription()` - ���ص�ǰ��Դ����������������Դ����ʱ����Դ�����������ڴ�����Ϣ�������һ����˵����Դ��������һ����ȫ�޶����ļ����ƣ������ǵ�ǰ��Դ����ʵ URL��

���� Spring ��Դ�ӿڣ�

| ���� | �ӿ� |
| --- | --- |
| ������ | `org.springframework.core.io.InputStreamSource` |
| ֻ����Դ | `org.springframework.core.io.Resource` |
| ��д��Դ | `org.springframework.core.io.WritableResource` |
| ������Դ | `org.springframework.core.io.support.EncodedResource` |
| ��������Դ | `org.springframework.core.io.ContextResource` |



![](https://raw.githubusercontent.com/dunwu/images/dev/snap/20221223155859.png)

## [#](https://dunwu.github.io/spring-tutorial/pages/a1549f/#%E5%86%85%E7%BD%AE%E7%9A%84-resource-%E5%AE%9E%E7%8E%B0)���õ� Resource ʵ��

Spring �����������õ� Resource ʵ�֣�

| ��Դ��Դ | ǰ׺ | ˵�� |
| --- | --- | --- |
| [`UrlResource`(opens new window)](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#resources-implementations-urlresource) | `file:`��`https:`��`ftp:` �� | `UrlResource` ��װ��һ�� `java.net.URL` ����**���ڷ��ʿ�ͨ�� URL ���ʵ��κζ���**�������ļ���HTTPS Ŀ�ꡢFTP Ŀ��ȡ����� URL ������ͨ����׼�����ַ�����ʽ��ʾ����˿���ʹ���ʵ��ı�׼��ǰ׺��ָʾһ�� URL ��������һ�� URL ���͵����� �������`file`�����ڷ����ļ�ϵͳ·����`https`������ͨ�� HTTPS Э�������Դ��`ftp`������ͨ�� FTP ������Դ�ȵȡ� |
| [`ClassPathResource`(opens new window)](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#resources-implementations-classpathresource) | `classpath:` | `ClassPathResource` **����·���ϼ�����Դ**����ʹ���߳������ļ����������������������ָ���� class �����е�����һ����������Դ�� |
| [`FileSystemResource`(opens new window)](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#resources-implementations-filesystemresource) | `file:` | `FileSystemResource` **�� `java.io.File` ����Դʵ��**������֧�� `java.nio.file.Path` ��Ӧ�� Spring �ı�׼���ַ���·������ת����`FileSystemResource` ֧�ֽ���Ϊ�ļ��� URL�� |
| [`PathResource`(opens new window)](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#resources-implementations-pathresource) | �� | `PathResource` �� `java.nio.file.Path` ����Դʵ�֡� |
| [`ServletContextResource`(opens new window)](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#resources-implementations-servletcontextresource) | �� | `ServletContextResource` **�� `ServletContext` ����Դʵ��**������ʾ��Ӧ Web Ӧ�ó����Ŀ¼�е����·���� |
| [`InputStreamResource`(opens new window)](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#resources-implementations-inputstreamresource) | �� | `InputStreamResource` **��ָ�� `InputStream` ����Դʵ��**��ע�⣺����� `InputStream` �ѱ��򿪣��򲻿��Զ�ζ�ȡ������ |
| [`ByteArrayResource`(opens new window)](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#resources-implementations-bytearrayresource) | �� | `ByteArrayResource` ��ָ���Ķ������������Դʵ�֡�����Ϊ�������ֽ����鴴��һ�� `ByteArrayInputStream`�� |



## [#](https://dunwu.github.io/spring-tutorial/pages/a1549f/#resourceloader-%E6%8E%A5%E5%8F%A3)ResourceLoader �ӿ�

`ResourceLoader` �ӿ����ڼ��� `Resource` �����䶨�����£�



```
public interface ResourceLoader {

    Resource getResource(String location);

    ClassLoader getClassLoader();
}

```



Spring ����Ҫ�� ResourceLoader ʵ�֣�

![](https://raw.githubusercontent.com/dunwu/images/dev/snap/20221223164745.png)

Spring �У����е� `ApplicationContext` ��ʵ���� `ResourceLoader` �ӿڡ���ˣ����� `ApplicationContext` ������ͨ�� `getResource()` ������ȡ `Resource` ʵ����

��ʾ����



```
// ���û��ָ����Դǰ׺��Spring �᳢�Է��غ��ʵ���Դ
Resource template = ctx.getResource("some/resource/path/myTemplate.txt");
// ���ָ�� classpath: ǰ׺��Spring ��ǿ��ʹ�� ClassPathResource
Resource template = ctx.getResource("classpath:some/resource/path/myTemplate.txt");
// ���ָ�� file:��http �� URL ǰ׺��Spring ��ǿ��ʹ�� UrlResource
Resource template = ctx.getResource("file:///some/resource/path/myTemplate.txt");
Resource template = ctx.getResource("http://myhost.com/resource/path/myTemplate.txt");

```



�±��о��� Spring ���ݸ���λ��·��������Դ�Ĳ��ԣ�

| ǰ׺ | ���� | ˵�� |
| --- | --- | --- |
| `classpath:` | `classpath:com/myapp/config.xml` | ����·������ |
| `file:` | `file:///data/config.xml` | �� URL ��ʽ���ļ�ϵͳ���� |
| `http:` | `http://myserver/logo.png` | �� URL ��ʽ���� |
| �� | `/data/config.xml` | �ɵײ�� ApplicationContext ʵ�־��� |



## [#](https://dunwu.github.io/spring-tutorial/pages/a1549f/#resourcepatternresolver-%E6%8E%A5%E5%8F%A3)ResourcePatternResolver �ӿ�

`ResourcePatternResolver` �ӿ��� `ResourceLoader` �ӿڵ���չ�����������Ƕ�����ԣ�����λ��ģʽ���� `Resource` ����



```
public interface ResourcePatternResolver extends ResourceLoader {

    String CLASSPATH_ALL_URL_PREFIX = "classpath*:";

    Resource[] getResources(String locationPattern) throws IOException;
}

```



`PathMatchingResourcePatternResolver` ��һ��������ʵ�֣������� `ApplicationContext` ֮��ʹ�ã�Ҳ���Ա� `ResourceArrayPropertyEditor` ������� `Resource[]` bean ���ԡ�`PathMatchingResourcePatternResolver` �ܹ���ָ������Դλ��·������Ϊһ������ƥ��� `Resource` ����

> ע�⣺�κα�׼ `ApplicationContext` �е�Ĭ�� `ResourceLoader` ʵ������ `PathMatchingResourcePatternResolver` ��һ��ʵ������ʵ���� `ResourcePatternResolver` �ӿڡ�

## [#](https://dunwu.github.io/spring-tutorial/pages/a1549f/#resourceloaderaware-%E6%8E%A5%E5%8F%A3)ResourceLoaderAware �ӿ�

`ResourceLoaderAware` �ӿ���һ������Ļص��ӿڣ���������ṩ `ResourceLoader` ���õĶ���`ResourceLoaderAware` �ӿڶ������£�



```
public interface ResourceLoaderAware {
    void setResourceLoader(ResourceLoader resourceLoader);
}

```



��һ����ʵ�� `ResourceLoaderAware` ������Ӧ�ó����������У���Ϊ Spring ����� bean��ʱ�����ᱻӦ�ó���������ʶ��Ϊ `ResourceLoaderAware`��Ȼ��Ӧ�ó��������Ļ���� `setResourceLoader(ResourceLoader)`����������Ϊ�����ṩ�����ס��Spring �е�����Ӧ�ó��������Ķ�ʵ�� `ResourceLoader` �ӿڣ���

���� `ApplicationContext` ��һ�� `ResourceLoader`���� bean ������ʵ�� `ApplicationContextAware` �ӿڲ�ֱ��ʹ���ṩ��Ӧ�ó�����������������Դ�� ���ǣ�һ����˵�������ֻ��Ҫ��Щ�����ʹ��ר�ŵ� `ResourceLoader` �ӿڡ� �ô��뽫����ϵ���Դ���ؽӿڣ����Ա���Ϊʵ�ó���ӿڣ���������ϵ����� Spring `ApplicationContext` �ӿڡ�

��Ӧ�ó����У�������ʹ�� `ResourceLoader` ���Զ�װ����Ϊʵ�� `ResourceLoaderAware` �ӿڵ������������ͳ�Ĺ��캯���� `byType` �Զ�װ��ģʽ�ܹ��ֱ�Ϊ���캯�������� setter ���������ṩ `ResourceLoader`�� Ϊ�˻�ø��������ԣ������Զ�װ���ֶκͶ�������������������뿼��ʹ�û���ע����Զ�װ�书�ܡ� ����������£�`ResourceLoader` ���Զ����ӵ���Ҫ `ResourceLoader` ���͵��ֶΡ����캯�������򷽷������У�ֻҪ����ֶΡ����캯���򷽷����� `@Autowired` ע�⼴�ɡ�

## [#](https://dunwu.github.io/spring-tutorial/pages/a1549f/#%E8%B5%84%E6%BA%90%E4%BE%9D%E8%B5%96)��Դ����

��� bean ����Ҫͨ��ĳ�ֶ�̬������ȷ�����ṩ��Դ·������ô bean ����ʹ�� `ResourceLoader` �� `ResourcePatternResolver` �ӿ���������Դ�� ���磬���Ǽ���ĳ��ģ�壬����������ض���Դȡ�����û��Ľ�ɫ�� �����Դ�Ǿ�̬�ģ���ȫ���� `ResourceLoader` �ӿڣ��� `ResourcePatternResolver` �ӿڣ���ʹ�ã��� bean ��������Ҫ�� `Resource` ���ԣ�������������ע��������������ġ�

ʹע����Щ���Ա�ü򵥵�ԭ��������Ӧ�ó��������Ķ�ע�Ტʹ��һ������� JavaBeans `PropertyEditor`�������Խ� `String` ·��ת��Ϊ `Resource` ���� ���磬����� MyBean ����һ�� `Resource` ���͵�ģ�����ԡ�

��ʾ����



```
<bean id="myBean" class="example.MyBean">
    <property name="template" value="some/resource/path/myTemplate.txt"/>
</bean>

```



��ע�⣬���������õ�ģ����Դ·��û��ǰ׺����ΪӦ�ó��������ı������� `ResourceLoader`����Դ����������Ҫͨ�� `ClassPathResource`��`FileSystemResource` �� ServletContextResource ���أ�����ȡ���������ĵ�ȷ�����͡�

�����Ҫǿ��ʹ���ض�����Դ���ͣ������ʹ��ǰ׺�� ��������ʾ����ʾ���ǿ��ʹ�� `ClassPathResource` �� `UrlResource`���������ڷ����ļ�ϵͳ�ļ�����



```
<property name="template" value="classpath:some/resource/path/myTemplate.txt">
<property name="template" value="file:///some/resource/path/myTemplate.txt"/>

```



����ͨ�� `@Value` ע�������Դ�ļ� `myTemplate.txt`��ʾ�����£�



```
@Component
public class MyBean {

    private final Resource template;

    public MyBean(@Value("${template.path}") Resource template) {
        this.template = template;
    }

    // ...
}

```



Spring �� `PropertyEditor` �������Դ�ļ���·���ַ��������� `Resource` ���󣬲�����ע�뵽 MyBean �Ĺ��췽����

�����Ҫ���ض����Դ�ļ�������ʹ�� `classpath*:` ǰ׺�����磺`classpath*:/config/templates/*.txt`��



```
@Component
public class MyBean {

    private final Resource[] templates;

    public MyBean(@Value("${templates.path}") Resource[] templates) {
        this.templates = templates;
    }

    // ...
}

```



## [#](https://dunwu.github.io/spring-tutorial/pages/a1549f/#%E5%BA%94%E7%94%A8%E4%B8%8A%E4%B8%8B%E6%96%87%E5%92%8C%E8%B5%84%E6%BA%90%E8%B7%AF%E5%BE%84)Ӧ�������ĺ���Դ·��

### [#](https://dunwu.github.io/spring-tutorial/pages/a1549f/#%E6%9E%84%E9%80%A0%E5%BA%94%E7%94%A8%E4%B8%8A%E4%B8%8B%E6%96%87)����Ӧ��������

Ӧ�������Ĺ��캯��������ض���Ӧ�����������ͣ�ͨ�����ַ������ַ���������Ϊ��Դ��λ��·�������繹�������Ķ���� XML �ļ���

��ʾ����



```
ApplicationContext ctx = new ClassPathXmlApplicationContext("conf/appContext.xml");
ApplicationContext ctx = new FileSystemXmlApplicationContext("conf/appContext.xml");
ApplicationContext ctx = new FileSystemXmlApplicationContext("classpath:conf/appContext.xml");
ApplicationContext ctx = new ClassPathXmlApplicationContext(
                new String[] {"services.xml", "daos.xml"}, MessengerService.class);

```



### [#](https://dunwu.github.io/spring-tutorial/pages/a1549f/#%E4%BD%BF%E7%94%A8%E9%80%9A%E9%85%8D%E7%AC%A6%E6%9E%84%E9%80%A0%E5%BA%94%E7%94%A8%E4%B8%8A%E4%B8%8B%E6%96%87)ʹ��ͨ�������Ӧ��������

ApplicationContext ���������е���Դ·�������ǵ�һ��·������һ��һ��ӳ�䵽Ŀ����Դ����Ҳ������ͨ�����ʽ�����ɰ��� classpath*��Ҳ������ǰ׺�� ant ����������ʽ��ʹ�� spring �� PathMatcher ��ƥ�䣩��

ʾ����



```
ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath*:conf/appContext.xml");

```



ʹ�� `classpath*` ��ʾ��·��������ƥ���ļ����Ƶ���Դ���ᱻ��ȡ(�����Ͼ��ǵ����� ClassLoader.getResources(��) �����������Ž���ȡ������Դ��װ�����յ�Ӧ�������ġ�

��λ��·�������ಿ�֣�`classpath*:` ǰ׺������ PathMatcher ���ʹ�ã��磺`classpath*:META-INF/*-beans.xml`��

## [#](https://dunwu.github.io/spring-tutorial/pages/a1549f/#%E9%97%AE%E9%A2%98)����

Spring ������Դ������Щ�������ͣ�

*   XML ��Դ
*   Properties ��Դ
*   YAML ��Դ

## [#](https://dunwu.github.io/spring-tutorial/pages/a1549f/#%E5%8F%82%E8%80%83%E8%B5%84%E6%96%99)�ο�����

*   [Spring �ٷ��ĵ�֮ Core Technologies(opens new window)](https://docs.spring.io/spring-framework/docs/current/spring-framework-reference/core.html#beans)
*   [��С��署 Spring ���ı��˼�롷](https://time.geekbang.org/course/intro/265)

# �ο�����
https://www.w3cschool.cn/wkspring
https://www.runoob.com/w3cnote/basic-knowledge-summary-of-spring.html
http://codepub.cn/2015/06/21/Basic-knowledge-summary-of-Spring
https://dunwu.github.io/spring-tutorial
https://mszlu.com/java/spring
http://c.biancheng.net/spring/aop-module.html