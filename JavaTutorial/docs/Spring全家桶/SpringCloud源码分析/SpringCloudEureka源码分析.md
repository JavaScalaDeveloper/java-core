EurekaԴ�����

**��1�� ��������**
**1.1 Eureka����ʲô��**

�������Ƕ����ף�Eureka������������ע��ģ���ע������Ҫʵ��ʲô�����أ����������ȷ�ˡ�

1.  ��Ȼ��ע�����ģ�������Ҫ�ܱ�������ip��port����Ϣ�ɣ�����Eureka-server�����ṩ�Ļ������ܡ�
2.  ����ע������֮�󣬻�Ҫ�ṩһЩ��̬��֪���������ߵĹ��ܰɣ����һ�����������ߣ�Eureka-server����֪����������������һ�Ĳ�ֵ�ˡ�
3.  ��Eureka-server�˸�֪������ı仯֮���ܵ�֪ͨ���Ѷ˰ɣ������ǣ����ʱserver������֪ͨclient���ػ���client���Լ�ȥ��ȡ��Ϣ�أ�������ڲ�֪�����Ȼ�ȥ��Դ����֤��
4.  OK������Ĺ��ܶ�ʵ���ˣ�Eureka�����ϸ��ˣ��ǻ���һ������Ȼ�����ip�Ͷ˿ڶ���Eureka-server���棬�������Ѷ˵��÷���˵�ʱ��ͨ�����õ�OpenFeign����OpenFeign����ô֪�������ĸ�����ģ�֮ǰ����д����application.properties�����<servicename>.ribbon.listOfServers�У�����Eureka��ô�Զ�д��ȥ���أ�
5.  ����4�����ܻ����������ע�����ĸ��еĹ��ܣ������ʱ����������˼��һ�£�ע����������΢������Ŀ�У���ע������Ҳ��Ϊһ��������Ҳ��Ҫ����Ⱥ�ģ����ʱ�����Ǿ�Ҫ��һ�£�����Ⱥ��ô��֤����һ���ԣ��û���ʲô���ۣ�
    ������EurekaҪʵ�ֵ�����ĵĹ��ܣ�����Щ�����ṩ�����ˣ�����Ŀ��ôȥ�����أ�����ֱ��ȥ��API�ɣ�����鷳������ȥѧһ��Eureka��api���궿���ˡ�

���ʱ�����Ǿͻ����뵽SpringBoot���Զ�װ���Starter��������������������������˺���bean���Զ�ע�룬�ײ����ֱ���õ�bean��Ȼ����Starter�����Ӧ���Զ������ǵ�����API�ģ�OK���ǻع�ͷ���ҷ��֣��ҵ�Eureka-client����һ��starter������ٺ٣��е㶫���ˡ����client�˺����߼��϶��ǰ����Ƿ�װ�˸���bean��Ȼ������ǵ����˺���api�ˡ�

�������Eureka�ĺ��Ĺ�����������һ���������ܽ᣺

1.  ʵ��ע�ᣬ�������ڴ���
2.  ��̬��֪����Ľ���״̬
3.  ����ķ��֣�����̬��֪����ı仯
    **1.2 ���������Ƶ�**
    ��ȷ�˺��Ĺ��ܣ��Լ���ε��õģ��������������󵨵��Ƶ�һ�º�������ͼ��

![SpringCloudϵ�С�Spring Cloud Դ�����֮Eureka-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/f15564313c2406546821713bcaf3eb0e9ac73d.jpg "SpringCloudϵ�С�Spring Cloud Դ�����֮Eureka-��Դ�����������")���������Ƶ�����֮����������ͨ��Դ����һ����֤��

**��2�� Դ�����**
**2.1 ����ע������**
����ע������spring bootӦ��������ʱ����ġ������ִ��·���������Ҳ������Ȼع�һ��ǰ�����ǽ�����֪ʶ��

����˵spring cloud��һ����̬�����ṩ��һ�ױ�׼�����ױ�׼����ͨ����ͬ�������ʵ�֣����оͰ�������ע��/���֡��۶ϡ����ؾ���ȣ���spring-cloud-common������У�
org.springframework.cloud.client.serviceregistry ·���£����Կ���һ������ע��Ľӿڶ� �� ServiceRegistry �������Ƕ�����spring cloud�з���ע���һ���ӿڡ�

���ǿ�һ���������ϵͼ������ӿ���һ��Ψһ��ʵ�� EurekaServiceRegistry ����ʾ���õ���Eureka Server��Ϊ����ע�����ġ�

![SpringCloudϵ�С�Spring Cloud Դ�����֮Eureka-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/49d085328febfffcbae4030dac151db2d0bfcb.jpg "SpringCloudϵ�С�Spring Cloud Դ�����֮Eureka-��Դ�����������")**2.1.1 ע���ʱ��**
����ע��ķ������ǿ��Բ²�һ��Ӧ����ʲôʱ����ɣ������Ҫ������ʵӦ�ò��Ѳ²⵽�������ע��ȡ���ڷ����Ƿ��Ѿ��������ˡ�����spring boot�У���ȵ�spring ���������������е����ö����֮��������ע�ᡣ�����������spring boot�����������е�refreshContext����ɡ�

���ǹ۲�һ��finishRefresh����������������Ͽ��Կ������������������ˢ�µĲ�����Ҳ����ˢ�����֮��Ҫ���ĺ��õĲ���������Ҫ����������

* ��ջ���

* ��ʼ��һ��LifecycleProcessor����Spring������ʱ������bean����spring������ʱ������bean

* ����LifecycleProcessor��onRefresh����������ʵ����Lifecycle�ӿڵ�bean

* ����ContextRefreshedEvent

* ע��Bean��ͨ��JMX���м�غ͹���



  ```
  protected void finishRefresh() {
      // Clear context-level resource caches (such as ASM metadata from scanning).
      clearResourceCaches();
      // Initialize lifecycle processor for this context.
      initLifecycleProcessor();
      // Propagate refresh to lifecycle processor first.
      getLifecycleProcessor().onRefresh();
      // Publish the final event.
      publishEvent(new ContextRefreshedEvent(this));
      // Participate in LiveBeansView MBean, if active.
      LiveBeansView.registerApplicationContext(this);
  }
  ```









����������У������ص��ע getLifecycleProcessor().onRefresh() �����ǵ����������ڴ�������onrefresh�������ҵ�SmartLifecycle�ӿڵ�����ʵ���ಢ����start������

**2.1.2 SmartLifeCycle**
����չһ��SmartLifeCycle����֪ʶ�� SmartLifeCycle��һ���ӿڣ���Spring�������������е�Bean���ҳ�ʼ��֮�󣬻�����ص�ʵ����SmartLifeCycle�ӿڵ����ж�Ӧ�ķ��������磨start����

ʵ���������Լ�Ҳ������չ��������springboot���̵�main����ͬ��Ŀ¼�£�дһ�������࣬ʵ��SmartLifeCycle�ӿڣ�����ͨ�� @Service ����Ϊһ��bean����ΪҪ��springȥ���أ����ȵ���bean��



```
@Service
public class TestSmartLifeCycle implements SmartLifecycle {
    /**
     * ����������ִ��.������ʾ����start����.
     * ��������isAutoStartup()����ֵ,ֻ��isAutoStartup()����true��ʱ��,start()�Żᱻִ��
     */
    @Override
    public void start() {
        System.out.println("----------start-----------");
    }
    /**
     * ����ֹͣǰִ�з���
     * ǰ������: isRunning()����true�Żᱻִ��
     */
    @Override
    public void stop() {
        System.out.println("----------stop-----------");
    }
    /**
     * ���ط�������״̬,Ӱ�쵽�����Ƿ����stop����
     * @return
     */
    @Override
    public boolean isRunning() {
        return false;
    }
    /**
     * �Ƿ����start����,��Ҫע��
     * ��ǰ��������false�ǲ���ִ��start()
     * @return
     */
    @Override
    public boolean isAutoStartup() {
        return true;
    }
    @Override
    public void stop(Runnable runnable) {
        stop();
        runnable.run();
    }
    /**
     * ָ��ִ��˳��
     * ��ǰ��������ж����ʵ����SmartLifecycle,�򰴴˷���������ֵ����ִ��
     * @return
     */
    @Override
    public int getPhase() {
        return 0;
    }
}
```









���ţ���������spring bootӦ�ú󣬿��Կ�������̨����� start �ַ�����

������DefaultLifecycleProcessor.startBeans�����ϼ�һ��debug�����Ժ����ԵĿ��������Լ������TestSmartLifeCycle��ɨ�赽�ˣ�����������ø�bean��start������![SpringCloudϵ�С�Spring Cloud Դ�����֮Eureka-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/75b18e528ba1879148c106d9bd3fb61ab9b5bb.jpg "SpringCloudϵ�С�Spring Cloud Դ�����֮Eureka-��Դ�����������")��startBeans�����У����ǿ��Կ��������Ȼ�������ʵ����SmartLifeCycle��Bean��Ȼ���ѭ������ʵ����SmartLifeCycle��bean��start�������������¡�



```
private void startBeans(boolean autoStartupOnly) {
    Map<String, Lifecycle> lifecycleBeans = this.getLifecycleBeans();
    Map<Integer, DefaultLifecycleProcessor.LifecycleGroup> phases = new HashMap();
    lifecycleBeans.forEach((beanName, bean) -> {
        if (!autoStartupOnly || bean instanceof SmartLifecycle &&
            ((SmartLifecycle)bean).isAutoStartup()) {
            int phase = this.getPhase(bean);
            DefaultLifecycleProcessor.LifecycleGroup group =
                (DefaultLifecycleProcessor.LifecycleGroup)phases.get(phase);
            if (group == null) {
                group = new DefaultLifecycleProcessor.LifecycleGroup(phase,this.timeoutPerShutdownPhase, lifecycleBeans, autoStartupOnly);
                phases.put(phase, group);
            }
            group.add(beanName, bean);
        }
    });
    if (!phases.isEmpty()) {
        List<Integer> keys = new ArrayList(phases.keySet());
        Collections.sort(keys);
        Iterator var5 = keys.iterator();
        while(var5.hasNext()) {
            Integer key = (Integer)var5.next();
            ((DefaultLifecycleProcessor.LifecycleGroup)phases.get(key)).start();
        }
    }
}
```









**2.1.3 doStart**



```
private void doStart(Map<String, ? extends Lifecycle> lifecycleBeans, String beanName, boolean autoStartupOnly) {
    Lifecycle bean = (Lifecycle)lifecycleBeans.remove(beanName);
    if (bean != null && bean != this) {
        String[] dependenciesForBean = this.getBeanFactory().getDependenciesForBean(beanName);
        String[] var6 = dependenciesForBean;
        int var7 = dependenciesForBean.length;
        for(int var8 = 0; var8 < var7; ++var8) {
            String dependency = var6[var8];
            this.doStart(lifecycleBeans, dependency, autoStartupOnly);
        }
        if (!bean.isRunning() && (!autoStartupOnly || !(bean instanceof SmartLifecycle) || ((SmartLifecycle)bean).isAutoStartup())) {
            if (this.logger.isTraceEnabled()) {
                this.logger.trace("Starting bean '" + beanName + "' of type [" + bean.getClass().getName() + "]");
            }
            try {
                bean.start(); //��ʱ Bean��ʵ��Ӧ����EurekaAutoServiceRegistration
            } catch (Throwable var10) {
                throw new ApplicationContextException("Failed to start bean '" + beanName + "'", var10);
            }
            if (this.logger.isDebugEnabled()) {
                this.logger.debug("Successfully started bean '" + beanName + "'");
            }
        }
    }
}
```









��ʱ��bean.start()�����õĿ�����
EurekaAutoServiceRegistration�е�start��������Ϊ����Ȼ����ʵ����SmartLifeCycle�ӿڡ�



```
public class EurekaAutoServiceRegistration implements AutoServiceRegistration,SmartLifecycle, Ordered, SmartApplicationListener {
    @Override
    public void start() {
        // only set the port if the nonSecurePort or securePort is 0 and this.port != 0
        if (this.port.get() != 0) {
            if (this.registration.getNonSecurePort() == 0) {
                this.registration.setNonSecurePort(this.port.get());
            }
            if (this.registration.getSecurePort() == 0 &&
                this.registration.isSecure()) {
                this.registration.setSecurePort(this.port.get());
            }
        }
        // only initialize if nonSecurePort is greater than 0 and it isn't already running
        // because of containerPortInitializer below
        if (!this.running.get() && this.registration.getNonSecurePort() > 0) {
            this.serviceRegistry.register(this.registration);
            this.context.publishEvent(new InstanceRegisteredEvent<>(this,
                                                                    this.registration.getInstanceConfig()));
            this.running.set(true);
        }
    }
}
```









��start�����У����ǿ��Կ���
this.serviceRegistry.register �����������ʵ���Ͼ��Ƿ������ע��Ļ��ơ�

��ʱthis.serviceRegistry��ʵ����Ӧ���� EurekaServiceRegistry �� ԭ����
EurekaAutoServiceRegistration�Ĺ��췽���У�����һ����ֵ��������������췽������EurekaClientAutoConfiguration ����Զ�װ�����б�װ��ͳ�ʼ���ģ��������¡�



```
@Bean
@ConditionalOnBean(AutoServiceRegistrationProperties.class)
@ConditionalOnProperty(value = "spring.cloud.service-registry.auto-registration.enabled", matchIfMissing = true)
public EurekaAutoServiceRegistration eurekaAutoServiceRegistration(
    ApplicationContext context, EurekaServiceRegistry registry,
    EurekaRegistration registration) {
    return new EurekaAutoServiceRegistration(context, registry, registration);
}
```









**2.2 �����ע������**
���������Ƿ�������ע�������



```
public class EurekaAutoServiceRegistration implements AutoServiceRegistration,
SmartLifecycle, Ordered, SmartApplicationListener {
    @Override
    public void start() {
        //ʡ��...
        this.serviceRegistry.register(this.registration);
        this.context.publishEvent(new InstanceRegisteredEvent<> this,this.registration.getInstanceConfig()));
    }
}
```









this.serviceRegistry.register(this.registration); �������ջ����

EurekaServiceRegistry ���е� register ������ʵ�ַ���ע��

**2.2.1 register**



```
@Override
public void register(EurekaRegistration reg) {
    maybeInitializeClient(reg);
    if (log.isInfoEnabled()) {
        log.info("Registering application "
                 + reg.getApplicationInfoManager().getInfo().getAppName()
                 + " with eureka with status "
                 + reg.getInstanceConfig().getInitialStatus());
    }
    //���õ�ǰʵ����״̬��һ�����ʵ����״̬�����仯��ֻҪ״̬����DOWN����ô�ͻᱻ��������������ִ�з���ע�ᡣ
    reg.getApplicationInfoManager().setInstanceStatus(reg.getInstanceConfig().getInitialStatus());
    //���ý������Ĵ���
    reg.getHealthCheckHandler().ifAvailable(healthCheckHandler -> reg.getEurekaClient().registerHealthCheck(healthCheckHandler));
}
```









����������������ע�᷽���в�û����������Eureka�ķ���ȥִ��ע�ᣬ���ǽ���������һ��״̬�Լ����ý�����鴦���������Ǽ�����һ��
reg.getApplicationInfoManager().setInstanceStatus������



```
public synchronized void setInstanceStatus(InstanceStatus status) {
    InstanceStatus next = instanceStatusMapper.map(status);
    if (next == null) {
        return;
    }
    InstanceStatus prev = instanceInfo.setStatus(next);
    if (prev != null) {
        for (StatusChangeListener listener : listeners.values()) {
            try {
                listener.notify(new StatusChangeEvent(prev, next));
            } catch (Exception e) {
                logger.warn("failed to notify listener: {}", listener.getId(),e);
            }
        }
    }
}
```









����������У�����ͨ��������������һ��״̬����¼���ok����ʱlistener��ʵ����StatusChangeListener ��Ҳ���ǵ��� StatusChangeListener ��notify����������¼��Ǵ���һ������״̬�����Ӧ�����еط����������¼���Ȼ���������¼�����ע�ᡣ

���ʱ��������Ϊ�ҵ��˷���Ȼ������ȥһ������������һ���ӿڡ��������Ƿ������Ǿ�̬���ڲ��ӿڣ����޷�ֱ�ӿ�������ʵ���ࡣ

���Ҷ���Դ���Ķ����飬�����������ң���Ϊ�һ������ܲ²⵽һ������ĳ���ط����˳�ʼ���Ĺ��������ǣ������ҵ�
EurekaServiceRegistry.register�����е� reg.getApplicationInfoManager ���ʵ����ʲô���������Ƿ���ApplicationInfoManager��������EurekaRegistration������е����ԡ���EurekaRegistration������EurekaAutoServiceRegistration�������ʵ�����ġ��������룬�ǲ������Զ�װ��������ʲô�����������ҵ�EurekaClientAutoConfiguration����࣬��Ȼ������Bean��һЩ�Զ�װ�䣬���а��� EurekaClient �� ApplicationInfoMangager �� EurekaRegistration �ȡ�

**2.2.2 EurekaClientConfiguration**



```
@Configuration(proxyBeanMethods = false)
@ConditionalOnMissingRefreshScope
protected static class EurekaClientConfiguration {
    @Autowired
    private ApplicationContext context;
    @Autowired
    private AbstractDiscoveryClientOptionalArgs<?> optionalArgs;
    @Bean(destroyMethod = "shutdown")
    @ConditionalOnMissingBean(value = EurekaClient.class,search = SearchStrategy.CURRENT)
    public EurekaClient eurekaClient(ApplicationInfoManager manager,EurekaClientConfig config) {
        return new CloudEurekaClient(manager, config, this.optionalArgs,this.context);
    }
    @Bean
    @ConditionalOnMissingBean(value = ApplicationInfoManager.class,search = SearchStrategy.CURRENT)
    public ApplicationInfoManager eurekaApplicationInfoManager(
        EurekaInstanceConfig config) {
        InstanceInfo instanceInfo = new InstanceInfoFactory().create(config);
        return new ApplicationInfoManager(config, instanceInfo);
    }
    @Bean
    @ConditionalOnBean(AutoServiceRegistrationProperties.class)
    @ConditionalOnProperty(
        value = "spring.cloud.service-registry.auto-registration.enabled",
        matchIfMissing = true)
    public EurekaRegistration eurekaRegistration(EurekaClient eurekaClient,CloudEurekaInstanceConfig
                                                 instanceConfig,ApplicationInfoManager applicationInfoManager, @Autowired(required = false)
                                                 ObjectProvider<HealthCheckHandler> healthCheckHandler) {
        return EurekaRegistration.builder(instanceConfig).with(applicationInfoManager).with(eurekaClient).with(healthCheckHandler).build();
    }
}
```









���ѷ��֣������ƺ�������һ������Ҫ��Bean��������ʱ�������Զ�װ�䣬Ҳ����CloudEurekaClient �����������������ҿ��Ժ����׵�ʶ�𲢲²������Eureka�ͻ��˵�һ�������࣬����ʵ�ֺͷ���˵�ͨ���Լ���������Ǻܶ�Դ��һ�����·��Ҫô�ڹ��췽������ȥ���ܶ�ĳ�ʼ����һЩ��ִ̨�еĳ��������Ҫô����ͨ���첽�¼��ķ�ʽ���������ţ����ǿ�һ��CloudEurekaClient�ĳ�ʼ�����̣����Ĺ��췽���л�ͨ�� super ���ø���Ĺ��췽����Ҳ����DiscoveryClient�Ĺ��졣

**2.2.3 CloudEurekaClient**
super(applicationInfoManager, config, args);���ø���Ĺ��췽������CloudEurekaClient�ĸ�����DiscoveryClient.



```
public CloudEurekaClient(ApplicationInfoManager applicationInfoManager,EurekaClientConfig config,AbstractDiscoveryClientOptionalArgs<?> args,ApplicationEventPublisher publisher) {
    super(applicationInfoManager, config, args);
    this.applicationInfoManager = applicationInfoManager;
    this.publisher = publisher;
    this.eurekaTransportField = ReflectionUtils.findField(DiscoveryClient.class,"eurekaTransport");
    ReflectionUtils.makeAccessible(this.eurekaTransportField);
}
```









**2.2.4 DiscoveryClient����**
���ǿ��Կ��������յ�DiscoveryClient���췽���У��зǳ����Ĵ��롣��ʵ�ܶ������Բ���Ҫ���ģ��󲿷ֶ���һЩ��ʼ�������������ʼ���˼�����ʱ����

* scheduler

* heartbeatExecutor ������ʱ����

* cacheRefreshExecutor ��ʱȥͬ������˵�ʵ���б�



  ```
  DiscoveryClient(ApplicationInfoManager applicationInfoManager,EurekaClientConfig config, AbstractDiscoveryClientOptionalArgs args,Provider<BackupRegistry> backupRegistryProvider,EndpointRandomizer endpointRandomizer) {
      //ʡ�Բ��ִ���...
      //�Ƿ�Ҫ��eureka server�ϻ�ȡ�����ַ��Ϣ
      if (config.shouldFetchRegistry()) {
          this.registryStalenessMonitor = new ThresholdLevelsMetric(this,METRIC_REGISTRY_PREFIX + "lastUpdateSec_", new long[]{15L, 30L, 60L, 120L, 240L,480L});
      } else {
          this.registryStalenessMonitor = ThresholdLevelsMetric.NO_OP_METRIC;
      }
      //�Ƿ�Ҫע�ᵽeureka server��
      if (config.shouldRegisterWithEureka()) {
          this.heartbeatStalenessMonitor = new ThresholdLevelsMetric(this,METRIC_REGISTRATION_PREFIX + "lastHeartbeatSec_", new long[]{15L, 30L, 60L,120L, 240L, 480L});
      } else {
          this.heartbeatStalenessMonitor = ThresholdLevelsMetric.NO_OP_METRIC;
      }
      //�������Ҫע�Ტ�Ҳ���Ҫ���·����ַ
      if (!config.shouldRegisterWithEureka() && !config.shouldFetchRegistry()) {
  
          return;  // no need to setup up an network tasks and we are done
      }
      try {
          // default size of 2 - 1 each for heartbeat and cacheRefresh
          scheduler = Executors.newScheduledThreadPool(2,new ThreadFactoryBuilder()       .setNameFormat("DiscoveryClient-%d")
                                                       .setDaemon(true)
                                                       .build());
          heartbeatExecutor = new ThreadPoolExecutor(1, clientConfig.getHeartbeatExecutorThreadPoolSize(), 0,
                                                     TimeUnit.SECONDS,
                                                     new SynchronousQueue<Runnable>(),
                                                     new ThreadFactoryBuilder()
                                                     .setNameFormat("DiscoveryClient-HeartbeatExecutor-%d")
                                                     .setDaemon(true)
                                                     .build()
                                                    );  // use direct handoff
          cacheRefreshExecutor = new ThreadPoolExecutor(
              1, clientConfig.getCacheRefreshExecutorThreadPoolSize(), 0,
              TimeUnit.SECONDS,
              new SynchronousQueue<Runnable>(),
              new ThreadFactoryBuilder()
              .setNameFormat("DiscoveryClient-CacheRefreshExecutor-%d")
              .setDaemon(true)
              .build()
          );  // use direct handoff
          eurekaTransport = new EurekaTransport();
          scheduleServerEndpointTask(eurekaTransport, args);
          AzToRegionMapper azToRegionMapper;
          if (clientConfig.shouldUseDnsForFetchingServiceUrls()) {
              azToRegionMapper = new DNSBasedAzToRegionMapper(clientConfig);
          } else {
              azToRegionMapper = new PropertyBasedAzToRegionMapper(clientConfig);
          }
          if (null != remoteRegionsToFetch.get()) {
  
              azToRegionMapper.setRegionsToFetch(remoteRegionsToFetch.get().split(","));
          }
          instanceRegionChecker = new InstanceRegionChecker(azToRegionMapper,
                                                            clientConfig.getRegion());
      } catch (Throwable e) {
          throw new RuntimeException("Failed to initialize DiscoveryClient!", e);
      }
      //�����Ҫע�ᵽEureka server�����ǿ����˳�ʼ����ʱ��ǿ��ע�ᣬ�����register()�������ע��
      if (clientConfig.shouldRegisterWithEureka() &&
          clientConfig.shouldEnforceRegistrationAtInit()) {
          try {
              if (!register() ) {
                  throw new IllegalStateException("Registration error at startup.Invalid server response.");
              }
          } catch (Throwable th) {
              logger.error("Registration error at startup: {}", th.getMessage());
              throw new IllegalStateException(th);
          }
      }
      // finally, init the schedule tasks (e.g. cluster resolvers, heartbeat,instanceInfo replicator, fetch
      initScheduledTasks();
  }
  ```









**2.2.5 initScheduledTasks**
initScheduledTasks ȥ����һ����ʱ����

*   ��������˿�����ע������ˢ�·����б���Ὺ��cacheRefreshExecutor�����ʱ����
*   ��������˷���ע�ᵽEureka����ͨ����Ҫ����������.

1.  ��������������

ͨ���ڲ�����ʵ����StatusChangeListener ʵ��״̬��ؽӿڣ��������ǰ�������ڷ��������������������ģ�����notify�ķ�����ʵ���ϻ����������֡�



```
private void initScheduledTasks() {
    //��������˿�����ע������ˢ�·����б���Ὺ��cacheRefreshExecutor�����ʱ����
    if (clientConfig.shouldFetchRegistry()) {
        // registry cache refresh timer
        int registryFetchIntervalSeconds =
            clientConfig.getRegistryFetchIntervalSeconds();
        int expBackOffBound =
            clientConfig.getCacheRefreshExecutorExponentialBackOffBound();
        scheduler.schedule(
            new TimedSupervisorTask(
                "cacheRefresh",
                scheduler,
                cacheRefreshExecutor,
                registryFetchIntervalSeconds,
                TimeUnit.SECONDS,
                expBackOffBound,
                new CacheRefreshThread()
            ),
            registryFetchIntervalSeconds, TimeUnit.SECONDS);
    }
    //��������˷���ע�ᵽEureka����ͨ����Ҫ����������
    if (clientConfig.shouldRegisterWithEureka()) {
        int renewalIntervalInSecs =
            instanceInfo.getLeaseInfo().getRenewalIntervalInSecs();
        int expBackOffBound =
            clientConfig.getHeartbeatExecutorExponentialBackOffBound();
        logger.info("Starting heartbeat executor: " + "renew interval is: {}",
                    renewalIntervalInSecs);
        // Heartbeat timer
        scheduler.schedule(
            new TimedSupervisorTask(
                "heartbeat",
                scheduler,
                heartbeatExecutor,
                renewalIntervalInSecs,
                TimeUnit.SECONDS,
                expBackOffBound,
                new HeartbeatThread()
            ),
            renewalIntervalInSecs, TimeUnit.SECONDS);
        // InstanceInfo replicator ��ʼ��һ��:instanceInfoReplicator
        instanceInfoReplicator = new InstanceInfoReplicator(
            this,
            instanceInfo,
            clientConfig.getInstanceInfoReplicationIntervalSeconds(),
            2); // burstSize
        statusChangeListener = new ApplicationInfoManager.StatusChangeListener()
        {
            @Override
            public String getId() {
                return "statusChangeListener";
            }
            @Override
            public void notify(StatusChangeEvent statusChangeEvent) {
                if (InstanceStatus.DOWN == statusChangeEvent.getStatus() ||
                    InstanceStatus.DOWN ==
                    statusChangeEvent.getPreviousStatus()) {
                    // log at warn level if DOWN was involved
                    logger.warn("Saw local status change event {}",
                                statusChangeEvent);
                } else {
                    logger.info("Saw local status change event {}",
                                statusChangeEvent);
                }
                instanceInfoReplicator.onDemandUpdate();
            }
        };
        //ע��ʵ��״̬�仯�ļ���
        if (clientConfig.shouldOnDemandUpdateStatusChange()) {
            applicationInfoManager.registerStatusChangeListener(statusChangeListener);
        }
        //����һ��ʵ����Ϣ����������Ҫ����Ϊ�˿���һ����ʱ�̣߳�ÿ40���ж�ʵ����Ϣ�Ƿ�������������������ע��
        instanceInfoReplicator.start(clientConfig.getInitialInstanceInfoReplicationInte
                                     rvalSeconds());
    } else {
        logger.info("Not registering with Eureka server per configuration");
    }
}
```









**2.2.6 onDemandUpdate**
�����������Ҫ�����Ǹ���ʵ�������Ƿ����仯������������ע�����ĵ����ݡ�



```
public boolean onDemandUpdate() {
    //�����ж�
    if (rateLimiter.acquire(burstSize, allowedRatePerMinute)) {
        if (!scheduler.isShutdown()) {
            //�ύһ������
            scheduler.submit(new Runnable() {
                @Override
                public void run() {
                    logger.debug("Executing on-demand update of local InstanceInfo");
                    //ȡ��֮ǰ�Ѿ��ύ������Ҳ������start�������ύ�ĸ��������������û��ִ����ɣ���ȡ��֮ǰ������
                    Future latestPeriodic = scheduledPeriodicRef.get();
                    if (latestPeriodic != null && !latestPeriodic.isDone()) {
                        logger.debug("Canceling the latest scheduled update, it will be rescheduled at the end of on demand update");
                        latestPeriodic.cancel(false);//���������δ��ɣ�������ȡ��
                    }
                    //ͨ������run����������������ʱ��ִ�У��൱�������������е�һ��
                    InstanceInfoReplicator.this.run();
                }
            });
            return true;
        } else {
            logger.warn("Ignoring onDemand update due to stopped scheduler");
            return false;
        }
    } else {
        logger.warn("Ignoring onDemand update due to rate limiter");
        return false;
    }
}
```









**2.2.7 run**
run����ʵ���Ϻ�ǰ���Զ�װ����ִ�еķ���ע�᷽����һ���ģ�Ҳ���ǵ��� register �������з���ע�ᣬ������finally�У�ÿ30s�ᶨʱִ��һ�µ�ǰ��run �������м�顣



```
public void run() {
    try {
        discoveryClient.refreshInstanceInfo();
        Long dirtyTimestamp = instanceInfo.isDirtyWithTime();
        if (dirtyTimestamp != null) {
            discoveryClient.register();
            instanceInfo.unsetIsDirty(dirtyTimestamp);
        }
    } catch (Throwable t) {
        logger.warn("There was a problem with the instance info replicator", t);
    } finally {
        Future next = scheduler.schedule(this, replicationIntervalSeconds,
                                         TimeUnit.SECONDS);
        scheduledPeriodicRef.set(next);
    }
}
```









**2.2.8 register**
���գ����������ҵ�����ע�������ˣ�
eurekaTransport.registrationClient.register ���յ��õ��� AbstractJerseyEurekaHttpClient#register(...)`�� ��Ȼ�������Լ�ȥ�����룬�ͻᷢ��ȥ����֮ǰ�кܶ�������ȥ�Ĵ��룬���繤��ģʽ��װ����ģʽ�ȡ�



```
boolean register() throws Throwable {
    logger.info(PREFIX + "{}: registering service...", appPathIdentifier);
    EurekaHttpResponse<Void> httpResponse;
    try {
        httpResponse = eurekaTransport.registrationClient.register(instanceInfo);
    } catch (Exception e) {
        logger.warn(PREFIX + "{} - registration failed {}", appPathIdentifier,e.getMessage(), e);
        throw e;
    }
    if (logger.isInfoEnabled()) {
        logger.info(PREFIX + "{} - registration status: {}", appPathIdentifier,httpResponse.getStatusCode());
    }
    return httpResponse.getStatusCode() == Status.NO_CONTENT.getStatusCode();
}
```









����Ȼ�������Ƿ�����һ��http���󣬷���Eureka-Server��apps/${APP_NAME}�ӿڣ�����ǰ����ʵ������Ϣ���͵�Eureka Server���б��档

���ˣ����ǻ������Ѿ�֪��Spring Cloud Eureka �������������ʱ��ѷ�����Ϣע�ᵽEureka Server�ϵ��ˡ�



```
public EurekaHttpResponse<Void> register(InstanceInfo info) {
    String urlPath = "apps/" + info.getAppName();
    ClientResponse response = null;
    try {
        Builder resourceBuilder =
            jerseyClient.resource(serviceUrl).path(urlPath).getRequestBuilder();
        addExtraHeaders(resourceBuilder);
        response = resourceBuilder
            .header("Accept-Encoding", "gzip")
            .type(MediaType.APPLICATION_JSON_TYPE)
            .accept(MediaType.APPLICATION_JSON)
            .post(ClientResponse.class, info);
        return
            anEurekaHttpResponse(response.getStatus()).headers(headersOf(response)).build();
    } finally {
        if (logger.isDebugEnabled()) {
            logger.debug("Jersey HTTP POST {}/{} with instance {}; statusCode={}", serviceUrl, urlPath, info.getId(),
                         response == null ? "N/A" : response.getStatus());
        }
        if (response != null) {
            response.close();
        }
    }
}
```









���ǣ��ƺ��ʼ�����⻹û�н����Ҳ����Spring BootӦ��������ʱ�������start���������յ���
StatusChangeListener.notify ȥ���·����һ��״̬����û��ֱ�ӵ���register����ע�ᡣ�������Ǽ���ȥ��һ�� statusChangeListener.notify ������

**2.2.9 �����ܽ�**
���ˣ�����֪��Eureka Client�������ע��ʱ���������ط���ִ�з���ע�������

1.  ��Spring Boot����ʱ�������Զ�װ����ƽ�CloudEurekaClientע�뵽������������ִ���˹��췽�������ڹ��췽������һ����ʱ����ÿ40s��ִ��һ���жϣ��ж�ʵ����Ϣ�Ƿ����˱仯���������ᷢ�����ע�������
2.  ��Spring Boot����ʱ��ͨ��refresh���������յ���StatusChangeListener.notify���з���״̬����ļ���������������ķ����ܵ��¼�֮���ȥִ�з���ע�ᡣ
    **2.3 Server���߼�**
    ��û����Դ��ʵ��֮ǰ������һ��֪�����϶�����������ķ���ʵ�����ݽ����˴洢����ô����ȥEureka Server�˿�һ�´������̡�

��������ڣ�
com.netflix.eureka.resources.ApplicationResource.addInstance() ��

��ҿ��Է��֣��������ṩ��REST���񣬲��õ���jersey��ʵ�ֵġ�Jersey�ǻ���JAX-RS��׼���ṩREST��ʵ�ֵ�֧�֣�����Ͳ�չ�������ˡ�

**2.3.1 addInstance()**
��EurekaClient����register��������ע��ʱ�������
ApplicationResource.addInstance������

����ע����Ƿ���һ��POST������ϵ�ǰʵ����Ϣ���� ApplicationResource �� addInstance�������з���ע�ᡣ



```
@POST
@Consumes({"application/json", "application/xml"})
public Response addInstance(InstanceInfo info, @HeaderParam("x-netflix-discovery-replication") String isReplication) {
    logger.debug("Registering instance {} (replication={})", info.getId(),
                 isReplication);
    DataCenterInfo dataCenterInfo = info.getDataCenterInfo();
    if (dataCenterInfo instanceof UniqueIdentifier) {
        String dataCenterInfoId =
            ((UniqueIdentifier)dataCenterInfo).getId();
        if (this.isBlank(dataCenterInfoId)) {
            boolean experimental =            "true".equalsIgnoreCase(this.serverConfig.getExperimental("registration.validation.dataCenterInfoId"));
            if (experimental) {
                String entity = "DataCenterInfo of type " +
                    dataCenterInfo.getClass() + " must contain a valid id";
                return Response.status(400).entity(entity).build();
            }
            if (dataCenterInfo instanceof AmazonInfo) {
                AmazonInfo amazonInfo = (AmazonInfo)dataCenterInfo;
                String effectiveId = amazonInfo.get(MetaDataKey.instanceId);
                if (effectiveId == null) {
                    amazonInfo.getMetadata().put(MetaDataKey.instanceId.getName(), info.getId());
                }
            } else {
                logger.warn("Registering DataCenterInfo of type {} without an appropriate id", dataCenterInfo.getClass());
            }
        }
    }
    this.registry.register(info, "true".equals(isReplication));
    return Response.status(204).build();
}

```









**2.3.2 register**
����������
PeerAwareInstanceRegistryImpl�����ϵͼ�������ϵͼ���Կ�����PeerAwareInstanceRegistry�����ӿ�ΪLeaseManager��LookupService,

*   ����LookupService������������ķ���ʾ������Ϊ
*   LeaseManager�����˴���ͻ���ע�ᣬ��Լ��ע���Ȳ���

![SpringCloudϵ�С�Spring Cloud Դ�����֮Eureka-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/897d97d444664479bda0430417ec683f1f079a.jpg "SpringCloudϵ�С�Spring Cloud Դ�����֮Eureka-��Դ�����������")�� addInstance �����У����յ��õ���
PeerAwareInstanceRegistryImpl.register ������

* leaseDuration ��ʾ��Լ����ʱ�䣬Ĭ����90s��Ҳ���ǵ�����˳���90sû���յ��ͻ��˵��������������޳��ýڵ�

* ����super.register����ڵ�ע��

* ����Ϣ���Ƶ�Eureka Server��Ⱥ�е����������ϣ�ͬ����ʵ��Ҳ�ܼ򵥣����ǻ�ü�Ⱥ�е����нڵ㣬Ȼ���������ע��



  ```
  public void register(final InstanceInfo info, final boolean isReplication) {
      int leaseDuration = Lease.DEFAULT_DURATION_IN_SECS;
      if (info.getLeaseInfo() != null && info.getLeaseInfo().getDurationInSecs() >0) {
          leaseDuration = info.getLeaseInfo().getDurationInSecs(); //����ͻ������Լ�����������ʱʱ�䣬����ÿͻ��˵�ʱ��
      }
      super.register(info, leaseDuration, isReplication); //�ڵ�ע��
      //���Ƶ�Eureka Server��Ⱥ�е������ڵ�
      replicateToPeers(Action.Register, info.getAppName(), info.getId(), info,
                       null, isReplication);
  }
  ```









**2.3.3 AbstractInstanceRegistry.register**
����˵��Eureka-Server�ķ���ע�ᣬʵ�����ǽ��ͻ��˴��ݹ�����ʵ�����ݱ��浽Eureka-Server�е�ConcurrentHashMap�С�



```
public void register(InstanceInfo registrant, int leaseDuration, boolean
                     isReplication) {
    try {
        read.lock();
        //��registry�л�õ�ǰʵ����Ϣ������appName
        Map<String, Lease<InstanceInfo>> gMap =
            registry.get(registrant.getAppName());
        REGISTER.increment(isReplication); //����ע������������Ϣ��
        if (gMap == null) {//�����ǰappName�ǵ�һ��ע�ᣬ���ʼ��һ��ConcurrentHashMap
            final ConcurrentHashMap<String, Lease<InstanceInfo>> gNewMap = new
                ConcurrentHashMap<String, Lease<InstanceInfo>>();
            gMap = registry.putIfAbsent(registrant.getAppName(), gNewMap);
            if (gMap == null) {
                gMap = gNewMap;
            }
        }
        //��gMap�в�ѯ�Ѿ����ڵ�Lease��Ϣ��Lease���ķ���Ϊ��Լ��ʵ�������ѷ����ṩ�ߵ�ʵ����Ϣ��װ����һ��lease�������ṩ�˶��ڸķ���ʵ������Լ����
        Lease<InstanceInfo> existingLease = gMap.get(registrant.getId());
        // ��instance�Ѿ������ǣ��Ϳͻ��˵�instance����Ϣ���Ƚϣ�ʱ�����µ��Ǹ���Ϊ��Чinstance��Ϣ
        if (existingLease != null && (existingLease.getHolder() != null)) {
            Long existingLastDirtyTimestamp =
                existingLease.getHolder().getLastDirtyTimestamp();
            Long registrationLastDirtyTimestamp =
                registrant.getLastDirtyTimestamp();
            logger.debug("Existing lease found (existing={}, provided={}",
                         existingLastDirtyTimestamp, registrationLastDirtyTimestamp);
            // this is a > instead of a >= because if the timestamps are equal,we still take the remote transmitted
            // InstanceInfo instead of the server local copy.
            if (existingLastDirtyTimestamp > registrationLastDirtyTimestamp) {
                logger.warn("There is an existing lease and the existing lease's dirty timestamp {} is greater" +
                            " than the one that is being registered {}",
                            existingLastDirtyTimestamp, registrationLastDirtyTimestamp);
                logger.warn("Using the existing instanceInfo instead of the new instanceInfo as the registrant");
                registrant = existingLease.getHolder();
            }
        } else {
            //��lease������ʱ�����뵽��δ��룬
            synchronized (lock) {
                if (this.expectedNumberOfClientsSendingRenews > 0) {
                    // Since the client wants to register it, increase the number of clients sending renews
                    this.expectedNumberOfClientsSendingRenews =
                        this.expectedNumberOfClientsSendingRenews + 1;
                    updateRenewsPerMinThreshold();
                }
            }
            logger.debug("No previous lease information found; it is new registration");
        }
        //����һ��lease
        Lease<InstanceInfo> lease = new Lease<InstanceInfo>(registrant,
                                                            leaseDuration);
        if (existingLease != null) {
            // ��ԭ������Lease����Ϣʱ������serviceUpTimestamp, ��֤����������ʱ��һֱ�ǵ�һ��ע����Ǹ�
            lease.setServiceUpTimestamp(existingLease.getServiceUpTimestamp());
        }
        gMap.put(registrant.getId(), lease);
        synchronized (recentRegisteredQueue) {//��ӵ����ע��Ķ�����
            recentRegisteredQueue.add(new Pair<Long, String>(
                System.currentTimeMillis(),
                registrant.getAppName() + "(" + registrant.getId() + ")"));
        }
        // ���ʵ��״̬�Ƿ����仯������ǲ��Ҵ��ڣ��򸲸�ԭ����״̬
        if (!InstanceStatus.UNKNOWN.equals(registrant.getOverriddenStatus())) {
            logger.debug("Found overridden status {} for instance {}. Checking to see if needs to be add to the "
                         + "overrides", registrant.getOverriddenStatus(),
                         registrant.getId());
            if (!overriddenInstanceStatusMap.containsKey(registrant.getId())) {
                logger.info("Not found overridden id {} and hence adding it",
                            registrant.getId());
                overriddenInstanceStatusMap.put(registrant.getId(),
                                                registrant.getOverriddenStatus());
            }
        }
        InstanceStatus overriddenStatusFromMap =
            overriddenInstanceStatusMap.get(registrant.getId());
        if (overriddenStatusFromMap != null) {
            logger.info("Storing overridden status {} from map",
                        overriddenStatusFromMap);
            registrant.setOverriddenStatus(overriddenStatusFromMap);
        }
        // Set the status based on the overridden status rules
        InstanceStatus overriddenInstanceStatus =
            getOverriddenInstanceStatus(registrant, existingLease, isReplication);
        registrant.setStatusWithoutDirty(overriddenInstanceStatus);
        // �õ�instanceStatus���ж��Ƿ���UP״̬��
        if (InstanceStatus.UP.equals(registrant.getStatus())) {
            lease.serviceUp();
        }
        // ����ע������Ϊ���
        registrant.setActionType(ActionType.ADDED);
        // ��Լ�����¼���У���¼��ʵ����ÿ�α仯�� ����ע����Ϣ��������ȡ
        recentlyChangedQueue.add(new RecentlyChangedItem(lease));
        registrant.setLastUpdatedTimestamp();
        //�û���ʧЧ
        invalidateCache(registrant.getAppName(), registrant.getVIPAddress(),
                        registrant.getSecureVipAddress());
        logger.info("Registered instance {}/{} with status {} (replication={})",
                    registrant.getAppName(), registrant.getId(),
                    registrant.getStatus(), isReplication);
    } finally {
        read.unlock();
    }
}
```









**2.3.4 С��**
���ˣ����ǾͰѷ���ע���ڿͻ��˺ͷ���˵Ĵ����������һ����ϸ�ķ�����ʵ������Eureka Server�ˣ���ѿͻ��˵ĵ�ַ��Ϣ���浽ConcurrentHashMap�д洢�����ҷ����ṩ�ߺ�ע������֮�䣬�Ὠ��һ�����������ơ����ڼ�ط����ṩ�ߵĽ���״̬��

**2.4 Eureka �Ķ༶�������**
Eureka Server��������������(registry��readWriteCacheMap��readOnlyCacheMap)�������ע����Ϣ��Ĭ������¶�ʱ����ÿ30s��readWriteCacheMapͬ����readOnlyCacheMap��ÿ60s������90sδ��Լ�Ľڵ㣬Eureka Clientÿ30s��readOnlyCacheMap���·���ע����Ϣ�����ͻ��˷����ע�����registry���·���ע����Ϣ��

**2.4.1 �༶���������**
����ΪʲôҪ��ƶ༶�����أ�ԭ��ܼ򵥣����ǵ����ڴ��ģ�ķ���ע��͸���ʱ�����ֻ���޸�һ��ConcurrentHashMap���ݣ���ô�Ʊ���Ϊ���Ĵ��ڵ��¾�����Ӱ�����ܡ�

��Eureka����APģ�ͣ�ֻ��Ҫ�������տ��þ��С��������������õ��༶������ʵ�ֶ�д���롣ע�᷽��д��ʱ��ֱ��д�ڴ�ע���д���֮������ʧЧ��д���档

��ȡע����Ϣ�ӿ��ȴ�ֻ������ȡ��ֻ������û����ȥ��д����ȡ����д����û����ȥ�ڴ�ע�����ȡ����ֻ��ȡ���˴��ϸ��ӣ������ң���д�������»�дֻ������

*   responseCacheUpdateIntervalMs �� readOnlyCacheMap ������µĶ�ʱ��ʱ������Ĭ��Ϊ30��
*   responseCacheAutoExpirationInSeconds : readWriteCacheMap �������ʱ�䣬Ĭ��Ϊ 180 �롣
    **2.4.2 ����ע��Ļ���ʧЧ**
    ��AbstractInstanceRegistry.register��������󣬻����invalidateCache(registrant.getAppName(), registrant.getVIPAddress(),registrant.getSecureVipAddress()); ������ʹ�ö�д����ʧЧ��



```
public void invalidate(Key... keys) {
    for (Key key : keys) {
        logger.debug("Invalidating the response cache key : {} {} {} {}, {}",
                     key.getEntityType(), key.getName(), key.getVersion(),
                     key.getType(), key.getEurekaAccept());
        readWriteCacheMap.invalidate(key);
        Collection<Key> keysWithRegions = regionSpecificKeys.get(key);
        if (null != keysWithRegions && !keysWithRegions.isEmpty()) {
            for (Key keysWithRegion : keysWithRegions) {
                logger.debug("Invalidating the response cache key : {} {} {} {} {}",
                             key.getEntityType(), key.getName(),
                             key.getVersion(), key.getType(), key.getEurekaAccept());
                readWriteCacheMap.invalidate(keysWithRegion);
            }
        }
    }
}
```









**2.4.3 ��ʱͬ������**
ResponseCacheImpl�Ĺ��췽���У�������һ����ʱ�����������ᶨʱ���д�����е����ݱ仯�����и��º�ͬ����



```
private TimerTask getCacheUpdateTask() {
    return new TimerTask() {
        @Override
        public void run() {
            logger.debug("Updating the client cache from response cache");
            for (Key key : readOnlyCacheMap.keySet()) {
                if (logger.isDebugEnabled()) {
                    logger.debug("Updating the client cache from response cache for key : {} {} {} {}",
                                 key.getEntityType(), key.getName(),
                                 key.getVersion(), key.getType());
                }
                try {
                    CurrentRequestVersion.set(key.getVersion());
                    Value cacheValue = readWriteCacheMap.get(key);
                    Value currentCacheValue = readOnlyCacheMap.get(key);
                    if (cacheValue != currentCacheValue) {
                        readOnlyCacheMap.put(key, cacheValue);
                    }
                } catch (Throwable th) {
                    logger.error("Error while updating the client cache from response cache for key {}", key.toStringCompact(), th);
                } finally {
                    CurrentRequestVersion.remove();
                }
            }
        }
    };
}
```









**2.5 ������Լ**
��ν�ķ�����Լ����ʵ����һ�����������ơ��ͻ��˻ᶨ�ڷ�����������Լ����ô�򵥸���ҿ�һ�´����ʵ��

**2.5.1 initScheduledTasks**
�ͻ��˻���
DiscoveryClient.initScheduledTasks �У�����һ���������Ķ�ʱ����



```
// Heartbeat timer
scheduler.schedule(
    new TimedSupervisorTask(
        "heartbeat",
        scheduler,
        heartbeatExecutor,
        renewalIntervalInSecs,
        TimeUnit.SECONDS,
        expBackOffBound,
        new HeartbeatThread()
    ),
    renewalIntervalInSecs, TimeUnit.SECONDS);
```









**2.5.2 HeartbeatThread**
Ȼ�������ʱ�����У���ִ��һ�� HearbeatThread ���̣߳�����̻߳ᶨʱ����renew()������Լ��



```
//ÿ��30s����һ����������
private class HeartbeatThread implements Runnable {
    public void run() {
        if (renew()) {
            lastSuccessfulHeartbeatTimestamp = System.currentTimeMillis();
        }
    }
}
```









**2.5.3 ������յ���������Ĵ���**
��ApplicationResource.getInstanceInfo����ӿ��У��᷵��һ��InstanceResource��ʵ�����ڸ�ʵ���£�������һ��statusUpdate�Ľӿ�������״̬



```
@Path("{id}")
public InstanceResource getInstanceInfo(@PathParam("id") String id) {
    return new InstanceResource(this, id, serverConfig, registry);
}
```









**2.5.4 InstanceResource.statusUpdate()**
�ڸ÷����У������ص��ע registry.statusUpdate ����������������
AbstractInstanceRegistry.statusUpdate������ָ�������ṩ���ڷ���˴洢����Ϣ�еı仯��



```
@PUT
@Path("status")
public Response statusUpdate(
    @QueryParam("value") String newStatus,
    @HeaderParam(PeerEurekaNode.HEADER_REPLICATION) String isReplication,
    @QueryParam("lastDirtyTimestamp") String lastDirtyTimestamp) {
    try {
        if (registry.getInstanceByAppAndId(app.getName(), id) == null) {
            logger.warn("Instance not found: {}/{}", app.getName(), id);
            return Response.status(Status.NOT_FOUND).build();
        }
        boolean isSuccess = registry.statusUpdate(app.getName(), id,                      
                                                  InstanceStatus.valueOf(newStatus), lastDirtyTimestamp,
                                                  "true".equals(isReplication));
        if (isSuccess) {
            logger.info("Status updated: {} - {} - {}", app.getName(), id,
                        newStatus);
            return Response.ok().build();
        } else {
            logger.warn("Unable to update status: {} - {} - {}", app.getName(),
                        id, newStatus);
            return Response.serverError().build();
        }
    } catch (Throwable e) {
        logger.error("Error updating instance {} for status {}", id,
                     newStatus);
        return Response.serverError().build();
    }
}
```









**2.5.5 AbstractInstanceRegistry.statusUpdate**
����������У����õ�Ӧ�ö�Ӧ��ʵ���б�Ȼ�����Lease.renew()ȥ����������Լ��



```
public boolean statusUpdate(String appName, String id,
                            InstanceStatus newStatus, String
                            lastDirtyTimestamp,
                            boolean isReplication) {
    try {
        read.lock();
        // ����״̬�Ĵ��� ״̬ͳ��
        STATUS_UPDATE.increment(isReplication);
        // �ӱ������������ȡʵ����Ϣ��
        Map<String, Lease<InstanceInfo>> gMap = registry.get(appName);
        Lease<InstanceInfo> lease = null;
        if (gMap != null) {
            lease = gMap.get(id);
        }
        // ʵ�������ڣ���ֱ�ӷ��أ���ʾʧ��
        if (lease == null) {
            return false;
        } else {
            // ִ��һ��lease��renew������������Ҫ�Ǹ��������instance��������ʱ�䡣
            lease.renew();
            // ��ȡinstanceʵ����Ϣ
            InstanceInfo info = lease.getHolder();
            // Lease is always created with its instance info object.
            // This log statement is provided as a safeguard, in case this invariant is violated.
            if (info == null) {
                logger.error("Found Lease without a holder for instance id {}",
                             id);
            }
            // ��instance��Ϣ��Ϊ��ʱ������ʵ��״̬�����˱仯
            if ((info != null) && !(info.getStatus().equals(newStatus))) {
                // �����״̬��UP��״̬����ô����һ��serviceUp() , ��Ҫ�Ǹ��·����ע��ʱ
                ��
                    if (InstanceStatus.UP.equals(newStatus)) {
                        lease.serviceUp();
                    }
                // ��instance Id �����״̬��ӳ����Ϣ���븲�ǻ���MAP����ȥ
                overriddenInstanceStatusMap.put(id, newStatus);
                // Set it for transfer of overridden status to replica on
                // ���ø���״̬��ʵ����Ϣ����ȥ
                info.setOverriddenStatus(newStatus);
                long replicaDirtyTimestamp = 0;
                info.setStatusWithoutDirty(newStatus);
                if (lastDirtyTimestamp != null) {
                    replicaDirtyTimestamp = Long.valueOf(lastDirtyTimestamp);
                }
                // If the replication's dirty timestamp is more than the existing one, just update
                // it to the replica's.
                // ���replicaDirtyTimestamp ��ʱ�����instance��getLastDirtyTimestamp() ,�����

                if (replicaDirtyTimestamp > info.getLastDirtyTimestamp()) {
                    info.setLastDirtyTimestamp(replicaDirtyTimestamp);
                }
                info.setActionType(ActionType.MODIFIED);
                recentlyChangedQueue.add(new RecentlyChangedItem(lease));
                info.setLastUpdatedTimestamp();
                //����д����
                invalidateCache(appName, info.getVIPAddress(),
                                info.getSecureVipAddress());
            }
            return true;
        }
    } finally {
        read.unlock();
    }
}
```









���ˣ�������Լ���ܾͷ�������ˡ�

**2.6 ������**
���Ǽ������о�����ķ��ֹ��̣����ǿͻ�����Ҫ�ܹ�������������

��������ʱ���ȡָ�������ṩ�ߵĵ�ַ�б�
Eureka server�˵�ַ�����仯ʱ����Ҫ��̬��֪
**2.6.1 DiscoveryClient����ʱ��ѯ**
���췽���У������ǰ�Ŀͻ���Ĭ�Ͽ�����fetchRegistry������eureka-server����ȡ���ݡ�



```
DiscoveryClient(ApplicationInfoManager applicationInfoManager,
                EurekaClientConfig config, AbstractDiscoveryClientOptionalArgs args,
                Provider<BackupRegistry> backupRegistryProvider,
                EndpointRandomizer endpointRandomizer) {
    if (clientConfig.shouldFetchRegistry() && !fetchRegistry(false)) {
        fetchRegistryFromBackup();
    }
}
```









**2.6.2 fetchRegistry**



```
private boolean fetchRegistry(boolean forceFullRegistryFetch) {
    Stopwatch tracer = FETCH_REGISTRY_TIMER.start();
    try {
        // If the delta is disabled or if it is the first time, get all
        // applications
        Applications applications = getApplications();
        if (clientConfig.shouldDisableDelta()
            ||
            (!Strings.isNullOrEmpty(clientConfig.getRegistryRefreshSingleVipAddress()))
            || forceFullRegistryFetch
            || (applications == null)
            || (applications.getRegisteredApplications().size() == 0)
            || (applications.getVersion() == -1)) //Client application does not have latest library supporting delta
        {
            logger.info("Disable delta property : {}",
                        clientConfig.shouldDisableDelta());
            logger.info("Single vip registry refresh property : {}",
                        clientConfig.getRegistryRefreshSingleVipAddress());
            logger.info("Force full registry fetch : {}",
                        forceFullRegistryFetch);
            logger.info("Application is null : {}", (applications == null));
            logger.info("Registered Applications size is zero : {}",
                        (applications.getRegisteredApplications().size() == 0));
            logger.info("Application version is -1: {}",
                        (applications.getVersion() == -1));
            getAndStoreFullRegistry();
        } else {
            getAndUpdateDelta(applications);
        }
        applications.setAppsHashCode(applications.getReconcileHashCode());
        logTotalInstances();
    } catch (Throwable e) {
        logger.error(PREFIX + "{} - was unable to refresh its cache! status = {}", appPathIdentifier, e.getMessage(), e);
        return false;
    } finally {
        if (tracer != null) {
            tracer.stop();
        }
    }
    // Notify about cache refresh before updating the instance remote status
    onCacheRefreshed();
    // Update remote status based on refreshed data held in the cache
    updateInstanceRemoteStatus();
    // registry was fetched successfully, so return true
    return true;
}
```









**2.6.3 ��ʱˢ�±��ص�ַ�б�**
����ÿ��30s����һ��
��DiscoveryClient�����ʱ�򣬻��ʼ��һЩ���������ǰ�����Ƿ������ˡ�������һ������̬���±��ط����ַ�б��� cacheRefreshTask ��

�����������ִ�е���CacheRefreshThread����̡߳�����һ��������ִ�е����񣬾�����������һ�¡�



```
private void initScheduledTasks() {
    if (clientConfig.shouldFetchRegistry()) {
        // registry cache refresh timer
        int registryFetchIntervalSeconds =
            clientConfig.getRegistryFetchIntervalSeconds();
        int expBackOffBound =
            clientConfig.getCacheRefreshExecutorExponentialBackOffBound();
        cacheRefreshTask = new TimedSupervisorTask(
            "cacheRefresh",
            scheduler,
            cacheRefreshExecutor,
            registryFetchIntervalSeconds,
            TimeUnit.SECONDS,
            expBackOffBound,
            new CacheRefreshThread()
        );
        scheduler.schedule(
            cacheRefreshTask,
            registryFetchIntervalSeconds, TimeUnit.SECONDS);
    }
```









**2.6.4 TimedSupervisorTask**
�������Ͽ���TimedSupervisorTask�ǹ̶����������������һ��������ʱ�ͻὫ��һ�����ڵļ��ʱ��������������ʱ����ôÿ�μ��ʱ�䶼������һ����һֱ�����ⲿ�����趨������Ϊֹ��һ���������ٳ�ʱ�����ʱ���ֻ��Զ��ָ�Ϊ��ʼֵ��������ƻ���ֵ��ѧϰ�ġ�



```
public void run() {
      Future future = null;
  try {
    //ʹ��Future�������趨���̵߳ĳ�ʱʱ�䣬������ǰ�߳̾Ͳ������޵ȴ���
    future = executor.submit(task);
    threadPoolLevelGauge.set((long) executor.getActiveCount());
    //ָ���ȴ����̵߳��ʱ��
    future.get(timeoutMillis, TimeUnit.MILLISECONDS);  // block until done or timeout
    //delay�Ǹ������õı�����������õ�������ǵ�ÿ��ִ������ɹ����Ὣdelay����
    delay.set(timeoutMillis);
    threadPoolLevelGauge.set((long) executor.getActiveCount());
 } catch (TimeoutException e) {
    logger.error("task supervisor timed out", e);
    timeoutCounter.increment();
    long currentDelay = delay.get();
    //�����̳߳�ʱ��ʱ�򣬾Ͱ�delay���������������ᳬ���ⲿ����ʱ�趨�������ʱʱ��
    long newDelay = Math.min(maxDelay, currentDelay * 2);
    //����Ϊ���µ�ֵ�����ǵ����̣߳���������CAS
    delay.compareAndSet(currentDelay, newDelay);
 } catch (RejectedExecutionException e) {
    //һ���̳߳ص����������з����˴��������񣬴����˾ܾ����ԣ��ͻὫ������ͣ��
    if (executor.isShutdown() || scheduler.isShutdown()) {
      logger.warn("task supervisor shutting down, reject the task", e);
   } else {
      logger.error("task supervisor rejected the task", e);
   }
    rejectedCounter.increment();
 } catch (Throwable e) {
    //һ������δ֪���쳣����ͣ��������
    if (executor.isShutdown() || scheduler.isShutdown()) {
      logger.warn("task supervisor shutting down, can't accept the task");
   } else {
      logger.error("task supervisor threw an exception", e);
   }
    throwableCounter.increment();
 } finally {
    //��������Ҫôִ����ϣ�Ҫô�����쳣������cancel��������������
    if (future != null) {
      future.cancel(true);
   }
    //ֻҪ������û��ֹͣ������ָ���ȴ�ʱ��֮����ִ��һ��ͬ��������
    if (!scheduler.isShutdown()) {
      //������������������ԭ��ֻҪû��ֹͣ�����������ٴ���һ��������ִ��ʱ��ʱdealy��ֵ��
      //�����ⲿ����ʱ����ĳ�ʱʱ��Ϊ30�루���췽�������timeout���������ʱ��Ϊ50��(���췽�������expBackOffBound)
      //������һ������û�г�ʱ����ô����30���ʼ������
      //������һ������ʱ�ˣ���ô����50���ʼ�������쳣�������и����Զ��Ĳ��������Զ����60�볬���������50�룩
      scheduler.schedule(this, delay.get(), TimeUnit.MILLISECONDS);
   }
 }
}
```









**2.6.5 refreshRegistry**
��δ�����Ҫ�����߼�

* �ж�remoteRegions�Ƿ����˱仯

* ����fetchRegistry��ȡ���ط����ַ����



  ```
  @VisibleForTesting
  void refreshRegistry() {
      try {
          boolean isFetchingRemoteRegionRegistries =
              isFetchingRemoteRegionRegistries();
          boolean remoteRegionsModified = false;
          //���������aws�����ϣ����ж����һ��Զ��������µ���Ϣ�͵�ǰԶ��������Ϣ���бȽϣ��������ȣ������
          String latestRemoteRegions =
              clientConfig.fetchRegistryForRemoteRegions();
          if (null != latestRemoteRegions) {
              String currentRemoteRegions = remoteRegionsToFetch.get();
              if (!latestRemoteRegions.equals(currentRemoteRegions)) {
                  //�ж����һ��
              }
              boolean success = fetchRegistry(remoteRegionsModified);
              if (success) {
                  registrySize = localRegionApps.get().size();
                  lastSuccessfulRegistryFetchTimestamp =
                      System.currentTimeMillis();
              }
              // ʡ��
          } catch (Throwable e) {
              logger.error("Cannot fetch registry from server", e);
          }
      }
  ```









**2.6.6 fetchRegistry**



  ```
  private boolean fetchRegistry(boolean forceFullRegistryFetch) {
      Stopwatch tracer = FETCH_REGISTRY_TIMER.start();
      try {
          // If the delta is disabled or if it is the first time, get all
          // applications
          // ȡ�����ػ���ķ����б���Ϣ
          Applications applications = getApplications();
          //�ж϶��������ȷ���Ƿ񴥷�ȫ�����£�������һ�����㶼��ȫ�����£�
          //1\. �Ƿ�����������£�
          //2\. �Ƿ��ĳ��region�ر��ע��
          //3\. �ⲿ����ʱ�Ƿ�ͨ�����ָ��ȫ�����£�
          //4\. ���ػ�δ������Ч�ķ����б���Ϣ��
          if (clientConfig.shouldDisableDelta()
              ||
              (!Strings.isNullOrEmpty(clientConfig.getRegistryRefreshSingleVipAddress()))
              || forceFullRegistryFetch
              || (applications == null)
              || (applications.getRegisteredApplications().size() == 0)
              || (applications.getVersion() == -1)) //Client application does not
              have latest library supporting delta
          {
              //����ȫ������
              getAndStoreFullRegistry();
          } else {
              //������������
              getAndUpdateDelta(applications);
          }
          //���¼��������һ����hash��
          applications.setAppsHashCode(applications.getReconcileHashCode());
          logTotalInstances(); //��־��ӡ����Ӧ�õ�����ʵ����֮��
      } catch (Throwable e) {
          logger.error(PREFIX + "{} - was unable to refresh its cache! status = {}", appPathIdentifier, e.getMessage(), e);
          return false;
      } finally {
          if (tracer != null) {
              tracer.stop();
          }
      }
      //�����ػ�����µ��¼��㲥��������ע��ļ�������ע��÷����ѱ�CloudEurekaClient����д
      onCacheRefreshed();
      // Update remote status based on refreshed data held in the cache
      //���ոո��µĻ����У�������Eureka server�ķ����б����а����˵�ǰӦ�õ�״̬��
      //��ǰʵ���ĳ�Ա����lastRemoteInstanceStatus����¼�������һ�θ��µĵ�ǰӦ��״̬��
      //��������״̬��updateInstanceRemoteStatus���������Ƚ� �������һ�£��͸���lastRemoteInstanceStatus�����ҹ㲥��Ӧ���¼�
      updateInstanceRemoteStatus();
      // registry was fetched successfully, so return true
      return true;
  }
  ```









**2.6.7 getAndStoreFullRegistry**
��eureka server�˻�ȡ����ע�����ĵĵ�ַ��Ϣ��Ȼ����²����õ����ػ��� localRegionApps ��



```
private void getAndStoreFullRegistry() throws Throwable {
    long currentUpdateGeneration = fetchRegistryGeneration.get();
    logger.info("Getting all instance registry info from the eureka server");
    Applications apps = null;
    EurekaHttpResponse<Applications> httpResponse =
        clientConfig.getRegistryRefreshSingleVipAddress() == null
        ? eurekaTransport.queryClient.getApplications(remoteRegionsRef.get())
        :
    eurekaTransport.queryClient.getVip(clientConfig.getRegistryRefreshSingleVipAddre
                                       ss(), remoteRegionsRef.get());
    if (httpResponse.getStatusCode() == Status.OK.getStatusCode()) {
        apps = httpResponse.getEntity();
    }
    logger.info("The response status is {}", httpResponse.getStatusCode());
    if (apps == null) {
        logger.error("The application is null for some reason. Not storing this information");
    } else if (fetchRegistryGeneration.compareAndSet(currentUpdateGeneration,
                                                     currentUpdateGeneration + 1)) {
        localRegionApps.set(this.filterAndShuffle(apps));
        logger.debug("Got full registry with apps hashcode {}",
                     apps.getAppsHashCode());
    } else {
        logger.warn("Not updating applications as another thread is updating it already");
    }
}
```









**2.6.8 ����˲�ѯ�����ַ����**
ǰ������֪�����ͻ��˷�������ַ�Ĳ�ѯ�����֣�һ����ȫ������һ��������������ȫ����ѯ�����󣬻����Eureka-server��ApplicationsResource��getContainers������

�������������󣬻����
ApplicationsResource.getContainerDifferential��

**2.6.9 ApplicationsResource.getContainers**
���տͻ��˷��͵Ļ�ȡȫ��ע����Ϣ����



```
@GET
public Response getContainers(@PathParam("version") String version,
                              @HeaderParam(HEADER_ACCEPT) String acceptHeader,
                              @HeaderParam(HEADER_ACCEPT_ENCODING) String
                              acceptEncoding,
                              @HeaderParam(EurekaAccept.HTTP_X_EUREKA_ACCEPT)
                              String eurekaAccept,
                              @Context UriInfo uriInfo,
                              @Nullable @QueryParam("regions") String
                              regionsStr) {
    boolean isRemoteRegionRequested = null != regionsStr &&
        !regionsStr.isEmpty();
    String[] regions = null;
    if (!isRemoteRegionRequested) {
        EurekaMonitors.GET_ALL.increment();
    } else {
        regions = regionsStr.toLowerCase().split(",");
        Arrays.sort(regions); // So we don't have different caches for same regions queried in different order.
        EurekaMonitors.GET_ALL_WITH_REMOTE_REGIONS.increment();
    }
    // EurekaServer�޷��ṩ���񣬷���403
    if (!registry.shouldAllowAccess(isRemoteRegionRequested)) {
        return Response.status(Status.FORBIDDEN).build();
    }
    CurrentRequestVersion.set(Version.toEnum(version));
    KeyType keyType = Key.KeyType.JSON;// ���÷������ݸ�ʽ��Ĭ��JSON
    String returnMediaType = MediaType.APPLICATION_JSON;
    if (acceptHeader == null || !acceptHeader.contains(HEADER_JSON_VALUE)) {
        // ������յ�������ͷ��û�о����ʽ��Ϣ���򷵻ظ�ʽΪXML
        keyType = Key.KeyType.XML;
        returnMediaType = MediaType.APPLICATION_XML;
    }
    // ���������
    Key cacheKey = new Key(Key.EntityType.Application,
                           ResponseCacheImpl.ALL_APPS,
                           keyType, CurrentRequestVersion.get(),
                           EurekaAccept.fromString(eurekaAccept), regions
                          );
    // ���ز�ͬ�ı������͵����ݣ�ȥ������ȡ���ݵķ�������һ��
    Response response;
    if (acceptEncoding != null && acceptEncoding.contains(HEADER_GZIP_VALUE)) {
        response = Response.ok(responseCache.getGZIP(cacheKey))
            .header(HEADER_CONTENT_ENCODING, HEADER_GZIP_VALUE)
            .header(HEADER_CONTENT_TYPE, returnMediaType)
            .build();
    } else {
        response = Response.ok(responseCache.get(cacheKey))
            .build();
    }
    CurrentRequestVersion.remove();
    return response;
}
```









**2.6.10 responseCache.getGZIP**
�ӻ����ж�ȡ���ݡ�



```
public byte[] getGZIP(Key key) {
    Value payload = getValue(key, shouldUseReadOnlyResponseCache);
    if (payload == null) {
        return null;
    }
    return payload.getGzipped();
}
Value getValue(final Key key, boolean useReadOnlyCache) {
    Value payload = null;
    try {
        if (useReadOnlyCache) {
            final Value currentPayload = readOnlyCacheMap.get(key);
            if (currentPayload != null) {
                payload = currentPayload;
            } else {
                payload = readWriteCacheMap.get(key);
                readOnlyCacheMap.put(key, payload);
            }
        } else {
            payload = readWriteCacheMap.get(key);
        }
    } catch (Throwable t) {
        logger.error("Cannot get value for key : {}", key, t);
    }
    return payload;
}
```

# �ο�����
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud
https://github.com/macrozheng/springcloud-learning