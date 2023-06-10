## 4\. ��־





Spring Boot�������ڲ���־��ʹ�� [Commons Logging](https://commons.apache.org/logging) �����Եײ���־��ʵ�ֱ��ֿ��š� Ϊ [Java Util Logging](https://docs.oracle.com/javase/17/docs/api/java/util/logging/package-summary.html) �� [Log4j2](https://logging.apache.org/log4j/2.x/) �� [Logback](https://logback.qos.ch/) �ṩ��Ĭ�����á� ��ÿһ������£���¼����logger������Ԥ��Ϊʹ�ÿ���̨�����Ҳ����ѡ��������ļ���





Ĭ������£������ʹ�� ��Starter������Ĭ��ʹ��Logback�� �ʵ���Logback·��Ҳ�������ڣ���ȷ��ʹ��Java Util Logging��Commons Logging��Log4J��SLF4J�������ⶼ����ȷ������





|  | �кܶ�������Java����־��ܡ� ���������б������ܻ��ң��벻Ҫ���ġ� һ����˵���㲻��Ҫ�ı������־������Spring Boot��Ĭ��ֵ�ͺܺ��á� |
| --- | --- |





|  | ��������Ӧ�ó�����һ��servlet������Ӧ�÷�����ʱ����Java Util Logging APIִ�е���־���ᱻ���͵����Ӧ�ó������־�С� ����Է�ֹ�������������Ѿ���������Ӧ�ó���ִ�е���־���������Ӧ�ó������־�С� |
| --- | --- |





### [](https://springdoc.cn/spring-boot/features.html#features.logging.log-format)4.1\. ��־��ʽ



Spring Boot��Ĭ�ϵ���־�����ʽ��������������ӡ�







 2023-03-03T21:18:18.827+08:00  INFO 19388 --- [           main] o.s.b.d.f.s.MyApplication                : Starting MyApplication using Java 17 with PID 19388 (/opt/apps/myapp.jar started by myuser in /opt/apps/)
2023-03-03T21:18:18.834+08:00  INFO 19388 --- [           main] o.s.b.d.f.s.MyApplication                : No active profile set, falling back to 1 default profile: "default"
2023-03-03T21:18:20.439+08:00  INFO 19388 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)
2023-03-03T21:18:20.461+08:00  INFO 19388 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2023-03-03T21:18:20.461+08:00  INFO 19388 --- [           main] o.apache.catalina.core.StandardEngine    : Starting Servlet engine: [Apache Tomcat/10.1.5]
2023-03-03T21:18:20.600+08:00  INFO 19388 --- [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2023-03-03T21:18:20.602+08:00  INFO 19388 --- [           main] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 1685 ms
2023-03-03T21:18:21.078+08:00  INFO 19388 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path ''
2023-03-03T21:18:21.093+08:00  INFO 19388 --- [           main] o.s.b.d.f.s.MyApplication                : Started MyApplication in 2.998 seconds (process running for 3.601) 







�������Ŀ���¡�





*   Date��ʱTime����ȷ�����룬��������

*   ��־����: `ERROR`, `WARN`, `INFO`, `DEBUG`, �� `TRACE`.

*   ����ID��

*   һ�� `---` �ָ�����������ʵ����־��Ϣ�Ŀ�ʼ��

*   �߳����ƣ������ڷ������У����ڿ���̨������ܻᱻ�ضϣ���

*   ��¼�����ƣ���ͨ����Դ������ƣ�ͨ������д����

*   ��־��Ϣ��





|  | Logbackû�� `FATAL` ���� ����ӳ�䵽 `ERROR`�� |
| --- | --- |







### [](https://springdoc.cn/spring-boot/features.html#features.logging.console-output)4.2\. ����̨���



Ĭ������£���־����� `ERROR`��`WARN` �� `INFO` �������Ϣ������̨�� ��Ҳ����ͨ���� `--debug` ��־�������Ӧ�ó��������� `debug` ģʽ��







```
$ java -jar myapp.jar --debug
```







|  | ��Ҳ��������� `application.properties` ��ָ�� `debug=true`�� |
| --- | --- |





��debugģʽ������ʱ��һЩ���ļ�¼����Ƕ��ʽ������Hibernate��Spring Boot��������Ϊ���������Ϣ�� ����debugģʽ������ζ�Ž����Ӧ�ó�������Ϊ�� `DEBUG` �����¼������Ϣ��





���⣬�����ͨ��������Ӧ�ó���ʱʹ�� `--trace` ��־������ `application.properties` ��ʹ�� `trace=true` �������� ��trace�� ģʽ�� ���������Զ�һЩ���ļ�¼����Ƕ��ʽ������Hibernate schema���ɺ�����Spring��ϣ����и��ټ�¼��





#### [](https://springdoc.cn/spring-boot/features.html#features.logging.console-output.color-coded)4.2.1\. ��ɫ��������



�������ն�֧��ANSI���ͻ�ʹ�ò�ɫ����������Ķ��� ����Խ� `spring.output.ansi.enabled` ����Ϊ [֧�ֵ�ֵ](https://docs.spring.io/spring-boot/docs/3.1.0-SNAPSHOT/api/org/springframework/boot/ansi/AnsiOutput.Enabled.html)���Ը����Զ���⡣





��ɫ������ͨ��ʹ�� `%clr` ת���ؼ��������õġ� ������򵥵���ʽ�У�ת����������־��������������ɫ�����������������ʾ��







```
%clr(%5p)
```







�±���������־��������ɫ��ӳ���ϵ��



<colgroup><col><col></colgroup>
| ��־���� | ��ɫ |
| --- | --- |
| `FATAL` | �� |
| `ERROR` | �� |
| `WARN` | �� |
| `INFO` | �� |
| `DEBUG` | �� |
| `TRACE` | �� |



���⣬��Ҳ����ͨ��Ϊת���ṩһ��ѡ����ָ��Ӧ��ʹ�õ���ɫ����ʽ�� ���磬Ҫʹ�ı�Ϊ��ɫ����ʹ���������á�







```
%clr(%d{yyyy-MM-dd'T'HH:mm:ss.SSSXXX}){yellow}
```







֧��������ɫ����ʽ��





*   `blue`

*   `cyan`

*   `faint`

*   `green`

*   `magenta`

*   `red`

*   `yellow`









### [](https://springdoc.cn/spring-boot/features.html#features.logging.file-output)4.3\. ������ļ�



Ĭ������£�Spring Bootֻ�����̨��¼��־����д��־�ļ��� ��������ڿ���̨���֮��д��־�ļ�������Ҫ���� `logging.file.name` �� `logging.file.path` ���ԣ����磬����� `application.properties` �У���





�±���ʾ�� `logging.*` ������α�һ��ʹ�á�



<caption>Table 5\. Logging properties</caption><colgroup><col><col><col><col></colgroup>
| `logging.file.name` | `logging.file.path` | Example | Description |
| --- | --- | --- | --- |
| _(none)_ | _(none)_ |  | ֻ�ڿ���̨���м�¼�� |
| ָ���ļ� | _(none)_ | `my.log` | д��ָ������־�ļ��� ���ƿ�����һ��ȷ�е�λ�ã�Ҳ�������뵱ǰĿ¼�����λ�á� |
| _(none)_ | ָ��Ŀ¼ | `/var/log` | �� `spring.log` д��ָ��Ŀ¼�� ���ƿ�����һ��ȷ�е�λ�ã�Ҳ�������뵱ǰĿ¼�����λ�á� |



��־�ļ��ڴﵽ10MBʱ�ͻ��ֻ��������̨���һ����Ĭ������»��¼ `ERROR` ��`WARN` ���� `INFO` �������Ϣ��





|  | ��־���Զ�����ʵ�ʵ���־������ʩ�� ��ˣ��ض����������ԣ���Logback�� `logback.configurationFile` ������spring Boot���� |
| --- | --- |







### [](https://springdoc.cn/spring-boot/features.html#features.logging.file-rotation)4.4\. �ļ��ֻ���������־��



�����ʹ��Logback������ʹ����� `application.properties` �� `application.yaml` �ļ���΢����־�ֻ����á� ����������������־ϵͳ���㽫��Ҫ�Լ�ֱ�������ֻ����ã����磬�����ʹ��Log4J2����ô��������һ�� `log4j2.xml` �� `log4j2-spring.xml` �ļ�����





֧�������ֻ��������ԡ�



<colgroup><col><col></colgroup>
| ���� | ˵�� |
| --- | --- |
| `logging.logback.rollingpolicy.file-name-pattern` | ���ڴ�����־�鵵���ļ���ģʽ�� |
| `logging.logback.rollingpolicy.clean-history-on-start` | Ӧ�ó�������ʱ���Ƿ�����־�鵵���� |
| `logging.logback.rollingpolicy.max-file-size` | ��־�ļ��鵵ǰ�����ߴ磨�ļ����������ﵽ�������ͻ�鵵���� |
| `logging.logback.rollingpolicy.total-size-cap` | ��־�����ڱ�ɾ��ǰ�����ߴ磨�鵵�ļ����ռ�ô�С�����������С��ᱻɾ������ |
| `logging.logback.rollingpolicy.max-history` | Ҫ�����Ĺ鵵��־�ļ������������Ĭ��Ϊ7���� |





### [](https://springdoc.cn/spring-boot/features.html#features.logging.log-levels)4.5\. ��־����



����֧�ֵ���־ϵͳ������ͨ��ʹ�� `logging.level.<logger-name>=<level>` ��Spring�� `Environment`�����磬�� `application.properties`����������־�������� `level` �� `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`, �� `OFF` ֮һ�� `root` ��¼����logger���ļ������ͨ�� `logging.level.root` �����á�





�����������ʾ�� `application.properties` ��Ǳ�ڵ���־���á�







Properties

Yaml





```
logging.level.root=warn
logging.level.org.springframework.web=debug
logging.level.org.hibernate=error
```







Ҳ����ʹ�û���������������־���� ���磬`LOGGING_LEVEL_ORG_SPRINGFRAMEWORK_WEB=DEBUG` ������ `org.springframework.web` Ϊ `DEBUG` ��





|  | ��������ֻ�����ڰ�����־�� ���ڿ��ɰ����ǽ���������ת��ΪСд��ĸ�����Բ����������ַ�ʽΪ������������־�� �������ҪΪһ����������־�������ʹ��[`SPRING_APPLICATION_JSON`](https://springdoc.cn/spring-boot/features.html#features.external-config.application-json)������ |
| --- | --- |







### [](https://springdoc.cn/spring-boot/features.html#features.logging.log-groups)4.6\. ��־�飨Log Groups��



�ܹ�����ص���־��¼�����飬�Ա�ͬʱ�����ǽ������ã���ͨ�������á� ���磬����ܾ����ı� _����_ ��Tomcat��صļ�¼���ļ�¼���𣬵��㲻���׼�ס��߼���İ���





Ϊ�˰������������⣬Spring Boot��������Spring `Environment` �ж�����־�顣 ���磬�����ͨ���� `application.properties` �м��� ��tomcat�� group ����������







Properties

Yaml





```
logging.group.tomcat=org.apache.catalina,org.apache.coyote,org.apache.tomcat

```







һ������ú󣬾Ϳ�����һ�д������ı���������logger�ļ���







Properties

Yaml





```
logging.level.tomcat=trace

```







Spring Boot��������Ԥ�������־�飬���Կ��伴�á�



<colgroup><col><col></colgroup>
| ���� | ���е�logger |
| --- | --- |
| web | `org.springframework.core.codec`, `org.springframework.http`, `org.springframework.web`, `org.springframework.boot.actuate.endpoint.web`, `org.springframework.boot.web.servlet.ServletContextInitializerBeans` |
| sql | `org.springframework.jdbc.core`, `org.hibernate.SQL`, `org.jooq.tools.LoggerListener` |





### [](https://springdoc.cn/spring-boot/features.html#features.logging.shutdown-hook)4.7\. ʹ����־ Shutdown Hook



Ϊ�������Ӧ�ó�����ֹʱ�ͷ���־��Դ�������ṩ��һ��Shutdown Hook��������JVM�˳�ʱ������־ϵͳ���� �������Ӧ�ó�������war�ļ�����ʽ����ģ��������Shutdown Hook���Զ�ע�ᡣ ������Ӧ�ó����и��ӵ������Ĳ�νṹ��Shutdown Hook�����޷������������ ������ܣ�����ùػ����ӣ����о��ײ���־ϵͳֱ���ṩ��ѡ� ���磬Logback�ṩ�� [context selectors](https://logback.qos.ch/manual/loggingSeparation.html)������ÿ����¼�������Լ����������б������� �����ʹ�� `logging.register-shutdown-hook` ����������Shutdown Hook�� ��������Ϊ `false` ������ע�ᡣ ���������� `application.properties` �� `application.yaml` �ļ������ø����ԡ�







Properties

Yaml





```
logging.register-shutdown-hook=false

```









### [](https://springdoc.cn/spring-boot/features.html#features.logging.custom-log-configuration)4.8\. �Զ�����־����



������־ϵͳ����ͨ����classpath�ϰ����ʵ��Ŀ���������ҿ���ͨ����classpath�ĸ�Ŀ¼�»��� Spring `Environment` ����ָ����λ���ṩһ�����ʵ������ļ�����һ�����ƣ� `logging.config`��





������ͨ��ʹ�� `org.springframework.boot.logging.LoggingSystem` ϵͳ���ԣ�ǿ��Spring Bootʹ���ض�����־ϵͳ�� ��ֵӦ���� `LoggingSystem` ʵ�ֵ�ȫ������ ��Ҳ����ͨ��ʹ�� `none` ��ֵ����ȫ����Spring Boot����־���á�





|  | S������־���ڴ��� `ApplicationContext` ֮ǰ��ʼ���ģ����Բ����ܴ�Spring `@Configuration` �ļ��е� `@PropertySources` ������־�� �ı���־ϵͳ����ȫͣ������Ψһ������ͨ��System properties�� |
| --- | --- |





���������־ϵͳ������������ļ���



<colgroup><col><col></colgroup>
| ��־ϵͳ | �����ļ� |
| --- | --- |
| Logback | `logback-spring.xml`, `logback-spring.groovy`, `logback.xml` ���� `logback.groovy` |
| Log4j2 | `log4j2-spring.xml` ���� `log4j2.xml` |
| JDK (Java Util Logging) | `logging.properties` |



|  | �ڿ��ܵ�����£����ǽ�����ʹ�� `-spring` ������������־���ã����磬 `logback-spring.xml` ������ `logback.xml` ���� �����ʹ�ñ�׼����λ�ã�Spring������ȫ������־��ʼ���� |
| --- | --- |





|  | ���� "��ִ�е�jar "������ʱ��Java Util Logging��һЩ��֪����������⣬�ᵼ�����⡣ ������ܵĻ������ǽ������ڴ� "��ִ�е�jar" ������ʱ����ʹ������ |
| --- | --- |





Ϊ�˰������ƣ�����һЩ���Դ�Spring�� `Environment` ת�Ƶ�System properties�����±���ʾ��



| Spring Environment | System Property | ��ע |
| --- | --- | --- |
| `logging.exception-conversion-word` | `LOG_EXCEPTION_CONVERSION_WORD` | ��¼�쳣ʱʹ�õ�ת���ʡ� |
| `logging.file.name` | `LOG_FILE` | ��������ˣ���������Ĭ�ϵ���־�����С� |
| `logging.file.path` | `LOG_PATH` | ��������ˣ���������Ĭ�ϵ���־�����С� |
| `logging.pattern.console` | `CONSOLE_LOG_PATTERN` | �ڿ���̨��stdout��ʹ�õ���־���ģʽ�� |
| `logging.pattern.dateformat` | `LOG_DATEFORMAT_PATTERN` | date ��ʽ��. |
| `logging.charset.console` | `CONSOLE_LOG_CHARSET` | ����̨�����־���ַ����롣 |
| `logging.threshold.console` | `CONSOLE_LOG_THRESHOLD` | ���ڿ���̨��־��¼����־���� |
| `logging.pattern.file` | `FILE_LOG_PATTERN` | Ҫ���ļ���ʹ�õ���־ģʽ����� `LOG_FILE` �����ã��� |
| `logging.charset.file` | `FILE_LOG_CHARSET` | �ļ���־���ַ����루��� `LOG_FILE` �����ã��� |
| `logging.threshold.file` | `FILE_LOG_THRESHOLD` | �����ļ���־��¼����־���� |
| `logging.pattern.level` | `LOG_LEVEL_PATTERN` | ��Ⱦ��־����ʱʹ�õĸ�ʽ��Ĭ��Ϊ `%5p` ���� |
| `PID` | `PID` | ��ǰ�Ľ���ID |



�����ʹ��Logback����������Ҳ�ᱻת�ơ�



| Spring Environment | System Property | ��ע |
| --- | --- | --- |
| `logging.logback.rollingpolicy.file-name-pattern` | `LOGBACK_ROLLINGPOLICY_FILE_NAME_PATTERN` | ������־�ļ�����ģʽ��Ĭ��Ϊ `${LOG_FILE}.%d{yyyy-MM-dd}.%i.gz` ���� |
| `logging.logback.rollingpolicy.clean-history-on-start` | `LOGBACK_ROLLINGPOLICY_CLEAN_HISTORY_ON_START` | �Ƿ�������ʱ����鵵��־�ļ��� |
| `logging.logback.rollingpolicy.max-file-size` | `LOGBACK_ROLLINGPOLICY_MAX_FILE_SIZE` | �����־�ļ���С�� |
| `logging.logback.rollingpolicy.total-size-cap` | `LOGBACK_ROLLINGPOLICY_TOTAL_SIZE_CAP` | Ҫ��������־���ݵ��ܴ�С�� |
| `logging.logback.rollingpolicy.max-history` | `LOGBACK_ROLLINGPOLICY_MAX_HISTORY` | Ҫ���������鵵��־�ļ������� |



����֧�ֵ���־ϵͳ�ڽ����������ļ�ʱ�����Դ� System properties �л�ȡ���ԡ� ���Ӽ� `spring-boot.jar` �е�Ĭ�����á�





*   [Logback](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot/src/main/resources/org/springframework/boot/logging/logback/defaults.xml)

*   [Log4j 2](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot/src/main/resources/org/springframework/boot/logging/log4j2/log4j2.xml)

*   [Java Util logging](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot/src/main/resources/org/springframework/boot/logging/java/logging-file.properties)





|  | �����������־������ʹ��ռλ������Ӧ��ʹ��[Spring Boot���﷨](https://springdoc.cn/spring-boot/features.html#features.external-config.files.property-placeholders)�����ǵײ��ܵ��﷨�� ֵ��ע����ǣ������ʹ��Logback����Ӧ��ʹ�� `:` ��Ϊ����������Ĭ��ֵ֮��ķָ�����������ʹ�� `:-` �� |
| --- | --- |





|  | �����ͨ��ֻ���� `LOG_LEVEL_PATTERN` ����ʹ��Logback�� `logging.pattern.level` ��������־�����MDC��������ʱ���ݡ� ���磬�����ʹ�� `logging.pattern.level=user:%X{user} %5p` ����ôĬ�ϵ���־��ʽ����һ�� "user" ��MDC��Ŀ����������ڵĻ�����������ʾ�� 2019-08-30 12:30:04.031 user:someone INFO 22174 --- [  nio-8080-exec-0] demo.ControllerHandling authenticated request  |
| --- | --- |







### [](https://springdoc.cn/spring-boot/features.html#features.logging.logback-extensions)4.9\. Logback ��չ



Spring Boot����һЩ��Logback����չ�����԰������и߼����á� ���������� `logback-spring.xml` �����ļ���ʹ����Щ��չ��





|  | ��Ϊ��׼�� `logback.xml` �����ļ���������أ��㲻��������ʹ����չ�� ����Ҫʹ�� `logback-spring.xml` ���߶���һ�� `logging.config` ���ԡ� |
| --- | --- |





|  | ��չ�������� [Logback������ɨ��](https://logback.qos.ch/manual/configuration.html#autoScan) һ��ʹ�á� �������ͼ���������������ļ������޸Ļᵼ�����������µĴ��󱻼�¼������ |
| --- | --- |







 ERROR in ch.qos.logback.core.joran.spi.Interpreter@4:71 - no applicable action for [springProperty], current ElementPath is [[configuration][springProperty]]
ERROR in ch.qos.logback.core.joran.spi.Interpreter@4:71 - no applicable action for [springProfile], current ElementPath is [[configuration][springProfile]] 







#### [](https://springdoc.cn/spring-boot/features.html#features.logging.logback-extensions.profile-specific)4.9.1\. �ض��������ļ�



`<springProfile>` ��ǩ������Ը��ݻ��Spring�����ļ�ѡ���Եذ������ų����õĲ��֣� ֧���� `<configuration>` Ԫ�ص��κεط��������� ʹ�� `name` ������ָ���������õ������ļ��� `<springProfile>` ��ǩ���԰���һ�������ļ����ƣ����� `staging` ����һ�������ļ����ʽ�� �����ļ����ʽ����������ӵ������ļ��߼������� `production & (eu-central | eu-west)` �� �鿴 [Spring ��ܲο�ָ��](https://docs.spring.io/spring-framework/docs/6.0.5/reference/html/core.html#beans-definition-profiles-java) ���˽����ϸ�ڡ� ������б���ʾ���������������ļ���







```
<springProfile name="staging">
    <!-- configuration to be enabled when the "staging" profile is active -->
</springProfile>

<springProfile name="dev | staging">
    <!-- configuration to be enabled when the "dev" or "staging" profiles are active -->
</springProfile>

<springProfile name="!production">
    <!-- configuration to be enabled when the "production" profile is not active -->
</springProfile>
```









#### [](https://springdoc.cn/spring-boot/features.html#features.logging.logback-extensions.environment-properties)4.9.2\. ���������ԣ�Environment Properties



`<springProperty>` ��ǩ���Է��� Spring `Environment` �е����ԣ��Ա���Logback��ʹ�á� ���������Logback�����з��� `application.properties` �ļ��е�ֵ��������������á� �ñ�ǩ�Ĺ�����ʽ��Logback�ı�׼ `<property>` ��ǩ���ơ� Ȼ�����㲻��ֱ��ָ��һ�� `value` ������ָ�����Ե� `source` ������ `Environment` ���� �������Ҫ�� `local` ��Χ����ĵط��洢�����ԣ������ʹ�� `scope` ���ԡ� �������Ҫһ����ֵ��Ĭ��ֵ������һ������û���� `Environment` �����ã��������ʹ�� `defaultValue` ���ԡ� �����������ʾ����ι��������Ա���Logback��ʹ�á�







```
<springProperty scope="context" name="fluentHost" source="myapp.fluentd.host"
        defaultValue="localhost"/>

    <remoteHost>${fluentHost}</remoteHost>
    ...

```







|  | `source` ������kebab���ָ������ `my.property-name` ���� Ȼ�������Կ���ͨ��ʹ�ÿ��ɵĹ�����ӵ� `Environment` �С� |
| --- | --- |









### [](https://springdoc.cn/spring-boot/features.html#features.logging.log4j2-extensions)4.10\. Log4j2 ��չ



Spring Boot����һЩ��Log4j2����չ�����԰������и߼����á���������κ� `log4j2-spring.xml` �����ļ���ʹ����Щ��չ��





|  | ��Ϊ��׼�� `log4j2.xml` �����ļ���������أ��㲻��������ʹ����չ������Ҫʹ�� `log4j2-spring.xml` ���߶���һ�� ``logging.config`` ���ԡ� |
| --- | --- |





|  | ��Щ��չȡ����Log4J�ṩ�� [Spring Boot֧��](https://logging.apache.org/log4j/2.x/log4j-spring-boot/index.html)�� ��Ӧ��ȷ������Ĺ����в����� `org.apache.logging.log4j:log4j-spring-boot` ģ�顣 |
| --- | --- |





#### [](https://springdoc.cn/spring-boot/features.html#features.logging.log4j2-extensions.profile-specific)4.10.1\. �ض������ļ�����



`<SpringProfile>` ��ǩ������Ը��ݻ��Spring�����ļ�ѡ���Եذ������ų����õĲ��֡������ļ����ֱ�֧���� `<Configuration>` Ԫ�ص��κεط���ʹ�� `name` ������ָ���ĸ������ļ��������á� `<SpringProfile>` ��ǩ���԰���һ�������ļ����ƣ����� `staging`����һ�������ļ����ʽ�� �����ļ����ʽ����������ӵ������ļ��߼������� `production & (eu-central | eu-west)`���鿴 [Spring��ܲο�ָ��](https://docs.spring.io/spring-framework/docs/6.0.5/reference/html/core.html#beans-definition-profiles-java) ���˽����ϸ�ڡ� ������б���ʾ���������������ļ���







```
<SpringProfile name="staging">
    <!-- configuration to be enabled when the "staging" profile is active -->
</SpringProfile>

<SpringProfile name="dev | staging">
    <!-- configuration to be enabled when the "dev" or "staging" profiles are active -->
</SpringProfile>

<SpringProfile name="!production">
    <!-- configuration to be enabled when the "production" profile is not active -->
</SpringProfile>
```









#### [](https://springdoc.cn/spring-boot/features.html#features.logging.log4j2-extensions.environment-properties-lookup)4.10.2\. ������Environment�����Բ���



���������Log4j2����������Spring `Environment` �е����ԣ������ʹ�� `spring:` ǰ׺ [����](https://logging.apache.org/log4j/2.x/manual/lookups.html)�����������Log4j2�����з��� `application.properties` �ļ��е�ֵ��������������á�





�����������ʾ���������һ����Ϊ `applicationName` ��Log4j2���ԣ�����Spring `Environment` �ж�ȡ `spring.application.name`��







```
<Properties>
    <Property name="applicationName">${spring:spring.application.name}</Property>
</Properties>
```







|  | ��ѯkeyӦ��kebabf���ָ������ `my.property-name`���� |
| --- | --- |







#### [](https://springdoc.cn/spring-boot/features.html#features.logging.log4j2-extensions.environment-property-source)4.10.3\. Log4j2 ϵͳ���ԣ�System Properties��



Log4j2֧��һЩ [System Properties](https://logging.apache.org/log4j/2.x/manual/configuration.html#SystemProperties)�������������ø�����Ŀ�����磬`log4j2.skipJansi` ϵͳ���Կ����������� `ConsoleAppender` �Ƿ����Windows�ϳ���ʹ�� [Jansi](https://github.com/fusesource/jansi) �������





Log4j2 ��ʼ������ص�����ϵͳ���Զ����Դ�Spring `Environment` �л�á����磬������� `application.properties` �ļ������ `log4j2.skipJansi=false`���� `ConsoleAppender` ��Windows��ʹ��Jansi��





|  | ֻ�е�ϵͳ���ԣ�system properties���Ͳ���ϵͳ�����������������ڼ��ص�ֵʱ���Żῼ��Spring `Environment`�� |
| --- | --- |





|  | ������Log4j2��ʼ���ڼ���ص�ϵͳ���Բ�������Spring `Environment`�����磬Log4j2��������ѡ��Ĭ��Log4j2ʵ�ֵ��������� Spring Environment ����֮ǰʹ�õġ� |
| --- | --- |







