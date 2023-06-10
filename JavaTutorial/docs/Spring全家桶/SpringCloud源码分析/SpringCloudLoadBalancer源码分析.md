# Spring Cloud LoadBalancer

## ����

> Spring Cloud LoadBalancerĿǰSpring�ٷ��Ƿ���spring-cloud-commons�Spring Cloud���°汾Ϊ2021.0.2
>
> [Spring Cloud LoadBalancer �����ĵ���ַ](https://docs.spring.io/spring-cloud-commons/docs/3.1.2/reference/html/#spring-cloud-loadbalancer) [https://docs.spring.io/spring-cloud-commons/docs/3.1.2/reference/html/#spring-cloud-loadbalancer](https://docs.spring.io/spring-cloud-commons/docs/3.1.2/reference/html/#spring-cloud-loadbalancer)
>
> [Spring Cloud�����ĵ���ַ](https://docs.spring.io/spring-cloud/docs/current/reference/html/) [https://docs.spring.io/spring-cloud/docs/current/reference/html/](https://docs.spring.io/spring-cloud/docs/current/reference/html/)

һ����Netflix Ribbonֹͣ���£�Spring Cloud LoadBalancer��Spring Cloud�ٷ��Լ��ṩ�Ŀͻ��˸��ؾ�����,�����ʵ�֣��������Ribbon��

*   �������ؾ�������Ϊ����˸��ؾ�����(�����ز���⸺��)�Ϳͻ��˲���⸺�ء�
    *   ���ز���Ӳ�������F5����������LVS������nginx�ȡ�
    *   �ͻ��˲����Spring Cloud LoadBalancer����Ϊһ���ͻ���ȥ���ָ���ά�������б��Զ������ľ��⸺�ز��ԣ��������ѯ��С�����Ľ�˿ȸ�ȵȣ���

Spring Cloud�ṩ���Լ��Ŀͻ��˸���ƽ���������ʵ�֡����ڸ��ؾ�����ƣ�������ReactiveLoadBalancer�ӿڣ����ṩ�˻���round-robin��ѯ��Random�����ʵ�֡�Ϊ�˴���ӦʽServiceInstanceListSupplier��ѡ��ʵ������Ҫʹ��ServiceInstanceListSupplier��Ŀǰ֧��ServiceInstanceListSupplier�Ļ��ڷ����ֵ�ʵ�֣���ʵ��ʹ����·���еķ��ֿͻ��˴�Service Discovery�м������õ�ʵ����

����ͨ����������������Spring Cloud LoadBalance

```
spring:
  cloud:
    loadbalancer:
      enabled: false

```

## ����ʾ��

ǰ��simple-ecommerce��Ŀ�������ڸ�Pom����������������ϸ���Կ���ǰ�������<<SpringCloudAlibabaע����������������֮����Nacosʵս��Դ�����>>������Spring Cloud�İ汾Ϊ2021.0.1��ǰ������Ҳ��˵����Spring Cloud Alibaba������spring-cloud-starter-alibaba-nacos-discovery���������spring-cloud-loadbalancer��

> ע�������Hoxton֮ǰ�İ汾��Ĭ�ϸ��ؾ�����ΪRibbon����Ҫ�Ƴ�Ribbon���ú���������spring.cloud.loadbalancer.ribbon.enabled: false��

�������Spring Boot��Ŀ������������������������starterҲ������Spring Boot Caching and Evictor.

```
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            spring-cloud-starter-loadbalancer
        </dependency>

```

����ʹ��Spring�ٷ��ṩ�˸��ؾ���Ŀͻ���֮һRestTemplate��RestTemplate��Spring�ṩ�����ڷ���Rest����Ŀͻ��ˣ�RestTemplate�ṩ�˶��ֱ�ݷ���Զ��Http����ķ������ܹ������߿ͻ��˵ı�дЧ�ʡ�Ĭ������£�RestTemplateĬ������jdk��HTTP���ӹ��ߡ�����RestTemplateConfig�����࣬��ע @LoadBalancedע�⣬Ĭ��ʹ�õ�ReactiveLoadBalancerʵ����RoundRobinLoadBalancer��

```
package cn.itxs.ecom.order.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {
    @LoadBalanced
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate() ;
    }
}

```

����΢�����ж�������������deductRest����

```
package cn.itxs.ecom.order.controller;

import cn.itxs.ecom.commons.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

/**
 * @Name ��OrderController
 * @Description ������������
 * @Author ��itxs
 * @Date ��2022/4/10 20:15
 * @Version ��1.0
 * @History ��
 */
@RestController
public class OrderController {

    @Autowired
    OrderService orderService;

    @Autowired
    private RestTemplate restTemplate;

    @RequestMapping("/create/{userId}/{commodityCode}/{count}")
    public String create(@PathVariable("userId") String userId,@PathVariable("commodityCode") String commodityCode, @PathVariable("count") int count){
        return orderService.create(userId,commodityCode,count).toString();
    }

    @RequestMapping("/deductRest/{commodityCode}/{count}")
    public String deductRest(@PathVariable("commodityCode") String commodityCode, @PathVariable("count") int count){
        String url = "http://ecom-storage-service/deduct/"+commodityCode+"/"+count;
        return restTemplate.getForObject(url, String.class);
    }
}

```

ǰ��server.port�����Ƿ���Nacos�����������������ע��Nacos�������ĵ����÷��ڱ��������ļ�bootstrap.yml��ֱ�����Ϊ4080��4081��4082����3��������ʵ��������������΢����

```
server:
  port: 4080

```

![image-20220505191143684](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/938570a0b63b56671a862e8bda11577a.png)

�鿴nacos�������-�����б���������飬���Կ���3�������Ŀ��ʵ����1������΢����ʵ��

![image-20220505182432182](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/33fa03d937354fe00bb0bb2f3dd5c805.png)

����6�ζ���dedect�ӿڣ�[http://localhost:4070/deductRest/1001/1](http://localhost:4070/deductRest/1001/1) ���Ӳ��ԵĽ��Ҳ��֤��LoadBalancerĬ������ѯ���ؾ�����ԡ�

![image-20220505192217715](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1fc20b1d482d2a4e3924c5707ac2ff19.png)

## ���ؾ����㷨�л�

�����Զ��帺�ؾ���������CustomLoadBalancerConfiguration

```
package cn.itxs.ecom.order.config;

import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.loadbalancer.core.RandomLoadBalancer;
import org.springframework.cloud.loadbalancer.core.ReactorLoadBalancer;
import org.springframework.cloud.loadbalancer.core.ServiceInstanceListSupplier;
import org.springframework.cloud.loadbalancer.support.LoadBalancerClientFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;

public class CustomLoadBalancerConfiguration {

    @Bean
    ReactorLoadBalancer<ServiceInstance> randomLoadBalancer(Environment environment,
                                                            LoadBalancerClientFactory loadBalancerClientFactory) {
        String name = environment.getProperty(LoadBalancerClientFactory.PROPERTY_NAME);
        return new RandomLoadBalancer(loadBalancerClientFactory
                .getLazyProvider(name, ServiceInstanceListSupplier.class),
                name);
    }
}

```

RestTemplateConfig������LoadBalancerClientָ������������࣬value��ֵΪ�ṩ��Ҳ���ǿ��΢�������ơ�

```
package cn.itxs.ecom.order.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.cloud.loadbalancer.annotation.LoadBalancerClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
@LoadBalancerClient(value = "ecom-storage-service", configuration = CustomLoadBalancerConfiguration.class)
public class RestTemplateConfig {

    @LoadBalanced
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.build() ;
    }
}

```

��η��ʶ���dedect�ӿڲ���ȷ�����л�Ϊ������ؾ�����ԡ�

## ���ɷ�ʽ

�����ṩ3�м���Spring Cloud LoadBalancer�ķ�ʽ�����˵�һ��������ʹ�ù�����֧��Spring Web Flux��Ӧʽ��̣�WebClient�Ǵ�Spring WebFlux 5.0�汾��ʼ�ṩ��һ���������Ļ�����Ӧʽ��̵Ľ���Http����Ŀͻ��˹��ߡ�������Ӧʽ��̵Ļ���Reactor�ġ�WebClient���ṩ�˱�׼Http����ʽ��Ӧ��get��post��put��delete�ȷ�������������������Ӧ������

![image-20220506233248585](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/ad44f363342f540b1cb1805b20be6ef0.png)

�ڶ���΢����������spring-boot-starter-webflux����

```
        <dependency>
            <groupId>org.springframework.boot</groupId>
            spring-boot-starter-webflux
        </dependency>

```

����΢����������WebClientConfig������

```
package cn.itxs.ecom.order.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {
    @LoadBalanced
    @Bean
    WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }

    @Bean
    WebClient webClient() {
        return webClientBuilder().build();
    }
}

```

����΢���񶩵������������WebClient�ӿ�ʵ�֣���������

```
    @Autowired
    private WebClient webClient;   

	@RequestMapping(value = "/deductWebClient/{commodityCode}/{count}")
    public Mono<String> deductWebClient(@PathVariable("commodityCode") String commodityCode, @PathVariable("count") int count) {
        String url = "http://ecom-storage-service/deduct/"+commodityCode+"/"+count;
        // ����WebClient
        Mono<String> result = webClient.get().uri(url)
                .retrieve().bodyToMono(String.class);
        return result;
    }

```

������������΢����

![image-20220506234934948](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/ec48e022accfb3298069c96b7e3799e7.png)

���ʶ����������еļ����WebClient�ӿڣ�[http://localhost:4070/deductWebClient/1001/1](http://localhost:4070/deductWebClient/1001/1) ��������سɹ�

![image-20220506234627330](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/5f737fc9d8806dc072ce3e1fdf983de6.png)

���ǻ��������û��ڹ������ķ�ʽ��ͨ��WebClientʹ��ReactiveLoadBalancer�������Ŀ�������Spring Cloud LoadBalancer starter������Spring -webflux����·���У�ReactorLoadBalancerExchangeFilterFunction�����Զ����õġ�

����΢���񶩵������������WebClientʹ��ReactiveLoadBalancer�ӿ�ʵ�֣���������

```
    @Autowired
    private ReactorLoadBalancerExchangeFilterFunction lbFunction;   

    @RequestMapping(value = "/deductWebFluxReactor/{commodityCode}/{count}")
    public Mono<String> deductWebFluxReactor(@PathVariable("commodityCode") String commodityCode, @PathVariable("count") int count) {
        String url = "/deduct/"+commodityCode+"/"+count;
        Mono<String> result = WebClient.builder().baseUrl("http://ecom-storage-service")
                .filter(lbFunction)
                .build()
                .get()
                .uri(url)
                .retrieve()
                .bodyToMono(String.class);
        return result;
    }

```

������������΢����

![image-20220507000930179](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/3546b9913f1253a1b23039ad6f7546d1.png)

���ʶ����������еļ����WebClient�ӿڣ�[http://localhost:4070/deductWebFluxReactor/1001/1](http://localhost:4070/deductWebFluxReactor/1001/1) ��������سɹ�

![image-20220507000746900](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/0bc2b04d23d11bc85009c7e040900b2b.png)

����LoadBalancer�������ṩ�ܶ��������ܣ�����Ȥ��������ϸ���ĺͶ���ʵ��

![image-20220507001132987](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1d8f35933945b317a2dd71627fdfa748.png)

## ԭ��

### RestTemplate

Spring Cloud LoadBalancerԴ����������ȴ�RestTemplate���ؾ���ļ�ʵ�����������֣�����֮����֧��Spring Web Flux��Ӧʽ��̵�ʵ��ԭ��˼��Ҳ����ͬ������ͨ���ͻ������������������������ʵ�ָ��ؾ��⡣��RestTemplate��Դ���п���֪����̳���InterceptingHttpAccessor������

![image-20220508142236428](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/c3ee7af69f54aeed5f1026823779fee8.png)

��InterceptingHttpAccessor���������ṩ��һ������setInterceptors��������������������������Ҫʵ��ClientHttpRequestInterceptor�ӿڼ��ɣ���ʵ��Զ���������˽ӿ�֮ǰ���ȵ�����������intercept������������������൱��Servlet�����е�Filter����

```
	// ����ʵ���ڳ�����InterceptingHttpAccessor��
	// RestTemplate.InterceptingHttpAccessor#setInterceptors
	public void setInterceptors(List<ClientHttpRequestInterceptor> interceptors) {
		Assert.noNullElements(interceptors, "'interceptors' must not contain null elements");
		// Take getInterceptors() List as-is when passed in here
		if (this.interceptors != interceptors) {
			this.interceptors.clear();
			this.interceptors.addAll(interceptors);
			AnnotationAwareOrderComparator.sort(this.interceptors);
		}
	}

```

![image-20220508142443637](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/5062f793bb2bd7f996eb944f77af7137.png)

### **LoadBalancerAutoConfiguration**

�ӹ�������֪��Spring Cloud LoadBalancer����spring-cloud-commons�����Ҳ��Ϊ����ĵ�@LoadBalancedע��Ҳ������spring-cloud-commons��ʵ�֣�����SpringBoot�Զ�װ���ԭ���Ȳ鿴��������ʵ���߼������ѷ���spring-cloud-commons�������Զ�������LoadBalancerAutoConfiguration��ReactorLoadBalancerClientAutoConfiguration��

![image-20220509001530634](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/b5be12e0dd8d515aa07613738efab122.png)

����������������ʱ��@ConditionalΪ����ע�⣩�����Զ�����LoadBalancerInterceptor��ע�뵽RestTemplate�С�

![image-20220508143752218](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/676f6d81529228511c862c780b0c4532.png)

### **LoadBalancerLnterceptor**

LoadBalancerInterceptorʵ����ClientHttpRequestInterceptor�ӿڣ����Ҳʵ��intercept����������ʵ�ָ��ؾ�������ش���

![image-20220508144048248](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/bb587d8122fee4973eba2fc00ed1af3f.png)

### **LoadBalancerClient**

LoadBalancerClient���ڽ��и��ؾ����߼����̳���ServiceInstanceChooser�ӿڣ��ӷ����б���ѡ���һ�������ַ���е��á���LoadBalancerClient�ִ�������execute()��������������ִ������ģ�reconstructURI()�������ع�URL��

![image-20220508144435104](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/a3590c0ab24cb5ee04cf1cf513724fc0.png)

����LoadBalancerClient�ӿ�Spring Cloud LoadBalancer���ṩĬ��ʵ��ΪBlockingLoadBalancerClient

![image-20220508144750601](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/256e4815a982966d7d6bfb82e0e97f67.png)

```
@SuppressWarnings({ "unchecked", "rawtypes" })
public class BlockingLoadBalancerClient implements LoadBalancerClient {

	private final ReactiveLoadBalancer.Factory<ServiceInstance> loadBalancerClientFactory;

	/**
	 * @deprecated in favour of
	 * {@link BlockingLoadBalancerClient#BlockingLoadBalancerClient(ReactiveLoadBalancer.Factory)}
	 */
	@Deprecated
	public BlockingLoadBalancerClient(LoadBalancerClientFactory loadBalancerClientFactory,
			LoadBalancerProperties properties) {
		this.loadBalancerClientFactory = loadBalancerClientFactory;
	}

	public BlockingLoadBalancerClient(ReactiveLoadBalancer.Factory<ServiceInstance> loadBalancerClientFactory) {
		this.loadBalancerClientFactory = loadBalancerClientFactory;
	}

	@Override
	public <T> T execute(String serviceId, LoadBalancerRequest<T> request) throws IOException {
		String hint = getHint(serviceId);
		LoadBalancerRequestAdapter<T, DefaultRequestContext> lbRequest = new LoadBalancerRequestAdapter<>(request,
				new DefaultRequestContext(request, hint));
		Set<LoadBalancerLifecycle> supportedLifecycleProcessors = getSupportedLifecycleProcessors(serviceId);
		supportedLifecycleProcessors.forEach(lifecycle -> lifecycle.onStart(lbRequest));
		ServiceInstance serviceInstance = choose(serviceId, lbRequest);
        // ѡ�����
		if (serviceInstance == null) {
			supportedLifecycleProcessors.forEach(lifecycle -> lifecycle.onComplete(
					new CompletionContext<>(CompletionContext.Status.DISCARD, lbRequest, new EmptyResponse())));
			throw new IllegalStateException("No instances available for " + serviceId);
		}
		return execute(serviceId, serviceInstance, lbRequest);
	}

	@Override
	public <T> T execute(String serviceId, ServiceInstance serviceInstance, LoadBalancerRequest<T> request)
			throws IOException {
		DefaultResponse defaultResponse = new DefaultResponse(serviceInstance);
		Set<LoadBalancerLifecycle> supportedLifecycleProcessors = getSupportedLifecycleProcessors(serviceId);
		Request lbRequest = request instanceof Request ? (Request) request : new DefaultRequest<>();
		supportedLifecycleProcessors
				.forEach(lifecycle -> lifecycle.onStartRequest(lbRequest, new DefaultResponse(serviceInstance)));
		try {
			T response = request.apply(serviceInstance);
			Object clientResponse = getClientResponse(response);
			supportedLifecycleProcessors
					.forEach(lifecycle -> lifecycle.onComplete(new CompletionContext<>(CompletionContext.Status.SUCCESS,
							lbRequest, defaultResponse, clientResponse)));
			return response;
		}
		catch (IOException iOException) {
			supportedLifecycleProcessors.forEach(lifecycle -> lifecycle.onComplete(
					new CompletionContext<>(CompletionContext.Status.FAILED, iOException, lbRequest, defaultResponse)));
			throw iOException;
		}
		catch (Exception exception) {
			supportedLifecycleProcessors.forEach(lifecycle -> lifecycle.onComplete(
					new CompletionContext<>(CompletionContext.Status.FAILED, exception, lbRequest, defaultResponse)));
			ReflectionUtils.rethrowRuntimeException(exception);
		}
		return null;
	}

	private <T> Object getClientResponse(T response) {
		ClientHttpResponse clientHttpResponse = null;
		if (response instanceof ClientHttpResponse) {
			clientHttpResponse = (ClientHttpResponse) response;
		}
		if (clientHttpResponse != null) {
			try {
				return new ResponseData(clientHttpResponse, null);
			}
			catch (IOException ignored) {
			}
		}
		return response;
	}

	private Set<LoadBalancerLifecycle> getSupportedLifecycleProcessors(String serviceId) {
		return LoadBalancerLifecycleValidator.getSupportedLifecycleProcessors(
				loadBalancerClientFactory.getInstances(serviceId, LoadBalancerLifecycle.class),
				DefaultRequestContext.class, Object.class, ServiceInstance.class);
	}

	@Override
	public URI reconstructURI(ServiceInstance serviceInstance, URI original) {
		return LoadBalancerUriTools.reconstructURI(serviceInstance, original);
	}

	@Override
	public ServiceInstance choose(String serviceId) {
		return choose(serviceId, REQUEST);
	}

    // ͨ����ͬ�ĸ��ؾ���ͻ���ʵ��ѡ��ͬ�ķ���
	@Override
	public <T> ServiceInstance choose(String serviceId, Request<T> request) {
		ReactiveLoadBalancer<ServiceInstance> loadBalancer = loadBalancerClientFactory.getInstance(serviceId);
		if (loadBalancer == null) {
			return null;
		}
		Response<ServiceInstance> loadBalancerResponse = Mono.from(loadBalancer.choose(request)).block();
		if (loadBalancerResponse == null) {
			return null;
		}
		return loadBalancerResponse.getServer();
	}

	private String getHint(String serviceId) {
		LoadBalancerProperties properties = loadBalancerClientFactory.getProperties(serviceId);
		String defaultHint = properties.getHint().getOrDefault("default", "default");
		String hintPropertyValue = properties.getHint().get(serviceId);
		return hintPropertyValue != null ? hintPropertyValue : defaultHint;
	}

}

```

### **LoadBalancerClientFactory**

BlockingLoadBalancerClient�г���LoadBalancerClientFactoryͨ��������getInstance������ȡ����ĸ��ؾ���ͻ��ˡ�ͨ��������LoadBalancerClientFactory��ȡ����ĸ��ؾ�����ʵ���������loadBalancer.choose(request)������ӿ�choose()����ʵ�ָ��ݸ��ؾ����㷨ѡ����һ����������ɸ��ؾ��⣬��ReactiveLoadBalancer<t> getInstance(String serviceId) ��Ĭ��ʵ��LoadBalancerClientFactory
![image-20220508190132565](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/4014445b0c2ea7189a232b5d257fb938.png)</t>

LoadBalancerClientFactory�ͻ���ʵ���˲�ͬ�ĸ��ؾ����㷨��������ѯ������ȡ�LoadBalancerClientFactory�̳���NamedContextFactory��NamedContextFactory�̳�ApplicationContextAware��ʵ��Spring ApplicationContext����������

![image-20220508190412076](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/18f62338fdb636327fcdb2d08d33661b.png)

### ReactiveLoadBalancer

ReactiveLoadBalancer���ؾ�����ʵ�ַ���ѡ��Spring Cloud Balancer��ʵ������ѯRoundRobinLoadBalancer�����RandomLoadBalancer��NacosLoadBalancer�㷨��

![image-20220508235128931](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/f19b9fd0d246dbae37b05e67b1a79805.png)

### LoadBalancerClientConfiguration

���û����ʽָ�����ؾ����㷨��Ĭ��ȱʡֵΪRoundRobinLoadBalancer

```
	@Bean
	@ConditionalOnMissingBean
	public ReactorLoadBalancer<ServiceInstance> reactorServiceInstanceLoadBalancer(Environment environment,
			LoadBalancerClientFactory loadBalancerClientFactory) {
		String name = environment.getProperty(LoadBalancerClientFactory.PROPERTY_NAME);
		return new RoundRobinLoadBalancer(
				loadBalancerClientFactory.getLazyProvider(name, ServiceInstanceListSupplier.class), name);
	}

```

![image-20220508235645313](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/c8ae46d4cedb33f40939edb4f6fde542.png)

### **LoadBalancerRequestFactory**

LoadBalancerRequest���������createRequest�������ڴ���LoadBalancerRequest�����ڲ�����LoadBalancerClient����Ҳ������BlockingLoadBalancerClient��

![image-20220509000049541](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/c928dcb312df87a44c33ee77a296ee84.png)

���ճ���Ŀ�У�һ�㸺�ؾ��ⶼ�ǽ��Feignʹ�ã�����������ʱ����������Feign����LoadBalancer���Զ�������FeignLoadBalancerAutoConfiguration��ʵ��

### ReactorLoadBalancerClientAutoConfiguration

����Ҳ��һ�»���WebClient��@Loadbalanced�����̵����룬�����������ؾ��������ReactorLoadBalancerClientAutoConfiguration��һ���Զ�װ�����࣬����Ŀ�������� WebClient �� ReactiveLoadBalancer ��֮���Զ�װ�����̾Ϳ�ʼ���У������ʼ��һ��ʵ���� ExchangeFilterFunction ��ʵ�����ں����ʵ������Ϊ��������ע�뵽WebClient��������������Ȥ�������о�

![image-20220509001650781](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/869a4ea9a6e1409b84c927db08cebea1.png)

## �Զ��帺�ؾ�����

���������֪��LoadBalancerClientFactory�Ǵ����ͻ��������ؾ������Ϳͻ�������ʵ���Ĺ����������ݿͻ������ƴ���һ��Spring ApplicationContext����������ȡ�����bean����˽��뵽LoadBalancerClientFactory���У���Ҫȥʵ�������ӽӿ�ReactorServiceInstanceLoadBalancer����Ϊȥ��ȡ���ؾ�����ʵ����ʱ����ͨ��ȥ�����в���ReactorServiceInstanceLoadBalancer���͵�bean��ʵ�ֵģ����Բ���RandomLoadBalancerʵ�ִ���

```
package org.springframework.cloud.loadbalancer.core;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import reactor.core.publisher.Mono;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.loadbalancer.DefaultResponse;
import org.springframework.cloud.client.loadbalancer.EmptyResponse;
import org.springframework.cloud.client.loadbalancer.Request;
import org.springframework.cloud.client.loadbalancer.Response;

public class RandomLoadBalancer implements ReactorServiceInstanceLoadBalancer {

	private static final Log log = LogFactory.getLog(RandomLoadBalancer.class);

	private final String serviceId;

	private ObjectProvider<ServiceInstanceListSupplier> serviceInstanceListSupplierProvider;

	/**
	 * @param serviceInstanceListSupplierProvider a provider of
	 * {@link ServiceInstanceListSupplier} that will be used to get available instances
	 * @param serviceId id of the service for which to choose an instance
	 */
	public RandomLoadBalancer(ObjectProvider<ServiceInstanceListSupplier> serviceInstanceListSupplierProvider,
			String serviceId) {
		this.serviceId = serviceId;
		this.serviceInstanceListSupplierProvider = serviceInstanceListSupplierProvider;
	}

	@SuppressWarnings("rawtypes")
	@Override
	public Mono<Response<ServiceInstance>> choose(Request request) {
		ServiceInstanceListSupplier supplier = serviceInstanceListSupplierProvider
				.getIfAvailable(NoopServiceInstanceListSupplier::new);
		return supplier.get(request).next()
				.map(serviceInstances -> processInstanceResponse(supplier, serviceInstances));
	}

	private Response<ServiceInstance> processInstanceResponse(ServiceInstanceListSupplier supplier,
			List<ServiceInstance> serviceInstances) {
		Response<ServiceInstance> serviceInstanceResponse = getInstanceResponse(serviceInstances);
		if (supplier instanceof SelectedInstanceCallback && serviceInstanceResponse.hasServer()) {
			((SelectedInstanceCallback) supplier).selectedServiceInstance(serviceInstanceResponse.getServer());
		}
		return serviceInstanceResponse;
	}

	private Response<ServiceInstance> getInstanceResponse(List<ServiceInstance> instances) {
		if (instances.isEmpty()) {
			if (log.isWarnEnabled()) {
				log.warn("No servers available for service: " + serviceId);
			}
			return new EmptyResponse();
		}
		int index = ThreadLocalRandom.current().nextInt(instances.size());

		ServiceInstance instance = instances.get(index);

		return new DefaultResponse(instance);
	}

}

```

��������ʵ�ֽ��м򵥷�д����

```
package cn.itxs.ecom.order.config;

import java.util.List;
import java.util.Random;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.loadbalancer.core.ReactorServiceInstanceLoadBalancer;
import org.springframework.cloud.loadbalancer.core.ServiceInstanceListSupplier;
import org.springframework.cloud.client.loadbalancer.DefaultResponse;
import org.springframework.cloud.client.loadbalancer.EmptyResponse;
import org.springframework.cloud.client.loadbalancer.Request;
import org.springframework.cloud.client.loadbalancer.Response;
import reactor.core.publisher.Mono;

public class ItxsRandomLoadBalancerClient implements ReactorServiceInstanceLoadBalancer {
    // �����б�
    private ObjectProvider<ServiceInstanceListSupplier> serviceInstanceListSupplierProvider;

    public ItxsRandomLoadBalancerClient(ObjectProvider<ServiceInstanceListSupplier> serviceInstanceListSupplierProvider) {
        this.serviceInstanceListSupplierProvider = serviceInstanceListSupplierProvider;
    }

    @Override
    public Mono<Response<ServiceInstance>> choose(Request request) {
        ServiceInstanceListSupplier supplier = serviceInstanceListSupplierProvider.getIfAvailable();
        return supplier.get().next().map(this::getInstanceResponse);
    }

    /**
     * ʹ���������ȡ����
     * @param instances
     * @return
     */
    private Response<ServiceInstance> getInstanceResponse(
            List<ServiceInstance> instances) {
        System.out.println("ItxsRandomLoadBalancerClient start");
        if (instances.isEmpty()) {
            return new EmptyResponse();
        }

        System.out.println("ItxsRandomLoadBalancerClient random");
        // ����㷨
        int size = instances.size();
        Random random = new Random();
        ServiceInstance instance = instances.get(random.nextInt(size));

        return new DefaultResponse(instance);
    }
}

```

������CustomLoadBalancerConfiguration�滻Ϊ��������

```
package cn.itxs.ecom.order.config;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.cloud.loadbalancer.core.ReactorServiceInstanceLoadBalancer;
import org.springframework.cloud.loadbalancer.core.ServiceInstanceListSupplier;
import org.springframework.context.annotation.Bean;

public class CustomLoadBalancerConfiguration {

    @Bean
    public ReactorServiceInstanceLoadBalancer customLoadBalancer(ObjectProvider<ServiceInstanceListSupplier> serviceInstanceListSupplierProvider) {
        return new ItxsRandomLoadBalancerClient(serviceInstanceListSupplierProvider);
    }
}

```

�������΢����Ͷ���΢���񣬷���http://localhost:4070/deductRest/1001/1 ������̨�Ѵ�ӡ�Զ���ItxsRandomLoadBalancerClient�е���־�ͳɹ����ʽ��

![image-20220509003807968](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/c72e3f02f7e0d5d3343f8ae9c464b69c.png)

![image-20220509003927550](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/59796bbbd6b3524e32759d42b622f1bc.png)

# �ο�����
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud
https://github.com/macrozheng/springcloud-learning