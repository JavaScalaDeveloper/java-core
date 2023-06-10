1. RocketMQ ���

RocketMQ �ǰ���ͰͿ�Դ�ķֲ�ʽ��Ϣ�м����֧��������Ϣ��˳����Ϣ��������Ϣ����ʱ��Ϣ����Ϣ���ݵȡ��������м��������ڱ�׼��Ϣ�м���ĸ����Group��Topic��Queue�ȡ�ϵͳ�������Producer��Consumer��Broker��NameServer�ȡ�

RocketMQ �ص�

- ֧�ַ���/���ģ�Pub/Sub���͵�Ե㣨P2P����Ϣģ�ͣ�
- ��һ�������пɿ����Ƚ��ȳ���FIFO�����ϸ��˳�򴫵ݣ�RocketMQ ���Ա�֤�ϸ����Ϣ˳�򣬶�ActiveMQ �޷���֤��
- ֧������Pull�����ƣ�Push��������Ϣģʽ��Push ����⣬�����������߶����� Listener �ص����� Pull������Ȩ����Ӧ�ã���Ӧ����Ҫ�����ĵ�������Ϣ������ Broker ��ȡ��Ϣ�����������һ������λ�ü�¼�����⣨�������¼���ᵼ����Ϣ�ظ����ѣ���
- ��һ���а�����Ϣ�Ķѻ�������RocketMQ �ṩ�ڼ���Ϣ�Ķѻ��������ⲻ���ص㣬�ص��Ƕѻ����ڼ�����Ϣ����Ȼ����д����ӳ٣�
- ֧�ֶ�����ϢЭ�飬�� JMS��MQTT �ȣ�
- �ֲ�ʽ�߿��õĲ���ܹ�����������һ����Ϣ�������壻RocketMQ ԭ������֧�ֲַ�ʽ�ģ���ActiveMQ ԭ�����ڵ����ԣ�
- �ṩ docker �������ڸ�����Ժ��Ƽ�Ⱥ����
- �ṩ���á�ָ��ͼ�صȹ��ܷḻ�� Dashboard��

Broker

Broker ��ʵ���� RocketMQ ������������洢��Ϣ��ת����Ϣ��Broker �� RocketMQ ϵͳ�и�����մ������߷���������Ϣ���洢��ͬʱΪ�����ߵ���ȡ������׼����Broker Ҳ�洢��Ϣ��ص�Ԫ���ݣ������������顢���ѽ���ƫ�ƺ�����Ͷ�����Ϣ�ȡ�

Broker Server �� RocketMQ ������ҵ����ģ������˶����Ҫ����ģ�飺

- ·��ģ�飺���� Broker ��ʵ�壬���������� clients �˵�����
- �ͻ��˹����������ͻ���(Producer/Consumer)��ά�� Consumer �� Topic ������Ϣ
- �洢�����ṩ����򵥵� API �ӿڴ�����Ϣ�洢������Ӳ�̺Ͳ�ѯ���ܡ�
- �߿��÷��񣺸߿��÷����ṩ Master Broker �� Slave Broker ֮�������ͬ�����ܡ�
- ��Ϣ�������񣺸����ض��� Message key ��Ͷ�ݵ� Broker ����Ϣ���������������ṩ��Ϣ�Ŀ��ٲ�ѯ��

NameServer

NameServer ��һ���ǳ��򵥵� Topic ·��ע�����ģ����ɫ���� Dubbo �е� zookeeper��֧�� Broker �Ķ�̬ע���뷢�֡�

��Ҫ�����������ܣ�

- Broker ����NameServer ���� Broker ��Ⱥ��ע����Ϣ���ұ���������Ϊ·����Ϣ�Ļ������ݡ�Ȼ���ṩ���������ƣ���� Broker �Ƿ񻹴�
- ·����Ϣ������ Producer �� Consumer �ṩ�����ȡ Broker �б�ÿ�� NameServer ��������� Broker ��Ⱥ������·����Ϣ�����ڿͻ��˲�ѯ�Ķ�����Ϣ��Ȼ�� Producer �� Conumser ͨ�� NameServer �Ϳ���֪������ Broker ��Ⱥ��·����Ϣ���Ӷ�������Ϣ��Ͷ�ݺ����ѡ�

2. ʹ�� Docker ���ٴ RocketMQ 4.4

rocketmq ��Ҫ���� broker �� nameserver �����ǵ��ֿ�����Ƚ��鷳�����ｫ��ʹ�� docker-compose�����⣬����Ҫ�һ�� web ���ӻ�����̨�����Լ�� mq ����״̬���Լ���Ϣ�������������ʹ�� rocketmq-console��ͬ���ó���Ҳ��ʹ�� docker ��װ��

1. �� linux ��������ѡ�񲢽���Ŀ¼��

   mkdir rocketmq-docker
   ���ƴ���

1. ���� rocketmq-docker Ŀ¼������һ����Ϊ broker.conf �������ļ����������£�

   # ������Ⱥ���ƣ�����ڵ�϶�������ö��
   brokerClusterName = DefaultCluster
   # broker���ƣ�master��slaveʹ����ͬ�����ƣ��������ǵ����ӹ�ϵ
   brokerName = broker-a
   # 0��ʾMaster������0��ʾ��ͬ��slave
   brokerId = 0
   # ��ʾ��������Ϣɾ��������Ĭ�����賿4��
   deleteWhen = 04
   # �ڴ����ϱ�����Ϣ��ʱ������λ��Сʱ
   fileReservedTime = 48
   # ������ֵ��SYNC_MASTER��ASYNC_MASTER��SLAVE��ͬ�����첽��ʾMaster��Slave֮��ͬ�����ݵĻ��ƣ�
   brokerRole = ASYNC_MASTER
   # ˢ�̲��ԣ�ȡֵΪ��ASYNC_FLUSH��SYNC_FLUSH��ʾͬ��ˢ�̺��첽ˢ�̣�SYNC_FLUSH��Ϣд����̺�ŷ��سɹ�״̬��ASYNC_FLUSH����Ҫ��
   flushDiskType = ASYNC_FLUSH
   # ����broker�ڵ����ڷ�������ip��ַ
   # brokerIP1 = 192.168.138.131
   ���ƴ���

ע�⣺����� brokerIP1 ��������ã�����Ĭ�ϻ��Ϊ docker �����ڲ�IP�����������Ӳ��ϡ�

1. ������ rocketmq-docker Ŀ¼������һ����Ϊ rocketmq.yaml �Ľű��ļ���



rocketmq.yaml ��������:

    version: '2'
    services:
      namesrv:
        image: rocketmqinc/rocketmq
        container_name: rmqnamesrv
        ports:
          - 9876:9876
        volumes:
          - /docker/rocketmq/data/namesrv/logs:/home/rocketmq/logs
          - /docker/rocketmq/data/namesrv/store:/home/rocketmq/store
        command: sh mqnamesrv
      broker:
        image: rocketmqinc/rocketmq
        container_name: rmqbroker
        ports:
          - 10909:10909
          - 10911:10911
          - 10912:10912
        volumes:
          - /docker/rocketmq/data/broker/logs:/home/rocketmq/logs
          - /docker/rocketmq/data/broker/store:/home/rocketmq/store
          - /docker/rocketmq/conf/broker.conf:/opt/rocketmq-4.4.0/conf/broker.conf
        command: sh mqbroker -n namesrv:9876 -c /opt/rocketmq-4.4.0/conf/broker.conf
        depends_on:
          - namesrv
        environment:
          - JAVA_HOME=/usr/lib/jvm/jre
      console:
        image: styletang/rocketmq-console-ng
        container_name: rocketmq-console-ng
        ports:
          - 8087:8080
        depends_on:
          - namesrv
        environment:
          - JAVA_OPTS= -Dlogging.level.root=info   -Drocketmq.namesrv.addr=rmqnamesrv:9876 
          - Dcom.rocketmq.sendMessageWithVIPChannel=false
    ���ƴ���

1. ���� broker �õ��ķ���ǽ�˿ڣ��������ʹ�ã�

   firewall-cmd --zone=public --add-port=10909-10912/tcp --permanent
   ���ƴ���

1. ִ�� sentinel-dashboard.yaml �ű�����������

   docker-compose -f rocketmq.yaml up
   ���ƴ���

1. ���� rocketmq ����̨�����ǻᷢ�����Ƶ�ͼ����Ȼ��ʼ�϶��ǿյģ���

   http://(��װRocketMQ������IP):8087
   ���ƴ���



1. ����ѡ�� ����Ⱥ�� ��һ����������ܿ����������õ� broker ������IP�ˣ�



�����������������Ѿ���� RocketMQ ����˵Ĳ������ھͿ���ȥ Spring ��Ŀ��ʹ�ÿͻ����ˡ�

3. �� Spring ��Ŀ������ RocketMQ �ͻ���

1. ��� pom �ļ�������

            <dependency>
                <groupId>org.apache.rocketmq</groupId>
                rocketmq-spring-boot-starter
                <version>2.0.4</version>
            </dependency>
   ���ƴ���

1. �� application.yml ������ã�

   server:
   port: 10801

   spring:
   application:
   name: (��Ŀ����)-service

   rocketmq:
   name-server: (��װRocketMQ������IP):9876
   producer:
   group: (��Ŀ����)-group
   ���ƴ���

1. �½�һ����Ϣ������ MessageProducer ��Ϊ��Ϣ�� �����ߣ�

   @Service
   public class MessageProducer implements CommandLineRunner {

        @Resource
        private RocketMQTemplate rocketMQTemplate;
    
        @Override
        public void run(String... args) throws Exception {
            rocketMQTemplate.send("test-topic-1", MessageBuilder.withPayload("Hello, World! I'm from spring message").build());
        }

   }
   ���ƴ���

1. �½�һ����Ϣ������ MessageListener ��Ϊ��Ϣ�� �����ߣ�

   @Slf4j
   @Service
   @RocketMQMessageListener(topic = "test-topic-1", consumerGroup = "my-consumer_test-topic-1")
   public class MessageListener implements RocketMQListener<String> {

        @Override
        public void onMessage(String message) {
            log.info("received message: {}", message);
        }

   }
   ���ƴ���

1. �½�һ�� MessageProducer �ĵ��ÿ������ࣺ

   @RestController
   @RequestMapping
   public class HelloController {

        @Resource
        private MessageProducer messageProducer;
    
        @RequestMapping("/message")
        public void message() throws Exception {
            messageProducer.run("");
        }
   ���ƴ���

1. ���� Spring ��Ŀ������������һ����򵥵���Ϣ����:

   GET http://localhost:10801/message
   Accept: */*
   Cache-Control: no-cache
   ���ƴ���



����Ҳ���� RocketMQ �Ĺ������̨�����¿�����Ϣ�����������



ʵս�������ﲢû�н���һЩ������ܴ�һ��е㷸�Ժ���

Topic�����⣩�൱��һ�����͵���Ϣ������������� Topic1 ר���Ƿ�����ҵ�� Topic2 ר�����Ż�ȯ��ҵ�񣻶� Group�����飩�൱�ڶ������ߺ������ߵķ��飬�����ǵ�΢���������������Ҳ���������ߣ������������ Group1 ����Ʒ��΢����Group2 �Ƕ�����΢���񣬵�Ȼ��Ҫ�������������߷��黹�������߷��顣

- Group����ΪProducerGroup �� ConsumerGroup, ����ĳһ��������ߺ������ߣ�һ����˵ͬһ�����������Ϊ Group��ͬһ�� Group һ����˵���ͺ����ѵ���Ϣ����һ���ġ�
- Topic����Ϣ���⣬һ����Ϣ���ͣ����������䷢����Ϣ�������߶�ȡ����Ϣ��
- Queue: ��Ϊ����д���ֶ��У�һ����˵��д��������һ�£������һ�¾ͻ���ֺܶ����⡣

Topic ���з�Ϊ�˶�� Queue������ʵ�����Ƿ���/��ȡ��Ϣͨ������С��λ�����Ƿ�����Ϣ����Ҫָ��ĳ��д��ĳ�� Queue����ȡ��Ϣ��ʱ��Ҳ��Ҫָ����ȡĳ�� Queue���������ǵ�˳����Ϣ���Ի������ǵ� Queue ά�ȱ��ֶ����������������ȫ��������ô��Ҫ�� Queue ��С����Ϊ1���������е����ݶ����� Queue ������



���ߣ��ײ�˵����
���ӣ�https://juejin.cn/post/6930869079217717256
��Դ��ϡ�����
����Ȩ���������С���ҵת������ϵ���߻����Ȩ������ҵת����ע��������

# �ο�����
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud