������ `ConfigurationClassPostProcessor` �����ĵ���ƪ����Ҫ�Ƿ��� spring �� `@Import` ע��Ĵ������̡�

## 4. spring ����δ��� @Import ע��ģ�

�н����ģ����Ǽ������� spring �� `@Import` ע��Ĵ������̡�

### 4.1 �˽� `@Import` ע��

���������� `@Import` ע��Ķ��壺

```
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Import {
    /**
     * {@link Configuration @Configuration}, {@link ImportSelector},
     * {@link ImportBeanDefinitionRegistrar}, or regular component classes to import.
     */
    Class<?>[] value();
}
```

`@Import` ����һ��������`value()`��֧�ֵ������� `Class`����������ĵ�����������֧�������� 4 �֣�

- �� `@Configuration` ע���ǵ���
- ʵ���� `ImportSelector` ����
- ʵ���� `ImportBeanDefinitionRegistrar` ����
- ��ͨ��

������������ͨ��һ�� demo ��չʾʹ�� `@Import` ��ν��������ർ�뵽 spring �С�

### 4.2 demo ׼��

1. ����׼�� 4 �� bean��

```
/**
 * Element01
 */
public class Element01 {
    public String desc() {
        return "this is element 01";
    }
}

/**
 * Element02
 */
public class Element02 {
    public String desc() {
        return "this is element 02";
    }
}

/**
 * Element03
 */
public class Element03 {
    public String desc() {
        return "this is element 03";
    }
}

/**
 * Element04
 */
public class Element04 {
    public String desc() {
        return "this is element 04";
    }
}
```

1. ׼��ʵ�� `ImportBeanDefinitionRegistrar` ���࣬�� `element02` ע������

```
public class Element02ImportBeanDefinitionRegistrar implements ImportBeanDefinitionRegistrar {

    /**
     * �� registerBeanDefinitions ��ע��element02��Ӧ��BeanDefinition
     * Ҳ���ǰ� Element02 ��Ӧ�� beanDefinition �ֶ�ע�ᵽbeanFactory 
     * �� beanDefinitionMap ��
     */
    @Override
    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, 
            BeanDefinitionRegistry registry) {
        registry.registerBeanDefinition("element02", new RootBeanDefinition(Element02.class));
    }
}
```

1. ׼��ʵ�� `ImportSelector` ���࣬�� `selectImports(...)` �����У����� `Element03` �� "����������"

```
public class Element03Selector implements ImportSelector {
    /**
     * ����String Ϊ ����.����
     * ���ں���Ҫ�õ����䣬��˱�����"����.����"
     * @param importingClassMetadata
     * @return
     */
    @Override
    public String[] selectImports(AnnotationMetadata importingClassMetadata) {
        return new String[] {Element03.class.getName()};
    }
}
```

1. ׼��һ���� `@Configuration` ע�����࣬ͨ�����б� `@Bean` ��ǵķ������� `Element04`

```
@Configuration
public class Element04Configuration {
    @Bean
    public Element04 element04() {
        return new Element04();
    }

}
```

1. ���� `@EnableElement` ע�⣬���е� `@Import` ע���������� `Element01.class`��`Element02ImportBeanDefinitionRegistrar.class`��`Element03Selector.class`��`Element04Configuration.class`

```
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import({
        // ��ͨ�� 
        Element01.class,
        // ʵ���� ImportBeanDefinitionRegistrar ����
        Element02ImportBeanDefinitionRegistrar.class,
        // ʵ���� ImportSelector ����
        Element03Selector.class,
        // �� @Configuration ��ǵ���
        Element04Configuration.class
})
public @interface EnableElement {

}
```

1. ���ࣺ

```
// ֻ��Ҫ @EnableElement ע��
@EnableElement
public class Demo04Main {

    public static void main(String[] args) {
        // ������� Demo04Main.class
        ApplicationContext context = new AnnotationConfigApplicationContext(Demo04Main.class);

        Element01 element01 = context.getBean(Element01.class);
        System.out.println(element01.desc());

        Element02 element02 = context.getBean(Element02.class);
        System.out.println(element02.desc());

        Element03 element03 = context.getBean(Element03.class);
        System.out.println(element03.desc());

        Element04 element04 = context.getBean(Element04.class);
        System.out.println(element04.desc());
    }
}
```

��������� [gitee/funcy](https://gitee.com/funcy/spring-framework/tree/v5.2.2.RELEASE_learn/spring-learn/src/main/java/org/springframework/learn/explore/demo04).

���У�������£�

```
this is element 01
this is element 02
this is element 03
this is element 04
```

���Կ�����4 �� bean ���ɹ������� spring ������������������ͨ������������ spring ����δ���ġ�

ע�������� `ConfigurationClassPostProcessor` �����ĵ���ƪ������ǰ����ƪ���£�[���� @ComponentScan ע��](https://my.oschina.net/funcy/blog/4836178)��[���� @Bean ע��](https://my.oschina.net/funcy/blog/4492878)����ͬ�Ĵ��룬���Ļ�һ�ʴ����������������ˡ�

### 4.3 ���������ࣺ`ConfigurationClassPostProcessor#processConfigBeanDefinitions`

����������Ľ����̣�ǰ��ƪ�Ѿ�����ᵽ���ˣ���������ֱ�ӿ��ؼ����룺

```
public void processConfigBeanDefinitions(BeanDefinitionRegistry registry) {
    ...
    Set<BeanDefinitionHolder> candidates = new LinkedHashSet<>(configCandidates);
    Set<ConfigurationClass> alreadyParsed = new HashSet<>(configCandidates.size());
    do {
        // 1. ����������, ��@Component��@PropertySources��@ComponentScans��
        // @ImportResource�ȵĽ���
        parser.parse(candidates);
        parser.validate();
        // ������ɺ󣬵õ��������࣬�����ౣ���� parser �� configurationClasses ������
        Set<ConfigurationClass> configClasses 
                = new LinkedHashSet<>(parser.getConfigurationClasses());
        ...

        // 2. �� @Import ������ࡢ�������д�@Bean�ķ�����
        // @ImportResource �������Դ��ת����BeanDefinition
        this.reader.loadBeanDefinitions(configClasses);
        ...
        // ���ע��������BeanDefinition������ �� candidateNames���бȽ�
        // ������ڵĻ���˵�����µ�BeanDefinitionע�������
        if (registry.getBeanDefinitionCount() > candidateNames.length) {
            ...
            for (String candidateName : newCandidateNames) {
                // ���˱���������BeanDefinition
                if (!oldCandidateNames.contains(candidateName)) {
                    BeanDefinition bd = registry.getBeanDefinition(candidateName);
                    // 3. ������ӵ��࣬����������࣬��δ��������ӵ�candidates�У��ȴ��´�ѭ������
                    if (ConfigurationClassUtils.checkConfigurationClassCandidate(
                            bd, this.metadataReaderFactory) 
                            &&!alreadyParsedClasses.contains(bd.getBeanClassName())) {
                        candidates.add(new BeanDefinitionHolder(bd, candidateName));
                    }
                }
            }
            candidateNames = newCandidateNames;
        }
    }
    while (!candidates.isEmpty());
    ...
}
```

���ϴ��뾭����һЩ����ֻ�����˴��� `@Import` �ؼ����裬�ܽ����£�

1. ���������࣬�� `@Component`��`@PropertySources`��`@ComponentScans`��`@ImportResource` �ȵĽ�������� ����ǰ��ƪ����Ҳ�����ˣ�������Ǿۼ��� `@Import` ���ٴη���������һ����Ҫ������������ֻ��һ�������������� `main()` ������ע��� `Demo04.class`��

   ![img](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-840c14685be569012b54d94aad67ee48825.png)

2. �� `@Import` ������ࡢ�������д� `@Bean` �ķ�����`@ImportResource` �������Դ��ת���� `BeanDefinition`�����������ǰ����� `@Bean` ��ʱ��Ҳ�������ˣ��������Ҳ���������

3. ������ӵ��࣬����������࣬��δ��������ӵ� `candidates` �У��ȴ��´�ѭ������

### 4.4 ���������ࣺ`ConfigurationClassParser#doProcessConfigurationClass`

���������� `@Import` ����ν����ģ����� `ConfigurationClassParser#doProcessConfigurationClass`��

```
/**
 * �����������������������ķ���
 */
protected final SourceClass doProcessConfigurationClass(ConfigurationClass configClass, 
        SourceClass sourceClass) throws IOException {
    // 1. ����� @Component ע�⣬�ݹ鴦���ڲ��࣬���Ĳ���ע
    ...

    // 2. ����@PropertySourceע�⣬���Ĳ���ע
    ...

    // 3. ���� @ComponentScan/@ComponentScans ע�⣬���Ĳ���ע
    ...

    // 4. ����@Importע��
    processImports(configClass, sourceClass, getImports(sourceClass), true);

    // 5. ����@ImportResourceע�⣬���Ĳ���ע
    ...

    // 6. ����@Bean��ע�⣬���Ĳ���ע
    ...

    // 7. ����������ĸ��࣬���� processConfigurationClass(...) ��������һ��ѭ��ʱ����
    ...
    return null;
}
```

���� `@Import` ע����õ��� `processImports(...)` ���������Ǽ�����

#### 1. ��ȡ `@Import` �������

�����ǰ�Ŀ��ŵ� `processImports(...)` ������

```
processImports(configClass, sourceClass, getImports(sourceClass), true);
```

��������������� 4 ��������

- `configClass`�������࣬���� `demo04Main` ��Ӧ�������ࣻ
- `sourceClass`���� `demo04Main` �����ϵ�ע��İ�װ��
- `getImports(sourceClass)`��`getImports(...)` ������ȡ���� `sourceClass` ������ `@Import` ע��������ࣻ
- `true`������ֵ���Ƿ���ѭ�����롣

���У���ȡ `@Import` ע����������� `getImports(...)` �Ĺ��ܣ������������������������λ�ȡ�ģ�

```
private Set<SourceClass> getImports(SourceClass sourceClass) throws IOException {
    Set<SourceClass> imports = new LinkedHashSet<>();
    Set<SourceClass> visited = new LinkedHashSet<>();
    // �������ȡ
    collectImports(sourceClass, imports, visited);
    return imports;
}

/**
 * ����Ļ�ȡ����
 */
private void collectImports(SourceClass sourceClass, Set<SourceClass> imports, 
        Set<SourceClass> visited) throws IOException {
    if (visited.add(sourceClass)) {
        for (SourceClass annotation : sourceClass.getAnnotations()) {
            String annName = annotation.getMetadata().getClassName();
            if (!annName.equals(Import.class.getName())) {
                // ���annotation�����Ʋ���import����ݹ���� collectImports(...) ����
                collectImports(annotation, imports, visited);
            }
        }
        // ��ȡ��ǰ��� @Import ע��
        imports.addAll(sourceClass.getAnnotationAttributes(Import.class.getName(), "value"));
    }
}
```

��ȡ `@Import` �ķ����� `ConfigurationClassParser#collectImports`�������������ȡ��ȡ��������ʽ���£�

1. ��ȡ�����������ע�⣻
2. ������Щע�⣬����� `@Import` ע�⣬���ȡ `@Import` �� `value` ֵ�����򣬻ص���һ������������

����֮���������� `demo04Main` �ϵ� `@EnableElement` ע��ᱻ��ȡ�����������ע�ⲻ�� `@Import` ע�⣬�ͼ�����ȡ `@EnableElement` ���ϵ�ע�⣬��ʱ���� `@EnableElement` �� `@Import` ע�⣬��ʱ�ͻ��ȡ `@Import` �� `value()` ֵ��Ҳ���� `@Import` ע��������ࡣ

����������к� ���õ��Ľ�����£�

![img](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-05c7fb442b4bb84d13ff6688e5fbf31cfa5.png)

![img](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-4e7153f9cbb922496e7c303cc3c35e7eceb.png)

![img](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-b238838641af43b783fc9b14c4226f5c1eb.png)

![img](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-d7e2063676e6e19850c35893b62f4ab76a9.png)

�õ��Ľ��Ϊ `LinkedHashSet`��һ�ν�ͼ�����㣬��˷�Ϊ�� 4 ��ͼ�����Կ�����`@Import` ע������� 4 ���඼��ȡ���ˣ�

![img](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-d615198a8f6dbef1ac6a800526311f36078.png)

#### 2. ���� `@Import` �������

��ȡ�� `@Import` ע�⵼���������������� `processImports(...)` ������

```
private void processImports(ConfigurationClass configClass, SourceClass currentSourceClass,
        Collection<SourceClass> importCandidates, boolean checkForCircularImports) {
    ...
    for (SourceClass candidate : importCandidates) {
        // 1. ������������� ImportSelector
        if (candidate.isAssignable(ImportSelector.class)) {
            Class<?> candidateClass = candidate.loadClass();
            // ʵ��������� ImportSelector�����һ�ִ�� Aware �ӿڷ���
            // ֧�ֵ�Aware��BeanClassLoaderAware��BeanFactoryAware��EnvironmentAware��ResourceLoaderAware
            ImportSelector selector = ParserStrategyUtils.instantiateClass(candidateClass, 
                    ImportSelector.class, this.environment, this.resourceLoader, this.registry);
            if (selector instanceof DeferredImportSelector) {
                this.deferredImportSelectorHandler.handle(configClass, (DeferredImportSelector) selector);
            }
            else {
                // ִ�� selectImports ��������ȡ������࣬������Ϊ�������"����.����"
                String[] importClassNames = selector.selectImports(currentSourceClass.getMetadata());
                Collection<SourceClass> importSourceClasses = asSourceClasses(importClassNames);
                // �ݹ���� processImports(...) ��������һ�δ����������
                processImports(configClass, currentSourceClass, importSourceClasses, false);
            }
        }
        // 2. ������������� ImportBeanDefinitionRegistrar
        else if (candidate.isAssignable(ImportBeanDefinitionRegistrar.class)) {
            Class<?> candidateClass = candidate.loadClass();
            // ʵ���� ImportBeanDefinitionRegistrar������ִ�� Aware �ӿڵķ���
            // ֧�ֵ�Aware��BeanClassLoaderAware��BeanFactoryAware��EnvironmentAware��ResourceLoaderAware
            ImportBeanDefinitionRegistrar registrar = ParserStrategyUtils
                    .instantiateClass(candidateClass, ImportBeanDefinitionRegistrar.class, 
                    this.environment, this.resourceLoader, this.registry);
            // �� ImportBeanDefinitionRegistrar ��������
            configClass.addImportBeanDefinitionRegistrar(registrar, currentSourceClass.getMetadata());
        }
        // 3. �����������ߣ����� processConfigurationClass(...) ֱ�ӽ���
        // �����������������ࣨ���� @Component��@Configuration��@Import ��ע�⣩������������н���
        else {
            this.importStack.registerImport(
                    currentSourceClass.getMetadata(), candidate.getMetadata().getClassName());
            processConfigurationClass(candidate.asConfigClass(configClass));
        }
    }

    ...
}
```

�����Ǿ��������Ĵ��룬����ֻ������ `@Import` �Ĺؼ����裺

1. ���������������� `ImportSelector`�������������£�

    1. ʹ�÷���ʵ���� `ImportSelector`��֮����ִ�� `Aware` �ӿڷ��������������ڴ��� `ImportSelector` ʱ��������ʵ�� `Aware` �ӿڣ�֧�ֵ� `Aware` �� `BeanClassLoaderAware`��`BeanFactoryAware`��`EnvironmentAware`��`ResourceLoaderAware`��
    2. ִ�� `ImportSelector` ʵ���� `selectImports` ��������һ����Ϊ�˻�ȡ������࣬���Ϊ `Class[]`��������� "����������"��`Element03Selector` �и÷����������£�

   ```
   @Override
   public String[] selectImports(AnnotationMetadata importingClassMetadata) {
       return new String[] {Element03.class.getName()};
   }
   ```

   ��һ�����ȡ�� `Element03.class`; 3. ����ȡ���� `Class` ���飬ת���� `SourceClass` ���ϣ���һ�ε��� `processImports(...)`���ڵڶ��ε���ʱ�������������� `Element03`��

2. ���������������� `ImportBeanDefinitionRegistrar`�������������£�

    1. ʵ���� `ImportBeanDefinitionRegistrar`������ִ�� `Aware` �ӿڵķ�������һ��ͬ `ImportSelector` ��ʵ��������һ��������׸����
    2. ����һ���õ��� `ImportBeanDefinitionRegistrar` ʵ�����浽 `configClass` �У����������ٷ�������������ʵ������δ���ģ�

3. �������������Ͳ����������ߣ����� `processConfigurationClass(...)` ֱ�ӽ������������ǰ��ƪ�����Ѿ�����ἰ�ˣ������������� `@Component`��`@Import`��`@ComponentScan`��`@Configuration`��`@Bean` ��ע��ģ���һ����Ϊ�˽����������е���Щע�⣬����� `Element01`��`Element02`��`Element03`(����� 1 �����ᵽ�ģ��� `Element03Selector` �л�ȡ�� `Element03.class` �󣬽���ת���� `SourceClass`���ٴε��� `processImports(...)` �Ĺ���) ��������һ�������ġ�

����������Ƿ��֣����� `ImportBeanDefinitionRegistrar` �ķ�ʽ�⣬�����������뷽ʽ����ͨ�ࡢ�����ࡢ`ImportSelector` ��ʵ���ࣩ����һ���Ĵ���ʽ�����ǰ�**������Ľ�����ʽ������**�����յ��õ��� `processConfigurationClass(...)` ��������һ ������ǰ��ƪ�����Ѿ���η����ˣ�����Ͳ��ٷ����ˣ��������������������� `ImportBeanDefinitionRegistrar` �Ĵ���

### 4.5 ���� `BeanDefinitions`��`ConfigurationClassBeanDefinitionReader#loadBeanDefinitions`

�ڷ��� `@Bean` ����ʱ�����Ƿ����� `ConfigurationClassBeanDefinitionReader#loadBeanDefinitions` ���� `@Bean` ���������̣����������������� `@Import` �����̣�����ֱ�ӽ���ؼ����� `ConfigurationClassBeanDefinitionReader#loadBeanDefinitionsForConfigurationClass`��

```
private void loadBeanDefinitionsForConfigurationClass(
        ConfigurationClass configClass, TrackedConditionEvaluator trackedConditionEvaluator) {
    ...

    // ���� @Import �����������
    if (configClass.isImported()) {
        registerBeanDefinitionForImportedConfigurationClass(configClass);
    }
    // ���� @Bean ����
    for (BeanMethod beanMethod : configClass.getBeanMethods()) {
        loadBeanDefinitionsForBeanMethod(beanMethod);
    }
    // ���� @ImportResource �������Դ
    loadBeanDefinitionsFromImportedResources(configClass.getImportedResources());
    // ���� @Import ����� ImportBeanDefinitionRegistrar
    // ǰ�汣����configClass�е�ImportBeanDefinitionRegistrars��������ʹ����
    loadBeanDefinitionsFromRegistrars(configClass.getImportBeanDefinitionRegistrars());
}
```

���� `@Import` �ĵط���������

1. ���� `@Import` �����������
2. ���� `@Import` ����� `ImportBeanDefinitionRegistrar`

���Ƿֱ�����������������δ���ġ�

#### 1. ���� `@Import` �����������

���� `@Import` ��������������ش���Ϊ��

```
    // ���� @Import �����������
    if (configClass.isImported()) {
        registerBeanDefinitionForImportedConfigurationClass(configClass);
    }
```

���ǽ�������һ̽������

```
private void registerBeanDefinitionForImportedConfigurationClass(ConfigurationClass configClass) {
    AnnotationMetadata metadata = configClass.getMetadata();
    // ���� BeanDefinition������Ϊ AnnotatedGenericBeanDefinition
    AnnotatedGenericBeanDefinition configBeanDef = new AnnotatedGenericBeanDefinition(metadata);
    // ����һϵ�е�����
    ScopeMetadata scopeMetadata = scopeMetadataResolver.resolveScopeMetadata(configBeanDef);
    configBeanDef.setScope(scopeMetadata.getScopeName());
    String configBeanName = this.importBeanNameGenerator.generateBeanName(configBeanDef, this.registry);
    AnnotationConfigUtils.processCommonDefinitionAnnotations(configBeanDef, metadata);
    BeanDefinitionHolder definitionHolder = new BeanDefinitionHolder(configBeanDef, configBeanName);
    definitionHolder = AnnotationConfigUtils
            .applyScopedProxyMode(scopeMetadata, definitionHolder, this.registry);
    // ע��
    this.registry.registerBeanDefinition(definitionHolder.getBeanName(), 
            definitionHolder.getBeanDefinition());
    configClass.setBeanName(configBeanName);
}
```

�����һ������ע�ᵽ `BeanDefinition` �еĹ��̣�ʹ�õ� `BeanDefinition` �� `AnnotatedGenericBeanDefinition`��

#### 2. ���� `@Import` ����� `ImportBeanDefinitionRegistrar`

����ù��̵ķ���Ϊ `loadBeanDefinitionsFromRegistrars(...)`���������£�

```
private void loadBeanDefinitionsFromRegistrars(Map<ImportBeanDefinitionRegistrar, 
        AnnotationMetadata> registrars) {
    registrars.forEach((registrar, metadata) ->
            registrar.registerBeanDefinitions(metadata, this.registry, 
                    this.importBeanNameGenerator));
}
```

�÷������Ǳ�������� `ImportBeanDefinitionRegistrar` ���ϣ�Ȼ����һ�������е� `ImportBeanDefinitionRegistrar#registerBeanDefinitions(AnnotationMetadata, BeanDefinitionRegistry, BeanNameGenerator)` �������÷���λ�� `ImportBeanDefinitionRegistrar` �ӿڣ��������£�

```
public interface ImportBeanDefinitionRegistrar {

    /**
     * Ĭ�Ϸ�����Ĭ��ʵ�ֽ�������һ������
     */
    default void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, 
            BeanDefinitionRegistry registry,BeanNameGenerator importBeanNameGenerator) {
        registerBeanDefinitions(importingClassMetadata, registry);
    }

    /**
     * �� Element02ImportBeanDefinitionRegistrar ��ʵ�ֵķ���
     */
    default void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, 
            BeanDefinitionRegistry registry) {
    }

}
```

`ImportBeanDefinitionRegistrar#registerBeanDefinitions(AnnotationMetadata, BeanDefinitionRegistry, BeanNameGenerator)` ��������һ�����ã����յ��õ��� `ImportBeanDefinitionRegistrar#registerBeanDefinitions(AnnotationMetadata, BeanDefinitionRegistry)`�������ǵ� `Element02ImportBeanDefinitionRegistrar` ����ʵ���˸÷�����

```
public class Element02ImportBeanDefinitionRegistrar implements ImportBeanDefinitionRegistrar {
    @Override
    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, 
            BeanDefinitionRegistry registry) {
        registry.registerBeanDefinition("element02", new RootBeanDefinition(Element02.class));
    }
}
```

���˴���죬���շ��� `ImportBeanDefinitionRegistrar` ע�ᵽ `beanDefinitionMap` ���߼��������Լ�д�ģ�

#### 3. �������л�ȡ `ElementXx`

�������`Element01`��`Element02`��`Element03`��`Element04` �͵�ע�ᵽ `beanDefinitionMap` ���ˣ������ǿ�һ�� `beanDefinitionNames` �е����ݣ�

![img](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-68171a4af503b3e80b23d10a91834e231aa.png)

���Է��֣�`Element01` �� `Element03` beanName ��ͬѰ���������� bean �����뷽ʽΪ

![img](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-0e07154a732c2a884803531e54aa10a0ef9.png)

�����ʹ�� `beanFactory.get(��beanName��)` ʱ��Ҫע�⣺

```
// ��ȡ�������ᱨ��
beanFactory.get("element01");
// �ܻ�ȡ��
beanFactory.get("element02");
// ��ȡ�������ᱨ��
beanFactory.get("element03");
// �ܻ�ȡ��
beanFactory.get("element04");
```

ʹ�� `beanFactory.get(��beanName��)` ��ȡ `element01` �� `element03` ��Ҫ������ȡ��

```
// �ܻ�ȡ��
beanFactory.get("org.springframework.learn.explore.demo04.element.Element01");
// �ܻ�ȡ��
beanFactory.get("org.springframework.learn.explore.demo04.element.Element03");
```

��Ȼ������Ҳ����ʹ�� `beanFactory.get(Class)` �ķ�ʽ��ȡ��

```
// �ܻ�ȡ��
beanFactory.get(Element01.class);
// �ܻ�ȡ��
beanFactory.get(Element02.class);
// �ܻ�ȡ��
beanFactory.get(Element03.class);
// �ܻ�ȡ��
beanFactory.get(Element04.class);
```

### 4.6 ���䣺`DeferredImportSelector` �Ĵ���

�ڷ��� `ConfigurationClassParser#processImports` ����ʱ������ `ImportSelector` ������ʱ������ôһ�δ��룺

![img](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-4fb0dddcbf45d84ad5260c43a5b55e85a0a.png)

��δ�������ж� `selector` �Ƿ�Ϊ `DeferredImportSelector` ��ʵ��������ǾͰ� `DeferredImportSelector` ���͵�ʵ�����д�������Ͱ���ͨ�� `ImportSelector` ������������������������ `DeferredImportSelector` ����ͨ�� `ImportSelector` �кβ�ͬ��

`DeferredImportSelector` �Ĵ������£�

```
/**
 * DeferredImportSelector �� ImportSelector���ӽӿ�
 */
public interface DeferredImportSelector extends ImportSelector {

    /**
     * ���ص������
     */
    @Nullable
    default Class<? extends Group> getImportGroup() {
        return null;
    }


    /**
     * ����Ķ���
     */
    interface Group {

        /**
         * �÷���Ĵ�����
         */
        void process(AnnotationMetadata metadata, DeferredImportSelector selector);

        /**
         * ���ظ÷��������
         */
        Iterable<Entry> selectImports();


        /**
         * �����Ԫ�ض���
         */
        class Entry {

            /**
             * ע������
             */
            private final AnnotationMetadata metadata;

            /**
             * ���������
             */
            private final String importClassName;

            public Entry(AnnotationMetadata metadata, String importClassName) {
                this.metadata = metadata;
                this.importClassName = importClassName;
            }

            // ʡ�� get/set ������ʡ�� equals/toString/hashCode ����
            ...

        }
    }
}
```

������Ĵ�����Կ�����

- `DeferredImportSelector` �� `ImportSelector` ���ӽӿڣ��߱� `ImportSelector` �Ĺ���
- `DeferredImportSelector` �ṩ��һ��������`Class<? extends Group> getImportGroup()`���÷������ص��ǵ�ǰ `DeferredImportSelector` ʵ�����ڵķ��顣

��������������ע���д��룺

```
this.deferredImportSelectorHandler.handle(configClass, (DeferredImportSelector) selector);
```

���������д���������ʲô������ `ConfigurationClassParser#handler����`��

```
class ConfigurationClassParser {

    ...

    private class DeferredImportSelectorHandler {

        @Nullable
        private List<DeferredImportSelectorHolder> deferredImportSelectors = new ArrayList<>();

        public void handle(ConfigurationClass configClass, DeferredImportSelector importSelector) {
            // �� configClass �� importSelector ��װ�� DeferredImportSelectorHolder
            DeferredImportSelectorHolder holder = new DeferredImportSelectorHolder(
                    configClass, importSelector);
            if (this.deferredImportSelectors == null) {
                DeferredImportSelectorGroupingHandler handler 
                    = new DeferredImportSelectorGroupingHandler();
                handler.register(holder);
                handler.processGroupImports();
            }
            else {
                // ��ӵ� deferredImportSelectors ��
                this.deferredImportSelectors.add(holder);
            }
        }
        ...
    }
    ...
}
```

���Կ����������ϴ�Ƚ� `configClass` �� `importSelector` ��װ�� `DeferredImportSelector`��Ȼ������ӵ� `deferredImportSelectors`��

��ĿǰΪֹ��`DeferredImportSelector` ������ಢû�н��д�����ô `DeferredImportSelector` ��������������ﴦ����أ������ǻص� `ConfigurationClassParser#parse(Set<BeanDefinitionHolder>)` ������

```
public class  ConfigurationClassParser {
    public void parse(Set<BeanDefinitionHolder> configCandidates) {
        // ѭ����������������
        for (BeanDefinitionHolder holder : configCandidates) {
            BeanDefinition bd = holder.getBeanDefinition();
            try {
                // ������BeanDefinition��AnnotatedBeanDefinition��ʵ��
                if (bd instanceof AnnotatedBeanDefinition) {
                    parse(((AnnotatedBeanDefinition) bd).getMetadata(), holder.getBeanName());
                }
                ...
            }
            catch (BeanDefinitionStoreException ex) {
                throw ex;
            }
            catch (Throwable ex) {
                ...
            }
        }
        // �����ﴦ�� DeferredImportSelector
        this.deferredImportSelectorHandler.process();
    }
    ...
}
```

���Կ������ڴ�����������Ľ���������������� `DeferredImportSelector`��Ҳ����������ӵ� `deferredImportSelectors` �����ݣ����õ��� `deferredImportSelectorHandler.process()`.

���Ǽ�����

```
class ConfigurationClassParser {

    private class DeferredImportSelectorHandler {
        ...
        public void process() {
            List<DeferredImportSelectorHolder> deferredImports = this.deferredImportSelectors;
            this.deferredImportSelectors = null;
            try {
                if (deferredImports != null) {
                    DeferredImportSelectorGroupingHandler handler 
                        = new DeferredImportSelectorGroupingHandler();
                    // ����DeferredImportSelector ����ָ������˳��@Order/Orderd
                    deferredImports.sort(DEFERRED_IMPORT_COMPARATOR);
                    // �������� DeferredImportSelectorGroupingHandler#register ����
                    deferredImports.forEach(handler::register);
                    // ������
                    handler.processGroupImports();
                }
            }
            finally {
                this.deferredImportSelectors = new ArrayList<>();
            }
        }
        ...
    }
    ...
}
```

`process()` �����������£�

1. ���������Ҫ�Ǹ��� `@Order` ע�⣬����ʵ���� `Orderd` �ӿ�������
2. �������� `DeferredImportSelectorGroupingHandler#register` ��������ʵ���ǽ� `deferredImports` �е�Ԫ��ע�ᵽ `handler` �У�
3. ���� `handler.processGroupImports()` �����������롣

������������ `handler.processGroupImports()` ������

```
class ConfigurationClassParser {

    ...

    private class DeferredImportSelectorGroupingHandler {
        ...
        /**
         * ���յĴ�����
         * �����ﴦ����鵼��
         */
        public void processGroupImports() {
            for (DeferredImportSelectorGrouping grouping : this.groupings.values()) {
                // �������飬 grouping.getImports()�ǹؼ�
                grouping.getImports().forEach(entry -> {
                    ConfigurationClass configurationClass = this.configurationClasses.get(
                            entry.getMetadata());
                    try {
                        // ͬImportSelector��ʵ����һ��������Ҳ�ǵ��� processImports(...) ������
                        // ע�� entry.getImportClassName()����һ�ε��� processImports(...) �Ĳ�
                        // ����ImportSelector�������
                        processImports(configurationClass, asSourceClass(configurationClass),
                                asSourceClasses(entry.getImportClassName()), false);
                    }
                    catch (...) {
                        ...
                    }
                });
            }
        }
        ...
    }
    ...

}
```

`processGroupImports(...)` ��Ҫ�߼����£�

1. ��������
2. ���� `grouping.getImports()` ��ȡ�������
3. ���� `processImports` ���������ĵ��룬���ͬ���� `ImportSelector` �ӿ�������һ����

���������� `grouping.getImports()` �������÷���Ϊ `ConfigurationClassParser.DeferredImportSelectorGrouping#getImports`���������£�

```
public Iterable<Group.Entry> getImports() {
    for (DeferredImportSelectorHolder deferredImport : this.deferredImports) {
        // ִ�� Group#process
        this.group.process(deferredImport.getConfigurationClass().getMetadata(),
                deferredImport.getImportSelector());
    }
    // ִ�� Group#selectImports
    return this.group.selectImports();
}
```

��������������� `DeferredImportSelector.Group` ������������

- `DeferredImportSelector.Group#process`
- `DeferredImportSelector.Group#selectImports`

������������������С�ڵ�һ��ʼ������������뼰��ע�ͣ��������������� `DeferredImportSelector.Group#selectImports` �������ص�.

�������ϰ��죬�ܽ��� `DeferredImportSelector` �� `ImportSelector` ���ߵ�����

- `DeferredImportSelector` ����ָ�����飺�ڴ���ʱ�����Ը��ݷ���ͳһ����
- `DeferredImportSelector` ����ʱ�����������������������֮���ٴ���
- `DeferredImportSelector` ������ķ��أ���ͬ�� `ImportSelector`������������ `ImportSelector#selectImports` �������أ��������������� `DeferredImportSelector.Group#selectImports` �������ء�

### 4.7 �ܽ�

������Ҫ������ `ConfigurationClassPostProcessor` �� `@Import` ע��Ĵ����ܽ�����:

1. `@Import` �ɵ�������� 4 �֣��ֱ�����ͨ�ࡢ�����ࡢʵ���� `ImportSelector` �����Լ�ʵ���� `ImportBeanDefinitionRegistrar` ���ࣻ
2. ��ȡ `@Import` ע�⣺spring �ڻ�ȡ���ϵ� `@Import` ʱ���Ȼ�ȡ���ϵ�����ע�⣬Ȼ����һ�жϣ������ǰע���� `@Import`�����ȡ `@Import` ��������� (����Ϊ `Import#value`)�������ȡ��ǰע���ϵ�����ע�⣬�ظ����ϴ���
3. ���� `@Import` ������ࣺ��ͨ�ࡢ������ͳһ����������������ʵ���� `ImportSelector` ���࣬��� `selectImports(...)` �������ص� �������������� ���õ� class��Ȼ��Ҳ�ǰ������������ʵ�� `ImportBeanDefinitionRegistrar` ���࣬��Ѷ�Ӧ���ʵ�����浽��ǰ�������У�����ע�ᵽ `beanDefinitionMap` ʱ�����Ǵ������ȡ�ģ�
4. ��������ע�ᵽ `beanDefinitionMap`��ʵ���� `ImportSelector` �������յõ�����һ����ͨ��������࣬ͬ�������ͨ����������һ����ֱ��ע�᣻ʵ�� `ImportBeanDefinitionRegistrar` ���࣬������ `ImportBeanDefinitionRegistrar#registerBeanDefinitions(AnnotationMetadata, BeanDefinitionRegistry)` ��������ע�ᣬע���߼���ʵ�������ж��塣

------

*����ԭ�����ӣ�https://my.oschina.net/funcy/blog/4678152 ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������*