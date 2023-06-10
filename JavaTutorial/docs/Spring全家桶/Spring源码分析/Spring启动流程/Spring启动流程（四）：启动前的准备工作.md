��ɰ���ɨ��󣬽��žͿ�ʼ�� spring �������ˣ��� `AbstractApplicationContext#refresh` �������÷���һ������ 13 ������������Ҳ spring �������������̣�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-88c3a2486c24ccd0ad390ba9b62b986a6b2.png)

��ϵ�дӱ��Ŀ�ʼ���𲽷����� 13 ��������̽�� spring ���������̡�

### 1\. ����ǰ׼����`prepareRefresh()`

���� `prepareRefresh()` ���������������£�

```
|-AnnotationConfigApplicationContext#AnnotationConfigApplicationContext(String...)
 |-AbstractApplicationContext#refresh
  |-AbstractApplicationContext#prepareRefresh

```

�������£�

```
protected void prepareRefresh() {
    // Switch to active.
    this.startupDate = System.currentTimeMillis();
    this.closed.set(false);
    this.active.set(true);

    // ��ʼ�����������ļ���������û�о���ʵ�֣�һ�������û�����չ��
    initPropertySources();

    // ��黷������
    getEnvironment().validateRequiredProperties();

    if (this.earlyApplicationListeners == null) {
        this.earlyApplicationListeners = new LinkedHashSet<>(this.applicationListeners);
    } else {
        this.applicationListeners.clear();
        this.applicationListeners.addAll(this.earlyApplicationListeners);
    }

    this.earlyApplicationEvents = new LinkedHashSet<>();
}

```

��δ���Ƚϼ򵥣�����������������ʱ�䡢����������״̬�����������ļ�顢���Եĳ�ʼ���ȡ�

### 2\. ��ȡ `beanFactory: obtainFreshBeanFactory()`

�����ٸ��� `obtainFreshBeanFactory()` �������������£�

> AbstractApplicationContext#obtainFreshBeanFactory

```
protected ConfigurableListableBeanFactory obtainFreshBeanFactory() {
    refreshBeanFactory();
    // ���ظոմ����� BeanFactory
    return getBeanFactory();
}

```

����������� `refresh` �� `BeanFactory`��Ȼ���ٷ����� `BeanFactory`�����Ǽ������� `refreshBeanFactory()`��

> GenericApplicationContext#refreshBeanFactory

```
@Override
protected final void refreshBeanFactory() throws IllegalStateException {
    // ʡ����һЩ�жϴ���
    this.beanFactory.setSerializationId(getId());
}

```

��������ؼ�����ֻ��һ�У��������������� beanFactory �� `SerializationId`.

�����ٻع�ͷ������ `getBeanFactory()` ������

> GenericApplicationContext#getBeanFactory

```
public final ConfigurableListableBeanFactory getBeanFactory() {
    return this.beanFactory;
}

```

��������͸����ˣ����������˵�ǰ��� `beanFactory`����� `beanFactory` ���������ڷ��� `AnnotationConfigApplicationContext` ���췽��ʱ�����ģ�����Ϊ `DefaultListableBeanFactory`.

### 3\. ׼�� `beanFactory: prepareBeanFactory(beanFactory)`

���Ǽ��������� `prepareBeanFactory(beanFactory)` ������

> AbstractApplicationContext#prepareBeanFactory

```
protected void prepareBeanFactory(ConfigurableListableBeanFactory beanFactory) {
    // ����Ϊ���ص�ǰApplicationContext����������
    beanFactory.setBeanClassLoader(getClassLoader());
    // ���� BeanExpressionResolver����bean���ʽ������
    beanFactory.setBeanExpressionResolver(
            new StandardBeanExpressionResolver(beanFactory.getBeanClassLoader()));
    // ���Ա༭��֧��
    beanFactory.addPropertyEditorRegistrar(new ResourceEditorRegistrar(this, getEnvironment()));

    // ������Spring����һ����չ��
    // ������ʵ����Aware�ӿڵ�bean�ڳ�ʼ����ʱ����� processor����ص���
    // ������Ǻܳ��ã������ǻ�Ϊ�˻�ȡ ApplicationContext �� implement ApplicationContextAware
    // ע�⣺���������ص� ApplicationContextAware�����Ḻ��ص� EnvironmentAware��ResourceLoaderAware ��
    beanFactory.addBeanPostProcessor(new ApplicationContextAwareProcessor(this));

    // ���漸�е���˼���ǣ����ĳ�� bean ���������¼����ӿڵ�ʵ���࣬
    // ���Զ�װ���ʱ��������ǣ�Spring ��ͨ��������ʽ��������Щ������
    beanFactory.ignoreDependencyInterface(EnvironmentAware.class);
    beanFactory.ignoreDependencyInterface(EmbeddedValueResolverAware.class);
    beanFactory.ignoreDependencyInterface(ResourceLoaderAware.class);
    beanFactory.ignoreDependencyInterface(ApplicationEventPublisherAware.class);
    beanFactory.ignoreDependencyInterface(MessageSourceAware.class);
    beanFactory.ignoreDependencyInterface(ApplicationContextAware.class);

    // ���漸�о���Ϊ����ļ��� bean ��ֵ������� bean ���������¼�������ע�������Ӧ��ֵ
    beanFactory.registerResolvableDependency(BeanFactory.class, beanFactory);
    beanFactory.registerResolvableDependency(ResourceLoader.class, this);
    beanFactory.registerResolvableDependency(ApplicationEventPublisher.class, this);
    beanFactory.registerResolvableDependency(ApplicationContext.class, this);

     // ���һ�����ô�������ApplicationListenerDetector���˺��ô�����ʵ����BeanPostProcessor�ӿ�
     beanFactory.addBeanPostProcessor(new ApplicationListenerDetector(this));

    // �������bean����ΪloadTimeWeaver��bean��ע��һ��BeanPostProcessor
    if (beanFactory.containsBean(LOAD_TIME_WEAVER_BEAN_NAME)) {
        beanFactory.addBeanPostProcessor(new LoadTimeWeaverAwareProcessor(beanFactory));
        // Set a temporary ClassLoader for type matching.
        beanFactory.setTempClassLoader(
                new ContextTypeMatchClassLoader(beanFactory.getBeanClassLoader()));
    }

    // ���û�ж��� "environment" ��� bean����ô Spring �� "�ֶ�" ע��һ��
    if (!beanFactory.containsLocalBean(ENVIRONMENT_BEAN_NAME)) {
        beanFactory.registerSingleton(ENVIRONMENT_BEAN_NAME, getEnvironment());
    }
    // ���û�ж��� "systemProperties" ��� bean����ô Spring �� "�ֶ�" ע��һ��
    if (!beanFactory.containsLocalBean(SYSTEM_PROPERTIES_BEAN_NAME)) {
        beanFactory.registerSingleton(SYSTEM_PROPERTIES_BEAN_NAME, 
                getEnvironment().getSystemProperties());
    }
    // ���û�ж��� "systemEnvironment" ��� bean����ô Spring �� "�ֶ�" ע��һ��
    if (!beanFactory.containsLocalBean(SYSTEM_ENVIRONMENT_BEAN_NAME)) {
        beanFactory.registerSingleton(SYSTEM_ENVIRONMENT_BEAN_NAME, 
                getEnvironment().getSystemEnvironment());
    }
}

```

��������Ƕ� beanFactory ��һЩ׼��������һЩ���ԣ����һЩ bean ����ȣ����붼��ע�⣬����Ͳ��ظ�˵�ˡ�

������ beanFactory ����� `ApplicationListenerDetector` ��Ҫ���£���ش���Ϊ `beanFactory.addBeanPostProcessor(new ApplicationListenerDetector(this));`�����ǿ��� `ApplicationListenerDetector` ����ࣺ

> org.springframework.context.support.ApplicationContextAwareProcessor

```
class ApplicationContextAwareProcessor implements BeanPostProcessor {
    @Override
    @Nullable
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
    // ʡ����һЩ����
    AccessControlContext acc = null;
    if (System.getSecurityManager() != null) {
        acc = this.applicationContext.getBeanFactory().getAccessControlContext();
    }
    if (acc != null) {
        AccessController.doPrivileged((PrivilegedAction<Object>) () -> {
            invokeAwareInterfaces(bean);
            return null;
        }, acc);
    } else {
        invokeAwareInterfaces(bean);
    }
        return bean;
    }

    // �ص� Aware�ӿ�
    private void invokeAwareInterfaces(Object bean) {
        // ���� EnvironmentAware#setEnvironment ����
        if (bean instanceof EnvironmentAware) {
            ((EnvironmentAware) bean).setEnvironment(this.applicationContext.getEnvironment());
        }
        // ���� EmbeddedValueResolverAware#setEmbeddedValueResolver ����
        if (bean instanceof EmbeddedValueResolverAware) {
            ((EmbeddedValueResolverAware) bean).setEmbeddedValueResolver(this.embeddedValueResolver);
        }
        // ���� ResourceLoaderAware#setResourceLoader ����
        if (bean instanceof ResourceLoaderAware) {
            ((ResourceLoaderAware) bean).setResourceLoader(this.applicationContext);
        }
        // ���� ApplicationEventPublisherAware#setApplicationEventPublisher ����
        if (bean instanceof ApplicationEventPublisherAware) {
            ((ApplicationEventPublisherAware) bean).setApplicationEventPublisher(this.applicationContext);
        }
        // ���� MessageSourceAware#setMessageSource ����
        if (bean instanceof MessageSourceAware) {
            ((MessageSourceAware) bean).setMessageSource(this.applicationContext);
        }
        // ���� ApplicationContextAware#setApplicationContext ����
        if (bean instanceof ApplicationContextAware) {
            ((ApplicationContextAware) bean).setApplicationContext(this.applicationContext);
        }
    }

    // ʡ����������
}

```

���Կ�����

1.  �����ʵ���� `BeanPostProcessor` �ӿڣ�
2.  ���� `postProcessBeforeInitialization` �� `BeanPostProcessor` �ṩ����Ϊ�ؼ��Ĵ�����` invokeAwareInterfaces(bean);`��
3.  `invokeAwareInterfaces` ֻ��һϵ�еķ�������

���� `BeanPostProcessor` �ĵķ��������Բο� [spring ���֮ BeanPostProcessors ](https://my.oschina.net/funcy/blog/4597551)�����ڸ�������ã����������������

���ˣ����ĵķ����͵������ˣ����Ľ������� spring ����ʱ�� beanFactory ��׼�������ݽϼ򵥣������һ��ͼ���ܽ��±������ݣ�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-1e10d7aff080b2e0bbfbef5d79c56cc54c9.png)

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4633169](https://my.oschina.net/funcy/blog/4633169) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_