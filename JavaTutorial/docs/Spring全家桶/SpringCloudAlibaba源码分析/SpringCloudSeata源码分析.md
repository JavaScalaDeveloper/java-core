���� | һ��ߣJava
��Դ |����ͷ��

**ѧϰĿ��**

*   Seata ATģʽԴ������
    **��1�� ATģʽ����**
    **1.1 ˼ά�����Ƶ�**
    �������Ѿ�����ATģʽ�Ĵ���ԭ����Դ���У�ͨ��READMEҲ�ܿ�����ATģʽ��ʹ�ã��Ǳ��Ľ��ӵײ�Դ�����ȥ����ATģʽ��ԭ���ڷ���ԭ��֮ǰ��������������ͼ�����һ�����Ĺ���˼·��ģʽ��

�ȿ���˼ά�Ƶ�ͼ![SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������ϣ�-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/0388859932ccee17ed32246e2e5f4e0a88dee6.jpg "SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������ϣ�-��Դ�����������")1.2 ��ʼ�������Ƶ�
![SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������ϣ�-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/f24e8bd05e84b683e3f3227490146155bf5b17.jpg "SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������ϣ�-��Դ�����������")1.3 ִ�������Ƶ�
![SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������ϣ�-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/93dea0538eba8be5778699ea2af8f71c0e396c.jpg "SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������ϣ�-��Դ�����������")**��2�� Դ�����**
**2.1 SeataAutoConfiguration**
����seataԴ����о���Ҫ��seata�������ҵ��SQL����undo_log���ݣ������һ�׶���ɺ��ύȫ�����������һ�׶�ҵ��ʧ�ܺ�ͨ��undo_log�ع����񣬽������񲹳���

seataҲ����spring����ʹ�õģ����SpringBoot��seataҲ������һЩ�Զ�����![SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������ϣ�-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/719ef4a775ece0688c929227415e97f68f1c58.jpg "SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������ϣ�-��Դ�����������")seata���Զ������������ǳ���ֱ�ӣ��ͽ�����SeataAutoConfiguration�����Ǵ������



```
@ComponentScan(basePackages = "io.seata.spring.boot.autoconfigure.properties")@ConditionalOnProperty(prefix = StarterConstants.SEATA_PREFIX, name = "enabled", havingValue = "true", matchIfMissing = true)@Configuration@EnableConfigurationProperties({SeataProperties.class})public class SeataAutoConfiguration {    }
```









���ȣ�@ComponentScanɨ����һ��properties����������һ�������SeataProperties��Bean����

@ConditionalOnProperty����������Ч��������Ϊseata.enabled=true��Ĭ��ֵ��true�����Կ��Կ��طֲ�ʽ�����ܣ���client�˵�file.conf����������ã���

@Configuration������SeataAutoConfiguration������Ϊ��spring�������ࡣ

@EnableConfigurationProperties�����ð�ת����һ��SeataProperties��Bean������ʹ�á�

�������Ķ�SeataAutoConfiguration���ڲ�����



```
@Bean@DependsOn({BEAN_NAME_SPRING_APPLICATION_CONTEXT_PROVIDER, BEAN_NAME_FAILURE_HANDLER})@ConditionalOnMissingBean(GlobalTransactionScanner.class)public GlobalTransactionScanner globalTransactionScanner(SeataProperties seataProperties, FailureHandler failureHandler) {    if (LOGGER.isInfoEnabled()) {        LOGGER.info("Automatically configure Seata");    }    return new GlobalTransactionScanner(seataProperties.getApplicationId(), seataProperties.getTxServiceGroup(), failureHandler);}
```









�Զ����õĺ��ĵ������������һ��Bean��GlobalTransactionScanner��

���ǿ����������Bean�ǳ��ļ򵥣����췽��ֻ��Ҫһ��applicationId��txServiceGroup��

applicationId: ����spring.application.name=�㶨��ĵ�ǰӦ�õ����֣����磺userService

txServiceGroup: ������applicationId ���� -seata-service-group�����ģ����磺
userService-seata-service-group������汾�ϵ͵Ļ�����ʱ����ܻ�����seata����fescar�����Ĭ������������fescarΪ��׺��

new��һ��GlobalTransactionScanner����SeataAutoConfiguration����Զ�����������þͽ����ˡ�SeataAutoConfigurationֻ������һ���������������á�

**2.2 GlobalTransactionScanner**
��Ȼ���ĵ�����GlobalTransactionScanner����࣬���Ǽ�����ע���������������ʵ�Ϳ��Բ²⵽һ���������ã�ɨ��@GlobalTransactional���ע�⣬���Դ���������������ǿ����Ĺ��ܡ�

Ҫ�˽�����࣬���ò����Ķ�һ������UMLͼ![SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������ϣ�-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/83cb3ed76073a33cb19242ffe542b615346d16.jpg "SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������ϣ�-��Դ�����������")���Կ�����GlobalTransactionScanner��Ҫ��4����ֵ�ù�ע��

1��ApplicationContextAware��ʾ�����õ�spring����

2��InitializingBean�ӿڣ�����˳�ʼ����ʱ������һЩ����

3��AbstractAutoProxyCreator��ʾ�����spring�����е�Bean����������ǿ��Ҳ�����������������������ǿ�Ĳ²⡣

4��Disposable�ӿڣ������spring�������ٵ�ʱ������һЩ����

����������΢��עһ����4����ִ��˳��

ApplicationContextAware -> InitializingBean -> AbstractAutoProxyCreator -> DisposableBean

**2.3 InitializingBean**



```
@Overridepublic void afterPropertiesSet() {    if (disableGlobalTransaction) {        if (LOGGER.isInfoEnabled()) {            LOGGER.info("Global transaction is disabled.");        }        return;    }    initClient();}
```









��ʼ��Seata��Client�˵Ķ�����Client����Ҫ����TransactionManager��ResourceManager��������Ϊ�˼򻯰ɣ���û�а�initClient����´�GlobalTransactionScanner�����������һ���ࡣ

����initClient����



```
private void initClient() {    //init TM    TMClient.init(applicationId, txServiceGroup);       //init RM    RMClient.init(applicationId, txServiceGroup);      registerSpringShutdownHook();}
```









initClient�߼��������ӣ���������TMClient.init��ʼ��TransactionManager��RPC�ͻ��ˣ�RMClient.init��ʼ��ResourceManager��RPC�ͻ��ˡ�seata��RPC����netty��ʵ�֣�seata��װ����һ��ʹ�á���ע����һ��Spring��ShutdownHook���Ӻ���

**2.3.1 TMClient��ʼ��**



```
@Overridepublic void init() {    timerExecutor.scheduleAtFixedRate(new Runnable() {        @Override        public void run() {            clientChannelManager.reconnect(getTransactionServiceGroup());        }    }, SCHEDULE_DELAY_MILLS, SCHEDULE_INTERVAL_MILLS, TimeUnit.MILLISECONDS);...}
```









������һ����ʱ�����Ͻ�����������������
clientChannelManager.reconnect������������



```
void reconnect(String transactionServiceGroup) {    List<String> availList = null;    try {        availList = getAvailServerList(transactionServiceGroup);    } catch (Exception e) {       ...    }   ...    for (String serverAddress : availList) {        try {            acquireChannel(serverAddress);        } catch (Exception e) {            ...        }    }}
```









����transactionServiceGroup��ȡseata-server��ip��ַ�б�Ȼ���������



```
private List<String> getAvailServerList(String transactionServiceGroup) throws Exception {    List<InetSocketAddress> availInetSocketAddressList = RegistryFactory.getInstance()        .lookup(transactionServiceGroup);    if (CollectionUtils.isEmpty(availInetSocketAddressList)) {        return Collections.emptyList();    }     return availInetSocketAddressList.stream()        .map(NetUtil::toStringAddress)        .collect(Collectors.toList());}
```









RegistryFactory.getInstance().lookup(transactionServiceGroup);�ǶԲ�ͬע��������������ģ�Ĭ�Ͽ���Nacos��ʽ��ʵ��![SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������ϣ�-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/745b802128d80980a6e082f91406451526cbb3.jpg "SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������ϣ�-��Դ�����������")�ȸ�����������ҵ�����������server��Ⱥ���ƣ�������default��Ȼ����ݼ�Ⱥ�����ҵ�server��Ӧip�˿ڵ�ַ



```
@Overridepublic List<InetSocketAddress> lookup(String key) throws Exception {    //default    String clusterName = getServiceGroup(key);    if (clusterName == null) {        return null;    }    if (!LISTENER_SERVICE_MAP.containsKey(clusterName)) {        synchronized (LOCK_OBJ) {            if (!LISTENER_SERVICE_MAP.containsKey(clusterName)) {                List<String> clusters = new ArrayList<>();                clusters.add(clusterName);                List<Instance> firstAllInstances = getNamingInstance().getAllInstances(getServiceName(), getServiceGroup(), clusters);                if (null != firstAllInstances) {                    List<InetSocketAddress> newAddressList = firstAllInstances.stream()                        .filter(instance -> instance.isEnabled() && instance.isHealthy())                        .map(instance -> new InetSocketAddress(instance.getIp(), instance.getPort()))                        .collect(Collectors.toList());                    CLUSTER_ADDRESS_MAP.put(clusterName, newAddressList);                }                subscribe(clusterName, event -> {                    List<Instance> instances = ((NamingEvent) event).getInstances();                    if (null == instances && null != CLUSTER_ADDRESS_MAP.get(clusterName)) {                        CLUSTER_ADDRESS_MAP.remove(clusterName);                    } else if (!CollectionUtils.isEmpty(instances)) {                        List<InetSocketAddress> newAddressList = instances.stream()                            .filter(instance -> instance.isEnabled() && instance.isHealthy())                            .map(instance -> new InetSocketAddress(instance.getIp(), instance.getPort()))                            .collect(Collectors.toList());                        CLUSTER_ADDRESS_MAP.put(clusterName, newAddressList);                    }                });            }        }    }    return CLUSTER_ADDRESS_MAP.get(clusterName);}
```









Seata-server��IP��ַ�ѻ�ȡ��,Ȼ�����acquireChannel



```
Channel acquireChannel(String serverAddress) {    Channel channelToServer = channels.get(serverAddress);    if (channelToServer != null) {        channelToServer = getExistAliveChannel(channelToServer, serverAddress);        if (channelToServer != null) {            return channelToServer;        }    }...    channelLocks.putIfAbsent(serverAddress, new Object());    synchronized (channelLocks.get(serverAddress)) {        return doConnect(serverAddress);    }}
```









��󽫻�ȡ����seata-server��IP��ַ�ŵ�Netty�з�װ��TmClient�ͳ�ʼ�����

TmClient��ʼ���ܽ᣺

*   ������ʱ�������Խ���һ������seata-server
*   ����ʱ���ȴ�nacos�������������ã��и��ݷ�������(service_group)�ҵ���Ⱥ����(cluster_name)
*   �ٸ��ݼ�Ⱥ�����ҵ���Ⱥip�˿��б�
*   ��ip�б���ѡ��һ����netty��������
    **2.3.2 RMClient��ʼ��**



```
public static void init(String applicationId, String transactionServiceGroup) {    // ��ȡ��������    RmRpcClient rmRpcClient = RmRpcClient.getInstance(applicationId, transactionServiceGroup);    // ����ResourceManager�ĵ�������    rmRpcClient.setResourceManager(DefaultResourceManager.get());    // ��Ӽ�����������Server�˵���Ϣ����    rmRpcClient.setClientMessageListener(new RmMessageListener(DefaultRMHandler.get()));    // ��ʼ��RPC    rmRpcClient.init();}
```









��TMClient��ȣ�RMClient�����һ������Server����Ϣ������Ļ��ơ�Ҳ����˵TM��ְ��������������Server��ͨ�ţ����磺ȫ�������begin��commit��rollback�ȡ�

��RM������������������Դ�⣬������Ϊȫ�������commit��rollback�ȵ���Ϣ���ͣ��Ӷ��Ա�����Դ������ز�����

������Դ������resourceManager��������Ϣ�ص����������ڽ���TC�ڶ��׶η������ύ���߻ع�����Seata�ж�ResourceManager��AbstractRMHandler����SPI���䣬��ResouceManagerΪ����



```
public class DefaultResourceManager implements ResourceManager {    protected void initResourceManagers() {        //init all resource managers        List<ResourceManager> allResourceManagers = EnhancedServiceLoader.loadAll(ResourceManager.class);        if (CollectionUtils.isNotEmpty(allResourceManagers)) {            for (ResourceManager rm : allResourceManagers) {                resourceManagers.put(rm.getBranchType(), rm);            }        }    }}
```









���Կ�����ʼ��DefaultResouceManagerʱ��ʹ��ClassLoaderȥ���ض�ӦJar�µ�ʵ�֣���Ĭ��ATģʽʹ�õ�ʵ�������ݿ⣬Ҳ����rm-datasource���µ�ʵ�֣���ʵ����·����Ҫ��λ��/resources/META-INF/��չ�ӿ�ȫ·��ȥ�ң��ͻ��ҵ���Ӧ��ʵ���� ![SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������ϣ�-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/84399f558194f3dce18275c72cb9a92219db25.jpg "SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������ϣ�-��Դ�����������")ResourceManager��Ӧʵ����ȫ·��
io.seata.rm.datasource.DataSourceManager��������ָ�������ύ�ͻع��ķ�����DefaultRMHandler��Ӧʵ����ȫ·��io.seata.rm.RMHandlerAT���Ǹ�����server��Ϣ������Ӧ�ύ���߻ع������Ļص������ࡣ

RMClinet��init()������TMClient����һ��

**2.3.3 �ܽ�**

*   Spring����ʱ����ʼ����2���ͻ���TmClient��RmClient
*   TmClient��seata-serverͨ��Netty�������Ӳ�������Ϣ
*   RmClient��seata-serverͨ��Netty�������ӣ�������ն��׶��ύ���ع���Ϣ���ڻص���(RmHandler)��������

���� | һ��ߣJava
��Դ |����ͷ��

**2.4 AbstractAutoProxyCreator**
GlobalTransactionScanner��ʼ������TM��RM�Ժ������ٹ�עһ��AbstractAutoProxyCreator���Զ�����

�Զ�����������ɶ�����أ�����˵����spring�е�Bean��ǿ��ʲô���ܣ�

GlobalTransactionScanner��Ҫ��չ��AbstractAutoProxyCreator��wrapIfNecessary

������ǿ��ǰ���жϴ�����ʾ�Ƿ��Bean��Ҫ��ǿ�������ǿ�Ļ�����������

**2.4.1 wrapIfNecessary**



```
@Overrideprotected Object wrapIfNecessary(Object bean, String beanName, Object cacheKey) {    if (disableGlobalTransaction) {        return bean;    }    try {        synchronized (PROXYED_SET) {            // ��ͬBean����            if (PROXYED_SET.contains(beanName)) {                return bean;            }             interceptor = null;            // �ж��Ƿ���TCCģʽ            if (TCCBeanParserUtils.isTccAutoProxy(bean, beanName, applicationContext)) {                // TCCʵ�ֵ�������                interceptor = new TccActionInterceptor(TCCBeanParserUtils.getRemotingDesc(beanName));            } else {                Class<?> serviceInterface = SpringProxyUtils.findTargetClass(bean);                Class<?>[] interfacesIfJdk = SpringProxyUtils.findInterfaces(bean);                 // �ж��Ƿ����@GlobalTransactional����@GlobalLockע��                if (!existsAnnotation(new Class[]{serviceInterface})                    && !existsAnnotation(interfacesIfJdk)) {                    return bean;                }                 if (interceptor == null) {                    // ��TCC��������                    if (globalTransactionalInterceptor == null) {                        globalTransactionalInterceptor = new GlobalTransactionalInterceptor(failureHandlerHook);                        ConfigurationCache.addConfigListener(                            ConfigurationKeys.DISABLE_GLOBAL_TRANSACTION,                            (ConfigurationChangeListener)globalTransactionalInterceptor);                    }                    interceptor = globalTransactionalInterceptor;                }            }            // �жϵ�ǰBean�Ƿ��Ѿ���spring�Ĵ�������            if (!AopUtils.isAopProxy(bean)) {                // ��������ǣ���ô��һ��spring�Ĵ�����̼���                bean = super.wrapIfNecessary(bean, beanName, cacheKey);            } else {                // �����һ��spring�Ĵ����࣬��ô�����ȡ���������Ѿ����ڵ����������ϣ�Ȼ����ӵ��ü��ϵ���                AdvisedSupport advised = SpringProxyUtils.getAdvisedSupport(bean);                Advisor[] advisor = buildAdvisors(beanName, getAdvicesAndAdvisorsForBean(null, null, null));                for (Advisor avr : advisor) {                    advised.addAdvisor(0, avr);                }            }             PROXYED_SET.add(beanName);            return bean;        }    } catch (Exception exx) {}}
```









wrapIfNecessary�����ϳ����Ƿֲ��迴��

1��isTccAutoProxy�ж��Ƿ���tccģʽ�������Ļ�ѡ����TccActionInterceptor����������tccģʽѡ��
GlobalTransactionalInterceptor��������Ĭ�ϲ�����

2��existAnnotation�жϵ�ǰBean�Ƿ�������߽ӿڵķ�������@GlobalTransactional����@GlobalLockע�⣬���û����ֱ�ӷ���

3��isAopProxy�������жϵ�ǰ��Bean�Ƿ��Ѿ���spring�Ĵ������ˣ�������JDK��̬������Cglib������������ͨ��Bean����ԭ�е����ɴ����߼����ɣ�����Ѿ��Ǵ����࣬��ôҪͨ�������ȡ��������ڵ�����������Ҳ����Advisor��ֱ����ӵ��ü��ϵ��С�

wrapIfNecessary�ķ����������ӣ���������Դ����Ǻ���Ϥ�����ϸ�ڵ����Щ����

**2.4.1.1 ATһ�׶ο���ȫ������**
����Ҫ����ȫ���������Ľӿ��ϣ����@GlobalTransactionalע�⣬���ע�����һ����Ӧ����������������
GlobalTransactionalInterceptor��invoke�������ط���



```
@Overridepublic Object invoke(final MethodInvocation methodInvocation) throws Throwable {    Class<?> targetClass =        methodInvocation.getThis() != null ? AopUtils.getTargetClass(methodInvocation.getThis()) : null;    Method specificMethod = ClassUtils.getMostSpecificMethod(methodInvocation.getMethod(), targetClass);    if (specificMethod != null && !specificMethod.getDeclaringClass().equals(Object.class)) {        final Method method = BridgeMethodResolver.findBridgedMethod(specificMethod);        //��ȡ�����ϵ�ȫ������ע��        final GlobalTransactional globalTransactionalAnnotation =            getAnnotation(method, targetClass, GlobalTransactional.class);        //��ȡ�����ϵ�ȫ����ע��        final GlobalLock globalLockAnnotation = getAnnotation(method, targetClass, GlobalLock.class);        boolean localDisable = disable || (degradeCheck && degradeNum >= degradeCheckAllowTimes);        if (!localDisable) {            //�����������ȫ������ע�⣬����handleGlobalTransaction����ȫ������            if (globalTransactionalAnnotation != null) {                return handleGlobalTransaction(methodInvocation, globalTransactionalAnnotation);            //�����������ȫ����ע�⣬����handleGlobalLock����ȫ����            } else if (globalLockAnnotation != null) {                return handleGlobalLock(methodInvocation);            }        }    }    //���ɶ��û�У�����ͨ����ִ�У���������    return methodInvocation.proceed();}
```









��handleGlobalTransaction�����е�����
transactionalTemplate.execute����



```
// 2\. ����ȫ������beginTransactionbeginTransaction(txInfo, tx); Object rs = null;try {     // ִ��ҵ�񷽷�business.execute()    rs = business.execute(); } catch (Throwable ex) {     // 3.�����쳣ִ��completeTransactionAfterThrowing�ع�    completeTransactionAfterThrowing(txInfo, tx, ex);    throw ex;} // 4\. û���쳣�ύ����commitTransactioncommitTransaction(tx);
```









����ȫ���������յ���
io.seata.tm.api.DefaultGlobalTransaction#begin(int, java.lang.String)����



```
@Overridepublic void begin(int timeout, String name) throws TransactionException {    //�˴��Ľ�ɫ�ж��йؼ�������//������ǰ��ȫ������ķ����ߣ�Launcher�����ǲ����ߣ�Participant��//����ڷֲ�ʽ���������ϵͳ������Ҳ����GlobalTransactionalע��//��ô���Ľ�ɫ����Participant��������Ժ����begin���˳���    //���ж��Ƿ����ߣ�Launcher�����ǲ����ߣ�Participant���Ǹ��ݵ�ǰ�������Ƿ��Ѵ���XID���ж�    //û��XID�ľ���Launcher���Ѿ�����XID�ľ���Participant    if (role != GlobalTransactionRole.Launcher) {        assertXIDNotNull();        if (LOGGER.isDebugEnabled()) {            LOGGER.debug("Ignore Begin(): just involved in global transaction [{}]", xid);        }        return;    }    assertXIDNull();    if (RootContext.getXID() != null) {        throw new IllegalStateException();    }    xid = transactionManager.begin(null, null, name, timeout);    status = GlobalStatus.Begin;    RootContext.bind(xid);    if (LOGGER.isInfoEnabled()) {        LOGGER.info("Begin new global transaction [{}]", xid);    } }
```









����seata-server��ȡȫ������XID



```
@Overridepublic String begin(String applicationId, String transactionServiceGroup, String name, int timeout)    throws TransactionException {    GlobalBeginRequest request = new GlobalBeginRequest();    request.setTransactionName(name);    request.setTimeout(timeout);    //����    GlobalBeginResponse response = (GlobalBeginResponse) syncCall(request);    if (response.getResultCode() == ResultCode.Failed) {        throw new TmTransactionException(TransactionExceptionCode.BeginFailed, response.getMsg());    }    return response.getXid();}
private AbstractTransactionResponse syncCall(AbstractTransactionRequest request) throws TransactionException {    try {        //TMClient��װ��Netty����        return (AbstractTransactionResponse) TmNettyRemotingClient.getInstance().sendSyncRequest(request);    } catch (TimeoutException toe) {        throw new TmTransactionException(TransactionExceptionCode.IO, "RPC timeout", toe);    }}
```









��XID����RootContext�У��ɴ˿��Կ���ȫ����������TM����ģ�TM����ȫ�����������seata-server����seata-server������ܵ��������������seata������룩��



```
@Overrideprotected void doGlobalBegin(GlobalBeginRequest request, GlobalBeginResponse response, RpcContext rpcContext)    throws TransactionException {    //����begin    response.setXid(core.begin(rpcContext.getApplicationId(), rpcContext.getTransactionServiceGroup(),                               request.getTransactionName(), request.getTimeout()));    if (LOGGER.isInfoEnabled()) {        LOGGER.info("Begin new global transaction applicationId: {},transactionServiceGroup: {}, transactionName: {},timeout:{},xid:{}",                    rpcContext.getApplicationId(), rpcContext.getTransactionServiceGroup(), request.getTransactionName(), request.getTimeout(), response.getXid());    }}
```









io.seata.server.coordinator.DefaultCoordinator#doGlobalBegin�������ܿͻ��˿���ȫ����������󣬵���io.seata.server.coordinator.DefaultCore#begin����ȫ������



```
@Overridepublic String begin(String applicationId, String transactionServiceGroup, String name, int timeout)    throws TransactionException {    GlobalSession session = GlobalSession.createGlobalSession(applicationId, transactionServiceGroup, name,                                                              timeout);    MDC.put(RootContext.MDC_KEY_XID, session.getXid());    session.addSessionLifecycleListener(SessionHolder.getRootSessionManager());//�����Ự    session.begin();     // transaction start event    eventBus.post(new GlobalTransactionEvent(session.getTransactionId(), GlobalTransactionEvent.ROLE_TC,                                             session.getTransactionName(), applicationId, transactionServiceGroup, session.getBeginTime(), null, session.getStatus()));     return session.getXid();}
```









ͨ����ǰ�Ự����



```
@Overridepublic void begin() throws TransactionException {    this.status = GlobalStatus.Begin;    this.beginTime = System.currentTimeMillis();    this.active = true;    for (SessionLifecycleListener lifecycleListener : lifecycleListeners) {        lifecycleListener.onBegin(this);    }}
```









![SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������£�-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/e7c784186f75581eba83325a0fc4708602dadf.jpg "SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������£�-��Դ�����������")

����
io.seata.server.session.AbstractSessionManager#onBegin�������ֵ���io.seata.server.storage.db.session.DataBaseSessionManager#addGlobalSession����



```
@Overridepublic void addGlobalSession(GlobalSession session) throws TransactionException {    if (StringUtils.isBlank(taskName)) {        //����        boolean ret = transactionStoreManager.writeSession(LogOperation.GLOBAL_ADD, session);        if (!ret) {            throw new StoreException("addGlobalSession failed.");        }    } else {        boolean ret = transactionStoreManager.writeSession(LogOperation.GLOBAL_UPDATE, session);        if (!ret) {            throw new StoreException("addGlobalSession failed.");        }    }}
```









���������ݿ���д������



```
@Overridepublic boolean writeSession(LogOperation logOperation, SessionStorable session) {    if (LogOperation.GLOBAL_ADD.equals(logOperation)) {        return logStore.insertGlobalTransactionDO(SessionConverter.convertGlobalTransactionDO(session));    } else if (LogOperation.GLOBAL_UPDATE.equals(logOperation)) {        return logStore.updateGlobalTransactionDO(SessionConverter.convertGlobalTransactionDO(session));    } else if (LogOperation.GLOBAL_REMOVE.equals(logOperation)) {        return logStore.deleteGlobalTransactionDO(SessionConverter.convertGlobalTransactionDO(session));    } else if (LogOperation.BRANCH_ADD.equals(logOperation)) {        return logStore.insertBranchTransactionDO(SessionConverter.convertBranchTransactionDO(session));    } else if (LogOperation.BRANCH_UPDATE.equals(logOperation)) {        return logStore.updateBranchTransactionDO(SessionConverter.convertBranchTransactionDO(session));    } else if (LogOperation.BRANCH_REMOVE.equals(logOperation)) {        return logStore.deleteBranchTransactionDO(SessionConverter.convertBranchTransactionDO(session));    } else {        throw new StoreException("Unknown LogOperation:" + logOperation.name());    }}
```









������seata��global_tab�������ݣ�����ȫ�������ѿ���

**2.4.1.2 ATһ�׶�ִ��ҵ��SQL**
ȫ�������ѿ�����������Ҫִ��ҵ��SQL������undo_log���ݣ�ȫ���������سɹ������ջ���ִ����ҵ�񷽷��ģ���������Seata������Դ���˴�������sql������undo_log��������������Դ������ִ�еģ��������Seata��DataSource��Connection��Statement���Ĵ����װ��



```
/*** ����datasource��������滻ԭ���ĵ�datasource*/@Primary@Bean("dataSource")public DataSourceProxy dataSourceProxy(DataSource druidDataSource){    return new DataSourceProxy(druidDataSource);}
```









��Ŀ��ʹ�õ�����Դ����seata��DataSourceProxy����![SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������£�-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/c8a7a189816e282015a950bfd3c13b7d859974.jpg "SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������£�-��Դ�����������")���ն�Sql���н���������������StatementProxy����



```
@Overridepublic boolean execute(String sql) throws SQLException {    this.targetSQL = sql;    return ExecuteTemplate.execute(this, (statement, args) -> statement.execute((String) args[0]), sql);}
```











```
public static <T, S extends Statement> T execute(List<SQLRecognizer> sqlRecognizers,                                                     StatementProxy<S> statementProxy,                                                     StatementCallback<T, S> statementCallback,                                                     Object... args) throws SQLException {         if (!RootContext.requireGlobalLock() && !StringUtils.equals(BranchType.AT.name(), RootContext.getBranchType())) {            //����ȫ�������ֱ��ִ�У���������            return statementCallback.execute(statementProxy.getTargetStatement(), args);        }         String dbType = statementProxy.getConnectionProxy().getDbType();        if (CollectionUtils.isEmpty(sqlRecognizers)) {            sqlRecognizers = SQLVisitorFactory.get(                    statementProxy.getTargetSQL(),                    dbType);        }        Executor<T> executor;        if (CollectionUtils.isEmpty(sqlRecognizers)) {            executor = new PlainExecutor<>(statementProxy, statementCallback);        } else {            if (sqlRecognizers.size() == 1) {                SQLRecognizer sqlRecognizer = sqlRecognizers.get(0);                //��ͬSQL���ͣ���ͬ����                switch (sqlRecognizer.getSQLType()) {                    case INSERT:                        executor = EnhancedServiceLoader.load(InsertExecutor.class, dbType,                                new Class[]{StatementProxy.class, StatementCallback.class, SQLRecognizer.class},                                new Object[]{statementProxy, statementCallback, sqlRecognizer});                        break;                    case UPDATE:                        executor = new UpdateExecutor<>(statementProxy, statementCallback, sqlRecognizer);                        break;                    case DELETE:                        executor = new DeleteExecutor<>(statementProxy, statementCallback, sqlRecognizer);                        break;                    case SELECT_FOR_UPDATE:                        executor = new SelectForUpdateExecutor<>(statementProxy, statementCallback, sqlRecognizer);                        break;                    default:                        executor = new PlainExecutor<>(statementProxy, statementCallback);                        break;                }            } else {                executor = new MultiExecutor<>(statementProxy, statementCallback, sqlRecognizers);            }        }        T rs;        try {            //ִ��SQL            rs = executor.execute(args);        } catch (Throwable ex) {            if (!(ex instanceof SQLException)) {                // Turn other exception into SQLException                ex = new SQLException(ex);            }            throw (SQLException) ex;        }        return rs;    }
```









*   ���ж��Ƿ�����ȫ���������û�У����ߴ���������sql����������
*   ����SQLVisitorFactory��Ŀ��sql���н���
*   ����ض�����sql����(INSERT,UPDATE,DELETE,SELECT_FOR_UPDATE)�Ƚ����������
*   ִ��sql�����ؽ��
    ��ͬ���͵�SQL��������һ����������insertΪ��

![SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������£�-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/b1eb1b610beb647b230995f19ecbb4bbc98602.jpg "SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������£�-��Դ�����������")insertʹ�õ���InsertExecutor.execute����������ʵ���ջ���ʹ��
io.seata.rm.datasource.exec.BaseTransactionalExecutor#execute����



```
@Overridepublic T execute(Object... args) throws Throwable {    if (RootContext.inGlobalTransaction()) {        String xid = RootContext.getXID();        statementProxy.getConnectionProxy().bind(xid);    }     statementProxy.getConnectionProxy().setGlobalLockRequire(RootContext.requireGlobalLock());    return doExecute(args);}
```









���������е�xid�󶨵���statementProxy�У���������doExecute����������AbstractDMLBaseExecutor�е�doExecute����



```
@Overridepublic T doExecute(Object... args) throws Throwable {    AbstractConnectionProxy connectionProxy = statementProxy.getConnectionProxy();    if (connectionProxy.getAutoCommit()) {        return executeAutoCommitTrue(args);    } else {        return executeAutoCommitFalse(args);    }}
```









�����е�����
executeAutoCommitTrue/executeAutoCommitFalse



```
protected T executeAutoCommitTrue(Object[] args) throws Throwable {    ConnectionProxy connectionProxy = statementProxy.getConnectionProxy();    try {        connectionProxy.setAutoCommit(false);        return new LockRetryPolicy(connectionProxy).execute(() -> {            T result = executeAutoCommitFalse(args);            connectionProxy.commit();            return result;        });    } catch (Exception e) {        ...    } finally {        connectionProxy.getContext().reset();        connectionProxy.setAutoCommit(true);    }}
```









����ϸ���֣����ն��ǵ���executeAutoCommitFalse����



```
protected T executeAutoCommitFalse(Object[] args) throws Exception {    //����getTableMeta����    if (!JdbcConstants.MYSQL.equalsIgnoreCase(getDbType()) && getTableMeta().getPrimaryKeyOnlyName().size() > 1)    {        throw new NotSupportYetException("multi pk only support mysql!");    }    //��ȡbeforeImage    TableRecords beforeImage = beforeImage();    //ִ��ҵ��sql    T result = statementCallback.execute(statementProxy.getTargetStatement(), args);    //��ȡafterImage    TableRecords afterImage = afterImage(beforeImage);    //����image    prepareUndoLog(beforeImage, afterImage);    return result;}
```









��ȡbeforeImage



```
//tableMeta��������������С�����������protected TableMeta getTableMeta(String tableName) {    if (tableMeta != null) {        return tableMeta;    }    ConnectionProxy connectionProxy = statementProxy.getConnectionProxy();    tableMeta = TableMetaCacheFactory.getTableMetaCache(connectionProxy.getDbType())        .getTableMeta(connectionProxy.getTargetConnection(), tableName, connectionProxy.getDataSourceProxy().getResourceId());    return tableMeta;}
```









ִ��ҵ��sql����ʹ��
com.alibaba.druid.pool.DruidPooledPreparedStatement#execute����ִ��

��ȡafterImage![SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������£�-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/540ff5c254dde029bed208247025e97bd1f497.jpg "SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������£�-��Դ�����������")���ύ����ʱ������undo_log��־



```
protected T executeAutoCommitTrue(Object[] args) throws Throwable {    ConnectionProxy connectionProxy = statementProxy.getConnectionProxy();    try {        connectionProxy.setAutoCommit(false);        return new LockRetryPolicy(connectionProxy).execute(() -> {            T result = executeAutoCommitFalse(args);            //����            connectionProxy.commit();            return result;        });    } catch (Exception e) {        ...    } finally {        connectionProxy.getContext().reset();        connectionProxy.setAutoCommit(true);    }}
```











```
public void commit() throws SQLException {    try {        LOCK_RETRY_POLICY.execute(() -> {            //����            doCommit();            return null;        });    } catch (SQLException e) {        throw e;    } catch (Exception e) {        throw new SQLException(e);    }}
```











```
private void doCommit() throws SQLException {    if (context.inGlobalTransaction()) {        //����        processGlobalTransactionCommit();    } else if (context.isGlobalLockRequire()) {        processLocalCommitWithGlobalLocks();    } else {        targetConnection.commit();    }}
```











```
private void processGlobalTransactionCommit() throws SQLException {    try {        //��seata-serverע���֧��Ϣ        register();    } catch (TransactionException e) {        recognizeLockKeyConflictException(e, context.buildLockKeys());    }    try {        //�ύ����֮ǰ������undo_log,����flushUndoLogs        UndoLogManagerFactory.getUndoLogManager(this.getDbType()).flushUndoLogs(this);        targetConnection.commit();    } catch (Throwable ex) {       ...    }    if (IS_REPORT_SUCCESS_ENABLE) {        report(true);    }    context.reset();}
```











```
public void flushUndoLogs(ConnectionProxy cp) throws SQLException {    ConnectionContext connectionContext = cp.getContext();    if (!connectionContext.hasUndoLog()) {        return;    }     String xid = connectionContext.getXid();    long branchId = connectionContext.getBranchId();     ...//�÷�������undo_log    insertUndoLogWithNormal(xid, branchId, buildContext(parser.getName()), undoLogContent,                            cp.getTargetConnection());}
```









�ڸ÷�����ע���֧����![SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������£�-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/92309a950c73829078a3170c585fc58fb03b0d.jpg "SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������£�-��Դ�����������")�ύ������seata-serverע���֧��Ϣ��seata-server���յ�����seataԴ�룩![SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������£�-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/c116df5929a1116e61e683298e14b953450bb7.jpg "SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������£�-��Դ�����������")

io.seata.server.coordinator.DefaultCoordinator#doBranchRegister����



```
public Long branchRegister(BranchType branchType, String resourceId, String clientId, String xid,                           String applicationData, String lockKeys) throws TransactionException {    GlobalSession globalSession = assertGlobalSessionNotNull(xid, false);    return SessionHolder.lockAndExecute(globalSession, () -> {        ...        try {            //����ע��            globalSession.addBranch(branchSession);        } catch (RuntimeException ex) {            ...        }        ...        return branchSession.getBranchId();    });}
```











```
@Overridepublic void addBranch(BranchSession branchSession) throws TransactionException {    for (SessionLifecycleListener lifecycleListener : lifecycleListeners) {        //����onAddBranch��ѡ��AbstractSessionManager        lifecycleListener.onAddBranch(this, branchSession);    }    branchSession.setStatus(BranchStatus.Registered);    add(branchSession);}
```









io.seata.server.storage.db.session.DataBaseSessionManager#addBranchSession����



```
@Overridepublic void onAddBranch(GlobalSession globalSession, BranchSession branchSession) throws TransactionException {    //���룬ѡ��DataBaseSessionManager    addBranchSession(globalSession, branchSession);}
```











```
@Overridepublic void addBranchSession(GlobalSession globalSession, BranchSession session) throws TransactionException {    if (StringUtils.isNotBlank(taskName)) {        return;    }    //����    boolean ret = transactionStoreManager.writeSession(LogOperation.BRANCH_ADD, session);    if (!ret) {        throw new StoreException("addBranchSession failed.");    }}
```











```
@Overridepublic boolean writeSession(LogOperation logOperation, SessionStorable session) {    if (LogOperation.GLOBAL_ADD.equals(logOperation)) {        return logStore.insertGlobalTransactionDO(SessionConverter.convertGlobalTransactionDO(session));    } else if (LogOperation.GLOBAL_UPDATE.equals(logOperation)) {        return logStore.updateGlobalTransactionDO(SessionConverter.convertGlobalTransactionDO(session));    } else if (LogOperation.GLOBAL_REMOVE.equals(logOperation)) {        return logStore.deleteGlobalTransactionDO(SessionConverter.convertGlobalTransactionDO(session));    } else if (LogOperation.BRANCH_ADD.equals(logOperation)) {        return logStore.insertBranchTransactionDO(SessionConverter.convertBranchTransactionDO(session));    } else if (LogOperation.BRANCH_UPDATE.equals(logOperation)) {        return logStore.updateBranchTransactionDO(SessionConverter.convertBranchTransactionDO(session));    } else if (LogOperation.BRANCH_REMOVE.equals(logOperation)) {        return logStore.deleteBranchTransactionDO(SessionConverter.convertBranchTransactionDO(session));    } else {        throw new StoreException("Unknown LogOperation:" + logOperation.name());    }}
```











```
@Overridepublic boolean insertBranchTransactionDO(BranchTransactionDO branchTransactionDO) {    String sql = LogStoreSqlsFactory.getLogStoreSqls(dbType).getInsertBranchTransactionSQL(branchTable);    Connection conn = null;    PreparedStatement ps = null;    try {        int index = 1;        conn = logStoreDataSource.getConnection();        conn.setAutoCommit(true);        ps = conn.prepareStatement(sql);        ps.setString(index++, branchTransactionDO.getXid());        ps.setLong(index++, branchTransactionDO.getTransactionId());        ps.setLong(index++, branchTransactionDO.getBranchId());        ps.setString(index++, branchTransactionDO.getResourceGroupId());        ps.setString(index++, branchTransactionDO.getResourceId());        ps.setString(index++, branchTransactionDO.getBranchType());        ps.setInt(index++, branchTransactionDO.getStatus());        ps.setString(index++, branchTransactionDO.getClientId());        ps.setString(index++, branchTransactionDO.getApplicationData());        return ps.executeUpdate() > 0;    } catch (SQLException e) {        throw new StoreException(e);    } finally {        IOUtil.close(ps, conn);    }}
```









Seata-server��ӷ�֧��Ϣ��ɣ������һ�׶ν�����ҵ�����ݣ�undo_log����֧��Ϣ���Ѿ�д�����ݿ�

**2.4.1.3 AT���׶��ύ**
�ص�handleGlobalTransaction�����У�������
transactionalTemplate.execute����



```
// 2\. ����ȫ������beginTransactionbeginTransaction(txInfo, tx); Object rs = null;try {     // ִ��ҵ�񷽷�business.execute()    rs = business.execute(); } catch (Throwable ex) {     //������һ�׶�    //�����Ƕ��׶�    // 3.�����쳣ִ��completeTransactionAfterThrowing�ع�    completeTransactionAfterThrowing(txInfo, tx, ex);    throw ex;} // 4\. û���쳣�ύ����commitTransactioncommitTransaction(tx);
```









���׶��ύ

commitTransaction(tx);����



```
private void commitTransaction(GlobalTransaction tx) throws TransactionalExecutor.ExecutionException {    try {        triggerBeforeCommit();        //����        tx.commit();        triggerAfterCommit();    } catch (TransactionException txe) {        // 4.1 Failed to commit        throw new TransactionalExecutor.ExecutionException(tx, txe,                                                           TransactionalExecutor.Code.CommitFailure);    }}
```









![SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������£�-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/61b35980530bd17bff9025f1112baa9e3e93e5.jpg "SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������£�-��Դ�����������")



```
@Overridepublic GlobalStatus commit(String xid) throws TransactionException {    GlobalCommitRequest globalCommit = new GlobalCommitRequest();    globalCommit.setXid(xid);    //����syncCall    GlobalCommitResponse response = (GlobalCommitResponse) syncCall(globalCommit);    return response.getGlobalStatus();}
```











```
private AbstractTransactionResponse syncCall(AbstractTransactionRequest request) throws TransactionException {    try {        return (AbstractTransactionResponse) TmNettyRemotingClient.getInstance().sendSyncRequest(request);    } catch (TimeoutException toe) {        throw new TmTransactionException(TransactionExceptionCode.IO, "RPC timeout", toe);    }}
```









����ͨ��TM����seata-server��Seata-server���յ�ȫ���ύ����seataԴ�룩

DefaultCoordinator��



```
@Overrideprotected void doGlobalCommit(GlobalCommitRequest request, GlobalCommitResponse response, RpcContext rpcContext)    throws TransactionException {    MDC.put(RootContext.MDC_KEY_XID, request.getXid());    //����commit    response.setGlobalStatus(core.commit(request.getXid()));}
```









![SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������£�-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/185262d74acd3a723a7770d5771c19fa9fa5cf.jpg "SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������£�-��Դ�����������")![SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������£�-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/51249f8944b29b9ffc82897a818cb4c33ed06a.png "SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������£�-��Դ�����������")![SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������£�-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/14a2f2b58ad3f11be518376d5e6f68cc678af9.jpg "SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������£�-��Դ�����������")
Seata-server���յ��ͻ���ȫ���ύ������Ȼص��ͻ��ˣ�ɾ��undo_log��seata��ɾ����֧��ȫ������

֮ǰ˵��RMClient�ڳ�ʼ��ʱ��������Դ������resourceManager��������Ϣ�ص����������ڽ���TC�ڶ��׶η������ύ���߻ع�����![SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������£�-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/884c07085b1230a1aab1883d691532ccf6b79c.png "SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������£�-��Դ�����������")Seata-serverɾ����֧���ݼ�ȫ����������



```
@Overridepublic void removeBranch(BranchSession branchSession) throws TransactionException {    // do not unlock if global status in (Committing, CommitRetrying, AsyncCommitting),    // because it's already unlocked in 'DefaultCore.commit()'    if (status != Committing && status != CommitRetrying && status != AsyncCommitting) {        if (!branchSession.unlock()) {            throw new TransactionException("Unlock branch lock failed, xid = " + this.xid + ", branchId = " + branchSession.getBranchId());        }    }    for (SessionLifecycleListener lifecycleListener : lifecycleListeners) {        //����        lifecycleListener.onRemoveBranch(this, branchSession);    }    remove(branchSession);}
```











```
private void writeSession(LogOperation logOperation, SessionStorable sessionStorable) throws TransactionException {    if (!transactionStoreManager.writeSession(logOperation, sessionStorable)) {        if (LogOperation.GLOBAL_ADD.equals(logOperation)) {            throw new GlobalTransactionException(TransactionExceptionCode.FailedWriteSession,                                                 "Fail to store global session");        } else if (LogOperation.GLOBAL_UPDATE.equals(logOperation)) {            throw new GlobalTransactionException(TransactionExceptionCode.FailedWriteSession,                                                 "Fail to update global session");        } else if (LogOperation.GLOBAL_REMOVE.equals(logOperation)) {            throw new GlobalTransactionException(TransactionExceptionCode.FailedWriteSession,                                                 "Fail to remove global session");        } else if (LogOperation.BRANCH_ADD.equals(logOperation)) {            throw new BranchTransactionException(TransactionExceptionCode.FailedWriteSession,                                                 "Fail to store branch session");        } else if (LogOperation.BRANCH_UPDATE.equals(logOperation)) {            throw new BranchTransactionException(TransactionExceptionCode.FailedWriteSession,                                                 "Fail to update branch session");        } else if (LogOperation.BRANCH_REMOVE.equals(logOperation)) {            throw new BranchTransactionException(TransactionExceptionCode.FailedWriteSession,                                                 "Fail to remove branch session");        } else {            throw new BranchTransactionException(TransactionExceptionCode.FailedWriteSession,                                                 "Unknown LogOperation:" + logOperation.name());        }    }}
```











```
public static void endCommitted(GlobalSession globalSession) throws TransactionException {    globalSession.changeStatus(GlobalStatus.Committed);    //ɾ��ȫ������    globalSession.end();}
```









�ͻ���ɾ��undo_log����

�ڽ����ύ����



```
protected void doBranchCommit(BranchCommitRequest request, BranchCommitResponse response)    throws TransactionException {    String xid = request.getXid();    long branchId = request.getBranchId();    String resourceId = request.getResourceId();    String applicationData = request.getApplicationData();    if (LOGGER.isInfoEnabled()) {        LOGGER.info("Branch committing: " + xid + " " + branchId + " " + resourceId + " " + applicationData);    }    //����    BranchStatus status = getResourceManager().branchCommit(request.getBranchType(), xid, branchId, resourceId,                                                            applicationData);    response.setXid(xid);    response.setBranchId(branchId);    response.setBranchStatus(status);    if (LOGGER.isInfoEnabled()) {        LOGGER.info("Branch commit result: " + status);    } }
```









getResourceManager��ȡ�ľ���RMClient��ʼ��ʱ���õ���Դ������DataSourceManager



```
public BranchStatus branchCommit(BranchType branchType, String xid, long branchId, String resourceId,                                 String applicationData) throws TransactionException {    return asyncWorker.branchCommit(branchType, xid, branchId, resourceId, applicationData);}
```











```
@Overridepublic BranchStatus branchCommit(BranchType branchType, String xid, long branchId, String resourceId,                                 String applicationData) throws TransactionException {    if (!ASYNC_COMMIT_BUFFER.offer(new Phase2Context(branchType, xid, branchId, resourceId, applicationData))) {        LOGGER.warn("Async commit buffer is FULL. Rejected branch [{}/{}] will be handled by housekeeping later.", branchId, xid);    }    return BranchStatus.PhaseTwo_Committed;}
```









���ֻ����һ��ASYNC_COMMIT_BUFFER����List��������һ�����׶��ύ��context���������ύ��AsyncWorker��init()����



```
public synchronized void init() {    LOGGER.info("Async Commit Buffer Limit: {}", ASYNC_COMMIT_BUFFER_LIMIT);    ScheduledExecutorService timerExecutor = new ScheduledThreadPoolExecutor(1, new NamedThreadFactory("AsyncWorker", 1, true));    timerExecutor.scheduleAtFixedRate(() -> {        try {//����            doBranchCommits();         } catch (Throwable e) {            LOGGER.info("Failed at async committing ... {}", e.getMessage());         }    }, 10, 1000 * 1, TimeUnit.MILLISECONDS);}
```









![SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������£�-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/a730eb7781ec4bd3ad2578fb7855aa02d45fbc.jpg "SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������£�-��Դ�����������")ɾ��Undo_log

**���׶λع�**

���׶λع�seata-server�˴�������׶��ύ���ƣ�����ʡ��



```
protected void doGlobalRollback(GlobalRollbackRequest request, GlobalRollbackResponse response,                                RpcContext rpcContext) throws TransactionException {    MDC.put(RootContext.MDC_KEY_XID, request.getXid());    //ȫ�ֻع�sea����������    response.setGlobalStatus(core.rollback(request.getXid()));}
```









��Ҫ���ع��ͻ�����ν������񲹳�



```
@Overridepublic BranchRollbackResponse handle(BranchRollbackRequest request) {    BranchRollbackResponse response = new BranchRollbackResponse();    exceptionHandleTemplate(new AbstractCallback<BranchRollbackRequest, BranchRollbackResponse>() {        @Override        public void execute(BranchRollbackRequest request, BranchRollbackResponse response)            throws TransactionException {            //����            doBranchRollback(request, response);        }    }, request, response);    return response;}
```











```
public BranchStatus branchRollback(BranchType branchType, String xid, long branchId, String resourceId,                                   String applicationData) throws TransactionException {    DataSourceProxy dataSourceProxy = get(resourceId);    if (dataSourceProxy == null) {        throw new ShouldNeverHappenException();    }    try {        UndoLogManagerFactory.getUndoLogManager(dataSourceProxy.getDbType()).undo(dataSourceProxy, xid, branchId);    } catch (TransactionException te) {        StackTraceLogger.info(LOGGER, te,                              "branchRollback failed. branchType:[{}], xid:[{}], branchId:[{}], resourceId:[{}], applicationData:[{}]. reason:[{}]",                              new Object[]{branchType, xid, branchId, resourceId, applicationData, te.getMessage()});        if (te.getCode() == TransactionExceptionCode.BranchRollbackFailed_Unretriable) {            return BranchStatus.PhaseTwo_RollbackFailed_Unretryable;        } else {            return BranchStatus.PhaseTwo_RollbackFailed_Retryable;        }    }    return BranchStatus.PhaseTwo_Rollbacked; }
```









���ջع��������õ���UndoLogManager.undo(dataSourceProxy, xid, branchId);![SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������£�-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/4842a0701546824cf2720855d8310a1274c576.jpg "SpringCloud Alibabaϵ�С���17Seata ATģʽԴ��������£�-��Դ�����������")�ж�undolog�Ƿ���ڣ�������ɾ����Ӧundolog����һ���ύ������seata��ATģʽԴ�������ϡ�

# �ο�����
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud
https://github.com/macrozheng/springcloud-learning