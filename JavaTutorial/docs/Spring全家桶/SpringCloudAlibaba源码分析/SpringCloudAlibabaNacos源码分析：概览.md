�ڿ���ƪ����֮ǰ����ö�NACOS��ع��������˽⣬�Ƽ�����[Spring Cloud Alibaba Nacos������ƪ��](https://zhuanlan.zhihu.com/p/68700978)��

��Թ��ܣ���Ŀ�ĵ�ȥ�����Ӧ��Դ���룬��һ���˽⹦������α�ʵ�ֳ����ġ�

���������һ��Դ�����Ķ��������Ⱥ����������̫���ϸ�ڣ�����Ҫ���ߴ�Դ����٣�������ᡣ

## һ������

����GitHub��Ӧ��[ҳ��](https://link.zhihu.com/?target=https%3A//github.com/alibaba/nacos)����NACOS����clone������Ŀ¼���ļ����������߳������Ƕ��ڿ�Դ���������а����Ĳ��ֲ����ࡣ

<figure data-size="normal">


![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/v2-e9966f158af7cfac39baf5bba456fd17_720w.webp)

<figcaption>nacos����Ŀ¼�ṹ</figcaption>

</figure>

<figure data-size="normal">


![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/v2-9195cfddde4e94b16f239bc101825a5a_720w.webp)

<figcaption>ģ������ͼ</figcaption>

</figure>

<figure data-size="normal">


![](https://pic4.zhimg.com/80/v2-6b30d0fc994745002ee7dcc7b04154d3_720w.webp)

<figcaption>nacos����ģ��</figcaption>

</figure>

����������ͼ������˳���ҵ�ͻ�ƿ��ˣ��������ݾͼ�����nacos-console��nacos-naming��nacos-config��˳�����ϣ����ܿ������������ˡ�

������Ǹо��޴����ֵĻ����Ǿ��Ʋ�nacos-example����������Ҫҵ��ĵ�����ڣ�һ����֪��

## �������÷���

���ȴ�һ��������˵��com.alibaba.nacos.api.NacosFactory��

����ľ�̬�������ڴ���ConfigService��NamingService���������ƣ��Դ���ConfigServiceΪ����



```
public static ConfigService createConfigService(Properties properties) throws NacosException {
        try {
            Class<?> driverImplClass = Class.forName("com.alibaba.nacos.client.config.NacosConfigService");
            Constructor constructor = driverImplClass.getConstructor(Properties.class);
            ConfigService vendorImpl = (ConfigService) constructor.newInstance(properties);
            return vendorImpl;
        } catch (Throwable e) {
            throw new NacosException(-400, e.getMessage());
        }
}
```



û��ʲô���ӵ��߼���ʹ�õ��ǻ����ķ���ԭ���������������properties����Щ���Կ���ͨ��bootstrap.yml��ָ������Ӧ����NacosConfigProperties��

��Ҫϸ�����ǹ��캯���ж���namespace��ʼ�����ǲ������ݡ�



```
private void initNamespace(Properties properties) {
        String namespaceTmp = null;

        String isUseCloudNamespaceParsing =
            properties.getProperty(PropertyKeyConst.IS_USE_CLOUD_NAMESPACE_PARSING,
                System.getProperty(SystemPropertyKeyConst.IS_USE_CLOUD_NAMESPACE_PARSING,
                    String.valueOf(Constants.DEFAULT_USE_CLOUD_NAMESPACE_PARSING)));

        if (Boolean.valueOf(isUseCloudNamespaceParsing)) {
            namespaceTmp = TemplateUtils.stringBlankAndThenExecute(namespaceTmp, new Callable<String>() {
                @Override
                public String call() {
                    return TenantUtil.getUserTenantForAcm();
                }
            });

            namespaceTmp = TemplateUtils.stringBlankAndThenExecute(namespaceTmp, new Callable<String>() {
                @Override
                public String call() {
                    String namespace = System.getenv(PropertyKeyConst.SystemEnv.ALIBABA_ALIWARE_NAMESPACE);
                    return StringUtils.isNotBlank(namespace) ? namespace : EMPTY;
                }
            });
        }

        if (StringUtils.isBlank(namespaceTmp)) {
            namespaceTmp = properties.getProperty(PropertyKeyConst.NAMESPACE);
        }
        namespace = StringUtils.isNotBlank(namespaceTmp) ? namespaceTmp.trim() : EMPTY;
        properties.put(PropertyKeyConst.NAMESPACE, namespace);
}
```



�����properties��ָ���Ƿ�����ƻ����е�namespace����������ǵģ�����ȥ��ȡ�����ƻ�����ϵͳ������������ǣ���ô�Ͷ�ȡproperties��ָ����namespace��û��ָ���Ļ������ս����������ǿ��ַ������Ӵ����Ͽ���������ȡ�ƻ�����namespace�������첽������ʽ������Ŀǰ�汾����ʹ�õ�ͬ�����á�

��������ConfigService�����涨����һϵ�нӿڷ���������������Ҫ���ġ�

ÿ��ҵ��ʵ�����ն����ΪHttp���󣬾������õ�serverAddr�������ַ��������תʹ�ã���Ȼ����һ����ʱʱ�����������󣬶����󲻳ɹ��ˣ��Ǿͻ��׳��쳣��

������nacos-client�����շ����ն����䵽nacos-config�����ϣ����ʹ��JdbcTemplate�������ݳ־û���

��һ���ֵĴ���һ�������ף��������ã���ȡ���ú�ɾ�����ö��������֣��Ͳ�չ�������ˡ�

�ص����һ�����ü������ֵ�Դ���롣

�Ƚ�ע��������com.alibaba.nacos.client.config.impl.CacheData������ݽṹ�ϣ��Ǹ����͵ĳ�Ѫģ�ͣ���Ҫ�ǳ䵱listener�����ߵĽ�ɫ����������������ȡ�ò�������ô�Ѻ��ˡ�

ʵ���ϣ����Կ���CacheData��������Ϣ��namespace, content����listener�ۺ���һ���ˣ�������Ϊһ�����ÿ��Ը��Ӷ���listenerʵʩ��������Ϊlistener�ӿڿ����ж���ʵ�֣���ÿ��listenerֻ����һ��ʵ�������������ϡ�



```
public void addListener(Listener listener) {
        if (null == listener) {
            throw new IllegalArgumentException("listener is null");
        }
        ManagerListenerWrap wrap = new ManagerListenerWrap(listener);
        if (listeners.addIfAbsent(wrap)) {
            LOGGER.info("[{}] [add-listener] ok, tenant={}, dataId={}, group={}, cnt={}", name, tenant, dataId, group,
                listeners.size());
        }
}
```



ʹ����CopyOnWriteArrayList.addIfAbsent�����������������Ҫ����equals������ManagerListenerWrap�Ƕ�listener������һ����ʽ�İ�������ʵ����equals������



```
@Override
public boolean equals(Object obj) {
        if (null == obj || obj.getClass() != getClass()) {
            return false;
        }
        if (obj == this) {
            return true;
        }
        ManagerListenerWrap other = (ManagerListenerWrap) obj;
        return listener.equals(other.listener);
}
```



�����ϲ㷭�������ҵ�����listener���߲�Ĺ���API��com.alibaba.nacos.client.config.impl.ClientWorker��

ͬ���Ƕ�listener�Ĺ��������������ظ�У�飬����cacheMap�ǹؼ������¶��壺



```
private final AtomicReference<Map<String, CacheData>> cacheMap = new AtomicReference<Map<String, CacheData>>()
```



ʹ���˾���ԭ���Բ������Ե�AtomicReference�����Ա��Ⲣ�����������ݲ�һ�µ����⣬�����������һ��HashMap��value��CacheData���󣬶�key����һ�����ɹ���ģ���GroupKey������п����ҵ���



```
static public String getKeyTenant(String dataId, String group, String tenant) {
        StringBuilder sb = new StringBuilder();
        urlEncode(dataId, sb);
        sb.append('+');
        urlEncode(group, sb);
        if (StringUtils.isNotEmpty(tenant)) {
            sb.append('+');
            urlEncode(tenant, sb);
        }
        return sb.toString();
}
```



ʵ�����ǽ�������Ϣ�á�+���Ž���ƴ�ӣ����������Ϣ�б�������ˡ�+���͡�%������ʹ��urlEncode�������б���ת�塣��Ȼ��Ҳ�����׵Ľ�������������Ͳ���չ�������ˡ�

���������޷Ǿ��Ǿ�cacheMap��һϵ��get��set����������ά��listener���ر�ע����ǣ�ÿ�θ��²�������������һ��copy���󣬲����˶���֮��������set�����ǣ���cacheMap�С�

���˵һ��listener��������������ġ�

��Ȼ����ClientWorker���п����ҵ�����ע����ת�Ƶ����캯���С����У�����ע�⵽����ʼ���������̳߳أ�



```
    executor = Executors.newScheduledThreadPool(1, new ThreadFactory() {
            @Override
            public Thread newThread(Runnable r) {
                Thread t = new Thread(r);
                t.setName("com.alibaba.nacos.client.Worker." + agent.getName());
                t.setDaemon(true);
                return t;
            }
        });

        executorService = Executors.newScheduledThreadPool(Runtime.getRuntime().availableProcessors(), new ThreadFactory() {
            @Override
            public Thread newThread(Runnable r) {
                Thread t = new Thread(r);
                t.setName("com.alibaba.nacos.client.Worker.longPolling." + agent.getName());
                t.setDaemon(true);
                return t;
            }
        });

        executor.scheduleWithFixedDelay(new Runnable() {
            @Override
            public void run() {
                try {
                    checkConfigInfo();
                } catch (Throwable e) {
                    LOGGER.error("[" + agent.getName() + "] [sub-check] rotate check error", e);
                }
            }
       }, 1L, 10L, TimeUnit.MILLISECONDS);
```



��������ִ�ж�ʱ�����scheduledThreadPool�����������̳߳صķֹ�Ҳ��Ƕ�׵ģ�executor���ڷ������ü������񣬶�executorService��������Ľ����ߣ�������ִ������Ľ�ɫ��

���Է���������̳߳�ֻ������1�������߳�������ִ��������̳߳صĺ����߳���CPU������

��Ϊ���ü����һ������ѯ�Ĺ��̣�һ������ִ�����ܼ�������������Ҫ�õ����ƣ�����NACOSĿǰʹ����һ���Ƚϼ򵥵ķ��������



```
public void checkConfigInfo() {
        // ������
        int listenerSize = cacheMap.get().size();
        // ����ȡ��Ϊ����
        int longingTaskCount = (int) Math.ceil(listenerSize / ParamUtil.getPerTaskConfigSize());
        if (longingTaskCount > currentLongingTaskCount) {
            for (int i = (int) currentLongingTaskCount; i < longingTaskCount; i++) {
                // Ҫ�ж������Ƿ���ִ�� �����Ҫ�ú����롣 �����б�����������ġ��仯���̿���������
                executorService.execute(new LongPollingRunnable(i));
            }
            currentLongingTaskCount = longingTaskCount;
        }
}
```



��ParamUtil.getPerTaskConfigSize()�з��ص���ÿ�������ܼ��������������ޣ�Ĭ����3000��������ͨ��ϵͳ����PER_TASK_CONFIG_SIZE����������ޡ�

�Ӵ����Ͽ��Կ����������ǰlistener������û�г���3000�������ü����̳߳ػ���ת�����������ϸ��������ֵĴ��룬���ǻᷢ��һЩ����ģ���Ҫ��Χ���������������������һϵ�����⡣

����ѯ������Ҫ���������߼���

*   ��鱾�����ã���CacheData�洢����Ϣ����һ�£�
*   ���server�����ã�����CacheData�洢����Ϣ��

## ��������ע���뷢��

���������Ļ������ⲿ�ִ��뿴������Ƚ������ˣ��ṹ�ϻ������ơ�

ֱ�ӽ���com.alibaba.nacos.api.naming.NamingService�������ж��registerInstance�ع����������ڷ���ע�ᡣ

�ȿ���Instanceʵ������������ݣ�id��ip��port��serviceName��clusterName�����ڼ�Ⱥ����weight��Ȩ�أ���healthy���Ƿ���������enabled���Ƿ����ã���ephemeral���Ƿ�����ʱ�ģ�����9������ȫ����������Console���������֡�

Ȼ��ֱ�ӿ�ע�����ķ�����



```
   @Override
    public void registerInstance(String serviceName, String groupName, Instance instance) throws NacosException {

        if (instance.isEphemeral()) {
            BeatInfo beatInfo = new BeatInfo();
            beatInfo.setServiceName(NamingUtils.getGroupedName(serviceName, groupName));
            beatInfo.setIp(instance.getIp());
            beatInfo.setPort(instance.getPort());
            beatInfo.setCluster(instance.getClusterName());
            beatInfo.setWeight(instance.getWeight());
            beatInfo.setMetadata(instance.getMetadata());
            beatInfo.setScheduled(false);
            beatReactor.addBeatInfo(NamingUtils.getGroupedName(serviceName, groupName), beatInfo);
        }
        serverProxy.registerService(NamingUtils.getGroupedName(serviceName, groupName), groupName, instance);
    }
```



ǰ��һ��δ����Ƕ���ʱ����ʵ���Ĵ��������ڹ���һ�����������͸�NACOS����

registerService�������Ƿ�װ��HTTP����������InstanceController�д�������

�����Ŀ������spring-cloud-starter-alibaba-nacos-discovery������������Ĭ�����Զ�ע��ġ�����뿴�Զ�ע��Ĺ��̣����Դ�AbstractAutoServiceRegistration��ʼ���֣�������һ�δ��룺



```
	@EventListener(WebServerInitializedEvent.class)
	public void bind(WebServerInitializedEvent event) {
		ApplicationContext context = event.getApplicationContext();
		if (context instanceof ConfigurableWebServerApplicationContext) {
			if ("management".equals(
					((ConfigurableWebServerApplicationContext) context).getServerNamespace())) {
				return;
			}
		}
		this.port.compareAndSet(0, event.getWebServer().getPort());
		this.start();
	}
```



������Web�����ʼ����ɵ��¼������ջ�ִ��start������



```
	public void start() {
		if (!isEnabled()) {
			if (logger.isDebugEnabled()) {
				logger.debug("Discovery Lifecycle disabled. Not starting");
			}
			return;
		}
		// only initialize if nonSecurePort is greater than 0 and it isn't already running
		// because of containerPortInitializer below
		if (!this.running.get()) {
			register();
			if (shouldRegisterManagement()) {
				registerManagement();
			}
			this.context.publishEvent(new InstanceRegisteredEvent<>(this, getConfiguration()));
			this.running.compareAndSet(false, true);
		}

	}
```



���У�register������������ĵĲ����ˣ���Դ��NacosServiceRegistry��ʵ�֣�



```
	@Override
	public void register(NacosRegistration registration) {

		if (!registration.isRegisterEnabled()) {
			logger.info("Nacos Registration is disabled...");
			return;
		}
		if (StringUtils.isEmpty(registration.getServiceId())) {
			logger.info("No service to register for nacos client...");
			return;
		}
		NamingService namingService = registration.getNacosNamingService();
		String serviceId = registration.getServiceId();

		Instance instance = new Instance();
		instance.setIp(registration.getHost());
		instance.setPort(registration.getPort());
		instance.setWeight(registration.getRegisterWeight());
		instance.setClusterName(registration.getCluster());
		instance.setMetadata(registration.getMetadata());
		try {
			namingService.registerInstance(serviceId, instance);
			logger.info("nacos registry, {} {}:{} register finished", serviceId, instance.getIp(), instance.getPort());
		}catch (Exception e) {
			logger.error("nacos registry, {} register failed...{},", serviceId, registration.toString(), e);
		}
	}
```



��δ���ͷǳ���Ϥ�ˣ����վͻص���������namingService.registerInstance������



```
    /**
     * Map<namespace, Map<group::serviceName, Service>>
     */
    private Map<String, Map<String, Service>> serviceMap = new ConcurrentHashMap<>();
```



���ϳ���������һ��ʵ���ࣺcom.alibaba.nacos.naming.core.Service��Service�ǰ�����Instance��һ��Service���ж��Instance���������һ��Cluster��

<figure data-size="normal">


![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/v2-21ca2c51d56d6401dee0db0444df8ddf_720w.webp)

<figcaption>��ʵ����Ⱥ</figcaption>

</figure>

�ڵ���registerInstanceע��ʵ����ʱ��������ֶ�Ӧ��Serviceû�б�ע�ᣬ��ô��registerService�����һ��ʼ����Ӧ��Cluster�������������Ķ�ʱ����

��registerInstance�෴����deregisterInstance����Ϊȡ��ע�ᣬҲ������Ϊ�Ƿ���ʵ�����ߡ�

���������NACOS���ʵ�ַ����ֹ��ܡ�

�������ߣ����÷����ĽǶ����������ɵ�starter��Ŀ���и��ࣺNacosServerList������Ҫ���Ǽ̳���AbstractServerList��ʵ���������ؼ��Ľӿڷ������൱����NACOS��Ribbon�ĶԽӵ㡣



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



NACOS������������ӿڵ�ʵ�֣���ʹ����getServers�����������뵽getServers���������棬��ʵ����������������˵��NacosNamingService.selectInstances������ͨ��serviceId��ȡ��ServiceInfo����Ȼ���ȡ��Service�����������Ч��Instance��

���ṩ�ߣ������÷����ĽǶȿ���NACOS��ͨ����ʱ����ʵʱ����ServiceInfo����Ҫҵ���߼�����HostReactor��ʵ�ֵġ���ǰ����serviceMap��һ����HostReactor��ά������serviceInfoMap��



```
private Map<String, ServiceInfo> serviceInfoMap;
```



HostReactor������FailoverReactor��ServiceInfo���˴��̻��棬��Ȼ�������˶�ʱ������ָ����Ŀ¼�����л�ServiceInfo���Դ�ʵ����Failover���ơ�������failover-modeҲ���п��صģ���ʵ����һ���ض��ļ���һ�������ݣ���Щ���õļ��Ҳ��ͨ����ʱ������ʵ�ֵġ�



```
File switchFile = new File(failoverDir + UtilAndComs.FAILOVER_SWITCH);
```



������������ͼ��ʾ��

<figure data-size="normal">


![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/v2-d16112ec6ff6dda0b029b019c313177c_720w.webp)

<figcaption>�����ָ���ͼ</figcaption>

</figure>

## �ġ��������̨(Console)

��һ�����ǹ������̨��ʵ�֣���ʵ��һ���ǳ����͵�WEB��Ŀ��

ʹ����Spring Security + JWT���а�ȫ���ƣ�ǰ�˼�����ReactJs������JdbcTemplate�������ݿ�־û���

��Ҫע����ǣ�����̨�ṩ�Ĺ��ܲ������Ǵ�nacos-console��������л�ȡ�����ݣ����Ƿ�ɢ���˸��������С�

nacos-console�ṩ�˿���̨��¼��namespace��������̨����״̬�������������������ù���ͷ������ֱ��������nacos-config��nacos-naming���ṩ��API������ЩAPI���ǹ������ᵽ��Open-API��

## �塢�ܽ�

NACOS���Դ��ͨ���׶���û��ʲô��������Ҳû�н��в���װ�Ͱ�������һ����̾���ĳ���Ա���ڰ�Сʱ֮�ڰ���������Ŀ�����硣

��Ȼ��Ҳ�����һЩ���ɺ��ӵ�ȱ�㣬���磬ע�͹��٣����뻹�кܴ���ع��ռ䣬tenant��namespace�����������ʹ�á�

����Spring Cloud Alibaba Nacos�Ľ��ܵ��˾ͽ����ˣ�ϣ����������������
# �ο�����
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud
https://github.com/macrozheng/springcloud-learning