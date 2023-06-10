![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-ed6b80d76ba4b2ddb0f8d15e070a0c32df7.png)

�����ģ����Ǽ������� spring ���������̡�

### 7\. ���ʻ�: `initMessageSource()`

���������������ʼ�� `MessageSource` �ģ��������£�

```
public abstract class AbstractApplicationContext extends DefaultResourceLoader
        implements ConfigurableApplicationContext {

    ...

    /**
     * ��ʼ�� MessageSource
     */
    protected void initMessageSource() {
        ConfigurableListableBeanFactory beanFactory = getBeanFactory();
        // ���beanFactory�д���MessageSource�������� ParentMessageSource
        if (beanFactory.containsLocalBean(MESSAGE_SOURCE_BEAN_NAME)) {
            this.messageSource = beanFactory.getBean(
                    MESSAGE_SOURCE_BEAN_NAME, MessageSource.class);
            if (this.parent != null && this.messageSource instanceof HierarchicalMessageSource) {
                HierarchicalMessageSource hms = (HierarchicalMessageSource) this.messageSource;
                if (hms.getParentMessageSource() == null) {
                    // ����ParentMessageSource
                    hms.setParentMessageSource(getInternalParentMessageSource());
                }
            }
        }
        // ���beanFactory�в�����MessageSource���� ����-����-ע��
        else {
            DelegatingMessageSource dms = new DelegatingMessageSource();
            dms.setParentMessageSource(getInternalParentMessageSource());
            this.messageSource = dms;
            // ����ParentMessageSource
            beanFactory.registerSingleton(MESSAGE_SOURCE_BEAN_NAME, this.messageSource);
        }
    }

    /**
     * ���ظ������� messageSource
     */
    @Nullable
    protected MessageSource getInternalParentMessageSource() {
        return (getParent() instanceof AbstractApplicationContext ?
                ((AbstractApplicationContext) getParent()).messageSource : getParent());
    }

    ...
}

```

���Կ���������������Ҫ�ǲ��� `MessageSource`����Ҫ�߼�Ϊ������Ѿ����� `MessageSource` �ˣ�������һЩ���ԣ�����ʹ��� `MessageSource`��������Щ ���ԣ����ע�ᵽ `beanFactory` �С�

���� `MessageSource` �ľ������ã����ľͲ�չ���ˡ�

### 8\. ��ʼ���¼��㲥����`initApplicationEventMulticaster()`

`AbstractApplicationContext#initApplicationEventMulticaster` �������£�

```
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

```

����߼�Ҳ�ܼ򵥣�����Ѵ����¼��㲥������ʹ���Ѵ��ڵģ�����ʹ���һ�������� `ApplicationEventMulticaster`����Ҫ���������㲥�¼��ģ���������¼������ݣ����Բο� [spring ̽��֮ spring �¼�����](https://my.oschina.net/funcy/blog/4713339).

### 9\. ��չ�㣺onRefresh ()

`AbstractApplicationContext#onRefresh` �� spring �ṩ��һ����չ�㣬�����������ݣ�

```
protected void onRefresh() throws BeansException {

}

```

�����Ҫ�����ض��Ĳ�����������������ʵ�֡�

��ǰʹ�õ� `ApplicationContext` �� `AnnotationConfigApplicationContext`������ `onRefresh()` �������Ͳ���������ˡ�

### 10\. ע���¼���������registerListeners ()

`AbstractApplicationContext#registerListeners` ��ش������£�

> AbstractApplicationContext

```
/** �������������ż������� */
private final Set<ApplicationListener<?>> applicationListeners = new LinkedHashSet<>();

/** ���ص�ǰ���еļ����� */
public Collection<ApplicationListener<?>> getApplicationListeners() {
    return this.applicationListeners;
}

/**
 * ��Ӽ�����
 */
public void addApplicationListener(ApplicationListener<?> listener) {
    Assert.notNull(listener, "ApplicationListener must not be null");
    if (this.applicationEventMulticaster != null) {
        this.applicationEventMulticaster.addApplicationListener(listener);
    }
    this.applicationListeners.add(listener);
}

/**
 * ע�������
 */
protected void registerListeners() {
    // ������ֶ�set��һЩ������
    // getApplicationListeners() ��ȡ�ļ�����������ͨ������ addApplicationListener(...) ��ӵ�
    for (ApplicationListener<?> listener : getApplicationListeners()) {
        getApplicationEventMulticaster().addApplicationListener(listener);
    }
    // ��ȡȡ�������������ƣ����õ��㲥��
    // ��ʱ��ȡ�ļ������Ǵ� beanFactory �л�ȡ�ģ�����springͨ����ɨ��õ���
    String[] listenerBeanNames = getBeanNamesForType(ApplicationListener.class, true, false);
    for (String listenerBeanName : listenerBeanNames) {
        getApplicationEventMulticaster().addApplicationListenerBean(listenerBeanName);
    }
    // �����������Ӧ���¼����㲥
    Set<ApplicationEvent> earlyEventsToProcess = this.earlyApplicationEvents;
    this.earlyApplicationEvents = null;
    if (earlyEventsToProcess != null) {
        for (ApplicationEvent earlyEvent : earlyEventsToProcess) {
            //  �㲥�����¼�
            getApplicationEventMulticaster().multicastEvent(earlyEvent);
        }
    }
}

```

������������̴������£�

1.  ��� `AbstractApplicationContext#applicationListeners` �еļ������� `ApplicationEventMulticaster` ��
2.  �� `beanFactory` ��ȡ�������� `beanName`����ӵ� `ApplicationEventMulticaster` ��
3.  ����������¼����ͽ��й㲥

���� spring ���¼������Ĳ�������չ����������˽���࣬�ɲο� [spring ̽��֮ spring �¼�����](https://my.oschina.net/funcy/blog/4713339).

���ĵķ����͵������ˡ�

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4892120](https://my.oschina.net/funcy/blog/4892120) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_