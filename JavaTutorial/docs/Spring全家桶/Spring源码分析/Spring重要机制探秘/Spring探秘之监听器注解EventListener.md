��������� `BeanFactoryPostProcessor` ����ʱ�������˴����¼���������һ�ִ���ʽ��ʹ�� `@EventListener` ע�⣬��������� `EventListenerMethodProcessor`�������ȴ�һ��ʾ�����������𲽷��� `@EventListener` �Ĵ�����̡�

### 1. `@EventListener` ʹ��ʾ��

�ȶ���һ���¼���

```
public class MyApplicationEvent extends ApplicationEvent {

    private static final long serialVersionUID = -1L;

    public MyApplicationEvent(Object source) {
        super(source);
    }
}

```

��׼��һ���¼������������ʹ�� `@EventListener` ָ����������

```
@Configuration
public class Demo08Config {

    /**
     * ���Ǹ��¼�������
     */
    @EventListener(MyApplicationEvent.class)
    public void listener(MyApplicationEvent event) {
        System.out.println("@EventListener���������¼���"
                + Thread.currentThread().getName() + " | " + event.getSource());
    }
}

```

Ȼ�󷢲��¼���

```
@ComponentScan
public class Demo08Main {

    public static void main(String[] args) {
        ApplicationContext context = new AnnotationConfigApplicationContext(Demo08Config.class);
        // �����¼�
        context.publishEvent(new MyApplicationEvent(
            Thread.currentThread().getName() + " | �Զ����¼� ..."));
    }
}

```

���У�������£�

```
@EventListener���������¼���main | main | �Զ����¼� ...

```

���Կ������� `@EventListener` ��ǵķ���ȷʵ������¼��ļ�����

### 2. `@EventListener` ����

ʹ�� `@EventListener` �����������ʵ�� `ApplicationListener` ����ʵ���¼����������˴���Ŀ������������������� `@EventListener` ��Ϊ������Щʲô��

`@EventListener` �Ĵ������£�

```
@Target({ElementType.METHOD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface EventListener {

    /**
     * classes �ı���
     * ����ָ���������¼�������ͬʱ��������¼� 
     */
    @AliasFor("classes")
    Class<?>[] value() default {};

    /**
     * value �ı���
     * ����ָ���������¼�������ͬʱ��������¼� 
     */
    @AliasFor("value")
    Class<?>[] classes() default {};

    /**
     * ����ָ��һ����������������ʱ�����Ż�ִ��
     * ֧��spring el ���ʽ
     */
    String condition() default "";

}

```

�Ӵ���������`@EventListener` �ṩ�������ܣ�

*   ָ���������¼�������ָ������¼�
*   ָ��һ����������������ʱ�����Ż�ִ�У�����֧�� spring EL ���ʽ

�˽� `@EventListener` �ṩ�Ĺ��ܺ󣬽��������������� spring ����δ������ע��ġ�

### 3. `@EventListener` �Ĵ���`EventListenerMethodProcessor`

���¿�ƪ��˵�������� `@EventListener` �Ĺ��ܣ����������� `BeanFactoryPostProcessor` ����ʱ���ֵģ���ʱ���� `BeanFactoryPostProcessor` ��ʵ���� `EventListenerMethodProcessor` �ᴦ�� `@EventListener` ע�⣬�������ʹӴ���Ƕ������� `EventListenerMethodProcessor` ���� `@EventListener` �����̡�

������������ʶ�� `EventListenerMethodProcessor`��

```
public class EventListenerMethodProcessor
        implements SmartInitializingSingleton, ApplicationContextAware, BeanFactoryPostProcessor {
    ...
}

```

����Ҫ��ʵ���������ӿڣ�

*   `BeanFactoryPostProcessor`������������ `BeanFactoryPostProcessor` �������Զ��ƻ� `BeanFactory` ��һЩ��Ϊ��
*   `SmartInitializingSingleton`�������� bean �ĳ�ʼ��������ִ��ʱ������ `bean` ��ʼ�����֮��

���������������� `BeanFactoryPostProcessor#postProcessBeanFactory` ��ʵ�֣�

```
    @Nullable
    private List<EventListenerFactory> eventListenerFactories;

    /**
     * ���� BeanFactoryPostProcessor �� postProcessBeanFactory(...) ����.
     * �������������ǻ�ȡ�� EventListenerFactory��Ȼ�󱣴��� eventListenerFactories��.
     * spring Ĭ���ṩ�� EventListenerFactory ��������
     *     1\. DefaultEventListenerFactory��spring Ĭ�ϵ�
     *     2\. TransactionalEventListenerFactory���������������
     * �ⲿ�ֲ�û����ʲô��
     */
    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) {
        this.beanFactory = beanFactory;

        Map<String, EventListenerFactory> beans = beanFactory
                .getBeansOfType(EventListenerFactory.class, false, false);
        List<EventListenerFactory> factories = new ArrayList<>(beans.values());
        // ����
        AnnotationAwareOrderComparator.sort(factories);
        this.eventListenerFactories = factories;
    }

```

����������ǱȽϼ򵥵ģ���ֻ�Ǵ������л�ȡ�� `EventListenerFactory` ����ֵ���� `eventListenerFactories`��

`EventListenerFactory` �Ĺ������������� `ApplicationListener`���������ǻ���� spring ����ΰ� `@EventListener` ��ǵķ���ת���� `ApplicationListener` ����ġ��Ӵ���������spring �ṩ�� `EventListenerFactory` ��������

*   `DefaultEventListenerFactory`��spring Ĭ�ϵ�
*   `TransactionalEventListenerFactory`���������������

���������������������� `SmartInitializingSingleton#afterSingletonsInstantiated()` ��ʵ�֣�

```
    /**
     * ��������� SmartInitializingSingleton �� afterSingletonsInstantiated() ����.
     * ����bean��ʼ����ɺ���á�
     * ����������У���Ҫ�ǽ������ @EventListener �ķ���ת���� ApplicationListener ���󣬲�ע�ᵽ��������
     */
    @Override
    public void afterSingletonsInstantiated() {
        ConfigurableListableBeanFactory beanFactory = this.beanFactory;
        Assert.state(this.beanFactory != null, "No ConfigurableListableBeanFactory set");
        String[] beanNames = beanFactory.getBeanNamesForType(Object.class);
        for (String beanName : beanNames) {
            if (!ScopedProxyUtils.isScopedTarget(beanName)) {
                Class<?> type = null;
                try {
                    // ��ȡ aop �����Ӧ��Ŀ���࣬�� beanName ��Ӧ�� BeanDefinition �л�ȡ.
                    // �����ȡ��������ʾ�ǲ��Ǵ������ʹ�� beanFactory.getType(beanName) ��ȡ
                    type = AutoProxyUtils.determineTargetClass(beanFactory, beanName);
                }
                catch (Throwable ex) {
                    ...
                }
                if (type != null) {
                    if (ScopedObject.class.isAssignableFrom(type)) {
                        try {
                            Class<?> targetClass = AutoProxyUtils.determineTargetClass(
                                    beanFactory, ScopedProxyUtils.getTargetBeanName(beanName));
                            if (targetClass != null) {
                                type = targetClass;
                            }
                        }
                        catch (Throwable ex) {
                            ...
                        }
                    }
                    try {
                        // ����Ĵ������
                        processBean(beanName, type);
                    }
                    catch (Throwable ex) {
                        ...
                    }
                }
            }
        }
    }

```

���������ִ���������£�

1.  ��ȡ��ǰ `beanFactory` �е����� `bean`�����õ��� `beanFactory.getBeanNamesForType(Object.class)` ������ע�⴫��� `class` �� `Object`���������ó������е� `bean`��
2.  ������Щ `bean`����ÿһ�� `bean`������Ǵ����������� `AutoProxyUtils.determineTargetClass(beanFactory, beanName)` ������ȡ��Ŀ���࣬����֪��ע���ǲ��ܼ̳еģ�Ҫ��ȡ `@EventListener` ��ǵķ�������Ҫ��Ŀ����ȥ��ȡ��������Ǵ��������Ŀ������� `bean` ��Ӧ���ࣻ
3.  ���� `processBean(beanName, type)` ������һ������.

�����ؼ����� `EventListenerMethodProcessor#processBean` �����ˣ�

```
/**
 * ���� bean�� ��������Ὣ @EventListener ע���ǵķ���ת��Ϊ ApplicationListener ���󣬲�ע�ᵽ������.
 * @param beanName
 * @param targetType
 */
private void processBean(final String beanName, final Class<?> targetType) {
    if (!this.nonAnnotatedClasses.contains(targetType) &&
            AnnotationUtils.isCandidateClass(targetType, EventListener.class) &&
            !isSpringContainerClass(targetType)) {
        Map<Method, EventListener> annotatedMethods = null;

        try {
            // 1\. �ҵ���� @EventListener �ķ���
            annotatedMethods = MethodIntrospector.selectMethods(targetType,
                (MethodIntrospector.MetadataLookup<EventListener>) method ->
                    AnnotatedElementUtils.findMergedAnnotation(method, EventListener.class));
        }
        catch (Throwable ex) {
            ...
        }

        if (CollectionUtils.isEmpty(annotatedMethods)) {
            this.nonAnnotatedClasses.add(targetType);
        }
        else {
            ConfigurableApplicationContext context = this.applicationContext;
            Assert.state(context != null, "No ApplicationContext set");
            List<EventListenerFactory> factories = this.eventListenerFactories;
            Assert.state(factories != null, "EventListenerFactory List not initialized");
            // 2\. ʹ�� EventListenerFactory ������ ApplicationListener ����
            for (Method method : annotatedMethods.keySet()) {
                for (EventListenerFactory factory : factories) {
                    // �жϵ�ǰ EventListenerFactory �Ƿ�֧�ֵ�ǰ����
                    if (factory.supportsMethod(method)) {
                        // ����Ǵ��������õ�������ķ���
                        Method methodToUse = AopUtils.selectInvocableMethod(
                                method, context.getType(beanName));
                        // ���� ApplicationListener��������Ǵ�����ķ���
                        ApplicationListener<?> applicationListener = factory
                                .createApplicationListener(beanName, targetType, methodToUse);
                        // ��ʼ����������һ����Ҫ�Ƕ������ж�����ֵ��this.evaluator
                        if (applicationListener instanceof ApplicationListenerMethodAdapter) {
                            ((ApplicationListenerMethodAdapter) applicationListener)
                                    .init(context, this.evaluator);
                        }
                        // ��ӵ��������У����� Listener ��Set�����Զ�ȥ��
                        context.addApplicationListener(applicationListener);
                        // ������һ������� EventListenerFactory �Ͳ�����ִ���ˣ�
                        // ����ʱ��ͻᷢ�� factories ��˳�����Ҫ
                        // ������ EventListenerFactory ��ָ��˳��
                        break;
                    }
                }
            }
        }
    }
}

```

�� `processBean(...)` �����Ĺؼ���������ע�ͣ��������ܽ��´������̣�

1.  �ҵ���� `@EventListener` �ķ���������ʹ�õ��� `MethodIntrospector#selectMethods(...)` �������в��ң����������鵽��ǰ��ķ������丸��ķ����Լ��ӿڵ�Ĭ�Ϸ�����һֱ�� Object Ϊֹ����Щ�������������� `@EventListener`�����ᱻ�ҵ������ջ���ҵ������з����ŵ�һ�� Map �У�
2.  ���������õ��� map����ÿ������ת��Ϊ `ApplicationListener` ��������ӵ� `applicationContext` �� `ApplicationListener` �У������������£�
    1.  ����ǰ��õ��� `EventListenerFactory`��
    2.  ������ǰ�� `EventListenerFactory` �Ƿ�֧�ָ÷�����֧���������һ������֧���򲻴���
    3.  ���ڴ�������ҵ���ǰ�����Ĵ�����������ִ�е�Ҳ�Ǵ�������
    4.  ���� `ApplicationListener` ���󣬹��췽���Ĳ����ᴫ�� `method`�����ڴ��������� `method` �Ǵ������� `method`��
    5.  ���� `ApplicationListenerMethodAdapter` ʵ�������г�ʼ����������Ҫ�Ǹ�ֵ��this.evaluator��
    6.  ���õ��� `ApplicationListener` ��ӵ��������У����� `Listener` ��һ�� `Set`�����Զ�ȥ�ء�

������������ `@EventListener` ��ǵķ���֮�����ܶ��¼����м���������Ϊ spring ���÷�����װ��һ�� `ApplicationListener` ��ӵ��������ˣ�֮������������͸�ʵ���� `ApplicationListener` �ӿڵļ�����һ���ܶ��¼����м����ˡ�

### 5. `ApplicationListener` ���������

ǰ������� `@EventListener` �Ĵ������̣����ڽ������� `ApplicationListener` ��������ɣ���Ӧ�Ĵ���Ϊ��

```
// EventListenerMethodProcessor#processBean
ApplicationListener<?> applicationListener = factory
        .createApplicationListener(beanName, targetType, methodToUse);

```

ǰ�����ǽ��ܹ� spring �ṩ�� `EventListenerFactory` ��������

*   `DefaultEventListenerFactory`��spring Ĭ�ϵ�
*   `TransactionalEventListenerFactory`���������������

���������Ǿ������������� `EventListenerFactory`��

#### 5.1 `DefaultEventListenerFactory`

```
public class DefaultEventListenerFactory implements EventListenerFactory, Ordered {
    ...

    /**
     * ������Ĭ�ϵ�ʵ�֣���֧�����еķ���
     */
    @Override
    public boolean supportsMethod(Method method) {
        return true;
    }

    /**
     * ��������
     */ 
    @Override
    public ApplicationListener<?> createApplicationListener(String beanName, 
            Class<?> type, Method method) {
        return new ApplicationListenerMethodAdapter(beanName, type, method);
    }
}

```

�����ϴ���˵�����£�

1.  `DefaultEventListenerFactory` �� spring �ṩ��Ĭ��ʵ�֣���֧�����б���� `@EventListener` �ķ�����
2.  ���� `ApplicationListener` �ķ����� `createApplicationListener`�������õ��� `ApplicationListenerMethodAdapter` �Ĺ��췽����

���Ǽ����� `ApplicationListenerMethodAdapter`��

```
public class ApplicationListenerMethodAdapter implements GenericApplicationListener {

    ...

    public ApplicationListenerMethodAdapter(String beanName, Class<?> targetClass, Method method) {
        this.beanName = beanName;
        // ������
        this.method = BridgeMethodResolver.findBridgedMethod(method);
        this.targetMethod = (!Proxy.isProxyClass(targetClass) ?
                AopUtils.getMostSpecificMethod(method, targetClass) : this.method);
        this.methodKey = new AnnotatedElementKey(this.targetMethod, targetClass);

        EventListener ann = AnnotatedElementUtils
                .findMergedAnnotation(this.targetMethod, EventListener.class);
        // ����֧�ֵ��¼�
        this.declaredEventTypes = resolveDeclaredEventTypes(method, ann);
        // ע��ָ��������
        this.condition = (ann != null ? ann.condition() : null);
        this.order = resolveOrder(this.targetMethod);
    }

    ...
}

```

`ApplicationListenerMethodAdapter` �Ĺ��췽������һ�ѵĸ�ֵ���������������ص�����ע���¼��Ĵ���

```
public class ApplicationListenerMethodAdapter implements GenericApplicationListener {

    ...

    /**
     * ���������ܼ������¼�����
     */
    private static List<ResolvableType> resolveDeclaredEventTypes(Method method, 
            @Nullable EventListener ann) {
        // �������ֻ����һ���������������¼������� @EventListener ָ��
        int count = method.getParameterCount();
        if (count > 1) {
            throw new IllegalStateException(
                    "Maximum one parameter is allowed for event listener method: " + method);
        }

        if (ann != null) {
            // �¼�����ָ���������ȡ���� classes ����ֵ
            Class<?>[] classes = ann.classes();
            if (classes.length > 0) {
                List<ResolvableType> types = new ArrayList<>(classes.length);
                for (Class<?> eventType : classes) {
                    types.add(ResolvableType.forClass(eventType));
                }
                return types;
            }
        }

        if (count == 0) {
            throw new IllegalStateException(
                    "Event parameter is mandatory for event listener method: " + method);
        }
        return Collections.singletonList(ResolvableType.forMethodParameter(method, 0));
    }
}

```

�Ӵ�����Եó����½��ۣ�

1.  �� `@EventListener` ��ǵķ������������ֻ����һ��
2.  �����ܼ������¼������ж������ `@EventListener` ָ��

#### 5.2 `TransactionalEventListenerFactory`

������������������ `TransactionalEventListenerFactory`��

```
public class TransactionalEventListenerFactory implements EventListenerFactory, Ordered {

    ...

    /**
     * ֻ֧�ֱ���� @TransactionalEventListener ע��ķ���
     */
    @Override
    public boolean supportsMethod(Method method) {
        return AnnotatedElementUtils.hasAnnotation(method, TransactionalEventListener.class);
    }

    /**
     * �����Ķ����� ApplicationListenerMethodTransactionalAdapter
     */
    @Override
    public ApplicationListener<?> createApplicationListener(String beanName, 
            Class<?> type, Method method) {
        return new ApplicationListenerMethodTransactionalAdapter(beanName, type, method);
    }
}

```

�Ӵ���������`TransactionalEventListenerFactory` �� `DefaultEventListenerFactory` ������£�

*   `ApplicationListenerMethodTransactionalAdapter` ֻ֧�ֱ���� `@TransactionalEventListener` �ķ�����
*   ������ `ApplicationListener` ʵ������Ϊ `ApplicationListenerMethodTransactionalAdapter`��

������������ `@TransactionalEventListener` �Ǹ�ɶ��

```
@Target({ElementType.METHOD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
/**
 * ����� @EventListener ע��
 */
@EventListener
public @interface TransactionalEventListener {
    /**
     * ������
     */
    TransactionPhase phase() default TransactionPhase.AFTER_COMMIT;

    /**
     * ������
     */
    boolean fallbackExecution() default false;

    /**
     * ָ�������¼�
     */
    @AliasFor(annotation = EventListener.class, attribute = "classes")
    Class<?>[] value() default {};

    /**
     * ָ�������¼�
     */
    @AliasFor(annotation = EventListener.class, attribute = "classes")
    Class<?>[] classes() default {};

    /**
     * ָ������
     */
    String condition() default "";
}

```

���Կ��������ע������ `@EventListener`����˾����� `@EventListener` ��ͬ�Ĺ��ܡ����⣬�� `@EventListener` ��ȣ������������ԣ�`phase()` �� `fallbackExecution()`��������������������ġ�

�˽��� `TransactionalEventListener` ֮�������������� `ApplicationListenerMethodTransactionalAdapter`��

```
/**
 * �̳��� ApplicationListenerMethodAdapter
 */
class ApplicationListenerMethodTransactionalAdapter extends ApplicationListenerMethodAdapter {
    ...

    private final TransactionalEventListener annotation;

    public ApplicationListenerMethodTransactionalAdapter(String beanName, 
            Class<?> targetClass, Method method) {
        // ���ø���ķ���
        super(beanName, targetClass, method);
        // �����ע���� @TransactionalEventListener
        TransactionalEventListener ann = AnnotatedElementUtils
                .findMergedAnnotation(method, TransactionalEventListener.class);
        if (ann == null) {
            throw new IllegalStateException(...);
        }
        this.annotation = ann;
    }

    ...
}

```

�Ӵ�����������`ApplicationListenerMethodTransactionalAdapter` �̳��� `ApplicationListenerMethodAdapter`���乹�췽��Ҳ���ȵ��� `ApplicationListenerMethodAdapter` �Ĺ��췽����Ȼ���ٸ� `annotation` ��ֵ��

### 6\. �¼�����

�����������������¼��ļ���������

#### 6.1 `ApplicationListenerMethodAdapter` �����¼�

��ǰ��������У�����֪�� `ApplicationListener` Ҫ����һ���¼��������������������

1.  �жϵ�ǰ `ApplicationListener` �Ƿ�֧�ֵ�ǰ�¼�
2.  ���֧�֣�������¼�����

���������� `ApplicationListenerMethodAdapter` ��������������

```
public class ApplicationListenerMethodAdapter implements GenericApplicationListener {

    ...

    /**
     * ��ǰ listener �Ƿ�֧�ִ�����¼�.
     * ʹ�õķ����� ResolvableType#isAssignableFrom(ResolvableType)�����Խ��÷��������
     * Ϊ�Ƕ� Class#isAssignableFrom ���ܵ���չ
     */
    @Override
    public boolean supportsEventType(ResolvableType eventType) {
        for (ResolvableType declaredEventType : this.declaredEventTypes) {
            if (declaredEventType.isAssignableFrom(eventType)) {
                return true;
            }
            if (PayloadApplicationEvent.class.isAssignableFrom(eventType.toClass())) {
                ResolvableType payloadType = eventType
                        .as(PayloadApplicationEvent.class).getGeneric();
                if (declaredEventType.isAssignableFrom(payloadType)) {
                    return true;
                }
            }
        }
        return eventType.hasUnresolvableGenerics();
    }

    /**
     * �¼�����
     */
    @Override
    public void onApplicationEvent(ApplicationEvent event) {
        processEvent(event);
    }

    public void processEvent(ApplicationEvent event) {
        // ��������
        Object[] args = resolveArguments(event);
        // shouldHandle���ж��������� EventListener.condition() �ṩ
        if (shouldHandle(event, args)) {
            // ������÷���
            Object result = doInvoke(args);
            if (result != null) {
                // ����ִ�н���������صĽ�������¼�������ȥ
                handleResult(result);
            }
            else {
                logger.trace("No result object given - no result to handle");
            }
        }
    }

}

```

���Կ������жϵ�ǰ��ǰ `ApplicationListener` �Ƿ�֧�ֵ�ǰ�¼�ʱ��ʹ�õ��� `ResolvableType#isAssignableFrom(ResolvableType)`����������������Ĳ�������������������Լ򵥵ؽ��÷������Ϊ�Ƕ� `Class#isAssignableFrom` ���ܵ���չ��

`ApplicationListenerMethodAdapter` �����¼��������������£�

1.  ����������������� `event` ת��Ϊ���������о����ֵ
2.  ͨ��������ñ� `@EventListener` ��ǵķ���
3.  ���� `@EventListener` �����ķ��ؽ������ `handleResult(...)` ��������Խ����صĽ�������¼��ٷ�����ȥ

���� `ApplicationListenerMethodAdapter` �����¼������ͷ����������ˡ�

#### 6.2 `ApplicationListenerMethodTransactionalAdapter` �����¼�

`ApplicationListenerMethodTransactionalAdapter` ���¼������� `ApplicationListenerMethodAdapter` Ҫ��һЩ��

```
/**
 * �̳��� ApplicationListenerMethodAdapter
 */
class ApplicationListenerMethodTransactionalAdapter extends ApplicationListenerMethodAdapter {

    ...

    // supportsEventType(...) Ҳ�Ǽ̳�������ķ�����������ʵ��

    /**
     * �¼�����
     */
    @Override
    public void onApplicationEvent(ApplicationEvent event) {
        // ������ڴ�������Ĳ����������л������о�
        if (TransactionSynchronizationManager.isSynchronizationActive()
                && TransactionSynchronizationManager.isActualTransactionActive()) {
            TransactionSynchronization transactionSynchronization 
                    = createTransactionSynchronization(event);
            TransactionSynchronizationManager.registerSynchronization(transactionSynchronization);
        }
        else if (this.annotation.fallbackExecution()) {
            // ���õ��Ǹ���ķ���
            processEvent(event);
        }
        else {
            // ֻ��log ��ӡ��ʡ��
            ...
        }
    }

    ...
}

```

�����ϴ���˵�����£�

1.  `ApplicationListenerMethodTransactionalAdapter` �� `ApplicationListenerMethodAdapter` �����࣬��̳����� `ApplicationListenerMethodAdapter` �ķ���
2.  `ApplicationListenerMethodTransactionalAdapter` ��û����д `supportsEventType(...)` ���������Ҳ��ʹ�� `ApplicationListenerMethodAdapter` �� `supportsEventType(...)` �������ж��¼���֧�����
3.  �ڴ����¼�ʱ��`ApplicationListenerMethodTransactionalAdapter` �����������صĴ�������Ĵ����߼����ľͲ�������

### 7\. �ܽ�

������Ҫ������ `@EventListener` �Ĵ������̣��ܽ����£�

1.  `@EventListener` ����ָ���������¼����¼����������
2.  ���� `@EventListener` ������ `EventListenerMethodProcessor`�������ѱ� `@EventListener` ��ǵķ���ת����һ�� `ApplicationListener` ����Ȼ����ӵ� `ApplicationContext` �ļ�������
3.  ����ת���� `ApplicationListener` ����Ĳ����� `EventListenerFactory` �ṩ��spring �ṩ������ `EventListenerFactory`��
    *   `DefaultEventListenerFactory`��spring Ĭ�ϵģ�ת���ɵ� `ApplicationListener` Ϊ `ApplicationListenerMethodAdapter`
    *   `TransactionalEventListenerFactory`��������������ģ�ת���ɵ� `ApplicationListener` Ϊ `ApplicationListenerMethodTransactionalAdapter`

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4926344](https://my.oschina.net/funcy/blog/4926344) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_