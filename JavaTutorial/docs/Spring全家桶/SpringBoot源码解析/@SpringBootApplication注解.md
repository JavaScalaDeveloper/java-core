springboot ���������ϻ��עһ��ע�⣺`@SpringBootApplication`�����˽���Դ����������� ��ע������á�

`@SpringBootApplication` �������£�

```
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = { 
        @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
        @Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
public @interface SpringBootApplication {

    /**
     * �Զ�װ��Ҫ�ų����࣬���������� @EnableAutoConfiguration
     */
    @AliasFor(annotation = EnableAutoConfiguration.class)
    Class<?>[] exclude() default {};

    /**
     *  �Զ�װ��Ҫ�ų������������������� @EnableAutoConfiguration
     */
    @AliasFor(annotation = EnableAutoConfiguration.class)
    String[] excludeName() default {};

    /**
     * ����ɨ��İ������������� @ComponentScan
     */
    @AliasFor(annotation = ComponentScan.class, attribute = "basePackages")
    String[] scanBasePackages() default {};

    /**
     * ����ɨ���class����class���ڵİ����ᱻɨ�裬���������� @ComponentScan
     */
    @AliasFor(annotation = ComponentScan.class, attribute = "basePackageClasses")
    Class<?>[] scanBasePackageClasses() default {};

    /**
     * �Ƿ����� @Bean ������������������ @Configuration
     */
    @AliasFor(annotation = Configuration.class)
    boolean proxyBeanMethods() default true;

}

```

1.  `@SpringBootApplication` ��һ�����ע�⣬������ `@SpringBootConfiguration`��`@EnableAutoConfiguration`��`@ComponentScan` ����ע��Ĺ��ܣ�
2.  `@SpringBootApplication` ��Ҳ�ṩ��һЩ�������ԣ�����Щ������������������ע�⡣

����������������������ע������÷ֱ���ʲô��

### 1. `@SpringBootConfiguration`

���� `@SpringBootConfiguration`���������£�

```
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Configuration
public @interface SpringBootConfiguration {

    @AliasFor(annotation = Configuration.class)
    boolean proxyBeanMethods() default true;

}

```

���ע��Ƚϼ򵥣��������� `@Configuration`��Ȼ����һ������ `proxyBeanMethods()`���������� `@Configuration`����ˣ�`@SpringBootConfiguration` ��û����ʲô������ֻ�ǽ� `@Configuration` ʹ���� `@Configuration` �Ĺ��ܡ�

���� `@Configuration`���������� spring���ܱ� spring ʶ��Ϊ `Component`���� `proxyBeanMethods != false` ʱ���ᱻ spring ���Ϊ `Full` �����࣬�ں��������е� `@Bean` ��������ʱ������� cglib ���������ⷽ������ݣ��ɲο� [ConfigurationClassPostProcessor������������ @Bean ע��](https://my.oschina.net/funcy/blog/4492878).

### 2. `@EnableAutoConfiguration`

`@EnableAutoConfiguration` ��Ҫ ���������Զ�װ�书�ܣ��������£�

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

�Ӵ����п��Կ�����

1.  ��ע������� `@AutoConfigurationPackage` ע��Ĺ��ܣ���ע������ָ���Զ�װ��İ���
2.  ��ע��ͨ�� `@Import` ע��������һ���� `AutoConfigurationImportSelector`����������Զ�װ��Ĺؼ���
3.  ��ע���ṩ���������ã������ų�ָ�����Զ�װ���࣬���Ը��������ų� (`Class` ����)��Ҳ���Ը������� (`����.����`) �ų���

��������������ע `@AutoConfigurationPackage` ������� `AutoConfigurationImportSelector`��

#### 2.1 `@AutoConfigurationPackage`

`@AutoConfigurationPackage` ָ�����Զ�װ��İ����������£�

```
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@Import(AutoConfigurationPackages.Registrar.class)
public @interface AutoConfigurationPackage {

}

```

���ע������ݷǳ��򵥣���ʹ�� `@Import` ע�������� `AutoConfigurationPackages.Registrar`�������������������ݣ�

```
public abstract class AutoConfigurationPackages {

    private static final String BEAN = AutoConfigurationPackages.class.getName();

    static class Registrar implements ImportBeanDefinitionRegistrar, DeterminableImports {

        /**
         * ���� ImportBeanDefinitionRegistrar �Ĵ���spring������ registerBeanDefinitions() ע������
         */
        @Override
        public void registerBeanDefinitions(AnnotationMetadata metadata, 
                    BeanDefinitionRegistry registry) {
            register(registry, new PackageImport(metadata).getPackageName());
        }

        @Override
        public Set<Object> determineImports(AnnotationMetadata metadata) {
            return Collections.singleton(new PackageImport(metadata));
        }

    }

    /**
     * ��������ע�����
     * 1\. ��� beanFacotry �а��� BEAN���򽫴���İ�����ӵ� BEAN ��Ӧ�� BeanDefinition �Ĺ��췽������ֵ�ϣ�
     * 2\. ��� beanFacotry �в����� BEAN���򴴽� beanDefinition�����ò���ֵ��Ȼ����ע�ᵽ beanFacotry��
     * ע�ᵽbeanFacotry�е�beanΪBasePackages
     */
    public static void register(BeanDefinitionRegistry registry, String... packageNames) {
        if (registry.containsBeanDefinition(BEAN)) {
            BeanDefinition beanDefinition = registry.getBeanDefinition(BEAN);
            // bean �� BasePackages�����췽���� BasePackages(String... names)�������ȡԭ���Ĺ��������ֵ
            ConstructorArgumentValues constructorArguments 
                    = beanDefinition.getConstructorArgumentValues();
            // ��ԭ���Ĺ������ֵ���Լ������ packageNames ͳһ��ӵ����췽���ĵ�0������ֵ��
            constructorArguments.addIndexedArgumentValue(0, 
                    addBasePackages(constructorArguments, packageNames));
        }
        else {
            GenericBeanDefinition beanDefinition = new GenericBeanDefinition();
            // ����BeanClassΪBasePackages.class
            beanDefinition.setBeanClass(BasePackages.class);
            // ���ù��췽���Ĳ���ֵ
            beanDefinition.getConstructorArgumentValues().addIndexedArgumentValue(0, packageNames);
            beanDefinition.setRole(BeanDefinition.ROLE_INFRASTRUCTURE);
            registry.registerBeanDefinition(BEAN, beanDefinition);
        }
    }

    /**
     * packageName �İ�װ��
     * packageName �Ǵ��������ڵİ�������PackageImport�Ĺ��췽���л�ȡ
     */
    private static final class PackageImport {

        private final String packageName;

        PackageImport(AnnotationMetadata metadata) {
            // ��ȡ���������ڰ���
            this.packageName = ClassUtils.getPackageName(metadata.getClassName());
        }

        String getPackageName() {
            return this.packageName;
        }

        // ʡ�� equals/toString/hashCode ����
        ...

    }

    /**
     * ע�⵽ beanFactory �е���
     * ��������һ��List�ṹ�����������ɨ��·��
     */
    static final class BasePackages {
        // ��ɨ��·�������ﱣ��
        private final List<String> packages;

        private boolean loggedBasePackageInfo;

        BasePackages(String... names) {
            List<String> packages = new ArrayList<>();
            for (String name : names) {
                if (StringUtils.hasText(name)) {
                    packages.add(name);
                }
            }
            this.packages = packages;
        }

        // ʡ����һЩ����
        ...
    }

}

```

�����е㳤�����߼��������ӣ��������£�

1.  `AutoConfigurationPackages.Registrar` ʵ���� `ImportBeanDefinitionRegistrar`��`registerBeanDefinitions(...)` ������ spring ��ע���� `BasePackages`��ע���߼��� `AutoConfigurationPackages#register` �����У�
2.  `AutoConfigurationPackages#register` ������ע���߼�Ϊ�����ж��Ƿ���ע���� `BasePackages`�����ע���ˣ��ͽ���ǰ�����ڵİ���ӵ� `BasePackages` �Ĺ��췽������ֵ�У�����ʹ��� `BeanDefinition`�����ù��췽���Ĳ���ֵ��Ȼ��ע�ᵽ spring �У�

#### 2.2 `AutoConfigurationImportSelector`

`AutoConfigurationImportSelector` �Ǵ����Զ����õĹؼ����������£�

```
public class AutoConfigurationImportSelector implements DeferredImportSelector, BeanClassLoaderAware,

    ...

}

```

`AutoConfigurationImportSelector` ʵ���� `DeferredImportSelector`������һ�� `ImportSelector` �࣬����������ȼ���� (�� `@ComponentScan`��`@Component`��`@Bean`��`@Configuration` ������ `@Import` ע�⴦����֮���ٴ���)���� `AutoConfigurationImportSelector` ���лᴦ���Զ�������ļ������̣�����ͨ�����ַ�ʽ�����Զ������������� spring �����С�

���� spring �� `@Import` �Ĵ������Բο� [ConfigurationClassPostProcessor ֮���� @Import ע��](https://my.oschina.net/funcy/blog/4678152).

���� `AutoConfigurationImportSelector` ��ȡ�Զ�����������̣����ں���������о�����������ľͲ�չ���ˡ�

### 3. `@ComponentScan`

���ע����ش���Ѿ�����Ϥ�ˣ���ָ���˰�ɨ��·���������ָ������ɨ��������İ���������Щ���� [ConfigurationClassPostProcessor ֮���� @ComponentScan ע��](https://my.oschina.net/funcy/blog/4836178)һ�����Ѿ���ϸ�������ˣ��Ͳ��ٷ����ˡ�

�����������������ע��������ʹ�õ� 2 ���ࣺ

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-19d14d3d8262eead434d5ca09369e1789d5.png)

#### 3.1 `TypeExcludeFilter`

������ʾ�ڽ��а�ɨ��ʱ�������ų�һЩ�࣬�������£�

```
public class TypeExcludeFilter implements TypeFilter, BeanFactoryAware {

    private BeanFactory beanFactory;

    private Collection<TypeExcludeFilter> delegates;

    @Override
    public void setBeanFactory(BeanFactory beanFactory) throws BeansException {
        this.beanFactory = beanFactory;
    }

    @Override
    public boolean match(MetadataReader metadataReader, 
            MetadataReaderFactory metadataReaderFactory) throws IOException {
        if (this.beanFactory instanceof ListableBeanFactory 
                && getClass() == TypeExcludeFilter.class) {
            // getDelegates() ��ȡ��ǰ���������е� TypeExcludeFilter ʵ��
            // ���������̳� TypeExcludeFilter���Զ���ƥ�����
            for (TypeExcludeFilter delegate : getDelegates()) {
                if (delegate.match(metadataReader, metadataReaderFactory)) {
                    return true;
                }
            }
        }
        return false;
    }

    private Collection<TypeExcludeFilter> getDelegates() {
        Collection<TypeExcludeFilter> delegates = this.delegates;
        if (delegates == null) {
            delegates = ((ListableBeanFactory) this.beanFactory)
                    .getBeansOfType(TypeExcludeFilter.class).values();
            this.delegates = delegates;
        }
        return delegates;
    }

    ....

```

�Ӵ��������������Ҫ�ų�һЩ �࣬���ǿ��������̳� `TypeExcludeFilter` �࣬Ȼ����д `match(...)` �����������ж���ƥ���߼���

#### 3.1 `AutoConfigurationExcludeFilter`

`AutoConfigurationExcludeFilter` �����ų��Զ������࣬Ҳ����˵��spring �ڽ��а�ɨ��ʱ������ɨ���Զ������࣬�������£�

```
public class AutoConfigurationExcludeFilter implements TypeFilter, BeanClassLoaderAware {

    private ClassLoader beanClassLoader;

    private volatile List<String> autoConfigurations;

    @Override
    public void setBeanClassLoader(ClassLoader beanClassLoader) {
        this.beanClassLoader = beanClassLoader;
    }

    @Override
    public boolean match(MetadataReader metadataReader, 
            MetadataReaderFactory metadataReaderFactory) throws IOException {
        // isConfiguration(...)����ǰ���Ƿ� @Configuration ���
        // isAutoConfiguration(...)����ǰ���Ƿ�Ϊ�Զ�������
        return isConfiguration(metadataReader) && isAutoConfiguration(metadataReader);
    }

    private boolean isConfiguration(MetadataReader metadataReader) {
        return metadataReader.getAnnotationMetadata().isAnnotated(Configuration.class.getName());
    }

    private boolean isAutoConfiguration(MetadataReader metadataReader) {
        // ��ȡ���е��Զ������࣬Ȼ���жϵ�ǰ���Ƿ����������
        return getAutoConfigurations().contains(metadataReader.getClassMetadata().getClassName());
    }

    protected List<String> getAutoConfigurations() {
        if (this.autoConfigurations == null) {
            this.autoConfigurations = SpringFactoriesLoader
                    .loadFactoryNames(EnableAutoConfiguration.class, this.beanClassLoader);
        }
        return this.autoConfigurations;
    }

}

```

������Ҫ�� `match(...)` ����������ƥ�����Ϊ��

1.  �� `@Configuration` ��ǣ�
2.  ���Զ������ࡣ

������������������spring �Ͳ���������ɨ�账��

��ʲô���Զ��������أ��� `isAutoConfiguration(...)` ���Կ��������ж��Ƿ�Ϊ�Զ��������ϣ�springboot ��ʹ�� `SpringFactoriesLoader` �������������࣬Ȼ�����жϴ�������Ƿ�Ϊ����֮һ����������Կ������Զ������ಢ�����а�ɨ�������

���� `SpringFactoriesLoader` ��μ��������࣬��������»���ϸ������

### 4\. �ܽ�

������Ҫ���� `@SpringBootApplication` �Ĺ��ܣ��ܽ����£�

1.  `@SpringBootApplication` ��һ�����ע�⣬������ `@SpringBootConfiguration`��`@EnableAutoConfiguration`��`@ComponentScan` ����ע��Ĺ��ܣ�ͬʱ�ṩ��һЩ�������ã�Ҳ������������ 3 ��ע�⣻
2.  `@SpringBootConfiguration` ������ `Configuration` ע��Ĺ��ܣ�
3.  `@EnableAutoConfiguration` �ǿ����Զ�װ��Ĺؼ�ע�⣬���б���� `@AutoConfigurationPackage`���Ὣ�� `@SpringBootApplication` ��ǵ������ڵİ�����װ�� `BasePackages`��Ȼ��ע�ᵽ spring �����У�`@EnableAutoConfiguration` ��ͨ�� `@Import` ע���������������� `AutoConfigurationImportSelector`������Ὣ��ǰ��Ŀ֧�ֵ��Զ���������ӵ� spring �����У�
4.  `@ComponentScan` �����˰�ɨ��·������ `excludeFilters` ֵ���������ų����ɨ�裬springboot ָ���� `TypeExcludeFilter`���������ǿ��Լ̳и��������������ų����� ��ͬʱҲָ���� `AutoConfigurationExcludeFilter` ���� `Filter` ���������ų��Զ������࣬Ҳ����˵���Զ������಻����а�����������

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4870882](https://my.oschina.net/funcy/blog/4870882) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_