**ѧϰĿ��**

1.  �Ƶ�Ribbon�ĺ�������
2.  ��дһ�����װ��Ribbon
3.  ͨ��Դ����֤�Ƶ�������
    **��1�� ���������Ƶ�**
    ��ʵRibbon�ĺ������̺ܼ򵥣�������ʹ�ù������޷Ǿ���������һ��spring-cloud-starter-netflix-ribbon��jar����Ȼ���ڳ���������ʱ��ע����һ��RestTemplate�����ڸö�������������һ��@LoadBalancedע�⣬Ȼ����ͨ��RestTemplate����ȥ����URL��ʱ����ܸ��ݲ�ͬ�ĸ��ؾ������ȥ����ͬ�ķ��������ע�⣬����˵���jar����������ʲô�����أ�

��������Ҫ���ף�spring-cloud-starter-netflix-ribbon���jar����������������֪�������ǻ���starter����ģ������϶�������springboot���Զ�װ��ԭ��������������ʱ���ṩ��һ���Զ������࣬����������Ҫ�õĶ���ע�뵽IoC��������ȥ�ˣ������ӹ���ɡ�

Ȼ��Ҫ��RestTemplate����ȥ����Ŀ������ʱ�����ʱ�����ǿ϶���Ҫ����ʵ��IP�Ͷ˿����滻����������һ����ʵ���Ǻ��Ĳ��裬��Ҫ��ô���أ���ô����������֮ǰ����ַ�Ͷ˿���è��̫�ӻ�����ʵ���أ�

�������ճ������У�����Ӧ��֪������һ����������һ����������ʵ������������������԰ɣ����ԣ�ʵ���Ͼ����ڻ�ȡRestTemplate�����ʱ�򣬽��ö������������һ������������RestTemplate����ִ��ĳ��������ʱ�򣬶���ȥ����������ִ��һ�顣Ȼ��������ˡ�

���������ͼ�Ƶ����£�![SpringCloudϵ�С�RibbonԴ�����-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1790fb324161913dd79098940f8102d652cd86.jpg "SpringCloudϵ�С�RibbonԴ�����-��Դ�����������")**��2�� ���װ�Ribbonʵ��**
����������Ƶ����̣����ǽ�������ʵ��һ�����װ��Ribbon��

����Ĳ�������Ҫ��������˼·��

1.����Ҫʵ��һ��starter�������������springboot����springboot��������ʱ������õ���Ӧ��RestTemplate��bean���󡣴���һ��Maven��quickstart��Ŀ

2.Ȼ������



```
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.example</groupId>
  myribbon-spring-cloud-starter
  <version>1.0-SNAPSHOT</version>

  <name>myribbon-spring-cloud-starter</name>
  <!-- FIXME change it to the project's website -->
  <url>http://www.example.com</url>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
    <spring-boot.version>2.3.2.RELEASE</spring-boot.version>
  </properties>

  <!-- RestTemplate����Ҫ�õ�SpringMVC -->
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      spring-boot-starter-web
      <version>${spring-boot.version}</version>
    </dependency>

    <dependency>
      <groupId>org.springframework.boot</groupId>
      spring-boot-starter-test
      <version>${spring-boot.version}</version>
    </dependency>

    <!-- ��������漯����һЩ���Ľӿ� -->
    <dependency>
      <groupId>org.springframework.cloud</groupId>
      spring-cloud-commons
      <version>2.2.6.RELEASE</version>
    </dependency>
  </dependencies>

  <build>
    <pluginManagement><!-- lock down plugins versions to avoid using Maven defaults (may be moved to parent pom) -->
      <plugins>
        <!-- clean lifecycle, see https://maven.apache.org/ref/current/maven-core/lifecycles.html#clean_Lifecycle -->
        <plugin>
          maven-clean-plugin
          <version>3.1.0</version>
        </plugin>
        <!-- default lifecycle, jar packaging: see https://maven.apache.org/ref/current/maven-core/default-bindings.html#Plugin_bindings_for_jar_packaging -->
        <plugin>
          maven-resources-plugin
          <version>3.0.2</version>
        </plugin>
        <plugin>
          maven-compiler-plugin
          <version>3.8.0</version>
        </plugin>
        <plugin>
          maven-surefire-plugin
          <version>2.22.1</version>
        </plugin>
        <plugin>
          maven-jar-plugin
          <version>3.0.2</version>
        </plugin>
        <plugin>
          maven-install-plugin
          <version>2.5.2</version>
        </plugin>
        <plugin>
          maven-deploy-plugin
          <version>2.8.2</version>
        </plugin>
        <!-- site lifecycle, see https://maven.apache.org/ref/current/maven-core/lifecycles.html#site_Lifecycle -->
        <plugin>
          maven-site-plugin
          <version>3.7.1</version>
        </plugin>
        <plugin>
          maven-project-info-reports-plugin
          <version>3.0.0</version>
        </plugin>
      </plugins>
    </pluginManagement>
  </build>
</project>
```









3.����������



```
@Configuration
public class MyRibbonAutoConfiguration {
    //���װ��Ribbon�ǿ������ȥ��ɸ��ؾ����㷨�Լ���ʵ��ip�Ͷ˿��滻��
    @Bean
    public LoadBalancerClient loadBalancerClient(){
        return new MyLoadBalancerClient();
    }
    //�ռ����д�MyLoadBalancedע���RestTemplate����
    @MyLoadBalanced
    @Autowired(required = false)
    private List<RestTemplate> restTemplates = Collections.emptyList();
    @Bean
    @ConditionalOnMissingBean
    public LoadBalancerRequestFactory loadBalancerRequestFactory(
            LoadBalancerClient loadBalancerClient) {
        return new LoadBalancerRequestFactory(loadBalancerClient);
    }
    //����Ǻ��ĵ�������
    @Bean
    public MyLoadBalancerInterceptor myLoadBalancerInterceptor(
            LoadBalancerClient loadBalancerClient,
            LoadBalancerRequestFactory requestFactory){
        return new MyLoadBalancerInterceptor(loadBalancerClient,requestFactory);
    }
    //�ռ�����RestTemplate���������ﶼ������һ��������
    @Bean
    public SmartInitializingSingleton smartInitializingSingleton(
            final MyLoadBalancerInterceptor myLoadBalancerInterceptor){
        return ()->{
            for (RestTemplate restTemplate : MyRibbonAutoConfiguration.this.restTemplates) {
                List<ClientHttpRequestInterceptor> list = new ArrayList<>(
                        restTemplate.getInterceptors());
                list.add(myLoadBalancerInterceptor);
                restTemplate.setInterceptors(list);
            }
        };
    }
}
```









4.����MyLoadBalancerClient



```
public class MyLoadBalancerClient implements LoadBalancerClient {
    @Autowired
    AbstractEnvironment environment;
    //1.�����������������������
    @Override
    public <T> T execute(String serviceId, LoadBalancerRequest<T> request) throws IOException {
        ServiceInstance server = this.choose(serviceId);
        return execute(serviceId, server, request);
    }	
    //3.����ִ��Http����
    @Override
    public <T> T execute(String serviceId, ServiceInstance serviceInstance, LoadBalancerRequest<T> request) throws IOException {
        T returnVal = null;
        try {
            returnVal = request.apply(serviceInstance);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return returnVal;
    } 
	//4.��һ����������ʵ��ip��port�滻������
    @Override
    public URI reconstructURI(ServiceInstance instance, URI original) {
        String host = instance.getHost();
        int port = instance.getPort();
        if (host.equals(original.getHost())
                && port == original.getPort()
                ) {
            return original;
        }
        try {
            StringBuilder sb = new StringBuilder();
            sb.append("http").append("://");
            if (!Strings.isNullOrEmpty(original.getRawUserInfo())) {
                sb.append(original.getRawUserInfo()).append("@");
            }
            sb.append(host);
            if (port >= 0) {
                sb.append(":").append(port);
            }
            sb.append(original.getRawPath());
            if (!Strings.isNullOrEmpty(original.getRawQuery())) {
                sb.append("?").append(original.getRawQuery());
            }
            if (!Strings.isNullOrEmpty(original.getRawFragment())) {
                sb.append("#").append(original.getRawFragment());
            }
            URI newURI = new URI(sb.toString());
            return newURI;
        }catch (URISyntaxException e){
            throw new RuntimeException(e);
        }
    }
    //2.���ؾ����㷨����һ�����з����ip�Ͷ˿�ѡ���������õ�������㷨
    @Override
    public ServiceInstance choose(String serviceId) {
        Server instance = new Server(serviceId,null,"127.0.0.1",8080);
        String sr = environment.getProperty(serviceId+".ribbon.listOfServers");
        if (!StringUtils.isEmpty(sr)){
            String[] arr = sr.split(",",-1);
            Random selector = new Random();
            int next = selector.nextInt(arr.length);
            String a = arr[next];
            String[] srr = a.split(":",-1);
            instance.setHost(srr[0]);
            instance.setPort(Integer.parseInt(srr[1]));
        }
        return instance;
    }
}
```









5.���������߼���ʵ�ܼ򵥣���������������http����֮ǰ����ִ���ҵ��߼�



```
public class MyLoadBalancerInterceptor implements ClientHttpRequestInterceptor {
    private LoadBalancerClient loadBalancerClient;
    private LoadBalancerRequestFactory requestFactory;
    public MyLoadBalancerInterceptor(LoadBalancerClient loadBalancerClient,
                                   LoadBalancerRequestFactory requestFactory) {
        this.loadBalancerClient = loadBalancerClient;
        this.requestFactory = requestFactory;
    }
    @Override
    public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException {
        final URI originalUri = request.getURI();
        String serviceName = originalUri.getHost();
        return this.loadBalancerClient.execute(serviceName,
                this.requestFactory.createRequest(request, body, execution));
    }
}
```









6.�����Լ���ע��



```
@Target({ ElementType.FIELD, ElementType.PARAMETER, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@Qualifier
public @interface MyLoadBalanced {
}
```









7.����һ���Լ���Serverʵ����



```
public class Server implements ServiceInstance {
    private String serviceId;
    private String instanceId;
    private String host;
    private int port;
    public Server(String serviceId, String instanceId, String host, int port) {
        this.serviceId = serviceId;
        this.instanceId = instanceId;
        this.host = host;
        this.port = port;
    }
    public Server() {
    }
    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }
    public void setInstanceId(String instanceId) {
        this.instanceId = instanceId;
    }
    public void setHost(String host) {
        this.host = host;
    }
    public void setPort(int port) {
        this.port = port;
    }
    @Override
    public String getInstanceId() {
        return null;
    }
    @Override
    public String getServiceId() {
        return null;
    }
    @Override
    public String getHost() {
        return host;
    }
    @Override
    public int getPort() {
        return port;
    }
    @Override
    public boolean isSecure() {
        return false;
    }
    @Override
    public URI getUri() {
        return null;
    }
    @Override
    public Map<String, String> getMetadata() {
        return null;
    }
    @Override
    public String getScheme() {
        return null;
    }
}
```









8.дspring.factories�ļ�



```
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
    com.example.config.MyRibbonAutoConfiguration
```









9.���jar�������ԣ����Ե�ʱ����Ҫ�������ļ�



```
<serverName>.ribbon.listOfServers=127.0.0.1:2223,127.0.0.1:2222
```









**��3�� Դ����֤**
**3.1 @LoadBalanced**
���ϽڿεĴ��뿴������ֻ����RestTemplate�������һ��@LoadBalance,�Ϳ���ʵ�ָ��ؾ����ˣ��������ǵ������@LoadBalance����һ�£������ע��������һ��@Qualifierע�⡣��ע���޶��ĸ�beanӦ�ñ��Զ�ע�롣��Spring�޷��жϳ��ĸ�beanӦ�ñ�ע��ʱ��@Qualifierע����������������bean���Զ�ע�룬���Ӽ����롣



```
/**
 * Annotation to mark a RestTemplate or WebClient bean to be configured to use a
 * LoadBalancerClient.
 * @author Spencer Gibb
 */
@Target({ ElementType.FIELD, ElementType.PARAMETER, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@Qualifier
public @interface LoadBalanced {

}
```









��ע���п���֪�������ע����������RestTemplate����ǣ���ʹ�ø��ؾ���ͻ��ˣ�LoadBalancerClient���������������ԣ����������ɵ�RestTemplate��bean�������ôһ��ע�⣬���bean�ͻ�����LoadBalancerClient��

**3.2 LoadBalancerClient**
��ô�����ٿ���LoadBalancerClient�Ĵ��룺



```
public interface LoadBalancerClient extends ServiceInstanceChooser {
	<T> T execute(String serviceId, LoadBalancerRequest<T> request) throws IOException;
	<T> T execute(String serviceId, ServiceInstance serviceInstance,
			LoadBalancerRequest<T> request) throws IOException;
	URI reconstructURI(ServiceInstance instance, URI original);
}
public interface ServiceInstanceChooser {
	ServiceInstance choose(String serviceId);
}
```









LoadBalancerClient��һ���ӿڣ�����������������

ServiceInstance choose(String serviceId);�ӷ������ϾͿ��Կ������Ǹ��ݴ����serviceId�������������Ӹ��ؾ�������ѡ��һ������ʵ��������ʵ��ͨ��ServiceInstance������ʾ��
execute������ʹ�ôӸ��ؾ�������ѡ��ķ���ʵ����ִ���������ݡ�
URI reconstructURI(ServiceInstance instance, URI original);�����������¹���һ��URI�ģ����ǵ������ڴ����У�ͨ��RestTemplate�������ʱ��д���Ƿ������ɣ���������ͻ����������URI����ת��������host+port��ͨ��host+port����ʽȥ�������
**3.3 �Զ�װ��**
��springboot����֮�󣬻�ͨ���Զ�װ���Զ�ȥ
spring-cloud-netflix-ribbon���jar����META-INFĿ¼��spring.factories�ļ������ҽ�RibbonAutoConfiguration���������ע�롣����RibbonAutoConfiguration����������Ϊ����@AutoConfigureBeforeע�⣬�����ֻ����LoadBalancerAutoConfiguration�����ࡣ��LoadBalancerAutoConfiguration���У�spring�����Ὣ���б�@LoadBalanceע�����ε�beanע�뵽IOC������



```
@LoadBalanced
@Autowired(required = false)
private List<RestTemplate> restTemplates = Collections.emptyList();
```









ͬʱ����LoadBalancerAutoConfiguration�������л���Ϊÿ��RestTemplateʵ�����LoadBalancerInterceptor��������

��RibbonAutoConfiguration����ע����LoadBalancerClient�ӿڵ�ʵ����RibbonLoadBalancerClient



```
@Bean
@ConditionalOnMissingBean(LoadBalancerClient.class)
public LoadBalancerClient loadBalancerClient() {
    return new RibbonLoadBalancerClient(springClientFactory());
}
```









**3.4 ������**
�������Զ��������У���restTemplateʵ�������LoadBalancerInterceptor�����������ԣ�����restTemplate����http����ʱ���ͻ�ִ�������������intercept������

intercept�����У������request.getURI()����ȡ�����uri���ٻ�ȡhost�������ڷ���http�����ʱ�����õķ�������Ϊhost�����ԣ�����ͻ��õ����������ٵ��þ���LoadBalancerClientʵ����execute��������������

LoadBalancerClient��ʵ����ΪRibbonLoadBalancerClient�����յĸ��ؾ�������������ִ�У����ԣ�����Ҫ��������RibbonLoadBalancerClient���߼���

�ȿ���RibbonLoadBalancerClient�е�execute������



```
public <T> T execute(String serviceId, LoadBalancerRequest<T> request, Object hint)
    throws IOException {
    ILoadBalancer loadBalancer = getLoadBalancer(serviceId);
    Server server = getServer(loadBalancer, hint);
    if (server == null) {
        throw new IllegalStateException("No instances available for " + serviceId);
    }
    RibbonServer ribbonServer = new RibbonServer(serviceId, server,
                                                 isSecure(server, serviceId),
                                                 serverIntrospector(serviceId).getMetadata(server));

    return execute(serviceId, ribbonServer, request);
}

@Override
public <T> T execute(String serviceId, ServiceInstance serviceInstance,
                     LoadBalancerRequest<T> request) throws IOException {
    Server server = null;
    if (serviceInstance instanceof RibbonServer) {
        server = ((RibbonServer) serviceInstance).getServer();
    }
    if (server == null) {
        throw new IllegalStateException("No instances available for " + serviceId);
    }

    RibbonLoadBalancerContext context = this.clientFactory
        .getLoadBalancerContext(serviceId);
    RibbonStatsRecorder statsRecorder = new RibbonStatsRecorder(context, server);
    try {
        T returnVal = request.apply(serviceInstance);
        statsRecorder.recordStats(returnVal);
        return returnVal;
    }
    // catch IOException and rethrow so RestTemplate behaves correctly
    catch (IOException ex) {
        statsRecorder.recordStats(ex);
        throw ex;
    }
    catch (Exception ex) {
        statsRecorder.recordStats(ex);
        ReflectionUtils.rethrowRuntimeException(ex);
    }
    return null;
}
```









��������ΪserviceId�ֶδ���������ͨ��getLoadBalancer��ȡloadBalancer���ٸ���loadBalancer��ȡserver��������getServer�Ĵ��룺



```
protected Server getServer(ILoadBalancer loadBalancer, Object hint) {
    if (loadBalancer == null) {
        return null;
    }
    // Use 'default' on a null hint, or just pass it on?
    return loadBalancer.chooseServer(hint != null ? hint : "default");
}
```









���loadBalancerΪ�գ���ֱ�ӷ��ؿգ�����͵���loadBalancer��chooseServer��������ȡ��Ӧ��server��

��һ��ILoadBalancer��һ���ӿڣ�����������һϵ�и��ؾ���ʵ�ֵķ�����



```
public interface ILoadBalancer {
	public void addServers(List<Server> newServers);
	public Server chooseServer(Object key);
	public void markServerDown(Server server);
	@Deprecated
	public List<Server> getServerList(boolean availableOnly);
    public List<Server> getReachableServers();
	public List<Server> getAllServers();
}
```









��Щ�������Ƚ�ֱ�ۣ������׾��ܲ³��Ǹ�ɶ�ģ�addServers���������һ��server���ϣ�chooseServer��ѡ��һ��server��markServerDown�������ĳ���������ߣ�getReachableServers��ȡ���õ�Server���ϣ�getAllServers�ǻ�ȡ���е�server���ϡ�
ILoadBalancer�кܶ�ʵ�֣��Ǿ������õ��ĸ����أ���RibbonAutoConfiguration����ע��SpringClientFactory��ͨ��RibbonClientConfiguration�࿴��������������ڳ�ʼ����ʱ�򣬷�����ZoneAwareLoadBalancer��Ϊ���ؾ�������



```
@Bean
@ConditionalOnMissingBean
public ILoadBalancer ribbonLoadBalancer(IClientConfig config,
                                        ServerList<Server> serverList, ServerListFilter<Server> serverListFilter,
                                        IRule rule, IPing ping, ServerListUpdater serverListUpdater) {
    if (this.propertiesFactory.isSet(ILoadBalancer.class, name)) {
        return this.propertiesFactory.get(ILoadBalancer.class, config, name);
    }
    return new ZoneAwareLoadBalancer<>(config, rule, ping, serverList,
                                       serverListFilter, serverListUpdater);
}
```









**3.5 ZoneAwareLoadBalancer**
ZoneAwareLoadBalancer�������п��Կ�������������ؾ�������zone���й�ϵ�ġ����濴��ZoneAwareLoadBalancer�е�chooseServer������

> eureka�ṩ��region��zone�������������з��������������������������ѷ��AWS��
> region�����Լ����Ϊ�����ϵķ������������޵��������߻����������ٻ��߱����ȵȣ�û�о����С�����ơ�������Ŀ�����������������к�����region��
> zone�����Լ����Ϊregion�ڵľ������������˵region����Ϊ������Ȼ�󱱾��������������Ϳ����ڴ�region֮�»��ֳ�zone1,zone2����zone��



```
@Override
public Server chooseServer(Object key) {
    //ֻ�е����ؾ�������ά����ʵ��������Zone����ĸ�������1��ʱ��Ż�ִ��ѡ�����
    //������ʹ�ø����ʵ��
    if (!ENABLED.get() || getLoadBalancerStats().getAvailableZones().size() <= 1) {
        logger.debug("Zone aware logic disabled or there is only one zone");
        return super.chooseServer(key);
    }
    Server server = null;
    try {
        LoadBalancerStats lbStats = getLoadBalancerStats();
        //Ϊ��ǰ���ؾ������е�����Zone����ֱ𴴽����գ�������zoneSnapshot�У���Щ�����е��������ں������㷨
        Map<String, ZoneSnapshot> zoneSnapshot = ZoneAvoidanceRule.createSnapshot(lbStats);
        logger.debug("Zone snapshots: {}", zoneSnapshot);
        if (triggeringLoad == null) {
            triggeringLoad = DynamicPropertyFactory.getInstance().getDoubleProperty(
                "ZoneAwareNIWSDiscoveryLoadBalancer." + this.getName() + ".triggeringLoadPerServerThreshold", 0.2d);
        }

        if (triggeringBlackoutPercentage == null) {
            triggeringBlackoutPercentage = DynamicPropertyFactory.getInstance().getDoubleProperty(
                "ZoneAwareNIWSDiscoveryLoadBalancer." + this.getName() + ".avoidZoneWithBlackoutPercetage", 0.99999d);
        }
        //��ÿ���Zone����ļ��ϣ�getAvailableZones��ͨ��zoneSnapshotʵ�ֿ���������ѡ
        Set<String> availableZones = ZoneAvoidanceRule.getAvailableZones(zoneSnapshot, triggeringLoad.get(), triggeringBlackoutPercentage.get());
        logger.debug("Available zones: {}", availableZones);
        if (availableZones != null &&  availableZones.size() < zoneSnapshot.keySet().size()) {
            //���ѡ��һ��Zone����
            String zone = ZoneAvoidanceRule.randomChooseZone(zoneSnapshot, availableZones);
            logger.debug("Zone chosen: {}", zone);
            if (zone != null) {
                //��ö�Ӧ����ĸ��ؾ�����
                BaseLoadBalancer zoneLoadBalancer = getLoadBalancer(zone);
                //ѡ�����ķ���ʵ��
                //��chooseServer�н���ʹ��IRule�ӿڵ�choose������ѡ��������ʵ���������IRule�ӿڵ�ʵ�ֻ�ʵ��ZoneAvoidanceRule����ѡ����ķ���ʵ����
                server = zoneLoadBalancer.chooseServer(key);
            }
        }
    } catch (Exception e) {
        logger.error("Error choosing server using zone aware logic for load balancer={}", name, e);
    }
    if (server != null) {
        return server;
    } else {
        logger.debug("Zone avoidance logic is not invoked.");
        return super.chooseServer(key);
    }
}
```









������������server��zone�Ϳ�������ѡ������ʵ��������һ��Server����

���������ļ���������

1.  setServerListForZones : �������Zone���з��񻮷�
2.  chooseServer����Ҳ����Ҫ��zone�йصļ��㣬��ȻĬ�ϵ�Zoneֻ��һ��������ֱ���ǵ��õĸ����chooseServer��key)
3.  getLoadBalancer(String zone) ����zoneȥ��ȡLoadBalancer
4.  setRule(IRule rule) Ϊÿ�����ؾ��������ù���
    ������Կ�������ʵ�����Ҫ�����Zone����һЩ���ദ�����ǽ�ԭ������ͬһ����ķ���ʵ�����ٸ��ݵ������л��֡���Ҳ��Ϊ���ܹ�������Ӧ�����õġ�

**3.5.1 DynamicServerListLoadBalancer**

> ZoneAwareLoadBalancer�ĸ���

����ఴ��������˵���Ƕ�̬���ط����б�ʹ�õġ������м����Ƚ���Ҫ�ķ���

1.  updateListOfServers:�����б����±��ػ���ķ����б�
2.  enableAndInitLearnNewServersFeature:���������б���¶�ʱ����
3.  ��������:@Monitor

DynamicServerListLoadBalancer�ĺ��ľ��ǻ�ȡ�����б���Eureka��Ĭ����ͨ��DomainExtractingServerList����ȡ�����������org.springframework.cloud.netflix.ribbon.eureka.EurekaRibbonClientConfiguration#ribbonServerList������û�м���Eureka����ʱ����

**3.5.2 BaseLoadBalancer**

> DynamicServerListLoadBalancer�ĸ���

����Ĭ��ֵ

*   Ĭ�ϵĸ��ؾ������RoundRobinRule
*   Ĭ�ϵ�Ping����SerialPingStrategy
*   ���з���ʵ��������allServerList
*   ���߷���ʵ��������upServerList
    ![SpringCloudϵ�С�RibbonԴ�����-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/b2db0bc66c3045288a762907ff72e01883bf20.jpg "SpringCloudϵ�С�RibbonԴ�����-��Դ�����������")�����๹���н���Ӧ�ĸ��ؾ������ping���ԣ�ping�ȴ��ݹ���

**ping����Щʲô��**

PingTask��Ϊһ���߳����񣬾��Ƕ��ڼ������Ƿ񶼴���ServerListUpdater������»��Ʋ���ͻ������ribbon�Լ�ά����һ�׷�������ƣ���Ҫ��Ϊ�˽��ͷ���ʧ�ܵĸ��ʡ�Ĭ����ʹ��eurekaʱ��ping��ʹ�õ���NIWSDiscoveryPing����ɷ��񱣻��⡣��eureka �� ServerListUpdater��ˢ�·����б�![SpringCloudϵ�С�RibbonԴ�����-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/27db4c518aa7c100d427761832a9fa19fa8f04.jpg "SpringCloudϵ�С�RibbonԴ�����-��Դ�����������")�����и����õĶ�ʱ��������˳��ķ������Ҿ����������Լ�д��ʱ��Ҳ����ʹ�á�

������ͬһ����ʱ�������ִ��ʱ�䳬���˶�ʱ���ڣ���ô��һ����ʱ��������һ����ʱ����û��ִ����ʱ������ȡ����![SpringCloudϵ�С�RibbonԴ�����-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/f2d669b11f17530d2e62603d45949e934a5931.jpg "SpringCloudϵ�С�RibbonԴ�����-��Դ�����������")����Ҳ���˺ܶ������ƣ��������з���ʵ����һ���µĶ���ʱʹ�õ��Ƕ��������Ǹ���allServers����ֻ�ܶ�����д��![SpringCloudϵ�С�RibbonԴ�����-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/711c81e67b2c1cd3fb91005f53ea1e1352ad9a.png "SpringCloudϵ�С�RibbonԴ�����-��Դ�����������")�ڷ���ping�󣬽����ͨ���ķ������newUpList�У����ͨ��д������upServerList��ס��

�������ֻ����һ��д���Ҳ��ܶ���![SpringCloudϵ�С�RibbonԴ�����-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/047543857174aa1130b0747d1d149ffd6d5632.jpg "SpringCloudϵ�С�RibbonԴ�����-��Դ�����������")������ping�ڼ������й��ڶ�д����ԭ�����ʹ�á�

��Ҫ���̾��ǣ�

1.  ��ȡȫ������ʵ���б�
2.  ������ʵ���Ƿ���pingServers
3.  ������״̬�����ı�ķ���changedServers
4.  ���������ߵķ���newUpList
5.  ��newUpList��ֵ��upServerList ���߷���ʵ���б���

������pingServers���Ǽ��������

**BaseLoadBalancer���������ܼ���**

1.  ��allServerList��upServerList�Ķ�д������
2.  �ṩ��allServerList��upServerList����ɾ�Ĺ���
3.  �ṩ��PingTask��ping�Ķ�ʱ���񣩣�Pinger��ping��ִ������
4.  ���ڸ��ؾ������ѡ�����rule.choose(key)
5.  �ṩĬ�ϵ�ping����SerialPingStrategy
    **3.6 LoadBalancerRequest**
    ͨ��ZoneAwareLoadBalancerѡ������Server֮���ٰ�װ��RibbonServer����֮ǰ���ص�server�Ǹö����е�һ���ֶΣ�����֮�⣬���з�����serviceId���Ƿ���Ҫʹ��https����Ϣ�����ͨ��LoadBalancerRequest��apply������������server�����󣬴Ӷ�ʵ���˸��ؾ��⡣

������apply�����Ķ��壺



```
public interface LoadBalancerRequest<T> {
    T apply(ServiceInstance instance) throws Exception;
}
```









������ʱ�������ribbonServer���󣬱�����ServiceInstance���͵Ķ�����н��ա�ServiceInstance��һ���ӿڣ������˷�������ϵͳ�У�ÿ��ʵ����Ҫ�ṩ����Ϣ������serviceId��host��port�ȡ�

LoadBalancerRequest��һ���ӿڣ����ջ�ͨ��ʵ�����apply����ȥִ�У�ʵ��������LoadBalancerInterceptor�е���RibbonLoadBalancerClient��execute����ʱ����������һ�������࣬����ͨ���鿴LoadBalancerInterceptor�Ĵ��뿴����

����LoadBalancerRequest�������ʱ�򣬾���д��apply������apply�����У����½���һ��ServiceRequestWrapper���ڲ��࣬������У�����д��getURI������getURI���������loadBalancer��reconstructURI����������uri��

��������Ѿ����Դ���֪��Ribbonʵ�ָ��ؾ���������ˣ�������RestTemplate�����ע�⣬�ͻ���LoadBalancerClient�Ķ�������������Ҳ����RibbonLoadBalancerClient��ͬʱ��
LoadBalancerAutoConfiguration��������ã�����һ��LoadBalancerInterceptor�������õ���������������restTemplate������ЩrestTemplate�����LoadBalancerInterceptor��������

��ͨ��restTemplate��������ʱ���ͻᾭ����������������������У��ͻ����RibbonLoadBalancerClient�еķ�������ȡ�����ݷ�������ͨ�����ؾ��ⷽ����ȡ������ʵ����Ȼ��ȥ�������ʵ����

**3.7 ��ȡ�����б�**
����˵����Щ������ζ�������и��ؾ���ģ����ǻ��и����⣬���������ʵ�����Ǵ�Eureka Server�ϻ�ȡ���ģ������ʵ���б�����λ�ȡ���أ���ô��֤���ʵ���б��е�ʵ���ǿ��õ��أ�

��RibbonLoadBalancerClientѡ��ʵ����ʱ����ͨ��ILoadBalancer��ʵ������ݸ��ؾ����㷨ѡ�����ʵ���ģ�Ҳ����ZoneAwareLoadBalancer��chooseServer�е��߼����Ǿ����������������鿴ZoneAwareLoadBalancer�ļ̳й�ϵ�����Կ�������ͼ��ʾ��![SpringCloudϵ�С�RibbonԴ�����-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/425d8ff567d9ac6171f6036dab1726a7da04a3.jpg "SpringCloudϵ�С�RibbonԴ�����-��Դ�����������")���Կ�������������ILoadBalancer�ӿڣ�AbstractLoadBalancer��̳�������ӿڣ�BaseLoadBalancer�̳���AbstractLoadBalancer�࣬
DynamicServerListLoadBalancer�̳���BaseLoadBalancer��ZoneAwareLoadBalancer�̳���DynamicServerListLoadBalancer��

ILoadBalancer�ӿڵĴ����Ѿ������ˣ����ڿ���AbstractLoadBalancer�Ĵ��룺



```
public abstract class AbstractLoadBalancer implements ILoadBalancer {
    public enum ServerGroup{
        ALL,
        STATUS_UP,
        STATUS_NOT_UP        
    }    
    /**
     * delegate to {@link #chooseServer(Object)} with parameter null.
     */
    public Server chooseServer() {
    	return chooseServer(null);
    }
    /**
     * List of servers that this Loadbalancer knows about
     * 
     * @param serverGroup Servers grouped by status, e.g., {@link ServerGroup#STATUS_UP}
     */
    public abstract List<Server> getServerList(ServerGroup serverGroup);
    /**
     * Obtain LoadBalancer related Statistics
     */
    public abstract LoadBalancerStats getLoadBalancerStats();    
}
```









����һ�������࣬�������һ��ö�٣��������������󷽷��������chooseServer������

�����ٿ�BaseLoadBalancer�࣬BaseLoadBalancer������Ǹ��ؾ�������һ������ʵ���࣬��������Կ�������������list��



```
@Monitor(name = PREFIX + "AllServerList", type = DataSourceType.INFORMATIONAL)
protected volatile List<Server> allServerList = Collections
    .synchronizedList(new ArrayList<Server>());
@Monitor(name = PREFIX + "UpServerList", type = DataSourceType.INFORMATIONAL)
protected volatile List<Server> upServerList = Collections
    .synchronizedList(new ArrayList<Server>());
```









�������Ͽ��������ά�����з����ʵ���б���ά��״̬Ϊup��ʵ���б�
���һ����Կ���BaseLoadBalancer��ʵ�ֵ�ILoadBalancer�ӿ��еķ�����������������������ȡ���õķ����б��ͻ��upServerList���أ���ȡ���еķ����б��ͻ��allServerList���ء�



```
@Override
public List<Server> getReachableServers() {
    return Collections.unmodifiableList(upServerList);
}
@Override
public List<Server> getAllServers() {
    return Collections.unmodifiableList(allServerList);
}
```









���������ٿ�DynamicServerListLoadBalancer�ࡣ����ͷ�ϵ�ע�Ϳ���֪�����������Զ�̬�Ļ�ȡ�����б���������filter�Է����б���й��ˡ�

��DynamicServerListLoadBalancer���У��ܿ���������һ��ServerList���͵�serverListImpl�ֶΣ�ServerList��һ���ӿڣ�����������������



```
public interface ServerList<T extends Server> {
    public List<T> getInitialListOfServers();
    /**
     * Return updated list of servers. This is called say every 30 secs
     * (configurable) by the Loadbalancer's Ping cycle
     * 
     */
    public List<T> getUpdatedListOfServers();   
}
```









getInitialListOfServers�ǻ�ȡ��ʼ���ķ����б�
getUpdatedListOfServers�ǻ�ȡ���µķ����б�
ServerList�ж��ʵ���࣬�����õ��ĸ��أ�������
EurekaRibbonClientConfiguration�����ҵ�������Ribbon��Eureka��ϵ��Զ������࣬����Ŀǰ����û������Eureka����ͨ�������ļ����ã����Ի���ConfigurationBasedServerList�ࡣ

# �ο�����
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud
https://github.com/macrozheng/springcloud-learning