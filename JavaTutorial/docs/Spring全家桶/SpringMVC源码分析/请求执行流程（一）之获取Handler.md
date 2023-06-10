��һƪ�������Ƿ��� `RequestMapping` ��ʼ�����̣����Ľ����� spring mvc ������ִ�����̡�

### 1\. �����ִ�����

�� [spring mvc ֮ DispatcherServlet ��ʼ������](https://my.oschina.net/funcy/blog/4710330 "spring mvc֮DispatcherServlet ��ʼ������")һ���У���������������� `servlet` ��������� `DispatcherServlet` ��������һϵ�г�ʼ�����̣����Ľ�����Χ����� `servlet` ���� `springmvc` ���������̡�

#### 1.1 �ع� servlet ��ִ����ڣ�

�ڷ��� `DispatcherServlet` ǰ����Ҫ�ع��� servlet ��ִ����ڡ�

������ʵ���Զ���� servlet ʱ��һ����ʵ�� `HttpServlet`��Ȼ����д `doGet(xxx)`��`doPost()` ��������ʵ���� servlet Ϊ `HttpServlet#service(ServletRequest, ServletResponse)`��

```
public abstract class HttpServlet extends GenericServlet {
    ...

    // ������������˲�������ת��
    @Override
    public void service(ServletRequest req, ServletResponse res)
        throws ServletException, IOException {

        HttpServletRequest  request;
        HttpServletResponse response;

        // �����ﴦ�����������ת��
        try {
            request = (HttpServletRequest) req;
            response = (HttpServletResponse) res;
        } catch (ClassCastException e) {
            throw new ServletException(lStrings.getString("http.non_http"));
        }
        service(request, response);
    }

    /**
     * �����ﴦ������
     * �Ӵ�����Կ������������ʵ����һ��ת�����ж����󷽷���Ȼ����þ���ķ���ִ��
     */
    protected void service(HttpServletRequest req, HttpServletResponse resp)
        throws ServletException, IOException {

        String method = req.getMethod();

        // �жϵ����󷽷���Ȼ���ҵ���Ӧ�ķ���ȥִ��
        if (method.equals(METHOD_GET)) {
            long lastModified = getLastModified(req);
            if (lastModified == -1) {
                doGet(req, resp);
            } else {
                ...
                doGet(req, resp);
            }
        } else if (method.equals(METHOD_HEAD)) {
            long lastModified = getLastModified(req);
            maybeSetLastModified(resp, lastModified);
            doHead(req, resp);
        } else if (method.equals(METHOD_POST)) {
            doPost(req, resp);
        } else if (method.equals(METHOD_PUT)) {
            doPut(req, resp);
        } else if (method.equals(METHOD_DELETE)) {
            doDelete(req, resp);
        } else if (method.equals(METHOD_OPTIONS)) {
            doOptions(req,resp);
        } else if (method.equals(METHOD_TRACE)) {
            doTrace(req,resp);
        } else {
            // û�ж�Ӧ�ķ���������
            ...
        }
    }

}

```

������ servlet Դ�룬�����Ƚϼ򵥣��ص㲿�ֶ�����ע�ͣ�������������Ҫ�ٴ�ǿ���£�

1.  servlet ��ִ�����Ϊ `HttpServlet#service(ServletRequest, ServletResponse)`��
2.  `HttpServlet#service(HttpServletRequest, HttpServletResponse)` ������������󷽷��ҵ���Ӧ�Ĵ�����ִ�У�һ����˵�������Զ��� servlet��ֻҪ��д `doGet(xxx)`��`doPost(xxx)` �ȷ������ɡ�

�������̴�����£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-60d0e2afcbdb75a175c6f28471fc467f0e5.png)

#### 1.2 `DispatcherServlet` �ĸ��ࣺ`FrameworkServlet`

�˽��� servlet ��������ں󣬽������͵÷���һ�����ò�������ˣ�`FrameworkServlet`��`FrameworkServlet` �� `HttpServlet` �����࣬ʵ���� `HttpServlet` �ĸ��� `doXxx()`��ͬʱҲʵ���� `service(HttpServletRequest, HttpServletResponse)`��

```
/**
 *  FrameworkServlet�̳���HttpServletBean����HttpServletBean�̳���HttpServlet
 *  ���FrameworkServletҲ��HttpServlet������
 */
public abstract class FrameworkServlet extends HttpServletBean implements ApplicationContextAware {
    @Override
    protected final void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    protected final void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    protected final void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    protected final void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpMethod httpMethod = HttpMethod.resolve(request.getMethod());
        if (httpMethod == HttpMethod.PATCH || httpMethod == null) {
            processRequest(request, response);
        }
        else {
            // GET/POST/PUT/DELETE �����󷽷������ǻ���ø���ķ���
            super.service(request, response);
        }
    }
}

```

���Կ��������ϴ����У���һ�������ĳ������൱�ߣ�`FrameworkServlet#processRequest`�������� `doXxx(xxx)`������ `service(xxx)`��������� `processRequest(xxx)`�����������Ǿ������������������ʲô��

> FrameworkServlet#processRequest

```
protected final void processRequest(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
    // ��¼��ʼʱ��
    long startTime = System.currentTimeMillis();
    Throwable failureCause = null;
    // ��¼��ǰ�̵߳���Ϣ
    LocaleContext previousLocaleContext = LocaleContextHolder.getLocaleContext();
    LocaleContext localeContext = buildLocaleContext(request);
    RequestAttributes previousAttributes = RequestContextHolder.getRequestAttributes();
    ServletRequestAttributes requestAttributes = buildRequestAttributes(
            request, response, previousAttributes);
    WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager(request);
    asyncManager.registerCallableInterceptor(FrameworkServlet.class.getName(), 
             new RequestBindingInterceptor());
    initContextHolders(request, localeContext, requestAttributes);
    try {
        // ���Ĵ���
        doService(request, response);
    }
    catch (ServletException | IOException ex) {
        failureCause = ex;
        throw ex;
    }
    catch (Throwable ex) {
        failureCause = ex;
        throw new NestedServletException("Request processing failed", ex);
    }
    finally {
        // ����̰߳���Ϣ
        resetContextHolders(request, previousLocaleContext, previousAttributes);
        if (requestAttributes != null) {
            requestAttributes.requestCompleted();
        }
        logResult(request, response, failureCause, asyncManager);
        // �����¼�֪ͨ
        publishRequestHandledEvent(request, response, startTime, failureCause);
    }
}

```

���������Ȼ�е㳤�����󲿷������������̹�ϵ������������������ص�ֻ�м��У�

```
    ...
    try {
        // ���Ĵ���
        doService(request, response);
    }
    catch (ServletException | IOException ex) {
        failureCause = ex;
        throw ex;
    }
    ...

```

�ɴ˿��Կ�����ʵ�ʴ�������ķ������� `FrameworkServlet#doService` �С�������`FrameworkServlet#doService` �Ǹ����󷽷���

```
protected abstract void doService(HttpServletRequest request, 
        HttpServletResponse response) throws Exception;

```

������ʵ���������࣬Ҳ���� `DispatcherServlet#doService` �С�

#### 1.3 `DispatcherServlet#doService`

������ `DispatcherServlet#doService` ����ɶ�£�

```
public class DispatcherServlet extends FrameworkServlet {
    @Override
    protected void doService(HttpServletRequest request, 
            HttpServletResponse response) throws Exception {
        logRequest(request);
        // ʡ����һ�����������
        ...
        try {
            // ����Ĵ���
            doDispatch(request, response);
        }
        finally {
            ...
        }
    }
}

```

���˷���Ҳû��ʲô��ʵ��ֻ�ǵ�����һ�� `doDispatch` ������Ȼ���û�ˡ���ʵ�ϣ�`DispatcherServlet#doDispatch` �������մ���������߼��������������ص����������� ��

��һ���������ܽ��� `DispatcherServlet` ���������̣�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-f854710c25924666cd5ab755c2983a9baf7.png)

### 2\. springmvc ����ַ���`DispatcherServlet#doDispatch`

��һ�ڵ�������Ƿ��� springmvc ��������ķ����� `DispatcherServlet#doDispatch`�����ھʹ�����������֣���������������߼���

```
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) 
            throws Exception {
    HttpServletRequest processedRequest = request;
    HandlerExecutionChain mappedHandler = null;
    boolean multipartRequestParsed = false;
    WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager(request);
    try {
        ModelAndView mv = null;
        Exception dispatchException = null;
        try {
            //������ļ��ϴ�������������⴦��
            processedRequest = checkMultipart(request);
            multipartRequestParsed = (processedRequest != request);
            // 1\. ��ȡ��Ӧ��handler, 
            // Handler�а��������ش�������Controller�еķ�������һ��HandlerInterceptor������
            mappedHandler = getHandler(processedRequest);
            if (mappedHandler == null) {
                // ���û�ҵ�������404
                noHandlerFound(processedRequest, response);
                return;
            }
            // 2\. ��ȡ��Ӧ��handlerAdapter���������� handler(xxx)
            HandlerAdapter ha = getHandlerAdapter(mappedHandler.getHandler());
            // ����last-modified���
            String method = request.getMethod();
            boolean isGet = "GET".equals(method);
            if (isGet || "HEAD".equals(method)) {
                long lastModified = ha.getLastModified(request, mappedHandler.getHandler());
                if (new ServletWebRequest(request, response).checkNotModified(lastModified) && isGet) {
                    return;
                }
            }
            // 3\. ����spring��������, ���� HandlerInterceptor#preHandle ����
            if (!mappedHandler.applyPreHandle(processedRequest, response)) {
                return;
            }
            // 4\. ͨ�������ȡ����handlerAdapter������handle
            mv = ha.handle(processedRequest, response, mappedHandler.getHandler());
            if (asyncManager.isConcurrentHandlingStarted()) {
                return;
            }
            // �����������û�з�����ͼ��ʹ��Ĭ�ϵ�
            applyDefaultViewName(processedRequest, mv);
            // 5\. ִ�������������� HandlerInterceptor#postHandle ����
            mappedHandler.applyPostHandle(processedRequest, response, mv);
        }
        catch (Exception ex) {
            dispatchException = ex;
        }
        catch (Throwable err) {
            dispatchException = new NestedServletException("Handler dispatch failed", err);
        }
        // 6\. �����ؽ������������������Ⱦ��ͼ���Լ�ִ�� HandlerInterceptor#afterCompletion
        processDispatchResult(processedRequest, response, mappedHandler, mv, dispatchException);
    }
    catch (...) {
        // �����ִ�� HandlerInterceptor#afterCompletion
        triggerAfterCompletion(processedRequest, response, mappedHandler, ex);
    }
    finally {
        if (asyncManager.isConcurrentHandlingStarted()) {
            if (mappedHandler != null) {
                // �ص���������ִ�з��� AsyncHandlerInterceptor#afterConcurrentHandlingStarted
                mappedHandler.applyAfterConcurrentHandlingStarted(processedRequest, response);
            }
        }
        else {
            if (multipartRequestParsed) {
                cleanupMultipart(processedRequest);
            }
        }
    }
}

```

��������ڵ㳤���������̺�������springmvc �������������̶��������ˣ�����ѹؼ�����չʾ���£�

1.  ��ȡ��Ӧ�� `HandlerExecutionChain`, ��ȡ�� `HandlerExecutionChain` �а��������ش�������`Controller` �еķ�������һ�� `HandlerInterceptor` ��������
2.  ��ȡ��Ӧ�� `handlerAdapter`���ö����������� `handler(xxx)` ������
3.  ִ�� spring �������������� `HandlerInterceptor#preHandle` ������
4.  ��������Ҳ����ͨ�������ȡ���� `handlerAdapter` ������ `handle(xxx)` ������
5.  ִ�� spring �������������� `HandlerInterceptor#postHandle` ������
6.  �����ؽ�����������Ⱦ��ͼ���Լ�ִ�� spring �������� `HandlerInterceptor#afterCompletion`��

�ܵ�������������ˣ�����������������̷����ˡ�

### 3\. ��ȡ `HandlerExecutionChain`

��ȡ `HandlerExecutionChain` �ķ����� `DispatcherServlet#getHandler` �У�

```
protected HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception {
    if (this.handlerMappings != null) {
        // �������е�handlerMapping��
        // ����� handlerMapping ����WebMvcConfigurationSupport�������
        for (HandlerMapping mapping : this.handlerMappings) {
            // ������þ����handler���ĸ�handler�ܹ������ֱ�ӷ���
            HandlerExecutionChain handler = mapping.getHandler(request);
            if (handler != null) {
                return handler;
            }
        }
    }
    return null;
}

```

����� `handlerMappings` ���� `WebMvcConfigurationSupport` ������ģ�������һ��ķ��������ܲο� [springmvc demo �� @EnableWebMvc ע��](https://my.oschina.net/funcy/blog/4678093 "springmvc demo �� @EnableWebMvc ע��")һ�ģ�������������� `handlerMappings` ��Щɶ��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-4465a638ca6c52f24f8c9343986be0bbee9.png)

���� `RequestMappingHandlerMapping` ���Ŵ���Ѿ�����Ϥ������ `@Controller`/`@RequestMapping` ��ʽʵ�ֵ� `controller`����Ӧ�� `HandlerMapping` ���� `RequestMappingHandlerMapping`��������������� `HandlerMapping`����ֱ��Ӧ��ͬ��ʽʵ�ֵ� `controller`��������һ�㣬����Ȥ��С���������аٶȣ�����Ͳ�չ���ˡ�

���Ǽ����� `AbstractHandlerMapping#getHandler` ������

```
public final HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception {
    // 1\. ���þ����ʵ��ȥ��ȡhandler
    Object handler = getHandlerInternal(request);
    // ���Ϊ��ʹ��Ĭ�ϵ�
    if (handler == null) {
        handler = getDefaultHandler();
    }
    // û��Ĭ�ϵķ��ؿ�
    if (handler == null) {
        return null;
    }
    // ����ͨ��BeanNameȥ��ȡhandler
    if (handler instanceof String) {
        String handlerName = (String) handler;
        handler = obtainApplicationContext().getBean(handlerName);
    }
    // 2\. ��ȡ executionChain����ʵ�����ҵ� uri ��Ӧ�� Interceptors,
    // Ȼ���������ҵ���handlerһ���װ��HandlerExecutionChain������
    // �����Interceptors��Ҳ����WebMvcConfigurationSupport�����õ�
    HandlerExecutionChain executionChain = getHandlerExecutionChain(handler, request);
    // 3\. ����·����ص����ã�CorsHandlerExecutionChain
    // ������Կ�������ν��cors�������ã�Ҳ����������ʵ�ֵ�
    if (hasCorsConfigurationSource(handler)) {
        CorsConfiguration config = (this.corsConfigurationSource != null 
                ? this.corsConfigurationSource.getCorsConfiguration(request) : null);
        CorsConfiguration handlerConfig = getCorsConfiguration(handler, request);
        config = (config != null ? config.combine(handlerConfig) : handlerConfig);
        // ��������ص�������ӵ� Interceptors���ӵ�������List�ĵ�һ����
        executionChain = getCorsHandlerExecutionChain(request, executionChain, config);
    }
    return executionChain;
}

```

���������Ҫ���������£�

1.  ���þ����ʵ��ȥ��ȡ handler������������ص㣬������������
2.  ��ȡ `executionChain`����� `executionChain` ���˰�������һ���� `handler` �⣬������ `uri` ��Ӧ�� `Interceptors`����ȡ����Ϊ��ȡ���е� `Interceptors` ���ã��� `WebMvcConfigurationSupport` �����õģ�������һ�ж� uri �Ƿ���� `Interceptor` �� uri ���ã�
3.  ��ȡ cors �������ã�Ȼ����ӵ� `executionChain` �е� `Interceptors` �б�ĵ�һλ���ţ�û��cors ��������Ҳ���� `WebMvcConfigurationSupport` �����õġ�

#### 3.1 ���� `HandlerMethod`

���ǽ��� `getHandlerInternal(xxx)` ������

> AbstractHandlerMethodMapping#getHandlerInternal

```
@Override
protected HandlerMethod getHandlerInternal(HttpServletRequest request) throws Exception {
    // ��ȡ�����url
    String lookupPath = getUrlPathHelper().getLookupPathForRequest(request);
    request.setAttribute(LOOKUP_PATH, lookupPath);
    this.mappingRegistry.acquireReadLock();
    try {
        // ���������uri��Ӧ��handlerMethod
        HandlerMethod handlerMethod = lookupHandlerMethod(lookupPath, request);
        // ���handlerMethod��Ϊ�գ������´���һ��HandlerMethod����
        return (handlerMethod != null ? handlerMethod.createWithResolvedBean() : null);
    }
    finally {
        this.mappingRegistry.releaseReadLock();
    }
}

```

���ﻹ�ǵ��� `lookupHandlerMethod(xxx)` ������ `handlerMethod`������

> AbstractHandlerMethodMapping#lookupHandlerMethod

```
protected HandlerMethod lookupHandlerMethod(String lookupPath, HttpServletRequest request) 
        throws Exception {
    List<Match> matches = new ArrayList<>();
    // �ȴ�urlLookup���ң�urlLookup��һ��map��key��url��value��LinkedList<RequestMappingInfo>
    List<T> directPathMatches = this.mappingRegistry.getMappingsByUrl(lookupPath);
    if (directPathMatches != null) {
        // ���ڷ��ص���һ�� list�����������е�ƥ��Ľ������һ��matches��
        addMatchingMappings(directPathMatches, matches, request);
    }
    if (matches.isEmpty()) {
        // ���ͨ��urlû�ҵ�����������е� mappings ƥ�䣬ƥ�������� /test/{name} ��url
        // mappingsҲ��һ��map��key��RequestMappingInfo�� value��HandlerMethod
        addMatchingMappings(this.mappingRegistry.getMappings().keySet(), matches, request);
    }
    // �ҵ����ƥ���mapping,�������Ӧ��HandlerMethod
    // �ȽϹ��������� RequestMappingInfo#compareTo����
    if (!matches.isEmpty()) {
        Comparator<Match> comparator = new MatchComparator(getMappingComparator(request));
        matches.sort(comparator);
        Match bestMatch = matches.get(0);
        if (matches.size() > 1) {
            if (CorsUtils.isPreFlightRequest(request)) {
                return PREFLIGHT_AMBIGUOUS_MATCH;
            }
            Match secondBestMatch = matches.get(1);
            // �ҵ����������ƥ�䣬�׳��쳣
            if (comparator.compare(bestMatch, secondBestMatch) == 0) {
                Method m1 = bestMatch.handlerMethod.getMethod();
                Method m2 = secondBestMatch.     .,m.bvc .getMethod();
                String uri = request.getRequestURI();
                throw new IllegalStateException(...);
            }
        }W
        request.setAttribute(BEST_MATCHING_HANDLER_ATTRIBUTE, bestMatch.handlerMethod);
        handleMatch(bestMatch.mapping, lookupPath, request);
        return bestMatch.handlerMethod;
    }
    else {
        return handleNoMatch(this.mappingRegistry.getMappings().keySet(), lookupPath, request);
    }
}

```

����������Ǵ��� handler �Ļ�ȡ�ˡ�����Ļ�ȡ��Ϊ�������裺

1.  �ȴ� `urlLookup` ���ң�`urlLookup` ��һ�� `map`��`key` �� `url`��`value` �� `LinkedList<RequestMappingInfo>`������������� `map.get(xxx)` ������
2.  ���ͨ�� `url` û�ҵ�����������е� `mappings` ƥ�䣬ƥ�������� `/test/{name}` �� `url`��`mappings` Ҳ��һ�� `map`��`key` �� `RequestMappingInfo`�� `value` �� `HandlerMethod`��
3.  ����ҵ��˶�� `HandlerMethod`������� `RequestMappingInfo#compareTo` �����ṩ�ķ������ҵ���ѵ� `RequestMappingInfo` ��Ӧ�� `HandlerMethod`��

������������ `mappings` ��������ҵ�ƥ��� `RequestMappingInfo` �ģ�

> AbstractHandlerMethodMapping#addMatchingMappings

```
private void addMatchingMappings(Collection<T> mappings, List<Match> matches, 
            HttpServletRequest request) {
    for (T mapping : mappings) {
        // ƥ�������������ҵ��������з��������� mappings
        T match = getMatchingMapping(mapping, request);
        if (match != null) {
            matches.add(new Match(match, this.mappingRegistry.getMappings().get(mapping)));
        }
    }
}

```

���շ���ƥ��Ĵ������� `RequestMappingInfo#getMatchingCondition` �����У�`RequestMappingInfo` ����һ�� `compareTo` ����������Ҳһ���鿴�£�

> RequestMappingInfo

```
/**
 * ƥ�����
 * ��ֱ�ƥ�� ���󷽷�(get,post��)���������������ͷ��
 */
public RequestMappingInfo getMatchingCondition(HttpServletRequest request) {
    RequestMethodsRequestCondition methods = this.methodsCondition.getMatchingCondition(request);
    if (methods == null) {
        return null;
    }
    ParamsRequestCondition params = this.paramsCondition.getMatchingCondition(request);
    if (params == null) {
        return null;
    }
    HeadersRequestCondition headers = this.headersCondition.getMatchingCondition(request);
    if (headers == null) {
        return null;
    }
    ConsumesRequestCondition consumes = this.consumesCondition.getMatchingCondition(request);
    if (consumes == null) {
        return null;
    }
    ProducesRequestCondition produces = this.producesCondition.getMatchingCondition(request);
    if (produces == null) {
        return null;
    }
    PatternsRequestCondition patterns = this.patternsCondition.getMatchingCondition(request);
    if (patterns == null) {
        return null;
    }
    RequestConditionHolder custom = this.customConditionHolder.getMatchingCondition(request);
    if (custom == null) {
        return null;
    }
    return new RequestMappingInfo(this.name, patterns,
            methods, params, headers, consumes, produces, custom.getCondition());
}

/**
 * �ȽϹ����ҵ����ƥ��
 * ��ֱ�Ƚ� ���󷽷�(get,post��)���������������ͷ��
 */
public int compareTo(RequestMappingInfo other, HttpServletRequest request) {
    int result;
    if (HttpMethod.HEAD.matches(request.getMethod())) {
        result = this.methodsCondition.compareTo(other.getMethodsCondition(), request);
        if (result != 0) {
            return result;
        }
    }
    result = this.patternsCondition.compareTo(other.getPatternsCondition(), request);
    if (result != 0) {
        return result;
    }
    result = this.paramsCondition.compareTo(other.getParamsCondition(), request);
    if (result != 0) {
        return result;
    }
    result = this.headersCondition.compareTo(other.getHeadersCondition(), request);
    if (result != 0) {
        return result;
    }
    result = this.consumesCondition.compareTo(other.getConsumesCondition(), request);
    if (result != 0) {
        return result;
    }
    result = this.producesCondition.compareTo(other.getProducesCondition(), request);
    if (result != 0) {
        return result;
    }
    result = this.methodsCondition.compareTo(other.getMethodsCondition(), request);
    if (result != 0) {
        return result;
    }
    result = this.customConditionHolder.compareTo(other.customConditionHolder, request);
    if (result != 0) {
        return result;
    }
    return 0;
}

```

����ƥ�䣬���ǱȽϣ���������󷽷� (get,post ��)���������������ͷ��һһ���д���

��������Ǿ������� springmvc ������ҵ� `HandlerMethod` ���ˡ�

#### 3.2 ���� `Interceptors`

���ǻص� `AbstractHandlerMapping#getHandler`����������λ�ȡ `Interceptor` �ģ�

```
public final HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception {
    ...
    // 2\. ��ȡ executionChain����ʵ�����ҵ� uri ��Ӧ�� Interceptors,
    // Ȼ���������ҵ���handlerһ���װ��HandlerExecutionChain������
    // �����Interceptors��Ҳ����WebMvcConfigurationSupport�����õ�
    HandlerExecutionChain executionChain = getHandlerExecutionChain(handler, request);
    ...
    return executionChain;
}

```

���� `getHandlerExecutionChain` ������

> AbstractHandlerMapping#getHandlerExecutionChain

```
protected HandlerExecutionChain getHandlerExecutionChain(Object handler, 
            HttpServletRequest request) {
    HandlerExecutionChain chain = (handler instanceof HandlerExecutionChain ?
            (HandlerExecutionChain) handler : new HandlerExecutionChain(handler));
    // ��ȡ��ǰ������·��
    String lookupPath = this.urlPathHelper.getLookupPathForRequest(request, LOOKUP_PATH);
    for (HandlerInterceptor interceptor : this.adaptedInterceptors) {
        if (interceptor instanceof MappedInterceptor) {
            MappedInterceptor mappedInterceptor = (MappedInterceptor) interceptor;
            // �жϵ�ǰ����·���Ƿ�����interceptor�����õ�·��
            if (mappedInterceptor.matches(lookupPath, this.pathMatcher)) {
                chain.addInterceptor(mappedInterceptor.getInterceptor());
            }
        }
        else {
            chain.addInterceptor(interceptor);
        }
    }
    return chain;
}

```

��������Ƚϼ򵥣���������Ѿ��ڴ���������ע�ͣ��Ͳ���˵�� ��

#### 3.3 ���� cors ��������

�������������������õĴ���

```
public final HandlerExecutionChain getHandler(HttpServletRequest request) 
        throws Exception {
    ...
    // 3\. ����·����ص����ã�CorsHandlerExecutionChain
    // ������Կ�������ν��cors�������ã�Ҳ����������ʵ�ֵ�
    if (hasCorsConfigurationSource(handler)) {
        // ��ȡ��������
        CorsConfiguration config = (this.corsConfigurationSource != null 
                ? this.corsConfigurationSource.getCorsConfiguration(request) : null);
        CorsConfiguration handlerConfig = getCorsConfiguration(handler, request);
        config = (config != null ? config.combine(handlerConfig) : handlerConfig);
        // ��������ص�������ӵ� Interceptors���ӵ�������List�ĵ�һ����
        executionChain = getCorsHandlerExecutionChain(request, executionChain, config);
    }
    return executionChain;
}

```

�����������Ҳ���� `WebMvcConfigurationSupport` �����ã�

```
protected void addCorsMappings(CorsRegistry registry) {
    ...
}

```

springmvc ��ȡ���������ú󣬻�����������ӵ� `HandlerExecutionChain` �У�

```
# AbstractHandlerMapping#getCorsHandlerExecutionChain
protected HandlerExecutionChain getCorsHandlerExecutionChain(HttpServletRequest request,
        HandlerExecutionChain chain, @Nullable CorsConfiguration config) {
    if (CorsUtils.isPreFlightRequest(request)) {
        HandlerInterceptor[] interceptors = chain.getInterceptors();
        chain = new HandlerExecutionChain(new PreFlightHandler(config), interceptors);
    }
    else {
        // ��ӵ�Interceptors����λ
        chain.addInterceptor(0, new CorsInterceptor(config));
    }
    return chain;
}

# HandlerExecutionChain#addInterceptor(int, HandlerInterceptor)
public void addInterceptor(int index, HandlerInterceptor interceptor) {
    // ��ʵ���ǲ���һ��list
    initInterceptorList().add(index, interceptor);
}

```

�� `HandlerExecutionChain` �У���һ�� `List` �������� `Interceptor`����ȡ���Ŀ������ã�����ӵ���� `List` �� `index=0` ��λ�á�

�����`handler` �ͻ�ȡ����ˣ���� `handler` ���������֣�

*   `HandlerMethod`: ��������ķ��������ڱ���ֻ���� `@Controller` ��ʽ�� controller�����Լ����Ϊ�� `@RequestMapping` ע��ķ�����
*   `List<Interceptor>`: ��������������п������ã���ô�������û������� List �ĵ�һλ��

### 4\. ��ȡ `HandlerAdapter`

�ٻص� `DispatcherServlet#doDispatch` ������������������ȡ `HandlerAdapter` �ķ�����

```
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) 
        throws Exception {
            ...
    // 2\. ��ȡ��Ӧ��handlerAdapter���������� handler(xxx)
    HandlerAdapter ha = getHandlerAdapter(mappedHandler.getHandler());
    ...

```

���� `getHandlerAdapter(xxx)` ������

> DispatcherServlet#getHandlerAdapter

```
protected HandlerAdapter getHandlerAdapter(Object handler) throws ServletException {
    // handlerAdapters ���bean��Ҳ����WebMvcConfigurationSupport�����
    if (this.handlerAdapters != null) {
        for (HandlerAdapter adapter : this.handlerAdapters) {
            // ��ͬ��handlerAdapter���жϷ�����ͬ
            if (adapter.supports(handler)) {
                return adapter;
            }
        }
    }
    throw new ServletException(...);
}

```

���Կ�����������ҵ���ǰ���е� `adapter`��Ȼ�����������ж��Ƿ��ܴ���ǰ�� `handler`�����е� `adapter` ���£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-dedb2d58b9e99091aeb559f6c5a4aab4ccc.png)

������������ж��Ƿ��ܴ���ǰ�� `handler` �ģ����ǿ�����һ�� `handler`������ `AbstractHandlerMethodAdapter#supports` ������

> AbstractHandlerMethodAdapter#supports

```
@Override
public final boolean supports(Object handler) {
    // �ж�handler�Ƿ�ΪHandlerMethod��ʵ��
    return (handler instanceof HandlerMethod && supportsInternal((HandlerMethod) handler));
}

```

���������һ���򵥵��жϣ�Ȼ���ٵ��� `supportsInternal` ������������

> RequestMappingHandlerAdapter#supportsInternal

```
protected boolean supportsInternal(HandlerMethod handlerMethod) {
    return true;
}

```

�������ֱ�ӷ��� true, ���ڿɼ������ `handler` ��ʵ���� `HandlerMethod`����ô�ͻ᷵�� `RequestMappingHandlerAdapter`.

��һ���ҵ��� `adapter` Ϊ `RequestMappingHandlerAdapter`����� `adapter` ��ʲô���أ�����ƪ�������ľ��ȵ������ˣ�ʣ�µ�������ƪ���¼���������

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4717420](https://my.oschina.net/funcy/blog/4717420) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_