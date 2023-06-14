# 1. RocketMQ 简介

RocketMQ 是阿里巴巴开源的分布式消息中间件。支持事务消息、顺序消息、批量消息、定时消息、消息回溯等。它里面有几个区别于标准消息中件间的概念，如Group、Topic、Queue等。系统组成则由Producer、Consumer、Broker、NameServer等。

RocketMQ 特点

- 支持发布/订阅（Pub/Sub）和点对点（P2P）消息模型；
- 在一个队列中可靠的先进先出（FIFO）和严格的顺序传递，RocketMQ 可以保证严格的消息顺序，而ActiveMQ 无法保证；
- 支持拉（Pull）和推（Push）两种消息模式；Push 好理解，比如在消费者端设置 Listener 回调；而 Pull，控制权在于应用，即应用需要主动的调用拉消息方法从 Broker 获取消息，这里面存在一个消费位置记录的问题（如果不记录，会导致消息重复消费）；
- 单一队列百万消息的堆积能力；RocketMQ 提供亿级消息的堆积能力，这不是重点，重点是堆积了亿级的消息后，依然保持写入低延迟；
- 支持多种消息协议，如 JMS、MQTT 等；
- 分布式高可用的部署架构，满足至少一次消息传递语义；RocketMQ 原生就是支持分布式的，而ActiveMQ 原生存在单点性；
- 提供 docker 镜像用于隔离测试和云集群部署；
- 提供配置、指标和监控等功能丰富的 Dashboard。

Broker

Broker 其实就是 RocketMQ 服务器，负责存储消息、转发消息。Broker 在 RocketMQ 系统中负责接收从生产者发送来的消息并存储、同时为消费者的拉取请求作准备。Broker 也存储消息相关的元数据，包括消费者组、消费进度偏移和主题和队列消息等。

Broker Server 是 RocketMQ 真正的业务核心，包含了多个重要的子模块：

- 路由模块：整个 Broker 的实体，负责处理来自 clients 端的请求。
- 客户端管理：负责管理客户端(Producer/Consumer)和维护 Consumer 的 Topic 订阅信息
- 存储服务：提供方便简单的 API 接口处理消息存储到物理硬盘和查询功能。
- 高可用服务：高可用服务，提供 Master Broker 和 Slave Broker 之间的数据同步功能。
- 消息索引服务：根据特定的 Message key 对投递到 Broker 的消息进行索引服务，以提供消息的快速查询。

NameServer

NameServer 是一个非常简单的 Topic 路由注册中心，其角色类似 Dubbo 中的 zookeeper，支持 Broker 的动态注册与发现。

主要包括两个功能：

- Broker 管理：NameServer 接受 Broker 集群的注册信息并且保存下来作为路由信息的基本数据。然后提供心跳检测机制，检查 Broker 是否还存活；
- 路由信息管理：给 Producer 和 Consumer 提供服务获取 Broker 列表。每个 NameServer 将保存关于 Broker 集群的整个路由信息和用于客户端查询的队列信息。然后 Producer 和 Conumser 通过 NameServer 就可以知道整个 Broker 集群的路由信息，从而进行消息的投递和消费。


Topic（主题）相当于一种类型的消息，比如可以设置 Topic1 专门是分销的业务， Topic2 专门是优惠券的业务；而 Group（分组）相当于对生产者和消费者的分组，那我们的微服务既能做生产者也能做消费者，比如可以设置 Group1 是商品的微服务，Group2 是订单的微服务，当然还要区分下是生产者分组还是消费者分组。

- Group：分为ProducerGroup 和 ConsumerGroup, 代表某一类的生产者和消费者，一般来说同一个服务可以作为 Group，同一个 Group 一般来说发送和消费的消息都是一样的。
- Topic：消息主题，一级消息类型，生产者向其发送消息，消费者读取其消息。
- Queue: 分为读和写两种队列，一般来说读写队列数量一致，如果不一致就会出现很多问题。

Topic 中有分为了多个 Queue，这其实是我们发送/读取消息通道的最小单位。我们发送消息都需要指定某个写入某个 Queue，拉取消息的时候也需要指定拉取某个 Queue，所以我们的顺序消息可以基于我们的 Queue 维度保持队列有序，如果想做到全局有序那么需要将 Queue 大小设置为1，这样所有的数据都会在 Queue 中有序。



作者：白菜说技术
链接：https://juejin.cn/post/6930869079217717256
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

# 参考文章
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud