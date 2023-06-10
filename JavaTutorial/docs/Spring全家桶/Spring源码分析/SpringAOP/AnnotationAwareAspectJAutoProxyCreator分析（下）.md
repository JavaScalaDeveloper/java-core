[��һƪ����](https://my.oschina.net/funcy/blog/4678817 "��һƪ����")��Ҫ������ `AbstractAutoProxyCreator#postProcessAfterInitialization` �������������������� `AbstractAutoProxyCreator#postProcessAfterInitialization` ������

��������������������ĵ�������

```
|-AnnotationConfigApplicationContext
 |-AbstractApplicationContext#refresh
  |-AbstractApplicationContext#finishBeanFactoryInitialization
   |-ConfigurableListableBeanFactory#preInstantiateSingletons
    |-AbstractBeanFactory#getBean(String)
     |-AbstractBeanFactory#doGetBean
      |-DefaultSingletonBeanRegistry#getSingleton(String, ObjectFactory<?>)
       |-ObjectFactory#getObject
        |-AbstractBeanFactory#createBean
         |-AbstractAutowireCapableBeanFactory#doCreateBean
          |-AbstractAutowireCapableBeanFactory#initializeBean(String, Object, RootBeanDefinition)
           |-AbstractAutowireCapableBeanFactory#applyBeanPostProcessorsAfterInitialization
            |-AbstractAutoProxyCreator#postProcessAfterInitialization

```

ʵ������������ĵ��������� spring bean �Ĵ������̣����ǽ��� `AbstractAutoProxyCreator#postProcessAfterInitialization`��

```
@Override
public Object postProcessAfterInitialization(@Nullable Object bean, String beanName) {
    if (bean != null) {
        Object cacheKey = getCacheKey(bean.getClass(), beanName);
        if (this.earlyProxyReferences.remove(cacheKey) != bean) {
           // ����wrapIfNecessary()����
           return wrapIfNecessary(bean, beanName, cacheKey);
        }
    }
    return bean;
}

```

�������� `AbstractAutoProxyCreator#wrapIfNecessary`��

```
protected Object wrapIfNecessary(Object bean, String beanName, Object cacheKey) {
    //����Ѿ������
    if (StringUtils.hasLength(beanName) && this.targetSourcedBeans.contains(beanName)) {
        return bean;
    }
    //�����ǰ������ǿ�࣬����
    if (Boolean.FALSE.equals(this.advisedBeans.get(cacheKey))) {
        return bean;
    }

    // ��Ҫ����һ���жϵ�ǰ���Ƿ�Ϊ�����࣬�ô�������һƪ�����Ѿ������ˣ��Ͳ���˵��
    if (isInfrastructureClass(bean.getClass()) || shouldSkip(bean.getClass(), beanName)) {
        this.advisedBeans.put(cacheKey, Boolean.FALSE);
        return bean;
    }

    // ��Ҫ�������У������Ƿ�Ӧ�ñ�������ȡ��������ǿ
    Object[] specificInterceptors = getAdvicesAndAdvisorsForBean(bean.getClass(), beanName, null);
    //�����ȡ������ǿ����Ҫ�����ǿ��������
    if (specificInterceptors != DO_NOT_PROXY) {
        this.advisedBeans.put(cacheKey, Boolean.TRUE);
        // ��Ҫ����������������
        Object proxy = createProxy(
            bean.getClass(), beanName, specificInterceptors, new SingletonTargetSource(bean));
        this.proxyTypes.put(cacheKey, proxy.getClass());
        return proxy;
    }

    this.advisedBeans.put(cacheKey, Boolean.FALSE);
    return bean;
}

```

������� �����е㳤���������붼�������жϣ��� aop ���ܹ�ϵ���������й�ϵ�Ĵ���ֻ�����У�

```
// ��Ҫ����һ��
// 1\. isInfrastructureClass���жϵ�ǰ�Ƿ�Ϊaop����࣬
//    ��Advice/Pointcut/Advisor�ȵ����࣬�Ƿ���� @AspectJ��ע��
// 2\. shouldSkip���������������࣬�ж��Ƿ��ų�
if (isInfrastructureClass(bean.getClass()) || shouldSkip(bean.getClass(), beanName)) {
    ...
}

// ��Ҫ�������У������Ƿ�Ӧ�ñ�������ȡ��������ǿ
Object[] specificInterceptors = getAdvicesAndAdvisorsForBean(bean.getClass(), beanName, null);

// ��Ҫ����������������
Object proxy = createProxy(
    bean.getClass(), beanName, specificInterceptors, new SingletonTargetSource(bean));

```

����`��Ҫ����һ`����һƪ�����Ѿ�������������������Ҫ����`��Ҫ�����`��`��Ҫ������`��

### 1\. ��ȡ�����ǿ

> AbstractAdvisorAutoProxyCreator

```
@Override
@Nullable
protected Object[] getAdvicesAndAdvisorsForBean(
        Class<?> beanClass, String beanName, @Nullable TargetSource targetSource) {
    // ���ҷ�����������ǿ���������¿�
    List<Advisor> advisors = findEligibleAdvisors(beanClass, beanName);
    if (advisors.isEmpty()) {
        return DO_NOT_PROXY;
    }
    return advisors.toArray();
}

/**
 * ���ҷ�����������ǿ
 */
protected List<Advisor> findEligibleAdvisors(Class<?> beanClass, String beanName) {
    //��ȡ�����е�������ǿ������һƪ�������Ѿ���������
    List<Advisor> candidateAdvisors = findCandidateAdvisors();
    //��֤beanClass�Ƿ�ñ��������Ӧ�ã��򷵻����������bean����ǿ
    List<Advisor> eligibleAdvisors = findAdvisorsThatCanApply(candidateAdvisors, beanClass, beanName);
    extendAdvisors(eligibleAdvisors);
    if (!eligibleAdvisors.isEmpty()) {
        eligibleAdvisors = sortAdvisors(eligibleAdvisors);
    }
    return eligibleAdvisors;
}

/**
 * ��֤beanClass�Ƿ�ñ�����
 */
protected List<Advisor> findAdvisorsThatCanApply(
        List<Advisor> candidateAdvisors, Class<?> beanClass, String beanName) {
    ProxyCreationContext.setCurrentProxiedBeanName(beanName);
    try {
        // ��֤beanClass�Ƿ�ñ�����
        return AopUtils.findAdvisorsThatCanApply(candidateAdvisors, beanClass);
    }
    finally {
        ProxyCreationContext.setCurrentProxiedBeanName(null);
    }
}

```

spring �ķ������ñȽ��һ·׷�٣����յ��� `AopUtils.findAdvisorsThatCanApply` �������������¿���

> AopUtils

```
public static List<Advisor> findAdvisorsThatCanApply(List<Advisor> candidateAdvisors, Class<?> clazz) {
    if (candidateAdvisors.isEmpty()) {
        return candidateAdvisors;
    }
    List<Advisor> eligibleAdvisors = new ArrayList<>();
    // ���� candidateAdvisors���ж��Ƿ������������
    for (Advisor candidate : candidateAdvisors) {
        //������ǿ���ص㣬�����¿�
        if (candidate instanceof IntroductionAdvisor && canApply(candidate, clazz)) {
            eligibleAdvisors.add(candidate);
        }
    }
    boolean hasIntroductions = !eligibleAdvisors.isEmpty();
    for (Advisor candidate : candidateAdvisors) {
        if (candidate instanceof IntroductionAdvisor) {
            // already processed
            continue;
        }
        //����ͨbean�Ĵ���
        if (canApply(candidate, clazz, hasIntroductions)) {
            eligibleAdvisors.add(candidate);
        }
    }
    return eligibleAdvisors;
}

/**
 * �ж��Ƿ���Ҫ��ǿ
 */
public static boolean canApply(Advisor advisor, Class<?> targetClass) {
    // ������һ������
    return canApply(advisor, targetClass, false);
}

/**
 * �ж��Ƿ���Ҫ��ǿ
 */
public static boolean canApply(Advisor advisor, Class<?> targetClass, boolean hasIntroductions) {
    //��������ų�������
    if (advisor instanceof IntroductionAdvisor) {
        return ((IntroductionAdvisor) advisor).getClassFilter().matches(targetClass);
    }
    else if (advisor instanceof PointcutAdvisor) {
        PointcutAdvisor pca = (PointcutAdvisor) advisor;
        //����÷�������
        return canApply(pca.getPointcut(), targetClass, hasIntroductions);
    }
    else {
        // It doesn't have a pointcut so we assume it applies.
        return true;
    }
}

/**
 * �ж��Ƿ���Ҫ��ǿ
 */
public static boolean canApply(Pointcut pc, Class<?> targetClass, boolean hasIntroductions) {
    Assert.notNull(pc, "Pointcut must not be null");
    //�е����Ƿ�����ų��������
    if (!pc.getClassFilter().matches(targetClass)) {
        return false;
    }
    //��֤ע����������Ƿ���������ڷ�����
    MethodMatcher methodMatcher = pc.getMethodMatcher();
    if (methodMatcher == MethodMatcher.TRUE) {
        // No need to iterate the methods if we're matching any method anyway...
        return true;
    }

    IntroductionAwareMethodMatcher introductionAwareMethodMatcher = null;
    if (methodMatcher instanceof IntroductionAwareMethodMatcher) {
        introductionAwareMethodMatcher = (IntroductionAwareMethodMatcher) methodMatcher;
    }

    // classes����targetClass����Object�����и��ࡢ���нӿ�
    Set<Class<?>> classes = new LinkedHashSet<>();
    if (!Proxy.isProxyClass(targetClass)) {
        classes.add(ClassUtils.getUserClass(targetClass));
    }
    classes.addAll(ClassUtils.getAllInterfacesForClassAsSet(targetClass));

    // ѭ���жϷ����Ƿ���Ҫ����
    // ������Կ�����
    // 1\. ֻҪһ�������������Ҫ����ô������ͻᱻ����
    // 2\. ��������з�����Ҫ��������ô����Ҳ�ᱻ����
    for (Class<?> clazz : classes) {
         // ��ȡ clazz ����ķ���
         // ������ǰ��ķ�������Object������и��෽�����ӿڵ�Ĭ�Ϸ���
        Method[] methods = ReflectionUtils.getAllDeclaredMethods(clazz);
        for (Method method : methods) {
            //��ȡ����ʵ�ֵ����нӿں�������㼶�ķ�����ѭ����֤
            if (introductionAwareMethodMatcher != null ?
                introductionAwareMethodMatcher.matches(method, targetClass, hasIntroductions) :
                methodMatcher.matches(method, targetClass)) {
                return true;
            }
        }
    }

    return false;
}

```

������������Ͼ��˽��� spring ��������ж�һ�������Ƿ���Ҫ������ģ������ܽ��������£�

1.  ��ȡ����Ŀ�����е�������󣬽����е����淽����װΪһ�� `List<Advisor>`�������������һƪ����������ϸ������
2.  ���� `Advisor`����ÿһ�� `Advisor`�����÷����ȡ��ǰ��ĳ� `Object` ������и��༰�ӿڣ����Ϊ `Set<Class>`��
3.  ���� `Set<Class>`��������ÿһ�� `Class`�����÷����ȡ�� `Class` �������� Object ������и���ķ������ӿڵ�Ĭ�Ϸ��������Ϊ `Method[]`;
4.  ���� `Method[]`�������һ�� `method` ���� `Advisor` ���������������ʾ��ǰ `Advisor` ����Ӧ�õ���ǰ bean���� bean ����Ҫ��������һ�����յõ��Ľ��Ҳ��һ�� `List<Advisor>`����ʾ���ж�� `Advisor` ��ҪӦ�õ��ö���

α���������ڣ�

```
// 1\. ��ȡ���е�Advisor
List<Advisor> advisorList = getAdvisorList();
// 2\. ����Advisor
for(Advisor advisor : advisorList) {
    // ��ȡ��ǰ��ĳ�`Object`������и��༰�ӿڣ�classSetҲ����targetClass
    Set<Class> classSet = getSuperClassAndInterfaces(targetClass);
    for(Class cls : classSet) {
        // ����cls�ж���ķ�����������ǰ��ķ�������Object������и��෽�����ӿڵ�Ĭ�Ϸ���
        Method[] methods = ReflectionUtils.getAllDeclaredMethods(clazz);
        //  ������Щ����
        for (Method method : methods) {
             // �ж�method�Ƿ�������������
        }
    }
}

```

�õ� `List<Advisor>` �󣬽��������Ǹ��� `List<Advisor>` ��������������ˡ�

### 2\. �����������

���������� spring ���������������̡�

> `AbstractAutoProxyCreator#wrapIfNecessary`��

```
protected Object wrapIfNecessary(Object bean, String beanName, Object cacheKey) {
    ...
    if (specificInterceptors != DO_NOT_PROXY) {
        this.advisedBeans.put(cacheKey, Boolean.TRUE);
        // ���������������ﴴ����
        // - specificInterceptors������Ӧ�õ��ö����  Advisor��
        //    specificInterceptors�Ļ�ȡ���̣���һ�����Ѿ���ϸ�������ˣ�����׸����
        // - SingletonTargetSource����ԭʼ�����һ����װ
        Object proxy = createProxy(
            bean.getClass(), beanName, specificInterceptors, 
                        new SingletonTargetSource(bean));
        this.proxyTypes.put(cacheKey, proxy.getClass());
        return proxy;
    }
    this.advisedBeans.put(cacheKey, Boolean.FALSE);
    return bean;
}

```

������������ `SingletonTargetSource`��

```
public class SingletonTargetSource implements TargetSource, Serializable {

    private static final long serialVersionUID = 9031246629662423738L;

    private final Object target;

    public SingletonTargetSource(Object target) {
        Assert.notNull(target, "Target object must not be null");
        this.target = target;
    }

    @Override
    public Class<?> getTargetClass() {
        return this.target.getClass();
    }

    @Override
    public Object getTarget() {
        return this.target;
    }

    ...
}

```

��������ܼ򵥣����Ƕ�ԭʼ��������һ���װ���������¿���

> AbstractAutoProxyCreator#createProxy

```
protected Object createProxy(Class<?> beanClass, @Nullable String beanName,
        @Nullable Object[] specificInterceptors, TargetSource targetSource) {

    if (this.beanFactory instanceof ConfigurableListableBeanFactory) {
        AutoProxyUtils.exposeTargetClass((ConfigurableListableBeanFactory) 
            this.beanFactory, beanName, beanClass);
    }

    ProxyFactory proxyFactory = new ProxyFactory();
    //ʹ��proxyFactory����copy��ǰ���е��������
    proxyFactory.copyFrom(this);

    // �ж��Ƿ�ʹ��Cglib��̬����������ע����ָ����
    // @EnableAspectJAutoProxy(proxyTargetClass = true)
    if (!proxyFactory.isProxyTargetClass()) {
        // ��� beanFactory �� ConfigurableListableBeanFactory��
        // ����� BeanDefinition �������ԣ���������ĳһ����ʹ�� cglib ����
        if (shouldProxyTargetClass(beanClass, beanName)) {
            proxyFactory.setProxyTargetClass(true);
        }
        else {
            // ���û�����ÿ���, ���ж�bean�Ƿ��к��ʵĽӿ�ʹ��JDK�Ķ�̬����
            // ע�⣺JDK��̬��������Ǵ��нӿڵ���
            // �����û��ʵ���κνӿ���ֻ��ʹ��Cglib��̬����
            evaluateProxyInterfaces(beanClass, proxyFactory);
        }
    }

    // ����Advisor�������������������
    // 1\. ��ӹ����� Interceptor
    // 2\. ���ڸ�����advisor���ж������ͣ�Ȼ��ת��Ϊ���������
    Advisor[] advisors = buildAdvisors(beanName, specificInterceptors);
    //���������ǿ
    proxyFactory.addAdvisors(advisors);
    //����Ҫ�������
    proxyFactory.setTargetSource(targetSource);
    //Spring��һ����չ�㣬Ĭ��ʵ��Ϊ�ա�������������Ҫ�Դ���������������ʱ��ʵ��
    customizeProxyFactory(proxyFactory);

    proxyFactory.setFrozen(this.freezeProxy);
    if (advisorsPreFiltered()) {
        proxyFactory.setPreFiltered(true);
    }
    //ʹ�ô�������ȡ�������
    return proxyFactory.getProxy(getProxyClassLoader());
}

```

�� `@EnableAspectJAutoProxy` ע���У�����ʹ�� `proxyTargetClass = true` ��������Ŀʹ�� `cglib` �������ڴ�����Ҳ�����֣�

```
// ֻ����proxyFactory.isProxyTargetClass()Ϊfalseʱ���Ż����������ж�
// ����֮���� @EnableAspectJAutoProxy(proxyTargetClass = true) ʱ
// ����Ĵ����ǲ������еģ�Ĭ��ʹ�þ���cglib����
if (!proxyFactory.isProxyTargetClass()) {
    // �ж���û�� BeanDefinition ������ʹ�� cglib����
    if (shouldProxyTargetClass(beanClass, beanName)) {
        proxyFactory.setProxyTargetClass(true);
    }
    else {
        // �Ƿ��������ӿڵ����������Ƿ�����jdk��̬���������
        evaluateProxyInterfaces(beanClass, proxyFactory);
    }
}

```

spring ������ж�һ�����Ƿ����� jdk ��̬������������أ�����������֪����˵��ʵ���˽ӿڣ��Ϳ���ʹ�ö�̬���������ֻ��ʹ�� cglib �������������� spring ������жϵģ�

> ProxyProcessorSupport#evaluateProxyInterfaces

```
/**
 * �ж��Ƿ���ʹ��jdk��̬����
 */
protected void evaluateProxyInterfaces(Class<?> beanClass, ProxyFactory proxyFactory) {
    // ��ȡ������нӿ�
    Class<?>[] targetInterfaces = ClassUtils.getAllInterfacesForClass(beanClass, getProxyClassLoader());
    boolean hasReasonableProxyInterface = false;
    for (Class<?> ifc : targetInterfaces) {
        // 1.isConfigurationCallbackInterface: �ж�ifc�Ƿ�ΪInitializingBean��DisposableBean��
        //   Closeable��AutoCloseable���Լ����� Aware
        // 2.isInternalLanguageInterface: �Ƿ�Ϊ�ڲ����Խӿڣ���groovy��mock��
        // 3.ifc.getMethods().length > 0���ӿڵķ������������1
        if (!isConfigurationCallbackInterface(ifc) && !isInternalLanguageInterface(ifc) &&
                ifc.getMethods().length > 0) {
            hasReasonableProxyInterface = true;
            break;
        }
    }
    if (hasReasonableProxyInterface) {
         // ��Ҫ�����еĽӿڶ����õ�proxyFactory
         // ����һ�£����һ����A ʵ���˽ӿ� I1 �� I2��
         // �����A�Ķ���a  �йܵ���spring��������ô������ʹ�� beanFactory.get(I1.class)��
         // ���� beanFactory.get(I1.class)����Ӧ���ܻ�ȡ��a.
         for (Class<?> ifc : targetInterfaces) {
             proxyFactory.addInterface(ifc);
         }
    }
    else {
        proxyFactory.setProxyTargetClass(true);
    }
}

```

��Դ����������spring �ж��Ƿ���ʹ�� jdk ��̬����Ĺ�����������֪�ϵĲ�࣬����������ʵ��������ӿھ���ʹ�� jdk ��̬����spring ���ų� `InitializingBean`��`DisposableBean`��`Closeable`��`AutoCloseable` �Ƚӿڣ�ͬʱҲ���ų����κη����Ľӿڡ�

������ spring ����ж��Ƿ�ʹ�� jdk ��̬����󣬽ӿ����������� spring ����δ����������ġ�Ϊ��˵�����⣬���ȼ��� `AbstractAutoProxyCreator#createProxy`��

```
protected Object createProxy(Class<?> beanClass, @Nullable String beanName,
        @Nullable Object[] specificInterceptors, TargetSource targetSource) {
    // ʡ��һЩ����
    ...
    ProxyFactory proxyFactory = new ProxyFactory();
    //ʹ��proxyFactory����copy��ǰ���е��������
    proxyFactory.copyFrom(this);
    // ����ʡ���˺ö���ж�
    proxyFactory.setProxyTargetClass(true);
    //���������ǿ
    proxyFactory.addAdvisors(advisors);
    //����Ҫ�������
    proxyFactory.setTargetSource(targetSource);
    ...
    //ʹ�ô�������ȡ�������
    return proxyFactory.getProxy(getProxyClassLoader());
}

```

��������Կ������������������һ�� `ProxyFactory` ����Ȼ�����ö����������������һЩֵ���������¿���

> ProxyFactory#getProxy(java.lang.ClassLoader)

```
public Object getProxy(@Nullable ClassLoader classLoader) {
    return createAopProxy().getProxy(classLoader);
}

```

����������������`createAopProxy()` �� `getProxy(classLoader)`������������ `createAopProxy()`��

> ProxyCreatorSupport#createAopProxy

```
protected final synchronized AopProxy createAopProxy() {
    if (!this.active) {
         activate();
    }
    return getAopProxyFactory().createAopProxy(this);
}

```

������

> DefaultAopProxyFactory#createAopProxy

```
/**
 * �жϴ�������
 * �����ʹ��jdk��̬�����ͷ��� JdkDynamicAopProxy
 * ����ͷ��� ObjenesisCglibAopProxy
 */
public AopProxy createAopProxy(AdvisedSupport config) throws AopConfigException {
    if (config.isOptimize() || config.isProxyTargetClass() || hasNoUserSuppliedProxyInterfaces(config)) {
        Class<?> targetClass = config.getTargetClass();
        if (targetClass == null) {
            throw new AopConfigException(...);
        }
        if (targetClass.isInterface() || Proxy.isProxyClass(targetClass)) {
            return new JdkDynamicAopProxy(config);
        }
        return new ObjenesisCglibAopProxy(config);
    }
    else {
        return new JdkDynamicAopProxy(config);
    }
}

```

��������Ǿ������ף�`JdkDynamicAopProxy` ���������� jdk ��̬����ģ�`ObjenesisCglibAopProxy` ���������� cglib ����ġ������������������� `getProxy(classLoader)` ������

> JdkDynamicAopProxy#getProxy(java.lang.ClassLoader)

```
@Override
public Object getProxy(@Nullable ClassLoader classLoader) {
    Class<?>[] proxiedInterfaces = AopProxyUtils
            .completeProxiedInterfaces(this.advised, true);
    // �Ƿ���equals()��hashCode()����
    findDefinedEqualsAndHashCodeMethods(proxiedInterfaces);
    // ���� jdk ���� ��������
    return Proxy.newProxyInstance(classLoader, proxiedInterfaces, this);
}

```

��������������õ��Ĵ��������ʲô���ģ�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-ee46c03d86755b936862c9e8cde266fca1e.png)

���Կ������������� `h` ���Ա���ľ��� `JdkDynamicAopProxy` ����`JdkDynamicAopProxy` ����� `advised` ���Ա����˴���Ĵ���������Ϣ��

> CglibAopProxy#getProxy(java.lang.ClassLoader)

```
public Object getProxy(@Nullable ClassLoader classLoader) {
    try {
        Class<?> rootClass = this.advised.getTargetClass();
        Assert.state(rootClass != null, "xxx");

        Class<?> proxySuperClass = rootClass;
        if (rootClass.getName().contains(ClassUtils.CGLIB_CLASS_SEPARATOR)) {
            proxySuperClass = rootClass.getSuperclass();
            Class<?>[] additionalInterfaces = rootClass.getInterfaces();
            for (Class<?> additionalInterface : additionalInterfaces) {
                this.advised.addInterface(additionalInterface);
            }
        }

        validateClassIfNecessary(proxySuperClass, classLoader);

        // ���� Enhancer ���󣬲�setһЩ����
        Enhancer enhancer = createEnhancer();
        if (classLoader != null) {
            enhancer.setClassLoader(classLoader);
            if (classLoader instanceof SmartClassLoader &&
                    ((SmartClassLoader) classLoader).isClassReloadable(proxySuperClass)) {
                enhancer.setUseCache(false);
            }
        }
        // Superclass����Ҫ�������
        enhancer.setSuperclass(proxySuperClass);
        // ���ýӿڣ��� SpringProxy��Advised
        enhancer.setInterfaces(AopProxyUtils.completeProxiedInterfaces(this.advised));
        enhancer.setNamingPolicy(SpringNamingPolicy.INSTANCE);
        enhancer.setStrategy(new ClassLoaderAwareGeneratorStrategy(classLoader));

        Callback[] callbacks = getCallbacks(rootClass);
        Class<?>[] types = new Class<?>[callbacks.length];
        for (int x = 0; x < types.length; x++) {
            types[x] = callbacks[x].getClass();
        }
        enhancer.setCallbackFilter(new ProxyCallbackFilter(
                this.advised.getConfigurationOnlyCopy(), 
                this.fixedInterceptorMap, this.fixedInterceptorOffset));
        enhancer.setCallbackTypes(types);

        return createProxyClassAndInstance(enhancer, callbacks);
    }
    catch (CodeGenerationException | IllegalArgumentException ex) {
        throw new AopConfigException(...);
    }
    catch (Throwable ex) {
        throw new AopConfigException("Unexpected AOP exception", ex);
    }
}

```

spring ʹ�� cglib ����������Ҫ�õ��� `Enhancer` �࣬������һ�������ٷ�����

�������Ҳ������������õ��Ķ���

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-97d647a818f62fa0979dabd58f3aa19e473.png)

### 3\. �ܽ�

������Ҫ������ `AbstractAutoProxyCreator#postProcessAfterInitialization`���÷�����Ҫ���������£�

1.  ��ȡ��Ŀ�����������࣬���е㷽����װΪ `List`��ʵ���ϣ���һ���Ĳ���Ҳ���� `AbstractAutoProxyCreator#postProcessBeforeInitialization` ��ִ�У�Ȼ�󽫽����������������һ����ʵ��ֱ���ڻ������ý����
2.  ��ȡ��ǰ�����������ǿ����һ�������ж���Щ��ǿ�������ڵ�ǰ�����ж�ʱ�Ȼ�ȡ��ǰ������нӿ��벻���� Object �ĸ��࣬Ȼ����һ�ж���Щ�ӿ������еķ����Ƿ�������ǿ������ֻҪ��һ���������㣬�ͱ�ʾ��ǰ������Ҫ������
3.  ����������󣺴����������ʱ��Ĭ������£�������Ƿ�ʵ���˽ӿ���ѡ��ʹ�� jdk ��̬������ cglib����Ӧ���ڵ�ǰ bean �� `List` Ҳ���װ����������С�

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4687961](https://my.oschina.net/funcy/blog/4687961) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_