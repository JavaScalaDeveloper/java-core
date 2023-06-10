**ѧϰĿ��**

1.  Gateway����ԭ�����
    **��1�� Bean��׼��**
    ǰ��Ҳ������ô������ˣ��������Ǽ���
    spring-cloud-starter-gateway������֣�����һ��starter�����������˵����ȥ��spring.factories�ļ�������һ������Щ��Ҫ��bean���Զ�װ���IoC���������ˡ�

![SpringCloudϵ�С�Spring Cloud Դ�����֮Gateway����-��Դ�����������](https://dl-harmonyos.51cto.com/images/202207/788f3c1494307a2ad7d935811c9e62bab2c435.jpg "SpringCloudϵ�С�Spring Cloud Դ�����֮Gateway����-��Դ�����������")1.������
GatewayClassPathWarningAutoConfiguration���������



```
@Configuration(proxyBeanMethods = false)
//��ǰ��������GatewayAutoConfiguration�������������֮ǰ����
@AutoConfigureBefore(GatewayAutoConfiguration.class)
public class GatewayClassPathWarningAutoConfiguration {
	...      
	@Configuration(proxyBeanMethods = false)
	@ConditionalOnClass(name = "org.springframework.web.servlet.DispatcherServlet")
	protected static class SpringMvcFoundOnClasspathConfiguration {
		public SpringMvcFoundOnClasspathConfiguration() {
			log.warn(BORDER
					+ "Spring MVC found on classpath, which is incompatible with Spring Cloud Gateway at this time. "
					+ "Please remove spring-boot-starter-web dependency." + BORDER);
		}

	}
	@Configuration(proxyBeanMethods = false)
	@ConditionalOnMissingClass("org.springframework.web.reactive.DispatcherHandler")
	protected static class WebfluxMissingFromClasspathConfiguration {

		public WebfluxMissingFromClasspathConfiguration() {
			log.warn(BORDER + "Spring Webflux is missing from the classpath, "
					+ "which is required for Spring Cloud Gateway at this time. "
					+ "Please add spring-boot-starter-webflux dependency." + BORDER);
		}
	}
}
```









������������ܿ���������ʵ���Ͼ�ͨ��ConditionOnClass��ConditionOnMissingClass��������������־��ӡ�Ĺ��ܣ����ClassPath����
org.springframework.web.servlet.DispatcherServlet��Ļ�����ʵ����һ��Bean����Ȼ���ӡ��־����������spring-boot-starter-web�������Ȼ���ټ��ClassPath���Ƿ�����ȷ������webflux�����û�У����ӡ��־����spring-boot-starter-webflux������

2.����������GatewayAutoConfiguration

��Ϊ����̫��������Ͳ�չʾ�ˣ�������оټ����Ƚ���Ҫ��

*   PropertiesRouteDefinitionLocator�����ڴ������ļ���yml/properties���ж�ȡ·��������Ϣ��
*   RouteDefinitionLocator���� RouteDefinition ת��Ϊ Route
*   RoutePredicateHandlerMapping�������� mvc ��HandlerMapping������������ Gatewayʵ�ֵġ�����ƥ���Ӧ������route
*   GatewayProperties��yml������Ϣ��װ�� GatewayProperties ������
*   AfterRoutePredicateFactory������·�ɶ��Թ�����������Щ���Թ���������ʱ�Ѿ����ɶ�Ӧ��bean�����ǲſ����� yml ������һ�£�������Ч
*   RetryGatewayFilterFactory������ Gateway ��������������Щ������������ʱ�Ѿ����ɶ�Ӧ��bean�����ǲſ����� yml ������һ�£�������Ч
*   GlobalFilterʵ���ࣺȫ�ֹ�����

3.HttpHandlerAutoConfiguration��WebFluxAutoConfiguration�����࣬��GatewayAutoConfiguration֮��ʵ�������ֱ�ʵ������HttpHandler��WebFluxConfigBean

**��2�� ִ������**
��һ���н���Hystrix��ԭ����Hystrix�к���ҵ���߼�����ͨ����Ӧʽ�����ɵģ���ʵ�ϣ���Gateway��Ҳ���ǻ���ͬ���ı�̷��ͬ���ģ�Gateway������ͬSpringMVC����Ҳ�ǳ����ơ�

��ǰ�������������ʱ�򣬴�����������£�

1.  ���ȱ�DispatcherHandler���������أ�Ȼ��������URI���н���
2.  Ȼ�����URIȥ����HandlerMapping����ȡ����Ҫִ�е�WebHandler
3.  Ȼ��ѡ��һ�����ʵ�������HandlerAdapterִ��
4.  ִ��WebHandler
    ������gateway����ʱ�����е����󶼻���뵽DispatcherHandler�е�handle��������������һ�𿴿��������



```
@Override
public Mono<Void> handle(ServerWebExchange exchange) {
    if (this.handlerMappings == null) {
        return createNotFoundError();
    }
    //�������webFlux����Ӧʽ���
    return Flux
        // 1.������Ǳ������е� handlerMapping
        .fromIterable(this.handlerMappings)
        // 2.��ȡ��Ӧ��handlerMapping �����糣�õ� RequestMappingHandlerMapping��RoutePredicateHandlerMapping
        .concatMap(mapping -> mapping.getHandler(exchange))
        .next()
        .switchIfEmpty(createNotFoundError())
        // 3.��ȡ��Ӧ�������������ö�Ӧ�Ĵ�����
        .flatMap(handler -> invokeHandler(exchange, handler))
        // 4.���ش�����
        .flatMap(result -> handleResult(exchange, result));
}
```









**2.1 getHandler**
������������getHandler������������Gateway�ĺ����߼����ڣ���getHandler�л�ȡ��Ӧ��HandlerMapping��

������
AbstractHandlerMapping.getHandler��Դ��



```
@Override
public Mono<Object> getHandler(ServerWebExchange exchange) {
    //��һ�����ȡ·�ɵ�ʵ���࣬����뵽RoutePredicateHandlerMapping
    return getHandlerInternal(exchange).map(handler -> {
        if (logger.isDebugEnabled()) {
            logger.debug(exchange.getLogPrefix() + "Mapped to " + handler);
        }
        ServerHttpRequest request = exchange.getRequest();
        if (hasCorsConfigurationSource(handler) || CorsUtils.isPreFlightRequest(request)) {
            CorsConfiguration config = (this.corsConfigurationSource != null ? this.corsConfigurationSource.getCorsConfiguration(exchange) : null);
            CorsConfiguration handlerConfig = getCorsConfiguration(handler, exchange);
            config = (config != null ? config.combine(handlerConfig) : handlerConfig);
            if (!this.corsProcessor.process(config, exchange) || CorsUtils.isPreFlightRequest(request)) {
                return REQUEST_HANDLED_HANDLER;
            }
        }
        return handler;
    });
}
```











```
@Override
protected Mono<?> getHandlerInternal(ServerWebExchange exchange) {
    // don't handle requests on management port if set and different than server port
    if (this.managementPortType == DIFFERENT && this.managementPort != null
        && exchange.getRequest().getURI().getPort() == this.managementPort) {
        return Mono.empty();
    }
    exchange.getAttributes().put(GATEWAY_HANDLER_MAPPER_ATTR, getSimpleName());
    //Ѱ�Ҳ�ƥ��·��
    return lookupRoute(exchange)
        // .log("route-predicate-handler-mapping", Level.FINER) //name this
        .flatMap((Function<Route, Mono<?>>) r -> {
            //�Ƴ��������оɵ�����
            exchange.getAttributes().remove(GATEWAY_PREDICATE_ROUTE_ATTR);
            if (logger.isDebugEnabled()) {
                logger.debug(
                    "Mapping [" + getExchangeDesc(exchange) + "] to " + r);
            }
            //�Ѹ�·���������İ󶨣��������ؾ������
            exchange.getAttributes().put(GATEWAY_ROUTE_ATTR, r);
            //���� webHandler
            return Mono.just(webHandler);
        }).switchIfEmpty(Mono.empty().then(Mono.fromRunnable(() -> {
        exchange.getAttributes().remove(GATEWAY_PREDICATE_ROUTE_ATTR);
        if (logger.isTraceEnabled()) {
            logger.trace("No RouteDefinition found for ["
                         + getExchangeDesc(exchange) + "]");
        }
    })));
}
```









����lookupRoute�������ҵ�yml�����õ����е�·�ɶ��Թ�����Before��After��Path�ȵȣ�����ִ��apply����������·��ƥ�䣬�ж��Ƿ���������ͨ����ִ��˳����springboot�Զ�����ʱ�Լ��ƶ�



```
protected Mono<Route> lookupRoute(ServerWebExchange exchange) {
    // getRoutes ��ȡ���еĶ��Թ���
    return this.routeLocator.getRoutes()
        .concatMap(route -> Mono.just(route).filterWhen(r -> {
            exchange.getAttributes().put(GATEWAY_PREDICATE_ROUTE_ATTR, r.getId());
            // �Ȼ�ȡRoute�ڲ���predicate����
            //Ȼ�����apply���� ִ�ж��ԣ��ж������Ƿ�ͨ��
            return r.getPredicate().apply(exchange);
        }).doOnError(e -> logger.error(
                       "Error applying predicate for route: " + route.getId(),
                       e))
                   .onErrorResume(e -> Mono.empty()))
        .next()
        .map(route -> {
            if (logger.isDebugEnabled()) {
                logger.debug("Route matched: " + route.getId());
            }
            validateRoute(route, exchange);
            return route;
        });
}
```









����getRoutes()��������ͨ��
RouteDefinitionRouteLocator�������ļ��л�ȡ����·�ɵģ�Ȼ����ҵ���·��ת����Route



```
@Override
public Flux<Route> getRoutes() {
    // getRouteDefinitions() �������ļ��л�ȡ����·��
    Flux<Route> routes = this.routeDefinitionLocator.getRouteDefinitions()
        // convertToRoute()�����ҵ���·��ת����Route
        .map(this::convertToRoute);
    ...
}
```











```
public class Route implements Ordered {
	private final String id;
	private final URI uri;
	private final int order;
	private final AsyncPredicate<ServerWebExchange> predicate;
	private final List<GatewayFilter> gatewayFilters;
	private final Map<String, Object> metadata;	
    ...
}
```









**2.2 invokeHandler**
Gateway��������һ��ƥ��·�ɺ󷵻ص���webHandler���͵ģ�����Ҳ��Ҫ�ҵ���Ӧ��HandlerAdaptor�������ȡ��Ӧ������������ invokeHandler(exchange, handler)��



```
private Mono<HandlerResult> invokeHandler(ServerWebExchange exchange, Object handler) {
    if (this.handlerAdapters != null) {
        //�ҵ����е�HandlerAdapterȥƥ��WebFlux����
        for (HandlerAdapter handlerAdapter : this.handlerAdapters) {
            if (handlerAdapter.supports(handler)) {
                return handlerAdapter.handle(exchange, handler);
            }
        }
    }
    return Mono.error(new IllegalStateException("No HandlerAdapter: " + handler));
}
```









SimpleHandlerAdapter �е�handle��������



```
@Override
public Mono<HandlerResult> handle(ServerWebExchange exchange, Object handler) {
    //����WebHandler ����
    WebHandler webHandler = (WebHandler) handler;
    Mono<Void> mono = webHandler.handle(exchange);
    return mono.then(Mono.empty());
}
```









����webHandler.handle�������Ǵ������й��������ķ������ù�����������globalFilters��gatewayFilters



```
@Override
public Mono<Void> handle(ServerWebExchange exchange) {
    // 1\. ����·���������İ󶨹�ϵ����ȡ��Ӧ��·��Route
    Route route = exchange.getRequiredAttribute(GATEWAY_ROUTE_ATTR);
    List<GatewayFilter> gatewayFilters = route.getFilters();
    // 2\. �ռ����е� globalFilters ������List<GatewayFilter>
    //ע������ʹ����������ģʽ
    List<GatewayFilter> combined = new ArrayList<>(this.globalFilters);
    // 3\. �� gatewayFilters Ҳ����List<GatewayFilter>���γ�һ������������
    combined.addAll(gatewayFilters);
    // 4\. ����order����
    AnnotationAwareOrderComparator.sort(combined);
    if (logger.isDebugEnabled()) {
        logger.debug("Sorted gatewayFilterFactories: " + combined);
    }
    // 5\. ִ�й��������е�ÿһ��������������
    return new DefaultGatewayFilterChain(combined).filter(exchange);
}
```









ע�⣺����װ����������ʱ���ǰ�globalFilters��gatewayFilters���ֹ��������Ž���List<GatewayFilter>�У�������ô�����أ�

����ʵ�õ���һ�� ������ �����ģʽ��

*   ����������globalFilters�����Ȱ�globalFiltersת����GatewayFilterAdapter�� GatewayFilterAdapter���ڲ�������GlobalFilter��ͬʱҲʵ����GatewayFilter��ʹ globalFilters��gatewayFilters�� ������ ��GatewayFilterAdapter�й��棡
*   ����������gatewayFilters��ֱ�ӷ��뼴�ɣ�
    **��3�� ���ؾ�������**
    Gateway�ĸ��ؾ���ֻ��Ҫ��yml������ uri: lb://user����ʵ�ָ��ؾ��⣬�ײ�����ȫ�ֹ�����LoadBalancerClientFilter��filter����ȥ���ģ�

�Զ��������
http://localhost:9527/get/3Ϊ����9527Ϊ����Gateway�Ķ˿�



```
public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
    // 1\. ����·���������İ󶨹�ϵ
    // ��ȡԭʼ��url��http://localhost:9527/get/3
    URI url = exchange.getAttribute(GATEWAY_REQUEST_URL_ATTR);
    String schemePrefix = exchange.getAttribute(GATEWAY_SCHEME_PREFIX_ATTR);
    if (url == null
        || (!"lb".equals(url.getScheme()) && !"lb".equals(schemePrefix))) {
        return chain.filter(exchange);
    }
    addOriginalRequestUrl(exchange, url);
    if (log.isTraceEnabled()) {
        log.trace("LoadBalancerClientFilter url before: " + url);
    }
    // 2\. ͨ��ribbon�ĸ��ؾ����㷨�����ݷ�����ȥnacos����Eurekaѡ��һ��ʵ����
    // ��ʵ������user���������� url ��ַ��http://localhost:8080/get/3
    final ServiceInstance instance = choose(exchange);
    if (instance == null) {
        throw NotFoundException.create(properties.isUse404(),
                                       "Unable to find instance for " + url.getHost());
    }
    // 3\. �õ�ԭ���� uri ��http://localhost:9527/get/3
    URI uri = exchange.getRequest().getURI();
    String overrideScheme = instance.isSecure() ? "https" : "http";
    if (schemePrefix != null) {
        overrideScheme = url.getScheme();
    }
    // 4\. �÷���ʵ��instance��uri�滻ԭ����uri��ַ �õ� �µ�url
    // �µ�url: http://localhost:8080/get/3
    URI requestUrl = loadBalancer.reconstructURI(
        new DelegatingServiceInstance(instance, overrideScheme), uri);
    if (log.isTraceEnabled()) {
        log.trace("LoadBalancerClientFilter url chosen: " + requestUrl);
    }
    // 5\. �ٴμ�¼�����Ĺ�ϵ
    exchange.getAttributes().put(GATEWAY_REQUEST_URL_ATTR, requestUrl);
    // 6\. ִ�й��������е�������������
    return chain.filter(exchange);
}
```

# �ο�����
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud
https://github.com/macrozheng/springcloud-learning