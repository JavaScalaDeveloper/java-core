### 1\. demo ׼��

����ʽ�����¼�����ǰ����������׼��һ�� demo��

1.  ׼��һ���¼��� `MyApplicationEvent`��

```
public class MyApplicationEvent extends ApplicationEvent {

    private static final long serialVersionUID = -1L;

    public MyApplicationEvent(Object source) {
        super(source);
    }
}

```

1.  ׼��һ�������� `MyApplicationEventListener`�����¼� `MyApplicationEvent` ���м�����

```
@Component
public class MyApplicationEventListener 
        implements ApplicationListener<MyApplicationEvent> {

    @Override
    public void onApplicationEvent(MyApplicationEvent event) {
        System.out.println(Thread.currentThread().getName() + " | " + event.getSource());
    }
}

```

׼��һ�������࣬�Ȳ�ָ�����ݣ�

```
@Configuration
@ComponentScan
public class Demo08Config {

}

```

��������ࣺ

```
@ComponentScan
public class Demo08Main {

    public static void main(String[] args) {
        AnnotationConfigApplicationContext context 
            = new AnnotationConfigApplicationContext(Demo08Config.class);
        // �����¼�
        context.publishEvent(
            new MyApplicationEvent(Thread.currentThread().getName() + " | �Զ����¼� ..."));
    }

}

```

���ϴ��붨����һ���¼� `MyApplicationEvent`��Ȼ������һ�������� `MyApplicationEventListener`���������� `MyApplicationEvent` �¼���Ȼ���� `main()` �����У����� `context.publishEvent(...)` �������������¼���

���У�������£�

```
main | main | �Զ����¼� ...

```

���Կ������¼��ɹ��������ˡ�

�����п�֪���¼��ķ����߳�Ϊ `main`���¼��ļ��������߳�Ҳ�� `main`��

### 2\. �¼��������

��ʽ����ǰ�����������������¼���ص�������¼���ص������ 4 ����

1.  �¼�������������
2.  �����������������¼������
3.  �㲥�������շ������������¼����������յ����¼��㲥��������
4.  �������������¼�

��������һһ��������

#### 2.1 �¼�

spring �ṩ���¼�Ϊ `ApplicationEvent`������һ�������࣬�̳��� jdk �ṩ�� `EventObject` �࣬�����Զ����¼�ʱ���ɼ̳� `ApplicationEvent`��

```
public abstract class ApplicationEvent extends EventObject {

    private static final long serialVersionUID = 7099057708183571937L;

    /** ���� timestamp ����*/
    private final long timestamp;

    public ApplicationEvent(Object source) {
        super(source);
        this.timestamp = System.currentTimeMillis();
    }

    public final long getTimestamp() {
        return this.timestamp;
    }
}

```

`ApplicationEvent` �� `EventObject`�����Ǽ�����

```
/**
 * EventObject ��jdk�ṩ��λ�� java.util ����
 */
public class EventObject implements java.io.Serializable {

    private static final long serialVersionUID = 5516075349620653480L;

    // �¼�����
    protected transient Object  source;

    public EventObject(Object source) {
        if (source == null)
            throw new IllegalArgumentException("null source");

        this.source = source;
    }

    /**
     * ��ȡ�¼�����
     */
    public Object getSource() {
        return source;
    }

    public String toString() {
        return getClass().getName() + "[source=" + source + "]";
    }
}

```

��� `ApplicationEvent` �� `EventObject` ������`ApplicationEvent` �ṩ���������ԣ�

*   `source`������ `EventObject` �����ԣ��������¼������ݣ�
*   `timestamp`: ʱ�����������¼���¼�������ʱ�䡣

ʵ���ϣ�spring �����ܷ��� `ApplicationEvent` ���͵��¼��⣬�����Է��� `Object` ���͵��¼���������鿴�������Ϳ��Է� ����һ�㡣

#### 2.2 ������

spring �ṩ�ķ�����Ϊ `ApplicationEventPublisher`���������£�

```
public interface ApplicationEventPublisher {

    /**
     * ����ApplicationEvent���͵��¼�
     */
    default void publishEvent(ApplicationEvent event) {
        publishEvent((Object) event);
    }

    /**
     * ����Object���͵��¼�
     */
    void publishEvent(Object event);

}

```

���Ǹ��ӿڣ����ڶ���������������

*   `void publishEvent(ApplicationEvent event)`: �������� `ApplicationEvent` ���͵��¼�
*   `void publishEvent(Object event)`: �������� `Object` ���͵��¼�

`AbstractApplicationContext` �� `ApplicationEventPublisher` �����࣬������ǿ���ֱ�ӵ��� `AbstractApplicationContext#publishEvent` �������¼���

���� `AbstractApplicationContext` ��������������ʵ�֣����Ǻ��������������ʱ�پ��������

#### 2.3 �㲥��

�㲥���������ǽ��շ������¼���Ȼ���¼��㲥�����������������£�

```
public interface ApplicationEventMulticaster {

    /**
     * ��Ӽ�����
     */
    void addApplicationListener(ApplicationListener<?> listener);

    /**
     * ��Ӽ������� beanName
     */
    void addApplicationListenerBean(String listenerBeanName);

    /**
     * �Ƴ�������
     */
    void removeApplicationListener(ApplicationListener<?> listener);

    /**
     * �Ƴ��������� beanName
     */
    void removeApplicationListenerBean(String listenerBeanName);

    /**
     * �Ƴ����еļ�����
     */
    void removeAllListeners();

    /**
     * �㲥�¼�
     */
    void multicastEvent(ApplicationEvent event);

    /**
     * �㲥�¼�
     */
    void multicastEvent(ApplicationEvent event, @Nullable ResolvableType eventType);

}

```

�Ӵ������������㲥����Ҫ������������

1.  ά�������������ԶԼ�����������ɾ����
2.  �㲥�¼�

spring Ĭ�ϵĹ㲥��Ϊ `SimpleApplicationEventMulticaster`��������Ǻ�����ٷ�����

#### 2.4 ������

���������������������¼���Ȼ����һЩ����������������£�

```
@FunctionalInterface
public interface ApplicationListener<E extends ApplicationEvent> extends EventListener {

    /**
     * �����¼�
     */
    void onApplicationEvent(E event);

}

```

�ڴ����¼�����ʱ��������Ҫʵ�� `ApplicationListener`��Ȼ���� `onApplicationEvent(...)` �����б�д���ǵ��¼������߼���

### 3\. �عˣ�`�㲥���ĳ�ʼ��`��`��������ע��`

�����������ع���`�¼��㲥���ĳ�ʼ��`��`��������ע��`�����̡�

�ڴ��� spring ���������� `AbstractApplicationContext#refresh` �����У�`�¼��㲥���ĳ�ʼ��`��`��������ע��`�ֱ����ڵ� 8 ����� 10 ����

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-c4d4ac83c23e41a706b7ba545fd8d0f7681.png)

��ش������£�

```
public abstract class AbstractApplicationContext extends DefaultResourceLoader
        implements ConfigurableApplicationContext {

    /**
     * ��ʼ���㲥��
     * ������������¼��㲥������ʹ�������õģ������ʹ��Ĭ�ϵ��¼��㲥��
     */
    protected void initApplicationEventMulticaster() {
        ConfigurableListableBeanFactory beanFactory = getBeanFactory();
        // ����û��������Զ����¼��㲥������ʹ���û���
        if (beanFactory.containsLocalBean(APPLICATION_EVENT_MULTICASTER_BEAN_NAME)) {
            this.applicationEventMulticaster =
                    beanFactory.getBean(APPLICATION_EVENT_MULTICASTER_BEAN_NAME, 
                            ApplicationEventMulticaster.class);
        }
        else {
            // �û�û�����ù㲥������ʹ��Ĭ�ϵ��¼��㲥��
            this.applicationEventMulticaster = new SimpleApplicationEventMulticaster(beanFactory);
            beanFactory.registerSingleton(APPLICATION_EVENT_MULTICASTER_BEAN_NAME, 
                    this.applicationEventMulticaster);
        }
    }

    /**
     * ע�������
     */
    protected void registerListeners() {
        // 1\. �Ƚ��ֶ���ӵļ������ŵ��㲥����
        // ����AbstractApplicationContext#addApplicationListener�������
        for (ApplicationListener<?> listener : getApplicationListeners()) {
            getApplicationEventMulticaster().addApplicationListener(listener);
        }

        // 2\. ��beanFactory�л�ȡȡ�����������ƣ���ӵ��㲥����
        String[] listenerBeanNames = getBeanNamesForType(ApplicationListener.class, true, false);
        for (String listenerBeanName : listenerBeanNames) {
            getApplicationEventMulticaster().addApplicationListenerBean(listenerBeanName);
        }

        // 3\. �����������Ӧ���¼�������
        Set<ApplicationEvent> earlyEventsToProcess = this.earlyApplicationEvents;
        // �� earlyApplicationEvents ����Ϊ null���ٷ��������¼�
        this.earlyApplicationEvents = null;
        if (earlyEventsToProcess != null) {
            for (ApplicationEvent earlyEvent : earlyEventsToProcess) {
                getApplicationEventMulticaster().multicastEvent(earlyEvent);
            }
        }
    }

    ...

}

```

�㲥���ĳ�ʼ���߼��ܼ򵥣���������������¼��㲥������ʹ�������õģ������ʹ��Ĭ�ϵ��¼��㲥����Ĭ�ϵ��¼��㲥���� `SimpleApplicationEventMulticaster`��

ע����������������£�

1.  �Ƚ��ֶ���ӵļ������ŵ��㲥���У����ǿ��Ե��� `AbstractApplicationContext#addApplicationListener` ��Ӽ�������
2.  �� `beanFactory` �л�ȡȡ�����������ƣ���ӵ��㲥���У�ע�⣺��ʱ `beanFactory` �е� bean ��û�г�ʼ�������ֻ����� `beanName`;
3.  ������������¼����ͷ��������¼���

�ع������������̺����Ǵ�������Ҫ����������������㣺

1.  �㲥�����������ʼ����
2.  ��������������ע�ᵽ�㲥���е�

### 4\. �¼���������

����ǰ�����ڵ��̵棬���Ƕ��¼�������Ѿ����˸���ŵĸ��Ҳ�������¼��㲥���ĳ�ʼ�����������ע�����̣������� ���Ǿ���ʽ�����¼��ķ��������ˡ�

�� demo �У����ǵ��� `context.publishEvent(...)` �������¼������Ǹ������������

```
public abstract class AbstractApplicationContext extends DefaultResourceLoader
        implements ConfigurableApplicationContext {

    @Override
    public void publishEvent(ApplicationEvent event) {
        publishEvent(event, null);
    }

    protected void publishEvent(Object event, @Nullable ResolvableType eventType) {
        Assert.notNull(event, "Event must not be null");
        // �����¼�����
        ApplicationEvent applicationEvent;
        if (event instanceof ApplicationEvent) {
            applicationEvent = (ApplicationEvent) event;
        }
        else {
            applicationEvent = new PayloadApplicationEvent<>(this, event);
            if (eventType == null) {
                eventType = ((PayloadApplicationEvent<?>) applicationEvent).getResolvableType();
            }
        }

        // earlyApplicationEvents ��Ϊ null����applicationEvent��ӵ� earlyApplicationEvents
        // ��ע��������󣬻�� earlyApplicationEvents ����Ϊ null
        if (this.earlyApplicationEvents != null) {
            this.earlyApplicationEvents.add(applicationEvent);
        }
        else {
            // �����Ƿ����¼��Ĳ���
            getApplicationEventMulticaster().multicastEvent(applicationEvent, eventType);
        }

        // ���ڸ�������һ������
        if (this.parent != null) {
            if (this.parent instanceof AbstractApplicationContext) {
                ((AbstractApplicationContext) this.parent).publishEvent(event, eventType);
            }
            else {
                this.parent.publishEvent(event);
            }
        }
    }

}

```

��������ܼ򵥣��ؼ�����Ϊ

```
// �����Ƿ����¼��Ĳ���
getApplicationEventMulticaster().multicastEvent(applicationEvent, eventType);

```

���д����Ȼ�ȡ���¼��㲥����Ȼ��㲥�¼���

ǰ���ᵽ��spring �ṩ��Ĭ�ϵ��¼��㲥���� `SimpleApplicationEventMulticaster`�����ǽ��� `SimpleApplicationEventMulticaster#multicastEvent(ApplicationEvent, ResolvableType)` �������¼��Ĺ㲥���̣�

```
/**
 * �㲥�¼�
 */
public void multicastEvent(final ApplicationEvent event, @Nullable ResolvableType eventType) {
    ResolvableType type = (eventType != null ? eventType : resolveDefaultEventType(event));
    // 1\. ��ȡ TaskExecutor
    Executor executor = getTaskExecutor();
    // 2\. getApplicationListeners(...) ��ȡ�ܼ������¼��ļ�����
    for (ApplicationListener<?> listener : getApplicationListeners(event, type)) {
        // 3\. ��������������һ���� invokeListener(...) ����
        if (executor != null) {
            executor.execute(() -> invokeListener(listener, event));
        }
        else {
            invokeListener(listener, event);
        }
    }
}

```

���Ϸ������� 3 ��������

1.  ��ȡִ������`getTaskExecutor()`
2.  ��ȡ�¼��ļ�������`getApplicationListeners(...)`
3.  ���ü������ļ���������`invokeListener(...)`

���ϲ����������¼��㲥���������̣������������ú÷����¡�

#### 1\. ��ȡִ������`getTaskExecutor()`

`taskExecutor` �� `SimpleApplicationEventMulticaster` ��һ�����ԣ�`getTaskExecutor()` �� `taskExecutor` �� `getter` ������

```
    private Executor taskExecutor;

    public void setTaskExecutor(@Nullable Executor taskExecutor) {
        this.taskExecutor = taskExecutor;
    }

    @Nullable
    protected Executor getTaskExecutor() {
        return this.taskExecutor;
    }

```

spring Ϊ�����ṩ���������͵� `taskExecutor`��

1. `SyncTaskExecutor`��ͬ���� `taskExecutor`���� `execute(...)` ����Ϊ��

   ```
    @Override
    public void execute(Runnable task) {
        Assert.notNull(task, "Runnable must not be null");
        task.run();
    }
   
   ```

   ���Կ�������ȷʵ�Ǹ�ͬ��������ֱ�ӵ��� `Runnable#run` ��������û�������µ��߳�

2. `SimpleAsyncTaskExecutor`���첽�� `taskExecutor`���� `execute(...)` ����Ϊ��

   ```
   @Override
    public void execute(Runnable task, long startTimeout) {
        Assert.notNull(task, "Runnable must not be null");
        Runnable taskToUse = (this.taskDecorator != null 
                ? this.taskDecorator.decorate(task) : task);
        // doExecute(...) ���������ɻ�ķ���
        if (isThrottleActive() && startTimeout > TIMEOUT_IMMEDIATE) {
            this.concurrencyThrottle.beforeAccess();
            doExecute(new ConcurrencyThrottlingRunnable(taskToUse));
        }
        else {
            doExecute(taskToUse);
        }
    }
   
    /**
     * �����ɻ�ķ���
     * �Ӵ�����������������ᴴ���´�����ִ�����񣬵���û��ʹ���̳߳�
     */
    protected void doExecute(Runnable task) {
        // ���Կ��������ﴴ�����̣߳������������߳�
        Thread thread = (this.threadFactory != null 
                ? this.threadFactory.newThread(task) : createThread(task));
        thread.start();
    }
   
   ```

   ���Կ����� `SimpleAsyncTaskExecutor` �У��ᴴ���µ��߳���ִ������

�����ܲ��ܻ�ȡ��ִ�����أ�ͨ�����Է��֣�ִ�����Ļ�ȡ���Ϊ `null`��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-2e6ba6389e603a6373287dac26a89a24109.png)

���������ִ�� `invokeListener(...)` ����ʱ����ֱ�ӵ��õģ�

```
...
        else {
            invokeListener(listener, event);
        }
...

```

#### 2\. ��ȡ�¼��ļ�������`getApplicationListeners(...)`

׼����˵�������ȡ�����ܼ��������¼��ļ�����������Ϊ `AbstractApplicationEventMulticaster#getApplicationListeners(ApplicationEvent, ResolvableType)`��

```
/**
 * ����������������裺
 * 1\. �ӻ����л�ȡ���ܻ�ȡ����ֱ�ӷ���
 * 2\. ���ܴӻ����л�ȡ������ retrieveApplicationListeners(...) ������ȡ
 */
protected Collection<ApplicationListener<?>> getApplicationListeners(
        ApplicationEvent event, ResolvableType eventType) {
    Object source = event.getSource();
    Class<?> sourceType = (source != null ? source.getClass() : null);
    ListenerCacheKey cacheKey = new ListenerCacheKey(eventType, sourceType);
    // 1\. �ӻ����л�ȡ
    ListenerRetriever retriever = this.retrieverCache.get(cacheKey);
    if (retriever != null) {
        return retriever.getApplicationListeners();
    }
    if (this.beanClassLoader == null ||
            (ClassUtils.isCacheSafe(event.getClass(), this.beanClassLoader) &&
            (sourceType == null || ClassUtils.isCacheSafe(sourceType, this.beanClassLoader)))) {
        synchronized (this.retrievalMutex) {
            retriever = this.retrieverCache.get(cacheKey);
            if (retriever != null) {
                return retriever.getApplicationListeners();
            }
            retriever = new ListenerRetriever(true);
            // 2\. ��ȡ������������ǹؼ�
            Collection<ApplicationListener<?>> listeners =
                    retrieveApplicationListeners(eventType, sourceType, retriever);
            this.retrieverCache.put(cacheKey, retriever);
            return listeners;
        }
    }
    else {
        return retrieveApplicationListeners(eventType, sourceType, null);
    }
}

```

����������ų������ؼ�������������

1.  �ӻ����л�ȡ���ܻ�ȡ����ֱ�ӷ���
2.  ���ܴӻ����л�ȡ������ `retrieveApplicationListeners(...)` ������ȡ

���Ǽ������� `retrieveApplicationListeners(...)`��

```
/**
 * ������������ȡ������
 *
 */
private Collection<ApplicationListener<?>> retrieveApplicationListeners(
        ResolvableType eventType, @Nullable Class<?> sourceType, 
        @Nullable ListenerRetriever retriever) {
    List<ApplicationListener<?>> allListeners = new ArrayList<>();
    Set<ApplicationListener<?>> listeners;
    Set<String> listenerBeans;
    synchronized (this.retrievalMutex) {
        listeners = new LinkedHashSet<>(this.defaultRetriever.applicationListeners);
        listenerBeans = new LinkedHashSet<>(this.defaultRetriever.applicationListenerBeans);
    }
    // �� listeners �л�ȡ�ܴ���ǰ�¼��� lister
    for (ApplicationListener<?> listener : listeners) {
        // �������жϵ�ǰlistener�Ƿ�֧�ִ���event
        if (supportsEvent(listener, eventType, sourceType)) {
            if (retriever != null) {
                retriever.applicationListeners.add(listener);
            }
            allListeners.add(listener);
        }
    }
    // �� listenerBeans �л�ȡ�ܴ���ǰ�¼��� lister
    if (!listenerBeans.isEmpty()) {
        ConfigurableBeanFactory beanFactory = getBeanFactory();
        for (String listenerBeanName : listenerBeans) {
            try {
                // �����жϵ�ǰ listenerBeanName �Ƿ��ܼ��������¼�
                if (supportsEvent(beanFactory, listenerBeanName, eventType)) {
                    // �������л�ȡ��Ӧ��bean�����������¼����������������ǰ��ʼ��
                    ApplicationListener<?> listener = beanFactory.getBean(
                            listenerBeanName, ApplicationListener.class);
                    if (!allListeners.contains(listener) 
                            && supportsEvent(listener, eventType, sourceType)) {
                        if (retriever != null) {
                            // ע�ⵥ����ǵ���������
                            if (beanFactory.isSingleton(listenerBeanName)) {
                                retriever.applicationListeners.add(listener);
                            }
                            else {
                                retriever.applicationListenerBeans.add(listenerBeanName);
                            }
                        }
                        allListeners.add(listener);
                    }
                }
                else {
                    Object listener = beanFactory.getSingleton(listenerBeanName);
                    if (retriever != null) {
                        retriever.applicationListeners.remove(listener);
                    }
                    allListeners.remove(listener);
                }
            }
            catch (NoSuchBeanDefinitionException ex) {
            }
        }
    }
    // ����
    AnnotationAwareOrderComparator.sort(allListeners);
    if (retriever != null && retriever.applicationListenerBeans.isEmpty()) {
        retriever.applicationListeners.clear();
        retriever.applicationListeners.addAll(allListeners);
    }
    return allListeners;
}
...

}

```

�� `AbstractApplicationContext#registerListeners` �����У�������ע�������ʱ ��ע�����������������

1.  ע���ֶ���ӵļ�������������һ����ʵ����
2.  �������л�ȡ�������� beanName������ע�᣻

`retrieveApplicationListeners()` �г��ֵ� `listeners` �� `listenerBeans` ���Ǵ������������͵ļ������ġ�

���Ϸ�����Ȼ�е㳤�����߼��ǳ�������

1.  ���� `listeners`����һ���� `supportsEvent(listener, eventType, sourceType)` ���жϵ�ǰ listener �ܷ���������¼���
2.  ���� `listenerBeans`����һ���� `supportsEvent(beanFactory, listenerBeanName, eventType)` ���жϵ�ǰ listener �ܷ���������¼���

���������������Ĵ���Ƚϸ��ӣ�����Ͳ�һһ���з����ˣ������������Ĵ���˼·��

1. �Ӵ���� `listener` �� `listenerBeanName` ��ȡ `listener` �� Class��`listener` ֻ�� `listener.getClass()` ���ɣ�`listenerBeanName` ��ͨ�� `beanFactory.getType(listenerBeanName)` ��ȡ��

2. ��ȡ `listener` �������¼����ͣ�һ������������������ģ�

   ```
   public class MyApplicationEventListener 
           implements ApplicationListener<MyApplicationEvent> {
   
       @Override
       public void onApplicationEvent(MyApplicationEvent event) {
           ...
       }
   }
   
   ```

   ���ǿ���������ȡ�� `MyApplicationEvent`��

   ```
   // ��Щ�඼��jdk�ṩ��
   ParameterizedType parameterizedType = (ParameterizedType) 
           MyApplicationEventListener.class.getGenericInterfaces()[0];
       Class<?> type = (Class)parameterizedType.getActualTypeArguments()[0];
   
   ```

   ��Ȼ��spring �ڴ����ⲿ���߼�ʱ�ر��ӣ��Ͼ���� `MyApplicationEventListener` ͬʱʵ���˶���ӿڣ����� `MyApplicationEventListener` �ĸ� - �� - �� -... �ӿڲ��� `ApplicationListener`����Щ�����Ҫ���ǵ���

3. ��ȡ���������ܼ������¼��ˣ������жϵ�ǰ�жϼ����Ƿ��ܼ��������¼��ˣ�spring ����ƥ��ķ���Ϊ `ResolvableType#isAssignableFrom(ResolvableType)`����ע������������ʵ�������� `Class.isAssignableFrom` �����Ĺ��ܣ�ͬʱ���Դ������ϵķ���Ҳʵ�������� `Class.isAssignableFrom` �Ĺ��ܡ�

#### 3\. ���ü���������`invokeListener(...)`

���ڵ����ü��������ˣ��������£�

```
/**
 * ִ�м�����
 */
protected void invokeListener(ApplicationListener<?> listener, ApplicationEvent event) {
    ErrorHandler errorHandler = getErrorHandler();
    // ���յ��õ��� doInvokeListener(...)
    if (errorHandler != null) {
        try {
            doInvokeListener(listener, event);
        }
        catch (Throwable err) {
            errorHandler.handleError(err);
        }
    }
    else {
        doInvokeListener(listener, event);
    }
}

/**
 * �����ִ�в��������յ��õ��� ApplicationListener#onApplicationEvent ����
 */
private void doInvokeListener(ApplicationListener listener, ApplicationEvent event) {
    try {
        listener.onApplicationEvent(event);
    }
    catch (ClassCastException ex) {
        String msg = ex.getMessage();
        if (msg == null || matchesClassCastMessage(msg, event.getClass())) {
            // ʡ����־��ӡ
        }
        else {
            throw ex;
        }
    }
}

```

��һ��ܼ򵥣����Ǳ�����һ����ȡ�ļ���������һ������ `onApplicationEvent(...)` ������

������Ҫע����ǣ���ǰ��`��ȡִ����`�ķ����У������ᵽ `getTaskExecutor()` �Ľ��Ϊ `null`������� `invokeListener(...)` ��ֱ��ִ�еģ���û������һ���߳���ִ�У������Ҫ����ע�⡣

### 5\. �¼���Ӧ��

#### 5.1 ����������������¼�

�� spring ���������У�����������ɻᷢ�� `ContextRefreshed` �¼���

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-f60ea2710c59e2ce9e1401f1b54cbd9d700.png)

����Ҫ���������¼�Ҳʮ�ּ򵥣���Ӧ�� `Listener` ���£�

```
@Component
public class ContextRefreshedListener 
        implements ApplicationListener<ContextRefreshedEvent> {

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        System.out.println("�����������");
    }

}

```

#### 5.2 ���������¼�

һ��ʼ������Ϊ�����¼�������������

```
AnnotationConfigApplicationContext context 
        = new AnnotationConfigApplicationContext();
context.register(Demo08Config.class);
// �����¼�������������ǰ����
context.publishEvent(new MyApplicationEvent(
        Thread.currentThread().getName() + " | �Զ����¼� ..."));
context.refresh();

```

���к󣬻ᱨ�� ![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-4fc18c95f69d8c3d65be2a0f603d42e19ce.png)

�Ӵ�����Ϣ��������˵�㲥��δ��ʼ����

��ô�㲥�����������ʼ�����أ�������ǰ��ķ������������֪������ `refresh()` ���̵ĵ� 8 �����������¼��ķ������ڵ� 10 ��������һ���������¼���ֻ���ڵ� 9 ���ˣ�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-1fecd516c6d58d628937b20ebd806065891.png)

��������Կ����������¼�����Ϊ `onRefresh()` �����չ��׼���ģ�

�����¼��ķ���Ҳ�ͼ��ˣ�

```
ApplicationContext context = 
        new AnnotationConfigApplicationContext(Demo08Config.class) {
    @Override
    public void onRefresh() {
        // ���﷢�����������¼�
        publishEvent(new MyApplicationEvent(
                Thread.currentThread().getName() + " | �Զ����¼� ..."));
    }
};

```

#### 5.3 �첽�㲥�¼�

��ǰ���Դ������������¼���ִ������ͬһ���߳��н��еģ������ demo �����н����Ҳ�ܿ�������

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-afed97c136df717ba3d9397ff142ae0675f.png)

ǰ���Ѿ����������㲥�¼�ʱ�����Ȼ�ȡ `executor`����� `executor` ���ڣ��� `executor` ִ�У������ֱ��ִ�У����㲥���е� `executor` Ϊ `null`����˺����׽��ۣ�Ҫ��ʵ���첽ִ�У���Ҫ�ڹ㲥�������� `executor` ���ԡ�

ǰ��ͬ��Ҳ��������spring �ڳ�ʼ���㲥��ʱ�������ж��������Ƿ���ڹ㲥����`beanName` Ϊ `applicationEventMulticaster`������������ʹ�� `SimpleApplicationEventMulticaster` ����Ĭ�ϵĹ㲥����

���һ��������ֻ��Ҫ�Զ��� `beanName` Ϊ `applicationEventMulticaster` �� bean �����У���������

```
@Configuration
@ComponentScan
public class Demo08Config {

    /**
     * �����Զ���㲥��
     * ע�⣺���Ʊ���Ϊ applicationEventMulticaster
     */
    @Bean
    public ApplicationEventMulticaster applicationEventMulticaster() {
        SimpleApplicationEventMulticaster applicationEventMulticaster
                = new SimpleApplicationEventMulticaster();
        // SimpleAsyncTaskExecutor ��spring���ṩ���첽����ִ����
        applicationEventMulticaster.setTaskExecutor(new SimpleAsyncTaskExecutor());
        return applicationEventMulticaster;
    }
}

```

`SimpleApplicationEventMulticaster` ʹ���� spring �ṩ���첽����ִ������`SimpleAsyncTaskExecutor`�����У�������£�

```
SimpleAsyncTaskExecutor-2 | main | �Զ����¼� ...

```

���Կ����������߳�������̲߳�����ͬһ���ˡ�

�����鵽�⻹���꣬ǰ���Ѿ������� `SimpleAsyncTaskExecutor` ������ִ�й��̣���ִ��ʱ���᲻�ϴ������̣߳�

```
   protected void doExecute(Runnable task) {
        // ���Կ��������ﴴ�����̣߳������������߳�
        Thread thread = (this.threadFactory != null 
                ? this.threadFactory.newThread(task) : createThread(task));
        thread.start();
    }

```

��������������� 100 ���¼���

```
for(int i = 0; i < 100; i++) {
    context.publishEvent(new MyApplicationEvent(
            Thread.currentThread().getName() + " | �Զ����¼� ..."));
}

```

���н����������

```
SimpleAsyncTaskExecutor-2 | main | �Զ����¼� ...
SimpleAsyncTaskExecutor-3 | main | �Զ����¼� ...
SimpleAsyncTaskExecutor-4 | main | �Զ����¼� ...
...
SimpleAsyncTaskExecutor-99 | main | �Զ����¼� ...
SimpleAsyncTaskExecutor-100 | main | �Զ����¼� ...
SimpleAsyncTaskExecutor-101 | main | �Զ����¼� ...

```

���Կ���������ÿһ���¼������ᴴ��һ�����߳���ִ�У��̱߳�������˱������Դ������Ƶ���ش�������һ��������˷ѣ�����������߳��أ������̳߳ء�

���ǿ��� `SimpleApplicationEventMulticaster#setTaskExecutor` �����Ĳ������������� `java.util.concurrent.Executor`������������ͱ�ü��ˣ�����ֱ��ʹ�� jdk �ṩ���̳߳أ�

```
@Bean
public ApplicationEventMulticaster applicationEventMulticaster() {
    SimpleApplicationEventMulticaster applicationEventMulticaster
            = new SimpleApplicationEventMulticaster();
    // ʹ��jdk�ṩ���̳߳�
    applicationEventMulticaster.setTaskExecutor(Executors.newFixedThreadPool(4));
    return applicationEventMulticaster;
}

```

����ʹ�õ��� jdK �ṩ�� `newFixedThreadPool`�������� 4 ���̣߳����У�������£�

```
pool-1-thread-2 | main | �Զ����¼� ...
pool-1-thread-3 | main | �Զ����¼� ...
pool-1-thread-4 | main | �Զ����¼� ...
pool-1-thread-4 | main | �Զ����¼� ...
pool-1-thread-1 | main | �Զ����¼� ...
pool-1-thread-3 | main | �Զ����¼� ...
pool-1-thread-3 | main | �Զ����¼� ...
pool-1-thread-2 | main | �Զ����¼� ...
pool-1-thread-1 | main | �Զ����¼� ...
pool-1-thread-3 | main | �Զ����¼� ...
...

```

���Կ�������ʼ����ֻ�� 4 ���߳��ڹ㲥�¼���

����Щ����淶�У��ǽ�ֱֹ��ʹ�� jdk �ṩ���̵߳ĳأ����Ǹ��ᳫ�Զ����̳߳أ�������㣬���ڱ��Ĳ����������̳߳ؼ����ģ���˾ͼ򵥵�ʹ�� jdk �ṩ���߳�ʾ���¡�

#### 5.4 �Զ����¼�

ʵ���ϣ�ǰ���ṩ��ʾ�� demo �����Զ����¼�������Ͳ��ظ��ˡ�

### 6\. �ܽ�

���ķ����� spring �¼����ƣ��������¼����Ĵ����������¼������������㲥���������������Ҵ�Դ�����������ĳ�ʼ�����¼��ķ������̡�

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4713339](https://my.oschina.net/funcy/blog/4713339) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_