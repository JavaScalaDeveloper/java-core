Spring Cloud ��һ����� Spring Boot ʵ�ֵ�΢�����ܡ�Spring Cloud Դ�� Spring ��������Ҫ�� Pivotal �� Netflix ����˾�ṩ����������ά����

����΢����Ļ����У����������������˾����̷�����������΢����ܹ��У���Բ�ͬ�������ֵĸ�������Ľ�������Ϳ�Դ��ܡ�

*   **��������**������ͰͿ�Դ�� Dubbo �͵����������������չ������ DubboX��Netflix �� Eureka �Լ� Apache �� Consul �ȡ�
*   **�ֲ�ʽ���ù���**���ٶȵ� Disconf��Netflix �� Archaius��360 �� QConf��Я�̵� Apollo �Լ� Spring Cloud �� Config �ȡ�
*   **��������**���������� Elastic-Job��LinkedIn �� Azkaban �Լ� Spring Cloud �� Task �ȡ�
*   **�������**�������� Hydra��Spring Cloud �� Sleuth �Լ� Twitter �� Zipkin �ȡ�
*   **����**

������Щ΢�����ܻ����������������� 2 ���ص㣺

*   ����ͬһ��΢�������⣬����������˾�����Ľ������������ͬ��
*   һ��΢�����ܻ���������ֻ�ܽ��΢�����е�ĳһ����ĳ�������⣬������������������Ϊ����

��������£��һ��΢�ֲ�ʽ΢����ϵͳ������Ҫ�����Щ��������Ľ������������ѡ����ʹ�����ǲ��ò��������ľ���������ǰ�ڵĵ��С������Լ�ʵ���ϡ�

Spring Cloud ����Ϊ�����ֲ�ʽ΢����ϵͳ�ġ�ȫ��Ͱ������������ĳһ�ż���������һϵ��΢�������������ܵ����򼯺ϡ����������ϳ���ġ�������֤��΢������������������ͨ�� Spring Boot ��˼������ٷ�װ�����ε����и��ӵ����ú�ʵ��ԭ������Ϊ������Ա�ṩ��һ�׼��׶����ײ������ά���ķֲ�ʽϵͳ�������߰���

Spring Cloud �а����� spring-cloud-config��spring-cloud-bus �Ƚ� 20 ������Ŀ���ṩ�˷��������������ء�����·�ɡ����ؾ��⡢��·������ظ��١��ֲ�ʽ��Ϣ���С����ù��������Ľ��������

Spring Cloud ������һ�����������õĿ�ܣ�����һ��΢����淶���������� 2 ��ʵ�֣�

*   ��һ��ʵ�֣�Spring Cloud Netflix
*   �ڶ���ʵ�֣�Spring Cloud Alibaba

�������ǽ��ܵ� Spring Cloud ��ָ Spring Cloud �ĵ�һ��ʵ�֡�

## Spring Cloud �������

Spring Cloud ���� Spring Cloud Gateway��Spring Cloud Config��Spring Cloud Bus �Ƚ� 20 �������������Щ����ṩ�˷��������������ء�����·�ɡ����ؾ��⡢�۶�������ظ��١��ֲ�ʽ��Ϣ���С����ù��������Ľ��������

Spring Cloud �ĳ���������±���ʾ��

| Spring Cloud ���            | ����                                                         |
| ---------------------------- | ------------------------------------------------------------ |
| Spring Cloud Netflix Eureka  | Spring Cloud Netflix �еķ��������������������ע�����ġ�����ע���뷢�ֻ��Ƶ�ʵ�֡� |
| Spring Cloud Netflix Ribbon  | Spring Cloud  Netflix �еķ�����úͿͻ��˸��ؾ��������     |
| Spring Cloud Netflix Hystrix | �˳ơ�����硱��Spring Cloud Netflix ���ݴ���������Ϊ�����г��ֵ��ӳٺ͹����ṩǿ����ݴ������� |
| Spring Cloud Netflix Feign   | ���� Ribbon �� Hystrix ������ʽ������������                |
| Spring Cloud Netflix Zuul    | Spring Cloud Netflix �е�����������ṩ������·�ɡ����ʹ��˵ȹ��ܡ� |
| Spring Cloud Gateway         | һ������ Spring 5.0��Spring Boot 2.0 �� Project Reactor �ȼ������������ؿ�ܣ���ʹ�� Filter ���ķ�ʽ�ṩ�����صĻ������ܣ����簲ȫ�����/ָ��������ȡ� |
| Spring Cloud Config          | Spring Cloud �����ù����ߣ�֧��ʹ�� Git �洢�������ݣ�ʵ��Ӧ�����õ��ⲿ���洢����֧���ڿͻ��˶����ý���ˢ�¡����ܡ����ܵȲ����� |
| Spring Cloud Bus             | Spring Cloud ���¼�����Ϣ���ߣ���Ҫ�����ڼ�Ⱥ�д����¼���״̬�仯���Դ��������Ĵ������綯̬ˢ�����á� |
| Spring Cloud Stream          | Spring Cloud ����Ϣ�м��������������� Apache Kafka �� RabbitMQ ����Ϣ�м������ͨ�����������Ϊ�м�㣬������ʵ����Ӧ�ó�������Ϣ�м��֮��ĸ��롣ͨ����Ӧ�ó���¶ͳһ�� Channel ͨ����ʹ��Ӧ�ó�����Ҫ�ٿ��Ǹ��ֲ�ͬ����Ϣ�м��ʵ�֣��������ɵط��ͺͽ�����Ϣ�� |
| Spring Cloud Sleuth          | Spring Cloud �ֲ�ʽ��·����������ܹ����������� Twitter �� Zipkin�� |

> ע��Netflix ��������һ��������Ƶ��վ�����ǹ��ϵĴ��ģ������΢����Ľܳ�ʵ���ߣ�΢�������̳���Netflix �Ŀ�Դ����Ѿ�������ģ�ֲ�ʽ΢���񻷾��о����˶��������ʵս��֤�������ҿɿ���

## Spring Boot �� Spring Cloud ����������ϵ

Spring Boot �� Spring Cloud ���� Spring ������һԱ��������΢���񿪷��ж�������ʮ����Ҫ�Ľ�ɫ������֮��ȴ�������Ҳ������ϵ��

#### 1\. Spring Boot �� Spring Cloud �ֹ���ͬ

Spring Boot ��һ������ Spring �Ŀ��ٿ�����ܣ����ܹ�����������Ѹ�ٴ� Web ���̡���΢���񿪷��У�Spring Boot רע�ڿ��١�����ؿ�������΢����

Spring Cloud ��΢����ܹ��µ�һվʽ���������Spring Cloud רע��ȫ��΢�����Э���������������仰˵��Spring Cloud �൱��΢����Ĵ�ܼң����� Spring Boot ������һ����΢���������������Ϊ�����ṩ���ù��������֡���·����·�ɡ�΢�����¼����ߡ����߾�ѡ�Լ��ֲ�ʽ�Ự�ȷ���

#### 2\. Spring Cloud �ǻ��� Spring Boot ʵ�ֵ�

Spring Cloud �ǻ��� Spring Boot ʵ�ֵġ��� Spring Boot ���ƣ�Spring Cloud ҲΪ�ṩ��һϵ�� Starter����Щ Starter �� Spring Cloud ʹ�� Spring Boot ˼��Ը���΢�����ܽ����ٷ�װ�Ĳ��������������Щ΢�������и��ӵ����ú�ʵ��ԭ��ʹ������Ա�ܹ����١������ʹ�� Spring Cloud �һ�׷ֲ�ʽ΢����ϵͳ��

#### 3\. Spring Boot �� Spring Cloud ������������ͬ

Spring Boot ����һ���������Ŀ�ܣ����� Spring Boot ����������������١�

Spring Cloud ��һϵ��΢�����ܼ����ļ����壬����ÿ���������Ҫһ�������������Starter POM���������Ҫ����һ�������� Spring  Cloud ����������Ҫ�����������

#### 4\. Spring Cloud �������� Spring Boot ��������

Spring Boot ����Ҫ Spring Cloud������ֱ�Ӵ����ɶ������еĹ��̻�ģ�顣

Spring Cloud �ǻ��� Spring Boot ʵ�ֵģ������ܶ����������̻�ģ�飬���������� Spring Boot �������С�

> ע�⣺��Ȼ Spring Boot �ܹ����ڿ�������΢���񣬵��������߱������Э��΢����������������ֻ������һ��΢������ٿ�����ܣ�����΢�����ܡ�

## Spring Cloud �汾

Spring Cloud �������������Ŀ�����������Щ����Ŀ���Ƕ����������ݸ��º͵����ģ����Զ�ά�����Լ��ķ����汾�š�

Ϊ�˱��� Spring Cloud �İ汾����������Ŀ�İ汾�Ż�����Spring Cloud û�в��ó��������ְ汾�ţ�����ͨ�����·�ʽ����汾��Ϣ��

<pre>{version.name} .{version.number}</pre>

Spring Cloud �汾��Ϣ˵�����£�

*   **version.name**���汾��������Ӣ���׶ص���վ��վ������������������ĸ���˳�򣨼��� A �� Z������Ӧ Spring Cloud �İ汾����˳�������һ���汾Ϊ Angel���ڶ����汾Ϊ Brixton��Ӣ����������Ȼ�������� Camden��Dalston��Edgware��Finchley��Greenwich��Hoxton �ȡ�
*   **version.number**���汾�ţ�ÿһ���汾�� Spring Cloud �ڸ������ݻ��۵�һ�������������ش� BUG �޸�ʱ���ͻᷢ��һ����service releases���汾����� SRX �汾������ X Ϊһ�����������֣����� Hoxton.SR8 �ͱ�ʾ Hoxton �ĵ� 8 �� Release �汾��

## Spring Cloud �汾ѡ��

��ʹ�� Spring Boot + Spring Cloud ����΢���񿪷�ʱ��������Ҫ������Ŀ�� Spring Boot �İ汾������ Spring Cloud �汾����������������벻���Ĵ���

Spring Boot �� Spring Cloud �İ汾��Ӧ��ϵ���±��ο���[ ](https://spring.io/projects/spring-cloud)[Spring Cloud ����](http://spring.io/projects/spring-cloud)����

| Spring Cloud        | Spring Boot                                    |
| ------------------- | ---------------------------------------------- |
| 2020.0.x ��Ilford�� | 2.4.x, 2.5.x ���� Spring Cloud 2020.0.3 ��ʼ�� |
| Hoxton              | 2.2.x, 2.3.x ���� Spring Cloud SR5 ��ʼ��      |
| Greenwich           | 2.1.x                                          |
| Finchley            | 2.0.x                                          |
| Edgware             | 1.5.x                                          |
| Dalston             | 1.5.x                                          |

> ע�⣺Spring Cloud �ٷ��Ѿ�ֹͣ�� Dalston��Edgware��Finchley �� Greenwich �İ汾���¡�

�����ϱ���չʾ�İ汾��Ӧ��ϵ֮�⣬���ǻ�����ʹ����������� [https://start.spring.io/actuator/info](https://start.spring.io/actuator/info)����ȡ Spring Cloud �� Spring Boot �İ汾��Ӧ��ϵ��JSON �棩��










````

{
   ����
    "bom-ranges":{
        ����
        "spring-cloud":{
            "Hoxton.SR12":"Spring Boot >=2.2.0.RELEASE and <2.4.0.M1",
            "2020.0.4":"Spring Boot >=2.4.0.M1 and <2.5.6-SNAPSHOT",
            "2020.0.5-SNAPSHOT":"Spring Boot >=2.5.6-SNAPSHOT and <2.6.0-M1",
            "2021.0.0-M1":"Spring Boot >=2.6.0.M1 and <2.6.0-SNAPSHOT",
            "2021.0.0-SNAPSHOT":"Spring Boot >=2.6.0-SNAPSHOT"
        },
        ����
    },
 ����
}

````
# �ο�����
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud