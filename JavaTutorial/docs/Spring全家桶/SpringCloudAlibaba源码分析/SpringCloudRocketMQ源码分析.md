### һ��NameServer����

Դ����ڣ�NamesrvStartup#main

##### 1.NamesrvController controller = createNamesrvController(args);

*   ��������в���
*   �����������ö���NamesrvConfig��NettyServerConfig
*   ���� -c ��-p����
*   ���RocketMQ_HOME��������
*   final NamesrvController controller = new NamesrvController(namesrvConfig, nettyServerConfig);����controller
*   controller.getConfiguration().registerConfig(properties); ע������������Ϣ

##### 2.start(controller);

*   controller.initialize()�� ִ�г�ʼ��
    �� this.kvConfigManager.load(); ����KV����
    �� this.remotingServer = new NettyRemotingServer(this.nettyServerConfig, this.brokerHousekeepingService);����NettyServer���紦�����
    �� this.remotingExecutor =Executors.newFixedThreadPool(nettyServerConfig.getServerWorkerThreads(), new ThreadFactoryImpl("RemotingExecutorThread_")); ����Netty�����������̳߳�
    �� this.registerProcessor(); ע��NameServer��Processor ע�ᵽRemotingServer��
    �� NamesrvController.this.routeInfoManager.scanNotActiveBroker() ������ʱ�����Ƴ�����Ծ��Broker
    �� NamesrvController.this.kvConfigManager.printAllPeriodically() ��ʱ��ӡKV������Ϣ
*   Runtime.getRuntime().addShutdownHook ע��رչ��ӣ��ڹرշ���ʱ�ͷ���Դ
*   controller.start()�� ����controller

NameServer��������Ҫ��������
1.ά��broker�ķ����ַ��Ϣ�������и���
2.��Producer��consumer�ṩBroker�ķ����б�





![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/3245844-46ca880d83fb583b.png)



image.png



### ����Broker����

Դ����ڣ�Brokerstartup#main

##### 1.createBrokerController(args)

*   �����ĸ��������ö���BrokerConfig��NettyServerConfig��NettyClientConfig��MessageStoreConfig
*   BrokerConfigֻ���� -c����
*   RocketMq_HOME�����������
*   RemotingUtil.string2SocketAddress(addr) ��namesrvAddr��ַ���в��
*   messageStoreConfig.getBrokerRole() ͨ��BrokerId�ж����ӣ�masterId=0��Deldger��Ⱥ������Broker�ڵ�ID����-1
*   ���� -p��-m���������������Ĳ�����ӵ��ĸ��������ö�����
*   BrokerController controller = new BrokerController ����brokerController�����ĸ����������ഫ��
*   controller.getConfiguration().registerConfig(properties); ����ע�ᣨ���£�����
*   controller.initialize(); ��ʼ��controller
    �� ���ش����ϵ������ļ���topicConfigManager��consumerOffsetManager��subscriptionGroupManager��consumerFilterManager
    �� this.messageStore =new DefaultMessageStore() ������Ϣ�洢���
    �� this.messageStore.load() ���ش����ļ�
    �� this.remotingServer = new NettyRemotingServer ����Netty�������
    �� this.fastRemotingServer = new NettyRemotingServer ���fastRemotingServer��RemotingServer���ܻ�����࣬����VIP�˿�����
    �� ������ǳ�ʼ��һЩ�̳߳�
    �� this.registerProcessor(); brokerע��һЩProcessor������
*   Runtime.getRuntime().addShutdownHook ע��رչ���

##### 2.start(BrokerController controller)

*   this.messageStore.start(); ��������������Ҫ��Ϊ�˽�CommitLog��д���¼��ַ���ComsumeQueue��IndexFile
*   ��������Netty����remotingServer��fastRemotingServer
*   this.fileWatchService.start(); �ļ���������
*   this.brokerOuterAPI.start(); brokerOuterAPI�������Ϊһ��Netty�ͻ��ˣ����ⷢ�������������緢������
*   this.pullRequestHoldService.start(); ����ѯ������ͣ����
*   this.filterServerManager.start(); ʹ��filter���й���
*   BrokerController.this.registerBrokerAll() Broker���ĵ�����ע������,��Ҫ���þ��ǽ�brokerע�ᵽNamesrv��

broker�ĺ������ã�
**1.��Ϊclientʱ����nameServer����������Ϣ�����������״̬���**
**2.��Ϊ�����ʱ�����ڴ洢��Ϣ����Ӧconsumer�˵�����**

### ����Netty����ע����

### �ġ�Broker����ע�����

Դ����ڣ�BrokerController.this.registerBrokerAll(true, false, brokerConfig.isForceRegister())



```
public synchronized void registerBrokerAll(final boolean checkOrderConfig, boolean oneway, boolean forceRegister) {
    TopicConfigSerializeWrapper topicConfigWrapper = this.getTopicConfigManager().buildTopicConfigSerializeWrapper();

    if (!PermName.isWriteable(this.getBrokerConfig().getBrokerPermission())
        || !PermName.isReadable(this.getBrokerConfig().getBrokerPermission())) {
        ConcurrentHashMap<String, TopicConfig> topicConfigTable = new ConcurrentHashMap<String, TopicConfig>();
        for (TopicConfig topicConfig : topicConfigWrapper.getTopicConfigTable().values()) {
            TopicConfig tmp =
                new TopicConfig(topicConfig.getTopicName(), topicConfig.getReadQueueNums(), topicConfig.getWriteQueueNums(),
                                this.brokerConfig.getBrokerPermission());
            topicConfigTable.put(topicConfig.getTopicName(), tmp);
        }
        topicConfigWrapper.setTopicConfigTable(topicConfigTable);
    }
    //������ǱȽϹؼ��ĵط������ж��Ƿ���Ҫע�ᣬȻ�����doRegisterBrokerAll��������ȥע�ᡣ
    if (forceRegister || needRegister(this.brokerConfig.getBrokerClusterName(),
                                      this.getBrokerAddr(),
                                      this.brokerConfig.getBrokerName(),
                                      this.brokerConfig.getBrokerId(),
                                      this.brokerConfig.getRegisterBrokerTimeoutMills())) {
        doRegisterBrokerAll(checkOrderConfig, oneway, topicConfigWrapper);
    }
}

```





```
// Brokerע������ĵĲ���
private void doRegisterBrokerAll(boolean checkOrderConfig, boolean oneway,
                                 TopicConfigSerializeWrapper topicConfigWrapper) {
    // ע��broker����
    List<RegisterBrokerResult> registerBrokerResultList = this.brokerOuterAPI.registerBrokerAll(
        this.brokerConfig.getBrokerClusterName(),
        this.getBrokerAddr(),
        this.brokerConfig.getBrokerName(),
        this.brokerConfig.getBrokerId(),
        this.getHAServerAddr(),
        topicConfigWrapper,
        this.filterServerManager.buildNewFilterServerList(),
        oneway,
        this.brokerConfig.getRegisterBrokerTimeoutMills(),
        this.brokerConfig.isCompressedRegister());

    if (registerBrokerResultList.size() > 0) {
        RegisterBrokerResult registerBrokerResult = registerBrokerResultList.get(0);
        if (registerBrokerResult != null) {
            //ע���걣�����ӽڵ�ĵ�ַ
            if (this.updateMasterHAServerAddrPeriodically && registerBrokerResult.getHaServerAddr() != null) {
                this.messageStore.updateHaMasterAddress(registerBrokerResult.getHaServerAddr());
            }

            this.slaveSynchronize.setMasterAddr(registerBrokerResult.getMasterAddr());

            if (checkOrderConfig) {
                this.getTopicConfigManager().updateOrderTopicConfig(registerBrokerResult.getKvTable());
            }
        }
    }
}

```





```
public List<RegisterBrokerResult> registerBrokerAll(
    final String clusterName,
    final String brokerAddr,
    final String brokerName,
    final long brokerId,
    final String haServerAddr,
    final TopicConfigSerializeWrapper topicConfigWrapper,
    final List<String> filterServerList,
    final boolean oneway,
    final int timeoutMills,
    final boolean compressed) {
    //ʹ��CopyOnWriteArrayList����������ȫ��
    final List<RegisterBrokerResult> registerBrokerResultList = new CopyOnWriteArrayList<>();
    // ��ȡ����nameServer�ĵ�ַ��Ϣ
    List<String> nameServerAddressList = this.remotingClient.getNameServerAddressList();
    if (nameServerAddressList != null && nameServerAddressList.size() > 0) {

        final RegisterBrokerRequestHeader requestHeader = new RegisterBrokerRequestHeader();
        requestHeader.setBrokerAddr(brokerAddr);
        requestHeader.setBrokerId(brokerId);
        requestHeader.setBrokerName(brokerName);
        requestHeader.setClusterName(clusterName);
        requestHeader.setHaServerAddr(haServerAddr);
        requestHeader.setCompressed(compressed);

        RegisterBrokerBody requestBody = new RegisterBrokerBody();
        requestBody.setTopicConfigSerializeWrapper(topicConfigWrapper);
        requestBody.setFilterServerList(filterServerList);
        final byte[] body = requestBody.encode(compressed);
        final int bodyCrc32 = UtilAll.crc32(body);
        requestHeader.setBodyCrc32(bodyCrc32);
        //ͨ��CountDownLatch����֤������NameServer�����ע�����һ�������
        final CountDownLatch countDownLatch = new CountDownLatch(nameServerAddressList.size());
        for (final String namesrvAddr : nameServerAddressList) {
            brokerOuterExecutor.execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        RegisterBrokerResult result = registerBroker(namesrvAddr, oneway, timeoutMills, requestHeader, body);
                        if (result != null) {
                            registerBrokerResultList.add(result);
                        }

                        log.info("register broker[{}]to name server {} OK", brokerId, namesrvAddr);
                    } catch (Exception e) {
                        log.warn("registerBroker Exception, {}", namesrvAddr, e);
                    } finally {
                        countDownLatch.countDown();
                    }
                }
            });
        }

        try {
            countDownLatch.await(timeoutMills, TimeUnit.MILLISECONDS);
        } catch (InterruptedException e) {
        }
    }

    return registerBrokerResultList;
}

```



NameServer��������



```
//NameServer��������ĺ��Ĵ���
@Override
    public RemotingCommand processRequest(ChannelHandlerContext ctx,
                                          RemotingCommand request) throws RemotingCommandException {

    if (ctx != null) {
        log.debug("receive request, {} {} {}",
                  request.getCode(),
                  RemotingHelper.parseChannelRemoteAddr(ctx.channel()),
                  request);
    }

    switch (request.getCode()) {
        case RequestCode.PUT_KV_CONFIG:
            return this.putKVConfig(ctx, request);
        case RequestCode.GET_KV_CONFIG:
            return this.getKVConfig(ctx, request);
        case RequestCode.DELETE_KV_CONFIG:
            return this.deleteKVConfig(ctx, request);
        case RequestCode.QUERY_DATA_VERSION:
            return queryBrokerTopicConfig(ctx, request);
        case RequestCode.REGISTER_BROKER: //Brokerע���������汾Ĭ���ǵ�ǰ��ܰ汾
            Version brokerVersion = MQVersion.value2Version(request.getVersion());
            if (brokerVersion.ordinal() >= MQVersion.Version.V3_0_11.ordinal()) {
                return this.registerBrokerWithFilterServer(ctx, request); //��ǰ�汾
            } else {
                return this.registerBroker(ctx, request);
            }
        case RequestCode.UNREGISTER_BROKER:
            return this.unregisterBroker(ctx, request);
        case RequestCode.GET_ROUTEINFO_BY_TOPIC:
            return this.getRouteInfoByTopic(ctx, request);
        case RequestCode.GET_BROKER_CLUSTER_INFO:
            return this.getBrokerClusterInfo(ctx, request);
        case RequestCode.WIPE_WRITE_PERM_OF_BROKER:
            return this.wipeWritePermOfBroker(ctx, request);
        case RequestCode.GET_ALL_TOPIC_LIST_FROM_NAMESERVER:
            return getAllTopicListFromNameserver(ctx, request);
        case RequestCode.DELETE_TOPIC_IN_NAMESRV:
            return deleteTopicInNamesrv(ctx, request);
        case RequestCode.GET_KVLIST_BY_NAMESPACE:
            return this.getKVListByNamespace(ctx, request);
        case RequestCode.GET_TOPICS_BY_CLUSTER:
            return this.getTopicsByCluster(ctx, request);
        case RequestCode.GET_SYSTEM_TOPIC_LIST_FROM_NS:
            return this.getSystemTopicListFromNs(ctx, request);
        case RequestCode.GET_UNIT_TOPIC_LIST:
            return this.getUnitTopicList(ctx, request);
        case RequestCode.GET_HAS_UNIT_SUB_TOPIC_LIST:
            return this.getHasUnitSubTopicList(ctx, request);
        case RequestCode.GET_HAS_UNIT_SUB_UNUNIT_TOPIC_LIST:
            return this.getHasUnitSubUnUnitTopicList(ctx, request);
        case RequestCode.UPDATE_NAMESRV_CONFIG:
            return this.updateConfig(ctx, request);
        case RequestCode.GET_NAMESRV_CONFIG:
            return this.getConfig(ctx, request);
        default:
            break;
    }
    return null;
}

```



ʵ�ʾ��ǽ�broker��Ϣע�ᵽrouteInfo�У�



```
public RemotingCommand registerBrokerWithFilterServer(ChannelHandlerContext ctx, RemotingCommand request)
    throws RemotingCommandException {
    final RemotingCommand response = RemotingCommand.createResponseCommand(RegisterBrokerResponseHeader.class);
    final RegisterBrokerResponseHeader responseHeader = (RegisterBrokerResponseHeader) response.readCustomHeader();
    final RegisterBrokerRequestHeader requestHeader =
        (RegisterBrokerRequestHeader) request.decodeCommandCustomHeader(RegisterBrokerRequestHeader.class);

    if (!checksum(ctx, request, requestHeader)) {
        response.setCode(ResponseCode.SYSTEM_ERROR);
        response.setRemark("crc32 not match");
        return response;
    }

    RegisterBrokerBody registerBrokerBody = new RegisterBrokerBody();

    if (request.getBody() != null) {
        try {
            registerBrokerBody = RegisterBrokerBody.decode(request.getBody(), requestHeader.isCompressed());
        } catch (Exception e) {
            throw new RemotingCommandException("Failed to decode RegisterBrokerBody", e);
        }
    } else {
        registerBrokerBody.getTopicConfigSerializeWrapper().getDataVersion().setCounter(new AtomicLong(0));
        registerBrokerBody.getTopicConfigSerializeWrapper().getDataVersion().setTimestamp(0);
    }
    //routeInfoManager���ǹ���·����Ϣ�ĺ��������
    RegisterBrokerResult result = this.namesrvController.getRouteInfoManager().registerBroker(
        requestHeader.getClusterName(),
        requestHeader.getBrokerAddr(),
        requestHeader.getBrokerName(),
        requestHeader.getBrokerId(),
        requestHeader.getHaServerAddr(),
        registerBrokerBody.getTopicConfigSerializeWrapper(),
        registerBrokerBody.getFilterServerList(),
        ctx.channel());

    responseHeader.setHaServerAddr(result.getHaServerAddr());
    responseHeader.setMasterAddr(result.getMasterAddr());

    byte[] jsonValue = this.namesrvController.getKvConfigManager().getKVListByNamespace(NamesrvUtil.NAMESPACE_ORDER_TOPIC_CONFIG);
    response.setBody(jsonValue);

    response.setCode(ResponseCode.SUCCESS);
    response.setRemark(null);
    return response;
}

```



### �塢Producer������Ϣ

Դ����ڣ�DefaultMQProducer#start
1.this.defaultMQProducerImpl.start(); ����������



```
public void start(final boolean startFactory) throws MQClientException {
    switch (this.serviceState) {
        case CREATE_JUST:
            // Ĭ�Ͼ���CREATE_JUST
            this.serviceState = ServiceState.START_FAILED;

            this.checkConfig();
            //�޸ĵ�ǰ��instanceNameΪ��ǰ����ID
            if (!this.defaultMQProducer.getProducerGroup().equals(MixAll.CLIENT_INNER_PRODUCER_GROUP)) {
                this.defaultMQProducer.changeInstanceNameToPID();
            }
            //�ͻ��˺��ĵ�MQ�ͻ��˹��� ����������Ϣ�����ߣ�������������������Ϣ�ķ����ߵķ���ע��
            this.mQClientFactory = MQClientManager.getInstance().getOrCreateMQClientInstance(this.defaultMQProducer, rpcHook);
            //ע��MQ�ͻ��˹���ʾ��
            boolean registerOK = mQClientFactory.registerProducer(this.defaultMQProducer.getProducerGroup(), this);
            if (!registerOK) {
                this.serviceState = ServiceState.CREATE_JUST;
                throw new MQClientException("The producer group[" + this.defaultMQProducer.getProducerGroup()
                                            + "] has been created before, specify another name please." + FAQUrl.suggestTodo(FAQUrl.GROUP_NAME_DUPLICATE_URL),
                                            null);
            }

            this.topicPublishInfoTable.put(this.defaultMQProducer.getCreateTopicKey(), new TopicPublishInfo());
            //����ʾ�� --���пͻ������������mQClientFactory����
            if (startFactory) {
                mQClientFactory.start();
            }

            log.info("the producer [{}] start OK. sendMessageWithVIPChannel={}", this.defaultMQProducer.getProducerGroup(),
                     this.defaultMQProducer.isSendMessageWithVIPChannel());
            this.serviceState = ServiceState.RUNNING;
            break;
        case RUNNING:
        case START_FAILED:
        case SHUTDOWN_ALREADY:
            throw new MQClientException("The producer service state not OK, maybe started once, "
                                        + this.serviceState
                                        + FAQUrl.suggestTodo(FAQUrl.CLIENT_SERVICE_NOT_OK),
                                        null);
        default:
            break;
    }
    // �����е�broker��������
    this.mQClientFactory.sendHeartbeatToAllBrokerWithLock();

    this.startScheduledTask();

}

```



### ����Consumer������Ϣ

���Ѷ���ڣ�DefaultMQPushConsumer#start
this.defaultMQPushConsumerImpl.start();



```
public synchronized void start() throws MQClientException {
    switch (this.serviceState) {
        case CREATE_JUST:
            log.info("the consumer [{}] start beginning. messageModel={}, isUnitMode={}", this.defaultMQPushConsumer.getConsumerGroup(),
                     this.defaultMQPushConsumer.getMessageModel(), this.defaultMQPushConsumer.isUnitMode());
            this.serviceState = ServiceState.START_FAILED;

            this.checkConfig();

            this.copySubscription();

            if (this.defaultMQPushConsumer.getMessageModel() == MessageModel.CLUSTERING) {
                this.defaultMQPushConsumer.changeInstanceNameToPID();
            }
            //�ͻ���ʾ��������������Ҳ�ǽ���������������ġ�
            this.mQClientFactory = MQClientManager.getInstance().getOrCreateMQClientInstance(this.defaultMQPushConsumer, this.rpcHook);
            //���ؾ������
            this.rebalanceImpl.setConsumerGroup(this.defaultMQPushConsumer.getConsumerGroup());
            this.rebalanceImpl.setMessageModel(this.defaultMQPushConsumer.getMessageModel());
            this.rebalanceImpl.setAllocateMessageQueueStrategy(this.defaultMQPushConsumer.getAllocateMessageQueueStrategy());
            this.rebalanceImpl.setmQClientFactory(this.mQClientFactory);

            this.pullAPIWrapper = new PullAPIWrapper(
                mQClientFactory,
                this.defaultMQPushConsumer.getConsumerGroup(), isUnitMode());
            this.pullAPIWrapper.registerFilterMessageHook(filterMessageHookList);

            if (this.defaultMQPushConsumer.getOffsetStore() != null) {
                this.offsetStore = this.defaultMQPushConsumer.getOffsetStore();
            } else {
                //��������Կ������㲥ģʽ�뼯Ⱥģʽ������������offset�洢�ĵط���һ����
                switch (this.defaultMQPushConsumer.getMessageModel()) {
                        //�㲥ģʽ���������߱��ش洢offset
                    case BROADCASTING:
                        this.offsetStore = new LocalFileOffsetStore(this.mQClientFactory, this.defaultMQPushConsumer.getConsumerGroup());
                        break;
                        //��Ⱥģʽ����BrokerԶ�˴洢offset
                    case CLUSTERING:
                        this.offsetStore = new RemoteBrokerOffsetStore(this.mQClientFactory, this.defaultMQPushConsumer.getConsumerGroup());
                        break;
                    default:
                        break;
                }
                this.defaultMQPushConsumer.setOffsetStore(this.offsetStore);
            }
            this.offsetStore.load();
            //˳�����Ѽ�������ConsumeMessageOrderlyService
            if (this.getMessageListenerInner() instanceof MessageListenerOrderly) {
                this.consumeOrderly = true;
                this.consumeMessageService =
                    new ConsumeMessageOrderlyService(this, (MessageListenerOrderly) this.getMessageListenerInner());
                //�������Ѽ�������ConsumeMessageConcurrentlyService
            } else if (this.getMessageListenerInner() instanceof MessageListenerConcurrently) {
               this.consumeOrderly = false;
               this.consumeMessageService =
               new ConsumeMessageConcurrentlyService(this, (MessageListenerConcurrently) this.getMessageListenerInner());
            }

           this.consumeMessageService.start();
           //ע�������ߡ������������ƣ��ͻ���ֻҪ��Ҫ��ע�ἴ�ɣ���������mQClientFactoryһ��������
           boolean registerOK = mQClientFactory.registerConsumer(this.defaultMQPushConsumer.getConsumerGroup(), this);
           if (!registerOK) {
               this.serviceState = ServiceState.CREATE_JUST;
               this.consumeMessageService.shutdown(defaultMQPushConsumer.getAwaitTerminationMillisWhenShutdown());
               throw new MQClientException("The consumer group[" + this.defaultMQPushConsumer.getConsumerGroup()
               + "] has been created before, specify another name please." + FAQUrl.suggestTodo(FAQUrl.GROUP_NAME_DUPLICATE_URL),
               null);
           }

           mQClientFactory.start();
           log.info("the consumer [{}] start OK.", this.defaultMQPushConsumer.getConsumerGroup());
           this.serviceState = ServiceState.RUNNING;
           break;
           case RUNNING:
           case START_FAILED:
           case SHUTDOWN_ALREADY:
            throw new MQClientException("The PushConsumer service state not OK, maybe started once, "
                + this.serviceState
                + FAQUrl.suggestTodo(FAQUrl.CLIENT_SERVICE_NOT_OK),null);
           default:
                break;
           }

               this.updateTopicSubscribeInfoWhenSubscriptionChanged();
               this.mQClientFactory.checkClientInBroker();
               this.mQClientFactory.sendHeartbeatToAllBrokerWithLock();
               this.mQClientFactory.rebalanceImmediately();
           }

```



**1��consumer�˵�����ģʽ��**
�� ��Ⱥģʽ����Ⱥģʽ��ÿ��consumer������䲻ͬ����Ϣ
�� �㲥ģʽ���㲥ģʽ��ÿ����Ϣ�����͸�����consumer
**2������offset�洢��**
�� �㲥ģʽ��this.offsetStore = new LocalFileOffsetStore(); �洢��ÿ��consumer��
�� ��Ⱥģʽ��this.offsetStore = new RemoteBrokerOffsetStore(); �洢��broker��



���ߣ���Ҷ�컨
���ӣ�https://www.jianshu.com/p/8dd4cfeae39d
��Դ������
����Ȩ���������С���ҵת������ϵ���߻����Ȩ������ҵת����ע��������
# �ο�����
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud
https://github.com/macrozheng/springcloud-learning