�� [spring ��������ִ֮�� BeanFactoryPostProcessor](https://my.oschina.net/funcy/blog/4641114) һ���У���ִ�� `BeanFactoryPostProcessor` �����У���һ����Ҫ����ᱻִ�е��������� `ConfigurationClassPostProcessor`�������ǳ���Ҫ�����ᴦ�� spring �������࣬�� `@Component`��`@PropertySources`��`@ComponentScans`��`@ImportResource` ��ע�⣬��ϵ�����½�ͨ������ʵ������Դ��ĽǶȷ��� spring ���⼸��ע��Ĵ���

## 1\. �ع� `BeanFactoryPostProcessor` ��ִ��

������ `BeanFactoryPostProcessor` ��ִ�У�����������:

```
AnnotationConfigApplicationContext#AnnotationConfigApplicationContext(java.lang.String...)
 |-AbstractApplicationContext#refresh
  |-AbstractApplicationContext#invokeBeanFactoryPostProcessors
   |-PostProcessorRegistrationDelegate
     #invokeBeanFactoryPostProcessors(ConfigurableListableBeanFactory, List)

```

�� `PostProcessorRegistrationDelegate#invokeBeanFactoryPostProcessors(ConfigurableListableBeanFactory, List)` �У������ε��� `ConfigurationClassPostProcessor` �ķ�����

*   `invokeBeanDefinitionRegistryPostProcessors(currentRegistryProcessors, registry)`�����õ��� `BeanDefinitionRegistryPostProcessor#postProcessBeanDefinitionRegistry` ������
*   `invokeBeanFactoryPostProcessors(registryProcessors, beanFactory)`�����õ��� `BeanFactoryPostProcessor#postProcessBeanFactory` ������

`ConfigurationClassPostProcessor` ͬʱʵ���� `BeanDefinitionRegistryPostProcessor` �� `BeanFactoryPostProcessor`���������������������ִ�е����������������� `ConfigurationClassPostProcessor` ��������������

```
/**
 * ��ִ�� postProcessBeanDefinitionRegistry(...)
 */
@Override
public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) {
    int registryId = System.identityHashCode(registry);
    if (this.registriesPostProcessed.contains(registryId)) {
        throw new IllegalStateException(...);
    }
    if (this.factoriesPostProcessed.contains(registryId)) {
        throw new IllegalStateException(...);
    }
    this.registriesPostProcessed.add(registryId);
    // �ֵ�����һ������
    processConfigBeanDefinitions(registry);
}

/**
 * ִ���� postProcessBeanDefinitionRegistry(...) ����ִ�� postProcessBeanFactory(...)
 */
@Override
public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) {
    int factoryId = System.identityHashCode(beanFactory);
    if (this.factoriesPostProcessed.contains(factoryId)) {
        throw new IllegalStateException(
                "postProcessBeanFactory already called on this post-processor against " + beanFactory);
    }
    this.factoriesPostProcessed.add(factoryId);
    if (!this.registriesPostProcessed.contains(factoryId)) {
        // ��� beanFactory û�б���������ִ��һ�� processConfigBeanDefinitions ����
        // һ������£����ﲻ�ᱻִ�е�
        processConfigBeanDefinitions((BeanDefinitionRegistry) beanFactory);
    }
    // ��ǿ������
    enhanceConfigurationClasses(beanFactory);
    // ��Ӵ��� ImportAware �ص��� BeanPostProcessor���뱾�������ϵ���󣬲�����
    beanFactory.addBeanPostProcessor(new ImportAwareBeanPostProcessor(beanFactory));
}

```

����������������˵�����£�

*   ���� `PostProcessorRegistrationDelegate#invokeBeanFactoryPostProcessors(ConfigurableListableBeanFactory, List)` ��ִ���߼�������ִ�� `postProcessBeanDefinitionRegistry(...)`����ִ�� `postProcessBeanDefinitionRegistry(...)`
*   `postProcessBeanDefinitionRegistry(...)` ��Ҫ�ǵ��� `processConfigBeanDefinitions(...)` ������
*   `postProcessBeanFactory(...)` �����жϵ�ǰ beanFactory �Ƿ�ִ�й� `processConfigBeanDefinitions(...)` ���������û�У����ִ�� `processConfigBeanDefinitions(...)` ������֮��� `enhanceConfigurationClasses(...)` �����������������ǿ��

�����Ϸ������������������������յ��õ��� `processConfigBeanDefinitions(...)` �� `enhanceConfigurationClasses(...)`��������������������ǽ������������ص㡣

## 2\. spring ����δ��� `@ComponentScan` ע��ģ�

### 2.1 demo ׼��

�ڷ�������ǰ��������׼������ demo:

����׼��һ���࣬������� `@ComponentScan` ע�⣺

```
@ComponentScan("org.springframework.learn.explore.demo02")
public class BeanConfigs {

}

```

��׼������ `Bean`��

```
@Component
public class BeanObj1 {

    public BeanObj1() {
        System.out.println("����beanObj1�Ĺ��췽��");
    }

    @Override
    public String toString() {
        return "BeanObj1{}";
    }
}

@Component
public class BeanObj2 {

    public BeanObj2() {
        System.out.println("����beanObj2�Ĺ��췽��");
    }

    @Override
    public String toString() {
        return "BeanObj2{}";
    }
}

```

��������ࣺ

```
public class Demo05Main {
    public static void main(String[] args) {
        ApplicationContext context = new AnnotationConfigApplicationContext(BeanConfigs.class);
        Object obj1 = context.getBean("beanObj1");
        Object obj2 = context.getBean("beanObj2");
        System.out.println("obj1:" + obj1);
        System.out.println("obj2:" + obj2);
        System.out.println(context.getBean("beanConfigs"));
    }
}

```

����ֻ�� demo ����Ҫ���֣������� demo �� [gitee/funcy](https://gitee.com/funcy/spring-framework/tree/v5.2.2.RELEASE_learn/spring-learn/src/main/java/org/springframework/learn/explore/demo05).

���У�������£�

```
����beanObj1�Ĺ��췽��
����beanObj2�Ĺ��췽��
obj1:BeanObj1{}
obj2:BeanObj2{}
org.springframework.learn.explore.demo05.BeanConfigs@13eb8acf

```

��������������� demo Ϊ����һ�������з�����

### 2.2 `ApplicationContext` �Ĺ��췽����`AnnotationConfigApplicationContext(Class)`

���ǽ��� `AnnotationConfigApplicationContext` �Ĺ��췽��:

```
public AnnotationConfigApplicationContext(Class<?>... componentClasses) {
    this();
    register(componentClasses);
    // spring ����������
    refresh();
}

/**
 * this() �����ĵ�������
 */
public AnnotationConfigApplicationContext() {
    // ��������Ա���и�ֵ
    // ������õ���`AnnotationConfigApplicationContext(Class)`���� �����������Բ����õ�
    // ������õ���`AnnotationConfigApplicationContext(String)`���� �����������ԲŻ��õ�
    this.reader = new AnnotatedBeanDefinitionReader(this);
    this.scanner = new ClassPathBeanDefinitionScanner(this);
}

/**
 * register(...) ����������
 */
@Override
public void register(Class<?>... componentClasses) {
    Assert.notEmpty(componentClasses, "At least one component class must be specified");
    this.reader.register(componentClasses);
}

```

`AnnotationConfigApplicationContext` �Ĺ��췽���������£�

*   `this()`�������޲ι��췽���������������Ҫ�Ǹ� `reader` �� `scanner` ��Ա������ֵ��
*   `register(componentClasses)`��ע�� `component` �ൽ `beanFactory` �У����õ��� `reader.register(...)` ������
*   `refresh()`��spring �����������������Ͳ�������

ִ���� `register(componentClasses);` ǰ��`beanFactory` �ڵ� `BeanDefinitionMap` �������£�

ִ��ǰ��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-c317168bfde886f7817e6e9a11301c84b52.png)

ִ�к�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-cc2f7bcdb4b56f67893ac29774bb8119892.png)

���Կ�����`beanConfigs` �Ѿ�ע�ᵽ `beanDefinitionNames` �ˡ�

�����spring ����ֻ�ǰ� `beanConfigs` ע�ᵽ�� `beanDefinitionNames`��`BeanConfigs` �� `new AnnotationConfigApplicationContext(BeanConfigs.class)` ����ģ�����û��ɨ�� `@ComponentSacn` ע��ָ���İ�����Ҳ���� `org.springframework.learn.explore.demo05`����ô����ɨ������������е��أ���Ӧ���� `ConfigurationClassPostProcessor` �У����Ǽ������¿���

### 2.3 ���������ࣺ`ConfigurationClassPostProcessor#processConfigBeanDefinitions`

���ݿ�ƪ�ķ���������ֱ�ӽ��� `ConfigurationClassPostProcessor#processConfigBeanDefinitions` ���������������£�

```
AnnotationConfigApplicationContext#AnnotationConfigApplicationContext(Class)
 |-AbstractApplicationContext#refresh
  |-AbstractApplicationContext#invokeBeanFactoryPostProcessors
   |-PostProcessorRegistrationDelegate
      #invokeBeanFactoryPostProcessors(ConfigurableListableBeanFactory, List)
    |-PostProcessorRegistrationDelegate#invokeBeanDefinitionRegistryPostProcessors
     |-ConfigurationClassPostProcessor#postProcessBeanDefinitionRegistry
      |-ConfigurationClassPostProcessor#processConfigBeanDefinitions

```

�����������£�

```
public void processConfigBeanDefinitions(BeanDefinitionRegistry registry) {
    List<BeanDefinitionHolder> configCandidates = new ArrayList<>();
    // 1\. ��ȡ����BeanDefinition����
    String[] candidateNames = registry.getBeanDefinitionNames();
    // 2\. ѭ��candidateNames���飬��ʶFull��Lite
    for (String beanName : candidateNames) {
        BeanDefinition beanDef = registry.getBeanDefinition(beanName);
        // �жϵ�ǰBeanDefinition���Ѿ�������ˣ�������˾Ͳ��ٴ�����
        if (beanDef.getAttribute(ConfigurationClassUtils.CONFIGURATION_CLASS_ATTRIBUTE) != null) {
            // ����ֻ�Ǵ��˸�log��ʡ��
            ...
        }
        // �ж��Ƿ�Ϊ�����࣬��������������
        //  1\. ���� @Configuration ע���� proxyBeanMethods != false ���࣬spring ����Ϊ Full ������
        //  2\. ���� @Configuration ע���� proxyBeanMethods == false, ����� @Component��@ComponentScan��
        //     @Import��@ImportResource��@Bean ����֮һע����࣬spring ����Ϊ Lite ������
        // ������Full��Lite�����б�ʶ
        else if (ConfigurationClassUtils
                 .checkConfigurationClassCandidate(beanDef, this.metadataReaderFactory)) {
            configCandidates.add(new BeanDefinitionHolder(beanDef, beanName));
        }
    }
    // ���û�������ֱ࣬�ӷ���
    if (configCandidates.isEmpty()) {
        return;
    }

    // ʡ���޹صĴ���
    ...

    // ������������������ǳ���Ҫ������������������� ��@Component��@Import��ע���
    ConfigurationClassParser parser = new ConfigurationClassParser(
            this.metadataReaderFactory, this.problemReporter, this.environment,
            this.resourceLoader, this.componentScanBeanNameGenerator, registry);
    // �����ṹ��candidates����Ҫ�����������࣬alreadyParsed����ɽ�����������
    Set<BeanDefinitionHolder> candidates = new LinkedHashSet<>(configCandidates);
    Set<ConfigurationClass> alreadyParsed = new HashSet<>(configCandidates.size());
    do {
        // 3\. ���������࣬����������˺ܶ��£�
        // �磺����@Component��@PropertySources��@ComponentScans��@ImportResource��ע��
        // ע��������һ���Խ������е�candidates
        parser.parse(candidates);
        parser.validate();
        Set<ConfigurationClass> configClasses = new LinkedHashSet<>(parser.getConfigurationClasses());
        configClasses.removeAll(alreadyParsed);
        // ���� reader�����reader��ǰ��ApplicationContext�е�reader����ͬһ��
        if (this.reader == null) {
            this.reader = new ConfigurationClassBeanDefinitionReader(
                    registry, this.sourceExtractor, this.resourceLoader, this.environment,
                    this.importBeanNameGenerator, parser.getImportRegistry());
        }
        // 4\. �����ν�������
        // ���ǰ�@Import������ࡢ�������д�@Bean�ķ�����@ImportResource�������Դ��ת����BeanDefinition
        this.reader.loadBeanDefinitions(configClasses);
        // ��configClasses���뵽alreadyParsed
        alreadyParsed.addAll(configClasses);

        // ������ɺ󣬻��candidates����գ��������������ӵġ�δ��������Full��������ӵ�candidates��
        candidates.clear();
        // 5\. �����ؽ�����������ӵ���Ϊ Full ��������δ���������Ͱ�����ӵ�candidates�У����´�ѭ��ʱ�ٽ���
        // ���ע��������BeanDefinition������ �� candidateNames���бȽ�
        // ������ڵĻ���˵�����µ�BeanDefinitionע�������
        if (registry.getBeanDefinitionCount() > candidateNames.length) {
            String[] newCandidateNames = registry.getBeanDefinitionNames();
            Set<String> oldCandidateNames = new HashSet<>(Arrays.asList(candidateNames));
            Set<String> alreadyParsedClasses = new HashSet<>();
            // ѭ��alreadyParsed�����������뵽alreadyParsedClasses
            for (ConfigurationClass configurationClass : alreadyParsed) {
                alreadyParsedClasses.add(configurationClass.getMetadata().getClassName());
            }
            for (String candidateName : newCandidateNames) {
                if (!oldCandidateNames.contains(candidateName)) {
                    BeanDefinition bd = registry.getBeanDefinition(candidateName);
                    // ����¼ӵ���Ϊ�����࣬��δ���������Ͱ�����ӵ�candidates�У��ȴ��´�ѭ������
                    if (ConfigurationClassUtils
                            .checkConfigurationClassCandidate(bd, this.metadataReaderFactory) &&
                            !alreadyParsedClasses.contains(bd.getBeanClassName())) {
                        candidates.add(new BeanDefinitionHolder(bd, candidateName));
                    }
                }
            }
            candidateNames = newCandidateNames;
        }
    }

    // ʡ���뱾�������޹صĴ���
    ...
}

```

��ʽ�������Ϸ���ǰ������ȷ spring ����������ļ��������

*   �����ࣺ���� `@Configuration`��`@Component`��`@ComponentScan`��`@Import`��`@ImportResource` ������֮һע����ࣻ
*   `Full` �����ࣺ���� `@Configuration` ע���� `proxyBeanMethods != false` ���࣬`spring` ����Ϊ `Full` �����ࣻ
*   `Lite` �����ࣺ���� `@Configuration` ע���� `proxyBeanMethods == false`, ����� `@Component`��`@ComponentScan`��`@Import`��`@ImportResource` ������֮һע����࣬`spring` ����Ϊ `Lite` �����ࡣ

���Ϸ����е㳤���ܽ���������������¼����£�

1. ��ȡ���� `BeanDefinition` �������ⲽִ����ɺ󣬽�����£�

   ![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-df320c2911c4222a6867a0f0a4fe7d9987d.png)

2. ѭ�� `candidateNames` ���飬��ʶ�����������Ϊ `Full` ���� `Lite`����һ�������Ĺ������Ƕ��������Ӧ�� `BeanDefinition` ���б�ʶ�����ڱ�ʶ����ʲô���ã��ں������ `@Configuration` ע��ʱ���ٷ�������`beanConfigs` û�� `@Configuration` ע�⣬����� `Lite` �����ࡣ��һ���õ��� `configCandidates` ���£�

   ![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-81a68ec905807d77153158af4c86d48a1d3.png)

3. ���������࣬������ `@Component`��`@PropertySources`��`@ComponentScans`��`@ImportResource` ��ע���ע���࣬��������ǳ���Ҫ��������ص������

4. �����ν������࣬�� @Import ������ࡢ�������д� @Bean �ķ�����@ImportResource �������Դ��ת���� BeanDefinition�����ص� `BeanDefinitionMap` �У�

5. �����ؽ�����������ӵ���Ϊ `Full` �����࣬��δ���������Ͱ�����ӵ� `candidates` �У����´�ѭ��ʱ�ٽ�����

���Ϸ��������̾������ˣ����������Ǿ�������������Ľ�����Ҳ���������ĵ� 3 ����

### 2.4 ������`ConfigurationClassParser#parse(Set<BeanDefinitionHolder>)`

```
public void parse(Set<BeanDefinitionHolder> configCandidates) {
    // ѭ����������������
    for (BeanDefinitionHolder holder : configCandidates) {
        BeanDefinition bd = holder.getBeanDefinition();
        try {
            // ������BeanDefinition��AnnotatedBeanDefinition��ʵ��
            // ǰ��õ��� beanConfigs����AnnotatedBeanDefinition��ʵ����if��ķ�����ִ��
            if (bd instanceof AnnotatedBeanDefinition) {
                parse(((AnnotatedBeanDefinition) bd).getMetadata(), holder.getBeanName());
            }
            else if (bd instanceof AbstractBeanDefinition 
                    && ((AbstractBeanDefinition) bd).hasBeanClass()) {
                parse(((AbstractBeanDefinition) bd).getBeanClass(), holder.getBeanName());
            }
            else {
                parse(bd.getBeanClassName(), holder.getBeanName());
            }
        }
        catch (...) {
            ...
        }
    }
    this.deferredImportSelectorHandler.process();
}

/**
 * ����parse���н���
 */
protected final void parse(AnnotationMetadata metadata, String beanName) throws IOException {
    // ConfigurationClass��metadata��beanName�İ�װ��
    processConfigurationClass(new ConfigurationClass(metadata, beanName));
}

```

ǰ�洫��� `BeanConfigs` �ᱻ��װ�� `AnnotatedGenericBeanDefinition`������ `AnnotatedBeanDefinition` ��ʵ����Ȼ��ͻ���� `ConfigurationClassParser#parse(String, String)`��������ʵ��û��ʲôʵ���ԵĹ������������� `processConfigurationClass(...)` ������

```
/**
 * ������������ж���������֤�����಻�ظ�����
 * ʵ�ʸɻ���� doProcessConfigurationClass(...)
 */
protected void processConfigurationClass(ConfigurationClass configClass) throws IOException {
    // �ж��Ƿ���Ҫ������������� @Conditional ע�⣬�ж��Ƿ���������
    if (this.conditionEvaluator.shouldSkip(configClass.getMetadata() ,
             ConfigurationPhase.PARSE_CONFIGURATION)) {
        return;
    }
    ConfigurationClass existingClass = this.configurationClasses.get(configClass);
    // �ж��Ƿ���������������Ͳ������ˣ���������ݹ�ϵ����ʡ��
    if (existingClass != null) {
        ...
    }
    // SourceClass ͬǰ��� ConfigurationClass һ����Ҳ�Ƕ�metadata��beanName�İ�װ
    SourceClass sourceClass = asSourceClass(configClass);
    do {
        // doXxx(...) �������������ɻ��
        // ������ص����ݲ�Ϊ�գ�������ٴ�ѭ��
        sourceClass = doProcessConfigurationClass(configClass, sourceClass);
    }
    while (sourceClass != null);
    this.configurationClasses.put(configClass, configClass);
}

```

����������ж��������Ƿ�����ִ��������Ȼ���� `do-while` ѭ����ִ�� `doProcessConfigurationClass(...)`��ѭ�������� `doProcessConfigurationClass(...)` ���ص����ݲ�Ϊ�գ����Ǽ������¿���

### 2.5 ���������ࣺ`ConfigurationClassParser#doProcessConfigurationClass`

```
/**
 * �����������������������ķ���
 */
protected final SourceClass doProcessConfigurationClass(ConfigurationClass configClass, 
        SourceClass sourceClass) throws IOException {
    // 1\. ����� @Component ע�⣬�ݹ鴦���ڲ��࣬���Ĳ���ע
    ...

    // 2\. ����@PropertySourceע�⣬���Ĳ���ע
    ...

    // 3\. ���� @ComponentScan/@ComponentScans ע��
    // 3.1 ��ȡ�������ϵ� @ComponentScan/@ComponentScans ע��
    Set<AnnotationAttributes> componentScans = AnnotationConfigUtils.attributesForRepeatable(
            sourceClass.getMetadata(), ComponentScans.class, ComponentScan.class);
    // ���û�д���ComponentScan�����߱�@Condition�����������Ͳ��ٽ������if
    if (!componentScans.isEmpty() && !this.conditionEvaluator
            .shouldSkip(sourceClass.getMetadata(), ConfigurationPhase.REGISTER_BEAN)) {
        // ѭ������componentScans��Ҳ�����������ϵ�����@ComponentScanע�������
        for (AnnotationAttributes componentScan : componentScans) {
            // 3.2 componentScanParser.parse(...)���������componentScan�Ĳ���
            // componentScan����@ComponentScan�ϵľ������ݣ�
            // sourceClass.getMetadata().getClassName()���������������
            Set<BeanDefinitionHolder> scannedBeanDefinitions = this.componentScanParser
                    .parse(componentScan, sourceClass.getMetadata().getClassName());
            // 3.3 ѭ���õ��� BeanDefinition�������Ӧ�����������࣬�ݹ����parse(...)����
            // componentScan�����������б�@Bean��ǵķ�����������@ComponentScanע��
            for (BeanDefinitionHolder holder : scannedBeanDefinitions) {
                BeanDefinition bdCand = holder.getBeanDefinition().getOriginatingBeanDefinition();
                if (bdCand == null) {
                    bdCand = holder.getBeanDefinition();
                }
                // �ж�BeanDefinition��Ӧ�����Ƿ�Ϊ������
                if (ConfigurationClassUtils
                        .checkConfigurationClassCandidate(bdCand, this.metadataReaderFactory)) {
                    // �Եõ����࣬����parse(...)�������ٴν��н���
                    parse(bdCand.getBeanClassName(), holder.getBeanName());
                }
            }
        }
    }
    // 4\. ����@Importע�⣬���Ĳ���ע
    ...

    // 5\. ����@ImportResourceע�⣬���Ĳ���ע
    ...

    // 6\. ����@Bean��ע�⣬�����Ĳ���ע
    ...

    // 7\. ����������ĸ��࣬���� processConfigurationClass(...) ��������һ��ѭ��ʱ����
    // sourceClass.getMetadata()����������
    if (sourceClass.getMetadata().hasSuperClass()) {
        String superclass = sourceClass.getMetadata().getSuperClassName();
        if (superclass != null && !superclass.startsWith("java") &&
                !this.knownSuperclasses.containsKey(superclass)) {
            this.knownSuperclasses.put(superclass, configClass);
            return sourceClass.getSuperClass();
        }
    }
    return null;
}

/**
 * ����������ٴε���processConfigurationClass(...)�������н���
 * Ŀ���ǣ����������Ҳ�п����б�@Bean��ǵķ�����������ComponentScan��ע��
 */
protected final void parse(@Nullable String className, String beanName) throws IOException {
    Assert.notNull(className, "No bean class name for configuration class bean definition");
    MetadataReader reader = this.metadataReaderFactory.getMetadataReader(className);
    // �ֵ��� processConfigurationClass(...) ������
    processConfigurationClass(new ConfigurationClass(reader, beanName));
}

```

`ConfigurationClassParser#doProcessConfigurationClass` ����������Ƕ� `@PropertySource`��`@ComponentScan`��`@Import`��`@ImportResource`��`@Bean` ��ע�⣬�������ǽ���ע `@ComponentScan` ע��Ĵ����������£�

1.  ��ȡ�������ϵ� `@ComponentScan/@ComponentScans` ע�⣻
2.  `componentScanParser.parse(...)`��������� `componentScan` �Ĳ�����������ص������
3.  ѭ���õ��� `BeanDefinition`�������Ӧ�����������࣬�ݹ���� `parse(...)` ���������ɨ�赽������� `@Import`��`@Bean`��`@ComponentScan` ��ע�⣬�ݹ���� `parse(...)` ����ʱ�ᱻ��������

����Ĳ��������ڴ������Ѿ�ע�͵ú�����ˣ��Ͳ���˵�ˣ�����ֱ������ `@ComponentScan` �Ľ�������.

### 2.6 ���������ĵط���`ComponentScanAnnotationParser#parse`

`@ComponentScan` �Ľ����� `ComponentScanAnnotationParser#parse` �����У��������£�

```
public Set<BeanDefinitionHolder> parse(AnnotationAttributes componentScan, final String declaringClass) {
    // 1\. ����һ��ɨ����������ɨ���
    ClassPathBeanDefinitionScanner scanner = new ClassPathBeanDefinitionScanner(this.registry,
            componentScan.getBoolean("useDefaultFilters"), this.environment, this.resourceLoader);
    // 2\. �ж��Ƿ���д��Ĭ�ϵ���������
    Class<? extends BeanNameGenerator> generatorClass = componentScan.getClass("nameGenerator");
    boolean useInheritedGenerator = (BeanNameGenerator.class == generatorClass);
    scanner.setBeanNameGenerator(useInheritedGenerator ? this.beanNameGenerator :
            BeanUtils.instantiateClass(generatorClass));
    // 3\. ���� @ComponentScan ע�������
    // 3.1 ���� @ComponentScan �� scopedProxy ����
    ScopedProxyMode scopedProxyMode = componentScan.getEnum("scopedProxy");
    if (scopedProxyMode != ScopedProxyMode.DEFAULT) {
        scanner.setScopedProxyMode(scopedProxyMode);
    }
    else {
        Class<? extends ScopeMetadataResolver> resolverClass = componentScan.getClass("scopeResolver");
        scanner.setScopeMetadataResolver(BeanUtils.instantiateClass(resolverClass));
    }
    // 3.2 ���� @ComponentScan �� resourcePattern ����
    scanner.setResourcePattern(componentScan.getString("resourcePattern"));

    // 3.3 ���� @ComponentScan �� includeFilters ����
    // addIncludeFilter addExcludeFilter,��������List<TypeFilter>�����������
    for (AnnotationAttributes filter : componentScan.getAnnotationArray("includeFilters")) {
        for (TypeFilter typeFilter : typeFiltersFor(filter)) {
            scanner.addIncludeFilter(typeFilter);
        }
    }
    // 3.4 ���� @ComponentScan �� excludeFilters ����
    for (AnnotationAttributes filter : componentScan.getAnnotationArray("excludeFilters")) {
        for (TypeFilter typeFilter : typeFiltersFor(filter)) {
            scanner.addExcludeFilter(typeFilter);
        }
    }
    boolean lazyInit = componentScan.getBoolean("lazyInit");
    if (lazyInit) {
        scanner.getBeanDefinitionDefaults().setLazyInit(true);
    }
    Set<String> basePackages = new LinkedHashSet<>();
    // 3.5\. @ComponentScan ָ���� basePackages ���ԣ�������Ե�������String
    String[] basePackagesArray = componentScan.getStringArray("basePackages");
    for (String pkg : basePackagesArray) {
        String[] tokenized = StringUtils.tokenizeToStringArray(this.environment.resolvePlaceholders(pkg),
                ConfigurableApplicationContext.CONFIG_LOCATION_DELIMITERS);
        Collections.addAll(basePackages, tokenized);
    }
    // 3.6\. @ComponentScan ָ���� basePackageClasses�� ������Ե�������Class��
    //    ��ֻҪ�����⼸����ͬ���ģ��������⼸�����¼��Ķ����Ա�ɨ�赽
    for (Class<?> clazz : componentScan.getClassArray("basePackageClasses")) {
        basePackages.add(ClassUtils.getPackageName(clazz));
    }
    // 3.7 ���϶�û��ָ����Ĭ�ϻ�����������ڵİ�����Ϊɨ��·��
    if (basePackages.isEmpty()) {
        basePackages.add(ClassUtils.getPackageName(declaringClass));
    }
    // 3.8 ����ų���������Ͱ�ע�����������ų���������ִ��ƥ���ʱ�򣬻��������ų�
    scanner.addExcludeFilter(new AbstractTypeHierarchyTraversingFilter(false, false) {
        @Override
        protected boolean matchClassName(String className) {
            return declaringClass.equals(className);
        }
    });
    // 4\. ������ſ�ʼɨ�� @ComponentScan ָ���İ�
    // ɨ����ɺ󣬶Է����������࣬spring�Ὣ����ӵ�beanFactory��BeanDefinitionMap��
    return scanner.doScan(StringUtils.toStringArray(basePackages));
}

```

���Ϸ���ִ���������£�

1.  ����һ��ɨ����������ɨ���
2.  �ж��Ƿ���д��Ĭ�ϵ���������
3.  ���� `@ComponentScan` ע������ԣ�����ɨ����
    1.  ���� `@ComponentScan` �� `scopedProxy` ����
    2.  ���� `@ComponentScan` �� `resourcePattern` ����
    3.  ���� `@ComponentScan` �� `includeFilters` ����
    4.  ���� `@ComponentScan` �� `excludeFilters` ����
    5.  ���� `@ComponentScan` �� `basePackages` ���ԣ�������Ե������� `String`
    6.  ���� `@ComponentScan` �� `basePackageClasses` ���ԣ� ������Ե������� `Class`
    7.  ���û��ָ��ɨ������Ĭ�ϻ�����������ڵİ�����Ϊɨ��·��
    8.  ����ų���������Ͱ�ע�����������ų���������ִ��ƥ���ʱ�򣬻��������ų�
4.  ���� `ClassPathBeanDefinitionScanner#doScan` ���ɨ��

���գ������� `ClassPathBeanDefinitionScanner#doScan` ��������ɰ���������������������� [spring ��������֮����ɨ������](https://my.oschina.net/funcy/blog/4614071)�Ѿ���ϸ�������ˣ�����Ͳ��ٷ����ˡ�

�����ǻص� `ConfigurationClassPostProcessor#processConfigBeanDefinitions` ������

```
public void processConfigBeanDefinitions(BeanDefinitionRegistry registry) {
    ...
    parser.parse(candidates);
    ....
}

```

ִ��ǰ��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-85e400f7d45b4fe5e2353e359f034b1a726.png)

ִ�к�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-a6d02c305f562414326ca7836c281ebf472.png)

���Կ�����`BeanObj1`��`BeanObj2` �Ѿ������� `BeanFactory` �� `BeanDefinitionMap` ���� ��

### 2.7 �ܽ�

spring ���� `@ComponentScan` �����̵�����ͽ����ˣ���������λ�� `ConfigurationClassParser#doProcessConfigurationClass` ����������������˽��� `@ComponentScan`��������� `@Bean`��`@Import` ��ע�⣬����ֻ���� `@ComponentScan` �Ĵ������̣������������ܽ����£�

1.  ��ȡ�������ϵ� `@ComponentScan/@ComponentScans` ע��
2.  ���н��� `@ComponentScan` �Ĳ���������ʱ���ȶ�����һ����������Ȼ����� `@ComponentScan` �����ԣ���������������������䣬��������Щ֮�󣬾Ϳ�ʼ���а�ɨ�������
3.  ����ɨ��õ����࣬�����Ϊ�����࣬��ͨ������ `parse(...)` ������һ�ε��� `ConfigurationClassParser#doProcessConfigurationClass` ���н�������һ��ǳ���Ҫ����ͱ�֤��ɨ��õ������е� `@Bean`��`@Import`��`@ComponentScan` ��ע��õ�������

���ˣ����ľ��ȵ������ˣ���������ƪ���»�������� `ConfigurationClassPostProcessor` ������ע��Ĵ���

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4836178](https://my.oschina.net/funcy/blog/4836178) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_