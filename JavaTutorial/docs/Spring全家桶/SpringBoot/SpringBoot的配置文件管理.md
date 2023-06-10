## 1.SpringBoot���ù���ı��������

Ϊʵ�ֿ��ٴ�Ϳ�������Ŀ��Springboot��ܴ��springboot�����Ŀ���Խ���Ŀֱ�Ӵ��jar�������У������Լ���װ����Tomcat������������������һ�ַ����ݵĲ���ʽ��

������Ŀ�����ķ�ʽ�����һ�������jar�����𣬼������ļ��͵�������������������jar����ͻ���������������

����һ����Ŀ���й����У�Ҫ�Ķ������ļ��Ļ���Ҫ���´��������

�������������������������������ĿҪ������ͬһ̨������ʱ�����Ե�jar������������ͬ�ĵ�������������������Ŀjar����100M�����������������ܾ�ռ����99M����������������������������˷�������Դ���˷��Լ���������Ŀ�����Ч�ʡ�

���������Ŀ�������ļ�������������������ȡ��jar����ͳһ������������������Ŀ���Ч���ֽ�Լ�˷������Ĵ������ģ�ͬʱ��Ŀ����άҲ�Ƿǳ�����ģ��Ķ��������ļ������·���Ϳ����ˣ��������¹�������

�����Ǿ����ʵ�ַ���

### 1.1 **�����ļ�ͳһ����**

```
	- springboot���������ļ�
	- Springboot��ȡ���������ļ���application.properties�������ȼ�Ϊ
	- Jar��ͬ��Ŀ¼��configĿ¼
	- Jar��ͬ��Ŀ¼
	- classPath(��resourcesĿ¼)��configĿ¼
	- classpathĿ¼

```

������springbootĬ��ȥ���Լ��ĺ��������ļ������ȼ�������һ��������ȼ��ķ�ʽ����Ŀ����ʱͨ������ķ�ʽָ����Ŀ���غ��������ļ�����������
java �Cjar -Dspring.config.location=xxx/xxx/xxxx.properties xxxx.jar

���Spring Boot�����ȼ����ߵ�λ���ҵ������ã���ô�����������ȼ����͵�����

### 1.2 **������Դ�����ļ�**

����������Springboot�����ļ��Ѿ��ܹ���ȡ��jar������й����ˣ����ǻ�������һЩҵ���ϵ������ļ���������Դ�����ļ���������Դ���������ļ���������FTP��Ϣ�ȣ���quartz��ʱ������־�������ļ��������ȥ��ȡ������ȷ�����ڴ��������õ���

����֪��Springboot��Ŀ����ͨ��ע�ⷽʽ����ȡ��������ļ�����������Ҳ��ͨ��ע�ⷽʽ����Ŀ�ܹ����õ�jar���ⲿ�������ļ��ģ�����ͼ��
![���������ͼƬ����](https://img-blog.csdnimg.cn/20190121170400864.png)

@PropertySource�����value������ֵ����һ����classpath��configĿ¼�µ�����Դ�����ļ����ڶ������Ǹ���spring.profiles.path��̬��ȡ��Ŀ¼��spring.profiles.path�������ں����ļ��Զ����һ�����������ֵ�����������ļ�ͳһ������ļ���·���������ignoreResourceNotFound=true�����趨�������ǰ��һ��·��û���ҵ���������ļ�������ݵڶ���·��ȥ�ҡ�

���ǻ�����ֱ�Ӹ���·������FileSystemResource��ȥ����һ�������ļ�ʵ������������ͼ
![���������ͼƬ����](https://img-blog.csdnimg.cn/20190121170338934.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0dlZUxvb25n,size_16,color_FFFFFF,t_70)

ԭ�����ƣ������ں����ļ��Զ����ͳһ����Ŀ¼��·�������������ļ�

����logback��־�����ļ����ط�ʽ���£�
![���������ͼƬ����](https://img-blog.csdnimg.cn/20190121170306979.png)

������������������һ��ʵ�ַ�����˼·

```
	- ��springboot�����ļ��ﶨ��һ��spring.profiles.path���������ֵָ���������������ļ�ͳһ���õ�Ŀ¼�����������ļ�����Ҳ�Ƿ����������

	- ������������ļ�����������ļ��ĵط�ҲӦ�û�ȡspring.profiles.path����������̬���ظ�·���µ������ļ�

	- Pom.xml�ļ��޸Ĵ�����ģ�飬�������ļ��ų����������Ǵ����jar���ǲ��������ļ��ģ����������ο��ĵ��ڵ�3

	- ����jar��ʱ��ͨ������ָ�����صĺ����ļ�Ϊspring.profiles.path�µĺ����ļ�

```
**������������ͳһ����**

ͨ��������jar�����Դ��jar���Ҳ���Է�����Ŀjar��ͬ��Ŀ¼�µ�libĿ¼�����ǿ��Ը����޸�pom.xml���������ʵ�֣���ο��ĵ��ڵ�3�������

**�������**

```
<build>
		<resources>
			<resource>
				<directory>src/main/java</directory>
				<includes>
					<include>**/*.properties</include>
					<include>**/*.xml</include>
				</includes>
				<filtering>true</filtering>
			</resource>
			<resource>
				<directory>src/main/resources</directory>
				<!�����ʱ�ų������ļ�-->
                                <excludes>
					<exclude>**/*.properties</exclude>
					<exclude>**/*.xml</exclude>
					<exclude>**/*.yml</exclude>
				</excludes>
				<filtering>false</filtering>
			</resource>
		</resources>
		<plugins>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				maven-compiler-plugin
				<configuration>
					<source>1.8</source>
					<target>1.8</target>
					<fork>true</fork>
					<skip>true</skip>
					<executable>
						C:/Program Files/Java/jdk1.8.0_161/bin/javac.exe
					</executable>
				</configuration>
			</plugin>
			<plugin>
				maven-jar-plugin
				<configuration>
					
						<manifest>
							true
							<classpathPrefix>lib/</classpathPrefix>
							<useUniqueVersions>false</useUniqueVersions>
							<mainClass>com.xrq.demo.Application</mainClass>
						</manifest>
						<manifestEntries>
							<Class-Path>./</Class-Path>
						</manifestEntries>
					
					<excludes>
						<exclude>*.properties</exclude>
						<exclude>*.yml</exclude>
						<exclude>*.xml</exclude>
						<exclude>config/**</exclude>
					</excludes>
				</configuration>
			</plugin>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				maven-dependency-plugin
				<executions>
					<execution>
						<id>copy</id>
						<phase>package</phase>
						<goals>
							<goal>copy-dependencies</goal>
						</goals>
						<configuration>
							<outputDirectory>
								${project.build.directory}/lib
							</outputDirectory>
						</configuration>
					</execution>
				</executions>
			</plugin>
		</plugins>
	</build>

```

�ĺ�pom.xml��buildģ��󣬾Ϳ���ͨ��mvn package ����mvn install������ǵ�jar����

1.  **��Ŀ����shell�ű���д**
    �Զ���shell�ű���ʵ����Ŀ��������ֹͣ��״̬������������

```
#!/bin/bash 
#������滻Ϊ���Լ���ִ�г���,��������������� 
APP_NAME=demo1-0.0.1-SNAPSHOT.jar 
JVM="-server -Xms512m -Xmx512m -XX:PermSize=64M -XX:MaxNewSize=128m -XX:MaxPermSize=128m -Djava.awt.headless=true -XX:+CMSClassUnloadingEnabled -XX:+CMSPermGenSweepingEnabled"
APPFILE_PATH="-Dspring.config.location=/usr/local/demo/config/application-demo1.properties"
#ʹ��˵��,������ʾ������� 
usage() { 
echo "Usage: sh ִ�нű�.sh [start|stop|restart|status]" 
exit 1 
} 
#�������Ƿ������� 
is_exist(){ 
pid=`ps -ef|grep $APP_NAME|grep -v grep|awk '{print $2}' ` 
#��������ڷ���1,���ڷ���0 
if [ -z "${pid}" ]; then 
return 1 
else 
return 0 
fi 
} 
#�������� 
start(){ 
is_exist 
if [ $? -eq "0" ]; then 
echo "${APP_NAME} is already running. pid=${pid} ." 
else 
nohup java $JVM -jar $APPFILE_PATH $APP_NAME > /dev/null 2>&1 
fi
} 
#ֹͣ���� 
stop(){ 
is_exist 
if [ $? -eq "0" ]; then 
kill -9 $pid 
else 
echo "${APP_NAME} is not running" 
fi 
} 
#�������״̬ 
status(){ 
is_exist 
if [ $? -eq "0" ]; then 
echo "${APP_NAME} is running. Pid is ${pid}" 
else 
echo "${APP_NAME} is NOT running." 
fi 
} 
#���� 
restart(){ 
stop 
start 
} 
#�����������,ѡ��ִ�ж�Ӧ����,��������ִ��ʹ��˵�� 
case "$1" in 
"start") 
start 
;; 
"stop") 
stop 
;; 
"status") 
status 
;; 
"restart") 
restart 
;; 
*) 
usage 
;; 
esac

```

**����**

linux���������½����ļ��У������Ǵ�õ���Ŀjar��������ȥ����jar����ͬ��Ŀ¼�½�config��lib�ļ��У��ֱ������ļ��͵���������������ȥ����ṹ����ͼ��*.shΪ�Լ�д����Ŀ����shell�ű�

![���������ͼƬ����](https://img-blog.csdnimg.cn/20190121170223384.png)

��config�ڵ�springboot�����ļ�����application-demo1.properties�ļ�����

spring.profiles.path������ĳɵ�ǰ�����ļ����ڵ�Ŀ¼������Ϊ/usr/local/demo/config

��*.sh�ű����޸�APPFILE_PATH��ֵ������

APPFILE_PATH="-Dspring.config.location=/usr/local/demo/config/application-demo1.properties"

**��Ŀ����**

����jar������Ŀ¼ִ����������

sh [demo1.sh](http://demo1.sh/) start ������Ŀ

sh [demo1.sh](http://demo1.sh/) stop ֹͣ��Ŀ

sh [demo1.sh](http://demo1.sh/) restart������Ŀ

sh [demo1.sh](http://demo1.sh/) status��Ŀ״̬

## 2\. �ⲿ��������





Spring Boot�������㽫�����ⲿ����������Ϳ����ڲ�ͬ�Ļ�����ʹ����ͬ��Ӧ�ó�����롣 �����ʹ�ø����ⲿ����Դ������Java properties �ļ���YAML�ļ������������������в�����





����ֵ����ͨ��ʹ�� `@Value` ע��ֱ��ע�����Bean��Ҳ����ͨ��Spring �� `Environment` ���ʣ�����ͨ�� `@ConfigurationProperties` [�󶨵�����](https://springdoc.cn/spring-boot/features.html#features.external-config.typesafe-configuration-properties)��





Spring Boot ʹ��һ���ǳ��ر�� `PropertySource` ˳��ּ������������дֵ�� ����� property source ���Ը���ǰ������Դ�ж����ֵ�� ������˳���ǡ�





1.  Ĭ�����ԣ�ͨ�� `SpringApplication.setDefaultProperties` ָ������

2.  @Configuration ���ϵ� [`@PropertySource`](https://docs.spring.io/spring-framework/docs/6.0.5/javadoc-api/org/springframework/context/annotation/PropertySource.html) ע�⡣��ע�⣬����������Դֱ��application context��ˢ��ʱ�Żᱻ��ӵ������С����������ĳЩ������˵�Ѿ�̫���ˣ����� `logging.*` �� `spring.main.*` ��������ˢ�¿�ʼǰ���Ѿ�����ȡ�ˡ�

3.  �������ݣ��� `application.properties` �ļ�����

4.  `RandomValuePropertySource`����ֻ�� `random.*` ���ԡ�

5.  ����ϵͳ��������

6.  Java System properties (`System.getProperties()`).

7.  `java:comp/env` �е� JNDI ���ԡ�

8.  `ServletContext` init parameters.

9.  `ServletConfig` init parameters.

10.  ���� `SPRING_APPLICATION_JSON` �����ԣ�Ƕ�뻷��������ϵͳ�����е�����JSON����

11.  �����в���

12.  ���ڲ����е� `properties` ���ԡ��� [`@SpringBootTest`](https://docs.spring.io/spring-boot/docs/3.1.0-SNAPSHOT/api/org/springframework/boot/test/context/SpringBootTest.html) �Ͳ���ע���п��ã�[���ڲ������Ӧ�ó����һ���ض�Ƭ��](https://springdoc.cn/spring-boot/features.html#features.testing.spring-boot-applications.autoconfigured-tests)��

13.  ������е�https://docs.spring.io/spring-framework/docs/6.0.5/javadoc-api/org/springframework/test/context/TestPropertySource.html[`@TestPropertySource`] ע��.

14.  ��devtools���ڻ״̬ʱ��`$HOME/.config/spring-boot` Ŀ¼�µ�[Devtoolsȫ����������](https://springdoc.cn/spring-boot/using.html#using.devtools.globalsettings)��





���������ļ�������˳���ǡ�





1.  �����jar�д����[Application properties](https://springdoc.cn/spring-boot/features.html#features.external-config.files)��application.properties �� YAML����

2.  �����jar�д���� [�ض��� Profile application properties](https://springdoc.cn/spring-boot/features.html#features.external-config.files.profile-specific)��`application-{profile}.properties` �� YAML����

3.  ��������jar֮���[Application properties](https://springdoc.cn/spring-boot/features.html#features.external-config.files)�ԣ�application.properties��YAML����

4.  ��������jar֮���[�ض��� Profile application properties](https://springdoc.cn/spring-boot/features.html#features.external-config.files.profile-specific)�� `application-{profile}.properties` ��YAML����





|  | ������������Ӧ�ó����м��ʹ��һ�ָ�ʽ�� �������ͬһ���ط��� `.properties` �� `.yml` ��ʽ�������ļ���`.properties` ���ȡ� |
| --- | --- |





Ϊ���ṩһ����������ӣ������㿪����һ�� `@Component`��ʹ����һ�� `name` ���ԣ��������������ʾ��







Java

Kotlin





```
@Component
public class MyBean {

    @Value("${name}")
    private String name;

    // ...

}

```







�����Ӧ�ó����classpath�����磬�����jar�У����������һ�� `application.properties` �ļ���Ϊ `name` �ṩһ�������Ĭ������ֵ������һ���µĻ���������ʱ�����������jar֮���ṩһ�� `application.properties` �ļ������� `name` ������һ���ԵĲ��ԣ��������һ���ض��������в��������������磬`java -jar app.jar --name="Spring"`����





|  | `env` �� `configprops` �˵���ȷ��һ������Ϊʲô��һ���ض���ֵʱ�ǳ����á������ʹ���������˵���������������ֵ����� "[������������](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints)" ���֡� |
| --- | --- |





### [](https://springdoc.cn/spring-boot/features.html#features.external-config.command-line-args)2.1\. ��������������



Ĭ������£�`SpringApplication` �Ὣ�κ�������ѡ����������� `--` ��ͷ�Ĳ������� `--server.port=9000` ��ת��Ϊ `property` ��������ӵ�Spring `Environment` �С� ��ǰ�������������������������ڻ����ļ�������Դ��





����㲻ϣ�����������Ա���ӵ� `Environment` �У������ͨ�� `SpringApplication.setAddCommandLineProperties(false)` �������ǡ�







### [](https://springdoc.cn/spring-boot/features.html#features.external-config.application-json)2.2\. JSON Application Properties



����������ϵͳ�������������ƣ�����ζ����Щ�������Ʋ���ʹ�á� Ϊ�˰������������⣬Spring Boot�����㽫һ�����Կ����Ϊһ����һ��JSON�ṹ��





�����Ӧ�ó�������ʱ���κ� `spring.application.json` �� `SPRING_APPLICATION_JSON` ���Խ�����������ӵ� `Environment` �С�





���磬`SPRING_APPLICATION_JSON` ���Կ����� UN*X shell ������������Ϊ���������ṩ��







```
$ SPRING_APPLICATION_JSON='{"my":{"name":"test"}}' java -jar myapp.jar
```







��ǰ��������У�����Spring�� `Environment` �����յõ��� `my.name=test`��





ͬ����JSONҲ������Ϊһ��ϵͳ�����ṩ��







```
$ java -Dspring.application.json='{"my":{"name":"test"}}' -jar myapp.jar
```







���������ͨ��ʹ��һ�������в������ṩJSON��







```
$ java -jar myapp.jar --spring.application.json='{"my":{"name":"test"}}'
```







�����Ҫ����һ�������Ӧ�÷������У���Ҳ����ʹ��һ����Ϊ `java:comp/env/spring.application.json` ��JNDI������





|  | ����JSON�е� `null` ֵ������ӵ����ɵ�����Դ�У��� `PropertySourcesPropertyResolver` �� `null` ������Ϊȱʧֵ�� ����ζ��JSON������ `null` ֵ�������Եͽ�����Դ�����ԡ� |
| --- | --- |







### [](https://springdoc.cn/spring-boot/features.html#features.external-config.files)2.3\. �ⲿ�� Application Properties



�����Ӧ�ó�������ʱ��Spring Boot���Զ�������λ���ҵ������� `application.properties` �� `application.yaml` �ļ���





1.  classpath



    1.  classpath ��·��

    2.  classpath �µ� `/config` ��



2.  ��ǰĿ¼



    1.  ��ǰĿ¼��

    2.  ��ǰĿ¼�µ� `config/` ��Ŀ¼

    3.  `config/` ��Ŀ¼��ֱ����Ŀ¼







�б����ȼ����򣨽ϵ���Ŀ��ֵ���ǽ�����Ŀ��ֵ���� ���ص��ļ�����Ϊ `PropertySources` ��ӵ�Spring�� `Environment` �С�





����㲻ϲ�� `application` ��Ϊ�����ļ����ƣ������ͨ��ָ�� `spring.config.name` ���������л�����һ���ļ����ơ� ���磬Ϊ��Ѱ�� `myproject.properties` �� `myproject.yaml` �ļ�������԰����·�ʽ�������Ӧ�ó���







```
$ java -jar myproject.jar --spring.config.name=myproject
```







��Ҳ����ͨ��ʹ�� `spring.config.location` ��������������һ����ȷ��λ�á� �����Խ���һ�����ŷָ����б����а���һ������Ҫ����λ�á�





�����������ʾ�����ָ��������ͬ���ļ���







```
$ java -jar myproject.jar --spring.config.location=\
    optional:classpath:/default.properties,\
    optional:classpath:/override.properties
```







|  | ��� [�����ļ��ǿ�ѡ��](https://springdoc.cn/spring-boot/features.html#features.external-config.files.optional-prefix)�����ҿ����ǲ����ڵģ���ô��ʹ�� `optional:` ǰ׺�� |
| --- | --- |





|  | `spring.config.name`, `spring.config.location`, �� `spring.config.extra-location` ���������ȷ����Щ�ļ����뱻���ء� ���Ǳ��뱻����Ϊ�������ԣ�ͨ���ǲ���ϵͳ����������ϵͳ���ԣ��������в������� |
| --- | --- |





��� `spring.config.location` ����Ŀ¼���������ļ���������Ӧ���� `/` ��β�� ������ʱ�����ǽ����������� `spring.config.name` ���ɵ����ƣ�Ȼ�󱻼��ء� �� `spring.config.location` ��ָ�����ļ���ֱ�ӵ��롣





|  | Ŀ¼���ļ�λ��ֵҲ����չ���Լ��[�ض��������ļ�](https://springdoc.cn/spring-boot/features.html#features.external-config.files.profile-specific)�����磬������ `spring.config.location` �� `classpath:myconfig.properties`����Ҳ�ᷢ���ʵ��� `classpath:myconfig-<profile>.properties` �ļ������ء� |
| --- | --- |





�ڴ��������£�����ӵ�ÿ�� `spring.config.location` �����һ���ļ���Ŀ¼�� λ���ǰ������Ǳ������˳��������ģ������λ�ÿ��Ը���ǰ���λ�õ�ֵ��





�������һ�����ӵ�λ�����ã�������ʹ���ض��������ļ����������Ҫ�ṩ��һ������ʾ���Ա�Spring Boot֪������Ӧ����η��顣һ��λ������һ��λ�õļ��ϣ���Щλ�ö�����Ϊ����ͬһ�������磬������������classpathλ�÷��飬Ȼ���������ⲿλ�á�һ��λ�����ڵ���ĿӦ���� `;` �ָ�������ϸ�ڼ� ��[ָ�� profile](https://springdoc.cn/spring-boot/features.html#features.external-config.files.profile-specific)�� ���ֵ����ӡ�





ͨ��ʹ�� `spring.config.location` ���õ�λ��ȡ��Ĭ��λ�á� ���磬��� `spring.config.location` ������Ϊ `optional:classpath:/custom-config/,optional:file:./custom-config/` �����ǵ�����λ�ü����¡�





1.  `optional:classpath:custom-config/`

2.  `optional:file:./custom-config/`





�����ϲ����Ӷ����λ�ã��������滻���ǣ������ʹ�� `spring.config.extra-location` �� �Ӹ���λ�ü��ص����Կ��Ը���Ĭ��λ�õ����ԡ� ���磬��� `spring.config.extra-location` ������Ϊ `optional:classpath:/custom-config/,optional:file:./custom-config/` �����ǵ�����λ�ü����¡�





1.  `optional:classpath:/;optional:classpath:/config/`

2.  `optional:file:./;optional:file:./config/;optional:file:./config/*/`

3.  `optional:classpath:custom-config/`

4.  `optional:file:./custom-config/`





������������������һ�������ļ���ָ��Ĭ��ֵ��Ȼ������һ���ļ���ѡ���Եظ�����Щֵ�� �����������һ��Ĭ��λ�õ� `application.properties` �������� `spring.config.name` ѡ�������basename����Ϊ���Ӧ�ó����ṩĬ��ֵ�� Ȼ����ЩĬ��ֵ����������ʱ��λ������һ���Զ���λ�õĲ�ͬ�ļ����ǡ�





|  | �����ʹ�û�������������ϵͳ���ԣ����������ϵͳ������ʹ�þ��ָ��ļ������������ʹ���»��ߴ��棨���磬 `SPRING_CONFIG_NAME` ������ `spring.config.name` ���� �μ�[�ӻ���������](https://springdoc.cn/spring-boot/features.html#features.external-config.typesafe-configuration-properties.relaxed-binding.environment-variables) �˽����顣 |
| --- | --- |





|  | ������Ӧ�ó�����servlet������Ӧ�÷����������У���ôJNDI���ԣ��� `java:comp/env` �У���servlet�����ĳ�ʼ���������Դ��滷��������ϵͳ���ԣ�������֮һ���� |
| --- | --- |





#### [](https://springdoc.cn/spring-boot/features.html#features.external-config.files.optional-prefix)2.3.1\. ��ѡ��λ��(Optional Locations)



Ĭ������£���ָ������������λ�ò�����ʱ��Spring Boot���׳�һ�� `ConfigDataLocationNotFoundException` �����Ӧ�ó����޷�������





�������ָ��һ��λ�ã����㲻�������������Ǵ��ڣ������ʹ�� `optional:` ǰ׺��������� `spring.config.location��spring.config.extra-location` ������ʹ�����ǰ׺��Ҳ������ [`spring.config.import`](https://springdoc.cn/spring-boot/features.html#features.external-config.files.importing) ������ʹ�á�





���磬`spring.config.import` ֵΪ `optional:file:./myconfig.properties` �������Ӧ�ó�����������ʹ `myconfig.properties` �ļ���ʧ��





�������������е� `ConfigDataLocationNotFoundExceptions` ��ʼ�ռ����������Ӧ�ó��������ʹ�� `spring.config.on-not-found` ���ԡ� ʹ�� `SpringApplication.setDefaultProperties(..)` ��ʹ��ϵͳ/������������ֵ����Ϊ `ignore`��







#### [](https://springdoc.cn/spring-boot/features.html#features.external-config.files.wildcard-locations)2.3.2\. ͨ�����ַ



���һ�������ļ���λ�������һ��·�����а��� `*` �ַ������ͱ���Ϊ��һ��ͨ���λ�á� ͨ����ڼ�������ʱ����չ����ˣ�ֱ�ӵ���Ŀ¼Ҳ����顣 ͨ���λ����Kubernetes�����ж���������Ե���Դ�Ļ������ر����á�





���磬�������һЩRedis���ú�һЩMySQL���ã��������������������÷ֿ���ͬʱҪ���������ֶ�������һ�� `application.properties` �ļ��С�





����ܻᵼ������������ `application.properties` �ļ������ڲ�ͬ��λ�ã��� `/config/redis/application.properties` �� `/config/mysql/application.properties` �� ����������£���һ��ͨ���λ�� `config/*/` �������������ļ�������





Ĭ������£�Spring Boot�� `config/*/` ����Ĭ������λ�á� ����ζ�����jar֮��� `/config` Ŀ¼��������Ŀ¼���ᱻ��������





������� `spring.config.location` �� `spring.config.extra-location` ������ʹ��ͨ���λ�á�





|  | ͨ���λ�ñ���ֻ����һ�� `*` ���� `*/` ��β��������������Ŀ¼��λ�ã��� `*/<filename>` �������������ļ���λ�á� ����ͨ�����λ�ý������ļ����ľ���·������ĸ˳������ |
| --- | --- |





|  | ͨ���λ��ֻ���ⲿĿ¼�����á� �㲻���� `classpath:` λ����ʹ��ͨ����� |
| --- | --- |







#### [](https://springdoc.cn/spring-boot/features.html#features.external-config.files.profile-specific)2.3.3\. �ض��ļ���Profile Specific Files��



���� `application` �����ļ���Spring Boot��������ʹ�� `application-{profile}` ��������������profile�ض����ļ��� ���磬������Ӧ�ó��򼤻�����Ϊ `prod` �������ļ���`spring.profiles.active=prod`����ʹ��YAML�ļ�����ô `application.yml` �� `application-prod.yml` ���������ǡ�





�ض��ļ�(`profiles`)���������׼�� `application.properties` ��λ����ͬ���ض��ļ����������ڷ��ض��ļ��� ���ָ���˼��������ļ�����������ʤ���Ĳ��ԡ� ���磬��������ļ� `prod,live` ���� `spring.profiles.active` ����ָ���ģ�`application-prod.properties` �е�ֵ���Ա� `application-live.properties` �е�ֵ�����ǡ�





|  | ���ʤ���Ĳ���������[location group](https://springdoc.cn/spring-boot/features.html#features.external-config.files.location-groups)���� `spring.config.location` �� `classpath:/cfg/,classpath:/ext/` ���������� `classpath:/cfg/;classpath:/ext/` ��ͬ�ĸ��ǹ������磬����������� `prod,live` ������˵�����ǿ����������ļ��� /cfg  application-live.properties/ext  application-live.properties  application-prod.properties ��������һ�� `spring.config.location` Ϊ `classpath:/cfg/,classpath:/ext/` ʱ�����ǻ������� `/ext` �ļ�֮ǰ�������� `/cfg` �ļ���1.  `/cfg/application-live.properties`        2.  `/ext/application-prod.properties`        3.  `/ext/application-live.properties`        �������� `classpath:/cfg/;classpath:/ext/` ����ʱ���� `;` �ָ�������������ͬһ������ `/cfg` �� `/ext` ��1.  `/ext/application-prod.properties`        2.  `/cfg/application-live.properties`        3.  `/ext/application-live.properties`         |
| --- | --- |





`Environment` ��һ��Ĭ�ϵ������ļ���Ĭ��Ϊ `[default]` �������û�����û�������ļ����ͻ�ʹ����Щ�����ļ��� ���仰˵�����û����ȷ����������ļ�����ô�ͻῼ������ `application-default` �����ԡ�





|  | �����ļ�ֻ������һ�Ρ� ������Ѿ�ֱ��[������](https://springdoc.cn/spring-boot/features.html#features.external-config.files.importing)һ�������ļ����ض������ļ�����ô�������ᱻ�ڶ��ε��롣 |
| --- | --- |







#### [](https://springdoc.cn/spring-boot/features.html#features.external-config.files.importing)2.3.4\. ������������



application properties �п���ʹ�� `spring.config.import` ���Դ������ط����������������ݡ� �����ڱ�����ʱ������������Ϊ����������������ļ��������Ķ����ļ���





���磬���������� classpath `application.properties` �ļ������������ݡ�







Properties

Yaml





```
spring.application.name=myapp
spring.config.import=optional:file:./dev.properties

```







�⽫�������뵱ǰĿ¼�µ� `dev.properties` �ļ�����������������ļ����� ����� `dev.properties` �е�ֵ�������ڴ���������ļ��� ������������У�`dev.properties` ���Խ� `spring.application.name` ���¶���Ϊһ����ͬ��ֵ��





һ������ֻ�ᱻ����һ�Σ����������������ٴΡ� һ��������properties/yaml�ļ��ڵĵ����ļ��б������˳�򲢲���Ҫ�� ���磬������������Ӳ�����ͬ�Ľ����







Properties

Yaml





```
spring.config.import=my.properties
my.property=value

```









Properties

Yaml





```
my.property=value
spring.config.import=my.properties

```







���������������У�`my.properties` �ļ���ֵ�������ڴ����䵼����ļ���





��һ����һ�� `spring.config.import` �����¿���ָ�����λ�á� λ�ý��������Ǳ������˳�򱻴��������ĵ��뽫�����ȴ���





|  | ���ʵ���ʱ��[�ض������ļ��ı���](https://springdoc.cn/spring-boot/features.html#features.external-config.files.profile-specific)Ҳ�����ǵ��롣 ��������ӽ����� `my.properties` �Լ��κ� `my-<profile>.properties` ���塣 |
| --- | --- |





|  | Spring Boot �ṩ�˿ɲ�ε�API�������������֧�ָ��ֲ�ͬ��λ�õ�ַ�� Ĭ������£�����Ե���Java Properties��YAML�� ��[������](https://springdoc.cn/spring-boot/features.html#features.external-config.files.configtree)�� ��������jar�����ṩ������������֧�֣���Ҫ������Ǳ����ļ����� ���磬����������������������ⲿ�洢����Consul��Apache ZooKeeper��Netflix Archaius������Nacos�����������֧�����Լ���λ�ã�ʵ���Լ���������ü��أ�������� `org.springframework.boot.context.config` ���е� `ConfigDataLocationResolver` �� `ConfigDataLoader` �ࡣ |
| --- | --- |







#### [](https://springdoc.cn/spring-boot/features.html#features.external-config.files.importing-extensionless)2.3.5\. ��������չ�����ļ�



��Щ��ƽ̨����Ϊ��װ�ļ���volume mounted files������ļ���չ���� Ҫ������Щ����չ�����ļ�������Ҫ��Spring Bootһ����ʾ���Ա���֪����μ������ǡ� �����ͨ������չ����ʾ���ڷ���������������һ�㡣





���磬��������һ�� `/etc/config/myconfig` �ļ�����ϣ����yaml��ʽ���롣 �����������ķ�������� `application.properties` �е�������







Properties

Yaml





```
spring.config.import=file:/etc/config/myconfig[.yaml]

```









#### [](https://springdoc.cn/spring-boot/features.html#features.external-config.files.configtree)2.3.6\. ʹ����������Configuration Trees��



������ƽ̨����Kubernetes��������Ӧ�ó���ʱ���㾭����Ҫ��ȡƽ̨�ṩ������ֵ�� �������������ڴ���Ŀ�Ĳ����ټ������������ȱ�㣬�ر��������ֵ�� secret �ġ�





��Ϊ������������������������ƽ̨���������㽫����ӳ�䵽���ص����ݾ� ���磬Kubernetes ���Ծ���� [`ConfigMaps`](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap) �� [`Secrets`](https://kubernetes.io/docs/concepts/configuration/secret/#using-secrets-as-files-from-a-pod)��





����ʹ�����ֳ����� volume ����ģʽ��





1.  һ���ļ�����һ�����������ԣ�ͨ��д��YAML����

2.  ����ļ���д��һ��Ŀ¼���У��ļ�����Ϊ ��key�������ݳ�Ϊ ��value����





���ڵ�һ������������ʹ�� `spring.config.import` ֱ�ӵ���YAML�������ļ���[��������](https://springdoc.cn/spring-boot/features.html#features.external-config.files.importing)�� ���ڵڶ������������Ҫʹ�� `configtree:` ǰ׺���Ա�Spring Boot֪������Ҫ�������ļ���Ϊ���Թ�����





�ٸ����ӣ�����������һ�£�Kubernetes�Ѿ�����������volume��







 etc/
  config/
    myapp/
      username
      password 







`username` �ļ������ݽ���һ������ֵ���� `password` �����ݽ���һ�� secret��





Ҫ������Щ���ԣ����������� `application.properties` �� `application.yaml` �ļ�������������ݡ�







Properties

Yaml





```
spring.config.import=optional:configtree:/etc/config/

```







Ȼ������Դ� `Environment` ���Գ��淽ʽ���ʻ�ע�� `myapp.username` �� `myapp.password` ���ԡ�





|  | �������µ��ļ��й������������ơ� ������������У�Ϊ�˷�������Ϊ `username` �� `password`������Խ� `spring.config.import` ����Ϊ `optional:configtree:/etc/config/myapp` �� |
| --- | --- |





|  | ���е���ŵ��ļ���Ҳ�ᱻ��ȷӳ�䡣 ���磬������������У�`/etc/config` ����Ϊ `myapp.username` ���ļ��� `Environment` �е������������� `myapp.username` �� |
| --- | --- |





|  | ��������ֵ���Ա��󶨵��ַ��� `String` �� `byte[]` ���ͣ���ȡ����Ԥ�ڵ����ݡ� |
| --- | --- |





������ж��������Ҫ��ͬһ�����ļ��е��룬�����ʹ��ͨ�����ݷ�ʽ�� �κ��� `/*/` ��β�� `configtree:` λ�ý���������ֱ�ӵ����ļ�����Ϊ��������





���磬��������volume��







 etc/
  config/
    dbconfig/
      db/
        username
        password
    mqconfig/
      mq/
        username
        password 







�����ʹ�� `configtree:/etc/config/*/` ��Ϊ����λ�á�







Properties

Yaml





```
spring.config.import=optional:configtree:/etc/config/*/

```







�⽫��� `db.username`��`db.password`��`mq.username` �� `mq.password` ���ԡ�





|  | ʹ��ͨ������ص�Ŀ¼�ǰ���ĸ˳�����еġ� �������Ҫһ����ͬ��˳����ô��Ӧ�ð�ÿ��λ����Ϊһ�������ĵ����г��� |
| --- | --- |





������Ҳ������Docker secret�� ��Docker swarm���������secret�ķ���Ȩʱ����secret�ᱻװ�ص������С� ���磬���һ����Ϊ `db.password` ��secret���������� `/run/secrets/` ��λ�ã�����������·����� `db.password` ��Spring�������á�







Properties

Yaml





```
spring.config.import=optional:configtree:/run/secrets/

```









#### [](https://springdoc.cn/spring-boot/features.html#features.external-config.files.property-placeholders)2.3.7\. ����ռλ��



`application.properties` �� `application.yml` �е�ֵ��ʹ��ʱͨ�����е� `Environment` ���ˣ���������Բο���ǰ�����ֵ�����磬����ϵͳ���Ի򻷾��������� ��׼�� `${name}` ����ռλ���﷨��������һ��ֵ���κεط��� ����ռλ��Ҳ����ָ��һ��Ĭ��ֵ��ʹ�� `:` ���ָ�Ĭ��ֵ���������ƣ����� `${name:default}` ��





�����������ʾ�˴�Ĭ��ֵ�Ͳ���Ĭ��ֵ��ռλ����ʹ�������







Properties

Yaml





```
app.name=MyApp
app.description=${app.name} is a Spring Boot application written by ${username:Unknown}

```







���� `username` ����û���������ط����ã�`app.description` ��ֵ���� `MyApp is a Spring Boot application written by Unknown`��





|  | ��Ӧ��ʼ��ʹ��ռλ���е��������ƵĹ淶��ʽ����ʹ��Сд��ĸ��kebab-case�����������ǡ� �⽫����Spring Bootʹ����[���ɰ�](https://springdoc.cn/spring-boot/features.html#features.external-config.typesafe-configuration-properties.relaxed-binding) `@ConfigurationProperties` ʱ��ͬ���߼������磬`${demo.item-price}` ���� `application.properties` �ļ��л�ȡ `demo.item-price` �� `demo.itemPrice` ��ʽ�����ԣ��Լ���ϵͳ�����л�ȡ `DEMO_ITEMPRICE` �� ������� `${demo.itemPrice}` �Ļ��� `demo.item-price` �� `DEMO_ITEMPRICE` �Ͳ��ᱻ���ǡ� |
| --- | --- |





|  | ��Ҳ����ʹ�����ּ�������������Spring Boot���Ե� ��short�� ���塣 ������μ�_[howto.html](https://springdoc.cn/spring-boot/howto.html#howto.properties-and-configuration.short-command-line-arguments)_�ķ����� |
| --- | --- |







#### [](https://springdoc.cn/spring-boot/features.html#features.external-config.files.multi-document)2.3.8\. ʹ�ö��ĵ��ļ���Working with Multi-Document Files��



Spring Boot�����㽫һ�������ļ��ֳɶ���߼��ļ���ÿ���ļ����Ƕ�����ӵġ� �ļ��ǰ�˳����ģ����ϵ��¡� ������ļ����Ը���ǰ���ļ��ж�������ԡ�





���� `application.yml` �ļ���ʹ�ñ�׼��YAML���ĵ��﷨�� �������������ַ���`---`������һ���ļ��Ľ���������һ���ļ��Ŀ�ʼ��





���磬������ļ��������߼��ĵ���







```
spring:
  application:
    name: "MyApp"
---
spring:
  application:
    name: "MyCloudApp"
  config:
    activate:
      on-cloud-platform: "kubernetes"
```







���� `application.properties` �ļ���һ������� `#---` �� `!---` ע�ͱ���������ļ��ķָ







```
spring.application.name=MyApp
#---
spring.application.name=MyCloudApp
spring.config.activate.on-cloud-platform=kubernetes
```







|  | properties �ļ��ķָ����������κ�ǰ���հף����ұ����������������ַ��� �ָ�����ǰ�����в�������ͬ��ע��ǰ׺�� |
| --- | --- |





|  | ���ĵ������ļ�ͨ���뼤������һ��ʹ�ã��� `spring.config.activated.on-profile`�� ���[��һ��](https://springdoc.cn/spring-boot/features.html#features.external-config.files.activation-properties)�� |
| --- | --- |





|  | ���ĵ������ļ�����ͨ��ʹ�� `@PropertySource` �� `@TestPropertySource` ע����ء� |
| --- | --- |







#### [](https://springdoc.cn/spring-boot/features.html#features.external-config.files.activation-properties)2.3.9\. �������ԣ�Activation Properties��



��ʱ��ֻ������ĳЩ����ʱ����һ���ض��������Ǻ����õġ� ���磬�������һЩ����ֻ�����ض��������ļ�������ʱ����ء�





�����ʹ�� `spring.config.activation.*` �������ؼ���һ�������ļ���





�������������¡�



<caption>Table 2\. activation properties</caption><colgroup><col><col></colgroup>
| ���� | ˵�� |
| --- | --- |
| `on-profile` | һ��������֮ƥ��������ļ����ʽ����ʹ�ļ����ڻ״̬������ָ���������ļ�ʱ��Ч���� |
| `on-cloud-platform` | �����⵽�� `CloudPlatform`����ʹ�ļ����ڻ״̬������ƽ̨״̬����Ч�� |



���磬����ָ���ڶ����ļ�ֻ����Kubernetes������ʱ����Ч������ֻ���� ��prod�� �� ��staging�� �����ļ����ڻ״̬ʱ����Ч��







Properties

Yaml





```
myprop=always-set
#---
spring.config.activate.on-cloud-platform=kubernetes
spring.config.activate.on-profile=prod | staging
myotherprop=sometimes-set

```











### [](https://springdoc.cn/spring-boot/features.html#features.external-config.encrypting)2.4\. �����������ԣ�Encrypting Properties��



Spring Bootû��Ϊ��������ֵ�ṩ�κ�����֧�֣������ṩ��Hookm�����������޸�Spring `Environment` �а�����ֵ�� `EnvironmentPostProcessor` �ӿ���������Ӧ�ó�������ǰ���� `Environment`�� �μ�[howto.html](https://springdoc.cn/spring-boot/howto.html#howto.application.customize-the-environment-or-application-context)���˽����顣





�������Ҫһ�ְ�ȫ�ķ�ʽ���洢ƾ֤�����룬 [Spring Cloud Vault](https://cloud.spring.io/spring-cloud-vault/) ��Ŀ�ṩ�˶��� [HashiCorp Vault](https://www.vaultproject.io/)�д洢�ⲿ�����õ�֧�֡�







### [](https://springdoc.cn/spring-boot/features.html#features.external-config.yaml)2.5\. ʹ�� YAML



[YAML](https://yaml.org/) ��JSON�ĳ����������ָ���ֲ��������ݵķ����ʽ�� ֻҪ���classpath���� [SnakeYAML](https://github.com/snakeyaml/snakeyaml) �⣬`SpringApplication` ��ͻ��Զ�֧��YAML��Ϊproperties�����Ʒ��





|  | �����ʹ�� ��Starter����SnakeYAML���� `spring-boot-starter` �Զ��ṩ�� |
| --- | --- |





#### [](https://springdoc.cn/spring-boot/features.html#features.external-config.yaml.mapping-to-properties)2.5.1\. ��YAMLӳ�䵽Properties



YAML �ĵ���Ҫ����ֲ��ʽת��Ϊ���� Spring `Environment` һ��ʹ�õı�ƽ�ṹ�� ���磬�����������YAML�ĵ���







```
environments:
  dev:
    url: "https://dev.example.com"
    name: "Developer Setup"
  prod:
    url: "https://another.example.com"
    name: "My Cool App"
```







Ϊ�˴� `Environment` �з�����Щ���ԣ����ǽ�����ƽ����������ʾ��







```
environments.dev.url=https://dev.example.com
environments.dev.name=Developer Setup
environments.prod.url=https://another.example.com
environments.prod.name=My Cool App
```







ͬ���أ�YAML�е��б�Ҳ��Ҫ���б�ƽ������ ���Ǳ���ʾΪ���� `[index]` ������key�� ���磬���������YAML��







```
my:
 servers:
 - "dev.example.com"
 - "another.example.com"
```







ǰ������ӽ���ת��Ϊ�������ԡ�







```
my.servers[0]=dev.example.com
my.servers[1]=another.example.com
```







|  | ʹ�� `[index]` ���ŵ����Կ���ʹ��Spring Boot�� `Binder` ��󶨵�Java `List` �� `Set` ���� ����ϸ�ڼ������ ��[���Ͱ�ȫ����������](https://springdoc.cn/spring-boot/features.html#features.external-config.typesafe-configuration-properties)�� ���֡� |
| --- | --- |





|  | YAML�ļ�����ͨ��ʹ�� `@PropertySource` �� `@TestPropertySource` ע�������ء� ���ԣ�������Ҫ�����ַ�ʽ����ֵ������£�����Ҫʹ��һ�� properties �ļ��� |
| --- | --- |







#### [](https://springdoc.cn/spring-boot/features.html#features.external-config.yaml.directly-loading)2.5.2\. ֱ�Ӽ���YAML



Spring Framework�ṩ������������࣬������������YAML�ĵ��� `YamlPropertiesFactoryBean` ��YAML��Ϊ `Properties` ���أ�`YamlMapFactoryBean` ��YAML��Ϊ `Map` ���ء�





��������YAML����ΪSpring�� `PropertySource` ����Ҳ����ʹ�� `YamlPropertySourceLoader` �ࡣ









### [](https://springdoc.cn/spring-boot/features.html#features.external-config.random-values)2.6\. �������ֵ



The `RandomValuePropertySource` is useful for injecting random values (for example, into secrets or test cases). It can produce integers, longs, uuids, or strings, as shown in the following example:





`RandomValuePropertySource` ����ע�����ֵ�����ã����磬ע���������԰������� �����Բ���Integer��Long��UUID����String���������������ʾ��







Properties

Yaml





```
my.secret=${random.value}
my.number=${random.int}
my.bignumber=${random.long}
my.uuid=${random.uuid}
my.number-less-than-ten=${random.int(10)}
my.number-in-range=${random.int[1024,65536]}

```







`random.int*` ���﷨�� `OPEN value (,max) CLOSE`������ `OPEN,CLOSE` ���κ��ַ��� `value,max` �������� ����ṩ�� `max`����ô `value` ����Сֵ�� `max` �����ֵ����ռ����







### [](https://springdoc.cn/spring-boot/features.html#features.external-config.system-environment)2.7\. ����ϵͳ��������



Spring Boot֧��Ϊ������������һ��ǰ׺�� ���ϵͳ������������в�ͬ����Ҫ���Spring BootӦ�ó�������ͺ����á� ϵͳ�������Ե�ǰ׺����ֱ���� `SpringApplication` �����á�





���磬����㽫ǰ׺����Ϊ `input` ������ `remote.timeout` ������������ϵͳ������Ҳ��������Ϊ `input.remote.timeout`��







### [](https://springdoc.cn/spring-boot/features.html#features.external-config.typesafe-configuration-properties)2.8\. ���Ͱ�ȫ����������



ʹ�� `@Value("${property}")` ע����ע������������ʱ����鷳���ر��ǵ���Ҫ���������Ի���������Ƿֲ�ġ� Spring Boot�ṩ��һ�ִ������Ե������������ǿ���͵�Bean�������֤���Ӧ�ó�������á�





|  | ����μ�[`@Value` �����Ͱ�ȫ��������֮�������](https://springdoc.cn/spring-boot/features.html#features.external-config.typesafe-configuration-properties.vs-value-annotation)�� |
| --- | --- |





#### [](https://springdoc.cn/spring-boot/features.html#features.external-config.typesafe-configuration-properties.java-bean-binding)2.8.1\. JavaBean ���԰�



�������������ʾ�����԰�һ�������˱�׼JavaBean���Ե�bean��







Java

Kotlin





```
@ConfigurationProperties("my.service")
public class MyProperties {

    private boolean enabled;

    private InetAddress remoteAddress;

    private final Security security = new Security();

    // getters / setters...

    public static class Security {

        private String username;

        private String password;

        private List<String> roles = new ArrayList<>(Collections.singleton("USER"));

        // getters / setters...

    }

}

```







ǰ���POJO�������������ԡ�





*   `my.service.enabled`��Ĭ��ֵΪ`false`��

*   `my.service.remote-address`�������Ϳ���`String`ǿ���ṩ��

*   `my.service.security.username`����һ��Ƕ�׵� `security` �����������ɸ����Ե����ƾ����� �ر��ǣ�������ȫû��ʹ�����ͣ������� `SecurityProperties`��

*   `my.service.security.password`.

*   `my.service.security.role`����һ�� `String` �ļ��ϣ�Ĭ��Ϊ `USER`��





|  | ӳ�䵽Spring Boot�п��õ� `@ConfigurationProperties` ������ԣ�ͨ��properties�ļ���YAML�ļ��������������������ƽ������ã���Щ�����ǹ���API�����౾��� getters/setters ������ζ�ſ���ֱ��ʹ�ã�һ�仰��SpringҲ��ͨ��getter/setter��Щpublic������������ֵ�ģ�����ã��� |
| --- | --- |





|  | ���������������һ��Ĭ�ϵ��޲ι��캯����getter��setterͨ���Ǳ���ģ���Ϊ����ͨ����׼��Java Beans property descriptor��Java��ʡ��ʵ�ֵģ�������Spring MVC��һ���� ����������£�����ʡ��setter��*   Map, ֻҪ���Ǳ���ʼ��������Ҫһ��getter������һ����Ҫһ��setter����Ϊ���ǿ��Ա�����ͻ�䡣        *   Collection��array ����ͨ��������ͨ����YAML����ʹ�õ������ŷָ���ֵ�����ԣ������ʡ� �ں�һ������£�һ��setter�Ǳ���ġ� ���ǽ�������Ϊ�����������һ��setter�� ������ʼ��һ�����ϣ�ȷ�������ǲ��ɱ�ģ���ǰ������ӣ���        *   ���Ƕ�׵�POJO���Ա���ʼ��������ǰ�������е� `Security` �ֶΣ����Ͳ���Ҫsetter�� ��������ð���ͨ��ʹ������Ĭ�Ϲ��캯������ʱ����ʵ��������Ҫһ��setter��        ��Щ��ʹ��Project Lombok���Զ����getter��setter�� ��ȷ��Lombok����Ϊ���������������κ��ض��Ĺ��캯������Ϊ���������Զ�����ʵ�����������ֻ���Ǳ�׼��Java Bean���ԣ���֧�ֶԾ�̬���Եİ󶨡� |
| --- | --- |







#### [](https://springdoc.cn/spring-boot/features.html#features.external-config.typesafe-configuration-properties.constructor-binding)2.8.2\. ���캯����



��һ�ڵ����ӿ����ò��ɱ�ķ�ʽ��д����������ʾ��







Java

Kotlin





```
@ConfigurationProperties("my.service")
public class MyProperties {

    // fields...

    public MyProperties(boolean enabled, InetAddress remoteAddress, Security security) {
        this.enabled = enabled;
        this.remoteAddress = remoteAddress;
        this.security = security;
    }

    // getters...

    public static class Security {

        // fields...

        public Security(String username, String password, @DefaultValue("USER") List<String> roles) {
            this.username = username;
            this.password = password;
            this.roles = roles;
        }

        // getters...

    }

}

```







�����������У�Ψһ�ġ����������캯�����Ĵ�����ζ��Ӧ��ʹ�øù��캯�����а󶨡� ����ζ�Ű������ҵ�һ��������ϣ���󶨵Ĳ����Ĺ��캯���� ���������ж�����캯��������ʹ�� `@ConstructorBinding` ע����ָ��ʹ���ĸ����캯�����й��캯���󶨡� ���ҪΪһ��ֻ��һ�������������캯��������ѡ�񲻰󶨹��캯�����ù��캯�������� `@Autowired` ��ע�⡣ ���캯���󶨿����� `Record` һ��ʹ�á� ������ļ�¼�ж�����캯��������û�б�Ҫʹ�� `@ConstructorBinding`��





���캯�������Ƕ�׳�Ա�������������е� `Security`��Ҳ��ͨ���乹�캯�����󶨡�





Ĭ��ֵ�����ڹ��캯��������Record�����ʹ�� `@DefaultValue` ��ָ���� ת�����񽫱�Ӧ���ڽ�ע��� `String` ֵǿ��ת��Ϊȱʧ���Ե�Ŀ�����͡�





�ο�ǰ������ӣ����û�����԰󶨵� `Security` �� `MyProperties` ʵ��������һ�� `security` ���͵� `null` ֵ�� Ϊ��ʹ������һ���� null �� `Security` ʵ������ʹû��������֮�󶨣���ʹ��Kotlinʱ���⽫Ҫ�� `Security` �� `username` �� `password` ����������Ϊ nullable����Ϊ����û��Ĭ��ֵ����ʹ��һ���յ� `@DefaultValue` ע�⡣







Java

Kotlin





```
public MyProperties(boolean enabled, InetAddress remoteAddress, @DefaultValue Security security) {
    this.enabled = enabled;
    this.remoteAddress = remoteAddress;
    this.security = security;
}

```







|  | Ҫʹ�ù��캯���󶨣��������ʹ�� `@EnableConfigurationProperties` ����������ɨ�������á� �㲻�ܶ�ͨ������Spring���ƴ�����Beanʹ�ù��캯���󶨣����� `@Component` Bean��ͨ��ʹ�� `@Bean` ����������Bean��ͨ��ʹ�� `@Import` ���ص�Bean���� |
| --- | --- |





|  | Ҫ��ԭ��������ʹ�ù��캯���󶨣������� `-parameters` ����������ࡣ�����ʹ�� Spring Boot �� Gradle �����ʹ�� Maven �� `spring-boot-starter-parent`���⽫�Զ����á� |
| --- | --- |





|  | �����齫 `java.util.Optional` �� `@ConfigurationProperties` һ��ʹ�ã���Ϊ����Ҫ����Ϊһ����������ʹ�á� ��ˣ��������ʺ���������ע�롣 Ϊ�����������͵����Ա���һ�£������ȷʵ������һ�� `Optional` ���ԣ�����û��ֵ��`null` ������һ���յ� `Optional` �����󶨡� |
| --- | --- |







#### [](https://springdoc.cn/spring-boot/features.html#features.external-config.typesafe-configuration-properties.enabling-annotated-types)2.8.3\. ���� @ConfigurationProperties ��



Spring Boot�ṩ�˰� `@ConfigurationProperties` ���Ͳ�����ע��ΪBean�Ļ�����ʩ�� ������������Ļ����������������ԣ�����������������ɨ�裬�乤����ʽ�����ɨ�����ơ�





��ʱ���� `@ConfigurationProperties` ע�������ܲ��ʺ�ɨ�裬���磬��������ڿ������Լ����Զ����û����������������������ǡ� ����Щ����£�ʹ�� `@EnableConfigurationProperties` ע��ָ��Ҫ����������б� ������ע�����κ� `@Configuration` ���ϣ��������������ʾ��







Java

Kotlin





```
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(SomeProperties.class)
public class MyConfiguration {

}

```









Java

Kotlin





```
@ConfigurationProperties("some.properties")
public class SomeProperties {

}

```







Ҫʹ����������ɨ�裬�������application��� `@ConfigurationPropertiesScan` ע�⡣ ͨ����������ӵ��� `@SpringBootApplication` ע���main���У�����Ҳ���Ա���ӵ��κ� `@Configuration` ���ϡ� Ĭ������£�ɨ����ע�����ڵİ���ʼ����������Զ���ɨ�������������Բο����¡�







Java

Kotlin





```
@SpringBootApplication
@ConfigurationPropertiesScan({ "com.example.app", "com.example.another" })
public class MyApplication {

}

```







|  | �� `@ConfigurationProperties` Beanʹ����������ɨ���ͨ�� `@EnableConfigurationProperties` ע��ʱ����Bean��һ���������ƣ�`<prefix>-<fqn>`������ `<prefix>` �� `@ConfigurationProperties` ע����ָ���Ļ�����ǰ׺�� `<fqn>` ��Bean����ȫ�޶����ơ� ���ע��û���ṩ�κ�ǰ׺����ֻʹ��Bean����ȫ�޶����ơ��������� `com.example.app` ���У������ `SomeProperties` ���ӵ� bean ������ `some.properties-com.example.app.SomeProperties`�� |
| --- | --- |





���ǽ��� `@ConfigurationProperties` ֻ���� environment���ر��ǲ���������ע������Bean�� ���ڱ߽ǰ��������������������ʹ�� setter ע������ṩ���κ� `*Aware` �ӿڣ��� `EnvironmentAware` ���������Ҫ���� `Environment`���� �������Ȼ��ʹ�ù�����ע������Bean����������Bean������ `@Component` ��ע�⣬��ʹ�û���JavaBean�����԰󶨡�







#### [](https://springdoc.cn/spring-boot/features.html#features.external-config.typesafe-configuration-properties.using-annotated-types)2.8.4\. ʹ�� @ConfigurationProperties ��



�������÷�ʽ�� `SpringApplication` �ⲿYAML������ϵ��ر�ã�������������ʾ��







```
my:
  service:
    remote-address: 192.168.1.1
    security:
      username: "admin"
      roles:
      - "USER"
      - "ADMIN"
```







Ҫʹ�� `@ConfigurationProperties` Bean���������������Bean��ͬ�ķ�ʽע�����ǣ���������ʾ��







Java

Kotlin





```
@Service
public class MyService {

    private final MyProperties properties;

    public MyService(MyProperties properties) {
        this.properties = properties;
    }

    public void openConnection() {
        Server server = new Server(this.properties.getRemoteAddress());
        server.start();
        // ...
    }

    // ...

}

```







|  | ʹ�� `@ConfigurationProperties` ��������������Ԫ�����ļ�����Щ�ļ����Ա�IDE�����������Եġ��Զ���ȫ�����ܡ� �����[��¼](https://springdoc.cn/spring-boot/configuration-metadata.html#appendix.configuration-metadata)�� |
| --- | --- |







#### [](https://springdoc.cn/spring-boot/features.html#features.external-config.typesafe-configuration-properties.third-party-configuration)2.8.5\. ����������



����ʹ�� `@ConfigurationProperties` ��ע��һ����֮�⣬�㻹�����ڹ����� `@Bean` ������ʹ������ ����������԰󶨵������֮��ĵ��������ʱ���������ر����á�





Ҫ�� `Environment` ����������һ��Bean��������Beanע������� `@ConfigurationProperties` ����������ʾ��







Java

Kotlin





```
@Configuration(proxyBeanMethods = false)
public class ThirdPartyConfiguration {

    @Bean
    @ConfigurationProperties(prefix = "another")
    public AnotherComponent anotherComponent() {
        return new AnotherComponent();
    }

}

```







�κ��� `another` ǰ׺�����JavaBean���Զ��ᱻӳ�䵽 `AnotherComponent` Bean�ϣ��䷽ʽ������ǰ��� `SomeProperties` ���ӡ�







#### [](https://springdoc.cn/spring-boot/features.html#features.external-config.typesafe-configuration-properties.relaxed-binding)2.8.6\. ���ɵİ�



Spring Boot�ڽ� `Environment` ���԰󶨵� `@ConfigurationProperties` beanʱʹ����һЩ���ɵĹ������ `Environment` �������ƺ�bean��������֮�䲻��Ҫ��ȫƥ�䡣 ������ã����������Ӱ������ۺŷָ����������ƣ����磬 `context-path` �󶨵� `contextPath` �����ʹ�д���������ƣ����磬`PORT` �󶨵� `port` ����





��ʾһ�����ӣ��������� `@ConfigurationProperties` �ࡣ







Java

Kotlin





```
@ConfigurationProperties(prefix = "my.main-project.person")
public class MyPersonProperties {

    private String firstName;

    public String getFirstName() {
        return this.firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

}

```







�����ϵĴ�����˵�����µ��������ƶ�����ʹ�á�



<caption>Table 3\. relaxed binding</caption><colgroup><col><col></colgroup>
| Property | Note |
| --- | --- |
| `my.main-project.person.first-name` | Kebab ��񣨶̺��߸������������� `.properties` �� `.yml` �ļ���ʹ�á� |
| `my.main-project.person.firstName` | ��׼���շ��﷨�� |
| `my.main-project.person.first_name` | �»��ߣ�����һ������ `.properties` �� `.yml` �ļ��������ʽ�� |
| `MY_MAINPROJECT_PERSON_FIRSTNAME` | ��д��ʽ����ʹ��ϵͳ��������ʱ����ʹ�ô�д��ʽ�� |



|  | ע��� `prefix` ֵ _����_ ��kebab���Сд���� `-` �ָ����� `my.main-project.person` ���� |
| --- | --- |



<caption>Table 4\. ÿ������Դ�Ŀ��ɰ󶨹���</caption><colgroup><col><col><col></colgroup>
| ����Դ | �򵥵� | �б� |
| --- | --- | --- |
| Properties �ļ� | �շ�, kebab , �»��� | ʹ�� `[ ]` �򶺺ŷָ�ֵ�ı�׼�б��﷨ |
| YAML �ļ� | �շ�, kebab , �»��� | ��׼YAML�б��﷨�򶺺ŷָ���ֵ |
| �������� | ��д���»���Ϊ�ָ���(�� [�ӻ���������](https://springdoc.cn/spring-boot/features.html#features.external-config.typesafe-configuration-properties.relaxed-binding.environment-variables)). | Numeric values surrounded by underscores (see [�ӻ���������](https://springdoc.cn/spring-boot/features.html#features.external-config.typesafe-configuration-properties.relaxed-binding.environment-variables)) |
| ϵͳ���ԣ�System properties�� | �շ�, kebab , �»��� | ʹ�� `[ ]` �򶺺ŷָ�ֵ�ı�׼�б��﷨ |



|  | ���ǽ��飬�ڿ��ܵ�����£�����Ӧ��Сд��kebab��ʽ�洢������ `my.person.first-name=Rod` �� |
| --- | --- |





##### [](https://springdoc.cn/spring-boot/features.html#features.external-config.typesafe-configuration-properties.relaxed-binding.maps)��Map



���󶨵� `Map` ����ʱ���������Ҫʹ��һ����������ŷ��ţ��Ա㱣��ԭʼ�� `key` ֵ�� ���keyû�б� `[ ]` �������κη���ĸ���֡�`-` �� `.` ���ַ�����ɾ����





���磬���ǽ��������԰󶨵�һ�� `Map<String,String>`��







Properties

Yaml





```
my.map.[/key1]=value1
my.map.[/key2]=value2
my.map./key3=value3
```







|  | ����YAML�ļ���������Ҫ�����Ű�������ʹkey����ȷ������ |
| --- | --- |





��������Խ��󶨵�һ�� `Map` ��`/key1`��`/key2` �� `key3` ��Ϊmap��key�� б���Ѿ��� `key3` ��ɾ������Ϊ��û�б������Ű�����





���󶨵�����ֵʱ������ `.` �ļ�����Ҫ�� `[]` ������ ����ֵ����ö�ٺ����� `java.lang` ���е����ͣ����� `Object` �� �� `a.b=c` �󶨵� `Map<String, String>` ���������е� `.` ��������һ������ `{"a.b"="c"}` Entry��Map�� �����κ��������ͣ������� `key` ���� `.` ������Ҫʹ�����ŷ��š� ���磬�� `a.b=c` �󶨵� `Map<String, Object>` ������һ������ `{"a"={"b"="c"}` entry��Map���� `[a.b]=c` ������һ������ `{"a.b"="c"}` entry ��Map��







##### [](https://springdoc.cn/spring-boot/features.html#features.external-config.typesafe-configuration-properties.relaxed-binding.environment-variables)�ӻ���������



���磬Linux shell����ֻ�ܰ�����ĸ��`a` �� `z` �� `A` �� `Z` �������֣� `0` �� `9` �����»����ַ��� `_` ���� ���չ�����Unix shell����������Ҳ�����ô�д��ĸ��





Spring Boot���ɵİ󶨹������Ϊ�����ܵ�����Щ�������Ƽ��ݡ�





Ҫ���淶��ʽ����������ת��Ϊ�����������ƣ��������ѭ��Щ����





*   ���»��ߣ�`_`���滻�㣨`.`����

*   ɾ���κ����ۺţ�`-`����

*   ת��Ϊ��д��ĸ��





���磬�������� `spring.main.log-startup-info` ����һ����Ϊ `SPRING_MAIN_LOGSTARTUPINFO` �Ļ���������





��������Ҳ�����ڰ󶨵������б�List��ʱʹ�á� Ҫ�󶨵�һ�� `List`���ڱ��������У�Ԫ�ر�ţ�������Ӧ�����»��߰�����





���磬�������� `my.service[0].other` ��ʹ��һ����Ϊ `MY_SERVICE_0_OTHER` �Ļ���������









#### [](https://springdoc.cn/spring-boot/features.html#features.external-config.typesafe-configuration-properties.merging-complex-types)2.8.7\. �ϲ����ӵ�����



��List�������ڶ���ط�ʱ�����ǵ��������滻����list��





���磬����һ�� `MyPojo` ����� `name` �� `description` ����Ĭ��Ϊ `null`�� ��������Ӵ� `MyProperties` �б�¶��һ�� `MyPojo` ������б�







Java

Kotlin





```
@ConfigurationProperties("my")
public class MyProperties {

    private final List<MyPojo> list = new ArrayList<>();

    public List<MyPojo> getList() {
        return this.list;
    }

}

```







�����������á�







Properties

Yaml





```
my.list[0].name=my name
my.list[0].description=my description
#---
spring.config.activate.on-profile=dev
my.list[0].name=my another name

```







��� `dev` �����ļ�δ�����`MyProperties.list` ����һ�� `MyPojo` ��Ŀ����֮ǰ����������� Ȼ������� `dev` �����ļ������`list` ��Ȼֻ����һ����Ŀ��name Ϊ `my another name`��descriptionΪ `null`���� �������ò������б�����ӵڶ��� `MyPojo` ʵ����Ҳ����ϲ���Ŀ��





��һ�� `List` �ڶ�������ļ��б�ָ��ʱ����ʹ�þ���������ȼ����Ǹ�������ֻ���Ǹ����� ������������ӡ�







Properties

Yaml





```
my.list[0].name=my name
my.list[0].description=my description
my.list[1].name=another name
my.list[1].description=another description
#---
spring.config.activate.on-profile=dev
my.list[0].name=my another name

```







��ǰ��������У���� `dev` �����ļ��Ǽ���ģ�`MyProperties.list` ���� _һ��_ `MyPojo` ��Ŀ��name �� `my another name`��description�� `null`���� ����YAML�����ŷָ����б��YAML�б�����������ȫ�����б�����ݡ�





���� `Map` ���ԣ�������ôӶ����Դ��ȡ������ֵ���а󶨡� Ȼ�������ڶ����Դ�е�ͬһ���ԣ�ʹ�þ���������ȼ����Ǹ��� ��������Ӵ� `MyProperties` ��¶��һ�� `Map<String, MyPojo>`��







Java

Kotlin





```
@ConfigurationProperties("my")
public class MyProperties {

    private final Map<String, MyPojo> map = new LinkedHashMap<>();

    public Map<String, MyPojo> getMap() {
        return this.map;
    }

}

```







�����������á�







Properties

Yaml





```
my.map.key1.name=my name 1
my.map.key1.description=my description 1
#---
spring.config.activate.on-profile=dev
my.map.key1.name=dev name 1
my.map.key2.name=dev name 2
my.map.key2.description=dev description 2

```







��� `dev` �����ļ�û�м��`MyProperties.map` ����һ��keyΪ `key1` ����Ŀ��nameΪ `my name 1` ��descriptionΪ `my description 1` ���� Ȼ������� `dev` �����ļ������`map` ����������Ŀ��keyΪ `key1` ��nameΪ `dev name 1`��descriptionΪ `my description 1` ���� `key2`��nameΪ `dev name 2`��descriptionΪ `dev description 2`����





|  | ǰ��ĺϲ�������������������Դ�����ԣ������������ļ��� |
| --- | --- |







#### [](https://springdoc.cn/spring-boot/features.html#features.external-config.typesafe-configuration-properties.conversion)2.8.8\. ���ԣ�Properties��ת��



��Spring Boot�� `@ConfigurationProperties` Bean��ʱ������ͼ���ⲿapplication propertiesǿ�Ƹ�Ϊ��ȷ�����͡� �������Ҫ�Զ�������ת����������ṩһ�� `ConversionService` bean��Bean������Ϊ `conversionService` �����Զ������Ա༭����ͨ�� `CustomEditorConfigurer` bean�����Զ��� `Converters` Bean��ʹ�� `@ConfigurationPropertiesBinding` ע�⣩��





|  | �������Bean����Ӧ�ó����������ڵ����ڱ�����ģ���ȷ��������� `ConversionService` ��ʹ�õ�������ϵ�� ͨ������£�������Ҫ���κ�������ϵ�ڴ���ʱ����û����ȫ��ʼ���� �������Զ��� `ConversionService` ����Ҫ����keys coercion�����������������������ֻ������ `@ConfigurationPropertiesBinding` �޶����Զ���ת������ |
| --- | --- |





##### [](https://springdoc.cn/spring-boot/features.html#features.external-config.typesafe-configuration-properties.conversion.durations)ת��Ϊ Duration



Spring Boot�Ա�����ʱ����ר�ŵ�֧�֡� ����㹫����һ�� `java.time.Duration` ���ԣ�application properties�е����¸�ʽ�Ϳ��á�





*   ��ͨ�� `long` ��ʹ�ú�����ΪĬ�ϵ�λ������ָ���� `@DurationUnit` ����

*   ��׼��ISO-8601��ʽ [�� `java.time.Duration` ʹ��](https://docs.oracle.com/javase/17/docs/api/java/time/Duration.html#parse-java.lang.CharSequence-)��

*   һ�����׶��ĸ�ʽ������ֵ�͵�λ����ϵģ�`10s` ��ʾ10�룩��





�뿼���������ӡ�







Java

Kotlin





```
@ConfigurationProperties("my")
public class MyProperties {

    @DurationUnit(ChronoUnit.SECONDS)
    private Duration sessionTimeout = Duration.ofSeconds(30);

    private Duration readTimeout = Duration.ofMillis(1000);

    // getters / setters...

}

```







Ҫָ��һ��30��ĻỰ��ʱ�� `30` �� `PT30S` �� `30s` ���ǵȼ۵ġ� ��ȡ��ʱΪ500ms�������������κ�һ����ʽָ���� `500`, `PT0.5S` �� `500ms`.





��Ҳ����ʹ������֧�ֵ�ʱ�䵥λ��





*   `ns` ����

*   `us` ΢��

*   `ms` ����

*   `s` ��

*   `m` ��

*   `h` Сʱ

*   `d` ��





Ĭ�ϵ�λ�Ǻ��룬����ʹ�� `@DurationUnit` ����д���������������ʾ��





�����ϲ��ʹ�ù��캯���󶨣�ͬ�������Կ��Ա���¶�������������������ʾ��







Java

Kotlin





```
@ConfigurationProperties("my")
public class MyProperties {

    // fields...

    public MyProperties(@DurationUnit(ChronoUnit.SECONDS) @DefaultValue("30s") Duration sessionTimeout,
            @DefaultValue("1000ms") Duration readTimeout) {
        this.sessionTimeout = sessionTimeout;
        this.readTimeout = readTimeout;
    }

    // getters...

}

```







|  | �����Ҫ����һ�� `Long` �����ԣ���������Ǻ��룬��ȷ�����嵥λ��ʹ�� `@DurationUnit` ���� �������ṩ��һ��͸��������·����ͬʱ֧�ָ��ḻ�ĸ�ʽ |
| --- | --- |







##### [](https://springdoc.cn/spring-boot/features.html#features.external-config.typesafe-configuration-properties.conversion.periods)ת��Ϊ�ڼ䣨Period��



����duration��Spring Boot������ʹ�� `java.time.Period` ���͡� ���¸�ʽ������application properties��ʹ�á�





*   һ������� `int` ��ʾ����ʹ������ΪĬ�ϵ�λ������ָ���� `@PeriodUnit` ����

*   ��׼��ISO-8601��ʽ [�� `java.time.Period` ʹ��](https://docs.oracle.com/javase/17/docs/api/java/time/Period.html#parse-java.lang.CharSequence-)��

*   һ�����򵥵ĸ�ʽ������ֵ�͵�λ������ϵģ� `1y3d` ��ʾ1��3�죩��





֧�����м򵥵ĵ�λ��ʽ��





*   `y` ��

*   `m` ��

*   `w` ��

*   `d` ��





|  | `java.time.Period` ����ʵ���ϴ�δ�洢������������һ����ݷ�ʽ����ζ�� ��7�족�� |
| --- | --- |







##### [](https://springdoc.cn/spring-boot/features.html#features.external-config.typesafe-configuration-properties.conversion.data-sizes)ת��Ϊ���ݴ�С��Data Sizes��



Spring Framework��һ�� `DataSize` ֵ���ͣ����ֽ�Ϊ��λ����С�� ����㹫����һ�� `DataSize` ���ԣ�application properties�е����¸�ʽ�Ϳ��á�





*   һ������� `long` ��ʾ��ʹ���ֽ���ΪĬ�ϵ�λ������ָ���� `@DataSizeUnit`����

*   һ�����׶��ĸ�ʽ������ֵ�͵�λ����ϵģ�`10MB` ��ζ��10���ֽڣ���





�����������ӡ�







Java

Kotlin





```
@ConfigurationProperties("my")
public class MyProperties {

    @DataSizeUnit(DataUnit.MEGABYTES)
    private DataSize bufferSize = DataSize.ofMegabytes(2);

    private DataSize sizeThreshold = DataSize.ofBytes(512);

    // getters/setters...

}

```







Ҫָ��һ��10���ֽڣ�Mb���Ļ�������С�� `10` �� `10MB` �ǵȼ۵ġ� 256�ֽڵĴ�С��ֵ����ָ��Ϊ `256` �� `256B`��





��Ҳ����ʹ��������Щ֧�ֵĵ�λ��





*   `B` �ֽ�

*   `KB` KB

*   `MB` MB

*   `GB` GB

*   `TB` TB





Ĭ�ϵ�λ���ֽڣ�����ʹ�� `@DataSizeUnit` ����д���������������ʾ��





�����ϲ��ʹ�ù��캯���󶨣�ͬ�������Կ��Ա���¶�������������������ʾ��







Java

Kotlin





```
@ConfigurationProperties("my")
public class MyProperties {

    // fields...

    public MyProperties(@DataSizeUnit(DataUnit.MEGABYTES) @DefaultValue("2MB") DataSize bufferSize,
            @DefaultValue("512B") DataSize sizeThreshold) {
        this.bufferSize = bufferSize;
        this.sizeThreshold = sizeThreshold;
    }

    // getters...

}

```







|  | �������������һ�� `Long` ���ԣ�ȷ�����嵥λ��ʹ�� `@DataSizeUnit`��������������ֽڡ� �������ṩ��һ��͸��������·����ͬʱ֧�ָ��ḻ�ĸ�ʽ�� |
| --- | --- |









#### [](https://springdoc.cn/spring-boot/features.html#features.external-config.typesafe-configuration-properties.validation)2.8.9\. @ConfigurationProperties У��



ֻҪʹ��Spring�� `@Validated` ע�⣬Spring Boot�ͻ᳢����֤ `@ConfigurationProperties` �ࡣ �����ֱ���������������ʹ��JSR-303�� `jakarta.validation` Լ��ע�⡣ Ҫ������һ�㣬��ȷ�����classpath����һ�����ݵ�JSR-303ʵ�֣�Ȼ��Լ��ע����ӵ�����ֶ��У��������������ʾ��







Java

Kotlin





```
@ConfigurationProperties("my.service")
@Validated
public class MyProperties {

    @NotNull
    private InetAddress remoteAddress;

    // getters/setters...

}

```







|  | ��Ҳ����ͨ���� configuration properties �� `@Bean` ������ע�� `@Validated` ��������֤�� |
| --- | --- |





Ϊ��ȷ������ΪǶ�׵����Դ�����֤����ʹû���ҵ����ԣ���ص��ֶα����� `@Valid` ��ע�͡� ��������ӽ�����ǰ��� `MyProperties` �Ļ����ϡ�







Java

Kotlin





```
@ConfigurationProperties("my.service")
@Validated
public class MyProperties {

    @NotNull
    private InetAddress remoteAddress;

    @Valid
    private final Security security = new Security();

    // getters/setters...

    public static class Security {

        @NotEmpty
        private String username;

        // getters/setters...

    }

}

```







��Ҳ����ͨ������һ����Ϊ `configurationPropertiesValidator` ��bean���������һ���Զ����Spring `Validator`�� `@Bean` ����Ӧ�ñ�����Ϊ `static`�� ����������֤������Ӧ�ó����������ڵ����ڴ����ģ��� `@Bean` ��������Ϊ��̬��������Bean�Ĵ�������Ҫʵ���� `@Configuration` �ࡣ ���������Ա������ʵ��������������κ����⡣





|  | `spring-boot-actuator` ģ�����һ����¶���� `@ConfigurationProperties` Bean �Ķ˵㡣 �����ͨ����������� `/actuator/configprops` ��ʹ����Ӧ��JMX�˵㡣 �����"[��������](https://springdoc.cn/spring-boot/actuator.html#actuator.endpoints)"���֡� |
| --- | --- |







#### [](https://springdoc.cn/spring-boot/features.html#features.external-config.typesafe-configuration-properties.vs-value-annotation)2.8.10\. @ConfigurationProperties vs. @Value



`@Value` ע����һ�����ĵ��������ܣ������ṩ�����Ͱ�ȫ������������ͬ�Ĺ��ܡ� �±��ܽ��� `@ConfigurationProperties` �� `@Value` ��֧�ֵĹ��ܡ�



<colgroup><col><col><col></colgroup>
| ���� | `@ConfigurationProperties` | `@Value` |
| --- | --- | --- |
| [���ɰ�](https://springdoc.cn/spring-boot/features.html#features.external-config.typesafe-configuration-properties.relaxed-binding) | Yes | ������ (�� [����ע��](https://springdoc.cn/spring-boot/features.html#features.external-config.typesafe-configuration-properties.vs-value-annotation.note)) |
| [֧�� Meta-data](https://springdoc.cn/spring-boot/configuration-metadata.html#appendix.configuration-metadata) | Yes | No |
| `SpEL` ���ʽ | No | Yes |



|  | �����ȷʵ��ʹ�� `@Value`�����ǽ�����ʹ���������ƵĹ淶��ʽ����ʹ��Сд��ĸ��kebab-case���������������ơ� �⽫����Spring Bootʹ���� [���ɰ�](https://springdoc.cn/spring-boot/features.html#features.external-config.typesafe-configuration-properties.relaxed-binding) `@ConfigurationProperties` ʱ��ͬ���߼������磬`@Value("${demo.item-price}")` ���� `application.properties` �ļ��л�ȡ `demo.item-price` �� `demo.itemPrice` ��ʽ���Լ���ϵͳ�����л�ȡ `DEMO_ITEMPRICE`�� ������� `@Value("${demo.itemPrice}")` ���棬`demo.item-price` �� `DEMO_ITEMPRICE` �����ᱻ���ǡ� |
| --- | --- |





�����Ϊ���Լ������������һ�����ü������ǽ����㽫���Ƿ�����һ���� `@ConfigurationProperties` ע���POJO�С� ��������Ϊ���ṩ�ṹ���ġ����Ͱ�ȫ�Ķ�������Խ���ע�뵽���Լ���bean�С�





����Ӧ��[application property](https://springdoc.cn/spring-boot/features.html#features.external-config.files) �ļ��� `SpEL` ���ʽ�ڽ�����Щ�ļ������environmentʱ���ᱻ���� Ȼ���������� `@Value` ��дһ�� `SpEL` ���ʽ�� �������Ӧ�ó��������ļ�������ֵ��һ�� `SpEL` ���ʽ�������ڱ� `@Value` ����ʱ��������













## [](https://springdoc.cn/spring-boot/features.html#features.profiles)

