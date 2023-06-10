�� [springboot �Զ�װ��֮����ע�⣨һ��](https://my.oschina.net/funcy/blog/4918863)һ���У��ڷ��� `@ConditionalOnBean/@ConditionalOnMissingBean` ע��������ж�ʱ���ٷ�ǿ�ҽ����������Զ�װ������ʹ��������ע�⣬���� `@ConditionalOnBean/@ConditionalOnMissingBean` ��ǵ���Ҫ��ָ������֮���ʼ������ springboot ����������Զ�װ��˳���أ����Ľ����о��¡�

### 1\. springboot �����Զ�װ����Ĺ���

��Ҫ��ȷ���ǣ�����̽�ֵ�`�Զ�װ��˳��`��ָ�� `class` ע�ᵽ `beanFactory` ��˳��springboot �����Զ�װ����Ĵ��¹������£�

1.  �����Զ�װ���࣬�� [springboot �Զ�װ��֮�����Զ�װ����](https://my.oschina.net/funcy/blog/4870868) һ�����ѷ�������
2.  ���Զ�װ��������������Ǳ��Ľ�Ҫ���������ݣ�
3.  �����Զ�װ���࣬��ÿ���Զ�װ������һ�������²�����
    1.  ��������ע���жϵ�ǰ�Զ�װ�����Ƿ�����װ��������
    2.  �����ǰ�Զ�װ��������װ��������ע�ᵽ `beanFactory` �С�

�ٻص� `@ConditionalOnBean/@ConditionalOnMissingBean`�������������Զ�װ���ࣺ

```
// A���Զ�װ����
@Configuration
public class A {
    @Bean
    @ConditionalOnMissingBean("b1")
    public A1 a1() {
        return new A1();
    }
}

// B���Զ�װ����
@Configuration
public class B {
    @Bean
    public B1 b1() {
        return new b1();
    }
}

```

`a1` �� `b1` ��������ͬ���Զ�װ�����г�ʼ������ `a1` ֻ���� `b1` ������ʱ���Ż��ʼ�������������ܽ�� springboot �����Զ�װ����Ĳ��裬����ֻҪָ�� `b1` �� `a1` ֮ǰ��ʼ���Ͳ�������쳣�ˡ�

��ô���Զ�װ�����˳�����ָ���أ�

### 2\. �Զ�װ�����˳�����ע��

springboot Ϊ�����ṩ�������Զ�װ����������ֶΣ�

*   �����Զ�װ��˳�� ����`@AutoConfigOrder`
*   ����Զ�װ��˳�� ����`@AutoConfigureBefore` �� `@AutoConfigureAfter`

������ע��������������Զ�װ�����������ˣ�`@AutoConfigOrder` ָ����װ��˳��ͬ spring �ṩ�� `@Order` ���ƣ�`@AutoConfigureBefore` �� `@AutoConfigureAfter` ����ָ�� `class`����ʾ���ĸ� `class` ֮ǰ��֮��װ�䡣

�ص�ʾ�������ǿ�������ָ��װ��˳��

```
// A���Զ�װ����
@Configuration
// ��B.class֮���Զ�װ��
@AutoConfigureAfter(B.class)
public class A {
    @Bean
    @ConditionalOnMissingBean("b1")
    public A1 a1() {
    ...
    }
}

// B���Զ�װ����
@Configuration
public class B {
    ...
}

```

### 3\. �Զ�װ���������

ǰ�������ᵽ��`@AutoConfigOrder`��`@AutoConfigureBefore` �� `@AutoConfigureAfter` ���Կ����Զ�װ�����װ��˳����ô���������������������أ��� [springboot �Զ�װ��֮�����Զ�װ����](https://my.oschina.net/funcy/blog/4870868) һ���У��������ܽ��˻�ȡ�Զ�װ����Ĳ����� 6 ����

1.  ���� `AutoConfigurationImportSelector#getAutoConfigurationEntry(...)` ���������Զ�װ���ࣻ
2.  ���õ����Զ�װ���ౣ�浽 `autoConfigurationEntries` �У�
3.  �õ������࣬��Щ����������� `@EnableAutoConfiguration` �� `exclude` �� `excludeName` ָ���ģ�
4.  �� `autoConfigurationEntries` ת��Ϊ `LinkedHashSet`�����Ϊ `processedConfigurations`��
5.  ȥ�� `processedConfigurations` ��Ҫ���˵��ࣻ
6.  ���� 5 ���õ���������󣬷��ء�

�����Զ�װ��������������ڵ� 6 ������Ӧ�ķ����� `AutoConfigurationImportSelector.AutoConfigurationGroup#sortAutoConfigurations`���������£�

```
private List<String> sortAutoConfigurations(Set<String> configurations,
        AutoConfigurationMetadata autoConfigurationMetadata) {
    // �ȴ����� AutoConfigurationSorter ����
    // Ȼ����� AutoConfigurationSorter.getInPriorityOrder ��������
    return new AutoConfigurationSorter(getMetadataReaderFactory(), autoConfigurationMetadata)
            .getInPriorityOrder(configurations);
}

```

��������Ĵ����Ϊ������

1.  ������ `AutoConfigurationSorter` ����
2.  ���� `AutoConfigurationSorter.getInPriorityOrder` ��������

������������ `AutoConfigurationSorter` �Ĵ���������

```
class AutoConfigurationSorter {

    private final MetadataReaderFactory metadataReaderFactory;

    private final AutoConfigurationMetadata autoConfigurationMetadata;

    /**
     * ���췽��
     * ����ֻ�ǶԴ���Ĳ������и�ֵ�������Ǹ�ֵΪ��Ա����
     */
    AutoConfigurationSorter(MetadataReaderFactory metadataReaderFactory,
            AutoConfigurationMetadata autoConfigurationMetadata) {
        Assert.notNull(metadataReaderFactory, "MetadataReaderFactory must not be null");
        this.metadataReaderFactory = metadataReaderFactory;
        this.autoConfigurationMetadata = autoConfigurationMetadata;
    }

    ...

}

```

���Կ�����`AutoConfigurationSorter` �Ĺ��췽����û����ʲôʵ���ԵĲ�������������Ĺؼ����ÿ� `AutoConfigurationSorter.getInPriorityOrder` �������÷����Ĵ������£�

```
List<String> getInPriorityOrder(Collection<String> classNames) {
    // 1\. �� classNames ��װ�� AutoConfigurationClasses
    AutoConfigurationClasses classes = new AutoConfigurationClasses(this.metadataReaderFactory,
            this.autoConfigurationMetadata, classNames);
    List<String> orderedClassNames = new ArrayList<>(classNames);
    // 2\. ����������
    Collections.sort(orderedClassNames);
    // 3\. ʹ�� @AutoConfigureOrder ����
    orderedClassNames.sort((o1, o2) -> {
        int i1 = classes.get(o1).getOrder();
        int i2 = classes.get(o2).getOrder();
        return Integer.compare(i1, i2);
    });
    // 4\. ʹ�� @AutoConfigureBefore��@AutoConfigureAfter ����
    orderedClassNames = sortByAnnotation(classes, orderedClassNames);
    return orderedClassNames;
}

```

�Ӵ����� �������������ִ�в������£�

1.  �� `classNames` ��װ�� `AutoConfigurationClasses`
2.  ����������
3.  ʹ�� `@AutoConfigureOrder` ����
4.  ʹ�� `@AutoConfigureBefore`��`@AutoConfigureAfter` ����

����������򹲽����� 3 �Σ����Ƕ� `orderedClassNames` ������������һ�����������������ǰ����������ȵ������ǰ���������Ҳ����˵�����û��ָ�� `@AutoConfigureOrder`��`@AutoConfigureBefore` ��ע�⣬�ͻ�ʹ��������������

���������Ǿ�������⼸�������ɡ�

### 4\. �� `classNames` ��װ�� `AutoConfigurationClasses`

�ò���λ�� `AutoConfigurationSorter.AutoConfigurationClasses#AutoConfigurationClasses` �������������£�

```
private static class AutoConfigurationClasses {

    // ������
    private final Map<String, AutoConfigurationClass> classes = new HashMap<>();

    /**
     * ���췽��
     */
    AutoConfigurationClasses(MetadataReaderFactory metadataReaderFactory,
            AutoConfigurationMetadata autoConfigurationMetadata, Collection<String> classNames) {
        // ���з�������
        addToClasses(metadataReaderFactory, autoConfigurationMetadata, classNames, true);
    }

    /**
     * ����࣬���ǽ����װ�� AutoConfigurationClass����ӵ���Ϊ classes �� Map ��
     * classNames ����ȥ�����ų���������Զ�װ����
     */
    private void addToClasses(MetadataReaderFactory metadataReaderFactory,
            AutoConfigurationMetadata autoConfigurationMetadata, Collection<String> classNames, 
            boolean required) {
        for (String className : classNames) {
            if (!this.classes.containsKey(className)) {
                // �� className ��װ�� AutoConfigurationClass
                AutoConfigurationClass autoConfigurationClass = new AutoConfigurationClass(
                        className, metadataReaderFactory, autoConfigurationMetadata);
                boolean available = autoConfigurationClass.isAvailable();
                // @AutoConfigureBefore �� @AutoConfigureAfter ��ǵ���� required Ϊ false
                if (required || available) {
                    this.classes.put(className, autoConfigurationClass);
                }
                if (available) {
                    // �ݹ����
                    addToClasses(metadataReaderFactory, autoConfigurationMetadata,
                            autoConfigurationClass.getBefore(), false);
                    addToClasses(metadataReaderFactory, autoConfigurationMetadata,
                            autoConfigurationClass.getAfter(), false);
                }
            }
        }
    }
    ...
}

```

�����ϴ���������

*   `AutoConfigurationClasses` ����һ����Ա������`classes`�������� `Map`��`key` �� `String`��Ҳ���� `className`����`value` �� `AutoConfigurationClass`��Ҳ���� `className` �İ����ࣩ;
*   `AutoConfigurationClasses` �Ĺ��췽������� `addToClasses(...)` �÷������������� `classNames`�������װ�� `AutoConfigurationClass` ���ٱ��浽 `classes` �С�

�ڷ��� `addToClasses(...)` �ľ����߼�ǰ�������������� `AutoConfigurationClass` �Ǹ�ɶ��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-fd9c1a4c335951391a33f86a86fe89ff496.png)

���Կ��� ��`AutoConfigurationClass` �������İ�װ�����һ������� `@AutoConfigureBefore` �� `@AutoConfigureAfter` ָ�����࣬�Լ��ṩ�˸� `@AutoConfigureOrder`�� `@AutoConfigureBefore`��`@AutoConfigureAfter` ��ص�һЩ������

�����ٻع�ͷ�� `addToClasses(...)` ��ִ�����̣��÷�����ִ���������£�

1.  ��������� `classNames`��������ÿһ�� `className`����������Ĳ�����
2.  ���� `AutoConfigurationClass`������ `className`��
3.  ���� `AutoConfigurationSorter.AutoConfigurationClass#isAvailable` �������õ� `available`��
4.  �ж� `available` �� `required` ��ֵ�������һΪ ture���ͽ�����ӵ� `classes`��
5.  ��� `available` Ϊ `true`���ݹ鴦�� `className` �� `@AutoConfigureBefore` �� `@AutoConfigureAfter` ָ�����ࡣ

���̿��Ų����ӣ������м�����ȥ��Ҫ������ ��

1.  `AutoConfigurationSorter.AutoConfigurationClass#isAvailable`���жϵ�ǰ `class` �Ƿ����
2.  `AutoConfigurationSorter.AutoConfigurationClass#getBefore`����ȡ `class`����ǰ `class` ��Ҫ����Щ `class` ֮ǰ����
3.  `AutoConfigurationSorter.AutoConfigurationClass#getAfter`����ȡ `class`����ǰ `class` ��Ҫ����Щ `class` ֮����

����������һһ���������⼸��������

#### 4.1 `AutoConfigurationSorter.AutoConfigurationClass#isAvailable`

��������������жϵ�ǰ `class` �Ƿ��ڵ�ǰ��Ŀ�� `classpath` �У������룺

```
boolean isAvailable() {
    try {
        if (!wasProcessed()) {
            getAnnotationMetadata();
        }
        return true;
    }
    catch (Exception ex) {
        return false;
    }
}

```

����������벻�࣬���ǵ��� `wasProcessed()` �������ٵ��� `getAnnotationMetadata()`����Ҫע����ǣ�`getAnnotationMetadata()` ���ܻ��׳��쳣����Ƹ�쳣Ҳ�᷵�� `false`.

���Ǽ������� `AutoConfigurationSorter.AutoConfigurationClass#wasProcessed` ������

```
private boolean wasProcessed() {
    return (this.autoConfigurationMetadata != null
        // �ж� META-INF/spring-autoconfigure-metadata.properties �ļ����Ƿ���ڸ�����
        && this.autoConfigurationMetadata.wasProcessed(this.className));
}

```

�����������Ҫ������ `AutoConfigurationMetadataLoader.PropertiesAutoConfigurationMetadata#wasProcessed` �������жϣ�

```
@Override
public boolean wasProcessed(String className) {
    // �ж� properties �Ƿ���ڶ�Ӧ�� className
    return this.properties.containsKey(className);
}

```

���Կ�����������������ж� `properties` ���Ƿ��������� `className`��`properties` ������������ `META-INF/spring-autoconfigure-metadata.properties`������ʾ�����£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-069444fdaa952c6fa8c39576e776275982b.png)

��Ҫע����ǣ����ļ���Դ�����ǲ����ڵģ������ڱ���ʱд��ģ����ڸ��ļ���д�롢���ص� `properties` �����̣����ľͲ�չ�������ˣ������ṩ�����˼·��

*   �ļ���д�룺�ڴ������ʱ��springboot �Ὣ�Զ�װ�����һЩ��Ϣ (���磬`@ConditionalOnClass` ָ���� `class`��`@ConditionalOnBean` ָ���� `bean`��`@AutoConfigureBefore` �� `@AutoConfigureAfter` ��ָ���� `class` ��) д�뵽 `META-INF/spring-autoconfigure-metadata.properties` �ļ��У�������Ϊ `AutoConfigureAnnotationProcessor`��������� `javax.annotation.processing.AbstractProcessor` �����࣬�� `AbstractProcessor` �� jdk �ṩ�������ڱ����ڶ�ע����д���

*   �ļ��ļ��أ��� `AutoConfigurationImportSelector.AutoConfigurationGroup#process` �����е��� `AutoConfigurationImportSelector#getAutoConfigurationEntry` ʱ���ᴫ�� `AutoConfigurationMetadata`���ļ� `META-INF/spring-autoconfigure-metadata.properties` �е����ݾ��Ǵ�������ص� `AutoConfigurationMetadataLoader.PropertiesAutoConfigurationMetadata#properties` �еģ�

��Щ�ɼ���`AutoConfigurationMetadataLoader.PropertiesAutoConfigurationMetadata#wasProcessed` ����ʵ���Ͼ����ж� `META-INF/spring-autoconfigure-metadata.properties` �ļ����Ƿ��� `className` �����á�

�����ǻص� `AutoConfigurationSorter.AutoConfigurationClass#isAvailable`������������һ��������`getAnnotationMetadata()`���÷���λ�� `AutoConfigurationSorter.AutoConfigurationClass` �У��������£�

```
private AnnotationMetadata getAnnotationMetadata() {
    if (this.annotationMetadata == null) {
        try {
            // ����`className`��Ӧ����Դ���� className ��Ӧ����Դ������ʱ�����׳��쳣
            MetadataReader metadataReader = this.metadataReaderFactory
                    .getMetadataReader(this.className);
            this.annotationMetadata = metadataReader.getAnnotationMetadata();
        }
        catch (IOException ex) {
            throw new IllegalStateException(...);
        }
    }
    return this.annotationMetadata;
}

```

�������� `SimpleMetadataReaderFactory#getMetadataReader(String)`��

```
@Override
/**
 * ����������ȡ className ��Ӧ�� .class �ļ�
 * ��� .class �ļ������ڣ��ͱ��쳣�ˣ�IOException
 */
public MetadataReader getMetadataReader(String className) throws IOException {
    try {
        // ת�����ƣ�"classpath:xxx/xxx/Xxx.class"
        String resourcePath = ResourceLoader.CLASSPATH_URL_PREFIX 
                + lassUtils.convertClassNameToResourcePath(className) 
                + ClassUtils.CLASS_FILE_SUFFIX;
        // ��ȡ��Դ��Ĭ�ϵ� resourceLoader Ϊ classLoader
        Resource resource = this.resourceLoader.getResource(resourcePath);
        // �� resource ת���� MetadataReader ���󣬲����ھͻ��׳��쳣��IOException
        return getMetadataReader(resource);
    }
    catch (FileNotFoundException ex) {
        // �п������ڲ��࣬�ٰ��ڲ����������ʽ����һ��
        int lastDotIndex = className.lastIndexOf('.');
        if (lastDotIndex != -1) {
            String innerClassName = className.substring(0, lastDotIndex) + '$' 
                    + className.substring(lastDotIndex + 1);
            // ת�����ƣ�"classpath:xxx/Xxx$Xxx.class"
            String innerClassResourcePath = ResourceLoader.CLASSPATH_URL_PREFIX 
                    + ClassUtils.convertClassNameToResourcePath(innerClassName) 
                    + ClassUtils.CLASS_FILE_SUFFIX;
            Resource innerClassResource = this.resourceLoader.getResource(innerClassResourcePath);
            // �ж��Ƿ���ڣ������ڻ��ǻᱨ�쳣�ģ�IOException
            if (innerClassResource.exists()) {
                return getMetadataReader(innerClassResource);
            }
        }
        throw ex;
    }
}

```

��������Ĵ����������£�

1.  ������� `className` ת��Ϊ `classpath:xxx/xxx/Xxx.class` ����ʽ��Ȼ��ȥ���ض�Ӧ����Դ�������Դ�����ڼ� `className` ��Ӧ��`.class` �ļ������ڣ����׳��쳣��
2.  ���쳣�� `catch` ���У�Ϊ�˷�ֹ `className` ���ڲ��࣬�Ὣ `className` ת��Ϊ `classpath:xxx/Xxx$Xxx.class` ����ʽ��Ȼ���ټ���һ����Դ�������Դ���ڣ�ֱ�ӷ��أ������쳣�����ף�

����������Ǿ������ˣ�`getAnnotationMetadata()` ���������жϵ�ǰ `className` ��Ӧ��`.class` ����Ŀ�� `classpath` ·�����Ƿ���ڡ�

�������������������ܽ����£�

*   `AutoConfigurationSorter.AutoConfigurationClass#wasProcessed`����ǰ `className` �Ƿ��� `META-INF/spring-autoconfigure-metadata.properties` �ļ���
*   `AutoConfigurationSorter.AutoConfigurationClass#isAvailable`����ǰ `className` ��Ӧ��`.class` �ļ��Ƿ����

���յĽ��ۣ�`AutoConfigurationSorter.AutoConfigurationClass#isAvailable` ���������жϵ�ǰ `className` ��Ӧ��`.class` �ļ�����Ŀ�� `classpath` ·����.

#### 4.2 `AutoConfigurationSorter.AutoConfigurationClass#getBefore/getAfter`

���������������� `AutoConfigurationSorter.AutoConfigurationClass` �������������`getAfter()` �� `getBefore()`��

```
Set<String> getBefore() {
    if (this.before == null) {
        this.before = (wasProcessed() 
            // ��������� `META-INF/spring-autoconfigure-metadata.properties` �ļ��У�ֱ�ӻ�ȡֵ
            ? this.autoConfigurationMetadata.getSet(this.className, "AutoConfigureBefore", 
                    Collections.emptySet()) 
            // ����� @AutoConfigureBefore ע���ϻ�ȡ
            : getAnnotationValue(AutoConfigureBefore.class));
    }
    return this.before;
}

Set<String> getAfter() {
    if (this.after == null) {
        this.after = (wasProcessed() 
            // ��������� `META-INF/spring-autoconfigure-metadata.properties` �ļ��У�ֱ�ӻ�ȡֵ
            ? this.autoConfigurationMetadata.getSet(this.className, "AutoConfigureAfter", 
                    Collections.emptySet()) 
            // ����� @AutoConfigureAfter ע���ϻ�ȡ
            : getAnnotationValue(AutoConfigureAfter.class));
    }
    return this.after;
}

/**
 * �� @AutoConfigureBefore/@AutoConfigureAfter ע���л�ȡֵ��value �� name ָ����ֵ
 */
private Set<String> getAnnotationValue(Class<?> annotation) {
    Map<String, Object> attributes = getAnnotationMetadata()
            .getAnnotationAttributes(annotation.getName(), true);
    if (attributes == null) {
        return Collections.emptySet();
    }
    Set<String> value = new LinkedHashSet<>();
    Collections.addAll(value, (String[]) attributes.get("value"));
    Collections.addAll(value, (String[]) attributes.get("name"));
    return value;
}

```

�����������ڴ�����ʽ����һ�£��ȿ� `getBefore()` �����̣�

1.  �����ǰ `className` ������ `META-INF/spring-autoconfigure-metadata.properties` �ļ��У�ֱ��ȡֵ��ǰ�����Ҳ�ᵽ��springboot �ڱ���ʱ�����һЩע�����Ϣд�뵽 `META-INF/spring-autoconfigure-metadata.properties` �ļ��У�

2.  ����� 1 �����ɹ�����ӵ�ǰ `class` �� `@AutoConfigureBefore` ȡֵ��

`getAfter()` ������������ `getBefore()` �����̻���һ�£��Ͳ������ˡ�

### 5\. ʹ�� `@AutoConfigureOrder` ����

�����ǻص� `AutoConfigurationSorter#getInPriorityOrder` ���������������� `@AutoConfigureOrder` ��������̣�

```
List<String> getInPriorityOrder(Collection<String> classNames) {
    ...
    orderedClassNames.sort((o1, o2) -> {
        int i1 = classes.get(o1).getOrder();
        int i2 = classes.get(o2).getOrder();
        return Integer.compare(i1, i2);
    });
    ...
}

```

����������ʹ�õ��� `List#sort`��`sort(...)` ��Ĳ���Ϊ `Comparator`��ָ����������򡣴Ӵ���������ͨ�� `getOrder()` ��ȡ����ǰ���˳�����ʹ�õ��� `Integer` �ıȽϹ������������� `getOrder()` ������Ĺؼ��������Ծ͵ķ����� `AutoConfigurationSorter.AutoConfigurationClass#getOrder`���������£�

```
private int getOrder() {
    // �ж� META-INF/spring-autoconfigure-metadata.properties �ļ����Ƿ���ڵ�ǰ className
    if (wasProcessed()) {
        // ������ڣ���ʹ���ļ���ָ����˳�򣬷����ʹ��Ĭ��˳��
        return this.autoConfigurationMetadata.getInteger(this.className, 
                "AutoConfigureOrder", AutoConfigureOrder.DEFAULT_ORDER);
    }
    // �������ڵ��������ȡ @AutoConfigureOrder ע��ָ����˳��
    Map<String, Object> attributes = getAnnotationMetadata()
            .getAnnotationAttributes(AutoConfigureOrder.class.getName());
    // ��� @AutoConfigureOrder δ���ã���ʹ��Ĭ��˳��
    return (attributes != null) ? (Integer) attributes.get("value") 
            : AutoConfigureOrder.DEFAULT_ORDER;
}

```

����������ǱȽϼ򵥵ģ����ǻ�ȡ `@AutoConfigureOrder` ע��ָ����˳�����û�� `@AutoConfigureOrder` ע�⣬��ʹ��Ĭ��˳��Ĭ��˳�� `AutoConfigureOrder.DEFAULT_ORDER` ��ֵΪ 0��

### 6\. ʹ�� `@AutoConfigureBefore`��`@AutoConfigureAfter` ����

����������������ĵ� `@AutoConfigureBefore` �� `@AutoConfigureAfter` ע��������ˣ���Ӧ�ķ���Ϊ `AutoConfigurationSorter#sortByAnnotation`���������£�

```
/**
 * ��������
 * ʵ�������������ֻ��׼����һЩ���ݣ������ɻ���� doSortByAfterAnnotation(...)
 */
private List<String> sortByAnnotation(AutoConfigurationClasses classes, List<String> classNames) {
    // ��Ҫ����� className
    List<String> toSort = new ArrayList<>(classNames);
    toSort.addAll(classes.getAllNames());
    // ����õ� className
    Set<String> sorted = new LinkedHashSet<>();
    // ���������е� className
    Set<String> processing = new LinkedHashSet<>();
    while (!toSort.isEmpty()) {
        // ������������ķ���
        doSortByAfterAnnotation(classes, toSort, sorted, processing, null);
    }
    // �����ڼ��� sorted �У����������� classNames �е�Ԫ�ؽ��ᱻ�Ƴ�
    sorted.retainAll(classNames);
    return new ArrayList<>(sorted);
}

/**
 * �����������ķ���
 */
private void doSortByAfterAnnotation(AutoConfigurationClasses classes, List<String> toSort, 
        Set<String> sorted, Set<String> processing, String current) {
    if (current == null) {
        current = toSort.remove(0);
    }
    // ʹ�� processing ���ж��Ƿ����ѭ���Ƚϣ����磬��A after ��B���� ��B �� after ��A
    processing.add(current);
    // classes.getClassesRequestedAfter����ǰ className ��Ҫ����Щ className ֮��ִ��
    for (String after : classes.getClassesRequestedAfter(current)) {
        Assert.state(!processing.contains(after),
                "AutoConfigure cycle detected between " + current + " and " + after);
        if (!sorted.contains(after) && toSort.contains(after)) {
            // �ݹ����
            doSortByAfterAnnotation(classes, toSort, sorted, processing, after);
        }
    }
    processing.remove(current);
    // ��ӵ�����������
    sorted.add(current);
}

```

`AutoConfigurationSorter#sortByAnnotation` �ṩ�˱������ݵĽṹ���� `AutoConfigurationSorter#doSortByAfterAnnotation` ����������������ķ��������������̫�ö��������������£�

1.  ���ҵ�ǰ `className` ��Ҫ����Щ `className` ֮��װ�䣬���䱣��Ϊ `afterClasses`��Ҳ����˵��`afterClasses` �е�ÿһ�� `className` ��Ҫ�ڵ�ǰ `className` ֮ǰװ�䣻

2.  ���� `afterClasses`��������ÿһ�� `className`������������ `afterClasses`�������ݹ���ȥ��������ѭ���Ƚϵ�����£����ձ�Ȼ�����һ�� `className`������ `afterClasses` Ϊ�գ�����Ͱ� `className` ���뵽���������Ľṹ�С�

��������������ȡ `afterClasses` �Ĳ���������Ϊ `AutoConfigurationSorter.AutoConfigurationClasses#getClassesRequestedAfter`���������£�

```
Set<String> getClassesRequestedAfter(String className) {
    // ��ǰ�ࣺ��ȡ����Щ��֮��ִ�У����ǻ�ȡ @AutoConfigureAfter ע��ָ������
    Set<String> classesRequestedAfter = new LinkedHashSet<>(get(className).getAfter());
    // �����ࣺ��Ҫǰ��ִ�е�����
    this.classes.forEach((name, autoConfigurationClass) -> {
        if (autoConfigurationClass.getBefore().contains(className)) {
            classesRequestedAfter.add(name);
        }
    });
    return classesRequestedAfter;
}

```

�Ӵ���������������� `afterClasses` �����������ݣ�

*   ��ȡ����Щ��װ�����֮��װ�䣬���ǻ�ȡ `@AutoConfigureAfter` ע��ָ������
*   ��ȡ��Щ����Ҫ�ڵ�ǰ��װ��֮ǰ����װ��

### 7\. ��������`@ConditionalOnBean/@ConditionalOnMissingBean`

ǰ���ᵽ�� `@ConditionalOnBean/@ConditionalOnMissingBean` �Ŀӣ��˽����Զ�װ���˳��󣬾��ܺܺù����Щ���ˣ�

1.  ���� `bean` �����Զ�װ���ࣺ�ܿӷ�ʽ�ǣ�ʹ�� `@AutoConfigureBefore` / `@AutoConfigureAfter` �� `@AutoConfigureOrder` ָ������˳�򣬱�֤����ע���е� `bean` ��װ�伴�ɣ�
2.  һ������ͨ `spring bean`��һ�����Զ�װ���ࣺ�������ע���е� `bean` ����ͨ spring bean����һ�����Զ�װ���࣬��������²��ô����Զ�װ��Ĵ������� `DeferredImportSelector` �����࣬��������Զ�װ��������ͨ `spring bean` ֮������֮ ������ע���е� `bean` ���Զ�װ���࣬��һ������ͨ `spring bean`������һ���������Ҫʹ�ã�
3.  ����������ͨ `spring bean`���ޱܿӷ�����`spring bean` ע�ᵽ `beanFactory` ��˳�򲻿ɿأ������������������ʹ�ã�

### 8\. �ܽ�

�����ܽ����Զ�װ�����װ��˳����Ҫ�������������ݣ�

1.  ���Զ�װ��������`AutoConfigurationImportSelector.AutoConfigurationGroup#sortAutoConfigurations`
2.  ָ���Զ�װ�����װ��˳��ʹ�� `@AutoConfigureBefore` / `@AutoConfigureAfter` �� `@AutoConfigureOrder`
3.  ����ʽ�����֣������ǣ�
    1.  �� className ������ `String` �ṩ�������
    2.  ���� `@AutoConfigureOrder` ָ����ֵ���������� `Integer` �ṩ�������
    3.  ���� `@AutoConfigureBefore` / `@AutoConfigureAfter` �������� ��Ҫע����ǣ�������������ʽ�Ⱥ���У������������Ľ��Ϊ����˳��
4.  ���� `@ConditionalOnBean/@ConditionalOnMissingBean` �ܿ�ָ�ϣ�
    1.  ���� `bean` �����Զ�װ���ࣺ�ܿӷ�ʽ�ǣ�ʹ�� `@AutoConfigureBefore` / `@AutoConfigureAfter` �� `@AutoConfigureOrder` ָ������˳�򣬱�֤����ע���е� `bean` ��װ�伴�ɣ�
    2.  һ������ͨ `spring bean`��һ�����Զ�װ���ࣺ����ע���е� `bean` ����Ϊ��ͨ�� `spring bean`��
    3.  ����������ɿأ�������ʹ�á�

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4921594](https://my.oschina.net/funcy/blog/4921594) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_