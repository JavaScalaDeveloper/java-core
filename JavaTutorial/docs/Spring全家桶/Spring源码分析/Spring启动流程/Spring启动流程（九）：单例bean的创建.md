![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-1f1ac8f3d8241fad9693d9684048ab7f3ae.png)

�����ģ����������Ƿ��� `finishBeanFactoryInitialization(beanFactory)`�����Ľ��ص�������� bean �Ĵ������̡�

����һƪ�����У����ǽ����� `AbstractApplicationContext#finishBeanFactoryInitialization` ��ִ�й��̣����Ľ�����ϸ�ڣ����� spring bean �Ĵ������̡�

```
|-AnnotationConfigApplicationContext#AnnotationConfigApplicationContext(String...)
 |-AbstractApplicationContext#refresh
  |-AbstractApplicationContext#finishBeanFactoryInitialization
   |-DefaultListableBeanFactory#preInstantiateSingletons
    |-AbstractBeanFactory#getBean(java.lang.String)
     |-AbstractBeanFactory#doGetBean
      |-AbstractAutowireCapableBeanFactory#createBean(String, RootBeanDefinition, Object[])

```

����ֱ�ӿ� `AbstractAutowireCapableBeanFactory#createBean(String, RootBeanDefinition, Object[])`�������Ĵ������£�

```
@Override
protected Object createBean(String beanName, RootBeanDefinition mbd, @Nullable Object[] args)
    	throws BeanCreationException {

    RootBeanDefinition mbdToUse = mbd;

    // ȷ�� BeanDefinition �е� Class ������
    Class<?> resolvedClass = resolveBeanClass(mbd, beanName);
    if (resolvedClass != null && !mbd.hasBeanClass() && mbd.getBeanClassName() != null) {
        mbdToUse = new RootBeanDefinition(mbd);
        mbdToUse.setBeanClass(resolvedClass);
    }

    // ׼��������д�����bean�ж����� <lookup-method /> �� <replaced-method />
    try {
        mbdToUse.prepareMethodOverrides();
    }
    catch (BeanDefinitionValidationException ex) {
        ...
    }

    try {
        // ����д���Ļ�ֱ�ӷ���
        Object bean = resolveBeforeInstantiation(beanName, mbdToUse);
        if (bean != null) {
            return bean;
        }
    }
    catch (Throwable ex) {
        ...
    }

    try {
        // ���� bean
        Object beanInstance = doCreateBean(beanName, mbdToUse, args);
        return beanInstance;
    }
    catch (BeanCreationException | ImplicitlyAppearedSingletonException ex) {
        ...
    }
    catch (Throwable ex) {
        ...
    }
}

```

���Կ������÷��������ļ��£�

1.  ȷ�� class ������
2.  ��д����
3.  ���Ҵ�����������򷵻�
4.  ���� spring bean

����ǰ���������������Ĳ���ע�����ǽ������ĸ����������� `AbstractAutowireCapableBeanFactory#doCreateBean`:

```
protected Object doCreateBean(final String beanName, final RootBeanDefinition mbd, 
          final @Nullable Object[] args)  throws BeanCreationException {

    BeanWrapper instanceWrapper = null;
    if (mbd.isSingleton()) {
        //����� factoryBean��ӻ���ɾ��
        instanceWrapper = this.factoryBeanInstanceCache.remove(beanName);
    }
    if (instanceWrapper == null) {
         // ʵ���� Bean�����������������յ�
         instanceWrapper = createBeanInstance(beanName, mbd, args);
    }
    //beanʵ��
    final Object bean = instanceWrapper.getWrappedInstance();
    //bean����
    Class<?> beanType = instanceWrapper.getWrappedClass();
    if (beanType != NullBean.class) {
        mbd.resolvedTargetType = beanType;
    }

    synchronized (mbd.postProcessingLock) {
        if (!mbd.postProcessed) {
            try {
                // ѭ������MergedBeanDefinitionPostProcessor��postProcessMergedBeanDefinition���������磬
                // 1\. ���� AutowiredAnnotationBeanPostProcessor.postProcessMergedBeanDefinition Ϊ���ҵ�
                //  ����@Autowired��@Value ע������Ժͷ���
                // 2\. ���� CommonAnnotationBeanPostProcessor.postProcessMergedBeanDefinition Ϊ���ҵ�
                // 	����@Resource ע������Ժͷ���
                applyMergedBeanDefinitionPostProcessors(mbd, beanType, beanName);
            }
            catch (Throwable ex) {
                ...
            }
            mbd.postProcessed = true;
        }
    }

    // ���ѭ����������, �Ƿ�����ѭ������, allowCircularReferencesĬ��Ϊtrue�����Թر�
    boolean earlySingletonExposure = (mbd.isSingleton() && this.allowCircularReferences &&
            isSingletonCurrentlyInCreation(beanName));
    if (earlySingletonExposure) {
        // ѭ�������Ľ��������ᵥ������
        ...
    }

    Object exposedObject = bean;
    try {
        // ��������װ��, Ҳ�������ǳ���˵���Զ�ע�룬����Ҫ
        populateBean(beanName, mbd, instanceWrapper);
        // �����Ǵ���bean��ʼ����ɺ�ĸ��ֻص���
        // ����init-method��InitializingBean �ӿڡ�BeanPostProcessor �ӿ�
        exposedObject = initializeBean(beanName, exposedObject, mbd);
    }
    catch (Throwable ex) {
        ...
    }

    //ͬ���ģ��������ѭ������
    if (earlySingletonExposure) {
        // ѭ�������Ľ��������ᵥ������
        ...
    }

    // ��beanע�ᵽ��Ӧ��Scope��
    try {
        registerDisposableBeanIfNecessary(beanName, bean, mbd);
    }
    catch (BeanDefinitionValidationException ex) {
        ...
    }

    return exposedObject;
}

```

���Կ�����spring �ڴ��� bean ʱ����Ҫ�������������£�

1.  ����ʵ��
2.  ��������
3.  ע������
4.  ��ʼ�� bean

�����������Ǿ���Ҫ�������ĸ����衣

#### 1\. ����ʵ��

spring ����ʵ���ķ����� `AbstractAutowireCapableBeanFactory#createBeanInstance`���������£�

```
protected BeanWrapper createBeanInstance(String beanName, RootBeanDefinition mbd, 
        @Nullable Object[] args) {
    // ȷ���Ѿ������˴� class
    Class<?> beanClass = resolveBeanClass(mbd, beanName);

    // У����ķ���Ȩ��
    if (beanClass != null && !Modifier.isPublic(beanClass.getModifiers()) 
                && !mbd.isNonPublicAccessAllowed()) {
        throw new BeanCreationException(...);
    }

    // �Ƿ�������bean������Supplier��Supplier��java8�ṩ���࣬���Դ���һ��lambda���ʽ
    // ���� AbstractBeanDefinition#setInstanceSupplier ָ��
    Supplier<?> instanceSupplier = mbd.getInstanceSupplier();
    if (instanceSupplier != null) {
        return obtainFromSupplier(instanceSupplier, beanName);
    }

    if (mbd.getFactoryMethodName() != null) {
        // ���ù�������ʵ����
        return instantiateUsingFactoryMethod(beanName, mbd, args);
    }

    // �Ƿ��һ��
    boolean resolved = false;
    // �Ƿ���ù��캯��ע��
    boolean autowireNecessary = false;
    if (args == null) {
        synchronized (mbd.constructorArgumentLock) {
            if (mbd.resolvedConstructorOrFactoryMethod != null) {
                resolved = true;
                autowireNecessary = mbd.constructorArgumentsResolved;
            }
        }
    }
    if (resolved) {
        if (autowireNecessary) {
            return autowireConstructor(beanName, mbd, null, null);
        }
        else {
            // �޲ι��캯��
            return instantiateBean(beanName, mbd);
        }
    }

    // Candidate constructors for autowiring?
    // �ж��Ƿ�����вι��캯��
    Constructor<?>[] ctors = determineConstructorsFromBeanPostProcessors(beanClass, beanName);
    if (ctors != null || mbd.getResolvedAutowireMode() == AUTOWIRE_CONSTRUCTOR ||
            mbd.hasConstructorArgumentValues() || !ObjectUtils.isEmpty(args)) {
        return autowireConstructor(beanName, mbd, ctors, args);
    }

    ctors = mbd.getPreferredConstructors();
    if (ctors != null) {
        // ���캯������ע��
        return autowireConstructor(beanName, mbd, ctors, null);
    }

    // �����޲ι��캯��
    return instantiateBean(beanName, mbd);
}

```

�����ϴ���������spring ��ʵ���� bean ʱ���� 4 �ַ�ʽ��

1.  ʹ��ʵ����������obtainFromSupplier
2.  ʹ�ù���������instantiateUsingFactoryMethod
3.  ʹ���вι��죺autowireConstructor
4.  ʹ���޲ι��죺instantiateBean

����ǰ���������������ǿ�����ָ���ķ�����ûɶ��˵�ģ��������������� spring �������ʵ�������ѡ���췽������ʵ�����ġ�����һ�� bean ��˵�����δ�ṩ�κι��췽�����ṩ���޲ι��췽��������� `AbstractAutowireCapableBeanFactory#instantiateBean` ������ʵ������������� `AbstractAutowireCapableBeanFactory#autowireConstructor` ����ʵ������ʵ���ϣ��������������ն���ִ�е� `BeanUtils#instantiateClass(Constructor<T>, Object...)`:

```
public static <T> T instantiateClass(Constructor<T> ctor, Object... args) 
            throws BeanInstantiationException {
    Assert.notNull(ctor, "Constructor must not be null");
    try {
        ReflectionUtils.makeAccessible(ctor);
        if (KotlinDetector.isKotlinReflectPresent() 
                   && KotlinDetector.isKotlinType(ctor.getDeclaringClass())) {
            return KotlinDelegate.instantiateClass(ctor, args);
        }
        else {
            Class<?>[] parameterTypes = ctor.getParameterTypes();
            Assert.isTrue(args.length <= parameterTypes.length, "...");
            Object[] argsWithDefaultValues = new Object[args.length];
            for (int i = 0 ; i < args.length; i++) {
                if (args[i] == null) {
                    Class<?> parameterType = parameterTypes[i];
                    argsWithDefaultValues[i] = (parameterType.isPrimitive() 
                                        ? DEFAULT_TYPE_VALUES.get(parameterType) : null);
                }
                else {
                    argsWithDefaultValues[i] = args[i];
                }
            }
            // �������ʵ����
            return ctor.newInstance(argsWithDefaultValues);
        }
    }
    catch (...) {
        ...
    }
}

```

���Կ��������յ��õ��� `java.lang.reflect.Constructor#newInstance`������� jdk �ķ����ˡ�

���⣬�� bean �ṩ�˶� �����췽��ʱ��spring �����һ�׸��ӵ��ƶϻ��ƣ��ƶϳ���ѵĹ��췽��������Ͳ�չ���ˡ�

#### 2\. ��������

���󴴽��󣬽��������ǽ�������ע���ˣ�������ע������ǰ����Ҫ֪����������Щ������Ҫע�롣spring ���Բ������� `AbstractAutowireCapableBeanFactory#applyMergedBeanDefinitionPostProcessors` �е��ú��ô��������в����ģ�

```
protected void applyMergedBeanDefinitionPostProcessors(RootBeanDefinition mbd, 
        Class<?> beanType, String beanName) {
    for (BeanPostProcessor bp : getBeanPostProcessors()) {
        if (bp instanceof MergedBeanDefinitionPostProcessor) {
            // ���ú��ô�����
            MergedBeanDefinitionPostProcessor bdp = (MergedBeanDefinitionPostProcessor) bp;
            bdp.postProcessMergedBeanDefinition(mbd, beanType, beanName);
        }
    }
}

```

����Щ���ô������У�

1.  ���� `AutowiredAnnotationBeanPostProcessor.postProcessMergedBeanDefinition` ���Ҵ��� `@Autowired`��`@Value` ע������Ժͷ���
2.  ���� `CommonAnnotationBeanPostProcessor.postProcessMergedBeanDefinition` ���Ҵ��� `@Resource` ע������Ժͷ���

����Ϊ�˷���˵�� `@Autowired` ��ע�����̣������� demo01 �� `org.springframework.learn.demo01.BeanObj1` ��������д��룺

```
package org.springframework.learn.demo01;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BeanObj1 {

    // ��������Ϊ�¼���Ĵ���
    @Autowired
    private BeanObj2 beanObj2;

    public BeanObj1() {
        System.out.println("����beanObj1�Ĺ��췽��");
    }

    @Override
    public String toString() {
        return "BeanObj1{}";
    }
}

```

���� `AutowiredAnnotationBeanPostProcessor#postProcessMergedBeanDefinition` ������

```
@Override
public void postProcessMergedBeanDefinition(RootBeanDefinition beanDefinition, 
        Class<?> beanType, String beanName) {
    // ���������뷽��
    InjectionMetadata metadata = findAutowiringMetadata(beanName, beanType, null);
    // ��֤���ҵ��������뷽������ע�ᵽbeanDefinition
    metadata.checkConfigMembers(beanDefinition);
}

```

һ·���� `AutowiredAnnotationBeanPostProcessor#findAutowiringMetadata` ������������ `AutowiredAnnotationBeanPostProcessor#buildAutowiringMetadata`:

```
private InjectionMetadata buildAutowiringMetadata(final Class<?> clazz) {
     ...
    // ��������һ��ѭ�������굱ǰ���ҵ�ǰ��ĸ��ֱ࣬��Object��
    do {
        final List<InjectionMetadata.InjectedElement> currElements = new ArrayList<>();

        // ��������
        ReflectionUtils.doWithLocalFields(targetClass, field -> {
            MergedAnnotation<?> ann = findAutowiredAnnotation(field);
            if (ann != null) {
                if (Modifier.isStatic(field.getModifiers())) {
                    return;
                }
                boolean required = determineRequiredStatus(ann);
                // ���Է�װ�� AutowiredFieldElement
                currElements.add(new AutowiredFieldElement(field, required));
            }
        });

        // ���ҷ���
        ReflectionUtils.doWithLocalMethods(targetClass, method -> {
            Method bridgedMethod = BridgeMethodResolver.findBridgedMethod(method);
            if (!BridgeMethodResolver.isVisibilityBridgeMethodPair(method, bridgedMethod)) {
                return;
            }
            MergedAnnotation<?> ann = findAutowiredAnnotation(bridgedMethod);
            if (ann != null && method.equals(ClassUtils.getMostSpecificMethod(method, clazz))) {
                if (Modifier.isStatic(method.getModifiers())) {
                    return;
                }
                if (method.getParameterCount() == 0) {
                }
                boolean required = determineRequiredStatus(ann);
                PropertyDescriptor pd = BeanUtils.findPropertyForMethod(bridgedMethod, clazz);
                // ������װ�� AutowiredMethodElement
                currElements.add(new AutowiredMethodElement(method, required, pd));
            }
        });

        elements.addAll(0, currElements);
        targetClass = targetClass.getSuperclass();
    }
    while (targetClass != null && targetClass != Object.class);

    return InjectionMetadata.forElements(elements, clazz);
}

```

���ϴ�����ǲ��ҹ��̣��ܽ����£�

*   ѭ����ѯ���࣬�ӵ�ǰ�࿪ʼ�����굱ǰ����ҵ�ǰ��ĸ��ֱ࣬�� Object Ϊֹ��
*   ���������뷽���������ҵ����װΪ `AutowiredFieldElement`�������ҵ����װΪ `AutowiredMethodElement`��
*   �����ǲ������Ի��Ƿ�����ʹ�õĶ��� `findAutowiredAnnotation` ����

�����������ǾͿ��� `findAutowiredAnnotation` ��������ν��в��ҵġ����� `AutowiredAnnotationBeanPostProcessor#findAutowiredAnnotation` �������������£�

```
private final Set<Class<? extends Annotation>> autowiredAnnotationTypes 
        = new LinkedHashSet<>(4);

// Ĭ�Ϲ��췽����ָ����@Autowired��@Valueע��
@SuppressWarnings("unchecked")
public AutowiredAnnotationBeanPostProcessor() {
    this.autowiredAnnotationTypes.add(Autowired.class);
    this.autowiredAnnotationTypes.add(Value.class);
    ...
}

// ������ǲ��ҷ���
@Nullable
private MergedAnnotation<?> findAutowiredAnnotation(AccessibleObject ao) {
    MergedAnnotations annotations = MergedAnnotations.from(ao);
    // autowiredAnnotationTypes ������ @Autowired��@Valueע��
    for (Class<? extends Annotation> type : this.autowiredAnnotationTypes) {
        MergedAnnotation<?> annotation = annotations.get(type);
        if (annotation.isPresent()) {
            return annotation;
        }
    }
    return null;
}

```

���ϴ���ע��ú������ˣ�����Ͳ���˵�ˡ�

�ҵ������뷽���󣬽��ž���ע�ᵽ `beanDefinition` �ˣ����� `InjectionMetadata#checkConfigMembers` �����Ĺ�����

```
public void checkConfigMembers(RootBeanDefinition beanDefinition) {
    Set<InjectedElement> checkedElements = new LinkedHashSet<>(this.injectedElements.size());
    for (InjectedElement element : this.injectedElements) {
        Member member = element.getMember();
        if (!beanDefinition.isExternallyManagedConfigMember(member)) {
            // ע�ᵽ beanDefinition
            beanDefinition.registerExternallyManagedConfigMember(member);
            checkedElements.add(element);
        }
    }
    this.checkedElements = checkedElements;
}

```

��ν��ע�ᣬ��ʵҲ�൱�򵥣������� `beanDefinition` ���е� `externallyManagedConfigMembers` ���������һ����¼��

> RootBeanDefinition#registerExternallyManagedConfigMember

```
public void registerExternallyManagedConfigMember(Member configMember) {
    synchronized (this.postProcessingLock) {
        if (this.externallyManagedConfigMembers == null) {
            this.externallyManagedConfigMembers = new HashSet<>(1);
        }
        // ��set���������һ����¼
        this.externallyManagedConfigMembers.add(configMember);
    }
}

```

#### 3\. ע������

spring ������ע�����ڷ��� `AbstractAutowireCapableBeanFactory#populateBean` �д���ģ��������£�

```
protected void populateBean(String beanName, RootBeanDefinition mbd, @Nullable BeanWrapper bw) {
    if (bw == null) {
        if (mbd.hasPropertyValues()) {
            throw new BeanCreationException(...);
        }
        else {
            return;
        }
    }

    if (!mbd.isSynthetic() && hasInstantiationAwareBeanPostProcessors()) {
        for (BeanPostProcessor bp : getBeanPostProcessors()) {
            if (bp instanceof InstantiationAwareBeanPostProcessor) {
                // ���þ���ĺ��ô���������������
                // AutowiredAnnotationBeanPostProcessor.postProcessProperties ���� @Autowired��@Value ע��
                // CommonAnnotationBeanPostProcessor.postProcessProperties ���� @Resourceע��
                InstantiationAwareBeanPostProcessor ibp = (InstantiationAwareBeanPostProcessor) bp;
                // ������� false��������Ҫ���к�����������ֵ��Ҳ����Ҫ�پ��������� BeanPostProcessor �Ĵ���
                if (!ibp.postProcessAfterInstantiation(bw.getWrappedInstance(), beanName)) {
                    return;
                }
            }
        }
    }

    // bean����������
    PropertyValues pvs = (mbd.hasPropertyValues() ? mbd.getPropertyValues() : null);

    int resolvedAutowireMode = mbd.getResolvedAutowireMode();
    // ����ע������ΪbyType����byName��ע��@Autowired �Ȳ���byTypeҲ����byName,������ﷵ��false
    if (resolvedAutowireMode == AUTOWIRE_BY_NAME || resolvedAutowireMode == AUTOWIRE_BY_TYPE) {
        MutablePropertyValues newPvs = new MutablePropertyValues(pvs);
        // ͨ�������ҵ���������ֵ������� bean �������ȳ�ʼ�������� bean����¼������ϵ
        if (resolvedAutowireMode == AUTOWIRE_BY_NAME) {
            autowireByName(beanName, mbd, bw, newPvs);
        }
        // ͨ������װ�䡣����һЩ
        if (resolvedAutowireMode == AUTOWIRE_BY_TYPE) {
            autowireByType(beanName, mbd, bw, newPvs);
        }
        pvs = newPvs;
    }

    boolean hasInstAwareBpps = hasInstantiationAwareBeanPostProcessors();
    boolean needsDepCheck = (mbd.getDependencyCheck() != AbstractBeanDefinition.DEPENDENCY_CHECK_NONE);

    PropertyDescriptor[] filteredPds = null;
    if (hasInstAwareBpps) {
        if (pvs == null) {
            pvs = mbd.getPropertyValues();
        }
        for (BeanPostProcessor bp : getBeanPostProcessors()) {
            if (bp instanceof InstantiationAwareBeanPostProcessor) {
            // ���ú��ô��������ע�͵��������
            // ����@Autowiredע����� AutowiredAnnotationBeanPostProcessor
            InstantiationAwareBeanPostProcessor ibp = (InstantiationAwareBeanPostProcessor) bp;
            PropertyValues pvsToUse = ibp.postProcessProperties(pvs, bw.getWrappedInstance(), beanName);
            if (pvsToUse == null) {
                if (filteredPds == null) {
                    filteredPds = filterPropertyDescriptorsForDependencyCheck(bw, mbd.allowCaching);
                }
                // ��������Ϸ������ᵽ���ö�@Autowired�����һ��BeanPostProcessor��
                // ��������б��@Autowired��@Value ע������Խ�����ֵ
                pvsToUse = ibp.postProcessPropertyValues(pvs, filteredPds, 
                        bw.getWrappedInstance(), beanName);
                if (pvsToUse == null) {
                    return;
                }
            }
            pvs = pvsToUse;
            }
        }
    }
    if (needsDepCheck) {
        if (filteredPds == null) {
             filteredPds = filterPropertyDescriptorsForDependencyCheck(bw, mbd.allowCaching);
        }
        checkDependencies(beanName, mbd, filteredPds, pvs);
    }

    if (pvs != null) {
        // ���� bean ʵ��������ֵ
        applyPropertyValues(beanName, mbd, bw, pvs);
    }
}

```

spring ������������ں��ô������н��еģ�`@Autowired` ��������䷽��Ϊ `AutowiredAnnotationBeanPostProcessor#postProcessProperties`:

```
public PropertyValues postProcessProperties(PropertyValues pvs, Object bean, String beanName) {
     // ���� findAutowiringMetadata ������ȷ����ע @Autowired @Value ע��������뷽����ȡ�ɹ�
     // findAutowiringMetadata ���Է��֣���������һ�����棬ֻ�е�һ�βŻ�����ȥ��ȡ��֮�󶼴ӻ����л�ȡ
     InjectionMetadata metadata = findAutowiringMetadata(beanName, bean.getClass(), pvs);
     try {
         // �����������ע��
         metadata.inject(bean, beanName, pvs);
     }
     catch (...) {
         ...
     }
}

```

�����ٽ��� `InjectionMetadata#inject`��

```
public void inject(Object target, @Nullable String beanName, @Nullable PropertyValues pvs) 
        throws Throwable {
    Collection<InjectedElement> checkedElements = this.checkedElements;
    Collection<InjectedElement> elementsToIterate =
            (checkedElements != null ? checkedElements : this.injectedElements);
    if (!elementsToIterate.isEmpty()) {
        // ����� InjectedElement�������� AutowiredAnnotationBeanPostProcessor#findAutowiringMetadata
        // �в��ҵ��ģ�field ���װΪ AutowiredFieldElement��method ����װΪ AutowiredMethodElement
        for (InjectedElement element : elementsToIterate) {
            element.inject(target, beanName, pvs);
        }
    }
}

```

�����ٸ��� `element.inject(target, beanName, pvs)`��������õ����� `AutowiredAnnotationBeanPostProcessor.AutowiredFieldElement#inject`��

```
@Override
protected void inject(Object bean, @Nullable String beanName, 
                @Nullable PropertyValues pvs) throws Throwable {
        Field field = (Field) this.member;
        Object value;
        if (this.cached) {
            value = resolvedCachedArgument(beanName, this.cachedFieldValue);
        }
        else {
            DependencyDescriptor desc = new DependencyDescriptor(field, this.required);
            desc.setContainingClass(bean.getClass());
            Set<String> autowiredBeanNames = new LinkedHashSet<>(1);
            Assert.state(beanFactory != null, "No BeanFactory available");
            TypeConverter typeConverter = beanFactory.getTypeConverter();
            try {
                // ��һ�о��ǻ�ȡע���bean
                value = beanFactory.resolveDependency(desc, beanName, autowiredBeanNames, typeConverter);
            }
            catch (BeansException ex) {
                ...
            }
            ...
        }
        // ͨ���������������ֵ
        if (value != null) {
            ReflectionUtils.makeAccessible(field);
            field.set(bean, value);
        }
    }
}

```

���ϴ����е�࣬������ֻҪ��Ҫ��ע���д�������ˣ�

1.  ��ȡ��Ҫע��� bean: `value = beanFactory.resolveDependency(desc, beanName, autowiredBeanNames, typeConverter)`
2.  ʹ�÷������� bean��`ReflectionUtils.makeAccessible(field);field.set(bean, value);`

���ڵ� 2 �㣬���յ��õ��� jdk �ṩ�ķ��䷽����ûʲô��˵�ġ����������ص������� spring ����λ�ȡ��Ҫע��� bean��

���� `beanFactory.resolveDependency(desc, beanName, autowiredBeanNames, typeConverter)`������Բ���Ҫ�Ĵ�����������������������£�

```
|-AnnotationConfigApplicationContext#AnnotationConfigApplicationContext(String...)
 |-AbstractApplicationContext#refresh
  |-AbstractApplicationContext#finishBeanFactoryInitialization
   |-DefaultListableBeanFactory#preInstantiateSingletons
    |-AbstractBeanFactory#getBean(String)
     |-AbstractBeanFactory#doGetBean
      |-DefaultSingletonBeanRegistry#getSingleton(String, ObjectFactory<?>)
       |-AbstractAutowireCapableBeanFactory#createBean(String, RootBeanDefinition, Object[])
        |-AbstractAutowireCapableBeanFactory#doCreateBean
         |-AbstractAutowireCapableBeanFactory#populateBean
          |-AutowiredAnnotationBeanPostProcessor#postProcessProperties
           |-InjectionMetadata#inject
            |-AutowiredAnnotationBeanPostProcessor.AutowiredFieldElement#inject
             |-DefaultListableBeanFactory#resolveDependency
              |-DefaultListableBeanFactory#doResolveDependency

```

�������е� `DefaultListableBeanFactory#doResolveDependency`:

```
@Nullable
public Object doResolveDependency(DependencyDescriptor descriptor, @Nullable String beanName,
         @Nullable Set<String> autowiredBeanNames, @Nullable TypeConverter typeConverter) 
         throws BeansException {

    InjectionPoint previousInjectionPoint = ConstructorResolver.setCurrentInjectionPoint(descriptor);
    try {
        ...
        // 1\.  �������Ͳ������е�beanClass��map�б��������Ϊ��beanName -> Class
        Map<String, Object> matchingBeans = findAutowireCandidates(beanName, type, descriptor);
           ...
        String autowiredBeanName;
        Object instanceCandidate;
        // 2\. ����ҵ���bean�ж��������������1
        if (matchingBeans.size() > 1) {
            // ���ȡע���������
            autowiredBeanName = determineAutowireCandidate(matchingBeans, descriptor);
            if (autowiredBeanName == null) {
                if (isRequired(descriptor) || !indicatesMultipleBeans(type)) {
                    return descriptor.resolveNotUnique(descriptor.getResolvableType(), matchingBeans);
                }
                else {
                    return null;
                }
            }
            // 3\. ����ע����������� ���������ҳ�����map<beanName, Class>�����ң�
            // �õ�bean��Class����
            instanceCandidate = matchingBeans.get(autowiredBeanName);
        }
        else {
            Map.Entry<String, Object> entry = matchingBeans.entrySet().iterator().next();
            autowiredBeanName = entry.getKey();
            instanceCandidate = entry.getValue();
        }
        if (autowiredBeanNames != null) {
            autowiredBeanNames.add(autowiredBeanName);
        }
        if (instanceCandidate instanceof Class) {
            // ����class ��ȡ bean�����bean�����ڣ���ᴴ��bean
            instanceCandidate = descriptor.resolveCandidate(autowiredBeanName, type, this);
        }
        Object result = instanceCandidate;
        if (result instanceof NullBean) {
            if (isRequired(descriptor)) {
                raiseNoMatchingBeanFound(type, descriptor.getResolvableType(), descriptor);
            }
            result = null;
        }
        if (!ClassUtils.isAssignableValue(type, result)) {
            throw new BeanNotOfRequiredTypeException(...);
        }
        return result;
    }
    finally {
        ConstructorResolver.setCurrentInjectionPoint(previousInjectionPoint);
    }
}

```

���� bean �Ļ�ȡ���������ܽ��£�

1.  ���� bean ���ʹ� spring �л�ȡ bean �� Class ����ע�⣺����õ��Ķ���Ϊ Class���һ�ȡ���� Class ����� spring �л�ȡ beanClass �����ж����
2.  ����õ��� Class �����ж�������ȡע������������������������Ҵӵ� 1 ���õ��� Class �����в��ҷ��������� 1 �� Class ����
3.  ���� Class ����� spring �л�ȡ bean.

���磬���ڽӿ� `Inter`��ʵ���� `A` �� `B`�����߹�ϵ���£�

```
interface Inter {

}

@Service
class A implements Inter {

}

@Service
class B implements Inter {

}

```

���� `C` �У�ע�� `Inter` ���ͣ�

```
@Service
class C {
    @Autowired
    private Inter b;
}

```

��ע��ʱ��

1.  spring ��ͨ�� `Inter.class` ���ң��õ������ࣺ`A.class` �� `B.class`�������˶�� bean Class ����
2.  �õ�ע����������������� `b`��Ȼ��ʹ�� `b` �����ϵõ��� bean Class �����ҵ����ϵ� bean Class ������Ȼ��`B.class` ���ϣ�
3.  �� spring �����л�ȡ `B.class` ��Ӧ�� bean.

������и�С���⣺����� `C` ������ע��:

```
@Service
class C {
    @Autowired
    private Inter inter;
}

```

�� `Inter` ��������Ϊ `inter`���� spring ����û������Ϊ `inter` �� bean Class ����������ע��ɹ���

��ʵ�ϣ�����ע�벻��ɹ����� spring �ᱨ�쳣������Ȥ��С�������Լ����ԡ�

�����������������θ��� class �� spring �л�ȡ��Ӧ�� bean���� `instanceCandidate = descriptor.resolveCandidate(autowiredBeanName, type, this)`������ȥ��

> DependencyDescriptor#resolveCandidate

```
public Object resolveCandidate(String beanName, Class<?> requiredType, BeanFactory beanFactory)
        throws BeansException {
    // ���õ��� AbstractBeanFactory#getBean(String)
    return beanFactory.getBean(beanName);
}

```

��������൱�򵥣���ֻ��һ�У�`beanFactory.getBean(beanName)`���ع��µ�������

```
|-AnnotationConfigApplicationContext#AnnotationConfigApplicationContext(String...)
 |-AbstractApplicationContext#refresh
  |-AbstractApplicationContext#finishBeanFactoryInitialization
   |-DefaultListableBeanFactory#preInstantiateSingletons
    // �����һ�ε�����AbstractBeanFactory#getBean
    // ��ʱ����Ĳ���ΪbeanObj1
    |-AbstractBeanFactory#getBean(String)
     |-AbstractBeanFactory#doGetBean
      |-DefaultSingletonBeanRegistry#getSingleton(String, ObjectFactory<?>)
       |-AbstractAutowireCapableBeanFactory#createBean(String, RootBeanDefinition, Object[])
        |-AbstractAutowireCapableBeanFactory#doCreateBean
         |-AbstractAutowireCapableBeanFactory#populateBean
          |-AutowiredAnnotationBeanPostProcessor#postProcessProperties
           |-InjectionMetadata#inject
            |-AutowiredAnnotationBeanPostProcessor.AutowiredFieldElement#inject
             |-DefaultListableBeanFactory#resolveDependency
              |-DefaultListableBeanFactory#doResolveDependency
               |-DependencyDescriptor#resolveCandidate
                // �����һ�ε�����AbstractBeanFactory#getBean��
                // ��ʱ����Ĳ���ΪbeanObj2
                |-AbstractBeanFactory#getBean(String)
                 .. ���濪ʼ����`beanObj2`��ʵ�������ʼ������

```

��ϵ�������ǰ��������Կ�����

*   �ڻ�ȡ `beanObj1` ʱ��һ�ε��� `AbstractBeanFactory#getBean(String)`�����ڴ�ʱ spring �в����� `beanObj1`���Ϳ�ʼ�� `beanObj1` �Ĵ�����
*   `beanObj1` ʵ������ɺ󣬽��žͽ�������ע�룬`beanObj1` ���и����� `BeanObj2 beanObj2`��ͬ������ `AbstractBeanFactory#getBean(String)` �� spring �л�ȡ `beanObj2` ����
*   ���ڴ�ʱ spring �в����� `beanObj2`�����žͽ����� `beanObj2` ����Ĵ������̣����������ͬ��Ҳ��� `beanObj2` ����ע�롢���г�ʼ�������Ȳ��������� `beanObj1` �Ĳ������ƣ�
*   �õ� `beanObj2` �����ע�뵽 `beanObj1` �� `BeanObj2 beanObj2` �����У�Ȼ����� `beanObj1` �ĺ���������

��������Կ���������ע��ʱ�����ܻ�ʹ bean ��ʼ����ǰ��ͬʱ������������ζ�����������������ǳ������� A ��Ҫע�� B��B Ҫע�� C����ô�� A ������ע��ʱ�������ʼ�� B���� B �ڳ�ʼ��ʱ���ֻ��ʼ�� C��

���� bean ��ʵ�������ʼ����������Ҫ��ȷ�£�

*   ʵ��������ָ��������Ĳ���������ʹ�� new ������ƣ�δ���� spring ����ע�뼰֮������г�ʼ�����������浽 spring ������һϵ�в�����
*   ��ʼ������ʵ������Ķ����������ע�롢���г�ʼ�����������ձ��浽 spring ������

#### 4\. ��ʼ�� bean

spring ��ʼ�� bean �ķ����� `AbstractAutowireCapableBeanFactory#initializeBean(String, Object, RootBeanDefinition)`:

```
protected Object initializeBean(final String beanName, final Object bean, 
             @Nullable RootBeanDefinition mbd) {
    // 1\. ���� invokeAwareMethods
    if (System.getSecurityManager() != null) {
        AccessController.doPrivileged((PrivilegedAction<Object>) () -> {
             invokeAwareMethods(beanName, bean);
             return null;
        }, getAccessControlContext());
    }
    else {
        invokeAwareMethods(beanName, bean);
    }

    // 2\. ���� applyBeanPostProcessorsBeforeInitialization
    Object wrappedBean = bean;
    if (mbd == null || !mbd.isSynthetic()) {
        // ִ�� spring ���е����ô���������xxxPostProcessor-------@PostConstruct
        wrappedBean = applyBeanPostProcessorsBeforeInitialization(wrappedBean, beanName);
    }

    try {
        // 3\. ִ�� InitializingBean ��ʼ��
        invokeInitMethods(beanName, wrappedBean, mbd);
    }
    catch (Throwable ex) {
        ...
    }
    if (mbd == null || !mbd.isSynthetic()) {
        // 4\. ���� applyBeanPostProcessorsAfterInitialization
        wrappedBean = applyBeanPostProcessorsAfterInitialization(wrappedBean, beanName);
    }

    return wrappedBean;
}

```

���ϴ�����Ҫ���������� 4 ��������

1.  invokeAwareMethods(beanName, bean);
2.  applyBeanPostProcessorsBeforeInitialization(wrappedBean, beanName);
3.  invokeInitMethods(beanName, wrappedBean, mbd);
4.  applyBeanPostProcessorsAfterInitialization(wrappedBean, beanName);

##### 4.1 ���� Aware bean �ķ���

`invokeAwareMethods` ����ִ�� Aware bean ����ط�����

```
private void invokeAwareMethods(final String beanName, final Object bean) {
    if (bean instanceof Aware) {
        if (bean instanceof BeanNameAware) {
            ((BeanNameAware) bean).setBeanName(beanName);
        }
        if (bean instanceof BeanClassLoaderAware) {
            ClassLoader bcl = getBeanClassLoader();
            if (bcl != null) {
                ((BeanClassLoaderAware) bean).setBeanClassLoader(bcl);
            }
        }
        if (bean instanceof BeanFactoryAware) {
            ((BeanFactoryAware) bean).setBeanFactory(AbstractAutowireCapableBeanFactory.this);
        }
    }
}

```

���Ϸ����Ƚϼ򵥣��Ͳ���˵�ˡ�

##### 4.2 ���к��ô������� `postProcessBeforeInitialization` ����

���������� `AbstractAutowireCapableBeanFactory#applyBeanPostProcessorsBeforeInitialization` �����У�

```
public Object applyBeanPostProcessorsBeforeInitialization(Object existingBean, String beanName)
         throws BeansException {
    Object result = existingBean;
    for (BeanPostProcessor processor : getBeanPostProcessors()) {
        // ���ú��ô�����
        Object current = processor.postProcessBeforeInitialization(result, beanName);
        if (current == null) {
            return result;
        }
        result = current;
    }
    return result;
}

```

������Ҫ���� `ApplicationContextAwareProcessor#postProcessBeforeInitialization` �������������£�

```
@Override
@Nullable
public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
    if (!(bean instanceof EnvironmentAware || bean instanceof EmbeddedValueResolverAware ||
              bean instanceof ResourceLoaderAware || bean instanceof ApplicationEventPublisherAware ||
              bean instanceof MessageSourceAware || bean instanceof ApplicationContextAware)){
        return bean;
    }
    AccessControlContext acc = null;
    if (System.getSecurityManager() != null) {
        acc = this.applicationContext.getBeanFactory().getAccessControlContext();
    }
    if (acc != null) {
        AccessController.doPrivileged((PrivilegedAction<Object>) () -> {
           invokeAwareInterfaces(bean);
           return null;
        }, acc);
    }
    else {
        // ���з���
        invokeAwareInterfaces(bean);
    }
    return bean;
}

private void invokeAwareInterfaces(Object bean) {
    if (bean instanceof EnvironmentAware) {
        ((EnvironmentAware) bean).setEnvironment(this.applicationContext.getEnvironment());
    }
    if (bean instanceof EmbeddedValueResolverAware) {
        ((EmbeddedValueResolverAware) bean).setEmbeddedValueResolver(this.embeddedValueResolver);
    }
    if (bean instanceof ResourceLoaderAware) {
        ((ResourceLoaderAware) bean).setResourceLoader(this.applicationContext);
    }
    if (bean instanceof ApplicationEventPublisherAware) {
        ((ApplicationEventPublisherAware) bean).setApplicationEventPublisher(this.applicationContext);
    }
    if (bean instanceof MessageSourceAware) {
        ((MessageSourceAware) bean).setMessageSource(this.applicationContext);
    }
    // װ�� ʵ����ApplicationContextAware����� applicationContext
    if (bean instanceof ApplicationContextAware) {
        ((ApplicationContextAware) bean).setApplicationContext(this.applicationContext);
    }
}

```

��ʵ����������Ǹ����� `XxxAware` ��ֵ��������������� `ApplicationContextAware` ��ֵҲ����������С�

˳��һ����ǣ������ bean �У��������� `@PostConstruct` ע�⣺

```
@PostConstruct
public void test() {
    System.out.println("PostConstruct");
}

```

�÷��������� `InitDestroyAnnotationBeanPostProcessor#postProcessBeforeInitialization` �н��е��ã�����Ƚϼ򵥣�Ҳ�������� jdk �ķ�����ƣ�����Ͳ���˵�ˡ�

##### 4.3 ���� bean �ĳ�ʼ������

���������� `AbstractAutowireCapableBeanFactory#invokeInitMethods` ����:

```
protected void invokeInitMethods(String beanName, final Object bean, 
        @Nullable RootBeanDefinition mbd)  throws Throwable {
    // ִ�� InitializingBean#afterPropertiesSet ����
    boolean isInitializingBean = (bean instanceof InitializingBean);
    if (isInitializingBean && (mbd == null || 
                 !mbd.isExternallyManagedInitMethod("afterPropertiesSet"))) {
        if (System.getSecurityManager() != null) {
            try {
                AccessController.doPrivileged((PrivilegedExceptionAction<Object>) () -> {
                    ((InitializingBean) bean).afterPropertiesSet();
                    return null;
                }, getAccessControlContext());
            }
            catch (PrivilegedActionException pae) {
                throw pae.getException();
            }
        }
        else {
            // ���beanʵ���� InitializingBean �ӿڣ������ afterPropertiesSet()
            ((InitializingBean) bean).afterPropertiesSet();
        }
    }

    // ִ���Զ���ĳ�ʼ������������xml�У�ͨ�� init-method ָ���ķ���
    if (mbd != null && bean.getClass() != NullBean.class) {
        String initMethodName = mbd.getInitMethodName();
        if (StringUtils.hasLength(initMethodName) &&
                !(isInitializingBean && "afterPropertiesSet".equals(initMethodName)) &&
                !mbd.isExternallyManagedInitMethod(initMethodName)) {
            invokeCustomInitMethod(beanName, bean, mbd);
        }
    }
}

```

������Ҫ����������������

1.  ��� bean ʵ���� InitializingBean �ӿڣ������ afterPropertiesSet ()
2.  ���ָ���� init-method������ `invokeCustomInitMethod` �����У�Ҳ��ͨ�� jdk ������������еģ��Ͳ���˵�ˡ�

##### 4.4 ���к��ô������� `postProcessAfterInitialization` ����

��һ����Ҫ������ `BeanPostProcessor#postProcessAfterInitialization`�������е� `BeanPostProcessor` �� `ApplicationListenerDetector`:

```
@Override
public Object postProcessAfterInitialization(Object bean, String beanName) {
    if (bean instanceof ApplicationListener) {
        Boolean flag = this.singletonNames.get(beanName);
        if (Boolean.TRUE.equals(flag)) {
            this.applicationContext.addApplicationListener((ApplicationListener<?>) bean);
        }
        else if (Boolean.FALSE.equals(flag)) {
            this.singletonNames.remove(beanName);
        }
    }
    return bean;
}

```

����������������� `ApplicationListener` �ģ������ bean ʵ���� `ApplicationListener`��������������ӵ� spring �ļ������б�ġ�

#### 5\. �ܽ�

������Ҫ������ spring bean �������̣���������ܽ����£�

1.  ʵ���� bean��ָ���˳�ʼ��������ָ���� `factory method`�������ƶϹ��췽���ȷ�ʽ��

2.  ��ѯ��ע������Ի򷽷�������Щ���Ի򷽷��ϱ�ע�� `@Autowird`/`@Value`/`@Resource`

    *   `AutowiredAnnotationBeanPostProcessor.postProcessMergedBeanDefinition` �������Ҵ��� @Autowired��@Value ע������Ժͷ���
    *   `CommonAnnotationBeanPostProcessor.postProcessMergedBeanDefinition` �������Ҵ��� @Resource ע������Ժͷ���
3.  �������

    *   `AutowiredAnnotationBeanPostProcessor.postProcessProperties` ���� `@Autowired`��`@Value` ע�⣬`CommonAnnotationBeanPostProcessor.postProcessProperties` ���� `@Resource` ע��
    *   ���� `@Autowired` ʱ���ȸ��������ҵ����е� `Class`������ж�����ٸ���ע�����Ե����Ʋ��ҷ��ϵ� `Class`�������� `beanFactory.getBean(...)` �� spring ��ȡҪע��Ķ���ͨ���������Ϊ��Ӧ����������ֵ��
4.  ��ʼ�� bean

    1.  ִ�� Aware bean ����ط���
    2.  ���� `BeanPostProcessor#postProcessBeforeInitialization` ����
        *   �� `ApplicationContextAwareProcessor#postProcessBeforeInitialization` ��ִ�� Aware bean ����ط���
        *   �� `InitDestroyAnnotationBeanPostProcessor#postProcessBeforeInitialization` �д��� `@PostConstruct` ע��
    3.  ִ�г�ʼ������
        *   ִ�� `InitializingBean#afterPropertiesSet` ����
        *   ִ���Զ���� `init-method` ����
    4.  ���� `BeanPostProcessor#postProcessAfterInitialization` ����
        *   �� `ApplicationListenerDetector#postProcessAfterInitialization` �д��� spring ������

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-b7a4d4bc1bfbd76537e40cf843b0d18df93.png)

���� spring bean �Ĵ������̾��ȷ����������ˣ����� spring �ڴ��� bean �Ĺ����У���һ���޷����ӵ������ѭ�������������ⷽ��Ĵ������Բο���

*   [spring ̽��֮ѭ�������Ľ����һ�������ۻ�ʯ](https://my.oschina.net/funcy/blog/4659555)
*   [spring ̽��֮ѭ�������Ľ����������Դ�����](https://my.oschina.net/funcy/blog/4815992)

*   * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4659524](https://my.oschina.net/funcy/blog/4659524) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_