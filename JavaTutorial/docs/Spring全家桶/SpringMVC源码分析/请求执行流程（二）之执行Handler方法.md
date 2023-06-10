������ **springmvc ����ִ������**�ĵڶ�ƪ���£�����һƪ�����У����Ƿ����� `DispatcherServlet#doDispatch` �������ܽ������ִ�з�Ϊ���²��裺

1.  ��ȡ��Ӧ�� `HandlerExecutionChain`, ��ȡ�� `HandlerExecutionChain` �а��������ش�������`Controller` �еķ�������һ�� `HandlerInterceptor` ��������
2.  ��ȡ��Ӧ�� `handlerAdapter`���ö����������� `handler(xxx)` ������
3.  ִ�� spring �������������� `HandlerInterceptor#preHandle` ������
4.  ��������Ҳ����ͨ�������ȡ���� `handlerAdapter` ������ `handle(xxx)` ������
5.  ִ�� spring �������������� `HandlerInterceptor#postHandle` ������
6.  �����ؽ�����������Ⱦ��ͼ���Լ�ִ�� spring �������� `HandlerInterceptor#afterCompletion`��

���ţ����Ǽ������� `HandlerExecutionChain` �Ļ�ȡ�Լ� `handlerAdapter` �Ļ�ȡ������ϻأ����Ľ����������������Ĳ��衣

### 5\. ִ�� spring ����������`HandlerInterceptor#preHandle`

```
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
    ...
    // 3\. ����spring��������, ���� HandlerInterceptor#preHandle ����
    // ���mappedHandler�����ǵ�1����ȡ��HandlerExecutionChain
    if (!mappedHandler.applyPreHandle(processedRequest, response)) {
        return;
    }
    ...
}

```

����� `mappedHandler`�����ǵ� 1 ����ȡ�� `HandlerExecutionChain`������ `HandlerExecutionChain#applyPreHandle`��

> HandlerExecutionChain#applyPreHandle

```
/**
 * ִ�� HandlerInterceptor#preHandle ����
 */
boolean applyPreHandle(HttpServletRequest request, HttpServletResponse response) 
        throws Exception {
    // ��ȡ���е�������
    HandlerInterceptor[] interceptors = getInterceptors();
    if (!ObjectUtils.isEmpty(interceptors)) {
        // ����ִ�� preHandle ����
        for (int i = 0; i < interceptors.length; i++) {
            HandlerInterceptor interceptor = interceptors[i];
            if (!interceptor.preHandle(request, response, this.handler)) {
                // ʧ���ˣ��������ִ�� HandlerInterceptor#afterCompletion ����
                triggerAfterCompletion(request, response, null);
                return false;
            }
            this.interceptorIndex = i;
        }
    }
    return true;
}

/**
 * ִ�� HandlerInterceptor#afterCompletion ����
 * Ϊ�˱�֤HandlerInterceptor#afterCompletion��ִ�У�
 * �������ķ����ῴ��������������ڶ���������õ�
 */
void triggerAfterCompletion(HttpServletRequest request, 
        HttpServletResponse response, @Nullable Exception ex) throws Exception {
    HandlerInterceptor[] interceptors = getInterceptors();
    if (!ObjectUtils.isEmpty(interceptors)) {
        // ����ִ�� HandlerInterceptor#afterCompletion ����
        for (int i = this.interceptorIndex; i >= 0; i--) {
            HandlerInterceptor interceptor = interceptors[i];
            try {
                interceptor.afterCompletion(request, response, this.handler, ex);
            }
            catch (Throwable ex2) {
                logger.error("HandlerInterceptor.afterCompletion threw exception", ex2);
            }
        }
    }
}

```

��������һ�� `HandlerExecutionChain`��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-40ba62630b5d83a16ed9aba35aba48af8be.png)

������������ `HandlerInterceptor` �� `handler` ��ɶ��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-6c50a936804c1db4a7b817dbb5ff417034d.png)

��� `handler` ���� `HandlerMethod`�������������Ϣ����ͦ�ḻ�ģ��� `bean`/`beanFactory`/`method`�������⼸�����ԣ����ǿ��Զ�����и��ֲ�����

### 6\. ������ִ�У�`AbstractHandlerMethodAdapter#handle`

�����ٻص� `DispatcherServlet#doDispatch`��ִ���� `HandlerInterceptor#preHandle` �����󣬾��������������е���ͷϷ��`handler` ��ִ�У�Ҳ���� `controller` �У�`url` ��Ӧ�ķ���ִ�У�

```
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
    ...
    // 4\. ͨ�������ȡ����handlerAdapter������handle
    mv = ha.handle(processedRequest, response, mappedHandler.getHandler());
    ...
}

```

һ·����ȥ������������ `RequestMappingHandlerAdapter#invokeHandlerMethod` ������

```
protected ModelAndView invokeHandlerMethod(HttpServletRequest request,
        HttpServletResponse response, HandlerMethod handlerMethod) throws Exception {
    // ��װreques��request����
    ServletWebRequest webRequest = new ServletWebRequest(request, response);
    try {
        // ��ȡ @InitBinder ע��ķ�����
        // ������ǰcontroller�� @ControllerAdvice ��ע������� @InitBinder ע��ķ���
        WebDataBinderFactory binderFactory = getDataBinderFactory(handlerMethod);
        // ��ȡ @ModelAttribute ע��ķ�����
        // ������ǰcontroller�� @ControllerAdvice ��ע������� @ModelAttribute ע��ķ���
        ModelFactory modelFactory = getModelFactory(handlerMethod, binderFactory);
        // ��������ִ�ж���
        ServletInvocableHandlerMethod invocableMethod = createInvocableHandlerMethod(handlerMethod);
        if (this.argumentResolvers != null) {
            invocableMethod.setHandlerMethodArgumentResolvers(this.argumentResolvers);
        }
        if (this.returnValueHandlers != null) {
            invocableMethod.setHandlerMethodReturnValueHandlers(this.returnValueHandlers);
        }
        invocableMethod.setDataBinderFactory(binderFactory);
        invocableMethod.setParameterNameDiscoverer(this.parameterNameDiscoverer);
        // ����ModelAndView������
        ModelAndViewContainer mavContainer = new ModelAndViewContainer();
        mavContainer.addAllAttributes(RequestContextUtils.getInputFlashMap(request));
        modelFactory.initModel(webRequest, mavContainer, invocableMethod);
        mavContainer.setIgnoreDefaultModelOnRedirect(this.ignoreDefaultModelOnRedirect);
        // �����첽����
        AsyncWebRequest asyncWebRequest = WebAsyncUtils.createAsyncWebRequest(request, response);
        asyncWebRequest.setTimeout(this.asyncRequestTimeout);
        WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager(request);
        asyncManager.setTaskExecutor(this.taskExecutor);
        asyncManager.setAsyncWebRequest(asyncWebRequest);
        asyncManager.registerCallableInterceptors(this.callableInterceptors);
        asyncManager.registerDeferredResultInterceptors(this.deferredResultInterceptors);
        if (asyncManager.hasConcurrentResult()) {
            Object result = asyncManager.getConcurrentResult();
            mavContainer = (ModelAndViewContainer) asyncManager.getConcurrentResultContext()[0];
            asyncManager.clearConcurrentResult();
            LogFormatUtils.traceDebug(logger, traceOn -> {
                String formatted = LogFormatUtils.formatValue(result, !traceOn);
                return "Resume with async result [" + formatted + "]";
            });
            invocableMethod = invocableMethod.wrapConcurrentResult(result);
        }
        // ִ��Controller�ķ������ص㣩
        invocableMethod.invokeAndHandle(webRequest, mavContainer);
        if (asyncManager.isConcurrentHandlingStarted()) {
            return null;
        }
        // �����ؽ��
        return getModelAndView(mavContainer, modelFactory, webRequest);
    }
    finally {
        webRequest.requestCompleted();
    }
}

```

��������е㳤�����ص㷽��ֻ��һ�У�`invocableMethod.invokeAndHandle(webRequest, mavContainer);`�����������ǰ�Ĳ��ֶ�����������ִ��ǰ��׼�����������ȡ `@InitBinder` ע��ķ�������ȡ `@ModelAttribute` ע��ķ�����׼���������� `webRequest`(��װ `request` �� `response` ����) �� `mavContainer`(`ModelAndView` ��װ����) �ȡ���������ֱ�ӽ��� `invocableMethod.invokeAndHandle`���������������ִ�еģ�

> ServletInvocableHandlerMethod#invokeAndHandle

```
public void invokeAndHandle(ServletWebRequest webRequest, ModelAndViewContainer mavContainer,
        Object... providedArgs) throws Exception {
    // ִ��handler����
    Object returnValue = invokeForRequest(webRequest, mavContainer, providedArgs);
    // ���� RequestHandled ����ֵ��springmvc����ݸ�ֵ�ж�Ҫ��Ҫ��ת
    if (returnValue == null) {
        if (isRequestNotModified(webRequest) || getResponseStatus() != null 
                || mavContainer.isRequestHandled()) {
            disableContentCachingIfNecessary(webRequest);
            mavContainer.setRequestHandled(true);
            return;
        }
    }
    else if (StringUtils.hasText(getResponseStatusReason())) {
        mavContainer.setRequestHandled(true);
        return;
    }
    mavContainer.setRequestHandled(false);
    Assert.state(this.returnValueHandlers != null, "No return value handlers");
    try {
        // �����ؽ��
        this.returnValueHandlers.handleReturnValue(
                returnValue, getReturnValueType(returnValue), mavContainer, webRequest);
    }
    catch (Exception ex) {
        throw ex;
    }
}

```

���﷽�����ǵ����� `invokeForRequest` ִ�з�����Ȼ���ٸ��ݷ����ķ���ֵ������ `mavContainer` �� `RequestHandled` ֵ��������ؽ������������ `invokeForRequest` ������

> InvocableHandlerMethod#invokeForRequest

```
@Nullable
public Object invokeForRequest(NativeWebRequest request, @Nullable ModelAndViewContainermavContainer,
        Object... providedArgs) throws Exception {
    // ���������
    Object[] args = getMethodArgumentValues(request, mavContainer, providedArgs);
    // ������÷���
    return doInvoke(args);
}

```

������������Ǵ����˲���������Ȼ��ʹ�÷�����з������á���ʵ�ϣ�����ִ�������У�����ĵľ��ǲ��������ˣ��� controller ��� handler �����У����ǿ�������ָ��������

```
// ֱ�Ӵ���
@RequestMapping("xxx")
public Object test(String name) {
    ...
}

// �ڲ����ϱ���@RequestParam��@RequestHeader��ע��
@RequestMapping("xxx")
public Object test(@RequestParam("name") String name, 
                   @RequestHeader("uid") String uid) {
    ...
}

// ������Ĳ�����װΪ����
@RequestMapping("xxx")
public Object test(User user) {
    ...
}

// ����ķ�������ʹ��form������(Ҳ����k1=v1&2=v2&...�ķ���)
// �������ʹ�� RequestBody ��ʽ���Σ����������ݷ�����Ϣ����
@RequestMapping("xxx")
public Object test(@RequestBody User user) {
    ...
}

...

```

�����ǰ��淶�������ʱ��springmvc ���������������������� springmvc �����������һ��ġ�

#### ��������

���������� `InvocableHandlerMethod#getMethodArgumentValues` ������

> InvocableHandlerMethod#getMethodArgumentValues

```
protected Object[] getMethodArgumentValues(NativeWebRequest request, 
        @Nullable ModelAndViewContainer mavContainer, Object... providedArgs) throws Exception {
    // ��ȡ���������в��������Լ����Ϊ���÷����ȡhandler����������Ȼ���װΪ MethodParameter
    MethodParameter[] parameters = getMethodParameters();
    if (ObjectUtils.isEmpty(parameters)) {
        return EMPTY_ARGS;
    }
    Object[] args = new Object[parameters.length];
    // ���δ���ÿ������
    for (int i = 0; i < parameters.length; i++) {
        MethodParameter parameter = parameters[i];
        parameter.initParameterNameDiscovery(this.parameterNameDiscoverer);
        args[i] = findProvidedArgument(parameter, providedArgs);
        if (args[i] != null) {
            continue;
        }
        // �ж��Ƿ��в���������֧�ֵ�ǰ�����Ľ���
        if (!this.resolvers.supportsParameter(parameter)) {
            throw new IllegalStateException(formatArgumentError(parameter, "No suitable resolver"));
        }
        try {
            // �����������
            args[i] = this.resolvers.resolveArgument(parameter, mavContainer, request, 
                    this.dataBinderFactory);
        }
        catch (Exception ex) {
            throw ex;
        }
    }
    return args;
}

```

��������Ȼ�ȡ�� handler �����Ĳ��� (���Լ����Ϊ���÷����ȡ handler ����������Ȼ���װΪ `MethodParameter`)��Ȼ�����Щ�����������������ʱ�����õ�������Ҫ�ķ�����`resolvers.supportsParameter(...)` �� `resolvers.resolveArgument(...)`���������������յ��õķ����� `HandlerMethodArgumentResolverComposite` �У�

> HandlerMethodArgumentResolverComposite

```
@Nullable
public Object resolveArgument(MethodParameter parameter, @Nullable ModelAndViewContainermavContainer,
        NativeWebRequest webRequest, @Nullable WebDataBinderFactory binderFactory) throws Exception {
    // ��ȡһ��������
    HandlerMethodArgumentResolver resolver = getArgumentResolver(parameter);
    if (resolver == null) {
        throw new IllegalArgumentException(...);
    }
    // �������������� HandlerMethodArgumentResolver#resolveArgument ����
    return resolver.resolveArgument(parameter, mavContainer, webRequest, binderFactory);
}

private HandlerMethodArgumentResolver getArgumentResolver(MethodParameter parameter) {
    HandlerMethodArgumentResolver result = this.argumentResolverCache.get(parameter);
    if (result == null) {
        // �������еĽ�����
        for (HandlerMethodArgumentResolver resolver : this.argumentResolvers) {
            // �ҵ�����һ��������������
            // ���� HandlerMethodArgumentResolver#supportsParameter ����
            if (resolver.supportsParameter(parameter)) {
                result = resolver;
                this.argumentResolverCache.put(parameter, result);
                break;
            }
        }
    }
    return result;
}

```

������������Ҫ�Ǳ�����������Ȼ����� `HandlerMethodArgumentResolver#supportsParameter` �� `HandlerMethodArgumentResolver#resolveArgument` �������Ĳ�����`HandlerMethodArgumentResolver` �Ǹ��ӿڣ������������������

```
public interface HandlerMethodArgumentResolver {
    /**
     * ��ǰ�Ƿ�֧�ִ���ǰ����
     */
    boolean supportsParameter(MethodParameter parameter);

    /**
     * ����Ľ�������
     */
    @Nullable
    Object resolveArgument(MethodParameter parameter, @Nullable ModelAndViewContainer mavContainer,
            NativeWebRequest webRequest, @Nullable WebDataBinderFactory binderFactory) throws Exception;
}

```

������������Ĳ����������ˡ��� springmvc �У��ṩ�˶����ֲ����������أ��������˵ĵ��ԣ����ֶ�� 26 ����

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-fd30bc847fc2cf7082de3731e68df6ae5f9.png) ![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-894b391bbe4567734ee7237d900bc55ee31.png)

��������Щ�����������İ����£�springmvc ��֧�ֶ��ֲ������շ�ʽ�����ڲ�����������������ƱȽϸ��ӣ��漰���ִ��η�ʽ�����Ĳ�����չ�����ۣ�����Ȥ��С�������в�������ĵ���

#### ִ�� handler ����

��������������󣬾Ϳ�ʼִ�� handler �����ˡ������ǻص� `InvocableHandlerMethod#invokeForRequest` ������

> InvocableHandlerMethod#invokeForRequest

```
@Nullable
public Object invokeForRequest(NativeWebRequest request, @Nullable ModelAndViewContainermavContainer,
        Object... providedArgs) throws Exception {
    // ���������
    Object[] args = getMethodArgumentValues(request, mavContainer, providedArgs);
    // ������÷���
    return doInvoke(args);
}

```

���� `doInvoke` ������

```
@Nullable
protected Object doInvoke(Object... args) throws Exception {
    // ʹ�÷���ִ�з���
    ReflectionUtils.makeAccessible(getBridgedMethod());
    try {
        // ������Ƿ������
        return getBridgedMethod().invoke(getBean(), args);
    }
    catch (...) {
        ...
    }
}

```

��������ܼ򵥣��������÷��������з���ִ�еģ��Ͳ���������ˡ�

#### �����ز���

�����ǻص� `ServletInvocableHandlerMethod#invokeAndHandle` ������

> ServletInvocableHandlerMethod#invokeAndHandle

```
public void invokeAndHandle(ServletWebRequest webRequest, ModelAndViewContainer mavContainer,
        Object... providedArgs) throws Exception {
    // ִ��handle����
    Object returnValue = invokeForRequest(webRequest, mavContainer, providedArgs);
    ...
    try {
        // �����ؽ��
        this.returnValueHandlers.handleReturnValue(
                returnValue, getReturnValueType(returnValue), mavContainer, webRequest);
    }
    catch (Exception ex) {
        throw ex;
    }
}

```

�����귽��ִ�к󣬽��žʹ����ؽ����

> HandlerMethodReturnValueHandlerComposite#handleReturnValue

```
@Override
public void handleReturnValue(@Nullable Object returnValue, MethodParameter returnType,
        ModelAndViewContainer mavContainer, NativeWebRequest webRequest) throws Exception {
    // ���ݷ���������һ�����ʵ�handler������������
    HandlerMethodReturnValueHandler handler = selectHandler(returnValue, returnType);
    if (handler == null) {
        throw new IllegalArgumentException(...);
    }
    handler.handleReturnValue(returnValue, returnType, mavContainer, webRequest);
}

@Nullable
private HandlerMethodReturnValueHandler selectHandler(@Nullable Object value, MethodParameterreturnType) {
    boolean isAsyncValue = isAsyncReturnValue(value, returnType);
    // ����������ж��Ƿ��ܴ���ǰ��������
    for (HandlerMethodReturnValueHandler handler : this.returnValueHandlers) {
        if (isAsyncValue && !(handler instanceof AsyncHandlerMethodReturnValueHandler)) {
            continue;
        }
        if (handler.supportsReturnType(returnType)) {
            return handler;
        }
    }
    return null;
}

```

��ȡ `ReturnValueHandler` ����·��ǰ���ȡ `ArgumentResolver` ����·����޼���`ReturnValueHandler` �� `HandlerMethodReturnValueHandler` �����࣬`HandlerMethodReturnValueHandler` �������£�

```
public interface HandlerMethodReturnValueHandler {

    /**
     * �жϵ�ǰReturnValueHandler�ܷ������returnType
     */
    boolean supportsReturnType(MethodParameter returnType);

    /**
     * ����Ĵ����߼�
     */
    void handleReturnValue(@Nullable Object returnValue, MethodParameter returnType,
            ModelAndViewContainer mavContainer, NativeWebRequest webRequest) throws Exception;

}

```

ͬǰ�����������һ��������ӿ���Ҳ������������

*   `boolean supportsReturnType(xxx)`���жϵ�ǰ `ReturnValueHandler` �ܷ������ `returnType`
*   `void handleReturnValue(xxx)`������Ĵ����߼�

ͬ���أ�springmvc Ҳ�ṩ�˷ǳ����ʵ���������ز�����

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-8e3c1fd4dca7c13efbceac5800e26145963.png)

���ڲ����ķ��أ���������һ���򵥵�ʾ����

�����������������ֵʱ��

```
@Controller
@RequestMapping("/xxx")
public class XxxController {

    @RequestMapping("/index")
    public String index() {
        return "index";
    }
}

```

���ص�ҳ��Ľ���һ����ͼ����Ӧ�� `HandlerMethodReturnValueHandler` Ϊ `ViewNameMethodReturnValueHandler`��

```
public class ViewNameMethodReturnValueHandler implements HandlerMethodReturnValueHandler {

    @Nullable
    private String[] redirectPatterns;

    // ʡ�� redirectPatterns ��setter��getter����
    ...

    @Override
    public boolean supportsReturnType(MethodParameter returnType) {
        Class<?> paramType = returnType.getParameterType();
        // ֧�ִ���ķ���ֵ���ͣ�����ֵ����Ϊvoid������Ϊ�ַ�������
        return (void.class == paramType || CharSequence.class.isAssignableFrom(paramType));
    }

    /**
     * ����Ĵ����߼�
     */
    @Override
    public void handleReturnValue(@Nullable Object returnValue, MethodParameter returnType,
            ModelAndViewContainer mavContainer, NativeWebRequest webRequest) throws Exception {

        if (returnValue instanceof CharSequence) {
            // viewName ���Ƿ���ֵ
            String viewName = returnValue.toString();
            mavContainer.setViewName(viewName);
            if (isRedirectViewName(viewName)) {
                // �Ƿ���Ҫ��ת
                mavContainer.setRedirectModelScenario(true);
            }
        }
        else if (returnValue != null) {
            throw new UnsupportedOperationException(...);
        }
    }

    /**
     * �ж��Ƿ���Ҫ��ת
     */
    protected boolean isRedirectViewName(String viewName) {
        // this.redirectPatterns Ĭ��Ϊnull���������е��� setter ��������
        return (PatternMatchUtils.simpleMatch(this.redirectPatterns, viewName) 
            // ƥ�� redirect: ��ͷ��Ҳ����˵��������Ƿ��� "redirect:index"���ͱ����ý����Ҫ��ת
            || viewName.startsWith("redirect:"));
    }

}

```

�����Ƚϼ򵥣��ؼ��������ڴ���������ע�ͣ�����Ͳ���˵�ˡ�ֵ��һ����ǣ��� `handleReturnValue(xxx)` �����У�springmvc �����ص��ַ�������Ϊ `viewName` ��Ҫע���£������ڴ�����ͼʱ����������� `viewName` �õ���Ӧ�� `View`��

#### ��ȡ ModelAndView

�����ǻص� `RequestMappingHandlerAdapter#invokeHandlerMethod` ������

```
@Nullable
protected ModelAndView invokeHandlerMethod(HttpServletRequest request,
        HttpServletResponse response, HandlerMethod handlerMethod) throws Exception {
    ServletWebRequest webRequest = new ServletWebRequest(request, response);
    try {
        ...
        // ִ��Controller�ķ���
        invocableMethod.invokeAndHandle(webRequest, mavContainer);
        if (asyncManager.isConcurrentHandlingStarted()) {
            return null;
        }
        // ����ִ�н���������õ� ModelAndView
        return getModelAndView(mavContainer, modelFactory, webRequest);
    }
    finally {
        webRequest.requestCompleted();
    }
}

```

ִ���� `invocableMethod.invokeAndHandle(webRequest, mavContainer)` ��������ž��Ǵ�ִ�н�����õ� `ModelAndView` �ˣ����� `RequestMappingHandlerAdapter#getModelAndView` ������

```
private ModelAndView getModelAndView(ModelAndViewContainer mavContainer,
        ModelFactory modelFactory, NativeWebRequest webRequest) throws Exception {
    // ��� ModelFactory������ǰ���ȡ�� ����@ModelAttribute ע��ķ���
    modelFactory.updateModel(webRequest, mavContainer);
    if (mavContainer.isRequestHandled()) {
        return null;
    }
    ModelMap model = mavContainer.getModel();
    // ������ͼ���󣬰�mavContainer.getViewName()���뵽ModelAndView�Ĺ��췽����
    ModelAndView mav = new ModelAndView(mavContainer.getViewName(), 
            model, mavContainer.getStatus());
    if (!mavContainer.isViewReference()) {
        mav.setView((View) mavContainer.getView());
    }
    // �����ض������
    if (model instanceof RedirectAttributes) {
        Map<String, ?> flashAttributes = ((RedirectAttributes) model).getFlashAttributes();
        HttpServletRequest request = webRequest.getNativeRequest(HttpServletRequest.class);
        if (request != null) {
            RequestContextUtils.getOutputFlashMap(request).putAll(flashAttributes);
        }
    }
    return mav;
}

```

���Կ�����`ModelAndView` ���Ǵ�ǰ��ִ�н���� `viewName` �õ��ġ�

���ˣ�`AbstractHandlerMethodAdapter#handle` ִ����ϡ�

### 7\. ִ����������`HandlerInterceptor#postHandle`

�������ٻص� `DispatcherServlet#doDispatch` ������

> DispatcherServlet#doDispatch

```
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
    ...

    try {
        ...
        try {
            ...
            // 4.ͨ�������ȡ����handlerAdapter������handle
            mv = ha.handle(processedRequest, response, mappedHandler.getHandler());
            // 5.�����������û�з�����ͼ��ʹ��Ĭ�ϵ�
            applyDefaultViewName(processedRequest, mv);
            // 6\. ִ�������������� HandlerInterceptor#postHandle ����
            mappedHandler.applyPostHandle(processedRequest, response, mv);
        }
        catch (...) {
            ...
        }
        // 7\. �����ؽ����������������ִ�� HandlerInterceptor.afterCompletion
        processDispatchResult(processedRequest, response, mappedHandler, mv, dispatchException);
    }
    catch (...) {
        ...
    }
}

```

ִ���� `handler` �����󣬾Ϳ�ʼִ���������� `HandlerInterceptor#postHandle` �����ˣ�

> HandlerExecutionChain#applyPostHandle

```
void applyPostHandle(HttpServletRequest request, HttpServletResponse response, 
        @NullableModelAndView mv) throws Exception {
    HandlerInterceptor[] interceptors = getInterceptors();
    if (!ObjectUtils.isEmpty(interceptors)) {
        // ����ִ�� postHandle(...) ����
        for (int i = interceptors.length - 1; i >= 0; i--) {
            HandlerInterceptor interceptor = interceptors[i];
            interceptor.postHandle(request, response, this.handler, mv);
        }
    }
}

```

���ͬǰ��ִ���������������ƣ�����Ͳ���������ˡ���Ҫǿ�����ǣ�`HandlerInterceptor#postHandle` ��ִ��ʱ����**��ִ���� `handler` ������֮������ͼ����֮ǰ**����ˣ����ǿ���������������������ﴦ��һЩ�������Ⱦ������

����ƪ�������ľ��ȵ������ˣ�request ִ�еĺ������̣�������ƪ�����ٷ�����

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4741104](https://my.oschina.net/funcy/blog/4741104) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_