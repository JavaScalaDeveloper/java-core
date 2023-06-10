

<header>

# Spring Boot����

�������ݽ���վ�������Ѹ���ѧϰ�ʼǡ��ܽ���о��ղء�����֤��ȷ�ԣ���ʹ�ö������ķ����뱾վ�޹أ�

</header>



<script>( adsbygoogle = window.adsbygoogle || []).push({});</script>



������ִ���ض�ʱ��ε�����Ĺ��̡�Spring BootΪ��SpringӦ�ó����ϱ�д���ȳ����ṩ�˺ܺõ�֧�֡�

## Java Cron���ʽ

Java Cron���ʽ��������CronTrigger��ʵ��������`org.quartz.Trigger`�����ࡣ �й�Java cron���ʽ�ĸ�����Ϣ������Ĵ����� -

*   [https://docs.oracle.com/cd/E12058_01/doc/doc.1014/e12030/cron_expressions.html](https://docs.oracle.com/cd/E12058_01/doc/doc.1014/e12030/cron_expressions.html)

`[@EnableScheduling](https://github.com/EnableScheduling "@EnableScheduling")`ע������ΪӦ�ó������õ��ȳ��򡣽�����ע��ӵ���Spring BootӦ�ó������ļ��С�

```
@SpringBootApplication
@EnableScheduling

public class DemoApplication {
   public static void main(String[] args) {
      SpringApplication.run(DemoApplication.class, args);
   }
}

```

`[@Scheduled](https://github.com/Scheduled "@Scheduled")`ע���������ض�ʱ����ڴ������ȳ���

```
@Scheduled(cron = "0 * 9 * * ?")
public void cronJobSch() throws Exception {
}

```

������һ��ʾ�����룬��ʾ�����ÿ������9:00��ʼ��ÿ������9:59����ִ������

```
package com.yiibai.demo.scheduler;

import java.text.SimpleDateFormat;
import java.util.Date;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class Scheduler {
   @Scheduled(cron = "0 * 9 * * ?")
   public void cronJobSch() {
      SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
      Date now = new Date();
      String strDate = sdf.format(now);
      System.out.println("Java cron job expression:: " + strDate);
   }
}

```

������Ļ��ͼ��ʾ��Ӧ�ó��������`09:03:23`���������Ҵ���ʱ��ÿ��һ����ִ��һ��cron��ҵ���ȳ�������

![](/uploads/images/2018/10/05/103218_77311.jpg)

## �̶�����

�̶����ʵ��ȳ����������ض�ʱ��ִ�����������ȴ�ǰһ���������ɡ� ֵ���Ժ���Ϊ��λ�� ʾ��������ʾ�ڴ˴� -

```
@Scheduled(fixedRate = 1000)
public void fixedRateSch() { 
}

```

�˴���ʾ��Ӧ�ó�������ʱÿ��ִ�������ʾ������ -

```
package com.yiibai.demo.scheduler;

import java.text.SimpleDateFormat;
import java.util.Date;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class Scheduler {
   @Scheduled(fixedRate = 1000)
   public void fixedRateSch() {
      SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

      Date now = new Date();
      String strDate = sdf.format(now);
      System.out.println("Fixed Rate scheduler:: " + strDate);
   }
}

```

��ע��������Ļ��ͼ��������ʾ����`09:12:00`������Ӧ�ó���֮��ÿ��һ���̶����ʵ��ȳ���ִ������

![](/uploads/images/2018/10/05/103355_72877.jpg)

## �̶��ӳ�

�̶��ӳٵ��ȳ����������ض�ʱ��ִ������ ��Ӧ�õȴ���һ��������ɡ� ֵӦ�Ժ���Ϊ��λ�� �˴���ʾʾ������ -

```
@Scheduled(fixedDelay = 1000, initialDelay = 1000)
public void fixedDelaySch() {
}

```

���`initialDelay`���ڳ�ʼ�ӳ�ֵ֮���һ��ִ�������ʱ�䡣

��Ӧ�ó����������`3`���ÿ��ִ��һ�������ʾ��������ʾ -

```
package com.yiibai.demo.scheduler;

import java.text.SimpleDateFormat;
import java.util.Date;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class Scheduler {
   @Scheduled(fixedDelay = 1000, initialDelay = 3000)
   public void fixedDelaySch() {
      SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
      Date now = new Date();
      String strDate = sdf.format(now);
      System.out.println("Fixed Delay scheduler:: " + strDate);
   }
}

```

ִ����������������ʾ��`09:18:39`��ʼ��Ӧ�ó���ÿ`3`��󣬹̶��ӳټƻ���������(ÿ��ִ��һ��)��





//�������Ķ���https://www.yiibai.com/spring-boot/spring_boot_scheduling.html

@EnableAsync ע��
Ҫʹ�� @Async��������Ҫʹ�� @EnableAsync ע�⿪�� Spring Boot �е��첽���ԡ�

@Configuration
@EnableAsync
public class AppConfig {
}
����ϸ������˵�������Բο���AsyncConfigurer(opens new window)

#@Async ע��
#֧�ֵ��÷�
��1��������޷���ֵ����

�������� @Async ע�����η��������������������첽��ʽ���á����仰˵�������ڵ��ô˷���ʱ���������أ���������ʵ��ִ�з��������ύ�� Spring TaskExecutor �������С�����򵥵�����£������Խ�ע��Ӧ���ڷ��� void �ķ�����������ʾ����ʾ��

@Async
void doSomething() {
// this will be executed asynchronously
}
��2��������޷���ֵ����

��ʹ�� @Scheduled ע��ע�͵ķ�����ͬ����Щ��������ָ����������Ϊ����������ʱ�ɵ������ԡ���������ʽ���ã�����������������ĵ���������á����磬���´����� @Async ע��ĺϷ�Ӧ�ã�

@Async
void doSomething(String s) {
// this will be executed asynchronously
}
��3��������з���ֵ����

���������첽���÷���ֵ�ķ��������ǣ���Щ������Ҫ���� Future ���͵ķ���ֵ������Ȼ�ṩ���첽ִ�еĺô����Ա�����߿����ڵ��� Future �ϵ� get() ֮ǰִ��������������ʾ����ʾ����ڷ���ֵ�ķ�����ʹ��@Async��

@Async
Future<String> returnSomething(int i) {
// this will be executed asynchronously
}
#��֧�ֵ��÷�
@Async �������������ڻص�һ��ʹ�ã����� @PostConstruct��

Ҫ�첽��ʼ�� Spring bean������ʹ�õ����ĳ�ʼ�� Spring bean��Ȼ����Ŀ���ϵ��� @Async ��ע�͵ķ�����������ʾ����ʾ��

public class SampleBeanImpl implements SampleBean {

    @Async
    void doSomething() {
        // ...
    }

}

public class SampleBeanInitializer {

    private final SampleBean bean;

    public SampleBeanInitializer(SampleBean bean) {
        this.bean = bean;
    }

    @PostConstruct
    public void initialize() {
        bean.doSomething();
    }

}
#��ȷָ��ִ����
Ĭ������£��ڷ�����ָ�� @Async ʱ��ʹ�õ�ִ�������������첽֧��ʱ���õ�ִ�����������ʹ�� XML �� AsyncConfigurer ʵ�֣�����У�����Ϊ annotation-driven Ԫ�ء����ǣ������Ҫָʾ��ִ�и�������ʱӦʹ��Ĭ��ֵ�����ִ�����������ʹ�� @Async ע��� value ���ԡ�����ʾ����ʾ�����ִ�д˲�����

@Async("otherExecutor")
void doSomething(String s) {
// this will be executed asynchronously by "otherExecutor"
}
����������£���otherExecutor�������� Spring �������κ� Executor bean �����ƣ�Ҳ���������κ� Executor �������޶��������ƣ����磬ʹ�� <qualifier> Ԫ�ػ� Spring �� @Qualifier ע��ָ���� ����

#���� @Async ���쳣
�� @Async �����ķ���ֵ����Ϊ Future ��ʱ�������׹����ڷ���ִ���ڼ��׳����쳣����Ϊ�ڵ��� get ���ʱ���׳����쳣�����ǣ����ڷ���ֵ����Ϊ void �͵ķ������쳣���ᱻ�������޷����䡣�������ṩ AsyncUncaughtExceptionHandler ����������쳣������ʾ����ʾ�����ִ�д˲�����

public class MyAsyncUncaughtExceptionHandler implements AsyncUncaughtExceptionHandler {

    @Override
    public void handleUncaughtException(Throwable ex, Method method, Object... params) {
        // handle exception
    }
}
Ĭ������£�����¼�쳣��������ʹ�� AsyncConfigurer �� <task��annotation-driven /> XML Ԫ�ض����Զ��� AsyncUncaughtExceptionHandler��