# SpringBoot���� - �����Ȳ���devtools����

> ��SpringBoot���������У������ÿ�д�����޸Ķ���Ҫ���������ٵ��ԣ����ܱȽϷ�ʱ�䣻SpringBoot�Ŷ���Դ������ṩ��spring-boot-devtools�����devtools�����������ͼ�����������Ե�Ч�ʡ�@pdai

*   [SpringBoot���� - �����Ȳ���devtools����](#springboot%E5%85%A5%E9%97%A8---%E9%85%8D%E7%BD%AE%E7%83%AD%E9%83%A8%E7%BD%B2devtools%E5%B7%A5%E5%85%B7)
    *   [׼��֪ʶ��](#%E5%87%86%E5%A4%87%E7%9F%A5%E8%AF%86%E7%82%B9)
        *   [ʲô���Ȳ�����ȼ��أ�](#%E4%BB%80%E4%B9%88%E6%98%AF%E7%83%AD%E9%83%A8%E7%BD%B2%E5%92%8C%E7%83%AD%E5%8A%A0%E8%BD%BD)
        *   [ʲô��LiveLoad��](#%E4%BB%80%E4%B9%88%E6%98%AFliveload)
    *   [����devtoolsʵ���Ȳ���](#%E9%85%8D%E7%BD%AEdevtools%E5%AE%9E%E7%8E%B0%E7%83%AD%E9%83%A8%E7%BD%B2)
        *   [POM����](#pom%E9%85%8D%E7%BD%AE)
        *   [IDEA����](#idea%E9%85%8D%E7%BD%AE)
        *   [application.yml����](#applicationyml%E9%85%8D%E7%BD%AE)
        *   [ʹ��LiveLoad](#%E4%BD%BF%E7%94%A8liveload)
    *   [��һ�����](#%E8%BF%9B%E4%B8%80%E6%AD%A5%E7%90%86%E8%A7%A3)
        *   [devtool��ԭ��Ϊ�λ��Զ�������](#devtool%E7%9A%84%E5%8E%9F%E7%90%86%E4%B8%BA%E4%BD%95%E4%BC%9A%E8%87%AA%E5%8A%A8%E9%87%8D%E5%90%AF)
        *   [devtool�Ƿ�ᱻ�����Jar��](#devtool%E6%98%AF%E5%90%A6%E4%BC%9A%E8%A2%AB%E6%89%93%E5%8C%85%E8%BF%9Bjar)
        *   [devtoolΪ�λ�Ĭ�Ͻ��û���ѡ�](#devtool%E4%B8%BA%E4%BD%95%E4%BC%9A%E9%BB%98%E8%AE%A4%E7%A6%81%E7%94%A8%E7%BC%93%E5%AD%98%E9%80%89%E9%A1%B9)
        *   [devtool�Ƿ���Ը�����SpringbootӦ����ȫ�ֵ����ã�](#devtool%E6%98%AF%E5%90%A6%E5%8F%AF%E4%BB%A5%E7%BB%99%E6%89%80%E6%9C%89springboot%E5%BA%94%E7%94%A8%E5%81%9A%E5%85%A8%E5%B1%80%E7%9A%84%E9%85%8D%E7%BD%AE)
        *   [����Ҳ���devtool������ʲôѡ��](#%E5%A6%82%E6%9E%9C%E6%88%91%E4%B8%8D%E7%94%A8devtool%E8%BF%98%E6%9C%89%E4%BB%80%E4%B9%88%E9%80%89%E6%8B%A9)
    *   [ʾ��Դ��](#%E7%A4%BA%E4%BE%8B%E6%BA%90%E7%A0%81)
    *   [�ο�����](#%E5%8F%82%E8%80%83%E6%96%87%E7%AB%A0)

## [#](#׼��֪ʶ��) ׼��֪ʶ��

### [#](#ʲô���Ȳ�����ȼ���) ʲô���Ȳ�����ȼ��أ�

> �Ȳ�����ȼ�������Ӧ���������е�ʱ���Զ����£����¼��ػ����滻class�ȣ�Ӧ�õ�һ����������PS��spring-boot-devtools�ṩ�ķ���Ҳ��Ҫ�����ģ�ֻ�������ֶ�������ʵ���Զ����ض��ѡ���

�ϸ������ϣ�������Ҫ�������Ȳ�����ȼ���, ����Java��Ŀ���ԣ�

*   **�Ȳ���**

    *   �ڷ���������ʱ���²�����Ŀ
    *   ����ֱ�����¼�������Ӧ�ã����ַ�ʽ���ͷ��ڴ棬���ȼ��ظ��Ӹɾ����ף���ͬʱҲ����ʱ�䡣
*   **�ȼ���**

    *   ��������ʱ���¼���class���Ӷ�����Ӧ�á�
    *   �ȼ��ص�ʵ��ԭ����Ҫ����[java������ػ���](/md/java/jvm/java-jvm-classload.html)����ʵ�ַ�ʽ���Ը���Ϊ������������ʱ����һ����̨�̣߳���ʱ�ļ�����ļ���ʱ����仯��������ʱ�������ˣ������������롣
    *   �Աȷ�����ƣ�������������ʱ��ȡ����Ϣ��ͨ����̬�ĵ������ı������Ϊ�� �ȼ�������������ʱͨ�����¼��ظı�����Ϣ��ֱ�Ӹı������Ϊ��

### [#](#ʲô��liveload) ʲô��LiveLoad��

LiveLoad���ṩ������ͻ����Զ����ظ��µĹ��ߣ���ΪLiveLoad��������Liveload�������������֣� devtools���Ѿ�������LiveLoad������������������ǿ�������webӦ�ã���������������Զ�ˢ�£� ��ʱ����Կ���LiveLoad.

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/20230416205152.png)

ͬһʱ��ֻ������һ��LiveReload�������� ��ʼӦ�ó���֮ǰ����ȷ��û������LiveReload�������������С������IDE�������Ӧ�ó�����ֻ�е�һ��Ӧ�ó���֧��LiveReload��

## [#](#����devtoolsʵ���Ȳ���) ����devtoolsʵ���Ȳ���

> ����ͨ������������ʵ���Զ�������ʽ���Ȳ���

### [#](#pom����) POM����

���spring-boot-devtools������



```
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        spring-boot-devtools
        <optional>true</optional> <!-- ���Է�ֹ��devtools�������ݵ�����ģ���� -->
    </dependency>
</dependencies>

```



### [#](#idea����) IDEA����

> �����ʹ��IDEA�������ߣ�ͨ�����������ַ�ʽ��

*   ��ʽһ�� **���κ�����ʱ���ֶ������������£�Ctrl+F9��**

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/20230416205320.png)
��Ҳ������`mvn compile`���봥���������£�

*   ��ʽ���� **IDEA�迪������ʱ���룬�Զ���������**

**����1**��

File->Setting->Build,Execution,Deployment->Compile

��ѡ��Make project automatically

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/20230416205335.png)

**����2**��

��ݼ���ctrl+alt+shift+/

ѡ��Registry

��ѡ��compiler.automake.allow.when.app.running

�°汾��IDEA������File->setting->Advanced Setttings����ĵ�һ�����ã�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/20230416205405.png)
### [#](#application-yml����) application.yml����



```
spring:
  devtools:
    restart:
      enabled: true  #���ÿ����Ȳ���
      additional-paths: src/main/java #����Ŀ¼
      exclude: WEB-INF/**
  thymeleaf:
    cache: false #ʹ��Thymeleafģ�����棬�رջ���

```



### [#](#ʹ��liveload) ʹ��LiveLoad

spring-boot-devtoolsģ�����**Ƕ��ʽLiveReload������**����������Դ����ʱ���ڴ��������ˢ�¡� LiveReload�������չ����֧��Chrome��Firefox��Safari������Դ�livereload.com������ء�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/20230416205417.png)
���ߴ����������������أ�����firefox:

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/20230416205426.png)

��װ��֮�󣬿���ͨ������ͼ�����

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/20230416205442.png)

����㲻����Ӧ�ó�������ʱ����LiveReload������������Խ�spring.devtools.livereload.enabled��������Ϊfalse ��

ͬһʱ��ֻ������һ��LiveReload�������� ��ʼӦ�ó���֮ǰ����ȷ��û������LiveReload�������������С������IDE�������Ӧ�ó�����ֻ�е�һ��Ӧ�ó���֧��LiveReload��

## [#](#��һ�����) ��һ�����

> ��ȻһЩ�����߻�ʹ��devtool���ߣ����Ǻ������ܹ��������ģ�������������¼������⣬�������һ����⡣@pdai

### [#](#devtool��ԭ��-Ϊ�λ��Զ�����) devtool��ԭ��Ϊ�λ��Զ�������

> Ϊʲôͬ��������Ӧ�ã�Ϊʲô���ֶ����������ǽ���ʹ��spring-boot-devtools�����Ȳ���������

spring-boot-devtoolsʹ���������������ClassLoader��һ��ClassLoader���ز��ᷢ�����ĵ��ࣨ������jar��������һ��ClassLoader��restart ClassLoader�����ػ���ĵ��ࣨ�Զ�����ࣩ��

��̨����һ��**�ļ������̣߳�File Watcher��**��**����Ŀ¼�е��ļ������䶯ʱ�� ԭ����restart ClassLoader���������������¼����µ�restart ClassLoader**��

��Ϊ�ļ��䶯�󣬵�����jar���������¼��أ�ֻ�����Զ�����࣬���ص���Ƚ��٣����������ȽϿ졣

��Ҳ��Ϊʲô��ͬ��������Ӧ�ã�Ϊʲô���ֶ�����������ʹ��spring-boot-devtools�����Ȳ���������

���Զ��������м�����Ҫע��:

*   **�Զ��������¼��־��**

����¼��ʲô�������������־��

����ͨ�����¹ر�



```
spring:
  devtools:
    restart:
      log-condition-evaluation-delta: false

```



*   **�ų�һЩ����Ҫ�Զ���������Դ**

ĳЩ��Դ�ڸ���ʱ��һ����Ҫ��������������Ĭ������£��ı���Դ/META-INF/maven��/META-INF/resources��/resources��/static��/public����/templates������������������ȷ�ᴥ���ֳ���װ�����Ҫ�Զ�����Щ�ų������ʹ�ø�spring.devtools.restart.exclude���ԡ����磬Ҫ���ų�/static��/public�㽫�����������ԣ�



```
spring:
  devtools:
    restart:
      exclude: "static/**,public/**"

```



���Ҫ������ЩĬ��ֵ����������ų������ø�spring.devtools.restart.additional-exclude���ԡ�

*   **�Զ��������������**

����������ͨ��ʹ���������������ʵ�ֵġ����ڴ����Ӧ�ó������ַ���Ч���ܺá����ǣ�����ʱ�ᵼ����������⡣

Ĭ������£�IDE �е��κδ���Ŀ��ʹ�á�����������������أ��κγ���.jar�ļ���ʹ�á�����������������ء�����㴦��һ����ģ����Ŀ�����Ҳ���ÿ��ģ�鶼���뵽��� IDE �У��������Ҫ�Զ���һЩ������Ϊ�ˣ�����Դ���һ��META-INF/spring-devtools.properties�ļ���

��spring-devtools.properties�ļ����԰�����restart.exclude��Ϊǰ׺������restart.include����includeԪ����Ӧ�ñ����ߵ����������������������Ŀ���Լ�excludeҪ����Ӧ���������롰Base�������������Ŀ�������Ե�ֵ��Ӧ������·����������ʽģʽ��������ʾ����ʾ��



```
restart:
  exclude:
    companycommonlibs: "/mycorp-common-[\\w\\d-\\.]+\\.jar"
  include:
    projectcommon: "/mycorp-myproj-[\\w\\d-\\.]+\\.jar"

```



������ص���Ϣ������[�������´��ڴ�](https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.devtools)�鿴��

### [#](#devtool�Ƿ�ᱻ�����jar) devtool�Ƿ�ᱻ�����Jar��

> devtoolԭ������˵Ӧ����ֻ�ڿ������Ե�ʱ��ʹ�ã�����������������jar��ʱ�ǲ���Ҫ�ģ�����Spring����᲻��������JAR��

*   **Ĭ������£����ᱻ�����JAR**

���д����Ӧ�ó���ʱ��������Ա����**���Զ�����**�������ͨ�� java -jar����������������������������ʱ�����ᱻ��Ϊ�ǡ�����������Ӧ�á���

*   **�����������Զ�̵���Ӧ��**

��_�����������ã�ֻ���������ε����������л�ʹ�� SSL ���б���ʱ����Ӧ������_��

����������£�devtoolҲ�߱�Զ�̵��Ե�������Զ�̿ͻ���Ӧ�ó���ּ�ڴ���� IDE �����С�����Ҫorg.springframework.boot.devtools.RemoteSpringApplicationʹ���������ӵ�Զ����Ŀ��ͬ����·�����С�Ӧ�ó����Ψһ��������������ӵ���Զ�� URL��

���磬���ʹ�� Eclipse �� Spring Tools����������һ��my-app�Ѳ��� Cloud Foundry ����Ϊ����Ŀ��ִ�����²�����

1.  ѡ��Run Configurations��?��Run�˵���
2.  ����һ���µ�Java Application���������á���
3.  ���my-app��Ŀ��
4.  ʹ��org.springframework.boot.devtools.RemoteSpringApplication��Ϊ���ࡣ
5.  ���https://myapp.cfapps.io��Program arguments�����κ����Զ�� URL����

�������е�Զ�̿ͻ��˿��������������б�



```
  .   ____          _                                              __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _          ___               _      \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` |        | _ \___ _ __  ___| |_ ___ \ \ \ \
 \\/  ___)| |_)| | | | | || (_| []::::::[]   / -_) '  \/ _ \  _/ -_) ) ) ) )
  '  |____| .__|_| |_|_| |_\__, |        |_|_\___|_|_|_\___/\__\___|/ / / /
 =========|_|==============|___/===================================/_/_/_/
 :: Spring Boot Remote :: 2.5.4

2015-06-10 18:25:06.632  INFO 14938 --- [           main] o.s.b.devtools.RemoteSpringApplication   : Starting RemoteSpringApplication on pwmbp with PID 14938 (/Users/pwebb/projects/spring-boot/code/spring-boot-project/spring-boot-devtools/target/classes started by pwebb in /Users/pwebb/projects/spring-boot/code)
2015-06-10 18:25:06.671  INFO 14938 --- [           main] s.c.a.AnnotationConfigApplicationContext : Refreshing org.springframework.context.annotation.AnnotationConfigApplicationContext@2a17b7b6: startup date [Wed Jun 10 18:25:06 PDT 2015]; root of context hierarchy
2015-06-10 18:25:07.043  WARN 14938 --- [           main] o.s.b.d.r.c.RemoteClientConfiguration    : The connection to http://localhost:8080 is insecure. You should use a URL starting with 'https://'.
2015-06-10 18:25:07.074  INFO 14938 --- [           main] o.s.b.d.a.OptionalLiveReloadServer       : LiveReload server is running on port 35729
2015-06-10 18:25:07.130  INFO 14938 --- [           main] o.s.b.devtools.RemoteSpringApplication   : Started RemoteSpringApplication in 0.74 seconds (JVM running for 1.105)

```



### [#](#devtoolΪ�λ�Ĭ�Ͻ��û���ѡ��) devtoolΪ�λ�Ĭ�Ͻ��û���ѡ�

> Spring Boot ֧�ֵ�һЩ��**ʹ�û������������**�����磬ģ�����滺���ѱ����ģ���Ա����ظ�����ģ���ļ������⣬Spring MVC �������ṩ��̬��Դʱ����Ӧ��� HTTP �����ͷ��

��Ȼ����**�������зǳ����棬���ڿ��������п��ܻ��ʵ��䷴**��ʹ���޷������ո���Ӧ�ó����������ĸ��ġ��������ԭ�� spring-boot-devtools Ĭ�Ͻ��û���ѡ�

����Thymeleaf �ṩ��spring.thymeleaf.cache������ģ������Ļ��棬ʹ��spring-boot-devtoolsģ��ʱ�ǲ���Ҫ�ֶ�������Щ���Եģ���Ϊspring-boot-devtools���Զ��������á�

��ô���Զ�������Щ�����أ��������DevToolsPropertyDefaultsPostProcessor���ҵ���Ӧ��Ĭ�����á�



```
public class DevToolsPropertyDefaultsPostProcessor implements EnvironmentPostProcessor {

	static {
		Map<String, Object> properties = new HashMap<>();
		properties.put("spring.thymeleaf.cache", "false");
		properties.put("spring.freemarker.cache", "false");
		properties.put("spring.groovy.template.cache", "false");
		properties.put("spring.mustache.cache", "false");
		properties.put("server.servlet.session.persistent", "true");
		properties.put("spring.h2.console.enabled", "true");
		properties.put("spring.web.resources.cache.period", "0");
		properties.put("spring.web.resources.chain.cache", "false");
		properties.put("spring.template.provider.cache", "false");
		properties.put("spring.mvc.log-resolved-exception", "true");
		properties.put("server.error.include-binding-errors", "ALWAYS");
		properties.put("server.error.include-message", "ALWAYS");
		properties.put("server.error.include-stacktrace", "ALWAYS");
		properties.put("server.servlet.jsp.init-parameters.development", "true");
		properties.put("spring.reactor.debug", "true");
		PROPERTIES = Collections.unmodifiableMap(properties);
	}

```



��Ȼ����㲻�뱻Ӧ�����Ա�spring-boot-devtoolsĬ�����ã� ����ͨ��spring.devtools.add-properties��false��application.yml�С�

### [#](#devtool�Ƿ���Ը�����springbootӦ����ȫ�ֵ�����) devtool�Ƿ���Ը�����SpringbootӦ����ȫ�ֵ����ã�

> ����ͨ����spring-boot-devtools.yml�ļ���ӵ�$HOME/.config/spring-bootĿ¼��**����ȫ�� devtools ����**��

��ӵ���Щ�ļ����κ����Զ��������������ʹ�� devtools ������Spring Boot Ӧ�ó������磬Ҫ��������������Ϊʼ��ʹ�ô������ļ�������Ҫ������������ӵ����spring-boot-devtools�ļ��У�



```
spring:
  devtools:
    restart:
      trigger-file: ".reloadtrigger"

```



### [#](#����Ҳ���devtool-����ʲôѡ��) ����Ҳ���devtool������ʲôѡ��

> ����Ҳ���devtool������ʲôѡ��

**��ʵ�ʵĿ��������У���Ҳ����ȥʹ��devtool����**, ��Ϊ��

*   devtool�������������ʽ��������Ȼ�������������滻������JRebel���ǣ������շѵģ�
*   ������������Ҫ�Ļ���һ��Ȩ��
    *   �Զ������Ŀ���������ֶ�����û��ʲô̫������ô�������ֶ�����������������
    *   ��������£������**�����ڲ����޸Ļ��߾�̬��Դ���޸�**����IDEA���ǿ���ͨ��Rebuild��Ctrl + Shift + F9�������ȸ���

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/20230416211745.png)

*   ���⻹��һ������spring loaded�� ��ʵ���޸����ļ����Ȳ��𣬾���ɿ���[github��ַ���´��ڴ�](https://github.com/spring-projects/spring-loaded)�ϵ�˵����

## [#](#ʾ��Դ��) ʾ��Դ��

https://github.com/realpdai/tech-pdai-spring-demos

## [#](#�ο�����) �ο�����

https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.devtools

https://liayun.blog.csdn.net/article/details/116541775

* * *

����Ȩ��@pdai���� ԭ�����ӣ�https://pdai.tech/md/spring/springboot/springboot-x-hello-devtool.html