Spring Cloud Consul Ϊ SpringBoot Ӧ���ṩ�� Consul��֧�֣�Consul�ȿ�����Ϊע������ʹ�ã�Ҳ������Ϊ��������ʹ�ã����Ľ������÷�������ϸ���ܡ�

# Consul ���

Consul��HashiCorp��˾�Ƴ��Ŀ�Դ������ṩ��΢����ϵͳ�еķ��������������ġ��������ߵȹ��ܡ���Щ�����е�ÿһ�������Ը�����Ҫ����ʹ�ã�Ҳ����һ��ʹ���Թ���ȫ��λ�ķ���������֮Consul�ṩ��һ�������ķ���������������

Spring Cloud Consul �����������ԣ�

- ֧�ַ�������Consul��Ϊע������ʱ��΢�����е�Ӧ�ÿ�����Consulע���Լ������ҿ��Դ�Consul��ȡ����Ӧ����Ϣ��
- ֧�ֿͻ��˸�����⣺����Ribbon��Spring Cloud LoadBalancer��
- ֧��Zuul����Zuul��Ϊ����ʱ�����Դ�Consul��ע��ͷ���Ӧ�ã�
- ֧�ֲַ�ʽ���ù���Consul��Ϊ��������ʱ��ʹ�ü�ֵ�����洢������Ϣ��
- ֧�ֿ������ߣ�����������΢����ϵͳ��ͨ�� Control Bus �ַ��¼���Ϣ��

# ʹ��Consul��Ϊע������

# ��װ������Consul

- �������Ǵӹ�������Consul����ַ��https://www.consul.io/downloads.html



- ������ɺ�ֻ��һ��exe�ļ���˫�����У�
- ������������������������Բ鿴�汾�ţ�



    consul --version



- �鿴�汾����Ϣ���£�



    Consul v1.6.1
    Protocol 2 spoken by default, understands 2 to 3 (agent will automatically use protocol >2 when speaking to compatible agents)


- ʹ�ÿ���ģʽ������



    consul agent -dev 






- ͨ�����µ�ַ���Է���Consul����ҳ��http://localhost:8500



# ����Ӧ��ע�ᵽConsul

����ͨ������user-service��ribbon-service����ʾ�·���ע���뷢�ֵĹ��ܣ���Ҫ�ǽ�Ӧ��ԭ����Eurekaע������֧�ָ�ΪConsulע������֧�֡�

- ����consul-user-serviceģ���consul-ribbon-serviceģ�飻
- �޸������������ԭ����Eurekaע�ᷢ�ֵ�������ΪConsul�ģ������SpringBoot Actuator��������



    <dependency>
        <groupId>org.springframework.cloud</groupId>
        spring-cloud-starter-consul-discovery
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        spring-boot-starter-actuator
    </dependency>




- �޸������ļ�application.yml����Eureka��ע�ᷢ�����ø�ΪConsul�ģ�



    server:
      port: 8206
    spring:
      application:
        name: consul-user-service
      cloud:
        consul: #Consul����ע�ᷢ������
          host: localhost
          port: 8500
          discovery:
            service-name: ${spring.application.name}




- ��������consul-user-service��һ��consul-ribbon-service����Consulҳ���Ͽ��Կ���������Ϣ��



# ���ؾ��⹦��

������������������consul-user-service����consul-ribbon-serviceĬ�ϻ�ȥ�������Ľӿڣ����ǵ���consul-ribbon-service�Ľӿ�����ʾ�¸��ؾ��⹦�ܡ�

��ε��ýӿڣ�http://localhost:8308/user/1 �����Է�������consul-user-service�Ŀ���̨�����ӡ������Ϣ��



    2019-10-20 10:39:32.580  INFO 12428 --- [io-8206-exec-10] c.macro.cloud.controller.UserController  : ����id��ȡ�û���Ϣ���û�����Ϊ��macro




# ʹ��Consul��Ϊ��������

����ͨ������consul-config-clientģ�飬����Consul�����������Ϣ����ʾ�����ù���Ĺ��ܡ�

# ����consul-config-clientģ��

- ��pom.xml��������������



    <dependency>
        <groupId>org.springframework.cloud</groupId>
        spring-cloud-starter-consul-config
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        spring-cloud-starter-consul-discovery
    </dependency>



- ��������ļ�application.yml�����õ���dev���������ã�



    spring:
      profiles:
        active: dev




- ��������ļ�bootstrap.yml����Ҫ�Ƕ�Consul�����ù��ܽ������ã�



    server:
      port: 9101
    spring:
      application:
        name: consul-config-client
      cloud:
        consul:
          host: localhost
          port: 8500
          discovery:
            serviceName: consul-config-client
          config:
            enabled: true #�Ƿ������������Ĺ���
            format: yaml #��������ֵ�ĸ�ʽ
            prefix: config #������������Ŀ¼
            profile-separator: ':' #�������õķָ���
            data-key: data #����key�����֣�����Consul��K/V�洢�����ô洢�ڶ�ӦK��V��


- ����ConfigClientController����Consul���������л�ȡ������Ϣ��



    /**
     * Created by macro on 2019/9/11.
     */
    @RestController
    @RefreshScope
    public class ConfigClientController {
    
        @Value("${config.info}")
        private String configInfo;
    
        @GetMapping("/configInfo")
        public String getConfigInfo() {
            return configInfo;
        }
    }


# ��Consul���������

- ��consul��������ô洢��keyΪ:



    config/consul-config-client:dev/data





- ��consul��������ô洢��valueΪ��



    config:
      info: "config info for dev"




- �洢��Ϣ��ͼ���£�



- ����consul-config-client�����ýӿڲ鿴������Ϣ��http://localhost:9101/configInfo



    config info for dev




# Consul�Ķ�̬ˢ������

����ֻҪ�޸���Consul�е�������Ϣ���ٴε��ò鿴���õĽӿڣ��ͻᷢ�������Ѿ�ˢ�¡���������ʹ��Spring Cloud Config��ʱ��������Ҫ���ýӿڣ�ͨ��Spring Cloud Bus����ˢ�����á�Consulʹ�����Դ���Control Bus ʵ����һ���¼����ݻ��ƣ��Ӷ�ʵ���˶�̬ˢ�¹��ܡ�

# ʹ�õ���ģ��



    springcloud-learning
    ������ consul-config-client -- ������ʾconsul��Ϊ�������ĵ�consul�ͻ���
    ������ consul-user-service -- ע�ᵽconsul���ṩUser����CRUD�ӿڵķ���
    ������ consul-service -- ע�ᵽconsul��ribbon������ò��Է���




# ��ĿԴ���ַ

https://github.com/macrozheng/springcloud-learning
# �ο�����
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud
https://github.com/macrozheng/springcloud-learning