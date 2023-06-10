�Զ�װ���� springboot �ĺ���֮һ�����Ľ���̽�� springboot ����μ����Զ�װ����ġ�

�� [@SpringBootApplication ע��](https://my.oschina.net/funcy/blog/4870882)һ���У������ᵽ springboot �����Զ�װ���ע���� `@EnableAutoConfiguration`���������£�

```
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
// �Զ�װ��İ�
@AutoConfigurationPackage
// ������Զ�װ����
@Import(AutoConfigurationImportSelector.class)
public @interface EnableAutoConfiguration {

    String ENABLED_OVERRIDE_PROPERTY = "spring.boot.enableautoconfiguration";

    /**
     * �����ж����ų��Զ�װ�����
     */
    Class<?>[] exclude() default {};

    /**
     * �����ж����ų��Զ�װ�������
     */
    String[] excludeName() default {};

}

```

���ϴ�������������֣�

1.  `@AutoConfigurationPackage`��ָ���Զ�װ��İ���
2.  `@Import(AutoConfigurationImportSelector.class)`�������Զ�װ��Ĵ����� `AutoConfigurationImportSelector`����������Զ�װ��Ĺؼ����ڣ�
3.  `@EnableAutoConfiguration` �����ԣ�`@EnableAutoConfiguration` �ṩ���������ԣ�`exclude` �� `excludeName`�����������ų�����Ҫ�Զ�װ����ࡣ

�����ص������� `AutoConfigurationImportSelector` �ࡣ

### 1. `AutoConfigurationImportSelector.AutoConfigurationGroup`

`AutoConfigurationImportSelector` ʵ���� `DeferredImportSelector`������ `DeferredImportSelector` �ķ��������Բο� [ConfigurationClassPostProcessor ֮���� @Import ע��](https://my.oschina.net/funcy/blog/4678152)����������ֱ�Ӹ������ۣ�

* `DeferredImportSelector` �� `ImportSelector` ���ӽӿڣ����ڲ���һ���ӿ� `Group`���ýӿڶ���������������

  ```
  public interface DeferredImportSelector extends ImportSelector {
      ...
  
      interface Group {
  
          /**
           * ���������
           */
          void process(AnnotationMetadata metadata, DeferredImportSelector selector);
  
          /**
           * ���ص�����
           */
          Iterable<Entry> selectImports()
      }
  }
  
  ```

  �ڴ��� `DeferredImportSelector` �ĵ�����ʱ��`DeferredImportSelector.Group#process` �������ȵ��ã�Ȼ���ٵ��� `DeferredImportSelector.Group#selectImports` ���ص����ࣻ

* `DeferredImportSelector` ����ָ��������ķ��飬�ڴ���ʱ�����԰����鴦�����ࣻ

* `DeferredImportSelector` �ڴ�������ʱ���Ƚ������ఴ�������һ�� `map` �У��ڴ��������������ࣨspring ��������Ϊ `@Component`��`@ComponentScan`��`@Import`��`@Configuration`��`@Bean` ��ǵ��ࣩ��������������еĵ����࣬Ҳ����˵��`DeferredImportSelector` ������࣬����������ע�ᵽ `beanFactory` �к��ٽ���ע�ᣨע��ǰ�����ж��ܷ�ע�ᵽ `beanFactory`�����ܲ�ע�ᣩ��

���������� `AutoConfigurationImportSelector` �Ĵ��룺

```
// ʵ���� DeferredImportSelector
public class AutoConfigurationImportSelector implements DeferredImportSelector, 
        BeanClassLoaderAware,ResourceLoaderAware, BeanFactoryAware, EnvironmentAware, Ordered {

    ...

    /**
     * ����ʵ���� DeferredImportSelector.Group
     */
    private static class AutoConfigurationGroup implements DeferredImportSelector.Group, 
            BeanClassLoaderAware, BeanFactoryAware, ResourceLoaderAware {

        /**
         * ���浼�����
         */
        private final List<AutoConfigurationEntry> autoConfigurationEntries = new ArrayList<>();

        /**
         * ��������
         */
        @Override
        public void process(AnnotationMetadata annotationMetadata, 
                DeferredImportSelector deferredImportSelector) {
            Assert.state(deferredImportSelector instanceof AutoConfigurationImportSelector,
                    () -> String.format("Only %s implementations are supported, got %s",
                            AutoConfigurationImportSelector.class.getSimpleName(),
                            deferredImportSelector.getClass().getName()));
            // 1\. ���� AutoConfigurationImportSelector#getAutoConfigurationEntry(...) ������
            // ����������������Զ�װ����
            AutoConfigurationEntry autoConfigurationEntry = 
                ((AutoConfigurationImportSelector) deferredImportSelector)
                    .getAutoConfigurationEntry(getAutoConfigurationMetadata(), annotationMetadata);
            // 2\. ����ȡ���� autoConfigurationEntry ��������
            this.autoConfigurationEntries.add(autoConfigurationEntry);
            for (String importClassName : autoConfigurationEntry.getConfigurations()) {
                this.entries.putIfAbsent(importClassName, annotationMetadata);
            }
        }

        /**
         * ���ص�����
         */
        @Override
        public Iterable<Entry> selectImports() {
            if (this.autoConfigurationEntries.isEmpty()) {
                return Collections.emptyList();
            }
            // 3\. �õ�������
            Set<String> allExclusions = this.autoConfigurationEntries.stream()
                    .map(AutoConfigurationEntry::getExclusions).flatMap(Collection::stream)
                    .collect(Collectors.toSet());
            // 4\. �� autoConfigurationEntries ת��Ϊ LinkedHashSet
            Set<String> processedConfigurations = this.autoConfigurationEntries.stream()
                    .map(AutoConfigurationEntry::getConfigurations).flatMap(Collection::stream)
                    .collect(Collectors.toCollection(LinkedHashSet::new));
            // 5\. ȥ����Ҫ���˵���
            processedConfigurations.removeAll(allExclusions);
            // 6\. ��������
            return sortAutoConfigurations(processedConfigurations, getAutoConfigurationMetadata())
                    .stream().map((importClassName) -> new Entry(
                        this.entries.get(importClassName), importClassName))
                    .collect(Collectors.toList());
        }

        ...
    }

}

```

�������ǽ� `DeferredImportSelector.Group#process` �� `DeferredImportSelector.Group#selectImports` ��������������������������ܽ�����:

1.  ���� `AutoConfigurationImportSelector#getAutoConfigurationEntry(...)` ���������Զ�װ���ࣻ
2.  ���õ����Զ�װ���ౣ�浽 `autoConfigurationEntries` �У�
3.  �õ������࣬��Щ����������� `@EnableAutoConfiguration` �� `exclude` �� `excludeName` ָ���ģ�
4.  �� `autoConfigurationEntries` ת��Ϊ `LinkedHashSet`�����Ϊ `processedConfigurations`��
5.  ȥ�� `processedConfigurations` ��Ҫ���˵��ࣻ
6.  ���� 5 ���õ���������󣬷��ء�

���������Ƕ���Щ�ؼ�������з�����

> �ر�˵����`DeferredImportSelector` �� `ImportSelector` ���ӽӿڣ�`ImportSelector` ��������ķ����� `selectImports(...)`���� `DeferredImportSelector` ��Ҳ��д�˸÷�����
>
> ![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-75a2839c622af2d0f374189b2e2765a64d7.png)
>
> �������������Ҳ�Ǽ����Զ�װ���࣬�������յ�����࣬����Ҫע����ǣ�springboot ���Զ�������**����**�����ﴦ��ģ�������㣬�����ڷ����ڴ���ϵ㣬Ȼ��ͻᷢ�����������û�����е���
>
> ����������£�springboot ���Զ�������**����**�� `AutoConfigurationImportSelector#selectImports` �����д���ģ������� `AutoConfigurationImportSelector.AutoConfigurationGroup#selectImports` �����д���ġ�

### 2\. ��ȡװ���ࣺ`AutoConfigurationImportSelector#getAutoConfigurationEntry`

�Զ����� ��ļ��ش���Ϊ��

```
AutoConfigurationEntry autoConfigurationEntry = 
    ((AutoConfigurationImportSelector) deferredImportSelector)
        .getAutoConfigurationEntry(getAutoConfigurationMetadata(), annotationMetadata);

```

�ô���������������Զ�װ����ģ�����ֱ�ӽ��� `AutoConfigurationImportSelector#getAutoConfigurationEntry` ������

```
protected AutoConfigurationEntry getAutoConfigurationEntry(
        AutoConfigurationMetadata autoConfigurationMetadata, AnnotationMetadata annotationMetadata) {
    // ��һ���ж��Ƿ����Զ�װ��
    if (!isEnabled(annotationMetadata)) {
        return EMPTY_ENTRY;
    }
    // ��ȡע�������
    AnnotationAttributes attributes = getAttributes(annotationMetadata);
    // 1\. ���غ�ѡ���Զ�������
    List<String> configurations = getCandidateConfigurations(annotationMetadata, attributes);
    // 2\. ȥ�أ�ת����set����ת����list
    configurations = removeDuplicates(configurations);
    // 3\. ȥ����Ҫ�ų����࣬��ʵ���Ǵ���@EnableAutoConfiguration��exclude��excludeName
    Set<String> exclusions = getExclusions(annotationMetadata, attributes);
    checkExcludedClasses(configurations, exclusions);
    configurations.removeAll(exclusions);
    // 4\. ���˲���Ҫ�Զ�װ�����
    configurations = filter(configurations, autoConfigurationMetadata);
    // 5\. ���� AutoConfigurationImportEvent �¼�
    fireAutoConfigurationImportEvents(configurations, exclusions);
    // 6\. ���շ��ص�ֵ
    return new AutoConfigurationEntry(configurations, exclusions);
}

```

��������ǳ���Ҫ�������˻�ȡ�Զ�װ�����ȫ���������ò����������£�

1. ���غ�ѡ���Զ�װ���࣬springboot �Զ�װ�����λ�� `classpath` �µ� `META-INF/spring.factories` �ļ��У�key Ϊ `org.springframework.boot.autoconfigure.EnableAutoConfiguration`��������Ǻ�������ϸ������

2. ȥ���ظ����Զ�װ���࣬��һ�����صõ����Զ�װ������ܻ����ظ����������ȥ���ظ����࣬ȥ����ʽҲ�ǳ��򵥣�springboot ��ֻ����ת���� `Set`����ת���� `List`��

3. ȥ���ų����࣬ǰ���ᵽ `@EnableAutoConfiguration` ����ͨ�� `exclude` �� `excludeName` ָ����Ҫ�ų����࣬��һ���������������������Եģ�

4. ���˲���Ҫ�Զ�װ����࣬���ݱ��˵��ԣ����ֲ�û����ɹ��ˣ�

   ����ǰ�� 124 ����

   ![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-773695c0161c8126f239c2e66529fc8a394.png)

   ���˺��� 124 ����

   ![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-7144d971f729b5dfbddfeff2d3319c7705c.png)

5. ���� `AutoConfigurationImportEvent` �¼���

6. ���� 3 ���õ����ų������ 4 ���õ����Զ�װ�����װ�� `AutoConfigurationEntry` ���ء�

ע�����һ�д��룺

```
// 6\. ���շ��ص�ֵ
return new AutoConfigurationEntry(configurations, exclusions);

```

����� `configurations` �� `exclusions` �������� `AutoConfigurationEntry` �Ĺ��췽�������������� `AutoConfigurationEntry`��

```
protected static class AutoConfigurationEntry {
    // �Զ�װ����
    private final List<String> configurations;

    // ��Ҫ�ų����Զ�װ����
    private final Set<String> exclusions;

    /**
     * ���췽���������߽��и�ֵ
     */
    AutoConfigurationEntry(Collection<String> configurations, Collection<String> exclusions) {
        this.configurations = new ArrayList<>(configurations);
        this.exclusions = new HashSet<>(exclusions);
    }

    ...
}

```

��Щ�ɼ������շ��ص� `AutoConfigurationEntry` �����������ݣ�

*   `configurations`���Զ�װ���࣬�Ѿ�ȥ������Ҫ�ų�����
*   `exclusions`��ͨ�� `@EnableAutoConfiguration` ָ������Ҫ�ų�����

�����Զ�װ����Ļ�ȡ���������ˣ������������������غ�ѡ���Զ�װ��������̡�

### 3\. ���غ�ѡ���Զ�װ����

�Զ�װ����ļ���λ�� `AutoConfigurationImportSelector#getCandidateConfigurations`���������£�

```
protected List<String> getCandidateConfigurations(AnnotationMetadata metadata, 
        AnnotationAttributes attributes) {
    // ���õ��� spring �ṩ�ķ�����SpringFactoriesLoader.loadFactoryNames(...)
    // getSpringFactoriesLoaderFactoryClass() ���ص���EnableAutoConfiguration
    List<String> configurations = SpringFactoriesLoader
            .loadFactoryNames(getSpringFactoriesLoaderFactoryClass(), getBeanClassLoader());
    Assert.notEmpty(configurations, "...");
    return configurations;
}

protected Class<?> getSpringFactoriesLoaderFactoryClass() {
    return EnableAutoConfiguration.class;
}

```

�������� `SpringFactoriesLoader#loadFactoryNames`��

```
public final class SpringFactoriesLoader {

    public static final String FACTORIES_RESOURCE_LOCATION = "META-INF/spring.factories";

    public static List<String> loadFactoryNames(Class<?> factoryType, @Nullable ClassLoader classLoader) {
        // �õ��� factoryTypeName �� org.springframework.boot.autoconfigure.EnableAutoConfiguration
        String factoryTypeName = factoryType.getName();
        return loadSpringFactories(classLoader).getOrDefault(factoryTypeName, Collections.emptyList());
    }

    /**
     * ��������м��أ����ص��� META-INF/spring.factories �е�����
     */
    private static Map<String, List<String>> loadSpringFactories(@Nullable ClassLoader classLoader) {
        MultiValueMap<String, String> result = cache.get(classLoader);
        if (result != null) {
            return result;
        }

        try {
            // ���� META-INF/spring.factories ������
            Enumeration<URL> urls = (classLoader != null ?
                    classLoader.getResources(FACTORIES_RESOURCE_LOCATION) :
                    ClassLoader.getSystemResources(FACTORIES_RESOURCE_LOCATION));
            result = new LinkedMultiValueMap<>();
            while (urls.hasMoreElements()) {
                URL url = urls.nextElement();
                UrlResource resource = new UrlResource(url);
                // �� META-INF/spring.factories ������ת��Ϊ Properties ����
                Properties properties = PropertiesLoaderUtils.loadProperties(resource);
                for (Map.Entry<?, ?> entry : properties.entrySet()) {
                    String factoryTypeName = ((String) entry.getKey()).trim();
                    // StringUtils.commaDelimitedListToStringArray(...) ���ŷָ�Ϊ����
                    for (String factoryImplementationName : 
                                StringUtils.commaDelimitedListToStringArray((String) entry.getValue())) {
                        result.add(factoryTypeName, factoryImplementationName.trim());
                    }
                }
            }
            cache.put(classLoader, result);
            return result;
        }
        catch (IOException ex) {
            throw new IllegalArgumentException("Unable to load factories from location [" +
                    FACTORIES_RESOURCE_LOCATION + "]", ex);
        }
    }
    ...
}

```

���Կ�����������ص��� `classpath` �µ� `META-INF/spring.factories` �ļ���ע�⣺����ļ����ܻ��ж����λ�ڲ�ͬ�� jar ���С�

springboot �Դ��� `META-INF/spring.factories` λ�� `spring-boot-autoconfigure` ģ���£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-ace5e83645626966eae1e62a50752f2417d.png)

��������һ�� `spring.factories`��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-d7de9ecd19345f0dc77cc304843c588fe4d.png)

����ļ����������������࣬�� `key-value` ����ʽ���棬���ֵ֮��ʹ�� ��,�� �ֿ��������ᵽ���Զ�װ����� key �� `org.springframework.boot.autoconfigure.EnableAutoConfiguration`����Ӧ�� `value` �ǳ��࣬����Ͳ�չʾ�ˡ�

��һ��֮���Զ�װ����ͱ�ע�ᵽ spring �������ˡ�ע����ʱ���ص� spring �����еĻ��� `BeanDefinition`��Ҫ���Ϊ spring bean�����þ��� `ConditionalOnBean`��`ConditionalOnClass` ��ע��Ŀ��飬��Щ���Ǻ����ٷ�����

### 4\. ��ȡ�Զ�װ�����Ĵ���

�������ٻص� `AutoConfigurationImportSelector.AutoConfigurationGroup`���ڵ� 1 �������ܽ���������£�

1.  ���� `AutoConfigurationImportSelector#getAutoConfigurationEntry(...)` ���������Զ�װ���ࣻ
2.  ���õ����Զ�װ���ౣ�浽 `autoConfigurationEntries` �У�
3.  �õ������࣬��Щ����������� `@EnableAutoConfiguration` �� `exclude` �� `excludeName` ָ���ģ�
4.  �� `autoConfigurationEntries` ת��Ϊ `LinkedHashSet`�����Ϊ `processedConfigurations`��
5.  ȥ�� `processedConfigurations` ��Ҫ���˵��ࣻ
6.  ���� 5 ���õ���������󣬷��ء�

���ϵ� 2 ����� 3 �ڣ����������Զ�������ļ��ع��̣��������������������Ĳ��衣

�����Ŵ��룬���ǻᷢ�ֽ������Ĳ��趼�Ƚϼ򵥣�����Ҳ��һ˵���°ɡ�

*   �� 2 ��������õ����Զ�װ���࣬�����������ֻ�ǵ����� `List#add(...)` ���������õ��� `autoConfigurationEntry` ���浽 `autoConfigurationEntries`������ṹ�� `AutoConfigurationGroup` �ĳ�Ա�������� `AutoConfigurationImportSelector.AutoConfigurationGroup#selectImports` �����л��õ���

*   �� 3 �����õ��������еĹ����࣬�ù������Ǳ��� `autoConfigurationEntries`��Ȼ��ͨ�� `autoConfigurationEntry#getExclusions` �����õ��� ��ǰ������Ҳ�ᵽ����`autoConfigurationEntry` ֻ����������Ա������`configurations`(ȥ���ų������Զ�װ����) �� `exclusions`(ͨ�� `@EnableAutoConfiguration` ָ�����ų���)��

*   �� 4 ������ `List` ת��Ϊ `LinkedHashSet`����������

*   �� 5 ���������е��Զ�װ�����ٽ���һ��ȥ���ų���Ĳ������ų��Ķ��������е��ų��࣬�������Ӧ���ǻ��ͬһ��Ŀ���ж�� `@EnableAutoConfiguration` ������������һ�� `@EnableAutoConfiguration` ע���ų� `A`��`B` �����࣬�ڶ��� `@EnableAutoConfiguration` ע���ų� `C`��`D` �����࣬�������ų����� `A`��`B`��`C`��`D` �ĸ��ࣻ

*   �� 6 ������һ������Ҫ�������������˳��������Զ�װ����ע�ᵽ `beanFactory` �е�˳��`AutoConfigureOrder`��`@AutoConfigureAfter` �� `@AutoConfigureBefore` ���������ﴦ��ģ�����������ݣ����Բο� [springboot �Զ�װ��֮�Զ�װ��˳��](https://my.oschina.net/funcy/blog/4921594).

������Щ������Զ�װ��Ļ�ȡ������ˡ�

### 5\. �Զ����Զ�װ����

�˽����Զ�װ����ļ��ع��̺�����Ҳ�����Զ���һ���Զ�װ���ࡣ

1.  ׼��һ���Զ�װ����

```
@Configuration
public class MyAutoConfiguration {

    @Bean
    public Object object() {
        System.out.println("create object");
        return new Object();
    }
}

```

�����ܼ򵥣�����һ������� `@Configuration` ���࣬����ʹ�� `@Bean` ע�ⴴ����һ�� bean���ڴ��� bean �Ĺ����л� ��ӡ "create object"��

1.  ׼�� `META-INF/spring.factories` �������£�

```
# Auto Configure
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
org.springframework.boot.learn.autoconfigure.demo01.configure.MyAutoConfiguration

```

1.  ����

```
@SpringBootApplication
public class AutoconfigureDemo01Application {

    public static void main(String[] args) {
        SpringApplication.run(AutoconfigureDemo01Application.class, args);
    }

}

```

���н�����£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-9337a7ac4ce4ff7d71e69bc952bfac30b12.png)

���Կ�����`create object` �ɹ���ӡ�ˡ�

����� `bean` ��ͨ����ɨ�贴���ģ������Զ�װ�䵼����أ�����ͨ�����Եķ�ʽ�������Զ�װ��õ����ࣺ

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-27bea49ddeae2f0f720ea338914cc443aec.png)

���Կ�����`MyAutoConfiguration` �����Զ�װ������б����ˡ�

ע�⵽��`MyAutoConfiguration` ���� `@Configuration` ע�⣬ ��ô���������� sping ����ɨ�赽�ģ��������Զ�װ��õ����أ�

��[��springboot Դ�������@SpringBootApplication ע��](https://my.oschina.net/funcy/blog/4870882)һ���У������ᵽ `SpringBootApplication` ע���е� `@ComponentScan` ��ָ��һ����������`AutoConfigurationExcludeFilter`�����������������Զ�װ���࣬�������ǿ���ĿǰΪֹ `beanFactory` ������Щ `beanName`��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-1725008451f5516ab540bcc3ae13d1f37ee.png)

���Կ�������û�� `MyAutoConfiguration`����˴�ʱ����û��ɨ��� `beanFactory` �С�

��Ȼ������Ҳ���԰� `MyAutoConfiguration` ����� `@Configuration` ע��ȥ���������Ͳ�������������ˡ�

### 6\. �ܽ�

���Ĵ� `@EnableAutoConfiguration` ע��������������Զ�װ����ļ������̣����������� `AutoConfigurationImportSelector#getAutoConfigurationEntry` �����У����ռ��ص��� `META-INF/spring.factories` �ļ��� key �� `org.springframework.boot.autoconfigure.EnableAutoConfiguration` ���ࡣ

�õ��Զ�װ�����spring �Ὣ��ע�ᵽ�����У���ʱ���ǻ���һ���� `BeanDefinition`��Ҫ���Ϊ spring bean�����þ��� `ConditionalOnBean`��`ConditionalOnClass` ��ע��Ŀ��飬��Щ���Ǻ����ٷ�����

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4870868](https://my.oschina.net/funcy/blog/4870868) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_