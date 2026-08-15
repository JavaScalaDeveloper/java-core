---
title: Spring Boot 整合Quartz实现编程喵定时发布文章
shortTitle: 整合Quartz
category:
  - Java企业级开发
tag:
  - Spring Boot
---

### 前言

编程喵🐱实战项目中需要做一个定时发布文章的功能，于是我就很自然地想到了 Quartz，这是一个老而弥坚的开源任务调度框架。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/quartz-39e31fbf-5546-4627-9d49-651beeb961c1.png)


记得我在 14 年开发大宗期货交易平台的时候就用到了它，每天凌晨定时需要统计一波交易数据，生成日报报表，「配合 Cron 表达式」（上一节有讲）用起来非常自洽。

可惜后来平台稳定了，新的政策出来了，直接把大宗期货交易灭了。于是我发财的机会也随着破灭了。想想都觉得可惜，哈哈哈。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/quartz-573fa3b6-551b-418d-9616-3066bb4f75d2.png)

时光荏苒，Quartz 发展到现在，已经可以和 Spring Boot 项目无缝衔接了，用起来也比之前在 Spring 项目中更丝滑。

### 关于 Quartz

Quartz 是一款功能强大的开源的任务调度框架，在 GitHub 上已经累计有 5k+ 的 star 了。小到单机应用，大到分布式，都可以整合 Quartz。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/quartz-ea2d0b63-4b99-4654-a03d-45023a741e88.png)

在使用 Quartz 之前，让我们先来搞清楚 4 个核心概念：

- Job：任务，要执行的具体内容。
- JobDetail：任务详情，Job 是它要执行的内容，同时包含了这个任务调度的策略和方案。
- Trigger：触发器，可以通过 Cron 表达式来指定任务执行的时间。
- Scheduler：调度器，可以注册多个 JobDetail 和 Trigger，用来调度、暂停和删除任务。

### 整合 Quartz

Quartz 存储任务的方式有两种，一种是使用内存，另外一种是使用数据库。内存在程序重启后就丢失了，所以我们这次使用数据库的方式来进行任务的持久化。

第一步，在 pom.xml 文件中添加 Quartz 的 starter。

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-quartz</artifactId>
    <version>2.6.7</version>
</dependency>
```

第二步，在 application.yml 添加 Quartz 相关配置，配置说明直接看注释。

```
spring:
  quartz:
    job-store-type: jdbc # 默认为内存 memory 的方式，这里我们使用数据库的形式
    wait-for-jobs-to-complete-on-shutdown: true # 关闭时等待任务完成
    overwrite-existing-jobs: true # 可以覆盖已有的任务
    jdbc:
      initialize-schema: never # 是否自动使用 SQL 初始化 Quartz 表结构
    properties: # quartz原生配置
      org:
        quartz:
          scheduler:
            instanceName: scheduler # 调度器实例名称
            instanceId: AUTO # 调度器实例ID自动生成
          # JobStore 相关配置
          jobStore:
            class: org.quartz.impl.jdbcjobstore.JobStoreTX # JobStore 实现类
            driverDelegateClass: org.quartz.impl.jdbcjobstore.StdJDBCDelegate # 使用完全兼容JDBC的驱动
            tablePrefix: QRTZ_ # Quartz 表前缀
            useProperties: false # 是否将JobDataMap中的属性转为字符串存储
          # 线程池相关配置
          threadPool:
            threadCount: 25 # 线程池大小。默认为 10 。
            threadPriority: 5 # 线程优先级
            class: org.quartz.simpl.SimpleThreadPool # 指定线程池实现类，对调度器提供固定大小的线程池
```

Quartz 默认使用的是内存的方式来存储任务，为了持久化，我们这里改为 JDBC 的形式，并且指定 `spring.quartz.jdbc.initialize-schema=never`，这样我们可以手动创建数据表。因为该值的另外两个选项ALWAYS和EMBEDDED都不太符合我们的要求：

- ALWAYS：每次都初始化
- EMBEDDED：只初始化嵌入式数据库，比如说 H2、HSQL

那手动创建数据表的 SQL 语句去哪里找呢？

>GitHub 地址：[https://github.com/quartz-scheduler/Spring Boot 整合Quartz实现编程喵定时发布文章/tree/master/quartz-core/src/main/resources/org/Spring Boot 整合Quartz实现编程喵定时发布文章/impl/jdbcjobstore](https://github.com/quartz-scheduler/Spring Boot 整合Quartz实现编程喵定时发布文章/tree/master/quartz-core/src/main/resources/org/Spring Boot 整合Quartz实现编程喵定时发布文章/impl/jdbcjobstore)

为了方便小伙伴们下载，我把它放在了本教程的源码里面了：


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/quartz-407d9133-7487-444e-83dd-d11524bfd748.png)


如果使用 Intellij IDEA 旗舰版的话，首次打开 SQL 文件的时候会提示你指定数据源。在上图中，我配置了本地的 MySQL 数据库，导入成功后可以在数据库中查看到以下数据表：


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/quartz-277dc414-4d2d-4a68-91d5-10332998c8bf.png)

Quartz数据库核心表如下：

Table Name |	Description
--- | ---
QRTZ_CALENDARS |	存储Quartz的Calendar信息
QRTZ_CRON_TRIGGERS |	存储CronTrigger，包括Cron表达式和时区信息
QRTZ_FIRED_TRIGGERS |	存储与已触发的Trigger相关的状态信息，以及相联Job的执行信息
QRTZ_PAUSED_TRIGGER_GRPS |	存储已暂停的Trigger组的信息
QRTZ_SCHEDULER_STATE |	存储少量的有关Scheduler的状态信息，和别的Scheduler实例
QRTZ_LOCKS |	存储程序的悲观锁的信息
QRTZ_JOB_DETAILS |	存储每一个已配置的Job的详细信息
QRTZ_JOB_LISTENERS |	存储有关已配置的JobListener的信息
QRTZ_SIMPLE_TRIGGERS |	存储简单的Trigger，包括重复次数、间隔、以及已触的次数
QRTZ_BLOG_TRIGGERS |	Trigger作为Blob类型存储
QRTZ_TRIGGER_LISTENERS |	存储已配置的TriggerListener的信息
QRTZ_TRIGGERS |	存储已配置的Trigger的信息

剩下的就是对 Quartz 的 scheduler、jobStore 和 threadPool 配置。

第三步，创建任务调度的接口 IScheduleService，定义三个方法，分别是通过 Cron 表达式来调度任务、指定时间来调度任务，以及取消任务。

```java
public interface IScheduleService {
    /**
     * 通过 Cron 表达式来调度任务
     */
    String scheduleJob(Class<? extends Job> jobBeanClass, String cron, String data);

    /**
     * 指定时间来调度任务
     */
    String scheduleFixTimeJob(Class<? extends Job> jobBeanClass, Date startTime, String data);

    /**
     * 取消定时任务
     */
    Boolean cancelScheduleJob(String jobName);
}
```

第四步，创建任务调度业务实现类 ScheduleServiceImpl，通过Scheduler、CronTrigger、JobDetail的API来实现对应的方法。

```java
@Slf4j
@Service
public class ScheduleServiceImpl implements IScheduleService {
    private String defaultGroup = "default_group";

    @Autowired
    private Scheduler scheduler;
    @Override
    public String scheduleJob(Class<? extends Job> jobBeanClass, String cron, String data) {
        String jobName = UUID.fastUUID().toString();
        JobDetail jobDetail = JobBuilder.newJob(jobBeanClass)
                .withIdentity(jobName, defaultGroup)
                .usingJobData("data", data)
                .build();
        //创建触发器，指定任务执行时间
        CronTrigger cronTrigger = TriggerBuilder.newTrigger()
                .withIdentity(jobName, defaultGroup)
                .withSchedule(CronScheduleBuilder.cronSchedule(cron))
                .build();
        // 调度器进行任务调度
        try {
            scheduler.scheduleJob(jobDetail, cronTrigger);
        } catch (SchedulerException e) {
            log.error("任务调度执行失败{}", e.getMessage());
        }
        return jobName;
    }

    @Override
    public String scheduleFixTimeJob(Class<? extends Job> jobBeanClass, Date startTime, String data) {
        //日期转CRON表达式
        String startCron = String.format("%d %d %d %d %d ? %d",
                DateUtil.second(startTime),
                DateUtil.minute(startTime),
                DateUtil.hour(startTime, true),
                DateUtil.dayOfMonth(startTime),
                DateUtil.month(startTime) + 1,
                DateUtil.year(startTime));
        return scheduleJob(jobBeanClass, startCron, data);
    }

    @Override
    public Boolean cancelScheduleJob(String jobName) {
        boolean success = false;
        try {
            // 暂停触发器
            scheduler.pauseTrigger(new TriggerKey(jobName, defaultGroup));
            // 移除触发器中的任务
            scheduler.unscheduleJob(new TriggerKey(jobName, defaultGroup));
            // 删除任务
            scheduler.deleteJob(new JobKey(jobName, defaultGroup));
            success = true;
        } catch (SchedulerException e) {
            log.error("任务取消失败{}", e.getMessage());
        }
        return success;
    }
}
```

第五步，定义好要执行的任务，继承 QuartzJobBean 类，实现 
executeInternal 方法，这里只定义一个定时发布文章的任务。

```java
@Slf4j
@Component
public class PublishPostJob extends QuartzJobBean {
    @Autowired
    private IScheduleService scheduleService;
    @Autowired
    private IPostsService postsService;

    @Override
    protected void executeInternal(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        Trigger trigger = jobExecutionContext.getTrigger();
        JobDetail jobDetail = jobExecutionContext.getJobDetail();
        JobDataMap jobDataMap = jobDetail.getJobDataMap();
        Long data = jobDataMap.getLong("data");
        log.debug("定时发布文章操作：{}",data);

        // 获取文章的 ID后获取文章，更新文章为发布的状态，还有发布的时间
        boolean success = postsService.updatePostByScheduler(data);

        //完成后删除触发器和任务
        if (success) {
            log.debug("定时任务执行成功，开始清除定时任务");
            scheduleService.cancelScheduleJob(trigger.getKey().getName());
        }
    }
}
```

第六步，发布文章的接口里 PostsServiceImpl 添加定时发布的任务调度方法。

```java
@Service
public class PostsServiceImpl extends ServiceImpl<PostsMapper, Posts> implements IPostsService {

    private void handleScheduledAfter(Posts posts) {
        // 文章已经保存为草稿了，并且拿到了文章 ID
        // 调用定时任务
        String jobName = scheduleService.scheduleFixTimeJob(PublishPostJob.class, posts.getPostDate(), posts.getPostsId().toString());
        LOGGER.debug("定时任务{}开始执行", jobName);
    }

}
```

好，我们现在启动服务，通过Swagger 来测试一下，注意设置文章的定时发布时间。



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/quartz-12f8b138-33db-4faa-b31f-1d1b3fa5afe9.png)

查看 Quartz 的数据表 qrtz_cron_triggers，发现任务已经添加进来了。



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/quartz-0acacdc6-3cf3-4042-a784-388bb10f0368.png)

qrtz_job_details 表里也可以查看具体的任务详情。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/quartz-ef1bd1b0-0f13-4dde-a84b-a1ae20b78430.png)

文章定时发布的时间到了之后，在日志里也可以看到 Quartz 的执行日志。



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/quartz-45abe530-05fe-498b-b32a-0d2bc5bd6996.png)

再次查看 Quartz 数据表 qrtz_cron_triggers 和 qrtz_job_details 的时候，也会发现定时任务已经清除了。

整体上来说，Spring Boot 整合 Quartz还是非常丝滑的，配置少，步骤清晰，比 Spring Task 更强大，既能针对内存也能持久化，所以大家在遇到定时任务的时候完全可以尝试一把。

完整的功能在编程喵实战项目中已经实现了，可以把编程喵导入到本地尝试一下。

### 业务梳理

简单来梳理一下编程喵定时发布文章的业务。

1）用户在发布文章的时候可以选择定时发布，如果选择定时发布，那么就要设置定时发布的时间，暂时规定至少十分钟以后可以定时。

2）当管理端用户选择了定时发布，那么在保存文章的时候，文章状态要先设置为草稿状态，对前端用户是不可见的状态。

----

更多内容，只针对《Java程序员进阶之路》星球用户开放，需要的小伙伴可以[戳链接🔗](https://tobebetterjavaer.com/zhishixingqiu/)加入我们的星球，一起学习，一起卷。。**编程喵**🐱是一个 Spring Boot+Vue 的前后端分离项目，融合了市面上绝大多数流行的技术要点。通过学习实战项目，你可以将所学的知识通过实践进行检验、你可以拓宽自己的技术边界，你可以掌握一个真正的实战项目是如何从 0 到 1 的。


### 源码路径

> - 编程喵：[https://github.com/itwanger/coding-more](https://github.com/itwanger/coding-more)
> - codingmore-quartz：[https://github.com/itwanger/codingmore-learning](https://github.com/itwanger/codingmore-learning/tree/main/codingmore-quartz)

---


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongzhonghao.png)