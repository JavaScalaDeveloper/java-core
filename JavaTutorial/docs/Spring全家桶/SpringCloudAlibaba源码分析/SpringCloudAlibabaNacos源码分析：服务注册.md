# һ�� Nacos����ע��Դ�����



* * *



## 1.1  Դ�뷽ʽ���



* * *



�ͻ���Դ�������Ӵ����ʽ����Դ��������







```<plugin>  <groupId>org.apache.maven.plugins</groupId>  maven-source-plugin  <version>3.2.1</version>  <configuration>  true  </configuration>  <executions>  <execution>  <phase>compile</phase>  <goals>  <goal>jar</goal>  </goals>  </execution>  </executions> </plugin> ```







Ȼ������







```mvn install -DskipTests ```







## 1.2 ���



* * *



[github.com/alibaba/nac��](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Falibaba%2Fnacos%2Ftree%2F1.4.1)

�������ǻ��Դ���������������ǻ�ͨ��Դ��ķ�ʽ���������� �����ͨ��debug�ķ�ʽ�����������ж��������й��̡�

���Ǵ�Դ��ĽǶ�������һ�£����������������ϱ���ע�����ģ�

NacosNamingService ���Ƿ���ע��ͷ�����ص��࣬�����������ｫ��ǰ�����ķ������ע��ʵ���ķ��������ǿ�һ�����������ʲô�ˣ�

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/fc004433c7304147905c088dd3227005.png "image.png")

![image-20211221124947544](E:\BaiduNetdiskWorkspace\springcloud alibaba\img\image-20211221124947544.png)

������ƴ����һЩ��������http���󣬵������ע�����Ľ��з��֣�����ľ������·����

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/51f5b45b70ef4a7dbe1258e05314fa61.png "image.png")

������Ƕ�Ӧ��·�������ǻص��ٷ��ĵ���ָ�ϵ���

[nacos.io/zh-cn/docs/��](https://link.juejin.cn?target=https%3A%2F%2Fnacos.io%2Fzh-cn%2Fdocs%2Fopen-api.html)

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/d3b30ba715ab4363b3ee8b4e21a2f3a2.png "image.png")

�ã��������ǽ�������Ͳ����������濴�ˣ����ǿ��Ե��ȥ��һ�£�

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/9f4bbf69cc1746e79545831252796e55.png "image.png")

�������ĵ��ø����������

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/b06c94937d374ddb9fc2c224e5932205.png "image.png")

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/d0d55d3616ad4109837d9aee36e5a946.png "image.png")

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/450565c4c14f4f3bb2097ab1ea69aae7.png "image.png")

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/527d2af9bb0c4206b090d3410238a576.png "image.png")

��������е���

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/3f3f39de5aaa4ad2b3ac7dccc33aa574.png "image.png")

������ͬѧ������ô֪���ϵ�ʹﵽ��������ǿ�һ�������鿴Դ���������·�������ǿ�һ�����Ƕ���΢�����·��������Ҫ����nacos�ķ����ֹ��ܣ�����Ҫ�������ǵ�discovery�İ�������һ��starter��ǰ������ѧ��springboot����֪���κ�starter����һ���и�spring.factories����Ϊһ�����

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/be47c62f16f94507a1af84d0169ebf53.png "image.png")

�����涯̬���ص���ܶ࣬NacosServiceRegistryAutoConfiguration �������������ܷ�������һ��nacos����ע����Զ������࣬

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/84017587439846a4b21a696f12775b6c.png "image.png")

������ʵ���������࣬���ǿ�һ�������NacosAUtoServiceRegistration

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/fe7ee87e88944b689835432c833972c2.png "image.png")

�Զ�ע���࣬���ǿ��Կ�һ�����ļ��ɹ�ϵ����һ��ApplicationListener  spring������ɺ󶼻ᷢ��һ����Ϣ��applicaitonListener����ͨ�����������ϢȻ�����ִ�еġ���������֪����һ������Ӧ����ô����

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/2a12ba62dae24aa092f97b0cff5dfaaa.png "image.png")

���Բ鿴���ĳ����ࡣ

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1f9253dbbbd349ffb6d0e60d0761b3ec.png "image.png")

�鿴onApplicationEvent�����������ڷ�������ͻᷢ������һ����Ϣ���յ������Ϣ�ͻ�������bind����

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/41a7323a2e2c49d19aaf5768e66af7d8.png "image.png")

�����и�if return ���Ǿ�ֱ����������һ���Ƿ�֧���룬�������ķ�֧�������ǾͲ�Ҫ������һ ��Ҫ�����ߣ���������ֱ�ӿ������start�����������������û�ж�Ӧ�Ĵ����߼����ǿ��Խ��������֧������ �ã�������start, begin��init��register�������Ǻ���Ҫ�ķ���������һ��Ҫ��ȥ��

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/3923ffd589e9488eb1143811a50d28c0.png "image.png")

��һ��if�Ͳ��ÿ����ڶ���if��Ҫ������Ϊ�����û���߼����㿴���register()��Ӧ�þ��������������Ϊ����ǲ鿴ע������̡�

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/d5b527e0900a4f1b9abcd76db4bfc138.png "image.png")

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/d3501fdf6479417180e881c38638bdac.png "image.png")

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7c0ea798fcd7404d8f350047e947add1.png "image.png")

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/0ca3ab1a98f248a0aa3854730eba85fb.png "image.png")

������Ҫ��֪��SpringBoot�Զ�װ��Ļ���֪ʶ�����Ҫ֪��Spring�������ֵ� ����֪ʶ��

## 1.3 ����ע��



* * *



Nacos�߲���֧���첽�������ڴ��������

�ղ����ڷ����ṩ�����潲�����ݣ��������Ƿ���ע����������һ��

�������instanceʵ���������һ��springmvc��controller���������ǿ���ȫ������ Controller��������instanceʵ���ɣ�������������InstanceController

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/4e02f16787a84704add5aa41f9d7662a.png "image.png")

��֮ǰ�����õ���post�����������ǲ鿴post������������delete,update...,��������ʲô��� restFul

���Ƿ�������û�ж�Ӧ��DefaultGroup���ڷ���ע��ͷ��ֵ���������group�ǲ������õġ����õĻ�ֻ���Լ��Ĺ淶�ͷ������ġ��ڷ���ע��ͷ�����Դ���ж�û���á��������ռ䣬��������Ȼ�����ǲ���ת��Ϊʵ����������Ƿ���ģ���е�����ģ�͡�

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/09f059ba31a7444a88a24b03399d502d.png "image.png")

�����ǿ�һ������ע��ʵ����������ʲô�� ����������ע��������ע��instance�����Ǿ�Χ�����������з������ǲ��Ǿ�����addInstance��

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/4b69913abe6f40288a08dee89ecb0772.png "image.png")

createEmptyService

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/b8a3063b3c924ee195af64d5d8efa647.png "image.png")

1����ȡservice ���λ�ȡһ��Ϊ�գ����ǿ��Խ�ȥ����һ��

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/fdf453ebadee486c9def86560bc3b8de.png "image.png")

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/7025fb4edcc247b3aca0f1f851d26203.png "image.png")

�������ע�������ǰ��˵��nacos��������ģ�͡����Բο�ͼ�������map���Ƕ�Ӧ��ע���

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/4f1db03d3fcc4f93aaa17cc485fb59c2.png "image.png")

���������÷���ͳ�ʼ��

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1af3a9015b2c4e1ab06da283e4dc5332.png "image.png")

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/cb795dd33b114f84bc51cdbdca5af202.png "image.png")

�����ʼ��������

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/0d0583abf0184ed49bf5fd93c9effafe.png "image.png")

�������Ǹ�scheduleNamingHealth��һ����ʱ��������ֻ��Ҫ��һ��task����Ϳ���

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/51ba8120a9954389b9e2f44d49532a14.png "image.png")

task����������Ҫ��һ��run������

���������ǿ��ǻ�ȡ���е�ʵ�������Ե��ȥ��һ�¡�

��ǰʱ�� -  �ϴ�����ʱ�� �������15�� ��ʵ������Ϊ�ǽ����� ������30��û���յ�������ֱ���޳�

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/f9131eea860e410685d8c4cd5beea69e.png "image.png")

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/586fd2fcb489414590295ce2dfafd91d.png "image.png")

�ã����ǻ�����������������ر�ã�createEmtyService���Ǵ���һ���շ��񣬺������ǵ�ʵ�����ǲ��ǻ���ע�ᵽ���棬

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/9518406856b642298d3ee2f16e36bed0.png "image.png")

> ���ǿ��Կ�һ�·���ģ�ͣ���������ǰ˵����һ��
>
> �����ռ� ��cluster ��Ⱥ����
>
> ![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/0323827c8249417b8ab3fd6c4bd3e61e.png "image.png")
>
> ![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/044d8f58dc5b4c7e83dab05c62397566.png "image.png")
>
> ��Ⱥ�ж�Ӧ��ʵ����
>
> ![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/da6adcbf25f44992b08f919988f81b62.png "image.png")

���ǿ�һ��addinstance

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/cb9d4cb8fd4d4f0aa75e5d95c4923aae.png "image.png")

������Ӧ��key:







```String key = KeyBuilder.buildInstanceListKey(namespaceId, serviceName, ephemeral); ```







![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/6ab491f925e3403fa1377c2649d4721d.png "image.png")







```//��ȡע��ʵ����IP�˿��б� List<Instance> instanceList = addIpAddresses(service, ephemeral, ips); ```







���ǽ���򵥵Ŀ�һ�£����Ƿ������add,remove����������������Ƴ�ʵ��

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/bebd689b54d04e0dab0e64ac552e965e.png "image.png")

������Ҫ������дע�������ips�������Ǿ͵��ips����������ʾ������Ȼ���������ѭ��instance���������ǿ��Կ�����������Ƴ��ʹ�map�����Ƴ���ȥ���������������instanceMap������һ�£�����ڷ��ء�

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/4d797c90012b4c22ac6e999bdfad8d63.png "image.png")

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/158d309e86084a76be392ac8b67ccb94.png "image.png")

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/04b51596154e4d4b933a39f0eb249587.png "image.png")

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/86453757688743df89df30752bbbe0e5.png "image.png")

���࣬���ǿ��Բ²�һ�£�����debug��ȥ����Ȼ����࣬���ǵ��һ�£��������ĵط�

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/f7a189074e00495da10119f2a5de7bc5.png "image.png")

��ָ�������ƣ�

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/c54ca72e12e04d80b189d587a535d834.png "image.png")

�ã�����ȫ��������һ�£�

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/2b24cf84302c42669bed76d19a11e301.png "image.png")

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/fcf6ffab779548a694a68c443a90a214.png "image.png")

����֪��ǰ��˵��ephemeral��true����ѡ���һ���� �����ʣ�

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/4adb989d26cf46f98c943a114e047679.png "image.png")

����Ӧ�õ���EphemeralConsistencyService��Ӧ��put����������EphemeralConsistencyServiceֻ��һ���ӿڣ�����Ӧ�õ��ö�Ӧ��ʵ��ʵ����

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/87869280d709441fbb8ceec818d67a97.png "image.png")

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/3764ecf8f5904315af85482f3c3ee71d.png "image.png")

���ǿ�һ������onput������

���ڷŵ������У�

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/02a34386b7444f0e8a6e35e57ceedf84.png "image.png")

��������ǰѺ��ĵ�����ŵ�blockquene���棬Ҳ����һ������������

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/81b1c141753c492493eb095ead9e34da.png "image.png")

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/252863f614a24c2da64713af52669ce5.png "image.png")

����ע��Ĺ��̾���ô�򵥣�һ��������������ս�����ע������󣬷ŵ����ǵ��������е��У��ŵ���ɫ����֮�������������оͷ����ˡ��Ƿŵ���������֮�������з�������������С�

���ע�����Notifier��һ���̣߳���ʦ�����һ�����ɣ��������һ���߳̾���Ҫ������run������Ϊrun���������� ����ִ�д���ĵط���

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/659d96fac1d445859a6ea6086ab8277c.png "image.png")

�����������ѭ���������ݴ������ϵĴ���ͻ���ע�����Ϣ����������ʵ�ֺ�����첽ע����Ϣ��

����̻߳�һֱ��ת��һֱ���У������������˵����������͹ҵ��ˣ��ã��㿴��������쳣Ҳ�Ե��ˣ�����һֱ�����У����û�����������������������ó�cpu

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/487a2e6d15f642549fe0d145447cc5cf.png "image.png")

ע���ṹ�ķ�����

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/3eab037db7e2480ba4a9b439b18567da.png "image.png")

���ȵ����Ǹ�change��ʱ�����Ǿͽ���onChange�����Ǹ������������ǽ�������service����ȥ����

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/4adf69d76188430d860f2003b6c508d6.png "image.png")

������Ͳ��ÿ��ˣ��ȿ�Ȩ�أ�Ȩ�ش��ڶ��ٵ�ʱ���������ֵ��Ȩ��С�ڶ��ٵ�ʱ������һ����Сֵ��Ȼ����Ǻ��ĵķ���updateIP

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/887332bfdcb64c2f9ad871ee55961b59.png "image.png")

�����updateIPs����ʲô�أ� ���ľ����ұ���������Ҫע���ʵ����Ȼ��ͷŵ����ǵ�clusterMap����

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/87df4508357847f1ab49a785ab464e5b.png "image.png")

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/b31cf0150533469ebd4fbc462c6a0952.png "image.png")

�ǵ������ҿ��ܾ��������ˣ���ʲôʱ����������̣߳���ʵʱ����������Ϣ�����������أ� �̴�������һ������������������ڿ��Ÿ����Notifier����Ϊ���������һ���̣߳����ᶪ��һ���̳߳��н������У����ǿ�һ����������������ʵ�����ģ�

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/16223a5f9aab4fdaa004d0698e6cb0a6.png "image.png")

���ǿ���������������ע����ǵ����spring��һ������г�ʼ��֮����е��õģ������ǿ�һ�����init��������������ʲô

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/b9d2a25274834d73ab8f939006e9b075.png "image.png")

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/64f25704efac43a7ae6ee5afda46cdf7.png "image.png")

��һ��Scheduled�̳߳أ�

![image-20211222222903941](E:\BaiduNetdiskWorkspace\springcloud alibaba\img\image-20211222222903941.png)

Ҳ�����ڶ����ʼ����ʱ��ͽ�������һ���̳߳أ�ȥ����notifier��Ӧ�ķ��������run������������run�ġ�������ͻ�ʵʱ�����첽���С�����д�ĺô������ǽ�д�ʹ�����ȫ�����ˡ�ͨ�����������ܵ��ڴ���У�������������飬�������ĺô���1���������

![image.png](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/e27c8e72b30845c3ab9346b89932fb42.png "image.png")

# �ο�����
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud
https://github.com/macrozheng/springcloud-learning