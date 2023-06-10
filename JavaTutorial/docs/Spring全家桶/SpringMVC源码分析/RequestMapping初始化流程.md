ǰ��������У����Ƿ����� `DispatcherServlet` ��ʼ�����̣����Ľ������� `RequestMapping` ��ʼ�����̡�������˵�� `RequestMapping` ��ʼ�����̣�ֱ����˵������ spring ���� `@RequestMaping` ע��Ĺ��̡�

### 1\. ��̸ `@EnableWebMvc`

�� [spring mvc ֮ springmvc demo �� @EnableWebMvc ע�� ](https://my.oschina.net/funcy/blog/4696657)һ�����ᵽ��spring ͨ�� `@EnableWebMvc` ע�������� mvc ���ܣ�����ͨ�� `@Import` ע��Ϊ��Ŀ������ `DelegatingWebMvcConfiguration.class`������ͨ�� `@Bean` ע��ķ����� spring ����������� mvc �����

*   `public RequestMappingHandlerMapping requestMappingHandlerMapping(...)`
*   `public PathMatcher mvcPathMatcher()`
*   `public UrlPathHelper mvcUrlPathHelper()`
*   ...

��ô����У��� `@RequestMaping` ע����ص������ `RequestMappingHandlerMapping`.

### 2. `RequestMappingHandlerMapping#afterPropertiesSet` ����

`RequestMappingHandlerMapping` �Ǵ������� `WebMvcConfigurationSupport` �У�

```
@Bean
public RequestMappingHandlerMapping requestMappingHandlerMapping(
        @Qualifier("mvcContentNegotiationManager") ContentNegotiationManager contentNegotiationManager,
        @Qualifier("mvcConversionService") FormattingConversionService conversionService,
        @Qualifier("mvcResourceUrlProvider") ResourceUrlProvider resourceUrlProvider) {

    // ����bean
    RequestMappingHandlerMapping mapping = createRequestMappingHandlerMapping();
    mapping.setOrder(0);
    mapping.setInterceptors(getInterceptors(conversionService, resourceUrlProvider));
    mapping.setContentNegotiationManager(contentNegotiationManager);
    mapping.setCorsConfigurations(getCorsConfigurations());

    // ����������ã����������һƪ�������ᵽ��getXxx()������ȡ����
    PathMatchConfigurer configurer = getPathMatchConfigurer();
    Boolean useSuffixPatternMatch = configurer.isUseSuffixPatternMatch();
    if (useSuffixPatternMatch != null) {
        mapping.setUseSuffixPatternMatch(useSuffixPatternMatch);
    }
    Boolean useRegisteredSuffixPatternMatch = configurer.isUseRegisteredSuffixPatternMatch();
    if (useRegisteredSuffixPatternMatch != null) {
        mapping.setUseRegisteredSuffixPatternMatch(useRegisteredSuffixPatternMatch);
    }
    Boolean useTrailingSlashMatch = configurer.isUseTrailingSlashMatch();
    if (useTrailingSlashMatch != null) {
        mapping.setUseTrailingSlashMatch(useTrailingSlashMatch);
    }
    UrlPathHelper pathHelper = configurer.getUrlPathHelper();
    if (pathHelper != null) {
        mapping.setUrlPathHelper(pathHelper);
    }
    PathMatcher pathMatcher = configurer.getPathMatcher();
    if (pathMatcher != null) {
        mapping.setPathMatcher(pathMatcher);
    }
    Map<String, Predicate<Class<?>>> pathPrefixes = configurer.getPathPrefixes();
    if (pathPrefixes != null) {
        mapping.setPathPrefixes(pathPrefixes);
    }

    return mapping;
}

// ��������
protected RequestMappingHandlerMapping createRequestMappingHandlerMapping() {
    return new RequestMappingHandlerMapping();
}

```

����������������������� `RequestMappingHandlerMapping` ����ģ����Ǵ�����һ������Ȼ�������˸������ԡ����󴴽��󣬼������� spring bean ���������ڣ��̶����� `RequestMappingHandlerMapping#afterPropertiesSet` ������

```
@Override
public void afterPropertiesSet() {
    // ������һЩ����
    this.config = new RequestMappingInfo.BuilderConfiguration();
    this.config.setUrlPathHelper(getUrlPathHelper());
    this.config.setPathMatcher(getPathMatcher());
    this.config.setSuffixPatternMatch(this.useSuffixPatternMatch);
    this.config.setTrailingSlashMatch(this.useTrailingSlashMatch);
    this.config.setRegisteredSuffixPatternMatch(this.useRegisteredSuffixPatternMatch);
    this.config.setContentNegotiationManager(getContentNegotiationManager());
    // ���ø���ķ���
    super.afterPropertiesSet();
}

```

����������� ������һЩ���ԣ�Ȼ���ٵ��ø���� `afterPropertiesSet()`������׷��ȥ��

> AbstractHandlerMethodMapping#afterPropertiesSet

```
@Override
public void afterPropertiesSet() {
    initHandlerMethods();
}

protected void initHandlerMethods() {
    // ����getCandidateBeanNames()��ȡ����������bean��beanName��
    // Ȼ�󰤸��������������� bean
    for (String beanName : getCandidateBeanNames()) {
        if (!beanName.startsWith(SCOPED_TARGET_NAME_PREFIX)) {
            // ��� bean �����������¿�
            processCandidateBean(beanName);
        }
    }
    // �������������һ����־��ûʲô����
    handlerMethodsInitialized(getHandlerMethods());
}

```

spring �ڴ���ʱ����ȡ������������ bean �� beanName��Ȼ��� beanName ���а������������� `AbstractHandlerMethodMapping#processCandidateBean`��

```
// ����bean�ľ����߼�
protected void processCandidateBean(String beanName) {
    // ��ȡ beanName ��Ӧ�� beanType
    // 1\. �����cglib����beanType Ϊ Xxx$$EnhancerBySpringCGLIB
    // 2\. �����jdk��̬����beanType Ϊ com.sum.proxy.$Proxy
    Class<?> beanType = null;
    try {
        beanType = obtainApplicationContext().getType(beanName);
    }
    catch (Throwable ex) {
        ...
    }
    // isHandler: beanType���Ƿ��� @Controller �� @RequestMapping ע��
    if (beanType != null && isHandler(beanType)) {
        // ���� handlerMethods
        detectHandlerMethods(beanName);
    }
}

```

����������ǱȽϼ򵥣���Ҫ�ǻ�ȡ `beanName` ��Ӧ�� `beanType`��Ȼ���ж��Ƿ��� `@Controller/@RequestMapping` ע�⣬֮��͵��� `AbstractHandlerMethodMapping#detectHandlerMethods` ��һ������

�������� `isHandler(Class)` ��Ҫ����˵���£�

1. ��ʶ�� `@Controller`��ͬ����ʶ�� `@RestController`������������ע `@Controller` ��ע�⣬����ʶ������ע�⣺

   ```
   // ����� @Controller
   @Controller
   // ʡ������ע��
   public @interface XxxController {
       ...
   }
   
   ```

2. ��� `beanName` ��Ӧ bean �� cglib ���� bean��beanType Ϊ `Xxx$$EnhancerBySpringCGLIB`����ʶ���丸�� (Ҳ����Ŀ����) �ϵ� `@Controller/@ReestMapping`;

3. ��� `beanName` ��Ӧ�� bean �� jdk ��̬���� bean��beanType Ϊ `com.sum.proxy.$Proxy`����ʶ���丸�ӿ��ϵ� `@Controller/@RequestMapping`;

4. ��� beanType �� `com.sum.proxy.$Proxy`(jdk ��̬������)��** �޷�ʶ����Ŀ�����ϵ� `@Controller/@RequestMapping` ** �ģ�

5. ��ע `@Controller/@RequestMapping` ����Ҫʵ�� jdk ��̬������Ҫ�� `@Controller/@RequestMapping` ���ڽӿڼ��ӿڵķ����ϡ�

����������� `AbstractHandlerMethodMapping#detectHandlerMethods` �� `beanType` ���Ǳ�ע�� `@Controller/@RequestMapping` �����ӿ��ˡ�

### 3. `AbstractHandlerMethodMapping#detectHandlerMethods`

�������� `AbstractHandlerMethodMapping#detectHandlerMethods` �����ݣ�

```
// ���handler����
protected void detectHandlerMethods(Object handler) {
    Class<?> handlerType = (handler instanceof String ?
            obtainApplicationContext().getType((String) handler) : handler.getClass());
    if (handlerType != null) {
        // 1\. ���cglib������󣬵õ��丸�࣬Ҳ����Ŀ��������
        Class<?> userType = ClassUtils.getUserClass(handlerType);
        // 2\. ����ᴦ�� userType��userType�Ĳ�����Object�����и��༰ userType �����нӿڵķ���
        Map<Method, T> methods = MethodIntrospector.selectMethods(userType,
                // 3\. ��ÿ������������� @RequestMapping���򴴽� RequestMappingInfo
                // �� @RequestMapping ��Ϣ��װ���ö�����
                (MethodIntrospector.MetadataLookup<T>) method -> {
                    try {
                        // �����ﴦ�����ϵ� @RequestMapping ע��
                        return getMappingForMethod(method, userType);
                    }
                    catch (Throwable ex) {
                        ...
                    }
                });
        methods.forEach((method, mapping) -> {
            Method invocableMethod = AopUtils.selectInvocableMethod(method, userType);
            // 4\. �����ｫhandler��mapping��method��������
            registerHandlerMethod(handler, invocableMethod, mapping);
        });
    }
}

```

��������������¼����£�

1.  ��� cglib ������󣬵õ��丸�࣬Ҳ����Ŀ�������ࣨ**����Ϊ��ֻ���� cglib ������󣬶������� jdk ��̬��������أ�** ������� `isHandler(Class)` ��˵����֪��spring ������ʶ�� jdk ��̬��������Ӧ���ϵ� `@Controller/@RequestMapping` ע�⣬��˲���ִ�е������
2.  ���� `userType`��`userType` �Ĳ����� Object �����и��༰ `userType` �����нӿڵķ�����
3.  ��ÿ������������� `@RequestMapping`���򴴽� `RequestMappingInfo`���� `@RequestMapping` ��Ϣ��װ���ö����У�
4.  ע�ᣬ�� `handler`��`mapping` �� `method` ���浽 Map �С�

#### 3.1 ���ҷ���

�� `detectHandlerMethods` �����Ĵ�������У������ `userType`��`userType` �����и��ࣨ������ Object���� `userType` �����нӿڵķ������������£�

> MethodIntrospector#selectMethods(Class, MethodIntrospector.MetadataLookup)

```
public static <T> Map<Method, T> selectMethods(Class<?> targetType, final 
            MetadataLookup<T> metadataLookup) {
    final Map<Method, T> methodMap = new LinkedHashMap<>();
    Set<Class<?>> handlerTypes = new LinkedHashSet<>();
    Class<?> specificHandlerType = null;
    // ��jdk��̬������
    if (!Proxy.isProxyClass(targetType)) {
        // �����cglib�����࣬��ȡ�����ĸ��� class
        specificHandlerType = ClassUtils.getUserClass(targetType);
        handlerTypes.add(specificHandlerType);
    }
    // ��ȡ������нӿڣ������ӿڵĸ��ӿ�.
    handlerTypes.addAll(ClassUtils.getAllInterfacesForClassAsSet(targetType));
    for (Class<?> currentHandlerType : handlerTypes) {
        final Class<?> targetClass = (specificHandlerType != null 
                      ? specificHandlerType : currentHandlerType);
        // ����currentHandlerType��currentHandlerType�Ĳ�����Object�����и��ࡢ
        // currentHandlerType�����нӿڵķ���
        // ����aopʱ�����õ�Ҳ���������
        ReflectionUtils.doWithMethods(currentHandlerType, method -> {
            Method specificMethod = ClassUtils.getMostSpecificMethod(method, targetClass);
            T result = metadataLookup.inspect(specificMethod);
            if (result != null) {
                Method bridgedMethod = BridgeMethodResolver.findBridgedMethod(specificMethod);
                if (bridgedMethod == specificMethod || 
                             metadataLookup.inspect(bridgedMethod) == null) {
                    methodMap.put(specificMethod, result);
                }
            }
        }, ReflectionUtils.USER_DECLARED_METHODS);
    }
    return methodMap;
}

```

#### 3.2 ���� `RequestMappingInfo`

��ÿ������������� `@RequestMapping`���򴴽� `RequestMappingInfo`���� `@RequestMapping` ��Ϣ��װ���ö����У�

> RequestMappingHandlerMapping#getMappingForMethod

```
protected RequestMappingInfo getMappingForMethod(Method method, Class<?> handlerType) {
    // �������ϵ� @RequestMapping
    RequestMappingInfo info = createRequestMappingInfo(method);
    if (info != null) {
        // �������ϵ� @RequestMapping
        RequestMappingInfo typeInfo = createRequestMappingInfo(handlerType);
        if (typeInfo != null) {
            // �ϲ����������ϵ� @RequestMapping ���
            // ����� @RequestMapping("/test")�������ϵ� @RequestMapping("/hello")
            // �ϲ���Ľ��Ϊ /test/hello
            info = typeInfo.combine(info);
        }
        String prefix = getPathPrefix(handlerType);
        if (prefix != null) {
            info = RequestMappingInfo.paths(prefix).options(this.config).build().combine(info);
        }
    }
    return info;
}

@Nullable
private RequestMappingInfo createRequestMappingInfo(AnnotatedElement element) {
    // ��ȡ @RequestMapping ע��
    RequestMapping requestMapping = AnnotatedElementUtils
            .findMergedAnnotation(element, RequestMapping.class);
    // ��������������ʵ�����������Ϊ��
    RequestCondition<?> condition = (element instanceof Class ?
            getCustomTypeCondition((Class<?>) element) : getCustomMethodCondition((Method) element));
    return (requestMapping != null ? createRequestMappingInfo(requestMapping, condition) : null);
}

// ���� RequestMappingInfo����� RequestMapping ���� @RequestMapping ע��
protected RequestMappingInfo createRequestMappingInfo(
        RequestMapping requestMapping, @Nullable RequestCondition<?> customCondition) {
    // ��ʵ���ǽ� @RequestMapping ע���װΪRequestMappingInfo����
    RequestMappingInfo.Builder builder = RequestMappingInfo
            .paths(resolveEmbeddedValuesInPatterns(requestMapping.path()))
            // ��������Խ����� @RequestMapping ע��
            .methods(requestMapping.method())
            .params(requestMapping.params())
            .headers(requestMapping.headers())
            .consumes(requestMapping.consumes())
            .produces(requestMapping.produces())
            .mappingName(requestMapping.name());
    if (customCondition != null) {
        builder.customCondition(customCondition);
    }
    return builder.options(this.config).build();
}

```

����������Ǿ�������� `@RequestMapping` �� `RequestMappingInfo����`��ת����

�������� `RequestMappingInfo` ��ʲô����

```
public final class RequestMappingInfo implements RequestCondition<RequestMappingInfo> {
    // �ṩ�˺ܶ����ԣ���Ӧ�� @RequestMapping������
    @Nullable
    private final String name;
    private final PatternsRequestCondition patternsCondition;
    private final RequestMethodsRequestCondition methodsCondition;
    private final ParamsRequestCondition paramsCondition;
    private final HeadersRequestCondition headersCondition;
    private final ConsumesRequestCondition consumesCondition;
    private final ProducesRequestCondition producesCondition;
    private final RequestConditionHolder customConditionHolder;

    // ���췽����������
    public RequestMappingInfo(@Nullable String name, @Nullable PatternsRequestCondition patterns,
            @Nullable RequestMethodsRequestCondition methods, @Nullable ParamsRequestCondition params,
            @Nullable HeadersRequestCondition headers, @Nullable ConsumesRequestCondition consumes,
            @Nullable ProducesRequestCondition produces, @Nullable RequestCondition<?> custom) {

        this.name = (StringUtils.hasText(name) ? name : null);
        this.patternsCondition = (patterns != null ? patterns : new PatternsRequestCondition());
        this.methodsCondition = (methods != null ? methods : new RequestMethodsRequestCondition());
        this.paramsCondition = (params != null ? params : new ParamsRequestCondition());
        this.headersCondition = (headers != null ? headers : new HeadersRequestCondition());
        this.consumesCondition = (consumes != null ? consumes : new ConsumesRequestCondition());
        this.producesCondition = (produces != null ? produces : new ProducesRequestCondition());
        this.customConditionHolder = new RequestConditionHolder(custom);
    }

    // builder ����ģʽ��ǰ������ʹ��builder������RequestMappingInfo�����
    private static class DefaultBuilder implements Builder {
        // ʡ������
        ...

        //  ʹ��builder()��������������
        @Override
        public RequestMappingInfo build() {
            ContentNegotiationManager manager = this.options.getContentNegotiationManager();
            PatternsRequestCondition patternsCondition = new PatternsRequestCondition(
                    this.paths, this.options.getUrlPathHelper(), this.options.getPathMatcher(),
                    this.options.useSuffixPatternMatch(), this.options.useTrailingSlashMatch(),
                    this.options.getFileExtensions());
            // ���� RequestMappingInfo ���췽��
            return new RequestMappingInfo(this.mappingName, patternsCondition,
                    new RequestMethodsRequestCondition(this.methods),
                    new ParamsRequestCondition(this.params),
                    new HeadersRequestCondition(this.headers),
                    new ConsumesRequestCondition(this.consumes, this.headers),
                    new ProducesRequestCondition(this.produces, this.headers, manager),
                    this.customCondition);
        }
    }
    // ʡ������
    ...
}

```

#### 3.3 ע��

��װ�� `@RequestMapping` ��Ϣ�󣬽��������ǽ��ӿ���Ϣע�ᵽ springmvc ���ˣ�

> RequestMappingHandlerMapping#registerHandlerMethod

```
@Override
protected void registerHandlerMethod(Object handler, Method method, RequestMappingInfo mapping) {
    // ���ø���ķ�����ע������߼�������
    super.registerHandlerMethod(handler, method, mapping);
    updateConsumesCondition(mapping, method);
}
// ������������ @RequestBody ע��
private void updateConsumesCondition(RequestMappingInfo info, Method method) {
    ConsumesRequestCondition condition = info.getConsumesCondition();
    if (!condition.isEmpty()) {
        for (Parameter parameter : method.getParameters()) {
            // ���� ���������� @RequestBody ע�⣬���� BodyRequired ��ֵ
            MergedAnnotation<RequestBody> annot = MergedAnnotations.from(parameter)
                    .get(RequestBody.class);
            if (annot.isPresent()) {
                condition.setBodyRequired(annot.getBoolean("required"));
                break;
            }
        }
    }
}

```

���գ����־����ע���߼����� `AbstractHandlerMethodMapping#registerHandlerMethod` ����ɵģ���������������շ����ˡ��ڷ����������ǰ����������������һ���õ��� `Map<Method, T> methods`:

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-ec6b4b2d2156e0e041982425173feda38fc.png)

���Կ�������Ӧ�� `T` ���� `RequestMappingInfo` �ˡ�

### 3. `AbstractHandlerMethodMapping#registerHandlerMethod` ����

���������������� `AbstractHandlerMethodMapping#registerHandlerMethod` ���룺

```
public abstract class AbstractHandlerMethodMapping<T> extends AbstractHandlerMapping 
        implements InitializingBean {

    protected void registerHandlerMethod(Object handler, Method method, T mapping) {
        this.mappingRegistry.register(mapping, handler, method);
    }

    // ʡ���˺ö����
    ... 

    class MappingRegistry {
        // ��Ϣ��ȫ��map������mapping, handlerMethod, directUrls, name����Ϣ
        private final Map<T, MappingRegistration<T>> registry = new HashMap<>();
        // ���е� mapping map��/test/hello��/test/{name}
        private final Map<T, HandlerMethod> mappingLookup = new LinkedHashMap<>();
        // ��ȷ��url map���� /test/hello
        private final MultiValueMap<String, T> urlLookup = new LinkedMultiValueMap<>();

        // ʡ���˺ö����
        ...

        public void register(T mapping, Object handler, Method method) {
            ...
            // ��ȡ��д����д��
            this.readWriteLock.writeLock().lock();
            try {
                // 1\. ��ȡ�� handlerMethod����ʵ���ǽ�handler �� method ��װ��һ��
                HandlerMethod handlerMethod = createHandlerMethod(handler, method);
                validateMethodMapping(handlerMethod, mapping);
                // 2\. ���� mappingLookup �У�����Ϊ LinkedHashMap
                // ����springmvc��һ����Ҫ��map
                this.mappingLookup.put(mapping, handlerMethod);

                // 3\. ��ȡurl������urlLookup������ΪMultiValueMap�����map ͬһkey�����ж��value
                // ����springmvc����һ����Ҫ��map
                List<String> directUrls = getDirectUrls(mapping);
                for (String url : directUrls) {
                    this.urlLookup.add(url, mapping);
                }
                String name = null;
                if (getNamingStrategy() != null) {
                    name = getNamingStrategy().getName(handlerMethod, mapping);
                    addMappingName(name, handlerMethod);
                }
                CorsConfiguration corsConfig = initCorsConfiguration(handler, method, mapping);
                if (corsConfig != null) {
                    this.corsLookup.put(handlerMethod, corsConfig);
                }

                // 4\. ��mapping, handlerMethod, directUrls, name�ȷ�װ����registry��
                // registry ����ΪHashMap������springmvc �нӿ���Ϣ��ȫ��һ��map
                this.registry.put(mapping, new MappingRegistration<>(mapping, 
                        handlerMethod, directUrls, name));
            }
            finally {
                this.readWriteLock.writeLock().unlock();
            }
        }
    }
}

```

���Կ�����ע����߼��������� `AbstractHandlerMethodMapping.MappingRegistry#register` ����ɵġ����������Ǿ�һ��������ע���߼���

#### 3.1 ��ȡ `HandlerMethod`

��ش������£�

```
protected HandlerMethod createHandlerMethod(Object handler, Method method) {
    if (handler instanceof String) {
        return new HandlerMethod((String) handler,
                obtainApplicationContext().getAutowireCapableBeanFactory(), method);
    }
    return new HandlerMethod(handler, method);
}

```

��η������Ǽ򵥵ص����� `HandlerMethod` �Ĺ��췽����������

```
public class HandlerMethod {

    // �ṩ�˷ǳ��������
    protected final Log logger = LogFactory.getLog(getClass());
    private final Object bean;
    @Nullable
    private final BeanFactory beanFactory;
    private final Class<?> beanType;
    private final Method method;
    private final Method bridgedMethod;
    private final MethodParameter[] parameters;
    @Nullable
    private HttpStatus responseStatus;
    @Nullable
    private String responseStatusReason;
    @Nullable
    private HandlerMethod resolvedFromHandlerMethod;
    @Nullable
    private volatile List<Annotation[][]> interfaceParameterAnnotations;
    private final String description;

    // ���췽��
    public HandlerMethod(Object bean, Method method) {
        Assert.notNull(bean, "Bean is required");
        Assert.notNull(method, "Method is required");
        this.bean = bean;
        this.beanFactory = null;
        this.beanType = ClassUtils.getUserClass(bean);
        this.method = method;
        this.bridgedMethod = BridgeMethodResolver.findBridgedMethod(method);
        this.parameters = initMethodParameters();
        evaluateResponseStatus();
        this.description = initDescription(this.beanType, this.method);
    }

    // ʡ������
    ...
}

```

���Կ�����`HandlerMethod` ���зǳ�������ԣ����췽����������Ҳ�����Ǹ�ֵ���ѡ��ɴ˿ɿ�����`HandlerMethod` ���Ƕ� `handler` �� `method` ��һ����װ��

#### 3.2 ��֤ mapping �Ƿ��ظ�

�� springmvc ʹ���У������С�Ķ�����������ͬ�� `requestMapping`������������쳣��

```
Caused by: java.lang.IllegalStateException: Ambiguous mapping. Cannot map 
'xxxController' method xxxMethod to /xxx/xxx: There is already 'xxxControllter' 
bean method xxxMethod mapped.

```

����쳣��������֤ mapping ʱ���������ظ��� mapping �������ģ��������£�

```
// ���е� mapping map��/test/hello��/test/{name}
private final Map<T, HandlerMethod> mappingLookup = new LinkedHashMap<>();

private void validateMethodMapping(HandlerMethod handlerMethod, T mapping) {
    // �ҵ��Ѵ��ڵ� method
    HandlerMethod existingHandlerMethod = this.mappingLookup.get(mapping);
    // �Ѵ��ڵ�handlerMethod��Ϊ�գ��Ҳ����ڵ�ǰ handlerMethod
    if (existingHandlerMethod != null && !existingHandlerMethod.equals(handlerMethod)) {
        throw new IllegalStateException(
                "Ambiguous mapping. Cannot map '" + handlerMethod.getBean() + "' method \n" +
                handlerMethod + "\nto " + mapping + ": There is already '" +
                existingHandlerMethod.getBean() + "' bean method\n" +
                existingHandlerMethod + " mapped.");
    }
}

```

�����Ǹ��� `mapping` �� `mappingLookup` �в��� `HandlerMethod`������ҵ������ҵ��� `handlerMethod` ���ǵ�ǰ `handlerMethod`�����ʾ�ظ����ͱ��쳣�ˡ�

���ֱ��������ж� `HandlerMethod` �� `RequestMappingInfo` ������ж���ȵģ�

> HandlerMethod#equals

```
@Override
public boolean equals(@Nullable Object other) {
    if (this == other) {
        return true;
    }
    if (!(other instanceof HandlerMethod)) {
        return false;
    }
    HandlerMethod otherMethod = (HandlerMethod) other;
    return (this.bean.equals(otherMethod.bean) && this.method.equals(otherMethod.method));
}

```

> RequestMappingInfo#equals

```
@Override
public boolean equals(@Nullable Object other) {
    if (this == other) {
        return true;
    }
    if (!(other instanceof RequestMappingInfo)) {
        return false;
    }
    RequestMappingInfo otherInfo = (RequestMappingInfo) other;
    return (this.patternsCondition.equals(otherInfo.patternsCondition) &&
            this.methodsCondition.equals(otherInfo.methodsCondition) &&
            this.paramsCondition.equals(otherInfo.paramsCondition) &&
            this.headersCondition.equals(otherInfo.headersCondition) &&
            this.consumesCondition.equals(otherInfo.consumesCondition) &&
            this.producesCondition.equals(otherInfo.producesCondition) &&
            this.customConditionHolder.equals(otherInfo.customConditionHolder));
}

```

`RequestMappingInfo` ��Ҫ��������ͬ���ж���ȣ���������������� `@RequestMapping`���õ��� `RequestMappingInfo` ������ȣ�

```
// �������� @RequestMapping����Ȼ����·�����ǡ�/hello������֧�ֵ����󷽷�������ͬ
// ��˵õ��� RequestMappingInfo �������

@RequestMapping(path = "/hello")
public String hello1() {
    ...
}

@RequestMapping(path = "/hello", method = RequestMethod.GET)
public String hello2() {
    ...
}

@RequestMapping(path = "/hello", method = RequestMethod.POST)
public String hello3() {
    ...
}

```

#### 3.3 ��ȡ `directUrls`

springmvc �У������� url ����:

1. ��ȷ�� url����

   ```
   @RequestMapping("/hello")
   public String hello() {
      ...
   }
   
   ```

2. ����ȷ�� url����

   ```
   @RequestMapping("/{name}")
   public String hello(@PathVariable("name") String name) {
      ...
   }
   
   ```

springmvc �ṩ��ר�ŵ� `urlLookup` ��������ȷ�� url���ṹ���£�

```
MultiValueMap<String, LinkedList<RequestMappingInfo>>

```

�������� springmvc ����λ�ȡ��ȷ�� url ��:

```
List<String> directUrls = getDirectUrls(mapping);

/**
 * AbstractHandlerMethodMapping.MappingRegistry#getDirectUrls
 * ��ȡ��ȷ��url
 */
private List<String> getDirectUrls(T mapping) {
    List<String> urls = new ArrayList<>(1);
    // ��RequestMappingInfo��ȡ���е� MappingPathPattern
    for (String path : getMappingPathPatterns(mapping)) {
        // �жϵõ��� MappingPathPattern �Ƿ�Ϊ��ȷ��url
        if (!getPathMatcher().isPattern(path)) {
            urls.add(path);
        }
    }
    return urls;
}

/**
 * RequestMappingInfoHandlerMapping#getMappingPathPatterns
 * ��ȡ patterns, �� RequestMappingInfo ��ȡ
 * ʵ���Ͼ��� @RequestMapping �е� path() ֵ
 */
@Override
protected Set<String> getMappingPathPatterns(RequestMappingInfo info) {
    return info.getPatternsCondition().getPatterns();
}

/**
 * AntPathMatcher#isPattern
 * �ж��Ƿ�Ϊ��ȷ�� url
 * ֻҪ������ *����֮һ����ͬʱ����{��}���Ͳ�����ȷ��url
 */
@Override
public boolean isPattern(@Nullable String path) {
    if (path == null) {
        return false;
    }
    boolean uriVar = false;
    for (int i = 0; i < path.length(); i++) {
        char c = path.charAt(i);
        if (c == '*' || c == '?') {
            return true;
        }
        if (c == '{') {
            uriVar = true;
            continue;
        }
        if (c == '}' && uriVar) {
            return true;
        }
    }
    return false;
}

```

�������£�

1.  ��ȡ��ǰ `mapping` ������ `path`��Ҳ���� `@RequestMapping` �� `path()` ֵ��
2.  �����õ��� `path`����һ�ж��Ƿ�Ϊ��ȷ�� url (ֻҪ������ `*`��`?` ֮һ����ͬʱ���� `{`��`}`���Ͳ�����ȷ�� url).

#### 3.4 ע��ӿ���Ϣ

ע��ӿ���Ϣ�ͱȽϼ��ˣ���ʵ������ map ��������ݣ������������ map��

*   `urlLookup`����ȷ�� `url map`������Ϊ `MultiValueMap<String, LinkedList<RequestMappingInfo>>`��`key` Ϊ��ȷ�� url���� `/test/hello`��`value` Ϊ `LinkedList<RequestMappingInfo>`��

*   `mappingLookup`�����е� `mapping map`�����е� `@RequestMapping` ��Ӧ�� `RequestMappingInfo` �����������ҵ������� `/test/hello`��`/test/{name}` ��Ӧ�� `RequestMappingInfo`������Ϊ `Map<RequestMappingInfo, HandlerMethod>`��

*   `registry`����Ϣ��ȫ�� map������Ϊ `Map<RequestMappingInfo, MappingRegistration<RequestMappingInfo>>`���������е� `RequestMappingInfo`��key Ϊ `RequestMappingInfo`��value Ϊ `MappingRegistration<RequestMappingInfo>`���� `MappingRegistration` Ϊ `mapping`, `handlerMethod`, `directUrls`, `name` �İ�װ�࣬Ҳ����˵ `MappingRegistration` ������ `mapping`, `handlerMethod`, `directUrls`, `name` ����Ϣ��

�����Щ map ��ע����൱���ˣ����Ǽ򵥵ص����� `Map#put` �������Ͳ���˵�ˡ�

### 4\. �ܽ�

���ķ����� spring ������ `@RequestMapping` ע������̣��ⲿ�������� `RequestMappingHandlerMapping#afterPropertiesSet` �����У��������£�

1.  ��ȡ���������� bean �� `beanName`������������������� 2 ����
2.  �ҵ��� `beanName` ��Ӧ�� `beanType`���ж������Ƿ��� `@Controller/@RequestMapping` ע�⣻
3.  �԰��� `@Controller/@RequestMapping` �� `beanType`���ҵ��� `@RequestMapping` ע��ķ��������� `@RequestMapping` ע���װΪ `RequestMappingInfo`����һ���õ��Ľ��Ϊһ�� map��`Map<Method, RequestMappingInfo>`��
4.  �� `beanName`��`beanType` �� `Map<Method, RequestMappingInfo>` ע�ᵽ springmvc �У������������Ƚ���Ҫ�� map��
   *   `MultiValueMap<String, LinkedList<RequestMappingInfo>>`��
   *   `Map<RequestMappingInfo, HandlerMethod>`(`HandlerMethod` Ϊ `Method` �İ�װ��)
   *   `Map<RequestMappingInfo, MappingRegistration<RequestMappingInfo>>`(`MappingRegistration` Ϊ `RequestMappingInfo`, `HandlerMethod`, `directUrls`, `beanName` �İ�װ��)��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-fe807564e60040b262b28977a46a74f60e9.png)

�ܵ���˵��`RequestMapping` �Ĵ����������رȽ������Ҳ�ǵ����˺ö�β��ҵ���

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4715079](https://my.oschina.net/funcy/blog/4715079) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_