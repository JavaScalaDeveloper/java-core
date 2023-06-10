spring aop ִ��ʱ��˳���������ģ���θı�ִ�е����ȼ������Ľ���Դ������̽�� aop ִ��˳������ܡ�

�� [spring aop ֮ AnnotationAwareAspectJAutoProxyCreator �������ϣ�](https://my.oschina.net/funcy/blog/4678817) �� [spring aop ֮ AnnotationAwareAspectJAutoProxyCreator �������£�](https://my.oschina.net/funcy/blog/4687961)�У��ݹ� spring aop ������ִ�й��̣�����һ���������ι��� aop �����������

*   `ReflectiveAspectJAdvisorFactory#getAdvisorMethods`���� `aspect` �е� `@Around/@Before/@After` �ȷ�����������
*   `AspectJAwareAdvisorAutoProxyCreator#sortAdvisors`���� `advisor` ��������

�����������ص�������������������

#### 1 `ReflectiveAspectJAdvisorFactory#getAdvisorMethods`

��һ�������� `ReflectiveAspectJAdvisorFactory#getAdvisorMethods`�����ýṹ���£�

```
|-AbstractAutoProxyCreator#postProcessBeforeInstantiation
  |-AspectJAwareAdvisorAutoProxyCreator#shouldSkip
   |-AnnotationAwareAspectJAutoProxyCreator#findCandidateAdvisors
    |-BeanFactoryAspectJAdvisorsBuilder#buildAspectJAdvisors
     |-ReflectiveAspectJAdvisorFactory#getAdvisors
      |-ReflectiveAspectJAdvisorFactory#getAdvisorMethods

```

�������£�

> ReflectiveAspectJAdvisorFactory

```
// ��ȡ @Aspect ���еķ���
private List<Method> getAdvisorMethods(Class<?> aspectClass) {
    final List<Method> methods = new ArrayList<>();
    // ʡ�Ի�ȡ�����Ĳ���
    ...

    //�Եõ������з�������
    methods.sort(METHOD_COMPARATOR);
    return methods;
}

```

��������Ĳ����� [spring aop ֮ AnnotationAwareAspectJAutoProxyCreator �������ϣ�](https://my.oschina.net/funcy/blog/4678817) һ����������ϸ�������������ǽ���ע�������

> ReflectiveAspectJAdvisorFactory

```
/**
 * METHOD_COMPARATOR ���
 */
private static final Comparator<Method> METHOD_COMPARATOR;
static {
    Comparator<Method> adviceKindComparator = new ConvertingComparator<>(
            // �Ƚ�����������˳����бȽ�
            new InstanceComparator<>(
                    Around.class, Before.class, After.class, AfterReturning.class, AfterThrowing.class),
            // ת������������ת��Ϊ @Around, @Before, @After, @AfterReturning, @AfterThrowing ��ע��
            (Converter<Method, Annotation>) method -> {
                AspectJAnnotation<?> annotation =
                    AbstractAspectJAdvisorFactory.findAspectJAnnotationOnMethod(method);
                return (annotation != null ? annotation.getAnnotation() : null);
            });
    // ת���Ƚ�����
    // 1\. ת����������ķ���(Method)ת��Ϊ������(String)
    // 2\. �Ƚϣ����������ͽ��бȽϣ����ﴫ��ĵ�����ΪString��ԭ����ת�����������Methodת����String��
    Comparator<Method> methodNameComparator = new ConvertingComparator<>(Method::getName);
    /*
     * METHOD_COMPARATOR �ȽϹ���
     * 1\. ���������ʶ������ע��, �� @Around, @Before, @After, @AfterReturning,
     *       @AfterThrowing ˳������ (`adviceKindComparator`)
     * 2\. ���û�б�ʶ��Щע�⣬�򰴷������Ƶ��ַ�������(`methodNameComparator`)
     */
    METHOD_COMPARATOR = adviceKindComparator.thenComparing(methodNameComparator);
}

```

����������������������ܽ����£�

1.  �����������Ķ�����ͬһ�� `@Aspect` �еķ�����
2.  �������淽�����������£�`@Around`, `@Before`, `@After`, `@AfterReturning`, `@AfterThrowing`��
3.  ���ڷ����淽��������������String �������������

�÷�������ǰ��ı仯���£�

����ǰ��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-23df6d6a46f37badb1017ceee8dcfa6533e.png)

�����

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-85bdb16953c1c6348d39578de6b6144c1cc.png)

����������Ƿ����� `@Around, @Before, @After, @AfterReturning,@AfterThrowing` ��˳��һ�¡�

�õ� `List<Method>` �󣬽��Ż������Щ `method`�������װΪһ���� `advisor`��

> ReflectiveAspectJAdvisorFactory

```
public List<Advisor> getAdvisors(MetadataAwareAspectInstanceFactory aspectInstanceFactory) {
    // ʡ����һЩ����
    ...

    List<Advisor> advisors = new ArrayList<>();
    //��ȡ��������е���ǿ����
    for (Method method : getAdvisorMethods(aspectClass)) {
        // ������ǿʵ����advisors.size() ����Ϊ 0��1��2��... ����
        // declarationOrderInAspect ��ֵ������������õ�
        Advisor advisor = getAdvisor(method, lazySingletonAspectInstanceFactory, 
                advisors.size(), aspectName);
        if (advisor != null) {
            advisors.add(advisor);
        }
    }

    // ʡ����һЩ����
    ...
}

```

��װ�� `Advisor` ʱ���ᴫ�� `declarationOrderInAspect` ֵ����ֵΪ `advisors.size()`������Ϊ `0��1��2��...`�����ֵ�ں���������л��õ���

### 2\. advisor ������`AspectJAwareAdvisorAutoProxyCreator#sortAdvisors`

`@Aspect` ���е����淽����װ�� `advisor` �󣬻��߻�ȡ���Զ��� `advisor` �󣬽��žͽ����˵ڶ�������`AspectJAwareAdvisorAutoProxyCreator#sortAdvisors`�������ĵ��������£�

```
|-AbstractAutoProxyCreator#postProcessAfterInitialization
 |-AbstractAutoProxyCreator#wrapIfNecessary
  |-AbstractAdvisorAutoProxyCreator#getAdvicesAndAdvisorsForBean
   |-AbstractAdvisorAutoProxyCreator#findEligibleAdvisors
    |-AspectJAwareAdvisorAutoProxyCreator#sortAdvisors

```

> AspectJAwareAdvisorAutoProxyCreator

```
protected List<Advisor> sortAdvisors(List<Advisor> advisors) {
    List<PartiallyComparableAdvisorHolder> partiallyComparableAdvisors 
            = new ArrayList<>(advisors.size());
    for (Advisor element : advisors) {
        partiallyComparableAdvisors.add(
            // �ȽϹ���Ϊ DEFAULT_PRECEDENCE_COMPARATOR,��ʵ��AspectJPrecedenceComparator
            new PartiallyComparableAdvisorHolder(element, DEFAULT_PRECEDENCE_COMPARATOR));
    }
    // ����ıȽϲ������ȽϹ����� AspectJPrecedenceComparator �ṩ
    List<PartiallyComparableAdvisorHolder> sorted 
            = PartialOrder.sort(partiallyComparableAdvisors);
    if (sorted != null) {
        List<Advisor> result = new ArrayList<>(advisors.size());
        for (PartiallyComparableAdvisorHolder pcAdvisor : sorted) {
            result.add(pcAdvisor.getAdvisor());
        }
        return result;
    }
    else {
        return super.sortAdvisors(advisors);
    }
}

```

�����������������һ���� `PartialOrder.sort(...)`��һ���� `super.sortAdvisors(...)`�������������� `PartialOrder.sort(...)`��

#### 2.1 `PartialOrder.sort(...)` �ıȽ�����`AspectJPrecedenceComparator`

ʵ���ϣ�`PartialOrder.sort(...)` ֻҪ����һ��������ѣ��������ûɶ�����ģ���������Ҫ������Ӧ���Ǵ�����������Ҳ���� `DEFAULT_PRECEDENCE_COMPARATOR`��

```
private static final Comparator<Advisor> DEFAULT_PRECEDENCE_COMPARATOR 
        = new AspectJPrecedenceComparator();

```

`DEFAULT_PRECEDENCE_COMPARATOR` �������� `AspectJPrecedenceComparator`������ֱ�Ӳ鿴�� `compare(xxx)` ������

> AspectJPrecedenceComparator

```
@Override
public int compare(Advisor o1, Advisor o2) {
    // �ȽϹ���AnnotationAwareOrderComparator
    int advisorPrecedence = this.advisorComparator.compare(o1, o2);
    // ˳����ͬ������Դ��ͬһ aspect������ comparePrecedenceWithinAspect �ٴαȽ�
    if (advisorPrecedence == SAME_PRECEDENCE && declaredInSameAspect(o1, o2)) {
        // �Ƚ�����˳�����������һ����after֪ͨ��������������ȼ��ߣ����������������ȼ���
        advisorPrecedence = comparePrecedenceWithinAspect(o1, o2);
    }
    return advisorPrecedence;
}

```

`AspectJPrecedenceComparator#compare` �Ƚϼ򵥣��������£�

1.  ���� `advisorComparator.compare` ���бȽϣ�����ȽϹ������ǽ������������
2.  ����������ȽϹ���õ������ȼ���ͬ�������� `advisor` ����ͬһ aspect �ж���ģ������ `comparePrecedenceWithinAspect` �����Ƚ�.

##### `this.advisorComparator.compare`

���������� `this.advisorComparator.compare` �ıȽϹ���

```
private final Comparator<? super Advisor> advisorComparator;

public AspectJPrecedenceComparator() {
    this.advisorComparator = AnnotationAwareOrderComparator.INSTANCE;
}

public int compare(Advisor o1, Advisor o2) {
    // �ȽϹ���AnnotationAwareOrderComparator
    int advisorPrecedence = this.advisorComparator.compare(o1, o2);
    ...
}

```

`this.advisorComparator.compare` �ıȽϹ����� `AnnotationAwareOrderComparator` �ṩ��

```
public int compare(@Nullable Object o1, @Nullable Object o2) {
    return doCompare(o1, o2, null);
}

/**
 * ����ıȽϲ������ȱȽ� PriorityOrdered���ٱȽ� Ordered
 */
private int doCompare(@Nullable Object o1, @Nullable Object o2, 
        @Nullable OrderSourceProvider sourceProvider) {
    // ����֮һΪ PriorityOrdered��˭��PriorityOrdered��˭�����ȼ���
    boolean p1 = (o1 instanceof PriorityOrdered);
    boolean p2 = (o2 instanceof PriorityOrdered);
    if (p1 && !p2) {
        return -1;
    }
    else if (p2 && !p1) {
        return 1;
    }
    // ����order��ֵ���Ȳ���Ordered�ӿڣ����û�ҵ����ٲ��� @Order ע��
    int i1 = getOrder(o1, sourceProvider);
    int i2 = getOrder(o2, sourceProvider);
    // ��Integer������бȽ�
    return Integer.compare(i1, i2);
}

```

������Ĵ����֪���ȱȽ� `PriorityOrdered`���ٱȽ� `Ordered`���ȽϹ������£�

1.  `PriorityOrdered` �Ƚϣ�����֮�У�ֻ����һʵ���� `PriorityOrdered` �ӿڣ���ô����Ϊ `PriorityOrdered` ���ȼ��ߣ� ��������� `Ordered` �Ĺ���Ƚϣ�
2.  `Ordered` �ȽϹ���
    1.  ���ʵ���� `Ordered` �� `PriorityOrdered` �ӿڣ������ `getOrder()` ����ֵ���бȽϣ�ֵԽС���ȼ�Խ�ߣ�
    2.  �����ע�� `@Order/@Priority` ע�⣬������� `value()` ����ֵ���бȽϣ�ֵԽС���ȼ�Խ�ߣ�
    3.  ���û��ʵ�� `Ordered/PriorityOrdered`��Ҳû�б�ע `@Order/@Priority` ע�⣬��Ϊ������ȼ� (`Integer.MAX_VALUE`).

##### `comparePrecedenceWithinAspect`

���� `@Aspect` ��ע���࣬���ͬһ `aspect` �ﶨ����ͬ���� `advice`��spring aop Ҳ�ṩ��һ�ױȽϹ���

```
/**
 * ��� @Aspect�� ͬһaspect�ﶨ����ͬ���� advice���ٴαȽ�
 */
private int comparePrecedenceWithinAspect(Advisor advisor1, Advisor advisor2) {
    boolean oneOrOtherIsAfterAdvice = (AspectJAopUtils.isAfterAdvice(advisor1) 
            || AspectJAopUtils.isAfterAdvice(advisor2));
    int adviceDeclarationOrderDelta = getAspectDeclarationOrder(advisor1) 
            - getAspectDeclarationOrder(advisor2);
    // ������һ����after֪ͨ��declarationOrderInAspect������ȼ���
    if (oneOrOtherIsAfterAdvice) {
        if (adviceDeclarationOrderDelta < 0) {
            return LOWER_PRECEDENCE;
        }
        else if (adviceDeclarationOrderDelta == 0) {
            return SAME_PRECEDENCE;
        }
        else {
            return HIGHER_PRECEDENCE;
        }
    }
    // ���߶�����after֪ͨ��declarationOrderInAspectС�����ȼ���
    else {
        if (adviceDeclarationOrderDelta < 0) {
            return HIGHER_PRECEDENCE;
        }
        else if (adviceDeclarationOrderDelta == 0) {
            return SAME_PRECEDENCE;
        }
        else {
            return LOWER_PRECEDENCE;
        }
    }
}

```

�ȽϹ������£��Ƚ����ߵ� `declarationOrderInAspect` ֵ���������֮һΪ `after` ֪ͨ��`declarationOrderInAspect` ������ȼ��ߣ�������߶����� `after` ֪ͨ��`declarationOrderInAspect` С�����ȼ��ߡ�

����� `declarationOrderInAspect` ��ʲô�أ�������һС���ᵽ�� `advisor.size()`���������£�

> ReflectiveAspectJAdvisorFactory

```
public List<Advisor> getAdvisors(MetadataAwareAspectInstanceFactory aspectInstanceFactory) {
    // ʡ����һЩ����
    ...

    List<Advisor> advisors = new ArrayList<>();
    //��ȡ��������е���ǿ����
    for (Method method : getAdvisorMethods(aspectClass)) {
        // ������ǿʵ����advisors.size() ����Ϊ 0��1��2��... ����
        // declarationOrderInAspect ��ֵ������������õ�
        Advisor advisor = getAdvisor(method, lazySingletonAspectInstanceFactory, 
                advisors.size(), aspectName);
        if (advisor != null) {
            advisors.add(advisor);
        }
    }

    // ʡ����һЩ����
    ...
}

```

�ر�ǿ�����ǣ��������ֻ������ͬһ `@Aspect` �ඨ��ġ�ͬ����֪ͨ�������磺

```
@Aspect
public class AspectTest {
    @Before
    public void before1() {
        ...
    }

    @Before
    public void before2() {
        ...
    }

}

```

����� `before1()` �� `before2()` ��Ӧ�� `advisor` ������ `comparePrecedenceWithinAspect` ���򣬶����´���Ͳ������ˣ�ԭ�����ڲ�ͬ�� `@Aspect` ���ж���ģ�

```
@Aspect
public class AspectTest1 {
    @Before
    public void before() {
        ...
    }

}

@Aspect
public class AspectTest2 {
    @Before
    public void before() {
        ...
    }

}

```

#### 2. `super.sortAdvisors`

�����ٻع�ͷ���� `super.sortAdvisors(advisors)`:

> AspectJAwareAdvisorAutoProxyCreator

```
protected List<Advisor> sortAdvisors(List<Advisor> advisors) {
    ...
    else {
        return super.sortAdvisors(advisors);
    }
}

```

���Ǹ���ȥ��

> AbstractAdvisorAutoProxyCreator

```
 protected List<Advisor> sortAdvisors(List<Advisor> advisors) {
     AnnotationAwareOrderComparator.sort(advisors);
     return advisors;
 }

```

�������ʹ�õ��� `AnnotationAwareOrderComparator.sort(advisors)`��ʵ���ϣ����������������� `this.advisorComparator.compare` �ıȽϹ�������Ͳ��ٷ����ˡ�

### 3. `getOrder()` ֵ������

#### `BeanFactoryTransactionAttributeSourceAdvisor#getOrder()`

`BeanFactoryTransactionAttributeSourceAdvisor` û�� `@Order/@Priority`������ʵ���� `Ordered` �ӿڣ��������ִ��˳���� `getOrder()` �����ķ���ֵ��������Ӧ�� `getOrder()` �������£�

```
    /**
     * ��ȡ order���������£�
     * 1\. �����ָ���� order��ֱ�ӷ��أ�
     * 2\. ��ȡ advisor �� advice����� advice ʵ���� Ordered �ӿڣ����� getOrder()��
     * 3\. ������϶������㣬�򷵻� Ordered.LOWEST_PRECEDENCE (������ȼ�)��
     * @return
     */
    @Override
    public int getOrder() {
        if (this.order != null) {
            return this.order;
        }
        Advice advice = getAdvice();
        if (advice instanceof Ordered) {
            return ((Ordered) advice).getOrder();
        }
        return Ordered.LOWEST_PRECEDENCE;
    }

```

`Ordered.LOWEST_PRECEDENCE` Ϊ `Integer.MAX_VALUE`���� `2147483647`�������ٿ��� `BeanFactoryTransactionAttributeSourceAdvisor` �� `getOrder()` �������ص�ֵ��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-d05044b7dcd41855ab6e59727c4be74bdb9.png)

�ɼ���`BeanFactoryTransactionAttributeSourceAdvisor` ��ִ��˳����Ĭ�ϵ� `Integer.MAX_VALUE`��������ȵĻ����������ֵ���� `return this.order` ���صģ�

```
public int getOrder() {
    // ͨ�����ȷ��֣�this.order ����Ϊnull
    if (this.order != null) {
        return this.order;
    }
    // ʡ��һЩ����
    ...
}

```

��ô��ֵ�Ǵ����������أ��������ط������������ڴ��� `BeanFactoryTransactionAttributeSourceAdvisor` ����ʱ������ `BeanFactoryTransactionAttributeSourceAdvisor#setOrder` ���õģ�

> ProxyTransactionManagementConfiguration

```
@Bean(name = TransactionManagementConfigUtils.TRANSACTION_ADVISOR_BEAN_NAME)
@Role(BeanDefinition.ROLE_INFRASTRUCTURE)
public BeanFactoryTransactionAttributeSourceAdvisor transactionAdvisor() {
    BeanFactoryTransactionAttributeSourceAdvisor advisor 
            = new BeanFactoryTransactionAttributeSourceAdvisor();
    advisor.setTransactionAttributeSource(transactionAttributeSource());
    advisor.setAdvice(transactionInterceptor());
    if (this.enableTx != null) {
        // �����ȡ���� @EnableTransactionManagement ע��� order() ֵ
        advisor.setOrder(this.enableTx.<Integer>getNumber("order"));
    }
    return advisor;
}

```

���������Ǿ������ˣ����� advisor ��ִ��˳������� `@EnableTransactionManagement` ��ָ����

```
public @interface EnableTransactionManagement {

    boolean proxyTargetClass() default false;

    AdviceMode mode() default AdviceMode.PROXY;

    /**
     * ����ָ��advisorִ��˳��Ĭ����������ȼ�
     */
    int order() default Ordered.LOWEST_PRECEDENCE;

}

```

���ۣ�`@EnableTransactionManagement` ע��� `order()` ��������ָ�� `advisor` ��ִ��˳��

#### `InstantiationModelAwarePointcutAdvisorImpl#getOrder()`

��ǰ��ķ�����֪��`@Aspect` ���е�ÿһ���������ն���ת��Ϊ `advisor`������Ϊ `InstantiationModelAwarePointcutAdvisorImpl`����Ҳʵ���� `Ordered` �ӿڣ����ִ��˳��Ҳ���� `InstantiationModelAwarePointcutAdvisorImpl#getOrder()` �������������� `getOrder()` �������£�

> InstantiationModelAwarePointcutAdvisorImpl

```
@Override
public int getOrder() {
    return this.aspectInstanceFactory.getOrder();
}

```

�� [spring aop ֮ AnnotationAwareAspectJAutoProxyCreator �������ϣ�](https://my.oschina.net/funcy/blog/4678817)�����Ѿ���ϸ������ `method` �� `advisor` ��ת����̣��ܴӴ����������ҵ� `aspectInstanceFactory` �����ͣ��������ǾͲ���һ��������Դ���ˣ�ֱ��ͨ�����Եķ�����ȡ `aspectInstanceFactory` �����ͣ�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-e2784fc573474f56e8555ef60d57a07bcbf.png)

�ӵ��ԵĽ��������`aspectInstanceFactory` ����Ϊ `LazySingletonAspectInstanceFactoryDecorator`�����Ǹ����� `getOrder()` ������

> LazySingletonAspectInstanceFactoryDecorator

```
@Override
public int getOrder() {
    return this.maaif.getOrder();
}

```

������Ȼʹ�õ��Եķ�ʽ��ȡ `maaif` �����ͣ�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-2a4b87b6c8c824c55c4a3d86d736796def0.png)

`maaif` ����Ϊ `BeanFactoryAspectInstanceFactory`�����Ǽ���������

> BeanFactoryAspectInstanceFactory

```
public int getOrder() {
    // this.name ָ���Ǳ�ע�� @Aspect ע�����
    Class<?> type = this.beanFactory.getType(this.name);
    if (type != null) {
        // ���ʵ���� Ordered �ӿڣ��͵��� getOrder() ������ȡ
        // PriorityOrdered �� Ordered ���ӽӿڣ�Ҳ�� getOrder() �������������Ҳ���ȡ��
        if (Ordered.class.isAssignableFrom(type) && this.beanFactory.isSingleton(this.name)) {
            return ((Ordered) this.beanFactory.getBean(this.name)).getOrder();
        }
        // 1\. ���������Ƿ��� @Order ע�⣬����У��򷵻� @Order ע��ָ����ֵ��
        // 2\. �����ѯ���Ƿ��� @Priority ע�⣬����У��򷵻� @Priority ע��ָ����ֵ��
        // 3\. ������϶������㣬���� Ordered.LOWEST_PRECEDENCE��ֵΪ Integer.MAX_VALUE
        return OrderUtils.getOrder(type, Ordered.LOWEST_PRECEDENCE);
    }
    return Ordered.LOWEST_PRECEDENCE;
}

```

�Ӵ�����������`getOrder()` �߼����£�

1.  ͨ�����ƻ�ȡ�����࣬Ҳ���Ǳ�ע�� `@Aspect` ���ࣻ
2.  ���������ʵ���� `Ordered` �ӿڣ��͵��� `getOrder()` ������ȡ�����أ�ֵ��һ����ǣ�`PriorityOrdered` �� `Ordered` ���ӽӿڣ�Ҳ�� `getOrder()` ����������Ҳ���ȡ������
3.  �������û�л�ȡ������������������Ƿ��� `@Order` ע�⣬����У��򷵻� `@Order` ע��ָ����ֵ�����û�У������������Ƿ��� `@Priority` ע�⣬����У��򷵻� `@Priority` ע��ָ����ֵ��
4.  �������û�л�ȡ��ֵ���ͷ���Ĭ��ֵ��`Ordered.LOWEST_PRECEDENCE`��

������������ˣ�`@Aspect` �����ͨ��ʵ�� `Ordered/PriorityOrdered` �ӿ���ָ��ִ�����ȼ���Ҳ����ͨ�� `@Order/@Priority` ע����ָ��ִ�����ȼ���

**��Ҫ�ر�ָ������**���� `getOrder()` �����������ⲿ�� ����ֻ �ǰ� `PriorityOrdered/@Priority` ���� `Order` ���������ȼ������� `Ordered/@Order` �ߡ�Ҳ����˵����� `AspectA` ��ע�˵��� `@Priority`��`AspectB` ��ע�˵��� `@Order`��`AspectA` �����ȼ�����һ���� `AspectB` �ߣ������������ȼ�����ע�� ��� `value()` ֵ��

### 4\. ����Զ������ȼ�

�������Լ�д����ʱ�����ָ�����ȼ��أ�

1. ���������ʵ�� `advisor`����ʵ�� `Ordered` �ӿڣ�Ҳ������ `advisor` ���ϱ�ע `@Order` ע�⣺

   ```
   public class MyAdvisor extends AbstractBeanFactoryPointcutAdvisor implements Ordered {
   
       @Override
       public int getOrder() {
           return xxx;
       }
   
   }
   
   @Order(xxx)
   public class MyAdvisor extends AbstractBeanFactoryPointcutAdvisor {
   
       @Override
       public int getOrder() {
           return xxx;
       }
   
   }
   
   ```

2. ����ǵ��������� (`@Aspect` ��ע����)�������ظ��� `@Around/@Before/@After` ��

   ```
   @Aspect
   public class MyAspectj {
   
       @Around("xxx")
       public Object around(ProceedingJoinPoint p){
           ...
       }
   
       @Before("xxx")
       public void before(JoinPoint p) {
           ...
       }
   
       @After("xxx")
       public void after(JoinPoint p) {
           ...
       }
   
       @AfterReturning("xxx")
       public void afterReturning(JoinPoint p) {
           ...
       }
   
       @AfterThrowing("xxx")
       public void afterThrowing(JoinPoint p) {
           ...
       }
   }
   
   ```

   ����ͬһ����Ĳ�֪ͬͨ��spring �Ѿ����������ú���ִ��˳�������޴Ӹ��ģ�ִ��˳������Ϊ `Around, Before, After, AfterReturning, AfterThrowing`.

3. ���������� (`@Aspect` ��ע����) �����ظ��� `@Around/@Before/@After` �ȣ�������£�

   ```
   @Aspect
   public class MyAspectj {
   
       @Around("xxx")
       public Object around(ProceedingJoinPoint p){
           ...
       }
   
       @Before("xxx")
       public void before(JoinPoint p) {
           ...
       }
   
       @Around("xxx")
       public Object around(ProceedingJoinPoint p){
           ...
       }
   
       @Before("xxx")
       public void before(JoinPoint p) {
           ...
       }
   
   }
   
   ```

   ������������� `AspectJPrecedenceComparator#comparePrecedenceWithinAspect` ����ʱ�з��������õ��Ľ����ǣ��Ƚ����ߵ� `declarationOrderInAspect` ֵ���������֮һΪ `after` ֪ͨ��`declarationOrderInAspect` ������ȼ��ߣ�������߶����� `after` ֪ͨ��`declarationOrderInAspect` С�����ȼ��ߡ���� `declarationOrderInAspect` ��ȫ������ jdk �ķ�����ƣ��Ȼ�ȡ�������ĸ��������ĸ������� `declarationOrderInAspect` ��С����ͬ jdK �汾֮�䣬���Ա�֤��õ�˳��һ�¡�

4. ��������� (`@Aspect` ��ע����) ��ִ��˳�����ͨ�� `@Order` ע�⣬��ʵ�� `Ordered` �ӿ���ָ����

   ```
   @Order(xxx)
   public class MyAspectj1 {
       ...
   }
   
   @Order(xxx)
   public class MyAspectj2 {
       ...
   }
   
   ```

���⣬`getOrder()` ���ص�ֵ�� `@Order(xxx)` ָ����ֵԽС���������ȼ�Խ�ߡ�

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4784828](https://my.oschina.net/funcy/blog/4784828) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_