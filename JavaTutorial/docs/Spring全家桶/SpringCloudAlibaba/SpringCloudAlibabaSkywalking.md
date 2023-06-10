# 1\. SkyWalking ���

> Skywalking ���ɹ��ڿ�Դ���������ɣ�ԭ OneAPM ����ʦ��Ŀǰ�ڻ�Ϊ����Դ���ύ�� Apache �������Ĳ�Ʒ����ͬʱ������ Zipkin/Pinpoint/CAT �����˼·��֧�ַ�����ʽ��㡣��һ����ڷֲ�ʽ���ٵ�Ӧ�ó������ܼ��ϵͳ��������������չ����һ���� OpenTracing ����֯��ּ���ƽ���������ص�һЩ�淶�ͱ�׼������

*   SkyWalking ��һ����Դ���ƽ̨�����ڴӷ������ԭ��������ʩ�ռ����������ۺϺͿ��ӻ����ݡ�
*   SkyWalking �ṩ��һ�ּ򵥵ķ�����ά���ֲ�ʽϵͳ��������ͼ���������Կ��Ʋ鿴������һ���ִ�APM��ר��Ϊ��ԭ�������������ķֲ�ʽϵͳ��ơ�
*   SkyWalking ������ά�ȶ�Ӧ�ý��м��ӣ�service������, service instance��ʵ����, endpoint���˵㣩�������ʵ���Ͳ���˵�ˣ��˵��Ƿ����е�ĳ��·������˵URI��
*   SkyWalking �����û��˽����Ͷ˵�֮������˹�ϵ���鿴ÿ������/����ʵ��/�˵�Ķ����������þ�������

## SkyWalking�����

SkyWalking��Ҫ�ļ������ģ��:

1.  Agent ��Ҫ�����ϵͳ�вɼ�����ָ�꣬��·���ݣ����͸� oap ����
2.  oap ������� Agent ���͹��������ݣ��洢��ִ�з������ṩ��ѯ�ͱ������ܡ�
3.  Storage �� UI ����洢�����Լ��鿴���ݡ�

# 2\. ʹ�� Docker ���ٴ SkyWalking 8.0

1.  **�� linux ��������ѡ�񲢽���Ŀ¼**��

```
mkdir skywalking-docker
���ƴ���
```

1.  **���� skywalking-docker Ŀ¼������һ����Ϊ skywalking.yaml �Ľű��ļ�����������**��

```
version: '3'
services:
  elasticsearch7:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.5.0
    container_name: elasticsearch7
    restart: always
    ports:
      - 9023:9200
    environment:
      - discovery.type=single-node
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - TZ=Asia/Shanghai
    ulimits:
      memlock:
        soft: -1
        hard: -1
    networks:
      - skywalking
    volumes:
      - elasticsearch7:/usr/share/elasticsearch/data
  oap:
    image: apache/skywalking-oap-server:8.0.1-es7
    container_name: oap
    depends_on:
      - elasticsearch7
    links:
      - elasticsearch7
    restart: always
    ports:
      - 9022:11800
      - 9021:12800
    networks:
      - skywalking
    volumes:
      - ./ext-config:/skywalking/ext-config
  ui:
    image: apache/skywalking-ui:8.0.1
    container_name: ui
    depends_on:
      - oap
    links:
      - oap
    restart: always
    ports:
      - 9020:8080
    environment:
      SW_OAP_ADDRESS: oap:12800
    networks:
      - skywalking

networks:
  skywalking:
    driver: bridge

volumes:
  elasticsearch7:
    driver: local
���ƴ���
```

**ע��**����������븲�� oap �����е� /skywalking/config Ŀ¼�µ������ļ������ǿ����� docker �й���һ�� /skywalking/ext-config Ŀ¼���������ļ�������Ŀ¼�м��ɡ�

![image-20230423174422281](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230423174422281.png)

1.  **ִ�� skywalking.yaml �ű���������**��

```
docker-compose -f skywalking.yaml up
���ƴ���
```

1.  **���� skywalking �Ŀ���̨�����ָ����Ǳ��̣���ʼ��Ȼ�ǿյ�**��

```
http://(��װSkyWalking������IP):9020
���ƴ���
```

![image-20230423174444272](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230423174444272.png)

# 3\. �� Spring ��Ŀ������ SkyWalking �ͻ���

ȫ����־׷�� traceId ��ʹ�ã�

1.  **��� pom �ļ�����**��

```
        <dependency>
            <groupId>org.apache.skywalking</groupId>
            apm-toolkit-logback-1.x
            <version>8.0.1</version>
        </dependency>
        <dependency>
            <groupId>org.apache.skywalking</groupId>
            apm-toolkit-trace
            <version>8.0.1</version>
        </dependency>
���ƴ���
```

1.  **�� resources Ŀ¼�� ��� logback-spring.xml �ļ�����������**:

```
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <property name="logger.path" value="/mnt/logs"/>

    <!-- ��ɫ��־ -->
    <!-- ��ɫ��־��������Ⱦ�� -->
    <conversionRule conversionWord="clr" converterClass="org.springframework.boot.logging.logback.ColorConverter"/>
    <conversionRule conversionWord="wex"
                    converterClass="org.springframework.boot.logging.logback.WhitespaceThrowableProxyConverter"/>
    <conversionRule conversionWord="wEx"
                    converterClass="org.springframework.boot.logging.logback.ExtendedWhitespaceThrowableProxyConverter"/>
    <!-- ��ɫ��־��ʽ -->
    <property name="CONSOLE_LOG_PATTERN"
              value="${CONSOLE_LOG_PATTERN:-%clr(%d{yyyy-MM-dd HH:mm:ss.SSS}){faint} %clr(${LOG_LEVEL_PATTERN:-%5p}) %clr(${PID:- }){magenta} %clr(---){faint} %clr([%15.15t]){faint} %clr(%-40.40logger{39}){cyan} %clr(:){faint} %m%n${LOG_EXCEPTION_CONVERSION_WORD:-%wEx}}"/>

    <!-- ���������̨ -->
    
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
            <level>info</level>
        </filter>
        <encoder>
            <Pattern>${CONSOLE_LOG_PATTERN}</Pattern>
            <charset>UTF-8</charset>
        </encoder>
    

    <!-- ConsoleAppender������־���������̨ -->
    
        <encoder class="ch.qos.logback.core.encoder.LayoutWrappingEncoder">
            <layout class="org.apache.skywalking.apm.toolkit.log.logback.v1.x.mdc.TraceIdMDCPatternLogbackLayout">
                <Pattern>
                    <![CDATA[%clr(%d{${LOG_DATEFORMAT_PATTERN:-yyyy-MM-dd HH:mm:ss.SSS}}){faint} [%X{tid}] %clr(${LOG_LEVEL_PATTERN:-%5p}) %clr(${PID:- }){magenta} %clr(---){faint} %clr([%15.15t]){faint} %clr(%-40.40logger{39}){cyan} %clr(:){faint} %m%n${LOG_EXCEPTION_CONVERSION_WORD:-%wEx}]]></Pattern>
            </layout>
        </encoder>
    

    <!-- ������ļ� -->
    <!-- ʱ�������� levelΪ DEBUG ��־ -->
    <!-- 
        <file>${logger.path}/log_debug.log</file>
        &lt;!&ndash;��־�ļ������ʽ&ndash;&gt;
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>
            <charset>UTF-8</charset> &lt;!&ndash; �����ַ��� &ndash;&gt;
        </encoder>
        &lt;!&ndash; ��־��¼���Ĺ������ԣ������ڣ�����С��¼ &ndash;&gt;
        <rollingPolicy >
            &lt;!&ndash; ��־�鵵 &ndash;&gt;
            <fileNamePattern>${logger.path}/debug/log-debug-%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <timeBasedFileNamingAndTriggeringPolicy >
                <maxFileSize>100MB</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
            &lt;!&ndash;��־�ļ���������&ndash;&gt;
            <maxHistory>15</maxHistory>
        </rollingPolicy>
        &lt;!&ndash; ����־�ļ�ֻ��¼debug����� &ndash;&gt;
        <filter >
            <level>debug</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
     -->

    <!-- ʱ�������� levelΪ INFO ��־ -->
    
        <!-- ���ڼ�¼����־�ļ���·�����ļ��� -->
        <file>${logger.path}/log_info.log</file>
        <!--��־�ļ������ʽ-->
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>
            <charset>UTF-8</charset>
        </encoder>
        <!-- ��־��¼���Ĺ������ԣ������ڣ�����С��¼ -->
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!-- ÿ����־�鵵·���Լ���ʽ -->
            <fileNamePattern>${logger.path}/info/log-info-%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <maxFileSize>100MB</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
            <!--��־�ļ���������-->
            <maxHistory>15</maxHistory>
        </rollingPolicy>
        <!-- ����־�ļ�ֻ��¼info����� -->
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>info</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
    

    <!-- ʱ�������� levelΪ WARN ��־ -->
    <!-- 
        &lt;!&ndash; ���ڼ�¼����־�ļ���·�����ļ��� &ndash;&gt;
        <file>${logger.path}/log_warn.log</file>
        &lt;!&ndash;��־�ļ������ʽ&ndash;&gt;
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>
            <charset>UTF-8</charset> &lt;!&ndash; �˴������ַ��� &ndash;&gt;
        </encoder>
        &lt;!&ndash; ��־��¼���Ĺ������ԣ������ڣ�����С��¼ &ndash;&gt;
        <rollingPolicy >
            <fileNamePattern>${logger.path}/warn/log-warn-%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <timeBasedFileNamingAndTriggeringPolicy >
                <maxFileSize>100MB</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
            &lt;!&ndash;��־�ļ���������&ndash;&gt;
            <maxHistory>15</maxHistory>
        </rollingPolicy>
        &lt;!&ndash; ����־�ļ�ֻ��¼warn����� &ndash;&gt;
        <filter >
            <level>warn</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
     -->

    <!-- ʱ�������� levelΪ ERROR ��־ -->
    
        <!-- ���ڼ�¼����־�ļ���·�����ļ��� -->
        <file>${logger.path}/log_error.log</file>
        <!--��־�ļ������ʽ-->
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>
            <charset>UTF-8</charset> <!-- �˴������ַ��� -->
        </encoder>
        <!-- ��־��¼���Ĺ������ԣ������ڣ�����С��¼ -->
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>${logger.path}/error/log-error-%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <maxFileSize>100MB</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
            <!--��־�ļ���������-->
            <maxHistory>15</maxHistory>
        </rollingPolicy>
        <!-- ����־�ļ�ֻ��¼ERROR����� -->
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>ERROR</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
    

    <!--
        root�ڵ��Ǳ�ѡ�ڵ㣬����ָ�����������־�������ֻ��һ��level����
        level:�������ô�ӡ���𣬴�Сд�޹أ�TRACE, DEBUG, INFO, WARN, ERROR, ALL �� OFF��
        ��������ΪINHERITED����ͬ���NULL��Ĭ����DEBUG
        ���԰����������Ԫ�أ���ʶ���appender������ӵ����logger��
    -->
    <root level="info">
        
        
        <!---->
        
        <!---->
        
    </root>

</configuration>
���ƴ���
```

**ע��**������������־�������ã���Ҫ���ⲿ�� `` �����á�

1.  **���� skywalking �������� SkyWalking APM����Ҫ��Ҫ�õ� agent**��

skywalking �������ص�ַ��[skywalking.apache.org/downloads/](https://link.juejin.cn?target=http%3A%2F%2Fskywalking.apache.org%2Fdownloads%2F "http://skywalking.apache.org/downloads/")

![image-20230423174506711](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230423174506711.png)

1.  **��ѹ���ص� apache-skywalking-apm-es7-8.0.1.tar.gz ����Ŀ¼�ṹ��ͼ**��

![image-20230423174522153](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230423174522153.png)

����ֻҪ���е� agent Ŀ¼���У�agent ��Ķ����������Щ��

![image-20230423174533023](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230423174533023.png)

�� agent Ŀ¼���Ƶ�һ�����Ƶ�Ŀ¼�£�һ�����Ҫ���� JVM ��������Ŀ¼����Ȼ����ֱ�ӷŵ�����Ŀ�

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8deaee160419423e9a71e710d3b2c3dd~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

1.  **�� idea �������������������� JVM ��������**��

```
-javaagent:(agent�ļ������ڵ�Ŀ¼)\agent\skywalking-agent.jar -Dskywalking.agent.service_name=(������)-service -Dskywalking.agent.instance_name=(������)-instance -Dskywalking.collector.backend_service=(��װSkyWalking������IP):9022
���ƴ���
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96e9d5a3aa5c44c3b0b948929609ae1f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

��Ϊ skywalking �Ƿ�����ʽ���ʵ�ֲַ�ʽ��·���ٺ����ܼ�أ�����һ����� javaagent �ķ�ʽ��

> **Javaagent ��ʲô**��JVM ����ǰ��̬ Instrument����
>
> Javaagent �� java �����һ������������ javaagent ��������ָ��һ�� jar �������ҶԸ� java ��������Ҫ��
>
> 1.  ��� jar ���� MANIFEST.MF �ļ�����ָ�� Premain-Class �
> 2.  Premain-Class ָ�����Ǹ������ʵ�� premain() ������
>
> premain() ����������������⣬���������� main() ����֮ǰ�ĵ��ࡣ�� Java ���������ʱ����ִ�� main() ����֮ǰ��jvm �������� -javaagent ��ָ�� jar ���� Premain-Class ������ premain() ���� ��

1.  **����ǰ��ƪ�����д����������Ŀ������Щ��Ŀ��ȫ�������ϱߵ�����һ�飬��������Ч��**��

*   ���ط���herring-gateway��zuul ͳһ����΢����
*   ��֤����herring-oauth2��oauth2 ��֤����΢����
*   ��Ա����herring-member-service��΢����֮һ�����յ������ᵽ��֤������֤��
*   ��������herring-orders-service��΢����֮�������յ������ᵽ��֤������֤��
*   ��Ʒ����herring-product-service��΢����֮�������յ������ᵽ��֤������֤��

![image-20230423174600279](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230423174600279.png)

1.  **����������һ�£��������� token��Ȼ�������� /api/member/update**��

```
#### 

POST http://localhost:8080/oauth2-service/oauth/token?grant_type=password&username=admin&password=123456&client_id=app-client&client_secret=client-secret-8888&scope=all
Accept: */*
Cache-Control: no-cache
���ƴ���
```

�õ����ؽ�� token��

```
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiZ2F0ZXdheS1zZXJ2aWNlIl0sInVzZXJfbmFtZSI6ImFkbWluIiwiand0LWV4dCI6IkpXVCDmianlsZXkv6Hmga8iLCJzY29wZSI6WyJhbGwiXSwiZXhwIjoxNjEzOTcwMDk2LCJhdXRob3JpdGllcyI6WyJST0xFX0FETUlOIl0sImp0aSI6IjU4MDY5ODlhLWUyNDQtNGQyMy04YTU5LTBjODRiYzE0Yjk5OSIsImNsaWVudF9pZCI6ImFwcC1jbGllbnQifQ.EP4acam0tkJQ9kSGRGk_mQsfi1y4M_hhiBL0H931v60",
  "token_type": "bearer",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiZ2F0ZXdheS1zZXJ2aWNlIl0sInVzZXJfbmFtZSI6ImFkbWluIiwiand0LWV4dCI6IkpXVCDmianlsZXkv6Hmga8iLCJzY29wZSI6WyJhbGwiXSwiYXRpIjoiNTgwNjk4OWEtZTI0NC00ZDIzLThhNTktMGM4NGJjMTRiOTk5IiwiZXhwIjoxNjE0MDM0ODk2LCJhdXRob3JpdGllcyI6WyJST0xFX0FETUlOIl0sImp0aSI6IjQxZGM1ZDc1LTZmZDgtNDU3My04YmRjLWI4ZTMwNWEzMThmMyIsImNsaWVudF9pZCI6ImFwcC1jbGllbnQifQ.CGmGx_msqJBHxa95bBROY2SAO14RyeRklVPYrRxZ7pQ",
  "expires_in": 7199,
  "scope": "all",
  "jwt-ext": "JWT ��չ��Ϣ",
  "jti": "5806989a-e244-4d23-8a59-0c84bc14b999"
}
���ƴ���
```

����ִ�� /api/member/update

```
####

GET http://localhost:8080/member-service/api/member/update
Accept: */*
Cache-Control: no-cache
Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiZ2F0ZXdheS1zZXJ2aWNlIl0sInVzZXJfbmFtZSI6ImFkbWluIiwiand0LWV4dCI6IkpXVCDmianlsZXkv6Hmga8iLCJzY29wZSI6WyJhbGwiXSwiZXhwIjoxNjEzOTcwMDk2LCJhdXRob3JpdGllcyI6WyJST0xFX0FETUlOIl0sImp0aSI6IjU4MDY5ODlhLWUyNDQtNGQyMy04YTU5LTBjODRiYzE0Yjk5OSIsImNsaWVudF9pZCI6ImFwcC1jbGllbnQifQ.EP4acam0tkJQ9kSGRGk_mQsfi1y4M_hhiBL0H931v60
���ƴ���
```

**�Ǳ��̽��չʾ**:

![image-20230423174639471](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230423174639471.png)

![image-20230423174721822](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230423174721822.png)

![image-20230423174742703](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230423174742703.png)

**����ͼ���չʾ**��

![image-20230423174809108](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230423174809108.png)

![image-20230423174831290](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230423174831290.png)

**��·׷�ٽ��չʾ**��

![image-20230423174845526](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/image-20230423174845526.png)



���ߣ��ײ�˵����
���ӣ�https://juejin.cn/post/6931922457741770760
��Դ��ϡ�����
����Ȩ���������С���ҵת������ϵ���߻����Ȩ������ҵת����ע��������

# �ο�����
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud