# Nacos��������

## Nacos�������ĵ�ʹ��

�ο��ٷ���[github.com/alibaba/spr��](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Falibaba%2Fspring-cloud-alibaba%2Fwiki%2FNacos-config "https://github.com/alibaba/spring-cloud-alibaba/wiki/Nacos-config")

## Config�������

           Nacos ����ģ�� Key ����Ԫ��Ψһȷ��, NamespaceĬ���ǿմ������������ռ䣨public��������Ĭ���� DEFAULT_GROUP

![image-20230429084711954](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230429084711954.png)

* **֧�����õĶ�̬����**

        ����̬����ˢ��ʱ������µ� Enviroment�У��������ÿ��һ���д�Enviroment�л�ȡ����

```
@SpringBootApplication
public class NacosConfigApplication {

    public static void main(String[] args) throws InterruptedException {
        ConfigurableApplicationContext applicationContext = SpringApplication.run(NacosConfigApplication.class, args);

         while(true) {
        //����̬����ˢ��ʱ������µ� Enviroment�У��������ÿ��һ���д�Enviroment�л�ȡ����
         String userName = applicationContext.getEnvironment().getProperty("common.name");
        String userAge = applicationContext.getEnvironment().getProperty("common.age");
        System.err.println("common name :" + userName + "; age: " + userAge);
            TimeUnit.SECONDS.sleep(1);
        }
    }
}
���ƴ���
```

* **֧��profile���ȵ�����**

  spring-cloud-starter-alibaba-nacos-config �ڼ������õ�ʱ�򣬲������������� dataid Ϊ spring.application.name.{spring.application.name}.spring.application.name.{file-extension:properties} Ϊǰ׺�Ļ������ã���������dataidΪ spring.application.name?{spring.application.name}-spring.application.name?{profile}.file?extension:properties�Ļ������á�

  ���ճ�����������������׻����µĲ�ͬ���ã�����ͨ��Spring�ṩ��{file-extension:properties} �Ļ������á����ճ�����������������׻����µĲ�ͬ���ã�����ͨ��Spring �ṩ�� file?extension:properties�Ļ������á����ճ�����������������׻����µĲ�ͬ���ã�����ͨ��Spring�ṩ��{spring.profiles.active} ��������������á�

```
spring.profiles.active=dev
���ƴ���
```

* **֧���Զ��� namespace ������**

  ���ڽ����⻧���ȵ����ø��롣��ͬ�������ռ��£����Դ�����ͬ�� Group �� Data ID �����á�Namespace �ĳ��ó���֮һ�ǲ�ͬ���������õ����ָ��룬���翪�����Ի����������������ʣ������á����񣩸���ȡ�

  ��û����ȷָ�� ${spring.cloud.nacos.config.namespace} ���õ�����£� Ĭ��ʹ�õ��� Nacos �� Public ���namespace�������Ҫʹ���Զ���������ռ䣬����ͨ������������ʵ�֣�

```
spring.cloud.nacos.config.namespace=71bb9785-231f-4eca-b4dc-6be446e12ff8
���ƴ���
```

* **֧���Զ��� Group ������**

  Group����֯���õ�ά��֮һ��ͨ��һ����������ַ������� Buy �� Trade �������ü����з��飬�Ӷ����� Data ID ��ͬ�����ü��������� Nacos �ϴ���һ������ʱ�����δ��д���÷�������ƣ������÷��������Ĭ�ϲ��� DEFAULT_GROUP �����÷���ĳ�����������ͬ��Ӧ�û����ʹ������ͬ���������ͣ��� database_url ���ú� MQ_topic ���á�

��û����ȷָ�� ${spring.cloud.nacos.config.group} ���õ�����£�Ĭ����DEFAULT_GROUP �������Ҫ�Զ����Լ��� Group������ͨ������������ʵ�֣�

```
spring.cloud.nacos.config.group=DEVELOP_GROUP
���ƴ���
```

* **֧���Զ�����չ�� Data Id ����**

        Data ID ����֯�������õ�ά��֮һ��Data ID ͨ��������֯����ϵͳ�����ü���һ��ϵͳ����Ӧ�ÿ��԰���������ü���ÿ�����ü������Ա�һ������������Ʊ�ʶ��Data ID ͨ�������� Java ������ com.taobao.tc.refund.log.level������������֤ȫ��Ψһ�ԡ������������ǿ�ơ�

ͨ���Զ�����չ�� Data Id ���ã��ȿ��Խ�����Ӧ�ü����ù�������⣬�ֿ���֧��һ��Ӧ���ж�������ļ���

```
# �Զ��� Data Id ������
#��ͬ���̵�ͨ������ ֧�ֹ���� DataId
spring.cloud.nacos.config.sharedConfigs[0].data-id= common.yaml
spring.cloud.nacos.config.sharedConfigs[0].group=REFRESH_GROUP
spring.cloud.nacos.config.sharedConfigs[0].refresh=true

# config external configuration
# ֧��һ��Ӧ�ö�� DataId ������
spring.cloud.nacos.config.extensionConfigs[0].data-id=ext-config-common01.properties
spring.cloud.nacos.config.extensionConfigs[0].group=REFRESH_GROUP
spring.cloud.nacos.config.extensionConfigs[0].refresh=true

spring.cloud.nacos.config.extensionConfigs[1].data-id=ext-config-common02.properties
spring.cloud.nacos.config.extensionConfigs[1].group=REFRESH_GROUP
���ƴ���
```

## ���õ����ȼ�

Spring Cloud Alibaba Nacos Config Ŀǰ�ṩ���������������� Nacos ��ȡ��ص����á�

*   A: ͨ�� spring.cloud.nacos.config.shared-configs ֧�ֶ������ Data Id ������

*   B: ͨ�� spring.cloud.nacos.config.ext-config[n].data-id �ķ�ʽ֧�ֶ����չ Data Id ������

*   C: ͨ���ڲ���ع���(Ӧ������Ӧ����+ Profile )�Զ�������ص� Data Id ����

�����ַ�ʽ��ͬʹ��ʱ�����ǵ�һ�����ȼ���ϵ��:A < B < C

���ȼ��Ӹߵ��ͣ�

1.  nacos-config-product.yaml ��׼����

2.  nacos-config.yaml ͬ���̲�ͬ������ͨ������

3.  ext-config: ��ͬ���� ��չ����

4.  shared-dataids ��ͬ����ͨ������

## @RefreshScope

@Valueע����Ի�ȡ���������ĵ�ֵ�������޷���̬��֪�޸ĺ��ֵ����Ҫ����@RefreshScopeע��

```
@RestController
@RefreshScope
public class TestController {

    @Value("${common.age}")
    private String age;

    @GetMapping("/common")
    public String hello() {
        return age;
    }
}
���ƴ���
```

## Nacos��������Դ�����

**��ϸԴ������ͼ��**

[www.processon.com/view/link/6��](https://link.juejin.cn?target=https%3A%2F%2Fwww.processon.com%2Fview%2Flink%2F60f78ddbf346fb761bbac19d "https://www.processon.com/view/link/60f78ddbf346fb761bbac19d")

### �������ļܹ�

![image-20230429084840636](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230429084840636.png)

��������ʹ��demo

```
public class ConfigServerDemo {

    public static void main(String[] args) throws NacosException, InterruptedException {
        String serverAddr = "localhost";
        String dataId = "nacos-config-demo.yaml";
        String group = "DEFAULT_GROUP";
        Properties properties = new Properties();
        properties.put(PropertyKeyConst.SERVER_ADDR, serverAddr);
        //��ȡ���÷���
        ConfigService configService = NacosFactory.createConfigService(properties);
        //��ȡ����
        String content = configService.getConfig(dataId, group, 5000);
        System.out.println(content);
        //ע�������
        configService.addListener(dataId, group, new Listener() {
            @Override
            public void receiveConfigInfo(String configInfo) {
                System.out.println("===recieve:" + configInfo);
            }

            @Override
            public Executor getExecutor() {
                return null;
            }
        });

        //��������
        //boolean isPublishOk = configService.publishConfig(dataId, group, "content");
        //System.out.println(isPublishOk);
        //����properties��ʽ
        configService.publishConfig(dataId,group,"common.age=30", ConfigType.PROPERTIES.getType());

        Thread.sleep(3000);
        content = configService.getConfig(dataId, group, 5000);
        System.out.println(content);

//        boolean isRemoveOk = configService.removeConfig(dataId, group);
//        System.out.println(isRemoveOk);
//        Thread.sleep(3000);

//        content = configService.getConfig(dataId, group, 5000);
//        System.out.println(content);
//        Thread.sleep(300000);
    }
}
���ƴ���
```

## nacos config clientԴ��

�������ĺ��Ľӿ�ConfigService

![image-20230429084850542](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230429084850542.png)

### ��ȡ����

        ��ȡ���õ���Ҫ������ NacosConfigService ��� getConfig ������ͨ������¸÷���ֱ�Ӵӱ����ļ���ȡ�����õ�ֵ����������ļ������ڻ�������Ϊ�գ�����ͨ�� HTTP GET ������Զ����ȡ���ã������浽���ؿ����С���ͨ�� HTTP ��ȡԶ������ʱ��Nacos �ṩ�������۶ϲ��ԣ�һ�ǳ�ʱʱ�䣬����������Դ�����Ĭ���������Ρ�

![image-20230429084858759](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230429084858759.png)

### ע�������

�������Ŀͻ��˻�ͨ����������ע��������ﵽ������������ʱ��ִ�лص��Ĺ���

* NacosConfigService#getConfigAndSignListener

* ConfigService#addListener

        Nacos ����ͨ�����Ϸ�ʽע��������������ڲ���ʵ�־��ǵ��� ClientWorker ��� addCacheDataIfAbsent������ CacheData ��һ��ά�������������ע������м�������ʵ�������е� CacheData �������� ClientWorker ���е�ԭ�� cacheMap �У����ڲ��ĺ��ĳ�Ա�У�

![image-20230429084908207](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230429084908207.png)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f14749bd9b614b21a55a261187cd5521~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

### ���ó���ѯ

         ClientWorker ͨ�����µ������̳߳�������ó���ѯ�Ĺ�����һ���ǵ��̵߳� executor��ÿ�� 10ms ����ÿ 3000 ��������Ϊһ������ȡ����ѯ�� cacheData ʵ���������װ��Ϊһ�� LongPollingTask �ύ����ڶ����̳߳� executorService ����

![image-20230429084917535](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230429084917535.png)

## nacos config serverԴ�����

### ����dump

![image-20230429084926987](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230429084926987.png)

       ���������ʱ�ͻ����� DumpService �� init �����������ݿ��� load ���ô洢�ڱ��ش����ϣ�����һЩ��Ҫ��Ԫ��Ϣ���� MD5 ֵ�������ڴ��С�����˻���������ļ��б�������һ������ʱ�䣬���жϵ����Ǵ����ݿ� dump ȫ���������ݻ��ǲ��������������ݣ���������ϴ���������� 6h ���ڵĻ�����

ȫ�� dump ��Ȼ����մ��̻��棬Ȼ��������� ID ÿ����ȡһǧ������ˢ�����̺��ڴ档���� dump ������ȡ�����Сʱ���������ã��������µĺ�ɾ���ģ����Ȱ�����������ˢ��һ���ڴ���ļ����ٸ����ڴ������е�����ȫ��ȥ�ȶ�һ�����ݿ⣬����иı����ͬ��һ�Σ������ȫ�� dump �Ļ������һ�������ݿ� IO �ʹ��� IO ������

### ���÷���

        �������õĴ���λ�� ConfigController#publishConfig�С���Ⱥ��������һ��ʼҲֻ���һ̨��������̨���������ò���Mysql�н��г־û�������˲��������ÿ�����ò�ѯ��ȥ���� MySQL �����ǻ����� dump �����ڱ����ļ��н����û�����������˵���̨���������������֮����Ҫ֪ͨ��������ˢ���ڴ�ͱ��ش����е��ļ����ݣ�������ᷢ��һ����Ϊ ConfigDataChangeEvent ���¼�������¼���ͨ�� HTTP ����֪ͨ���м�Ⱥ�ڵ㣨�������������������ļ����ڴ��ˢ�¡�

### ������ѯ

        �ͻ��˻���һ������ѯ������ȡ����˵����ñ��������˴����߼���LongPollingService���У�������һ�� Runnable ������ΪClientLongPolling������˻Ὣ�ܵ�����ѯ�����װ��һ�� ClientLongPolling ���񣬸��������һ�� AsyncContext ��Ӧ����ͨ����ʱ�̳߳��Ӻ� 29.5s ִ�С��ȿͻ��� 30s �ĳ�ʱʱ����ǰ 500ms ������Ϊ�����̶��ϱ�֤�ͻ��˲�����Ϊ������ʱ��ɳ�ʱ.

![image-20230429084934117](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230429084934117.png)









���ߣ������Ƶ��������Ŷ�
���ӣ�https://juejin.cn/post/6999814668390760484
��Դ��ϡ�����
����Ȩ���������С���ҵת������ϵ���߻����Ȩ������ҵת����ע��������
# �ο�����
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud
https://github.com/macrozheng/springcloud-learning