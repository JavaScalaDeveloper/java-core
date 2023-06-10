starter��SpringBoot�е�һ���·���������Ч�Ľ�������Ŀ�������̵ĸ��ӳ̶ȣ����ڼ򻯿����������ŷǳ��õ�Ч��������ת����һƬ���£���ϸ������spring boot stater��ʲô������������ʲô��

Spring Boot Starter����SpringBoot����б��������һ�ָ��stackoverflow�����Ѿ����˸��������starter��ʲô�������뿴�����Ļش��[����](https://stackoverflow.com/a/28273660)��https://stackoverflow.com/questions/28273543/what-are-spring-boot-starter-jars/28273660#28273660��

![](https://images2018.cnblogs.com/blog/697611/201804/697611-20180409110042391-1447358002.png)

�����˼����˵starter��һ�ֶ�������synthesize���ϳɣ�������ʲô��˼�أ��ҿ��Ծٸ�������˵����

### �� ? ��ͳ������

��û��starter֮ǰ����������Ҫ��Spring��ʹ��jpa�����ҿ�����Ҫ�����²�����

1.  ��Maven������ʹ�õ����ݿ����������JDBC��jar��
2.  ����jpa������
3.  ��xxx.xml������һЩ������Ϣ
4.  �����ĵ���ֱ��������������

��Ҫע����ǣ��������������**_ÿ���½�һ����Ҫ�õ�jpa����Ŀ��ʱ����Ҫ�ظ�����һ��_**��Ҳ�����ڵ�һ���Լ�������Ŀ��ʱ������Google���Լ�������һ�������˰���ʱ�������˸�����ֵ�����֮��jpa���������������ˡ���Щ�о�����˻���OneNote�������ν�����Ŀ�Ĺ��̸���¼���������������Ĳ����Լ���Ҫ�õ��������ļ������ݣ�����һ���ٴ���jpa��Ŀ��ʱ�򣬾Ͳ���Ҫ�ٴ�ȥGoogle�ˣ�ֻ��Ҫ���űʼ�����֮���ٰ����е������ļ�copy&paste�Ϳ����ˡ�

�����������Ĳ���Ҳ���㲻�У���ʵ��������û��starter֮ǰ������ô�ɵģ������������м������⣺

1.  ������̱ȽϷ���������һ�������������ӳ���Ŀ�����
2.  ��ͣ��copy&paste������[Don��t repeat yourself](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)����
3.  �ڵ�һ�����õ�ʱ��������������߱Ƚ�С�ף�����Ҫ���ѵ�������ʱ��

### ����ʹ��Spring Boot Starter����Ч��

starter����ҪĿ�ľ���Ϊ�˽���������Щ���⡣

starter�����starter��������õ��������������������������˿������Լ�ȥ�����������������鷳����Ҫע����ǲ�ͬ��starter��Ϊ�˽����ͬ�����������������ڲ���ʵ�ֿ��ܻ��кܴ�Ĳ��죬����jpa��starter��Redis��starter����ʵ�־Ͳ�һ����������Ϊstarter�ı�������synthesize������һ�����߼�����ĳ���Ҳ�����������е�������Docker����Ϊ���Ƕ�������һ������װ���Ĳ����������֪��Docker��Ϊ�˽��ʲô����ģ�Ҳ���������Docker��starter��һ����ȡ�

starter��ʵ�֣���Ȼ��ͬ��starterʵ���������в��죬�������ǻ����϶���ʹ�õ�������ͬ�����ݣ�ConfigurationProperties��AutoConfiguration����ΪSpring Boot���š�Լ���������á���һ�����������ʹ��ConfigurationProperties���������ǵ����ã�������Щ���ö�������һ��Ĭ��ֵ����������û��������дԭʼ���õ�����£�Ĭ��ֵ�ͻ���Ч�����ںܶ�������Ƿǳ����õġ�����֮�⣬starter��ConfigurationProperties��ʹ�����е��������Ա��ۼ���һ���ļ��У�һ����resourcesĿ¼�µ�application.properties�����������Ǿ͸����Spring��Ŀ��XML������

starter�������߼���

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/697611-20180409110236645-2097376440.png)

�����starter������jar�������Լ��ֶ����õ�ʱ��������jar��û��ʲô��ͬ���������ǿ�����Ϊstarter��ʵ�ǰ���һЩ���������ò����������Լ������Ѽ򵥽������û������˰����û�ȥ���˷����Ĺ����������ڡ�Լ���������á��������£�ConfigurationProperties�������û���������ν�����ò�����������Ϊ?`application.properties`?�ļ��Ĵ��ڣ���ʹ��Ҫ�Զ������ã����е�����Ҳֻ��Ҫ��һ���ļ��н��У�ʹ�������ǳ����㡣

�˽���starter��ʵ���ǰ����û��������õĲ���֮��Ҫ���starter�ͱ�������starter�����֮�䲢���Ǿ�����ϵ�����Ǹ�����ϵ�������ǿ��Ը�һ���������һ��starter���������û���ʹ����������ʱ����ӵļ򵥷��㡣��������������ǿ��Ը�����һ�����е��������һ��starter���ñ�����ʹ����������ʱ����ӵļ򵥷��㣬��ʵ��Spring Boot�Ŷ��Ѿ��������д󲿷ֵ����е���������������ǵ�starter���������[����](https://github.com/spring-projects/spring-boot/tree/v1.5.7.RELEASE/spring-boot-starters)�鿴��Щstarter���б�

����springboot ��ô���˾�Ȼ����û�Զ����starter�����붼�������������Խ�������һ�¡�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/20230416200541.png)

# SpringBoot starter

SpringBoot�е�starter��һ�ַǳ���Ҫ�Ļ��ƣ��ܹ�������ǰ���ӵ����ã�����ͳһ���ɽ�starter��Ӧ����ֻ��Ҫ��maven������starter������SpringBoot�����Զ�ɨ�赽Ҫ���ص���Ϣ��������Ӧ��Ĭ�����á�starter�����ǰ����˸���������Ĵ�����Ҫ���ø�����Ϣ�����š�SpringBoot���Զ�ͨ��classpath·���µ��෢����Ҫ��Bean����ע���IOC������SpringBoot�ṩ������ճ���ҵӦ���з����ֳ�����spring-boot-starter����ģ�顣������Щ����ģ�鶼��ѭ��Լ�����׵�Ĭ�����ã����������ǵ�����Щ���ã�����ѭ��Լ���������á������

# �Զ���starter

�ճ���������ʱ��һЩ������ҵ��֮��Ĺ��ܻ�ģ�飬���������Ŀ���ã���һ����ĿҲҪ�ã����ÿ�ζ����¼��ɵĻ��ͻ���鷳����ʱ����ֻҪ����Щ���ܻ�ģ���װ��һ����starter�Ļ�����ʹ�õ�ʱ�������ȥ�ͺܷ����ˡ�

## �Զ���starter����

��ʵ�Զ���starter�ܼ򵥣�������Ҫ����5����

1.  �½�����ģ�飬�����淶�� springboot�Դ���starter�����淶Ϊspring-boot-starter-xxx�� �Զ����starter�����淶Ϊxxx-spring-boot-starter

�� xxx-spring-boot-autoconfigure���Զ����ú��Ĵ���
�� xxx-spring-boot-starter����������
�������Ҫ���Զ����ô���������������뿪��������Խ�������ϵ�һ��ģ���С�ֻ����springboot�ٷ����齫����ģ��ֿ���
2\. ����spring-boot-autoconfigure����
3\. �����Զ����XXXProperties ��: ���������Ը�����Ҫ��Ҫ�����������ļ��еġ�
4\. �����Զ����XXXAutoConfiguration�ࣺ�����Ҫ�����Զ�����ʱ��һЩ�߼���ͬʱҲҪ��XXXProperties ����Ч��
5\. �����Զ����spring.factories�ļ�����resources/META-INF����һ��spring.factories�ļ���spring-configuration-metadata.json��spring-configuration-metadata.json�ļ�����������д�����ļ�ʱ��������ʾ����Ҫ�ɲ�Ҫ���еĻ���ʾ�������Ѻá�spring.factories���ڵ����Զ������࣬����Ҫ��

## ʵ��

������Ϊ�˷����ֻ����һ��ģ���ˣ�

1.  ����һ��ģ�飬����Ϊspring-boot-starter-my-starter����Ӧpom�ļ�

```
	<groupId>com.example</groupId>
	spring-boot-starter-my-starter
	<version>1.0</version>
	<name>my-starter</name>
���ƴ���
```

1.  ����spring-boot-autoconfigure���� ������ʹ�õ�spring-boot-autoconfigure�汾��2.6.2

```
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        spring-boot-autoconfigure
        <version>2.6.2</version>
    </dependency>
</dependencies>
���ƴ���
```

1.  �����Զ����XXXProperties ��

```
@ConfigurationProperties(prefix = "com.arron")
public class MyStarterProperties {

    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
���ƴ���
```

�ٴ���һ��MyStarterConfig���ڶ�ȡMyStarterProperties �������

```
public class MyStarterConfig {

    private MyStarterProperties myStarterProperties;

    private String name;

    public MyStarterConfig(MyStarterProperties myStarterProperties) {
        this.myStarterProperties = myStarterProperties;
    }

    public String getName() {
        return myStarterProperties.getName();
    }

    public void setName(String name) {
        this.name = name;
    }
}
���ƴ���
```

1.  �����Զ����XXXAutoConfiguration��

```
@Configuration
// EnableConfigurationProperties value�����е�������������
@EnableConfigurationProperties(value = {MyStarterProperties.class})
public class MyStarterAutoConfiguration {

    @Autowired
    private MyStarterProperties myStarterProperties;

    @Bean
    @ConditionalOnMissingBean(MyStarterConfig.class)
    public MyStarterConfig myStarterConfig(){
        return new MyStarterConfig(myStarterProperties);
    }

}
���ƴ���
```

1.  ��resources/META-INF����һ��spring.factories�ļ�

spring.factories

```
org.springframework.boot.autoconfigure.EnableAutoConfiguration=com.example.myStarter.MyStarterAutoConfiguration
���ƴ���
```

spring-configuration-metadata.json

```
{
  "group": [
    {
      "name": "com.arron",
      "type": "com.example.myStarter.MyStarterProperties",
      "sourceType": "com.example.myStarter.MyStarterProperties"
    }
  ],
  "properties": [
    {
      "name": "com.arron.name",
      "type": "java.lang.String",
      "description": "my start name",
      "sourceType": "com.example.myStarter.MyStarterProperties",
      "defaultValue": "MyStarterProperties name"
    }
  ]
}
���ƴ���
```

## �������

�ҵ���ͼmaven�����install����װ������ ![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230416200527082.png)

Ȼ���½�һ����Ŀ�������в��ԣ�������Ŀ���̾Ͳ������ˡ�

1.  ��������

```
	<dependency>
       <groupId>com.example</groupId>
       spring-boot-starter-my-starter
       <version>1.0</version>
   </dependency>
���ƴ���
```

1.  �����ļ�������ԣ�

```
com:
  arron:
    name: myname
���ƴ���
```

1.  ��Ԫ���ԣ�

```
@RunWith(SpringRunner.class)
@SpringBootTest
class RabbitmqApplicationTests {
    @Autowired
    private MyStarterConfig myStarterConfig;

    @Test
    public void testMyStarter(){
        String name = myStarterConfig.getName();
        System.out.println(name);
    }
}
���ƴ���
```

����̨�����

```
myname
���ƴ���
```

���ˣ�һ�����Զ����springboot starter������ˡ�

# ע�����

������Щע�����Զ���starter�ǿ��ܻ��õ���

*   @Conditional������һ�������������жϣ���������������ע��bean
*   @ConditionalOnMissingBean����������bean������ʱ,��ʵ������ǰBean
*   @ConditionalOnProperty�������ļ������㶨��������򴴽�bean�����򲻴���
*   @ConditionalOnBean����������bean����ʱ,��ʵ������ǰBean
*   @ConditionalOnClass�� ����������������·���ϴ��ڣ���ʵ������ǰBean
*   @ConditionalOnMissingClass ������������������·���ϲ����ڣ���ʵ������ǰBean



���ߣ�������
���ӣ�https://juejin.cn/post/7127468724046528525
��Դ��ϡ�����
����Ȩ���������С���ҵת������ϵ���߻����Ȩ������ҵת����ע��������

