�� [spring ����֮��ʶ�������](https://my.oschina.net/funcy/blog/4773454)һ���У�����ͨ��һ�� demo ��ʾ�����ʹ�� spring ��������ܣ�Ȼ������� `@EnableTransactionManagement` ע��Ĺ��ܣ����Ľ��������� spring ������ش��롣

### 1\. ������󴴽�����

spring ����������ǻ��� aop �ģ�ʹ�ô�����������������һϵ�в��������Ľ�ͨ�����Եķ�ʽ�������������Ĵ������̡�

�� [spring ����֮��ʶ�������](https://my.oschina.net/funcy/blog/4773454)������ͨ������ `@EnableTransactionManagement` ע�⣬���ָ�ע����� spring ������ע�� `InfrastructureAdvisorAutoProxyCreator`��������� `AbstractAdvisorAutoProxyCreator` �����࣬�������ɴ������ģ����ڽ����� `InfrastructureAdvisorAutoProxyCreator` ����������Ĵ������̡�

> ���� `AbstractAdvisorAutoProxyCreator` �ķ����Լ������������ɣ��� [spring aop ֮ AnnotationAwareAspectJAutoProxyCreator �������ϣ�](https://my.oschina.net/funcy/blog/4678817) �� [spring aop ֮ AnnotationAwareAspectJAutoProxyCreator �������£�](https://my.oschina.net/funcy/blog/4687961)�Ѿ�������ϸ����������������Ҫ������ aop �в���ĵط�����Ҫ��ϸ�˽� spring aop ���������β�����С��飬�����Ķ�������ƪ���¡�

���������ǽ��� `AbstractAutoProxyCreator#postProcessBeforeInitialization`��

```
public Object postProcessBeforeInstantiation(Class<?> beanClass, String beanName) {
    ...
    if (...) {
        //1\. shouldSkip:
        // - AspectJAwareAdvisorAutoProxyCreator �� shouldSkip �����ᴦ�� @Aspect ע����࣬
        //   �����е�@Before/@After/@Around��ע���װΪAdvisor���ٵ��ø���(Ҳ����
        //   AbstractAutoProxyCreator)��shouldSkip����
        // - InfrastructureAdvisorAutoProxyCreatorֱ��ִ��AbstractAutoProxyCreator��shouldSkip����
        if (isInfrastructureClass(beanClass) || shouldSkip(beanClass, beanName)) {
            this.advisedBeans.put(cacheKey, Boolean.FALSE);
            return null;
        }
    }
    if(...)  {
        ...

        // 2\. getAdvicesAndAdvisorsForBean����ȡ�������ڵ�ǰ�����advisor
        Object[] specificInterceptors = getAdvicesAndAdvisorsForBean(
            beanClass, beanName, targetSource);
        Object proxy = createProxy(beanClass, beanName, specificInterceptors, targetSource);
        ...
        return proxy;
    }
    return null;
}

```

���������������ͬ�㣬�������Ѿ�ע�������еĲ��죬���� `shouldSkip`��ûɶ��˵�ģ������ص�չ�� `getAdvicesAndAdvisorsForBean(...)` ������

#### 1.1 `BeanFactoryAdvisorRetrievalHelper#findAdvisorBeans`

һ·���� `getAdvicesAndAdvisorsForBean(...)` ���������еĲ����� `AspectJAwareAdvisorAutoProxyCreator` �Ĳ�������̫�����𣬲����и�����������Ϊ��Ҫǿ���£��������£�

> BeanFactoryAdvisorRetrievalHelper#findAdvisorBeans

```
public List<Advisor> findAdvisorBeans() {
    String[] advisorNames = this.cachedAdvisorBeanNames;
    if (advisorNames == null) {
        // ���ҵ�ǰbeanFactory������ Advisor �� bean class
        // Advisor�������û�ʵ��Advisor��ؽӿڣ�Ҳ������xmlָ����
        advisorNames = BeanFactoryUtils.beanNamesForTypeIncludingAncestors(
                this.beanFactory, Advisor.class, true, false);
        this.cachedAdvisorBeanNames = advisorNames;
    }
    ...
    List<Advisor> advisors = new ArrayList<>();
    for (String name : advisorNames) {
        ...
        // ����advisor��bean name����spring�����л�ȡ bean
        advisors.add(this.beanFactory.getBean(name, Advisor.class));
        ...
    }
    ...
    return advisors;
}

```

���������Ҫ�������ǻ�ȡ spring �����е����� `advisor`����ʵ�� `AnnotationAwareAspectJAutoProxyCreator` ��Ҳ����ô��ȡ�ģ�ֻ�����ڻ�ȡǰ��`AnnotationAwareAspectJAutoProxyCreator` ���� `shouldSkip(...)` �����а� `@Aspect` ���а��� `@Befor/@After/@Around` ��ע��ķ�����װ�ɶ�Ӧ�� `Advisor`���� `InfrastructureAdvisorAutoProxyCreator` �򲻻ᣬ����һ��ʼҲ�ᵽ���ˡ�

�� [spring ����֮��ʶ�������](https://my.oschina.net/funcy/blog/4773454)һ���У����� `@EnableTransactionManagement` ע�⹦��ʱ�����Ƿ�������ע���ͨ�� `@Bean` ע���� spring ������ `BeanFactoryTransactionAttributeSourceAdvisor`����� bean �ͻ��� `BeanFactoryAdvisorRetrievalHelper#findAdvisorBeans` ����ȡ����

#### 1.2 `AopUtils#canApply(...)`

���ŷ���һ·�����ߣ����ž��������ж� `advisor` �ܷ�������Ŀ�� `class` �ĵط��ˣ�

```
/**
 * �ж�advisor�ܷ�������Ŀ��class
 */
public static boolean canApply(Advisor advisor, Class<?> targetClass, boolean hasIntroductions) {
    ...
    // �ж��Ƿ�Ϊ PointcutAdvisor�����������advisorΪBeanFactoryTransactionAttributeSourceAdvisor��
    // ��ʵ����PointcutAdvisor���������Ĵ����ִ��
    else if (advisor instanceof PointcutAdvisor) {
        PointcutAdvisor pca = (PointcutAdvisor) advisor;
        //ʹ�� PointcutAdvisor �����ж�
        return canApply(pca.getPointcut(), targetClass, hasIntroductions);
    }
    ...
}

/**
 * �ж�advisor�ܷ�������Ŀ��class
 */
public static boolean canApply(Pointcut pc, Class<?> targetClass, boolean hasIntroductions) {
    Assert.notNull(pc, "Pointcut must not be null");
    //1\. �е����Ƿ�����ų��������
    if (!pc.getClassFilter().matches(targetClass)) {
        return false;
    }
    // ��ȡ����ƥ�����MethodMatcher.TRUE ΪĬ�ϵ� MethodMatcher ����
    MethodMatcher methodMatcher = pc.getMethodMatcher();
    if (methodMatcher == MethodMatcher.TRUE) {
        return true;
    }
    ...
    // classes����targetClass����Object�����и��ࡢ���нӿ�
    Set<Class<?>> classes = new LinkedHashSet<>();
    // ʡ�Ի�ȡtargetClass�ĸ��ಽ��
    ...
    for (Class<?> clazz : classes) {
        // ��ȡ clazz ����ķ�����������ǰ��ķ�������Object������и��෽�����ӿڵ�Ĭ�Ϸ���
        Method[] methods = ReflectionUtils.getAllDeclaredMethods(clazz);
        for (Method method : methods) {
            // 2\. ƥ��Ĺؼ�������
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

��һ��Ĵ����� `AnnotationAwareAspectJAutoProxyCreator` һģһ�������Ƕ��ǵ���ͬ���ķ������жϣ������ڴ���ĵ� `advisor` ��ͬ�����յ��õ��ľ����ƥ�����Ҳ����ͬ��

�Ӵ���ķ���������ƥ����߼����� `Pointcut` �У��� `Pointcut` �������� `Advisor`���ɼ� `Advisor` ʮ�ֹؼ������������ `Advisor` Ϊ `BeanFactoryTransactionAttributeSourceAdvisor`�����������Ǿ�����������ࡣ

#### 1.3 `BeanFactoryTransactionAttributeSourceAdvisor` ƥ��������

����һС �ڵķ����У�����֪���ж� `targetClass` �ܷ�Ӧ�õ�ǰ `advisor` �Ĺ�����Դ�� `advisor` �� `pointcut`��`pointcut` �������ط��������жϹ���

*   ƥ���ࣺ`pc.getClassFilter().matches(targetClass)`
*   ƥ�䷽����`pc.getMethodMatcher().matches(method, targetClass)`

��һС �����Ǵ� `BeanFactoryTransactionAttributeSourceAdvisor` ���֣�һ��������ƥ�����

```
public class BeanFactoryTransactionAttributeSourceAdvisor 
        extends AbstractBeanFactoryPointcutAdvisor {

    @Nullable
    private TransactionAttributeSource transactionAttributeSource;

    /**
     * ������� pointcut
     */
    private final TransactionAttributeSourcePointcut pointcut = 
            new TransactionAttributeSourcePointcut() {
        @Override
        @Nullable
        protected TransactionAttributeSource getTransactionAttributeSource() {
            return transactionAttributeSource;
        }
    };

    /**
     * ���� transactionAttributeSource
     */
    public void setTransactionAttributeSource(TransactionAttributeSource 
            transactionAttributeSource) {
        this.transactionAttributeSource = transactionAttributeSource;
    }

    /**
     * ���� ClassFilter
     */
    public void setClassFilter(ClassFilter classFilter) {
        this.pointcut.setClassFilter(classFilter);
    }

    /**
     * ��ȡ pointcut
     */
    @Override
    public Pointcut getPointcut() {
        return this.pointcut;
    }
}

```

����Ĵ���ؼ������Ѿ�ע���ˣ��������ܽ��£�`BeanFactoryTransactionAttributeSourceAdvisor#getPointcut` �õ��� `pointcut` Ϊ `TransactionAttributeSourcePointcut`�������� `private final TransactionAttributeSourcePointcut pointcut = new TransactionAttributeSourcePointcut() {...}` �д����ġ�

`BeanFactoryTransactionAttributeSourceAdvisor` �� `transactionAttributeSource` ��ʲô�أ������� `ProxyTransactionManagementConfiguration` �д��� `transactionAdvisor` �Ĵ��룺

```
public class ProxyTransactionManagementConfiguration 
        extends AbstractTransactionManagementConfiguration {

    // ʡ������
    ...

    /**
     * ��ȡSpring�� @Transactional ע�⣬������Ӧ���������Թ�����Spring����������ṹ
     */
    @Bean
    @Role(BeanDefinition.ROLE_INFRASTRUCTURE)
    public TransactionAttributeSource transactionAttributeSource() {
        return new AnnotationTransactionAttributeSource();
    }

    /**
     * ������ǿ��.
     * transactionAttributeSource��transactionAttributeSource() ���صĶ���
     */
    @Bean(name = TransactionManagementConfigUtils.TRANSACTION_ADVISOR_BEAN_NAME)
    @Role(BeanDefinition.ROLE_INFRASTRUCTURE)
    public BeanFactoryTransactionAttributeSourceAdvisor transactionAdvisor(
            TransactionAttributeSource transactionAttributeSource,
            TransactionInterceptor transactionInterceptor) {
        BeanFactoryTransactionAttributeSourceAdvisor advisor = 
                new BeanFactoryTransactionAttributeSourceAdvisor();
        // �������������࣬�������� @Transactional ������
        advisor.setTransactionAttributeSource(transactionAttributeSource);
        ...
        return advisor;
    }

}

```

�ɴ˿�֪��`BeanFactoryTransactionAttributeSourceAdvisor` �� `transactionAttributeSource` ����Ϊ `AnnotationTransactionAttributeSource`.

�����ٻص� `BeanFactoryTransactionAttributeSourceAdvisor`��������ķ�����֪��`getPointcut()` �õ����� `TransactionAttributeSourcePointcut` ����Ȼ���������ࣺ

```
abstract class TransactionAttributeSourcePointcut 
        extends StaticMethodMatcherPointcut implements Serializable {

    protected TransactionAttributeSourcePointcut() {
        // �ڹ��췽�������� ClassFilter
        setClassFilter(new TransactionAttributeSourceClassFilter());
    }

    /**
     * pointcut �� matches ����
     */
    @Override
    public boolean matches(Method method, Class<?> targetClass) {
        // �õ��Ľ��ΪAnnotationTransactionAttributeSource
        TransactionAttributeSource tas = getTransactionAttributeSource();
        return (tas == null || tas.getTransactionAttribute(method, targetClass) != null);
    }

    /**
     * �� BeanFactoryTransactionAttributeSourceAdvisor ����ָ��
     */
    @Nullable
    protected abstract TransactionAttributeSource getTransactionAttributeSource();

    /**
     * �ڲ��࣬ʵ���� ClassFilter
     */
    private class TransactionAttributeSourceClassFilter implements ClassFilter {

        /**
         * ClassFilter �� matches
         */
        @Override
        public boolean matches(Class<?> clazz) {
            // �Ƿ�ΪTransactionalProxy��PlatformTransactionManager��PersistenceExceptionTranslator��ʵ����
            if (TransactionalProxy.class.isAssignableFrom(clazz) ||
                    PlatformTransactionManager.class.isAssignableFrom(clazz) ||
                    PersistenceExceptionTranslator.class.isAssignableFrom(clazz)) {
                return false;
            }
            //�ж� TransactionAttributeSource ��ȡ���������Ƿ�Ϊ��
            // �õ��Ľ��ΪAnnotationTransactionAttributeSource
            TransactionAttributeSource tas = getTransactionAttributeSource();
            return (tas == null || tas.isCandidateClass(clazz));
        }
    }

}

```

������ķ��������ǵõ���һ����Ҫ�Ĺ���

*   ƥ���ࣺ`pc.getClassFilter().matches(targetClass)`��`ClassFilter` Ϊ `TransactionAttributeSourceClassFilter`

ƥ����Ĺ������ҵ��ˣ���ƥ�䷽���Ĺ����أ����ǽ��� `TransactionAttributeSourcePointcut#getMethodMatcher()` ������������� `StaticMethodMatcherPointcut`��

```
public abstract class StaticMethodMatcherPointcut 
        extends StaticMethodMatcher implements Pointcut {
    // ʡ����һЩ����
    ...

    @Override
    public final MethodMatcher getMethodMatcher() {
        return this;
    }
}

```

���صľ�Ȼ�� `this`�����Ǹ�ɶ����Ҫ�ţ���ϸ�� `TransactionAttributeSourcePointcut`���������̳��� `StaticMethodMatcherPointcut`��

```
abstract class TransactionAttributeSourcePointcut 
        extends StaticMethodMatcherPointcut implements Serializable {
    // ʡ����һЩ����
    ...
}

```

���ԣ�`pc.getMethodMatcher()` �õ��ľ��� `TransactionAttributeSourcePointcut`���� `mathes(...)` �������� `TransactionAttributeSourcePointcut#matches`.

�ڱ�С�ڵ�����������ܽ��·����Ľ����

*   ƥ���ࣺ`pc.getClassFilter().matches(targetClass)`��`ClassFilter` Ϊ `TransactionAttributeSourceClassFilter`��
*   ƥ�䷽����`pc.getMethodMatcher().matches(method, targetClass)`��`methodMatcher` Ϊ `TransactionAttributeSourcePointcut`��
*   ���������������У�������� `TransactionAttributeSourcePointcut#getTransactionAttributeSource`������������صĽ��Ϊ `AnnotationTransactionAttributeSource`.

#### 1.4 ƥ������

�� 1.2 ���֣�����֪������ǰ `advisor` �ܷ�Ӧ����Ŀ�� class����Ҫͬʱ��������ƥ�����

*   ƥ���ࣺ`pc.getClassFilter().matches(targetClass)`��`ClassFilter` Ϊ `TransactionAttributeSourceClassFilter`��
*   ƥ�䷽����`pc.getMethodMatcher().matches(method, targetClass)`��`methodMatcher` Ϊ `TransactionAttributeSourcePointcut`��

����������������������

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-133740c93d470e16ec8dc9a34106adb8fc8.png)

*   `TransactionAttributeSourceClassFilter#matches`�����жϵ�ǰ���Ƿ�Ϊ�Ƿ�Ϊ `TransactionalProxy`��`PlatformTransactionManager`��`PersistenceExceptionTranslator` ����ʵ���࣬Ȼ����� `AnnotationTransactionAttributeSource#isCandidateClass` �����жϣ�
*   `TransactionAttributeSourcePointcut#matches`������ `AnnotationTransactionAttributeSource#getTransactionAttribute`�����ڼ̳й�ϵ��ʵ�ʵ��õ��� `AbstractFallbackTransactionAttributeSource#getTransactionAttribute`���жϡ�

���������Ǿ��������¾���ƥ�����̡�

##### `AnnotationTransactionAttributeSource#isCandidateClass`

������ֱ�����⣬���� `isCandidateClass` ������

> AnnotationTransactionAttributeSource#isCandidateClass

```
@Override
public boolean isCandidateClass(Class<?> targetClass) {
    // �ҵ����е�annotationParsers��ѭ��ƥ��
    for (TransactionAnnotationParser parser : this.annotationParsers) {
        if (parser.isCandidateClass(targetClass)) {
            return true;
        }
    }
    return false;
}

```

���Կ�����������ѭ������� `TransactionAnnotationParser` �� `isCandidateClass` ������`this.annotationParsers` ��ɶ�أ�ͨ�����ԣ��������£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-5e16d6769e5a74c2f3064afdd090de08d42.png)

`this.annotationParsers` ��ֻ�� `SpringTransactionAnnotationParser`�����ǽ����� `isCandidateClass` ������

```
public class SpringTransactionAnnotationParser 
        implements TransactionAnnotationParser, Serializable {

    /**
     * �ж������Ƿ��� @Transactional ע��
     */
    @Override
    public boolean isCandidateClass(Class<?> targetClass) {
        return AnnotationUtils.isCandidateClass(targetClass, Transactional.class);
    }
}

```

����������յ��õ��� `AnnotationUtils.isCandidateClass`�������ж�ָ���������Ƿ��� `@Transactional` ע�⡣

��������Ǿ������ˣ�`TransactionAttributeSourceClassFilter#matches` ���ų�һЩ�� (`TransactionalProxy`/`PlatformTransactionManager`/`PersistenceExceptionTranslator` ��������) �����ջ�ƥ����� `@Transactional` ע����ࡣ

##### `AnnotationTransactionAttributeSource#getTransactionAttribute`

����ķ���ƥ��ɹ��󣬲����ܱ�ʾ�ɹ�ƥ�䣬����ƥ�� `TransactionAttributeSourcePointcut#matches`������ͬʱ����Ż�ƥ��ɹ���`TransactionAttributeSourcePointcut#matches` ���� `AnnotationTransactionAttributeSource#getTransactionAttribute` ���ƥ��ģ����Ǹ���ȥ��

```
public abstract class AbstractFallbackTransactionAttributeSource 
        implements TransactionAttributeSource {

    /**
     * ��ȡ @Transactional ע�������
     */
    public TransactionAttribute getTransactionAttribute(Method method, 
            @Nullable Class<?> targetClass) {
        if (method.getDeclaringClass() == Object.class) {
            return null;
        }

        // ʡ�Դӻ����л�ȡ
        ...
        else {
            // ��ȡ Transaction ���ԣ��� @Transactional ע�������
            TransactionAttribute txAttr = computeTransactionAttribute(method, targetClass);
            // ʡ�Է��뻺�����
            ...
            return txAttr;
        }
    }
}

```

`AnnotationTransactionAttributeSource` �� `getTransactionAttribute` �Ǽ̳��� `AbstractFallbackTransactionAttributeSource` �ģ�������ǽ���ķ����� `AbstractFallbackTransactionAttributeSource#getTransactionAttribute`���������������ȡ�����ϵ� `@Transactional` ע������ԣ����Ǹ��� `computeTransactionAttribute(...)`��

> AbstractFallbackTransactionAttributeSource

```
protected TransactionAttribute computeTransactionAttribute(Method method, 
        @Nullable Class<?> targetClass) {
    // Ĭ�ϱ���Ҫ public ������֧������
    if (allowPublicMethodsOnly() && !Modifier.isPublic(method.getModifiers())) {
        return null;
    }
    // 1\. ��ȡȷ�еķ��������紫���class��IFoo��ʵ�ʵĵ�class��DefaultFoo��
    //    ��ôӦ�ý� IFoo#method ת��Ϊ DefaultFoo#method
    Method specificMethod = AopUtils.getMostSpecificMethod(method, targetClass);
    // 2\. �ӷ����ϻ�ȡ @Transactional ������
    TransactionAttribute txAttr = findTransactionAttribute(specificMethod);
    if (txAttr != null) {
        return txAttr;
    }
    // 3\. �����ϻ�ȡ @Transaction ������
    txAttr = findTransactionAttribute(specificMethod.getDeclaringClass());
    if (txAttr != null && ClassUtils.isUserLevelMethod(method)) {
        return txAttr;
    }
    if (specificMethod != method) {
        // 4\. ȷ�еķ������Ҳ��������Ҵ���ķ����ϵ�
        txAttr = findTransactionAttribute(method);
        if (txAttr != null) {
            return txAttr;
        }
        // 5\. ���϶�û�ҵ�������ȷ�е����ϵ�
        txAttr = findTransactionAttribute(method.getDeclaringClass());
        if (txAttr != null && ClassUtils.isUserLevelMethod(method)) {
            return txAttr;
        }
    }
    // 6\. û�л�ȡ�������շ���null
    return null;
}

```

�����Ϸ��������̣����ܽ��ȡ `@Transactional` �����������£�

1.  ������ķ���ת��Ϊȷ�еķ��������紫��� `class` �� `IFoo`��ʵ�ʵĵ� `class` �� `DefaultFoo`������ͻὫ `IFoo#method` ת��Ϊ `DefaultFoo#method`
2.  ��ȷ�еķ����ϻ�ȡ `@Transactional` ������
3.  ���û�л�ȡ�����ʹ�ȷ�еĴ����ϻ�ȡ `@Transaction` ������
4.  ���û�л�ȡ�����ʹ���ķ����ϻ�ȡ `@Transaction` ������
5.  ���û�л�ȡ�����ʹ�������ϻ�ȡ `@Transaction` ������
6.  ������϶�û�л�ȡ�����ͷ��� `null`

spring ������δӷ��������ϻ�ȡ `@Transactional` �������أ���������ȥ��

> AnnotationTransactionAttributeSource

```
    // �ӷ����ϻ�ȡ @Transactional ����
    protected TransactionAttribute findTransactionAttribute(Method method) {
        return determineTransactionAttribute(method);
    }

    // �����ϻ�ȡ @Transactional ����
    protected TransactionAttribute findTransactionAttribute(Class<?> clazz) {
        return determineTransactionAttribute(clazz);
    }

    // ���յ��õķ���
    protected TransactionAttribute determineTransactionAttribute(AnnotatedElement element) {
        for (TransactionAnnotationParser parser : this.annotationParsers) {
            // ���� @Transactional ע�������
            TransactionAttribute attr = parser.parseTransactionAnnotation(element);
            if (attr != null) {
                return attr;
            }
        }
        return null;
    }

```

�������Ƕ��ǵ��� `AnnotationTransactionAttributeSource#determineTransactionAttribute` ����ȡ�ģ����� `AnnotationTransactionAttributeSource#determineTransactionAttribute` ������ `TransactionAnnotationParser#parseTransactionAnnotation` ���������� `this.annotationParsers` ����������ǰ���Ѿ��������ˣ�����ֻ��һ���ࣺ`SpringTransactionAnnotationParser`�����Ǹ���ȥ��

> SpringTransactionAnnotationParser

```
    /**
     * ��ȡ Transactional ע�⣬����������������������򷵻� null
     */
    public TransactionAttribute parseTransactionAnnotation(AnnotatedElement element) {
        // ��ȡ Transactional ע�⣬����������������������򷵻� null
        AnnotationAttributes attributes = AnnotatedElementUtils.findMergedAnnotationAttributes(
                element, Transactional.class, false, false);
        if (attributes != null) {
            return parseTransactionAnnotation(attributes);
        }
        else {
            return null;
        }
    }

    /**
     * ���� Transactional ע��ľ������
     */
    protected TransactionAttribute parseTransactionAnnotation(AnnotationAttributes attributes) {
        RuleBasedTransactionAttribute rbta = new RuleBasedTransactionAttribute();
        // ����Ĵ�����ʽ
        Propagation propagation = attributes.getEnum("propagation");
        rbta.setPropagationBehavior(propagation.value());
        // ����ĸ��뼶��
        Isolation isolation = attributes.getEnum("isolation");
        rbta.setIsolationLevel(isolation.value());
        // ����ĳ�ʱʱ��
        rbta.setTimeout(attributes.getNumber("timeout").intValue());
        // �Ƿ�Ϊֻ��
        rbta.setReadOnly(attributes.getBoolean("readOnly"));
        rbta.setQualifier(attributes.getString("value"));
        // ����ع��쳣
        List<RollbackRuleAttribute> rollbackRules = new ArrayList<>();
        for (Class<?> rbRule : attributes.getClassArray("rollbackFor")) {
            rollbackRules.add(new RollbackRuleAttribute(rbRule));
        }
        for (String rbRule : attributes.getStringArray("rollbackForClassName")) {
            rollbackRules.add(new RollbackRuleAttribute(rbRule));
        }
        // �����ع��쳣
        for (Class<?> rbRule : attributes.getClassArray("noRollbackFor")) {
            rollbackRules.add(new NoRollbackRuleAttribute(rbRule));
        }
        for (String rbRule : attributes.getStringArray("noRollbackForClassName")) {
            rollbackRules.add(new NoRollbackRuleAttribute(rbRule));
        }
        rbta.setRollbackRules(rollbackRules);

        return rbta;
    }

```

���Կ�����`Transactional` ע��ĸ����Խ������� `RuleBasedTransactionAttribute`.

���ˣ����Ǿ������ˣ�`TransactionAttributeSourcePointcut#matches` ���������ж���򷽷�����û�� `Transactional` ע�⡣

#### 1.5 �������Ĵ���

�������Ĵ����� `AbstractAutoProxyCreator#postProcessAfterInitialization` ��������ɵģ��������ͬ aop ���������һģһ��������Ͳ��ٷ����ˣ����˽��С���ɲ鿴 [spring aop ֮ AnnotationAwareAspectJAutoProxyCreator �������£�](https://my.oschina.net/funcy/blog/4687961)��

### 2\. ������ִ��

������ִ�з��棬������ aop ��ִ�����̲�������һ����ͨ�� `Advisor` �ҵ���Ӧ�� `Advice`����ͨ�� `Advice` �ҵ���Ӧ�� `methodInterceptor`������ִ�е��� `MethodInterceptor#invoke` ���������������� `MethodInterceptor` Ϊ `TransactionInterceptor`����������� `ProxyTransactionManagementConfiguration` ��ͨ�� `@Bean` ע������ġ�

���� aop �����̣����ǲ��������������ط����� [spring aop ֮ jdk ��̬����](https://my.oschina.net/funcy/blog/4696654) ��[ spring aop ֮ cglib ����](https://my.oschina.net/funcy/blog/4696655) ������ϸ����������Ȥ��С�������в��ģ���������ֱ������ `TransactionInterceptor#invoke` ��ִ�����̡�

����Ĵ���������� `TransactionInterceptor#invoke` �����У�

> TransactionInterceptor#invoke

```
public Object invoke(MethodInvocation invocation) throws Throwable {
    Class<?> targetClass = (invocation.getThis() != null 
        ? AopUtils.getTargetClass(invocation.getThis()) : null);
    // �������¿�
    return invokeWithinTransaction(invocation.getMethod(), targetClass, invocation::proceed);
}

```

�����Ĵ����߼��� `TransactionAspectSupport#invokeWithinTransaction` �����У�

> TransactionAspectSupport#invokeWithinTransaction

```
protected Object invokeWithinTransaction(Method method, @Nullable Class<?> targetClass,
        final InvocationCallback invocation) throws Throwable {
    TransactionAttributeSource tas = getTransactionAttributeSource();
    // ��ȡ@Transactional����������
    final TransactionAttribute txAttr = (tas != null 
        ? tas.getTransactionAttribute(method, targetClass) : null);
    // ��ȡ�����������IOC�����л�ȡ��
    final TransactionManager tm = determineTransactionManager(txAttr);

    // ʡ�� ReactiveTransactionManager �Ĵ���
    ...

    PlatformTransactionManager ptm = asPlatformTransactionManager(tm);
    // ��ȡ������ȫ�޶�������ʽΪ��"����.����.������"
    final String joinpointIdentification = methodIdentification(method, targetClass, txAttr);

    // ����Ĵ����߼�����Ҳ�����ǽ�������Ҫ�����ĵط�
    if (txAttr == null || !(ptm instanceof CallbackPreferringPlatformTransactionManager)) {
        // 1\. ��������
        TransactionInfo txInfo = createTransactionIfNecessary(ptm, txAttr, joinpointIdentification);
        Object retVal;
        try {
            // 2\. ִ�о����ҵ��
            retVal = invocation.proceedWithInvocation();
        }
        catch (Throwable ex) {
            // 3\. �쳣�ع�
            completeTransactionAfterThrowing(txInfo, ex);
            throw ex;
        }
        finally {
            // ����������Ϣ
            cleanupTransactionInfo(txInfo);
        }
        if (vavrPresent && VavrDelegate.isVavrTry(retVal)) {
            TransactionStatus status = txInfo.getTransactionStatus();
            if (status != null && txAttr != null) {
                retVal = VavrDelegate.evaluateTryFailure(retVal, txAttr, status);
            }
        }
        // 4\. �ύ���񣬴����л��ж��Ƿ���֧��
        commitTransactionAfterReturning(txInfo);
        return retVal;
    }
    else {
        // ʡ������
        ...
    }
}

```

���Ϸ������������ȫ�������ˣ��������£�

1.  ��������
2.  ִ��ҵ�����
3.  �쳣�ع�
4.  �ύ����

��������ľ�����������ǽ�����һƪ���·���������ֻ��Ҫ������Ĵ��������д����˽⼴�ɡ�

### 3\. �ܽ�

������Ҫ�����������д������Ĵ�����ִ�����̣�ʵ������Щ����ͬ aop ����һ�£��������ط������� aop ��ͬ�Ĳ��֣�

*   �ڴ������Ĵ������棬����������жϵ�ǰ�����ܷ�ʹ�� `BeanFactoryTransactionAttributeSourceAdvisor`���ص������ `TransactionAttributeSourceClassFilter#matches` �� `TransactionAttributeSourcePointcut#matches` �����������жϵĺ������ڣ�

*   �ڷ�����ִ���ϵģ����Է����� `TransactionInterceptor#invoke` ��ִ�����̣���Щ����Ŀ������ύ���쳣�ع������̸�����ƽ��ʹ�õĲ�𲻴󣬲�������ľ���ϸ�����ǲ�û�з�����

�����ص����������Ĵ�����ִ�����̣�����ִ�еľ���ϸ��������ƪ�ٷ�����

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4773457](https://my.oschina.net/funcy/blog/4773457) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_