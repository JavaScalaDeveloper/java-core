> Spring Cloud Sleuth �Ƿֲ�ʽϵͳ�и��ٷ������õĹ��ߣ�������ֱ�۵�չʾ��һ������ĵ��ù��̣����Ľ������÷�������ϸ���ܡ�

## [#](https://www.macrozheng.com/cloud/sleuth.html#spring-cloud-sleuth-%E7%AE%80%E4%BB%8B)Spring Cloud Sleuth ���

�������ǵ�ϵͳԽ��Խ�Ӵ󣬸��������ĵ��ù�ϵҲ���Խ��Խ���ӡ����ͻ��˷���һ������ʱ��������󾭹������������շ����˽����������ÿһ�������п��ܷ����ӳٻ���󣬴Ӷ���������ʧ�ܡ���ʱ�����Ǿ���Ҫ������·���ٹ������������ǣ�����������õķ�����·��������⡣

## [#](https://www.macrozheng.com/cloud/sleuth.html#%E7%BB%99%E6%9C%8D%E5%8A%A1%E6%B7%BB%E5%8A%A0%E8%AF%B7%E6%B1%82%E9%93%BE%E8%B7%AF%E8%B7%9F%E8%B8%AA)���������������·����

> ���ǽ�ͨ��user-service��ribbon-service֮��ķ����������ʾ�ù��ܣ��������ǵ���ribbon-service�Ľӿ�ʱ��ribbon-service��ͨ��RestTemplate������user-service�ṩ�Ľӿڡ�

*   ���ȸ�user-service��ribbon-service���������·���ٹ��ܵ�֧�֣�

*   ��user-service��ribbon-service��������������



```
<dependency>
    <groupId>org.springframework.cloud</groupId>
    spring-cloud-starter-zipkin
</dependency>

```




*   �޸�application.yml�ļ��������ռ���־��zipkin-server���ʵ�ַ��



```
spring:
  zipkin:
    base-url: http://localhost:9411
  sleuth:
    sampler:
      probability: 0.1 #����Sleuth�ĳ����ռ�����

```



## [#](https://www.macrozheng.com/cloud/sleuth.html#%E6%95%B4%E5%90%88zipkin%E8%8E%B7%E5%8F%96%E5%8F%8A%E5%88%86%E6%9E%90%E6%97%A5%E5%BF%97)����Zipkin��ȡ��������־

> Zipkin��Twitter��һ����Դ��Ŀ������������ȡ�ͷ���Spring Cloud Sleuth �в�����������·������־�����ṩ��Web��������������ֱ�۵ز鿴������·������Ϣ��

*   SpringBoot 2.0���ϰ汾�Ѿ�����Ҫ���дzipkin-server�����ǿ��ԴӸõ�ַ����zipkin-server��https://repo1.maven.org/maven2/io/zipkin/java/zipkin-server/2.12.9/zipkin-server-2.12.9-exec.jar

*   ������ɺ�ʹ��������������zipkin-server��



```
java -jar zipkin-server-2.12.9-exec.jar

```

1




*   Zipkinҳ����ʵ�ַ��http://localhost:9411

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/springcloud_sleuth_01.625f37c3.png)

*   ����eureka-sever��ribbon-service��user-service��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/springcloud_sleuth_02.baf7b77c.png)

*   ��ε��ã�SleuthΪ�����ռ���ribbon-service�Ľӿ�[http://localhost:8301/user/1open in new window](http://localhost:8301/user/1) ���������鿴Zipkin��ҳ�����Ѿ���������·������Ϣ�ˣ�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/springcloud_sleuth_03.a71d1cf1.png)

*   ����鿴�������ֱ�۵ؿ������������·��ͨ��ÿ������ĺ�ʱ��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/springcloud_sleuth_04.d13e3d99.png)

## [#](https://www.macrozheng.com/cloud/sleuth.html#%E4%BD%BF%E7%94%A8elasticsearch%E5%AD%98%E5%82%A8%E8%B7%9F%E8%B8%AA%E4%BF%A1%E6%81%AF)ʹ��Elasticsearch�洢������Ϣ

> ������ǰ�zipkin-server����һ�¾ͻᷢ�ָոյĴ洢�ĸ�����Ϣȫ����ʧ�ˣ��ɼ����Ǵ洢���ڴ��еģ���ʱ��������Ҫ��������Ϣ�洢�����������Դ洢��ElasticsearchΪ��������ʾ�¸ù��ܡ�

### [#](https://www.macrozheng.com/cloud/sleuth.html#%E5%AE%89%E8%A3%85elasticsearch)��װElasticsearch

*   ����Elasticsearch6.2.2��zip��������ѹ��ָ��Ŀ¼�����ص�ַ��[https://www.elastic.co/cn/downloads/past-releases/elasticsearch-6-2-2open in new window](https://www.elastic.co/cn/downloads/past-releases/elasticsearch-6-2-2)

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/arch_screen_25.48daf958.png)

*   ����binĿ¼�µ�elasticsearch.bat����Elasticsearch

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/arch_screen_27.ba3cb8e0.png)

### [#](https://www.macrozheng.com/cloud/sleuth.html#%E4%BF%AE%E6%94%B9%E5%90%AF%E5%8A%A8%E5%8F%82%E6%95%B0%E5%B0%86%E4%BF%A1%E6%81%AF%E5%AD%98%E5%82%A8%E5%88%B0elasticsearch)�޸�������������Ϣ�洢��Elasticsearch

*   ʹ�������������У��Ϳ��԰Ѹ�����Ϣ�洢��Elasticsearch����ȥ�ˣ���������Ҳ���ᶪʧ��



```
# STORAGE_TYPE����ʾ�洢���� ES_HOSTS����ʾES�ķ��ʵ�ַ
java -jar zipkin-server-2.12.9-exec.jar --STORAGE_TYPE=elasticsearch --ES_HOSTS=localhost:9200 

```


*   ֮����Ҫ��������user-service��ribbon-service������Ч���������ε���ribbon-service�Ľӿ�[http://localhost:8301/user/1open in new window](http://localhost:8301/user/1)��

*   �����װ��Elasticsearch�Ŀ��ӻ�����Kibana�Ļ������Կ��������Ѿ��洢�˸�����Ϣ��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/springcloud_sleuth_05.9929ce6a.png)

### [#](https://www.macrozheng.com/cloud/sleuth.html#%E6%9B%B4%E5%A4%9A%E5%90%AF%E5%8A%A8%E5%8F%82%E6%95%B0%E5%8F%82%E8%80%83)�������������ο�

https://github.com/openzipkin/zipkin/tree/master/zipkin-server#elasticsearch-storage

## [#](https://www.macrozheng.com/cloud/sleuth.html#%E4%BD%BF%E7%94%A8%E5%88%B0%E7%9A%84%E6%A8%A1%E5%9D%97)ʹ�õ���ģ��



```
springcloud-learning
������ eureka-server -- eurekaע������
������ user-service -- �ṩUser����CRUD�ӿڵķ���
������ ribbon-service -- ribbon������ò��Է���

```




## [#](https://www.macrozheng.com/cloud/sleuth.html#%E9%A1%B9%E7%9B%AE%E6%BA%90%E7%A0%81%E5%9C%B0%E5%9D%80)��ĿԴ���ַ

[https://github.com/macrozheng/springcloud-learning](https://github.com/macrozheng/springcloud-learning)

# �ο�����
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud
https://github.com/macrozheng/springcloud-learning