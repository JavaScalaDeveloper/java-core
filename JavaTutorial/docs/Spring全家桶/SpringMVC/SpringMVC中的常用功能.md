



# Spring MVC ʹ��@Controllerע�ⶨ��һ��������



2018-07-26 14:02 ����







<section>

> [Original] The `@Controller` annotation indicates that a particular class serves the role of a controller. Spring does not require you to extend any controller base class or reference the Servlet API. However, you can still reference Servlet-specific features if you need to.

`@Controller`ע�������һ��������Ϊ�������Ľ�ɫ�����ڵġ�Spring��Ҫ����ȥ�̳��κο��������࣬Ҳ��Ҫ����ȥʵ��Servlet������API����Ȼ���������Ҫ�Ļ�Ҳ����ȥʹ���κ���Servlet��ص����Ժ���ʩ��

> [Original] The `@Controller` annotation acts as a stereotype for the annotated class, indicating its role. The dispatcher scans such annotated classes for mapped methods and detects `@RequestMapping` annotations (see the next section).

`@Controller`ע�������Ϊ�Ǳ���ע���ԭ�ͣ�stereotype������������������е��Ľ�ɫ����������`DispatcherServlet`����ɨ������ע����`@Controller`���࣬�������ͨ��`@RequestMapping`ע�����õķ����������һС�ڣ���

> [Original] You can define annotated controller beans explicitly, using a standard Spring bean definition in the dispatcher��s context. However, the `@Controller` stereotype also allows for autodetection, aligned with Spring general support for detecting component classes in the classpath and auto-registering bean definitions for them.

��Ȼ����Ҳ���Բ�ʹ��`@Controller`ע�����ʽ��ȥ���屻ע���bean�����ͨ����׼��Spring bean�Ķ��巽ʽ����dispather�����������������ü�������������`@Controller`ԭ���ǿ��Ա�����Զ����ģ�Spring֧��classpath·�����������Զ���⣬�Լ����Ѷ���bean���Զ�ע�ᡣ

> [Original] To enable autodetection of such annotated controllers, you add component scanning to your configuration. Use the spring-context schema as shown in the following XML snippet:

����Ҫ�������м������ɨ������ô�����������ܶ�ע����������Զ���⡣��ʹ������XML������ʾ��spring-context schema��

```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd">

    <context:component-scan base-package="org.springframework.samples.petclinic.web"/>

    <!-- ... -->

</beans>
```

</section>







# Spring MVC ʹ��@RequestMappingע��ӳ������·��



2018-07-26 15:29 ����







�����ʹ��`@RequestMapping`ע����������URL����`/appointments`�ȣ�ӳ�䵽�������ϻ�ĳ���ض��Ĵ����������ϡ�һ����˵���༶���ע�⸺��һ���ض��������ĳ��ģʽ��������·��ӳ�䵽һ���������ϣ�ͬʱͨ�����������ע����ϸ��ӳ�䣬�������ض���HTTP���󷽷�����GET����POST�������ȣ���HTTP�������Ƿ�Я���ض�������������������ӳ�䵽ƥ��ķ����ϡ�

<section>

������δ���ʾ������Petcare����չʾ����Spring MVC������ڿ�������ʹ��`@RequestMapping`ע�⣺

```
@Controller
@RequestMapping("/appointments")
public class AppointmentsController {

    private final AppointmentBook appointmentBook;

    @Autowired
    public AppointmentsController(AppointmentBook appointmentBook) {
        this.appointmentBook = appointmentBook;
    }

    @RequestMapping(method = RequestMethod.GET)
    public Map<String, Appointment> get() {
        return appointmentBook.getAppointmentsForToday();
    }

    @RequestMapping(path = "/{day}", method = RequestMethod.GET)
    public Map<String, Appointment> getForDay(@PathVariable @DateTimeFormat(iso=ISO.DATE) Date day, Model model) {
        return appointmentBook.getAppointmentsForDay(day);
    }

    @RequestMapping(path = "/new", method = RequestMethod.GET)
    public AppointmentForm getNewForm() {
        return new AppointmentForm();
    }

    @RequestMapping(method = RequestMethod.POST)
    public String add(@Valid AppointmentForm appointment, BindingResult result) {
        if (result.hasErrors()) {
            return "appointments/new";
        }
        appointmentBook.addAppointment(appointment);
        return "redirect:/appointments";
    }
}

```

�������ʾ���У����ط���ʹ�õ���`@RequestMapping`ע�⡣��һ��ʹ�õ����������༶��ģ���ָʾ������`/appointments`��ͷ��·�����ᱻӳ�䵽�������¡�`get()`�����ϵ�`@RequestMapping`ע�������·�������˽�һ��ϸ������������GET����������������һ������·��Ϊ`/appointments`��HTTP����ΪGET�����󣬽������ս��뵽�������������`add()`����Ҳ�������Ƶ�ϸ������`getNewForm()`������ͬʱע�����ܹ����ܵ������HTTP������·������������£�һ��·��Ϊ`appointments/new`��HTTP����ΪGET�����󽫻ᱻ�������������

`getForDay()`������չʾ��ʹ��`@RequestMapping`ע�����һ�����ɣ�URIģ�塣������URIģ�壬�����С�ڣ�

�༶���`@RequestMapping`ע�Ⲣ���Ǳ���ġ������õĻ������е�·�����Ǿ���·�����������·�������µĴ���ʾ������PetClinic����չʾ��һ�����ж�������������Ŀ�������

```
@Controller
public class ClinicController {

    private final Clinic clinic;

    @Autowired
    public ClinicController(Clinic clinic) {
        this.clinic = clinic;
    }

    @RequestMapping("/")
    public void welcomeHandler() {
    }

    @RequestMapping("/vets")
    public ModelMap vetsHandler() {
        return new ModelMap(this.clinic.getVets());
    }
}

```

���ϴ���û��ָ�����������GET��������PUT/POST������������`@RequestMapping`ע��Ĭ�ϻ�ӳ�����е�HTTP���󷽷�������������ĳ�����󷽷�������ע����ָ��֮`@RequestMapping(method=GET)`����С��Χ��

## @Controller���������棨AOP������

��ʱ������ϣ��������ʱʹ��AOP������װ�ο����������統��ֱ���ڿ�������ʹ��`@Transactional`ע��ʱ����������£������Ƽ�ʹ���༶���ڿ�������ʹ�ã��Ĵ���ʽ����һ���Ǵ����������Ĭ���������������������ʵ��һЩ�ӿڣ����ýӿ��ֲ�֧��Spring Context�Ļص�������`InitializingBean`, `*Aware`�Ƚӿڣ�����Ҫ�����༶��Ĵ���ͱ����ֶ������ˡ����磬ԭ���������ļ�`<tx:annotation-driven/>`��Ҫ��ʽ����Ϊ`<tx:annotation-driven proxy-target-/>`��

## Spring MVC 3.1������֧��@RequestMapping��һЩ��

> They are recommended for use and even required to take advantage of new features in Spring MVC 3.1 and going forward.

Spring 3.1��������һ����������ǿ`@RequestMapping`���ֱ���`RequestMappingHandlerMapping`��`RequestMappingHandlerAdapter`�������Ƽ�����һ�á��в���Spring MVC 3.1֮�����������ԣ�������ע�������Ǳ���ġ���MVC�����ռ��MVC Java������÷�ʽ�£������༰��������Ĭ���ǿ����ġ�������ʹ���������÷�ʽ��������Ա����ֶ����ò���ʹ�á���С�ڽ���Ҫ����һ�£��������֮ǰ��һЩ��Ҫ�仯��

��Spring 3.1֮ǰ����ܻ���������ͬ�Ľ׶ηֱ����༶��ͷ������������ӳ�䡪�����ȣ�`DefaultAnnotationHanlderMapping`�������༶����ѡ��һ����������Ȼ����ͨ��`AnnotationMethodHandlerAdapter`��λ������Ҫ���õķ�����

> [Original] With the new support classes in Spring 3.1, the `RequestMappingHandlerMapping` is the only place where a decision is made about which method should process the request. Think of controller methods as a collection of unique endpoints with mappings for each method derived from type and method-level `@RequestMapping` information.

��������Spring 3.1��������������࣬`RequestMappingHandlerMapping`��Ϊ������������ʵ�ʷ�����Ψһһ���ط�������԰ѿ������е�һϵ�д�����������һϵ�ж����ķ���ڵ㣬ÿ�����༶��ͷ��������`@RequestMapping`ע���л�ȡ���㹻����1·��ӳ����Ϣ��

> [Original] This enables some new possibilities. For once a `HandlerInterceptor` or a `HandlerExceptionResolver` can now expect the Object-based handler to be a `HandlerMethod`, which allows them to examine the exact method, its parameters and associated annotations. The processing for a URL no longer needs to be split across different controllers.

�����µĴ���ʽ�������µĿ����ԡ�֮ǰ��`HandlerInterceptor`��`HandlerExceptionResolver`���ڿ���ȷ���õ�������������϶���һ��`HandlerMethod`���ͣ�������ܹ���ȷ���˽����������������Ϣ���������Ĳ�����Ӧ�������ϵ�ע��ȡ��������ڲ�����һ��URL�Ĵ���������Ҳ����Ҫ�ָ�����ͬ�Ŀ���������ȥִ���ˡ�

> [Original] There are also several things no longer possible: [Original] _Select a controller first with a `SimpleUrlHandlerMapping` or `BeanNameUrlHandlerMapping` and then narrow the method based on `@RequestMapping` annotations. [Original] _Rely on method names as a fall-back mechanism to disambiguate between two `@RequestMapping` methods that don��t have an explicit path mapping URL path but otherwise match equally, e.g. by HTTP method. In the new support classes `@RequestMapping` methods have to be mapped uniquely. [Original] * Have a single default method (without an explicit path mapping) with which requests are processed if no other controller method matches more concretely. In the new support classes if a matching method is not found a 404 error is raised.

ͬʱ��Ҳ��������һЩ�仯��������Щ�����û����ô����ˣ�

*   ��ͨ��`SimpleUrlHandlerMapping`��`BeanNameUrlHandlerMapping`���õ�����������Ŀ�������Ȼ��ͨ��`@RequestMapping`ע�����õ���Ϣ����λ������Ĵ�������
*   ����������������Ϊѡ�������ı�׼������˵������ע����`@RequestMapping`�ķ������˷�������ӵ����ȫ��ͬ��URLӳ���HTTP���󷽷������°汾�£�`@RequestMapping`ע��ķ����������Ψһ������ӳ�䣻
*   ����һ��Ĭ�Ϸ�������û������·��ӳ�䣩��������·���޷���ӳ�䵽�������¸���ȷ�ķ�����ȥʱ��Ϊ�������ṩĬ�ϴ������°汾�У�����޷�Ϊһ�������ҵ����ʵĴ���������ôһ��404���󽫱��׳���

> [Original] The above features are still supported with the existing support classes. However to take advantage of new Spring MVC 3.1 features you��ll need to use the new support classes.

���ʹ��ԭ�����࣬���ϵĹ��ܻ��ǿ������������ǣ����Ҫ����Spring MVC 3.1�汾�����ķ������ԣ������Ҫȥʹ���µ��ࡣ

> [Original] ## URI Template Patterns

## URIģ��

> [Original] URI templates can be used for convenient access to selected parts of a URL in a `@RequestMapping` method.

URIģ�����Ϊ���ٷ���`@RequestMapping`��ָ����URL��һ���ض��Ĳ����ṩ�ܴ�ı�����

> [Original] A URI Template is a URI-like string, containing one or more variable names. When you substitute values for these variables, the template becomes a URI. The proposed RFC for URI Templates defines how a URI is parameterized. For example, the URI Template `http://www.example.com/users/{userId}` contains the variable userId. Assigning the value fred to the variable yields `http://www.example.com/users/fred`.

URIģ����һ��������URI���ַ�����ֻ�������а�����һ�������ı�����������ʹ��ʵ�ʵ�ֵȥ�����Щ��������ʱ��ģ����˻�����һ��URI����URIģ���RFC�����ж�����һ��URI����ν��в������ġ�����˵��һ�����URIģ��`http://www.example.com/users/{userId}`�Ͱ�����һ��������_userId_����ֵ_fred_������������������ͱ����һ��URI��`http://www.example.com/users/fred`��

> [Original] In Spring MVC you can use the `@PathVariable` annotation on a method argument to bind it to the value of a URI template variable:

��Spring MVC��������ڷ���������ʹ��`@PathVariable`ע�⣬������URIģ���еĲ�����������

```
@RequestMapping(path="/owners/{ownerId}", method=RequestMethod.GET)
public String findOwner(@PathVariable String ownerId, Model model) {
    Owner owner = ownerService.findOwner(ownerId);
    model.addAttribute("owner", owner);
    return "displayOwner";
}

```

> [Original] The URI Template "`/owners/{ownerId}`" specifies the variable name `ownerId`. When the controller handles this request, the value of `ownerId` is set to the value found in the appropriate part of the URI. For example, when a request comes in for `/owners/fred`, the value of `ownerId` is `fred`.

URIģ��"`/owners/{ownerId}`"ָ����һ����������Ϊ`ownerId`����������������������ʱ��`ownerId`��ֵ�ͻᱻURIģ���ж�Ӧ���ֵ�ֵ����䡣����˵����������URI��`/owners/fred`����ʱ����`ownerId`��ֵ����`fred`. `

> Ϊ�˴���`@PathVariables`ע�⣬Spring MVC����ͨ�����������ҵ�URIģ�������Ӧ�ı������������ע����ֱ��������
>
> ```
> @RequestMapping(path="/owners/{ownerId}}", method=RequestMethod.GET)
> public String findOwner(@PathVariable("ownerId") String theOwner, Model model) {
>     // ����ķ������롭
> }
> 
> ```
>
> ���ߣ����URIģ���еı������뷽���Ĳ���������ͬ�ģ�������Բ�����ָ��һ�Ρ�ֻҪ���ڱ����ʱ������debug��Ϣ��Spring MVC�Ϳ����Զ�ƥ��URLģ�����뷽����������ͬ�ı�������
>
> ```
> @RequestMapping(path="/owners/{ownerId}", method=RequestMethod.GET)
> public String findOwner(@PathVariable String ownerId, Model model) {
>     // ����ķ������롭
> }
> 
> ```
>
> [Original] A method can have any number of `@PathVariable` annotations:

һ����������ӵ������������`@PathVariable`ע�⣺

```
@RequestMapping(path="/owners/{ownerId}/pets/{petId}", method=RequestMethod.GET)
public String findPet(@PathVariable String ownerId, @PathVariable String petId, Model model) {
    Owner owner = ownerService.findOwner(ownerId);
    Pet pet = owner.getPet(petId);
    model.addAttribute("pet", pet);
    return "displayPet";
}

```

> [Original] When a `@PathVariable` annotation is used on a `Map<String, String>` argument, the map is populated with all URI template variables.

��`@PathVariable`ע�ⱻӦ����`Map<String, String>`���͵Ĳ�����ʱ����ܻ�ʹ������URIģ�������������map��

> [Original] A URI template can be assembled from type and path level _@RequestMapping_ annotations. As a result the `findPet()` method can be invoked with a URL such as `/owners/42/pets/21`.

URIģ����Դ��༶��ͷ�������� _@RequestMapping_ ע���ȡ���ݡ���ˣ���������`findPet()`�������Ա�������`/owners/42/pets/21`������URL·�ɲ����õ���

```
_@Controller_
@RequestMapping("/owners/{ownerId}")
public class RelativePathUriTemplateController {

    @RequestMapping("/pets/{petId}")
    public void findPet(_@PathVariable_ String ownerId, _@PathVariable_ String petId, Model model) {
        // ����ʵ�����������
    }

}

```

> [Original] A `@PathVariable` argument can be of _any simple type_ such as int, long, Date, etc. Spring automatically converts to the appropriate type or throws a `TypeMismatchException` if it fails to do so. You can also register support for parsing additional data types. See [the section called "Method Parameters And Type Conversion"](https://linesh.gitbooks.io/spring-mvc-documentation-linesh-translation/content/publish/21-3/mvc.html#mvc-ann-typeconversion) and [the section called "Customizing WebDataBinder initialization"](https://linesh.gitbooks.io/spring-mvc-documentation-linesh-translation/content/publish/21-3/mvc.html#mvc-ann-webdatabinder).

`@PathVariable`���Ա�Ӧ�������� _������_ �Ĳ����ϣ�����int��long��Date�����͡�Spring���Զ��ذ���Ѳ���ת���ɺ��ʵ����ͣ����ת��ʧ�ܣ����׳�һ��`TypeMismatchException`���������Ҫ���������������͵�ת����Ҳ����ע���Լ����ࡣ����Ҫ����ϸ����Ϣ���Բο�[����������������ת����һ��](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-typeconversion)��[������WebDataBinder��ʼ�����̡�һ��](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-webdatabinder)

## ��������ʽ��URIģ��

> [Original] Sometimes you need more precision in defining URI template variables. Consider the URL `"/spring-web/spring-web-3.0.5.jar"`. How do you break it down into multiple parts?

��ʱ���������Ҫ��׼ȷ������һ��URIģ��ı���������˵���URL��`"/spring-web/spring-web-3.0.5.jar`����Ҫ��ô�����ֽ�ɼ���������Ĳ����أ�

> [Original] The `@RequestMapping` annotation supports the use of regular expressions in URI template variables. The syntax is `{varName:regex}` where the first part defines the variable name and the second - the regular expression.For example:

`@RequestMapping`ע��֧������URIģ�������ʹ��������ʽ���﷨��`{varName:regex}`�����е�һ���ֶ����˱��������ڶ����־�������ҪӦ�õ�������ʽ����������Ĵ���������

```
@RequestMapping("/spring-web/{symbolicName:[a-z-]+}-{version:\\d\\.\\d\\.\\d}{extension:\\.[a-z]+}")
    public void handle(@PathVariable String version, @PathVariable String extension) {
        // ���벿��ʡ��...
    }
}

```

## Path Patterns�����÷������׵���ζ��

> [Original] In addition to URI templates, the `@RequestMapping` annotation also supports Ant-style path patterns (for example, `/myPath/*.do`). A combination of URI template variables and Ant-style globs is also supported (e.g. `/owners/*/pets/{petId}`).

����URIģ���⣬`@RequestMapping`ע�⻹֧��Ant����·��ģʽ����`/myPath/*.do`�ȣ���������ˣ������԰�URIģ�������Ant����glob�������ʹ�ã�����`/owners/*/pets/{petId}`�������÷��ȣ���

## ·����ʽ��ƥ��(Path Pattern Comparison)

> [Original] When a URL matches multiple patterns, a sort is used to find the most specific match.

��һ��URLͬʱƥ����ģ�壨pattern��ʱ�����ǽ���Ҫһ���㷨������������ƥ���һ����

> [Original] A pattern with a lower count of URI variables and wild cards is considered more specific. For example `/hotels/{hotel}/*` has 1 URI variable and 1 wild card and is considered more specific than `/hotels/{hotel}/**` which as 1 URI variable and 2 wild cards.

URIģ���������Ŀ��ͨ����������ܺ����ٵ��Ǹ�·��ģ���׼ȷ���ٸ����ӣ�`/hotels/{hotel}/*`���·��ӵ��һ��URI������һ��ͨ�������`/hotels/{hotel}/**`���·����ӵ��һ��URI����������ͨ�������ˣ�������Ϊǰ���Ǹ�׼ȷ��·��ģ�塣

> [Original] If two patterns have the same count, the one that is longer is considered more specific. For example `/foo/bar*` is longer and considered more specific than `/foo/*`.

�������ģ���URIģ��������ͨ��������ܺ�һ�£���·���������Ǹ�ģ���׼ȷ���ٸ����ӣ�`/foo/bar*`�ͱ���Ϊ��`/foo/*`��׼ȷ����Ϊǰ�ߵ�·��������

> [Original] When two patterns have the same count and length, the pattern with fewer wild cards is considered more specific. For example `/hotels/{hotel}` is more specific than `/hotels/*`.

�������ģ��������ͳ��Ⱦ�һ�£����Ǹ����и���ͨ�����ģ���Ǹ���׼ȷ�ġ����磬`/hotels/{hotel}`�ͱ�`/hotels/*`����ȷ��

> [Original] There are also some additional special rules:

����֮�⣬����һЩ�����Ĺ���

> [Original] _The **default mapping pattern** `/*_`is less specific than any other pattern. For example`/api/{a}/{b}/{c}` is more specific.
>
> [Original] _A **prefix pattern** such as `/public/*_`is less specific than any other pattern that doesn't contain double wildcards. For example`/public/path3/{a}/{b}/{c}` is more specific.

*   **Ĭ�ϵ�ͨ��ģʽ**`/**`���������е�ģʽ��������׼ȷ�����ȷ�˵��`/api/{a}/{b}/{c}`�ͱ�Ĭ�ϵ�ͨ��ģʽ`/**`Ҫ��׼ȷ
*   **ǰ׺ͨ��**������`/public/**`)����Ϊ�������κβ�����˫ͨ�����ģʽ����׼ȷ������˵��`/public/path3/{a}/{b}/{c}`�ͱ�`/public/**`��׼ȷ

> [Original] For the full details see `AntPatternComparator` in `AntPathMatcher`. Note that the PathMatcher can be customized (see [Section 21.16.11, "Path Matching"](https://linesh.gitbooks.io/spring-mvc-documentation-linesh-translation/content/publish/21-3/mvc.html#mvc-config-path-matching) in the section on configuring Spring MVC).

�����ϸ����ο��������ࣺ`AntPatternComparator`��`AntPathMatcher`��ֵ��һ����ǣ�PathMatcher���ǿ������õģ���������Spring MVC��һ���е�[·����ƥ��](https://www.w3cschool.cn/spring_mvc_documentation_linesh_translation/spring_mvc_documentation_linesh_translation-cgvo27t2.html)һ��)��

## ��ռλ����·��ģʽ��path patterns��

> [Original] Patterns in `@RequestMapping` annotations support ${��} placeholders against local properties and/or system properties and environment variables. This may be useful in cases where the path a controller is mapped to may need to be customized through configuration. For more information on placeholders, see the javadocs of the `PropertyPlaceholderConfigurer` class.

`@RequestMapping`ע��֧����·����ʹ��ռλ������ȡ��һЩ�������á�ϵͳ���á����������ȡ����������ʱ�����ã�����˵��������ӳ��·����Ҫͨ�����������Ƶĳ�����������˽�������ռλ������Ϣ�����Բο�`PropertyPlaceholderConfigurer`�������ĵ���

## Suffix Pattern Matching

## ��׺ģʽƥ��

> [Original] By default Spring MVC performs `".*"` suffix pattern matching so that a controller mapped to `/person` is also implicitly mapped to `/person.*`. This makes it easy to request different representations of a resource through the URL path (e.g. `/person.pdf`, `/person.xml`).

Spring MVCĬ�ϲ���`".*"`�ĺ�׺ģʽƥ��������·��ƥ�䣬��ˣ�һ��ӳ�䵽`/person`·���Ŀ�����Ҳ����ʽ�ر�ӳ�䵽`/person.*`����ʹ��ͨ��URL������ͬһ��Դ�ļ��Ĳ�ͬ��ʽ��ø��򵥣�����`/person.pdf`��`/person.xml`����

> [Original] Suffix pattern matching can be turned off or restricted to a set of path extensions explicitly registered for content negotiation purposes. This is generally recommended to minimize ambiguity with common request mappings such as `/person/{id}` where a dot might not represent a file extension, e.g. `/person/joe@email.com` vs `/person/joe@email.com.json)`. Furthermore as explained in the note below suffix pattern matching as well as content negotiation may be used in some circumstances to attempt malicious attacks and there are good reasons to restrict them meaningfully.

����Թر�Ĭ�ϵĺ�׺ģʽƥ�䣬������ʽ�ؽ�·����׺�޶���һЩ�ض���ʽ��for content negotiation purpose�������Ƽ����������������Լ���ӳ������ʱ���Դ�����һЩ�����ԣ�������������·��`/person/{id}`ʱ��·���еĵ�ź�����Ŀ��ܲ����������ݸ�ʽ������`/person/joe@email.com` vs `/person/joe@email.com.json`������������������Ҫ�ᵽ�ģ���׺ģʽͨ���Լ�����Э����ʱ���ܻᱻ�ڿ��������й�������ˣ��Ժ�׺ͨ�������������޶����кô��ġ�

> [Original] See [Section 21.16.11, "Path Matching"](https://linesh.gitbooks.io/spring-mvc-documentation-linesh-translation/content/publish/21-3/mvc.html#mvc-config-path-matching) for suffix pattern matching configuration and also [Section 21.16.6, "Content Negotiation"](https://linesh.gitbooks.io/spring-mvc-documentation-linesh-translation/content/publish/21-3/mvc.html#mvc-config-content-negotiation) for content negotiation configuration.

���ں�׺ģʽƥ����������⣬���Բο�[Spring MVC·��ƥ������](https://www.w3cschool.cn/spring_mvc_documentation_linesh_translation/spring_mvc_documentation_linesh_translation-cgvo27t2.html)����������Э�̵��������⣬���Բο�[Spring MVC ����Э��"](https://www.w3cschool.cn/spring_mvc_documentation_linesh_translation/spring_mvc_documentation_linesh_translation-h8br27sx.html)�����ݡ�

## ��׺ģʽƥ����RFD

> [Original] Reflected file download (RFD) attack was first described in a [paper by Trustwave](https://www.trustwave.com/Resources/SpiderLabs-Blog/Reflected-File-Download---A-New-Web-Attack-Vector/) in 2014\. The attack is similar to XSS in that it relies on input (e.g. query parameter, URI variable) being reflected in the response. However instead of inserting JavaScript into HTML, an RFD attack relies on the browser switching to perform a download and treating the response as an executable script if double-clicked based on the file extension (e.g. .bat, .cmd).

RFD(Reflected file download)����������2014����[Trustwave��һƪ����](https://www.trustwave.com/Resources/SpiderLabs-Blog/Reflected-File-Download---A-New-Web-Attack-Vector/)�б�����ġ�����XSS������Щ���ƣ���Ϊ���ֹ�����ʽҲ������ĳЩ����������Ҫ������루�����ѯ������URI�����ȣ���Ҳ�������response������ĳ����ʽ���֡���ͬ���ǣ�RFD����������ͨ����HTML��д��JavaScript������У��������������������ת������ҳ�棬�����ض���ʽ������.bat��.cmd�ȣ���response�����ǿ�ִ�нű���˫�����ͻ�ִ�С�

> [Original] In Spring MVC `@ResponseBody` and `ResponseEntity` methods are at risk because they can render different content types which clients can request including via URL path extensions. Note however that neither disabling suffix pattern matching nor disabling the use of path extensions for content negotiation purposes alone are effective at preventing RFD attacks.

Spring MVC��`@ResponseBody`��`ResponseEntity`�������з��յģ���Ϊ���ǻ���ݿͻ������󡪡�����URL��·����׺������Ⱦ��ͬ���������͡���ˣ����ú�׺ģʽƥ����߽��ý�Ϊ����Э�̿�����·���ļ���׺��Я�������Ƿ���RFD��������Ч��ʽ��

> [Original] For comprehensive protection against RFD, prior to rendering the response body Spring MVC adds a `Content-Disposition:inline;filename=f.txt` header to suggest a fixed and safe download file filename. This is done only if the URL path contains a file extension that is neither whitelisted nor explicitly registered for content negotiation purposes. However it may potentially have side effects when URLs are typed directly into a browser.

��Ҫ������RFD���߼��ı���ģʽ��������Spring MVC��Ⱦ��ʼ��������֮ǰ��������ͷ������һ������`Content-Disposition:inline;filename=f.txt`��ָ���̶��������ļ����ļ����������URL·���а�����һ���ļ�����������������չ��ʱ���ã�����չ���Ȳ��������б����������У�Ҳû�б���ʽ�ر�ע��������Э��ʱʹ�á���������������������һЩ�����ã����磬��URL��ͨ��������ֶ������ʱ��

> [Original] Many common path extensions are whitelisted by default. Furthermore REST API calls are typically not meant to be used as URLs directly in browsers. Nevertheless applications that use custom `HttpMessageConverter` implementations can explicitly register file extensions for content negotiation and the Content-Disposition header will not be added for such extensions. See [Section 21.16.6, "Content Negotiation"](https://linesh.gitbooks.io/spring-mvc-documentation-linesh-translation/content/publish/21-3/mvc.html#mvc-config-content-negotiation).

�ܶೣ�õ�·���ļ���׺Ĭ���Ǳ����εġ����⣬REST��APIһ���ǲ�Ӧ��ֱ������URL�ġ�������������Լ�����`HttpMessageConverter`��ʵ�֣�Ȼ����ʽ��ע����������Э�̵��ļ����ͣ�����������Content-Dispositionͷ�����ᱻ���뵽����ͷ�С����[Spring MVC ����Э��](https://www.w3cschool.cn/spring_mvc_documentation_linesh_translation/spring_mvc_documentation_linesh_translation-h8br27sx.html)��

> [Original] This was originally introduced as part of work for [CVE-2015-5211](http://pivotal.io/security/cve-2015-5211). Below are additional recommendations from the report:
>
> *   Encode rather than escape JSON responses. This is also an OWASP XSS recommendation. For an example of how to do that with Spring see [spring-jackson-owasp](https://github.com/rwinch/spring-jackson-owasp).
> *   Configure suffix pattern matching to be turned off or restricted to explicitly registered suffixes only.
> *   Configure content negotiation with the properties "useJaf" and "ignoreUnknownPathExtensions" set to false which would result in a 406 response for URLs with unknown extensions. Note however that this may not be an option if URLs are naturally expected to have a dot towards the end.
> *   Add `X-Content-Type-Options: nosniff` header to responses. Spring Security 4 does this by default.

�о���ڵķ������������ޣ���Ҫ�����˽�XSS������RFD������ϸ���ٷ���

## �������

> [Original] The URI specification [RFC 3986](http://tools.ietf.org/html/rfc3986#section-3.3) defines the possibility of including name-value pairs within path segments. There is no specific term used in the spec. The general "URI path parameters" could be applied although the more unique ["Matrix URIs"](http://www.w3.org/DesignIssues/MatrixURIs.html), originating from an old post by Tim Berners-Lee, is also frequently used and fairly well known. Within Spring MVC these are referred to as matrix variables.

ԭ����URI�淶[RFC 3986](http://tools.ietf.org/html/rfc3986#section-3.3)��������·��������Я����ֵ�ԣ����淶û����ȷ�������ļ�ֵ�Զ���������˽С�URI·����������Ҳ�н�[������URI��](http://www.w3.org/DesignIssues/MatrixURIs.html)�ġ�������Tim Berners-Lee�������䲩�����ᵽ�������ʹ�õ�Ҫ����Ƶ��һЩ��֪����Ҳ����Щ������Spring MVC�У����ǳ������ļ�ֵ��Ϊ���������

> [Original] Matrix variables can appear in any path segment, each matrix variable separated with a ";" (semicolon). For example: `"/cars;color=red;year=2012"`. Multiple values may be either "," (comma) separated `"color=red,green,blue"` or the variable name may be repeated `"color=red;color=green;color=blue"`.

��������������κ�·�������г��֣�ÿ�Ծ������֮��ʹ��һ���ֺš�;������������������URI��`"/cars;color=red;year=2012"`�����ֵ�����ö��Ÿ���`"color=red,green,blue"`�������ظ����������`"color=red;color=green;color=blue"`��

> [Original] If a URL is expected to contain matrix variables, the request mapping pattern must represent them with a URI template. This ensures the request can be matched correctly regardless of whether matrix variables are present or not and in what order they are provided.

���һ��URL�п�����Ҫ���������������ô������·����ӳ�������Ͼ���Ҫʹ��URIģ����������һ�㡣��������ȷ��������Ա���ȷ��ӳ�䣬�����ܾ��������URI���Ƿ���֡����ֵĴ����������ȡ�

> [Original] Below is an example of extracting the matrix variable "q":

������һ�����ӣ�չʾ��������δӾ�������л�ȡ��������q����ֵ��

```
// GET /pets/42;q=11;r=22

@RequestMapping(path = "/pets/{petId}", method = RequestMethod.GET)
public void findPet(@PathVariable String petId, @MatrixVariable int q) {

    // petId == 42
    // q == 11

}

```

> [Original] Since all path segments may contain matrix variables, in some cases you need to be more specific to identify where the variable is expected to be:

��������·�������ж����Ժ��о����������ĳЩ�����£�����Ҫ�ø���ȷ����Ϣ��ָ��һ�����������λ�ã�

```
// GET /owners/42;q=11/pets/21;q=22

@RequestMapping(path = "/owners/{ownerId}/pets/{petId}", method = RequestMethod.GET)
public void findPet(
    @MatrixVariable(name="q", pathVar="ownerId") int q1,
    @MatrixVariable(name="q", pathVar="petId") int q2) {

    // q1 == 11
    // q2 == 22

}

```

> [Original] A matrix variable may be defined as optional and a default value specified:

��Ҳ��������һ������������Ǳ�����ֵģ���������һ��Ĭ��ֵ��

```
// GET /pets/42

@RequestMapping(path = "/pets/{petId}", method = RequestMethod.GET)
public void findPet(@MatrixVariable(required=false, defaultValue="1") int q) {

    // q == 1

}

```

> [Original] All matrix variables may be obtained in a Map:

Ҳ����ͨ��һ��Map���洢���еľ��������

```
// GET /owners/42;q=11;r=12/pets/21;q=22;s=23

@RequestMapping(path = "/owners/{ownerId}/pets/{petId}", method = RequestMethod.GET)
public void findPet(
    @MatrixVariable Map<String, String> matrixVars,
    @MatrixVariable(pathVar="petId") Map<String, String> petMatrixVars) {

    // matrixVars: ["q" : [11,22], "r" : 12, "s" : 23]
    // petMatrixVars: ["q" : 11, "s" : 23]

}

```

> [Original] Note that to enable the use of matrix variables, you must set the `removeSemicolonContent`property of `RequestMappingHandlerMapping` to `false`. By default it is set to `true`.

���Ҫ������������ʹ�ã�������`RequestMappingHandlerMapping`���`removeSemicolonContent`��������Ϊ`false`����ֵĬ����`true`�ġ�

> [Original] The MVC Java config and the MVC namespace both provide options for enabling the use of matrix variables.
>
> MVC��Java������ú������ռ����ö��ṩ�����þ�������ķ�ʽ��
>
> [Original] If you are using Java config, The [Advanced Customizations with MVC Java Config](https://linesh.gitbooks.io/spring-mvc-documentation-linesh-translation/content/publish/21-3/mvc.html#mvc-config-advanced-java) section describes how the `RequestMappingHandlerMapping` can be customized.
>
> �������ʹ��Java��̵ķ�ʽ��[��MVC Java�߼����ƻ����á�һ��](http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-config-advanced-java)��������ζ�`RequestMappingHandlerMapping`���ж��ơ�
>
> [Original] In the MVC namespace, the `<mvc:annotation-driven>` element has an `enable-matrix-variables` attribute that should be set to `true`. By default it is set to `false`.
>
> ��ʹ��MVC�������ռ�����ʱ������԰�`<mvc:annotation-driven>`Ԫ���µ�`enable-matrix-variables`��������Ϊ`true`����ֵĬ�������������Ϊ`false`�ġ�

```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:mvc="http://www.springframework.org/schema/mvc"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/mvc
        http://www.springframework.org/schema/mvc/spring-mvc.xsd">

    <mvc:annotation-driven enable-matrix-variables="true"/>

</beans>

```

## �����ѵ�ý������

> [Original] You can narrow the primary mapping by specifying a list of consumable media types. The request will be matched only if the _Content-Type_ request header matches the specified media type. For example:

�����ָ��һ������ѵ�ý�����ͣ���Сӳ��ķ�Χ������ֻ�е�����ͷ�� _Content-Type_ ��ֵ��ָ�������ѵ�ý������������ͬ��ʱ������Żᱻƥ�䡣��������������ӣ�

```
@Controller
@RequestMapping(path = "/pets", method = RequestMethod.POST, consumes="application/json")
public void addPet(@RequestBody Pet pet, Model model) {
    // ����ʵ��ʡ��
}

```

> [Original] Consumable media type expressions can also be negated as in _!text/plain_ to match to all requests other than those with _Content-Type_ of _text/plain_. Also consider using constants provided in `MediaType` such as `APPLICATION_JSON_VALUE` and `APPLICATION_JSON_UTF8_VALUE`.

ָ��������ý�����͵ı��ʽ�л�����ʹ�÷񶨣����磬����ʹ�� _!text/plain_ ��ƥ����������ͷ _Content-Type_ �в��� _text/plain_ ������ͬʱ����`MediaType`���л�������һЩ����������`APPLICATION_JSON_VALUE`��`APPLICATION_JSON_UTF8_VALUE`�ȣ��Ƽ������ʹ�����ǡ�

> [Original] The _consumes_ condition is supported on the type and on the method level. Unlike most other conditions, when used at the type level, method-level consumable types override rather than extend type-level consumable types.
>
> _consumes_ �����ṩ���Ƿ�����������֧�֡����������Բ�ͬ���������ͼ�ʹ��ʱ�����������������ͽ��������ͼ������ã����Ǽ̳й�ϵ��

## ��������ý������

> [Original] You can narrow the primary mapping by specifying a list of producible media types. The request will be matched only if the _Accept_ request header matches one of these values. Furthermore, use of the _produces_ condition ensures the actual content type used to generate the response respects the media types specified in the _produces_ condition. For example:

�����ָ��һ���������ý�����ͣ���Сӳ��ķ�Χ������ֻ�е�����ͷ�� _Accept_ ��ֵ��ָ����������ý������������ͬ��ʱ������Żᱻƥ�䡣���ң�ʹ�� _produces_ ��������ȷ������������Ӧ��response����������ָ���Ŀ�������ý����������ͬ�ġ��ٸ����ӣ�

```
@Controller
@RequestMapping(path = "/pets/{petId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
@ResponseBody
public Pet getPet(@PathVariable String petId, Model model) {
    // ����ʵ��ʡ��
}

```

> [Original] Be aware that the media type specified in the _produces_ condition can also optionally specify a character set. For example, in the code snippet above we specify the same media type than the default one configured in `MappingJackson2HttpMessageConverter`, including the `UTF-8`charset.
>
> Ҫע����ǣ�ͨ�� _condition_ ����ָ����ý������Ҳ����ָ���ַ����������������С�δ����У����ǻ��Ǹ�д��`MappingJackson2HttpMessageConverter`����Ĭ�����õ�ý�����ͣ�ͬʱ����ָ����ʹ��`UTF-8`���ַ�����
>
> [Original] Just like with _consumes_, producible media type expressions can be negated as in _!text/plain_ to match to all requests other than those with an _Accept_ header value of _text/plain_. Also consider using constants provided in `MediaType` such as `APPLICATION_JSON_VALUE` and `APPLICATION_JSON_UTF8_VALUE`.

�� _consumes_ �������ƣ���������ý�����ͱ��ʽҲ����ʹ�÷񶨡����磬����ʹ�� _!text/plain_ ��ƥ����������ͷ _Accept_ �в��� _text/plain_ ������ͬʱ����`MediaType`���л�������һЩ����������`APPLICATION_JSON_VALUE`��`APPLICATION_JSON_UTF8_VALUE`�ȣ��Ƽ������ʹ�����ǡ�

> [Original] The _produces_ condition is supported on the type and on the method level. Unlike most other conditions, when used at the type level, method-level producible types override rather than extend type-level producible types.
>
> _produces_ �����ṩ���Ƿ�����������֧�֡����������Բ�ͬ���������ͼ�ʹ��ʱ�����������������ͽ��������ͼ������ã����Ǽ̳й�ϵ��

## �������������ͷ��ֵ

> [Original] You can narrow request matching through request parameter conditions such as `"myParam"`, `"!myParam"`, or `"myParam=myValue"`. The first two test for request parameter presence/absence and the third for a specific parameter value. Here is an example with a request parameter value condition:

�����ɸѡ�����������������С����ƥ�䷶Χ������`"myParam"`��`"!myParam"`��`"myParam=myValue"`�ȡ�ǰ������������ɸѡ����/������ĳЩ������������󣬵���������ɸѡ�����ض�����ֵ�����������и����ӣ�չʾ�����ʹ���������ֵ��ɸѡ������

```
@Controller
@RequestMapping("/owners/{ownerId}")
public class RelativePathUriTemplateController {

    @RequestMapping(path = "/pets/{petId}", method = RequestMethod.GET, params="myParam=myValue")
    public void findPet(@PathVariable String ownerId, @PathVariable String petId, Model model) {
        // ʵ��ʵ��ʡ��
    }

}

```

> [Original] The same can be done to test for request header presence/absence or to match based on a specific request header value:

ͬ�������������ͬ��������ɸѡ����ͷ�ĳ�����񣬻���ɸѡ��һ�������ض�ֵ������ͷ��

```
@Controller
@RequestMapping("/owners/{ownerId}")
public class RelativePathUriTemplateController {

    @RequestMapping(path = "/pets", method = RequestMethod.GET, headers="myHeader=myValue")
    public void findPet(@PathVariable String ownerId, @PathVariable String petId, Model model) {
        // ������ʵ��ʡ��
    }

}

```

> [Original] Although you can match to _Content-Type_ and _Accept_ header values using media type wild cards (for example _"content-type=text/*"_ will match to _"text/plain"_ and _"text/html"_), it is recommended to use the _consumes_ and _produces_ conditions respectively instead. They are intended specifically for that purpose.
>
> ���ܣ������ʹ��ý�����͵�ͨ��������� _"content-type=text/*"_����ƥ������ͷ _Content-Type_�� _Accept_��ֵ�������Ǹ��Ƽ�����ʹ�� _consumes_�� _produces_������ɸѡ���Ե�������Ϊ���Ǿ���ר��Ϊ���������ֲ�ͬ�ĳ��������ġ�

</section>



