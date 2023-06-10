![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-c8c446fca94a382109bdc7b6babd6db4c0d.png)

�����ģ����Ǽ���������

### 4\. ��չ�㣺`postProcessBeanFactory(beanFactory)`

������� spring �ṩ����չ�㣬�������κι��ܣ���������ʵ�֣�`AbstractApplicationContext` �� `postProcessBeanFactory` �����������£�

```
    protected void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) {
    }

```

��ǰ����ʹ�õ� `ApplicationContext` �� `AnnotationConfigApplicationContext`����û��ʵ�����������

### 5\. ִ�� `BeanFactoryPostProcessors`: `invokeBeanFactoryPostProcessors(beanFactory)`

> `BeanFactoryPostProcessor` ��Ϊ beanFactory �ĺ��ô��������޸� beanFactory ��һЩ��Ϊ������ `BeanFactoryPostProcessor` ����ϸ���������Բο� [spring ���֮ BeanFactoryPostProcessors](https://my.oschina.net/funcy/blog/4597545)��

���� `BeanFactoryPostProcessor`�������Ἰ�㣺

*   `BeanFactoryPostProcessor` ��Ϊ���֣�`BeanFactoryPostProcessor` �� `BeanDefinitionRegistryPostProcessor`
*   `BeanDefinitionRegistryPostProcessor` �� `BeanFactoryPostProcessor` ������
*   ��ִ�� `BeanDefinitionRegistryPostProcessor` �ķ�������ִ�� `BeanFactoryPostProcessor` �ķ���

�˽���Щ�����Ǹ������룬����Բ���Ҫ��������ֻ���������������£�

```
|-AnnotationConfigApplicationContext#AnnotationConfigApplicationContext(String...)
 |-AbstractApplicationContext#refresh
  |-AbstractApplicationContext#invokeBeanFactoryPostProcessors
   |-PostProcessorRegistrationDelegate
     #invokeBeanFactoryPostProcessors(ConfigurableListableBeanFactory, List<BeanFactoryPostProcessor>)

```

����ֱ�ӿ� `invokeBeanFactoryPostProcessors` ������

```
public static void invokeBeanFactoryPostProcessors(ConfigurableListableBeanFactory beanFactory, 
            List<BeanFactoryPostProcessor> beanFactoryPostProcessors) {

    // ���д��ڵ�BeanDefinitionRegistryPostProcessor������
    Set<String> processedBeans = new HashSet<>();

    //beanFactory��DefaultListableBeanFactory����BeanDefinitionRegistry��ʵ���࣬���Կ϶�����if
    if (beanFactory instanceof BeanDefinitionRegistry) {
        BeanDefinitionRegistry registry = (BeanDefinitionRegistry) beanFactory;

        //regularPostProcessors �������BeanFactoryPostProcessor
        List<BeanFactoryPostProcessor> regularPostProcessors = new ArrayList<>();

        //registryProcessors �������BeanDefinitionRegistryPostProcessor
        //BeanDefinitionRegistryPostProcessor ��չ�� BeanFactoryPostProcessor
        List<BeanDefinitionRegistryPostProcessor> registryProcessors = new ArrayList<>();

        // ѭ����������beanFactoryPostProcessors����������£�beanFactoryPostProcessors�϶�û������
        // ��ΪbeanFactoryPostProcessors�ǻ���ֶ���ӵģ�������springɨ���
        // ֻ���ֶ�����annotationConfigApplicationContext.addBeanFactoryPostProcessor(XXX)�Ż�������
        for (BeanFactoryPostProcessor postProcessor : beanFactoryPostProcessors) {
            // �ж�postProcessor�ǲ���BeanDefinitionRegistryPostProcessor��
            // ��ΪBeanDefinitionRegistryPostProcessor ��չ��BeanFactoryPostProcessor��
            // ����������Ҫ�ж��ǲ���BeanDefinitionRegistryPostProcessor, �ǵĻ���ֱ��ִ��
            // postProcessBeanDefinitionRegistry������Ȼ��Ѷ���װ��registryProcessors����ȥ
            if (postProcessor instanceof BeanDefinitionRegistryPostProcessor) {
                BeanDefinitionRegistryPostProcessor registryProcessor =
                        (BeanDefinitionRegistryPostProcessor) postProcessor;
                registryProcessor.postProcessBeanDefinitionRegistry(registry);
                registryProcessors.add(registryProcessor);
            }
            else {
                //���ǵĻ�����װ��regularPostProcessors
                regularPostProcessors.add(postProcessor);
            }
        }

        // һ����ʱ����������װ��BeanDefinitionRegistryPostProcessor
        // BeanDefinitionRegistry�̳���PostProcessorBeanFactoryPostProcessor
        List<BeanDefinitionRegistryPostProcessor> currentRegistryProcessors = new ArrayList<>();

        // ���ʵ��BeanDefinitionRegistryPostProcessor�ӿڵ����BeanName
        // ���������spring�ڲ��ṩ��BeanDefinitionRegistryPostProcessor
        // �Լ��������Լ�ʵ�ֵ�BeanDefinitionRegistryPostProcessor
        String[] postProcessorNames =
            beanFactory.getBeanNamesForType(BeanDefinitionRegistryPostProcessor.class, true, false);
        for (String ppName : postProcessorNames) {
            if (beanFactory.isTypeMatch(ppName, PriorityOrdered.class)) {
               //���ConfigurationClassPostProcessor�࣬���ҷŵ�currentRegistryProcessors
               //ConfigurationClassPostProcessor�Ǻ���Ҫ��һ���࣬��ʵ����
               //BeanDefinitionRegistryPostProcessor�ӿڣ�
               //BeanDefinitionRegistryPostProcessor�ӿ���ʵ����BeanFactoryPostProcessor�ӿ�
               //ConfigurationClassPostProcessor�Ǽ�����Ҫ����, ����ִ����
               //ɨ�� @Bean��@Import��@ImportResource �ȸ��ֲ���
               currentRegistryProcessors.add(beanFactory.getBean(
                   ppName, BeanDefinitionRegistryPostProcessor.class));
               processedBeans.add(ppName);
            }
        }

       //��������
       sortPostProcessors(currentRegistryProcessors, beanFactory);

       //�ϲ�Processors��ΪʲôҪ�ϲ�����ΪregistryProcessors��
       //װ��BeanDefinitionRegistryPostProcessor��
       //һ��ʼ��ʱ��springֻ��ִ��BeanDefinitionRegistryPostProcessor���еķ���
       //������ִ��BeanDefinitionRegistryPostProcessor����ķ�������BeanFactoryProcessor�ķ���
       //����������Ҫ�Ѵ���������һ�������У�����ͳһִ�и���ķ���
       registryProcessors.addAll(currentRegistryProcessors);

       //�������Ϊִ��ConfigurationClassPostProcessor��postProcessBeanDefinitionRegistry����
       invokeBeanDefinitionRegistryPostProcessors(currentRegistryProcessors, registry);
       //��ΪcurrentRegistryProcessors��һ����ʱ������������Ҫ���
       currentRegistryProcessors.clear();

       // �ٴθ���BeanDefinitionRegistryPostProcessor���BeanName��
       // �����BeanName�Ƿ��Ѿ���ִ�й��ˣ���û��ʵ��Ordered�ӿ�
       // ���û�б�ִ�й���Ҳʵ����Ordered�ӿڵĻ����Ѷ������͵�currentRegistryProcessors��
       // �������͵�processedBeans
       // ���û��ʵ��Ordered�ӿڵĻ������ﲻ�����ݼӵ�currentRegistryProcessors��
       // processedBeans�У�������������
       // ����ſ��Ի�����Ƕ����ʵ����BeanDefinitionRegistryPostProcessor��Bean
       postProcessorNames = beanFactory.getBeanNamesForType(
              BeanDefinitionRegistryPostProcessor.class, true, false);
       for (String ppName : postProcessorNames) {
           if (!processedBeans.contains(ppName) && beanFactory.isTypeMatch(ppName, Ordered.class)) {
              currentRegistryProcessors.add(beanFactory.getBean(
                  ppName, BeanDefinitionRegistryPostProcessor.class));
              processedBeans.add(ppName);
           }
       }
       //��������
       sortPostProcessors(currentRegistryProcessors, beanFactory);
       //�ϲ�Processors
       registryProcessors.addAll(currentRegistryProcessors);
       //ִ�������Զ����BeanDefinitionRegistryPostProcessor
       invokeBeanDefinitionRegistryPostProcessors(currentRegistryProcessors, registry);
       //�����ʱ����
       currentRegistryProcessors.clear();
       // ����Ĵ�����ִ����ʵ����Ordered�ӿڵ�BeanDefinitionRegistryPostProcessor��
       // ����Ĵ������ִ��û��ʵ��Ordered�ӿڵ�BeanDefinitionRegistryPostProcessor
       boolean reiterate = true;
       while (reiterate) {
           reiterate = false;
           postProcessorNames = beanFactory.getBeanNamesForType(
                    BeanDefinitionRegistryPostProcessor.class, true, false);
           for (String ppName : postProcessorNames) {
                if (!processedBeans.contains(ppName)) {
                    currentRegistryProcessors.add(beanFactory.getBean(
                            ppName, BeanDefinitionRegistryPostProcessor.class));
                    processedBeans.add(ppName);
                    reiterate = true;
                }
           }
           sortPostProcessors(currentRegistryProcessors, beanFactory);
           registryProcessors.addAll(currentRegistryProcessors);
           invokeBeanDefinitionRegistryPostProcessors(currentRegistryProcessors, registry);
           currentRegistryProcessors.clear();
       }

       // registryProcessors����װ��BeanDefinitionRegistryPostProcessor
       // ����Ĵ�����ִ��������еķ�����������Ҫ�ٰѸ���ķ���Ҳִ��һ��
       invokeBeanFactoryPostProcessors(registryProcessors, beanFactory);
       invokeBeanFactoryPostProcessors(regularPostProcessors, beanFactory);
    }

    else {
        //regularPostProcessorsװ��BeanFactoryPostProcessor��ִ��BeanFactoryPostProcessor�ķ���
        //����regularPostProcessorsһ������£��ǲ��������ݵģ�
        //ֻ���������ֶ����BeanFactoryPostProcessor���Ż�������
        invokeBeanFactoryPostProcessors(beanFactoryPostProcessors, beanFactory);
    }

    String[] postProcessorNames =
            beanFactory.getBeanNamesForType(BeanFactoryPostProcessor.class, true, false);

    List<BeanFactoryPostProcessor> priorityOrderedPostProcessors = new ArrayList<>();
    List<String> orderedPostProcessorNames = new ArrayList<>();
    List<String> nonOrderedPostProcessorNames = new ArrayList<>();
    //ѭ��BeanName����
    for (String ppName : postProcessorNames) {
        //������Bean��ִ�й��ˣ�����
        if (processedBeans.contains(ppName)) {

        }
        //���ʵ����PriorityOrdered�ӿڣ����뵽priorityOrderedPostProcessors
        else if (beanFactory.isTypeMatch(ppName, PriorityOrdered.class)) {
            priorityOrderedPostProcessors.add(beanFactory
                .getBean(ppName, BeanFactoryPostProcessor.class));
        }
        //���ʵ����Ordered�ӿڣ����뵽orderedPostProcessorNames
        else if (beanFactory.isTypeMatch(ppName, Ordered.class)) {
            orderedPostProcessorNames.add(ppName);
        }
        //�����û��ʵ��PriorityOrdered��Ҳû��ʵ��Ordered�����뵽nonOrderedPostProcessorNames
        else {
            nonOrderedPostProcessorNames.add(ppName);
        }
    }

    // ������priorityOrderedPostProcessors����ʵ����PriorityOrdered�ӿڵ�BeanFactoryPostProcessor
    sortPostProcessors(priorityOrderedPostProcessors, beanFactory);

    // ִ��priorityOrderedPostProcessors
    invokeBeanFactoryPostProcessors(priorityOrderedPostProcessors, beanFactory);

    // ִ��ʵ����Ordered�ӿڵ�BeanFactoryPostProcessor
    List<BeanFactoryPostProcessor> orderedPostProcessors 
            = new ArrayList<>(orderedPostProcessorNames.size());
    for (String postProcessorName : orderedPostProcessorNames) {
        orderedPostProcessors.add(beanFactory.getBean(
            postProcessorName, BeanFactoryPostProcessor.class));
    }
    sortPostProcessors(orderedPostProcessors, beanFactory);
    invokeBeanFactoryPostProcessors(orderedPostProcessors, beanFactory);

    // ִ�м�û��ʵ��PriorityOrdered�ӿڣ�Ҳû��ʵ��Ordered�ӿڵ�BeanFactoryPostProcessor
    List<BeanFactoryPostProcessor> nonOrderedPostProcessors 
            = new ArrayList<>(nonOrderedPostProcessorNames.size());
    for (String postProcessorName : nonOrderedPostProcessorNames) {
        nonOrderedPostProcessors.add(beanFactory.getBean(
                postProcessorName, BeanFactoryPostProcessor.class));
    }
    invokeBeanFactoryPostProcessors(nonOrderedPostProcessors, beanFactory);

    beanFactory.clearMetadataCache();
}

```

��������ǳ��ǳ�������������������ѣ�ִ��������ѭ�⼸������

*   ��ִ�� `BeanDefinitionRegistryPostProcessor`����ִ�� `BeanFactoryPostProcessor`
*   ִ�� `BeanDefinitionRegistryPostProcessor` ��˳�����£�
    1.  ִ�в�������� `BeanDefinitionRegistryPostProcessor`
    2.  ִ�� spring �ڲ��ṩ�ģ������ִ��һ���ǳ���Ҫ�� `BeanDefinitionRegistryPostProcessor`����`ConfigurationClassPostProcessor`�����ᴦ����Ŀ�е� `@ComponentScan`��`@Component`��`@Import`��`@Bean` ��ע�⣬�����û��Զ���� `BeanDefinitionRegistryPostProcessor`��`BeanFactoryPostProcessor`
    3.  ִ��ʣ�µ� `BeanDefinitionRegistryPostProcessor`��Ҳ��������һ���м��ص��� `BeanDefinitionRegistryPostProcessor`
*   ִ�� `BeanFactoryPostProcessor` ��˳�����£�
    1.  ִ��ʵ���� `PriorityOrdered` �ӿڵ� `BeanFactoryPostProcessor`
    2.  ִ��ʵ���� `Ordered` �ӿڵ� `BeanFactoryPostProcessor`
    3.  ִ��ʣ�µ� `BeanFactoryPostProcessor`
*   `BeanDefinitionRegistryPostProcessor` �� `BeanFactoryPostProcessor` �����࣬ͬ��Ҫִ�� `BeanFactoryPostProcessor` �ķ���

����˵��ִ�� `BeanDefinitionRegistryPostProcessor`����ִָ�� `PostProcessorRegistrationDelegate#invokeBeanDefinitionRegistryPostProcessors`��ִ�� `BeanFactoryPostProcessor` ��ִָ�� `BeanFactoryPostProcessor#postProcessBeanFactory`

����������ݺ󣬽��������Ƕ����Ϸ�������ϸ�����ˣ�

1.  ִ�� `BeanDefinitionRegistryPostProcessor#postProcessBeanDefinitionRegistry`:
    1.  ִ�п������ֶ����� `applicationContext.addBeanFactoryPostProcessor` ��ӵ� `BeanDefinitionRegistryPostProcessor` �� `postProcessBeanDefinitionRegistry` ������һ������£������߲����ֶ����ø÷�����;
    2.  ִ�� spring �ڲ��ṩ�ġ�ʵ���� `PriorityOrdered` �ӿڵ� `BeanDefinitionRegistryPostProcessor` �� `postProcessBeanDefinitionRegistry` ������
    3.  ִ��ʵ���� `Ordered` �ӿ���δִ�й��� `BeanDefinitionRegistryPostProcessor` �� `postProcessBeanDefinitionRegistry` ������
    4.  ִ������δִ�й��� `BeanDefinitionRegistryPostProcessor` �� `postProcessBeanDefinitionRegistry` ������
2.  ִ�� `BeanFactoryPostProcessor#postProcessBeanFactory` ������
    1.  ִ�п����ߵ��� `applicationContext.addBeanFactoryPostProcessor` ��ӵ� `BeanDefinitionRegistryPostProcessor` �� `postProcessBeanFactory` ������һ������£������߲����ֶ����ø÷�����;
    2.  ִ�����ϴ�δִ�й��ġ�ʵ���� `PriorityOrdered` �� `BeanFactoryPostProcessor` �� `postProcessBeanFactory` ������
    3.  ִ�����ϴ�δִ�й��ġ�ʵ���� `Ordered` �� `BeanFactoryPostProcessor` �� `postProcessBeanFactory` ������
    4.  ִ�����ϴ�δִ�й��� `BeanFactoryPostProcessor` �� `postProcessBeanFactory` ����

���Կ������������ʵ�ʾ���Ϊ��ִ������������`BeanDefinitionRegistryPostProcessor#postProcessBeanDefinitionRegistry` �� `BeanFactoryPostProcessor#postProcessBeanFactory`����Ҫע����ǣ�`BeanDefinitionRegistryPostProcessor` �� `BeanFactoryPostProcessor` �����࣬�ڵ��� `BeanFactoryPostProcessor#postProcessBeanFactory` ʱ ��ʵ����Ҳ������ `BeanDefinitionRegistryPostProcessor` �� `postProcessBeanFactory` ����.

�����ϵ� `BeanDefinitionRegistryPostProcessor#postProcessBeanDefinitionRegistry` �� `BeanFactoryPostProcessor#postProcessBeanFactory` ִ���У�����ִ������Щ�����أ���������ͨ������ `demo01`������ִ�еĴ������£�

1.  �� `1.2` ����ʱ��ִ���� `ConfigurationClassPostProcessor#postProcessBeanDefinitionRegistry`
2.  �� `1.4` ����ʱ��ִ���� `ConfigurationClassPostProcessor#postProcessBeanFactory`
3.  �� `2.4` ����ʱ��ִ���� `EventListenerMethodProcessor#postProcessBeanFactory`

���ţ����Ǳ������������������չ����������������ʲô��

#### 5.1 `ConfigurationClassPostProcessor#postProcessBeanDefinitionRegistry` ��ִ������

����һ����ȥ���Բ���Ҫ�ķ���ֻ��ʾ����ջ��

```
AnnotationConfigApplicationContext#AnnotationConfigApplicationContext(java.lang.String...)
 |-AbstractApplicationContext#refresh
  |-AbstractApplicationContext#invokeBeanFactoryPostProcessors
   |-PostProcessorRegistrationDelegate
      #invokeBeanFactoryPostProcessors(ConfigurableListableBeanFactory, List)
    |-PostProcessorRegistrationDelegate#invokeBeanDefinitionRegistryPostProcessors
     |-ConfigurationClassPostProcessor#postProcessBeanDefinitionRegistry
      |-ConfigurationClassPostProcessor#processConfigBeanDefinitions

```

����ֱ�ӽ��� `ConfigurationClassPostProcessor#processConfigBeanDefinitions`��

```
public void processConfigBeanDefinitions(BeanDefinitionRegistry registry) {
    List<BeanDefinitionHolder> configCandidates = new ArrayList<>();
    String[] candidateNames = registry.getBeanDefinitionNames();

    //ѭ��candidateNames����
    for (String beanName : candidateNames) {
    BeanDefinition beanDef = registry.getBeanDefinition(beanName);

    // �ڲ����������λ������Ƿ��Ѿ��������
    // ���������һ����֪ʶä��
    // ������ע���������ʱ�򣬿��Բ���Configurationע�⣬
    // ֱ��ʹ��Component ComponentScan Import ImportResourceע�⣬��֮ΪLite������
    // �������Configurationע�⣬�ͳ�֮ΪFull������
    // �������ע����Lite�����࣬����getBean��������࣬�ᷢ��������ԭ�����Ǹ�������
    // �������ע����Full�����࣬����getBean��������࣬�ᷢ�����Ѿ�����ԭ���Ǹ��������ˣ�
    // �����Ѿ���cgilb���������
    if (beanDef.getAttribute(ConfigurationClassUtils.CONFIGURATION_CLASS_ATTRIBUTE) != null) {
            if (logger.isDebugEnabled()) {
                logger.debug(...);
            }
        }
        // �ж��Ƿ�Ϊ�����࣬��������������
       // 1\. ���� @Configuration ע�� �� proxyBeanMethods != false ���࣬spring ����Ϊ Full ������
       // 2\. ���� @Configuration ע�� �� proxyBeanMethods == false,
       // �� ���� @Component��@ComponentScan��@Import��@ImportResource��
       // @Bean ����֮һע����࣬spring ����Ϊ Lite ������
       // Full��Lite��beanDef����б�ʶ
       else if (ConfigurationClassUtils
               .checkConfigurationClassCandidate(beanDef, this.metadataReaderFactory)) {
           configCandidates.add(new BeanDefinitionHolder(beanDef, beanName));
       }
    }

    // ���û�������ֱ࣬�ӷ���
    if (configCandidates.isEmpty()) {
         return;
    }

    // ��������
    configCandidates.sort((bd1, bd2) -> {
         int i1 = ConfigurationClassUtils.getOrder(bd1.getBeanDefinition());
         int i2 = ConfigurationClassUtils.getOrder(bd2.getBeanDefinition());
         return Integer.compare(i1, i2);
    });

    SingletonBeanRegistry sbr = null;
    // DefaultListableBeanFactory���ջ�ʵ��SingletonBeanRegistry�ӿڣ����Կ��Խ��뵽���if
    if (registry instanceof SingletonBeanRegistry) {
        sbr = (SingletonBeanRegistry) registry;
        if (!this.localBeanNameGeneratorSet) {
            //spring�п����޸�Ĭ�ϵ�bean������ʽ��������ǿ��û���û���Զ���bean������ʽ
            BeanNameGenerator generator = (BeanNameGenerator) sbr.getSingleton(
                     AnnotationConfigUtils.CONFIGURATION_BEAN_NAME_GENERATOR);
            if (generator != null) {
                this.componentScanBeanNameGenerator = generator;
                this.importBeanNameGenerator = generator;
            }
        }
    }

    if (this.environment == null) {
         this.environment = new StandardEnvironment();
    }

    ConfigurationClassParser parser = new ConfigurationClassParser(
            this.metadataReaderFactory, this.problemReporter, this.environment,
            this.resourceLoader, this.componentScanBeanNameGenerator, registry);

    Set<BeanDefinitionHolder> candidates = new LinkedHashSet<>(configCandidates);
    Set<ConfigurationClass> alreadyParsed = new HashSet<>(configCandidates.size());
    do {
        //���������࣬��������˺ܶ��£�
        //�磺��@Component��@PropertySources��@ComponentScans��@ImportResource�ȵĴ���
        parser.parse(candidates);
        parser.validate();

        Set<ConfigurationClass> configClasses
                = new LinkedHashSet<>(parser.getConfigurationClasses());
        configClasses.removeAll(alreadyParsed);

        if (this.reader == null) {
            this.reader = new ConfigurationClassBeanDefinitionReader(
                registry, this.sourceExtractor, this.resourceLoader, this.environment,
                this.importBeanNameGenerator, parser.getImportRegistry());
        }
        // ֱ����һ���Ű�Import���࣬@Bean @ImportRosource ת����BeanDefinition
        this.reader.loadBeanDefinitions(configClasses);
        // ��configClasses���뵽alreadyParsed
        alreadyParsed.addAll(configClasses);

        candidates.clear();
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
    while (!candidates.isEmpty());

    if (sbr != null && !sbr.containsSingleton(IMPORT_REGISTRY_BEAN_NAME)) {
        sbr.registerSingleton(IMPORT_REGISTRY_BEAN_NAME, parser.getImportRegistry());
    }

    if (this.metadataReaderFactory instanceof CachingMetadataReaderFactory) {
        ((CachingMetadataReaderFactory) this.metadataReaderFactory).clearCache();
    }
}

```

���Ϸ������Ƕ� `BeanDefinition` ��Ϣ�Ľ�һ�����ƣ������� `@Configuration`��`@PropertySources`��`@ComponentScans`��`@ImportResource` �ȵĴ������� demo01 û����Щע�⣬�������ǾͲ�չ���ˣ����������ٷ�����

#### 5.2 ִ�� `ConfigurationClassPostProcessor#postProcessBeanFactory` ������

`ConfigurationClassPostProcessor` �� `postProcessBeanFactory` �����Ƚϼ򵥣��������»��Ƕ� `@Configuration` ����ǿ��

```
@Override
public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) {
    // ʡ����������

    // �� ConfigurationClasses ����ǿ
    enhanceConfigurationClasses(beanFactory);
    beanFactory.addBeanPostProcessor(new ImportAwareBeanPostProcessor(beanFactory));
}

public void enhanceConfigurationClasses(ConfigurableListableBeanFactory beanFactory) {
    // ʡ����������

    // ȫ�����ࣺ�������
    ConfigurationClassEnhancer enhancer = new ConfigurationClassEnhancer();
    for (Map.Entry<String, AbstractBeanDefinition> entry : configBeanDefs.entrySet()) {
        AbstractBeanDefinition beanDef = entry.getValue();
        // If a @Configuration class gets proxied, always proxy the target class
        beanDef.setAttribute(AutoProxyUtils.PRESERVE_TARGET_CLASS_ATTRIBUTE, Boolean.TRUE);
        // Set enhanced subclass of the user-specified bean class
        // �����������ǿ��
        Class<?> configClass = beanDef.getBeanClass();
        Class<?> enhancedClass = enhancer.enhance(configClass, this.beanClassLoader);
        if (configClass != enhancedClass) {
            beanDef.setBeanClass(enhancedClass);
        }
    }
}

```

���� demo01 û������ `@Configuration`������Ͳ�չ���ˣ����������ٷ�����

#### 5.3 ִ�� `EventListenerMethodProcessor#postProcessBeanFactory` ������

������������������¼��������ģ�����ֱ���ϴ��룺

```
@Override
public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) {
    this.beanFactory = beanFactory;
    Map<String, EventListenerFactory> beans 
          = beanFactory.getBeansOfType(EventListenerFactory.class, false, false);

    List<EventListenerFactory> factories = new ArrayList<>(beans.values());
    AnnotationAwareOrderComparator.sort(factories);
    this.eventListenerFactories = factories;
}

```

���Կ���������� spring �����У��ó������е� `EventListenerFactory`��Ȼ��ֵ�� `this.eventListenerFactories`������Ͳ�չ���ˡ�

#### 5.4 �ܽ�

���Ľ����� `invokeBeanFactoryPostProcessors` ��ִ�����̣���������������Ϊ��ִ������������`BeanDefinitionRegistryPostProcessor#postProcessBeanDefinitionRegistry` �� `BeanFactoryPostProcessor#postProcessBeanFactory`��������������ִ�й������£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-b6188601112b2b2c031b0a70f64f2cc885f.png)

ͨ�����Է��֣�`invokeBeanFactoryPostProcessors` һ��ִ���� `BeanFactoryPostProcessor`��

1.  `ConfigurationClassPostProcessor#postProcessBeanDefinitionRegistry`
2.  `ConfigurationClassPostProcessor#postProcessBeanFactory`
3.  `EventListenerMethodProcessor#postProcessBeanFactory`

���У�`ConfigurationClassPostProcessor` ��һ���ǳ��ǳ���Ҫ�� `BeanFactoryPostProcessor`���������Ľ�һ���������Բο��������£�

*   [spring ̽��֮ ConfigurationClassPostProcessor ֮���� @ComponentScan ע��](https://my.oschina.net/funcy/blog/4836178)
*   [spring ̽��֮ ConfigurationClassPostProcessor ֮���� @Bean ע��](https://my.oschina.net/funcy/blog/4492878)
*   [spring ̽��֮ ConfigurationClassPostProcessor ֮���� @Import ע��](https://my.oschina.net/funcy/blog/4678152)
*   [spring ̽��֮ ConfigurationClassPostProcessor ֮���� @Conditional ע��](https://my.oschina.net/funcy/blog/4873444)

*   * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4641114](https://my.oschina.net/funcy/blog/4641114) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_