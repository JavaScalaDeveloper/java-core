Spring Cloud Alibaba�������ṩ΢���񿪷���һվʽ�������������Spring Cloud�����ֲ��AlibabaԪ��֮��Ĳ������Spring Cloud Alibaba�����Կ��ٴ΢����ܹ�����ɼ�����������С��ҵ�����Ҫ�������ҵ����̨�ͼ�����̨���������ֻ�ҵ��ת�ͣ���Spring Cloud Alibaba������һ������������

# ʲô��Spring Cloud Alibaba

�ð������ȿ���Spring Cloud Alibaba�Ĺ���������ͼ��ʾ��

![image-20230423165959115](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230423165959115.png)

��ͼ�оͿ��Կ�����Spring Cloud Alibaba��Spring Cloud������Ŀ���ðɣ�������Ŀһ��ʼ�Ķ�λ���Ǹ��ӹ�ϵ��

�����ٷ�����û����߸�Spring Cloud�ļܹ�˼�룬ֻ������һ����������ǿ����չ��


# ΪʲôҪ��Spring Cloud Alibaba


�����ȿ���Spring Cloud Alibaba����Щ������



Spring Cloud Alibaba ��������ܼ�����Ѱ汾��Ҳ���շѰ汾��

Sentinel���ԡ�����Ϊ����㣬���������ơ������ԡ��ݴ����͸��ر����ȷ����ṩ����������Ա���������ȶ��ԡ�



Nacos��һ���߱���̬�����ֺͷֲ�ʽ���õȹ��ܵĹ���ƽ̨����Ҫ���ڹ�����ԭ��Ӧ�ó���



RocketMQ��һ�������ܡ��߿��á����������Ľ��ڼ���Ϣ�м����Spring Cloud Alibaba ��RocketMQ ���ƻ���װ��������Ա�ɡ����伴�á���



Dubbo��һ������Java�ĸ����ܿ�ԴRPC��ܡ�



Seata��һ��������������ʹ�õķֲ�ʽ������������������΢����ܹ���

������OSS�������ƶ���洢���񣩣�һ�ּ��ܵİ�ȫ�ƴ洢���񣬿��Դ洢������ͷ������������κεط��Ĵ������ݡ�



������SchedulerX��һ��ֲ�ʽ������Ȳ�Ʒ��֧�ֶ����������ָ��ʱ��㴥������



������SMS��һ�ָ���ȫ�����Ϣ�����ṩ��ݡ���Ч�����ܵ�ͨ�Ź��ܣ��ɰ�����ҵ������ϵ��ͻ���



������������Spring Cloud Alibaba�ĸ����汾�ĶԱȣ�����ͼ��ʾ��

![image-20230423170034102](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230423170034102.png)

��������������û��Spring Cloud Alibaba֮ǰ���������ʹ��Spring Cloud����΢���񿪷���



Spring Cloud֧�ֶ���ע�����ģ�����Eureka��ZooKeeper��Consul�ȡ�



������������Ա��Ҫ����Eureka��Ϊע�����ģ�����Ҫ�һ��Eureka Server��Ⱥ�����ڹ���ע�����ķ����Ԫ���ݣ�Ȼ��Ӧ�÷�����Ҫ����Eureka������Ҫʹ�ö�Ӧ��ע�⽫�����ṩ���Լ���������ע�ᵽEurekaע�����ġ�ͬ��ZooKeeper��ConsulҲ�ǲ���ͬ���ķ�ʽ��ʹ�ö�Ӧע�����ĵ�ע����ɷ����ע��Ͷ��ġ�



Spring CloudΪ�˷������������Ա���ٵĽ��벻ͬ��ע�����ģ�ͳһʹ��ע��@EnableDiscoveryClient+��Ӧע�����ĵ�Starter�������ȻEureka���������ϵ�ʹ�÷�ʽ@EnableEurekaClient+��Ӧע�����ĵ�Starter�������Ҫ������Spring Cloud�Ѿ�ֹͣ�˶�Eureka��ά����



�ð��������ˣ�Spring Cloud�Ѿ���ZooKeeper��Consul��ʹ�÷�ʽͳһ���������������Ա�ǳ����Ľ�Ӧ�ý���Spring Cloud������Ŀǰ�������ֳ���һ���µ�ע�����ģ�����Nacos���������ܷǳ��ߣ�����֧��CP��APģʽ������Spring Cloud��֧�֡�



��������������û��Spring Cloud Alibaba֮ǰ���������ʹ��Nacos��



�ðɣ�Nacos��һ���֧�ֲַ�ʽע�����ĺͷֲ�ʽ�������ĵ�������Nacos�ٷ��ṩ�˺ܶ����ģʽ������Spring Framework��Spring Boot�ȣ�������ײ㱾����������Nacos�ṩ��SDK,����Nacos Client��



�������Spring Framework+Nacos Client������nacos-spring-context��������Ҫ������Ա�Լ�ά��NacosNamingServce��NacosConfigServiceʵ������Ҳ����˵������Ա��Ҫ�Լ�����Nacos Client�����ο������ɱ��ǳ���



�������Spring Boot+Nacos Starter���������nacos-discovery-spring-boot-starter�����򿪷���Ա���Ը�Ч�Ľ���Nacos�������ģ����ҿ���ʹ��Spring Boot�ṩ�ĸ���Starter�����



����������Spring Cloud��Ϊ������ܣ�����ʹ��Nacos��Ϊע�����ģ��þ��ᰡ��



��ô��û��һ����ܼȿ���ʹ��Spring Cloud���ֿ���ʹ��Spring Boot�����ܼ��ݸ���ע�������أ��ܸ��˵ĸ��ߴ�ң�Spring Cloud Alibaba������������������Ľ���˿�����Ա΢����ܹ����ѡ�͵����⣬���������ˡ�

# Spring Cloud Alibaba�ĺ��ļܹ�˼��


Spring Cloud Alibaba����ܹ�������ͼ��

![image-20230423170108696](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230423170108696.png)

Spring Cloud Alibaba�ܹ���ľĿ���ǽ���Դ��Ʒ���Ƴ����ںϣ�����ҵ�����Ϻ����µ��޷���ݣ�ҵ�񿪷���Աֻ��Ҫ����ҵ����Ŀ�������ײ㼼��ϸ�ھͽ���Spring Cloud Alibaba��



��ο������ֲ�ʹ��




�ðɣ�˵����ô���������������Ա��ô��������Spring Cloud Alibaba�أ�

��ʵ��򵥵ķ�ʽ��������������Ȼ���Լ����Զ���ʹ��Spring Cloud Alibaba�Ĺ��ܣ���ȥ����Դ���������ܸ�����̵���Ϥԭ��



Ҳ�����һЩ�˻���Ϊ���ҿ���Դ���������������Ϥ�ˣ�����һ����֮��������ˣ���ʲô���ء������������룬�����ǲ���Դ�룬�������������飬һ����֮��Ҳ�����ǵġ�ֻ��ͨ�����ۺ�ʵս��ϣ���Ż᳤�ڵı���ϰ��ȥ��ϰ�������¹ʶ�֪�¡�



�����������������Ա��������Java������Ա��Ӧ�ö���IDEA������Ŀ�������Ҿ��þͿ��������������ٵ�����һ��Spring Cloud Alibaba��Ŀ����������Spring Framework�ٷ��Ľ��ּ���ĿSpring Initializr�ȡ�



���о���Ҫ���ܽ�һЩ���ʵ��������Ҫ��Spring Cloud Alibaba�������ļ���ʼ����ߣһЩ���õ�ҵ�񳡾����������ܸ�����̵��˽�Spring Cloud Alibaba�����˼�롣


Copyright ? ���� Link: [https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html](https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html)

�����ٷ��ĵ�һ�����򵥵Ľ���Spring Cloud Alibaba��������Щ��Ҫ���֣����и������ӡ�󣬺��浱Ȼ����ϸ�Ľ��ܣ���ȥ������⡣

- **���������ͽ���**��֧��`WebServlet`��`WebFlux`��`OpenFeign`��`RestTemplate`��`Dubbo`���������ͽ���������ͨ��`console`ʵʱ�޸������������ԣ�֧�ּ����������ָ��
- **����ע��ͷ���**������ע�����clients����ͨ��Spring�����bean����ʵ�������ں���Ribbon
- **�ֲ�ʽ����**��֧�ֲַ�ʽϵͳ��������չ�����øı�ʱ�Զ�ˢ��
- **Rpc ����**����չSpring Cloud��RestTemplate��OpenFeign֧�ֵ���Dubbo RPC����
- **�¼�����**��֧�ֹ���ͨ��������Ϣϵͳ���ӵĸ߶ȿ��������¼�������΢����
- **�ֲ�ʽ����**��֧�ָ����ܡ�����ʹ�õķֲ�ʽ����������
- �����ƶ���洢��������������ȡ������ƶ��ŷ���

����������ǰѹٷ��ĵ���������ģ����Է���Spring Cloud Alibaba�ǳ�ǿ�󣬻����Ķ������¿�~



# ������

## ![springCloud-Alibaba-1](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/springCloud-Alibaba-1.png)[#](#�汾��ϵ) �汾��ϵ

[�ٷ��汾˵��(opens new window)](https://github.com/alibaba/spring-cloud-alibaba/wiki/%E7%89%88%E6%9C%AC%E8%AF%B4%E6%98%8E)

### 2021.x ��֧

| Spring Cloud Alibaba Version | Spring Cloud Version  | Spring Boot Version |
| ---------------------------- | --------------------- | ------------------- |
| 2021.0.1.0*                  | Spring Cloud 2021.0.1 | 2.6.3               |
| 2021.1                       | Spring Cloud 2020.0.1 | 2.4.2               |

### 2.2.x ��֧

| Spring Cloud Alibaba Version      | Spring Cloud Version        | Spring Boot Version |
| --------------------------------- | --------------------------- | ------------------- |
| 2.2.8.RELEASE*                    | Spring Cloud Hoxton.SR12    | 2.3.12.RELEASE      |
| 2.2.7.RELEASE                     | Spring Cloud Hoxton.SR12    | 2.3.12.RELEASE      |
| 2.2.6.RELEASE                     | Spring Cloud Hoxton.SR9     | 2.3.2.RELEASE       |
| 2.1.4.RELEASE                     | Spring Cloud Greenwich.SR6  | 2.1.13.RELEASE      |
| 2.2.1.RELEASE                     | Spring Cloud Hoxton.SR3     | 2.2.5.RELEASE       |
| 2.2.0.RELEASE                     | Spring Cloud Hoxton.RELEASE | 2.2.X.RELEASE       |
| 2.1.2.RELEASE                     | Spring Cloud Greenwich      | 2.1.X.RELEASE       |
| 2.0.4.RELEASE(ֹͣά������������) | Spring Cloud Finchley       | 2.0.X.RELEASE       |
| 1.5.1.RELEASE(ֹͣά������������) | Spring Cloud Edgware        | 1.5.X.RELEASE       |

### ����汾��ϵ

| Spring Cloud Alibaba Version                              | Sentinel Version | Nacos Version | RocketMQ Version | Dubbo Version | Seata Version |
| --------------------------------------------------------- | ---------------- | ------------- | ---------------- | ------------- | ------------- |
| 2.2.8.RELEASE                                             | 1.8.4            | 2.1.0         | 4.9.3            | ~             | 1.5.1         |
| 2021.0.1.0                                                | 1.8.3            | 1.4.2         | 4.9.2            | ~             | 1.4.2         |
| 2.2.7.RELEASE                                             | 1.8.1            | 2.0.3         | 4.6.1            | 2.7.13        | 1.3.0         |
| 2.2.6.RELEASE                                             | 1.8.1            | 1.4.2         | 4.4.0            | 2.7.8         | 1.3.0         |
| 2021.1 or 2.2.5.RELEASE or 2.1.4.RELEASE or 2.0.4.RELEASE | 1.8.0            | 1.4.1         | 4.4.0            | 2.7.8         | 1.3.0         |
| 2.2.3.RELEASE or 2.1.3.RELEASE or 2.0.3.RELEASE           | 1.8.0            | 1.3.3         | 4.4.0            | 2.7.8         | 1.3.0         |
| 2.2.1.RELEASE or 2.1.2.RELEASE or 2.0.2.RELEASE           | 1.7.1            | 1.2.1         | 4.4.0            | 2.7.6         | 1.2.0         |
| 2.2.0.RELEASE                                             | 1.7.1            | 1.1.4         | 4.4.0            | 2.7.4.1       | 1.0.0         |
| 2.1.1.RELEASE or 2.0.1.RELEASE or 1.5.1.RELEASE           | 1.7.0            | 1.1.4         | 4.4.0            | 2.7.3         | 0.9.0         |
| 2.1.0.RELEASE or 2.0.0.RELEASE or 1.5.0.RELEASE           | 1.6.3            | 1.1.1         | 4.4.0            | 2.7.3         | 0.7.1         |

# �ܽ�



���ľ��Ǵ�ȫ������һЩSpring Cloud Alibaba��һЩ�ܹ�˼�룬����û�д�ϸ���ģ�����ϸ�ڿ��Բο���Spring Cloud Alibabaϵ�С���


# �ο�����
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud