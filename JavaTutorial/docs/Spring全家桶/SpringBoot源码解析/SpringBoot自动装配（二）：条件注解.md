### 1\. ����ע�⼰���ж���

�� [springboot �Զ�װ��֮�����Զ�װ����](https://my.oschina.net/funcy/blog/4870868)һ���У����Ƿ����� springboot ����� `META-INF/spring.factories` �ļ��ж�����Զ�װ���࣬���ص���Щ�Զ�װ�������Щ���е� bean ��һ�����ʼ���𣿲����ǣ����ǿ����ڶ�Ӧ�� Bean ���ɷ�����ʹ��**����ע��**���������Ƿ���г�ʼ����

springboot �ṩ������ע�����£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-0e8d27c887fb6ca142672cad1c60e9de207.png)

�����оٲ������£�

| ע������              | ע������                                                     | ����˵��                                      |
| --------------------- | ------------------------------------------------------------ | --------------------------------------------- |
| class ����ע��        | `@ConditionalOnClass`/`@ConditionalOnMissingClass`           | ��ָ������**���� / ȱʧ**ʱ��ʼ���� bean      |
| bean ����ע��         | `@ConditionalOnBean`/`@ConditionalOnMissingBean`             | ��ָ���� bean **���� / ȱʧ**ʱ��ʼ���� bean  |
| ��������ע��          | `@ConditionalOnProperty`                                     | ��ָ�������Դ��ڳ�ʼ���� bean                 |
| Resource ����ע��     | `@ConditionalOnResource`                                     | ��ָ������Դ���ڳ�ʼ���� bean                 |
| Web Ӧ������ע��      | `@ConditionalOnWebApplication` / `@ConditionalOnNotWebApplication` | ��ǰӦ��**Ϊ / ��Ϊ** web Ӧ��ʱ��ʼ���� bean |
| spring ���ʽ����ע�� | `@ConditionalOnExpression`                                   | �����ʽ���Ϊ true ʱ��ʼ���� bean           |

���ǽ��� `@ConditionalOnClass` ������ע������ݣ�

```
...
@Conditional(OnClassCondition.class)
public @interface ConditionalOnClass {
    ...
}

```

���Կ�����`ConditionalOnClass` ����� `@Conditional` ע��Ĺ��ܣ��������� `OnClassCondition.class`��

���� `@Conditional` ע����Բο� [ConfigurationClassPostProcessor ֮���� @Conditional ע��](https://my.oschina.net/funcy/blog/4873444)����������ֱ��˵ `@Conditional` ��ʹ�÷�ʽ��

1. `@Conditional` �� spring ���������ע�⣻

2. `@Conditional` �ṩ��һ������ `value`������Ϊ `Class`��������� `Condition` �����ࣺ

   ```
   Class<? extends Condition>[] value();
   
   ```

3. `Condition` ��һ���ӿڣ�������һ�� `matches(...)` ������

   ```
   public interface Condition {
   
       boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata);
   
   }
   
   ```

   ֻ���� `matches(...)` �������� `true` ʱ��`ConfigurationClassPostProcessor` �ŻὫ���Ӧ�� bean ע�ᵽ `beanFactory` �� `beanDefinitionMap` ��.

�ܽ��� `@Conditional` ��ʹ�÷�ʽ�����Ǿ������ˣ�`OnClassCondition.class` �� `Condition` �����࣬�� `matches(...)` ��������������Ҫ��������ͬ����������ע��Ĵ���ʽҲ���ƣ������ܽ�������ע����ж��ࣺ

| ע������              | ע������                                                     | �����ж���                  |
| --------------------- | ------------------------------------------------------------ | --------------------------- |
| class ����ע��        | `@ConditionalOnClass`/`@ConditionalOnMissingClass`           | `OnClassCondition`          |
| bean ����ע��         | `@ConditionalOnBean`/`@ConditionalOnMissingBean`             | `OnBeanCondition`           |
| ��������ע��          | `@ConditionalOnProperty`                                     | `OnPropertyCondition`       |
| Resource ����ע��     | `@ConditionalOnResource`                                     | `OnResourceCondition`       |
| Web Ӧ������ע��      | `@ConditionalOnWebApplication` / `@ConditionalOnNotWebApplication` | `OnWebApplicationCondition` |
| spring ���ʽ����ע�� | `@ConditionalOnExpression`                                   | `OnExpressionCondition`     |

������������Ŀ�ľͺ���ȷ�ˣ�Ҫ������Щ����ע����ж��߼���ֻ��Ҫ������Ӧ�����ж���� `matches(...)` �����Ϳ����ˡ�

### 2. `SpringBootCondition#matches`

���� `OnClassCondition#matches` ������������������ `SpringBootCondition`����ط������£�

```
public abstract class SpringBootCondition implements Condition {

    private final Log logger = LogFactory.getLog(getClass());

    @Override
    public final boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        String classOrMethodName = getClassOrMethodName(metadata);
        try {
            // ��ȡ����ƥ����
            ConditionOutcome outcome = getMatchOutcome(context, metadata);
            // ��ӡһ����־
            logOutcome(classOrMethodName, outcome);
            // ��¼���������ķ����������Ϊ��¼һ�������жϼ�¼��
            recordEvaluation(context, classOrMethodName, outcome);
            // ���ﷵ�����ս����true �� false
            return outcome.isMatch();
        }
        catch (NoClassDefFoundError ex) {
            throw new IllegalStateException(...);
        }
        catch (RuntimeException ex) {
            throw new IllegalStateException(...);
        }
    }

    /**
     * ���Ǹ�����ʽ����������������ʵ��
     */
    public abstract ConditionOutcome getMatchOutcome(
        ConditionContext context, AnnotatedTypeMetadata metadata);

    ...

}

```

`SpringBootCondition` �� `matches(...)` �ؼ������У�

```
...
ConditionOutcome outcome = getMatchOutcome(context, metadata);
...
return outcome.isMatch();

```

�� `SpringBootCondition` �� `getMatchOutcome(...)` ���Ǹ����󷽷���������߼��������ṩ��`OnClassCondition` ����ʵ��֮һ��ʵ���ϣ����������ж��඼�� `SpringBootCondition` �����࣬�������Ǿ�ֱ�ӽ��������� `getMatchOutcome(...)` ���������ˡ�

`getMatchOutcome(...)` �������صĽ���� `ConditionOutcome`������������������ `ConditionOutcome` �Ǹ�ɶ��

```
public class ConditionOutcome {

    private final boolean match;

    private final ConditionMessage message;

    /**
     * ���췽��
     */
    public ConditionOutcome(boolean match, String message) {
        this(match, ConditionMessage.of(message));
    }

    /**
     * ���췽��
     */
    public ConditionOutcome(boolean match, ConditionMessage message) {
        Assert.notNull(message, "ConditionMessage must not be null");
        this.match = match;
        this.message = message;
    }

    /**
     * ����ƥ��Ľ��
     */
    public boolean isMatch() {
        return this.match;
    }

    ...
}

```

�Ӵ�����������������������װ�ȽϽ���ģ��ڲ����������ԣ�`match` �� `message`:

*   `match` �������� `boolean`�������������ƥ��ɹ�����ʧ�ܵı�ʶ
*   `message` �������� `ConditionMessage`������ʾƥ������˵��

������������ `ConditionMessage`:

```
public final class ConditionMessage {

    private String message;

    private ConditionMessage() {
        this(null);
    }

    private ConditionMessage(String message) {
        this.message = message;
    }

    ...
}

```

������һ�����ԣ�`message`������������Ƕ�˵����Ϣ�İ�װ��

### 3. `@ConditionalOnClass`: `OnClassCondition#getMatchOutcome`

���������������� `OnClassCondition` ��ƥ���߼���ֱ�ӽ��� `getMatchOutcome` ������

```
public ConditionOutcome getMatchOutcome(ConditionContext context, AnnotatedTypeMetadata metadata) {
    ClassLoader classLoader = context.getClassLoader();
    ConditionMessage matchMessage = ConditionMessage.empty();
    // 1\. ���� @ConditionalOnClass ע��
    List<String> onClasses = getCandidates(metadata, ConditionalOnClass.class);
    if (onClasses != null) {
        // 1.1 ���������ж�
        List<String> missing = filter(onClasses, ClassNameFilter.MISSING, classLoader);
        if (!missing.isEmpty()) {
            // 1.2 �������ؽ������ƥ������
            return ConditionOutcome.noMatch(ConditionMessage.forCondition(ConditionalOnClass.class)
                    .didNotFind("required class", "required classes").items(Style.QUOTE, missing));
        }
        matchMessage = matchMessage.andCondition(ConditionalOnClass.class)
                .found("required class", "required classes")
                .items(Style.QUOTE, filter(onClasses, ClassNameFilter.PRESENT, classLoader));
    }

    // 2\. ���� @ConditionalOnMissingClass ע��
    List<String> onMissingClasses = getCandidates(metadata, ConditionalOnMissingClass.class);
    if (onMissingClasses != null) {
        // 2.1 ���������ж�
        List<String> present = filter(onMissingClasses, ClassNameFilter.PRESENT, classLoader);
        if (!present.isEmpty()) {
            // 2.2 �������ؽ������ƥ������
            return ConditionOutcome.noMatch(ConditionMessage
                    .forCondition(ConditionalOnMissingClass.class)
                    .found("unwanted class", "unwanted classes").items(Style.QUOTE, present));
        }
        matchMessage = matchMessage.andCondition(ConditionalOnMissingClass.class)
                .didNotFind("unwanted class", "unwanted classes")
                .items(Style.QUOTE, filter(onMissingClasses, ClassNameFilter.MISSING, classLoader));
    }
    // ��󷵻�ƥ��Ľ��
    return ConditionOutcome.match(matchMessage);
}

```

�������ͬʱ������ `@ConditionalOnClass` �� `@ConditionalOnMissingClass` ����ע�⣬�������̼������ƣ�����ע��������ж϶���ͨ�� `FilteringSpringBootCondition#filter` �������£�

```
protected final List<String> filter(Collection<String> classNames, ClassNameFilter classNameFilter,
        ClassLoader classLoader) {
    if (CollectionUtils.isEmpty(classNames)) {
        return Collections.emptyList();
    }
    List<String> matches = new ArrayList<>(classNames.size());
    for (String candidate : classNames) {
        // ��������ƥ��
        if (classNameFilter.matches(candidate, classLoader)) {
            matches.add(candidate);
        }
    }
    return matches;
}

```

�ɴ˿ɼ�������� `classNameFilter` ���˹ؼ���

*   ���� `@ConditionalOnClass` ʱ��`classNameFilter` Ϊ `ClassNameFilter.MISSING`
*   ���� `@ConditionalOnMissingClass` ʱ��`classNameFilter` Ϊ `ClassNameFilter.PRESENT`

�����ǽ��� `ClassNameFilter` һ̽���������� `FilteringSpringBootCondition` �����࣬�������£�

```
abstract class FilteringSpringBootCondition extends SpringBootCondition
        implements AutoConfigurationImportFilter, BeanFactoryAware, BeanClassLoaderAware {
    ...
    /**
     * ��� classLoader ���ڣ������ ClassLoader#loadClass ����
     * ������� Class#forName ����
     */
    protected static Class<?> resolve(String className, ClassLoader classLoader) 
            throws ClassNotFoundException {
        if (classLoader != null) {
            return classLoader.loadClass(className);
        }
        return Class.forName(className);
    }

    /**
     * ��������ƥ��
     */
    protected enum ClassNameFilter {

        PRESENT {

            @Override
            public boolean matches(String className, ClassLoader classLoader) {
                return isPresent(className, classLoader);
            }

        },

        MISSING {

            @Override
            public boolean matches(String className, ClassLoader classLoader) {
                return !isPresent(className, classLoader);
            }

        };

        abstract boolean matches(String className, ClassLoader classLoader);

        /**
         * Class �Ƿ����
         * ͨ�����������ʱ���쳣���ж����Ƿ���ڣ�δ�׳��쳣���ʾ�����
         */
        static boolean isPresent(String className, ClassLoader classLoader) {
            if (classLoader == null) {
                classLoader = ClassUtils.getDefaultClassLoader();
            }
            try {
                // ͨ���쳣�������ж��Ƿ���ڸ�class
                resolve(className, classLoader);
                return true;
            }
            catch (Throwable ex) {
                return false;
            }
        }
    }
    ...
}

```

�����������Ǿ������ˣ��ж� `Class` �Ƿ���ڣ�spring ��ͨ������ `ClassLoader.load(String)` �� `Class.forName(String)` �������쳣������ģ�����׳����쳣�ͱ��� `Class` �����ڡ�

�����ܽ��� `@ConditionalOnClass`/`@ConditionalOnMissingClass` �Ĵ���ʽ��**���ߵĴ����඼Ϊ `OnClassCondition`��ͨ������ `ClassLoader.load(String)` �� `Class.forName(String)` �������쳣���ж� `Class` �Ƿ���ڣ�����׳����쳣�ͱ��� `Class` ������**��

### 4. `@ConditionalOnBean`: `OnBeanCondition#getMatchOutcome`

�������� `@ConditionalOnBean` �� ����ֱ�ӽ��� `OnBeanCondition#getMatchOutcome`��

```
public ConditionOutcome getMatchOutcome(ConditionContext context, AnnotatedTypeMetadata metadata) {
    ConditionMessage matchMessage = ConditionMessage.empty();
    MergedAnnotations annotations = metadata.getAnnotations();
    // ���� @ConditionalOnBean
    if (annotations.isPresent(ConditionalOnBean.class)) {
        Spec<ConditionalOnBean> spec = new Spec<>(context, metadata, 
                annotations, ConditionalOnBean.class);
        // ����ƥ��
        MatchResult matchResult = getMatchingBeans(context, spec);
        // ע���ж�����
        if (!matchResult.isAllMatched()) {
            String reason = createOnBeanNoMatchReason(matchResult);
            return ConditionOutcome.noMatch(spec.message().because(reason));
        }
        matchMessage = spec.message(matchMessage).found("bean", "beans").items(Style.QUOTE,
                matchResult.getNamesOfAllMatches());
    }

    // ���� @ConditionalOnSingleCandidate
    if (metadata.isAnnotated(ConditionalOnSingleCandidate.class.getName())) {
        Spec<ConditionalOnSingleCandidate> spec 
                = new SingleCandidateSpec(context, metadata, annotations);
        // ����ƥ��
        MatchResult matchResult = getMatchingBeans(context, spec);
        // ע���ж�����
        if (!matchResult.isAllMatched()) {
            return ConditionOutcome.noMatch(spec.message().didNotFind("any beans").atAll());
        }
        else if (!hasSingleAutowireCandidate(context.getBeanFactory(), 
                matchResult.getNamesOfAllMatches(), spec.getStrategy() == SearchStrategy.ALL)) {
            return ConditionOutcome.noMatch(spec.message().didNotFind("a primary bean from beans")
                    .items(Style.QUOTE, matchResult.getNamesOfAllMatches()));
        }
        matchMessage = spec.message(matchMessage).found("a primary bean from beans")
                .items(Style.QUOTE, matchResult.getNamesOfAllMatches());
    }

    // ���� @ConditionalOnMissingBean
    if (metadata.isAnnotated(ConditionalOnMissingBean.class.getName())) {
        Spec<ConditionalOnMissingBean> spec = new Spec<>(context, metadata, annotations,
                ConditionalOnMissingBean.class);
        // ����ƥ��
        MatchResult matchResult = getMatchingBeans(context, spec);
        // ע���ж�����
        if (matchResult.isAnyMatched()) {
            String reason = createOnMissingBeanNoMatchReason(matchResult);
            return ConditionOutcome.noMatch(spec.message().because(reason));
        }
        matchMessage = spec.message(matchMessage).didNotFind("any beans").atAll();
    }
    return ConditionOutcome.match(matchMessage);
}

```

���Կ������������һ������������ע�������ƥ�䣺`@ConditionalOnBean`��`@ConditionalOnSingleCandidate` �� `@ConditionalOnMissingBean`�����߶�������ͬһ������ `getMatchingBeans(...)` ����ȡƥ������Ȼ��ʹ�� `matchResult.isAllMatched()` �� `matchResult.isAnyMatched()` �������յĽ���жϡ�

#### `OnBeanCondition#getMatchingBeans`

`getMatchingBeans(...)` �Ĵ������£�

```
protected final MatchResult getMatchingBeans(ConditionContext context, Spec<?> spec) {
    ClassLoader classLoader = context.getClassLoader();
    ConfigurableListableBeanFactory beanFactory = context.getBeanFactory();
    boolean considerHierarchy = spec.getStrategy() != SearchStrategy.CURRENT;
    Set<Class<?>> parameterizedContainers = spec.getParameterizedContainers();
    if (spec.getStrategy() == SearchStrategy.ANCESTORS) {
        BeanFactory parent = beanFactory.getParentBeanFactory();
        Assert.isInstanceOf(ConfigurableListableBeanFactory.class, parent,
                "Unable to use SearchStrategy.ANCESTORS");
        beanFactory = (ConfigurableListableBeanFactory) parent;
    }
    MatchResult result = new MatchResult();
    // 1\. ��ȡ ignoreType��ֻ�� @ConditionalOnMissingBean ���������
    Set<String> beansIgnoredByType = getNamesOfBeansIgnoredByType(classLoader, beanFactory, 
            considerHierarchy, spec.getIgnoredTypes(), parameterizedContainers);

    // 2\. ���� types
    for (String type : spec.getTypes()) {
        Collection<String> typeMatches = getBeanNamesForType(classLoader, considerHierarchy, 
                beanFactory, type, parameterizedContainers);
        typeMatches.removeAll(beansIgnoredByType);
        if (typeMatches.isEmpty()) {
            result.recordUnmatchedType(type);
        }
        else {
            result.recordMatchedType(type, typeMatches);
        }
    }

    // 3\. �������ϵ�ע�� @ConditionalOnMissingBean ���������
    for (String annotation : spec.getAnnotations()) {
        Set<String> annotationMatches = getBeanNamesForAnnotation(classLoader, beanFactory, 
                annotation, considerHierarchy);
        annotationMatches.removeAll(beansIgnoredByType);
        if (annotationMatches.isEmpty()) {
            result.recordUnmatchedAnnotation(annotation);
        }
        else {
            result.recordMatchedAnnotation(annotation, annotationMatches);
        }
    }

    // 4\. ���� beanName
    for (String beanName : spec.getNames()) {
        if (!beansIgnoredByType.contains(beanName) && containsBean(beanFactory, beanName, 
                considerHierarchy)) {
            result.recordMatchedName(beanName);
        }
        else {
            result.recordUnmatchedName(beanName);
        }
    }
    return result;
}

```

��Ҫ˵�����ǣ���������ᴦ�� 3 ��ע���ƥ�����`@ConditionalOnBean`��`@ConditionalOnSingleCandidate` �� `@ConditionalOnMissingBean`�����������£�

1.  ��ȡ `ignoreType`��ֻ�� `@ConditionalOnMissingBean` ���������
2.  ���� `types` ��ƥ�����
3.  ����ע�⣨���ϵ�ע�⣩��ƥ����� ֻ�� `@ConditionalOnMissingBean` ���������
4.  ���� `beanName` ��ƥ�����

�������ϲ���ľ���ϸ�ڣ����ľͲ�����չ���ˣ�������ṩ���̣�

1.  ��ȡ `ignoreType`��
    1.  ʹ�� `ListableBeanFactory#getBeanNamesForType(Class, boolean, boolean)` ������ȡ���������е� `ignoreType` �� `beanName`
    2.  ���Ϊ `beansIgnoredByType`(������ `Set<String>`)
2.  ���� `types` ��ƥ�����
    1.  ʹ�� `ListableBeanFactory#getBeanNamesForType(Class, boolean, boolean)` ������ȡ���������е� `type` ��Ӧ�� `beanName`�����Ϊ `typeMatches`
    2.  �� `typeMatches` �е�ֵȥ�� `ignoreType`
    3.  �жϵڶ����õ��� `typeMatches`���������Ϊ�գ�����ǰ `Type` ���浽 `unmatchedTypes` �У����򱣴浽 `matchedTypes` �� `namesOfAllMatches` ��
3.  ����ע���ƥ�����
    1.  ʹ�� `ListableBeanFactory#getBeanNamesForAnnotation` ������ȡ���������е� `annotation` ��Ӧ�� `beanName`�����Ϊ `annotationMatches`
    2.  �� `annotationMatches` �е�ֵȥ�� `ignoreType`
    3.  �жϵڶ����õ��� `annotationMatches`���������Ϊ�գ�����ǰ `Annotation` ���浽 `unmatchedAnnotations` �У����򱣴浽 `matchedAnnotations` �� `namesOfAllMatches` ��
4.  ���� `beanName` ��ƥ�����
    1.  �ж� `beansIgnoredByType` �Ƿ���� `beanName`
    2.  ʹ�� `BeanFactory#containsBean` �����ж��������и� `beanName`
    3.  ����� 2 �����Ϊ `false`���ڶ������Ϊ `true`���򽫵�ǰ `beanName` ���뵽 `matchedNames` �� `namesOfAllMatches`�����򱣴浽 `unmatchedNames` ��

�õ� `matchedTypes`��`unmatchedNames` �����ݺ�`matchResult.isAllMatched()` �� `matchResult.isAnyMatched()` ���յ��жϽ�������ж���Щ�ṹ�Ƿ�գ�

```
boolean isAllMatched() {
    return this.unmatchedAnnotations.isEmpty() && this.unmatchedNames.isEmpty()
            && this.unmatchedTypes.isEmpty();
}

boolean isAnyMatched() {
    return (!this.matchedAnnotations.isEmpty()) || (!this.matchedNames.isEmpty())
            || (!this.matchedTypes.isEmpty());
}

```

������`@ConditionalOnBean`/`@ConditionalOnMissingBean` �Ĺؼ�������ʹ�� `ListableBeanFactory#getBeanNamesForType` �� `BeanFactory#containsBean` ���ж� `beanName`��`beanType` �Ƿ�����ˡ�

��ʹ�� `@ConditionalOnBean`/`@ConditionalOnMissingBean` ʱ����һ������Ҫ�ر�ע�⣺����ע���ִ��ʱ������ spring �� `ConfigurationClassPostProcessor` �еģ�ȷ�е�˵�����ڽ� `bean` ���뵽 `beanFactory` �� `beanDefinitionMap` ֮ǰ�жϵģ����������������ӵ� `beanDefinitionMap` �У�����Ͳ���ӡ������͵�����һ�����⣺����� `@ConditionalOnBean`/`@ConditionalOnMissingBean` �� `bean` �ڸ� `bean` ֮����뵽 `beanDefinitionMap` �У����п��ܳ������У�����˵����

�����������ࣺ

```
@Component
@ConditionalOnMissingBean("b")
public class A {

}

@Component
public class B {

}

```

���� `A` �� `B` ������� `@Component`���������� spring bean��Ȼ���� `A` �������ע�� `@ConditionalOnMissingBean("b")`�������� `b` ������ʱ��`A` �Ž��г�ʼ����������Щǰ�ᣬ���������������������

1.  ��� `b` ����ӵ� `beanDefinitionMap` �У��ڽ� `a` ��ӵ� `beanDefinitionMap` ʱ������ `b` �Ѿ������ˣ����ǾͲ�����ˣ��������ǵ�Ԥ�ڣ�
2.  ��� `a` �ȱ����������ʱ������ `beanDefinitionMap` �в�û�� `b`������ `a` ����ӵ� `beanDefinitionMap` �У��ٴ��� `b`��`b` Ҳ�ᱻ��ӵ� `beanDefinitionMap`������һ����`a` �� `b` ͬʱ������ `beanDefinitionMap` �У����ն��ᱻ��ʼ���� spring bean���������ǵ�Ԥ�ڲ�����

��ô springboot ��ν�����������أ����������� `@ConditionalOnBean`/`@ConditionalOnMissingBean` ��˵����

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-30df67cb01c73a6b201695298aad14fd0a5.png)

��΢�������£�

������ֻ��ƥ�䵽ĿǰΪֹ��Ӧ�ó����������е� bean �����������ˣ�ǿ�ҽ�������Զ���������ʹ�á������ѡ bean Ҫ����һ���Զ������´�������ȷ��ʹ�ô������������ڴ�֮�����С�

���������ݣ��ҵĽ�����£�

*   �� `@ConditionalOnBean`/`@ConditionalOnMissingBean` ��� `bean` ���뵽 `beanDefinitionMap` ��һ�̣���ƥ��ĿǰΪֹ `beanDefinitionMap` ���Ѵ��ڵ� bean����֮������ bean �����ǣ�����п���������У����Բο�����ٵ� `a` �� `b` ������
*   ǿ�ҽ�������Զ���������ʹ�� `@ConditionalOnBean`/`@ConditionalOnMissingBean` ������ע�⣬Ҳ����˵���Զ���������ʹ�õĻ�������ȷ����ƥ��
*   ����������� `a` �� `b` ��������� `a` �� `b` �ֱ�λ�ڲ�ͬ���Զ��������У���ô `a` ��Ҫ�� `b` ֮����ص� `beanDefinitionMap` �У��������ͨ�� `@AutoConfigureAfter`��`@AutoConfigureBefore`��`@AutoConfigureOrder` ��ע����ָ��

�����Զ�������ļ���˳�򣬺������������ɡ�

����ƪ�������ľ��ȵ������ˣ���ƪ��������ʣ�µ�����ע�⡣

* * *

������ springboot ����ע������ĵڶ�ƪ�����������ܽ��� springboot �ļ��������ܽ᣺

| ע������              | ע������                                                     | �����ж���                  |
| --------------------- | ------------------------------------------------------------ | --------------------------- |
| class ����ע��        | `@ConditionalOnClass`/`@ConditionalOnMissingClass`           | `OnClassCondition`          |
| bean ����ע��         | `@ConditionalOnBean`/`@ConditionalOnMissingBean`             | `OnBeanCondition`           |
| ��������ע��          | `@ConditionalOnProperty`                                     | `OnPropertyCondition`       |
| Resource ����ע��     | `@ConditionalOnResource`                                     | `OnResourceCondition`       |
| Web Ӧ������ע��      | `@ConditionalOnWebApplication` / `@ConditionalOnNotWebApplication` | `OnWebApplicationCondition` |
| spring ���ʽ����ע�� | `@ConditionalOnExpression`                                   | `OnExpressionCondition`     |

���ļ������������жϡ�

### 5. `@ConditionalOnProperty`��`OnPropertyCondition#getMatchOutcome`

������������ `@ConditionalOnProperty` �Ĵ������� `OnPropertyCondition#getMatchOutcome` ������

```
class OnPropertyCondition extends SpringBootCondition {

    @Override
    public ConditionOutcome getMatchOutcome(ConditionContext context, 
            AnnotatedTypeMetadata metadata) {
        // ��ȡ @ConditionalOnProperty ������ֵ
        List<AnnotationAttributes> allAnnotationAttributes = annotationAttributesFromMultiValueMap(
                metadata.getAllAnnotationAttributes(ConditionalOnProperty.class.getName()));
        List<ConditionMessage> noMatch = new ArrayList<>();
        List<ConditionMessage> match = new ArrayList<>();
        for (AnnotationAttributes annotationAttributes : allAnnotationAttributes) {
            // �� determineOutcome(...) �����н����жϣ�ע�������context.getEnvironment()
            ConditionOutcome outcome = determineOutcome(annotationAttributes, 
                    context.getEnvironment());
            (outcome.isMatch() ? match : noMatch).add(outcome.getConditionMessage());
        }
        if (!noMatch.isEmpty()) {
            return ConditionOutcome.noMatch(ConditionMessage.of(noMatch));
        }
        return ConditionOutcome.match(ConditionMessage.of(match));
    }

    ...

}

```

����������ǱȽϼ򵥵ģ����ǻ�ȡ `@ConditionalOnProperty` ������ֵ���ٵ��� `determineOutcome(...)` �������д����������ٽ��� `OnPropertyCondition#determineOutcome` ������

```
/**
 * ������
 * ע�⣺resolver ����ĵ��� Environment������� applicationContext �е� Environment
 */
private ConditionOutcome determineOutcome(AnnotationAttributes annotationAttributes, 
        PropertyResolver resolver) {
    Spec spec = new Spec(annotationAttributes);
    List<String> missingProperties = new ArrayList<>();
    List<String> nonMatchingProperties = new ArrayList<>();
    // �������
    spec.collectProperties(resolver, missingProperties, nonMatchingProperties);
    // �жϽ��
    if (!missingProperties.isEmpty()) {
        return ConditionOutcome.noMatch(ConditionMessage
            .forCondition(ConditionalOnProperty.class, spec)
            .didNotFind("property", "properties").items(Style.QUOTE, missingProperties));
    }
    // �жϽ��
    if (!nonMatchingProperties.isEmpty()) {
        return ConditionOutcome.noMatch(ConditionMessage
            .forCondition(ConditionalOnProperty.class, spec)
            .found("different value in property", "different value in properties")
            .items(Style.QUOTE, nonMatchingProperties));
    }
    // �жϽ��
    return ConditionOutcome.match(ConditionMessage
        .forCondition(ConditionalOnProperty.class, spec).because("matched"));
}

/**
 * ��������
 */
private void collectProperties(PropertyResolver resolver, List<String> missing, 
        List<String> nonMatching) {
    for (String name : this.names) {
        String key = this.prefix + name;
        // resolver ����� environment
        // properties �����жϾ����ж� environment ����û����Ӧ����
        if (resolver.containsProperty(key)) {
            if (!isMatch(resolver.getProperty(key), this.havingValue)) {
                nonMatching.add(name);
            }
        }
        else {
            if (!this.matchIfMissing) {
                missing.add(name);
            }
        }
    }
}

```

���Կ�����`@ConditionalOnProperty` ������ͨ���ж� `environment` ���Ƿ��и����������������жϵġ�

### 6. `@ConditionalOnResource`��`OnResourceCondition#getMatchOutcome`

������������ `@ConditionalOnResource` �Ĵ���һ����������ʹ�ã�

```
@Bean
@ConditionalOnResource(resources = "classpath:config.properties")
public Config config() {
    return config;
}

```

��ʾ�� `classpath` �д��� `config.properties` ʱ��`config` �Żᱻ��ʼ�� springbean��

�ٽ��� `OnResourceCondition#getOutcomes` ������

```
@Override
public ConditionOutcome getMatchOutcome(ConditionContext context, AnnotatedTypeMetadata metadata) {
    MultiValueMap<String, Object> attributes = metadata
            .getAllAnnotationAttributes(ConditionalOnResource.class.getName(), true);
    // ��ȡ ResourceLoader
    ResourceLoader loader = context.getResourceLoader();
    List<String> locations = new ArrayList<>();
    collectValues(locations, attributes.get("resources"));
    Assert.isTrue(!locations.isEmpty(),
            "@ConditionalOnResource annotations must specify at least one resource location");
    List<String> missing = new ArrayList<>();
    // �����ж���Դ�Ƿ����
    for (String location : locations) {
        // location �п�����ռλ���������ﴦ��
        String resource = context.getEnvironment().resolvePlaceholders(location);
        // �ж� resource �Ƿ����
        if (!loader.getResource(resource).exists()) {
            missing.add(location);
        }
    }
    // ������
    if (!missing.isEmpty()) {
        return ConditionOutcome.noMatch(ConditionMessage.forCondition(ConditionalOnResource.class)
                .didNotFind("resource", "resources").items(Style.QUOTE, missing));
    }
    return ConditionOutcome.match(ConditionMessage.forCondition(ConditionalOnResource.class)
            .found("location", "locations").items(locations));
}

```

����ͨ�� `OnResourceCondition#getOutcomes` ��������ȡ `ResourceLoader`��ͨ�����Է�ʽ���ֵ�ǰ�� `ResourceLoader` Ϊ `AnnotationConfigServletWebServerApplicationContext`��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-8f1de99f757eca7aeb0307b06b28d1020d2.png)

��ȡ�� `ResourceLoader` �󣬵��� `ResourceLoader#getResource(String)` ����ȡ��Դ��Ȼ����� `Resource#exists` ���ж���Դ�Ƿ���ڣ������ƥ������

�������̵Ĺؼ����� `ResourceLoader#getResource(String)`�������������÷����Ĵ������뵽 `GenericApplicationContext#getResource` ������

```
@Override
public Resource getResource(String location) {
    if (this.resourceLoader != null) {
        return this.resourceLoader.getResource(location);
    }
    return super.getResource(location);
}

```

����� `this.resourceLoader` Ϊ `null`�����븸��ķ��� `DefaultResourceLoader#getResource`��

```
public Resource getResource(String location) {
    Assert.notNull(location, "Location must not be null");
    for (ProtocolResolver protocolResolver : getProtocolResolvers()) {
        Resource resource = protocolResolver.resolve(location, this);
        if (resource != null) {
            return resource;
        }
    }
    // ����/��ͷ����Դ
    if (location.startsWith("/")) {
        return getResourceByPath(location);
    }
    else if (location.startsWith(CLASSPATH_URL_PREFIX)) {
        // ����classpath��ͷ����Դ
        return new ClassPathResource(
            location.substring(CLASSPATH_URL_PREFIX.length()), getClassLoader());
    }
    else {
        try {
            // ���϶������㣬ʹ�� url ������
            URL url = new URL(location);
            return (ResourceUtils.isFileURL(url) 
                ? new FileUrlResource(url) : new UrlResource(url));
        }
        catch (MalformedURLException ex) {
            // url�����������⣬���ջ����� getResourceByPath(...) ������
            return getResourceByPath(location);
        }
    }
}

/**
 * ͨ��·���õ� Resource
 */
protected Resource getResourceByPath(String path) {
    return new ClassPathContextResource(path, getClassLoader());
}

```

���Կ�����`DefaultResourceLoader#getResource` ͨ���ж� `location` ��ǰ׺���õ��� 4 �� `Resource`��

*   `ClassPathContextResource`
*   `FileUrlResource`
*   `UrlResource`

�õ� `Resource` �󣬽��ž����жϸ� `Resource` �Ƿ�����ˣ������������� `ClassPathContextResource#exist` �������÷����� `ClassPathResource#exists`��

```
/**
 * �ж� Resource �Ƿ����
 */
@Override
public boolean exists() {
    return (resolveURL() != null);
}

/**
 * ��Դ�ܻ�ȡ�����򷵻���Դ��Ӧ��url�����򷵻�null
 */
@Nullable
protected URL resolveURL() {
    if (this.clazz != null) {
        // ʹ�õ�ǰ�� class ��Ӧ�� classLoader ����ȡ
        return this.clazz.getResource(this.path);
    }
    else if (this.classLoader != null) {
        // ʹ��ָ���� classLoader ����ȡ
        return this.classLoader.getResource(this.path);
    }
    else {
        // ��ȡϵͳ���������ȡ
        return ClassLoader.getSystemResource(this.path);
    }
}

```

�Ӵ�����Կ�����������ͨ�� `classLoader` ��ȡ�ļ��� `url`��ͨ���ж��ļ� `url` �Ƿ�Ϊ `null` ���ж� `resource` �Ƿ���ڡ�

�������� `FileUrlResource` ���жϣ�ʵ���� `FileUrlResource` �� `UrlResource` �� `exist()` �������� `AbstractFileResolvingResource#exists`������ͳһ�����Ϳ����ˣ��÷����������£�

```
public boolean exists() {
    try {
        URL url = getURL();
        if (ResourceUtils.isFileURL(url)) {
            // ������ļ���ֱ���ж��ļ��Ƿ����
            return getFile().exists();
        }
        else {
            // ����ʹ�������ļ�������
            URLConnection con = url.openConnection();
            customizeConnection(con);
            HttpURLConnection httpCon =
                    (con instanceof HttpURLConnection ? (HttpURLConnection) con : null);
            // �����http�����жϿ������ӷ��ص�״̬��
            if (httpCon != null) {
                int code = httpCon.getResponseCode();
                if (code == HttpURLConnection.HTTP_OK) {
                    return true;
                }
                else if (code == HttpURLConnection.HTTP_NOT_FOUND) {
                    return false;
                }
            }
            // ���� contentLengthLong ����0��Ҳ������true
            if (con.getContentLengthLong() > 0) {
                return true;
            }
            if (httpCon != null) {
                httpCon.disconnect();
                return false;
            }
            else {
                getInputStream().close();
                return true;
            }
        }
    }
    catch (IOException ex) {
        return false;
    }
}

```

����Ǳ����ļ���ֱ��ʹ�� `File#exists()` �����ж��ļ��Ƿ���ڣ�������ж������ļ��Ƿ���ڣ��жϷ�ʽ����Ͳ�ϸ˵�ˡ�

�ܵ���˵��springboot �� `@ConditionalOnResource` ���жϻ�����Щ���ӵģ������ܽ����£�

1.  ����� `classpath` �ļ���ͨ�� `classloader` ��ȡ�ļ���Ӧ�� `url` �Ƿ�Ϊ `null` ���ж��ļ��Ƿ���ڣ�
2.  �������ͨ�ļ�����ֱ�� `File#exists()` �����ж��ļ��Ƿ���ڣ�
3.  ����������ļ����ȴ�һ���������ӣ��ж��ļ��Ƿ���ڡ�

### 7. `@ConditionalOnWebApplication`��`OnWebApplicationCondition#getMatchOutcome`

������������ `@ConditionalOnWebApplication` �Ĵ������� `OnWebApplicationCondition#getOutcomes` ������

```
@Override
protected ConditionOutcome[] getOutcomes(String[] autoConfigurationClasses,
        AutoConfigurationMetadata autoConfigurationMetadata) {
    ConditionOutcome[] outcomes = new ConditionOutcome[autoConfigurationClasses.length];
    for (int i = 0; i < outcomes.length; i++) {
        String autoConfigurationClass = autoConfigurationClasses[i];
        if (autoConfigurationClass != null) {
            // ������
            outcomes[i] = getOutcome(autoConfigurationMetadata.get(autoConfigurationClass, 
                "ConditionalOnWebApplication"));
        }
    }
    return outcomes;
}

/**
 * ������
 * springboot֧�ֵ�web���������֣�SERVLET��REACTIVE
 */
private ConditionOutcome getOutcome(String type) {
    if (type == null) {
        return null;
    }
    ConditionMessage.Builder message = ConditionMessage
            .forCondition(ConditionalOnWebApplication.class);
    // ���ָ���������� SERVLET
    if (ConditionalOnWebApplication.Type.SERVLET.name().equals(type)) {
        if (!ClassNameFilter.isPresent(SERVLET_WEB_APPLICATION_CLASS, getBeanClassLoader())) {
            return ConditionOutcome.noMatch(
                message.didNotFind("servlet web application classes").atAll());
        }
    }
    // ���ָ���������� REACTIVE
    if (ConditionalOnWebApplication.Type.REACTIVE.name().equals(type)) {
        if (!ClassNameFilter.isPresent(REACTIVE_WEB_APPLICATION_CLASS, getBeanClassLoader())) {
            return ConditionOutcome.noMatch(
                message.didNotFind("reactive web application classes").atAll());
        }
    }
    // ���û��ָ��web����
    if (!ClassNameFilter.isPresent(SERVLET_WEB_APPLICATION_CLASS, getBeanClassLoader())
            && !ClassUtils.isPresent(REACTIVE_WEB_APPLICATION_CLASS, getBeanClassLoader())) {
        return ConditionOutcome.noMatch(
            message.didNotFind("reactive or servlet web application classes").atAll());
    }
    return null;
}

```

��������ܼ򵥣������߼�Ϊ������ `@ConditionalOnWebApplication` ��ָ�������ͣ��ж϶�Ӧ�����Ƿ���ڣ��жϷ�ʽ�� `@ConditionalOnClass` �ж����Ƿ����һ�£����������Ͷ�Ӧ�������£�

*   Servlet��`org.springframework.web.context.support.GenericWebApplicationContext`
*   Reactive��`org.springframework.web.reactive.HandlerResult`

### 8. `@ConditionalOnExpression`��`OnExpressionCondition#getMatchOutcome`

������������ `@ConditionalOnExpression` �Ĵ������� `OnExpressionCondition#getOutcomes` ������

```
/**
 * ����ƥ����
 */
@Override
public ConditionOutcome getMatchOutcome(ConditionContext context, 
        AnnotatedTypeMetadata metadata) {
    // ��ȡ���ʽ
    String expression = (String) metadata.getAnnotationAttributes(
            ConditionalOnExpression.class.getName()).get("value");
    expression = wrapIfNecessary(expression);
    ConditionMessage.Builder messageBuilder = ConditionMessage
            .forCondition(ConditionalOnExpression.class, "(" + expression + ")");
    // ����ռλ��
    expression = context.getEnvironment().resolvePlaceholders(expression);
    ConfigurableListableBeanFactory beanFactory = context.getBeanFactory();
    if (beanFactory != null) {
        // ������ʽ��ֵ
        boolean result = evaluateExpression(beanFactory, expression);
        return new ConditionOutcome(result, messageBuilder.resultedIn(result));
    }
    return ConditionOutcome.noMatch(messageBuilder.because("no BeanFactory available."));
}

/**
 * ������ʽ��ֵ
 */
private Boolean evaluateExpression(ConfigurableListableBeanFactory beanFactory, 
        String expression) {
    BeanExpressionResolver resolver = beanFactory.getBeanExpressionResolver();
    if (resolver == null) {
        resolver = new StandardBeanExpressionResolver();
    }
    // ������������ʽ��ֵ
    BeanExpressionContext expressionContext = new BeanExpressionContext(beanFactory, null);
    Object result = resolver.evaluate(expression, expressionContext);
    return (result != null && (boolean) result);
}

```

���Կ�����springboot ������ͨ�� `BeanExpressionResolver#evaluate` ������������ʽ��������� spring ���ʽ�����ľͲ�չ�������ˡ�

���ˣ�spring ����ע��ķ����͵������ˣ���Ҫ˵�����ǣ�springboot �� ����������ע�⣺

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-0e8d27c887fb6ca142672cad1c60e9de207.png)

��Щע����жϷ�ʽ�뱾�ĵķ�ʽ�����ƣ��Ͳ�һһ���з����ˡ�

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4921590](https://my.oschina.net/funcy/blog/4921590) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_