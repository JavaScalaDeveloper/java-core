# һ��Nacos����������ͼ

![���������ͼƬ����](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/b5b4ef0330dc4882b0fc2f73994face7.png "���������ͼƬ����")

�������Լ�����һ�����̣�Ҳ���Բο���[Nacos����ע��Դ���������ͼ](https://blog.csdn.net/Saintmm/article/details/121981184)

# ������Դ�����

spring-cloud-commons���ж�����һ�׷����ֵĹ淶�������߼���`DiscoveryClient`�ӿ��У�
![���������ͼƬ����](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/75ebfd400023456faaafd95e7d9cdbf7.png "���������ͼƬ����")
����Spring Cloudʵ�ַ����ֵ��������ʵ��`DiscoveryClient`�ӿڣ�nacos-discovery���µ�`NacosDiscoveryClient`��ʵ��`DiscoveryClient`�ӿڡ�
![���������ͼƬ����](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/0c330a7ce5c744c4a2b25dc024b2430f.png "���������ͼƬ����")

# �����ͻ��˷�����

> 1����nacos�ͻ�����?����֮����ֻ��ȥ������ע�ᡢ���û�ȡ�Ȳ���������������ȥ���������Ϣ��
> 2������һ������ʱ�򣬲Ż�ȥ��ȡ���񣬼�`�����ػ���`��

#### 1���ȴӱ��ػ���serviceInfoMap�л�ȡ����ʵ����Ϣ����ȡ������ͨ��`NamingProxy`����Nacos ����˻�ȡ����ʵ����Ϣ���������ʱ����ÿ���������� ��ȡʵ����Ϣ�б�������±��ػ���serviceInfoMap��

```
// NacosDiscoveryClient#getInstances()
public List<ServiceInstance> getInstances(String serviceId) {
    try {
        // ͨ��NacosNamingService��ȡ�����Ӧ��ʵ����Ϣ�����ȥ
        List<Instance> instances = discoveryProperties.namingServiceInstance()
                .selectInstances(serviceId, true);
        return hostToServiceInstanceList(instances, serviceId);
    } catch (Exception e) {
        throw new RuntimeException(
                "Can not get hosts from nacos server. serviceId: " + serviceId, e);
    }
}

// NacosNamingService#selectInstances()
public List<Instance> selectInstances(String serviceName, boolean healthy) throws NacosException {
    return selectInstances(serviceName, new ArrayList<String>(), healthy);
}
public List<Instance> selectInstances(String serviceName, List<String> clusters, boolean healthy)
    throws NacosException {
    // Ĭ���߶���ģʽ
    return selectInstances(serviceName, clusters, healthy, true);
}
public List<Instance> selectInstances(String serviceName, List<String> clusters, boolean healthy,
                                      boolean subscribe) throws NacosException {
    // Ĭ�ϲ�ѯDEFAULT_GROUP�µķ���ʵ����Ϣ
    return selectInstances(serviceName, Constants.DEFAULT_GROUP, clusters, healthy, subscribe);
}
public List<Instance> selectInstances(String serviceName, String groupName, List<String> clusters, boolean healthy, boolean subscribe) throws NacosException {

    ServiceInfo serviceInfo;
    // Ĭ���߶���ģʽ����subscribeΪTRUE
    if (subscribe) {
        serviceInfo = hostReactor.getServiceInfo(NamingUtils.getGroupedName(serviceName, groupName), StringUtils.join(clusters, ","));
    } else {
        serviceInfo = hostReactor.getServiceInfoDirectlyFromServer(NamingUtils.getGroupedName(serviceName, groupName), StringUtils.join(clusters, ","));
    }
    return selectInstances(serviceInfo, healthy);
}
```

`HostReactor#getServiceInfo()`������������ȡ����ʵ����Ϣ�ĵط���

```
public ServiceInfo getServiceInfo(final String serviceName, final String clusters) {

    NAMING_LOGGER.debug("failover-mode: " + failoverReactor.isFailoverSwitch());
    String key = ServiceInfo.getKey(serviceName, clusters);
    if (failoverReactor.isFailoverSwitch()) {
        return failoverReactor.getService(key);
    }

    // 1���ӱ��ػ���serviceInfoMap�л�ȡʵ����Ϣ
    ServiceInfo serviceObj = getServiceInfo0(serviceName, clusters);

    // 2��������ػ�����û�У�����HTTP���ô�Nacos����˻�ȡ
    if (null == serviceObj) {
        serviceObj = new ServiceInfo(serviceName, clusters);

        serviceInfoMap.put(serviceObj.getKey(), serviceObj);

        updatingMap.put(serviceName, new Object());
        updateServiceNow(serviceName, clusters);
        updatingMap.remove(serviceName);

    } else if (updatingMap.containsKey(serviceName)) {

        if (UPDATE_HOLD_INTERVAL > 0) {
            // hold a moment waiting for update finish
            synchronized (serviceObj) {
                try {
                    serviceObj.wait(UPDATE_HOLD_INTERVAL);
                } catch (InterruptedException e) {
                    NAMING_LOGGER.error("[getServiceInfo] serviceName:" + serviceName + ", clusters:" + clusters, e);
                }
            }
        }
    }

    // 3������һ����ʱ����ÿ��һ���Nacos����˻�ȡ���µķ���ʵ����Ϣ�����µ����ػ���seriveInfoMap��
    scheduleUpdateIfAbsent(serviceName, clusters);

    // 4�� �ӱ��ػ���serviceInfoMap�л�ȡ����ʵ����Ϣ
    return serviceInfoMap.get(serviceObj.getKey());
}
```

1���ӱ��ػ����л�ȡ����ʵ����Ϣ��

```
private ServiceInfo getServiceInfo0(String serviceName, String clusters) {

    String key = ServiceInfo.getKey(serviceName, clusters);

    return serviceInfoMap.get(key);
}
```

2������HTTP���ô�Nacos����˻�ȡ����ʵ����Ϣ��

```
public void updateServiceNow(String serviceName, String clusters) {
    ServiceInfo oldService = getServiceInfo0(serviceName, clusters);
    try {

        // ͨ��NamingProxy��HTTP�ӿڵ��ã���ȡ����ʵ����Ϣ
        String result = serverProxy.queryList(serviceName, clusters, pushReceiver.getUDPPort(), false);
        if (StringUtils.isNotEmpty(result)) {
            // ���±��ػ���serviceInfoMap
            processServiceJSON(result);
        }
    } catch (Exception e) {
        NAMING_LOGGER.error("[NA] failed to update serviceName: " + serviceName, e);
    } finally {
        if (oldService != null) {
            synchronized (oldService) {
                oldService.notifyAll();
            }
        }
    }
}
```

3������һ����ʱ����ÿ��һ���Nacos����˻�ȡ���µķ���ʵ����Ϣ�����µ����ػ���seriveInfoMap�У�

```
public void scheduleUpdateIfAbsent(String serviceName, String clusters) {
    if (futureMap.get(ServiceInfo.getKey(serviceName, clusters)) != null) {
        return;
    }

    synchronized (futureMap) {
        if (futureMap.get(ServiceInfo.getKey(serviceName, clusters)) != null) {
            return;
        }

        // ������ʱ����
        ScheduledFuture<?> future = addTask(new UpdateTask(serviceName, clusters));
        futureMap.put(ServiceInfo.getKey(serviceName, clusters), future);
    }
}

// ��ʱ����ִ���߼���UpdateTask#run()
public void run() {
    try {
        ServiceInfo serviceObj = serviceInfoMap.get(ServiceInfo.getKey(serviceName, clusters));

        if (serviceObj == null) {
            updateServiceNow(serviceName, clusters);
            executor.schedule(this, DEFAULT_DELAY, TimeUnit.MILLISECONDS);
            return;
        }

        if (serviceObj.getLastRefTime() <= lastRefTime) {
            updateServiceNow(serviceName, clusters);
            serviceObj = serviceInfoMap.get(ServiceInfo.getKey(serviceName, clusters));
        } else {
            // if serviceName already updated by push, we should not override it
            // since the push data may be different from pull through force push
            refreshOnly(serviceName, clusters);
        }

        // ����һ����ʱ����1s֮��ִ��
        executor.schedule(this, serviceObj.getCacheMillis(), TimeUnit.MILLISECONDS);

        lastRefTime = serviceObj.getLastRefTime();
    } catch (Throwable e) {
        NAMING_LOGGER.warn("[NA] failed to update serviceName: " + serviceName, e);
    }

}
```

��ѯ����ʵ���б�

```
public String queryList(String serviceName, String clusters, int udpPort, boolean healthyOnly)
    throws NacosException {

    final Map<String, String> params = new HashMap<String, String>(8);
    params.put(CommonParams.NAMESPACE_ID, namespaceId);
    params.put(CommonParams.SERVICE_NAME, serviceName);
    params.put("clusters", clusters);
    params.put("udpPort", String.valueOf(udpPort));
    params.put("clientIP", NetUtils.localIP());
    params.put("healthyOnly", String.valueOf(healthyOnly));

    return reqAPI(UtilAndComs.NACOS_URL_BASE + "/instance/list", params, HttpMethod.GET);
}
```

#### 2����HostReactorʵ������ʱ���ʵ����PushReceiver����������һ���߳���ѭ��ͨ��`DatagramSocket#receive()`����Nacos������з���ʵ����Ϣ����������UDP֪ͨ��

```
public class PushReceiver implements Runnable {
    private DatagramSocket udpSocket;

    public PushReceiver(HostReactor hostReactor) {
        try {
            this.hostReactor = hostReactor;
            udpSocket = new DatagramSocket();
            // ����һ���߳�
            executorService = new ScheduledThreadPoolExecutor(1, new ThreadFactory() {
                @Override
                public Thread newThread(Runnable r) {
                    Thread thread = new Thread(r);
                    thread.setDaemon(true);
                    thread.setName("com.alibaba.nacos.naming.push.receiver");
                    return thread;
                }
            });

            executorService.execute(this);
        } catch (Exception e) {
            NAMING_LOGGER.error("[NA] init udp socket failed", e);
        }
    }

    public void run() {
        while (true) {
            try {
                // byte[] is initialized with 0 full filled by default
                byte[] buffer = new byte[UDP_MSS];
                DatagramPacket packet = new DatagramPacket(buffer, buffer.length);

                // ����Nacos����˷���ʵ����Ϣ������֪ͨ
                udpSocket.receive(packet);

                String json = new String(IoUtils.tryDecompress(packet.getData()), "UTF-8").trim();
                NAMING_LOGGER.info("received push data: " + json + " from " + packet.getAddress().toString());

                PushPacket pushPacket = JSON.parseObject(json, PushPacket.class);
                String ack;
                if ("dom".equals(pushPacket.type) || "service".equals(pushPacket.type)) {
                    hostReactor.processServiceJSON(pushPacket.data);

                    // send ack to server
                    ack = "{\"type\": \"push-ack\""
                        + ", \"lastRefTime\":\"" + pushPacket.lastRefTime
                        + "\", \"data\":" + "\"\"}";
                } else if ("dump".equals(pushPacket.type)) {
                    // dump data to server
                    ack = "{\"type\": \"dump-ack\""
                        + ", \"lastRefTime\": \"" + pushPacket.lastRefTime
                        + "\", \"data\":" + "\""
                        + StringUtils.escapeJavaScript(JSON.toJSONString(hostReactor.getServiceInfoMap()))
                        + "\"}";
                } else {
                    // do nothing send ack only
                    ack = "{\"type\": \"unknown-ack\""
                        + ", \"lastRefTime\":\"" + pushPacket.lastRefTime
                        + "\", \"data\":" + "\"\"}";
                }

                udpSocket.send(new DatagramPacket(ack.getBytes(Charset.forName("UTF-8")),
                    ack.getBytes(Charset.forName("UTF-8")).length, packet.getSocketAddress()));
            } catch (Exception e) {
                NAMING_LOGGER.error("[NA] error while receiving push data", e);
            }
        }
    }

}
```

# �ġ�����˷�����

Nacos����˵ķ�������Ҫ�������£�

> 1����ѯ����ʵ���б��ȴӻ���serviceMap���ҵ�service��Ӧ��Cluster���ٴ�Cluster������Set��`persistentInstances`��`ephemeralInstances`��ȡȫ����ʵ����Ϣ��
> 2�����ͻ��˴�����ip��udp�˿ںż���ӵ�`clientMap`���������������ͣ�clientMap����`NamingSubscriberService`��ʵ����`NamingSubscriberServiceV1Impl`����key��service name��value�Ƕ����˸÷���Ŀͻ����б�(ip+�˿ں�)��

��naming��Ŀ�µ� InstanceController���list()������

#### 1����ȡ����ʵ���б�

```
@GetMapping("/list")
@Secured(parser = NamingResourceParser.class, action = ActionTypes.READ)
public Object list(HttpServletRequest request) throws Exception {

    String namespaceId = WebUtils.optional(request, CommonParams.NAMESPACE_ID, Constants.DEFAULT_NAMESPACE_ID);
    String serviceName = WebUtils.required(request, CommonParams.SERVICE_NAME);
    NamingUtils.checkServiceNameFormat(serviceName);

    String agent = WebUtils.getUserAgent(request);
    String clusters = WebUtils.optional(request, "clusters", StringUtils.EMPTY);
    String clientIP = WebUtils.optional(request, "clientIP", StringUtils.EMPTY);
    int udpPort = Integer.parseInt(WebUtils.optional(request, "udpPort", "0"));
    boolean healthyOnly = Boolean.parseBoolean(WebUtils.optional(request, "healthyOnly", "false"));

    boolean isCheck = Boolean.parseBoolean(WebUtils.optional(request, "isCheck", "false"));

    String app = WebUtils.optional(request, "app", StringUtils.EMPTY);
    String env = WebUtils.optional(request, "env", StringUtils.EMPTY);
    String tenant = WebUtils.optional(request, "tid", StringUtils.EMPTY);

    Subscriber subscriber = new Subscriber(clientIP + ":" + udpPort, agent, app, clientIP, namespaceId, serviceName,
            udpPort, clusters);
    // ��ȥInstanceOperatorServiceImpl#listInstance()������ȡ����ʵ���б�
    return getInstanceOperator().listInstance(namespaceId, serviceName, subscriber, clusters, healthyOnly);
}

//InstanceOperatorServiceImpl#listInstance()
public ServiceInfo listInstance(String namespaceId, String serviceName, Subscriber subscriber, String cluster,
            boolean healthOnly) throws Exception {
        ClientInfo clientInfo = new ClientInfo(subscriber.getAgent());
        String clientIP = subscriber.getIp();
        ServiceInfo result = new ServiceInfo(serviceName, cluster);
        Service service = serviceManager.getService(namespaceId, serviceName);
        long cacheMillis = switchDomain.getDefaultCacheMillis();

        // now try to enable the push
        try {
            // �����������ͷ���UdpPushService��������ʵ����Ϣ�������ʱͨ��UDP�ķ�ʽ֪ͨNacos Client
            if (subscriber.getPort() > 0 && pushService.canEnablePush(subscriber.getAgent())) {
                subscriberServiceV1.addClient(namespaceId, serviceName, cluster, subscriber.getAgent(),
                        new InetSocketAddress(clientIP, subscriber.getPort()), pushDataSource, StringUtils.EMPTY,
                        StringUtils.EMPTY);
                cacheMillis = switchDomain.getPushCacheMillis(serviceName);
            }
        } catch (Exception e) {
            Loggers.SRV_LOG.error("[NACOS-API] failed to added push client {}, {}:{}", clientInfo, clientIP,
                    subscriber.getPort(), e);
            cacheMillis = switchDomain.getDefaultCacheMillis();
        }

        if (service == null) {
            if (Loggers.SRV_LOG.isDebugEnabled()) {
                Loggers.SRV_LOG.debug("no instance to serve for service: {}", serviceName);
            }
            result.setCacheMillis(cacheMillis);
            return result;
        }

        // �������Ƿ����
        checkIfDisabled(service);

        // �����ǻ�ȡ����ע����Ϣ�Ĺؼ����룬��ȡ�������ú���ʱ����ʵ��
        List<com.alibaba.nacos.naming.core.Instance> srvedIps = service
                .srvIPs(Arrays.asList(StringUtils.split(cluster, StringUtils.COMMA)));

        // filter ips using selector��ѡ�������˷���
        if (service.getSelector() != null && StringUtils.isNotBlank(clientIP)) {
            srvedIps = selectorManager.select(service.getSelector(), clientIP, srvedIps);
        }

        // ����Ҳ��������򷵻ص�ǰ����
        if (CollectionUtils.isEmpty(srvedIps)) {
        .......
        return result;
    }

// Service#srvIPs()
public List<Instance> srvIPs(List<String> clusters) {
    if (CollectionUtils.isEmpty(clusters)) {
        clusters = new ArrayList<>();
        clusters.addAll(clusterMap.keySet());
    }
    return allIPs(clusters);
}

// Service#allIPs()
public List<Instance> allIPs(List<String> clusters) {
    List<Instance> result = new ArrayList<>();
    for (String cluster : clusters) {
        // ����ע���ʱ�򣬻Ὣʵ����Ϣд��clusterMap�У����ڴ�����ȡ
        Cluster clusterObj = clusterMap.get(cluster);
        if (clusterObj == null) {
            continue;
        }

        result.addAll(clusterObj.allIPs());
    }
    return result;
}

// Cluster#allIPs()
public List<Instance> allIPs() {
    List<Instance> allInstances = new ArrayList<>();
    // ��ȡ���������еĳ־û�ʵ��
    allInstances.addAll(persistentInstances);
    // ��ȡ���������е���ʱʵ��
    allInstances.addAll(ephemeralInstances);
    return allInstances;
}
```

#### 2������UDP��ʽ������ʵ������

NamingSubscriberServiceV1Impl#addClient()��

```
public void addClient(String namespaceId, String serviceName, String clusters, String agent,
        InetSocketAddress socketAddr, DataSource dataSource, String tenant, String app) {

    // ��ʼ�����Ϳͻ���ʵ��PushClient
    PushClient client = new PushClient(namespaceId, serviceName, clusters, agent, socketAddr, dataSource, tenant,
            app);
    // �������Ŀ��ͻ���
    addClient(client);
}

// ���ط���addClient()
public void addClient(PushClient client) {
    // client is stored by key 'serviceName' because notify event is driven by serviceName change
    // �ͻ����ɼ��� serviceName���洢����Ϊ֪ͨ�¼���serviceName��������
    String serviceKey = UtilsAndCommons.assembleFullServiceName(client.getNamespaceId(), client.getServiceName());
    ConcurrentMap<String, PushClient> clients = clientMap.get(serviceKey);
    // �����ȡ�����ͻ�������õ�ServiceName��Ӧ�����Ϳͻ��ˣ����½����Ϳͻ��ˣ�������
    if (clients == null) {
        clientMap.putIfAbsent(serviceKey, new ConcurrentHashMap<>(1024));
        clients = clientMap.get(serviceKey);
    }

    PushClient oldClient = clients.get(client.toString());
    // �����ϵ�PushClient����ˢ��
    if (oldClient != null) {
        oldClient.refresh();
    } else {
        // ���򻺴�PushClient
        PushClient res = clients.putIfAbsent(client.toString(), client);
        if (res != null) {
            Loggers.PUSH.warn("client: {} already associated with key {}", res.getAddrStr(), res);
        }
        Loggers.PUSH.debug("client: {} added for serviceName: {}", client.getAddrStr(), client.getServiceName());
    }
}
```

# �塢�ܽ�

�ͻ��ˣ�

> 1�����ȴӱ��ػ����л�ȡ����ʵ����Ϣ��
> 2��ά����ʱ����ʱ��Nacos����˻�ȡ����ʵ����Ϣ��

����ˣ�

> 1������ָ�������ռ����ڴ�ע��������е�����ʵ������ʱʵ�����ͻ��ˣ�
> 2������һ��UDP����ʵ����Ϣ������ͷ���


# �ο�����
https://developer.aliyun.com/article/1058262
https://ost.51cto.com/posts/14835
https://developer.aliyun.com/article/1048465
https://zhuanlan.zhihu.com/p/70478036
https://juejin.cn/post/6999814668390760484#heading-8