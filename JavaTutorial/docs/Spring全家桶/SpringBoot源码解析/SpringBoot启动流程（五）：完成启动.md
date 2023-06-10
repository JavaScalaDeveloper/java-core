��һƪ�����ܽ� springboot �����������£�

![img](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-07a6b491fbe69b8dcbd41e59a8543f06671.png)

�����ģ����Ǽ��������������Ĳ��衣

### 3.11 ˢ�º�Ĵ���

ˢ�º�Ĵ�����Ϊ `SpringApplication#afterRefresh`���������£�

```
protected void afterRefresh(ConfigurableApplicationContext context, ApplicationArguments args) {
}
```

���Կ���������һ���շ�����springboot �ṩ����չ��

### 3.12 ���� `started` �¼�

�ò����ķ���Ϊ `listeners.started(context)`�������߼�ǰ���Ѿ�������������Ͳ��ٷ����ˡ�

### 3.13 �������ص�

�����������ķ����� `SpringApplication#callRunners`���������£�

```
private void callRunners(ApplicationContext context, ApplicationArguments args) {
    List<Object> runners = new ArrayList<>();
    // ��ȡ���е� ApplicationRunner �� CommandLineRunner
    runners.addAll(context.getBeansOfType(ApplicationRunner.class).values());
    runners.addAll(context.getBeansOfType(CommandLineRunner.class).values());
    // ����
    AnnotationAwareOrderComparator.sort(runners);
    // ��������
    for (Object runner : new LinkedHashSet<>(runners)) {
        // ���� ApplicationRunner#run ����
        if (runner instanceof ApplicationRunner) {
            callRunner((ApplicationRunner) runner, args);
        }
        // ���� CommandLineRunner#run ����
        if (runner instanceof CommandLineRunner) {
            callRunner((CommandLineRunner) runner, args);
        }
    }
}

/**
 * ���� ApplicationRunner#run ����
 */
private void callRunner(ApplicationRunner runner, ApplicationArguments args) {
    try {
        (runner).run(args);
    }
    catch (Exception ex) {
        throw new IllegalStateException("Failed to execute ApplicationRunner", ex);
    }
}

/**
 * ���� CommandLineRunner#run ����
 */
private void callRunner(CommandLineRunner runner, ApplicationArguments args) {
    try {
        (runner).run(args.getSourceArgs());
    }
    catch (Exception ex) {
        throw new IllegalStateException("Failed to execute CommandLineRunner", ex);
    }
}
```

������������ʾ��springboot Ϊ�����ṩ�������ӿڣ�`ApplicationRunner` �� `CommandLineRunner`�����ǿ���ʵ���������һЩ������Ӧ��ʾ�����£�

```
/**
 * ApplicationRunner ʾ��
 */
@Component
public class MyApplicationRunner implements ApplicationRunner {
    @Override
    public void run(ApplicationArguments args) throws Exception {
        System.out.println("MyApplicationRunner: hello world");
    }
}

/**
 * CommandLineRunner ʾ��
 */
@Component
public class MyCommandLineRunner implements CommandLineRunner {
    @Override
    public void run(String... args) throws Exception {
        System.out.println("MyCommandLineRunner: hello world!");
    }
}
```

### 3.14 ���м����������� `listeners.running(...)`

�������������ͬǰ������� `listeners.starting()` ��·һ��������Ͳ������ˡ�

���ˣ����ĵķ����͵������ˣ����� springboot ���������̵ķ���Ҳ�������ˡ�

![img](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-9b539b547c6004c40d2b6f8bd59481b8e34.png)

------

*����ԭ�����ӣ�https://my.oschina.net/funcy/blog/4906553 ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������*